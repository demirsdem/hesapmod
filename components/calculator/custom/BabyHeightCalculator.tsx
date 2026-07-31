"use client";

import { useMemo, useState } from "react";
import { Baby, Check, Copy, Info } from "lucide-react";
import MedicalDisclaimer from "@/components/health/MedicalDisclaimer";
import type { LanguageCode } from "@/lib/calculator-types";
import { cn } from "@/lib/utils";

type Gender = "male" | "female";

const MIN_HEIGHT = 140;
const MAX_HEIGHT = 220;
const CONFIDENCE_RANGE = 8.5;

function clampRangeValue(value: number) {
    if (!Number.isFinite(value)) {
        return MIN_HEIGHT;
    }

    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, value));
}

function formatCm(value: number, maximumFractionDigits = 1) {
    return value.toLocaleString("tr-TR", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
        maximumFractionDigits,
    });
}

function normalizePct(value: number) {
    return ((value - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100;
}

function getComparison(predicted: number, gender: Gender) {
    if (gender === "male") {
        if (predicted < 170) return "Türkiye erkek ortalamasının (~174 cm) altında";
        if (predicted <= 178) return "Türkiye erkek ortalaması (~174 cm) civarında";
        return "Türkiye erkek ortalamasının (~174 cm) üzerinde";
    }

    if (predicted < 157) return "Türkiye kadın ortalamasının (~161 cm) altında";
    if (predicted <= 163) return "Türkiye kadın ortalaması (~161 cm) civarında";
    return "Türkiye kadın ortalamasının (~161 cm) üzerinde";
}

function hasHeightError(value: number) {
    return !Number.isFinite(value) || value < MIN_HEIGHT || value > MAX_HEIGHT;
}

function HeightControl({
    id,
    label,
    value,
    averageText,
    onChange,
}: {
    id: string;
    label: string;
    value: number;
    averageText: string;
    onChange: (value: number) => void;
}) {
    const hasError = hasHeightError(value);
    const sliderValue = clampRangeValue(value);

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-bold text-slate-700">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <input
                    id={`${id}-slider`}
                    type="range"
                    min={MIN_HEIGHT}
                    max={MAX_HEIGHT}
                    step={1}
                    value={sliderValue}
                    onChange={(event) => onChange(Number.parseFloat(event.target.value))}
                    className="h-11 flex-1 touch-manipulation cursor-ew-resize accent-[#FF6B35]"
                    aria-label={`${label}: ${formatCm(sliderValue, 0)} cm`}
                    aria-valuemin={MIN_HEIGHT}
                    aria-valuemax={MAX_HEIGHT}
                    aria-valuenow={sliderValue}
                />
                <input
                    id={id}
                    type="number"
                    min={MIN_HEIGHT}
                    max={MAX_HEIGHT}
                    step={1}
                    inputMode="numeric"
                    value={Number.isFinite(value) ? value : ""}
                    onChange={(event) => onChange(Number.parseFloat(event.target.value))}
                    className={cn(
                        "h-11 w-20 rounded-lg border p-2 text-center text-base font-bold text-slate-900 outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20",
                        hasError ? "border-red-300 bg-red-50" : "border-slate-300 bg-white"
                    )}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : `${id}-hint`}
                />
                <span className="text-sm font-semibold text-slate-500">cm</span>
            </div>
            <p id={`${id}-hint`} className="text-xs text-slate-400">
                {averageText}
            </p>
            {hasError && (
                <p id={`${id}-error`} role="alert" className="text-sm font-medium text-red-500">
                    Lütfen 140 cm ile 220 cm arasında bir değer girin
                </p>
            )}
        </div>
    );
}

