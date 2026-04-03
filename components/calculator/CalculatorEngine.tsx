"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { loadCalculatorFormula } from "@/lib/calculator-runtime";
import type {
    CalculatorClientEntry,
    CalculatorFormula,
} from "@/lib/calculator-types";
import CalculatorForm from "./CalculatorForm";
import ResultBox from "./ResultBox";
import type { LanguageCode } from "@/lib/calculator-types";
import { trackEvent } from "@/lib/analytics";

const DebtPayoffPlannerCalculator = dynamic(
    () => import("./custom/DebtPayoffPlannerCalculator")
);
const LoanComparisonCalculator = dynamic(
    () => import("./custom/LoanComparisonCalculator")
);
const RentVsBuyCalculator = dynamic(
    () => import("./custom/RentVsBuyCalculator")
);
const DividendPortfolioCalculator = dynamic(
    () => import("./custom/DividendPortfolioCalculator")
);
const YksCalculator = dynamic(() => import("./custom/YksCalculator"));
const AltinHesaplamaCalculator = dynamic(() => import("./custom/AltinHesaplamaCalculator"));
const DovizHesaplamaCalculator = dynamic(() => import("./custom/DovizHesaplamaCalculator"));
const GecmisAltinFiyatlariCalculator = dynamic(() => import("./custom/GecmisAltinFiyatlariCalculator"));

interface Props {
    calculator: CalculatorClientEntry;
    lang: LanguageCode;
    initialValues?: Record<string, string | number>;
}

type SpecialCalculatorSlug =
    | "yks-puan-hesaplama"
    | "kira-mi-konut-kredisi-mi-hesaplama"
    | "kredi-karsilastirma-hesaplama"
    | "borc-kapatma-planlayici-hesaplama"
    | "sermaye-ve-temettu-hesaplama"
    | "altin-hesaplama"
    | "doviz-hesaplama"
    | "gecmis-altin-fiyatlari";

const specialCalculatorComponents = {
    "yks-puan-hesaplama": YksCalculator,
    "kira-mi-konut-kredisi-mi-hesaplama": RentVsBuyCalculator,
    "kredi-karsilastirma-hesaplama": LoanComparisonCalculator,
    "borc-kapatma-planlayici-hesaplama": DebtPayoffPlannerCalculator,
    "sermaye-ve-temettu-hesaplama": DividendPortfolioCalculator,
    "altin-hesaplama": AltinHesaplamaCalculator,
    "doviz-hesaplama": DovizHesaplamaCalculator,
    "gecmis-altin-fiyatlari": GecmisAltinFiyatlariCalculator,
} satisfies Record<SpecialCalculatorSlug, React.ComponentType<{ lang: LanguageCode }>>;

function isSpecialCalculatorSlug(slug: string): slug is SpecialCalculatorSlug {
    return slug in specialCalculatorComponents;
}

function buildInitialValues(
    calculator: CalculatorClientEntry,
    overrides?: Record<string, string | number>
) {
    const initial: Record<string, any> = {};
    calculator.inputs.forEach((input) => {
        initial[input.id] = overrides?.[input.id] ?? input.defaultValue ?? "";
    });
    return initial;
}

function sanitizeCalculationResult(raw: Record<string, any>) {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(raw)) {
        sanitized[key] = typeof value === "number" && Number.isNaN(value) ? 0 : value;
    }
    return sanitized;
}

export default function CalculatorEngine({
    calculator,
    lang,
    initialValues,
}: Props) {
    const [values, setValues] = useState<Record<string, any>>(() =>
        buildInitialValues(calculator, initialValues)
    );
    const [formula, setFormula] = useState<CalculatorFormula | null>(null);
    const [isRuntimeLoading, setIsRuntimeLoading] = useState(
        !isSpecialCalculatorSlug(calculator.slug)
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const hasTrackedStartRef = useRef(false);
    const hasTrackedResultViewRef = useRef(false);

    useEffect(() => {
        setValues(buildInitialValues(calculator, initialValues));
        setErrorMessage(null);
        hasTrackedStartRef.current = false;
        hasTrackedResultViewRef.current = false;
    }, [calculator, initialValues]);

    useEffect(() => {
        if (isSpecialCalculatorSlug(calculator.slug)) {
            setFormula(null);
            setIsRuntimeLoading(false);
            setErrorMessage(null);
            return;
        }

        let isCancelled = false;
        setIsRuntimeLoading(true);
        setErrorMessage(null);

        void loadCalculatorFormula(calculator.category, calculator.slug)
            .then((loadedFormula) => {
                if (isCancelled) {
                    return;
                }
                setFormula(() => loadedFormula);
            })
            .catch((error) => {
                console.error("Calculator runtime load failed:", error);
                if (!isCancelled) {
                    setFormula(null);
                    setErrorMessage(
                        lang === "tr"
                            ? "Hesaplama motoru yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin."
                            : "An error occurred while loading the calculator engine. Please refresh the page or try again later."
                    );
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setIsRuntimeLoading(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [calculator.category, calculator.slug, lang]);

    const results = useMemo(() => {
        if (!formula) return {};
        try {
            setErrorMessage(null);
            return sanitizeCalculationResult(formula(values));
        } catch (error) {
            console.error("Calculation Error:", error);
            setErrorMessage(
                lang === "tr"
                    ? "Hesaplama sırasında bir hata oluştu. Lütfen girdi değerlerinizi kontrol edin."
                    : "An error occurred during calculation. Please check your input values."
            );
            return {};
        }
    }, [formula, values, lang]);

    const handleInputChange = (id: string, value: any) => {
        if (!hasTrackedStartRef.current) {
            hasTrackedStartRef.current = true;
            trackEvent("calculator_interaction_start", {
                calculator_slug: calculator.slug,
                calculator_category: calculator.category,
                locale: lang,
                input_id: id,
            });
        }

        setValues((prev) => ({ ...prev, [id]: value }));
        setErrorMessage(null);
    };

    useEffect(() => {
        if (
            hasTrackedResultViewRef.current
            || isRuntimeLoading
            || errorMessage
            || Object.keys(results).length === 0
        ) {
            return;
        }

        hasTrackedResultViewRef.current = true;
        trackEvent("calculator_results_view", {
            calculator_slug: calculator.slug,
            calculator_category: calculator.category,
            locale: lang,
            result_count: Object.keys(results).length,
        });
    }, [calculator.category, calculator.slug, errorMessage, isRuntimeLoading, lang, results]);

    if (isSpecialCalculatorSlug(calculator.slug)) {
        const SpecialCalculator = specialCalculatorComponents[calculator.slug];
        return <SpecialCalculator lang={lang} />;
    }

    return (
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[#FFD7C7] sm:p-6">
                <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900">
                    {calculator.name[lang]}
                </h2>
                {errorMessage && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}
                <CalculatorForm
                    inputs={calculator.inputs}
                    values={values}
                    onChange={handleInputChange}
                    lang={lang}
                />
            </div>

            <div className="md:sticky md:top-24">
                {isRuntimeLoading ? (
                    <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-100 p-8 shadow-sm animate-pulse">
                        <div className="h-5 w-28 rounded bg-slate-200" />
                        <div className="space-y-4">
                            <div className="h-16 rounded-2xl border border-slate-200 bg-white" />
                            <div className="h-16 rounded-2xl border border-slate-200 bg-white" />
                            <div className="h-16 rounded-2xl border border-slate-200 bg-white" />
                        </div>
                    </div>
                ) : (
                    <ResultBox
                        results={results}
                        config={calculator.results}
                        lang={lang}
                    />
                )}
            </div>
        </div>
    );
}
