import { buildSitemapEntries } from "@/lib/sitemap-data";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return buildSitemapEntries();
}
