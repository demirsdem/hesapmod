import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const PAGE_URL = "https://www.hesapmod.com/finansal-hesaplamalar/gecmis-doviz-kurlari";
const SITE_URL = "https://www.hesapmod.com";
const PAGE_TITLE = "Geçmiş Döviz Kurları 2010–2026 – Yıllara Göre Dolar, Euro ve Sterlin";
const PAGE_DESCRIPTION =
  "2010’dan bugüne yıllık ortalama dolar, euro ve sterlin kurlarını inceleyin. Geçmiş yıllara göre USD/TL, EUR/TL ve GBP/TL değişimini, TL’nin değer kaybını ve eski tarihli kur hesaplamalarını görün.";
const DATE_MODIFIED = "2026-05-22";
const METHOD_REVIEW_DATE = "2026-05-22";
const PROVISIONAL_YEAR = "2026";

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
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const DATA: Record<string, [number, number, number]> = {
  "2026": [43.98, 46.50, 54.50],
  "2025": [36.50, 38.50, 45.50],
  "2024": [32.90, 35.60, 41.80],
  "2023": [23.75, 25.90, 30.10],
  "2022": [16.55, 17.40, 20.50],
  "2021": [8.85, 9.95, 11.80],
  "2020": [7.01, 8.00, 9.05],
  "2019": [5.68, 6.35, 7.30],
  "2018": [4.82, 5.70, 6.50],
  "2017": [3.65, 4.12, 4.80],
  "2016": [3.02, 3.34, 4.06],
  "2015": [2.72, 3.02, 4.18],
  "2014": [2.19, 2.91, 3.58],
  "2013": [1.90, 2.53, 3.01],
  "2012": [1.80, 2.31, 2.86],
  "2011": [1.67, 2.34, 2.68],
  "2010": [1.50, 2.00, 2.35],
};

type CurrencyCode = "USD" | "EUR" | "GBP";

type YearRate = {
  year: string;
  usd: number;
  eur: number;
  gbp: number;
  usdChangePercent: number | null;
  eurChangePercent: number | null;
  gbpChangePercent: number | null;
  try1000ToUsd: number;
  try1000ToEur: number;
  try1000ToGbp: number;
  usd100ToTry: number;
  eur100ToTry: number;
  gbp100ToTry: number;
  provisional: boolean;
};

type FaqItem = {
  question: string;
  answer: string;
};

const YEARS_ASC = Object.keys(DATA).sort((a, b) => Number(a) - Number(b));
function getRate(year: string) {
  const rate = DATA[year];
  if (!rate) {
    throw new Error(`Missing historical FX data for ${year}`);
  }
  return rate;
}

function percentChange(current: number, previous?: number) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

const YEAR_ROWS: YearRate[] = YEARS_ASC.map((year, index) => {
  const [usd, eur, gbp] = getRate(year);
  const previous = index > 0 ? getRate(YEARS_ASC[index - 1]) : null;

  return {
    year,
    usd,
    eur,
    gbp,
    usdChangePercent: percentChange(usd, previous?.[0]),
    eurChangePercent: percentChange(eur, previous?.[1]),
    gbpChangePercent: percentChange(gbp, previous?.[2]),
    try1000ToUsd: 1000 / usd,
    try1000ToEur: 1000 / eur,
    try1000ToGbp: 1000 / gbp,
    usd100ToTry: 100 * usd,
    eur100ToTry: 100 * eur,
    gbp100ToTry: 100 * gbp,
    provisional: year === PROVISIONAL_YEAR,
  };
});

