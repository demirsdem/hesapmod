import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProjectEstimator from "@/components/corporate/ProjectEstimator";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const path = "/kurumsal/yazilim-projesi-kapsam-hesaplama";
const title = "Yazılım Projesi Kapsam ve Süre Hesaplama";
const description = "Yazılım ihtiyacınızı adım adım tanımlayın; tahmini kapsam seviyesini, geliştirme süresini, MVP yaklaşımını ve teknik başlıkları görün.";
export const metadata: Metadata = { title: { absolute: `${title} | ${SITE_NAME}` }, description, alternates: { canonical: `${SITE_URL}${path}` }, robots: { index: true, follow: true }, openGraph: { title, description, url: `${SITE_URL}${path}`, siteName: SITE_NAME, type: "website", locale: "tr_TR" } };

const faqs = [
    { question: "Sonuç kesin proje süresi midir?", answer: "Hayır. Sonuç yalnız seçilen kapsam başlıklarına dayalı bir ön değerlendirmedir. Kesin süre, keşif ve teknik analiz sonrasında belirlenir." },
    { question: "Araç fiyat veya teklif hesaplar mı?", answer: "Hayır. Araç para veya fiyat aralığı göstermez; kapsam, fazlama, ekip ve teknik riskler için başlangıç çerçevesi sunar." },
    { question: "Proje özeti nasıl iletişim formuna aktarılır?", answer: "Özet yalnız aynı tarayıcı sekmesinin geçici session alanında tutulur, kurumsal forma bir kez aktarılır ve ardından temizlenir." },
];
const schema = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Kurumsal", item: `${SITE_URL}/kurumsal` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}${path}` }] },
    { "@context": "https://schema.org", "@type": "WebApplication", name: title, description, url: `${SITE_URL}${path}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", browserRequirements: "JavaScript etkin modern tarayıcı" },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
];

export default function ProjectEstimatorPage() {
    return <main className="min-w-0 max-w-full overflow-x-clip bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><section className="border-b border-slate-200 bg-gradient-to-br from-white via-orange-50 to-orange-100 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950/40"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"><nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-300"><Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A12]">Ana Sayfa</Link><ChevronRight size={14} aria-hidden="true" /><Link href="/kurumsal" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A12]">Kurumsal</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Kapsam Hesaplama</span></nav><p className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-[#B83A12] dark:text-orange-300">HesapMod Kurumsal</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Yazılım Projesi Kapsam ve Süre Hesaplama</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-200">İhtiyacınızı yedi kısa adımda tanımlayın; olası kapsamı, süre bandını, ilk fazı ve teknik başlıkları şeffaf bir ön değerlendirmeyle görün.</p></div></section><div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><ProjectEstimator /><p className="mt-5 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">Sonuçlar yalnız ön değerlendirmedir; kesin teklif, garanti veya teslim taahhüdü oluşturmaz.</p></div><section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8"><h2 className="text-3xl font-black text-slate-950 dark:text-white">Sık sorulan sorular</h2><div className="mt-7 space-y-4">{faqs.map((faq) => <article key={faq.question} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700"><h3 className="font-black text-slate-950 dark:text-white">{faq.question}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</p></article>)}</div></div></section></main>;
}
