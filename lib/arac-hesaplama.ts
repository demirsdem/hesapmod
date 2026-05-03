import { ARAC_VERILERI, type AracMarka, type DonanimPaketi, type HasarKaydi, type ServisGecmisi, type VitesTipi, type YakitTipi } from "@/data/arac-verileri";

export type AracDegerInputs = {
  marka: AracMarka;
  model: string;
  yil: number;
  kilometre: number;
  yakitTipi: YakitTipi;
  vites: VitesTipi;
  donanimPaketi: DonanimPaketi;
  il: string;
  ilce: string;
  servisGecmisi: ServisGecmisi;
  hasarKaydi: HasarKaydi;
  boyaDegisenParca: number;
  yillikKm: number;
  krediTutari: number;
  krediVadesi: number;
  aylikFaiz: number;
  emsalFiyatlar?: AracPiyasaEmsali[];
};

export type AracPiyasaEmsali = {
  kaynak: "Sahibinden" | "arabam.com" | "TRAMER/Değerleme" | "Web" | "Kullanıcı";
  fiyat: number;
  kilometre?: number;
  baslik?: string;
  url?: string;
  il?: string;
  donanimPaketi?: string;
  fiyatTarihi?: string;
};

export type AracKarsilastirmaAlternatifi = {
  marka: string;
  model: string;
  yil: number;
  tahminiDeger: number;
  gerekce: string;
};

export type AracDegerSonucu = {
  sifirReferansFiyati: number;
  veriKaynagi: {
    tip: "emsal" | "offline";
    guven: "yüksek" | "orta" | "düşük";
    emsalSayisi: number;
    aciklama: string;
  };
  piyasaDegeri: {
    min: number;
    ortalama: number;
    max: number;
  };
  degerKaybi: {
    toplamTL: number;
    toplamYuzde: number;
    yillikOrtalamaYuzde: number;
    yillikOrtalamaTL: number;
  };
  sahipOlmaMaliyeti: {
    yakit: number;
    sigorta: number;
    muayeneEgzoz: number;
    bakim: number;
    toplam: number;
  };
  kredi: {
    tutar: number;
    vade: number;
    aylikTaksit: number;
    toplamOdeme: number;
    toplamFaiz: number;
  };
  amortisman: {
    yillikKullanimDegeri: number;
    kacYildaAmorti: number;
  };
  karsilastirma: {
    kararBasligi: string;
    kararMetni: string;
    alternatifler: AracKarsilastirmaAlternatifi[];
  };
  etkiler: {
    yas: number;
    yasKaybiYuzde: number;
    kmEtkisiYuzde: number;
    hasarEtkisiYuzde: number;
    boyaEtkisiYuzde: number;
    vitesEtkisiYuzde: number;
    yakitEtkisiYuzde: number;
    donanimEtkisiYuzde: number;
    bolgeEtkisiYuzde: number;
    servisEtkisiYuzde: number;
  };
};

const REFERANS_YIL = 2025;

const hasarEtkisi: Record<HasarKaydi, number> = {
  Yok: 0,
  Hafif: 0.08,
  Orta: 0.18,
  Ağır: 0.3,
};

const donanimEtkisi: Record<DonanimPaketi, number> = {
  Baz: -0.08,
  Orta: 0,
  Üst: 0.1,
  "Sport/Lüks": 0.18,
};

const servisEtkisi: Record<ServisGecmisi, number> = {
  "Yetkili servis kayıtlı": 0.04,
  "Özel servis kayıtlı": 0.01,
  "Kayıt yok/karışık": -0.06,
};

const ilPiyasaEtkisi: Record<string, number> = {
  İstanbul: 0.025,
  Ankara: 0.005,
  İzmir: 0.015,
  Bursa: 0.01,
  Antalya: 0.012,
  Kocaeli: 0.006,
  Konya: -0.004,
  Adana: -0.006,
  Gaziantep: -0.008,
  Kayseri: -0.01,
  Mersin: -0.004,
  Samsun: -0.008,
  Eskişehir: -0.003,
  Diyarbakır: -0.012,
  Diğer: -0.01,
};

const yakitCarpani: Record<YakitTipi, number> = {
  Benzin: 1,
  Dizel: 1.02,
  LPG: 0.96,
  Elektrik: 1.08,
  Hybrid: 1.07,
};

