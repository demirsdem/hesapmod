import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import {
    GOLD_CANONICAL_URL,
    GOLD_EDITORIAL_REVIEW_DATE,
    GOLD_PAGE_DESCRIPTION,
    GOLD_PAGE_TITLE,
    goldFaqItems,
} from "@/lib/gold/goldSeoContent";

type JsonLd = Record<string, unknown>;

export function serializeGoldJsonLd(schema: JsonLd) {
    return JSON.stringify(schema)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

export function buildGoldStructuredData(cache: GoldPriceCache | null): JsonLd[] {
    const dateModified = cache?.updatedAt ?? GOLD_EDITORIAL_REVIEW_DATE;

    return [
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Altın Hesaplama Aracı",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: GOLD_CANONICAL_URL,
            description: "Gram altın, çeyrek altın, 22 ayar bilezik, cumhuriyet altını ve ons altın değerini canlı alış/satış fiyatlarıyla TL karşılığıyla hesaplayan ücretsiz araç.",
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TRY",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: GOLD_PAGE_TITLE,
            url: GOLD_CANONICAL_URL,
            description: GOLD_PAGE_DESCRIPTION,
            inLanguage: "tr-TR",
            dateModified,
            lastReviewed: GOLD_EDITORIAL_REVIEW_DATE,
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://www.hesapmod.com/" },
                { "@type": "ListItem", position: 2, name: "Finansal Hesaplamalar", item: "https://www.hesapmod.com/kategori/finansal-hesaplamalar" },
                { "@type": "ListItem", position: 3, name: "Altın Hesaplama", item: GOLD_CANONICAL_URL },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: goldFaqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                },
            })),
        },
        {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Altın Hesaplama Nasıl Yapılır?",
            description: "Altın türü, işlem yönü ve miktar girerek yaklaşık TL karşılığını hesaplama adımları.",
            inLanguage: "tr-TR",
            mainEntityOfPage: GOLD_CANONICAL_URL,
            step: [
                { "@type": "HowToStep", position: 1, name: "Mod seç", text: "Altından TL'ye, TL'den altına, bozdurma, makas veya portföy modunu seçin." },
                { "@type": "HowToStep", position: 2, name: "Altın türünü seç", text: "Gram altın, çeyrek altın, bilezik veya cumhuriyet altını gibi ürün türünü belirleyin." },
                { "@type": "HowToStep", position: 3, name: "Miktar veya TL tutarı gir", text: "Hesaplamak istediğiniz gram, adet ya da TL tutarını yazın." },
                { "@type": "HowToStep", position: 4, name: "Sonucu oku", text: "Yaklaşık TL karşılığı, alınabilecek altın miktarı veya alış-satış makasını inceleyin." },
            ],
        },
    ];
}
