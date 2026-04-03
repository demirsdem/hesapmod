import "server-only";

import { findCalculatorBySlug } from "./calculators";
import { getCategoryName, normalizeCategorySlug } from "./categories";

export type FeaturedToolsVariant = "homepage" | "category" | "guide" | "footer";

export type FeaturedToolItem = {
    slug: string;
    label: string;
    href: string;
    category: string;
    priority: number;
};

export type FeaturedToolDefinition = {
    slug: string;
    label: string;
    priority: number;
    variants: Exclude<FeaturedToolsVariant, "category">[];
    categoryGroups: string[];
};

export const FEATURED_TOOL_DEFINITIONS: FeaturedToolDefinition[] = [
    {
        slug: "maas-hesaplama",
        label: "Maaş Hesaplama",
        priority: 100,
        variants: ["homepage", "guide", "footer"],
        categoryGroups: ["maas-ve-vergi"],
    },
    {
        slug: "gelir-vergisi-hesaplama",
        label: "Gelir Vergisi Hesaplama",
        priority: 99,
        variants: ["guide"],
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
        slug: "asgari-ucret-hesaplama",
        label: "Asgari Ücret Hesaplama",
        priority: 95,
        variants: ["guide"],
        categoryGroups: ["maas-ve-vergi"],
    },
    {
        slug: "enflasyon-hesaplama",
        label: "Enflasyon Hesaplama",
        priority: 97,
        variants: ["guide", "footer"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "kredi-taksit-hesaplama",
        label: "Kredi Taksit Hesaplama",
        priority: 96,
        variants: ["guide", "footer"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "kredi-karti-gecikme-faizi-hesaplama",
        label: "Kredi Kartı Gecikme Faizi",
        priority: 94,
        variants: ["homepage", "guide"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "doviz-hesaplama",
        label: "Döviz Hesaplama",
        priority: 93,
        variants: ["guide"],
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
        slug: "ihtiyac-kredisi-hesaplama",
        label: "İhtiyaç Kredisi Hesaplama",
        priority: 91,
        variants: ["guide"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "altin-hesaplama",
        label: "Altın Hesaplama",
        priority: 88,
        variants: ["homepage", "guide"],
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
        slug: "konut-kredisi-hesaplama",
        label: "Konut Kredisi Hesaplama",
        priority: 89,
        variants: ["guide"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "reel-getiri-hesaplama",
        label: "Reel Getiri Hesaplama",
        priority: 87,
        variants: ["guide"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "bono-hesaplama",
        label: "Bono Hesaplama",
        priority: 83,
        variants: ["guide"],
        categoryGroups: ["finansal-hesaplamalar"],
    },
    {
        slug: "bilesik-buyume-hesaplama",
        label: "CAGR Hesaplama",
        priority: 82,
        variants: ["guide"],
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
        slug: "kpss-puan-hesaplama",
        label: "KPSS Puan Hesaplama",
        priority: 85,
        variants: ["guide"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "tyt-puan-hesaplama",
        label: "TYT Puan Hesaplama",
        priority: 84,
        variants: ["guide"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "lgs-puan-hesaplama",
        label: "LGS Puan Hesaplama",
        priority: 82,
        variants: ["homepage", "guide"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "ales-puan-hesaplama",
        label: "ALES Puan Hesaplama",
        priority: 81,
        variants: ["guide"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "obp-puan-hesaplama",
        label: "OBP Puan Hesaplama",
        priority: 80,
        variants: ["guide"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "dgs-puan-hesaplama",
        label: "DGS Puan Hesaplama",
        priority: 79,
        variants: ["guide"],
        categoryGroups: ["sinav-hesaplamalari"],
    },
    {
        slug: "tasit-kredisi-hesaplama",
        label: "Taşıt Kredisi Hesaplama",
        priority: 84,
        variants: ["homepage", "guide", "footer"],
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
        slug: "kira-artis-hesaplama",
        label: "Kira Artış Hesaplama",
        priority: 89,
        variants: ["guide"],
        categoryGroups: ["finansal-hesaplamalar", "maas-ve-vergi"],
    },
    {
        slug: "yas-hesaplama-detayli",
        label: "Yaş Hesaplama",
        priority: 78,
        variants: ["homepage", "footer"],
        categoryGroups: ["zaman-hesaplama"],
    },
    {
        slug: "iki-tarih-arasindaki-hafta-sayisi-hesaplama",
        label: "İki Tarih Arası Hafta",
        priority: 77,
        variants: ["guide"],
        categoryGroups: ["zaman-hesaplama"],
    },
    {
        slug: "ay-evresi-hesaplama",
        label: "Ay Evresi Hesaplama",
        priority: 76,
        variants: ["guide"],
        categoryGroups: ["zaman-hesaplama"],
    },
];

const CATEGORY_TITLES: Partial<Record<string, string>> = {
    "finansal-hesaplamalar": "Bu Kategoride Öne Çıkanlar",
    "maas-ve-vergi": "Maaş ve Vergide Sık Kullanılanlar",
    "sinav-hesaplamalari": "Sınav Döneminde Öne Çıkanlar",
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
