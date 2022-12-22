
import * as Test from '../abis/Test.json';
import * as OmniXExchange from '../abis/OmniXExchange.json';
import { ethers } from 'ethers';
import OrdersController from '../controllers/ordersController';

export const installBSCTestEvents = () => {
    const wsProvider = new ethers.providers.WebSocketProvider(process.env.BSCTEST_RPC as string);
    const contract = new ethers.Contract(Test.bsctest, Test.abi, wsProvider);

    contract.on('updated', (from, to, value, event) => {
        console.log(from);
    });
};

export const installRopstenEvents = () => {
    const wsProvider = new ethers.providers.WebSocketProvider(process.env.ROPSTEN_RPC as string);
    const contract = new ethers.Contract(Test.ropsten, Test.abi, wsProvider);

    contract.on('updated', (from, to, value, event) => {
        console.log(from);
    });
};

export const installRinkebyEvents = () => {
    const wsProvider = new ethers.providers.WebSocketProvider(process.env.RINKEBY_RPC as string);
    const contract = new ethers.Contract('0x8405eA012aC6a3Ac998e42793e3275e011cf8E4e', OmniXExchange.abi, wsProvider);
    console.log('listen now');

    const ordersController = new OrdersController();

    contract.on('CancelAllOrders', (from, to, value, event) => {
        const args = value.args;
        console.log('user: ', args.user);
        console.log('newMinNonce: ', args.newMinNonce);
    });

    contract.on('TakerBid', (from, to, value, event) => {
        const args = value.args;
        ordersController.takerBid(args);
    });

    contract.on('TakerAsk', (from, to, value, event) => {
        const args = value.args;
        ordersController.takerBid(args);
    });
};