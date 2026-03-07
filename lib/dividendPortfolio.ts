export type DividendPortfolioResult = {
    totalDividend: number;
    dividendYield: number;
    capitalGain: number;
    totalReturn: number;
    totalCostBasis: number;
    currentMarketValue: number;
    currentYield: number;
    totalReturnRate: number;
    breakevenPriceAfterDividend: number;
    outlook: "profit" | "loss" | "flat";
    summary: {
        tr: string;
        en: string;
    };
};

function toNumber(value: unknown) {
    return Number.parseFloat(String(value ?? "")) || 0;
}

export function calculateDividendPortfolio(values: Record<string, unknown>): DividendPortfolioResult {
    const shareCount = Math.max(0, toNumber(values.shareCount));
    const avgCost = Math.max(0, toNumber(values.avgCost));
    const currentPrice = Math.max(0, toNumber(values.currentPrice));
    const dividendPerShare = Math.max(0, toNumber(values.dividendPerShare));

    const totalCostBasis = shareCount * avgCost;
    const currentMarketValue = shareCount * currentPrice;
    const totalDividend = shareCount * dividendPerShare;
    const capitalGain = currentMarketValue - totalCostBasis;
    const totalReturn = totalDividend + capitalGain;
    const dividendYield = avgCost > 0 ? (dividendPerShare / avgCost) * 100 : 0;
    const currentYield = currentPrice > 0 ? (dividendPerShare / currentPrice) * 100 : 0;
    const totalReturnRate = totalCostBasis > 0 ? (totalReturn / totalCostBasis) * 100 : 0;
    const breakevenPriceAfterDividend = Math.max(0, avgCost - dividendPerShare);
    const outlook = totalReturn > 0 ? "profit" : totalReturn < 0 ? "loss" : "flat";

    return {
        totalDividend,
        dividendYield,
        capitalGain,
        totalReturn,
        totalCostBasis,
        currentMarketValue,
        currentYield,
        totalReturnRate,
        breakevenPriceAfterDividend,
        outlook,
        summary: {
            tr: `Portföyünüz ${totalDividend.toFixed(2)} TL net temettü ve ${capitalGain.toFixed(2)} TL fiyat farkı ile toplam ${totalReturn.toFixed(2)} TL sonuç üretiyor.`,
            en: `Your portfolio generates ${totalDividend.toFixed(2)} TL in net dividends and ${capitalGain.toFixed(2)} TL in price change for a total outcome of ${totalReturn.toFixed(2)} TL.`,
        },
    };
}
