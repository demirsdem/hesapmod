"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
    Banknote,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    ReceiptText,
    ShieldCheck,
    Timer,
    WalletCards,
    Plus,
    Trash2,
    type LucideIcon,
} from "lucide-react";
import type { LanguageCode } from "@/lib/calculator-types";
import { cn } from "@/lib/utils";
import type { KidemChartPoint } from "./KidemChart";

type Props = {
    lang: LanguageCode;
    initialValues?: Record<string, string | number>;
};

type SeveranceFormState = {
    ayrilisNedeni: EligibilityReason;
    brutMaas: string;
    calismaYili: string;
    ekAy: string;
    giydirilmisUcretAcik: boolean;
    yemekYardimi: string;
    yolYardimi: string;
    duzenliIkramiye: string;
    digerSurekliYardim: string;
    ekSurekliYardim: string;
    ekYardimlar: AdditionalAllowance[];
};

type AdditionalAllowance = {
    id: string;
    amount: string;
};

type EligibilityReason =
    | "employer"
    | "militaryMarriageRetirement"
    | "resignation"
    | "justified";

type NumericField = Exclude<
    keyof SeveranceFormState,
    "ayrilisNedeni" | "giydirilmisUcretAcik" | "ekYardimlar"
>;

type SeveranceResult = {
    toplamAy: number;
    brutMaas: number;
    giydirilmisUcret: number;
    yardimToplami: number;
    hesapUcret: number;
    standartBrutTazminat: number;
    brutTazminat: number;
    damgaVergisi: number;
    netTazminat: number;
    tavanUygulandimi: boolean;
    tavanFarki: number;
    giydirilmisArtis: number;
    giydirilmisUcretKullanildi: boolean;
};

const INPUT_DEBOUNCE_MS = 300;
const SESSION_STORAGE_KEY = "kidem-form";
const KIDEM_TAVAN_2026 = 64948.77;
const DAMGA_VERGISI_ORANI = 0.00759;
const DEFAULT_FORM_STATE: SeveranceFormState = {
    ayrilisNedeni: "employer",
    brutMaas: "50000",
    calismaYili: "5",
    ekAy: "6",
    giydirilmisUcretAcik: false,
    yemekYardimi: "",
    yolYardimi: "",
    duzenliIkramiye: "",
    digerSurekliYardim: "",
    ekSurekliYardim: "",
    ekYardimlar: [],
};

const KidemChart = dynamic(() => import("./KidemChart"), {
    ssr: false,
    loading: () => <div className="h-48 animate-pulse rounded-xl bg-slate-100" />,
});

