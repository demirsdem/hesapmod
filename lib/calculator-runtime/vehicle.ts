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
            // 2026 sadeleştirilmiş MTV planlama tablosu
            // Binek otomobiller için 2018 sonrası üst taşıt değeri bandı referans alınmıştır.
            const TABLE: Record<string, Record<string, number>> = {
                "0-1300": { "1-3": 6902, "4-6": 4807, "7-11": 2693, "12-15": 2032, "16+": 706 },
                "1300-1600": { "1-3": 12028, "4-6": 9012, "7-11": 5220, "12-15": 3685, "16+": 1408 },
                "1600-1800": { "1-3": 21251, "4-6": 16600, "7-11": 9775, "12-15": 5964, "16+": 2307 },
                "1800-2000": { "1-3": 33474, "4-6": 25784, "7-11": 15147, "12-15": 9012, "16+": 3547 },
                "2000-2500": { "1-3": 50217, "4-6": 36448, "7-11": 22768, "12-15": 13606, "16+": 5378 },
                "2500-3000": { "1-3": 70018, "4-6": 60905, "7-11": 38053, "12-15": 20466, "16+": 7503 },
                "3000-3500": { "1-3": 106641, "4-6": 95940, "7-11": 57791, "12-15": 28839, "16+": 10578 },
                "3500-4000": { "1-3": 167671, "4-6": 152866, "7-11": 91714, "12-15": 41634, "16+": 16084 },
                "4000+": { "1-3": 274415, "4-6": 205780, "7-11": 121132, "12-15": 54711, "16+": 21252 },
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
            const pickRate = (vehicleType: string, amount: number) => {
                if (vehicleType === "ice-under1400") {
                    if (amount <= 650000) return 70;
                    if (amount <= 900000) return 75;
                    if (amount <= 1100000) return 80;
                    return 90;
                }
                if (vehicleType === "ice-1400-1600") {
                    if (amount <= 850000) return 75;
                    if (amount <= 1100000) return 80;
                    if (amount <= 1650000) return 90;
                    return 100;
                }
                if (vehicleType === "ice-1600-2000") {
                    if (amount <= 1650000) return 150;
                    return 170;
                }
                if (vehicleType === "ice-2000plus") return 220;
                if (vehicleType === "bev-under160") {
                    if (amount <= 1650000) return 25;
                    return 55;
                }
                if (vehicleType === "bev-over160") {
                    if (amount <= 1650000) return 65;
                    return 75;
                }
                if (vehicleType === "phev-under1800") {
                    if (amount <= 1350000) return 45;
                    return 85;
                }
                if (vehicleType === "phev-under2500") {
                    if (amount <= 1350000) return 75;
                    return 95;
                }
                if (vehicleType === "pickup-8704") return 50;
                return 100;
            };

            const otvRate = pickRate(v.vehicleType, base);
            const otvAmount = base * (otvRate / 100);
            const kdvBase = base + otvAmount;
            const kdvAmount = kdvBase * 0.20;
            const totalTax = otvAmount + kdvAmount;
            const totalPrice = base + totalTax;

            return { otvRate, otvAmount, kdvBase, kdvAmount, totalTax, totalPrice };
        },
    "elektrikli-arac-sarj-maliyeti-hesaplama": (v) => {
            const batarya = Number(v.batarya) || 0;
            const mevcut = Number(v.mevcutYuzde) || 0;
            const hedef = Number(v.hedefYuzde) || 0;
            const birim = Number(v.birimFiyat) || 0;
            const doldurulacakKwh = batarya * (Math.max(hedef - mevcut, 0) / 100);
            const toplamMaliyet = doldurulacakKwh * birim;
            return { doldurulacakKwh, toplamMaliyet };
        },
    "arac-muayene-ucreti-hesaplama": (v) => {
            const fiyatlar: Record<string, number> = { otomobil: 1821, traktor: 927, otobus: 2456 };
            const aracTuru = typeof v.aracTuru === 'string' && fiyatlar[v.aracTuru] ? v.aracTuru : 'otomobil';
            const temelUcret = fiyatlar[aracTuru];
            const gecikme = Number(v.gecikme) || 0;
            const gecikmeCezasi = temelUcret * 0.05 * gecikme;
            const toplamTutar = temelUcret + gecikmeCezasi;
            return { temelUcret, gecikmeCezasi, toplamTutar };
        },
    "yakit-tuketimi-hesaplama": (v) => {
            const dist = parseFloat(v.distance) || 0;
            const liters = parseFloat(v.liters) || 0;
            const price = parseFloat(v.price) || 0;
            
            if (dist === 0) return { avgConsumption: 0, costPerKm: 0, totalCost: 0 };
            
            return {
                avgConsumption: (liters / dist) * 100,
                costPerKm: (liters * price) / dist,
                totalCost: liters * price
            };
        },
    "elektrikli-arac-sarj-hesaplama": (v) => {
            const cap = parseFloat(v.batteryStr) || 0;
            const pct = parseFloat(v.percent) || 0;
            const prc = parseFloat(v.kwhPrice) || 0;
            
            const neededKwh = cap * (pct / 100);
            return {
                neededKwh: neededKwh,
                cost: neededKwh * prc
            };
        },
};
