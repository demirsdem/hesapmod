"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calculator, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguageCode } from "@/lib/calculator-types";

type AlesPeriod = "2025/3" | "2025/2" | "2025/1" | "2024/2" | "2024/1";
type TargetScoreType = "SAY" | "SÖZ" | "EA";

type AlesCoefficients = {
    saySabit: number;
    sayKatS: number;
    sayKatZ: number;
    sozSabit: number;
    sozKatS: number;
    sozKatZ: number;
    eaSabit: number;
    eaKatS: number;
    eaKatZ: number;
};

type AlesValues = {
    sinavDonemi: AlesPeriod;
    sayDogru: number;
    sayYanlis: number;
    sozDogru: number;
    sozYanlis: number;
};

type QuestionFieldId = keyof Pick<AlesValues, "sayDogru" | "sayYanlis" | "sozDogru" | "sozYanlis">;

type TargetRow = {
    sayNet: number;
    sozNet: number | null;
    score: number | null;
};

type AlesScores = {
    sayPuan: number;
    sozPuan: number;
    eaPuan: number;
};

type PeriodComparisonRow = {
    period: AlesPeriod;
    scores: AlesScores;
};

const ALES_PERIODS: AlesPeriod[] = ["2025/3", "2025/2", "2025/1", "2024/2", "2024/1"];
const TARGET_SCORE_TYPES: TargetScoreType[] = ["SAY", "SÖZ", "EA"];
const ALES_FORM_STORAGE_KEY = "ales-form";
const YOK_ATLAS_URL = "https://yokatlas.yok.gov.tr/";

const PROGRAM_TYPES: Record<TargetScoreType, string[]> = {
    SAY: ["Mühendislik", "Fen Bilimleri", "İstatistik"],
    SÖZ: ["Sosyal Bilimler", "Hukuk", "İktisat"],
    EA: ["İşletme", "Eğitim", "Psikoloji"],
};

const ALES_COEFFICIENTS: Record<AlesPeriod, AlesCoefficients> = {
    "2025/3": {
        saySabit: 47.487,
        sayKatS: 0.76542,
        sayKatZ: 0.31649,
        sozSabit: 44.292,
        sozKatS: 0.25121,
        sozKatZ: 0.93482,
        eaSabit: 46.786,
        eaKatS: 0.50146,
        eaKatZ: 0.62202,
    },
    "2025/2": {
        saySabit: 47.391,
        sayKatS: 0.76612,
        sayKatZ: 0.31578,
        sozSabit: 44.201,
        sozKatS: 0.25089,
        sozKatZ: 0.93521,
        eaSabit: 46.701,
        eaKatS: 0.50134,
        eaKatZ: 0.62198,
    },
    "2025/1": {
        saySabit: 47.43286,
        sayKatS: 0.77475,
        sayKatZ: 0.32541,
        sozSabit: 40.91022,
        sozKatS: 0.26999,
        sozKatZ: 0.77475,
        eaSabit: 45.40759,
        eaKatS: 0.5177,
        eaKatZ: 0.65232,
    },
    "2024/2": {
        saySabit: 47.43286,
        sayKatS: 0.77475,
        sayKatZ: 0.32541,
        sozSabit: 40.91022,
        sozKatS: 0.26999,
        sozKatZ: 0.77475,
        eaSabit: 45.40759,
        eaKatS: 0.5177,
        eaKatZ: 0.65232,
    },
    "2024/1": {
        saySabit: 47.43286,
        sayKatS: 0.77475,
        sayKatZ: 0.32541,
        sozSabit: 40.91022,
        sozKatS: 0.26999,
        sozKatZ: 0.77475,
        eaSabit: 45.40759,
        eaKatS: 0.5177,
        eaKatZ: 0.65232,
    },
};

const INITIAL_VALUES: AlesValues = {
    sinavDonemi: "2025/3",
    sayDogru: 32,
    sayYanlis: 0,
    sozDogru: 32,
    sozYanlis: 0,
};

function clampQuestionCount(value: string | number) {
    const parsed = typeof value === "number" ? value : Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return Math.max(0, Math.min(50, parsed));
}

