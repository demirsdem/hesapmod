"use client";

import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
    AlertTriangle,
    Banknote,
    Bitcoin,
    Building2,
    ChevronDown,
    CircleDollarSign,
    Clipboard,
    Coins,
    Gauge,
    Gem,
    Landmark,
    Layers,
    Package,
    Pencil,
    Plus,
    Share2,
    ShieldCheck,
    Trash2,
    TrendingUp,
    Trophy,
    WalletCards,
} from "lucide-react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

type Lang = "tr" | "en";
type RiskLevel = "low" | "medium" | "high" | "unknown";
type HhiRiskLevel = "diversified" | "moderate" | "concentrated";
type TargetTemplateId = "conservative" | "balanced" | "aggressive";
type TargetGroupId = "cashDeposit" | "goldFx" | "stockFund" | "crypto" | "other";
type PredefinedAssetId =
    | "cash"
    | "deposit"
    | "stocks"
    | "funds"
    | "gold"
    | "fx"
    | "crypto"
    | "bond"
    | "realEstate"
    | "commodity"
    | "other";
type AssetIconKey =
    | "cash"
    | "deposit"
    | "stocks"
    | "funds"
    | "gold"
    | "fx"
    | "crypto"
    | "bond"
    | "realEstate"
    | "commodity"
    | "other"
    | "custom";

type AssetDefinition = {
    id: PredefinedAssetId;
    label: { tr: string; en: string };
    color: string;
    risk: RiskLevel;
    iconKey: AssetIconKey;
};

type PortfolioAsset = {
    id: string;
    categoryId: PredefinedAssetId | "custom";
    name: string;
    amount: number;
    color: string;
    risk: RiskLevel;
    iconKey: AssetIconKey;
    removable: boolean;
    custom?: boolean;
};

type PortfolioRow = PortfolioAsset & {
    weight: number;
};

type PortfolioAction =
    | { type: "ADD_ASSET"; asset: PortfolioAsset }
    | { type: "REMOVE_ASSET"; id: string }
    | { type: "UPDATE_AMOUNT"; id: string; amount: number }
    | { type: "HYDRATE_ASSETS"; assets: PortfolioAsset[] };

type TargetGroup = {
    id: TargetGroupId;
    label: { tr: string; en: string };
    increaseAction: { tr: string; en: string };
    decreaseAction: { tr: string; en: string };
};

type TargetComparisonRow = {
    id: TargetGroupId;
    label: string;
    currentPercent: number;
    targetPercent: number;
    differencePercent: number;
    deltaAmount: number;
};

const STORAGE_KEY = "portfoy-varliklar";

const predefinedAssetDefinitions: Record<PredefinedAssetId, AssetDefinition> = {
    cash: { id: "cash", label: { tr: "Nakit", en: "Cash" }, color: "#64748b", risk: "low", iconKey: "cash" },
    deposit: { id: "deposit", label: { tr: "Mevduat", en: "Deposit" }, color: "#10b981", risk: "low", iconKey: "deposit" },
    stocks: { id: "stocks", label: { tr: "Hisse Senedi", en: "Stocks" }, color: "#2563eb", risk: "high", iconKey: "stocks" },
    funds: { id: "funds", label: { tr: "Fon/ETF", en: "Fund/ETF" }, color: "#8b5cf6", risk: "medium", iconKey: "funds" },
    gold: { id: "gold", label: { tr: "Altın", en: "Gold" }, color: "#f59e0b", risk: "medium", iconKey: "gold" },
    fx: { id: "fx", label: { tr: "Döviz", en: "FX" }, color: "#0891b2", risk: "medium", iconKey: "fx" },
    crypto: { id: "crypto", label: { tr: "Kripto", en: "Crypto" }, color: "#ef4444", risk: "high", iconKey: "crypto" },
    bond: { id: "bond", label: { tr: "Tahvil", en: "Bond" }, color: "#0d9488", risk: "medium", iconKey: "bond" },
    realEstate: { id: "realEstate", label: { tr: "Gayrimenkul", en: "Real Estate" }, color: "#15803d", risk: "medium", iconKey: "realEstate" },
    commodity: { id: "commodity", label: { tr: "Emtia", en: "Commodity" }, color: "#d97706", risk: "medium", iconKey: "commodity" },
    other: { id: "other", label: { tr: "Diğer", en: "Other" }, color: "#a855f7", risk: "unknown", iconKey: "other" },
};

const initialAssetIds: PredefinedAssetId[] = ["cash", "deposit", "stocks", "gold"];
const addableAssetIds: PredefinedAssetId[] = ["funds", "fx", "crypto", "bond", "realEstate", "commodity", "other"];
const defaultAmounts: Partial<Record<PredefinedAssetId, number>> = {
    cash: 25000,
    deposit: 75000,
    stocks: 120000,
    gold: 60000,
};
const customColors = ["#0ea5e9", "#db2777", "#7c3aed", "#16a34a", "#ea580c", "#475569"];

