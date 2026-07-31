import "server-only";

import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import { fetchLiveGoldCache } from "@/lib/gold/goldPriceSource";

const DEFAULT_GOLD_API_URL = "https://www.hesapmod.com/api/altin-fiyat";

async function getStaticGoldCache(): Promise<GoldPriceCache | null> {
    try {
        const data = await import("@/public/data/gold.json");
        return data.default as GoldPriceCache;
    } catch {
        return null;
    }
}

export async function getGoldCache(): Promise<GoldPriceCache | null> {
    const liveApiUrl = process.env.GOLD_PRICE_API_URL ?? DEFAULT_GOLD_API_URL;
    const liveCache = await fetchLiveGoldCache(liveApiUrl);
    if (liveCache) {
        return liveCache;
    }

    return getStaticGoldCache();
}

export async function getGoldStaticCache(): Promise<GoldPriceCache | null> {
    try {
        const data = await import("@/public/data/gold.json");
        return data.default as GoldPriceCache;
    } catch {
        return null;
    }
}
