"use client";

import React, { useMemo, useState } from "react";
import { ArrowRightLeft, BadgePercent, Coins, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateDebtPayoff, type DebtPayoffStrategy } from "@/lib/debtPayoff";

type Lang = "tr" | "en";

type Values = {
    strategy: DebtPayoffStrategy;
    debtOneBalance: number;
    debtOneRate: number;
    debtOneMinPayment: number;
    debtTwoBalance: number;
    debtTwoRate: number;
    debtTwoMinPayment: number;
    debtThreeBalance: number;
    debtThreeRate: number;
    debtThreeMinPayment: number;
    extraPayment: number;
};

const initialValues: Values = {
    strategy: "avalanche",
    debtOneBalance: 85000,
    debtOneRate: 4.25,
    debtOneMinPayment: 5500,
    debtTwoBalance: 42000,
    debtTwoRate: 3.49,
    debtTwoMinPayment: 3000,
    debtThreeBalance: 18000,
    debtThreeRate: 2.95,
    debtThreeMinPayment: 1800,
    extraPayment: 2500,
};

const copy = {
    tr: {
        heroTitle: "Kartopu mu çığ mı: hangi yol daha hızlı ve daha ucuz?",
        heroText: "Üç borcu aynı anda taşırken hangi hesabın önce hedefleneceğini, ne kadar sürede sıfırlanacağını ve toplam faiz farkını tek karar ekranında gör.",
        activeStrategy: "Seçili strateji",
        avalanche: "Çığ yöntemi",
        snowball: "Kartopu yöntemi",
        budget: "Aylık borç bütçesi",
        startingBalance: "Başlangıç toplam borç",
        compareTitle: "Strateji tablosu",
        compareText: "Çığ genelde faizi kısar, kartopu ise daha hızlı psikolojik ivme yaratır. Burada ikisini aynı veriyle görüyorsun.",
        debtSetup: "Borç portföyü",
        debtSetupText: "Her borcun kalan bakiyesini, aylık faizini ve minimum ödemesini gir.",
        monthlyRate: "Aylık faiz",
        minPayment: "Minimum ödeme",
        extraPayment: "Ekstra aylık ödeme",
        selectedSummary: "Seçili plan özeti",
        months: "Borçsuz kalma",
        interest: "Toplam faiz",
        totalPaid: "Toplam ödeme",
        interestGap: "Diğer stratejiye göre faiz farkı",
        firstTarget: "İlk hedef borç",
        payoffOrder: "Kapanış sırası",
        debt: "Borç",
        recommendation: "Faiz tarafında öne çıkan",
        modelNote: "Karar notu",
        modelText: "Kartopu en küçük bakiyeyi önce kapatıp hızlı kazanma hissi verir. Çığ ise genelde toplam maliyeti düşürür. Nakit akışınız ve davranışsal disiplininiz hangisine daha uygunsa onu seçin.",
        faster: "daha hızlı",
        cheaper: "daha düşük faiz",
        notFeasible: "Plan kapanmıyor",
        notFeasibleText: "Asgari ödemeler ve ekstra bütçe ilk ay faiz yükünü taşımadığı için bu plan borcu eritemiyor.",
    },
    en: {
        heroTitle: "Snowball or avalanche: which path is faster and cheaper?",
        heroText: "See which debt gets targeted first, how quickly the stack disappears, and how much interest separates the two strategies in one decision view.",
        activeStrategy: "Selected strategy",
        avalanche: "Avalanche",
        snowball: "Snowball",
        budget: "Monthly debt budget",
        startingBalance: "Starting total debt",
        compareTitle: "Strategy board",
        compareText: "Avalanche usually reduces interest while snowball creates faster psychological momentum. This view shows both on the same inputs.",
        debtSetup: "Debt setup",
        debtSetupText: "Enter each debt's balance, monthly rate, and minimum payment.",
        monthlyRate: "Monthly rate",
        minPayment: "Minimum payment",
        extraPayment: "Extra monthly payment",
        selectedSummary: "Selected plan summary",
        months: "Debt-free in",
        interest: "Total interest",
        totalPaid: "Total paid",
        interestGap: "Interest gap vs other strategy",
        firstTarget: "First target",
        payoffOrder: "Payoff order",
        debt: "Debt",
        recommendation: "Interest winner",
        modelNote: "Decision note",
        modelText: "Snowball closes the smallest balance first and builds quick wins. Avalanche usually reduces total cost. Choose the one your cash flow and discipline can actually sustain.",
        faster: "faster",
        cheaper: "lower interest",
        notFeasible: "Plan does not amortize",
        notFeasibleText: "The minimum payments and extra budget do not cover the interest load in the first month, so the debt stack does not shrink.",
    },
};

