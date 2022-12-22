import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
    from: String,
    to: String,
    type: {
        type: String,
        enum: ['MINT', 'TRANSFER', 'LIST', 'SALE', 'OFFER', 'CANCEL_LIST', 'CANCEL_OFFER'],
        default: 'LIST'
    },
    collection_id: String,
    token_id: String,
    order_id: String,
},
{ timestamps: true });

export default mongoose.model('events', eventsSchema);
