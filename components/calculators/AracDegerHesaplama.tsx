"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, Car, Database, ExternalLink, Fuel, Gauge, Landmark, MapPin, RotateCcw, Search, Share2, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { ARAC_VERILERI, DONANIM_PAKETLERI, HASAR_KAYITLARI, IL_SECENEKLERI, SERVIS_GECMISLERI, URETIM_YILLARI, VITES_TIPLERI, YAKIT_TIPLERI, type AracMarka, type DonanimPaketi, type HasarKaydi, type ServisGecmisi, type VitesTipi, type YakitTipi } from "@/data/arac-verileri";
import { ARAC_PIYASA_KATALOG, PIYASA_MARKALARI } from "@/data/arac-piyasa-katalog";
import { aracDegerHesapla, type AracDegerInputs, type AracPiyasaEmsali } from "@/lib/arac-hesaplama";
import { cn } from "@/lib/utils";
import { buildArabamSearchLink } from "@/lib/vehicle-market-providers";

const defaultValues: AracDegerInputs = {
  marka: "Toyota",
  model: "Corolla",
  yil: 2020,
  kilometre: 85000,
  yakitTipi: "Benzin",
  vites: "Otomatik",
  donanimPaketi: "Orta",
  il: "İstanbul",
  ilce: "",
  servisGecmisi: "Yetkili servis kayıtlı",
  hasarKaydi: "Yok",
  boyaDegisenParca: 0,
  yillikKm: 15000,
  krediTutari: 500000,
  krediVadesi: 36,
  aylikFaiz: 3.49,
};

const defaultEmsaller: AracPiyasaEmsali[] = [];

const emsalKaynaklari: AracPiyasaEmsali["kaynak"][] = ["Sahibinden", "arabam.com", "TRAMER/Değerleme", "Web", "Kullanıcı"];

function formatTL(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " TL";
}

