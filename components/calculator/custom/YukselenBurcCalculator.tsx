"use client";

import React, { useMemo, useRef, useState } from "react";
import { CalendarDays, Clock3, Copy, Download, MapPin, Share2 } from "lucide-react";
import {
    AVERAGE_TURKEY_PROVINCE,
    TURKISH_PROVINCES,
    calculateAscendantPossibilities,
    calculateAscendantResult,
    getZodiacGradientClass,
    type AscendantPossibility,
    type ZodiacSign,
} from "@/lib/ascendant";
import { trackEvent } from "@/lib/analytics";
import type { LanguageCode } from "@/lib/calculator-types";
import { cn } from "@/lib/utils";

type Props = {
    lang: LanguageCode;
};

type FormState = {
    birthDate: string;
    birthTime: string;
    provinceId: string;
};

const EMPTY_FORM: FormState = {
    birthDate: "",
    birthTime: "",
    provinceId: "",
};

const HTML2CANVAS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
const SHARE_PAGE_URL = "hesapmod.com/astroloji/yukselen-burc-hesaplama";

type Html2CanvasFunction = (
    element: HTMLElement,
    options?: {
        backgroundColor?: string | null;
        scale?: number;
        useCORS?: boolean;
    }
) => Promise<HTMLCanvasElement>;

declare global {
    interface Window {
        html2canvas?: Html2CanvasFunction;
    }
}

