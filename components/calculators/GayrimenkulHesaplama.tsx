"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightLeft, Home, Share2, TrendingUp } from "lucide-react";
import DegerModulu from "@/components/calculators/gayrimenkul/DegerModulu";
import KiraKrediModulu from "@/components/calculators/gayrimenkul/KiraKrediModulu";
import YatirimModulu from "@/components/calculators/gayrimenkul/YatirimModulu";
import {
  CEPHE_SECENEKLERI,
  GAYRIMENKUL_TIPLERI,
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
import {
  hesaplaGayrimenkulDegeri,
  hesaplaKiraKredi,
  hesaplaYatirimAnalizi,
  type DegerInputs,
  type KiraKrediInputs,
  type YatirimInputs,
} from "@/lib/gayrimenkul-hesaplama";
import { cn } from "@/lib/utils";

type ActiveTab = "deger" | "yatirim" | "kira-kredi";

const defaultDegerInputs: DegerInputs = {
  gayrimenkulTipi: "Daire",
  il: "İstanbul",
  ilce: "Kadıköy",
  mahalle: "Suadiye",
  brutM2: 125,
  netM2: 105,
  odaSayisi: "3+1",
  binaYasi: 8,
  toplamKat: 12,
  bulunduguKat: 6,
  isinmaTipi: "Kombi",
  tapuDurumu: "Kat mülkiyeti",
  krediyeUygun: true,
  cephe: "Güney",
  kullaniciFiyati: 0,
};

const defaultYatirimInputs: YatirimInputs = {
  satisFiyati: 0,
  aylikKira: 65000,
  aidat: 3500,
  yillikKiraArtisi: 25,
  yillikDegerArtisi: 22,
  alternatifGetiri: 38,
};

const defaultKiraKrediInputs: KiraKrediInputs = {
  mevcutKira: 55000,
  evFiyati: 0,
  pesinat: 3000000,
  krediVadesiAy: 120,
  aylikFaiz: 2.89,
  kiraArtisi: 25,
};

const tabs = [
  { id: "deger", label: "Değer", icon: Home },
  { id: "yatirim", label: "Yatırım", icon: TrendingUp },
  { id: "kira-kredi", label: "Kira-Kredi", icon: ArrowRightLeft },
] as const;

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

function readNumber(params: URLSearchParams, key: string, fallback: number) {
  const raw = params.get(key);
  if (raw === null) return fallback;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBoolean(params: URLSearchParams, key: string, fallback: boolean) {
  const raw = params.get(key);
  if (raw === null) return fallback;
  return raw === "1" || raw === "true";
}

function readOption<T extends string>(params: URLSearchParams, key: string, options: readonly T[], fallback: T) {
  const raw = params.get(key);
  return options.includes(raw as T) ? raw as T : fallback;
}

function setParamsFromObject(params: URLSearchParams, prefix: string, values: Record<string, string | number | boolean>) {
  Object.entries(values).forEach(([key, value]) => {
    params.set(`${prefix}_${key}`, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
  });
}

export default function GayrimenkulHesaplama() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("deger");
  const [degerValues, setDegerValues] = useState<DegerInputs>(defaultDegerInputs);
  const [yatirimValues, setYatirimValues] = useState<YatirimInputs>(defaultYatirimInputs);
  const [kiraKrediValues, setKiraKrediValues] = useState<KiraKrediInputs>(defaultKiraKrediInputs);
  const [shareCopied, setShareCopied] = useState(false);
  const linkedPriceRef = useRef(0);

  const degerResult = useMemo(() => hesaplaGayrimenkulDegeri(degerValues), [degerValues]);
  const linkedPrice = useMemo(() => roundTo(degerResult.degerAraligi.ortalama, 1000), [degerResult.degerAraligi.ortalama]);

  useEffect(() => {
    const previousLinkedPrice = linkedPriceRef.current;
    setYatirimValues((current) => (
      current.satisFiyati <= 0 || current.satisFiyati === previousLinkedPrice
        ? { ...current, satisFiyati: linkedPrice }
        : current
    ));
    setKiraKrediValues((current) => (
      current.evFiyati <= 0 || current.evFiyati === previousLinkedPrice
        ? { ...current, evFiyati: linkedPrice }
        : current
    ));
    linkedPriceRef.current = linkedPrice;
  }, [linkedPrice]);

  const yatirimResult = useMemo(() => hesaplaYatirimAnalizi(yatirimValues), [yatirimValues]);
  const kiraKrediResult = useMemo(() => hesaplaKiraKredi(kiraKrediValues), [kiraKrediValues]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "deger" || tab === "yatirim" || tab === "kira-kredi") {
      setActiveTab(tab);
    }

    if (params.size === 0) return;

    const nextDeger: DegerInputs = {
      gayrimenkulTipi: readOption<GayrimenkulTipi>(params, "d_tip", GAYRIMENKUL_TIPLERI, defaultDegerInputs.gayrimenkulTipi),
      il: readOption<IlAdi>(params, "d_il", IL_SECENEKLERI, defaultDegerInputs.il),
      ilce: params.get("d_ilce") ?? defaultDegerInputs.ilce,
      mahalle: params.get("d_mahalle") ?? defaultDegerInputs.mahalle,
      brutM2: readNumber(params, "d_brutM2", defaultDegerInputs.brutM2),
      netM2: readNumber(params, "d_netM2", defaultDegerInputs.netM2),
      odaSayisi: readOption<OdaSayisi>(params, "d_oda", ODA_SECENEKLERI, defaultDegerInputs.odaSayisi),
      binaYasi: readNumber(params, "d_yas", defaultDegerInputs.binaYasi),
      toplamKat: readNumber(params, "d_toplamKat", defaultDegerInputs.toplamKat),
      bulunduguKat: readNumber(params, "d_kat", defaultDegerInputs.bulunduguKat),
      isinmaTipi: readOption<IsinmaTipi>(params, "d_isinma", ISINMA_TIPLERI, defaultDegerInputs.isinmaTipi),
      tapuDurumu: readOption<TapuDurumu>(params, "d_tapu", TAPU_DURUMLARI, defaultDegerInputs.tapuDurumu),
      krediyeUygun: readBoolean(params, "d_kredi", defaultDegerInputs.krediyeUygun),
      cephe: readOption<CepheTipi>(params, "d_cephe", CEPHE_SECENEKLERI, defaultDegerInputs.cephe),
      kullaniciFiyati: readNumber(params, "d_fiyat", defaultDegerInputs.kullaniciFiyati),
    };

    const nextYatirim: YatirimInputs = {
      satisFiyati: readNumber(params, "y_satis", defaultYatirimInputs.satisFiyati),
      aylikKira: readNumber(params, "y_kira", defaultYatirimInputs.aylikKira),
      aidat: readNumber(params, "y_aidat", defaultYatirimInputs.aidat),
      yillikKiraArtisi: readNumber(params, "y_kiraArtis", defaultYatirimInputs.yillikKiraArtisi),
      yillikDegerArtisi: readNumber(params, "y_degerArtis", defaultYatirimInputs.yillikDegerArtisi),
      alternatifGetiri: readNumber(params, "y_alt", defaultYatirimInputs.alternatifGetiri),
    };

    const nextKiraKredi: KiraKrediInputs = {
      mevcutKira: readNumber(params, "k_kira", defaultKiraKrediInputs.mevcutKira),
      evFiyati: readNumber(params, "k_ev", defaultKiraKrediInputs.evFiyati),
      pesinat: readNumber(params, "k_pesinat", defaultKiraKrediInputs.pesinat),
      krediVadesiAy: readNumber(params, "k_vade", defaultKiraKrediInputs.krediVadesiAy),
      aylikFaiz: readNumber(params, "k_faiz", defaultKiraKrediInputs.aylikFaiz),
      kiraArtisi: readNumber(params, "k_artis", defaultKiraKrediInputs.kiraArtisi),
    };

    setDegerValues(nextDeger);
    setYatirimValues(nextYatirim);
    setKiraKrediValues(nextKiraKredi);
  }, []);

  const updateDeger = <K extends keyof DegerInputs>(key: K, value: DegerInputs[K]) => {
    setDegerValues((current) => ({ ...current, [key]: value }));
  };

  const updateYatirim = <K extends keyof YatirimInputs>(key: K, value: YatirimInputs[K]) => {
    setYatirimValues((current) => ({ ...current, [key]: value }));
  };

  const updateKiraKredi = <K extends keyof KiraKrediInputs>(key: K, value: KiraKrediInputs[K]) => {
    setKiraKrediValues((current) => ({ ...current, [key]: value }));
  };

  const share = async () => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    setParamsFromObject(params, "d", {
      tip: degerValues.gayrimenkulTipi,
      il: degerValues.il,
      ilce: degerValues.ilce,
      mahalle: degerValues.mahalle,
      brutM2: degerValues.brutM2,
      netM2: degerValues.netM2,
      oda: degerValues.odaSayisi,
      yas: degerValues.binaYasi,
      toplamKat: degerValues.toplamKat,
      kat: degerValues.bulunduguKat,
      isinma: degerValues.isinmaTipi,
      tapu: degerValues.tapuDurumu,
      kredi: degerValues.krediyeUygun,
      cephe: degerValues.cephe,
      fiyat: degerValues.kullaniciFiyati,
    });
    setParamsFromObject(params, "y", {
      satis: yatirimValues.satisFiyati,
      kira: yatirimValues.aylikKira,
      aidat: yatirimValues.aidat,
      kiraArtis: yatirimValues.yillikKiraArtisi,
      degerArtis: yatirimValues.yillikDegerArtisi,
      alt: yatirimValues.alternatifGetiri,
    });
    setParamsFromObject(params, "k", {
      kira: kiraKrediValues.mevcutKira,
      ev: kiraKrediValues.evFiyati,
      pesinat: kiraKrediValues.pesinat,
      vade: kiraKrediValues.krediVadesiAy,
      faiz: kiraKrediValues.aylikFaiz,
      artis: kiraKrediValues.kiraArtisi,
    });

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);

    try {
      await navigator.clipboard?.writeText(url);
    } catch {
      // URL remains in the address bar when clipboard access is blocked.
    }

    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1600);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-black transition-colors",
                  active ? "bg-[#FF6B35] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#FFD7C7] bg-[#FFF3EE] px-4 py-3 text-sm leading-6 text-[#9A3412]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Değer sekmesindeki tahmini ortalama fiyat, Yatırım ve Kira-Kredi sekmelerindeki fiyat alanlarına otomatik aktarılır.
          </span>
          <button type="button" onClick={share} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#CC4A1A] shadow-sm transition-colors hover:bg-orange-50">
            <Share2 size={16} />
            Paylaş
          </button>
        </div>
      </section>

      {activeTab === "deger" && (
        <DegerModulu
          values={degerValues}
          result={degerResult}
          onChange={updateDeger}
          onShare={share}
          shareCopied={shareCopied}
        />
      )}

      {activeTab === "yatirim" && (
        <YatirimModulu
          values={yatirimValues}
          result={yatirimResult}
          onChange={updateYatirim}
          onShare={share}
          shareCopied={shareCopied}
        />
      )}

      {activeTab === "kira-kredi" && (
        <KiraKrediModulu
          values={kiraKrediValues}
          result={kiraKrediResult}
          onChange={updateKiraKredi}
          onShare={share}
          shareCopied={shareCopied}
        />
      )}
    </div>
  );
}
