"use client";

import { useEffect, useMemo, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import type { LanguageCode } from "@/lib/calculator-types";

const STORAGE_KEY = "kac-gun-tarih";
const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const PAGE_URL = "https://www.hesapmod.com/zaman-hesaplama/kac-gun-oldu-hesaplama";

type StoredValues = {
    date?: string;
    time?: string;
    includeTime?: boolean;
    templateId?: TemplateId;
    mode?: CalculationMode;
};

type Metric = {
    label: string;
    value: number;
};

type TemplateId = "custom" | "smoke" | "baby" | "marriage" | "sport" | "work" | "graduation";
type CalculationMode = "elapsed" | "remaining";

type TemplateConfig = {
    id: TemplateId;
    buttonLabel: string;
    title: string;
    datePrompt: string;
    resultTitle: (days: number) => string;
    cardClassName: string;
    activeClassName: string;
};

const TEMPLATES: TemplateConfig[] = [
    {
        id: "custom",
        buttonLabel: "Özel Tarih",
        title: "Kaç Gün Oldu Hesaplama",
        datePrompt: "Başlangıç tarihini seç",
        resultTitle: (days) => `${days.toLocaleString("tr-TR")} gün oldu`,
        cardClassName: "border-slate-200 bg-white text-slate-950 hover:border-slate-400",
        activeClassName: "border-slate-900 bg-slate-900 text-white",
    },
    {
        id: "smoke",
        buttonLabel: "🚭 Sigarayı Bıraktım",
        title: "Sigarasız Geçen Süre",
        datePrompt: "Sigarayı bıraktığın tarihi seç",
        resultTitle: (days) => `${days.toLocaleString("tr-TR")} gündür sigara içmiyorsun 🎉`,
        cardClassName: "border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-400",
        activeClassName: "border-emerald-600 bg-emerald-600 text-white",
    },
    {
        id: "baby",
        buttonLabel: "👶 Bebek Doğdu",
        title: "Bebeğin Yaşı",
        datePrompt: "Bebeğin doğduğu tarihi seç",
        resultTitle: (days) => `Bebeğin ${days.toLocaleString("tr-TR")} günlük 👶`,
        cardClassName: "border-sky-200 bg-gradient-to-br from-pink-50 to-sky-50 text-sky-950 hover:border-sky-400",
        activeClassName: "border-sky-500 bg-sky-500 text-white",
    },
    {
        id: "marriage",
        buttonLabel: "💑 Evlendik",
        title: "Evlilikte Geçen Süre",
        datePrompt: "Evlendiğiniz tarihi seç",
        resultTitle: (days) => `${days.toLocaleString("tr-TR")} gündür evlisiniz 💑`,
        cardClassName: "border-violet-200 bg-violet-50 text-violet-950 hover:border-violet-400",
        activeClassName: "border-violet-600 bg-violet-600 text-white",
    },
    {
        id: "sport",
        buttonLabel: "💪 Spora Başladım",
        title: "Sporda Geçen Süre",
        datePrompt: "Spora başladığın tarihi seç",
        resultTitle: (days) => `${days.toLocaleString("tr-TR")} gündür spordasın 💪`,
        cardClassName: "border-orange-200 bg-orange-50 text-orange-950 hover:border-orange-400",
        activeClassName: "border-orange-500 bg-orange-500 text-white",
    },
    {
        id: "work",
        buttonLabel: "💼 İşe Başladım",
        title: "İşte Geçen Süre",
        datePrompt: "İşe başladığın tarihi seç",
        resultTitle: (days) => `${days.toLocaleString("tr-TR")} gündür çalışıyorsun 💼`,
        cardClassName: "border-blue-200 bg-blue-50 text-blue-950 hover:border-blue-400",
        activeClassName: "border-blue-600 bg-blue-600 text-white",
    },
    {
        id: "graduation",
        buttonLabel: "🎓 Mezun Oldum",
        title: "Mezuniyetten Sonra Geçen Süre",
        datePrompt: "Mezun olduğun tarihi seç",
        resultTitle: (days) => `${days.toLocaleString("tr-TR")} gündür mezunsun 🎓`,
        cardClassName: "border-yellow-200 bg-yellow-50 text-yellow-950 hover:border-yellow-400",
        activeClassName: "border-yellow-500 bg-yellow-400 text-yellow-950",
    },
];

function getTemplateById(templateId: TemplateId) {
    return TEMPLATES.find((template) => template.id === templateId) ?? TEMPLATES[0];
}

function formatInteger(value: number) {
    return Math.round(value).toLocaleString("tr-TR");
}

function formatTry(value: number) {
    return `${Math.round(value).toLocaleString("tr-TR")} TL`;
}

function toDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseDateInput(value: string) {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, monthIndex, day);

    if (
        date.getFullYear() !== year
        || date.getMonth() !== monthIndex
        || date.getDate() !== day
    ) {
        return null;
    }

    return { year, monthIndex, day };
}

