import "server-only";

import type { FxRateCache } from "@/lib/fx/fxPriceTypes";
import { fetchLiveFxCache } from "@/lib/fx/fxPriceSource";

export async function getFxStaticCache(): Promise<FxRateCache | null> {
    try {
        const data = await import("@/public/data/fx.json");
        return data.default as FxRateCache;
    } catch {
        return null;
    }
}

export async function getFxCache(): Promise<FxRateCache | null> {
    const live = await fetchLiveFxCache();
    if (live) return live;

    return getFxStaticCache();
}