export default function YukselenBurcCalculator({ lang }: Props) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [isUnknownTimeMode, setIsUnknownTimeMode] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
    const [downloadStatus, setDownloadStatus] = useState<"idle" | "loading" | "error">("idle");
    const hasTrackedStartRef = useRef(false);

    const result = useMemo(
        () => calculateAscendantResult(form.birthDate, form.birthTime, form.provinceId),
        [form.birthDate, form.birthTime, form.provinceId]
    );
    const isAverageProvinceSelected = form.provinceId === AVERAGE_TURKEY_PROVINCE.id;
    const possibleAscendants = useMemo(
        () => isUnknownTimeMode
            ? calculateAscendantPossibilities(form.birthDate, form.provinceId)
            : [],
        [form.birthDate, form.provinceId, isUnknownTimeMode]
    );

    const updateField = (field: keyof FormState, value: string) => {
        if (!hasTrackedStartRef.current) {
            hasTrackedStartRef.current = true;
            trackEvent("calculator_interaction_start", {
                calculator_slug: "yukselen-burc-hesaplama",
                calculator_category: "astroloji",
                locale: lang,
                input_id: field,
            });
        }

        setForm((current) => ({
            ...current,
            [field]: value,
            ...(isUnknownTimeMode && (field === "birthDate" || field === "provinceId")
                ? { birthTime: "" }
                : {}),
        }));
        if (isUnknownTimeMode && (field === "birthDate" || field === "provinceId")) {
            setSelectedTimeRange(null);
        }
        setCopyStatus("idle");
        setDownloadStatus("idle");
    };

    const handleUnknownTimeToggle = (checked: boolean) => {
        if (!hasTrackedStartRef.current) {
            hasTrackedStartRef.current = true;
            trackEvent("calculator_interaction_start", {
                calculator_slug: "yukselen-burc-hesaplama",
                calculator_category: "astroloji",
                locale: lang,
                input_id: "unknownBirthTime",
            });
        }

        setIsUnknownTimeMode(checked);
        setSelectedTimeRange(null);
        if (checked) {
            setForm((current) => ({ ...current, birthTime: "" }));
        }
        setCopyStatus("idle");
        setDownloadStatus("idle");
    };

    const handlePossibilitySelect = (possibility: AscendantPossibility) => {
        if (!hasTrackedStartRef.current) {
            hasTrackedStartRef.current = true;
            trackEvent("calculator_interaction_start", {
                calculator_slug: "yukselen-burc-hesaplama",
                calculator_category: "astroloji",
                locale: lang,
                input_id: "unknownBirthTimeRange",
            });
        }

        setForm((current) => ({ ...current, birthTime: possibility.selectedTime }));
        setSelectedTimeRange(possibility.intervalLabel);
        setCopyStatus("idle");
        setDownloadStatus("idle");
    };

    const shareText = result
        ? [
            `${result.ascendantSign.symbol} ${lang === "tr" ? "Yükselen Burcum" : "My Rising Sign"}: ${getSignName(result.ascendantSign, lang).toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US")}`,
            `${lang === "tr" ? "☀️ Güneş" : "☀️ Sun"}: ${getSignName(result.sunSign, lang)} | ${lang === "tr" ? "🌙 Ay" : "🌙 Moon"}: ${getSignName(result.moonSign, lang)}`,
            "",
            getShareTeaser(result.ascendantSign.id, lang),
            lang === "tr" ? "Sen de öğren 👇" : "Find yours 👇",
            SHARE_PAGE_URL,
        ].join("\n")
        : "";

    const handleCopy = async () => {
        if (!shareText || typeof navigator === "undefined" || !navigator.clipboard) {
            return;
        }

        try {
            await navigator.clipboard.writeText(shareText);
            setCopyStatus("copied");
            trackEvent("calculator_result_copy", {
                calculator_slug: "yukselen-burc-hesaplama",
                locale: lang,
            });
        } catch {
            setCopyStatus("error");
        }
    };

    const handleXShare = () => {
        if (!shareText || typeof window === "undefined") {
            return;
        }

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
            "_blank",
            "noopener,noreferrer"
        );
        trackEvent("calculator_result_share", {
            calculator_slug: "yukselen-burc-hesaplama",
            locale: lang,
            method: "x",
        });
    };

    const handleDownloadImage = async () => {
        if (typeof document === "undefined") {
            return;
        }

        const card = document.getElementById("sonuc-karti");
        if (!card) {
            return;
        }

        setDownloadStatus("loading");

        try {
            const html2canvas = await loadHtml2Canvas();
            const canvas = await html2canvas(card, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });
            const link = document.createElement("a");
            link.download = "yukselen-burcum.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            setDownloadStatus("idle");
            trackEvent("calculator_result_share", {
                calculator_slug: "yukselen-burc-hesaplama",
                locale: lang,
                method: "image_download",
            });
        } catch {
            setDownloadStatus("error");
        }
    };

    return (
        <>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900">
                    {lang === "tr" ? "Yükselen Burç Hesaplama" : "Ascendant Sign Calculator"}
                </h2>

                <div className="space-y-5">
                    <FieldShell
                        icon={<CalendarDays size={18} aria-hidden="true" />}
                        label={lang === "tr" ? "Doğum Tarihi" : "Birth Date"}
                        inputId="ascendant-birth-date"
                    >
                        <input
                            id="ascendant-birth-date"
                            type="date"
                            value={form.birthDate}
                            onChange={(event) => updateField("birthDate", event.target.value)}
                            className={inputClassName}
                            required
                        />
                    </FieldShell>

                    <FieldShell
                        icon={<Clock3 size={18} aria-hidden="true" />}
                        label={lang === "tr" ? "Saat Bilgisi" : "Time Info"}
                        inputId="unknown-birth-time"
                    >
                        <label
                            htmlFor="unknown-birth-time"
                            className={cn(
                                "flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm transition-colors",
                                isUnknownTimeMode
                                    ? "border-[#FF6B35] bg-[#FFF3EE]"
                                    : "border-slate-300 bg-white hover:border-[#FFD7C7]"
                            )}
                        >
                            <span className="text-sm font-black text-slate-800">
                                {lang === "tr" ? "Saatimi Bilmiyorum" : "I don't know my birth time"}
                            </span>
                            <input
                                id="unknown-birth-time"
                                type="checkbox"
                                checked={isUnknownTimeMode}
                                onChange={(event) => handleUnknownTimeToggle(event.target.checked)}
                                className="h-5 w-5 rounded border-slate-300 text-[#CC4A1A] shadow-sm focus:ring-2 focus:ring-[#FF6B35]"
                            />
                        </label>
                    </FieldShell>

                    {!isUnknownTimeMode && (
                        <FieldShell
                            icon={<Clock3 size={18} aria-hidden="true" />}
                            label={lang === "tr" ? "Doğum Saati" : "Birth Time"}
                            inputId="ascendant-birth-time"
                        >
                            <input
                                id="ascendant-birth-time"
                                type="time"
                                value={form.birthTime}
                                onChange={(event) => updateField("birthTime", event.target.value)}
                                className={inputClassName}
                                required
                            />
                        </FieldShell>
                    )}

                    <FieldShell
                        icon={<MapPin size={18} aria-hidden="true" />}
                        label={lang === "tr" ? "İl" : "City"}
                        inputId="ascendant-province"
                    >
                        <select
                            id="ascendant-province"
                            value={form.provinceId}
                            onChange={(event) => updateField("provinceId", event.target.value)}
                            className={cn(inputClassName, "appearance-none")}
                            required
                        >
                            <option value="">
                                {lang === "tr" ? "İl seçin" : "Select city"}
                            </option>
                            {TURKISH_PROVINCES.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                            <option value={AVERAGE_TURKEY_PROVINCE.id}>
                                {lang === "tr" ? "Diğer / Ortalama" : "Other / Average"}
                            </option>
                        </select>
                    </FieldShell>

                    {isUnknownTimeMode && (
                        <UnknownTimePossibilitiesTable
                            lang={lang}
                            rows={possibleAscendants}
                            selectedRange={selectedTimeRange}
                            onSelect={handlePossibilitySelect}
                            isReady={Boolean(form.birthDate && form.provinceId)}
                        />
                    )}
                </div>
            </section>

            <section className="md:sticky md:top-24" aria-live="polite">
                {result ? (
                    <div className="space-y-4">
                        <article
                            className={cn(
                                "relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-white shadow-lg sm:p-8",
                                getZodiacGradientClass(result.ascendantSign.element)
                            )}
                        >
                            <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
                            <div className="relative z-10">
                                <div className="flex flex-col items-center text-center">
                                    <div className="text-7xl leading-none sm:text-8xl">
                                        {result.ascendantSign.symbol}
                                    </div>
                                    <h3 className="mt-4 max-w-full break-words text-4xl font-black sm:text-5xl">
                                        {getSignName(result.ascendantSign, lang).toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US")}
                                    </h3>
                                    <p className="mt-2 text-base font-semibold text-white/90 sm:text-lg">
                                        {lang === "tr" ? "Yükselen Burcunuz" : "Your Ascendant Sign"}
                                    </p>
                                </div>

                                <dl className="mt-8 space-y-4 border-t border-white/30 pt-6">
                                    <div className="flex flex-col gap-1 border-b border-white/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                        <dt className="text-sm font-semibold text-white/80">
                                            {lang === "tr" ? "Güneş Burcunuz" : "Sun Sign"}
                                        </dt>
                                        <dd className="text-lg font-black">
                                            {result.sunSign.symbol} {getSignName(result.sunSign, lang)}
                                        </dd>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <dt className="text-sm font-semibold text-white/80">
                                            {lang === "tr" ? "Tahmini Aralık" : "Estimated Window"}
                                        </dt>
                                        <dd className="text-lg font-black tabular-nums">
                                            {result.intervalLabel}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white px-4 py-3 text-sm font-black text-slate-900 shadow-sm transition-colors hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/30"
                                    >
                                        <Copy size={18} aria-hidden="true" />
                                        {copyStatus === "copied"
                                            ? (lang === "tr" ? "Kopyalandı" : "Copied")
                                            : copyStatus === "error"
                                                ? (lang === "tr" ? "Kopyalanamadı" : "Copy failed")
                                                : (lang === "tr" ? "📋 Kopyala" : "📋 Copy")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleXShare}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-slate-950/35 px-4 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-slate-950/45 focus:outline-none focus:ring-4 focus:ring-white/30"
                                    >
                                        <Share2 size={18} aria-hidden="true" />
                                        {lang === "tr" ? "🐦 X'te Paylaş" : "🐦 Share on X"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDownloadImage}
                                        disabled={downloadStatus === "loading"}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-slate-950/35 px-4 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-slate-950/45 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:cursor-wait disabled:opacity-70"
                                    >
                                        <Download size={18} aria-hidden="true" />
                                        {downloadStatus === "loading"
                                            ? (lang === "tr" ? "Hazırlanıyor" : "Preparing")
                                            : downloadStatus === "error"
                                                ? (lang === "tr" ? "Tekrar Dene" : "Try Again")
                                                : (lang === "tr" ? "📸 Görsel İndir" : "📸 Download Image")}
                                    </button>
                                </div>
                            </div>
                        </article>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-blue-950 shadow-sm">
                            {lang === "tr"
                                ? "Bu sonuç doğum saati ve il boylamına göre yaklaşık yükselen burç ön izlemesidir. Dakika hassasiyetinde doğum haritası için tam koordinat, yaz saati uygulaması ve efemeris tabanlı profesyonel hesaplama gerekir."
                                : "This is an approximate ascendant preview based on birth time and city longitude. Minute-sensitive natal charts require full coordinates, daylight-saving handling and ephemeris-based calculation."}
                        </div>

                        {isAverageProvinceSelected && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-900 shadow-sm">
                                {lang === "tr"
                                    ? "Ortalama şehir boylamı kullanıldığı için sonuç daha yaklaşık olabilir."
                                    : "Because an average city longitude is used, the result may be more approximate."}
                            </div>
                        )}

                        <ShareImageCard
                            lang={lang}
                            ascendantSign={result.ascendantSign}
                        />

                        {isUnknownTimeMode && selectedTimeRange && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-900 shadow-sm">
                                {lang === "tr"
                                    ? `Seçilen saat aralığı: ${selectedTimeRange}. Bu tahmini — doğum saatinizi öğrenince doğrulayın.`
                                    : `Selected time range: ${selectedTimeRange}. This is an estimate — verify it when you learn your birth time.`}
                            </div>
                        )}

                        <AscendantInterpretation
                            lang={lang}
                            signId={result.ascendantSign.id}
                        />
                        <CoreTriad
                            lang={lang}
                            sunSign={result.sunSign}
                            ascendantSign={result.ascendantSign}
                            moonSign={result.moonSign}
                        />
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 shadow-sm">
                        <p className="text-base font-bold text-slate-800">
                            {lang === "tr" ? "Sonuç burada görünecek" : "Your result will appear here"}
                        </p>
                        <p className="mt-2 text-sm leading-6">
                            {lang === "tr"
                                ? "Doğum tarihi, saati ve il seçildiğinde yükselen burç kartı anında oluşur."
                                : "Choose birth date, time and city to see the ascendant card instantly."}
                        </p>
                    </div>
                )}
            </section>
        </div>
        </>
    );
}

