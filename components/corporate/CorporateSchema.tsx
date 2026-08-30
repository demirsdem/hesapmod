import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { CorporateService } from "@/lib/corporate-services";

export default function CorporateSchema({ service }: { service?: CorporateService }) {
    const path = service ? `/kurumsal/${service.slug}` : "/kurumsal";
    const name = service?.title ?? "HesapMod Kurumsal Yazılım Çözümleri";
    const description = service?.metadata.description ?? "İşletmelere özel web, mobil, masaüstü, entegrasyon, otomasyon ve SaaS çözümleri.";
    const crumbs = [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Kurumsal Yazılım", item: `${SITE_URL}/kurumsal` },
        ...(service ? [{ "@type": "ListItem", position: 3, name: service.shortTitle, item: `${SITE_URL}${path}` }] : []),
    ];
    const schemas = [
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs },
        {
            "@context": "https://schema.org",
            "@type": "Service",
            name,
            description,
            url: `${SITE_URL}${path}`,
            inLanguage: "tr-TR",
            provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            areaServed: { "@type": "Country", name: "Türkiye" },
            ...(service ? { serviceType: service.shortTitle } : {}),
        },
        ...(service ? [{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
        }] : []),
    ];

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />;
}
