"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { HelpCircle, RotateCcw } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import {
    KDV_ORANLARI,
    getMeslekStopaj,
    hesapla,
} from "@/lib/smm-calculator";
import type { SmmInputs, SmmMeslek, SmmTutarTipi } from "@/types/smm";
import SmmMeslekSecici from "./SmmMeslekSecici";
import SmmSonucKarti from "./SmmSonucKarti";
import SmmOzetTablosu from "./SmmOzetTablosu";

const SmmScenarioTable = dynamic(() => import("./SmmScenarioTable"), {
    ssr: false,
    loading: () => (
        <div className="min-h-32 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            Senaryolar hazırlanıyor...
        </div>
    ),
});

const STORAGE_KEY = "smm-form-v1";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const MID_AD_SLOT = process.env.NEXT_PUBLIC_SMM_AD_SLOT_1;

type FormState = {
    tutar: string;
    tutarTipi: SmmTutarTipi;
    meslek: SmmMeslek;
    kdvOrani: number;
    stopajOrani: string;
};

const defaultState: FormState = {
    tutar: "10000",
    tutarTipi: "brut",
    meslek: "avukat",
    kdvOrani: 20,
    stopajOrani: "20",
};

const tutarTipleri: Array<{ value: SmmTutarTipi; label: string; help: string }> = [
    { value: "brut", label: "Brüt Tutar", help: "Makbuzdaki hizmet bedeli" },
    { value: "net", label: "Net Gelir", help: "Stopaj sonrası hedef gelir" },
    { value: "tahsil", label: "Tahsil Edilecek", help: "Müşterinin ödeyeceği tutar" },
];

function parseNumber(value: string) {
    const normalized = value.replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}

function readStoredState(): FormState {
    if (typeof window === "undefined") {
        return defaultState;
    }

    try {
        const params = new URLSearchParams(window.location.search);
        const urlTip = params.get("tip") as SmmTutarTipi | null;
        const urlTutar = params.get("tutar");
        if (
            urlTutar
            && ["brut", "net", "tahsil"].includes(urlTip ?? "")
            && parseNumber(urlTutar) > 0
        ) {
            return {
                ...defaultState,
                tutarTipi: urlTip as SmmTutarTipi,
                tutar: urlTutar,
            };
        }

        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return defaultState;
        }

        const parsed = JSON.parse(raw) as Partial<FormState>;
        const meslekStopaj = getMeslekStopaj(parsed.meslek ?? defaultState.meslek);
        return {
            tutar: typeof parsed.tutar === "string" ? parsed.tutar : defaultState.tutar,
            tutarTipi: parsed.tutarTipi ?? defaultState.tutarTipi,
            meslek: parsed.meslek ?? defaultState.meslek,
            kdvOrani: typeof parsed.kdvOrani === "number" ? parsed.kdvOrani : defaultState.kdvOrani,
            stopajOrani: typeof parsed.stopajOrani === "string" ? parsed.stopajOrani : String(meslekStopaj.oran),
        };
    } catch {
        return defaultState;
    }
}

function getAmountLabel(tutarTipi: SmmTutarTipi) {
    switch (tutarTipi) {
        case "net":
            return "Hedef Net Gelirim";
        case "tahsil":
            return "Müşterinin Ödeyeceği";
        case "brut":
        default:
            return "Hizmet Bedeli (Brüt)";
    }
}

function Tooltip({ text }: { text: string }) {
    return (
        <span className="group/tooltip relative inline-flex">
            <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#FFD7C7] hover:text-[#CC4A1A] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                aria-label="Bilgi"
            >
                <HelpCircle size={15} aria-hidden="true" />
            </button>
            <span className="pointer-events-none absolute right-0 top-9 z-30 hidden w-64 rounded-lg border border-slate-200 bg-slate-950 px-3 py-2 text-left text-xs font-medium leading-5 text-white shadow-lg group-hover/tooltip:block group-focus-within/tooltip:block">
                {text}
            </span>
        </span>
    );
}

