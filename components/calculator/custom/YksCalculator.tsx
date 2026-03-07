"use client";

import React, { useMemo, useState } from "react";
import { BookOpenCheck, Calculator, CheckCircle2, GraduationCap, Languages, Sigma, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateYksScores, yksScoreTypeMeta, yksYearConfigs, type YksScoreType } from "@/lib/yks";

type PairField = {
    label: string;
    questionCount: number;
    correctId: string;
    wrongId: string;
};

const initialValues = {
    sinav_yili: "2025",
    tytTurkceD: 30,
    tytTurkceY: 5,
    tytSosyalD: 15,
    tytSosyalY: 3,
    tytMatD: 25,
    tytMatY: 2,
    tytFenD: 10,
    tytFenY: 2,
    aytMatD: 0,
    aytMatY: 0,
    aytEdebD: 0,
    aytEdebY: 0,
    aytTar1D: 0,
    aytTar1Y: 0,
    aytCog1D: 0,
    aytCog1Y: 0,
    aytTar2D: 0,
    aytTar2Y: 0,
    aytCog2D: 0,
    aytCog2Y: 0,
    aytFelsefeD: 0,
    aytFelsefeY: 0,
    aytDinD: 0,
    aytDinY: 0,
    aytFizikD: 0,
    aytFizikY: 0,
    aytKimyaD: 0,
    aytKimyaY: 0,
    aytBiyoD: 0,
    aytBiyoY: 0,
    ydtD: 0,
    ydtY: 0,
    diplomaNotu: 80,
    prevPlacement: false,
};

const tytFields: PairField[] = [
    { label: "Türkçe", questionCount: 40, correctId: "tytTurkceD", wrongId: "tytTurkceY" },
    { label: "Sosyal Bilimler", questionCount: 20, correctId: "tytSosyalD", wrongId: "tytSosyalY" },
    { label: "Matematik", questionCount: 40, correctId: "tytMatD", wrongId: "tytMatY" },
    { label: "Fen Bilimleri", questionCount: 20, correctId: "tytFenD", wrongId: "tytFenY" },
];

const scoreTypeSections: Record<Exclude<YksScoreType, "tyt">, { title: string; description: string; fields: PairField[] }[]> = {
    say: [
        {
            title: "AYT Matematik ve Fen",
            description: "SAY puanı için en kritik testleri doldurun.",
            fields: [
                { label: "AYT Matematik", questionCount: 40, correctId: "aytMatD", wrongId: "aytMatY" },
                { label: "Fizik", questionCount: 14, correctId: "aytFizikD", wrongId: "aytFizikY" },
                { label: "Kimya", questionCount: 13, correctId: "aytKimyaD", wrongId: "aytKimyaY" },
                { label: "Biyoloji", questionCount: 13, correctId: "aytBiyoD", wrongId: "aytBiyoY" },
            ],
        },
    ],
    ea: [
        {
            title: "AYT Eşit Ağırlık",
            description: "EA puanı için matematik ve sosyal-1 kombinasyonunu girin.",
            fields: [
                { label: "AYT Matematik", questionCount: 40, correctId: "aytMatD", wrongId: "aytMatY" },
                { label: "Türk Dili ve Edebiyatı", questionCount: 24, correctId: "aytEdebD", wrongId: "aytEdebY" },
                { label: "Tarih-1", questionCount: 10, correctId: "aytTar1D", wrongId: "aytTar1Y" },
                { label: "Coğrafya-1", questionCount: 6, correctId: "aytCog1D", wrongId: "aytCog1Y" },
            ],
        },
    ],
    soz: [
        {
            title: "AYT Sözel Blok",
            description: "SÖZ puanı için edebiyat ve sosyal bilimler testlerini doldurun.",
            fields: [
                { label: "Türk Dili ve Edebiyatı", questionCount: 24, correctId: "aytEdebD", wrongId: "aytEdebY" },
                { label: "Tarih-1", questionCount: 10, correctId: "aytTar1D", wrongId: "aytTar1Y" },
                { label: "Coğrafya-1", questionCount: 6, correctId: "aytCog1D", wrongId: "aytCog1Y" },
                { label: "Tarih-2", questionCount: 11, correctId: "aytTar2D", wrongId: "aytTar2Y" },
                { label: "Coğrafya-2", questionCount: 11, correctId: "aytCog2D", wrongId: "aytCog2Y" },
                { label: "Felsefe Grubu", questionCount: 12, correctId: "aytFelsefeD", wrongId: "aytFelsefeY" },
                { label: "Din Kültürü", questionCount: 6, correctId: "aytDinD", wrongId: "aytDinY" },
            ],
        },
    ],
    dil: [
        {
            title: "YDT Alanı",
            description: "Dil puanı için yalnızca YDT netlerinizi girmeniz yeterlidir.",
            fields: [
                { label: "Yabancı Dil Testi", questionCount: 80, correctId: "ydtD", wrongId: "ydtY" },
            ],
        },
    ],
};

