import type { HesaplamaCiktisi, HesaplamaGirdisi, NetKatkisi, PuanTuru } from "@/types/kpss";

export const PUAN_TURLERI: PuanTuru[] = ["P1", "P3", "P93", "P94"];

export const TEST_LIMITLERI = {
    GY: 60,
    GK: 60,
    EB: 80,
} as const;

export const KATSAYILAR: Record<PuanTuru, { GY: number; GK: number; EB?: number; sabit: number; aciklama: string }> = {
    P1: {
        GY: 1.17,
        GK: 0.5,
        sabit: 40,
        aciklama: "Lisans GY/GK odaklı yaklaşık P1 planlama katsayısı",
    },
    P3: {
        GY: 0.7,
        GK: 0.3,
        EB: 0.42,
        sabit: 40,
        aciklama: "GY/GK + Eğitim Bilimleri dahil yaklaşık P3 senaryosu",
    },
    P93: {
        GY: 1.17,
        GK: 0.5,
        sabit: 40,
        aciklama: "Önlisans GY/GK yaklaşık yerleştirme puanı senaryosu",
    },
    P94: {
        GY: 1.17,
        GK: 0.5,
        sabit: 40,
        aciklama: "Ortaöğretim GY/GK yaklaşık yerleştirme puanı senaryosu",
    },
};

export const defaultState: HesaplamaGirdisi = {
    puanTuru: "P1",
    gyDogru: 48,
    gyYanlis: 12,
    gkDogru: 44,
    gkYanlis: 8,
    ebDogru: 60,
    ebYanlis: 10,
};

type TestKey = keyof typeof TEST_LIMITLERI;

function assertFiniteNumber(value: number, label: string) {
    if (!Number.isFinite(value)) {
        throw new Error(`${label} sayısal olmalıdır.`);
    }
    if (value < 0) {
        throw new Error(`${label} negatif olamaz.`);
    }
}

function validateTest(dogru: number, yanlis: number, limit: number, label: string) {
    assertFiniteNumber(dogru, `${label} doğru`);
    assertFiniteNumber(yanlis, `${label} yanlış`);

    if (dogru > limit || yanlis > limit) {
        throw new Error(`${label} doğru ve yanlış değerleri 0-${limit} aralığında olmalıdır.`);
    }

    if (dogru + yanlis > limit) {
        throw new Error(`${label} doğru + yanlış toplamı ${limit} soruyu geçemez.`);
    }
}

export function hesaplaNet(dogru: number, yanlis: number) {
    return Number((dogru - yanlis / 4).toFixed(2));
}

export function validateKpssInput(input: HesaplamaGirdisi) {
    if (!PUAN_TURLERI.includes(input.puanTuru)) {
        throw new Error("Geçersiz puan türü.");
    }

    validateTest(input.gyDogru, input.gyYanlis, TEST_LIMITLERI.GY, "GY");
    validateTest(input.gkDogru, input.gkYanlis, TEST_LIMITLERI.GK, "GK");

    if (input.puanTuru === "P3") {
        validateTest(input.ebDogru ?? 0, input.ebYanlis ?? 0, TEST_LIMITLERI.EB, "Eğitim Bilimleri");
    }
}

export function hesaplaKpss(input: HesaplamaGirdisi): HesaplamaCiktisi {
    validateKpssInput(input);

    const katsayi = KATSAYILAR[input.puanTuru];
    const gyNet = hesaplaNet(input.gyDogru, input.gyYanlis);
    const gkNet = hesaplaNet(input.gkDogru, input.gkYanlis);
    const ebNet = input.puanTuru === "P3" ? hesaplaNet(input.ebDogru ?? 0, input.ebYanlis ?? 0) : undefined;
    const hamPuan = gyNet + gkNet + (ebNet ?? 0);
    const hamPuanEsigiKarsilandi = hamPuan >= 0.5;
    const negatifNetVar = [gyNet, gkNet, ebNet].some((net) => typeof net === "number" && net < 0);
    const uyarilar: string[] = [];

    if (negatifNetVar) {
        uyarilar.push("Negatif net oluştu; puan üretilmez.");
    }

    if (!hamPuanEsigiKarsilandi) {
        uyarilar.push("Ham puan eşiği karşılanamadı. En az 0,5 ham puan gerekir.");
    }

    const katkilar: NetKatkisi[] = [
        { test: "GY" as const, net: gyNet, katsayi: katsayi.GY, katkı: Number((gyNet * katsayi.GY).toFixed(2)) },
        { test: "GK" as const, net: gkNet, katsayi: katsayi.GK, katkı: Number((gkNet * katsayi.GK).toFixed(2)) },
    ];

    if (input.puanTuru === "P3" && typeof ebNet === "number") {
        katkilar.push({
            test: "EB",
            net: ebNet,
            katsayi: katsayi.EB ?? 0,
            katkı: Number((ebNet * (katsayi.EB ?? 0)).toFixed(2)),
        });
    }

    const puanUretildi = !negatifNetVar && hamPuanEsigiKarsilandi;
    const tahminiPuan = puanUretildi
        ? Number((katsayi.sabit + katkilar.reduce((total, item) => total + item.katkı, 0)).toFixed(2))
        : 0;

    return {
        gyNet,
        gkNet,
        ebNet,
        tahminiPuan,
        guvenAraligi: [Math.max(0, Number((tahminiPuan - 5).toFixed(2))), Number((tahminiPuan + 5).toFixed(2))],
        hamPuanEsigiKarsilandi,
        uyarilar,
        katkilar,
        puanUretildi,
    };
}

