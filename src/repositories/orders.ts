import { ICreateOrderRequest, IOrder } from '../interface/interface';
import orders from '../models/orders';
import { ethers } from 'ethers';
import { encodeOrderParams } from '../utils/orders';

class OrdersRepository {
    constructor() {}

    getVolumeInfo = async (
        chain: String,
        address: String,
        date?: Date
    ) => {
        let filters;
        if ( date ) {
            filters = [
                {'status': 'EXECUTED'},
                {'srcChain': chain},
                {'collectionAddr': address},
                {updatedAt: {$gte: date}}
            ];
        } else {
            filters = [
                {'status': 'EXECUTED'},
                {'srcChain': chain},
                {'collectionAddr': address},
            ];
        }
        return orders.aggregate([
            {
                $match: {
                    $and: filters
                }
            },
            { $group:
                {
                    _id: null,
                    count: { $sum: 1 },
                    volume: { $sum: '$volume' },
                }
            }]
        );
    }

    getChartInfo = async (
        chain: String,
        address: String,
        date: Date
    ) => {
        return orders.aggregate([
            {
                $match: {
                    $and: [
                        {'status': 'EXECUTED'},
                        {'srcChain': chain},
                        {'collectionAddr': address},
                        {'updatedAt': {$gte: date}}
                    ]
                }
            },
            { $group:
                {
                    _id : { day: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } } },
                    count: {$sum: 1},
                    volume: { $sum: '$volume' },
                }
            }]
        );
    }

    getAsk = async (
        chain: string,
        collection: string,
        tokenId: string,
    ) => {
        const filters = new Array();
        filters.push({ chain: chain });
        filters.push({ collectionAddress: collection });
        filters.push({ tokenId: tokenId });
        return orders.findOne({ '$and': filters }).sort('price');
    }

    getOrders = async (
        filters: Array<Object>,
        sorting: string,
        from: number,
        first: number,
    ) => {
        return orders.find({ '$and': filters }).sort(sorting).sort('_id');
    }



    computeOrderHash = (order: ICreateOrderRequest) => {
        const types = [
            'bytes32',
            'bool',
            'address',
            'address',
            'uint256',
            'uint256',
            'uint256',
            'address',
            'address',
            'uint256',
            'uint256',
            'uint256',
            'uint256',
            'bytes32',
        ];
        const MAKER_ORDER_HASH = '0x40261ade532fa1d2c7293df30aaadb9b3c616fae525a0b56d3d411c841a85028';

        const params = encodeOrderParams(order.params);

        const values = [
            MAKER_ORDER_HASH, // maker order hash (from Solidity)
            order.isOrderAsk,
            order.signer,
            order.collection,
            order.price,
            order.tokenId,
            order.amount,
            order.strategy,
            order.currency,
            order.nonce,
            order.startTime,
            order.endTime,
            order.minPercentageToAsk,
            ethers.utils.keccak256(params.encodedParams),
        ];

        return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(types, values));
    }

    createOrder = async (
        data: ICreateOrderRequest
    ) => {
        const vrs = ethers.utils.splitSignature(data.signature);
        const hash = this.computeOrderHash(data);

        const askWithoutHash: IOrder = {
            hash,
            isOrderAsk: data.isOrderAsk,
            signer: data.signer,
            collectionAddress: data.collection,
            price: data.price,
            tokenId: data.tokenId,
            chain: data.chain,
            amount: data.amount,
            strategy: data.strategy,
            currencyAddress: data.currency,
            nonce: data.nonce,
            startTime: data.startTime,
            endTime: data.endTime,
            minPercentageToAsk: data.minPercentageToAsk,
            signature: data.signature,
            params: data.params,
            status: 'VALID',
            ...vrs,
        };

        const order = new orders(askWithoutHash);
        return order.save();
    }

    getUserNonce = async (
        address: string
    ) => {
        return orders.findOne({ signer: address })
        .sort('-nonce');
    }

    updateOrderStatus = async (
        _id: string,
        status: string
    ) => {
        return orders.findOneAndUpdate({hash: _id}, {
            $set: { 'status': status, 'signature': null, 'v': null, 'r': null, 's': null },
        }, {
            new: true
        });
    }
}

export default new OrdersRepository();
