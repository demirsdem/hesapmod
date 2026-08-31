import { calculators } from "./calculator-source";
import { mainCategories, normalizeCategorySlug } from "./categories";
import {
    CATEGORY_CONTENT_LAST_MODIFIED,
    HOME_PAGE_LAST_MODIFIED,
    getLatestDate,
    getCalculatorLastModified,
} from "./content-last-modified";
import { SITE_URL } from "./site";
import { GOLD_LONG_TAIL_SLUGS } from "./gold/goldLongTailPages";
import { FX_LONG_TAIL_SLUGS } from "./fx/fxLongTailPages";
import { englishCalculatorRoutes, getEnglishCalculatorPath } from "./calculator-source-en";
import { corporateServices } from "./corporate-services";
import { businessSolutions } from "./business-solutions";

export type SitemapEntry = {
    url: string;
    lastModified: Date;
    changeFrequency:
        | "always"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "never";
    priority: number;
};

function toDateOrFallback(value: string | Date | undefined, fallback: Date) {
    if (!value) {
        return fallback;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function getCalculatorEntryLastModified(calculator: { slug: string; updatedAt?: string | Date }) {
    return toDateOrFallback(calculator.updatedAt, getCalculatorLastModified(calculator.slug));
}

const REDIRECTED_CALCULATOR_SLUGS = new Set([
    "yas-hesaplama",
    "yas-hesaplama-gun-ay-yil",
    "iki-tarih-arasi-fark-gun-hesaplama",
]);

const HIGH_PRIORITY_CALCULATOR_SLUGS = new Set([
    "maas-hesaplama",
    "kredi-taksit-hesaplama",
    "ihtiyac-kredisi-hesaplama",
    "konut-kredisi-hesaplama",
    "tasit-kredisi-hesaplama",
    "ticari-arac-kredisi-hesaplama",
    "ticari-kredi-hesaplama",
]);

function getCalculatorPriority(slug: string) {
    return HIGH_PRIORITY_CALCULATOR_SLUGS.has(slug) ? 0.9 : 0.8;
}

function getEnglishCategoryPriority(category: string) {
    return category === "health-calculator" ? 0.68 : 0.66;
}

const SPECIAL_SITEMAP_PAGES: SitemapEntry[] = [
    {
        url: `${SITE_URL}/finansal-hesaplamalar/altin-hesaplama`,
        lastModified: new Date("2026-05-19T12:00:00+03:00"),
        changeFrequency: "daily",
        priority: 0.92,
    },
    {
        url: `${SITE_URL}/finansal-hesaplamalar/doviz-hesaplama`,
        lastModified: new Date("2026-05-19T12:00:00+03:00"),
        changeFrequency: "daily",
        priority: 0.92,
    },
    ...FX_LONG_TAIL_SLUGS.map((slug) => ({
        url: `${SITE_URL}/finansal-hesaplamalar/${slug}`,
        lastModified: new Date("2026-05-19T12:00:00+03:00"),
        changeFrequency: "daily" as const,
        priority: 0.86,
    })),
    ...GOLD_LONG_TAIL_SLUGS.map((slug) => ({
        url: `${SITE_URL}/finansal-hesaplamalar/${slug}`,
        lastModified: new Date("2026-05-19T12:00:00+03:00"),
        changeFrequency: "daily" as const,
        priority: 0.86,
    })),
];

export function buildSitemapEntries(): SitemapEntry[] {
    const categoryPages: SitemapEntry[] = mainCategories.map((cat) => {
        const categoryCalculators = calculators.filter(
            (calculator) => normalizeCategorySlug(calculator.category) === cat.slug
        );
        const lastModified =
            categoryCalculators.length > 0
                ? getLatestDate(
                    CATEGORY_CONTENT_LAST_MODIFIED,
                    ...categoryCalculators.map((calculator) => getCalculatorEntryLastModified(calculator))
                )
                : CATEGORY_CONTENT_LAST_MODIFIED;

        return {
            url: `${SITE_URL}/kategori/${cat.slug}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        };
    });

    const calcPages: SitemapEntry[] = calculators
        .filter((calc) => !REDIRECTED_CALCULATOR_SLUGS.has(calc.slug))
        .map((calc) => {
            const canonicalCategory = normalizeCategorySlug(calc.category);
            return {
                url: `${SITE_URL}/${canonicalCategory}/${calc.slug}`,
                lastModified: getCalculatorEntryLastModified(calc),
                changeFrequency: "weekly",
                priority: getCalculatorPriority(calc.slug),
            };
        });

    const englishHomePage: SitemapEntry = {
        url: `${SITE_URL}/en`,
        lastModified: HOME_PAGE_LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: 0.7,
    };

    const englishCategoryPages: SitemapEntry[] = Array.from(
        new Set(englishCalculatorRoutes.map((route) => route.category))
    ).map((category) => {
        const categoryRoutes = englishCalculatorRoutes.filter((route) => route.category === category);
        return {
            url: `${SITE_URL}/en/${category}`,
            lastModified: getLatestDate(
                CATEGORY_CONTENT_LAST_MODIFIED,
                ...categoryRoutes.map((route) => getCalculatorLastModified(route.sourceSlug))
            ),
            changeFrequency: "weekly",
            priority: getEnglishCategoryPriority(category),
        };
    });

    const englishCalculatorPages: SitemapEntry[] = englishCalculatorRoutes.map((route) => ({
        url: `${SITE_URL}${getEnglishCalculatorPath(route)}`,
        lastModified: getCalculatorLastModified(route.sourceSlug),
        changeFrequency: "weekly",
        priority: 0.72,
    }));

    const corporateLastModified = new Date("2026-08-30T12:00:00+03:00");
    const corporatePages: SitemapEntry[] = [
        { url: `${SITE_URL}/kurumsal`, lastModified: corporateLastModified, changeFrequency: "monthly", priority: 0.85 },
        { url: `${SITE_URL}/kurumsal/yazilim-projesi-kapsam-hesaplama`, lastModified: new Date("2026-08-31T12:00:00+03:00"), changeFrequency: "monthly", priority: 0.84 },
        ...corporateServices.map((service) => ({ url: `${SITE_URL}/kurumsal/${service.slug}`, lastModified: corporateLastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    ];

    const solutionPages: SitemapEntry[] = [
        { url: `${SITE_URL}/cozumler`, lastModified: corporateLastModified, changeFrequency: "monthly", priority: 0.85 },
        ...businessSolutions.map((solution) => ({ url: `${SITE_URL}/cozumler/${solution.slug}`, lastModified: corporateLastModified, changeFrequency: "monthly" as const, priority: 0.82 })),
    ];

    return [
        ...categoryPages,
        ...calcPages,
        englishHomePage,
        ...englishCategoryPages,
        ...englishCalculatorPages,
        ...corporatePages,
        ...solutionPages,
        ...SPECIAL_SITEMAP_PAGES.filter(
            (special) => !calcPages.some((entry) => entry.url === special.url)
        ),
    ];
}
