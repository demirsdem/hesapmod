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

const { articles } = require("../lib/articles") as typeof import("../lib/articles");
const {
    CATEGORY_SPOTLIGHT_CONFIGS,
    GUIDE_LANDING_CONFIGS,
    SUPPLEMENTARY_GUIDE_CALCULATOR_LINKS,
    getArticleFeaturedCalculatorSection,
    resolveEditorialArticleLinks,
    resolveEditorialCalculatorLinks,
} = require("../lib/editorial-hubs") as typeof import("../lib/editorial-hubs");
const {
    FEATURED_TOOL_DEFINITIONS,
    getFeaturedToolItems,
} = require("../lib/featured-tools") as typeof import("../lib/featured-tools");

type MatrixVariant =
    | "homepage"
    | "footer"
    | "guide"
    | "category"
    | "category-spotlight"
    | "guide-landing"
    | "guide-supplementary"
    | "guide-card"
    | "article-cta";

type MatrixRecord = {
    href: string;
    count: number;
    variants: Set<MatrixVariant>;
};

type LinkLike = {
    href: string;
};

const VARIANT_ORDER: MatrixVariant[] = [
    "homepage",
    "footer",
    "category",
    "category-spotlight",
    "guide",
    "guide-landing",
    "guide-supplementary",
    "guide-card",
    "article-cta",
];

function incrementTarget(
    matrix: Map<string, MatrixRecord>,
    href: string,
    variant: MatrixVariant
) {
    const current = matrix.get(href);
    if (current) {
        current.count += 1;
        current.variants.add(variant);
        return;
    }

    matrix.set(href, {
        href,
        count: 1,
        variants: new Set([variant]),
    });
}

function incrementTargets(
    matrix: Map<string, MatrixRecord>,
    links: LinkLike[],
    variant: MatrixVariant
) {
    for (const link of links) {
        incrementTarget(matrix, link.href, variant);
    }
}

function getRenderedCategoryFeaturedTools() {
    const spotlightCategories = new Set(Object.keys(CATEGORY_SPOTLIGHT_CONFIGS));
    const candidateCategories = new Set(
        FEATURED_TOOL_DEFINITIONS.flatMap((tool) => tool.categoryGroups)
    );

    return Array.from(candidateCategories)
        .filter((categorySlug) => !spotlightCategories.has(categorySlug))
        .sort((left, right) => left.localeCompare(right, "tr"))
        .flatMap((categorySlug) => getFeaturedToolItems("category", categorySlug, 6));
}

function formatVariants(variants: Set<MatrixVariant>) {
    return VARIANT_ORDER.filter((variant) => variants.has(variant)).join(", ");
}

export function buildMatrix() {
    const matrix = new Map<string, MatrixRecord>();

    incrementTargets(matrix, getFeaturedToolItems("homepage", undefined, 8), "homepage");
    incrementTargets(matrix, getFeaturedToolItems("guide", undefined, 8), "guide");
    incrementTargets(matrix, getFeaturedToolItems("footer", undefined, 6), "footer");
    incrementTargets(matrix, getRenderedCategoryFeaturedTools(), "category");

    for (const config of Object.values(CATEGORY_SPOTLIGHT_CONFIGS)) {
        if (!config) {
            continue;
        }

        incrementTargets(
            matrix,
            resolveEditorialCalculatorLinks(config.calculatorLinks),
            "category-spotlight"
        );
        incrementTargets(
            matrix,
            resolveEditorialArticleLinks(config.guideLinks),
            "category-spotlight"
        );
    }

    for (const config of GUIDE_LANDING_CONFIGS) {
        incrementTargets(
            matrix,
            resolveEditorialCalculatorLinks(config.calculatorLinks),
            "guide-landing"
        );
        incrementTargets(
            matrix,
            resolveEditorialArticleLinks(config.articleLinks),
            "guide-landing"
        );
    }

    incrementTargets(
        matrix,
        resolveEditorialCalculatorLinks(SUPPLEMENTARY_GUIDE_CALCULATOR_LINKS),
        "guide-supplementary"
    );

    for (const article of articles) {
        const section = getArticleFeaturedCalculatorSection(
            article.slug,
            article.relatedCalculators
        );

        if (!section) {
            continue;
        }

        incrementTargets(matrix, section.links.slice(0, 3), "guide-card");
        incrementTargets(matrix, section.links, "article-cta");
    }

    return Array.from(matrix.values())
        .sort((left, right) => {
            if (right.count !== left.count) {
                return right.count - left.count;
            }

            return left.href.localeCompare(right.href, "tr");
        })
        .map((entry) => ({
            "Canonical Slug / URL": entry.href,
            "Toplam İç Link Sayısı": entry.count,
            "Bulunduğu Varyantlar": formatVariants(entry.variants),
        }));
}

if (require.main === module) {
    console.table(buildMatrix());
}
