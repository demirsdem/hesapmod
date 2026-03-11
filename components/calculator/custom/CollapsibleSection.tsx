"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
    title: string;
    description?: string;
    isFilled: boolean;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

export default function CollapsibleSection({
    title,
    description,
    isFilled,
    defaultOpen = false,
    children,
}: CollapsibleSectionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Header — full-width clickable */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
                style={{ minHeight: 52 }}
                aria-expanded={open}
            >
                <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                        {title}
                    </h3>
                    {description && !open && (
                        <p className="mt-0.5 text-xs text-slate-400 truncate">{description}</p>
                    )}
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                    {/* Status badge */}
                    {isFilled ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                            ✓ Dolu
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
                            Boş
                        </span>
                    )}

                    {/* Chevron */}
                    <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-200 ${
                            open ? "rotate-180" : "rotate-0"
                        }`}
                    />
                </div>
            </button>

            {/* Body — CSS grid height animation */}
            <div
                className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 space-y-4">
                        {description && open && (
                            <p className="text-sm leading-6 text-slate-500">{description}</p>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
