import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCorporateGuideSchema } from "../../components/corporate/CorporateGuidePage";
import { CORPORATE_GUIDE_BASE_PATH, corporateGuides } from "../corporate-guides";
import { buildSitemapEntries } from "../sitemap-data";
import { SITE_URL } from "../site";

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");

describe("corporate guide model", () => {
    it("keeps the three research intents distinct from sales, solution and estimator intent", () => {
        expect(corporateGuides.map((guide) => guide.intent)).toEqual(["cost_research", "build_or_buy_decision", "process_digitization_planning"]);
        expect(new Set(corporateGuides.map((guide) => guide.title)).size).toBe(3);
        expect(corporateGuides.find((guide) => guide.intent === "build_or_buy_decision")?.intro).toContain("Doğru seçim her zaman özel yazılım değildir");
    });

    it("covers required decisions without exact prices or fabricated cases", () => {
        const costGuide = corporateGuides[0];
        const costText = JSON.stringify(costGuide);
        expect(costText).toContain("Sabit fiyat, zaman-malzeme ve aşamalı proje modelleri");
        expect(costText).toContain("MVP ile riski azaltma");
        expect(costText).not.toMatch(/(?:₺|\bTL\b|\bUSD\b|\bEUR\b|\d[\d.]*\s*(?:lira|dolar|euro))/i);
        const transitionText = JSON.stringify(corporateGuides[2]);
        expect(transitionText.match(/Örnek senaryo —/g)).toHaveLength(5);
        expect(transitionText).toContain("gerçek müşteri veya vaka çalışması değil");
    });

    it("builds valid article, breadcrumb and visible FAQ schemas from the same source", () => {
        for (const guide of corporateGuides) {
            const schema = buildCorporateGuideSchema(guide);
            expect(JSON.parse(JSON.stringify(schema))).toEqual(schema);
            expect(schema.map((item) => item["@type"])).toEqual(["BreadcrumbList", "Article", "FAQPage"]);
            const faq = schema[2] as { mainEntity: Array<{ name: string }> };
            expect(faq.mainEntity.map((item) => item.name)).toEqual(guide.faq.map((item) => item.question));
        }
    });
});

describe("corporate guide routes and SEO", () => {
    const hub = read("app/kurumsal/rehber/page.tsx");
    const detail = read("app/kurumsal/rehber/[slug]/page.tsx");
    const component = read("components/corporate/CorporateGuidePage.tsx");

    it("defines four routes with a single visible H1 template", () => {
        expect(fs.existsSync(path.join(process.cwd(), "app/kurumsal/rehber/page.tsx"))).toBe(true);
        expect(fs.existsSync(path.join(process.cwd(), "app/kurumsal/rehber/[slug]/page.tsx"))).toBe(true);
        expect(hub.match(/<h1\b/g)).toHaveLength(1);
        expect(component.match(/<h1\b/g)).toHaveLength(1);
        expect(detail).toContain("dynamicParams = false");
        expect(detail).toContain("generateStaticParams");
    });

    it("uses unique metadata, self canonicals, social metadata and no hreflang", () => {
        expect(new Set(corporateGuides.map((guide) => guide.description)).size).toBe(3);
        expect(detail).toContain("alternates: { canonical: url }");
        expect(detail).toContain('type: "article"');
        expect(detail).toContain("twitter:");
        expect(`${hub}${detail}`).not.toContain("hreflang");
    });

    it("adds each guide URL exactly once to the sitemap", () => {
        const urls = [`${SITE_URL}${CORPORATE_GUIDE_BASE_PATH}`, ...corporateGuides.map((guide) => `${SITE_URL}${CORPORATE_GUIDE_BASE_PATH}/${guide.slug}`)];
        const entries = buildSitemapEntries();
        for (const url of urls) expect(entries.filter((entry) => entry.url === url)).toHaveLength(1);
        expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    });

    it("keeps guide links internal and includes both conversion destinations", () => {
        const expected = new Set(["/kurumsal/ozel-yazilim-gelistirme", "/kurumsal/api-entegrasyonu-ve-otomasyon", "/cozumler/excel-ve-manuel-isleri-yazilima-donusturme", "/kurumsal/yazilim-projesi-kapsam-hesaplama"]);
        for (const guide of corporateGuides) for (const link of guide.relatedLinks) expect(expected.has(link.href)).toBe(true);
        expect(component).toContain('href="/kurumsal/yazilim-projesi-kapsam-hesaplama"');
        expect(component).toContain('href="/iletisim?konu=kurumsal-yazilim"');
        expect(read("app/kurumsal/page.tsx")).toContain('href="/kurumsal/rehber"');
        expect(read("app/cozumler/page.tsx")).toContain('href="/kurumsal/rehber"');
        expect(read("components/corporate/HomeCorporateTransition.tsx")).toContain('href="/kurumsal/rehber"');
    });

    it("uses consent-controlled allowlisted CTA analytics without personal data", () => {
        expect(component).toContain("corporateAnalytics={{");
        expect(component).toContain('cta_location: "guide_estimator"');
        expect(component).toContain('cta_location: "guide_contact"');
        expect(component).not.toMatch(/corporateAnalytics=\{\{[^}]*\b(?:name|email|phone|company|message|description|ip):/s);
    });

    it("contains responsive overflow safeguards and a scrollable decision table", () => {
        expect(hub).toContain("overflow-x-clip");
        expect(component).toContain("overflow-x-clip");
        expect(component).toContain("overflow-x-auto");
        expect(component).toContain("minmax(0,1fr)");
        expect(`${hub}${component}`).not.toMatch(/min-w-\[[^\]]+\]/);
    });
});
