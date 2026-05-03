import {
  IL_PIYASA_ORTALAMALARI,
  ILCE_PIYASA_ORTALAMALARI,
  PIYASA_KAYNAK_METNI,
  PIYASA_REFERANS_TARIHI,
  type CepheTipi,
  type GayrimenkulTipi,
  type IlAdi,
  type IsinmaTipi,
  type OdaSayisi,
  type PiyasaReferansKaydi,
  type TapuDurumu,
} from "@/data/gayrimenkul-verileri";

export type DegerInputs = {
  gayrimenkulTipi: GayrimenkulTipi;
  il: IlAdi;
  ilce: string;
  mahalle: string;
  brutM2: number;
  netM2: number;
  odaSayisi: OdaSayisi;
  binaYasi: number;
  toplamKat: number;
  bulunduguKat: number;
  isinmaTipi: IsinmaTipi;
  tapuDurumu: TapuDurumu;
  krediyeUygun: boolean;
  cephe: CepheTipi;
  kullaniciFiyati: number;
};

export type PiyasaKiyasSonucu = {
  skor: number;
  etiket: string;
  aciklama: string;
  farkYuzde: number;
  ton: "green" | "yellow" | "red" | "slate";
};

export type DegerResult = {
  birimM2Fiyati: number;
  efektifM2: number;
  degerAraligi: {
    min: number;
    ortalama: number;
    max: number;
  };
  piyasaSkoru: PiyasaKiyasSonucu;
  guvenSkoru: number;
  girilenDetaySayisi: number;
  toplamDetaySayisi: number;
  referans: {
    il: IlAdi;
    ilce?: string;
    kapsam: "İlçe" | "İl";
    m2Fiyat: number;
    tarih: string;
    kaynak: string;
    not?: string;
  };
  etkiler: Array<{
    label: string;
    oran: number;
  }>;
};

export type YatirimInputs = {
  satisFiyati: number;
  aylikKira: number;
  aidat: number;
  yillikKiraArtisi: number;
  yillikDegerArtisi: number;
  alternatifGetiri: number;
};

export type YatirimResult = {
  brutKiraGetirisi: number;
  netKiraGetirisi: number;
  amortiSuresiYil: number;
  toplamNetKira10Yil: number;
  gayrimenkulDegeri10Yil: number;
  gayrimenkulToplamKazanc: number;
  alternatifToplamDeger: number;
  alternatifToplamKazanc: number;
  mantikSkoru: {
    skor: number;
    etiket: string;
    aciklama: string;
    ton: "green" | "yellow" | "red";
  };
  projeksiyon: Array<{
    yil: number;
    kiraGeliri: number;
    gayrimenkulDegeri: number;
    gayrimenkulToplam: number;
    alternatifDeger: number;
  }>;
  barData: Array<{
    name: string;
    getiri: number;
  }>;
};

export type KiraKrediInputs = {
  mevcutKira: number;
  evFiyati: number;
  pesinat: number;
  krediVadesiAy: number;
  aylikFaiz: number;
  kiraArtisi: number;
};

export type KiraKrediResult = {
  krediTutari: number;
  aylikTaksit: number;
  toplamKrediOdemesi10Yil: number;
  toplamKira10Yil: number;
  toplamOdemeFarki: number;
  kalanAnapara10Yil: number;
  evSahibiNetPozisyon: number;
  kiraciNetPozisyon: number;
  avantaj: {
    etiket: string;
    aciklama: string;
    ton: "green" | "yellow" | "red";
  };
  kiraKrediyiGectigiAy: number | null;
  grafik: Array<{
    ay: number;
    yil: string;
    kira: number;
    kredi: number;
    kümülatifKira: number;
    kümülatifKredi: number;
  }>;
};

const PROPERTY_TYPE_FACTORS: Record<GayrimenkulTipi, number> = {
  Daire: 1,
  Villa: 1.32,
  Arsa: 0.34,
  Dükkan: 1.58,
  Ofis: 1.22,
};

