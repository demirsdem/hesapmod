import { getDisplayArticlesForCalculator } from "@/lib/articles";
import {
    calculators,
    findCalculatorByRoute,
    normalizeCalculatorSlug,
} from "@/lib/calculators";
import { getCategoryName, getCategoryPath, isHealthCategory, normalizeCategorySlug } from "@/lib/categories";
import { generateCalculatorMetadata } from "@/lib/seo";
import { getCalculatorTrustInfo } from "@/lib/calculator-trust";
import { renderRichText } from "@/lib/rich-text";
import { getSourceCalculatorAlternates } from "@/lib/calculator-source-en";
import { withSingleSiteName } from "@/lib/seo-title";
import dynamic from "next/dynamic";
const CalculatorEngine = dynamic(() => import("@/components/calculator/CalculatorEngine"));
import YukselenBurcCalculator from "@/components/calculator/custom/YukselenBurcCalculator";
import MedicalDisclaimer from "@/components/health/MedicalDisclaimer";
import EditorialQualityBlock from "@/components/calculator/EditorialQualityBlock";
import IndexableInfoBlock from "@/components/calculator/IndexableInfoBlock";
import PseoLinksBlock from "@/components/calculator/PseoLinksBlock";
import FormulaCopyButton from "@/components/calculator/FormulaCopyButton";
import SchemaScripts from "@/components/SchemaScripts";
import TrackedLink from "@/components/analytics/TrackedLink";
import ErrorBoundary from "@/components/ErrorBoundary";
import MevduatForm from "@/components/calculator/custom/DepositInterestCalculator";
import MevduatBankRates from "@/components/calculator/MevduatBankRates";
import SeverancePayCalculator from "@/components/calculator/custom/SeverancePayCalculator";
import ObpCalculator from "@/components/calculator/custom/ObpCalculator";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import AdUnit from "@/components/AdUnit";

// ─────────────────────────────────────────────────────────────
// ISR: haftalık statik finansal veri güncellemesi
// ─────────────────────────────────────────────────────────────
export const revalidate = 604800;

const EDITORIAL_TRUST_CATEGORIES = new Set([
    "sinav-hesaplamalari",
    "maas-ve-vergi",
    "finansal-hesaplamalar",
    "yasam-hesaplama",
    "tasit-ve-vergi",
    "insaat-muhendislik",
]);

const STATIC_CALCULATOR_ROUTES = new Set([
    "tasit-ve-vergi/arac-deger-hesaplama",
]);

const INDEXABLE_INFO_SLUGS = new Set([
    "bench-press-max",
    "matris-hesaplama",
    "kpss-puan-hesaplama",
]);

function splitFormulaText(formulaText: string) {
    const sentenceBreak = formulaText.match(/\.(?=\s+)/);

    if (sentenceBreak?.index === undefined) {
        return { primary: formulaText, detail: "" };
    }

    return {
        primary: formulaText.slice(0, sentenceBreak.index),
        detail: formulaText.slice(sentenceBreak.index + 1).trim(),
    };
}

// ─────────────────────────────────────────────────────────────
// Static params
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
    return calculators
        .filter((calc) => !STATIC_CALCULATOR_ROUTES.has(`${calc.category}/${calc.slug}`))
        .map((calc) => ({
            category: calc.category,
            slug: calc.slug,
        }));
}

