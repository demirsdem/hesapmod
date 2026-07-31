"use client";

import { useMemo, useState } from "react";
import type { LanguageCode } from "@/lib/calculator-types";

const MINIMUM_GROSS_WAGE_2026 = 33030;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addYears(date: Date, years: number) {
    const next = new Date(date.getTime());
    next.setFullYear(next.getFullYear() + years);
    return next;
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

function buildDate(dateValue: string, timeValue: string, includeTime: boolean) {
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

function shiftDays(date: Date, dayOffset: number) {
    return new Date(date.getTime() + dayOffset * DAY_IN_MS);
}

function addMonths(date: Date, monthOffset: number) {
    const next = new Date(date.getTime());
    const originalDay = next.getDate();
    next.setMonth(next.getMonth() + monthOffset);

    if (next.getDate() < originalDay) {
        next.setDate(0);
    }

    return next;
}

function addBusinessDays(date: Date, businessDayCount: number) {
    const next = new Date(date.getTime());
    let addedDays = 0;

    while (addedDays < businessDayCount) {
        next.setDate(next.getDate() + 1);
        const dayOfWeek = next.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            addedDays += 1;
        }
    }

    return next;
}

function formatDate(date: Date, includeTime: boolean, lang: LanguageCode) {
    return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        ...(includeTime
            ? {
                hour: "2-digit",
                minute: "2-digit",
            }
            : {}),
    }).format(date);
}

function formatMoney(value: number, lang: LanguageCode) {
    return value.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatApproxMoney(value: number, lang: LanguageCode) {
    return Math.round(value).toLocaleString(lang === "tr" ? "tr-TR" : "en-US");
}

function getDayDifference(start: Date, end: Date) {
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / DAY_IN_MS));
}

function SummaryCard({
    label,
    value,
    note,
}: {
    label: string;
    value: string;
    note: string;
}) {
    return (
        <div className="min-h-[132px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-600">{label}</p>
            <p className="mt-3 break-words text-2xl font-black leading-tight tracking-normal text-slate-950">
                {value}
            </p>
            <p className="mt-2 text-sm font-semibold leading-5 text-slate-500">
                {note}
            </p>
        </div>
    );
}

function TimelineItem({
    title,
    detail,
    note,
    isLast = false,
}: {
    title: string;
    detail: string;
    note?: string;
    isLast?: boolean;
}) {
    return (
        <div className="relative grid grid-cols-[28px_1fr] gap-3">
            {!isLast && (
                <span className="absolute left-[9px] top-5 h-full w-px bg-slate-300" aria-hidden="true" />
            )}
            <span className="relative z-10 mt-1 h-5 w-5 rounded-full border-4 border-white bg-[#FF6B35] shadow ring-1 ring-[#FFD7C7]" />
            <div className="pb-5">
                <p className="text-sm font-black leading-6 text-slate-900">
                    {title}: <span className="font-bold text-slate-700">{detail}</span>
                </p>
                {note && (
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        {note}
                    </p>
                )}
            </div>
        </div>
    );
}

