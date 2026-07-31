"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

type Props = {
    text: string;
};

export default function FormulaCopyButton({ text }: Props) {
    const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

    const copy = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
            setStatus("error");
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
            window.setTimeout(() => setStatus("idle"), 1600);
        } catch {
            setStatus("error");
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            aria-label="Formülü kopyala"
            className="inline-flex items-center gap-1 rounded-lg border border-orange-300/40 px-2 py-1 text-xs font-bold text-orange-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
        >
            <Copy size={14} aria-hidden="true" />
            {status === "copied" ? "Kopyalandı" : status === "error" ? "Hata" : "Kopyala"}
        </button>
    );
}
