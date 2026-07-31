"use client";

import React, { useMemo, useState } from "react";
import type { LanguageCode } from "@/lib/calculator-types";
import {
    calculateTytScoreForYear,
    calculateTytScoreSet,
    normalizeTytYear,
    type TytScoreResult,
} from "@/lib/tyt";
import { cn } from "@/lib/utils";

type Props = {
    values: Record<string, any>;
    lang: LanguageCode;
};

type ComparisonRow = {
    id: string;
    label: Record<LanguageCode, string>;
    getValue: (result: TytScoreResult) => number;
    kind: "net" | "score" | "contribution";
};

type TytNetKey = "turkNet" | "sosNet" | "matNet" | "fenNet";
type TargetModeId = "turkMat" | "sosMat" | "fenMat";

type TargetMode = {
    id: TargetModeId;
    label: Record<LanguageCode, string>;
    firstKey: TytNetKey;
    secondKey: TytNetKey;
    firstMax: number;
    secondMax: number;
};

type TargetPlannerRow = {
    turkNet: number;
    sosNet: number;
    matNet: number;
    fenNet: number;
    score: number;
    effort: number;
    excess: number;
};

const yearLabels: Record<TytScoreResult["year"], Record<LanguageCode, string>> = {
    "2025": { tr: "2025 Seti", en: "2025 Set" },
    "2024": { tr: "2024 Seti", en: "2024 Set" },
    "2023": { tr: "2023 Seti", en: "2023 Set" },
};

const netLabels: Record<TytNetKey, Record<LanguageCode, string>> = {
    turkNet: { tr: "Türkçe", en: "Turkish" },
    sosNet: { tr: "Sosyal", en: "Social" },
    matNet: { tr: "Matematik", en: "Math" },
    fenNet: { tr: "Fen", en: "Science" },
};

const targetModes: TargetMode[] = [
    {
        id: "turkMat",
        label: { tr: "Türkçe + Mat", en: "Turkish + Math" },
        firstKey: "turkNet",
        secondKey: "matNet",
        firstMax: 40,
        secondMax: 40,
    },
    {
        id: "sosMat",
        label: { tr: "Sosyal + Mat", en: "Social + Math" },
        firstKey: "sosNet",
        secondKey: "matNet",
        firstMax: 20,
        secondMax: 40,
    },
    {
        id: "fenMat",
        label: { tr: "Fen + Mat", en: "Science + Math" },
        firstKey: "fenNet",
        secondKey: "matNet",
        firstMax: 20,
        secondMax: 40,
    },
];

const comparisonRows: ComparisonRow[] = [
    {
        id: "turkNet",
        label: { tr: "Türkçe Net", en: "Turkish Net" },
        getValue: (result) => result.turkNet,
        kind: "net",
    },
    {
        id: "sosNet",
        label: { tr: "Sosyal Net", en: "Social Net" },
        getValue: (result) => result.sosNet,
        kind: "net",
    },
    {
        id: "matNet",
        label: { tr: "Mat Net", en: "Math Net" },
        getValue: (result) => result.matNet,
        kind: "net",
    },
    {
        id: "fenNet",
        label: { tr: "Fen Net", en: "Science Net" },
        getValue: (result) => result.fenNet,
        kind: "net",
    },
    {
        id: "rawScore",
        label: { tr: "Ham TYT", en: "Raw TYT" },
        getValue: (result) => result.rawScore,
        kind: "score",
    },
    {
        id: "obpContribution",
        label: { tr: "OBP Katkısı", en: "OBP Contribution" },
        getValue: (result) => result.obpContribution,
        kind: "contribution",
    },
    {
        id: "placementScore",
        label: { tr: "Y-TYT", en: "P-TYT" },
        getValue: (result) => result.placementScore,
        kind: "score",
    },
];

const selectedCardLabels = {
    rawScore: { tr: "Ham TYT", en: "Raw TYT" },
    obpContribution: { tr: "OBP Katkısı", en: "OBP Contribution" },
    placementScore: { tr: "Y-TYT (Yerleştirme)", en: "P-TYT (Placement)" },
    extraPlacementScore: { tr: "Ek Puanlı Y-TYT", en: "P-TYT with Extra Point" },
    testNets: { tr: "Test Netleri", en: "Test Nets" },
};

