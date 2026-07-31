"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { LanguageCode } from "@/lib/calculator-types";
import ConstructionMaterialList from "../ConstructionMaterialList";

type CementTemplateId = "wall" | "c20" | "screed" | "c25" | "manual";

type CementValues = {
    volumeM3: string;
    cementKgPerM3: string;
    bagKg: string;
    wasteRate: string;
    bagPriceTl: string;
};

type CementTemplate = {
    id: CementTemplateId;
    trLabel: string;
    enLabel: string;
    dosage?: number;
    wasteRate?: number;
};

const DEFAULT_BAG_KG = "50";

const INITIAL_VALUES: CementValues = {
    volumeM3: "5",
    cementKgPerM3: "300",
    bagKg: DEFAULT_BAG_KG,
    wasteRate: "5",
    bagPriceTl: "",
};

const EMPTY_VALUES: CementValues = {
    volumeM3: "",
    cementKgPerM3: "",
    bagKg: "",
    wasteRate: "",
    bagPriceTl: "",
};

const CEMENT_TEMPLATES: CementTemplate[] = [
    { id: "wall", trLabel: "🧱 Duvar Harcı", enLabel: "🧱 Wall Mortar", dosage: 350, wasteRate: 8 },
    { id: "c20", trLabel: "🏗 C20 Beton", enLabel: "🏗 C20 Concrete", dosage: 300, wasteRate: 5 },
    { id: "screed", trLabel: "🪟 Şap", enLabel: "🪟 Screed", dosage: 400, wasteRate: 10 },
    { id: "c25", trLabel: "💪 C25 Beton", enLabel: "💪 C25 Concrete", dosage: 350, wasteRate: 5 },
    { id: "manual", trLabel: "✏️ Manuel", enLabel: "✏️ Manual" },
];

const FIELD_LABELS = {
    tr: {
        volumeM3: "Hacim",
        cementKgPerM3: "Dozaj",
        bagKg: "Torba",
        wasteRate: "Fire",
        bagPriceTl: "Torba Fiyatı",
        resultTitle: "Sonuç",
        netCement: "NET ÇİMENTO",
        includingWaste: "Fire dahil",
        bagCount: "Torba sayısı",
        bagUnit: "torba",
        subtitle: "Şablonu seç, hacmi gir, torbayı gör.",
        estimatedCost: "Tahmini maliyet",
        priceHint: "Piyasa fiyatı yaklaşık 60-80 TL/torba arasında değişmektedir. Güncel fiyat için tedarikçinize sorun.",
        copyList: "📋 Listeyi Kopyala",
        copied: "✅ Kopyalandı!",
    },
    en: {
        volumeM3: "Volume",
        cementKgPerM3: "Dosage",
        bagKg: "Bag",
        wasteRate: "Waste",
        bagPriceTl: "Bag Price",
        resultTitle: "Result",
        netCement: "NET CEMENT",
        includingWaste: "Including waste",
        bagCount: "Bag count",
        bagUnit: "bags",
        subtitle: "Pick a template, enter volume, see bags.",
        estimatedCost: "Estimated cost",
        priceHint: "Market prices may vary. Ask your supplier for current pricing.",
        copyList: "📋 Copy List",
        copied: "✅ Copied!",
    },
};

function readNumber(value: string) {
    const parsed = Number.parseFloat(value.replace(",", "."));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function formatNumber(value: number, lang: LanguageCode) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    });
}

function formatOptionalInput(value: string, fallback: string) {
    return value.trim() ? value.replace(".", ",") : fallback;
}

function CementNumberInput({
    id,
    label,
    suffix,
    placeholder,
    value,
    step,
    onChange,
}: {
    id: keyof CementValues;
    label: string;
    suffix: string;
    placeholder?: string;
    value: string;
    step: string;
    onChange: (id: keyof CementValues, value: string) => void;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-black text-slate-700">
                {label}
            </span>
            <span className="relative block">
                <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step={step}
                    value={value}
                    onChange={(event) => onChange(id, event.target.value)}
                    placeholder={placeholder}
                    className="min-h-[52px] w-full rounded-lg border border-slate-300 bg-white px-3 pr-14 text-lg font-black text-slate-950 shadow-sm outline-none touch-manipulation transition-colors placeholder:text-slate-400 focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    {suffix}
                </span>
            </span>
        </label>
    );
}

