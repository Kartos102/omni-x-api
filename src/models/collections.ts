import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const collectionsSchema = new Schema({
    name: String,
    network: String,
    discord: String,
    website: String,
    twitter: String,
    medium: String,
    instagram: String,
    telegram: String,
    banner_image: String,
    profile_image: String,
    description: String,
    col_url: String,
    col_name: String,
    count: Number,
    by_name: Boolean,
    address: {type: Map},
    artblocks: Boolean,
    attrs: {type: Map},
    price: Number,
    mint_status: String,
});

export default mongoose.model('collections', collectionsSchema);