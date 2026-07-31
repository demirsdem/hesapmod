import {
    calculateBsmvAmount,
    calculateCrossRate,
    calculateFxToTRY,
    calculateSpread,
    calculateSpreadPercent,
    calculateTRYToFx,
    calculateTotalWithBsmv,
    formatTRY,
} from "@/lib/fx/fxCalculations";
import type { CurrencyCode, FxBuySellRate } from "@/lib/fx/fxPriceTypes";

const rates: Record<CurrencyCode, FxBuySellRate> = {
    USD: { buy: 40, sell: 42 },
    EUR: { buy: 50, sell: 52 },
    GBP: { buy: 60, sell: 63 },
    CHF: { buy: 44, sell: 46 },
    JPY: { buy: 0.25, sell: 0.26 },
    SAR: { buy: 10, sell: 10.5 },
    AED: { buy: 11, sell: 11.5 },
    KWD: { buy: 130, sell: 135 },
    CAD: { buy: 30, sell: 31 },
    AUD: { buy: 28, sell: 29 },
};

function assertEqual(actual: number, expected: number, message: string) {
    if (Math.abs(actual - expected) > 0.000001) {
        throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
}

function assertFinite(value: number, message: string) {
    if (!Number.isFinite(value)) {
        throw new Error(`${message}: expected finite, got ${value}`);
    }
}

assertEqual(calculateFxToTRY({ rates, currency: "USD", amount: 100, transactionType: "sell" }), 4000, "USD to TRY uses buy rate when selling");
assertEqual(calculateFxToTRY({ rates, currency: "EUR", amount: 2, transactionType: "sell" }), 100, "EUR to TRY works");
assertEqual(calculateFxToTRY({ rates, currency: "GBP", amount: 3, transactionType: "sell" }), 180, "GBP to TRY works");
assertEqual(calculateTRYToFx({ rates, currency: "USD", tryAmount: 4200, transactionType: "buy" }), 100, "TRY to USD uses sell rate");
assertEqual(calculateTRYToFx({ rates, currency: "EUR", tryAmount: 5200, transactionType: "buy" }), 100, "TRY to EUR uses sell rate");
assertEqual(calculateFxToTRY({ rates, currency: "USD", amount: 10, transactionType: "buy" }), 420, "buy mode uses sell rate");
assertEqual(calculateFxToTRY({ rates, currency: "USD", amount: 10, transactionType: "sell" }), 400, "sell mode uses buy rate");
assertEqual(calculateSpread(40, 42), 2, "spread amount");
assertEqual(calculateSpreadPercent(40, 42), 5, "spread percent");
assertEqual(calculateCrossRate({ rates, fromCurrency: "USD", toCurrency: "EUR", amount: 1 }), 41 / 51, "USD to EUR cross");
assertEqual(calculateCrossRate({ rates, fromCurrency: "EUR", toCurrency: "USD", amount: 1 }), 51 / 41, "EUR to USD cross");
assertEqual(calculateBsmvAmount(10000, 0.002), 20, "BSMV amount");
assertEqual(calculateTotalWithBsmv(10000, 0.002), 10020, "total with BSMV");

assertFinite(calculateTRYToFx({ rates, currency: "USD", tryAmount: Number.NaN, transactionType: "buy" }), "NaN input is safe");
assertFinite(calculateCrossRate({ rates, fromCurrency: "USD", toCurrency: "EUR", amount: Number.POSITIVE_INFINITY }), "Infinity input is safe");

if (!formatTRY(1234.56).includes("₺") && !formatTRY(1234.56).includes("TL")) {
    throw new Error("formatTRY should produce Turkish currency output");
}

console.log("fxCalculations tests passed");
