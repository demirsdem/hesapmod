import { trackEvent } from "@/lib/analytics";

export type ProjectEstimatorEvent = "project_estimator_start" | "project_estimator_complete" | "project_estimator_cta_click";
export type ProjectEstimatorAnalyticsParams = Partial<Record<"project_type" | "platform_group" | "scope_level" | "integration_level", string>>;
const allowed = new Set<keyof ProjectEstimatorAnalyticsParams>(["project_type", "platform_group", "scope_level", "integration_level"]);
const sent = new Set<string>();

export function sanitizeProjectEstimatorParams(params: Record<string, unknown>) {
    const safe: ProjectEstimatorAnalyticsParams = {};
    for (const [key, value] of Object.entries(params)) {
        if (!allowed.has(key as keyof ProjectEstimatorAnalyticsParams) || typeof value !== "string") continue;
        const normalized = value.trim().slice(0, 80);
        if (normalized) safe[key as keyof ProjectEstimatorAnalyticsParams] = normalized;
    }
    return safe;
}

export function trackProjectEstimatorEvent(event: ProjectEstimatorEvent, params: Record<string, unknown>, instanceKey = "default") {
    const key = `${instanceKey}:${event}`;
    if (sent.has(key)) return false;
    const didSend = trackEvent(event, sanitizeProjectEstimatorParams(params), { includePagePath: false });
    if (didSend) sent.add(key);
    return didSend;
}

export function resetProjectEstimatorEventsForTests() { sent.clear(); }
