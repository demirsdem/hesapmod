"use client";

import type { PuanTuru } from "@/types/kpss";

const options: Array<{ value: PuanTuru; label: string; helper: string }> = [
    { value: "P1", label: "P1", helper: "GY + GK" },
    { value: "P3", label: "P3", helper: "GY + GK + EB" },
    { value: "P93", label: "P93", helper: "Ön lisans" },
    { value: "P94", label: "P94", helper: "Ortaöğr." },
];

export default function PuanTuruSecici({
    value,
    onChange,
    className,
}: {
    value: PuanTuru;
    onChange: (value: PuanTuru) => void;
    className?: string;
}) {
    return (
        <fieldset className={className}>
            <legend className="text-sm font-black text-slate-900">Puan Türü Seçin</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="KPSS puan türü">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`min-h-11 cursor-pointer rounded-lg border px-2 py-3 text-center transition focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[#CC4A1A] ${
                            value === option.value
                                ? "border-[#CC4A1A] bg-orange-50 text-slate-950"
                                : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"
                        }`}
                    >
                        <input
                            type="radio"
                            name="puan-turu"
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />
                        <span className="block text-base font-black leading-5">{option.label}</span>
                        <span className="mt-1 block text-[11px] font-semibold leading-4 sm:text-xs">{option.helper}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