function normalizeAlesValues(values: AlesValues): AlesValues {
    const sayDogru = clampQuestionCount(values.sayDogru);
    let sayYanlis = clampQuestionCount(values.sayYanlis);
    const sozDogru = clampQuestionCount(values.sozDogru);
    let sozYanlis = clampQuestionCount(values.sozYanlis);

    if (sayDogru + sayYanlis > 50) {
        sayYanlis = Math.max(0, 50 - sayDogru);
    }

    if (sozDogru + sozYanlis > 50) {
        sozYanlis = Math.max(0, 50 - sozDogru);
    }

    return {
        sinavDonemi: values.sinavDonemi,
        sayDogru,
        sayYanlis,
        sozDogru,
        sozYanlis,
    };
}

function readStoredAlesValues() {
    if (typeof window === "undefined") {
        return INITIAL_VALUES;
    }

    try {
        const raw = window.sessionStorage.getItem(ALES_FORM_STORAGE_KEY);
        if (!raw) {
            return INITIAL_VALUES;
        }

        const parsed = JSON.parse(raw) as Partial<AlesValues>;
        const sinavDonemi = ALES_PERIODS.includes(parsed.sinavDonemi as AlesPeriod)
            ? parsed.sinavDonemi as AlesPeriod
            : INITIAL_VALUES.sinavDonemi;

        return normalizeAlesValues({
            sinavDonemi,
            sayDogru: clampQuestionCount(parsed.sayDogru ?? INITIAL_VALUES.sayDogru),
            sayYanlis: clampQuestionCount(parsed.sayYanlis ?? INITIAL_VALUES.sayYanlis),
            sozDogru: clampQuestionCount(parsed.sozDogru ?? INITIAL_VALUES.sozDogru),
            sozYanlis: clampQuestionCount(parsed.sozYanlis ?? INITIAL_VALUES.sozYanlis),
        });
    } catch {
        return INITIAL_VALUES;
    }
}

function clampTargetScore(value: string) {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return Math.max(0, Math.min(100, parsed));
}

function getFormulaParts(k: AlesCoefficients, type: TargetScoreType) {
    if (type === "SAY") {
        return {
            base: k.saySabit,
            sayCoef: k.sayKatS,
            sozCoef: k.sayKatZ,
        };
    }

    if (type === "SÖZ") {
        return {
            base: k.sozSabit,
            sayCoef: k.sozKatS,
            sozCoef: k.sozKatZ,
        };
    }

    return {
        base: k.eaSabit,
        sayCoef: k.eaKatS,
        sozCoef: k.eaKatZ,
    };
}

function calculateTypedScore(k: AlesCoefficients, type: TargetScoreType, sayNet: number, sozNet: number) {
    const parts = getFormulaParts(k, type);
    return parts.base + sayNet * parts.sayCoef + sozNet * parts.sozCoef;
}

function calculateScores(k: AlesCoefficients, sayNet: number, sozNet: number): AlesScores {
    return {
        sayPuan: calculateTypedScore(k, "SAY", sayNet, sozNet),
        sozPuan: calculateTypedScore(k, "SÖZ", sayNet, sozNet),
        eaPuan: calculateTypedScore(k, "EA", sayNet, sozNet),
    };
}

function getApplicationComment(score: number) {
    if (score < 55) {
        return "Çoğu lisansüstü programa başvuru eşiğinin altında. Yeniden giriş önerilir.";
    }

    if (score < 60) {
        return "Bazı programlara başvuru mümkün ancak rekabetçi değil.";
    }

    if (score < 70) {
        return "Standart lisansüstü başvurular için geçerli. Programın taban puanını kontrol edin.";
    }

    if (score < 80) {
        return "Devlet üniversitelerinin büyük çoğunluğunda güçlü bir başvuru puanı.";
    }

    if (score < 90) {
        return "Prestijli programlar dahil geniş tercih yelpazesi.";
    }

    return "İstisnai puan. Akademik kariyer başvuruları için elverişli.";
}

