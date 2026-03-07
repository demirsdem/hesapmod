export type LoanOfferResult = {
    id: "offerOne" | "offerTwo" | "offerThree";
    label: string;
    monthlyRate: number;
    term: number;
    fee: number;
    installment: number;
    totalRepayment: number;
    totalCost: number;
    interestCost: number;
    feeRatio: number;
};

type LocalizedText = {
    tr: string;
    en: string;
};

export type LoanComparisonResult = {
    offerOneInstallment: number;
    offerOneTotalCost: number;
    offerTwoInstallment: number;
    offerTwoTotalCost: number;
    offerThreeInstallment: number;
    offerThreeTotalCost: number;
    bestOffer: LocalizedText;
    savingsVsWorst: number;
    offers: LoanOfferResult[];
    bestOfferId: LoanOfferResult["id"];
    lowestInstallmentId: LoanOfferResult["id"];
    highestCostId: LoanOfferResult["id"];
    spreadMonthly: number;
    spreadTotal: number;
};

function toNumber(value: unknown) {
    const parsed = Number.parseFloat(String(value ?? 0));
    return Number.isFinite(parsed) ? parsed : 0;
}

function buildOffer(
    id: LoanOfferResult["id"],
    label: string,
    loanAmount: number,
    rateValue: unknown,
    termValue: unknown,
    feeValue: unknown,
) {
    const monthlyRate = toNumber(rateValue) / 100;
    const term = Math.max(0, Math.round(toNumber(termValue)));
    const fee = toNumber(feeValue);

    let installment = 0;
    if (loanAmount > 0 && term > 0) {
        if (monthlyRate > 0) {
            const powered = Math.pow(1 + monthlyRate, term);
            installment = loanAmount * monthlyRate * powered / (powered - 1);
        } else {
            installment = loanAmount / term;
        }
    }

    const totalRepayment = installment * term;
    const totalCost = totalRepayment + fee;
    const interestCost = Math.max(0, totalRepayment - loanAmount);
    const feeRatio = totalCost > 0 ? fee / totalCost : 0;

    return {
        id,
        label,
        monthlyRate,
        term,
        fee,
        installment,
        totalRepayment,
        totalCost,
        interestCost,
        feeRatio,
    } satisfies LoanOfferResult;
}

export function calculateLoanComparison(values: Record<string, unknown>): LoanComparisonResult {
    const loanAmount = toNumber(values.loanAmount);

    const offers = [
        buildOffer("offerOne", "Teklif 1", loanAmount, values.offerOneRate, values.offerOneTerm, values.offerOneFee),
        buildOffer("offerTwo", "Teklif 2", loanAmount, values.offerTwoRate, values.offerTwoTerm, values.offerTwoFee),
        buildOffer("offerThree", "Teklif 3", loanAmount, values.offerThreeRate, values.offerThreeTerm, values.offerThreeFee),
    ];

    const best = [...offers].sort((a, b) => a.totalCost - b.totalCost)[0];
    const worst = [...offers].sort((a, b) => b.totalCost - a.totalCost)[0];
    const lowestInstallment = [...offers].sort((a, b) => a.installment - b.installment)[0];
    const savingsVsWorst = Math.max(0, worst.totalCost - best.totalCost);
    const spreadMonthly = Math.max(...offers.map((offer) => offer.installment)) - Math.min(...offers.map((offer) => offer.installment));
    const spreadTotal = worst.totalCost - best.totalCost;

    return {
        offerOneInstallment: offers[0].installment,
        offerOneTotalCost: offers[0].totalCost,
        offerTwoInstallment: offers[1].installment,
        offerTwoTotalCost: offers[1].totalCost,
        offerThreeInstallment: offers[2].installment,
        offerThreeTotalCost: offers[2].totalCost,
        bestOffer: {
            tr: `${best.label}, toplam maliyette en avantajlı seçenek görünüyor.`,
            en: `${best.label} appears to be the most economical option in total cost.`,
        },
        savingsVsWorst,
        offers,
        bestOfferId: best.id,
        lowestInstallmentId: lowestInstallment.id,
        highestCostId: worst.id,
        spreadMonthly,
        spreadTotal,
    };
}