// ─────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: { slug: string; category: string };
}) {
    // Burç ve kritik SEO sayfaları için özel metadata/canonical
    const normalizedCategory = normalizeCategorySlug(params.category);
    const normalizedSlug = normalizeCalculatorSlug(params.slug);

    if (
        normalizedCategory === "finansal-hesaplamalar"
        && normalizedSlug === "altin-hesaplama"
    ) {
        return {
            title: "Altın Hesaplama 2026 — Gram Altın, Çeyrek Altın, Cumhuriyet ve Ons Altın Çevirici",
            description:
                "Altın hesaplama aracı ile 24 ayar ve 22 ayar gram altın, çeyrek, yarım, cumhuriyet ve ons altın değerini hesaplayın. Canlı altın hesaplama, altın çevirici ve altın alım satım makas aralığı mantığını tek sayfada görün.",
            alternates: {
                canonical: "https://www.hesapmod.com/finansal-hesaplamalar/altin-hesaplama",
            },
            openGraph: {
                title: "Altın Hesaplama | HesapMod",
                description:
                    "Gram altın, çeyrek altın, cumhuriyet altını ve ons altın için profesyonel hesaplama ve karşılaştırma aracı.",
                url: "https://www.hesapmod.com/finansal-hesaplamalar/altin-hesaplama",
                type: "website",
            },
        };
    }

    if (
        normalizedCategory === "tasit-ve-vergi"
        && normalizedSlug === "mtv-hesaplama"
    ) {
        return {
            title: {
                absolute: "MTV Hesaplama 2026 — Motorlu Taşıtlar Vergisi Tutarları ve Ödeme Tarihleri | HesapMod",
            },
            description:
                "2026 MTV hesaplama aracı. Motor hacmi ve araç yaşını girerek yıllık MTV'yi ve Ocak-Temmuz taksitlerini hızlıca görün. 2026 MTV artış oranı %18,95; kesin tutar ilk tescil yılı ve taşıt değerine göre değişebilir.",
            alternates: {
                canonical: "https://www.hesapmod.com/tasit-ve-vergi/mtv-hesaplama",
            },
            openGraph: {
                title: "MTV Hesaplama 2026 — Motorlu Taşıtlar Vergisi Tutarları ve Ödeme Tarihleri | HesapMod",
                description:
                    "2026 MTV artış oranı %18,95. Motor hacmi ve araç yaşına göre yıllık MTV ve taksitleri hızlıca görün; kesin tutarı resmi GİB sorgusuyla doğrulayın.",
                url: "https://www.hesapmod.com/tasit-ve-vergi/mtv-hesaplama",
                type: "website",
            },
        };
    }

    if (
        normalizedCategory === "tasit-ve-vergi"
        && normalizedSlug === "otv-hesaplama"
    ) {
        return {
            title: {
                absolute: "ÖTV Hesaplama 2026 — Araç Özel Tüketim Vergisi Matrah ve Simülasyon | HesapMod",
            },
            description:
                "ÖTV hesaplama aracı 2026. Yeni sistemde vergisiz satış bedeli, araç sınıfı ve güç kırılımlarına göre binek araç ÖTV simülasyonu yapın. İçten yanmalı, elektrikli ve şarjlı hibrit araçlar için güncel çerçeve.",
            alternates: {
                canonical: "https://www.hesapmod.com/tasit-ve-vergi/otv-hesaplama",
            },
            openGraph: {
                title: "ÖTV Hesaplama 2026 — Araç Özel Tüketim Vergisi Matrah ve Simülasyon | HesapMod",
                description:
                    "24 Temmuz 2025 sonrası yeni sistemle araç ÖTV'sini matrah, sınıf ve güç kırılımlarına göre simüle edin; kesin tutarı bayi teklifi ve resmi mevzuatla doğrulayın.",
                url: "https://www.hesapmod.com/tasit-ve-vergi/otv-hesaplama",
                type: "website",
            },
        };
    }

    if (
        normalizedCategory === "tasit-ve-vergi"
        && normalizedSlug === "yakit-tuketim-maliyet"
    ) {
        return {
            title: {
                absolute: "Yakıt Tüketim ve Yol Maliyeti Hesaplama 2026 — Km Başına Gider | HesapMod",
            },
            description:
                "Yakıt tüketim ve maliyet hesaplama aracı 2026. Litre tüketim ve yakıt fiyatını girerek km başına maliyet, toplam yol gideri, aylık sürüş bütçesi ve benzin-motorin-LPG senaryolarını hesaplayın.",
            alternates: {
                canonical: "https://www.hesapmod.com/tasit-ve-vergi/yakit-tuketim-maliyet",
            },
            openGraph: {
                title: "Yakıt Tüketim ve Yol Maliyeti Hesaplama 2026 — Km Başına Gider | HesapMod",
                description:
                    "Km başına yakıt giderini, toplam yol maliyetini ve aylık sürüş bütçesini güncel pompa fiyatlarıyla hesaplayın; benzinli ve elektrikli senaryoları karşılaştırın.",
                url: "https://www.hesapmod.com/tasit-ve-vergi/yakit-tuketim-maliyet",
                type: "website",
            },
        };
    }

    if (
        normalizedCategory === "finansal-hesaplamalar"
        && normalizedSlug === "kira-artis-hesaplama"
    ) {
        return {
            title: {
                absolute: "Kira Artış Hesaplama 2026 — TÜFE %33,39 Güncel Oran | HesapMod",
            },
            description:
                "2026 kira artış hesaplama aracı. Mart 2026 TÜFE 12 aylık ortalama %33,39. Mevcut kiranızı girin, yasal azami artış tutarını ve yeni kira bedelini anında öğrenin. Konut ve iş yeri kirası için ücretsiz hesaplayıcı.",
            alternates: {
                canonical: "https://www.hesapmod.com/finansal-hesaplamalar/kira-artis-hesaplama",
            },
            openGraph: {
                title: "Kira Artış Hesaplama 2026 — TÜFE %33,39 Güncel Oran | HesapMod",
                description:
                    "2026 kira artış hesaplama aracı. Mart 2026 TÜFE 12 aylık ortalama %33,39. Mevcut kiranızı girin, yasal azami artış tutarını ve yeni kira bedelini anında öğrenin.",
                url: "https://www.hesapmod.com/finansal-hesaplamalar/kira-artis-hesaplama",
                type: "website",
            },
        };
    }

    if (
        normalizedCategory === "finansal-hesaplamalar"
        && normalizedSlug === "kredi-karti-gecikme-faizi-hesaplama"
    ) {
        return {
            title: {
                absolute: "Kredi Kartı Gecikme Faizi Hesaplama 2026 — Akdi ve Gecikme Faizi | HesapMod",
            },
            description:
                "Kredi kartı gecikme faizi hesaplama aracı. 2026 TCMB azami oranlarıyla akdi faiz, gecikme faizi, vergi yükü ve sonraki ekstre etkisini anında hesaplayın.",
            alternates: {
                canonical: "https://www.hesapmod.com/finansal-hesaplamalar/kredi-karti-gecikme-faizi-hesaplama",
            },
            openGraph: {
                title: "Kredi Kartı Gecikme Faizi Hesaplama 2026 — Akdi ve Gecikme Faizi | HesapMod",
                description:
                    "2026 TCMB azami oranlarıyla kredi kartı akdi faizini, gecikme faizini, vergi yükünü ve sonraki ekstre etkisini anında hesaplayın.",
                url: "https://www.hesapmod.com/finansal-hesaplamalar/kredi-karti-gecikme-faizi-hesaplama",
                type: "website",
            },
        };
    }

    if (
        normalizedCategory === "finansal-hesaplamalar"
        && normalizedSlug === "kredi-erken-kapama-hesaplama"
    ) {
        return {
            title: {
                absolute: "Kredi Erken Kapama Hesaplama 2026 — İndirim ve Kapatma Tutarı | HesapMod",
            },
            description:
                "Kredi erken kapama hesaplama aracı. Kalan anapara, vade ve faiz oranını girerek erken kapatma tutarını ve faiz indirimini anında öğrenin. İhtiyaç, taşıt ve konut kredisi için 2026 güncel hesaplayıcı.",
            alternates: {
                canonical: "https://www.hesapmod.com/finansal-hesaplamalar/kredi-erken-kapama-hesaplama",
            },
            openGraph: {
                title: "Kredi Erken Kapama Hesaplama 2026 — İndirim ve Kapatma Tutarı | HesapMod",
                description:
                    "Kalan anapara, vade ve faiz oranını girerek erken kapatma tutarını ve faiz indirimini anında hesaplayın.",
                url: "https://www.hesapmod.com/finansal-hesaplamalar/kredi-erken-kapama-hesaplama",
                type: "website",
            },
        };
    }

    if (
        normalizedCategory === "finansal-hesaplamalar"
        && normalizedSlug === "kredi-erken-kapatma-cezasi-hesaplama"
    ) {
        return {
            title: {
                absolute: "Kredi Erken Kapatma Cezası Hesaplama 2026 — Konut Kredisi Tazminatı | HesapMod",
            },
            description:
                "Kredi erken kapatma cezası hesaplama aracı ile sabit faizli konut kredisinde uygulanabilecek tazminatı ve toplam kapama tutarını görün. Kalan vade ve anaparaya göre hızlı hesaplama.",
            alternates: {
                canonical: "https://www.hesapmod.com/finansal-hesaplamalar/kredi-erken-kapatma-cezasi-hesaplama",
            },
            openGraph: {
                title: "Kredi Erken Kapatma Cezası Hesaplama 2026 — Konut Kredisi Tazminatı | HesapMod",
                description:
                    "Sabit faizli konut kredisinde uygulanabilecek %1 veya %2 tazminatı ve toplam kapama etkisini hızlıca hesaplayın.",
                url: "https://www.hesapmod.com/finansal-hesaplamalar/kredi-erken-kapatma-cezasi-hesaplama",
                type: "website",
            },
        };
    }

    if (normalizedCategory === "astroloji" && normalizedSlug === "burc-hesaplama") {
        return {
            title: { absolute: withSingleSiteName("Burç Hesaplama — Doğum Tarihine Göre Burç Bul | HesapMod") },
            description: "Doğum tarihinizi girin, Batı burcunuzu ve Çin burcunuzu anında öğrenin. Koç'tan Balık'a tüm burçlar, tarihleri, elementleri ve gezegenleriyle. 2026 güncel burç tarihleriyle doğum tarihine göre burç hesaplama.",
            alternates: {
                canonical: "https://www.hesapmod.com/astroloji/burc-hesaplama"
            },
            openGraph: {
                title: "Burç Hesaplama | HesapMod",
                description: "Doğum tarihine göre burç hesaplama aracı.",
                url: "https://www.hesapmod.com/astroloji/burc-hesaplama",
            },
        };
    }
    const metadata = generateCalculatorMetadata(normalizedSlug, "tr", normalizedCategory);
    const canonicalMetadata =
        normalizedCategory === "yasam-hesaplama" && normalizedSlug === "yasam-suresi-hesaplama"
            ? {
                ...metadata,
                alternates: {
                    ...metadata.alternates,
                    canonical: "https://www.hesapmod.com/yasam-hesaplama/yasam-suresi-hesaplama",
                },
            }
            : metadata;
    const localizedAlternates = getSourceCalculatorAlternates(normalizedCategory, normalizedSlug);

    if (!localizedAlternates) {
        return canonicalMetadata;
    }

    return {
        ...canonicalMetadata,
        alternates: {
            ...canonicalMetadata.alternates,
            languages: localizedAlternates.languages,
        },
    };
}

