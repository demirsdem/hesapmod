import fs from "node:fs";
import path from "node:path";

import { calculators, findCalculatorBySlug, normalizeCalculatorSlug } from "../lib/calculator-source";
import type { CalculatorConfig } from "../lib/calculator-types";

type RequestedCategory = {
    category: string;
    tools: string[];
};

type MatchStatus = "covered" | "missing";

type CoverageRow = {
    category: string;
    tool: string;
    status: MatchStatus;
    calculator?: CalculatorConfig;
    existingUrl?: string;
    proposedUrl?: string;
    notes: string;
};

const REQUESTED_COVERAGE: RequestedCategory[] = [
    {
        category: "Kredi",
        tools: [
            "İhtiyaç Kredisi Hesaplama",
            "İş Yeri Kredisi Hesaplama",
            "Konut Kredisi Hesaplama",
            "Kredi Hesaplama",
            "Kredi Dosya Masrafı Hesaplama",
            "Kredi Erken Kapatma Cezası Hesaplama",
            "Kredi Gecikme Faizi Hesaplama",
            "Kredi Kartı Asgari Ödeme Tutarı Hesaplama",
            "Kredi Kartı Ek Taksit Hesaplama",
            "Kredi Kartı Gecikme Faizi Hesaplama",
            "Kredi Kartı İşlem Taksitlendirme Hesaplama",
            "Kredi Kartı Taksitli Nakit Avans Hesaplama",
            "Kredi Yapılandırma Hesaplama",
            "Kredi Yıllık Maliyet Oranı Hesaplama",
            "Ne Kadar Kredi Alabilirim Hesaplama",
            "Taşıt Kredisi Hesaplama",
            "Ticari Araç Kredisi Hesaplama",
            "Ticari İhtiyaç Kredisi Hesaplama",
            "Ticari Kredi Hesaplama",
        ],
    },
    {
        category: "Finans",
        tools: [
            "Altın Hesaplama",
            "Bileşik Büyüme Hesaplama",
            "Birikim Hesaplama",
            "Bono Hesaplama",
            "Döviz Hesaplama",
            "Enflasyon Hesaplama",
            "Eurobond Hesaplama",
            "Faiz Hesaplama",
            "Geçmiş Altın Fiyatları Hesaplama",
            "Geçmiş Döviz Kurları Hesaplama",
            "IBAN Doğrulama",
            "İç ve Dış İskonto Hesaplama",
            "İç Verim Oranı Hesaplama",
            "Kira Artış Oranı Hesaplama",
            "Net Bugünkü Değer Hesaplama",
            "Ortalama Vade Hesaplama",
            "Parasal Değer Hesaplama",
            "Reel Getiri Hesaplama",
            "Repo Hesaplama",
            "Sermaye ve Temettü Hesaplama",
            "Tahvil Hesaplama",
            "Vadeli İşlem Fiyatı Hesaplama",
            "Vadeli Mevduat Faizi Hesaplama",
        ],
    },
    {
        category: "Sınav",
        tools: [
            "AGS Puan Hesaplama",
            "AKS Puan Hesaplama",
            "ALES Puan Hesaplama",
            "DGS Puan Hesaplama",
            "DGS Taban Puanları Hesaplama",
            "DİB MBSTS Puan Hesaplama",
            "DUS Puan Hesaplama",
            "Ehliyet Sınavı Puan Hesaplama",
            "EKPSS Puan Hesaplama",
            "EUS Puan Hesaplama",
            "Hâkim ve Savcı Yrd. Sınavı Puan Hesaplama",
            "HMGS Puan Hesaplama",
            "İSG Puan Hesaplama",
            "İYÖS Puan Hesaplama",
            "KPSS Puan Hesaplama",
            "LGS Puan Hesaplama",
            "Lise (LGS) Taban Puanları Hesaplama",
            "MSÜ Puan Hesaplama",
            "OBP Okul Puanı Hesaplama",
            "ÖYP Puan Hesaplama",
            "Özel Güvenlik Sınavı Puanı Hesaplama",
            "PMYO Puan Hesaplama",
            "POMEM Puan Hesaplama",
            "PYBS Puan Hesaplama",
            "TUS Puan Hesaplama",
            "TYT Puan Hesaplama",
            "Üniversite (YKS) Taban Puanları Hesaplama",
            "YDS Puan Hesaplama",
            "YKS Puan Hesaplama",
        ],
    },
    {
        category: "Eğitim",
        tools: [
            "Ders Notu Hesaplama",
            "E-Okul Not Hesaplama",
            "Lise Ders Puanı Hesaplama",
            "Lise Mezuniyet Puanı Hesaplama",
            "Lise Ortalama Hesaplama",
            "Lise Sınıf Geçme Hesaplama",
            "Lise YBP Hesaplama",
            "Okula Başlama Yaşı Hesaplama",
            "Takdir Teşekkür Hesaplama",
            "Üniversite Not Ortalaması Hesaplama",
            "Vize Final Ortalama Hesaplama",
        ],
    },
    {
        category: "Sağlık",
        tools: [
            "Adet Günü Hesaplama",
            "Aşı Takvimi Hesaplama",
            "Bazal Metabolizma Hızı Hesaplama",
            "Bebek Boyu Hesaplama",
            "Bebek Kilosu Hesaplama",
            "Bel / Kalça Oranı Hesaplama",
            "Doğum Tarihi Hesaplama",
            "Gebelik Hesaplama",
            "Günlük Kalori İhtiyacı Hesaplama",
            "Günlük Karbonhidrat İhtiyacı Hesaplama",
            "Günlük Kreatin Dozu Hesaplama",
            "Günlük Makro Besin İhtiyacı Hesaplama",
            "Günlük Protein İhtiyacı Hesaplama",
            "Günlük Su İhtiyacı Hesaplama",
            "Günlük Yağ İhtiyacı Hesaplama",
            "İdeal Kilo Hesaplama",
            "Sigara Maliyeti Hesaplama",
            "Sütyen Bedeni Hesaplama",
            "Vücut Kitle Endeksi Hesaplama",
            "Vücut Yağ Oranı Hesaplama",
            "Yaşam Süresi Hesaplama",
            "Yumurtlama Dönemi Hesaplama",
        ],
    },
    {
        category: "Matematik",
        tools: [
            "Alan Hesaplama",
            "Altın Oran Hesaplama",
            "Asal Çarpan Hesaplama",
            "Basit Faiz Hesaplama",
            "Bileşik Faiz Hesaplama",
            "Çevre Hesaplama",
            "EBOB EKOK Hesaplama",
            "Faktöriyel Hesaplama",
            "Hacim Hesaplama",
            "İnç Hesaplama",
            "Kombinasyon Hesaplama",
            "Köklü Sayı Hesaplama",
            "Metrekare Hesaplama",
            "Mil Hesaplama",
            "Modüler Aritmetik Hesaplama",
            "Oran Hesaplama",
            "Permütasyon Hesaplama",
            "Rastgele Sayı Hesaplama",
            "Sayı Okunuşu Hesaplama",
            "Standart Sapma Hesaplama",
            "Taban Dönüşümü Hesaplama",
            "Üslü Sayı Hesaplama",
            "Yüzde Hesaplama",
        ],
    },
    {
        category: "Zaman",
        tools: [
            "Ay Evresi Hesaplama",
            "Bayram Namazı Saati Hesaplama",
            "Cuma Namazı Saati Hesaplama",
            "Gün Batımı Hesaplama",
            "Gün Doğumu Hesaplama",
            "Hafta Hesaplama",
            "Hangi Gün Hesaplama",
            "Hicri Takvim Hesaplama",
            "İki Tarih Arasındaki Gün Sayısını Hesaplama",
            "İki Tarih Arasındaki Hafta Sayısını Hesaplama",
            "İş Günü Hesaplama",
            "Kaç Gün Kaldı Hesaplama",
            "Kaç Gün Oldu Hesaplama",
            "Ramazanın Kaçıncı Günü Hesaplama",
            "Saat Farkı Hesaplama",
            "Saat Kaç Hesaplama",
            "Şafak Hesaplama",
            "Tarih Hesaplama",
            "Vade Hesaplama",
            "Yaş Hesaplama",
            "Yılın Kaçıncı Günü Hesaplama",
        ],
    },
    {
        category: "Muhasebe",
        tools: [
            "Amortisman Hesaplama",
            "Asgari Geçim İndirimi Hesaplama",
            "Binek Araç Gider Kısıtlaması Hesaplama",
            "Brütten Nete Maaş Hesaplama",
            "Doğum İzni Hesaplama",
            "Emeklilik Borçlanması Hesaplama",
            "Emeklilik Hesaplama",
            "Fazla Mesai Ücreti Hesaplama",
            "Gecikme Zammı Hesaplama",
            "Huzur Hakkı Hesaplama",
            "İhbar Tazminatı Hesaplama",
            "İşsizlik Maaşı Hesaplama",
            "Kıdem Tazminatı Hesaplama",
            "Kısa Çalışma Ödeneği Hesaplama",
            "Maaş Hesaplama",
            "Netten Brüte Maaş Hesaplama",
            "Serbest Meslek Makbuzu Hesaplama",
            "Yıllık İzin Hesaplama",
            "Yıllık İzin Ücreti Hesaplama",
            "Yeniden Değerleme Oranı Hesaplama",
            "Yolluk Hesaplama",
        ],
    },
    {
        category: "Vergi",
        tools: [
            "Damga Vergisi Hesaplama",
            "Değer Artış Kazancı Vergisi Hesaplama",
            "Değerli Konut Vergisi Hesaplama",
            "Emlak Vergisi Hesaplama",
            "Gelir Vergisi Hesaplama",
            "Gümrük Vergisi Hesaplama",
            "Kambiyo Vergisi Hesaplama",
            "KDV Hesaplama",
            "KDV Tevkifatı Hesaplama",
            "Kira Vergisi Hesaplama",
            "Kira Stopaj Hesaplama",
            "Konaklama Vergisi Hesaplama",
            "Kurumlar Vergisi Hesaplama",
            "MTV Hesaplama",
            "ÖTV Hesaplama",
            "Veraset ve İntikal Vergisi Hesaplama",
            "Vergi Gecikme Faizi Hesaplama",
        ],
    },
    {
        category: "Ticaret",
        tools: [
            "Arsa Payı Hesaplama",
            "Desi Hesaplama",
            "Fiyat Hesaplama",
            "İndirim Hesaplama",
            "İnşaat Alanı Hesaplama",
            "Kâr Hesaplama",
            "Kargo Ücreti Hesaplama",
            "Ortalama Maliyet Hesaplama",
            "Tapu Harcı Hesaplama",
            "Zam Hesaplama",
            "Zarar Hesaplama",
        ],
    },
    {
        category: "Hukuk",
        tools: [
            "Arabuluculuk Ücreti Hesaplama",
            "E-tebligat Tebliğ Tarihi Hesaplama",
            "Hukuki Süre Hesaplama",
            "İcra Masrafı Hesaplama",
            "Uzlaştırmacı Ücreti Hesaplama",
            "Vekâlet Ücreti Hesaplama",
            "Yasal Faiz Hesaplama",
        ],
    },
    {
        category: "Sigorta",
        tools: [
            "DASK Sigortası Hesaplama",
            "Kasko Değeri Hesaplama",
            "Kasko Hesaplama",
            "Sağlık Sigortası Hesaplama",
            "Trafik Sigortası Hesaplama",
        ],
    },
    {
        category: "Seyahat",
        tools: [
            "Elektrikli Araç Şarj Hesaplama",
            "En Ucuz Otobüs Bileti Fiyatı Hesaplama",
            "En Ucuz Uçak Bileti",
            "İller Arası Mesafe Hesaplama",
            "Kıble Yönü Hesaplama",
            "Koordinat Hesaplama",
            "Mesafe Hesaplama",
            "Otel Fiyatı Hesaplama",
            "Taksi Ücreti Hesaplama",
            "Yakıt Tüketimi Hesaplama",
            "Yol Tarifi Hesaplama",
        ],
    },
    {
        category: "Diğer",
        tools: [
            "Aidat Gecikme Tazminatı Hesaplama",
            "Araç Muayene Ücreti Hesaplama",
            "Ay Burcu Hesaplama",
            "Burç Hesaplama",
            "Doğum Haritası Hesaplama",
            "Ebced Hesaplama",
            "Ek Ders Ücreti Hesaplama",
            "Fitre Hesaplama",
            "HTML Renk Kodu Hesaplama",
            "İddaa Kupon Hesaplama",
            "Karar Hesaplama",
            "Kelime Sayısı Hesaplama",
            "Klima BTU Hesaplama",
            "Kuşak Hesaplama",
            "MD5 Hesaplama",
            "Parmak Alfabesi Hesaplama",
            "Şifre Hesaplama",
            "Yükselen Burç Hesaplama",
            "Zekat Hesaplama",
        ],
    },
];

