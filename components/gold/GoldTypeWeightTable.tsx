import { GOLD_TYPE_INFO, GOLD_TYPE_ORDER, formatGram } from "@/lib/gold/goldCalculations";

export default function GoldTypeWeightTable() {
    return (
        <section aria-labelledby="altin-turleri-agirlik" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="altin-turleri-agirlik" className="text-2xl font-black tracking-tight text-slate-950">
                Altın Türleri: Has Altın İçeriği ve Ağırlık Tablosu
            </h2>
            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
                            <th className="min-w-[190px] px-3 py-3 font-black">Altın Türü</th>
                            <th className="px-3 py-3 font-black">Ayar</th>
                            <th className="min-w-[130px] px-3 py-3 font-black">Toplam Ağırlık</th>
                            <th className="min-w-[120px] px-3 py-3 font-black">Has Altın</th>
                            <th className="min-w-[100px] px-3 py-3 font-black">Alaşım</th>
                        </tr>
                    </thead>
                    <tbody>
                        {GOLD_TYPE_ORDER.filter((type) => type !== "hasAltin").map((type) => {
                            const info = GOLD_TYPE_INFO[type];
                            return (
                                <tr key={type} className="border-b border-slate-100 last:border-0">
                                    <td className="px-3 py-3 font-bold text-slate-950">{info.name}</td>
                                    <td className="px-3 py-3 font-semibold text-slate-700">{info.karat}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums text-slate-700">{formatGram(info.totalWeight)}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums text-slate-700">{formatGram(info.pureGold)}</td>
                                    <td className="px-3 py-3 font-semibold tabular-nums text-slate-700">{formatGram(info.alloy)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
                Ağırlıklar ve has altın değerleri piyasada yaygın kullanılan yaklaşık değerlerdir. Ürün, basım yılı ve piyasa koşullarına göre küçük farklar oluşabilir.
            </p>
        </section>
    );
}
