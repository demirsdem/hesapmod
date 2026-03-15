import Link from "next/link";
import Script from "next/script";

export default function HomeSEOContent() {
    return (
        <section className="max-w-4xl mx-auto px-5 py-16 text-slate-600">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Online Hesaplama Araçları ile Hayatınızı Kolaylaştırın</h2>
            <div className="space-y-6 text-base leading-relaxed">
                <p>
                    Günlük yaşantımızda, finansal planlamalarımızda veya eğitim süreçlerimizde sürekli olarak matematiksel hesaplamalara ihtiyaç duyarız.
                    Ancak karmaşık formüller, faiz oranları veya vergi kesintileri gibi değişkenler, manuel olarak hesaplama yapmayı hem zorlaştırır hem de hata payını artırır.
                    İşte bu noktada devreye giren <strong>HesapMod ücretsiz online hesaplama araçları</strong>, zamandan tasarruf etmenizi ve en doğru sonuçlara anında ulaşmanızı sağlar.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Finans ve Kredi Hesaplamaları Neden Önemlidir?</h2>
                <p>
                    Ev almak, araç kredisi çekmek veya yatırım yapmak... Tüm bu kararlar ciddi finansal analizler gerektirir.
                    <span> </span>
                    <Link href="/finansal-hesaplamalar/kredi-taksit-hesaplama" className="text-[#CC4A1A] hover:text-[#E55A26] underline underline-offset-4">
                        Kredi faiz hesaplama
                    </Link>
                    <span> </span>
                    aracımız sayesinde aylık taksit tutarınızı, toplam geri ödemenizi ve faiz oranınızın maliyetinize olan etkisini şeffaf bir şekilde görebilirsiniz. Ayrıca, bireysel çalışanlar veya işletme sahipleri için netten brüte veya brütten nete maaş hesaplama ve
                    <span> </span>
                    <Link href="/finansal-hesaplamalar/kdv-hesaplama" className="text-[#CC4A1A] hover:text-[#E55A26] underline underline-offset-4">
                        KDV hesaplama
                    </Link>
                    <span> </span>
                    gibi araçlarımız ticari hayatın vazgeçilmez yardımcılarıdır.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Sağlık Kategorisinde Bilmeniz Gerekenler</h2>
                <p>
                    Sağlıklı bir yaşam sürdürmenin temeli, vücut kitle indeksinizi (VKİ), günlük kalori ihtiyacınızı veya gebelik sürecinizi doğru takip etmekten geçer. Sağlık kategorimizdeki
                    <span> </span>
                    <Link href="/yasam-hesaplama/vucut-kitle-indeksi-hesaplama" className="text-[#CC4A1A] hover:text-[#E55A26] underline underline-offset-4">
                        Boy Kilo Endeksi
                    </Link>
                    <span> </span>
                    hesaplama aracı ile ideal kilonuzu öğrenebilir,
                    <span> </span>
                    <Link href="/yasam-hesaplama/gebelik-hesaplama" className="text-[#CC4A1A] hover:text-[#E55A26] underline underline-offset-4">
                        Gebelik hesaplama
                    </Link>
                    <span> </span>
                    aracımızla ise anne adayları bebeklerinin gelişim sürecini tahmini doğum tarihine kadar güvenle takip edebilir.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Öğrenciler İçin Eğitim ve Sınav Araçları</h2>
                <p>
                    Türkiye'deki eğitim sistemi içerisinde YKS, LGS veya KPSS gibi sınavlar büyük bir öneme sahiptir. Öğrencilerin deneme sınavlarından sonra netlerini puana dönüştürebilmesi, hedeflerine ne kadar yaklaştıklarını görmeleri için kritik bir motivasyon kaynağıdır.
                    <span> </span>
                    <Link href="/sinav-hesaplamalari/yks-puan-hesaplama" className="text-[#CC4A1A] hover:text-[#E55A26] underline underline-offset-4">
                        YKS puan hesaplama
                    </Link>
                    <span> </span>
                    veya LGS hesaplama araçlarımız, ÖSYM ve MEB'in güncel katsayılarını baz alarak gerçeğe en yakın sonuçları üretir.
                </p>
            </div>

            <div className="mt-16 border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Sık Sorulan Sorular (SSS)</h2>

                <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">HesapMod üzerindeki araçlar ücretsiz mi?</h3>
                        <p className="text-slate-600">Evet, sitemizde yer alan finans, sağlık, matematik, astroloji ve vergi dâhil tüm online hesaplama araçları tamamen ücretsizdir. Kullanım sınırı bulunmamaktadır.</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Hesaplamalarınız güncel verilere dayanıyor mu?</h3>
                        <p className="text-slate-600">Kesinlikle. KDV, gelir vergisi, SGK dilimleri, asgari ücret tutarları veya ÖSYM sınav katsayıları gibi veriler düzenli olarak resmi gazetede veya kurum sitelerinde yayınlanan son mevzuatlara göre güncellenir.</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Girdiğim kişisel veriler kaydediliyor mu?</h3>
                        <p className="text-slate-600">Hayır, sitemizdeki tüm hesaplamalar tarayıcınız (browser) üzerinden anlık olarak gerçekleştirilir. Maaş bilginiz, sağlık veya sınav netleriniz sunucularımıza kaydedilmez ve tamamen güvenlidir. Gizlilik politikamıza %100 sadık kalınır.</p>
                    </div>
                </div>
            </div>

            <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "HesapMod üzerindeki araçlar ücretsiz mi?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Evet, sitemizde yer alan finans, sağlık, matematik, astroloji ve vergi dâhil tüm online hesaplama araçları tamamen ücretsizdir. Kullanım sınırı bulunmamaktadır."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Hesaplamalarınız güncel verilere dayanıyor mu?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Kesinlikle. KDV, gelir vergisi, SGK dilimleri, asgari ücret tutarları veya ÖSYM sınav katsayıları gibi veriler düzenli olarak resmi gazetede veya kurum sitelerinde yayınlanan son mevzuatlara göre güncellenir."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Girdiğim kişisel veriler kaydediliyor mu?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Hayır, sitemizdeki tüm hesaplamalar tarayıcınız (browser) üzerinden anlık olarak gerçekleştirilir. Maaş bilginiz, sağlık veya sınav netleriniz sunucularımıza kaydedilmez ve tamamen güvenlidir."
                            }
                        }
                    ]
                })
            }} />
        </section>
    );
}
