import type { CurrencyCode, FxBuySellRate, FxTransactionType } from "@/lib/fx/fxPriceTypes";

export const FX_CURRENCY_INFO: Record<CurrencyCode, { name: string; shortName: string; symbol: string }> = {
    USD: { name: "Amerikan Doları", shortName: "Dolar", symbol: "$" },
    EUR: { name: "Euro", shortName: "Euro", symbol: "€" },
    GBP: { name: "İngiliz Sterlini", shortName: "Sterlin", symbol: "£" },
    CHF: { name: "İsviçre Frangı", shortName: "Frank", symbol: "Fr" },
    JPY: { name: "Japon Yeni", shortName: "Yen", symbol: "¥" },
    SAR: { name: "Suudi Riyali", shortName: "Riyal", symbol: "﷼" },
    AED: { name: "BAE Dirhemi", shortName: "Dirhem", symbol: "د.إ" },
    KWD: { name: "Kuveyt Dinarı", shortName: "Dinar", symbol: "د.ك" },
    CAD: { name: "Kanada Doları", shortName: "Kanada Doları", symbol: "C$" },
    AUD: { name: "Avustralya Doları", shortName: "Avustralya Doları", symbol: "A$" },
};

export const FX_CURRENCY_ORDER: CurrencyCode[] = ["USD", "EUR", "GBP", "CHF", "JPY", "SAR", "AED", "KWD", "CAD", "AUD"];

function finiteOrZero(value: number) {
    return Number.isFinite(value) && value > 0 ? value : 0;
}

export function getFxRate(
    rates: Record<CurrencyCode, FxBuySellRate>,
    currency: CurrencyCode,
    transactionType: FxTransactionType
) {
    const rate = rates[currency];
    if (!rate) return 0;
    return finiteOrZero(transactionType === "buy" ? rate.sell : rate.buy);
}

export function calculateFxToTRY(params: {
    rates: Record<CurrencyCode, FxBuySellRate>;
    currency: CurrencyCode;
    amount: number;
    transactionType: FxTransactionType;
}) {
    return finiteOrZero(params.amount) * getFxRate(params.rates, params.currency, params.transactionType);
}

export function calculateTRYToFx(params: {
    rates: Record<CurrencyCode, FxBuySellRate>;
    currency: CurrencyCode;
    tryAmount: number;
    transactionType: FxTransactionType;
}) {
    const rate = getFxRate(params.rates, params.currency, params.transactionType);
    return rate > 0 ? finiteOrZero(params.tryAmount) / rate : 0;
}

export function calculateCrossRate(params: {
    rates: Record<CurrencyCode, FxBuySellRate>;
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    amount: number;
}) {
    if (params.fromCurrency === params.toCurrency) return finiteOrZero(params.amount);
    const fromMid = getMidRate(params.rates[params.fromCurrency]);
    const toMid = getMidRate(params.rates[params.toCurrency]);
    return toMid > 0 ? finiteOrZero(params.amount) * (fromMid / toMid) : 0;
}

export function getMidRate(rate: FxBuySellRate | undefined) {
    if (!rate) return 0;
    return finiteOrZero((rate.buy + rate.sell) / 2);
}

export function calculateSpread(buy: number, sell: number) {
    return Math.max(0, finiteOrZero(sell) - finiteOrZero(buy));
}

export function calculateSpreadPercent(buy: number, sell: number) {
    const safeBuy = finiteOrZero(buy);
    return safeBuy > 0 ? (calculateSpread(buy, sell) / safeBuy) * 100 : 0;
}

export function calculateBsmvAmount(amountTRY: number, bsmvRate: number) {
    return finiteOrZero(amountTRY) * Math.max(0, bsmvRate);
}

export function calculateTotalWithBsmv(amountTRY: number, bsmvRate: number) {
    const safeAmount = finiteOrZero(amountTRY);
    return safeAmount + calculateBsmvAmount(safeAmount, bsmvRate);
}

export function formatTRY(value: number) {
    return finiteOrZero(value).toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatCurrencyAmount(value: number, currency: CurrencyCode) {
    return `${finiteOrZero(value).toLocaleString("tr-TR", {
        minimumFractionDigits: currency === "JPY" ? 0 : 2,
        maximumFractionDigits: currency === "JPY" ? 0 : 4,
    })} ${currency}`;
}

export function formatRate(value: number) {
    return finiteOrZero(value).toLocaleString("tr-TR", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    });
}

export function formatPercent(value: number) {
    return `%${finiteOrZero(value).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
