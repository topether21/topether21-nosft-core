/// <reference types="node" />
import * as bitcoin from 'bitcoinjs-lib';
export declare const getAddress: (nostrPublicKey: string) => bitcoin.payments.Payment;
export declare const toXOnly: (key: Buffer) => Buffer;
