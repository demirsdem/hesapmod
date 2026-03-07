import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { mainCategories } from "@/lib/categories";
import { ABOUT_PAGE_LAST_MODIFIED, formatDateLabel } from "@/lib/content-last-modified";
import { calculatorCount } from "@/lib/calculators";
import { CONTACT_FORM_PATH, CONTACT_RESPONSE_SLA } from "@/lib/contact";
import { SITE_EDITOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
    title: "Hakkımızda",
    description: "HesapMod kim tarafından hazırlanır, araçlar nasıl güncellenir ve hangi yayın ilkeleriyle çalışır? Şeffaflık, doğruluk ve gizlilik yaklaşımımızı inceleyin.",
    alternates: { canonical: "/hakkimizda" },
    robots: { index: true, follow: true },
};

const lastUpdatedLabel = formatDateLabel(ABOUT_PAGE_LAST_MODIFIED);

const stats = [
    { value: String(calculatorCount), label: "Canlı Hesaplayıcı" },
    { value: String(mainCategories.length), label: "Ana Kategori" },
    { value: CONTACT_RESPONSE_SLA, label: "Geri Bildirim Hedefi" },
];

const transparencyCards = [
    {
        title: "Kim hazırlıyor?",
        description:
            `${SITE_NAME} üzerindeki hesaplayıcılar ve rehber içerikler ${SITE_EDITOR_NAME} tarafından hazırlanır, yayımlanır ve güncellenir. Kullanıcı geri bildirimleri, formül düzeltmeleri ve mevzuat takibi aynı editoryal akış içinde yönetilir.`,
    },
    {
        title: "Nasıl hazırlanıyor?",
        description:
            "Araçlar; yürürlükteki mevzuat, resmi kurum verileri, yaygın matematiksel yöntemler ve gerekli olduğunda akademik veya teknik referanslar üzerinden modellenir. Yardımcı araçlardan yararlanılsa bile nihai doğruluk kontrolü ve yayın kararı editöryal incelemeyle verilir.",
    },
    {
        title: "Neden yayımlıyoruz?",
        description:
            "Amacımız arama görünürlüğü üretmek değil, kullanıcının tek bir sayfada gerekli hesabı yapıp sonucu anlayabilmesini sağlamaktır. Araçlar ve rehberler, gerçek kullanıcı ihtiyacını çözmek için sade, ölçülebilir ve görev odaklı hazırlanır.",
    },
];

const publishingPrinciples = [
    {
        title: "Kaynak disiplini",
        description:
            "Oran, tavan, eşik, katsayı veya formül gerektiren sayfalarda mümkün olduğunca resmi mevzuat, kurum yayını veya yerleşik hesaplama standardı esas alınır.",
    },
    {
        title: "Güncelleme politikası",
        description:
            "Maaş, vergi, sınav ve benzeri değişken alanlarda önemli bir güncelleme olduğunda ilgili araç ve rehber yeniden gözden geçirilir; gerekli sayfalarda güncelleme tarihi yenilenir.",
    },
    {
        title: "Açıklanabilir hesaplama",
        description:
            "Araçlarımız yalnızca sonuç vermeyi değil, mümkün olduğunda kullanılan mantığı, değişkenleri ve örnek senaryoyu da açıklamayı hedefler.",
    },
    {
        title: "Düzeltme süreci",
        description:
            `Maddi hata, kırık formül veya güncel olmayan veri bildirimi aldığımızda talepler ${CONTACT_FORM_PATH} üzerinden toplanır ve önceliklendirilir. İlk geri dönüş hedefimiz ${CONTACT_RESPONSE_SLA} düzeyindedir.`,
    },
    {
        title: "Editoryal bağımsızlık",
        description:
            "Varsa reklam veya üçüncü taraf entegrasyonları, hesaplama mantığını ve editoryal kararları belirlemez. Bir aracın sıralaması veya görünürlüğü sponsorluk karşılığı değiştirilmez.",
    },
    {
        title: "Şeffaf sorumluluk sınırı",
        description:
            "Finans, sağlık ve hukuki sonuç doğurabilecek konularda sayfalar bilgilendirme amaçlıdır; resmi kurum teyidi veya uzman görüşünün yerini almaz.",
    },
];

