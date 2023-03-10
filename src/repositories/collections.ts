import collections from '../models/collections';

class CollectionsRepository {
    constructor() {}

    getCollectionByAddress = async (
        chain: String,
        address: String
    ) => {
        return collections.findOne({ chain, address });
    }

    addCollection = async(
        address: string,
        owner: string,
        name: string,
        description: string,
        symbol: string,
        type: string,
        websiteLink: string,
        facebookLink: string,
        twitterLink: string,
        instagramLink: string,
        telegramLink: string,
        mediumLink: string,
        discordLink: string,
        isVerified: boolean,
        isExplicit: boolean,
        standard: String,
        chain: string,
        mintStatus: string
    ) => {
        const collection = new collections({
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
        });

        return collection.save();
    }
}

export default new CollectionsRepository();