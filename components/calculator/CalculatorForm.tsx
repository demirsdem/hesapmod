import React from "react";
import type { CalculatorInput } from "@/lib/calculator-types";
import { cn } from "@/lib/utils";
import { BirthDatePicker } from "./BirthDatePicker";
import { AlertTriangle, Info } from "lucide-react";
import { clampFiniteNumber, toFiniteNumber } from "@/lib/safe-number";

interface Props {
    inputs: CalculatorInput[];
    values: Record<string, any>;
    onChange: (id: string, value: any) => void;
    lang: "tr" | "en";
    calculatorSlug?: string;
    inputBadges?: Record<string, { label: string; className: string }>;
    inputLabelOverrides?: Record<string, string>;
    inputSuffixOverrides?: Record<string, string>;
    inputTooltips?: Record<string, string>;
    disabledInputs?: Record<string, boolean>;
}

const creditCardRateCaps: Record<string, number> = {
    akdiFaiz: 4.25,
    gecikmeFaiz: 4.55,
};

const TYT_SCORE_SLUG = "tyt-puan-hesaplama";

type TytProgressConfig = {
    correctId: string;
    wrongId: string;
    maxQuestionCount: number;
};

const tytProgressSections: Record<string, TytProgressConfig> = {
    turk_sec: { correctId: "turk_d", wrongId: "turk_y", maxQuestionCount: 40 },
    sos_sec: { correctId: "sos_d", wrongId: "sos_y", maxQuestionCount: 20 },
    mat_sec: { correctId: "mat_d", wrongId: "mat_y", maxQuestionCount: 40 },
    fen_sec: { correctId: "fen_d", wrongId: "fen_y", maxQuestionCount: 20 },
};

const tytNumberInputMax: Record<string, number> = {
    turk_d: 40,
    turk_y: 40,
    sos_d: 20,
    sos_y: 20,
    mat_d: 40,
    mat_y: 40,
    fen_d: 20,
    fen_y: 20,
};

function getCreditCardRateCap(inputId: string, calculatorSlug?: string) {
    if (calculatorSlug !== "kredi-karti-gecikme-faizi-hesaplama") {
        return null;
    }

    return creditCardRateCaps[inputId] ?? null;
}

function readFiniteNumber(value: any) {
    return toFiniteNumber(value, 0);
}

function formatTytProgressNet(value: number, lang: "tr" | "en") {
    return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
        maximumFractionDigits: 2,
    }).format(value);
}

function getTytSectionProgress(
    inputId: string,
    values: Record<string, any>,
    calculatorSlug?: string
) {
    if (calculatorSlug !== TYT_SCORE_SLUG) {
        return null;
    }

    const config = tytProgressSections[inputId];
    if (!config) {
        return null;
    }

    const correct = Math.min(Math.max(readFiniteNumber(values[config.correctId]), 0), config.maxQuestionCount);
    const wrong = Math.min(Math.max(readFiniteNumber(values[config.wrongId]), 0), config.maxQuestionCount - correct);
    const net = correct - wrong / 4;
    const isNegative = net < 0;
    const safeNet = Math.max(0, Math.min(net, config.maxQuestionCount));
    const percentage = isNegative ? 100 : (safeNet / config.maxQuestionCount) * 100;
    const threshold = config.maxQuestionCount;
    const colorClass = isNegative
        ? "bg-gray-400"
        : net > threshold * 0.7
            ? "bg-green-500"
            : net >= threshold * 0.4
                ? "bg-yellow-400"
                : "bg-red-500";

    return {
        net,
        maxQuestionCount: config.maxQuestionCount,
        percentage,
        colorClass,
        isNegative,
    };
}

function getTytNumberInputMax(inputId: string, calculatorSlug?: string) {
    if (calculatorSlug !== TYT_SCORE_SLUG) {
        return null;
    }

    return tytNumberInputMax[inputId] ?? null;
}

function clampStepperValue(value: number, maxValue: number) {
    return clampFiniteNumber(value, 0, maxValue, 0);
}

