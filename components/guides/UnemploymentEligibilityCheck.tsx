"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type ExitReason = "employer" | "contractEnded" | "justCause" | "resigned" | "other";
type Service120 = "yes" | "no" | "unknown";
type PremiumDays = "0_599" | "600_899" | "900_1079" | "1080_plus";
type DaysAfterExit = "0_30" | "31_60" | "60_plus";

const exitReasonOptions: Array<{ value: ExitReason; label: string }> = [
    { value: "employer", label: "İşveren tarafından çıkarıldım" },
    { value: "contractEnded", label: "Belirli süreli sözleşmem bitti" },
    { value: "justCause", label: "Haklı nedenle fesih yaptım" },
    { value: "resigned", label: "İstifa ettim" },
    { value: "other", label: "Emeklilik / askerlik / diğer" },
];

const service120Options: Array<{ value: Service120; label: string }> = [
    { value: "yes", label: "Evet" },
    { value: "no", label: "Hayır" },
    { value: "unknown", label: "Emin değilim" },
];

const premiumDayOptions: Array<{ value: PremiumDays; label: string }> = [
    { value: "0_599", label: "0-599" },
    { value: "600_899", label: "600-899" },
    { value: "900_1079", label: "900-1079" },
    { value: "1080_plus", label: "1080+" },
];

const daysAfterExitOptions: Array<{ value: DaysAfterExit; label: string }> = [
    { value: "0_30", label: "0-30" },
    { value: "31_60", label: "31-60" },
    { value: "60_plus", label: "60+" },
];

const premiumResult: Record<PremiumDays, string> = {
    "0_599": "Prim gününüz yetersiz görünüyor. İşsizlik ödeneği için son 3 yılda en az 600 gün prim gerekir.",
    "600_899": "Diğer şartları sağlıyorsanız 180 gün / 6 ay ödeme alabilirsiniz.",
    "900_1079": "Diğer şartları sağlıyorsanız 240 gün / 8 ay ödeme alabilirsiniz.",
    "1080_plus": "Diğer şartları sağlıyorsanız 300 gün / 10 ay ödeme alabilirsiniz.",
};

function SelectField<T extends string>({
    id,
    label,
    value,
    options,
    onChange,
}: {
    id: string;
    label: string;
    value: T;
    options: Array<{ value: T; label: string }>;
    onChange: (value: T) => void;
}) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value as T)}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default function UnemploymentEligibilityCheck() {
    const [exitReason, setExitReason] = useState<ExitReason>("employer");
    const [service120, setService120] = useState<Service120>("yes");
    const [premiumDays, setPremiumDays] = useState<PremiumDays>("600_899");
    const [daysAfterExit, setDaysAfterExit] = useState<DaysAfterExit>("0_30");

    const result = useMemo(() => {
        const notices = [premiumResult[premiumDays]];

        if (daysAfterExit !== "0_30") {
            notices.push("30 günlük başvuru süresi geçmiş olabilir. İŞKUR uygulamasında gecikilen süre toplam hak sahipliği süresinden düşebilir.");
        }

        if (exitReason === "resigned") {
            notices.push("Kural olarak kendi isteğiyle işten ayrılanlar işsizlik ödeneği alamaz. Ancak haklı fesih gibi özel durumlar için İŞKUR ve hukuki değerlendirme gerekir.");
        }

        if (service120 === "no") {
            notices.push("Son 120 gün hizmet akdine tabi çalışma şartı sağlanmamış görünüyor. Kesin durum SGK/İŞKUR kayıtlarıyla kontrol edilmelidir.");
        }

        if (service120 === "unknown") {
            notices.push("Son 120 gün şartından emin değilseniz SGK hizmet dökümü ve çıkış kayıtlarınızı kontrol edin.");
        }

        if (exitReason === "other") {
            notices.push("Emeklilik, askerlik veya diğer ayrılma nedenlerinde çıkış kodu ve başvuru sonucu ayrıca değerlendirilir.");
        }

        const hasBlockingSignal = premiumDays === "0_599" || exitReason === "resigned" || service120 === "no";
        const hasWarningSignal = hasBlockingSignal || daysAfterExit !== "0_30" || service120 === "unknown" || exitReason === "other";

        return {
            title: hasBlockingSignal ? "Hak sahipliği için riskli durum var" : hasWarningSignal ? "Ek kontrol gerekebilir" : "Olası ödeme süresi",
            notices,
            tone: hasBlockingSignal ? "risk" : hasWarningSignal ? "warning" : "ok",
        };
    }, [daysAfterExit, exitReason, premiumDays, service120]);

    return (
        <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6" aria-labelledby="unemployment-eligibility-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        <ShieldCheck size={15} aria-hidden="true" />
                        Mini kontrol
                    </div>
                    <h2 id="unemployment-eligibility-title" className="text-2xl font-extrabold tracking-tight text-slate-950">
                        İşsizlik Maaşı Alabilir miyim?
                    </h2>
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
                <SelectField
                    id="exit-reason"
                    label="İşten ayrılma nedeni"
                    value={exitReason}
                    options={exitReasonOptions}
                    onChange={setExitReason}
                />
                <SelectField
                    id="service-120"
                    label="Son 120 gün hizmet akdine tabi çalıştım mı?"
                    value={service120}
                    options={service120Options}
                    onChange={setService120}
                />
                <SelectField
                    id="premium-days"
                    label="Son 3 yıldaki prim günüm"
                    value={premiumDays}
                    options={premiumDayOptions}
                    onChange={setPremiumDays}
                />
                <SelectField
                    id="days-after-exit"
                    label="İşten çıkıştan sonra kaç gün geçti?"
                    value={daysAfterExit}
                    options={daysAfterExitOptions}
                    onChange={setDaysAfterExit}
                />
            </div>

            <div
                className={cn(
                    "mt-5 rounded-lg border p-4",
                    result.tone === "ok" && "border-emerald-200 bg-emerald-50 text-emerald-950",
                    result.tone === "warning" && "border-amber-200 bg-amber-50 text-amber-950",
                    result.tone === "risk" && "border-red-200 bg-red-50 text-red-950"
                )}
            >
                <div className="flex items-start gap-3">
                    {result.tone === "ok" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                    ) : result.tone === "warning" ? (
                        <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                    ) : (
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
                    )}
                    <div>
                        <p className="font-bold">{result.title}</p>
                        <ul className="mt-2 space-y-1 text-sm leading-6">
                            {result.notices.map((notice) => (
                                <li key={notice}>{notice}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
                Bu kontrol bilgilendirme amaçlıdır. Kesin hak sahipliği İŞKUR değerlendirmesine göre belirlenir.
            </p>
        </section>
    );
}
