"use client";

import { useMemo, useState } from "react";
import FormulaCopyButton from "@/components/calculator/FormulaCopyButton";

type Props = {
    initialValues?: Record<string, any>;
};

const QUICK_NOTES = [70, 80, 85, 90, 95, 100];
const COMPARISON_ROWS = [70, 75, 80, 85, 90, 95, 100];

function parseDiplomaNote(value: string) {
    const normalizedValue = value.replace(",", ".");
    const parsedValue = Number.parseFloat(normalizedValue);

    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatScore(value: number, digits = 1) {
    return value.toLocaleString("tr-TR", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : digits,
        maximumFractionDigits: digits,
    });
}

function ResultCard({
    title,
    value,
    detail,
    active = false,
    primary = false,
}: {
    title: string;
    value: string;
    detail: string;
    active?: boolean;
    primary?: boolean;
}) {
    return (
        <div
            className={[
                "rounded-xl border p-4 shadow-sm transition-all",
                primary ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-white",
                active ? "ring-2 ring-[#FF6B35]/30" : "opacity-50",
            ].join(" ")}
        >
            <p className="text-sm font-bold text-slate-600">{title}</p>
            <p className={active || primary ? "mt-2 text-3xl font-black text-[#CC4A1A]" : "mt-2 text-2xl font-black text-slate-500"}>
                {value}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
        </div>
    );
}

