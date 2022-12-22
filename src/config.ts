import { Network } from 'alchemy-sdk';

export const ethSettings = {
    apiKey: process.env.GOERLI_ALCHEMY_API_KEY as string || '',
    network: Network.ETH_GOERLI,
};

export const arbitrumSettings = {
    apiKey: process.env.ARBITRUM_ALCHEMY_API_KEY as string || '',
    network: Network.ARB_GOERLI,
};

export const optimismSettings = {
    apiKey: process.env.OPTIMISM_ALCHEMY_API_KEY as string || '',
    network: Network.OPT_GOERLI,
};

export const mumbaiSettings = {
    apiKey: process.env.MUMBAI_ALCHEMY_API_KEY as string || '',
    network: Network.MATIC_MUMBAI,
};
