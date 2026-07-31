import type { FxRateCache } from "@/lib/fx/fxPriceTypes";
import { formatRate } from "@/lib/fx/fxCalculations";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export default function FxRateTicker({ cache }: { cache: FxRateCache | null }) {
    if (!cache) {
        return (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                Döviz kurları geçici olarak alınamıyor. İşlem yapmadan önce banka, döviz bürosu veya kurumunuzun güncel kurunu kontrol ediniz.
            </section>
        );
    }

    const statusLabel = cache.sourceStatus === "live" ? "CANLI PİYASA" : "SON BİLİNEN VERİ";

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label="Canlı döviz kuru özeti">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">{statusLabel}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                        Son güncelleme: <strong>{formatDate(cache.updatedAt)}</strong> · Kaynak: <strong>{cache.sourceName}</strong>
                    </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                    {(["USD", "EUR", "GBP"] as const).map((code) => (
                        <div key={code} className="min-w-[178px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-xs font-black text-slate-500">{code}/TRY</p>
                            <p className="mt-1 text-sm font-black tabular-nums text-slate-950">
                                Alış {formatRate(cache.rates[code].buy)} · Satış {formatRate(cache.rates[code].sell)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-600">
                Bilgilendirme amaçlıdır. İşlem yapmadan önce banka, döviz bürosu veya kurumunuzun güncel kurunu kontrol ediniz.
                {cache.sourceStatus !== "live" ? " Son başarılı veri gösteriliyor; güncel işlem kurları kuruma göre değişebilir." : ""}
            </p>
        </section>
    );
}
