import { describe, expect, it } from "vitest";
import { buildSitemapEntries } from "../sitemap-data";
import { corporateServices, getCorporateService } from "../corporate-services";
import { SITE_URL } from "../site";

describe("corporate routes", () => {
    it("defines seven unique and complete services", () => {
        expect(corporateServices).toHaveLength(7);
        expect(new Set(corporateServices.map(({ slug }) => slug)).size).toBe(7);
        for (const service of corporateServices) {
            expect(service.title).toBeTruthy();
            expect(service.metadata.title).toBeTruthy();
            expect(service.metadata.description.length).toBeGreaterThan(80);
            expect(service.faq.length).toBeGreaterThanOrEqual(2);
            expect(service.relatedServices.length).toBeGreaterThanOrEqual(3);
            expect(service.relatedServices.every((slug) => Boolean(getCorporateService(slug)))).toBe(true);
        }
    });

    it("includes the corporate hub and every service in sitemap", () => {
        const urls = new Set(buildSitemapEntries().map(({ url }) => url));
        expect(urls.has(`${SITE_URL}/kurumsal`)).toBe(true);
        for (const service of corporateServices) expect(urls.has(`${SITE_URL}/kurumsal/${service.slug}`)).toBe(true);
    });
});