function getSingleSearchParam(
    searchParams: Record<string, string | string[] | undefined> | undefined,
    key: string
) {
    const value = searchParams?.[key];
    return Array.isArray(value) ? value[0] : value;
}

function getUnemploymentInitialValues(
    slug: string,
    searchParams: Record<string, string | string[] | undefined> | undefined
) {
    if (slug !== "issizlik-maasi-hesaplama") {
        return undefined;
    }

    const grossParam = getSingleSearchParam(searchParams, "gross");
    const daysParam = getSingleSearchParam(searchParams, "days");
    const initialValues: Record<string, string | number> = {};

    if (grossParam) {
        const gross = Number.parseFloat(grossParam.replace(",", "."));
        if (Number.isFinite(gross) && gross > 0) {
            initialValues.brutMaas = Math.round(gross);
        }
    }

    if (daysParam) {
        const days = Number.parseFloat(daysParam);
        if (Number.isFinite(days)) {
            if (days >= 1080) {
                initialValues.primGunu = 1080;
            } else if (days >= 900) {
                initialValues.primGunu = 900;
            } else if (days >= 600) {
                initialValues.primGunu = 600;
            }
        }
    }

    return Object.keys(initialValues).length > 0 ? initialValues : undefined;
}

function getDepositInitialValues(
    slug: string,
    searchParams: Record<string, string | string[] | undefined> | undefined
) {
    if (slug !== "mevduat-faiz-hesaplama") {
        return undefined;
    }

    const rateParam = getSingleSearchParam(searchParams, "rate");
    const daysParam = getSingleSearchParam(searchParams, "days");
    const initialValues: Record<string, string | number> = {};

    if (rateParam) {
        const rate = Number.parseFloat(rateParam.replace(",", "."));
        if (Number.isFinite(rate) && rate > 0) {
            initialValues.rate = rate;
        }
    }

    if (daysParam) {
        const days = Number.parseFloat(daysParam.replace(",", "."));
        if (Number.isFinite(days) && days > 0) {
            initialValues.days = Math.round(days);
        }
    }

    return Object.keys(initialValues).length > 0 ? initialValues : undefined;
}

function getCustomsDutyInitialValues(
    slug: string,
    searchParams: Record<string, string | string[] | undefined> | undefined
) {
    if (slug !== "gumruk-vergisi-hesaplama") {
        return undefined;
    }

    const initialValues: Record<string, string | number> = {};
    const categoryParam = getSingleSearchParam(searchParams, "kategori");
    const currencyParam = getSingleSearchParam(searchParams, "doviz");

    if (categoryParam) {
        initialValues.category = categoryParam;
    }

    if (currencyParam && ["TRY", "EUR", "USD"].includes(currencyParam.toUpperCase())) {
        initialValues.currency = currencyParam.toUpperCase();
    }

    [
        ["fiyat", "itemPrice"],
        ["kargo", "shippingCost"],
        ["sigorta", "insuranceCost"],
        ["kur", "exchangeRate"],
    ].forEach(([queryKey, valueKey]) => {
        const raw = getSingleSearchParam(searchParams, queryKey);
        if (!raw) return;
        const parsed = Number.parseFloat(raw.replace(",", "."));
        if (Number.isFinite(parsed) && parsed >= 0) {
            initialValues[valueKey] = parsed;
        }
    });

    return Object.keys(initialValues).length > 0 ? initialValues : undefined;
}

function getCalculatorInitialValues(
    slug: string,
    searchParams: Record<string, string | string[] | undefined> | undefined
) {
    return getCustomsDutyInitialValues(slug, searchParams)
        ?? getDepositInitialValues(slug, searchParams)
        ?? getUnemploymentInitialValues(slug, searchParams);
}

function getDepositActiveDays(
    slug: string,
    initialValues: Record<string, string | number> | undefined
) {
    if (slug !== "mevduat-faiz-hesaplama") {
        return null;
    }

    const days = Number(initialValues?.days ?? 92);
    return Number.isFinite(days) && days > 0 ? days : 92;
}

function getDepositSelectedRate(
    slug: string,
    initialValues: Record<string, string | number> | undefined
) {
    if (slug !== "mevduat-faiz-hesaplama") {
        return undefined;
    }

    const rate = Number(initialValues?.rate);
    return Number.isFinite(rate) && rate > 0 ? rate : undefined;
}

