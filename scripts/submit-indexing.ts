import { buildSitemapEntries } from "../lib/sitemap-data";

function main() {
    const sitemapEntries = buildSitemapEntries();

    console.log("Skipping Google Indexing API submission.");
    console.log(`Sitemap currently exposes ${sitemapEntries.length} URLs.`);
    console.log("Reason: Google Indexing API is reserved for JobPosting pages or livestream BroadcastEvent pages, not general calculators, category pages, or guides.");
    console.log("Recommended workflow: keep the sitemap submitted in Search Console and use the URL Inspection tool for urgent recrawl requests.");
}

main();
