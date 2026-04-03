import type { Metadata } from "next";
import Link from "next/link";
import { englishCalculatorRoutes, getEnglishHomeAlternates } from "@/lib/calculator-source-en";

export const metadata: Metadata = {
    title: "HesapMod Global - Free Online Calculators",
    description:
        "Explore the English beta of HesapMod with practical calculator pages for BMI, age, and percentage calculations.",
    alternates: getEnglishHomeAlternates(),
};

export default function EnglishHomePage() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#CC4A1A]">
                    English Beta
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    Free online calculators in English.
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    We are rolling out international calculator pages without changing the existing Turkish SEO architecture.
                    These are the first three English tools now available on HesapMod.
                </p>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
                {englishCalculatorRoutes.map((route) => (
                    <Link
                        key={route.slug}
                        href={`/en/${route.category}/${route.slug}`}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all hover:border-[#FFD7C7] hover:bg-white hover:shadow-md"
                    >
                        <p className="text-sm font-semibold text-[#CC4A1A]">
                            {route.categoryLabel}
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900">
                            {route.name}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {route.shortDescription}
                        </p>
                    </Link>
                ))}
            </section>
        </main>
    );
}
