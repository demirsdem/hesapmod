type RateLimitOptions = {
    key: string;
    limit: number;
    windowMs: number;
};

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

function cleanup(now: number) {
    Array.from(buckets.entries()).forEach(([key, entry]) => {
        if (entry.resetAt <= now) {
            buckets.delete(key);
        }
    });
}

export function getClientIp(request: Request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() || "unknown";
    }

    return request.headers.get("x-real-ip") ?? "unknown";
}

// TODO(security): Replace this server-local fallback with Upstash/Vercel KV for
// durable rate limiting across Vercel instances and deploys.
export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
    const now = Date.now();
    cleanup(now);

    const existing = buckets.get(key);
    const entry = existing && existing.resetAt > now
        ? existing
        : { count: 0, resetAt: now + windowMs };

    entry.count += 1;
    buckets.set(key, entry);

    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    return {
        allowed: entry.count <= limit,
        remaining: Math.max(0, limit - entry.count),
        retryAfter,
    };
}
