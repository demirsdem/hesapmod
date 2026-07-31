"use client";

import { useEffect, useMemo, useState } from "react";
import type { GoldPriceCache, GoldTypeId, PortfolioGoldItem, TransactionType } from "@/lib/gold/goldPriceTypes";
import {
    GOLD_TYPE_INFO,
    GOLD_TYPE_ORDER,
    calculateGoldToTRY,
    calculatePortfolioTotal,
    calculateSpread,
    calculateSpreadPercent,
    calculateTRYToGold,
    formatGram,
    formatPercent,
    formatTRY,
    getGoldUnitPrice,
    getPureGoldGram,
} from "@/lib/gold/goldCalculations";

type GoldMode = "altindan-tlye" | "tlden-altina" | "bozdurma" | "makas" | "portfoy";

const modeLabels: Record<GoldMode, string> = {
    "altindan-tlye": "Altından TL'ye",
    "tlden-altina": "TL'den altına",
    bozdurma: "Altın bozdurma",
    makas: "Alış/satış makası",
    portfoy: "Portföy",
};

const modeOptions = Object.entries(modeLabels) as Array<[GoldMode, string]>;

function isGoldType(value: string | null): value is GoldTypeId {
    return Boolean(value && value in GOLD_TYPE_INFO);
}

function isGoldMode(value: string | null): value is GoldMode {
    return Boolean(value && value in modeLabels);
}

function parseAmount(value: string | null, fallback: string) {
    if (!value) return fallback;
    const parsed = Number.parseFloat(value.replace(",", "."));
    return Number.isFinite(parsed) && parsed >= 0 ? String(parsed) : fallback;
}

function readInitialState() {
    if (typeof window === "undefined") {
        return { mode: "altindan-tlye" as GoldMode, goldType: "gram24k" as GoldTypeId, amount: "1" };
    }

    const params = new URLSearchParams(window.location.search);
    const mode = isGoldMode(params.get("mod")) ? params.get("mod") as GoldMode : "altindan-tlye";
    const goldType = isGoldType(params.get("type")) ? params.get("type") as GoldTypeId : "gram24k";
    const amount = parseAmount(params.get("amount"), mode === "tlden-altina" ? "10000" : "1");
    return { mode, goldType, amount };
}

