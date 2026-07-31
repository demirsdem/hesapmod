import type { CurrencyCode, FxBuySellRate, FxRateCache } from "@/lib/fx/fxPriceTypes";

const CURRENCY_API_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
const CURRENCY_API_FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";
const SUPPORTED: CurrencyCode[] = ["USD", "EUR", "GBP", "CHF", "JPY", "SAR", "AED", "KWD", "CAD", "AUD"];
const SPREAD_RATE = 0.0025;

type CurrencyApiResponse = {
    date: string;
    usd: Record<string, number>;
};

function toBuySell(mid: number): FxBuySellRate {
    return {
        buy: Number((mid * (1 - SPREAD_RATE)).toFixed(6)),
        sell: Number((mid * (1 + SPREAD_RATE)).toFixed(6)),
    };
}

function transformCurrencyApi(data: CurrencyApiResponse): FxRateCache | null {
    if (!data?.usd?.try) return null;

    const usdRates = data.usd;
    const tryPerUsd = usdRates.try;
    const rates = {} as Record<CurrencyCode, FxBuySellRate>;

    for (const code of SUPPORTED) {
        const usdPerCurrencyBase = code === "USD" ? 1 : usdRates[code.toLowerCase()];
        if (!usdPerCurrencyBase) return null;
        const tryPerCurrency = tryPerUsd / usdPerCurrencyBase;
        rates[code] = toBuySell(tryPerCurrency);
    }

    return {
        base: "TRY",
        rates,
        updatedAt: `${data.date}T09:00:00+03:00`,
        sourceName: "currency-api orta kur verisi, alış/satış aralığı türetilmiştir",
        sourceStatus: "live",
        stale: false,
    };
}

async function fetchJson(url: string): Promise<CurrencyApiResponse | null> {
    try {
        const response = await fetch(url, {
            next: { revalidate: 900 },
            headers: { Accept: "application/json" },
        });
        if (!response.ok) return null;
        return response.json() as Promise<CurrencyApiResponse>;
    } catch {
        return null;
    }
}

export async function fetchLiveFxCache(): Promise<FxRateCache | null> {
    const primary = await fetchJson(CURRENCY_API_URL);
    const primaryCache = primary ? transformCurrencyApi(primary) : null;
    if (primaryCache) return primaryCache;

    const fallback = await fetchJson(CURRENCY_API_FALLBACK_URL);
    return fallback ? transformCurrencyApi(fallback) : null;
}
