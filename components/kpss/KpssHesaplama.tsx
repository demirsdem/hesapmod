"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useTransition } from "react";
import { RotateCcw, Target } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PuanTuruSecici from "./PuanTuruSecici";
import SonucKarti from "./SonucKarti";
import PaylasimLinki from "./PaylasimLinki";
import {
    decodeUrlToState,
    defaultState,
    encodeStateToUrl,
    hesaplaKpss,
    TEST_LIMITLERI,
    validateKpssInput,
} from "@/lib/kpss-calculator";
import type { HesaplamaGirdisi } from "@/types/kpss";

const SimulasyonTablosu = dynamic(() => import("./SimulasyonTablosu"), {
    ssr: false,
    loading: () => <div className="mt-4 min-h-32 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">Simülasyon hazırlanıyor...</div>,
});

type InputKey = keyof Omit<HesaplamaGirdisi, "puanTuru">;
type FormState = Record<InputKey, string> & { puanTuru: HesaplamaGirdisi["puanTuru"] };

const labels: Record<InputKey, string> = {
    gyDogru: "GY Doğru",
    gyYanlis: "GY Yanlış",
    gkDogru: "GK Doğru",
    gkYanlis: "GK Yanlış",
    ebDogru: "Eğitim Bilimleri Doğru",
    ebYanlis: "Eğitim Bilimleri Yanlış",
};

function toFormState(state: HesaplamaGirdisi): FormState {
    return {
        puanTuru: state.puanTuru,
        gyDogru: String(state.gyDogru),
        gyYanlis: String(state.gyYanlis),
        gkDogru: String(state.gkDogru),
        gkYanlis: String(state.gkYanlis),
        ebDogru: String(state.ebDogru ?? 0),
        ebYanlis: String(state.ebYanlis ?? 0),
    };
}

function toNumber(value: string) {
    return value.trim() === "" ? 0 : Number(value);
}

function toInput(form: FormState): HesaplamaGirdisi {
    return {
        puanTuru: form.puanTuru,
        gyDogru: toNumber(form.gyDogru),
        gyYanlis: toNumber(form.gyYanlis),
        gkDogru: toNumber(form.gkDogru),
        gkYanlis: toNumber(form.gkYanlis),
        ebDogru: toNumber(form.ebDogru),
        ebYanlis: toNumber(form.ebYanlis),
    };
}

function getFieldError(form: FormState, key: InputKey) {
    const value = form[key];
    if (value.trim() === "") {
        return "Bu alan boş bırakılamaz.";
    }
    if (!/^\d+$/.test(value.trim())) {
        return "Yalnızca 0 veya pozitif tam sayı girin.";
    }

    const limits: Record<InputKey, number> = {
        gyDogru: TEST_LIMITLERI.GY,
        gyYanlis: TEST_LIMITLERI.GY,
        gkDogru: TEST_LIMITLERI.GK,
        gkYanlis: TEST_LIMITLERI.GK,
        ebDogru: TEST_LIMITLERI.EB,
        ebYanlis: TEST_LIMITLERI.EB,
    };

    const parsed = Number(value);
    if (parsed > limits[key]) {
        return `En fazla ${limits[key]} olabilir.`;
    }

    const gyTotal = toNumber(form.gyDogru) + toNumber(form.gyYanlis);
    const gkTotal = toNumber(form.gkDogru) + toNumber(form.gkYanlis);
    const ebTotal = toNumber(form.ebDogru) + toNumber(form.ebYanlis);

    if ((key === "gyDogru" || key === "gyYanlis") && gyTotal > TEST_LIMITLERI.GY) {
        return "GY doğru + yanlış toplamı 60 soruyu geçemez.";
    }
    if ((key === "gkDogru" || key === "gkYanlis") && gkTotal > TEST_LIMITLERI.GK) {
        return "GK doğru + yanlış toplamı 60 soruyu geçemez.";
    }
    if (form.puanTuru === "P3" && (key === "ebDogru" || key === "ebYanlis") && ebTotal > TEST_LIMITLERI.EB) {
        return "Eğitim Bilimleri doğru + yanlış toplamı 80 soruyu geçemez.";
    }

    return "";
}

