"use client";

import { useEffect, useMemo, useState } from "react";
import type { CurrencyCode, FxRateCache } from "@/lib/fx/fxPriceTypes";
import {
    FX_CURRENCY_INFO,
    FX_CURRENCY_ORDER,
    calculateBsmvAmount,
    calculateCrossRate,
    calculateFxToTRY,
    calculateSpread,
    calculateSpreadPercent,
    calculateTRYToFx,
    calculateTotalWithBsmv,
    formatCurrencyAmount,
    formatPercent,
    formatRate,
    formatTRY,
} from "@/lib/fx/fxCalculations";

type FxMode = "fx-to-try" | "try-to-fx" | "bozdurma" | "alim" | "cross" | "makas" | "bsmv";

const modeLabels: Record<FxMode, string> = {
    "fx-to-try": "Dövizden TL'ye",
    "try-to-fx": "TL'den dövize",
    bozdurma: "Döviz bozdurma",
    alim: "Döviz alıyorum",
    cross: "Çapraz kur",
    makas: "Alış/satış makası",
    bsmv: "BSMV dahil maliyet",
};

function isCurrency(value: string | null): value is CurrencyCode {
    return Boolean(value && FX_CURRENCY_ORDER.includes(value as CurrencyCode));
}

function isMode(value: string | null): value is FxMode {
    return Boolean(value && value in modeLabels);
}

function parseAmount(value: string | null, fallback: string) {
    if (!value) return fallback;
    const parsed = Number.parseFloat(value.replace(",", "."));
    return Number.isFinite(parsed) && parsed >= 0 ? String(parsed) : fallback;
}

function readInitialState() {
    if (typeof window === "undefined") {
        return { mode: "fx-to-try" as FxMode, from: "USD" as CurrencyCode, to: "EUR" as CurrencyCode, amount: "100", bsmvRate: "0.002" };
    }

    const params = new URLSearchParams(window.location.search);
    const mode = isMode(params.get("mod")) ? params.get("mod") as FxMode : "fx-to-try";
    const from = isCurrency(params.get("from")) ? params.get("from") as CurrencyCode : "USD";
    const to = isCurrency(params.get("to")) ? params.get("to") as CurrencyCode : "EUR";
    const amount = parseAmount(params.get("amount"), mode === "try-to-fx" || mode === "alim" ? "10000" : "100");
    return { mode, from, to, amount, bsmvRate: parseAmount(params.get("bsmv"), "0.002") };
}

