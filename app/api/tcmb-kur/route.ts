import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TCMB_TODAY_XML_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";

function parseForexBuying(xml: string, code: "USD" | "EUR") {
    const currencyMatch = xml.match(new RegExp(`<Currency[^>]*(?:Kod|CurrencyCode)="${code}"[^>]*>([\\s\\S]*?)</Currency>`, "i"));
    const body = currencyMatch?.[1];
    const value = body?.match(/<ForexBuying>(.*?)<\/ForexBuying>/i)?.[1]?.trim();
    const parsed = Number.parseFloat((value ?? "").replace(",", "."));

    return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch(TCMB_TODAY_XML_URL, {
            cache: "no-store",
            headers: { Accept: "application/xml,text/xml,*/*" },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`TCMB response ${response.status}`);
        }

        const xml = await response.text();
        const usdTry = parseForexBuying(xml, "USD");
        const eurTry = parseForexBuying(xml, "EUR");

        if (!usdTry || !eurTry) {
            throw new Error("TCMB XML parse failed");
        }

        return NextResponse.json(
            { usdTry, eurTry, source: "tcmb", date: new Date().toISOString() },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("[tcmb-kur]", error);
        return NextResponse.json(
            { error: "Kur alınamadı, manuel girin" },
            { status: 503, headers: { "Cache-Control": "no-store" } }
        );
    } finally {
        clearTimeout(timeout);
    }
}
