"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { LanguageCode } from "@/lib/calculator-types";
import GoldTypeCard from "./GoldTypeCard";
import GoldSummaryCard from "./GoldSummaryCard";

interface LivePrices {
    gramPrice24k: number;
    hasAltinAlis?: number;
    hasAltinSatis?: number;
    ceyrekAlis?: number | null;
    ceyrekSatis?: number | null;
    ons?: number | null;
    tryPerOz: number;
    updatedAt: string;
    source?: string;
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

export default function AltinHesaplamaCalculator({ lang: _lang }: Props) {
    const [gramPrice,     setGramPrice]     = useState("");
    const [coinPremium,   setCoinPremium]   = useState("3");
    const [makas,         setMakas]         = useState("0.5");
    const [txType,        setTxType]        = useState<"buy" | "sell">("buy");
    const [quantities,    setQuantities]    = useState<Record<string, string>>(

        () => Object.fromEntries(GOLD_TYPES.map((g) => [g.id, "0"]))
    );
    const [livePrices,    setLivePrices]    = useState<LivePrices | null>(null);
    const [pricesLoading, setPricesLoading] = useState(true);

    // Canlı fiyat — asenkron, sayfa yüklemesini bloklamamak için useEffect
    useEffect(() => {
        let cancelled = false;

        async function loadPrices() {
            // Server route (altinkaynak.com) + fawazahmed0 currency API (XAU destekler, CORS açık)
            const [serverResult, fawazResult] = await Promise.allSettled([
                fetch("/api/altin-fiyat").then((r) => r.ok ? r.json() as Promise<LivePrices> : null),
                fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json")
                    .then((r) => r.ok ? r.json() as Promise<{ date?: string; xau?: { try?: number } }> : null),
            ]);

            if (cancelled) return;

            let data: LivePrices | null = null;

            // Server route başarılıysa kullan (altinkaynak.com)
            const serverData = serverResult.status === "fulfilled" ? serverResult.value : null;
            if (serverData?.gramPrice24k) {
                data = {
                    gramPrice24k: serverData.gramPrice24k,
                    hasAltinAlis: serverData.hasAltinAlis ?? serverData.gramPrice24k,
                    hasAltinSatis: serverData.hasAltinSatis ?? serverData.gramPrice24k,
                    ceyrekAlis: serverData.ceyrekAlis ?? null,
                    ceyrekSatis: serverData.ceyrekSatis ?? null,
                    ons: serverData.ons ?? null,
                    tryPerOz: serverData.tryPerOz ?? Math.round(serverData.gramPrice24k * 31.1034768),
                    updatedAt: serverData.updatedAt,
                    source: serverData.source ?? "altinkaynak.com",
                };
            }

            // Yoksa fawazahmed0/currency-api'dan hesapla (XAU→TRY, tarayıcıdan doğrudan)
            if (!data) {
                const fx = fawazResult.status === "fulfilled" ? fawazResult.value : null;
                const tryPerOz = fx?.xau?.try;
                if (tryPerOz && tryPerOz > 0) {
                    const gramPrice = Math.round(tryPerOz / 31.1034768);
                    data = {
                        gramPrice24k: gramPrice,
                        hasAltinAlis: gramPrice,
                        hasAltinSatis: gramPrice,
                        tryPerOz: Math.round(tryPerOz),
                        updatedAt: fx?.date ? `${fx.date}T12:00:00.000Z` : new Date().toISOString(),
                        source: "currency-api (ECB/XAU)",
                    };
                }
            }

            if (data) {
                setLivePrices(data);
                setGramPrice((prev) => (prev === "" ? String(data!.gramPrice24k) : prev));
            }
            setPricesLoading(false);
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

    const setQty = (id: string, val: string) =>
        setQuantities((prev) => ({ ...prev, [id]: val }));

    const resetAll = () =>
        setQuantities(Object.fromEntries(GOLD_TYPES.map((g) => [g.id, "0"])));

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
                    <p className="text-xs text-slate-400">Canlı fiyat verisi alınamadı — gram fiyatını manuel girin.</p>
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
                                <strong className="text-green-700">{(livePrices.hasAltinAlis ?? livePrices.gramPrice24k).toLocaleString("tr-TR")} ₺</strong>
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
                                {livePrices.source ?? "altinkaynak.com"} ·{" "}
                                {new Date(livePrices.updatedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    const price = txType === "buy"
                                        ? (livePrices.hasAltinSatis ?? livePrices.gramPrice24k)
                                        : (livePrices.hasAltinAlis ?? livePrices.gramPrice24k);
                                    setGramPrice(String(price));
                                    setMakas("0");
                                }}
                                className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                            >
                                Uygula
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ── Parametreler ─────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Hesaplama Parametreleri</h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Gram fiyat */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Gram Altın Fiyatı (24 Ayar)&nbsp;<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="1"
                                value={gramPrice}
                                onChange={(e) => setGramPrice(e.target.value)}
                                placeholder={livePrices ? String(livePrices.gramPrice24k) : "3000"}
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₺</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Bankanızın veya kuyumcunuzun güncel 24 ayar gram fiyatı.</p>
                    </div>

                    {/* Sikke primi */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Sikke Primi</label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="0.5"
                                value={coinPremium}
                                onChange={(e) => setCoinPremium(e.target.value)}
                                placeholder="3"
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
                                onChange={(e) => setMakas(e.target.value)}
                                placeholder="0.5"
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
                <GoldSummaryCard rows={rows} totals={totals} txType={txType} />
            )}
        </div>
    );
}
