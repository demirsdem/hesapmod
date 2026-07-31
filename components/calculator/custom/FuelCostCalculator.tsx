"use client";

import React, { useMemo, useState } from "react";
import { Banknote, CalendarDays, Circle, Fuel, Gauge, Route, Truck, WalletCards, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguageCode } from "@/lib/calculator-types";

type FuelType = "gasoline" | "diesel" | "lpg" | "electric";
type RoutePresetId = "istanbul-ankara" | "istanbul-izmir" | "ankara-izmir" | "istanbul-antalya" | "ankara-antalya" | "custom";
type TripType = "oneWay" | "roundTrip";

type Values = {
    distance: number;
    consumption: number;
    unitPrice: number;
    monthlyKm: number;
};

type ComparisonConsumptionValues = Record<FuelType, number>;

const FUEL_OPTIONS: Array<{
    id: FuelType;
    label: Record<LanguageCode, string>;
    price: number;
    defaultConsumption: number;
    Icon: LucideIcon;
    tone: string;
}> = [
    {
        id: "gasoline",
        label: { tr: "Benzin", en: "Gasoline" },
        price: 65.02,
        defaultConsumption: 7,
        Icon: Fuel,
        tone: "text-orange-700",
    },
    {
        id: "diesel",
        label: { tr: "Motorin", en: "Diesel" },
        price: 67.48,
        defaultConsumption: 6.5,
        Icon: Truck,
        tone: "text-slate-700",
    },
    {
        id: "lpg",
        label: { tr: "LPG", en: "LPG" },
        price: 33.89,
        defaultConsumption: 8.5,
        Icon: Circle,
        tone: "text-sky-700",
    },
    {
        id: "electric",
        label: { tr: "Elektrik", en: "Electric" },
        price: 8.49,
        defaultConsumption: 15,
        Icon: Zap,
        tone: "text-emerald-700",
    },
];

const copy: Record<LanguageCode, {
    title: string;
    fuelType: string;
    distance: string;
    consumption: string;
    fuelPrice: string;
    electricityPrice: string;
    costPerKm: string;
    totalFuel: string;
    totalEnergy: string;
    totalCost: string;
    monthlyBudget: string;
    monthlyKm: string;
    monthlyCost: string;
    yearlyCost: string;
    routeTemplates: string;
    oneWay: string;
    roundTrip: string;
    includeToll: string;
    tollNote: string;
    fuelTotal: string;
    tollTotal: string;
    grandTotal: string;
    comparisonTitle: string;
    fuelColumn: string;
    unitPriceColumn: string;
    differenceColumn: string;
    reference: string;
    cheapest: string;
    cheaper: string;
    moreExpensive: string;
    evSavingsSummary: string;
    lpgSavingsSummary: string;
}> = {
    tr: {
        title: "Yakıt ve yol maliyeti",
        fuelType: "Yakıt tipi",
        distance: "Mesafe",
        consumption: "Ortalama Tüketim",
        fuelPrice: "Yakıt Fiyatı",
        electricityPrice: "Elektrik Fiyatı",
        costPerKm: "Km Başına",
        totalFuel: "Toplam Yakıt",
        totalEnergy: "Toplam Enerji",
        totalCost: "Toplam Maliyet",
        monthlyBudget: "Aylık bütçe",
        monthlyKm: "Ayda kaç km yapıyorum?",
        monthlyCost: "Aylık yakıt maliyeti",
        yearlyCost: "Yıllık yakıt maliyeti",
        routeTemplates: "Popüler rota şablonları",
        oneWay: "Gidiş",
        roundTrip: "Gidiş-Dönüş",
        includeToll: "Otoyol ücreti dahil",
        tollNote: "Otoyol ücretleri tahminidir, HGS kartı tipine göre değişir. Güncel tarife için KGM web sitesini kontrol edin.",
        fuelTotal: "Yakıt",
        tollTotal: "Otoyol",
        grandTotal: "Toplam",
        comparisonTitle: "Yakıt Tipi Karşılaştırması",
        fuelColumn: "Yakıt Tipi",
        unitPriceColumn: "Birim Fiyat",
        differenceColumn: "Fark",
        reference: "Referans",
        cheapest: "En ucuz",
        cheaper: "daha ucuz",
        moreExpensive: "daha pahalı",
        evSavingsSummary: "Bu seyahat için EV, benzinli araca göre",
        lpgSavingsSummary: "LPG, benzine göre",
    },
    en: {
        title: "Fuel and trip cost",
        fuelType: "Fuel type",
        distance: "Distance",
        consumption: "Average Consumption",
        fuelPrice: "Fuel Price",
        electricityPrice: "Electricity Price",
        costPerKm: "Cost Per Km",
        totalFuel: "Total Fuel",
        totalEnergy: "Total Energy",
        totalCost: "Total Cost",
        monthlyBudget: "Monthly budget",
        monthlyKm: "Monthly km",
        monthlyCost: "Monthly fuel cost",
        yearlyCost: "Yearly fuel cost",
        routeTemplates: "Popular route templates",
        oneWay: "One-way",
        roundTrip: "Round trip",
        includeToll: "Include highway toll",
        tollNote: "Highway tolls are estimates and may vary by HGS card type. Check the KGM website for the current tariff.",
        fuelTotal: "Fuel",
        tollTotal: "Toll",
        grandTotal: "Total",
        comparisonTitle: "Fuel Type Comparison",
        fuelColumn: "Fuel Type",
        unitPriceColumn: "Unit Price",
        differenceColumn: "Difference",
        reference: "Reference",
        cheapest: "Cheapest",
        cheaper: "cheaper",
        moreExpensive: "more expensive",
        evSavingsSummary: "For this trip, EV saves",
        lpgSavingsSummary: "LPG is",
    },
};

