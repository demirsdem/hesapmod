"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LanguageCode } from "@/lib/calculator-types";
import type { LgsScenarioResult, LgsSubjectResult } from "@/lib/lgs";

type LgsResultPanelProps = {
    results: Record<string, any>;
    lang: LanguageCode;
};

type MetricCardProps = {
    label: string;
    value: string;
    helper?: string;
    emphasis?: boolean;
};

function toNumber(value: unknown) {
    const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatDecimal(value: unknown, digits: number) {
    const number = toNumber(value);
    return number.toLocaleString("tr-TR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

function formatCount(value: unknown) {
    const number = toNumber(value);
    return number.toLocaleString("tr-TR", {
        maximumFractionDigits: 2,
    });
}

function formatImpact(value: number | null) {
    if (value === null || !Number.isFinite(value)) {
        return "Muaf";
    }

    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} puan`;
}

function formatPercent(value: number) {
    return `%${value.toLocaleString("tr-TR", {
        maximumFractionDigits: 2,
    })}`;
}

function formatSubjectImpact(row: LgsSubjectResult) {
    if (row.isExempt) {
        return `${row.weightedStandardScore.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ASP sim.`;
    }

    return formatImpact(row.estimatedImpact);
}

function MetricCard({ label, value, helper, emphasis = false }: MetricCardProps) {
    return (
        <div
            className={`rounded-xl border bg-white p-5 shadow-sm ${emphasis
                ? "border-[#FFD7C7] bg-[#FFF8F5]"
                : "border-slate-200"
                }`}
        >
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p
                className={`mt-2 font-extrabold tracking-tight ${emphasis
                    ? "text-4xl text-[#CC4A1A] sm:text-5xl"
                    : "text-2xl text-slate-950"
                    }`}
            >
                {value}
            </p>
            {helper && <p className="mt-2 text-sm font-medium text-slate-500">{helper}</p>}
        </div>
    );
}

function SubjectBar({ row }: { row: LgsSubjectResult }) {
    const percentage = row.maxQuestions > 0
        ? Math.min(100, Math.max(0, (row.net / row.maxQuestions) * 100))
        : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-700">{row.label}</span>
                <span className="font-bold text-slate-900">
                    {formatDecimal(row.net, 2)} / {row.maxQuestions}
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-[#FF6B35] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function buildInsights(rows: LgsSubjectResult[], lang: LanguageCode) {
    const turkishNet = rows.find((row) => row.key === "turkce")?.net ?? 0;

    if (lang === "en") {
        return [
            "Mathematics and Science nets are the areas that affect the total score the most.",
            turkishNet >= 15
                ? "Your Turkish net is high, so your verbal contribution is strong."
                : "Improving Turkish nets can strengthen your verbal contribution quickly.",
            "Foreign Language and Religious Culture have lower weights, but full-net targets can still make a difference.",
        ];
    }

    return [
        "Matematik ve Fen netleri toplam puanı en çok etkileyen alanlardır.",
        turkishNet >= 15
            ? "Türkçe netiniz yüksek olduğu için sözel katkınız güçlü."
            : "Türkçe netinizi artırmak sözel katkınızı belirgin şekilde güçlendirebilir.",
        "Yabancı Dil ve Din katsayısı düşük olsa da tam net hedefinde fark yaratabilir.",
    ];
}

const targetPercentileOptions = [
    { label: "%0,5", value: 0.5 },
    { label: "%1", value: 1 },
    { label: "%3", value: 3 },
    { label: "%5", value: 5 },
    { label: "%10", value: 10 },
    { label: "Özel", value: "custom" },
] as const;

function buildTargetDistanceText(currentMin: number, currentMax: number, target: number) {
    const targetLabel = formatPercent(target);

    if (!Number.isFinite(currentMin) || !Number.isFinite(currentMax) || !Number.isFinite(target)) {
        return `Hedef ${targetLabel} için mevcut bandınızı ve senaryo etkilerini birlikte değerlendirin.`;
    }

    if (currentMax <= target) {
        return `Mevcut tahmini bandınız hedef ${targetLabel} seviyesini karşılıyor veya daha iyi görünüyor.`;
    }

    if (currentMin <= target && target <= currentMax) {
        return `Mevcut tahmini bandınız hedef ${targetLabel} seviyesine temas ediyor; birkaç netlik artış bandı güçlendirebilir.`;
    }

    return `Hedef ${targetLabel} için yaklaşık ${formatPercent(currentMin - target)} yüzdelik dilimlik iyileşme gerekir.`;
}

function buildTargetAdvice(currentRange: string, target: number, subjects: string[]) {
    const subjectText = subjects.length > 0
        ? subjects.slice(0, 2).join(" ve ")
        : "Matematik ve Fen";

    return `Mevcut tahmini bandınız ${currentRange}. Hedefiniz ${formatPercent(target)} ise özellikle ${subjectText} netlerindeki artış daha yüksek etki yaratır.`;
}

export default function LgsResultPanel({ results, lang }: LgsResultPanelProps) {
    const [targetSelection, setTargetSelection] = useState<string>("3");
    const [customTarget, setCustomTarget] = useState<number>(3);
    const subjectRows = Array.isArray(results.dersler)
        ? results.dersler as LgsSubjectResult[]
        : [];
    const totalQuestionCount = toNumber(results.toplam_soru) || 90;
    const statisticsYear = results.istatistik_yili || 2025;
    const scoreHelper = lang === "tr"
        ? (typeof results.puan_alt_metni === "string"
            ? `${results.puan_alt_metni} - 2025 referans verisiyle yaklaşık hesaplandı`
            : "2025 referans verisiyle yaklaşık hesaplandı")
        : `${statisticsYear} reference statistics estimate`;
    const rawPercentileRange = typeof results.tahmini_yuzdelik_dilim === "string"
        ? results.tahmini_yuzdelik_dilim
        : "%-- - %-- aralığı";
    const percentileRange = lang === "tr"
        ? rawPercentileRange
        : rawPercentileRange.replace(" aralığı", " range");
    const percentileSource = typeof results.tahmini_yuzdelik_kaynak === "string"
        ? results.tahmini_yuzdelik_kaynak
        : "2025 referans verisiyle yaklaşık hesaplandı";
    const percentileDescription = lang === "tr"
        ? (typeof results.tahmini_yuzdelik_aciklama === "string"
            ? results.tahmini_yuzdelik_aciklama
            : `Tahmini puanınız geçmiş yıl eğilimlerine göre yaklaşık ${percentileRange} bandına denk gelebilir. Bu aralık, 2026 sınav zorluğu ve tercih yoğunluğuna göre değişebilir.`)
        : `Your estimated score may correspond roughly to the ${percentileRange} based on previous-year trends. This range may change depending on 2026 exam difficulty and preference demand.`;
    const isExemptionSimulation = Boolean(results.muafiyet_simulasyonu);
    const exemptionWarning = typeof results.muafiyet_uyari === "string" && results.muafiyet_uyari
        ? results.muafiyet_uyari
        : "Muafiyetli öğrencilerde resmi puan MEB tarafından özel formülle hesaplanır. Bu araç yaklaşık simülasyon sunar.";
    const insights = buildInsights(subjectRows, lang);
    const currentPercentileMin = toNumber(results.tahmini_yuzdelik_min);
    const currentPercentileMax = toNumber(results.tahmini_yuzdelik_max);
    const topContributionSubjects = Array.isArray(results.hedefe_katki_onerileri)
        ? results.hedefe_katki_onerileri.filter((item: unknown): item is string => typeof item === "string")
        : [];
    const scenarioRows = Array.isArray(results.net_artirma_senaryolari)
        ? results.net_artirma_senaryolari as LgsScenarioResult[]
        : [];
    const scenarioWarning = typeof results.senaryo_uyarisi === "string"
        ? results.senaryo_uyarisi
        : "Bu senaryo, kullanılan yılın istatistik setine göre yaklaşık etki gösterir.";
    const targetPercentile = useMemo(() => {
        if (targetSelection === "custom") {
            return Math.min(100, Math.max(0.1, customTarget || 0.1));
        }

        return toNumber(targetSelection);
    }, [customTarget, targetSelection]);
    const targetDistanceText = buildTargetDistanceText(
        currentPercentileMin,
        currentPercentileMax,
        targetPercentile
    );
    const targetAdviceText = buildTargetAdvice(
        percentileRange,
        targetPercentile,
        topContributionSubjects
    );

    return (
        <section className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:hidden">
                <MetricCard
                    label={lang === "tr" ? "Tahmini LGS Puanı" : "Estimated LGS Score"}
                    value={formatDecimal(results.puan, 3)}
                    helper={scoreHelper}
                    emphasis
                />
                <MetricCard
                    label={lang === "tr" ? "Toplam Net" : "Total Net"}
                    value={`${formatDecimal(results.toplam_net, 2)} / ${totalQuestionCount}`}
                />
            </div>

            <div className="hidden gap-3 md:grid md:grid-cols-2">
                <div className="md:col-span-2">
                    <MetricCard
                        label={lang === "tr" ? "Tahmini LGS Puanı" : "Estimated LGS Score"}
                        value={formatDecimal(results.puan, 3)}
                        helper={scoreHelper}
                        emphasis
                    />
                </div>
                <MetricCard
                    label={lang === "tr" ? "Toplam Net" : "Total Net"}
                    value={`${formatDecimal(results.toplam_net, 2)} / ${totalQuestionCount}`}
                />
                <MetricCard
                    label={lang === "tr" ? "Sayısal Net" : "Quantitative Net"}
                    value={`${formatDecimal(results.sayisal_net, 2)} / 40`}
                />
                <MetricCard
                    label={lang === "tr" ? "Sözel Net" : "Verbal Net"}
                    value={`${formatDecimal(results.sozel_net, 2)} / 50`}
                />
                <MetricCard
                    label={lang === "tr" ? "Tahmini Yüzdelik Dilim" : "Estimated Percentile"}
                    value={percentileRange}
                    helper={lang === "tr" ? percentileSource : "Estimated from 2025 threshold-score and percentile trends"}
                />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-extrabold text-slate-950">
                        {lang === "tr" ? "Ders Bazlı Sonuç" : "Subject Breakdown"}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        {lang === "tr" ? "HP / SP etkisi" : "HP / SP impact"}
                    </span>
                </div>

                <div className="mt-4 hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                <th className="py-3 pr-3">{lang === "tr" ? "Ders" : "Subject"}</th>
                                <th className="px-3 py-3 text-right">{lang === "tr" ? "Doğru" : "Correct"}</th>
                                <th className="px-3 py-3 text-right">{lang === "tr" ? "Yanlış" : "Wrong"}</th>
                                <th className="px-3 py-3 text-right">{lang === "tr" ? "Boş" : "Blank"}</th>
                                <th className="px-3 py-3 text-right">Net</th>
                                <th className="px-3 py-3 text-right">{lang === "tr" ? "Katsayı" : "Weight"}</th>
                                <th className="py-3 pl-3 text-right">{lang === "tr" ? "Tahmini Etki" : "Est. Impact"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {subjectRows.map((row) => (
                                <tr key={row.key}>
                                    <td className="py-3 pr-3 font-semibold text-slate-800">{row.label}</td>
                                    <td className="px-3 py-3 text-right text-slate-700">{formatCount(row.correct)}</td>
                                    <td className="px-3 py-3 text-right text-slate-700">{formatCount(row.wrong)}</td>
                                    <td className="px-3 py-3 text-right text-slate-700">{formatCount(row.blank)}</td>
                                    <td className="px-3 py-3 text-right font-bold text-slate-950">{formatDecimal(row.net, 2)}</td>
                                    <td className="px-3 py-3 text-right text-slate-700">{row.coefficient}</td>
                                    <td className="py-3 pl-3 text-right font-bold text-[#CC4A1A]">{formatSubjectImpact(row)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 space-y-3 md:hidden">
                    {subjectRows.map((row) => (
                        <details
                            key={row.key}
                            className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                                <span>
                                    <span className="block font-bold text-slate-900">{row.label}</span>
                                    <span className="text-sm font-medium text-slate-500">
                                        {formatDecimal(row.net, 2)} net · katsayı {row.coefficient}
                                    </span>
                                </span>
                                <ChevronDown className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                            </summary>
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                    <div className="rounded-lg bg-white px-2 py-3">
                                        <p className="text-xs font-semibold text-slate-500">{lang === "tr" ? "Doğru" : "Correct"}</p>
                                        <p className="mt-1 font-bold text-slate-950">{formatCount(row.correct)}</p>
                                    </div>
                                    <div className="rounded-lg bg-white px-2 py-3">
                                        <p className="text-xs font-semibold text-slate-500">{lang === "tr" ? "Yanlış" : "Wrong"}</p>
                                        <p className="mt-1 font-bold text-slate-950">{formatCount(row.wrong)}</p>
                                    </div>
                                    <div className="rounded-lg bg-white px-2 py-3">
                                        <p className="text-xs font-semibold text-slate-500">{lang === "tr" ? "Boş" : "Blank"}</p>
                                        <p className="mt-1 font-bold text-slate-950">{formatCount(row.blank)}</p>
                                    </div>
                                </div>
                                <SubjectBar row={row} />
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm">
                                    <span className="font-semibold text-slate-600">{lang === "tr" ? "Tahmini Etki" : "Est. Impact"}</span>
                                    <span className="font-extrabold text-[#CC4A1A]">{formatSubjectImpact(row)}</span>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
                <MetricCard
                    label={lang === "tr" ? "Sayısal Net" : "Quantitative Net"}
                    value={`${formatDecimal(results.sayisal_net, 2)} / 40`}
                />
                <MetricCard
                    label={lang === "tr" ? "Sözel Net" : "Verbal Net"}
                    value={`${formatDecimal(results.sozel_net, 2)} / 50`}
                />
                <MetricCard
                    label={lang === "tr" ? "Tahmini Yüzdelik Dilim" : "Estimated Percentile"}
                    value={percentileRange}
                    helper={lang === "tr" ? percentileSource : "Estimated from 2025 threshold-score and percentile trends"}
                />
            </div>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-semibold leading-6 text-indigo-950">
                {percentileDescription}
            </div>

            {lang === "tr" && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-950">Hedef Yüzdelik</h3>
                            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                                Hedef okul bandınıza göre mevcut tahmini konumunuzu karşılaştırın.
                            </p>
                        </div>
                        <span className="text-sm font-bold text-slate-500">
                            Mevcut: {percentileRange}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {targetPercentileOptions.map((option) => {
                            const optionValue = String(option.value);
                            const isSelected = targetSelection === optionValue;

                            return (
                                <button
                                    key={option.label}
                                    type="button"
                                    onClick={() => setTargetSelection(optionValue)}
                                    className={`min-h-11 rounded-lg border px-3 text-sm font-extrabold transition-all ${isSelected
                                        ? "border-[#FF6B35] bg-[#FFF3EE] text-[#CC4A1A] shadow-sm"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#FFD7C7] hover:bg-white"
                                        }`}
                                    aria-pressed={isSelected}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>

                    {targetSelection === "custom" && (
                        <label className="mt-4 flex max-w-xs flex-col gap-2">
                            <span className="text-sm font-bold text-slate-700">Özel hedef yüzdelik</span>
                            <div className="relative">
                                <input
                                    type="number"
                                    min={0.1}
                                    max={100}
                                    step={0.1}
                                    value={customTarget}
                                    onChange={(event) => setCustomTarget(Number.parseFloat(event.target.value) || 0.1)}
                                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-10 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                                />
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                                    %
                                </span>
                            </div>
                        </label>
                    )}

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
                            <span className="block text-xs font-black uppercase tracking-wide text-blue-700">
                                Hedefe uzaklık
                            </span>
                            <span className="mt-1 block">{targetDistanceText}</span>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-950">
                            <span className="block text-xs font-black uppercase tracking-wide text-emerald-700">
                                En çok katkı sağlayabilecek dersler
                            </span>
                            <span className="mt-1 block">{targetAdviceText}</span>
                        </div>
                    </div>
                </div>
            )}

            {scenarioRows.length > 0 && lang === "tr" && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-950">Net Artırma Senaryosu</h3>
                            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                                Bir netlik artışın tahmini puana etkisini karşılaştırın.
                            </p>
                        </div>
                        <span className="text-sm font-bold text-slate-500">
                            {statisticsYear} seti
                        </span>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    <th className="py-3 pr-3">Senaryo</th>
                                    <th className="px-3 py-3 text-right">Tahmini Puan Değişimi</th>
                                    <th className="py-3 pl-3">Yorum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {scenarioRows.map((scenario) => (
                                    <tr key={scenario.key}>
                                        <td className="py-3 pr-3 font-semibold text-slate-800">
                                            {scenario.scenarioLabel}
                                        </td>
                                        <td className="px-3 py-3 text-right font-extrabold text-[#CC4A1A]">
                                            {formatImpact(scenario.pointChange)}
                                        </td>
                                        <td className="py-3 pl-3 font-semibold text-slate-700">
                                            {scenario.comment}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
                        {scenarioWarning}
                    </div>
                </div>
            )}

            {isExemptionSimulation && (
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm font-semibold leading-6 text-violet-950">
                    <span className="block font-extrabold">
                        {lang === "tr" ? "Yaklaşık muafiyet simülasyonu" : "Approximate exemption simulation"}
                    </span>
                    <span className="mt-1 block">
                        {lang === "tr"
                            ? exemptionWarning
                            : "For exempt students, the official score is calculated by MEB with a special formula. This tool provides an approximate simulation."}
                    </span>
                </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-950">
                    {lang === "tr" ? "Ders Etki Barları" : "Subject Impact Bars"}
                </h3>
                <div className="mt-4 space-y-4">
                    {subjectRows.map((row) => <SubjectBar key={row.key} row={row} />)}
                </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                <h3 className="font-extrabold">{lang === "tr" ? "Ders Etki Analizi" : "Subject Impact Notes"}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                    {insights.map((insight) => (
                        <li key={insight}>{insight}</li>
                    ))}
                </ul>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
                {lang === "tr"
                    ? "Resmi MEB sonucu değildir. Tahmini LGS puanı, toplam net ve tahmini yüzdelik dilim aralığı 2025 referans verisiyle yaklaşık hesaplandı."
                    : "This is not an official MEB result. The LGS score is finalized with the exam year's average, standard deviation, and TASP distribution. This tool produces an estimated result for mock-exam and preference pre-analysis."}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-800">
                {lang === "tr"
                    ? "Tercih yaparken yüzdelik dilim, okul kontenjanı ve resmi MEB verileri birlikte değerlendirilmelidir."
                    : "During preference planning, do not look only at the score. Review each school's latest percentile, quota, local demand, and transfer-period changes together."}
            </div>
        </section>
    );
}
