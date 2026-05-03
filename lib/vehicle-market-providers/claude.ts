import "server-only";

import type { AracDegerInputs, AracPiyasaEmsali } from "@/lib/arac-hesaplama";
import type { MarketProviderResult, VehicleMarketProvider } from "./types";

const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_CLAUDE_MODEL = "claude-sonnet-4-5-20250929";
const PROVIDER_NAME = "Claude Web Search";

type ClaudeTextBlock = {
  type: "text";
  text: string;
};

type ClaudeMessageResponse = {
  content?: Array<ClaudeTextBlock | { type: string; [key: string]: unknown }>;
};

type RawListing = {
  kaynak?: unknown;
  fiyat?: unknown;
  kilometre?: unknown;
  baslik?: unknown;
  url?: unknown;
  il?: unknown;
  donanimPaketi?: unknown;
  fiyatTarihi?: unknown;
};

type ParsedMarketResponse = {
  listings?: RawListing[];
  sourceUrls?: unknown;
  summary?: unknown;
};

function buildSearchQuery(inputs: AracDegerInputs) {
  return [
    inputs.marka,
    inputs.model,
    inputs.yil,
    inputs.donanimPaketi,
    inputs.yakitTipi,
    inputs.vites,
    inputs.il,
    inputs.ilce,
    "ikinci el fiyat",
  ].filter(Boolean).join(" ");
}

