import { CategoryIcon } from "@/components/category/CategoryIcon";
import { mainCategories, getCategoryName } from "@/lib/categories";
import { calculatorCount, calculatorSearchIndex, calculators } from "@/lib/calculators";
import type { CalculatorSearchEntry } from "@/lib/calculator-types";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import GlobalSearch from "@/components/search/GlobalSearch";
import Link from "next/link";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import HomeSEOContent from "@/components/home/HomeSEOContent";
import { getCalculatorLastModified } from "@/lib/content-last-modified";
import { getActivationRouteKey, newCalculatorActivationGroups } from "@/lib/organic-activation";
import {
    ArrowRight,
    Award,
    BarChart3,
    BookOpenCheck,
    Briefcase,
    Calculator,
    CalendarCheck,
    ChevronRight,
    CreditCard,
    Droplets,
    GraduationCap,
    Landmark,
    Layers3,
    Receipt,
    Ruler,
    Sparkles,
    Wallet,
    Zap,
} from "lucide-react";

const homeTitle = "HesapMod – Ücretsiz Online Hesaplama Araçları";
const homeDescription =
    "ALES, KPSS, Eurobond, kredi kartı faizi, KDV, takdir teşekkür, adım km, metreküp ve yüzlerce ücretsiz hesaplama aracını saniyeler içinde kullanın.";
const canonicalUrl = `${SITE_URL}/`;

const homepageSearchAliases: Record<string, string> = {
    "ales-puan-hesaplama": "ALES puan hesaplama ALES sayısal sözel eşit ağırlık",
    "eurobond-hesaplama": "Eurobond hesaplama eurobond vergi hesaplama eurobond getiri",
    "kredi-karti-gecikme-faizi-hesaplama": "Kredi kartı faizi kredi kartı gecikme faizi akdi faiz asgari ödeme",
    "takdir-tesekkur-hesaplama": "Takdir teşekkür hesaplama belge hesaplama okul not ortalaması",
    "test-basari-orani": "40 soruda 30 doğru kaç net test başarı oranı net hesaplama",
    "lise-taban-puanlari": "Lise taban puanları LGS yüzdelik dilim tercih rehberi",
    "adim-mesafe-hesaplama": "10000 adım kaç km adım km adım kilometre adım mesafe",
    "metrekup-hesaplama": "Metreküp hesaplama m3 hacim litre",
    "kdv-hesaplama": "KDV hesaplama KDV dahil KDV hariç matrah",
};

function sanitizeSearchText(value: string) {
    return value
        .replace(/resmi sonuç/gi, "nihai sonuç")
        .replace(/kesin sonuçlar/gi, "yaklaşık sonuçlar")
        .replace(/%100 gizlilik/gi, "gizlilik odaklı");
}

function toHomepageSearchEntry(entry: CalculatorSearchEntry): CalculatorSearchEntry {
    const alias = homepageSearchAliases[entry.slug] ?? entry.name.tr;

    return {
        id: entry.id,
        slug: entry.slug,
        category: entry.category,
        href: entry.href,
        name: entry.name,
        shortDescription: {
            tr: sanitizeSearchText(entry.shortDescription.tr),
            en: sanitizeSearchText(entry.shortDescription.en),
        },
        searchText: {
            tr: sanitizeSearchText(alias),
            en: sanitizeSearchText(entry.name.en),
        },
    };
}

