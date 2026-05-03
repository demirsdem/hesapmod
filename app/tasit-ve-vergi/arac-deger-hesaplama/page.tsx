import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ChevronRight } from "lucide-react";
import AracDegerHesaplama from "@/components/calculators/AracDegerHesaplama";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_PATH = "/tasit-ve-vergi/arac-deger-hesaplama";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const PAGE_DESCRIPTION = "Araç değer hesaplama aracıyla ikinci el otomobilinizin bugünkü tahmini piyasa değerini, güncel emsal ilanları, donanım ve bölge etkisini, değer kaybını ve yıllık sahip olma maliyetini TL cinsinden hesaplayın.";

const faqs = [
  {
    question: "İkinci el araç değeri nasıl hesaplanır?",
    answer: "En sağlıklı hesaplama güncel emsal ilan fiyatlarıyla yapılır. Marka, model, yıl, kilometre, donanım paketi, il/ilçe, servis geçmişi, yakıt tipi, vites, hasar kaydı ve boya/değişen bilgileri birlikte değerlendirilir.",
  },
  {
    question: "Hasar kaydı araç değerini ne kadar düşürür?",
    answer: "Hafif hasar yaklaşık yüzde 8, orta hasar yüzde 18, ağır hasar ise yüzde 30 civarında değer düşüşü yaratabilir. Gerçek etki onarım kalitesi, değişen parçalar ve ekspertiz raporuna göre değişir.",
  },
  {
    question: "Kilometre araç fiyatını nasıl etkiler?",
    answer: "Ortalamanın üzerindeki kilometre her 10.000 km için yaklaşık yüzde 1-2 ek değer kaybı oluşturabilir. Düşük kilometre ise sınırlı bir prim yaratır ancak bakım geçmişiyle birlikte değerlendirilmelidir.",
  },
  {
    question: "Araç değer hesaplama sonucu kesin satış fiyatı mıdır?",
    answer: "Hayır. Sonuçlar tahmini ve bilgilendirme amaçlıdır. İlan rekabeti, il/ilçe piyasası, donanım paketi, servis geçmişi, ekspertiz ve pazarlık koşulları gerçek satış fiyatını değiştirebilir.",
  },
  {
    question: "Yıllık sahip olma maliyetine neler dahildir?",
    answer: "Bu sayfadaki yıllık maliyet tahmini yakıt, sigorta, muayene/egzoz ve ortalama bakım kalemlerini içerir. Kasko, lastik, otopark, MTV ve beklenmedik arızalar ayrıca değerlendirilmelidir.",
  },
];

export const metadata: Metadata = {
  title: "Araç Değer Hesaplama | İkinci El Araba Piyasa Değeri",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: "Araç Değer Hesaplama | HesapMod",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
};

export default function AracDegerHesaplamaPage() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Araç Değer Hesaplama",
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Script id="arac-deger-web-app-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <Script id="arac-deger-breadcrumb-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="arac-deger-faq-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Araç Değer Hesaplama</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Marka, model, yıl, kilometre, donanım, il/ilçe ve servis geçmişini girin; canlı emsal araması açık olduğunda güncel ilanları otomatik getirin. Araç, bu emsallere göre tahmini piyasa değeri aralığını, yıllık maliyeti, kredi taksitini ve benzer bütçedeki alternatifleri hesaplar.
        </p>
      </section>

      <AracDegerHesaplama />

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
