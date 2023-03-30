import 'websocket-polyfill';
import { NostrRelay } from '../src/services/relay';

(async () => {
    const relay = new NostrRelay();
    relay.subscribeOrders({
        limit: 10,
        onOrder: (order) => {
            console.log('new order');
            console.log(order.id);
        },
        onEose: () => {
            console.log('eose');
        },
    });
})();

// Run this file
// npx @digitak/esrun testers/relay.tester.ts
