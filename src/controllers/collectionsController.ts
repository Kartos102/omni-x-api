import * as mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import fetch from 'node-fetch'

import collectionsModel from '../models/collections';
import collections from '../repositories/collections';
import nftSchema from '../schemas/nft_schema';
import orders from '../repositories/orders';
import prices from '../repositories/prices';
import {
    alchemy_getNFTOwnerCntFromCollection,
    alchemy_getUserNFTs,
    alchemy_getTokenOwners,
    ALCHEMY_SUPPORTED_NETWORKS
} from '../services/alchemy';
import { ICollection } from '../interface/interface';
import { NETWORK_TYPE } from '../utils/enums';
import { getNFTOwnerCntFromCollection, getTokenOwners, MORALIS_SUPPORTED_NETWORKS } from '../services/moralis';
const ObjectId = require('mongodb').ObjectID;

export default class CollectionsController {
    constructor() {
    }

    /**
     * Get Collection Function
     */
    getCollection = async (req: Request, res: Response, next: NextFunction) => {
        const {chain, address} = req.body;

        try {
            const collection = await collections.getCollectionByAddress(chain, address);

            res.json({'success': true, 'message': null, 'data': collection});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Collection failed.');
        }
    };

    /**
     * Add Collection Function
     */
    addCollection = async (req: Request, res: Response, next: NextFunction) => {
        const {
            address,
            owner,
            name,
            description,
            symbol,
            type,
            websiteLink,
            facebookLink,
            twitterLink,
            instagramLink,
            telegramLink,
            mediumLink,
            discordLink,
            isVerified,
            isExplicit,
            standard,
            chain,
            mintStatus
        } = req.body;

        try {
            const collection = await collections.addCollection(
                address,
                owner,
                name,
                description,
                symbol,
                type,
                websiteLink,
                facebookLink,
                twitterLink,
                instagramLink,
                telegramLink,
                mediumLink,
                discordLink,
                isVerified,
                isExplicit,
                standard,
                chain,
                mintStatus
            );

            res.json({'success': true, 'message': null, 'data': collection});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Collection failed.');
        }
    };

