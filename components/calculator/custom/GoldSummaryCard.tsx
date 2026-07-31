"use client";

import React, { useState } from "react";
import type { GoldRowData } from "./GoldTypeCard";

interface GoldSummaryCardProps {
    rows: GoldRowData[];
    totals: { hasGold: number; weight: number; value: number };
    txType: "buy" | "sell";
    gramPrice: number;
    priceSourceLabel: string;
}

function fmt(n: number, dec = 2): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function fmtCopyMoney(n: number): string {
    return n.toLocaleString("tr-TR", {
        maximumFractionDigits: 0,
    });
}

function fmtQty(n: number): string {
    return n.toLocaleString("tr-TR", {
        maximumFractionDigits: 3,
    });
}

function fmtCopyWeight(n: number): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
}

export default function GoldSummaryCard({ rows, totals, txType, gramPrice, priceSourceLabel }: GoldSummaryCardProps) {
    const [copied, setCopied] = useState(false);
    const activeRows = rows.filter((r) => r.qty > 0);

    if (activeRows.length === 0) return null;

    const copyResult = async () => {
        const text = [
            "💛 Altın Birikimim (hesapmod.com)",
            "━━━━━━━━━━━━━━━━━",
            ...activeRows.map((r) => `${r.name} (${fmtQty(r.qty)} adet): ₺ ${fmtCopyMoney(r.total)}`),
            "━━━━━━━━━━━━━━━━━",
            `Has Altın: ${fmtCopyWeight(totals.hasGold)}g | Toplam: ₺ ${fmtCopyMoney(totals.value)}`,
            `Gram fiyatı: ₺ ${fmtCopyMoney(gramPrice)} (${priceSourceLabel})`,
        ].join("\n");

        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                        Toplam Birikim
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        {txType === "buy" ? "Bu altınları almak için" : "Bu altınları satarsanız"}
                    </p>
                </div>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-800">
                    {txType === "buy" ? "Alış Fiyatıyla" : "Satış Fiyatıyla"}
                </span>
            </div>

            <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60">
                {activeRows.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                        <span className="font-medium text-slate-700">
                            {r.name} ({fmtQty(r.qty)} adet)
                        </span>
                        <span className="font-bold tabular-nums text-slate-900">
                            ₺ {fmtCopyMoney(r.total)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-600">Has Altın Toplamı:</span>
                    <strong className="tabular-nums text-slate-900">{fmt(totals.hasGold, 2)} g</strong>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-600">Toplam Ağırlık:</span>
                    <strong className="tabular-nums text-slate-900">{fmt(totals.weight, 2)} g</strong>
                </div>
                <div className="border-t border-slate-200 pt-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <span className="text-base font-extrabold text-slate-900">Toplam Değer:</span>
                        <strong className="text-3xl font-extrabold leading-none tabular-nums text-slate-950 sm:text-4xl">
                            ₺ {fmtCopyMoney(totals.value)}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                    Gram fiyatı ₺ {fmtCopyMoney(gramPrice)} ({priceSourceLabel})
                </p>
                <button
                    type="button"
                    onClick={() => void copyResult()}
                    className="rounded-lg border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                >
                    {copied ? "Kopyalandı" : "Sonucu Kopyala"}
                </button>
            </div>
        </div>
    );
}
