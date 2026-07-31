"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
    Banknote,
    CalendarDays,
    Percent,
    RefreshCw,
    ShieldCheck,
    WalletCards,
    type LucideIcon,
} from "lucide-react";
import type { LanguageCode } from "@/lib/calculator-types";
import { cn } from "@/lib/utils";

type Props = {
    lang: LanguageCode;
    initialValues?: Record<string, string | number>;
};

type DepositScenario = {
    id: "short" | "medium" | "long";
    label: string;
    days: number;
    grossInterest: number;
    withholding: number;
    netInterest: number;
    effectiveRate: number;
    isCurrentTerm: boolean;
    isHighestEffective: boolean;
};

type DepositFormState = {
    principal: string;
    rate: string;
    days: string;
    taxRate: string;
    inflationRate: string;
    mode: "single" | "rollover";
    rolloverCount: string;
};

type NumericFormField = Exclude<keyof DepositFormState, "mode">;

const MAX_ROLLOVER_COUNT = 36;
const INPUT_DEBOUNCE_MS = 300;
const SESSION_STORAGE_KEY = "mevduat-form";
const SHORT_SCENARIO_DAYS = 32;
const STANDARD_SCENARIO_DAYS = 92;
const LONG_SCENARIO_DAYS = 181;
const DEFAULT_FORM_STATE: DepositFormState = {
    principal: "100000",
    rate: "45",
    days: "92",
    taxRate: "17.5",
    inflationRate: "45",
    mode: "single",
    rolloverCount: "1",
};
const MevduatChart = dynamic(() => import("@/components/MevduatChart"), {
    ssr: false,
    loading: () => (
        <div className="flex h-64 animate-pulse items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-400">
            Grafik yükleniyor...
        </div>
    ),
});

const copy = {
    tr: {
        formTitle: "Mevduat bilgileri",
        resultTitle: "Sonuçlar",
        principal: "Anapara",
        annualRate: "Yıllık Faiz Oranı",
        termDays: "Vade (gün)",
        withholdingRate: "Stopaj Oranı",
        expectedInflation: "Beklenen Yıllık Enflasyon",
        termStructure: "Vade Yapısı",
        singleTerm: "Tek Vade",
        rollover: "Otomatik Yenileme",
        rolloverCount: "Yenileme Sayısı",
        maxRollover: "Maksimum 36 dönem",
        grossInterest: "Brüt Faiz",
        withholding: "Stopaj Kesinti",
        netInterest: "Net Faiz",
        netTotal: "Vade Sonu Net",
        planTotal: "Plan Sonu Toplam",
        effectiveAnnual: "Efektif Yıllık",
        compoundNetRate: "Bileşik Net Oran",
        totalPeriod: "Toplam Dönem",
        period: "dönem",
        day: "gün",
        chartTitle: "Nominal ve reel birikim",
        realValue: "reel değer",
        inflationWon: "kazandı ✅",
        inflationLost: "kaybetti ❌",
        scenarioTitle: "Senaryo Karşılaştırması",
        scenarioLongBetter: "Uzun vadede daha avantajlı ✅",
        scenarioLongWorse: "Uzun vadede daha dezavantajlı ❌",
    },
    en: {
        formTitle: "Deposit details",
        resultTitle: "Results",
        principal: "Principal",
        annualRate: "Annual Interest Rate",
        termDays: "Term (days)",
        withholdingRate: "Withholding Rate",
        expectedInflation: "Expected Annual Inflation",
        termStructure: "Term Structure",
        singleTerm: "Single Term",
        rollover: "Auto Rollover",
        rolloverCount: "Rollover Count",
        maxRollover: "Maximum 36 periods",
        grossInterest: "Gross Interest",
        withholding: "Withholding",
        netInterest: "Net Interest",
        netTotal: "Net at Maturity",
        planTotal: "Plan End Total",
        effectiveAnnual: "Effective Annual",
        compoundNetRate: "Compound Net Rate",
        totalPeriod: "Total Period",
        period: "period",
        day: "days",
        chartTitle: "Nominal and real balance",
        realValue: "real value",
        inflationWon: "gained ✅",
        inflationLost: "lost ❌",
        scenarioTitle: "Scenario Comparison",
        scenarioLongBetter: "Long term is more advantageous ✅",
        scenarioLongWorse: "Long term is less advantageous ❌",
    },
} satisfies Record<LanguageCode, Record<string, string>>;

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
}

