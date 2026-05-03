import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "kasko-degeri-hesaplama": (v) => {
            // Basit örnek algoritma: Yaşa göre oran aralığı
            let oran = 0.025; // default %2.5
            if (v.aracYasi <= 2) oran = 0.018;
            else if (v.aracYasi <= 5) oran = 0.022;
            else if (v.aracYasi <= 10) oran = 0.027;
            else oran = 0.035;
            const tahminiPrim = v.kaskoBedeli * oran;
            return { tahminiPrim };
        },
    "trafik-sigortasi-hesaplama": (v) => {
            // 2026 yaklaşık 4. basamak tavanları: otomobil 15.160 TL, kamyonet 19.818 TL, motosiklet 6.180 TL.
            const base = v.aracTuru === "otomobil" ? 15160 : v.aracTuru === "kamyonet" ? 19818 : 6180;
            const kademeCarpani: Record<string, number> = {
                "0": 3,
                "1": 2.35,
                "2": 1.9,
                "3": 1.45,
                "4": 1,
                "5": 0.85,
                "6": 0.7,
                "7": 0.55,
                "8": 0.5,
            };
            const tavanPrim = base * (kademeCarpani[String(v.kademesi)] ?? 1);
            return { tavanPrim };
        },
    "arac-deger-kaybi-hesaplama": (v) => {
            // Yargıtay formülü: rayiç bedel x hasar katsayısı x km katsayısı x 0.9
            const rayic = Number(v.rayicBedel) || 0;
            const hasar = Number(v.hasarTutari) || 0;
            const km = Number(v.km) || 0;
            let hasarKatsayi = 0.15; // örnek: %15
            if (hasar < rayic * 0.05) hasarKatsayi = 0.08;
            else if (hasar < rayic * 0.10) hasarKatsayi = 0.12;
            else if (hasar < rayic * 0.20) hasarKatsayi = 0.15;
            else hasarKatsayi = 0.18;
            let kmKatsayi = 1;
            if (km > 150000) kmKatsayi = 0.7;
            else if (km > 100000) kmKatsayi = 0.8;
            else if (km > 50000) kmKatsayi = 0.9;
            const degerKaybi = rayic * hasarKatsayi * kmKatsayi * 0.9;
            return { degerKaybi };
        },
    "dask-sigortasi-hesaplama": (v) => {
            // DASK 01.04.2026 tarifesi: betonarme 10.473 TL/m², diğer 6.982 TL/m², azami teminat 2.220.218 TL.
            const betonarmeBirim = 10473;
            const digerBirim = 6982;
            const azamiTeminat = 2220218;
            const birim = v.yapiTarzi === "betonarme" ? betonarmeBirim : digerBirim;
            const teminatTutari = Math.min((Number(v.metrekare) || 0) * birim, azamiTeminat);
            const betonarmeOranlar = [2953, 2629, 2231, 2095, 1571, 1121, 765].map((prim) => prim / (100 * betonarmeBirim));
            const digerOranlar = [3463, 2967, 2604, 2437, 1948, 1299, 761].map((prim) => prim / (100 * digerBirim));
            const riskIndex = Math.min(6, Math.max(0, (Number(v.riskBolgesi) || 1) - 1));
            const oran = v.yapiTarzi === "betonarme" ? betonarmeOranlar[riskIndex] : digerOranlar[riskIndex];
            const tahminiPrim = teminatTutari * oran;
            return { teminatTutari, tahminiPrim };
        },
};
