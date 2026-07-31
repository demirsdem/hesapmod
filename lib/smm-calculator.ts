import type {
    SmmGvkKapsam,
    SmmInputs,
    SmmMeslek,
    SmmResult,
} from "@/types/smm";

// Kaynak: GIB, Gelir Vergisi Kanununun 94. Maddesinde Yer Alan Kesinti Oranlari.
// GVK 94/2: 18. madde kapsamindaki serbest meslek isleri %17, digerleri %20.
export const MESLEK_STOPAJ: Record<SmmMeslek, {
    oran: number;
    kapsam: SmmGvkKapsam;
    aciklama: string;
}> = {
    avukat: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    doktor: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    mimar: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    muhendis: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    "mali-musavir": { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    muhasebeci: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    psikolog: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    diyetisyen: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    tercuman: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
    "yazar-telif": { oran: 17, kapsam: "telif", aciklama: "GVK 94/2-a telif/patent" },
    diger: { oran: 20, kapsam: "genel", aciklama: "GVK 94/2-b genel oran" },
};

export const KDV_ORANLARI = [0, 10, 20] as const;
export type KdvOrani = typeof KDV_ORANLARI[number];

function roundMoney(value: number) {
    return Math.round(value * 100) / 100;
}

function isFiniteNumber(value: number) {
    return Number.isFinite(value) && !Number.isNaN(value);
}

export function getMeslekStopaj(meslek: SmmMeslek) {
    return MESLEK_STOPAJ[meslek] ?? MESLEK_STOPAJ.diger;
}

function _hesapla(
    brutTutar: number,
    kdvOrani: number,
    stopajOrani: number
): SmmResult {
    const safeBrut = Math.max(0, brutTutar);
    const kdvTutari = safeBrut * (kdvOrani / 100);
    const stopajTutari = safeBrut * (stopajOrani / 100);
    const tahsilEdilecek = safeBrut + kdvTutari - stopajTutari;
    const netGelir = safeBrut - stopajTutari;
    const efektifVergiYuku = safeBrut > 0 ? (stopajTutari / safeBrut) * 100 : 0;

    return {
        brutTutar: roundMoney(safeBrut),
        kdvTutari: roundMoney(kdvTutari),
        stopajTutari: roundMoney(stopajTutari),
        tahsilEdilecek: roundMoney(tahsilEdilecek),
        netGelir: roundMoney(netGelir),
        efektifVergiYuku: roundMoney(efektifVergiYuku),
    };
}

export function bruttenHesapla(p: {
    brutTutar: number;
    kdvOrani: number;
    stopajOrani: number;
}): SmmResult {
    return _hesapla(p.brutTutar, p.kdvOrani, p.stopajOrani);
}

export function nettenHesapla(p: {
    netGelir: number;
    kdvOrani: number;
    stopajOrani: number;
}): SmmResult {
    const netCarpan = 1 - p.stopajOrani / 100;
    if (netCarpan <= 0) {
        return _hesapla(0, p.kdvOrani, p.stopajOrani);
    }

    return _hesapla(p.netGelir / netCarpan, p.kdvOrani, p.stopajOrani);
}

export function tahsildenHesapla(p: {
    tahsilEdilecek: number;
    kdvOrani: number;
    stopajOrani: number;
}): SmmResult {
    const carpan = 1 + p.kdvOrani / 100 - p.stopajOrani / 100;
    if (carpan <= 0) {
        return _hesapla(0, p.kdvOrani, p.stopajOrani);
    }

    return _hesapla(p.tahsilEdilecek / carpan, p.kdvOrani, p.stopajOrani);
}

export function hesapla(inputs: SmmInputs): SmmResult | null {
    if (!isFiniteNumber(inputs.tutar) || inputs.tutar <= 0) {
        return null;
    }
    if (!isFiniteNumber(inputs.kdvOrani) || !isFiniteNumber(inputs.stopajOrani)) {
        return null;
    }

    const params = {
        kdvOrani: inputs.kdvOrani,
        stopajOrani: inputs.stopajOrani,
    };

    switch (inputs.tutarTipi) {
        case "brut":
            return bruttenHesapla({ brutTutar: inputs.tutar, ...params });
        case "net":
            return nettenHesapla({ netGelir: inputs.tutar, ...params });
        case "tahsil":
            return tahsildenHesapla({ tahsilEdilecek: inputs.tutar, ...params });
        default:
            return null;
    }
}

export function formatTRY(value: number): string {
    if (!isFiniteNumber(value)) {
        return "-";
    }

    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ₺`;
}

export function formatYuzde(value: number): string {
    if (!isFiniteNumber(value)) {
        return "-";
    }

    return `%${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })}`;
}

export function popularSmmHesaplamalar(params: {
    kdvOrani: number;
    stopajOrani: number;
}) {
    const tutarlar = [5000, 10000, 25000, 50000, 100000];
    return tutarlar.map((brut) => ({
        brut,
        ...bruttenHesapla({ brutTutar: brut, ...params }),
    }));
}
