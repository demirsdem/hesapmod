import "server-only";

import {
    calculators as runtimeCalculators,
    duplicateCalculatorSlugs,
    findCalculatorByRoute as findRuntimeCalculatorByRoute,
    findCalculatorBySlug as findRuntimeCalculatorBySlug,
    normalizeCalculatorSlug,
} from "./calculator-source";
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

function toSearchEntry(calculator: CalculatorCatalogEntry): CalculatorSearchEntry {
    return {
        id: calculator.id,
        slug: calculator.slug,
        category: calculator.category,
        name: calculator.name,
        shortDescription: calculator.shortDescription ?? calculator.description,
    };
}

const catalogEntries = runtimeCalculators.map(toCatalogEntry);

export const calculators: CalculatorCatalogEntry[] = catalogEntries;
export const calculatorSearchIndex: CalculatorSearchEntry[] = catalogEntries.map(toSearchEntry);
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
