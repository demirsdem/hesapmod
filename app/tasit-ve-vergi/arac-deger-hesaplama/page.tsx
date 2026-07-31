import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ChevronRight } from "lucide-react";
import AracDegerHesaplama from "@/components/calculators/AracDegerHesaplama";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_PATH = "/tasit-ve-vergi/arac-deger-hesaplama";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const PAGE_TITLE = "Araç Değer Hesaplama 2026 | İkinci El Piyasa Değeri";
const PAGE_DESCRIPTION = "İkinci el aracınızın 2026 tahmini piyasa değerini marka, model, yaş, kilometre ve hasar kaydına göre hesaplayın. Değer kaybı ve emsal ilan analizi.";

const faqs = [
  {
    question: "İkinci el araç değeri nasıl hesaplanır?",
    answer: "İkinci el araç değeri; marka, model, model yılı, kilometre, yakıt tipi, vites, donanım, servis geçmişi, hasar kaydı, boya/değişen durumu, il/ilçe ve güncel emsal ilanlara göre tahmin edilir.",
  },
  {
    question: "Arabam ne kadar eder?",
    answer: "Aracınızın tahmini değerini görmek için marka, model, yıl, kilometre, hasar ve kondisyon bilgilerini girmeniz gerekir. Sonuç yaklaşık piyasa değer aralığı sunar; gerçek satış fiyatı emsal ilan, ekspertiz ve pazarlığa göre değişebilir.",
  },
  {
    question: "Kasko değeri ile piyasa değeri aynı mı?",
    answer: "Hayır. Kasko değeri sigorta süreçlerinde kullanılan referans değerdir. Piyasa değeri ise gerçek alıcı-satıcı davranışı, aracın kondisyonu, bölgesel talep ve ilan rekabetiyle oluşur.",
  },
  {
    question: "Hasar kaydı araç değerini ne kadar düşürür?",
    answer: "Hasar kaydının etkisi hasarın türüne, tutarına, hangi parçaların etkilendiğine, onarım kalitesine ve ekspertiz raporuna göre değişir. Bu nedenle sabit bir oranla yorumlanmamalıdır.",
  },
  {
    question: "TRAMER kaydı fiyatı etkiler mi?",
    answer: "Evet. TRAMER kaydı alıcı güvenini ve pazarlık gücünü etkileyebilir. Ancak hasarın içeriği ve aracın güncel teknik durumu mutlaka ekspertizle birlikte değerlendirilmelidir.",
  },
  {
    question: "Boya ve değişen parça değer kaybı yaratır mı?",
    answer: "Boya ve değişen parça araç değerini etkileyebilir. Etki, parçanın konumuna, değişim nedenine, işçilik kalitesine ve aracın segmentine göre değişir.",
  },
  {
    question: "Kilometre araç fiyatını nasıl etkiler?",
    answer: "Kilometre arttıkça aracın kullanım yıpranması ve bakım ihtimali artabilir. Ancak kilometre tek başına yeterli değildir; bakım geçmişi, kullanım şekli ve mekanik durumla birlikte değerlendirilmelidir.",
  },
  {
    question: "Servis geçmişi araç değerini artırır mı?",
    answer: "Düzenli ve belgelenebilir servis geçmişi alıcı güvenini artırabilir. Yetkili servis kayıtları veya düzenli bakım belgeleri aracın daha kolay satılmasına yardımcı olabilir.",
  },
  {
    question: "Donanım paketi fiyatı etkiler mi?",
    answer: "Evet. Donanım paketi, güvenlik özellikleri, konfor ekipmanları, multimedya, otomatik vites ve benzeri özellikler ikinci el fiyatında fark yaratabilir.",
  },
  {
    question: "İl ve ilçe araç fiyatını etkiler mi?",
    answer: "Evet. Büyükşehirler, bölgesel talep, araç arzı, iklim koşulları ve kullanıcı profili fiyatları etkileyebilir. Bu nedenle aynı araç farklı illerde farklı fiyatlara listelenebilir.",
  },
  {
    question: "Emsal ilanlarla fiyat nasıl belirlenir?",
    answer: "Emsal ilan karşılaştırmasında aynı marka, model, yıl, motor, yakıt, vites, kilometre, hasar durumu ve şehirdeki ilanlar dikkate alınmalıdır. Yalnızca en yüksek ilan fiyatlarına bakmak yanıltıcı olabilir.",
  },
  {
    question: "Araç değer hesaplama sonucu kesin midir?",
    answer: "Hayır. Sonuç tahmini değer aralığıdır. Gerçek satış fiyatı; ekspertiz, piyasa koşulları, ilan rekabeti, pazarlık ve alıcı talebine göre değişebilir.",
  },
  {
    question: "Satış fiyatı belirlerken pazarlık payı bırakılmalı mı?",
    answer: "Genellikle ilan fiyatı ile gerçekleşen satış fiyatı arasında pazarlık olabilir. Pazarlık payı aracın talebine, fiyatının gerçekçiliğine ve satıcının aciliyetine göre değişir.",
  },
  {
    question: "Yıllık sahip olma maliyetine neler dahildir?",
    answer: "Yıllık sahip olma maliyeti; yakıt, bakım, sigorta, kasko, vergi ve olası finansman giderleri gibi kalemlerden oluşabilir. Bu araç yaklaşık maliyet farkındalığı sağlar.",
  },
  {
    question: "Kredi taksiti araç değerine dahil midir?",
    answer: "Kredi taksiti aracın piyasa değerini doğrudan artırmaz. Ancak aracı satın alırken toplam sahip olma maliyetinin önemli bir parçasıdır.",
  },
  {
    question: "Bu hesaplama resmi ekspertiz yerine geçer mi?",
    answer: "Hayır. Bu araç yalnızca girdiğiniz bilgilere dayanan bir tahmin üretir; aracı fiziksel olarak incelemez, şasi ve motor durumunu, gizli hasarları veya yaklaşan bakım ihtiyacını göremez. Sonucu satış öncesi fiyat fikri edinmek, ilan hazırlamak veya pazarlığa hazırlanmak için kullanın. Alım satım, sigorta, kredi ve hukuki işlemlerde yetkili bir ekspertiz raporu gerekir.",
  },
];