export function encodeStateToUrl(state: HesaplamaGirdisi) {
    const params = new URLSearchParams({
        tur: state.puanTuru,
        gyd: String(state.gyDogru),
        gyy: String(state.gyYanlis),
        gkd: String(state.gkDogru),
        gky: String(state.gkYanlis),
    });

    if (state.puanTuru === "P3") {
        params.set("ebd", String(state.ebDogru ?? 0));
        params.set("eby", String(state.ebYanlis ?? 0));
    }

    return `?${params.toString()}`;
}

function readParam(params: URLSearchParams, key: string, fallback: number, max: number) {
    const raw = params.get(key);
    if (!raw || !/^\d+$/.test(raw)) {
        return fallback;
    }

    return Math.min(max, Math.max(0, Number(raw)));
}

export function decodeUrlToState(search: string): HesaplamaGirdisi {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    const tur = params.get("tur") as PuanTuru | null;

    if (!tur || !PUAN_TURLERI.includes(tur)) {
        return { ...defaultState };
    }

    const nextState: HesaplamaGirdisi = {
        puanTuru: tur,
        gyDogru: readParam(params, "gyd", defaultState.gyDogru, TEST_LIMITLERI.GY),
        gyYanlis: readParam(params, "gyy", defaultState.gyYanlis, TEST_LIMITLERI.GY),
        gkDogru: readParam(params, "gkd", defaultState.gkDogru, TEST_LIMITLERI.GK),
        gkYanlis: readParam(params, "gky", defaultState.gkYanlis, TEST_LIMITLERI.GK),
        ebDogru: readParam(params, "ebd", defaultState.ebDogru ?? 0, TEST_LIMITLERI.EB),
        ebYanlis: readParam(params, "eby", defaultState.ebYanlis ?? 0, TEST_LIMITLERI.EB),
    };

    try {
        validateKpssInput(nextState);
        return nextState;
    } catch {
        return { ...defaultState };
    }
}

export function testLimitFor(key: TestKey) {
    return TEST_LIMITLERI[key];
}

export function hedefPuanKombinasyonlari(puanTuru: PuanTuru, hedefPuan: number, limit = 8) {
    const katsayi = KATSAYILAR[puanTuru];
    const combos: Array<{ gyNet: number; gkNet: number; ebNet?: number; tahminiPuan: number; fark: number }> = [];
    const ebValues = puanTuru === "P3" ? [20, 30, 40, 50, 60, 70, 80] : [undefined];

    for (let gy = 0; gy <= 60; gy += 5) {
        for (let gk = 0; gk <= 60; gk += 5) {
            for (const eb of ebValues) {
                const tahminiPuan = katsayi.sabit + gy * katsayi.GY + gk * katsayi.GK + ((eb ?? 0) * (katsayi.EB ?? 0));
                if (tahminiPuan >= hedefPuan) {
                    combos.push({
                        gyNet: gy,
                        gkNet: gk,
                        ebNet: eb,
                        tahminiPuan: Number(tahminiPuan.toFixed(2)),
                        fark: Number((tahminiPuan - hedefPuan).toFixed(2)),
                    });
                }
            }
        }
    }

    return combos.sort((a, b) => a.fark - b.fark || a.gyNet + a.gkNet - (b.gyNet + b.gkNet)).slice(0, limit);
}
