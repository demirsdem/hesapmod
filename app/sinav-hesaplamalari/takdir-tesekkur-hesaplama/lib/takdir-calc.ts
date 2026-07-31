export type BelgeSonuc =
    | "takdir"
    | "tesekkur"
    | "engel_zayif"
    | "engel_devamsiz"
    | "engel_ceza"
    | "engel_ortalama"
    | "coklu_engel";

export interface DersGirdisi {
    ad: string;
    not: number;
    saat: number;
}

export interface HesapGirdisi {
    dersler: DersGirdisi[];
    devamsizlik: number;
    kinamaCezasi: boolean;
}

export interface HesapSonucu {
    ortalama: number;
    sonuc: BelgeSonuc;
    engelNedenler: string[];
    tesekkurIcinEksik: number;
    takdirIcinEksik: number;
    enEtkilDers: string;
    enEtkilDersEtkisi: number;
}

function round2(value: number) {
    return Math.round(value * 100) / 100;
}

function dersAdi(ders: DersGirdisi, index: number) {
    return ders.ad.trim() || `${index + 1}. Ders`;
}

export function hesapla(girdi: HesapGirdisi): HesapSonucu {
    const toplamAgirlik = girdi.dersler.reduce((toplam, ders) => toplam + ders.not * ders.saat, 0);
    const toplamSaat = girdi.dersler.reduce((toplam, ders) => toplam + ders.saat, 0);
    const ortalama = toplamSaat > 0 ? toplamAgirlik / toplamSaat : 0;
    const zayifDersler = girdi.dersler
        .map((ders, index) => ({ ...ders, displayName: dersAdi(ders, index) }))
        .filter((ders) => ders.not < 50);

    const engelNedenler: string[] = [];

    if (zayifDersler.length > 0) {
        engelNedenler.push(
            ...zayifDersler.map((ders) => `"${ders.displayName}" dersinden zayıf aldınız (${ders.not})`)
        );
    }

    if (girdi.devamsizlik > 5) {
        engelNedenler.push(`Özürsüz devamsızlık ${girdi.devamsizlik} gün (limit: 5)`);
    }

    if (girdi.kinamaCezasi) {
        engelNedenler.push("Kınama cezası mevcut");
    }

    let sonuc: BelgeSonuc;
    if (ortalama < 70) {
        sonuc = "engel_ortalama";
    } else if (engelNedenler.length > 1) {
        sonuc = "coklu_engel";
    } else if (zayifDersler.length > 0) {
        sonuc = "engel_zayif";
    } else if (girdi.devamsizlik > 5) {
        sonuc = "engel_devamsiz";
    } else if (girdi.kinamaCezasi) {
        sonuc = "engel_ceza";
    } else if (ortalama >= 85) {
        sonuc = "takdir";
    } else {
        sonuc = "tesekkur";
    }

    const enEtkili = [...girdi.dersler]
        .map((ders, index) => ({ ...ders, displayName: dersAdi(ders, index) }))
        .sort((a, b) => b.saat - a.saat)[0];
    const enEtkilDersEtkisi = enEtkili && toplamSaat > 0 ? (5 * enEtkili.saat) / toplamSaat : 0;

    return {
        ortalama: round2(ortalama),
        sonuc,
        engelNedenler,
        tesekkurIcinEksik: Math.max(0, round2(70 - ortalama)),
        takdirIcinEksik: Math.max(0, round2(85 - ortalama)),
        enEtkilDers: enEtkili?.displayName || "En ağırlıklı ders",
        enEtkilDersEtkisi: round2(enEtkilDersEtkisi),
    };
}

export function clampInteger(value: string | number, min: number, max: number) {
    const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
        return min;
    }

    return Math.min(max, Math.max(min, Math.trunc(parsed)));
}
