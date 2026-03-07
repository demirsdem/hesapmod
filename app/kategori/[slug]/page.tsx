import { calculators } from "@/lib/calculators";
import { getCategoryBySlug, getCategoryPath, mainCategories, normalizeCategorySlug } from "@/lib/categories";
import { generateCategorySchema } from "@/lib/seo";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";

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
    const categoryName = cat.name.tr.toLocaleLowerCase("tr-TR");
    return {
        title: `${cat.name.tr} Hesaplama Araçları`,
        description: `${cat.description.tr} Tüm ${categoryName} hesaplama araçları burada.`,
        alternates: { canonical: getCategoryPath(cat.slug) },
    };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const normalizedSlug = normalizeCategorySlug(params.slug);
    if (normalizedSlug !== params.slug) {
        redirect(getCategoryPath(normalizedSlug));
    }

    const cat = getCategoryBySlug(normalizedSlug);
    if (!cat) notFound();

    const catCalcs = calculators.filter((c) => c.category === cat.slug);
    const schemas = generateCategorySchema(cat.slug, "tr");

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            {/* JSON-LD Schemas */}
            {schemas && (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionSchema) }}
                    />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
                    />
                    {schemas.faqSchema && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
                        />
                    )}
                </>
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
                <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
                <ArrowRight size={14} />
                <span className="text-slate-900 font-medium">{cat.name.tr}</span>
            </nav>

            {/* Header */}
            <div className="mb-14">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Calculator className="text-blue-600" size={22} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        {cat.name.tr} Araçları
                    </h1>
                </div>
                <p className="text-xl text-slate-600 max-w-2xl">{cat.description.tr}</p>
            </div>

            {/* Calculator Grid */}
            {catCalcs.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                    <Calculator size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Bu kategoride henüz araç bulunmuyor.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catCalcs.map((calc) => (
                        <Link
                            key={calc.id}
                            href={`/${calc.category}/${calc.slug}`}
                            className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                                <Calculator className="text-slate-500 group-hover:text-blue-600 transition-colors" size={18} />
                            </div>
                            <h2 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                                {calc.name.tr}
                            </h2>
                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                {calc.description.tr}
                            </p>
                            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Hesapla <ArrowRight size={12} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* SEO Content & FAQ Section */}
            {(cat.seoContent || (cat.faq && cat.faq.length > 0)) && (
                <section className="mt-20 pt-16 border-t border-border/50">
                    <div className="max-w-4xl mx-auto">
                        {cat.seoContent && (
                            <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
                                <h2 className="text-3xl font-bold mb-6 text-slate-900">
                                    {cat.name.tr} Nedir?
                                </h2>
                                <p className="text-lg leading-relaxed text-slate-600">
                                    {cat.seoContent.tr}
                                </p>
                            </div>
                        )}

                        {cat.faq && cat.faq.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-900">
                                    Sıkça Sorulan Sorular
                                </h3>
                                <div className="space-y-6">
                                    {cat.faq.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <h4 className="font-bold text-lg mb-3 text-slate-900">
                                                {item.q.tr}
                                            </h4>
                                            <p className="text-slate-600 leading-relaxed">
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

            {/* Back link */}
            <div className="mt-16 pt-8 border-t border-slate-200">
                <Link
                    href="/tum-araclar"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                >
                    Tüm Araçları Gör <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