    /**
     * Get Collections Stats Function
     */
    getCollectionStat = async (req: Request, res: Response, next: NextFunction) => {
        const {chain, address} = req.body;
        const currentDate = new Date().getTime();
        const dateBefore24h = new Date(currentDate - 24 * 60 * 60 * 1000);
        const dateBefore7d = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
        const dateBefore30d = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
        const dateBefore3m = new Date(currentDate - 90 * 24 * 60 * 60 * 1000);
        const dateBefore6m = new Date(currentDate - 180 * 24 * 60 * 60 * 1000);
        const dateBefore1y = new Date(currentDate - 365 * 24 * 60 * 60 * 1000);

        try {
            const result = {
                'chain': chain,
                'address': address,
                'floorPrice': 0,
                'floorChange24h': 0,
                'floorChange7d': 0,
                'floorChange30d': 0,
                'volume7d': 0,
                'average7d': 0,
                'count7d': 0,
                'volume1m': 0,
                'average1m': 0,
                'count1m': 0,
                'volume3m': 0,
                'average3m': 0,
                'count3m': 0,
                'volume6m': 0,
                'average6m': 0,
                'count6m': 0,
                'volume1y': 0,
                'average1y': 0,
                'count1y': 0,
                'volumeAll': 0,
                'averageAll': 0,
                'countAll': 0
            };

            const floor = await prices.getFloorPrices(chain, address);
            if (floor[0]) {
                result['floorPrice'] = floor[0].floor;
                if (floor[0].floor24h > 0) {
                    result['floorChange24h'] = floor[0].floor24h - floor[0].floor;
                } else {
                    result['floorChange24h'] = floor[0].floor;
                }
                if (floor[0].floor7d > 0) {
                    result['floorChange7d'] = floor[0].floor7d - floor[0].floor;
                } else {
                    result['floorChange7d'] = floor[0].floor;
                }
                if (floor[0].floor30d > 0) {
                    result['floorChange30d'] = floor[0].floor30d - floor[0].floor;
                } else {
                    result['floorChange30d'] = floor[0].floor;
                }
            }

            const volume24hInfo = await orders.getVolumeInfo(chain, address, dateBefore24h);
            if (volume24hInfo[0]) {
                result['volume24h'] = volume24hInfo[0].volume;
                result['count24h'] = volume24hInfo[0].count;
                if (volume24hInfo[0].count > 0) {
                    result['average24h'] = Math.floor(volume24hInfo[0].volume / volume24hInfo[0].count);
                }
            }

            const volume7dInfo = await orders.getVolumeInfo(chain, address, dateBefore7d);
            if (volume7dInfo[0]) {
                result['volume7d'] = volume7dInfo[0].volume;
                result['count7d'] = volume7dInfo[0].count;
                if (volume7dInfo[0].count > 0) {
                    result['average7d'] = Math.floor(volume7dInfo[0].volume / volume7dInfo[0].count);
                }
            }

            const volume1mInfo = await orders.getVolumeInfo(chain, address, dateBefore30d);
            if (volume1mInfo[0]) {
                result['volume1m'] = volume1mInfo[0].volume;
                result['count1m'] = volume1mInfo[0].count;
                if (volume1mInfo[0].count > 0) {
                    result['average1m'] = Math.floor(volume1mInfo[0].volume / volume1mInfo[0].count);
                }
            }

            const volume3mInfo = await orders.getVolumeInfo(chain, address, dateBefore3m);
            if (volume3mInfo[0]) {
                result['volume3m'] = volume3mInfo[0].volume;
                result['count3m'] = volume3mInfo[0].count;
                if (volume3mInfo[0].count > 0) {
                    result['average3m'] = Math.floor(volume3mInfo[0].volume / volume3mInfo[0].count);
                }
            }

            const volume6mInfo = await orders.getVolumeInfo(chain, address, dateBefore6m);
            if (volume6mInfo[0]) {
                result['volume6m'] = volume6mInfo[0].volume;
                result['count6m'] = volume6mInfo[0].count;
                if (volume6mInfo[0].count > 0) {
                    result['average6m'] = Math.floor(volume6mInfo[0].volume / volume6mInfo[0].count);
                }
            }

            const volume1yInfo = await orders.getVolumeInfo(chain, address, dateBefore1y);
            if (volume1yInfo[0]) {
                result['volume1y'] = volume1yInfo[0].volume;
                result['count1y'] = volume1yInfo[0].count;
                if (volume1yInfo[0].count > 0) {
                    result['average1y'] = Math.floor(volume1yInfo[0].volume / volume1yInfo[0].count);
                }
            }

            const volumeAllInfo = await orders.getVolumeInfo(chain, address);
            if (volumeAllInfo[0]) {
                result['volumeAll'] = volumeAllInfo[0].volume;
                result['countAll'] = volumeAllInfo[0].count;
                if (volumeAllInfo[0].count > 0) {
                    result['averageAll'] = Math.floor(volumeAllInfo[0].volume / volumeAllInfo[0].count);
                }
            }

            res.json({'success': true, 'message': null, 'data': result});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Collection Stats failed.');
        }
    };

    /**
     * Get Chart Data Function
     */

    getCollectionChart = async (req: Request, res: Response, next: NextFunction) => {
        const {chain, address, days} = req.body;
        const currentDate = new Date().getTime();
        const timesPerDay = 24 * 60 * 60 * 1000;
        const dateBefore = new Date(currentDate - days * timesPerDay);
        const result = {};

        try {
            for (let i = dateBefore.getTime(); i <= currentDate; i = i + timesPerDay) {
                result[new Date(i).toISOString().slice(0, 10)] = {
                    count: 0,
                    volume: 0,
                    average: 0
                };
            }

            const ordersByDaily = await orders.getChartInfo(chain, address, dateBefore);

            for (const order of ordersByDaily) {
                const date = order._id.day;
                result[date] = {};
                result[date].volume = order.volume;
                result[date].count = order.count;
                if (order['count'] > 0) {
                    result[date].average = order.volume / order.count;
                }
            }

            const floorPriceByDaily = await prices.getChartInfo(chain, address, dateBefore);

            for (const floorPrice of floorPriceByDaily) {
                const date = floorPrice._id.day;
                result[date].floorPrice = floorPrice.price;
            }

            res.json({'success': true, 'message': null, 'data': result});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Collection Chart failed.');
        }
    };

