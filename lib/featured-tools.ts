import "server-only";

import { findCalculatorBySlug } from "@/lib/calculators";
import { getCategoryName, normalizeCategorySlug } from "@/lib/categories";

export type FeaturedToolsVariant = "homepage" | "category" | "guide" | "footer";

export type FeaturedToolItem = {
    slug: string;
    label: string;
    href: string;
    category: string;
    priority: number;
};

type FeaturedToolDefinition = {
    slug: string;
    label: string;
    priority: number;
    variants: Exclude<FeaturedToolsVariant, "category">[];
    categoryGroups: string[];
};

const FEATURED_TOOL_DEFINITIONS: FeaturedToolDefinition[] = [
    {
        slug: "maas-hesaplama",
        label: "Maaş Hesaplama",
        priority: 100,
        variants: ["homepage", "guide", "footer"],
        categoryGroups: ["maas-ve-vergi"],
    },
    {
        slug: "kdv-hesaplama",
        label: "KDV Hesaplama",
        priority: 98,
        variants: ["homepage", "guide", "footer"],
        categoryGroups: ["finansal-hesaplamalar", "maas-ve-vergi"],
    },
    {
        slug: "kredi-karti-gecikme-faizi-hesaplama",
        label: "Kredi Kartı Gecikme Faizi",
        priority: 94,
        variants: ["homepage"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "eurobond-hesaplama",
        label: "Eurobond Hesaplama",
        priority: 90,
        variants: ["homepage", "guide"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "altin-hesaplama",
        label: "Altın Hesaplama",
        priority: 88,
        variants: ["homepage"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "mevduat-faiz-hesaplama",
        label: "Mevduat Faizi Hesaplama",
        priority: 92,
        variants: ["homepage", "guide", "footer"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "yks-puan-hesaplama",
        label: "YKS Puan Hesaplama",
        priority: 86,
        variants: ["homepage", "guide", "footer"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "lgs-puan-hesaplama",
        label: "LGS Puan Hesaplama",
        priority: 82,
        variants: ["homepage"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "tasit-kredisi-hesaplama",
        label: "Taşıt Kredisi Hesaplama",
        priority: 84,
        variants: ["homepage", "footer"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "yukselen-burc-hesaplama",
        label: "Yükselen Burç Hesaplama",
        priority: 76,
        variants: ["homepage"],
        categoryGroups: ["astroloji"],
    },
    {
        slug: "kidem-tazminati-hesaplama",
        label: "Kıdem Tazminatı Hesaplama",
        priority: 87,
        variants: ["homepage", "guide"],
        categoryGroups: ["maas-ve-vergi"],
    },
    {
        slug: "yas-hesaplama-detayli",
        label: "Yaş Hesaplama",
        priority: 78,
        variants: ["homepage", "footer"],
        categoryGroups: ["zaman-hesaplama"],
    },
];

const CATEGORY_TITLES: Partial<Record<string, string>> = {
    "finansal-hesaplamalar": "Finansta Öne Çıkan Araçlar",
    "maas-ve-vergi": "Maaş ve Vergide Hızlı Erişim",
    "sinav-hesaplamalari": "Sınav Döneminde Sık Açılan Araçlar",
    astroloji: "Astrolojide Hızlı Erişim",
    "zaman-hesaplama": "Zaman Araçlarında Öne Çıkanlar",
};

export function getFeaturedToolsTitle(
    variant: FeaturedToolsVariant,
    categorySlug?: string,
    customTitle?: string
) {
    if (customTitle) {
        return customTitle;
    }

    if (variant === "homepage") {
        return "Öne Çıkan Hesaplama Araçları";
    }

    if (variant === "guide") {
        return "Bu Konuda Sık Kullanılan Araçlar";
    }

    if (variant === "footer") {
        return "Hızlı Erişim";
    }

    const normalizedCategory = categorySlug ? normalizeCategorySlug(categorySlug) : undefined;
    if (!normalizedCategory) {
        return "Diğer Popüler Araçlar";
    }

    return CATEGORY_TITLES[normalizedCategory] ?? `${getCategoryName(normalizedCategory)} İçin Popüler Araçlar`;
}

export function getFeaturedToolItems(
    variant: FeaturedToolsVariant,
    categorySlug?: string,
    maxItems?: number
): FeaturedToolItem[] {
    const normalizedCategory = categorySlug ? normalizeCategorySlug(categorySlug) : undefined;

    const selectedTools = FEATURED_TOOL_DEFINITIONS
        .filter((tool) => {
            if (variant === "category") {
                return normalizedCategory ? tool.categoryGroups.includes(normalizedCategory) : false;
            }

            return tool.variants.includes(variant);
        })
        .sort((left, right) => right.priority - left.priority);

    const resolvedItems = selectedTools
        .map((tool) => {
            const calculator = findCalculatorBySlug(tool.slug);
            if (!calculator) {
                return null;
            }

            return {
                slug: calculator.slug,
                label: tool.label,
                href: `/${calculator.category}/${calculator.slug}`,
                category: calculator.category,
                priority: tool.priority,
            } satisfies FeaturedToolItem;
        })
        .filter((item): item is FeaturedToolItem => item !== null);

    const limit =
        typeof maxItems === "number" && maxItems > 0
            ? maxItems
            : variant === "homepage"
                ? 8
                : 6;

    return resolvedItems.slice(0, limit);
}

