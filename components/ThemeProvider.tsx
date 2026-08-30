"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const THEME_COOKIE = "hesapmod-theme";

const ThemeContext = createContext<{
    theme: Theme;
    toggle: () => void;
}>({ theme: "light", toggle: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof document === "undefined") return "light";
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const initial: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        setTheme(initial);
        setMounted(true);
    }, []);

    const toggle = () => {
        setTheme((prev) => {
            const next: Theme = prev === "light" ? "dark" : "light";
            document.documentElement.classList.toggle("dark", next === "dark");
            document.documentElement.style.colorScheme = next;
            document.cookie = `${THEME_COOKIE}=${next}; Max-Age=31536000; Path=/; SameSite=Lax`;
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function DarkModeToggle({ lang = "tr" }: { lang?: "tr" | "en" }) {
    const { theme, toggle } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && theme === "dark";
    const label = lang === "en"
        ? isDark ? "Switch to light theme" : "Switch to dark theme"
        : isDark ? "Açık temaya geç" : "Koyu temaya geç";

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={label}
            title={label}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE] hover:text-[#CC4A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-orange-500 dark:hover:bg-slate-700 dark:hover:text-orange-300"
        >
            {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
        </button>
    );
}
