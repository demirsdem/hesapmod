import fs from "node:fs";
import path from "node:path";
import { calculators as sourceCalculators } from "../lib/calculator-source";

type LocalizedText = string | { tr?: string; en?: string } | undefined;

type GapStatus =
    | "VAR"
    | "BENZER VAR"
    | "VAR AMA SEO ZAYIF"
    | "YOK"
    | "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ";

type TargetItem = {
    category: string;
    name: string;
};

type ManualMatch = {
    category: string;
    target: string;
    status: Exclude<GapStatus, "VAR AMA SEO ZAYIF">;
    slug?: string;
    note?: string;
};

type InventoryItem = {
    id: string;
    slug: string;
    category: string;
    name: string;
    description: string;
    canonicalRoute: string;
    hasSeoTitle: boolean;
    hasSeoMetaDescription: boolean;
    hasSeoContent: boolean;
    seoContentWordCount: number;
    hasSeoFaq: boolean;
    seoFaqCount: number;
    hasRelatedCalculators: boolean;
    relatedCalculatorCount: number;
    hasExampleCalculation: boolean;
    hasFormulaOrMethod: boolean;
    hasGenericTitleOrMeta: boolean;
    seoWeakReasons: string[];
    source: string;
};

type GapItem = {
    targetName: string;
    targetCategory: string;
    normalizedName: string;
    status: GapStatus;
    existingId: string | null;
    existingSlug: string | null;
    existingCategory: string | null;
    existingRoute: string | null;
    proposedSlug: string;
    proposedCategory: string;
    action: string;
    processed: boolean;
    processedInStage: string | null;
    skipped?: boolean;
    notes: string;
    seoWeakReasons: string[];
    matchSource: "manual" | "exact-slug" | "none";
    similarityScore?: number;
};

const TARGET_TEXT = `
FİNANS:
- faiz hesaplama
- bileşik faiz hesaplama
- vadeli mevduat getirisi
- kredi taksit hesaplama
- konut kredisi hesaplama
- ihtiyaç kredisi hesaplama
- taşıt kredisi hesaplama
- kredi erken kapama
- kredi toplam geri ödeme
- enflasyon hesaplama
- reel getiri hesaplama
- altın getirisi hesaplama
- dolar getirisi hesaplama
- euro getirisi hesaplama
- gram altın hesaplama
- döviz çevirici
- para değer kaybı hesaplama
- borsa kar zarar
- hisse ortalama maliyet
- portföy dağılımı
- yatırım getiri oranı
- stopaj hesaplama
- kar payı hesaplama
- ETF getiri hesaplama
- tahvil getirisi
- bono getirisi
- döviz kar zarar
- altın al sat karı
- kripto kar zarar
- kira getirisi
- gayrimenkul ROI
- amortisman süresi
- finansal özgürlük hesaplama
- pasif gelir hesaplama
- yatırım hedef hesaplama

MAAŞ & VERGİ:
- net maaş hesaplama
- brüt maaş hesaplama
- brütten nete maaş
- netten brüte maaş
- asgari ücret hesaplama
- vergi dilimi hesaplama
- gelir vergisi hesaplama
- damga vergisi hesaplama
- SGK kesintisi hesaplama
- işsizlik sigortası kesintisi
- maaş zam oranı hesaplama
- maaş artış hesaplama
- yıllık maaş hesaplama
- saatlik ücret hesaplama
- günlük ücret hesaplama
- fazla mesai hesaplama
- kıdem tazminatı hesaplama
- ihbar tazminatı hesaplama
- izin ücreti hesaplama
- emeklilik maaşı tahmini
- EYT emeklilik hesaplama
- emeklilik yaşı hesaplama
- SGK prim hesaplama
- işveren maliyeti hesaplama
- bordro hesaplama
- net gelir hesaplama
- freelance vergi hesaplama
- serbest meslek vergisi
- fatura KDV hesaplama
- stopaj hesaplama

MATEMATİK:
- yüzde hesaplama
- yüzde artış hesaplama
- yüzde azalış hesaplama
- ortalama hesaplama
- aritmetik ortalama
- geometrik ortalama
- medyan hesaplama
- standart sapma
- varyans hesaplama
- oran hesaplama
- orantı hesaplama
- faktöriyel hesaplama
- kombinasyon hesaplama
- permütasyon hesaplama
- üslü sayı hesaplama
- logaritma hesaplama
- kare hesaplama
- karekök hesaplama
- küpkök hesaplama
- alan hesaplama
- hacim hesaplama
- çevre hesaplama
- üçgen alanı
- dikdörtgen alanı
- daire alanı
- silindir hacmi
- küre hacmi
- piramit hacmi
- trigonometri hesaplama
- sin cos tan hesaplama
- polinom hesaplama
- denklem çözücü
- ikinci derece denklem
- matris hesaplama
- determinant hesaplama
- rasyonel sayı hesaplama
- kesir hesaplama
- kesir sadeleştirme
- kesir toplama çıkarma
- sayı tabanı dönüştürme

SAĞLIK:
- BMI hesaplama
- ideal kilo hesaplama
- günlük kalori ihtiyacı
- BMR hesaplama
- vücut yağ oranı
- bel kalça oranı
- su ihtiyacı hesaplama
- protein ihtiyacı
- karbonhidrat ihtiyacı
- yağ ihtiyacı
- kalori yakma hesaplama
- adım kalori hesaplama
- nabız aralığı hesaplama
- hamilelik hesaplama
- doğum tarihi hesaplama
- gebelik haftası
- bebek boy kilo hesaplama
- çocuk BMI
- ilaç doz hesaplama
- alkol promil hesaplama
- uyku süresi hesaplama
- yaş hesaplama
- metabolizma yaşı
- fitness kalori hesaplama
- spor kalori hesaplama

GÜNLÜK YAŞAM:
- yaş hesaplama
- tarih farkı hesaplama
- gün hesaplama
- hafta hesaplama
- ay hesaplama
- yıl hesaplama
- gün ekleme çıkarma
- saat farkı hesaplama
- zaman hesaplama
- geri sayım hesaplama
- doğum günü sayacı
- burç hesaplama
- boy kilo oranı
- günlük su tüketimi
- günlük harcama hesaplama
- aylık bütçe hesaplama
- tasarruf hesaplama
- elektrik tüketim hesaplama
- su faturası hesaplama
- doğalgaz tüketimi
- yakıt maliyeti
- araç km maliyeti
- yol maliyeti
- tatil bütçesi hesaplama
- kira artış hesaplama
- ev gider hesaplama
- alışveriş indirimi hesaplama
- fiyat karşılaştırma
- bahşiş hesaplama
- split hesaplama

EĞİTİM & SINAV:
- YKS puan hesaplama
- TYT puan hesaplama
- AYT puan hesaplama
- LGS puan hesaplama
- KPSS puan hesaplama
- KPSS net hesaplama
- YKS sıralama tahmini
- not ortalaması hesaplama
- GPA hesaplama
- kredi notu hesaplama
- ders ortalaması
- final notu hesaplama
- harf notu hesaplama
- devamsızlık hesaplama
- ders geçme notu
- üniversite ortalama
- diploma notu
- akademik ortalama
- eğitim süresi hesaplama
- ders çalışma planı
- net hesaplama
- test başarı oranı
- ders çalışma saati
- öğrenci bütçe hesaplama
- burs hesaplama
- eğitim kredisi
- yurt maliyeti
- okul gider hesaplama
- kitap maliyeti
- öğrenci yaşam maliyeti

İNŞAAT & MÜHENDİSLİK:
- beton hesaplama
- çimento hesaplama
- tuğla hesaplama
- boya hesaplama
- seramik hesaplama
- parke hesaplama
- demir hesaplama
- çatı alan hesaplama
- merdiven hesaplama
- metrekare hesaplama
- metreküp hesaplama
- hafriyat hesaplama
- kum hesaplama
- alçı hesaplama
- sıva hesaplama
- inşaat maliyeti hesaplama
- arsa değer hesaplama
- bina maliyet hesaplama
- elektrik kablo hesaplama
- su tesisat hesaplama
- ısı kaybı hesaplama
- güneş paneli hesaplama
- klima kapasite hesaplama
- jeneratör güç hesaplama
- enerji tüketim hesaplama

SPOR & FITNESS:
- koşu pace hesaplama
- maraton tempo hesaplama
- kalori yakma hesaplama
- adım mesafe hesaplama
- VO2 max hesaplama
- nabız aralığı
- yağ yakım bölgesi
- fitness kalori
- protein ihtiyacı
- makro hesaplama
- kas kütlesi hesaplama
- bench press max
- squat max
- deadlift max
- vücut kompozisyonu
- spor hedef hesaplama
- antrenman hacmi
- set tekrar hesaplama
- dinlenme süresi
- kardiyo süresi
`;

