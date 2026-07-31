"use client";

import dynamic from "next/dynamic";

const TakdirCalculator = dynamic(() => import("./TakdirCalculator"), {
    ssr: false,
    loading: () => (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" aria-label="Hesaplayıcı yükleniyor">
            <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 space-y-3">
                <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
        </div>
    ),
});

export default function TakdirCalculatorLoader() {
    return <TakdirCalculator />;
}
