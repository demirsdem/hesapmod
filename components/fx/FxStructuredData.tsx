import type { FxRateCache } from "@/lib/fx/fxPriceTypes";
import { buildFxStructuredData } from "@/lib/fx/fxStructuredData";

function serializeJsonLd(data: Record<string, unknown>) {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

export default function FxStructuredData({ cache }: { cache: FxRateCache | null }) {
    return (
        <>
            {buildFxStructuredData(cache).map((schema, index) => (
                <script
                    key={`fx-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
                />
            ))}
        </>
    );
}