const INVENTORY_CATEGORY_LABELS: Record<string, string> = {
    astroloji: "Astroloji",
    "finansal-hesaplamalar": "Finans",
    "maas-ve-vergi": "Maaş & Vergi",
    "matematik-hesaplama": "Matematik",
    "sinav-hesaplamalari": "Sınav",
    "tasit-ve-vergi": "Taşıt & Vergi",
    "ticaret-ve-is": "Ticaret & İş",
    "yasam-hesaplama": "Yaşam",
    "zaman-hesaplama": "Zaman & Tarih",
};

const REQUESTED_MATCH_OVERRIDES: Record<string, string> = {
    "İş Yeri Kredisi Hesaplama": "is-yeri-ve-ticari-kredi-hesaplama",
    "Kredi Hesaplama": "kredi-taksit-hesaplama",
    "Faiz Hesaplama": "basit-faiz-hesaplama",
    "Geçmiş Altın Fiyatları Hesaplama": "gecmis-altin-fiyatlari",
    "Geçmiş Döviz Kurları Hesaplama": "gecmis-doviz-kurlari",
    "İç ve Dış İskonto Hesaplama": "iskonto-hesaplama",
    "Kira Artış Oranı Hesaplama": "kira-artis-hesaplama",
    "Parasal Değer Hesaplama": "parasal-deger-zaman-hesaplama",
    "Vadeli İşlem Fiyatı Hesaplama": "vadeli-islem-fiyat-hesaplama",
    "Vadeli Mevduat Faizi Hesaplama": "mevduat-faiz-hesaplama",
    "Lise (LGS) Taban Puanları Hesaplama": "lise-taban-puanlari",
    "Özel Güvenlik Sınavı Puanı Hesaplama": "ozel-guvenlik-sinav-hesaplama",
    "Üniversite (YKS) Taban Puanları Hesaplama": "universite-taban-puanlari",
    "Takdir Teşekkür Hesaplama": "takdir-tesekkur-hesaplama",
    "Günlük Kalori İhtiyacı Hesaplama": "gunluk-kalori-ihtiyaci",
    "Vücut Kitle Endeksi Hesaplama": "vucut-kitle-indeksi-hesaplama",
    "Basit Faiz Hesaplama": "basit-faiz-hesaplama",
    "Bileşik Faiz Hesaplama": "bilesik-faiz-hesaplama",
    "Kombinasyon Hesaplama": "kombinasyon-permutasyon-faktoriyel",
    "Köklü Sayı Hesaplama": "us-kuvvet-karekok",
    "Permütasyon Hesaplama": "kombinasyon-permutasyon-faktoriyel",
    "Üslü Sayı Hesaplama": "us-kuvvet-karekok",
    "Brütten Nete Maaş Hesaplama": "maas-hesaplama",
    "Doğum İzni Hesaplama": "dogum-izni-hesaplama",
    "Değer Artış Kazancı Vergisi Hesaplama": "deger-artis-kazanci-vergisi",
    "MTV Hesaplama": "mtv-hesaplama",
    "ÖTV Hesaplama": "otv-hesaplama",
    "Veraset ve İntikal Vergisi Hesaplama": "veraset-intikal-vergisi-hesaplama",
    "Yolluk Hesaplama": "harcirah-yolluk-hesaplama",
    "Yakıt Tüketimi Hesaplama": "yakit-tuketim-maliyet",
};

