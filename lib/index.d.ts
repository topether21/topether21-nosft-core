import Nosft from './src/services/nosft';
export declare function configure({ network, nosftBaseUrl }: {
    network: 'testnet' | 'mainnet';
    nosftBaseUrl?: string;
}): {
    nosft: Nosft;
};
declare const nosft: Nosft;
export { nosft };
export { NostrRelay } from './src/services/relay';
export * from './src/types/relay';
