import { NextResponse } from "next/server";

export const revalidate = 900;

const TROY_OUNCE_GRAMS = 31.1035;
const COLLECT_API_URL = "https://api.collectapi.com/economy/goldPrice";
const ALTINKAYNAK_STORE_GOLD_URL = "https://static.altinkaynak.com/Store_Gold";
const TCMB_TODAY_XML_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";
const GOLDPRICE_ORG_URL = "https://data-asg.goldprice.org/dbXRates/USD";
const GOLD_API_URL = "https://api.gold-api.com/price/XAU";
const METALS_API_URL = "https://api.metals-api.com/v1/latest";

type NextFetchInit = RequestInit & {
    next?: {
        revalidate?: number;
    };
};

interface PricePayloadOptions {
    fiyat: number;
    kaynak: string;
    guncellemeZamani?: string;
    hasAltinSatis?: number | null;
    onsUsd?: number | null;
    usdTl?: number | null;
}

interface OnsPrice {
    value: number;
    source: string;
}

interface AltinkaynakGoldItem {
    Kod?: unknown;
    code?: unknown;
    Alis?: unknown;
    buy?: unknown;
    buying?: unknown;
    Satis?: unknown;
    sell?: unknown;
    selling?: unknown;
}

function parseNumber(value: unknown): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
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
    return Number.isFinite(parsed) ? parsed : null;
}

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
}

async function fetchWithTimeout(url: string, init: NextFetchInit = {}, timeoutMs = 5000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...init,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeout);
    }
}

function createPayload({
    fiyat,
    kaynak,
    guncellemeZamani = new Date().toISOString(),
    hasAltinSatis,
    onsUsd,
    usdTl,
}: PricePayloadOptions) {
    const roundedFiyat = roundMoney(fiyat);
    const tryPerOz = onsUsd && usdTl
        ? roundMoney(onsUsd * usdTl)
        : roundMoney(roundedFiyat * TROY_OUNCE_GRAMS);

    return {
        fiyat: roundedFiyat,
        kaynak,
        guncellemeZamani,

        // Eski altin hesaplayici ve gecmis fiyat ekranlari icin geriye uyumluluk.
        gramPrice24k: roundedFiyat,
        hasAltinAlis: roundedFiyat,
        hasAltinSatis: hasAltinSatis ? roundMoney(hasAltinSatis) : roundedFiyat,
        ceyrekAlis: null,
        ceyrekSatis: null,
        ons: onsUsd ?? null,
        onsUsd: onsUsd ?? null,
        usdTl: usdTl ?? null,
        tryPerOz,
        updatedAt: guncellemeZamani,
        source: kaynak,
    };
}

function cachedJson(payload: ReturnType<typeof createPayload>) {
    return NextResponse.json(payload, {
        headers: {
            "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
    });
}

async function fetchCollectApiPrice() {
    const apiKey = process.env.COLLECT_API_KEY?.trim();
    if (!apiKey) return null;

    const response = await fetchWithTimeout(COLLECT_API_URL, {
        next: { revalidate },
        headers: {
            Accept: "application/json",
            authorization: `apikey ${apiKey}`,
        },
    });

    if (!response.ok) {
        throw new Error(`CollectAPI ${response.status}`);
    }

    const json = await response.json();
    const list = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.result)
            ? json.result
            : [];

    const gramAltin = list.find((item: { name?: unknown }) =>
        typeof item?.name === "string" && item.name.trim().toLocaleLowerCase("tr-TR") === "gram altın"
    );

    const buying = parseNumber(gramAltin?.buying);
    if (!buying || buying <= 0) {
        throw new Error("CollectAPI gram altin buying parse failed");
    }

    return createPayload({
        fiyat: buying,
        kaynak: "CollectAPI",
        guncellemeZamani: new Date().toISOString(),
        hasAltinSatis: parseNumber(gramAltin?.selling),
    });
}

async function fetchAltinkaynakStoreGoldPrice() {
    const response = await fetchWithTimeout(ALTINKAYNAK_STORE_GOLD_URL, {
        next: { revalidate },
        headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 HesapMod/1.0",
        },
    });

    if (!response.ok) {
        throw new Error(`Altinkaynak Store_Gold ${response.status}`);
    }

    const json = await response.json();
    const list = Array.isArray(json) ? json : Array.isArray(json?.items) ? json.items : [];
    const hasAltin = list.find((item: AltinkaynakGoldItem) =>
        String(item?.Kod ?? item?.code ?? "").toUpperCase() === "HH_T"
    );

    const buying = parseNumber(hasAltin?.Alis ?? hasAltin?.buy ?? hasAltin?.buying);
    if (!buying || buying <= 0) {
        throw new Error("Altinkaynak Store_Gold HH_T parse failed");
    }

    return createPayload({
        fiyat: buying,
        kaynak: "Altınkaynak Store_Gold",
        guncellemeZamani: new Date().toISOString(),
        hasAltinSatis: parseNumber(hasAltin?.Satis ?? hasAltin?.sell ?? hasAltin?.selling),
    });
}