function ScoreInput({
    id,
    name,
    form,
    onChange,
}: {
    id: string;
    name: InputKey;
    form: FormState;
    onChange: (name: InputKey, value: string) => void;
}) {
    const error = getFieldError(form, name);

    return (
        <div>
            <label htmlFor={id} className="flex items-center justify-between gap-2 text-sm font-black text-slate-900">
                <span>{labels[name]} <span aria-label="zorunlu alan">*</span></span>
            </label>
            <input
                id={id}
                name={name}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={0}
                max={name.startsWith("eb") ? TEST_LIMITLERI.EB : TEST_LIMITLERI.GY}
                value={form[name]}
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={`${id}-hata`}
                onChange={(event) => onChange(name, event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-bold tabular-nums text-slate-950 outline-none transition focus-visible:border-[#CC4A1A] focus-visible:ring-4 focus-visible:ring-orange-100"
            />
            <span id={`${id}-hata`} role="alert" aria-live="polite" className="mt-1 block min-h-5 text-xs font-bold text-red-700">
                {error}
            </span>
        </div>
    );
}

export default function KpssHesaplama() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState("");
    const [showSimulation, setShowSimulation] = useState(false);
    const [targetScore, setTargetScore] = useState("85");
    const [form, setForm] = useState<FormState>(() => toFormState(decodeUrlToState(searchParams.toString())));
    const [debouncedForm, setDebouncedForm] = useState(form);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedForm(form), 150);
        return () => window.clearTimeout(timer);
    }, [form]);

    const visibleKeys: InputKey[] = form.puanTuru === "P3"
        ? ["gyDogru", "gyYanlis", "gkDogru", "gkYanlis", "ebDogru", "ebYanlis"]
        : ["gyDogru", "gyYanlis", "gkDogru", "gkYanlis"];

    const errors = visibleKeys.map((key) => getFieldError(form, key)).filter(Boolean);
    const input = useMemo(() => toInput(debouncedForm), [debouncedForm]);
    const result = useMemo(() => {
        try {
            return hesaplaKpss(input);
        } catch (error) {
            return hesaplaKpss(defaultState);
        }
    }, [input]);

    const updateUrl = (nextForm: FormState) => {
        const nextInput = toInput(nextForm);
        try {
            validateKpssInput(nextInput);
            startTransition(() => {
                router.replace(`/sinav-hesaplamalari/kpss-puan-hesaplama${encodeStateToUrl(nextInput)}`, { scroll: false });
            });
        } catch {
            // Inline errors already describe the invalid state.
        }
    };

    const updateValue = (name: InputKey, value: string) => {
        setToast("");
        setForm((current) => {
            const next = { ...current, [name]: value };
            updateUrl(next);
            return next;
        });
    };

    const reset = () => {
        const next = toFormState(defaultState);
        setForm(next);
        setToast("Form varsayılan değerlere döndü.");
        router.replace("/sinav-hesaplamalari/kpss-puan-hesaplama", { scroll: false });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateUrl(form);
        setDebouncedForm(form);
    };

    return (
        <section id="kpss-araci" aria-labelledby="kpss-calculator-heading" className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Canlı hesaplama</p>
                    <h2 id="kpss-calculator-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                        KPSS Puan Hesaplama Aracı
                    </h2>
                </div>
                <p className="text-sm font-semibold text-slate-600">{isPending ? "URL güncelleniyor..." : "Girdiler cihazınızda hesaplanır."}</p>
            </div>

            <div className="mt-5 grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:items-start">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <PuanTuruSecici
                        value={form.puanTuru}
                        onChange={(puanTuru) => {
                            const next = { ...form, puanTuru };
                            setForm(next);
                            updateUrl(next);
                        }}
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        {visibleKeys.map((key) => (
                            <ScoreInput key={key} id={`kpss-${key}`} name={key} form={form} onChange={updateValue} />
                        ))}
                    </div>

                    {errors.length > 0 && (
                        <div role="alert" aria-live="polite" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800">
                            {errors[0]}
                        </div>
                    )}

                    <div className="grid gap-2 sm:grid-cols-3">
                        <button
                            type="submit"
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                        >
                            Hesapla
                        </button>
                        <PaylasimLinki state={toInput(form)} onCopied={setToast} />
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                        >
                            <RotateCcw size={17} aria-hidden="true" />
                            Sıfırla
                        </button>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <button
                            type="button"
                            onClick={() => setShowSimulation((current) => !current)}
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                            aria-expanded={showSimulation}
                            aria-controls="kpss-simulasyon-panel"
                        >
                            <Target size={17} aria-hidden="true" />
                            Hedef Puan Simülasyonu
                        </button>
                        {showSimulation && (
                            <div id="kpss-simulasyon-panel" className="mt-4">
                                <label htmlFor="kpss-hedef-puan" className="text-sm font-black text-slate-900">
                                    Hedef puan
                                </label>
                                <input
                                    id="kpss-hedef-puan"
                                    type="number"
                                    inputMode="numeric"
                                    min={40}
                                    max={130}
                                    value={targetScore}
                                    onChange={(event) => setTargetScore(event.target.value)}
                                    className="mt-1 h-11 w-full rounded-lg border border-slate-300 px-3 text-base font-bold outline-none focus-visible:border-[#CC4A1A] focus-visible:ring-4 focus-visible:ring-orange-100"
                                />
                                <SimulasyonTablosu puanTuru={form.puanTuru} hedefPuan={Number(targetScore) || 85} />
                            </div>
                        )}
                    </div>

                    {toast && (
                        <p role="status" aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
                            {toast}
                        </p>
                    )}
                </form>

                <div className="min-w-0 2xl:sticky 2xl:top-24">
                    <SonucKarti result={result} puanTuru={form.puanTuru} />
                </div>
            </div>
        </section>
    );
}
