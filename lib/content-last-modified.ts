// Keep these timestamps explicit. Deployment environments often rewrite file mtimes,
// which makes filesystem-based lastmod signals look fresher than the real content.
const CONTENT_LAST_MODIFIED_AT = {
    calculators: "2026-03-07T14:25:00+03:00",
    categories: "2026-03-07T13:52:15+03:00",
    home: "2026-03-07T13:52:15+03:00",
    allTools: "2026-03-07T13:52:15+03:00",
    about: "2026-03-07T13:52:15+03:00",
    contact: "2026-03-07T13:52:15+03:00",
    faq: "2026-03-01T22:58:46+03:00",
    privacy: "2026-03-07T13:52:15+03:00",
    cookiePolicy: "2026-03-07T13:52:15+03:00",
    kvkk: "2026-03-07T13:52:15+03:00",
    terms: "2026-03-07T13:52:15+03:00",
    guides: "2026-03-07T13:52:15+03:00",
} as const;

const CALCULATOR_LAST_MODIFIED_OVERRIDES = {
    "dgs-puan-hesaplama": "2026-03-07T18:45:00+03:00",
    "lgs-puan-hesaplama": "2026-03-07T18:45:00+03:00",
} as const;

export function getLatestDate(...dates: Date[]) {
    return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export function formatDateLabel(date: Date | string, locale = "tr-TR") {
    return new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Europe/Istanbul",
    });
}

export const CALCULATOR_CONTENT_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.calculators);
export const CATEGORY_CONTENT_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.categories);
export const HOME_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.home);
export const ALL_TOOLS_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.allTools);
export const ABOUT_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.about);
export const CONTACT_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.contact);
export const FAQ_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.faq);
export const PRIVACY_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.privacy);
export const COOKIE_POLICY_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.cookiePolicy);
export const KVKK_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.kvkk);
export const TERMS_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.terms);
export const GUIDES_PAGE_LAST_MODIFIED = new Date(CONTENT_LAST_MODIFIED_AT.guides);

const calculatorLastModifiedBySlug = new Map<string, Date>(
    Object.entries(CALCULATOR_LAST_MODIFIED_OVERRIDES).map(([slug, date]) => [slug, new Date(date)])
);

export function getCalculatorLastModified(slug: string) {
    return calculatorLastModifiedBySlug.get(slug) ?? CALCULATOR_CONTENT_LAST_MODIFIED;
}
