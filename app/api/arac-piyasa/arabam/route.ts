import { NextResponse } from "next/server";
import { arabamProvider } from "@/lib/vehicle-market-providers";
import type { AracDegerInputs } from "@/lib/arac-hesaplama";

export async function POST(request: Request) {
  const inputs = await request.json() as AracDegerInputs;
  const result = await arabamProvider.fetchListings(inputs);

  return NextResponse.json(result, {
    status: result.status === "ready" ? 200 : 202,
  });
}
