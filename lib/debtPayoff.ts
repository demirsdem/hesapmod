export type DebtPayoffStrategy = "avalanche" | "snowball";

type DebtInput = {
    id: string;
    balance: number;
    rate: number;
    minPayment: number;
};

type MutableDebt = DebtInput & {
    remainingBalance: number;
};

export type DebtStrategyResult = {
    strategy: DebtPayoffStrategy;
    months: number;
    totalInterest: number;
    totalPaid: number;
    feasible: boolean;
    firstTargetId: string | null;
    payoffOrder: string[];
};

export type DebtPayoffResult = {
    monthsToDebtFree: { tr: string; en: string };
    totalInterestPaid: number;
    totalPaid: number;
    alternativeInterestGap: number;
    summary: { tr: string; en: string };
    selectedStrategy: DebtPayoffStrategy;
    alternativeStrategy: DebtPayoffStrategy;
    selected: DebtStrategyResult;
    alternative: DebtStrategyResult;
    recommendedStrategy: DebtPayoffStrategy;
    totalStartingBalance: number;
    minimumBudget: number;
    extraPayment: number;
};

function toNumber(value: unknown) {
    return Number.parseFloat(String(value ?? "")) || 0;
}

function buildDebts(values: Record<string, unknown>): DebtInput[] {
    return [
        {
            id: "debtOne",
            balance: toNumber(values.debtOneBalance),
            rate: toNumber(values.debtOneRate) / 100,
            minPayment: toNumber(values.debtOneMinPayment),
        },
        {
            id: "debtTwo",
            balance: toNumber(values.debtTwoBalance),
            rate: toNumber(values.debtTwoRate) / 100,
            minPayment: toNumber(values.debtTwoMinPayment),
        },
        {
            id: "debtThree",
            balance: toNumber(values.debtThreeBalance),
            rate: toNumber(values.debtThreeRate) / 100,
            minPayment: toNumber(values.debtThreeMinPayment),
        },
    ].filter((debt) => debt.balance > 0);
}

function sortDebts(debts: MutableDebt[], strategy: DebtPayoffStrategy) {
    return [...debts].sort((left, right) => {
        if (strategy === "snowball") {
            if (left.remainingBalance !== right.remainingBalance) {
                return left.remainingBalance - right.remainingBalance;
            }
            return right.rate - left.rate;
        }

        if (left.rate !== right.rate) {
            return right.rate - left.rate;
        }

        return left.remainingBalance - right.remainingBalance;
    });
}

function simulateStrategy(
    sourceDebts: DebtInput[],
    extraPayment: number,
    strategy: DebtPayoffStrategy
): DebtStrategyResult {
    const debts: MutableDebt[] = sourceDebts.map((debt) => ({
        ...debt,
        remainingBalance: debt.balance,
    }));

    if (debts.length === 0) {
        return {
            strategy,
            months: 0,
            totalInterest: 0,
            totalPaid: 0,
            feasible: true,
            firstTargetId: null,
            payoffOrder: [],
        };
    }

    let months = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    let firstTargetId: string | null = null;
    const payoffOrder: string[] = [];
    const maxMonths = 600;

    while (debts.some((debt) => debt.remainingBalance > 0.01) && months < maxMonths) {
        months += 1;
        let availableExtra = extraPayment;
        const activeDebts = debts.filter((debt) => debt.remainingBalance > 0.01);

        for (const debt of activeDebts) {
            const interest = debt.remainingBalance * debt.rate;
            debt.remainingBalance += interest;
            totalInterest += interest;
        }

        for (const debt of activeDebts) {
            const payment = Math.min(debt.minPayment, debt.remainingBalance);
            debt.remainingBalance -= payment;
            totalPaid += payment;
        }

        const sortedTargets = sortDebts(activeDebts.filter((debt) => debt.remainingBalance > 0.01), strategy);
        if (!firstTargetId && sortedTargets.length > 0) {
            firstTargetId = sortedTargets[0].id;
        }

        for (const debt of sortedTargets) {
            if (availableExtra <= 0) {
                break;
            }
            if (debt.remainingBalance <= 0.01) {
                continue;
            }

            const payment = Math.min(availableExtra, debt.remainingBalance);
            debt.remainingBalance -= payment;
            totalPaid += payment;
            availableExtra -= payment;
        }

        for (const debt of activeDebts) {
            if (debt.remainingBalance <= 0.01 && !payoffOrder.includes(debt.id)) {
                payoffOrder.push(debt.id);
            }
        }

        const endBalance = debts.reduce((sum, debt) => sum + Math.max(0, debt.remainingBalance), 0);
        const requiredMinimum = debts.reduce(
            (sum, debt) => sum + Math.min(debt.minPayment, Math.max(0, debt.remainingBalance)),
            0
        );

        if (months === 1 && endBalance > 0 && requiredMinimum + extraPayment <= totalInterest) {
            return {
                strategy,
                months,
                totalInterest,
                totalPaid,
                feasible: false,
                firstTargetId,
                payoffOrder,
            };
        }
    }

    return {
        strategy,
        months,
        totalInterest,
        totalPaid,
        feasible: !debts.some((debt) => debt.remainingBalance > 0.01),
        firstTargetId,
        payoffOrder,
    };
}

