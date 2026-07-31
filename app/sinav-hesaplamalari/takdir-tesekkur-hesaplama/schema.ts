import { SITE_URL } from "@/lib/site";

export const pagePath = "/sinav-hesaplamalari/takdir-tesekkur-hesaplama";
export const pageUrl = `${SITE_URL}${pagePath}`;

export const takdirFaqItems = [
    {
        question: "Hesaplama e-Okul ile birebir aynı mı?",
        answer: "Evet. Ders notu haftalık saatle çarpılıp toplam saate bölünerek ağırlıklı ortalama hesaplanır; bu e-Okul sistemiyle aynı yöntemdir.",
    },
    {
        question: "Takdir ve Teşekkür belgesi barajı kaçtır?",
        answer: "70,00-84,99 arası Teşekkür belgesi, 85,00 ve üzeri Takdir belgesi almaya hak kazandırır. Zayıf ders, devamsızlık ve disiplin şartları da ayrıca sağlanmalıdır.",
    },
    {
        question: "Zayıf notum (50 altı) varken belge alabilir miyim?",
        answer: "Hayır. Bir dersten bile 50 altı alınırsa, genel ortalama 95 bile olsa Takdir veya Teşekkür belgesi verilmez.",
    },
    {
        question: "Devamsızlık 5 günü geçerse takdir alınır mı?",
        answer: "Hayır. MEB ödül şartlarına göre özürsüz devamsızlık 5 günü geçmemelidir. 5 gün dahil kabul edilir; 6 ve üzeri gün belge alınmasını engeller.",
    },
    {
        question: "Kınama cezası alırsam belge alabilir miyim?",
        answer: "Hayır. Kınama veya daha ağır disiplin cezası alan öğrenciler, ortalama tutsa bile Takdir veya Teşekkür belgesi alamaz.",
    },
];

export const takdirSchemas = [
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Takdir Teşekkür Hesaplama",
        url: pageUrl,
        applicationCategory: "EducationApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        description:
            "MEB kurallarına göre ağırlıklı not ortalaması, zayıf ders ve devamsızlık kontrolüyle takdir/teşekkür belgesi hesaplama aracı.",
        inLanguage: "tr",
        author: {
            "@type": "Organization",
            name: "HesapMod",
            url: SITE_URL,
        },
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: takdirFaqItems.map((item) => ({
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
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
            {
                "@type": "ListItem",
                position: 2,
                name: "Sınav Hesaplamaları",
                item: `${SITE_URL}/kategori/sinav-hesaplamalari`,
            },
            { "@type": "ListItem", position: 3, name: "Takdir Teşekkür Hesaplama", item: pageUrl },
        ],
    },
];
