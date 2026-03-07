import { NextResponse } from "next/server";

const disabledMessage = "Google Indexing API bu sitedeki genel hesaplayıcı ve rehber URL'leri için kullanılmıyor. Sitemap'i Search Console'da gönderin ve acil tarama talepleri için URL Inspection kullanın.";

export async function POST(request: Request) {
    void request;

    return NextResponse.json({
        success: false,
        error: "Indexing API disabled for unsupported site content",
        details: disabledMessage,
    }, { status: 410 });
}

export async function GET() {
    return NextResponse.json({
        success: false,
        error: "Method Not Allowed",
        details: disabledMessage,
    }, { status: 405 });
}
