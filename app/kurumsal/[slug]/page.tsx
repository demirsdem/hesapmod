import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/corporate/ServicePage";
import { corporateServices, getCorporateService } from "@/lib/corporate-services";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return corporateServices.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const service = getCorporateService(params.slug);
    if (!service) return {};
    const url = `${SITE_URL}/kurumsal/${service.slug}`;
    return { title: { absolute: `${service.metadata.title} | ${SITE_NAME}` }, description: service.metadata.description, alternates: { canonical: url }, openGraph: { title: service.metadata.title, description: service.metadata.description, url, siteName: SITE_NAME, type: "website", locale: "tr_TR", images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: service.title }] }, twitter: { card: "summary_large_image", title: service.metadata.title, description: service.metadata.description, images: [`${SITE_URL}/opengraph-image`] } };
}
export default function CorporateServicePage({ params }: { params: { slug: string } }) { const service = getCorporateService(params.slug); if (!service) notFound(); return <ServicePage service={service} />; }
