import Link from "next/link";
import {
    formatPseoAmount,
    getPseoAnchorText,
    isLoanPseoRoute,
    pseoRoutes,
    type PseoLoanRoute,
} from "@/lib/pseo-data";

type PseoSiblingLinksProps = {
    currentAmount: number;
    currentTerm?: number;
    slug: string;
    category: string;
};

function buildRouteHref(category: string, slug: string, detailSlug: string) {
    return `/${category}/${slug}/${detailSlug}`;
}

export default function PseoSiblingLinks({
    currentAmount,
    currentTerm,
    slug,
    category,
}: PseoSiblingLinksProps) {
    if (typeof currentTerm !== "number") {
        return null;
    }

    const siblingRoutes = pseoRoutes
        .filter((route): route is PseoLoanRoute => (
            route.category === category
            && route.parentSlug === slug
            && isLoanPseoRoute(route)
        ));

    const sameAmountDifferentTerms = siblingRoutes
        .filter((route) => route.amount === currentAmount && route.term !== currentTerm)
        .sort((left, right) => left.term - right.term)
        .slice(0, 6);

    const sameTermDifferentAmounts = siblingRoutes
        .filter((route) => route.term === currentTerm && route.amount !== currentAmount)
        .sort((left, right) => {
            const leftDistance = Math.abs(left.amount - currentAmount);
            const rightDistance = Math.abs(right.amount - currentAmount);
            return leftDistance - rightDistance || left.amount - right.amount;
        })
        .slice(0, 6);

    if (sameAmountDifferentTerms.length === 0 && sameTermDifferentAmounts.length === 0) {
        return null;
    }

    return (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-8">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Bunu da İnceleyin: Alternatif {currentTerm} Ay ve {formatPseoAmount(currentAmount)} TL Seçenekleri
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Aynı kredi tutarını farklı vadelerle ya da aynı vadeyi yakın tutarlarla
                    karşılaştırarak yatay geçiş yapabilirsiniz.
                </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {sameAmountDifferentTerms.length > 0 && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Aynı tutar, farklı vadeler
                        </h3>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {sameAmountDifferentTerms.map((route) => (
                                <Link
                                    key={route.detailSlug}
                                    href={buildRouteHref(route.category, route.parentSlug, route.detailSlug)}
                                    title={getPseoAnchorText(route)}
                                    className="rounded-lg border border-slate-200 p-3 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                                >
                                    {formatPseoAmount(route.amount)} TL {route.term} Ay
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {sameTermDifferentAmounts.length > 0 && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Aynı vade, yakın tutarlar
                        </h3>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {sameTermDifferentAmounts.map((route) => (
                                <Link
                                    key={route.detailSlug}
                                    href={buildRouteHref(route.category, route.parentSlug, route.detailSlug)}
                                    title={getPseoAnchorText(route)}
                                    className="rounded-lg border border-slate-200 p-3 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                                >
                                    {formatPseoAmount(route.amount)} TL {route.term} Ay
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
}
