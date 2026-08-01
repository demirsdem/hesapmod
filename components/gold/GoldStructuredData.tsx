import type { GoldLongTailPageConfig } from "@/lib/gold/goldLongTailPages";
import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import { buildGoldStructuredData, serializeGoldJsonLd } from "@/lib/gold/goldStructuredData";

export default function GoldStructuredData({
    cache,
    page,
}: {
    cache: GoldPriceCache | null;
    page?: GoldLongTailPageConfig;
}) {
    return (
        <>
            {buildGoldStructuredData(cache, page).map((schema, index) => (
                <script
                    key={`gold-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeGoldJsonLd(schema) }}
                />
            ))}
        </>
    );
}
