// ✅ C-1 FIX: Server Component + metadata export (artık index edilebilir)
import { Metadata } from "next";
import Script from "next/script";
import {
    calculatorCount,
    calculatorSearchIndex,
    calculators,
} from "@/lib/calculators";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import AllToolsClient from "./AllToolsClient";

export const metadata: Metadata = {
    title: "Tüm Hesaplama Araçları — Ücretsiz Online Hesap Makineleri",
    description: `${calculatorCount} ücretsiz hesaplama aracı tek sayfada. Finans, sağlık, matematik ve günlük yaşam kategorilerinde online hesaplama araçları.`,
    alternates: {
        canonical: "/tum-araclar",
    },
    openGraph: {
        title: "Tüm Hesaplama Araçları | HesapMod",
        description: "Finans, sağlık, matematik ve günlük yaşam için ücretsiz hesaplama araçları.",
        url: `${SITE_URL}/tum-araclar`,
    },
};

export default function AllToolsPage() {
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Tüm Hesaplama Araçları",
        url: `${SITE_URL}/tum-araclar`,
        description: `${calculatorCount} ücretsiz hesaplama aracı tek sayfada. Finans, sağlık, matematik ve günlük yaşam kategorilerinde online hesaplama araçları.`,
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: calculatorCount,
            itemListElement: calculators.slice(0, 48).map((calculator, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: calculator.name.tr,
                url: `${SITE_URL}/${calculator.category}/${calculator.slug}`,
            })),
        },
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <Script id="all-tools-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify(itemListSchema),
            }} />

            {/* Header — sunucuda render edilir, SEO için ideal */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Tüm Hesaplama Araçları
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    {calculatorCount} ücretsiz hesaplama aracı tek sayfada.
                </p>
            </div>

            {/* Client bileşen: arama ve filtreleme */}
            <AllToolsClient entries={calculatorSearchIndex} />
        </div>
    );
}
