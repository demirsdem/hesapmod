import fs from "node:fs";
import path from "node:path";

import { articles, getRelatedArticlesForCalculator } from "../lib/articles";
import { calculators } from "../lib/calculator-source";
import { getCategoryBySlug, getCategoryName } from "../lib/categories";
import { buildSitemapEntries, type SitemapEntry } from "../lib/sitemap-data";

type UrlType =
    | "home"
    | "all_tools"
    | "category"
    | "calculator"
    | "guide_hub"
    | "guide"
    | "static";

type ClassifiedEntry = {
    url: string;
    pathname: string;
    urlType: UrlType;
    slug: string;
    categorySlug: string;
    categoryName: string;
    title: string;
    lastModified: Date;
    sitemapPriority: number;
    score: number;
    reason: string;
};

type PriorityRow = ClassifiedEntry & {
    rank: number;
    action: string;
    wave: string;
};

const OUTPUT_PATH = path.join(process.cwd(), "reports", "search-console-index-priority.csv");

const CATEGORY_SCORE_BOOSTS: Record<string, number> = {
    "finansal-hesaplamalar": 16,
    "maas-ve-vergi": 15,
    "tasit-ve-vergi": 13,
    "sinav-hesaplamalari": 12,
    "yasam-hesaplama": 10,
    "zaman-hesaplama": 8,
    "ticaret-ve-is": 7,
    "matematik-hesaplama": 6,
    "astroloji": 3,
};

const SLUG_SCORE_BOOSTS: Record<string, number> = {
    "maas-hesaplama": 24,
    "kredi-taksit-hesaplama": 24,
    "ihtiyac-kredisi-hesaplama": 22,
    "konut-kredisi-hesaplama": 21,
    "mevduat-faiz-hesaplama": 20,
    "kira-artis-hesaplama": 18,
    "enflasyon-hesaplama": 18,
    "kdv-hesaplama": 18,
    "gelir-vergisi-hesaplama": 17,
    "kidem-tazminati-hesaplama": 17,
    "ihbar-tazminati-hesaplama": 15,
    "issizlik-maasi-hesaplama": 15,
    "altin-hesaplama": 15,
    "doviz-hesaplama": 15,
    "eurobond-hesaplama": 14,
    "kredi-karti-gecikme-faizi-hesaplama": 14,
    "kredi-yillik-maliyet-orani-hesaplama": 14,
    "kredi-erken-kapama-hesaplama": 13,
    "mtv-hesaplama": 13,
    "otv-hesaplama": 13,
    "yakit-tuketim-maliyet": 12,
    "yks-puan-hesaplama": 14,
    "tyt-puan-hesaplama": 12,
    "kpss-puan-hesaplama": 12,
    "lgs-puan-hesaplama": 11,
    "vucut-kitle-indeksi-hesaplama": 12,
    "gebelik-hesaplama": 11,
    "yumurtlama-donemi-hesaplama": 10,
    "yas-hesaplama": 10,
    "iki-tarih-arasindaki-gun-sayisi-hesaplama": 9,
};

const HOMEPAGE_FEATURED_SLUGS = new Set([
    "maas-hesaplama",
    "kredi-taksit-hesaplama",
    "vucut-kitle-indeksi-hesaplama",
    "kdv-hesaplama",
    "yks-puan-hesaplama",
    "yas-hesaplama",
]);

const LEGAL_PATHS = new Set([
    "/gizlilik-politikasi",
    "/cerez-politikasi",
    "/kvkk",
    "/kullanim-kosullari",
]);

function escapeCsv(value: string | number) {
    const raw = String(value);
    if (raw.includes(",") || raw.includes("\"") || raw.includes("\n")) {
        return `"${raw.replace(/"/g, "\"\"")}"`;
    }
    return raw;
}

function recencyBoost(lastModified: Date) {
    const days = Math.floor((Date.now() - lastModified.getTime()) / 86_400_000);
    if (days <= 3) return 6;
    if (days <= 7) return 4;
    if (days <= 30) return 2;
    return 0;
}

