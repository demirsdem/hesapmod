"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Clipboard, Loader2, RotateCcw } from "lucide-react";
import type { LanguageCode } from "@/lib/calculator-types";
import { cn } from "@/lib/utils";

const CagrYearlyDetails = lazy(() => import("./CagrYearlyDetails"));

type Props = {
    lang: LanguageCode;
    initialValues?: Record<string, string | number>;
};

type Mode = "cagr" | "future";
type FieldKey = "startValue" | "endValue" | "years" | "targetCagr";
type FormState = Record<FieldKey, string>;
type Errors = Partial<Record<FieldKey, string>>;

type CalculationResult = {
    mode: Mode;
    startValue: number;
    endValue: number;
    years: number;
    cagrPercent: number;
    totalGrowthPercent: number;
    gainAmount: number;
};

const ACCENT = "#FF6B35";
const INPUT_DEBOUNCE_MS = 300;
const DEFAULT_FORM: FormState = {
    startValue: "100000",
    endValue: "200000",
    years: "5",
    targetCagr: "14,87",
};

const examples = [
    { id: "gold", label: "Altın 5Y", startValue: "100000", endValue: "580000", years: "5" },
    { id: "deposit", label: "Mevduat 3Y", startValue: "100000", endValue: "337500", years: "3" },
    { id: "bist", label: "BIST 10Y", startValue: "100000", endValue: "1500000", years: "10" },
] as const;

function parseNumber(value: string) {
    const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
}

function formatInputValue(value: string) {
    if (!value) return "";
    const hasTrailingSeparator = /[,.]$/.test(value);
    const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
    const [integerPart, decimalPart] = normalized.split(".");
    const sign = integerPart.startsWith("-") ? "-" : "";
    const digits = integerPart.replace("-", "").replace(/^0+(?=\d)/, "");
    const formattedInteger = digits
        ? `${sign}${Number.parseInt(digits, 10).toLocaleString("tr-TR")}`
        : sign;

    if (decimalPart !== undefined) {
        return `${formattedInteger || "0"},${decimalPart.slice(0, 4)}`;
    }

    return hasTrailingSeparator ? `${formattedInteger},` : formattedInteger;
}

