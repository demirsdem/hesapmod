import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import { buildGoldStructuredData, serializeGoldJsonLd } from "@/lib/gold/goldStructuredData";

export default function GoldStructuredData({ cache }: { cache: GoldPriceCache | null }) {
    return (
        <>
            {buildGoldStructuredData(cache).map((schema, index) => (
                <script
                    key={`gold-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeGoldJsonLd(schema) }}
                />
            ))}
        </>
    );
}