const targetGroups: TargetGroup[] = [
    {
        id: "cashDeposit",
        label: { tr: "Nakit+Mevduat", en: "Cash+Deposit" },
        increaseAction: { tr: "Nakit+Mevduat artırmanız", en: "increase Cash+Deposit" },
        decreaseAction: { tr: "Nakit+Mevduat çözmeniz", en: "reduce Cash+Deposit" },
    },
    {
        id: "goldFx",
        label: { tr: "Altın+Döviz", en: "Gold+FX" },
        increaseAction: { tr: "Altın+Döviz artırmanız", en: "increase Gold+FX" },
        decreaseAction: { tr: "Altın+Döviz azaltmanız", en: "reduce Gold+FX" },
    },
    {
        id: "stockFund",
        label: { tr: "Hisse+Fon", en: "Stocks+Funds" },
        increaseAction: { tr: "Hisse+Fon satın almanız", en: "buy Stocks+Funds" },
        decreaseAction: { tr: "Hisse+Fon azaltmanız", en: "reduce Stocks+Funds" },
    },
    {
        id: "crypto",
        label: { tr: "Kripto", en: "Crypto" },
        increaseAction: { tr: "Kripto artırmanız", en: "increase Crypto" },
        decreaseAction: { tr: "Kripto azaltmanız", en: "reduce Crypto" },
    },
    {
        id: "other",
        label: { tr: "Diğer", en: "Other" },
        increaseAction: { tr: "Diğer varlıkları artırmanız", en: "increase Other assets" },
        decreaseAction: { tr: "Diğer varlıkları azaltmanız", en: "reduce Other assets" },
    },
];

const targetTemplates: Array<{
    id: TargetTemplateId;
    label: { tr: string; en: string };
    allocations: Record<TargetGroupId, number>;
}> = [
    {
        id: "conservative",
        label: { tr: "Muhafazakâr", en: "Conservative" },
        allocations: { cashDeposit: 50, goldFx: 30, stockFund: 20, crypto: 0, other: 0 },
    },
    {
        id: "balanced",
        label: { tr: "Dengeli", en: "Balanced" },
        allocations: { cashDeposit: 25, goldFx: 20, stockFund: 45, crypto: 10, other: 0 },
    },
    {
        id: "aggressive",
        label: { tr: "Agresif", en: "Aggressive" },
        allocations: { cashDeposit: 10, goldFx: 10, stockFund: 55, crypto: 25, other: 0 },
    },
];

const assetIconMap: Record<AssetIconKey, typeof Banknote> = {
    cash: Banknote,
    deposit: Landmark,
    stocks: TrendingUp,
    funds: Layers,
    gold: Gem,
    fx: CircleDollarSign,
    crypto: Bitcoin,
    bond: Coins,
    realEstate: Building2,
    commodity: Package,
    other: WalletCards,
    custom: Pencil,
};

const copy = {
    tr: {
        title: "Portföy varlıkları",
        summary: "Özet",
        chartTitle: "Varlık dağılımı",
        noData: "Grafik için pozitif tutar girin.",
        totalValue: "Toplam portföy değeri",
        topAsset: "En ağır varlık",
        lowRiskShare: "Düşük riskli oran",
        highRiskShare: "Yüksek riskli oran",
        noAsset: "Yok",
        tableAsset: "Varlık",
        tableAmount: "Tutar (TL)",
        tableWeight: "Ağırlık (%)",
        tableRisk: "Risk Sınıfı",
        total: "Toplam",
        lowRisk: "Düşük Risk",
        mediumRisk: "Orta Risk",
        highRisk: "Yüksek Risk",
        unknownRisk: "Belirsiz",
        tooltipAmount: "Tutar",
        tooltipWeight: "Ağırlık",
        riskScore: "Risk Skoru",
        hhiLabel: "HHI",
        diversified: "İyi çeşitlendirilmiş",
        moderateConcentration: "Orta yoğunlaşma",
        highConcentration: "Yüksek yoğunlaşma",
        concentrationContributors: "Yoğunlaşmaya katkı yapan varlıklar",
        noConcentrationContributors: "%30 üzeri ağırlığa sahip varlık yok.",
        singleAssetWarning: "⚠️ Portföyün yarısından fazlası tek varlıkta",
        volatileAssetWarning: "⚠️ Volatil varlık oranı yüksek",
        conservativeWarning: "ℹ️ Portföy çok muhafazakâr — reel getiri riski",
        addAsset: "Varlık Ekle",
        customAsset: "Özel...",
        customNamePlaceholder: "Varlık adı",
        addCustom: "Ekle",
        amountSuffix: "TL",
        removeAsset: "Varlığı sil",
        cashLocked: "Nakit silinemez",
        sharePortfolio: "Portföyümü Paylaş",
        copySummary: "Özet kopyala",
        copied: "Kopyalandı!",
        targetComparisonTitle: "Hedef Dağılım Karşılaştırması",
        currentPercent: "Mevcut %",
        targetPercent: "Hedef %",
        difference: "Fark",
        targetActionPrefix: "Hedef dağılıma ulaşmak için",
        targetActionSuffix: "gerekiyor.",
        targetActionNoAmount: "Hedef karşılaştırması için portföy tutarı girin.",
        targetActionAligned: "Mevcut dağılım hedefe çok yakın.",
        targetDisclaimer: "Not: Bu yatırım tavsiyesi değil, matematiksel karşılaştırmadır.",
    },
    en: {
        title: "Portfolio assets",
        summary: "Summary",
        chartTitle: "Asset allocation",
        noData: "Enter a positive amount for the chart.",
        totalValue: "Total portfolio value",
        topAsset: "Largest asset",
        lowRiskShare: "Low-risk share",
        highRiskShare: "High-risk share",
        noAsset: "None",
        tableAsset: "Asset",
        tableAmount: "Amount (TL)",
        tableWeight: "Weight (%)",
        tableRisk: "Risk Class",
        total: "Total",
        lowRisk: "Low Risk",
        mediumRisk: "Medium Risk",
        highRisk: "High Risk",
        unknownRisk: "Unclear",
        tooltipAmount: "Amount",
        tooltipWeight: "Weight",
        riskScore: "Risk Score",
        hhiLabel: "HHI",
        diversified: "Well diversified",
        moderateConcentration: "Moderate concentration",
        highConcentration: "High concentration",
        concentrationContributors: "Assets contributing to concentration",
        noConcentrationContributors: "No asset has a weight above 30%.",
        singleAssetWarning: "⚠️ More than half of the portfolio is in one asset",
        volatileAssetWarning: "⚠️ Volatile asset share is high",
        conservativeWarning: "ℹ️ Portfolio is very conservative — real-return risk",
        addAsset: "Add Asset",
        customAsset: "Custom...",
        customNamePlaceholder: "Asset name",
        addCustom: "Add",
        amountSuffix: "TL",
        removeAsset: "Remove asset",
        cashLocked: "Cash cannot be removed",
        sharePortfolio: "Share Portfolio",
        copySummary: "Copy summary",
        copied: "Copied!",
        targetComparisonTitle: "Target Allocation Comparison",
        currentPercent: "Current %",
        targetPercent: "Target %",
        difference: "Difference",
        targetActionPrefix: "To reach the target allocation, you need to",
        targetActionSuffix: ".",
        targetActionNoAmount: "Enter a portfolio amount to compare against a target.",
        targetActionAligned: "The current allocation is very close to the target.",
        targetDisclaimer: "Note: This is not investment advice; it is a mathematical comparison.",
    },
};

