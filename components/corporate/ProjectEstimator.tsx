"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Printer } from "lucide-react";
import { calculateProjectEstimate, projectEstimatorOptions, type ProjectEstimatorInput } from "@/lib/project-estimator";
import { saveProjectEstimate } from "@/lib/project-estimator-storage";
import { trackProjectEstimatorEvent } from "@/lib/project-estimator-analytics";

type Draft = Partial<Omit<ProjectEstimatorInput, "coreNeeds" | "extras">> & { coreNeeds: ProjectEstimatorInput["coreNeeds"]; extras: ProjectEstimatorInput["extras"] };
const initialDraft: Draft = { coreNeeds: [], extras: [] };
const stepTitles = ["İhtiyaç türü", "Platform", "Temel ihtiyaçlar", "Entegrasyon", "Veri aktarımı", "Kullanıcı ve rol yapısı", "Ek gereksinimler"];

export default function ProjectEstimator() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [draft, setDraft] = useState<Draft>(initialDraft);
    const [storageError, setStorageError] = useState("");
    const complete = step === stepTitles.length;
    const result = useMemo(() => complete && isComplete(draft) ? calculateProjectEstimate(draft) : null, [complete, draft]);
    const analyticsParams = (scope = result?.level ?? "") => ({
        project_type: draft.projectType ?? "",
        platform_group: draft.platform ?? "",
        scope_level: scope,
        integration_level: draft.integration ?? "",
    });
    const markStarted = () => trackProjectEstimatorEvent("project_estimator_start", analyticsParams(), "project-estimator-v1");

    function selectSingle<K extends "projectType" | "platform" | "integration" | "migration" | "users">(key: K, value: NonNullable<Draft[K]>) {
        markStarted();
        setDraft((current) => ({ ...current, [key]: value }));
    }
    function toggleMulti<K extends "coreNeeds" | "extras">(key: K, value: Draft[K][number]) {
        markStarted();
        setDraft((current) => {
            const values = current[key] as string[];
            return { ...current, [key]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] };
        });
    }
    function next() {
        if (!canContinue(step, draft)) return;
        if (step === stepTitles.length - 1 && isComplete(draft)) {
            const estimate = calculateProjectEstimate(draft);
            trackProjectEstimatorEvent("project_estimator_complete", analyticsParams(estimate.level), "project-estimator-v1");
        }
        setStep((current) => Math.min(stepTitles.length, current + 1));
    }
    function createRequest() {
        if (!result || !saveProjectEstimate(window.sessionStorage, result.summary)) {
            setStorageError("Proje özeti geçici olarak saklanamadı. Lütfen tarayıcı ayarlarınızı kontrol edin.");
            return;
        }
        trackProjectEstimatorEvent("project_estimator_cta_click", analyticsParams(result.level), "project-estimator-v1");
        router.push("/iletisim?konu=kurumsal-yazilim&hizmet=%C3%96zel%20yaz%C4%B1l%C4%B1m%20geli%C5%9Ftirme&kaynak=%2Fkurumsal%2Fyazilim-projesi-kapsam-hesaplama");
    }

    return <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900" aria-labelledby="estimator-title">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-700 dark:bg-slate-950 sm:px-8">
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-[#B83A12] dark:text-orange-300">{complete ? "Ön değerlendirme hazır" : `Adım ${step + 1} / ${stepTitles.length}`}</p><h2 id="estimator-title" className="mt-1 text-xl font-black text-slate-950 dark:text-white">{complete ? "Proje kapsamı sonucu" : stepTitles[step]}</h2></div><span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{complete ? "%100" : `%${Math.round(((step + 1) / stepTitles.length) * 100)}`}</span></div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" aria-hidden="true"><div className="h-full rounded-full bg-[#B83A12] transition-all" style={{ width: complete ? "100%" : `${((step + 1) / stepTitles.length) * 100}%` }} /></div>
        </div>
        <div className="min-w-0 p-5 sm:p-8">
            {!complete ? <div className="min-w-0">
                {step === 0 && <SingleOptions name="projectType" options={projectEstimatorOptions.projectType} value={draft.projectType} onChange={(value) => selectSingle("projectType", value as NonNullable<Draft["projectType"]>)} />}
                {step === 1 && <SingleOptions name="platform" options={projectEstimatorOptions.platform} value={draft.platform} onChange={(value) => selectSingle("platform", value as NonNullable<Draft["platform"]>)} />}
                {step === 2 && <MultiOptions name="coreNeeds" options={projectEstimatorOptions.coreNeeds} values={draft.coreNeeds} onChange={(value) => toggleMulti("coreNeeds", value as Draft["coreNeeds"][number])} />}
                {step === 3 && <SingleOptions name="integration" options={projectEstimatorOptions.integration} value={draft.integration} onChange={(value) => selectSingle("integration", value as NonNullable<Draft["integration"]>)} />}
                {step === 4 && <SingleOptions name="migration" options={projectEstimatorOptions.migration} value={draft.migration} onChange={(value) => selectSingle("migration", value as NonNullable<Draft["migration"]>)} />}
                {step === 5 && <SingleOptions name="users" options={projectEstimatorOptions.users} value={draft.users} onChange={(value) => selectSingle("users", value as NonNullable<Draft["users"]>)} />}
                {step === 6 && <MultiOptions name="extras" options={projectEstimatorOptions.extras} values={draft.extras} onChange={(value) => toggleMulti("extras", value as Draft["extras"][number])} optional />}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 font-bold text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200"><ArrowLeft size={17} /> Geri</button><button type="button" onClick={next} disabled={!canContinue(step, draft)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B83A12] px-5 font-bold text-white hover:bg-[#962F10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-40">{step === stepTitles.length - 1 ? "Sonucu Gör" : "İleri"} <ArrowRight size={17} /></button></div>
            </div> : result ? <Result result={result} onBack={() => setStep(stepTitles.length - 1)} onCreateRequest={createRequest} storageError={storageError} /> : null}
        </div>
    </section>;
}

