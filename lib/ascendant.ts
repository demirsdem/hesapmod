export type ZodiacElement = "fire" | "earth" | "air" | "water";

export type ZodiacSign = {
    id: string;
    tr: string;
    en: string;
    symbol: string;
    element: ZodiacElement;
};

export type TurkishProvince = {
    id: string;
    name: string;
    longitude: number;
    isAverage?: boolean;
};

export type AscendantCalculationResult = {
    sunSignIndex: number;
    ascendantIndex: number;
    moonSignIndex: number;
    sunSign: ZodiacSign;
    ascendantSign: ZodiacSign;
    moonSign: ZodiacSign;
    province: TurkishProvince;
    birthHourUtc: number;
    birthHourTurkey: number;
    sunriseHour: number;
    hoursFromSunrise: number;
    intervalStartHour: number;
    intervalEndHour: number;
    intervalLabel: string;
};

export type AscendantPossibility = {
    intervalLabel: string;
    selectedTime: string;
    ascendantSign: ZodiacSign;
    probabilityLabel: string;
};

export const ZODIAC_SIGNS: ZodiacSign[] = [
    { id: "koc", tr: "Koç", en: "Aries", symbol: "♈", element: "fire" },
    { id: "boga", tr: "Boğa", en: "Taurus", symbol: "♉", element: "earth" },
    { id: "ikizler", tr: "İkizler", en: "Gemini", symbol: "♊", element: "air" },
    { id: "yengec", tr: "Yengeç", en: "Cancer", symbol: "♋", element: "water" },
    { id: "aslan", tr: "Aslan", en: "Leo", symbol: "♌", element: "fire" },
    { id: "basak", tr: "Başak", en: "Virgo", symbol: "♍", element: "earth" },
    { id: "terazi", tr: "Terazi", en: "Libra", symbol: "♎", element: "air" },
    { id: "akrep", tr: "Akrep", en: "Scorpio", symbol: "♏", element: "water" },
    { id: "yay", tr: "Yay", en: "Sagittarius", symbol: "♐", element: "fire" },
    { id: "oglak", tr: "Oğlak", en: "Capricorn", symbol: "♑", element: "earth" },
    { id: "kova", tr: "Kova", en: "Aquarius", symbol: "♒", element: "air" },
    { id: "balik", tr: "Balık", en: "Pisces", symbol: "♓", element: "water" },
];

const MOON_CYCLE_DAYS = 27.3;
const MOON_SIGN_DAYS = MOON_CYCLE_DAYS / ZODIAC_SIGNS.length;
const MOON_REFERENCE_UTC_DAY = Date.UTC(2000, 0, 1) / (24 * 60 * 60 * 1000);
const MOON_REFERENCE_SIGN_INDEX = 0;

