export type FxRateSourceStatus = "live" | "cache" | "fallback" | "unavailable";

export type CurrencyCode =
    | "USD"
    | "EUR"
    | "GBP"
    | "CHF"
    | "JPY"
    | "SAR"
    | "AED"
    | "KWD"
    | "CAD"
    | "AUD";

export type FxTransactionType = "buy" | "sell";

export interface FxBuySellRate {
    buy: number;
    sell: number;
}

export interface FxRateCache {
    base: "TRY";
    rates: Record<CurrencyCode, FxBuySellRate>;
    updatedAt: string;
    sourceName: string;
    sourceStatus: FxRateSourceStatus;
    stale: boolean;
}

export interface FxCurrencyInfo {
    code: CurrencyCode;
    name: string;
    shortName: string;
    symbol: string;
}
