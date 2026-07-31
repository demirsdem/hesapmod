import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function CalculatorOGImage({
    params,
}: {
    params: { category: string; slug: string };
}) {
    const isCagr = params.slug === "bilesik-buyume-hesaplama";
    const isBabyHeight = params.slug === "bebek-boyu-hesaplama";
    const isObp = params.slug === "obp-puan-hesaplama";
    const title = isCagr
        ? "CAGR / YBBO Hesaplama"
        : isBabyHeight
            ? "Bebek Boyu Hesaplama"
        : isObp
            ? "OBP Hesaplama 2026"
        : "HesapMod";
    const subtitle = isCagr
        ? "Yıllık bileşik büyüme oranı, toplam büyüme ve gelecek değer"
        : isBabyHeight
            ? "Anne baba boyuna göre tahmini yetişkin boy ve ±8,5 cm aralığı"
        : isObp
            ? "Ortaöğretim Başarı Puanı, YKS katkısı ve kırık OBP farkı"
        : "Profesyonel hesaplama aracı";
    const eyebrow = isCagr
        ? "Yıllık Bileşik Büyüme Oranı"
        : isBabyHeight
            ? "Orta Ebeveyn Boy Formülü"
        : isObp
            ? "Ortaöğretim Başarı Puanı"
            : "Hesaplama Aracı";
    const categoryLabel = isCagr ? "Finans" : isBabyHeight ? "Yaşam" : isObp ? "YKS" : "Araç";
    const chips = isObp
        ? ["Diploma Notu", "OBP x 0.12", "Kırık OBP x 0.06"]
        : isBabyHeight
        ? ["Anne Boyu", "Baba Boyu", "±8,5 cm Aralık"]
        : ["CAGR", "Toplam Büyüme", "Gelecek Değer"];

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#ffffff",
                    color: "#0f172a",
                    padding: "72px",
                    fontFamily: "system-ui",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 42, fontWeight: 900 }}>
                        <span style={{ color: "#CC4A1A" }}>Hesap</span>
                        <span>Mod</span>
                    </div>
                    <div style={{ border: "2px solid #FF6B35", borderRadius: 999, padding: "14px 22px", color: "#CC4A1A", fontSize: 24, fontWeight: 800 }}>
                        {categoryLabel}
                    </div>
                </div>
                <div>
                    <div style={{ color: "#FF6B35", fontSize: 30, fontWeight: 900, marginBottom: 20 }}>
                        {eyebrow}
                    </div>
                    <div style={{ fontSize: 80, lineHeight: 1.05, fontWeight: 950, maxWidth: 900 }}>
                        {title}
                    </div>
                    <div style={{ marginTop: 26, color: "#475569", fontSize: 30, lineHeight: 1.35, maxWidth: 850 }}>
                        {subtitle}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 18, fontSize: 25, fontWeight: 800, color: "#334155" }}>
                    {chips.map((chip, index) => (
                        <div
                            key={chip}
                            style={{
                                borderRadius: 18,
                                background: index === 0 ? "#FFF3EE" : "#F8FAFC",
                                border: index === 0 ? "2px solid #FFD7C7" : "2px solid #E2E8F0",
                                padding: "18px 24px",
                            }}
                        >
                            {chip}
                        </div>
                    ))}
                </div>
            </div>
        ),
        size
    );
}
