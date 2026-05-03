import type { CalculatorConfig } from "./calculator-types";

type FaqTuple = [string, string];

type SeoArgs = {
    title: string;
    metaDescription: string;
    intro: string;
    formula: string;
    example: string;
    interpretation: string;
    caution: string;
    links: string;
    faq: FaqTuple[];
};

function faqEntry(question: string, answer: string) {
    return {
        q: { tr: question, en: question },
        a: { tr: answer, en: answer },
    };
}

function buildSeo(args: SeoArgs): CalculatorConfig["seo"] {
    return {
        title: { tr: args.title, en: args.title },
        metaDescription: { tr: args.metaDescription, en: args.metaDescription },
        content: {
            tr: `<h2>${args.title} Nasıl Kullanılır?</h2><p>${args.intro}</p><h2>Formül ve Birim Mantığı</h2><p>${args.formula}</p><h2>Örnek Hesaplama</h2><p>${args.example}</p><h2>Sonucu Nasıl Yorumlamalı?</h2><p>${args.interpretation}</p><h2>Fire, Proje ve Yerel Farklar</h2><p>${args.caution}</p><h2>İlgili İnşaat Hesaplamaları</h2><p>${args.links}</p>`,
            en: `${args.intro} Formula: ${args.formula} Example: ${args.example} Results are estimates and should be checked against local materials, project details, and professional engineering requirements.`,
        },
        faq: args.faq.map(([question, answer]) => faqEntry(question, answer)),
        richContent: {
            howItWorks: { tr: args.intro, en: args.intro },
            formulaText: { tr: args.formula, en: args.formula },
            exampleCalculation: { tr: args.example, en: args.example },
            miniGuide: {
                tr: `<p>${args.interpretation}</p><p>${args.caution}</p>`,
                en: `${args.interpretation} ${args.caution}`,
            },
        },
    };
}

const numberInput = (
    id: string,
    tr: string,
    en: string,
    defaultValue: number,
    options: Partial<CalculatorConfig["inputs"][number]> = {}
) => ({
    id,
    name: { tr, en },
    type: "number" as const,
    defaultValue,
    required: true,
    ...options,
});

const selectInput = (
    id: string,
    tr: string,
    en: string,
    defaultValue: string,
    options: Array<{ label: { tr: string; en: string }; value: string }>
) => ({
    id,
    name: { tr, en },
    type: "select" as const,
    defaultValue,
    options,
    required: true,
});

const numberResult = (
    id: string,
    tr: string,
    en: string,
    suffix = "",
    decimalPlaces = 2
) => ({
    id,
    label: { tr, en },
    suffix,
    decimalPlaces,
});

const textResult = (id: string, tr: string, en: string) => ({
    id,
    label: { tr, en },
    type: "text" as const,
});

const materialLinks =
    '<a href="/insaat-muhendislik/beton-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">beton hesaplama</a>, <a href="/insaat-muhendislik/cimento-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">çimento hesaplama</a>, <a href="/insaat-muhendislik/kum-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kum hesaplama</a>, <a href="/insaat-muhendislik/demir-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">demir hesaplama</a> ve <a href="/insaat-muhendislik/hafriyat-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">hafriyat hesaplama</a> aynı kaba inşaat planını tamamlar.';

const finishLinks =
    '<a href="/insaat-muhendislik/boya-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">boya hesaplama</a>, <a href="/insaat-muhendislik/seramik-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">seramik hesaplama</a>, <a href="/insaat-muhendislik/parke-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">parke hesaplama</a> ve <a href="/ticaret-ve-is/insaat-alani-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">metrekare/alan hesaplama</a> bitirme işi keşfini güçlendirir.';

const geometryLinks =
    '<a href="/insaat-muhendislik/cati-alan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">çatı alan hesaplama</a>, <a href="/insaat-muhendislik/merdiven-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">merdiven hesaplama</a> ve <a href="/insaat-muhendislik/metrekup-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">metreküp hesaplama</a> ölçü çıkarma sürecinde birlikte kullanılabilir.';

const costLinks =
    '<a href="/ticaret-ve-is/insaat-maliyeti-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">inşaat maliyeti hesaplama</a>, <a href="/ticaret-ve-is/insaat-maliyeti-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">bina maliyeti hesaplama</a> ve <a href="/gayrimenkul-deger-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">arsa değer hesaplama</a> yatırım ve bütçe tarafındaki tamamlayıcı sayfalardır.';

const systemsLinks =
    '<a href="/insaat-muhendislik/elektrik-kablo-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">elektrik kablo hesaplama</a>, <a href="/insaat-muhendislik/su-tesisat-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">su tesisat hesaplama</a>, <a href="/insaat-muhendislik/isi-kaybi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ısı kaybı hesaplama</a>, <a href="/insaat-muhendislik/gunes-paneli-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">güneş paneli hesaplama</a> ve <a href="/diger/klima-btu-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">klima kapasite hesaplama</a> mekanik-elektrik ön keşfinde birlikte değerlendirilir.';

