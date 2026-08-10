import Link from "next/link";
import Script from "next/script";

const linkClass = "text-[#CC4A1A] hover:text-[#E55A26] underline underline-offset-4";

const faqItems = [
    {
        question: "HesapMod ücretsiz mi?",
        answer: "Evet. HesapMod'daki hesaplama araçlarını ücretsiz olarak kullanabilirsiniz.",
    },
    {
        question: "Hangi hesaplama araçları var?",
        answer: "HesapMod'da sınav, finans, maaş, vergi, tarih, sağlık, yaşam, inşaat, matematik ve günlük hesaplamalar için yüzlerce araç bulunur.",
    },
    {
        question: "Hesaplama sonuçları kesin mi?",
        answer: "Sonuçlar girilen değerlere ve kullanılan formüle göre hesaplanır. Vergi, finans, sağlık, sınav ve inşaat gibi alanlarda sonuçlar bilgilendirme amaçlıdır; kesin işlem için resmi kaynak veya uzman kontrolü gerekir.",
    },
    {
        question: "Girdiğim bilgiler kaydediliyor mu?",
        answer: "HesapMod gizlilik odaklı çalışır. Birçok hesaplama tarayıcı üzerinde yapılır ve gereksiz kişisel veri saklanmaz.",
    },
    {
        question: "Sınav hesaplama araçları resmi puan verir mi?",
        answer: "Hayır. Sınav araçları net, puan veya başarı tahmini sunar. Nihai puanlar ilgili kurumların yayımladığı kılavuz ve değerlendirme yöntemlerine göre belirlenir.",
    },
    {
        question: "Finansal hesaplamalar yatırım tavsiyesi midir?",
        answer: "Hayır. Finansal araçlar yalnızca bilgilendirme ve ön analiz içindir. Yatırım kararı için profesyonel danışmanlık alınmalıdır.",
    },
    {
        question: "Vergi ve mevzuat hesaplamaları güncel mi?",
        answer: "Vergi ve mevzuata bağlı araçlar düzenli olarak gözden geçirilir. Ancak oranlar değişebileceği için işlem öncesinde resmi kaynaklar kontrol edilmelidir.",
    },
    {
        question: "İnşaat hesaplamaları proje yerine geçer mi?",
        answer: "Hayır. Beton, demir, tuğla, metreküp gibi araçlar ön keşif ve tahmin amacı taşır. Kesin uygulama için proje ve uzman kontrolü gerekir.",
    },
    {
        question: "Aradığım hesaplama aracını nasıl bulurum?",
        answer: "Ana sayfadaki arama alanını, kategori kartlarını veya öne çıkan hesaplama listelerini kullanarak aradığınız araca hızlıca ulaşabilirsiniz.",
    },
    {
        question: "Yeni hesaplama aracı önerebilir miyim?",
        answer: "Evet. İhtiyaç duyduğunuz hesaplama türlerini iletişim veya geri bildirim kanallarından iletebilirsiniz.",
    },
];

