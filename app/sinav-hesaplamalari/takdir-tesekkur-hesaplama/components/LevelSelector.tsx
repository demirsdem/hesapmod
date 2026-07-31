"use client";

export type SchoolLevel = "ortaokul" | "lise";

export default function LevelSelector({
    value,
    onChange,
}: {
    value: SchoolLevel;
    onChange: (value: SchoolLevel) => void;
}) {
    return (
        <div>
            <div className="grid gap-2 sm:grid-cols-2" role="tablist" aria-label="Sınıf seviyesi">
                {[
                    { value: "ortaokul" as const, label: "Ortaokul", helper: "5-8. sınıf" },
                    { value: "lise" as const, label: "Lise", helper: "9-12. sınıf" },
                ].map((item) => {
                    const selected = value === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => onChange(item.value)}
                            className={`min-h-[56px] rounded-lg border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25 ${
                                selected
                                    ? "border-[#B84418] bg-orange-50 text-slate-950 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"
                            }`}
                        >
                            <span className="block text-base font-black">{item.label}</span>
                            <span className="block text-sm font-semibold">{item.helper}</span>
                        </button>
                    );
                })}
            </div>
            {value === "lise" && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
                    Dikkat: Lisede Türk Dili ve Edebiyatı, Matematik gibi bazı derslerde okul bazlı ek baraj uygulanabilir.
                    Okulunuzun yönetmeliğini veya rehber öğretmeninizi kontrol edin.
                </p>
            )}
        </div>
    );
}