function ShareImageCard({
    ascendantSign,
    lang,
}: {
    ascendantSign: ZodiacSign;
    lang: LanguageCode;
}) {
    const signName = getSignName(ascendantSign, lang).toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US");

    return (
        <div
            id="sonuc-karti"
            className={cn(
                "fixed left-[-10000px] top-0 h-[400px] w-[400px] overflow-hidden bg-gradient-to-br p-8 text-white shadow-lg",
                getZodiacGradientClass(ascendantSign.element)
            )}
        >
            <div className="absolute inset-0 bg-slate-950/35" aria-hidden="true" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <div className="text-[118px] leading-none drop-shadow-md">
                    {ascendantSign.symbol}
                </div>
                <h2 className="mt-6 max-w-[330px] text-3xl font-black leading-tight">
                    {lang === "tr" ? "Yükselen Burcum" : "My Rising Sign"}: {signName}
                </h2>
                <p className="absolute bottom-0 right-0 text-sm font-black tracking-wide text-white/80">
                    hesapmod.com
                </p>
            </div>
        </div>
    );
}

function loadHtml2Canvas() {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Browser context is required"));
    }

    if (window.html2canvas) {
        return Promise.resolve(window.html2canvas);
    }

    return new Promise<Html2CanvasFunction>((resolve, reject) => {
        const existingScript = document.getElementById("html2canvas-cdn") as HTMLScriptElement | null;
        const script = existingScript ?? document.createElement("script");

        const cleanup = () => {
            script.removeEventListener("load", handleLoad);
            script.removeEventListener("error", handleError);
        };
        const handleLoad = () => {
            cleanup();
            if (window.html2canvas) {
                resolve(window.html2canvas);
            } else {
                reject(new Error("html2canvas could not be loaded"));
            }
        };
        const handleError = () => {
            cleanup();
            reject(new Error("html2canvas CDN failed"));
        };

        script.addEventListener("load", handleLoad);
        script.addEventListener("error", handleError);

        if (!existingScript) {
            script.id = "html2canvas-cdn";
            script.src = HTML2CANVAS_CDN;
            script.async = true;
            document.body.appendChild(script);
        }
    });
}