export default function FxCalculator({ initialRates }: { initialRates: FxRateCache | null }) {
    const initial = readInitialState();
    const [mode, setMode] = useState<FxMode>(initial.mode);
    const [from, setFrom] = useState<CurrencyCode>(initial.from);
    const [to, setTo] = useState<CurrencyCode>(initial.to);
    const [amount, setAmount] = useState(initial.amount);
    const [bsmvRate, setBsmvRate] = useState(initial.bsmvRate);

    useEffect(() => {
        const onPopState = () => {
            const next = readInitialState();
            setMode(next.mode);
            setFrom(next.from);
            setTo(next.to);
            setAmount(next.amount);
            setBsmvRate(next.bsmvRate);
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        params.set("mod", mode);
        params.set("from", from);
        params.set("to", to);
        params.set("amount", amount || "0");
        if (mode === "bsmv") params.set("bsmv", bsmvRate || "0");
        const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState(null, "", nextUrl);
    }, [amount, bsmvRate, from, mode, to]);

    const numericAmount = Math.max(0, Number.parseFloat(amount.replace(",", ".")) || 0);
    const numericBsmv = Math.max(0, Number.parseFloat(bsmvRate.replace(",", ".")) || 0);

    const result = useMemo(() => {
        if (!initialRates) return null;
        if (mode === "try-to-fx" || mode === "alim") {
            const currency = mode === "try-to-fx" ? to : from;
            const value = calculateTRYToFx({ rates: initialRates.rates, currency, tryAmount: numericAmount, transactionType: "buy" });
            return {
                label: "Alınabilecek döviz",
                value: formatCurrencyAmount(value, currency),
                detail: `${formatTRY(numericAmount)} ile satış kuruna göre yaklaşık ${formatCurrencyAmount(value, currency)} alınabilir.`,
            };
        }
        if (mode === "bozdurma") {
            const value = calculateFxToTRY({ rates: initialRates.rates, currency: from, amount: numericAmount, transactionType: "sell" });
            return { label: "Yaklaşık bozdurma karşılığı", value: formatTRY(value), detail: "Bozdurma modunda alış kuru kullanılır." };
        }
        if (mode === "cross") {
            const value = calculateCrossRate({ rates: initialRates.rates, fromCurrency: from, toCurrency: to, amount: numericAmount });
            return { label: "Yaklaşık çapraz kur sonucu", value: formatCurrencyAmount(value, to), detail: `${numericAmount.toLocaleString("tr-TR")} ${from}, TRY bazlı çapraz kura göre yaklaşık ${formatCurrencyAmount(value, to)} eder.` };
        }
        if (mode === "makas") {
            const rate = initialRates.rates[from];
            return {
                label: "Alış/satış makası",
                value: formatTRY(calculateSpread(rate.buy, rate.sell)),
                detail: `${from} için makas yüzdesi ${formatPercent(calculateSpreadPercent(rate.buy, rate.sell))}.`,
            };
        }
        if (mode === "bsmv") {
            const tradeAmount = calculateFxToTRY({ rates: initialRates.rates, currency: from, amount: numericAmount, transactionType: "buy" });
            return {
                label: "BSMV dahil yaklaşık maliyet",
                value: formatTRY(calculateTotalWithBsmv(tradeAmount, numericBsmv)),
                detail: `${formatTRY(tradeAmount)} işlem tutarı için yaklaşık BSMV ${formatTRY(calculateBsmvAmount(tradeAmount, numericBsmv))}.`,
            };
        }
        const value = calculateFxToTRY({ rates: initialRates.rates, currency: from, amount: numericAmount, transactionType: "buy" });
        return { label: "Yaklaşık TL karşılığı", value: formatTRY(value), detail: "Dövizden TL'ye genel hesapta satış kuru ile yaklaşık karşılık gösterilir." };
    }, [from, initialRates, mode, numericAmount, numericBsmv, to]);

    if (!initialRates) {
        return (
            <section id="doviz-cevirici" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Döviz Çevirici</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">Döviz kurları geçici olarak alınamıyor. Lütfen işlem öncesinde kurumunuzun güncel kurunu kontrol edin.</p>
            </section>
        );
    }

    const selectedRate = initialRates.rates[from];

    return (
        <section id="doviz-cevirici" aria-labelledby="fx-calculator-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Döviz çevirici</p>
                    <h2 id="fx-calculator-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">Döviz Çevirici</h2>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-slate-700">
                    Döviz alıyorum: satış kuru kullanılır. Döviz bozduruyorum: alış kuru kullanılır. Alış ve satış arasındaki fark makas olarak adlandırılır.
                </p>
            </div>

            <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-black text-slate-800">Hesaplama modu</legend>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-label="Hesaplama modu">
                    {(Object.entries(modeLabels) as Array<[FxMode, string]>).map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={mode === value}
                            onClick={() => setMode(value)}
                            className={`min-h-11 rounded-md border px-3 text-sm font-black transition ${mode === value ? "border-[#B84418] bg-[#B84418] text-white" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-orange-300 hover:bg-white"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </fieldset>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-black text-slate-800">{mode === "try-to-fx" || mode === "alim" ? "TL tutarı" : "Miktar"}</span>
                        <input
                            id="fx-amount-input"
                            type="number"
                            min="0"
                            step="any"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#B84418] focus:outline-none focus:ring-2 focus:ring-orange-200"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-black text-slate-800">{mode === "try-to-fx" ? "Alınacak döviz" : "Para birimi"}</span>
                        <select value={mode === "try-to-fx" ? to : from} onChange={(event) => mode === "try-to-fx" ? setTo(event.target.value as CurrencyCode) : setFrom(event.target.value as CurrencyCode)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#B84418] focus:outline-none focus:ring-2 focus:ring-orange-200">
                            {FX_CURRENCY_ORDER.map((code) => <option key={code} value={code}>{code} - {FX_CURRENCY_INFO[code].name}</option>)}
                        </select>
                    </label>
                    {mode === "cross" && (
                        <label className="block">
                            <span className="text-sm font-black text-slate-800">Hedef para birimi</span>
                            <select value={to} onChange={(event) => setTo(event.target.value as CurrencyCode)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#B84418] focus:outline-none focus:ring-2 focus:ring-orange-200">
                                {FX_CURRENCY_ORDER.map((code) => <option key={code} value={code}>{code} - {FX_CURRENCY_INFO[code].name}</option>)}
                            </select>
                        </label>
                    )}
                    {mode === "bsmv" && (
                        <label className="block">
                            <span className="text-sm font-black text-slate-800">BSMV oranı</span>
                            <input type="number" min="0" step="0.001" value={bsmvRate} onChange={(event) => setBsmvRate(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#B84418] focus:outline-none focus:ring-2 focus:ring-orange-200" />
                        </label>
                    )}
                </div>

                <div className="rounded-lg border border-orange-200 bg-[#FFF8E7] p-5" aria-live="polite" aria-atomic="true">
                    <p className="text-sm font-black text-slate-700">{result?.label}</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{result?.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{result?.detail}</p>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div>
                            <dt className="text-xs font-bold text-slate-500">Alış</dt>
                            <dd className="text-sm font-black tabular-nums text-emerald-700">{formatRate(selectedRate.buy)} TL</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-bold text-slate-500">Satış</dt>
                            <dd className="text-sm font-black tabular-nums text-red-700">{formatRate(selectedRate.sell)} TL</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-bold text-slate-500">Makas</dt>
                            <dd className="text-sm font-black tabular-nums text-slate-950">{formatPercent(calculateSpreadPercent(selectedRate.buy, selectedRate.sell))}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <p>
                    Sonuçlar yaklaşık ve bilgilendirme amaçlıdır; bu sayfa yatırım tavsiyesi içermez. Kambiyo vergisi/BSMV oranı işlem türüne, kuruma ve güncel mevzuata göre değişebilir.
                </p>
            </div>
        </section>
    );
}