const copy = {
    tr: {
        formTitle: "Kıdem bilgileri",
        resultTitle: "Sonuçlar",
        ceilingBannerSource: "Kaynak: ÇSGB",
        ceilingNextUpdate: "Sonraki güncelleme",
        eligibilityQuestion: "İşten ayrılış nedeniniz nedir?",
        eligibilityEmployer: "İşveren feshetti",
        eligibilityMilitaryMarriageRetirement: "Askerlik / evlilik / emeklilik",
        eligibilityResignation: "Kendi isteğimle ayrıldım",
        eligibilityJustified: "Haklı nedenle ayrıldım (mobbing vb.)",
        eligibilityEmployerMessage: "✅ Kıdem tazminatına hak kazanırsınız",
        eligibilityMilitaryMarriageRetirementMessage: "✅ Hak kazanırsınız (4857 Mad. 14)",
        eligibilityResignationMessage: "❌ İstifa durumunda kıdem tazminatı alınamaz (İstisna: haklı fesih hakkı doğuran haller)",
        eligibilityJustifiedMessage: "⚠ Hukuki değerlendirme gerekir — mahkeme onaylı haklı fesih kararı aranabilir",
        grossSalary: "Brüt Maaş",
        serviceYears: "Çalışma Yılı",
        extraMonths: "Ek Ay",
        dressedWageTitle: "Giydirilmiş Ücret Hesapla",
        dressedWageClosed: "İsteğe bağlı düzenli yan hakları ekleyin",
        mealAllowance: "Yemek Yardımı",
        transportAllowance: "Yol Yardımı",
        regularBonus: "Düzenli İkramiye",
        otherRecurringAllowance: "Diğer Sürekli Yardım",
        additionalAllowance: "Ek Yardım",
        addAllowance: "Ekle",
        removeAllowance: "Ek yardımı kaldır",
        monthlySuffix: "TL/ay",
        bonusSuffix: "TL/ay'a böl",
        dressedDifferenceTitle: "Giydirilmiş ücret dahil",
        difference: "fark",
        grossLabel: "Brüt",
        increase: "artış",
        dressedWageWarning: "Yardımların giydirilmiş ücrete dahil edilip edilmeyeceği düzenliliğine, sözleşme şartlarına ve yargı kararlarına göre değişebilir. Hukuki netlik için iş avukatına danışın.",
        timelineTitle: "Kıdem Birikimim Zaman Çizelgesi",
        timelineSummaryPrefix: "Her yıl çalışmanız yaklaşık",
        timelineSummarySuffix: "kıdem birikimine karşılık gelir",
        salaryBasis: "Hesap Ücreti",
        grossSeverance: "Brüt Tazminat",
        stampTax: "Damga Vergisi",
        netSeverance: "Net Tazminat",
        totalDuration: "Toplam Süre",
        ceilingStatus: "Tavan Durumu",
        underCeiling: "tavan altında",
        appliedCeilingSalary: "tavan uygulandı",
        wage: "ücret",
        afterStampTax: "damga vergisi sonrası",
        stampRate: "%0,759",
        month: "ay",
        year: "yıl",
        yearsShort: "yıl",
        monthsShort: "ay",
        ceilingNotApplied: "✅ Tavan uygulanmıyor",
        ceilingApplied: "⚠ Tavan uygulandı",
        ceilingDeductionPrefix: "64.948,77 TL üstü",
        ceilingDeductionSuffix: "tazminattan düşüldü",
        noSeveranceTitle: "❌ 12 ay tamamlanmadan kıdem tazminatı doğmaz",
        totalPeriod: "Toplam süre",
    },
    en: {
        formTitle: "Severance details",
        resultTitle: "Results",
        ceilingBannerSource: "Source: Ministry of Labor",
        ceilingNextUpdate: "Next update",
        eligibilityQuestion: "What is your reason for leaving?",
        eligibilityEmployer: "Employer terminated",
        eligibilityMilitaryMarriageRetirement: "Military service / marriage / retirement",
        eligibilityResignation: "I resigned voluntarily",
        eligibilityJustified: "I left for justified cause",
        eligibilityEmployerMessage: "✅ You are eligible for severance pay",
        eligibilityMilitaryMarriageRetirementMessage: "✅ You are eligible",
        eligibilityResignationMessage: "❌ Severance pay is not available after ordinary resignation (Exception: justified termination grounds)",
        eligibilityJustifiedMessage: "⚠ Legal assessment is required; court-approved justified termination may be sought",
        grossSalary: "Gross Salary",
        serviceYears: "Service Years",
        extraMonths: "Extra Months",
        dressedWageTitle: "Calculate Dressed Wage",
        dressedWageClosed: "Optionally add recurring benefits",
        mealAllowance: "Meal Allowance",
        transportAllowance: "Transport Allowance",
        regularBonus: "Regular Bonus",
        otherRecurringAllowance: "Other Recurring Benefit",
        additionalAllowance: "Additional Benefit",
        addAllowance: "Add",
        removeAllowance: "Remove additional benefit",
        monthlySuffix: "TRY/month",
        bonusSuffix: "TRY/month equivalent",
        dressedDifferenceTitle: "Including dressed wage",
        difference: "difference",
        grossLabel: "Gross",
        increase: "increase",
        dressedWageWarning: "Whether benefits are included in dressed wage may vary by regularity, contract terms, and court decisions. Consult an employment lawyer for legal certainty.",
        timelineTitle: "My Severance Accrual Timeline",
        timelineSummaryPrefix: "Each additional year of work is worth roughly",
        timelineSummarySuffix: "in severance accrual",
        salaryBasis: "Salary Basis",
        grossSeverance: "Gross Severance",
        stampTax: "Stamp Tax",
        netSeverance: "Net Severance",
        totalDuration: "Total Duration",
        ceilingStatus: "Ceiling Status",
        underCeiling: "below ceiling",
        appliedCeilingSalary: "ceiling applied",
        wage: "wage",
        afterStampTax: "after stamp tax",
        stampRate: "0.759%",
        month: "months",
        year: "years",
        yearsShort: "y",
        monthsShort: "m",
        ceilingNotApplied: "✅ Ceiling not applied",
        ceilingApplied: "⚠ Ceiling applied",
        ceilingDeductionPrefix: "Amount above 64,948.77 TRY",
        ceilingDeductionSuffix: "was excluded from severance",
        noSeveranceTitle: "❌ Severance pay does not arise before 12 months are completed",
        totalPeriod: "Total duration",
    },
} satisfies Record<LanguageCode, Record<string, string>>;

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebounced(value), delay);
        return () => window.clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
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

