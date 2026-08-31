import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetCorporateEventDeduplicationForTests, sanitizeCorporateEventParams, trackCorporateEvent } from "../corporate-analytics";

describe("corporate analytics", () => {
    beforeEach(() => {
        resetCorporateEventDeduplicationForTests();
        vi.stubGlobal("window", { location: { pathname: "/iletisim" }, dataLayer: [] });
        vi.stubGlobal("document", { cookie: "hesapmod-cookie-consent=accepted" });
    });
    afterEach(() => vi.unstubAllGlobals());

    it("keeps only allowlisted non-personal parameters", () => {
        expect(sanitizeCorporateEventParams({
            form_type: "corporate", service: "Otomasyon", solution_slug: "is-sureci-otomasyonu",
            source_path: "/cozumler/is-sureci-otomasyonu", cta_location: "hero",
            name: "Kişi", email: "secret@example.com", phone: "555", company: "Firma", message: "Özel metin", ip: "127.0.0.1",
        })).toEqual({ form_type: "corporate", service: "Otomasyon", solution_slug: "is-sureci-otomasyonu", source_path: "/cozumler/is-sureci-otomasyonu", cta_location: "hero" });
    });

    it("sends a successful lead only once", () => {
        expect(trackCorporateEvent("generate_lead", { form_type: "corporate", source_path: "/iletisim" }, "lead-1")).toBe(true);
        expect(trackCorporateEvent("generate_lead", { form_type: "corporate", source_path: "/iletisim" }, "lead-1")).toBe(false);
        expect((window.dataLayer ?? []).filter(item => item.event === "generate_lead")).toHaveLength(1);
    });

    it("does not send without analytics consent", () => {
        vi.stubGlobal("document", { cookie: "hesapmod-cookie-consent=rejected" });
        trackCorporateEvent("corporate_cta_click", { source_path: "/cozumler" });
        expect(window.dataLayer).toHaveLength(0);
    });

    it("uses the existing gtag path without also pushing a dataLayer event", () => {
        const gtag = vi.fn();
        vi.stubGlobal("window", { location: { pathname: "/cozumler" }, dataLayer: [], gtag });
        expect(trackCorporateEvent("corporate_cta_click", { form_type: "corporate", source_path: "/cozumler" })).toBe(true);
        expect(gtag).toHaveBeenCalledOnce();
        expect(window.dataLayer).toHaveLength(0);
    });
});
