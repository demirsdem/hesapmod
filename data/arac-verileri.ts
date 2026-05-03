export type AracMarka = string;

export type YakitTipi = "Benzin" | "Dizel" | "LPG" | "Elektrik" | "Hybrid";
export type VitesTipi = "Manuel" | "Otomatik";
export type HasarKaydi = "Yok" | "Hafif" | "Orta" | "Ağır";
export type DonanimPaketi = "Baz" | "Orta" | "Üst" | "Sport/Lüks";
export type ServisGecmisi = "Yetkili servis kayıtlı" | "Özel servis kayıtlı" | "Kayıt yok/karışık";

export type AracModelVerisi = {
  model: string;
  segment: "ekonomik" | "kompakt" | "sedan" | "suv" | "premium";
  sifirFiyat2024: number;
};

export const ARAC_VERILERI: Record<string, AracModelVerisi[]> = {
  Toyota: [
    { model: "Corolla", segment: "sedan", sifirFiyat2024: 1525000 },
    { model: "Yaris", segment: "kompakt", sifirFiyat2024: 1180000 },
    { model: "C-HR", segment: "suv", sifirFiyat2024: 1780000 },
    { model: "RAV4", segment: "suv", sifirFiyat2024: 2950000 },
  ],
  Honda: [
    { model: "Civic", segment: "sedan", sifirFiyat2024: 1710000 },
    { model: "City", segment: "sedan", sifirFiyat2024: 1260000 },
    { model: "HR-V", segment: "suv", sifirFiyat2024: 1850000 },
    { model: "CR-V", segment: "suv", sifirFiyat2024: 3450000 },
  ],
  Ford: [
    { model: "Focus", segment: "kompakt", sifirFiyat2024: 1420000 },
    { model: "Fiesta", segment: "ekonomik", sifirFiyat2024: 980000 },
    { model: "Puma", segment: "suv", sifirFiyat2024: 1580000 },
    { model: "Kuga", segment: "suv", sifirFiyat2024: 2150000 },
  ],
  Renault: [
    { model: "Clio", segment: "ekonomik", sifirFiyat2024: 1020000 },
    { model: "Megane", segment: "sedan", sifirFiyat2024: 1425000 },
    { model: "Captur", segment: "suv", sifirFiyat2024: 1460000 },
    { model: "Austral", segment: "suv", sifirFiyat2024: 2050000 },
  ],
  Fiat: [
    { model: "Egea Sedan", segment: "sedan", sifirFiyat2024: 980000 },
    { model: "Egea Cross", segment: "suv", sifirFiyat2024: 1160000 },
    { model: "500", segment: "kompakt", sifirFiyat2024: 1380000 },
    { model: "Panda", segment: "ekonomik", sifirFiyat2024: 900000 },
  ],
  Volkswagen: [
    { model: "Polo", segment: "kompakt", sifirFiyat2024: 1200000 },
    { model: "Golf", segment: "kompakt", sifirFiyat2024: 1750000 },
    { model: "Passat", segment: "sedan", sifirFiyat2024: 2450000 },
    { model: "T-Roc", segment: "suv", sifirFiyat2024: 1950000 },
  ],
  Hyundai: [
    { model: "i20", segment: "ekonomik", sifirFiyat2024: 1080000 },
    { model: "i30", segment: "kompakt", sifirFiyat2024: 1420000 },
    { model: "Elantra", segment: "sedan", sifirFiyat2024: 1500000 },
    { model: "Tucson", segment: "suv", sifirFiyat2024: 1980000 },
  ],
  Peugeot: [
    { model: "208", segment: "kompakt", sifirFiyat2024: 1230000 },
    { model: "308", segment: "kompakt", sifirFiyat2024: 1700000 },
    { model: "408", segment: "sedan", sifirFiyat2024: 2050000 },
    { model: "3008", segment: "suv", sifirFiyat2024: 2250000 },
  ],
  Opel: [
    { model: "Corsa", segment: "ekonomik", sifirFiyat2024: 1110000 },
    { model: "Astra", segment: "kompakt", sifirFiyat2024: 1550000 },
    { model: "Crossland", segment: "suv", sifirFiyat2024: 1320000 },
    { model: "Grandland", segment: "suv", sifirFiyat2024: 1960000 },
  ],
  BMW: [
    { model: "1 Serisi", segment: "premium", sifirFiyat2024: 2400000 },
    { model: "3 Serisi", segment: "premium", sifirFiyat2024: 3650000 },
    { model: "5 Serisi", segment: "premium", sifirFiyat2024: 5600000 },
    { model: "X1", segment: "premium", sifirFiyat2024: 3300000 },
  ],
};

export const MARKALAR = Object.keys(ARAC_VERILERI) as AracMarka[];
export const VARSAYILAN_MODELLER = [
  "Auris",
  "Avensis",
  "Civic",
  "Clio",
  "Corolla",
  "Egea",
  "Focus",
  "Golf",
  "Megane",
  "Passat",
  "Polo",
  "i20",
] as const;
export const YAKIT_TIPLERI: YakitTipi[] = ["Benzin", "Dizel", "LPG", "Elektrik", "Hybrid"];
export const VITES_TIPLERI: VitesTipi[] = ["Manuel", "Otomatik"];
export const HASAR_KAYITLARI: HasarKaydi[] = ["Yok", "Hafif", "Orta", "Ağır"];
export const DONANIM_PAKETLERI: DonanimPaketi[] = ["Baz", "Orta", "Üst", "Sport/Lüks"];
export const SERVIS_GECMISLERI: ServisGecmisi[] = ["Yetkili servis kayıtlı", "Özel servis kayıtlı", "Kayıt yok/karışık"];
export const IL_SECENEKLERI = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Kocaeli",
  "Konya",
  "Adana",
  "Gaziantep",
  "Kayseri",
  "Mersin",
  "Samsun",
  "Eskişehir",
  "Diyarbakır",
  "Diğer",
] as const;
export const URETIM_YILLARI = Array.from({ length: 26 }, (_, index) => 2025 - index);
