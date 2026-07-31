import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import EditorialQualityBlock from "@/components/calculator/EditorialQualityBlock";
import TrackedLink from "@/components/analytics/TrackedLink";
import { findCalculatorBySlug } from "@/lib/calculators";
import { getCalculatorTrustInfo } from "@/lib/calculator-trust";
import { SITE_URL } from "@/lib/site";
import { oggFaqItems, oggSchemas, pageUrl, serializeJsonLd } from "./schema";
import OggFaq from "./components/OggFaq";
import OggCalculatorLoader from "./components/OggCalculatorLoader";

export const revalidate = 604800;

const title = "Özel Güvenlik Sınav Hesaplama 2026 | ÖGG Puanı";
const description = "ÖGG yazılı sınav puanınızı hesaplayın. Silahlı/silahsız baraj kontrolü.";

export const metadata: Metadata = {
    title: { absolute: title },
    description,
    themeColor: "#FF6B35",
    alternates: {
        canonical: "/sinav-hesaplamalari/ozel-guvenlik-sinav-hesaplama",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title,
        description,
        url: pageUrl,
        type: "website",
        images: [
            {
                url: `${SITE_URL}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: "Özel Güvenlik Sınav Hesaplama 2026",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${SITE_URL}/opengraph-image`],
    },
};

const relatedSlugs = [
    "kpss-puan-hesaplama",
    "pmyo-puan-hesaplama",
    "pomem-puan-hesaplama",
    "ehliyet-sinav-puan-hesaplama",
];

function RelatedCalculators() {
    const relatedCalculators = relatedSlugs
        .map((slug) => findCalculatorBySlug(slug))
        .filter(Boolean);

    if (relatedCalculators.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="related-calculators-heading" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#FF6B35]">İlgili araçlar</p>
                    <h2 id="related-calculators-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                        ÖGG Sonucunu Destekleyen Hesaplamalar
                    </h2>
                </div>
                <TrackedLink
                    href="/kategori/sinav-hesaplamalari"
                    analytics={{
                        source_type: "calculator_related_content",
                        source_slug: "ozel-guvenlik-sinav-hesaplama",
                        source_category: "sinav-hesaplamalari",
                        target_kind: "category",
                        target_category: "sinav-hesaplamalari",
                    }}
                    className="text-sm font-black text-[#CC4A1A] transition hover:text-[#E55A26]"
                >
                    Sınav kategorisi
                </TrackedLink>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {relatedCalculators.map((calculator) => (
                    <TrackedLink
                        key={calculator!.slug}
                        href={`/${calculator!.category}/${calculator!.slug}`}
                        analytics={{
                            source_type: "calculator_related_content",
                            source_slug: "ozel-guvenlik-sinav-hesaplama",
                            source_category: "sinav-hesaplamalari",
                            target_slug: calculator!.slug,
                            target_category: calculator!.category,
                            target_kind: "calculator",
                        }}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FFD7C7] hover:shadow-md"
                    >
                        <h3 className="text-sm font-black text-slate-900">{calculator!.name.tr}</h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                            {calculator!.shortDescription?.tr ?? calculator!.description.tr}
                        </p>
                    </TrackedLink>
                ))}
            </div>
        </section>
    );
}

