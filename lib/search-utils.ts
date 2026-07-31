import type { CalculatorSearchEntry, LanguageCode } from "@/lib/calculator-types";

const TURKISH_CHAR_MAP: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    i: "i",
    İ: "i",
    ö: "o",
    ş: "s",
    ü: "u",
};

function safeString(value: unknown) {
    return typeof value === "string" ? value : "";
}

function safeLocalizedText(
    value: CalculatorSearchEntry["name"] | CalculatorSearchEntry["shortDescription"] | CalculatorSearchEntry["searchText"] | undefined,
    lang: LanguageCode
) {
    return safeString(value?.[lang] ?? value?.tr ?? value?.en);
}

export function normalizeSearchText(value: unknown) {
    return safeString(value)
        .replace(/[çğıİöşü]/g, (char) => TURKISH_CHAR_MAP[char] ?? char)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function getSearchHaystacks(entry: CalculatorSearchEntry, lang: LanguageCode) {
    return {
        name: normalizeSearchText(safeLocalizedText(entry.name, lang)),
        slug: normalizeSearchText(safeString(entry.slug).replace(/-/g, " ")),
        category: normalizeSearchText(safeString(entry.category).replace(/-/g, " ")),
        description: normalizeSearchText(safeLocalizedText(entry.shortDescription, lang)),
        extra: normalizeSearchText(safeLocalizedText(entry.searchText, lang)),
    };
}

export function getCalculatorSearchScore(
    entry: CalculatorSearchEntry,
    rawQuery: string,
    lang: LanguageCode
) {
    const query = normalizeSearchText(rawQuery);
    if (query.length < 2) {
        return 0;
    }

    const haystacks = getSearchHaystacks(entry, lang);
    const combined = Object.values(haystacks).join(" ");
    const tokens = Array.from(new Set(query.split(" ").filter(Boolean)));
    const allTokensMatch = tokens.length > 0 && tokens.every((token) => combined.includes(token));

    let score = 0;
    if (haystacks.name === query) score += 1000;
    if (haystacks.name.startsWith(query)) score += 800;
    if (haystacks.name.includes(query)) score += 650;
    if (haystacks.slug.includes(query)) score += 500;
    if (haystacks.description.includes(query)) score += 320;
    if (haystacks.extra.includes(query)) score += 260;
    if (haystacks.category.includes(query)) score += 120;
    if (allTokensMatch) score += 180 + tokens.length * 20;

    return score;
}

export function filterCalculatorSearchEntries(
    entries: CalculatorSearchEntry[],
    query: string,
    lang: LanguageCode,
    limit?: number
) {
    const safeEntries = Array.isArray(entries)
        ? entries.filter((entry): entry is CalculatorSearchEntry => Boolean(entry))
        : [];

    const ranked = safeEntries
        .map((entry, index) => ({
            entry,
            index,
            score: getCalculatorSearchScore(entry, query, lang),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .map((item) => item.entry);

    return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

export function getCalculatorSearchHref(entry: CalculatorSearchEntry, lang: LanguageCode) {
    if (typeof entry.href === "string" && entry.href.length > 0) {
        return entry.href;
    }

    const category = safeString(entry.category);
    const slug = safeString(entry.slug);

    if (!category || !slug) {
        return "";
    }

    return lang === "en"
        ? `/en/${category}/${slug}`
        : `/${category}/${slug}`;
}