function formatNet(value: number) {
    return value.toLocaleString("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
}

function getScoreTone(score: number | null) {
    if (score === null) {
        return {
            card: "border-slate-200 bg-white",
            label: "text-slate-500",
            value: "text-slate-400",
            net: "text-slate-400",
        };
    }

    if (score < 60) {
        return {
            card: "border-red-200 bg-red-50",
            label: "text-red-700",
            value: "text-red-950",
            net: "text-red-700",
        };
    }

    if (score < 70) {
        return {
            card: "border-yellow-200 bg-yellow-50",
            label: "text-yellow-800",
            value: "text-yellow-950",
            net: "text-yellow-800",
        };
    }

    if (score < 80) {
        return {
            card: "border-blue-200 bg-blue-50",
            label: "text-blue-700",
            value: "text-blue-950",
            net: "text-blue-700",
        };
    }

    return {
        card: "border-emerald-200 bg-emerald-50",
        label: "text-emerald-700",
        value: "text-emerald-950",
        net: "text-emerald-700",
    };
}

function StepperSliderField({
    id,
    label,
    value,
    onChange,
}: {
    id: QuestionFieldId;
    label: string;
    value: number;
    onChange: (id: QuestionFieldId, value: number) => void;
}) {
    const updateValue = (nextValue: number) => onChange(id, clampQuestionCount(nextValue));

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <label htmlFor={id} className="text-sm font-semibold text-slate-600">
                {label}
            </label>

            <div className="grid gap-3 sm:grid-cols-[minmax(160px,220px)_1fr] sm:items-center">
                <div className="grid h-12 grid-cols-[44px_1fr_44px] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
                    <button
                        type="button"
                        onClick={() => updateValue(value - 1)}
                        className="min-h-10 min-w-10 border-r border-slate-200 text-xl font-black text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                        aria-label={`${label} azalt`}
                    >
                        -
                    </button>
                    <input
                        id={id}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={50}
                        step={1}
                        value={Number.isInteger(value) ? value : Number(value.toFixed(2))}
                        onChange={(event) => updateValue(Number.parseFloat(event.target.value))}
                        className="min-h-11 w-full border-0 px-2 text-center text-base font-black text-slate-900 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => updateValue(value + 1)}
                        className="min-h-10 min-w-10 border-l border-slate-200 text-xl font-black text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                        aria-label={`${label} artır`}
                    >
                        +
                    </button>
                </div>

                <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={Math.round(value)}
                    onChange={(event) => updateValue(Number.parseFloat(event.target.value))}
                    className="h-11 w-full cursor-ew-resize accent-[#FF6B35]"
                    aria-label={`${label} slider`}
                />
            </div>
        </div>
    );
}

function ResultCard({
    title,
    score,
    net,
}: {
    title: string;
    score: number | null;
    net?: number;
}) {
    const tone = getScoreTone(score);

    return (
        <div className={cn("min-h-[176px] rounded-xl border p-5 shadow-sm transition-all", tone.card)}>
            <p className={cn("text-sm font-black uppercase", tone.label)}>{title}</p>
            <p className={cn("mt-5 text-4xl font-black tracking-normal", tone.value)}>
                {score === null ? "—" : score.toFixed(3)}
            </p>
            {typeof net === "number" ? (
                <p className={cn("mt-4 text-sm font-bold", tone.net)}>Net: {net.toFixed(1)}</p>
            ) : (
                <p className="mt-4 text-sm font-bold text-transparent" aria-hidden="true">
                    Net
                </p>
            )}
        </div>
    );
}

