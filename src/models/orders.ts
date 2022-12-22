import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    hash: String,
    chain: String,
    collectionAddress: String,
    tokenId: String,
    isOrderAsk: Boolean,
    signer: String,
    strategy: String,
    currencyAddress: String,
    amount: Number,
    price: String,
    nonce: Number,
    startTime: Number,
    endTime: Number,
    minPercentageToAsk: Number,
    params: [],
    signature: String,
    v: Number,
    r: String,
    s: String,
    status: {
        type: String,
        enum: ['CANCELLED', 'ERC_APPROVAL', 'ERC20_APPROVAL', 'ERC20_BALANCE', 'EXECUTED', 'EXPIRED', 'INVALID_OWNER', 'VALID'],
        default: 'VALID'
    },
},
{ timestamps: true });

export default mongoose.model('orders', ordersSchema);