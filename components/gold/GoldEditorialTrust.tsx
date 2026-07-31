import type { GoldPriceCache } from "@/lib/gold/goldPriceTypes";
import { formatGoldDate } from "@/lib/gold/goldCalculations";
import { GOLD_EDITORIAL_REVIEW_DATE } from "@/lib/gold/goldSeoContent";

export default function GoldEditorialTrust({ cache }: { cache: GoldPriceCache | null }) {
    return (
        <section aria-labelledby="editorial-trust" className="rounded-lg border border-amber-200 bg-[#FFF8E7] p-5 shadow-sm sm:p-6">
            <h2 id="editorial-trust" className="text-2xl font-black tracking-tight text-slate-950">
                Hesaplama Yöntemi, Kaynaklar ve Editoryal Güvence
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-800">
                <p>
                    Bu araç, güncel has altın alış/satış fiyatları, seçilen altın türünün has altın içeriği, ayar oranı ve alış-satış makası dikkate alınarak yaklaşık TL değeri hesaplar.
                </p>
                <p>
                    Gösterilen sonuçlar bilgilendirme amaçlıdır. İşlem yapmadan önce banka veya kuyumcu fiyatını kontrol ediniz. Bu sayfa yatırım tavsiyesi içermez.
                </p>
                <p>Piyasa, banka ve kuyumcu fiyatları farklılık gösterebilir.</p>
            </div>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                    <dt className="text-xs font-bold text-slate-500">Son fiyat güncellemesi</dt>
                    <dd className="mt-1 text-sm font-black text-slate-950">{cache ? formatGoldDate(cache.updatedAt) : "Fiyat yok"}</dd>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                    <dt className="text-xs font-bold text-slate-500">Veri kaynağı</dt>
                    <dd className="mt-1 text-sm font-black text-slate-950">{cache?.sourceName ?? "Yok"}</dd>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                    <dt className="text-xs font-bold text-slate-500">Veri durumu</dt>
                    <dd className="mt-1 text-sm font-black text-slate-950">{cache?.sourceStatus ?? "unavailable"}</dd>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                    <dt className="text-xs font-bold text-slate-500">Son editoryal kontrol</dt>
                    <dd className="mt-1 text-sm font-black text-slate-950">{GOLD_EDITORIAL_REVIEW_DATE}</dd>
                </div>
            </dl>
            <p className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold leading-6 text-slate-800">
                Formül: altın değeri = has altın gramı x güncel gram altın fiyatı. Alıyorum modunda satış fiyatı, satıyorum/bozduruyorum modunda alış fiyatı kullanılır.
            </p>
        </section>
    );
}
