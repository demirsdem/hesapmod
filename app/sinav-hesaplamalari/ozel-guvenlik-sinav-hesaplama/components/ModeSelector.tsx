"use client";

import type { OggMode } from "../lib/ogg-calc";
import { Shield, ShieldCheck } from "lucide-react";

type ModeSelectorProps = {
    mode: OggMode;
    onChange: (mode: OggMode) => void;
};

const modes = [
    {
        id: "unarmed" as const,
        label: "Silahsız",
        helper: "100 soruluk temel eğitim",
        Icon: Shield,
    },
    {
        id: "armed" as const,
        label: "Silahlı",
        helper: "Temel + silah + atış",
        Icon: ShieldCheck,
    },
];

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#0F1F3D] p-2" role="tablist" aria-label="ÖGG hesaplama modu">
            {modes.map(({ id, label, helper, Icon }) => {
                const selected = mode === id;

                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(id)}
                        className={[
                            "min-h-[58px] rounded-lg px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/40",
                            selected
                                ? "bg-white text-[#0F1F3D] shadow-sm"
                                : "text-white/80 hover:bg-white/10 hover:text-white",
                        ].join(" ")}
                    >
                        <span className="flex items-center gap-2 text-base font-black">
                            <Icon size={19} aria-hidden="true" />
                            {label}
                        </span>
                        <span className="mt-1 block text-xs font-semibold opacity-75">{helper}</span>
                    </button>
                );
            })}
        </div>
    );
}