const netItems = [
    { label: { tr: "Türkçe", en: "Turkish" }, getValue: (result: TytScoreResult) => result.turkNet },
    { label: { tr: "Sosyal", en: "Social" }, getValue: (result: TytScoreResult) => result.sosNet },
    { label: { tr: "Matematik", en: "Math" }, getValue: (result: TytScoreResult) => result.matNet },
    { label: { tr: "Fen", en: "Science" }, getValue: (result: TytScoreResult) => result.fenNet },
];

function formatNumber(value: number, lang: LanguageCode, fractionDigits: number) {
    return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}

function getCompactFractionDigits(value: number) {
    return Number.isInteger(value * 10) ? 1 : 2;
}

function formatNet(value: number, lang: LanguageCode) {
    return formatNumber(value, lang, getCompactFractionDigits(value));
}

function formatTargetNet(value: number, lang: LanguageCode) {
    return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatScore(value: number, lang: LanguageCode) {
    return formatNumber(value, lang, 2);
}

function formatTargetScore(value: number, lang: LanguageCode) {
    return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatContribution(value: number, lang: LanguageCode) {
    return `+${formatNumber(value, lang, getCompactFractionDigits(value))}`;
}

function formatComparisonValue(row: ComparisonRow, result: TytScoreResult, lang: LanguageCode) {
    const value = row.getValue(result);

    if (row.kind === "contribution") {
        return formatContribution(value, lang);
    }

    if (row.kind === "net") {
        return formatNet(value, lang);
    }

    return formatScore(value, lang);
}

function clampTargetScore(value: string) {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return Math.max(0, Math.min(600, parsed));
}

function getTargetPlanningScore(result: TytScoreResult) {
    return result.extraContribution > 0
        ? result.extraPlacementScore
        : result.placementScore;
}

export function TytComparisonTable({ values, lang }: Props) {
    const scoreSet = useMemo(() => calculateTytScoreSet(values), [values]);

    return (
        <>
            <section className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-black tracking-tight text-slate-950">
                        {lang === "tr" ? "Sonuç Tablosu" : "Result Table"}
                    </h3>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {yearLabels[scoreSet.selectedYear][lang]}
                    </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm [scrollbar-width:thin]">
                    <table className="w-full min-w-[640px] border-collapse text-sm [font-variant-numeric:tabular-nums]">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="w-36 bg-slate-50 px-4 py-3 text-left font-black text-slate-700">
                                    <span className="sr-only">
                                        {lang === "tr" ? "Kalem" : "Metric"}
                                    </span>
                                </th>
                                {scoreSet.results.map((result) => {
                                    const isSelected = result.year === scoreSet.selectedYear;

                                    return (
                                        <th
                                            key={result.year}
                                            className={cn(
                                                "px-4 py-3 text-right font-black",
                                                isSelected
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-50 text-slate-700"
                                            )}
                                        >
                                            {yearLabels[result.year][lang]}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {comparisonRows.map((row) => (
                                <tr key={row.id} className={row.id === "placementScore" ? "bg-slate-50/70" : undefined}>
                                    <th className="bg-white px-4 py-3 text-left text-sm font-bold text-slate-700">
                                        {row.label[lang]}
                                    </th>
                                    {scoreSet.results.map((result) => {
                                        const isSelected = result.year === scoreSet.selectedYear;
                                        const isBestPlacement = row.id === "placementScore"
                                            && scoreSet.maxPlacementScore > 0
                                            && result.placementScore === scoreSet.maxPlacementScore;

                                        return (
                                            <td
                                                key={`${row.id}-${result.year}`}
                                                className={cn(
                                                    "px-4 py-3 text-right text-slate-800",
                                                    isSelected && "bg-blue-50 text-blue-950",
                                                    row.id === "placementScore" && "text-base",
                                                    isBestPlacement && "font-black"
                                                )}
                                            >
                                                <span className="inline-flex items-center justify-end gap-2">
                                                    {formatComparisonValue(row, result, lang)}
                                                    {row.id === "placementScore" && isSelected && (
                                                        <span
                                                            aria-label={lang === "tr" ? "Seçili set" : "Selected set"}
                                                            className="h-2 w-2 rounded-full bg-blue-600"
                                                        />
                                                    )}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <TytTargetPlanner
                values={values}
                lang={lang}
            />
        </>
    );
}

function TytTargetPlanner({ values, lang }: Props) {
    const [targetScore, setTargetScore] = useState(350);
    const [targetMode, setTargetMode] = useState<TargetModeId>("turkMat");
    const selectedYear = normalizeTytYear(values.sinav_yili);
    const selectedMode = targetModes.find((mode) => mode.id === targetMode) ?? targetModes[0];

    const targetResult = useMemo(() => {
        const currentScore = calculateTytScoreSet(values).selected;
        const rows: TargetPlannerRow[] = [];

        for (let firstNet = 0; firstNet <= selectedMode.firstMax; firstNet += 1) {
            for (let secondNet = 0; secondNet <= selectedMode.secondMax; secondNet += 1) {
                const nets = {
                    turkNet: currentScore.turkNet,
                    sosNet: currentScore.sosNet,
                    matNet: currentScore.matNet,
                    fenNet: currentScore.fenNet,
                    [selectedMode.firstKey]: firstNet,
                    [selectedMode.secondKey]: secondNet,
                };
                const normalizedNets = {
                    ...nets,
                    totalNet: nets.turkNet + nets.sosNet + nets.matNet + nets.fenNet,
                };
                const result = calculateTytScoreForYear(values, selectedYear, normalizedNets);
                const score = getTargetPlanningScore(result);

                if (score >= targetScore) {
                    rows.push({
                        turkNet: normalizedNets.turkNet,
                        sosNet: normalizedNets.sosNet,
                        matNet: normalizedNets.matNet,
                        fenNet: normalizedNets.fenNet,
                        score,
                        effort: firstNet + secondNet,
                        excess: score - targetScore,
                    });
                }
            }
        }

        rows.sort((a, b) => {
            if (a.effort !== b.effort) return a.effort - b.effort;
            if (a.excess !== b.excess) return a.excess - b.excess;
            return a.score - b.score;
        });

        return {
            rows,
            bestRow: rows[0] ?? null,
            usesExtraPoint: calculateTytScoreForYear(values, selectedYear).extraContribution > 0,
        };
    }, [selectedMode, selectedYear, targetScore, values]);

    const scoreLabel = targetResult.usesExtraPoint
        ? { tr: "Ek Puanlı Y-TYT", en: "P-TYT with Extra Point" }
        : { tr: "Y-TYT", en: "P-TYT" };
    const summary = targetResult.bestRow
        ? lang === "tr"
            ? `En az çabayla ${formatTargetScore(targetScore, lang)} ${scoreLabel[lang]} için: ${netLabels[selectedMode.firstKey][lang]}'de ${formatTargetNet(targetResult.bestRow[selectedMode.firstKey], lang)}, ${netLabels[selectedMode.secondKey][lang]}'te ${formatTargetNet(targetResult.bestRow[selectedMode.secondKey], lang)} net yeterli`
            : `For ${formatTargetScore(targetScore, lang)} ${scoreLabel[lang]} with the least effort: ${formatTargetNet(targetResult.bestRow[selectedMode.firstKey], lang)} ${netLabels[selectedMode.firstKey][lang]} and ${formatTargetNet(targetResult.bestRow[selectedMode.secondKey], lang)} ${netLabels[selectedMode.secondKey][lang]} net is enough`
        : lang === "tr"
            ? `${yearLabels[selectedYear][lang]} ile ${formatTargetScore(targetScore, lang)} ${scoreLabel[lang]} bu net aralığında mümkün görünmüyor`
            : `${formatTargetScore(targetScore, lang)} ${scoreLabel[lang]} is not reachable in this net range with ${yearLabels[selectedYear][lang]}`;

    return (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h3 className="text-base font-black tracking-tight text-slate-950">
                        {lang === "tr" ? "Hedef Y-TYT Ters Hesaplama" : "Target P-TYT Reverse Calculator"}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {targetModes.map((mode) => {
                            const isSelected = mode.id === targetMode;

                            return (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => setTargetMode(mode.id)}
                                    className={cn(
                                        "min-h-10 rounded-lg border px-3 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200",
                                        isSelected
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                                    )}
                                >
                                    {mode.label[lang]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <label className="flex min-w-0 flex-col gap-2 sm:w-48">
                    <span className="text-sm font-semibold text-slate-600">
                        {lang === "tr" ? "Hedef puan" : "Target score"}
                    </span>
                    <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={600}
                        step={0.01}
                        value={targetScore}
                        onChange={(event) => setTargetScore(clampTargetScore(event.target.value))}
                        className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base font-black text-slate-900 shadow-sm outline-none transition-all hover:border-blue-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                </label>
            </div>

            <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-900">
                {summary}
            </p>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className="max-h-[420px] overflow-auto">
                    <table className="w-full min-w-[640px] text-left text-sm [font-variant-numeric:tabular-nums]">
                        <thead className="sticky top-0 bg-slate-50 text-xs font-black uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">{lang === "tr" ? "Türkçe Net" : "Turkish Net"}</th>
                                <th className="px-4 py-3">{lang === "tr" ? "Mat Net" : "Math Net"}</th>
                                <th className="px-4 py-3">{lang === "tr" ? "Sosyal Net" : "Social Net"}</th>
                                <th className="px-4 py-3">{lang === "tr" ? "Fen Net" : "Science Net"}</th>
                                <th className="px-4 py-3">{scoreLabel[lang]}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {targetResult.rows.length > 0 ? (
                                targetResult.rows.map((row) => (
                                    <tr key={`${row.turkNet}-${row.matNet}-${row.sosNet}-${row.fenNet}`} className="hover:bg-blue-50/60">
                                        <td className="px-4 py-3 font-bold text-slate-900">{formatTargetNet(row.turkNet, lang)}</td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{formatTargetNet(row.matNet, lang)}</td>
                                        <td className="px-4 py-3 font-bold text-slate-700">{formatTargetNet(row.sosNet, lang)}</td>
                                        <td className="px-4 py-3 font-bold text-slate-700">{formatTargetNet(row.fenNet, lang)}</td>
                                        <td className="px-4 py-3 font-black text-blue-700">{formatScore(row.score, lang)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-8 text-center text-sm font-bold text-slate-500" colSpan={5}>
                                        {lang === "tr" ? "Uygun kombinasyon bulunamadı." : "No matching combination found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export function TytSelectedResultPanel({ values, lang }: Props) {
    const scoreSet = useMemo(() => calculateTytScoreSet(values), [values]);
    const selected = scoreSet.selected;

    return (
        <section className="animate-scale-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-black tracking-tight text-slate-950">
                    {yearLabels[selected.year][lang]}
                </h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    TYT
                </span>
            </div>

            <div className="space-y-4 [font-variant-numeric:tabular-nums]">
                <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3">
                    <span className="text-sm font-semibold text-slate-600">
                        {selectedCardLabels.rawScore[lang]}
                    </span>
                    <span className="text-xl font-black text-slate-950">
                        {formatScore(selected.rawScore, lang)}
                    </span>
                </div>

                <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3">
                    <span className="text-sm font-semibold text-slate-600">
                        {selectedCardLabels.obpContribution[lang]}
                    </span>
                    <span className="text-xl font-black text-slate-950">
                        {formatContribution(selected.obpContribution, lang)}
                    </span>
                </div>

                <div className="border-b border-slate-200 pb-5">
                    <p className="text-sm font-bold text-blue-700">
                        {selectedCardLabels.placementScore[lang]}
                    </p>
                    <p className="mt-2 text-4xl font-black tracking-tight text-blue-700 sm:text-5xl">
                        {formatScore(selected.placementScore, lang)}
                    </p>
                    {selected.extraContribution > 0 && (
                        <div className="mt-4 flex items-baseline justify-between gap-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                            <span className="text-sm font-semibold text-blue-700">
                                {selectedCardLabels.extraPlacementScore[lang]}
                            </span>
                            <span className="text-base font-black text-blue-950">
                                {formatScore(selected.extraPlacementScore, lang)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5">
                <h4 className="text-sm font-black tracking-tight text-slate-950">
                    {selectedCardLabels.testNets[lang]}
                </h4>
                <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {netItems.map((item) => (
                        <div
                            key={item.label.tr}
                            className="flex min-h-12 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3"
                        >
                            <dt className="text-sm font-semibold text-slate-600">
                                {item.label[lang]}
                            </dt>
                            <dd className="text-base font-black text-slate-950 [font-variant-numeric:tabular-nums]">
                                {formatNet(item.getValue(selected), lang)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
