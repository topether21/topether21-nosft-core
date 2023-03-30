import ApiService from '../utils/httpService';
import { AddressInscriptions } from '../types/nosft';
export interface AddressInscriptionsRequest {
    offset: number;
    limit: number;
    address: string;
}
export interface NosftConfig {
    baseUrl?: string;
    network?: 'testnet' | 'mainnet';
}
declare class Nosft extends ApiService {
    constructor(config?: NosftConfig);
    getAddressInscriptions({ offset, limit, address, }: AddressInscriptionsRequest): Promise<AddressInscriptions>;
}
export declare function get(config?: NosftConfig): Nosft;
export default Nosft;
