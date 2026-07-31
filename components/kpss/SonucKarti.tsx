"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { HesaplamaCiktisi, PuanTuru } from "@/types/kpss";
import { KATSAYILAR } from "@/lib/kpss-calculator";

function formatNumber(value: number) {
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(value);
}

export default function SonucKarti({ result, puanTuru }: { result: HesaplamaCiktisi; puanTuru: PuanTuru }) {
    return (
        <section
            aria-live="polite"
            aria-label="Hesaplama sonucu"
            aria-atomic="true"
            className="min-h-[360px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Tahmini sonuç</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{`${puanTuru} KPSS Puanı`}</h2>
                </div>
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-[#9F3A12]">
                    ±5 puan
                </span>
            </div>

            <div className="mt-5 rounded-lg bg-slate-950 p-5 text-white">
                <p className="text-sm font-semibold text-slate-300">Tahmini puan</p>
                <p className="mt-1 tabular-nums text-5xl font-black tracking-tight">
                    {result.puanUretildi ? formatNumber(result.tahminiPuan) : "-"}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-300">
                    Güven aralığı: {result.puanUretildi ? `${formatNumber(result.guvenAraligi[0])} - ${formatNumber(result.guvenAraligi[1])}` : "puan üretilmedi"}
                </p>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
                Bu sonuç resmi ÖSYM puanı değildir. ÖSYM nihai puanı sınav sonrası standart sapma, aday dağılımı ve kılavuzdaki güncel kurallarla hesaplar.
            </div>

            {result.uyarilar.length > 0 ? (
                <div role="alert" aria-live="polite" className="mt-4 space-y-2">
                    {result.uyarilar.map((uyari) => (
                        <p key={uyari} className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800">
                            <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
                            {uyari}
                        </p>
                    ))}
                </div>
            ) : (
                <p className="mt-4 flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
                    <CheckCircle2 size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
                    Ham puan eşiği karşılandı; sonuç planlama amaçlı üretildi.
                </p>
            )}

            <div className="mt-5 overflow-x-hidden">
                <table className="w-full table-fixed text-left text-sm">
                    <caption className="sr-only">Net ve ağırlıklı katkı dökümü</caption>
                    <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <tr>
                            <th scope="col" className="w-[22%] py-2 pr-2">Test</th>
                            <th scope="col" className="w-[22%] py-2 pr-2">Net</th>
                            <th scope="col" className="w-[28%] py-2 pr-2">Katsayı</th>
                            <th scope="col" className="w-[28%] py-2">Katkı</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {result.katkilar.map((item) => (
                            <tr key={item.test}>
                                <th scope="row" className="py-3 pr-2 font-black text-slate-950">{item.test}</th>
                                <td className="py-3 pr-2 tabular-nums">{formatNumber(item.net)}</td>
                                <td className="py-3 pr-2 tabular-nums">{formatNumber(item.katsayi)}</td>
                                <td className="py-3 tabular-nums font-bold">{formatNumber(item.katkı)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">{KATSAYILAR[puanTuru].aciklama}</p>
        </section>
    );
}
