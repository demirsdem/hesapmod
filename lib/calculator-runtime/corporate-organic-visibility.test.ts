import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mainCategories } from "../categories";
import { corporateServices } from "../corporate-services";
import { businessSolutions } from "../business-solutions";
import { DEFAULT_CORPORATE_CATEGORY_MESSAGE, getCorporateCategoryMessage } from "../corporate-category-messages";
import { footerCorporateLinks } from "../footer-corporate-links";
import { resetCorporateEventDeduplicationForTests, sanitizeCorporateEventParams, trackCorporateEvent } from "../corporate-analytics";

const read = (relativePath: string) => fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("corporate category messaging", () => {
    it("maps the requested existing category slugs centrally", () => {
        expect(getCorporateCategoryMessage("maas-ve-vergi")).toContain("Bordro");
        expect(getCorporateCategoryMessage("finansal-hesaplamalar")).toContain("Finansal hesaplamaları");
        expect(getCorporateCategoryMessage("ticaret-ve-is")).toContain("Teklif, sipariş, stok");
        expect(getCorporateCategoryMessage("zaman-hesaplama")).toContain("vardiya");
        expect(getCorporateCategoryMessage("sinav-hesaplamalari")).toContain("Puanlama");
        expect(getCorporateCategoryMessage("insaat-muhendislik")).toContain("metraj");
        for (const slug of ["maas-ve-vergi", "finansal-hesaplamalar", "ticaret-ve-is", "zaman-hesaplama", "sinav-hesaplamalari", "insaat-muhendislik"]) expect(mainCategories.some((category) => category.slug === slug)).toBe(true);
    });

    it("normalizes aliases and safely falls back for unknown categories", () => {
        expect(getCorporateCategoryMessage("finans")).toBe(getCorporateCategoryMessage("finansal-hesaplamalar"));
        expect(getCorporateCategoryMessage("unknown-category")).toBe(DEFAULT_CORPORATE_CATEGORY_MESSAGE);
    });
});

describe("shared placement and responsive safeguards", () => {
    const calculatorPage = read("app/[category]/[slug]/page.tsx");
    const categoryPage = read("app/kategori/[slug]/page.tsx");
    const calculatorCta = read("components/corporate/CalculatorCorporateCta.tsx");
    const categoryStrip = read("components/corporate/CategoryCorporateStrip.tsx");

    it("renders one calculator CTA after the calculator and disclaimer but before rich content", () => {
        expect(calculatorPage.match(/<CalculatorCorporateCta\b/g)).toHaveLength(1);
        expect(calculatorPage.indexOf("<CalculatorCorporateCta")).toBeGreaterThan(calculatorPage.indexOf("<CalculatorEngine"));
        expect(calculatorPage.indexOf("<CalculatorCorporateCta")).toBeGreaterThan(calculatorPage.indexOf("<MedicalDisclaimer"));
        expect(calculatorPage.indexOf("<CalculatorCorporateCta")).toBeLessThan(calculatorPage.indexOf("{/* ── 4. RICH CONTENT"));
        expect(calculatorCta).not.toContain("<h1");
    });

    it("renders the category strip once after the calculator list", () => {
        expect(categoryPage.match(/<CategoryCorporateStrip\b/g)).toHaveLength(1);
        expect(categoryPage.indexOf("<CategoryCorporateStrip")).toBeGreaterThan(categoryPage.indexOf("Kategorideki Araçlar"));
        expect(categoryStrip).not.toContain("<h1");
    });

    it("supports requested widths with fluid, breakpoint and dark-theme classes", () => {
        for (const source of [calculatorCta, categoryStrip]) {
            expect(source).toContain("min-w-0");
            expect(source).toContain("max-w-full");
            expect(source).toContain("dark:");
            expect(source).toContain("sm:");
            expect(source).toContain("lg:");
            expect(source).not.toMatch(/min-w-\[[^\]]+\]/);
            expect(source).not.toMatch(/w-\[(?:320|375|768|1366|1920)px\]/);
        }
        expect(categoryStrip).toContain("overflow-hidden");
        expect(calculatorCta).toContain("w-full min-w-0 max-w-full grid-cols-1");
        expect(calculatorCta).toContain("sm:grid-cols-2 lg:w-auto lg:grid-cols-1 xl:grid-cols-2");
        expect(calculatorCta).toContain("whitespace-normal break-words");
        expect(calculatorCta).not.toContain("overflow-hidden");
        expect(calculatorCta).not.toContain("whitespace-nowrap");
    });
});

describe("corporate CTA analytics", () => {
    beforeEach(() => {
        resetCorporateEventDeduplicationForTests();
        vi.stubGlobal("window", { location: { pathname: "/finansal-hesaplamalar/kdv-hesaplama" }, dataLayer: [] });
        vi.stubGlobal("document", { cookie: "" });
    });
    afterEach(() => vi.unstubAllGlobals());

    it("does not send before consent and sends only allowlisted context afterwards", () => {
        const params = { form_type: "corporate", service: "finansal-hesaplamalar", source_path: "/finansal-hesaplamalar/kdv-hesaplama", cta_location: "calculator_context", calculator_input: "100000", calculator_result: "120000", message: "free text", email: "x@example.com" };
        expect(trackCorporateEvent("corporate_cta_click", params)).toBe(false);
        document.cookie = "hesapmod-cookie-consent=accepted";
        expect(trackCorporateEvent("corporate_cta_click", params)).toBe(true);
        expect(window.dataLayer?.[0]).toEqual({ event: "corporate_cta_click", form_type: "corporate", service: "finansal-hesaplamalar", source_path: "/finansal-hesaplamalar/kdv-hesaplama", cta_location: "calculator_context" });
        expect(sanitizeCorporateEventParams(params)).not.toHaveProperty("calculator_input");
        expect(sanitizeCorporateEventParams(params)).not.toHaveProperty("calculator_result");
    });
});

describe("footer corporate links", () => {
    it("resolves six unique real routes from existing corporate data", () => {
        expect(footerCorporateLinks).toHaveLength(6);
        expect(new Set(footerCorporateLinks.map((link) => link.href)).size).toBe(6);
        const knownRoutes = new Set([
            ...corporateServices.map((service) => `/kurumsal/${service.slug}`),
            ...businessSolutions.map((solution) => `/cozumler/${solution.slug}`),
            "/kurumsal/yazilim-projesi-kapsam-hesaplama",
            "/iletisim?konu=kurumsal-yazilim",
        ]);
        for (const link of footerCorporateLinks) expect(knownRoutes.has(link.href)).toBe(true);
    });

    it("uses footer_corporate analytics without duplicate hrefs", () => {
        const footer = read("components/Footer.tsx");
        expect(footer).toContain('cta_location: "footer_corporate"');
        expect(footer.match(/footerCorporateLinks\.map/g)).toHaveLength(1);
    });
});
