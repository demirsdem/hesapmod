import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import FxCalculatorSkeleton from "@/components/fx/FxCalculatorSkeleton";
import FxEditorialTrust from "@/components/fx/FxEditorialTrust";
import FxFAQ from "@/components/fx/FxFAQ";
import FxInternalLinks from "@/components/fx/FxInternalLinks";
import FxPairTable from "@/components/fx/FxPairTable";
import FxRateTable from "@/components/fx/FxRateTable";
import FxRateTicker from "@/components/fx/FxRateTicker";
import FxStructuredData from "@/components/fx/FxStructuredData";
import PopularFxCalculations from "@/components/fx/PopularFxCalculations";
import { formatTRY } from "@/lib/fx/fxCalculations";
import { getFxCache } from "@/lib/fx/fxPriceCache";
import { FX_CANONICAL_URL, FX_PAGE_DESCRIPTION, FX_PAGE_PATH, FX_PAGE_TITLE, fxSeoSections } from "@/lib/fx/fxSeoContent";

const FxCalculator = dynamic(() => import("@/components/fx/FxCalculator"), {
    ssr: false,
    loading: () => <FxCalculatorSkeleton />,
});

export const revalidate = 3600;

export const viewport: Viewport = {
    themeColor: "#FF6B35",
};

export async function generateMetadata(): Promise<Metadata> {
    const cache = await getFxCache();
    const usdPart = cache?.rates.USD?.sell ? ` - Dolar ${formatTRY(cache.rates.USD.sell)}` : "";

    return {
        title: {
            absolute: `Döviz Hesaplama 2026${usdPart} | HesapMod`,
        },
        description: FX_PAGE_DESCRIPTION,
        alternates: {
            canonical: FX_CANONICAL_URL,
            languages: {
                tr: FX_PAGE_PATH,
            },
        },
        robots: { index: true, follow: true },
        openGraph: {
            type: "website",
            url: FX_CANONICAL_URL,
            title: FX_PAGE_TITLE,
            description: "Dolar, euro, sterlin ve diğer para birimlerini güncel alış/satış kurlarıyla TL'ye çevirin.",
            locale: "tr_TR",
        },
        twitter: {
            card: "summary_large_image",
            title: FX_PAGE_TITLE,
            description: "Dolar, euro, sterlin ve diğer para birimlerini canlı kurlarla TL'ye çevirin.",
        },
    };
}

function Breadcrumb() {
    return (
        <nav aria-label="Gezinti izi" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="font-semibold transition hover:text-[#B84418]">Ana Sayfa</Link>
            <span aria-hidden="true">›</span>
            <Link href="/kategori/finansal-hesaplamalar" className="font-semibold transition hover:text-[#B84418]">Finansal Hesaplamalar</Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-slate-950">Döviz Hesaplama</span>
        </nav>
    );
}

export default async function DovizHesaplamaPage() {
    const cache = await getFxCache();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <FxStructuredData cache={cache} />
            <Breadcrumb />

            <header className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-wide text-[#B84418]">
                    Canlı döviz çevirici · Son bilinen alış/satış kurları
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Döviz Hesaplama - Canlı Dolar, Euro, Sterlin ve TL Çevirici
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                    Güncel alış/satış kurlarıyla dolar, euro, sterlin ve diğer para birimlerini TL'ye çevirin. TL'den dövize, dövizden TL'ye veya iki para birimi arasında anlık hesaplama yapın.
                </p>
            </header>

            <div className="mt-6">
                <FxRateTicker cache={cache} />
            </div>

            <main className="mt-8 space-y-8">
                <FxCalculator initialRates={cache} />

                <FxRateTable cache={cache} />

                <noscript>
                    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">Güncel Döviz Kurları</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                            JavaScript kapalı olduğu için son bilinen döviz kurları gösterilmektedir.
                        </p>
                        <FxRateTable cache={cache} />
                    </section>
                </noscript>

                <PopularFxCalculations cache={cache} />

                <FxPairTable cache={cache} />

                <section className="space-y-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    {fxSeoSections.map((section) => (
                        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                            <h2 id={`${section.id}-heading`} className="text-2xl font-black tracking-tight text-slate-950">
                                {section.title}
                            </h2>
                            <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
                            {section.id === "kur-farki" && (
                                <p className="mt-3 text-base leading-8 text-slate-700">
                                    Tarihsel hareketi ayrıca{" "}
                                    <Link href="/finansal-hesaplamalar/gecmis-doviz-kurlari" className="font-black text-[#B84418] underline underline-offset-4">
                                        geçmiş döviz kurları
                                    </Link>{" "}
                                    sayfasıyla birlikte okuyabilirsiniz.
                                </p>
                            )}
                        </section>
                    ))}
                </section>

                <FxFAQ />

                <FxEditorialTrust cache={cache} />

                <FxInternalLinks />
            </main>
        </div>
    );
}