const SEO_CONTENT_STANDARD = [
    "# SEO Content Standard",
    "",
    "Bu standart sonraki aşamalarda yeni eklenecek veya güncellenecek hesaplayıcı sayfaları için kullanılmalıdır.",
    "",
    "## Zorunlu Alanlar",
    "",
    "- Her sayfada özgün title ve meta description olmalı.",
    "- Title ve meta hedef niyeti net anlatmalı; generic başlık kullanılmamalı.",
    "- En az 5 özgün FAQ bulunmalı.",
    "- Örnek hesaplama yer almalı.",
    "- Formül veya yöntem anlatımı bulunmalı.",
    "- Kullanım senaryosu açıklanmalı.",
    "- Sonuçların nasıl yorumlanacağı anlatılmalı.",
    "- Dikkat edilmesi gerekenler bölümü olmalı.",
    "- Related calculators/internal links tanımlanmalı.",
    "- Duplicate/canonical kontrolü yapılmalı.",
    "",
    "## Alan Bazlı Dikkatler",
    "",
    "- Finans, vergi ve sağlık sayfalarında kesin mevzuat, teşhis, tedavi veya yatırım tavsiyesi iddiası kullanılmamalı.",
    "- Güncel oran gerekiyorsa güvenilir veri yoksa oran hardcode edilmemeli; kullanıcıdan input olarak alınmalı.",
    "- Resmi oran veya mevzuat kullanılan sayfalarda kaynak ve son güncelleme tarihi görünür olmalı.",
    "- Sağlık sayfaları kişisel tanı/tedavi yerine genel bilgilendirme sunmalı.",
    "- Tıbbi doz, ilaç kullanımı veya kişisel tedavi önerisi otomatik hesaplayıcı olarak eklenmemeli.",
    "",
    "## Teknik Kontrol",
    "",
    "- `seo.content.tr` anlamlı uzunlukta olmalı.",
    "- `seo.richContent.howItWorks.tr` veya eşdeğer yöntem açıklaması bulunmalı.",
    "- `seo.richContent.formulaText.tr` veya içerikte açık formül/yöntem anlatımı bulunmalı.",
    "- `seo.richContent.exampleCalculation.tr` veya içerikte somut örnek bulunmalı.",
    "- `relatedCalculators` boş bırakılmamalı.",
    "- Canonical route sitemap ile uyumlu olmalı.",
    "",
].join("\n");

