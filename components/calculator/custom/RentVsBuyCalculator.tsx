"use client";

import React, { useMemo, useState } from "react";
import { ArrowRightLeft, CircleDollarSign, Home, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateRentVsBuy, type RentVsBuyWinner } from "@/lib/rentVsBuy";

type Lang = "tr" | "en";

type Values = {
    homePrice: number;
    downPayment: number;
    mortgageRate: number;
    mortgageTermYears: number;
    monthlyRent: number;
    annualRentIncrease: number;
    monthlyOwnerCosts: number;
    annualHomeAppreciation: number;
    annualInvestmentReturn: number;
    analysisYears: number;
};

const initialValues: Values = {
    homePrice: 2500000,
    downPayment: 500000,
    mortgageRate: 2.89,
    mortgageTermYears: 10,
    monthlyRent: 25000,
    annualRentIncrease: 20,
    monthlyOwnerCosts: 3000,
    annualHomeAppreciation: 15,
    annualInvestmentReturn: 18,
    analysisYears: 10,
};

const copy = {
    tr: {
        heroTitle: "Kira mı kalmalı, konut kredisi mi daha güçlü?",
        heroText: "Aylık nakit baskısını, dönem sonu özsermayeyi ve peşinatın alternatif getirisini aynı modelde karşılaştır. Sağdaki karar kartı her varsayım değiştiğinde anında güncellenir.",
        ownerAdvantage: "Ev almak önde",
        renterAdvantage: "Kirada kalmak önde",
        tie: "Sonuçlar başa baş",
        analysis: "Analiz ufku",
        years: "yıl",
        decisionCard: "Karar Özeti",
        gap: "Senaryolar arası fark",
        ownerEquity: "Ev sahibi özsermayesi",
        renterPortfolio: "Kiracı portföyü",
        homeLoan: "Ev ve kredi senaryosu",
        homeLoanText: "Konut değeri, peşinat ve kredi yapısını girin.",
        rentPlan: "Kira ve yaşam maliyeti",
        rentPlanText: "Kira tarafının bugünkü nakit akışını kurun.",
        assumptions: "Piyasa varsayımları",
        assumptionsText: "Fiyat artışı ve alternatif yatırım getirisi sonucu en çok etkileyen iki değişkendir.",
        ownerTrack: "Satın alma senaryosu",
        renterTrack: "Kiracı senaryosu",
        startPressure: "İlk ay bütçe farkı",
        endPressure: "Dönem sonu aylık fark",
        finalHomeValue: "Dönem sonu konut değeri",
        remainingPrincipal: "Kalan kredi anaparası",
        totalOwnerOutflow: "Toplam sahiplik nakit çıkışı",
        totalRentPaid: "Toplam kira ödemesi",
        monthlyInstallment: "Aylık kredi taksiti",
        endingRent: "Dönem sonu aylık kira",
        modelNote: "Model notu",
        modelText: "Kiracı portföyü; peşinatı ve her ay iki senaryo arasındaki nakit farkını yatırır. Fark eksiye dönerse model, portföyden çekim yapıldığını varsayar; böylece karşılaştırma tek yönlü iyimser kalmaz.",
        homePrice: "Konut fiyatı",
        downPayment: "Peşinat",
        mortgageRate: "Aylık konut kredisi faizi",
        mortgageTermYears: "Kredi vadesi",
        monthlyRent: "Başlangıç aylık kira",
        annualRentIncrease: "Yıllık kira artışı",
        monthlyOwnerCosts: "Aidat, bakım ve ek gider",
        annualHomeAppreciation: "Yıllık konut değer artışı",
        annualInvestmentReturn: "Kiracı tarafı yatırım getirisi",
        analysisYearsInput: "Karşılaştırma süresi",
    },
    en: {
        heroTitle: "Should you keep renting or use a mortgage?",
        heroText: "Compare monthly cash pressure, end-period equity, and the opportunity cost of the down payment in one model. The decision card updates instantly as your assumptions change.",
        ownerAdvantage: "Buying leads",
        renterAdvantage: "Renting leads",
        tie: "Results are close",
        analysis: "Analysis horizon",
        years: "years",
        decisionCard: "Decision Snapshot",
        gap: "Scenario gap",
        ownerEquity: "Owner equity",
        renterPortfolio: "Renter portfolio",
        homeLoan: "Home and mortgage setup",
        homeLoanText: "Enter property value, down payment, and mortgage terms.",
        rentPlan: "Rent and living costs",
        rentPlanText: "Set the renter-side cash flow baseline.",
        assumptions: "Market assumptions",
        assumptionsText: "Price appreciation and alternative return assumptions drive the outcome most.",
        ownerTrack: "Buying scenario",
        renterTrack: "Renting scenario",
        startPressure: "First-month cash gap",
        endPressure: "End-period monthly gap",
        finalHomeValue: "End-period home value",
        remainingPrincipal: "Remaining loan principal",
        totalOwnerOutflow: "Total owner cash outflow",
        totalRentPaid: "Total rent paid",
        monthlyInstallment: "Monthly mortgage payment",
        endingRent: "End-period monthly rent",
        modelNote: "Model note",
        modelText: "The renter portfolio invests both the down payment and the monthly cash-flow difference between the two scenarios. When the difference turns negative, the model assumes a withdrawal from the portfolio so the comparison does not stay one-sidedly optimistic.",
        homePrice: "Home price",
        downPayment: "Down payment",
        mortgageRate: "Monthly mortgage rate",
        mortgageTermYears: "Mortgage term",
        monthlyRent: "Starting monthly rent",
        annualRentIncrease: "Annual rent increase",
        monthlyOwnerCosts: "Maintenance and owner costs",
        annualHomeAppreciation: "Annual home appreciation",
        annualInvestmentReturn: "Renter investment return",
        analysisYearsInput: "Analysis period",
    },
};