export default function GoldCalculator({ initialPrices }: { initialPrices: GoldPriceCache | null }) {
    const initial = readInitialState();
    const [mode, setMode] = useState<GoldMode>(initial.mode);
    const [goldType, setGoldType] = useState<GoldTypeId>(initial.goldType);
    const [amount, setAmount] = useState(initial.amount);
    const [transactionType, setTransactionType] = useState<TransactionType>("buy");
    const [portfolioItems, setPortfolioItems] = useState<PortfolioGoldItem[]>([
        { id: "p1", goldType: "ceyrek", amount: 3 },
        { id: "p2", goldType: "gram22k", amount: 10 },
        { id: "p3", goldType: "gram24k", amount: 2 },
    ]);

    useEffect(() => {
        const onPopState = () => {
            const next = readInitialState();
            setMode(next.mode);
            setGoldType(next.goldType);
            setAmount(next.amount);
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        params.set("mod", mode);
        params.set("type", goldType);
        params.set("amount", amount || "0");
        const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState(null, "", nextUrl);
    }, [amount, goldType, mode]);

    const numericAmount = Math.max(0, Number.parseFloat(amount.replace(",", ".")) || 0);

    const result = useMemo(() => {
        if (!initialPrices) return null;
        if (mode === "tlden-altina") {
            return {
                label: "Alınabilecek miktar",
                value: formatGram(calculateTRYToGold({
                    prices: initialPrices.prices,
                    goldType,
                    tryAmount: numericAmount,
                    transactionType: "buy",
                })),
                detail: `${formatTRY(numericAmount)} ile güncel satış fiyatına göre yaklaşık miktar.`,
            };
        }
        if (mode === "makas") {
            const price = initialPrices.prices[goldType];
            return {
                label: "Alış/satış makası",
                value: formatTRY(calculateSpread(price.buy, price.sell)),
                detail: `${GOLD_TYPE_INFO[goldType].name} için makas oranı ${formatPercent(calculateSpreadPercent(price.buy, price.sell))}.`,
            };
        }
        if (mode === "portfoy") {
            return {
                label: "Portföy toplamı",
                value: formatTRY(calculatePortfolioTotal(portfolioItems, initialPrices.prices, transactionType)),
                detail: transactionType === "buy"
                    ? "Portföyü almak için satış fiyatları baz alındı."
                    : "Portföyü satmak/bozdurmak için alış fiyatları baz alındı.",
            };
        }

        const tx: TransactionType = mode === "bozdurma" ? "sell" : "buy";
        return {
            label: mode === "bozdurma" ? "Yaklaşık bozdurma değeri" : "Yaklaşık TL karşılığı",
            value: formatTRY(calculateGoldToTRY({
                prices: initialPrices.prices,
                goldType,
                amount: numericAmount,
                transactionType: tx,
            })),
            detail: mode === "bozdurma"
                ? "Satıyorum/bozduruyorum modunda alış fiyatı kullanılır."
                : "Alıyorum modunda satış fiyatı kullanılır.",
        };
    }, [goldType, initialPrices, mode, numericAmount, portfolioItems, transactionType]);

    if (!initialPrices) {
        return (
            <section id="canli-altin-hesaplama-araci" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Canlı Altın Hesaplama Aracı</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                    Fiyat geçici olarak alınamıyor. Güncel fiyatı banka veya kuyumcudan kontrol ederek manuel hesaplama için tekrar deneyebilirsiniz.
                </p>
            </section>
        );
    }

    const selectedInfo = GOLD_TYPE_INFO[goldType];
    const selectedPrice = initialPrices.prices[goldType];

    return (
        <section id="canli-altin-hesaplama-araci" aria-labelledby="calculator-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Altın çevirici</p>
                    <h2 id="calculator-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">Canlı Altın Hesaplama Aracı</h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-700">
                    Alıyorum: satış fiyatı baz alınır. Satıyorum / bozduruyorum: alış fiyatı baz alınır.
                </p>
            </div>

            <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-black text-slate-800">Hesaplama modu</legend>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="radiogroup" aria-label="Hesaplama modu">
                    {modeOptions.map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={mode === value}
                            onClick={() => setMode(value)}
                            className={`min-h-11 rounded-md border px-3 text-sm font-black transition ${
                                mode === value
                                    ? "border-[#B84418] bg-[#B84418] text-white"
                                    : "border-slate-200 bg-slate-50 text-slate-800 hover:border-amber-300 hover:bg-white"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </fieldset>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                {mode !== "portfoy" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-black text-slate-800">Altın türü</span>
                            <select
                                value={goldType}
                                onChange={(event) => setGoldType(event.target.value as GoldTypeId)}
                                className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#B84418] focus:outline-none focus:ring-2 focus:ring-amber-200"
                            >
                                {GOLD_TYPE_ORDER.map((type) => (
                                    <option key={type} value={type}>{GOLD_TYPE_INFO[type].name}</option>
                                ))}
                            </select>
                        </label>
                        {mode !== "makas" && (
                            <label className="block">
                                <span className="text-sm font-black text-slate-800">
                                    {mode === "tlden-altina" ? "TL tutarı" : `Miktar (${selectedInfo.unit})`}
                                </span>
                                <input
                                    id="gold-amount-input"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#B84418] focus:outline-none focus:ring-2 focus:ring-amber-200"
                                />
                            </label>
                        )}
                    </div>
                )}

                {mode === "portfoy" && (
                    <div className="space-y-3 lg:col-span-2">
                        <fieldset>
                            <legend className="mb-2 text-sm font-black text-slate-800">Portföy işlem yönü</legend>
                            <div className="flex flex-wrap gap-2">
                                {(["buy", "sell"] as TransactionType[]).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setTransactionType(type)}
                                        className={`min-h-11 rounded-md border px-4 text-sm font-black ${
                                            transactionType === type
                                                ? "border-[#B84418] bg-[#B84418] text-white"
                                                : "border-slate-200 bg-slate-50 text-slate-800"
                                        }`}
                                    >
                                        {type === "buy" ? "Alıyorum" : "Satıyorum / bozduruyorum"}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                        {portfolioItems.map((item) => (
                            <div key={item.id} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_160px_auto]">
                                <select
                                    value={item.goldType}
                                    onChange={(event) => setPortfolioItems((items) => items.map((current) => (
                                        current.id === item.id ? { ...current, goldType: event.target.value as GoldTypeId } : current
                                    )))}
                                    className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-base font-semibold"
                                    aria-label="Portföy altın türü"
                                >
                                    {GOLD_TYPE_ORDER.map((type) => (
                                        <option key={type} value={type}>{GOLD_TYPE_INFO[type].name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={item.amount}
                                    onChange={(event) => setPortfolioItems((items) => items.map((current) => (
                                        current.id === item.id ? { ...current, amount: Number.parseFloat(event.target.value) || 0 } : current
                                    )))}
                                    className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-base font-semibold"
                                    aria-label="Portföy miktarı"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPortfolioItems((items) => items.filter((current) => current.id !== item.id))}
                                    className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-black text-slate-800"
                                >
                                    Sil
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setPortfolioItems((items) => [...items, { id: `p${Date.now()}`, goldType: "gram24k", amount: 1 }])}
                            className="min-h-11 rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-black text-[#9F3A12]"
                        >
                            Satır ekle
                        </button>
                    </div>
                )}

                <div className={mode === "portfoy" ? "lg:col-span-2" : ""}>
                    <div className="rounded-lg border border-amber-200 bg-[#FFF8E7] p-5" aria-live="polite" aria-atomic="true">
                        <p className="text-sm font-black text-slate-700">{result?.label}</p>
                        <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{result?.value}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{result?.detail}</p>
                        {mode !== "portfoy" && (
                            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div>
                                    <dt className="text-xs font-bold text-slate-500">Birim alış</dt>
                                    <dd className="text-sm font-black tabular-nums text-emerald-700">{formatTRY(selectedPrice.buy)}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold text-slate-500">Birim satış</dt>
                                    <dd className="text-sm font-black tabular-nums text-red-700">{formatTRY(selectedPrice.sell)}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-bold text-slate-500">Has altın</dt>
                                    <dd className="text-sm font-black tabular-nums text-slate-950">{formatGram(getPureGoldGram(goldType, mode === "tlden-altina" ? 1 : numericAmount))}</dd>
                                </div>
                            </dl>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <p>
                    Kullanılan birim fiyat: {formatTRY(getGoldUnitPrice(initialPrices.prices, goldType, mode === "bozdurma" ? "sell" : "buy"))}.
                    Sonuçlar yaklaşık ve bilgilendirme amaçlıdır; bu sayfa yatırım tavsiyesi içermez.
                </p>
            </div>
        </section>
    );
}
