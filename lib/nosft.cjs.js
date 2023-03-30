"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var topether21_nosft_core_exports = {};
__export(topether21_nosft_core_exports, {
  NostrRelay: () => NostrRelay,
  configure: () => configure,
  nosft: () => nosft
});
module.exports = __toCommonJS(topether21_nosft_core_exports);

// src/utils/httpService.ts
var import_axios = __toESM(require("axios"));
var ApiService = class {
  _instance;
  constructor(baseURL) {
    this._instance = import_axios.default.create({
      baseURL,
      headers: {
        "Content-type": "application/json"
      }
    });
  }
  setHeader(key, value) {
    this._instance.defaults.headers.common[key] = value;
  }
  async query(resource, params) {
    const result = await this._instance.get(resource, params);
    return result.data;
  }
  async get(resource, slug = "") {
    const result = await this._instance.get(`${resource}/${slug}`);
    return result.data;
  }
  async post(resource, params) {
    const result = await this._instance.post(`${resource}`, params);
    return result.data;
  }
  async update(resource, slug, params) {
    const result = await this._instance.put(`${resource}/${slug}`, params);
    return result.data;
  }
  async put(resource, params) {
    const result = await this._instance.put(`${resource}`, params);
    return result.data;
  }
  delete(resource) {
    return this._instance.delete(resource);
  }
};
var httpService_default = ApiService;

// src/config/constants.ts
var TESTNET = false;
var NOSTR_RELAY_URL = "wss://nostr.openordex.org";
var NOSTR_KIND_INSCRIPTION = 802;
var NOSFT_API_URL = (network2) => network2 === "testnet" ? "https://nosft.xyz/api/" : "https://nosft.xyz/api/";

// src/services/nosft.ts
var Nosft = class extends httpService_default {
  constructor(config) {
    const apiUrl = config?.baseUrl || NOSFT_API_URL(config?.network);
    if (!apiUrl) {
      throw new Error("DEEZY_API_URL is not defined");
    }
    super(apiUrl);
  }
  async getAddressInscriptions({
    offset = 0,
    limit = 5,
    address
  }) {
    return this.query(`/inscriptions/${address}`, {
      offset,
      limit
    });
  }
};
function get(config) {
  return new Nosft(config);
}

// src/services/relay.ts
var import_nostr_tools = require("nostr-tools");