export default function ObpCalculator({ initialValues }: Props) {
    const initialDiplomaNote = Number(initialValues?.diplomaNote ?? 85);
    const [diplomaNoteInput, setDiplomaNoteInput] = useState(
        Number.isFinite(initialDiplomaNote) ? String(initialDiplomaNote) : "85"
    );
    const [previousPlacement, setPreviousPlacement] = useState(
        initialValues?.previousPlacement === true
        || initialValues?.previousPlacement === "true"
        || initialValues?.previousPlacement === "on"
    );
    const [submittedNote, setSubmittedNote] = useState<number | null>(
        Number.isFinite(initialDiplomaNote) ? initialDiplomaNote : 85
    );

    const currentNote = parseDiplomaNote(diplomaNoteInput);
    const errorMessage = currentNote === null || currentNote < 50 || currentNote > 100
        ? "Diploma notu 50 ile 100 arasında olmalıdır"
        : null;

    const effectiveNote = errorMessage ? submittedNote ?? 85 : currentNote;
    const results = useMemo(() => {
        const diplomaNote = Math.min(100, Math.max(50, effectiveNote ?? 85));
        const obp = diplomaNote * 5;
        const standardContribution = obp * 0.12;
        const reducedContribution = obp * 0.06;

        return {
            diplomaNote,
            obp,
            standardContribution,
            reducedContribution,
            activeContribution: previousPlacement ? reducedContribution : standardContribution,
        };
    }, [effectiveNote, previousPlacement]);

    const calculate = () => {
        if (currentNote !== null && currentNote >= 50 && currentNote <= 100) {
            setSubmittedNote(currentNote);
        }
    };

    const loadQuickNote = (note: number) => {
        setDiplomaNoteInput(String(note));
        setSubmittedNote(note);
    };

    const highlightedRow = COMPARISON_ROWS.find((note) => Math.abs(note - results.diplomaNote) < 0.05);

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC4A1A]">YKS 2026</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    OBP (Ortaöğretim Başarı Puanı) Hesaplama
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                    Diploma notunu gir, standart katkı ile kırık OBP katkısını aynı ekranda karşılaştır.
                </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="space-y-5">
                    <div>
                        <label htmlFor="diplomaNote" className="text-sm font-bold text-slate-700">
                            Diploma Notu (100 üzerinden)
                        </label>
                        <input
                            id="diplomaNote"
                            type="number"
                            inputMode="numeric"
                            min={50}
                            max={100}
                            step={0.1}
                            value={diplomaNoteInput}
                            onChange={(event) => setDiplomaNoteInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    calculate();
                                }
                            }}
                            placeholder="örn. 85"
                            aria-invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? "diplomaNote-error" : "diplomaNote-help"}
                            className="mt-2 h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-950 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
                        />
                        {errorMessage ? (
                            <p id="diplomaNote-error" className="mt-2 text-sm font-semibold text-red-600">
                                {errorMessage}
                            </p>
                        ) : (
                            <p id="diplomaNote-help" className="mt-2 text-xs font-medium text-slate-500">
                                Ondalıklı not girebilirsiniz: 84,5 gibi.
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-500">Hızlı örnek:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {QUICK_NOTES.map((note) => (
                                <button
                                    key={note}
                                    type="button"
                                    onClick={() => loadQuickNote(note)}
                                    aria-label={`Diploma notu ${note} örneğini yükle`}
                                    className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 transition-colors hover:border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
                                >
                                    {note}
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <span>
                            <span className="block text-sm font-bold text-slate-800">
                                Geçen yıl merkezi yerleştirme ile bir programa yerleştim
                            </span>
                            <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
                                Bu durumda OBP katkısı 0.12 yerine 0.06 olarak hesaplanır.
                            </span>
                        </span>
                        <input
                            type="checkbox"
                            checked={previousPlacement}
                            onChange={(event) => setPreviousPlacement(event.target.checked)}
                            role="switch"
                            aria-checked={previousPlacement}
                            className="mt-1 h-5 w-5 accent-[#FF6B35]"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={calculate}
                        className="h-12 w-full rounded-xl bg-[#FF6B35] px-5 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#E55A26] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/25"
                    >
                        Hesapla
                    </button>
                </div>

                <div role="status" aria-live="polite" className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <ResultCard
                            title="OBP Puanı"
                            value={formatScore(results.obp)}
                            detail={`(${formatScore(results.diplomaNote)} x 5)`}
                            primary
                            active
                        />
                        <ResultCard
                            title="YKS Katkısı"
                            value={`+${formatScore(results.standardContribution)} puan`}
                            detail={`(${formatScore(results.obp)} x 0.12)`}
                            active={!previousPlacement}
                        />
                        <ResultCard
                            title="Kırık OBP Katkısı"
                            value={`+${formatScore(results.reducedContribution)} puan`}
                            detail={`(${formatScore(results.obp)} x 0.06)`}
                            active={previousPlacement}
                        />
                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold leading-6 text-orange-950">
                        YKS'de 1 puan yaklaşık 100-300 sıra fark yaratabilir; puan türüne göre değişir.
                        {` ${formatScore(results.activeContribution)} puanlık OBP katkısı, eşit netlerde sıralamanı önemli ölçüde etkileyebilir.`}
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-4">
                <div className="rounded-xl border-l-4 border-[#FF6B35] bg-slate-50 p-4">
                    <h3 className="text-base font-black text-slate-950">
                        <span className="mr-2 text-[#FF6B35]">1.</span>Diploma notunu 100 üzerinden gir
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        OBP, diploma notunun 5 ile çarpılmasıyla bulunur.
                    </p>
                </div>
                <div className="rounded-xl border-l-4 border-[#FF6B35] bg-slate-50 p-4">
                    <h3 className="text-base font-black text-slate-950">
                        <span className="mr-2 text-[#FF6B35]">2.</span>Kırık OBP durumunu seç
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Önceki yıl merkezi yerleştirme ile yerleştiysen katkı katsayısı yarıya iner.
                    </p>
                </div>
                <div className="rounded-xl border-l-4 border-[#FF6B35] bg-slate-50 p-4">
                    <h3 className="text-base font-black text-slate-950">
                        <span className="mr-2 text-[#FF6B35]">3.</span>Standart ve kırık katkıyı karşılaştır
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Üç kartlı sonuç paneli OBP puanını, standart katkıyı ve kırık OBP katkısını birlikte gösterir.
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-900 p-4 text-orange-300">
                <div className="flex items-start justify-between gap-3">
                    <div className="font-mono text-sm leading-7">
                        <p>OBP = Diploma Notu x 5</p>
                        <p>YKS Katkısı = OBP x 0.12 (Kırık OBP: x 0.06)</p>
                    </div>
                    <FormulaCopyButton text={"OBP = Diploma Notu x 5\nYKS Katkısı = OBP x 0.12 (Kırık OBP: x 0.06)"} />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-black text-slate-950">Diploma Notuna Göre OBP Katkı Tablosu</h3>
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left font-bold">Diploma Notu</th>
                                <th scope="col" className="px-4 py-3 text-left font-bold">OBP Puanı</th>
                                <th scope="col" className="px-4 py-3 text-left font-bold">Standart Katkı</th>
                                <th scope="col" className="px-4 py-3 text-left font-bold">Kırık OBP Katkısı</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPARISON_ROWS.map((note) => {
                                const obp = note * 5;
                                const isActive = highlightedRow === note;

                                return (
                                    <tr
                                        key={note}
                                        className={isActive
                                            ? "border-l-2 border-[#FF6B35] bg-orange-50 font-semibold"
                                            : "odd:bg-white even:bg-slate-50"}
                                    >
                                        <td className="px-4 py-3">{note}</td>
                                        <td className="px-4 py-3">{formatScore(obp, 0)}</td>
                                        <td className="px-4 py-3">{formatScore(obp * 0.12)} puan</td>
                                        <td className="px-4 py-3">{formatScore(obp * 0.06)} puan</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
