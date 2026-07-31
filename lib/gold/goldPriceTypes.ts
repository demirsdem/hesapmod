export type GoldPriceSourceStatus = "live" | "cache" | "fallback" | "unavailable";

export type GoldTypeId =
    | "hasAltin"
    | "gram24k"
    | "gram22k"
    | "gram18k"
    | "gram14k"
    | "ceyrek"
    | "yarim"
    | "tam"
    | "cumhuriyet"
    | "ata"
    | "resat"
    | "gremse"
    | "ons";

export type TransactionType = "buy" | "sell";

export interface GoldBuySellPrice {
    buy: number;
    sell: number;
}

export interface GoldPriceCache {
    prices: Record<GoldTypeId, GoldBuySellPrice>;
    updatedAt: string;
    sourceName: string;
    sourceStatus: GoldPriceSourceStatus;
    stale: boolean;
}

export interface GoldTypeInfo {
    id: GoldTypeId;
    name: string;
    shortName: string;
    karat: string;
    totalWeight: number;
    pureGold: number;
    alloy: number;
    unit: "gram" | "adet" | "ons";
    isCoin: boolean;
}

export interface PortfolioGoldItem {
    id: string;
    goldType: GoldTypeId;
    amount: number;
}
