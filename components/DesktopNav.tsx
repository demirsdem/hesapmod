"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function DesktopNav({ links }: { links: NavLink[] }) {
    const pathname = usePathname();

    return (
        <nav className="hidden flex-1 items-center justify-center gap-3 md:flex lg:gap-5">
            {links.map((link) => {
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
                        <span className="truncate max-w-[120px] lg:max-w-[180px] xl:max-w-none">
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
        </nav>
    );
}
