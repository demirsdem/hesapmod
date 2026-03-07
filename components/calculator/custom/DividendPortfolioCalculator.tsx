"use client";

import React, { useMemo, useState } from "react";
import { BadgePercent, Coins, Landmark, PiggyBank, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateDividendPortfolio } from "@/lib/dividendPortfolio";

type Lang = "tr" | "en";

type Values = {
    shareCount: number;
    avgCost: number;
    currentPrice: number;
    dividendPerShare: number;
};

const initialValues: Values = {
    shareCount: 100,
    avgCost: 50,
    currentPrice: 75,
    dividendPerShare: 2.5,
};

const copy = {
    tr: {
        heroTitle: "Temettü ve fiyat kazancını aynı portföy ekranında gör",
        heroText: "Temettü emekliliği hedefliyorsan sadece dağıtılan nakde değil, maliyet bazına, piyasa verimine ve toplam getiriye birlikte bakman gerekir.",
        shares: "Hisse adedi",
        setupTitle: "Portföy kurulumu",
        setupText: "Lot sayısını, ortalama maliyetini, güncel fiyatı ve net temettüyü gir.",
        avgCost: "Ortalama maliyet",
        currentPrice: "Güncel fiyat",
        dividendPerShare: "Hisse başı net temettü",
        snapshotTitle: "Getiri özeti",
        totalReturn: "Toplam getiri",
        totalReturnRate: "Toplam getiri oranı",
        costBasis: "Toplam maliyet bazınız",
        marketValue: "Güncel piyasa değeri",
        totalDividend: "Toplam temettü",
        capitalGain: "Sermaye kazancı",
        yieldBoard: "Verim tablosu",
        yieldOnCost: "Maliyetine temettü verimi",
        yieldOnPrice: "Güncel fiyata göre verim",
        breakeven: "Temettü sonrası başa baş fiyat",
        decisionNote: "Karar notu",
        decisionText: "Maliyetine verim, uzun vadeli biriktirme disiplinini; güncel fiyata göre verim ise bugün aynı hisseyi yeniden almanın nakit getirisini anlatır. İkisini karıştırmadan okumak gerekir.",
        profit: "Portföy kârda",
        loss: "Portföy ekside",
        flat: "Portföy başa baş",
    },
    en: {
        heroTitle: "See dividends and price gains in one portfolio view",
        heroText: "If you are building a dividend portfolio, you need to read cash distributions, cost basis, market yield, and total return together rather than in isolation.",
        shares: "Shares held",
        setupTitle: "Portfolio setup",
        setupText: "Enter lot size, average cost, current price, and net dividend per share.",
        avgCost: "Average cost",
        currentPrice: "Current price",
        dividendPerShare: "Net dividend per share",
        snapshotTitle: "Return snapshot",
        totalReturn: "Total return",
        totalReturnRate: "Total return rate",
        costBasis: "Total cost basis",
        marketValue: "Current market value",
        totalDividend: "Total dividend",
        capitalGain: "Capital gain",
        yieldBoard: "Yield board",
        yieldOnCost: "Yield on cost",
        yieldOnPrice: "Yield on current price",
        breakeven: "Break-even price after dividend",
        decisionNote: "Decision note",
        decisionText: "Yield on cost reflects your long-term accumulation discipline, while yield on current price reflects the cash return of buying the same stock today. They should not be read as the same metric.",
        profit: "Portfolio in profit",
        loss: "Portfolio in loss",
        flat: "Portfolio at break-even",
    },
};

function formatCurrency(value: number, lang: Lang) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }) + " TL";
}

function formatPercent(value: number, lang: Lang) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + "%";
}

function NumberField({
    label,
    suffix,
    value,
    onChange,
}: {
    label: string;
    suffix: string;
    value: number;
    onChange: (value: number) => void;
}) {
    return (
        <label className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={value}
                    onChange={(event) => onChange(Math.max(0, Number.parseFloat(event.target.value) || 0))}
                    className="h-11 w-full border-0 bg-transparent p-0 text-base font-semibold text-slate-900 outline-none"
                />
                <span className="shrink-0 text-sm font-medium text-slate-500">{suffix}</span>
            </div>
        </label>
    );
}

function MetricRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-b-0 last:pb-0">
            <span className="text-slate-500">{label}</span>
            <span className="text-right font-semibold text-slate-900">{value}</span>
        </div>
    );
}

export default function DividendPortfolioCalculator({ lang }: { lang: Lang }) {
    const t = copy[lang];
    const [values, setValues] = useState(initialValues);
    const results = useMemo(() => calculateDividendPortfolio(values), [values]);

    const statusLabel = results.outlook === "profit"
        ? t.profit
        : results.outlook === "loss"
            ? t.loss
            : t.flat;

    const statusTone = results.outlook === "profit"
        ? "border-emerald-200 bg-emerald-50/90 text-emerald-800"
        : results.outlook === "loss"
            ? "border-rose-200 bg-rose-50/90 text-rose-800"
            : "border-slate-200 bg-slate-50 text-slate-700";

    const updateValue = (key: keyof Values, value: number) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_40%,#f8fafc_100%)] p-5 shadow-sm sm:p-7">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                            <Landmark size={14} className="text-emerald-600" />
                            {t.shares}: {values.shareCount.toLocaleString(lang === "tr" ? "tr-TR" : "en-US")}
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{t.heroTitle}</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t.heroText}</p>
                    </div>

                    <div className={cn("rounded-[28px] border p-5 shadow-sm backdrop-blur", statusTone)}>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold">
                            <TrendingUp size={14} />
                            {statusLabel}
                        </div>
                        <div className="mt-4 text-sm text-slate-500">{t.totalReturn}</div>
                        <div className="mt-1 text-3xl font-black tracking-tight text-slate-950">{formatCurrency(results.totalReturn, lang)}</div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">{results.summary[lang]}</p>
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
                <div className="space-y-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5">
                            <h3 className="text-xl font-bold tracking-tight text-slate-900">{t.setupTitle}</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{t.setupText}</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <NumberField label={t.shares} suffix="lot" value={values.shareCount} onChange={(value) => updateValue("shareCount", value)} />
                            <NumberField label={t.avgCost} suffix="TL" value={values.avgCost} onChange={(value) => updateValue("avgCost", value)} />
                            <NumberField label={t.currentPrice} suffix="TL" value={values.currentPrice} onChange={(value) => updateValue("currentPrice", value)} />
                            <NumberField label={t.dividendPerShare} suffix="TL" value={values.dividendPerShare} onChange={(value) => updateValue("dividendPerShare", value)} />
                        </div>
                    </section>
                </div>

                <div className="space-y-6 lg:sticky lg:top-24">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Coins size={16} className="text-blue-600" />
                            {t.snapshotTitle}
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.totalReturn}</div>
                                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(results.totalReturn, lang)}</div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.totalReturnRate}</div>
                                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatPercent(results.totalReturnRate, lang)}</div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 text-sm text-slate-700">
                            <MetricRow label={t.costBasis} value={formatCurrency(results.totalCostBasis, lang)} />
                            <MetricRow label={t.marketValue} value={formatCurrency(results.currentMarketValue, lang)} />
                            <MetricRow label={t.totalDividend} value={formatCurrency(results.totalDividend, lang)} />
                            <MetricRow label={t.capitalGain} value={formatCurrency(results.capitalGain, lang)} />
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <BadgePercent size={16} className="text-blue-600" />
                            {t.yieldBoard}
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-slate-700">
                            <MetricRow label={t.yieldOnCost} value={formatPercent(results.dividendYield, lang)} />
                            <MetricRow label={t.yieldOnPrice} value={formatPercent(results.currentYield, lang)} />
                            <MetricRow label={t.breakeven} value={formatCurrency(results.breakevenPriceAfterDividend, lang)} />
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <PiggyBank size={16} className="text-blue-600" />
                            {t.decisionNote}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{t.decisionText}</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
