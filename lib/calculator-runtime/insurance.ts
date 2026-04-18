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
            // 2026 tavan fiyatları örnek: Otomobil 12.000 TL, Kamyonet 15.000 TL, Motosiklet 4.000 TL
            const base = v.aracTuru === "otomobil" ? 12000 : v.aracTuru === "kamyonet" ? 15000 : 4000;
            // Kademe: 1: +50%, 2: +30%, 3: +10%, 4: 0, 5: -10%, 6: -20%, 7: -30%
            const kademeOran = [0.5, 0.3, 0.1, 0, -0.1, -0.2, -0.3][v.kademesi - 1] || 0;
            const tavanPrim = base * (1 + kademeOran);
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
            // 2026 DASK m² birim bedeli örnek: Betonarme 6.000 TL, Diğer 4.000 TL
            // Risk bölgesine göre prim çarpanı: 1.0, 0.9, 0.8, 0.7, 0.6
            const birim = v.yapiTarzi === "betonarme" ? 6000 : 4000;
            const teminatTutari = (Number(v.metrekare) || 0) * birim;
            const riskCarpani = [1, 0.9, 0.8, 0.7, 0.6][(Number(v.riskBolgesi) || 1) - 1] || 1;
            const tahminiPrim = teminatTutari * 0.0015 * riskCarpani; // örnek prim oranı
            return { teminatTutari, tahminiPrim };
        },
};
