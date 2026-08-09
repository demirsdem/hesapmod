"use client";

import { useMemo, useState } from "react";

type CurrencyCode = "USD" | "EUR" | "GBP";

type Props = {
    /** [usdtry, eurtry, gbptry] — sayfadaki DATA tablosunun aynısı, prop olarak gelir. */
    data: Record<string, [number, number, number]>;
    provisionalYear: string;
};

type Direction = "fx-to-try" | "try-to-fx";

const CURRENCY_INDEX: Record<CurrencyCode, 0 | 1 | 2> = { USD: 0, EUR: 1, GBP: 2 };
const CURRENCY_LABELS: Record<CurrencyCode, string> = {
    USD: "Dolar (USD)",
    EUR: "Euro (EUR)",
    GBP: "Sterlin (GBP)",
};

const RELATIVE_OFFSETS = [1, 2, 3, 4, 5, 10];

function formatDecimal(value: number, maximumFractionDigits = 2) {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: Math.min(2, maximumFractionDigits),
        maximumFractionDigits,
    }).format(value);
}

export default function HistoricalFxConverter({ data, provisionalYear }: Props) {
    // Sabit başlangıç state'i: server ve client aynı HTML'i üretir (hydration uyuşmazlığı yok).
    const [year, setYear] = useState("2010");
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [amount, setAmount] = useState("100");
    const [direction, setDirection] = useState<Direction>("fx-to-try");

    const years = useMemo(
        () => Object.keys(data).sort((a, b) => Number(b) - Number(a)),
        [data],
    );

    // "X yıl önce" seçenekleri yalnızca tabloda karşılığı olan yıllar için üretilir.
    const relativeOptions = useMemo(() => {
        const now = new Date().getFullYear();
        return RELATIVE_OFFSETS.map((offset) => ({ offset, target: String(now - offset) })).filter(
            (item) => Boolean(data[item.target]),
        );
    }, [data]);

    const result = useMemo(() => {
        const rate = data[year]?.[CURRENCY_INDEX[currency]];
        if (!rate) return null;

        const parsed = Number.parseFloat(amount.replace(",", "."));
        if (!Number.isFinite(parsed) || parsed < 0) return null;

        const converted = direction === "fx-to-try" ? parsed * rate : parsed / rate;
        return { rate, parsed, converted };
    }, [data, year, currency, amount, direction]);

    const isProvisional = year === provisionalYear;
    const selectClass =
        "min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#B84418] focus:outline-none focus:ring-2 focus:ring-[#B84418]/30";

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <label htmlFor="fx-direction" className="block text-sm font-semibold text-slate-800">
                        Hesaplama yönü
                    </label>
                    <select
                        id="fx-direction"
                        className={`mt-2 ${selectClass}`}
                        value={direction}
                        onChange={(event) => setDirection(event.target.value as Direction)}
                    >
                        <option value="fx-to-try">Dövizden TL&apos;ye</option>
                        <option value="try-to-fx">TL&apos;den dövize</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="fx-year" className="block text-sm font-semibold text-slate-800">
                        Yıl
                    </label>
                    <select
                        id="fx-year"
                        className={`mt-2 ${selectClass}`}
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                    >
                        <optgroup label="Yıl seçin">
                            {years.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                    {item === provisionalYear ? " (geçici)" : ""}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Bugünden geriye">
                            {relativeOptions.map((item) => (
                                <option key={`rel-${item.offset}`} value={item.target}>
                                    {item.offset} yıl önce ({item.target})
                                </option>
                            ))}
                        </optgroup>
                    </select>
                </div>

                <div>
                    <label htmlFor="fx-currency" className="block text-sm font-semibold text-slate-800">
                        Para birimi
                    </label>
                    <select
                        id="fx-currency"
                        className={`mt-2 ${selectClass}`}
                        value={currency}
                        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                    >
                        {(Object.keys(CURRENCY_LABELS) as CurrencyCode[]).map((code) => (
                            <option key={code} value={code}>
                                {CURRENCY_LABELS[code]}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="fx-amount" className="block text-sm font-semibold text-slate-800">
                        Tutar ({direction === "fx-to-try" ? currency : "TL"})
                    </label>
                    <input
                        id="fx-amount"
                        className={`mt-2 ${selectClass}`}
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        aria-describedby="fx-result"
                    />
                </div>
            </div>

            <div id="fx-result" aria-live="polite" className="mt-5 rounded-lg bg-slate-900 p-5 text-orange-50">
                {result ? (
                    <>
                        <p className="text-sm text-orange-200">
                            {year} yılı yıllık ortalama {currency}/TL kuru: {formatDecimal(result.rate)} TL
                        </p>
                        <p className="mt-2 text-xl font-bold sm:text-2xl">
                            {direction === "fx-to-try" ? (
                                <>
                                    {year} yılında {formatDecimal(result.parsed)} {currency} ={" "}
                                    {formatDecimal(result.converted)} TL
                                </>
                            ) : (
                                <>
                                    {year} yılında {formatDecimal(result.parsed)} TL ={" "}
                                    {formatDecimal(result.converted)} {currency}
                                </>
                            )}
                        </p>
                        <p className="mt-2 text-sm text-orange-200">
                            Formül:{" "}
                            {direction === "fx-to-try"
                                ? `${formatDecimal(result.parsed)} × ${formatDecimal(result.rate)}`
                                : `${formatDecimal(result.parsed)} / ${formatDecimal(result.rate)}`}
                            . Sonuç günlük işlem kuru değil, yıllık ortalama analiz değeridir.
                            {isProvisional
                                ? ` ${provisionalYear} yılı tamamlanmadığı için bu kur geçici/yıl sonu tahminidir.`
                                : ""}
                        </p>
                    </>
                ) : (
                    <p className="text-base font-semibold">
                        Geçerli bir tutar girin (örnek: 100).
                    </p>
                )}
            </div>
        </div>
    );
}