function parseTimeInput(value: string) {
    const match = value.match(/^(\d{2}):(\d{2})$/);
    if (!match) {
        return { hour: 0, minute: 0 };
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (hour > 23 || minute > 59) {
        return { hour: 0, minute: 0 };
    }

    return { hour, minute };
}

function getStartDate(dateValue: string, timeValue: string, includeTime: boolean) {
    const parsedDate = parseDateInput(dateValue);
    if (!parsedDate) {
        return null;
    }

    const parsedTime = includeTime ? parseTimeInput(timeValue) : { hour: 0, minute: 0 };

    return new Date(
        parsedDate.year,
        parsedDate.monthIndex,
        parsedDate.day,
        parsedTime.hour,
        parsedTime.minute,
        0,
        0
    );
}

// Iki tarihi yerel takvim gunune indirip UTC uzerinden farkini alir.
// UTC'de gunler her zaman 24 saat oldugu icin sonuc DST'den etkilenmez.
function calendarDayDiff(selectedDate: Date, referenceDate: Date, mode: CalculationMode) {
    const toUtcDay = (date: Date) =>
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = mode === "elapsed"
        ? toUtcDay(referenceDate) - toUtcDay(selectedDate)
        : toUtcDay(selectedDate) - toUtcDay(referenceDate);

    return Math.round(diff / MS_PER_DAY);
}

function calculateTimeMetrics(
    dateValue: string,
    timeValue: string,
    includeTime: boolean,
    mode: CalculationMode,
    nowMs: number
) {
    const selectedDate = getStartDate(dateValue, timeValue, includeTime);
    if (!selectedDate) {
        return null;
    }

    const now = new Date(nowMs);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const referenceDate = mode === "remaining" || includeTime ? now : todayStart;
    const diffMs = mode === "elapsed"
        ? referenceDate.getTime() - selectedDate.getTime()
        : selectedDate.getTime() - referenceDate.getTime();
    const absoluteMs = Math.max(0, diffMs);
    const totalMinutes = Math.floor(absoluteMs / MS_PER_MINUTE);
    const totalHours = Math.floor(absoluteMs / MS_PER_HOUR);
    // Tam gun farki takvim gunu uzerinden alinir; saatin ileri/geri alindigi
    // gunler 24 saat surmedigi icin ms bolmesi DST'li saat dilimlerinde 1 gun
    // sapma veriyordu. includeTime acikken sure gercekten kismi gun icerdigi
    // icin ms tabanli hesap korunur.
    const totalDays = includeTime
        ? Math.floor(absoluteMs / MS_PER_DAY)
        : Math.max(0, calendarDayDiff(selectedDate, referenceDate, mode));

    return {
        isInvalidDirection: diffMs < 0,
        metrics: [
            { label: "GÜN", value: totalDays },
            { label: "HAFTA", value: Math.floor(totalDays / 7) },
            { label: "AY", value: Math.round(totalDays / 30.4375) },
            { label: "YIL", value: Math.floor(totalDays / 365.25) },
            { label: "SAAT", value: totalHours },
            { label: "DAKİKA", value: totalMinutes },
        ] satisfies Metric[],
    };
}

function readStoredValues() {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return {};
        }

        const parsed = JSON.parse(raw) as StoredValues;
        const templateIds = new Set<TemplateId>(TEMPLATES.map((template) => template.id));
        return {
            date: typeof parsed.date === "string" ? parsed.date : undefined,
            time: typeof parsed.time === "string" ? parsed.time : undefined,
            includeTime: typeof parsed.includeTime === "boolean" ? parsed.includeTime : undefined,
            templateId: parsed.templateId && templateIds.has(parsed.templateId)
                ? parsed.templateId
                : undefined,
            mode: parsed.mode === "remaining" || parsed.mode === "elapsed"
                ? parsed.mode
                : undefined,
        };
    } catch {
        return {};
    }
}

