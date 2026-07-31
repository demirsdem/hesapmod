export type YksScoreType = "tyt" | "say" | "ea" | "soz" | "dil";

export type YksValues = Record<string, any>;

type YksYearConfig = {
    label: { tr: string; en: string };
    helperText: { tr: string; en: string };
    isApproximate: boolean;
    tKatTurk: number;
    tKatSos: number;
    tKatMat: number;
    tKatFen: number;
    yKatTurk: number;
    yKatSos: number;
    yKatMat: number;
    yKatFen: number;
    sayKatMat: number;
    sayKatFiz: number;
    sayKatKim: number;
    sayKatBiy: number;
    sozKatEdeb: number;
    sozKatTar1: number;
    sozKatCog1: number;
    sozKatTar2: number;
    sozKatCog2: number;
    sozKatFel: number;
    sozKatDin: number;
    eaKatMat: number;
    eaKatEdeb: number;
    eaKatTar1: number;
    eaKatCog1: number;
    dilKatYdt: number;
};

export const yksYearConfigs: Record<string, YksYearConfig> = {
    "2026": {
        label: { tr: "2026 (ÖSYM kılavuz ağırlıkları)", en: "2026 (OSYM guide weights)" },
        helperText: {
            tr: "2026 seçeneği, ÖSYM YKS kılavuzundaki test ağırlıklarını 500 ham puan ölçeğine dönüştürerek hesaplama yapar.",
            en: "The 2026 option converts the official OSYM YKS test weights to the 500-point raw score scale.",
        },
        isApproximate: false,
        tKatTurk: 3.3,
        tKatSos: 3.4,
        tKatMat: 3.3,
        tKatFen: 3.4,
        yKatTurk: 1.32,
        yKatSos: 1.36,
        yKatMat: 1.32,
        yKatFen: 1.36,
        sayKatMat: 3,
        sayKatFiz: 40 / 14,
        sayKatKim: 40 / 13,
        sayKatBiy: 40 / 13,
        sozKatEdeb: 3,
        sozKatTar1: 2.8,
        sozKatCog1: 20 / 6,
        sozKatTar2: 32 / 11,
        sozKatCog2: 32 / 11,
        sozKatFel: 3,
        sozKatDin: 20 / 6,
        eaKatMat: 3,
        eaKatEdeb: 3,
        eaKatTar1: 2.8,
        eaKatCog1: 20 / 6,
        dilKatYdt: 3,
    },
    "2025": {
        label: { tr: "2025 (ÖSYM kılavuz ağırlıkları)", en: "2025 (OSYM guide weights)" },
        helperText: {
            tr: "2025 seçeneği, ÖSYM YKS kılavuzundaki test ağırlıklarını 500 ham puan ölçeğine dönüştürerek hesaplama yapar.",
            en: "The 2025 option converts the official OSYM YKS test weights to the 500-point raw score scale.",
        },
        isApproximate: false,
        tKatTurk: 3.3,
        tKatSos: 3.4,
        tKatMat: 3.3,
        tKatFen: 3.4,
        yKatTurk: 1.32,
        yKatSos: 1.36,
        yKatMat: 1.32,
        yKatFen: 1.36,
        sayKatMat: 3,
        sayKatFiz: 40 / 14,
        sayKatKim: 40 / 13,
        sayKatBiy: 40 / 13,
        sozKatEdeb: 3,
        sozKatTar1: 2.8,
        sozKatCog1: 20 / 6,
        sozKatTar2: 32 / 11,
        sozKatCog2: 32 / 11,
        sozKatFel: 3,
        sozKatDin: 20 / 6,
        eaKatMat: 3,
        eaKatEdeb: 3,
        eaKatTar1: 2.8,
        eaKatCog1: 20 / 6,
        dilKatYdt: 3,
    },
    "2024": {
        label: { tr: "2024 (ÖSYM kılavuz ağırlıkları)", en: "2024 (OSYM guide weights)" },
        helperText: {
            tr: "2024 seçeneği, ÖSYM YKS kılavuzundaki test ağırlıklarını 500 ham puan ölçeğine dönüştürerek hesaplama yapar.",
            en: "The 2024 option converts the official OSYM YKS test weights to the 500-point raw score scale.",
        },
        isApproximate: false,
        tKatTurk: 3.3,
        tKatSos: 3.4,
        tKatMat: 3.3,
        tKatFen: 3.4,
        yKatTurk: 1.32,
        yKatSos: 1.36,
        yKatMat: 1.32,
        yKatFen: 1.36,
        sayKatMat: 3,
        sayKatFiz: 40 / 14,
        sayKatKim: 40 / 13,
        sayKatBiy: 40 / 13,
        sozKatEdeb: 3,
        sozKatTar1: 2.8,
        sozKatCog1: 20 / 6,
        sozKatTar2: 32 / 11,
        sozKatCog2: 32 / 11,
        sozKatFel: 3,
        sozKatDin: 20 / 6,
        eaKatMat: 3,
        eaKatEdeb: 3,
        eaKatTar1: 2.8,
        eaKatCog1: 20 / 6,
        dilKatYdt: 3,
    },
    "2023": {
        label: { tr: "2023 (ÖSYM kılavuz ağırlıkları)", en: "2023 (OSYM guide weights)" },
        helperText: {
            tr: "2023 seçeneği, ÖSYM YKS kılavuzundaki test ağırlıklarını 500 ham puan ölçeğine dönüştürerek hesaplama yapar.",
            en: "The 2023 option converts the official OSYM YKS test weights to the 500-point raw score scale.",
        },
        isApproximate: false,
        tKatTurk: 3.3,
        tKatSos: 3.4,
        tKatMat: 3.3,
        tKatFen: 3.4,
        yKatTurk: 1.32,
        yKatSos: 1.36,
        yKatMat: 1.32,
        yKatFen: 1.36,
        sayKatMat: 3,
        sayKatFiz: 40 / 14,
        sayKatKim: 40 / 13,
        sayKatBiy: 40 / 13,
        sozKatEdeb: 3,
        sozKatTar1: 2.8,
        sozKatCog1: 20 / 6,
        sozKatTar2: 32 / 11,
        sozKatCog2: 32 / 11,
        sozKatFel: 3,
        sozKatDin: 20 / 6,
        eaKatMat: 3,
        eaKatEdeb: 3,
        eaKatTar1: 2.8,
        eaKatCog1: 20 / 6,
        dilKatYdt: 3,
    },
};

