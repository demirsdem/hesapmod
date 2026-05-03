import { CategoryIcon } from "@/components/category/CategoryIcon";
import { getArticlesByCategorySlug } from "@/lib/articles";
import { calculators } from "@/lib/calculators";
import {
    getCategoryBySlug,
    getCategoryPath,
    mainCategories,
    normalizeCategorySlug,
} from "@/lib/categories";
import { generateCategorySchema } from "@/lib/seo";
import { getFeaturedToolItems } from "@/lib/featured-tools";
import { getCalculatorLastModified } from "@/lib/content-last-modified";
import {
    CATEGORY_SPOTLIGHT_CONFIGS,
    resolveEditorialArticleLinks,
    resolveEditorialCalculatorLinks,
} from "@/lib/editorial-hubs";
import { getActivationRouteKey, newCalculatorActivationRouteKeys } from "@/lib/organic-activation";
import TrackedLink from "@/components/analytics/TrackedLink";
import FeaturedTools from "@/components/FeaturedTools";
import { ArrowRight, Calculator, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SITE_URL } from "@/lib/site";

const EXAM_EDITORIAL_BLOCKS = [
    {
        eyebrow: "Üniversite Girişi",
        title: "YKS, TYT ve tercih planını birlikte okuyun",
        description:
            "Üniversite hedefinde tek bir puan ekranı yeterli olmaz. TYT, YKS, OBP ve taban puanlarını aynı akış içinde yorumlamak; netten puana, puandan tercihe giden yolu daha anlaşılır hale getirir.",
        calculatorSlugs: [
            "tyt-puan-hesaplama",
            "yks-puan-hesaplama",
            "obp-puan-hesaplama",
            "universite-taban-puanlari",
        ],
        guideSlugs: ["sinav-puanlari-rehberi-2026"],
    },
    {
        eyebrow: "Okul Başarısı",
        title: "LGS ve okul notu araçlarını tek bir bölümde takip edin",
        description:
            "Ortaokuldan liseye geçiş ve okul içi performans hesapları birlikte değerlendirildiğinde daha fazla anlam kazanır. LGS puanı, lise taban puanları ve okul ortalaması aynı kategoride buluşuyor.",
        calculatorSlugs: [
            "lgs-puan-hesaplama",
            "lise-taban-puanlari",
            "e-okul-not-hesaplama",
            "takdir-tesekkur-hesaplama",
            "lise-ortalama-hesaplama",
        ],
        guideSlugs: ["okul-giris-sinav-rehberi-2026"],
    },
    {
        eyebrow: "Kamu ve Meslek",
        title: "KPSS, ALES ve uzmanlık sınavlarını ayrı ayrı değil, stratejik okuyun",
        description:
            "Kamu atamaları, akademik başvurular ve mesleki yeterlilik sınavları farklı katsayı mantıklarıyla çalışır. Bu nedenle KPSS, ALES, DGS, YDS ve benzeri araçları aynı merkezde toplamak karar vermeyi hızlandırır.",
        calculatorSlugs: [
            "kpss-puan-hesaplama",
            "ales-puan-hesaplama",
            "dgs-puan-hesaplama",
            "yds-puan-hesaplama",
            "ekpss-puan-hesaplama",
            "hmgs-puan-hesaplama",
        ],
        guideSlugs: ["sinav-puanlari-rehberi-2026", "okul-giris-sinav-rehberi-2026"],
    },
    {
        eyebrow: "Polis ve Güvenlik",
        title: "PMYO, POMEM ve ÖGG süreçlerini aynı yerde karşılaştırın",
        description:
            "Polislik ve özel güvenlik odaklı ekranlarda sadece sınav puanı değil; parkur, mülakat ve ek barajlar da önemlidir. Bu blok, yakın ihtiyaca sahip sayfaları bir arada tutarak daha net bir yol sunar.",
        calculatorSlugs: [
            "pmyo-puan-hesaplama",
            "pomem-puan-hesaplama",
            "ogg-sinav-puan-hesaplama",
            "ozel-guvenlik-sinav-hesaplama",
            "ehliyet-sinav-puan-hesaplama",
        ],
        guideSlugs: [],
    },
];

