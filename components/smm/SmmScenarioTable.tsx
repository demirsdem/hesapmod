"use client";

import { useMemo } from "react";
import { formatTRY, popularSmmHesaplamalar } from "@/lib/smm-calculator";

export default function SmmScenarioTable({
    currentAmount,
    kdvOrani,
    stopajOrani,
    onSelectAmount,
}: {
    currentAmount: number;
    kdvOrani: number;
    stopajOrani: number;
    onSelectAmount: (amount: number) => void;
}) {
    const rows = useMemo(
        () => popularSmmHesaplamalar({ kdvOrani, stopajOrani }),
        [kdvOrani, stopajOrani]
    );
    const activeBrut = useMemo(() => {
        if (!Number.isFinite(currentAmount) || currentAmount <= 0) {
            return 10000;
        }

        return rows.reduce((closest, row) => (
            Math.abs(row.brut - currentAmount) < Math.abs(closest - currentAmount) ? row.brut : closest
        ), rows[0]?.brut ?? 10000);
    }, [currentAmount, rows]);

    return (
        <section aria-labelledby="smm-senaryo-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="smm-senaryo-heading" className="text-2xl font-black tracking-tight text-slate-950">
                Sık Kullanılan SMM Tutarları
            </h2>
            <div className="mt-5 overflow-x-auto">
                <table className="min-w-[720px] w-full text-left text-sm">
                    <caption className="sr-only">Brüt tutara göre SMM senaryo tablosu</caption>
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th scope="col" className="px-3 py-3">Brüt Tutar</th>
                            <th scope="col" className="px-3 py-3">KDV</th>
                            <th scope="col" className="px-3 py-3">Stopaj</th>
                            <th scope="col" className="px-3 py-3">Tahsil</th>
                            <th scope="col" className="px-3 py-3">Net</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row) => {
                            const isActive = row.brut === activeBrut;
                            return (
                                <tr
                                    key={row.brut}
                                    onClick={() => onSelectAmount(row.brut)}
                                    className={`cursor-pointer transition ${isActive ? "bg-orange-50 text-slate-950" : "hover:bg-slate-50"}`}
                                >
                                    <th scope="row" className="px-3 py-3 font-black tabular-nums">{formatTRY(row.brut)}</th>
                                    <td className="px-3 py-3 font-semibold tabular-nums">{formatTRY(row.kdvTutari)}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums">{formatTRY(row.stopajTutari)}</td>
                                    <td className="px-3 py-3 font-black tabular-nums">{formatTRY(row.tahsilEdilecek)}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums">{formatTRY(row.netGelir)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                Satıra tıklayınca brüt tutar forma aktarılır.
            </p>
        </section>
    );
}
