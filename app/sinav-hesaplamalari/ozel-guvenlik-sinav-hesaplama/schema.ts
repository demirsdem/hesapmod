import { SITE_URL } from "@/lib/site";

export type OggFaqItem = {
    question: string;
    answer: string;
};

export const pageUrl = `${SITE_URL}/sinav-hesaplamalari/ozel-guvenlik-sinav-hesaplama`;

export const oggFaqItems: OggFaqItem[] = [
    {
        question: "Özel güvenlik sınavı geçme notu kaç?",
        answer: "Silahsız ÖGG için 100 soruluk temel eğitim sınavında en az 60 puan gerekir. Silahlı ÖGG için temel eğitim puanı ile silah sınavı puanı ortalamasının en az 60 olması beklenir.",
    },
    {
        question: "Silahlı ÖGG sınav puanı nasıl hesaplanır?",
        answer: "Temel eğitim 100 puan üzerinden alınır. Silah bilgisi doğru sayısı 2 ile, atış isabeti 10 ile çarpılır. Silah bilgisi ve atış toplamı silah puanını verir; genel sonuç (Temel Eğitim + Silah Puanı) / 2 formülüyle hesaplanır.",
    },
    {
        question: "Temel eğitimden 60 alıp silahlı ortalamayı tutturamazsam ne olur?",
        answer: "Temel eğitim puanı 60 veya üzerindeyse fakat silahlı ortalama 60'ın altında kalıyorsa sonuç silahsız sertifika yönünde yorumlanır. Nihai belge süreci resmi duyuru ve kurs kayıtlarına göre yürür.",
    },
    {
        question: "ÖGG sınavında yanlışlar doğruları götürür mü?",
        answer: "Hayır. ÖGG sınavlarında yanlış cevaplar doğru cevapları düşürmez. Puan doğru cevap ve atış isabeti üzerinden hesaplanır.",
    },
    {
        question: "Özel güvenlik sınavı soru sayısı kaçtır?",
        answer: "Temel eğitim yazılı sınavı 100 sorudur. Silahlı adaylarda buna ek olarak 25 soruluk silah bilgisi ve 5 atışlık uygulamalı bölüm bulunur.",
    },
    {
        question: "ÖGG sınavı 2026 tarihleri nereden takip edilir?",
        answer: "2026 sınav takvimi ve duyuruları için Emniyet Genel Müdürlüğü Özel Güvenlik Denetleme Başkanlığı duyuruları esas alınmalıdır.",
    },
];

export const oggSchemas: Array<Record<string, unknown>> = [
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "ÖGG Sınav Puanı Hesaplama",
        url: pageUrl,
        applicationCategory: "EducationApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0" },
        description: "EGM Özel Güvenlik Görevlisi sınav puanı hesaplama aracı",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: oggFaqItems.map((item) => ({
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
                name: "Sınav",
                item: `${SITE_URL}/kategori/sinav-hesaplamalari`,
            },
            { "@type": "ListItem", position: 3, name: "ÖGG Sınav Hesaplama" },
        ],
    },
];

export function serializeJsonLd(schema: Record<string, unknown>) {
    return JSON.stringify(schema)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}
