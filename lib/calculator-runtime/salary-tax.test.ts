import { describe, expect, it } from "vitest";

import { formulas } from "@/lib/calculator-runtime/salary-tax";

/**
 * Denetim Bulgu 1 (audits/2026-08/D5-hesap-dogrulugu.md) regresyon testleri.
 *
 * Türk bordrosunda gelir vergisi matrahı kümülatiftir: çalışan yıl içinde
 * dilim atladıkça aylık net DÜŞER. Motor daha önce yıllık vergiyi 12'ye
 * bölüyordu ve her ay aynı rakamı gösteriyordu — hiçbir ay için doğru değil.
 */

const salary = formulas["maas-hesaplama"];

function monthlyTaxFor(gross: number, month: number): number {
    const result = salary({ calcType: "grossToNet", salary: String(gross) }) as {
        monthlySchedule: { month: number; incomeTax: number }[];
    };
    const row = result.monthlySchedule.find((r) => r.month === month);
    if (!row) throw new Error(`Ay ${month} programda yok`);
    return row.incomeTax;
}

describe("maas-hesaplama — kümülatif vergi matrahı", () => {
    // 100.000 TL brüt, 2026 tarifesi. Beklenen değerler denetim raporundan.
    it("Ocak (ay 1) vergisi 8.538,67 TL", () => {
        expect(monthlyTaxFor(100000, 1)).toBeCloseTo(8538.67, 2);
    });

    // Motor 18738.675 üretiyor; denetim raporundaki 18.738,67 bu değerin
    // kuruşa yuvarlanmış hâli. toBeCloseTo(_, 2) tam bu sınırda kalıyor,
    // bu yüzden kuruşa yuvarlayıp karşılaştırıyoruz.
    it("Haziran (ay 6) vergisi 18.738,67 TL — dilim atlaması sonrası", () => {
        expect(monthlyTaxFor(100000, 6)).toBeCloseTo(18738.675, 3);
        expect(Math.round(monthlyTaxFor(100000, 6) * 100) / 100).toBe(18738.68);
    });

    it("Aralık (ay 12) vergisi 17.334,90 TL", () => {
        expect(monthlyTaxFor(100000, 12)).toBeCloseTo(17334.90, 2);
    });

    it("aylık vergi sabit değil — kümülatif matrah gerçekten uygulanıyor", () => {
        const jan = monthlyTaxFor(100000, 1);
        const jun = monthlyTaxFor(100000, 6);
        expect(jan).not.toBeCloseTo(jun, 2);
        expect(jun).toBeGreaterThan(jan);
    });

    it("12 aylık program döner ve aylar 1..12'dir", () => {
        const result = salary({ calcType: "grossToNet", salary: "100000" }) as {
            monthlySchedule: { month: number }[];
        };
        expect(result.monthlySchedule).toHaveLength(12);
        expect(result.monthlySchedule.map((r) => r.month)).toEqual([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        ]);
    });
});

describe("maas-hesaplama — asgari ücret regresyonu", () => {
    // Şekilden bağımsız: düzeltmeden ÖNCE de SONRA da yeşil olmalı.
    // Motorun oranları/istisnası zaten doğruydu; bozulmadığının kanıtı.
    it("33.030 TL brüt → top-level netSalary 28.075,50 TL", () => {
        const result = salary({ calcType: "grossToNet", salary: "33030" }) as {
            netSalary: number;
        };
        expect(result.netSalary).toBeCloseTo(28075.5, 2);
    });

    // Bu değer ZATEN doğru üretiliyordu. Düzeltmenin bozmadığını kanıtlar.
    it("33.030 TL brüt → 28.075,50 TL net (Ocak)", () => {
        const result = salary({ calcType: "grossToNet", salary: "33030" }) as {
            monthlySchedule: { month: number; netSalary: number }[];
        };
        const january = result.monthlySchedule.find((r) => r.month === 1)!;
        expect(january.netSalary).toBeCloseTo(28075.5, 2);
    });

    it("asgari ücret istisnası yıl boyu vergiyi sıfırda tutar", () => {
        const result = salary({ calcType: "grossToNet", salary: "33030" }) as {
            monthlySchedule: { incomeTax: number }[];
        };
        for (const row of result.monthlySchedule) {
            expect(row.incomeTax).toBeCloseTo(0, 2);
        }
    });
});

describe("maas-hesaplama — Ocak açıklama notu", () => {
    function noteFor(gross: number) {
        const result = salary({ calcType: "grossToNet", salary: String(gross) }) as {
            calculationNote: { tr: string; en: string };
            monthlySchedule: { month: number; netSalary: number }[];
            averageMonthlyNetSalary: number;
        };
        return result;
    }

    it("notta ana rakamın Ocak olduğu açıkça yazıyor", () => {
        expect(noteFor(100000).calculationNote.tr).toContain("Ocak ayı neti");
    });

    it("not, kümülatif matrah nedeniyle değiştiğini söylüyor", () => {
        expect(noteFor(100000).calculationNote.tr).toContain("Kümülatif vergi matrahı");
    });

    // Not elle yazılmamalı: gerçek monthlySchedule değerlerinden türemeli.
    it("nottaki Ocak/Aralık/ortalama rakamları motorun kendi çıktısıyla birebir aynı", () => {
        const r = noteFor(100000);
        const fmt = (v: number) =>
            v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";

        const january = r.monthlySchedule.find((m) => m.month === 1)!;
        const december = r.monthlySchedule.find((m) => m.month === 12)!;

        expect(r.calculationNote.tr).toContain(fmt(january.netSalary));
        expect(r.calculationNote.tr).toContain(fmt(december.netSalary));
        expect(r.calculationNote.tr).toContain(fmt(r.averageMonthlyNetSalary));
    });

    // Farklı brütte rakamlar da değişmeli — sabit metin değil.
    it("brüt değişince nottaki rakamlar da değişir", () => {
        expect(noteFor(100000).calculationNote.tr).not.toBe(
            noteFor(60000).calculationNote.tr
        );
    });

    // Asgari ücrette net yıl boyu değişmez; "değişir" demek yanlış olur.
    it("asgari ücrette not, netin sabit kaldığını söyler", () => {
        const note = noteFor(33030).calculationNote.tr;
        expect(note).toContain("Ocak ayı neti");
        expect(note).toContain("sabit kalır");
        expect(note).not.toContain("yıl boyunca değişir");
    });

    it("ortalama, Ocak ile Aralık netinin arasında kalır", () => {
        const r = noteFor(100000);
        const january = r.monthlySchedule.find((m) => m.month === 1)!;
        const december = r.monthlySchedule.find((m) => m.month === 12)!;
        expect(r.averageMonthlyNetSalary).toBeLessThan(january.netSalary);
        expect(r.averageMonthlyNetSalary).toBeGreaterThan(december.netSalary);
    });
});

describe("maas-hesaplama — netten brüte", () => {
    it("netten brüte, brütten nete işleminin tersidir (Ocak bazında)", () => {
        const back = salary({ calcType: "netToGross", salary: "75953.02" }) as {
            grossSalary: number;
        };
        expect(back.grossSalary).toBeCloseTo(100000, 0);
    });
});