const SPECIAL_CALCULATORS = [
    {
        id: "gayrimenkul-deger-hesaplama",
        slug: "gayrimenkul-deger-hesaplama",
        category: "ozel-sayfa",
        name: { tr: "Gayrimenkul Değer Hesaplama", en: "Real Estate Value Calculator" },
        description: {
            tr: "Konut, villa, arsa, dükkan ve ofis için piyasa ortalamalarına göre m² fiyatı, kira getirisi, yatırım getirisi, amortisman ve kira-kredi karşılaştırması hesaplama sayfası.",
            en: "Real estate value, rent yield, ROI, amortization and rent-vs-loan analysis page.",
        },
        relatedCalculators: [],
        seo: {
            title: { tr: "Gayrimenkul Değer Hesaplama | Konut, Arsa, Kira ve Kredi Analizi" },
            metaDescription: {
                tr: "Gayrimenkul değer hesaplama aracıyla konut, villa, arsa, dükkan ve ofis için m² fiyatı, yatırım getirisi ve kira-kredi karşılaştırması hesaplayın.",
            },
            content: {
                tr: "Gayrimenkul değer hesaplama sayfası özel route olarak uygulanmıştır. Sayfa kira getirisi, gayrimenkul ROI, amortisman ve kira-kredi karşılaştırması modüllerini içerir.",
            },
            faq: Array.from({ length: 7 }, (_, index) => ({
                q: { tr: `Gayrimenkul SSS ${index + 1}` },
                a: { tr: "Sayfa içi FAQ." },
            })),
        },
        source: "app/gayrimenkul-deger-hesaplama/page.tsx",
    },
];

