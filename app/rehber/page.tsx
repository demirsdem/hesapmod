import { articles } from "@/lib/articles";
import { getCategoryPath } from "@/lib/categories";
import { SITE_EDITOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site";
import {
    GUIDE_LANDING_CONFIGS,
    SUPPLEMENTARY_GUIDE_CALCULATOR_LINKS,
    getArticleFeaturedCalculatorSection,
    resolveEditorialArticleLinks,
    resolveEditorialCalculatorLinks,
} from "@/lib/editorial-hubs";
import FeaturedTools from "@/components/FeaturedTools";
import Link from "next/link";
import TrackedLink from "@/components/analytics/TrackedLink";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rehber & İpuçları",
    description:
        "Maaş, finans, kredi, vergi ve yaşam hesaplamaları hakkında güncel rehberler. Hesaplama araçlarımızla desteklenmiş pratik makaleler.",
    alternates: { canonical: "/rehber" },
    openGraph: {
        title: `Rehber & İpuçları — ${SITE_NAME}`,
        description: "Türkiye'nin en kapsamlı hesaplama araçları platformundan güncel rehber makaleleri.",
        url: `${SITE_URL}/rehber`,
        type: "website",
    },
};

const categoryColors: Record<string, string> = {
    "Maaş & Vergi": "bg-[#FFF3EE] text-[#CC4A1A] dark:bg-[#4A2315] dark:text-[#FFD7C7]",
    "Finans": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Sağlık": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    "Matematik": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

export default function RehberPage() {
    const guideLandingSections = GUIDE_LANDING_CONFIGS.map((section) => ({
        ...section,
        articles: resolveEditorialArticleLinks(section.articleLinks),
        calculators: resolveEditorialCalculatorLinks(section.calculatorLinks),
    })).filter((section) => section.articles.length > 0 || section.calculators.length > 0);
    const supplementaryGuideTools = resolveEditorialCalculatorLinks(SUPPLEMENTARY_GUIDE_CALCULATOR_LINKS);

    const latestArticleDate = articles.reduce((latest, article) => {
        const current = new Date(article.updatedAt ?? article.publishedAt).getTime();
        return current > latest ? current : latest;
    }, 0);

    const structuredData = [
        {
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
                    name: "Rehber",
                    item: `${SITE_URL}/rehber`,
                },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${SITE_NAME} Rehber`,
            url: `${SITE_URL}/rehber`,
            description: "Maaş, finans, kredi, vergi ve yaşam hesaplamaları hakkında güncel rehberler.",
            inLanguage: "tr-TR",
            dateModified: latestArticleDate ? new Date(latestArticleDate).toISOString() : undefined,
            mainEntity: {
                "@type": "ItemList",
                numberOfItems: articles.length,
                itemListElement: articles.map((article, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${SITE_URL}/rehber/${article.slug}`,
                    name: article.title,
                })),
            },
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${SITE_NAME} Rehber`,
            url: `${SITE_URL}/rehber`,
            description: "Maaş, finans, kredi, vergi ve yaşam hesaplamaları hakkında güncel rehberler.",
            inLanguage: "tr-TR",
            author: {
                "@type": "Organization",
                name: SITE_EDITOR_NAME,
                url: `${SITE_URL}/hakkimizda`,
            },
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
            },
            blogPost: articles.map((article) => ({
                "@type": "BlogPosting",
                headline: article.title,
                description: article.description,
                url: `${SITE_URL}/rehber/${article.slug}`,
                datePublished: article.publishedAt,
                dateModified: article.updatedAt ?? article.publishedAt,
                articleSection: article.category,
            })),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            {/* Hero */}
            <div className="mb-16 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-4">
                    Rehber & İpuçları
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Hesaplamalar Hakkında Her Şey
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Maaş, kredi, yatırım, vergi ve günlük kararlar için anlaşılır rehberler. Konuyu öğrenin, ardından
                    hesaplayıcımızla sonucunuzu anında alın.
                </p>
                <p className="mt-4 text-sm text-slate-600 max-w-2xl mx-auto">
                    Tüm içerikler {SITE_EDITOR_NAME} tarafından düzenli olarak gözden geçirilir ve ilgili hesaplama sayfalarıyla birlikte güncellenir.
                </p>
            </div>

            {guideLandingSections.length > 0 && (
                <section className="mb-16">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Rehber Rotaları
                            </h2>
                            <p className="mt-2 max-w-3xl text-slate-600">
                                Önce konuyu okuyup sonra doğru hesaplama ekranına geçmek isteyen kullanıcılar için rehber kümelerini ve en çok açılan araçları birlikte topladık.
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Bağlamsal ve kanonik geçişler
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {guideLandingSections.map((section) => (
                            <article
                                key={section.id}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {section.eyebrow}
                                </p>
                                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                                    {section.title}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {section.description}
                                </p>

                                {section.articles.length > 0 && (
                                    <div className="mt-5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Önce rehberler
                                        </p>
                                        <div className="mt-3 space-y-3">
                                            {section.articles.map((article) => (
                                                <TrackedLink
                                                    key={article.slug}
                                                    href={article.href}
                                                    analytics={{
                                                        source_type: "guide_landing_cluster",
                                                        source_section: section.id,
                                                        target_slug: article.slug,
                                                        target_kind: "guide",
                                                    }}
                                                    className="group block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF7F3]"
                                                >
                                                    <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                                        {article.title}
                                                    </p>
                                                    <p className="mt-2 text-xs leading-6 text-slate-600">
                                                        {article.blurb}
                                                    </p>
                                                </TrackedLink>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {section.calculators.length > 0 && (
                                    <div className="mt-5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Ardından hesapla
                                        </p>
                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {section.calculators.map((item) => (
                                                <TrackedLink
                                                    key={item.slug}
                                                    href={item.href}
                                                    analytics={{
                                                        source_type: "guide_landing_cluster",
                                                        source_section: section.id,
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
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {supplementaryGuideTools.length > 0 && (
                <section className="mb-16 rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                    <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                Ek Planlama Araçları
                            </h2>
                            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                                Rehber okumayı yatırım ve takvim tarafındaki pratik araçlarla tamamlamak isteyen kullanıcılar için ikinci öncelikli ama değerli birkaç ekranı burada topladık.
                            </p>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Destekleyici kanonik linkler
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {supplementaryGuideTools.map((item) => (
                            <TrackedLink
                                key={item.slug}
                                href={item.href}
                                analytics={{
                                    source_type: "guide_supporting_tools",
                                    target_slug: item.slug,
                                    target_category: item.category,
                                    target_kind: "calculator",
                                }}
                                className="group rounded-2xl border border-slate-200 bg-white px-4 py-4 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF7F3]"
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
                </section>
            )}

            {/* Makale Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => {
                    const featuredCalculatorSection = getArticleFeaturedCalculatorSection(
                        article.slug,
                        article.relatedCalculators
                    );
                    const related = featuredCalculatorSection?.links.slice(0, 3) ?? [];

                    return (
                        <article
                            key={article.slug}
                            className="group bg-card border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col"
                        >
                            {/* Üst Kısım */}
                            <div className="flex items-center justify-between mb-3">
                                <Link
                                    href={getCategoryPath(article.categorySlug)}
                                    className={`text-xs font-semibold rounded-full px-3 py-1 transition-opacity hover:opacity-80 ${categoryColors[article.category] ?? "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {article.category}
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                    {article.readingTime} dk okuma
                                </span>
                            </div>

                            {/* Başlık & Açıklama */}
                            <Link href={`/rehber/${article.slug}`} className="flex-1">
                                <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                                    {article.title}
                                </h2>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {article.description}
                                </p>
                                <p className="mt-3 text-xs text-slate-500">
                                    Güncelleme: {new Date(article.updatedAt ?? article.publishedAt).toLocaleDateString("tr-TR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </Link>

                            {/* İlgili Araçlar */}
                            {related.length > 0 && (
                                <div className="mt-5 pt-4 border-t border-border/60">
                                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                        İlgili Araçlar
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {related.map((item) => (
                                            <TrackedLink
                                                key={item.slug}
                                                href={item.href}
                                                analytics={{
                                                    source_type: "guide_card_related_tools",
                                                    source_slug: article.slug,
                                                    target_slug: item.slug,
                                                    target_category: item.category,
                                                    target_kind: "calculator",
                                                }}
                                                className="inline-flex items-center text-xs bg-primary/10 text-primary rounded-lg px-2.5 py-1 hover:bg-primary/20 transition-colors"
                                            >
                                                {item.label}
                                            </TrackedLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>

            <div className="mt-12">
                <FeaturedTools variant="guide" maxItems={8} />
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
        </div>
    );
}
