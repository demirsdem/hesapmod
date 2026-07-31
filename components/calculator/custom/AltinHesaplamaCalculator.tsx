"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import type { LanguageCode } from "@/lib/calculator-types";
import GoldTypeCard from "./GoldTypeCard";
import GoldSummaryCard from "./GoldSummaryCard";

interface LivePrices {
    fiyat?: number;
    kaynak?: string;
    guncellemeZamani?: string;
    gramPrice24k?: number;
    hasAltinAlis?: number;
    hasAltinSatis?: number;
    ceyrekAlis?: number | null;
    ceyrekSatis?: number | null;
    ons?: number | null;
    tryPerOz?: number;
    updatedAt?: string;
    source?: string;
}

type PriceInputState = "loading" | "automatic" | "last-known" | "manual";

interface PriceInputMeta {
    state: PriceInputState;
    source?: string;
    updatedAt?: string;
    detail?: string;
}

interface StoredGoldPrice {
    fiyat: number;
    kaynak?: string;
    guncellemeZamani?: string;
}

interface Props {
    lang: LanguageCode;
}

interface GoldType {
    id: string;
    name: string;
    ayar: number;
    totalWeight: number; // gram (alaşım dahil)
    pureGold: number;    // has altın gram (24K eşdeğeri)
    isCoin: boolean;
    icon: string;
}

const LAST_GOLD_PRICE_KEY = "altin-son-fiyat";
const COIN_PREMIUM_KEY = "altin-sikke-primi";
const MAKAS_KEY = "altin-makas";
const DEFAULT_COIN_PREMIUM = "3.5";
const DEFAULT_MAKAS = "0.5";

// Kaynak: Türkiye Cumhuriyet Merkez Bankası & IAB standart ağırlıkları
const GOLD_TYPES: GoldType[] = [
    { id: "gram24",  name: "Gram Altın (24 Ayar)",    ayar: 24, totalWeight: 1.0,      pureGold: 1.0,      isCoin: false, icon: "📊" },
    { id: "gram22",  name: "Gram Altın (22 Ayar)",    ayar: 22, totalWeight: 1.0,      pureGold: 22 / 24,  isCoin: false, icon: "📊" },
    { id: "gram18",  name: "Gram Altın (18 Ayar)",    ayar: 18, totalWeight: 1.0,      pureGold: 18 / 24,  isCoin: false, icon: "📊" },
    { id: "gram14",  name: "Gram Altın (14 Ayar)",    ayar: 14, totalWeight: 1.0,      pureGold: 14 / 24,  isCoin: false, icon: "📊" },
    { id: "ceyrek",  name: "Çeyrek Altın",            ayar: 22, totalWeight: 1.754,    pureGold: 1.604,    isCoin: true,  icon: "🥇" },
    { id: "yarim",   name: "Yarım Altın",             ayar: 22, totalWeight: 3.508,    pureGold: 3.208,    isCoin: true,  icon: "🥇" },
    { id: "tam",     name: "Tam / Ziynet Altın",      ayar: 22, totalWeight: 7.016,    pureGold: 6.416,    isCoin: true,  icon: "🪙" },
    { id: "ata",     name: "Ata Cumhuriyet Altını",   ayar: 22, totalWeight: 7.200,    pureGold: 6.600,    isCoin: true,  icon: "🏅" },
    { id: "resat",   name: "Reşat / Hamit Altın",     ayar: 22, totalWeight: 7.216,    pureGold: 6.614,    isCoin: true,  icon: "🏅" },
    { id: "gremse",  name: "Gremse (2,5'luk)",        ayar: 22, totalWeight: 17.540,   pureGold: 16.038,   isCoin: true,  icon: "🪙" },
    { id: "ons",     name: "1 Ons Altın",             ayar: 24, totalWeight: 31.1035,  pureGold: 31.1035,  isCoin: false, icon: "🌍" },
];

function fmt(n: number, dec = 2): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function fmtW(n: number): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    });
}