export const TURKISH_PROVINCES: TurkishProvince[] = [
    { id: "adana", name: "Adana", longitude: 35.32 },
    { id: "adiyaman", name: "Adıyaman", longitude: 38.28 },
    { id: "afyonkarahisar", name: "Afyonkarahisar", longitude: 30.54 },
    { id: "agri", name: "Ağrı", longitude: 43.05 },
    { id: "amasya", name: "Amasya", longitude: 35.83 },
    { id: "ankara", name: "Ankara", longitude: 32.85 },
    { id: "antalya", name: "Antalya", longitude: 30.71 },
    { id: "artvin", name: "Artvin", longitude: 41.82 },
    { id: "aydin", name: "Aydın", longitude: 27.84 },
    { id: "balikesir", name: "Balıkesir", longitude: 27.88 },
    { id: "bilecik", name: "Bilecik", longitude: 29.98 },
    { id: "bingol", name: "Bingöl", longitude: 40.50 },
    { id: "bitlis", name: "Bitlis", longitude: 42.11 },
    { id: "bolu", name: "Bolu", longitude: 31.61 },
    { id: "burdur", name: "Burdur", longitude: 30.29 },
    { id: "bursa", name: "Bursa", longitude: 29.06 },
    { id: "canakkale", name: "Çanakkale", longitude: 26.41 },
    { id: "cankiri", name: "Çankırı", longitude: 33.62 },
    { id: "corum", name: "Çorum", longitude: 34.95 },
    { id: "denizli", name: "Denizli", longitude: 29.09 },
    { id: "diyarbakir", name: "Diyarbakır", longitude: 40.23 },
    { id: "edirne", name: "Edirne", longitude: 26.56 },
    { id: "elazig", name: "Elazığ", longitude: 39.22 },
    { id: "erzincan", name: "Erzincan", longitude: 39.49 },
    { id: "erzurum", name: "Erzurum", longitude: 41.27 },
    { id: "eskisehir", name: "Eskişehir", longitude: 30.52 },
    { id: "gaziantep", name: "Gaziantep", longitude: 37.38 },
    { id: "giresun", name: "Giresun", longitude: 38.39 },
    { id: "gumushane", name: "Gümüşhane", longitude: 39.48 },
    { id: "hakkari", name: "Hakkari", longitude: 43.74 },
    { id: "hatay", name: "Hatay", longitude: 36.16 },
    { id: "isparta", name: "Isparta", longitude: 30.56 },
    { id: "mersin", name: "Mersin", longitude: 34.64 },
    { id: "istanbul", name: "İstanbul", longitude: 28.97 },
    { id: "izmir", name: "İzmir", longitude: 27.14 },
    { id: "kars", name: "Kars", longitude: 43.10 },
    { id: "kastamonu", name: "Kastamonu", longitude: 33.78 },
    { id: "kayseri", name: "Kayseri", longitude: 35.49 },
    { id: "kirklareli", name: "Kırklareli", longitude: 27.23 },
    { id: "kirsehir", name: "Kırşehir", longitude: 34.16 },
    { id: "kocaeli", name: "Kocaeli", longitude: 29.92 },
    { id: "konya", name: "Konya", longitude: 32.48 },
    { id: "kutahya", name: "Kütahya", longitude: 29.98 },
    { id: "malatya", name: "Malatya", longitude: 38.32 },
    { id: "manisa", name: "Manisa", longitude: 27.43 },
    { id: "kahramanmaras", name: "Kahramanmaraş", longitude: 36.93 },
    { id: "mardin", name: "Mardin", longitude: 40.74 },
    { id: "mugla", name: "Muğla", longitude: 28.37 },
    { id: "mus", name: "Muş", longitude: 41.49 },
    { id: "nevsehir", name: "Nevşehir", longitude: 34.71 },
    { id: "nigde", name: "Niğde", longitude: 34.68 },
    { id: "ordu", name: "Ordu", longitude: 37.88 },
    { id: "rize", name: "Rize", longitude: 40.52 },
    { id: "sakarya", name: "Sakarya", longitude: 30.40 },
    { id: "samsun", name: "Samsun", longitude: 36.33 },
    { id: "siirt", name: "Siirt", longitude: 41.94 },
    { id: "sinop", name: "Sinop", longitude: 35.15 },
    { id: "sivas", name: "Sivas", longitude: 37.02 },
    { id: "tekirdag", name: "Tekirdağ", longitude: 27.51 },
    { id: "tokat", name: "Tokat", longitude: 36.55 },
    { id: "trabzon", name: "Trabzon", longitude: 39.73 },
    { id: "tunceli", name: "Tunceli", longitude: 39.55 },
    { id: "sanliurfa", name: "Şanlıurfa", longitude: 38.80 },
    { id: "usak", name: "Uşak", longitude: 29.41 },
    { id: "van", name: "Van", longitude: 43.38 },
    { id: "yozgat", name: "Yozgat", longitude: 34.81 },
    { id: "zonguldak", name: "Zonguldak", longitude: 31.79 },
    { id: "aksaray", name: "Aksaray", longitude: 34.03 },
    { id: "bayburt", name: "Bayburt", longitude: 40.23 },
    { id: "karaman", name: "Karaman", longitude: 33.22 },
    { id: "kirikkale", name: "Kırıkkale", longitude: 33.51 },
    { id: "batman", name: "Batman", longitude: 41.13 },
    { id: "sirnak", name: "Şırnak", longitude: 42.46 },
    { id: "bartin", name: "Bartın", longitude: 32.34 },
    { id: "ardahan", name: "Ardahan", longitude: 42.70 },
    { id: "igdir", name: "Iğdır", longitude: 44.04 },
    { id: "yalova", name: "Yalova", longitude: 29.28 },
    { id: "karabuk", name: "Karabük", longitude: 32.63 },
    { id: "kilis", name: "Kilis", longitude: 37.12 },
    { id: "osmaniye", name: "Osmaniye", longitude: 36.25 },
    { id: "duzce", name: "Düzce", longitude: 31.16 },
];

export const AVERAGE_TURKEY_PROVINCE: TurkishProvince = {
    id: "diger-ortalama",
    name: "Diğer / Ortalama",
    longitude: 35,
    isAverage: true,
};

export function getProvinceById(provinceId: string) {
    if (provinceId === AVERAGE_TURKEY_PROVINCE.id) {
        return AVERAGE_TURKEY_PROVINCE;
    }

    return TURKISH_PROVINCES.find((province) => province.id === provinceId) ?? null;
}

export function getZodiacElementName(element: ZodiacElement, lang: "tr" | "en") {
    if (lang === "en") {
        return {
            fire: "Fire",
            earth: "Earth",
            air: "Air",
            water: "Water",
        }[element];
    }

    return {
        fire: "Ateş",
        earth: "Toprak",
        air: "Hava",
        water: "Su",
    }[element];
}