function classifyEntry(entry: SitemapEntry): ClassifiedEntry {
    const pathname = new URL(entry.url).pathname;
    const parts = pathname.split("/").filter(Boolean);
    const reasons = [`sitemap:${entry.priority.toFixed(2)}`];
    let score = Math.round(entry.priority * 100);

    if (pathname === "/") {
        score += 35;
        reasons.push("site-entry-point");
        return {
            url: entry.url,
            pathname,
            urlType: "home",
            slug: "",
            categorySlug: "",
            categoryName: "",
            title: "Ana Sayfa",
            lastModified: entry.lastModified,
            sitemapPriority: entry.priority,
            score,
            reason: reasons.join("; "),
        };
    }

    if (pathname === "/tum-araclar") {
        score += 28;
        reasons.push("catalog-hub");
        return {
            url: entry.url,
            pathname,
            urlType: "all_tools",
            slug: "",
            categorySlug: "",
            categoryName: "",
            title: "Tum Araclar",
            lastModified: entry.lastModified,
            sitemapPriority: entry.priority,
            score,
            reason: reasons.join("; "),
        };
    }

    if (pathname === "/rehber") {
        score += 18;
        reasons.push("guide-hub");
        return {
            url: entry.url,
            pathname,
            urlType: "guide_hub",
            slug: "",
            categorySlug: "",
            categoryName: "",
            title: "Rehber",
            lastModified: entry.lastModified,
            sitemapPriority: entry.priority,
            score,
            reason: reasons.join("; "),
        };
    }

    if (parts[0] === "kategori" && parts[1]) {
        const categorySlug = parts[1];
        const categoryBoost = CATEGORY_SCORE_BOOSTS[categorySlug] ?? 0;
        const categoryName = getCategoryName(categorySlug, "tr");
        score += 16 + categoryBoost + recencyBoost(entry.lastModified);
        reasons.push("category-hub");
        if (categoryBoost > 0) {
            reasons.push(`category-boost:${categoryBoost}`);
        }
        return {
            url: entry.url,
            pathname,
            urlType: "category",
            slug: categorySlug,
            categorySlug,
            categoryName,
            title: `${categoryName} Kategori`,
            lastModified: entry.lastModified,
            sitemapPriority: entry.priority,
            score,
            reason: reasons.join("; "),
        };
    }

    if (parts[0] === "rehber" && parts[1]) {
        const slug = parts[1];
        const article = articles.find((candidate) => candidate.slug === slug);
        const categorySlug = article?.categorySlug ?? "";
        const categoryBoost = CATEGORY_SCORE_BOOSTS[categorySlug] ?? 0;
        const calcSupportBoost = Math.min((article?.relatedCalculators.length ?? 0) * 2, 8);
        score += 10 + categoryBoost + calcSupportBoost + recencyBoost(entry.lastModified);
        reasons.push("editorial-support");
        if (categoryBoost > 0) {
            reasons.push(`category-boost:${categoryBoost}`);
        }
        if (calcSupportBoost > 0) {
            reasons.push(`calc-support:${calcSupportBoost}`);
        }
        return {
            url: entry.url,
            pathname,
            urlType: "guide",
            slug,
            categorySlug,
            categoryName: categorySlug ? getCategoryName(categorySlug, "tr") : "",
            title: article?.title ?? slug,
            lastModified: entry.lastModified,
            sitemapPriority: entry.priority,
            score,
            reason: reasons.join("; "),
        };
    }

    if (parts.length === 2) {
        const [categorySlug, slug] = parts;
        const calculator = calculators.find(
            (candidate) => candidate.category === categorySlug && candidate.slug === slug
        );
        if (calculator) {
            const categoryBoost = CATEGORY_SCORE_BOOSTS[categorySlug] ?? 0;
            const slugBoost = SLUG_SCORE_BOOSTS[slug] ?? 0;
            const guideSupportBoost = Math.min(
                getRelatedArticlesForCalculator(slug, categorySlug).length * 3,
                9
            );
            const homepageBoost = HOMEPAGE_FEATURED_SLUGS.has(slug) ? 8 : 0;
            score += 12 + categoryBoost + slugBoost + guideSupportBoost + homepageBoost + recencyBoost(entry.lastModified);
            reasons.push("calculator-landing");
            if (categoryBoost > 0) {
                reasons.push(`category-boost:${categoryBoost}`);
            }
            if (slugBoost > 0) {
                reasons.push(`slug-boost:${slugBoost}`);
            }
            if (guideSupportBoost > 0) {
                reasons.push(`guide-support:${guideSupportBoost}`);
            }
            if (homepageBoost > 0) {
                reasons.push("homepage-featured");
            }
            return {
                url: entry.url,
                pathname,
                urlType: "calculator",
                slug,
                categorySlug,
                categoryName: getCategoryName(categorySlug, "tr"),
                title: calculator.name.tr,
                lastModified: entry.lastModified,
                sitemapPriority: entry.priority,
                score,
                reason: reasons.join("; "),
            };
        }
    }

    if (LEGAL_PATHS.has(pathname)) {
        score -= 45;
        reasons.push("legal-sitemap-only");
    } else {
        score -= 20;
        reasons.push("support-page");
    }

    return {
        url: entry.url,
        pathname,
        urlType: "static",
        slug: parts[parts.length - 1] ?? "",
        categorySlug: "",
        categoryName: "",
        title: pathname === "/iletisim"
            ? "Iletisim"
            : pathname === "/hakkimizda"
                ? "Hakkimizda"
                : pathname === "/sss"
                    ? "SSS"
                    : pathname.replace(/\//g, " ").trim(),
        lastModified: entry.lastModified,
        sitemapPriority: entry.priority,
        score,
        reason: reasons.join("; "),
    };
}

function determineAction(row: ClassifiedEntry, rank: number) {
    if (row.urlType === "static" && row.pathname !== "/" && row.pathname !== "/tum-araclar") {
        return {
            action: "sitemap_only",
            wave: "defer",
        };
    }

    if (rank <= 20) {
        return {
            action: "request_now",
            wave: "wave_1",
        };
    }

    if (rank <= 50) {
        return {
            action: "request_in_48h",
            wave: "wave_2",
        };
    }

    if (rank <= 100) {
        return {
            action: "request_in_week_1",
            wave: "wave_3",
        };
    }

    if (rank <= 160) {
        return {
            action: "request_in_week_2",
            wave: "wave_4",
        };
    }

    return {
        action: "sitemap_monitor",
        wave: "wave_5",
    };
}

function toCsv(rows: PriorityRow[]) {
    const header = [
        "rank",
        "wave",
        "action",
        "priority_score",
        "url_type",
        "title",
        "category_slug",
        "category_name",
        "slug",
        "last_modified",
        "sitemap_priority",
        "url",
        "reason",
    ];

    const lines = rows.map((row) =>
        [
            row.rank,
            row.wave,
            row.action,
            row.score,
            row.urlType,
            row.title,
            row.categorySlug,
            row.categoryName,
            row.slug,
            row.lastModified.toISOString(),
            row.sitemapPriority.toFixed(2),
            row.url,
            row.reason,
        ]
            .map(escapeCsv)
            .join(",")
    );

    return [header.join(","), ...lines].join("\n");
}

function main() {
    const rows = buildSitemapEntries()
        .map(classifyEntry)
        .sort((left, right) => {
            if (right.score !== left.score) return right.score - left.score;
            if (right.sitemapPriority !== left.sitemapPriority) {
                return right.sitemapPriority - left.sitemapPriority;
            }
            if (right.lastModified.getTime() !== left.lastModified.getTime()) {
                return right.lastModified.getTime() - left.lastModified.getTime();
            }
            return left.url.localeCompare(right.url, "en");
        })
        .map((row, index) => {
            const rank = index + 1;
            const action = determineAction(row, rank);
            return {
                ...row,
                rank,
                action: action.action,
                wave: action.wave,
            };
        });

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, toCsv(rows), "utf8");

    const summary = rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.action] = (acc[row.action] ?? 0) + 1;
        return acc;
    }, {});

    console.log(`Wrote ${rows.length} rows to ${OUTPUT_PATH}`);
    console.log(
        `Action counts: ${Object.entries(summary)
            .map(([action, count]) => `${action}=${count}`)
            .join(", ")}`
    );
    console.log("Top 10 URLs:");
    for (const row of rows.slice(0, 10)) {
        console.log(`${row.rank}. [${row.wave}] ${row.url}`);
    }
}

main();