function formatScore(value: number) {
    if (!value) return "—";
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function formatNet(value: number) {
    return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function NumericField({
    id,
    value,
    onChange,
    max,
    label,
}: {
    id: string;
    value: number;
    onChange: (id: string, value: number) => void;
    max: number;
    label: string;
}) {
    return (
        <label className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
            <input
                id={id}
                type="number"
                inputMode="numeric"
                min={0}
                max={max}
                value={value}
                onChange={(event) => onChange(id, Math.max(0, Math.min(max, Number.parseFloat(event.target.value) || 0)))}
                className="h-11 rounded-xl border border-slate-300 px-3 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
            />
        </label>
    );
}

function PairRow({
    field,
    values,
    onChange,
}: {
    field: PairField;
    values: typeof initialValues;
    onChange: (id: string, value: number | boolean | string) => void;
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h4 className="text-base font-bold tracking-tight text-slate-900">{field.label}</h4>
                    <p className="mt-1 text-sm text-slate-500">Toplam {field.questionCount} soru</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                    4 yanlış = 1 doğru
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <NumericField id={field.correctId} label="Doğru" value={values[field.correctId as keyof typeof initialValues] as number} onChange={onChange} max={field.questionCount} />
                <NumericField id={field.wrongId} label="Yanlış" value={values[field.wrongId as keyof typeof initialValues] as number} onChange={onChange} max={field.questionCount} />
            </div>
        </div>
    );
}

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            </div>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

export default function YksCalculator({ lang }: { lang: "tr" | "en" }) {
    const [values, setValues] = useState(initialValues);
    const [scoreType, setScoreType] = useState<YksScoreType>("tyt");

    const results = useMemo(() => calculateYksScores(values), [values]);

    const handleChange = (id: string, value: number | boolean | string) => {
        setValues((current) => ({ ...current, [id]: value }));
    };

    const primaryScore = useMemo(() => {
        const map = {
            tyt: {
                title: "TYT yerleştirme puanı",
                raw: results.tytPuan,
                placement: results.yTyt,
                eligible: results.tytEligible,
            },
            say: {
                title: "SAY yerleştirme puanı",
                raw: results.sayPuan,
                placement: results.ySay,
                eligible: results.sayEligible,
            },
            ea: {
                title: "EA yerleştirme puanı",
                raw: results.eaPuan,
                placement: results.yEa,
                eligible: results.eaEligible,
            },
            soz: {
                title: "SÖZ yerleştirme puanı",
                raw: results.sozPuan,
                placement: results.ySoz,
                eligible: results.sozEligible,
            },
            dil: {
                title: "DİL yerleştirme puanı",
                raw: results.dilPuan,
                placement: results.yDil,
                eligible: results.dilEligible,
            },
        } satisfies Record<YksScoreType, { title: string; raw: number; placement: number; eligible: boolean }>;

        return map[scoreType];
    }, [results, scoreType]);

    const secondaryScores = [
        { key: "tyt", label: "TYT", value: results.yTyt, eligible: results.tytEligible },
        { key: "say", label: "SAY", value: results.ySay, eligible: results.sayEligible },
        { key: "ea", label: "EA", value: results.yEa, eligible: results.eaEligible },
        { key: "soz", label: "SÖZ", value: results.ySoz, eligible: results.sozEligible },
        { key: "dil", label: "DİL", value: results.yDil, eligible: results.dilEligible },
    ] satisfies { key: YksScoreType; label: string; value: number; eligible: boolean }[];

    const netHighlights = [
        { label: "TYT toplam net", value: results.tytTotalNet },
        {
            label: scoreType === "say" ? "SAY alan neti" : scoreType === "ea" ? "EA alan neti" : scoreType === "soz" ? "SÖZ alan neti" : scoreType === "dil" ? "YDT neti" : "TYT uygunluğu",
            value: scoreType === "say" ? results.sayAytNet : scoreType === "ea" ? results.eaAytNet : scoreType === "soz" ? results.sozAytNet : scoreType === "dil" ? results.ydtNet : results.tytTotalNet,
        },
        { label: "OBP katkısı", value: results.obpPuani },
    ];

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-blue-100 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_42%),linear-gradient(135deg,#eff6ff_0%,#ffffff_45%,#f8fafc_100%)] p-5 shadow-sm sm:p-7">
                <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-end">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">YKS puanını daha hızlı, daha doğru, daha okunabilir hesapla</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                            TYT, AYT, YDT ve OBP etkisini ayrı ayrı gör. Sadece hedeflediğin puan türüne ait alanları doldurarak daha kısa bir akışla ilerle.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Calculator size={16} className="text-blue-600" /> 4 yanlış 1 doğru</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">Netler otomatik hesaplanır, manuel dönüştürme gerekmez.</p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Target size={16} className="text-blue-600" /> Alan odaklı form</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">SAY, EA, SÖZ veya DİL seçip gereksiz blokları gizleyebilirsin.</p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><BookOpenCheck size={16} className="text-blue-600" /> Katsayı seti seçimi</div>
                            <p className="mt-2 text-xs leading-6 text-slate-500">2025 güncel simülasyon seti, 2024 doğrulanmış seti ve 2023 karşılaştırması sunulur.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <div className="space-y-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                            <div>
                                <label htmlFor="sinav_yili" className="mb-2 block text-sm font-semibold text-slate-700">Simülasyon seti</label>
                                <select
                                    id="sinav_yili"
                                    value={values.sinav_yili}
                                    onChange={(event) => handleChange("sinav_yili", event.target.value)}
                                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                                >
                                    {Object.entries(yksYearConfigs).map(([year, config]) => (
                                        <option key={year} value={year}>{config.label[lang]}</option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs leading-6 text-slate-500">{results.yearHelperText[lang]}</p>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-semibold text-slate-700">Hedef puan türü</p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                                    {(["tyt", "say", "ea", "soz", "dil"] as YksScoreType[]).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setScoreType(item)}
                                            className={cn(
                                                "flex h-12 items-center justify-center rounded-2xl border text-sm font-semibold transition",
                                                scoreType === item
                                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                                            )}
                                        >
                                            {yksScoreTypeMeta[item][lang]}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs leading-6 text-slate-500">Seçtiğin puan türüne göre aşağıdaki alanlar sadeleşir. Diğer puan türleri sağdaki özet bölümünde görünmeye devam eder.</p>
                            </div>
                        </div>
                    </section>

                    <SectionCard title="TYT Testleri" description="Tüm puan türlerinin temelini oluşturan TYT netlerinizi girin.">
                        {tytFields.map((field) => (
                            <PairRow key={field.correctId} field={field} values={values} onChange={handleChange} />
                        ))}
                    </SectionCard>

                    {scoreType !== "tyt" && scoreTypeSections[scoreType].map((section) => (
                        <SectionCard key={section.title} title={section.title} description={section.description}>
                            {section.fields.map((field) => (
                                <PairRow key={field.correctId} field={field} values={values} onChange={handleChange} />
                            ))}
                        </SectionCard>
                    ))}

                    <SectionCard title="Okul Başarı Puanı" description="OBP katkısı yerleştirme puanınıza doğrudan eklenir.">
                        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-slate-700">Diploma notu</span>
                                <input
                                    id="diplomaNotu"
                                    type="number"
                                    min={50}
                                    max={100}
                                    step={0.1}
                                    value={values.diplomaNotu}
                                    onChange={(event) => handleChange("diplomaNotu", Math.max(50, Math.min(100, Number.parseFloat(event.target.value) || 50)))}
                                    className="h-12 rounded-2xl border border-slate-300 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                                />
                            </label>
                            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                <input
                                    id="prevPlacement"
                                    type="checkbox"
                                    checked={values.prevPlacement}
                                    onChange={(event) => handleChange("prevPlacement", event.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>
                                    Önceki yıl bir programa yerleştim
                                    <span className="mt-1 block text-xs font-normal leading-6 text-slate-500">İşaretlersen OBP katkısı kırılmış olarak hesaplanır.</span>
                                </span>
                            </label>
                        </div>
                    </SectionCard>
                </div>

                <aside className="space-y-5 lg:sticky lg:top-24">
                    <section className="overflow-hidden rounded-[28px] border border-slate-900 bg-slate-950 text-white shadow-xl">
                        <div className="border-b border-white/10 px-5 py-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Canlı sonuç</p>
                                    <h3 className="mt-2 text-xl font-black tracking-tight">{primaryScore.title}</h3>
                                </div>
                                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                                    {results.yearLabel[lang]}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-5 px-5 py-5">
                            <div className="rounded-3xl bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Yerleştirme puanı</p>
                                <p className="mt-2 text-4xl font-black tracking-tight text-white">{formatScore(primaryScore.placement)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-white/60">Ham puan</p>
                                    <p className="mt-2 text-2xl font-bold">{formatScore(primaryScore.raw)}</p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-white/60">OBP katkısı</p>
                                    <p className="mt-2 text-2xl font-bold">{results.obpPuani.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <div className={cn("rounded-2xl border px-4 py-3 text-sm leading-6", primaryScore.eligible ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-50")}>
                                <div className="flex items-start gap-2">
                                    {primaryScore.eligible ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <Target size={18} className="mt-0.5 shrink-0" />}
                                    <p>
                                        {primaryScore.eligible
                                            ? "Bu puan türü için yeterli veri var. Ham ve yerleştirme puanını güvenli şekilde karşılaştırabilirsin."
                                            : "Bu puan türünde sonuç görebilmek için ilgili AYT veya YDT alanlarında en az 0,5 net üretmelisin."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Net özeti</h3>
                        <div className="mt-4 grid gap-3">
                            {netHighlights.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                                    <span className="text-lg font-bold tracking-tight text-slate-900">{formatNet(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Diğer puan türleri</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {secondaryScores.map((item) => (
                                <div key={item.key} className={cn("rounded-2xl border px-4 py-3", scoreType === item.key ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50")}>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                        <span className={cn("h-2.5 w-2.5 rounded-full", item.eligible ? "bg-emerald-500" : "bg-slate-300")} />
                                    </div>
                                    <p className="mt-2 text-xl font-black tracking-tight text-slate-900">{formatScore(item.value)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-bold tracking-tight text-slate-900">Hızlı notlar</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <GraduationCap size={18} className="mt-0.5 shrink-0 text-blue-600" />
                                <p>TYT puanının oluşması için Türkçe veya Matematik testinden en az 0,5 net gerekir.</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <Sigma size={18} className="mt-0.5 shrink-0 text-blue-600" />
                                <p>Ham puan ile yerleştirme puanı aynı şey değildir; OBP yalnızca yerleştirme puanına eklenir.</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <Languages size={18} className="mt-0.5 shrink-0 text-blue-600" />
                                <p>DİL puanında YDT netleri kritik olduğu için YDT bölümü boşsa sonuç 0 görünmesi normaldir.</p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}