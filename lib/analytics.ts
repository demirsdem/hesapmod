export type AnalyticsPrimitive = string | number | boolean;
export type AnalyticsPayload = Record<string, AnalyticsPrimitive | null | undefined>;

const CONSENT_KEY = "hesapmod-cookie-consent";

declare global {
    interface Window {
        dataLayer?: Array<Record<string, unknown>>;
        gtag?: (
            command: "event",
            eventName: string,
            params?: Record<string, AnalyticsPrimitive>
        ) => void;
    }
}

function hasAnalyticsConsent() {
    if (typeof window === "undefined") {
        return false;
    }

    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
}

function sanitizePayload(payload: AnalyticsPayload = {}) {
    return Object.entries(payload).reduce<Record<string, AnalyticsPrimitive>>((acc, [key, value]) => {
        if (value === null || value === undefined) {
            return acc;
        }

        if (typeof value === "number" && !Number.isFinite(value)) {
            return acc;
        }

        acc[key] = value;
        return acc;
    }, {});
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
    if (typeof window === "undefined" || !hasAnalyticsConsent()) {
        return;
    }

    const eventPayload = sanitizePayload({
        page_path: window.location.pathname,
        ...payload,
    });

    window.dataLayer = window.dataLayer ?? [];

    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, eventPayload);
        return;
    }

    window.dataLayer.push({
        event: eventName,
        ...eventPayload,
    });
}