export const yksScoreTypeMeta: Record<YksScoreType, { tr: string; en: string }> = {
    tyt: { tr: "TYT", en: "TYT" },
    say: { tr: "SAY", en: "SAY" },
    ea: { tr: "EA", en: "EA" },
    soz: { tr: "SÖZ", en: "VERBAL" },
    dil: { tr: "DİL", en: "LANG" },
};

function clampNumber(value: any, min = 0, max = Number.POSITIVE_INFINITY) {
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) return min;
    return Math.min(max, Math.max(min, parsed));
}

export function calculateYksNet(correct: any, wrong: any) {
    return Math.max(0, clampNumber(correct) - clampNumber(wrong) / 4);
}

export function calculateYksScores(values: YksValues) {
    const year = String(values.sinav_yili || "2026");
    const coefficients = yksYearConfigs[year] || yksYearConfigs["2026"];

    const tytTurkNet = calculateYksNet(values.tytTurkceD, values.tytTurkceY);
    const tytSosNet = calculateYksNet(values.tytSosyalD, values.tytSosyalY);
    const tytMatNet = calculateYksNet(values.tytMatD, values.tytMatY);
    const tytFenNet = calculateYksNet(values.tytFenD, values.tytFenY);
    const tytTotalNet = tytTurkNet + tytSosNet + tytMatNet + tytFenNet;

    const aytMatNet = calculateYksNet(values.aytMatD, values.aytMatY);
    const aytEdebNet = calculateYksNet(values.aytEdebD, values.aytEdebY);
    const aytTar1Net = calculateYksNet(values.aytTar1D, values.aytTar1Y);
    const aytCog1Net = calculateYksNet(values.aytCog1D, values.aytCog1Y);
    const aytTar2Net = calculateYksNet(values.aytTar2D, values.aytTar2Y);
    const aytCog2Net = calculateYksNet(values.aytCog2D, values.aytCog2Y);
    const aytFelsefeNet = calculateYksNet(values.aytFelsefeD, values.aytFelsefeY);
    const aytDinNet = calculateYksNet(values.aytDinD, values.aytDinY);
    const aytFizikNet = calculateYksNet(values.aytFizikD, values.aytFizikY);
    const aytKimyaNet = calculateYksNet(values.aytKimyaD, values.aytKimyaY);
    const aytBiyoNet = calculateYksNet(values.aytBiyoD, values.aytBiyoY);
    const ydtNet = calculateYksNet(values.ydtD, values.ydtY);

    const tytEligible = tytTurkNet >= 0.5 || tytMatNet >= 0.5;
    const sayEligible = tytEligible && aytMatNet + aytFizikNet + aytKimyaNet + aytBiyoNet >= 0.5;
    const sozEligible = tytEligible && aytEdebNet + aytTar1Net + aytCog1Net + aytTar2Net + aytCog2Net + aytFelsefeNet + aytDinNet >= 0.5;
    const eaEligible = tytEligible && aytMatNet + aytEdebNet + aytTar1Net + aytCog1Net >= 0.5;
    const dilEligible = tytEligible && ydtNet >= 0.5;

    const tytPuan = tytEligible
        ? 100 + (tytTurkNet * coefficients.tKatTurk) + (tytSosNet * coefficients.tKatSos) + (tytMatNet * coefficients.tKatMat) + (tytFenNet * coefficients.tKatFen)
        : 0;
    const alanTytKatkisi = (tytTurkNet * coefficients.yKatTurk) + (tytSosNet * coefficients.yKatSos) + (tytMatNet * coefficients.yKatMat) + (tytFenNet * coefficients.yKatFen);

    const sayPuan = sayEligible
        ? 100 + alanTytKatkisi + (aytMatNet * coefficients.sayKatMat) + (aytFizikNet * coefficients.sayKatFiz) + (aytKimyaNet * coefficients.sayKatKim) + (aytBiyoNet * coefficients.sayKatBiy)
        : 0;
    const sozPuan = sozEligible
        ? 100 + alanTytKatkisi + (aytEdebNet * coefficients.sozKatEdeb) + (aytTar1Net * coefficients.sozKatTar1) + (aytCog1Net * coefficients.sozKatCog1) + (aytTar2Net * coefficients.sozKatTar2) + (aytCog2Net * coefficients.sozKatCog2) + (aytFelsefeNet * coefficients.sozKatFel) + (aytDinNet * coefficients.sozKatDin)
        : 0;
    const eaPuan = eaEligible
        ? 100 + alanTytKatkisi + (aytMatNet * coefficients.eaKatMat) + (aytEdebNet * coefficients.eaKatEdeb) + (aytTar1Net * coefficients.eaKatTar1) + (aytCog1Net * coefficients.eaKatCog1)
        : 0;
    const dilPuan = dilEligible
        ? 100 + alanTytKatkisi + (ydtNet * coefficients.dilKatYdt)
        : 0;

    const diploma = clampNumber(values.diplomaNotu, 50, 100);
    const obpBase = diploma * 5;
    const obpPuani = obpBase * (values.prevPlacement ? 0.06 : 0.12);

    return {
        year,
        yearLabel: coefficients.label,
        yearHelperText: coefficients.helperText,
        isApproximate: coefficients.isApproximate,
        tytTurkNet,
        tytSosNet,
        tytMatNet,
        tytFenNet,
        tytTotalNet,
        aytMatNet,
        aytEdebNet,
        aytTar1Net,
        aytCog1Net,
        aytTar2Net,
        aytCog2Net,
        aytFelsefeNet,
        aytDinNet,
        aytFizikNet,
        aytKimyaNet,
        aytBiyoNet,
        ydtNet,
        sayAytNet: aytMatNet + aytFizikNet + aytKimyaNet + aytBiyoNet,
        eaAytNet: aytMatNet + aytEdebNet + aytTar1Net + aytCog1Net,
        sozAytNet: aytEdebNet + aytTar1Net + aytCog1Net + aytTar2Net + aytCog2Net + aytFelsefeNet + aytDinNet,
        obpPuani,
        tytPuan,
        sayPuan,
        sozPuan,
        eaPuan,
        dilPuan,
        yTyt: tytPuan > 0 ? tytPuan + obpPuani : 0,
        ySay: sayPuan > 0 ? sayPuan + obpPuani : 0,
        ySoz: sozPuan > 0 ? sozPuan + obpPuani : 0,
        yEa: eaPuan > 0 ? eaPuan + obpPuani : 0,
        yDil: dilPuan > 0 ? dilPuan + obpPuani : 0,
        tytEligible,
        sayEligible,
        sozEligible,
        eaEligible,
        dilEligible,
    };
}
