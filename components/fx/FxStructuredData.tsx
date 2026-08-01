import type { FxLongTailPageConfig } from "@/lib/fx/fxLongTailPages";
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

export default function FxStructuredData({
    cache,
    page,
}: {
    cache: FxRateCache | null;
    page?: FxLongTailPageConfig;
}) {
    return (
        <>
            {buildFxStructuredData(cache, page).map((schema, index) => (
                <script
                    key={`fx-schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
                />
            ))}
        </>
    );
}