// src/services/open-ordex.ts
var bitcoin = __toESM(require("bitcoinjs-lib"));
var import_axios2 = __toESM(require("axios"));
var isProduction = !TESTNET;
var ordinalsExplorerUrl = isProduction ? "https://ordinals.com" : "https://explorer-signet.openordex.org";
var network = isProduction ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
var baseMempoolUrl = isProduction ? "https://mempool.space" : "https://mempool.space/signet";
var baseMempoolApiUrl = `${baseMempoolUrl}/api`;
var bitcoinPriceApiUrl = "https://blockchain.info/ticker?cors=true";
function isSaleOrder(order) {
  return order.tags.find((x) => x?.[0] == "s")?.[1];
}
function getInscriptionId(order) {
  return order.tags.find((x) => x?.[0] == "i")?.[1] || "";
}
function isProcessed(orders, inscriptionId) {
  return orders.find((x) => x.id === inscriptionId);
}
async function getInscriptionHtml(inscriptionId) {
  const response = await import_axios2.default.get(`${ordinalsExplorerUrl}/inscription/${inscriptionId}`);
  const html = response.data;
  return html;
}
async function getInscriptionDataById(inscriptionId, verifyIsInscriptionNumber) {
  const html = await getInscriptionHtml(inscriptionId);
  const data = [...html.matchAll(/<dt>(.*?)<\/dt>\s*<dd.*?>(.*?)<\/dd>/gm)].map((x) => {
    x[2] = x[2].replace(/<.*?>/gm, "");
    return x;
  }).reduce((a, b) => ({ ...a, [b[1]]: b[2] }), {});
  const error = `Inscription ${verifyIsInscriptionNumber || inscriptionId} not found (maybe you're on signet and looking for a mainnet inscription or vice versa)`;
  let inscriptionNumber;
  try {
    const numberMatch = html.match(/<h1>Inscription (\d*)<\/h1>/);
    if (numberMatch) {
      inscriptionNumber = numberMatch[1];
    } else {
      console.error(`Failed to find inscription number for ID ${inscriptionId}`);
    }
  } catch (error2) {
    console.error(`Failed to parse inscription data for ID ${inscriptionId}: ${error2}`);
  }
  if (verifyIsInscriptionNumber && String(inscriptionNumber) !== verifyIsInscriptionNumber) {
    throw new Error(error);
  }
  return { ...data, number: inscriptionNumber || "" };
}
async function fetchBitcoinPrice() {
  const bitcoinPriceResponse = await import_axios2.default.get(bitcoinPriceApiUrl);
  const bitcoinPriceData = bitcoinPriceResponse.data;
  const bitcoinPrice = bitcoinPriceData.USD.last;
  const recommendedFeeRateResponse = await import_axios2.default.get(`${baseMempoolApiUrl}/v1/fees/recommended`);
  const recommendedFeeRateData = recommendedFeeRateResponse.data;
  const recommendedFeeRate = recommendedFeeRateData["hourFee" /* HourFee */];
  return { bitcoinPrice, recommendedFeeRate };
}
function satToBtc(sat) {
  return Number(sat) / 10 ** 8;
}
function satsToFormattedDollarString(sats, bitcoinPrice) {
  const btc = satToBtc(sats);
  const usd = btc * bitcoinPrice;
  return usd.toLocaleString(void 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
var OpenOrdexFactory = class {
  bitcoinPrice;
  recommendedFeeRate;
  sellerSignedPsbt;
  price;
  constructor() {
    this.bitcoinPrice = void 0;
    this.recommendedFeeRate = void 0;
    this.sellerSignedPsbt = void 0;
    this.price = void 0;
    try {
      this.initBitcoinPrice();
    } catch (err) {
    }
  }
  async initBitcoinPrice() {
    const { bitcoinPrice, recommendedFeeRate } = await fetchBitcoinPrice();
    this.bitcoinPrice = bitcoinPrice;
    this.recommendedFeeRate = recommendedFeeRate;
  }
  async getBitcoinPrice() {
    if (!this.bitcoinPrice) {
      await this.initBitcoinPrice();
    }
    if (!this.bitcoinPrice)
      throw new Error(`Error getting Bitcoin price`);
    return this.bitcoinPrice;
  }
  async validateSellerPSBTAndExtractPrice(sellerSignedPsbtBase64, utxo) {
    try {
      this.sellerSignedPsbt = bitcoin.Psbt.fromBase64(sellerSignedPsbtBase64, {
        network
      });
      const sellerInput = this.sellerSignedPsbt.txInputs[0];
      const sellerSignedPsbtInput = `${sellerInput.hash.reverse().toString("hex")}:${sellerInput.index}`;
      if (sellerSignedPsbtInput !== utxo) {
        throw `Seller signed PSBT does not match this inscription

${sellerSignedPsbtInput}
!=
${utxo}`;
      }
      if (this.sellerSignedPsbt.txInputs.length !== 1 || this.sellerSignedPsbt.txInputs.length !== 1) {
        throw `Invalid seller signed PSBT`;
      }
      try {
        await this.sellerSignedPsbt.extractTransaction(true);
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "Not finalized") {
            throw "PSBT not signed";
          } else if (e.message !== "Outputs are spending more than Inputs") {
            throw "Invalid PSBT " + e.message;
          }
        } else {
          throw "Invalid PSBT " + e;
        }
      }
      const sellerOutput = this.sellerSignedPsbt.txOutputs[0];
      this.price = sellerOutput.value;
      return Number(this.price);
    } catch (e) {
      console.error(e);
    }
  }
  async parseOrderEvent(order, orders = []) {
    if (!isSaleOrder(order))
      return;
    const inscriptionId = getInscriptionId(order);
    if (isProcessed(orders, inscriptionId))
      return;
    const inscriptionDataResponse = await import_axios2.default.get(
      `https://turbo.ordinalswallet.com/inscription/${inscriptionId}`
    );
    const inscriptionData = inscriptionDataResponse.data;
    const inscriptionRawData = await getInscriptionDataById(inscriptionId);
    const validatedPrice = await this.validateSellerPSBTAndExtractPrice(order.content, inscriptionRawData.output);
    if (!validatedPrice)
      return;
    const btcPrice = await this.getBitcoinPrice();
    const newOrder = {
      title: `$${satsToFormattedDollarString(validatedPrice, btcPrice)}`,
      txid: order.id,
      inscriptionId,
      value: validatedPrice,
      usdPrice: `$${satsToFormattedDollarString(validatedPrice, btcPrice)}`,
      ...order,
      ...inscriptionData
    };
    return newOrder;
  }
};
var openOrdex = new OpenOrdexFactory();

// src/services/relay.ts
var NostrRelay = class {
  pool;
  subs;
  relays;
  subscriptionOrders;
  constructor() {
    this.pool = new import_nostr_tools.SimplePool();
    this.subs = [];
    this.relays = [];
    this.subscriptionOrders = null;
  }
  getSubscriptionOrders() {
    return this.subscriptionOrders;
  }
  setRelays(relays) {
    this.relays = [...relays];
  }
  unsubscribeOrders() {
    if (this.subscriptionOrders) {
      this.subs = this.subs.filter((sub) => sub !== this.subscriptionOrders);
      this.subscriptionOrders.unsub();
      this.subscriptionOrders = null;
    }
  }
  subscribeOrders({ limit = 10, onOrder, onEose, relays = [NOSTR_RELAY_URL] }) {
    try {
      this.unsubscribeOrders();
      this.setRelays(relays);
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
      throw error;
    }
  }
  subscribe(filter, onEvent, onEose) {
    if (!this.relays.length)
      throw new Error("No relays configured, please call setRelays([<url>,...[<url>]]) first");
    const sub = this.pool.sub([...this.relays], filter);
    sub.on("event", onEvent);
    sub.on("eose", onEose);
    this.subs.push(sub);
    return sub;
  }
};

// index.ts
function configure({ network: network2, nosftBaseUrl }) {
  const nosftService = get({ baseUrl: nosftBaseUrl, network: network2 });
  return {
    nosft: nosftService
  };
}
var nosft = get();
