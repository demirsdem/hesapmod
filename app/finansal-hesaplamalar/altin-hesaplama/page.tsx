import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import GoldCalculatorSkeleton from "@/components/gold/GoldCalculatorSkeleton";
import GoldEditorialTrust from "@/components/gold/GoldEditorialTrust";
import GoldFAQ from "@/components/gold/GoldFAQ";
import GoldInternalLinks from "@/components/gold/GoldInternalLinks";
import GoldPriceTable from "@/components/gold/GoldPriceTable";
import GoldPriceTicker from "@/components/gold/GoldPriceTicker";
import GoldStructuredData from "@/components/gold/GoldStructuredData";
import GoldTypeWeightTable from "@/components/gold/GoldTypeWeightTable";
import PopularGoldCalculations from "@/components/gold/PopularGoldCalculations";
import { formatTRY } from "@/lib/gold/goldCalculations";
import { getGoldCache } from "@/lib/gold/goldPriceCache";
import {
    GOLD_CANONICAL_URL,
    GOLD_PAGE_DESCRIPTION,
    GOLD_PAGE_PATH,
    GOLD_PAGE_TITLE,
    goldSeoSections,
} from "@/lib/gold/goldSeoContent";

const GoldCalculator = dynamic(() => import("@/components/gold/GoldCalculator"), {
    ssr: false,
    loading: () => <GoldCalculatorSkeleton />,
});

export const revalidate = 3600;

export const viewport: Viewport = {
    themeColor: "#FF6B35",
};

export async function generateMetadata(): Promise<Metadata> {
    const cache = await getGoldCache();
    const pricePart = cache?.prices.gram24k?.sell
        ? ` - Gram Altın ${formatTRY(cache.prices.gram24k.sell)}`
        : "";

    return {
        title: {
            absolute: `Altın Hesaplama 2026${pricePart} | HesapMod`,
        },
        description: GOLD_PAGE_DESCRIPTION,
        alternates: {
            canonical: GOLD_CANONICAL_URL,
            languages: {
                tr: GOLD_PAGE_PATH,
            },
        },
        robots: { index: true, follow: true },
        openGraph: {
            type: "website",
            url: GOLD_CANONICAL_URL,
            title: GOLD_PAGE_TITLE,
            description: "Canlı alış/satış fiyatlarıyla gram altın, çeyrek altın, bilezik ve cumhuriyet altınını TL'ye çevirin.",
            locale: "tr_TR",
        },
        twitter: {
            card: "summary_large_image",
            title: GOLD_PAGE_TITLE,
            description: "Gram altın, çeyrek altın, bilezik ve cumhuriyet altınını canlı fiyatlarla TL'ye çevirin.",
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
            <span className="font-semibold text-slate-950">Altın Hesaplama</span>
        </nav>
    );
}

export default async function AltinHesaplamaPage() {
    const cache = await getGoldCache();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <GoldStructuredData cache={cache} />
            <Breadcrumb />

            <header className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-wide text-[#B84418]">
                    Canlı altın çevirici · Son bilinen alış/satış fiyatları
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Altın Hesaplama - Canlı Gram, Çeyrek, Bilezik ve Cumhuriyet Altını Kaç TL?
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                    Canlı alış/satış fiyatlarıyla gram altın, çeyrek altın, 22 ayar bilezik, cumhuriyet altını ve ons altını TL karşılığına çevirin. TL'den altına veya altından TL'ye kolayca hesaplama yapın.
                </p>
            </header>

            <div className="mt-6">
                <GoldPriceTicker cache={cache} />
            </div>

            <main className="mt-8 space-y-8">
                <GoldCalculator initialPrices={cache} />

                <GoldPriceTable cache={cache} />

                <noscript>
                    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">Güncel Altın Fiyatları</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                            JavaScript kapalı olduğu için son bilinen altın fiyatları gösterilmektedir.
                        </p>
                        <GoldPriceTable cache={cache} />
                    </section>
                </noscript>

                <PopularGoldCalculations cache={cache} />

                <GoldTypeWeightTable />

                <section className="space-y-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    {goldSeoSections.map((section) => (
                        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                            <h2 id={`${section.id}-heading`} className="text-2xl font-black tracking-tight text-slate-950">
                                {section.title}
                            </h2>
                            <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
                            {section.id === "ons" && (
                                <p className="mt-3 text-base leading-8 text-slate-700">
                                    USD/TRY kurunu takip etmek için{" "}
                                    <Link href="/finansal-hesaplamalar/doviz-hesaplama" className="font-black text-[#B84418] underline underline-offset-4">
                                        döviz hesaplama
                                    </Link>{" "}
                                    aracını birlikte kullanabilirsiniz.
                                </p>
                            )}
                        </section>
                    ))}
                </section>

                <GoldFAQ />

                <GoldEditorialTrust cache={cache} />

                <GoldInternalLinks />
            </main>
        </div>
    );
}
