import { loadEnvConfig } from "@next/env";
import {
    buildIndexNowUrlList,
    getIndexNowKeyFromEnv,
    getPriorityIndexNowUrls,
    submitIndexNowUrls,
} from "../lib/indexnow";
import { buildSitemapEntries } from "../lib/sitemap-data";

function getOptionalPositiveInteger(value: string | undefined) {
    if (!value) {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
}

async function main() {
    loadEnvConfig(process.cwd());

    const sitemapEntries = buildSitemapEntries();
    const indexNowKey = getIndexNowKeyFromEnv(process.env);
    const requestTimeoutMs = getOptionalPositiveInteger(process.env.INDEXNOW_TIMEOUT_MS);

    console.log(`Sitemap currently exposes ${sitemapEntries.length} URLs.`);
    console.log("Google icin otomatik IndexNow entegrasyonu yoktur; Google tarafinda sitemap + Search Console URL Inspection akisina devam edilmelidir.");

    if (!indexNowKey) {
        console.log("IndexNow atlandi: INDEXNOW_KEY tanimli degil.");
        console.log("Manuel Google öncelik listesi:");
        getPriorityIndexNowUrls().forEach((url) => console.log(`- ${url}`));
        return;
    }

    const urls = buildIndexNowUrlList(sitemapEntries);
    const result = await submitIndexNowUrls(urls, { key: indexNowKey, requestTimeoutMs });

    console.log(
        `IndexNow tamamlandi: ${result.submittedUrlCount} URL, ${result.batches} batch, durum=${result.success ? "basarili" : "kismi-hata"}.`
    );
    console.log("Manuel Google öncelik listesi:");
    getPriorityIndexNowUrls().forEach((url) => console.log(`- ${url}`));
}

void main().catch((error) => {
    console.error("Indexing submit adimi basarisiz oldu.");
    console.error(error);
    process.exitCode = 1;
});
