import { Metadata } from "next";
import { findCalculatorByRoute } from "./calculators";
import { getCalculatorLastModified } from "./content-last-modified";
import { getCategoryBySlug, getCategoryName, getCategoryPath, isHealthCategory } from "./categories";
import { SITE_NAME, SITE_URL } from "./site";
import { withSingleSiteName } from "./seo-title";

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
    const title = withSingleSiteName(calc.seo.title[lang]);
    const ogImage = calc.slug === "bilesik-buyume-hesaplama" || calc.slug === "bebek-boyu-hesaplama" || calc.slug === "obp-puan-hesaplama"
        ? `${SITE_URL}/${calc.category}/${calc.slug}/opengraph-image`
        : undefined;
    const ogImageAlt = calc.slug === "bebek-boyu-hesaplama"
        ? "Bebek Boyu Hesaplama — HesapMod"
        : calc.slug === "obp-puan-hesaplama"
            ? "OBP Hesaplama 2026 — HesapMod"
            : "CAGR / YBBO Hesaplama — HesapMod";
    const twitterTitle = calc.slug === "obp-puan-hesaplama"
        ? "OBP Hesaplama 2026 — Ortaöğretim Başarı Puanı ve YKS Katkısı | HesapMod"
        : title;
    const twitterDescription = calc.slug === "obp-puan-hesaplama"
        ? "Diploma notunuzu girerek YKS'ye eklenecek OBP katkınızı ve kırık OBP farkını anında hesaplayın."
        : calc.seo.metaDescription[lang];
    const isCustomsDutyCalculator = calc.slug === "gumruk-vergisi-hesaplama";

    const canonical = calc.slug === "lise-taban-puanlari" && calc.category === "sinav-hesaplamalari"
        ? `${SITE_URL}/sinav-hesaplamalari/lise-taban-puanlari`
        : `/${calc.category}/${calc.slug}`;

    return {
        title: { absolute: title },
        description: calc.seo.metaDescription[lang],
        ...(isCustomsDutyCalculator
            ? {
                keywords: [
                    "gümrük vergisi hesaplama",
                    "2026 gümrük vergisi",
                    "yurt dışı alışveriş vergi",
                    "temu gümrük vergisi",
                    "shein gümrük vergisi",
                    "aliexpress gümrük hesaplama",
                    "GTİP vergisi hesaplama",
                    "CIF değeri nedir",
                ],
            }
            : {}),
        themeColor: "#FF6B35",
        alternates: {
            canonical,
        },
        // YMYL sayfaları için ek robots direktifi
        robots: isHealth
            ? { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" }
            : { index: true, follow: true },
        openGraph: {
            title,
            description: calc.seo.metaDescription[lang],
            url: `${SITE_URL}/${calc.category}/${calc.slug}`,
            type: "website",
            ...(ogImage
                ? {
                    images: [
                        {
                            url: ogImage,
                            width: 1200,
                            height: 630,
                            alt: ogImageAlt,
                        },
                    ],
                }
                : {}),
        },
        ...(ogImage || isCustomsDutyCalculator
            ? {
                twitter: {
                    card: "summary_large_image",
                    title: isCustomsDutyCalculator
                        ? "Gümrük Vergisi Hesaplama 2026 — Yurt Dışı Alışveriş Maliyeti"
                        : twitterTitle,
                    description: isCustomsDutyCalculator
                        ? "CIF değer, GTİP kategorisi ve KDV dahil toplam gümrük maliyetini hesaplayın. 2026 güncel resmi çerçevesiyle."
                        : twitterDescription,
                    ...(ogImage ? { images: [ogImage] } : {}),
                },
            }
            : {}),
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
