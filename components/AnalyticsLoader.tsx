"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

type ConsentState = "accepted" | "rejected" | null;

const CONSENT_KEY = "hesapmod-cookie-consent";
const CONSENT_EVENT = "hesapmod-consent-change";

function readConsent(): ConsentState {
    if (typeof window === "undefined") return null;

    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "accepted" || stored === "rejected" ? stored : null;
}

export default function AnalyticsLoader() {
    const [consent, setConsent] = useState<ConsentState>(null);

    useEffect(() => {
        const syncConsent = () => {
            setConsent(readConsent());
        };

        syncConsent();
        window.addEventListener("storage", syncConsent);
        window.addEventListener(CONSENT_EVENT, syncConsent as EventListener);

        return () => {
            window.removeEventListener("storage", syncConsent);
            window.removeEventListener(CONSENT_EVENT, syncConsent as EventListener);
        };
    }, []);

    if (consent !== "accepted") return null;

    return <GoogleAnalytics gaId="G-NWXRPF7PC1" />;
}