function normalizeNumberInput(
    value: string,
    options: {
        allowDecimal?: boolean;
        preferDotDecimal?: boolean;
        maxFractionDigits?: number;
        max?: number;
    } = {}
) {
    const allowDecimal = options.allowDecimal ?? true;
    const cleaned = value.replace(/[^\d,.-]/g, "").replace(/-/g, "");

    if (!cleaned) {
        return "";
    }

    if (!allowDecimal) {
        const parsed = Number.parseInt(cleaned.replace(/\D/g, ""), 10);
        const safeValue = Number.isFinite(parsed) ? parsed : 0;
        return String(options.max === undefined ? safeValue : Math.min(safeValue, options.max));
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

function formatInputDisplayValue(rawValue: string, locale: string) {
    if (!rawValue) {
        return "";
    }

    const decimalSeparator = locale === "tr-TR" ? "," : ".";
    const [integerPart, fractionPart] = rawValue.split(".");
    const integerDigits = integerPart.replace(/\D/g, "");
    const integerDisplay = (Number.parseInt(integerDigits || "0", 10) || 0).toLocaleString(locale, {
        maximumFractionDigits: 0,
    });

    if (fractionPart === undefined) {
        return integerDisplay;
    }

    return `${integerDisplay}${decimalSeparator}${fractionPart}`;
}

function formatMoney(value: number, locale: string) {
    return `${value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} TL`;
}

function formatInteger(value: number, locale: string) {
    return Math.round(value).toLocaleString(locale);
}

function formatServiceYears(totalMonths: number, locale: string) {
    return (totalMonths / 12).toLocaleString(locale, {
        minimumFractionDigits: Number.isInteger(totalMonths / 12) ? 0 : 1,
        maximumFractionDigits: 2,
    });
}

function formatChartYearLabel(year: number, locale: string) {
    return year.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    });
}

function hasInitialValue(initialValues: Props["initialValues"], key: string) {
    const value = initialValues?.[key];
    return value !== undefined && value !== null && value !== "";
}

function readInitialValue(initialValues: Props["initialValues"], key: string) {
    const value = initialValues?.[key];
    return value === undefined || value === null || value === "" ? undefined : String(value);
}

function normalizeBoolean(value: unknown, fallback: boolean) {
    return typeof value === "boolean" ? value : fallback;
}

function normalizeEligibilityReason(value: unknown): EligibilityReason {
    return value === "employer"
        || value === "militaryMarriageRetirement"
        || value === "resignation"
        || value === "justified"
        ? value
        : DEFAULT_FORM_STATE.ayrilisNedeni;
}

function normalizeAdditionalAllowances(value: unknown): AdditionalAllowance[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item, index) => {
            if (!item || typeof item !== "object") {
                return null;
            }

            const maybeAllowance = item as Partial<AdditionalAllowance>;
            return {
                id: typeof maybeAllowance.id === "string" && maybeAllowance.id
                    ? maybeAllowance.id
                    : `saved-${index}`,
                amount: maybeAllowance.amount === undefined || maybeAllowance.amount === null
                    ? ""
                    : String(maybeAllowance.amount),
            };
        })
        .filter((item): item is AdditionalAllowance => item !== null);
}

function getInitialOverrides(initialValues: Props["initialValues"]) {
    const overrides: Partial<SeveranceFormState> = {};

    if (hasInitialValue(initialValues, "brutMaas") || hasInitialValue(initialValues, "grossSalary")) {
        overrides.brutMaas =
            readInitialValue(initialValues, "brutMaas")
            ?? readInitialValue(initialValues, "grossSalary");
    }
    if (hasInitialValue(initialValues, "calismaYili") || hasInitialValue(initialValues, "years")) {
        overrides.calismaYili =
            readInitialValue(initialValues, "calismaYili")
            ?? readInitialValue(initialValues, "years");
    }
    if (hasInitialValue(initialValues, "ekAy") || hasInitialValue(initialValues, "months")) {
        overrides.ekAy =
            readInitialValue(initialValues, "ekAy")
            ?? readInitialValue(initialValues, "months");
    }

    return overrides;
}

function isSeveranceFormState(value: unknown): value is Partial<SeveranceFormState> {
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
        return isSeveranceFormState(parsed) ? parsed : undefined;
    } catch {
        return undefined;
    }
}

