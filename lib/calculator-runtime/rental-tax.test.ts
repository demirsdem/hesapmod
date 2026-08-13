import { describe, expect, it } from "vitest";

import { formulas } from "@/lib/calculator-runtime/salary-tax";

/**
 * Denetim Bulgu 2 (audits/2026-08/D5-hesap-dogrulugu.md) regresyon testleri.
 *
 * kira-vergisi motoru yıl ayrımı yapmıyordu: 2025 tarifesi + 47.000 TL istisna
 * sabit kodluydu. deger-artis-kazanci'daki getRuleYear/ruleSet deseni burada da
 * uygulanarak 2025 (2026 beyan dönemi) ve 2026 takvim yılı ayrıldı.
 *
 * DOĞRULANMIŞ KAYNAK DEĞERLERİ
 * ---------------------------
 * 2026 takvim yılı, ücret DIŞI gelir tarifesi (kira geliri GMSİ'dir, ücret değil):
 *   190.000 %15 / 400.000 %20 / 1.000.000 %27 / 5.300.000 %35 / üstü %40
 * 2026 mesken kira geliri istisnası: 58.000 TL (2025: 47.000 TL)
 * Götürü gider oranı: %15 (GVK m.74 — yıllık yeniden değerlemeye tabi değil)
 *
 * Kaynak: 332 Seri No'lu Gelir Vergisi Genel Tebliği (31.12.2025);
 * KPMG ve STB-CPA Turkey bültenleriyle çapraz doğrulandı.
 *
 * DİKKAT: 1.000.000 eşiği ücret DIŞI tarifeye aittir. gelir-vergisi-hesaplama
 * motorundaki 1.500.000 eşiği ÜCRET tarifesidir; kira gelirine uygulanamaz.
 */

const rentalTax = formulas["kira-vergisi-hesaplama"];

type RentalResult = {
    exemption: number;
    deductibleExpense: number;
    taxBase: number;
    incomeTax: number;
};

function calc(v: Record<string, unknown>): RentalResult {
    return rentalTax(v as never) as RentalResult;
}

