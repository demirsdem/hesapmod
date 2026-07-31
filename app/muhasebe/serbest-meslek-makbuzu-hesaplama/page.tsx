import type React from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import AdUnit from "@/components/AdUnit";
import SmmEditorialTrust from "@/components/smm/SmmEditorialTrust";
import SmmFaq from "@/components/smm/SmmFaq";
import { formatTRY } from "@/lib/smm-calculator";
import { SITE_URL } from "@/lib/site";
import {
    internalLinks,
    popularGrossRows,
    popularNetRows,
    smmDateModified,
    smmDescription,
    smmFaqItems,
    smmPagePath,
    smmTitle,
    stopajRows,
} from "@/lib/smm-seo-content";
import styles from "./page.module.css";

const SmmHesaplama = dynamic(() => import("@/components/smm/SmmHesaplama"), {
    loading: () => (
        <div className="min-h-[620px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            Hesaplayıcı yükleniyor...
        </div>
    ),
});

const pageUrl = `${SITE_URL}${smmPagePath}`;
const ogImageUrl = `${SITE_URL}${smmPagePath}/opengraph-image`;
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const CONTENT_AD_SLOT = process.env.NEXT_PUBLIC_SMM_AD_SLOT_2;

export const revalidate = 604800;

export const viewport: Viewport = {
    themeColor: "#FF6B35",
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: { absolute: smmTitle },
        description: smmDescription,
        alternates: {
            canonical: pageUrl,
            languages: { tr: pageUrl },
        },
        robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
        openGraph: {
            title: smmTitle,
            description: smmDescription,
            url: pageUrl,
            type: "website",
            locale: "tr_TR",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: "Serbest Meslek Makbuzu Hesaplama 2026",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: smmTitle,
            description: smmDescription,
            images: [ogImageUrl],
        },
    };
}

const schemas = [
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Serbest Meslek Makbuzu Hesaplama Aracı",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description: smmDescription,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "TRY",
        },
    },
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: smmTitle,
        url: pageUrl,
        description: smmDescription,
        dateModified: smmDateModified,
        breadcrumb: { "@id": "#breadcrumb" },
    },
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "#breadcrumb",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Muhasebe", item: `${SITE_URL}/kategori/muhasebe` },
            { "@type": "ListItem", position: 3, name: "Serbest Meslek Makbuzu Hesaplama", item: pageUrl },
        ],
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: smmFaqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    },
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Serbest Meslek Makbuzu Nasıl Hesaplanır?",
        inLanguage: "tr-TR",
        mainEntityOfPage: pageUrl,
        step: [
            { "@type": "HowToStep", position: 1, name: "Mesleğinizi seçin", text: "Meslek veya işlem türünü seçerek GVK 94/2 kapsamındaki stopaj oranını belirleyin." },
            { "@type": "HowToStep", position: 2, name: "Tutar tipini seçin", text: "Brüt, net veya tahsil edilecek tutar modlarından birini seçin." },
            { "@type": "HowToStep", position: 3, name: "Tutarı girin", text: "Hesaplamak istediğiniz tutarı TL olarak yazın." },
            { "@type": "HowToStep", position: 4, name: "KDV ve stopaj oranlarını kontrol edin", text: "Varsayılan oranları hizmet türünüze göre kontrol edin; gerekiyorsa değiştirin." },
            { "@type": "HowToStep", position: 5, name: "Sonuçları ve makbuz özetini okuyun", text: "Brüt, KDV, stopaj, tahsil edilecek tutar ve net geliri makbuz önizlemesiyle birlikte inceleyin." },
        ],
    },
];

