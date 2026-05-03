import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { articles } from "../lib/articles";
import { calculators } from "../lib/calculator-source";
import { mainCategories } from "../lib/categories";
import {
    getActivationRouteKey,
    newCalculatorActivationGroups,
    newCalculatorActivationRouteKeys,
    newCalculatorActivationRoutes,
} from "../lib/organic-activation";

const SITE_URL = "https://www.hesapmod.com";
const GENERATED_DATE = "3 Mayis 2026";

type Stage = "Stage 2" | "Stage 3" | "Stage 4" | "Stage 5";

type MasterEntry = {
    url: string;
    path: string;
    category: string;
    sourceStage: Stage | "Multiple";
    type: "new-canonical" | "seo-updated-existing";
    notes: string;
};

type LiveCheck = {
    httpStatus: number;
    inSitemap: boolean;
    canonicalOk: boolean;
    titleOk: boolean;
    metaOk: boolean;
    contentOk: boolean;
    faqOk: boolean;
    canonical: string;
    error?: string;
};

type LinkCheck = {
    internalLinkCount: number;
    linkedFromHome: boolean;
    linkedFromTumAraclar: boolean;
    linkedFromCategoryHub: boolean;
    linkedFromRelatedCalculators: boolean;
    relatedIncomingCount: number;
    guideIncomingCount: number;
    contentIncomingCount: number;
};

const aliasEntries = [
    {
        alias: "/maas-ve-vergi/bordro-hesaplama",
        canonical: "/maas-ve-vergi/maas-hesaplama",
        reason: "Bordro niyeti mevcut maas hesaplama canonical sayfasiyla karsilaniyor; ayri sayfa acilmadi.",
    },
    {
        alias: "/maas-ve-vergi/freelance-vergi-hesaplama",
        canonical: "/muhasebe/serbest-meslek-makbuzu-hesaplama",
        reason: "Freelance vergi niyeti serbest meslek makbuzu canonical sayfasina yonlendirildi.",
    },
    {
        alias: "/maas-ve-vergi/serbest-meslek-makbuzu-hesaplama",
        canonical: "/muhasebe/serbest-meslek-makbuzu-hesaplama",
        reason: "Yanlis kategori aliasi dogru muhasebe canonical sayfasina yonlendirildi.",
    },
    {
        alias: "/matematik-hesaplama/standart-sapma-hesaplama",
        canonical: "/matematik-hesaplama/standart-sapma",
        reason: "Standart sapma icin canonical kisa slug kullaniliyor.",
    },
    {
        alias: "/sinav-hesaplamalari/not-ortalamasi-hesaplama",
        canonical: "/matematik-hesaplama/ortalama-hesaplama",
        reason: "Not ortalamasi niyeti ortalama hesaplama canonical iceriginde guclendirildi.",
    },
    {
        alias: "/yasam-hesaplama/kira-artis-hesaplama",
        canonical: "/finansal-hesaplamalar/kira-artis-hesaplama",
        reason: "Kira artisi finansal hesaplamalar canonical kategorisinde tutuluyor.",
    },
    {
        alias: "/yasam-hesaplama/burc-hesaplama",
        canonical: "/astroloji/burc-hesaplama",
        reason: "Kaynak rapordaki kategori yolu hatali; canli canonical astroloji kategorisinde.",
    },
    {
        alias: "/insaat-muhendislik/metrekare-hesaplama",
        canonical: "/ticaret-ve-is/insaat-alani-hesaplama",
        reason: "Metrekare/alan niyeti mevcut insaat alani canonical sayfasiyla karsilaniyor.",
    },
    {
        alias: "/insaat-muhendislik/bina-maliyet-hesaplama",
        canonical: "/ticaret-ve-is/insaat-maliyeti-hesaplama",
        reason: "Bina maliyeti niyeti insaat maliyeti canonical sayfasiyla karsilaniyor.",
    },
    {
        alias: "/insaat-muhendislik/arsa-deger-hesaplama",
        canonical: "/gayrimenkul-deger-hesaplama",
        reason: "Arsa deger niyeti gayrimenkul deger ozel sayfasiyla karsilaniyor.",
    },
    {
        alias: "/insaat-muhendislik/klima-kapasite-hesaplama",
        canonical: "/diger/klima-btu-hesaplama",
        reason: "Klima kapasite niyeti mevcut BTU canonical sayfasiyla karsilaniyor.",
    },
];