    /**
     * Get NFTs Function
     * @param req
     * @param res
     * @param next
     */
    getNFTs = async (req: Request, res: Response, next: NextFunction) => {
        const {col_url, page, display_per_page, sort, searchObj} = req.body;

        try {
            const collection = await collectionsModel.findOne({'col_url': col_url});
            if (collection) {

                const orQuery: any = [];
                Object.keys(searchObj).map((attrKey) => {
                    if (searchObj[attrKey].length == 0) {
                        return false;
                    }
                    const orArr: { [x: string]: any; } = [];
                    const findKey = 'attributes.' + attrKey;
                    searchObj[attrKey].map((value) => {
                        orArr.push({[findKey]: value});
                    });
                    orQuery.push({'$or': orArr});
                });
                // console.log("orQuery ?", orQuery)

                let andQuery = {};
                if (Array.isArray(orQuery) && orQuery.length > 0) {
                    andQuery = {'$and': orQuery};
                }

                const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                const offset = page * display_per_page;
                const nfts = await nftModel.find(andQuery).sort(sort).sort('_id').skip(offset).limit(display_per_page).exec();

                return res.json({
                    'success': true, 'message': null, 'data': nfts, 'finished': nfts.length == 0
                });
            } else {
                return res.status(400).json({
                    'success': false,
                    'name': 'Request Error',
                    'message': 'Invalid collection.'
                });
            }
        } catch (error) {
            console.log('Collection getNFTs error ? ', error);
            apiErrorHandler(error, req, res, 'Get NFTs failed.');
        }
    };
    updateListPrice = async(req: Request, res:Response, next: NextFunction) => {
        const {col_url, token_id, price } = req.body;

        try {
            const collection = await collectionsModel.findOne({'col_url':col_url});

            if(collection) {
                const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                await nftModel.findOneAndUpdate({'token_id':token_id},{
                    $set:{
                        'price':price
                    }
                });
                return res.json({
                    'success': true, 'message': null, 'data':'list price has just been updated'
                });
                
            }
        } catch (error) {
            console.log('Update price error ? ', error);
            apiErrorHandler(error, req, res, 'Update price error.');
        }
    }

    updateSalePrice = async(req: Request, res:Response, next: NextFunction) => {
        const {col_url, token_id, price } = req.body;

        try {
            const collection = await collectionsModel.findOne({'col_url':col_url});

            if(collection) {
                const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                await nftModel.findOneAndUpdate({'token_id':token_id},{
                    $set:{
                        'last_sale':price
                    }
                });
                return res.json({
                    'success': true, 'message': null, 'data':'sale price has just been updated'
                });
                
            }
        } catch (error) {
            console.log('Sale price error ? ', error);
            apiErrorHandler(error, req, res, 'Update price error.');
        }
    }

    updateChainID = async(req: Request, res:Response, next: NextFunction) => {
        const {col_url, token_id, chain_id } = req.body;

        try {
            const collection = await collectionsModel.findOne({'col_url':col_url});

            if(collection) {
                const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                await nftModel.findOneAndUpdate({'token_id':token_id},{
                    $set:{
                        'chain_id':chain_id
                    }
                });
                return res.json({
                    'success': true, 'message': null, 'data':'chainId update has just been updated'
                });
                
            }
        } catch (error) {
            console.log('chaind id error ? ', error);
            apiErrorHandler(error, req, res, 'Update chain_id error.');
        }
    }

