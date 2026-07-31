"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpenCheck, Calculator, CheckCircle2, GraduationCap, Languages, Share2, Sigma, Target, Trophy } from "lucide-react";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { calculateYksScores, yksScoreTypeMeta, yksYearConfigs, type YksScoreType } from "@/lib/yks";
import CollapsibleSection from "./CollapsibleSection";

type PairField = {
    label: string;
    questionCount: number;
    correctId: string;
    wrongId: string;
};

type YksFieldScoreType = Exclude<YksScoreType, "tyt">;

const initialValues = {
    sinav_yili: "2026",
    tytTurkceD: 30,
    tytTurkceY: 5,
    tytSosyalD: 15,
    tytSosyalY: 3,
    tytMatD: 25,
    tytMatY: 2,
    tytFenD: 10,
    tytFenY: 2,
    aytMatD: 0,
    aytMatY: 0,
    aytEdebD: 0,
    aytEdebY: 0,
    aytTar1D: 0,
    aytTar1Y: 0,
    aytCog1D: 0,
    aytCog1Y: 0,
    aytTar2D: 0,
    aytTar2Y: 0,
    aytCog2D: 0,
    aytCog2Y: 0,
    aytFelsefeD: 0,
    aytFelsefeY: 0,
    aytDinD: 0,
    aytDinY: 0,
    aytFizikD: 0,
    aytFizikY: 0,
    aytKimyaD: 0,
    aytKimyaY: 0,
    aytBiyoD: 0,
    aytBiyoY: 0,
    ydtD: 0,
    ydtY: 0,
    diplomaNotu: 80,
    prevPlacement: false,
};

const YKS_2026_START_AT = "2026-06-20T00:00:00+03:00";
const YKS_2026_END_AT = "2026-06-21T23:59:59+03:00";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const tytFields: PairField[] = [
    { label: "Türkçe", questionCount: 40, correctId: "tytTurkceD", wrongId: "tytTurkceY" },
    { label: "Sosyal Bilimler", questionCount: 20, correctId: "tytSosyalD", wrongId: "tytSosyalY" },
    { label: "Matematik", questionCount: 40, correctId: "tytMatD", wrongId: "tytMatY" },
    { label: "Fen Bilimleri", questionCount: 20, correctId: "tytFenD", wrongId: "tytFenY" },
];

const allAytAndYdtFields: PairField[] = [
    { label: "AYT Matematik", questionCount: 40, correctId: "aytMatD", wrongId: "aytMatY" },
    { label: "Türk Dili ve Edebiyatı", questionCount: 24, correctId: "aytEdebD", wrongId: "aytEdebY" },
    { label: "Tarih-1", questionCount: 10, correctId: "aytTar1D", wrongId: "aytTar1Y" },
    { label: "Coğrafya-1", questionCount: 6, correctId: "aytCog1D", wrongId: "aytCog1Y" },
    { label: "Tarih-2", questionCount: 11, correctId: "aytTar2D", wrongId: "aytTar2Y" },
    { label: "Coğrafya-2", questionCount: 11, correctId: "aytCog2D", wrongId: "aytCog2Y" },
    { label: "Felsefe Grubu", questionCount: 12, correctId: "aytFelsefeD", wrongId: "aytFelsefeY" },
    { label: "Din Kültürü", questionCount: 6, correctId: "aytDinD", wrongId: "aytDinY" },
    { label: "Fizik", questionCount: 14, correctId: "aytFizikD", wrongId: "aytFizikY" },
    { label: "Kimya", questionCount: 13, correctId: "aytKimyaD", wrongId: "aytKimyaY" },
    { label: "Biyoloji", questionCount: 13, correctId: "aytBiyoD", wrongId: "aytBiyoY" },
    { label: "Yabancı Dil Testi", questionCount: 80, correctId: "ydtD", wrongId: "ydtY" },
];

const targetAytFieldsByType: Record<YksFieldScoreType, PairField[]> = {
    say: allAytAndYdtFields.filter((field) => ["aytMatD", "aytFizikD", "aytKimyaD", "aytBiyoD"].includes(field.correctId)),
    ea: allAytAndYdtFields.filter((field) => ["aytMatD", "aytEdebD", "aytTar1D", "aytCog1D"].includes(field.correctId)),
    soz: allAytAndYdtFields.filter((field) => ["aytEdebD", "aytTar1D", "aytCog1D", "aytTar2D", "aytCog2D", "aytFelsefeD", "aytDinD"].includes(field.correctId)),
    dil: allAytAndYdtFields.filter((field) => field.correctId === "ydtD"),
};

type InputSection = {
    title: string;
    description: string;
    fields: PairField[];
    defaultOpen?: boolean;
};