export function calculateDebtPayoff(values: Record<string, unknown>): DebtPayoffResult {
    const debts = buildDebts(values);
    const extraPayment = Math.max(0, toNumber(values.extraPayment));
    const selectedStrategy: DebtPayoffStrategy = values.strategy === "snowball" ? "snowball" : "avalanche";
    const alternativeStrategy: DebtPayoffStrategy = selectedStrategy === "avalanche" ? "snowball" : "avalanche";

    const selected = simulateStrategy(debts, extraPayment, selectedStrategy);
    const alternative = simulateStrategy(debts, extraPayment, alternativeStrategy);
    const totalStartingBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const minimumBudget = debts.reduce((sum, debt) => sum + debt.minPayment, 0);

    if (!selected.feasible) {
        return {
            monthsToDebtFree: { tr: `${selected.months} ay`, en: `${selected.months} months` },
            totalInterestPaid: selected.totalInterest,
            totalPaid: selected.totalPaid,
            alternativeInterestGap: Math.abs(selected.totalInterest - alternative.totalInterest),
            summary: {
                tr: "Girilen asgari ödemeler ve ekstra bütçe faiz yükünü karşılamaya yetmediği için borç kapanmıyor. Daha yüksek ödeme planı girin.",
                en: "With the current minimum payments and extra budget, the debt does not amortize. Enter a higher payment plan.",
            },
            selectedStrategy,
            alternativeStrategy,
            selected,
            alternative,
            recommendedStrategy: alternative.totalInterest < selected.totalInterest ? alternativeStrategy : selectedStrategy,
            totalStartingBalance,
            minimumBudget,
            extraPayment,
        };
    }

    const recommendedStrategy = selected.totalInterest <= alternative.totalInterest ? selectedStrategy : alternativeStrategy;
    const selectedLabel = selectedStrategy === "avalanche"
        ? { tr: "çığ", en: "avalanche" }
        : { tr: "kartopu", en: "snowball" };
    const betterLabel = recommendedStrategy === "avalanche"
        ? { tr: "çığ", en: "avalanche" }
        : { tr: "kartopu", en: "snowball" };

    return {
        monthsToDebtFree: {
            tr: `${selected.months} ay`,
            en: `${selected.months} months`,
        },
        totalInterestPaid: selected.totalInterest,
        totalPaid: selected.totalPaid,
        alternativeInterestGap: Math.abs(selected.totalInterest - alternative.totalInterest),
        summary: {
            tr: `${selectedLabel.tr} yöntemiyle borçlar yaklaşık ${selected.months} ayda kapanıyor. Faiz yükünde daha avantajlı görünen strateji ${betterLabel.tr} yöntemi oldu.`,
            en: `Using the ${selectedLabel.en} method, the debts are cleared in about ${selected.months} months. The strategy that looks better on interest cost is ${betterLabel.en}.`,
        },
        selectedStrategy,
        alternativeStrategy,
        selected,
        alternative,
        recommendedStrategy,
        totalStartingBalance,
        minimumBudget,
        extraPayment,
    };
}
