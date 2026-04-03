import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    englishCalculatorRoutes,
    getEnglishCategoryLabel,
} from "@/lib/calculator-source-en";

type PageParams = {
    category: string;
};

function getCategoryRoutes(category: string) {
    return englishCalculatorRoutes.filter((route) => route.category === category);
}

export async function generateStaticParams() {
    return Array.from(new Set(englishCalculatorRoutes.map((route) => route.category))).map((category) => ({
        category,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: PageParams;
}): Promise<Metadata> {
    const routes = getCategoryRoutes(params.category);

    if (routes.length === 0) {
        return {
            title: "Not Found | HesapMod",
        };
    }

    const categoryLabel = getEnglishCategoryLabel(params.category);

    return {
        title: `${categoryLabel} | HesapMod`,
        description: `Browse English calculator pages in the ${categoryLabel.toLowerCase()} section on HesapMod.`,
        alternates: {
            canonical: `/en/${params.category}`,
        },
    };
}

export default function EnglishCategoryPage({
    params,
}: {
    params: PageParams;
}) {
    const routes = getCategoryRoutes(params.category);

    if (routes.length === 0) {
        notFound();
    }

    const categoryLabel = getEnglishCategoryLabel(params.category);

    return (
        <main className="mx-auto max-w-5xl px-4 py-12">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#CC4A1A]">
                    English Beta
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                    {categoryLabel}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                    Browse the currently available English calculator pages in this category.
                </p>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-2">
                {routes.map((route) => (
                    <Link
                        key={route.slug}
                        href={`/en/${route.category}/${route.slug}`}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all hover:border-[#FFD7C7] hover:bg-white hover:shadow-md"
                    >
                        <h2 className="text-2xl font-bold text-slate-900">
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