function toPositiveNumber(value: unknown): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) && value > 0 ? value : null;
    }

    if (typeof value !== "string") return null;

    const cleaned = value
        .replace(/[^\d,.-]/g, "")
        .trim();

    if (!cleaned) return null;

    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");
    let normalized = cleaned;

    if (lastComma > -1 && lastDot > -1) {
        const decimalSeparator = lastComma > lastDot ? "," : ".";
        const thousandsSeparator = decimalSeparator === "," ? "." : ",";
        normalized = cleaned
            .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
            .replace(decimalSeparator, ".");
    } else if (lastComma > -1) {
        normalized = cleaned.replace(",", ".");
    }

    const parsed = Number.parseFloat(normalized);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeLivePrices(data: LivePrices | null): LivePrices | null {
    const price = toPositiveNumber(data?.fiyat ?? data?.gramPrice24k);
    if (!data || !price) return null;

    const updatedAt = data.guncellemeZamani ?? data.updatedAt ?? new Date().toISOString();
    const source = data.kaynak ?? data.source ?? "altin-fiyat API";

    return {
        ...data,
        fiyat: price,
        kaynak: source,
        guncellemeZamani: updatedAt,
        gramPrice24k: price,
        hasAltinAlis: data.hasAltinAlis ?? price,
        hasAltinSatis: data.hasAltinSatis ?? price,
        tryPerOz: data.tryPerOz ?? Math.round(price * 31.1035),
        updatedAt,
        source,
    };
}

function readStoredGoldPrice(): StoredGoldPrice | null {
    if (typeof window === "undefined") return null;

    const raw = window.sessionStorage.getItem(LAST_GOLD_PRICE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as Partial<StoredGoldPrice>;
        const price = toPositiveNumber(parsed.fiyat);
        return price ? { ...parsed, fiyat: price } : null;
    } catch {
        const price = toPositiveNumber(raw);
        return price ? { fiyat: price } : null;
    }
}

function saveStoredGoldPrice(data: LivePrices) {
    if (typeof window === "undefined") return;

    const price = toPositiveNumber(data.fiyat ?? data.gramPrice24k);
    if (!price) return;

    const payload: StoredGoldPrice = {
        fiyat: price,
        kaynak: data.kaynak ?? data.source,
        guncellemeZamani: data.guncellemeZamani ?? data.updatedAt ?? new Date().toISOString(),
    };

    window.sessionStorage.setItem(LAST_GOLD_PRICE_KEY, JSON.stringify(payload));
}

function readStoredSetting(key: string, fallback: string) {
    if (typeof window === "undefined") return fallback;
    const value = window.sessionStorage.getItem(key);
    return value && Number.isFinite(Number.parseFloat(value.replace(",", "."))) ? value : fallback;
}

