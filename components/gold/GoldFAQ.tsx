"use client";

import { useState } from "react";
import { goldFaqItems } from "@/lib/gold/goldSeoContent";

export default function GoldFAQ() {
    const [openItems, setOpenItems] = useState(() => new Set(goldFaqItems.map((_, index) => index)));

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
        <section aria-labelledby="altin-faq" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="altin-faq" className="text-2xl font-black tracking-tight text-slate-950">Sıkça Sorulan Sorular</h2>
            <div className="mt-5 space-y-3">
                {goldFaqItems.map((item, index) => (
                    <div key={item.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <button
                            type="button"
                            id={`gold-faq-button-${index}`}
                            aria-expanded={openItems.has(index)}
                            aria-controls={`gold-faq-panel-${index}`}
                            onClick={() => toggleItem(index)}
                            className="flex w-full items-start justify-between gap-4 text-left text-base font-black text-slate-950"
                        >
                            {item.question}
                            <span aria-hidden="true" className="text-[#B84418]">{openItems.has(index) ? "-" : "+"}</span>
                        </button>
                        <div
                            id={`gold-faq-panel-${index}`}
                            role="region"
                            aria-labelledby={`gold-faq-button-${index}`}
                            hidden={!openItems.has(index)}
                            className="mt-3 text-sm leading-6 text-slate-700"
                        >
                            {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
