import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ChevronRight } from "lucide-react";
import GayrimenkulHesaplama from "@/components/calculators/GayrimenkulHesaplama";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_PATH = "/gayrimenkul-deger-hesaplama";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const PAGE_DESCRIPTION = "Gayrimenkul değer hesaplama aracıyla konut, villa, arsa, dükkan ve ofis için 2025 Q1 piyasa ortalamalarına göre m² fiyatı, yatırım getirisi ve kira-kredi karşılaştırması hesaplayın.";

const faqs = [
  {
    question: "Daire değeri nasıl hesaplanır?",
    answer: "Daire değeri; il, ilçe, mahalle, net/brüt m², oda sayısı, bina yaşı, kat, ısınma, tapu ve krediye uygunluk gibi niteliklerin bölgedeki m² ortalamasına etkisiyle tahmin edilir.",
  },
  {
    question: "Kira getiri oranı nedir?",
    answer: "Kira getiri oranı, yıllık kira gelirinin satış fiyatına oranıdır. Brüt getiri toplam kirayı, net getiri ise aidat gibi düzenli giderler düşüldükten sonraki kirayı dikkate alır.",
  },
  {
    question: "Gayrimenkul amorti süresi ne olmalı?",
    answer: "Amorti süresi lokasyona göre değişir. Büyük şehirlerde 14-20 yıl bandı sık görülür; daha kısa süre kira verimi açısından daha güçlü bir yatırıma işaret eder.",
  },
  {
    question: "Kira mı almak mı daha mantıklı?",
    answer: "Peşinat, kredi faizi, kira artışı ve evin fiyatı birlikte değerlendirilmelidir. Kira kısa vadede nakit akışını rahatlatabilir; satın alma ise uzun vadede özvarlık oluşturabilir.",
  },
  {
    question: "Konut kredisi mi kira mı?",
    answer: "Konut kredisi sabit taksit avantajı sağlayabilir; kira ise başlangıçta daha düşük ödeme sunabilir. Karar, 10 yıllık toplam ödeme ve kalan borç/özvarlık etkisiyle karşılaştırılmalıdır.",
  },
  {
    question: "Arsa değeri nasıl hesaplanır?",
    answer: "Arsa değerinde m², imar durumu, tapu niteliği, lokasyon, ulaşım ve bölgedeki gelişim beklentisi ağırlıklıdır. Bu araçta arsa için konut m² referansı daha düşük bir katsayıyla uyarlanır.",
  },
  {
    question: "Gayrimenkulde brüt net getiri farkı nedir?",
    answer: "Brüt getiri, yıllık kira gelirini satış fiyatına böler. Net getiri, aidat ve düzenli giderleri düşerek yatırımcının elinde kalan kira gelirini ölçer.",
  },
  {
    question: "İstanbul'da m² fiyatları ne kadar?",
    answer: "2025 Q1 piyasa ortalamalarında İstanbul genel m² ortalaması yaklaşık 47.913 TL seviyesindedir. Kadıköy, Beşiktaş, Sarıyer ve Bakırköy gibi ilçelerde ortalama belirgin biçimde daha yüksektir.",
  },
];

export const metadata: Metadata = {
  title: "Gayrimenkul Değer Hesaplama | Konut, Arsa, Kira ve Kredi Analizi",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: "Gayrimenkul Değer Hesaplama | HesapMod",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
};

export default function GayrimenkulDegerHesaplamaPage() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Gayrimenkul Değer Hesaplama",
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
      { "@type": "ListItem", position: 2, name: "Gayrimenkul Değer Hesaplama", item: PAGE_URL },
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Script id="gayrimenkul-web-app-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <Script id="gayrimenkul-breadcrumb-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="gayrimenkul-faq-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition-colors hover:text-[#CC4A1A]">Ana Sayfa</Link>
        <ChevronRight size={16} />
        <span className="font-medium text-slate-700">Gayrimenkul Değer Hesaplama</span>
      </nav>

      <section className="mb-8">
        <div className="inline-flex rounded-full border border-[#FFD7C7] bg-[#FFF3EE] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#CC4A1A]">
          Konut, arsa, kira ve kredi analizi
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Gayrimenkul Değer Hesaplama</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          2025 Q1 piyasa ortalamalarıyla m² fiyatı ve tahmini değer aralığını hesaplayın; aynı sayfada kira getirisi, 10 yıllık yatırım projeksiyonu ve kira-kredi karşılaştırmasını görün.
        </p>
      </section>

      <GayrimenkulHesaplama />

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black tracking-tight text-slate-950">Kira Getirisi</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Kira getirisi, yıllık kira gelirinin tahmini satış değerine oranıdır. Formül: yıllık kira / gayrimenkul değeri x 100. Örneğin 4.000.000 TL değerindeki bir konuttan aylık 25.000 TL kira bekleniyorsa yıllık kira 300.000 TL, brüt kira getirisi yaklaşık %7,5 olur.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black tracking-tight text-slate-950">Gayrimenkul ROI</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            ROI, kira geliri ve değer artışı gibi yatırım kazançlarının toplam maliyete oranını gösterir. Tapu harcı, tadilat, boş kalma süresi, aidat ve kredi faizi gibi giderler dahil edilmediğinde sonuç fazla iyimser görünebilir.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black tracking-tight text-slate-950">Amortisman Süresi</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Amortisman süresi, gayrimenkul bedelinin yıllık kira geliriyle kaç yılda geri kazanılacağını gösterir. Formül: gayrimenkul değeri / yıllık net kira. Daha kısa süre, kira verimi açısından daha güçlü bir senaryoya işaret eder.
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
        <h2 className="text-xl font-black tracking-tight text-slate-950">Sonucu Nasıl Yorumlamalı?</h2>
        <p className="mt-3">
          Bu sayfadaki değerleme, kira getirisi ve gayrimenkul ROI hesabı tahmini karar desteği sağlar; ekspertiz raporu, banka kredi kararı veya yatırım tavsiyesi değildir. Özellikle krediyle alımda toplam maliyeti görmek için{" "}
          <Link href="/finansal-hesaplamalar/kira-mi-konut-kredisi-mi-hesaplama" className="font-semibold text-[#CC4A1A] underline underline-offset-4">kira mı konut kredisi mi</Link>,{" "}
          <Link href="/finansal-hesaplamalar/konut-kredisi-hesaplama" className="font-semibold text-[#CC4A1A] underline underline-offset-4">konut kredisi hesaplama</Link>,{" "}
          <Link href="/ticaret-ve-is/tapu-harci-hesaplama" className="font-semibold text-[#CC4A1A] underline underline-offset-4">tapu harcı hesaplama</Link>{" "}
          ve{" "}
          <Link href="/finansal-hesaplamalar/kira-artis-hesaplama" className="font-semibold text-[#CC4A1A] underline underline-offset-4">kira artış hesaplama</Link>{" "}
          araçlarıyla çapraz kontrol yapılmalıdır.
        </p>
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

      <footer className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Yasal uyarı: Bu sayfadaki hesaplamalar bilgilendirme amaçlı tahminlerdir; ekspertiz, resmi değerleme raporu, banka kredi değerlendirmesi veya yatırım tavsiyesi yerine geçmez. Gerçek satış ve kira bedelleri ilan rekabeti, pazarlık, tapu/imar durumu, bina niteliği ve güncel piyasa koşullarına göre değişebilir.
      </footer>
    </main>
  );
}
