import type { FxRateCache } from "@/lib/fx/fxPriceTypes";
import { FX_LAST_REVIEWED } from "@/lib/fx/fxSeoContent";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export default function FxEditorialTrust({ cache }: { cache: FxRateCache | null }) {
    return (
        <section aria-labelledby="editorial-trust" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="editorial-trust" className="text-2xl font-black tracking-tight text-slate-950">Hesaplama Yöntemi, Kaynaklar ve Editoryal Güvence</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                <p>
                    Bu araç, güncel döviz alış/satış kurları, seçilen işlem yönü, alış-satış makası ve varsa kambiyo vergisi/BSMV oranı dikkate alınarak yaklaşık TL veya döviz karşılığı hesaplar.
                </p>
                <p>
                    Gösterilen sonuçlar bilgilendirme amaçlıdır. İşlem yapmadan önce banka, döviz bürosu veya ilgili kurumun güncel kurunu kontrol ediniz. Bu sayfa yatırım tavsiyesi içermez.
                </p>
                <p>TCMB, banka, döviz bürosu ve serbest piyasa kurları farklılık gösterebilir.</p>
                <dl className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-xs font-black text-slate-500">Son kur güncellemesi</dt>
                        <dd className="font-bold text-slate-900">{cache ? formatDate(cache.updatedAt) : "Veri alınamadı"}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-black text-slate-500">Veri kaynağı</dt>
                        <dd className="font-bold text-slate-900">{cache?.sourceName ?? "Geçici olarak kullanılamıyor"}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-black text-slate-500">Veri durumu</dt>
                        <dd className="font-bold text-slate-900">{cache?.sourceStatus ?? "unavailable"}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-black text-slate-500">Son editoryal kontrol</dt>
                        <dd className="font-bold text-slate-900">{FX_LAST_REVIEWED}</dd>
                    </div>
                </dl>
                <p>
                    Formüller: dövizden TL'ye = miktar x ilgili kur; TL'den dövize = TL tutarı / satış kuru; makas = satış kuru - alış kuru; BSMV dahil toplam = işlem tutarı + yaklaşık BSMV.
                </p>
                <p>
                    Döviz alım işlemlerinde uygulanabilecek kambiyo vergisi/BSMV oranı mevzuata, işlem türüne, kuruma ve muafiyet durumuna göre değişebilir. İşlem öncesinde bankanızın ve resmi mevzuatın güncel oranlarını kontrol ediniz.
                </p>
            </div>
        </section>
    );
}
