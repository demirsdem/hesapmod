import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import { deriveGoldPricesFromHasAltin } from "@/lib/gold/goldCalculations";

type LegacyGoldApiPayload = {
    fiyat?: number;
    kaynak?: string;
    guncellemeZamani?: string;
    gramPrice24k?: number;
    hasAltinAlis?: number | null;
    hasAltinSatis?: number | null;
    ons?: number | null;
    onsUsd?: number | null;
    usdTl?: number | null;
    tryPerOz?: number | null;
    updatedAt?: string;
    source?: string;
};

function positiveNumber(value: unknown) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

export function goldApiPayloadToCache(payload: LegacyGoldApiPayload): GoldPriceCache | null {
    const baseBuy = positiveNumber(payload.hasAltinAlis)
        ?? positiveNumber(payload.gramPrice24k)
        ?? positiveNumber(payload.fiyat);
    const baseSell = positiveNumber(payload.hasAltinSatis)
        ?? positiveNumber(payload.gramPrice24k)
        ?? positiveNumber(payload.fiyat);

    if (!baseBuy || !baseSell) return null;

    const tryPerOz = positiveNumber(payload.tryPerOz);
    const onsTry = tryPerOz
        ? {
            buy: tryPerOz,
            sell: Math.round(tryPerOz * (baseSell / baseBuy) * 100) / 100,
        }
        : undefined;

    return {
        prices: deriveGoldPricesFromHasAltin({ buy: baseBuy, sell: baseSell }, 3.5, onsTry),
        updatedAt: payload.guncellemeZamani ?? payload.updatedAt ?? new Date().toISOString(),
        sourceName: payload.kaynak ?? payload.source ?? "altin-fiyat API",
        sourceStatus: "live",
        stale: false,
    };
}

export async function fetchLiveGoldCache(apiUrl: string): Promise<GoldPriceCache | null> {
    try {
        const response = await fetch(apiUrl, {
            cache: "no-store",
            headers: { Accept: "application/json" },
        });

        if (!response.ok) return null;

        const payload = await response.json() as LegacyGoldApiPayload;
        return goldApiPayloadToCache(payload);
    } catch {
        return null;
    }
}
