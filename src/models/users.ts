import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    address: {
        type: String,
    },
    username: {
        type: String
    },
    bio: {
        type: String
    },
    twitter: {
        type: String
    },
    website: {
        type: String
    },
    greg: {
        type: String
    },
    avatar: {
        type: String
    },
    banners: [{
        type: String
    }],
    watchlists: [{
        type: String
    }],
    hiddenNFTs: [{
        type: String
    }],
    followings: [{
        type: String
    }]
},
{ timestamps: true });

export default mongoose.model('users', usersSchema);