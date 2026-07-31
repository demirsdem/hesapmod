import { NextResponse } from "next/server";
import { claudeMarketProvider } from "@/lib/vehicle-market-providers/claude";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { validateVehicleMarketInputs } from "@/lib/security/vehicle-market-schema";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const GENERIC_ERROR = "Vehicle market estimate is temporarily unavailable.";

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit({
    key: `vehicle-market:claude:${clientIp}`,
    limit: RATE_LIMIT_MAX_REQUESTS,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
        },
      }
    );
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const validation = validateVehicleMarketInputs(body);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await claudeMarketProvider.fetchListings(validation.data);

    if (result.status === "error") {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 503 });
    }

    const status = result.status === "ready" ? 200 : result.status === "disabled" ? 503 : 202;

    return NextResponse.json(result, { status });
  } catch (error) {
    console.warn("[vehicle-market/claude] request failed:", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
