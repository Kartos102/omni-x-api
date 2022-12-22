import { Alchemy, Nft } from 'alchemy-sdk';
import fetch from 'node-fetch';
import { BigNumber } from 'ethers';
import { arbitrumSettings, ethSettings, mumbaiSettings, optimismSettings } from '../config';
import { NETWORK_TYPE } from '../utils/enums';
import { IUserNFT } from '../interface/interface';

const ethAlchemy = new Alchemy(ethSettings);
const arbitrumAlchemy = new Alchemy(arbitrumSettings);
const optimismAlchemy = new Alchemy(optimismSettings);
const mumbaiAlchemy = new Alchemy(mumbaiSettings);

const getAlchemyInstance = (chain: NETWORK_TYPE) => {
    switch (chain) {
        case NETWORK_TYPE.GOERLI:
            return ethAlchemy;
        case NETWORK_TYPE.ARB_TESTNET:
            return arbitrumAlchemy;
        case NETWORK_TYPE.OPT_TESTNET:
            return optimismAlchemy;
        case NETWORK_TYPE.MUMBAI:
            return mumbaiAlchemy;
        default:
            return ethAlchemy;
    }
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export const hasUserNFT = async (chain: NETWORK_TYPE, signer: string, collection: string, tokenId: number) => {
    try {
        await timer(10);
        const alchemy = getAlchemyInstance(chain);

        if (tokenId == null) {
            const ownedNfts = await alchemy.nft.getNftsForOwner(signer);
            for (const nft of ownedNfts.ownedNfts) {
                if (nft.contract.address === collection) {
                    return true;
                }
            }
        } else if (tokenId >= 0) {
            const res = await alchemy.nft.getOwnersForNft(collection, tokenId);
            return res.owners.filter((owner) => owner === signer).length > 0;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const alchemy_getUserNFTs = async (chain: NETWORK_TYPE, address: string): Promise<Array<IUserNFT>> => {
    try {
        await timer(10);
        const alchemy = getAlchemyInstance(chain);

        let cursor: string | undefined = undefined;
        const nfts: Array<IUserNFT> = [];
        do {
            const nft_result = await alchemy.nft.getNftsForOwner(address, {
                pageKey: cursor
            });
            cursor = nft_result.pageKey;

            for (const nft of nft_result.ownedNfts) {
                const parsedUserNft: IUserNFT = {
                    'token_address': nft.contract.address,
                    'token_id': nft.tokenId,
                    'amount': nft.balance,
                    'owner_of': address,
                    'token_hash': '',
                    'block_number_minted': '',
                    'block_number': '',
                    'contract_type': nft.contract.tokenType,
                    'name': nft.contract.name || '',
                    'symbol': nft.contract.symbol || '',
                    'token_uri': nft.tokenUri?.raw || '',
                    'metadata': JSON.stringify(nft.rawMetadata),
                    'last_token_uri_sync': nft.timeLastUpdated,
                    'last_metadata_sync': nft.timeLastUpdated,
                    'chain': chain,
                };
                nfts.push(parsedUserNft);
            }
            await timer(10);
        } while (cursor !== '' && cursor !== undefined);

        return nfts;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const getNFTsFromCollection = async (chain: NETWORK_TYPE, address: string, cursor = null) => {
    try {

    } catch (err) {
        console.log('moralis getNFTsFromCollection err?', err);
        return {result: []};
    }
};

export const alchemy_getNFTOwnerCntFromCollection = async (chain: NETWORK_TYPE, address: string) => {
    try {
        await timer(10);
        const alchemy = getAlchemyInstance(chain);

        const owners = {};
        const result = await alchemy.nft.getOwnersForContract(address);
        for (const owner of result.owners) {
            owners[owner] = 1;
        }
        return Object.keys(owners).length;
    } catch (err) {
        console.log('moralis getNFTOwnerCntFromCollection err ?', err);
        return 0;
    }
};

export const getNFTCntFromCollection = async (chain: NETWORK_TYPE, address: string) => {
    try {
        await timer(10);
        const alchemy = getAlchemyInstance(chain);

        const owners = {};
        const result = await alchemy.nft.getOwnersForContract(address);
        return result.owners.length;
    } catch (err) {
        console.log('moralis getNFTCntFromCollection err ?', err);
        return 0;
    }
};
export const getTokenMetadata = async (chain: NETWORK_TYPE, address: string, token_id: string): Promise<Nft | undefined> => {
    try {
        await timer(10);
        const alchemy = getAlchemyInstance(chain);

        const tokenIdMetadata = await alchemy.nft.getNftMetadata(address, BigNumber.from(token_id));

        if (!tokenIdMetadata.rawMetadata && tokenIdMetadata.tokenUri) {
            const resp = await fetch(tokenIdMetadata.tokenUri.raw);
            tokenIdMetadata.rawMetadata = await resp.text();
        }

        return tokenIdMetadata;
    } catch (err) {
        console.log('moralis getTokenMetadata err ?', err);
        return undefined;
    }
};
export const alchemy_getTokenOwners = async (chain: NETWORK_TYPE, address: string, token_id: string) => {
    try {
        await timer(10);
        const alchemy = getAlchemyInstance(chain);
        const result = await alchemy.nft.getOwnersForNft(address, BigNumber.from(token_id));
        let nftOwnerAddress = '';
        for (const nftOwner of result.owners) {
            nftOwnerAddress = nftOwner;
        }

        return nftOwnerAddress;
    } catch (err) {
        console.log('moralis getTokenOwners err ?', err);
        return {};
    }
};

export const ALCHEMY_SUPPORTED_NETWORKS = [
    NETWORK_TYPE.GOERLI,
    NETWORK_TYPE.MUMBAI,
    NETWORK_TYPE.OPT_TESTNET,
    NETWORK_TYPE.ARB_TESTNET,
];
