"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FocusEvent, type KeyboardEvent, useRef, useState } from "react";

interface NavLink {
    href: string;
    label: string;
}

function isActivePath(pathname: string, href: string) {
    if (href === "/") {
        return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

function safeNavLabel(link: Partial<NavLink> | null | undefined) {
    return typeof link?.label === "string" ? link.label : "";
}

function isMoreLabel(label: unknown) {
    return typeof label === "string" && label.trim().toLocaleLowerCase("tr-TR") === "diğer";
}

function isValidNavLink(link: Partial<NavLink> | null | undefined): link is NavLink {
    return typeof link?.href === "string" && link.href.length > 0 && safeNavLabel(link).length > 0;
}

export default function DesktopNav({ links }: { links: NavLink[] }) {
    const pathname = usePathname();
    const moreMenuRef = useRef<HTMLDivElement>(null);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const safeLinks = Array.isArray(links) ? links.filter(isValidNavLink) : [];
    const allToolsLink = safeLinks.find((link) => link.href === "/tum-araclar");
    const categoryLinks = safeLinks.filter((link) => link.href !== "/tum-araclar" && !isMoreLabel(link.label));
    const primaryLinks = categoryLinks.slice(0, 7);
    const secondaryLinks = categoryLinks.slice(7);
    const hasActiveSecondaryLink = secondaryLinks.some((link) => isActivePath(pathname, link.href));

    function closeMoreMenuOnBlur(event: FocusEvent<HTMLDivElement>) {
        if (!moreMenuRef.current?.contains(event.relatedTarget as Node | null)) {
            setIsMoreOpen(false);
        }
    }

    function handleMoreKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        if (event.key === "Escape") {
            setIsMoreOpen(false);
            event.currentTarget.blur();
        }
    }

    return (
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex lg:gap-3">
            {primaryLinks.map((link) => {
                const isActive = isActivePath(pathname, link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        title={link.label}
                        className={`group relative flex items-center text-sm font-medium transition-colors ${
                            isActive ? "text-[#CC4A1A]" : "text-slate-700 hover:text-[#CC4A1A]"
                        }`}
                    >
                        <span className="max-w-[86px] truncate lg:max-w-[116px] xl:max-w-[150px]">
                            {link.label}
                        </span>
                        <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-[#FF6B35] transition-all duration-300 ${
                                isActive ? "w-full" : "w-0 group-hover:w-full"
                            }`}
                        />
                    </Link>
                );
            })}
            {secondaryLinks.length > 0 ? (
                <div
                    ref={moreMenuRef}
                    className="relative"
                    onMouseEnter={() => setIsMoreOpen(true)}
                    onMouseLeave={() => setIsMoreOpen(false)}
                    onBlur={closeMoreMenuOnBlur}
                >
                    <button
                        type="button"
                        className={`relative flex items-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/40 ${
                            hasActiveSecondaryLink || isMoreOpen ? "text-[#CC4A1A]" : "text-slate-700 hover:text-[#CC4A1A]"
                        }`}
                        aria-haspopup="menu"
                        aria-expanded={isMoreOpen}
                        onFocus={() => setIsMoreOpen(true)}
                        onKeyDown={handleMoreKeyDown}
                    >
                        Diğer
                    </button>
                    <div
                        className={`absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 transition duration-150 ${
                            isMoreOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                        }`}
                    >
                        <div className="grid grid-cols-1 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl" role="menu" aria-label="Diğer kategoriler">
                            {secondaryLinks.map((link) => {
                                const isActive = isActivePath(pathname, link.href);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        title={link.label}
                                        role="menuitem"
                                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive ? "bg-[#FFF3EE] text-[#CC4A1A]" : "text-slate-700 hover:bg-slate-50 hover:text-[#CC4A1A]"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
            {allToolsLink ? (
                <Link
                    href={allToolsLink.href}
                    title={allToolsLink.label}
                    className={`group relative flex items-center text-sm font-semibold transition-colors ${
                        isActivePath(pathname, allToolsLink.href) ? "text-[#CC4A1A]" : "text-slate-700 hover:text-[#CC4A1A]"
                    }`}
                >
                    <span className="max-w-[92px] truncate lg:max-w-[120px]">{allToolsLink.label}</span>
                    <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-[#FF6B35] transition-all duration-300 ${
                            isActivePath(pathname, allToolsLink.href) ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    />
                </Link>
            ) : null}
        </nav>
    );
}
