import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KPSS Puan Hesaplama 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 72,
                    background: "#0f172a",
                    color: "white",
                    fontFamily: "Arial",
                }}
            >
                <div style={{ color: "#FFB199", fontSize: 34, fontWeight: 800 }}>HesapMod</div>
                <div style={{ marginTop: 24, fontSize: 72, fontWeight: 900, lineHeight: 1.05 }}>
                    KPSS Puan Hesaplama 2026
                </div>
                <div style={{ marginTop: 24, fontSize: 34, color: "#cbd5e1" }}>
                    P1 • P3 • P93 • P94 net ve puan simülasyonu
                </div>
            </div>
        ),
        size,
    );
}
