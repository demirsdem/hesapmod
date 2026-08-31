export const PROJECT_ESTIMATE_SESSION_KEY = "hesapmod-project-estimate-v1";
export const PROJECT_ESTIMATE_MAX_BYTES = 6 * 1024;
const SUMMARY_MAX_LENGTH = 4000;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type StoredProjectEstimate = { version: 1; summary: string };

function isSafeSummary(value: unknown): value is string {
    return typeof value === "string" && value.length > 0 && value.length <= SUMMARY_MAX_LENGTH
        && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value);
}

export function saveProjectEstimate(storage: StorageLike, summary: string) {
    if (!isSafeSummary(summary)) return false;
    const serialized = JSON.stringify({ version: 1, summary } satisfies StoredProjectEstimate);
    if (new TextEncoder().encode(serialized).byteLength > PROJECT_ESTIMATE_MAX_BYTES) return false;
    storage.setItem(PROJECT_ESTIMATE_SESSION_KEY, serialized);
    return true;
}

export function readProjectEstimate(storage: StorageLike) {
    const raw = storage.getItem(PROJECT_ESTIMATE_SESSION_KEY);
    if (!raw || new TextEncoder().encode(raw).byteLength > PROJECT_ESTIMATE_MAX_BYTES) return null;
    try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (parsed.version !== 1 || !isSafeSummary(parsed.summary) || Object.keys(parsed).some((key) => !["version", "summary"].includes(key))) return null;
        return parsed.summary;
    } catch {
        return null;
    }
}

export function prefillProjectSummary(currentMessage: string, storage: StorageLike) {
    if (currentMessage.trim()) return { message: currentMessage, applied: false };
    const summary = readProjectEstimate(storage);
    storage.removeItem(PROJECT_ESTIMATE_SESSION_KEY);
    return summary ? { message: summary, applied: true } : { message: currentMessage, applied: false };
}