const MANUAL_MATCHES: ManualMatch[] = [
    // Finans
    m("FİNANS", "faiz hesaplama", "basit-faiz-hesaplama", "VAR", "Genel faiz niyeti mevcut basit faiz sayfasıyla karşılanıyor."),
    m("FİNANS", "vadeli mevduat getirisi", "mevduat-faiz-hesaplama", "VAR"),
    m("FİNANS", "kredi toplam geri ödeme", "kredi-taksit-hesaplama", "BENZER VAR", "Kredi taksit sayfası toplam geri ödeme çıktısı için en yakın mevcut sayfadır; ayrı hedef sayfa yok."),
    m("FİNANS", "altın getirisi hesaplama", "gecmis-altin-fiyatlari", "BENZER VAR", "Geçmiş altın fiyatları yatırım getirisi niyetine yakındır; canlı al-sat getirisi ayrı değildir."),
    m("FİNANS", "dolar getirisi hesaplama", "gecmis-doviz-kurlari", "BENZER VAR", "Geçmiş döviz kurları geçmiş USD değeri için yakındır; ayrı dolar getirisi sayfası yok."),
    m("FİNANS", "euro getirisi hesaplama", "gecmis-doviz-kurlari", "BENZER VAR", "Geçmiş döviz kurları geçmiş EUR değeri için yakındır; ayrı euro getirisi sayfası yok."),
    m("FİNANS", "gram altın hesaplama", "altin-hesaplama", "VAR"),
    m("FİNANS", "döviz çevirici", "doviz-hesaplama", "VAR"),
    m("FİNANS", "para değer kaybı hesaplama", "enflasyon-hesaplama", "BENZER VAR", "Enflasyon sayfası alım gücü/değer kaybı niyetine yakındır."),
    m("FİNANS", "borsa kar zarar", "kar-zarar-marji", "BENZER VAR", "Genel kar-zarar/marj var; borsa işlemi özelinde ayrı sayfa yok."),
    m("FİNANS", "hisse ortalama maliyet", "ortalama-maliyet-hesaplama", "BENZER VAR", "Genel ortalama maliyet var; hisse lot/fiyat niyeti ayrı değil."),
    m("FİNANS", "yatırım getiri oranı", "ic-verim-orani-hesaplama", "BENZER VAR", "IRR sayfası getiri oranı niyetine yakındır; genel ROI sayfası yok."),
    m("FİNANS", "stopaj hesaplama", "kira-stopaj-hesaplama", "BENZER VAR", "Kira stopajı var; genel yatırım/finans stopajı ayrı değil."),
    m("FİNANS", "kar payı hesaplama", "sermaye-ve-temettu-hesaplama", "VAR", "Kar payı/temettü niyeti mevcut sayfayla karşılanıyor."),
    m("FİNANS", "tahvil getirisi", "tahvil-hesaplama", "VAR"),
    m("FİNANS", "bono getirisi", "bono-hesaplama", "VAR"),
    m("FİNANS", "döviz kar zarar", "gecmis-doviz-kurlari", "BENZER VAR", "Geçmiş kur sayfası yakındır; işlem bazlı kar-zarar ayrı değil."),
    m("FİNANS", "altın al sat karı", "altin-hesaplama", "BENZER VAR", "Altın çevirici var; alış-satış karı ve makas niyeti ayrı değil."),
    m("FİNANS", "kira getirisi", "gayrimenkul-deger-hesaplama", "VAR", "Özel gayrimenkul sayfasında kira getirisi modülü var."),
    m("FİNANS", "gayrimenkul ROI", "gayrimenkul-deger-hesaplama", "VAR", "Özel gayrimenkul sayfasında yatırım/ROI modülü var."),
    m("FİNANS", "amortisman süresi", "gayrimenkul-deger-hesaplama", "VAR", "Özel gayrimenkul sayfasında amortisman süresi niyeti var."),
    m("FİNANS", "yatırım hedef hesaplama", "birikim-hesaplama", "BENZER VAR", "Birikim hedefi/yatırım birikimi için yakın mevcut sayfa var."),

    // Maaş & Vergi
    m("MAAŞ & VERGİ", "net maaş hesaplama", "maas-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "brüt maaş hesaplama", "maas-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "brütten nete maaş", "maas-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "netten brüte maaş", "maas-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "vergi dilimi hesaplama", "gelir-vergisi-hesaplama", "BENZER VAR", "Gelir vergisi sayfası dilim hesabını kapsar; ayrı vergi dilimi sayfası yok."),
    m("MAAŞ & VERGİ", "SGK kesintisi hesaplama", "maas-hesaplama", "BENZER VAR", "Maaş sayfasında SGK işçi payı sonucu var; ayrı SGK kesintisi sayfası yok."),
    m("MAAŞ & VERGİ", "işsizlik sigortası kesintisi", "maas-hesaplama", "BENZER VAR", "Maaş sayfasında işsizlik sigortası kesintisi sonucu var; ayrı sayfa yok."),
    m("MAAŞ & VERGİ", "maaş zam oranı hesaplama", "zam-hesaplama", "BENZER VAR", "Genel zam sayfası var; maaşa özel zam oranı sayfası yok."),
    m("MAAŞ & VERGİ", "maaş artış hesaplama", "zam-hesaplama", "BENZER VAR", "Genel zam sayfası var; maaşa özel artış sayfası yok."),
    m("MAAŞ & VERGİ", "yıllık maaş hesaplama", "maas-hesaplama", "BENZER VAR", "Maaş hesaplama var; yıllık maaş odağı ayrı değil."),
    m("MAAŞ & VERGİ", "izin ücreti hesaplama", "yillik-izin-ucreti-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "EYT emeklilik hesaplama", "emeklilik-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "emeklilik yaşı hesaplama", "emeklilik-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "SGK prim hesaplama", "maas-hesaplama", "BENZER VAR", "Maaş sayfası SGK işçi payını hesaplar; genel prim günü/tutarı sayfası yok."),
    m("MAAŞ & VERGİ", "işveren maliyeti hesaplama", "asgari-ucret-hesaplama", "BENZER VAR", "Asgari ücret sayfası işveren maliyetine yakındır; genel işveren maliyeti sayfası yok."),
    m("MAAŞ & VERGİ", "bordro hesaplama", "maas-hesaplama", "BENZER VAR", "Maaş bordro bileşenleri var; ayrı bordro sayfası yok."),
    m("MAAŞ & VERGİ", "net gelir hesaplama", "maas-hesaplama", "BENZER VAR", "Maaş net gelir için yakındır; genel net gelir sayfası yok."),
    m("MAAŞ & VERGİ", "freelance vergi hesaplama", "serbest-meslek-makbuzu-hesaplama", "BENZER VAR", "Serbest meslek makbuzu var; freelance yıllık vergi sayfası yok."),
    m("MAAŞ & VERGİ", "serbest meslek vergisi", "serbest-meslek-makbuzu-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "fatura KDV hesaplama", "kdv-hesaplama", "VAR"),
    m("MAAŞ & VERGİ", "stopaj hesaplama", "kira-stopaj-hesaplama", "BENZER VAR", "Kira stopajı var; genel stopaj sayfası yok."),

    // Matematik
    m("MATEMATİK", "yüzde artış hesaplama", "yuzde-hesaplama", "VAR"),
    m("MATEMATİK", "yüzde azalış hesaplama", "yuzde-hesaplama", "VAR"),
    m("MATEMATİK", "aritmetik ortalama", "ortalama-hesaplama", "VAR"),
    m("MATEMATİK", "geometrik ortalama", "ortalama-hesaplama", "VAR"),
    m("MATEMATİK", "medyan hesaplama", "ortalama-hesaplama", "VAR"),
    m("MATEMATİK", "kombinasyon hesaplama", "kombinasyon-permutasyon-faktoriyel", "VAR"),
    m("MATEMATİK", "permütasyon hesaplama", "kombinasyon-permutasyon-faktoriyel", "VAR"),
    m("MATEMATİK", "üslü sayı hesaplama", "us-kuvvet-karekok", "VAR"),
    m("MATEMATİK", "kare hesaplama", "us-kuvvet-karekok", "BENZER VAR", "Üs/kuvvet sayfası kare alma niyetini karşılayabilir; ayrı kare sayfası yok."),
    m("MATEMATİK", "karekök hesaplama", "us-kuvvet-karekok", "VAR"),
    m("MATEMATİK", "küpkök hesaplama", "us-kuvvet-karekok", "VAR"),
    m("MATEMATİK", "üçgen alanı", "ucgen-hesaplama", "VAR"),
    m("MATEMATİK", "dikdörtgen alanı", "dikdortgen-alan-cevre", "VAR"),
    m("MATEMATİK", "daire alanı", "daire-alan-cevre", "VAR"),

    // Sağlık
    m("SAĞLIK", "BMI hesaplama", "vucut-kitle-indeksi-hesaplama", "VAR", "BMI eş anlamlısı mevcut VKİ sayfasıdır."),
    m("SAĞLIK", "günlük kalori ihtiyacı", "gunluk-kalori-ihtiyaci", "VAR"),
    m("SAĞLIK", "BMR hesaplama", "bazal-metabolizma-hizi-hesaplama", "VAR"),
    m("SAĞLIK", "vücut yağ oranı", "vucut-yag-orani-hesaplama", "VAR"),
    m("SAĞLIK", "bel kalça oranı", "bel-kalca-orani-hesaplama", "VAR"),
    m("SAĞLIK", "su ihtiyacı hesaplama", "gunluk-su-ihtiyaci-hesaplama", "VAR"),
    m("SAĞLIK", "protein ihtiyacı", "gunluk-protein-ihtiyaci-hesaplama", "VAR"),
    m("SAĞLIK", "karbonhidrat ihtiyacı", "gunluk-karbonhidrat-ihtiyaci-hesaplama", "VAR"),
    m("SAĞLIK", "yağ ihtiyacı", "gunluk-yag-ihtiyaci-hesaplama", "VAR"),
    m("SAĞLIK", "hamilelik hesaplama", "gebelik-hesaplama", "VAR"),
    m("SAĞLIK", "gebelik haftası", "hamilelik-haftasi-hesaplama", "VAR"),
    m("SAĞLIK", "bebek boy kilo hesaplama", "bebek-boyu-hesaplama", "BENZER VAR", "Bebek boyu ve bebek kilosu ayrı sayfalar olarak var."),
    m("SAĞLIK", "ilaç doz hesaplama", undefined, "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ", "Kişisel tıbbi doz önerisi otomatik hesaplayıcı olarak eklenmemeli."),
    m("SAĞLIK", "yaş hesaplama", "yas-hesaplama-detayli", "VAR"),
    m("SAĞLIK", "fitness kalori hesaplama", "gunluk-kalori-ihtiyaci", "BENZER VAR", "Günlük kalori/TDEE var; fitness egzersiz yakımı ayrı değil."),
    m("SAĞLIK", "spor kalori hesaplama", "gunluk-kalori-ihtiyaci", "BENZER VAR", "Günlük kalori/TDEE var; spor kalori yakımı ayrı değil."),

    // Günlük yaşam
    m("GÜNLÜK YAŞAM", "yaş hesaplama", "yas-hesaplama-detayli", "VAR"),
    m("GÜNLÜK YAŞAM", "tarih farkı hesaplama", "iki-tarih-arasindaki-gun-sayisi-hesaplama", "VAR"),
    m("GÜNLÜK YAŞAM", "gün hesaplama", "tarih-hesaplama", "BENZER VAR", "Genel tarih hesaplama var; bağımsız gün hesaplama sayfası yok."),
    m("GÜNLÜK YAŞAM", "ay hesaplama", "tarih-hesaplama", "BENZER VAR", "Genel tarih hesaplama var; bağımsız ay hesaplama sayfası yok."),
    m("GÜNLÜK YAŞAM", "yıl hesaplama", "tarih-hesaplama", "BENZER VAR", "Genel tarih hesaplama var; bağımsız yıl hesaplama sayfası yok."),
    m("GÜNLÜK YAŞAM", "gün ekleme çıkarma", "tarih-hesaplama", "BENZER VAR", "Tarih hesaplama en yakın mevcut sayfadır."),
    m("GÜNLÜK YAŞAM", "zaman hesaplama", "zaman-birimleri-donusturucu", "BENZER VAR", "Zaman birimleri dönüştürücü var; genel zaman hesaplama sayfası yok."),
    m("GÜNLÜK YAŞAM", "geri sayım hesaplama", "kac-gun-kaldi-hesaplama", "VAR"),
    m("GÜNLÜK YAŞAM", "doğum günü sayacı", "kac-gun-kaldi-hesaplama", "BENZER VAR", "Kaç gün kaldı sayfası geri sayım niyetine yakındır; doğum günü özel değil."),
    m("GÜNLÜK YAŞAM", "burç hesaplama", "burc-hesaplama", "VAR"),
    m("GÜNLÜK YAŞAM", "boy kilo oranı", "vucut-kitle-indeksi-hesaplama", "BENZER VAR", "Boy-kilo oranı niyeti VKİ sayfasına yakın."),
    m("GÜNLÜK YAŞAM", "günlük su tüketimi", "gunluk-su-ihtiyaci-hesaplama", "VAR"),
    m("GÜNLÜK YAŞAM", "tasarruf hesaplama", "birikim-hesaplama", "BENZER VAR", "Birikim sayfası tasarruf birikimi niyetine yakındır."),
    m("GÜNLÜK YAŞAM", "yakıt maliyeti", "yakit-tuketim-maliyet", "VAR"),
    m("GÜNLÜK YAŞAM", "araç km maliyeti", "yakit-tuketim-maliyet", "BENZER VAR", "Yakıt maliyeti sayfası km başına maliyeti kapsar."),
    m("GÜNLÜK YAŞAM", "yol maliyeti", "yakit-tuketim-maliyet", "BENZER VAR", "Yakıt/yol gideri için en yakın mevcut sayfa."),
    m("GÜNLÜK YAŞAM", "kira artış hesaplama", "kira-artis-hesaplama", "VAR"),
    m("GÜNLÜK YAŞAM", "alışveriş indirimi hesaplama", "indirim-hesaplama", "VAR"),
    m("GÜNLÜK YAŞAM", "fiyat karşılaştırma", "fiyat-hesaplama", "BENZER VAR", "Fiyat hesaplama var; karşılaştırma modülü ayrı değil."),

    // Eğitim & sınav
    m("EĞİTİM & SINAV", "AYT puan hesaplama", "yks-puan-hesaplama", "BENZER VAR", "YKS sayfası TYT/AYT/YDT bileşenlerini birlikte kapsar; ayrı AYT sayfası yok."),
    m("EĞİTİM & SINAV", "KPSS net hesaplama", "kpss-puan-hesaplama", "BENZER VAR", "KPSS sayfası net bazlı puan hesaplar; yalnız net sayfası yok."),
    m("EĞİTİM & SINAV", "not ortalaması hesaplama", "ortalama-hesaplama", "VAR"),
    m("EĞİTİM & SINAV", "GPA hesaplama", "universite-not-ortalamasi-hesaplama", "VAR"),
    m("EĞİTİM & SINAV", "kredi notu hesaplama", "universite-not-ortalamasi-hesaplama", "BENZER VAR", "Üniversite kredi/AKTS ortalaması var; ayrı kredi notu sayfası yok."),
    m("EĞİTİM & SINAV", "ders ortalaması", "ders-notu-hesaplama", "BENZER VAR", "Ders notu sayfası ders ortalaması niyetine yakındır."),
    m("EĞİTİM & SINAV", "final notu hesaplama", "vize-final-ortalama-hesaplama", "BENZER VAR", "Vize-final ortalama sayfası final notu niyetine yakındır."),
    m("EĞİTİM & SINAV", "harf notu hesaplama", "universite-not-ortalamasi-hesaplama", "BENZER VAR", "Üniversite ortalaması sayfası harf notu bağlamına yakındır; ayrı harf notu sayfası yok."),
    m("EĞİTİM & SINAV", "devamsızlık hesaplama", "lise-sinif-gecme-hesaplama", "BENZER VAR", "Sınıf geçme sayfası devamsızlık riskini içerir; ayrı devamsızlık sayfası yok."),
    m("EĞİTİM & SINAV", "ders geçme notu", "lise-sinif-gecme-hesaplama", "BENZER VAR"),
    m("EĞİTİM & SINAV", "üniversite ortalama", "universite-not-ortalamasi-hesaplama", "VAR"),
    m("EĞİTİM & SINAV", "diploma notu", "lise-mezuniyet-puani-hesaplama", "BENZER VAR", "Lise mezuniyet puanı/OBP bağlamı var; genel diploma notu sayfası yok."),
    m("EĞİTİM & SINAV", "akademik ortalama", "universite-not-ortalamasi-hesaplama", "BENZER VAR"),
    m("EĞİTİM & SINAV", "net hesaplama", "yks-puan-hesaplama", "BENZER VAR", "Sınav puan sayfaları netlerden puan üretir; genel net hesaplama sayfası yok."),

    // İnşaat & mühendislik
    m("İNŞAAT & MÜHENDİSLİK", "metrekare hesaplama", "insaat-alani-hesaplama", "BENZER VAR", "İnşaat alanı sayfası m² niyetine yakındır."),
    m("İNŞAAT & MÜHENDİSLİK", "inşaat maliyeti hesaplama", "insaat-maliyeti-hesaplama", "VAR"),
    m("İNŞAAT & MÜHENDİSLİK", "arsa değer hesaplama", "gayrimenkul-deger-hesaplama", "BENZER VAR", "Gayrimenkul değer özel sayfası arsa değerini de kapsar; ayrı arsa değer sayfası yok."),
    m("İNŞAAT & MÜHENDİSLİK", "bina maliyet hesaplama", "insaat-maliyeti-hesaplama", "BENZER VAR", "İnşaat maliyeti sayfası bina maliyeti niyetine yakındır."),
    m("İNŞAAT & MÜHENDİSLİK", "klima kapasite hesaplama", "klima-btu-hesaplama", "VAR"),

    // Spor & fitness
    m("SPOR & FITNESS", "fitness kalori", "gunluk-kalori-ihtiyaci", "BENZER VAR", "TDEE/günlük kalori var; egzersiz kalori yakımı ayrı değil."),
    m("SPOR & FITNESS", "protein ihtiyacı", "gunluk-protein-ihtiyaci-hesaplama", "VAR"),
    m("SPOR & FITNESS", "makro hesaplama", "gunluk-makro-besin-ihtiyaci-hesaplama", "VAR"),
    m("SPOR & FITNESS", "vücut kompozisyonu", "vucut-yag-orani-hesaplama", "BENZER VAR", "Vücut yağ oranı var; kapsamlı kompozisyon sayfası yok."),
];

function m(
    category: string,
    target: string,
    slug: string | undefined,
    status: ManualMatch["status"],
    note = ""
): ManualMatch {
    return { category, target, slug, status, note };
}

const TARGET_CATEGORY_TO_PROPOSED_CATEGORY: Record<string, string> = {
    "FİNANS": "finansal-hesaplamalar",
    "MAAŞ & VERGİ": "maas-ve-vergi",
    "MATEMATİK": "matematik-hesaplama",
    "SAĞLIK": "yasam-hesaplama",
    "GÜNLÜK YAŞAM": "diger",
    "EĞİTİM & SINAV": "sinav-hesaplamalari",
    "İNŞAAT & MÜHENDİSLİK": "ticaret-ve-is",
    "SPOR & FITNESS": "yasam-hesaplama",
};

const LOW_WEIGHT_WORDS = new Set([
    "hesaplama",
    "hesaplayici",
    "araci",
    "arac",
    "calculator",
    "calc",
]);

const SYNONYM_GROUPS = [
    ["bmi", "vki", "vucut kitle indeksi"],
    ["hamilelik", "gebelik"],
    ["dogum tarihi", "gebelik", "hamilelik"],
    ["net maas", "net ucret"],
    ["brut maas", "brut ucret"],
    ["gun farki", "tarih farki", "iki tarih arasi gun"],
    ["alisveris indirimi", "indirim"],
    ["split", "hesap bolusme", "kisi basi odeme"],
];

function toText(value: LocalizedText): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.tr ?? value.en ?? "";
}

function stripHtml(value: string): string {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalize(value: string): string {
    return value
        .toLocaleLowerCase("tr-TR")
        .replace(/ç/g, "c")
        .replace(/ğ/g, "g")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ş/g, "s")
        .replace(/ü/g, "u")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function slugify(value: string): string {
    return normalize(value).replace(/\s+/g, "-");
}

function tokenize(value: string): string[] {
    const normalized = expandSynonyms(normalize(value));
    return normalized.split(" ").filter(Boolean);
}

function expandSynonyms(value: string): string {
    let result = value;
    for (const group of SYNONYM_GROUPS) {
        const normalizedGroup = group.map(normalize);
        const canonical = normalizedGroup[0];
        if (normalizedGroup.some((term) => result.includes(term))) {
            for (const term of normalizedGroup) {
                result += ` ${term}`;
            }
            result += ` ${canonical}`;
        }
    }
    return result;
}

function weightedTokenScore(target: string, candidate: InventoryItem): number {
    const targetTokens = tokenize(target);
    const candidateTokens = tokenize(`${candidate.name} ${candidate.slug} ${candidate.description}`);
    const candidateSet = new Set(candidateTokens);
    let total = 0;
    let matched = 0;

    for (const token of targetTokens) {
        const weight = LOW_WEIGHT_WORDS.has(token) ? 0.25 : 1;
        total += weight;
        if (candidateSet.has(token)) {
            matched += weight;
        }
    }

    return total === 0 ? 0 : matched / total;
}

function targetKey(category: string, target: string) {
    return `${normalize(category)}::${normalize(target)}`;
}

function parseTargets(text: string): TargetItem[] {
    const targets: TargetItem[] = [];
    let currentCategory = "";

    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line) continue;

        if (line.endsWith(":")) {
            currentCategory = line.slice(0, -1).trim();
            continue;
        }

        if (line.startsWith("- ")) {
            if (!currentCategory) {
                throw new Error(`Kategori olmadan hedef bulundu: ${line}`);
            }
            targets.push({ category: currentCategory, name: line.slice(2).trim() });
        }
    }

    return targets;
}

