import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST } from "../../app/api/contact/route";

const originalApiKey = process.env.RESEND_API_KEY;

function request(body: unknown, ip: string) {
    return new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": ip },
        body: typeof body === "string" ? body : JSON.stringify(body),
    });
}

describe("contact API validation", () => {
    beforeEach(() => { delete process.env.RESEND_API_KEY; });
    afterEach(() => {
        if (originalApiKey === undefined) delete process.env.RESEND_API_KEY;
        else process.env.RESEND_API_KEY = originalApiKey;
    });

    it("keeps a legacy payload compatible without attempting real delivery", async () => {
        const response = await POST(request({ name: "Test", email: "test@example.com", subject: "Geri bildirim", message: "Test mesajı" }, "audit-legacy"));
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: "E-posta servisi yapılandırılmamış." });
    });

    it("requires explicit true consent for corporate submissions", async () => {
        const response = await POST(request({ name: "Test", email: "test@example.com", subject: "Kurumsal yazılım projesi", message: "Proje", consent: false }, "audit-consent"));
        expect(response.status).toBe(400);
    });

    it("rejects services outside the allowlist", async () => {
        const response = await POST(request({ name: "Test", email: "test@example.com", subject: "Kurumsal yazılım projesi", service: "<script>alert(1)</script>", message: "Proje", consent: true }, "audit-service"));
        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "Geçersiz form seçimi." });
    });

    it("rejects malformed and oversized request bodies", async () => {
        expect((await POST(request("{", "audit-json"))).status).toBe(400);
        expect((await POST(request("x".repeat(33 * 1024), "audit-size"))).status).toBe(413);
    });
});
