import { CategoryIcon } from "@/components/category/CategoryIcon";
import { mainCategories, getCategoryName } from "@/lib/categories";
import { calculatorCount, calculatorSearchIndex, calculators } from "@/lib/calculators";
import { Metadata } from "next";
import GlobalSearch from "@/components/search/GlobalSearch";
import Link from "next/link";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import HomeSEOContent from "@/components/home/HomeSEOContent";
import { getCalculatorLastModified } from "@/lib/content-last-modified";
import { ArrowRight, ShieldCheck, Zap, BarChart3, ChevronRight, Wallet, CreditCard, GraduationCap, Scale, Receipt, Briefcase, Calendar, Car, CalendarCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "HesapMod | Ücretsiz Online Hesaplama Araçları",
    description: `Finans, sağlık, matematik ve günlük yaşam için ${calculatorCount} adet ücretsiz, hızlı ve güvenilir hesaplama aracı. KDV, kredi, VKİ ve daha fazlası.`,
    alternates: { canonical: "/" },
};

/* Popüler araçlar — emoji + kısa ad */
const popularTools = [
    { href: "/maas-ve-vergi/maas-hesaplama",                     icon: Wallet,         color: "text-emerald-600 bg-emerald-50", name: "Net Maaş",      desc: "Brüt → Net hesapla"   },
    { href: "/finansal-hesaplamalar/kredi-taksit-hesaplama",      icon: CreditCard,     color: "text-[#CC4A1A] bg-[#FFF3EE]", name: "Kredi Taksit",  desc: "Ödeme planı çıkar"     },
    { href: "/sinav-hesaplamalari/yks-puan-hesaplama",            icon: GraduationCap,  color: "text-purple-600 bg-purple-50",  name: "YKS Puan",      desc: "TYT + AYT → ham puan"  },
    { href: "/yasam-hesaplama/vucut-kitle-indeksi-hesaplama",     icon: Scale,          color: "text-orange-600 bg-orange-50",  name: "BMI / VKİ",     desc: "İdeal kilo hesapla"    },
    { href: "/finansal-hesaplamalar/kdv-hesaplama",               icon: Receipt,        color: "text-sky-600 bg-sky-50",        name: "KDV",            desc: "Dahil / hariç bul"    },
    { href: "/maas-ve-vergi/kidem-tazminati-hesaplama",           icon: Briefcase,      color: "text-amber-600 bg-amber-50",    name: "Kıdem Tazminat", desc: "Toplu alacak hesapla"  },
    { href: "/zaman-hesaplama/yas-hesaplama",                     icon: Calendar,       color: "text-rose-600 bg-rose-50",      name: "Yaş Hesapla",   desc: "Gün bazında yaş bul"   },
    { href: "/tasit-ve-vergi/mtv-hesaplama",                      icon: Car,            color: "text-indigo-600 bg-indigo-50",  name: "MTV",            desc: "Taşıt vergisi bul"     },
];

/* Quick pill linkleri */
const quickPills = [
    { href: "/maas-ve-vergi/maas-hesaplama",                  label: "💰 Net Maaş" },
    { href: "/finansal-hesaplamalar/kredi-taksit-hesaplama",   label: "🏦 Kredi"   },
    { href: "/sinav-hesaplamalari/yks-puan-hesaplama",         label: "📚 YKS"     },
    { href: "/yasam-hesaplama/vucut-kitle-indeksi-hesaplama",  label: "⚖️ BMI"    },
    { href: "/tasit-ve-vergi/mtv-hesaplama",                   label: "🚗 MTV"     },
    { href: "/finansal-hesaplamalar/kdv-hesaplama",            label: "🧾 KDV"     },
];