function SwitchField({
    id,
    label,
    checked,
    onChange,
}: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label
            htmlFor={id}
            className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors [touch-action:manipulation] hover:border-[#FFD7C7]"
        >
            <span className="text-sm font-bold leading-5 text-slate-700">{label}</span>
            <span
                className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${
                    checked
                        ? "border-[#FF6B35] bg-[#FF6B35]"
                        : "border-slate-300 bg-slate-200"
                }`}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </span>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="sr-only"
            />
        </label>
    );
}

export default function MaternityLeaveCalculator({ lang }: { lang: LanguageCode }) {
    const today = useMemo(() => toDateInputValue(new Date()), []);
    const maxDate = useMemo(() => toDateInputValue(addYears(new Date(), 2)), []);
    const [dueDate, setDueDate] = useState("");
    const [includeTime, setIncludeTime] = useState(false);
    const [birthTime, setBirthTime] = useState("12:00");
    const [isMultiplePregnancy, setIsMultiplePregnancy] = useState(false);
    const [workUntil37, setWorkUntil37] = useState(false);
    const [grossSalary, setGrossSalary] = useState("");
    const [paternityBirthDate, setPaternityBirthDate] = useState("");
    const [unpaidLeaveMonths, setUnpaidLeaveMonths] = useState(0);

    const grossSalaryNumber = Number.parseFloat(grossSalary);
    const usesMinimumWage = grossSalary.trim() === "" || !Number.isFinite(grossSalaryNumber) || grossSalaryNumber <= 0;
    const effectiveGrossSalary = usesMinimumWage
        ? MINIMUM_GROSS_WAGE_2026
        : Math.max(grossSalaryNumber, MINIMUM_GROSS_WAGE_2026);

    const result = useMemo(() => {
        const due = buildDate(dueDate, birthTime, includeTime);
        if (!due) {
            return null;
        }

        const weeksBefore = workUntil37 ? 3 : isMultiplePregnancy ? 10 : 8;
        const totalDurationWeeks = isMultiplePregnancy ? 18 : 16;
        const totalDays = totalDurationWeeks * 7;
        const startLeave = shiftDays(due, weeksBefore * -7);
        const endLeave = shiftDays(startLeave, totalDays);
        const dailyGross = effectiveGrossSalary / 30;
        const raporParasi = totalDays * dailyGross * (2 / 3);
        const preBirthDays = getDayDifference(startLeave, due);
        const postBirthDays = getDayDifference(due, endLeave);

        return {
            startLeave,
            birthEstimate: due,
            endLeave,
            weeksBefore,
            totalDurationWeeks,
            totalDays,
            preBirthDays,
            postBirthDays,
            raporParasi,
        };
    }, [birthTime, dueDate, effectiveGrossSalary, includeTime, isMultiplePregnancy, workUntil37]);

    const selectedDateLabel = useMemo(() => {
        const due = buildDate(dueDate, birthTime, includeTime);
        return due ? formatDate(due, includeTime, lang) : "";
    }, [birthTime, dueDate, includeTime, lang]);

    const paternityDateValue = paternityBirthDate || dueDate;
    const paternityResult = useMemo(() => {
        const birth = buildDate(paternityDateValue, "00:00", false);
        if (!birth) {
            return null;
        }

        return {
            start: birth,
            end: addBusinessDays(birth, 10),
        };
    }, [paternityDateValue]);
    const unpaidLeaveReturnDate = result
        ? addMonths(result.endLeave, unpaidLeaveMonths)
        : null;

    const fieldClassName = "min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 [touch-action:manipulation] hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20";

    return (
        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:gap-8">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="border-b border-slate-100 pb-4 text-xl font-bold text-slate-900">
                    {lang === "tr" ? "Doğum İzni ve Rapor Parası Hesaplama" : "Maternity Leave Calculator"}
                </h2>

                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-950">
                    {lang === "tr"
                        ? "📋 2026 Yasal Güncellemeler: Brüt asgari ücret 33.030 TL | Tekil gebelik: 112 gün | Çoğul: 126 gün | Kaynak: 4857 İş Kanunu Madde 74"
                        : "📋 2026 Legal Updates: Gross minimum wage 33,030 TL | Single pregnancy: 112 days | Multiple: 126 days | Source: Labour Law No. 4857 Article 74"}
                </div>

                <div className="mt-6 space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="maternity-due-date" className="text-sm font-semibold text-slate-600">
                            {lang === "tr" ? "Beklenen Doğum Tarihi" : "Expected Due Date"}
                        </label>
                        <input
                            id="maternity-due-date"
                            type="date"
                            min={today}
                            max={maxDate}
                            value={dueDate}
                            placeholder="GG.AA.YYYY"
                            lang="tr-TR"
                            onChange={(event) => setDueDate(event.target.value)}
                            className={fieldClassName}
                        />
                        {selectedDateLabel && (
                            <p className="text-xs font-semibold text-slate-500">
                                {selectedDateLabel}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <button
                            type="button"
                            aria-expanded={includeTime}
                            onClick={() => setIncludeTime((current) => !current)}
                            className="flex min-h-[48px] w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-bold text-slate-700 shadow-sm transition-colors [touch-action:manipulation] hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20"
                        >
                            <span>{lang === "tr" ? "Saati dahil et" : "Include time"}</span>
                            <span aria-hidden="true">{includeTime ? "▲" : "▼"}</span>
                        </button>

                        {includeTime && (
                            <div className="space-y-2">
                                <label htmlFor="maternity-birth-time" className="text-sm font-semibold text-slate-600">
                                    {lang === "tr" ? "Doğum Saati" : "Birth Time"}
                                </label>
                                <input
                                    id="maternity-birth-time"
                                    type="time"
                                    value={birthTime}
                                    onChange={(event) => setBirthTime(event.target.value)}
                                    className={fieldClassName}
                                />
                            </div>
                        )}
                    </div>

                    <SwitchField
                        id="maternity-multiple-pregnancy"
                        label={lang === "tr" ? "Çoğul Gebelik" : "Multiple Pregnancy"}
                        checked={isMultiplePregnancy}
                        onChange={setIsMultiplePregnancy}
                    />

                    <SwitchField
                        id="maternity-work-until-37"
                        label={lang === "tr" ? "37. Haftaya Kadar Çalışma" : "Work Until Week 37"}
                        checked={workUntil37}
                        onChange={setWorkUntil37}
                    />

                    <div className="space-y-2">
                        <label htmlFor="maternity-gross-salary" className="text-sm font-semibold text-slate-600">
                            {lang === "tr" ? "Aylık Brüt Maaş" : "Monthly Gross Salary"}
                        </label>
                        <div className="relative">
                            <input
                                id="maternity-gross-salary"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step={1}
                                value={grossSalary}
                                onChange={(event) => setGrossSalary(event.target.value)}
                                placeholder={lang === "tr" ? "33.030 (2026 asgari ücret)" : "33,030 (2026 minimum wage)"}
                                className={`${fieldClassName} pr-12`}
                            />
                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-500">
                                ₺
                            </span>
                        </div>
                        {usesMinimumWage && (
                            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900">
                                {lang === "tr" ? "Asgari ücret baz alındı" : "Minimum wage used"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="md:sticky md:top-24">
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-5 shadow-sm sm:p-6">
                    <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                        {lang === "tr" ? "Sonuçlar" : "Results"}
                    </h3>

                    {!result ? (
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
                            {lang === "tr"
                                ? "Beklenen doğum tarihini seçtiğinizde sonuçlar anında görünür."
                                : "Select an expected due date to see results instantly."}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <SummaryCard
                                    label={lang === "tr" ? "İzin Başlangıcı" : "Leave Start"}
                                    value={formatDate(result.startLeave, includeTime, lang)}
                                    note={lang === "tr"
                                        ? `(${result.weeksBefore === 3 ? "37." : result.weeksBefore === 10 ? "30." : "32."} haftada)`
                                        : `(week ${result.weeksBefore === 3 ? "37" : result.weeksBefore === 10 ? "30" : "32"})`}
                                />
                                <SummaryCard
                                    label={lang === "tr" ? "İzin Bitişi" : "Leave End"}
                                    value={formatDate(result.endLeave, includeTime, lang)}
                                    note={lang === "tr"
                                        ? `(${result.totalDays} gün sonra)`
                                        : `(${result.totalDays} days later)`}
                                />
                                <SummaryCard
                                    label={lang === "tr" ? "Toplam İzin" : "Total Leave"}
                                    value={lang === "tr" ? `${result.totalDays} gün` : `${result.totalDays} days`}
                                    note={lang === "tr"
                                        ? `(${result.totalDurationWeeks} hafta)`
                                        : `(${result.totalDurationWeeks} weeks)`}
                                />
                                <SummaryCard
                                    label={lang === "tr" ? "SGK Ödeneği" : "SGK Pay"}
                                    value={`~${formatApproxMoney(result.raporParasi, lang)} TL`}
                                    note={lang === "tr" ? "(tahmini brüt)" : "(gross estimate)"}
                                />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <h4 className="mb-4 text-base font-black text-slate-900">
                                    {lang === "tr" ? "Tarih Zeyli" : "Date Timeline"}
                                </h4>
                                <TimelineItem
                                    title={lang === "tr" ? "İzin Başlangıcı" : "Leave Start"}
                                    detail={formatDate(result.startLeave, includeTime, lang)}
                                    note={lang === "tr"
                                        ? `(${result.weeksBefore === 3 ? "37. hafta" : result.weeksBefore === 10 ? "30. hafta" : "32. hafta"})`
                                        : `(week ${result.weeksBefore === 3 ? "37" : result.weeksBefore === 10 ? "30" : "32"})`}
                                />
                                <TimelineItem
                                    title={lang === "tr" ? "Tahmini Doğum" : "Estimated Birth"}
                                    detail={formatDate(result.birthEstimate, includeTime, lang)}
                                    note={lang === "tr"
                                        ? `(Doğum öncesi: ${result.preBirthDays} gün | Doğum sonrası: ${result.postBirthDays} gün)`
                                        : `(Before birth: ${result.preBirthDays} days | After birth: ${result.postBirthDays} days)`}
                                />
                                <TimelineItem
                                    title={lang === "tr" ? "İzin Bitişi" : "Leave End"}
                                    detail={formatDate(result.endLeave, includeTime, lang)}
                                />
                                <TimelineItem
                                    title={lang === "tr" ? "Ücretsiz İzin Hakkı başlar" : "Unpaid Leave Right Starts"}
                                    detail={formatDate(result.endLeave, includeTime, lang)}
                                    note={lang === "tr" ? "(isteğe bağlı, 6 ay)" : "(optional, 6 months)"}
                                />
                                <TimelineItem
                                    title={lang === "tr" ? "Süt İzni başlar" : "Nursing Leave Starts"}
                                    detail={formatDate(result.endLeave, includeTime, lang)}
                                    note={lang === "tr" ? "(günde 1.5 saat, 1 yıl)" : "(1.5 hours per day, 1 year)"}
                                    isLast
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        <details className="group rounded-xl border border-slate-200 bg-white shadow-sm" open>
                            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-black text-slate-900 [touch-action:manipulation] [&::-webkit-details-marker]:hidden">
                                <span>{lang === "tr" ? "Babalık İzni Hesabı" : "Paternity Leave Calculation"}</span>
                                <span className="text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                            </summary>
                            <div className="space-y-4 border-t border-slate-100 p-4">
                                <div className="space-y-2">
                                    <label htmlFor="paternity-birth-date" className="text-sm font-semibold text-slate-600">
                                        {lang === "tr" ? "Doğum Tarihi" : "Birth Date"}
                                    </label>
                                    <input
                                        id="paternity-birth-date"
                                        type="date"
                                        min={today}
                                        max={maxDate}
                                        value={paternityDateValue}
                                        placeholder="GG.AA.YYYY"
                                        lang="tr-TR"
                                        onChange={(event) => setPaternityBirthDate(event.target.value)}
                                        className={fieldClassName}
                                    />
                                    {!paternityBirthDate && dueDate && (
                                        <p className="text-xs font-semibold text-slate-500">
                                            {lang === "tr" ? "Anne formundaki tarih otomatik kullanılıyor." : "Using the date from the maternity form."}
                                        </p>
                                    )}
                                </div>

                                {paternityResult ? (
                                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-950">
                                        {lang === "tr"
                                            ? `Babalık izniniz ${formatDate(paternityResult.start, false, lang)} tarihinde başlar, ${formatDate(paternityResult.end, false, lang)} tarihinde biter.`
                                            : `Your paternity leave starts on ${formatDate(paternityResult.start, false, lang)} and ends on ${formatDate(paternityResult.end, false, lang)}.`}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
                                        {lang === "tr" ? "Doğum tarihi seçildiğinde babalık izni hesaplanır." : "Select a birth date to calculate paternity leave."}
                                    </div>
                                )}

                                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">
                                    {lang === "tr"
                                        ? "İşveren reddedemez, yazılı talep yeterli (SGK'ya bildirim şartı yok)"
                                        : "The employer cannot refuse it; a written request is sufficient (no SGK notification required)."}
                                </p>
                            </div>
                        </details>

                        <details className="group rounded-xl border border-slate-200 bg-white shadow-sm" open>
                            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-black text-slate-900 [touch-action:manipulation] [&::-webkit-details-marker]:hidden">
                                <span>{lang === "tr" ? "Ücretsiz Doğum İzni Hesabı" : "Unpaid Maternity Leave Calculation"}</span>
                                <span className="text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                            </summary>
                            <div className="space-y-4 border-t border-slate-100 p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <label htmlFor="unpaid-leave-months" className="text-sm font-semibold text-slate-600">
                                            {lang === "tr" ? "Ücretsiz İzin Süresi" : "Unpaid Leave Duration"}
                                        </label>
                                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-black text-slate-800">
                                            {unpaidLeaveMonths} {lang === "tr" ? "ay" : "months"}
                                        </span>
                                    </div>
                                    <input
                                        id="unpaid-leave-months"
                                        type="range"
                                        min={0}
                                        max={6}
                                        step={1}
                                        value={unpaidLeaveMonths}
                                        onChange={(event) => setUnpaidLeaveMonths(Number(event.target.value))}
                                        className="min-h-[48px] w-full accent-[#FF6B35] [touch-action:manipulation]"
                                    />
                                </div>

                                {unpaidLeaveReturnDate ? (
                                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-950">
                                        {lang === "tr"
                                            ? `Ücretli izin bitişinden sonra ${unpaidLeaveMonths} ay ücretsiz izinle işe dönüş tarihiniz ${formatDate(unpaidLeaveReturnDate, includeTime, lang)} olur.`
                                            : `After ${unpaidLeaveMonths} months of unpaid leave, your return-to-work date is ${formatDate(unpaidLeaveReturnDate, includeTime, lang)}.`}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
                                        {lang === "tr" ? "Önce beklenen doğum tarihini seçin; ücretli izin bitişi üzerinden işe dönüş tarihi hesaplanır." : "Select an expected due date first; the return date is calculated from the paid leave end date."}
                                    </div>
                                )}

                                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">
                                    {lang === "tr"
                                        ? "Talep işverenin onayına tabidir, SGK ödeneği bu sürede kesilir"
                                        : "The request is subject to employer approval; SGK allowance stops during this period."}
                                </p>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </section>
    );
}