export default function CementCalculator({ lang }: { lang: LanguageCode }) {
    const labels = FIELD_LABELS[lang];
    const [selectedTemplate, setSelectedTemplate] = useState<CementTemplateId>("c20");
    const [values, setValues] = useState<CementValues>(INITIAL_VALUES);
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

    const result = useMemo(() => {
        const volumeM3 = readNumber(values.volumeM3);
        const cementKgPerM3 = readNumber(values.cementKgPerM3);
        const bagKg = readNumber(values.bagKg);
        const wasteRate = readNumber(values.wasteRate);
        const bagPriceTl = readNumber(values.bagPriceTl);
        const netCementKg = volumeM3 * cementKgPerM3;
        const totalCementKg = netCementKg * (1 + wasteRate / 100);
        const bagCount = bagKg > 0 ? Math.ceil(totalCementKg / bagKg) : 0;
        const hasBagPrice = values.bagPriceTl.trim().length > 0 && bagPriceTl > 0;
        const estimatedCost = hasBagPrice ? bagCount * bagPriceTl : 0;

        return { netCementKg, totalCementKg, bagCount, bagPriceTl, hasBagPrice, estimatedCost };
    }, [values]);

    const applyTemplate = (template: CementTemplate) => {
        setSelectedTemplate(template.id);

        if (template.id === "manual") {
            setValues(EMPTY_VALUES);
            return;
        }

        setValues((current) => ({
            ...current,
            cementKgPerM3: String(template.dosage),
            bagKg: current.bagKg || DEFAULT_BAG_KG,
            wasteRate: String(template.wasteRate),
        }));
    };

    const updateValue = (id: keyof CementValues, value: string) => {
        if (id === "cementKgPerM3" || id === "wasteRate") {
            setSelectedTemplate("manual");
        }

        setValues((current) => ({
            ...current,
            [id]: value,
        }));
    };

    const buildShoppingList = () => {
        const costLine = result.hasBagPrice
            ? `${formatNumber(result.estimatedCost, lang)} TL`
            : "fiyat girilmedi";

        return [
            "🧱 Çimento Alışveriş Listesi",
            "━━━━━━━━━━━━━━━━━━",
            `Hacim: ${formatOptionalInput(values.volumeM3, "0")} m³ | Dozaj: ${formatOptionalInput(values.cementKgPerM3, "0")} kg/m³`,
            `Net: ${formatNumber(result.netCementKg, lang)} kg | Fire: %${formatOptionalInput(values.wasteRate, "0")}`,
            "━━━━━━━━━━━━━━━━━━",
            `Gerekli: ${formatNumber(result.bagCount, lang)} torba (${formatOptionalInput(values.bagKg, "0")} kg)`,
            `Tahmini maliyet: ${costLine}`,
            "━━━━━━━━━━━━━━━━━━",
            "hesapmod.com ile hesaplandı",
        ].join("\n");
    };

    const copyShoppingList = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
            return;
        }

        try {
            await navigator.clipboard.writeText(buildShoppingList());
            setCopyStatus("copied");
            window.setTimeout(() => setCopyStatus("idle"), 2000);
        } catch {
            setCopyStatus("idle");
        }
    };

    return (
        <section
            aria-label={lang === "tr" ? "Çimento hızlı hesaplama" : "Fast cement calculator"}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">
                        {lang === "tr" ? "Çimento Hesabı" : "Cement Calculator"}
                    </h2>
                    <p className="mt-1 text-base font-semibold text-slate-600">
                        {labels.subtitle}
                    </p>
                </div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#CC4A1A]">
                    {labels.resultTitle}
                </p>
            </div>

            <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0">
                {CEMENT_TEMPLATES.map((template) => {
                    const isActive = selectedTemplate === template.id;

                    return (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => applyTemplate(template)}
                            className={cn(
                                "min-h-[56px] min-w-[138px] rounded-lg border px-3 py-2 text-left text-base font-black shadow-sm touch-manipulation transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 sm:min-w-0 sm:text-center",
                                isActive
                                    ? "border-[#FF6B35] bg-[#FFF3EE] text-[#B83A12]"
                                    : "border-slate-200 bg-white text-slate-800 hover:border-[#FFD7C7] hover:bg-slate-50"
                            )}
                            aria-pressed={isActive}
                        >
                            {lang === "tr" ? template.trLabel : template.enLabel}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <CementNumberInput
                    id="volumeM3"
                    label={labels.volumeM3}
                    suffix="m³"
                    step="0.1"
                    value={values.volumeM3}
                    onChange={updateValue}
                />
                <CementNumberInput
                    id="cementKgPerM3"
                    label={labels.cementKgPerM3}
                    suffix="kg/m³"
                    step="5"
                    value={values.cementKgPerM3}
                    onChange={updateValue}
                />
                <CementNumberInput
                    id="bagKg"
                    label={labels.bagKg}
                    suffix="kg"
                    step="1"
                    value={values.bagKg}
                    onChange={updateValue}
                />
                <CementNumberInput
                    id="wasteRate"
                    label={labels.wasteRate}
                    suffix="%"
                    step="0.5"
                    value={values.wasteRate}
                    onChange={updateValue}
                />
                <div className="col-span-2">
                    <CementNumberInput
                        id="bagPriceTl"
                        label={`${labels.bagPriceTl} (TL)`}
                        suffix="TL"
                        step="1"
                        placeholder="50 ₺"
                        value={values.bagPriceTl}
                        onChange={updateValue}
                    />
                </div>
            </div>

            <div
                role="status"
                aria-live="polite"
                className="mt-4 overflow-hidden rounded-lg border-2 border-slate-900 bg-slate-950 text-white shadow-lg"
            >
                <div className="px-4 py-4">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-300">
                        {labels.netCement}
                    </p>
                    <p className="mt-1 text-4xl font-black tracking-tight text-white">
                        {formatNumber(result.netCementKg, lang)} kg
                    </p>
                </div>
                <div className="border-t border-white/15 px-4 py-3">
                    <p className="text-xl font-black text-slate-100">
                        {labels.includingWaste}: {formatNumber(result.totalCementKg, lang)} kg
                    </p>
                </div>
                <div className="border-t border-[#FFB199] bg-[#FFF3EE] px-4 py-5 text-slate-950">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B83A12]">
                        {labels.bagCount}
                    </p>
                    <p className="mt-1 text-5xl font-black leading-none tracking-tight text-[#B83A12] sm:text-6xl">
                        {formatNumber(result.bagCount, lang)} {labels.bagUnit} 🛍
                    </p>
                </div>
                <div className="border-t border-slate-200 bg-white px-4 py-4 text-slate-950">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                        {labels.estimatedCost}
                    </p>
                    {result.hasBagPrice ? (
                        <p className="mt-2 text-2xl font-black text-slate-950">
                            {formatNumber(result.bagCount, lang)} {labels.bagUnit} × {formatNumber(result.bagPriceTl, lang)} TL = {formatNumber(result.estimatedCost, lang)} TL
                        </p>
                    ) : (
                        <p className="mt-2 text-lg font-bold text-slate-600">
                            Torba fiyatı girersen maliyet burada görünür.
                        </p>
                    )}
                    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold leading-6 text-amber-950">
                        {labels.priceHint}
                    </p>
                    <button
                        type="button"
                        onClick={copyShoppingList}
                        className="mt-4 min-h-[52px] w-full rounded-lg bg-[#CC4A1A] px-4 py-3 text-lg font-black text-white shadow-sm touch-manipulation transition-colors hover:bg-[#B83A12] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/25"
                    >
                        {copyStatus === "copied" ? labels.copied : labels.copyList}
                    </button>
                </div>
            </div>

            <ConstructionMaterialList
                calculator={{
                    slug: "cimento-hesaplama",
                    category: "insaat-muhendislik",
                    name: { tr: "Çimento Hesaplama", en: "Cement Calculator" },
                }}
                values={values}
                results={result}
                lang={lang}
            />
        </section>
    );
}