const riskBadgeClass: Record<RiskLevel, string> = {
    low: "border-emerald-200 bg-emerald-50 text-emerald-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    high: "border-red-200 bg-red-50 text-red-700",
    unknown: "border-slate-200 bg-slate-100 text-slate-600",
};

const hhiToneClass: Record<HhiRiskLevel, { card: string; badge: string; text: string; warning: string }> = {
    diversified: {
        card: "border-emerald-200 bg-emerald-50",
        badge: "border-emerald-200 bg-white text-emerald-700",
        text: "text-emerald-950",
        warning: "border-emerald-200 bg-white/80 text-emerald-800",
    },
    moderate: {
        card: "border-amber-200 bg-amber-50",
        badge: "border-amber-200 bg-white text-amber-700",
        text: "text-amber-950",
        warning: "border-amber-200 bg-white/80 text-amber-800",
    },
    concentrated: {
        card: "border-red-200 bg-red-50",
        badge: "border-red-200 bg-white text-red-700",
        text: "text-red-950",
        warning: "border-red-200 bg-white/80 text-red-800",
    },
};

function createPredefinedAsset(assetId: PredefinedAssetId, lang: Lang, amount = 0): PortfolioAsset {
    const definition = predefinedAssetDefinitions[assetId];

    return {
        id: assetId,
        categoryId: assetId,
        name: definition.label[lang],
        amount,
        color: definition.color,
        risk: definition.risk,
        iconKey: definition.iconKey,
        removable: assetId !== "cash",
    };
}

function createInitialAssets(lang: Lang) {
    return initialAssetIds.map((assetId) => createPredefinedAsset(assetId, lang, defaultAmounts[assetId] ?? 0));
}

