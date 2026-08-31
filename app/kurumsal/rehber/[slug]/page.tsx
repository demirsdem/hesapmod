import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CorporateGuidePage from "@/components/corporate/CorporateGuidePage";
import { CORPORATE_GUIDE_BASE_PATH, corporateGuideSlugs, getCorporateGuide } from "@/lib/corporate-guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return corporateGuideSlugs.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const guide = getCorporateGuide(slug);
    if (!guide) return {};
    const url = `${SITE_URL}${CORPORATE_GUIDE_BASE_PATH}/${guide.slug}`;
    return { title: { absolute: `${guide.title} | ${SITE_NAME}` }, description: guide.description, alternates: { canonical: url }, robots: { index: true, follow: true }, openGraph: { title: guide.title, description: guide.description, url, siteName: SITE_NAME, type: "article", locale: "tr_TR", publishedTime: "2026-08-31", modifiedTime: "2026-08-31", images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: guide.title }] }, twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: [`${SITE_URL}/opengraph-image`] } };
}
export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) { const guide = getCorporateGuide((await params).slug); if (!guide) notFound(); return <CorporateGuidePage guide={guide} />; }
