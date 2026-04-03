import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
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
import { englishCalculatorSearchIndex, englishNavigationLinks } from "@/lib/calculator-source-en";
import { LOCALE_HEADER, normalizeLocale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
    themeColor: "#0f172a",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    applicationName: SITE_NAME,
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
        shortcut: ["/favicon.ico"],
    },
    title: {
        default: `${SITE_NAME} | Profesyonel Hesaplama Araçları`,
        template: `%s | ${SITE_NAME}`,
    },
    description: "Finans, sağlık, matematik ve günlük yaşam için yüzlerce ücretsiz ve hızlı hesaplama aracı.",
    manifest: "/manifest.webmanifest",
    metadataBase: new URL(SITE_URL),
    alternates: {
        canonical: "/",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: SITE_NAME,
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = normalizeLocale(headers().get(LOCALE_HEADER));
    const navLinks =
        locale === "en"
            ? englishNavigationLinks
            : [
                ...mainCategories.map((cat) => ({
                    href: `/kategori/${cat.slug}`,
                    label: cat.name.tr,
                })),
                { href: "/tum-araclar", label: "Tüm Araçlar" },
            ];
    const searchEntries = locale === "en" ? englishCalculatorSearchIndex : calculatorSearchIndex;

    return (
        <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 antialiased flex flex-col")}>
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
                                    "availableLanguage": ["Turkish", "English"]
                                }
                            }),
                        }}
                    />

                    {/* Google Analytics only after explicit consent */}
                    <AnalyticsLoader />

                    <header className="sticky top-0 z-50 w-full overflow-x-clip border-b border-slate-200 bg-white/80 backdrop-blur-md">
                        <div className="mx-auto flex h-16 w-full max-w-7xl min-w-0 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
                            <div className="flex min-w-0 shrink-0 items-center gap-2">
                                <Link href="/" className="shrink-0 text-xl font-bold tracking-tighter text-[#CC4A1A] transition-opacity hover:opacity-80 sm:text-2xl">
                                    Hesap<span className="text-slate-900">Mod</span>
                                </Link>
                            </div>
                            <DesktopNav links={navLinks} />
                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                <NavSearch entries={searchEntries} lang={locale} />
                                <DarkModeToggle lang={locale} />
                                <MobileMenu links={navLinks} lang={locale} />
                            </div>
                        </div>
                    </header>
                    <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
                    <Footer lang={locale} />
                    <CookieBanner lang={locale} />

                </ThemeProvider>
            </body>
        </html>
    );
}