    addNFT = async (req: Request, res: Response, next: NextFunction) => {
        const { col_url, tokenId,chainId,nextIDMetadataURI } = req.body;
        try {
            const collection = await collectionsModel.findOne({'col_url':col_url});

            if(collection) {
                if(col_url=='kanpai_pandas'){
                    const response = await fetch(nextIDMetadataURI.toString().replace('ipfs://', 'https://ipfs.io/ipfs/'))
                    const data = await response.json();
    
                    const base_nft = {
                        _id:0,
                        name:"",
                        image:"",
                        os_image:"",
                        animation_url:null,
                        os_animation_url:null,
                        custom_id:0,
                        token_id:0,
                        attributes:{},
                        score:"",
                        rank:null,
                        name1:"",
                        price:0,
                        last_sale:0,
                        chain_id:5
                    }
                    base_nft._id = new ObjectId(tokenId);
                    base_nft.image = data.file_url;
                    base_nft.name = data.name;
                    base_nft.os_image = data.name;.
                    base_nft.custom_id = tokenId;
                    base_nft.token_id = tokenId;
                    let attributes:any = {};
                    if(data.attributes){
                        data.attributes.forEach((item: { [x: string]: any })=>{
                            attributes[item['trait_type']] = item['value']
                        })
                    }
                    base_nft.attributes = attributes;
                    base_nft.name1 = data.name;
                    base_nft.chain_id = chainId;
    
                    const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                    const new_nft = new nftModel(base_nft)
                    console.log(new_nft)
                    new_nft.save(function(err,result){
                        if (err){
                            console.log(err);
                        }
                        else{
                            console.log(result)
                        }
                    })
                    return res.json({
                        'success': true, 'message': null, 'data':'Save nfts in the database'
                    });
                } else if (col_url=='gregs_eth'){
                    const response = await fetch(nextIDMetadataURI)
                    const data = await response.json();
    
                    const base_nft = {
                        _id:0,
                        name:"",
                        image:"",
                        os_image:"",
                        animation_url:null,
                        os_animation_url:null,
                        custom_id:0,
                        token_id:0,
                        attributes:{},
                        score:"",
                        rank:null,
                        name1:"",
                        price:0,
                        last_sale:0,
                        chain_id:5
                    }
                    base_nft._id = new ObjectId(tokenId);
                    base_nft.image = data.image;
                    base_nft.name = data.name;
                    base_nft.os_image = data.name;
                    base_nft.custom_id = tokenId;
                    base_nft.token_id = tokenId;
                    let attributes:any = {};
                    if(data.attributes){
                        data.attributes.forEach((item: { [x: string]: any })=>{
                            attributes[item['trait_type']] = item['value']
                        })
                    }
                    base_nft.attributes = attributes;
                    base_nft.name1 = data.name;
                    base_nft.chain_id = chainId;
                    base_nft.animation_url = data.animation_url;
    
                    const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                    const new_nft = new nftModel(base_nft)
                    console.log(new_nft)
                    new_nft.save(function(err,result){
                        if (err){
                            console.log(err);
                        }
                        else{
                            console.log(result)
                        }
                    })
                    return res.json({
                        'success': true, 'message': null, 'data':'Save nfts in the database'
                    });
                }

                
            }
        } catch (error) {
            console.log('save nft error ? ', error);
            apiErrorHandler(error, req, res, 'Saving nft error.');
        }
    }

    getAllNFTs = async (req: Request, res: Response, next: NextFunction) => {
        const {col_url, sort, searchObj} = req.body;

        try {
            const collection = await collectionsModel.findOne({'col_url': col_url});
            if (collection) {

                const orQuery: any = [];
                Object.keys(searchObj).map((attrKey) => {
                    if (searchObj[attrKey].length == 0) {
                        return false;
                    }
                    const orArr: { [x: string]: any; } = [];
                    const findKey = 'attributes.' + attrKey;
                    searchObj[attrKey].map((value) => {
                        orArr.push({[findKey]: value});
                    });
                    orQuery.push({'$or': orArr});
                });
                // console.log("orQuery ?", orQuery)

                let andQuery = {};
                if (Array.isArray(orQuery) && orQuery.length > 0) {
                    andQuery = {'$and': orQuery};
                }

                const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                const nfts = await nftModel.find(andQuery).sort(sort).sort('_id').exec();

                return res.json({
                    'success': true, 'message': null, 'data': nfts, 'finished': nfts.length == 0
                });
            } else {
                return res.status(400).json({
                    'success': false,
                    'name': 'Request Error',
                    'message': 'Invalid collection.'
                });
            }
        } catch (error) {
            console.log('Collection getNFTs error ? ', error);
            apiErrorHandler(error, req, res, 'Get NFTs failed.');
        }
    };

