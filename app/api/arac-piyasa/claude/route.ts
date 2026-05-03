import { NextResponse } from "next/server";
import { claudeMarketProvider } from "@/lib/vehicle-market-providers/claude";
import type { AracDegerInputs } from "@/lib/arac-hesaplama";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const inputs = await request.json() as AracDegerInputs;
    const result = await claudeMarketProvider.fetchListings(inputs);
    const status = result.status === "ready" ? 200 : result.status === "disabled" ? 503 : 202;

    return NextResponse.json(result, { status });
  } catch (error) {
    return NextResponse.json({
      provider: "Claude Web Search",
      status: "error",
      searchUrl: "",
      listings: [],
      message: error instanceof Error ? error.message : "Canlı emsal alınırken sunucu hatası oluştu.",
    }, { status: 500 });
  }
}
