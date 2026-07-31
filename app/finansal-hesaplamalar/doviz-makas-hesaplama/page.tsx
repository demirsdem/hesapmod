import type { Metadata, Viewport } from "next";
import FxLongTailPage from "@/components/fx/FxLongTailPage";
import { getFxLongTailPage } from "@/lib/fx/fxLongTailPages";

const config = getFxLongTailPage("doviz-makas-hesaplama");

export const revalidate = 3600;
export const viewport: Viewport = { themeColor: "#FF6B35" };

export const metadata: Metadata = {
    title: { absolute: `${config.title} | HesapMod` },
    description: config.metaDescription,
    alternates: { canonical: `https://www.hesapmod.com/finansal-hesaplamalar/${config.slug}` },
    openGraph: { type: "website", url: `https://www.hesapmod.com/finansal-hesaplamalar/${config.slug}`, title: config.title, description: config.metaDescription },
    twitter: { card: "summary_large_image", title: config.title, description: config.metaDescription },
};

export default function Page() {
    return <FxLongTailPage config={config} />;
}