const initialFuelType: FuelType = "gasoline";
const initialValues: Values = {
    distance: 500,
    consumption: 7,
    unitPrice: 65.02,
    monthlyKm: 1500,
};

const initialComparisonConsumption: ComparisonConsumptionValues = {
    gasoline: 7,
    diesel: 6,
    lpg: 10,
    electric: 18,
};

const ROUTE_PRESETS: Array<{
    id: RoutePresetId;
    label: string;
    distance: number;
    toll: number;
}> = [
    { id: "istanbul-ankara", label: "İstanbul→Ankara", distance: 450, toll: 289 },
    { id: "istanbul-izmir", label: "İstanbul→İzmir", distance: 480, toll: 215 },
    { id: "ankara-izmir", label: "Ankara→İzmir", distance: 590, toll: 140 },
    { id: "istanbul-antalya", label: "İstanbul→Antalya", distance: 700, toll: 245 },
    { id: "ankara-antalya", label: "Ankara→Antalya", distance: 480, toll: 0 },
    { id: "custom", label: "Özel mesafe", distance: initialValues.distance, toll: 0 },
];

function getRoutePreset(routeId: RoutePresetId) {
    return ROUTE_PRESETS.find((route) => route.id === routeId) ?? ROUTE_PRESETS[ROUTE_PRESETS.length - 1];
}

function getFuelOption(fuelType: FuelType) {
    return FUEL_OPTIONS.find((option) => option.id === fuelType) ?? FUEL_OPTIONS[0];
}

function toNonNegativeNumber(value: string) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function formatTl(value: number) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} TL`;
}

function formatQuantity(value: number) {
    return value.toLocaleString("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    });
}

function formatReferencePrice(value: number, unit: string) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ${unit}`;
}

function formatPercent(value: number) {
    return `%${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })}`;
}

