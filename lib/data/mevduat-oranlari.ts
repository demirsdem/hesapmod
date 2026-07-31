export type MevduatOranKey = "oran32" | "oran92" | "oran181";

export type BankaMevduatOrani = {
    banka: string;
    logo: string;
    oran32: number;
    oran92: number;
    oran181: number;
};

export const BANKA_ORANLARI: BankaMevduatOrani[] = [
    { banka: "Ziraat Bankası", logo: "ziraat", oran32: 48.0, oran92: 46.5, oran181: 45.0 },
    { banka: "Halkbank", logo: "halk", oran32: 47.5, oran92: 46.0, oran181: 44.5 },
    { banka: "Vakıfbank", logo: "vakif", oran32: 47.0, oran92: 45.5, oran181: 44.0 },
    { banka: "Garanti BBVA", logo: "garanti", oran32: 49.0, oran92: 47.5, oran181: 46.0 },
    { banka: "İş Bankası", logo: "isbank", oran32: 48.5, oran92: 47.0, oran181: 45.5 },
    { banka: "Yapı Kredi", logo: "ykb", oran32: 48.0, oran92: 46.5, oran181: 45.0 },
];

export const BANKA_ORANLARI_SON_GUNCELLEME = "18 Mayıs 2026";

export const BANKA_ORANLARI_DISCLAIMER =
    "Oranlar değişkenlik gösterebilir, güncel teklif için bankanızla iletişime geçin.";

export function getMevduatOranKeyForDays(days: number): MevduatOranKey {
    if (days <= 61) {
        return "oran32";
    }

    if (days <= 136) {
        return "oran92";
    }

    return "oran181";
}

export function getMevduatOranDays(key: MevduatOranKey) {
    if (key === "oran32") {
        return 32;
    }

    if (key === "oran92") {
        return 92;
    }

    return 181;
}
