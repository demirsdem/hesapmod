export const SUPPORTED_LOCALES = ["tr", "en"] as const;

export type SiteLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SiteLocale = "tr";
export const LOCALE_HEADER = "x-hesapmod-locale";

export function normalizeLocale(locale?: string | null): SiteLocale {
    return locale === "en" ? "en" : DEFAULT_LOCALE;
}

export function isEnglishPathname(pathname: string) {
    return pathname === "/en" || pathname.startsWith("/en/");
}

export function getLocaleFromPathname(pathname: string): SiteLocale {
    return isEnglishPathname(pathname) ? "en" : DEFAULT_LOCALE;
}