function buildFormState(
    initialValues: Props["initialValues"],
    savedState?: Partial<SeveranceFormState>
): SeveranceFormState {
    const merged = {
        ...DEFAULT_FORM_STATE,
        ...savedState,
        ...getInitialOverrides(initialValues),
    };

    return {
        ayrilisNedeni: normalizeEligibilityReason(merged.ayrilisNedeni),
        brutMaas: String(merged.brutMaas ?? DEFAULT_FORM_STATE.brutMaas),
        calismaYili: String(merged.calismaYili ?? DEFAULT_FORM_STATE.calismaYili),
        ekAy: String(merged.ekAy ?? DEFAULT_FORM_STATE.ekAy),
        giydirilmisUcretAcik: normalizeBoolean(
            merged.giydirilmisUcretAcik,
            DEFAULT_FORM_STATE.giydirilmisUcretAcik
        ),
        yemekYardimi: String(merged.yemekYardimi ?? DEFAULT_FORM_STATE.yemekYardimi),
        yolYardimi: String(merged.yolYardimi ?? DEFAULT_FORM_STATE.yolYardimi),
        duzenliIkramiye: String(merged.duzenliIkramiye ?? DEFAULT_FORM_STATE.duzenliIkramiye),
        digerSurekliYardim: String(merged.digerSurekliYardim ?? DEFAULT_FORM_STATE.digerSurekliYardim),
        ekSurekliYardim: String(merged.ekSurekliYardim ?? DEFAULT_FORM_STATE.ekSurekliYardim),
        ekYardimlar: normalizeAdditionalAllowances(merged.ekYardimlar),
    };
}

function TextField({
    id,
    label,
    value,
    suffix,
    icon: Icon,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    suffix?: string;
    icon: LucideIcon;
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
                    className={cn(
                        "h-12 w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20",
                        suffix ? "pr-28" : "pr-4"
                    )}
                />
                {suffix && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                        {suffix}
                    </span>
                )}
            </span>
        </label>
    );
}

function ResultCard({
    label,
    value,
    detail,
    icon: Icon,
    highlight,
    tone = "default",
}: {
    label: string;
    value: string;
    detail?: string;
    icon: LucideIcon;
    highlight?: boolean;
    tone?: "default" | "success" | "warning";
}) {
    return (
        <div
            className={cn(
                "min-h-[132px] rounded-lg border bg-white p-4 shadow-sm",
                highlight && "border-[#FFD7C7] bg-[#FFF7F3]",
                tone === "success" && "border-emerald-200 bg-emerald-50",
                tone === "warning" && "border-amber-200 bg-amber-50"
            )}
        >
            <div className="flex items-center gap-2">
                <Icon
                    size={18}
                    className={cn(
                        "shrink-0 text-slate-400",
                        highlight && "text-[#CC4A1A]",
                        tone === "success" && "text-emerald-700",
                        tone === "warning" && "text-amber-700"
                    )}
                    aria-hidden="true"
                />
                <p className="text-sm font-bold text-slate-600">{label}</p>
            </div>
            <p
                className={cn(
                    "mt-4 break-words text-2xl font-black tracking-normal text-slate-950",
                    highlight && "text-3xl text-[#CC4A1A]",
                    tone === "success" && "text-emerald-800",
                    tone === "warning" && "text-amber-800"
                )}
            >
                {value}
            </p>
            {detail && (
                <p className="mt-2 text-sm font-semibold leading-5 text-slate-500">
                    {detail}
                </p>
            )}
        </div>
    );
}

function ResultCardsSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }, (_, index) => (
                <div
                    key={index}
                    className="min-h-[132px] animate-pulse rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                    aria-hidden="true"
                >
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-5 h-7 w-36 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-28 rounded bg-slate-200" />
                </div>
            ))}
        </>
    );
}

function DressedWageDifferenceCard({
    result,
    locale,
    t,
}: {
    result: SeveranceResult;
    locale: string;
    t: Record<string, string>;
}) {
    return (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-950 shadow-sm">
            <p className="text-sm font-black leading-6">
                {t.dressedDifferenceTitle}: +{formatMoney(result.yardimToplami, locale)} {t.difference}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-blue-900">
                {t.grossLabel}: {formatMoney(result.standartBrutTazminat, locale)} →{" "}
                {formatMoney(result.brutTazminat, locale)} ({t.increase}: +{formatMoney(result.giydirilmisArtis, locale)})
            </p>
        </div>
    );
}

function CeilingUpdateBanner({
    locale,
    t,
}: {
    locale: string;
    t: Record<string, string>;
}) {
    const now = new Date();
    const donem = now.getMonth() < 6 ? "1 Ocak – 30 Haziran" : "1 Temmuz – 31 Aralık";
    const tavanYil = now.getFullYear();
    const sonrakiGuncelleme = now.getMonth() < 6
        ? `Temmuz ${tavanYil}`
        : `Ocak ${tavanYil + 1}`;

    return (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-blue-950 shadow-sm">
            <p>
                📋 {tavanYil} Tavan: {donem} {tavanYil} arası {formatMoney(KIDEM_TAVAN_2026, locale)}
            </p>
            <p className="mt-1 text-blue-800">
                {t.ceilingBannerSource} | {t.ceilingNextUpdate}: {sonrakiGuncelleme}
            </p>
        </div>
    );
}

