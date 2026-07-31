import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import { formatGoldDate, formatTRY } from "@/lib/gold/goldCalculations";

function statusLabel(cache: GoldPriceCache | null) {
    if (!cache) return "FIYAT GECICI OLARAK ALINAMIYOR";
    if (cache.sourceStatus === "live") return "CANLI PIYASA";
    if (cache.sourceStatus === "cache") return "SON BILINEN VERI";
    if (cache.sourceStatus === "fallback") return "YEDEK VERI";
    return "FIYAT GECICI OLARAK ALINAMIYOR";
}

export default function GoldPriceTicker({ cache }: { cache: GoldPriceCache | null }) {
    if (!cache) {
        return (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                Fiyat geçici olarak alınamıyor. Hesaplayıcı manuel girişle çalışır; işlem yapmadan önce banka veya kuyumcu fiyatını kontrol ediniz.
            </section>
        );
    }

    const hasAltin = cache.prices.hasAltin;
    const gram24k = cache.prices.gram24k;

    return (
        <section aria-label="Altın fiyat durumu" className="rounded-lg border border-amber-200 bg-[#FFF8E7] p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#9F3A12]">{statusLabel(cache)}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                        Bilgilendirme amaçlıdır. İşlem yapmadan önce banka veya kuyumcu fiyatını kontrol ediniz.
                    </p>
                    {cache.sourceStatus !== "live" && (
                        <p className="mt-1 text-xs font-semibold leading-5 text-amber-900">
                            Son başarılı veri gösteriliyor. Güncel işlem fiyatları banka ve kuyumcuya göre değişebilir.
                        </p>
                    )}
                </div>
                <dl className="grid min-w-0 gap-3 sm:grid-cols-2 lg:min-w-[560px]">
                    <div className="rounded-lg border border-amber-200 bg-white px-4 py-3">
                        <dt className="text-xs font-bold text-slate-500">Has altın alış / satış</dt>
                        <dd className="mt-1 whitespace-nowrap text-lg font-black tabular-nums text-slate-950">
                            {formatTRY(hasAltin.buy)} / {formatTRY(hasAltin.sell)}
                        </dd>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-white px-4 py-3">
                        <dt className="text-xs font-bold text-slate-500">Gram 24 ayar alış / satış</dt>
                        <dd className="mt-1 whitespace-nowrap text-lg font-black tabular-nums text-slate-950">
                            {formatTRY(gram24k.buy)} / {formatTRY(gram24k.sell)}
                        </dd>
                    </div>
                </dl>
            </div>
            <p className="mt-4 text-xs font-semibold leading-5 text-slate-600">
                Son güncelleme: <time dateTime={cache.updatedAt}>{formatGoldDate(cache.updatedAt)}</time> · Veri kaynağı: {cache.sourceName} · Durum: {cache.sourceStatus}
            </p>
        </section>
    );
}
