import { Collection } from '../types/nosft';
import { MintInscriptionRequest, MintInscriptionResponse, MintAttempt, MintCustomInscription, CollectionAllowListRequest, CollectionAllowList, UpdateCollectionAllowListRequest } from '../types/deezy';
import ApiService from '../utils/httpService';
declare class Deezy extends ApiService {
    constructor();
    getInscriptionsByCollectionId(collectionId: string): Promise<Collection>;
    mintInscription(mintInscriptionRequest: MintInscriptionRequest): Promise<MintInscriptionResponse>;
    getMintAttempt(mintAttemptId: string): Promise<MintAttempt>;
    mintCustomInscription(mintCustomInscription: MintCustomInscription): Promise<MintAttempt>;
    getCollectionAllowList(params: CollectionAllowListRequest): Promise<CollectionAllowList[]>;
    updateCollectionAllowList(params: UpdateCollectionAllowListRequest): Promise<void>;
    boost(psbt: string, feeRate: number): Promise<string>;
}
declare const _default: Deezy;
export default _default;
