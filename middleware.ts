import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIMARY_HOST = "www.hesapmod.com";
const BARE_HOST = "hesapmod.com";

export function middleware(request: NextRequest) {
    const host = request.headers.get("host");

    if (!host) {
        return NextResponse.next();
    }

    if (host === BARE_HOST) {
        const redirectUrl = new URL(request.url);
        redirectUrl.protocol = "https:";
        redirectUrl.host = PRIMARY_HOST;
        return NextResponse.redirect(redirectUrl, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};