function fullUrl(path: string) {
    return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

function normalizeUrl(url: string) {
    const normalized = new URL(url, SITE_URL);
    normalized.hash = "";
    normalized.search = "";
    return normalized.href.replace(/\/$/, "");
}

function escapeCell(value: unknown) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

function markdownEscape(value: string) {
    return value.replace(/\|/g, "\\|");
}

function stripHtml(html: string) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getAttribute(tag: string, attr: string) {
    const match = tag.match(new RegExp(`${attr}=["']([^"']+)["']`, "i"));
    return match?.[1] ?? "";
}

function extractCanonical(html: string) {
    const tags = html.match(/<link[^>]+>/gi) ?? [];
    const tag = tags.find((item) => /rel=["']canonical["']/i.test(item));
    return tag ? getAttribute(tag, "href") : "";
}

function extractMetaDescription(html: string) {
    const tags = html.match(/<meta[^>]+>/gi) ?? [];
    const tag = tags.find((item) => /name=["']description["']/i.test(item));
    return tag ? getAttribute(tag, "content") : "";
}

function extractTitle(html: string) {
    return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
}

async function fetchText(url: string, redirect: RequestRedirect = "manual") {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
        const response = await fetch(url, {
            redirect,
            signal: controller.signal,
            headers: {
                "user-agent": "HesapModIndexAudit/1.0",
                "accept": "text/html,application/xml,text/xml;q=0.9,*/*;q=0.8",
            },
        });
        const text = await response.text();
        return { status: response.status, text, location: response.headers.get("location") ?? "" };
    } finally {
        clearTimeout(timeout);
    }
}

async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
    const results: R[] = new Array(items.length);
    let nextIndex = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (nextIndex < items.length) {
            const index = nextIndex;
            nextIndex += 1;
            results[index] = await worker(items[index]);
        }
    });
    await Promise.all(workers);
    return results;
}

function parseSitemapUrls(xml: string) {
    return new Set(
        Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) =>
            normalizeUrl(match[1])
        )
    );
}

function stageForIndex(markdown: string, index: number): Stage {
    const stage3 = markdown.indexOf("## Stage 3");
    const stage4 = markdown.indexOf("## Stage 4");
    const stage5 = markdown.indexOf("## Stage 5");

    if (stage5 >= 0 && index >= stage5) return "Stage 5";
    if (stage4 >= 0 && index >= stage4) return "Stage 4";
    if (stage3 >= 0 && index >= stage3) return "Stage 3";
    return "Stage 2";
}

const categoryLabelBySlug = new Map(
    mainCategories.map((category) => [category.slug, category.name.tr])
);

function labelFromCategory(category: string, path: string) {
    if (path === "/gayrimenkul-deger-hesaplama") return "Finans";
    return categoryLabelBySlug.get(category) ?? category;
}

function parseSeoUpdatedEntries(): MasterEntry[] {
    const markdown = readFileSync(join(process.cwd(), "reports/seo-updated-existing-calculators.md"), "utf8");
    const rows = Array.from(
        markdown.matchAll(/^\| `(\/[^`]+)` \| `([^`]+)` \| ([^|]+) \|$/gm)
    );

    return rows.map((match) => {
        let path = match[1];
        let category = match[2];
        const notes = match[3].trim();

        if (path === "/yasam-hesaplama/burc-hesaplama") {
            path = "/astroloji/burc-hesaplama";
            category = "astroloji";
        }

        return {
            url: fullUrl(path),
            path,
            category: labelFromCategory(category, path),
            sourceStage: stageForIndex(markdown, match.index ?? 0),
            type: "seo-updated-existing",
            notes,
        };
    });
}

function buildMasterEntries() {
    const calculatorByRoute = new Map(
        calculators.map((calculator) => [getActivationRouteKey(calculator), calculator])
    );
    const entries = new Map<string, MasterEntry>();

    for (const route of newCalculatorActivationRoutes) {
        const path = `/${route.category}/${route.slug}`;
        const calculator = calculatorByRoute.get(getActivationRouteKey(route));
        entries.set(normalizeUrl(fullUrl(path)), {
            url: fullUrl(path),
            path,
            category: route.clusterLabel,
            sourceStage: route.sourceStage,
            type: "new-canonical",
            notes: calculator?.name.tr ?? route.slug,
        });
    }

    for (const entry of parseSeoUpdatedEntries()) {
        const key = normalizeUrl(entry.url);
        const existing = entries.get(key);
        if (existing) {
            entries.set(key, {
                ...existing,
                sourceStage: existing.sourceStage === entry.sourceStage ? existing.sourceStage : "Multiple",
                notes: `${existing.notes}; ${entry.notes}`,
            });
            continue;
        }
        entries.set(key, entry);
    }

    return Array.from(entries.values()).sort((left, right) => {
        const stageCompare = left.sourceStage.localeCompare(right.sourceStage);
        if (stageCompare !== 0) return stageCompare;
        const typeCompare = left.type.localeCompare(right.type);
        if (typeCompare !== 0) return typeCompare;
        return left.url.localeCompare(right.url);
    });
}

function buildRelatedIncomingCounts() {
    const bySlug = new Map(calculators.map((calculator) => [calculator.slug, calculator]));
    const sources = new Map<string, Set<string>>();

    for (const source of calculators) {
        const relatedSlugs = new Set(source.relatedCalculators ?? []);
        const explicitRelated = (source.relatedCalculators ?? [])
            .map((slug) => bySlug.get(slug))
            .filter(Boolean);
        const supplementalRelated = calculators.filter(
            (candidate) =>
                candidate.slug !== source.slug
                && candidate.category === source.category
                && !relatedSlugs.has(candidate.slug)
        );
        const related = [...explicitRelated, ...supplementalRelated].slice(0, 4);

        for (const target of related) {
            if (!target) continue;
            const targetKey = getActivationRouteKey(target);
            const sourceKey = getActivationRouteKey(source);
            if (!sources.has(targetKey)) sources.set(targetKey, new Set());
            sources.get(targetKey)?.add(sourceKey);
        }
    }

    return sources;
}