export default function HomeSEOContent() {
    return (
        <section className="max-w-5xl mx-auto px-5 py-14 text-slate-600 md:py-16">
            <div className="mb-10 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    HesapMod ile Hangi Hesaplamaları Yapabilirsiniz?
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                    Türkiye&apos;de sık ihtiyaç duyulan hesaplamalar çoğu zaman dağınık durur: bir kısmı güncelliğini yitirmiş tablolarda, bir kısmı TL, KDV veya SGK yapısını hesaba katmayan yabancı araçlarda kalır. HesapMod bu hesapları tek yerde toplar; her araçta kullanılan formülü ve varsayımları görünür kılar, mevzuata bağlı olanları değişiklik oldukça gözden geçirir.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Sınav ve Eğitim Hesaplamaları</h3>
                    <p className="mt-2 text-sm leading-7">
                        <Link href="/sinav-hesaplamalari/ales-puan-hesaplama" className={linkClass}>ALES</Link>
                        , <Link href="/sinav-hesaplamalari/kpss-puan-hesaplama" className={linkClass}>KPSS</Link>
                        , <Link href="/sinav-hesaplamalari/yks-puan-hesaplama" className={linkClass}>YKS</Link>
                        , <Link href="/sinav-hesaplamalari/tyt-puan-hesaplama" className={linkClass}>TYT</Link>
                        , <Link href="/sinav-hesaplamalari/lgs-puan-hesaplama" className={linkClass}>LGS puan</Link>
                        , <Link href="/sinav-hesaplamalari/lise-taban-puanlari" className={linkClass}>lise taban puanları</Link>
                        , <Link href="/sinav-hesaplamalari/takdir-tesekkur-hesaplama" className={linkClass}>takdir teşekkür</Link>
                        {" "}ve <Link href="/sinav-hesaplamalari/test-basari-orani" className={linkClass}>test başarı oranı</Link>
                        {" "}gibi araçlarla net, puan ve başarı durumunuzu hızlıca hesaplayabilirsiniz. Sınav puanları ilgili kurumların kılavuzlarına göre değişebileceği için sonuçlar bilgilendirme amaçlıdır.
                    </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Finans, Eurobond ve Kredi Hesaplamaları</h3>
                    <p className="mt-2 text-sm leading-7">
                        <Link href="/finansal-hesaplamalar/eurobond-hesaplama" className={linkClass}>Eurobond getirisi</Link>
                        , <Link href="/finansal-hesaplamalar/bono-hesaplama" className={linkClass}>bono</Link>
                        , <Link href="/finansal-hesaplamalar/kredi-karti-gecikme-faizi-hesaplama" className={linkClass}>kredi kartı faizi</Link>
                        , <Link href="/finansal-hesaplamalar/kredi-taksit-hesaplama" className={linkClass}>kredi taksiti</Link>
                        , <Link href="/finansal-hesaplamalar/kdv-hesaplama" className={linkClass}>KDV</Link>
                        {" "}ve benzeri finansal hesaplamalarda yaklaşık maliyeti veya getiriyi görebilirsiniz. Finansal sonuçlar yatırım tavsiyesi değildir.
                    </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Maaş, Vergi ve Resmi İşlem Hesaplamaları</h3>
                    <p className="mt-2 text-sm leading-7">
                        <Link href="/maas-ve-vergi/maas-hesaplama" className={linkClass}>Maaş</Link>
                        , <Link href="/finansal-hesaplamalar/kdv-hesaplama" className={linkClass}>KDV</Link>
                        , <Link href="/maas-ve-vergi/gumruk-vergisi-hesaplama" className={linkClass}>gümrük vergisi</Link>
                        , <Link href="/muhasebe/yillik-izin-ucreti-hesaplama" className={linkClass}>yıllık izin ücreti</Link>
                        , <Link href="/hukuk/icra-masrafi-hesaplama" className={linkClass}>icra masrafı</Link>
                        {" "}ve benzeri araçlarda güncel formül ve varsayımlarla yaklaşık hesaplama yapabilirsiniz. Mevzuata bağlı işlemler için resmi kaynak kontrol edilmelidir.
                    </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Tarih, Yaş ve Gün Hesaplamaları</h3>
                    <p className="mt-2 text-sm leading-7">
                        <Link href="/zaman-hesaplama/kac-gun-oldu-hesaplama" className={linkClass}>Kaç gün oldu</Link>
                        , <Link href="/zaman-hesaplama/iki-tarih-arasi-fark-gun-hesaplama" className={linkClass}>iki tarih arası fark</Link>
                        , <Link href="/zaman-hesaplama/doguma-kalan-gun" className={linkClass}>doğuma kalan gün</Link>
                        , <Link href="/zaman-hesaplama/yas-hesaplama" className={linkClass}>yaş</Link>
                        {" "}ve <Link href="/zaman-hesaplama/kac-gun-kaldi-hesaplama" className={linkClass}>kaç gün kaldı</Link>
                        {" "}hesaplamalarıyla günlük ihtiyaçlarınızı hızlıca çözebilirsiniz.
                    </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Sağlık, Yaşam ve Aktivite Hesaplamaları</h3>
                    <p className="mt-2 text-sm leading-7">
                        <Link href="/yasam-hesaplama/gunluk-su-ihtiyaci-hesaplama" className={linkClass}>Günlük su ihtiyacı</Link>
                        , <Link href="/yasam-hesaplama/adim-mesafe-hesaplama" className={linkClass}>adım-mesafe</Link>
                        , <Link href="/yasam-hesaplama/kas-kutlesi-hesaplama" className={linkClass}>kas kütlesi</Link>
                        , <Link href="/yasam-hesaplama/kalori-yakma-hesaplama" className={linkClass}>kalori</Link>
                        {" "}ve benzeri araçlar kişisel takip için yaklaşık sonuçlar sunar; tıbbi tavsiye yerine geçmez.
                    </p>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">İnşaat, Metreküp ve Malzeme Hesaplamaları</h3>
                    <p className="mt-2 text-sm leading-7">
                        <Link href="/insaat-muhendislik/metrekup-hesaplama" className={linkClass}>Metreküp</Link>
                        , <Link href="/matematik-hesaplama/hacim-hesaplama" className={linkClass}>hacim</Link>
                        , <Link href="/insaat-muhendislik/tugla-hesaplama" className={linkClass}>tuğla</Link>
                        , <Link href="/insaat-muhendislik/beton-hesaplama" className={linkClass}>beton</Link>
                        , <Link href="/insaat-muhendislik/demir-hesaplama" className={linkClass}>demir</Link>
                        , <Link href="/insaat-muhendislik/merdiven-hesaplama" className={linkClass}>merdiven</Link>
                        {" "}ve <Link href="/insaat-muhendislik/cimento-hesaplama" className={linkClass}>çimento</Link>
                        {" "}gibi araçlarla ön keşif ve malzeme tahmini yapabilirsiniz. Kesin proje ve uygulama için uzman kontrolü gerekir.
                    </p>
                </article>
            </div>

            <div className="mt-14 border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Sık Sorulan Sorular</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {faqItems.map((item) => (
                        <div key={item.question} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-semibold text-slate-900 mb-2">{item.question}</h3>
                            <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqItems.map((item) => ({
                        "@type": "Question",
                        "name": item.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.answer,
                        },
                    })),
                }),
            }} />
        </section>
    );
}
