import { promises as fs } from "node:fs";
import path from "node:path";
import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import { fetchLiveGoldCache } from "@/lib/gold/goldPriceSource";

const DEFAULT_GOLD_API_URL = "https://www.hesapmod.com/api/altin-fiyat";
const GOLD_CACHE_PATH = path.join(process.cwd(), "public", "data", "gold.json");

export async function updateGoldCache(apiUrl = process.env.GOLD_PRICE_API_URL ?? DEFAULT_GOLD_API_URL): Promise<GoldPriceCache> {
    const liveCache = await fetchLiveGoldCache(apiUrl);

    if (!liveCache) {
        throw new Error("Live gold cache could not be fetched");
    }

    await fs.mkdir(path.dirname(GOLD_CACHE_PATH), { recursive: true });
    await fs.writeFile(GOLD_CACHE_PATH, `${JSON.stringify(liveCache, null, 2)}\n`, "utf8");

    return liveCache;
}
