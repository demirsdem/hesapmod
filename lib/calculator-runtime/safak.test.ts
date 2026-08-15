import { describe, expect, it } from "vitest";

import { formulas } from "./time";
import { calculators } from "../calculator-source";

const safak = formulas["safak-hesaplama"];

function discharge(values: Record<string, unknown>) {
    return safak(values as never).dischargeDate as string;
}

describe("safak-hesaplama motoru", () => {
    it("sayfadaki ornegi uretir: 1 Ocak Sulus + 6 Ay - 2 gun Yol = 29 Haziran", () => {
        expect(discharge({
            sulusDate: "2026-01-01",
            serviceMonths: "6",
            roadPermission: "2",
            leaveDays: "0",
        })).toBe("29.06.2026");
    });

    it("yol izni girilmediginde sure sonu aynen terhis tarihidir", () => {
        expect(discharge({
            sulusDate: "2026-01-01",
            serviceMonths: "6",
            roadPermission: "0",
            leaveDays: "0",
        })).toBe("01.07.2026");
    });

    it("kullanilmayan kanuni izin gunleri de terhisten dusulur (olu input degil)", () => {
        expect(discharge({
            sulusDate: "2026-01-01",
            serviceMonths: "6",
            roadPermission: "2",
            leaveDays: "5",
        })).toBe("24.06.2026");
    });

    it("bedelli (1 ay) ve yedek subay (12 ay) sureleri ayri hesaplanir", () => {
        expect(discharge({
            sulusDate: "2026-01-01", serviceMonths: "1", roadPermission: "0", leaveDays: "0",
        })).toBe("01.02.2026");
        expect(discharge({
            sulusDate: "2026-01-01", serviceMonths: "12", roadPermission: "0", leaveDays: "0",
        })).toBe("01.01.2027");
    });

    it("gecersiz sulus tarihinde bos sonuc doner", () => {
        expect(discharge({ sulusDate: "", serviceMonths: "6" })).toBe("—");
    });

    it("saat/dakika girisi sonucu degistirmez (hesap gun bazinda)", () => {
        const base = { sulusDate: "2026-01-01", serviceMonths: "6", roadPermission: "2", leaveDays: "0" };
        expect(discharge({ ...base, birthTime: "23:59" })).toBe(discharge({ ...base, birthTime: "00:00" }));
    });
});

describe("sulus tarihi form alani", () => {
    const entry = calculators.find((calculator) => calculator.slug === "safak-hesaplama");
    const sulusInput = entry?.inputs.find((input) => input.id === "sulusDate");

    it("etiket sulus tarihidir, dogum tarihi degil", () => {
        expect(sulusInput?.name.tr).toBe("Sülüs Tarihi");
    });

    it("saat alani gizlidir cunku motor saati kullanmaz", () => {
        expect(sulusInput?.showTime).toBe(false);
    });

    it("yil araligi askerlik sevk tarihlerini kapsar (1924-2010 varsayilani degil)", () => {
        const currentYear = new Date().getFullYear();
        expect(sulusInput?.yearRange?.min).toBeLessThanOrEqual(currentYear);
        expect(sulusInput?.yearRange?.max).toBeGreaterThanOrEqual(currentYear);
    });
});

describe("tarih inputlarinin varsayilan dogum-tarihi araligina dusmemesi", () => {
    const dateInputs = calculators.flatMap((calculator) =>
        calculator.inputs
            .filter((input) => input.type === "date")
            .map((input) => ({ slug: calculator.slug, input }))
    );

    // Yalnizca gercek dogum tarihi alanlari 1924-2010 varsayilanini kullanabilir.
    const birthDateAllowlist = new Set([
        "doguma-kalan-gun|birthDate",
        "burc-hesaplama|birthDate",
        "yas-hesaplama-detayli|birthDate",
        "yukselen-burc-hesaplama|birthDate",
        "yaş-hesaplama|birthDate",
        "yas-hesaplama-gun-ay-yil|birthDate",
    ]);

    it("dogum tarihi olmayan her date inputu acik bir yearRange tasir", () => {
        const unmarked = dateInputs
            .filter(({ slug, input }) => !birthDateAllowlist.has(`${slug}|${input.id}`))
            .filter(({ input }) => !input.yearRange)
            .map(({ slug, input }) => `${slug}|${input.id}`);
        expect(unmarked).toEqual([]);
    });

    it("gelecege donuk tarih alanlari bugunu ve sonrasini kabul eder", () => {
        const currentYear = new Date().getFullYear();
        for (const slug of ["kac-gun-kaldi-hesaplama", "safak-hesaplama", "asi-takvimi-hesaplama"]) {
            const input = dateInputs.find((entry) => entry.slug === slug)?.input;
            expect(input?.yearRange?.max, slug).toBeGreaterThanOrEqual(currentYear);
        }
    });
});
