import { getFeaturedToolItems, getFeaturedToolsTitle, type FeaturedToolsVariant } from "@/lib/featured-tools";
import TrackedLink from "@/components/analytics/TrackedLink";

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
        <section className="max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-1">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    {heading}
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                    {subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <TrackedLink
                        key={item.slug}
                        href={item.href}
                        analytics={{
                            source_type: "featured_tools",
                            source_variant: variant,
                            source_category: categorySlug,
                            target_slug: item.slug,
                            target_category: item.category,
                        }}
                        className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-center text-sm font-medium leading-snug text-slate-700 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE] hover:text-[#CC4A1A]"
                    >
                        {item.label}
                    </TrackedLink>
                ))}
            </div>
        </section>
    );
}
