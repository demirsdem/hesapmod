"use client";

import React from "react";
import { Calculator, CheckCircle2, Database, Home, MapPin, Share2, ShieldCheck, TrendingUp } from "lucide-react";
import {
  CEPHE_SECENEKLERI,
  GAYRIMENKUL_TIPLERI,
  ILCE_SECENEKLERI,
  IL_SECENEKLERI,
  ISINMA_TIPLERI,
  ODA_SECENEKLERI,
  TAPU_DURUMLARI,
  type CepheTipi,
  type GayrimenkulTipi,
  type IlAdi,
  type IsinmaTipi,
  type OdaSayisi,
  type TapuDurumu,
} from "@/data/gayrimenkul-verileri";
import type { DegerInputs, DegerResult } from "@/lib/gayrimenkul-hesaplama";
import { cn } from "@/lib/utils";

const inputClass = "h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20";

function formatTL(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " TL";
}

function formatM2(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " TL/m²";
}

function formatPercent(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 1 }) + "%";
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
          onChange(clampNumber(next, min, max));
        }}
        className={cn(inputClass, suffix ? "pr-16" : "")}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">{suffix}</span>}
    </div>
  );
}

function clampNumber(value: number, min: number, max?: number) {
  const withMin = Math.max(min, value);
  return typeof max === "number" ? Math.min(max, withMin) : withMin;
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <input type="text" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={inputClass} />;
}

