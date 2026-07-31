import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { FX_LONG_TAIL_SLUGS } from "@/lib/fx/fxLongTailPages";
import { fetchLiveFxCache } from "@/lib/fx/fxPriceSource";

const FX_PAGE_PATHS = [
    "/finansal-hesaplamalar/doviz-hesaplama",
    ...FX_LONG_TAIL_SLUGS.map((slug) => `/finansal-hesaplamalar/${slug}`),
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

    const cache = await fetchLiveFxCache();

    if (!cache) {
        return NextResponse.json(
            { ok: false, error: "FX price source unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } }
        );
    }

    FX_PAGE_PATHS.forEach((path) => revalidatePath(path));

    return NextResponse.json(
        {
            ok: true,
            sourceName: cache.sourceName,
            updatedAt: cache.updatedAt,
            revalidatedPaths: FX_PAGE_PATHS,
        },
        { headers: { "Cache-Control": "no-store" } }
    );
}