function AnimatedMetricCard({
    metric,
    cardClassName,
}: {
    metric: Metric;
    cardClassName: string;
}) {
    const count = useCountUp(metric.value, 800);
    const formattedCount = Math.round(count).toLocaleString("tr-TR");
    const digitLength = formattedCount.length;
    const valueClassName = digitLength >= 9
        ? "text-[clamp(1.55rem,4vw,2.15rem)]"
        : digitLength >= 7
            ? "text-[clamp(1.8rem,4.5vw,2.55rem)]"
            : "text-[clamp(2rem,5vw,3rem)]";

    return (
        <div className={`flex aspect-[1.35] min-h-[116px] flex-col items-center justify-center rounded-xl border px-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${cardClassName}`}>
            <div className={`max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-black leading-none tracking-normal text-slate-950 ${valueClassName}`}>
                {formattedCount}
            </div>
            <div className="mt-3 text-xs font-black uppercase tracking-normal text-slate-500 sm:text-sm">
                {metric.label}
            </div>
        </div>
    );
}

function buildShareText({
    templateId,
    metrics,
    dailyPacks,
    packPrice,
    mode,
}: {
    templateId: TemplateId;
    metrics: Metric[];
    dailyPacks: number;
    packPrice: number;
    mode: CalculationMode;
}) {
    const days = metrics[0]?.value ?? 0;
    const weeks = metrics[1]?.value ?? 0;
    const months = metrics[2]?.value ?? 0;
    const years = metrics[3]?.value ?? 0;
    const remainingDaysAfterWeeks = days % 7;

    if (mode === "remaining") {
        return [
            `⏳ Seçtiğim tarihe ${formatInteger(days)} gün kaldı.`,
            `${formatInteger(weeks)} hafta, ${formatInteger(months)} ay, ${formatInteger(years)} yıl...`,
            PAGE_URL,
        ].join("\n");
    }

    if (templateId === "smoke") {
        const avoidedPacks = days * dailyPacks;
        const savedAmount = avoidedPacks * packPrice;

        return [
            `🚭 ${formatInteger(days)} gündür sigara içmiyorum!`,
            `Bu sürede tahminen ${formatInteger(avoidedPacks)} paket sigara içmedim ve ${formatTry(savedAmount)} biriktirdim.`,
            `Hesaplamak için: ${PAGE_URL}`,
        ].join("\n");
    }

    if (templateId === "baby") {
        return [
            `👶 Bebeğim bugün ${formatInteger(days)} günlük!`,
            `${formatInteger(weeks)} hafta ${formatInteger(remainingDaysAfterWeeks)} gün oldu. Zaman ne çabuk geçiyor...`,
            "hesapmod.com ile hesaplandım ✨",
        ].join("\n");
    }

    return [
        `📅 O günden bu yana ${formatInteger(days)} gün geçmiş.`,
        `${formatInteger(weeks)} hafta, ${formatInteger(months)} ay, ${formatInteger(years)} yıl...`,
        PAGE_URL,
    ].join("\n");
}

