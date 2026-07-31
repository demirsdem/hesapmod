import { articles, getArticleBySlug, getAllArticleSlugs } from "@/lib/articles";
import { getCategoryPath } from "@/lib/categories";
import { getArticleFeaturedCalculatorSection } from "@/lib/editorial-hubs";
import { SITE_EDITOR_NAME, SITE_NAME, SITE_PUBLISHER_LOGO_URL, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditorialQualityBlock from "@/components/calculator/EditorialQualityBlock";
import TrackedLink from "@/components/analytics/TrackedLink";
import UnemploymentCalculatorQuickCard from "@/components/guides/UnemploymentCalculatorQuickCard";
import UnemploymentEligibilityCheck from "@/components/guides/UnemploymentEligibilityCheck";
import type { Metadata } from "next";

function formatDateLabel(date: string) {
    return new Date(date).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function getWordCount(content: string) {
    const plainText = content
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return plainText.length > 0 ? plainText.split(" ").length : 0;
}

export async function generateStaticParams() {
    return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const article = getArticleBySlug(params.slug);
    if (!article) return {};
    const metadataTitle = article.metaTitle ?? article.title;
    return {
        title: metadataTitle,
        description: article.description,
        keywords: article.keywords.join(", "),
        alternates: { canonical: `/rehber/${article.slug}` },
        openGraph: {
            title: metadataTitle,
            description: article.description,
            url: `${SITE_URL}/rehber/${article.slug}`,
            type: "article",
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt ?? article.publishedAt,
            authors: [SITE_EDITOR_NAME],
            siteName: SITE_NAME,
        },
    };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const article = getArticleBySlug(params.slug);
    if (!article) notFound();

    const articleUrl = `${SITE_URL}/rehber/${article.slug}`;
    const modifiedAt = article.updatedAt ?? article.publishedAt;
    const wordCount = getWordCount(article.content);
    const showUnemploymentEligibilityCheck = article.slug === "issizlik-maasi-ne-kadar-2026";
    const articleDisplayTitle = article.title;
    const articleMetaTitle = article.metaTitle ?? article.title;

    const featuredCalculatorSection = getArticleFeaturedCalculatorSection(
        article.slug,
        article.relatedCalculators
    );

    // Diğer makaleler (sidebar için)
    const otherArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 4);
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
                {
                    "@type": "ListItem",
                    position: 3,
                    name: articleDisplayTitle,
                    item: articleUrl,
                },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": articleUrl,
            name: articleMetaTitle,
            url: articleUrl,
            description: article.description,
            inLanguage: "tr-TR",
            isPartOf: {
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
            },
            breadcrumb: {
                "@id": `${articleUrl}#breadcrumb`,
            },
            datePublished: article.publishedAt,
            dateModified: modifiedAt,
        },
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: articleDisplayTitle,
            description: article.description,
            datePublished: article.publishedAt,
            dateModified: modifiedAt,
            articleSection: article.category,
            keywords: article.keywords.join(", "),
            wordCount,
            inLanguage: "tr-TR",
            isAccessibleForFree: true,
            url: articleUrl,
            mainEntityOfPage: {
                "@type": "WebPage",
                "@id": articleUrl,
            },
            image: `${SITE_URL}/opengraph-image`,
            author: {
                "@type": "Organization",
                name: SITE_EDITOR_NAME,
                url: `${SITE_URL}/hakkimizda`,
            },
            editor: SITE_EDITOR_NAME,
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: {
                    "@type": "ImageObject",
                    url: SITE_PUBLISHER_LOGO_URL,
                },
            },
            about: article.keywords.map((keyword) => ({
                "@type": "Thing",
                name: keyword,
            })),
            ...(article.trustInfo?.sources?.some((source) => source.href)
                ? {
                    citation: article.trustInfo.sources
                        .map((source) => source.href)
                        .filter(Boolean),
                }
                : {}),
            ...(article.trustInfo?.editorName
                ? {
                    reviewedBy: {
                        "@type": "Organization",
                        name: article.trustInfo.editorName,
                    },
                }
                : {}),
        },
        ...(article.faq && article.faq.length > 0
            ? [{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: article.faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.answer,
                    },
                })),
            }]
            : []),
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                {/* Ana İçerik */}
                <main>
                    {/* Breadcrumb */}
                    <nav aria-label="Gezinti izi" className="text-sm text-muted-foreground flex items-center gap-2 mb-8 flex-wrap">
                        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                        <span aria-hidden>›</span>
                        <Link href="/rehber" className="hover:text-primary transition-colors">Rehber</Link>
                        <span aria-hidden>›</span>
                        <span className="text-foreground">{article.title}</span>
                    </nav>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-4">
                        <Link
                            href={getCategoryPath(article.categorySlug)}
                            className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1 transition-colors hover:bg-primary/15"
                        >
                            {article.category}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            Yayın: {formatDateLabel(article.publishedAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">· Son güncelleme: {formatDateLabel(modifiedAt)}</span>
                        <span className="text-xs text-muted-foreground">· {article.readingTime} dk okuma</span>
                    </div>

                    {/* Başlık */}
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                        {article.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 leading-relaxed">{article.description}</p>

                    {showUnemploymentEligibilityCheck && (
                        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm font-medium leading-6 text-blue-950">
                            2026 güncel hesaplama: İşsizlik ödeneği, son 4 aylık prime esas brüt kazancın %40'ı üzerinden hesaplanır ve brüt asgari ücretin %80'i ile sınırlıdır. Son kontrol: Mayıs 2026.
                        </div>
                    )}

                    {showUnemploymentEligibilityCheck && <UnemploymentCalculatorQuickCard />}

                    <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        Bu içerik {formatDateLabel(modifiedAt)} tarihinde {SITE_EDITOR_NAME} tarafından gözden geçirilmiş ve ilgili hesaplama araçlarıyla uyumlu olacak şekilde güncellenmiştir.
                    </div>

                    {article.trustInfo && <EditorialQualityBlock trustInfo={article.trustInfo} />}

                    {showUnemploymentEligibilityCheck && <UnemploymentEligibilityCheck />}

                    {/* Makale İçeriği */}
                    <article
                        className="prose prose-slate dark:prose-invert max-w-none
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-p:leading-relaxed prose-p:text-muted-foreground
                            prose-ul:text-muted-foreground prose-li:my-1
                            prose-table:text-sm prose-thead:bg-muted/50
                            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* İlgili Hesap Makineleri CTA */}
                    {featuredCalculatorSection && featuredCalculatorSection.links.length > 0 && (
                        <section className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6">
                            <h2 className="text-lg font-bold mb-4">
                                {featuredCalculatorSection.title}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                {featuredCalculatorSection.description}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {featuredCalculatorSection.links.map((item) => (
                                    <TrackedLink
                                        key={item.slug}
                                        href={item.href}
                                        analytics={{
                                            source_type: "guide_detail_featured_tools",
                                            source_slug: article.slug,
                                            target_slug: item.slug,
                                            target_category: item.category,
                                            target_kind: "calculator",
                                        }}
                                        className="group block bg-card border rounded-xl px-4 py-3 hover:border-primary/50 hover:shadow-sm transition-all"
                                    >
                                        <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 text-xs leading-6 text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </TrackedLink>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        {/* Diğer Rehberler */}
                        <div className="bg-card border rounded-2xl p-5">
                            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                                Diğer Rehberler
                            </h3>
                            <ul className="space-y-3">
                                {otherArticles.map((a) => (
                                    <li key={a.slug}>
                                        <Link
                                            href={`/rehber/${a.slug}`}
                                            className="text-sm font-medium hover:text-primary transition-colors leading-snug line-clamp-2 block"
                                        >
                                            {a.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/rehber"
                                className="mt-4 block text-xs text-primary hover:underline"
                            >
                                Tüm rehberleri gör →
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
