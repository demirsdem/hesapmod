import { Metadata } from "next";
import { findCalculatorByRoute } from "./calculators";
import { getCalculatorLastModified } from "./content-last-modified";
import { getCategoryBySlug, getCategoryName, getCategoryPath, isHealthCategory } from "./categories";
import { SITE_NAME, SITE_URL } from "./site";

function findCalculator(slug: string, category?: string) {
    return findCalculatorByRoute(slug, category);
}

// ─────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────
export function generateCalculatorMetadata(slug: string, lang: "tr" | "en", category?: string): Metadata {
    const calc = findCalculator(slug, category);
    if (!calc) return { title: "Not Found" };

    const isHealth = isHealthCategory(calc.category);

    return {
        title: calc.seo.title[lang],
        description: calc.seo.metaDescription[lang],
        alternates: {
            canonical: `/${calc.category}/${calc.slug}`,
        },
        // YMYL sayfaları için ek robots direktifi
        robots: isHealth
            ? { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" }
            : { index: true, follow: true },
        openGraph: {
            title: calc.seo.title[lang],
            description: calc.seo.metaDescription[lang],
            url: `${SITE_URL}/${calc.category}/${calc.slug}`,
            type: "website",
        },
    };
}

// ─────────────────────────────────────────────
// JSON-LD — Standart (finans, matematik, günlük)
// ─────────────────────────────────────────────
export function generateCalculatorSchema(slug: string, lang: "tr" | "en", category?: string) {
    const calc = findCalculator(slug, category);
    if (!calc) return null;
    const modifiedDate = getCalculatorLastModified(calc.slug).toISOString().split("T")[0];

    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: calc.name[lang],
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        description: calc.seo.metaDescription[lang],
        url: `${SITE_URL}/${calc.category}/${calc.slug}`,
        inLanguage: lang === "tr" ? "tr-TR" : "en-US",
        provider: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
        dateModified: modifiedDate,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "TRY",
        },
    };
}

export function generateCalculatorSupportingSchemas(slug: string, lang: "tr" | "en", category?: string) {
    const calc = findCalculator(slug, category);
    if (!calc) return null;

    const pageUrl = `${SITE_URL}/${calc.category}/${calc.slug}`;
    const categoryName = getCategoryName(calc.category, lang);

    const faqSchema =
        calc.seo.faq.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: calc.seo.faq.map((item) => ({
                    "@type": "Question",
                    name: item.q[lang],
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.a[lang],
                    },
                })),
            }
            : null;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: categoryName,
                item: `${SITE_URL}${getCategoryPath(calc.category)}`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: calc.name[lang],
                item: pageUrl,
            },
        ],
    };

    return { faqSchema, breadcrumbSchema };
}

// ─────────────────────────────────────────────
// JSON-LD — YMYL Sağlık (tam stack)
// WebPage + WebApplication + FAQPage + BreadcrumbList
// ─────────────────────────────────────────────
export function generateHealthSchema(slug: string, lang: "tr" | "en", category?: string) {
    const calc = findCalculator(slug, category);
    if (!calc) return null;

    const pageUrl = `${SITE_URL}/${calc.category}/${calc.slug}`;
    const pageTitle = calc.seo.title[lang];
    const pageDescription = calc.seo.metaDescription[lang];
    const h1 = calc.h1?.[lang] ?? calc.name[lang];
    const modifiedDate = getCalculatorLastModified(calc.slug).toISOString().split("T")[0];

    /** WebPage — tıbbi bilgi sayfası olduğunu belirtir */
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: h1,
        description: pageDescription,
        url: pageUrl,
        inLanguage: lang === "tr" ? "tr-TR" : "en-US",
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
        },
        about: {
            "@type": "MedicalCondition",
            name: calc.name[lang],
        },
        // E-E-A-T: kaynak beyanı
        audience: {
            "@type": "MedicalAudience",
            audienceType: "Patient",
        },
        // Tüm sağlık içerikleri bilgilendirme amaçlıdır
        accessibilityFeature: ["informationalContent"],
        dateModified: modifiedDate,
    };

    /** WebApplication — hesaplama aracı */
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: pageTitle,
        applicationCategory: "HealthApplication",
        operatingSystem: "All",
        description: pageDescription,
        url: pageUrl,
        dateModified: modifiedDate,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "TRY",
        },
    };

    /** FAQPage — SSS varsa */
    const faqSchema =
        calc.seo.faq.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: calc.seo.faq.map((item) => ({
                    "@type": "Question",
                    name: item.q[lang],
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.a[lang],
                    },
                })),
            }
            : null;

    /** BreadcrumbList */
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: getCategoryName(calc.category, lang),
                item: `${SITE_URL}${getCategoryPath(calc.category)}`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: calc.name[lang],
                item: pageUrl,
            },
        ],
    };

    return { webPageSchema, webAppSchema, faqSchema, breadcrumbSchema };
}

// ─────────────────────────────────────────────
// JSON-LD — Category Page Schema
// CollectionPage + FAQPage + BreadcrumbList
// ─────────────────────────────────────────────
export function generateCategorySchema(slug: string, lang: "tr" | "en") {
    const cat = getCategoryBySlug(slug);
    if (!cat) return null;

    const pageUrl = `${SITE_URL}/kategori/${cat.slug}`;

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${cat.name[lang]} Hesaplama Araçları`,
        description: cat.description[lang],
        url: pageUrl,
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
        },
    };

    const faqSchema =
        cat.faq && cat.faq.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: cat.faq.map((item: any) => ({
                    "@type": "Question",
                    name: item.q[lang],
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.a[lang],
                    },
                })),
            }
            : null;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: cat.name[lang],
                item: pageUrl,
            },
        ],
    };

    return { collectionSchema, faqSchema, breadcrumbSchema };
}
