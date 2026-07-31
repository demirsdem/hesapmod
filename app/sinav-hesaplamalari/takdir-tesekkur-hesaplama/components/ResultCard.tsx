"use client";

import { AlertTriangle, CheckCircle2, Printer, RotateCcw, Share2, XCircle } from "lucide-react";
import type { HesapSonucu } from "../lib/takdir-calc";

function formatNumber(value: number) {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function resultCopy(result: HesapSonucu) {
    if (result.sonuc === "takdir") {
        return {
            icon: CheckCircle2,
            title: "Takdir Belgesi",
            tone: "border-emerald-200 bg-emerald-50 text-emerald-950",
            message: "Tüm şartları karşılıyorsunuz. Tebrikler!",
        };
    }

    if (result.sonuc === "tesekkur") {
        return {
            icon: CheckCircle2,
            title: "Teşekkür Belgesi",
            tone: "border-sky-200 bg-sky-50 text-sky-950",
            message: "Ortalama ve diğer belge şartları uygun görünüyor.",
        };
    }

    if (result.sonuc === "engel_ortalama") {
        return {
            icon: XCircle,
            title: "Belge Alamazsınız",
            tone: "border-red-200 bg-red-50 text-red-950",
            message: "Ağırlıklı ortalamanız 70,00 belge barajının altında.",
        };
    }

    return {
        icon: AlertTriangle,
        title: "Ortalama Tamam, Ama Belge Yok",
        tone: "border-amber-200 bg-amber-50 text-amber-950",
        message: "Ortalamanız belge bandında olsa da aşağıdaki engeller giderilmeden belge alamazsınız.",
    };
}

export default function ResultCard({
    result,
    onShare,
    onPrint,
    onReset,
    shareStatus,
}: {
    result: HesapSonucu;
    onShare: () => void;
    onPrint: () => void;
    onReset: () => void;
    shareStatus: string;
}) {
    const copy = resultCopy(result);
    const Icon = copy.icon;
    const simulatedAverage = result.ortalama + result.enEtkilDersEtkisi;
    const showSimulation = result.ortalama >= 70 && result.ortalama < 85;

    return (
        <div role="status" aria-live="polite" aria-atomic="true" className={`result-panel rounded-lg border p-5 shadow-sm ${copy.tone}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <Icon className="mt-1 h-7 w-7 shrink-0" aria-hidden="true" />
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{copy.title}</h3>
                        <p className="mt-1 text-base font-bold">Ağırlıklı Ortalamanız: {formatNumber(result.ortalama)}</p>
                        <p className="mt-2 text-sm font-semibold leading-6">{copy.message}</p>
                    </div>
                </div>
                <div className="rounded-lg bg-white/65 px-4 py-3 text-sm font-black text-slate-900">
                    {result.ortalama >= 85 ? "Takdir bandı" : result.ortalama >= 70 ? "Teşekkür bandı" : "Baraj altı"}
                </div>
            </div>

            {result.engelNedenler.length > 0 && (
                <div className="mt-4 rounded-lg border border-current/20 bg-white/65 p-4">
                    <p className="text-sm font-black">Engeller</p>
                    <ul className="mt-2 space-y-2 text-sm font-semibold leading-6">
                        {result.engelNedenler.map((reason) => (
                            <li key={reason}>Hata: {reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            {result.sonuc === "engel_ortalama" && (
                <div className="mt-4 rounded-lg border border-current/20 bg-white/65 p-4 text-sm font-semibold leading-6">
                    <p>Teşekkür için {formatNumber(result.tesekkurIcinEksik)} puan eksik.</p>
                    <p>Takdir için {formatNumber(result.takdirIcinEksik)} puan eksik.</p>
                    <p className="mt-2">
                        En etkili hamle: {result.enEtkilDers} dersinden 5 puan artırırsanız ortalamanız yaklaşık +
                        {formatNumber(result.enEtkilDersEtkisi)} yükselir.
                    </p>
                </div>
            )}

            {showSimulation && (
                <div className="mt-4 rounded-lg border border-current/20 bg-white/65 p-4 text-sm font-semibold leading-6">
                    <p className="text-base font-black">Takdir İçin Ne Yapmalısın?</p>
                    <p>Takdire {formatNumber(result.takdirIcinEksik)} puan eksik.</p>
                    <p className="mt-2">
                        En etkili hamle: {result.enEtkilDers} dersinden 5 puan artış, ortalamayı yaklaşık{" "}
                        {formatNumber(simulatedAverage)} yapar.
                    </p>
                </div>
            )}

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={onShare}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-[#0F1F3D] px-4 text-sm font-black text-white transition hover:bg-[#14284f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25"
                >
                    <Share2 size={18} aria-hidden="true" />
                    Sonucu Paylaş
                </button>
                <button
                    type="button"
                    onClick={onPrint}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-[#B84418] px-4 text-sm font-black text-white transition hover:bg-[#9F3A12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25"
                >
                    <Printer size={18} aria-hidden="true" />
                    Yazdır / PDF Al
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25"
                >
                    <RotateCcw size={18} aria-hidden="true" />
                    Sıfırla
                </button>
            </div>
            {shareStatus && <p className="mt-3 text-sm font-black text-slate-900">{shareStatus}</p>}
        </div>
    );
}