const MATCH_NOTES: Record<string, string> = {
    "İş Yeri Kredisi Hesaplama": "Mevcut araç iş yeri ve ticari kredi niyetini tek sayfada birleştiriyor.",
    "Kredi Hesaplama": "Genel kredi araması projede kredi taksit hesaplama sayfasına karşılanıyor.",
    "Faiz Hesaplama": "Genel faiz niyeti basit faiz sayfasıyla karşılanıyor.",
    "Geçmiş Altın Fiyatları Hesaplama": "Mevcut slug hesaplama eki olmadan kullanılıyor.",
    "Geçmiş Döviz Kurları Hesaplama": "Mevcut slug hesaplama eki olmadan kullanılıyor.",
    "Kira Artış Oranı Hesaplama": "Sayfa oranla birlikte yeni kira tutarını da hesaplıyor.",
    "Parasal Değer Hesaplama": "Mevcut sayfa TVM başlığı altında aynı ihtiyacı karşılıyor.",
    "Vadeli Mevduat Faizi Hesaplama": "Mevcut sayfa mevduat faiz başlığıyla yayınlanıyor.",
    "Lise (LGS) Taban Puanları Hesaplama": "Mevcut slug daha kısa tutulmuş.",
    "Özel Güvenlik Sınavı Puanı Hesaplama": "Mevcut sayfa puan başlığını daha kısa formda kullanıyor.",
    "Üniversite (YKS) Taban Puanları Hesaplama": "Mevcut slug daha kısa tutulmuş.",
    "Takdir Teşekkür Hesaplama": "Mevcut araç sınav kategorisi altında yer alıyor.",
    "Günlük Kalori İhtiyacı Hesaplama": "Mevcut sayfa TDEE başlığıyla yayınlanıyor.",
    "Basit Faiz Hesaplama": "Mevcut araç finans kategorisi altında yer alıyor.",
    "Bileşik Faiz Hesaplama": "Mevcut araç finans kategorisi altında yer alıyor.",
    "Kombinasyon Hesaplama": "Mevcut sayfa kombinasyon, permütasyon ve faktöriyeli birlikte veriyor.",
    "Köklü Sayı Hesaplama": "Mevcut sayfa köklü ve üslü sayı işlemlerini birlikte veriyor.",
    "Permütasyon Hesaplama": "Mevcut sayfa kombinasyon, permütasyon ve faktöriyeli birlikte veriyor.",
    "Üslü Sayı Hesaplama": "Mevcut sayfa köklü ve üslü sayı işlemlerini birlikte veriyor.",
    "Brütten Nete Maaş Hesaplama": "Mevcut maaş sayfası brütten nete hesabı yapıyor.",
    "Doğum İzni Hesaplama": "Mevcut araç yaşam kategorisi altında yer alıyor.",
    "MTV Hesaplama": "Mevcut araç taşıt ve vergi kategorisi altında yer alıyor.",
    "ÖTV Hesaplama": "Mevcut araç taşıt ve vergi kategorisi altında yer alıyor.",
    "Veraset ve İntikal Vergisi Hesaplama": "Mevcut slug bağlaçsız kısa form kullanıyor.",
    "Yolluk Hesaplama": "Mevcut sayfa harcırah ve yolluğu birlikte ele alıyor.",
    "Yakıt Tüketimi Hesaplama": "Mevcut sayfa yakıt tüketimiyle birlikte maliyeti de hesaplıyor.",
};