const ROOM_FACTORS: Record<OdaSayisi, number> = {
  "1+0": 0.92,
  "1+1": 0.96,
  "2+1": 1,
  "3+1": 1.04,
  "4+1": 1.08,
  "4+2+": 1.12,
};

const HEATING_FACTORS: Record<IsinmaTipi, number> = {
  Merkezi: 1.03,
  Kombi: 1,
  "Yerden Isıtma": 1.08,
  Klima: 0.95,
};

const TITLE_FACTORS: Record<TapuDurumu, number> = {
  "Kat mülkiyeti": 1.05,
  "Kat irtifakı": 1,
  Hisseli: 0.86,
  Arsa: 0.93,
};

const FACADE_FACTORS: Record<CepheTipi, number> = {
  Kuzey: 0.97,
  Güney: 1.04,
  Doğu: 1,
  Batı: 1.01,
  Köşe: 1.06,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value: number, step: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value / step) * step;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

function getAgeFactor(age: number) {
  if (age <= 0) return 1.12;
  if (age <= 4) return 1.1;
  if (age <= 10) return 1.04;
  if (age <= 15) return 0.98;
  if (age <= 25) return 0.9;
  if (age <= 35) return 0.84;
  return 0.78;
}

function getFloorFactor(totalFloors: number, currentFloor: number, propertyType: GayrimenkulTipi) {
  if (propertyType === "Arsa") return 1;
  if (propertyType === "Dükkan") return currentFloor <= 1 ? 1.12 : 0.95;
  if (propertyType === "Villa") return 1.04;
  if (totalFloors <= 1) return 1;
  if (currentFloor <= 0) return 0.94;
  if (currentFloor === totalFloors && totalFloors >= 5) return 0.97;
  if (currentFloor > 1 && currentFloor < totalFloors) return 1.03;
  return 1;
}

function getAreaFactor(values: DegerInputs) {
  const area = values.netM2 > 0 ? values.netM2 : values.brutM2 * 0.85;

  if (values.gayrimenkulTipi === "Arsa") return 1;
  if (values.gayrimenkulTipi === "Dükkan" || values.gayrimenkulTipi === "Ofis") {
    if (area < 45) return 1.1;
    if (area > 250) return 0.94;
    return 1;
  }

  if (area < 55) return 1.06;
  if (area <= 140) return 1;
  if (area <= 220) return 0.96;
  return 0.92;
}

export function getPiyasaReferansi(il: IlAdi, ilce: string) {
  const ilceMap = ILCE_PIYASA_ORTALAMALARI[il];
  const normalizedDistrict = normalize(ilce);
  const districtName = Object.keys(ilceMap ?? {}).find((name) => normalize(name) === normalizedDistrict);

  if (ilceMap && districtName) {
    return {
      kapsam: "İlçe" as const,
      il,
      ilce: districtName,
      kayit: ilceMap[districtName],
    };
  }

  return {
    kapsam: "İl" as const,
    il,
    kayit: IL_PIYASA_ORTALAMALARI[il],
  };
}

function getEffectiveArea(values: DegerInputs) {
  if (values.gayrimenkulTipi === "Arsa") return Math.max(1, values.brutM2);
  if (values.netM2 > 0) return values.netM2;
  return Math.max(1, values.brutM2 * 0.85);
}

function countDetails(values: DegerInputs, hasDistrictReference: boolean) {
  const checks = [
    values.gayrimenkulTipi,
    values.il,
    values.ilce,
    values.mahalle,
    values.brutM2 > 0,
    values.netM2 > 0,
    values.odaSayisi,
    values.binaYasi >= 0,
    values.toplamKat > 0,
    values.bulunduguKat >= 0,
    values.isinmaTipi,
    values.tapuDurumu,
    typeof values.krediyeUygun === "boolean",
    values.cephe,
    values.kullaniciFiyati > 0,
    hasDistrictReference,
  ];

  return checks.filter(Boolean).length;
}