function parseTcmbForexSelling(xml: string, code: "USD") {
    const currencyMatch = xml.match(new RegExp(`<Currency[^>]*(?:Kod|CurrencyCode)="${code}"[^>]*>([\\s\\S]*?)</Currency>`, "i"));
    const body = currencyMatch?.[1];
    const value = body?.match(/<ForexSelling>(.*?)<\/ForexSelling>/i)?.[1]?.trim();
    const parsed = parseNumber(value);

    return parsed && parsed > 0 ? parsed : null;
}

async function fetchTcmbUsdSelling() {
    const response = await fetchWithTimeout(TCMB_TODAY_XML_URL, {
        next: { revalidate },
        headers: { Accept: "application/xml,text/xml,*/*" },
    });

    if (!response.ok) {
        throw new Error(`TCMB ${response.status}`);
    }

    const xml = await response.text();
    const usdTl = parseTcmbForexSelling(xml, "USD");
    if (!usdTl) {
        throw new Error("TCMB USD ForexSelling parse failed");
    }

    return usdTl;
}

async function fetchGoldPriceOrgOnsUsd(): Promise<OnsPrice> {
    const response = await fetchWithTimeout(GOLDPRICE_ORG_URL, {
        next: { revalidate },
        headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            Origin: "https://goldprice.org",
            Referer: "https://goldprice.org/",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
    });

    if (!response.ok) {
        throw new Error(`goldprice.org ${response.status}`);
    }

    const json = await response.json();
    const items = Array.isArray(json?.items) ? json.items : [];
    const usdItem = items.find((item: { curr?: unknown }) => item?.curr === "USD") ?? items[0];
    const onsUsd = parseNumber(usdItem?.xauPrice ?? json?.xauPrice);

    if (!onsUsd || onsUsd <= 0) {
        throw new Error("goldprice.org ons parse failed");
    }

    return { value: onsUsd, source: "goldprice.org" };
}

async function fetchGoldApiOnsUsd(): Promise<OnsPrice> {
    const response = await fetchWithTimeout(GOLD_API_URL, {
        next: { revalidate },
        headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 HesapMod/1.0",
        },
    });

    if (!response.ok) {
        throw new Error(`gold-api.com ${response.status}`);
    }

    const json = await response.json();
    const onsUsd = parseNumber(json?.price);

    if (!onsUsd || onsUsd <= 0) {
        throw new Error("gold-api.com ons parse failed");
    }

    return { value: onsUsd, source: "gold-api.com" };
}

async function fetchMetalsApiOnsUsd(): Promise<OnsPrice | null> {
    const apiKey = process.env.METALS_API_KEY?.trim();
    if (!apiKey) return null;

    const url = `${METALS_API_URL}?access_key=${encodeURIComponent(apiKey)}&base=USD&symbols=XAU`;
    const response = await fetchWithTimeout(url, {
        next: { revalidate },
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error(`metals-api ${response.status}`);
    }

    const json = await response.json();
    const rate = parseNumber(json?.rates?.XAU ?? json?.price);

    if (!rate || rate <= 0) {
        throw new Error("metals-api XAU parse failed");
    }

    // metals-api USD base genellikle "1 USD kac XAU" dondurur.
    const onsUsd = rate > 100 ? rate : 1 / rate;
    return { value: onsUsd, source: "metals-api" };
}

async function fetchOnsUsd() {
    try {
        return await fetchGoldPriceOrgOnsUsd();
    } catch (error) {
        console.warn("[altin-fiyat] goldprice.org ons alinamadi:", getErrorMessage(error));
    }

    try {
        return await fetchGoldApiOnsUsd();
    } catch (error) {
        console.warn("[altin-fiyat] gold-api.com ons alinamadi:", getErrorMessage(error));
    }

    const metalsApiPrice = await fetchMetalsApiOnsUsd();
    if (metalsApiPrice) return metalsApiPrice;

    throw new Error("Ons altin fiyati alinamadi");
}

async function fetchCalculatedPrice() {
    const [usdTl, ons] = await Promise.all([
        fetchTcmbUsdSelling(),
        fetchOnsUsd(),
    ]);
    const fiyat = (ons.value / TROY_OUNCE_GRAMS) * usdTl;

    return createPayload({
        fiyat,
        kaynak: `TCMB + ${ons.source}`,
        guncellemeZamani: new Date().toISOString(),
        onsUsd: ons.value,
        usdTl,
    });
}

export async function GET() {
    const errors: string[] = [];

    try {
        const collectApiPayload = await fetchCollectApiPrice();
        if (collectApiPayload) {
            return cachedJson(collectApiPayload);
        }
    } catch (error) {
        errors.push(getErrorMessage(error));
        console.warn("[altin-fiyat] CollectAPI hatasi:", getErrorMessage(error));
    }

    try {
        return cachedJson(await fetchAltinkaynakStoreGoldPrice());
    } catch (error) {
        errors.push(getErrorMessage(error));
        console.warn("[altin-fiyat] Altinkaynak Store_Gold hatasi:", getErrorMessage(error));
    }

    try {
        return cachedJson(await fetchCalculatedPrice());
    } catch (error) {
        errors.push(getErrorMessage(error));
        console.warn("[altin-fiyat] TCMB + ons hatasi:", getErrorMessage(error));
    }

    return NextResponse.json(
        {
            error: "Altin fiyati alinamadi",
            errors,
        },
        { status: 503, headers: { "Cache-Control": "no-store" } }
    );
}
