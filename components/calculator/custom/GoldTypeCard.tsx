"use client";

import React from "react";

export interface GoldRowData {
    id: string;
    name: string;
    ayar: number;
    totalWeight: number;
    pureGold: number;
    isCoin: boolean;
    icon: string;
    unitPrice: number;
    qty: number;
    total: number;
}

interface GoldTypeCardProps {
    row: GoldRowData;
    hasPriceData: boolean;
    onQtyChange: (id: string, value: string) => void;
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

export default function GoldTypeCard({ row, hasPriceData, onQtyChange }: GoldTypeCardProps) {
    const active = row.qty > 0 && hasPriceData;

    const increment = () => onQtyChange(row.id, String(row.qty + 1));
    const decrement = () => onQtyChange(row.id, String(Math.max(0, row.qty - 1)));

    return (
        <div
            className={`rounded-xl border transition-all duration-200 ${
                active
                    ? "border-amber-300 bg-amber-50/60 shadow-md"
                    : "border-slate-200 bg-white shadow-sm"
            }`}
            style={{ minHeight: 72, padding: "12px 14px" }}
        >
            {/* Row 1 — Icon, Name, Unit Price */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-xl leading-none mt-0.5 flex-shrink-0" aria-hidden="true">
                        {row.icon}
                    </span>
                    <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 leading-tight truncate">
                            {row.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                            {row.ayar}K · {fmtW(row.pureGold)}g has
                            {row.isCoin && (
                                <span className="ml-1.5 inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0 text-[10px] font-medium text-blue-700">
                                    Sikke
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-bold text-slate-800 tabular-nums">
                        {hasPriceData ? fmt(row.unitPrice) + " ₺" : "—"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">birim</p>
                </div>
            </div>

            {/* Row 2 — Stepper + Total */}
            <div className="mt-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-0">
                    <button
                        type="button"
                        onClick={decrement}
                        aria-label={`${row.name} adedini azalt`}
                        className="flex items-center justify-center rounded-l-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold text-lg transition-colors hover:bg-slate-100 active:bg-slate-200"
                        style={{ minHeight: 44, minWidth: 44 }}
                    >
                        −
                    </button>
                    <input
                        type="number"
                        min="0"
                        step="any"
                        value={row.qty === 0 ? "0" : String(row.qty)}
                        onChange={(e) => onQtyChange(row.id, e.target.value)}
                        aria-label={`${row.name} adet`}
                        className="w-16 border-y border-slate-300 bg-white text-center text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                        style={{ minHeight: 44 }}
                    />
                    <button
                        type="button"
                        onClick={increment}
                        aria-label={`${row.name} adedini artır`}
                        className="flex items-center justify-center rounded-r-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold text-lg transition-colors hover:bg-slate-100 active:bg-slate-200"
                        style={{ minHeight: 44, minWidth: 44 }}
                    >
                        +
                    </button>
                    <span className="ml-2 text-[11px] text-slate-400 font-medium">adet</span>
                </div>

                {active && (
                    <p className="text-[15px] font-bold text-amber-800 tabular-nums whitespace-nowrap">
                        = {fmt(row.total)} ₺
                    </p>
                )}
            </div>
        </div>
    );
}