function getMarketScore(values: DegerInputs, averageValue: number, unitPrice: number, reference: PiyasaReferansKaydi): PiyasaKiyasSonucu {
  const userPrice = values.kullaniciFiyati;
  const compareValue = userPrice > 0 ? userPrice : unitPrice * getEffectiveArea(values);
  const diff = averageValue > 0 ? (compareValue - averageValue) / averageValue : 0;

  if (userPrice > 0) {
    if (diff <= -0.12) {
      return {
        skor: clamp(Math.round(86 + Math.abs(diff) * 40), 0, 96),
        etiket: "Piyasanın altında",
        aciklama: "Girilen fiyat, referans değerin altında kaldığı için alıcı açısından avantajlı görünüyor.",
        farkYuzde: diff * 100,
        ton: "green",
      };
    }

    if (diff >= 0.15) {
      return {
        skor: clamp(Math.round(48 - diff * 60), 12, 58),
        etiket: "Piyasanın üzerinde",
        aciklama: "Girilen fiyat, benzer lokasyon ortalamasının belirgin üzerinde.",
        farkYuzde: diff * 100,
        ton: "red",
      };
    }

    return {
      skor: clamp(Math.round(76 - Math.abs(diff) * 60), 62, 84),
      etiket: "Piyasa bandında",
      aciklama: "Girilen fiyat referans aralığa yakın; pazarlık ve emsal ilan kontrolü yine önemli.",
      farkYuzde: diff * 100,
      ton: "yellow",
    };
  }

  const unitDiff = reference.m2Fiyat > 0 ? (unitPrice - reference.m2Fiyat) / reference.m2Fiyat : 0;
  return {
    skor: clamp(Math.round(74 - Math.abs(unitDiff) * 35), 55, 86),
    etiket: "Piyasa bandı tahmini",
    aciklama: "Kullanıcı fiyatı girilmediği için skor, seçilen niteliklerin bölge ortalamasına etkisine göre hesaplandı.",
    farkYuzde: unitDiff * 100,
    ton: "slate",
  };
}

export function hesaplaGayrimenkulDegeri(values: DegerInputs): DegerResult {
  const referenceResult = getPiyasaReferansi(values.il, values.ilce);
  const reference = referenceResult.kayit;
  const effectiveArea = getEffectiveArea(values);

  const effects = [
    { label: "Gayrimenkul tipi", oran: PROPERTY_TYPE_FACTORS[values.gayrimenkulTipi] - 1 },
    { label: "Oda planı", oran: values.gayrimenkulTipi === "Daire" || values.gayrimenkulTipi === "Villa" ? ROOM_FACTORS[values.odaSayisi] - 1 : 0 },
    { label: "Bina yaşı", oran: getAgeFactor(values.binaYasi) - 1 },
    { label: "Kat konumu", oran: getFloorFactor(values.toplamKat, values.bulunduguKat, values.gayrimenkulTipi) - 1 },
    { label: "Isınma", oran: values.gayrimenkulTipi === "Arsa" ? 0 : HEATING_FACTORS[values.isinmaTipi] - 1 },
    { label: "Tapu", oran: TITLE_FACTORS[values.tapuDurumu] - 1 },
    { label: "Kredi uygunluğu", oran: values.krediyeUygun ? 0.03 : -0.08 },
    { label: "Cephe", oran: values.gayrimenkulTipi === "Arsa" ? 0 : FACADE_FACTORS[values.cephe] - 1 },
    { label: "Alan verimliliği", oran: getAreaFactor(values) - 1 },
  ];

  const totalFactor = effects.reduce((factor, effect) => factor * (1 + effect.oran), 1);
  const unitPrice = roundTo(reference.m2Fiyat * totalFactor, 100);
  const averageValue = roundTo(unitPrice * effectiveArea, 1000);
  const detailCount = countDetails(values, referenceResult.kapsam === "İlçe");
  const confidence = clamp(42 + detailCount * 3 + (referenceResult.kapsam === "İlçe" ? 8 : 0), 45, 96);
  const rangeSpread = clamp(0.08 + (100 - confidence) / 260 + (values.gayrimenkulTipi === "Arsa" ? 0.07 : 0), 0.1, 0.34);

  return {
    birimM2Fiyati: unitPrice,
    efektifM2: effectiveArea,
    degerAraligi: {
      min: roundTo(averageValue * (1 - rangeSpread), 1000),
      ortalama: averageValue,
      max: roundTo(averageValue * (1 + rangeSpread), 1000),
    },
    piyasaSkoru: getMarketScore(values, averageValue, unitPrice, reference),
    guvenSkoru: confidence,
    girilenDetaySayisi: detailCount,
    toplamDetaySayisi: 16,
    referans: {
      il: values.il,
      ilce: referenceResult.kapsam === "İlçe" ? referenceResult.ilce : undefined,
      kapsam: referenceResult.kapsam,
      m2Fiyat: reference.m2Fiyat,
      tarih: PIYASA_REFERANS_TARIHI,
      kaynak: PIYASA_KAYNAK_METNI,
      not: reference.not,
    },
    etkiler: effects,
  };
}

