"use client";

import { Clipboard, Printer } from "lucide-react";
import { useState } from "react";
import { formatTRY, formatYuzde } from "@/lib/smm-calculator";
import type { SmmResult } from "@/types/smm";

export default function SmmOzetTablosu({
    result,
    kdvOrani,
    stopajOrani,
}: {
    result: SmmResult | null;
    kdvOrani: number;
    stopajOrani: number;
}) {
    const [status, setStatus] = useState("");

    if (!result) {
        return null;
    }

    const copyText = [
        "SMM Ön Hesaplama (hesapmod.com)",
        `Hizmet Bedeli: ${formatTRY(result.brutTutar)}`,
        `KDV (${formatYuzde(kdvOrani)}): ${formatTRY(result.kdvTutari)}`,
        `Stopaj (${formatYuzde(stopajOrani)}): ${formatTRY(result.stopajTutari)}`,
        `Tahsil Edilecek: ${formatTRY(result.tahsilEdilecek)}`,
        `Net Gelirim: ${formatTRY(result.netGelir)}`,
        "Bu hesaplama bilgilendirme amaçlıdır.",
    ].join("\n");

    const handleCopy = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
            setStatus("Kopyalama desteklenmiyor.");
            return;
        }

        try {
            await navigator.clipboard.writeText(copyText);
            setStatus("Özet kopyalandı.");
        } catch {
            setStatus("Özet kopyalanamadı.");
        }
    };

    return (
        <section aria-labelledby="smm-makbuz-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="print-area rounded-lg border border-slate-300 bg-white p-5">
                <div className="border-b border-slate-200 pb-4 text-center">
                    <h2 id="smm-makbuz-heading" className="text-xl font-black tracking-tight text-slate-950">
                        SERBEST MESLEK MAKBUZU
                    </h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">Ön Hesaplama</p>
                </div>

                <div className="mt-5 space-y-3 text-sm sm:text-base">
                    <div className="flex justify-between gap-4">
                        <span className="font-semibold text-slate-700">Hizmet Bedeli (Brüt)</span>
                        <span className="min-w-[120px] text-right font-black tabular-nums">{formatTRY(result.brutTutar)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="font-semibold text-slate-700">(+) KDV ({formatYuzde(kdvOrani)})</span>
                        <span className="min-w-[120px] text-right font-black text-emerald-700 tabular-nums">+ {formatTRY(result.kdvTutari)}</span>
                    </div>
                    <hr className="border-slate-200" />
                    <div className="flex justify-between gap-4">
                        <span className="font-semibold text-slate-700">Toplam</span>
                        <span className="min-w-[120px] text-right font-black tabular-nums">{formatTRY(result.brutTutar + result.kdvTutari)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="font-semibold text-slate-700">(-) Gelir Vergisi Stopajı ({formatYuzde(stopajOrani)}, müşteri beyan)</span>
                        <span className="min-w-[120px] text-right font-black text-red-700 tabular-nums">- {formatTRY(result.stopajTutari)}</span>
                    </div>
                    <hr className="border-slate-200" />
                    <div className="flex justify-between gap-4 rounded-lg bg-slate-950 px-4 py-3 text-white">
                        <span className="font-black">TAHSİL EDİLECEK</span>
                        <span className="min-w-[120px] text-right font-black tabular-nums">{formatTRY(result.tahsilEdilecek)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="font-semibold text-slate-700">Net Gelirim <span className="text-xs text-slate-500">(stopaj sonrası)</span></span>
                        <span className="min-w-[120px] text-right font-black tabular-nums">{formatTRY(result.netGelir)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                >
                    <Clipboard size={17} aria-hidden="true" />
                    Özeti Kopyala
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                >
                    <Printer size={17} aria-hidden="true" />
                    Yazdır
                </button>
            </div>
            {status && <p role="status" aria-live="polite" className="mt-3 text-sm font-bold text-emerald-700">{status}</p>}
        </section>
    );
}
