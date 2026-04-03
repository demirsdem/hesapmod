"use client";

import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { Search, X, Calculator } from "lucide-react";
import Link from "next/link";
import type { CalculatorSearchEntry } from "@/lib/calculator-types";
import { getCategoryName } from "@/lib/categories";
import { getEnglishCategoryLabel } from "@/lib/calculator-source-en";

interface Props {
    entries: CalculatorSearchEntry[];
    lang?: "tr" | "en";
}

export default function NavSearch({ entries, lang = "tr" }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const deferredQuery = useDeferredValue(query);

    const openSearch = useCallback(() => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
        document.body.style.overflow = "hidden";
    }, []);

    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setQuery("");
        document.body.style.overflow = "";
    }, []);

    // Close on escape & handle Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSearch();
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                openSearch();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeSearch, openSearch]);

    const filtered = deferredQuery.length > 1
        ? entries.filter((c) =>
            c.name[lang].toLowerCase().includes(deferredQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(deferredQuery.toLowerCase()) ||
            c.shortDescription[lang].toLowerCase().includes(deferredQuery.toLowerCase())
        )
        : [];

    return (
        <>
            <button
                onClick={openSearch}
                className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-transparent text-slate-600 transition-colors hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
                aria-label={lang === "en" ? "Search calculators (Cmd+K)" : "Arama Yap (Cmd+K)"}
                title={lang === "en" ? "Search calculators (Cmd+K)" : "Arama Yap (Cmd+K)"}
            >
                <Search size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center px-2 pt-16 animate-fade-in sm:px-4 sm:pt-24">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-white/80 backdrop-blur-sm"
                        onClick={closeSearch}
                    />

                    {/* Modal */}
                    <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-scale-in sm:max-h-[70vh]">
                        <div className="flex min-w-0 items-center border-b border-slate-100 px-3 shadow-sm sm:px-4">
                            <Search className="text-slate-400 mr-2" size={20} aria-hidden="true" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="h-14 w-full min-w-0 bg-transparent px-1 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:h-16 sm:px-2 sm:text-lg"
                                placeholder={
                                    lang === "en"
                                        ? "Search calculators... (e.g. BMI)"
                                        : "Hesaplama aracı ara... (örn. KDV)"
                                }
                                aria-label={lang === "en" ? "Search query" : "Arama Sorgusu"}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="p-2 text-slate-400 hover:text-slate-900 mr-2 rounded hover:bg-slate-50 transition-colors"
                                    aria-label={lang === "en" ? "Clear search" : "Aramayı Temizle"}
                                >
                                    <X size={18} aria-hidden="true" />
                                </button>
                            )}
                            <button
                                onClick={closeSearch}
                                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-100 rounded border border-slate-200 hidden sm:block transition-colors"
                                aria-label={lang === "en" ? "Close search (Esc)" : "Aramayı Kapat (Esc)"}
                            >
                                ESC
                            </button>
                            <button
                                onClick={closeSearch}
                                className="p-2 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-50 sm:hidden transition-colors"
                                aria-label={lang === "en" ? "Close search" : "Aramayı Kapat"}
                            >
                                <X size={20} aria-hidden="true" />
                            </button>
                        </div>

                        {query.length > 1 && (
                            <div className="overflow-y-auto overflow-x-hidden p-2">
                                {filtered.length > 0 ? (
                                    <div className="space-y-1">
                                        {filtered.map((calc) => (
                                            <Link
                                                key={calc.id}
                                                href={lang === "en" ? `/en/${calc.category}/${calc.slug}` : `/${calc.category}/${calc.slug}`}
                                                onClick={closeSearch}
                                                className="group flex min-w-0 items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50 sm:gap-4 sm:p-4"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF3EE] text-[#CC4A1A]">
                                                    <Calculator size={20} />
                                                </div>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <p className="break-words font-semibold text-slate-900 transition-colors group-hover:text-[#CC4A1A]">
                                                        {calc.name[lang]}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                                        {calc.shortDescription[lang]}
                                                    </p>
                                                    <p className="mt-2 break-words text-[11px] uppercase tracking-wide text-slate-500">
                                                        {lang === "en"
                                                            ? getEnglishCategoryLabel(calc.category)
                                                            : getCategoryName(calc.category, "tr")}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[150px] flex-col items-center justify-center p-8 text-center text-slate-500">
                                        <p>
                                            {lang === "en"
                                                ? `No results found for "${query}".`
                                                : `"${query}" için sonuç bulunamadı.`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        {query.length <= 1 && (
                            <div className="bg-slate-50 p-5 text-center text-sm text-slate-500 sm:p-6">
                                {lang === "en"
                                    ? "Search by calculator name or topic."
                                    : "Araç isimleri veya kategoriye göre hızlı arama yapabilirsiniz."}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