function formatTl(value: number) {
    return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL`;
}

function formatPercent(value: number, fractionDigits = 2) {
    return `%${value.toLocaleString("tr-TR", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })}`;
}

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration = 800) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let frame = 0;
        const start = performance.now();
        const animate = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            setValue(target * easeOutCubic(progress));
            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [duration, target]);

    return value;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebounced(value), delay);
        return () => window.clearTimeout(timeout);
    }, [delay, value]);

    return debounced;
}

function validateForm(form: FormState, mode: Mode): Errors {
    const errors: Errors = {};
    const startValue = parseNumber(form.startValue);
    const years = parseNumber(form.years);

    if (!(startValue > 0)) {
        errors.startValue = "Başlangıç değeri 0'dan büyük olmalı.";
    }

    if (!(years >= 0.5 && years <= 50)) {
        errors.years = "Süre 0,5 ile 50 yıl arasında olmalı.";
    }

    if (mode === "cagr") {
        const endValue = parseNumber(form.endValue);
        if (!(endValue > 0)) {
            errors.endValue = "Bitiş değeri 0'dan büyük olmalı.";
        }
    } else {
        const targetCagr = parseNumber(form.targetCagr);
        if (!Number.isFinite(targetCagr) || targetCagr <= -100) {
            errors.targetCagr = "CAGR oranı -100%'den büyük olmalı.";
        }
    }

    return errors;
}

function calculate(form: FormState, mode: Mode): CalculationResult {
    const startValue = parseNumber(form.startValue);
    const years = parseNumber(form.years);

    if (mode === "future") {
        const cagrPercent = parseNumber(form.targetCagr);
        const endValue = startValue * Math.pow(1 + cagrPercent / 100, years);
        return {
            mode,
            startValue,
            endValue,
            years,
            cagrPercent,
            totalGrowthPercent: ((endValue - startValue) / startValue) * 100,
            gainAmount: endValue - startValue,
        };
    }

    const endValue = parseNumber(form.endValue);
    const cagrPercent = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;

    return {
        mode,
        startValue,
        endValue,
        years,
        cagrPercent,
        totalGrowthPercent: ((endValue - startValue) / startValue) * 100,
        gainAmount: endValue - startValue,
    };
}

function getInterpretation(cagrPercent: number) {
    if (cagrPercent < 30) {
        return { text: "🔴 Enflasyonun altında kalıyor olabilir", className: "border-red-200 bg-red-50 text-red-700" };
    }
    if (cagrPercent <= 50) {
        return { text: "🟡 Enflasyona yakın getiri", className: "border-amber-200 bg-amber-50 text-amber-800" };
    }
    return { text: "🟢 Enflasyonun üzerinde reel büyüme", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
}

function buildShareText(result: CalculationResult) {
    return [
        "CAGR / YBBO Hesaplama Sonucu",
        `Başlangıç: ${formatTl(result.startValue)}`,
        `Bitiş: ${formatTl(result.endValue)}`,
        `Süre: ${result.years.toLocaleString("tr-TR")} yıl`,
        `CAGR: ${formatPercent(result.cagrPercent)}`,
        `Toplam büyüme: ${formatPercent(result.totalGrowthPercent)}`,
        `Kazanç: ${formatTl(result.gainAmount)}`,
    ].join("\n");
}

function NumericField({
    id,
    label,
    value,
    unit,
    placeholder,
    error,
    tabIndex,
    onChange,
}: {
    id: FieldKey;
    label: string;
    value: string;
    unit: string;
    placeholder: string;
    error?: string;
    tabIndex: number;
    onChange: (id: FieldKey, value: string) => void;
}) {
    const errorId = `${id}-error`;

    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-800">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(event) => onChange(id, formatInputValue(event.target.value))}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    tabIndex={tabIndex}
                    className={cn(
                        "h-12 w-full rounded-xl border bg-white px-4 pr-14 text-base font-semibold tabular-nums text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#FF6B35]",
                        error ? "border-red-300" : "border-slate-200 hover:border-orange-200"
                    )}
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-400">
                    {unit}
                </span>
            </div>
            {error && (
                <p id={errorId} className="mt-2 text-xs font-semibold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function CagrCalculator({ initialValues }: Props) {
    const [mode, setMode] = useState<Mode>("cagr");
    const [form, setForm] = useState<FormState>({
        ...DEFAULT_FORM,
        startValue: formatInputValue(String(initialValues?.startValue ?? DEFAULT_FORM.startValue)),
        endValue: formatInputValue(String(initialValues?.endValue ?? DEFAULT_FORM.endValue)),
        years: formatInputValue(String(initialValues?.years ?? DEFAULT_FORM.years)),
    });
    const debouncedForm = useDebounce(form, INPUT_DEBOUNCE_MS);
    const [errors, setErrors] = useState<Errors>({});
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
    const resultRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!result) return;
        const nextErrors = validateForm(debouncedForm, mode);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length === 0) {
            setResult(calculate(debouncedForm, mode));
        }
    }, [debouncedForm, mode]);

    const displayedCagr = useCountUp(result?.cagrPercent ?? 0);
    const displayedGrowth = useCountUp(result?.totalGrowthPercent ?? 0);
    const displayedGain = useCountUp(result?.gainAmount ?? 0);
    const displayedEndValue = useCountUp(result?.endValue ?? 0);

    const interpretation = useMemo(
        () => result ? getInterpretation(result.cagrPercent) : null,
        [result]
    );

    const handleChange = (id: FieldKey, value: string) => {
        setForm((current) => ({ ...current, [id]: value }));
        setCopyStatus("idle");
    };

    const runCalculation = () => {
        const nextErrors = validateForm(form, mode);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            setResult(null);
            return;
        }

        setIsCalculating(true);
        window.setTimeout(() => {
            setResult(calculate(form, mode));
            setIsCalculating(false);
            window.requestAnimationFrame(() => {
                resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            });
        }, 200);
    };

    const reset = () => {
        setForm({
            startValue: "",
            endValue: "",
            years: "",
            targetCagr: "",
        });
        setErrors({});
        setResult(null);
        setCopyStatus("idle");
    };

    const applyExample = (example: typeof examples[number]) => {
        const nextForm = {
            ...form,
            startValue: formatInputValue(example.startValue),
            endValue: formatInputValue(example.endValue),
            years: formatInputValue(example.years),
        };
        setMode("cagr");
        setForm(nextForm);
        setErrors({});
        setIsCalculating(true);
        window.setTimeout(() => {
            setResult(calculate(nextForm, "cagr"));
            setIsCalculating(false);
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 200);
    };

    const copyResult = async () => {
        if (!result || typeof navigator === "undefined" || !navigator.clipboard) {
            setCopyStatus("error");
            return;
        }

        try {
            await navigator.clipboard.writeText(buildShareText(result));
            setCopyStatus("copied");
            window.setTimeout(() => setCopyStatus("idle"), 1800);
        } catch {
            setCopyStatus("error");
        }
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        runCalculation();
                    }
                }}
            >
                <div className="mb-6">
                    <p className="text-xl font-black text-slate-950">Bileşik büyüme hesaplama</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        CAGR oranını veya hedef CAGR ile ulaşılacak gelecek değeri hesaplayın.
                    </p>
                </div>

                <div className="mb-5 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                    {[
                        { id: "cagr", label: "CAGR Hesapla" },
                        { id: "future", label: "Gelecek Değer Hesapla" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            aria-pressed={mode === item.id}
                            onClick={() => {
                                setMode(item.id as Mode);
                                setErrors({});
                                setCopyStatus("idle");
                            }}
                            className={cn(
                                "rounded-lg px-4 py-2 text-sm font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]",
                                mode === item.id
                                    ? "bg-white text-[#CC4A1A] shadow-sm"
                                    : "text-slate-600 hover:text-slate-950"
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Hızlı örnek:</span>
                    {examples.map((example) => (
                        <button
                            key={example.id}
                            type="button"
                            aria-label={`${example.label.replace("Y", " yıl")} örneğini yükle`}
                            onClick={() => applyExample(example)}
                            className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                        >
                            {example.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NumericField
                        id="startValue"
                        label="Başlangıç Değeri"
                        value={form.startValue}
                        unit="TL"
                        placeholder="örn. 100.000"
                        error={errors.startValue}
                        tabIndex={1}
                        onChange={handleChange}
                    />
                    {mode === "cagr" ? (
                        <NumericField
                            id="endValue"
                            label="Bitiş Değeri"
                            value={form.endValue}
                            unit="TL"
                            placeholder="örn. 200.000"
                            error={errors.endValue}
                            tabIndex={2}
                            onChange={handleChange}
                        />
                    ) : (
                        <NumericField
                            id="targetCagr"
                            label="Hedef CAGR"
                            value={form.targetCagr}
                            unit="%"
                            placeholder="örn. 14,87"
                            error={errors.targetCagr}
                            tabIndex={2}
                            onChange={handleChange}
                        />
                    )}
                    <NumericField
                        id="years"
                        label="Süre"
                        value={form.years}
                        unit="yıl"
                        placeholder="örn. 5"
                        error={errors.years}
                        tabIndex={3}
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <button
                        type="button"
                        onClick={runCalculation}
                        disabled={isCalculating}
                        tabIndex={4}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
                    >
                        {isCalculating && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                        Hesapla
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                    >
                        <RotateCcw size={16} aria-hidden="true" />
                        Temizle
                    </button>
                </div>
            </div>

            <div
                ref={resultRef}
                role="status"
                aria-live="polite"
                className={cn(
                    "mt-8 transition-all duration-300",
                    result ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                )}
            >
                {result && (
                    <div className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <article className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                                <p className="text-sm font-bold text-orange-800">
                                    {result.mode === "future" ? "Bitiş Değeri" : "CAGR Oranı"}
                                </p>
                                <p className="mt-3 text-3xl font-black tabular-nums text-[#CC4A1A]">
                                    {result.mode === "future" ? formatTl(displayedEndValue) : formatPercent(displayedCagr)}
                                </p>
                            </article>
                            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-bold text-slate-600">Toplam Büyüme</p>
                                <p className="mt-3 text-2xl font-black tabular-nums text-slate-950">
                                    {formatPercent(displayedGrowth, 0)}
                                </p>
                            </article>
                            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-bold text-slate-600">Kazanç Tutarı</p>
                                <p className="mt-3 text-2xl font-black tabular-nums text-slate-950">
                                    {formatTl(displayedGain)}
                                </p>
                            </article>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {interpretation && (
                                <span className={cn("inline-flex rounded-full border px-3 py-2 text-xs font-black", interpretation.className)}>
                                    {interpretation.text}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={copyResult}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                            >
                                <Clipboard size={16} aria-hidden="true" />
                                {copyStatus === "copied" ? "✓ Kopyalandı" : copyStatus === "error" ? "Kopyalanamadı" : "Sonucu Kopyala"}
                            </button>
                        </div>

                        <Suspense
                            fallback={
                                <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
                            }
                        >
                            <CagrYearlyDetails
                                startValue={result.startValue}
                                cagrRate={result.cagrPercent / 100}
                                years={result.years}
                            />
                        </Suspense>
                    </div>
                )}
            </div>
        </section>
    );
}
