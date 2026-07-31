export function toFiniteNumber(value: unknown, fallback = 0) {
    const parsed = typeof value === "number"
        ? value
        : Number.parseFloat(String(value ?? ""));

    return Number.isFinite(parsed) ? parsed : fallback;
}

export function clampFiniteNumber(value: unknown, min: number, max: number, fallback = min) {
    const parsed = toFiniteNumber(value, fallback);
    return Math.min(max, Math.max(min, parsed));
}

export function safeDisplayNumber(value: unknown) {
    return toFiniteNumber(value, 0);
}

export function sanitizeFiniteValue(value: unknown): unknown {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeFiniteValue);
    }

    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([key, entryValue]) => [key, sanitizeFiniteValue(entryValue)])
        );
    }

    return value;
}
