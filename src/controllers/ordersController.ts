import * as mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';

import collections from '../repositories/collections';
import orders from '../repositories/orders';
import ordersModel from '../models/orders';
import prices from '../repositories/prices';
import events from '../repositories/events';
import nftSchema from '../schemas/nft_schema';

import { ICreateOrderRequest, IGetOrderRequest, IOrder } from '../interface/interface';
import { ethers } from 'ethers';
import { encodeOrderParams } from '../utils/orders';

export default class OrdersController {
  constructor() { }

  /**
   * Get Order Function
   * @param isOrderAsk: Specifies whether the order is ask or bid, true/false
   * @param collection: Collection contract address. Must be a valid Ethereum address.
   * @param tokenId: Id of the specific token
   * @param signer: Signer address. Must be a valid Ethereum address.
   * @param strategy: Strategy contract address.
   * @param currency: Address of the payment token.
   * @param price: Price range for offers to filter by
   * {
   *    "min": "4100",
   *    "max": "8000"
   * }
   * @param startTime: Start timestamp. This accepts the string representation of the timestamp in seconds.
   * @param endTime: End timestamp. This accepts the string representation of the timestamp in seconds.
   * @param status: Order statuses to filter by. This can be a group of multiple statuses, which will be applied OR. CANCELLED, EXECUTED, EXPIRED, VALID
   * @param pagination: Pagination filter. When specified, it will return orders starting from the order with hash of cursor, with first amount. cursor represents the order hash. Default to 20, max to 50.
   * {
   *    "first": 10,
   *    "from": 12
   * }
   * @param sort: Sort by option. EXPIRING_SOON, NEWEST, PRICE_ASC, PRICE_DESC
   * @param chain: Chain of the collection
   */

  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const getOrderRequest: IGetOrderRequest = req.query as any;

    let filters = new Array;
    let first = 20;
    let from = 0;

    if ( getOrderRequest.isOrderAsk ) {
        filters.push({isOrderAsk: getOrderRequest.isOrderAsk});
    }
    if ( getOrderRequest.collection ) {
        filters.push({collectionAddress: getOrderRequest.collection});
    }
    if ( getOrderRequest.tokenId ) {
        filters.push({tokenId: getOrderRequest.tokenId});
    }
    if ( getOrderRequest.strategy ) {
        filters.push({strategy: getOrderRequest.strategy});
    }
    if ( getOrderRequest.currency ) {
        filters.push({currency: getOrderRequest.currency});
    }
    if ( getOrderRequest.price && getOrderRequest.price.min > 0 ) {
        filters.push({price: {$gte: getOrderRequest.price.min}});
    }
    if ( getOrderRequest.price && getOrderRequest.price.max > 0 ) {
        filters.push({price: {$lte: getOrderRequest.price.max}});
    }
    if ( getOrderRequest.startTime ) {
        filters.push({startTime: {$lte: getOrderRequest.startTime}});
    }
    if ( getOrderRequest.endTime ) {
        filters.push({endTime: {$gte: getOrderRequest.endTime}});
    }
    if ( getOrderRequest.status?.length > 0 ) {
        filters.push({status: {$in: getOrderRequest.status}});
    }
    if ( getOrderRequest.chain ) {
        filters.push({chain: getOrderRequest.chain});
    }
    if ( getOrderRequest.nonce ) {
        filters = [{nonce: getOrderRequest.nonce}];
    }
    if ( getOrderRequest.signer ) {
        filters.push({signer: getOrderRequest.signer});
    }
    if ( getOrderRequest.pagination && getOrderRequest.pagination.first ) {
        first = getOrderRequest.pagination.first;
    }
    if ( getOrderRequest.pagination && getOrderRequest.pagination.from ) {
        from = getOrderRequest.pagination.from;
    }

    let sorting = '_id';
    if ( getOrderRequest.sort == 'EXPIRING_SOON' ) {
        sorting = 'endTime';
    }
    else if ( getOrderRequest.sort == 'NEWEST' ) {
        sorting = '-createdAt';
    }
    else if ( getOrderRequest.sort == 'OLDEST' ) {
        sorting = 'createdAt';
    }
    else if ( getOrderRequest.sort == 'UPDATE_NEWEST' ) {
        sorting = '-updatedAt';
    }
    else if ( getOrderRequest.sort == 'UPDATE_OLDEST' ) {
        sorting = 'updatedAt';
    }
    else if ( getOrderRequest.sort == 'PRICE_ASC' ) {
        sorting = 'price';
    }
    else if ( getOrderRequest.sort == 'PRICE_DESC' ) {
        sorting = '-price';
    }

    if ( getOrderRequest.status?.length == undefined ) {
        return res.status(400).json({
            'success': false,
            'name': 'Request Error',
            'message': 'Each value in status must be one of the following values: CANCELLED, EXECUTED, EXPIRED, VALID'
        });
    }

    try {
        // console.log(filters)
        const filteredOrders = await orders.getOrders(filters, sorting, from, first);
        return res.json({
            'success': true,
            'message': null,
            'data': filteredOrders,
        });
    } catch (error) {
        apiErrorHandler(error, req, res, 'Get Orders failed.');
    }
  }

  makeOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createOrderRequest: ICreateOrderRequest = req.body;

        const order = await orders.createOrder(createOrderRequest);
        // const collection = await collections.getCollectionByAddress(createOrderRequest.chain, createOrderRequest.collection)

        // const nftModel = mongoose.model(collection?.col_name as string, nftSchema, collection?.col_name as string)
        // const nft = await nftModel.findOne({token_id: createOrderRequest.tokenId});

        // const event = await events.createEvent(createOrderRequest.signer, '', "LIST", collection._id, nft._id, order._id)
        return res.json({
            'success': true,
            'message': null,
            'data': order,
        });
    } catch (err: any) {
        apiErrorHandler(err, req, res, `Post Orders failed. (${err.reason})`);
    }
  }

  changeOrderStatus = async (req, res) => {
    const { hash, tokenId, status } = req.body.params;

    try {
        const updatedOrder: IOrder = await orders.updateOrderStatus(hash, status) as any;

        const filters: Array<any> = [];
        const sorting = '_id';
        filters.push({isOrderAsk: true});
        filters.push({tokenId: tokenId});
        filters.push({status: 'VALID'});
        const filteredOrders = await orders.getOrders(filters, sorting, 0, 100);
        for (let i = 0; i < filteredOrders.length; i++) {
            const order = new ordersModel(filteredOrders[i]);
            order.remove();
        }
        return res.json({
            'success': true,
            'message': null,
            'data': updatedOrder
        });
    } catch (error) {
        apiErrorHandler(error, req, res, 'Get User Nonce failed.');
    }
  }

  takerBid = async (args) => {
    const { orderHash } = args;
    await orders.updateOrderStatus(orderHash, 'EXECUTED');
    return;
  }
}
