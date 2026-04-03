import {
    generateAllPseoRoutes,
    isLoanPseoRoute,
    type PseoLoanParentSlug,
    type PseoLoanRoute,
    type PseoRoute,
    type PseoSalaryRoute,
} from "./pseo-generators";

export type {
    PseoCategory,
    PseoParentSlug,
    PseoRoute,
    PseoRouteType,
    PseoLoanRoute,
    PseoSalaryRoute,
} from "./pseo-generators";

export { generateAllPseoRoutes, getAllPseoRoutes, isLoanPseoRoute, isSalaryPseoRoute } from "./pseo-generators";

const PSEO_PARENT_LABELS: Record<PseoLoanParentSlug | "maas-hesaplama", string> = {
    "ihtiyac-kredisi-hesaplama": "İhtiyaç Kredisi",
    "tasit-kredisi-hesaplama": "Taşıt Kredisi",
    "konut-kredisi-hesaplama": "Konut Kredisi",
    "ticari-arac-kredisi-hesaplama": "Ticari Araç Kredisi",
    "maas-hesaplama": "Maaş",
};

export const pseoRoutes = generateAllPseoRoutes();

const pseoRouteIndex = new Map<string, PseoRoute>(
    pseoRoutes.map((route) => [
        `${route.category}::${route.parentSlug}::${route.detailSlug}`,
        route,
    ])
);

function getLoanAmountNarrative(amount: number) {
    if (amount < 100000) {
        return "daha erişilebilir bütçeli";
    }

    if (amount < 500000) {
        return "orta ölçekli";
    }

    if (amount < 1500000) {
        return "yüksek tutarlı";
    }

    return "uzun planlama gerektiren";
}

function getLoanTermNarrative(term: number) {
    if (term <= 12) {
        return "kısa vadeli";
    }

    if (term <= 36) {
        return "orta vadeli";
    }

    if (term <= 120) {
        return "uzun vadeli";
    }

    return "çok uzun vadeli";
}

function getSalaryBandNarrative(amount: number) {
    if (amount < 50000) {
        return "giriş ve orta seviye";
    }

    if (amount < 100000) {
        return "uzman kadro";
    }

    return "üst gelir bandı";
}

function getSalaryRouteLabel(route: PseoSalaryRoute) {
    return "Brüt Maaş";
}

function getSalaryComputationNarrative(route: PseoSalaryRoute) {
    return "brütten nete bordro kırılımı";
}

function getLoanBreadcrumbLabel(route: PseoLoanRoute) {
    return `${formatPseoAmount(route.amount)} TL ${route.term} Ay`;
}

function getSalaryBreadcrumbLabel(route: PseoSalaryRoute) {
    return `${formatPseoAmount(route.amount)} TL ${getSalaryRouteLabel(route)}`;
}

export function findPseoRoute(
    category: string,
    parentSlug: string,
    detailSlug: string
) {
    return pseoRouteIndex.get(`${category}::${parentSlug}::${detailSlug}`);
}

export function getPseoParentLabel(parentSlug: string) {
    return PSEO_PARENT_LABELS[parentSlug as keyof typeof PSEO_PARENT_LABELS] ?? "Hesaplama";
}

export function formatPseoAmount(amount: number) {
    return amount.toLocaleString("tr-TR");
}

export function getPseoBreadcrumbLabel(route: PseoRoute) {
    return isLoanPseoRoute(route)
        ? getLoanBreadcrumbLabel(route)
        : getSalaryBreadcrumbLabel(route);
}

export function getPseoAnchorText(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${route.term} Ay ${getPseoParentLabel(route.parentSlug)} Hesapla`;
    }

    return `${formatPseoAmount(route.amount)} TL Brüt Maaş Ne Kadar?`;
}

export function getPseoOptionHeading(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${getPseoParentLabel(route.parentSlug)} Seçenekleri`;
    }

    return `${formatPseoAmount(route.amount)} TL Maaş Senaryoları`;
}

export function getPseoOptionPillLabel(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        return `${route.term} Ay`;
    }

    return "Brüt Maaş";
}

