import React from "react";
import type { CalculatorInput } from "@/lib/calculator-types";
import { cn } from "@/lib/utils";

interface Props {
    inputs: CalculatorInput[];
    values: Record<string, any>;
    onChange: (id: string, value: any) => void;
    lang: "tr" | "en";
}

export default function CalculatorForm({ inputs, values, onChange, lang }: Props) {
    const visibleInputs = inputs.filter((input) => {
        if (!input.showWhen) return true;
        const expectedValues = Array.isArray(input.showWhen.value)
            ? input.showWhen.value
            : [input.showWhen.value];
        return expectedValues.includes(values[input.showWhen.field]);
    });

    return (
        <div className="animate-scale-in flex flex-wrap -mx-2 gap-y-6">
            {visibleInputs.map((input) => (
                <div
                    key={input.id}
                    className={cn("w-full px-2 flex flex-col gap-2", input.className)}
                >
                    {input.type === "section" ? (
                        <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                {input.name[lang]}
                            </h3>
                            {input.placeholder?.[lang] && (
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">{input.placeholder[lang]}</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <label
                                htmlFor={input.id}
                                className="flex items-start justify-between gap-3 text-sm font-semibold text-slate-600"
                            >
                                {input.name[lang]}
                                {input.required && <span className="text-red-500">*</span>}
                            </label>

                            <div className="relative group/input">
                                {input.type === "number" && (
                                    <div className="relative">
                                        {Boolean(input.prefix) && (
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pr-2 pointer-events-none z-10">
                                                {input.prefix}
                                            </div>
                                        )}
                                        <input
                                            id={input.id}
                                            type="number"
                                            inputMode="decimal"
                                            value={values[input.id] || ""}
                                            onChange={(e) => onChange(input.id, parseFloat(e.target.value) || 0)}
                                            placeholder={input.placeholder?.[lang]}
                                            min={input.min}
                                            max={input.max}
                                            step={input.step}
                                            className={cn(
                                                "w-full h-14 px-4 rounded-xl border border-slate-300 bg-white text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20",
                                                input.suffix ? "pr-12" : "",
                                                input.prefix ? "pl-10" : ""
                                            )}
                                        />
                                    </div>
                                )}

                                {input.type === "range" && (
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                        <div className="flex-1 min-w-[200px] h-12 bg-white border border-slate-300 rounded-xl px-4 flex items-center shadow-sm group-hover/input:border-[#FFD7C7] transition-all cursor-ew-resize">
                                            <input
                                                id={`${input.id}-slider`}
                                                type="range"
                                                min={input.min || 0}
                                                max={input.max || 100}
                                                step={input.step || 1}
                                                value={values[input.id] || input.min || 0}
                                                onChange={(e) => onChange(input.id, parseFloat(e.target.value))}
                                                className="w-full accent-[#FF6B35] h-2 bg-slate-100 rounded-lg appearance-none cursor-ew-resize"
                                            />
                                        </div>
                                        <div className="w-full sm:w-40 md:w-48 flex-shrink-0 relative">
                                            {Boolean(input.prefix) && (
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pr-1 pointer-events-none z-10">
                                                    {input.prefix}
                                                </div>
                                            )}
                                            <input
                                                id={input.id}
                                                type="number"
                                                min={input.min}
                                                max={input.max}
                                                step={input.step}
                                                value={values[input.id] || ""}
                                                onChange={(e) => onChange(input.id, parseFloat(e.target.value) || 0)}
                                                className={cn(
                                                    "w-full h-14 rounded-xl border border-slate-300 bg-white px-3 text-base font-medium text-slate-900 shadow-sm outline-none transition-all group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20",
                                                    input.suffix ? "pr-10" : "",
                                                    input.prefix ? "pl-8 text-left" : "text-right"
                                                )}
                                            />
                                            {Boolean(input.suffix) && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pl-1 pointer-events-none z-10">
                                                    {input.suffix}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {input.type === "text" && (
                                    <input
                                        id={input.id}
                                        type="text"
                                        value={values[input.id] || ""}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        placeholder={input.placeholder?.[lang]}
                                        className={cn(
                                            "w-full h-14 px-4 rounded-xl border border-slate-300 bg-white text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20",
                                            input.suffix ? "pr-12" : ""
                                        )}
                                    />
                                )}

                                {input.type === "select" && (
                                    <select
                                        id={input.id}
                                        value={values[input.id]}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        className="w-full h-14 appearance-none rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition-all group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                                    >
                                        {input.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label[lang]}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {input.type === "radio" && (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {input.options?.map((opt) => (
                                            <label
                                                key={opt.value}
                                                className={cn(
                                                    "flex min-h-[56px] cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-all",
                                                    values[input.id] === opt.value
                                                        ? "border-[#FF6B35] bg-[#FFF3EE] shadow-sm"
                                                        : "border-slate-200 bg-white hover:border-[#FFD7C7] hover:bg-slate-50"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name={input.id}
                                                    value={opt.value}
                                                    checked={values[input.id] === opt.value}
                                                    onChange={(e) => onChange(input.id, e.target.value)}
                                                    className="mt-1 h-4 w-4 flex-shrink-0 border-slate-300 text-[#CC4A1A] focus:ring-[#FF6B35]"
                                                />
                                                <span className="text-sm font-medium leading-6 text-slate-700">{opt.label[lang]}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {input.type === "checkbox" && (
                                    <label
                                        htmlFor={input.id}
                                        className={cn(
                                            "flex min-h-[56px] cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-all",
                                            values[input.id]
                                                ? "border-[#FF6B35] bg-[#FFF3EE] shadow-sm"
                                                : "border-slate-200 bg-white hover:border-[#FFD7C7] hover:bg-slate-50"
                                        )}
                                    >
                                        <input
                                            id={input.id}
                                            type="checkbox"
                                            checked={!!values[input.id]}
                                            onChange={(e) => onChange(input.id, e.target.checked)}
                                            className="mt-1 h-5 w-5 rounded border-slate-300 text-[#CC4A1A] shadow-sm focus:ring-2 focus:ring-[#FF6B35]"
                                        />
                                        <span className="text-sm font-medium leading-6 text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {input.placeholder?.[lang] || "Aktif"}
                                        </span>
                                    </label>
                                )}

                                {input.type === "date" && (
                                    <input
                                        id={input.id}
                                        type="date"
                                        value={values[input.id] || ""}
                                        onChange={(e) => onChange(input.id, e.target.value)}
                                        min={input.min ? String(input.min) : undefined}
                                        max={input.max ? String(input.max) : undefined}
                                        className="w-full h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition-all group-hover/input:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                                    />
                                )}

                                {input.suffix && input.type !== "checkbox" && input.type !== "range" && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 bg-white pl-2 pointer-events-none">
                                        {input.suffix}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
