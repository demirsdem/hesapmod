import "server-only";

import {
    CALCULATOR_SLUG_ALIASES,
    calculators as runtimeCalculators,
    duplicateCalculatorSlugs,
    findCalculatorByRoute as findRuntimeCalculatorByRoute,
    findCalculatorBySlug as findRuntimeCalculatorBySlug,
    normalizeCalculatorSlug,
} from "./calculator-source";
import { getCategoryName } from "./categories";
import type {
    CalculatorCatalogEntry,
    CalculatorClientEntry,
    CalculatorConfig,
    CalculatorSearchEntry,
} from "./calculator-types";

function toCatalogEntry(calculator: CalculatorConfig): CalculatorCatalogEntry {
    const { formula: _formula, ...catalogEntry } = calculator;
    return catalogEntry;
}

function toClientEntry(calculator: CalculatorCatalogEntry): CalculatorClientEntry {
    return {
        slug: calculator.slug,
        category: calculator.category,
        name: calculator.name,
        inputs: calculator.inputs,
        results: calculator.results,
    };
}

function joinSearchParts(parts: Array<string | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function getAliasSearchText(calculator: CalculatorCatalogEntry) {
    return Object.entries(CALCULATOR_SLUG_ALIASES)
        .filter(([, targetSlug]) => targetSlug === calculator.slug)
        .map(([alias]) => alias.replace(/-/g, " "))
        .join(" ");
}

function toSearchEntry(calculator: CalculatorCatalogEntry): CalculatorSearchEntry {
    const aliases = getAliasSearchText(calculator);

    return {
        id: calculator.id,
        slug: calculator.slug,
        category: calculator.category,
        name: calculator.name,
        shortDescription: calculator.shortDescription ?? calculator.description,
        searchText: {
            tr: joinSearchParts([
                calculator.slug.replace(/-/g, " "),
                calculator.category.replace(/-/g, " "),
                getCategoryName(calculator.category, "tr"),
                aliases,
                calculator.h1?.tr,
                calculator.description.tr,
                calculator.seo.title.tr,
                calculator.seo.metaDescription.tr,
                ...calculator.inputs.map((input) => input.name.tr),
                ...calculator.results.map((result) => result.label.tr),
                ...calculator.seo.faq.map((item) => item.q.tr),
            ]),
            en: joinSearchParts([
                calculator.slug.replace(/-/g, " "),
                calculator.category.replace(/-/g, " "),
                getCategoryName(calculator.category, "en"),
                aliases,
                calculator.h1?.en,
                calculator.description.en,
                calculator.seo.title.en,
                calculator.seo.metaDescription.en,
                ...calculator.inputs.map((input) => input.name.en),
                ...calculator.results.map((result) => result.label.en),
                ...calculator.seo.faq.map((item) => item.q.en),
            ]),
        },
    };
}

const catalogEntries = runtimeCalculators.map(toCatalogEntry);

export const calculators: CalculatorCatalogEntry[] = catalogEntries;
export const calculatorSearchIndex: CalculatorSearchEntry[] = [
    ...catalogEntries.map(toSearchEntry),
    {
        id: "gayrimenkul-deger-hesaplama",
        slug: "gayrimenkul-deger-hesaplama",
        category: "gayrimenkul",
        href: "/gayrimenkul-deger-hesaplama",
        name: {
            tr: "Gayrimenkul Değer Hesaplama",
            en: "Real Estate Value Calculator",
        },
        shortDescription: {
            tr: "Konut, arsa ve yatırım için değer, kira getirisi ve ROI hesabını görün.",
            en: "Estimate property value, rental yield, and ROI for real estate investments.",
        },
        searchText: {
            tr: "gayrimenkul değer hesaplama konut değer arsa değer ev fiyat kira getirisi roi emlak yatırım",
            en: "real estate value property valuation home price land value rental yield roi investment",
        },
    },
];
export const calculatorCount = catalogEntries.length;
export { duplicateCalculatorSlugs, normalizeCalculatorSlug };

const calculatorCatalogBySlug = new Map<string, CalculatorCatalogEntry>(
    catalogEntries.map((calculator) => [calculator.slug, calculator])
);

export function findCalculatorBySlug(slug: string) {
    const runtimeCalculator = findRuntimeCalculatorBySlug(slug);
    return runtimeCalculator
        ? calculatorCatalogBySlug.get(runtimeCalculator.slug)
        : undefined;
}

export function findCalculatorByRoute(slug: string, category?: string) {
    const runtimeCalculator = findRuntimeCalculatorByRoute(slug, category);
    return runtimeCalculator
        ? calculatorCatalogBySlug.get(runtimeCalculator.slug)
        : undefined;
}

export function getCalculatorClientEntry(slug: string, category?: string) {
    const calculator = findCalculatorByRoute(slug, category);
    return calculator ? toClientEntry(calculator) : undefined;
}
