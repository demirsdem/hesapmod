import { trackEvent } from "@/lib/analytics";

export type CorporateEventName = "corporate_cta_click" | "corporate_form_start" | "generate_lead" | "corporate_form_error";
export type CorporateEventParams = Partial<Record<
    "form_type" | "service" | "solution_slug" | "source_path" | "cta_location",
    string
>>;

const ALLOWED_PARAMS = new Set<keyof CorporateEventParams>([
    "form_type", "service", "solution_slug", "source_path", "cta_location",
]);
const sentOnce = new Set<string>();

export function sanitizeCorporateEventParams(params: Record<string, unknown>): CorporateEventParams {
    const safe: CorporateEventParams = {};
    for (const [key, value] of Object.entries(params)) {
        if (!ALLOWED_PARAMS.has(key as keyof CorporateEventParams) || typeof value !== "string") continue;
        const normalized = value.trim().slice(0, 160);
        if (normalized) safe[key as keyof CorporateEventParams] = normalized;
    }
    return safe;
}

export function trackCorporateEvent(eventName: CorporateEventName, params: Record<string, unknown>, onceKey?: string) {
    if (onceKey && sentOnce.has(onceKey)) return false;
    const sent = trackEvent(eventName, sanitizeCorporateEventParams(params), { includePagePath: false });
    if (sent && onceKey) sentOnce.add(onceKey);
    return sent;
}

export function resetCorporateEventDeduplicationForTests() {
    sentOnce.clear();
}