export default function CalculatorPage({
        params,
        searchParams,
}: {
        params: { slug: string; category: string };
        searchParams?: Record<string, string | string[] | undefined>;
}) {
        const normalizedCategory = normalizeCategorySlug(params.category);
        const normalizedSlug = normalizeCalculatorSlug(params.slug);

    if (normalizedCategory !== params.category || normalizedSlug !== params.slug) {
        permanentRedirect(`/${normalizedCategory}/${normalizedSlug}`);
    }

    const calc = findCalculatorByRoute(normalizedSlug, normalizedCategory);
    if (!calc) notFound();

    const isHealth = isHealthCategory(calc.category);
    const isLgsScorePage = calc.category === "sinav-hesaplamalari" && calc.slug === "lgs-puan-hesaplama";
    const isDgsScorePage = calc.category === "sinav-hesaplamalari" && calc.slug === "dgs-puan-hesaplama";
    const trustInfo = getCalculatorTrustInfo(calc.slug, calc.category);
    const editorialTrustInfo = EDITORIAL_TRUST_CATEGORIES.has(calc.category)
        ? trustInfo
        : null;

    // Kategori adını mainCategories'den dinamik al — yeni kategori ekleyince burayı değiştirmene gerek yok
    const categoryName = getCategoryName(calc.category);

    // Related calculators (slug'dan tam config'e çözümleme)
    const relatedCalculatorSlugs = new Set(calc.relatedCalculators ?? []);
    const explicitRelatedCalcs = (calc.relatedCalculators ?? [])
        .map((slug) => calculators.find((c) => c.slug === slug))
        .filter(Boolean);
    const supplementalRelatedCalcs = calculators.filter(
        (candidate) =>
            candidate.slug !== calc.slug
            && candidate.category === calc.category
            && !relatedCalculatorSlugs.has(candidate.slug)
    );
    const relatedCalcs = [...explicitRelatedCalcs, ...supplementalRelatedCalcs].slice(0, 4);
    const relatedArticles = getDisplayArticlesForCalculator(calc.slug, calc.category).slice(0, 3);
    const isTaxDelayInterestPage = calc.slug === "vergi-gecikme-faizi-hesaplama";
    const isAscendantCalculatorPage = calc.category === "astroloji" && calc.slug === "yukselen-burc-hesaplama";
    const isDepositInterestPage = calc.slug === "mevduat-faiz-hesaplama";
    const isObpCalculatorPage = calc.slug === "obp-puan-hesaplama";
    const isSeverancePayPage = calc.slug === "kidem-tazminati-hesaplama";
    const isCustomsDutyPage = calc.slug === "gumruk-vergisi-hesaplama";
    const isCagrPage = calc.category === "finansal-hesaplamalar" && calc.slug === "bilesik-buyume-hesaplama";
    const isBabyHeightPage = calc.category === "yasam-hesaplama" && calc.slug === "bebek-boyu-hesaplama";
    const calculatorInitialValues = getCalculatorInitialValues(calc.slug, searchParams);
    const depositActiveDays = getDepositActiveDays(calc.slug, calculatorInitialValues);
    const depositSelectedRate = getDepositSelectedRate(calc.slug, calculatorInitialValues);
    const formulaTextParts = calc.seo.richContent
        ? splitFormulaText(calc.seo.richContent.formulaText.tr)
        : null;

    // ─────────────────────────────────────────────────────────
    // Ortak bölüm yardımcıları (section badge numaralaması)
    // ─────────────────────────────────────────────────────────
    const sectionBadge = (n: number) => (
        <span className="inline-flex w-8 h-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
            {n}
        </span>
    );
    const relatedContentSection =
        (relatedArticles.length > 0 || relatedCalcs.length > 0) ? (
            <section
                aria-labelledby="related-content-heading"
                className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
            >
                <div className="mb-8">
                    <h2
                        id="related-content-heading"
                        className="text-2xl font-bold text-slate-900"
                    >
                        İlgili Rehberler ve Hesaplamalar
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Sonucu farklı senaryolarla karşılaştırmak veya konuyu daha iyi yorumlamak için bu bağlantıları kullanın.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {relatedCalcs.length > 0 && (
                        <div>
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-slate-900">
                                    İlgili Hesap Makineleri
                                </h3>
                                <TrackedLink
                                    href={getCategoryPath(calc.category)}
                                    analytics={{
                                        source_type: "calculator_related_content",
                                        source_slug: calc.slug,
                                        source_category: calc.category,
                                        target_kind: "category",
                                        target_category: calc.category,
                                    }}
                                    className="text-sm font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    Kategoriye git
                                </TrackedLink>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {relatedCalcs.map((related) => (
                                    <TrackedLink
                                        key={related!.slug}
                                        href={`/${related!.category}/${related!.slug}`}
                                        analytics={{
                                            source_type: "calculator_related_content",
                                            source_slug: calc.slug,
                                            source_category: calc.category,
                                            target_slug: related!.slug,
                                            target_category: related!.category,
                                            target_kind: "calculator",
                                        }}
                                        className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#FFD7C7] hover:shadow-md"
                                    >
                                        <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                            {related!.name.tr}
                                        </p>
                                        <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-2">
                                            {related!.shortDescription?.tr ?? related!.description.tr}
                                        </p>
                                    </TrackedLink>
                                ))}
                            </div>
                        </div>
                    )}

                    {relatedArticles.length > 0 && (
                        <div>
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-slate-900">
                                    İlgili Rehberler
                                </h3>
                                <TrackedLink
                                    href="/rehber"
                                    analytics={{
                                        source_type: "calculator_related_content",
                                        source_slug: calc.slug,
                                        source_category: calc.category,
                                        target_kind: "guide_landing",
                                    }}
                                    className="text-sm font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    Tüm rehberler
                                </TrackedLink>
                            </div>
                            <div className="grid gap-3">
                                {relatedArticles.map((article) => (
                                    <TrackedLink
                                        key={article.slug}
                                        href={`/rehber/${article.slug}`}
                                        analytics={{
                                            source_type: "calculator_related_content",
                                            source_slug: calc.slug,
                                            source_category: calc.category,
                                            target_slug: article.slug,
                                            target_kind: "guide",
                                        }}
                                        className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[#FFD7C7] hover:shadow-md"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Rehber
                                        </p>
                                        <h3 className="mt-2 text-base font-bold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                            {article.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">
                                            {article.description}
                                        </p>
                                    </TrackedLink>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        ) : null;

        return (
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                        <SchemaScripts calculator={calc} trustInfo={editorialTrustInfo} />

            {isLgsScorePage && (
                <section
                    aria-label="2026 LGS metodoloji bilgisi"
                    className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-950 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        <span
                            aria-hidden="true"
                            className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white"
                        >
                            i
                        </span>
                        <p className="text-sm font-medium leading-6 sm:text-base">
                            2026 LGS kılavuzuna göre sınav 90 sorudan oluşur. Puan hesaplamasında 3 yanlış 1 doğruyu götürür; Türkçe, Matematik ve Fen katsayısı 4; İnkılap, Din Kültürü ve Yabancı Dil katsayısı 1'dir. Sonuçlar tahminidir.
                        </p>
                    </div>
                </section>
            )}

            {isTaxDelayInterestPage && (
                <section
                    aria-label="Güncel oran bilgisi"
                    className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-950 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        <span
                            aria-hidden="true"
                            className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white"
                        >
                            ✓
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-black leading-6 sm:text-base">
                                Güncel Oran: 13 Kasım 2025'ten itibaren aylık %3,7
                            </p>
                            <p className="mt-1 text-xs font-medium leading-5 text-blue-800 sm:text-sm">
                                Kaynak:{" "}
                                <a
                                    href="https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgecikme-zammi-orani.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold underline underline-offset-4 hover:text-blue-950"
                                >
                                    GİB gecikme zammı oranı
                                </a>
                                {" "}ve{" "}
                                <a
                                    href="https://cdn.gib.gov.tr/api/gibportal-file/file/getFile?objectKey=DUYURU%2FUNIVERSAL%2F2025%2F6183_SeriCSiraNo9_not.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold underline underline-offset-4 hover:text-blue-950"
                                >
                                    Tahsilat Genel Tebliği
                                </a>
                                {" "} | Son kontrol: Mayıs 2026
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 1. BREADCRUMB + H1 ───────────────────────── */}
            <div className="mb-6">
                <nav
                    aria-label="Gezinti izi"
                    className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap"
                >
                    <Link href="/" className="hover:text-primary transition-colors">
                        Ana Sayfa
                    </Link>
                    <span aria-hidden="true">›</span>
                    <Link
                        href={getCategoryPath(calc.category)}
                        className="hover:text-primary transition-colors"
                    >
                        {categoryName}
                    </Link>
                    <span aria-hidden="true">›</span>
                    <span className="text-slate-900">{calc.name.tr}</span>
                </nav>

                {/* YMYL badge — yalnızca sağlık */}
                {isHealth && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-3 py-1 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Bilgilendirme amaçlı · Tahmini sonuç
                    </div>
                )}

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                    {calc.h1?.tr ?? calc.name.tr}
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl">
                    {calc.shortDescription?.tr ?? calc.description.tr}
                </p>

            </div>

            {calc.slug === "enflasyon-hesaplama" && (
                <section
                    aria-labelledby="inflation-current-data-heading"
                    className="mb-8 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm"
                >
                    {/* TODO: Her ayın 3'ünde TÜİK verisiyle güncelle */}
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="inflation-current-data-heading"
                                className="text-2xl font-bold text-slate-900"
                            >
                                2026 Güncel Enflasyon Verileri
                            </h2>
                            <div className="mt-5 overflow-x-auto">
                                <table className="min-w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left text-slate-700">
                                            <th className="py-3 pr-4 font-semibold">Dönem</th>
                                            <th className="py-3 pr-4 font-semibold">TÜFE (Yıllık)</th>
                                            <th className="py-3 pr-4 font-semibold">Yİ-ÜFE (Yıllık)</th>
                                            <th className="py-3 font-semibold">12 Aylık Ort.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-600">
                                        <tr className="border-b border-slate-100">
                                            <td className="py-3 pr-4 font-medium text-slate-900">Şubat 2026</td>
                                            <td className="py-3 pr-4">%31,53</td>
                                            <td className="py-3 pr-4">%27,56</td>
                                            <td className="py-3 font-semibold text-slate-900">%33,39</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 pr-4 font-medium text-slate-900">Ocak 2026</td>
                                            <td className="py-3 pr-4">%30,65</td>
                                            <td className="py-3 pr-4">—</td>
                                            <td className="py-3">—</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-5 text-sm leading-6 text-slate-700">
                                <strong>Kira artış tavanı (Mart 2026):</strong> TÜFE 12 aylık ortalama %33,39
                                {" "}— hem konut hem işyeri kiraları için yasal üst sınır.
                            </p>
                            <p className="mt-3 text-xs text-slate-500">
                                Kaynak:{" "}
                                <a
                                    href="https://data.tuik.gov.tr/Bulten/Index?p=Tuketici-Fiyat-Endeksi-Subat-2026-53620"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-700 hover:text-primary transition-colors"
                                >
                                    TÜİK, 3 Mart 2026
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {calc.slug === "kira-artis-hesaplama" && (
                <section
                    aria-labelledby="rent-increase-current-rate-heading"
                    className="mb-8 rounded-3xl border border-[#FF6B35] bg-[#FFF3EE] p-6 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="rent-increase-current-rate-heading"
                                className="text-2xl font-bold text-[#CC4A1A]"
                            >
                                🗓 Mart 2026 Güncel Kira Artış Oranı
                            </h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Konut kirası artış tavanı</p>
                                    <p className="mt-2 text-3xl font-black tracking-tight text-[#CC4A1A]">%33,39</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Çatılı iş yeri kirası artış tavanı</p>
                                    <p className="mt-2 text-3xl font-black tracking-tight text-[#CC4A1A]">%33,39</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                Kaynak: TÜİK TÜFE 12 aylık ortalama (Şubat 2026)
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                                Son güncelleme: 14 Mart 2026
                            </p>
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900">
                                ⚠ Nisan 2026'da TÜİK yeni veriyi açıkladığında bu oran güncellenecektir.
                            </div>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                Araçta farklı bir senaryo denemek için oranı manuel değiştirebilirsiniz.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {calc.slug === "mtv-hesaplama" && (
                <section
                    aria-labelledby="mtv-current-tariff-heading"
                    className="mb-8 rounded-3xl border border-[#FF6B35] bg-[#FFF3EE] p-6 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="mtv-current-tariff-heading"
                                className="text-2xl font-bold text-[#CC4A1A]"
                            >
                                📅 2026 MTV Tutarları
                            </h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4 xl:col-span-1">
                                    <p className="text-sm font-semibold text-slate-600">Artış oranı</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%18,95</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4 xl:col-span-1">
                                    <p className="text-sm font-semibold text-slate-600">Ödeme tarihleri</p>
                                    <p className="mt-2 text-base font-bold leading-6 text-[#CC4A1A]">Ocak ve Temmuz</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">1.3 lt'ye kadar</p>
                                    <p className="mt-2 text-xl font-black tracking-tight text-[#CC4A1A]">6.902 TL</p>
                                    <p className="mt-1 text-xs text-slate-500">Taksit: 3.451 TL</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">1.3-1.6 lt arası</p>
                                    <p className="mt-2 text-xl font-black tracking-tight text-[#CC4A1A]">12.028 TL</p>
                                    <p className="mt-1 text-xs text-slate-500">Taksit: 6.014 TL</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">1.6-1.8 lt arası</p>
                                    <p className="mt-2 text-xl font-black tracking-tight text-[#CC4A1A]">21.251 TL</p>
                                    <p className="mt-1 text-xs text-slate-500">Taksit: 10.625,50 TL</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                Kaynak: GİB Dijital Vergi Dairesi MTV hesaplama ekranı ve 58 Seri No.lu Motorlu Taşıtlar Vergisi Genel Tebliği
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                                Son güncelleme: 15 Mart 2026
                            </p>
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900">
                                ⚠ Kartlardaki örnekler 1-3 yaş binek otomobiller için referans tutarlardır. Kesin MTV; ilk tescil yılı, araç yaşı, taşıt değeri ve araç tipine göre değişir.
                            </div>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                Motor hacmi ve araç yaşını girerek hızlı ön hesap alın; ödeme öncesinde resmi GİB sorgusuyla kesin tutarı doğrulayın.
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">
                                İlgili araçlar:{" "}
                                <Link
                                    href="/maas-ve-vergi/vergi-gecikme-faizi-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    vergi gecikme zammı hesaplama
                                </Link>
                                {" "}ve{" "}
                                <Link
                                    href="/tasit-ve-vergi/otv-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    ÖTV hesaplama
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {calc.slug === "otv-hesaplama" && (
                <section
                    aria-labelledby="otv-current-framework-heading"
                    className="mb-8 rounded-3xl border border-[#FF6B35] bg-[#FFF3EE] p-6 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="otv-current-framework-heading"
                                className="text-2xl font-bold text-[#CC4A1A]"
                            >
                                📅 2026 Yeni ÖTV Sistemi
                            </h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">İçten yanmalı binek</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%70 - %220</p>
                                    <p className="mt-1 text-xs text-slate-500">Motor hacmi + matrah birlikte belirleyici</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Elektrikli binek</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%25 - %75</p>
                                    <p className="mt-1 text-xs text-slate-500">160 kW ve 1.650.000 TL eşikleri kritik</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">4x4 pick-up / 87.04</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%50</p>
                                    <p className="mt-1 text-xs text-slate-500">2025 yazındaki düzenleme sonrası</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Engelli istisna limiti</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">6.290.100 TL</p>
                                    <p className="mt-1 text-xs text-slate-500">Yerlilik oranı en az %40</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                Kaynak: GİB ÖTV mevzuatı açıklama notu, 10115 sayılı Cumhurbaşkanı Kararı ve yürürlükteki ÖTV Kanunu II sayılı liste çerçevesi
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                                Son güncelleme: 15 Mart 2026
                            </p>
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900">
                                ⚠ Bu ekran simülasyon aracıdır. Kesin vergi; teknik sınıflandırma, bayi proforması, matrah kırılımı ve resmi mevzuat birlikte kontrol edilerek belirlenmelidir.
                            </div>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                Araç sınıfı ve vergisiz satış bedelini girerek hızlı ön hesap alın; satın alma öncesinde bayi teklifini ve GİB mevzuatını mutlaka doğrulayın.
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">
                                İlgili araçlar:{" "}
                                <Link
                                    href="/tasit-ve-vergi/mtv-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    MTV hesaplama
                                </Link>
                                {" "}ve{" "}
                                <Link
                                    href="/maas-ve-vergi/vergi-gecikme-faizi-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    vergi gecikme zammı hesaplama
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {calc.slug === "yakit-tuketim-maliyet" && (
                <section
                    aria-labelledby="fuel-reference-prices-heading"
                    className="mb-8 rounded-3xl border border-[#FF6B35] bg-[#FFF3EE] p-6 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="fuel-reference-prices-heading"
                                className="text-2xl font-bold text-[#CC4A1A]"
                            >
                                📅 Mayıs 2026 Referans Yakıt ve Şarj Fiyatları
                            </h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Benzin 95</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">65,02 TL/L</p>
                                    <p className="mt-1 text-xs text-slate-500">İstanbul Avrupa referansı</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Motorin</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">67,48 TL/L</p>
                                    <p className="mt-1 text-xs text-slate-500">İstanbul Avrupa referansı</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">LPG</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">33,89 TL/L</p>
                                    <p className="mt-1 text-xs text-slate-500">İstanbul Avrupa referansı</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Kamusal AC şarj</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">8,49 TL/kWh</p>
                                    <p className="mt-1 text-xs text-slate-500">Petrol Ofisi E-Power tarifesi</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                Kaynak: Petrol Ofisi güncel akaryakıt fiyatları ve E-Power şarj tarifesi
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                                Son güncelleme: Mayıs 2026
                            </p>
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900">
                                ⚠ Yakıt fiyatları şehre, dağıtıcıya ve gün içi fiyat değişimine göre farklılaşabilir. Hesaplayıcıdaki fiyat alanını kendi istasyonunuza göre manuel güncellemeniz en doğru sonucu verir.
                            </div>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                Benzin, motorin ve LPG için litre fiyatını doğrudan girebilir; elektrikli araç senaryosunu ise kWh başı maliyeti km başına çevirerek karşılaştırmalı okuyabilirsiniz.
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-700">
                                İlgili araçlar:{" "}
                                <Link
                                    href="/tasit-ve-vergi/hiz-mesafe-sure"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    hız mesafe süre
                                </Link>
                                {" "}ve{" "}
                                <Link
                                    href="/tasit-ve-vergi/mtv-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    MTV hesaplama
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {calc.slug === "kredi-karti-gecikme-faizi-hesaplama" && (
                <section
                    aria-labelledby="cc-late-interest-current-rates-heading"
                    className="mb-8 rounded-3xl border border-[#FF6B35] bg-[#FFF3EE] p-6 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="cc-late-interest-current-rates-heading"
                                className="text-2xl font-bold text-[#CC4A1A]"
                            >
                                🗓 Mart 2026 TCMB Kredi Kartı Faiz Tavanları
                            </h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Alışveriş akdi faiz tavanı</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%3,25 - %4,25</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Alışveriş gecikme faiz tavanı</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%3,55 - %4,55</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Nakit çekim akdi tavanı</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%4,25</p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Nakit çekim gecikme tavanı</p>
                                    <p className="mt-2 text-2xl font-black tracking-tight text-[#CC4A1A]">%4,55</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                Kaynak: TCMB azami kredi kartı faiz oranları tablosu (1 Mart 2026)
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                                Son güncelleme: 14 Mart 2026
                            </p>
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900">
                                ⚠ Bankanız daha düşük oran uygulayabilir. Araçtaki akdi ve gecikme faiz alanlarını sözleşmenize göre manuel güncelleyebilirsiniz.
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-700">
                                İlgili araçlar:{" "}
                                <Link
                                    href="/finansal-hesaplamalar/kredi-karti-asgari-odeme"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    kredi kartı asgari ödeme
                                </Link>
                                {" "}ve{" "}
                                <Link
                                    href="/finansal-hesaplamalar/kredi-karti-taksitli-nakit-avans-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    taksitli nakit avans hesaplama
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {calc.slug === "kredi-erken-kapama-hesaplama" && (
                <section
                    aria-labelledby="early-closure-framework-heading"
                    className="mb-8 rounded-3xl border border-[#FF6B35] bg-[#FFF3EE] p-6 shadow-sm"
                >
                    <div className="flex items-start gap-3">
                        {sectionBadge(1)}
                        <div className="min-w-0 flex-1">
                            <h2
                                id="early-closure-framework-heading"
                                className="text-2xl font-bold text-[#CC4A1A]"
                            >
                                🗓 2026 Erken Kapama Çerçevesi
                            </h2>
                            <div className="mt-5 grid gap-3 md:grid-cols-3">
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Tüketici kredileri</p>
                                    <p className="mt-2 text-base font-bold leading-6 text-[#CC4A1A]">
                                        Kalan vadelerdeki faiz ve diğer maliyetlerde indirim yapılır.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Sabit faizli konut kredisi</p>
                                    <p className="mt-2 text-base font-bold leading-6 text-[#CC4A1A]">
                                        Kalan vade 36 ay ve altındaysa en fazla %1, üzerindeyse en fazla %2 tazminat uygulanabilir.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#FFD7C7] bg-white px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-600">Değişken faizli konut kredisi</p>
                                    <p className="mt-2 text-base font-bold leading-6 text-[#CC4A1A]">
                                        Erken ödeme tazminatı talep edilemez.
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-700">
                                Kaynak: Ticaret Bakanlığı tüketici kredisi rehberi ve yürürlükteki tüketici kredisi mevzuatı
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">
                                Son güncelleme: 14 Mart 2026
                            </p>
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-900">
                                ⚠ Bankadan alınan resmi kapama yazısında ödeme gününe kadar işlemiş günlük faiz ve varsa yasal tazminat nedeniyle küçük fark oluşabilir.
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-700">
                                İlgili araçlar:{" "}
                                <Link
                                    href="/finansal-hesaplamalar/kredi-erken-kapatma-cezasi-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    kredi erken kapatma cezası hesaplama
                                </Link>
                                {" "}ve{" "}
                                <Link
                                    href="/finansal-hesaplamalar/kredi-taksit-hesaplama"
                                    className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                                >
                                    kredi taksit hesaplama
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 2. HESAP MAKİNESİ ────────────────────────── */}
            <ErrorBoundary
                fallback={
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
                        Bu hesaplayıcı yüklenirken geçici bir sorun oluştu. Sayfayı yenileyerek tekrar deneyebilirsiniz.
                    </div>
                }
            >
                {isAscendantCalculatorPage ? (
                    <YukselenBurcCalculator lang="tr" />
                ) : isSeverancePayPage ? (
                    <SeverancePayCalculator
                        lang="tr"
                        initialValues={calculatorInitialValues}
                    />
                ) : isDepositInterestPage ? (
                    <MevduatForm
                        lang="tr"
                        initialValues={calculatorInitialValues}
                    />
                ) : isObpCalculatorPage ? (
                    <ObpCalculator initialValues={calculatorInitialValues} />
                ) : (
                    <CalculatorEngine
                        calculator={{
                            slug: calc.slug,
                            category: calc.category,
                            name: calc.name,
                            inputs: calc.inputs,
                            results: calc.results,
                        }}
                        lang="tr"
                        initialValues={calculatorInitialValues}
                    />
                )}
            </ErrorBoundary>

            {depositActiveDays !== null && (
                <div className="mt-8">
                    <MevduatBankRates
                        activeDays={depositActiveDays}
                        selectedRate={depositSelectedRate}
                    />
                </div>
            )}

            {isCustomsDutyPage && (
                <div className="mt-10">
                    <AdUnit
                        dataAdClient="ca-pub-XXXXXXXXX"
                        dataAdSlot="XXXXXXXXX"
                        minHeight="90px"
                        format="horizontal"
                    />
                </div>
            )}

            {/* ── 3. TIBBİ UYARI (yalnızca sağlık, hesap sonrası) ── */}
            {isHealth && !isBabyHeightPage && (
                <div className="mt-6">
                    <MedicalDisclaimer />
                </div>
            )}

            {/* ── 4. RICH CONTENT (howItWorks, formül, örnek, rehber) ── */}
            {calc.seo.richContent && isCagrPage && !isLgsScorePage && (
                <div className="mt-20 space-y-10">
                    <section aria-labelledby="how-it-works-heading">
                        <h2
                            id="how-it-works-heading"
                            className="mb-5 text-2xl font-bold text-slate-900"
                        >
                            Nasıl Çalışır?
                        </h2>
                        <div className="grid gap-4 md:grid-cols-4">
                            {[
                                {
                                    number: 1,
                                    title: "Nasıl Çalışır",
                                    text: calc.seo.richContent.howItWorks.tr,
                                },
                                {
                                    number: 2,
                                    title: "Formül",
                                    text: "Başlangıç, bitiş ve süre bilgisi tek bir yıllık bileşik orana çevrilir.",
                                },
                                {
                                    number: 3,
                                    title: "Örnek",
                                    text: calc.seo.richContent.exampleCalculation.tr,
                                },
                                {
                                    number: 4,
                                    title: "İpucu",
                                    text: "Sonucu enflasyon ve reel getiri hesaplarıyla birlikte okuyun.",
                                },
                            ].map((step) => (
                                <article
                                    key={step.number}
                                    className="rounded-xl border-l-4 border-[#FF6B35] bg-slate-50 p-4"
                                >
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-[#FF6B35]">{step.number}</span>
                                        <h3 className="text-base font-black text-slate-900">{step.title}</h3>
                                    </div>
                                    <p className="mt-3 line-clamp-5 text-sm leading-6 text-slate-600">
                                        {step.text}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="formula-heading">
                        <h2
                            id="formula-heading"
                            className="mb-4 text-2xl font-bold text-slate-900"
                        >
                            Formül
                        </h2>
                        <div className="relative rounded-xl bg-slate-900 p-4 pr-32 font-mono text-sm text-orange-300 shadow-sm md:text-base">
                            <p>{formulaTextParts?.primary}</p>
                            {formulaTextParts?.detail && (
                                <p className="mt-2 text-xs leading-5 text-slate-300 md:text-sm">
                                    {formulaTextParts.detail}
                                </p>
                            )}
                            <div className="absolute right-4 top-4">
                                <FormulaCopyButton text={calc.seo.richContent.formulaText.tr} />
                            </div>
                        </div>
                    </section>

                    <section
                        aria-labelledby="example-heading"
                        className="rounded-2xl border border-[#FFD7C7] bg-[#FFF3EE] p-6 md:p-8"
                    >
                        <h2
                            id="example-heading"
                            className="mb-4 text-2xl font-bold text-slate-900"
                        >
                            Örnek Hesaplama
                        </h2>
                        <p className="text-base leading-7 text-slate-700">
                            {calc.seo.richContent.exampleCalculation.tr}
                        </p>
                    </section>

                    <section aria-labelledby="guide-heading">
                        <h2
                            id="guide-heading"
                            className="mb-4 text-2xl font-bold text-slate-900"
                        >
                            Kullanım Rehberi ve İpuçları
                        </h2>
                        <div
                            className="rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-600 shadow-sm"
                            dangerouslySetInnerHTML={{
                                __html: calc.seo.richContent.miniGuide.tr,
                            }}
                        />
                    </section>
                </div>
            )}

            {calc.seo.richContent && isBabyHeightPage && !isLgsScorePage && (
                <div className="mt-20 space-y-10">
                    <section aria-labelledby="how-it-works-heading">
                        <h2
                            id="how-it-works-heading"
                            className="mb-5 text-2xl font-bold text-slate-900"
                        >
                            Nasıl Çalışır?
                        </h2>
                        <div className="grid gap-4 md:grid-cols-4">
                            {[
                                {
                                    number: 1,
                                    title: "Baba Boyu",
                                    text: "Babanın boyunu 140-220 cm aralığında girin.",
                                },
                                {
                                    number: 2,
                                    title: "Anne Boyu",
                                    text: "Annenin boyunu cm cinsinden ekleyin.",
                                },
                                {
                                    number: 3,
                                    title: "Cinsiyet",
                                    text: "Erkek için +13 cm, kız için -13 cm düzeltmesi uygulanır.",
                                },
                                {
                                    number: 4,
                                    title: "Aralık",
                                    text: "Tahmini boy ±8,5 cm güven aralığıyla birlikte gösterilir.",
                                },
                            ].map((step) => (
                                <article
                                    key={step.number}
                                    className="rounded-xl border-l-4 border-[#FF6B35] bg-slate-50 p-4"
                                >
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-[#FF6B35]">{step.number}</span>
                                        <h3 className="text-base font-black text-slate-900">{step.title}</h3>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {step.text}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="formula-heading">
                        <h2
                            id="formula-heading"
                            className="mb-4 text-2xl font-bold text-slate-900"
                        >
                            Formül
                        </h2>
                        <div className="relative rounded-xl bg-slate-900 p-4 pr-32 font-mono text-sm text-orange-300 shadow-sm md:text-base">
                            <p>Erkek = (Baba + Anne + 13) / 2</p>
                            <p className="mt-2">Kız = (Baba + Anne - 13) / 2</p>
                            <p className="mt-2 text-xs leading-5 text-slate-300 md:text-sm">
                                Güven aralığı = Tahmini boy ± 8,5 cm
                            </p>
                            <div className="absolute right-4 top-4">
                                <FormulaCopyButton text={calc.seo.richContent.formulaText.tr} />
                            </div>
                        </div>
                    </section>

                    <section
                        aria-labelledby="example-heading"
                        className="rounded-2xl border border-[#FFD7C7] bg-[#FFF3EE] p-6 md:p-8"
                    >
                        <h2
                            id="example-heading"
                            className="mb-4 text-2xl font-bold text-slate-900"
                        >
                            Örnek Hesaplama
                        </h2>
                        <p className="text-base leading-7 text-slate-700">
                            {calc.seo.richContent.exampleCalculation.tr}
                        </p>
                    </section>

                    <section aria-labelledby="guide-heading">
                        <h2
                            id="guide-heading"
                            className="mb-4 text-2xl font-bold text-slate-900"
                        >
                            Sağlık Rehberi ve Önemli Notlar
                        </h2>
                        <div
                            className="rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-600 shadow-sm"
                            dangerouslySetInnerHTML={{
                                __html: calc.seo.richContent.miniGuide.tr,
                            }}
                        />
                    </section>
                </div>
            )}

            {calc.seo.richContent && !isCagrPage && !isBabyHeightPage && !isLgsScorePage && !isDgsScorePage && (
                <div className="mt-20 space-y-16">
                    {/* Nasıl Çalışır & Formül */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <section aria-labelledby="how-it-works-heading">
                            <h2
                                id="how-it-works-heading"
                                className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900"
                            >
                                {sectionBadge(1)}
                                Nasıl Çalışır?
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {calc.seo.richContent.howItWorks.tr}
                            </p>
                        </section>

                        <section aria-labelledby="formula-heading">
                            <h2
                                id="formula-heading"
                                className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900"
                            >
                                {sectionBadge(2)}
                                Formül
                            </h2>
                            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                                <code className="text-[#CC4A1A] font-mono text-sm block mb-3">
                                    {formulaTextParts?.primary}
                                </code>
                                {formulaTextParts?.detail && (
                                    <p className="text-sm text-slate-600">
                                        {formulaTextParts.detail}
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Örnek Hesaplama */}
                    <section
                        aria-labelledby="example-heading"
                        className="rounded-3xl border border-[#FFD7C7] bg-[#FFF3EE] p-8"
                    >
                        <h2
                            id="example-heading"
                            className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900"
                        >
                            {sectionBadge(3)}
                            Örnek Hesaplama
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            {calc.seo.richContent.exampleCalculation.tr}
                        </div>
                    </section>

                    {/* Mini Rehber */}
                    <section aria-labelledby="guide-heading">
                        <h2
                            id="guide-heading"
                            className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900"
                        >
                            {sectionBadge(4)}
                            {isHealth
                                ? "Sağlık Rehberi ve Önemli Notlar"
                                : "Kullanım Rehberi ve İpuçları"}
                        </h2>
                        <div
                            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm leading-relaxed text-slate-600 space-y-4"
                            dangerouslySetInnerHTML={{
                                __html: calc.seo.richContent.miniGuide.tr,
                            }}
                        />
                    </section>
                </div>
            )}

            {/* ── 5. SEO İÇERİK + SSS ─────────────────────── */}
            <section
                aria-labelledby="seo-content-heading"
                className="mt-20 prose prose-slate max-w-none border-t border-slate-200 pt-12"
            >
                <h2
                    id="seo-content-heading"
                    className="text-3xl font-bold mb-6 text-slate-900"
                >
                    {calc.slug === "lise-taban-puanlari"
                        ? "Lise Taban Puanları ve Yüzdelik Dilim Aracı"
                        : isDgsScorePage
                        ? "DGS Puan Hesaplama Aracı"
                        : calc.slug === "cimento-hesaplama"
                        ? "Çimento Hesaplama Nedir?"
                        : `${calc.name.tr} Nedir? ${isHealth ? "Nasıl Yorumlanır?" : "Nasıl Hesaplanır?"}`}
                </h2>
                <div
                    className={
                        isCagrPage
                            ? "text-lg leading-relaxed text-slate-600 [&_table]:my-8 [&_table]:min-w-full [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-slate-200 [&_thead]:bg-slate-800 [&_thead]:text-white [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_td]:px-4 [&_td]:py-3 [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_tr:nth-child(even)]:bg-slate-50 [&_tbody_tr:first-child]:font-semibold"
                            : isCustomsDutyPage
                                ? "text-lg leading-relaxed text-slate-600 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_table]:my-8 [&_table]:min-w-full [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-slate-200 [&_thead]:bg-slate-800 [&_thead]:text-white [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_td]:px-4 [&_td]:py-3 [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_tr:nth-child(even)]:bg-slate-50"
                            : "text-lg leading-relaxed text-slate-600"
                    }
                    dangerouslySetInnerHTML={{
                        __html: renderRichText(calc.seo.content.tr),
                    }}
                />

                {/* SSS */}
                {calc.seo.faq.length > 0 && (
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 not-prose border border-slate-100">
                        {isLgsScorePage || isDgsScorePage || isAscendantCalculatorPage || calc.slug === "lise-taban-puanlari" || calc.slug === "yasam-suresi-hesaplama" ? (
                            <h2 className="text-2xl font-bold mb-8 text-slate-900">
                                Sıkça Sorulan Sorular
                            </h2>
                        ) : (
                            <h3 className="text-2xl font-bold mb-8 text-slate-900">
                                Sıkça Sorulan Sorular
                            </h3>
                        )}
                        <div className="space-y-6">
                            {calc.seo.faq.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
                                >
                                    <h4 className="font-bold text-lg mb-2 text-slate-900">
                                        {item.q.tr}
                                    </h4>
                                    <p className="text-slate-600">
                                        {item.a.tr}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {isDgsScorePage && (
                <section
                    aria-labelledby="dgs-sources-method-heading"
                    className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-700 shadow-sm"
                >
                    <h2
                        id="dgs-sources-method-heading"
                        className="text-2xl font-bold text-slate-900"
                    >
                        Kaynaklar ve Resmi Sonuç Uyarısı
                    </h2>
                    <p className="mt-4">
                        Bu araç DGS SAY, SÖZ ve EA puanları için yaklaşık bir ön izleme üretir; resmi sonuç değildir. Resmi sonuç, sınav yılına ait ÖSYM değerlendirmesi, sonuç belgesi, tercih kılavuzu ve ilgili duyurularla belirlenir.
                    </p>
                    <p className="mt-3">
                        Tercih planı yaparken hesapladığınız bandı{" "}
                        <Link
                            href="/sinav-hesaplamalari/dgs-taban-puanlari"
                            className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                        >
                            DGS Taban Puanları
                        </Link>
                        {" "}ve{" "}
                        <Link
                            href="/rehber/okul-giris-sinav-rehberi-2026"
                            className="font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                        >
                            2026 Okul Giriş Sınav Rehberi
                        </Link>
                        {" "}ile birlikte okuyun.
                    </p>
                </section>
            )}

            {isLgsScorePage && (
                <section
                    aria-labelledby="lgs-sources-method-heading"
                    className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-700 shadow-sm"
                >
                    <h2
                        id="lgs-sources-method-heading"
                        className="text-2xl font-bold text-slate-900"
                    >
                        Kaynaklar ve Yöntem
                    </h2>
                    <p className="mt-4">
                        Bu araç LGS puanını 2025 referans değerleri ve ders katsayıları üzerinden yaklaşık hesaplamak için hazırlanmıştır. LGS puanı; netler, ders katsayıları, standart puanlar, ortalama, standart sapma ve sınav yılına ait dağılım değerlerinden etkilenir. Sonuçlar bilgilendirme amaçlıdır; resmi MEB sonucu değildir.
                    </p>
                </section>
            )}

            {isCustomsDutyPage && (
                <div className="mt-10">
                    <AdUnit
                        dataAdClient="ca-pub-XXXXXXXXX"
                        dataAdSlot="XXXXXXXXX"
                        minHeight="250px"
                        format="rectangle"
                    />
                </div>
            )}

            <PseoLinksBlock parentSlug={calc.slug} category={calc.category} />

            {INDEXABLE_INFO_SLUGS.has(calc.slug) && (
                <IndexableInfoBlock
                    pageTitle={calc.name.tr}
                    category={categoryName}
                    slug={calc.slug}
                />
            )}

            {/* ── 6. Sağlık sayfalarında 2. Disclaimer (footer öncesi) ── */}
            {isHealth && !isBabyHeightPage && (
                <div className="mt-12">
                    <MedicalDisclaimer />
                </div>
            )}

            <EditorialQualityBlock trustInfo={editorialTrustInfo} />

            {relatedContentSection}

            {/* ── (Reklam Slot — in-article, CLS-safe) ────── */}
            {/* TODO: Replace placeholder AdSense slot IDs with verified production slots; future safe placements are result sonrası, yorumlar sonrası, and FAQ sonrası CLS-safe units. */}
            <div className="mt-12">
                <AdUnit dataAdClient="ca-pub-XXXXXXXXX" dataAdSlot="XXXXXXXXX" />
            </div>

            {/* ── 7. İLGİLİ HESAP MAKİNELERİ ─────────────── */}
        </div>
    );
}