const ROWS_DESC = [...YEAR_ROWS].reverse();
const ROW_BY_YEAR = new Map(YEAR_ROWS.map((row) => [row.year, row]));
const usd2010 = row("2010").usd;
const usd2015 = row("2015").usd;
const usd2020 = row("2020").usd;
const usd2021 = row("2021").usd;
const usd2022 = row("2022").usd;
const usd2023 = row("2023").usd;
const usd2024 = row("2024").usd;
const usd2025 = row("2025").usd;
const currentYear = new Date().getFullYear();
const tenYearsAgo = currentYear - 10;
const fiveYearsAgo = currentYear - 5;
const tenYearRow = getNearestRow(tenYearsAgo);
const fiveYearRow = getNearestRow(fiveYearsAgo);
const usd2010To2024Multiplier = usd2024 / usd2010;
const usd2010To2024Percent = (usd2010To2024Multiplier - 1) * 100;

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Geçmiş döviz kurları nasıl hesaplanır?",
    answer:
      "Geçmiş döviz kurları günlük, aylık veya yıllık ortalama olarak hesaplanabilir. Bu sayfada yıllık ortalama USD/TL, EUR/TL ve GBP/TL değerleri kullanılır. Yıllık ortalama, ilgili yıl içindeki günlük kurların ortalaması alınarak oluşturulur.",
  },
  {
    question: "Yıllık ortalama dolar kuru nedir?",
    answer:
      "Yıllık ortalama dolar kuru, bir yıl içinde oluşan USD/TL kurlarının ortalamasıdır. Tek bir günün kurundan farklı olarak yılın genel kur seviyesini gösterir.",
  },
  {
    question: "10 yıl önce dolar ne kadardı?",
    answer: `10 yıl önceki dolar kuru, bugünün yılına göre ilgili yılın yıllık ortalama USD/TL değerinden hesaplanır. ${tenYearRow.year} yılı için bu sayfadaki USD/TL ortalaması yaklaşık ${formatRate(tenYearRow.usd)} TL seviyesindedir. Belirli bir güne ait kur gerekiyorsa TCMB geçmiş döviz kurları kontrol edilmelidir.`,
  },
  {
    question: "2010 yılında dolar kaç TL idi?",
    answer: `2010 yılında USD/TL yıllık ortalaması bu sayfadaki tabloya göre yaklaşık ${formatRate(usd2010)} TL seviyesindeydi.`,
  },
  {
    question: "2020 yılında dolar kaç TL idi?",
    answer: `2020 yılında USD/TL yıllık ortalaması bu sayfadaki tabloya göre yaklaşık ${formatRate(usd2020)} TL seviyesindeydi.`,
  },
  {
    question: "2023 yılında dolar kaç TL idi?",
    answer: `2023 yılında USD/TL yıllık ortalaması bu sayfadaki tabloya göre yaklaşık ${formatRate(usd2023)} TL seviyesindeydi.`,
  },
  {
    question: "Geçmiş euro kuru nasıl bulunur?",
    answer:
      "Geçmiş euro kuru yıllık ortalama olarak bu sayfadaki EUR/TL tablosundan incelenebilir. Belirli bir güne ait kur gerekiyorsa TCMB geçmiş döviz kurları ekranı kontrol edilmelidir.",
  },
  {
    question: "Geçmiş sterlin kuru nasıl bulunur?",
    answer:
      "Geçmiş sterlin kuru yıllık ortalama olarak GBP/TL tablosundan görülebilir. Belirli bir tarih için günlük gösterge kur kullanılmalıdır.",
  },
  {
    question: "Günlük kur ile yıllık ortalama kur aynı mı?",
    answer:
      "Hayır. Günlük kur belirli bir tarihteki döviz kurunu gösterir. Yıllık ortalama kur ise yıl içindeki kurların ortalamasıdır. Kullanım amacı farklıdır.",
  },
  {
    question: "Resmi işlemlerde yıllık ortalama kur kullanılabilir mi?",
    answer:
      "Resmi işlem, vergi, muhasebe, sözleşme veya dava hesaplarında kullanılacak kur işlem türüne ve mevzuata göre değişir. Bu sayfadaki değerler genel analiz içindir; resmi işlem öncesi ilgili mevzuat veya uzman görüşü kontrol edilmelidir.",
  },
  {
    question: "1000 TL geçmişte kaç dolar ederdi?",
    answer:
      "Seçilen yılın USD/TL ortalamasına göre hesaplanır. Formül: dolar miktarı = TL tutarı / yıllık ortalama USD/TL kuru.",
  },
  {
    question: "100 dolar geçmişte kaç TL ederdi?",
    answer:
      "Seçilen yılın USD/TL ortalamasına göre hesaplanır. Formül: TL karşılığı = dolar miktarı × yıllık ortalama USD/TL kuru.",
  },
  {
    question: "Dolar kuru 2010’dan bugüne kaç kat arttı?",
    answer: `Başlangıç ve bitiş yıllarındaki USD/TL ortalamaları bölünerek hesaplanır. Örneğin 2024 ortalaması ${formatRate(usd2024)} TL ve 2010 ortalaması ${formatRate(usd2010)} TL karşılaştırıldığında dolar kuru yaklaşık ${formatMultiplier(usd2010To2024Multiplier)} kat artmıştır.`,
  },
  {
    question: "2026 döviz kuru kesin veri mi?",
    answer:
      "2026 yılı tamamlanmadıysa veya yıl içi veri devam ediyorsa gösterilen değer geçici ortalama veya projeksiyon olabilir. Kesin yıllık ortalama yıl tamamlandıktan sonra hesaplanmalıdır.",
  },
  {
    question: "Bu sayfa yatırım tavsiyesi verir mi?",
    answer:
      "Hayır. Bu sayfa yalnızca geçmiş kur verilerini ve yıllık ortalama değişimleri bilgilendirme amacıyla gösterir. Döviz alım satım kararı için yatırım danışmanlığı yerine geçmez.",
  },
  {
    question: "TCMB geçmiş döviz kurları ile bu tablo neden farklı olabilir?",
    answer:
      "TCMB ekranında belirli günlere ait gösterge kurlar görülebilir. Bu sayfa ise yıllık ortalama değerleri gösterir. Günlük kur ile yıllık ortalama kur doğal olarak farklı olabilir.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Ana Sayfa",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Finansal Hesaplamalar",
      item: `${SITE_URL}/finansal-hesaplamalar`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Geçmiş Döviz Kurları",
      item: PAGE_URL,
    },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  dateModified: DATE_MODIFIED,
  inLanguage: "tr-TR",
  isPartOf: {
    "@type": "WebSite",
    name: "HesapMod",
    url: SITE_URL,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Geçmiş Döviz Kuru Nasıl Hesaplanır?",
  inLanguage: "tr-TR",
  mainEntityOfPage: PAGE_URL,
  step: [
    { "@type": "HowToStep", position: 1, name: "Yıl seçin", text: "Geçmiş kur analizi yapmak istediğiniz yılı seçin." },
    { "@type": "HowToStep", position: 2, name: "Para birimini seçin", text: "USD, EUR veya GBP para birimlerinden birini seçin." },
    { "@type": "HowToStep", position: 3, name: "Yıllık ortalama kuru alın", text: "Seçilen yılın yıllık ortalama kurunu tablodan alın." },
    { "@type": "HowToStep", position: 4, name: "Tutarı formüle uygulayın", text: "TL veya döviz tutarını ilgili formüle göre hesaplayın." },
    { "@type": "HowToStep", position: 5, name: "Sonucu yorumlayın", text: "Sonucu günlük kur değil yıllık ortalama analiz olarak değerlendirin." },
  ],
};

