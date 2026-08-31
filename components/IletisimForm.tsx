"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CONTACT_RESPONSE_SLA, CORPORATE_CONTACT_SUBJECT } from "@/lib/contact";
import { corporateServices } from "@/lib/corporate-services";
import { businessSolutions } from "@/lib/business-solutions";
import { trackCorporateEvent } from "@/lib/corporate-analytics";
import { normalizeLeadSource, type LeadSource } from "@/lib/contact-lead-source";
import { prefillProjectSummary } from "@/lib/project-estimator-storage";

type FormState = { name: string; company: string; email: string; phone: string; subject: string; service: string; message: string; contactPreference: string; consent: boolean };

export default function IletisimForm({ corporate = false, initialService = "", leadSource = {} }: { corporate?: boolean; initialService?: string; leadSource?: LeadSource }) {
    const allowedServiceValues = [...corporateServices.map((service) => service.shortTitle), ...businessSolutions.map((solution) => solution.cta.serviceValue)];
    const safeInitialService = allowedServiceValues.includes(initialService) ? initialService : "";
    const [form, setForm] = useState<FormState>({ name: "", company: "", email: "", phone: "", subject: corporate ? CORPORATE_CONTACT_SUBJECT : "", service: safeInitialService, message: "", contactPreference: "E-posta", consent: false });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const formStarted = useRef(false);
    const leadEventSent = useRef(false);
    const safeAnalyticsSource = normalizeLeadSource(leadSource as Record<string, unknown>);
    const sourcePath = safeAnalyticsSource.valid ? safeAnalyticsSource.value.sourcePath ?? "/iletisim" : "/iletisim";
    const eventParams = () => ({
        form_type: corporate ? "corporate" : "general",
        service: form.service,
        solution_slug: businessSolutions.find(solution => solution.cta.serviceValue === form.service)?.slug ?? "",
        source_path: sourcePath,
        cta_location: "contact_form",
    });
    const trackFormStart = () => {
        if (!corporate || formStarted.current) return;
        formStarted.current = trackCorporateEvent("corporate_form_start", eventParams());
    };
    const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
    const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#B83A12] focus:ring-2 focus:ring-orange-200";

    useEffect(() => {
        if (!corporate) return;
        try {
            setForm((current) => {
                const prefill = prefillProjectSummary(current.message, window.sessionStorage);
                return prefill.applied ? { ...current, message: prefill.message } : current;
            });
        } catch {
            // Storage can be unavailable in privacy-restricted browsers; the form remains usable.
        }
    }, [corporate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;
        if (!form.consent) { setError("Formu göndermek için KVKK aydınlatma metnini okuyup onaylamalısınız."); if (corporate) trackCorporateEvent("corporate_form_error", eventParams()); return; }
        setLoading(true); setError("");
        try {
            const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, ...leadSource }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
            setSent(true);
            if (corporate && !leadEventSent.current) {
                leadEventSent.current = trackCorporateEvent("generate_lead", eventParams());
            }
        } catch (err: unknown) { setError(err instanceof Error ? err.message : "Mesaj gönderilemedi. Lütfen sonra tekrar deneyin."); if (corporate) trackCorporateEvent("corporate_form_error", eventParams()); }
        finally { setLoading(false); }
    }

    return <div className="grid min-w-0 max-w-full grid-cols-1 gap-12 lg:grid-cols-5"><div className="min-w-0 lg:col-span-3">
        {sent ? <div role="status" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center"><div className="text-4xl" aria-hidden="true">✓</div><h2 className="mt-4 text-2xl font-bold">Mesajınız alındı</h2><p className="mt-2 text-slate-600">Teşekkürler. Genellikle {CONTACT_RESPONSE_SLA} içinde dönüş yapıyoruz.</p><button type="button" onClick={() => { setSent(false); formStarted.current = false; leadEventSent.current = false; }} className="mt-6 rounded-lg px-3 py-2 text-sm font-bold text-[#B83A12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A12]">Yeni mesaj gönder</button></div> :
        <form onSubmit={handleSubmit} onFocusCapture={trackFormStart} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {error ? <div id="contact-form-error" role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}
            {corporate ? <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-relaxed text-orange-950"><strong>Kurumsal proje formu:</strong> Bildiğiniz alanları doldurmanız ilk değerlendirmeyi hızlandırır.</div> : null}
            <div className="grid gap-6 sm:grid-cols-2"><Field label="Ad soyad" htmlFor="contact-name" required><input id="contact-name" autoComplete="name" required maxLength={120} value={form.name} onChange={e=>update("name",e.target.value)} className={`${inputClass} h-11`} /></Field><Field label={corporate ? "Kurumsal e-posta" : "E-posta"} htmlFor="contact-email" required><input id="contact-email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={e=>update("email",e.target.value)} className={`${inputClass} h-11`} /></Field>{corporate ? <><Field label="Firma (isteğe bağlı)" htmlFor="contact-company"><input id="contact-company" autoComplete="organization" maxLength={160} value={form.company} onChange={e=>update("company",e.target.value)} className={`${inputClass} h-11`} /></Field><Field label="Telefon (isteğe bağlı)" htmlFor="contact-phone"><input id="contact-phone" type="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={e=>update("phone",e.target.value)} className={`${inputClass} h-11`} /></Field></> : null}</div>
            {corporate ? <div className="grid gap-6 sm:grid-cols-2"><Field label="İlgilenilen hizmet veya çözüm" htmlFor="contact-service"><select id="contact-service" value={form.service} onChange={e=>update("service",e.target.value)} className={`${inputClass} h-11`}><option value="">Henüz net değil</option><optgroup label="İşletme çözümleri">{businessSolutions.map(solution=><option key={solution.slug} value={solution.cta.serviceValue}>{solution.shortTitle}</option>)}</optgroup><optgroup label="Kurumsal hizmetler">{corporateServices.map(service=><option key={service.slug} value={service.shortTitle}>{service.shortTitle}</option>)}</optgroup></select></Field><Field label="Tercih edilen iletişim" htmlFor="contact-preference"><select id="contact-preference" value={form.contactPreference} onChange={e=>update("contactPreference",e.target.value)} className={`${inputClass} h-11`}><option>E-posta</option><option>Telefon</option><option>Fark etmez</option></select></Field></div> : <Field label="Konu" htmlFor="contact-subject"><input id="contact-subject" maxLength={160} value={form.subject} onChange={e=>update("subject",e.target.value)} className={`${inputClass} h-11`} /></Field>}
            <Field label={corporate ? "Proje açıklaması" : "Mesaj"} htmlFor="contact-message" required><textarea id="contact-message" required maxLength={5000} rows={7} value={form.message} onChange={e=>update("message",e.target.value)} className={`${inputClass} resize-y py-3`} placeholder={corporate ? "İhtiyacı, mevcut süreci, kullanıcıları ve varsa hedef tarihi kısaca anlatın." : "Mesajınızı buraya yazın..."} /></Field>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600"><input type="checkbox" required checked={form.consent} onChange={e=>update("consent",e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#B83A12]" /><span><Link href="/kvkk" className="font-semibold text-[#B83A12] underline">KVKK Aydınlatma Metni</Link>&apos;ni ve <Link href="/gizlilik-politikasi" className="font-semibold text-[#B83A12] underline">Gizlilik Politikası</Link>&apos;nı okudum; iletişim talebimin işlenmesini onaylıyorum. <span className="text-red-700">*</span></span></label>
            <button type="submit" disabled={loading} aria-describedby={error ? "contact-form-error" : undefined} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#B83A12] px-5 py-3 font-bold text-white transition hover:bg-[#962F10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-60" aria-busy={loading}>{loading ? "Gönderiliyor…" : "Mesaj Gönder →"}</button>
        </form>}
    </div><aside className="space-y-6 lg:col-span-2"><div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">İletişim süreci</h2><Info title="Form üzerinden" text="Talebiniz güvenli biçimde ekibimize iletilir." /><Info title="Yanıt süresi" text={`Genellikle ${CONTACT_RESPONSE_SLA} içinde dönüş yapıyoruz.`} /><Info title="Gizlilik" text="İletişim verileri yalnızca talebinizi değerlendirmek ve size dönüş yapmak için kullanılır." /></div><div className="rounded-3xl border border-slate-200 bg-slate-100 p-6"><h3 className="font-bold">Not</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Hesaplama araçlarındaki girdiler bu form üzerinden gönderilmez. Form yalnızca yazdığınız iletişim bilgilerini ve mesajı iletir.</p></div></aside></div>;
}

function Field({ label, htmlFor, required, children }: { label: string; htmlFor: string; required?: boolean; children: React.ReactNode }) { return <div className="min-w-0 max-w-full"><label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-slate-800">{label}{required ? <span className="text-red-700"> *</span> : null}</label>{children}</div>; }
function Info({ title, text }: { title: string; text: string }) { return <div><p className="text-sm font-bold text-slate-900">{title}</p><p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p></div>; }