export default function BabyHeightCalculator({
    lang,
}: {
    lang: LanguageCode;
    initialValues?: Record<string, string | number>;
}) {
    const [fatherHeight, setFatherHeight] = useState(174);
    const [motherHeight, setMotherHeight] = useState(161);
    const [gender, setGender] = useState<Gender>("male");
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

    const validationError = hasHeightError(fatherHeight) || hasHeightError(motherHeight);
    const result = useMemo(() => {
        if (validationError) {
            return null;
        }

        const predicted = gender === "male"
            ? (fatherHeight + motherHeight + 13) / 2
            : (fatherHeight + motherHeight - 13) / 2;

        return {
            predicted,
            low: predicted - CONFIDENCE_RANGE,
            high: predicted + CONFIDENCE_RANGE,
            comparison: getComparison(predicted, gender),
        };
    }, [fatherHeight, gender, motherHeight, validationError]);

    const handleCopy = async () => {
        if (!result || typeof navigator === "undefined" || !navigator.clipboard) {
            return;
        }

        const genderLabel = gender === "male" ? "Erkek çocuk" : "Kız çocuk";
        const text = `${genderLabel} tahmini boy: ${formatCm(result.predicted)} cm (aralık: ${formatCm(result.low)}-${formatCm(result.high)} cm) - hesapmod.com`;

        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus("copied");
            window.setTimeout(() => setCopyStatus("idle"), 2000);
        } catch {
            setCopyStatus("error");
        }
    };

    const handleCalculateClick = () => {
        document.getElementById("baby-height-result")?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    };

    const altPct = result ? Math.max(0, Math.min(100, normalizePct(result.low))) : 0;
    const ustPct = result ? Math.max(0, Math.min(100, normalizePct(result.high))) : 0;
    const midPct = result ? Math.max(0, Math.min(100, normalizePct(result.predicted))) : 0;
    const genderLabel = gender === "male" ? "Erkek Çocuk" : "Kız Çocuk";

    return (
        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <Info size={14} aria-hidden="true" />
                    Bilgilendirme amaçlı · Tahmini sonuç
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Bebek Boyu Hesaplama
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Anne ve baba boyuna göre çocuğun tahmini yetişkin boyunu ve ±8,5 cm güven aralığını anlık görün.
                </p>

                <div className="mt-8 space-y-6">
                    <HeightControl
                        id="fatherHeight"
                        label="Baba Boyu"
                        value={fatherHeight}
                        averageText="Türkiye erkek ort. ~174 cm"
                        onChange={(value) => {
                            setFatherHeight(value);
                            setCopyStatus("idle");
                        }}
                    />
                    <HeightControl
                        id="motherHeight"
                        label="Anne Boyu"
                        value={motherHeight}
                        averageText="Türkiye kadın ort. ~161 cm"
                        onChange={(value) => {
                            setMotherHeight(value);
                            setCopyStatus("idle");
                        }}
                    />

                    <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-700">Çocuğun Cinsiyeti</p>
                        <div role="radiogroup" aria-label="Çocuğun cinsiyeti" className="grid grid-cols-2 gap-3">
                            {([
                                { value: "male", label: "Erkek" },
                                { value: "female", label: "Kız" },
                            ] as const).map((option) => {
                                const selected = gender === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        aria-pressed={selected}
                                        onClick={() => {
                                            setGender(option.value);
                                            setCopyStatus("idle");
                                        }}
                                        className={cn(
                                            "min-h-11 rounded-xl border px-4 py-3 text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                            selected
                                                ? "border-[#FF6B35] bg-[#FF6B35] text-white shadow-sm"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCalculateClick}
                        className="min-h-12 w-full rounded-xl bg-[#FF6B35] px-5 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#E55A26] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/25"
                    >
                        Hesapla
                    </button>

                    <MedicalDisclaimer lang={lang === "en" ? "en" : "tr"} />
                </div>
            </div>

            <div className="md:sticky md:top-24">
                <div
                    id="baby-height-result"
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl border border-[#FFD7C7] bg-[#FFF3EE] p-6 shadow-sm md:p-8"
                >
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#CC4A1A] shadow-sm">
                            <Baby size={24} aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-[#CC4A1A]">{genderLabel}</p>
                            <h3 className="text-xl font-black text-slate-900">Tahmini Yetişkin Boy</h3>
                        </div>
                    </div>

                    {result ? (
                        <div className="mt-8 space-y-7">
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-600">
                                    {gender === "male" ? "Erkek çocuk için" : "Kız çocuk için"}
                                </p>
                                <p className="mt-2 text-5xl font-black tracking-tight text-slate-950">
                                    {formatCm(result.predicted)} cm
                                </p>
                            </div>

                            <div aria-hidden="true" className="space-y-3">
                                <div className="relative mx-2 h-2 rounded-full bg-slate-200">
                                    <div
                                        className="absolute h-full rounded-full bg-[#FF6B35]"
                                        style={{ left: `${altPct}%`, right: `${100 - ustPct}%` }}
                                    />
                                    <div
                                        className="absolute -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#FF6B35] shadow"
                                        style={{ left: `${midPct}%`, transform: "translateX(-50%)" }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs font-black text-slate-600">
                                    <span>Alt sınır: {formatCm(result.low)} cm</span>
                                    <span>Üst sınır: {formatCm(result.high)} cm</span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/80 bg-white p-4 text-center">
                                <p className="text-sm font-black text-slate-900">
                                    ±8,5 cm güven aralığı
                                </p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Çocukların yaklaşık %95'i bu aralıkta kalır.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 rounded-xl border border-orange-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm font-bold leading-6 text-slate-700">
                                    Tahmini boy {formatCm(result.predicted)} cm, {result.comparison}.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#FFD7C7] bg-[#FFF3EE] px-4 py-2 text-sm font-black text-[#CC4A1A] transition-colors hover:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                                >
                                    {copyStatus === "copied" ? (
                                        <Check size={16} aria-hidden="true" />
                                    ) : (
                                        <Copy size={16} aria-hidden="true" />
                                    )}
                                    {copyStatus === "copied"
                                        ? "Kopyalandı"
                                        : copyStatus === "error"
                                            ? "Kopyalanamadı"
                                            : "Sonucu Kopyala"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div role="alert" className="mt-8 rounded-xl border border-red-200 bg-white p-4 text-sm font-semibold text-red-600">
                            Sonucu görmek için anne ve baba boyunu 140-220 cm aralığında girin.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
