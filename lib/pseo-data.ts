import {
    getAllPseoRoutes,
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

export { getAllPseoRoutes, isLoanPseoRoute, isSalaryPseoRoute } from "./pseo-generators";

const PSEO_PARENT_LABELS: Record<PseoLoanParentSlug | "maas-hesaplama", string> = {
    "ihtiyac-kredisi-hesaplama": "İhtiyaç Kredisi",
    "tasit-kredisi-hesaplama": "Taşıt Kredisi",
    "konut-kredisi-hesaplama": "Konut Kredisi",
    "ticari-arac-kredisi-hesaplama": "Ticari Araç Kredisi",
    "maas-hesaplama": "Maaş",
};

export const pseoRoutes = getAllPseoRoutes();

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
    return route.type === "grossSalary" ? "Brüt Maaş" : "Net Maaş";
}

function getSalaryComputationNarrative(route: PseoSalaryRoute) {
    return route.type === "grossSalary"
        ? "brütten nete bordro kırılımı"
        : "netten brüte bordro karşılığı";
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

    return route.type === "grossSalary"
        ? `${formatPseoAmount(route.amount)} TL Brüt Maaş Hesapla`
        : `${formatPseoAmount(route.amount)} TL Net Maaşın Brütünü Hesapla`;
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

    return route.type === "grossSalary" ? "Brüt Maaş" : "Net Maaş";
}

export function getPseoPageHeading(route: PseoRoute, calculatorName: string) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${route.term} Ay ${getPseoParentLabel(route.parentSlug)} Hesaplama`;
    }

    return route.type === "grossSalary"
        ? `${formatPseoAmount(route.amount)} TL Brüt Maaş Net Hesaplama`
        : `${formatPseoAmount(route.amount)} TL Net Maaşın Brüt Karşılığı`;
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

    return route.type === "grossSalary"
        ? `${formatPseoAmount(route.amount)} TL brüt ücret için ${salaryBand} bordro seviyesinde SGK, işsizlik, gelir vergisi ve damga vergisi kesintilerini tek ekranda görerek ${computationNarrative} sonucuna ulaşabilirsiniz.`
        : `${formatPseoAmount(route.amount)} TL net ücret hedefi için ${salaryBand} bordro aralığında işverene yansıyan brüt maaş karşılığını, vergi ve prim bileşenleriyle birlikte ${computationNarrative} olarak inceleyebilirsiniz.`;
}

export function getPseoGuideHeading(route: PseoRoute, calculatorName: string) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${route.term} Ay ${calculatorName} Rehberi`;
    }

    return route.type === "grossSalary"
        ? `${formatPseoAmount(route.amount)} TL Brüt Maaşın Net Karşılığı Nasıl Hesaplanır?`
        : `${formatPseoAmount(route.amount)} TL Net Maaş İçin Brüt Ücret Nasıl Bulunur?`;
}

export function getPseoTitle(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        return `${formatPseoAmount(route.amount)} TL ${route.term} Ay ${getPseoParentLabel(route.parentSlug)} Hesaplama 2026 | HesapMod`;
    }

    return route.type === "grossSalary"
        ? `${formatPseoAmount(route.amount)} TL Brüt Maaş Net Hesaplama 2026 | HesapMod`
        : `${formatPseoAmount(route.amount)} TL Net Maaş Brüt Hesaplama 2026 | HesapMod`;
}

export function getPseoDescription(route: PseoRoute) {
    if (isLoanPseoRoute(route)) {
        const parentLabel = getPseoParentLabel(route.parentSlug).toLocaleLowerCase("tr-TR");
        return `${formatPseoAmount(route.amount)} TL tutarında ve ${route.term} ay vadeli ${parentLabel} için aylık taksit, toplam geri ödeme ve faiz yükünü hesaplayın.`;
    }

    return route.type === "grossSalary"
        ? `${formatPseoAmount(route.amount)} TL brüt maaşın net karşılığını; SGK, işsizlik, gelir vergisi ve damga vergisi kırılımıyla hesaplayın.`
        : `${formatPseoAmount(route.amount)} TL net maaş için gerekli brüt ücreti; vergi ve prim kesintileriyle birlikte hesaplayın.`;
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

    return route.type === "grossSalary"
        ? `${formatPseoAmount(route.amount)} TL brüt maaş düzeyinde ${salaryBand} çalışan profilleri için net ele geçen ücret, SGK primi, işsizlik sigortası ve vergi kalemleri bu özel varyasyonda hazır gelir.`
        : `${formatPseoAmount(route.amount)} TL net maaş hedefleyen ${salaryBand} ücret senaryolarında işveren maliyetine yaklaşan brüt tutarı ve bordro bileşenlerini bu özel sayfada doğrudan görebilirsiniz.`;
}
