import type { FxLongTailPageConfig } from "@/lib/fx/fxLongTailPages";
import type { FxRateCache } from "@/lib/fx/fxPriceTypes";
import { FX_CANONICAL_URL, FX_LAST_REVIEWED, FX_PAGE_DESCRIPTION, FX_PAGE_TITLE, fxFaqItems } from "@/lib/fx/fxSeoContent";

export function buildFxStructuredData(cache: FxRateCache | null, page?: FxLongTailPageConfig) {
    const dateModified = cache?.updatedAt ?? FX_LAST_REVIEWED;

    // page verilmezse hub (doviz-hesaplama) davranisi birebir korunur.
    const pageUrl = page ? `https://www.hesapmod.com/finansal-hesaplamalar/${page.slug}` : FX_CANONICAL_URL;
    const pageTitle = page ? page.title : FX_PAGE_TITLE;
    const pageDescription = page ? page.metaDescription : FX_PAGE_DESCRIPTION;
    const breadcrumbName = page ? page.h1 : "Döviz Hesaplama";
    const faqEntries = page
        ? page.faq
        : fxFaqItems.map(([question, answer]) => ({ question, answer }));

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
            name: pageTitle,
            url: pageUrl,
            description: pageDescription,
            inLanguage: "tr-TR",
            dateModified,
            isPartOf: { "@type": "WebSite", name: "HesapMod", url: "https://www.hesapmod.com" },
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: page
                ? [
                    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://www.hesapmod.com" },
                    { "@type": "ListItem", position: 2, name: "Finansal Hesaplamalar", item: "https://www.hesapmod.com/kategori/finansal-hesaplamalar" },
                    { "@type": "ListItem", position: 3, name: "Döviz Hesaplama", item: FX_CANONICAL_URL },
                    { "@type": "ListItem", position: 4, name: breadcrumbName, item: pageUrl },
                ]
                : [
                    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://www.hesapmod.com" },
                    { "@type": "ListItem", position: 2, name: "Finansal Hesaplamalar", item: "https://www.hesapmod.com/kategori/finansal-hesaplamalar" },
                    { "@type": "ListItem", position: 3, name: "Döviz Hesaplama", item: FX_CANONICAL_URL },
                ],
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqEntries.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
        },
        {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Döviz Hesaplama Nasıl Yapılır?",
            description: "Dolar, euro, sterlin ve diğer para birimlerini güncel alış/satış kurlarıyla TL'ye çevirme adımları.",
            inLanguage: "tr-TR",
            mainEntityOfPage: pageUrl,
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