function monthlyPayment(principal: number, monthlyRatePercent: number, months: number) {
  const rate = monthlyRatePercent / 100;
  if (principal <= 0 || months <= 0) return 0;
  if (rate <= 0) return principal / months;
  const powered = Math.pow(1 + rate, months);
  return principal * rate * powered / (powered - 1);
}

export function hesaplaYatirimAnalizi(values: YatirimInputs): YatirimResult {
  const salePrice = Math.max(0, values.satisFiyati);
  const monthlyRent = Math.max(0, values.aylikKira);
  const monthlyNetRent = Math.max(0, monthlyRent - Math.max(0, values.aidat));
  const rentGrowth = values.yillikKiraArtisi / 100;
  const valueGrowth = values.yillikDegerArtisi / 100;
  const alternativeGrowth = values.alternatifGetiri / 100;
  const brutYield = salePrice > 0 ? (monthlyRent * 12 / salePrice) * 100 : 0;
  const netYield = salePrice > 0 ? (monthlyNetRent * 12 / salePrice) * 100 : 0;
  const payback = monthlyNetRent > 0 ? salePrice / (monthlyNetRent * 12) : 0;

  let cumulativeNetRent = 0;
  let propertyValue = salePrice;
  const projection: YatirimResult["projeksiyon"] = [];

  for (let year = 1; year <= 10; year += 1) {
    const annualNetRent = monthlyNetRent * 12 * Math.pow(1 + rentGrowth, year - 1);
    cumulativeNetRent += annualNetRent;
    propertyValue = salePrice * Math.pow(1 + valueGrowth, year);
    const alternativeValue = salePrice * Math.pow(1 + alternativeGrowth, year);

    projection.push({
      yil: year,
      kiraGeliri: Math.round(cumulativeNetRent),
      gayrimenkulDegeri: Math.round(propertyValue),
      gayrimenkulToplam: Math.round(propertyValue + cumulativeNetRent),
      alternatifDeger: Math.round(alternativeValue),
    });
  }

  const realEstateTotal = propertyValue + cumulativeNetRent;
  const realEstateGain = realEstateTotal - salePrice;
  const alternativeValue = salePrice * Math.pow(1 + alternativeGrowth, 10);
  const alternativeGain = alternativeValue - salePrice;
  const expectedAnnual = netYield + values.yillikDegerArtisi;
  const score = clamp(Math.round(52 + (expectedAnnual - values.alternatifGetiri) * 1.4 + (payback > 0 && payback <= 15 ? 10 : -8)), 0, 100);

  let tone: "green" | "yellow" | "red" = "yellow";
  let label = "Sınırda";
  let explanation = "Getiri, alternatif yatırım varsayımına yakın; kira ve değer artışı beklentilerini hassas kontrol edin.";

  if (score >= 68) {
    tone = "green";
    label = "Mantıklı görünüyor";
    explanation = "Kira getirisi ve değer artışı birlikte alternatif senaryoya göre güçlü duruyor.";
  } else if (score < 45) {
    tone = "red";
    label = "Zayıf görünüyor";
    explanation = "Net kira getirisi ve amorti süresi, alternatif yatırım varsayımına göre düşük kalıyor.";
  }

  return {
    brutKiraGetirisi: brutYield,
    netKiraGetirisi: netYield,
    amortiSuresiYil: payback,
    toplamNetKira10Yil: cumulativeNetRent,
    gayrimenkulDegeri10Yil: propertyValue,
    gayrimenkulToplamKazanc: realEstateGain,
    alternatifToplamDeger: alternativeValue,
    alternatifToplamKazanc: alternativeGain,
    mantikSkoru: {
      skor: score,
      etiket: label,
      aciklama: explanation,
      ton: tone,
    },
    projeksiyon: projection,
    barData: [
      { name: "Gayrimenkul", getiri: Math.round(realEstateGain) },
      { name: "Alternatif", getiri: Math.round(alternativeGain) },
    ],
  };
}

