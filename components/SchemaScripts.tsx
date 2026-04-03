import type {
    CalculatorCatalogEntry,
    CalculatorFaqEntry,
    LanguageCode,
} from "@/lib/calculator-types";
import type { CalculatorTrustInfo } from "@/lib/calculator-trust";
import { getCategoryName, getCategoryPath } from "@/lib/categories";
import { getCalculatorLastModified } from "@/lib/content-last-modified";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type SchemaScriptsProps = {
    calculator: Pick<
        CalculatorCatalogEntry,
        "slug" | "category" | "name" | "h1" | "description" | "shortDescription" | "seo"
    >;
    lang?: LanguageCode;
    trustInfo?: CalculatorTrustInfo | null;
    pageTitle?: string;
    pageDescription?: string;
    pageUrl?: string;
    categoryNameOverride?: string;
    categoryUrlOverride?: string;
};

type JsonLd = Record<string, unknown>;

const APPLICATION_CATEGORY_MAP: Record<string, string> = {
    "astroloji": "LifestyleApplication",
    "finansal-hesaplamalar": "FinanceApplication",
    "maas-ve-vergi": "FinanceApplication",
    "matematik-hesaplama": "EducationalApplication",
    "sinav-hesaplamalari": "EducationalApplication",
    "tasit-ve-vergi": "FinanceApplication",
    "ticaret-ve-is": "FinanceApplication",
    "yasam-hesaplama": "HealthApplication",
    "zaman-hesaplama": "UtilityApplication",
};

function getApplicationCategory(category: string) {
    return APPLICATION_CATEGORY_MAP[category] ?? "UtilityApplication";
}

function serializeJsonLd(schema: JsonLd) {
    return JSON.stringify(schema)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

function toAbsoluteUrl(url: string) {
    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function buildFaqSchema(faqEntries: CalculatorFaqEntry[], lang: LanguageCode): JsonLd | null {
    if (faqEntries.length === 0) {
        return null;
    }

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqEntries.map((entry) => ({
            "@type": "Question",
            name: entry.q[lang],
            acceptedAnswer: {
                "@type": "Answer",
                text: entry.a[lang],
            },
        })),
    };
}

export default function SchemaScripts({
    calculator,
    lang = "tr",
    trustInfo,
    pageTitle: pageTitleOverride,
    pageDescription: pageDescriptionOverride,
    pageUrl: pageUrlOverride,
    categoryNameOverride,
    categoryUrlOverride,
}: SchemaScriptsProps) {
    const pageTitle = pageTitleOverride ?? calculator.h1?.[lang] ?? calculator.name[lang];
    const description = pageDescriptionOverride
        ?? calculator.seo.metaDescription[lang]
        ?? calculator.shortDescription?.[lang]
        ?? calculator.description[lang];
    const pageUrl = pageUrlOverride ?? `${SITE_URL}/${calculator.category}/${calculator.slug}`;
    const categoryName = categoryNameOverride ?? getCategoryName(calculator.category, lang);
    const categoryUrl = categoryUrlOverride ?? `${SITE_URL}${getCategoryPath(calculator.category)}`;
    const modifiedDate = getCalculatorLastModified(calculator.slug).toISOString();
    const citationUrls = (trustInfo?.sources ?? [])
        .map((source) => source.href)
        .filter((href): href is string => typeof href === "string" && href.length > 0)
        .map(toAbsoluteUrl);
    const reviewedBy =
        trustInfo?.editorName
            ? {
                "@type": "Person",
                name: trustInfo.editorName,
                ...(trustInfo.editorHref ? { url: toAbsoluteUrl(trustInfo.editorHref) } : {}),
            }
            : undefined;

    const schemaEntries: Array<{ id: string; data: JsonLd }> = [
        {
            id: "software-application",
            data: {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: pageTitle,
                applicationCategory: getApplicationCategory(calculator.category),
                operatingSystem: "All",
                description,
                url: pageUrl,
                inLanguage: lang === "tr" ? "tr-TR" : "en-US",
                isAccessibleForFree: true,
                dateModified: modifiedDate,
                applicationSubCategory: categoryName,
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "TRY",
                },
                provider: {
                    "@type": "Organization",
                    name: SITE_NAME,
                    url: SITE_URL,
                },
                ...(reviewedBy ? { reviewedBy } : {}),
                ...(citationUrls.length > 0 ? { citation: citationUrls } : {}),
            },
        },
        {
            id: "breadcrumb-list",
            data: {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: lang === "tr" ? "Ana Sayfa" : "Home",
                        item: SITE_URL,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: categoryName,
                        item: categoryUrl,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: pageTitle,
                        item: pageUrl,
                    },
                ],
            },
        },
    ];

    const faqSchema = buildFaqSchema(calculator.seo.faq, lang);
    if (faqSchema) {
        schemaEntries.splice(1, 0, {
            id: "faq-page",
            data: faqSchema,
        });
    }

    return (
        <>
            {schemaEntries.map((schemaEntry) => (
                <script
                    key={`${calculator.slug}-${schemaEntry.id}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: serializeJsonLd(schemaEntry.data),
                    }}
                />
            ))}
        </>
    );
}
