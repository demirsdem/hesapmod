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
    "muhasebe": "FinanceApplication",
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

function buildTaxDelayHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Vergi Gecikme Zammı Nasıl Hesaplanır?",
        description:
            "Vergi borcu, gecikme gün sayısı ve oran türü ile gecikme zammı veya tecil faizini hesaplama adımları.",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Borcu gir",
                text: "Vergi borcu tutarını TL olarak girin.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Gün sayısını gir",
                text: "Vade tarihi ve ödeme tarihiyle gecikme gününü hesaplatın veya gün sayısını manuel girin.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Sonucu oku",
                text: "Gecikme zammı, anapara borcu, toplam ödeme ve borcun yüzdesi kadar ek yükü inceleyin.",
            },
        ],
    };
}

function buildTestSuccessRateHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Test Başarı Oranı Nasıl Hesaplanır?",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Toplam soru sayısını girin",
                text: "Testteki toplam soru sayısını yazın.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Doğru ve yanlış sayılarını girin",
                text: "Doğru ve yanlış cevap sayılarını ilgili alanlara girin.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Yanlış ceza katsayısını seçin",
                text: "4 yanlış 1 doğru, 3 yanlış 1 doğru, cezasız test veya özel katsayı seçeneklerinden sınav kuralına uygun olanı seçin.",
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Sonuçları kontrol edin",
                text: "Net, başarı oranı ve doğruluk oranı sonuçlarını kontrol edin.",
            },
        ],
    };
}

function buildCagrHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "CAGR Nasıl Hesaplanır",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                name: "Başlangıç değerini girin",
                text: "Yatırımın başlangıç değerini TL cinsinden girin.",
            },
            {
                "@type": "HowToStep",
                name: "Bitiş değerini girin",
                text: "Yatırımın bitiş (hedef) değerini girin.",
            },
            {
                "@type": "HowToStep",
                name: "Süreyi girin",
                text: "Kaç yıllık dönem için hesaplama yapacağınızı girin.",
            },
            {
                "@type": "HowToStep",
                name: "Hesapla butonuna tıklayın",
                text: "CAGR oranı, toplam büyüme ve kazanç anında görüntülenir.",
            },
        ],
    };
}

function buildCompoundInterestHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Calculate Compound Interest",
        inLanguage: "en-US",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Enter the starting principal amount",
                text: "Enter the starting principal amount used as the base for the calculation.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Enter the annual interest rate",
                text: "Enter the annual interest rate as a percentage.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Choose the time period and compounding frequency",
                text: "Choose the number of years and how often interest is compounded.",
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Review the future value and schedule",
                text: "Review the future value, interest earned, and year-by-year growth schedule.",
            },
        ],
    };
}

function buildBabyHeightHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Bebek Boyu Nasıl Hesaplanır",
        description:
            "Anne ve baba boyuna göre çocuğun tahmini yetişkin boyu Orta Ebeveyn Boy Formülü ile hesaplanır.",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                name: "Baba boyunu girin",
                text: "Babanın boyunu cm cinsinden girin (140-220 cm arası).",
            },
            {
                "@type": "HowToStep",
                name: "Anne boyunu girin",
                text: "Annenin boyunu cm cinsinden girin.",
            },
            {
                "@type": "HowToStep",
                name: "Çocuğun cinsiyetini seçin",
                text: "Erkek veya kız seçeneğini işaretleyin.",
            },
            {
                "@type": "HowToStep",
                name: "Sonucu okuyun",
                text: "Tahmini yetişkin boy ve ±8,5 cm güven aralığı görüntülenir.",
            },
        ],
    };
}

function buildLifespanHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Yaşam Süresi Nasıl Hesaplanır?",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Yaş ve cinsiyet bilgisini girin",
                text: "Yaşınızı ve cinsiyetinizi girin.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Temel yaşam tarzı bilgilerini seçin",
                text: "Sigara, VKİ, egzersiz ve alkol bilgilerinizi seçin.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Ek yaşam tarzı faktörlerini ekleyin",
                text: "Uyku, stres ve beslenme gibi yaşam tarzı faktörlerini ekleyin.",
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Tahmini aralığı görün",
                text: "Tahmini yaşam süresi ve kalan yıl aralığını görün.",
            },
            {
                "@type": "HowToStep",
                position: 5,
                name: "Sonucu güvenli yorumlayın",
                text: "Sonucu tıbbi tanı değil, istatistiksel farkındalık olarak yorumlayın.",
            },
        ],
    };
}

function buildAscendantHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Yükselen Burç Nasıl Hesaplanır?",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Doğum tarihinizi girin",
                text: "Doğum gününüz, ayınız ve yılınızı seçin.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Doğum saatinizi ve dakikanızı seçin",
                text: "Mümkün olduğunca doğru doğum saatini ve dakikasını girin.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Doğduğunuz ili seçin",
                text: "Türkiye illeri arasından doğduğunuz ili seçerek il boylamı düzeltmesini kullanın.",
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Yükselen burç sonucunu görün",
                text: "Araç doğum saati ve il boylamına göre tahmini yükselen burç ön izlemesini gösterir.",
            },
            {
                "@type": "HowToStep",
                position: 5,
                name: "Sonucu güvenli yorumlayın",
                text: "Sonucu tahmini ön izleme olarak yorumlayın; dakika hassasiyetinde harita için profesyonel efemeris sistemi kullanın.",
            },
        ],
    };
}

function buildObpHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "OBP (Ortaöğretim Başarı Puanı) Nasıl Hesaplanır",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                name: "Diploma notunu girin",
                text: "Lise diploma notunuzu 100 üzerinden girin.",
            },
            {
                "@type": "HowToStep",
                name: "Kırık OBP durumunu seçin",
                text: "Önceki yıl merkezi yerleştirme ile bir programa yerleştiyseniz ilgili seçeneği işaretleyin.",
            },
            {
                "@type": "HowToStep",
                name: "Sonucu okuyun",
                text: "OBP puanınız, standart YKS katkısı ve varsa kırık OBP katkısı görüntülenir.",
            },
        ],
    };
}

function buildLgsHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "LGS Puanı Nasıl Hesaplanır?",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Doğru ve yanlış sayılarını girin",
                text: "Türkçe, Matematik, Fen, İnkılap, Din Kültürü ve İngilizce doğru-yanlış sayılarını girin.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Muafiyetleri seçin",
                text: "Varsa Din Kültürü veya Yabancı Dil muafiyetini seçin.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Netleri ve katsayıları kontrol edin",
                text: "Netlerinizi ve ders katsayılarını kontrol edin.",
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Tahmini sonucu görün",
                text: "Tahmini LGS puanı ve yüzdelik dilim aralığını görün.",
            },
            {
                "@type": "HowToStep",
                position: 5,
                name: "Tercih verileriyle değerlendirin",
                text: "Tercih için lise taban puanları ve resmi MEB sonuçlarını birlikte değerlendirin.",
            },
        ],
    };
}

function buildDgsHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "DGS Puanı Nasıl Hesaplanır?",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "Sayısal doğru ve yanlış sayılarını girin",
                text: "Sayısal testteki doğru ve yanlış sayılarını ilgili alanlara girin.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Sözel doğru ve yanlış sayılarını girin",
                text: "Sözel testteki doğru ve yanlış sayılarını ilgili alanlara girin.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "ÖBP puanınızı ekleyin",
                text: "Önlisans Başarı Puanınızı 40-80 aralığında ekleyin.",
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Önceki yıl yerleşme durumunu seçin",
                text: "ÖBP kesintisi gerekiyorsa önceki yıl yerleşme seçeneğini işaretleyin.",
            },
            {
                "@type": "HowToStep",
                position: 5,
                name: "Yaklaşık SAY, SÖZ ve EA DGS puan ön izlemesini yorumlayın",
                text: "Hesaplanan SAY, SÖZ ve EA değerlerini yaklaşık ön izleme olarak değerlendirin.",
            },
        ],
    };
}

