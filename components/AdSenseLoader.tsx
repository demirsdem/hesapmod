"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type ConsentState = "accepted" | "rejected" | null;

const CONSENT_KEY = "hesapmod-cookie-consent";
const CONSENT_EVENT = "hesapmod-consent-change";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-XXXXXXXXX";

function readConsent(): ConsentState {
    if (typeof window === "undefined") {
        return null;
    }

    const stored = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${CONSENT_KEY}=`))
        ?.split("=")[1];
    return stored === "accepted" || stored === "rejected" ? stored : null;
}

export default function AdSenseLoader() {
    const [consent, setConsent] = useState<ConsentState>(null);

    useEffect(() => {
        const syncConsent = () => setConsent(readConsent());

        syncConsent();
        window.addEventListener("focus", syncConsent);
        window.addEventListener(CONSENT_EVENT, syncConsent as EventListener);

        return () => {
            window.removeEventListener("focus", syncConsent);
            window.removeEventListener(CONSENT_EVENT, syncConsent as EventListener);
        };
    }, []);

    if (consent !== "accepted") {
        return null;
    }

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