function hasInitialValue(initialValues: Props["initialValues"], key: string) {
    const value = initialValues?.[key];
    return value !== undefined && value !== null && value !== "";
}

function readInitialValue(initialValues: Props["initialValues"], key: string) {
    const value = initialValues?.[key];
    return value === undefined || value === null || value === "" ? undefined : String(value);
}

function getInitialOverrides(initialValues: Props["initialValues"]) {
    const overrides: Partial<DepositFormState> = {};

    if (hasInitialValue(initialValues, "principal")) {
        overrides.principal = readInitialValue(initialValues, "principal");
    }
    if (hasInitialValue(initialValues, "rate")) {
        overrides.rate = readInitialValue(initialValues, "rate");
    }
    if (hasInitialValue(initialValues, "days")) {
        overrides.days = readInitialValue(initialValues, "days");
    }
    if (hasInitialValue(initialValues, "taxRate")) {
        overrides.taxRate = readInitialValue(initialValues, "taxRate");
    }
    if (hasInitialValue(initialValues, "inflationRate")) {
        overrides.inflationRate = readInitialValue(initialValues, "inflationRate");
    }
    if (initialValues?.mode === "rollover" || initialValues?.mode === "single") {
        overrides.mode = initialValues.mode;
    }
    if (hasInitialValue(initialValues, "rolloverCount")) {
        overrides.rolloverCount = readInitialValue(initialValues, "rolloverCount");
    }

    return overrides;
}

function isDepositFormState(value: unknown): value is Partial<DepositFormState> {
    return Boolean(value && typeof value === "object");
}

function readSavedFormState() {
    if (typeof window === "undefined") {
        return undefined;
    }

    try {
        const saved = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!saved) {
            return undefined;
        }

        const parsed = JSON.parse(saved);
        return isDepositFormState(parsed) ? parsed : undefined;
    } catch {
        return undefined;
    }
}

function buildFormState(
    initialValues: Props["initialValues"],
    savedState?: Partial<DepositFormState>
): DepositFormState {
    const merged = {
        ...DEFAULT_FORM_STATE,
        ...savedState,
        ...getInitialOverrides(initialValues),
    };

    return {
        ...merged,
        principal: String(merged.principal ?? DEFAULT_FORM_STATE.principal),
        rate: String(merged.rate ?? DEFAULT_FORM_STATE.rate),
        days: String(merged.days ?? DEFAULT_FORM_STATE.days),
        taxRate: String(merged.taxRate ?? DEFAULT_FORM_STATE.taxRate),
        inflationRate: String(merged.inflationRate ?? DEFAULT_FORM_STATE.inflationRate),
        mode: merged.mode === "rollover" ? "rollover" : "single",
        rolloverCount: String(merged.rolloverCount ?? DEFAULT_FORM_STATE.rolloverCount),
    };
}