const EXAM_OFFICIAL_RESOURCES = [
    {
        label: "ÖSYM Kılavuz ve Duyurular",
        href: "https://www.osym.gov.tr/",
        note: "YKS, TYT, KPSS, ALES, DGS, YDS ve diğer merkezi sınavlar için resmi kaynak.",
    },
    {
        label: "MEB Sınav ve Okul Bilgileri",
        href: "https://www.meb.gov.tr/",
        note: "LGS, okul notu, e-Okul ve eğitim süreçlerine yakın resmi referans noktası.",
    },
    {
        label: "Polis Akademisi",
        href: "https://www.pa.edu.tr/",
        note: "PMYO ve POMEM duyuruları ile başvuru koşullarını kontrol etmek için.",
    },
    {
        label: "EGM Özel Güvenlik",
        href: "https://www.egm.gov.tr/ozelguvenlik",
        note: "Özel güvenlik sınavları, silahlı-silahsız süreçler ve resmi açıklamalar.",
    },
];

function formatDateLabel(date: string | Date) {
    return new Date(date).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export async function generateStaticParams() {
    return mainCategories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const cat = getCategoryBySlug(params.slug);
    if (!cat) return { title: "Bulunamadı" };

    const toolCount = calculators.filter((calculator) => calculator.category === cat.slug).length;
    const guideCount = getArticlesByCategorySlug(cat.slug).length;
    const categoryName = cat.name.tr.toLocaleLowerCase("tr-TR");
    const guideSnippet =
        guideCount > 0 ? ` Ayrıca ${guideCount} ilgili rehber içerik de bulunur.` : "";
    const title =
        cat.slug === "sinav-hesaplamalari"
            ? "Sınav Puan Hesaplama 2026: YKS, TYT, KPSS, LGS, ALES ve Okul Notu Araçları"
            : `${cat.name.tr} Hesaplama Araçları`;
    const description =
        cat.slug === "sinav-hesaplamalari"
            ? `${toolCount} adet sınav ve okul puanı aracı burada. YKS, TYT, KPSS, LGS, ALES, OBP, DGS, YDS ve okul notu ekranlarını tek sayfada karşılaştırın.${guideSnippet}`
            : `${toolCount} adet ${categoryName} hesaplama aracı burada. ${cat.description.tr}${guideSnippet}`;

    return {
        title,
        description,
        alternates: { canonical: getCategoryPath(cat.slug) },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}${getCategoryPath(cat.slug)}`,
            type: "website",
        },
    };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const normalizedSlug = normalizeCategorySlug(params.slug);
    if (normalizedSlug !== params.slug) {
        permanentRedirect(getCategoryPath(normalizedSlug));
    }

    const cat = getCategoryBySlug(normalizedSlug);
    if (!cat) notFound();

    const categoryCounts = new Map<string, number>();
    for (const calculator of calculators) {
        categoryCounts.set(
            calculator.category,
            (categoryCounts.get(calculator.category) ?? 0) + 1
        );
    }

    const isPriorityCategory = ["finansal-hesaplamalar", "maas-ve-vergi", "sinav-hesaplamalari"].includes(normalizedSlug);
    const catCalcs = calculators
        .filter((calculator) => calculator.category === cat.slug)
        .sort((a, b) => a.name.tr.localeCompare(b.name.tr, "tr"));
    const newCategoryCalcs = catCalcs.filter((calculator) =>
        newCalculatorActivationRouteKeys.has(getActivationRouteKey(calculator))
    );
    const featuredCalcs = catCalcs.slice(0, 6);
    const relatedArticles = getArticlesByCategorySlug(cat.slug);
    const siblingCategories = mainCategories.filter((category) => category.slug !== cat.slug);
    const categoryFeaturedTools = getFeaturedToolItems("category", normalizedSlug, isPriorityCategory ? 8 : 6);
    const categorySpotlightConfig = CATEGORY_SPOTLIGHT_CONFIGS[normalizedSlug];
    const categorySpotlight = categorySpotlightConfig
        ? {
            eyebrow: categorySpotlightConfig.eyebrow,
            title: categorySpotlightConfig.title,
            description: categorySpotlightConfig.description,
            calculators: resolveEditorialCalculatorLinks(categorySpotlightConfig.calculatorLinks),
            guides: resolveEditorialArticleLinks(categorySpotlightConfig.guideLinks),
        }
        : null;
    const schemas = generateCategorySchema(cat.slug, "tr");
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${cat.name.tr} Hesaplama Araçları`,
        numberOfItems: catCalcs.length,
        itemListElement: catCalcs.map((calculator, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: calculator.name.tr,
            url: `${SITE_URL}/${calculator.category}/${calculator.slug}`,
        })),
    };
    const isExamCategory = normalizedSlug === "sinav-hesaplamalari";
    const calculatorBySlug = new Map(catCalcs.map((calculator) => [calculator.slug, calculator]));
    const articleBySlug = new Map(relatedArticles.map((article) => [article.slug, article]));
    const quickStartItems =
        categoryFeaturedTools.length > 0
            ? categoryFeaturedTools
            : featuredCalcs.map((calculator) => ({
                slug: calculator.slug,
                label: calculator.name.tr,
                href: `/${calculator.category}/${calculator.slug}`,
                category: calculator.category,
                priority: 0,
            }));
    const latestCategoryCalcs = catCalcs
        .map((calculator) => ({
            ...calculator,
            lastModified: getCalculatorLastModified(calculator.slug),
        }))
        .sort((left, right) => right.lastModified.getTime() - left.lastModified.getTime())
        .slice(0, 6);
    const examEditorialBlocks = isExamCategory
        ? EXAM_EDITORIAL_BLOCKS.map((block) => ({
            ...block,
            calculators: block.calculatorSlugs.flatMap((slug) => {
                const calculator = calculatorBySlug.get(slug);
                return calculator ? [calculator] : [];
            }),
            guides: block.guideSlugs.flatMap((slug) => {
                const article = articleBySlug.get(slug);
                return article ? [article] : [];
            }),
        })).filter((block) => block.calculators.length > 0)
        : [];
    const showStandaloneFeaturedTools = categoryFeaturedTools.length > 0 && !categorySpotlight;

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            {schemas && (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schemas.collectionSchema),
                        }}
                    />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schemas.breadcrumbSchema),
                        }}
                    />
                    {schemas.faqSchema && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(schemas.faqSchema),
                            }}
                        />
                    )}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(itemListSchema),
                        }}
                    />
                </>
            )}

            <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="transition-colors hover:text-[#CC4A1A]">
                    Ana Sayfa
                </Link>
                <ArrowRight size={14} />
                <span className="font-medium text-slate-900">{cat.name.tr}</span>
            </nav>

            <section className="mb-14 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#FFF3EE] p-8 shadow-sm md:p-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                                <CategoryIcon icon={cat.icon} size={18} className="text-[#CC4A1A]" />
                                {cat.name.tr}
                            </span>
                            <span className="rounded-full bg-[#FF6B35] px-3 py-1 text-sm font-semibold text-white">
                                {catCalcs.length} araç
                            </span>
                            {relatedArticles.length > 0 && (
                                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                                    {relatedArticles.length} rehber
                                </span>
                            )}
                        </div>

                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                            {cat.name.tr} Hesaplama Araçları
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                            {cat.description.tr}
                        </p>
                    </div>

                    {quickStartItems.length > 0 && (
                        <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {isPriorityCategory ? "Sık Kullanılan Araçlar" : "Hızlı Başlangıç"}
                            </p>
                            <div className="flex max-w-md flex-wrap gap-2">
                                {quickStartItems.map((item) => (
                                    <TrackedLink
                                        key={item.slug}
                                        href={item.href}
                                        analytics={{
                                            source_type: "category_quick_start",
                                            source_slug: normalizedSlug,
                                            target_slug: item.slug,
                                            target_category: item.category,
                                            target_kind: "calculator",
                                        }}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
                                    >
                                        {item.label}
                                    </TrackedLink>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {newCategoryCalcs.length > 0 && (
                <section className="mb-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Yeni Eklenen {cat.name.tr} Araçları
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                Bu kategoriye son genişleme paketinde eklenen hesaplayıcılar.
                            </p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {newCategoryCalcs.length} yeni araç
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {newCategoryCalcs.map((calculator) => (
                            <TrackedLink
                                key={`${calculator.category}/${calculator.slug}`}
                                href={`/${calculator.category}/${calculator.slug}`}
                                analytics={{
                                    source_type: "category_new_calculators",
                                    source_slug: normalizedSlug,
                                    target_slug: calculator.slug,
                                    target_category: calculator.category,
                                    target_kind: "calculator",
                                }}
                                className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF7F3]"
                            >
                                <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                    {calculator.name.tr}
                                </p>
                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                                    {(calculator.shortDescription ?? calculator.description).tr}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#CC4A1A]">
                                    Aracı aç <ArrowRight size={13} />
                                </span>
                            </TrackedLink>
                        ))}
                    </div>
                </section>
            )}

            {categorySpotlight && categorySpotlight.calculators.length > 0 && (
                <section className="mb-20">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {categorySpotlight.eyebrow}
                            </p>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                                {categorySpotlight.title}
                            </h2>
                            <p className="mt-2 max-w-3xl text-slate-600">
                                {categorySpotlight.description}
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Canonical ve bağlamsal hızlı erişim
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Öne çıkan araçlar
                            </p>
                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {categorySpotlight.calculators.map((item) => (
                                    <TrackedLink
                                        key={item.slug}
                                        href={item.href}
                                        analytics={{
                                            source_type: "category_spotlight",
                                            source_slug: normalizedSlug,
                                            target_slug: item.slug,
                                            target_category: item.category,
                                            target_kind: "calculator",
                                        }}
                                        className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF7F3]"
                                    >
                                        <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                            {item.label}
                                        </p>
                                        <p className="mt-2 text-xs leading-6 text-slate-600">
                                            {item.description}
                                        </p>
                                    </TrackedLink>
                                ))}
                            </div>
                        </div>

                        {categorySpotlight.guides.length > 0 && (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Önce rehber, sonra hesapla
                                </p>
                                <div className="mt-5 space-y-3">
                                    {categorySpotlight.guides.map((guide) => (
                                        <TrackedLink
                                            key={guide.slug}
                                            href={guide.href}
                                            analytics={{
                                                source_type: "category_spotlight",
                                                source_slug: normalizedSlug,
                                                target_slug: guide.slug,
                                                target_kind: "guide",
                                            }}
                                            className="group block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF7F3]"
                                        >
                                            <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                                {guide.title}
                                            </p>
                                            <p className="mt-2 text-xs leading-6 text-slate-600">
                                                {guide.blurb}
                                            </p>
                                        </TrackedLink>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {catCalcs.length === 0 ? (
                <div className="py-24 text-center text-slate-400">
                    <Calculator size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Bu kategoride henüz araç bulunmuyor.</p>
                </div>
            ) : (
                <section className="mb-20">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Kategorideki Araçlar
                            </h2>
                            <p className="mt-2 max-w-2xl text-slate-600">
                                Bu kategorideki araçlar hızlı karşılaştırma, ön kontrol ve hesaplama ihtiyacı için tek yerde toplanır.
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Toplam {catCalcs.length} araç
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {catCalcs.map((calc) => (
                            <Link
                                key={calc.id}
                                href={`/${calc.category}/${calc.slug}`}
                                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD7C7] hover:shadow-md"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-[#FFF3EE]">
                                    <Calculator
                                        className="text-slate-500 transition-colors group-hover:text-[#CC4A1A]"
                                        size={18}
                                    />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                    {calc.name.tr}
                                </h3>
                                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                                    {(calc.shortDescription ?? calc.description).tr}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#CC4A1A] opacity-0 transition-opacity group-hover:opacity-100">
                                    Araca git <ArrowRight size={12} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {isExamCategory && examEditorialBlocks.length > 0 && (
                <section className="mb-20">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                2026 Sınav Yol Haritası
                            </h2>
                            <p className="mt-2 max-w-3xl text-slate-600">
                                Bu kategori sadece araç listesi değil; hangi sayfanın hangi amaçla açılması gerektiğini gösteren bir merkez olarak kurgulandı. Net, puan, okul katkısı ve resmi kaynak akışını birlikte izleyebilirsiniz.
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Net, puan ve planlama aynı merkezde
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {examEditorialBlocks.map((block) => (
                            <article
                                key={block.title}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {block.eyebrow}
                                </p>
                                <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                                    {block.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {block.description}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2.5">
                                    {block.calculators.map((calculator) => (
                                        <TrackedLink
                                            key={calculator.slug}
                                            href={`/${calculator.category}/${calculator.slug}`}
                                            analytics={{
                                                source_type: "exam_category_cluster",
                                                source_slug: normalizedSlug,
                                                source_section: block.title,
                                                target_slug: calculator.slug,
                                                target_category: calculator.category,
                                                target_kind: "calculator",
                                            }}
                                            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
                                        >
                                            {calculator.name.tr}
                                        </TrackedLink>
                                    ))}
                                </div>

                                {block.guides.length > 0 && (
                                    <div className="mt-6 rounded-2xl border border-[#FFD7C7] bg-[#FFF7F3] p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#CC4A1A]">
                                            Önce rehber, sonra araç
                                        </p>
                                        <div className="mt-3 flex flex-col gap-3">
                                            {block.guides.map((guide) => (
                                                <TrackedLink
                                                    key={guide.slug}
                                                    href={`/rehber/${guide.slug}`}
                                                    analytics={{
                                                        source_type: "exam_category_cluster",
                                                        source_slug: normalizedSlug,
                                                        source_section: block.title,
                                                        target_slug: guide.slug,
                                                        target_kind: "guide",
                                                    }}
                                                    className="group flex items-start justify-between gap-3 rounded-2xl border border-white bg-white p-4 transition-colors hover:border-[#FFD7C7]"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                                            {guide.title}
                                                        </p>
                                                        <p className="mt-1 text-xs leading-6 text-slate-600">
                                                            {guide.description}
                                                        </p>
                                                    </div>
                                                    <ArrowRight size={16} className="mt-0.5 shrink-0 text-[#CC4A1A]" />
                                                </TrackedLink>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {relatedArticles.length > 0 && (
                <section className="mb-20">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                İlgili Rehberler
                            </h2>
                            <p className="mt-2 max-w-2xl text-slate-600">
                                Konuyu önce okuyup sonra ilgili hesaplama araçlarına geçmek için bu rehberleri kullanın.
                            </p>
                        </div>
                        <Link
                            href="/rehber"
                            className="hidden items-center gap-2 text-sm font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26] md:inline-flex"
                        >
                            Tüm rehberler <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {relatedArticles.map((article) => (
                            <TrackedLink
                                key={article.slug}
                                href={`/rehber/${article.slug}`}
                                analytics={{
                                    source_type: "category_related_guides",
                                    source_slug: normalizedSlug,
                                    target_slug: article.slug,
                                    target_kind: "guide",
                                }}
                                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD7C7] hover:shadow-md"
                            >
                                <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                                        <FileText size={14} />
                                        Rehber
                                    </span>
                                    <span>
                                        {formatDateLabel(article.updatedAt ?? article.publishedAt)}
                                    </span>
                                </div>
                                <h3 className="mb-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                    {article.title}
                                </h3>
                                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                                    {article.description}
                                </p>
                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#CC4A1A]">
                                    Rehberi aç <ArrowRight size={14} />
                                </div>
                            </TrackedLink>
                        ))}
                    </div>
                </section>
            )}

            {isExamCategory && latestCategoryCalcs.length > 0 && (
                <section className="mb-20">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Resmi Kaynaklar ve Son Güncellemeler
                            </h2>
                            <p className="mt-2 max-w-3xl text-slate-600">
                                Sınav sonucunu yorumlarken sadece ekran çıktısına değil, ilgili kurumun kılavuz ve duyurularına da bakmak gerekir. Bu bölüm, kullanıcıya daha güvenli bir kontrol listesi sunar.
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Resmi kontrol + güncel araçlar
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">
                                Kontrol edilmesi gereken resmi sayfalar
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                Özellikle YKS, KPSS, LGS, PMYO, POMEM ve ÖGG gibi süreçlerde kılavuz değişikliği tek bir katsayıyı değil, tüm yorumlamayı etkileyebilir.
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {EXAM_OFFICIAL_RESOURCES.map((resource) => (
                                    <a
                                        key={resource.href}
                                        href={resource.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF7F3]"
                                    >
                                        <p className="text-sm font-semibold text-slate-900">
                                            {resource.label}
                                        </p>
                                        <p className="mt-2 text-xs leading-6 text-slate-600">
                                            {resource.note}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">
                                Son güncellenen sınav sayfaları
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                Yeni tarih alan sayfalar, kullanıcıya ve arama motoruna bu kategorinin yaşadığını daha net gösterir.
                            </p>

                            <div className="mt-5 space-y-3">
                                {latestCategoryCalcs.map((calculator) => (
                                    <TrackedLink
                                        key={calculator.slug}
                                        href={`/${calculator.category}/${calculator.slug}`}
                                        analytics={{
                                            source_type: "category_recently_updated",
                                            source_slug: normalizedSlug,
                                            target_slug: calculator.slug,
                                            target_category: calculator.category,
                                            target_kind: "calculator",
                                        }}
                                        className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF7F3]"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                                {calculator.name.tr}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Güncelleme: {formatDateLabel(calculator.lastModified)}
                                            </p>
                                        </div>
                                        <ArrowRight size={14} className="shrink-0 text-[#CC4A1A]" />
                                    </TrackedLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {showStandaloneFeaturedTools && (
                <div className="mb-20">
                    <FeaturedTools
                        variant="category"
                        categorySlug={params.slug}
                        maxItems={isPriorityCategory ? 8 : 6}
                    />
                </div>
            )}

            {(cat.seoContent || (cat.faq && cat.faq.length > 0)) && (
                <section className="mt-20 border-t border-border/50 pt-16">
                    <div className="mx-auto max-w-4xl">
                        {cat.seoContent && (
                            <div className="prose prose-slate max-w-none mb-16">
                                <h2 className="mb-6 text-3xl font-bold text-slate-900">
                                    {cat.name.tr} Nedir?
                                </h2>
                                <p className="text-lg leading-relaxed text-slate-600">
                                    {cat.seoContent.tr}
                                </p>
                            </div>
                        )}

                        {cat.faq && cat.faq.length > 0 && (
                            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                                <h3 className="mb-8 text-2xl font-bold text-slate-900">
                                    Sıkça Sorulan Sorular
                                </h3>
                                <div className="space-y-6">
                                    {cat.faq.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <h4 className="mb-3 text-lg font-bold text-slate-900">
                                                {item.q.tr}
                                            </h4>
                                            <p className="leading-relaxed text-slate-600">
                                                {item.a.tr}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="mt-16 border-t border-slate-200 pt-10">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Diğer Kategoriler
                        </h2>
                        <p className="mt-2 text-slate-600">
                            Farklı hesaplama başlıklarına da buradan geçebilirsiniz.
                        </p>
                    </div>
                    <Link
                        href="/tum-araclar"
                        className="hidden items-center gap-2 text-sm font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26] md:inline-flex"
                    >
                        Tüm araçları gör <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {siblingCategories.slice(0, 4).map((category) => (
                        <Link
                            key={category.id}
                            href={getCategoryPath(category.slug)}
                            className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD7C7] hover:shadow-md"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#FFF3EE] group-hover:text-[#CC4A1A]">
                                <CategoryIcon icon={category.icon} size={22} />
                            </div>
                            <div className="mb-1 flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                    {category.name.tr}
                                </h3>
                                <span className="text-xs font-semibold text-slate-500">
                                    {categoryCounts.get(category.slug) ?? 0}
                                </span>
                            </div>
                            <p className="line-clamp-2 text-sm text-slate-600">
                                {category.description.tr}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
