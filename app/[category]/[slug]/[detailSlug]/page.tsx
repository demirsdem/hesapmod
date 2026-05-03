import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import EditorialQualityBlock from "@/components/calculator/EditorialQualityBlock";
import PseoSiblingLinks from "@/components/calculator/PseoSiblingLinks";
import SchemaScripts from "@/components/SchemaScripts";
import { getCategoryName, getCategoryPath, normalizeCategorySlug } from "@/lib/categories";
import {
    findCalculatorByRoute,
    normalizeCalculatorSlug,
} from "@/lib/calculators";
import { getCalculatorTrustInfo } from "@/lib/calculator-trust";
import {
    generateDynamicPseoContent,
    generateDynamicPseoDescription,
} from "@/lib/pseo-content-generator";
import { getBuildTimePseoRoutes } from "@/lib/pseo-generators";
import {
    findPseoRoute,
    getPseoBreadcrumbLabel,
    getPseoGuideHeading,
    getPseoHeroParagraph,
    getPseoPageHeading,
    getPseoTitle,
    isLoanPseoRoute,
    type PseoRoute,
} from "@/lib/pseo-data";
import { renderRichText } from "@/lib/rich-text";
import { SITE_URL } from "@/lib/site";

const CalculatorEngine = dynamic(() => import("@/components/calculator/CalculatorEngine"));

export const revalidate = 86400;
export const dynamicParams = true;

type PageParams = {
    category: string;
    slug: string;
    detailSlug: string;
};

function getPseoRouteFromParams(params: PageParams) {
    const normalizedCategory = normalizeCategorySlug(params.category);
    const normalizedSlug = normalizeCalculatorSlug(params.slug);

    return {
        normalizedCategory,
        normalizedSlug,
        route: findPseoRoute(normalizedCategory, normalizedSlug, params.detailSlug),
    };
}

function getPrefilledValues(route: PseoRoute): Record<string, string | number> {
    if (isLoanPseoRoute(route)) {
        return {
            amount: route.amount,
            months: route.term,
        };
    }

    return {
        calcType: "grossToNet",
        salary: route.amount,
    };
}

export async function generateStaticParams() {
    return getBuildTimePseoRoutes(100).map((route) => ({
        category: route.category,
        slug: route.parentSlug,
        detailSlug: route.detailSlug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: PageParams;
}): Promise<Metadata> {
    const { normalizedCategory, normalizedSlug, route } = getPseoRouteFromParams(params);

    if (!route) {
        return {
            title: "Bulunamadı | HesapMod",
        };
    }

    const title = getPseoTitle(route);
    const description = generateDynamicPseoDescription(
        normalizedCategory,
        normalizedSlug,
        route.amount,
        isLoanPseoRoute(route) ? route.term : undefined
    );
    const canonicalPath = `/${normalizedCategory}/${normalizedSlug}/${route.detailSlug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}${canonicalPath}`,
            type: "website",
        },
    };
}

export default function PseoCalculatorPage({
    params,
}: {
    params: PageParams;
}) {
    const { normalizedCategory, normalizedSlug, route } = getPseoRouteFromParams(params);

    if (normalizedCategory !== params.category || normalizedSlug !== params.slug) {
        if (!route) {
            notFound();
        }

        permanentRedirect(`/${normalizedCategory}/${normalizedSlug}/${params.detailSlug}`);
    }

    if (!route) {
        notFound();
    }

    const calculator = findCalculatorByRoute(normalizedSlug, normalizedCategory);
    if (!calculator) {
        notFound();
    }

    const title = getPseoTitle(route);
    const description = generateDynamicPseoDescription(
        normalizedCategory,
        normalizedSlug,
        route.amount,
        isLoanPseoRoute(route) ? route.term : undefined
    );
    const categoryName = getCategoryName(calculator.category);
    const trustInfo = getCalculatorTrustInfo(calculator.slug, calculator.category);
    const pageUrl = `${SITE_URL}/${normalizedCategory}/${normalizedSlug}/${route.detailSlug}`;
    const prefilledValues = getPrefilledValues(route);
    const heroHeading = getPseoPageHeading(route, calculator.name.tr);
    const heroParagraph = getPseoHeroParagraph(route, calculator.name.tr);
    const guideHeading = getPseoGuideHeading(route, calculator.name.tr);
    const dynamicPseoContent = generateDynamicPseoContent(
        normalizedCategory,
        normalizedSlug,
        route.amount,
        isLoanPseoRoute(route) ? route.term : undefined
    );

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <SchemaScripts
                calculator={calculator}
                trustInfo={trustInfo}
                pageTitle={title.replace(" | HesapMod", "")}
                pageDescription={description}
                pageUrl={pageUrl}
            />

            <div className="mb-8">
                <nav
                    aria-label="Gezinti izi"
                    className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
                >
                    <Link href="/" className="transition-colors hover:text-primary">
                        Ana Sayfa
                    </Link>
                    <span aria-hidden="true">›</span>
                    <Link
                        href={getCategoryPath(calculator.category)}
                        className="transition-colors hover:text-primary"
                    >
                        {categoryName}
                    </Link>
                    <span aria-hidden="true">›</span>
                    <Link
                        href={`/${calculator.category}/${calculator.slug}`}
                        className="transition-colors hover:text-primary"
                    >
                        {calculator.name.tr}
                    </Link>
                    <span aria-hidden="true">›</span>
                    <span className="text-slate-900">
                        {getPseoBreadcrumbLabel(route)}
                    </span>
                </nav>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                    {heroHeading}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                    {heroParagraph}
                </p>
            </div>

            <CalculatorEngine
                calculator={{
                    slug: calculator.slug,
                    category: calculator.category,
                    name: calculator.name,
                    inputs: calculator.inputs,
                    results: calculator.results,
                }}
                lang="tr"
                initialValues={prefilledValues}
            />

            {isLoanPseoRoute(route) && (
                <PseoSiblingLinks
                    currentAmount={route.amount}
                    currentTerm={route.term}
                    slug={route.parentSlug}
                    category={route.category}
                />
            )}

            <section className="mt-12 prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
                <div
                    className="text-lg leading-relaxed text-slate-600"
                    dangerouslySetInnerHTML={{
                        __html: renderRichText(dynamicPseoContent),
                    }}
                />
            </section>

            <section
                aria-labelledby="pseo-seo-content-heading"
                className="mt-12 prose prose-slate max-w-none border-t border-slate-200 pt-12"
            >
                <h2
                    id="pseo-seo-content-heading"
                    className="mb-6 text-3xl font-bold text-slate-900"
                >
                    {guideHeading}
                </h2>
                <div
                    className="text-lg leading-relaxed text-slate-600"
                    dangerouslySetInnerHTML={{
                        __html: renderRichText(calculator.seo.content.tr),
                    }}
                />
            </section>

            <EditorialQualityBlock trustInfo={trustInfo} />
        </div>
    );
}