function remainingPrincipal(principal: number, monthlyRatePercent: number, termMonths: number, paidMonths: number) {
  if (principal <= 0 || termMonths <= 0) return 0;
  const months = clamp(paidMonths, 0, termMonths);
  if (months >= termMonths) return 0;
  const rate = monthlyRatePercent / 100;
  if (rate <= 0) return principal * (1 - months / termMonths);
  return principal * (
    Math.pow(1 + rate, termMonths) - Math.pow(1 + rate, months)
  ) / (
    Math.pow(1 + rate, termMonths) - 1
  );
}

export function hesaplaKiraKredi(values: KiraKrediInputs): KiraKrediResult {
  const loanAmount = Math.max(0, values.evFiyati - values.pesinat);
  const installment = monthlyPayment(loanAmount, values.aylikFaiz, values.krediVadesiAy);
  const rentGrowth = values.kiraArtisi / 100;
  const analysisMonths = 120;
  let cumulativeRent = 0;
  let cumulativeCredit = 0;
  let crossoverMonth: number | null = null;
  const chart: KiraKrediResult["grafik"] = [];

  for (let month = 1; month <= analysisMonths; month += 1) {
    const yearIndex = Math.floor((month - 1) / 12);
    const rent = values.mevcutKira * Math.pow(1 + rentGrowth, yearIndex);
    const credit = month <= values.krediVadesiAy ? installment : 0;
    cumulativeRent += rent;
    cumulativeCredit += credit;

    if (crossoverMonth === null && installment > 0 && rent >= installment) {
      crossoverMonth = month;
    }

    chart.push({
      ay: month,
      yil: `${Math.ceil(month / 12)}. yıl`,
      kira: Math.round(rent),
      kredi: Math.round(credit),
      kümülatifKira: Math.round(cumulativeRent),
      kümülatifKredi: Math.round(values.pesinat + cumulativeCredit),
    });
  }

  const totalCreditWithDownPayment = values.pesinat + cumulativeCredit;
  const remaining = remainingPrincipal(loanAmount, values.aylikFaiz, values.krediVadesiAy, analysisMonths);
  const ownerNet = values.evFiyati - remaining - totalCreditWithDownPayment;
  const renterNet = -cumulativeRent;

  const buyingBetter = ownerNet > renterNet;
  const paymentDifference = totalCreditWithDownPayment - cumulativeRent;

  return {
    krediTutari: loanAmount,
    aylikTaksit: installment,
    toplamKrediOdemesi10Yil: totalCreditWithDownPayment,
    toplamKira10Yil: cumulativeRent,
    toplamOdemeFarki: paymentDifference,
    kalanAnapara10Yil: remaining,
    evSahibiNetPozisyon: ownerNet,
    kiraciNetPozisyon: renterNet,
    avantaj: {
      etiket: buyingBetter ? "Satın alma önde" : "Kirada kalmak önde",
      aciklama: buyingBetter
        ? "10 yıllık ufukta evde oluşan özvarlık, nakit çıkışı farkını telafi ediyor."
        : "10 yıllık nakit çıkışı ve kalan borç dikkate alındığında kirada kalmak daha esnek görünüyor.",
      ton: buyingBetter ? "green" : paymentDifference > 0 ? "yellow" : "red",
    },
    kiraKrediyiGectigiAy: crossoverMonth,
    grafik: chart,
  };
}
