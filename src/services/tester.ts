import 'websocket-polyfill';
import { NostrRelay } from './relay';

(async () => {
    const r = new NostrRelay();
    r.subscribeOrders({
        limit: 100,
        onOrder: (order) => {
            console.log('new order');
            console.log(order);
        },
        onEose: () => {
            console.log('eose');
        },
    });
})();
