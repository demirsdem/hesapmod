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
    const selected = row.qty > 0;
    const showTotal = selected && hasPriceData;

    const increment = () => onQtyChange(row.id, String(row.qty + 1));
    const decrement = () => onQtyChange(row.id, String(Math.max(0, row.qty - 1)));

    return (
        <div
            className={`rounded-xl border border-l-4 bg-white transition-all duration-200 ${
                selected
                    ? "border-slate-200 border-l-sky-500 shadow-md opacity-100"
                    : "border-slate-200 border-l-slate-200 shadow-sm opacity-40"
            }`}
            style={{ minHeight: 72, padding: "12px 14px" }}
        >
            {/* Row 1 — Icon, Name, Unit Price */}
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                    <span className="text-xl leading-none mt-0.5 flex-shrink-0" aria-hidden="true">
                        {row.icon}
                    </span>
                    <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 leading-tight break-words">
                            {row.name}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-slate-500 leading-tight">
                            {row.ayar}K · {fmtW(row.pureGold)}g has
                            {row.isCoin && (
                                <span className="inline-flex items-center rounded-full bg-[#FFF3EE] px-1.5 py-0 text-[10px] font-medium text-[#CC4A1A]">
                                    Sikke
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="min-w-[92px] max-w-full flex-shrink-0 text-right">
                    <p className="break-words text-[13px] font-bold text-slate-800 tabular-nums leading-tight">
                        {hasPriceData ? fmt(row.unitPrice) + " ₺" : "—"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">birim</p>
                </div>
            </div>

            {/* Row 2 — Stepper + Total */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex min-w-0 items-center gap-0">
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
                        className="w-14 border-y border-slate-300 bg-white text-center text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 sm:w-16"
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

                {showTotal && (
                    <p className="min-w-0 flex-1 break-words text-right text-[15px] font-bold text-sky-700 tabular-nums leading-tight">
                        = {fmt(row.total)} ₺
                    </p>
                )}
            </div>
        </div>
    );
}
