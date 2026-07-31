"use client";

import dynamic from "next/dynamic";

const OggCalculator = dynamic(() => import("./OggCalculator"), {
    ssr: false,
    loading: () => (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 space-y-3">
                <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
            </div>
        </div>
    ),
});

export default function OggCalculatorLoader() {
    return <OggCalculator />;
}