function analyzeSeo(calc: any): Omit<
    InventoryItem,
    "id" | "slug" | "category" | "name" | "description" | "canonicalRoute" | "source"
> {
    const seo = calc.seo ?? {};
    const name = toText(calc.name);
    const title = toText(seo.title);
    const meta = toText(seo.metaDescription);
    const content = stripHtml(toText(seo.content));
    const contentWords = content ? content.split(/\s+/).filter(Boolean).length : 0;
    const faqCount = Array.isArray(seo.faq) ? seo.faq.length : 0;
    const relatedCount = Array.isArray(calc.relatedCalculators) ? calc.relatedCalculators.length : 0;
    const richContent = seo.richContent ?? {};
    const richExample = toText(richContent.exampleCalculation);
    const richFormula = `${toText(richContent.formulaText)} ${toText(richContent.howItWorks)}`;
    const hasExampleCalculation = Boolean(richExample) || /\b(ornek|örnek)\b/i.test(content);
    const hasFormulaOrMethod =
        Boolean(richFormula.trim()) || /\b(formul|formül|yontem|yöntem|mantik|mantık|nasil hesap|nasıl hesap)\b/i.test(content);
    const hasGenericTitleOrMeta =
        !title ||
        !meta ||
        normalize(title) === normalize(name) ||
        normalize(meta) === normalize(calc.description?.tr ?? "");

    const seoWeakReasons: string[] = [];
    if (!title) seoWeakReasons.push("seo.title yok");
    if (!meta) seoWeakReasons.push("seo.metaDescription yok");
    if (!content) seoWeakReasons.push("seo.content yok");
    if (content && contentWords < 120) seoWeakReasons.push(`seo.content çok kısa (${contentWords} kelime)`);
    if (!hasExampleCalculation) seoWeakReasons.push("örnek hesaplama yok");
    if (!hasFormulaOrMethod) seoWeakReasons.push("formül/yöntem anlatımı yok");
    if (faqCount < 5) seoWeakReasons.push(`FAQ 5'ten az (${faqCount})`);
    if (relatedCount === 0) seoWeakReasons.push("related/internal link yok");
    if (hasGenericTitleOrMeta) seoWeakReasons.push("title/meta generic veya eksik");

    return {
        hasSeoTitle: Boolean(title),
        hasSeoMetaDescription: Boolean(meta),
        hasSeoContent: Boolean(content),
        seoContentWordCount: contentWords,
        hasSeoFaq: faqCount > 0,
        seoFaqCount: faqCount,
        hasRelatedCalculators: relatedCount > 0,
        relatedCalculatorCount: relatedCount,
        hasExampleCalculation,
        hasFormulaOrMethod,
        hasGenericTitleOrMeta,
        seoWeakReasons,
    };
}

