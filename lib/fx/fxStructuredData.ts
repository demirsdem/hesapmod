import type { FxRateCache } from "@/lib/fx/fxPriceTypes";
import { FX_CANONICAL_URL, FX_LAST_REVIEWED, FX_PAGE_DESCRIPTION, FX_PAGE_TITLE, fxFaqItems } from "@/lib/fx/fxSeoContent";

export function buildFxStructuredData(cache: FxRateCache | null) {
    const dateModified = cache?.updatedAt ?? FX_LAST_REVIEWED;

    return [
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Döviz Hesaplama Aracı",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: FX_CANONICAL_URL,
            description: "Dolar, euro, sterlin ve diğer para birimlerini güncel alış/satış kurlarıyla TL'ye çeviren ücretsiz döviz hesaplama aracı.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: FX_PAGE_TITLE,
            url: FX_CANONICAL_URL,
            description: FX_PAGE_DESCRIPTION,
            inLanguage: "tr-TR",
            dateModified,
            isPartOf: { "@type": "WebSite", name: "HesapMod", url: "https://www.hesapmod.com" },
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://www.hesapmod.com" },
                { "@type": "ListItem", position: 2, name: "Finansal Hesaplamalar", item: "https://www.hesapmod.com/kategori/finansal-hesaplamalar" },
                { "@type": "ListItem", position: 3, name: "Döviz Hesaplama", item: FX_CANONICAL_URL },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: fxFaqItems.map(([question, answer]) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
            })),
        },
        {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Döviz Hesaplama Nasıl Yapılır?",
            description: "Dolar, euro, sterlin ve diğer para birimlerini güncel alış/satış kurlarıyla TL'ye çevirme adımları.",
            totalTime: "PT1M",
            tool: [{ "@type": "HowToTool", name: "HesapMod Döviz Hesaplama Aracı" }],
            step: [
                { "@type": "HowToStep", position: 1, name: "Mod seç", text: "Dövizden TL'ye, TL'den dövize, bozdurma, çapraz kur veya BSMV dahil hesaplama modunu seçin." },
                { "@type": "HowToStep", position: 2, name: "Para birimini seç", text: "Dolar, euro, sterlin veya desteklenen diğer para birimlerinden birini seçin." },
                { "@type": "HowToStep", position: 3, name: "Miktar gir", text: "Çevirmek istediğiniz döviz miktarını veya TL tutarını girin." },
                { "@type": "HowToStep", position: 4, name: "Sonucu oku", text: "Araç, alış/satış kuruna göre yaklaşık TL veya döviz karşılığını gösterir." },
            ],
        },
    ];
}
