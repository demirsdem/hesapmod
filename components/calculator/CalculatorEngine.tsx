"use client";

import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceDot,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { loadCalculatorFormula } from "@/lib/calculator-runtime";
import { calculateTytScoreSet } from "@/lib/tyt";
import { CheckCircle2, Share2, AlertTriangle } from "lucide-react";
import type {
    CalculatorClientEntry,
    CalculatorFormula,
} from "@/lib/calculator-types";
import CalculatorForm from "./CalculatorForm";
import ResultBox from "./ResultBox";
import ConstructionMaterialList from "./ConstructionMaterialList";
import LgsResultPanel from "./custom/LgsResultPanel";
import { TytComparisonTable, TytSelectedResultPanel } from "./custom/TytResultPanel";
import type { LanguageCode } from "@/lib/calculator-types";
import { trackEvent } from "@/lib/analytics";
import { sanitizeFiniteValue, toFiniteNumber } from "@/lib/safe-number";

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
const PortfolioAllocationCalculator = dynamic(
    () => import("./custom/PortfolioAllocationCalculator")
);
const YksCalculator = dynamic(() => import("./custom/YksCalculator"));
const AlesCalculator = dynamic(() => import("./custom/AlesCalculator"));
const KacGunOlduCalculator = dynamic(() => import("./custom/KacGunOlduCalculator"));
const MaternityLeaveCalculator = dynamic(() => import("./custom/MaternityLeaveCalculator"));
const AltinHesaplamaCalculator = dynamic(() => import("./custom/AltinHesaplamaCalculator"));
const DovizHesaplamaCalculator = dynamic(() => import("./custom/DovizHesaplamaCalculator"));
const GecmisAltinFiyatlariCalculator = dynamic(() => import("./custom/GecmisAltinFiyatlariCalculator"));
const CementCalculator = dynamic(() => import("./custom/CementCalculator"));
const FuelCostCalculator = dynamic(() => import("./custom/FuelCostCalculator"));
const YukselenBurcCalculator = dynamic(() => import("./custom/YukselenBurcCalculator"));
const DepositInterestCalculator = dynamic(() => import("./custom/DepositInterestCalculator"));
const CagrCalculator = dynamic(() => import("./custom/CagrCalculator"));
const BabyHeightCalculator = dynamic(() => import("./custom/BabyHeightCalculator"));
const TestSuccessRateCalculator = dynamic(() => import("./custom/TestSuccessRateCalculator"));

interface Props {
    calculator: CalculatorClientEntry;
    lang: LanguageCode;
    initialValues?: Record<string, string | number>;
}

const CREDIT_CARD_LATE_INTEREST_SLUG = "kredi-karti-gecikme-faizi-hesaplama";
const EUROBOND_SLUG = "eurobond-hesaplama";
const TAX_DELAY_INTEREST_SLUG = "vergi-gecikme-faizi-hesaplama";
const LGS_SCORE_SLUG = "lgs-puan-hesaplama";
const TYT_SCORE_SLUG = "tyt-puan-hesaplama";
const UNEMPLOYMENT_BENEFIT_SLUG = "issizlik-maasi-hesaplama";
const CUSTOMS_DUTY_SLUG = "gumruk-vergisi-hesaplama";
const CONSTRUCTION_AREA_SLUG = "insaat-alani-hesaplama";
const STAIR_CALCULATOR_SLUG = "merdiven-hesaplama";
const TYT_2026_EXAM_DATE = new Date(2026, 5, 20);
const CREDIT_CARD_SESSION_STORAGE_KEY = "kkgf-inputs";
const TYT_FORM_STORAGE_KEY = "tyt-form-2026";
const CREDIT_CARD_RATE_CAPS = {
    akdiFaiz: 4.25,
    gecikmeFaiz: 4.55,
};
const UNEMPLOYMENT_BENEFIT_TAVAN = 26424;
const UNEMPLOYMENT_BENEFIT_TABAN = 13111.72;
const UNEMPLOYMENT_STAMP_TAX_RATE = 0.00759;
const UNEMPLOYMENT_BENEFIT_DURATIONS: Record<number, number> = {
    600: 6,
    900: 8,
    1080: 10,
};
const CREDIT_CARD_BANKS = [
    "Garanti",
    "Yapı Kredi",
    "İş Bankası",
    "Akbank",
    "Ziraat",
    "Halkbank",
    "Diğer",
];
const CONSTRUCTION_AREA_PRESETS = [
    { id: "detached", label: "🏘 Müstakil Konut", taks: 0.30, kaks: 0.90 },
    { id: "apartment", label: "🏢 Apartman", taks: 0.35, kaks: 2.50 },
    { id: "commercial", label: "🏪 Ticari", taks: 0.40, kaks: 3.00 },
    { id: "rural", label: "🌿 Kırsal", taks: 0.20, kaks: 0.40 },
] as const;
const CONSTRUCTION_AREA_CUSTOM_PRESET_ID = "custom";
const CONSTRUCTION_AREA_PRESET_NOTE = "Tipik değerler — gerçek imar için belediyenize danışın";

type ConstructionAreaPresetId =
    | typeof CONSTRUCTION_AREA_PRESETS[number]["id"]
    | typeof CONSTRUCTION_AREA_CUSTOM_PRESET_ID;

const TYT_PAIR_CONFIGS = [
    { correctId: "turk_d", wrongId: "turk_y", maxQuestionCount: 40 },
    { correctId: "sos_d", wrongId: "sos_y", maxQuestionCount: 20 },
    { correctId: "mat_d", wrongId: "mat_y", maxQuestionCount: 40 },
    { correctId: "fen_d", wrongId: "fen_y", maxQuestionCount: 20 },
];

const TYT_STORAGE_FIELD_IDS = [
    "sinav_yili",
    "turk_d",
    "turk_y",
    "sos_d",
    "sos_y",
    "mat_d",
    "mat_y",
    "fen_d",
    "fen_y",
    "obp_input",
    "obp_kesinti",
    "obp_ek_puan",
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const TURKISH_DATE_FORMATTER = new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

function toDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getTodayDateInputValue() {
    return toDateInputValue(new Date(Date.now()));
}

function shiftDateInputValue(dateInputValue: string, dayOffset: number) {
    const parsed = parseDateInputParts(dateInputValue);
    if (!parsed) {
        return "";
    }

    const date = new Date(parsed.year, parsed.monthIndex, parsed.day);
    date.setDate(date.getDate() + dayOffset);

    return toDateInputValue(date);
}

function parseDateInputParts(value: any) {
    if (typeof value !== "string") {
        return null;
    }

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, monthIndex, day);

    if (
        date.getFullYear() !== year
        || date.getMonth() !== monthIndex
        || date.getDate() !== day
    ) {
        return null;
    }

    return { year, monthIndex, day };
}

function dateInputToDayNumber(value: any) {
    const parsed = parseDateInputParts(value);
    if (!parsed) {
        return null;
    }

    return Math.floor(Date.UTC(parsed.year, parsed.monthIndex, parsed.day) / DAY_IN_MS);
}

function getCalendarDayDifference(startDateInput: any, endDateInput: any) {
    const startDay = dateInputToDayNumber(startDateInput);
    const endDay = dateInputToDayNumber(endDateInput);

    if (startDay === null || endDay === null) {
        return null;
    }

    return Math.max(0, endDay - startDay);
}

function formatTurkishDate(value: any) {
    const parsed = parseDateInputParts(value);
    if (!parsed) {
        return "";
    }

    return TURKISH_DATE_FORMATTER.format(
        new Date(parsed.year, parsed.monthIndex, parsed.day)
    );
}

function startOfLocalDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getTytDaysLeft(today = new Date()) {
    const todayStart = startOfLocalDay(today);
    const examStart = startOfLocalDay(TYT_2026_EXAM_DATE);
    return Math.ceil((examStart.getTime() - todayStart.getTime()) / DAY_IN_MS);
}

function TytExamCountdownBanner({ lang }: { lang: LanguageCode }) {
    const [today, setToday] = useState<Date | null>(null);

    useEffect(() => {
        const updateToday = () => setToday(new Date());
        updateToday();

        const interval = window.setInterval(updateToday, 60 * 60 * 1000);
        return () => window.clearInterval(interval);
    }, []);

    if (!today) {
        return null;
    }

    const todayStart = startOfLocalDay(today);
    const examStart = startOfLocalDay(TYT_2026_EXAM_DATE);
    const daysLeft = getTytDaysLeft(today);

    if (daysLeft < 0) {
        return null;
    }

    const todayLabel = TURKISH_DATE_FORMATTER.format(todayStart);
    const examLabel = TURKISH_DATE_FORMATTER.format(examStart);

    return (
        <section className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-blue-950">
                    <span>TYT 2026: {examLabel}</span>
                    <span className="text-blue-700">
                        {lang === "tr" ? "Bugün" : "Today"}: {todayLabel}
                    </span>
                </div>
                <p className="text-base font-black text-blue-700 sm:text-lg">
                    {lang === "tr"
                        ? `📅 TYT'ye ${daysLeft.toLocaleString("tr-TR")} gün kaldı`
                        : `📅 ${daysLeft.toLocaleString("en-US")} days until TYT`}
                </p>
            </div>
        </section>
    );
}

function CustomsDutyResultExtras({
    values,
    results,
    lang,
}: {
    values: Record<string, any>;
    results: Record<string, any>;
    lang: LanguageCode;
}) {
    const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
    const total = Number(results.total) || 0;
    const extraRate = Number(results.extraRate) || 0;
    const formatter = new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    });

    const buildShareUrl = () => {
        if (typeof window === "undefined") return "";

        const params = new URLSearchParams();
        params.set("fiyat", String(Number(values.itemPrice) || 0));
        params.set("kategori", String(values.category || "diger_elektronik"));
        params.set("doviz", String(values.currency || "TRY"));
        params.set("kur", String(Number(values.exchangeRate) || 1));

        if (Number(values.shippingCost) > 0) {
            params.set("kargo", String(Number(values.shippingCost)));
        }

        if (Number(values.insuranceCost) > 0) {
            params.set("sigorta", String(Number(values.insuranceCost)));
        }

        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    };

    const handleShareCalculation = async () => {
        const shareUrl = buildShareUrl();
        if (!shareUrl) return;

        window.history.replaceState(null, "", shareUrl);

        try {
            const canNativeShare = "share" in navigator && typeof navigator.share === "function";

            if (canNativeShare) {
                await navigator.share({
                    title: lang === "tr" ? "Gümrük vergisi hesaplamam" : "My customs duty calculation",
                    text: lang === "tr"
                        ? `Tahmini toplam maliyet: ${formatter.format(total)}`
                        : `Estimated total cost: ${formatter.format(total)}`,
                    url: shareUrl,
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
            }

            setShareStatus("copied");
            trackEvent("calculator_result_share", {
                calculator_slug: CUSTOMS_DUTY_SLUG,
                locale: lang,
                method: canNativeShare ? "native_share" : "clipboard",
            });
        } catch {
            setShareStatus("error");
        }
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                <p className="font-black">Bu ürünü sipariş etmeden önce bilmeniz gerekenler</p>
                <p className="mt-2">
                    Bu sonuç resmi tahakkuk değil, ön hesaplamadır. GTİP kodu, ürünün posta/hızlı kargo ile getirilebilir olup olmadığı,
                    kargo firmasının hizmet bedeli ve gümrük idaresinin kıymet kontrolü nihai tutarı değiştirebilir.
                </p>
                {extraRate > 0 && (
                    <p className="mt-2 font-bold">
                        Bu senaryoda CIF değer üzerine yaklaşık %{extraRate.toLocaleString("tr-TR", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        })} ek yük oluşuyor.
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={handleShareCalculation}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#FFD7C7] bg-[#FFF3EE] px-4 py-3 text-sm font-black text-[#CC4A1A] shadow-sm transition-colors hover:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
            >
                {shareStatus === "copied" ? (
                    <CheckCircle2 size={18} aria-hidden="true" />
                ) : (
                    <Share2 size={18} aria-hidden="true" />
                )}
                {shareStatus === "copied"
                    ? "Hesaplama linki hazır"
                    : shareStatus === "error"
                        ? "Link oluşturulamadı"
                        : "Hesaplamayı Paylaş"}
            </button>
        </div>
    );
}

type TcmbFxStatus = "idle" | "loading" | "live" | "manual";
type EurobondCurrency = "USD" | "EUR";

type SpecialCalculatorSlug =
    | "yks-puan-hesaplama"
    | "ales-puan-hesaplama"
    | "mevduat-faiz-hesaplama"
    | "kira-mi-konut-kredisi-mi-hesaplama"
    | "kredi-karsilastirma-hesaplama"
    | "borc-kapatma-planlayici-hesaplama"
    | "sermaye-ve-temettu-hesaplama"
    | "portfoy-dagilimi-hesaplama"
    | "altin-hesaplama"
    | "doviz-hesaplama"
    | "gecmis-altin-fiyatlari"
    | "kac-gun-oldu-hesaplama"
    | "dogum-izni-hesaplama"
    | "cimento-hesaplama"
    | "yakit-tuketim-maliyet"
    | "bilesik-buyume-hesaplama"
    | "bebek-boyu-hesaplama"
    | "test-basari-orani"
    | "yukselen-burc-hesaplama";

const specialCalculatorComponents = {
    "yks-puan-hesaplama": YksCalculator,
    "ales-puan-hesaplama": AlesCalculator,
    "mevduat-faiz-hesaplama": DepositInterestCalculator,
    "kira-mi-konut-kredisi-mi-hesaplama": RentVsBuyCalculator,
    "kredi-karsilastirma-hesaplama": LoanComparisonCalculator,
    "borc-kapatma-planlayici-hesaplama": DebtPayoffPlannerCalculator,
    "sermaye-ve-temettu-hesaplama": DividendPortfolioCalculator,
    "portfoy-dagilimi-hesaplama": PortfolioAllocationCalculator,
    "altin-hesaplama": AltinHesaplamaCalculator,
    "doviz-hesaplama": DovizHesaplamaCalculator,
    "gecmis-altin-fiyatlari": GecmisAltinFiyatlariCalculator,
    "kac-gun-oldu-hesaplama": KacGunOlduCalculator,
    "dogum-izni-hesaplama": MaternityLeaveCalculator,
    "cimento-hesaplama": CementCalculator,
    "yakit-tuketim-maliyet": FuelCostCalculator,
    "bilesik-buyume-hesaplama": CagrCalculator,
    "bebek-boyu-hesaplama": BabyHeightCalculator,
    "test-basari-orani": TestSuccessRateCalculator,
    "yukselen-burc-hesaplama": YukselenBurcCalculator,
} satisfies Record<
    SpecialCalculatorSlug,
    React.ComponentType<{
        lang: LanguageCode;
        initialValues?: Record<string, string | number>;
    }>
>;

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
    if (calculator.slug === CREDIT_CARD_LATE_INTEREST_SLUG) {
        initial.bankName = overrides?.bankName ?? "Diğer";
    }
    if (calculator.slug === EUROBOND_SLUG) {
        initial.eurobondCurrency = overrides?.eurobondCurrency ?? "USD";
    }
    if (calculator.slug === TAX_DELAY_INTEREST_SLUG) {
        const paymentDate = String(overrides?.taxPaymentDate ?? getTodayDateInputValue());
        const delayDays = Math.max(0, Number.parseFloat(String(initial.delayDays)) || 0);
        const dueDate = String(
            overrides?.taxDueDate
            ?? shiftDateInputValue(paymentDate, -delayDays)
            ?? ""
        );

        initial.taxDueDate = dueDate;
        initial.taxPaymentDateMode = overrides?.taxPaymentDateMode ?? "today";
        initial.taxPaymentDate = paymentDate;
        initial.taxDelayManualMode = overrides?.taxDelayManualMode ?? false;
        initial.taxPartialPayment = overrides?.taxPartialPayment ?? 0;
    }
    return initial;
}

function sanitizeCalculationResult(raw: Record<string, any>) {
    return sanitizeFiniteValue(raw) as Record<string, any>;
}

type CalculatorValuesAction =
    | { type: "change"; id: string; value: any }
    | { type: "patch"; values: Record<string, any> }
    | { type: "reset"; values: Record<string, any> };

function calculatorValuesReducer(
    state: Record<string, any>,
    action: CalculatorValuesAction
) {
    switch (action.type) {
        case "change":
            return { ...state, [action.id]: action.value };
        case "patch":
            return { ...state, ...action.values };
        case "reset":
            return action.values;
        default:
            return state;
    }
}

function readNumber(value: any) {
    return Math.max(0, toFiniteNumber(value, 0));
}

function readRawNumber(value: any) {
    return toFiniteNumber(value, 0);
}

function formatSquareMeter(value: number, lang: LanguageCode) {
    return `${value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        maximumFractionDigits: 2,
    })} m²`;
}

function formatPercent(value: number, lang: LanguageCode) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        maximumFractionDigits: 1,
    });
}

