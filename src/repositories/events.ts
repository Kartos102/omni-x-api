import { ICreateOrderRequest, IOrder } from '../interface/interface';
import Events from '../models/events';
import { ethers } from 'ethers';

class EventsRepository {
    constructor() {}

    createEvent = async (
        from: string,
        to: string,
        type: string,
        collection_id: string,
        token_id: string,
        order_id: string
    ) => {
        const order = new Events({
            from,
            to,
            type,
            collection_id,
            token_id,
            order_id
        });
        return order.save();
    }
}

export default new EventsRepository();