function PeriodComparisonAccordion({
    selectedPeriod,
    sayNet,
    sozNet,
    isValid,
}: {
    selectedPeriod: AlesPeriod;
    sayNet: number;
    sozNet: number;
    isValid: boolean;
}) {
    const [isOpen, setIsOpen] = useState(true);

    const comparison = useMemo(() => {
        if (!isValid) {
            return null;
        }

        const rows: PeriodComparisonRow[] = ALES_PERIODS.map((period) => ({
            period,
            scores: calculateScores(ALES_COEFFICIENTS[period], sayNet, sozNet),
        }));
        const fields: Array<{ key: keyof AlesScores; type: TargetScoreType }> = [
            { key: "sayPuan", type: "SAY" },
            { key: "sozPuan", type: "SÖZ" },
            { key: "eaPuan", type: "EA" },
        ];

        const limits = fields.reduce((acc, field) => {
            const values = rows.map((row) => row.scores[field.key]);
            acc[field.key] = {
                min: Math.min(...values),
                max: Math.max(...values),
            };
            return acc;
        }, {} as Record<keyof AlesScores, { min: number; max: number }>);

        const best = rows.reduce<{ period: AlesPeriod; type: TargetScoreType; score: number } | null>((currentBest, row) => {
            const candidates = fields.map((field) => ({
                period: row.period,
                type: field.type,
                score: row.scores[field.key],
            }));
            const rowBest = candidates.reduce((bestCandidate, candidate) =>
                candidate.score > bestCandidate.score ? candidate : bestCandidate
            );

            if (!currentBest || rowBest.score > currentBest.score) {
                return rowBest;
            }

            return currentBest;
        }, null);

        return {
            rows,
            limits,
            best,
        };
    }, [isValid, sayNet, sozNet]);

    const renderCell = (row: PeriodComparisonRow, key: keyof AlesScores) => {
        const value = row.scores[key];
        const limit = comparison?.limits[key];
        const isBest = Boolean(limit && value === limit.max && limit.max !== limit.min);
        const isWorst = Boolean(limit && value === limit.min && limit.max !== limit.min);

        return (
            <td
                className={cn(
                    "px-4 py-3 font-bold tabular-nums",
                    isBest && "bg-emerald-50 text-emerald-800",
                    isWorst && "bg-red-50 text-red-700",
                    !isBest && !isWorst && "text-slate-800"
                )}
            >
                {value.toFixed(1)}
            </td>
        );
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                aria-expanded={isOpen}
            >
                <span className="text-xl font-bold text-slate-900">Dönem Karşılaştırması</span>
                <ChevronDown
                    size={22}
                    className={cn("shrink-0 text-slate-500 transition-transform", isOpen && "rotate-180")}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                    {!comparison ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
                            Dönem karşılaştırması için her iki testten en az 1 net ve geçerli soru sayısı gerekli.
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[520px] text-left text-sm">
                                        <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Dönem</th>
                                                <th className="px-4 py-3">SAY</th>
                                                <th className="px-4 py-3">SÖZ</th>
                                                <th className="px-4 py-3">EA</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {comparison.rows.map((row) => {
                                                const isSelected = row.period === selectedPeriod;

                                                return (
                                                    <tr
                                                        key={row.period}
                                                        className={cn(
                                                            "transition-colors",
                                                            isSelected ? "bg-[#FFF3EE] font-black" : "hover:bg-slate-50"
                                                        )}
                                                    >
                                                        <td className="px-4 py-3 font-black text-slate-900">
                                                            {row.period}
                                                        </td>
                                                        {renderCell(row, "sayPuan")}
                                                        {renderCell(row, "sozPuan")}
                                                        {renderCell(row, "eaPuan")}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {comparison.best && (
                                <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
                                    Bu netlerle en avantajlı dönem: {comparison.best.period} ({comparison.best.type}: {comparison.best.score.toFixed(1)})
                                </p>
                            )}

                            <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
                                Birden fazla ALES sonucu olan adaylar hangi dönem sonucunun başvuruda avantajlı olduğunu görebilir.
                            </p>
                        </>
                    )}
                </div>
            )}
        </section>
    );
}

function TargetNetPlanner({
    period,
    targetType,
    targetScore,
    onTargetTypeChange,
    onTargetScoreChange,
    onApplyRow,
}: {
    period: AlesPeriod;
    targetType: TargetScoreType;
    targetScore: number;
    onTargetTypeChange: (type: TargetScoreType) => void;
    onTargetScoreChange: (score: number) => void;
    onApplyRow: (row: TargetRow) => void;
}) {
    const targetResult = useMemo(() => {
        const k = ALES_COEFFICIENTS[period];
        const parts = getFormulaParts(k, targetType);
        const rows: TargetRow[] = Array.from({ length: 51 }, (_, sayNet) => {
            const sozNet = (targetScore - parts.base - sayNet * parts.sayCoef) / parts.sozCoef;
            const isValid = Number.isFinite(sozNet) && sozNet >= 0 && sozNet <= 50;

            if (!isValid) {
                return {
                    sayNet,
                    sozNet: null,
                    score: null,
                };
            }

            return {
                sayNet,
                sozNet,
                score: calculateTypedScore(k, targetType, sayNet, sozNet),
            };
        });

        const validRows = rows.filter((row): row is TargetRow & { sozNet: number; score: number } =>
            row.sozNet !== null && row.score !== null && row.sayNet >= 1 && row.sozNet >= 1
        );
        const bestRow = validRows.reduce<typeof validRows[number] | null>((best, row) => {
            if (!best) {
                return row;
            }

            const currentTotal = row.sayNet + row.sozNet;
            const bestTotal = best.sayNet + best.sozNet;
            return currentTotal < bestTotal ? row : best;
        }, null);

        return {
            rows,
            bestRow,
        };
    }, [period, targetScore, targetType]);

    const summary = targetResult.bestRow
        ? `Seçilen dönemde ${targetScore.toLocaleString("tr-TR", {
            maximumFractionDigits: 2,
        })} ${targetType} puanı için en az ${formatNet(targetResult.bestRow.sayNet)} SAY + ${formatNet(targetResult.bestRow.sozNet)} SÖZ net gerekiyor`
        : `Seçilen dönemde ${targetScore.toLocaleString("tr-TR", {
            maximumFractionDigits: 2,
        })} ${targetType} puanı 0-50 net aralığında mümkün görünmüyor`;

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Hedef Puana Göre Gereken Net</h2>
                </div>

                <form
                    onSubmit={(event) => event.preventDefault()}
                    className="grid gap-3 sm:grid-cols-[140px_minmax(180px,1fr)_auto]"
                >
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-600">Puan Türü</span>
                        <select
                            value={targetType}
                            onChange={(event) => onTargetTypeChange(event.target.value as TargetScoreType)}
                            className="h-12 appearance-none rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                        >
                            {TARGET_SCORE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
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
                            max={100}
                            step={0.01}
                            value={targetScore}
                            onChange={(event) => onTargetScoreChange(clampTargetScore(event.target.value))}
                            className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                        />
                    </label>

                    <button
                        type="submit"
                        className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#FF6B35] bg-[#FF6B35] px-4 text-sm font-black text-white shadow-sm transition-all hover:bg-[#E55A26] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                    >
                        <Calculator size={17} aria-hidden="true" />
                        Hesapla
                    </button>
                </form>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="max-h-[460px] overflow-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                        <thead className="sticky top-0 bg-slate-50 text-xs font-black uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">SAY Net</th>
                                <th className="px-4 py-3">SÖZ Net</th>
                                <th className="px-4 py-3">{targetType} Puanı</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {targetResult.rows.map((row) => {
                                const isValid = row.sozNet !== null && row.score !== null;

                                return (
                                    <tr
                                        key={row.sayNet}
                                        onClick={() => onApplyRow(row)}
                                        className={cn(
                                            "transition-colors",
                                            isValid
                                                ? "cursor-pointer hover:bg-[#FFF3EE]"
                                                : "bg-slate-50 text-slate-400"
                                        )}
                                    >
                                        <td className="px-4 py-3 font-bold tabular-nums text-slate-900">
                                            {row.sayNet}
                                        </td>
                                        <td className={cn("px-4 py-3 font-bold tabular-nums", isValid ? "text-slate-900" : "text-slate-400")}>
                                            {row.sozNet === null ? "—" : formatNet(row.sozNet)}
                                        </td>
                                        <td className={cn("px-4 py-3 font-bold tabular-nums", isValid ? "text-[#CC4A1A]" : "text-slate-400")}>
                                            {row.score === null ? "—" : row.score.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
                {summary}
            </p>
        </section>
    );
}

function ApplicationGuide({ scores }: { scores: AlesScores | null }) {
    const cards: Array<{ type: TargetScoreType; score: number | null }> = [
        { type: "SAY", score: scores?.sayPuan ?? null },
        { type: "SÖZ", score: scores?.sozPuan ?? null },
        { type: "EA", score: scores?.eaPuan ?? null },
    ];

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Başvuru Rehberi</h2>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {cards.map((card) => (
                    <div key={card.type} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-black uppercase text-slate-500">{card.type} yorumu</p>
                                <p className="mt-1 text-2xl font-black tabular-nums text-slate-950">
                                    {card.score === null ? "—" : card.score.toFixed(3)}
                                </p>
                            </div>
                            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-[#CC4A1A] shadow-sm">
                                ALES {card.type}
                            </span>
                        </div>

                        <p className="mt-4 min-h-[72px] text-sm font-semibold leading-6 text-slate-700">
                            {card.score === null
                                ? "Geçerli netlerle hesaplama yapıldığında başvuru yorumu burada görünür."
                                : getApplicationComment(card.score)}
                        </p>

                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                            <p className="text-xs font-black uppercase text-slate-500">
                                En çok kontenjan açan program türleri
                            </p>
                            <p className="mt-2 text-sm font-bold text-slate-900">
                                {PROGRAM_TYPES[card.type].join(", ")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                <p className="font-black">ALES puanı YÖK taban puan veritabanında nasıl kullanılır?</p>
                <p className="mt-1 font-semibold">
                    ALES puanınızı, başvuracağınız programın istediği puan türü ve eşik şartıyla birlikte okuyun; YÖK Atlas üzerinden alan, üniversite ve program geçmiş verilerini karşılaştırabilirsiniz.
                </p>
                <a
                    href={YOK_ATLAS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-black text-blue-800 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-100"
                >
                    YÖK Atlas'a git
                    <ExternalLink size={16} aria-hidden="true" />
                </a>
            </div>

            <p className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-900">
                Program bazlı taban puanlar için üniversitelerin güncel ilanlarını kontrol edin.
            </p>
        </section>
    );
}

export default function AlesCalculator({ lang: _lang }: { lang: LanguageCode }) {
    const [values, setValues] = useState<AlesValues>(INITIAL_VALUES);
    const [isStorageReady, setIsStorageReady] = useState(false);
    const [targetType, setTargetType] = useState<TargetScoreType>("SAY");
    const [targetScore, setTargetScore] = useState(70);

    useEffect(() => {
        setValues(readStoredAlesValues());
        setIsStorageReady(true);
    }, []);

    useEffect(() => {
        if (!isStorageReady || typeof window === "undefined") {
            return;
        }

        try {
            window.sessionStorage.setItem(ALES_FORM_STORAGE_KEY, JSON.stringify(values));
        } catch {
            // sessionStorage can be unavailable in strict privacy modes.
        }
    }, [isStorageReady, values]);

    const result = useMemo(() => {
        const sayNet = values.sayDogru - values.sayYanlis / 4;
        const sozNet = values.sozDogru - values.sozYanlis / 4;
        const warnings: string[] = [];

        if (values.sayDogru + values.sayYanlis > 50) {
            warnings.push("Sayısal test 50 soruyu aşıyor");
        }

        if (values.sozDogru + values.sozYanlis > 50) {
            warnings.push("Sözel test 50 soruyu aşıyor");
        }

        if (warnings.length === 0 && (sayNet < 1 || sozNet < 1)) {
            warnings.push("Her iki testten en az 1 net gerekli");
        }

        if (warnings.length > 0) {
            return {
                sayNet,
                sozNet,
                warnings,
                scores: null,
            };
        }

        const k = ALES_COEFFICIENTS[values.sinavDonemi];

        return {
            sayNet,
            sozNet,
            warnings,
            scores: calculateScores(k, sayNet, sozNet),
        };
    }, [values]);

    const handleQuestionChange = (id: QuestionFieldId, value: number) => {
        setValues((current) => ({
            ...normalizeAlesValues({
                ...current,
                [id]: value,
            }),
        }));
    };

    const handlePeriodChange = (sinavDonemi: AlesPeriod) => {
        setValues((current) => ({
            ...current,
            sinavDonemi,
        }));
    };

    const fillQuestions = (nextValues: Pick<AlesValues, "sayDogru" | "sayYanlis" | "sozDogru" | "sozYanlis">) => {
        setValues((current) => normalizeAlesValues({
            ...current,
            ...nextValues,
        }));
    };

    const handleApplyTargetRow = (row: TargetRow) => {
        if (row.sozNet === null || row.score === null) {
            return;
        }

        const sozNet = row.sozNet;

        setValues((current) => ({
            ...normalizeAlesValues({
                ...current,
                sayDogru: row.sayNet,
                sayYanlis: 0,
                sozDogru: Number(sozNet.toFixed(4)),
                sozYanlis: 0,
            }),
        }));
    };

    return (
        <div className="grid grid-cols-1 items-start gap-6 lg:gap-8">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900">
                    ALES Puan Hesaplama
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-semibold text-slate-600">Sınav Dönemi</span>
                        <select
                            value={values.sinavDonemi}
                            onChange={(event) => handlePeriodChange(event.target.value as AlesPeriod)}
                            className="h-14 appearance-none rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                        >
                            {ALES_PERIODS.map((period) => (
                                <option key={period} value={period}>
                                    {period}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex flex-wrap gap-2 md:col-span-2">
                        <button
                            type="button"
                            onClick={() => fillQuestions({ sayDogru: 0, sayYanlis: 0, sozDogru: 0, sozYanlis: 0 })}
                            className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                        >
                            Hepsini Sıfırla
                        </button>
                        <button
                            type="button"
                            onClick={() => fillQuestions({ sayDogru: 32, sayYanlis: 8, sozDogru: 32, sozYanlis: 8 })}
                            className="min-h-11 rounded-xl border border-[#FFD7C7] bg-[#FFF3EE] px-4 py-2 text-sm font-bold text-[#CC4A1A] shadow-sm transition-colors hover:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                        >
                            32D/8Y örnek doldur
                        </button>
                        <button
                            type="button"
                            onClick={() => fillQuestions({ sayDogru: 50, sayYanlis: 0, sozDogru: 50, sozYanlis: 0 })}
                            className="min-h-11 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm transition-colors hover:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                        >
                            50D/0Y doldur
                        </button>
                    </div>

                    <StepperSliderField
                        id="sayDogru"
                        label="Sayısal Doğru (0-50)"
                        value={values.sayDogru}
                        onChange={handleQuestionChange}
                    />
                    <StepperSliderField
                        id="sayYanlis"
                        label="Sayısal Yanlış (0-50)"
                        value={values.sayYanlis}
                        onChange={handleQuestionChange}
                    />
                    <StepperSliderField
                        id="sozDogru"
                        label="Sözel Doğru (0-50)"
                        value={values.sozDogru}
                        onChange={handleQuestionChange}
                    />
                    <StepperSliderField
                        id="sozYanlis"
                        label="Sözel Yanlış (0-50)"
                        value={values.sozYanlis}
                        onChange={handleQuestionChange}
                    />
                </div>
            </section>

            <section aria-live="polite" className="space-y-4">
                {result.warnings.length > 0 && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800 shadow-sm">
                        {result.warnings.join(" · ")}
                    </div>
                )}

                <div className="grid gap-4 lg:grid-cols-3">
                    <ResultCard
                        title="SAY Puanı"
                        score={result.scores?.sayPuan ?? null}
                        net={result.scores ? result.sayNet : undefined}
                    />
                    <ResultCard
                        title="SÖZ Puanı"
                        score={result.scores?.sozPuan ?? null}
                        net={result.scores ? result.sozNet : undefined}
                    />
                    <ResultCard
                        title="EA Puanı"
                        score={result.scores?.eaPuan ?? null}
                    />
                </div>
            </section>

            <PeriodComparisonAccordion
                selectedPeriod={values.sinavDonemi}
                sayNet={result.sayNet}
                sozNet={result.sozNet}
                isValid={Boolean(result.scores)}
            />

            <ApplicationGuide scores={result.scores} />

            <TargetNetPlanner
                period={values.sinavDonemi}
                targetType={targetType}
                targetScore={targetScore}
                onTargetTypeChange={setTargetType}
                onTargetScoreChange={setTargetScore}
                onApplyRow={handleApplyTargetRow}
            />
        </div>
    );
}