function ShareSection({
    shareText,
    onCopy,
    copyStatus,
}: {
    shareText: string;
    onCopy: () => void;
    copyStatus: "idle" | "copied" | "error";
}) {
    const openShareUrl = (url: string) => {
        if (typeof window === "undefined") {
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-black text-slate-950">
                Sonucu Paylaş
            </h3>
            <div className="mt-3 whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
                {shareText}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={onCopy}
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-[#FF6B35] hover:bg-[#FFF3EE] hover:text-[#CC4A1A] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                >
                    {copyStatus === "copied"
                        ? "Kopyalandı"
                        : copyStatus === "error"
                            ? "Kopyalanamadı"
                            : "📋 Metni Kopyala"}
                </button>
                <button
                    type="button"
                    onClick={() => openShareUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`)}
                    className="min-h-11 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-bold text-sky-800 shadow-sm transition-all hover:border-sky-400 hover:bg-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-200"
                >
                    🐦 Twitter'da Paylaş
                </button>
                <button
                    type="button"
                    onClick={() => openShareUrl(`https://wa.me/?text=${encodeURIComponent(shareText)}`)}
                    className="min-h-11 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                    📱 WhatsApp'ta Paylaş
                </button>
            </div>
        </div>
    );
}

export default function KacGunOlduCalculator({ lang }: { lang: LanguageCode }) {
    const [dateValue, setDateValue] = useState("");
    const [timeValue, setTimeValue] = useState("00:00");
    const [includeTime, setIncludeTime] = useState(false);
    const [templateId, setTemplateId] = useState<TemplateId>("custom");
    const [mode, setMode] = useState<CalculationMode>("elapsed");
    const [nowMs, setNowMs] = useState(() => Date.now());
    const [dailyPacks, setDailyPacks] = useState(1);
    const [packPrice, setPackPrice] = useState(120);
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const stored = readStoredValues();
        setDateValue(stored.date ?? "");
        setTimeValue(stored.time ?? "00:00");
        setIncludeTime(stored.includeTime ?? false);
        setTemplateId(stored.templateId ?? "custom");
        setMode(stored.mode ?? "elapsed");
        setNowMs(Date.now());
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (mode !== "remaining" || !dateValue) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setNowMs(Date.now());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [dateValue, mode]);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        try {
            window.sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    date: dateValue,
                    time: timeValue,
                    includeTime,
                    templateId,
                    mode,
                })
            );
        } catch {
            // sessionStorage can be unavailable in strict privacy modes.
        }
    }, [dateValue, includeTime, isHydrated, mode, templateId, timeValue]);

    const result = useMemo(
        () => calculateTimeMetrics(dateValue, timeValue, includeTime, mode, nowMs),
        [dateValue, includeTime, mode, nowMs, timeValue]
    );

    const today = useMemo(() => toDateInputValue(new Date()), []);
    const selectedTemplate = getTemplateById(templateId);
    const metrics = result?.metrics ?? [
        { label: "GÜN", value: 0 },
        { label: "HAFTA", value: 0 },
        { label: "AY", value: 0 },
        { label: "YIL", value: 0 },
        { label: "SAAT", value: 0 },
        { label: "DAKİKA", value: 0 },
    ];
    const shareText = buildShareText({
        templateId,
        metrics,
        dailyPacks,
        packPrice,
        mode,
    });
    const days = metrics[0]?.value ?? 0;
    const smokeAvoidedPacks = days * dailyPacks;
    const smokeSavedAmount = smokeAvoidedPacks * packPrice;

    const handleCopyShareText = async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
            setCopyStatus("error");
            return;
        }

        try {
            await navigator.clipboard.writeText(shareText);
            setCopyStatus("copied");
            window.setTimeout(() => setCopyStatus("idle"), 1800);
        } catch {
            setCopyStatus("error");
        }
    };

    return (
        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="border-b border-slate-100 pb-4 text-xl font-bold text-slate-900">
                    {lang === "tr"
                        ? mode === "elapsed"
                            ? selectedTemplate.title
                            : "Kaç Gün Kaldı Hızlı Geri Sayım"
                        : "Days Since Calculator"}
                </h2>

                <div className="mt-6 space-y-5">
                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                        {[
                            { id: "elapsed", label: "⬅ Kaç gün oldu" },
                            { id: "remaining", label: "➡ Kaç gün kaldı" },
                        ].map((option) => {
                            const isActive = mode === option.id;

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        setMode(option.id as CalculationMode);
                                        setNowMs(Date.now());
                                    }}
                                    className={`min-h-11 rounded-lg px-3 py-2 text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 ${
                                        isActive
                                            ? "bg-white text-[#CC4A1A] shadow-sm"
                                            : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>

                    {mode === "remaining" && (
                        <a
                            href="/zaman-hesaplama/kac-gun-kaldi-hesaplama"
                            className="block rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-800 transition-colors hover:border-blue-300 hover:bg-blue-100"
                        >
                            Detaylı geri sayım için kaç gün kaldı hesaplama sayfasını kullanabilirsiniz.
                        </a>
                    )}

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {TEMPLATES.map((template) => {
                            const isActive = template.id === templateId;

                            return (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => setTemplateId(template.id)}
                                    className={`min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-bold shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 ${
                                        isActive
                                            ? template.activeClassName
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    {template.buttonLabel}
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="kac-gun-start-date" className="text-sm font-semibold text-slate-600">
                            {mode === "elapsed" ? "Başlangıç Tarihi" : "Hedef Tarih"}
                        </label>
                        <input
                            id="kac-gun-start-date"
                            type="date"
                            value={dateValue}
                            max={mode === "elapsed" ? today : undefined}
                            placeholder={mode === "elapsed" ? selectedTemplate.datePrompt : "Hedef tarihi seç"}
                            aria-label={mode === "elapsed" ? selectedTemplate.datePrompt : "Hedef tarihi seç"}
                            onChange={(event) => setDateValue(event.target.value)}
                            className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                        />
                        <p className="text-xs font-semibold text-slate-500">
                            {mode === "elapsed" ? selectedTemplate.datePrompt : "Geri sayım için hedef tarihi seç"}
                        </p>
                    </div>

                    {templateId === "smoke" && (
                        <div className="grid grid-cols-1 gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="kac-gun-daily-packs" className="text-sm font-bold text-emerald-900">
                                    Günlük paket
                                </label>
                                <input
                                    id="kac-gun-daily-packs"
                                    type="number"
                                    min={0}
                                    step={0.25}
                                    value={dailyPacks}
                                    onChange={(event) => setDailyPacks(Math.max(0, Number.parseFloat(event.target.value) || 0))}
                                    className="h-12 w-full rounded-xl border border-emerald-200 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="kac-gun-pack-price" className="text-sm font-bold text-emerald-900">
                                    Paket fiyatı
                                </label>
                                <input
                                    id="kac-gun-pack-price"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={packPrice}
                                    onChange={(event) => setPackPrice(Math.max(0, Number.parseFloat(event.target.value) || 0))}
                                    className="h-12 w-full rounded-xl border border-emerald-200 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                                />
                            </div>
                            <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-emerald-950 sm:col-span-2">
                                {formatInteger(smokeAvoidedPacks)} paket içmeden {formatTry(smokeSavedAmount)} biriktirdin
                            </div>
                        </div>
                    )}

                    <label className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all hover:border-[#FFD7C7]">
                        <span className="text-sm font-bold text-slate-700">
                            Saat ve dakikayı dahil et
                        </span>
                        <input
                            type="checkbox"
                            checked={includeTime}
                            onChange={(event) => setIncludeTime(event.target.checked)}
                            className="h-5 w-5 rounded border-slate-300 text-[#CC4A1A] shadow-sm focus:ring-2 focus:ring-[#FF6B35]"
                        />
                    </label>

                    <div className="space-y-2">
                        <label htmlFor="kac-gun-start-time" className="text-sm font-semibold text-slate-600">
                            Saat
                        </label>
                        <input
                            id="kac-gun-start-time"
                            type="time"
                            value={timeValue}
                            onChange={(event) => setTimeValue(event.target.value)}
                            disabled={!includeTime}
                            className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="md:sticky md:top-24">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
                    {result?.isInvalidDirection && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
                            {mode === "elapsed"
                                ? "Başlangıç tarihi gelecek bir zaman olamaz."
                                : "Hedef tarih bugünden sonra olmalı"}
                        </div>
                    )}
                    {!dateValue && (
                        <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                            Bir başlangıç tarihi seçtiğinizde sonuçlar anında görünür.
                        </div>
                    )}
                    {dateValue && !result?.isInvalidDirection && result && (
                        <h3 className="mb-4 text-center text-xl font-black tracking-normal text-slate-950 sm:text-2xl">
                            {mode === "elapsed"
                                ? selectedTemplate.resultTitle(result.metrics[0].value)
                                : `${formatInteger(result.metrics[0].value)} gün kaldı ⏳`}
                        </h3>
                    )}
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {metrics.map((metric) => (
                            <AnimatedMetricCard
                                key={metric.label}
                                metric={metric}
                                cardClassName={selectedTemplate.cardClassName}
                            />
                        ))}
                    </div>
                    {dateValue && !result?.isInvalidDirection && result && (
                        <ShareSection
                            shareText={shareText}
                            onCopy={handleCopyShareText}
                            copyStatus={copyStatus}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
