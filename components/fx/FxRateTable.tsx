import type { CurrencyCode, FxRateCache } from "@/lib/fx/fxPriceTypes";
import { calculateSpread, formatRate, formatTRY, FX_CURRENCY_INFO, FX_CURRENCY_ORDER } from "@/lib/fx/fxCalculations";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function hrefForCurrency(code: CurrencyCode) {
    return `?mod=fx-to-try&from=${code}&amount=100#doviz-cevirici`;
}

export default function FxRateTable({ cache }: { cache: FxRateCache | null }) {
    if (!cache) {
        return (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Güncel Döviz Kurları</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">Döviz kurları geçici olarak alınamıyor.</p>
            </section>
        );
    }

    return (
        <section aria-labelledby="guncel-doviz-kurlari" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="guncel-doviz-kurlari" className="text-2xl font-black tracking-tight text-slate-950">Güncel Döviz Kurları</h2>
            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                    <thead>
                        <tr className="bg-slate-100 text-slate-700">
                            {["Döviz", "Alış kuru", "Satış kuru", "Makas", "Son güncelleme", "Hesapla"].map((head) => (
                                <th key={head} className="border-b border-slate-200 px-3 py-3 font-black">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {FX_CURRENCY_ORDER.map((code) => {
                            const rate = cache.rates[code];
                            return (
                                <tr key={code} className="border-b border-slate-100 odd:bg-white even:bg-slate-50">
                                    <td className="px-3 py-3 font-black text-slate-950">{FX_CURRENCY_INFO[code].name} / {code}</td>
                                    <td className="min-w-[120px] px-3 py-3 font-black tabular-nums text-emerald-700">{formatRate(rate.buy)} TL</td>
                                    <td className="min-w-[120px] px-3 py-3 font-black tabular-nums text-red-700">{formatRate(rate.sell)} TL</td>
                                    <td className="min-w-[110px] px-3 py-3 tabular-nums text-slate-700">{formatTRY(calculateSpread(rate.buy, rate.sell))}</td>
                                    <td className="min-w-[120px] px-3 py-3 text-slate-600">{formatDate(cache.updatedAt)}</td>
                                    <td className="px-3 py-3">
                                        <a href={hrefForCurrency(code)} className="inline-flex min-h-11 items-center rounded-md border border-[#B84418] px-3 text-sm font-black text-[#B84418] hover:bg-[#FFF3EE]">
                                            Hesapla
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
