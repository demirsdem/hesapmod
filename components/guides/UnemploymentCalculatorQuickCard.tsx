"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, ChevronRight } from "lucide-react";

const calculatorPath = "/muhasebe/issizlik-maasi-hesaplama";

function toGrossParam(value: string) {
    const parsed = Number.parseFloat(value.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return "33030";
    }

    return String(Math.round(parsed));
}

export default function UnemploymentCalculatorQuickCard() {
    const [gross, setGross] = useState("55000");
    const [days, setDays] = useState("900");

    const href = useMemo(() => {
        const params = new URLSearchParams({
            gross: toGrossParam(gross),
            days,
        });

        return `${calculatorPath}?${params.toString()}`;
    }, [days, gross]);

    return (
        <section className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-sm md:p-6" aria-labelledby="quick-unemployment-calculator-heading">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        <Calculator size={15} aria-hidden="true" />
                        Hemen Hesapla
                    </div>
                    <h2 id="quick-unemployment-calculator-heading" className="text-2xl font-extrabold tracking-tight text-slate-950">
                        İşsizlik maaşınızı hesaplayın
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Son 4 aylık brüt ücretinizi ve prim gününüzü girin; hesaplama aracını bu bilgilerle açalım.
                    </p>
                </div>

                <div className="grid w-full gap-3 lg:max-w-xl lg:grid-cols-[1fr_150px_auto]">
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-700">Son 4 ay ortalama brüt ücret</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step={100}
                            value={gross}
                            onChange={(event) => setGross(event.target.value)}
                            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-700">Prim günü</span>
                        <select
                            value={days}
                            onChange={(event) => setDays(event.target.value)}
                            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="600">600-899</option>
                            <option value="900">900-1079</option>
                            <option value="1080">1080+</option>
                        </select>
                    </label>

                    <Link
                        href={href}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 lg:self-end"
                    >
                        Hemen Hesapla
                        <ChevronRight size={17} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
