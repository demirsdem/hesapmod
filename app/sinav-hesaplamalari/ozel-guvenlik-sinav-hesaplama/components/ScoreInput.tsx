"use client";

import { AlertCircle } from "lucide-react";

type ScoreInputProps = {
    id: string;
    label: string;
    value: string;
    max: number;
    step?: number;
    unitLabel: string;
    helper?: string;
    error?: string;
    progressLabel: string;
    progressValue: number;
    onChange: (value: string) => void;
    onBlur: () => void;
};

export default function ScoreInput({
    id,
    label,
    value,
    max,
    step = 1,
    unitLabel,
    helper,
    error,
    progressLabel,
    progressValue,
    onChange,
    onBlur,
}: ScoreInputProps) {
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const progressPercent = Math.max(0, Math.min(100, progressValue));

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <label htmlFor={id} className="block text-sm font-black text-slate-900">
                        {label}
                    </label>
                    {helper && (
                        <p id={helperId} className="mt-1 text-xs font-medium leading-5 text-slate-600">
                            {helper}
                        </p>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <input
                        id={id}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        onBlur={onBlur}
                        aria-describedby={[helper ? helperId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
                        aria-invalid={Boolean(error)}
                        className="h-[52px] w-24 rounded-lg border border-slate-300 bg-white px-3 text-center text-xl font-black text-slate-900 outline-none transition focus:border-[#FF6B35] focus-visible:ring-4 focus-visible:ring-[#FF6B35]/20"
                    />
                    <span className="min-w-12 text-sm font-bold text-slate-600">/ {max}</span>
                </div>
            </div>

            <div className="mt-3">
                <div className="mb-1 flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
                    <span>{unitLabel}</span>
                    <span>{progressLabel}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-[#FF6B35] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {error && (
                <p id={errorId} role="alert" aria-live="polite" className="mt-3 flex items-start gap-2 text-sm font-semibold text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {error}
                </p>
            )}
        </div>
    );
}