export function getZodiacGradientClass(element: ZodiacElement) {
    return {
        fire: "from-orange-500 via-red-500 to-rose-700",
        earth: "from-emerald-700 via-lime-800 to-amber-900",
        air: "from-sky-500 via-indigo-500 to-violet-700",
        water: "from-blue-950 via-cyan-800 to-teal-500",
    }[element];
}

export function calculateSunSignIndex(birthDate: string) {
    const parts = parseDateInput(birthDate);
    if (!parts) {
        return null;
    }

    const { month, day } = parts;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return 0;
    if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return 1;
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 2;
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 3;
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 4;
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 5;
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 6;
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 7;
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 8;
    if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) return 9;
    if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) return 10;

    return 11;
}

export function calculateMoonSignIndex(birthDate: string) {
    const parts = parseDateInput(birthDate);
    if (!parts) {
        return null;
    }

    const birthUtcDay = Date.UTC(parts.year, parts.month - 1, parts.day) / (24 * 60 * 60 * 1000);
    const daysFromReference = birthUtcDay - MOON_REFERENCE_UTC_DAY;
    const signsFromReference = Math.floor(daysFromReference / MOON_SIGN_DAYS);

    return positiveModulo(MOON_REFERENCE_SIGN_INDEX + signsFromReference, ZODIAC_SIGNS.length);
}

export function calculateAscendantPossibilities(
    birthDate: string,
    provinceId: string
): AscendantPossibility[] {
    const dateParts = parseDateInput(birthDate);
    const province = getProvinceById(provinceId);

    if (!dateParts || !province) {
        return [];
    }

    return Array.from({ length: ZODIAC_SIGNS.length }, (_, index) => {
        const startHour = index * 2;
        const endHour = startHour + 2;
        const selectedTime = formatHourMinute(startHour + 1);
        const result = calculateAscendantResult(birthDate, selectedTime, province.id);

        return {
            intervalLabel: `${formatHourMinute(startHour)} – ${formatHourMinute(endHour)}`,
            selectedTime,
            ascendantSign: result?.ascendantSign ?? ZODIAC_SIGNS[0],
            probabilityLabel: "8.3%",
        };
    });
}

export function calculateAscendantResult(
    birthDate: string,
    birthTime: string,
    provinceId: string
): AscendantCalculationResult | null {
    const sunSignIndex = calculateSunSignIndex(birthDate);
    const moonSignIndex = calculateMoonSignIndex(birthDate);
    const time = parseTimeInput(birthTime);
    const province = getProvinceById(provinceId);

    if (sunSignIndex === null || moonSignIndex === null || !time || !province) {
        return null;
    }

    const birthHourLocal = time.hour + time.minute / 60;
    const birthHourUtc = normalizeHour(birthHourLocal - 3);
    const birthHourTurkey = normalizeHour(birthHourUtc + 3);
    const sunriseHour = 6 - (province.longitude - 30) / 15;
    const hoursFromSunrise = normalizeHour(birthHourTurkey - sunriseHour);
    const ascendantIndex = (sunSignIndex + Math.floor(hoursFromSunrise / 2)) % 12;
    const intervalStartHour = normalizeHour(sunriseHour + Math.floor(hoursFromSunrise / 2) * 2);
    const intervalEndHour = normalizeHour(intervalStartHour + 2);

    return {
        sunSignIndex,
        ascendantIndex,
        moonSignIndex,
        sunSign: ZODIAC_SIGNS[sunSignIndex],
        ascendantSign: ZODIAC_SIGNS[ascendantIndex],
        moonSign: ZODIAC_SIGNS[moonSignIndex],
        province,
        birthHourUtc,
        birthHourTurkey,
        sunriseHour,
        hoursFromSunrise,
        intervalStartHour,
        intervalEndHour,
        intervalLabel: `${formatHourMinute(intervalStartHour)} – ${formatHourMinute(intervalEndHour)}`,
    };
}

function parseDateInput(value: string) {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const parsed = new Date(year, month - 1, day);

    if (
        parsed.getFullYear() !== year
        || parsed.getMonth() !== month - 1
        || parsed.getDate() !== day
    ) {
        return null;
    }

    return { year, month, day };
}

function parseTimeInput(value: string) {
    const match = value.match(/^(\d{2}):(\d{2})$/);
    if (!match) {
        return null;
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return null;
    }

    return { hour, minute };
}

function normalizeHour(hour: number) {
    return (hour + 24) % 24;
}

function positiveModulo(value: number, divisor: number) {
    return ((value % divisor) + divisor) % divisor;
}

function formatHourMinute(hourValue: number) {
    const totalMinutes = Math.round(normalizeHour(hourValue) * 60) % 1440;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
