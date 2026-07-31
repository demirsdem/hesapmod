"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import DersRow, { type DersFormRow, type DersRowErrors } from "./DersRow";
import LevelSelector, { type SchoolLevel } from "./LevelSelector";
import ResultCard from "./ResultCard";
import { hesapla, type DersGirdisi } from "../lib/takdir-calc";

type FieldName = "ad" | "not" | "saat";
type TouchedMap = Record<number, Partial<Record<FieldName, boolean>>>;

const PAGE_PATH = "/sinav-hesaplamalari/takdir-tesekkur-hesaplama";
const minRows = 2;
const maxRows = 20;

function emptyRows(): DersFormRow[] {
    return [
        { id: 1, ad: "", not: "", saat: "" },
        { id: 2, ad: "", not: "", saat: "" },
    ];
}

function parseLevel(value: string | null): SchoolLevel {
    return value === "lise" ? "lise" : "ortaokul";
}

function integerError(value: string, min: number, max: number, label: string, touched: boolean) {
    if (!touched) {
        return "";
    }

    if (value.trim() === "") {
        return `${label} boş bırakılamaz.`;
    }

    if (!/^\d+$/.test(value.trim())) {
        return "Yalnızca tam sayı girin.";
    }

    const parsed = Number(value);
    if (parsed < min || parsed > max) {
        return `${label} ${min} ile ${max} arasında olmalıdır.`;
    }

    return "";
}

function isIntegerInRange(value: string, min: number, max: number) {
    if (!/^\d+$/.test(value.trim())) {
        return false;
    }

    const parsed = Number(value);
    return parsed >= min && parsed <= max;
}

function readRowsFromParams(params: URLSearchParams): DersFormRow[] {
    const encoded = params.get("d");
    if (!encoded) {
        return emptyRows();
    }

    const rows = encoded
        .split("|")
        .slice(0, maxRows)
        .map((part, index) => {
            const [notValue, saatValue, adValue] = part.split(",");
            return {
                id: index + 1,
                ad: adValue ? decodeURIComponent(adValue).slice(0, 48) : "",
                not: isIntegerInRange(notValue || "", 0, 100) ? notValue : "",
                saat: isIntegerInRange(saatValue || "", 1, 10) ? saatValue : "",
            };
        })
        .filter((row) => row.not !== "" || row.saat !== "" || row.ad !== "");

    while (rows.length < minRows) {
        rows.push({ id: rows.length + 1, ad: "", not: "", saat: "" });
    }

    return rows;
}

function buildNumericRows(rows: DersFormRow[]): DersGirdisi[] {
    return rows.map((row, index) => ({
        ad: row.ad.trim() || `${index + 1}. Ders`,
        not: Number(row.not),
        saat: Number(row.saat),
    }));
}