const yakitKmMaliyeti: Record<YakitTipi, number> = {
  Benzin: 4.1,
  Dizel: 3.65,
  LPG: 2.85,
  Elektrik: 0.95,
  Hybrid: 2.75,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getModelReferansFiyati(marka: AracMarka, model: string, yil: number) {
  const markaVerileri = ARAC_VERILERI[marka];
  const modelVerisi = markaVerileri?.find((item) => item.model === model) ?? markaVerileri?.[0];
  const referansFiyat = modelVerisi?.sifirFiyat2024 ?? 1250000;
  const yeniYilCarpani = yil >= 2025 ? 1.08 : 1;
  return Math.round(referansFiyat * yeniYilCarpani);
}

function tahminiAracDegeri(marka: AracMarka, model: string, yil: number, inputs: AracDegerInputs) {
  const yas = Math.max(0, REFERANS_YIL - yil);
  const yasKaybi = hesaplaYasKaybi(yas);
  const referansFiyat = getModelReferansFiyati(marka, model, yil);
  const donanimCarpani = donanimEtkisi[inputs.donanimPaketi] ?? 0;
  const bolgeCarpani = ilPiyasaEtkisi[inputs.il] ?? 0;
  const servisCarpani = servisEtkisi[inputs.servisGecmisi] ?? 0;
  const yakitCarpaniDegeri = yakitCarpani[inputs.yakitTipi] - 1;
  const vitesCarpani = inputs.vites === "Otomatik" ? 0.035 : 0;
  const kayipCarpani = 1 - yasKaybi - hasarEtkisi[inputs.hasarKaydi] - clamp(inputs.boyaDegisenParca * 0.02, 0, 0.24);

  return Math.round(referansFiyat * clamp(kayipCarpani + donanimCarpani + bolgeCarpani + servisCarpani + yakitCarpaniDegeri + vitesCarpani, 0.12, 1.08));
}

function hesaplaYasKaybi(yas: number) {
  if (yas <= 0) return 0.06;

  let kalanDegerCarpani = 1;
  for (let yil = 1; yil <= yas; yil += 1) {
    if (yil === 1) {
      kalanDegerCarpani *= 0.8;
    } else if (yil <= 5) {
      kalanDegerCarpani *= 0.88;
    } else if (yil <= 10) {
      kalanDegerCarpani *= 0.9;
    } else {
      kalanDegerCarpani *= 0.94;
    }
  }

  return clamp(1 - kalanDegerCarpani, 0, 0.88);
}

function hesaplaKrediTaksiti(tutar: number, vade: number, aylikFaiz: number) {
  if (tutar <= 0 || vade <= 0) return 0;
  const oran = Math.max(0, aylikFaiz) / 100;
  if (oran === 0) return tutar / vade;
  return (tutar * oran * Math.pow(1 + oran, vade)) / (Math.pow(1 + oran, vade) - 1);
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function normalizeEmsalFiyati(emsal: AracPiyasaEmsali, hedefKm: number) {
  const fiyat = Number.isFinite(emsal.fiyat) ? emsal.fiyat : 0;
  if (fiyat <= 0) return 0;
  if (!emsal.kilometre || emsal.kilometre <= 0) return fiyat;

  const kmFarki = emsal.kilometre - hedefKm;
  const kmDuzeltmesi = clamp((kmFarki / 10000) * 0.012, -0.08, 0.16);
  return Math.round(fiyat * (1 + kmDuzeltmesi));
}

function hesaplaEmsalBazDeger(emsaller: AracPiyasaEmsali[] | undefined, hedefKm: number) {
  const fiyatlar = (emsaller ?? [])
    .map((emsal) => normalizeEmsalFiyati(emsal, hedefKm))
    .filter((fiyat) => fiyat > 100000)
    .sort((a, b) => a - b);

  if (fiyatlar.length < 2) return null;

  const merkez = median(fiyatlar);
  const kirpilmis = fiyatlar.filter((fiyat) => fiyat >= merkez * 0.72 && fiyat <= merkez * 1.28);
  const temizFiyatlar = kirpilmis.length >= 2 ? kirpilmis : fiyatlar;

  return {
    deger: Math.round(median(temizFiyatlar)),
    sayi: temizFiyatlar.length,
  };
}

function buildKarsilastirma(inputs: AracDegerInputs, ortalama: number, emsalSayisi: number) {
  const adaylar = Object.entries(ARAC_VERILERI)
    .flatMap(([marka, modeller]) =>
      modeller.map((modelVerisi) => {
        const yil = modelVerisi.segment === "premium" ? Math.max(2017, inputs.yil - 2) : Math.min(REFERANS_YIL, inputs.yil + 1);
        const tahminiDeger = tahminiAracDegeri(marka, modelVerisi.model, yil, {
          ...inputs,
          marka,
          model: modelVerisi.model,
          yil,
          hasarKaydi: "Yok",
          boyaDegisenParca: 0,
          servisGecmisi: inputs.servisGecmisi === "Kayıt yok/karışık" ? "Özel servis kayıtlı" : inputs.servisGecmisi,
        });

        const farkOrani = Math.abs(tahminiDeger - ortalama) / Math.max(ortalama, 1);
        return { marka, model: modelVerisi.model, yil, tahminiDeger, segment: modelVerisi.segment, farkOrani };
      })
    )
    .filter((aday) => aday.farkOrani <= 0.18 && !(aday.marka === inputs.marka && aday.model === inputs.model))
    .sort((a, b) => a.farkOrani - b.farkOrani)
    .slice(0, 3);

  const alternatifler = adaylar.map((aday) => ({
    marka: aday.marka,
    model: aday.model,
    yil: aday.yil,
    tahminiDeger: aday.tahminiDeger,
    gerekce: aday.segment === "premium"
      ? "Benzer bütçede daha premium ama genelde daha yaşlı bir seçenek."
      : aday.yil > inputs.yil
        ? "Benzer bütçede daha yeni ve bakım riski daha düşük bir alternatif."
        : "Benzer bütçede farklı kasa/segment seçeneği.",
  }));

  if (inputs.hasarKaydi === "Ağır") {
    return {
      kararBasligi: "Alternatifleri ciddi kontrol edin",
      kararMetni: "Ağır hasarlı araçta fiyat cazip görünse bile ikinci satış, sigorta ve ekspertiz riski büyür. Aynı bütçedeki hasarsız alternatiflerle birlikte değerlendirmek daha sağlıklı olur.",
      alternatifler,
    };
  }

  if (emsalSayisi < 2) {
    return {
      kararBasligi: "Emsal olmadan karar vermeyin",
      kararMetni: "Bu sonuç referans katsayılarla üretildi. Satın alma kararından önce canlı emsal getirip fiyatın piyasa aralığında kaldığını kontrol edin.",
      alternatifler,
    };
  }

  return {
    kararBasligi: "Piyasa ile karşılaştırın",
    kararMetni: "Bu araç emsal medyanına göre değerlendirildi. İstenen satış fiyatı hesaplanan üst aralığa yaklaşıyorsa pazarlık payı veya benzer bütçedeki alternatifler önem kazanır.",
    alternatifler,
  };
}

export function aracDegerHesapla(inputs: AracDegerInputs): AracDegerSonucu {
  const yas = Math.max(0, REFERANS_YIL - inputs.yil);
  const sifirReferansFiyati = getModelReferansFiyati(inputs.marka, inputs.model, inputs.yil);
  const yasKaybi = hesaplaYasKaybi(yas);
  const idealKm = Math.max(1, yas) * 12000;
  const kmFarki = inputs.kilometre - idealKm;
  const kmEtkisi = clamp((kmFarki / 10000) * 0.015, -0.08, 0.28);
  const boyaEtkisi = clamp(inputs.boyaDegisenParca * 0.02, 0, 0.24);
  const vitesEtkisi = inputs.vites === "Otomatik" ? 0.035 : 0;
  const yakitEtkisi = yakitCarpani[inputs.yakitTipi] - 1;
  const donanimCarpani = donanimEtkisi[inputs.donanimPaketi] ?? 0;
  const bolgeCarpani = ilPiyasaEtkisi[inputs.il] ?? 0;
  const servisCarpani = servisEtkisi[inputs.servisGecmisi] ?? 0;
  const emsalBaz = hesaplaEmsalBazDeger(inputs.emsalFiyatlar, inputs.kilometre);

  let ortalama: number;
  if (emsalBaz) {
    const kondisyonCarpani = 1 - hasarEtkisi[inputs.hasarKaydi] - boyaEtkisi + vitesEtkisi + yakitEtkisi + donanimCarpani + bolgeCarpani + servisCarpani;
    ortalama = Math.round(emsalBaz.deger * clamp(kondisyonCarpani, 0.55, 1.12));
  } else {
    const kayipCarpani = 1 - yasKaybi - Math.max(0, kmEtkisi) - hasarEtkisi[inputs.hasarKaydi] - boyaEtkisi;
    const dusukKmPrimi = kmEtkisi < 0 ? Math.abs(kmEtkisi) : 0;
    ortalama = Math.round(sifirReferansFiyati * clamp(kayipCarpani + dusukKmPrimi + vitesEtkisi + yakitEtkisi + donanimCarpani + bolgeCarpani + servisCarpani, 0.12, 1.08));
  }

  const belirsizlik = emsalBaz
    ? emsalBaz.sayi >= 4 ? 0.055 : 0.075
    : inputs.hasarKaydi === "Ağır" ? 0.16 : inputs.hasarKaydi === "Orta" ? 0.13 : 0.1;
  const min = Math.round(ortalama * (1 - belirsizlik));
  const max = Math.round(ortalama * (1 + belirsizlik));

  const toplamKayip = Math.max(0, sifirReferansFiyati - ortalama);
  const toplamKayipYuzde = sifirReferansFiyati > 0 ? (toplamKayip / sifirReferansFiyati) * 100 : 0;
  const yillikOrtalamaYuzde = yas > 0 ? toplamKayipYuzde / yas : toplamKayipYuzde;

  const yakit = Math.round(inputs.yillikKm * yakitKmMaliyeti[inputs.yakitTipi]);
  const sigorta = Math.round(clamp(ortalama * 0.018, 12000, 85000));
  const muayeneEgzoz = inputs.yakitTipi === "Elektrik" ? 2600 : 3300;
  const bakimYasCarpani = yas > 10 ? 1.45 : yas > 5 ? 1.2 : 1;
  const bakim = Math.round(clamp(ortalama * 0.018 * bakimYasCarpani, 14000, 95000));
  const sahipOlmaToplam = yakit + sigorta + muayeneEgzoz + bakim;

  const aylikTaksit = hesaplaKrediTaksiti(inputs.krediTutari, inputs.krediVadesi, inputs.aylikFaiz);
  const toplamOdeme = aylikTaksit * inputs.krediVadesi;

  const yillikKullanimDegeri = Math.round(Math.max(60000, inputs.yillikKm * 8.5));
  const netYillikFayda = Math.max(1, yillikKullanimDegeri - sahipOlmaToplam);

  const karsilastirma = buildKarsilastirma(inputs, ortalama, emsalBaz?.sayi ?? 0);

  return {
    sifirReferansFiyati,
    veriKaynagi: emsalBaz
      ? {
        tip: "emsal",
        guven: emsalBaz.sayi >= 4 ? "yüksek" : "orta",
        emsalSayisi: emsalBaz.sayi,
        aciklama: "Sonuç, kullanıcı tarafından girilen emsal ilan/değerleme fiyatlarının kilometreye göre normalize edilmiş medyanı üzerinden hesaplandı.",
      }
      : {
        tip: "offline",
        guven: "düşük",
        emsalSayisi: 0,
        aciklama: "Canlı emsal bulunmadığında sonuç marka/model referansı, kondisyon, donanım, bölge ve servis geçmişi katsayılarıyla hesaplanır. Güncel emsal eklemek aralığı daraltır.",
      },
    piyasaDegeri: {
      min,
      ortalama,
      max,
    },
    degerKaybi: {
      toplamTL: Math.round(toplamKayip),
      toplamYuzde: toplamKayipYuzde,
      yillikOrtalamaYuzde,
      yillikOrtalamaTL: Math.round(yas > 0 ? toplamKayip / yas : toplamKayip),
    },
    sahipOlmaMaliyeti: {
      yakit,
      sigorta,
      muayeneEgzoz,
      bakim,
      toplam: sahipOlmaToplam,
    },
    kredi: {
      tutar: inputs.krediTutari,
      vade: inputs.krediVadesi,
      aylikTaksit: Math.round(aylikTaksit),
      toplamOdeme: Math.round(toplamOdeme),
      toplamFaiz: Math.round(Math.max(0, toplamOdeme - inputs.krediTutari)),
    },
    amortisman: {
      yillikKullanimDegeri,
      kacYildaAmorti: Math.round((ortalama / netYillikFayda) * 10) / 10,
    },
    karsilastirma,
    etkiler: {
      yas,
      yasKaybiYuzde: yasKaybi * 100,
      kmEtkisiYuzde: kmEtkisi * 100,
      hasarEtkisiYuzde: hasarEtkisi[inputs.hasarKaydi] * 100,
      boyaEtkisiYuzde: boyaEtkisi * 100,
      vitesEtkisiYuzde: vitesEtkisi * 100,
      yakitEtkisiYuzde: yakitEtkisi * 100,
      donanimEtkisiYuzde: donanimCarpani * 100,
      bolgeEtkisiYuzde: bolgeCarpani * 100,
      servisEtkisiYuzde: servisCarpani * 100,
    },
  };
}
