import type { AracDegerInputs, AracPiyasaEmsali } from "@/lib/arac-hesaplama";

export type MarketProviderStatus = "ready" | "needs_api_access" | "disabled" | "error";

export type MarketSearchLink = {
  provider: string;
  label: string;
  href: string;
};

export type MarketProviderResult = {
  provider: string;
  status: MarketProviderStatus;
  searchUrl: string;
  listings: AracPiyasaEmsali[];
  message: string;
  sourceUrls?: string[];
};

export type VehicleMarketProvider = {
  id: string;
  name: string;
  buildSearchUrl: (inputs: AracDegerInputs) => string;
  fetchListings: (inputs: AracDegerInputs) => Promise<MarketProviderResult>;
};
