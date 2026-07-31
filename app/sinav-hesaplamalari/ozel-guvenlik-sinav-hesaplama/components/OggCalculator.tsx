"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Printer, RotateCcw, Share2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ModeSelector from "./ModeSelector";
import ScoreInput from "./ScoreInput";
import ResultCard from "./ResultCard";
import {
    BASIC_SECTIONS,
    EMPTY_OGG_INPUTS,
    calculateOggResult,
    clampInteger,
    formatScore,
    type OggInputs,
    type OggMode,
} from "../lib/ogg-calc";

type InputKey = keyof OggInputs;
type StringInputs = Record<InputKey, string>;
type TouchedInputs = Partial<Record<InputKey, boolean>>;
type SearchParamsLike = {
    get: (name: string) => string | null;
};

const INPUT_LIMITS: Record<InputKey, number> = {
    hukuk: 30,
    mevzuat: 30,
    ilkyardim: 20,
    silah: 20,
    silahBilgisi: 25,
    atis: 5,
};

const QUERY_KEYS: Record<InputKey, string> = {
    hukuk: "h",
    mevzuat: "m",
    ilkyardim: "i",
    silah: "s",
    silahBilgisi: "sb",
    atis: "a",
};

const emptyStringInputs: StringInputs = {
    hukuk: "",
    mevzuat: "",
    ilkyardim: "",
    silah: "",
    silahBilgisi: "",
    atis: "",
};

function parseInputValue(value: string, key: InputKey) {
    if (value.trim() === "") {
        return 0;
    }

    return clampInteger(value, INPUT_LIMITS[key]);
}

function getInputError(value: string, key: InputKey, touched: boolean) {
    if (!touched) {
        return "";
    }

    if (value.trim() === "") {
        return "Bu alan boş bırakılamaz.";
    }

    if (!/^\d+$/.test(value.trim())) {
        return "Yalnızca tam sayı girin.";
    }

    const parsed = Number(value);
    if (parsed < 0) {
        return "Negatif değer girilemez.";
    }

    if (parsed > INPUT_LIMITS[key]) {
        return `En fazla ${INPUT_LIMITS[key]} olabilir.`;
    }

    return "";
}

function readInitialMode(searchParams: SearchParamsLike): OggMode {
    return searchParams.get("mod") === "silahli" ? "armed" : "unarmed";
}

function readInitialInputs(searchParams: SearchParamsLike): StringInputs {
    const nextInputs = { ...emptyStringInputs };

    (Object.keys(QUERY_KEYS) as InputKey[]).forEach((key) => {
        const value = searchParams.get(QUERY_KEYS[key]);
        if (value !== null && /^\d+$/.test(value)) {
            nextInputs[key] = String(clampInteger(value, INPUT_LIMITS[key]));
        }
    });

    return nextInputs;
}

function hasAnyInput(values: StringInputs, mode: OggMode) {
    const keys: InputKey[] = mode === "armed"
        ? ["hukuk", "mevzuat", "ilkyardim", "silah", "silahBilgisi", "atis"]
        : ["hukuk", "mevzuat", "ilkyardim", "silah"];

    return keys.some((key) => values[key].trim() !== "");
}

