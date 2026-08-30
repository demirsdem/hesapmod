"use client";

import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { CalculatorSearchEntry } from "@/lib/calculator-types";
import { getCategoryName } from "@/lib/categories";
import { filterCalculatorSearchEntries, getCalculatorSearchHref } from "@/lib/search-utils";

interface Props {
    entries: CalculatorSearchEntry[];
}

export default function GlobalSearch({ entries }: Props) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const deferredQuery = useDeferredValue(query);
    const safeEntries = useMemo(
        () => Array.isArray(entries) ? entries.filter(Boolean) : [],
        [entries]
    );

    const filtered = useMemo(
        () => deferredQuery.length > 1
            ? filterCalculatorSearchEntries(safeEntries, deferredQuery, "tr", 10)
            : [],
        [deferredQuery, safeEntries]
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="relative mx-auto w-full min-w-0 max-w-2xl" ref={resultsRef}>
            <div className="group relative flex min-w-0 max-w-full items-center">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CC4A1A] transition-colors" size={20} aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                    }}
                    placeholder="ALES puan, KDV, Eurobond, adım km..."
                    className="h-16 w-full min-w-0 max-w-full rounded-2xl border border-slate-300 bg-white pl-14 pr-14 text-base font-medium text-slate-800 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 sm:pr-24 sm:text-[1.05rem]"
                    aria-label="Hesaplama Aracı Ara"
                    aria-describedby="global-search-examples"
                />

                {/* Keyboard Shortcut Hint or Clear Button */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query ? (
                        <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100" aria-label="Aramayı Temizle">
                            <X size={18} aria-hidden="true" />
                        </button>
                    ) : (
                        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[0.65rem] font-medium text-slate-500 select-none pointer-events-none">
                            <kbd className="font-sans">⌘</kbd>
                            <kbd className="font-sans">K</kbd>
                        </div>
                    )}
                </div>
            </div>
            <p id="global-search-examples" className="px-4 pb-3 pt-2 text-[11px] leading-relaxed text-slate-500 md:text-xs">
                Örnekler: ALES puan hesaplama, kredi kartı gecikme faizi, takdir teşekkür hesaplama, 40 soruda 30 doğru kaç net, metreküp hesaplama.
            </p>

            {isOpen && filtered.length > 0 && (
                <div className="absolute left-0 top-full w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] max-h-96 overflow-y-auto p-2">
                    {filtered.map((calc) => {
                        const href = getCalculatorSearchHref(calc, "tr");
                        const title = calc.name?.tr ?? calc.name?.en ?? "";
                        const description = calc.shortDescription?.tr ?? calc.shortDescription?.en ?? "";
                        const category = calc.category ?? "";

                        if (!href || !title) {
                            return null;
                        }

                        return (
                            <Link
                                key={calc.id || href}
                                href={href}
                                className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 group-hover:text-[#CC4A1A] transition-colors">{title}</p>
                                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                        {description}
                                    </p>
                                    <p className="mt-2 text-[11px] text-slate-500 uppercase tracking-wide truncate">
                                        {getCategoryName(category, "tr")}
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-md bg-[#FFF3EE] px-2 py-1 text-xs font-medium text-[#CC4A1A]">Hesapla</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
