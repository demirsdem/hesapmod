import type { Metadata, Viewport } from "next";
import Link from "next/link";
import EditorialQualityBlock from "@/components/calculator/EditorialQualityBlock";
import { findCalculatorBySlug } from "@/lib/calculators";
import { getCalculatorTrustInfo } from "@/lib/calculator-trust";
import { SITE_URL } from "@/lib/site";
import AdSlot from "./components/AdSlot";
import TakdirFaq from "./components/TakdirFaq";
import TakdirCalculatorLoader from "./components/TakdirCalculatorLoader";
import { pagePath, pageUrl, takdirFaqItems, takdirSchemas } from "./schema";

const title = "Takdir Teşekkür Hesaplama 2026 | e-Okul Uyumlu";
const description =
    "MEB güncel müfredatına göre 5, 6, 7, 8. sınıf ortaokul ve 9, 10, 11, 12. sınıf lise e-okul not ortalaması ile takdir teşekkür belgesi hesaplayın. Zayıf ders ve devamsızlık kontrolü dahil.";

export const revalidate = 604800;

export const viewport: Viewport = {
    themeColor: "#FF6B35",
};

export const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: {
        canonical: pagePath,
        languages: {
            tr: pagePath,
        },
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title,
        description,
        url: pageUrl,
        type: "website",
        locale: "tr_TR",
        images: [
            {
                url: `${SITE_URL}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "Takdir Teşekkür Hesaplama",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description:
            "Takdir veya teşekkür belgenizi hesaplayın. Zayıf ders ve devamsızlık kontrolü MEB kurallarına göre otomatik yapılır.",
        images: [`${SITE_URL}/og-image.jpg`],
    },
};

const relatedSlugs = [
    "e-okul-not-hesaplama",
    "lise-ortalama-hesaplama",
    "lise-sinif-gecme-hesaplama",
    "ders-notu-hesaplama",
];

function RelatedCalculators() {
    const calculators = relatedSlugs.map((slug) => findCalculatorBySlug(slug)).filter(Boolean);

    return (
        <section aria-labelledby="related-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">İlgili araçlar</p>
                    <h2 id="related-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                        İlgili Hesaplama Araçları
                    </h2>
                </div>
                <Link href="/kategori/sinav-hesaplamalari" className="text-sm font-black text-[#B84418] hover:text-[#9F3A12]">
                    Sınav hesaplamaları
                </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {calculators.map((calculator) => (
                    <Link
                        key={calculator!.slug}
                        href={`/${calculator!.category}/${calculator!.slug}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-white"
                    >
                        <h3 className="text-base font-black text-slate-950">{calculator!.name.tr}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                            {calculator!.shortDescription?.tr ?? calculator!.description.tr}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function TakdirTesekkurPage() {
    const trustInfo = getCalculatorTrustInfo("takdir-tesekkur-hesaplama", "sinav-hesaplamalari");

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <script type="application/ld+json">{JSON.stringify(takdirSchemas)}</script>

            <nav aria-label="Gezinti izi" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Link href="/" className="font-semibold transition hover:text-[#B84418]">
                    Ana Sayfa
                </Link>
                <span aria-hidden="true">›</span>
                <Link href="/kategori/sinav-hesaplamalari" className="font-semibold transition hover:text-[#B84418]">
                    Sınav Hesaplamaları
                </Link>
                <span aria-hidden="true">›</span>
                <span className="font-semibold text-slate-950">Takdir Teşekkür Hesaplama</span>
            </nav>

            <header className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-wide text-[#B84418]">Son Güncelleme: Mart 2026</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Takdir Teşekkür Hesaplama - e-Okul Uyumlu Ağırlıklı Ortalama
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                    Ders notu, haftalık ders saati, özürsüz devamsızlık ve kınama cezası bilgilerini girin; MEB belge
                    şartlarına göre takdir, teşekkür veya belge engelini anında görün.
                </p>
            </header>

            <AdSlot id="ad-top" minHeight={90} />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
                <main className="space-y-8">
                    <TakdirCalculatorLoader />

                    <AdSlot id="ad-mid" minHeight={250} />

                    <section aria-labelledby="how-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="how-heading" className="text-2xl font-black tracking-tight text-slate-950">
                            Takdir Teşekkür Nasıl Hesaplanır?
                        </h2>
                        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                            <p>
                                Takdir teşekkür hesaplama işleminin temelinde ağırlıklı not ortalaması vardır. Her dersin
                                dönem puanı, haftalık ders saatiyle çarpılır; çıkan değerler toplanır ve toplam haftalık
                                ders saatine bölünür. Bu nedenle 6 saatlik Matematik dersi ile 2 saatlik bir seçmeli dersin
                                ortalamaya etkisi aynı değildir. Araç, kullanıcıya yalnız ortalama değerini değil, aynı
                                zamanda belge almaya engel olabilecek zayıf ders, özürsüz devamsızlık ve kınama cezası
                                durumlarını da gösterir. Böylece e-Okul not ortalaması yüksek görünse bile neden belge
                                alınamayacağını açık biçimde anlayabilirsiniz.
                            </p>
                            <p>
                                Ortaokul ve lise için belge bandı genel olarak aynıdır: 70,00-84,99 arası teşekkür, 85,00
                                ve üzeri takdir bandıdır. Ancak bu bant tek başına yeterli kabul edilmez; tüm derslerden
                                başarılı olmak, özürsüz devamsızlığı 5 günü aşmamak ve kınama veya daha ağır disiplin
                                cezası almamış olmak gerekir. Lise öğrencileri için bazı okullarda Türk Dili ve Edebiyatı
                                veya Matematik gibi derslerde okul içi ek değerlendirme koşulları bulunabileceğinden,
                                sonuç resmi karar öncesi rehberlik kontrolüyle birlikte okunmalıdır.
                            </p>
                            <h3 className="text-xl font-black text-slate-950">Ağırlıklı Ortalama Formülü</h3>
                            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800">
                                Ağırlıklı Ortalama = (Ders Notu x Haftalık Saat toplamı) / Toplam Haftalık Ders Saati.
                                Örnek: Matematik 90 x 6, Türkçe 85 x 5 ve Fen 80 x 4 ise toplam ağırlık 1285, toplam saat
                                15, ortalama 85,67 olur.
                            </p>
                            <h3 className="text-xl font-black text-slate-950">Örnek Hesaplama Senaryoları</h3>
                            <p>
                                Bir ortaokul öğrencisinin tüm dersleri 50 ve üzeri, devamsızlığı 2 gün ve ağırlıklı
                                ortalaması 86,40 ise takdir belgesi alabilir. Aynı öğrencinin Matematik notu 48 olsaydı,
                                ortalaması 86 üzerinde kalsa bile zayıf ders nedeniyle belge alamazdı. Lise tarafında
                                ortalaması 78,20 olan, zayıfı ve devamsızlık engeli bulunmayan bir öğrenci teşekkür bandına
                                girer. Buna karşılık ortalaması 88,10 olan fakat 6 gün özürsüz devamsızlığı bulunan bir
                                öğrenci için araç "ortalama tamam ama belge yok" sonucunu verir. Ortalama 65,00 olan bir
                                öğrencide ise önce teşekkür barajına kaç puan kaldığı gösterilir.
                            </p>
                        </div>
                    </section>

                    <section aria-labelledby="rules-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="rules-heading" className="text-2xl font-black tracking-tight text-slate-950">
                            Takdir ve Teşekkür Belgesi Alma Şartları (2026)
                        </h2>
                        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                            <p>
                                Belge alma şartları öğrencinin yalnız akademik puanına bakılarak değerlendirilmez. Dönem
                                notlarının ağırlıklı ortalaması 70,00 ve üzerindeyse öğrenci belge bandına yaklaşır; fakat
                                herhangi bir dersten 50 altı dönem puanı varsa, özürsüz devamsızlık 5 günü aşmışsa veya
                                kınama cezası işaretlenmişse sonuç olumsuz olur. HesapMod bu üç engeli aynı anda listeler;
                                örneğin hem zayıf ders hem devamsızlık varsa kullanıcı tek bir genel uyarı yerine tüm
                                nedenleri ayrı ayrı görür.
                            </p>
                            <p>
                                Dönem sonu sınav notu ile yılsonu notu karıştırılmamalıdır. Yazılı sınav notu tek bir
                                ölçümken dönem puanı; yazılı, sözlü, proje ve performans değerlendirmelerinin okul
                                sisteminde oluşan sonucudur. Belge hesabında esas alınan değer bu dönem puanıdır. Yılsonu
                                başarı puanı ise iki dönem sonuçlarının ve sınıf geçme kurallarının daha geniş bir
                                özetidir. Belge planı yaparken dönem içi tek sınavı değil, dersin e-Okul'a yansıyan nihai
                                puanını kullanmak gerekir.
                            </p>
                        </div>
                    </section>

                    <section aria-labelledby="tips-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 id="tips-heading" className="text-2xl font-black tracking-tight text-slate-950">
                            Takdir Teşekkür İçin Not Ortalaması İpuçları
                        </h2>
                        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                            <p>
                                Ortalamanızı en çok etkileyen dersler genellikle haftalık saati yüksek olan derslerdir.
                                Matematik, Türkçe, Türk Dili ve Edebiyatı, Fen Bilimleri, yabancı dil veya meslek dersleri
                                okul türüne göre daha yüksek ağırlık taşıyabilir. Bu yüzden düşük saatli bir derste 5 puan
                                artış güzel görünse de ortalamayı sınırlı yükseltir; 5 veya 6 saatlik bir derste aynı artış
                                çok daha belirgin sonuç üretir. Araçtaki "en etkili ders" önerisi tam olarak bu ağırlık
                                farkını görünür kılar.
                            </p>
                            <p>
                                Takdir veya teşekkür belgesi öğrencinin akademik motivasyonunu artırabilir, okul içi ödül
                                süreçlerinde ve bazı burs başvurularında destekleyici belge olarak kullanılabilir. Yine de
                                belge hedefi tek başına öğrenmenin yerine geçmemelidir. Özellikle sınıf bazında sık yapılan
                                hata, yalnız genel ortalamaya odaklanıp 50 altındaki tek dersi gözden kaçırmaktır. Bir
                                diğer hata da devamsızlığı "ortalama iyi zaten" diye önemsememektir. Bu sayfa belge
                                planını hızlıca kontrol etmek için tasarlanmıştır; ayrıntılı ders takibi için{" "}
                                <Link href="/sinav-hesaplamalari/e-okul-not-hesaplama" className="font-bold text-blue-700 underline underline-offset-4">
                                    e-okul not ortalaması hesaplama
                                </Link>{" "}
                                ve{" "}
                                <Link href="/sinav-hesaplamalari/ders-notu-hesaplama" className="font-bold text-blue-700 underline underline-offset-4">
                                    ders notu hesaplama
                                </Link>{" "}
                                araçlarıyla birlikte kullanılması daha sağlıklı olur.
                            </p>
                            <p>
                                Lise öğrencileri ayrıca{" "}
                                <Link href="/sinav-hesaplamalari/lise-ortalama-hesaplama" className="font-bold text-blue-700 underline underline-offset-4">
                                    lise ortalama hesaplama
                                </Link>{" "}
                                ve{" "}
                                <Link href="/sinav-hesaplamalari/lise-sinif-gecme-hesaplama" className="font-bold text-blue-700 underline underline-offset-4">
                                    lise sınıf geçme hesaplama
                                </Link>{" "}
                                sayfalarından sınıf geçme riskini de kontrol edebilir. Belge almak olumlu bir gösterge olsa
                                da sınıf geçme, zayıf ders sayısı, sorumluluk sınavı ve okul türüne özel koşullar ayrı
                                başlıklardır.
                            </p>
                        </div>
                    </section>

                    <TakdirFaq items={takdirFaqItems} />
                    <AdSlot id="ad-bottom" minHeight={90} />
                    <RelatedCalculators />
                    <EditorialQualityBlock trustInfo={trustInfo} />
                </main>

                <aside className="space-y-4 lg:sticky lg:top-24">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-black text-slate-950">Kısa Özet</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                            <li><strong>Teşekkür:</strong> 70,00-84,99 arası.</li>
                            <li><strong>Takdir:</strong> 85,00 ve üzeri.</li>
                            <li><strong>Zayıf ders:</strong> 50 altı belgeyi engeller.</li>
                            <li><strong>Devamsızlık:</strong> Özürsüz 5 gün sınırdır.</li>
                            <li><strong>Gizlilik:</strong> Girdiler sunucuya gönderilmez.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
