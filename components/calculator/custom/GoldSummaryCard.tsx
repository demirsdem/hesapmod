"use client";

import React from "react";
import type { GoldRowData } from "./GoldTypeCard";

interface GoldSummaryCardProps {
    rows: GoldRowData[];
    totals: { hasGold: number; weight: number; value: number };
    txType: "buy" | "sell";
}

function fmt(n: number, dec = 2): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function fmtW(n: number): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    });
}

export default function GoldSummaryCard({ rows, totals, txType }: GoldSummaryCardProps) {
    const activeRows = rows.filter((r) => r.qty > 0);

    if (activeRows.length === 0) return null;

    return (
        <div className="rounded-2xl bg-gradient-to-br from-amber-900 to-amber-700 p-5 shadow-lg text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-amber-200">
                    Toplam Portföy Değeri
                </h3>
                <span className="rounded-full bg-white/15 border border-white/20 px-3 py-1 text-[11px] font-semibold text-white/90">
                    {txType === "buy" ? "Alış Fiyatıyla" : "Satış Fiyatıyla"}
                </span>
            </div>

            {/* Big Total */}
            <p className="text-3xl font-extrabold tabular-nums leading-tight">
                {fmt(totals.value)} ₺
            </p>

            {/* Sub-stats */}
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                <span className="text-sm text-amber-200">
                    Has altın toplamı: <strong className="text-white">{fmtW(totals.hasGold)} g</strong>
                </span>
                <span className="text-sm text-amber-200">
                    Toplam ağırlık: <strong className="text-white">{fmtW(totals.weight)} g</strong>
                </span>
            </div>

            {/* Active rows breakdown */}
            <div className="mt-4 rounded-xl bg-white/10 border border-white/15 divide-y divide-white/10 overflow-hidden">
                {activeRows.map((r) => (
                    <div key={r.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="text-amber-100 font-medium">
                            {r.icon} {r.name} × {r.qty}
                        </span>
                        <span className="font-bold text-white tabular-nums">
                            {fmt(r.total)} ₺
                        </span>
                    </div>
                ))}
            </div>

            {/* Disclaimer */}
            <p className="mt-4 text-[11px] text-amber-300/80 leading-relaxed">
                ⚠️ Hesaplamalar, standart has altın içerikleri ve girdiğiniz parametreler esas
                alınarak yapılmıştır. Gerçek alım-satım fiyatları kuyumcu, banka ve borsa
                arasında farklılık gösterebilir.
            </p>
        </div>
    );
}
