import type { AracDegerInputs } from "@/lib/arac-hesaplama";
import {
    DONANIM_PAKETLERI,
    HASAR_KAYITLARI,
    IL_SECENEKLERI,
    SERVIS_GECMISLERI,
    URETIM_YILLARI,
    VITES_TIPLERI,
    YAKIT_TIPLERI,
} from "@/data/arac-verileri";
import { ARAC_PIYASA_KATALOG, PIYASA_MARKALARI } from "@/data/arac-piyasa-katalog";

type ValidationResult =
    | { ok: true; data: AracDegerInputs }
    | { ok: false; error: string };

const ALLOWED_KEYS = new Set([
    "marka",
    "model",
    "yil",
    "kilometre",
    "yakitTipi",
    "vites",
    "donanimPaketi",
    "il",
    "ilce",
    "servisGecmisi",
    "hasarKaydi",
    "boyaDegisenParca",
    "yillikKm",
    "krediTutari",
    "krediVadesi",
    "aylikFaiz",
]);

const YEAR_MIN = Math.min(...URETIM_YILLARI);
const YEAR_MAX = Math.max(...URETIM_YILLARI);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown, maxLength: number) {
    if (typeof value !== "string") return null;
    const normalized = value.replace(/\r/g, "").trim();
    if (!normalized || normalized.length > maxLength) return null;
    return normalized;
}

function normalizeOptionalString(value: unknown, maxLength: number) {
    if (value === undefined || value === null || value === "") return "";
    return normalizeString(value, maxLength);
}

function isAllowed<T extends string>(value: string, allowed: readonly T[]): value is T {
    return (allowed as readonly string[]).includes(value);
}

function readFiniteNumber(value: unknown, min: number, max: number) {
    const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
    if (!Number.isFinite(parsed)) return null;
    return Math.min(max, Math.max(min, parsed));
}

function readInteger(value: unknown, min: number, max: number) {
    const parsed = readFiniteNumber(value, min, max);
    return parsed === null ? null : Math.round(parsed);
}

export function validateVehicleMarketInputs(value: unknown): ValidationResult {
    if (!isRecord(value)) {
        return { ok: false, error: "Invalid request body." };
    }

    for (const key of Object.keys(value)) {
        if (!ALLOWED_KEYS.has(key)) {
            return { ok: false, error: "Invalid request body." };
        }
    }

    const marka = normalizeString(value.marka, 40);
    if (!marka || !PIYASA_MARKALARI.includes(marka)) {
        return { ok: false, error: "Invalid vehicle brand." };
    }

    const model = normalizeString(value.model, 80);
    const allowedModels = ARAC_PIYASA_KATALOG[marka] ?? [];
    if (!model || !allowedModels.includes(model)) {
        return { ok: false, error: "Invalid vehicle model." };
    }

    const yil = readInteger(value.yil, YEAR_MIN, YEAR_MAX);
    const kilometre = readInteger(value.kilometre, 0, 1000000);
    const boyaDegisenParca = readInteger(value.boyaDegisenParca, 0, 12);
    const yillikKm = readInteger(value.yillikKm, 0, 100000);
    const krediTutari = readInteger(value.krediTutari, 0, 50000000);
    const krediVadesi = readInteger(value.krediVadesi, 0, 120);
    const aylikFaiz = readFiniteNumber(value.aylikFaiz, 0, 25);

    if (
        yil === null
        || kilometre === null
        || boyaDegisenParca === null
        || yillikKm === null
        || krediTutari === null
        || krediVadesi === null
        || aylikFaiz === null
    ) {
        return { ok: false, error: "Invalid numeric value." };
    }

    const yakitTipi = normalizeString(value.yakitTipi, 16);
    const vites = normalizeString(value.vites, 16);
    const donanimPaketi = normalizeString(value.donanimPaketi, 32);
    const il = normalizeString(value.il, 32);
    const ilce = normalizeOptionalString(value.ilce, 60);
    const servisGecmisi = normalizeString(value.servisGecmisi, 40);
    const hasarKaydi = normalizeString(value.hasarKaydi, 16);

    if (!yakitTipi || !isAllowed(yakitTipi, YAKIT_TIPLERI)) {
        return { ok: false, error: "Invalid fuel type." };
    }

    if (!vites || !isAllowed(vites, VITES_TIPLERI)) {
        return { ok: false, error: "Invalid transmission type." };
    }

    if (!donanimPaketi || !isAllowed(donanimPaketi, DONANIM_PAKETLERI)) {
        return { ok: false, error: "Invalid equipment package." };
    }

    if (!il || !isAllowed(il, IL_SECENEKLERI)) {
        return { ok: false, error: "Invalid city." };
    }

    if (ilce === null) {
        return { ok: false, error: "Invalid district." };
    }

    if (!servisGecmisi || !isAllowed(servisGecmisi, SERVIS_GECMISLERI)) {
        return { ok: false, error: "Invalid service history." };
    }

    if (!hasarKaydi || !isAllowed(hasarKaydi, HASAR_KAYITLARI)) {
        return { ok: false, error: "Invalid damage history." };
    }

    return {
        ok: true,
        data: {
            marka,
            model,
            yil,
            kilometre,
            yakitTipi,
            vites,
            donanimPaketi,
            il,
            ilce,
            servisGecmisi,
            hasarKaydi,
            boyaDegisenParca,
            yillikKm,
            krediTutari,
            krediVadesi,
            aylikFaiz,
        },
    };
}