function serializeJsonLd(schema: Record<string, unknown>) {
    return JSON.stringify(schema)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section aria-labelledby={id} className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${styles.article}`}>
            <h2 id={id} className="text-2xl font-black tracking-tight text-slate-950">
                {title}
            </h2>
            {children}
        </section>
    );
}

function PopularSmmCalculations() {
    return (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {popularGrossRows.map((row) => (
                <Link
                    key={row.label}
                    href={row.href}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-white"
                >
                    <h3 className="text-base font-black text-slate-950">{row.label}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                        Tahsil: {formatTRY(row.tahsilEdilecek)} · Net: {formatTRY(row.netGelir)}
                    </p>
                </Link>
            ))}
            {popularNetRows.map((row) => (
                <Link
                    key={row.label}
                    href={row.href}
                    className="rounded-lg border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-white"
                >
                    <h3 className="text-base font-black text-slate-950">{row.label}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                        Brüt: {formatTRY(row.result.brutTutar)} · Tahsil: {formatTRY(row.result.tahsilEdilecek)}
                    </p>
                </Link>
            ))}
        </div>
    );
}

export default function SmmPage() {
    return (
        <div className={`${styles.printPage} mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8`}>
            {schemas.map((schema, index) => (
                <script
                    key={`smm-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
                />
            ))}

            <nav aria-label="Gezinti izi" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Link href="/" className="font-semibold transition hover:text-[#B84418]">Ana Sayfa</Link>
                <span aria-hidden="true">›</span>
                <Link href="/kategori/muhasebe" className="font-semibold transition hover:text-[#B84418]">Muhasebe</Link>
                <span aria-hidden="true">›</span>
                <span className="font-semibold text-slate-950">Serbest Meslek Makbuzu Hesaplama</span>
            </nav>

            <header className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-wide text-[#B84418]">
                    Son güncelleme: <time dateTime={smmDateModified}>19 Mayıs 2026</time>
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Serbest Meslek Makbuzu (SMM) Hesaplama 2026
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                    Brüt hizmet bedeli, hedef net gelir veya müşterinin ödeyeceği tahsil tutarını girerek KDV, stopaj ve net geliri tek ekranda hesaplayın. Araç 2026 GVK 94/2 oranlarını, telif işlerinde %17 stopaj seçeneğini ve KDV muafiyet senaryolarını birlikte gösterir.
                </p>
            </header>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <main className="space-y-8">
                    <section aria-labelledby="smm-tool-heading">
                        <h2 id="smm-tool-heading" className="mb-4 text-2xl font-black tracking-tight text-slate-950">
                            SMM Hesaplama Aracı
                        </h2>
                        <Suspense fallback={<div className="min-h-[620px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm">Hesaplayıcı yükleniyor...</div>}>
                            <SmmHesaplama />
                        </Suspense>
                    </section>

                    <Section id="smm-nedir-heading" title="Serbest Meslek Makbuzu Nedir?">
                        <p className="mt-4">
                            Serbest meslek makbuzu, 193 sayılı Gelir Vergisi Kanunu'nun 66. maddesi kapsamında serbest meslek faaliyetinden doğan tahsilatı belgeleyen resmi evraktır. Avukat, doktor, mali müşavir, mimar, mühendis, danışman, psikolog, diyetisyen, tercüman veya telif geliri elde eden yazar gibi serbest meslek erbapları sundukları hizmet karşılığında fatura yerine SMM düzenler. Makbuzda brüt hizmet bedeli, KDV, gelir vergisi stopajı ve tahsil edilecek tutar ayrı satırlar halinde gösterilir. Bu ayrım önemlidir; çünkü KDV hizmet bedeline eklenen bir vergi iken stopaj serbest meslek erbabının gelirinden kesilen ve ödeme yapan tarafça beyan edilen bir vergidir.
                        </p>
                        <p className="mt-4">
                            Uygulamada e-SMM, kağıt makbuzun elektronik ortamdaki karşılığıdır ve GİB e-Belge sistemi veya özel entegratörler üzerinden düzenlenir. Elektronik makbuzda alıcı bilgileri, hizmet açıklaması, brüt tutar, KDV oranı, stopaj oranı ve tahsil edilecek tutar girilir. Bu sayfadaki hesaplama, makbuz düzenlemeden önce brüt/net/tahsil senaryolarını kontrol etmek için hazırlanmıştır; özel istisna, KDV tevkifatı veya farklı vergi sorumluluğu bulunan işlemlerde resmi kaynak ve mali müşavir değerlendirmesi esas alınmalıdır.
                        </p>
                    </Section>

                    <Section id="stopaj-heading" title="Stopaj Nasıl Hesaplanır? (GVK Madde 94/2)">
                        <p className="mt-4">
                            GVK 94/2, serbest meslek ödemelerinde gelir vergisi kesintisinin hangi kapsamda yapılacağını belirler. Genel serbest meslek ödemelerinde yaygın oran %20'dir; GVK 18. madde kapsamındaki telif ve patent ödemelerinde ise %17 oranı uygulanabilir. Stopajı, ödemeyi yapan kurum veya stopaj sorumlusu kişi serbest meslek erbabının brüt hizmet bedelinden keser. Kesilen tutar genellikle muhtasar ve prim hizmet beyannamesiyle beyan edilir; serbest meslek erbabı açısından bu kesinti yıllık gelir vergisi hesabında mahsup edilebilecek bir vergi niteliği taşır.
                        </p>
                        <div className="mt-5 overflow-x-auto">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Meslek / Durum</th>
                                        <th>Stopaj</th>
                                        <th>GVK Kapsamı</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stopajRows.map((row) => (
                                        <tr key={row.durum}>
                                            <td>{row.durum}</td>
                                            <td>{row.stopaj}</td>
                                            <td>{row.kapsam}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-600">
                            Kaynak: GİB GVK 94. Madde Kesinti Oranları.
                        </p>
                    </Section>

                    <Section id="kdv-heading" title="KDV Uygulaması ve İstisnalar">
                        <p className="mt-4">
                            SMM'de KDV, brüt hizmet bedeli üzerinden hesaplanır ve tahsil edilecek tutara eklenir. Standart hizmetlerde %20 oranı yaygın şekilde kullanılır; bazı hizmetlerde %10 veya %0 uygulanabilir. Eğitim, sağlık veya kanunda özel istisna tanımlanmış serbest meslek hizmetlerinde KDV'den muafiyet ya da farklı oran gündeme gelebilir. Hizmetiniz KDV'den muafsa hesaplayıcıda KDV oranını %0 seçmeniz gerekir. Güncel istisna listesi, KDV Genel Uygulama Tebliği ve GİB duyurularıyla birlikte kontrol edilmelidir.
                        </p>
                    </Section>

                    <Section id="brut-net-heading" title="Brütten Nete, Netten Brüte Hesaplama">
                        <p className="mt-4">
                            Brütten nete hesapta önce brüt hizmet bedeli belirlenir. Net gelir formülü <strong>Net = Brüt × (1 - stopaj%)</strong> şeklindedir. Netten brüte gitmek için hedef net gelir <strong>Brüt = Net ÷ (1 - stopaj%)</strong> formülüyle brüte çevrilir. Müşterinin ödeyeceği tahsil tutarından brüt hizmet bedelini bulmak istediğinizde ise <strong>Brüt = Tahsil ÷ (1 + KDV% - stopaj%)</strong> formülü kullanılır. Bu üç yön, teklif hazırlarken, makbuz kesmeden önce net geliri kontrol ederken ve müşteriyle tahsil tutarı konuşurken farklı ihtiyaçları karşılar.
                        </p>
                    </Section>

                    <Section id="esmm-heading" title="e-SMM (Elektronik Serbest Meslek Makbuzu)">
                        <p className="mt-4">
                            e-SMM, serbest meslek makbuzunun elektronik belge olarak düzenlenmiş halidir. Serbest meslek erbapları GİB e-Belge portalı, doğrudan entegrasyon veya özel entegratör aracılığıyla e-SMM kesebilir. Uygulamada yükümlülük ve geçiş tarihleri ciro, mükellefiyet ve meslek grubuna göre değişebildiği için güncel e-Belge duyuruları takip edilmelidir. Makbuz keserken müşteri bilgisi, hizmet açıklaması, brüt tutar, KDV oranı, stopaj oranı, tahsil edilecek tutar ve belge tarihi birlikte kontrol edilmelidir.
                        </p>
                    </Section>

                    <Section id="popular-heading" title="Örnek SMM Hesaplamaları">
                        <p className="mt-4">
                            Aşağıdaki örnekler %20 stopaj ve %20 KDV varsayımıyla hazırlanmıştır. Kartlara tıklayarak hesaplayıcıyı ilgili tutarla açabilirsiniz.
                        </p>
                        <PopularSmmCalculations />
                    </Section>

                    {ADSENSE_CLIENT && CONTENT_AD_SLOT ? (
                        <AdUnit
                            dataAdClient={ADSENSE_CLIENT}
                            dataAdSlot={CONTENT_AD_SLOT}
                            minHeight="90px"
                            format="horizontal"
                            className="my-0"
                        />
                    ) : null}

                    <SmmFaq items={[...smmFaqItems]} />
                    <SmmEditorialTrust />

                    <section aria-labelledby="internal-links-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="internal-links-heading" className="text-2xl font-black tracking-tight text-slate-950">
                            İlgili Hesaplama Araçları
                        </h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {internalLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-900 transition hover:border-orange-200 hover:bg-white"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </main>

                <aside className="space-y-4 lg:sticky lg:top-24">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-black text-slate-950">Kısa Özet</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                            <li><strong>Genel stopaj:</strong> GVK 94/2-b kapsamında %20.</li>
                            <li><strong>Telif stopajı:</strong> 18. madde kapsamında %17.</li>
                            <li><strong>KDV:</strong> Varsayılan %20; %0 ve %10 seçilebilir.</li>
                            <li><strong>Modlar:</strong> Brüt, net ve tahsil tutarından hesaplama.</li>
                            <li><strong>Uyarı:</strong> Vergi tavsiyesi değildir.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
