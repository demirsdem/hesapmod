import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";
import { FX_LONG_TAIL_SLUGS } from "@/lib/fx/fxLongTailPages";
import { GOLD_LONG_TAIL_SLUGS } from "@/lib/gold/goldLongTailPages";

const ALLOWED_REVALIDATE_PATHS = new Set([
    "/finansal-hesaplamalar/altin-hesaplama",
    "/finansal-hesaplamalar/doviz-hesaplama",
    ...GOLD_LONG_TAIL_SLUGS.map((slug) => `/finansal-hesaplamalar/${slug}`),
    ...FX_LONG_TAIL_SLUGS.map((slug) => `/finansal-hesaplamalar/${slug}`),
]);

function safeTokenEquals(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isAuthorized(request: Request) {
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret) return false;

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";

    return Boolean(token) && safeTokenEquals(token, secret);
}

function isAllowedPath(path: string) {
    return ALLOWED_REVALIDATE_PATHS.has(path);
}

export async function GET() {
    return NextResponse.json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
}

export async function POST(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    const path = typeof body === "object" && body !== null && "path" in body
        ? (body as { path?: unknown }).path
        : undefined;

    if (typeof path !== "string" || !isAllowedPath(path)) {
        return NextResponse.json({ ok: false, error: "Invalid path" }, { status: 400 });
    }

    revalidatePath(path);

    return NextResponse.json({
        ok: true,
        revalidated: path,
        revalidatedAt: new Date().toISOString(),
    });
}
