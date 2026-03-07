import { normalizeCategorySlug } from "@/lib/categories";
import type { CalculatorFormula, CalculatorRuntimeLoader } from "@/lib/calculator-types";

const runtimeLoaders: Record<string, CalculatorRuntimeLoader> = {
    "finansal-hesaplamalar": () => import("./finance"),
    "maas-ve-vergi": () => import("./salary-tax"),
    "yasam-hesaplama": () => import("./life"),
    "matematik-hesaplama": () => import("./math"),
    "zaman-hesaplama": () => import("./time"),
    "sinav-hesaplamalari": () => import("./exams"),
    "ticaret-ve-is": () => import("./trade"),
    "astroloji": () => import("./astrology"),
    "tasit-ve-vergi": () => import("./vehicle"),
};

export async function loadCalculatorFormula(
    category: string,
    slug: string
): Promise<CalculatorFormula | null> {
    const normalizedCategory = normalizeCategorySlug(category);
    const loader = runtimeLoaders[normalizedCategory];
    if (!loader) {
        return null;
    }

    const runtime = await loader();
    return runtime.formulas[slug] ?? null;
}