const popularValueQuestions = [
  {
    title: "Arabam ne kadar eder?",
    text: "Marka, model, yıl, kilometre ve kondisyon bilgileriyle yaklaşık değer aralığı görülebilir; sonuç emsal ilan ve ekspertizle kontrol edilmelidir.",
  },
  {
    title: "İkinci el araba fiyatı nasıl hesaplanır?",
    text: "Benzer araçların ilanları, donanım, hasar, servis geçmişi ve bölgesel talep birlikte okunarak tahmini fiyat bandı oluşturulur.",
  },
  {
    title: "Hasar kaydı araç değerini ne kadar etkiler?",
    text: "Etkisi hasarın kapsamına, onarım kalitesine ve alıcı algısına göre değişir; tek bir sabit oranla değerlendirmek doğru değildir.",
  },
  {
    title: "Kasko değeri piyasa değeri midir?",
    text: "Kasko değeri sigorta süreçleri için referanstır; piyasa değeri alıcı-satıcı davranışı ve aracın gerçek kondisyonuyla şekillenir.",
  },
  {
    title: "Kilometre araç değerini nasıl etkiler?",
    text: "Yüksek kilometre bakım ve yıpranma beklentisini artırabilir; düşük kilometre ise bakım geçmişiyle birlikte anlam kazanır.",
  },
  {
    title: "Boya/değişen parça fiyatı düşürür mü?",
    text: "Parçanın konumu, değişim nedeni ve işçilik kalitesi önemlidir; ekspertiz yorumu olmadan tek başına hüküm vermek yanıltıcı olabilir.",
  },
  {
    title: "Emsal ilanla araç fiyatı nasıl belirlenir?",
    text: "Aynı model yılı, motor, yakıt, vites, kilometre ve şehirdeki benzer ilanları karşılaştırmak daha sağlıklı bir fiyat bandı verir.",
  },
  {
    title: "Araç satış fiyatı nasıl belirlenir?",
    text: "İlan fiyatı belirlenirken piyasa bandı, pazarlık payı, satış aciliyeti ve aracın belgelenebilir bakım geçmişi birlikte düşünülmelidir.",
  },
  {
    title: "TRAMER kaydı olan araç nasıl fiyatlanır?",
    text: "TRAMER kaydı hasarın içeriği, tutarı ve onarım kalitesiyle birlikte değerlendirilmelidir; ekspertiz raporu belirleyici olur.",
  },
  {
    title: "Servis geçmişi araç değerini etkiler mi?",
    text: "Düzenli ve belgelenebilir bakım geçmişi alıcı güvenini artırabilir ve pazarlık sürecinde satıcıyı destekleyebilir.",
  },
];