function buildGuideIncomingCounts() {
    const bySlug = new Map(calculators.map((calculator) => [calculator.slug, calculator]));
    const sources = new Map<string, Set<string>>();

    for (const article of articles) {
        for (const slug of article.relatedCalculators ?? []) {
            const calculator = bySlug.get(slug);
            if (!calculator) continue;
            const key = getActivationRouteKey(calculator);
            if (!sources.has(key)) sources.set(key, new Set());
            sources.get(key)?.add(article.slug);
        }

        const hrefs = Array.from(article.content.matchAll(/href=["'](\/[^"']+)["']/g)).map((match) => match[1]);
        for (const href of hrefs) {
            const parts = href.split("/").filter(Boolean);
            if (parts.length < 2) continue;
            const [category, slug] = parts;
            const calculator = calculators.find((item) => item.category === category && item.slug === slug);
            if (!calculator) continue;
            const key = getActivationRouteKey(calculator);
            if (!sources.has(key)) sources.set(key, new Set());
            sources.get(key)?.add(article.slug);
        }
    }

    return sources;
}

function buildCalculatorContentIncomingCounts() {
    const sources = new Map<string, Set<string>>();

    for (const source of calculators) {
        const html = [
            source.seo?.content?.tr,
            source.seo?.richContent?.howItWorks?.tr,
            source.seo?.richContent?.formulaText?.tr,
            source.seo?.richContent?.exampleCalculation?.tr,
            source.seo?.richContent?.miniGuide?.tr,
        ].filter(Boolean).join(" ");
        const hrefs = Array.from(html.matchAll(/href=["'](\/[^"']+)["']/g)).map((match) => match[1]);
        for (const href of hrefs) {
            const parts = href.split("/").filter(Boolean);
            if (parts.length === 0) continue;
            const targetKey = parts.slice(0, 2).join("/");
            if (!sources.has(targetKey)) sources.set(targetKey, new Set());
            sources.get(targetKey)?.add(getActivationRouteKey(source));
        }
    }

    return sources;
}

function buildLinkChecks(entries: MasterEntry[]): Map<string, LinkCheck> {
    const calculatorRouteKeys = new Set(
        calculators.map((calculator) => getActivationRouteKey(calculator))
    );
    const relatedIncoming = buildRelatedIncomingCounts();
    const guideIncoming = buildGuideIncomingCounts();
    const contentIncoming = buildCalculatorContentIncomingCounts();
    const homepageStaticPaths = new Set([
        "/maas-ve-vergi/maas-hesaplama",
        "/finansal-hesaplamalar/kredi-taksit-hesaplama",
        "/tasit-ve-vergi/mtv-hesaplama",
        "/sinav-hesaplamalari/kpss-puan-hesaplama",
        "/sinav-hesaplamalari/tyt-puan-hesaplama",
        "/sinav-hesaplamalari/yks-puan-hesaplama",
        "/yasam-hesaplama/vucut-kitle-indeksi-hesaplama",
        "/matematik-hesaplama/yuzde-hesaplama",
        "/finansal-hesaplamalar/kdv-hesaplama",
        "/maas-ve-vergi/kidem-tazminati-hesaplama",
        "/gayrimenkul-deger-hesaplama",
        "/zaman-hesaplama/yas-hesaplama-detayli",
    ]);
    const allToolsSpecialPaths = new Set([
        "/gayrimenkul-deger-hesaplama",
    ]);

    const checks = new Map<string, LinkCheck>();
    for (const entry of entries) {
        const routeKey = entry.path.split("/").filter(Boolean).slice(0, 2).join("/");
        const linkedFromHome =
            newCalculatorActivationRouteKeys.has(routeKey)
            || homepageStaticPaths.has(entry.path);
        const linkedFromTumAraclar = calculatorRouteKeys.has(routeKey) || allToolsSpecialPaths.has(entry.path);
        const linkedFromCategoryHub = calculatorRouteKeys.has(routeKey);
        const relatedIncomingCount = relatedIncoming.get(routeKey)?.size ?? 0;
        const guideIncomingCount = guideIncoming.get(routeKey)?.size ?? 0;
        const contentIncomingCount = contentIncoming.get(routeKey)?.size ?? 0;
        const linkedFromRelatedCalculators = relatedIncomingCount > 0;
        const internalLinkCount =
            (linkedFromHome ? 1 : 0)
            + (linkedFromTumAraclar ? 1 : 0)
            + (linkedFromCategoryHub ? 1 : 0)
            + relatedIncomingCount
            + guideIncomingCount
            + contentIncomingCount;

        checks.set(normalizeUrl(entry.url), {
            internalLinkCount,
            linkedFromHome,
            linkedFromTumAraclar,
            linkedFromCategoryHub,
            linkedFromRelatedCalculators,
            relatedIncomingCount,
            guideIncomingCount,
            contentIncomingCount,
        });
    }

    return checks;
}

