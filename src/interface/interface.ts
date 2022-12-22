import { NETWORK_TYPE } from '../utils/enums';

export interface IOrder {
    hash: string;
    isOrderAsk: boolean;
    signer: string;
    collectionAddress: string;
    price: string;
    tokenId: string;
    chain: string;
    amount: number;
    strategy: string;
    currencyAddress: string;
    nonce: number;
    startTime: number;
    endTime: number;
    minPercentageToAsk: number;
    signature: string;
    params: any[];
    status: string;
    v: number;
    r: string;
    s: string;
}

export interface ICollection {
    owner: string;
    symbol: string;
    type: string;
    websiteLink: string;
    facebookLink: string;
    twitterLink: string;
    instagramLink: string;
    telegramLink: string;
    mediumLink: string;
    discordLink: string;
    isVerified: boolean;
    isExplicit: boolean;
    standard: {
        type: string,
        default: 'erc'
    };

    name: string;
    network: string;
    discord: string;
    website: string;
    twitter: string;
    medium: string;
    instagram: string;
    telegram: string;
    banner_image: string;
    profile_image: string;
    description: string;
    col_url: string;
    col_name: string;
    count: number;
    by_name: boolean;
    address: string;
    artblocks: boolean;
    attrs: object;
    chain: string;
}

export interface ICreateOrderRequest {
    signature: string;
    collection: string;
    tokenId: string;
    chain: string;
    signer: string;
    strategy: string;
    isOrderAsk: boolean;
    currency: string;
    nonce: number;
    amount: number;
    price: string;
    startTime: number;
    endTime: number;
    minPercentageToAsk: number;
    params: any[];
}

export interface IGetOrderRequest {
    isOrderAsk: boolean;
    chain: string;
    collection: string;
    tokenId: string;
    signer: string;
    nonce: number;
    strategy: string;
    currency: string;
    price: any;
    startTime: string;
    endTime: string;
    status: [string];
    pagination: any;
    sort: string;
}

export interface IUserNFT {
    amount: string;
    block_number: string;
    block_number_minted: string;
    chain: NETWORK_TYPE;
    contract_type: string;
    last_metadata_sync: string;
    last_token_uri_sync: string;
    metadata: string;
    name: string;
    owner_of: string;
    symbol: string;
    token_address: string;
    token_hash: string;
    token_id: string;
    token_uri: string;
}