function NumberField({
    label,
    suffix,
    value,
    step = 0.1,
    onChange,
}: {
    label: string;
    suffix: string;
    value: number;
    step?: number;
    onChange: (value: number) => void;
}) {
    return (
        <label className="flex min-h-[112px] flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 transition-all focus-within:border-[#FF6B35] focus-within:ring-4 focus-within:ring-[#FF6B35]/10">
                <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={step}
                    value={value}
                    onChange={(event) => onChange(toNonNegativeNumber(event.target.value))}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-bold tabular-nums text-slate-950 outline-none"
                />
                <span className="shrink-0 text-sm font-semibold text-slate-500">{suffix}</span>
            </div>
        </label>
    );
}

function ResultCard({
    label,
    value,
    subValue,
    icon: Icon,
}: {
    label: string;
    value: string;
    subValue?: string;
    icon: LucideIcon;
}) {
    return (
        <article className="flex min-h-[148px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-600">{label}</p>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF3EE] text-[#CC4A1A]">
                    <Icon size={18} aria-hidden />
                </span>
            </div>
            <div>
                <p className="mt-4 break-words text-3xl font-black tabular-nums text-slate-950">{value}</p>
                {subValue && <p className="mt-2 text-xs font-semibold text-slate-500">{subValue}</p>}
            </div>
        </article>
    );
}