async function buildLiveChecks(entries: MasterEntry[], sitemapUrls: Set<string>) {
    const results = await mapLimit(entries, 8, async (entry): Promise<[string, LiveCheck]> => {
        const expectedUrl = normalizeUrl(entry.url);
        try {
            const response = await fetchText(entry.url, "manual");
            const html = response.text;
            const canonical = extractCanonical(html);
            const title = extractTitle(html);
            const metaDescription = extractMetaDescription(html);
            const text = stripHtml(html);
            const normalizedCanonical = canonical ? normalizeUrl(canonical) : "";

            return [
                expectedUrl,
                {
                    httpStatus: response.status,
                    inSitemap: sitemapUrls.has(expectedUrl),
                    canonicalOk: response.status === 200 && normalizedCanonical === expectedUrl,
                    titleOk: title.length > 0,
                    metaOk: metaDescription.length > 0,
                    contentOk: response.status === 200 && text.length > 800 && /<h1[\s>]/i.test(html),
                    faqOk: /S[ıi]kça Sorulan Sorular|Sikca Sorulan Sorular|FAQPage/i.test(html),
                    canonical,
                },
            ];
        } catch (error) {
            return [
                expectedUrl,
                {
                    httpStatus: 0,
                    inSitemap: sitemapUrls.has(expectedUrl),
                    canonicalOk: false,
                    titleOk: false,
                    metaOk: false,
                    contentOk: false,
                    faqOk: false,
                    canonical: "",
                    error: error instanceof Error ? error.message : String(error),
                },
            ];
        }
    });

    return new Map(results);
}

async function buildAliasChecks(sitemapUrls: Set<string>) {
    const checks = await mapLimit(aliasEntries, 4, async (entry) => {
        try {
            const response = await fetchText(fullUrl(entry.alias), "manual");
            return {
                ...entry,
                status: response.status,
                location: response.location,
                aliasInSitemap: sitemapUrls.has(normalizeUrl(fullUrl(entry.alias))),
                canonicalInSitemap: sitemapUrls.has(normalizeUrl(fullUrl(entry.canonical))),
            };
        } catch (error) {
            return {
                ...entry,
                status: 0,
                location: "",
                aliasInSitemap: sitemapUrls.has(normalizeUrl(fullUrl(entry.alias))),
                canonicalInSitemap: sitemapUrls.has(normalizeUrl(fullUrl(entry.canonical))),
                error: error instanceof Error ? error.message : String(error),
            };
        }
    });
    return checks;
}

function buildCsv(entries: MasterEntry[], liveChecks: Map<string, LiveCheck>, linkChecks: Map<string, LinkCheck>) {
    const header = [
        "url",
        "category",
        "sourceStage",
        "type",
        "httpStatus",
        "inSitemap",
        "canonicalOk",
        "internalLinkCount",
        "linkedFromHome",
        "linkedFromTumAraclar",
        "linkedFromCategoryHub",
        "linkedFromRelatedCalculators",
        "submitToSearchConsole",
        "submittedDate",
        "gscStatus",
        "notes",
    ];

    const rows = entries.map((entry) => {
        const key = normalizeUrl(entry.url);
        const live = liveChecks.get(key);
        const links = linkChecks.get(key);
        return [
            entry.url,
            entry.category,
            entry.sourceStage,
            entry.type,
            live?.httpStatus ?? 0,
            live?.inSitemap ?? false,
            live?.canonicalOk ?? false,
            links?.internalLinkCount ?? 0,
            links?.linkedFromHome ?? false,
            links?.linkedFromTumAraclar ?? false,
            links?.linkedFromCategoryHub ?? false,
            links?.linkedFromRelatedCalculators ?? false,
            true,
            "",
            "pending",
            entry.notes,
        ].map(escapeCell).join(",");
    });

    return [header.map(escapeCell).join(","), ...rows].join("\n") + "\n";
}

