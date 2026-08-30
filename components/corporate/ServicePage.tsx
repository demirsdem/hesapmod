import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, ChevronRight } from "lucide-react";
import type { CorporateService } from "@/lib/corporate-services";
import { getCorporateService } from "@/lib/corporate-services";
import CorporateCta from "./CorporateCta";
import CorporateSchema from "./CorporateSchema";

function ListSection({ title, intro, items }: { title: string; intro?: string; items: string[] }) {
    return (
        <section>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
            {intro ? <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{intro}</p> : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {items.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0E9] text-[#B83A12]"><Check size={15} aria-hidden="true" /></span><span className="text-sm font-medium leading-relaxed text-slate-700">{item}</span></div>)}
            </div>
        </section>
    );
}

export default function ServicePage({ service }: { service: CorporateService }) {
    const related = service.relatedServices.flatMap((slug) => { const item = getCorporateService(slug); return item ? [item] : []; });
    const heroSummary = service.deliverables.slice(0, 4);
    return (
        <main className="min-w-0 max-w-full bg-slate-50 text-slate-900">
            <CorporateSchema service={service} />
            <section className="border-b border-slate-200 bg-gradient-to-br from-white via-[#FFF9F6] to-[#FFF0E9]">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                    <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1 text-sm text-slate-600"><Link href="/" className="hover:text-[#B83A12]">Ana Sayfa</Link><ChevronRight size={14} aria-hidden="true" /><Link href="/kurumsal" className="hover:text-[#B83A12]">Kurumsal Yazılım</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{service.shortTitle}</span></nav>
                    <div className={`mt-10 grid items-center gap-10 ${heroSummary.length > 0 ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]" : ""}`}><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B83A12]">HesapMod Kurumsal</p><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">{service.title}</h1><p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 sm:text-xl">{service.description}</p><Link href={`/iletisim?konu=kurumsal-yazilim&hizmet=${encodeURIComponent(service.shortTitle)}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#B83A12] px-6 py-3 font-bold text-white transition hover:bg-[#962F10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">Bu hizmeti konuşalım <ArrowRight size={18} aria-hidden="true" /></Link></div>{heroSummary.length > 0 ? <aside className="rounded-2xl border border-orange-200/80 bg-white/75 p-6 shadow-sm backdrop-blur" aria-labelledby="service-summary-title"><h2 id="service-summary-title" className="text-lg font-black text-slate-950">Bu hizmet kapsamında</h2><ul className="mt-5 space-y-4">{heroSummary.map((item) => <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-slate-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#B83A12]" aria-hidden="true" /><span>{item}</span></li>)}</ul></aside> : null}</div>
                </div>
            </section>
            <div className="mx-auto grid max-w-7xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <ListSection title="Hangi sorunları çözüyoruz?" items={service.problems} />
                <ListSection title="Hizmet kapsamı" intro="Kapsam, analiz sonucunda gerçek ihtiyaca ve mevcut teknik ortama göre kesinleştirilir." items={service.capabilities} />
                <section><h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Nasıl çalışıyoruz?</h2><ol className="mt-6 grid gap-4 md:grid-cols-2">{service.process.map((item, index) => <li key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-sm font-black text-[#B83A12]">0{index + 1}</span><p className="mt-2 leading-relaxed text-slate-700">{item}</p></li>)}</ol></section>
                <div className="grid gap-12 lg:grid-cols-2"><ListSection title="Kimler için uygun?" items={service.suitableFor} /><ListSection title="Teslim edilebilecek çıktılar" items={service.deliverables} /></div>
                <section><h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Sık sorulan sorular</h2><div className="mt-6 space-y-3">{service.faq.map((item) => <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="cursor-pointer list-none pr-8 font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A12]">{item.question}</summary><p className="mt-3 leading-relaxed text-slate-600">{item.answer}</p></details>)}</div></section>
                <section><h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">İlgili hizmetler</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.slug} href={`/kurumsal/${item.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"><h3 className="font-bold text-slate-950 group-hover:text-[#B83A12]">{item.shortTitle}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{item.shortDescription}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#B83A12]">İncele <ArrowRight size={15} aria-hidden="true" /></span></Link>)}</div></section>
                <CorporateCta service={service.shortTitle} />
            </div>
        </main>
    );
}
