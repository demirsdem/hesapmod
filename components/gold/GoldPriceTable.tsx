import Link from "next/link";
import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import {
    GOLD_TYPE_INFO,
    GOLD_TYPE_ORDER,
    calculateSpread,
    formatGoldDate,
    formatTRY,
} from "@/lib/gold/goldCalculations";

export default function GoldPriceTable({ cache }: { cache: GoldPriceCache | null }) {
    if (!cache) {
        return (
            <section aria-labelledby="guncel-altin-fiyatlari" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 id="guncel-altin-fiyatlari" className="text-2xl font-black tracking-tight text-slate-950">Güncel Altın Fiyatları</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">Fiyat geçici olarak alınamıyor. Sayfa kırılmadan manuel hesaplama yapabilirsiniz.</p>
            </section>
        );
    }

    return (
        <section aria-labelledby="guncel-altin-fiyatlari" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Son bilinen piyasa</p>
                    <h2 id="guncel-altin-fiyatlari" className="mt-1 text-2xl font-black tracking-tight text-slate-950">Güncel Altın Fiyatları</h2>
                </div>
                <p className="text-sm font-semibold text-slate-600">{formatGoldDate(cache.updatedAt)}</p>
            </div>
            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
                            <th className="min-w-[190px] px-3 py-3 font-black">Altın türü</th>
                            <th className="min-w-[132px] px-3 py-3 font-black">Alış fiyatı</th>
                            <th className="min-w-[132px] px-3 py-3 font-black">Satış fiyatı</th>
                            <th className="min-w-[110px] px-3 py-3 font-black">Makas</th>
                            <th className="min-w-[150px] px-3 py-3 font-black">Son güncelleme</th>
                            <th className="min-w-[104px] px-3 py-3 font-black">Hesapla</th>
                        </tr>
                    </thead>
                    <tbody>
                        {GOLD_TYPE_ORDER.map((type) => {
                            const info = GOLD_TYPE_INFO[type];
                            const price = cache.prices[type];
                            return (
                                <tr key={type} className="border-b border-slate-100 last:border-0">
                                    <td className="px-3 py-3 font-bold text-slate-950">{info.name}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums text-emerald-700">{formatTRY(price.buy)}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums text-red-700">{formatTRY(price.sell)}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums text-slate-700">{formatTRY(calculateSpread(price.buy, price.sell))}</td>
                                    <td className="px-3 py-3 text-xs font-semibold text-slate-600">{formatGoldDate(cache.updatedAt)}</td>
                                    <td className="px-3 py-3">
                                        <Link
                                            href={`?mod=altindan-tlye&type=${type}&amount=1#canli-altin-hesaplama-araci`}
                                            className="inline-flex min-h-11 items-center rounded-md border border-amber-300 bg-amber-50 px-3 text-sm font-black text-[#9F3A12] transition hover:bg-amber-100"
                                        >
                                            Hesapla
                                        </Link>
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
