export type LeadSource = {
    sourcePath?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
};

type AliasedValue = { valid: boolean; value?: unknown };

const PATH_PATTERN = /^\/[A-Za-z0-9/_-]*$/;
const UTM_PATTERN = /^[A-Za-z0-9._~-]+$/;

function optionalString(value: unknown, maxLength: number, pattern: RegExp) {
    if (value === undefined || value === null || value === "") return { valid: true, value: undefined };
    if (typeof value !== "string" || value.length > maxLength || value !== value.trim() || !pattern.test(value)) {
        return { valid: false, value: undefined };
    }
    return { valid: true, value };
}

function optionalSourcePath(value: unknown) {
    const normalized = optionalString(value, 300, PATH_PATTERN);
    if (!normalized.valid || !normalized.value) return normalized;

    const segments = normalized.value.split("/");
    if (normalized.value.startsWith("//") || segments.some((segment) => segment === "." || segment === "..")) {
        return { valid: false, value: undefined };
    }
    return normalized;
}

function aliasedValue(payload: Record<string, unknown>, camelKey: string, snakeKey: string): AliasedValue {
    const camelValue = payload[camelKey];
    const snakeValue = payload[snakeKey];
    const hasCamel = camelValue !== undefined && camelValue !== null && camelValue !== "";
    const hasSnake = snakeValue !== undefined && snakeValue !== null && snakeValue !== "";

    if (hasCamel && hasSnake && camelValue !== snakeValue) {
        return { valid: false };
    }
    return { valid: true, value: hasCamel ? camelValue : snakeValue };
}

export function normalizeLeadSource(payload: Record<string, unknown>) {
    const rawSourcePath = aliasedValue(payload, "sourcePath", "source_path");
    const rawUtmSource = aliasedValue(payload, "utmSource", "utm_source");
    const rawUtmMedium = aliasedValue(payload, "utmMedium", "utm_medium");
    const rawUtmCampaign = aliasedValue(payload, "utmCampaign", "utm_campaign");
    const sourcePath = optionalSourcePath(rawSourcePath.value);
    const utmSource = optionalString(rawUtmSource.value, 100, UTM_PATTERN);
    const utmMedium = optionalString(rawUtmMedium.value, 100, UTM_PATTERN);
    const utmCampaign = optionalString(rawUtmCampaign.value, 100, UTM_PATTERN);
    const valid = rawSourcePath.valid && rawUtmSource.valid && rawUtmMedium.valid && rawUtmCampaign.valid
        && sourcePath.valid && utmSource.valid && utmMedium.valid && utmCampaign.valid;
    return {
        valid,
        value: valid ? { sourcePath: sourcePath.value, utmSource: utmSource.value, utmMedium: utmMedium.value, utmCampaign: utmCampaign.value } satisfies LeadSource : {},
    };
}

function escapeHtml(value: string) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function renderLeadSourceHtml(source: LeadSource) {
    const rows = [
        ["Sayfa yolu", source.sourcePath], ["utm_source", source.utmSource],
        ["utm_medium", source.utmMedium], ["utm_campaign", source.utmCampaign],
    ].filter((row): row is [string, string] => Boolean(row[1]));
    if (!rows.length) return "";
    return `<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" /><h3>Talep Kaynağı</h3>${rows.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("")}`;
}