const TRANSLITERATION_MAP: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
    â: "a",
    Â: "a",
    î: "i",
    Î: "i",
    û: "u",
    Û: "u",
};

function slugify(input: string) {
    return input
        .replace(/[çÇğĞıİöÖşŞüÜâÂîÎûÛ]/g, (char) => TRANSLITERATION_MAP[char] ?? char)
        .toLowerCase()
        .replace(/&/g, " ve ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
}

function normalizeComparisonText(input: string) {
    return slugify(
        input
            .replace(/\([^)]*\)/g, " ")
            .replace(/\b20\d{2}\b/g, " ")
            .replace(/\s+/g, " ")
            .trim()
    );
}

function getInventoryCategoryLabel(categorySlug: string) {
    return INVENTORY_CATEGORY_LABELS[categorySlug] ?? categorySlug;
}

function getExistingUrl(calculator: CalculatorConfig) {
    return `/${calculator.category}/${calculator.slug}`;
}

function getProposedUrl(tool: string) {
    const overrideSlug = REQUESTED_MATCH_OVERRIDES[tool];
    const targetSlug = normalizeCalculatorSlug(overrideSlug ?? slugify(tool));
    return `/hesaplama/${targetSlug}`;
}

function getCoverageCandidates(tool: string) {
    const candidates = new Set<string>();
    const overrideSlug = REQUESTED_MATCH_OVERRIDES[tool];

    if (overrideSlug) {
        candidates.add(overrideSlug);
        candidates.add(normalizeCalculatorSlug(overrideSlug));
    }

    const directSlug = slugify(tool);
    candidates.add(directSlug);
    candidates.add(normalizeCalculatorSlug(directSlug));

    if (!/\bhesaplama\b/i.test(tool)) {
        const withHesaplama = slugify(`${tool} Hesaplama`);
        candidates.add(withHesaplama);
        candidates.add(normalizeCalculatorSlug(withHesaplama));
    }

    return Array.from(candidates).filter(Boolean);
}

