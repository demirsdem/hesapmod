import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "yakit-tuketim-maliyet": (v) => {
            const d = parseFloat(v.distance) || 0;
            const c = parseFloat(v.consumption) || 0;
            const p = parseFloat(v.fuelPrice) || 0;
            const totalFuel = (d * c) / 100;
            const totalCost = totalFuel * p;
            return { totalFuel, totalCost, costPerKm: d !== 0 ? totalCost / d : 0 };
        },
    "hiz-mesafe-sure": (v) => {
            const s = parseFloat(v.speed) || 1;
            const d = parseFloat(v.distance) || 0;
            const hours = d / s;
            return { hours, minutes: Math.round(hours * 60) };
        },
    "mtv-hesaplama": (v) => {
            // 2026 MTV tarifeleri (yaklaşık — yeniden değerleme oranı %43,93 uygulandı)
            const TABLE: Record<string, Record<string, number>> = {
                "0-1300": { "1-3": 3800, "4-6": 2600, "6-11": 1900, "12-15": 1100, "16+": 600 },
                "1300-1600": { "1-3": 8200, "4-6": 5400, "6-11": 3800, "12-15": 1900, "16+": 800 },
                "1600-1800": { "1-3": 15800, "4-6": 10400, "6-11": 6800, "12-15": 3400, "16+": 1200 },
                "1800-2000": { "1-3": 23200, "4-6": 15800, "6-11": 9400, "12-15": 4800, "16+": 1700 },
                "2000-2500": { "1-3": 36800, "4-6": 25200, "6-11": 14600, "12-15": 7400, "16+": 2600 },
                "2500-3000": { "1-3": 59600, "4-6": 40600, "6-11": 22800, "12-15": 11400, "16+": 4000 },
                "3000-3500": { "1-3": 84400, "4-6": 57600, "6-11": 32400, "12-15": 16200, "16+": 5600 },
                "3500+": { "1-3": 109200, "4-6": 74400, "6-11": 41600, "12-15": 20800, "16+": 7200 },
            };
            const annualMTV = TABLE[v.engineCC]?.[v.ageGroup] ?? 0;
            return {
                annualMTV,
                installment1: annualMTV / 2,
                installment2: annualMTV / 2,
            };
        },
    "otv-hesaplama": (v) => {
            const base = parseFloat(v.basePrice) || 0;
            const RATES: Record<string, number> = {
                "0-1600": 45,
                "1600-2000": 120,
                "2000+": 220,
            };

            const otvRate = RATES[v.engineCC] ?? 45;
            const otvAmount = base * (otvRate / 100);
            const kdvBase = base + otvAmount;
            const kdvAmount = kdvBase * 0.20;
            const totalTax = otvAmount + kdvAmount;
            const totalPrice = base + totalTax;

            return { otvRate, otvAmount, kdvBase, kdvAmount, totalTax, totalPrice };
        },
};
