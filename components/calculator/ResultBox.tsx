"use client";

// ✅ H-3 FIX: "use client" direktifi eklendi (navigator.clipboard için gerekli)
import React from "react";
import type { CalculatorResult } from "@/lib/calculator-types";
import { Copy, Share2, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { safeDisplayNumber } from "@/lib/safe-number";

interface Props {
    results: Record<string, any>;
    config: CalculatorResult[];
    lang: "tr" | "en";
}

function isLocalizedValue(value: unknown): value is { tr?: unknown; en?: unknown } {
    return typeof value === "object" && value !== null && !Array.isArray(value) && ("tr" in value || "en" in value);
}

function formatNumber(value: number, result: CalculatorResult, lang: "tr" | "en") {
    if (!Number.isFinite(value)) {
        return "—";
    }

    return safeDisplayNumber(value).toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: result.decimalPlaces ?? 0,
        maximumFractionDigits: result.decimalPlaces ?? 2,
    });
}

function formatTableNumber(value: unknown, lang: "tr" | "en") {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return "—";
    }

    return numericValue.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatUnknownResultValue(value: unknown, result: CalculatorResult, lang: "tr" | "en"): string {
    if (value === undefined || value === null) {
        return "—";
    }

    if (typeof value === "number") {
        return formatNumber(value, result, lang);
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "boolean") {
        return lang === "tr" ? (value ? "Evet" : "Hayır") : (value ? "Yes" : "No");
    }

    if (isLocalizedValue(value)) {
        const localizedValue = value[lang] ?? value.tr ?? value.en;
        return formatUnknownResultValue(localizedValue, result, lang);
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return "—";
        }

        return value
            .map((item) => formatUnknownResultValue(item, result, lang))
            .filter(Boolean)
            .join("\n");
    }

    if (typeof value === "object") {
        const summary = Object.entries(value as Record<string, unknown>)
            .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
            .map(([key, entryValue]) => `${key}: ${formatUnknownResultValue(entryValue, result, lang)}`)
            .join(", ");

        return summary || "—";
    }

    return String(value);
}

function getDepreciationRows(value: unknown) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((row, index) => {
            const source = typeof row === "object" && row !== null ? row as Record<string, unknown> : {};
            const year = Number(source.yil ?? source.year ?? index + 1);
            const depreciation = Number(source.amortisman ?? source.depreciation ?? 0);
            const remaining = Number(source.kalan ?? source.remaining ?? 0);

            return { year, depreciation, remaining };
        })
        .filter((row) => Number.isFinite(row.year));
}