function formatMetaDate(value?: string, mode: "time" | "dateTime" = "time") {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    if (mode === "dateTime") {
        return date.toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function PriceSourceBadge({ meta }: { meta: PriceInputMeta }) {
    if (meta.state === "loading") {
        return (
            <span className="inline-flex h-6 items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-500">
                Kontrol ediliyor
            </span>
        );
    }

    if (meta.state === "automatic") {
        return (
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-700">
                <span aria-hidden="true">●</span>
                Otomatik
                {meta.updatedAt && <span className="font-medium text-emerald-600">{formatMetaDate(meta.updatedAt)}</span>}
            </span>
        );
    }

    if (meta.state === "last-known") {
        return (
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-600">
                <span aria-hidden="true">○</span>
                Son bilinen
                {meta.updatedAt && <span className="font-medium text-slate-500">{formatMetaDate(meta.updatedAt, "dateTime")}</span>}
            </span>
        );
    }

    return (
        <span className="inline-flex h-6 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 text-xs font-semibold text-amber-800">
            <span aria-hidden="true">⚠</span>
            Manuel
        </span>
    );
}

export default function AltinHesaplamaCalculator({ lang: _lang }: Props) {
    const [gramPrice,     setGramPrice]     = useState("");
    const [coinPremium,   setCoinPremium]   = useState(DEFAULT_COIN_PREMIUM);
    const [makas,         setMakas]         = useState(DEFAULT_MAKAS);
    const [txType,        setTxType]        = useState<"buy" | "sell">("buy");
    const [quantities,    setQuantities]    = useState<Record<string, string>>(

        () => Object.fromEntries(GOLD_TYPES.map((g) => [g.id, "0"]))
    );
    const [livePrices,    setLivePrices]    = useState<LivePrices | null>(null);
    const [pricesLoading, setPricesLoading] = useState(true);
    const [priceMeta,     setPriceMeta]     = useState<PriceInputMeta>({ state: "loading" });
    const userEditedGramPriceRef = useRef(false);

    useEffect(() => {
        setCoinPremium(readStoredSetting(COIN_PREMIUM_KEY, DEFAULT_COIN_PREMIUM));
        setMakas(readStoredSetting(MAKAS_KEY, DEFAULT_MAKAS));
    }, []);

    // Canlı fiyat — asenkron, sayfa yüklemesini bloklamamak için useEffect.
    useEffect(() => {
        let cancelled = false;

        async function loadPrices() {
            try {
                const response = await fetch("/api/altin-fiyat", { cache: "no-store" });
                const data = normalizeLivePrices(response.ok ? await response.json() as LivePrices : null);

                if (cancelled) return;

                if (data) {
                    setLivePrices(data);
                    saveStoredGoldPrice(data);
                    setPriceMeta({
                        state: "automatic",
                        source: data.kaynak ?? data.source,
                        updatedAt: data.guncellemeZamani ?? data.updatedAt,
                    });
                    if (!userEditedGramPriceRef.current) {
                        setGramPrice(String(data.gramPrice24k ?? data.fiyat));
                    }
                    return;
                }
            } catch {
                // Local fallback asagida uygulanir.
            } finally {
                if (!cancelled) setPricesLoading(false);
            }

            if (cancelled) return;

            const stored = readStoredGoldPrice();
            if (stored) {
                setLivePrices(null);
                setPriceMeta({
                    state: "last-known",
                    source: stored.kaynak,
                    updatedAt: stored.guncellemeZamani,
                    detail: "Canlı fiyat alınamadı; son kaydedilen değer kullanılıyor.",
                });
                if (!userEditedGramPriceRef.current) {
                    setGramPrice(String(stored.fiyat));
                }
            } else {
                setLivePrices(null);
                setPriceMeta({
                    state: "manual",
                    detail: "Canlı fiyat alınamadı; gram fiyatını manuel girin.",
                });
            }
        }

        void loadPrices();
        return () => { cancelled = true; };
    }, []);

    const parsedGram    = Math.max(0, parseFloat(gramPrice)   || 0);
    const parsedPremium = Math.max(0, parseFloat(coinPremium) || 0);
    const parsedMakas   = Math.max(0, parseFloat(makas)       || 0);

    const rows = useMemo(() =>
        GOLD_TYPES.map((g) => {
            const coinFactor  = g.isCoin ? (1 + parsedPremium / 100) : 1;
            const spotUnit    = g.pureGold * parsedGram * coinFactor;
            const makasFactor = parsedMakas / 100;
            const unitPrice   = txType === "buy"
                ? spotUnit * (1 + makasFactor)
                : spotUnit * (1 - makasFactor);
            const qty   = parseFloat(quantities[g.id]) || 0;
            const total = unitPrice * qty;
            return { ...g, unitPrice, spotUnit, qty, total, icon: g.icon };
        }),
        [parsedGram, parsedPremium, parsedMakas, txType, quantities]
    );

    const totals = useMemo(() => ({
        hasGold : rows.reduce((s, r) => s + r.pureGold   * r.qty, 0),
        weight  : rows.reduce((s, r) => s + r.totalWeight * r.qty, 0),
        value   : rows.reduce((s, r) => s + r.total,                0),
    }), [rows]);

    const hasAnyQty = rows.some((r) => r.qty > 0);
    const priceSourceLabel = priceMeta.state === "automatic"
        ? "otomatik"
        : priceMeta.state === "last-known"
            ? "son bilinen"
            : "manuel";

    const setQty = (id: string, val: string) =>
        setQuantities((prev) => ({ ...prev, [id]: val }));

    const resetAll = () =>
        setQuantities(Object.fromEntries(GOLD_TYPES.map((g) => [g.id, "0"])));

    const persistSetting = (key: string, value: string) => {
        if (typeof window === "undefined") return;
        if (value.trim() === "") {
            window.sessionStorage.removeItem(key);
            return;
        }
        window.sessionStorage.setItem(key, value);
    };

    const handleGramPriceChange = (value: string) => {
        userEditedGramPriceRef.current = true;
        setGramPrice(value);
        setPriceMeta((prev) => ({
            ...prev,
            state: "manual",
            detail: "Kullanıcı tarafından düzenlendi.",
        }));
    };

    const handleCoinPremiumChange = (value: string) => {
        setCoinPremium(value);
        persistSetting(COIN_PREMIUM_KEY, value);
    };

    const handleMakasChange = (value: string) => {
        setMakas(value);
        persistSetting(MAKAS_KEY, value);
    };

    const inputClass =
        "w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";

    return (
        <div className="space-y-6">

            {/* ── Canlı Piyasa Bandı ───────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 shadow-sm min-h-[52px]">
                {pricesLoading && (
                    <div className="flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <div className="h-3 w-28 rounded bg-slate-200" />
                        <div className="h-3 w-20 rounded bg-slate-100" />
                        <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                )}
                {!pricesLoading && !livePrices && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <PriceSourceBadge meta={priceMeta} />
                        <span className={priceMeta.state === "last-known" ? "font-medium text-slate-600" : "font-medium text-amber-800"}>
                            {priceMeta.detail ?? "Canlı fiyat verisi alınamadı; gram fiyatını manuel girin."}
                        </span>
                    </div>
                )}
                {!pricesLoading && livePrices && (
                    <>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Canlı Piyasa</span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 flex-1">
                            <span className="text-sm text-slate-600">
                                Has Altın&nbsp;
                                <strong className="text-green-700">{(livePrices.hasAltinAlis ?? livePrices.gramPrice24k ?? livePrices.fiyat ?? 0).toLocaleString("tr-TR")} ₺</strong>
                                {livePrices.hasAltinSatis && livePrices.hasAltinSatis !== livePrices.hasAltinAlis && (
                                    <> / <strong className="text-red-600">{livePrices.hasAltinSatis.toLocaleString("tr-TR")} ₺</strong></>
                                )}
                                <span className="text-xs text-slate-400 ml-1">(alış/satış)</span>
                            </span>
                            {livePrices.ceyrekAlis && livePrices.ceyrekSatis && (
                                <span className="text-sm text-slate-600">
                                    Çeyrek&nbsp;
                                    <strong className="text-green-700">{livePrices.ceyrekAlis.toLocaleString("tr-TR")} ₺</strong>
                                    {" / "}
                                    <strong className="text-red-600">{livePrices.ceyrekSatis.toLocaleString("tr-TR")} ₺</strong>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-slate-400">
                                {livePrices.kaynak ?? livePrices.source ?? "altin-fiyat API"} ·{" "}
                                {formatMetaDate(livePrices.guncellemeZamani ?? livePrices.updatedAt)}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    const price = txType === "buy"
                                        ? (livePrices.hasAltinSatis ?? livePrices.gramPrice24k ?? livePrices.fiyat)
                                        : (livePrices.hasAltinAlis ?? livePrices.gramPrice24k ?? livePrices.fiyat);
                                    if (!price) return;
                                    userEditedGramPriceRef.current = false;
                                    setGramPrice(String(price));
                                    setPriceMeta({
                                        state: "automatic",
                                        source: livePrices.kaynak ?? livePrices.source,
                                        updatedAt: livePrices.guncellemeZamani ?? livePrices.updatedAt,
                                    });
                                }}
                                className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                            >
                                Uygula
                            </button>
                        </div>
                    </>
                )}
            </div>

            {!pricesLoading && priceMeta.state === "last-known" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                    Canlı altın fiyatı alınamadı. Hesaplama son başarılı API değerinden devam ediyor; güncel piyasa fiyatını biliyorsanız inputu manuel değiştirebilirsiniz.
                </div>
            )}

            {/* ── Parametreler ─────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Hesaplama Parametreleri</h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Gram fiyat */}
                    <div>
                        <label className="mb-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
                            <span>
                                Gram Altın Fiyatı (24 Ayar)&nbsp;<span className="text-red-500">*</span>
                            </span>
                            <PriceSourceBadge meta={priceMeta} />
                        </label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="1"
                                value={gramPrice}
                                onChange={(e) => handleGramPriceChange(e.target.value)}
                                placeholder={livePrices ? String(livePrices.gramPrice24k ?? livePrices.fiyat) : "3000"}
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₺</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {priceMeta.state === "automatic"
                                ? `${priceMeta.source ?? "API"} verisiyle otomatik dolduruldu; gerekirse değiştirebilirsiniz.`
                                : "Bankanızın veya kuyumcunuzun güncel 24 ayar gram fiyatı."}
                        </p>
                    </div>

                    {/* Sikke primi */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Sikke Primi</label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="0.5"
                                value={coinPremium}
                                onChange={(e) => handleCoinPremiumChange(e.target.value)}
                                placeholder={DEFAULT_COIN_PREMIUM}
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Çeyrek, yarım, tam gibi madeni sikkelerin has altın üstündeki işçilik / prim farkı.</p>
                    </div>

                    {/* Alış/Satış makası */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Alış–Satış Makası</label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="0.1"
                                value={makas}
                                onChange={(e) => handleMakasChange(e.target.value)}
                                placeholder={DEFAULT_MAKAS}
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Alış ve satış fiyatı arasındaki spread oranı. Genellikle %0,25–%1.</p>
                    </div>

                    {/* İşlem türü */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">İşlem Türü</label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden shadow-sm text-sm font-semibold">
                            <button
                                type="button"
                                onClick={() => setTxType("buy")}
                                className={`flex-1 py-2.5 transition-colors ${txType === "buy" ? "bg-amber-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                            >
                                Alıyorum
                            </button>
                            <button
                                type="button"
                                onClick={() => setTxType("sell")}
                                className={`flex-1 py-2.5 transition-colors ${txType === "sell" ? "bg-amber-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                            >
                                Satıyorum
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {txType === "buy" ? "Kuyumcu/bankadan satın alıyorsunuz → makas fiyata eklenir." : "Kuyumcu/bankaya satıyorsunuz → makas fiyattan düşülür."}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Altın Türleri — Card Grid ──────────────── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Altın Türleri ve Fiyatlar</h2>
                        <p className="mt-0.5 text-xs text-slate-500">Her türe kaç adet / gram hesaplayacağınızı girin.</p>
                    </div>
                    {hasAnyQty && (
                        <button
                            type="button"
                            onClick={resetAll}
                            className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
                        >
                            Sıfırla
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rows.map((row) => (
                        <GoldTypeCard
                            key={row.id}
                            row={row}
                            hasPriceData={parsedGram > 0}
                            onQtyChange={setQty}
                        />
                    ))}
                </div>
            </div>

            {/* ── Sonuç ─────────────────────────────────── */}
            {parsedGram <= 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                    <p className="text-sm font-medium text-amber-800">Hesaplamaya başlamak için güncel 24 ayar gram altın fiyatını girin.</p>
                </div>
            )}

            {parsedGram > 0 && !hasAnyQty && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-sm text-slate-500">Toplam değeri görmek için en az bir altın türüne miktar / adet girin.</p>
                </div>
            )}

            {parsedGram > 0 && hasAnyQty && (
                <GoldSummaryCard
                    rows={rows}
                    totals={totals}
                    txType={txType}
                    gramPrice={parsedGram}
                    priceSourceLabel={priceSourceLabel}
                />
            )}
        </div>
    );
}
