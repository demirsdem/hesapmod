import Link from "next/link";

const existingLinks = [
    { href: "/finansal-hesaplamalar/gram-altin-hesaplama", label: "gram altın hesaplama" },
    { href: "/finansal-hesaplamalar/ceyrek-altin-hesaplama", label: "çeyrek altın hesaplama" },
    { href: "/finansal-hesaplamalar/22-ayar-bilezik-hesaplama", label: "22 ayar bilezik hesaplama" },
    { href: "/finansal-hesaplamalar/altin-bozdurma-hesaplama", label: "altın bozdurma hesaplama" },
    { href: "/finansal-hesaplamalar/tl-altin-hesaplama", label: "TL'den altına hesaplama" },
    { href: "/finansal-hesaplamalar/14-ayar-altin-hesaplama", label: "14 ayar altın hesaplama" },
    { href: "/finansal-hesaplamalar/18-ayar-altin-hesaplama", label: "18 ayar altın hesaplama" },
    { href: "/finansal-hesaplamalar/doviz-hesaplama", label: "döviz hesaplama" },
    { href: "/finansal-hesaplamalar/enflasyon-hesaplama", label: "enflasyon hesaplama" },
    { href: "/finansal-hesaplamalar/reel-getiri-hesaplama", label: "altın reel getiri hesaplama" },
    { href: "/finansal-hesaplamalar/birikim-hesaplama", label: "aylık altın birikim planı" },
    { href: "/finansal-hesaplamalar/portfoy-dagilimi-hesaplama", label: "portföy dağılımı hesaplama" },
];

export default function GoldInternalLinks() {
    return (
        <section aria-labelledby="gold-internal-links" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="gold-internal-links" className="text-2xl font-black tracking-tight text-slate-950">İlgili Finansal Hesaplamalar</h2>
            <div className="mt-4 flex flex-wrap gap-2">
                {existingLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex min-h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-800 transition hover:border-amber-300 hover:bg-white"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
                Ons altın ve gram altın ilişkisini okurken USD/TRY kurunu ayrıca değerlendirmek için döviz hesaplama aracını kullanabilirsiniz.
            </p>
        </section>
    );
}
