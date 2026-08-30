import { describe, expect, it } from "vitest";
import { businessSolutions, getBusinessSolution, getSolutionContactPath, solutionContactValues } from "../business-solutions";
import { corporateServices } from "../corporate-services";
import { buildSitemapEntries } from "../sitemap-data";
import { SITE_URL } from "../site";

describe("business solution routes", () => {
    it("defines six unique and complete solution pages", () => {
        expect(businessSolutions).toHaveLength(6);
        expect(new Set(businessSolutions.map(({ slug }) => slug)).size).toBe(6);
        expect(new Set(businessSolutions.map(({ metadata }) => metadata.title)).size).toBe(6);
        expect(new Set(businessSolutions.map(({ metadata }) => metadata.description)).size).toBe(6);
        expect(new Set(solutionContactValues).size).toBe(6);
        for (const solution of businessSolutions) {
            expect(getBusinessSolution(solution.slug)).toBe(solution);
            expect(solution.metadata.description.length).toBeGreaterThan(80);
            expect(solution.faq.length).toBeGreaterThanOrEqual(2);
            expect(solution.relatedServices.every((slug) => corporateServices.some((service) => service.slug === slug))).toBe(true);
            expect(getSolutionContactPath(solution)).toContain(`hizmet=${encodeURIComponent(solution.cta.serviceValue)}`);
        }
    });

    it("adds unique solution URLs to the sitemap", () => {
        const urls = buildSitemapEntries().map(({ url }) => url);
        expect(new Set(urls).size).toBe(urls.length);
        expect(urls).toContain(`${SITE_URL}/cozumler`);
        for (const solution of businessSolutions) expect(urls).toContain(`${SITE_URL}/cozumler/${solution.slug}`);
    });
});
