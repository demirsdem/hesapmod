import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "HesapMod - Ücretsiz Hesaplama Araçları",
        short_name: "HesapMod",
        description: "Finans, eğitim, sağlık ve yaşam kategorilerinde 300+ ücretsiz hesaplama aracı.",
        start_url: "/",
        display: "standalone",
        background_color: "#f8fafc",
        theme_color: "#0f172a",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}