function StepperSliderNumberField({
    id,
    value,
    maxValue,
    disabled,
    onChange,
}: {
    id: string;
    value: any;
    maxValue: number;
    disabled: boolean;
    onChange: (id: string, value: number) => void;
}) {
    const numericValue = clampStepperValue(readFiniteNumber(value), maxValue);
    const displayValue = Number.isInteger(numericValue)
        ? numericValue
        : Number(numericValue.toFixed(2));
    const updateValue = (nextValue: number) => {
        if (disabled) {
            return;
        }

        onChange(id, clampStepperValue(nextValue, maxValue));
    };

    return (
        <div className="grid gap-3 sm:grid-cols-[minmax(132px,176px)_1fr] sm:items-center">
            <div className="grid h-14 grid-cols-[44px_1fr_44px] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition-all group-hover/input:border-[#FFD7C7]">
                <button
                    type="button"
                    onClick={() => updateValue(numericValue - 1)}
                    disabled={disabled}
                    className="min-h-11 min-w-11 border-r border-slate-200 text-xl font-black text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    aria-label="Azalt"
                >
                    -
                </button>
                <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={maxValue}
                    step={1}
                    value={displayValue}
                    onChange={(event) => updateValue(toFiniteNumber(event.target.value, 0))}
                    disabled={disabled}
                    className="h-full min-w-0 border-0 px-2 text-center text-base font-black text-slate-900 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                />
                <button
                    type="button"
                    onClick={() => updateValue(numericValue + 1)}
                    disabled={disabled}
                    className="min-h-11 min-w-11 border-l border-slate-200 text-xl font-black text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    aria-label="Artır"
                >
                    +
                </button>
            </div>

            <input
                type="range"
                min={0}
                max={maxValue}
                step={1}
                value={numericValue}
                onChange={(event) => updateValue(toFiniteNumber(event.target.value, 0))}
                disabled={disabled}
                className="h-12 w-full cursor-ew-resize accent-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={`${id} slider`}
            />
        </div>
    );
}