function formatFixedNumber(value: number, lang: LanguageCode) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function ConstructionAreaValidationMessages({ values }: { values: Record<string, any> }) {
    const messages = useMemo(() => {
        const plotArea = readRawNumber(values.plotArea);
        const taks = readRawNumber(values.taks);
        const kaks = readRawNumber(values.kaks);
        const nextMessages: string[] = [];

        if (plotArea < 0) {
            nextMessages.push("Geçerli alan girin");
        }
        if (taks > 0.8) {
            nextMessages.push("Çoğu imar planında TAKS 0.8'i aşmaz");
        }
        if (kaks < taks) {
            nextMessages.push("KAKS genellikle TAKS'tan büyük olur");
        }

        return nextMessages;
    }, [values]);

    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 space-y-2">
            {messages.map((message) => (
                <div
                    key={message}
                    className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold leading-5 text-amber-900"
                >
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{message}</span>
                </div>
            ))}
        </div>
    );
}

function ConstructionAreaPresetButtons({
    selectedPreset,
    onSelect,
}: {
    selectedPreset: ConstructionAreaPresetId;
    onSelect: (presetId: ConstructionAreaPresetId) => void;
}) {
    const options = useMemo<Array<{ id: ConstructionAreaPresetId; label: string; description: string }>>(
        () => [
            ...CONSTRUCTION_AREA_PRESETS.map((preset) => ({
                ...preset,
                description: CONSTRUCTION_AREA_PRESET_NOTE,
            })),
            {
                id: CONSTRUCTION_AREA_CUSTOM_PRESET_ID,
                label: "Özel Değer",
                description: "Manuel TAKS/KAKS girişi",
            },
        ],
        []
    );

    return (
        <section className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {options.map((option) => {
                    const isActive = selectedPreset === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onSelect(option.id)}
                            aria-pressed={isActive}
                            className={`min-h-[108px] rounded-lg border px-3 py-3 text-left shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-200 ${isActive
                                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                        >
                            <span className="block break-words text-sm font-black leading-5">{option.label}</span>
                            <span className={`mt-2 block break-words text-xs font-medium leading-5 ${isActive ? "text-blue-50" : "text-slate-500"}`}>
                                {option.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function ConstructionAreaResultPanel({
    values,
    lang,
}: {
    values: Record<string, any>;
    lang: LanguageCode;
}) {
    const summary = useMemo(() => {
        const plotArea = Math.max(0, readRawNumber(values.plotArea));
        const taks = readRawNumber(values.taks);
        const kaks = readRawNumber(values.kaks);
        const footprintArea = plotArea * Math.max(0, taks);
        const totalArea = plotArea * Math.max(0, kaks);
        const estimatedFloors = taks > 0 ? Math.floor(kaks / taks) : 0;

        return {
            plotArea,
            footprintArea,
            totalArea,
            estimatedFloors: Math.max(0, estimatedFloors),
        };
    }, [values]);

    const cards = [
        {
            label: "Taban Alanı",
            value: formatSquareMeter(summary.footprintArea, lang),
            formula: "(arsa × TAKS)",
        },
        {
            label: "Toplam Alan",
            value: formatSquareMeter(summary.totalArea, lang),
            formula: "(arsa × KAKS)",
        },
        {
            label: "Tahmini Kat",
            value: `${summary.estimatedFloors.toLocaleString(lang === "tr" ? "tr-TR" : "en-US")} kat`,
            formula: "(toplam/taban)",
            note: "Yaklaşık değer — mimari kararlar değiştirebilir",
        },
    ];

    return (
        <section className="rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-sm sm:p-6">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                Sonuçlar
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
                {cards.map((card) => (
                    <article
                        key={card.label}
                        className="flex min-h-[150px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm"
                    >
                        <div>
                            <p className="text-sm font-bold text-slate-600">{card.label}</p>
                            <p className="mt-3 break-words text-2xl font-black tabular-nums text-slate-950">
                                {card.value}
                            </p>
                            <p className="mt-2 text-xs font-semibold text-slate-500">{card.formula}</p>
                        </div>
                        {card.note && (
                            <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-medium leading-5 text-slate-500">
                                {card.note}
                            </p>
                        )}
                    </article>
                ))}
            </div>
            <ConstructionAreaDiagram
                plotArea={summary.plotArea}
                footprintArea={summary.footprintArea}
                totalArea={summary.totalArea}
                estimatedFloors={summary.estimatedFloors}
                lang={lang}
            />
        </section>
    );
}

function StairCalculatorResultPanel({
    results,
    lang,
}: {
    results: Record<string, any>;
    lang: LanguageCode;
}) {
    const summary = useMemo(() => {
        const riserCount = readRawNumber(results.riserCount);
        const actualRiserCm = readRawNumber(results.actualRiserCm);
        const runLengthM = readRawNumber(results.runLengthM);
        const comfortValueCm = readRawNumber(results.comfortValueCm);
        const warnings = Array.isArray(results.regulationWarnings)
            ? results.regulationWarnings.filter((warning): warning is string => typeof warning === "string")
            : [];
        const comfortStatus = comfortValueCm >= 60 && comfortValueCm <= 64
            ? {
                icon: "✅",
                label: "Konfor bandında",
                cardClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
                valueClass: "text-emerald-800",
                noteClass: "text-emerald-700",
            }
            : (comfortValueCm >= 57 && comfortValueCm <= 59) || (comfortValueCm >= 65 && comfortValueCm <= 67)
                ? {
                    icon: "⚠️",
                    label: "Kabul edilebilir",
                    cardClass: "border-amber-200 bg-amber-50 text-amber-950",
                    valueClass: "text-amber-800",
                    noteClass: "text-amber-700",
                }
                : {
                    icon: "❌",
                    label: "Konfor dışı",
                    cardClass: "border-red-200 bg-red-50 text-red-950",
                    valueClass: "text-red-800",
                    noteClass: "text-red-700",
                };

        return {
            riserCount,
            actualRiserCm,
            runLengthM,
            comfortValueCm,
            treadDepthCm: Math.max(0, comfortValueCm - (2 * actualRiserCm)),
            floorHeightCm: Math.max(0, riserCount * actualRiserCm),
            cards: [
                {
                    label: "Rıht Sayısı",
                    value: `${formatFixedNumber(riserCount, lang)} adet`,
                    className: "border-slate-200 bg-white text-slate-950",
                    valueClassName: "text-slate-950",
                },
                {
                    label: "Gerçek Rıht",
                    value: `${formatFixedNumber(actualRiserCm, lang)} cm`,
                    className: "border-slate-200 bg-white text-slate-950",
                    valueClassName: "text-slate-950",
                },
                {
                    label: "Kol Boyu",
                    value: `${formatFixedNumber(runLengthM, lang)} m`,
                    className: "border-slate-200 bg-white text-slate-950",
                    valueClassName: "text-slate-950",
                },
                {
                    label: "Konfor Değeri",
                    value: `${formatFixedNumber(comfortValueCm, lang)} cm ${comfortStatus.icon}`,
                    note: `${comfortStatus.icon} ${comfortStatus.label}`,
                    className: comfortStatus.cardClass,
                    valueClassName: comfortStatus.valueClass,
                    noteClassName: comfortStatus.noteClass,
                },
            ],
            warnings,
        };
    }, [lang, results]);

    return (
        <section className="rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-sm sm:p-6">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                Sonuçlar
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {summary.cards.map((card) => (
                    <article
                        key={card.label}
                        className={`flex min-h-[132px] flex-col justify-center rounded-lg border p-4 text-center shadow-sm ${card.className}`}
                    >
                        <p className="text-sm font-bold text-slate-600">{card.label}</p>
                        <p className={`mt-3 break-words text-2xl font-black tabular-nums leading-tight ${card.valueClassName}`}>
                            {card.value}
                        </p>
                        {card.note && (
                            <p className={`mt-3 text-xs font-black leading-5 ${card.noteClassName}`}>
                                {card.note}
                            </p>
                        )}
                    </article>
                ))}
            </div>
            <StairSectionDiagram
                riserCount={summary.riserCount}
                actualRiserCm={summary.actualRiserCm}
                treadDepthCm={summary.treadDepthCm}
                runLengthM={summary.runLengthM}
                floorHeightCm={summary.floorHeightCm}
                lang={lang}
            />
            {summary.warnings.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="mb-2 text-sm font-black text-amber-950">Yönetmelik uyarıları</p>
                    <ul className="space-y-2 text-sm font-semibold leading-5 text-amber-900">
                        {summary.warnings.map((warning) => (
                            <li key={warning}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

function StairSectionDiagram({
    riserCount,
    actualRiserCm,
    treadDepthCm,
    runLengthM,
    floorHeightCm,
    lang,
}: {
    riserCount: number;
    actualRiserCm: number;
    treadDepthCm: number;
    runLengthM: number;
    floorHeightCm: number;
    lang: LanguageCode;
}) {
    const diagram = useMemo(() => {
        const safeRiserCount = Math.max(1, Math.round(riserCount));
        const visibleRiserCount = Math.min(safeRiserCount, 20);
        const runLengthCm = Math.max(1, runLengthM * 100);
        const safeFloorHeightCm = Math.max(1, floorHeightCm);
        const maxWidth = 330;
        const maxHeight = 160;
        const scale = Math.min(maxWidth / runLengthCm, maxHeight / safeFloorHeightCm);
        const scaledRun = Math.max(46, runLengthCm * scale);
        const scaledHeight = Math.max(58, safeFloorHeightCm * scale);
        const startX = 92;
        const baseY = 230;
        const topY = baseY - scaledHeight;
        const endX = startX + scaledRun;
        const hUnit = scaledRun / visibleRiserCount;
        const vUnit = scaledHeight / visibleRiserCount;
        const stepPath = Array.from({ length: visibleRiserCount }, (_, index) => {
            const nextX = startX + hUnit * (index + 1);
            const currentY = baseY - vUnit * index;
            const nextY = baseY - vUnit * (index + 1);

            return `H ${nextX.toFixed(2)} V ${nextY.toFixed(2)}`;
        }).join(" ");

        return {
            safeRiserCount,
            visibleRiserCount,
            isScaled: safeRiserCount > visibleRiserCount,
            startX,
            baseY,
            topY,
            endX,
            stepPath: `M ${startX} ${baseY} ${stepPath}`,
        };
    }, [floorHeightCm, riserCount, runLengthM]);

    const riserLabel = formatFixedNumber(actualRiserCm, lang);
    const treadLabel = formatFixedNumber(treadDepthCm, lang);
    const floorLabel = formatFixedNumber(floorHeightCm, lang);
    const runLabel = formatFixedNumber(runLengthM, lang);

    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <svg
                viewBox="0 0 500 300"
                role="img"
                aria-label="Merdiven kesit şeması"
                className="h-auto w-full"
            >
                <defs>
                    <marker
                        id="stair-arrow"
                        markerWidth="8"
                        markerHeight="8"
                        refX="4"
                        refY="4"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M 0 0 L 8 4 L 0 8 z" fill="#3B82F6" />
                    </marker>
                    <marker
                        id="stair-arrow-start"
                        markerWidth="8"
                        markerHeight="8"
                        refX="4"
                        refY="4"
                        orient="auto-start-reverse"
                        markerUnits="strokeWidth"
                    >
                        <path d="M 0 0 L 8 4 L 0 8 z" fill="#3B82F6" />
                    </marker>
                </defs>

                <rect x="0" y="0" width="500" height="300" rx="10" fill="#F8FAFC" />
                <path
                    d={`M ${diagram.startX} ${diagram.baseY} L ${diagram.endX} ${diagram.topY} L ${diagram.endX} ${diagram.baseY} Z`}
                    fill="#FFFFFF"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                />
                <line x1="35" y1={diagram.baseY} x2="465" y2={diagram.baseY} stroke="#94A3B8" strokeWidth="3" />
                <line x1={diagram.startX} y1={diagram.topY} x2="465" y2={diagram.topY} stroke="#94A3B8" strokeWidth="5" />
                <path d={diagram.stepPath} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

                <line
                    x1="58"
                    y1={diagram.baseY}
                    x2="58"
                    y2={diagram.topY}
                    stroke="#3B82F6"
                    strokeWidth="2"
                    markerStart="url(#stair-arrow-start)"
                    markerEnd="url(#stair-arrow)"
                />
                <text x="22" y={(diagram.baseY + diagram.topY) / 2} fill="#1E3A8A" fontSize="13" fontWeight="700" transform={`rotate(-90 22 ${(diagram.baseY + diagram.topY) / 2})`} textAnchor="middle">
                    Kat Yüksekliği: {floorLabel} cm
                </text>

                <line
                    x1={diagram.startX}
                    y1="262"
                    x2={diagram.endX}
                    y2="262"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    markerStart="url(#stair-arrow-start)"
                    markerEnd="url(#stair-arrow)"
                />
                <text x={(diagram.startX + diagram.endX) / 2} y="283" fill="#1E3A8A" fontSize="13" fontWeight="700" textAnchor="middle">
                    Kol Boyu: {runLabel} m
                </text>

                <g transform="translate(344 68)">
                    <rect x="0" y="0" width="120" height="94" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
                    <path d="M 22 68 H 82 V 28" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="16" y1="68" x2="16" y2="28" stroke="#3B82F6" strokeWidth="1.8" markerStart="url(#stair-arrow-start)" markerEnd="url(#stair-arrow)" />
                    <line x1="22" y1="78" x2="82" y2="78" stroke="#3B82F6" strokeWidth="1.8" markerStart="url(#stair-arrow-start)" markerEnd="url(#stair-arrow)" />
                    <text x="60" y="16" fill="#0F172A" fontSize="11" fontWeight="800" textAnchor="middle">Basamak detayı</text>
                    <text x="8" y="50" fill="#1E3A8A" fontSize="10" fontWeight="700" textAnchor="middle" transform="rotate(-90 8 50)">{riserLabel} cm</text>
                    <text x="52" y="91" fill="#1E3A8A" fontSize="10" fontWeight="700" textAnchor="middle">{treadLabel} cm</text>
                </g>

                {diagram.isScaled && (
                    <text x={diagram.endX} y={diagram.topY - 10} fill="#475569" fontSize="11" fontWeight="700" textAnchor="end">
                        {diagram.safeRiserCount} rıht, şemada 20 adımda ölçeklendi
                    </text>
                )}
            </svg>
            <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700 sm:grid-cols-3">
                <span>🟦 Rıht yüksekliği: {riserLabel} cm</span>
                <span>🟦 Basamak derinliği: {treadLabel} cm</span>
                <span>🟦 Toplam kat: {floorLabel} cm</span>
            </div>
        </div>
    );
}

function ConstructionAreaDiagram({
    plotArea,
    footprintArea,
    totalArea,
    estimatedFloors,
    lang,
}: {
    plotArea: number;
    footprintArea: number;
    totalArea: number;
    estimatedFloors: number;
    lang: LanguageCode;
}) {
    const diagram = useMemo(() => {
        const plotRect = { x: 28, y: 58, width: 176, height: 118 };
        const footprintRatio = plotArea > 0 ? Math.min(1, Math.max(0, footprintArea / plotArea)) : 0;
        const footprintScale = Math.sqrt(footprintRatio);
        const footprintWidth = Math.max(0, plotRect.width * footprintScale);
        const footprintHeight = Math.max(0, plotRect.height * footprintScale);
        const footprintRect = {
            x: plotRect.x + (plotRect.width - footprintWidth) / 2,
            y: plotRect.y + plotRect.height - footprintHeight,
            width: footprintWidth,
            height: footprintHeight,
        };
        const floors = Math.max(0, estimatedFloors);
        const visibleFloors = Math.min(Math.max(floors, 1), 5);
        const tower = { x: 252, y: 46, width: 100, height: 158 };
        const floorGap = 3;
        const floorHeight = (tower.height - floorGap * (visibleFloors - 1)) / visibleFloors;
        const floorArea = floors > 0 ? totalArea / floors : 0;

        return {
            plotRect,
            footprintRect,
            footprintRatio,
            floors,
            visibleFloors,
            tower,
            floorGap,
            floorHeight,
            floorArea,
        };
    }, [estimatedFloors, footprintArea, plotArea, totalArea]);

    const locale = lang === "tr" ? "tr-TR" : "en-US";
    const title = `Taban: ${formatSquareMeter(footprintArea, lang)} (arsanın %${formatPercent(diagram.footprintRatio * 100, lang)}'u)`;

    return (
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <svg
                viewBox="0 0 400 250"
                role="img"
                aria-labelledby="construction-area-diagram-title construction-area-diagram-desc"
                className="h-auto w-full"
            >
                <title id="construction-area-diagram-title">Arsa, taban alanı ve kat şeması</title>
                <desc id="construction-area-diagram-desc">
                    Gri alan arsa büyüklüğünü, mavi alan taban oturumunu, sağdaki bloklar tahmini katları gösterir.
                </desc>

                <rect x="0" y="0" width="400" height="250" rx="14" className="fill-slate-50" />

                <text x="28" y="34" className="fill-slate-700 text-[13px] font-bold">
                    Arsa
                </text>
                <text x="28" y="50" className="fill-slate-500 text-[11px] font-semibold">
                    {formatSquareMeter(plotArea, lang)}
                </text>
                <rect
                    x={diagram.plotRect.x}
                    y={diagram.plotRect.y}
                    width={diagram.plotRect.width}
                    height={diagram.plotRect.height}
                    rx="8"
                    className="fill-slate-200 stroke-slate-300"
                    strokeWidth="2"
                />
                <rect
                    x={diagram.footprintRect.x}
                    y={diagram.footprintRect.y}
                    width={diagram.footprintRect.width}
                    height={diagram.footprintRect.height}
                    rx="6"
                    className="fill-blue-400 stroke-blue-500"
                    strokeWidth="2"
                >
                    <title>{title}</title>
                </rect>
                {diagram.footprintRect.width > 54 && diagram.footprintRect.height > 30 && (
                    <>
                        <text
                            x={diagram.footprintRect.x + diagram.footprintRect.width / 2}
                            y={diagram.footprintRect.y + diagram.footprintRect.height / 2 - 4}
                            textAnchor="middle"
                            className="pointer-events-none fill-white text-[11px] font-black"
                        >
                            Taban
                        </text>
                        <text
                            x={diagram.footprintRect.x + diagram.footprintRect.width / 2}
                            y={diagram.footprintRect.y + diagram.footprintRect.height / 2 + 12}
                            textAnchor="middle"
                            className="pointer-events-none fill-white text-[10px] font-bold"
                        >
                            {formatSquareMeter(footprintArea, lang)}
                        </text>
                    </>
                )}

                <text x="252" y="24" className="fill-slate-700 text-[12px] font-bold">
                    Kat Gösterimi
                </text>
                <text x="252" y="40" className="fill-slate-500 text-[10px] font-semibold">
                    {diagram.floors.toLocaleString(locale)} kat
                </text>
                {Array.from({ length: diagram.visibleFloors }).map((_, index) => {
                    const y = diagram.tower.y + index * (diagram.floorHeight + diagram.floorGap);
                    const floorNumber = diagram.visibleFloors - index;
                    const label = `${formatSquareMeter(diagram.floorArea, lang)} / kat`;

                    return (
                        <g key={floorNumber}>
                            <rect
                                x={diagram.tower.x}
                                y={y}
                                width={diagram.tower.width}
                                height={diagram.floorHeight}
                                rx="5"
                                className={index === diagram.visibleFloors - 1 ? "fill-blue-400" : "fill-blue-200"}
                            />
                            <text
                                x={diagram.tower.x + diagram.tower.width / 2}
                                y={y + diagram.floorHeight / 2 - 3}
                                textAnchor="middle"
                                className="fill-slate-800 text-[9px] font-bold"
                            >
                                {floorNumber}. kat
                            </text>
                            <text
                                x={diagram.tower.x + diagram.tower.width / 2}
                                y={y + diagram.floorHeight / 2 + 11}
                                textAnchor="middle"
                                className="fill-slate-700 text-[8px] font-semibold"
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}
                {diagram.floors > diagram.visibleFloors && (
                    <text x="252" y="224" className="fill-slate-500 text-[10px] font-semibold">
                        +{(diagram.floors - diagram.visibleFloors).toLocaleString(locale)} kat daha
                    </text>
                )}

                <line x1="218" y1="118" x2="240" y2="118" className="stroke-slate-300" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="218" cy="118" r="3" className="fill-blue-400" />
                <circle cx="240" cy="118" r="3" className="fill-blue-200" />
            </svg>
        </div>
    );
}

type CreditCardLateInterestInputs = {
    ekstreBorcu: number;
    asgariOdeme: number;
    yeniHarcama: number;
    akdiFaiz: number;
    gecikmeOrani: number;
};

function getCreditCardLateInterestInputs(values: Record<string, any>) {
    return {
        ekstreBorcu: readNumber(values.statementAmount),
        asgariOdeme: readNumber(values.minRequired),
        yeniHarcama: readNumber(values.newSpending),
        akdiFaiz: readNumber(values.akdiFaiz),
        gecikmeOrani: readNumber(values.gecikmeFaiz),
    };
}

function calculateCreditCardLateInterestForPayment(
    inputs: CreditCardLateInterestInputs,
    odenenTutar: number
) {
    const {
        ekstreBorcu,
        asgariOdeme,
        yeniHarcama,
        akdiFaiz,
        gecikmeOrani,
    } = inputs;

    const asgariAcik = Math.max(0, asgariOdeme - odenenTutar);
    const gecikmeFaiziTutar = asgariAcik * gecikmeOrani / 100;
    const devredenBakiye = ekstreBorcu - odenenTutar;
    const akdiFaizTutar = Math.max(0, devredenBakiye - asgariAcik) * akdiFaiz / 100;
    const toplamFaiz = gecikmeFaiziTutar + akdiFaizTutar;
    const vergiler = toplamFaiz * 0.16;
    const sonrakiEkstreTahmini = devredenBakiye + toplamFaiz + vergiler + yeniHarcama;

    return {
        asgariAcik,
        gecikmeFaiziTutar,
        devredenBakiye,
        akdiFaizTutar,
        toplamFaiz,
        vergiler,
        sonrakiEkstreTahmini,
    };
}

function calculateCreditCardLateInterest(values: Record<string, any>) {
    return calculateCreditCardLateInterestForPayment(
        getCreditCardLateInterestInputs(values),
        readNumber(values.paidAmount)
    );
}

function calculateCreditCardScenarioComparison(values: Record<string, any>) {
    const inputs = getCreditCardLateInterestInputs(values);
    const noPaymentInterest = inputs.ekstreBorcu * inputs.gecikmeOrani / 100;
    const noPaymentTax = noPaymentInterest * 0.16;
    const noPaymentNextDebt = inputs.ekstreBorcu + noPaymentInterest + noPaymentTax + inputs.yeniHarcama;
    const minimumPayment = calculateCreditCardLateInterestForPayment(inputs, inputs.asgariOdeme);
    const fullPaymentNextDebt = inputs.yeniHarcama;
    const fullPaymentSavings = Math.max(
        0,
        minimumPayment.gecikmeFaiziTutar + minimumPayment.akdiFaizTutar + minimumPayment.vergiler
    );

    return {
        noPayment: {
            gecikmeFaiziTutar: noPaymentInterest,
            vergiler: noPaymentTax,
            sonrakiEkstreTahmini: noPaymentNextDebt,
        },
        minimumPayment,
        fullPayment: {
            faiz: 0,
            vergiler: 0,
            sonrakiEkstreTahmini: fullPaymentNextDebt,
        },
        fullPaymentSavings,
    };
}

function calculateCreditCardProjection(values: Record<string, any>) {
    const inputs = getCreditCardLateInterestInputs(values);
    const monthlyPayment = readNumber(values.paidAmount);
    const projection: Array<{ month: string; monthNumber: number; remainingDebt: number; isClosed: boolean }> = [];
    let remainingDebt = inputs.ekstreBorcu;
    let closingMonth: number | null = null;

    for (let month = 1; month <= 12; month += 1) {
        if (remainingDebt <= 0) {
            projection.push({
                month: `Ay ${month}`,
                monthNumber: month,
                remainingDebt: 0,
                isClosed: false,
            });
            continue;
        }

        const monthlyResult = calculateCreditCardLateInterestForPayment(
            {
                ...inputs,
                ekstreBorcu: remainingDebt,
                asgariOdeme: Math.min(inputs.asgariOdeme, remainingDebt),
                yeniHarcama: 0,
            },
            monthlyPayment
        );
        remainingDebt = Math.max(0, monthlyResult.sonrakiEkstreTahmini);

        if (remainingDebt === 0 && closingMonth === null) {
            closingMonth = month;
        }

        projection.push({
            month: `Ay ${month}`,
            monthNumber: month,
            remainingDebt,
            isClosed: closingMonth === month,
        });
    }

    return {
        projection,
        closingMonth,
        closingPoint: closingMonth
            ? projection.find((item) => item.monthNumber === closingMonth) ?? null
            : null,
    };
}

function ScenarioMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 border-b border-slate-200/70 pb-2 last:border-b-0 last:pb-0">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="break-words text-left text-base font-semibold text-slate-950 [font-variant-numeric:tabular-nums]">
                {value}
            </div>
        </div>
    );
}

function ScenarioComparisonGrid({ values }: { values: Record<string, any> }) {
    const scenarios = useMemo(() => calculateCreditCardScenarioComparison(values), [values]);

    return (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-300 sm:col-span-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-lg font-black tracking-tight text-slate-950">
                    Senaryo Karşılaştırması
                </h3>
                <p className="text-sm font-medium text-slate-500">
                    Mevcut tutarlar ile anlık karşılaştırma
                </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex w-full flex-col rounded-xl border border-red-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-red-300 hover:shadow-md">
                    <p className="text-sm font-bold text-red-700">Senaryo A</p>
                    <h4 className="mt-1 text-base font-black text-slate-950">Hiç ödeme yapmasam</h4>
                    <div className="mt-4 space-y-2 text-sm">
                        <ScenarioMetric label="Gecikme faizi" value={formatTry(scenarios.noPayment.gecikmeFaiziTutar)} />
                        <ScenarioMetric label="Vergi" value={formatTry(scenarios.noPayment.vergiler)} />
                        <ScenarioMetric label="Sonraki ay toplam borç" value={formatTry(scenarios.noPayment.sonrakiEkstreTahmini)} />
                    </div>
                </div>

                <div className="flex w-full flex-col rounded-xl border border-yellow-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-yellow-300 hover:shadow-md">
                    <p className="text-sm font-bold text-yellow-700">Senaryo B</p>
                    <h4 className="mt-1 text-base font-black text-slate-950">Sadece asgari ödersem</h4>
                    <div className="mt-4 space-y-2 text-sm">
                        <ScenarioMetric label="Gecikme faizi" value={formatTry(scenarios.minimumPayment.gecikmeFaiziTutar)} />
                        <ScenarioMetric label="Akdi faiz" value={formatTry(scenarios.minimumPayment.akdiFaizTutar)} />
                        <ScenarioMetric label="Vergi" value={formatTry(scenarios.minimumPayment.vergiler)} />
                        <ScenarioMetric label="Sonraki ay toplam borç" value={formatTry(scenarios.minimumPayment.sonrakiEkstreTahmini)} />
                    </div>
                </div>

                <div className="flex w-full flex-col rounded-xl border border-emerald-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-md">
                    <p className="text-sm font-bold text-emerald-700">Senaryo C</p>
                    <h4 className="mt-1 text-base font-black text-slate-950">Tamamını ödesem</h4>
                    <div className="mt-4 space-y-2 text-sm">
                        <ScenarioMetric label="Faiz" value={formatTry(scenarios.fullPayment.faiz)} />
                        <ScenarioMetric label="Vergi" value={formatTry(scenarios.fullPayment.vergiler)} />
                        <ScenarioMetric label="Sonraki ay" value={formatTry(scenarios.fullPayment.sonrakiEkstreTahmini)} />
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-black text-blue-900 transition-all duration-300">
                Tam ödeme yaparak {formatTry(scenarios.fullPaymentSavings)} tasarruf ederdiniz
            </div>
        </div>
    );
}

function ProjectionTooltip({ active, payload, label }: any) {
    if (!active || !Array.isArray(payload) || payload.length === 0) {
        return null;
    }

    const value = Number(payload[0]?.value) || 0;
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
            <p className="font-bold text-slate-900">{label}</p>
            <p className="mt-1 text-slate-600">Kalan borç: {formatTry(value)}</p>
        </div>
    );
}

function CreditCardProjectionChart({ values }: { values: Record<string, any> }) {
    const { projection, closingMonth, closingPoint } = useMemo(
        () => calculateCreditCardProjection(values),
        [values]
    );

    return (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 sm:col-span-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-lg font-black tracking-tight text-slate-950">
                    12 Aylık Borç Projeksiyonu
                </h3>
                <p className="text-sm font-medium text-slate-500">
                    Her ay aynı ödeme tutarı varsayımıyla
                </p>
            </div>

            <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projection} margin={{ top: 16, right: 18, bottom: 8, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#475569", fontSize: 12 }}
                            axisLine={{ stroke: "#cbd5e1" }}
                            tickLine={{ stroke: "#cbd5e1" }}
                        />
                        <YAxis
                            width={82}
                            tick={{ fill: "#475569", fontSize: 12 }}
                            axisLine={{ stroke: "#cbd5e1" }}
                            tickLine={{ stroke: "#cbd5e1" }}
                            tickFormatter={(value) => Number(value).toLocaleString("tr-TR")}
                        />
                        <Tooltip content={<ProjectionTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="remainingDebt"
                            name="Kalan borç"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#2563eb" }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: "#2563eb", stroke: "#bfdbfe" }}
                        />
                        {closingPoint && (
                            <ReferenceDot
                                x={closingPoint.month}
                                y={closingPoint.remainingDebt}
                                r={7}
                                fill="#16a34a"
                                stroke="#bbf7d0"
                                strokeWidth={3}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm font-black transition-all duration-300 ${closingMonth
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800"
                    }`}
            >
                {closingMonth
                    ? `Borcunuz ${closingMonth}. ayda kapanıyor`
                    : "Bu ödeme planıyla borç kapanmıyor"}
            </div>
        </div>
    );
}

function formatTry(value: number) {
    return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatUnemploymentTl(value: number) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} TL`;
}

function UnemploymentBenefitResultPanel({
    values,
    lang,
}: {
    values: Record<string, any>;
    lang: LanguageCode;
}) {
    const summary = useMemo(() => {
        const ortalamaGelir = readNumber(values.brutMaas);
        const hesaplananBrutOdenek = ortalamaGelir * 0.40;
        const brutOdenek = Math.min(hesaplananBrutOdenek, UNEMPLOYMENT_BENEFIT_TAVAN);
        const damgaVergisi = brutOdenek * UNEMPLOYMENT_STAMP_TAX_RATE;
        const netOdenek = brutOdenek - damgaVergisi;
        const primGunu = Number(values.primGunu) || 0;
        const sure = UNEMPLOYMENT_BENEFIT_DURATIONS[primGunu] ?? 0;
        const toplamOdeme = netOdenek * sure;
        const status = hesaplananBrutOdenek > UNEMPLOYMENT_BENEFIT_TAVAN
            ? {
                value: `⚠ ${lang === "tr" ? "Tavan uygulandı" : "Ceiling applied"}: ${formatUnemploymentTl(UNEMPLOYMENT_BENEFIT_TAVAN)}`,
                className: "border-amber-200 bg-amber-50",
                labelClassName: "text-amber-800",
                valueClassName: "text-amber-950",
            }
            : netOdenek > 0 && netOdenek < UNEMPLOYMENT_BENEFIT_TABAN
                ? {
                    value: `ℹ ${lang === "tr" ? "Taban güvencesi" : "Floor assurance"}: ${formatUnemploymentTl(UNEMPLOYMENT_BENEFIT_TABAN)}`,
                    className: "border-blue-200 bg-blue-50",
                    labelClassName: "text-blue-700",
                    valueClassName: "text-blue-950",
                }
                : {
                    value: lang === "tr" ? "✅ Tavan uygulanmıyor" : "✅ Ceiling not applied",
                    className: "border-emerald-200 bg-emerald-50",
                    labelClassName: "text-emerald-700",
                    valueClassName: "text-emerald-950",
                };

        return {
            brutOdenek,
            damgaVergisi,
            netOdenek,
            sure,
            toplamOdeme,
            status,
        };
    }, [lang, values.brutMaas, values.primGunu]);

    const cards = [
        {
            label: lang === "tr" ? "Brüt Ödenek" : "Gross Benefit",
            value: formatUnemploymentTl(summary.brutOdenek),
            className: "border-slate-200 bg-white",
            labelClassName: "text-slate-600",
            valueClassName: "text-slate-950",
        },
        {
            label: lang === "tr" ? "Damga Vergisi" : "Stamp Tax",
            value: formatUnemploymentTl(summary.damgaVergisi),
            className: "border-slate-200 bg-white",
            labelClassName: "text-slate-600",
            valueClassName: "text-slate-950",
        },
        {
            label: lang === "tr" ? "Net Ödenek" : "Net Benefit",
            value: formatUnemploymentTl(summary.netOdenek),
            className: "border-slate-200 bg-white",
            labelClassName: "text-slate-600",
            valueClassName: "text-[#CC4A1A]",
        },
        {
            label: lang === "tr" ? "Alım Süresi" : "Benefit Duration",
            value: `${summary.sure.toLocaleString("tr-TR")} ${lang === "tr" ? "ay" : "mo"}`,
            className: "border-slate-200 bg-white",
            labelClassName: "text-slate-600",
            valueClassName: "text-slate-950",
        },
        {
            label: lang === "tr" ? "Toplam Alım" : "Total Benefit",
            value: formatUnemploymentTl(summary.toplamOdeme),
            className: "border-slate-200 bg-white",
            labelClassName: "text-slate-600",
            valueClassName: "text-slate-950",
        },
        {
            label: lang === "tr" ? "Tavan Durumu" : "Ceiling Status",
            value: summary.status.value,
            className: summary.status.className,
            labelClassName: summary.status.labelClassName,
            valueClassName: summary.status.valueClassName,
        },
    ];

    return (
        <section className="rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-sm sm:p-6" aria-live="polite">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                {lang === "tr" ? "Sonuçlar" : "Results"}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <article
                        key={card.label}
                        className={`flex min-h-[132px] flex-col justify-center rounded-lg border p-4 text-center shadow-sm transition-colors ${card.className}`}
                    >
                        <p className={`text-sm font-bold ${card.labelClassName}`}>
                            {card.label}
                        </p>
                        <p className={`mt-3 break-words text-xl font-black leading-tight tabular-nums sm:text-2xl ${card.valueClassName}`}>
                            {card.value}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

type UnemploymentEligibilityKey = "last120Days" | "has600PremiumDays" | "notVoluntaryExit";

const UNEMPLOYMENT_ELIGIBILITY_CONDITIONS: Array<{
    id: UnemploymentEligibilityKey;
    label: Record<LanguageCode, string>;
    missingReason: Record<LanguageCode, string>;
}> = [
    {
        id: "last120Days",
        label: {
            tr: "Son 120 gün kesintisiz çalıştım",
            en: "I worked continuously for the last 120 days",
        },
        missingReason: {
            tr: "Son 120 gün kesintisiz çalışma şartı",
            en: "the last 120 days continuous work condition",
        },
    },
    {
        id: "has600PremiumDays",
        label: {
            tr: "Son 3 yılda en az 600 prim günüm var",
            en: "I have at least 600 premium days in the last 3 years",
        },
        missingReason: {
            tr: "son 3 yılda en az 600 prim günü şartı",
            en: "the minimum 600 premium days condition",
        },
    },
    {
        id: "notVoluntaryExit",
        label: {
            tr: "Kendi isteğimle işten ayrılmadım",
            en: "I did not leave the job voluntarily",
        },
        missingReason: {
            tr: "kendi isteğinizle işten ayrılmama şartı",
            en: "the non-voluntary exit condition",
        },
    },
];

function UnemploymentEligibilityAndPremiumPanel({ lang }: { lang: LanguageCode }) {
    const [eligibility, setEligibility] = useState<Record<UnemploymentEligibilityKey, boolean>>({
        last120Days: false,
        has600PremiumDays: false,
        notVoluntaryExit: false,
    });
    const [workedYears, setWorkedYears] = useState(1);
    const [workedMonths, setWorkedMonths] = useState(0);

    const eligibilityResult = useMemo(() => {
        const missingCondition = UNEMPLOYMENT_ELIGIBILITY_CONDITIONS.find(
            (condition) => !eligibility[condition.id]
        );

        if (!missingCondition) {
            return {
                message: lang === "tr"
                    ? "✅ Temel şartları sağlıyorsunuz — İŞKUR başvurusu yapabilirsiniz"
                    : "✅ You meet the basic conditions — you can apply to İŞKUR",
                className: "border-emerald-200 bg-emerald-50 text-emerald-900",
            };
        }

        return {
            message: lang === "tr"
                ? `❌ ${missingCondition.missingReason.tr} nedeniyle işsizlik ödeneğine hak kazanamayabilirsiniz`
                : `❌ You may not be eligible for unemployment benefit due to ${missingCondition.missingReason.en}`,
            className: "border-red-200 bg-red-50 text-red-900",
        };
    }, [eligibility, lang]);

    const premiumDayResult = useMemo(() => {
        const years = Math.max(0, readRawNumber(workedYears));
        const months = Math.max(0, readRawNumber(workedMonths));
        const estimatedDays = Math.round((365 * years + 30 * months) * 0.9);
        const formatter = lang === "tr" ? "tr-TR" : "en-US";

        if (estimatedDays < 600) {
            return {
                estimatedDays,
                label: lang === "tr" ? "Henüz hak kazanılmadı" : "Not eligible yet",
                className: "border-red-200 bg-red-50 text-red-900",
                formattedDays: estimatedDays.toLocaleString(formatter),
            };
        }

        if (estimatedDays < 900) {
            return {
                estimatedDays,
                label: lang === "tr" ? "6 ay hak kazanıldı" : "6 months earned",
                className: "border-emerald-200 bg-emerald-50 text-emerald-900",
                formattedDays: estimatedDays.toLocaleString(formatter),
            };
        }

        if (estimatedDays < 1080) {
            return {
                estimatedDays,
                label: lang === "tr" ? "8 ay hak kazanıldı" : "8 months earned",
                className: "border-emerald-200 bg-emerald-50 text-emerald-900",
                formattedDays: estimatedDays.toLocaleString(formatter),
            };
        }

        return {
            estimatedDays,
            label: lang === "tr" ? "10 ay hak kazanıldı (maksimum)" : "10 months earned (maximum)",
            className: "border-blue-200 bg-blue-50 text-blue-900",
            formattedDays: estimatedDays.toLocaleString(formatter),
        };
    }, [workedMonths, workedYears, lang]);

    const handleEligibilityChange = (id: UnemploymentEligibilityKey, checked: boolean) => {
        setEligibility((current) => ({
            ...current,
            [id]: checked,
        }));
    };

    return (
        <section className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-black tracking-tight text-slate-950">
                    {lang === "tr" ? "Hak Ediyor muyum?" : "Am I Eligible?"}
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                    {lang === "tr"
                        ? "Temel şartları işaretleyin, ardından çalışma sürenizden tahmini prim gününüzü görün."
                        : "Check the basic conditions, then estimate premium days from your work duration."}
                </p>
            </div>

            <div className="mt-4 grid gap-3">
                {UNEMPLOYMENT_ELIGIBILITY_CONDITIONS.map((condition) => {
                    const checked = eligibility[condition.id];

                    return (
                        <label
                            key={condition.id}
                            className={`flex min-h-[58px] cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-3 transition-colors ${checked
                                ? "border-emerald-200 bg-white text-slate-950"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                }`}
                        >
                            <span className="text-sm font-bold leading-5">{condition.label[lang]}</span>
                            <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => handleEligibilityChange(condition.id, event.target.checked)}
                                    className="peer sr-only"
                                />
                                <span className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-500" />
                                <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                            </span>
                        </label>
                    );
                })}
            </div>

            <div className={`mt-4 rounded-lg border px-4 py-3 text-sm font-black leading-6 ${eligibilityResult.className}`}>
                {eligibilityResult.message}
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
                <h4 className="text-base font-black text-slate-950">
                    {lang === "tr" ? "Prim Günü Hesaplayıcısı" : "Premium Day Estimator"}
                </h4>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-slate-600">{lang === "tr" ? "Yıl" : "Years"}</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step={1}
                            value={workedYears}
                            onChange={(event) => setWorkedYears(Number.parseFloat(event.target.value) || 0)}
                            className="h-12 rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-slate-950 shadow-sm outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-slate-600">{lang === "tr" ? "Ay" : "Months"}</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step={1}
                            value={workedMonths}
                            onChange={(event) => setWorkedMonths(Number.parseFloat(event.target.value) || 0)}
                            className="h-12 rounded-lg border border-slate-300 bg-white px-3 text-base font-semibold text-slate-950 shadow-sm outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                        />
                    </label>
                </div>

                <div className={`mt-4 rounded-lg border px-4 py-3 ${premiumDayResult.className}`}>
                    <p className="text-sm font-semibold">
                        {lang === "tr" ? "Tahmini prim günü" : "Estimated premium days"}
                    </p>
                    <p className="mt-1 text-2xl font-black tabular-nums">
                        {premiumDayResult.formattedDays} {lang === "tr" ? "gün" : "days"}
                    </p>
                    <p className="mt-1 text-sm font-black">{premiumDayResult.label}</p>
                </div>
            </div>

            <p className="mt-4 text-xs font-medium leading-5 text-slate-500">
                {lang === "tr"
                    ? "Bu kontrol yalnızca ön bilgi amaçlıdır. Kesin sonuç için İŞKUR'a başvurun."
                    : "This check is for preliminary information only. Apply to İŞKUR for the final result."}
            </p>
        </section>
    );
}

const TAX_MONTHLY_DELAY_RATE = 0.037;
const TAX_ANNUAL_DEFERRAL_RATE = 0.39;

type TaxChargeType = "gecikme_zammi" | "tecil_faizi";

type TaxDelayInterestScenario = {
    key: TaxChargeType;
    title: string;
    rateLabel: string;
    chargeLabel: string;
    chargeAmount: number;
    totalPayable: number;
    extraLoadPercent: number;
};

type TaxPaymentDateMode = "today" | "custom";

const TAX_HISTORICAL_DELAY_RATES = [
    {
        start: "2025-11-13",
        end: null,
        startLabel: "13 Kas 2025",
        endLabel: "Devam ediyor",
        monthlyRate: 3.7,
        monthlyRateLabel: "%3,7",
        annualEquivalentLabel: "~%44,4",
    },
    {
        start: "2024-05-21",
        end: "2025-11-12",
        startLabel: "21 May 2024",
        endLabel: "12 Kas 2025",
        monthlyRate: 4.5,
        monthlyRateLabel: "%4,5",
        annualEquivalentLabel: "~%54,0",
    },
    {
        start: "2023-11-14",
        end: "2024-05-20",
        startLabel: "14 Kas 2023",
        endLabel: "20 May 2024",
        monthlyRate: 3.5,
        monthlyRateLabel: "%3,5",
        annualEquivalentLabel: "~%42,0",
    },
    {
        start: "2022-07-21",
        end: "2023-11-13",
        startLabel: "21 Tem 2022",
        endLabel: "13 Kas 2023",
        monthlyRate: 2.5,
        monthlyRateLabel: "%2,5",
        annualEquivalentLabel: "~%30,0",
    },
    {
        start: "2019-12-30",
        end: "2022-07-20",
        startLabel: "30 Ara 2019",
        endLabel: "20 Tem 2022",
        monthlyRate: 1.6,
        monthlyRateLabel: "%1,6",
        annualEquivalentLabel: "~%19,2",
    },
];

function getHistoricalTaxDelayRate(dateInputValue: any) {
    const selectedDay = dateInputToDayNumber(dateInputValue);
    if (selectedDay === null) {
        return null;
    }

    return TAX_HISTORICAL_DELAY_RATES.find((ratePeriod) => {
        const startDay = dateInputToDayNumber(ratePeriod.start);
        const endDay = ratePeriod.end ? dateInputToDayNumber(ratePeriod.end) : null;

        return startDay !== null
            && selectedDay >= startDay
            && (endDay === null || selectedDay <= endDay);
    }) ?? null;
}

function formatTaxPercent(value: number, digits = 1) {
    return `%${value.toLocaleString("tr-TR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })}`;
}

function getTaxPaymentDateMode(values: Record<string, any>): TaxPaymentDateMode {
    return values.taxPaymentDateMode === "custom" ? "custom" : "today";
}

function getTaxPaymentDateValue(values: Record<string, any>) {
    const mode = getTaxPaymentDateMode(values);
    if (mode === "custom") {
        return typeof values.taxPaymentDate === "string" && values.taxPaymentDate
            ? values.taxPaymentDate
            : getTodayDateInputValue();
    }

    return getTodayDateInputValue();
}

function getTaxDelayDateStatus(values: Record<string, any>) {
    const todayDate = getTodayDateInputValue();
    const paymentDateMode = getTaxPaymentDateMode(values);
    const paymentDate = getTaxPaymentDateValue(values);
    const calculatedDays = getCalendarDayDifference(values.taxDueDate, paymentDate);
    const isPaymentDateFuture =
        paymentDateMode === "custom"
        && dateInputToDayNumber(paymentDate) !== null
        && dateInputToDayNumber(todayDate) !== null
        && dateInputToDayNumber(paymentDate)! > dateInputToDayNumber(todayDate)!;

    return {
        todayDate,
        paymentDateMode,
        paymentDate,
        calculatedDays,
        isPaymentDateFuture,
        hasDueDate: Boolean(values.taxDueDate && calculatedDays !== null),
        isManualMode: Boolean(values.taxDelayManualMode),
    };
}

function calculateTaxDelayInterest(values: Record<string, any>) {
    const debt = readNumber(values.taxDebt);
    const days = readNumber(values.delayDays);
    const fullMonths = Math.floor(days / 30);
    const remainingDays = days % 30;

    const delaySurcharge =
        (debt * TAX_MONTHLY_DELAY_RATE * fullMonths)
        + (debt * (TAX_MONTHLY_DELAY_RATE / 30) * remainingDays);
    const deferralInterest = debt * TAX_ANNUAL_DEFERRAL_RATE * (days / 365);

    const buildScenario = (
        key: TaxChargeType,
        title: string,
        rateLabel: string,
        chargeLabel: string,
        chargeAmount: number
    ): TaxDelayInterestScenario => ({
        key,
        title,
        rateLabel,
        chargeLabel,
        chargeAmount,
        totalPayable: debt + chargeAmount,
        extraLoadPercent: debt > 0 ? (chargeAmount / debt) * 100 : 0,
    });

    const scenarios = [
        buildScenario(
            "gecikme_zammi",
            "Gecikme Zammı",
            "Aylık %3,7",
            "Zam tutarı",
            delaySurcharge
        ),
        buildScenario(
            "tecil_faizi",
            "Tecil Faizi",
            "Yıllık %39",
            "Faiz tutarı",
            deferralInterest
        ),
    ];
    const selectedChargeType: TaxChargeType =
        values.chargeType === "tecil_faizi" ? "tecil_faizi" : "gecikme_zammi";

    return {
        debt,
        days,
        fullMonths,
        remainingDays,
        selectedChargeType,
        selectedScenario:
            scenarios.find((scenario) => scenario.key === selectedChargeType) ?? scenarios[0],
        scenarios,
        validationErrors: [
            ...(debt <= 0 ? ["Geçerli tutar girin"] : []),
            ...(days <= 0 ? ["Gün sayısı 0'dan büyük olmalı"] : []),
        ],
        complexDebtWarning:
            days > 1800
                ? "5 yılı aşan borçlarda zamanaşımı, af yasaları veya yapılandırma süreçleri devreye girmiş olabilir. Mutlaka vergi dairesine danışın."
                : null,
        longPeriodWarning:
            days > 3650 ? "10 yılı aşan borç için vergi dairesini arayın" : null,
    };
}

function TaxDelayInterestMetricCard({
    label,
    value,
    helper,
    tone = "default",
}: {
    label: string;
    value: string;
    helper?: string;
    tone?: "default" | "blue" | "orange";
}) {
    const className = {
        default: "border-slate-200 bg-white text-slate-950",
        blue: "border-blue-200 bg-blue-50 text-blue-950",
        orange: "border-orange-200 bg-orange-50 text-orange-950",
    }[tone];
    const helperClassName = {
        default: "text-slate-500",
        blue: "text-blue-700",
        orange: "text-orange-700",
    }[tone];

    return (
        <div className={`rounded-lg border p-4 shadow-sm transition-all duration-300 ${className}`}>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className={`mt-2 font-black tracking-tight ${tone === "blue" ? "text-3xl" : "text-2xl"}`}>
                {value}
            </p>
            {helper && (
                <p className={`mt-1 text-xs font-bold leading-5 ${helperClassName}`}>
                    {helper}
                </p>
            )}
        </div>
    );
}

function TaxDelayDateControls({
    values,
    onPatch,
}: {
    values: Record<string, any>;
    onPatch: (patch: Record<string, any>, interactionId: string) => void;
}) {
    const status = useMemo(() => getTaxDelayDateStatus(values), [values]);
    const dueDate = typeof values.taxDueDate === "string" ? values.taxDueDate : "";
    const manualMode = status.isManualMode;

    const buildAutoDelayPatch = (
        nextDueDate: string,
        nextPaymentDate: string,
        nextManualMode = manualMode
    ) => {
        const calculatedDays = getCalendarDayDifference(nextDueDate, nextPaymentDate);

        return !nextManualMode && calculatedDays !== null
            ? { delayDays: calculatedDays }
            : {};
    };

    const handleDueDateChange = (nextDueDate: string) => {
        onPatch({
            taxDueDate: nextDueDate,
            ...buildAutoDelayPatch(nextDueDate, status.paymentDate),
        }, "taxDueDate");
    };

    const handlePaymentModeChange = (nextMode: TaxPaymentDateMode) => {
        const nextPaymentDate = nextMode === "today"
            ? getTodayDateInputValue()
            : (typeof values.taxPaymentDate === "string" && values.taxPaymentDate
                ? values.taxPaymentDate
                : getTodayDateInputValue());

        onPatch({
            taxPaymentDateMode: nextMode,
            taxPaymentDate: nextPaymentDate,
            ...buildAutoDelayPatch(dueDate, nextPaymentDate),
        }, "taxPaymentDateMode");
    };

    const handlePaymentDateChange = (nextPaymentDate: string) => {
        onPatch({
            taxPaymentDate: nextPaymentDate,
            ...buildAutoDelayPatch(dueDate, nextPaymentDate),
        }, "taxPaymentDate");
    };

    const handleManualModeChange = (nextManualMode: boolean) => {
        onPatch({
            taxDelayManualMode: nextManualMode,
            ...buildAutoDelayPatch(dueDate, status.paymentDate, nextManualMode),
        }, "taxDelayManualMode");
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-2">
                <label className="flex flex-col gap-2">
                    <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-600">
                        <span>Vade Tarihi</span>
                        {status.hasDueDate && status.calculatedDays !== null && (
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-black text-blue-700">
                                {status.calculatedDays.toLocaleString("tr-TR")} gün gecikti
                            </span>
                        )}
                    </span>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(event) => handleDueDateChange(event.target.value)}
                        className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                    />
                    {dueDate && (
                        <span className="text-xs font-medium text-slate-500">
                            {formatTurkishDate(dueDate)}
                        </span>
                    )}
                </label>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-600">Ödeme Tarihi</span>
                    <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => handlePaymentModeChange("today")}
                            className={`h-12 rounded-lg text-sm font-black transition-all duration-300 ${status.paymentDateMode === "today"
                                ? "bg-white text-[#CC4A1A] shadow-sm"
                                : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                                }`}
                            aria-pressed={status.paymentDateMode === "today"}
                        >
                            bugün ✓
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePaymentModeChange("custom")}
                            className={`h-12 rounded-lg text-sm font-black transition-all duration-300 ${status.paymentDateMode === "custom"
                                ? "bg-white text-[#CC4A1A] shadow-sm"
                                : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                                }`}
                            aria-pressed={status.paymentDateMode === "custom"}
                        >
                            özel tarih
                        </button>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                        {status.paymentDateMode === "today"
                            ? `Bugün: ${formatTurkishDate(status.todayDate)}`
                            : "Özel ödeme tarihi seçin"}
                    </span>
                </div>
            </div>

            {status.paymentDateMode === "custom" && (
                <label className="mt-4 flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-600">Özel Ödeme Tarihi</span>
                    <input
                        type="date"
                        value={typeof values.taxPaymentDate === "string" ? values.taxPaymentDate : status.todayDate}
                        onChange={(event) => handlePaymentDateChange(event.target.value)}
                        className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                    />
                    {status.paymentDate && (
                        <span className="text-xs font-medium text-slate-500">
                            {formatTurkishDate(status.paymentDate)}
                        </span>
                    )}
                </label>
            )}

            {status.isPaymentDateFuture && (
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-900">
                    Bu araç geçmiş borçlar içindir
                </div>
            )}

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium leading-5 text-slate-500">
                    Türkiye vergi sisteminde hafta sonu/resmi tatil hesabı yapılmaz; takvim günü esastır.
                </p>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-black text-slate-700">
                    <input
                        type="checkbox"
                        checked={manualMode}
                        onChange={(event) => handleManualModeChange(event.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-[#CC4A1A] shadow-sm focus:ring-2 focus:ring-[#FF6B35]"
                    />
                    Manuel gir
                </label>
            </div>
        </div>
    );
}

function TaxHistoricalRatesAccordion({
    values,
}: {
    values: Record<string, any>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedRate = useMemo(
        () => getHistoricalTaxDelayRate(values.taxDueDate),
        [values.taxDueDate]
    );

    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                aria-expanded={isOpen}
            >
                <span>
                    <span className="block text-base font-black tracking-tight text-slate-950">
                        Tarihsel Oranlar
                    </span>
                    <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
                        Eski dönem borçları için GİB tebliğlerindeki aylık gecikme zammı oranları
                    </span>
                </span>
                <span className="text-2xl font-black text-slate-500" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                </span>
            </button>

            <div className={`${isOpen ? "block" : "hidden"} border-t border-slate-200 px-4 pb-4 pt-4`}>
                {selectedRate && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
                        Bu tarih için geçerli oran: {selectedRate.monthlyRateLabel}
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-600">
                            <tr>
                                <th className="px-3 py-3">Dönem Başlangıcı</th>
                                <th className="px-3 py-3">Dönem Sonu</th>
                                <th className="px-3 py-3 text-right">Aylık Oran</th>
                                <th className="px-3 py-3 text-right">Yıllık Karşılığı</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                            {TAX_HISTORICAL_DELAY_RATES.map((ratePeriod) => {
                                const isSelected = selectedRate?.start === ratePeriod.start;

                                return (
                                    <tr
                                        key={ratePeriod.start}
                                        className={isSelected ? "bg-blue-50 text-blue-950" : undefined}
                                    >
                                        <td className="px-3 py-3 font-semibold">{ratePeriod.startLabel}</td>
                                        <td className="px-3 py-3">{ratePeriod.endLabel}</td>
                                        <td className="px-3 py-3 text-right font-black">{ratePeriod.monthlyRateLabel}</td>
                                        <td className="px-3 py-3 text-right font-bold">{ratePeriod.annualEquivalentLabel}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
                    Birden fazla döneme yayılan borçlarda her dönem kendi oranıyla ayrı hesaplanmalıdır.
                    Bu durumda vergi dairesine başvurun.
                </p>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                    Kaynak notu: Hazine ve Maliye Bakanlığı Tahsilat Genel Tebliğleri esas alınmıştır.
                </p>
            </div>
        </section>
    );
}

function TaxDelayVsDeferralComparison({
    result,
}: {
    result: ReturnType<typeof calculateTaxDelayInterest>;
}) {
    const delayScenario = result.scenarios.find((scenario) => scenario.key === "gecikme_zammi") ?? result.scenarios[0];
    const deferralScenario = result.scenarios.find((scenario) => scenario.key === "tecil_faizi") ?? result.scenarios[1];
    const deferralIsBetter = deferralScenario.chargeAmount < delayScenario.chargeAmount;
    const isEqual = Math.abs(deferralScenario.chargeAmount - delayScenario.chargeAmount) < 0.01;
    const advantageText = isEqual
        ? `${result.days.toLocaleString("tr-TR")} gün için tecil ile yapılandırmasız seçenek aynı maliyette`
        : `${result.days.toLocaleString("tr-TR")} gün için tecil ${deferralIsBetter ? "daha avantajlı" : "daha dezavantajlı"}`;

    const comparisonRows = [
        {
            label: "Faiz/zam tutarı",
            delayValue: formatTry(delayScenario.chargeAmount),
            deferralValue: formatTry(deferralScenario.chargeAmount),
            delayRaw: delayScenario.chargeAmount,
            deferralRaw: deferralScenario.chargeAmount,
        },
        {
            label: "Toplam ödeme",
            delayValue: formatTry(delayScenario.totalPayable),
            deferralValue: formatTry(deferralScenario.totalPayable),
            delayRaw: delayScenario.totalPayable,
            deferralRaw: deferralScenario.totalPayable,
        },
        {
            label: "Ek yük oranı",
            delayValue: formatTaxPercent(delayScenario.extraLoadPercent),
            deferralValue: formatTaxPercent(deferralScenario.extraLoadPercent),
            delayRaw: delayScenario.extraLoadPercent,
            deferralRaw: deferralScenario.extraLoadPercent,
        },
    ];

    return (
        <div className="mt-5 border-t border-slate-200 pt-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h4 className="text-base font-black tracking-tight text-slate-950">
                    Gecikme vs Tecil Karşılaştırması
                </h4>
                <p className="text-xs font-bold text-slate-500">
                    Aynı borç ve gün sayısı ile
                </p>
            </div>

            <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-600">
                        <tr>
                            <th className="px-3 py-3"> </th>
                            <th className="px-3 py-3 text-right">Yapılandırmasız</th>
                            <th className="px-3 py-3 text-right">Tecil ile</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {comparisonRows.map((row) => {
                            const delayWins = row.delayRaw < row.deferralRaw;
                            const deferralWins = row.deferralRaw < row.delayRaw;

                            return (
                                <tr key={row.label}>
                                    <td className="px-3 py-3 font-semibold text-slate-700">{row.label}</td>
                                    <td className={`px-3 py-3 text-right font-black ${delayWins ? "bg-emerald-50 text-emerald-800" : "text-slate-950"}`}>
                                        {row.delayValue}
                                    </td>
                                    <td className={`px-3 py-3 text-right font-black ${deferralWins ? "bg-emerald-50 text-emerald-800" : "text-slate-950"}`}>
                                        {row.deferralValue}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className={`mt-3 rounded-lg border px-4 py-3 text-sm font-black ${isEqual
                ? "border-slate-200 bg-white text-slate-800"
                : deferralIsBetter
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
            >
                {advantageText}
            </div>
        </div>
    );
}

function TaxPartialPaymentScenario({
    result,
    values,
    onPatch,
}: {
    result: ReturnType<typeof calculateTaxDelayInterest>;
    values: Record<string, any>;
    onPatch: (patch: Record<string, any>, interactionId: string) => void;
}) {
    const rawPartialPayment = readNumber(values.taxPartialPayment);
    const partialPayment = Math.min(result.debt, rawPartialPayment);
    const remainingPrincipal = Math.max(0, result.debt - partialPayment);
    const dailyDelayLoad = remainingPrincipal * (TAX_MONTHLY_DELAY_RATE / 30);

    return (
        <div className="mt-5 border-t border-slate-200 pt-5">
            <h4 className="text-base font-black tracking-tight text-slate-950">
                Kısmi Ödeme Senaryosu
            </h4>
            <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                Borcumun bir kısmını ödeyebilirim
            </p>

            <label className="mt-3 flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-600">Ödenecek tutar</span>
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={result.debt}
                        step={0.01}
                        value={values.taxPartialPayment || ""}
                        onChange={(event) => {
                            onPatch({
                                taxPartialPayment: Number.parseFloat(event.target.value) || 0,
                            }, "taxPartialPayment");
                        }}
                        className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 bg-white pl-2 text-sm font-medium text-slate-500">
                        TL
                    </span>
                </div>
            </label>

            <div className="mt-3 grid gap-3">
                <TaxDelayInterestMetricCard
                    label="Kalan anapara"
                    value={formatTry(remainingPrincipal)}
                />
                <TaxDelayInterestMetricCard
                    label="Günlük gecikme zammı"
                    value={formatTry(dailyDelayLoad)}
                    helper="Kalan tutar üzerinden aylık %3,7 / 30"
                    tone="orange"
                />
            </div>

            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-black leading-6 text-red-800">
                Her geçen gün {formatTry(dailyDelayLoad)} ek yük bindiriyor
            </div>

            <div className="mt-3 rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                <p>
                    Kısmi ödeme vergi dairesinin onayına tabidir, önce GİB ödeme planı sorgulayın.
                </p>
                <a
                    href="https://dijital.gib.gov.tr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex font-black text-blue-700 transition-colors hover:text-blue-800"
                >
                    GİB ödeme planı sorgula →
                </a>
            </div>
        </div>
    );
}

function TaxDelayInterestResultPanel({
    values,
    onPatch,
}: {
    values: Record<string, any>;
    lang: LanguageCode;
    onPatch: (patch: Record<string, any>, interactionId: string) => void;
}) {
    const result = useMemo(() => calculateTaxDelayInterest(values), [values]);
    const isValid = result.validationErrors.length === 0;

    return (
        <section aria-live="polite" className="rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
                <span className="h-2 w-2 rounded-full bg-[#FF6B35] animate-pulse" />
                Sonuçlar
            </h3>

            {result.validationErrors.length > 0 && (
                <div className="mb-4 space-y-2">
                    {result.validationErrors.map((message) => (
                        <div
                            key={message}
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                        >
                            {message}
                        </div>
                    ))}
                </div>
            )}

            {result.complexDebtWarning && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-800">
                    {result.complexDebtWarning}
                </div>
            )}

            {result.longPeriodWarning && (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-900">
                    {result.longPeriodWarning}
                </div>
            )}

            {isValid ? (
                <>
                    <div className="grid gap-3">
                        <TaxDelayInterestMetricCard
                            label={result.selectedScenario.title}
                            value={formatTry(result.selectedScenario.chargeAmount)}
                            helper={`borcun ${formatTaxPercent(result.selectedScenario.extraLoadPercent)}'i kadar ek yük`}
                            tone="orange"
                        />
                        <TaxDelayInterestMetricCard
                            label="Anapara Borcu"
                            value={formatTry(result.debt)}
                        />
                        <TaxDelayInterestMetricCard
                            label="Toplam Ödeme"
                            value={formatTry(result.selectedScenario.totalPayable)}
                            helper={`${result.selectedScenario.rateLabel} esas alınmıştır`}
                            tone="blue"
                        />
                    </div>

                    <div className="mt-5 border-t border-slate-200 pt-5">
                        <div className="flex items-end justify-between gap-3">
                            <h4 className="text-base font-black tracking-tight text-slate-950">
                                Karşılaştırma
                            </h4>
                            <p className="text-xs font-bold text-slate-500">
                                {Math.floor(result.fullMonths)} tam ay + {result.remainingDays.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} gün
                            </p>
                        </div>

                        <div className="mt-3 grid gap-3">
                            {result.scenarios.map((scenario) => {
                                const isSelected = scenario.key === result.selectedChargeType;

                                return (
                                    <div
                                        key={scenario.key}
                                        className={`rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 ${isSelected
                                            ? "border-[#FF6B35] ring-4 ring-[#FF6B35]/10"
                                            : "border-slate-200"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-black text-slate-950">
                                                    {scenario.title}
                                                </p>
                                                <p className="mt-1 text-xs font-bold text-slate-500">
                                                    {scenario.rateLabel}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <span className="rounded-full border border-[#FFD7C7] bg-[#FFF3EE] px-2 py-0.5 text-[11px] font-black text-[#CC4A1A]">
                                                    Seçili
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-2 text-sm">
                                            <ScenarioMetric
                                                label={scenario.chargeLabel}
                                                value={formatTry(scenario.chargeAmount)}
                                            />
                                            <ScenarioMetric
                                                label="Toplam ödeme"
                                                value={formatTry(scenario.totalPayable)}
                                            />
                                            <ScenarioMetric
                                                label="Ek yük"
                                                value={`${formatTaxPercent(scenario.extraLoadPercent)} (${formatTry(scenario.chargeAmount)})`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <TaxDelayVsDeferralComparison result={result} />
                    <TaxPartialPaymentScenario
                        result={result}
                        values={values}
                        onPatch={onPatch}
                    />

                    <div className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                        <p>
                            Bu hesaplama, GİB'in resmi formülüne dayanan yaklaşık bir planlama aracıdır.
                            Kesin tahakkuk için vergi dairenize veya e-Devlet üzerinden İnteraktif Vergi Dairesi'ne başvurun.
                        </p>
                        <a
                            href="https://dijital.gib.gov.tr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex font-black text-blue-700 transition-colors hover:text-blue-800"
                        >
                            İnteraktif Vergi Dairesi →
                        </a>
                    </div>
                </>
            ) : (
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-5 text-sm font-medium leading-6 text-slate-600">
                    Girdi değerlerini düzelttiğinizde sonuç kartları anında güncellenir.
                </div>
            )}
        </section>
    );
}

function formatUsd(value: number) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} USD`;
}

function getEurobondCurrency(values: Record<string, any>): EurobondCurrency {
    return values.eurobondCurrency === "EUR" ? "EUR" : "USD";
}

function formatFx(value: number, currency: EurobondCurrency) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ${currency}`;
}

function formatTl(value: number) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} TL`;
}

function calculateEurobondResults(values: Record<string, any>) {
    const currency = getEurobondCurrency(values);
    const nominal = readNumber(values.nominal);
    const alisFiyati = readNumber(values.pricePercent);
    const kuponOrani = readNumber(values.couponRate);
    const kuponSikligi = Number.parseFloat(String(values.couponFrequency)) === 1 ? 1 : 2;
    const kalanVade = readNumber(values.years);
    const stopaj = readNumber(values.couponTax);
    const kur = readNumber(values.usdRate);

    const alisMaliyeti = nominal * (alisFiyati / 100);
    const yillikBrutKupon = nominal * (kuponOrani / 100);
    const donemselKupon = yillikBrutKupon / kuponSikligi;
    const netDonemselKupon = donemselKupon * (1 - stopaj / 100);
    const toplamKuponSayisi = Math.max(0, Math.round(kalanVade * kuponSikligi));
    const yillikNetKupon = netDonemselKupon * kuponSikligi;
    let donemselYtm = kuponOrani / (100 * kuponSikligi);

    if (alisMaliyeti > 0 && toplamKuponSayisi > 0) {
        for (let iteration = 0; iteration < 50; iteration += 1) {
            const base = Math.max(0.000001, 1 + donemselYtm);
            let f = -alisMaliyeti;
            let derivative = 0;

            for (let t = 1; t <= toplamKuponSayisi; t += 1) {
                f += netDonemselKupon / Math.pow(base, t);
                derivative += -t * netDonemselKupon / Math.pow(base, t + 1);
            }

            f += nominal / Math.pow(base, toplamKuponSayisi);
            derivative += -toplamKuponSayisi * nominal / Math.pow(base, toplamKuponSayisi + 1);

            if (Math.abs(f) < 0.000001 || Math.abs(derivative) < 0.0000001) {
                break;
            }

            const nextRate = donemselYtm - f / derivative;
            if (!Number.isFinite(nextRate)) {
                break;
            }

            donemselYtm = Math.max(-0.999999, nextRate);
        }
    } else {
        donemselYtm = 0;
    }

    const yillikYtm = (Math.pow(1 + donemselYtm, kuponSikligi) - 1) * 100;
    const cariGetiri = alisMaliyeti > 0 ? (yillikNetKupon / alisMaliyeti) * 100 : 0;
    const toplamNetKuponGeliri = netDonemselKupon * toplamKuponSayisi;
    const vadeSonuToplamGetiri = toplamNetKuponGeliri + nominal;
    const today = new Date();
    const cashFlows = Array.from({ length: toplamKuponSayisi }, (_, index) => {
        const period = index + 1;
        const paymentDate = new Date(today);
        paymentDate.setMonth(today.getMonth() + Math.round((12 / kuponSikligi) * period));
        const stopajTutari = donemselKupon - netDonemselKupon;

        return {
            period,
            date: paymentDate.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
            grossCoupon: donemselKupon,
            tax: stopajTutari,
            netCoupon: netDonemselKupon,
            netCouponTl: netDonemselKupon * kur,
        };
    });
    const maturityDate = new Date(today);
    maturityDate.setMonth(today.getMonth() + Math.round(12 * kalanVade));

    return {
        currency,
        alisMaliyeti,
        alisMaliyetiTl: alisMaliyeti * kur,
        yillikNetKupon,
        yillikNetKuponTl: yillikNetKupon * kur,
        cariGetiri,
        yillikYtm,
        toplamNetKuponGeliri,
        vadeSonuToplamGetiri,
        cashFlows,
        maturityPrincipal: nominal,
        maturityPrincipalTl: nominal * kur,
        maturityDate: maturityDate.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    };
}

function EurobondResultCard({
    label,
    primary,
    secondary,
}: {
    label: string;
    primary: string;
    secondary?: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-300 hover:border-[#FFD7C7] hover:bg-white">
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{primary}</p>
            {secondary && (
                <p className="mt-1 text-sm font-bold text-[#CC4A1A]">{secondary}</p>
            )}
        </div>
    );
}

function EurobondDeclarationBanner({ annualNetCouponTl }: { annualNetCouponTl: number }) {
    const alert = annualNetCouponTl > 400000
        ? {
            className: "border-red-200 bg-red-50 text-red-800",
            text: "⚠️ 2026 yılı beyan eşiğini (400.000 TL) aşıyor — gelir vergisi beyannamesi gerekebilir",
        }
        : annualNetCouponTl > 330000
            ? {
                className: "border-red-200 bg-red-50 text-red-800",
                text: "⚠️ 2025 yılı beyan eşiğini (330.000 TL) aşıyor — gelir vergisi beyannamesi gerekebilir",
            }
            : {
                className: "border-emerald-200 bg-emerald-50 text-emerald-800",
                text: "✅ Mevcut kur ve kupon ile beyan eşiğinin altında",
            };

    return (
        <div className={`rounded-xl border px-4 py-3 shadow-sm transition-all duration-300 sm:col-span-2 ${alert.className}`}>
            <p className="text-sm font-black leading-6">{alert.text}</p>
            <p className="mt-1 text-xs font-medium leading-5 opacity-90">
                Bu bilgi tavsiye değil, eşik kontrolüdür. Güncel eşik için GİB rehberini kontrol edin.
            </p>
        </div>
    );
}

function EurobondCashFlowTable({
    result,
}: {
    result: ReturnType<typeof calculateEurobondResults>;
}) {
    const [showAllRows, setShowAllRows] = useState(false);
    const hasMoreRows = result.cashFlows.length > 20;
    const visibleRows = showAllRows ? result.cashFlows : result.cashFlows.slice(0, 20);

    return (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 sm:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-950">
                        Nakit Akış Tablosu
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Kupon dönemleri ve vade sonu anapara iadesi
                    </p>
                </div>
                {hasMoreRows && (
                    <button
                        type="button"
                        onClick={() => setShowAllRows((current) => !current)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition-all duration-300 hover:border-[#FF6B35] hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
                    >
                        {showAllRows ? "İlk 20 dönemi göster" : "Tüm dönemleri göster"}
                    </button>
                )}
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-600">
                        <tr>
                            <th className="px-3 py-3">Dönem</th>
                            <th className="px-3 py-3">Tarih</th>
                            <th className="px-3 py-3 text-right">Brüt Kupon ({result.currency})</th>
                            <th className="px-3 py-3 text-right">Stopaj ({result.currency})</th>
                            <th className="px-3 py-3 text-right">Net Kupon ({result.currency})</th>
                            <th className="px-3 py-3 text-right">Net Kupon (TL)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                        {visibleRows.map((row) => (
                            <tr key={row.period} className="transition-colors duration-300 hover:bg-slate-50">
                                <td className="px-3 py-3 font-semibold text-slate-900">{row.period}</td>
                                <td className="px-3 py-3">{row.date}</td>
                                <td className="px-3 py-3 text-right">{formatFx(row.grossCoupon, result.currency)}</td>
                                <td className="px-3 py-3 text-right">{formatFx(row.tax, result.currency)}</td>
                                <td className="px-3 py-3 text-right font-bold text-slate-900">{formatFx(row.netCoupon, result.currency)}</td>
                                <td className="px-3 py-3 text-right font-bold text-[#CC4A1A]">{formatTl(row.netCouponTl)}</td>
                            </tr>
                        ))}
                        <tr className="bg-emerald-50 font-black text-emerald-900">
                            <td className="px-3 py-3" colSpan={2}>Vade sonu anapara iadesi ({result.maturityDate})</td>
                            <td className="px-3 py-3 text-right">-</td>
                            <td className="px-3 py-3 text-right">-</td>
                            <td className="px-3 py-3 text-right">{formatFx(result.maturityPrincipal, result.currency)}</td>
                            <td className="px-3 py-3 text-right">{formatTl(result.maturityPrincipalTl)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function EurobondScenarioSimulation({
    values,
    onSelectPrice,
}: {
    values: Record<string, any>;
    onSelectPrice: (pricePercent: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const currentPrice = readNumber(values.pricePercent);
    const highlightedPrice = currentPrice < 95 ? 90 : currentPrice <= 105 ? 100 : 110;
    const scenarios = useMemo(
        () => [90, 100, 110].map((price) => ({
            price,
            title: price === 90 ? "İskontolu (%90)" : price === 100 ? "Pari (%100)" : "Primli (%110)",
            result: calculateEurobondResults({ ...values, pricePercent: price }),
        })),
        [values]
    );

    return (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 sm:col-span-2">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-all duration-300 hover:bg-slate-50"
                aria-expanded={isOpen}
            >
                <span>
                    <span className="block text-lg font-black tracking-tight text-slate-950">Simülasyon</span>
                    <span className="mt-1 block text-sm font-medium text-slate-500">
                        3 alış fiyatı senaryosunu karşılaştır
                    </span>
                </span>
                <span className={`text-2xl font-black text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    +
                </span>
            </button>

            <div className={`grid overflow-hidden transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0">
                    <div className="grid gap-3 border-t border-slate-200 p-4 lg:grid-cols-3">
                        {scenarios.map((scenario) => {
                            const isHighlighted = scenario.price === highlightedPrice;
                            return (
                                <button
                                    key={scenario.price}
                                    type="button"
                                    onClick={() => onSelectPrice(scenario.price)}
                                    className={`rounded-xl border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isHighlighted
                                        ? "border-[#FF6B35] bg-[#FFF3EE] ring-4 ring-[#FF6B35]/10"
                                        : "border-slate-200 bg-slate-50 hover:border-[#FFD7C7] hover:bg-white"
                                        }`}
                                >
                                    <p className="text-sm font-black text-slate-950">{scenario.title}</p>
                                    <div className="mt-4 space-y-2 text-sm">
                                        <ScenarioMetric
                                            label="Alış maliyeti"
                                            value={formatFx(scenario.result.alisMaliyeti, scenario.result.currency)}
                                        />
                                        <ScenarioMetric
                                            label="Cari getiri"
                                            value={`%${scenario.result.cariGetiri.toLocaleString("tr-TR", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}`}
                                        />
                                        <ScenarioMetric
                                            label="YTM"
                                            value={`%${scenario.result.yillikYtm.toLocaleString("tr-TR", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}`}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EurobondLiveResultGrid({
    values,
    onSelectScenarioPrice,
}: {
    values: Record<string, any>;
    onSelectScenarioPrice: (pricePercent: number) => void;
}) {
    const result = useMemo(() => calculateEurobondResults(values), [values]);

    return (
        <section aria-live="polite" className="mt-6 grid gap-3 sm:grid-cols-2">
            <EurobondDeclarationBanner annualNetCouponTl={result.yillikNetKuponTl} />
            <EurobondResultCard
                label="Alış maliyeti"
                primary={formatFx(result.alisMaliyeti, result.currency)}
                secondary={formatTl(result.alisMaliyetiTl)}
            />
            <EurobondResultCard
                label="Yıllık net kupon"
                primary={formatFx(result.yillikNetKupon, result.currency)}
                secondary={formatTl(result.yillikNetKuponTl)}
            />
            <EurobondResultCard
                label="Cari getiri"
                primary={`%${result.cariGetiri.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`}
            />
            <EurobondResultCard
                label="Vadeye kadar getiri / YTM"
                primary={`%${result.yillikYtm.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`}
            />
            <EurobondResultCard
                label="Toplam net kupon geliri"
                primary={formatFx(result.toplamNetKuponGeliri, result.currency)}
            />
            <EurobondResultCard
                label="Vade sonu toplam getiri"
                primary={formatFx(result.vadeSonuToplamGetiri, result.currency)}
            />
            <EurobondCashFlowTable result={result} />
            <EurobondScenarioSimulation values={values} onSelectPrice={onSelectScenarioPrice} />
        </section>
    );
}

function pickCreditCardStorageValues(values: Record<string, any>) {
    return {
        statementAmount: values.statementAmount,
        paidAmount: values.paidAmount,
        minRequired: values.minRequired,
        newSpending: values.newSpending,
        akdiFaiz: values.akdiFaiz,
        gecikmeFaiz: values.gecikmeFaiz,
        bankName: values.bankName,
    };
}

function getStoredCreditCardValues() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = window.sessionStorage.getItem(CREDIT_CARD_SESSION_STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? parsed as Record<string, any>
            : null;
    } catch {
        return null;
    }
}

function pickTytStorageValues(values: Record<string, any>) {
    return TYT_STORAGE_FIELD_IDS.reduce((pickedValues, fieldId) => {
        pickedValues[fieldId] = values[fieldId];
        return pickedValues;
    }, {} as Record<string, any>);
}

function getStoredTytValues() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = window.sessionStorage.getItem(TYT_FORM_STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? parsed as Record<string, any>
            : null;
    } catch {
        return null;
    }
}

function getTytPairConfig(inputId: string) {
    return TYT_PAIR_CONFIGS.find((config) =>
        config.correctId === inputId || config.wrongId === inputId
    ) ?? null;
}

function clampTytQuestionValue(value: any, maxQuestionCount: number) {
    const parsed = Number.parseFloat(String(value ?? ""));
    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return Math.max(0, Math.min(maxQuestionCount, parsed));
}

function getNormalizedTytInputPatch(values: Record<string, any>, id: string, value: any) {
    const pairConfig = getTytPairConfig(id);
    if (!pairConfig) {
        return { [id]: value };
    }

    const correct = clampTytQuestionValue(
        id === pairConfig.correctId ? value : values[pairConfig.correctId],
        pairConfig.maxQuestionCount
    );
    let wrong = clampTytQuestionValue(
        id === pairConfig.wrongId ? value : values[pairConfig.wrongId],
        pairConfig.maxQuestionCount
    );

    if (correct + wrong > pairConfig.maxQuestionCount) {
        wrong = Math.max(0, pairConfig.maxQuestionCount - correct);
    }

    return {
        [pairConfig.correctId]: correct,
        [pairConfig.wrongId]: wrong,
    };
}

function formatTytShareNumber(value: number, maximumFractionDigits = 2, minimumFractionDigits = maximumFractionDigits) {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);
}

function CreditCardBankSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (bankName: string) => void;
}) {
    return (
        <label className="mb-6 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-600">Banka</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all duration-300 hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
            >
                {CREDIT_CARD_BANKS.map((bankName) => (
                    <option key={bankName} value={bankName}>
                        {bankName}
                    </option>
                ))}
            </select>
        </label>
    );
}

function EurobondCurrencyToggle({
    value,
    onChange,
}: {
    value: EurobondCurrency;
    onChange: (currency: EurobondCurrency) => void;
}) {
    return (
        <div className="mb-6">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Para birimi</span>
            <div className="grid w-full max-w-xs grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-sm">
                {(["USD", "EUR"] as EurobondCurrency[]).map((currency) => (
                    <button
                        key={currency}
                        type="button"
                        onClick={() => onChange(currency)}
                        className={`h-11 rounded-lg text-sm font-black transition-all duration-300 ${value === currency
                            ? "bg-white text-[#CC4A1A] shadow-sm"
                            : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                            }`}
                        aria-pressed={value === currency}
                    >
                        {currency}
                    </button>
                ))}
            </div>
        </div>
    );
}

function CreditCardLateInterestLiveGrid({ values }: { values: Record<string, any> }) {
    const result = useMemo(() => calculateCreditCardLateInterest(values), [values]);
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
    const ekstreBorcu = readNumber(values.statementAmount);
    const odenenTutar = readNumber(values.paidAmount);
    const asgariOdeme = readNumber(values.minRequired);
    const statusBanner = odenenTutar < asgariOdeme
        ? {
            text: "⚠️ Asgari ödeme eksik — gecikme faizi işliyor",
            className: "border-red-200 bg-red-50 text-red-800",
        }
        : odenenTutar < ekstreBorcu
            ? {
                text: "Asgari ödendi ama borç devam ediyor — faizsiz dönem bozuldu",
                className: "border-yellow-200 bg-yellow-50 text-yellow-900",
            }
            : {
                text: "✅ Ekstre tamamen kapandı — faiz yok",
                className: "border-emerald-200 bg-emerald-50 text-emerald-800",
            };
    const rolloverWarning = result.devredenBakiye > ekstreBorcu * 0.5
        ? {
            text: "Borcun yarısından fazlası devriyor — yapılandırmayı değerlendirin",
            className: "border-orange-200 bg-orange-50 text-orange-800",
        }
        : null;
    const copyText = useMemo(() => [
        "💳 Kredi Kartı Gecikme Faizi Hesapladım",
        `Ekstre: ${formatTry(ekstreBorcu)} | Ödenen: ${formatTry(odenenTutar)}`,
        `Gecikme faizi: ${formatTry(result.gecikmeFaiziTutar)} | Akdi faiz: ${formatTry(result.akdiFaizTutar)}`,
        `Sonraki ekstre tahmini: ${formatTry(result.sonrakiEkstreTahmini)}`,
        "hesapmod.com ile hesaplandı",
    ].join("\n"), [ekstreBorcu, odenenTutar, result]);

    const handleCopyResult = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
            setCopyStatus("error");
            return;
        }

        try {
            await navigator.clipboard.writeText(copyText);
            setCopyStatus("copied");
            window.setTimeout(() => setCopyStatus("idle"), 1800);
        } catch {
            setCopyStatus("error");
        }
    };

    return (
        <section aria-live="polite" className="mt-6 grid gap-3 sm:grid-cols-2">
            {[statusBanner, rolloverWarning].filter(Boolean).map((banner) => (
                <div
                    key={banner!.text}
                    className={`rounded-xl border px-4 py-3 text-sm font-bold leading-6 shadow-sm transition-all duration-300 sm:col-span-2 ${banner!.className}`}
                >
                    {banner!.text}
                </div>
            ))}

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition-all duration-300">
                <p className="text-sm font-semibold text-red-700">Gecikme faizi</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-red-950">
                    {formatTry(result.gecikmeFaiziTutar)}
                </p>
                <p className="mt-1 text-xs font-medium text-red-700">
                    Asgari açık: {formatTry(result.asgariAcik)}
                </p>
            </div>

            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm transition-all duration-300">
                <p className="text-sm font-semibold text-orange-700">Akdi faiz</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-orange-950">
                    {formatTry(result.akdiFaizTutar)}
                </p>
                <p className="mt-1 text-xs font-medium text-orange-700">
                    Devreden bakiye: {formatTry(result.devredenBakiye)}
                </p>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm transition-all duration-300">
                <p className="text-sm font-semibold text-yellow-800">Vergi yükü</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-yellow-950">
                    {formatTry(result.vergiler)}
                </p>
                <p className="mt-1 text-xs font-medium text-yellow-800">
                    Toplam faiz: {formatTry(result.toplamFaiz)}
                </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm transition-all duration-300 sm:p-5">
                <p className="text-sm font-semibold text-blue-700">Sonraki ekstre</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-blue-950">
                    {formatTry(result.sonrakiEkstreTahmini)}
                </p>
                <p className="mt-1 text-xs font-medium text-blue-700">
                    Yeni harcama dahil tahmini tutar
                </p>
            </div>

            <div className="flex justify-end sm:col-span-2">
                <button
                    type="button"
                    onClick={handleCopyResult}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-[#FF6B35] hover:bg-[#FFF3EE] hover:text-[#CC4A1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                >
                    {copyStatus === "copied"
                        ? "Kopyalandı"
                        : copyStatus === "error"
                            ? "Kopyalanamadı"
                            : "Sonucu Kopyala"}
                </button>
            </div>

            <ScenarioComparisonGrid values={values} />
            <CreditCardProjectionChart values={values} />
        </section>
    );
}

export default function CalculatorEngine({
    calculator,
    lang,
    initialValues,
}: Props) {
    const [values, dispatchValues] = useReducer(
        calculatorValuesReducer,
        buildInitialValues(calculator, initialValues)
    );
    const [formula, setFormula] = useState<CalculatorFormula | null>(null);
    const [isRuntimeLoading, setIsRuntimeLoading] = useState(
        !isSpecialCalculatorSlug(calculator.slug)
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [tcmbFxStatus, setTcmbFxStatus] = useState<TcmbFxStatus>("idle");
    const [tcmbFxWarning, setTcmbFxWarning] = useState<string | null>(null);
    const [tcmbUsdTry, setTcmbUsdTry] = useState<number | null>(null);
    const [tcmbEurTry, setTcmbEurTry] = useState<number | null>(null);
    const hasTrackedStartRef = useRef(false);
    const hasTrackedResultViewRef = useRef(false);
    const skipNextPersistRef = useRef(false);
    const skipNextTytPersistRef = useRef(false);
    const hasUserOverriddenEurobondRateRef = useRef(false);
    const eurobondCurrencyRef = useRef<EurobondCurrency>("USD");
    const isCreditCardLateInterest = calculator.slug === CREDIT_CARD_LATE_INTEREST_SLUG;
    const isEurobondCalculator = calculator.slug === EUROBOND_SLUG;
    const isTaxDelayInterest = calculator.slug === TAX_DELAY_INTEREST_SLUG;
    const isLgsScoreCalculator = calculator.slug === LGS_SCORE_SLUG;
    const isTytScoreCalculator = calculator.slug === TYT_SCORE_SLUG;
    const isUnemploymentBenefitCalculator = calculator.slug === UNEMPLOYMENT_BENEFIT_SLUG;
    const isConstructionAreaCalculator = calculator.slug === CONSTRUCTION_AREA_SLUG;
    const isStairCalculator = calculator.slug === STAIR_CALCULATOR_SLUG;
    const [constructionAreaPreset, setConstructionAreaPreset] = useState<ConstructionAreaPresetId>(
        CONSTRUCTION_AREA_CUSTOM_PRESET_ID
    );
    const eurobondCurrency = getEurobondCurrency(values);

    useEffect(() => {
        eurobondCurrencyRef.current = eurobondCurrency;
    }, [eurobondCurrency]);

    useEffect(() => {
        let nextValues = buildInitialValues(calculator, initialValues);
        if (calculator.slug === CREDIT_CARD_LATE_INTEREST_SLUG) {
            nextValues = {
                ...nextValues,
                ...getStoredCreditCardValues(),
            };
            skipNextPersistRef.current = true;
        }
        if (calculator.slug === TYT_SCORE_SLUG) {
            nextValues = {
                ...nextValues,
                ...getStoredTytValues(),
            };
            skipNextTytPersistRef.current = true;
        }

        dispatchValues({ type: "reset", values: nextValues });
        setErrorMessage(null);
        setTcmbFxStatus("idle");
        setTcmbFxWarning(null);
        setTcmbUsdTry(null);
        setTcmbEurTry(null);
        setConstructionAreaPreset(CONSTRUCTION_AREA_CUSTOM_PRESET_ID);
        hasUserOverriddenEurobondRateRef.current = false;
        hasTrackedStartRef.current = false;
        hasTrackedResultViewRef.current = false;
    }, [calculator, initialValues]);

    useEffect(() => {
        if (!isCreditCardLateInterest || typeof window === "undefined") {
            return;
        }

        if (skipNextPersistRef.current) {
            skipNextPersistRef.current = false;
            return;
        }

        try {
            window.sessionStorage.setItem(
                CREDIT_CARD_SESSION_STORAGE_KEY,
                JSON.stringify(pickCreditCardStorageValues(values))
            );
        } catch {
            // sessionStorage can be unavailable in strict privacy modes.
        }
    }, [isCreditCardLateInterest, values]);

    useEffect(() => {
        if (!isTytScoreCalculator || typeof window === "undefined") {
            return;
        }

        if (skipNextTytPersistRef.current) {
            skipNextTytPersistRef.current = false;
            return;
        }

        try {
            window.sessionStorage.setItem(
                TYT_FORM_STORAGE_KEY,
                JSON.stringify(pickTytStorageValues(values))
            );
        } catch {
            // sessionStorage can be unavailable in strict privacy modes.
        }
    }, [isTytScoreCalculator, values]);

    useEffect(() => {
        if (!isEurobondCalculator) {
            return;
        }

        let isCancelled = false;
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 3000);

        setTcmbFxStatus("loading");
        setTcmbFxWarning(null);

        void fetch("/api/tcmb-kur", { signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Kur alınamadı, manuel girin");
                }
                return response.json();
            })
            .then((data) => {
                if (isCancelled) {
                    return;
                }

                const usdTry = Number.parseFloat(String(data.usdTry));
                const eurTry = Number.parseFloat(String(data.eurTry));
                if (!Number.isFinite(usdTry)) {
                    throw new Error("Kur alınamadı, manuel girin");
                }

                const currency = eurobondCurrencyRef.current;
                setTcmbUsdTry(usdTry);
                setTcmbEurTry(Number.isFinite(eurTry) ? eurTry : null);
                setTcmbFxStatus("live");
                if (!hasUserOverriddenEurobondRateRef.current) {
                    dispatchValues({
                        type: "change",
                        id: "usdRate",
                        value: currency === "EUR" && Number.isFinite(eurTry) ? eurTry : usdTry,
                    });
                }
            })
            .catch(() => {
                if (isCancelled) {
                    return;
                }
                setTcmbFxStatus("manual");
                setTcmbFxWarning("Kur alınamadı, manuel girin");
            })
            .finally(() => {
                window.clearTimeout(timeout);
            });

        return () => {
            isCancelled = true;
            controller.abort();
            window.clearTimeout(timeout);
        };
    }, [isEurobondCalculator]);

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

    const trackCalculatorInteractionStart = (id: string) => {
        if (!hasTrackedStartRef.current) {
            hasTrackedStartRef.current = true;
            trackEvent("calculator_interaction_start", {
                calculator_slug: calculator.slug,
                calculator_category: calculator.category,
                locale: lang,
                input_id: id,
            });
        }
    };

    const handleInputChange = (id: string, value: any) => {
        trackCalculatorInteractionStart(id);

        if (isEurobondCalculator && id === "usdRate") {
            hasUserOverriddenEurobondRateRef.current = true;
            setTcmbFxStatus((current) => current === "live" ? "manual" : current);
            setTcmbFxWarning(null);
        }

        if (isConstructionAreaCalculator && (id === "taks" || id === "kaks")) {
            setConstructionAreaPreset(CONSTRUCTION_AREA_CUSTOM_PRESET_ID);
        }

        if (isTytScoreCalculator) {
            dispatchValues({
                type: "patch",
                values: getNormalizedTytInputPatch(values, id, value),
            });
            setTytCopyStatus("idle");
        } else {
            dispatchValues({ type: "change", id, value });
        }
        setErrorMessage(null);
    };

    const handleTaxDelayDatePatch = (patch: Record<string, any>, interactionId: string) => {
        trackCalculatorInteractionStart(interactionId);
        dispatchValues({ type: "patch", values: patch });
        setTytCopyStatus("idle");
        setErrorMessage(null);
    };

    const handleBankChange = (bankName: string) => {
        trackCalculatorInteractionStart("bankName");
        dispatchValues({
            type: "patch",
            values: {
                bankName,
                akdiFaiz: CREDIT_CARD_RATE_CAPS.akdiFaiz,
                gecikmeFaiz: CREDIT_CARD_RATE_CAPS.gecikmeFaiz,
            },
        });
        setErrorMessage(null);
    };

    const handleEurobondCurrencyChange = (currency: EurobondCurrency) => {
        trackCalculatorInteractionStart("eurobondCurrency");
        const tcmbRate = currency === "EUR" ? tcmbEurTry : tcmbUsdTry;
        hasUserOverriddenEurobondRateRef.current = false;
        dispatchValues({
            type: "patch",
            values: {
                eurobondCurrency: currency,
                ...(tcmbRate ? { usdRate: tcmbRate } : {}),
            },
        });
        if (tcmbRate) {
            setTcmbFxStatus("live");
            setTcmbFxWarning(null);
        }
        setErrorMessage(null);
    };

    const handleEurobondScenarioPriceSelect = (pricePercent: number) => {
        trackCalculatorInteractionStart("pricePercent");
        dispatchValues({ type: "change", id: "pricePercent", value: pricePercent });
        setErrorMessage(null);
    };

    const handleConstructionAreaPresetSelect = (presetId: ConstructionAreaPresetId) => {
        trackCalculatorInteractionStart(`construction_area_${presetId}_preset`);
        setConstructionAreaPreset(presetId);

        const preset = CONSTRUCTION_AREA_PRESETS.find((item) => item.id === presetId);
        if (preset) {
            dispatchValues({
                type: "patch",
                values: {
                    taks: preset.taks,
                    kaks: preset.kaks,
                },
            });
        }

        setErrorMessage(null);
    };

    const taxDelayDateStatus = useMemo(
        () => isTaxDelayInterest ? getTaxDelayDateStatus(values) : null,
        [isTaxDelayInterest, values]
    );
    const taxDelayInputBadges = taxDelayDateStatus?.hasDueDate && taxDelayDateStatus.calculatedDays !== null
        ? {
            delayDays: {
                label: `${taxDelayDateStatus.calculatedDays.toLocaleString("tr-TR")} gün gecikti`,
                className: "border-blue-200 bg-blue-50 text-blue-700",
            },
        }
        : undefined;
    const taxDelayDebtInputs = calculator.inputs.filter((input) => input.id === "taxDebt");
    const taxDelayRemainingInputs = calculator.inputs.filter((input) => input.id !== "taxDebt");
    const lgsExemptionDisabledInputs = isLgsScoreCalculator
        ? {
            din_d: Boolean(values.din_muaf),
            din_y: Boolean(values.din_muaf),
            dil_d: Boolean(values.dil_muaf),
            dil_y: Boolean(values.dil_muaf),
        }
        : undefined;
    const hasLgsExemption = isLgsScoreCalculator && (Boolean(values.din_muaf) || Boolean(values.dil_muaf));
    const tytScoreSet = useMemo(
        () => isTytScoreCalculator ? calculateTytScoreSet(values) : null,
        [isTytScoreCalculator, values]
    );
    const tytShareResult = tytScoreSet?.selected ?? null;
    const hasTytShareResult = Boolean(tytShareResult && tytShareResult.placementScore > 0);
    const [tytCopyStatus, setTytCopyStatus] = useState<"idle" | "copied" | "error">("idle");

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

    const applyTytPreset = (preset: "zero" | "average" | "max") => {
        trackCalculatorInteractionStart(`tyt_${preset}_preset`);

        const patch = preset === "zero"
            ? {
                turk_d: 0,
                turk_y: 0,
                sos_d: 0,
                sos_y: 0,
                mat_d: 0,
                mat_y: 0,
                fen_d: 0,
                fen_y: 0,
            }
            : preset === "average"
                ? {
                    turk_d: 18,
                    turk_y: 0,
                    sos_d: 12,
                    sos_y: 0,
                    mat_d: 8,
                    mat_y: 0,
                    fen_d: 7,
                    fen_y: 0,
                }
                : {
                    turk_d: 40,
                    turk_y: 0,
                    sos_d: 20,
                    sos_y: 0,
                    mat_d: 40,
                    mat_y: 0,
                    fen_d: 20,
                    fen_y: 0,
                };

        dispatchValues({ type: "patch", values: patch });
        setErrorMessage(null);
    };

    const buildTytShareText = () => {
        if (!tytShareResult) {
            return "";
        }

        const daysLeft = Math.max(0, getTytDaysLeft());

        return [
            "📊 2026 TYT Ön Hesabım",
            `Türkçe: ${formatTytShareNumber(tytShareResult.turkNet, 1, 0)} | Sosyal: ${formatTytShareNumber(tytShareResult.sosNet, 1, 0)} | Mat: ${formatTytShareNumber(tytShareResult.matNet, 1, 0)} | Fen: ${formatTytShareNumber(tytShareResult.fenNet, 1, 0)}`,
            `Ham TYT: ${formatTytShareNumber(tytShareResult.rawScore, 2)} | Y-TYT: ${formatTytShareNumber(tytShareResult.placementScore, 2)}`,
            `OBP katkısı: +${formatTytShareNumber(tytShareResult.obpContribution, 1)}`,
            `hesapmod.com ile hesaplandı — TYT'ye ${daysLeft.toLocaleString("tr-TR")} gün kaldı 💪`,
        ].join("\n");
    };

    const handleTytCopyShare = async () => {
        if (!hasTytShareResult || typeof navigator === "undefined" || !navigator.clipboard) {
            return;
        }

        try {
            await navigator.clipboard.writeText(buildTytShareText());
            setTytCopyStatus("copied");
            trackEvent("calculator_result_share", {
                calculator_slug: calculator.slug,
                locale: lang,
                method: "clipboard",
            });
        } catch {
            setTytCopyStatus("error");
        }
    };

    const handleTytWhatsAppShare = () => {
        if (!hasTytShareResult || typeof window === "undefined") {
            return;
        }

        const url = `https://wa.me/?text=${encodeURIComponent(buildTytShareText())}`;
        trackEvent("calculator_result_share", {
            calculator_slug: calculator.slug,
            locale: lang,
            method: "whatsapp",
        });
        window.open(url, "_blank");
    };

    if (isSpecialCalculatorSlug(calculator.slug)) {
        const SpecialCalculator = specialCalculatorComponents[calculator.slug];
        return <SpecialCalculator lang={lang} initialValues={initialValues} />;
    }

    return (
        <div className="space-y-6">
            {isTytScoreCalculator && <TytExamCountdownBanner lang={lang} />}

            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[#FFD7C7] sm:p-6">
                <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900">
                    {calculator.name[lang]}
                </h2>
                {isUnemploymentBenefitCalculator && (
                    <UnemploymentEligibilityAndPremiumPanel lang={lang} />
                )}
                {isTytScoreCalculator && (
                    <div className="mb-6 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => applyTytPreset("zero")}
                                className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                            >
                                Sıfırla
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTytPreset("average")}
                                className="min-h-11 rounded-xl border border-[#FFD7C7] bg-[#FFF3EE] px-4 py-2 text-sm font-bold text-[#CC4A1A] shadow-sm transition-colors hover:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                            >
                                Ortalama Doldur
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTytPreset("max")}
                                className="min-h-11 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm transition-colors hover:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                            >
                                Maksimum Doldur
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleTytCopyShare}
                                disabled={!hasTytShareResult}
                                className="min-h-11 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-800 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                            >
                                {tytCopyStatus === "copied"
                                    ? "Paylaşım Metni Kopyalandı"
                                    : tytCopyStatus === "error"
                                        ? "Kopyalanamadı"
                                        : "Paylaşım Metnini Kopyala"}
                            </button>
                            <button
                                type="button"
                                onClick={handleTytWhatsAppShare}
                                disabled={!hasTytShareResult}
                                className="min-h-11 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                            >
                                WhatsApp Paylaş
                            </button>
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}
                {isCreditCardLateInterest && (
                    <CreditCardBankSelect
                        value={String(values.bankName || "Diğer")}
                        onChange={handleBankChange}
                    />
                )}
                {isEurobondCalculator && (
                    <EurobondCurrencyToggle
                        value={eurobondCurrency}
                        onChange={handleEurobondCurrencyChange}
                    />
                )}
                {isConstructionAreaCalculator && (
                    <ConstructionAreaPresetButtons
                        selectedPreset={constructionAreaPreset}
                        onSelect={handleConstructionAreaPresetSelect}
                    />
                )}
                {isTaxDelayInterest ? (
                    <div className="space-y-6">
                        <CalculatorForm
                            inputs={taxDelayDebtInputs}
                            values={values}
                            onChange={handleInputChange}
                            lang={lang}
                            calculatorSlug={calculator.slug}
                        />
                        <TaxDelayDateControls
                            values={values}
                            onPatch={handleTaxDelayDatePatch}
                        />
                        <TaxHistoricalRatesAccordion values={values} />
                        <CalculatorForm
                            inputs={taxDelayRemainingInputs}
                            values={values}
                            onChange={handleInputChange}
                            lang={lang}
                            calculatorSlug={calculator.slug}
                            inputBadges={taxDelayInputBadges}
                            disabledInputs={{
                                delayDays: !taxDelayDateStatus?.isManualMode,
                            }}
                        />
                    </div>
                ) : (
                    <CalculatorForm
                        inputs={calculator.inputs}
                        values={values}
                        onChange={handleInputChange}
                        lang={lang}
                        calculatorSlug={calculator.slug}
                        inputBadges={isEurobondCalculator ? {
                            usdRate: tcmbFxStatus === "live"
                                ? {
                                    label: "Canlı TCMB kuru",
                                    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
                                }
                                : {
                                    label: "Manuel giriş",
                                    className: "border-slate-200 bg-slate-100 text-slate-600",
                                },
                        } : undefined}
                        inputLabelOverrides={isEurobondCalculator ? {
                            nominal: `Nominal Değer (${eurobondCurrency})`,
                            usdRate: `${eurobondCurrency}/TL Kuru`,
                        } : undefined}
                        inputSuffixOverrides={isEurobondCalculator ? {
                            nominal: eurobondCurrency,
                        } : undefined}
                        disabledInputs={lgsExemptionDisabledInputs}
                        inputTooltips={isConstructionAreaCalculator ? {
                            taks: "Genellikle 0.20 – 0.50 arasında. Belediyelere göre değişir.",
                            kaks: "Genellikle 0.80 – 3.00 arasında. Yoğun bölgelerde 4-5'e çıkabilir.",
                        } : undefined}
                    />
                )}
                {isConstructionAreaCalculator && (
                    <ConstructionAreaValidationMessages values={values} />
                )}
                {hasLgsExemption && (
                    <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs font-semibold leading-5 text-violet-950">
                        Bu dersten muaf öğrenciler için MEB, ilgili dersin puanını diğer testlerdeki performansa göre özel formülle hesaplar. Bu araç yaklaşık simülasyon sunar.
                    </div>
                )}
                {isEurobondCalculator && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium leading-5 text-slate-600 transition-all duration-300">
                        {tcmbFxWarning ?? (
                            tcmbFxStatus === "live"
                                ? `${eurobondCurrency}/TL TCMB alış kuru otomatik dolduruldu${tcmbEurTry ? `; EUR/TL ${formatTl(tcmbEurTry).replace(" TL", "")} olarak hazır.` : "."}`
                                : tcmbFxStatus === "loading"
                                    ? "TCMB kuru alınıyor..."
                                    : `${eurobondCurrency}/TL kurunu manuel girebilirsiniz.`
                        )}
                    </div>
                )}
                {isTytScoreCalculator && (
                    <TytComparisonTable
                        values={values}
                        lang={lang}
                    />
                )}
                {calculator.slug === "kredi-karti-gecikme-faizi-hesaplama" && (
                    <CreditCardLateInterestLiveGrid values={values} />
                )}
                {calculator.slug === EUROBOND_SLUG && (
                    <EurobondLiveResultGrid
                        values={values}
                        onSelectScenarioPrice={handleEurobondScenarioPriceSelect}
                    />
                )}
                </div>

                <div className="md:sticky md:top-24">
                {isTytScoreCalculator ? (
                    <TytSelectedResultPanel
                        values={values}
                        lang={lang}
                    />
                ) : isRuntimeLoading ? (
                    <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-100 p-8 shadow-sm animate-pulse">
                        <div className="h-5 w-28 rounded bg-slate-200" />
                        <div className="space-y-4">
                            <div className="h-16 rounded-2xl border border-slate-200 bg-white" />
                            <div className="h-16 rounded-2xl border border-slate-200 bg-white" />
                            <div className="h-16 rounded-2xl border border-slate-200 bg-white" />
                        </div>
                    </div>
                ) : isTaxDelayInterest ? (
                    <TaxDelayInterestResultPanel
                        values={values}
                        lang={lang}
                        onPatch={handleTaxDelayDatePatch}
                    />
                ) : isLgsScoreCalculator ? (
                    <LgsResultPanel
                        results={results}
                        lang={lang}
                    />
                ) : isUnemploymentBenefitCalculator ? (
                    <UnemploymentBenefitResultPanel
                        values={values}
                        lang={lang}
                    />
                ) : isConstructionAreaCalculator ? (
                    <ConstructionAreaResultPanel
                        values={values}
                        lang={lang}
                    />
                ) : isStairCalculator ? (
                    <StairCalculatorResultPanel
                        results={results}
                        lang={lang}
                    />
                ) : (
                    <>
                        <ResultBox
                            results={results}
                            config={calculator.results}
                            lang={lang}
                        />
                        {calculator.slug === CUSTOMS_DUTY_SLUG && (
                            <CustomsDutyResultExtras
                                values={values}
                                results={results}
                                lang={lang}
                            />
                        )}
                        <ConstructionMaterialList
                            calculator={calculator}
                            values={values}
                            results={results}
                            lang={lang}
                        />
                    </>
                )}
                </div>
            </div>
        </div>
    );
}
