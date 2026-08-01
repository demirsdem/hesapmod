import Link from "next/link";
import FxEditorialTrust from "@/components/fx/FxEditorialTrust";
import FxPairTable from "@/components/fx/FxPairTable";
import FxRateTable from "@/components/fx/FxRateTable";
import FxRateTicker from "@/components/fx/FxRateTicker";
import FxStructuredData from "@/components/fx/FxStructuredData";
import PopularFxCalculations from "@/components/fx/PopularFxCalculations";
import type { FxLongTailPageConfig } from "@/lib/fx/fxLongTailPages";
import { getFxCache } from "@/lib/fx/fxPriceCache";

export default async function FxLongTailPage({ config }: { config: FxLongTailPageConfig }) {
    const cache = await getFxCache();
    const calculatorHref = `/finansal-hesaplamalar/doviz-hesaplama?mod=${config.mode}&from=${config.from}&to=${config.to}&amount=${config.amount}#doviz-cevirici`;

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <FxStructuredData cache={cache} page={config} />
            <nav aria-label="Gezinti izi" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Link href="/" className="font-semibold transition hover:text-[#B84418]">Ana Sayfa</Link>
                <span aria-hidden="true">›</span>
                <Link href="/kategori/finansal-hesaplamalar" className="font-semibold transition hover:text-[#B84418]">Finansal Hesaplamalar</Link>
                <span aria-hidden="true">›</span>
                <Link href="/finansal-hesaplamalar/doviz-hesaplama" className="font-semibold transition hover:text-[#B84418]">Döviz Hesaplama</Link>
                <span aria-hidden="true">›</span>
                <span className="font-semibold text-slate-950">{config.h1}</span>
            </nav>

            <header className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-wide text-[#B84418]">Döviz hesaplama alt sayfası</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{config.h1}</h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">{config.intro}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                    {config.targetQueries.map((query) => (
                        <span key={query} className="rounded-md border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-[#9F3A12]">
                            {query}
                        </span>
                    ))}
                </div>
            </header>

            <div className="mt-6">
                <FxRateTicker cache={cache} />
            </div>

            <main className="mt-8 space-y-8">
                <div className="rounded-lg border border-orange-200 bg-[#FFF8E7] p-4">
                    <Link href={calculatorHref} className="inline-flex min-h-11 items-center rounded-md bg-[#B84418] px-4 text-sm font-black text-white transition hover:bg-[#9F3A12]">
                        Bu senaryoyu döviz hesaplayıcıda aç
                    </Link>
                </div>

                <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    {config.content.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-2xl font-black tracking-tight text-slate-950">{section.title}</h2>
                            <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
                            {section.links && section.links.length > 0 ? (
                                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-base leading-8">
                                    {section.links.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="font-semibold text-[#B84418] underline underline-offset-4 hover:text-[#9F3A12]"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </p>
                            ) : null}
                        </section>
                    ))}
                </section>

                <FxRateTable cache={cache} />
                <PopularFxCalculations cache={cache} />
                <FxPairTable cache={cache} />

                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Sıkça Sorulan Sorular</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {config.faq.map((item) => (
                            <article key={item.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <h3 className="text-base font-black text-slate-950">{item.question}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-700">{item.answer}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <FxEditorialTrust cache={cache} />

                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">Döviz Hesaplama Ana Sayfası</h2>
                    <p className="mt-3 text-base leading-8 text-slate-700">
                        Dövizden TL'ye, TL'den dövize, çapraz kur, makas ve BSMV dahil maliyet modlarını birlikte kullanmak için{" "}
                        <Link href="/finansal-hesaplamalar/doviz-hesaplama" className="font-black text-[#B84418] underline underline-offset-4">
                            döviz hesaplama
                        </Link>{" "}
                        ana sayfasına dönebilirsiniz.
                    </p>
                </section>
            </main>
        </div>
    );
}
