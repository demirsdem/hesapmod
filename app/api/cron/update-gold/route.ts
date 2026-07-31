import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchLiveGoldCache } from "@/lib/gold/goldPriceSource";

const GOLD_PAGE_PATHS = [
    "/finansal-hesaplamalar/altin-hesaplama",
    "/finansal-hesaplamalar/gram-altin-hesaplama",
    "/finansal-hesaplamalar/ceyrek-altin-hesaplama",
    "/finansal-hesaplamalar/22-ayar-bilezik-hesaplama",
    "/finansal-hesaplamalar/altin-bozdurma-hesaplama",
    "/finansal-hesaplamalar/tl-altin-hesaplama",
    "/finansal-hesaplamalar/14-ayar-altin-hesaplama",
    "/finansal-hesaplamalar/18-ayar-altin-hesaplama",
];

function isAuthorized(request: Request) {
    const cronSecret = process.env.CRON_SECRET ?? process.env.REVALIDATE_SECRET;
    if (!cronSecret) return false;

    return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = process.env.GOLD_PRICE_API_URL ?? "https://www.hesapmod.com/api/altin-fiyat";
    const cache = await fetchLiveGoldCache(apiUrl);

    if (!cache) {
        return NextResponse.json(
            { ok: false, error: "Gold price source unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } }
        );
    }

    GOLD_PAGE_PATHS.forEach((path) => revalidatePath(path));

    return NextResponse.json(
        {
            ok: true,
            sourceName: cache.sourceName,
            updatedAt: cache.updatedAt,
            revalidatedPaths: GOLD_PAGE_PATHS,
        },
        { headers: { "Cache-Control": "no-store" } }
    );
}