export default function OzelGuvenlikSinavPage() {
    const trustInfo = getCalculatorTrustInfo("ozel-guvenlik-sinav-hesaplama", "sinav-hesaplamalari");
    const year = new Date().getFullYear();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {oggSchemas.map((schema, index) => (
                <script
                    key={`ogg-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
                />
            ))}

            <nav aria-label="Gezinti izi" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Link href="/" className="font-semibold transition hover:text-[#CC4A1A]">
                    Ana Sayfa
                </Link>
                <span aria-hidden="true">›</span>
                <Link href="/kategori/sinav-hesaplamalari" className="font-semibold transition hover:text-[#CC4A1A]">
                    Sınav
                </Link>
                <span aria-hidden="true">›</span>
                <span className="font-semibold text-slate-900">ÖGG Sınav Hesaplama</span>
            </nav>

            <header className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-wide text-[#FF6B35]">Silahlı ve silahsız özel güvenlik</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Özel Güvenlik Sınav Hesaplama {year}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                    ÖGG temel eğitim doğru sayınızı, silahlı adaylar için silah bilgisi ve atış sonucunu girin; 60 geçme barajını ve sertifika durumunu anında görün.
                </p>
            </header>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div className="space-y-8">
                    <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Hesaplayıcı yükleniyor...</div>}>
                        <OggCalculatorLoader />
                    </Suspense>

                    <section aria-labelledby="how-it-works-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="how-it-works-heading" className="text-2xl font-black tracking-tight text-slate-900">
                            ÖGG Sınav Hesaplama Nasıl Çalışır?
                        </h2>
                        <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-700 sm:grid-cols-2">
                            <p>
                                Silahsız ÖGG sonucunda 100 soruluk temel eğitim sınavı esas alınır. Hukuk, mevzuat, ilkyardım ve silah/genel kültür alanlarından gelen toplam doğru sayısı puanı oluşturur; geçme barajı 60 puandır.
                            </p>
                            <p>
                                Silahlı adaylarda temel eğitim puanına ek olarak 25 soruluk silah bilgisi ve 5 atışlık uygulama sonucu dahil edilir. Araç, silahlı sonucu ve gerektiğinde silahsız sertifika ihtimalini ayrı gösterir.
                            </p>
                        </div>
                    </section>

                    <section aria-labelledby="formula-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="formula-heading" className="text-2xl font-black tracking-tight text-slate-900">
                            ÖGG Puan Hesaplama Formülü
                        </h2>
                        <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-700">
                            <p>
                                <strong>Silahsız:</strong> Temel Eğitim Puanı = toplam doğru sayısı. Sonuç 60 ve üzeriyse aday başarılı kabul edilir.
                            </p>
                            <p>
                                <strong>Silahlı:</strong> Silah Bilgisi Puanı = doğru x 2, Atış Puanı = isabet x 10, Silah Puanı = Silah Bilgisi + Atış. Genel Ortalama = (Temel Eğitim Puanı + Silah Puanı) / 2.
                            </p>
                            <p className="rounded-xl border border-orange-200 bg-orange-50 p-4 font-semibold text-orange-950">
                                Bölüm bazlı "en az doğru" uyarıları çalışma dengesi içindir; resmi karar toplam puan, ortalama ve duyurulardaki koşullara göre verilir.
                            </p>
                        </div>
                    </section>

                    <section aria-labelledby="exam-content-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="exam-content-heading" className="text-2xl font-black tracking-tight text-slate-900">
                            Özel Güvenlik Sınavı Soru Sayısı ve 2026 Takibi
                        </h2>
                        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                            <p>
                                Özel güvenlik sınavı soru sayısı silahsız adaylarda 100 temel eğitim sorusudur. Silahlı adaylar ayrıca silah bilgisi yazılı bölümü ve uygulamalı atış sonucuyla değerlendirilir.
                            </p>
                            <p>
                                ÖGG sınavı 2026 tarihleri, sınav giriş belgeleri ve sonuç duyuruları için{" "}
                                <a
                                    href="https://www.egm.gov.tr/ozelguvenlik"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="font-bold text-blue-700 underline underline-offset-4 hover:text-blue-900"
                                >
                                    EGM Özel Güvenlik Denetleme Başkanlığı duyuruları
                                </a>{" "}
                                esas alınmalıdır. Özel güvenlik yenileme sınavı ve temel eğitim sınavı duyuruları dönemsel olarak değişebilir.
                            </p>
                        </div>
                    </section>

                    <OggFaq items={oggFaqItems} />
                    <RelatedCalculators />
                    <EditorialQualityBlock trustInfo={trustInfo} />
                </div>

                <aside className="hidden lg:block">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-black text-slate-900">Kısa Özet</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                            <li><strong>Silahsız:</strong> 100 üzerinden 60 puan.</li>
                            <li><strong>Silahlı:</strong> temel eğitim ve silah puanı ortalaması 60.</li>
                            <li><strong>Yanlışlar:</strong> doğru cevapları götürmez.</li>
                            <li><strong>Paylaşım:</strong> sonuç URL parametreleriyle saklanır.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
