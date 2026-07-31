import type { CurrencyCode, FxRateCache } from "@/lib/fx/fxPriceTypes";
import { calculateCrossRate, calculateFxToTRY, calculateTRYToFx, formatCurrencyAmount, formatTRY } from "@/lib/fx/fxCalculations";

type PopularItem =
    | { title: string; kind: "fx-to-try"; currency: CurrencyCode; amount: number }
    | { title: string; kind: "try-to-fx"; currency: CurrencyCode; amount: number }
    | { title: string; kind: "cross"; from: CurrencyCode; to: CurrencyCode; amount: number };

const items: PopularItem[] = [
    { title: "1 dolar kaç TL?", kind: "fx-to-try", currency: "USD", amount: 1 },
    { title: "10 dolar kaç TL?", kind: "fx-to-try", currency: "USD", amount: 10 },
    { title: "100 dolar kaç TL?", kind: "fx-to-try", currency: "USD", amount: 100 },
    { title: "1000 dolar kaç TL?", kind: "fx-to-try", currency: "USD", amount: 1000 },
    { title: "1 euro kaç TL?", kind: "fx-to-try", currency: "EUR", amount: 1 },
    { title: "100 euro kaç TL?", kind: "fx-to-try", currency: "EUR", amount: 100 },
    { title: "1000 euro kaç TL?", kind: "fx-to-try", currency: "EUR", amount: 1000 },
    { title: "1 sterlin kaç TL?", kind: "fx-to-try", currency: "GBP", amount: 1 },
    { title: "100 sterlin kaç TL?", kind: "fx-to-try", currency: "GBP", amount: 100 },
    { title: "1000 TL kaç dolar?", kind: "try-to-fx", currency: "USD", amount: 1000 },
    { title: "10000 TL kaç dolar?", kind: "try-to-fx", currency: "USD", amount: 10000 },
    { title: "100000 TL kaç dolar?", kind: "try-to-fx", currency: "USD", amount: 100000 },
    { title: "1000 TL kaç euro?", kind: "try-to-fx", currency: "EUR", amount: 1000 },
    { title: "10000 TL kaç euro?", kind: "try-to-fx", currency: "EUR", amount: 10000 },
    { title: "1 dolar kaç euro?", kind: "cross", from: "USD", to: "EUR", amount: 1 },
    { title: "1 euro kaç dolar?", kind: "cross", from: "EUR", to: "USD", amount: 1 },
    { title: "100 dolar kaç euro?", kind: "cross", from: "USD", to: "EUR", amount: 100 },
    { title: "100 euro kaç dolar?", kind: "cross", from: "EUR", to: "USD", amount: 100 },
];

function buildDescription(item: PopularItem, cache: FxRateCache) {
    if (item.kind === "fx-to-try") {
        const value = calculateFxToTRY({ rates: cache.rates, currency: item.currency, amount: item.amount, transactionType: "buy" });
        return `Güncel satış kuruna göre ${item.amount.toLocaleString("tr-TR")} ${item.currency} yaklaşık ${formatTRY(value)} eder.`;
    }
    if (item.kind === "try-to-fx") {
        const value = calculateTRYToFx({ rates: cache.rates, currency: item.currency, tryAmount: item.amount, transactionType: "buy" });
        return `Güncel satış kuruna göre ${formatTRY(item.amount)} ile yaklaşık ${formatCurrencyAmount(value, item.currency)} alınabilir.`;
    }
    const value = calculateCrossRate({ rates: cache.rates, fromCurrency: item.from, toCurrency: item.to, amount: item.amount });
    return `Güncel çapraz kura göre ${item.amount.toLocaleString("tr-TR")} ${item.from} yaklaşık ${formatCurrencyAmount(value, item.to)} eder.`;
}

function href(item: PopularItem) {
    if (item.kind === "fx-to-try") return `?mod=fx-to-try&from=${item.currency}&amount=${item.amount}#doviz-cevirici`;
    if (item.kind === "try-to-fx") return `?mod=try-to-fx&to=${item.currency}&amount=${item.amount}#doviz-cevirici`;
    return `?mod=cross&from=${item.from}&to=${item.to}&amount=${item.amount}#doviz-cevirici`;
}

export default function PopularFxCalculations({ cache }: { cache: FxRateCache | null }) {
    if (!cache) return null;

    return (
        <section aria-labelledby="populer-doviz-hesaplamalari" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="populer-doviz-hesaplamalari" className="text-2xl font-black tracking-tight text-slate-950">Popüler Döviz Hesaplamaları</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <a key={item.title} href={href(item)} className="min-h-[132px] rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-[#B84418] hover:bg-[#FFF3EE] focus:outline-none focus:ring-4 focus:ring-orange-100">
                        <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{buildDescription(item, cache)}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}