export default function TakdirCalculator() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resultRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement | null>(null);
    const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
    const idCounterRef = useRef(maxRows + 1);
    const initializedScrollRef = useRef(false);

    const initialParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
    const [level, setLevel] = useState<SchoolLevel>(() => parseLevel(initialParams.get("seviye") || initialParams.get("sev")));
    const [rows, setRows] = useState<DersFormRow[]>(() => readRowsFromParams(initialParams));
    const [devamsizlik, setDevamsizlik] = useState(() => {
        const value = initialParams.get("dev") || "";
        return isIntegerInRange(value, 0, 180) ? value : "";
    });
    const [kinamaCezasi, setKinamaCezasi] = useState(() => initialParams.get("ceza") === "1");
    const [touched, setTouched] = useState<TouchedMap>({});
    const [devamsizlikTouched, setDevamsizlikTouched] = useState(false);
    const [shareStatus, setShareStatus] = useState("");

    const errors = useMemo(() => {
        const next: Record<number, DersRowErrors> = {};
        rows.forEach((row) => {
            next[row.id] = {
                not: integerError(row.not, 0, 100, "Not", Boolean(touched[row.id]?.not)),
                saat: integerError(row.saat, 1, 10, "Haftalık saat", Boolean(touched[row.id]?.saat)),
            };
        });
        return next;
    }, [rows, touched]);

    const devamsizlikError = integerError(devamsizlik, 0, 180, "Devamsızlık", devamsizlikTouched);
    const formGecerli =
        rows.length >= minRows &&
        rows.every((row) => isIntegerInRange(row.not, 0, 100) && isIntegerInRange(row.saat, 1, 10)) &&
        isIntegerInRange(devamsizlik, 0, 180);
    const hasAnyValue = rows.some((row) => row.not.trim() || row.saat.trim() || row.ad.trim()) || devamsizlik.trim() || kinamaCezasi;

    const result = useMemo(() => {
        if (!formGecerli) {
            return null;
        }

        return hesapla({
            dersler: buildNumericRows(rows),
            devamsizlik: Number(devamsizlik),
            kinamaCezasi,
        });
    }, [devamsizlik, formGecerli, kinamaCezasi, rows]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("seviye", level);
        router.replace(`${PAGE_PATH}?${params.toString()}`, { scroll: false });
    }, [level, router, searchParams]);

    useEffect(() => {
        if (!result) {
            initializedScrollRef.current = false;
            return;
        }

        if (!initializedScrollRef.current) {
            initializedScrollRef.current = true;
            return;
        }

        const timer = window.setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 140);

        return () => window.clearTimeout(timer);
    }, [result?.ortalama, result?.sonuc, result]);

    const touchAll = () => {
        const nextTouched: TouchedMap = {};
        rows.forEach((row) => {
            nextTouched[row.id] = { not: true, saat: true };
        });
        setTouched(nextTouched);
        setDevamsizlikTouched(true);
    };

    const updateRow = (id: number, field: FieldName, value: string) => {
        setShareStatus("");
        setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const markTouched = (id: number, field: FieldName) => {
        setTouched((current) => ({
            ...current,
            [id]: { ...current[id], [field]: true },
        }));
    };

    const addRow = () => {
        if (rows.length >= maxRows) {
            return;
        }

        const id = idCounterRef.current++;
        setRows((current) => [...current, { id, ad: "", not: "", saat: "" }]);
        window.setTimeout(() => inputRefs.current[id]?.focus(), 0);
    };

    const deleteRow = (id: number) => {
        if (rows.length <= minRows) {
            return;
        }

        const index = rows.findIndex((row) => row.id === id);
        const fallbackId = rows[Math.max(0, index - 1)]?.id;
        setRows((current) => current.filter((row) => row.id !== id));
        window.setTimeout(() => {
            if (fallbackId) {
                inputRefs.current[fallbackId]?.focus();
            }
        }, 0);
    };

    const reset = () => {
        setRows(emptyRows());
        setDevamsizlik("");
        setKinamaCezasi(false);
        setTouched({});
        setDevamsizlikTouched(false);
        setShareStatus("");
        setLevel("ortaokul");
        router.replace(`${PAGE_PATH}?seviye=ortaokul`, { scroll: false });
        window.setTimeout(() => firstInputRef.current?.focus(), 0);
    };

    const share = async () => {
        if (!result) {
            touchAll();
            return;
        }

        const params = new URLSearchParams();
        params.set("seviye", level);
        params.set(
            "d",
            rows
                .map((row) => `${Number(row.not)},${Number(row.saat)},${encodeURIComponent(row.ad.trim())}`)
                .join("|")
        );
        params.set("dev", String(Number(devamsizlik)));
        if (kinamaCezasi) {
            params.set("ceza", "1");
        }

        const nextPath = `${PAGE_PATH}?${params.toString()}`;
        router.replace(nextPath, { scroll: false });
        const shareUrl = `${window.location.origin}${nextPath}`;

        if (navigator.share) {
            await navigator.share({
                title: "Takdir Teşekkür Hesaplama",
                text: `Ortalama: ${result.ortalama.toFixed(2)} - ${result.sonuc}`,
                url: shareUrl,
            });
            return;
        }

        await navigator.clipboard?.writeText(shareUrl);
        setShareStatus("Sonuç bağlantısı panoya kopyalandı.");
    };

    return (
        <section aria-labelledby="takdir-calculator-heading" className="calculator-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Canlı hesaplama</p>
                <h2 id="takdir-calculator-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                    Takdir Teşekkür Hesaplama Aracı
                </h2>
            </div>

            <LevelSelector value={level} onChange={setLevel} />

            <div className="mt-6 space-y-3">
                {rows.map((row, index) => (
                    <DersRow
                        key={row.id}
                        ders={row}
                        index={index}
                        errors={errors[row.id] || {}}
                        canDelete={rows.length > minRows}
                        inputRef={(element) => {
                            inputRefs.current[row.id] = element;
                            if (index === 0) {
                                firstInputRef.current = element;
                            }
                        }}
                        onChange={updateRow}
                        onBlur={markTouched}
                        onDelete={deleteRow}
                    />
                ))}
            </div>

            <div className="ders-ekle-bar mt-4 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur sm:sticky sm:bottom-4">
                <button
                    type="button"
                    onClick={addRow}
                    disabled={rows.length >= maxRows}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#0F1F3D] px-4 text-sm font-black text-white transition hover:bg-[#14284f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus size={18} aria-hidden="true" />
                    Ders Ekle ({rows.length}/{maxRows})
                </button>
            </div>

            <div className="mt-5 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                    <label htmlFor="devamsizlik" className="text-sm font-bold text-slate-700">
                        Özürsüz Devamsızlık (gün)
                    </label>
                    <input
                        id="devamsizlik"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={180}
                        step={1}
                        value={devamsizlik}
                        onChange={(event) => {
                            setShareStatus("");
                            setDevamsizlik(event.target.value);
                        }}
                        onBlur={() => setDevamsizlikTouched(true)}
                        aria-invalid={Boolean(devamsizlikError)}
                        aria-describedby={devamsizlikError ? "devamsizlik-hata" : undefined}
                        className={`mt-1 min-h-[52px] w-full rounded-lg border bg-white px-3 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:ring-4 focus:ring-[#FF6B35]/20 ${
                            devamsizlikError ? "border-red-600 focus:border-red-700" : "border-slate-300 focus:border-[#B84418]"
                        }`}
                    />
                    {devamsizlikError && (
                        <span id="devamsizlik-hata" role="alert" aria-live="polite" className="mt-1 block text-xs font-bold text-red-700">
                            Hata: {devamsizlikError}
                        </span>
                    )}
                </div>
                <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-800">
                    <input
                        type="checkbox"
                        checked={kinamaCezasi}
                        onChange={(event) => {
                            setShareStatus("");
                            setKinamaCezasi(event.target.checked);
                        }}
                        aria-label="Bu dönem kınama cezası aldım"
                        className="h-5 w-5 accent-[#B84418]"
                    />
                    <span>Bu dönem kınama cezası aldım</span>
                </label>
            </div>

            <button
                type="button"
                disabled={!formGecerli}
                onClick={touchAll}
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-[#B84418] px-4 text-sm font-black text-white transition hover:bg-[#9F3A12] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
            >
                Hesapla
            </button>

            {!hasAnyValue && (
                <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
                    En az 2 dersin notunu ve saatini girerek başlayın.
                </p>
            )}

            <div ref={resultRef} className="mt-5 transition-opacity duration-200">
                {result ? (
                    <ResultCard
                        result={result}
                        onShare={share}
                        onPrint={() => window.print()}
                        onReset={reset}
                        shareStatus={shareStatus}
                    />
                ) : hasAnyValue ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-950">
                        Hata: Hesaplama için tüm not ve saat alanlarını geçerli tam sayılarla doldurun.
                    </p>
                ) : null}
            </div>
        </section>
    );
}
