export type LeadSource = {
    sourcePath?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
};

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

export function normalizeLeadSource(payload: Record<string, unknown>) {
    const sourcePath = optionalSourcePath(payload.sourcePath);
    const utmSource = optionalString(payload.utmSource, 100, UTM_PATTERN);
    const utmMedium = optionalString(payload.utmMedium, 100, UTM_PATTERN);
    const utmCampaign = optionalString(payload.utmCampaign, 100, UTM_PATTERN);
    const valid = sourcePath.valid && utmSource.valid && utmMedium.valid && utmCampaign.valid;
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
