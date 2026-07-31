import assert from "node:assert/strict";
import {
    calculateGoldToTRY,
    calculatePortfolioTotal,
    calculateSpread,
    calculateSpreadPercent,
    calculateTRYToGold,
    deriveGoldPricesFromHasAltin,
    formatTRY,
    getPureGoldGram,
} from "@/lib/gold/goldCalculations";

const prices = deriveGoldPricesFromHasAltin({ buy: 1000, sell: 1100 }, 0);

function approx(actual: number, expected: number, tolerance = 0.001) {
    assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} !== ${expected}`);
}

assert.equal(calculateGoldToTRY({ prices, goldType: "gram24k", amount: 2, transactionType: "buy" }), 2200);
assert.equal(calculateGoldToTRY({ prices, goldType: "gram24k", amount: 2, transactionType: "sell" }), 2000);

assert.equal(calculateGoldToTRY({ prices, goldType: "gram22k", amount: 10, transactionType: "sell" }), 9170);
assert.equal(calculateGoldToTRY({ prices, goldType: "gram18k", amount: 10, transactionType: "sell" }), 7500);
assert.equal(calculateGoldToTRY({ prices, goldType: "gram14k", amount: 10, transactionType: "sell" }), 5830);
assert.equal(calculateGoldToTRY({ prices, goldType: "ceyrek", amount: 1, transactionType: "sell" }), 1604);

assert.equal(calculateSpread(1000, 1100), 100);
assert.equal(calculateSpreadPercent(1000, 1100), 10);

approx(calculateTRYToGold({ prices, goldType: "gram24k", tryAmount: 11000, transactionType: "buy" }), 10);

assert.equal(
    calculatePortfolioTotal(
        [
            { id: "a", goldType: "ceyrek", amount: 3 },
            { id: "b", goldType: "gram22k", amount: 10 },
            { id: "c", goldType: "gram24k", amount: 2 },
        ],
        prices,
        "sell"
    ),
    15982
);

approx(getPureGoldGram("gram22k", 10), 9.17);
assert.equal(formatTRY(1234.5), "₺1.234,50");
assert.equal(Number.isNaN(calculateTRYToGold({ prices, goldType: "gram24k", tryAmount: 0 })), false);

console.log("goldCalculations tests passed");
