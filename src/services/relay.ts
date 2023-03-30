import { SimplePool, Filter, Event, Sub } from 'nostr-tools';
import { NOSTR_KIND_INSCRIPTION, NOSTR_RELAY_URL } from '../config/constants';
import { SaleOrder } from '../types/relay';
import { openOrdex } from './open-ordex';

type SubscribeOrdersProps = {
    limit: number;
    onOrder: (order: SaleOrder) => void;
    onEose: () => void;
};

export class NostrRelay {
    private pool: SimplePool;
    private subs: Sub[];
    private relays: string[];
    private subscriptionOrders: Sub | null;

    constructor() {
        this.pool = new SimplePool();
        this.subs = [];
        this.relays = [...[NOSTR_RELAY_URL]];
        this.subscriptionOrders = null;
    }

    unsubscribeOrders(): void {
        if (this.subscriptionOrders) {
            this.subs = this.subs.filter((sub) => sub !== this.subscriptionOrders);
            this.subscriptionOrders.unsub();
            this.subscriptionOrders = null;
        }
    }

    subscribeOrders({ limit, onOrder, onEose }: SubscribeOrdersProps) {
        try {
            this.unsubscribeOrders();
            this.subscriptionOrders = this.subscribe(
                [{ kinds: [NOSTR_KIND_INSCRIPTION], limit }],
                async (event) => {
                    const order = await openOrdex.parseOrderEvent(event);
                    if (order) {
                        onOrder(order);
                    }
                },
                onEose
            );
            return this.subscriptionOrders;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private subscribe(filter: Filter[], onEvent: (event: Event) => void, onEose: () => void): Sub {
        const sub = this.pool.sub([...this.relays], filter);
        sub.on('event', onEvent);
        sub.on('eose', onEose);
        this.subs.push(sub);
        return sub;
    }
}