    getNFTOwner = async (req, res) => {
        const {col_address, collection_chain_name, token_id} = req.params;

        try {
            if (!(Object.values(NETWORK_TYPE).includes(collection_chain_name))) {
                return res.status(400).json({ 'success': false, 'message': 'Invalid network.' });
            }
            let tokenIdOwner;
            if (ALCHEMY_SUPPORTED_NETWORKS.includes(collection_chain_name)) {
                tokenIdOwner = await alchemy_getTokenOwners(collection_chain_name as NETWORK_TYPE, col_address as string, token_id as string);
            } else if (MORALIS_SUPPORTED_NETWORKS.includes(collection_chain_name)) {
                tokenIdOwner = await getTokenOwners(collection_chain_name as NETWORK_TYPE, col_address as string, token_id as string);
            } else {
                return res.status(400).json({ 'success': false, 'message': 'Invalid Supported Network.' });
            }

            return res.json({
                'success': true, 'message': null, 'owner': tokenIdOwner
            });
        } catch (error) {
            console.log('Collection getNFTOwner error ? ', error);
            apiErrorHandler(error, req, res, 'Get NFT Owner failed.');
        }
    };

    /**
     * Get getNFTInfo Function
     * @param req
     * @param res
     * @param next
     */
    getNFTInfo = async (req: Request, res: Response, next: NextFunction) => {
        const {col_url, token_id} = req.params;

        try {
            const collection = await collectionsModel.findOne({'col_url': col_url});
            if (collection) {
                const nftModel = mongoose.model(collection.col_name as any, nftSchema, collection.col_name as any);
                const nft = await nftModel.findOne({token_id}).exec();
                return res.json({
                    'success': true, 'message': null, 'data': {
                        nft,
                        collection
                    }
                });
            } else {
                return res.status(400).json({
                    'success': false,
                    'name': 'Request Error',
                    'message': 'Invalid collection.'
                });
            }
        } catch (error) {
            console.log('Collection getNFTInfo error ? ', error);
            apiErrorHandler(error, req, res, 'Get NFTs failed.');
        }
    };
    /**
     * Get Collection Info Function
     * @param req
     * @param res
     * @param next
     */
    getCollectionInfo = async (req: Request, res: Response, next: NextFunction) => {
        const {col_url} = req.params;

        try {
            const collection = await collectionsModel.findOne({'col_url': col_url});
            res.json({
                'success': true, 'message': null, 'data': collection
            });
        } catch (error) {
            console.log('Collection getCollectionInfo error ? ', error);
            apiErrorHandler(error, req, res, 'Get NFTs failed.');
        }
    };

    /**
     * Get Collection Info Function
     * @param req
     * @param res
     * @param next
     */
    getCollectionOwners = async (req: Request, res: Response, next: NextFunction) => {
        const {collection_chain, collection_address} = req.params;

        try {
            if (!(Object.values(NETWORK_TYPE).includes(collection_chain as NETWORK_TYPE))) {
                return res.status(400).json({
                    'success': false,
                    'message': 'Invalid network.'
                });
            }
            // const collection:ICollection = await collectionsModel.findOne({ "col_url": col_url }) as any
            let cntOwner: number;
            if (ALCHEMY_SUPPORTED_NETWORKS.includes(collection_chain as NETWORK_TYPE)) {
                cntOwner = await alchemy_getNFTOwnerCntFromCollection(collection_chain as NETWORK_TYPE, collection_address);
            } else if (MORALIS_SUPPORTED_NETWORKS.includes(collection_chain as NETWORK_TYPE)) {
                cntOwner = await getNFTOwnerCntFromCollection(collection_chain as NETWORK_TYPE, collection_address);
            } else {
                return res.status(400).json({ 'success': false, 'message': 'Invalid Supported Network.' });
            }
            // if ( collection ) {
            //     cntOwner = await getNFTOwnerCntFromCollection(collection_chain, collection_address)
            // }
            res.json({
                'success': true, 'message': null, 'data': cntOwner
            });
        } catch (error) {
            console.log('Collection getCollectionOwners error ? ', error);
            apiErrorHandler(error, req, res, 'Get NFTs failed.');
        }
    };

    /**
     * Get Collection Function
     */
    getCollections = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collections = await collectionsModel.find();
            res.json({'success': true, 'message': null, 'data': collections});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get Collections failed.');
        }
    };
}
