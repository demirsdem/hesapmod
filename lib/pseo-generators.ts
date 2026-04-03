export type PseoCategory = "finansal-hesaplamalar" | "maas-ve-vergi";

export type PseoLoanParentSlug =
    | "ihtiyac-kredisi-hesaplama"
    | "tasit-kredisi-hesaplama"
    | "konut-kredisi-hesaplama"
    | "ticari-arac-kredisi-hesaplama";

export type PseoSalaryParentSlug = "maas-hesaplama";
export type PseoParentSlug = PseoLoanParentSlug | PseoSalaryParentSlug;
export type PseoRouteType = "loan" | "grossSalary" | "netSalary";

type PseoBaseRoute = {
    parentSlug: PseoParentSlug;
    category: PseoCategory;
    amount: number;
    detailSlug: string;
    type: PseoRouteType;
};

export type PseoLoanRoute = PseoBaseRoute & {
    parentSlug: PseoLoanParentSlug;
    category: "finansal-hesaplamalar";
    type: "loan";
    term: number;
};

export type PseoSalaryRoute = PseoBaseRoute & {
    parentSlug: PseoSalaryParentSlug;
    category: "maas-ve-vergi";
    type: "grossSalary" | "netSalary";
    term?: never;
};

export type PseoRoute = PseoLoanRoute | PseoSalaryRoute;

type PseoAmountGroup = {
    amount: number;
    routes: PseoRoute[];
};

function buildAmountSeries(minAmount: number, maxAmount: number, stepAmount: number) {
    if (stepAmount <= 0 || maxAmount < minAmount) {
        return [];
    }

    const amountSet = new Set<number>();
    amountSet.add(Math.round(minAmount));
    amountSet.add(Math.round(maxAmount));

    for (
        let current = Math.ceil(minAmount / stepAmount) * stepAmount;
        current <= maxAmount;
        current += stepAmount
    ) {
        amountSet.add(Math.round(current));
    }

    return Array.from(amountSet)
        .filter((amount) => amount >= minAmount && amount <= maxAmount)
        .sort((left, right) => left - right);
}

function getRouteTypeRank(route: PseoRoute) {
    switch (route.type) {
        case "loan":
            return 0;
        case "grossSalary":
            return 1;
        case "netSalary":
            return 2;
        default:
            return 99;
    }
}

function getRouteTermValue(route: PseoRoute) {
    return isLoanPseoRoute(route) ? route.term : 0;
}

function comparePseoRoutes(left: PseoRoute, right: PseoRoute) {
    return left.category.localeCompare(right.category, "tr")
        || left.parentSlug.localeCompare(right.parentSlug, "tr")
        || left.amount - right.amount
        || getRouteTermValue(left) - getRouteTermValue(right)
        || getRouteTypeRank(left) - getRouteTypeRank(right);
}

function sampleEvenly<T>(items: T[], targetCount: number) {
    if (targetCount <= 0) {
        return [];
    }

    if (targetCount >= items.length) {
        return items;
    }

    if (targetCount === 1) {
        return [items[Math.floor(items.length / 2)]];
    }

    const selectedIndices = new Set<number>();
    for (let index = 0; index < targetCount; index += 1) {
        const ratio = index / (targetCount - 1);
        const selectedIndex = Math.round(ratio * (items.length - 1));
        selectedIndices.add(selectedIndex);
    }

    return Array.from(selectedIndices)
        .sort((left, right) => left - right)
        .map((index) => items[index]);
}

function groupRoutesByAmount(routes: PseoRoute[]) {
    const groups = new Map<number, PseoRoute[]>();

    routes.forEach((route) => {
        const current = groups.get(route.amount);
        if (current) {
            current.push(route);
            return;
        }

        groups.set(route.amount, [route]);
    });

    return Array.from(groups.entries())
        .sort(([leftAmount], [rightAmount]) => leftAmount - rightAmount)
        .map(([amount, groupRoutes]) => ({
            amount,
            routes: [...groupRoutes].sort(comparePseoRoutes),
        })) satisfies PseoAmountGroup[];
}