function formatCurrency(value: number, lang: Lang) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }) + " TL";
}

function formatMonths(value: number, lang: Lang) {
    return `${value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US")} ${lang === "tr" ? "ay" : "months"}`;
}

function debtLabel(id: string, lang: Lang) {
    const labels: Record<string, { tr: string; en: string }> = {
        debtOne: { tr: "Borç 1", en: "Debt 1" },
        debtTwo: { tr: "Borç 2", en: "Debt 2" },
        debtThree: { tr: "Borç 3", en: "Debt 3" },
    };

    return labels[id]?.[lang] ?? id;
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

export default function DebtPayoffPlannerCalculator({ lang }: { lang: Lang }) {
    const t = copy[lang];
    const [values, setValues] = useState<Values>(initialValues);
    const results = useMemo(() => calculateDebtPayoff(values), [values]);

    const selectedLabel = results.selectedStrategy === "avalanche" ? t.avalanche : t.snowball;
    const recommendedLabel = results.recommendedStrategy === "avalanche" ? t.avalanche : t.snowball;

    const updateValue = (key: keyof Values, value: number | DebtPayoffStrategy) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_40%,#f8fafc_100%)] p-5 shadow-sm sm:p-7">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                            <ArrowRightLeft size={14} className="text-amber-600" />
                            {t.activeStrategy}: {selectedLabel}
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{t.heroTitle}</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t.heroText}</p>
                    </div>

                    <div className="rounded-[28px] border border-amber-200 bg-amber-50/90 p-5 shadow-sm backdrop-blur">
                        <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                            <Wallet size={16} />
                            {t.selectedSummary}
                        </div>
                        <div className="mt-4 space-y-3">
                            <MetricRow label={t.months} value={formatMonths(results.selected.months, lang)} />
                            <MetricRow label={t.interest} value={formatCurrency(results.selected.totalInterest, lang)} />
                            <MetricRow label={t.totalPaid} value={formatCurrency(results.selected.totalPaid, lang)} />
                            <MetricRow label={t.interestGap} value={formatCurrency(results.alternativeInterestGap, lang)} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(330px,0.88fr)]">
                <div className="space-y-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5">
                            <h3 className="text-xl font-bold tracking-tight text-slate-900">{t.debtSetup}</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{t.debtSetupText}</p>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-3">
                            {(["avalanche", "snowball"] as const).map((strategy) => {
                                const active = values.strategy === strategy;
                                const label = strategy === "avalanche" ? t.avalanche : t.snowball;

                                return (
                                    <button
                                        key={strategy}
                                        type="button"
                                        onClick={() => updateValue("strategy", strategy)}
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                                            active
                                                ? "border-slate-900 bg-slate-900 text-white"
                                                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                                        )}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                            {[
                                {
                                    id: "debtOne",
                                    title: debtLabel("debtOne", lang),
                                    balanceKey: "debtOneBalance" as const,
                                    rateKey: "debtOneRate" as const,
                                    minKey: "debtOneMinPayment" as const,
                                },
                                {
                                    id: "debtTwo",
                                    title: debtLabel("debtTwo", lang),
                                    balanceKey: "debtTwoBalance" as const,
                                    rateKey: "debtTwoRate" as const,
                                    minKey: "debtTwoMinPayment" as const,
                                },
                                {
                                    id: "debtThree",
                                    title: debtLabel("debtThree", lang),
                                    balanceKey: "debtThreeBalance" as const,
                                    rateKey: "debtThreeRate" as const,
                                    minKey: "debtThreeMinPayment" as const,
                                },
                            ].map((item) => {
                                const firstTarget = results.selected.firstTargetId === item.id;

                                return (
                                    <section
                                        key={item.id}
                                        className={cn(
                                            "rounded-[24px] border p-4 shadow-sm",
                                            firstTarget ? "border-amber-200 bg-amber-50/70" : "border-slate-200 bg-slate-50/70"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <h4 className="text-base font-bold tracking-tight text-slate-900">{item.title}</h4>
                                            {firstTarget && (
                                                <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950">{t.firstTarget}</span>
                                            )}
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <NumberField label={t.debt} suffix="TL" value={values[item.balanceKey]} onChange={(value) => updateValue(item.balanceKey, value)} />
                                            <NumberField label={t.monthlyRate} suffix="%" value={values[item.rateKey]} onChange={(value) => updateValue(item.rateKey, value)} />
                                            <NumberField label={t.minPayment} suffix="TL" value={values[item.minKey]} onChange={(value) => updateValue(item.minKey, value)} />
                                        </div>
                                    </section>
                                );
                            })}
                        </div>

                        <div className="mt-4 max-w-md">
                            <NumberField label={t.extraPayment} suffix="TL" value={values.extraPayment} onChange={(value) => updateValue("extraPayment", value)} />
                        </div>
                    </section>
                </div>

                <div className="space-y-6 lg:sticky lg:top-24">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Coins size={16} className="text-blue-600" />
                            {t.compareTitle}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{t.compareText}</p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.startingBalance}</div>
                                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(results.totalStartingBalance, lang)}</div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.budget}</div>
                                <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(results.minimumBudget + results.extraPayment, lang)}</div>
                            </div>
                        </div>

                        {results.selected.feasible ? (
                            <div className="mt-4 space-y-3 text-sm text-slate-700">
                                <MetricRow label={t.firstTarget} value={results.selected.firstTargetId ? debtLabel(results.selected.firstTargetId, lang) : "-"} />
                                <MetricRow
                                    label={t.payoffOrder}
                                    value={results.selected.payoffOrder.length > 0 ? results.selected.payoffOrder.map((item) => debtLabel(item, lang)).join(" -> ") : "-"}
                                />
                                <MetricRow label={t.recommendation} value={recommendedLabel} />
                            </div>
                        ) : (
                            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-900">
                                <div className="font-semibold">{t.notFeasible}</div>
                                <p className="mt-1">{t.notFeasibleText}</p>
                            </div>
                        )}
                    </section>

                    <section className="grid gap-4">
                        {[results.selected, results.alternative].map((item) => {
                            const isRecommended = item.strategy === results.recommendedStrategy;
                            const label = item.strategy === "avalanche" ? t.avalanche : t.snowball;
                            const monthDelta = Math.abs(item.months - (item.strategy === results.selected.strategy ? results.alternative.months : results.selected.months));

                            return (
                                <div
                                    key={item.strategy}
                                    className={cn(
                                        "rounded-[28px] border p-5 shadow-sm",
                                        isRecommended ? "border-emerald-200 bg-emerald-50/80" : "border-slate-200 bg-white"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <BadgePercent size={16} className={isRecommended ? "text-emerald-700" : "text-blue-600"} />
                                            {label}
                                        </div>
                                        {isRecommended && (
                                            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">{t.cheaper}</span>
                                        )}
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/70 p-4">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.months}</div>
                                            <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatMonths(item.months, lang)}</div>
                                        </div>
                                        <div className="rounded-2xl bg-white/70 p-4">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.interest}</div>
                                            <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(item.totalInterest, lang)}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                                        <MetricRow label={t.totalPaid} value={formatCurrency(item.totalPaid, lang)} />
                                        <MetricRow label={t.firstTarget} value={item.firstTargetId ? debtLabel(item.firstTargetId, lang) : "-"} />
                                        <MetricRow label={t.payoffOrder} value={item.payoffOrder.length > 0 ? item.payoffOrder.map((entry) => debtLabel(entry, lang)).join(" -> ") : "-"} />
                                        <MetricRow label={t.faster} value={monthDelta === 0 ? "-" : formatMonths(monthDelta, lang)} />
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <ShieldCheck size={16} className="text-blue-600" />
                            {t.modelNote}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{t.modelText}</p>
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            {results.summary[lang]}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
