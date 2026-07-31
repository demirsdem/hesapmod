"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { LanguageCode } from "@/lib/calculator-types";
import {
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface Props {
    lang: LanguageCode;
}

interface YearData {
    gramTRY: number;
    gramUSD: number;
    ounceUSD: number;
    usdtry: number;
}

interface LiveGoldPriceResponse {
    fiyat?: number;
    gramPrice24k?: number;
    kaynak?: string;
    source?: string;
    guncellemeZamani?: string;
    updatedAt?: string;
    onsUsd?: number | null;
    ons?: number | null;
    usdTl?: number | null;
}

interface LiveGoldPrice {
    price: number;
    source: string;
    updatedAt: string;
    onsUsd: number | null;
    usdTl: number | null;
}

interface GoldChartPoint {
    year: string;
    gramTRY: number;
    ounceUSD: number | null;
    yoy: number | null;
    isLive?: boolean;
}

// Kaynak: TCMB, World Gold Council — yıllık ortalama piyasa verileri
const HISTORICAL: Record<string, YearData> = {
    "2010": { gramTRY:    59, gramUSD:  39.4, ounceUSD: 1225, usdtry:  1.50 },
    "2011": { gramTRY:    84, gramUSD:  50.5, ounceUSD: 1572, usdtry:  1.67 },
    "2012": { gramTRY:    97, gramUSD:  53.6, ounceUSD: 1668, usdtry:  1.80 },
    "2013": { gramTRY:    91, gramUSD:  45.3, ounceUSD: 1411, usdtry:  2.00 },
    "2014": { gramTRY:    90, gramUSD:  40.7, ounceUSD: 1266, usdtry:  2.19 },
    "2015": { gramTRY:    93, gramUSD:  34.1, ounceUSD: 1061, usdtry:  2.72 },
    "2016": { gramTRY:   121, gramUSD:  40.1, ounceUSD: 1248, usdtry:  3.02 },
    "2017": { gramTRY:   148, gramUSD:  40.4, ounceUSD: 1257, usdtry:  3.65 },
    "2018": { gramTRY:   197, gramUSD:  40.8, ounceUSD: 1268, usdtry:  4.82 },
    "2019": { gramTRY:   254, gramUSD:  44.8, ounceUSD: 1393, usdtry:  5.68 },
    "2020": { gramTRY:   399, gramUSD:  56.9, ounceUSD: 1769, usdtry:  7.01 },
    "2021": { gramTRY:   515, gramUSD:  57.8, ounceUSD: 1799, usdtry:  8.90 },
    "2022": { gramTRY:   959, gramUSD:  57.9, ounceUSD: 1800, usdtry: 16.56 },
    "2023": { gramTRY:  1652, gramUSD:  62.4, ounceUSD: 1941, usdtry: 26.49 },
    "2024": { gramTRY:  2527, gramUSD:  76.8, ounceUSD: 2389, usdtry: 32.90 },
    "2025": { gramTRY:  4200, gramUSD:  95.5, ounceUSD: 2971, usdtry: 43.98 },
};

// TÜFE birikimli çarpan (2010 baz → 2026 bugün)
const INF_MULTIPLIER: Record<string, number> = {
    "2010": 9.2, "2011": 8.1, "2012": 7.4, "2013": 6.8, "2014": 6.1,
    "2015": 5.6, "2016": 5.0, "2017": 4.3, "2018": 3.5, "2019": 2.9,
    "2020": 2.4, "2021": 1.9, "2022": 1.35, "2023": 1.15, "2024": 1.05, "2025": 1.02,
};

const YEARS = Object.keys(HISTORICAL).sort();
const CURRENT_YEAR_LABEL = "2026";
const ESTIMATED_DEPOSIT_ANNUAL_RATE = 0.25;

function fmt(n: number, dec = 0): string {
    return n.toLocaleString("tr-TR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
    });
}

function toPositiveNumber(value: unknown): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) && value > 0 ? value : null;
    }

    if (typeof value !== "string") return null;

    const cleaned = value.replace(/[^\d,.-]/g, "").trim();
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

function normalizeLiveGoldPrice(data: LiveGoldPriceResponse | null): LiveGoldPrice | null {
    const price = toPositiveNumber(data?.fiyat ?? data?.gramPrice24k);
    if (!data || !price) return null;

    return {
        price,
        source: data.kaynak ?? data.source ?? "altin-fiyat API",
        updatedAt: data.guncellemeZamani ?? data.updatedAt ?? new Date().toISOString(),
        onsUsd: toPositiveNumber(data.onsUsd ?? data.ons),
        usdTl: toPositiveNumber(data.usdTl),
    };
}