function getComparisonKeys(calculator: CalculatorConfig) {
    const keys = new Set<string>();
    const textValues = [calculator.name.tr, calculator.h1?.tr, calculator.seo.title.tr].filter(
        (value): value is string => Boolean(value)
    );

    keys.add(calculator.slug);

    for (const value of textValues) {
        keys.add(normalizeComparisonText(value));
        keys.add(slugify(value));
    }

    return keys;
}

function resolveCoverage(tool: string, category: string): CoverageRow {
    for (const candidate of getCoverageCandidates(tool)) {
        const calculator = findCalculatorBySlug(candidate);
        if (calculator) {
            return {
                category,
                tool,
                status: "covered",
                calculator,
                existingUrl: getExistingUrl(calculator),
                proposedUrl: getProposedUrl(tool),
                notes: MATCH_NOTES[tool] ?? "-",
            };
        }
    }

    const targetKeys = new Set([
        normalizeComparisonText(tool),
        slugify(tool),
        normalizeComparisonText(`${tool} Hesaplama`),
        slugify(`${tool} Hesaplama`),
    ]);

    const matchedByName = calculators.find((calculator) => {
        const comparisonKeys = getComparisonKeys(calculator);
        return Array.from(targetKeys).some((key) => comparisonKeys.has(key));
    });

    if (matchedByName) {
        return {
            category,
            tool,
            status: "covered",
            calculator: matchedByName,
            existingUrl: getExistingUrl(matchedByName),
            proposedUrl: getProposedUrl(tool),
            notes: MATCH_NOTES[tool] ?? "Ad/SEO başlığı eşleşmesi ile bulundu.",
        };
    }

    return {
        category,
        tool,
        status: "missing",
        proposedUrl: getProposedUrl(tool),
        notes: "Projede eşleşen bir araç bulunamadı.",
    };
}

