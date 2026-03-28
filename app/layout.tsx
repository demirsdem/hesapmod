import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider, DarkModeToggle } from "@/components/ThemeProvider";
import MobileMenu from "@/components/MobileMenu";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";

import { mainCategories } from "@/lib/categories";
import { calculatorSearchIndex } from "@/lib/calculators";
import Link from "next/link";
import Script from "next/script";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import CookieBanner from "@/components/CookieBanner";
import NavSearch from "@/components/search/NavSearch";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { CONTACT_FORM_PATH } from "@/lib/contact";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
    themeColor: "#FF6B35",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: `${SITE_NAME} | Profesyonel Hesaplama Araçları`,
        template: `%s | ${SITE_NAME}`,
    },
    description: "Finans, sağlık, matematik ve günlük yaşam için yüzlerce ücretsiz ve hızlı hesaplama aracı.",
    metadataBase: new URL(SITE_URL),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: SITE_URL,
        siteName: SITE_NAME,
        images: [
            {
                url: `${SITE_URL}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: "HesapMod — Yüzlerce Ücretsiz Hesaplama Aracı",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} | Profesyonel Hesaplama Araçları`,
        description: "Yüzlerce hesaplama aracı ile hayatınızı kolaylaştırın.",
        images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
        index: true,
        follow: true,
    },
};

// Nav linkleri mainCategories'den otomatik üretiliyor
// Yeni kategori için sadece lib/categories.ts'e obje eklemek yeterli
const navLinks = [
    ...mainCategories.map((cat) => ({
        href: `/kategori/${cat.slug}`,
        label: cat.name.tr,
    })),
    { href: "/tum-araclar", label: "Tüm Araçlar" },
];

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
            <body className={cn(inter.className, "bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col")}>
                <ThemeProvider>
                    {/* Kurumsal SEO Şeması */}
                    <Script
                        id="organization-schema"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Organization",
                                "name": SITE_NAME,
                                "url": SITE_URL,
                                "logo": `${SITE_URL}/icon.svg`,
                                "sameAs": [],
                                "contactPoint": {
                                    "@type": "ContactPoint",
                                    "url": `${SITE_URL}${CONTACT_FORM_PATH}`,
                                    "contactType": "customer service",
                                    "availableLanguage": ["Turkish"]
                                }
                            }),
                        }}
                    />

                    {/* Google Analytics only after explicit consent */}
                    <AnalyticsLoader />

                    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
                        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                            <div className="flex shrink-0 items-center gap-2">
                                <Link href="/" className="text-2xl font-bold tracking-tighter text-[#CC4A1A] hover:opacity-80 transition-opacity">
                                    Hesap<span className="text-slate-900">Mod</span>
                                </Link>
                            </div>
                            <DesktopNav links={navLinks} />
                            <div className="flex shrink-0 items-center gap-3">
                                <NavSearch entries={calculatorSearchIndex} />
                                <DarkModeToggle />
                                <MobileMenu links={navLinks} />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <CookieBanner />

                </ThemeProvider>
            </body>
        </html>
    );
}
