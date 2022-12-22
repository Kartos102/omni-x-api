import { NextFunction, Request, Response } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import { IOrder, IUserNFT } from '../interface/interface';
import orders from '../repositories/orders';
import users from '../repositories/users';
import { alchemy_getUserNFTs, ALCHEMY_SUPPORTED_NETWORKS } from '../services/alchemy';
import { getUserNFTs, MORALIS_SUPPORTED_NETWORKS } from '../services/moralis';

import * as aws from 'aws-sdk';
import * as fs from 'fs';

export default class UsersController {
    constructor() {
    }

    /**
     * Get NFTs Function
     * @param req
     * @param res
     * @param next
     */
    getNFTs = async (req: Request, res: Response, next: NextFunction) => {
        const {address} = req.params;
        const chains = ALCHEMY_SUPPORTED_NETWORKS;
        try {
            let nfts: Array<IUserNFT> = [];
            for (const i in chains) {
                const nft_list = await alchemy_getUserNFTs(chains[i], address);
                nft_list.map((obj: any) => {
                    obj['chain'] = chains[i];
                    return obj;
                });
                nfts = nfts.concat(nft_list);
            }
            for (const network of MORALIS_SUPPORTED_NETWORKS) {
                const nft_list = await getUserNFTs(network, address);
                nft_list.map((obj: any) => {
                    obj['chain'] = network;
                    return obj;
                });
                nfts = nfts.concat(nft_list);
            }
            res.json({'success': true, 'message': null, 'data': nfts});
        } catch (error) {
            apiErrorHandler(error, req, res, 'Get NFTs failed.');
        }
    };

    getProfile = async (req, res, next) => {
        const {address} = req.params;
        const user = await users.getProfile(address);
        return res.status(200).json({
            'success': true,
            'message': null,
            'data': user,
        });
    };

    updateProfile = async (req, res) => {
        try {
            const {address, username, bio, twitter, website, greg} = req.body;
            console.log(address, username, bio, twitter, website, greg);

            const files = req.files;
            let avatar = '', banner_1 = '', banner_2 = '', banner_3 = '';

            for (const key of Object.keys(files)) {
                const file = files[key];

                const s3 = new aws.S3({
                    accessKeyId: process.env.AWS_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_SECRET_KEY,
                    region: process.env.REGION,
                    correctClockSkew: true,
                    httpOptions: {timeout: 1800000}
                });
                const blob = await fs.readFileSync(file.path);

                const uploadedFile = await s3.upload({
                    Bucket: process.env.BUCKET_NAME as any,
                    Key: 'uploads/' + file.filename,
                    ContentType: file.mimetype,
                    Body: blob,
                }).promise() as any;

                if (file['fieldname'] === 'avatar') {
                    avatar = uploadedFile.key;
                } else if (file['fieldname'] === 'banner_1') {
                    banner_1 = uploadedFile.key;
                } else if (file['fieldname'] === 'banner_2') {
                    banner_2 = uploadedFile.key;
                } else if (file['fieldname'] === 'banner_3') {
                    banner_3 = uploadedFile.key;
                }

            }

            const user = await users.updateProfile(address, username, bio, twitter, website, greg, avatar, banner_1, banner_2, banner_3);

            return res.status(200).json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            console.log(error);
            apiErrorHandler(error, req, res, 'Update Profile failed.');
        }
    };

    addBanner = async (req, res, next) => {
        try {
            const {address} = req.body;
            let banner = '';
            if (req.files && req.files[0]) {
                banner = req.files[0].path;
            }

            const user = users.addBanner(address, banner);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Banner failed.');
        }
    };

    removeBanner = async (req, res, next) => {
        try {
            const {address, banner} = req.body;

            const user = users.removeBanner(address, banner);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Remove Banner failed.');
        }
    };

    addWatchlist = async (req, res, next) => {
        try {
            const {address, watchlist} = req.body;

            const user = users.addWatchlist(address, watchlist);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Watchlist failed.');
        }
    };

    removeWatchlist = async (req, res, next) => {
        try {
            const {address, watchlist} = req.body;

            const user = users.removeWatchlist(address, watchlist);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Remove Watchlist failed.');
        }
    };

    addHiddenNFT = async (req, res, next) => {
        try {
            const {address, hiddenNFT} = req.body;

            const user = users.addHiddenNFT(address, hiddenNFT);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Hidden NFT failed.');
        }
    };

    removeHiddenNFT = async (req, res, next) => {
        try {
            const {address, hiddenNFT} = req.body;

            const user = users.removeHiddenNFT(address, hiddenNFT);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Remove Hidden NFT failed.');
        }
    };

    addFollowing = async (req, res, next) => {
        try {
            const {address, following} = req.body;

            const user = users.addFollowing(address, following);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Add Following failed.');
        }
    };

    removeFollowing = async (req, res, next) => {
        try {
            const {address, following} = req.body;

            const user = users.removeFollowing(address, following);

            return res.json({
                'success': true,
                'message': null,
                'data': user,
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Remove Following failed.');
        }
    };

    getUserNonce = async (req, res) => {
        try {
            const {address} = req.params;

            const order: IOrder = await orders.getUserNonce(address) as IOrder;
            let nonce = 1;
            if (order) {
                nonce = order.nonce + 1;
            }
            return res.json({
                'success': true,
                'message': null,
                'data': nonce
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'getUserNonce failed.');
        }
    };
}
