import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionPage from "@/components/corporate/SolutionPage";
import { businessSolutions, getBusinessSolution } from "@/lib/business-solutions";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return businessSolutions.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const solution = getBusinessSolution(params.slug);
    if (!solution) return {};
    const url = `${SITE_URL}/cozumler/${solution.slug}`;
    return { title: { absolute: `${solution.metadata.title} | ${SITE_NAME}` }, description: solution.metadata.description, alternates: { canonical: url }, openGraph: { title: solution.metadata.title, description: solution.metadata.description, url, siteName: SITE_NAME, type: "website", locale: "tr_TR", images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: solution.title }] }, twitter: { card: "summary_large_image", title: solution.metadata.title, description: solution.metadata.description, images: [`${SITE_URL}/opengraph-image`] } };
}
export default function BusinessSolutionPage({ params }: { params: { slug: string } }) { const solution = getBusinessSolution(params.slug); if (!solution) notFound(); return <SolutionPage solution={solution} />; }
