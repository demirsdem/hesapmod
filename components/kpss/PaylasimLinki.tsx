"use client";

import { Copy } from "lucide-react";
import type { HesaplamaGirdisi } from "@/types/kpss";
import { encodeStateToUrl } from "@/lib/kpss-calculator";

export default function PaylasimLinki({
    state,
    onCopied,
}: {
    state: HesaplamaGirdisi;
    onCopied: (message: string) => void;
}) {
    const copyLink = async () => {
        const path = `/sinav-hesaplamalari/kpss-puan-hesaplama${encodeStateToUrl(state)}`;
        window.history.replaceState({}, "", path);
        await navigator.clipboard?.writeText(`${window.location.origin}${path}`);
        onCopied("Link panoya kopyalandı.");
    };

    return (
        <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#CC4A1A] px-4 text-sm font-black text-white transition hover:bg-[#A83A12] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
        >
            <Copy size={17} aria-hidden="true" />
            Kopyala
        </button>
    );
}
