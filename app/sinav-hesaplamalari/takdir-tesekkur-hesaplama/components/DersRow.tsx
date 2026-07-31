"use client";

import { Trash2 } from "lucide-react";

export type DersFormRow = {
    id: number;
    ad: string;
    not: string;
    saat: string;
};

export type DersRowErrors = Partial<Record<"not" | "saat", string>>;

export default function DersRow({
    ders,
    index,
    errors,
    canDelete,
    inputRef,
    onChange,
    onBlur,
    onDelete,
}: {
    ders: DersFormRow;
    index: number;
    errors: DersRowErrors;
    canDelete: boolean;
    inputRef?: (element: HTMLInputElement | null) => void;
    onChange: (id: number, field: keyof Omit<DersFormRow, "id">, value: string) => void;
    onBlur: (id: number, field: keyof Omit<DersFormRow, "id">) => void;
    onDelete: (id: number) => void;
}) {
    const name = ders.ad.trim() || `${index + 1}. ders`;
    const baseInput =
        "min-h-[52px] w-full rounded-lg border bg-white px-3 text-base font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-[#FF6B35]/20";
    const normalBorder = "border-slate-300 focus:border-[#B84418]";
    const errorBorder = "border-red-600 focus:border-red-700";

    return (
        <fieldset className="ders-satiri rounded-lg border border-slate-200 bg-slate-50 p-3">
            <legend className="px-1 text-sm font-black text-slate-900">{index + 1}. Ders</legend>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(120px,0.7fr)_minmax(120px,0.7fr)_52px] sm:items-start">
                <div>
                    <label htmlFor={`ders-${ders.id}-ad`} className="text-sm font-bold text-slate-700">
                        Ders Adı <span className="font-semibold text-slate-500">(opsiyonel)</span>
                    </label>
                    <input
                        ref={inputRef}
                        id={`ders-${ders.id}-ad`}
                        type="text"
                        value={ders.ad}
                        onChange={(event) => onChange(ders.id, "ad", event.target.value)}
                        onBlur={() => onBlur(ders.id, "ad")}
                        placeholder={`${index + 1}. Ders`}
                        className={`${baseInput} ${normalBorder} mt-1`}
                    />
                </div>
                <div>
                    <label htmlFor={`ders-${ders.id}-not`} className="text-sm font-bold text-slate-700">
                        Not (0-100)
                    </label>
                    <input
                        id={`ders-${ders.id}-not`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={100}
                        step={1}
                        value={ders.not}
                        onChange={(event) => onChange(ders.id, "not", event.target.value)}
                        onBlur={() => onBlur(ders.id, "not")}
                        aria-invalid={Boolean(errors.not)}
                        aria-describedby={errors.not ? `ders-${ders.id}-not-hata` : undefined}
                        className={`${baseInput} ${errors.not ? errorBorder : normalBorder} mt-1`}
                    />
                    {errors.not && (
                        <span id={`ders-${ders.id}-not-hata`} role="alert" aria-live="polite" className="mt-1 block text-xs font-bold text-red-700">
                            Hata: {errors.not}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor={`ders-${ders.id}-saat`} className="text-sm font-bold text-slate-700">
                        Haftalık Saat
                    </label>
                    <input
                        id={`ders-${ders.id}-saat`}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={10}
                        step={1}
                        value={ders.saat}
                        onChange={(event) => onChange(ders.id, "saat", event.target.value)}
                        onBlur={() => onBlur(ders.id, "saat")}
                        aria-invalid={Boolean(errors.saat)}
                        aria-describedby={errors.saat ? `ders-${ders.id}-saat-hata` : undefined}
                        className={`${baseInput} ${errors.saat ? errorBorder : normalBorder} mt-1`}
                    />
                    {errors.saat && (
                        <span id={`ders-${ders.id}-saat-hata`} role="alert" aria-live="polite" className="mt-1 block text-xs font-bold text-red-700">
                            Hata: {errors.saat}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onDelete(ders.id)}
                    disabled={!canDelete}
                    aria-label={`${name} satırını sil`}
                    title={`${name} satırını sil`}
                    className="mt-0 inline-flex min-h-[52px] items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-red-300 hover:text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-40 sm:mt-6"
                >
                    <Trash2 size={18} aria-hidden="true" />
                </button>
            </div>
        </fieldset>
    );
}
