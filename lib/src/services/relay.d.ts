import { Sub } from 'nostr-tools';
import { SaleOrder } from '../types/relay';
export declare type SubscribeOrdersProps = {
    limit: number;
    relays?: string[];
    onOrder: (order: SaleOrder) => void;
    onEose: () => void;
};
export declare class NostrRelay {
    private pool;
    private subs;
    private relays;
    private subscriptionOrders;
    constructor();
    getSubscriptionOrders(): Sub | null;
    setRelays(relays: string[]): void;
    unsubscribeOrders(): void;
    subscribeOrders({ limit, onOrder, onEose, relays }: SubscribeOrdersProps): Sub;
    private subscribe;
}
