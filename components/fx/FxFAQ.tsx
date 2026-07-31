"use client";

import { useState } from "react";
import { fxFaqItems } from "@/lib/fx/fxSeoContent";

export default function FxFAQ() {
    const [openItems, setOpenItems] = useState(() => new Set(fxFaqItems.map((_, index) => index)));

    const toggleItem = (index: number) => {
        setOpenItems((current) => {
            const next = new Set(current);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    return (
        <section aria-labelledby="doviz-faq" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="doviz-faq" className="text-2xl font-black tracking-tight text-slate-950">Sıkça Sorulan Sorular</h2>
            <div className="mt-5 space-y-3">
                {fxFaqItems.map(([question, answer], index) => (
                    <div key={question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <button
                            type="button"
                            id={`fx-faq-button-${index}`}
                            aria-expanded={openItems.has(index)}
                            aria-controls={`fx-faq-panel-${index}`}
                            onClick={() => toggleItem(index)}
                            className="flex w-full items-start justify-between gap-4 text-left text-base font-black text-slate-950"
                        >
                            {question}
                            <span aria-hidden="true" className="text-[#B84418]">{openItems.has(index) ? "-" : "+"}</span>
                        </button>
                        <div
                            id={`fx-faq-panel-${index}`}
                            role="region"
                            aria-labelledby={`fx-faq-button-${index}`}
                            hidden={!openItems.has(index)}
                            className="mt-3 text-sm leading-6 text-slate-700"
                        >
                            {answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