function groupCount<T extends string>(entries: MasterEntry[], selector: (entry: MasterEntry) => T) {
    const counts = new Map<T, number>();
    for (const entry of entries) {
        const key = selector(entry);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((left, right) => String(left[0]).localeCompare(String(right[0])));
}

function summarizeLive(entries: MasterEntry[], liveChecks: Map<string, LiveCheck>) {
    const values = entries.map((entry) => liveChecks.get(normalizeUrl(entry.url)));
    return {
        http200: values.filter((item) => item?.httpStatus === 200).length,
        inSitemap: values.filter((item) => item?.inSitemap).length,
        canonicalOk: values.filter((item) => item?.canonicalOk).length,
        titleOk: values.filter((item) => item?.titleOk).length,
        metaOk: values.filter((item) => item?.metaOk).length,
        contentOk: values.filter((item) => item?.contentOk).length,
        faqOk: values.filter((item) => item?.faqOk).length,
    };
}

function problematicEntries(entries: MasterEntry[], liveChecks: Map<string, LiveCheck>, linkChecks: Map<string, LinkCheck>) {
    return entries.filter((entry) => {
        const live = liveChecks.get(normalizeUrl(entry.url));
        const links = linkChecks.get(normalizeUrl(entry.url));
        return !live
            || live.httpStatus !== 200
            || !live.inSitemap
            || !live.canonicalOk
            || !live.titleOk
            || !live.metaOk
            || !live.contentOk
            || !live.faqOk
            || !links
            || links.internalLinkCount < 2;
    });
}

function buildMasterMarkdown(
    entries: MasterEntry[],
    liveChecks: Map<string, LiveCheck>,
    linkChecks: Map<string, LinkCheck>,
    sitemapCount: number
) {
    const summary = summarizeLive(entries, liveChecks);
    const problems = problematicEntries(entries, liveChecks, linkChecks);
    const byType = groupCount(entries, (entry) => entry.type);
    const byStage = groupCount(entries, (entry) => entry.sourceStage);

    return `# Google Indexing Master List

Generated: ${GENERATED_DATE}

Kapsam: Calculator expansion sonrasi Search Console'a gonderilecek canonical URL listesi. Redirect/alias URL'ler bu listeye alinmadi.

## Ozet

| Metrik | Sayi |
| --- | ---: |
| Yeni canonical URL | ${entries.filter((entry) => entry.type === "new-canonical").length} |
| SEO guncellenen tekil canonical URL | ${entries.filter((entry) => entry.type === "seo-updated-existing").length} |
| Search Console'a gonderilecek toplam URL | ${entries.length} |
| Canli sitemap URL sayisi | ${sitemapCount} |
| HTTP 200 | ${summary.http200}/${entries.length} |
| Sitemap icinde | ${summary.inSitemap}/${entries.length} |
| Canonical kendisini gosteriyor | ${summary.canonicalOk}/${entries.length} |
| Title dolu | ${summary.titleOk}/${entries.length} |
| Meta description dolu | ${summary.metaOk}/${entries.length} |
| Content dolu | ${summary.contentOk}/${entries.length} |
| FAQ dolu | ${summary.faqOk}/${entries.length} |
| Sorunlu URL | ${problems.length} |

## Dagilim

### Tipe Gore

| Tip | Sayi |
| --- | ---: |
${byType.map(([type, count]) => `| ${type} | ${count} |`).join("\n")}

### Asamaya Gore

| Asama | Sayi |
| --- | ---: |
${byStage.map(([stage, count]) => `| ${stage} | ${count} |`).join("\n")}

## URL Listesi

| URL | Kategori | Tip | Asama | HTTP | Sitemap | Canonical | Ic link | Not |
| --- | --- | --- | --- | ---: | --- | --- | ---: | --- |
${entries.map((entry) => {
    const key = normalizeUrl(entry.url);
    const live = liveChecks.get(key);
    const links = linkChecks.get(key);
    return `| ${entry.url} | ${markdownEscape(entry.category)} | ${entry.type} | ${entry.sourceStage} | ${live?.httpStatus ?? 0} | ${live?.inSitemap ? "Evet" : "Hayir"} | ${live?.canonicalOk ? "Evet" : "Hayir"} | ${links?.internalLinkCount ?? 0} | ${markdownEscape(entry.notes)} |`;
}).join("\n")}

## Sorunlu URL'ler

${problems.length === 0 ? "Sorunlu URL bulunmadi." : problems.map((entry) => {
    const live = liveChecks.get(normalizeUrl(entry.url));
    const links = linkChecks.get(normalizeUrl(entry.url));
    const reasons = [
        live?.httpStatus !== 200 ? `HTTP ${live?.httpStatus ?? 0}` : "",
        !live?.inSitemap ? "sitemap disi" : "",
        !live?.canonicalOk ? "canonical kontrolu basarisiz" : "",
        !live?.titleOk ? "title bos" : "",
        !live?.metaOk ? "meta bos" : "",
        !live?.contentOk ? "content zayif/bos" : "",
        !live?.faqOk ? "FAQ bulunamadi" : "",
        (links?.internalLinkCount ?? 0) < 2 ? "ic link zayif" : "",
    ].filter(Boolean).join(", ");
    return `- ${entry.url}: ${reasons}`;
}).join("\n")}
`;
}

function buildDoNotSubmitMarkdown(aliasChecks: Awaited<ReturnType<typeof buildAliasChecks>>) {
    return `# Google Indexing Do Not Submit

Generated: ${GENERATED_DATE}

Bu URL'ler Search Console URL Inspection listesine eklenmeyecek. Hepsi redirect, alias, duplicate-intent veya kaynak rapor yolu hatali olan URL'lerdir. Google'a canonical hedef gonderilmeli.

## Neden Gonderilmeyecek?

- Sitemap sadece HTTP 200 donen, indexlenebilir ve self-canonical URL'leri icermeli.
- Redirect/alias URL'ler sinyali canonical hedefe toplar; ayri index talebi duplicate/canonical karisikligi yaratabilir.
- URL Inspection canonical hedefte yapilirsa Google secilen canonical'i daha temiz gorur.

## URL Listesi

| Alias URL | HTTP | Canonical URL | Alias sitemap'te | Canonical sitemap'te | Neden |
| --- | ---: | --- | --- | --- | --- |
${aliasChecks.map((entry) => `| ${fullUrl(entry.alias)} | ${entry.status} | ${fullUrl(entry.canonical)} | ${entry.aliasInSitemap ? "Evet" : "Hayir"} | ${entry.canonicalInSitemap ? "Evet" : "Hayir"} | ${markdownEscape(entry.reason)} |`).join("\n")}
`;
}

function buildDiagnosticsMarkdown(
    entries: MasterEntry[],
    liveChecks: Map<string, LiveCheck>,
    linkChecks: Map<string, LinkCheck>
) {
    const technicalProblems = entries.filter((entry) => {
        const live = liveChecks.get(normalizeUrl(entry.url));
        return !live
            || live.httpStatus !== 200
            || !live.inSitemap
            || !live.canonicalOk
            || !live.titleOk
            || !live.metaOk
            || !live.contentOk
            || !live.faqOk;
    });
    const linkProblems = entries.filter((entry) => {
        const links = linkChecks.get(normalizeUrl(entry.url));
        return !links || links.internalLinkCount < 2;
    });
    return `# Google Indexing Diagnostics

Generated: ${GENERATED_DATE}

Bu dosya Search Console URL Inspection ve Page Indexing raporunda tek tek kontrol edilecek maddeleri toplar.

## URL Inspection Kontrol Sirasi

Her canonical URL icin su sorular kontrol edilmeli:

1. URL Google'da var mi?
2. Canli URL testi basarili mi?
3. Google tarafindan secilen canonical, kullanici tarafindan bildirilen canonical ile ayni mi?
4. Durum "Discovered - currently not indexed" mi?
5. Durum "Crawled - currently not indexed" mi?
6. Duplicate/canonical problemi var mi?
7. noindex veya robots engeli var mi?
8. Soft 404 sinyali var mi?
9. Sayfa sitemap'te gorunuyor mu?
10. Sayfa ana sayfa, tum araclar ve kategori hub uzerinden link aliyor mu?

## Canli Teknik Kontrol

| Metrik | Sonuc |
| --- | ---: |
| Kontrol edilen canonical URL | ${entries.length} |
| Teknik sorunlu URL | ${technicalProblems.length} |
| Ic linki zayif URL | ${linkProblems.length} |
| HTTP 200 olmayan | ${entries.filter((entry) => liveChecks.get(normalizeUrl(entry.url))?.httpStatus !== 200).length} |
| Sitemap disi | ${entries.filter((entry) => !liveChecks.get(normalizeUrl(entry.url))?.inSitemap).length} |
| Canonical hatali | ${entries.filter((entry) => !liveChecks.get(normalizeUrl(entry.url))?.canonicalOk).length} |
| Title bos | ${entries.filter((entry) => !liveChecks.get(normalizeUrl(entry.url))?.titleOk).length} |
| Meta bos | ${entries.filter((entry) => !liveChecks.get(normalizeUrl(entry.url))?.metaOk).length} |
| Content zayif/bos | ${entries.filter((entry) => !liveChecks.get(normalizeUrl(entry.url))?.contentOk).length} |
| FAQ bulunamadi | ${entries.filter((entry) => !liveChecks.get(normalizeUrl(entry.url))?.faqOk).length} |

## Search Console Durum Yorumlari

- "Discovered - currently not indexed": Google URL'yi biliyor ama henuz crawl etmemis olabilir. Sitemap tekrar gonderimi, kategori hub linkleri ve URL Inspection onceligi uygulanir.
- "Crawled - currently not indexed": Google sayfayi taramis ama indexe almamis olabilir. Icerik benzersizligi, H1/title niyeti, FAQ ve related link gucu yeniden kontrol edilir.
- "Duplicate, Google chose different canonical": Alias URL gonderilmis olabilir ya da sayfa canonical sinyali zayiftir. Sadece master listedeki canonical URL gonderilir.
- "Excluded by noindex/robots": robots.txt, meta robots ve response header kontrol edilir.
- "Soft 404": Sayfa 200 donse bile icerik zayif veya niyet belirsiz olabilir. Hesaplama alanlari, ornek hesaplama ve kategori baglam metni guclendirilir.
`;
}

function buildInternalLinkAuditMarkdown(entries: MasterEntry[], linkChecks: Map<string, LinkCheck>) {
    const newEntries = entries.filter((entry) => entry.type === "new-canonical");
    const weakNewEntries = newEntries.filter((entry) => {
        const links = linkChecks.get(normalizeUrl(entry.url));
        return !links || links.internalLinkCount < 3 || !links.linkedFromHome || !links.linkedFromTumAraclar || !links.linkedFromCategoryHub;
    });
    const noRelated = newEntries.filter((entry) => !linkChecks.get(normalizeUrl(entry.url))?.linkedFromRelatedCalculators);

    const groupRows = newCalculatorActivationGroups.map((group) => {
        const groupEntries = newEntries.filter((entry) =>
            group.routes.some((route) => entry.path === `/${route.category}/${route.slug}`)
        );
        const home = groupEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromHome).length;
        const allTools = groupEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromTumAraclar).length;
        const hub = groupEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromCategoryHub).length;
        const related = groupEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromRelatedCalculators).length;
        return `| ${group.label} | ${groupEntries.length} | ${home} | ${allTools} | ${hub} | ${related} |`;
    });

    return `# Internal Link Audit

Generated: ${GENERATED_DATE}

Kapsam: Yeni 92 canonical URL ve SEO guncellenen mevcut sayfalar icin crawl edilebilir ic link kaynaklari.

## Uygulanan Aktivasyon

- Ana sayfaya "Yeni Eklenen Hesaplayicilar" bolumu eklendi ve 92 yeni canonical URL'nin tamami Next Link ile baglandi.
- /tum-araclar sayfasina "Yeni Eklenen Araclar" bolumu eklendi ve 92 yeni canonical URL'nin tamami kategori bazinda gorunur hale getirildi.
- /kategori/[slug] hub sayfalarina ilgili kategori icin "Yeni Eklenen ... Araclari" bolumu eklendi.
- Hesaplayici sayfalarindaki related calculator baglantilari canonical kategori/slug ile uretiliyor.
- Footer/nav kategori hub'larini linklemeye devam ediyor; yeni insaat-muhendislik kategorisi bu agda mevcut.

## Yeni Canonical URL Kapsami

| Grup | Yeni URL | Ana sayfa | /tum-araclar | Kategori hub | Related calculator |
| --- | ---: | ---: | ---: | ---: | ---: |
${groupRows.join("\n")}

## Zayif Ic Link Tespiti

| Kontrol | Sayi |
| --- | ---: |
| Yeni canonical URL | ${newEntries.length} |
| Ana sayfa linki alan | ${newEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromHome).length} |
| /tum-araclar linki alan | ${newEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromTumAraclar).length} |
| Kategori hub linki alan | ${newEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromCategoryHub).length} |
| Related calculator linki alan | ${newEntries.filter((entry) => linkChecks.get(normalizeUrl(entry.url))?.linkedFromRelatedCalculators).length} |
| Temel ic link kaynagi zayif kalan | ${weakNewEntries.length} |
| Related calculator inbound almayan | ${noRelated.length} |

${weakNewEntries.length === 0 ? "Temel ic link kaynaklari acisindan zayif kalan yeni canonical URL yok." : weakNewEntries.map((entry) => `- ${entry.url}`).join("\n")}

## Related Calculator Inbound Almayanlar

${noRelated.length === 0 ? "Yeni canonical URL'lerin tamami en az bir related calculator inbound baglantisi aliyor." : noRelated.map((entry) => `- ${entry.url}`).join("\n")}

## Rehber Icerikleri

Rehber icerikleri mevcut guclu sayfalara daha yogun baglaniyor. Yeni sayfalarin index ve impression verisi geldikten sonra rehber iceriklerindeki ilgili bolumlere yeni canonical linklerin kontrollu eklenmesi ikinci dalga olarak uygulanabilir.
`;
}

