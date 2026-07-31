"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Copy, RotateCcw } from "lucide-react";
import type { LanguageCode } from "@/lib/calculator-types";

type PenaltyRule = "4" | "3" | "2" | "none" | "custom";

type FormState = {
    questionCount: number;
    correct: number;
    wrong: number;
    penaltyRule: PenaltyRule;
    customPenaltyDivisor: number;
};

type Props = {
    lang: LanguageCode;
    initialValues?: Record<string, string | number>;
};

type NumberFieldId = keyof Pick<FormState, "questionCount" | "correct" | "wrong" | "customPenaltyDivisor">;

const presets = [
    { label: "40 soru / 30 doğru / 8 yanlış", questionCount: 40, correct: 30, wrong: 8, penaltyRule: "4" as PenaltyRule },
    { label: "50 soru / 40 doğru / 5 yanlış", questionCount: 50, correct: 40, wrong: 5, penaltyRule: "4" as PenaltyRule },
    { label: "100 soru / 75 doğru / 20 yanlış", questionCount: 100, correct: 75, wrong: 20, penaltyRule: "4" as PenaltyRule },
];

const penaltyOptions: Array<{ value: PenaltyRule; label: string }> = [
    { value: "4", label: "4 yanlış 1 doğruyu götürür" },
    { value: "3", label: "3 yanlış 1 doğruyu götürür" },
    { value: "2", label: "2 yanlış 1 doğruyu götürür" },
    { value: "none", label: "Ceza yok" },
    { value: "custom", label: "Özel ceza katsayısı" },
];

function readNumber(value: unknown, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function clampNonNegative(value: number) {
    return Math.max(0, Number.isFinite(value) ? value : 0);
}

function normalizePenaltyRule(value: unknown): PenaltyRule {
    const normalized = String(value ?? "4");
    return normalized === "3" || normalized === "2" || normalized === "none" || normalized === "custom"
        ? normalized
        : "4";
}

function formatNumber(value: number, maximumFractionDigits = 2) {
    return value.toLocaleString("tr-TR", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits,
    });
}

