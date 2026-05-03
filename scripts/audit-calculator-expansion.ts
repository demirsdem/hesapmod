import fs from "node:fs";
import path from "node:path";

import { calculators } from "../lib/calculator-source";
import { buildSitemapEntries } from "../lib/sitemap-data";
import { SITE_URL } from "../lib/site";

type ImplementationStatusItem = {
    targetName: string;
    targetCategory: string;
    status: string;
    existingSlug?: string;
    existingCategory?: string;
    proposedSlug?: string;
    proposedCategory?: string;
    processed?: boolean;
    skipped?: boolean;
};

type ImplementationStatusReport = {
    summary?: Record<string, number>;
    items?: ImplementationStatusItem[];
};

const stage5NewSlugs = [
    "beton-hesaplama",
    "cimento-hesaplama",
    "tugla-hesaplama",
    "boya-hesaplama",
    "seramik-hesaplama",
    "parke-hesaplama",
    "demir-hesaplama",
    "cati-alan-hesaplama",
    "merdiven-hesaplama",
    "metrekup-hesaplama",
    "hafriyat-hesaplama",
    "kum-hesaplama",
    "alci-hesaplama",
    "siva-hesaplama",
    "elektrik-kablo-hesaplama",
    "su-tesisat-hesaplama",
    "isi-kaybi-hesaplama",
    "gunes-paneli-hesaplama",
    "jenerator-guc-hesaplama",
    "enerji-tuketim-hesaplama",
];

const stage5UpdatedSlugs = [
    "insaat-maliyeti-hesaplama",
    "klima-btu-hesaplama",
];

const stage5Slugs = [...stage5NewSlugs, ...stage5UpdatedSlugs];
const stage5SlugSet = new Set(stage5Slugs);

function normalizeText(value: string | undefined) {
    return String(value ?? "").trim().toLocaleLowerCase("tr-TR").replace(/\s+/g, " ");
}

function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        const key = keyFn(item);
        const group = groups.get(key) ?? [];
        group.push(item);
        groups.set(key, group);
    }
    return groups;
}

const implementationPath = path.resolve("reports/implementation-status.json");
const skippedPath = path.resolve("reports/skipped-or-safety-exceptions.md");

const implementation = readJson<ImplementationStatusReport>(implementationPath);
const implementationItems = implementation.items ?? [];
const processedFalse = implementationItems.filter((item) => item.processed !== true && item.skipped !== true);
const safetySkipped = implementationItems.filter((item) => item.skipped === true || item.status.includes("GÜVENLİK"));

const calculatorBySlug = new Map(calculators.map((calculator) => [calculator.slug, calculator]));
const stage5MissingCalculators = stage5Slugs.filter((slug) => !calculatorBySlug.has(slug));

const emptySeoFields = stage5Slugs.flatMap((slug) => {
    const calculator = calculatorBySlug.get(slug);
    if (!calculator) return [`${slug}: calculator not found`];

    const missing = [
        !normalizeText(calculator.seo.title.tr) && "title.tr",
        !normalizeText(calculator.seo.metaDescription.tr) && "metaDescription.tr",
        !normalizeText(calculator.seo.content.tr) && "content.tr",
        !(calculator.seo.faq?.length > 0) && "faq",
    ].filter(Boolean);

    return missing.map((field) => `${slug}: ${field}`);
});

const faqUnderFive = stage5Slugs
    .map((slug) => ({ slug, count: calculatorBySlug.get(slug)?.seo.faq?.length ?? 0 }))
    .filter((item) => item.count < 5);

const duplicateSlugGroups = Array.from(groupBy(calculators, (calculator) => calculator.slug).entries())
    .filter(([, group]) => group.length > 1)
    .map(([slug, group]) => ({
        slug,
        categories: group.map((calculator) => calculator.category),
    }));