export default function CalculatorForm({
    inputs,
    values,
    onChange,
    lang,
    calculatorSlug,
    inputBadges,
    inputLabelOverrides,
    inputSuffixOverrides,
    inputTooltips,
    disabledInputs,
}: Props) {
    const visibleInputs = inputs.filter((input) => {
        if (!input.showWhen) return true;
        const expectedValues = Array.isArray(input.showWhen.value)
            ? input.showWhen.value
            : [input.showWhen.value];
        return expectedValues.includes(values[input.showWhen.field]);
    }).filter(input => input.id !== "birthTime");

    return (
        <div className="animate-scale-in flex flex-wrap -mx-2 gap-y-6">
            {visibleInputs.map((input) => {
                const tcmbRateCap = getCreditCardRateCap(input.id, calculatorSlug);
                const inputBadge = inputBadges?.[input.id];
                const inputLabel = inputLabelOverrides?.[input.id] ?? input.name[lang];
                const inputSuffix = inputSuffixOverrides?.[input.id] ?? input.suffix;
                const inputTooltip = inputTooltips?.[input.id];
                const isDisabled = Boolean(disabledInputs?.[input.id]);
                const displayedValue = values[input.id] === undefined || values[input.id] === null
                    ? ""
                    : values[input.id];
                const tytProgress = input.type === "section"
                    ? getTytSectionProgress(input.id, values, calculatorSlug)
                    : null;
                const tytNumberMax = input.type === "number"
                    ? getTytNumberInputMax(input.id, calculatorSlug)
                    : null;

                return (
                    <div
                        key={input.id}
                        className={cn("w-full px-2 flex flex-col gap-2", input.className)}
                    >
                        {input.type === "section" ? (
                            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                            {input.name[lang]}
                                        </h3>
                                        {tytProgress && (
                                            <div className={cn(
                                                "inline-flex items-center gap-2 text-sm font-black tabular-nums",
                                                tytProgress.isNegative ? "text-slate-500" : "text-slate-700"
                                            )}>
                                                {tytProgress.isNegative && (
                                                    <AlertTriangle size={16} className="text-slate-500" aria-hidden="true" />
                                                )}
                                                <span>
                                                    {formatTytProgressNet(tytProgress.net, lang)}/{tytProgress.maxQuestionCount} net
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {tytProgress && (
                                        <div
                                            className="h-3 w-full overflow-hidden rounded bg-gray-200"
                                            aria-label={`${input.name[lang]} ${formatTytProgressNet(tytProgress.net, lang)} net`}
                                        >
                                            <div
                                                className={cn("h-full rounded transition-all duration-300", tytProgress.colorClass)}
                                                style={{ width: `${tytProgress.percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {input.placeholder?.[lang] && (
                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{input.placeholder[lang]}</p>
                                )}
                            </div>
                        ) : (
                            <>
                                <label
                                    htmlFor={input.id}
                                    className="flex items-start justify-between gap-3 text-sm font-semibold text-slate-600"
                                >
                                    <span className="min-w-0">{inputLabel}</span>
                                    <span className="flex shrink-0 items-center gap-2">
                                        {inputTooltip && (
                                            <span className="group/tooltip relative inline-flex">
                                                <button
                                                    type="button"
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-[#FFD7C7] hover:text-[#CC4A1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                                                    aria-label={`${inputLabel} bilgi`}
                                                >
                                                    <Info size={15} aria-hidden="true" />
                                                </button>
                                                <span className="pointer-events-none absolute right-0 top-9 z-30 hidden w-64 rounded-lg border border-slate-200 bg-slate-950 px-3 py-2 text-left text-xs font-medium leading-5 text-white shadow-lg group-hover/tooltip:block group-focus-within/tooltip:block">
                                                    {inputTooltip}
                                                </span>
                                            </span>
                                        )}
                                        {inputBadge && (
                                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold transition-all duration-300 ${inputBadge.className}`}>
                                                {inputBadge.label}
                                            </span>
                                        )}
                                        {tcmbRateCap !== null && (
                                            <button
                                                type="button"
                                                onClick={() => onChange(input.id, tcmbRateCap)}
                                                className="rounded-full border border-[#FFD7C7] bg-[#FFF3EE] px-2 py-0.5 text-[11px] font-bold text-[#CC4A1A] transition-all duration-300 hover:border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                                                aria-label={`${inputLabel} ${lang === "tr" ? "TCMB tavanına ayarla" : "set to CBRT cap"}`}
                                            >
                                                {lang === "tr" ? "TCMB tavanı" : "CBRT cap"}
                                            </button>
                                        )}
                                        {input.required && <span className="text-red-500">*</span>}
                                    </span>
                                </label>

                            <div className="relative group/input">
                                {input.type === "number" && tytNumberMax !== null && (
                                    <StepperSliderNumberField
                                        id={input.id}
                                        value={values[input.id]}
                                        maxValue={tytNumberMax}
                                        disabled={isDisabled}
                                        onChange={onChange}
                                    />
                                )}

                                {input.type === "number" && tytNumberMax === null && (
                                    <div className="relative">
                                        {Boolean(input.prefix) && (
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pr-2 pointer-events-none z-10">
                                                {input.prefix}
                                            </div>
                                        )}
                                        <input
                                            id={input.id}
                                            type="number"
                                            inputMode="decimal"
                                            value={isDisabled ? displayedValue : values[input.id] || ""}
                                            onChange={(e) => onChange(input.id, toFiniteNumber(e.target.value, 0))}
                                            placeholder={input.placeholder?.[lang]}
                                            min={input.min}
                                            max={input.max}
                                            step={input.step}
                                            disabled={isDisabled}
                                            className={cn(
                                                "w-full h-14 px-4 rounded-xl border border-slate-300 bg-white text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none",
                                                inputSuffix ? "pr-12" : "",
                                                input.prefix ? "pl-10" : ""
                                            )}
                                        />
                                    </div>
                                )}

                                {input.type === "range" && (
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                        <div className="flex-1 min-w-[200px] h-12 bg-white border border-slate-300 rounded-xl px-4 flex items-center shadow-sm group-hover/input:border-[#FFD7C7] transition-all cursor-ew-resize">
                                            <input
                                                id={`${input.id}-slider`}
                                                type="range"
                                                min={input.min || 0}
                                                max={input.max || 100}
                                                step={input.step || 1}
                                                value={values[input.id] || input.min || 0}
                                                onChange={(e) => onChange(input.id, toFiniteNumber(e.target.value, input.min || 0))}
                                                className="w-full accent-[#FF6B35] h-2 bg-slate-100 rounded-lg appearance-none cursor-ew-resize"
                                            />
                                        </div>
                                        <div className="w-full sm:w-40 md:w-48 flex-shrink-0 relative">
                                            {Boolean(input.prefix) && (
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pr-1 pointer-events-none z-10">
                                                    {input.prefix}
                                                </div>
                                            )}
                                            <input
                                                id={input.id}
                                                type="number"
                                                min={input.min}
                                                max={input.max}
                                                step={input.step}
                                                value={values[input.id] || ""}
                                                onChange={(e) => onChange(input.id, toFiniteNumber(e.target.value, 0))}
                                                className={cn(
                                                    "w-full h-14 rounded-xl border border-slate-300 bg-white px-3 text-base font-medium text-slate-900 shadow-sm outline-none transition-all group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20",
                                                    inputSuffix ? "pr-10" : "",
                                                    input.prefix ? "pl-8 text-left" : "text-right"
                                                )}
                                            />
                                            {Boolean(inputSuffix) && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pl-1 pointer-events-none z-10">
                                                    {inputSuffix}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {input.type === "text" && (
                                    <input
                                        id={input.id}
                                        type="text"
                                        value={values[input.id] || ""}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        placeholder={input.placeholder?.[lang]}
                                        className={cn(
                                            "w-full h-14 px-4 rounded-xl border border-slate-300 bg-white text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20",
                                            inputSuffix ? "pr-12" : ""
                                        )}
                                    />
                                )}

                                {input.type === "select" && (
                                    <select
                                        id={input.id}
                                        value={values[input.id]}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        className="w-full h-14 appearance-none rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition-all group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                                    >
                                        {input.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label[lang]}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {input.type === "radio" && (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {input.options?.map((opt) => (
                                            <label
                                                key={opt.value}
                                                className={cn(
                                                    "flex min-h-[56px] cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-all",
                                                    values[input.id] === opt.value
                                                        ? "border-[#FF6B35] bg-[#FFF3EE] shadow-sm"
                                                        : "border-slate-200 bg-white hover:border-[#FFD7C7] hover:bg-slate-50"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name={input.id}
                                                    value={opt.value}
                                                    checked={values[input.id] === opt.value}
                                                    onChange={(e) => onChange(input.id, e.target.value)}
                                                    className="mt-1 h-4 w-4 flex-shrink-0 border-slate-300 text-[#CC4A1A] focus:ring-[#FF6B35]"
                                                />
                                                <span className="text-sm font-medium leading-6 text-slate-700">{opt.label[lang]}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {input.type === "checkbox" && (
                                    <label
                                        htmlFor={input.id}
                                        className={cn(
                                            "flex min-h-[56px] cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-all",
                                            values[input.id]
                                                ? "border-[#FF6B35] bg-[#FFF3EE] shadow-sm"
                                                : "border-slate-200 bg-white hover:border-[#FFD7C7] hover:bg-slate-50"
                                        )}
                                    >
                                        <input
                                            id={input.id}
                                            type="checkbox"
                                            checked={!!values[input.id]}
                                            onChange={(e) => onChange(input.id, e.target.checked)}
                                            className="mt-1 h-5 w-5 rounded border-slate-300 text-[#CC4A1A] shadow-sm focus:ring-2 focus:ring-[#FF6B35]"
                                        />
                                        <span className="text-sm font-medium leading-6 text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {input.placeholder?.[lang] || "Aktif"}
                                        </span>
                                    </label>
                                )}

                                {input.type === "date" && (() => {
                                    let defaultDateObj: Date | undefined;
                                    if (values[input.id]) {
                                        const timePart = values["birthTime"] || "12:00";
                                        defaultDateObj = new Date(`${values[input.id]}T${timePart}`);
                                    }
                                    
                                    return (
                                        <BirthDatePicker
                                            defaultValue={defaultDateObj}
                                            label={inputLabel}
                                            yearRange={input.yearRange}
                                            showTime={input.showTime}
                                            onChange={(date) => {
                                                const y = date.getFullYear();
                                                const m = String(date.getMonth() + 1).padStart(2, "0");
                                                const d = String(date.getDate()).padStart(2, "0");
                                                const hh = String(date.getHours()).padStart(2, "0");
                                                const mm = String(date.getMinutes()).padStart(2, "0");
                                                onChange(input.id, `${y}-${m}-${d}`);
                                                onChange("birthTime", `${hh}:${mm}`);
                                            }}
                                        />
                                    );
                                })()}

                                {inputSuffix && input.type !== "checkbox" && input.type !== "range" && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pl-2 pointer-events-none">
                                        {inputSuffix}
                                    </div>
                                )}
                            </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