describe("kira-vergisi-hesaplama — 2026 takvim yılı", () => {
    // 240.000 − 58.000 = 182.000; götürü %15 = 27.300; matrah 154.700
    // 154.700 < 190.000 → tamamı %15 → 23.205
    it("240.000 TL kira: istisna 58.000, matrah 154.700, vergi 23.205 TL", () => {
        const r = calc({ taxYear: "2026", annualRent: "240000", applyExemption: true, expenseMethod: "goturu" });
        expect(r.exemption).toBe(58000);
        expect(r.deductibleExpense).toBeCloseTo(27300, 2);
        expect(r.taxBase).toBeCloseTo(154700, 2);
        expect(r.incomeTax).toBeCloseTo(23205, 2);
    });

    // 600.000 − 58.000 = 542.000; gider 81.300; matrah 460.700
    // 190.000×0,15 + 210.000×0,20 + 60.700×0,27 = 28.500 + 42.000 + 16.389
    it("600.000 TL kira: üçüncü dilime taşar, vergi 86.889 TL", () => {
        const r = calc({ taxYear: "2026", annualRent: "600000", applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBeCloseTo(460700, 2);
        expect(r.incomeTax).toBeCloseTo(86889, 2);
    });

    // %27 dilimi 2026'da 1.000.000'da biter (ücret dışı tarife).
    // Matrahı tam 1.000.000 yapmak icin: rent = 1.000.000/0,85 + 58.000
    it("matrah tam 1.000.000 TL: %27 diliminin sonu, vergi 232.500 TL", () => {
        const rent = 1000000 / 0.85 + 58000;
        const r = calc({ taxYear: "2026", annualRent: String(rent), applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBeCloseTo(1000000, 6);
        // 28.500 + 42.000 + 600.000×0,27 = 28.500 + 42.000 + 162.000
        expect(r.incomeTax).toBeCloseTo(232500, 2);
    });

    // 1.000.000 esigini gecen matrah %35'e girer — 2025 tarifesinde bu esik
    // 800.000'di, dolayisiyla bu vaka iki tarifeyi kesin ayirir.
    it("matrah 1.100.000 TL: %35 dilimi 1.000.000 üstünde başlar", () => {
        const rent = 1100000 / 0.85 + 58000;
        const r = calc({ taxYear: "2026", annualRent: String(rent), applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBeCloseTo(1100000, 6);
        // 232.500 + 100.000×0,35 = 267.500
        expect(r.incomeTax).toBeCloseTo(267500, 2);
    });

    it("istisna kapatılınca 2026'da da uygulanmaz", () => {
        const r = calc({ taxYear: "2026", annualRent: "240000", applyExemption: false, expenseMethod: "goturu" });
        expect(r.exemption).toBe(0);
        expect(r.deductibleExpense).toBeCloseTo(36000, 2);
        expect(r.taxBase).toBeCloseTo(204000, 2);
        // 28.500 + 14.000×0,20 = 31.300
        expect(r.incomeTax).toBeCloseTo(31300, 2);
    });
});

describe("kira-vergisi-hesaplama — 2025 geliri / 2026 beyan dönemi", () => {
    // Mevcut davranış korunmalı: 47.000 istisna + 2025 tarifesi.
    // 240.000 − 47.000 = 193.000; gider 28.950; matrah 164.050
    // 158.000×0,15 + 6.050×0,20 = 23.700 + 1.210 = 24.910
    it("240.000 TL kira: istisna 47.000, matrah 164.050, vergi 24.910 TL", () => {
        const r = calc({ taxYear: "2025", annualRent: "240000", applyExemption: true, expenseMethod: "goturu" });
        expect(r.exemption).toBe(47000);
        expect(r.taxBase).toBeCloseTo(164050, 2);
        expect(r.incomeTax).toBeCloseTo(24910, 2);
    });

    it("2025 tarifesinde %35 dilimi 800.000'de başlar", () => {
        const rent = 900000 / 0.85 + 47000;
        const r = calc({ taxYear: "2025", annualRent: String(rent), applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBeCloseTo(900000, 6);
        // 158.000×0,15=23.700; 172.000×0,20=34.400; 470.000×0,27=126.900;
        // 100.000×0,35=35.000 → 220.000
        expect(r.incomeTax).toBeCloseTo(220000, 2);
    });

    it("varsayılan (taxYear verilmezse) 2026 takvim yılıdır", () => {
        const r = calc({ annualRent: "240000", applyExemption: true, expenseMethod: "goturu" });
        expect(r.exemption).toBe(58000);
        expect(r.incomeTax).toBeCloseTo(23205, 2);
    });
});

describe("kira-vergisi-hesaplama — yıllar gerçekten ayrışıyor", () => {
    it("aynı kira geliri iki yılda farklı vergi üretir", () => {
        const a = calc({ taxYear: "2025", annualRent: "240000", applyExemption: true, expenseMethod: "goturu" });
        const b = calc({ taxYear: "2026", annualRent: "240000", applyExemption: true, expenseMethod: "goturu" });
        expect(b.exemption).toBeGreaterThan(a.exemption);
        expect(b.incomeTax).toBeLessThan(a.incomeTax);
    });

    // %40 dilimi 5.300.000'da baslar. O noktaya kadar biriken taban vergi
    // ucret disi tarifede 1.737.500 TL'dir:
    //   190.000×0,15   =    28.500
    //   210.000×0,20   =    42.000
    //   600.000×0,27   =   162.000   (400.000 → 1.000.000)
    // 4.300.000×0,35   = 1.505.000   (1.000.000 → 5.300.000)
    // Ucret tarifesinde ayni nokta 1.697.500 TL olurdu (3. dilim 1.500.000'a
    // kadar surdugu icin). 40.000 TL'lik bu fark iki tarifeyi kesin ayirir.
    it("matrah tam 5.300.000 TL: %40 dilimi öncesi taban vergi 1.737.500 TL", () => {
        const rent = 5300000 / 0.85 + 58000;
        const r = calc({ taxYear: "2026", annualRent: String(rent), applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBeCloseTo(5300000, 6);
        expect(r.incomeTax).toBeCloseTo(1737500, 2);
        expect(r.incomeTax).not.toBeCloseTo(1697500, 2);
    });

    it("matrah 6.300.000 TL: %40 dilimi taban verginin üstüne eklenir", () => {
        const rent = 6300000 / 0.85 + 58000;
        const r = calc({ taxYear: "2026", annualRent: String(rent), applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBeCloseTo(6300000, 6);
        // 1.737.500 + 1.000.000×0,40 = 2.137.500
        expect(r.incomeTax).toBeCloseTo(2137500, 2);
    });

    it("kira geliri ÜCRET tarifesini kullanmaz (1.500.000 eşiği uygulanmamalı)", () => {
        // Matrah 1.100.000: ücret tarifesinde hâlâ %27 olurdu (263.700),
        // ücret dışı tarifede %35'e girer (267.500).
        const rent = 1100000 / 0.85 + 58000;
        const r = calc({ taxYear: "2026", annualRent: String(rent), applyExemption: true, expenseMethod: "goturu" });
        expect(r.incomeTax).toBeCloseTo(267500, 2);
        expect(r.incomeTax).not.toBeCloseTo(263700, 2);
    });
});

describe("kira-vergisi-hesaplama — gerçek gider ve sınır değerleri", () => {
    it("gerçek gider istisna oranında kısıtlanır (2026)", () => {
        const r = calc({
            taxYear: "2026", annualRent: "240000", applyExemption: true,
            expenseMethod: "gercek", actualExpense: "60000",
        });
        // 60.000 × (182.000/240.000) = 45.500
        expect(r.deductibleExpense).toBeCloseTo(45500, 2);
        expect(r.taxBase).toBeCloseTo(136500, 2);
    });

    it("istisna altındaki kira sıfır vergi üretir", () => {
        const r = calc({ taxYear: "2026", annualRent: "50000", applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBe(0);
        expect(r.incomeTax).toBe(0);
    });

    it("sıfır/boş girdi çökmez", () => {
        const r = calc({ taxYear: "2026", annualRent: "", applyExemption: true, expenseMethod: "goturu" });
        expect(r.taxBase).toBe(0);
        expect(r.incomeTax).toBe(0);
    });
});
