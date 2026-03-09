import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIMARY_HOST = "www.hesapmod.com";
const BARE_HOST = "hesapmod.com";
const PATH_REDIRECTS: Record<string, string> = {
    "/gunluk/yakit-tuketim-maliyet": "/tasit-ve-vergi/yakit-tuketim-maliyet",
    "/sinav-hesaplamalari/takdir-tessekur-hesaplama": "/sinav-hesaplamalari/takdir-tesekkur-hesaplama",
};

export function middleware(request: NextRequest) {
    const hostname = request.nextUrl.hostname;

    // Localhost veya Vercel preview ortamlarında yönlendirmeyi atlamak için
    if (hostname.includes("localhost") || hostname.includes("vercel.app")) {
        return NextResponse.next();
    }

    const redirectUrl = request.nextUrl.clone();
    let shouldRedirect = false;

    // BARE_HOST kontrolü (www yoksa)
    if (hostname === BARE_HOST) {
        redirectUrl.protocol = "https:";
        redirectUrl.hostname = PRIMARY_HOST;
        shouldRedirect = true;
    }

    // Path yönlendirmeleri
    const redirectedPath = PATH_REDIRECTS[redirectUrl.pathname];
    if (redirectedPath) {
        redirectUrl.pathname = redirectedPath;
        shouldRedirect = true;
    }

    if (shouldRedirect) {
        return NextResponse.redirect(redirectUrl, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};