function buildHighSchoolThresholdHowToSchema(pageUrl: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Lise Taban Puanları Nasıl Yorumlanır?",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            {
                "@type": "HowToStep",
                position: 1,
                name: "LGS puanınızı ve yüzdelik diliminizi belirleyin",
                text: "LGS puanınızı ve tahmini yüzdelik diliminizi birlikte not edin.",
            },
            {
                "@type": "HowToStep",
                position: 2,
                name: "Hedef lise türünü seçin",
                text: "Fen lisesi, anadolu lisesi, sosyal bilimler lisesi, proje okul, imam hatip veya mesleki-teknik lise türlerinden araştırmak istediğiniz grubu belirleyin.",
            },
            {
                "@type": "HowToStep",
                position: 3,
                name: "Önceki yıl verilerini inceleyin",
                text: "Okulun önceki yıl taban puanı ve yüzdelik dilimini MEB ve e-Okul kaynaklarıyla inceleyin.",
            },
            {
                "@type": "HowToStep",
                position: 4,
                name: "Kontenjan, şehir ve okul türü etkisini değerlendirin",
                text: "Kontenjan değişimi, şehir rekabeti, okul türü ve ulaşım koşullarını birlikte değerlendirin.",
            },
            {
                "@type": "HowToStep",
                position: 5,
                name: "Resmi kaynaklarla son kontrol yapın",
                text: "Kesin tercih için MEB kılavuzu ve e-Okul verilerini kontrol edin.",
            },
        ],
    };
}

function buildBabyHeightMedicalWebPageSchema(pageUrl: string, pageTitle: string, description: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: pageTitle,
        description,
        url: pageUrl,
        inLanguage: "tr-TR",
        about: {
            "@type": "MedicalCondition",
            name: "Çocuk Büyüme ve Boy Tahmini",
        },
        audience: { "@type": "Patient" },
        lastReviewed: "2026-03-09",
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
    const homeUrl = lang === "tr" ? SITE_URL : `${SITE_URL}/en`;
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
    const isCustomsDutyCalculator = calculator.slug === "gumruk-vergisi-hesaplama";

    const schemaEntries: Array<{ id: string; data: JsonLd }> = [
        {
            id: isCustomsDutyCalculator ? "web-application" : "software-application",
            data: {
                "@context": "https://schema.org",
                "@type": isCustomsDutyCalculator ? "WebApplication" : "SoftwareApplication",
                name: isCustomsDutyCalculator ? "Gümrük Vergisi Hesaplama Aracı 2026" : pageTitle,
                applicationCategory: getApplicationCategory(calculator.category),
                operatingSystem: isCustomsDutyCalculator ? "Web" : "All",
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
                        item: homeUrl,
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

    if (calculator.slug === "vergi-gecikme-faizi-hesaplama" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "tax-delay-how-to",
            data: buildTaxDelayHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "test-basari-orani" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "test-success-rate-how-to",
            data: buildTestSuccessRateHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "bilesik-buyume-hesaplama" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "cagr-how-to",
            data: buildCagrHowToSchema(pageUrl),
        });
    }

    if (
        calculator.slug === "bilesik-faiz-hesaplama"
        && lang === "en"
        && pageUrl.includes("/en/finance-calculator/compound-interest-calculator")
    ) {
        schemaEntries.splice(1, 0, {
            id: "compound-interest-how-to",
            data: buildCompoundInterestHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "bebek-boyu-hesaplama" && lang === "tr") {
        schemaEntries.splice(
            1,
            0,
            {
                id: "baby-height-medical-web-page",
                data: buildBabyHeightMedicalWebPageSchema(pageUrl, pageTitle, description),
            },
            {
                id: "baby-height-how-to",
                data: buildBabyHeightHowToSchema(pageUrl),
            }
        );
    }

    if (calculator.slug === "yasam-suresi-hesaplama" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "lifespan-how-to",
            data: buildLifespanHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "yukselen-burc-hesaplama" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "ascendant-how-to",
            data: buildAscendantHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "obp-puan-hesaplama" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "obp-how-to",
            data: buildObpHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "lgs-puan-hesaplama" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "lgs-how-to",
            data: buildLgsHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "dgs-puan-hesaplama" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "dgs-how-to",
            data: buildDgsHowToSchema(pageUrl),
        });
    }

    if (calculator.slug === "lise-taban-puanlari" && lang === "tr") {
        schemaEntries.splice(1, 0, {
            id: "high-school-threshold-how-to",
            data: buildHighSchoolThresholdHowToSchema(pageUrl),
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