function UnknownTimePossibilitiesTable({
    isReady,
    lang,
    onSelect,
    rows,
    selectedRange,
}: {
    isReady: boolean;
    lang: LanguageCode;
    onSelect: (possibility: AscendantPossibility) => void;
    rows: AscendantPossibility[];
    selectedRange: string | null;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                {lang === "tr" ? "Olası Yükselen Burçlarınız" : "Possible Ascendant Signs"}
            </h3>

            {!isReady ? (
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                    {lang === "tr"
                        ? "Doğum tarihi ve il seçildiğinde olası yükselen aralıkları listelenir."
                        : "Choose birth date and city to list possible ascendant ranges."}
                </p>
            ) : (
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-xs font-black uppercase tracking-wide text-slate-600">
                            <tr>
                                <th className="px-3 py-3">{lang === "tr" ? "Saat Aralığı" : "Time Range"}</th>
                                <th className="px-3 py-3">{lang === "tr" ? "Yükselen Burç" : "Ascendant"}</th>
                                <th className="px-3 py-3 text-right">{lang === "tr" ? "Olasılık" : "Chance"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row) => {
                                const isSelected = selectedRange === row.intervalLabel;

                                return (
                                    <tr
                                        key={row.intervalLabel}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={isSelected}
                                        onClick={() => onSelect(row)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                onSelect(row);
                                            }
                                        }}
                                        className={cn(
                                            "cursor-pointer transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20",
                                            isSelected
                                                ? "bg-[#FFF3EE] text-[#8A2D10]"
                                                : "hover:bg-slate-50"
                                        )}
                                    >
                                        <td className="px-3 py-3 font-black tabular-nums">{row.intervalLabel}</td>
                                        <td className="px-3 py-3 font-bold">
                                            {row.ascendantSign.symbol} {getSignName(row.ascendantSign, lang)}
                                        </td>
                                        <td className="px-3 py-3 text-right font-black tabular-nums">
                                            {row.probabilityLabel}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                {lang === "tr"
                    ? "Doğum saati bilinmediğinde yükselen burç güvenilir biçimde hesaplanamaz; yalnızca olası saat aralıkları ve burç değişim aralıkları yorumlanabilir."
                    : "Without a known birth time, the ascendant cannot be calculated reliably; only possible time and sign-change ranges can be reviewed."}
            </p>
        </section>
    );
}

const ASCENDANT_INTERPRETATIONS: Record<string, { tr: string; en: string }> = {
    koc: {
        tr: "Dışarıdan enerjik, hızlı karar veren ve doğrudan bir izlenim yaratırsınız. İnsanlar sizi harekete geçiren, cesur ve açık sözlü biri olarak algılayabilir. Rekabet duygunuz ve kendinizi ortaya koyma isteğiniz ilk bakışta fark edilir. Bazen sabırsız görünseniz de çevrenize canlılık katarsınız.",
        en: "You often come across as energetic, direct, and quick to act. People may perceive you as brave, outspoken, and ready to take initiative. Your competitive drive and need to express yourself are easy to notice. Even if you seem impatient at times, you bring vitality into the room.",
    },
    boga: {
        tr: "Dışarıdan sakin, güven veren ve sağlam duran bir izlenim yaratırsınız. İnsanlar sizin acele etmeden karar verdiğinizi ve kolay kolay yön değiştirmediğinizi hisseder. Konfor, sadelik ve istikrar ihtiyacınız tavırlarınıza yansır. İlk izlenimde huzurlu ama inatçı görünebilirsiniz.",
        en: "You often appear calm, steady, and reassuring. People sense that you make decisions slowly and rarely change direction without reason. Your need for comfort, simplicity, and stability shows in your manner. At first glance, you may seem peaceful but stubborn.",
    },
    ikizler: {
        tr: "Dışarıdan meraklı, zeki ve hareketli bir izlenim yaratırsınız. İnsanlar sizinle konuşmanın kolay olduğunu ve gündemi hızlı yakaladığınızı düşünür. Fikirler arasında çevik geçişler yapmanız sosyal ortamlarda dikkat çeker. İlk izlenimde değişken ama canlı görünebilirsiniz.",
        en: "You often come across as curious, witty, and lively. People may find it easy to talk with you and notice how quickly you catch the mood. Your agile way of moving between ideas stands out socially. At first glance, you may seem changeable but vibrant.",
    },
    yengec: {
        tr: "Dışarıdan duyarlı, koruyucu ve sezgisel bir izlenim yaratırsınız. İnsanlar sizin ortamdaki duygusal tonu çabuk fark ettiğinizi hisseder. Güvenlik ve aidiyet ihtiyacınız ilişkilerinizde belirgin olabilir. İlk izlenimde sıcak ama temkinli görünebilirsiniz.",
        en: "You often appear sensitive, protective, and intuitive. People sense that you quickly read the emotional tone of a place. Your need for safety and belonging can be visible in relationships. At first glance, you may seem warm but cautious.",
    },
    aslan: {
        tr: "Dışarıdan sıcak, dikkat çekici ve kendinden emin bir izlenim yaratırsınız. İnsanlar sizin bulunduğunuz ortama enerji ve sahne duygusu kattığınızı hisseder. Takdir edilme ve yaratıcı biçimde görünür olma ihtiyacınız belirgindir. İlk izlenimde güçlü ve cömert görünebilirsiniz.",
        en: "You often come across as warm, noticeable, and confident. People feel that you bring energy and a sense of presence into the room. Your need to be appreciated and creatively seen is clear. At first glance, you may seem strong and generous.",
    },
    basak: {
        tr: "Dışarıdan düzenli, dikkatli ve ölçülü bir izlenim yaratırsınız. İnsanlar sizin ayrıntıları fark ettiğinizi ve kolay kolay dağılmadığınızı düşünür. Faydalı olma, düzeltme ve sistemi iyileştirme isteğiniz tavırlarınıza yansır. İlk izlenimde mesafeli ama güvenilir görünebilirsiniz.",
        en: "You often appear organized, careful, and measured. People may notice your attention to detail and your ability to stay composed. Your wish to be useful, improve things, and refine systems shows in your manner. At first glance, you may seem reserved but reliable.",
    },
    terazi: {
        tr: "Dışarıdan zarif, uyumlu ve sosyal bir izlenim yaratırsınız. İnsanlar sizin ortamı yumuşatma ve ilişkileri dengeleme becerinizi fark eder. Estetik, adalet ve karşılıklı anlayış ihtiyacınız belirgindir. İlk izlenimde nazik ama kararsız görünebilirsiniz.",
        en: "You often come across as graceful, balanced, and social. People notice your ability to soften the atmosphere and harmonize relationships. Your need for beauty, fairness, and mutual understanding is visible. At first glance, you may seem kind but indecisive.",
    },
    akrep: {
        tr: "Dışarıdan yoğun ve gizemli bir izlenim yaratırsınız. İnsanlar sizi tanımak için zaman harcaması gerektiğini hisseder. Duygusal derinliğinizi saklarken güç ve kontrol ihtiyacınız belirgindir. İlk izlenimde ciddi ve çekingen görünebilirsiniz.",
        en: "You often create an intense and mysterious impression. People may feel that getting to know you takes time. While you hide your emotional depth, your need for strength and control is noticeable. At first glance, you may seem serious and guarded.",
    },
    yay: {
        tr: "Dışarıdan açık, iyimser ve özgürlüğüne düşkün bir izlenim yaratırsınız. İnsanlar sizin ufuk açan fikirlerle ve geniş bakış açısıyla geldiğinizi hisseder. Keşfetme, öğrenme ve sınırları aşma isteğiniz belirgindir. İlk izlenimde neşeli ama fazla direkt görünebilirsiniz.",
        en: "You often appear open, optimistic, and freedom-loving. People sense that you bring broad ideas and a wider perspective. Your desire to explore, learn, and move beyond limits is clear. At first glance, you may seem cheerful but very direct.",
    },
    oglak: {
        tr: "Dışarıdan ciddi, kontrollü ve sorumluluk sahibi bir izlenim yaratırsınız. İnsanlar sizin hedef odaklı olduğunuzu ve kolay kolay dağılmadığınızı düşünür. Başarı, saygınlık ve yapı kurma ihtiyacınız tavırlarınıza yansır. İlk izlenimde mesafeli ama güçlü görünebilirsiniz.",
        en: "You often come across as serious, controlled, and responsible. People may see you as goal-oriented and hard to distract. Your need for achievement, respect, and structure shows in your manner. At first glance, you may seem distant but strong.",
    },
    kova: {
        tr: "Dışarıdan özgün, bağımsız ve zihinsel olarak canlı bir izlenim yaratırsınız. İnsanlar sizin olaylara alışılmışın dışında baktığınızı fark eder. Kendi alanınızı koruma ve farklı düşünme ihtiyacınız belirgindir. İlk izlenimde mesafeli ama ilginç görünebilirsiniz.",
        en: "You often appear original, independent, and mentally alive. People notice that you look at things from an unusual angle. Your need to protect your space and think differently is clear. At first glance, you may seem detached but intriguing.",
    },
    balik: {
        tr: "Dışarıdan yumuşak, sezgisel ve empatik bir izlenim yaratırsınız. İnsanlar sizin duyguları kolayca hissettiğinizi ve ortama uyum sağladığınızı düşünür. Hayal gücü, şefkat ve kaçış ihtiyacınız tavırlarınıza yansıyabilir. İlk izlenimde dalgın ama etkileyici görünebilirsiniz.",
        en: "You often come across as gentle, intuitive, and empathetic. People may feel that you easily sense emotions and adapt to the atmosphere. Your imagination, compassion, and need for escape can show in your manner. At first glance, you may seem dreamy but captivating.",
    },
};

const SHARE_TEASERS: Record<string, { tr: string; en: string }> = {
    koc: {
        tr: "Dışarıdan enerjik ve cesur görünürmüş...",
        en: "Apparently I seem bold and full of energy...",
    },
    boga: {
        tr: "Dışarıdan sakin ve güven veren görünürmüş...",
        en: "Apparently I seem calm and reassuring...",
    },
    ikizler: {
        tr: "Dışarıdan meraklı ve konuşkan görünürmüş...",
        en: "Apparently I seem curious and quick-witted...",
    },
    yengec: {
        tr: "Dışarıdan duyarlı ve koruyucu görünürmüş...",
        en: "Apparently I seem sensitive and protective...",
    },
    aslan: {
        tr: "Dışarıdan sıcak ve dikkat çekici görünürmüş...",
        en: "Apparently I seem warm and magnetic...",
    },
    basak: {
        tr: "Dışarıdan dikkatli ve güvenilir görünürmüş...",
        en: "Apparently I seem careful and reliable...",
    },
    terazi: {
        tr: "Dışarıdan zarif ve uyumlu görünürmüş...",
        en: "Apparently I seem graceful and harmonious...",
    },
    akrep: {
        tr: "Dışarıdan yoğun ve gizemli görünürmüş...",
        en: "Apparently I seem intense and mysterious...",
    },
    yay: {
        tr: "Dışarıdan açık ve özgür ruhlu görünürmüş...",
        en: "Apparently I seem open and freedom-loving...",
    },
    oglak: {
        tr: "Dışarıdan ciddi ve güçlü görünürmüş...",
        en: "Apparently I seem serious and strong...",
    },
    kova: {
        tr: "Dışarıdan özgün ve sıra dışı görünürmüş...",
        en: "Apparently I seem original and unusual...",
    },
    balik: {
        tr: "Dışarıdan sezgisel ve etkileyici görünürmüş...",
        en: "Apparently I seem intuitive and captivating...",
    },
};

function getShareTeaser(signId: string, lang: LanguageCode) {
    return SHARE_TEASERS[signId]?.[lang] ?? "";
}

function AscendantInterpretation({
    lang,
    signId,
}: {
    lang: LanguageCode;
    signId: string;
}) {
    const text = ASCENDANT_INTERPRETATIONS[signId]?.[lang] ?? "";

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                {lang === "tr" ? "Yükselen Burç Yorumu" : "Ascendant Interpretation"}
            </h3>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-700">
                {text}
            </p>
        </section>
    );
}

function CoreTriad({
    ascendantSign,
    lang,
    moonSign,
    sunSign,
}: {
    ascendantSign: { tr: string; en: string };
    lang: LanguageCode;
    moonSign: { tr: string; en: string };
    sunSign: { tr: string; en: string };
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                {lang === "tr" ? "Güneş + Yükselen + Ay Üçlüsü" : "Sun + Rising + Moon Trio"}
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
                <TriadCard
                    label={lang === "tr" ? "☀️ Güneş" : "☀️ Sun"}
                    value={getSignName(sunSign, lang)}
                />
                <TriadCard
                    label={lang === "tr" ? "⬆️ Yüks." : "⬆️ Rising"}
                    value={getSignName(ascendantSign, lang)}
                />
                <TriadCard
                    label={lang === "tr" ? "🌙 Ay" : "🌙 Moon"}
                    value={getSignName(moonSign, lang)}
                />
            </div>
            <p className="mt-4 text-sm font-bold leading-6 text-slate-800">
                {lang === "tr"
                    ? "Bu üçlü astroloji haritanızın temel taşlarıdır."
                    : "This trio forms the foundation of your astrology chart."}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                {lang === "tr"
                    ? "Ay burcu için doğum saati hassasiyeti ±1 burç hata payı içerebilir."
                    : "The simplified moon sign may include a ±1 sign margin of error due to birth-time sensitivity."}
            </p>
        </section>
    );
}

function TriadCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex min-h-[96px] min-w-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-3 text-center">
            <p className="max-w-full truncate text-xs font-black text-slate-600 sm:text-sm">
                {label}
            </p>
            <p className="mt-2 max-w-full break-words text-base font-black text-slate-950 sm:text-lg">
                {value}
            </p>
        </div>
    );
}

function FieldShell({
    children,
    icon,
    inputId,
    label,
}: {
    children: React.ReactNode;
    icon: React.ReactNode;
    inputId: string;
    label: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={inputId} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                    {icon}
                </span>
                <span>{label}</span>
            </label>
            {children}
        </div>
    );
}

function getSignName(sign: { tr: string; en: string }, lang: LanguageCode) {
    return lang === "tr" ? sign.tr : sign.en;
}

const inputClassName = "h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20";
