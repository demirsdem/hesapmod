"use client";

import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import type { OggResult } from "../lib/ogg-calc";
import { formatScore } from "../lib/ogg-calc";

type ResultCardProps = {
    result: OggResult;
};

const resultStyles = {
    "armed-pass": {
        className: "bg-[#15803D] text-white",
        Icon: CheckCircle2,
    },
    "unarmed-pass": {
        className: "bg-[#1D4ED8] text-white",
        Icon: ShieldCheck,
    },
    borderline: {
        className: "bg-[#EA580C] text-white",
        Icon: AlertTriangle,
    },
    fail: {
        className: "bg-[#DC2626] text-white",
        Icon: XCircle,
    },
    empty: {
        className: "bg-slate-100 text-slate-800",
        Icon: AlertTriangle,
    },
} as const;

export default function ResultCard({ result }: ResultCardProps) {
    const { className, Icon } = resultStyles[result.kind];

    return (
        <section
            role="status"
            aria-live="polite"
            tabIndex={-1}
            id="ogg-result"
            className={`${className} result-panel rounded-xl p-5 shadow-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[#FF6B35]/40`}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                        <Icon size={24} aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide opacity-85">{result.statusLabel}</p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight">{result.title}</h2>
                        <p className="mt-2 text-sm font-semibold leading-6 opacity-95">{result.message}</p>
                    </div>
                </div>

                <div className="rounded-lg bg-white/15 px-4 py-3 text-left sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                        {result.mode === "armed" ? "Ortalama" : "Toplam Puan"}
                    </p>
                    <p className="mt-1 text-3xl font-black tabular-nums">
                        {formatScore(result.mode === "armed" ? result.averageScore : result.basicScore)}
                        <span className="text-lg opacity-80"> / 100</span>
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-2 text-sm font-semibold sm:grid-cols-3">
                <div className="rounded-lg bg-white/15 px-3 py-2">
                    Temel: {formatScore(result.basicScore)}
                </div>
                {result.mode === "armed" && (
                    <>
                        <div className="rounded-lg bg-white/15 px-3 py-2">
                            Silah bilgisi: {formatScore(result.weaponKnowledgeScore)}
                        </div>
                        <div className="rounded-lg bg-white/15 px-3 py-2">
                            Atış: {formatScore(result.shootingScore)}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