function formatPercent(value: number) {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 1 }) + "%";
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatPercent(Math.abs(value))}`;
}

type MarketFetchResult = {
  provider: string;
  status: "ready" | "needs_api_access" | "disabled" | "error";
  searchUrl: string;
  listings: AracPiyasaEmsali[];
  message: string;
  sourceUrls?: string[];
};

function toSahibindenFuelLabel(yakitTipi: YakitTipi) {
  const map: Record<YakitTipi, string> = {
    Benzin: "Benzinli",
    Dizel: "Dizel",
    LPG: "Benzin LPG",
    Elektrik: "Elektrikli",
    Hybrid: "Hibrit",
  };

  return map[yakitTipi];
}

function buildMarketSearchLinks(values: AracDegerInputs) {
  const sahibindenQuery = [values.marka, values.model, values.yil, toSahibindenFuelLabel(values.yakitTipi), values.vites].join(" ");
  const sahibindenParams = new URLSearchParams({
    query_text: sahibindenQuery,
  });

  return [
    {
      label: "Sahibinden emsal araması",
      href: `https://www.sahibinden.com/arama?${sahibindenParams.toString()}`,
    },
    buildArabamSearchLink(values),
  ];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition-all hover:border-[#FFD7C7] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20";

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
        onChange={(event) => onChange(Math.max(min, Number.parseFloat(event.target.value) || 0))}
        className={cn(inputClass, suffix ? "pr-14" : "")}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">{suffix}</span>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

function SelectInput<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
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

function encodeSharedEmsaller(list: AracPiyasaEmsali[]) {
  return list
    .filter((emsal) => emsal.fiyat > 0)
    .slice(0, 8)
    .map((emsal) => [
      Math.round(emsal.fiyat),
      Math.round(emsal.kilometre ?? 0),
      emsal.kaynak,
      (emsal.baslik ?? "").replace(/[|;]/g, " ").slice(0, 80),
    ].join("|"))
    .join(";");
}

function decodeSharedEmsaller(raw: string | null) {
  if (!raw) return [];

  return raw
    .split(";")
    .map((part) => {
      const [fiyatRaw, kilometreRaw, kaynakRaw, baslikRaw] = part.split("|");
      const kaynak = emsalKaynaklari.includes(kaynakRaw as AracPiyasaEmsali["kaynak"])
        ? kaynakRaw as AracPiyasaEmsali["kaynak"]
        : "Kullanıcı";
      const fiyat = Number(fiyatRaw);
      const kilometre = Number(kilometreRaw);

      return {
        kaynak,
        fiyat: Number.isFinite(fiyat) ? fiyat : 0,
        kilometre: Number.isFinite(kilometre) && kilometre > 0 ? kilometre : undefined,
        baslik: baslikRaw || undefined,
      } satisfies AracPiyasaEmsali;
    })
    .filter((emsal) => emsal.fiyat > 0);
}

function MetricCard({ icon: Icon, label, value, helper }: { icon: React.ElementType; label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Icon size={18} className="text-[#CC4A1A]" />
        {label}
      </div>
      <div className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</div>
      {helper && <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>}
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900">{formatTL(value)}</span>
    </div>
  );
}

export default function AracDegerHesaplama() {
  const [values, setValues] = useState<AracDegerInputs>(defaultValues);
  const [emsaller, setEmsaller] = useState<AracPiyasaEmsali[]>(defaultEmsaller);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketMessage, setMarketMessage] = useState("");
  const [marketSourceUrls, setMarketSourceUrls] = useState<string[]>([]);
  const skipNextStorageLoadRef = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = { ...defaultValues };

    for (const key of Object.keys(defaultValues) as Array<keyof AracDegerInputs>) {
      const raw = params.get(key);
      if (!raw) continue;

      if (typeof defaultValues[key] === "number") {
        next[key] = Number(raw) as never;
      } else {
        next[key] = raw as never;
      }
    }

    const sharedEmsaller = decodeSharedEmsaller(params.get("emsaller"));
    if (sharedEmsaller.length > 0) {
      skipNextStorageLoadRef.current = true;
      setEmsaller(sharedEmsaller);
    }

    if (next.marka && next.model) {
      setValues(next);
      setHasCalculated(params.size > 0);
    }
  }, []);

  useEffect(() => {
    if (skipNextStorageLoadRef.current) {
      skipNextStorageLoadRef.current = false;
      return;
    }

    const storageKey = `arac-deger-emsal:${values.marka}:${values.model}:${values.yil}:${values.il}`;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      setEmsaller(defaultEmsaller);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AracPiyasaEmsali[];
      setEmsaller(Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultEmsaller);
    } catch {
      setEmsaller(defaultEmsaller);
    }
  }, [values.marka, values.model, values.yil, values.il]);

  const modelOptions = ARAC_PIYASA_KATALOG[values.marka] ?? ARAC_VERILERI[values.marka]?.map((item) => item.model) ?? [values.model];
  const aktifEmsaller = useMemo(() => emsaller.filter((emsal) => emsal.fiyat > 0), [emsaller]);
  const result = useMemo(() => aracDegerHesapla({ ...values, emsalFiyatlar: aktifEmsaller }), [aktifEmsaller, values]);
  const marketLinks = useMemo(() => buildMarketSearchLinks(values), [values]);
  const gaugePercent = Math.round((result.piyasaDegeri.ortalama / result.piyasaDegeri.max) * 100);

  const update = <K extends keyof AracDegerInputs>(key: K, value: AracDegerInputs[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateMarka = (marka: AracMarka) => {
    const nextModels = ARAC_PIYASA_KATALOG[marka] ?? ARAC_VERILERI[marka]?.map((item) => item.model) ?? [];
    setValues((current) => ({ ...current, marka, model: nextModels[0] ?? current.model }));
  };

  const updateEmsal = <K extends keyof AracPiyasaEmsali>(index: number, key: K, value: AracPiyasaEmsali[K]) => {
    setEmsaller((current) => current.map((emsal, emsalIndex) => emsalIndex === index ? { ...emsal, [key]: value } : emsal));
  };

  const addEmsal = () => {
    setEmsaller((current) => [...current, { kaynak: "Kullanıcı", fiyat: 0, kilometre: 0 }]);
  };

  const calculate = () => {
    const storageKey = `arac-deger-emsal:${values.marka}:${values.model}:${values.yil}:${values.il}`;
    window.localStorage.setItem(storageKey, JSON.stringify(aktifEmsaller));
    setHasCalculated(true);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const fetchMarketData = async () => {
    setMarketLoading(true);
    setMarketMessage("");
    setMarketSourceUrls([]);

    try {
      const response = await fetch("/api/arac-piyasa/claude", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json() as MarketFetchResult;

      if (payload.listings?.length >= 2) {
        setEmsaller(payload.listings);
        setMarketSourceUrls(payload.sourceUrls ?? []);
        setMarketMessage(payload.message);
        setHasCalculated(true);
        window.localStorage.setItem(`arac-deger-emsal:${values.marka}:${values.model}:${values.yil}:${values.il}`, JSON.stringify(payload.listings));
        window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        return;
      }

      setMarketMessage(payload.message || "Güncel emsal alınamadı; manuel emsal ekleyerek devam edebilirsiniz.");
      setMarketSourceUrls(payload.searchUrl ? [payload.searchUrl] : []);
    } catch {
      setMarketMessage("Güncel emsal alınamadı; manuel emsal ekleyerek devam edebilirsiniz.");
    } finally {
      setMarketLoading(false);
    }
  };

  const share = async () => {
    const params = new URLSearchParams();
    (Object.keys(values) as Array<keyof AracDegerInputs>).forEach((key) => params.set(key, String(values[key])));
    const sharedEmsaller = encodeSharedEmsaller(aktifEmsaller);
    if (sharedEmsaller) params.set("emsaller", sharedEmsaller);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard?.writeText(url);
    } catch {
      // Clipboard can be unavailable in some embedded browsers; URL is still placed in the address bar.
    }
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1600);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF3EE] text-[#CC4A1A]">
            <Car size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Araç bilgilerini girin</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Sonuçlar ilan, ekspertiz ve resmi değer yerine geçmez; yaklaşık piyasa analizi için hazırlanmıştır.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Marka">
            <SelectInput value={values.marka} options={PIYASA_MARKALARI.includes(values.marka) ? PIYASA_MARKALARI : [values.marka, ...PIYASA_MARKALARI]} onChange={updateMarka} />
          </Field>
          <Field label="Model">
            <SelectInput value={values.model} options={modelOptions} onChange={(value) => update("model", value)} />
          </Field>
          <Field label="Yıl">
            <select value={values.yil} onChange={(event) => update("yil", Number(event.target.value))} className={inputClass}>
              {URETIM_YILLARI.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </Field>
          <Field label="Kilometre">
            <NumberInput value={values.kilometre} onChange={(value) => update("kilometre", value)} suffix="km" step={1000} />
          </Field>
          <Field label="Yakıt tipi">
            <SelectInput value={values.yakitTipi} options={YAKIT_TIPLERI} onChange={(value: YakitTipi) => update("yakitTipi", value)} />
          </Field>
          <Field label="Vites">
            <SelectInput value={values.vites} options={VITES_TIPLERI} onChange={(value: VitesTipi) => update("vites", value)} />
          </Field>
          <Field label="Donanım paketi">
            <SelectInput value={values.donanimPaketi} options={DONANIM_PAKETLERI} onChange={(value: DonanimPaketi) => update("donanimPaketi", value)} />
          </Field>
          <Field label="İl">
            <SelectInput value={values.il} options={IL_SECENEKLERI.includes(values.il as typeof IL_SECENEKLERI[number]) ? IL_SECENEKLERI : [values.il, ...IL_SECENEKLERI]} onChange={(value) => update("il", value)} />
          </Field>
          <Field label="İlçe">
            <TextInput value={values.ilce} onChange={(value) => update("ilce", value)} placeholder="Örn. Kadıköy" />
          </Field>
          <Field label="Servis geçmişi">
            <SelectInput value={values.servisGecmisi} options={SERVIS_GECMISLERI} onChange={(value: ServisGecmisi) => update("servisGecmisi", value)} />
          </Field>
          <Field label="Hasar kaydı">
            <SelectInput value={values.hasarKaydi} options={HASAR_KAYITLARI} onChange={(value: HasarKaydi) => update("hasarKaydi", value)} />
          </Field>
          <Field label="Boya / değişen parça">
            <NumberInput value={values.boyaDegisenParca} onChange={(value) => update("boyaDegisenParca", Math.min(12, value))} max={12} suffix="parça" />
          </Field>
          <Field label="Yıllık kullanım">
            <NumberInput value={values.yillikKm} onChange={(value) => update("yillikKm", value)} suffix="km" step={1000} />
          </Field>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
          <Field label="Kredi tutarı">
            <NumberInput value={values.krediTutari} onChange={(value) => update("krediTutari", value)} suffix="TL" step={10000} />
          </Field>
          <Field label="Kredi vadesi">
            <NumberInput value={values.krediVadesi} onChange={(value) => update("krediVadesi", Math.min(60, value))} min={1} max={60} suffix="ay" />
          </Field>
          <Field label="Aylık faiz">
            <NumberInput value={values.aylikFaiz} onChange={(value) => update("aylikFaiz", value)} suffix="%" step={0.01} />
          </Field>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-base font-black text-slate-950">
                <Database size={18} className="text-[#CC4A1A]" />
                Bugünkü piyasa emsalleri
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Güncel emsalleri otomatik çekin; gerekirse gördüğünüz ilan veya ekspertiz fiyatlarını ayrıca ekleyin.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={fetchMarketData} disabled={marketLoading} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70">
                <Sparkles size={16} />
                {marketLoading ? "Emsal aranıyor" : "Güncel emsal getir"}
              </button>
              <button type="button" onClick={addEmsal} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                Emsal ekle
              </button>
            </div>
          </div>

          <div className="mb-4 grid gap-3 lg:grid-cols-2">
            {marketLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[#FFD7C7] bg-white px-4 py-3 text-sm font-bold text-[#CC4A1A] transition-colors hover:bg-[#FFF3EE]"
              >
                <span className="inline-flex items-center gap-2">
                  <Search size={17} />
                  {link.label}
                </span>
                <ExternalLink size={16} />
              </a>
            ))}
          </div>

          {marketMessage && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
              <p>{marketMessage}</p>
              {marketSourceUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {marketSourceUrls.slice(0, 3).map((url) => (
                    <a key={url} href={url} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#CC4A1A] hover:underline">
                      Kaynağı aç
                      <ExternalLink size={13} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {emsaller.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm leading-6 text-slate-600">
                Henüz emsal yok. Güncel emsal getirebilir veya manuel emsal ekleyebilirsiniz.
              </div>
            )}
            {emsaller.map((emsal, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_1fr]">
                <Field label="Kaynak">
                  <SelectInput value={emsal.kaynak} options={emsalKaynaklari} onChange={(value) => updateEmsal(index, "kaynak", value)} />
                </Field>
                <Field label="Emsal fiyat">
                  <NumberInput value={emsal.fiyat} onChange={(value) => updateEmsal(index, "fiyat", value)} suffix="TL" step={10000} />
                </Field>
                <Field label="Emsal km">
                  <NumberInput value={emsal.kilometre ?? 0} onChange={(value) => updateEmsal(index, "kilometre", value)} suffix="km" step={1000} />
                </Field>
                {(emsal.baslik || emsal.url) && (
                  <div className="md:col-span-3">
                    {emsal.url ? (
                      <a href={emsal.url} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#CC4A1A] hover:underline">
                        {emsal.baslik ?? "Emsal ilanı aç"}
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-600">{emsal.baslik}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={calculate} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#E55A26] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20">
            <Calculator size={18} />
            Hesapla
          </button>
          <button type="button" onClick={() => { setValues(defaultValues); setHasCalculated(false); }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
            <RotateCcw size={18} />
            Sıfırla
          </button>
        </div>
      </section>

      <section ref={resultsRef} className={cn("scroll-mt-24 space-y-6", !hasCalculated && "opacity-80")}>
        <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#fff7f3_45%,#f8fafc_100%)] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#CC4A1A]">Tahmini piyasa değeri</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{formatTL(result.piyasaDegeri.ortalama)}</h2>
              <p className="mt-2 text-sm text-slate-600">{formatTL(result.piyasaDegeri.min)} - {formatTL(result.piyasaDegeri.max)} aralığında beklenen değer</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Hesaplama tabanı: {result.veriKaynagi.tip === "emsal" ? `${result.veriKaynagi.emsalSayisi} güncel emsal` : "marka/model referansı"}
                {result.veriKaynagi.tip !== "emsal" ? " · Güncel emsal ekleyince aralık daralır" : ""}
              </p>
            </div>
            <button type="button" onClick={share} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:border-[#FFD7C7] hover:bg-[#FFF3EE]">
              <Share2 size={17} />
              {shareCopied ? "Bağlantı kopyalandı" : "Bu sonuçları paylaş"}
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
              <span>Min</span>
              <span>Ortalama</span>
              <span>Max</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-[#CC4A1A] via-[#FF6B35] to-emerald-500" style={{ width: `${gaugePercent}%` }} />
              <div className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-4 border-white bg-slate-950 shadow" style={{ left: `calc(${gaugePercent}% - 14px)` }} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Gauge} label="Yıllık değer kaybı" value={formatPercent(result.degerKaybi.yillikOrtalamaYuzde)} helper={`${formatTL(result.degerKaybi.yillikOrtalamaTL)} / yıl`} />
          <MetricCard icon={Wallet} label="Yıllık sahip olma" value={formatTL(result.sahipOlmaMaliyeti.toplam)} helper="Yakıt, sigorta, bakım ve muayene dahil" />
          <MetricCard icon={Landmark} label="Aylık kredi taksiti" value={formatTL(result.kredi.aylikTaksit)} helper={`${result.kredi.vade} ay vadede toplam faiz ${formatTL(result.kredi.toplamFaiz)}`} />
          <MetricCard icon={ShieldCheck} label="Kullanım amortisi" value={`${result.amortisman.kacYildaAmorti} yıl`} helper={`${formatTL(result.amortisman.yillikKullanimDegeri)} yıllık kullanım değeri varsayımı`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-lg font-black text-slate-950">
              <Fuel size={20} className="text-[#CC4A1A]" />
              Yıllık sahip olma maliyeti
            </div>
            <CostRow label="Yakıt maliyeti" value={result.sahipOlmaMaliyeti.yakit} />
            <CostRow label="Sigorta tahmini" value={result.sahipOlmaMaliyeti.sigorta} />
            <CostRow label="Muayene / egzoz" value={result.sahipOlmaMaliyeti.muayeneEgzoz} />
            <CostRow label="Ortalama bakım" value={result.sahipOlmaMaliyeti.bakim} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">Değer kaybı analizi</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Toplam değer kaybı</p>
                <p className="mt-1 text-xl font-black text-slate-950">{formatTL(result.degerKaybi.toplamTL)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Toplam oran</p>
                <p className="mt-1 text-xl font-black text-slate-950">{formatPercent(result.degerKaybi.toplamYuzde)}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Yaş etkisi: -{formatPercent(result.etkiler.yasKaybiYuzde)}</p>
              <p>Kilometre etkisi: {result.etkiler.kmEtkisiYuzde >= 0 ? "-" : "+"}{formatPercent(Math.abs(result.etkiler.kmEtkisiYuzde))}</p>
              <p>Hasar kaydı etkisi: -{formatPercent(result.etkiler.hasarEtkisiYuzde)}</p>
              <p>Boya/değişen etkisi: -{formatPercent(result.etkiler.boyaEtkisiYuzde)}</p>
              <p>Donanım etkisi: {formatSignedPercent(result.etkiler.donanimEtkisiYuzde)}</p>
              <p>Bölge etkisi: {formatSignedPercent(result.etkiler.bolgeEtkisiYuzde)}</p>
              <p>Servis geçmişi etkisi: {formatSignedPercent(result.etkiler.servisEtkisiYuzde)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-lg font-black text-slate-950">
            <MapPin size={20} className="text-[#CC4A1A]" />
            Benzer bütçe karşılaştırması
          </div>
          <p className="text-sm font-bold text-slate-900">{result.karsilastirma.kararBasligi}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{result.karsilastirma.kararMetni}</p>
          {result.karsilastirma.alternatifler.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {result.karsilastirma.alternatifler.map((alternatif) => (
                <div key={`${alternatif.marka}-${alternatif.model}-${alternatif.yil}`} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-black text-slate-950">{alternatif.marka} {alternatif.model}</p>
                  <p className="mt-1 text-sm text-slate-500">{alternatif.yil} · {formatTL(alternatif.tahminiDeger)}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{alternatif.gerekce}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {result.veriKaynagi.aciklama} Yasal uyarı: Bu hesaplama yaklaşık ve bilgilendirme amaçlıdır. Gerçek satış fiyatı; aracın ekspertiz raporu, donanımı, il/ilçe piyasası, ilan rekabeti, servis geçmişi ve pazarlık koşullarına göre değişebilir.
        </p>
      </section>
    </div>
  );
}
