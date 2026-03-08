import { findCalculatorByRoute, normalizeCalculatorSlug } from "@/lib/calculators";
import { notFound, permanentRedirect } from "next/navigation";

export default function CalculatorAliasPage({
    params,
}: {
    params: { slug: string };
}) {
    const normalizedSlug = normalizeCalculatorSlug(params.slug);
    const calculator = findCalculatorByRoute(normalizedSlug);

    if (!calculator) notFound();

    permanentRedirect(`/${calculator.category}/${calculator.slug}`);
}
