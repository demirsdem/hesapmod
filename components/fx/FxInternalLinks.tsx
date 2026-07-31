import Link from "next/link";

const verifiedLinks = [
    { href: "/finansal-hesaplamalar/dolar-hesaplama", label: "dolar hesaplama" },
    { href: "/finansal-hesaplamalar/euro-hesaplama", label: "euro hesaplama" },
    { href: "/finansal-hesaplamalar/sterlin-hesaplama", label: "sterlin hesaplama" },
    { href: "/finansal-hesaplamalar/tl-dolar-hesaplama", label: "TL'den dolara hesaplama" },
    { href: "/finansal-hesaplamalar/tl-euro-hesaplama", label: "TL'den euroya hesaplama" },
    { href: "/finansal-hesaplamalar/dolar-euro-hesaplama", label: "dolar euro çevirici" },
    { href: "/finansal-hesaplamalar/euro-dolar-hesaplama", label: "euro dolar çevirici" },
    { href: "/finansal-hesaplamalar/doviz-makas-hesaplama", label: "döviz makas hesaplama" },
    { href: "/finansal-hesaplamalar/altin-hesaplama", label: "altın hesaplama" },
    { href: "/finansal-hesaplamalar/enflasyon-hesaplama", label: "enflasyon hesaplama" },
    { href: "/finansal-hesaplamalar/reel-getiri-hesaplama", label: "reel getiri hesaplama" },
    { href: "/finansal-hesaplamalar/birikim-hesaplama", label: "birikim hesaplama" },
    { href: "/finansal-hesaplamalar/gecmis-doviz-kurlari", label: "geçmiş döviz kurları" },
    { href: "/maas-ve-vergi/kambiyo-vergisi-hesaplama", label: "kambiyo vergisi hesaplama" },
];

export default function FxInternalLinks() {
    return (
        <section aria-labelledby="ilgili-doviz-araclari" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="ilgili-doviz-araclari" className="text-2xl font-black tracking-tight text-slate-950">İlgili Finans Araçları</h2>
            <div className="mt-4 flex flex-wrap gap-2">
                {verifiedLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-800 transition hover:border-[#B84418] hover:bg-[#FFF3EE]">
                        {link.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}