function parseLocalizedNumber(value: string | number) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    const cleaned = value.trim().replace(/[^\d,.-]/g, "");
    if (!cleaned || cleaned === "-" || cleaned === "," || cleaned === ".") {
        return 0;
    }

    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");

    if (hasComma && hasDot) {
        const lastComma = cleaned.lastIndexOf(",");
        const lastDot = cleaned.lastIndexOf(".");
        const decimalSeparator = lastComma > lastDot ? "," : ".";
        const thousandsSeparator = decimalSeparator === "," ? "." : ",";
        const normalized = cleaned
            .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
            .replace(decimalSeparator, ".");
        const parsed = Number.parseFloat(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    if (hasComma) {
        const parsed = Number.parseFloat(cleaned.replace(",", "."));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    if (hasDot) {
        const parts = cleaned.split(".");
        if (parts.length > 2) {
            const parsed = Number.parseFloat(parts.join(""));
            return Number.isFinite(parsed) ? parsed : 0;
        }

        const [integerPart, fractionalPart] = parts;
        if (fractionalPart?.length === 3 && integerPart.length > 1) {
            const parsed = Number.parseFloat(`${integerPart}${fractionalPart}`);
            return Number.isFinite(parsed) ? parsed : 0;
        }
    }

    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
}

function clampNonNegative(value: number) {
    return Math.max(0, Number.isFinite(value) ? value : 0);
}

function formatDecimal(value: number, locale: string) {
    return value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatMoney(value: number, locale: string) {
    return `${formatDecimal(value, locale)} TL`;
}

function formatPercentValue(value: number, locale: string) {
    return `%${formatDecimal(value, locale)}`;
}

function normalizeNumberInput(
    value: string,
    options: { allowDecimal?: boolean; preferDotDecimal?: boolean; maxFractionDigits?: number } = {}
) {
    const allowDecimal = options.allowDecimal ?? true;
    const cleaned = value.replace(/[^\d,.-]/g, "").replace(/-/g, "");

    if (!cleaned) {
        return "";
    }

    if (!allowDecimal) {
        return cleaned.replace(/\D/g, "");
    }

    const maxFractionDigits = options.maxFractionDigits ?? 2;
    const trimFraction = (fraction: string) => fraction.replace(/\D/g, "").slice(0, maxFractionDigits);
    const buildDecimal = (integerPart: string, fractionPart: string, hasSeparator: boolean) => {
        const integerDigits = integerPart.replace(/\D/g, "");
        const fractionDigits = trimFraction(fractionPart);

        if (!hasSeparator) {
            return integerDigits;
        }

        return `${integerDigits || "0"}.${fractionDigits}`;
    };

    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");

    if (lastComma >= 0 && lastDot >= 0) {
        const decimalIndex = Math.max(lastComma, lastDot);
        return buildDecimal(
            cleaned.slice(0, decimalIndex),
            cleaned.slice(decimalIndex + 1),
            true
        );
    }

    if (lastComma >= 0) {
        return buildDecimal(cleaned.slice(0, lastComma), cleaned.slice(lastComma + 1), true);
    }

    if (lastDot >= 0) {
        const parts = cleaned.split(".");
        if (parts.length > 2) {
            return cleaned.replace(/\D/g, "");
        }

        const [integerPart, fractionPart = ""] = parts;
        const dotLooksDecimal =
            options.preferDotDecimal
            || fractionPart.length === 0
            || (fractionPart.length <= maxFractionDigits && integerPart.length <= 2);

        if (dotLooksDecimal) {
            return buildDecimal(integerPart, fractionPart, true);
        }

        return `${integerPart}${fractionPart}`.replace(/\D/g, "");
    }

    return cleaned.replace(/\D/g, "");
}

function formatInputDisplayValue(
    rawValue: string,
    locale: string,
    options: { allowDecimal?: boolean } = {}
) {
    if (!rawValue) {
        return "";
    }

    const allowDecimal = options.allowDecimal ?? true;
    const decimalSeparator = locale === "tr-TR" ? "," : ".";
    const [integerPart, fractionPart] = rawValue.split(".");
    const integerDigits = integerPart.replace(/\D/g, "");
    const integerDisplay = (Number.parseInt(integerDigits || "0", 10) || 0).toLocaleString(locale, {
        maximumFractionDigits: 0,
    });

    if (!allowDecimal || fractionPart === undefined) {
        return integerDisplay;
    }

    return `${integerDisplay}${decimalSeparator}${fractionPart}`;
}

function TextField({
    id,
    label,
    value,
    suffix,
    icon: Icon,
    isInvalid,
    helper,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    suffix?: string;
    icon: LucideIcon;
    isInvalid?: boolean;
    helper?: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="flex flex-col gap-2" htmlFor={id}>
            <span className="text-sm font-semibold text-slate-600">{label}</span>
            <span className="relative">
                <Icon
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                />
                <input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid ? "true" : "false"}
                    aria-describedby={helper ? `${id}-helper` : undefined}
                    className={cn(
                        "h-12 w-full rounded-lg border bg-white py-2 pl-10 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:ring-4",
                        suffix ? "pr-14" : "pr-4",
                        isInvalid
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                    )}
                />
                {suffix && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                        {suffix}
                    </span>
                )}
            </span>
            {helper && (
                <span
                    id={`${id}-helper`}
                    className={cn(
                        "text-xs font-semibold",
                        isInvalid ? "text-red-600" : "text-slate-500"
                    )}
                >
                    {helper}
                </span>
            )}
        </label>
    );
}

function ResultCard({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={cn(
                "min-h-[120px] rounded-lg border bg-white p-4 shadow-sm",
                highlight ? "border-[#FFD7C7] bg-[#FFF7F3]" : "border-slate-200"
            )}
        >
            <p className="text-sm font-bold text-slate-600">{label}</p>
            <p
                className={cn(
                    "mt-4 break-words text-2xl font-black tracking-normal",
                    highlight ? "text-[#CC4A1A]" : "text-slate-950"
                )}
            >
                {value}
            </p>
        </div>
    );
}

function ResultCardsSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }, (_, index) => (
                <div
                    key={index}
                    className="h-20 w-full animate-pulse rounded-xl bg-slate-100"
                    aria-hidden="true"
                />
            ))}
        </>
    );
}

