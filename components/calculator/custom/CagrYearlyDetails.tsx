"use client";

import { lazy, Suspense, useMemo, useState } from "react";

const CagrGrowthChart = lazy(() => import("./CagrGrowthChart"));

type Props = {
    startValue: number;
    cagrRate: number;
    years: number;
};

type YearlyPoint = {
    year: number;
    value: number;
    growthRate: number | null;
};

function formatTl(value: number) {
    return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL`;
}

function formatPercent(value: number) {
    return `%${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CagrYearlyDetails({ startValue, cagrRate, years }: Props) {
    const [showAll, setShowAll] = useState(false);

    const yearlyData = useMemo<YearlyPoint[]>(() => {
        const fullYears = Math.max(0, Math.floor(years));
        const rows: YearlyPoint[] = [
            { year: 0, value: startValue, growthRate: null },
            ...Array.from({ length: fullYears }, (_, index) => ({
                year: index + 1,
                value: startValue * Math.pow(1 + cagrRate, index + 1),
                growthRate: cagrRate * 100,
            })),
        ];

        if (!Number.isInteger(years) && years > fullYears) {
            rows.push({
                year: years,
                value: startValue * Math.pow(1 + cagrRate, years),
                growthRate: cagrRate * 100,
            });
        }

        return rows;
    }, [cagrRate, startValue, years]);

    const visibleRows = showAll ? yearlyData : yearlyData.slice(0, 20);
    const hasMoreRows = yearlyData.length > visibleRows.length;

    return (
        <details className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] [&::-webkit-details-marker]:hidden">
                <span>Yıl Yıl Detay</span>
                <span className="text-sm font-bold text-[#CC4A1A] group-open:hidden">Aç</span>
                <span className="hidden text-sm font-bold text-[#CC4A1A] group-open:inline">Kapat</span>
            </summary>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
                <Suspense
                    fallback={
                        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
                    }
                >
                    <CagrGrowthChart data={yearlyData} finalYear={Math.max(1, years)} />
                </Suspense>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left font-bold">Yıl</th>
                                <th scope="col" className="px-4 py-3 text-right font-bold">Değer</th>
                                <th scope="col" className="px-4 py-3 text-right font-bold">Büyüme</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleRows.map((row) => (
                                <tr key={row.year} className="odd:bg-white even:bg-slate-50">
                                    <td className="px-4 py-3 font-semibold text-slate-700">{row.year.toLocaleString("tr-TR")}</td>
                                    <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-950">{formatTl(row.value)}</td>
                                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-600">
                                        {row.growthRate === null ? "-" : `+${formatPercent(row.growthRate)}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {hasMoreRows && (
                        <button
                            type="button"
                            onClick={() => setShowAll(true)}
                            className="w-full border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-[#CC4A1A] transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                        >
                            Tümünü göster
                        </button>
                    )}
                </div>
            </div>
        </details>
    );
}
