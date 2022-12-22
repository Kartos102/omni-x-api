import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const nftSchema = new Schema({
    name: String,
    attributes: { type: Map },
    image: String,
    os_image:String,
    animation_url:String,
    os_animation_url:String,
    custom_id: Number,
    score: String,
    rank: Number,
    token_id: Number,
    name1: String,
    price: Number,
    last_sale:Number,
    chain_id:Number
});

export default nftSchema;