function buildRecoveryPlanMarkdown(entries: MasterEntry[]) {
    const batch1 = entries.filter((entry) => entry.sourceStage === "Stage 2");
    const batch2 = entries.filter((entry) => entry.sourceStage === "Stage 3");
    const batch3 = entries.filter((entry) => entry.sourceStage === "Stage 4");
    const batch4 = entries.filter((entry) => entry.sourceStage === "Stage 5");
    const batch5 = entries.filter((entry) => entry.type === "seo-updated-existing");

    return `# Google Organic Recovery Plan

Generated: ${GENERATED_DATE}

Hedef: Yeni hesaplayici genislemesi sonrasinda sitemap, internal link ve Search Console kontrollerini 30 gunluk bir takip akisiyle aktive etmek.

## Batch Mantigi

Batch sirasi URL atlama anlamina gelmez. Tum canonical URL'ler islenecek; batch sadece Search Console takip ve raporlama siralamasidir.

| Batch | Kapsam | URL |
| --- | --- | ---: |
| Batch 1 | Finans + Maas/Vergi | ${batch1.length} |
| Batch 2 | Matematik + Egitim/Sinav | ${batch2.length} |
| Batch 3 | Saglik + Gunluk Yasam + Spor/Fitness | ${batch3.length} |
| Batch 4 | Insaat/Muhendislik | ${batch4.length} |
| Batch 5 | SEO'su guncellenen mevcut guclu sayfalar | ${batch5.length} |

## 30 Gunluk Plan

### Gun 0

- Search Console'da sitemap tekrar gonder: ${SITE_URL}/sitemap.xml
- Batch 1 URL Inspection calistir.
- Yeni URL'lerin ana sayfa, /tum-araclar ve kategori hub linklerini kontrol et.
- Redirect/alias URL'leri URL Inspection listesine ekleme.

### Gun 3

- Page Indexing raporunda "Discovered - currently not indexed" ve "Crawled - currently not indexed" ayrimini cikar.
- Crawled not indexed sayfalarda title, H1, hesaplama formu, ornek hesaplama, FAQ ve related link bolumlerini kontrol et.
- Batch 2 ve Batch 3 icin URL Inspection siralamasi baslat.

### Gun 7

- Ilk impression alan URL'leri Search Console Performance > Pages raporundan cikar.
- Hic impression almayan URL'lerde title/meta ve sayfa intro niyetini yeniden oku.
- Matematik, egitim, yasam ve insaat kategori hub'larinda en dusuk link alan sayfalari one cikar.

### Gun 14

- Crawled not indexed kalanlari yeniden guclendir: kategori hub metni, related calculator eslesmesi ve rehber ic linkleri.
- Kategori hub iceriklerini genislet; ozellikle finansal-hesaplamalar, maas-ve-vergi, matematik-hesaplama, sinav-hesaplamalari, yasam-hesaplama ve insaat-muhendislik.
- Batch 4 ve Batch 5 icin URL Inspection tamamla.

### Gun 30

- Search Console query/page raporu cikar.
- Impression alan ama CTR dusuk sayfalarda title/meta testleri yap.
- Hic impression almayan ama indexlenen sayfalarda dahili link ve kategori hub konumunu iyilestir.
- Crawled not indexed devam eden sayfalarda icerik benzersizligi, hesaplama ornegi ve SSS cevaplarini yenile.

## Manuel URL Inspection Onceligi

${entries.slice(0, 40).map((entry) => `- ${entry.url}`).join("\n")}
`;
}

