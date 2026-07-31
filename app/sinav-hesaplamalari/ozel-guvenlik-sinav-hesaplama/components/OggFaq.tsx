import type { OggFaqItem } from "../schema";

type OggFaqProps = {
    items: OggFaqItem[];
};

export default function OggFaq({ items }: OggFaqProps) {
    return (
        <section aria-labelledby="ogg-faq-heading" className="mt-10">
            <h2 id="ogg-faq-heading" className="text-2xl font-black tracking-tight text-slate-900">
                ÖGG Sınav Hesaplama Sık Sorulan Sorular
            </h2>
            <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {items.map((item) => (
                    <details key={item.question} className="group p-5">
                        <summary className="cursor-pointer list-none text-base font-black text-slate-900 outline-none transition hover:text-[#CC4A1A] focus-visible:ring-4 focus-visible:ring-[#FF6B35]/20">
                            <span className="inline-flex w-full items-center justify-between gap-4">
                                {item.question}
                                <span className="text-xl leading-none text-[#FF6B35] group-open:rotate-45">+</span>
                            </span>
                        </summary>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