function formatSourceDate(value?: string): string {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function pctClass(pct: number): string {
    if (pct >= 50) return "text-emerald-700 font-bold";
    if (pct >= 20) return "text-green-700 font-semibold";
    if (pct >= 0)  return "text-slate-600";
    return "text-red-600 font-semibold";
}

function pctBadge(pct: number): string {
    if (pct >= 50) return "bg-emerald-100 text-emerald-800";
    if (pct >= 20) return "bg-green-100 text-green-800";
    if (pct >= 0)  return "bg-slate-100 text-slate-600";
    return "bg-red-100 text-red-700";
}

function ChartTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ payload?: GoldChartPoint }>;
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0]?.payload;
    if (!point) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
            <p className="font-bold text-slate-900">
                {point.year}{point.isLive ? " canlı" : ""}
            </p>
            <p className="mt-1 text-sky-700">
                Gram TL: <strong>{fmt(point.gramTRY, point.isLive ? 2 : 0)} ₺</strong>
            </p>
            <p className="text-amber-700">
                Ons USD: <strong>{point.ounceUSD ? `${fmt(point.ounceUSD)} $` : "—"}</strong>
            </p>
            <p className="text-slate-600">
                YoY: <strong>{point.yoy === null ? "—" : `${point.yoy >= 0 ? "+" : ""}${point.yoy.toFixed(0)}%`}</strong>
            </p>
        </div>
    );
}

