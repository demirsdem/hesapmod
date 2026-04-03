const Module = require("module") as any;
const originalLoad = Module._load as (
    request: string,
    parent: unknown,
    isMain: boolean
) => unknown;

Module._load = function patchedLoad(
    request: string,
    parent: unknown,
    isMain: boolean
) {
    if (request === "server-only") {
        return {};
    }

    return originalLoad.call(this, request, parent, isMain);
};

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

const {
    CATEGORY_SPOTLIGHT_CONFIGS,
    FEATURED_CLUSTER_CONFIGS,
    GUIDE_LANDING_CONFIGS,
    resolveEditorialArticleLinks,
    resolveEditorialCalculatorLinks,
} = require("../lib/editorial-hubs") as typeof import("../lib/editorial-hubs");
const {
    englishCalculatorRoutes,
    getEnglishCalculatorAlternates,
    getEnglishCategoryAlternates,
    getEnglishHomeAlternates,
    getSourceCalculatorAlternates,
} = require("../lib/calculator-source-en") as typeof import("../lib/calculator-source-en");

function sha1(filePath: string) {
    return createHash("sha1").update(readFileSync(filePath)).digest("hex");
}

function assert(condition: boolean, message: string, failures: string[]) {
    if (!condition) {
        failures.push(message);
    }
}

const projectRoot = process.cwd();
const failures: string[] = [];

const iconPairs: Array<[string, string]> = [
    ["app/apple-icon.png", "public/apple-touch-icon.png"],
    ["app/favicon.ico", "public/favicon.ico"],
    ["app/icon.svg", "public/icon.svg"],
];

for (const [appPath, publicPath] of iconPairs) {
    const appHash = sha1(path.join(projectRoot, appPath));
    const publicHash = sha1(path.join(projectRoot, publicPath));
    assert(
        appHash === publicHash,
        `Icon mismatch: ${appPath} and ${publicPath} are not synchronized.`,
        failures
    );
}

const englishHomeAlternates = getEnglishHomeAlternates();
assert(
    Boolean(englishHomeAlternates.languages["tr-TR"] && englishHomeAlternates.languages["en-US"] && englishHomeAlternates.languages["x-default"]),
    "English home alternates are missing required tr-TR / en-US / x-default entries.",
    failures
);

const englishCategories = Array.from(new Set(englishCalculatorRoutes.map((route) => route.category)));
for (const category of englishCategories) {
    const alternates = getEnglishCategoryAlternates(category);
    assert(
        Boolean(alternates.languages["tr-TR"] && alternates.languages["en-US"] && alternates.languages["x-default"]),
        `English category alternates are incomplete for ${category}.`,
        failures
    );
}

for (const route of englishCalculatorRoutes) {
    const englishAlternates = getEnglishCalculatorAlternates(route);
    assert(
        Boolean(englishAlternates.languages["tr-TR"] && englishAlternates.languages["en-US"] && englishAlternates.languages["x-default"]),
        `English calculator alternates are incomplete for ${route.category}/${route.slug}.`,
        failures
    );

    const sourceAlternates = getSourceCalculatorAlternates(route.sourceCategory, route.sourceSlug);
    assert(
        Boolean(sourceAlternates?.languages["tr-TR"] && sourceAlternates?.languages["en-US"] && sourceAlternates?.languages["x-default"]),
        `Source calculator alternates are incomplete for ${route.sourceCategory}/${route.sourceSlug}.`,
        failures
    );
}

for (const [slug, config] of Object.entries(FEATURED_CLUSTER_CONFIGS)) {
    const resolvedLinks = resolveEditorialCalculatorLinks(config.links);
    assert(
        resolvedLinks.length === config.links.length,
        `Featured cluster "${slug}" has unresolved calculator links.`,
        failures
    );
}

for (const [slug, config] of Object.entries(CATEGORY_SPOTLIGHT_CONFIGS)) {
    if (!config) {
        continue;
    }

    const resolvedCalculators = resolveEditorialCalculatorLinks(config.calculatorLinks);
    const resolvedGuides = resolveEditorialArticleLinks(config.guideLinks);
    assert(
        resolvedCalculators.length === config.calculatorLinks.length,
        `Category spotlight "${slug}" has unresolved calculator links.`,
        failures
    );
    assert(
        resolvedGuides.length === config.guideLinks.length,
        `Category spotlight "${slug}" has unresolved guide links.`,
        failures
    );
}

for (const config of GUIDE_LANDING_CONFIGS) {
    const resolvedArticles = resolveEditorialArticleLinks(config.articleLinks);
    const resolvedCalculators = resolveEditorialCalculatorLinks(config.calculatorLinks);
    assert(
        resolvedArticles.length === config.articleLinks.length,
        `Guide landing "${config.id}" has unresolved article links.`,
        failures
    );
    assert(
        resolvedCalculators.length === config.calculatorLinks.length,
        `Guide landing "${config.id}" has unresolved calculator links.`,
        failures
    );
}

if (failures.length > 0) {
    console.error("SEO audit failed:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
}

console.log("SEO audit passed.");
console.log(`- Icon pairs checked: ${iconPairs.length}`);
console.log(`- English calculator alternates checked: ${englishCalculatorRoutes.length}`);
console.log(`- English category alternates checked: ${englishCategories.length}`);
console.log(`- Featured clusters checked: ${Object.keys(FEATURED_CLUSTER_CONFIGS).length}`);
console.log(`- Category spotlights checked: ${Object.keys(CATEGORY_SPOTLIGHT_CONFIGS).length}`);
console.log(`- Guide landing sections checked: ${GUIDE_LANDING_CONFIGS.length}`);
