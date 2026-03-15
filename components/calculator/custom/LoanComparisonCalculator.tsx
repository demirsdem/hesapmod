"use client";

import React, { useMemo, useState } from "react";
import { Banknote, BarChart3, CheckCircle2, CircleDollarSign, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateLoanComparison } from "@/lib/loanComparison";

type Lang = "tr" | "en";

type Values = {
    loanAmount: number;
    offerOneRate: number;
    offerOneTerm: number;
    offerOneFee: number;
    offerTwoRate: number;
    offerTwoTerm: number;
    offerTwoFee: number;
    offerThreeRate: number;
    offerThreeTerm: number;
    offerThreeFee: number;
};

const initialValues: Values = {
    loanAmount: 250000,
    offerOneRate: 3.29,
    offerOneTerm: 24,
    offerOneFee: 2750,
    offerTwoRate: 3.05,
    offerTwoTerm: 24,
    offerTwoFee: 4200,
    offerThreeRate: 2.95,
    offerThreeTerm: 18,
    offerThreeFee: 6100,
};

const copy = {
    tr: {
        heroTitle: "Üç kredi teklifini aynı anda savunmalı biçimde kıyasla",
        heroText: "Yalnızca faiz oranına bakma. Aylık taksit baskısı, toplam maliyet, faiz yükü ve dosya-sigorta kesintisini aynı tabloda görerek karar ver.",
        loanAmount: "Kredi tutarı",
        compare: "Karşılaştırma özeti",
        compareText: "En ucuz teklif ile en düşük taksitli teklif aynı olmayabilir.",
        bestOffer: "Toplam maliyet lideri",
        lowestInstallment: "En düşük aylık taksit",
        savingsVsWorst: "En pahalı teklife göre tasarruf",
        monthlySpread: "Aylık taksit farkı",
        offerSetup: "Teklif ayarları",
        offerSetupText: "Her banka veya teklif için faiz, vade ve kesintileri girin.",
        monthlyRate: "Aylık faiz",
        term: "Vade",
        fee: "Masraf",
        months: "ay",
        offerCard: "teklif",
        monthlyInstallment: "Aylık taksit",
        totalCost: "Toplam maliyet",
        interestCost: "Toplam faiz yükü",
        totalRepayment: "Faiz dahil geri ödeme",
        feeRatio: "Masraf oranı",
        decisionNote: "Karar notu",
        decisionText: "Kısa vadeli teklif çoğu zaman toplam maliyeti düşürür ama aylık nakit akışını sertleştirir. Bu nedenle bütçeniz taksite dayanıyorsa yalnızca en ucuz toplam sonuca göre karar vermeyin.",
        winner: "Önde",
        bestLabel: "En ekonomik",
        lowInstallmentLabel: "En rahat taksit",
    },
    en: {
        heroTitle: "Compare three loan offers in a defensible way",
        heroText: "Do not look only at the interest rate. Review monthly payment pressure, total cost, interest burden, and upfront deductions in one view before deciding.",
        loanAmount: "Loan amount",
        compare: "Comparison snapshot",
        compareText: "The cheapest total-cost option may differ from the lowest monthly payment option.",
        bestOffer: "Total-cost leader",
        lowestInstallment: "Lowest monthly payment",
        savingsVsWorst: "Savings vs worst offer",
        monthlySpread: "Monthly payment spread",
        offerSetup: "Offer setup",
        offerSetupText: "Enter rate, term, and upfront deductions for each bank or offer.",
        monthlyRate: "Monthly rate",
        term: "Term",
        fee: "Fees",
        months: "months",
        offerCard: "offer",
        monthlyInstallment: "Monthly payment",
        totalCost: "Total cost",
        interestCost: "Interest burden",
        totalRepayment: "Repayment before fees",
        feeRatio: "Fee share",
        decisionNote: "Decision note",
        decisionText: "A shorter-term offer often reduces total cost but makes monthly cash flow tighter. If your budget is installment-sensitive, do not choose only by the cheapest total outcome.",
        winner: "Leads",
        bestLabel: "Most economical",
        lowInstallmentLabel: "Easiest monthly payment",
    },
};

function formatCurrency(value: number, lang: Lang) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }) + " TL";
}