const aytInputSections: InputSection[] = [
    {
        title: "AYT Matematik",
        description: "SAY ve EA puanlarında ortak kullanılan matematik netini girin.",
        defaultOpen: true,
        fields: [
            { label: "AYT Matematik", questionCount: 40, correctId: "aytMatD", wrongId: "aytMatY" },
        ],
    },
    {
        title: "AYT Türk Dili ve Edebiyatı-Sosyal Bilimler-1",
        description: "EA ve SÖZ puanları için edebiyat, tarih-1 ve coğrafya-1 testlerini girin.",
        defaultOpen: true,
        fields: [
            { label: "Türk Dili ve Edebiyatı", questionCount: 24, correctId: "aytEdebD", wrongId: "aytEdebY" },
            { label: "Tarih-1", questionCount: 10, correctId: "aytTar1D", wrongId: "aytTar1Y" },
            { label: "Coğrafya-1", questionCount: 6, correctId: "aytCog1D", wrongId: "aytCog1Y" },
        ],
    },
    {
        title: "AYT Fen Bilimleri",
        description: "SAY puanı için fizik, kimya ve biyoloji netlerini girin.",
        defaultOpen: true,
        fields: [
            { label: "Fizik", questionCount: 14, correctId: "aytFizikD", wrongId: "aytFizikY" },
            { label: "Kimya", questionCount: 13, correctId: "aytKimyaD", wrongId: "aytKimyaY" },
            { label: "Biyoloji", questionCount: 13, correctId: "aytBiyoD", wrongId: "aytBiyoY" },
        ],
    },
    {
        title: "AYT Sosyal Bilimler-2",
        description: "SÖZ puanı için ikinci sosyal bilimler testlerini girin.",
        defaultOpen: true,
        fields: [
            { label: "Tarih-2", questionCount: 11, correctId: "aytTar2D", wrongId: "aytTar2Y" },
            { label: "Coğrafya-2", questionCount: 11, correctId: "aytCog2D", wrongId: "aytCog2Y" },
            { label: "Felsefe Grubu", questionCount: 12, correctId: "aytFelsefeD", wrongId: "aytFelsefeY" },
            { label: "Din Kültürü", questionCount: 6, correctId: "aytDinD", wrongId: "aytDinY" },
        ],
    },
    {
        title: "YDT Yabancı Dil",
        description: "DİL puanı için YDT doğru ve yanlış sayılarını girin.",
        fields: [
            { label: "Yabancı Dil Testi", questionCount: 80, correctId: "ydtD", wrongId: "ydtY" },
        ],
    },
];

