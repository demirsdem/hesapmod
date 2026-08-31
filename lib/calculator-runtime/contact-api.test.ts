import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST } from "../../app/api/contact/route";
import { renderLeadSourceHtml } from "../contact-lead-source";

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

    it("accepts an allowlisted solution value without attempting real delivery", async () => {
        const response = await POST(request({ name: "Test", email: "test@example.com", subject: "Kurumsal yazılım projesi", service: "İş süreci otomasyonu", message: "Proje", consent: true, sourcePath: "/cozumler/is-sureci-otomasyonu", utmSource: "google", utmMedium: "cpc", utmCampaign: "faz_3" }, "audit-solution"));
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: "E-posta servisi yapılandırılmamış." });
    });

    it("rejects URL, XSS, CRLF and oversized lead source values", async () => {
        const base = { name: "Test", email: "test@example.com", subject: "Kurumsal yazılım projesi", message: "Proje", consent: true };
        expect((await POST(request({ ...base, sourcePath: "https://evil.example" }, "source-url"))).status).toBe(400);
        expect((await POST(request({ ...base, sourcePath: "//evil.example/path" }, "source-protocol-relative"))).status).toBe(400);
        expect((await POST(request({ ...base, sourcePath: "/cozumler/../admin" }, "source-traversal"))).status).toBe(400);
        expect((await POST(request({ ...base, sourcePath: "/cozumler/<script>" }, "source-xss"))).status).toBe(400);
        expect((await POST(request({ ...base, utmSource: "google\r\nBcc:test@example.com" }, "source-crlf"))).status).toBe(400);
        expect((await POST(request({ ...base, utmCampaign: "a".repeat(101) }, "source-length"))).status).toBe(400);
    });

    it("HTML-encodes source values when rendering the email section", () => {
        const html = renderLeadSourceHtml({ sourcePath: "/cozumler/&test", utmCampaign: "x<y" });
        expect(html).toContain("/cozumler/&amp;test");
        expect(html).toContain("x&lt;y");
        expect(html).not.toContain("x<y");
    });

    it("normalizes CRLF in legacy mail headers", async () => {
        const response = await POST(request({ name: "Test", email: "test@example.com", subject: "Merhaba\r\nBcc: victim@example.com", message: "Test mesajı" }, "legacy-crlf"));
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: "E-posta servisi yapılandırılmamış." });
    });

    it("rejects malformed and oversized request bodies", async () => {
        expect((await POST(request("{", "audit-json"))).status).toBe(400);
        expect((await POST(request("x".repeat(33 * 1024), "audit-size"))).status).toBe(413);
    });
});