function formatPercent(value: number, lang: Lang, digits = 2) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
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
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-[#FF6B35] focus-within:ring-4 focus-within:ring-[#FF6B35]/10">
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

export default function LoanComparisonCalculator({ lang }: { lang: Lang }) {
    const t = copy[lang];
    const [values, setValues] = useState(initialValues);
    const results = useMemo(() => calculateLoanComparison(values), [values]);

    const updateValue = (key: keyof Values, value: number) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_40%,#f8fafc_100%)] p-5 shadow-sm sm:p-7">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                            <Scale size={14} className="text-sky-600" />
                            {t.loanAmount}: {formatCurrency(values.loanAmount, lang)}
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{t.heroTitle}</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t.heroText}</p>
                    </div>
                    <div className="rounded-[28px] border border-sky-200 bg-sky-50/90 p-5 shadow-sm backdrop-blur">
                        <div className="flex items-center gap-2 text-sm font-semibold text-sky-800">
                            <CircleDollarSign size={16} />
                            {t.compare}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{t.compareText}</p>
                        <div className="mt-4 space-y-3">
                            <MetricRow label={t.bestOffer} value={results.offers.find((offer) => offer.id === results.bestOfferId)?.label ?? "-"} />
                            <MetricRow label={t.lowestInstallment} value={results.offers.find((offer) => offer.id === results.lowestInstallmentId)?.label ?? "-"} />
                            <MetricRow label={t.savingsVsWorst} value={formatCurrency(results.savingsVsWorst, lang)} />
                            <MetricRow label={t.monthlySpread} value={formatCurrency(results.spreadMonthly, lang)} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
                <div className="space-y-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5">
                            <h3 className="text-xl font-bold tracking-tight text-slate-900">{t.offerSetup}</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{t.offerSetupText}</p>
                        </div>
                        <div className="mb-4 grid gap-4 md:grid-cols-2">
                            <NumberField label={t.loanAmount} suffix="TL" value={values.loanAmount} onChange={(value) => updateValue("loanAmount", value)} />
                        </div>

                        <div className="grid gap-4 xl:grid-cols-3">
                            {[
                                {
                                    id: "offerOne",
                                    title: `1. ${t.offerCard}`,
                                    rateKey: "offerOneRate" as const,
                                    termKey: "offerOneTerm" as const,
                                    feeKey: "offerOneFee" as const,
                                },
                                {
                                    id: "offerTwo",
                                    title: `2. ${t.offerCard}`,
                                    rateKey: "offerTwoRate" as const,
                                    termKey: "offerTwoTerm" as const,
                                    feeKey: "offerTwoFee" as const,
                                },
                                {
                                    id: "offerThree",
                                    title: `3. ${t.offerCard}`,
                                    rateKey: "offerThreeRate" as const,
                                    termKey: "offerThreeTerm" as const,
                                    feeKey: "offerThreeFee" as const,
                                },
                            ].map((item) => {
                                const isBest = results.bestOfferId === item.id;
                                const isLowInstallment = results.lowestInstallmentId === item.id;

                                return (
                                    <section
                                        key={item.id}
                                        className={cn(
                                            "rounded-[24px] border p-4 shadow-sm",
                                            isBest ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-slate-50/70"
                                        )}
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-base font-bold tracking-tight text-slate-900">{item.title}</h4>
                                            {isBest && (
                                                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">{t.bestLabel}</span>
                                            )}
                                            {isLowInstallment && (
                                                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white">{t.lowInstallmentLabel}</span>
                                            )}
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <NumberField label={t.monthlyRate} suffix="%" value={values[item.rateKey]} onChange={(value) => updateValue(item.rateKey, value)} />
                                            <NumberField label={t.term} suffix={t.months} value={values[item.termKey]} onChange={(value) => updateValue(item.termKey, value)} />
                                            <NumberField label={t.fee} suffix="TL" value={values[item.feeKey]} onChange={(value) => updateValue(item.feeKey, value)} />
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <div className="space-y-6 lg:sticky lg:top-24">
                    <section className="grid gap-4">
                        {results.offers.map((offer) => {
                            const isBest = results.bestOfferId === offer.id;
                            const isLowInstallment = results.lowestInstallmentId === offer.id;

                            return (
                                <div
                                    key={offer.id}
                                    className={cn(
                                        "rounded-[28px] border p-5 shadow-sm",
                                        isBest ? "border-emerald-200 bg-emerald-50/80" : "border-slate-200 bg-white"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                <Banknote size={16} className={isBest ? "text-emerald-700" : "text-[#CC4A1A]"} />
                                                {offer.label}
                                            </div>
                                            <p className="mt-1 text-xs leading-6 text-slate-500">
                                                {formatPercent(offer.monthlyRate * 100, lang)} • {offer.term} {t.months}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-end gap-2">
                                            {isBest && (
                                                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">{t.winner}</span>
                                            )}
                                            {isLowInstallment && (
                                                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white">{t.lowInstallmentLabel}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/70 p-4">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.monthlyInstallment}</div>
                                            <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(offer.installment, lang)}</div>
                                        </div>
                                        <div className="rounded-2xl bg-white/70 p-4">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.totalCost}</div>
                                            <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(offer.totalCost, lang)}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                                        <MetricRow label={t.totalRepayment} value={formatCurrency(offer.totalRepayment, lang)} />
                                        <MetricRow label={t.interestCost} value={formatCurrency(offer.interestCost, lang)} />
                                        <MetricRow label={t.fee} value={formatCurrency(offer.fee, lang)} />
                                        <MetricRow label={t.feeRatio} value={formatPercent(offer.feeRatio * 100, lang, 1)} />
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <BarChart3 size={16} className="text-[#CC4A1A]" />
                            {t.decisionNote}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{t.decisionText}</p>
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                                <p>{results.bestOffer[lang]}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