type OptionTuple = readonly [string, string, number];
function SingleOptions({ name, options, value, onChange }: { name: string; options: readonly OptionTuple[]; value?: string; onChange: (value: string) => void }) {
    return <fieldset><legend className="sr-only">Bir seçenek belirleyin</legend><div className="grid min-w-0 gap-3 sm:grid-cols-2">{options.map(([key, label]) => <label key={key} className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border p-4 font-semibold transition focus-within:ring-4 focus-within:ring-orange-200 ${value === key ? "border-[#B83A12] bg-orange-50 text-[#8F2D0F] dark:border-orange-400 dark:bg-orange-950/40 dark:text-orange-200" : "border-slate-200 text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:text-slate-200"}`}><input type="radio" name={name} value={key} checked={value === key} onChange={() => onChange(key)} className="h-4 w-4 accent-[#B83A12]" /><span className="min-w-0 break-words">{label}</span></label>)}</div></fieldset>;
}
function MultiOptions({ name, options, values, onChange, optional = false }: { name: string; options: readonly OptionTuple[]; values: readonly string[]; onChange: (value: string) => void; optional?: boolean }) {
    return <fieldset><legend className="mb-4 text-sm text-slate-600 dark:text-slate-300">{optional ? "İlgili olanları seçin; gerekmiyorsa boş bırakabilirsiniz." : "Bir veya daha fazla seçenek belirleyin."}</legend><div className="grid min-w-0 gap-3 sm:grid-cols-2">{options.map(([key, label]) => <label key={key} className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border p-4 font-semibold transition focus-within:ring-4 focus-within:ring-orange-200 ${values.includes(key) ? "border-[#B83A12] bg-orange-50 text-[#8F2D0F] dark:border-orange-400 dark:bg-orange-950/40 dark:text-orange-200" : "border-slate-200 text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:text-slate-200"}`}><input type="checkbox" name={name} value={key} checked={values.includes(key)} onChange={() => onChange(key)} className="h-4 w-4 rounded accent-[#B83A12]" /><span className="min-w-0 break-words">{label}</span></label>)}</div></fieldset>;
}
function Result({ result, onBack, onCreateRequest, storageError }: { result: ReturnType<typeof calculateProjectEstimate>; onBack: () => void; onCreateRequest: () => void; storageError: string }) {
    const cards = [["Tahmini süre", result.duration], ["Önerilen çözüm", result.solutionType], ["Önerilen ilk faz / MVP", result.firstPhase], ["Bakım ve destek", result.maintenance]];
    return <div className="min-w-0 print:text-black"><div className="rounded-2xl bg-gradient-to-br from-[#5D2D1C] to-[#B83A12] p-6 text-white"><p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-100">Kapsam seviyesi</p><h3 className="mt-2 text-3xl font-black">{result.level}</h3><p className="mt-3 text-sm leading-relaxed text-orange-50">{result.duration}. Bu süre yalnız ön değerlendirmedir; kesin teklif, garanti veya teslim sözü değildir.</p></div><div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">{cards.map(([title, text]) => <div key={title} className="min-w-0 rounded-2xl border border-slate-200 p-5 dark:border-slate-700"><h4 className="font-black text-slate-950 dark:text-white">{title}</h4><p className="mt-2 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</p></div>)}</div><div className="mt-5 grid gap-4 lg:grid-cols-2"><ResultList title="Kritik teknik başlıklar" items={result.technicalTopics} /><ResultList title="Muhtemel ekip bileşimi" items={result.team} note="Roller proje kapsamına göre aynı ekip üyesi tarafından üstlenilebilir; liste kişi sayısı taahhüdü değildir." /></div><div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950"><h4 className="font-black text-slate-950 dark:text-white">Proje özeti</h4><pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-200">{result.summary}</pre></div>{storageError && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{storageError}</p>}<div className="mt-6 flex flex-col gap-3 print:hidden sm:flex-row"><button type="button" onClick={onBack} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 font-bold text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 dark:border-slate-600 dark:text-slate-200"><ArrowLeft size={17} /> Seçimleri düzenle</button><button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 font-bold text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 dark:border-slate-600 dark:text-slate-200"><Printer size={17} /> Yazdır</button><button type="button" onClick={onCreateRequest} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B83A12] px-5 text-center font-bold text-white hover:bg-[#962F10] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300">Bu kapsam için görüşme talebi oluştur <ArrowRight size={17} /></button></div></div>;
}
function ResultList({ title, items, note }: { title: string; items: string[]; note?: string }) { return <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700"><h4 className="font-black text-slate-950 dark:text-white">{title}</h4><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><Check size={16} className="mt-0.5 shrink-0 text-[#B83A12]" />{item}</li>)}</ul>{note ? <p className="mt-4 border-t border-slate-200 pt-3 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300 print:text-slate-700">{note}</p> : null}</div>; }
function canContinue(step: number, draft: Draft) { return [Boolean(draft.projectType), Boolean(draft.platform), draft.coreNeeds.length > 0, Boolean(draft.integration), Boolean(draft.migration), Boolean(draft.users), true][step] ?? false; }
function isComplete(draft: Draft): draft is ProjectEstimatorInput { return Boolean(draft.projectType && draft.platform && draft.coreNeeds.length && draft.integration && draft.migration && draft.users); }
