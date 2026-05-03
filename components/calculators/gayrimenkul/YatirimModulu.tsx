"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Banknote, BarChart3, Clock, Percent, Share2, TrendingUp, Wallet } from "lucide-react";
import type { YatirimInputs, YatirimResult } from "@/lib/gayrimenkul-hesaplama";
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

function formatPercent(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + "%";
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
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Math.max(min, Number.parseFloat(event.target.value) || 0))}
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

function scoreClasses(tone: YatirimResult["mantikSkoru"]["ton"]) {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-800";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

type Props = {
  values: YatirimInputs;
  result: YatirimResult;
  onChange: <K extends keyof YatirimInputs>(key: K, value: YatirimInputs[K]) => void;
  onShare: () => void;
  shareCopied: boolean;
};

export default function YatirimModulu({ values, result, onChange, onShare, shareCopied }: Props) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF3EE] text-[#CC4A1A]">
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Yatırım analizi</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Satış fiyatı, Değer sekmesindeki tahminle otomatik eşleşir.</p>
            </div>
          </div>
          <button type="button" onClick={onShare} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50" title="Sonuçları paylaş">
            <Share2 size={17} />
          </button>
        </div>

        {shareCopied && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Bağlantı kopyalandı.</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Satış fiyatı">
            <NumberInput value={values.satisFiyati} onChange={(value) => onChange("satisFiyati", value)} suffix="TL" step={10000} />
          </Field>
          <Field label="Tahmini aylık kira">
            <NumberInput value={values.aylikKira} onChange={(value) => onChange("aylikKira", value)} suffix="TL" step={1000} />
          </Field>
          <Field label="Aidat">
            <NumberInput value={values.aidat} onChange={(value) => onChange("aidat", value)} suffix="TL/ay" step={250} />
          </Field>
          <Field label="Yıllık kira artış beklentisi">
            <NumberInput value={values.yillikKiraArtisi} onChange={(value) => onChange("yillikKiraArtisi", value)} suffix="%" step={0.5} />
          </Field>
          <Field label="Gayrimenkul değer artışı">
            <NumberInput value={values.yillikDegerArtisi} onChange={(value) => onChange("yillikDegerArtisi", value)} suffix="%" step={0.5} />
          </Field>
          <Field label="Alternatif yatırım getirisi">
            <NumberInput value={values.alternatifGetiri} onChange={(value) => onChange("alternatifGetiri", value)} suffix="%" step={0.5} />
          </Field>
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <section className={cn("rounded-[28px] border p-5 shadow-sm", scoreClasses(result.mantikSkoru.ton))}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <Wallet size={18} />
              Bu yatırım mantıklı mı?
            </div>
            <span className="text-xl font-black">{result.mantikSkoru.skor}/100</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80">
            <div className="h-full rounded-full bg-current" style={{ width: `${Math.max(5, result.mantikSkoru.skor)}%` }} />
          </div>
          <p className="mt-4 text-lg font-black">{result.mantikSkoru.etiket}</p>
          <p className="mt-2 text-sm leading-6">{result.mantikSkoru.aciklama}</p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <MetricCard icon={Percent} label="Brüt kira getirisi" value={formatPercent(result.brutKiraGetirisi)} helper="Yıllık kira / satış fiyatı" />
          <MetricCard icon={Percent} label="Net kira getirisi" value={formatPercent(result.netKiraGetirisi)} helper="Aidat düşülmüş kira" />
          <MetricCard icon={Clock} label="Amorti süresi" value={`${result.amortiSuresiYil.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} yıl`} helper="Net kira üzerinden" />
          <MetricCard icon={Banknote} label="10 yıl net kira" value={formatTL(result.toplamNetKira10Yil)} helper="Kira artışı dahil" />
        </div>
      </aside>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
        <div className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950">
          <BarChart3 size={20} className="text-[#CC4A1A]" />
          Alternatif yatırım karşılaştırması
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
          <div className="min-h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={result.barData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis tickFormatter={formatShortTL} tick={{ fill: "#475569", fontSize: 12 }} width={62} />
                <Tooltip formatter={(value) => formatTL(Number(value))} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Bar dataKey="getiri" fill="#FF6B35" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-500">10 yıl gayrimenkul toplamı</div>
              <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatTL(result.gayrimenkulDegeri10Yil + result.toplamNetKira10Yil)}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Konut değeri ve net kira birikimi birlikte.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-500">10 yıl alternatif toplamı</div>
              <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{formatTL(result.alternatifToplamDeger)}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Başlangıç tutarının alternatif getirisi.</p>
            </div>
            {result.projeksiyon.slice(0, 5).map((item) => (
              <div key={item.yil} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-black text-slate-900">{item.yil}. yıl</div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">Gayrimenkul</span>
                  <span className="font-bold text-slate-900">{formatTL(item.gayrimenkulToplam)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">Alternatif</span>
                  <span className="font-bold text-slate-900">{formatTL(item.alternatifDeger)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