function selectBuildTimeRoutesForParent(routes: PseoRoute[], limit: number) {
    if (routes.length <= limit) {
        return routes;
    }

    const groupedByAmount = groupRoutesByAmount(routes);
    const maxRoutesPerAmount = routes.some((route) => route.type === "loan") ? 3 : 2;
    const sampledGroups = sampleEvenly(
        groupedByAmount,
        Math.max(1, Math.ceil(limit / maxRoutesPerAmount))
    );

    const selected = sampledGroups
        .flatMap((group) => group.routes.slice(0, maxRoutesPerAmount))
        .slice(0, limit);

    return selected.sort(comparePseoRoutes);
}

export function isLoanPseoRoute(route: PseoRoute): route is PseoLoanRoute {
    return route.type === "loan";
}

export function isSalaryPseoRoute(route: PseoRoute): route is PseoSalaryRoute {
    return route.type === "grossSalary" || route.type === "netSalary";
}

export function generateLoanCombinations(
    slug: PseoLoanParentSlug,
    category: "finansal-hesaplamalar",
    minAmount: number,
    maxAmount: number,
    stepAmount: number,
    termsArray: number[]
) {
    const amounts = buildAmountSeries(minAmount, maxAmount, stepAmount);
    const terms = Array.from(
        new Set(termsArray.map((term) => Math.round(term)).filter((term) => term > 0))
    ).sort((left, right) => left - right);

    return amounts.flatMap((amount) => (
        terms.map((term) => ({
            parentSlug: slug,
            category,
            amount,
            term,
            type: "loan" as const,
            detailSlug: `${amount}-tl-${term}-ay`,
        }))
    ));
}

export function generateSalaryCombinations(
    minAmount: number,
    maxAmount: number,
    stepAmount: number
) {
    const amounts = buildAmountSeries(minAmount, maxAmount, stepAmount);

    return amounts.flatMap((amount) => ([
        {
            parentSlug: "maas-hesaplama" as const,
            category: "maas-ve-vergi" as const,
            amount,
            type: "grossSalary" as const,
            detailSlug: `${amount}-tl-brut-maas`,
        },
        {
            parentSlug: "maas-hesaplama" as const,
            category: "maas-ve-vergi" as const,
            amount,
            type: "netSalary" as const,
            detailSlug: `${amount}-tl-net-maas`,
        },
    ]));
}

let cachedAllPseoRoutes: PseoRoute[] | null = null;

export function getAllPseoRoutes() {
    if (cachedAllPseoRoutes) {
        return cachedAllPseoRoutes;
    }

    cachedAllPseoRoutes = [
        ...generateLoanCombinations(
            "ihtiyac-kredisi-hesaplama",
            "finansal-hesaplamalar",
            10000,
            200000,
            10000,
            [12, 24, 36]
        ),
        ...generateLoanCombinations(
            "tasit-kredisi-hesaplama",
            "finansal-hesaplamalar",
            100000,
            1000000,
            100000,
            [12, 24, 36, 48]
        ),
        ...generateLoanCombinations(
            "konut-kredisi-hesaplama",
            "finansal-hesaplamalar",
            500000,
            5000000,
            250000,
            [60, 120, 180, 240]
        ),
        ...generateLoanCombinations(
            "ticari-arac-kredisi-hesaplama",
            "finansal-hesaplamalar",
            200000,
            3000000,
            200000,
            [12, 24, 36, 48, 60]
        ),
        ...generateSalaryCombinations(33030, 150000, 5000),
    ].sort(comparePseoRoutes);

    return cachedAllPseoRoutes;
}

export function getBuildTimePseoRoutes(limitPerParent = 10) {
    const groupedByParent = new Map<PseoParentSlug, PseoRoute[]>();

    getAllPseoRoutes().forEach((route) => {
        const current = groupedByParent.get(route.parentSlug);
        if (current) {
            current.push(route);
            return;
        }

        groupedByParent.set(route.parentSlug, [route]);
    });

    return Array.from(groupedByParent.values())
        .flatMap((routes) => selectBuildTimeRoutesForParent(routes, limitPerParent))
        .sort(comparePseoRoutes);
}