function toInventoryItem(calc: any, source: string): InventoryItem {
    const category = calc.category;
    const canonicalRoute = category === "ozel-sayfa" ? `/${calc.slug}` : `/${category}/${calc.slug}`;
    return {
        id: calc.id,
        slug: calc.slug,
        category,
        name: toText(calc.name),
        description: toText(calc.description),
        canonicalRoute,
        ...analyzeSeo(calc),
        source,
    };
}

function isSeoWeak(item: InventoryItem) {
    return item.seoWeakReasons.length > 0;
}

function statusCounts(items: GapItem[]) {
    return items.reduce(
        (acc, item) => {
            acc[item.status] += 1;
            acc.total += 1;
            return acc;
        },
        {
            total: 0,
            VAR: 0,
            "BENZER VAR": 0,
            "VAR AMA SEO ZAYIF": 0,
            YOK: 0,
            "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ": 0,
        } as Record<GapStatus | "total", number>
    );
}

function buildAction(status: GapStatus, existing: InventoryItem | null, reasons: string[], manualNote: string) {
    if (status === "VAR") return "Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı.";
    if (status === "BENZER VAR") {
        return `Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı.${manualNote ? ` Not: ${manualNote}` : ""}`;
    }
    if (status === "VAR AMA SEO ZAYIF") {
        return `Mevcut sayfa SEO standardına göre güçlendirilmeli: ${reasons.join("; ")}`;
    }
    if (status === "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ") {
        return "Otomatik hesaplayıcı eklenmez. Güvenli alternatif: genel bilgilendirme sayfası; kişisel doz/formül önerisi yok; doktor/eczacı talimatı vurgulanmalı.";
    }
    return `Yeni hesaplayıcı planlanmalı.${existing ? ` En yakın aday: ${existing.canonicalRoute}` : ""}`;
}