export function getPseoPageHeading(route: PseoRoute, calculatorName: string) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${route.term} Ay ${getPseoParentLabel(route.parentSlug)} Hesaplama`;
    }

    return `${formatPseoAmount(route.amount)} TL Brüt Maaş Net Hesaplama`;
}

export function getPseoHeroParagraph(route: PseoRoute, calculatorName: string) {
    if (isLoanPseoRoute(route)) {
        const parentLabel = getPseoParentLabel(route.parentSlug).toLocaleLowerCase("tr-TR");
        const amountNarrative = getLoanAmountNarrative(route.amount);
        const termNarrative = getLoanTermNarrative(route.term);
        return `${formatPseoAmount(route.amount)} TL tutarlı ${amountNarrative} ve ${route.term} ay ${termNarrative} ${parentLabel} senaryosunda aylık taksit, toplam geri ödeme ve faiz yükünü ${calculatorName.toLocaleLowerCase("tr-TR")} ekranında anında görebilirsiniz.`;
    }

    const salaryBand = getSalaryBandNarrative(route.amount);
    const computationNarrative = getSalaryComputationNarrative(route);

    return `${formatPseoAmount(route.amount)} TL brüt ücret için ${salaryBand} bordro seviyesinde SGK, işsizlik, gelir vergisi ve damga vergisi kesintilerini tek ekranda görerek ${computationNarrative} sonucuna ulaşabilirsiniz.`;
}

export function getPseoGuideHeading(route: PseoRoute, calculatorName: string) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${route.term} Ay ${calculatorName} Rehberi`;
    }

    return `${formatPseoAmount(route.amount)} TL Brüt Maaşın Net Karşılığı Nasıl Hesaplanır?`;
}

export function getPseoTitle(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${route.term} Ay ${getPseoParentLabel(route.parentSlug)} Hesaplama 2026 | HesapMod`;
    }

    return `${formatPseoAmount(route.amount)} TL Brüt Maaş Net Hesaplama 2026 | HesapMod`;
}

export function getPseoDescription(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        const parentLabel = getPseoParentLabel(route.parentSlug).toLocaleLowerCase("tr-TR");
        return `${formatPseoAmount(route.amount)} TL tutarında ve ${route.term} ay vadeli ${parentLabel} için aylık taksit, toplam geri ödeme ve faiz yükünü hesaplayın.`;
    }

    return `${formatPseoAmount(route.amount)} TL brüt maaşın net karşılığını; SGK, işsizlik, gelir vergisi ve damga vergisi kırılımıyla hesaplayın.`;
}

export function getPseoIntro(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        const amountNarrative = getLoanAmountNarrative(route.amount);
        const termNarrative = getLoanTermNarrative(route.term);

        if (route.parentSlug === "konut-kredisi-hesaplama") {
            return `${formatPseoAmount(route.amount)} TL tutarlı ${amountNarrative} ve ${route.term} ay ${termNarrative} konut finansmanı senaryosunda aylık taksitlerinizi, toplam kredi maliyetinizi ve uzun vade etkisini tek ekranda karşılaştırabilirsiniz.`;
        }

        if (route.parentSlug === "ticari-arac-kredisi-hesaplama") {
            return `${formatPseoAmount(route.amount)} TL tutarlı ${amountNarrative} ticari araç finansmanında ${route.term} ay ${termNarrative} geri ödeme yapısının işletme nakit akışına etkisini bu hazır senaryoda görebilirsiniz.`;
        }

        return `${formatPseoAmount(route.amount)} TL tutarındaki ${getPseoParentLabel(route.parentSlug).toLocaleLowerCase("tr-TR")} için ${route.term} ay vade seçeneğinde aylık taksit, toplam ödeme ve vergi dahil faiz yükünü doğrudan inceleyebilirsiniz.`;
    }

    const salaryBand = getSalaryBandNarrative(route.amount);

    return `${formatPseoAmount(route.amount)} TL brüt maaş düzeyinde ${salaryBand} çalışan profilleri için net ele geçen ücret, SGK primi, işsizlik sigortası ve vergi kalemleri bu özel varyasyonda hazır gelir.`;
}