const relatedTools = [
  {
    title: "MTV Hesaplama",
    href: "/tasit-ve-vergi/mtv-hesaplama",
    text: "Motorlu Taşıtlar Vergisi maliyetini hesaplayın.",
  },
  {
    title: "Kasko Değeri Hesaplama",
    href: "/sigorta/kasko-degeri-hesaplama",
    text: "Sigorta referans değerini kontrol edin.",
  },
  {
    title: "Trafik Sigortası Hesaplama",
    href: "/sigorta/trafik-sigortasi-hesaplama",
    text: "Zorunlu trafik sigortası maliyetini tahmin edin.",
  },
  {
    title: "Taşıt Kredisi Hesaplama",
    href: "/finansal-hesaplamalar/tasit-kredisi-hesaplama",
    text: "Araç kredisi taksit ve toplam maliyetini görün.",
  },
  {
    title: "Yakıt Tüketim Maliyeti",
    href: "/tasit-ve-vergi/yakit-tuketim-maliyet",
    text: "Yıllık yakıt giderinizi hesaplayın.",
  },
  {
    title: "ÖTV Hesaplama",
    href: "/tasit-ve-vergi/otv-hesaplama",
    text: "Sıfır araçta vergi etkisini yaklaşık olarak görün.",
  },
];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    siteName: SITE_NAME,
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function AracDegerHesaplamaPage() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: PAGE_TITLE,
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    description: PAGE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Taşıt & Vergi", item: `${SITE_URL}/kategori/tasit-ve-vergi` },
      { "@type": "ListItem", position: 3, name: "Araç Değer Hesaplama", item: PAGE_URL },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Araç Değeri Nasıl Hesaplanır?",
    inLanguage: "tr-TR",
    step: [
      "Marka, model ve model yılını seçin.",
      "Kilometre, yakıt, vites ve donanım bilgilerini girin.",
      "Hasar kaydı, boya/değişen ve servis geçmişini belirtin.",
      "İl/ilçe ve emsal ilanları karşılaştırın.",
      "Tahmini piyasa değeri aralığını yorumlayın.",
    ].map((name, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name,
      text: name,
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Script id="arac-deger-web-app-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <Script id="arac-deger-breadcrumb-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="arac-deger-faq-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="arac-deger-howto-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition-colors hover:text-[#CC4A1A]">Ana Sayfa</Link>
        <ChevronRight size={16} />
        <Link href="/kategori/tasit-ve-vergi" className="transition-colors hover:text-[#CC4A1A]">Taşıt & Vergi</Link>
        <ChevronRight size={16} />
        <span className="font-medium text-slate-700">Araç Değer Hesaplama</span>
      </nav>

      <section className="mb-8">
        <div className="inline-flex rounded-full border border-[#FFD7C7] bg-[#FFF3EE] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#CC4A1A]">
          İkinci el otomobil piyasa analizi
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{PAGE_TITLE}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Aracınızın marka, model, yıl, kilometre, yakıt, vites, donanım, servis geçmişi, hasar kaydı, boya/değişen ve il/ilçe bilgilerine göre tahmini ikinci el piyasa değerini görün. Sonuçlar ilan, ekspertiz ve resmi değer yerine geçmez.
        </p>
        <div className="mt-5 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950">
          Bu araç, girdiğiniz bilgilere ve emsal piyasa göstergelerine göre tahmini araç değer aralığı sunar. Gerçek satış fiyatı; ekspertiz raporu, ilan rekabeti, pazarlık, bölgesel talep, hasar geçmişi ve piyasa koşullarına göre değişebilir.
        </div>
      </section>

      <AracDegerHesaplama />

      <section className="mt-12 space-y-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#CC4A1A]">Rehber</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">İkinci El Araç Değeri Nasıl Hesaplanır?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            İkinci el araç değeri; marka, model, yıl, kilometre, yakıt tipi, vites, donanım, servis geçmişi, hasar kaydı, boya/değişen ve bulunduğu il/ilçe gibi bilgilerin birlikte yorumlanmasıyla tahmin edilir. Bu sayfadaki hesaplama, kullanıcı girdilerini referans katsayılar ve varsa emsal ilan sinyalleriyle birleştirerek yaklaşık bir değer aralığı üretir.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Araç Değeri Hangi Formülle Tahmin Edilir?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Hesaplama iki yoldan biriyle ilerler. Emsal ilan girdiğinizde araç bu ilanları esas alır: fiyatların medyanını bulur, aşırı yüksek ve aşırı düşük ilanları eleyip kalanları sizin kilometrenize göre normalize eder. Emsal girmediğinizde ise modelin sıfır referans fiyatından başlanır ve şu mantıkla amortisman uygulanır:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm text-orange-300">
            <p>Tahmini Değer = Sıfır Referans Fiyatı × (1 − Yaş Kaybı − Kilometre Etkisi − Hasar Etkisi + Kondisyon Düzeltmeleri)</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Yaş kaybı sabit bir yıllık yüzde değildir; ilk yıl en yüksek, sonraki yıllarda kademeli olarak azalan bir oranla işler, çünkü araçlar değerinin büyük kısmını ilk yıllarda kaybeder. Kilometre etkisi aracın yaşına göre beklenen kilometreyle karşılaştırılarak bulunur: yılda ortalama on iki bin kilometre referans alındığında beklenenin üzerindeki her on bin kilometre değeri bir miktar aşağı çeker, beklenenin altında kalmak ise sınırlı bir prim sağlar. Kondisyon düzeltmeleri donanım paketi, servis geçmişi, yakıt tipi, vites ve il farkını içerir.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Bu yöntem piyasa davranışını yaklaşık olarak modelleyen bir tahmindir; resmî ya da tek doğru bir araç değerleme formülü yoktur ve oranlar modelden modele değişir. Sonuç bu nedenle tek bir rakam yerine aralık olarak sunulur. Aralığın genişliği elinizdeki veriye bağlıdır: yeterli sayıda emsal ilan girdiğinizde bant daralır, emsal olmadığında ve özellikle ağır hasar kaydı bulunduğunda belirsizlik arttığı için bant genişler.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Örnek Hesaplama: Beş Yaşında, 90.000 km Araç</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Hasar kaydı bulunmayan, beş yaşında ve 90.000 kilometredeki bir otomobil için hesap şu adımlarla ilerler:
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <li>
              <strong className="text-slate-900">1. Sıfır referans fiyatı alınır.</strong> Bu tutar tamamen araca özeldir ve modelden modele büyük fark gösterir.
            </li>
            <li>
              <strong className="text-slate-900">2. Yaş kaybı uygulanır.</strong> İlk yıl için yaklaşık beşte bir, izleyen dört yıl için yılda yaklaşık yüzde on iki oranında kayıp birikir. Beş yılın sonunda araç, sıfır fiyatının kabaca yarısına yakın bir seviyeye iner.
            </li>
            <li>
              <strong className="text-slate-900">3. Kilometre kontrol edilir.</strong> Bu yaştaki bir araç için beklenen kilometre 60.000 iken gerçek değer 90.000'dir. Aradaki 30.000 kilometrelik fazlalık değeri yaklaşık yüzde dört buçuk aşağı çeker.
            </li>
            <li>
              <strong className="text-slate-900">4. Hasar etkisi eklenir.</strong> Kayıt bulunmadığı için bu adımda ek bir düşüş uygulanmaz.
            </li>
            <li>
              <strong className="text-slate-900">5. Kondisyon düzeltmeleri işlenir.</strong> Donanım, servis geçmişi, yakıt tipi, vites ve il farkı hesaba girer; yetkili servis kayıtlı ve otomatik vitesli bir araç bu adımda birkaç puan yukarı gider.
            </li>
            <li>
              <strong className="text-slate-900">6. Belirsizlik bandı konur.</strong> Çıkan rakamın etrafına bir aralık yerleştirilir ve size tek fiyat yerine alt-üst sınır gösterilir.
            </li>
          </ol>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Aynı araca ağır hasar kaydı eklendiğinde değer yaklaşık yüzde otuz daha düşer ve alıcı bulmak zorlaştığı için tahmin bandı belirgin biçimde genişler. Bu fark, hasar geçmişinin ikinci el fiyat üzerindeki etkisinin neden bu kadar belirleyici olduğunu gösterir.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Arabam Ne Kadar Eder?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            “Arabam ne kadar eder?” sorusunun sağlıklı cevabı tek bir rakamdan çok, makul bir fiyat bandıdır. Aynı modelin farklı kilometre, donanım, hasar ve servis geçmişine sahip örnekleri farklı alıcı tepkisi görebilir. Bu nedenle sonuç aralığını emsal ilanlar, ekspertiz raporu ve pazarlık koşullarıyla birlikte okumak gerekir.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Kasko Değeri ile Piyasa Değeri Arasındaki Fark</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Kasko değeri, sigorta süreçlerinde kullanılan referans değerlerden biridir; satış fiyatı anlamına gelmez. Piyasa değeri ise aracın güncel kondisyonu, ilan rekabeti, bölgesel talep, alıcı ilgisi ve pazarlık sonucuyla şekillenir. Bu yüzden kasko değerini tek başına satış fiyatı gibi değerlendirmek yanıltıcı olabilir.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Hasar Kaydı Araç Değerini Nasıl Etkiler?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Hasar kaydı ve TRAMER bilgisi alıcı güvenini doğrudan etkileyebilir. Ancak etkinin büyüklüğü hasarın türüne, hangi parçaların etkilendiğine, onarım kalitesine, ekspertiz yorumuna ve aracın güncel teknik durumuna göre değişir. Bu nedenle yalnız kayıt tutarına bakarak karar vermek yerine detaylı ekspertizle doğrulama yapılmalıdır.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Kilometre ve Model Yılı Araç Fiyatını Nasıl Etkiler?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Model yılı aracın yaşını, kilometre ise kullanım yoğunluğunu gösterir. Yüksek kilometre bakım ve yıpranma beklentisini artırabilir; ancak düzenli servis geçmişi, temiz kullanım ve mekanik durum bu algıyı dengeleyebilir. Düşük kilometre de tek başına yeterli değildir; uzun süre yatmış veya bakımsız kalmış araç ayrıca kontrol edilmelidir.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Boya ve Değişen Parça Değer Kaybı Yaratır mı?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Boya ve değişen parça aracın değer algısını etkileyebilir. Burada parçanın konumu, değişim nedeni, onarımın kalitesi ve aracın segmenti önemlidir. Kozmetik boya ile yapısal hasar sonucu değişen parça aynı şekilde değerlendirilmemelidir; uzman ekspertiz raporu bu ayrımı netleştirmek için gereklidir.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Emsal İlanlarla Araç Fiyatı Nasıl Karşılaştırılır?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Emsal ilan karşılaştırması yaparken aynı marka, model, model yılı, yakıt, vites, motor, donanım, kilometre, hasar durumu ve şehirdeki araçlara bakılmalıdır. Yalnızca en yüksek ilan fiyatlarını seçmek piyasa algısını bozabilir. Benzer özellikteki ilanların makul orta bandı, satış fiyatı belirlerken daha sağlıklı bir başlangıç noktası sunar.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Araç Satış Fiyatı Belirlerken Nelere Bakılır?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Satış fiyatı belirlerken aracın kondisyonu, emsal ilan bandı, pazarlık payı, satış aciliyeti, bakım belgeleri, lastik ve muayene durumu birlikte değerlendirilmelidir. İlan fiyatı ile gerçekleşen satış bedeli aynı olmak zorunda değildir; alıcı talebi ve pazarlık süreci sonucu değiştirebilir.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Popüler Araç Değer Hesaplamaları</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {popularValueQuestions.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Kaynaklar, Yöntem ve Yasal Uyarı</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">Son güncelleme</p>
              <p className="mt-1 text-sm text-slate-600">2026-05-30</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">Hazırlayan</p>
              <p className="mt-1 text-sm text-slate-600">HesapMod Editör Ekibi</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">Yöntem</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Marka/model katsayıları, araç kondisyonu ve emsal piyasa sinyalleriyle tahmini değer aralığı.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">Uyarı</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Ekspertiz, resmi değer veya nihai satış bedeli yerine geçmez. Kullanıcı talebiyle getirilen emsal arama sonuçları ayrıca kontrol edilmelidir.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">İlgili Hesaplama Araçları</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE]">
              <span className="text-base font-black text-slate-950 group-hover:text-[#CC4A1A]">{tool.title}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">{tool.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">Sıkça Sorulan Sorular</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-slate-50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4 text-base font-bold text-slate-900 transition-colors hover:text-[#CC4A1A]">
                {faq.question}
                <ChevronRight size={18} className="shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-4 pb-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
