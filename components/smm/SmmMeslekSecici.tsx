"use client";

import { Info } from "lucide-react";
import { MESLEK_STOPAJ, getMeslekStopaj } from "@/lib/smm-calculator";
import type { SmmMeslek } from "@/types/smm";

const meslekOptions: Array<{ value: SmmMeslek; label: string }> = [
    { value: "avukat", label: "Avukat" },
    { value: "doktor", label: "Doktor" },
    { value: "mimar", label: "Mimar" },
    { value: "muhendis", label: "Mühendis" },
    { value: "mali-musavir", label: "Mali müşavir" },
    { value: "muhasebeci", label: "Muhasebeci" },
    { value: "psikolog", label: "Psikolog" },
    { value: "diyetisyen", label: "Diyetisyen" },
    { value: "tercuman", label: "Tercüman" },
    { value: "yazar-telif", label: "Yazar / telif" },
    { value: "diger", label: "Diğer serbest meslek" },
];

export default function SmmMeslekSecici({
    value,
    onChange,
}: {
    value: SmmMeslek;
    onChange: (value: SmmMeslek) => void;
}) {
    const stopaj = getMeslekStopaj(value);

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label htmlFor="smm-meslek" className="text-sm font-black text-slate-950">
                Meslek / işlem türü
            </label>
            <select
                id="smm-meslek"
                value={value}
                onChange={(event) => onChange(event.target.value as SmmMeslek)}
                className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-bold text-slate-950 outline-none transition focus-visible:border-[#CC4A1A] focus-visible:ring-4 focus-visible:ring-orange-100"
            >
                {meslekOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold leading-6 text-blue-950">
                <Info size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>
                    GVK 94/2 kapsamı: {stopaj.kapsam === "telif" ? "telif/patent" : "genel"}{" "}
                    %{stopaj.oran.toLocaleString("tr-TR")} stopaj. {MESLEK_STOPAJ[value].aciklama}.
                </p>
            </div>
        </div>
    );
}