function formatDateLabel(date: Date) {
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export default function Home() {
    const categoryCounts = calculatorSearchIndex.reduce<Record<string, number>>(
        (counts, entry) => {
            counts[entry.category] = (counts[entry.category] ?? 0) + 1;
            return counts;
        },
        {}
    );

    const recentlyUpdatedCalcs = calculators
        .map((c) => ({ ...c, lastModified: getCalculatorLastModified(c.slug) }))
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
        .slice(0, 9);

    const homepageStructuredData = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": SITE_URL,
            "name": SITE_NAME,
            "inLanguage": "tr-TR",
            "description": `Finans, sağlık, eğitim ve matematik kategorilerinde ${calculatorCount} adet ücretsiz online hesaplama araçları platformu.`,
            "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Popüler Hesaplama Araçları",
            "itemListElement": popularTools.map((tool, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": tool.name,
                "url": `${SITE_URL}${tool.href}`,
            })),
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#FF6B35]/25">

            {/* ══ HERO — Sıcak Turuncu / Koyu Kömür (Mobil Thumb Zone Optimized) ══ */}
            <section className="relative bg-gradient-to-br from-[#201712] via-[#69351F] to-[#FF6B35]">
                {/* arka plan süs daireleri — kendi overflow-hidden wrapper'ında */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
                    <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/4" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
                    {/* Badge */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white/90">
                        🔥 {calculatorCount} ücretsiz araç · 2026 güncel
                    </div>

                    {/* H1 */}
                    <h1 className="mb-2 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                        İhtiyacın olan<br />
                        <span className="text-[#FFD7C7]">hesaplama burada.</span>
                    </h1>
                    <p className="mb-6 text-sm text-white/70 leading-relaxed max-w-lg mx-auto">
                        Maaş, kredi, sınav, sağlık — saniyeler içinde, ücretsiz ve gizli.
                    </p>

                    {/* Arama */}
                    <div className="mb-5 w-full max-w-2xl mx-auto rounded-xl bg-white shadow-lg shadow-black/20">
                        <GlobalSearch entries={calculatorSearchIndex} />
                    </div>

                    {/* Quick Pills */}
                    <div className="flex flex-wrap gap-2 justify-center pb-1">
                        {quickPills.map((pill) => (
                            <Link
                                key={pill.href}
                                href={pill.href}
                                className="flex-shrink-0 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/90 whitespace-nowrap transition hover:bg-white/25"
                            >
                                {pill.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ STATS BAR ══ */}
            <section className="border-y border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-4 divide-x divide-slate-200">
                        {[
                            { num: calculatorCount.toString(), label: "Ücretsiz Araç" },
                            { num: mainCategories.length.toString(), label: "Kategori" },
                            { num: "%100", label: "Gizlilik" },
                            { num: "2026", label: "Güncel" },
                        ].map(({ num, label }) => (
                            <div key={label} className="flex flex-col items-center py-3">
                                <span className="font-extrabold text-[#CC4A1A] text-lg leading-tight font-sora">{num}</span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ EN ÇOK KULLANILAN — 2×2 Grid ══ */}
            <section className="pt-5 pb-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-[15px] font-bold text-slate-900">⚡ En Çok Kullanılan</h2>
                        <Link href="/tum-araclar" className="flex items-center gap-0.5 text-[12px] font-semibold text-[#CC4A1A]">
                            Tümü <ChevronRight size={13} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {popularTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="flex min-h-[72px] flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-[#FFD7C7] hover:shadow-md active:scale-[0.98]"
                            >
                                <div className={`mb-2 w-8 h-8 rounded-lg flex items-center justify-center ${tool.color}`}>
                                    <Icon size={18} />
                                </div>
                                <span className="text-[12px] font-bold text-slate-900 leading-tight">{tool.name}</span>
                                <span className="mt-0.5 text-[10px] text-slate-400 leading-tight">{tool.desc}</span>
                            </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══ KATEGORİLER — Yatay Scroll (Mobil) / Grid (Masaüstü) ══ */}
            <section className="pt-2 pb-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-[15px] font-bold text-slate-900">📂 Kategoriler</h2>
                        <Link href="/tum-araclar" className="flex items-center gap-0.5 text-[12px] font-semibold text-[#CC4A1A]">
                            Tümü <ChevronRight size={13} />
                        </Link>
                    </div>

                    {/* Mobil: yatay scroll */}
                    <div className="md:hidden -mx-4 sm:-mx-6 lg:-mx-8 flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {mainCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/kategori/${cat.slug}`}
                                className="flex flex-shrink-0 flex-col items-center rounded-xl border border-slate-200 bg-white p-3 min-w-[90px] text-center shadow-sm transition hover:border-[#FFD7C7]"
                            >
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                    <CategoryIcon icon={cat.icon} size={20} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 leading-tight">{cat.name.tr}</span>
                                <span className="mt-0.5 text-[10px] text-slate-400">{categoryCounts[cat.slug] ?? 0} araç</span>
                            </Link>
                        ))}
                    </div>

                    {/* Masaüstü: kompakt grid */}
                    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mainCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/kategori/${cat.slug}`}
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FFD7C7] hover:shadow-md group"
                            >
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#FFF3EE] group-hover:text-[#CC4A1A] transition-colors">
                                    <CategoryIcon icon={cat.icon} size={20} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-slate-900 group-hover:text-[#CC4A1A] transition-colors">{cat.name.tr}</span>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">{categoryCounts[cat.slug] ?? 0} araç</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.description.tr}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TRUST STRIP ══ */}
            <section className="bg-[#CC4A1A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 justify-center md:justify-start">
                        {[
                            "✅ Veri kaydedilmez",
                            "✅ 2026 güncel",
                            "✅ Tamamen ücretsiz",
                        ].map((item) => (
                            <span key={item} className="text-[11px] font-medium text-white/85">{item}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ SON GÜNCELLENEN ══ */}
            <section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-[15px] font-bold text-slate-900 md:text-2xl">Son Güncellenen Araçlar</h2>
                        <p className="mt-0.5 text-[12px] text-slate-500 md:text-sm">Yeni eklenen veya güncellenen hesaplayıcılar.</p>
                    </div>
                    <Link href="/tum-araclar" className="flex-shrink-0 flex items-center gap-0.5 text-[12px] font-semibold text-[#CC4A1A]">
                        Tümü <ChevronRight size={13} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {recentlyUpdatedCalcs.map((calculator) => (
                        <Link
                            key={calculator.slug}
                            href={`/${calculator.category}/${calculator.slug}`}
                            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FFD7C7] hover:shadow-md active:scale-[0.99]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        {getCategoryName(calculator.category, "tr")}
                                    </p>
                                    <h3 className="mt-1 text-[13px] font-bold text-slate-900 group-hover:text-[#CC4A1A] transition-colors leading-tight">
                                        {calculator.name.tr}
                                    </h3>
                                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                                        {(calculator.shortDescription ?? calculator.description).tr}
                                    </p>
                                </div>
                                <span className="flex-shrink-0 rounded-full bg-[#FFF3EE] px-2.5 py-1 text-[10px] font-bold text-[#CC4A1A]">
                                    Güncel
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                                <span>{formatDateLabel(calculator.lastModified)}</span>
                                <span className="font-semibold text-[#CC4A1A] group-hover:text-[#E55A26] flex items-center gap-0.5">
                                    Aracı aç <ArrowRight size={12} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                </div>
            </section>

            {/* ══ NEDEN HESAPMod ══ */}
            <section className="border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-xl font-bold text-slate-900 md:text-3xl">Neden HesapMod?</h2>
                        <p className="text-slate-500 mt-2 text-sm md:text-lg max-w-2xl mx-auto">Güvenli, hızlı ve güncel altyapı ile hesap yapmanın modern yolu.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { icon: <Zap size={24} />, title: "Anında Sonuç", desc: "Tuşa bastığınız an kesin sonuçlar ekranda türer.", color: "bg-[#FFF3EE] text-[#CC4A1A]" },
                            { icon: <ShieldCheck size={24} />, title: "%100 Gizlilik", desc: "Girdiğiniz veriler hiçbir sunucuya aktarılmaz.", color: "bg-emerald-50 text-emerald-600" },
                            { icon: <BarChart3 size={24} />, title: "Güncel Mevzuat", desc: "Değişen KDV, SGK ve YKS oranları düzenli güncellenir.", color: "bg-indigo-50 text-indigo-600" },
                        ].map(({ icon, title, desc, color }) => (
                            <div key={title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 md:flex-col md:text-center md:items-center md:gap-3">
                                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-[14px] md:text-lg">{title}</h3>
                                    <p className="text-slate-500 text-[12px] md:text-sm mt-0.5 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ SEO CONTENT ══ */}
            <HomeSEOContent />

            {/* ══ JSON-LD ══ */}
            <Script id="homepage-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify(homepageStructuredData)
            }} />
        </main>
    );
}
