import { ArrowRight, MessageSquareText } from "lucide-react";
import TrackedLink from "@/components/analytics/TrackedLink";
import { CORPORATE_CONTACT_PATH } from "@/lib/corporate-services";

export default function CorporateCta({ title = "Projenizi birlikte netleştirelim", service }: { title?: string; service?: string }) {
    const href = service ? `${CORPORATE_CONTACT_PATH}&hizmet=${encodeURIComponent(service)}` : CORPORATE_CONTACT_PATH;
    return (
        <section className="min-w-0 max-w-full rounded-3xl bg-gradient-to-br from-[#352018] via-[#743920] to-[#CC4A1A] px-6 py-10 text-white shadow-xl sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="min-w-0 max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-100">İlk görüşme</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
                <p className="mt-3 leading-relaxed text-orange-50">İhtiyacınızı, mevcut sistemlerinizi ve önceliklerinizi anlatın. Uygun yaklaşımı ve sonraki adımı birlikte değerlendirelim.</p>
            </div>
            <TrackedLink href={href} eventName="corporate_cta_click" analytics={{ source: service ?? "corporate" }} className="mt-6 inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-center font-bold text-[#9E3515] shadow-sm transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 lg:mt-0">
                <MessageSquareText size={19} aria-hidden="true" /> Projenizi Anlatın <ArrowRight size={18} aria-hidden="true" />
            </TrackedLink>
        </section>
    );
}