export default function GecmisAltinFiyatlariCalculator({ lang: _lang }: Props) {
    const [livePrice,     setLivePrice]     = useState<number | null>(null);
    const [liveMeta,      setLiveMeta]      = useState<LiveGoldPrice | null>(null);
    const [pricesLoading, setPricesLoading] = useState(true);
    const [investAmount,  setInvestAmount]  = useState("10000");
    const [investYear,    setInvestYear]    = useState("2015");
    const [investMode,    setInvestMode]    = useState<"try" | "gram">("try");
    const [showBestYear,  setShowBestYear]  = useState(false);
    const [shareCopied,   setShareCopied]   = useState(false);
    const [chartReady,    setChartReady]    = useState(false);

    useEffect(() => {
        setChartReady(true);
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), 8000);

            try {
                const response = await fetch("/api/altin-fiyat", {
                    cache: "no-store",
                    signal: controller.signal,
                });
                const data = normalizeLiveGoldPrice(response.ok ? await response.json() as LiveGoldPriceResponse : null);

                if (cancelled) return;

                if (data) {
                    setLivePrice(data.price);
                    setLiveMeta(data);
                } else {
                    setLivePrice(null);
                    setLiveMeta(null);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("[gecmis-altin-fiyatlari] canlı fiyat alınamadı", error);
                    setLivePrice(null);
                    setLiveMeta(null);
                }
            } finally {
                window.clearTimeout(timeout);
                if (!cancelled) setPricesLoading(false);
            }
        }

        void load();
        return () => { cancelled = true; };
    }, []);

    const hasLivePrice = livePrice !== null;
    const currentGramTRY = livePrice;

    // Yatırım simülatörü
    const investResult = useMemo(() => {
        const amount = parseFloat(investAmount) || 0;
        const yearData = HISTORICAL[investYear];
        if (!yearData || amount <= 0 || currentGramTRY === null) return null;

        const gramsBought = investMode === "try" ? amount / yearData.gramTRY : amount;
        const costTRY     = investMode === "try" ? amount : amount * yearData.gramTRY;
        const currentValue = gramsBought * currentGramTRY;
        const gainTRY      = currentValue - costTRY;
        const gainPct      = (gainTRY / costTRY) * 100;
        const multiplier   = currentValue / costTRY;
        const infValue     = costTRY * (INF_MULTIPLIER[investYear] ?? 1);
        const realGain     = currentValue - infValue;
        const yearsHeld    = Math.max(1, Number(CURRENT_YEAR_LABEL) - Number(investYear));
        const depositValue = costTRY * Math.pow(1 + ESTIMATED_DEPOSIT_ANNUAL_RATE, yearsHeld);

        return { gramsBought, costTRY, currentValue, gainTRY, gainPct, multiplier, infValue, realGain, depositValue };
    }, [investAmount, investYear, investMode, currentGramTRY]);

    // Tablo (yeniden eskiye)
    const tableRows = useMemo(() =>
        YEARS.map((year, i) => {
            const data = HISTORICAL[year];
            const prev = i > 0 ? HISTORICAL[YEARS[i - 1]] : null;
            const yoy  = prev ? ((data.gramTRY - prev.gramTRY) / prev.gramTRY) * 100 : null;
            return { year, ...data, yoy };
        }).reverse(),
    []);

    // 2026 YoY vs 2025
    const yoy2026 = currentGramTRY !== null
        ? ((currentGramTRY - HISTORICAL["2025"].gramTRY) / HISTORICAL["2025"].gramTRY) * 100
        : null;
    const usdtry2026 = liveMeta?.usdTl
        ?? (liveMeta?.onsUsd && currentGramTRY !== null ? (currentGramTRY * 31.1035) / liveMeta.onsUsd : null);
    const gramUsd2026 = currentGramTRY !== null && usdtry2026 ? currentGramTRY / usdtry2026 : null;
    const onsUsd2026 = liveMeta?.onsUsd
        ?? (currentGramTRY !== null && usdtry2026 ? (currentGramTRY / usdtry2026) * 31.1035 : null);

    const chartData = useMemo<GoldChartPoint[]>(() => {
        const historicalPoints = YEARS.map((year, index) => {
            const current = HISTORICAL[year];
            const previous = index > 0 ? HISTORICAL[YEARS[index - 1]] : null;

            return {
                year,
                gramTRY: current.gramTRY,
                ounceUSD: current.ounceUSD,
                yoy: previous ? ((current.gramTRY - previous.gramTRY) / previous.gramTRY) * 100 : null,
            };
        });

        if (currentGramTRY === null) return historicalPoints;

        return [
            ...historicalPoints,
            {
                year: CURRENT_YEAR_LABEL,
                gramTRY: currentGramTRY,
                ounceUSD: onsUsd2026,
                yoy: yoy2026,
                isLive: true,
            },
        ];
    }, [currentGramTRY, onsUsd2026, yoy2026]);

    const bestYear = useMemo(() => {
        if (currentGramTRY === null) return null;

        return YEARS.map((year) => {
            const gainPct = ((currentGramTRY - HISTORICAL[year].gramTRY) / HISTORICAL[year].gramTRY) * 100;
            return { year, gainPct };
        }).reduce((best, current) => current.gainPct > best.gainPct ? current : best);
    }, [currentGramTRY]);

    const comparisonBars = useMemo(() => {
        if (!investResult) return [];

        const values = [
            { label: "Altın getirisi", value: investResult.currentValue, color: "bg-emerald-500", text: "text-emerald-700" },
            { label: "Enflasyon koruması", value: investResult.infValue, color: "bg-sky-500", text: "text-sky-700" },
            { label: "Mevduat getirisi", value: investResult.depositValue, color: "bg-amber-500", text: "text-amber-700" },
        ];
        const max = Math.max(...values.map((item) => item.value), 1);

        return values.map((item) => ({
            ...item,
            widthPct: Math.max(8, (item.value / max) * 100),
        }));
    }, [investResult]);

    const shareResult = async () => {
        if (!investResult) return;

        const amountLabel = investMode === "try"
            ? `${fmt(investResult.costTRY)}₺`
            : `${fmt(investResult.gramsBought, 2)}g`;
        const text = `📊 ${investYear}'te ${amountLabel} altın alsaydım bugün ${fmt(investResult.currentValue)}₺ olurdu!\n+${fmt(investResult.gainPct, 0)}% getiri | hesapmod.com ile hesaplandı`;

        await navigator.clipboard.writeText(text);
        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 1800);
    };

    const inputClass = "w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";

    return (
        <div className="space-y-6">

            {/* ── Canlı Fiyat Bandı ──────────────────────────── */}
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 shadow-sm min-h-[52px]">
                {pricesLoading && (
                    <div className="flex gap-3 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-amber-300 mt-1" />
                        <div className="h-3 w-48 rounded bg-amber-200" />
                    </div>
                )}
                {!pricesLoading && hasLivePrice && currentGramTRY !== null && (
                    <>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                                Canlı Fiyat
                            </span>
                        </div>
                        <span className="text-base font-extrabold text-amber-900">
                            Güncel Gram Altın: {fmt(currentGramTRY, 2)} ₺
                        </span>
                        <span className="text-sm text-amber-700">
                            2010'dan bu yana <strong>{(currentGramTRY / HISTORICAL["2010"].gramTRY).toFixed(0)}×</strong> artış
                        </span>
                        {yoy2026 !== null && (
                            <span className="text-sm text-amber-700 hidden sm:inline">
                                2025'e göre <span className={pctClass(yoy2026)}>{yoy2026 >= 0 ? "+" : ""}{yoy2026.toFixed(0)}%</span>
                            </span>
                        )}
                        <span className="text-xs text-amber-700/80">
                            {liveMeta?.source} · {formatSourceDate(liveMeta?.updatedAt)}
                        </span>
                    </>
                )}
                {!pricesLoading && !hasLivePrice && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-amber-900">
                            Güncel fiyat yüklenemedi, lütfen sayfayı yenileyin.
                        </span>
                    </div>
                )}
            </div>

            {/* ── Grafik ─────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-slate-900">Gram Altın TL Fiyatı — 2010–{CURRENT_YEAR_LABEL}</h2>
                    <span className="text-xs text-slate-400 hidden sm:inline">Yıllık ortalama · son nokta canlı piyasa</span>
                </div>
                <div className="h-[340px] w-full min-w-0">
                    {chartReady ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <ComposedChart data={chartData} margin={{ top: 18, right: 18, bottom: 8, left: 0 }}>
                                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 12, fill: "#64748b" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#cbd5e1" }}
                                />
                                <YAxis
                                    yAxisId="try"
                                    tickFormatter={(value) => `₺${fmt(Number(value))}`}
                                    tick={{ fontSize: 12, fill: "#0369a1" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#bae6fd" }}
                                    width={64}
                                />
                                <YAxis
                                    yAxisId="usd"
                                    orientation="right"
                                    tickFormatter={(value) => `$${fmt(Number(value))}`}
                                    tick={{ fontSize: 12, fill: "#b45309" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#fed7aa" }}
                                    width={64}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />
                                <ReferenceLine
                                    x="2022"
                                    yAxisId="try"
                                    stroke="#ef4444"
                                    strokeDasharray="4 4"
                                    label={{ value: "2022 kur şoku", angle: -90, position: "insideTop", fill: "#b91c1c", fontSize: 11 }}
                                />
                                <Line
                                    yAxisId="try"
                                    type="monotone"
                                    dataKey="gramTRY"
                                    name="Gram altın TL"
                                    stroke="#0284c7"
                                    strokeWidth={3}
                                    dot={(props) => {
                                        const payload = props.payload as GoldChartPoint | undefined;
                                        return (
                                            <circle
                                                cx={props.cx}
                                                cy={props.cy}
                                                r={payload?.isLive ? 5 : 3}
                                                fill={payload?.isLive ? "#0f172a" : "#0284c7"}
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        );
                                    }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="usd"
                                    type="monotone"
                                    dataKey="ounceUSD"
                                    name="Ons altın USD"
                                    stroke="#f59e0b"
                                    strokeWidth={2.4}
                                    strokeDasharray="6 5"
                                    dot={false}
                                    connectNulls
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
                    )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    2026 noktası tahmini değil; fiyat API'sinden gelen anlık piyasa değeridir.
                </p>
            </div>

            {/* ── Yatırım Simülatörü ─────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-base font-bold text-slate-900">Yatırım Simülatörü</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Geçmişte yaptığınız altın alımının bugünkü değerini hesaplayın.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Yatırım Türü</label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden text-sm shadow-sm">
                            {(["try", "gram"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setInvestMode(mode)}
                                    className={`flex-1 py-2.5 transition-colors ${
                                        investMode === mode
                                            ? "bg-amber-500 text-white font-semibold"
                                            : "bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {mode === "try" ? "TL ile" : "Gram ile"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            {investMode === "try" ? "Yatırdığınız TL" : "Aldığınız Gram"}
                        </label>
                        <div className="relative">
                            <input
                                type="number" min="0" step="any"
                                value={investAmount}
                                onChange={(e) => setInvestAmount(e.target.value)}
                                placeholder={investMode === "try" ? "10000" : "10"}
                                className={inputClass + " pr-10"}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                {investMode === "try" ? "₺" : "g"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Alım Yılı</label>
                        <div className="relative">
                            <select
                                value={investYear}
                                onChange={(e) => setInvestYear(e.target.value)}
                                className={inputClass + " appearance-none pr-8"}
                            >
                                {YEARS.slice().reverse().map((y) => (
                                    <option key={y} value={y}>
                                        {y} — {fmt(HISTORICAL[y].gramTRY)} ₺/g
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">▼</span>
                        </div>
                    </div>
                </div>

                {pricesLoading && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                        Güncel fiyat yükleniyor; bugünkü değer otomatik güncellenecek.
                    </div>
                )}

                {!pricesLoading && !hasLivePrice && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        Güncel fiyat yüklenemedi, lütfen sayfayı yenileyin.
                    </div>
                )}

                {hasLivePrice && investResult && currentGramTRY !== null && (
                    <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                <p className="text-xs text-slate-500 mb-1">Satın Alınan</p>
                                <p className="text-xl font-bold text-slate-800">
                                    {investResult.gramsBought.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} g
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{investYear} ortalaması {fmt(HISTORICAL[investYear].gramTRY)} ₺/g</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                <p className="text-xs text-slate-500 mb-1">Maliyet ({investYear})</p>
                                <p className="text-xl font-bold text-slate-800">{fmt(investResult.costTRY)} ₺</p>
                                <p className="text-xs text-slate-400 mt-0.5">{investYear} TL değeri ile</p>
                            </div>
                            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3.5">
                                <p className="text-xs text-slate-500 mb-1">Bugünkü Değer</p>
                                <p className="text-xl font-bold text-green-700">{fmt(investResult.currentValue)} ₺</p>
                                <p className="text-xs text-slate-400 mt-0.5">Güncel {fmt(currentGramTRY)} ₺/g ile</p>
                            </div>
                            <div className="rounded-xl bg-green-100 border-2 border-green-300 px-4 py-3.5">
                                <p className="text-xs text-slate-600 mb-1">Toplam Getiri</p>
                                <p className={`text-2xl font-extrabold ${investResult.gainTRY >= 0 ? "text-green-700" : "text-red-700"}`}>
                                    {investResult.gainTRY >= 0 ? "+" : ""}{fmt(investResult.gainPct, 0)}%
                                </p>
                                <p className="text-sm font-bold text-green-700 mt-0.5">
                                    {investResult.multiplier.toFixed(1)}× artış
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#FFD7C7] bg-[#FFF3EE] px-4 py-3 text-sm">
                            <span className="text-slate-600">
                                📊 Aynı {fmt(investResult.costTRY)} ₺&apos;yi {investYear}&apos;dan bu yana enflasyon karşısında korusaydınız, yaklaşık{" "}
                                <strong className="text-slate-800">{fmt(investResult.infValue)} ₺</strong> değerinde olurdu.{" "}
                            </span>
                            <span className={`font-semibold ${investResult.realGain >= 0 ? "text-green-700" : "text-red-700"}`}>
                                Altın: enflasyona göre {investResult.realGain >= 0 ? "+" : ""}{fmt(investResult.realGain)} ₺ reel kazanç.
                            </span>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-sm font-bold text-slate-900">Getiri Karşılaştırması</h3>
                                <span className="text-xs font-medium text-slate-400">Mevduat yıllık %{Math.round(ESTIMATED_DEPOSIT_ANNUAL_RATE * 100)} varsayımıyla</span>
                            </div>
                            <div className="space-y-3">
                                {comparisonBars.map((bar) => (
                                    <div key={bar.label}>
                                        <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                                            <span className="font-semibold text-slate-600">{bar.label}</span>
                                            <span className={`font-bold tabular-nums ${bar.text}`}>{fmt(bar.value)} ₺</span>
                                        </div>
                                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className={`h-full rounded-full ${bar.color}`}
                                                style={{ width: `${bar.widthPct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div>
                                <p className="text-sm font-bold text-slate-900">Hangi yılda alsaydım en çok kazanırdım?</p>
                                {showBestYear && bestYear && (
                                    <p className="mt-1 text-sm font-semibold text-emerald-700">
                                        {bestYear.year}&apos;da alsaydınız: +{fmt(bestYear.gainPct, 0)}% (en yüksek)
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBestYear(true)}
                                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                                >
                                    En İyi Yılı Bul
                                </button>
                                <button
                                    type="button"
                                    onClick={() => void shareResult()}
                                    className="rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                                >
                                    {shareCopied ? "Kopyalandı" : "Paylaş"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Tarihi Fiyat Tablosu ───────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">Yıllık Gram Altın Fiyat Tablosu (2010–{CURRENT_YEAR_LABEL})</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Yıllık ortalama piyasa değerleri. {CURRENT_YEAR_LABEL} satırı güncel canlı fiyata göre hesaplanmıştır.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <th className="text-left px-5 py-3">Yıl</th>
                                <th className="text-right px-4 py-3">Gram ₺</th>
                                <th className="text-right px-4 py-3 hidden sm:table-cell">Gram $</th>
                                <th className="text-right px-4 py-3 hidden md:table-cell">Ons $</th>
                                <th className="text-right px-4 py-3 hidden md:table-cell">USD/TL</th>
                                <th className="text-right px-5 py-3">YoY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* 2026 canlı satır */}
                            <tr className="bg-amber-50">
                                <td className="px-5 py-3">
                                    <span className="font-bold text-amber-800">{CURRENT_YEAR_LABEL}</span>
                                    <span className="ml-2 rounded-full bg-amber-200 px-1.5 py-0.5 text-xs font-semibold text-amber-900">canlı</span>
                                </td>
                                <td className="px-4 py-3 text-right font-extrabold text-amber-800">
                                    {pricesLoading && <span className="text-slate-300 animate-pulse">...</span>}
                                    {!pricesLoading && currentGramTRY !== null && <>{fmt(currentGramTRY, 2)} ₺/g</>}
                                    {!pricesLoading && currentGramTRY === null && <span className="text-red-500">yüklenemedi</span>}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500 hidden sm:table-cell">
                                    {gramUsd2026 ? fmt(gramUsd2026, 1) : "—"}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">
                                    {onsUsd2026 ? fmt(onsUsd2026) : "—"}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">
                                    {usdtry2026 ? fmt(usdtry2026, 2) : "—"}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {yoy2026 !== null ? (
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pctBadge(yoy2026)}`}>
                                            {yoy2026 >= 0 ? "+" : ""}{yoy2026.toFixed(0)}%
                                        </span>
                                    ) : (
                                        <span className="text-slate-300">—</span>
                                    )}
                                </td>
                            </tr>

                            {tableRows.map((row) => (
                                <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-5 py-3 font-semibold text-slate-800">{row.year}</td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-800">{fmt(row.gramTRY)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500 hidden sm:table-cell">
                                        {row.gramUSD.toFixed(1)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">
                                        {fmt(row.ounceUSD)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">
                                        {row.usdtry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        {row.yoy !== null ? (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pctBadge(row.yoy)}`}>
                                                {row.yoy >= 0 ? "+" : ""}{row.yoy.toFixed(0)}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-300">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        2010–2025 verileri TCMB ve World Gold Council yıllık ortalama piyasa değerlerini yansıtır.
                        {" "}
                        {liveMeta
                            ? `2026 değeri: ${formatSourceDate(liveMeta.updatedAt)} itibarıyla canlı piyasa fiyatıdır. Kaynak: ${liveMeta.source}.`
                            : "2026 canlı değeri alınamadı; güncel fiyat için sayfayı yenileyin."}
                    </p>
                </div>
            </div>

            {/* ── Temel İstatistikler ─────────────────────────── */}
            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    {
                        label: "En Yüksek Yıllık Artış",
                        value: "2022",
                        detail: "+86% (TL bazında)",
                        sub: "USD/TL kur şoku (+244%)",
                        color: "border-emerald-200 bg-emerald-50",
                        textColor: "text-emerald-800",
                    },
                    {
                        label: "En Düşük Yıllık Artış",
                        value: "2014",
                        detail: "-1% (gram TL)",
                        sub: "Ons bazında -14% düşüş",
                        color: "border-red-200 bg-red-50",
                        textColor: "text-red-800",
                    },
                    {
                        label: "15 Yıllık Toplam Artış",
                        value: currentGramTRY !== null
                            ? `${((currentGramTRY / HISTORICAL["2010"].gramTRY - 1) * 100).toFixed(0)}%`
                            : "—",
                        detail: currentGramTRY !== null ? `59 ₺ → ${fmt(currentGramTRY)} ₺` : "Canlı fiyat bekleniyor",
                        sub: currentGramTRY !== null ? "2010–2026 gram TL" : "Güncel fiyat alınamadı",
                        color: "border-amber-200 bg-amber-50",
                        textColor: "text-amber-800",
                    },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border p-4 ${stat.color}`}>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
                        <p className={`text-2xl font-extrabold ${stat.textColor}`}>{stat.value}</p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{stat.detail}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