export const metadata: Metadata = {
    title: { absolute: homeTitle },
    description: homeDescription,
    alternates: {
        canonical: canonicalUrl,
        languages: {
            "tr-TR": canonicalUrl,
            "en-US": `${SITE_URL}/en`,
            en: `${SITE_URL}/en`,
            "x-default": canonicalUrl,
        },
    },
    openGraph: {
        title: homeTitle,
        description: homeDescription,
        url: canonicalUrl,
        siteName: SITE_NAME,
        type: "website",
        locale: "tr_TR",
        images: [
            {
                url: `${SITE_URL}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: "HesapMod online hesaplama araçları",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: homeTitle,
        description: homeDescription,
        images: [`${SITE_URL}/opengraph-image`],
    },
};

type ToolCard = {
    href: string;
    icon: LucideIcon;
    color: string;
    name: string;
    desc: string;
};

type SimpleLink = {
    href: string;
    label: string;
};

const quickPills: SimpleLink[] = [
    { href: "/sinav-hesaplamalari/ales-puan-hesaplama", label: "ALES" },
    { href: "/sinav-hesaplamalari/kpss-puan-hesaplama", label: "KPSS" },
    { href: "/sinav-hesaplamalari/yks-puan-hesaplama", label: "YKS" },
    { href: "/sinav-hesaplamalari/lgs-puan-hesaplama", label: "LGS" },
    { href: "/sinav-hesaplamalari/lise-taban-puanlari", label: "Lise Taban Puanları" },
    { href: "/finansal-hesaplamalar/eurobond-hesaplama", label: "Eurobond" },
    { href: "/finansal-hesaplamalar/kredi-karti-gecikme-faizi-hesaplama", label: "Kredi Kartı Faizi" },
    { href: "/sinav-hesaplamalari/takdir-tesekkur-hesaplama", label: "Takdir Teşekkür" },
    { href: "/zaman-hesaplama/kac-gun-oldu-hesaplama", label: "Kaç Gün Geçti" },
    { href: "/yasam-hesaplama/adim-mesafe-hesaplama", label: "Adım KM" },
    { href: "/finansal-hesaplamalar/kdv-hesaplama", label: "KDV" },
    { href: "/yasam-hesaplama/gunluk-su-ihtiyaci-hesaplama", label: "Günlük Su" },
    { href: "/insaat-muhendislik/metrekup-hesaplama", label: "Metreküp" },
    { href: "/insaat-muhendislik/tugla-hesaplama", label: "Tuğla" },
];

const featuredTools: ToolCard[] = [
    {
        href: "/sinav-hesaplamalari/ales-puan-hesaplama",
        icon: GraduationCap,
        color: "text-cyan-700 bg-cyan-50",
        name: "ALES Puan Hesaplama",
        desc: "Sayısal, sözel ve eşit ağırlık ALES puanınızı netlerinize göre hesaplayın.",
    },
    {
        href: "/finansal-hesaplamalar/eurobond-hesaplama",
        icon: Landmark,
        color: "text-emerald-700 bg-emerald-50",
        name: "Eurobond Hesaplama",
        desc: "Kupon faizi, alış fiyatı ve vade bilgileriyle yaklaşık eurobond getirisini görün.",
    },
    {
        href: "/finansal-hesaplamalar/kredi-karti-gecikme-faizi-hesaplama",
        icon: CreditCard,
        color: "text-[#CC4A1A] bg-[#FFF3EE]",
        name: "Kredi Kartı Gecikme Faizi",
        desc: "Akdi faiz, gecikme faizi ve dönem borcu için yaklaşık maliyeti hesaplayın.",
    },
    {
        href: "/sinav-hesaplamalari/takdir-tesekkur-hesaplama",
        icon: Award,
        color: "text-amber-700 bg-amber-50",
        name: "Takdir Teşekkür Hesaplama",
        desc: "Ortaokul ve lise not ortalamasına göre belge durumunuzu kontrol edin.",
    },
    {
        href: "/sinav-hesaplamalari/kpss-puan-hesaplama",
        icon: GraduationCap,
        color: "text-sky-700 bg-sky-50",
        name: "KPSS Puan Hesaplama",
        desc: "Genel yetenek ve genel kültür netleriyle yaklaşık KPSS puanınızı görün.",
    },
    {
        href: "/sinav-hesaplamalari/yks-puan-hesaplama",
        icon: BookOpenCheck,
        color: "text-purple-700 bg-purple-50",
        name: "YKS Puan Hesaplama",
        desc: "TYT, AYT, YDT ve OBP etkisini aynı ekranda karşılaştırın.",
    },
    {
        href: "/sinav-hesaplamalari/tyt-puan-hesaplama",
        icon: BookOpenCheck,
        color: "text-violet-700 bg-violet-50",
        name: "TYT Puan Hesaplama",
        desc: "TYT netlerinize göre ham puan ve OBP'li ön izleme alın.",
    },
    {
        href: "/finansal-hesaplamalar/ticari-kredi-hesaplama",
        icon: Briefcase,
        color: "text-indigo-700 bg-indigo-50",
        name: "Ticari Kredi Hesaplama",
        desc: "Şirket kredilerinde taksit, toplam ödeme ve maliyeti planlayın.",
    },
    {
        href: "/finansal-hesaplamalar/ticari-arac-kredisi-hesaplama",
        icon: Wallet,
        color: "text-lime-700 bg-lime-50",
        name: "Ticari Araç Kredisi",
        desc: "Ticari taşıt kredisi için vade, taksit ve maliyet etkisini görün.",
    },
    {
        href: "/finansal-hesaplamalar/kdv-hesaplama",
        icon: Receipt,
        color: "text-sky-700 bg-sky-50",
        name: "KDV Hesaplama",
        desc: "KDV dahil, KDV hariç, matrah ve vergi tutarını hızlıca hesaplayın.",
    },
    {
        href: "/zaman-hesaplama/kac-gun-oldu-hesaplama",
        icon: CalendarCheck,
        color: "text-rose-700 bg-rose-50",
        name: "Kaç Gün Oldu Hesaplama",
        desc: "Belirli bir tarihten bugüne kaç gün geçtiğini bulun.",
    },
    {
        href: "/yasam-hesaplama/adim-mesafe-hesaplama",
        icon: Ruler,
        color: "text-teal-700 bg-teal-50",
        name: "Adım Mesafe Hesaplama",
        desc: "Adım sayınızı metre ve kilometre karşılığına çevirin.",
    },
    {
        href: "/yasam-hesaplama/gunluk-su-ihtiyaci-hesaplama",
        icon: Droplets,
        color: "text-blue-700 bg-blue-50",
        name: "Günlük Su İhtiyacı",
        desc: "Kilo ve aktivite düzeyine göre günlük su ihtiyacınızı tahmini görün.",
    },
    {
        href: "/insaat-muhendislik/metrekup-hesaplama",
        icon: Layers3,
        color: "text-stone-700 bg-stone-100",
        name: "Metreküp Hesaplama",
        desc: "m3 hacim, litre ve ölçü dönüşümlerini hızlıca hesaplayın.",
    },
    {
        href: "/insaat-muhendislik/tugla-hesaplama",
        icon: Calculator,
        color: "text-orange-700 bg-orange-50",
        name: "Tuğla Hesaplama",
        desc: "Duvar alanına göre yaklaşık tuğla adedi ve m2 ihtiyacını görün.",
    },
    {
        href: "/matematik-hesaplama/hacim-hesaplama",
        icon: Calculator,
        color: "text-slate-700 bg-slate-100",
        name: "Hacim Hesaplama",
        desc: "Temel üç boyutlu şekiller için hacim hesabı yapın.",
    },
    {
        href: "/yasam-hesaplama/yasam-suresi-hesaplama",
        icon: Sparkles,
        color: "text-pink-700 bg-pink-50",
        name: "Yaşam Süresi Hesaplama",
        desc: "Ortalama ömür beklentisini varsayımlarla yaklaşık değerlendirin.",
    },
    {
        href: "/finansal-hesaplamalar/bono-hesaplama",
        icon: BarChart3,
        color: "text-emerald-700 bg-emerald-50",
        name: "Bono Hesaplama",
        desc: "Hazine bonosu ve iskontolu borçlanma araçlarında getiriyi görün.",
    },
];

const popularSearches: Array<ToolCard & { searchLabel: string }> = [
    {
        ...featuredTools[0],
        searchLabel: "ALES puan hesaplama",
        desc: "ALES sayısal, sözel ve eşit ağırlık puanınızı netlerinize göre hesaplayın.",
    },
    {
        ...featuredTools[1],
        searchLabel: "Eurobond getiri hesaplama",
        desc: "Kupon faizi, alış fiyatı, vade ve vergi durumuna göre yaklaşık getiriyi görün.",
    },
    {
        href: "/rehber/eurobond-vergi-hesaplama-2026",
        icon: Landmark,
        color: "text-emerald-700 bg-emerald-50",
        name: "Eurobond Vergi Hesaplama 2026",
        searchLabel: "Eurobond vergi hesaplama 2026",
        desc: "Eurobond gelir vergisi, beyan sınırı ve yaklaşık vergi yükünü öğrenin.",
    },
    {
        ...featuredTools[2],
        searchLabel: "Kredi kartı gecikme faizi hesaplama",
        desc: "Akdi faiz, gecikme faizi ve asgari ödeme sonrası maliyeti hesaplayın.",
    },
    {
        ...featuredTools[3],
        searchLabel: "Takdir teşekkür hesaplama",
        desc: "Ortaokul ve lise not ortalamasına göre belge durumunuzu kontrol edin.",
    },
    {
        ...featuredTools[10],
        searchLabel: "Kaç gün geçti?",
        desc: "Belirli bir tarihten bugüne kaç gün geçtiğini hesaplayın.",
    },
    {
        ...featuredTools[12],
        searchLabel: "Günlük su ihtiyacı hesaplama",
        desc: "Kilo, yaş ve aktivite düzeyine göre günlük su ihtiyacınızı tahmini görün.",
    },
    {
        ...featuredTools[11],
        searchLabel: "Adım kilometre hesaplama",
        desc: "Adım sayısını metre ve kilometreye çevirin.",
    },
    {
        ...featuredTools[8],
        searchLabel: "Ticari araç kredisi hesaplama",
        desc: "Şirket veya vergi levhası sahibi kullanıcılar için ticari taşıt kredisi maliyetini hesaplayın.",
    },
    {
        ...featuredTools[9],
        searchLabel: "KDV hesaplama",
        desc: "KDV dahil, KDV hariç ve matrah hesaplamalarını hızlıca yapın.",
    },
    {
        ...featuredTools[13],
        searchLabel: "Metreküp hesaplama",
        desc: "Hacim, m3 ve ölçü dönüşümlerini kolayca hesaplayın.",
    },
    {
        ...featuredTools[14],
        searchLabel: "Tuğla hesaplama",
        desc: "Duvar alanına göre yaklaşık tuğla adedi ve m2 hesabı yapın.",
    },
];

const categoryHighlights: Partial<Record<string, SimpleLink[]>> = {
    "sinav-hesaplamalari": [
        { href: "/sinav-hesaplamalari/ales-puan-hesaplama", label: "ALES" },
        { href: "/sinav-hesaplamalari/kpss-puan-hesaplama", label: "KPSS" },
        { href: "/sinav-hesaplamalari/yks-puan-hesaplama", label: "YKS" },
        { href: "/sinav-hesaplamalari/lgs-puan-hesaplama", label: "LGS Puan Hesaplama" },
        { href: "/sinav-hesaplamalari/lise-taban-puanlari", label: "Lise Taban Puanları" },
        { href: "/sinav-hesaplamalari/tyt-puan-hesaplama", label: "TYT" },
        { href: "/sinav-hesaplamalari/takdir-tesekkur-hesaplama", label: "Takdir Teşekkür" },
        { href: "/sinav-hesaplamalari/test-basari-orani", label: "Test Başarı Oranı" },
    ],
    "finansal-hesaplamalar": [
        { href: "/finansal-hesaplamalar/eurobond-hesaplama", label: "Eurobond" },
        { href: "/finansal-hesaplamalar/bono-hesaplama", label: "Bono" },
        { href: "/finansal-hesaplamalar/kredi-karti-gecikme-faizi-hesaplama", label: "Kredi Kartı Faizi" },
        { href: "/finansal-hesaplamalar/kdv-hesaplama", label: "KDV" },
        { href: "/finansal-hesaplamalar/ticari-kredi-hesaplama", label: "Ticari Kredi" },
        { href: "/finansal-hesaplamalar/ticari-arac-kredisi-hesaplama", label: "Ticari Araç Kredisi" },
    ],
    "maas-ve-vergi": [
        { href: "/maas-ve-vergi/maas-hesaplama", label: "Maaş" },
        { href: "/finansal-hesaplamalar/kdv-hesaplama", label: "KDV" },
        { href: "/maas-ve-vergi/gumruk-vergisi-hesaplama", label: "Gümrük Vergisi" },
        { href: "/muhasebe/yillik-izin-ucreti-hesaplama", label: "Yıllık İzin Ücreti" },
        { href: "/hukuk/icra-masrafi-hesaplama", label: "İcra Masrafı" },
    ],
    "zaman-hesaplama": [
        { href: "/zaman-hesaplama/kac-gun-oldu-hesaplama", label: "Kaç Gün Oldu" },
        { href: "/zaman-hesaplama/iki-tarih-arasi-fark-gun-hesaplama", label: "İki Tarih Arası Fark" },
        { href: "/zaman-hesaplama/yas-hesaplama", label: "Yaş Hesaplama" },
        { href: "/zaman-hesaplama/doguma-kalan-gun", label: "Doğuma Kalan Gün" },
        { href: "/zaman-hesaplama/kac-gun-kaldi-hesaplama", label: "Kaç Gün Kaldı" },
    ],
    "yasam-hesaplama": [
        { href: "/yasam-hesaplama/yasam-suresi-hesaplama", label: "Yaşam Süresi" },
        { href: "/yasam-hesaplama/gunluk-su-ihtiyaci-hesaplama", label: "Günlük Su İhtiyacı" },
        { href: "/yasam-hesaplama/adim-mesafe-hesaplama", label: "Adım Mesafe" },
        { href: "/yasam-hesaplama/kas-kutlesi-hesaplama", label: "Kas Kütlesi" },
        { href: "/yasam-hesaplama/kalori-yakma-hesaplama", label: "Kalori" },
    ],
    "insaat-muhendislik": [
        { href: "/insaat-muhendislik/metrekup-hesaplama", label: "Metreküp" },
        { href: "/matematik-hesaplama/hacim-hesaplama", label: "Hacim" },
        { href: "/insaat-muhendislik/tugla-hesaplama", label: "Tuğla" },
        { href: "/insaat-muhendislik/beton-hesaplama", label: "Beton" },
        { href: "/insaat-muhendislik/demir-hesaplama", label: "Demir" },
        { href: "/insaat-muhendislik/cimento-hesaplama", label: "Çimento" },
    ],
    "matematik-hesaplama": [
        { href: "/matematik-hesaplama/oran-hesaplama", label: "Oran" },
        { href: "/matematik-hesaplama/oranti-hesaplama", label: "Orantı" },
        { href: "/matematik-hesaplama/hacim-hesaplama", label: "Hacim" },
        { href: "/matematik-hesaplama/logaritma-hesaplama", label: "Logaritma" },
        { href: "/matematik-hesaplama/determinant-hesaplama", label: "Determinant" },
        { href: "/matematik-hesaplama/kesir-sadelestirme", label: "Sadeleştirme" },
    ],
};

function formatDateLabel(date: Date) {
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export default function Home() {
    const homepageSearchIndex = calculatorSearchIndex.map(toHomepageSearchEntry);
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
    const calculatorByRoute = new Map(
        calculators.map((calculator) => [getActivationRouteKey(calculator), calculator])
    );
    const newCalculatorGroups = newCalculatorActivationGroups
        .map((group) => ({
            ...group,
            items: group.routes.flatMap((route) => {
                const calculator = calculatorByRoute.get(getActivationRouteKey(route));
                return calculator ? [calculator] : [];
            }),
        }))
        .filter((group) => group.items.length > 0);

    const homepageStructuredData = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": SITE_URL,
            "name": SITE_NAME,
            "inLanguage": "tr-TR",
            "description": homeDescription,
            "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Öne Çıkan Hesaplama Araçları",
            "itemListElement": featuredTools.map((tool, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": tool.name,
                "url": `${SITE_URL}${tool.href}`,
                "description": tool.desc,
            })),
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#FF6B35]/25">
            <section className="relative bg-gradient-to-br from-[#201712] via-[#69351F] to-[#FF6B35]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
                    <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/4" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
                    <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                        Ücretsiz Online Hesaplama Araçları
                    </h1>
                    <p className="mb-5 text-sm text-white/85 leading-relaxed max-w-2xl mx-auto md:text-base">
                        ALES, KPSS, Eurobond, kredi kartı faizi, KDV, takdir teşekkür, adım-km, metreküp, finans, sınav, vergi, inşaat ve yaşam hesaplamalarını saniyeler içinde yapın.
                    </p>

                    <div className="mb-3 text-left max-w-2xl mx-auto">
                        <p className="mb-2 text-xs font-semibold text-white/90 md:text-sm">
                            Hangi hesaplamayı yapmak istiyorsunuz?
                        </p>
                        <div className="w-full rounded-xl bg-white shadow-lg shadow-black/20">
                            <GlobalSearch entries={homepageSearchIndex} />
                        </div>
                    </div>

                    <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
                        {quickPills.map((pill) => (
                            <Link
                                key={pill.href}
                                href={pill.href}
                                className="flex min-h-10 flex-shrink-0 items-center rounded-full border border-white/25 bg-white/15 px-3 py-2 text-[11px] font-semibold text-white/90 whitespace-nowrap transition hover:bg-white/25"
                            >
                                {pill.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 text-left sm:grid-cols-5">
                        {[
                            `${calculatorCount}+ araç`,
                            `${mainCategories.length} kategori`,
                            "Ücretsiz kullanım",
                            "Gizlilik odaklı",
                            "Güncel formüller",
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-center text-[11px] font-semibold text-white/85 sm:last:col-auto"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pt-5 pb-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-[15px] font-bold text-slate-900 md:text-2xl">Öne Çıkan Araçlar</h2>
                            <p className="mt-0.5 hidden text-sm text-slate-600 md:block">
                                En çok kullanılan sınav, finans, tarih, yaşam ve inşaat araçlarına hızlı geçiş.
                            </p>
                        </div>
                        <Link href="/tum-araclar" className="flex items-center gap-0.5 text-[12px] font-semibold text-[#CC4A1A]">
                            Tüm araçları gör <ChevronRight size={13} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    className="group flex min-h-[112px] gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-[#FFD7C7] hover:shadow-md active:scale-[0.99]"
                                >
                                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tool.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[13px] font-bold text-slate-900 leading-tight group-hover:text-[#CC4A1A] md:text-sm">
                                            {tool.name}
                                        </span>
                                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 md:text-xs">
                                            {tool.desc}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-6 md:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 max-w-3xl">
                        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">En Çok Aranan Hesaplamalar</h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            Google'da en çok aranan hesaplama ihtiyaçlarına hızlıca ulaşın. Sınav, finans, vergi, tarih, sağlık ve inşaat hesaplamalarını tek yerden açın.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {popularSearches.map((tool) => (
                            <Link
                                key={`${tool.href}-${tool.searchLabel}`}
                                href={tool.href}
                                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FFD7C7] hover:shadow-md"
                            >
                                <p className="text-[13px] font-bold leading-tight text-slate-900 group-hover:text-[#CC4A1A]">
                                    {tool.searchLabel}
                                </p>
                                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600">
                                    {tool.desc}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#CC4A1A]">
                                    Aracı aç <ArrowRight size={12} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pt-2 pb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-[15px] font-bold text-slate-900 md:text-2xl">Kategoriler</h2>
                            <p className="mt-0.5 hidden text-sm text-slate-600 md:block">
                                Her kategoride en sık aranan araçlara doğrudan geçin.
                            </p>
                        </div>
                        <Link href="/tum-araclar" className="flex items-center gap-0.5 text-[12px] font-semibold text-[#CC4A1A]">
                            Tüm araçları gör <ChevronRight size={13} />
                        </Link>
                    </div>

                    <div className="md:hidden -mx-4 sm:-mx-6 lg:-mx-8 flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {mainCategories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex min-w-[244px] flex-shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <Link href={`/kategori/${cat.slug}`} className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                        <CategoryIcon icon={cat.icon} size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[13px] font-bold text-slate-900 leading-tight">{cat.name.tr}</span>
                                        <p className="text-[10px] text-slate-400">{categoryCounts[cat.slug] ?? 0} araç</p>
                                    </div>
                                </Link>
                                {(categoryHighlights[cat.slug]?.length ?? 0) > 0 ? (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {categoryHighlights[cat.slug]?.slice(0, 5).map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {mainCategories.map((cat) => (
                            <div
                                key={cat.id}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FFD7C7] hover:shadow-md"
                            >
                                <Link href={`/kategori/${cat.slug}`} className="group flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#FFF3EE] group-hover:text-[#CC4A1A]">
                                        <CategoryIcon icon={cat.icon} size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">{cat.name.tr}</span>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">{categoryCounts[cat.slug] ?? 0} araç</span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{cat.description.tr}</p>
                                    </div>
                                </Link>
                                {(categoryHighlights[cat.slug]?.length ?? 0) > 0 ? (
                                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                                        {categoryHighlights[cat.slug]?.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-[#FFF3EE] hover:text-[#CC4A1A] hover:ring-[#FFD7C7]"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-white py-7 md:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-[15px] font-bold text-slate-900 md:text-2xl">
                                Yeni Eklenen Hesaplayıcılar
                            </h2>
                            <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-slate-600 md:text-sm">
                                Finans, maaş, matematik, eğitim, yaşam ve inşaat alanındaki güncel araçlar.
                            </p>
                        </div>
                        <Link
                            href="/tum-araclar"
                            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#CC4A1A] transition-colors hover:text-[#E55A26]"
                        >
                            Tüm araçlar <ArrowRight size={13} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {newCalculatorGroups.map((group) => (
                            <div
                                key={group.key}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {group.label}
                                    </h3>
                                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                                        {group.items.length} araç
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    {group.items.map((calculator) => (
                                        <Link
                                            key={`${calculator.category}/${calculator.slug}`}
                                            href={`/${calculator.category}/${calculator.slug}`}
                                            className="group flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2 text-[12px] font-semibold leading-snug text-slate-700 ring-1 ring-slate-200 transition hover:bg-[#FFF7F3] hover:text-[#CC4A1A] hover:ring-[#FFD7C7]"
                                        >
                                            <span>{calculator.name.tr}</span>
                                            <ChevronRight
                                                size={13}
                                                className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-[#CC4A1A]"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#CC4A1A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 justify-center md:justify-start">
                        <span className="text-[11px] font-bold text-white">Nasıl çalışıyoruz:</span>
                        {[
                            "Gereksiz veri saklamadan kullanım",
                            "Mevzuata bağlı araçlarda düzenli kontrol",
                            "Ücretsiz hesaplama deneyimi",
                        ].map((item) => (
                            <span key={item} className="text-[11px] font-medium text-white/85">{item}</span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-[15px] font-bold text-slate-900 md:text-2xl">Son Güncellenen Araçlar</h2>
                        <p className="mt-0.5 text-[12px] text-slate-600 md:text-sm">İçerik tarihi bulunan ve yakın dönemde gözden geçirilen hesaplayıcılar.</p>
                        </div>
                        <Link href="/tum-araclar" className="flex-shrink-0 flex items-center gap-0.5 text-[12px] font-semibold text-[#CC4A1A]">
                        Tüm araçları gör <ChevronRight size={13} />
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
                                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                                            {(calculator.shortDescription ?? calculator.description).tr}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 rounded-full bg-[#FFF3EE] px-2.5 py-1 text-[10px] font-bold text-[#CC4A1A]">
                                        Gözden geçirildi
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

            <section className="border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-xl font-bold text-slate-900 md:text-3xl">Neden HesapMod?</h2>
                        <p className="text-slate-600 mt-2 text-sm md:text-lg max-w-2xl mx-auto">
                            Türkiye&apos;deki hesaplama ihtiyaçlarına göre kurulmuş, formülünü açık bırakan araçlar.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                            {
                                icon: <Landmark size={24} />,
                                title: "Türkiye'ye göre hesaplar",
                                desc: "TL, KDV, SGK primi, MTV ve YKS-KPSS-ALES gibi sınav sistemleri Türkiye mevzuatındaki oran ve katsayılarla hesaplanır.",
                                color: "bg-[#FFF3EE] text-[#CC4A1A]",
                            },
                            {
                                icon: <BarChart3 size={24} />,
                                title: "Mevzuat değişince güncellenir",
                                desc: "Vergi oranı, tarife veya katsayı değiştiğinde ilgili araç ve içerik gözden geçirilir. Altın, döviz ve mevduat gibi canlı veri kullanan araçlarda son güncelleme zamanı ve veri kaynağı sayfada görünür.",
                                color: "bg-indigo-50 text-indigo-600",
                            },
                            {
                                icon: <Calculator size={24} />,
                                title: "Formül açık, tahmin ayrı",
                                desc: "Araçlarda kullanılan formül ve varsayımlar sayfada gösterilir. Yaklaşık tahmin veren hesaplarla kesin sonuç veren hesaplar birbirinden ayrı belirtilir.",
                                color: "bg-slate-100 text-slate-700",
                            },
                            {
                                icon: <Zap size={24} />,
                                title: "Sade ve hızlı",
                                desc: "Sonuca ulaşmak için üyelik veya kişisel veri girmeniz gerekmez. Hesaplamaların çoğu tarayıcınızda çalışır.",
                                color: "bg-emerald-50 text-emerald-600",
                            },
                        ].map(({ icon, title, desc, color }) => (
                            <div key={title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 md:flex-col md:text-center md:items-center md:gap-3">
                                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-[14px] md:text-lg">{title}</h3>
                                    <p className="text-slate-600 text-[12px] md:text-sm mt-0.5 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <HomeSEOContent />

            <Script id="homepage-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: JSON.stringify(homepageStructuredData),
            }} />
        </main>
    );
}
