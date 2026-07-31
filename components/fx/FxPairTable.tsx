import type { CurrencyCode, FxRateCache } from "@/lib/fx/fxPriceTypes";
import { calculateCrossRate, formatCurrencyAmount } from "@/lib/fx/fxCalculations";

const pairs: Array<[CurrencyCode, CurrencyCode]> = [
    ["USD", "EUR"],
    ["EUR", "USD"],
    ["USD", "GBP"],
    ["GBP", "USD"],
    ["EUR", "GBP"],
    ["GBP", "EUR"],
    ["USD", "CHF"],
    ["EUR", "CHF"],
];

export default function FxPairTable({ cache }: { cache: FxRateCache | null }) {
    if (!cache) return null;

    return (
        <section aria-labelledby="doviz-pariteleri" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="doviz-pariteleri" className="text-2xl font-black tracking-tight text-slate-950">Döviz Pariteleri ve Çapraz Kurlar</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
                Çapraz kur hesaplamaları TRY bazlı alış/satış kurlarından yaklaşık olarak türetilir. Banka, aracı kurum ve döviz bürolarında uygulanan parite kurları farklı olabilir.
            </p>
            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="px-3 py-3 font-black">Parite</th>
                            <th className="px-3 py-3 font-black">Yaklaşık değer</th>
                            <th className="px-3 py-3 font-black">Hesapla</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pairs.map(([from, to]) => {
                            const value = calculateCrossRate({ rates: cache.rates, fromCurrency: from, toCurrency: to, amount: 1 });
                            return (
                                <tr key={`${from}-${to}`} className="odd:bg-white even:bg-slate-50">
                                    <td className="px-3 py-3 font-black text-slate-950">{from}/{to}</td>
                                    <td className="px-3 py-3 font-black tabular-nums text-slate-800">1 {from} ≈ {formatCurrencyAmount(value, to)}</td>
                                    <td className="px-3 py-3">
                                        <a href={`?mod=cross&from=${from}&to=${to}&amount=1#doviz-cevirici`} className="inline-flex min-h-11 items-center rounded-md border border-[#B84418] px-3 text-sm font-black text-[#B84418] hover:bg-[#FFF3EE]">
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