export const phase14ConstructionCalculators: CalculatorConfig[] = [
    {
        id: "concrete-volume-calculator",
        slug: "beton-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Beton Hesaplama", en: "Concrete Calculator" },
        h1: { tr: "Beton Hesaplama", en: "Concrete Calculator" },
        description: {
            tr: "Döşeme, temel veya saha betonu için m³ beton hacmini, fire dahil sipariş miktarını ve yaklaşık tonajı hesaplayın.",
            en: "Estimate concrete volume, order quantity including waste, and approximate weight for slabs, foundations, and site concrete.",
        },
        shortDescription: { tr: "m³ beton, fire ve tonaj hesabı.", en: "Concrete m3, waste and weight estimate." },
        relatedCalculators: ["cimento-hesaplama", "kum-hesaplama", "demir-hesaplama", "hafriyat-hesaplama", "metrekup-hesaplama"],
        inputs: [
            numberInput("length", "Uzunluk", "Length", 10, { min: 0, step: 0.1, suffix: "m" }),
            numberInput("width", "Genişlik", "Width", 6, { min: 0, step: 0.1, suffix: "m" }),
            numberInput("thicknessCm", "Beton Kalınlığı", "Concrete Thickness", 15, { min: 1, step: 1, suffix: "cm" }),
            numberInput("wasteRate", "Fire Payı", "Waste Allowance", 7, { min: 0, max: 30, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("netVolumeM3", "Net Beton Hacmi", "Net Concrete Volume", " m³"),
            numberResult("orderVolumeM3", "Fire Dahil Sipariş Hacmi", "Order Volume Including Waste", " m³"),
            numberResult("estimatedWeightTon", "Yaklaşık Beton Ağırlığı", "Approximate Concrete Weight", " ton"),
            numberResult("truckLoads", "Yaklaşık 7,5 m³ Mikser", "Approx. 7.5 m3 Trucks", " sefer"),
        ],
        formula: (values) => {
            const length = Math.max(0, Number(values.length) || 0);
            const width = Math.max(0, Number(values.width) || 0);
            const thicknessM = Math.max(0, Number(values.thicknessCm) || 0) / 100;
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netVolumeM3 = length * width * thicknessM;
            const orderVolumeM3 = netVolumeM3 * (1 + wasteRate / 100);

            return {
                netVolumeM3,
                orderVolumeM3,
                estimatedWeightTon: orderVolumeM3 * 2.4,
                truckLoads: Math.ceil((orderVolumeM3 / 7.5) * 10) / 10,
            };
        },
        seo: buildSeo({
            title: "Beton Hesaplama (m³ Beton ve Fire Dahil Sipariş)",
            metaDescription: "Beton hesaplama aracıyla uzunluk, genişlik ve kalınlık girerek m³ beton hacmini, fire dahil sipariş miktarını ve yaklaşık tonajı hesaplayın.",
            intro: "Bu araç döşeme, temel, perde veya saha betonu gibi işlerde ölçüden m³ beton ihtiyacını çıkarır. Uzunluk ve genişlik metre, kalınlık santimetre girilir; sonuç net hacim, fire dahil sipariş hacmi ve yaklaşık tonaj olarak gösterilir.",
            formula: "Net beton hacmi = uzunluk × genişlik × kalınlık(m). Fire dahil hacim = net hacim × (1 + fire oranı/100). Yaklaşık beton ağırlığı için 1 m³ hazır beton 2,4 ton kabul edilir.",
            example: "10 m × 6 m alanda 15 cm kalınlık için net hacim 9,00 m³ olur. %7 fireyle sipariş hacmi yaklaşık 9,63 m³, ağırlık yaklaşık 23,11 ton görünür.",
            interpretation: "Sonuç şantiye ön keşfi ve sipariş konuşması için tahmini bir baz verir. Kalıp toleransı, kot farkı, zemin düzeltmesi ve pompa kaybı gerçek ihtiyacı artırabilir.",
            caution: "Bu hesap statik proje, beton sınıfı veya taşıyıcı sistem onayı yerine geçmez. Nihai miktar için uygulama projesi, yerel hazır beton tedarikçisi ve şantiye ölçüsü birlikte kontrol edilmelidir.",
            links: materialLinks,
            faq: [
                ["Beton hesabında kalınlığı hangi birimde girmeliyim?", "Kalınlık santimetre girilir; araç bunu otomatik olarak metreye çevirip m³ hacim hesabına dahil eder."],
                ["Beton siparişinde fire payı neden gerekir?", "Kalıp boşlukları, yüzey düzensizliği, pompa hattı ve uygulama toleransı nedeniyle net hacmin üzerinde sipariş gerekebilir."],
                ["1 m³ beton kaç ton kabul edilir?", "Hazır beton için pratik ön keşifte 1 m³ yaklaşık 2,3-2,5 ton aralığında değerlendirilir; araç 2,4 ton varsayar."],
                ["Mikser sefer sayısı kesin midir?", "Hayır. Mikser kapasitesi firmaya ve erişim koşullarına göre değişir; sefer değeri yalnız lojistik ön tahminidir."],
                ["Beton sınıfı sonucu değiştirir mi?", "Hacim hesabını değiştirmez, fakat maliyet, dayanım ve proje uygunluğu beton sınıfına göre değişir."],
            ],
        }),
    },
    {
        id: "cement-calculator",
        slug: "cimento-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Çimento Hesaplama", en: "Cement Calculator" },
        h1: { tr: "Çimento Hesaplama", en: "Cement Calculator" },
        description: {
            tr: "Harç veya beton hacmine göre gerekli çimento kg ve torba sayısını fire dahil hesaplayın.",
            en: "Estimate cement weight and bag count for mortar or concrete volume including waste.",
        },
        shortDescription: { tr: "Kg ve torba çimento hesabı.", en: "Cement kg and bag count." },
        relatedCalculators: ["beton-hesaplama", "kum-hesaplama", "siva-hesaplama", "alci-hesaplama", "hafriyat-hesaplama"],
        inputs: [
            numberInput("volumeM3", "Harç/Beton Hacmi", "Mortar/Concrete Volume", 5, { min: 0, step: 0.1, suffix: "m³" }),
            numberInput("cementKgPerM3", "m³ Başına Çimento", "Cement per m3", 300, { min: 1, step: 5, suffix: "kg/m³" }),
            numberInput("bagKg", "Torba Ağırlığı", "Bag Weight", 50, { min: 1, step: 1, suffix: "kg" }),
            numberInput("wasteRate", "Fire Payı", "Waste Allowance", 5, { min: 0, max: 30, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("netCementKg", "Net Çimento", "Net Cement", " kg"),
            numberResult("totalCementKg", "Fire Dahil Çimento", "Cement Including Waste", " kg"),
            numberResult("bagCount", "Gerekli Torba", "Required Bags", " torba", 0),
        ],
        formula: (values) => {
            const volumeM3 = Math.max(0, Number(values.volumeM3) || 0);
            const cementKgPerM3 = Math.max(0, Number(values.cementKgPerM3) || 0);
            const bagKg = Math.max(1, Number(values.bagKg) || 50);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netCementKg = volumeM3 * cementKgPerM3;
            const totalCementKg = netCementKg * (1 + wasteRate / 100);

            return {
                netCementKg,
                totalCementKg,
                bagCount: Math.ceil(totalCementKg / bagKg),
            };
        },
        seo: buildSeo({
            title: "Çimento Hesaplama (Kg ve Torba Sayısı)",
            metaDescription: "Çimento hesaplama aracıyla harç veya beton hacmi için kg çimento ihtiyacını, fire dahil toplamı ve torba sayısını hesaplayın.",
            intro: "Çimento hesabı, seçilen karışım dozajına göre m³ başına gereken çimento miktarını bulur. Hacim m³, dozaj kg/m³, torba ağırlığı kg girilir.",
            formula: "Net çimento = hacim(m³) × kg/m³ dozaj. Fire dahil çimento = net çimento × (1 + fire/100). Torba sayısı = fire dahil kg / torba kg, yukarı yuvarlanır.",
            example: "5 m³ harç için 300 kg/m³ dozaj ve 50 kg torba kullanılırsa net 1.500 kg gerekir. %5 fireyle toplam 1.575 kg, yani 32 torba hesaplanır.",
            interpretation: "Sonuç karışım sınıfı ve saha uygulaması için ön malzeme listesi verir. Dozaj arttıkça dayanım ve maliyet artabilir; her iş için aynı dozaj uygun değildir.",
            caution: "Harç, şap ve beton reçeteleri proje şartnamesine göre değişir. Yerel agrega, su/çimento oranı ve katkılar sonucu etkileyebileceği için nihai reçete profesyonelce doğrulanmalıdır.",
            links: materialLinks,
            faq: [
                ["Çimento dozajı nedir?", "Dozaj, 1 m³ karışımda kullanılan çimento kg miktarıdır. İşin türüne ve hedef dayanımına göre değişir."],
                ["Torba sayısı neden yukarı yuvarlanıyor?", "Sahada yarım torba tedariki pratik olmadığından toplam ihtiyaç en yakın üst tam torbaya yuvarlanır."],
                ["50 kg dışındaki torbalar için hesap yapılabilir mi?", "Evet. Torba ağırlığı alanına 25 kg veya kullandığınız ambalaj değerini girebilirsiniz."],
                ["Çimento hesabı beton sınıfını belirler mi?", "Hayır. Araç yalnız malzeme miktarı tahmini verir; beton sınıfı ve reçete laboratuvar/proje koşullarıyla belirlenir."],
                ["Fire payı çimentoda ne kadar alınmalı?", "Küçük işlerde %5-10 arası pratik bir ön kabul olabilir; şantiye koşulları daha yüksek pay gerektirebilir."],
            ],
        }),
    },
    {
        id: "brick-calculator",
        slug: "tugla-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Tuğla Hesaplama", en: "Brick Calculator" },
        h1: { tr: "Tuğla Hesaplama", en: "Brick Calculator" },
        description: {
            tr: "Duvar alanına göre net ve fire dahil tuğla adedini, paket/palet ihtiyacını hesaplayın.",
            en: "Estimate brick quantity and packs/pallets from wall area including waste.",
        },
        shortDescription: { tr: "Duvar için adet tuğla hesabı.", en: "Brick count for wall work." },
        relatedCalculators: ["siva-hesaplama", "alci-hesaplama", "boya-hesaplama", "metrekup-hesaplama", "insaat-alani-hesaplama"],
        inputs: [
            numberInput("wallAreaM2", "Duvar Alanı", "Wall Area", 50, { min: 0, step: 0.1, suffix: "m²" }),
            numberInput("brickPerM2", "m² Başına Tuğla", "Bricks per m2", 25, { min: 1, step: 1, suffix: "adet/m²" }),
            numberInput("packageQty", "Paket/Palet Adedi", "Pack/Pallet Quantity", 120, { min: 1, step: 1, suffix: "adet" }),
            numberInput("wasteRate", "Kırık/Fire Payı", "Breakage/Waste", 8, { min: 0, max: 30, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("netBrickCount", "Net Tuğla", "Net Bricks", " adet", 0),
            numberResult("totalBrickCount", "Fire Dahil Tuğla", "Bricks Including Waste", " adet", 0),
            numberResult("packageCount", "Paket/Palet", "Packs/Pallets", " adet", 0),
        ],
        formula: (values) => {
            const wallAreaM2 = Math.max(0, Number(values.wallAreaM2) || 0);
            const brickPerM2 = Math.max(0, Number(values.brickPerM2) || 0);
            const packageQty = Math.max(1, Number(values.packageQty) || 1);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netBrickCount = Math.ceil(wallAreaM2 * brickPerM2);
            const totalBrickCount = Math.ceil(netBrickCount * (1 + wasteRate / 100));

            return {
                netBrickCount,
                totalBrickCount,
                packageCount: Math.ceil(totalBrickCount / packageQty),
            };
        },
        seo: buildSeo({
            title: "Tuğla Hesaplama (m² Duvar İçin Adet)",
            metaDescription: "Tuğla hesaplama aracıyla duvar alanı, m² başına tuğla adedi ve fire oranına göre toplam tuğla ve palet ihtiyacını hesaplayın.",
            intro: "Tuğla hesabı, duvar alanını m² başına tuğla tüketimiyle çarpar. Kapı, pencere boşlukları düşüldükten sonra net duvar alanını kullanmak sonucu daha gerçekçi yapar.",
            formula: "Net tuğla = duvar alanı(m²) × m² başına tuğla adedi. Fire dahil tuğla = net adet × (1 + fire/100). Paket/palet = toplam adet / paket adedi.",
            example: "50 m² duvarda m² başına 25 tuğla için net 1.250 adet gerekir. %8 fireyle toplam 1.350 adet, 120'lik paketle 12 paket hesaplanır.",
            interpretation: "Sonuç kaba duvar malzemesi için hızlı keşif verir. Tuğla ölçüsü, derz kalınlığı, kesim miktarı ve boşluklar gerçek adetleri değiştirebilir.",
            caution: "Taşıyıcı duvar, yangın dayanımı ve ses/ısı performansı gibi konular yalnız adet hesabıyla belirlenmez. Proje şartnamesi ve yerel uygulama detayları kontrol edilmelidir.",
            links: finishLinks,
            faq: [
                ["m² başına kaç tuğla kullanılır?", "Tuğla tipine göre değişir. İnce blok, yatay delikli tuğla ve gazbeton farklı tüketim değerlerine sahiptir; üretici verisi kullanılmalıdır."],
                ["Kapı ve pencere boşlukları düşülmeli mi?", "Evet. Net duvar alanı hesaplanırken büyük boşlukları düşmek daha doğru adet verir."],
                ["Fire oranı kaç alınmalı?", "Kesim, kırık ve taşıma kaybı nedeniyle çoğu küçük işte %5-10 arası ön pay kullanılabilir."],
                ["Derz kalınlığı sonucu etkiler mi?", "Evet. Derz kalınlığı büyüdükçe m² başına tuğla adedi azalabilir; bu yüzden tüketim katsayısı doğru seçilmelidir."],
                ["Palet sayısı kesin sipariş sayısı mıdır?", "Hayır. Palet adedi tedarikçiye göre değişir; sonuç satın alma öncesi paketleme bilgisiyle doğrulanmalıdır."],
            ],
        }),
    },
    {
        id: "paint-calculator",
        slug: "boya-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Boya Hesaplama", en: "Paint Calculator" },
        h1: { tr: "Boya Hesaplama", en: "Paint Calculator" },
        description: {
            tr: "m² alan, kat sayısı ve boya sarfiyatına göre litre boya ve kova ihtiyacını hesaplayın.",
            en: "Estimate paint liters and bucket count from area, coats, and coverage.",
        },
        shortDescription: { tr: "m² boya ve litre hesabı.", en: "Paint m2 and liter estimate." },
        relatedCalculators: ["seramik-hesaplama", "parke-hesaplama", "insaat-alani-hesaplama", "alci-hesaplama", "siva-hesaplama"],
        inputs: [
            numberInput("paintAreaM2", "Boyanacak Alan", "Paint Area", 80, { min: 0, step: 0.1, suffix: "m²" }),
            numberInput("coatCount", "Kat Sayısı", "Coats", 2, { min: 1, step: 1, suffix: "kat" }),
            numberInput("coverageM2PerLiter", "1 Litre Boya Kaplama", "Coverage per Liter", 10, { min: 0.1, step: 0.5, suffix: "m²/L" }),
            numberInput("wasteRate", "Rulo/Fırça Fire Payı", "Waste Allowance", 10, { min: 0, max: 40, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("netPaintLiter", "Net Boya", "Net Paint", " L"),
            numberResult("totalPaintLiter", "Fire Dahil Boya", "Paint Including Waste", " L"),
            numberResult("bucket15Liter", "15 L Kova", "15 L Buckets", " kova", 0),
            numberResult("primerLiter", "Yaklaşık Astar", "Approx. Primer", " L"),
        ],
        formula: (values) => {
            const paintAreaM2 = Math.max(0, Number(values.paintAreaM2) || 0);
            const coatCount = Math.max(1, Number(values.coatCount) || 1);
            const coverageM2PerLiter = Math.max(0.1, Number(values.coverageM2PerLiter) || 10);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netPaintLiter = (paintAreaM2 * coatCount) / coverageM2PerLiter;
            const totalPaintLiter = netPaintLiter * (1 + wasteRate / 100);

            return {
                netPaintLiter,
                totalPaintLiter,
                bucket15Liter: Math.ceil(totalPaintLiter / 15),
                primerLiter: paintAreaM2 / 12,
            };
        },
        seo: buildSeo({
            title: "Boya Hesaplama (m² Alan, Litre ve Kova)",
            metaDescription: "Boya hesaplama aracıyla duvar alanı, kat sayısı ve boya kaplama değerine göre kaç litre boya ve kaç kova gerektiğini hesaplayın.",
            intro: "Boya hesabı, boyanacak net m² alanı kat sayısıyla çarpar ve boya ambalajındaki m²/L kaplama değerine böler. Sonuca fire ve emiş payı eklenir.",
            formula: "Net boya litre = alan(m²) × kat sayısı / kaplama(m²/L). Fire dahil litre = net litre × (1 + fire/100). 15 L kova sayısı yukarı yuvarlanır.",
            example: "80 m² alan, 2 kat ve 10 m²/L kaplama için net 16 L boya gerekir. %10 fireyle 17,6 L, yani 2 adet 15 L kova önerilir.",
            interpretation: "Sonuç boya satın alma ve tadilat bütçesi için tahmindir. Koyu renkten açık renge geçiş, yüzey emiciliği ve astar ihtiyacı litreyi artırabilir.",
            caution: "Boya markası, ürün tipi, yüzey hazırlığı ve uygulama ekipmanı sonucu etkiler. Nihai sarfiyat için ürün teknik föyü ve yerel usta uygulaması dikkate alınmalıdır.",
            links: finishLinks,
            faq: [
                ["Boya hesabında alan nasıl ölçülür?", "Duvar genişliği ile yüksekliği çarpılır; büyük pencere ve kapı boşlukları istenirse düşülebilir."],
                ["Tavan boyası dahil mi?", "Eğer tavan boyanacaksa tavan alanını da boyanacak alana eklemelisiniz."],
                ["Kat sayısı sonucu nasıl etkiler?", "Kat sayısı ikiye çıktığında teorik boya ihtiyacı da yaklaşık iki katına çıkar."],
                ["Astar boyayı azaltır mı?", "Emici yüzeylerde astar son kat boyanın daha dengeli yayılmasına yardımcı olabilir, fakat ayrı bir malzeme ihtiyacıdır."],
                ["m²/L değeri nereden alınır?", "Boya kutusu veya teknik föydeki kaplama değeri kullanılmalıdır; yüzeye göre gerçek değer değişebilir."],
            ],
        }),
    },
    {
        id: "ceramic-calculator",
        slug: "seramik-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Seramik Hesaplama", en: "Ceramic Tile Calculator" },
        h1: { tr: "Seramik Hesaplama", en: "Ceramic Tile Calculator" },
        description: {
            tr: "Zemin veya duvar alanına göre seramik adet, fire dahil kaplama alanı ve kutu sayısı hesaplayın.",
            en: "Estimate ceramic tile quantity, area including waste, and box count.",
        },
        shortDescription: { tr: "Seramik adet ve kutu hesabı.", en: "Tile count and box estimate." },
        relatedCalculators: ["boya-hesaplama", "parke-hesaplama", "insaat-alani-hesaplama", "metrekup-hesaplama", "siva-hesaplama"],
        inputs: [
            numberInput("areaM2", "Kaplanacak Alan", "Coverage Area", 30, { min: 0, step: 0.1, suffix: "m²" }),
            numberInput("tileLengthCm", "Seramik Uzunluğu", "Tile Length", 60, { min: 1, step: 1, suffix: "cm" }),
            numberInput("tileWidthCm", "Seramik Genişliği", "Tile Width", 60, { min: 1, step: 1, suffix: "cm" }),
            numberInput("boxM2", "Kutu Kaplama Alanı", "Box Coverage", 1.44, { min: 0.01, step: 0.01, suffix: "m²/kutu" }),
            numberInput("wasteRate", "Kesim/Fire Payı", "Cutting Waste", 10, { min: 0, max: 40, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("tileAreaM2", "Tek Seramik Alanı", "Single Tile Area", " m²", 4),
            numberResult("totalAreaM2", "Fire Dahil Alan", "Area Including Waste", " m²"),
            numberResult("tileCount", "Gerekli Seramik", "Required Tiles", " adet", 0),
            numberResult("boxCount", "Gerekli Kutu", "Required Boxes", " kutu", 0),
        ],
        formula: (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const tileLengthCm = Math.max(1, Number(values.tileLengthCm) || 1);
            const tileWidthCm = Math.max(1, Number(values.tileWidthCm) || 1);
            const boxM2 = Math.max(0.01, Number(values.boxM2) || 1);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const tileAreaM2 = (tileLengthCm / 100) * (tileWidthCm / 100);
            const totalAreaM2 = areaM2 * (1 + wasteRate / 100);

            return {
                tileAreaM2,
                totalAreaM2,
                tileCount: Math.ceil(totalAreaM2 / tileAreaM2),
                boxCount: Math.ceil(totalAreaM2 / boxM2),
            };
        },
        seo: buildSeo({
            title: "Seramik Hesaplama (Adet, m² ve Kutu)",
            metaDescription: "Seramik hesaplama aracıyla kaplanacak m² alan, seramik ölçüsü ve fire oranına göre adet ve kutu ihtiyacını hesaplayın.",
            intro: "Seramik hesabı, kaplanacak alanı fire payıyla büyütür; seramik ölçüsünden tek parça alanını bulur ve adet/kutu ihtiyacını hesaplar.",
            formula: "Tek seramik alanı = uzunluk(m) × genişlik(m). Fire dahil alan = net alan × (1 + fire/100). Adet = fire dahil alan / tek seramik alanı.",
            example: "30 m² alan, 60×60 cm seramik ve %10 fire için toplam 33 m² alan gerekir. Tek seramik 0,36 m² olduğu için yaklaşık 92 adet hesaplanır.",
            interpretation: "Sonuç kaplama malzemesi için ön sipariş miktarıdır. Diyagonal döşeme, küçük hacimler, süpürgelik kesimleri ve desen takibi fireyi artırabilir.",
            caution: "Seramik kalibrasyonu, derz aralığı, kutu içeriği ve üretim partisindeki ton farkları satın alma kararını etkiler; tedarikçi kutu bilgisiyle doğrulama yapılmalıdır.",
            links: finishLinks,
            faq: [
                ["Seramik fire payı kaç alınmalı?", "Düz döşemede %7-10, çapraz veya çok kesimli işlerde %12-15 ve üzeri ön pay gerekebilir."],
                ["Seramik ölçüsünü cm mi girmeliyim?", "Evet. Uzunluk ve genişlik santimetre girilir; araç bunu m² alana çevirir."],
                ["Kutu sayısı neden ayrıca var?", "Seramik genellikle kutu ile satıldığı için m² ihtiyacının yanında satın alma kutu sayısı da gerekir."],
                ["Duvar seramiği için kullanılabilir mi?", "Evet. Net duvar m² alanını girerek aynı mantıkla hesap yapabilirsiniz."],
                ["Derz aralığı hesaba dahil mi?", "Araç derz aralığını ayrıca modellemez; m² tüketim açısından pratik ön tahmin verir."],
            ],
        }),
    },
    {
        id: "flooring-calculator",
        slug: "parke-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Parke Hesaplama", en: "Laminate Flooring Calculator" },
        h1: { tr: "Parke Hesaplama", en: "Laminate Flooring Calculator" },
        description: {
            tr: "Zemin m² alanına göre fire dahil parke alanı, paket sayısı ve yaklaşık süpürgelik ihtiyacını hesaplayın.",
            en: "Estimate laminate flooring area including waste, pack count, and approximate skirting needs.",
        },
        shortDescription: { tr: "Parke paket ve fire hesabı.", en: "Flooring pack and waste estimate." },
        relatedCalculators: ["boya-hesaplama", "seramik-hesaplama", "insaat-alani-hesaplama", "metrekup-hesaplama", "insaat-maliyeti-hesaplama"],
        inputs: [
            numberInput("areaM2", "Zemin Alanı", "Floor Area", 45, { min: 0, step: 0.1, suffix: "m²" }),
            numberInput("packageM2", "Paket Kaplama Alanı", "Package Coverage", 2.2, { min: 0.01, step: 0.01, suffix: "m²/paket" }),
            numberInput("perimeterM", "Oda Çevresi", "Room Perimeter", 32, { min: 0, step: 0.1, suffix: "m" }),
            numberInput("wasteRate", "Kesim/Fire Payı", "Cutting Waste", 8, { min: 0, max: 30, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("totalAreaM2", "Fire Dahil Parke", "Flooring Including Waste", " m²"),
            numberResult("packageCount", "Gerekli Paket", "Required Packages", " paket", 0),
            numberResult("skirtingM", "Yaklaşık Süpürgelik", "Approx. Skirting", " m"),
        ],
        formula: (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const packageM2 = Math.max(0.01, Number(values.packageM2) || 1);
            const perimeterM = Math.max(0, Number(values.perimeterM) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const totalAreaM2 = areaM2 * (1 + wasteRate / 100);

            return {
                totalAreaM2,
                packageCount: Math.ceil(totalAreaM2 / packageM2),
                skirtingM: perimeterM * 1.05,
            };
        },
        seo: buildSeo({
            title: "Parke Hesaplama (m², Paket ve Süpürgelik)",
            metaDescription: "Parke hesaplama aracıyla zemin alanı, paket m² değeri ve fire oranına göre kaç paket parke gerektiğini hesaplayın.",
            intro: "Parke hesabı, zemin alanına kesim ve fire payı ekler; paket üzerindeki m² kaplama değerine göre paket sayısını bulur. Oda çevresi girilirse süpürgelik için de yaklaşık metre verir.",
            formula: "Fire dahil parke alanı = zemin alanı × (1 + fire/100). Paket sayısı = fire dahil alan / paket m², yukarı yuvarlanır. Süpürgelik = çevre × 1,05.",
            example: "45 m² zemin, 2,2 m² paket ve %8 fire için 48,6 m² parke gerekir. Paket sayısı 23; 32 m çevre için yaklaşık 33,6 m süpürgelik görünür.",
            interpretation: "Sonuç laminat veya lamine parke satın alma planında kullanılabilir. Döşeme yönü, oda kırıkları, eşik kesimleri ve desen takibi fireyi artırabilir.",
            caution: "Paket m² değeri marka ve seri bazında değişir. Nem bariyeri, şilte, süpürgelik tipi ve uygulama zemini ayrıca kontrol edilmelidir.",
            links: finishLinks,
            faq: [
                ["Parke fire payı kaç olmalı?", "Düz ve az kırıklı alanlarda %5-8, çok odalı veya çapraz döşemede %10 ve üzeri kullanılabilir."],
                ["Paket m² değeri nereden alınır?", "Parke paketinin üzerinde yazan kaplama alanı veya üretici teknik bilgisi kullanılmalıdır."],
                ["Süpürgelik hesabı kapı boşluklarını düşer mi?", "Araç çevreye küçük bir pay ekler; kapı boşlukları ve nişler için net ölçüyle düzeltme yapılmalıdır."],
                ["Şilte dahil mi?", "Hayır. Araç parke ve süpürgelik ön keşfi verir; şilte/rutubet bariyeri ayrıca hesaplanmalıdır."],
                ["Zemin eğriliği sonucu etkiler mi?", "Miktarı doğrudan değiştirmese de uygulama kalitesi ve ek hazırlık maliyeti üzerinde etkili olabilir."],
            ],
        }),
    },
    {
        id: "rebar-calculator",
        slug: "demir-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Demir Hesaplama", en: "Rebar Calculator" },
        h1: { tr: "Demir Hesaplama", en: "Rebar Calculator" },
        description: {
            tr: "Beton hacmi ve kg/m³ donatı katsayısına göre yaklaşık inşaat demiri kg ve ton hesabı yapın.",
            en: "Estimate construction rebar kilograms and tons from concrete volume and kg/m3 coefficient.",
        },
        shortDescription: { tr: "Donatı kg ve ton ön hesabı.", en: "Rebar kg and ton estimate." },
        relatedCalculators: ["beton-hesaplama", "cimento-hesaplama", "kum-hesaplama", "hafriyat-hesaplama", "insaat-maliyeti-hesaplama"],
        inputs: [
            numberInput("concreteVolumeM3", "Beton Hacmi", "Concrete Volume", 20, { min: 0, step: 0.1, suffix: "m³" }),
            numberInput("kgPerM3", "Donatı Katsayısı", "Rebar Coefficient", 90, { min: 0, step: 1, suffix: "kg/m³" }),
            numberInput("wasteRate", "Bindirme/Fire Payı", "Overlap/Waste", 7, { min: 0, max: 30, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("netRebarKg", "Net Demir", "Net Rebar", " kg"),
            numberResult("totalRebarKg", "Fire Dahil Demir", "Rebar Including Waste", " kg"),
            numberResult("totalRebarTon", "Toplam Demir", "Total Rebar", " ton"),
        ],
        formula: (values) => {
            const concreteVolumeM3 = Math.max(0, Number(values.concreteVolumeM3) || 0);
            const kgPerM3 = Math.max(0, Number(values.kgPerM3) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netRebarKg = concreteVolumeM3 * kgPerM3;
            const totalRebarKg = netRebarKg * (1 + wasteRate / 100);

            return {
                netRebarKg,
                totalRebarKg,
                totalRebarTon: totalRebarKg / 1000,
            };
        },
        seo: buildSeo({
            title: "Demir Hesaplama (İnşaat Donatısı Kg ve Ton)",
            metaDescription: "Demir hesaplama aracıyla beton hacmi ve kg/m³ donatı katsayısına göre inşaat demiri ihtiyacını kg ve ton olarak tahmin edin.",
            intro: "Demir hesabı, kaba keşif aşamasında beton hacmi üzerinden yaklaşık donatı miktarı üretir. Beton hacmi m³, donatı katsayısı kg/m³ girilir.",
            formula: "Net demir kg = beton hacmi(m³) × donatı katsayısı(kg/m³). Fire dahil demir = net kg × (1 + bindirme/fire/100). Ton = kg / 1000.",
            example: "20 m³ beton ve 90 kg/m³ donatı katsayısı için net 1.800 kg çıkar. %7 bindirme/fire payıyla toplam 1.926 kg, yani 1,93 ton görünür.",
            interpretation: "Sonuç maliyet ve tedarik ön hesabı içindir. Temel, perde, kolon, kiriş ve döşeme donatı yoğunluğu birbirinden çok farklı olabilir.",
            caution: "Bu araç statik proje ve demir metrajının yerine geçmez. Çap, aralık, bindirme boyu ve zayiat değerleri mühendislik projesinden okunmalıdır.",
            links: materialLinks,
            faq: [
                ["kg/m³ donatı katsayısı ne demek?", "1 m³ beton başına yaklaşık kaç kg demir kullanılacağını ifade eden ön keşif katsayısıdır."],
                ["Demir hesabı statik projeye göre kesinleşir mi?", "Evet. Nihai demir metrajı statik projedeki çap, aralık, bindirme ve kesim detaylarına göre hazırlanır."],
                ["Fire payı neden eklenir?", "Bindirme, kesim, şekillendirme ve küçük zayiatlar nedeniyle teorik kg üzerine pay eklenir."],
                ["Her yapı için 90 kg/m³ uygun mu?", "Hayır. Yapı tipi, deprem bölgesi, taşıyıcı sistem ve eleman türü katsayıyı değiştirir."],
                ["Sonuç ton olarak nasıl okunur?", "Toplam kg değeri 1000'e bölünerek ton karşılığı verilir; satın alma genellikle ton üzerinden konuşulur."],
            ],
        }),
    },
    {
        id: "roof-area-calculator",
        slug: "cati-alan-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Çatı Alan Hesaplama", en: "Roof Area Calculator" },
        h1: { tr: "Çatı Alan Hesaplama", en: "Roof Area Calculator" },
        description: {
            tr: "Bina ölçüsü, saçak ve eğim oranına göre yaklaşık çatı kaplama alanını ve fire dahil malzeme alanını hesaplayın.",
            en: "Estimate roof surface area and material area from building size, eaves, and slope.",
        },
        shortDescription: { tr: "Eğimli çatı m² hesabı.", en: "Sloped roof area estimate." },
        relatedCalculators: ["merdiven-hesaplama", "metrekup-hesaplama", "insaat-alani-hesaplama", "beton-hesaplama", "insaat-maliyeti-hesaplama"],
        inputs: [
            numberInput("buildingLengthM", "Bina Uzunluğu", "Building Length", 12, { min: 0, step: 0.1, suffix: "m" }),
            numberInput("buildingWidthM", "Bina Genişliği", "Building Width", 8, { min: 0, step: 0.1, suffix: "m" }),
            numberInput("eaveCm", "Saçak Payı", "Eave Allowance", 40, { min: 0, step: 1, suffix: "cm" }),
            numberInput("slopePercent", "Çatı Eğimi", "Roof Slope", 35, { min: 0, max: 200, step: 1, suffix: "%" }),
            numberInput("wasteRate", "Kaplama Fire Payı", "Material Waste", 10, { min: 0, max: 40, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("planAreaM2", "Saçak Dahil Plan Alanı", "Plan Area Including Eaves", " m²"),
            numberResult("roofAreaM2", "Eğimli Çatı Alanı", "Sloped Roof Area", " m²"),
            numberResult("materialAreaM2", "Fire Dahil Malzeme Alanı", "Material Area Including Waste", " m²"),
        ],
        formula: (values) => {
            const buildingLengthM = Math.max(0, Number(values.buildingLengthM) || 0);
            const buildingWidthM = Math.max(0, Number(values.buildingWidthM) || 0);
            const eaveM = Math.max(0, Number(values.eaveCm) || 0) / 100;
            const slopePercent = Math.max(0, Number(values.slopePercent) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const planAreaM2 = (buildingLengthM + 2 * eaveM) * (buildingWidthM + 2 * eaveM);
            const slopeFactor = Math.sqrt(1 + Math.pow(slopePercent / 100, 2));
            const roofAreaM2 = planAreaM2 * slopeFactor;

            return {
                planAreaM2,
                roofAreaM2,
                materialAreaM2: roofAreaM2 * (1 + wasteRate / 100),
            };
        },
        seo: buildSeo({
            title: "Çatı Alan Hesaplama (Eğimli Çatı m²)",
            metaDescription: "Çatı alan hesaplama aracıyla bina ölçüsü, saçak payı ve eğim oranına göre eğimli çatı m² alanını ve fire dahil kaplama ihtiyacını hesaplayın.",
            intro: "Çatı alan hesabı, bina plan ölçüsünü saçak payıyla büyütür ve eğim faktörüyle çatı yüzey alanına çevirir. Sonuç m² kaplama alanı olarak okunur.",
            formula: "Plan alan = (uzunluk + 2×saçak) × (genişlik + 2×saçak). Eğim faktörü = √(1 + eğim²). Çatı alanı = plan alan × eğim faktörü.",
            example: "12×8 m bina, 40 cm saçak ve %35 eğimde plan alan 106,24 m² olur. Eğimli alan yaklaşık 112,57 m², %10 fireyle 123,83 m² hesaplanır.",
            interpretation: "Sonuç kiremit, sandviç panel, membran veya kaplama siparişi için ön m² verir. Kırma çatı, mahya, dere, baca ve çıkmalar gerçek metrajı etkiler.",
            caution: "Çatı geometrisi basit dikdörtgen kabul edilmiştir. Nihai metraj için çatı planı, kesit, kaplama modülü ve yerel uygulama detayı ayrıca kontrol edilmelidir.",
            links: geometryLinks,
            faq: [
                ["Çatı eğimi yüzde olarak nasıl girilir?", "Yatayda 100 cm ilerlerken kaç cm yükseldiğini yüzde olarak girin; örneğin 35 cm yükselme %35 eğimdir."],
                ["Saçak payı neden iki taraftan ekleniyor?", "Saçak hem uzunluk hem genişlik yönünde bina ölçüsüne dışarıdan pay eklediği için formülde iki kenara eklenir."],
                ["Kırma çatı için kullanılabilir mi?", "Basit ön keşif için kullanılabilir; fakat kırma, mahya ve dere detayları kesin metrajı değiştirir."],
                ["Kaplama fire payı kaç olmalı?", "Malzeme modülü ve kesim yoğunluğuna göre %5-15 arası ön pay kullanılabilir."],
                ["Çatı alanı ile taban alanı neden farklı?", "Eğimli yüzey, yatay izdüşümden daha büyüktür; eğim arttıkça çatı m² alanı da artar."],
            ],
        }),
    },
    {
        id: "stair-calculator",
        slug: "merdiven-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Merdiven Hesaplama", en: "Stair Calculator" },
        h1: { tr: "Merdiven Hesaplama", en: "Stair Calculator" },
        description: {
            tr: "Kat yüksekliği, rıht yüksekliği ve basamak derinliğine göre basamak sayısı, gerçek rıht ve merdiven kol boyunu hesaplayın.",
            en: "Estimate step count, adjusted riser height, and stair run from floor height and tread depth.",
        },
        shortDescription: { tr: "Basamak sayısı ve merdiven ölçüsü.", en: "Stair step and run estimate." },
        relatedCalculators: ["cati-alan-hesaplama", "metrekup-hesaplama", "insaat-alani-hesaplama", "beton-hesaplama", "insaat-maliyeti-hesaplama"],
        inputs: [
            numberInput("floorHeightCm", "Kat Yüksekliği", "Floor Height", 300, { min: 1, step: 1, suffix: "cm" }),
            numberInput("targetRiserCm", "Hedef Rıht", "Target Riser", 17, { min: 10, max: 25, step: 0.5, suffix: "cm" }),
            numberInput("treadDepthCm", "Basamak Genişliği", "Tread Depth", 28, { min: 15, max: 45, step: 0.5, suffix: "cm" }),
            numberInput("stairWidthCm", "Merdiven Kolu Genişliği", "Stair Width", 100, { min: 50, step: 1, suffix: "cm" }),
        ],
        results: [
            numberResult("stepCount", "Rıht/Basamak Sayısı", "Riser Count", " adet", 0),
            numberResult("adjustedRiserCm", "Gerçek Rıht", "Adjusted Riser", " cm"),
            numberResult("runLengthM", "Yaklaşık Kol Boyu", "Approx. Run Length", " m"),
            numberResult("stairPlanAreaM2", "Yaklaşık Plan Alanı", "Approx. Plan Area", " m²"),
            textResult("comfortNote", "Konfor Notu", "Comfort Note"),
        ],
        formula: (values) => {
            const floorHeightCm = Math.max(1, Number(values.floorHeightCm) || 1);
            const targetRiserCm = Math.max(1, Number(values.targetRiserCm) || 17);
            const treadDepthCm = Math.max(1, Number(values.treadDepthCm) || 28);
            const stairWidthCm = Math.max(1, Number(values.stairWidthCm) || 100);
            const stepCount = Math.max(1, Math.round(floorHeightCm / targetRiserCm));
            const adjustedRiserCm = floorHeightCm / stepCount;
            const runLengthM = ((stepCount - 1) * treadDepthCm) / 100;
            const comfortValue = 2 * adjustedRiserCm + treadDepthCm;

            return {
                stepCount,
                adjustedRiserCm,
                runLengthM,
                stairPlanAreaM2: runLengthM * (stairWidthCm / 100),
                comfortNote: comfortValue >= 60 && comfortValue <= 64 ? "Konfor aralığına yakın" : "Konfor formülü ayrıca kontrol edilmeli",
            };
        },
        seo: buildSeo({
            title: "Merdiven Hesaplama (Basamak, Rıht ve Kol Boyu)",
            metaDescription: "Merdiven hesaplama aracıyla kat yüksekliği ve basamak ölçülerinden rıht sayısını, gerçek rıht yüksekliğini ve merdiven kol boyunu hesaplayın.",
            intro: "Merdiven hesabı, kat yüksekliğini hedef rıht yüksekliğine bölerek basamak sayısını çıkarır. Sonra gerçek rıht, kol boyu ve yaklaşık plan alanı hesaplanır.",
            formula: "Basamak/rıht sayısı = kat yüksekliği / hedef rıht, en yakın tam sayıya yuvarlanır. Gerçek rıht = kat yüksekliği / rıht sayısı. Kol boyu = (rıht sayısı - 1) × basamak derinliği.",
            example: "300 cm kat yüksekliği ve 17 cm hedef rıht için 18 rıht bulunur. Gerçek rıht 16,67 cm, 28 cm basamakta kol boyu yaklaşık 4,76 m olur.",
            interpretation: "Sonuç mimari ön tasarım ve yer kontrolü için kullanılır. Konfor için 2×rıht + basamak derinliği çoğu pratikte 60-64 cm bandında hedeflenir.",
            caution: "Merdiven yönetmelikleri, kaçış şartları, sahanlık, korkuluk ve kullanım tipi farklı ölçüler gerektirebilir. Nihai tasarım mimari/statik proje ile doğrulanmalıdır.",
            links: geometryLinks,
            faq: [
                ["Rıht yüksekliği nedir?", "İki basamak arasındaki düşey yüksekliktir. Kat yüksekliği rıht sayısına bölünerek gerçek rıht bulunur."],
                ["Basamak genişliği burada neyi ifade eder?", "Yürüme yönündeki yatay basamak derinliğini ifade eder; merdiven kolu genişliğinden farklıdır."],
                ["Konfor formülü nedir?", "Pratikte 2×rıht + basamak derinliği değerinin yaklaşık 60-64 cm bandında olması hedeflenir."],
                ["Sahanlık hesaba dahil mi?", "Hayır. Araç tek kol ön hesabı verir; sahanlık alanı ayrıca eklenmelidir."],
                ["Dubleks ev için kullanılabilir mi?", "Ön ölçülendirme için kullanılabilir; ancak nihai ölçüler mimari proje ve yerel yönetmelikle kontrol edilmelidir."],
            ],
        }),
    },
    {
        id: "cubic-meter-calculator",
        slug: "metrekup-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Metreküp Hesaplama", en: "Cubic Meter Calculator" },
        h1: { tr: "Metreküp Hesaplama", en: "Cubic Meter Calculator" },
        description: {
            tr: "Uzunluk, genişlik ve yükseklik ölçülerinden hacmi m³ ve litre olarak hesaplayın.",
            en: "Calculate volume in cubic meters and liters from length, width, and height.",
        },
        shortDescription: { tr: "m³ hacim ve litre hesabı.", en: "m3 volume and liters." },
        relatedCalculators: ["cati-alan-hesaplama", "merdiven-hesaplama", "beton-hesaplama", "hafriyat-hesaplama", "insaat-alani-hesaplama"],
        inputs: [
            numberInput("lengthM", "Uzunluk", "Length", 4, { min: 0, step: 0.01, suffix: "m" }),
            numberInput("widthM", "Genişlik", "Width", 3, { min: 0, step: 0.01, suffix: "m" }),
            numberInput("heightM", "Yükseklik/Derinlik", "Height/Depth", 2.5, { min: 0, step: 0.01, suffix: "m" }),
        ],
        results: [
            numberResult("volumeM3", "Hacim", "Volume", " m³"),
            numberResult("volumeLiter", "Litre Karşılığı", "Volume in Liters", " L"),
            numberResult("surfaceBaseM2", "Taban Alanı", "Base Area", " m²"),
        ],
        formula: (values) => {
            const lengthM = Math.max(0, Number(values.lengthM) || 0);
            const widthM = Math.max(0, Number(values.widthM) || 0);
            const heightM = Math.max(0, Number(values.heightM) || 0);
            const surfaceBaseM2 = lengthM * widthM;
            const volumeM3 = surfaceBaseM2 * heightM;

            return {
                volumeM3,
                volumeLiter: volumeM3 * 1000,
                surfaceBaseM2,
            };
        },
        seo: buildSeo({
            title: "Metreküp Hesaplama (m³ Hacim ve Litre)",
            metaDescription: "Metreküp hesaplama aracıyla uzunluk, genişlik ve yükseklik ölçülerinden hacmi m³ ve litre olarak hızlıca hesaplayın.",
            intro: "Metreküp hesabı, hacim gerektiren beton, hafriyat, depo, oda ve malzeme ölçülerinde kullanılır. Tüm ana ölçüler metre girildiğinde sonuç m³ çıkar.",
            formula: "Hacim(m³) = uzunluk(m) × genişlik(m) × yükseklik(m). Litre karşılığı = m³ × 1000. Taban alanı = uzunluk × genişlik.",
            example: "4 m × 3 m × 2,5 m ölçüsünde hacim 30 m³ olur. Bu değer 30.000 litreye karşılık gelir; taban alanı 12 m²'dir.",
            interpretation: "Sonuç geometrik hacim verir. Malzemenin sıkışma, boşluk oranı, yoğunluk veya fire etkisi gerekiyorsa ilgili özel hesaplayıcılarla birlikte okunmalıdır.",
            caution: "Bu araç dikdörtgen prizma varsayımıyla çalışır. Eğrisel, eğimli veya parçalı hacimler için alanları parçalara bölüp ayrı hesaplamak gerekir.",
            links: geometryLinks,
            faq: [
                ["Metreküp ile metrekare arasındaki fark nedir?", "Metrekare alanı, metreküp hacmi ifade eder. Hacim için üçüncü ölçü olarak yükseklik veya derinlik gerekir."],
                ["Litreye nasıl çevrilir?", "1 m³ = 1000 litre kabul edilir; araç hacmi otomatik litreye çevirir."],
                ["Beton için doğrudan kullanılabilir mi?", "Basit hacim için evet, fakat beton fire ve tonajı için beton hesaplama sayfası daha uygundur."],
                ["Hafriyat için şişme payı dahil mi?", "Hayır. Hafriyat hesabında kazı sonrası kabarma/şişme ayrıca hesaplanmalıdır."],
                ["Ölçüleri cm girersem ne olur?", "Bu araç metre bekler. Santimetre ölçüleri önce metreye çevirmeniz gerekir."],
            ],
        }),
    },
    {
        id: "excavation-calculator",
        slug: "hafriyat-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Hafriyat Hesaplama", en: "Excavation Calculator" },
        h1: { tr: "Hafriyat Hesaplama", en: "Excavation Calculator" },
        description: {
            tr: "Kazı ölçülerinden net hafriyat m³, kabarma payı sonrası gevşek hacim ve kamyon sefer sayısını hesaplayın.",
            en: "Estimate excavation volume, loose volume after swell, and truck trips.",
        },
        shortDescription: { tr: "Kazı m³ ve kamyon hesabı.", en: "Excavation m3 and truck trips." },
        relatedCalculators: ["beton-hesaplama", "cimento-hesaplama", "kum-hesaplama", "demir-hesaplama", "metrekup-hesaplama"],
        inputs: [
            numberInput("lengthM", "Kazı Uzunluğu", "Excavation Length", 15, { min: 0, step: 0.1, suffix: "m" }),
            numberInput("widthM", "Kazı Genişliği", "Excavation Width", 8, { min: 0, step: 0.1, suffix: "m" }),
            numberInput("depthM", "Kazı Derinliği", "Excavation Depth", 1.2, { min: 0, step: 0.05, suffix: "m" }),
            numberInput("swellRate", "Kabarma/Şişme Payı", "Swell Rate", 20, { min: 0, max: 80, step: 1, suffix: "%" }),
            numberInput("truckCapacityM3", "Kamyon Kapasitesi", "Truck Capacity", 10, { min: 1, step: 0.5, suffix: "m³" }),
        ],
        results: [
            numberResult("netVolumeM3", "Net Kazı Hacmi", "Net Excavation Volume", " m³"),
            numberResult("looseVolumeM3", "Kabarma Sonrası Hacim", "Loose Volume", " m³"),
            numberResult("truckTrips", "Yaklaşık Kamyon Seferi", "Approx. Truck Trips", " sefer", 0),
        ],
        formula: (values) => {
            const lengthM = Math.max(0, Number(values.lengthM) || 0);
            const widthM = Math.max(0, Number(values.widthM) || 0);
            const depthM = Math.max(0, Number(values.depthM) || 0);
            const swellRate = Math.max(0, Number(values.swellRate) || 0);
            const truckCapacityM3 = Math.max(1, Number(values.truckCapacityM3) || 10);
            const netVolumeM3 = lengthM * widthM * depthM;
            const looseVolumeM3 = netVolumeM3 * (1 + swellRate / 100);

            return {
                netVolumeM3,
                looseVolumeM3,
                truckTrips: Math.ceil(looseVolumeM3 / truckCapacityM3),
            };
        },
        seo: buildSeo({
            title: "Hafriyat Hesaplama (Kazı m³ ve Kamyon Seferi)",
            metaDescription: "Hafriyat hesaplama aracıyla kazı ölçülerinden net m³ hacmi, kabarma sonrası gevşek hacmi ve kamyon sefer sayısını tahmin edin.",
            intro: "Hafriyat hesabı, kazı alanı ve derinliğinden net zeminde hacmi bulur. Kazı çıkan malzeme gevşediği için kabarma/şişme payı ayrıca eklenir.",
            formula: "Net kazı hacmi = uzunluk × genişlik × derinlik. Gevşek hacim = net hacim × (1 + kabarma/100). Sefer = gevşek hacim / kamyon kapasitesi.",
            example: "15×8 m alanda 1,2 m derinlikte net hacim 144 m³ olur. %20 kabarma ile 172,8 m³ gevşek hacim, 10 m³ kamyonla 18 sefer hesaplanır.",
            interpretation: "Sonuç nakliye ve kazı planı için tahmini m³ verir. Zemin sınıfı, su durumu, şev, iksa, dolgu ve döküm mesafesi maliyeti değiştirebilir.",
            caution: "Kazı güvenliği ve şev/iksa kararları mühendislik değerlendirmesi gerektirir. Bu araç yalnız hacim ve lojistik ön tahmini sağlar.",
            links: materialLinks,
            faq: [
                ["Hafriyatta kabarma payı nedir?", "Kazılan zeminin yerinden çıktıktan sonra gevşeyerek hacminin artmasıdır. Toprak tipine göre oran değişir."],
                ["Kamyon seferi neden yukarı yuvarlanır?", "Eksik sefer pratikte mümkün olmadığı için ihtiyaç en yakın üst tam sefere yuvarlanır."],
                ["Şevli kazı hesaba dahil mi?", "Hayır. Araç dikdörtgen prizma varsayar; şevli kazılar için kesit alanı ayrıca değerlendirilmelidir."],
                ["Döküm sahası maliyeti dahil mi?", "Hayır. Bu sayfa hacim ve sefer tahmini verir; döküm, nakliye ve izin maliyetleri ayrıca hesaplanmalıdır."],
                ["Dolgu hesabı için kullanılabilir mi?", "Geometrik hacim için kullanılabilir, fakat sıkışma ve malzeme yoğunluğu ayrıca dikkate alınmalıdır."],
            ],
        }),
    },
    {
        id: "sand-calculator",
        slug: "kum-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Kum Hesaplama", en: "Sand Calculator" },
        h1: { tr: "Kum Hesaplama", en: "Sand Calculator" },
        description: {
            tr: "m³ kum hacmine göre fire dahil kum miktarını m³ ve ton olarak hesaplayın.",
            en: "Estimate sand quantity in cubic meters and tons including waste.",
        },
        shortDescription: { tr: "Kum m³ ve ton hesabı.", en: "Sand m3 and ton estimate." },
        relatedCalculators: ["beton-hesaplama", "cimento-hesaplama", "demir-hesaplama", "hafriyat-hesaplama", "siva-hesaplama"],
        inputs: [
            numberInput("volumeM3", "Net Kum Hacmi", "Net Sand Volume", 4, { min: 0, step: 0.1, suffix: "m³" }),
            numberInput("densityTonM3", "Kum Yoğunluğu", "Sand Density", 1.6, { min: 0.1, step: 0.05, suffix: "ton/m³" }),
            numberInput("wasteRate", "Fire/Nem Payı", "Waste/Moisture Allowance", 8, { min: 0, max: 40, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("totalVolumeM3", "Fire Dahil Kum", "Sand Including Waste", " m³"),
            numberResult("sandTon", "Yaklaşık Tonaj", "Approx. Tons", " ton"),
        ],
        formula: (values) => {
            const volumeM3 = Math.max(0, Number(values.volumeM3) || 0);
            const densityTonM3 = Math.max(0.1, Number(values.densityTonM3) || 1.6);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const totalVolumeM3 = volumeM3 * (1 + wasteRate / 100);

            return {
                totalVolumeM3,
                sandTon: totalVolumeM3 * densityTonM3,
            };
        },
        seo: buildSeo({
            title: "Kum Hesaplama (m³ ve Ton)",
            metaDescription: "Kum hesaplama aracıyla ihtiyaç duyulan kum hacmini fire dahil m³ ve yaklaşık ton olarak hesaplayın.",
            intro: "Kum hesabı, istenen net m³ hacmine fire veya nem payı ekler ve yoğunluk katsayısıyla ton karşılığını bulur. Sonuç hem hacim hem ağırlık olarak gösterilir.",
            formula: "Fire dahil kum(m³) = net hacim × (1 + fire/100). Kum tonajı = fire dahil m³ × yoğunluk(ton/m³). Varsayılan yoğunluk 1,6 ton/m³'tür.",
            example: "4 m³ kum için %8 pay eklendiğinde 4,32 m³ gerekir. 1,6 ton/m³ yoğunlukla yaklaşık 6,91 ton hesaplanır.",
            interpretation: "Sonuç harç, şap, dolgu veya peyzaj kumu için satın alma ön tahmini verir. Kumun yıkanmış, kırma, dere veya dolgu kumu olması yoğunluğu değiştirebilir.",
            caution: "Nem oranı ve granülometri tonajı etkiler. Tedarikçi kantar veya m³ ölçüsüyle verdiği için sipariş birimi ayrıca doğrulanmalıdır.",
            links: materialLinks,
            faq: [
                ["1 m³ kum kaç ton gelir?", "Kum tipine ve nemine göre değişir; ön keşifte 1,5-1,7 ton/m³ aralığı sık kullanılır."],
                ["Kum hesabında nem payı neden var?", "Nemli kum daha ağır olabilir ve hacim/ağırlık ilişkisini değiştirir. Araç bunu fire/nem payıyla yaklaştırır."],
                ["Harç kumu ile dolgu kumu aynı mı?", "Hayır. Kullanım yeri, dane boyutu ve temizlik seviyesi farklıdır; doğru malzeme seçilmelidir."],
                ["Ton mu m³ mü sipariş vermeliyim?", "Bu tedarikçiye bağlıdır. Araç iki birimi de göstererek teklifleri karşılaştırmayı kolaylaştırır."],
                ["Beton için kum hesabı yeterli mi?", "Beton karışımı agrega, çimento, su ve katkı dengesine bağlıdır; yalnız kum hesabı beton reçetesi değildir."],
            ],
        }),
    },
    {
        id: "gypsum-calculator",
        slug: "alci-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Alçı Hesaplama", en: "Gypsum Plaster Calculator" },
        h1: { tr: "Alçı Hesaplama", en: "Gypsum Plaster Calculator" },
        description: {
            tr: "Duvar veya tavan alanına göre kg alçı ve torba sayısını fire dahil hesaplayın.",
            en: "Estimate gypsum plaster kilograms and bag count from wall or ceiling area including waste.",
        },
        shortDescription: { tr: "Alçı kg ve torba hesabı.", en: "Gypsum kg and bag count." },
        relatedCalculators: ["siva-hesaplama", "boya-hesaplama", "tugla-hesaplama", "cimento-hesaplama", "insaat-alani-hesaplama"],
        inputs: [
            numberInput("areaM2", "Uygulama Alanı", "Application Area", 60, { min: 0, step: 0.1, suffix: "m²" }),
            numberInput("kgPerM2", "m² Başına Sarfiyat", "Consumption per m2", 8.5, { min: 0.1, step: 0.1, suffix: "kg/m²" }),
            numberInput("bagKg", "Torba Ağırlığı", "Bag Weight", 25, { min: 1, step: 1, suffix: "kg" }),
            numberInput("wasteRate", "Fire Payı", "Waste Allowance", 7, { min: 0, max: 30, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("netGypsumKg", "Net Alçı", "Net Gypsum", " kg"),
            numberResult("totalGypsumKg", "Fire Dahil Alçı", "Gypsum Including Waste", " kg"),
            numberResult("bagCount", "Gerekli Torba", "Required Bags", " torba", 0),
        ],
        formula: (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const kgPerM2 = Math.max(0.1, Number(values.kgPerM2) || 8.5);
            const bagKg = Math.max(1, Number(values.bagKg) || 25);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netGypsumKg = areaM2 * kgPerM2;
            const totalGypsumKg = netGypsumKg * (1 + wasteRate / 100);

            return {
                netGypsumKg,
                totalGypsumKg,
                bagCount: Math.ceil(totalGypsumKg / bagKg),
            };
        },
        seo: buildSeo({
            title: "Alçı Hesaplama (Kg ve Torba)",
            metaDescription: "Alçı hesaplama aracıyla duvar veya tavan m² alanı, sarfiyat ve fire oranına göre kg alçı ve torba sayısını hesaplayın.",
            intro: "Alçı hesabı, uygulama alanını m² başına sarfiyatla çarpar. Torba ağırlığı ve fire payı eklenerek satın alma torba sayısı bulunur.",
            formula: "Net alçı kg = alan(m²) × kg/m² sarfiyat. Fire dahil kg = net kg × (1 + fire/100). Torba sayısı = fire dahil kg / torba kg.",
            example: "60 m² alanda 8,5 kg/m² sarfiyat için net 510 kg gerekir. %7 fireyle 545,7 kg, 25 kg torbayla 22 torba hesaplanır.",
            interpretation: "Sonuç sıva üstü alçı, saten alçı veya kaba alçı ön keşfinde kullanılabilir. Ürün tipi ve kat kalınlığı sarfiyatı doğrudan etkiler.",
            caution: "Alçı uygulaması yüzey düzgünlüğü, nem, astar ve kalınlıkla değişir. Üretici teknik föyü ve uygulamacı ölçüsü nihai satın almada esas alınmalıdır.",
            links: finishLinks,
            faq: [
                ["Alçı sarfiyatını nereden bulurum?", "Kullanılacak ürünün teknik föyünde kg/m² sarfiyat değeri yazar; kalınlığa göre değişebilir."],
                ["Saten alçı ve kaba alçı aynı sarfiyat mı?", "Hayır. Ürün tipi ve uygulama kalınlığı farklı olduğu için sarfiyat ayrı girilmelidir."],
                ["Torba sayısı neden tam sayıya yuvarlanır?", "Malzeme torba ile alındığından eksik kalmamak için sonuç üst tam torbaya yuvarlanır."],
                ["Tavan alçısı için kullanılabilir mi?", "Evet. Tavan m² alanını uygulama alanına ekleyerek hesap yapabilirsiniz."],
                ["Fire payı ne kadar alınmalı?", "Yüzey durumuna göre %5-10 arası ön pay pratik olabilir; bozuk yüzeyde daha yüksek gerekebilir."],
            ],
        }),
    },
    {
        id: "plaster-calculator",
        slug: "siva-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Sıva Hesaplama", en: "Plaster Calculator" },
        h1: { tr: "Sıva Hesaplama", en: "Plaster Calculator" },
        description: {
            tr: "Duvar alanı, sıva kalınlığı ve yoğunluğa göre m³ harç, kg ve ton sıva ihtiyacını hesaplayın.",
            en: "Estimate plaster mortar volume, kilograms, and tons from wall area, thickness, and density.",
        },
        shortDescription: { tr: "Sıva m³, kg ve ton hesabı.", en: "Plaster m3, kg and tons." },
        relatedCalculators: ["alci-hesaplama", "cimento-hesaplama", "kum-hesaplama", "tugla-hesaplama", "boya-hesaplama"],
        inputs: [
            numberInput("areaM2", "Sıva Alanı", "Plaster Area", 80, { min: 0, step: 0.1, suffix: "m²" }),
            numberInput("thicknessCm", "Ortalama Kalınlık", "Average Thickness", 2, { min: 0.1, step: 0.1, suffix: "cm" }),
            numberInput("densityKgM3", "Harç Yoğunluğu", "Mortar Density", 1600, { min: 100, step: 10, suffix: "kg/m³" }),
            numberInput("wasteRate", "Fire Payı", "Waste Allowance", 10, { min: 0, max: 40, step: 0.5, suffix: "%" }),
        ],
        results: [
            numberResult("mortarVolumeM3", "Net Harç Hacmi", "Net Mortar Volume", " m³"),
            numberResult("totalVolumeM3", "Fire Dahil Hacim", "Volume Including Waste", " m³"),
            numberResult("plasterKg", "Yaklaşık Ağırlık", "Approx. Weight", " kg"),
            numberResult("plasterTon", "Yaklaşık Tonaj", "Approx. Tons", " ton"),
        ],
        formula: (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const thicknessM = Math.max(0, Number(values.thicknessCm) || 0) / 100;
            const densityKgM3 = Math.max(100, Number(values.densityKgM3) || 1600);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const mortarVolumeM3 = areaM2 * thicknessM;
            const totalVolumeM3 = mortarVolumeM3 * (1 + wasteRate / 100);
            const plasterKg = totalVolumeM3 * densityKgM3;

            return {
                mortarVolumeM3,
                totalVolumeM3,
                plasterKg,
                plasterTon: plasterKg / 1000,
            };
        },
        seo: buildSeo({
            title: "Sıva Hesaplama (m², m³ ve Ton)",
            metaDescription: "Sıva hesaplama aracıyla duvar alanı ve kalınlığa göre m³ harç hacmini, kg/ton malzeme ihtiyacını ve fire payını hesaplayın.",
            intro: "Sıva hesabı, sıva yapılacak alanı ortalama kalınlıkla çarpar ve harç hacmini bulur. Yoğunluk girildiğinde yaklaşık kg ve ton değeri de hesaplanır.",
            formula: "Net harç hacmi = alan(m²) × kalınlık(m). Fire dahil hacim = net hacim × (1 + fire/100). Ağırlık = fire dahil hacim × yoğunluk.",
            example: "80 m² alanda 2 cm sıva için net 1,60 m³ harç gerekir. %10 fire ve 1600 kg/m³ yoğunlukla yaklaşık 2.816 kg, yani 2,82 ton görünür.",
            interpretation: "Sonuç kaba veya ince sıva malzemesi için tahmini keşiftir. Duvar bozukluğu, mastar kalınlığı ve uygulama katmanı gerçek miktarı değiştirebilir.",
            caution: "Hazır sıva, çimento-kum harcı veya kireçli karışım farklı sarfiyat verir. Teknik föy ve yerel usta uygulamasıyla doğrulama yapılmalıdır.",
            links: finishLinks,
            faq: [
                ["Sıva kalınlığı cm mi giriliyor?", "Evet. Araç santimetreyi metreye çevirerek m³ hacim hesabı yapar."],
                ["Hazır sıva için kullanılabilir mi?", "Evet, fakat yoğunluk ve sarfiyat değerleri ürün teknik föyünden alınmalıdır."],
                ["Duvar bozukluğu sonucu etkiler mi?", "Evet. Dalgalı yüzeylerde ortalama kalınlık artar ve malzeme ihtiyacı yükselir."],
                ["Sıva kg hesabı kesin midir?", "Yoğunluk varsayımına bağlı yaklaşık değerdir; nem ve karışım oranı gerçek ağırlığı değiştirir."],
                ["İç ve dış sıva aynı mı hesaplanır?", "Temel hacim mantığı aynıdır; ancak malzeme türü, kalınlık ve fire payı farklı olabilir."],
            ],
        }),
    },
    {
        id: "electric-cable-calculator",
        slug: "elektrik-kablo-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Elektrik Kablo Hesaplama", en: "Electrical Cable Calculator" },
        h1: { tr: "Elektrik Kablo Hesaplama", en: "Electrical Cable Calculator" },
        description: {
            tr: "Hat uzunluğu, devre sayısı ve damar sayısına göre yaklaşık elektrik kablo metre ve 100 m makara ihtiyacını hesaplayın.",
            en: "Estimate electrical cable meters and 100 m reels from line length, circuit count, and conductor count.",
        },
        shortDescription: { tr: "Kablo metre ve makara hesabı.", en: "Cable meter and reel estimate." },
        relatedCalculators: ["su-tesisat-hesaplama", "isi-kaybi-hesaplama", "gunes-paneli-hesaplama", "klima-btu-hesaplama", "jenerator-guc-hesaplama"],
        inputs: [
            numberInput("lineLengthM", "Ortalama Hat Uzunluğu", "Average Line Length", 18, { min: 0, step: 0.5, suffix: "m" }),
            numberInput("circuitCount", "Devre/Hat Sayısı", "Circuit Count", 8, { min: 0, step: 1, suffix: "adet" }),
            numberInput("conductorCount", "Damar Sayısı", "Conductor Count", 3, { min: 1, step: 1, suffix: "damar" }),
            numberInput("slackRate", "Pay ve Fire", "Slack/Waste", 15, { min: 0, max: 60, step: 1, suffix: "%" }),
        ],
        results: [
            numberResult("netCableM", "Net Kablo Uzunluğu", "Net Cable Length", " m"),
            numberResult("totalCableM", "Pay Dahil Kablo", "Cable Including Slack", " m"),
            numberResult("roll100M", "100 m Makara", "100 m Reels", " makara", 0),
            textResult("projectNote", "Uygulama Notu", "Project Note"),
        ],
        formula: (values) => {
            const lineLengthM = Math.max(0, Number(values.lineLengthM) || 0);
            const circuitCount = Math.max(0, Number(values.circuitCount) || 0);
            const conductorCount = Math.max(1, Number(values.conductorCount) || 1);
            const slackRate = Math.max(0, Number(values.slackRate) || 0);
            const netCableM = lineLengthM * circuitCount * conductorCount;
            const totalCableM = netCableM * (1 + slackRate / 100);

            return {
                netCableM,
                totalCableM,
                roll100M: Math.ceil(totalCableM / 100),
                projectNote: "Kesit, sigorta ve gerilim düşümü ayrıca projeyle kontrol edilmeli",
            };
        },
        seo: buildSeo({
            title: "Elektrik Kablo Hesaplama (Metre ve Makara)",
            metaDescription: "Elektrik kablo hesaplama aracıyla hat uzunluğu, devre sayısı, damar sayısı ve fire payına göre yaklaşık kablo metre ve makara ihtiyacını hesaplayın.",
            intro: "Elektrik kablo hesabı, ortalama hat uzunluğu ile devre ve damar sayısını çarpar. Pano içi pay, dönüşler ve fire için ek yüzde uygulanır.",
            formula: "Net kablo = hat uzunluğu × devre sayısı × damar sayısı. Pay dahil kablo = net metre × (1 + fire/100). 100 m makara sayısı yukarı yuvarlanır.",
            example: "18 m ortalama hat, 8 devre ve 3 damar için net 432 m kablo gerekir. %15 payla 496,8 m, yani 5 adet 100 m makara hesaplanır.",
            interpretation: "Sonuç tesisat malzemesi ön keşfi içindir. Kablo kesiti, boru doluluk oranı, sigorta seçimi ve gerilim düşümü ayrıca tasarlanmalıdır.",
            caution: "Elektrik tesisatı güvenlik ve yönetmelik konusudur. Bu araç proje onayı vermez; yetkili elektrik mühendisi/ustası ve yerel standartlarla kontrol gerekir.",
            links: systemsLinks,
            faq: [
                ["Damar sayısı ne anlama gelir?", "Bir hat içindeki iletken sayısını ifade eder. Faz, nötr ve toprak gibi iletkenler toplamıdır."],
                ["Kablo kesiti bu araçla seçilir mi?", "Hayır. Kesit seçimi akım, gerilim düşümü, koruma ve yönetmelik hesabı gerektirir."],
                ["Fire payı neden yüksek olabilir?", "Pano bağlantıları, dönüşler, rezerv payı ve yanlış kesimlerden dolayı kablo metrajı artabilir."],
                ["100 m makara sayısı kesin satın alma mı?", "Paketleme tedarikçiye göre değişebilir; araç yalnız 100 m makara varsayımıyla ön tahmin verir."],
                ["Aydınlatma ve priz hatları ayrı mı hesaplanmalı?", "Daha doğru sonuç için farklı devre grupları ayrı ayrı hesaplanmalı ve sonra toplanmalıdır."],
            ],
        }),
    },
    {
        id: "plumbing-calculator",
        slug: "su-tesisat-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Su Tesisat Hesaplama", en: "Plumbing Calculator" },
        h1: { tr: "Su Tesisat Hesaplama", en: "Plumbing Calculator" },
        description: {
            tr: "Islak hacim, ortalama boru uzunluğu ve armatür sayısına göre yaklaşık boru metre ve fitting adedi hesaplayın.",
            en: "Estimate pipe length and fitting count from wet areas, average pipe length, and fixtures.",
        },
        shortDescription: { tr: "Boru metre ve fitting hesabı.", en: "Pipe meters and fittings." },
        relatedCalculators: ["elektrik-kablo-hesaplama", "isi-kaybi-hesaplama", "gunes-paneli-hesaplama", "klima-btu-hesaplama", "enerji-tuketim-hesaplama"],
        inputs: [
            numberInput("wetAreaCount", "Islak Hacim Sayısı", "Wet Area Count", 2, { min: 0, step: 1, suffix: "adet" }),
            numberInput("averagePipeM", "Islak Hacim Başına Boru", "Pipe per Wet Area", 14, { min: 0, step: 0.5, suffix: "m" }),
            numberInput("fixtureCount", "Armatür/Cihaz Noktası", "Fixture Points", 8, { min: 0, step: 1, suffix: "adet" }),
            numberInput("fittingPerFixture", "Nokta Başına Fitting", "Fittings per Point", 4, { min: 0, step: 1, suffix: "adet" }),
            numberInput("wasteRate", "Pay ve Fire", "Slack/Waste", 12, { min: 0, max: 50, step: 1, suffix: "%" }),
        ],
        results: [
            numberResult("netPipeM", "Net Boru", "Net Pipe", " m"),
            numberResult("totalPipeM", "Pay Dahil Boru", "Pipe Including Slack", " m"),
            numberResult("fittingCount", "Yaklaşık Fitting", "Approx. Fittings", " adet", 0),
            numberResult("valveCount", "Yaklaşık Vana", "Approx. Valves", " adet", 0),
        ],
        formula: (values) => {
            const wetAreaCount = Math.max(0, Number(values.wetAreaCount) || 0);
            const averagePipeM = Math.max(0, Number(values.averagePipeM) || 0);
            const fixtureCount = Math.max(0, Number(values.fixtureCount) || 0);
            const fittingPerFixture = Math.max(0, Number(values.fittingPerFixture) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netPipeM = wetAreaCount * averagePipeM;

            return {
                netPipeM,
                totalPipeM: netPipeM * (1 + wasteRate / 100),
                fittingCount: Math.ceil(fixtureCount * fittingPerFixture * (1 + wasteRate / 100)),
                valveCount: Math.ceil(wetAreaCount * 2 + fixtureCount * 0.25),
            };
        },
        seo: buildSeo({
            title: "Su Tesisat Hesaplama (Boru Metre ve Fitting)",
            metaDescription: "Su tesisat hesaplama aracıyla ıslak hacim, boru uzunluğu ve armatür sayısına göre yaklaşık boru metre, fitting ve vana ihtiyacını hesaplayın.",
            intro: "Su tesisat hesabı, ıslak hacim başına ortalama boru uzunluğunu ve armatür noktası başına fitting sayısını kullanarak malzeme ön listesi üretir.",
            formula: "Net boru = ıslak hacim sayısı × hacim başına boru metre. Pay dahil boru = net metre × (1 + fire/100). Fitting = armatür noktası × nokta başına fitting.",
            example: "2 ıslak hacim, hacim başına 14 m boru ve 8 armatür noktası için net 28 m boru çıkar. %12 payla 31,36 m; fitting yaklaşık 36 adet hesaplanır.",
            interpretation: "Sonuç konut tadilatı veya küçük proje ön keşfi için malzeme tahmini verir. Pis su, temiz su, sıcak su dönüşü ve cihaz bağlantıları ayrı değerlendirilmelidir.",
            caution: "Tesisat çapı, basınç, kolektör sistemi, eğim ve su yalıtımı profesyonel uygulama gerektirir. Bu sayfa kesin proje metrajı değildir.",
            links: systemsLinks,
            faq: [
                ["Islak hacim ne demek?", "Banyo, WC, mutfak, çamaşır odası gibi su tesisatı bulunan hacimleri ifade eder."],
                ["Pis su tesisatı dahil mi?", "Araç genel ön keşif verir; temiz su ve pis su hatlarını ayrı hesaplamak daha doğru olur."],
                ["Boru çapı seçimi yapılır mı?", "Hayır. Boru çapı debi, basınç ve tesisat projesine göre belirlenmelidir."],
                ["Fitting sayısı neden tahmini?", "Dirsek, te, nipel, vana ve bağlantı parçaları yerleşim planına göre değiştiği için adet yaklaşık hesaplanır."],
                ["Kolektörlü sistemde sonuç değişir mi?", "Evet. Kolektörlü sistemlerde hat sayısı ve boru metrajı farklılaşabilir; ortalama boru metre buna göre güncellenmelidir."],
            ],
        }),
    },
    {
        id: "heat-loss-calculator",
        slug: "isi-kaybi-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Isı Kaybı Hesaplama", en: "Heat Loss Calculator" },
        h1: { tr: "Isı Kaybı Hesaplama", en: "Heat Loss Calculator" },
        description: {
            tr: "Alan, tavan yüksekliği, iklim ve yalıtım durumuna göre yaklaşık ısı kaybı W/kW ve cihaz kapasitesi tahmini yapın.",
            en: "Estimate heat loss in W/kW and rough heating capacity from area, ceiling height, climate, and insulation.",
        },
        shortDescription: { tr: "Yaklaşık W/kW ısı kaybı.", en: "Approximate W/kW heat loss." },
        relatedCalculators: ["klima-btu-hesaplama", "gunes-paneli-hesaplama", "enerji-tuketim-hesaplama", "elektrik-kablo-hesaplama", "su-tesisat-hesaplama"],
        inputs: [
            numberInput("areaM2", "Isıtılacak Alan", "Heated Area", 100, { min: 0, step: 1, suffix: "m²" }),
            numberInput("ceilingHeightM", "Tavan Yüksekliği", "Ceiling Height", 2.7, { min: 1, step: 0.1, suffix: "m" }),
            selectInput("insulationLevel", "Yalıtım Durumu", "Insulation Level", "medium", [
                { label: { tr: "Zayıf", en: "Weak" }, value: "weak" },
                { label: { tr: "Orta", en: "Medium" }, value: "medium" },
                { label: { tr: "İyi", en: "Good" }, value: "good" },
            ]),
            selectInput("climateLevel", "İklim Bölgesi", "Climate", "normal", [
                { label: { tr: "Ilıman", en: "Mild" }, value: "mild" },
                { label: { tr: "Normal", en: "Normal" }, value: "normal" },
                { label: { tr: "Soğuk", en: "Cold" }, value: "cold" },
            ]),
            numberInput("windowShare", "Pencere Etkisi", "Window Share", 20, { min: 0, max: 80, step: 1, suffix: "%" }),
        ],
        results: [
            numberResult("volumeM3", "Hacim", "Volume", " m³"),
            numberResult("heatLossW", "Yaklaşık Isı Kaybı", "Approx. Heat Loss", " W"),
            numberResult("heatLossKw", "Yaklaşık Isı Kaybı", "Approx. Heat Loss", " kW"),
            numberResult("recommendedCapacityKw", "Önerilen Cihaz Kapasitesi", "Suggested Capacity", " kW"),
        ],
        formula: (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const ceilingHeightM = Math.max(1, Number(values.ceilingHeightM) || 2.7);
            const insulationMultipliers: Record<string, number> = { weak: 1.25, medium: 1, good: 0.8 };
            const climateMultipliers: Record<string, number> = { mild: 0.85, normal: 1, cold: 1.25 };
            const insulationMultiplier = insulationMultipliers[String(values.insulationLevel)] ?? 1;
            const climateMultiplier = climateMultipliers[String(values.climateLevel)] ?? 1;
            const windowShare = Math.max(0, Number(values.windowShare) || 0);
            const volumeM3 = areaM2 * ceilingHeightM;
            const heatLossW = volumeM3 * 45 * insulationMultiplier * climateMultiplier * (1 + windowShare / 250);

            return {
                volumeM3,
                heatLossW,
                heatLossKw: heatLossW / 1000,
                recommendedCapacityKw: (heatLossW / 1000) * 1.15,
            };
        },
        seo: buildSeo({
            title: "Isı Kaybı Hesaplama (W, kW ve Kapasite Tahmini)",
            metaDescription: "Isı kaybı hesaplama aracıyla alan, tavan yüksekliği, yalıtım ve iklim bilgilerine göre yaklaşık W/kW ısı kaybı ve cihaz kapasitesi tahmini yapın.",
            intro: "Isı kaybı hesabı, hacim üzerinden yaklaşık W ihtiyacını tahmin eder; yalıtım, iklim ve pencere etkisiyle sonucu düzeltir. Bu sayfa ön kapasite seçimi için kullanılır.",
            formula: "Hacim = alan × tavan yüksekliği. Yaklaşık ısı kaybı = hacim × 45 W/m³ × yalıtım katsayısı × iklim katsayısı × pencere etkisi. Önerilen kapasiteye %15 güven payı eklenir.",
            example: "100 m² alan, 2,7 m tavan, orta yalıtım, normal iklim ve %20 pencere etkisinde hacim 270 m³ olur. Isı kaybı yaklaşık 13,12 kW, önerilen kapasite 15,09 kW görünür.",
            interpretation: "Sonuç radyatör, kombi veya ısı pompası ön seçimi için hızlı tahmindir. Cephe yönü, U değeri, sızdırmazlık, kat konumu ve iç/dış sıcaklık farkı sonucu değiştirebilir.",
            caution: "Kesin ısı kaybı hesabı TS/EN standartlarına göre detaylı yapı kabuğu analizi ister. Bu araç mühendislik projesi veya cihaz seçim garantisi vermez.",
            links: systemsLinks,
            faq: [
                ["Isı kaybı hesabı kesin cihaz seçimi sağlar mı?", "Hayır. Bu araç ön tahmin verir; kesin kapasite için proje ve yerinde keşif gerekir."],
                ["Yalıtım seviyesi sonucu nasıl etkiler?", "İyi yalıtım katsayıyı düşürür ve ihtiyaç kW değerini azaltır; zayıf yalıtım ihtiyacı artırır."],
                ["Pencere oranı neden önemli?", "Pencereler ve cam yüzeyler ısı kaybını artırabilir. Özellikle eski doğramalarda etki belirgin olur."],
                ["Klima BTU hesabıyla ilişkisi nedir?", "Isıtma/soğutma kapasite mantığı benzerdir; klima seçimi için BTU sayfası da kontrol edilmelidir."],
                ["Soğuk iklimde güven payı gerekir mi?", "Genellikle evet. Ancak güven payı çok büyütülürse cihaz kısa çevrim yapabilir; profesyonel denge gerekir."],
            ],
        }),
    },
    {
        id: "solar-panel-calculator",
        slug: "gunes-paneli-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Güneş Paneli Hesaplama", en: "Solar Panel Calculator" },
        h1: { tr: "Güneş Paneli Hesaplama", en: "Solar Panel Calculator" },
        description: {
            tr: "Aylık kWh tüketimi, güneşlenme süresi ve panel watt değerine göre gerekli sistem kW ve panel adedini hesaplayın.",
            en: "Estimate required solar system kW and panel count from monthly kWh, sun hours, and panel wattage.",
        },
        shortDescription: { tr: "Panel adedi ve kW sistem hesabı.", en: "Panel count and system kW." },
        relatedCalculators: ["enerji-tuketim-hesaplama", "elektrik-kablo-hesaplama", "isi-kaybi-hesaplama", "klima-btu-hesaplama", "jenerator-guc-hesaplama"],
        inputs: [
            numberInput("monthlyKwh", "Aylık Tüketim", "Monthly Consumption", 450, { min: 0, step: 1, suffix: "kWh" }),
            numberInput("sunHour", "Günlük Etkin Güneş", "Daily Peak Sun Hours", 4.5, { min: 0.1, step: 0.1, suffix: "saat" }),
            numberInput("panelWatt", "Panel Gücü", "Panel Wattage", 550, { min: 1, step: 10, suffix: "W" }),
            numberInput("systemLossRate", "Sistem Kaybı", "System Loss", 20, { min: 0, max: 60, step: 1, suffix: "%" }),
        ],
        results: [
            numberResult("dailyNeedKwh", "Günlük Enerji İhtiyacı", "Daily Energy Need", " kWh"),
            numberResult("requiredSystemKw", "Gerekli Sistem Gücü", "Required System Power", " kW"),
            numberResult("panelCount", "Yaklaşık Panel Adedi", "Approx. Panel Count", " adet", 0),
            numberResult("estimatedAreaM2", "Yaklaşık Panel Alanı", "Approx. Panel Area", " m²"),
        ],
        formula: (values) => {
            const monthlyKwh = Math.max(0, Number(values.monthlyKwh) || 0);
            const sunHour = Math.max(0.1, Number(values.sunHour) || 4.5);
            const panelWatt = Math.max(1, Number(values.panelWatt) || 550);
            const systemLossRate = Math.min(95, Math.max(0, Number(values.systemLossRate) || 0));
            const dailyNeedKwh = monthlyKwh / 30;
            const requiredSystemKw = dailyNeedKwh / sunHour / (1 - systemLossRate / 100);
            const panelCount = Math.ceil((requiredSystemKw * 1000) / panelWatt);

            return {
                dailyNeedKwh,
                requiredSystemKw,
                panelCount,
                estimatedAreaM2: panelCount * 2.4,
            };
        },
        seo: buildSeo({
            title: "Güneş Paneli Hesaplama (kW Sistem ve Panel Adedi)",
            metaDescription: "Güneş paneli hesaplama aracıyla aylık kWh tüketim, güneşlenme süresi ve panel watt değerine göre gerekli kW sistem ve panel adedini hesaplayın.",
            intro: "Güneş paneli hesabı, aylık elektrik tüketimini günlük kWh ihtiyacına çevirir; etkin güneşlenme saati ve sistem kayıplarıyla gerekli kW gücü bulur.",
            formula: "Günlük ihtiyaç = aylık kWh / 30. Sistem kW = günlük ihtiyaç / etkin güneş saati / (1 - kayıp oranı). Panel adedi = sistem W / panel W.",
            example: "450 kWh aylık tüketim, 4,5 saat güneş, 550 W panel ve %20 sistem kaybında günlük ihtiyaç 15 kWh olur. Sistem gücü 4,17 kW, panel adedi 8 çıkar.",
            interpretation: "Sonuç çatı GES ön fizibilitesi için tahmini panel sayısı verir. Çatı yönü, gölge, invertör seçimi, mevzuat ve mahsuplaşma gerçek verimi etkiler.",
            caution: "Bu araç yatırım getirisi veya proje onayı vermez. Yerel güneş radyasyonu, çatı statik uygunluğu, dağıtım şirketi süreci ve elektrik fiyatı ayrıca incelenmelidir.",
            links: systemsLinks,
            faq: [
                ["Etkin güneş saati nedir?", "Panelin nominal gücüne yakın üretim yaptığı eşdeğer günlük saat değeridir; bölgeye ve mevsime göre değişir."],
                ["Sistem kaybı neleri içerir?", "İnvertör kaybı, kablo kaybı, sıcaklık etkisi, kirlenme ve gölge gibi verim düşüşlerini temsil eder."],
                ["Panel alanı kesin mi?", "Hayır. Panel boyutu marka ve güce göre değişir; araç panel başına yaklaşık 2,4 m² varsayar."],
                ["Akülü sistem hesabı dahil mi?", "Hayır. Akü kapasitesi tüketim profili ve yedekleme süresine göre ayrıca hesaplanmalıdır."],
                ["Aylık faturadan kWh nasıl bulunur?", "Elektrik faturasında tüketim kWh olarak yazar; TL tutarı değil kWh değerini kullanmanız gerekir."],
            ],
        }),
    },
    {
        id: "generator-power-calculator",
        slug: "jenerator-guc-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Jeneratör Güç Hesaplama", en: "Generator Power Calculator" },
        h1: { tr: "Jeneratör Güç Hesaplama", en: "Generator Power Calculator" },
        description: {
            tr: "Çalışan yük, motor kalkış yükü, güç faktörü ve güven payına göre gerekli jeneratör kW/kVA kapasitesini hesaplayın.",
            en: "Estimate required generator kW/kVA capacity from running load, motor starting load, power factor, and safety margin.",
        },
        shortDescription: { tr: "Jeneratör kW ve kVA kapasitesi.", en: "Generator kW and kVA capacity." },
        relatedCalculators: ["enerji-tuketim-hesaplama", "gunes-paneli-hesaplama", "elektrik-kablo-hesaplama", "klima-btu-hesaplama", "isi-kaybi-hesaplama"],
        inputs: [
            numberInput("runningPowerKw", "Sürekli Çalışan Yük", "Running Load", 8, { min: 0, step: 0.1, suffix: "kW" }),
            numberInput("motorStartPowerKw", "Motor Kalkış Ek Yükü", "Motor Starting Load", 3, { min: 0, step: 0.1, suffix: "kW" }),
            numberInput("powerFactor", "Güç Faktörü", "Power Factor", 0.8, { min: 0.1, max: 1, step: 0.01 }),
            numberInput("safetyRate", "Güven Payı", "Safety Margin", 25, { min: 0, max: 80, step: 1, suffix: "%" }),
        ],
        results: [
            numberResult("requiredKw", "Gerekli Aktif Güç", "Required Active Power", " kW"),
            numberResult("requiredKva", "Gerekli Jeneratör Gücü", "Required Generator Power", " kVA"),
            numberResult("suggestedKva", "Pratik Üst Kapasite", "Practical Upper Size", " kVA"),
        ],
        formula: (values) => {
            const runningPowerKw = Math.max(0, Number(values.runningPowerKw) || 0);
            const motorStartPowerKw = Math.max(0, Number(values.motorStartPowerKw) || 0);
            const powerFactor = Math.min(1, Math.max(0.1, Number(values.powerFactor) || 0.8));
            const safetyRate = Math.max(0, Number(values.safetyRate) || 0);
            const requiredKw = (runningPowerKw + motorStartPowerKw) * (1 + safetyRate / 100);
            const requiredKva = requiredKw / powerFactor;

            return {
                requiredKw,
                requiredKva,
                suggestedKva: Math.ceil(requiredKva / 5) * 5,
            };
        },
        seo: buildSeo({
            title: "Jeneratör Güç Hesaplama (kW ve kVA)",
            metaDescription: "Jeneratör güç hesaplama aracıyla çalışan yük, kalkış yükü, güç faktörü ve güven payına göre gerekli kW/kVA kapasitesini hesaplayın.",
            intro: "Jeneratör hesabı, sürekli çalışan yükleri ve motor kalkış etkisini toplar; güven payı ve güç faktörüyle kVA kapasitesine çevirir.",
            formula: "Gerekli kW = (sürekli yük + kalkış ek yükü) × (1 + güven payı/100). Gerekli kVA = gerekli kW / güç faktörü.",
            example: "8 kW sürekli yük, 3 kW kalkış ek yükü, %25 güven payı ve 0,80 güç faktörü için gerekli güç 13,75 kW; jeneratör kapasitesi 17,19 kVA olur.",
            interpretation: "Sonuç küçük işletme, şantiye veya ev yedek güç planı için ilk kapasite tahminidir. Motorlu yüklerin kalkış akımı ve eşzamanlı çalışma profili sonucu büyütebilir.",
            caution: "Jeneratör seçimi yakıt, faz sayısı, harmonik, UPS, otomatik transfer ve yük karakteristiği gibi mühendislik detayları ister. Nihai seçim yetkili teknik ekipçe yapılmalıdır.",
            links: systemsLinks,
            faq: [
                ["kW ile kVA farkı nedir?", "kW aktif gücü, kVA görünür gücü ifade eder. Güç faktörü nedeniyle kVA genellikle kW değerinden büyüktür."],
                ["Motor kalkış yükü neden eklenir?", "Pompa, kompresör ve motorlar ilk kalkışta normal çalışmadan daha yüksek güç isteyebilir."],
                ["Güven payı kaç olmalı?", "Yük karakterine göre değişir; ön keşifte %15-30 arası kullanılabilir ancak profesyonel analiz gerekir."],
                ["Tek faz/üç faz seçimi dahil mi?", "Hayır. Faz yapısı ve dağıtım panosu ayrıca projelendirilmelidir."],
                ["Önerilen üst kapasite neden yuvarlanıyor?", "Piyasadaki jeneratör sınıfları genellikle belirli kVA aralıklarıyla satıldığı için pratik üst kapasite gösterilir."],
            ],
        }),
    },
    {
        id: "construction-energy-consumption-calculator",
        slug: "enerji-tuketim-hesaplama",
        category: "insaat-muhendislik",
        updatedAt: "2026-05-02",
        name: { tr: "Enerji Tüketim Hesaplama", en: "Energy Consumption Calculator" },
        h1: { tr: "Enerji Tüketim Hesaplama", en: "Energy Consumption Calculator" },
        description: {
            tr: "Cihaz gücü, günlük çalışma süresi, gün sayısı ve kWh birim fiyatına göre enerji tüketimi ve maliyet hesaplayın.",
            en: "Calculate energy consumption and cost from device power, daily usage, days, and kWh price.",
        },
        shortDescription: { tr: "kWh tüketim ve maliyet hesabı.", en: "kWh consumption and cost." },
        relatedCalculators: ["gunes-paneli-hesaplama", "jenerator-guc-hesaplama", "elektrik-kablo-hesaplama", "isi-kaybi-hesaplama", "klima-btu-hesaplama"],
        inputs: [
            numberInput("devicePowerW", "Cihaz Gücü", "Device Power", 1500, { min: 0, step: 10, suffix: "W" }),
            numberInput("hoursPerDay", "Günlük Çalışma", "Daily Usage", 4, { min: 0, max: 24, step: 0.25, suffix: "saat" }),
            numberInput("dayCount", "Gün Sayısı", "Days", 30, { min: 1, step: 1, suffix: "gün" }),
            numberInput("kwhPrice", "kWh Birim Fiyat", "kWh Unit Price", 2.5, { min: 0, step: 0.01, prefix: "₺" }),
        ],
        results: [
            numberResult("dailyKwh", "Günlük Tüketim", "Daily Consumption", " kWh"),
            numberResult("totalKwh", "Toplam Tüketim", "Total Consumption", " kWh"),
            numberResult("totalCost", "Yaklaşık Maliyet", "Approx. Cost", " TL"),
            numberResult("monthlyCost", "30 Günlük Karşılık", "30-Day Equivalent", " TL"),
        ],
        formula: (values) => {
            const devicePowerW = Math.max(0, Number(values.devicePowerW) || 0);
            const hoursPerDay = Math.min(24, Math.max(0, Number(values.hoursPerDay) || 0));
            const dayCount = Math.max(1, Number(values.dayCount) || 1);
            const kwhPrice = Math.max(0, Number(values.kwhPrice) || 0);
            const dailyKwh = (devicePowerW / 1000) * hoursPerDay;
            const totalKwh = dailyKwh * dayCount;

            return {
                dailyKwh,
                totalKwh,
                totalCost: totalKwh * kwhPrice,
                monthlyCost: dailyKwh * 30 * kwhPrice,
            };
        },
        seo: buildSeo({
            title: "Enerji Tüketim Hesaplama (kWh ve Maliyet)",
            metaDescription: "Enerji tüketim hesaplama aracıyla cihaz watt değeri, çalışma süresi ve kWh fiyatına göre günlük/aylık tüketim ve yaklaşık maliyet hesaplayın.",
            intro: "Enerji tüketim hesabı, cihaz gücünü kW'a çevirir ve çalışma süresiyle çarpar. kWh birim fiyatı girildiğinde yaklaşık TL maliyeti de verir.",
            formula: "Günlük kWh = cihaz gücü(W) / 1000 × günlük saat. Toplam kWh = günlük kWh × gün sayısı. Maliyet = toplam kWh × kWh fiyatı.",
            example: "1500 W cihaz günde 4 saat ve 30 gün çalışırsa günlük 6 kWh, toplam 180 kWh tüketir. 2,50 TL/kWh fiyatla yaklaşık 450 TL maliyet oluşur.",
            interpretation: "Sonuç cihaz, şantiye ekipmanı, ısıtıcı, pompa veya atölye yükü için tüketim ön tahmini sağlar. Gerçek tüketim termostat, yük oranı ve kullanım alışkanlığına bağlıdır.",
            caution: "Elektrik tarifeleri, kademe, dağıtım bedeli, vergi ve sözleşme tipi maliyeti değiştirebilir. Güncel yerel tarife ve fatura kalemleriyle doğrulama yapılmalıdır.",
            links: systemsLinks,
            faq: [
                ["Watt değerini nereden bulurum?", "Cihaz etiketi, teknik föy veya kullanım kılavuzunda güç değeri W ya da kW olarak yazar."],
                ["kWh fiyatına tüm vergiler dahil mi olmalı?", "Faturaya yakın sonuç için birim fiyatı tüm vergi ve bedeller dahil ortalama kWh maliyeti olarak girmek daha doğru olur."],
                ["Cihaz her zaman tam güçte mi çalışır?", "Hayır. Termostatlı veya değişken hızlı cihazlarda gerçek ortalama güç nominal değerden düşük olabilir."],
                ["Şantiye tüketimi için kullanılabilir mi?", "Tekil cihaz veya ekipman grubu için ön tahmin verir; eşzamanlı kullanım ve sayaç verisi ayrıca değerlendirilmelidir."],
                ["Güneş paneli hesabıyla nasıl bağlantılı?", "Aylık kWh tüketimi panel boyutlandırmasında temel girdidir; bu sayfadaki toplam kWh değeri güneş paneli hesabında kullanılabilir."],
            ],
        }),
    },
];
