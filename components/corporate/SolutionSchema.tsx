import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { BusinessSolution } from "@/lib/business-solutions";

export default function SolutionSchema({ solution }: { solution: BusinessSolution }) {
    const url = `${SITE_URL}/cozumler/${solution.slug}`;
    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "İşletme Çözümleri", item: `${SITE_URL}/cozumler` },
                { "@type": "ListItem", position: 3, name: solution.shortTitle, item: url },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "Service",
            name: solution.title,
            description: solution.metadata.description,
            url,
            serviceType: solution.shortTitle,
            inLanguage: "tr-TR",
            provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            areaServed: { "@type": "Country", name: "Türkiye" },
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: solution.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
        },
    ];

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />;
}