function formatCurrency(value: number, lang: Lang) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }) + " TL";
}

function formatSignedCurrency(value: number, lang: Lang) {
    const absValue = formatCurrency(Math.abs(value), lang);
    return value >= 0 ? `+${absValue}` : `-${absValue}`;
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

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">{children}</div>
        </section>
    );
}

function WinnerTone(winner: RentVsBuyWinner) {
    if (winner === "owner") {
        return {
            card: "border-emerald-200 bg-emerald-50/90",
            pill: "bg-emerald-600 text-white",
            accent: "text-emerald-700",
        };
    }

    if (winner === "renter") {
        return {
            card: "border-amber-200 bg-amber-50/90",
            pill: "bg-amber-500 text-slate-950",
            accent: "text-amber-700",
        };
    }

    return {
        card: "border-slate-200 bg-slate-50",
        pill: "bg-slate-700 text-white",
        accent: "text-slate-700",
    };
}

export default function RentVsBuyCalculator({ lang }: { lang: Lang }) {
    const t = copy[lang];
    const [values, setValues] = useState<Values>(initialValues);

    const results = useMemo(() => calculateRentVsBuy(values), [values]);
    const tone = WinnerTone(results.winner);

    const winnerLabel = results.winner === "owner"
        ? t.ownerAdvantage
        : results.winner === "renter"
            ? t.renterAdvantage
            : t.tie;

    const updateValue = (key: keyof Values, value: number) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_40%,#f8fafc_100%)] p-5 shadow-sm sm:p-7">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                            <ArrowRightLeft size={14} className="text-emerald-600" />
                            {t.analysis}: {values.analysisYears} {t.years}
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{t.heroTitle}</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t.heroText}</p>
                    </div>
                    <div className={cn("rounded-[28px] border p-5 shadow-sm backdrop-blur", tone.card)}>
                        <div className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", tone.pill)}>{winnerLabel}</div>
                        <div className="mt-4 text-sm text-slate-500">{t.gap}</div>
                        <div className={cn("mt-1 text-3xl font-black tracking-tight", tone.accent)}>{formatCurrency(results.comparisonGap, lang)}</div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">{results.summary[lang]}</p>
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                <div className="space-y-6">
                    <SectionCard title={t.homeLoan} description={t.homeLoanText}>
                        <NumberField label={t.homePrice} suffix="TL" value={values.homePrice} onChange={(value) => updateValue("homePrice", value)} />
                        <NumberField label={t.downPayment} suffix="TL" value={values.downPayment} onChange={(value) => updateValue("downPayment", value)} />
                        <NumberField label={t.mortgageRate} suffix="%" value={values.mortgageRate} onChange={(value) => updateValue("mortgageRate", value)} />
                        <NumberField label={t.mortgageTermYears} suffix={t.years} value={values.mortgageTermYears} onChange={(value) => updateValue("mortgageTermYears", value)} />
                    </SectionCard>

                    <SectionCard title={t.rentPlan} description={t.rentPlanText}>
                        <NumberField label={t.monthlyRent} suffix="TL" value={values.monthlyRent} onChange={(value) => updateValue("monthlyRent", value)} />
                        <NumberField label={t.annualRentIncrease} suffix="%" value={values.annualRentIncrease} onChange={(value) => updateValue("annualRentIncrease", value)} />
                        <NumberField label={t.monthlyOwnerCosts} suffix="TL" value={values.monthlyOwnerCosts} onChange={(value) => updateValue("monthlyOwnerCosts", value)} />
                        <NumberField label={t.analysisYearsInput} suffix={t.years} value={values.analysisYears} onChange={(value) => updateValue("analysisYears", value)} />
                    </SectionCard>

                    <SectionCard title={t.assumptions} description={t.assumptionsText}>
                        <NumberField label={t.annualHomeAppreciation} suffix="%" value={values.annualHomeAppreciation} onChange={(value) => updateValue("annualHomeAppreciation", value)} />
                        <NumberField label={t.annualInvestmentReturn} suffix="%" value={values.annualInvestmentReturn} onChange={(value) => updateValue("annualInvestmentReturn", value)} />
                    </SectionCard>
                </div>

                <div className="space-y-6 lg:sticky lg:top-24">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <CircleDollarSign size={16} className="text-blue-600" />
                            {t.decisionCard}
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.ownerEquity}</div>
                                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(results.ownerEquity, lang)}</div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.renterPortfolio}</div>
                                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(results.renterPortfolio, lang)}</div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.startPressure}</div>
                                <div className="mt-2 text-lg font-bold text-slate-900">{formatSignedCurrency(results.monthlyCostDifferenceStart, lang)}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.endPressure}</div>
                                <div className="mt-2 text-lg font-bold text-slate-900">{formatSignedCurrency(results.monthlyCostDifferenceEnd, lang)}</div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                                <Home size={16} />
                                {t.ownerTrack}
                            </div>
                            <div className="mt-4 space-y-3 text-sm text-slate-700">
                                <MetricRow label={t.monthlyInstallment} value={formatCurrency(results.monthlyMortgagePayment, lang)} />
                                <MetricRow label={t.totalOwnerOutflow} value={formatCurrency(results.ownerCashOutflow, lang)} />
                                <MetricRow label={t.finalHomeValue} value={formatCurrency(results.homeValueAfterPeriod, lang)} />
                                <MetricRow label={t.remainingPrincipal} value={formatCurrency(results.remainingPrincipal, lang)} />
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-blue-200 bg-blue-50/70 p-5 shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                                <Wallet size={16} />
                                {t.renterTrack}
                            </div>
                            <div className="mt-4 space-y-3 text-sm text-slate-700">
                                <MetricRow label={t.totalRentPaid} value={formatCurrency(results.renterCashOutflow, lang)} />
                                <MetricRow label={t.endingRent} value={formatCurrency(results.monthlyRentEnd, lang)} />
                                <MetricRow label={t.renterPortfolio} value={formatCurrency(results.renterPortfolio, lang)} />
                                <MetricRow label={t.startPressure} value={formatSignedCurrency(results.monthlyCostDifferenceStart, lang)} />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <TrendingUp size={16} className="text-blue-600" />
                            {t.modelNote}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{t.modelText}</p>
                    </section>
                </div>
            </div>
        </div>
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