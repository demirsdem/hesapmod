"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalculatorClientEntry, LanguageCode } from "@/lib/calculator-types";

export const CONSTRUCTION_MATERIAL_LIST_KEY = "insaat-malzeme-listesi";

type MaterialListEntry = {
    slug: string;
    label: string;
    value: string;
    updatedAt: number;
};

type MaterialSummary = {
    label: string;
    value: string;
};

type ConstructionMaterialListProps = {
    calculator: Pick<CalculatorClientEntry, "slug" | "category" | "name">;
    values: Record<string, any>;
    results: Record<string, any>;
    lang: LanguageCode;
};

function readEntries() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = window.sessionStorage.getItem(CONSTRUCTION_MATERIAL_LIST_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((entry): entry is MaterialListEntry => (
            entry
            && typeof entry.slug === "string"
            && typeof entry.label === "string"
            && typeof entry.value === "string"
            && typeof entry.updatedAt === "number"
        ));
    } catch {
        return [];
    }
}

function writeEntries(entries: MaterialListEntry[]) {
    window.sessionStorage.setItem(CONSTRUCTION_MATERIAL_LIST_KEY, JSON.stringify(entries));
}

function formatNumber(value: number, lang: LanguageCode, maximumFractionDigits = 1) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        maximumFractionDigits,
    });
}

function readNumber(value: any) {
    const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
}

function getMaterialSummary(
    calculator: Pick<CalculatorClientEntry, "slug" | "name">,
    results: Record<string, any>,
    values: Record<string, any>,
    lang: LanguageCode
): MaterialSummary | null {
    switch (calculator.slug) {
        case "cimento-hesaplama": {
            const bagCount = readNumber(results.bagCount);
            if (bagCount <= 0) return null;
            return { label: "Çimento", value: `${formatNumber(bagCount, lang, 0)} torba` };
        }
        case "beton-hesaplama": {
            const orderVolumeM3 = readNumber(results.orderVolumeM3);
            if (orderVolumeM3 <= 0) return null;
            return { label: "Beton", value: `${formatNumber(orderVolumeM3, lang, 2)} m³` };
        }
        case "kum-hesaplama": {
            const totalVolumeM3 = readNumber(results.totalVolumeM3);
            if (totalVolumeM3 <= 0) return null;
            return { label: "Kum", value: `${formatNumber(totalVolumeM3, lang, 2)} m³` };
        }
        case "siva-hesaplama": {
            const plasterKg = readNumber(results.plasterKg);
            if (plasterKg <= 0) return null;
            return { label: "Sıva", value: `${formatNumber(plasterKg, lang, 0)} kg` };
        }
        case "alci-hesaplama": {
            const bagCount = readNumber(results.bagCount);
            if (bagCount <= 0) return null;
            return { label: "Alçı", value: `${formatNumber(bagCount, lang, 0)} torba` };
        }
        case "demir-hesaplama": {
            const totalRebarKg = readNumber(results.totalRebarKg);
            if (totalRebarKg <= 0) return null;
            return { label: "Demir", value: `${formatNumber(totalRebarKg, lang, 0)} kg` };
        }
        default: {
            const firstNumericResult = Object.values(results).find((value) => readNumber(value) > 0);
            if (!firstNumericResult) return null;
            const fallbackLabel = calculator.name.tr
                .replace(/\s*Hesaplama\s*$/i, "")
                .trim() || "Malzeme";

            return {
                label: values.materialName || fallbackLabel,
                value: formatNumber(readNumber(firstNumericResult), lang, 2),
            };
        }
    }
}

export default function ConstructionMaterialList({
    calculator,
    values,
    results,
    lang,
}: ConstructionMaterialListProps) {
    const isConstructionPage = calculator.category === "insaat-muhendislik";
    const summary = useMemo(
        () => getMaterialSummary(calculator, results, values, lang),
        [calculator, lang, results, values]
    );
    const [entries, setEntries] = useState<MaterialListEntry[]>([]);
    const [status, setStatus] = useState<"idle" | "added" | "copied">("idle");

    useEffect(() => {
        if (!isConstructionPage) {
            return;
        }

        setEntries(readEntries());

        const onStorage = (event: StorageEvent) => {
            if (event.key === CONSTRUCTION_MATERIAL_LIST_KEY) {
                setEntries(readEntries());
            }
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [isConstructionPage]);

    if (!isConstructionPage) {
        return null;
    }

    const addCurrentResult = () => {
        if (!summary) {
            return;
        }

        const nextEntry: MaterialListEntry = {
            slug: calculator.slug,
            label: summary.label,
            value: summary.value,
            updatedAt: Date.now(),
        };
        const nextEntries = [
            nextEntry,
            ...entries.filter((entry) => entry.slug !== calculator.slug),
        ];

        writeEntries(nextEntries);
        setEntries(nextEntries);
        setStatus("added");
        window.setTimeout(() => setStatus("idle"), 2000);
    };

    const clearEntries = () => {
        writeEntries([]);
        setEntries([]);
        setStatus("idle");
    };

    const copyAll = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard || entries.length === 0) {
            return;
        }

        const text = [
            "📋 Malzeme Listesi",
            "━━━━━━━━━━━━━━━━━━",
            ...entries.map((entry) => `${entry.label}: ${entry.value}`),
            "━━━━━━━━━━━━━━━━━━",
            "hesapmod.com ile hesaplandı",
        ].join("\n");

        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
            window.setTimeout(() => setStatus("idle"), 2000);
        } catch {
            setStatus("idle");
        }
    };

    return (
        <>
            <div className="mt-4 rounded-lg border border-[#FFD7C7] bg-[#FFF3EE] p-3">
                <button
                    type="button"
                    onClick={addCurrentResult}
                    disabled={!summary}
                    className="min-h-[52px] w-full rounded-lg bg-[#CC4A1A] px-4 py-3 text-lg font-black text-white shadow-sm touch-manipulation transition-colors hover:bg-[#B83A12] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/25 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {status === "added" ? "✅ Listeye Eklendi" : "Bu hesabı listeye ekle"}
                </button>
            </div>

            <aside
                aria-label="Malzeme listesi"
                className="fixed bottom-4 right-4 z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
            >
                <div className="border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
                    <h3 className="text-base font-black">
                        📋 Malzeme Listesi ({entries.length} kalem)
                    </h3>
                </div>

                <div className="max-h-56 overflow-y-auto px-4 py-3">
                    {entries.length > 0 ? (
                        <div className="space-y-2">
                            {entries.map((entry) => (
                                <div
                                    key={entry.slug}
                                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900"
                                >
                                    <span>{entry.label}:</span>
                                    <span className="text-right text-[#B83A12]">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm font-semibold leading-6 text-slate-500">
                            Henüz malzeme eklenmedi.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-slate-50 p-3">
                    <button
                        type="button"
                        onClick={copyAll}
                        disabled={entries.length === 0}
                        className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-800 shadow-sm touch-manipulation transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                        {status === "copied" ? "✅ Kopyalandı" : "Tümünü Kopyala"}
                    </button>
                    <button
                        type="button"
                        onClick={clearEntries}
                        disabled={entries.length === 0}
                        className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-800 shadow-sm touch-manipulation transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                        Temizle
                    </button>
                </div>
            </aside>
        </>
    );
}