export default function OggCalculator() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resultRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);
    const [mode, setMode] = useState<OggMode>(() => readInitialMode(searchParams));
    const [values, setValues] = useState<StringInputs>(() => readInitialInputs(searchParams));
    const [touched, setTouched] = useState<TouchedInputs>({});
    const [shareStatus, setShareStatus] = useState("");

    const numericInputs = useMemo<OggInputs>(() => ({
        hukuk: parseInputValue(values.hukuk, "hukuk"),
        mevzuat: parseInputValue(values.mevzuat, "mevzuat"),
        ilkyardim: parseInputValue(values.ilkyardim, "ilkyardim"),
        silah: parseInputValue(values.silah, "silah"),
        silahBilgisi: parseInputValue(values.silahBilgisi, "silahBilgisi"),
        atis: parseInputValue(values.atis, "atis"),
    }), [values]);

    const visibleKeys: InputKey[] = mode === "armed"
        ? ["hukuk", "mevzuat", "ilkyardim", "silah", "silahBilgisi", "atis"]
        : ["hukuk", "mevzuat", "ilkyardim", "silah"];

    const errors = useMemo(() => {
        return visibleKeys.reduce<Partial<Record<InputKey, string>>>((acc, key) => {
            const error = getInputError(values[key], key, Boolean(touched[key]));
            if (error) {
                acc[key] = error;
            }
            return acc;
        }, {});
    }, [touched, values, visibleKeys]);

    const anyInput = hasAnyInput(values, mode);
    const result = useMemo(() => calculateOggResult(mode, numericInputs, anyInput), [anyInput, mode, numericInputs]);

    useEffect(() => {
        if (!anyInput) {
            initializedRef.current = false;
            return;
        }

        if (!initializedRef.current) {
            initializedRef.current = true;
            return;
        }

        const timer = window.setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);

        return () => window.clearTimeout(timer);
    }, [anyInput, result.kind]);

    const updateValue = (key: InputKey, nextValue: string) => {
        setShareStatus("");
        setValues((current) => ({
            ...current,
            [key]: nextValue,
        }));
    };

    const markTouched = (key: InputKey) => {
        setTouched((current) => ({ ...current, [key]: true }));
    };

    const reset = () => {
        setValues(emptyStringInputs);
        setTouched({});
        setShareStatus("");
        router.replace("/sinav-hesaplamalari/ozel-guvenlik-sinav-hesaplama", { scroll: false });
    };

    const share = async () => {
        const params = new URLSearchParams();
        params.set("mod", mode === "armed" ? "silahli" : "silahsiz");

        visibleKeys.forEach((key) => {
            if (values[key].trim() !== "") {
                params.set(QUERY_KEYS[key], String(parseInputValue(values[key], key)));
            }
        });

        const nextPath = `/sinav-hesaplamalari/ozel-guvenlik-sinav-hesaplama?${params.toString()}`;
        router.replace(nextPath, { scroll: false });
        const shareUrl = `${window.location.origin}${nextPath}`;

        if (navigator.share) {
            await navigator.share({
                title: "ÖGG Sınav Puanı Hesaplama",
                text: `ÖGG sonucum: ${result.title} - ${formatScore(result.totalScore)} puan`,
                url: shareUrl,
            });
            return;
        }

        await navigator.clipboard?.writeText(shareUrl);
        setShareStatus("Sonuç bağlantısı panoya kopyalandı.");
    };

    const print = () => {
        window.print();
    };

    return (
        <section aria-labelledby="ogg-calculator-heading" className="calculator-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
            <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-wide text-[#FF6B35]">Canlı hesaplama</p>
                <h2 id="ogg-calculator-heading" className="mt-1 text-2xl font-black tracking-tight text-[#0F1F3D]">
                    ÖGG Sınav Puanı Hesaplama
                </h2>
            </div>

            <ModeSelector
                mode={mode}
                onChange={(nextMode) => {
                    setMode(nextMode);
                    setShareStatus("");
                }}
            />

            <div className="mt-5 grid gap-3">
                {BASIC_SECTIONS.map((section) => {
                    const value = numericInputs[section.id];
                    return (
                        <ScoreInput
                            key={section.id}
                            id={`ogg-${section.id}`}
                            label={`${section.label} (${section.questionCount} soru)`}
                            value={values[section.id]}
                            max={section.questionCount}
                            unitLabel="Temel eğitim"
                            helper={`Dengeli başarı için öneri: en az ${section.advisoryMinimum} doğru. Resmi geçme şartı toplam 60 puandır.`}
                            error={errors[section.id]}
                            progressLabel={`${value}/${section.questionCount} doğru`}
                            progressValue={(value / section.questionCount) * 100}
                            onChange={(nextValue) => updateValue(section.id, nextValue)}
                            onBlur={() => markTouched(section.id)}
                        />
                    );
                })}

                {mode === "armed" && (
                    <>
                        <ScoreInput
                            id="ogg-silah-bilgisi"
                            label="Silah Bilgisi (25 soru)"
                            value={values.silahBilgisi}
                            max={25}
                            unitLabel="Her doğru 2 puan"
                            helper="Silah bilgisi yazılı bölümü en fazla 50 puan üretir."
                            error={errors.silahBilgisi}
                            progressLabel={`${numericInputs.silahBilgisi}/25 doğru`}
                            progressValue={(numericInputs.silahBilgisi / 25) * 100}
                            onChange={(nextValue) => updateValue("silahBilgisi", nextValue)}
                            onBlur={() => markTouched("silahBilgisi")}
                        />
                        <ScoreInput
                            id="ogg-atis"
                            label="Atış (5 isabet)"
                            value={values.atis}
                            max={5}
                            unitLabel="Her isabet 10 puan"
                            helper="Uygulamalı atış bölümü en fazla 50 puan üretir."
                            error={errors.atis}
                            progressLabel={`${numericInputs.atis}/5 isabet`}
                            progressValue={(numericInputs.atis / 5) * 100}
                            onChange={(nextValue) => updateValue("atis", nextValue)}
                            onBlur={() => markTouched("atis")}
                        />
                    </>
                )}
            </div>

            <div ref={resultRef} className="mt-5">
                <ResultCard result={result} />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={reset}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/20"
                >
                    <RotateCcw size={17} aria-hidden="true" />
                    Sıfırla
                </button>
                <button
                    type="button"
                    onClick={share}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0F1F3D] px-4 text-sm font-black text-white transition hover:bg-[#14284f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/30"
                >
                    <Share2 size={17} aria-hidden="true" />
                    Sonucumu Paylaş
                </button>
                <button
                    type="button"
                    onClick={print}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FF6B35] px-4 text-sm font-black text-white transition hover:bg-[#E55A26] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/30"
                >
                    <Printer size={17} aria-hidden="true" />
                    Yazdır
                </button>
            </div>
            {shareStatus && (
                <p role="status" aria-live="polite" className="mt-3 text-sm font-semibold text-slate-700">
                    {shareStatus}
                </p>
            )}
        </section>
    );
}
