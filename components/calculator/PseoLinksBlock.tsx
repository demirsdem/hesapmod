import Link from "next/link";
import {
    getPseoAnchorText,
    getPseoOptionHeading,
    getPseoOptionPillLabel,
    getPseoParentLabel,
    isLoanPseoRoute,
    pseoRoutes,
    type PseoRoute,
} from "@/lib/pseo-data";

type PseoLinksBlockProps = {
    parentSlug: string;
    category: string;
};

type PseoAmountGroup = {
    amount: number;
    routes: PseoRoute[];
};

const MAX_VISIBLE_LINKS = 36;
const MAX_VISIBLE_GROUPS = 12;

function comparePseoRoutes(left: PseoRoute, right: PseoRoute) {
    if (left.amount !== right.amount) {
        return left.amount - right.amount;
    }

    if (isLoanPseoRoute(left) && isLoanPseoRoute(right)) {
        return left.term - right.term;
    }

    if (!isLoanPseoRoute(left) && !isLoanPseoRoute(right)) {
        return left.type.localeCompare(right.type, "tr");
    }

    return isLoanPseoRoute(left) ? -1 : 1;
}

function buildVisibleGroups(routes: PseoRoute[]) {
    const groupedByAmount = new Map<number, PseoRoute[]>();

    routes.forEach((route) => {
        const current = groupedByAmount.get(route.amount);
        if (current) {
            current.push(route);
            return;
        }

        groupedByAmount.set(route.amount, [route]);
    });

    const amountGroups = Array.from(groupedByAmount.entries())
        .sort(([leftAmount], [rightAmount]) => leftAmount - rightAmount)
        .map(([amount, groupedRoutes]) => ({
            amount,
            routes: [...groupedRoutes].sort(comparePseoRoutes),
        })) satisfies PseoAmountGroup[];

    const visibleGroups: PseoAmountGroup[] = [];
    let remainingLinks = MAX_VISIBLE_LINKS;

    for (const group of amountGroups) {
        if (visibleGroups.length >= MAX_VISIBLE_GROUPS || remainingLinks <= 0) {
            break;
        }

        const maxLinksPerGroup = group.routes.some((route) => isLoanPseoRoute(route)) ? 4 : 2;
        const visibleRoutes = group.routes.slice(0, Math.min(maxLinksPerGroup, remainingLinks));

        if (visibleRoutes.length === 0) {
            continue;
        }

        visibleGroups.push({
            amount: group.amount,
            routes: visibleRoutes,
        });
        remainingLinks -= visibleRoutes.length;
    }

    return visibleGroups;
}

export default function PseoLinksBlock({
    parentSlug,
    category,
}: PseoLinksBlockProps) {
    const routes = pseoRoutes
        .filter((route) => route.parentSlug === parentSlug && route.category === category)
        .sort(comparePseoRoutes);

    if (routes.length === 0) {
        return null;
    }

    const parentLabel = getPseoParentLabel(parentSlug);
    const visibleGroups = buildVisibleGroups(routes);
    const isLoanParent = visibleGroups.some((group) => group.routes.some((route) => isLoanPseoRoute(route)));
    const title = isLoanParent
        ? `Sık Aranan ${parentLabel} Seçenekleri`
        : "Sık Aranan Maaş Senaryoları";

    return (
        <section
            aria-labelledby="pseo-links-heading"
            className="mt-12 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 md:p-8"
        >
            <div className="max-w-3xl">
                <h2
                    id="pseo-links-heading"
                    className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
                >
                    {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    En çok aranan tutar kombinasyonlarını tek ekranda tarayın; size uygun vade
                    ya da maaş senaryosuna doğrudan geçin.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {visibleGroups.map((group) => (
                    <section
                        key={group.amount}
                        aria-label={getPseoOptionHeading(group.routes[0])}
                        className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <h3 className="break-words text-sm font-semibold text-slate-900">
                            {getPseoOptionHeading(group.routes[0])}
                        </h3>
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {group.routes.map((route) => {
                                const href = `/${route.category}/${route.parentSlug}/${route.detailSlug}`;

                                return (
                                    <Link
                                        key={route.detailSlug}
                                        href={href}
                                        title={getPseoAnchorText(route)}
                                        className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-lg border border-slate-200 px-3 py-3 text-center text-sm font-medium leading-snug text-blue-700 transition-colors hover:bg-blue-50"
                                    >
                                        {getPseoOptionPillLabel(route)}
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </section>
    );
}
