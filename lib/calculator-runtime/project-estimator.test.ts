import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateProjectEstimate, projectEstimatorOptions, projectScopeBands, type ProjectEstimatorInput } from "../project-estimator";
import { PROJECT_ESTIMATE_MAX_BYTES, PROJECT_ESTIMATE_SESSION_KEY, prefillProjectSummary, readProjectEstimate, saveProjectEstimate } from "../project-estimator-storage";
import { resetProjectEstimatorEventsForTests, sanitizeProjectEstimatorParams, trackProjectEstimatorEvent } from "../project-estimator-analytics";
import { buildSitemapEntries } from "../sitemap-data";
import { SITE_URL } from "../site";

const baseline: ProjectEstimatorInput = { projectType: "new_custom", platform: "web", coreNeeds: ["admin"], integration: "none", migration: "none", users: "small_team", extras: [] };
function memoryStorage(initial?: string) {
    const values = new Map<string, string>();
    if (initial !== undefined) values.set(PROJECT_ESTIMATE_SESSION_KEY, initial);
    return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); }, has: () => values.has(PROJECT_ESTIMATE_SESSION_KEY) };
}

describe("project estimator scoring", () => {
    it("uses transparent ordered thresholds", () => {
        expect(projectScopeBands.map((band) => band.level)).toEqual(["Başlangıç", "Orta kapsam", "İleri kapsam", "Kurumsal/çok aşamalı"]);
        expect(projectScopeBands.map((band) => band.min)).toEqual([3, 6, 11, 19]);
        expect(projectScopeBands.map((band) => band.maxWeeks)).toEqual([5, 10, 18, 30]);
    });

    it("is deterministic for identical inputs", () => {
        expect(calculateProjectEstimate(baseline)).toEqual(calculateProjectEstimate({ ...baseline, coreNeeds: [...baseline.coreNeeds] }));
    });

    it("produces a valid result for every declared option", () => {
        for (const [projectType] of projectEstimatorOptions.projectType) expect(calculateProjectEstimate({ ...baseline, projectType }).durationMinWeeks).toBeGreaterThan(0);
        for (const [platform] of projectEstimatorOptions.platform) expect(calculateProjectEstimate({ ...baseline, platform }).level).toBeTruthy();
        for (const [coreNeed] of projectEstimatorOptions.coreNeeds) expect(calculateProjectEstimate({ ...baseline, coreNeeds: [coreNeed] }).summary).toContain("Temel ihtiyaçlar");
        for (const [integration] of projectEstimatorOptions.integration) expect(calculateProjectEstimate({ ...baseline, integration }).technicalTopics.length).toBeGreaterThan(0);
        for (const [migration] of projectEstimatorOptions.migration) expect(calculateProjectEstimate({ ...baseline, migration }).solutionType).toBeTruthy();
        for (const [users] of projectEstimatorOptions.users) expect(calculateProjectEstimate({ ...baseline, users }).team.length).toBeGreaterThan(0);
        for (const [extra] of projectEstimatorOptions.extras) expect(calculateProjectEstimate({ ...baseline, extras: [extra] }).maintenance).toBeTruthy();
    });

    it("produces a valid result across categorical combinations and every checkbox subset", () => {
        const coreKeys = projectEstimatorOptions.coreNeeds.map(([key]) => key);
        const extraKeys = projectEstimatorOptions.extras.map(([key]) => key);
        for (const [projectType] of projectEstimatorOptions.projectType) {
            for (const [platform] of projectEstimatorOptions.platform) {
                for (const [integration] of projectEstimatorOptions.integration) {
                    for (const [migration] of projectEstimatorOptions.migration) {
                        for (const [users] of projectEstimatorOptions.users) {
                            for (let mask = 0; mask < 256; mask += 1) {
                                const coreNeeds = coreKeys.filter((_, index) => Boolean(mask & (1 << index)));
                                const extras = extraKeys.filter((_, index) => Boolean((mask % 64) & (1 << index)));
                                const result = calculateProjectEstimate({ projectType, platform, coreNeeds, integration, migration, users, extras });
                                expect(result.durationMinWeeks).toBeGreaterThan(0);
                                expect(result.durationMaxWeeks).toBeGreaterThanOrEqual(result.durationMinWeeks);
                            }
                        }
                    }
                }
            }
        }
    });

    it("never shortens the duration as scope grows", () => {
        const inputs: ProjectEstimatorInput[] = [
            baseline,
            { ...baseline, coreNeeds: ["admin", "roles", "reporting"], integration: "single", migration: "spreadsheet" },
            { ...baseline, projectType: "saas", platform: "multi_platform", coreNeeds: projectEstimatorOptions.coreNeeds.map(([key]) => key), integration: "business_suite", migration: "messy", users: "multi_tenant", extras: projectEstimatorOptions.extras.map(([key]) => key) },
        ];
        const durations = inputs.map((input) => calculateProjectEstimate(input).durationMinWeeks);
        expect(durations).toEqual([...durations].sort((a, b) => a - b));
    });
});