function formatPercent(value: number) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
    })}%`;
}

function getInitialState(initialValues?: Record<string, string | number>): FormState {
    return {
        questionCount: Math.max(1, readNumber(initialValues?.questionCount ?? initialValues?.total, 40)),
        correct: clampNonNegative(readNumber(initialValues?.correct, 30)),
        wrong: clampNonNegative(readNumber(initialValues?.wrong, 8)),
        penaltyRule: normalizePenaltyRule(initialValues?.penaltyRule ?? initialValues?.penalty),
        customPenaltyDivisor: Math.max(0.01, readNumber(initialValues?.customPenaltyDivisor ?? initialValues?.custom, 4)),
    };
}

function readStateFromUrl(fallback: FormState): FormState {
    if (typeof window === "undefined") {
        return fallback;
    }

    const params = new URLSearchParams(window.location.search);
    const penalty = params.get("penalty");
    const nextPenaltyRule = penalty === "none"
        ? "none"
        : penalty === "2" || penalty === "3" || penalty === "4"
            ? penalty
            : penalty
                ? "custom"
                : fallback.penaltyRule;

    return {
        questionCount: Math.max(1, readNumber(params.get("total"), fallback.questionCount)),
        correct: clampNonNegative(readNumber(params.get("correct"), fallback.correct)),
        wrong: clampNonNegative(readNumber(params.get("wrong"), fallback.wrong)),
        penaltyRule: nextPenaltyRule,
        customPenaltyDivisor: Math.max(0.01, readNumber(params.get("custom") ?? penalty, fallback.customPenaltyDivisor)),
    };
}

function calculateResult(state: FormState) {
    const questionCount = Math.max(1, state.questionCount);
    const correct = clampNonNegative(state.correct);
    const wrong = clampNonNegative(state.wrong);
    const answered = correct + wrong;
    const blank = Math.max(0, questionCount - answered);
    const penaltyDivisor = state.penaltyRule === "none"
        ? 0
        : state.penaltyRule === "custom"
            ? Math.max(0.01, state.customPenaltyDivisor)
            : Number(state.penaltyRule);
    const lostNet = penaltyDivisor > 0 ? wrong / penaltyDivisor : 0;
    const net = penaltyDivisor > 0 ? correct - lostNet : correct;
    const successRate = (net / questionCount) * 100;
    const accuracy = answered > 0 ? (correct / answered) * 100 : 0;
    const wrongRate = (wrong / questionCount) * 100;
    const blankRate = (blank / questionCount) * 100;
    const penaltyLabel = penaltyDivisor > 0
        ? `${formatNumber(penaltyDivisor)} yanlış 1 doğruyu götürür`
        : "Ceza yok";
    const performance = successRate >= 85
        ? {
            label: "Çok iyi",
            comment: "Yüksek başarı oranı. Yanlış sayısını azaltarak neti daha da artırabilirsiniz.",
        }
        : successRate >= 70
            ? {
                label: "İyi",
                comment: "Genel performans iyi. Boş ve yanlış dağılımını inceleyerek gelişim alanlarını belirleyin.",
            }
            : successRate >= 50
                ? {
                    label: "Orta",
                    comment: "Temel düzey yeterli olabilir; konu eksiklerini belirlemek faydalı olur.",
                }
                : {
                    label: "Geliştirilmeli",
                    comment: "Yanlış ve boş soruların nedenleri analiz edilmelidir.",
                };

    return {
        questionCount,
        correct,
        wrong,
        answered,
        blank,
        penaltyDivisor,
        penaltyLabel,
        lostNet,
        net,
        successRate,
        accuracy,
        wrongRate,
        blankRate,
        performance,
    };
}

function getValidationMessages(state: FormState) {
    const messages: string[] = [];
    if (state.questionCount <= 0) {
        messages.push("Toplam soru sayısı 0'dan büyük olmalıdır.");
    }
    if (state.correct < 0 || state.wrong < 0) {
        messages.push("Doğru ve yanlış sayıları negatif olamaz.");
    }
    if (state.correct + state.wrong > state.questionCount) {
        messages.push("Doğru ve yanlış toplamı toplam soru sayısını aşamaz.");
    }
    if (state.penaltyRule === "custom" && state.customPenaltyDivisor <= 0) {
        messages.push("Özel ceza katsayısı 0'dan büyük olmalıdır.");
    }
    return messages;
}

function NumberField({
    id,
    label,
    value,
    onChange,
    error,
}: {
    id: NumberFieldId;
    label: string;
    value: number;
    onChange: (id: NumberFieldId, value: number) => void;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-bold text-slate-700">
                {label}
            </label>
            <input
                id={id}
                type="number"
                inputMode="decimal"
                min={0}
                step={id === "customPenaltyDivisor" ? 0.01 : 1}
                value={Number.isFinite(value) ? value : 0}
                onChange={(event) => onChange(id, readNumber(event.target.value))}
                className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-950 shadow-sm outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {error && (
                <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function TestSuccessRateCalculator({ initialValues }: Props) {
    const initializedRef = useRef(false);
    const [state, setState] = useState<FormState>(() => getInitialState(initialValues));
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
    const validationMessages = useMemo(() => getValidationMessages(state), [state]);
    const hasErrors = validationMessages.length > 0;
    const result = useMemo(() => calculateResult(state), [state]);

    useEffect(() => {
        if (initializedRef.current) {
            return;
        }
        initializedRef.current = true;
        setState((current) => readStateFromUrl(current));
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !initializedRef.current) {
            return;
        }
        const params = new URLSearchParams(window.location.search);
        params.set("total", String(state.questionCount));
        params.set("correct", String(state.correct));
        params.set("wrong", String(state.wrong));
        params.set("penalty", state.penaltyRule === "custom" ? String(state.customPenaltyDivisor) : state.penaltyRule);
        if (state.penaltyRule === "custom") {
            params.set("custom", String(state.customPenaltyDivisor));
        } else {
            params.delete("custom");
        }
        window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    }, [state]);

    const updateNumber = (
        id: NumberFieldId,
        value: number
    ) => {
        setState((current) => ({
            ...current,
            [id]: id === "questionCount"
                ? Math.max(1, readNumber(value, current.questionCount))
                : clampNonNegative(readNumber(value, current[id])),
        }));
    };

    const applyPreset = (preset: typeof presets[number]) => {
        setState((current) => ({
            ...current,
            questionCount: preset.questionCount,
            correct: preset.correct,
            wrong: preset.wrong,
            penaltyRule: preset.penaltyRule,
        }));
        setCopyStatus("idle");
    };

    const resetForm = () => {
        setState({
            questionCount: 40,
            correct: 30,
            wrong: 8,
            penaltyRule: "4",
            customPenaltyDivisor: 4,
        });
        setCopyStatus("idle");
    };

    const copyResult = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
            setCopyStatus("error");
            return;
        }

        const text = [
            "Test başarı oranı hesabı",
            `Toplam soru: ${result.questionCount}`,
            `Doğru: ${result.correct}`,
            `Yanlış: ${result.wrong}`,
            `Boş: ${result.blank}`,
            `Kural: ${result.penaltyLabel}`,
            `Net: ${formatNumber(result.net)}`,
            `Başarı oranı: ${formatPercent(result.successRate)}`,
            `Doğruluk oranı: ${formatPercent(result.accuracy)}`,
            "Sonuç resmi sınav puanı değildir.",
        ].join("\n");

        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus("copied");
            window.setTimeout(() => setCopyStatus("idle"), 1800);
        } catch {
            setCopyStatus("error");
        }
    };

    return (
        <section aria-labelledby="test-success-calculator-heading" className="space-y-5">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 id="test-success-calculator-heading" className="text-xl font-black text-slate-950">
                                Test Başarı Oranı Hesaplama Aracı
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Toplam soru, doğru, yanlış ve ceza kuralını girin; boş soru otomatik hesaplanır.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                        >
                            <RotateCcw size={16} aria-hidden="true" />
                            Sıfırla
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <NumberField
                            id="questionCount"
                            label="Toplam soru"
                            value={state.questionCount}
                            onChange={updateNumber}
                            error={state.questionCount <= 0 ? "Toplam soru 0'dan büyük olmalı." : undefined}
                        />
                        <NumberField
                            id="correct"
                            label="Doğru"
                            value={state.correct}
                            onChange={updateNumber}
                        />
                        <NumberField
                            id="wrong"
                            label="Yanlış"
                            value={state.wrong}
                            onChange={updateNumber}
                        />
                    </div>

                    <fieldset className="mt-5">
                        <legend className="mb-3 text-sm font-bold text-slate-700">Yanlış ceza kuralı</legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {penaltyOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition ${state.penaltyRule === option.value
                                        ? "border-[#FF6B35] bg-[#FFF3EE] text-[#B84418] shadow-sm"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="penaltyRule"
                                        value={option.value}
                                        checked={state.penaltyRule === option.value}
                                        onChange={() => setState((current) => ({ ...current, penaltyRule: option.value }))}
                                        className="h-4 w-4 border-slate-300 text-[#CC4A1A] focus:ring-[#FF6B35]"
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {state.penaltyRule === "custom" && (
                        <div className="mt-5 max-w-sm">
                            <NumberField
                                id="customPenaltyDivisor"
                                label="Özel ceza katsayısı"
                                value={state.customPenaltyDivisor}
                                onChange={updateNumber}
                                error={state.customPenaltyDivisor <= 0 ? "Ceza katsayısı 0'dan büyük olmalı." : undefined}
                            />
                        </div>
                    )}

                    {hasErrors && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3" role="alert">
                            <p className="text-sm font-black text-red-800">Girdileri kontrol edin</p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium text-red-700">
                                {validationMessages.map((message) => (
                                    <li key={message}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => applyPreset(preset)}
                                className="min-h-11 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-200"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6 lg:sticky lg:top-24" aria-live="polite">
                    <p className="text-sm font-bold text-orange-200">Sonuçlar</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white p-4 text-slate-950">
                            <p className="text-sm font-bold text-slate-600">Net</p>
                            <p className="mt-2 text-4xl font-black tracking-tight text-[#B84418]">
                                {hasErrors ? "-" : formatNumber(result.net)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-white p-4 text-slate-950">
                            <p className="text-sm font-bold text-slate-600">Başarı oranı</p>
                            <p className="mt-2 text-4xl font-black tracking-tight text-[#B84418]">
                                {hasErrors ? "-" : formatPercent(result.successRate)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                            ["Doğruluk oranı", formatPercent(result.accuracy)],
                            ["Yanlış oranı", formatPercent(result.wrongRate)],
                            ["Boş oranı", formatPercent(result.blankRate)],
                            ["Cevaplanan soru", formatNumber(result.answered, 0)],
                            ["Boş soru", formatNumber(result.blank, 0)],
                            ["Kaybedilen net", formatNumber(result.lostNet)],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">{label}</p>
                                <p className="mt-1 text-xl font-black text-white">{hasErrors ? "-" : value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3">
                        <p className="text-sm font-black text-emerald-100">{hasErrors ? "Hesaplanamadı" : result.performance.label}</p>
                        <p className="mt-1 text-sm leading-6 text-emerald-50">
                            {hasErrors ? "Geçerli bir sonuç için formdaki uyarıları düzeltin." : result.performance.comment}
                        </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-medium leading-6 text-amber-50">
                        Kural: {result.penaltyLabel}. Bu sonuç resmi sınav puanı değildir; deneme ve konu testi performansı için yaklaşık göstergedir.
                    </div>

                    <button
                        type="button"
                        onClick={copyResult}
                        disabled={hasErrors}
                        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-700"
                    >
                        {copyStatus === "copied" ? <CheckCircle2 size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                        {copyStatus === "copied" ? "Kopyalandı" : copyStatus === "error" ? "Kopyalanamadı" : "Sonucu kopyala"}
                    </button>
                </div>
            </div>
        </section>
    );
}
