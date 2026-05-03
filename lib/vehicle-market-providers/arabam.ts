import type { AracDegerInputs } from "@/lib/arac-hesaplama";
import type { MarketProviderResult, MarketSearchLink, VehicleMarketProvider } from "./types";

function toArabamSlug(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toArabamFuelSlug(yakitTipi: AracDegerInputs["yakitTipi"]) {
  const map: Record<AracDegerInputs["yakitTipi"], string> = {
    Benzin: "benzinli",
    Dizel: "dizel",
    LPG: "lpg",
    Elektrik: "elektrikli",
    Hybrid: "hibrit",
  };

  return map[yakitTipi];
}

function toArabamTransmissionSlug(vites: AracDegerInputs["vites"]) {
  return vites === "Manuel" ? "duz" : "otomatik";
}

export function buildArabamSearchUrl(inputs: AracDegerInputs) {
  const markaSlug = toArabamSlug(inputs.marka);
  const modelSlug = toArabamSlug(inputs.model);
  const yakitSlug = toArabamFuelSlug(inputs.yakitTipi);
  const vitesSlug = toArabamTransmissionSlug(inputs.vites);

  return `https://www.arabam.com/ikinci-el/otomobil/${markaSlug}-${modelSlug}-${yakitSlug}-${vitesSlug}`;
}

export function buildArabamSearchLink(inputs: AracDegerInputs): MarketSearchLink {
  return {
    provider: "arabam",
    label: "arabam.com'da güncel ilanları aç",
    href: buildArabamSearchUrl(inputs),
  };
}

export const arabamProvider: VehicleMarketProvider = {
  id: "arabam",
  name: "arabam.com",
  buildSearchUrl: buildArabamSearchUrl,
  async fetchListings(inputs): Promise<MarketProviderResult> {
    return {
      provider: "arabam.com",
      status: "needs_api_access",
      searchUrl: buildArabamSearchUrl(inputs),
      listings: [],
      message: "arabam.com ilan/değerleme verisini otomatik almak için resmi API veya veri paylaşım izni gerekir.",
    };
  },
};
