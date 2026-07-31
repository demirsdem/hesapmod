import type { CalculatorRuntimeMap } from "@/lib/calculator-types";
import { calculateAscendantResult } from "@/lib/ascendant";

export const formulas: CalculatorRuntimeMap = {
    "burc-hesaplama": (v) => {
            const d = new Date(v.birthDate);
            const m = d.getMonth() + 1;
            const gn = d.getDate();
            const yr = d.getFullYear();
            const BURCLAR = [
                { ad: "Oğlak", element: "Toprak", gezegen: "Satürn", baslangic: [1, 1], bitis: [1, 19] },
                { ad: "Kova", element: "Hava", gezegen: "Uranüs", baslangic: [1, 20], bitis: [2, 18] },
                { ad: "Balık", element: "Su", gezegen: "Neptün", baslangic: [2, 19], bitis: [3, 20] },
                { ad: "Koç", element: "Ateş", gezegen: "Mars", baslangic: [3, 21], bitis: [4, 19] },
                { ad: "Boğa", element: "Toprak", gezegen: "Venüs", baslangic: [4, 20], bitis: [5, 20] },
                { ad: "İkizler", element: "Hava", gezegen: "Merkür", baslangic: [5, 21], bitis: [6, 20] },
                { ad: "Yengeç", element: "Su", gezegen: "Ay", baslangic: [6, 21], bitis: [7, 22] },
                { ad: "Aslan", element: "Ateş", gezegen: "Güneş", baslangic: [7, 23], bitis: [8, 22] },
                { ad: "Başak", element: "Toprak", gezegen: "Merkür", baslangic: [8, 23], bitis: [9, 22] },
                { ad: "Terazi", element: "Hava", gezegen: "Venüs", baslangic: [9, 23], bitis: [10, 22] },
                { ad: "Akrep", element: "Su", gezegen: "Plüton", baslangic: [10, 23], bitis: [11, 21] },
                { ad: "Yay", element: "Ateş", gezegen: "Jüpiter", baslangic: [11, 22], bitis: [12, 21] },
                { ad: "Oğlak", element: "Toprak", gezegen: "Satürn", baslangic: [12, 22], bitis: [12, 31] },
            ];
            const b = BURCLAR.find(x => (m === x.baslangic[0] && gn >= x.baslangic[1]) || (m === x.bitis[0] && gn <= x.bitis[1])) ?? BURCLAR[0];
            const CIN = ["Maymun", "Horoz", "Köpek", "Domuz", "Sıçan", "Öküz", "Kaplan", "Tavşan", "Ejderha", "Yılan", "At", "Koyun"];
            const cinBurc = CIN[(yr - 2016 % 12 + 12) % 12];
            return { burc: b.ad as unknown as number, element: b.element as unknown as number, gezegen: b.gezegen as unknown as number, cinBurc: cinBurc as unknown as number };
        },
    "yukselen-burc-hesaplama": (v) => {
            const result = calculateAscendantResult(v.birthDate, v.birthTime, v.city);
            if (!result) return {};
            return {
                sunSign: { tr: `${result.sunSign.symbol} ${result.sunSign.tr}`, en: `${result.sunSign.symbol} ${result.sunSign.en}` } as any,
                ascendantSign: { tr: `${result.ascendantSign.symbol} ${result.ascendantSign.tr}`, en: `${result.ascendantSign.symbol} ${result.ascendantSign.en}` } as any,
                moonSign: { tr: `${result.moonSign.symbol} ${result.moonSign.tr}`, en: `${result.moonSign.symbol} ${result.moonSign.en}` } as any,
                estimatedRange: result.intervalLabel,
            };
        },
};