function formatScore(value: number) {
    if (!value) return "—";
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function formatShareScore(value: number) {
    if (!value) return "—";
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatComparisonScore(value: number) {
    if (!value) return "—";
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatNet(value: number) {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatTargetNet(value: number) {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function clampNumberInput(value: string | number, min: number, max: number) {
    const parsed = typeof value === "number" ? value : Number.parseFloat(value);
    if (!Number.isFinite(parsed)) return min;
    return Math.min(max, Math.max(min, parsed));
}

function roundToTwo(value: number) {
    return Math.round(value * 100) / 100;
}

function clampRadarNet(value: number) {
    return Math.min(40, Math.max(0, value));
}

function getYks2026CountdownDays() {
    const now = Date.now();
    const examStart = new Date(YKS_2026_START_AT).getTime();
    const examEnd = new Date(YKS_2026_END_AT).getTime();

    if (now > examEnd) return null;

    return Math.max(0, Math.ceil((examStart - now) / DAY_IN_MS));
}

function getTargetEquationParts(year: string, scoreType: YksFieldScoreType) {
    const coefficients = yksYearConfigs[year] || yksYearConfigs["2026"];
    const tytNetCoefficient =
        ((40 * coefficients.yKatTurk) +
            (20 * coefficients.yKatSos) +
            (40 * coefficients.yKatMat) +
            (20 * coefficients.yKatFen)) / 120;

    const aytCoefficientTotals: Record<YksFieldScoreType, number> = {
        say:
            (40 * coefficients.sayKatMat) +
            (14 * coefficients.sayKatFiz) +
            (13 * coefficients.sayKatKim) +
            (13 * coefficients.sayKatBiy),
        ea:
            (40 * coefficients.eaKatMat) +
            (24 * coefficients.eaKatEdeb) +
            (10 * coefficients.eaKatTar1) +
            (6 * coefficients.eaKatCog1),
        soz:
            (24 * coefficients.sozKatEdeb) +
            (10 * coefficients.sozKatTar1) +
            (6 * coefficients.sozKatCog1) +
            (11 * coefficients.sozKatTar2) +
            (11 * coefficients.sozKatCog2) +
            (12 * coefficients.sozKatFel) +
            (6 * coefficients.sozKatDin),
        dil: 80 * coefficients.dilKatYdt,
    };

    return {
        maxAytNet: 80,
        tytNetCoefficient,
        aytNetCoefficient: aytCoefficientTotals[scoreType] / 80,
    };
}

function distributeNetToFields(totalNet: number, fields: PairField[]) {
    const totalQuestionCount = fields.reduce((sum, field) => sum + field.questionCount, 0);
    return fields.reduce<Record<string, number>>((nextValues, field) => {
        const correct = totalQuestionCount > 0
            ? roundToTwo(Math.min(field.questionCount, Math.max(0, totalNet * (field.questionCount / totalQuestionCount))))
            : 0;

        nextValues[field.correctId] = correct;
        nextValues[field.wrongId] = 0;
        return nextValues;
    }, {});
}

function CompactPairRow({
    field,
    values,
    onChange,
}: {
    field: PairField;
    values: typeof initialValues;
    onChange: (id: string, value: number | boolean | string) => void;
}) {
    const d = values[field.correctId as keyof typeof initialValues] as number;
    const y = values[field.wrongId as keyof typeof initialValues] as number;
    const net = d - y / 4;

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 sm:px-4">
            {/* Label */}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{field.label}</p>
                <p className="text-[10px] text-slate-400">{field.questionCount} soru</p>
            </div>

            {/* D / Y inputs */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-semibold uppercase text-emerald-600 mb-0.5">D</span>
                    <input
                        id={field.correctId}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={field.questionCount}
                        value={d}
                        onChange={(e) => onChange(field.correctId, Math.max(0, Math.min(field.questionCount, Number.parseFloat(e.target.value) || 0)))}
                        className="w-[60px] h-[44px] rounded-xl border border-slate-300 bg-white text-center text-sm font-semibold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 sm:w-[70px]"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-semibold uppercase text-red-500 mb-0.5">Y</span>
                    <input
                        id={field.wrongId}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={field.questionCount}
                        value={y}
                        onChange={(e) => onChange(field.wrongId, Math.max(0, Math.min(field.questionCount, Number.parseFloat(e.target.value) || 0)))}
                        className="w-[60px] h-[44px] rounded-xl border border-slate-300 bg-white text-center text-sm font-semibold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 sm:w-[70px]"
                    />
                </div>
            </div>

            {/* Auto-net */}
            <div className="flex-shrink-0 text-right min-w-[52px]">
                <p className="text-[10px] text-slate-400 font-medium">Net</p>
                <p className={cn("text-sm font-bold tabular-nums", net > 0 ? "text-[#CC4A1A]" : "text-slate-400")}>
                    {net > 0 ? formatNet(net) : "—"}
                </p>
            </div>
        </div>
    );
}

type TargetPlannerRow = {
    tytNet: number;
    requiredAytNet: number;
    rawRequiredAytNet: number;
    reachable: boolean;
    projectedScore: number | null;
};

function TargetNetPlanner({
    year,
    targetType,
    targetScore,
    targetObp,
    previousPlacement,
    tytRangeStart,
    tytRangeEnd,
    onTargetTypeChange,
    onTargetScoreChange,
    onTargetObpChange,
    onPreviousPlacementChange,
    onTytRangeStartChange,
    onTytRangeEndChange,
    onApplyRow,
}: {
    year: string;
    targetType: YksFieldScoreType;
    targetScore: number;
    targetObp: number;
    previousPlacement: boolean;
    tytRangeStart: number;
    tytRangeEnd: number;
    onTargetTypeChange: (type: YksFieldScoreType) => void;
    onTargetScoreChange: (score: number) => void;
    onTargetObpChange: (obp: number) => void;
    onPreviousPlacementChange: (checked: boolean) => void;
    onTytRangeStartChange: (value: number) => void;
    onTytRangeEndChange: (value: number) => void;
    onApplyRow: (row: TargetPlannerRow) => void;
}) {
    const plannerResult = useMemo(() => {
        const parts = getTargetEquationParts(year, targetType);
        const obpContribution = targetObp * (previousPlacement ? 0.06 : 0.12);
        const start = Math.round(Math.min(tytRangeStart, tytRangeEnd));
        const end = Math.round(Math.max(tytRangeStart, tytRangeEnd));
        const rows: TargetPlannerRow[] = Array.from({ length: end - start + 1 }, (_, index) => {
            const tytNet = start + index;
            const rawRequiredAytNet = (targetScore - obpContribution - 100 - (tytNet * parts.tytNetCoefficient)) / parts.aytNetCoefficient;
            const reachable = Number.isFinite(rawRequiredAytNet) && rawRequiredAytNet <= parts.maxAytNet;
            const requiredAytNet = reachable ? Math.max(0.5, rawRequiredAytNet) : rawRequiredAytNet;

            return {
                tytNet,
                requiredAytNet,
                rawRequiredAytNet,
                reachable,
                projectedScore: reachable
                    ? 100 + (tytNet * parts.tytNetCoefficient) + (requiredAytNet * parts.aytNetCoefficient) + obpContribution
                    : null,
            };
        });

        const bestRow = rows
            .filter((row) => row.reachable)
            .reduce<TargetPlannerRow | null>((best, row) => {
                if (!best) return row;
                if (row.requiredAytNet < best.requiredAytNet) return row;
                if (row.requiredAytNet === best.requiredAytNet && row.tytNet > best.tytNet) return row;
                return best;
            }, null);

        return { rows, bestRow };
    }, [previousPlacement, targetObp, targetScore, targetType, tytRangeEnd, tytRangeStart, year]);

    const fieldLabel = targetType === "dil" ? "YDT" : "AYT";
    const summary = plannerResult.bestRow
        ? `TYT'de ${formatTargetNet(plannerResult.bestRow.tytNet)} net yaparsanız ${fieldLabel}'de ${formatTargetNet(plannerResult.bestRow.requiredAytNet)} net yeterli.`
        : `Bu TYT aralığında ${formatTargetNet(targetScore)} hedef puanı için ${fieldLabel}'de 80 net yeterli görünmüyor.`;

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">Hedef Bölüme Göre Gereken Net</h3>
                </div>

                <form
                    onSubmit={(event) => event.preventDefault()}
                    className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"
                >
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-600">Puan türü</span>
                        <select
                            value={targetType}
                            onChange={(event) => onTargetTypeChange(event.target.value as YksFieldScoreType)}
                            className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/15"
                        >
                            {(["say", "ea", "soz", "dil"] as YksFieldScoreType[]).map((type) => (
                                <option key={type} value={type}>
                                    {yksScoreTypeMeta[type].tr}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-600">Hedef puan</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            max={560}
                            step={0.1}
                            value={targetScore}
                            onChange={(event) => onTargetScoreChange(clampNumberInput(event.target.value, 0, 560))}
                            className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/15"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-600">OBP</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={250}
                            max={500}
                            step={1}
                            value={targetObp}
                            onChange={(event) => onTargetObpChange(clampNumberInput(event.target.value, 250, 500))}
                            className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/15"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-600">TYT min</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            max={120}
                            step={1}
                            value={tytRangeStart}
                            onChange={(event) => onTytRangeStartChange(clampNumberInput(event.target.value, 0, 120))}
                            className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/15"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-600">TYT max</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            max={120}
                            step={1}
                            value={tytRangeEnd}
                            onChange={(event) => onTytRangeEndChange(clampNumberInput(event.target.value, 0, 120))}
                            className="h-12 rounded-2xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/15"
                        />
                    </label>

                    <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 xl:mt-7">
                        <input
                            type="checkbox"
                            checked={previousPlacement}
                            onChange={(event) => onPreviousPlacementChange(event.target.checked)}
                            className="h-5 w-5 rounded border-slate-300 text-[#CC4A1A] focus:ring-[#FF6B35]"
                        />
                        <span>Kırık OBP</span>
                    </label>
                </form>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <div className="max-h-[360px] overflow-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                        <thead className="sticky top-0 bg-slate-50 text-xs font-black uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">TYT Net</th>
                                <th className="px-4 py-3">Gerekli {fieldLabel} Net</th>
                                <th className="px-4 py-3">Ulaşılabilir mi?</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {plannerResult.rows.map((row) => (
                                <tr
                                    key={row.tytNet}
                                    onClick={() => row.reachable && onApplyRow(row)}
                                    className={cn(
                                        "transition-colors",
                                        row.reachable
                                            ? "cursor-pointer hover:bg-[#FFF3EE]"
                                            : "bg-red-50 text-red-700"
                                    )}
                                >
                                    <td className="px-4 py-3 font-bold tabular-nums text-slate-900">
                                        {formatTargetNet(row.tytNet)}
                                    </td>
                                    <td className={cn("px-4 py-3 font-bold tabular-nums", row.reachable ? "text-slate-900" : "text-red-700")}>
                                        {formatTargetNet(row.requiredAytNet)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.reachable ? (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                                <CheckCircle2 size={14} aria-hidden="true" />
                                                Evet (max 80)
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-black text-red-700">
                                                <AlertTriangle size={14} aria-hidden="true" />
                                                Mümkün değil
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-900">
                {summary}
            </p>
        </section>
    );
}

export default function YksCalculator({ lang }: { lang: "tr" | "en" }) {
    const [values, setValues] = useState(initialValues);
    const [targetType, setTargetType] = useState<YksFieldScoreType>("say");
    const [targetScore, setTargetScore] = useState(450);
    const [targetObp, setTargetObp] = useState(initialValues.diplomaNotu * 5);
    const [targetPreviousPlacement, setTargetPreviousPlacement] = useState(initialValues.prevPlacement);
    const [targetTytMin, setTargetTytMin] = useState(80);
    const [targetTytMax, setTargetTytMax] = useState(90);
    const [yksCountdownDays, setYksCountdownDays] = useState<number | null>(null);
    const [shareCopied, setShareCopied] = useState(false);

    const results = useMemo(() => calculateYksScores(values), [values]);

    useEffect(() => {
        setYksCountdownDays(getYks2026CountdownDays());
    }, []);

    const handleChange = (id: string, value: number | boolean | string) => {
        setValues((current) => ({ ...current, [id]: value }));
    };

    const handleApplyTargetRow = (row: TargetPlannerRow) => {
        if (!row.reachable) return;

        const nextTytValues = distributeNetToFields(row.tytNet, tytFields);
        const clearedAytValues = allAytAndYdtFields.reduce<Record<string, number>>((nextValues, field) => {
            nextValues[field.correctId] = 0;
            nextValues[field.wrongId] = 0;
            return nextValues;
        }, {});
        const nextAytValues = distributeNetToFields(row.requiredAytNet, targetAytFieldsByType[targetType]);

        setValues((current) => ({
            ...current,
            ...nextTytValues,
            ...clearedAytValues,
            ...nextAytValues,
            diplomaNotu: roundToTwo(targetObp / 5),
            prevPlacement: targetPreviousPlacement,
        }));
    };

    const scoreCards = useMemo(() => {
        const ydtEntered = values.ydtD > 0 || values.ydtY > 0;
        const cards = [
            { key: "say", label: "SAY", raw: results.sayPuan, placement: results.ySay, eligible: results.sayEligible, net: results.sayAytNet },
            { key: "ea", label: "EA", raw: results.eaPuan, placement: results.yEa, eligible: results.eaEligible, net: results.eaAytNet },
            { key: "soz", label: "SÖZ", raw: results.sozPuan, placement: results.ySoz, eligible: results.sozEligible, net: results.sozAytNet },
            { key: "dil", label: "DİL", raw: results.dilPuan, placement: results.yDil, eligible: results.dilEligible, net: results.ydtNet },
        ] satisfies {
            key: Exclude<YksScoreType, "tyt">;
            label: string;
            raw: number;
            placement: number;
            eligible: boolean;
            net: number;
        }[];

        return cards.map((card) => {
            const status = card.key === "dil" && !ydtEntered
                ? "missing"
                : card.eligible
                    ? "valid"
                    : "invalid";
            return {
                ...card,
                status,
                statusLabel: status === "missing" ? "Veri girilmedi" : status === "invalid" ? "Geçersiz" : "Hesaplandı",
                note: status === "missing"
                    ? "YDT neti girilmedi"
                    : status === "invalid"
                        ? "0,5 net kuralı sağlanmadı"
                        : `Ham puan ${formatScore(card.raw)}`,
            };
        });
    }, [results, values.ydtD, values.ydtY]);

    const highestCard = useMemo(() => {
        return scoreCards
            .filter((card) => card.status === "valid")
            .reduce<(typeof scoreCards)[number] | null>((best, card) => {
                if (!best || card.placement > best.placement) return card;
                return best;
            }, null);
    }, [scoreCards]);

    const shareText = useMemo(() => {
        if (!highestCard) return "";

        const areaLabel = highestCard.key === "dil" ? "YDT" : "AYT";

        return [
            "📊 YKS 2026 Puan Hesabım",
            `TYT: ${formatTargetNet(results.tytTotalNet)} net → ${areaLabel}: ${formatTargetNet(highestCard.net)} net`,
            `SAY: ${formatShareScore(results.ySay)} | EA: ${formatShareScore(results.yEa)} | SÖZ: ${formatShareScore(results.ySoz)}`,
            `OBP katkısı: +${formatShareScore(results.obpPuani)} puan`,
            "hesapmod.com ile hesaplandı",
        ].join("\n");
    }, [highestCard, results]);

    const handleCopyShareResult = async () => {
        if (!highestCard || !shareText || !navigator.clipboard) return;

        try {
            await navigator.clipboard.writeText(shareText);
            setShareCopied(true);
            window.setTimeout(() => setShareCopied(false), 2000);
        } catch {
            setShareCopied(false);
        }
    };

    const radarSummary = useMemo(() => {
        const activeScoreType = highestCard?.key ?? targetType;
        const activeAytNet = activeScoreType === "say"
            ? results.sayAytNet
            : activeScoreType === "ea"
                ? results.eaAytNet
                : activeScoreType === "soz"
                    ? results.sozAytNet
                    : results.ydtNet;
        const activeAytLabel = activeScoreType === "dil" ? "YDT Alan" : `AYT ${yksScoreTypeMeta[activeScoreType].tr}`;
        const rows = [
            { subject: "TYT Türkçe", rawUserNet: results.tytTurkNet, userNet: clampRadarNet(results.tytTurkNet), averageNet: 18 },
            { subject: "TYT Mat", rawUserNet: results.tytMatNet, userNet: clampRadarNet(results.tytMatNet), averageNet: 8 },
            { subject: "TYT Fen", rawUserNet: results.tytFenNet, userNet: clampRadarNet(results.tytFenNet), averageNet: 7 },
            { subject: "TYT Sosyal", rawUserNet: results.tytSosNet, userNet: clampRadarNet(results.tytSosNet), averageNet: 12 },
            { subject: activeAytLabel, rawUserNet: activeAytNet, userNet: clampRadarNet(activeAytNet), averageNet: 12 },
        ];

        return {
            data: rows,
            aboveAverage: rows.filter((row) => row.rawUserNet > row.averageNet).map((row) => row.subject),
            needsWork: rows.filter((row) => row.rawUserNet < row.averageNet).map((row) => row.subject),
        };
    }, [highestCard?.key, results, targetType]);

    const netHighlights = useMemo(() => [
        { label: "TYT toplam net", value: results.tytTotalNet, kind: "net" },
        { label: "SAY alan neti", value: results.sayAytNet, kind: "net" },
        { label: "EA alan neti", value: results.eaAytNet, kind: "net" },
        { label: "SÖZ alan neti", value: results.sozAytNet, kind: "net" },
        { label: "YDT neti", value: results.ydtNet, kind: "net" },
        { label: "OBP katkısı", value: results.obpPuani, kind: "point" },
    ], [results]);

    const coefficientComparisonRows = useMemo(() => {
        const comparisonYears = ["2023", "2024", "2025", "2026"];
        const rows = comparisonYears.map((year) => {
            const yearResults = calculateYksScores({ ...values, sinav_yili: year });
            const bestScore = Math.max(yearResults.ySay, yearResults.yEa, yearResults.ySoz);

            return {
                year,
                say: yearResults.ySay,
                ea: yearResults.yEa,
                soz: yearResults.ySoz,
                bestScore,
            };
        });
        const base2026 = rows.find((row) => row.year === "2026")?.bestScore ?? 0;

        return rows.map((row) => ({
            ...row,
            difference: row.year === "2026" || !base2026 || !row.bestScore ? null : row.bestScore - base2026,
        }));
    }, [values]);

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-[#FFD7C7] bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.18),_transparent_42%),linear-gradient(135deg,#fff3ee_0%,#ffffff_45%,#f8fafc_100%)] p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {yksCountdownDays !== null && (
                        <div className="inline-flex items-center rounded-full border border-[#FF6B35]/25 bg-white/90 px-3 py-1.5 text-xs font-black text-[#B43E12] shadow-sm sm:text-sm">
                            📅 YKS 2026&apos;ya {yksCountdownDays} gün kaldı
                        </div>
                    )}
                    <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-2 py-1 shadow-sm">
                        <span className="pl-2 text-xs font-black uppercase tracking-wide text-slate-500">Sonucu Paylaş</span>
                        <button
                            type="button"
                            onClick={handleCopyShareResult}
                            disabled={!highestCard}
                            className={cn(
                                "inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-black transition",
                                highestCard
                                    ? "bg-slate-950 text-white hover:bg-slate-800"
                                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                            )}
                        >
                            {!shareCopied && <Share2 size={14} />}
                            {shareCopied ? "✅ Kopyalandı!" : "Kopyala"}
                        </button>
                    </div>
                </div>
                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-end">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">YKS puanını 2026 için hızlı, şeffaf ve okunabilir biçimde simüle et</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                            20-21 Haziran 2026 YKS öncesinde TYT, AYT, YDT ve OBP etkisini ayrı ayrı gör. Netleri girdikçe SAY, EA, SÖZ ve DİL yerleştirme puanları aynı anda güncellenir.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Calculator size={16} className="text-[#CC4A1A]" /> 4 yanlış 1 doğru</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">Netler otomatik hesaplanır, manuel dönüştürme gerekmez.</p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Target size={16} className="text-[#CC4A1A]" /> 4 puan türü</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">Alan netleri tek kez girilir, tüm puan türleri birlikte karşılaştırılır.</p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><BookOpenCheck size={16} className="text-[#CC4A1A]" /> 2026 katsayıları</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">Varsayılan set 2026 ÖSYM kılavuz ağırlıklarına göre çalışır.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <div className="space-y-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                            <div>
                                <label htmlFor="sinav_yili" className="mb-2 block text-sm font-semibold text-slate-700">Simülasyon seti</label>
                                <select
                                    id="sinav_yili"
                                    value={values.sinav_yili}
                                    onChange={(event) => handleChange("sinav_yili", event.target.value)}
                                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/15"
                                >
                                    {Object.entries(yksYearConfigs).map(([year, config]) => (
                                        <option key={year} value={year}>{config.label[lang]}</option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs leading-6 text-slate-500">{results.yearHelperText[lang]}</p>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-semibold text-slate-700">Karşılaştırılan puan türleri</p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {(["say", "ea", "soz", "dil"] as Exclude<YksScoreType, "tyt">[]).map((item) => (
                                        <div
                                            key={item}
                                            className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700"
                                        >
                                            {yksScoreTypeMeta[item][lang]}
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs leading-6 text-slate-500">En yüksek geçerli yerleştirme puanı sağdaki karşılaştırmada mavi vurgulanır.</p>
                            </div>
                        </div>
                    </section>

                    <CollapsibleSection
                        title="TYT Testleri"
                        description="Tüm puan türlerinin temelini oluşturan TYT netlerinizi girin."
                        isFilled={values.tytTurkceD > 0 || values.tytMatD > 0 || values.tytSosyalD > 0 || values.tytFenD > 0}
                        defaultOpen={true}
                    >
                        {tytFields.map((field) => (
                            <CompactPairRow key={field.correctId} field={field} values={values} onChange={handleChange} />
                        ))}
                    </CollapsibleSection>

                    {aytInputSections.map((section) => {
                        const sectionFilled = section.fields.some(
                            (f) => (values[f.correctId as keyof typeof initialValues] as number) > 0
                        );
                        return (
                            <CollapsibleSection
                                key={section.title}
                                title={section.title}
                                description={section.description}
                                isFilled={sectionFilled}
                                defaultOpen={section.defaultOpen}
                            >
                                {section.fields.map((field) => (
                                    <CompactPairRow key={field.correctId} field={field} values={values} onChange={handleChange} />
                                ))}
                            </CollapsibleSection>
                        );
                    })}

                    <CollapsibleSection
                        title="OBP / Diploma Notu"
                        description="OBP katkısı yerleştirme puanınıza doğrudan eklenir."
                        isFilled={values.diplomaNotu !== 80 || values.prevPlacement}
                        defaultOpen={false}
                    >
                        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-slate-700">Diploma notu</span>
                                <input
                                    id="diplomaNotu"
                                    type="number"
                                    min={50}
                                    max={100}
                                    step={0.1}
                                    value={values.diplomaNotu}
                                    onChange={(event) => handleChange("diplomaNotu", Math.max(50, Math.min(100, Number.parseFloat(event.target.value) || 50)))}
                                    className="h-12 rounded-2xl border border-slate-300 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/15"
                                />
                            </label>
                            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                <input
                                    id="prevPlacement"
                                    type="checkbox"
                                    checked={values.prevPlacement}
                                    onChange={(event) => handleChange("prevPlacement", event.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-[#CC4A1A] focus:ring-[#FF6B35]"
                                />
                                <span>
                                    Önceki yıl bir programa yerleştim
                                    <span className="mt-1 block text-xs font-normal leading-6 text-slate-500">İşaretlersen OBP katkısı kırılmış olarak hesaplanır.</span>
                                </span>
                            </label>
                        </div>
                    </CollapsibleSection>

                    <TargetNetPlanner
                        year={values.sinav_yili}
                        targetType={targetType}
                        targetScore={targetScore}
                        targetObp={targetObp}
                        previousPlacement={targetPreviousPlacement}
                        tytRangeStart={targetTytMin}
                        tytRangeEnd={targetTytMax}
                        onTargetTypeChange={setTargetType}
                        onTargetScoreChange={setTargetScore}
                        onTargetObpChange={setTargetObp}
                        onPreviousPlacementChange={setTargetPreviousPlacement}
                        onTytRangeStartChange={setTargetTytMin}
                        onTytRangeEndChange={setTargetTytMax}
                        onApplyRow={handleApplyTargetRow}
                    />
                </div>

                <aside className="space-y-5 lg:sticky lg:top-24">
                    <section className="overflow-hidden rounded-[28px] border border-slate-900 bg-slate-950 text-white shadow-xl">
                        <div className="border-b border-white/10 px-5 py-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD7C7]">Canlı sonuç</p>
                                    <h3 className="mt-2 text-xl font-black tracking-tight">
                                        {highestCard ? `${highestCard.label} en yüksek` : "Alan puanı bekleniyor"}
                                    </h3>
                                </div>
                                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                                    {results.yearLabel[lang]}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-5 px-5 py-5">
                            <div className="rounded-3xl bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Yerleştirme puanı</p>
                                <p className="mt-2 text-4xl font-black tracking-tight text-white">{formatScore(highestCard?.placement ?? 0)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-white/60">Ham puan</p>
                                    <p className="mt-2 text-2xl font-bold">{formatScore(highestCard?.raw ?? 0)}</p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-white/60">OBP katkısı</p>
                                    <p className="mt-2 text-2xl font-bold">{results.obpPuani.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <div className={cn("rounded-2xl border px-4 py-3 text-sm leading-6", highestCard ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-50")}>
                                <div className="flex items-start gap-2">
                                    {highestCard ? <Trophy size={18} className="mt-0.5 shrink-0" /> : <Target size={18} className="mt-0.5 shrink-0" />}
                                    <p>
                                        {highestCard
                                            ? `${highestCard.label} şu an en yüksek geçerli yerleştirme puanı.`
                                            : "Karşılaştırma için TYT ve ilgili AYT/YDT alanlarında 0,5 net koşulunu sağlayan veri gerekir."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold tracking-tight text-slate-900">Net radar analizi</h3>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">0-40</span>
                        </div>

                        <div className="mt-4 h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarSummary.data} outerRadius="72%">
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 40]}
                                        tickCount={5}
                                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                                        stroke="#cbd5e1"
                                    />
                                    <Radar
                                        name="Türkiye Ortalaması"
                                        dataKey="averageNet"
                                        stroke="#94a3b8"
                                        strokeDasharray="4 4"
                                        fill="transparent"
                                        strokeWidth={2}
                                    />
                                    <Radar
                                        name="Senin Netler"
                                        dataKey="userNet"
                                        stroke="#2563eb"
                                        fill="#3b82f6"
                                        fillOpacity={0.28}
                                        strokeWidth={2}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            const numericValue = typeof value === "number" ? value : Number(value) || 0;
                                            return [`${formatTargetNet(numericValue)} net`, String(name)];
                                        }}
                                        contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: 12, fontSize: 12, fontWeight: 700 }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 space-y-3 text-sm leading-6">
                            <p className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-900">
                                Ortalamanın üzerinde olduğun testler: {radarSummary.aboveAverage.length > 0 ? radarSummary.aboveAverage.join(", ") : "Yok"}
                            </p>
                            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
                                Geliştirmen gereken testler: {radarSummary.needsWork.length > 0 ? radarSummary.needsWork.join(", ") : "Yok"}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Net özeti</h3>
                        <div className="mt-4 grid gap-3">
                            {netHighlights.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                                    <span className="text-lg font-bold tracking-tight text-slate-900">
                                        {item.kind === "point" ? item.value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : formatNet(item.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold tracking-tight text-slate-900">Puan türü karşılaştırması</h3>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{results.year}</span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {scoreCards.map((card) => {
                                const isHighest = highestCard?.key === card.key && card.status === "valid";
                                const isInvalid = card.status === "invalid";
                                const isMissing = card.status === "missing";
                                return (
                                    <div
                                        key={card.key}
                                        className={cn(
                                            "min-h-[128px] rounded-2xl border px-3 py-3 transition sm:px-4",
                                            isHighest && "border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-100",
                                            !isHighest && isInvalid && "border-red-200 bg-red-50",
                                            !isHighest && isMissing && "border-slate-200 bg-slate-100",
                                            !isHighest && !isInvalid && !isMissing && "border-slate-200 bg-white"
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className={cn("text-sm font-black tracking-tight", isInvalid ? "text-red-700" : isMissing ? "text-slate-500" : isHighest ? "text-blue-800" : "text-slate-800")}>
                                                {card.label}
                                            </span>
                                            {isHighest ? (
                                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                                            ) : isInvalid ? (
                                                <AlertTriangle size={16} className="shrink-0 text-red-500" />
                                            ) : isMissing ? (
                                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
                                            ) : (
                                                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                                            )}
                                        </div>
                                        <p className={cn("mt-2 text-2xl font-black tracking-tight tabular-nums", isInvalid ? "text-red-700" : isMissing ? "text-slate-400" : isHighest ? "text-blue-900" : "text-slate-950")}>
                                            {card.status === "valid" ? formatScore(card.placement) : "—"}
                                        </p>
                                        <div className="mt-2 min-h-[42px]">
                                            <p className={cn("text-[11px] font-bold uppercase tracking-wide", isInvalid ? "text-red-600" : isMissing ? "text-slate-500" : isHighest ? "text-blue-700" : "text-emerald-700")}>
                                                {isHighest ? "En yüksek" : card.statusLabel}
                                            </p>
                                            <p className={cn("mt-1 text-[11px] leading-4", isInvalid ? "text-red-600" : isMissing ? "text-slate-500" : isHighest ? "text-blue-700" : "text-slate-500")}>
                                                {card.note}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <details className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50">
                            <span className="text-lg font-bold tracking-tight text-slate-900">Yıllara Göre Katsayı Karşılaştırması</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">2023-2026</span>
                        </summary>
                        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                            <div className="overflow-hidden rounded-2xl border border-slate-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[520px] text-left text-sm">
                                        <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Yıl</th>
                                                <th className="px-4 py-3">SAY</th>
                                                <th className="px-4 py-3">EA</th>
                                                <th className="px-4 py-3">SÖZ</th>
                                                <th className="px-4 py-3">Fark (2026'ya göre)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {coefficientComparisonRows.map((row) => (
                                                <tr key={row.year}>
                                                    <td className="px-4 py-3 font-black text-slate-900">{row.year}</td>
                                                    <td className="px-4 py-3 font-bold tabular-nums text-slate-800">{formatComparisonScore(row.say)}</td>
                                                    <td className="px-4 py-3 font-bold tabular-nums text-slate-800">{formatComparisonScore(row.ea)}</td>
                                                    <td className="px-4 py-3 font-bold tabular-nums text-slate-800">{formatComparisonScore(row.soz)}</td>
                                                    <td className={cn(
                                                        "px-4 py-3 font-black tabular-nums",
                                                        row.difference === null || Math.abs(row.difference) < 0.05
                                                            ? "text-slate-400"
                                                            : row.difference > 0
                                                                ? "text-emerald-600"
                                                                : "text-red-600"
                                                    )}>
                                                        {row.difference === null || Math.abs(row.difference) < 0.05
                                                            ? "—"
                                                            : `${row.difference > 0 ? "+" : ""}${formatComparisonScore(row.difference)}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
                                Katsayılar her yıl ÖSYM tarafından güncellenir. Geçmiş yıl puanları doğrudan karşılaştırılamaz; yerleştirme sıralaması asıl belirleyicidir.
                            </p>
                        </div>
                    </details>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Hızlı notlar</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <GraduationCap size={18} className="mt-0.5 shrink-0 text-[#CC4A1A]" />
                                <p>TYT puanının oluşması için Türkçe veya Matematik testinden en az 0,5 net gerekir.</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <Sigma size={18} className="mt-0.5 shrink-0 text-[#CC4A1A]" />
                                <p>Ham puan ile yerleştirme puanı aynı şey değildir; OBP yalnızca yerleştirme puanına eklenir.</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <Languages size={18} className="mt-0.5 shrink-0 text-[#CC4A1A]" />
                                <p>DİL kartı, YDT doğru veya yanlış bilgisi girilene kadar veri girilmedi durumunda kalır.</p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