function SelectInput<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as T)} className={cn(inputClass, "appearance-none")}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function MetricCard({ label, value, helper, icon: Icon }: { label: string; value: string; helper?: string; icon: React.ElementType }) {
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

function toneClasses(tone: DegerResult["piyasaSkoru"]["ton"]) {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-800";
  if (tone === "yellow") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-50 text-slate-800";
}

type Props = {
  values: DegerInputs;
  result: DegerResult;
  onChange: <K extends keyof DegerInputs>(key: K, value: DegerInputs[K]) => void;
  onShare: () => void;
  shareCopied: boolean;
};

export default function DegerModulu({ values, result, onChange, onShare, shareCopied }: Props) {
  const districtOptions = ILCE_SECENEKLERI[values.il] ?? [];
  const districtSelectOptions = districtOptions.includes(values.ilce) || !values.ilce
    ? districtOptions
    : [values.ilce, ...districtOptions];
  const marketGauge = Math.max(6, Math.min(100, result.piyasaSkoru.skor));
  const confidenceGauge = Math.max(6, Math.min(100, result.guvenSkoru));

  const updateIl = (il: IlAdi) => {
    onChange("il", il);
    onChange("ilce", (ILCE_SECENEKLERI[il]?.[0] ?? "") as DegerInputs["ilce"]);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF3EE] text-[#CC4A1A]">
            <Home size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Piyasa değeri tahmini</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{result.referans.kaynak}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Gayrimenkul tipi">
            <SelectInput value={values.gayrimenkulTipi} options={GAYRIMENKUL_TIPLERI} onChange={(value: GayrimenkulTipi) => onChange("gayrimenkulTipi", value)} />
          </Field>
          <Field label="İl">
            <SelectInput value={values.il} options={IL_SECENEKLERI} onChange={updateIl} />
          </Field>
          <Field label="İlçe">
            {districtOptions.length > 0 ? (
              <SelectInput value={(values.ilce || districtOptions[0]) as string} options={districtSelectOptions} onChange={(value) => onChange("ilce", value)} />
            ) : (
              <TextInput value={values.ilce} onChange={(value) => onChange("ilce", value)} placeholder="İlçe adı" />
            )}
          </Field>
          <Field label="Mahalle">
            <TextInput value={values.mahalle} onChange={(value) => onChange("mahalle", value)} placeholder="Örn. Suadiye" />
          </Field>
          <Field label="Brüt m²">
            <NumberInput value={values.brutM2} onChange={(value) => onChange("brutM2", value)} suffix="m²" />
          </Field>
          <Field label="Net m²">
            <NumberInput value={values.netM2} onChange={(value) => onChange("netM2", value)} suffix="m²" />
          </Field>
          <Field label="Oda sayısı">
            <SelectInput value={values.odaSayisi} options={ODA_SECENEKLERI} onChange={(value: OdaSayisi) => onChange("odaSayisi", value)} />
          </Field>
          <Field label="Bina yaşı">
            <NumberInput value={values.binaYasi} onChange={(value) => onChange("binaYasi", value)} suffix="yıl" max={80} />
          </Field>
          <Field label="Toplam kat">
            <NumberInput value={values.toplamKat} onChange={(value) => onChange("toplamKat", value)} min={1} max={80} />
          </Field>
          <Field label="Bulunduğu kat">
            <NumberInput value={values.bulunduguKat} onChange={(value) => onChange("bulunduguKat", value)} max={80} />
          </Field>
          <Field label="Isınma tipi">
            <SelectInput value={values.isinmaTipi} options={ISINMA_TIPLERI} onChange={(value: IsinmaTipi) => onChange("isinmaTipi", value)} />
          </Field>
          <Field label="Tapu durumu">
            <SelectInput value={values.tapuDurumu} options={TAPU_DURUMLARI} onChange={(value: TapuDurumu) => onChange("tapuDurumu", value)} />
          </Field>
          <Field label="Krediye uygunluk">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Evet", value: true },
                { label: "Hayır", value: false },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onChange("krediyeUygun", option.value)}
                  className={cn(
                    "h-12 rounded-xl border px-3 text-sm font-bold transition-colors",
                    values.krediyeUygun === option.value
                      ? "border-[#FF6B35] bg-[#FFF3EE] text-[#CC4A1A]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Cephe">
            <SelectInput value={values.cephe} options={CEPHE_SECENEKLERI} onChange={(value: CepheTipi) => onChange("cephe", value)} />
          </Field>
          <Field label="Varsa satış / ilan fiyatı">
            <NumberInput value={values.kullaniciFiyati} onChange={(value) => onChange("kullaniciFiyati", value)} suffix="TL" step={10000} />
          </Field>
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#fff7f3_45%,#f8fafc_100%)] p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#CC4A1A]">Tahmini değer</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{formatTL(result.degerAraligi.ortalama)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{formatTL(result.degerAraligi.min)} - {formatTL(result.degerAraligi.max)}</p>
            </div>
            <button type="button" onClick={onShare} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50" title="Sonuçları paylaş">
              <Share2 size={17} />
            </button>
          </div>
          {shareCopied && <p className="mt-3 text-sm font-semibold text-emerald-700">Bağlantı kopyalandı.</p>}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <MetricCard icon={Calculator} label="Birim fiyat" value={formatM2(result.birimM2Fiyati)} helper={`${result.efektifM2.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} m² efektif alan`} />
            <MetricCard icon={Database} label="Referans" value={formatM2(result.referans.m2Fiyat)} helper={`${result.referans.kapsam}${result.referans.ilce ? `: ${result.referans.ilce}` : `: ${result.referans.il}`}`} />
          </div>
        </section>

        <section className={cn("rounded-[28px] border p-5 shadow-sm", toneClasses(result.piyasaSkoru.ton))}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <TrendingUp size={18} />
              Bu fiyat piyasaya göre nasıl?
            </div>
            <span className="text-xl font-black">{result.piyasaSkoru.skor}/100</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80">
            <div className="h-full rounded-full bg-current" style={{ width: `${marketGauge}%` }} />
          </div>
          <p className="mt-4 text-base font-black">{result.piyasaSkoru.etiket}</p>
          <p className="mt-2 text-sm leading-6">{result.piyasaSkoru.aciklama}</p>
          <p className="mt-2 text-sm font-semibold">Fark: {formatPercent(result.piyasaSkoru.farkYuzde)}</p>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-700">
              <ShieldCheck size={18} className="text-[#CC4A1A]" />
              Güven skoru
            </div>
            <span className="text-xl font-black text-slate-950">{result.guvenSkoru}/100</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#FF6B35]" style={{ width: `${confidenceGauge}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {result.girilenDetaySayisi}/{result.toplamDetaySayisi} detay kullanıldı. Veri tarihi: {result.referans.tarih}.
          </p>
          {result.referans.not && <p className="mt-2 text-sm leading-6 text-slate-500">{result.referans.not}</p>}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
            <MapPin size={18} className="text-[#CC4A1A]" />
            Değeri etkileyen kalemler
          </div>
          <div className="space-y-2">
            {result.etkiler.filter((effect) => Math.abs(effect.oran) > 0.001).map((effect) => (
              <div key={effect.label} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  {effect.label}
                </span>
                <span className={cn("font-bold", effect.oran >= 0 ? "text-emerald-700" : "text-red-700")}>
                  {effect.oran >= 0 ? "+" : ""}
                  {formatPercent(effect.oran * 100)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