export default function ResultBox({ results, config, lang }: Props) {
    const safeResults = results && typeof results === "object" ? results : {};
    const safeConfig = Array.isArray(config) ? config : [];

    // ✅ H-3 FIX: clipboard guard — SSR-safe + hata yakalama
    const handleCopy = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        const visibleConfig = safeConfig.filter((c) => safeResults[c.id] !== undefined && safeResults[c.id] !== null);
        const text = visibleConfig
            .map((c) => {
                const val = formatUnknownResultValue(safeResults[c.id], c, lang);
                return `${c.label[lang]}: ${val ?? ""} ${c.suffix || ""}`;
            })
            .join("\n");
        try {
            await navigator.clipboard.writeText(text);
            trackEvent("calculator_result_copy", {
                locale: lang,
                result_count: visibleConfig.length,
            });
        } catch {
            // Clipboard erişimi reddedilirse sessizce geç
        }
    };

    const handleShare = async () => {
        if (typeof navigator === "undefined") return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "HesapMod Sonucu",
                    url: window.location.href,
                });
                trackEvent("calculator_result_share", {
                    locale: lang,
                    method: "native_share",
                });
            } catch {
                // Paylaşım iptal edildi
            }
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href).then(() => {
                trackEvent("calculator_result_share", {
                    locale: lang,
                    method: "clipboard_fallback",
                });
            }).catch(() => { });
        }
    };

    const handleWhatsAppShare = () => {
        if (typeof window === "undefined") return;
        const text = lang === "tr"
            ? `HesapMod'da faydalı bir hesaplama aracı buldum. Hemen incele:\n\n${window.location.href}`
            : `I found a useful calculator tool on HesapMod. Check it out:\n\n${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        trackEvent("calculator_result_share", {
            locale: lang,
            method: "whatsapp",
        });
        window.open(url, "_blank");
    };

    return (
        <div className="bg-slate-100 border border-slate-200 shadow-sm rounded-xl p-8 space-y-8 animate-scale-in relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-lg font-medium text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                    {lang === "tr" ? "Sonuçlar" : "Results"}
                </h3>

                <div className="space-y-6">
                    {safeConfig.filter((res) => safeResults[res.id] !== undefined && safeResults[res.id] !== null).map((res, idx) => (
                        <div
                            key={res.id}
                            className="border-b border-slate-200 pb-4 last:border-0"
                        >
                            <p className="text-sm text-slate-600 mb-1 font-medium">
                                {res.label[lang]}
                            </p>
                            {res.type === "bankRates" ? (
                                <div className="mt-3 space-y-2">
                                    {Array.isArray(safeResults[res.id]) && safeResults[res.id].length > 0 ? (
                                        safeResults[res.id].map((bankRate: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-base md:text-lg bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-800">
                                                <span className="font-semibold tracking-tight">{bankRate.bank}</span>
                                                <span className="rounded-md bg-[#FFF3EE] px-2 py-0.5 font-bold text-[#CC4A1A]">
                                                    %{bankRate.rate}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-600 text-sm">{lang === "tr" ? "Mevcut oran bulunamadı." : "No rates found."}</p>
                                    )}
                                </div>
                            ) : res.type === "pieChart" ? (
                                (() => {
                                    const raw = safeResults[res.id] || { segments: [] };
                                    const segments: any[] = raw.segments || [];
                                    const total = segments.reduce((acc, seg) => acc + safeDisplayNumber(seg.value), 0);

                                    if (total === 0 || segments.length === 0) return null;

                                    let currentPct = 0;
                                    const gradientParts = segments.map(seg => {
                                        const pct = (safeDisplayNumber(seg.value) / total) * 100;
                                        const endPct = currentPct + pct;
                                        const part = `${seg.colorHex} ${currentPct}% ${endPct}%`;
                                        currentPct = endPct;
                                        return part;
                                    });

                                    return (
                                        <div className="mt-4 flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200">
                                            {/* Native CSS Pie Chart */}
                                            <div
                                                className="w-32 h-32 rounded-full shadow-inner flex-shrink-0"
                                                style={{
                                                    background: `conic-gradient(from 0deg, ${gradientParts.join(', ')})`
                                                }}
                                            />
                                            <div className="flex-1 space-y-3 w-full">
                                                {segments.map((seg, idx) => {
                                                    const segmentValue = safeDisplayNumber(seg.value);
                                                    const pct = (segmentValue / total) * 100;
                                                    return (
                                                        <div key={idx} className="flex justify-between items-center text-sm md:text-base">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-3 h-3 rounded-full shadow-sm ${seg.colorClass}`} style={!seg.colorClass ? { backgroundColor: seg.colorHex } : undefined} />
                                                                <span className="font-medium text-slate-800">{seg.label[lang] || seg.label}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-slate-600 text-xs hidden sm:inline-block">
                                                                    {segmentValue.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₺
                                                                </span>
                                                                <span className="font-bold text-slate-900">%{pct.toFixed(1)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : res.type === "schedule" ? (
                                (() => {
                                    const rawSched: any[] = Array.isArray(safeResults[res.id]) ? safeResults[res.id] : [];
                                    if (rawSched.length === 0) return null;

                                    return (
                                        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                            <table className="w-full text-[11px] sm:text-sm text-left text-slate-800">
                                                <thead className="bg-slate-50 font-semibold sticky top-0 leading-tight text-slate-900 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-center">{lang === "tr" ? "Ay" : "Mo"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Taksit (₺)" : "Pay"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Anapara" : "Prin."}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Faiz" : "Int."}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Kalan" : "Bal."}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {rawSched.map((row) => (
                                                        <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-1.5 sm:px-4 py-2 text-center text-slate-600">{row.month}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 font-bold text-right tracking-tighter sm:tracking-normal text-slate-800">{Math.round(row.payment).toLocaleString("tr-TR")}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 text-slate-600 text-right tracking-tighter sm:tracking-normal">{Math.round(row.principal).toLocaleString("tr-TR")}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 text-red-600 text-right tracking-tighter sm:tracking-normal">{Math.round(row.interest).toLocaleString("tr-TR")}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 text-slate-800 text-right font-medium tracking-tighter sm:tracking-normal">{Math.round(row.remaining).toLocaleString("tr-TR")}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()
                            ) : res.type === "growthSchedule" ? (
                                (() => {
                                    const rawSched: any[] = Array.isArray(safeResults[res.id]) ? safeResults[res.id] : [];
                                    if (rawSched.length === 0) return null;
                                    const scheduleSuffix = res.suffix ?? (lang === "tr" ? " ₺" : "");

                                    return (
                                        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                            <table className="w-full text-[11px] sm:text-sm text-left text-slate-800">
                                                <thead className="bg-slate-50 font-semibold sticky top-0 leading-tight text-slate-900 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-center">{lang === "tr" ? "Dönem" : "Period"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Başlangıç" : "Starts"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Kazanılan" : "Earned"}</th>
                                                        <th className="px-1.5 sm:px-4 py-2 sm:py-3 text-right">{lang === "tr" ? "Toplam" : "Total"}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {rawSched.map((row) => (
                                                        <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-1.5 sm:px-4 py-2 text-center text-slate-600">{row.period}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 text-slate-600 text-right tracking-tighter sm:tracking-normal">{Math.round(row.start).toLocaleString("tr-TR")}{scheduleSuffix}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 font-medium text-right text-emerald-600 tracking-tighter sm:tracking-normal">+{Math.round(row.interest).toLocaleString("tr-TR")}{scheduleSuffix}</td>
                                                            <td className="px-1.5 sm:px-4 py-2 font-bold text-right tracking-tighter sm:tracking-normal text-slate-800">{Math.round(row.end).toLocaleString("tr-TR")}{scheduleSuffix}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()
                            ) : res.type === "depreciationSchedule" ? (
                                (() => {
                                    const rows = getDepreciationRows(safeResults[res.id]);
                                    if (rows.length === 0) {
                                        return (
                                            <p className="text-sm text-slate-600">
                                                {lang === "tr" ? "Tablo verisi bulunamadı." : "No table data found."}
                                            </p>
                                        );
                                    }

                                    return (
                                        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                            <table className="w-full text-[11px] text-slate-800 sm:text-sm">
                                                <thead className="border-b border-slate-200 bg-slate-50 text-left font-semibold leading-tight text-slate-900">
                                                    <tr>
                                                        <th className="px-2 py-3 text-center sm:px-4">{lang === "tr" ? "Yıl" : "Year"}</th>
                                                        <th className="px-2 py-3 text-right sm:px-4">{lang === "tr" ? "Amortisman" : "Depreciation"}</th>
                                                        <th className="px-2 py-3 text-right sm:px-4">{lang === "tr" ? "Kalan Net Defter" : "Remaining Book Value"}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {rows.map((row, rowIndex) => (
                                                        <tr key={`${row.year}-${rowIndex}`} className="transition-colors hover:bg-slate-50">
                                                            <td className="px-2 py-2 text-center text-slate-600 sm:px-4">{row.year}</td>
                                                            <td className="px-2 py-2 text-right font-bold text-slate-800 sm:px-4">
                                                                {formatTableNumber(row.depreciation, lang)} TL
                                                            </td>
                                                            <td className="px-2 py-2 text-right font-medium text-slate-800 sm:px-4">
                                                                {formatTableNumber(row.remaining, lang)} TL
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()
                            ) : res.type === "progress-bar" ? (
                                (() => {
                                    const progressData = safeResults[res.id] || { percentage: 50, colorClass: "bg-white", text: "" };
                                    const constrainedPct = Math.min(100, Math.max(0, progressData.percentage));
                                    const displayText = typeof progressData.text === "object" ? progressData.text[lang] : progressData.text;

                                    return (
                                        <div className="mt-4 bg-white p-5 rounded-2xl border border-slate-200">
                                            <p className="text-center font-medium mb-3 text-slate-800">{displayText}</p>
                                            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200 relative">
                                                <div
                                                    className={`h-full transition-all duration-1000 ease-out ${progressData.colorClass}`}
                                                    style={{ width: `${constrainedPct}%` }}
                                                />
                                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                (() => {
                                    const formatted = formatUnknownResultValue(safeResults[res.id], res, lang);

                                    // Uzun metin sonuçları (açıklama/uyarı cümleleri) rakam
                                    // gibi 4xl gösterilirse okunmuyor ve sayısal sonuçla
                                    // karışıyor. Cümle uzunluğundaki text sonuçlarını
                                    // paragraf olarak render et; kısa text sonuçları
                                    // (tarih, "Evet", durum etiketi) eskisi gibi kalsın.
                                    if (res.type === "text" && formatted.length > 60) {
                                        return (
                                            <p className="text-base leading-relaxed text-slate-700">
                                                {res.prefix}
                                                {formatted}
                                                {res.suffix}
                                            </p>
                                        );
                                    }

                                    return (
                                        <p className="text-4xl font-extrabold tracking-tight text-[#CC4A1A]">
                                            {res.prefix}
                                            {formatted}
                                            <span className="text-lg ml-2 font-medium text-slate-600">
                                                {res.suffix}
                                            </span>
                                        </p>
                                    );
                                })()
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 sm:gap-3 relative z-10 pt-4 flex-wrap sm:flex-nowrap">
                <button
                    onClick={handleCopy}
                    aria-label="Sonuçları kopyala"
                    className="flex-1 min-w-[100px] h-12 rounded-xl bg-white hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium border border-slate-200 text-slate-700 shadow-sm text-sm sm:text-base"
                >
                    <Copy size={18} />
                    {lang === "tr" ? "Kopyala" : "Copy"}
                </button>
                <button
                    onClick={handleShare}
                    aria-label="Sayfayı paylaş"
                    className="flex-1 min-w-[100px] h-12 rounded-xl bg-white hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium border border-slate-200 text-slate-700 shadow-sm text-sm sm:text-base"
                >
                    <Share2 size={18} />
                    {lang === "tr" ? "Paylaş" : "Share"}
                </button>
                <button
                    onClick={handleWhatsAppShare}
                    aria-label="WhatsApp'ta paylaş"
                    className="flex-[2] sm:flex-1 min-w-[140px] h-12 rounded-xl bg-[#25D366] hover:bg-[#1EBE5C] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium text-white shadow-sm text-sm sm:text-base"
                >
                    <MessageCircle size={18} />
                    WhatsApp
                </button>
            </div>
        </div>
    );
}