function analyzeTarget(
    target: TargetItem,
    inventoryBySlug: Map<string, InventoryItem>,
    manualByKey: Map<string, ManualMatch>,
    inventory: InventoryItem[]
): GapItem {
    const normalizedName = normalize(target.name);
    const proposedSlug = slugify(target.name);
    const proposedCategory = TARGET_CATEGORY_TO_PROPOSED_CATEGORY[target.category] ?? slugify(target.category);
    const manual = manualByKey.get(targetKey(target.category, target.name));
    const exact = inventoryBySlug.get(proposedSlug) ?? null;
    let existing: InventoryItem | null = null;
    let status: GapStatus = "YOK";
    let matchSource: GapItem["matchSource"] = "none";
    let notes = "";

    if (manual) {
        matchSource = "manual";
        notes = manual.note ?? "";
        if (manual.status === "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ") {
            status = manual.status;
        } else if (manual.slug) {
            existing = inventoryBySlug.get(manual.slug) ?? null;
            if (!existing) {
                status = "YOK";
                notes = `${notes ? `${notes} ` : ""}Manual match slug bulunamadı: ${manual.slug}`;
            } else if (manual.status === "VAR" && isSeoWeak(existing)) {
                status = "VAR AMA SEO ZAYIF";
            } else {
                status = manual.status;
            }
        } else {
            status = manual.status;
        }
    } else if (exact) {
        existing = exact;
        matchSource = "exact-slug";
        status = isSeoWeak(exact) ? "VAR AMA SEO ZAYIF" : "VAR";
    }

    const bestCandidate = inventory
        .map((item) => ({ item, score: weightedTokenScore(target.name, item) }))
        .sort((a, b) => b.score - a.score)[0];
    const similarityScore = bestCandidate?.score ?? 0;
    const seoWeakReasons = existing?.seoWeakReasons ?? [];
    const action = buildAction(status, existing, seoWeakReasons, notes);
    const skipped = status === "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ";
    const processed =
        status === "VAR" ||
        status === "BENZER VAR" ||
        status === "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ";

    return {
        targetName: target.name,
        targetCategory: target.category,
        normalizedName,
        status,
        existingId: existing?.id ?? null,
        existingSlug: existing?.slug ?? null,
        existingCategory: existing?.category ?? null,
        existingRoute: existing?.canonicalRoute ?? null,
        proposedSlug,
        proposedCategory,
        action,
        processed,
        processedInStage: processed ? (skipped ? "safety-exception" : "existing-inventory") : null,
        skipped: skipped || undefined,
        notes: notes || (matchSource === "exact-slug" ? "Slug eşleşmesi gerçek katalogdan bulundu." : ""),
        seoWeakReasons,
        matchSource,
        similarityScore: Number(similarityScore.toFixed(3)),
    };
}

