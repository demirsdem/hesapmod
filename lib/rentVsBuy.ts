export type RentVsBuyWinner = "owner" | "renter" | "tie";

type LocalizedText = {
    tr: string;
    en: string;
};

export type RentVsBuyResult = {
    monthlyMortgagePayment: number;
    ownerCashOutflow: number;
    renterCashOutflow: number;
    ownerEquity: number;
    renterPortfolio: number;
    comparisonGap: number;
    summary: LocalizedText;
    winner: RentVsBuyWinner;
    signedGap: number;
    homeValueAfterPeriod: number;
    remainingPrincipal: number;
    financedAmount: number;
    monthlyOwnerCostStart: number;
    monthlyOwnerCostEnd: number;
    monthlyRentStart: number;
    monthlyRentEnd: number;
    monthlyCostDifferenceStart: number;
    monthlyCostDifferenceEnd: number;
};

function toNumber(value: unknown) {
    const parsed = Number.parseFloat(String(value ?? 0));
    return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateRentVsBuy(values: Record<string, unknown>): RentVsBuyResult {
    const homePrice = toNumber(values.homePrice);
    const downPayment = toNumber(values.downPayment);
    const mortgageRate = toNumber(values.mortgageRate) / 100;
    const mortgageTermYears = toNumber(values.mortgageTermYears);
    const monthlyRent = toNumber(values.monthlyRent);
    const annualRentIncrease = toNumber(values.annualRentIncrease) / 100;
    const monthlyOwnerCosts = toNumber(values.monthlyOwnerCosts);
    const annualHomeAppreciation = toNumber(values.annualHomeAppreciation) / 100;
    const annualInvestmentReturn = toNumber(values.annualInvestmentReturn) / 100;
    const analysisYears = toNumber(values.analysisYears);

    const financedAmount = Math.max(0, homePrice - downPayment);
    const mortgageMonths = Math.max(0, Math.round(mortgageTermYears * 12));
    const analysisMonths = Math.max(0, Math.round(analysisYears * 12));
    const monthlyInvestmentReturn = Math.pow(1 + annualInvestmentReturn, 1 / 12) - 1;

    let monthlyMortgagePayment = 0;
    if (financedAmount > 0 && mortgageMonths > 0) {
        if (mortgageRate > 0) {
            const powered = Math.pow(1 + mortgageRate, mortgageMonths);
            monthlyMortgagePayment = financedAmount * mortgageRate * powered / (powered - 1);
        } else {
            monthlyMortgagePayment = financedAmount / mortgageMonths;
        }
    }

    const monthlyOwnerCostStart = monthlyMortgagePayment + monthlyOwnerCosts;
    let ownerCashOutflow = downPayment;
    let renterCashOutflow = 0;
    let renterPortfolio = downPayment;
    let monthlyRentEnd = monthlyRent;
    let monthlyOwnerCostEnd = monthlyOwnerCostStart;

    for (let month = 1; month <= analysisMonths; month += 1) {
        const yearIndex = Math.floor((month - 1) / 12);
        const currentRent = monthlyRent * Math.pow(1 + annualRentIncrease, yearIndex);
        const currentOwnerCost = (month <= mortgageMonths ? monthlyMortgagePayment : 0) + monthlyOwnerCosts;
        const monthlyDifference = currentOwnerCost - currentRent;

        ownerCashOutflow += currentOwnerCost;
        renterCashOutflow += currentRent;
        renterPortfolio = renterPortfolio * (1 + monthlyInvestmentReturn) + monthlyDifference;

        monthlyRentEnd = currentRent;
        monthlyOwnerCostEnd = currentOwnerCost;
    }

    let remainingPrincipal = financedAmount;
    if (mortgageMonths > 0) {
        if (analysisMonths >= mortgageMonths) {
            remainingPrincipal = 0;
        } else if (mortgageRate > 0) {
            remainingPrincipal = financedAmount * (
                Math.pow(1 + mortgageRate, mortgageMonths) - Math.pow(1 + mortgageRate, analysisMonths)
            ) / (
                Math.pow(1 + mortgageRate, mortgageMonths) - 1
            );
        } else {
            remainingPrincipal = financedAmount * (1 - (analysisMonths / mortgageMonths));
        }
    }

    const homeValueAfterPeriod = homePrice * Math.pow(1 + annualHomeAppreciation, analysisYears);
    const ownerEquity = Math.max(0, homeValueAfterPeriod - Math.max(0, remainingPrincipal));
    const signedGap = ownerEquity - renterPortfolio;
    const comparisonGap = Math.abs(signedGap);

    let winner: RentVsBuyWinner = "tie";
    if (signedGap > 1) {
        winner = "owner";
    } else if (signedGap < -1) {
        winner = "renter";
    }

    let summaryTr = "İki senaryonun dönem sonu finansal sonucu birbirine oldukça yakın görünüyor.";
    let summaryEn = "The two scenarios end up very close financially by the end of the analysis period.";

    if (winner === "owner") {
        summaryTr = `Bu varsayımlarda ${analysisYears} yıl sonunda ev sahibi senaryosu yaklaşık ${comparisonGap.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL daha güçlü görünüyor.`;
        summaryEn = `Under these assumptions, the home ownership scenario ends about ${comparisonGap.toLocaleString("en-US", { maximumFractionDigits: 0 })} TL ahead after ${analysisYears} years.`;
    }

    if (winner === "renter") {
        summaryTr = `Bu varsayımlarda ${analysisYears} yıl sonunda kirada kalıp farkı yatırıma yönlendirme senaryosu yaklaşık ${comparisonGap.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL daha avantajlı görünüyor.`;
        summaryEn = `Under these assumptions, renting and investing the difference ends about ${comparisonGap.toLocaleString("en-US", { maximumFractionDigits: 0 })} TL ahead after ${analysisYears} years.`;
    }

    return {
        monthlyMortgagePayment,
        ownerCashOutflow,
        renterCashOutflow,
        ownerEquity,
        renterPortfolio,
        comparisonGap,
        summary: {
            tr: summaryTr,
            en: summaryEn,
        },
        winner,
        signedGap,
        homeValueAfterPeriod,
        remainingPrincipal: Math.max(0, remainingPrincipal),
        financedAmount,
        monthlyOwnerCostStart,
        monthlyOwnerCostEnd,
        monthlyRentStart: monthlyRent,
        monthlyRentEnd,
        monthlyCostDifferenceStart: monthlyOwnerCostStart - monthlyRent,
        monthlyCostDifferenceEnd: monthlyOwnerCostEnd - monthlyRentEnd,
    };
}