function EligibilityPanel({
    selected,
    onChange,
    t,
}: {
    selected: EligibilityReason;
    onChange: (reason: EligibilityReason) => void;
    t: Record<string, string>;
}) {
    const options: Array<{ value: EligibilityReason; label: string }> = [
        { value: "employer", label: t.eligibilityEmployer },
        { value: "militaryMarriageRetirement", label: t.eligibilityMilitaryMarriageRetirement },
        { value: "resignation", label: t.eligibilityResignation },
        { value: "justified", label: t.eligibilityJustified },
    ];
    const notice = {
        employer: {
            text: t.eligibilityEmployerMessage,
            className: "border-emerald-200 bg-emerald-50 text-emerald-800",
        },
        militaryMarriageRetirement: {
            text: t.eligibilityMilitaryMarriageRetirementMessage,
            className: "border-emerald-200 bg-emerald-50 text-emerald-800",
        },
        resignation: {
            text: t.eligibilityResignationMessage,
            className: "border-red-200 bg-red-50 text-red-800",
        },
        justified: {
            text: t.eligibilityJustifiedMessage,
            className: "border-amber-200 bg-amber-50 text-amber-900",
        },
    } satisfies Record<EligibilityReason, { text: string; className: string }>;

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">
                {t.eligibilityQuestion}
            </p>
            <div className="mt-3 grid gap-2">
                {options.map((option) => {
                    const isSelected = selected === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                isSelected
                                    ? "border-[#FFD7C7] bg-[#FFF3EE] text-[#CC4A1A]"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <span
                                className={cn(
                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                    isSelected ? "border-[#CC4A1A]" : "border-slate-300"
                                )}
                                aria-hidden="true"
                            >
                                {isSelected && <span className="h-2 w-2 rounded-full bg-[#CC4A1A]" />}
                            </span>
                            {option.label}
                        </button>
                    );
                })}
            </div>
            <p className={cn("mt-3 rounded-lg border px-3 py-2 text-xs font-black leading-5", notice[selected].className)}>
                {notice[selected].text}
            </p>
        </div>
    );
}

function formatDuration(totalMonths: number, locale: string, t: Record<string, string>) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
        return `${formatInteger(months, locale)} ${t.monthsShort}`;
    }

    if (months === 0) {
        return `${formatInteger(years, locale)} ${t.yearsShort}`;
    }

    return `${formatInteger(years, locale)} ${t.yearsShort} ${formatInteger(months, locale)} ${t.monthsShort}`;
}