function markdownTable(items: GapItem[]) {
    const rows = [
        "| Kategori | Hedef Hesaplayıcı | Durum | Mevcut Slug | Önerilen Aksiyon |",
        "|---|---|---|---|---|",
    ];

    for (const item of items) {
        rows.push(
            `| ${escapeMd(item.targetCategory)} | ${escapeMd(item.targetName)} | ${item.status} | ${item.existingSlug ? `\`${item.existingSlug}\`` : "-"} | ${escapeMd(item.action)} |`
        );
    }

    return rows.join("\n");
}

function escapeMd(value: string) {
    return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function writeJson(filePath: string, data: unknown) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function main() {
    const reportsDir = path.join(process.cwd(), "reports");
    fs.mkdirSync(reportsDir, { recursive: true });

    const targets = parseTargets(TARGET_TEXT);
    const manualByKey = new Map(MANUAL_MATCHES.map((item) => [targetKey(item.category, item.target), item]));
    const inventory = [
        ...sourceCalculators.map((calculator) => toInventoryItem(calculator, "lib/calculator-source.ts")),
        ...SPECIAL_CALCULATORS.map((calculator) => toInventoryItem(calculator, calculator.source)),
    ];
    const inventoryBySlug = new Map(inventory.map((item) => [item.slug, item]));
    const gapItems = targets.map((target) => analyzeTarget(target, inventoryBySlug, manualByKey, inventory));
    const summary = statusCounts(gapItems);
    const generatedAt = new Date().toISOString();

    const md = `# Calculator Gap Analysis

Generated at: ${generatedAt}

Source files read:

- \`lib/calculator-source.ts\`
- \`lib/calculators.ts\`
- \`lib/customCalculators.ts\`
- \`lib/calculator-trust.ts\`
- \`lib/content-last-modified.ts\`
- \`lib/sitemap-data.ts\`
- \`app/[category]/[slug]/page.tsx\`
- \`app/sitemap.ts\`
- \`app/robots.ts\`
- \`next.config.mjs\`
- \`package.json\`

## Özet

- Toplam hedef madde: ${summary.total}
- VAR: ${summary.VAR}
- BENZER VAR: ${summary["BENZER VAR"]}
- VAR AMA SEO ZAYIF: ${summary["VAR AMA SEO ZAYIF"]}
- YOK: ${summary.YOK}
- GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ: ${summary["GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ"]}

## Detay

${markdownTable(gapItems)}
`;

    const fullJson = {
        generatedAt,
        sourceFiles: [
            "lib/calculator-source.ts",
            "lib/calculators.ts",
            "lib/customCalculators.ts",
            "lib/calculator-trust.ts",
            "lib/content-last-modified.ts",
            "lib/sitemap-data.ts",
            "app/[category]/[slug]/page.tsx",
            "app/sitemap.ts",
            "app/robots.ts",
            "next.config.mjs",
            "package.json",
        ],
        summary,
        inventory,
        targets: gapItems,
    };

    const implementationStatus = {
        generatedAt,
        summary,
        items: gapItems.map((item) => ({
            targetName: item.targetName,
            targetCategory: item.targetCategory,
            normalizedName: item.normalizedName,
            status: item.status,
            existingId: item.existingId,
            existingSlug: item.existingSlug,
            existingCategory: item.existingCategory,
            proposedSlug: item.proposedSlug,
            proposedCategory: item.proposedCategory,
            action: item.action,
            processed: item.processed,
            processedInStage: item.processedInStage,
            skipped: item.skipped ?? false,
            notes: item.notes,
        })),
    };

    const safetyItems = gapItems.filter((item) => item.status === "GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ");
    const safetyMd = `# Skipped or Safety Exceptions

Generated at: ${generatedAt}

| Kategori | Hedef | Durum | Gerekçe | Güvenli Alternatif |
|---|---|---|---|---|
${safetyItems
    .map(
        (item) =>
            `| ${escapeMd(item.targetCategory)} | ${escapeMd(item.targetName)} | ${item.status} | ${escapeMd(item.notes)} | Genel bilgilendirme sayfası olabilir; kişisel doz formülü veya doz önerisi olmamalı; doktor/eczacı talimatı olmadan doz belirlenmemeli. |`
    )
    .join("\n")}
`;

    fs.writeFileSync(path.join(reportsDir, "calculator-gap-analysis.md"), md, "utf8");
    writeJson(path.join(reportsDir, "calculator-gap-analysis.json"), fullJson);
    writeJson(path.join(reportsDir, "implementation-status.json"), implementationStatus);
    fs.writeFileSync(path.join(reportsDir, "seo-content-standard.md"), SEO_CONTENT_STANDARD, "utf8");
    fs.writeFileSync(path.join(reportsDir, "skipped-or-safety-exceptions.md"), safetyMd, "utf8");

    console.log(JSON.stringify(summary, null, 2));
}

main();