export default function SmmHesaplama() {
    const [form, setForm] = useState<FormState>(defaultState);
    const [debouncedTutar, setDebouncedTutar] = useState(defaultState.tutar);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const stored = readStoredState();
        setForm(stored);
        setDebouncedTutar(stored.tutar);
        setHydrated(true);
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedTutar(form.tutar), 300);
        return () => window.clearTimeout(timer);
    }, [form.tutar]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, [form, hydrated]);

    const inputs = useMemo<SmmInputs>(() => ({
        tutar: parseNumber(debouncedTutar),
        tutarTipi: form.tutarTipi,
        meslek: form.meslek,
        kdvOrani: form.kdvOrani,
        stopajOrani: parseNumber(form.stopajOrani),
    }), [debouncedTutar, form.kdvOrani, form.meslek, form.stopajOrani, form.tutarTipi]);

    const result = useMemo(() => hesapla(inputs), [inputs]);
    const stopajInfo = useMemo(() => getMeslekStopaj(form.meslek), [form.meslek]);
    const validationMessage = useMemo(() => {
        if (form.tutar.trim() === "") {
            return "Tutar alanı boş bırakılamaz.";
        }
        if (parseNumber(form.tutar) <= 0) {
            return "Pozitif bir tutar girin.";
        }
        if (parseNumber(form.stopajOrani) < 0 || parseNumber(form.stopajOrani) >= 100) {
            return "Stopaj oranı 0 ile 100 arasında olmalıdır.";
        }
        return "";
    }, [form.stopajOrani, form.tutar]);

    const setMeslek = (meslek: SmmMeslek) => {
        const nextStopaj = getMeslekStopaj(meslek);
        setForm((current) => ({
            ...current,
            meslek,
            stopajOrani: String(nextStopaj.oran),
        }));
    };

    const reset = () => {
        setForm(defaultState);
        setDebouncedTutar(defaultState.tutar);
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <section id="smm-araci" aria-labelledby="smm-calculator-heading" className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Canlı hesaplama</p>
                    <h2 id="smm-calculator-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                        Serbest Meslek Makbuzu Hesaplama Aracı
                    </h2>
                </div>
                <p className="text-sm font-semibold text-slate-600">Girdiler yalnızca bu oturumda saklanır.</p>
            </div>

            <div className="mt-6 grid gap-6">
                <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                    <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.95fr)_minmax(0,1.35fr)] lg:items-start">
                        <div className="space-y-5">
                            <SmmMeslekSecici value={form.meslek} onChange={setMeslek} />

                            <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <legend className="px-1 text-sm font-black text-slate-950">Tutar tipi</legend>
                                <div className="mt-3 grid gap-2">
                                    {tutarTipleri.map((option) => {
                                        const isActive = form.tutarTipi === option.value;
                                        return (
                                            <label
                                                key={option.value}
                                                className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 transition ${isActive ? "border-[#CC4A1A] bg-orange-50 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="smm-tutar-tipi"
                                                    value={option.value}
                                                    checked={isActive}
                                                    onChange={() => setForm((current) => ({ ...current, tutarTipi: option.value }))}
                                                    className="mt-1 h-4 w-4 shrink-0 accent-[#CC4A1A]"
                                                />
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-black leading-5">{option.label}</span>
                                                    <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{option.help}</span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="smm-tutar" className="text-sm font-black text-slate-950">
                                    {getAmountLabel(form.tutarTipi)}
                                </label>
                                <input
                                    id="smm-tutar"
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    step="0.01"
                                    value={form.tutar}
                                    aria-invalid={Boolean(validationMessage)}
                                    aria-describedby="smm-tutar-hata"
                                    onChange={(event) => setForm((current) => ({ ...current, tutar: event.target.value }))}
                                    className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-bold text-slate-950 outline-none transition focus-visible:border-[#CC4A1A] focus-visible:ring-4 focus-visible:ring-orange-100"
                                />
                                <span id="smm-tutar-hata" role="alert" aria-live="polite" className="mt-1 block min-h-5 text-xs font-bold text-red-700">
                                    {validationMessage}
                                </span>
                            </div>

                            <section aria-labelledby="smm-oran-heading" className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <h3 id="smm-oran-heading" className="text-base font-black text-slate-950">Oranlar</h3>
                                <div className="mt-3 grid gap-3">
                                    <div>
                                        <label htmlFor="smm-kdv" className="flex items-center justify-between gap-2 text-sm font-black text-slate-950">
                                            <span>KDV Oranı</span>
                                            <Tooltip text="Sık kullanılan oranlar gösterilir. Hizmet türü ve istisna durumuna göre oranı kontrol edin." />
                                        </label>
                                        <select
                                            id="smm-kdv"
                                            value={form.kdvOrani}
                                            onChange={(event) => setForm((current) => ({ ...current, kdvOrani: Number(event.target.value) }))}
                                            className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-bold text-slate-950 outline-none transition focus-visible:border-[#CC4A1A] focus-visible:ring-4 focus-visible:ring-orange-100"
                                        >
                                            {KDV_ORANLARI.map((rate) => (
                                                <option key={rate} value={rate}>%{rate}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="smm-stopaj" className="flex items-center justify-between gap-2 text-sm font-black text-slate-950">
                                            <span>Stopaj Oranı</span>
                                            <Tooltip text="Meslek seçimine göre otomatik dolar. Özel durumunuz varsa oranı manuel değiştirebilirsiniz." />
                                        </label>
                                        <input
                                            id="smm-stopaj"
                                            type="number"
                                            inputMode="decimal"
                                            min={0}
                                            max={99}
                                            step="0.01"
                                            value={form.stopajOrani}
                                            onChange={(event) => setForm((current) => ({ ...current, stopajOrani: event.target.value }))}
                                            className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-bold text-slate-950 outline-none transition focus-visible:border-[#CC4A1A] focus-visible:ring-4 focus-visible:ring-orange-100"
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                                    Otomatik oran: %{stopajInfo.oran.toLocaleString("tr-TR")} ({stopajInfo.aciklama}).
                                </p>
                            </section>

                            <button
                                type="button"
                                onClick={reset}
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                            >
                                <RotateCcw size={17} aria-hidden="true" />
                                Varsayılanlara dön
                            </button>
                        </div>

                        <div className="space-y-5 lg:sticky lg:top-24">
                            {ADSENSE_CLIENT && MID_AD_SLOT ? (
                                <AdUnit
                                    dataAdClient={ADSENSE_CLIENT}
                                    dataAdSlot={MID_AD_SLOT}
                                    minHeight="250px"
                                    className="my-0"
                                />
                            ) : null}
                            <SmmSonucKarti result={result} kdvOrani={form.kdvOrani} stopajOrani={parseNumber(form.stopajOrani)} />
                        </div>
                    </div>
                </form>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
                <SmmOzetTablosu result={result} kdvOrani={form.kdvOrani} stopajOrani={parseNumber(form.stopajOrani)} />
                <SmmScenarioTable
                    currentAmount={parseNumber(debouncedTutar)}
                    kdvOrani={form.kdvOrani}
                    stopajOrani={parseNumber(form.stopajOrani)}
                    onSelectAmount={(amount) => {
                        setForm((current) => ({ ...current, tutarTipi: "brut", tutar: String(amount) }));
                        setDebouncedTutar(String(amount));
                    }}
                />
            </div>
        </section>
    );
}
