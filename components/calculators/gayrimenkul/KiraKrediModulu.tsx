"use client";

import React from "react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRightLeft, CalendarClock, CreditCard, Home, LineChart as LineChartIcon, Share2, Wallet } from "lucide-react";
import type { KiraKrediInputs, KiraKrediResult } from "@/lib/gayrimenkul-hesaplama";
import { cn } from "@/lib/utils";

const inputClass = "h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20";

function formatTL(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " TL";
}

function formatShortTL(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} mn`;
  if (abs >= 1_000) return `${(value / 1_000).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} bin`;
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => {
          const parsed = Number.parseFloat(event.target.value);
          const next = Number.isFinite(parsed) ? parsed : 0;
          onChange(typeof max === "number" ? Math.min(max, Math.max(min, next)) : Math.max(min, next));
        }}
        className={cn(inputClass, suffix ? "pr-16" : "")}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">{suffix}</span>}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, helper }: { icon: React.ElementType; label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Icon size={17} className="text-[#CC4A1A]" />
        {label}
      </div>
      <div className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</div>
      {helper && <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>}
    </div>
  );
}

function toneClasses(tone: KiraKrediResult["avantaj"]["ton"]) {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-800";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

type Props = {
  values: KiraKrediInputs;
  result: KiraKrediResult;
  onChange: <K extends keyof KiraKrediInputs>(key: K, value: KiraKrediInputs[K]) => void;
  onShare: () => void;
  shareCopied: boolean;
};

export default function KiraKrediModulu({ values, result, onChange, onShare, shareCopied }: Props) {
  const crossoverText = result.kiraKrediyiGectigiAy
    ? `${Math.ceil(result.kiraKrediyiGectigiAy / 12)}. yıl (${result.kiraKrediyiGectigiAy}. ay)`
    : "10 yıl içinde geçmiyor";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF3EE] text-[#CC4A1A]">
              <ArrowRightLeft size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Kira mı kredi mi?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Almak istediğiniz evin fiyatı, Değer sekmesindeki tahminle otomatik eşleşir.</p>
            </div>
          </div>
          <button type="button" onClick={onShare} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50" title="Sonuçları paylaş">
            <Share2 size={17} />
          </button>
        </div>

        {shareCopied && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Bağlantı kopyalandı.</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Şu anki kira ödemesi">
            <NumberInput value={values.mevcutKira} onChange={(value) => onChange("mevcutKira", value)} suffix="TL/ay" step={1000} />
          </Field>
          <Field label="Almak istediğiniz evin fiyatı">
            <NumberInput value={values.evFiyati} onChange={(value) => onChange("evFiyati", value)} suffix="TL" step={10000} />
          </Field>
          <Field label="Peşinat miktarı">
            <NumberInput value={values.pesinat} onChange={(value) => onChange("pesinat", value)} suffix="TL" step={10000} />
          </Field>
          <Field label="Kredi vadesi">
            <NumberInput value={values.krediVadesiAy} onChange={(value) => onChange("krediVadesiAy", value)} suffix="ay" min={1} max={360} />
          </Field>
          <Field label="Aylık faiz oranı">
            <NumberInput value={values.aylikFaiz} onChange={(value) => onChange("aylikFaiz", value)} suffix="%" step={0.01} />
          </Field>
          <Field label="Kira artış beklentisi">
            <NumberInput value={values.kiraArtisi} onChange={(value) => onChange("kiraArtisi", value)} suffix="%" step={0.5} />
          </Field>
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <section className={cn("rounded-[28px] border p-5 shadow-sm", toneClasses(result.avantaj.ton))}>
          <div className="flex items-center gap-2 text-sm font-black">
            <Home size={18} />
            10 yıl sonra hangisi avantajlı?
          </div>
          <p className="mt-4 text-2xl font-black tracking-tight">{result.avantaj.etiket}</p>
          <p className="mt-2 text-sm leading-6">{result.avantaj.aciklama}</p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <MetricCard icon={CreditCard} label="Aylık kredi taksiti" value={formatTL(result.aylikTaksit)} helper={`${values.krediVadesiAy} ay vadede`} />
          <MetricCard icon={Wallet} label="Aylık kira" value={formatTL(values.mevcutKira)} helper="Başlangıç ayı" />
          <MetricCard icon={CalendarClock} label="Kırılma noktası" value={crossoverText} helper="Kiranın taksiti geçtiği zaman" />
          <MetricCard icon={LineChartIcon} label="Toplam ödeme farkı" value={formatTL(result.toplamOdemeFarki)} helper="Pozitifse kredi + peşinat daha yüksek" />
        </div>
      </aside>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
        <div className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950">
          <LineChartIcon size={20} className="text-[#CC4A1A]" />
          Aylık kredi taksiti ve kira karşılaştırması
        </div>
        <div className="min-h-[320px]">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={result.grafik} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="ay" tick={{ fill: "#475569", fontSize: 12 }} interval={11} tickFormatter={(value) => `${Math.ceil(Number(value) / 12)}. yıl`} />
              <YAxis tickFormatter={formatShortTL} tick={{ fill: "#475569", fontSize: 12 }} width={62} />
              <Tooltip
                formatter={(value) => formatTL(Number(value))}
                labelFormatter={(label) => `${label}. ay`}
                contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
              />
              <Legend />
              {result.kiraKrediyiGectigiAy && <ReferenceLine x={result.kiraKrediyiGectigiAy} stroke="#0f172a" strokeDasharray="4 4" />}
              <Line type="monotone" dataKey="kira" name="Kira" stroke="#10b981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="kredi" name="Kredi taksiti" stroke="#FF6B35" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-500">10 yıl toplam kira</div>
            <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatTL(result.toplamKira10Yil)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-500">10 yıl kredi + peşinat</div>
            <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatTL(result.toplamKrediOdemesi10Yil)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-500">10 yıl kalan anapara</div>
            <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatTL(result.kalanAnapara10Yil)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
