type FaqItem = {
    question: string;
    answer: string;
};

export default function TakdirFaq({ items }: { items: FaqItem[] }) {
    return (
        <section aria-labelledby="takdir-faq-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="takdir-faq-heading" className="text-2xl font-black tracking-tight text-slate-950">
                Sıkça Sorulan Sorular
            </h2>
            <div className="mt-5 divide-y divide-slate-200">
                {items.map((item) => (
                    <details key={item.question} className="group py-4">
                        <summary className="cursor-pointer list-none text-base font-black text-slate-900 outline-none transition hover:text-[#B84418] focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25">
                            {item.question}
                            <span className="float-right ml-4 text-[#B84418]" aria-hidden="true">
                                +
                            </span>
                        </summary>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