function renderInventorySection() {
    const grouped = calculators.reduce<Record<string, CalculatorConfig[]>>((accumulator, calculator) => {
        const key = calculator.category;
        if (!accumulator[key]) {
            accumulator[key] = [];
        }
        accumulator[key].push(calculator);
        return accumulator;
    }, {});

    return Object.entries(grouped)
        .sort(([left], [right]) => getInventoryCategoryLabel(left).localeCompare(getInventoryCategoryLabel(right), "tr"))
        .map(([category, items]) => {
            const heading = `### ${getInventoryCategoryLabel(category)} (${items.length})`;
            const lines = items
                .sort((left, right) => left.name.tr.localeCompare(right.name.tr, "tr"))
                .map((item) => `- [${item.name.tr}](${getExistingUrl(item)})`);

            return [heading, "", ...lines].join("\n");
        })
        .join("\n\n");
}

function renderSummaryTable(rows: CoverageRow[]) {
    const summary = REQUESTED_COVERAGE.map(({ category, tools }) => {
        const categoryRows = rows.filter((row) => row.category === category);
        const covered = categoryRows.filter((row) => row.status === "covered").length;
        const missing = categoryRows.length - covered;

        return {
            category,
            requested: tools.length,
            covered,
            missing,
        };
    });

    const lines = [
        "| Category | Requested | Covered | Missing |",
        "| --- | ---: | ---: | ---: |",
        ...summary.map(
            ({ category, requested, covered, missing }) =>
                `| ${category} | ${requested} | ${covered} | ${missing} |`
        ),
    ];

    return lines.join("\n");
}