const duplicateTitleGroups = Array.from(groupBy(calculators, (calculator) => normalizeText(calculator.seo.title.tr)).entries())
    .filter(([title, group]) => title && group.length > 1)
    .map(([title, group]) => ({
        title,
        slugs: group.map((calculator) => calculator.slug),
        stage5Involved: group.some((calculator) => stage5SlugSet.has(calculator.slug)),
    }));

const duplicateMetaGroups = Array.from(groupBy(calculators, (calculator) => normalizeText(calculator.seo.metaDescription.tr)).entries())
    .filter(([meta, group]) => meta && group.length > 1)
    .map(([meta, group]) => ({
        meta,
        slugs: group.map((calculator) => calculator.slug),
        stage5Involved: group.some((calculator) => stage5SlugSet.has(calculator.slug)),
    }));

const sitemapUrls = new Set(buildSitemapEntries().map((entry) => entry.url));
const sitemapMissing = stage5NewSlugs
    .map((slug) => calculatorBySlug.get(slug))
    .filter(Boolean)
    .map((calculator) => `${SITE_URL}/${calculator!.category}/${calculator!.slug}`)
    .filter((url) => !sitemapUrls.has(url));

const redirectedConstructionUrls = [
    `${SITE_URL}/insaat-muhendislik/metrekare-hesaplama`,
    `${SITE_URL}/insaat-muhendislik/bina-maliyet-hesaplama`,
    `${SITE_URL}/insaat-muhendislik/arsa-deger-hesaplama`,
    `${SITE_URL}/insaat-muhendislik/klima-kapasite-hesaplama`,
];
const redirectedUrlsInSitemap = redirectedConstructionUrls.filter((url) => sitemapUrls.has(url));

const skippedReportExists = fs.existsSync(skippedPath);
const skippedReportContent = skippedReportExists ? fs.readFileSync(skippedPath, "utf8") : "";
const skippedReportHasSafetyItem = skippedReportContent.includes("ilaç doz hesaplama")
    && skippedReportContent.includes("GÜVENLİK NEDENİYLE OTOMATİK EKLENMEDİ");

const errors = [
    ...processedFalse.map((item) => `processed false: ${item.targetCategory} / ${item.targetName} (${item.status})`),
    ...stage5MissingCalculators.map((slug) => `missing stage5 calculator: ${slug}`),
    ...emptySeoFields.map((item) => `missing seo field: ${item}`),
    ...faqUnderFive.map((item) => `faq under 5: ${item.slug} (${item.count})`),
    ...duplicateSlugGroups.map((item) => `duplicate slug: ${item.slug} (${item.categories.join(", ")})`),
    ...sitemapMissing.map((url) => `sitemap missing: ${url}`),
    ...redirectedUrlsInSitemap.map((url) => `redirect URL in sitemap: ${url}`),
    ...(safetySkipped.length > 0 && !skippedReportHasSafetyItem ? ["safety skips are not documented in skipped-or-safety-exceptions.md"] : []),
];

const warnings = [
    ...duplicateTitleGroups
        .filter((item) => item.stage5Involved)
        .map((item) => `duplicate title involving stage5: ${item.title} (${item.slugs.join(", ")})`),
    ...duplicateMetaGroups
        .filter((item) => item.stage5Involved)
        .map((item) => `duplicate meta involving stage5: ${item.meta} (${item.slugs.join(", ")})`),
];

const result = {
    generatedAt: new Date().toISOString(),
    stage5: {
        newSlugCount: stage5NewSlugs.length,
        updatedSlugCount: stage5UpdatedSlugs.length,
        sitemapCheckedNewUrlCount: stage5NewSlugs.length - sitemapMissing.length,
    },
    global: {
        calculatorCount: calculators.length,
        implementationItemCount: implementationItems.length,
        processedFalseCount: processedFalse.length,
        safetySkippedCount: safetySkipped.length,
        duplicateSlugCount: duplicateSlugGroups.length,
        duplicateTitleCount: duplicateTitleGroups.length,
        duplicateMetaCount: duplicateMetaGroups.length,
    },
    errors,
    warnings,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length > 0) {
    process.exitCode = 1;
}
