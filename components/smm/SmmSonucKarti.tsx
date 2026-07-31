"use client";

import { formatTRY, formatYuzde } from "@/lib/smm-calculator";
import type { SmmResult } from "@/types/smm";

function ResultCard({
    label,
    value,
    note,
}: {
    label: string;
    value: string;
    note: string;
}) {
    return (
        <article className="min-h-[142px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-600">{label}</p>
            <p className="mt-3 min-w-[120px] whitespace-nowrap text-[1.45rem] font-black leading-tight tracking-tight text-slate-950 tabular-nums sm:text-2xl lg:text-[1.45rem] xl:text-2xl">
                {value}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{note}</p>
        </article>
    );
}

export default function SmmSonucKarti({
    result,
    kdvOrani,
    stopajOrani,
}: {
    result: SmmResult | null;
    kdvOrani: number;
    stopajOrani: number;
}) {
    if (!result) {
        return (
            <section
                aria-live="polite"
                aria-atomic="true"
                className="min-h-[360px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Sonuç</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">SMM ön hesabı</h2>
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-600">
                    Hesaplama için pozitif bir tutar girin.
                </div>
            </section>
        );
    }

    const cards = [
        { label: "Brüt Hizmet", value: formatTRY(result.brutTutar), note: "Hizmet bedeli" },
        { label: "KDV Tutarı", value: formatTRY(result.kdvTutari), note: `${formatYuzde(kdvOrani)} oranıyla` },
        { label: "Stopaj Tutarı", value: formatTRY(result.stopajTutari), note: `${formatYuzde(stopajOrani)}, müşteri beyan eder` },
        { label: "Tahsil Edilecek", value: formatTRY(result.tahsilEdilecek), note: "Brüt + KDV - stopaj" },
        { label: "Net Gelirim", value: formatTRY(result.netGelir), note: "Stopaj sonrası gelir" },
        { label: "Vergi Yükü", value: formatYuzde(result.efektifVergiYuku), note: "Stopaj / brüt hizmet" },
    ];

    return (
        <section aria-live="polite" aria-atomic="true" aria-label="SMM hesaplama sonucu">
            <div className="grid gap-3 sm:grid-cols-2">
                {cards.map((card) => (
                    <ResultCard key={card.label} {...card} />
                ))}
            </div>
        </section>
    );
}
