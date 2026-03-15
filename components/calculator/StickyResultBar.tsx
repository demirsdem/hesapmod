"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface StickyResultBarProps {
    primaryLabel: string;
    primaryValue: string;
    children: React.ReactNode;
    hasResults: boolean;
}

export default function StickyResultBar({
    primaryLabel,
    primaryValue,
    children,
    hasResults,
}: StickyResultBarProps) {
    const [expanded, setExpanded] = useState(false);
    const [animateValue, setAnimateValue] = useState(false);

    // Animate value when it changes
    useEffect(() => {
        if (!hasResults) return;
        setAnimateValue(true);
        const t = setTimeout(() => setAnimateValue(false), 400);
        return () => clearTimeout(t);
    }, [primaryValue, hasResults]);

    // Lock body scroll when expanded
    useEffect(() => {
        if (expanded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [expanded]);

    // Close on Escape
    useEffect(() => {
        if (!expanded) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setExpanded(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [expanded]);

    if (!hasResults) return null;

    return (
        <>
            {/* ── Collapsed Bar ── */}
            <div
                className="md:hidden fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
                style={{ bottom: "calc(56px + env(safe-area-inset-bottom))" }}
            >
                <button
                    onClick={() => setExpanded(true)}
                    className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] active:bg-slate-50 transition-colors"
                    aria-label="Sonuç detaylarını göster"
                >
                    <div className="min-w-0 text-left">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide leading-tight">
                            {primaryLabel}
                        </p>
                        <p
                            className={`text-xl font-extrabold text-[#CC4A1A] tracking-tight leading-tight transition-all duration-300 ${
                                animateValue ? "scale-110 text-[#E55A26]" : "scale-100"
                            }`}
                        >
                            {primaryValue}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0 ml-3">
                        <span className="text-[11px] font-semibold">Detaylar</span>
                        <ChevronUp size={16} />
                    </div>
                </button>
            </div>

            {/* ── Half-Sheet Modal (Expanded) ── */}
            {expanded && (
                <div className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={() => setExpanded(false)}
                    />

                    {/* Sheet */}
                    <div
                        className="relative bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[75dvh] flex flex-col"
                        style={{ paddingBottom: "calc(56px + env(safe-area-inset-bottom))" }}
                    >
                        {/* Handle + Close */}
                        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-1 rounded-full bg-slate-200" />
                                <span className="text-sm font-bold text-slate-900">Sonuçlar</span>
                            </div>
                            <button
                                onClick={() => setExpanded(false)}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                                aria-label="Kapat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content — scrollable */}
                        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
