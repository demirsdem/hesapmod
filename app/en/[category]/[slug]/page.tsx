import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import SchemaScripts from "@/components/SchemaScripts";
import MedicalDisclaimer from "@/components/health/MedicalDisclaimer";
import { renderRichText } from "@/lib/rich-text";
import { findCalculatorByRoute } from "@/lib/calculators";
import { getCalculatorTrustInfo } from "@/lib/calculator-trust";
import {
    englishCalculatorRoutes,
    findEnglishCalculatorRoute,
    getEnglishCalculatorAlternates,
    getEnglishCalculatorPath,
    getEnglishRouteFaqEntries,
    getSourceCalculatorPath,
    type EnglishCalculatorRoute,
} from "@/lib/calculator-source-en";
import { SITE_URL } from "@/lib/site";

const CalculatorEngine = dynamic(() => import("@/components/calculator/CalculatorEngine"));

type PageParams = {
    category: string;
    slug: string;
};

function getEnglishRoute(params: PageParams) {
    return findEnglishCalculatorRoute(params.category, params.slug);
}

function getRelatedRoutes(route: EnglishCalculatorRoute) {
    return route.relatedRoutes
        .map((relatedRoute) => findEnglishCalculatorRoute(relatedRoute.category, relatedRoute.slug))
        .filter((candidate): candidate is EnglishCalculatorRoute => Boolean(candidate));
}

export async function generateStaticParams() {
    return englishCalculatorRoutes.map((route) => ({
        category: route.category,
        slug: route.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: PageParams;
}): Promise<Metadata> {
    const route = getEnglishRoute(params);

    if (!route) {
        return {
            title: "Not Found | HesapMod",
        };
    }

    return {
        title: route.seo.title,
        description: route.seo.description,
        alternates: getEnglishCalculatorAlternates(route),
        openGraph: {
            title: route.seo.title,
            description: route.seo.description,
            url: `${SITE_URL}${getEnglishCalculatorPath(route)}`,
            type: "website",
            locale: "en_US",
        },
    };
}

export default function EnglishCalculatorPage({
    params,
}: {
    params: PageParams;
}) {
    const route = getEnglishRoute(params);

    if (!route) {
        notFound();
    }

    const calculator = findCalculatorByRoute(route.sourceSlug, route.sourceCategory);
    if (!calculator) {
        notFound();
    }

    const trustInfo = getCalculatorTrustInfo(calculator.slug, calculator.category);
    const pageUrl = `${SITE_URL}${getEnglishCalculatorPath(route)}`;
    const relatedRoutes = getRelatedRoutes(route);
    const faqEntries = getEnglishRouteFaqEntries(route);

    return (
        <div className="mx-auto max-w-5xl px-4 py-12" lang="en">
            <SchemaScripts
                calculator={{
                    ...calculator,
                    seo: {
                        ...calculator.seo,
                        title: {
                            ...calculator.seo.title,
                            en: route.seo.title,
                        },
                        metaDescription: {
                            ...calculator.seo.metaDescription,
                            en: route.seo.description,
                        },
                        content: {
                            ...calculator.seo.content,
                            en: route.seo.content,
                        },
                        faq: faqEntries,
                    },
                    h1: {
                        tr: calculator.h1?.tr ?? calculator.name.tr,
                        en: route.h1,
                    },
                    name: {
                        ...calculator.name,
                        en: route.name,
                    },
                    shortDescription: {
                        tr: calculator.shortDescription?.tr ?? calculator.description.tr,
                        en: route.shortDescription,
                    },
                }}
                lang="en"
                trustInfo={trustInfo}
                pageTitle={route.h1}
                pageDescription={route.seo.description}
                pageUrl={pageUrl}
                categoryNameOverride={route.categoryLabel}
                categoryUrlOverride={`${SITE_URL}/en/${route.category}`}
            />

            <nav
                aria-label="Breadcrumb"
                className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
            >
                <Link href="/en" className="transition-colors hover:text-[#CC4A1A]">
                    Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href={`/en/${route.category}`} className="transition-colors hover:text-[#CC4A1A]">
                    {route.categoryLabel}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-slate-900">{route.name}</span>
            </nav>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#CC4A1A]">
                    {route.categoryLabel}
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {route.h1}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                    {route.shortDescription}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <Link
                        href={getSourceCalculatorPath(route)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
                    >
                        View Turkish version
                    </Link>
                </div>
            </section>

            <div className="mt-10">
                <CalculatorEngine
                    calculator={{
                        slug: calculator.slug,
                        category: calculator.category,
                        name: {
                            ...calculator.name,
                            en: route.name,
                        },
                        inputs: calculator.inputs,
                        results: calculator.results,
                    }}
                    lang="en"
                />
            </div>

            {route.category === "health-calculator" && (
                <div className="mt-6">
                    <MedicalDisclaimer lang="en" />
                </div>
            )}

            <section className="mt-12 prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
                <div
                    className="text-lg leading-relaxed text-slate-600"
                    dangerouslySetInnerHTML={{
                        __html: renderRichText(route.seo.content),
                    }}
                />
            </section>

            {route.seo.faq.length > 0 && (
                <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="mt-6 space-y-4">
                        {route.seo.faq.map((item) => (
                            <article
                                key={item.q}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                            >
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {item.q}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {item.a}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {relatedRoutes.length > 0 && (
                <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Related Calculators
                    </h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {relatedRoutes.map((relatedRoute) => (
                            <Link
                                key={relatedRoute.slug}
                                href={getEnglishCalculatorPath(relatedRoute)}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-[#FFD7C7] hover:bg-white hover:shadow-sm"
                            >
                                <p className="text-sm font-semibold text-[#CC4A1A]">
                                    {relatedRoute.categoryLabel}
                                </p>
                                <p className="mt-2 text-lg font-bold text-slate-900">
                                    {relatedRoute.name}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {relatedRoute.shortDescription}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
