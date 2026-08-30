import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getBusinessSolution } from "@/lib/business-solutions";
import { getCorporateService } from "@/lib/corporate-services";

const automation = getBusinessSolution("is-sureci-otomasyonu");
const reporting = getBusinessSolution("yonetim-paneli-ve-raporlama");
const web = getCorporateService("web-uygulamasi-gelistirme");
const mobile = getCorporateService("mobil-uygulama-gelistirme");
const integration = getCorporateService("api-entegrasyonu-ve-otomasyon");

const highlights = [
    { label: "İş süreci otomasyonu", description: automation?.shortDescription },
    { label: "Yönetim paneli ve raporlama", description: reporting?.shortDescription },
    { label: "Web ve mobil uygulamalar", description: [web?.shortDescription, mobile?.shortDescription].filter(Boolean).join(" ") },
    { label: "API ve sistem entegrasyonları", description: integration?.shortDescription },
].filter((item): item is { label: string; description: string } => Boolean(item.description));

export default function HomeCorporateTransition() {
    return <section aria-labelledby="home-corporate-title" className="min-w-0 max-w-full border-b border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 sm:py-8">
        <div className="mx-auto grid min-w-0 max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:items-center lg:px-8">
            <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B83A12] dark:text-orange-300">HESAPMOD KURUMSAL</p>
                <h2 id="home-corporate-title" className="mt-2 max-w-2xl text-2xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-3xl">İşletmenizdeki süreçleri yazılıma dönüştürelim</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">Manuel işleri, dağınık sistemleri ve işletmenize özel ihtiyaçları web, mobil, masaüstü ve entegrasyon çözümleriyle dijitalleştiriyoruz.</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link href="/iletisim?konu=kurumsal-yazilim" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B83A12] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#962F10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">Sürecinizi Anlatın <ArrowRight size={16} aria-hidden="true" /></Link>
                    <Link href="/cozumler" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-[#B83A12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-orange-500 dark:hover:text-orange-300">Çözümleri İnceleyin</Link>
                </div>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                {highlights.map(item => <div key={item.label} className="group min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"><div className="flex min-w-0 items-start gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#B83A12] dark:text-orange-300" aria-hidden="true" /><div className="min-w-0"><h3 className="break-words text-sm font-black text-slate-900 dark:text-white">{item.label}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p></div></div></div>)}
            </div>
        </div>
    </section>;
}
