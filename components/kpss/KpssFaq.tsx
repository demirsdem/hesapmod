"use client";

import { useState } from "react";

export type KpssFaqItem = {
    question: string;
    answer: string;
};

export default function KpssFaq({ items }: { items: KpssFaqItem[] }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="sss" aria-labelledby="faq-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="faq-heading" className="text-2xl font-black tracking-tight text-slate-950">
                Sıkça Sorulan Sorular
            </h2>
            <div className="mt-5 divide-y divide-slate-200">
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    const buttonId = `kpss-sss-${index}-btn`;
                    const panelId = `kpss-sss-${index}-content`;
                    return (
                        <div key={item.question} className="py-3">
                            <button
                                type="button"
                                id={buttonId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                className="flex min-h-11 w-full items-center justify-between gap-4 text-left text-base font-black text-slate-950 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#CC4A1A]"
                            >
                                <span>{item.question}</span>
                                <span aria-hidden="true" className="text-xl">{isOpen ? "-" : "+"}</span>
                            </button>
                            {isOpen && (
                                <div id={panelId} role="region" aria-labelledby={buttonId} className="mt-2 text-sm leading-7 text-slate-700">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