const guardrails = [
    {
        title: "Finans, vergi ve maaş araçları",
        description:
            "Vergi dilimi, kesinti, faiz, tazminat veya kredi hesapları pratik bir ön kontrol sağlar. Resmi beyan, sözleşme, banka teklifi veya uzman muhasebe görüşünün yerine geçmez.",
    },
    {
        title: "Sağlık araçları",
        description:
            "VKİ, kalori, ideal kilo ve benzeri sağlık araçları yalnızca genel bilgilendirme içindir. Tanı, tedavi veya tıbbi karar amacıyla kullanılmamalı; gerektiğinde hekim değerlendirmesi alınmalıdır.",
    },
    {
        title: "Sınav, zaman ve günlük yaşam araçları",
        description:
            "Bu araçlar kullanıcı girdisine göre hızlı tahmin veya dönüşüm sağlar. Resmi sonuç belgesi, kurumsal takvim veya bireysel duruma göre sapma olabileceği unutulmamalıdır.",
    },
];

const trustCards = [
    {
        title: "Gizlilik yaklaşımımız",
        description:
            "Hesaplayıcılara girilen değerler mümkün olan durumlarda yalnızca tarayıcı tarafında işlenir. İletişim formu haricinde, kişisel hesap girdi verilerini sunucu tarafında toplama hedefimiz yoktur.",
        href: "/gizlilik-politikasi",
        cta: "Gizlilik politikasını incele",
    },
    {
        title: "İletişim ve düzeltme kanalı",
        description:
            "Hata bildirimi, içerik düzeltmesi, kaynak önerisi veya hukuki/gizlilik talebi için tek resmi kanal iletişim formudur. Talepler kayıt altına alınır ve uygun ekip akışına yönlendirilir.",
        href: CONTACT_FORM_PATH,
        cta: "İletişim formuna git",
    },
    {
        title: "Yasal ve kullanım çerçevesi",
        description:
            "Platformun veri işleme, çerez kullanımı ve kullanım koşulları ayrı yasal sayfalarda açıkça belgelenir. Hakkımızda sayfası bu belgelerin yerine geçmez; tamamlayıcı şeffaflık sayfasıdır.",
        href: "/kvkk",
        cta: "KVKK ve yasal belgeleri gör",
    },
];

const aboutStructuredData = [
    {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": `${SITE_NAME} Hakkında`,
        "url": `${SITE_URL}/hakkimizda`,
        "dateModified": ABOUT_PAGE_LAST_MODIFIED.toISOString().split("T")[0],
        "description": "HesapMod'un kim tarafından hazırlandığını, araçların nasıl güncellendiğini ve yayın ilkelerini açıklayan şeffaflık sayfası.",
        "isPartOf": {
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": SITE_URL,
        },
        "about": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
        },
    },
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "description": "Türkiye odaklı ücretsiz online hesaplama araçları ve açıklayıcı rehberler yayımlayan platform.",
        "areaServed": "TR",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "url": `${SITE_URL}${CONTACT_FORM_PATH}`,
                "availableLanguage": ["Turkish"],
            },
        ],
        "knowsAbout": mainCategories.map((category) => category.name.tr),
    },
];