function ScenarioComparisonTable({
    scenarios,
    longTermIsBetter,
    locale,
    title,
    summary,
}: {
    scenarios: DepositScenario[];
    longTermIsBetter: boolean;
    locale: string;
    title: string;
    summary: string;
}) {
    const rows = [
        {
            label: "Brüt Faiz",
            getValue: (scenario: DepositScenario) => formatMoney(scenario.grossInterest, locale),
        },
        {
            label: "Stopaj",
            getValue: (scenario: DepositScenario) => formatMoney(scenario.withholding, locale),
        },
        {
            label: "Net Faiz",
            getValue: (scenario: DepositScenario) => formatMoney(scenario.netInterest, locale),
        },
        {
            label: "Efektif Oran",
            getValue: (scenario: DepositScenario) => formatPercentValue(scenario.effectiveRate, locale),
        },
    ];

    return (
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-950">{title}</h3>
            <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="min-w-28 border-b border-r border-slate-200 px-3 py-3 text-left font-black text-slate-700">
                                {" "}
                            </th>
                            {scenarios.map((scenario) => (
                                <th
                                    key={scenario.id}
                                    className={cn(
                                        "min-w-32 border-b border-r border-slate-200 px-3 py-3 text-center font-black text-slate-900 last:border-r-0",
                                        scenario.isHighestEffective && "bg-emerald-50 text-emerald-800",
                                        scenario.isCurrentTerm && "ring-2 ring-inset ring-blue-500"
                                    )}
                                >
                                    {scenario.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.label} className="odd:bg-white even:bg-slate-50/60">
                                <th className="border-r border-slate-200 px-3 py-3 text-left font-bold text-slate-600">
                                    {row.label}
                                </th>
                                {scenarios.map((scenario) => (
                                    <td
                                        key={`${row.label}-${scenario.id}`}
                                        className={cn(
                                            "border-r border-slate-200 px-3 py-3 text-right font-bold tabular-nums text-slate-800 last:border-r-0",
                                            scenario.isHighestEffective && "bg-emerald-50/70 text-emerald-900",
                                            scenario.isCurrentTerm && "ring-2 ring-inset ring-blue-500"
                                        )}
                                    >
                                        {row.getValue(scenario)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p
                className={cn(
                    "mt-4 rounded-lg border px-4 py-3 text-sm font-black leading-6",
                    longTermIsBetter
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-800"
                )}
            >
                {summary}
            </p>
        </div>
    );
}

export default function DepositInterestCalculator({
    lang,
    initialValues,
}: Props) {
    const t = copy[lang];
    const locale = lang === "tr" ? "tr-TR" : "en-US";
    const [formState, setFormState] = useState<DepositFormState>(() =>
        buildFormState(initialValues)
    );
    const [isResultReady, setIsResultReady] = useState(false);

    useEffect(() => {
        setFormState(buildFormState(initialValues, readSavedFormState()));
        setIsResultReady(true);
    }, [initialValues]);

    useEffect(() => {
        if (!isResultReady || typeof window === "undefined") {
            return;
        }

        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(formState));
    }, [formState, isResultReady]);

    const anaparaInput = formState.principal;
    const faizOraniInput = formState.rate;
    const vadeGunInput = formState.days;
    const stopajOraniInput = formState.taxRate;
    const enflasyonInput = formState.inflationRate;
    const yenilemeSayisiInput = formState.rolloverCount;
    const yenileme = formState.mode === "rollover";

    const displayValues = useMemo(() => ({
        anapara: formatInputDisplayValue(anaparaInput, locale, { allowDecimal: false }),
        faizOrani: formatInputDisplayValue(faizOraniInput, locale),
        vadeGun: formatInputDisplayValue(vadeGunInput, locale, { allowDecimal: false }),
        stopajOrani: formatInputDisplayValue(stopajOraniInput, locale),
        enflasyon: formatInputDisplayValue(enflasyonInput, locale),
        yenilemeSayisi: formatInputDisplayValue(yenilemeSayisiInput, locale, { allowDecimal: false }),
    }), [
        anaparaInput,
        faizOraniInput,
        locale,
        stopajOraniInput,
        enflasyonInput,
        vadeGunInput,
        yenilemeSayisiInput,
    ]);

    const setFormField = <Key extends keyof DepositFormState>(
        key: Key,
        value: DepositFormState[Key]
    ) => {
        setFormState((current) => ({ ...current, [key]: value }));
    };

    const updateNumberField = (
        key: NumericFormField,
        options?: Parameters<typeof normalizeNumberInput>[1]
    ) => (value: string) => {
        setFormField(key, normalizeNumberInput(value, options));
    };

    const anapara = useDebounce(anaparaInput, INPUT_DEBOUNCE_MS);
    const faizOrani = useDebounce(faizOraniInput, INPUT_DEBOUNCE_MS);
    const vadeGun = useDebounce(vadeGunInput, INPUT_DEBOUNCE_MS);
    const stopajOrani = useDebounce(stopajOraniInput, INPUT_DEBOUNCE_MS);
    const enflasyonOrani = useDebounce(enflasyonInput, INPUT_DEBOUNCE_MS);
    const yenilemeSayisi = useDebounce(yenilemeSayisiInput, INPUT_DEBOUNCE_MS);
    const isRolloverLimitExceeded =
        yenileme && parseLocalizedNumber(yenilemeSayisiInput) > MAX_ROLLOVER_COUNT;

    const result = useMemo(() => {
        const principal = clampNonNegative(parseLocalizedNumber(anapara));
        const annualRatePercent = clampNonNegative(parseLocalizedNumber(faizOrani));
        const termDays = Math.max(1, clampNonNegative(parseLocalizedNumber(vadeGun)));
        const withholdingPercent = clampNonNegative(parseLocalizedNumber(stopajOrani));
        const inflationPercent = clampNonNegative(parseLocalizedNumber(enflasyonOrani));
        const requestedRolloverCount = Math.max(
            1,
            Math.round(clampNonNegative(parseLocalizedNumber(yenilemeSayisi)))
        );
        const rolloverCount = Math.min(requestedRolloverCount, MAX_ROLLOVER_COUNT);
        const periodCount = yenileme ? rolloverCount : 1;

        const brutFaiz = principal * (annualRatePercent / 100) * (termDays / 365);
        const stopajTutari = brutFaiz * (withholdingPercent / 100);
        const netFaiz = brutFaiz - stopajTutari;
        const vadeSonuTutar = principal + netFaiz;
        const efektifNetOran = principal > 0
            ? (netFaiz / principal) * (365 / termDays) * 100
            : 0;

        const periods = Array.from({ length: periodCount }, (_, i) => i);
        const sonuc = periods.reduce((acc) => {
            const periodGrossInterest =
                acc.tutar * (annualRatePercent / 100) * (termDays / 365);
            const periodWithholding =
                periodGrossInterest * (withholdingPercent / 100);
            const periodNetInterest = periodGrossInterest - periodWithholding;
            const nextAmount = acc.tutar + periodNetInterest;

            return {
                ...acc,
                tutar: nextAmount,
                toplamFaiz: acc.toplamFaiz + periodNetInterest,
                toplamBrutFaiz: acc.toplamBrutFaiz + periodGrossInterest,
                toplamStopaj: acc.toplamStopaj + periodWithholding,
                periods: [...acc.periods, nextAmount],
            };
        }, {
            tutar: principal,
            toplamFaiz: 0,
            toplamBrutFaiz: 0,
            toplamStopaj: 0,
            periods: [] as number[],
        });

        const compoundNetRate = principal > 0
            ? ((sonuc.tutar - principal) / principal) * 100
            : 0;
        const mediumScenarioDays =
            termDays === SHORT_SCENARIO_DAYS || termDays === LONG_SCENARIO_DAYS
                ? STANDARD_SCENARIO_DAYS
                : termDays;
        const calculateScenario = (
            id: DepositScenario["id"],
            scenarioDays: number
        ) => {
            const scenarioGrossInterest =
                principal * (annualRatePercent / 100) * (scenarioDays / 365);
            const scenarioWithholding =
                scenarioGrossInterest * (withholdingPercent / 100);
            const scenarioNetInterest = scenarioGrossInterest - scenarioWithholding;
            const scenarioEffectiveRate = principal > 0
                ? (scenarioNetInterest / principal) * (365 / scenarioDays) * 100
                : 0;

            return {
                id,
                label: `${scenarioDays.toLocaleString("tr-TR")} Gün`,
                days: scenarioDays,
                grossInterest: scenarioGrossInterest,
                withholding: scenarioWithholding,
                netInterest: scenarioNetInterest,
                effectiveRate: scenarioEffectiveRate,
                isCurrentTerm: scenarioDays === termDays,
                isHighestEffective: false,
            };
        };
        const shortScenario = calculateScenario("short", SHORT_SCENARIO_DAYS);
        const mediumScenario = calculateScenario("medium", mediumScenarioDays);
        const longScenario = calculateScenario("long", LONG_SCENARIO_DAYS);
        const highestEffectiveRate = Math.max(
            shortScenario.effectiveRate,
            mediumScenario.effectiveRate,
            longScenario.effectiveRate
        );
        const highestScenarioId =
            longScenario.effectiveRate === highestEffectiveRate
                ? longScenario.id
                : mediumScenario.effectiveRate === highestEffectiveRate
                    ? mediumScenario.id
                    : shortScenario.id;
        const scenarios = [
            {
                ...shortScenario,
                isHighestEffective: shortScenario.id === highestScenarioId,
            },
            {
                ...mediumScenario,
                isHighestEffective: mediumScenario.id === highestScenarioId,
            },
            {
                ...longScenario,
                isHighestEffective: longScenario.id === highestScenarioId,
            },
        ];
        const longTermIsBetter = longScenario.netInterest > mediumScenario.netInterest;

        return {
            principal,
            termDays,
            periodCount,
            inflationPercent,
            grossInterest: yenileme ? sonuc.toplamBrutFaiz : brutFaiz,
            withholding: yenileme ? sonuc.toplamStopaj : stopajTutari,
            netInterest: yenileme ? sonuc.toplamFaiz : netFaiz,
            finalTotal: yenileme ? sonuc.tutar : vadeSonuTutar,
            rate: yenileme ? compoundNetRate : efektifNetOran,
            periods: sonuc.periods,
            scenarios,
            longTermIsBetter,
        };
    }, [anapara, faizOrani, vadeGun, stopajOrani, enflasyonOrani, yenileme, yenilemeSayisi]);

    const chartData = useMemo(() => {
        return result.periods.map((nominal, i) => ({
            donem: `${i + 1}. Dönem`,
            period: i + 1,
            nominal,
            reel: nominal / Math.pow(
                1 + result.inflationPercent / 100,
                ((i + 1) * result.termDays) / 365
            ),
        }));
    }, [result]);

    const finalChartPoint = chartData[chartData.length - 1] ?? {
        nominal: result.finalTotal,
        reel: result.finalTotal,
    };
    const hasRealGain = finalChartPoint.reel >= result.principal;

    const periodLabel = yenileme
        ? `${result.periodCount.toLocaleString(locale)} ${t.period} × ${result.termDays.toLocaleString(locale)} ${t.day}`
        : `${result.periodCount.toLocaleString(locale)} ${t.period}`;
    const visibleResult = isResultReady ? result : null;

    return (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">{t.formTitle}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <TextField
                        id="deposit-principal"
                        label={t.principal}
                        value={displayValues.anapara}
                        suffix="₺"
                        icon={Banknote}
                        onChange={updateNumberField("principal", { allowDecimal: false })}
                    />
                    <TextField
                        id="deposit-rate"
                        label={t.annualRate}
                        value={displayValues.faizOrani}
                        suffix="%"
                        icon={Percent}
                        onChange={updateNumberField("rate", { preferDotDecimal: true, maxFractionDigits: 2 })}
                    />
                    <TextField
                        id="deposit-days"
                        label={t.termDays}
                        value={displayValues.vadeGun}
                        suffix={t.day}
                        icon={CalendarDays}
                        onChange={updateNumberField("days", { allowDecimal: false })}
                    />
                    <TextField
                        id="deposit-tax-rate"
                        label={t.withholdingRate}
                        value={displayValues.stopajOrani}
                        suffix="%"
                        icon={ShieldCheck}
                        onChange={updateNumberField("taxRate", { preferDotDecimal: true, maxFractionDigits: 2 })}
                    />
                    <TextField
                        id="deposit-inflation-rate"
                        label={t.expectedInflation}
                        value={displayValues.enflasyon}
                        suffix="%"
                        icon={Percent}
                        onChange={updateNumberField("inflationRate", { preferDotDecimal: true, maxFractionDigits: 2 })}
                    />
                </div>

                <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-600">
                        {t.termStructure}
                    </p>
                    <div className="mt-2 grid rounded-lg border border-slate-200 bg-white p-1 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setFormField("mode", "single")}
                            className={cn(
                                "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                !yenileme
                                    ? "bg-[#FFF3EE] text-[#CC4A1A] shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                            )}
                            aria-pressed={!yenileme}
                        >
                            <CalendarDays size={17} aria-hidden="true" />
                            {t.singleTerm}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormField("mode", "rollover")}
                            className={cn(
                                "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                yenileme
                                    ? "bg-[#FFF3EE] text-[#CC4A1A] shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                            )}
                            aria-pressed={yenileme}
                        >
                            <RefreshCw size={17} aria-hidden="true" />
                            {t.rollover}
                        </button>
                    </div>
                </div>

                {yenileme && (
                    <div className="mt-5 max-w-xs">
                        <TextField
                            id="deposit-rollover-count"
                            label={t.rolloverCount}
                            value={displayValues.yenilemeSayisi}
                            icon={WalletCards}
                            isInvalid={isRolloverLimitExceeded}
                            helper={isRolloverLimitExceeded ? t.maxRollover : undefined}
                            onChange={updateNumberField("rolloverCount", { allowDecimal: false })}
                        />
                    </div>
                )}
            </div>

            <div
                className="rounded-lg border border-slate-200 bg-slate-100 p-5 shadow-sm"
                aria-live="polite"
            >
                <h2 className="text-lg font-black text-slate-950">{t.resultTitle}</h2>
                <div className="transition-all duration-200 ease-out">
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleResult ? (
                            <>
                                <ResultCard
                                    label={t.grossInterest}
                                    value={formatMoney(visibleResult.grossInterest, locale)}
                                />
                                <ResultCard
                                    label={t.withholding}
                                    value={formatMoney(visibleResult.withholding, locale)}
                                />
                                <ResultCard
                                    label={t.netInterest}
                                    value={formatMoney(visibleResult.netInterest, locale)}
                                />
                                <ResultCard
                                    label={yenileme ? t.planTotal : t.netTotal}
                                    value={formatMoney(visibleResult.finalTotal, locale)}
                                    highlight
                                />
                                <ResultCard
                                    label={yenileme ? t.compoundNetRate : t.effectiveAnnual}
                                    value={formatPercentValue(visibleResult.rate, locale)}
                                />
                                <ResultCard
                                    label={t.totalPeriod}
                                    value={periodLabel}
                                />
                            </>
                        ) : (
                            <ResultCardsSkeleton />
                        )}
                    </div>
                </div>

                {visibleResult && (
                    <>
                        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-black text-slate-950">
                                {t.chartTitle}
                            </h3>
                            <div className="mt-3 h-64">
                                <MevduatChart data={chartData} locale={locale} />
                            </div>
                            <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-700">
                                {visibleResult.periodCount.toLocaleString(locale)} {t.period} sonunda nominal{" "}
                                {formatMoney(finalChartPoint.nominal, locale)}, {t.realValue}{" "}
                                {formatMoney(finalChartPoint.reel, locale)}. Enflasyona karşı{" "}
                                <span className={hasRealGain ? "text-emerald-700" : "text-red-700"}>
                                    {hasRealGain ? t.inflationWon : t.inflationLost}
                                </span>
                            </p>
                        </div>

                        <ScenarioComparisonTable
                            scenarios={visibleResult.scenarios}
                            longTermIsBetter={visibleResult.longTermIsBetter}
                            locale={locale}
                            title={t.scenarioTitle}
                            summary={visibleResult.longTermIsBetter ? t.scenarioLongBetter : t.scenarioLongWorse}
                        />
                    </>
                )}
            </div>
        </section>
    );
}