describe("project estimator session transfer", () => {
    it("stores, reads, applies and removes a valid summary", () => {
        const storage = memoryStorage();
        expect(saveProjectEstimate(storage, "Güvenli proje özeti")).toBe(true);
        expect(readProjectEstimate(storage)).toBe("Güvenli proje özeti");
        expect(prefillProjectSummary("", storage)).toEqual({ message: "Güvenli proje özeti", applied: true });
        expect(storage.has()).toBe(false);
    });

    it("rejects malformed, manipulated and oversized session values", () => {
        expect(readProjectEstimate(memoryStorage("{"))).toBeNull();
        expect(readProjectEstimate(memoryStorage(JSON.stringify({ version: 2, summary: "metin" })))).toBeNull();
        expect(readProjectEstimate(memoryStorage(JSON.stringify({ version: 1, summary: 42 })))).toBeNull();
        expect(readProjectEstimate(memoryStorage("x".repeat(PROJECT_ESTIMATE_MAX_BYTES + 1)))).toBeNull();
        expect(saveProjectEstimate(memoryStorage(), "x".repeat(4001))).toBe(false);
    });

    it("does not overwrite an existing form message", () => {
        const storage = memoryStorage(JSON.stringify({ version: 1, summary: "Oluşturulan özet" }));
        expect(prefillProjectSummary("Kullanıcının mevcut metni", storage)).toEqual({ message: "Kullanıcının mevcut metni", applied: false });
        expect(storage.has()).toBe(true);
    });
});

describe("project estimator analytics", () => {
    beforeEach(() => {
        resetProjectEstimatorEventsForTests();
        vi.stubGlobal("window", { location: { pathname: "/kurumsal/yazilim-projesi-kapsam-hesaplama" }, dataLayer: [] });
        vi.stubGlobal("document", { cookie: "hesapmod-cookie-consent=accepted" });
    });
    afterEach(() => vi.unstubAllGlobals());

    it("removes personal and free-text fields", () => {
        expect(sanitizeProjectEstimatorParams({ project_type: "saas", platform_group: "web", scope_level: "İleri kapsam", integration_level: "multiple", name: "Kişi", email: "x@example.com", company: "Firma", message: "Serbest metin", ip: "127.0.0.1" })).toEqual({ project_type: "saas", platform_group: "web", scope_level: "İleri kapsam", integration_level: "multiple" });
    });

    it("sends each estimator event only once per instance", () => {
        expect(trackProjectEstimatorEvent("project_estimator_complete", { scope_level: "Orta kapsam" }, "test-instance")).toBe(true);
        expect(trackProjectEstimatorEvent("project_estimator_complete", { scope_level: "Orta kapsam" }, "test-instance")).toBe(false);
        expect((window.dataLayer ?? []).filter((item) => item.event === "project_estimator_complete")).toHaveLength(1);
    });
});

describe("project estimator route and SEO", () => {
    const pagePath = path.join(process.cwd(), "app/kurumsal/yazilim-projesi-kapsam-hesaplama/page.tsx");
    const componentPath = path.join(process.cwd(), "components/corporate/ProjectEstimator.tsx");
    const page = fs.readFileSync(pagePath, "utf8");
    const component = fs.readFileSync(componentPath, "utf8");

    it("has one H1, unique metadata, canonical and matching schemas", () => {
        expect(page.match(/<h1\b/g)).toHaveLength(1);
        expect(page).toContain("Yazılım Projesi Kapsam ve Süre Hesaplama");
        expect(page).toContain("alternates: { canonical:");
        expect(page).toContain('"@type": "BreadcrumbList"');
        expect(page).toContain('"@type": "WebApplication"');
        expect(page).toContain('"@type": "FAQPage"');
        expect(page).not.toContain("hreflang");
    });

    it("is in the sitemap but outside the calculator registry", () => {
        const url = `${SITE_URL}/kurumsal/yazilim-projesi-kapsam-hesaplama`;
        expect(buildSitemapEntries().filter((entry) => entry.url === url)).toHaveLength(1);
        const calculatorsSource = fs.readFileSync(path.join(process.cwd(), "lib/calculator-source.ts"), "utf8");
        expect(calculatorsSource).not.toContain("yazilim-projesi-kapsam-hesaplama");
    });

    it("contains static mobile overflow and form-prefill safeguards", () => {
        expect(page).toContain("overflow-x-clip");
        expect(component).toContain("min-w-0");
        expect(component).toContain("Roller proje kapsamına göre aynı ekip üyesi tarafından üstlenilebilir; liste kişi sayısı taahhüdü değildir.");
        expect(component).toContain("print:text-slate-700");
        expect(component).not.toMatch(/min-w-\[[^\]]+\]/);
        const form = fs.readFileSync(path.join(process.cwd(), "components/IletisimForm.tsx"), "utf8");
        expect(form).toContain("prefillProjectSummary(current.message");
    });
});