function buildClaudeSearchUrl(inputs: AracDegerInputs) {
  return `https://www.google.com/search?q=${encodeURIComponent(buildSearchQuery(inputs))}`;
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;

  const cleaned = value
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeKaynak(value: unknown, url: string): AracPiyasaEmsali["kaynak"] {
  const source = `${typeof value === "string" ? value : ""} ${url}`.toLocaleLowerCase("tr-TR");
  if (source.includes("sahibinden")) return "Sahibinden";
  if (source.includes("arabam")) return "arabam.com";
  if (source.includes("tramer") || source.includes("sigorta")) return "TRAMER/Değerleme";
  return "Web";
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function extractJson(text: string): ParsedMarketResponse | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  if (!candidate || !candidate.trim().startsWith("{")) return null;

  try {
    return JSON.parse(candidate) as ParsedMarketResponse;
  } catch {
    return null;
  }
}

function normalizeListings(parsed: ParsedMarketResponse | null, inputs: AracDegerInputs): AracPiyasaEmsali[] {
  return (parsed?.listings ?? [])
    .map((listing) => {
      const url = normalizeText(listing.url, 500) ?? "";
      const fiyat = Math.round(normalizeNumber(listing.fiyat));
      const kilometre = Math.round(normalizeNumber(listing.kilometre));

      return {
        kaynak: normalizeKaynak(listing.kaynak, url),
        fiyat,
        kilometre: kilometre > 0 ? kilometre : undefined,
        baslik: normalizeText(listing.baslik, 140),
        url: url || undefined,
        il: normalizeText(listing.il, 80) ?? inputs.il,
        donanimPaketi: normalizeText(listing.donanimPaketi, 80) ?? inputs.donanimPaketi,
        fiyatTarihi: normalizeText(listing.fiyatTarihi, 40),
      } satisfies AracPiyasaEmsali;
    })
    .filter((listing) => listing.fiyat >= 100000 && listing.fiyat <= 50000000)
    .slice(0, 8);
}

function extractText(response: ClaudeMessageResponse) {
  return (response.content ?? [])
    .filter((block): block is ClaudeTextBlock => block.type === "text" && typeof (block as ClaudeTextBlock).text === "string")
    .map((block) => block.text)
    .join("\n");
}

function getSourceUrls(parsed: ParsedMarketResponse | null, listings: AracPiyasaEmsali[]) {
  const explicit = Array.isArray(parsed?.sourceUrls)
    ? parsed.sourceUrls.filter((url): url is string => typeof url === "string" && url.startsWith("http"))
    : [];

  const listingUrls = listings
    .map((listing) => listing.url)
    .filter((url): url is string => Boolean(url));

  return Array.from(new Set([...explicit, ...listingUrls])).slice(0, 8);
}

export const claudeMarketProvider: VehicleMarketProvider = {
  id: "claude-web-search",
  name: PROVIDER_NAME,
  buildSearchUrl: buildClaudeSearchUrl,
  async fetchListings(inputs): Promise<MarketProviderResult> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        provider: PROVIDER_NAME,
        status: "disabled",
        searchUrl: buildClaudeSearchUrl(inputs),
        listings: [],
        message: "Canlı emsal servisi için ANTHROPIC_API_KEY tanımlı değil.",
      };
    }

    const prompt = `Türkiye ikinci el otomobil piyasasında güncel emsal fiyat araştırması yap.

Araç:
- Marka/model: ${inputs.marka} ${inputs.model}
- Yıl: ${inputs.yil}
- Donanım: ${inputs.donanimPaketi}
- Yakıt/vites: ${inputs.yakitTipi} / ${inputs.vites}
- Kilometre hedefi: ${inputs.kilometre} km
- Bölge: ${inputs.il}${inputs.ilce ? ` / ${inputs.ilce}` : ""}
- Hasar: ${inputs.hasarKaydi}, boya/değişen: ${inputs.boyaDegisenParca} parça

Sahibinden, arabam.com, kurumsal ikinci el siteleri ve kamuya açık web sonuçlarında yakın yıl, yakın donanım ve yakın kilometrede 3-8 emsal bul. Fiyatları TL sayı olarak ver. Sadece doğrulanabilir ilan/değerleme sonuçlarını kullan; emin olmadığın fiyatları ekleme.

Yalnızca şu JSON şemasını döndür, açıklama veya markdown ekleme:
{
  "listings": [
    {
      "kaynak": "Sahibinden | arabam.com | OtoPlus | Web",
      "fiyat": 1250000,
      "kilometre": 85000,
      "baslik": "ilan başlığı",
      "url": "https://...",
      "il": "İstanbul",
      "donanimPaketi": "Comfort",
      "fiyatTarihi": "2026-04"
    }
  ],
  "sourceUrls": ["https://..."],
  "summary": "kısa özet"
}`;

    try {
      const response = await fetch(ANTHROPIC_MESSAGES_URL, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || DEFAULT_CLAUDE_MODEL,
          max_tokens: 2500,
          temperature: 0,
          messages: [{ role: "user", content: prompt }],
          tools: [{
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 5,
          }],
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        return {
          provider: PROVIDER_NAME,
          status: response.status === 401 || response.status === 403 ? "needs_api_access" : "error",
          searchUrl: buildClaudeSearchUrl(inputs),
          listings: [],
          message: `Claude web search yanıtı alınamadı (${response.status}). ${body.slice(0, 160)}`,
        };
      }

      const data = await response.json() as ClaudeMessageResponse;
      const parsed = extractJson(extractText(data));
      const listings = normalizeListings(parsed, inputs);

      return {
        provider: PROVIDER_NAME,
        status: listings.length >= 2 ? "ready" : "error",
        searchUrl: buildClaudeSearchUrl(inputs),
        listings,
        sourceUrls: getSourceUrls(parsed, listings),
        message: listings.length >= 2
          ? `${listings.length} güncel emsal bulundu.`
          : "Claude web search yeterli sayıda emsal döndürmedi; manuel emsal ekleyerek devam edebilirsiniz.",
      };
    } catch (error) {
      return {
        provider: PROVIDER_NAME,
        status: "error",
        searchUrl: buildClaudeSearchUrl(inputs),
        listings: [],
        message: error instanceof Error ? error.message : "Canlı emsal alınırken bilinmeyen hata oluştu.",
      };
    }
  },
};