export default function HakkimizdaPage() {
    return (
        <div className="flex flex-col">
            <section className="w-full border-b bg-gradient-to-b from-primary/5 via-background to-background py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        Hakkımızda
                    </span>
                    <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight md:text-5xl">
                        HesapMod&apos;u neden yayınladığımızı, araçları nasıl hazırladığımızı ve hangi sınırlar içinde çalıştığımızı açıkça anlatıyoruz.
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                        {SITE_NAME}, Türkiye&apos;de günlük, finansal, sınav, zaman ve yaşam odaklı hesaplamaları
                        daha anlaşılır hale getirmek için yayınlanan ücretsiz bir araç platformudur. Bu sayfa,
                        kullanıcıların ve arama motorlarının şu sorulara net yanıt alması için hazırlanmıştır:
                        kim hazırlıyor, nasıl hazırlanıyor ve neden yayınlanıyor?
                    </p>
                    <div className="mt-6 rounded-2xl border bg-card/80 p-4 text-sm text-muted-foreground shadow-sm">
                        Son güncelleme: <strong>{lastUpdatedLabel}</strong> · Bu sayfa kurumsal şeffaflık, yayın ilkeleri,
                        gizlilik yaklaşımı ve geri bildirim süreçlerini özetler.
                    </div>
                </div>
            </section>

            <section className="w-full border-b bg-muted/30 py-16">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-3xl border bg-card p-6 text-center shadow-sm">
                                <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto max-w-5xl px-4 py-20">
                <div className="mb-10 max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight">Kim / Nasıl / Neden</h2>
                    <p className="mt-3 text-muted-foreground">
                        Google Search&apos;ün yararlı ve güvenilir içerik yaklaşımında öne çıkan temel şeffaflık
                        soruları bunlardır. Biz de bu sayfayı aynı mantıkla yapılandırıyoruz.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {transparencyCards.map((card) => (
                        <div key={card.title} className="rounded-3xl border bg-card p-8 shadow-sm">
                            <h3 className="text-xl font-bold">{card.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">{card.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full border-y bg-muted/30 py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="mb-10 max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight">Yayın ve Güncelleme İlkelerimiz</h2>
                        <p className="mt-3 text-muted-foreground">
                            Araçların ve rehberlerin güvenilir kalması için uyguladığımız temel editoryal kurallar bunlardır.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {publishingPrinciples.map((item) => (
                            <div key={item.title} className="rounded-3xl border bg-card p-7 shadow-sm">
                                <h3 className="text-lg font-bold">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto max-w-5xl px-4 py-20">
                <div className="mb-10 max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight">Kapsam ve Sorumluluk Sınırları</h2>
                    <p className="mt-3 text-muted-foreground">
                        Özellikle YMYL niteliği taşıyan konularda araçların ne işe yaradığını ve neyin yerine geçmediğini açıkça belirtmek zorundayız.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {guardrails.map((item) => (
                        <div key={item.title} className="rounded-3xl border bg-card p-7 shadow-sm">
                            <h3 className="text-lg font-bold">{item.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full border-y bg-muted/30 py-20">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="mb-10 max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight">Güven ve Hesap Verebilirlik</h2>
                        <p className="mt-3 text-muted-foreground">
                            Şeffaflık yalnızca içerik üretmek değil; gizlilik, iletişim ve yasal çerçeveyi görünür kılmak anlamına gelir.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {trustCards.map((card) => (
                            <div key={card.title} className="rounded-3xl border bg-card p-7 shadow-sm">
                                <h3 className="text-lg font-bold">{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
                                <Link href={card.href} className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
                                    {card.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full border-t bg-primary/5 py-16">
                <div className="container mx-auto max-w-5xl px-4 text-center">
                    <h2 className="text-3xl font-bold">Bir hata mı fark ettiniz?</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Eski veri, yanlış formül, eksik açıklama veya yasal/gizlilik talebi için bize yazabilirsiniz.
                        Hata bildirimleri yalnızca destek değil, editoryal iyileştirme girdisi olarak da ele alınır.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href={CONTACT_FORM_PATH}
                            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            İletişime Geç
                        </Link>
                        <Link
                            href="/rehber"
                            className="inline-flex items-center gap-2 rounded-2xl border bg-card px-8 py-3 font-bold transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            Rehberleri İncele
                        </Link>
                    </div>
                </div>
            </section>

            <Script
                id="about-page-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
            />
        </div>
    );
}