async function main() {
    const masterEntries = buildMasterEntries();
    const sitemapResponse = await fetchText(`${SITE_URL}/sitemap.xml`, "follow");
    const sitemapUrls = parseSitemapUrls(sitemapResponse.text);
    const liveChecks = await buildLiveChecks(masterEntries, sitemapUrls);
    const linkChecks = buildLinkChecks(masterEntries);
    const aliasChecks = await buildAliasChecks(sitemapUrls);

    writeFileSync(
        join(process.cwd(), "reports/google-indexing-master-list.csv"),
        buildCsv(masterEntries, liveChecks, linkChecks),
        "utf8"
    );
    writeFileSync(
        join(process.cwd(), "reports/google-indexing-master-list.md"),
        buildMasterMarkdown(masterEntries, liveChecks, linkChecks, sitemapUrls.size),
        "utf8"
    );
    writeFileSync(
        join(process.cwd(), "reports/google-indexing-do-not-submit.md"),
        buildDoNotSubmitMarkdown(aliasChecks),
        "utf8"
    );
    writeFileSync(
        join(process.cwd(), "reports/google-indexing-diagnostics.md"),
        buildDiagnosticsMarkdown(masterEntries, liveChecks, linkChecks),
        "utf8"
    );
    writeFileSync(
        join(process.cwd(), "reports/internal-link-audit.md"),
        buildInternalLinkAuditMarkdown(masterEntries, linkChecks),
        "utf8"
    );
    writeFileSync(
        join(process.cwd(), "reports/google-organic-recovery-plan.md"),
        buildRecoveryPlanMarkdown(masterEntries),
        "utf8"
    );

    const liveSummary = summarizeLive(masterEntries, liveChecks);
    const aliasDoNotSubmit = aliasChecks.length;
    const weakNew = masterEntries
        .filter((entry) => entry.type === "new-canonical")
        .filter((entry) => {
            const links = linkChecks.get(normalizeUrl(entry.url));
            return !links || links.internalLinkCount < 3 || !links.linkedFromHome || !links.linkedFromTumAraclar || !links.linkedFromCategoryHub;
        }).length;

    console.log(JSON.stringify({
        masterUrls: masterEntries.length,
        newCanonical: masterEntries.filter((entry) => entry.type === "new-canonical").length,
        seoUpdatedUnique: masterEntries.filter((entry) => entry.type === "seo-updated-existing").length,
        sitemapUrls: sitemapUrls.size,
        http200: liveSummary.http200,
        inSitemap: liveSummary.inSitemap,
        canonicalOk: liveSummary.canonicalOk,
        titleOk: liveSummary.titleOk,
        metaOk: liveSummary.metaOk,
        contentOk: liveSummary.contentOk,
        faqOk: liveSummary.faqOk,
        doNotSubmitAliases: aliasDoNotSubmit,
        weakNewCanonical: weakNew,
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