function renderCoverageTable(rows: CoverageRow[]) {
    const lines = [
        "| Category | Requested Tool | Status | Existing URL | Notes |",
        "| --- | --- | --- | --- | --- |",
        ...rows.map((row) => {
            const existingUrl = row.existingUrl ?? "-";
            return `| ${row.category} | ${row.tool} | ${row.status} | ${existingUrl} | ${row.notes} |`;
        }),
    ];

    return lines.join("\n");
}

function renderMissingSection(rows: CoverageRow[]) {
    const missingRows = rows.filter((row) => row.status === "missing");

    if (missingRows.length === 0) {
        return "- None.";
    }

    return REQUESTED_COVERAGE.map(({ category }) => {
        const categoryRows = missingRows.filter((row) => row.category === category);
        if (categoryRows.length === 0) {
            return "";
        }

        const lines = categoryRows
            .map((row) => `- ${row.tool} -> ${row.proposedUrl}`)
            .join("\n");

        return `### ${category} (${categoryRows.length})\n\n${lines}`;
    })
        .filter(Boolean)
        .join("\n\n");
}

function main() {
    const rows = REQUESTED_COVERAGE.flatMap(({ category, tools }) =>
        tools.map((tool) => resolveCoverage(tool, category))
    );

    const coveredCount = rows.filter((row) => row.status === "covered").length;
    const missingRows = rows.filter((row) => row.status === "missing");
    const requestedCount = rows.length;

    const report = [
        "# Calculator Coverage Report",
        "",
        "## Route Structure",
        "",
        "- Canonical calculator route: `/{category}/{slug}`",
        "- Category hub route: `/kategori/{slug}`",
        "- Compatibility route: `/hesaplama/{slug}`",
        "",
        `## Current Calculators (${calculators.length})`,
        "",
        renderInventorySection(),
        "",
        "## Requested Coverage Summary",
        "",
        `- Requested tools: ${requestedCount}`,
        `- Covered tools: ${coveredCount}`,
        `- Missing tools: ${missingRows.length}`,
        "",
        renderSummaryTable(rows),
        "",
        "## Requested Coverage Detail",
        "",
        renderCoverageTable(rows),
        "",
        "## Missing Tools",
        "",
        renderMissingSection(rows),
        "",
    ].join("\n");

    const reportPath = path.join(process.cwd(), "reports", "calculator-coverage-full.md");
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, report, "utf8");

    console.log(`Coverage report written to ${reportPath}`);
    console.log(`Requested: ${requestedCount}`);
    console.log(`Covered: ${coveredCount}`);
    console.log(`Missing: ${missingRows.length}`);

    if (missingRows.length > 0) {
        console.log("Missing tools by category:");
        for (const { category } of REQUESTED_COVERAGE) {
            const count = missingRows.filter((row) => row.category === category).length;
            if (count > 0) {
                console.log(`- ${category}: ${count}`);
            }
        }
    }
}

main();
