"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link"; // Next.js link for better prefetching
import { usePathname } from "next/navigation";

interface NavLink {
    href: string;
    label: string;
}

export default function MobileMenu({
    links,
    lang = "tr",
}: {
    links: NavLink[];
    lang?: "tr" | "en";
}) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Body scroll lock on mobile menu open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <div className="shrink-0 md:hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label={lang === "en" ? "Open or close menu" : "Menüyü aç/kapat"}
                className="relative z-[60] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 bg-transparent text-slate-600 transition-colors hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Arka plan overlay & menü öğeleri */}
            <div
                className={`fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] w-full max-w-full origin-top overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out ${open ? "visible scale-y-100 opacity-100" : "invisible scale-y-95 opacity-0"
                    }`}
            >
                <nav className="flex h-full flex-col gap-3 overflow-y-auto overflow-x-hidden p-3 pb-20 sm:p-4">
                    {links.map((link, idx) => {
                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
                                className={`flex min-h-[48px] min-w-0 items-center justify-between rounded-xl border px-4 py-4 text-base font-medium transition-all duration-300 sm:px-5 sm:text-lg ${
                                    isActive
                                        ? "bg-[#FFF3EE] text-[#CC4A1A] border-[#FFD7C7]"
                                        : "text-slate-700 bg-slate-50 border-slate-100 hover:bg-[#FFF3EE] hover:text-[#CC4A1A] hover:border-[#FFD7C7]"
                                } ${open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
                            >
                                <span className="truncate">{link.label}</span>
                                <ArrowRight size={18} className={isActive ? "text-[#E55A26]" : "text-slate-400 opacity-60"} />
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
