import { Event } from 'nostr-tools';
declare global {
    interface Window {
        nostr: {
            getPublicKey(): Promise<string>;
            signEvent(event: Event): Promise<Event>;
            getRelays(): Promise<{
                [url: string]: {
                    read: boolean;
                    write: boolean;
                };
            }>;
            signSchnorr(key: string): Promise<string>;
        };
    }
}
export interface SaleOrder {
    title: string;
    txid: string;
    inscriptionId: string;
    value: number;
    usdPrice: string;
    id: string;
    kind: number;
    pubkey: string;
    created_at: number;
    content: string;
    tags: Array<string[]>;
    sig: string;
    collection: null;
    content_length: number;
    content_type: string;
    created: number;
    escrow: Escrow;
    genesis_fee: number;
    genesis_height: number;
    meta: null;
    num: number;
}
export interface Escrow {
    bought_at: string;
    satoshi_price: number;
    seller_address: string;
}
