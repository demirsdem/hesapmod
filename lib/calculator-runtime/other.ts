import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "zekat-hesaplama": (v) => {
            const altinDegeri = (Number(v.altin) || 0) * (Number(v.altinFiyat) || 0);
            const toplam = (Number(v.nakit) || 0) + (Number(v.doviz) || 0) + altinDegeri + (Number(v.ticariMal) || 0);
            const net = toplam - (Number(v.borc) || 0);
            const nisap = 80.18 * (Number(v.altinFiyat) || 0); // 2026 nisap gramı
            if (net < nisap) return { netServet: net, zekatTutari: 0, uyari: "Zekat düşmemektedir." };
            return { netServet: net, zekatTutari: net * 0.025, uyari: "" };
        },
    "klima-btu-hesaplama": (v) => {
            const katsayi: Record<string, number> = { marmara: 385, ege: 400, akdeniz: 445, ic: 360, karadeniz: 350, dogu: 420, guney: 430 };
            const m2 = Number(v.metrekare) || 0;
            const bolgeKey = typeof v.bolge === 'string' && katsayi[v.bolge] ? v.bolge : 'marmara';
            const bolge = katsayi[bolgeKey];
            const kisi = Number(v.kisi) || 1;
            const kapasite = m2 * bolge + kisi * 600;
            let tavsiye = '';
            if (kapasite <= 9000) tavsiye = '9.000 BTU';
            else if (kapasite <= 12000) tavsiye = '12.000 BTU';
            else if (kapasite <= 18000) tavsiye = '18.000 BTU';
            else tavsiye = '24.000 BTU+';
            return { kapasite, tavsiye };
        },
};