export default function FuelCostCalculator({ lang }: { lang: LanguageCode }) {
    const t = copy[lang];
    const [fuelType, setFuelType] = useState<FuelType>(initialFuelType);
    const [selectedRouteId, setSelectedRouteId] = useState<RoutePresetId>("custom");
    const [tripType, setTripType] = useState<TripType>("oneWay");
    const [includeToll, setIncludeToll] = useState(false);
    const [values, setValues] = useState<Values>(initialValues);
    const [comparisonConsumption, setComparisonConsumption] = useState<ComparisonConsumptionValues>(
        initialComparisonConsumption
    );

    const selectedRoute = getRoutePreset(selectedRouteId);
    const tripMultiplier = tripType === "roundTrip" ? 2 : 1;
    const tollCost = includeToll ? selectedRoute.toll * tripMultiplier : 0;
    const activeFuel = getFuelOption(fuelType);
    const ActiveFuelIcon = activeFuel.Icon;
    const isElectric = fuelType === "electric";
    const consumptionUnit = isElectric ? "kWh/100km" : "L/100km";
    const priceUnit = isElectric ? "TL/kWh" : "TL/L";
    const totalQuantityUnit = isElectric ? "kWh" : "litre";

    const results = useMemo(() => {
        const totalQuantity = (values.distance * values.consumption) / 100;
        const costPerKm = (values.consumption / 100) * values.unitPrice;
        const totalCost = totalQuantity * values.unitPrice;
        const monthlyCost = values.monthlyKm * costPerKm;
        const yearlyCost = monthlyCost * 12;
        const grandTotal = totalCost + tollCost;

        return {
            totalQuantity,
            costPerKm,
            totalCost,
            grandTotal,
            monthlyCost,
            yearlyCost,
        };
    }, [tollCost, values]);

    const comparisonRows = useMemo(() => {
        const rows = FUEL_OPTIONS.map((option) => {
            const consumption = comparisonConsumption[option.id];
            const costPerKm = (consumption / 100) * option.price;
            const totalCost = costPerKm * values.distance;

            return {
                ...option,
                consumption,
                consumptionUnit: option.id === "electric" ? "kWh/100km" : "L/100km",
                priceUnit: option.id === "electric" ? "TL/kWh" : "TL/L",
                costPerKm,
                totalCost,
            };
        });
        const cheapestTotal = Math.min(...rows.map((row) => row.totalCost));
        const gasolineTotal = rows.find((row) => row.id === "gasoline")?.totalCost ?? 0;

        return rows.map((row) => ({
            ...row,
            isCheapest: row.totalCost === cheapestTotal,
            differenceFromGasoline: gasolineTotal - row.totalCost,
        }));
    }, [comparisonConsumption, values.distance]);

    const comparisonSummary = useMemo(() => {
        const gasolineRow = comparisonRows.find((row) => row.id === "gasoline");
        const lpgRow = comparisonRows.find((row) => row.id === "lpg");
        const electricRow = comparisonRows.find((row) => row.id === "electric");
        const gasolineTotal = gasolineRow?.totalCost ?? 0;
        const gasolineCostPerKm = gasolineRow?.costPerKm ?? 0;
        const evSavings = gasolineTotal - (electricRow?.totalCost ?? 0);
        const lpgSavingsPercent = gasolineCostPerKm > 0 && lpgRow
            ? ((gasolineCostPerKm - lpgRow.costPerKm) / gasolineCostPerKm) * 100
            : 0;

        return {
            evSavings,
            lpgSavingsPercent,
        };
    }, [comparisonRows]);

    const updateValue = (key: keyof Values, value: number) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const applyRouteDistance = (routeId: RoutePresetId, nextTripType = tripType) => {
        const route = getRoutePreset(routeId);
        const multiplier = nextTripType === "roundTrip" ? 2 : 1;

        setSelectedRouteId(routeId);

        if (route.toll <= 0) {
            setIncludeToll(false);
        }

        if (routeId !== "custom") {
            setValues((current) => ({
                ...current,
                distance: route.distance * multiplier,
            }));
        }
    };

    const handleTripTypeChange = (nextTripType: TripType) => {
        setTripType(nextTripType);
        applyRouteDistance(selectedRouteId, nextTripType);
    };

    const updateComparisonConsumption = (key: FuelType, value: number) => {
        setComparisonConsumption((current) => ({ ...current, [key]: value }));
    };

    const handleFuelTypeChange = (nextFuelType: FuelType) => {
        const previousFuel = getFuelOption(fuelType);
        const nextFuel = getFuelOption(nextFuelType);

        setFuelType(nextFuelType);
        setValues((current) => ({
            ...current,
            consumption: current.consumption === previousFuel.defaultConsumption
                ? nextFuel.defaultConsumption
                : current.consumption,
            unitPrice: nextFuel.price,
        }));
    };

    return (
        <div className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">{t.routeTemplates}</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                            Seçim mesafeyi otomatik doldurur; özel mesafede manuel giriş yapabilirsiniz.
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1 sm:w-auto">
                        {([
                            { id: "oneWay" as const, label: t.oneWay },
                            { id: "roundTrip" as const, label: t.roundTrip },
                        ]).map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleTripTypeChange(option.id)}
                                aria-pressed={tripType === option.id}
                                className={cn(
                                    "min-h-10 rounded-md px-4 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                    tripType === option.id
                                        ? "bg-white text-[#CC4A1A] shadow-sm"
                                        : "text-slate-600 hover:bg-white"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {ROUTE_PRESETS.map((route) => {
                        const isActive = selectedRouteId === route.id;

                        return (
                            <button
                                key={route.id}
                                type="button"
                                onClick={() => applyRouteDistance(route.id)}
                                aria-pressed={isActive}
                                className={cn(
                                    "min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-black shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                    isActive
                                        ? "border-[#FF6B35] bg-[#FFF3EE] text-[#CC4A1A]"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#FFD7C7] hover:bg-white"
                                )}
                            >
                                <span className="block">{route.label}</span>
                                {route.id !== "custom" && (
                                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                                        {(route.distance * tripMultiplier).toLocaleString("tr-TR")} km
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className={cn(
                        "flex min-h-11 items-center gap-3 text-sm font-black",
                        selectedRoute.toll > 0 ? "cursor-pointer text-slate-800" : "cursor-not-allowed text-slate-400"
                    )}>
                        <input
                            type="checkbox"
                            checked={includeToll}
                            disabled={selectedRoute.toll <= 0}
                            onChange={(event) => setIncludeToll(event.target.checked)}
                            className="h-5 w-5 rounded border-slate-300 text-[#CC4A1A] focus:ring-[#FF6B35]"
                        />
                        <span>{t.includeToll}</span>
                        {selectedRoute.toll > 0 && (
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">
                                {formatTl(selectedRoute.toll * tripMultiplier)}
                            </span>
                        )}
                    </label>
                    <p className="text-xs font-medium leading-5 text-slate-500">
                        {t.tollNote}{" "}
                        <a
                            href="https://www.kgm.gov.tr/Sayfalar/KGM/SiteTr/Otoyollar/Ucretler.aspx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#CC4A1A] underline underline-offset-4 hover:text-[#E55A26]"
                        >
                            KGM
                        </a>
                    </p>
                </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">{t.title}</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{t.fuelType}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
                        <ActiveFuelIcon size={17} className={activeFuel.tone} aria-hidden />
                        {formatReferencePrice(activeFuel.price, priceUnit)}
                    </div>
                </div>

                <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label={t.fuelType}>
                    {FUEL_OPTIONS.map((option) => {
                        const Icon = option.Icon;
                        const isActive = option.id === fuelType;
                        const optionUnit = option.id === "electric" ? "TL/kWh" : "TL/L";

                        return (
                            <button
                                key={option.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => handleFuelTypeChange(option.id)}
                                className={cn(
                                    "flex min-h-[76px] items-center gap-3 rounded-lg border px-4 py-3 text-left shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                    isActive
                                        ? "border-[#FF6B35] bg-[#FFF3EE] text-[#CC4A1A]"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-[#FFD7C7] hover:bg-white"
                                )}
                            >
                                <span className={cn(
                                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                                    isActive ? "border-[#FFD7C7] bg-white" : "border-slate-200 bg-slate-50"
                                )}>
                                    <Icon size={19} className={option.tone} aria-hidden />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-black">{option.label[lang]}</span>
                                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                                        {formatReferencePrice(option.price, optionUnit)}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <NumberField
                        label={t.distance}
                        suffix="km"
                        value={values.distance}
                        step={1}
                        onChange={(value) => {
                            setSelectedRouteId("custom");
                            updateValue("distance", value);
                        }}
                    />
                    <NumberField
                        label={t.consumption}
                        suffix={consumptionUnit}
                        value={values.consumption}
                        onChange={(value) => updateValue("consumption", value)}
                    />
                    <NumberField
                        label={isElectric ? t.electricityPrice : t.fuelPrice}
                        suffix={priceUnit}
                        value={values.unitPrice}
                        onChange={(value) => updateValue("unitPrice", value)}
                    />
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3" aria-label="Sonuçlar">
                <ResultCard
                    label={t.costPerKm}
                    value={formatTl(results.costPerKm)}
                    subValue={isElectric ? "kWh maliyetiyle" : activeFuel.label[lang]}
                    icon={Gauge}
                />
                <ResultCard
                    label={isElectric ? t.totalEnergy : t.totalFuel}
                    value={`${formatQuantity(results.totalQuantity)} ${totalQuantityUnit}`}
                    icon={isElectric ? Zap : Fuel}
                />
                <ResultCard
                    label={t.totalCost}
                    value={formatTl(results.grandTotal)}
                    subValue={includeToll
                        ? `${t.fuelTotal}: ${formatTl(results.totalCost)} + ${t.tollTotal}: ${formatTl(tollCost)} = ${t.grandTotal}: ${formatTl(results.grandTotal)}`
                        : undefined}
                    icon={Banknote}
                />
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-slate-950">{t.comparisonTitle}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                            {values.distance.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} km mesafe için anlık karşılaştırma
                        </p>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
                        {t.cheapest}: {comparisonRows.find((row) => row.isCheapest)?.label[lang]}
                    </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-[860px] w-full border-collapse bg-white text-sm">
                        <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">{t.fuelColumn}</th>
                                <th className="px-4 py-3">{t.consumption}</th>
                                <th className="px-4 py-3">{t.unitPriceColumn}</th>
                                <th className="px-4 py-3">{t.costPerKm}</th>
                                <th className="px-4 py-3">{t.totalCost}</th>
                                <th className="px-4 py-3">{t.differenceColumn}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {comparisonRows.map((row) => {
                                const Icon = row.Icon;
                                const isGasoline = row.id === "gasoline";
                                const isCheaper = row.differenceFromGasoline >= 0;

                                return (
                                    <tr
                                        key={row.id}
                                        className={cn(
                                            "transition-colors",
                                            row.isCheapest ? "bg-emerald-50" : "bg-white"
                                        )}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "inline-flex h-9 w-9 items-center justify-center rounded-lg border",
                                                    row.isCheapest ? "border-emerald-200 bg-white" : "border-slate-200 bg-slate-50"
                                                )}>
                                                    <Icon size={18} className={row.tone} aria-hidden />
                                                </span>
                                                <div>
                                                    <p className="font-black text-slate-900">{row.label[lang]}</p>
                                                    {row.isCheapest && (
                                                        <p className="mt-0.5 text-xs font-black text-emerald-700">{t.cheapest}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <label className="flex h-11 w-44 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 focus-within:border-[#FF6B35] focus-within:ring-4 focus-within:ring-[#FF6B35]/10">
                                                <input
                                                    type="number"
                                                    inputMode="decimal"
                                                    min={0}
                                                    step={0.1}
                                                    value={row.consumption}
                                                    onChange={(event) => updateComparisonConsumption(row.id, toNonNegativeNumber(event.target.value))}
                                                    aria-label={`${row.label[lang]} ${t.consumption}`}
                                                    className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-right font-bold tabular-nums text-slate-950 outline-none"
                                                />
                                                <span className="shrink-0 text-xs font-bold text-slate-500">{row.consumptionUnit}</span>
                                            </label>
                                        </td>
                                        <td className="px-4 py-3 font-bold tabular-nums text-slate-700">
                                            {formatReferencePrice(row.price, row.priceUnit)}
                                        </td>
                                        <td className="px-4 py-3 font-black tabular-nums text-slate-950">
                                            {formatTl(row.costPerKm)}
                                        </td>
                                        <td className="px-4 py-3 font-black tabular-nums text-slate-950">
                                            {formatTl(row.totalCost)}
                                        </td>
                                        <td className={cn(
                                            "px-4 py-3 text-sm font-bold",
                                            isGasoline ? "text-slate-500" : isCheaper ? "text-emerald-700" : "text-red-700"
                                        )}>
                                            {isGasoline
                                                ? t.reference
                                                : `Benzin'den ${formatTl(Math.abs(row.differenceFromGasoline))} ${isCheaper ? t.cheaper : t.moreExpensive}`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-900">
                        {t.evSavingsSummary} {formatTl(Math.abs(comparisonSummary.evSavings))} {comparisonSummary.evSavings >= 0 ? "tasarruf sağlar" : "daha pahalıdır"}.
                    </div>
                    <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold leading-6 text-sky-950">
                        {t.lpgSavingsSummary} {formatPercent(Math.max(0, comparisonSummary.lpgSavingsPercent))} daha ekonomik.
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                        <CalendarDays size={19} aria-hidden />
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-slate-950">{t.monthlyBudget}</h3>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1fr)]">
                    <NumberField
                        label={t.monthlyKm}
                        suffix="km"
                        value={values.monthlyKm}
                        step={50}
                        onChange={(value) => updateValue("monthlyKm", value)}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ResultCard
                            label={t.monthlyCost}
                            value={formatTl(results.monthlyCost)}
                            icon={WalletCards}
                        />
                        <ResultCard
                            label={t.yearlyCost}
                            value={formatTl(results.yearlyCost)}
                            icon={Route}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
