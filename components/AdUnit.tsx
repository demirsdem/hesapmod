"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
    dataAdClient: string;
    dataAdSlot: string;
    dataFullWidthResponsive?: boolean;
    className?: string;
    minHeight?: string; 
    format?: "auto" | "rectangle" | "horizontal" | "vertical";
}

export default function AdUnit({
    dataAdClient,
    dataAdSlot,
    dataFullWidthResponsive = true,
    className,
    minHeight = "250px",
    format = "auto"
}: AdUnitProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense Error:", err);
        }
    }, []);

    // Placeholder box helps prevent Cumulative Layout Shift (CLS)
    return (
        <div
            className={cn("w-full flex justify-center items-center overflow-hidden my-4", className)}
            style={{ minHeight }}
            aria-hidden="true"
        >
            <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%" }}
                data-ad-client={dataAdClient}
                data-ad-slot={dataAdSlot}
                data-ad-format={format}
                data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
            />
        </div>
    );
}
