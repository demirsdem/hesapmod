import Link from "next/link";
import FeaturedTools from "@/components/FeaturedTools";
import { mainCategories } from "@/lib/categories";
import { CONTACT_FORM_PATH } from "@/lib/contact";
import { englishCalculatorRoutes } from "@/lib/calculator-source-en";

export default function Footer({ lang = "tr" }: { lang?: "tr" | "en" }) {
    if (lang === "en") {
        return (
            <footer className="border-t border-slate-200 bg-slate-100">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="mb-4 font-bold text-slate-900">HesapMod</h3>
                            <p className="mb-3 text-sm text-slate-600">
                                Fast, practical, and free calculator pages in English.
                            </p>
                            <Link
                                href={CONTACT_FORM_PATH}
                                className="inline-block text-sm text-[#CC4A1A] hover:text-[#E55A26] hover:underline"
                            >
                                Contact us
                            </Link>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-slate-900">Calculators</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                {englishCalculatorRoutes.map((route) => (
                                    <li key={route.slug}>
                                        <Link
                                            href={`/en/${route.category}/${route.slug}`}
                                            className="hover:text-[#CC4A1A]"
                                        >
                                            {route.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-slate-900">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><Link href="/hakkimizda" className="hover:text-[#CC4A1A]">About</Link></li>
                                <li><Link href="/iletisim" className="hover:text-[#CC4A1A]">Contact</Link></li>
                                <li><Link href="/rehber" className="hover:text-[#CC4A1A]">Guides</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-slate-900">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><Link href="/gizlilik-politikasi" className="hover:text-[#CC4A1A]">Privacy Policy</Link></li>
                                <li><Link href="/cerez-politikasi" className="hover:text-[#CC4A1A]">Cookie Policy</Link></li>
                                <li><Link href="/kullanim-kosullari" className="hover:text-[#CC4A1A]">Terms of Use</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row">
                        <span>© {new Date().getFullYear()} HesapMod. All rights reserved.</span>
                        <span>Calculator results are informational and do not replace medical or financial advice.</span>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="border-t border-slate-200 bg-slate-100">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 font-bold text-slate-900">HesapMod</h3>
                        <p className="mb-3 text-sm text-slate-600">
                            En güvenilir hesaplama araçları platformu.
                        </p>
                        <Link
                            href={CONTACT_FORM_PATH}
                            className="inline-block text-sm text-[#CC4A1A] hover:text-[#E55A26] hover:underline"
                        >
                            İletişim formu ile ulaşın
                        </Link>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-slate-900">Kategoriler</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            {mainCategories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link href={`/kategori/${cat.slug}`} className="hover:text-[#CC4A1A]">
                                        {cat.name.tr}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/tum-araclar" className="hover:text-[#CC4A1A]">
                                    Tüm Araçlar
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-slate-900">Kurumsal</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/hakkimizda" className="hover:text-[#CC4A1A]">Hakkımızda</Link></li>
                            <li><Link href="/iletisim" className="hover:text-[#CC4A1A]">İletişim</Link></li>
                            <li><Link href="/sss" className="hover:text-[#CC4A1A]">SSS</Link></li>
                            <li><Link href="/rehber" className="hover:text-[#CC4A1A]">Rehber &amp; İpuçları</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-slate-900">Yasal</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/gizlilik-politikasi" className="hover:text-[#CC4A1A]">Gizlilik Politikası</Link></li>
                            <li><Link href="/cerez-politikasi" className="hover:text-[#CC4A1A]">Çerez Politikası</Link></li>
                            <li><Link href="/kvkk" className="hover:text-[#CC4A1A]">KVKK</Link></li>
                            <li><Link href="/kullanim-kosullari" className="hover:text-[#CC4A1A]">Kullanım Koşulları</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10">
                    <FeaturedTools variant="footer" maxItems={6} />
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row">
                    <span>© {new Date().getFullYear()} HesapMod. Tüm hakları saklıdır.</span>
                    <span>Hesaplamalar bilgilendirme amaçlıdır · Tıbbi/finansal tavsiye değildir</span>
                </div>
            </div>
        </footer>
    );
}