function row(year: string) {
  const item = ROW_BY_YEAR.get(year);
  if (!item) {
    throw new Error(`Missing computed historical FX row for ${year}`);
  }
  return item;
}

function getNearestRow(targetYear: number) {
  const exact = ROW_BY_YEAR.get(String(targetYear));
  if (exact) return exact;

  return YEAR_ROWS.reduce((nearest, item) => {
    const currentDistance = Math.abs(Number(item.year) - targetYear);
    const nearestDistance = Math.abs(Number(nearest.year) - targetYear);
    return currentDistance < nearestDistance ? item : nearest;
  }, YEAR_ROWS[0]);
}

function formatDecimal(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: Math.min(2, maximumFractionDigits),
    maximumFractionDigits,
  }).format(value);
}

function formatRate(value: number) {
  return formatDecimal(value, 2);
}

function formatCurrencyTry(value: number) {
  return `${formatDecimal(value, 2)} TL`;
}

function formatCurrencyAmount(value: number, currency: CurrencyCode) {
  return `${formatDecimal(value, 2)} ${currency}`;
}

function formatPercent(value: number | null) {
  if (value === null) return "İlk yıl";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatDecimal(value, 1)}%`;
}

function formatMultiplier(value: number) {
  return formatDecimal(value, 2);
}

function jsonLd(schema: Record<string, unknown>) {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function RateNote({ year }: { year: string }) {
  if (year !== PROVISIONAL_YEAR) return null;

  return (
    <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
      geçici
    </span>
  );
}

function ChangeValue({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-slate-500">İlk yıl</span>;
  }

  return (
    <span className={value > 0 ? "font-semibold text-red-600" : "font-semibold text-emerald-700"}>
      {formatPercent(value)}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
      <div className="space-y-4 leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function PopularQueryCard({
  href,
  title,
  text,
}: {
  href?: string;
  title: string;
  text: string;
}) {
  const content = (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/40">
      <h3 className="text-base font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{text}</p>
    </article>
  );

  if (!href) return content;

  return (
    <a href={href} className="block h-full no-underline">
      {content}
    </a>
  );
}

export default function Page() {
  const example2010 = row("2010");
  const example2020 = row("2020");
  const example2024 = row("2024");

  const popularQueries = [
    {
      href: "#year-2010",
      title: "2010 dolar kuru kaç TL idi?",
      text: `2010 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(example2010.usd)} TL seviyesindeydi.`,
    },
    {
      href: "#year-2015",
      title: "2015 dolar kuru kaç TL idi?",
      text: `2015 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(usd2015)} TL seviyesindeydi.`,
    },
    {
      href: "#year-2020",
      title: "2020 dolar kuru kaç TL idi?",
      text: `2020 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(usd2020)} TL seviyesindeydi.`,
    },
    {
      href: "#year-2021",
      title: "2021 dolar kuru kaç TL idi?",
      text: `2021 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(usd2021)} TL seviyesindeydi.`,
    },
    {
      href: "#year-2022",
      title: "2022 dolar kuru kaç TL idi?",
      text: `2022 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(usd2022)} TL seviyesindeydi.`,
    },
    {
      href: "#year-2023",
      title: "2023 dolar kuru kaç TL idi?",
      text: `2023 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(usd2023)} TL seviyesindeydi.`,
    },
    {
      href: "#year-2024",
      title: "2024 dolar kuru kaç TL idi?",
      text: `2024 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(usd2024)} TL seviyesindeydi.`,
    },
    {
      href: "#year-2025",
      title: "2025 dolar kuru kaç TL idi?",
      text: `2025 yılında USD/TL yıllık ortalaması yaklaşık ${formatRate(usd2025)} TL seviyesinde kabul ediliyorsa veri notuyla okunmalıdır.`,
    },
    {
      href: `#year-${tenYearRow.year}`,
      title: "10 yıl önce dolar ne kadardı?",
      text: `${tenYearsAgo} yılı için tablodaki en uygun USD/TL yıllık ortalaması ${tenYearRow.year} yılına ait yaklaşık ${formatRate(tenYearRow.usd)} TL değeridir.`,
    },
    {
      href: `#year-${fiveYearRow.year}`,
      title: "5 yıl önce dolar ne kadardı?",
      text: `${fiveYearsAgo} yılı için tablodaki en uygun USD/TL yıllık ortalaması ${fiveYearRow.year} yılına ait yaklaşık ${formatRate(fiveYearRow.usd)} TL değeridir.`,
    },
    {
      href: "#year-2010",
      title: "1000 TL 2010’da kaç dolardı?",
      text: `2010 USD/TL ortalaması ${formatRate(example2010.usd)} kabul edilirse 1000 TL yaklaşık ${formatCurrencyAmount(example2010.try1000ToUsd, "USD")} ederdi.`,
    },
    {
      href: "#year-2020",
      title: "100 dolar 2020’de kaç TL idi?",
      text: `2020 USD/TL ortalaması ${formatRate(example2020.usd)} kabul edilirse 100 dolar yaklaşık ${formatCurrencyTry(example2020.usd100ToTry)} ederdi.`,
    },
    {
      href: "#year-2024",
      title: "2010’dan 2024’e dolar kaç kat arttı?",
      text: `USD/TL yıllık ortalaması 2010’dan 2024’e yaklaşık ${formatMultiplier(usd2010To2024Multiplier)} kat arttı.`,
    },
    {
      title: "Geçmiş euro kuru nereden öğrenilir?",
      text: "Yıllık ortalama için bu sayfadaki EUR/TL tablosu, belirli gün için TCMB geçmiş döviz kurları ekranı kontrol edilmelidir.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#B84418]">
          Yıllık ortalama kur analizi
        </p>
        <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Geçmiş Döviz Kurları – Yıllara Göre Dolar, Euro ve Sterlin Kuru
        </h1>
        <p className="max-w-4xl text-lg leading-8 text-slate-700">
          2010’dan bugüne yıllık ortalama USD/TL, EUR/TL ve GBP/TL kurlarını karşılaştırın. Geçmiş yıllarda dolar, euro ve sterlinin kaç TL olduğunu, yıllık değişim oranlarını ve TL’nin döviz karşısındaki değer kaybını inceleyin.
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Veri notu:</strong> Bu sayfadaki değerler yıllık ortalama kur analizidir. Belirli bir güne ait resmi kur, TCMB geçmiş döviz kurları veya ilgili kurumun açıkladığı günlük gösterge kur üzerinden kontrol edilmelidir. Günlük TCMB gösterge kuru, alış kuru, satış kuru, efektif kur ve serbest piyasa kuru farklı olabilir.
        </div>
      </section>

      <section className="mt-10 space-y-4" aria-labelledby="historical-fx-tool">
        <h2 id="historical-fx-tool" className="text-2xl font-bold tracking-tight text-slate-950">
          Geçmiş Döviz Kuru Sorgulama Aracı
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-950">TL’den dövize</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              2010 yılında 1000 TL, yıllık ortalama USD/TL kuru {formatRate(example2010.usd)} kabul edildiğinde yaklaşık <strong>{formatCurrencyAmount(example2010.try1000ToUsd, "USD")}</strong> ederdi.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-950">Dövizden TL’ye</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              2020 yılında 100 dolar, yıllık ortalama USD/TL kuru {formatRate(example2020.usd)} kabul edildiğinde yaklaşık <strong>{formatCurrencyTry(example2020.usd100ToTry)}</strong> ederdi.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-950">İki yıl karşılaştırma</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              2010’dan 2024’e USD/TL yıllık ortalaması yaklaşık <strong>{formatMultiplier(usd2010To2024Multiplier)} kat</strong> arttı. Bu oran geçmiş kur seviyelerini anlamak içindir.
            </p>
          </article>
        </div>
        <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          Formüller: TL’den dövize = TL tutarı / yıllık ortalama kur. Dövizden TL’ye = döviz tutarı × yıllık ortalama kur. Sonuçlar günlük işlem kuru değil, yıllık ortalama analiz değeridir.
        </p>
      </section>

      <section className="mt-10 space-y-4" aria-labelledby="annual-rates-table">
        <div>
          <h2 id="annual-rates-table" className="text-2xl font-bold tracking-tight text-slate-950">
            Yıllık Ortalama Döviz Kurları Tablosu
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            2026 satırı yıl tamamlanmadan kesin yıllık ortalama gibi yorumlanmamalıdır; geçici/yıl içi/projeksiyon değer olarak işaretlenmiştir.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr className="whitespace-nowrap">
                <th className="px-4 py-4 font-semibold">Yıl</th>
                <th className="px-4 py-4 font-semibold">USD/TL ortalama</th>
                <th className="px-4 py-4 font-semibold">EUR/TL ortalama</th>
                <th className="px-4 py-4 font-semibold">GBP/TL ortalama</th>
                <th className="px-4 py-4 font-semibold">USD yıllık değişim</th>
                <th className="px-4 py-4 font-semibold">EUR yıllık değişim</th>
                <th className="px-4 py-4 font-semibold">GBP yıllık değişim</th>
                <th className="px-4 py-4 font-semibold">1000 TL kaç USD ederdi?</th>
                <th className="px-4 py-4 font-semibold">1000 TL kaç EUR ederdi?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {ROWS_DESC.map((item) => (
                <tr key={item.year} className="hover:bg-slate-50">
                  <td id={`year-${item.year}`} className="scroll-mt-24 px-4 py-3 font-bold text-slate-950">
                    {item.year}
                    <RateNote year={item.year} />
                  </td>
                  <td className="px-4 py-3">{formatCurrencyTry(item.usd)}</td>
                  <td className="px-4 py-3">{formatCurrencyTry(item.eur)}</td>
                  <td className="px-4 py-3">{formatCurrencyTry(item.gbp)}</td>
                  <td className="px-4 py-3"><ChangeValue value={item.usdChangePercent} /></td>
                  <td className="px-4 py-3"><ChangeValue value={item.eurChangePercent} /></td>
                  <td className="px-4 py-3"><ChangeValue value={item.gbpChangePercent} /></td>
                  <td className="px-4 py-3">{formatCurrencyAmount(item.try1000ToUsd, "USD")}</td>
                  <td className="px-4 py-3">{formatCurrencyAmount(item.try1000ToEur, "EUR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          Bu tablo yıllık ortalama kur seviyelerini gösterir. Günlük alış/satış kuru veya belirli bir tarihteki TCMB gösterge kuru ile birebir aynı olmayabilir.
        </p>
      </section>

      <div className="mt-12 space-y-12">
        <Section title="Yıllara Göre Dolar Kuru">
          <p>
            Yıllara göre dolar kuru, Türk Lirası’nın ABD doları karşısındaki değişimini izlemek için kullanılan en temel göstergelerden biridir. Bu tabloda USD/TL yıllık ortalama değerleri ve bir önceki yıla göre değişim oranları yer alır. Yıllık ortalama kur, tek bir günün kurundan farklı olarak yıl içindeki genel seviyeyi gösterir.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li>2010 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2010)} TL idi.</li>
            <li>2015 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2015)} TL idi.</li>
            <li>2020 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2020)} TL idi.</li>
            <li>2021 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2021)} TL idi.</li>
            <li>2022 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2022)} TL idi.</li>
            <li>2023 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2023)} TL idi.</li>
            <li>2024 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2024)} TL idi.</li>
            <li>2025 dolar kuru yıllık ortalama yaklaşık {formatRate(usd2025)} TL seviyesinde kabul ediliyorsa veri notuyla gösterilmelidir.</li>
          </ul>
        </Section>

        <Section title="Yıllara Göre Euro Kuru">
          <p>
            Yıllara göre euro kuru, özellikle Avrupa ile ticaret, ithalat, ihracat, eğitim, seyahat ve sözleşme hesaplamalarında kullanılır. EUR/TL yıllık ortalaması, ilgili yıldaki genel euro seviyesini anlamaya yardımcı olur. Belirli bir güne ait resmi işlem kuru gerekiyorsa TCMB geçmiş döviz kurları ekranı kontrol edilmelidir.
          </p>
        </Section>

        <Section title="Yıllara Göre Sterlin Kuru">
          <p>
            Sterlin/TL kuru, İngiltere ile ticaret, eğitim ve yatırım kararlarında takip edilen önemli göstergelerden biridir. GBP/TL yıllık ortalamaları, sterlinin TL karşısındaki uzun vadeli değişimini analiz etmek için kullanılabilir.
          </p>
        </Section>

        <Section title="5 Yıl ve 10 Yıl Önce Dolar Ne Kadardı?">
          <p>
            Kullanıcılar geçmiş döviz kurlarını çoğunlukla “5 yıl önce dolar kaç TL idi?” veya “10 yıl önce dolar ne kadardı?” sorularıyla arar. Bu sayfada seçilen yılın yıllık ortalama USD/TL kuru üzerinden geçmişteki TL ve dolar karşılığı hesaplanabilir. Günlük kur yerine yıllık ortalama kullanıldığı için sonuçlar genel dönem analizi içindir.
          </p>
          <p>
            {currentYear} yılı baz alındığında 10 yıl önce {tenYearsAgo} yılıdır. Tablodaki en uygun satır {tenYearRow.year} yılıdır ve USD/TL yıllık ortalaması yaklaşık {formatRate(tenYearRow.usd)} TL seviyesindedir. 5 yıl önce için baz yıl {fiveYearsAgo}; tablodaki en uygun değer {fiveYearRow.year} yılına ait yaklaşık {formatRate(fiveYearRow.usd)} TL seviyesidir.
          </p>
        </Section>

        <Section title="TL’nin Dolar ve Euro Karşısındaki Değer Kaybı">
          <p>
            TL’nin dolar ve euro karşısındaki değer kaybı, yıllık ortalama kurların zaman içinde nasıl değiştiğine bakılarak analiz edilebilir. Başlangıç ve bitiş yıllarındaki kur ortalamaları karşılaştırılarak döviz kurunun kaç kat arttığı ve yüzde değişimi hesaplanabilir. Bu analiz geçmiş kur seviyelerini anlamak içindir; yatırım tavsiyesi değildir.
          </p>
          <p>
            Örneğin USD/TL yıllık ortalaması 2010’daki {formatRate(usd2010)} TL seviyesinden 2024’te {formatRate(example2024.usd)} TL seviyesine çıkmıştır. Bu, yaklaşık {formatMultiplier(usd2010To2024Multiplier)} kat ve {formatPercent(usd2010To2024Percent)} değişim anlamına gelir.
          </p>
        </Section>

        <Section title="Yıllık Ortalama Kur Nasıl Hesaplanır?">
          <p>
            Yıllık ortalama kur, ilgili yıl içindeki işlem günlerinde açıklanan döviz kurlarının ortalaması alınarak hesaplanır. Bu yöntem, yıl içinde tek bir güne ait ani kur hareketlerinin etkisini azaltır ve muhasebe, finansal analiz, sözleşme uyarlamaları veya geçmiş maliyet hesaplamaları için daha dengeli bir referans sağlar.
          </p>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-orange-200">
            Yıllık ortalama kur = yıl içindeki günlük kurların toplamı / işlem günü sayısı
          </div>
        </Section>

        <Section title="Günlük Kur ile Yıllık Ortalama Kur Arasındaki Fark">
          <p>
            Günlük kur, belirli bir tarihte geçerli olan döviz kurunu gösterir. Yıllık ortalama kur ise yıl boyunca oluşan kurların ortalamasıdır. Belirli bir fatura, gümrük, resmi işlem veya sözleşme için günlük kur gerekebilir; uzun dönem karşılaştırması veya yıllık analiz için yıllık ortalama kur daha anlamlı olabilir.
          </p>
        </Section>

        <Section title="TCMB Geçmiş Döviz Kurları Nasıl Kullanılır?">
          <p>
            TCMB geçmiş döviz kurları, belirli tarihlerde açıklanan gösterge niteliğindeki döviz kurlarını incelemek için kullanılabilir. Resmi, hukuki veya muhasebe amaçlı işlemlerde hangi kurun kullanılacağı işlem türüne ve mevzuata göre değişebilir. Bu sayfadaki yıllık ortalama değerler genel analiz ve karşılaştırma amacıyla sunulur.
          </p>
        </Section>

        <Section title="Geçmiş Döviz Kurları Örnek Hesaplamaları">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-950">2010 yılında 1000 TL kaç dolardı?</h3>
              <p className="mt-2 text-sm leading-6">
                2010 USD/TL ortalaması {formatRate(example2010.usd)} olduğu için 1000 / {formatRate(example2010.usd)} = <strong>{formatCurrencyAmount(example2010.try1000ToUsd, "USD")}</strong>.
              </p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-950">2020 yılında 100 dolar kaç TL idi?</h3>
              <p className="mt-2 text-sm leading-6">
                2020 USD/TL ortalaması {formatRate(example2020.usd)} olduğu için 100 × {formatRate(example2020.usd)} = <strong>{formatCurrencyTry(example2020.usd100ToTry)}</strong>.
              </p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-950">2010’dan 2024’e dolar kuru kaç kat arttı?</h3>
              <p className="mt-2 text-sm leading-6">
                {formatRate(example2024.usd)} / {formatRate(example2010.usd)} = <strong>{formatMultiplier(usd2010To2024Multiplier)} kat</strong>.
              </p>
            </article>
          </div>
        </Section>

        <Section title="Veri Kaynağı, Hesaplama Yöntemi ve Finansal Uyarı">
          <p>
            Bu sayfadaki değerler yıllık ortalama döviz kuru analizi için hazırlanmıştır. Günlük kur, alış kuru, satış kuru, efektif kur ve TCMB gösterge kuru farklı amaçlarla kullanılabilir. Resmi işlem, muhasebe kaydı, vergi, dava, sözleşme veya geriye dönük ödeme hesaplarında kullanılacak kur türü ilgili mevzuata ve belge tarihine göre değişebilir. Bu sayfa yatırım tavsiyesi değildir; yalnızca bilgilendirme ve ön analiz amacı taşır.
          </p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800">
            Son veri/metodoloji kontrolü: {METHOD_REVIEW_DATE}
          </p>
        </Section>

        <section className="space-y-4" aria-labelledby="popular-historical-fx">
          <h2 id="popular-historical-fx" className="text-2xl font-bold tracking-tight text-slate-950">
            Popüler Geçmiş Kur Sorguları
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularQueries.map((item) => (
              <PopularQueryCard key={item.title} href={item.href} title={item.title} text={item.text} />
            ))}
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="related-tools">
          <h2 id="related-tools" className="text-2xl font-bold tracking-tight text-slate-950">
            İlgili Finans Araçları
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-800 hover:border-[#B84418] hover:text-[#B84418]" href="/finansal-hesaplamalar/doviz-hesaplama">canlı döviz hesaplama</Link>
            <Link className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-800 hover:border-[#B84418] hover:text-[#B84418]" href="/finansal-hesaplamalar/enflasyon-hesaplama">enflasyon hesaplama</Link>
            <Link className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-800 hover:border-[#B84418] hover:text-[#B84418]" href="/finansal-hesaplamalar/altin-hesaplama">altın hesaplama</Link>
            <Link className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-800 hover:border-[#B84418] hover:text-[#B84418]" href="/finansal-hesaplamalar/gecmis-altin-fiyatlari">geçmiş altın fiyatları</Link>
            <Link className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-800 hover:border-[#B84418] hover:text-[#B84418]" href="/finansal-hesaplamalar/reel-getiri-hesaplama">reel getiri hesaplama</Link>
            <Link className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-800 hover:border-[#B84418] hover:text-[#B84418]" href="/finansal-hesaplamalar/mevduat-faiz-hesaplama">mevduat faizi hesaplama</Link>
            <Link className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-800 hover:border-[#B84418] hover:text-[#B84418]" href="/maas-ve-vergi/gumruk-vergisi-hesaplama">gümrük vergisi hesaplama</Link>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-slate-950">
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group rounded-lg border border-slate-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-slate-950 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="text-lg text-[#B84418] transition group-open:rotate-180">⌄</span>
                </summary>
                <div className="border-t border-slate-100 px-5 py-4 text-sm leading-6 text-slate-700">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema) }}
      />
    </main>
  );
}
