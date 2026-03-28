import Link from "next/link";
import { getFeaturedToolItems, getFeaturedToolsTitle, type FeaturedToolsVariant } from "@/lib/featured-tools";

export type FeaturedToolsProps = {
    variant?: FeaturedToolsVariant;
    categorySlug?: string;
    title?: string;
    maxItems?: number;
};

export default function FeaturedTools({
    variant = "homepage",
    categorySlug,
    title,
    maxItems,
}: FeaturedToolsProps) {
    const items = getFeaturedToolItems(variant, categorySlug, maxItems);

    if (items.length === 0) {
        return null;
    }

    const heading = getFeaturedToolsTitle(variant, categorySlug, title);
    const subtitle =
        variant === "footer"
            ? "Sitede en sık açılan temel araçlara doğrudan geçin."
            : variant === "guide"
                ? "Okuduğunuz konuyu doğrudan hesaplamaya dökmek için bu araçları kullanın."
                : variant === "category"
                    ? "Bu bölümde kullanıcıların en sık ziyaret ettiği bağlantıları burada topladık."
                    : "Sitede sık açılan ve hızlı erişim sağlayan kanonik araçlara buradan geçebilirsiniz.";

    return (
        <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-1">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    {heading}
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                    {subtitle}
                </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
                {items.map((item) => (
                    <Link
                        key={item.slug}
                        href={item.href}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}

