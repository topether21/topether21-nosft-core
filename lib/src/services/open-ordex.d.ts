import { Event } from 'nostr-tools';
import { SaleOrder } from '../types/relay';
declare class OpenOrdexFactory {
    private bitcoinPrice;
    private recommendedFeeRate;
    private sellerSignedPsbt;
    private price;
    constructor();
    private initBitcoinPrice;
    private getBitcoinPrice;
    private validateSellerPSBTAndExtractPrice;
    parseOrderEvent(order: Event, orders?: Event[]): Promise<SaleOrder | undefined>;
}
declare const openOrdex: OpenOrdexFactory;
export { openOrdex };