export default function SeverancePayCalculator({
    lang,
    initialValues,
}: Props) {
    const t = copy[lang];
    const locale = lang === "tr" ? "tr-TR" : "en-US";
    const [formState, setFormState] = useState<SeveranceFormState>(() =>
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

        try {
            window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(formState));
        } catch {
            // sessionStorage can be unavailable in strict privacy modes.
        }
    }, [formState, isResultReady]);

    const updateNumberField = (
        key: NumericField,
        options?: Parameters<typeof normalizeNumberInput>[1]
    ) => (value: string) => {
        setFormState((current) => ({
            ...current,
            [key]: normalizeNumberInput(value, options),
        }));
    };

    const addAdditionalAllowance = () => {
        setFormState((current) => ({
            ...current,
            ekYardimlar: [
                ...current.ekYardimlar,
                {
                    id: `allowance-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    amount: "",
                },
            ],
        }));
    };

    const updateAdditionalAllowance = (id: string, value: string) => {
        setFormState((current) => ({
            ...current,
            ekYardimlar: current.ekYardimlar.map((allowance) =>
                allowance.id === id
                    ? { ...allowance, amount: normalizeNumberInput(value) }
                    : allowance
            ),
        }));
    };

    const removeAdditionalAllowance = (id: string) => {
        setFormState((current) => ({
            ...current,
            ekYardimlar: current.ekYardimlar.filter((allowance) => allowance.id !== id),
        }));
    };

    const brutMaasInput = formState.brutMaas;
    const calismaYiliInput = formState.calismaYili;
    const ekAyInput = formState.ekAy;
    const yemekYardimiInput = formState.yemekYardimi;
    const yolYardimiInput = formState.yolYardimi;
    const duzenliIkramiyeInput = formState.duzenliIkramiye;
    const digerSurekliYardimInput = formState.digerSurekliYardim;
    const ekSurekliYardimInput = formState.ekSurekliYardim;
    const ekYardimlarInput = formState.ekYardimlar;

    const displayValues = useMemo(() => ({
        brutMaas: formatInputDisplayValue(brutMaasInput, locale),
        calismaYili: formatInputDisplayValue(calismaYiliInput, locale),
        ekAy: formatInputDisplayValue(ekAyInput, locale),
        yemekYardimi: formatInputDisplayValue(yemekYardimiInput, locale),
        yolYardimi: formatInputDisplayValue(yolYardimiInput, locale),
        duzenliIkramiye: formatInputDisplayValue(duzenliIkramiyeInput, locale),
        digerSurekliYardim: formatInputDisplayValue(digerSurekliYardimInput, locale),
        ekSurekliYardim: formatInputDisplayValue(ekSurekliYardimInput, locale),
        ekYardimlar: ekYardimlarInput.map((allowance) => ({
            id: allowance.id,
            amount: formatInputDisplayValue(allowance.amount, locale),
        })),
    }), [
        brutMaasInput,
        calismaYiliInput,
        ekAyInput,
        yemekYardimiInput,
        yolYardimiInput,
        duzenliIkramiyeInput,
        digerSurekliYardimInput,
        ekSurekliYardimInput,
        ekYardimlarInput,
        locale,
    ]);

    const debouncedBrutMaas = useDebounce(brutMaasInput, INPUT_DEBOUNCE_MS);
    const debouncedCalismaYili = useDebounce(calismaYiliInput, INPUT_DEBOUNCE_MS);
    const debouncedEkAy = useDebounce(ekAyInput, INPUT_DEBOUNCE_MS);
    const debouncedYemekYardimi = useDebounce(yemekYardimiInput, INPUT_DEBOUNCE_MS);
    const debouncedYolYardimi = useDebounce(yolYardimiInput, INPUT_DEBOUNCE_MS);
    const debouncedDuzenliIkramiye = useDebounce(duzenliIkramiyeInput, INPUT_DEBOUNCE_MS);
    const debouncedDigerSurekliYardim = useDebounce(digerSurekliYardimInput, INPUT_DEBOUNCE_MS);
    const debouncedEkSurekliYardim = useDebounce(ekSurekliYardimInput, INPUT_DEBOUNCE_MS);
    const debouncedEkYardimlar = useDebounce(ekYardimlarInput, INPUT_DEBOUNCE_MS);

    const brutMaas = clampNonNegative(parseLocalizedNumber(debouncedBrutMaas));
    const calismaYili = Math.floor(clampNonNegative(parseLocalizedNumber(debouncedCalismaYili)));
    const ekAy = Math.min(11, Math.floor(clampNonNegative(parseLocalizedNumber(debouncedEkAy))));
    const currentToplamAy = useMemo(() => (calismaYili * 12) + ekAy, [calismaYili, ekAy]);

    const yardimToplami = useMemo(() => {
        if (!formState.giydirilmisUcretAcik) {
            return 0;
        }

        return [
            debouncedYemekYardimi,
            debouncedYolYardimi,
            debouncedDuzenliIkramiye,
            debouncedDigerSurekliYardim,
            debouncedEkSurekliYardim,
            ...debouncedEkYardimlar.map((allowance) => allowance.amount),
        ].reduce((total, value) => total + clampNonNegative(parseLocalizedNumber(value)), 0);
    }, [
        formState.giydirilmisUcretAcik,
        debouncedYemekYardimi,
        debouncedYolYardimi,
        debouncedDuzenliIkramiye,
        debouncedDigerSurekliYardim,
        debouncedEkSurekliYardim,
        debouncedEkYardimlar,
    ]);
    const giydirilmisUcret = brutMaas + yardimToplami;
    const hesaplamaBazUcreti = formState.giydirilmisUcretAcik
        ? giydirilmisUcret
        : brutMaas;

    const result = useMemo<SeveranceResult | null>(() => {
        const toplamAy = (calismaYili * 12) + ekAy;
        if (toplamAy < 12) return null;

        const tavan = KIDEM_TAVAN_2026;
        const hesapUcret = Math.min(hesaplamaBazUcreti, tavan);
        const standartHesapUcret = Math.min(brutMaas, tavan);
        const standartBrutTazminat = standartHesapUcret * (toplamAy / 12);
        const brutTazminat = hesapUcret * (toplamAy / 12);
        const damgaVergisi = brutTazminat * DAMGA_VERGISI_ORANI;
        const netTazminat = brutTazminat - damgaVergisi;
        const tavanUygulandimi = hesaplamaBazUcreti > tavan;
        const tavanFarki = tavanUygulandimi
            ? (hesaplamaBazUcreti - tavan) * (toplamAy / 12)
            : 0;
        const giydirilmisArtis = Math.max(0, brutTazminat - standartBrutTazminat);

        return {
            toplamAy,
            brutMaas,
            giydirilmisUcret,
            yardimToplami,
            hesapUcret,
            standartBrutTazminat,
            brutTazminat,
            damgaVergisi,
            netTazminat,
            tavanUygulandimi,
            tavanFarki,
            giydirilmisArtis,
            giydirilmisUcretKullanildi: formState.giydirilmisUcretAcik,
        };
    }, [
        brutMaas,
        calismaYili,
        ekAy,
        formState.giydirilmisUcretAcik,
        giydirilmisUcret,
        yardimToplami,
        hesaplamaBazUcreti,
    ]);

    const chartData = useMemo<KidemChartPoint[]>(() => {
        return Array.from({ length: 15 }, (_, i) => {
            const yil = Math.max(0, (calismaYili + ekAy / 12) + i);
            const brutT = Math.min(hesaplamaBazUcreti, KIDEM_TAVAN_2026) * yil;

            return {
                yil: `${Math.max(1, Math.floor(yil))}. yıl`,
                tooltipLabel: `${formatChartYearLabel(yil, locale)} yılda`,
                brut: Math.round(brutT),
                net: Math.round(brutT * (1 - DAMGA_VERGISI_ORANI)),
                isCurrent: i === 0,
            };
        });
    }, [hesaplamaBazUcreti, calismaYili, ekAy, locale]);
    const annualAccrual = useMemo(() => {
        return Math.round(
            Math.min(hesaplamaBazUcreti, KIDEM_TAVAN_2026) * (1 - DAMGA_VERGISI_ORANI)
        );
    }, [hesaplamaBazUcreti]);

    const visibleResult = isResultReady ? result : undefined;

    return (
        <div className="space-y-4">
            <CeilingUpdateBanner locale={locale} t={t} />

            <section className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <h2 className="text-lg font-black text-slate-950">{t.formTitle}</h2>

                    <div className="mt-5">
                        <EligibilityPanel
                            selected={formState.ayrilisNedeni}
                            onChange={(ayrilisNedeni) =>
                                setFormState((current) => ({
                                    ...current,
                                    ayrilisNedeni,
                                }))
                            }
                            t={t}
                        />
                    </div>

                    <div className="mt-5 grid gap-4">
                    <TextField
                        id="severance-gross-salary"
                        label={t.grossSalary}
                        value={displayValues.brutMaas}
                        suffix="TL"
                        icon={Banknote}
                        onChange={updateNumberField("brutMaas")}
                    />
                    <TextField
                        id="severance-service-years"
                        label={t.serviceYears}
                        value={displayValues.calismaYili}
                        suffix={t.year}
                        icon={BriefcaseBusiness}
                        onChange={updateNumberField("calismaYili", { allowDecimal: false })}
                    />
                    <TextField
                        id="severance-extra-months"
                        label={t.extraMonths}
                        value={displayValues.ekAy}
                        suffix={t.month}
                        icon={CalendarDays}
                        onChange={updateNumberField("ekAy", { allowDecimal: false, max: 11 })}
                    />
                </div>

                <div className="mt-5 border-t border-slate-200 pt-5">
                    <button
                        type="button"
                        aria-expanded={formState.giydirilmisUcretAcik}
                        aria-controls="severance-dressed-wage-panel"
                        onClick={() =>
                            setFormState((current) => ({
                                ...current,
                                giydirilmisUcretAcik: !current.giydirilmisUcretAcik,
                            }))
                        }
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-2 text-left outline-none transition-colors hover:text-[#CC4A1A] focus:ring-4 focus:ring-[#FF6B35]/20"
                    >
                        <span>
                            <span className="block text-sm font-black text-slate-950">
                                {t.dressedWageTitle}
                            </span>
                            <span className="mt-1 block text-xs font-semibold text-slate-500">
                                {t.dressedWageClosed}
                            </span>
                        </span>
                        <ChevronDown
                            size={20}
                            className={cn(
                                "shrink-0 text-slate-500 transition-transform",
                                formState.giydirilmisUcretAcik && "rotate-180"
                            )}
                            aria-hidden="true"
                        />
                    </button>

                    {formState.giydirilmisUcretAcik && (
                        <div id="severance-dressed-wage-panel" className="mt-4 grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField
                                    id="severance-meal-allowance"
                                    label={t.mealAllowance}
                                    value={displayValues.yemekYardimi}
                                    suffix={t.monthlySuffix}
                                    icon={WalletCards}
                                    onChange={updateNumberField("yemekYardimi")}
                                />
                                <TextField
                                    id="severance-transport-allowance"
                                    label={t.transportAllowance}
                                    value={displayValues.yolYardimi}
                                    suffix={t.monthlySuffix}
                                    icon={WalletCards}
                                    onChange={updateNumberField("yolYardimi")}
                                />
                                <TextField
                                    id="severance-regular-bonus"
                                    label={t.regularBonus}
                                    value={displayValues.duzenliIkramiye}
                                    suffix={t.bonusSuffix}
                                    icon={Banknote}
                                    onChange={updateNumberField("duzenliIkramiye")}
                                />
                                <TextField
                                    id="severance-other-recurring"
                                    label={t.otherRecurringAllowance}
                                    value={displayValues.digerSurekliYardim}
                                    suffix={t.monthlySuffix}
                                    icon={WalletCards}
                                    onChange={updateNumberField("digerSurekliYardim")}
                                />
                                <TextField
                                    id="severance-extra-recurring"
                                    label={t.additionalAllowance}
                                    value={displayValues.ekSurekliYardim}
                                    suffix={t.monthlySuffix}
                                    icon={Plus}
                                    onChange={updateNumberField("ekSurekliYardim")}
                                />
                            </div>

                            {ekYardimlarInput.map((allowance, index) => (
                                <div
                                    key={allowance.id}
                                    className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_44px] sm:items-end"
                                >
                                    <TextField
                                        id={`severance-extra-allowance-${allowance.id}`}
                                        label={`${t.additionalAllowance} ${index + 2}`}
                                        value={displayValues.ekYardimlar[index]?.amount ?? ""}
                                        suffix={t.monthlySuffix}
                                        icon={Plus}
                                        onChange={(value) => updateAdditionalAllowance(allowance.id, value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAdditionalAllowance(allowance.id)}
                                        className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                                        aria-label={t.removeAllowance}
                                    >
                                        <Trash2 size={18} aria-hidden="true" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addAdditionalAllowance}
                                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-[#FFD7C7] bg-white px-4 text-sm font-black text-[#CC4A1A] shadow-sm transition-colors hover:bg-[#FFF3EE] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                            >
                                <Plus size={17} aria-hidden="true" />
                                + {t.addAllowance}
                            </button>

                            {visibleResult && (
                                <DressedWageDifferenceCard
                                    result={visibleResult}
                                    locale={locale}
                                    t={t}
                                />
                            )}

                            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-900">
                                {t.dressedWageWarning}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="rounded-lg border border-slate-200 bg-slate-100 p-5 shadow-sm"
                aria-live="polite"
            >
                <h2 className="text-lg font-black text-slate-950">{t.resultTitle}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleResult === undefined ? (
                        <ResultCardsSkeleton />
                    ) : visibleResult === null ? (
                        <div className="sm:col-span-2 xl:col-span-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-900 shadow-sm">
                            <p className="text-base font-black leading-6">
                                {t.noSeveranceTitle}
                            </p>
                            <p className="mt-2 text-sm font-semibold">
                                ({t.totalPeriod}: {formatInteger(currentToplamAy, locale)} {t.month})
                            </p>
                        </div>
                    ) : (
                        <>
                            <ResultCard
                                label={t.salaryBasis}
                                value={formatMoney(visibleResult.hesapUcret, locale)}
                                detail={`(${visibleResult.tavanUygulandimi ? t.appliedCeilingSalary : t.underCeiling})`}
                                icon={WalletCards}
                            />
                            <ResultCard
                                label={t.grossSeverance}
                                value={formatMoney(visibleResult.brutTazminat, locale)}
                                detail={`(${formatServiceYears(visibleResult.toplamAy, locale)} ${t.year} × ${t.wage})`}
                                icon={Banknote}
                            />
                            <ResultCard
                                label={t.stampTax}
                                value={formatMoney(visibleResult.damgaVergisi, locale)}
                                detail={`(${t.stampRate})`}
                                icon={ReceiptText}
                            />
                            <ResultCard
                                label={t.netSeverance}
                                value={formatMoney(visibleResult.netTazminat, locale)}
                                detail={`(${t.afterStampTax})`}
                                icon={ShieldCheck}
                                highlight
                            />
                            <ResultCard
                                label={t.totalDuration}
                                value={formatDuration(visibleResult.toplamAy, locale, t)}
                                detail={`(${formatInteger(visibleResult.toplamAy, locale)} ${t.month})`}
                                icon={Timer}
                            />
                            <ResultCard
                                label={t.ceilingStatus}
                                value={visibleResult.tavanUygulandimi ? t.ceilingApplied : t.ceilingNotApplied}
                                detail={visibleResult.tavanUygulandimi
                                    ? `${t.ceilingDeductionPrefix} ${formatMoney(visibleResult.tavanFarki, locale)} ${t.ceilingDeductionSuffix}`
                                    : undefined}
                                icon={ShieldCheck}
                                tone={visibleResult.tavanUygulandimi ? "warning" : "success"}
                            />
                        </>
                    )}
                </div>

                {visibleResult && (
                    <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-black text-slate-950">
                            {t.timelineTitle}
                        </h3>
                        <div className="mt-3 overflow-x-auto">
                            <div className="h-64 min-w-[680px]">
                                <KidemChart data={chartData} locale={locale} />
                            </div>
                        </div>
                        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-700">
                            {t.timelineSummaryPrefix} {formatMoney(annualAccrual, locale)}{" "}
                            {t.timelineSummarySuffix}
                        </p>
                    </div>
                )}
                </div>
            </section>
        </div>
    );
}
