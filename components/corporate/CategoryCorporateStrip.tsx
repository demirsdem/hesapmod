import { ArrowRight } from "lucide-react";
import TrackedLink from "@/components/analytics/TrackedLink";
import { normalizeCategorySlug } from "@/lib/categories";

export default function CategoryCorporateStrip({ category }: { category: string }) {
    const normalizedCategory = normalizeCategorySlug(category);
    return <section aria-labelledby="category-corporate-strip-title" className="mb-20 min-w-0 max-w-full overflow-hidden rounded-3xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900/70 dark:bg-orange-950/25 sm:p-8"><div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><h2 id="category-corporate-strip-title" className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Aradığınız araç tek başına yeterli değil mi?</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">İşletmenize özel hesaplama, raporlama, otomasyon ve entegrasyon sistemleri geliştiriyoruz.</p></div><TrackedLink href="/cozumler" corporateAnalytics={{ form_type: "corporate", service: normalizedCategory, cta_location: "category_context" }} className="inline-flex min-h-11 max-w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#B83A12] px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-[#962F10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">Kurumsal çözümleri inceleyin <ArrowRight size={16} aria-hidden="true" /></TrackedLink></div></section>;
}
