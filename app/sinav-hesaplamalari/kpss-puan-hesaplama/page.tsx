import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Suspense } from "react";
import EditorialQualityBlock from "@/components/calculator/EditorialQualityBlock";
import { findCalculatorBySlug } from "@/lib/calculators";
import { getCalculatorTrustInfo } from "@/lib/calculator-trust";
import { SITE_URL } from "@/lib/site";
import KpssHesaplama from "@/components/kpss/KpssHesaplama";
import KpssFaq, { type KpssFaqItem } from "@/components/kpss/KpssFaq";
import styles from "./page.module.css";

const pagePath = "/sinav-hesaplamalari/kpss-puan-hesaplama";
const pageUrl = `${SITE_URL}${pagePath}`;
const title = "KPSS Puan Hesaplama 2026 - P1 P3 P93 P94 | HesapMod";
const description = "KPSS puan hesaplama aracıyla GY/GK netlerinden P1, P3, P93 ve P94 tahmini puanını 2026 için anında görün.";

export const revalidate = 604800;

export const viewport: Viewport = {
    themeColor: "#FF6B35",
};

export const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: {
        canonical: pagePath,
        languages: { tr: pagePath },
    },
    robots: { index: true, follow: true },
    openGraph: {
        title,
        description,
        url: pageUrl,
        type: "website",
        locale: "tr_TR",
        images: [
            {
                url: `${SITE_URL}${pagePath}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: "KPSS Puan Hesaplama 2026",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "KPSS Puan Hesaplama 2026 | HesapMod",
        description: "GY/GK netlerinizle P1, P3, P93 ve P94 tahmini KPSS puanınızı hesaplayın.",
        images: [`${SITE_URL}${pagePath}/opengraph-image`],
    },
};

const faqItems: KpssFaqItem[] = [
    {
        question: "KPSS neti nasıl hesaplanır?",
        answer: "KPSS'de her test için net, doğru sayısından yanlış sayısının dörtte biri çıkarılarak hesaplanır. Örneğin 48 doğru ve 12 yanlış 45 net üretir.",
    },
    {
        question: "KPSS P1, P3, P93 ve P94 farkı nedir?",
        answer: "P1 lisans adaylarında GY/GK ağırlıklı bir planlama puanı olarak kullanılır. P3 lisans B grubu süreçlerde öne çıkar; P93 önlisans, P94 ortaöğretim yerleştirmelerinde takip edilir. Bu araç bu türleri ayrı senaryolarla gösterir.",
    },
    {
        question: "Bu araç resmi KPSS puanı verir mi?",
        answer: "Hayır. Sonuç resmi ÖSYM puanı değildir; sınav sonrası standart sapma, aday dağılımı ve güncel kılavuz verileri olmadan yalnızca planlama amaçlı yaklaşık sonuç üretilebilir.",
    },
    {
        question: "Ham puan eşiği nedir?",
        answer: "ÖSYM değerlendirme mantığında adayın ilgili testlerden puan üretmesi için ham puan koşulları bulunur. Bu sayfada toplam ham net 0,5'in altına düşerse kullanıcıya eşik uyarısı gösterilir.",
    },
    {
        question: "Negatif net olursa puan hesaplanır mı?",
        answer: "Negatif net adayın yanlışlarının doğrulardan fazla etki yarattığını gösterir. Araç bu durumda puan üretmez ve sonucu düzeltmeniz için uyarı verir.",
    },
    {
        question: "Aynı net her yıl aynı KPSS puanını verir mi?",
        answer: "Hayır. KPSS'de standart puan dönüşümü sınav kitlesine, test ortalamalarına ve standart sapmalara göre değişir. Bu nedenle aynı net farklı yıllarda farklı resmi puanlara denk gelebilir.",
    },
    {
        question: "P3 seçince Eğitim Bilimleri alanı neden açılıyor?",
        answer: "Bu ek alan öğretmenlik hattını da planlamak isteyen adaylar için ayrı bir simülasyon girdisi sağlar. Güncel başvuru ve puan türü koşulları için ÖSYM kılavuzu esas alınmalıdır.",
    },
    {
        question: "Hedef puan simülasyonu nasıl okunmalı?",
        answer: "Tablo, seçilen puan türünde hedef puana yaklaşan örnek net kombinasyonlarını listeler. Kombinasyonlar çalışma planı içindir; resmi tercih garantisi anlamına gelmez.",
    },
];

const schemas = [
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "KPSS Puan Hesaplama",
        url: pageUrl,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        description: "GY ve GK netlerinden KPSS P1/P3/P93/P94 tahmini puan hesaplama aracı.",
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    },
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Sınav Hesaplamaları", item: `${SITE_URL}/kategori/sinav-hesaplamalari` },
            { "@type": "ListItem", position: 3, name: "KPSS Puan Hesaplama", item: pageUrl },
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

function AdPlaceholder({ label, rectangle = false }: { label: string; rectangle?: boolean }) {
    return (
        <div className={`${styles.adSlot} ${rectangle ? styles.rectangleAd : ""}`} aria-label={`${label} reklam alanı`}>
            Reklam
        </div>
    );
}

function RelatedCalculators() {
    const related = ["ales-puan-hesaplama", "yks-puan-hesaplama", "ekpss-puan-hesaplama", "pomem-puan-hesaplama"]
        .map((slug) => findCalculatorBySlug(slug))
        .filter(Boolean);

    return (
        <section aria-labelledby="related-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">İlgili araçlar</p>
                    <h2 id="related-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                        İlgili Hesap Makineleri
                    </h2>
                </div>
                <Link href="/kategori/sinav-hesaplamalari" className="text-sm font-black text-[#B84418] hover:text-[#9F3A12]">
                    Sınav hesaplamaları
                </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {related.map((calculator) => (
                    <Link
                        key={calculator!.slug}
                        href={`/${calculator!.category}/${calculator!.slug}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-white"
                    >
                        <h3 className="text-base font-black text-slate-950">{calculator!.name.tr}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                            {calculator!.shortDescription?.tr ?? calculator!.description.tr}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function KpssPuanHesaplamaPage() {
    const trustInfo = getCalculatorTrustInfo("kpss-puan-hesaplama", "sinav-hesaplamalari");

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {schemas.map((schema, index) => (
                <script
                    key={`kpss-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
                />
            ))}

            <nav aria-label="Gezinti izi" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Link href="/" className="font-semibold transition hover:text-[#B84418]">Ana Sayfa</Link>
                <span aria-hidden="true">›</span>
                <Link href="/kategori/sinav-hesaplamalari" className="font-semibold transition hover:text-[#B84418]">Sınav Hesaplamaları</Link>
                <span aria-hidden="true">›</span>
                <span className="font-semibold text-slate-950">KPSS Puan Hesaplama</span>
            </nav>

            <header className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-wide text-[#B84418]">
                    Son güncelleme: <time dateTime="2026-05-18">18 Mayıs 2026</time>
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    KPSS Puan Hesaplama 2026 - GY/GK ile Yaklaşık P1/P3 Simülasyonu
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                    Genel Yetenek, Genel Kültür ve gerekirse Eğitim Bilimleri doğru-yanlışlarınızı girin; P1, P3, P93 ve P94 için tahmini puan bandını, net dökümünü ve hedef puan kombinasyonlarını anında görün.
                </p>
            </header>

            <div className="mt-6">
                <AdPlaceholder label="Form üstü" />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <main className="space-y-8">
                    <Suspense fallback={<div className="min-h-[560px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm">Hesaplayıcı yükleniyor...</div>}>
                        <KpssHesaplama />
                    </Suspense>

                    <AdPlaceholder label="Sonuç kartı altı" rectangle />

                    <section aria-labelledby="how-heading" className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${styles.article}`}>
                        <h2 id="how-heading" className="text-2xl font-black tracking-tight text-slate-950">
                            KPSS Puanı Nasıl Hesaplanır? (2026)
                        </h2>
                        <p className="mt-4">
                            KPSS puanı önce test bazında net hesabıyla başlar. ÖSYM değerlendirme açıklamalarında doğru ve yanlış sayıları ayrı okunur; her test için yanlışların dörtte biri doğru sayısından düşülerek ham puan üretilir. Bu araç da aynı net mantığını kullanır: <strong>Net = Doğru - Yanlış / 4</strong>. Ardından seçilen puan türüne göre Genel Yetenek, Genel Kültür ve P3 senaryosunda Eğitim Bilimleri katkısı ayrı katsayılarla yaklaşık puana çevrilir.
                        </p>
                        <h3 className="mt-5 text-xl font-black text-slate-950">Net Hesaplama Formülü</h3>
                        <p>
                            48 doğru ve 12 yanlış yapan bir adayın neti 48 - 12/4 = 45 olur. Aynı mantık GY, GK ve Eğitim Bilimleri için ayrı uygulanır. Doğru + yanlış toplamı ilgili testin soru sayısını geçemez; GY ve GK için 60, Eğitim Bilimleri için 80 soru sınırı bu yüzden form içinde anında kontrol edilir.
                        </p>
                        <h3 id="p3" className="mt-5 text-xl font-black text-slate-950">Puan Türleri: P1, P3, P93, P94 Farkları</h3>
                        <div className="mt-3 overflow-x-auto">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Puan türü</th>
                                        <th>Kullanım</th>
                                        <th>Bu araçta kullanılan girdiler</th>
                                        <th>Not</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>P1</td><td>Lisans GY/GK performans takibi</td><td>GY + GK</td><td>Yaklaşık planlama puanı</td></tr>
                                    <tr><td>P3</td><td>Lisans B grubu ve öğretmenlik hattı senaryosu</td><td>GY + GK + EB</td><td>Güncel kılavuzla birlikte okunmalı</td></tr>
                                    <tr><td>P93</td><td>Önlisans yerleştirme takibi</td><td>GY + GK</td><td>Önlisans adayları içindir</td></tr>
                                    <tr><td>P94</td><td>Ortaöğretim yerleştirme takibi</td><td>GY + GK</td><td>Ortaöğretim adayları içindir</td></tr>
                                    <tr><td>P2</td><td>Bazı lisans/alan süreçleri</td><td>Bu formda seçiciye alınmadı</td><td>Puan türü koşulu ilan/kılavuzdan kontrol edilir</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section aria-labelledby="target-heading" className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${styles.article}`}>
                        <h2 id="target-heading" className="text-2xl font-black tracking-tight text-slate-950">
                            Hedef Puana Ulaşmak İçin Kaç Net Gerekir?
                        </h2>
                        <p className="mt-4">
                            Hedef puan simülasyonu, tek bir kesin cevap yerine birden çok net dağılımı gösterir. Çünkü aynı toplam net farklı GY/GK dengesiyle farklı puan katkısı üretebilir. Genel Yetenek katsayısı daha yüksek olan bir senaryoda GY netini artırmak puana daha fazla yansıyabilir; buna karşılık temel eksik GK tarafındaysa dengeli çalışma resmi puana yaklaşmayı kolaylaştırır.
                        </p>
                        <p className="mt-4">
                            Tabloyu deneme sonuçlarınızla birlikte okuyun: örneğin GY 45, GK 35 bandında takılı kalan bir aday önce yanlış sayısını azaltarak daha hızlı net kazanabilir. Ham puan eşiği ve negatif net uyarıları da bu yüzden yalnız teknik kontrol değil, çalışma planı sinyalidir.
                        </p>
                    </section>

                    <AdPlaceholder label="SSS içi" />

                    <section aria-labelledby="quality-heading" className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${styles.article}`}>
                        <h2 id="quality-heading" className="text-2xl font-black tracking-tight text-slate-950">
                            Kaynak, Güncelleme ve Yorumlama Notları
                        </h2>
                        <p className="mt-4">
                            HesapMod Eğitim Ekibi bu sayfayı ÖSYM'nin KPSS değerlendirme açıklamaları, sınav takvimi ve geçmiş yerleştirme pratikleriyle uyumlu olacak şekilde günceller. KPSS 2026 için kılavuz ve sonuç duyuruları yayımlandıkça katsayı açıklaması yeniden kontrol edilmelidir. Kaynak takiplerinde{" "}
                            <a href="https://www.osym.gov.tr/TR,62/kpss.html" target="_blank" rel="noopener noreferrer" aria-label="ÖSYM KPSS resmi sayfasını yeni sekmede aç" className="font-bold text-blue-700 underline underline-offset-4">
                                ÖSYM KPSS sayfası
                            </a>{" "}
                            ve aday kılavuzları esas alınır.
                        </p>
                        <p className="mt-4">
                            2024-2025 döneminde kamu alımlarında bölüm, mezuniyet düzeyi, nitelik kodu ve kurum ilanı taban puanı büyük ölçüde değiştirdi. Bu yüzden geçmiş taban puanlar yalnız referanstır: 70-75 bandı bazı düşük rekabetli kadrolarda izlenebilirken, merkezi ve popüler kadrolarda 85-95 bandı daha sık gündeme gelir. Tercih öncesi güncel kılavuz, nitelik kodu ve kontenjan mutlaka kontrol edilmelidir.
                        </p>
                        <h3 className="mt-5 text-xl font-black text-slate-950">Hangi puan türüne çalışmalıyım?</h3>
                        <p>
                            Lisans mezunuysanız ve B grubu kadro hedefliyorsanız önce P3/P1 bandınızı izleyin. Önlisans mezunları P93, ortaöğretim mezunları P94 sonucuna odaklanmalıdır. Öğretmenlik ya da alan bilgisi gerektiren süreçlerde Eğitim Bilimleri, ÖABT ve alan testleri ayrı öncelik kazanır. Karar ağacı basit: öğrenim düzeyinizi seçin, hedef kadronun puan türünü kılavuzdan doğrulayın, deneme netlerinizi bu sayfada izleyin, ardından zayıf testinizi haftalık plana taşıyın.
                        </p>
                    </section>

                    <KpssFaq items={faqItems} />
                    <RelatedCalculators />
                    <AdPlaceholder label="Sayfa sonu" />
                    <EditorialQualityBlock trustInfo={trustInfo} />
                </main>

                <aside className="space-y-4 lg:sticky lg:top-24">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-black text-slate-950">Kısa Özet</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                            <li><strong>P1:</strong> GY + GK yaklaşık simülasyonu.</li>
                            <li><strong>P3:</strong> EB alanı açılır.</li>
                            <li><strong>P93:</strong> Önlisans adayları için.</li>
                            <li><strong>P94:</strong> Ortaöğretim adayları için.</li>
                            <li><strong>Gizlilik:</strong> kalıcı yerel depolama kullanılmaz; paylaşım URL parametresiyle yapılır.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