function createCustomAsset(name: string, existingCount: number): PortfolioAsset {
    const safeName = name.trim();
    const color = customColors[existingCount % customColors.length];

    return {
        id: `custom-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        categoryId: "custom",
        name: safeName,
        amount: 0,
        color,
        risk: "unknown",
        iconKey: "custom",
        removable: true,
        custom: true,
    };
}

function hydrateStoredAssets(rawAssets: unknown, lang: Lang) {
    if (!Array.isArray(rawAssets)) {
        return null;
    }

    const hydrated = rawAssets
        .map((item): PortfolioAsset | null => {
            if (!item || typeof item !== "object") {
                return null;
            }

            const candidate = item as Partial<PortfolioAsset>;
            const amount = Math.max(0, Number.parseFloat(String(candidate.amount)) || 0);

            if (candidate.categoryId && candidate.categoryId !== "custom" && candidate.categoryId in predefinedAssetDefinitions) {
                return createPredefinedAsset(candidate.categoryId, lang, amount);
            }

            if (candidate.categoryId === "custom" && typeof candidate.name === "string" && candidate.name.trim()) {
                return {
                    id: typeof candidate.id === "string" && candidate.id ? candidate.id : `custom-${Date.now()}`,
                    categoryId: "custom",
                    name: candidate.name.trim(),
                    amount,
                    color: typeof candidate.color === "string" && candidate.color ? candidate.color : customColors[0],
                    risk: "unknown",
                    iconKey: "custom",
                    removable: true,
                    custom: true,
                };
            }

            return null;
        })
        .filter((asset): asset is PortfolioAsset => Boolean(asset));

    const uniqueAssets = hydrated.filter((asset, index, assets) => (
        asset.categoryId === "custom"
            ? assets.findIndex((item) => item.id === asset.id) === index
            : assets.findIndex((item) => item.categoryId === asset.categoryId) === index
    ));
    const cashAsset = uniqueAssets.find((asset) => asset.categoryId === "cash");
    const withCash = cashAsset
        ? uniqueAssets.map((asset) => asset.categoryId === "cash" ? { ...asset, removable: false } : asset)
        : [createPredefinedAsset("cash", lang, defaultAmounts.cash), ...uniqueAssets];

    return withCash.length > 0 ? withCash : null;
}

function normalizeAssetName(value: string) {
    return value
        .trim()
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "");
}

function resolvePredefinedAssetId(name: string): PredefinedAssetId | null {
    const normalized = normalizeAssetName(name);
    const aliases: Record<string, PredefinedAssetId> = {
        nakit: "cash",
        cash: "cash",
        mevduat: "deposit",
        deposit: "deposit",
        hisse: "stocks",
        hissesenedi: "stocks",
        stocks: "stocks",
        stock: "stocks",
        fon: "funds",
        fonetf: "funds",
        fund: "funds",
        funds: "funds",
        etf: "funds",
        altin: "gold",
        gold: "gold",
        doviz: "fx",
        fx: "fx",
        kripto: "crypto",
        crypto: "crypto",
        tahvil: "bond",
        bond: "bond",
        gayrimenkul: "realEstate",
        realestate: "realEstate",
        emtia: "commodity",
        commodity: "commodity",
        diger: "other",
        other: "other",
    };

    return aliases[normalized] ?? null;
}

function sanitizeUrlAssetName(name: string) {
    return name.replace(/[:,]/g, " ").replace(/\s+/g, " ").trim();
}

function parseUrlAssets(value: string, lang: Lang) {
    if (!value.trim()) {
        return null;
    }

    const parsedAssets: PortfolioAsset[] = [];

    value.split(",").forEach((item) => {
        const [rawName, ...amountParts] = item.split(":");
        const name = rawName?.trim();
        const amount = Math.max(0, Number.parseFloat(amountParts.join(":").replace(/\s/g, "")) || 0);
        if (!name) return;

        const predefinedId = resolvePredefinedAssetId(name);
        if (predefinedId) {
            const existing = parsedAssets.find((asset) => asset.categoryId === predefinedId);
            if (existing) {
                existing.amount += amount;
            } else {
                parsedAssets.push(createPredefinedAsset(predefinedId, lang, amount));
            }
            return;
        }

        const existingCustom = parsedAssets.find((asset) => (
            asset.categoryId === "custom"
            && normalizeAssetName(asset.name) === normalizeAssetName(name)
        ));
        if (existingCustom) {
            existingCustom.amount += amount;
        } else {
            parsedAssets.push({
                ...createCustomAsset(name, parsedAssets.length),
                amount,
            });
        }
    });

    if (!parsedAssets.some((asset) => asset.categoryId === "cash")) {
        parsedAssets.unshift(createPredefinedAsset("cash", lang, 0));
    }

    return parsedAssets.length > 0 ? parsedAssets : null;
}

function buildShareUrl(assets: PortfolioAsset[]) {
    if (typeof window === "undefined") return "";

    const url = new URL(window.location.href);
    const value = assets
        .map((asset) => `${sanitizeUrlAssetName(asset.name)}:${Math.round(asset.amount * 100) / 100}`)
        .join(",");

    url.search = "";
    url.searchParams.set("v", value);
    return url.toString();
}

function portfolioReducer(state: PortfolioAsset[], action: PortfolioAction): PortfolioAsset[] {
    switch (action.type) {
        case "ADD_ASSET":
            if (action.asset.categoryId !== "custom" && state.some((asset) => asset.categoryId === action.asset.categoryId)) {
                return state;
            }
            if (action.asset.categoryId === "custom" && state.some((asset) => asset.name.toLocaleLowerCase("tr-TR") === action.asset.name.toLocaleLowerCase("tr-TR"))) {
                return state;
            }
            return [...state, action.asset];
        case "REMOVE_ASSET":
            return state.filter((asset) => asset.id === "cash" || asset.id !== action.id);
        case "UPDATE_AMOUNT":
            return state.map((asset) => (
                asset.id === action.id
                    ? { ...asset, amount: Math.max(0, action.amount) }
                    : asset
            ));
        case "HYDRATE_ASSETS":
            return action.assets;
        default:
            return state;
    }
}

function riskLabel(risk: RiskLevel, lang: Lang) {
    const t = copy[lang];
    if (risk === "low") return t.lowRisk;
    if (risk === "medium") return t.mediumRisk;
    if (risk === "high") return t.highRisk;
    return t.unknownRisk;
}

function hhiRiskLevel(hhi: number): HhiRiskLevel {
    if (hhi < 0.15) return "diversified";
    if (hhi < 0.25) return "moderate";
    return "concentrated";
}

function hhiRiskLabel(level: HhiRiskLevel, lang: Lang) {
    const t = copy[lang];
    if (level === "diversified") return t.diversified;
    if (level === "moderate") return t.moderateConcentration;
    return t.highConcentration;
}

function formatCurrency(value: number) {
    return `${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })} TL`;
}

function formatPercent(value: number) {
    return `%${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatHhi(value: number) {
    return value.toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDifferencePercent(value: number) {
    const sign = value >= 0 ? "+" : "-";
    return `${sign}${Math.abs(value).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}%`;
}

function readPositiveNumber(value: string) {
    return Math.max(0, Number.parseFloat(value) || 0);
}

function getTargetGroupId(categoryId: PortfolioAsset["categoryId"]): TargetGroupId {
    if (categoryId === "cash" || categoryId === "deposit") return "cashDeposit";
    if (categoryId === "gold" || categoryId === "fx") return "goldFx";
    if (categoryId === "stocks" || categoryId === "funds") return "stockFund";
    if (categoryId === "crypto") return "crypto";
    return "other";
}

function joinActionParts(parts: string[]) {
    return parts.join(", ");
}

function CustomLabel({ viewBox, total }: { viewBox?: { cx?: number; cy?: number }; total: number }) {
    const cx = viewBox?.cx ?? 0;
    const cy = viewBox?.cy ?? 0;

    return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
            <tspan x={cx} dy="-0.35em" className="fill-slate-500 text-[11px] font-semibold">
                Toplam:
            </tspan>
            <tspan x={cx} dy="1.45em" className="fill-slate-950 text-sm font-black">
                {formatCurrency(total)}
            </tspan>
        </text>
    );
}

function AssetIcon({ asset, size = 18 }: { asset: Pick<PortfolioAsset, "color" | "iconKey">; size?: number }) {
    const Icon = assetIconMap[asset.iconKey] ?? WalletCards;

    return (
        <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${asset.color}18`, color: asset.color }}
        >
            <Icon size={size} />
        </span>
    );
}

function PortfolioTooltip({
    active,
    payload,
    lang,
}: {
    active?: boolean;
    payload?: Array<{ payload?: PortfolioRow }>;
    lang: Lang;
}) {
    if (!active || !payload?.length || !payload[0]?.payload) {
        return null;
    }

    const row = payload[0].payload;
    const t = copy[lang];

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
            <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                {row.name}
            </div>
            <div className="mt-2 space-y-1 text-slate-600">
                <div className="flex min-w-44 justify-between gap-6">
                    <span>{t.tooltipAmount}</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(row.amount)}</span>
                </div>
                <div className="flex min-w-44 justify-between gap-6">
                    <span>{t.tooltipWeight}</span>
                    <span className="font-semibold text-slate-900">{formatPercent(row.weight)}</span>
                </div>
            </div>
        </div>
    );
}

function AssetRow({
    asset,
    weight,
    lang,
    onAmountChange,
    onRemove,
}: {
    asset: PortfolioAsset;
    weight: number;
    lang: Lang;
    onAmountChange: (value: number) => void;
    onRemove: () => void;
}) {
    const t = copy[lang];

    return (
        <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:grid-cols-[40px_minmax(0,1fr)_minmax(96px,128px)_66px_34px] sm:items-center sm:p-3">
            <div className="flex min-w-0 items-center gap-3 sm:contents">
                <AssetIcon asset={asset} />
                <div className="min-w-0">
                    <div className="truncate text-sm font-black text-slate-900">{asset.name}</div>
                    <div className="mt-0.5 text-xs font-semibold text-slate-500">{riskLabel(asset.risk, lang)}</div>
                </div>
            </div>

            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 transition focus-within:border-[#FF6B35] focus-within:ring-4 focus-within:ring-[#FF6B35]/10">
                <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={asset.amount || ""}
                    onChange={(event) => onAmountChange(readPositiveNumber(event.target.value))}
                    className="h-10 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none sm:text-base"
                />
                <span className="shrink-0 text-sm font-medium text-slate-500">{t.amountSuffix}</span>
            </div>

            <div className="flex h-10 min-w-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-1.5 text-xs font-black tabular-nums text-slate-900 sm:text-sm">
                {formatPercent(weight)}
            </div>

            <button
                type="button"
                onClick={onRemove}
                disabled={!asset.removable}
                title={asset.removable ? t.removeAsset : t.cashLocked}
                aria-label={asset.removable ? `${asset.name} ${t.removeAsset}` : t.cashLocked}
                className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 sm:h-[34px] sm:w-[34px]",
                    asset.removable
                        ? "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
                )}
            >
                <Trash2 size={17} />
            </button>
        </div>
    );
}

function AddAssetMenu({
    assets,
    lang,
    onAdd,
}: {
    assets: PortfolioAsset[];
    lang: Lang;
    onAdd: (asset: PortfolioAsset) => void;
}) {
    const t = copy[lang];
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customName, setCustomName] = useState("");
    const addedCategoryIds = new Set(assets.map((asset) => asset.categoryId));

    const handleAddPredefined = (assetId: PredefinedAssetId) => {
        if (addedCategoryIds.has(assetId)) return;
        onAdd(createPredefinedAsset(assetId, lang));
        setIsOpen(false);
        setIsCustomMode(false);
    };

    const handleAddCustom = () => {
        const name = customName.trim();
        if (!name) return;
        onAdd(createCustomAsset(name, assets.length));
        setCustomName("");
        setIsOpen(false);
        setIsCustomMode(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#FFD7C7] bg-[#FFF3EE] px-4 text-sm font-black text-[#CC4A1A] shadow-sm transition hover:border-[#FF6B35] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
            >
                <Plus size={17} />
                {t.addAsset}
                <ChevronDown size={16} className={cn("transition", isOpen ? "rotate-180" : "")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="grid gap-1">
                        {addableAssetIds.map((assetId) => {
                            const definition = predefinedAssetDefinitions[assetId];
                            const isAdded = addedCategoryIds.has(assetId);

                            return (
                                <button
                                    key={assetId}
                                    type="button"
                                    disabled={isAdded}
                                    onClick={() => handleAddPredefined(assetId)}
                                    className={cn(
                                        "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-bold transition",
                                        isAdded
                                            ? "cursor-not-allowed bg-slate-50 text-slate-300"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                                    )}
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <AssetIcon
                                            asset={{ color: definition.color, iconKey: definition.iconKey }}
                                            size={16}
                                        />
                                        <span className="truncate">{definition.label[lang]}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-2 border-t border-slate-100 pt-2">
                        {!isCustomMode ? (
                            <button
                                type="button"
                                onClick={() => setIsCustomMode(true)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                <AssetIcon asset={{ color: customColors[assets.length % customColors.length], iconKey: "custom" }} size={16} />
                                {t.customAsset}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={customName}
                                    onChange={(event) => setCustomName(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleAddCustom();
                                        }
                                    }}
                                    placeholder={t.customNamePlaceholder}
                                    className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCustom}
                                    className="h-10 rounded-lg bg-slate-950 px-3 text-sm font-black text-white transition hover:bg-slate-800"
                                >
                                    {t.addCustom}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricCard({
    icon,
    label,
    value,
    subValue,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
}) {
    return (
        <div className="min-h-28 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <span className="text-[#CC4A1A]">{icon}</span>
                {label}
            </div>
            <div className="mt-3 break-words text-base font-black leading-tight tracking-tight text-slate-950 sm:text-xl">{value}</div>
            {subValue && <div className="mt-1 text-sm font-semibold text-slate-500">{subValue}</div>}
        </div>
    );
}

function RiskScoreCard({
    hhi,
    hhiLevel,
    contributors,
    warnings,
    lang,
}: {
    hhi: number;
    hhiLevel: HhiRiskLevel;
    contributors: PortfolioRow[];
    warnings: string[];
    lang: Lang;
}) {
    const t = copy[lang];
    const tone = hhiToneClass[hhiLevel];

    return (
        <section className={cn("rounded-xl border p-5 shadow-sm sm:p-6", tone.card)}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-600">
                        <Gauge size={18} className={tone.text} />
                        {t.riskScore}
                    </div>
                    <div className={cn("mt-3 text-5xl font-black leading-none tracking-tight", tone.text)}>
                        {formatHhi(hhi)}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-600">{t.hhiLabel}</div>
                </div>

                <div className="sm:text-right">
                    <span className={cn("inline-flex rounded-full border px-3 py-1.5 text-sm font-black", tone.badge)}>
                        {hhiRiskLabel(hhiLevel, lang)}
                    </span>
                </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/70 bg-white/70 p-4">
                <div className="text-sm font-black text-slate-800">{t.concentrationContributors}</div>
                {contributors.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {contributors.map((row) => (
                            <span
                                key={row.id}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-800"
                            >
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                                {row.name} {formatPercent(row.weight)}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="mt-2 text-sm font-semibold text-slate-600">{t.noConcentrationContributors}</p>
                )}
            </div>

            {warnings.length > 0 && (
                <div className="mt-3 space-y-2">
                    {warnings.map((warning) => (
                        <div key={warning} className={cn("rounded-lg border px-3 py-2 text-sm font-bold", tone.warning)}>
                            {warning}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function TargetAllocationComparison({
    selectedTemplateId,
    rows,
    actionSummary,
    lang,
    onSelectTemplate,
}: {
    selectedTemplateId: TargetTemplateId;
    rows: TargetComparisonRow[];
    actionSummary: string;
    lang: Lang;
    onSelectTemplate: (templateId: TargetTemplateId) => void;
}) {
    const t = copy[lang];

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-slate-900">{t.targetComparisonTitle}</h3>
                <div className="grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-100 p-1">
                    {targetTemplates.map((template) => {
                        const isSelected = template.id === selectedTemplateId;

                        return (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => onSelectTemplate(template.id)}
                                className={cn(
                                    "min-h-10 rounded-lg px-2 text-xs font-black transition sm:px-3 sm:text-sm",
                                    isSelected
                                        ? "bg-white text-[#CC4A1A] shadow-sm"
                                        : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                                )}
                                aria-pressed={isSelected}
                            >
                                {template.label[lang]}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                        <tr>
                            <th className="px-4 py-3">{t.tableAsset}</th>
                            <th className="px-4 py-3 text-right">{t.currentPercent}</th>
                            <th className="px-4 py-3 text-right">{t.targetPercent}</th>
                            <th className="px-4 py-3 text-right">{t.difference}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td className="px-4 py-3 font-semibold text-slate-800">{row.label}</td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatPercent(row.currentPercent)}</td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatPercent(row.targetPercent)}</td>
                                <td className={cn(
                                    "px-4 py-3 text-right font-black",
                                    row.differencePercent >= 0 ? "text-emerald-600" : "text-red-600"
                                )}>
                                    {formatDifferencePercent(row.differencePercent)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-800">
                {actionSummary}
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">{t.targetDisclaimer}</p>
        </section>
    );
}

function ExportActions({
    shareStatus,
    summaryStatus,
    lang,
    onShare,
    onCopySummary,
}: {
    shareStatus: "idle" | "copied";
    summaryStatus: "idle" | "copied";
    lang: Lang;
    onShare: () => void;
    onCopySummary: () => void;
}) {
    const t = copy[lang];

    return (
        <div className="flex flex-wrap justify-end gap-2">
            <button
                type="button"
                onClick={onShare}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-[#FF6B35] hover:bg-[#FFF3EE] hover:text-[#CC4A1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
            >
                <Share2 size={15} />
                {shareStatus === "copied" ? t.copied : t.sharePortfolio}
            </button>
            <button
                type="button"
                onClick={onCopySummary}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-[#FF6B35] hover:bg-[#FFF3EE] hover:text-[#CC4A1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
            >
                <Clipboard size={15} />
                {summaryStatus === "copied" ? t.copied : t.copySummary}
            </button>
        </div>
    );
}

export default function PortfolioAllocationCalculator({ lang }: { lang: Lang }) {
    const t = copy[lang];
    const [assets, dispatch] = useReducer(portfolioReducer, lang, createInitialAssets);
    const [hasLoadedStoredAssets, setHasLoadedStoredAssets] = useState(false);
    const [selectedTargetId, setSelectedTargetId] = useState<TargetTemplateId>("balanced");
    const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
    const [summaryStatus, setSummaryStatus] = useState<"idle" | "copied">("idle");

    useEffect(() => {
        try {
            const urlAssets = parseUrlAssets(new URL(window.location.href).searchParams.get("v") ?? "", lang);
            if (urlAssets) {
                dispatch({ type: "HYDRATE_ASSETS", assets: urlAssets });
                return;
            }

            const raw = window.sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
                const storedAssets = hydrateStoredAssets(JSON.parse(raw), lang);
                if (storedAssets) {
                    dispatch({ type: "HYDRATE_ASSETS", assets: storedAssets });
                }
            }
        } catch {
            // Storage may be unavailable in strict privacy modes.
        } finally {
            setHasLoadedStoredAssets(true);
        }
    }, [lang]);

    useEffect(() => {
        if (!hasLoadedStoredAssets) return;
        try {
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
        } catch {
            // Storage may be unavailable in strict privacy modes.
        }
    }, [assets, hasLoadedStoredAssets]);

    const portfolio = useMemo(() => {
        const total = assets.reduce((sum, asset) => sum + asset.amount, 0);
        const weightedRows = assets.map((asset) => ({
            ...asset,
            weight: total > 0 ? (asset.amount / total) * 100 : 0,
        }));
        const sortedRows = [...weightedRows].sort((a, b) => b.weight - a.weight || b.amount - a.amount);
        const chartData = weightedRows.filter((row) => row.amount > 0);
        const topAsset = sortedRows.find((row) => row.amount > 0) ?? null;
        const lowRiskAmount = weightedRows
            .filter((row) => row.categoryId === "cash" || row.categoryId === "deposit")
            .reduce((sum, row) => sum + row.amount, 0);
        const highRiskAmount = weightedRows
            .filter((row) => row.categoryId === "stocks" || row.categoryId === "crypto")
            .reduce((sum, row) => sum + row.amount, 0);
        const lowRiskShare = total > 0 ? (lowRiskAmount / total) * 100 : 0;
        const highRiskShare = total > 0 ? (highRiskAmount / total) * 100 : 0;
        const hhi = weightedRows.reduce((sum, row) => sum + Math.pow(row.weight / 100, 2), 0);
        const hhiLevel = hhiRiskLevel(hhi);
        const concentrationContributors = weightedRows
            .filter((row) => row.weight > 30)
            .sort((a, b) => b.weight - a.weight);
        const warnings = [
            ...(topAsset && topAsset.weight > 50 ? [t.singleAssetWarning] : []),
            ...(highRiskShare > 60 ? [t.volatileAssetWarning] : []),
            ...(lowRiskShare > 70 ? [t.conservativeWarning] : []),
        ];

        return {
            total,
            rows: sortedRows,
            chartData,
            topAsset,
            lowRiskShare,
            highRiskShare,
            hhi,
            hhiLevel,
            concentrationContributors,
            warnings,
            weightsById: new Map(weightedRows.map((row) => [row.id, row.weight])),
        };
    }, [assets, t.conservativeWarning, t.singleAssetWarning, t.volatileAssetWarning]);

    const targetComparison = useMemo(() => {
        const selectedTemplate = targetTemplates.find((template) => template.id === selectedTargetId) ?? targetTemplates[1];
        const groupAmounts = targetGroups.reduce((acc, group) => {
            acc[group.id] = 0;
            return acc;
        }, {} as Record<TargetGroupId, number>);

        assets.forEach((asset) => {
            groupAmounts[getTargetGroupId(asset.categoryId)] += asset.amount;
        });

        const rows = targetGroups.map((group) => {
            const currentAmount = groupAmounts[group.id];
            const targetPercent = selectedTemplate.allocations[group.id];
            const targetAmount = portfolio.total * (targetPercent / 100);
            const currentPercent = portfolio.total > 0 ? (currentAmount / portfolio.total) * 100 : 0;

            return {
                id: group.id,
                label: group.label[lang],
                currentPercent,
                targetPercent,
                differencePercent: currentPercent - targetPercent,
                deltaAmount: targetAmount - currentAmount,
            };
        });

        const actionParts = rows
            .filter((row) => Math.abs(row.deltaAmount) >= 1)
            .map((row) => {
                const group = targetGroups.find((targetGroup) => targetGroup.id === row.id);
                const action = row.deltaAmount > 0
                    ? group?.increaseAction[lang]
                    : group?.decreaseAction[lang];

                return `${formatCurrency(Math.abs(row.deltaAmount))} ${action}`;
            });
        const actionSummary = portfolio.total <= 0
            ? t.targetActionNoAmount
            : actionParts.length === 0
                ? t.targetActionAligned
                : `${t.targetActionPrefix} ${joinActionParts(actionParts)} ${t.targetActionSuffix}`;

        return {
            rows,
            actionSummary,
        };
    }, [
        assets,
        lang,
        portfolio.total,
        selectedTargetId,
        t.targetActionAligned,
        t.targetActionNoAmount,
        t.targetActionPrefix,
        t.targetActionSuffix,
    ]);

    const copyToClipboard = async (
        text: string,
        setStatus: React.Dispatch<React.SetStateAction<"idle" | "copied">>
    ) => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;

        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
            window.setTimeout(() => setStatus("idle"), 2000);
        } catch {
            setStatus("idle");
        }
    };

    const handleSharePortfolio = () => {
        void copyToClipboard(buildShareUrl(assets), setShareStatus);
    };

    const handleCopySummary = () => {
        const visibleRows = portfolio.rows.filter((row) => row.amount > 0);
        const summaryLines = [
            "📊 Portföy Dağılımım (hesapmod.com)",
            `Toplam: ${formatCurrency(portfolio.total)}`,
            "━━━━━━━━━━━━",
            ...visibleRows.map((row) => `${row.name}: ${formatCurrency(row.amount)} (${formatPercent(row.weight)})`),
            "━━━━━━━━━━━━",
            `Risk skoru: ${hhiRiskLabel(portfolio.hhiLevel, lang)} (HHI: ${portfolio.hhi.toFixed(2)})`,
        ];

        void copyToClipboard(summaryLines.join("\n"), setSummaryStatus);
    };

    return (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.1fr)]">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
                    <AddAssetMenu
                        assets={assets}
                        lang={lang}
                        onAdd={(asset) => dispatch({ type: "ADD_ASSET", asset })}
                    />
                </div>

                <div className="space-y-3">
                    {assets.map((asset) => (
                        <AssetRow
                            key={asset.id}
                            asset={asset}
                            weight={portfolio.weightsById.get(asset.id) ?? 0}
                            lang={lang}
                            onAmountChange={(amount) => dispatch({ type: "UPDATE_AMOUNT", id: asset.id, amount })}
                            onRemove={() => dispatch({ type: "REMOVE_ASSET", id: asset.id })}
                        />
                    ))}
                </div>
            </section>

            <div className="space-y-6 lg:sticky lg:top-24">
                <ExportActions
                    shareStatus={shareStatus}
                    summaryStatus={summaryStatus}
                    lang={lang}
                    onShare={handleSharePortfolio}
                    onCopySummary={handleCopySummary}
                />

                <RiskScoreCard
                    hhi={portfolio.hhi}
                    hhiLevel={portfolio.hhiLevel}
                    contributors={portfolio.concentrationContributors}
                    warnings={portfolio.warnings}
                    lang={lang}
                />

                <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">{t.summary}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard
                            icon={<WalletCards size={16} />}
                            label={t.totalValue}
                            value={formatCurrency(portfolio.total)}
                        />
                        <MetricCard
                            icon={<Trophy size={16} />}
                            label={t.topAsset}
                            value={portfolio.topAsset?.name ?? t.noAsset}
                            subValue={portfolio.topAsset ? formatPercent(portfolio.topAsset.weight) : formatPercent(0)}
                        />
                        <MetricCard
                            icon={<ShieldCheck size={16} />}
                            label={t.lowRiskShare}
                            value={formatPercent(portfolio.lowRiskShare)}
                        />
                        <MetricCard
                            icon={<AlertTriangle size={16} />}
                            label={t.highRiskShare}
                            value={formatPercent(portfolio.highRiskShare)}
                        />
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900">{t.chartTitle}</h3>
                    <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] xl:items-center">
                        <div className="h-72 min-h-72">
                            {portfolio.chartData.length > 0 ? (
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                    minWidth={0}
                                    minHeight={288}
                                    initialDimension={{ width: 320, height: 288 }}
                                >
                                    <PieChart>
                                        <Pie
                                            data={portfolio.chartData}
                                            dataKey="amount"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={104}
                                            paddingAngle={2}
                                            stroke="#ffffff"
                                            strokeWidth={3}
                                            isAnimationActive
                                        >
                                            {portfolio.chartData.map((row) => (
                                                <Cell key={row.id} fill={row.color} />
                                            ))}
                                            <Label
                                                position="center"
                                                content={(props: any) => (
                                                    <CustomLabel viewBox={props.viewBox} total={portfolio.total} />
                                                )}
                                            />
                                        </Pie>
                                        <Tooltip
                                            content={(props: any) => (
                                                <PortfolioTooltip
                                                    active={props.active}
                                                    payload={props.payload}
                                                    lang={lang}
                                                />
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
                                    {t.noData}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            {portfolio.chartData.map((row) => (
                                <div key={row.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                                    <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-700">
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                                        <span className="truncate">{row.name}</span>
                                    </span>
                                    <span className="shrink-0 font-bold text-slate-950">{formatPercent(row.weight)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full min-w-[680px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">{t.tableAsset}</th>
                                    <th className="px-4 py-3 text-right">{t.tableAmount}</th>
                                    <th className="px-4 py-3 text-right">{t.tableWeight}</th>
                                    <th className="px-4 py-3 text-right">{t.tableRisk}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {portfolio.rows.map((row) => (
                                    <tr key={row.id} className="bg-white">
                                        <td className="px-4 py-3 font-semibold text-slate-800">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                                                {row.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(row.amount)}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatPercent(row.weight)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", riskBadgeClass[row.risk])}>
                                                {riskLabel(row.risk, lang)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t border-slate-200 bg-slate-50 font-black text-slate-950">
                                    <td className="px-4 py-3">{t.total}</td>
                                    <td className="px-4 py-3 text-right">{formatCurrency(portfolio.total)}</td>
                                    <td className="px-4 py-3 text-right">{formatPercent(100)}</td>
                                    <td className="px-4 py-3" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <TargetAllocationComparison
                    selectedTemplateId={selectedTargetId}
                    rows={targetComparison.rows}
                    actionSummary={targetComparison.actionSummary}
                    lang={lang}
                    onSelectTemplate={setSelectedTargetId}
                />
            </div>
        </div>
    );
}
