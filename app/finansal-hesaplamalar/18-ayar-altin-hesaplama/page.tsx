import type { Metadata, Viewport } from "next";
import GoldLongTailPage from "@/components/gold/GoldLongTailPage";
import { getGoldLongTailPage } from "@/lib/gold/goldLongTailPages";

const config = getGoldLongTailPage("18-ayar-altin-hesaplama");
const canonical = `https://www.hesapmod.com/finansal-hesaplamalar/${config.slug}`;

export const revalidate = 3600;
export const viewport: Viewport = { themeColor: "#FF6B35" };

export const metadata: Metadata = {
    title: { absolute: `${config.title} | HesapMod` },
    description: config.metaDescription,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, title: config.title, description: config.metaDescription },
    twitter: { card: "summary_large_image", title: config.title, description: config.metaDescription },
};

export default function Page() {
    return <GoldLongTailPage config={config} />;
}
