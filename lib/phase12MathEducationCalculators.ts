import type { CalculatorConfig } from "./calculator-source";

type SeoArgs = {
    title: string;
    metaDescription: string;
    intro: string;
    formula: string;
    example: string;
    interpretation: string;
    caution: string;
    links: string;
    faq: Array<[string, string]>;
};

function faqEntry(trQuestion: string, trAnswer: string, enQuestion: string, enAnswer: string) {
    return {
        q: { tr: trQuestion, en: enQuestion },
        a: { tr: trAnswer, en: enAnswer },
    };
}

function buildSeo(args: SeoArgs): CalculatorConfig["seo"] {
    return {
        title: { tr: args.title, en: args.title },
        metaDescription: { tr: args.metaDescription, en: args.metaDescription },
        content: {
            tr: `<h2>${args.title} Nasıl Kullanılır?</h2><p>${args.intro}</p><h2>Formül ve Yöntem</h2><p>${args.formula}</p><h2>Örnek Çözüm</h2><p>${args.example}</p><h2>Sonuç Nasıl Yorumlanır?</h2><p>${args.interpretation}</p><h2>Dikkat Edilmesi Gerekenler</h2><p>${args.caution}</p><h2>İlgili Hesaplamalar</h2><p>${args.links}</p>`,
            en: `${args.intro} Formula: ${args.formula} Example: ${args.example}`,
        },
        faq: args.faq.map(([question, answer]) => faqEntry(question, answer, question, answer)),
        richContent: {
            howItWorks: { tr: args.intro, en: args.intro },
            formulaText: { tr: args.formula, en: args.formula },
            exampleCalculation: { tr: args.example, en: args.example },
            miniGuide: { tr: `<p>${args.interpretation}</p><p>${args.caution}</p>`, en: `${args.interpretation} ${args.caution}` },
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

const textInput = (
    id: string,
    tr: string,
    en: string,
    defaultValue: string,
    options: Partial<CalculatorConfig["inputs"][number]> = {}
) => ({
    id,
    name: { tr, en },
    type: "text" as const,
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

const mathLinks =
    '<a href="/matematik-hesaplama/yuzde-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">yüzde hesaplama</a>, <a href="/matematik-hesaplama/ortalama-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ortalama hesaplama</a> ve <a href="/matematik-hesaplama/alan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">alan hesaplama</a> sayfalarıyla birlikte kullanabilirsiniz.';

const geometryLinks =
    '<a href="/matematik-hesaplama/alan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">alan hesaplama</a>, <a href="/matematik-hesaplama/cevre-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">çevre hesaplama</a> ve <a href="/matematik-hesaplama/hacim-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">hacim hesaplama</a> araçları geometri problemlerini birlikte tamamlar.';

const educationLinks =
    '<a href="/sinav-hesaplamalari/yks-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">YKS puan hesaplama</a>, <a href="/sinav-hesaplamalari/kpss-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">KPSS puan hesaplama</a> ve <a href="/sinav-hesaplamalari/lise-ortalama-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">not ortalaması</a> araçlarıyla birlikte yorumlanabilir.';

export const phase12MathEducationCalculators: CalculatorConfig[] = [
    {
        id: "standard-deviation",
        slug: "standart-sapma",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Standart Sapma Hesaplama", en: "Standard Deviation Calculator" },
        h1: { tr: "Standart Sapma Hesaplama", en: "Standard Deviation Calculator" },
        description: { tr: "Veri listesinden ortalama, varyans ve standart sapmayı örneklem ya da ana kütle seçimiyle hesaplayın.", en: "Calculate mean, variance, and standard deviation from a data list." },
        shortDescription: { tr: "Verilerin ortalamadan ne kadar yayıldığını görün.", en: "See how far values spread from the mean." },
        relatedCalculators: ["varyans-hesaplama", "ortalama-hesaplama", "medyan-hesaplama", "yuzde-hesaplama"],
        inputs: [
            textInput("values", "Veriler", "Values", "12, 15, 18, 20, 25"),
            selectInput("mode", "Hesap Türü", "Calculation Type", "sample", [
                { label: { tr: "Örneklem (n-1)", en: "Sample (n-1)" }, value: "sample" },
                { label: { tr: "Ana kütle (n)", en: "Population (n)" }, value: "population" },
            ]),
        ],
        results: [
            numberResult("count", "Veri Sayısı", "Count", "", 0),
            numberResult("mean", "Ortalama", "Mean"),
            numberResult("variance", "Varyans", "Variance"),
            numberResult("standardDeviation", "Standart Sapma", "Standard Deviation"),
        ],
        formula: (v) => {
            const values = String(v.values ?? "")
                .split(/[,\s;]+/)
                .map((item) => Number(item.replace(",", ".")))
                .filter((item) => Number.isFinite(item));
            const count = values.length;
            const mean = count > 0 ? values.reduce((sum, value) => sum + value, 0) / count : 0;
            const divisor = v.mode === "population" ? count : count - 1;
            const variance = divisor > 0
                ? values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / divisor
                : 0;
            return { count, mean, variance, standardDeviation: Math.sqrt(variance) };
        },
        seo: buildSeo({
            title: "Standart Sapma Hesaplama",
            metaDescription: "Standart sapma hesaplama aracıyla veri listesinin ortalama etrafındaki yayılımını, varyansını ve örneklem/ana kütle sonucunu hesaplayın.",
            intro: "Standart sapma, sayıların ortalama etrafında ne kadar dağıldığını gösteren temel istatistik ölçüsüdür. Küçük değerler verilerin birbirine yakın, büyük değerler ise daha dağınık olduğunu anlatır.",
            formula: "Önce ortalama bulunur. Sonra her değerin ortalamadan farkının karesi alınır, bu kareler toplanır ve n veya n-1'e bölünür. Standart sapma, varyansın kareköküdür.",
            example: "12, 15, 18, 20 ve 25 için ortalama 18 olur. Örneklem varyansı 24,5; standart sapma yaklaşık 4,95 çıkar.",
            interpretation: "Sonucu veri birimiyle okumalısınız. Notlar için 5 puanlık standart sapma, çoğu değerin ortalamanın birkaç puan çevresinde toplandığını gösterir.",
            caution: "Örneklem verilerinde n-1, tüm ana kütleyi temsil eden verilerde n kullanılır. Yanlış seçim özellikle küçük veri setlerinde sonucu değiştirir.",
            links: mathLinks,
            faq: [
                ["Standart sapma neyi gösterir?", "Verilerin ortalamadan ortalama olarak ne kadar saptığını gösterir."],
                ["Örneklem standart sapması neden n-1 kullanır?", "Küçük örneklemlerde ana kütle yayılımını daha dengeli tahmin etmek için n-1 kullanılır."],
                ["Standart sapma sıfır olabilir mi?", "Evet. Tüm değerler aynıysa yayılım yoktur ve standart sapma sıfırdır."],
                ["Standart sapma ile varyans aynı mı?", "Hayır. Varyans kareli bir ölçüdür; standart sapma varyansın kareköküdür."],
                ["Aykırı değer standart sapmayı etkiler mi?", "Evet. Çok büyük veya küçük değerler standart sapmayı belirgin biçimde artırabilir."],
            ],
        }),
    },
    {
        id: "variance",
        slug: "varyans-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Varyans Hesaplama", en: "Variance Calculator" },
        h1: { tr: "Varyans Hesaplama", en: "Variance Calculator" },
        description: { tr: "Verilerin ortalamadan kareli uzaklıklarına göre varyansı ve standart sapmayı hesaplayın.", en: "Calculate variance and standard deviation from squared deviations." },
        shortDescription: { tr: "Veri yayılımını kareli sapma mantığıyla ölçün.", en: "Measure spread using squared deviations." },
        relatedCalculators: ["standart-sapma", "ortalama-hesaplama", "medyan-hesaplama"],
        inputs: [
            textInput("values", "Veriler", "Values", "4, 8, 10, 12, 16"),
            selectInput("mode", "Hesap Türü", "Calculation Type", "population", [
                { label: { tr: "Ana kütle (n)", en: "Population (n)" }, value: "population" },
                { label: { tr: "Örneklem (n-1)", en: "Sample (n-1)" }, value: "sample" },
            ]),
        ],
        results: [
            numberResult("count", "Veri Sayısı", "Count", "", 0),
            numberResult("mean", "Ortalama", "Mean"),
            numberResult("variance", "Varyans", "Variance"),
            numberResult("standardDeviation", "Standart Sapma", "Standard Deviation"),
        ],
        formula: (v) => {
            const values = String(v.values ?? "")
                .split(/[,\s;]+/)
                .map((item) => Number(item.replace(",", ".")))
                .filter((item) => Number.isFinite(item));
            const count = values.length;
            const mean = count > 0 ? values.reduce((sum, value) => sum + value, 0) / count : 0;
            const divisor = v.mode === "sample" ? count - 1 : count;
            const variance = divisor > 0
                ? values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / divisor
                : 0;
            return { count, mean, variance, standardDeviation: Math.sqrt(variance) };
        },
        seo: buildSeo({
            title: "Varyans Hesaplama",
            metaDescription: "Varyans hesaplama aracıyla verilerin ortalamadan kareli sapmasını, ortalamayı ve standart sapmayı hızlıca hesaplayın.",
            intro: "Varyans, veri setindeki değerlerin ortalamadan ne kadar uzaklaştığını kareli farklarla ölçer. İstatistikte yayılımı anlamanın en temel adımlarından biridir.",
            formula: "Varyans = Kareli Sapmalar Toplamı / n veya n-1. Kareli sapma, her değerden ortalamanın çıkarılıp sonucun karesinin alınmasıdır.",
            example: "4, 8, 10, 12 ve 16 için ortalama 10 olur. Ana kütle varyansı 16, standart sapma 4 çıkar.",
            interpretation: "Varyans birimi kareli olduğu için doğrudan günlük anlamda okumak zor olabilir; standart sapma bu değerin daha sezgisel halidir.",
            caution: "Aykırı değerler kare alındığı için varyansı güçlü biçimde büyütür. Veri setini yorumlarken medyan ve standart sapmayla birlikte bakmak daha sağlıklıdır.",
            links: mathLinks,
            faq: [
                ["Varyans ne işe yarar?", "Verilerin ortalama etrafındaki yayılımını sayısal olarak ölçer."],
                ["Varyans negatif olur mu?", "Hayır. Kareli sapmalar kullanıldığı için varyans negatif olamaz."],
                ["Varyans mı standart sapma mı daha okunaklıdır?", "Standart sapma, orijinal veri biriminde olduğu için çoğu kullanıcı için daha okunaklıdır."],
                ["Örneklem varyansı nedir?", "Sadece bir örnek gruptan hareketle ana kütle yayılımını tahmin ederken n-1 böleniyle hesaplanan varyanstır."],
                ["Varyans büyükse ne anlama gelir?", "Değerlerin ortalamadan daha uzak ve veri setinin daha dağınık olduğunu gösterir."],
            ],
        }),
    },
    {
        id: "ratio",
        slug: "oran-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Oran Hesaplama", en: "Ratio Calculator" },
        h1: { tr: "Oran Hesaplama", en: "Ratio Calculator" },
        description: { tr: "İki sayı arasındaki oranı, sadeleştirilmiş oranı ve yüzde karşılığını hesaplayın.", en: "Calculate ratio, simplified ratio, and percentage equivalent." },
        shortDescription: { tr: "İki değeri oran ve yüzde olarak karşılaştırın.", en: "Compare two values as a ratio and percentage." },
        relatedCalculators: ["oranti-hesaplama", "yuzde-hesaplama", "kesir-sadelestirme"],
        inputs: [
            numberInput("first", "Birinci Değer", "First Value", 24),
            numberInput("second", "İkinci Değer", "Second Value", 36),
        ],
        results: [
            textResult("ratioText", "Sade Oran", "Simplified Ratio"),
            numberResult("decimalRatio", "Ondalık Oran", "Decimal Ratio"),
            numberResult("percentOfSecond", "Birinci Değer / İkinci Değer", "First / Second", " %"),
        ],
        formula: (v) => {
            const first = Number(v.first) || 0;
            const second = Number(v.second) || 0;
            const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
            const divisor = gcd(Math.round(first), Math.round(second)) || 1;
            return {
                ratioText: second === 0 ? "Tanımsız" : `${first / divisor}:${second / divisor}`,
                decimalRatio: second !== 0 ? first / second : 0,
                percentOfSecond: second !== 0 ? (first / second) * 100 : 0,
            };
        },
        seo: buildSeo({
            title: "Oran Hesaplama",
            metaDescription: "Oran hesaplama aracıyla iki sayıyı sadeleştirilmiş oran, ondalık değer ve yüzde karşılığı olarak karşılaştırın.",
            intro: "Oran, iki büyüklüğün birbirine göre kaç kat veya hangi payda ilişkisi içinde olduğunu gösterir. Matematik, finans ve günlük karşılaştırmalarda temel bir ölçüdür.",
            formula: "Oran = Birinci Değer / İkinci Değer. Sade oran için iki sayı ortak bölenlerine bölünür.",
            example: "24 ve 36 için ortak bölen 12'dir. Bu nedenle oran 24:36 yerine 2:3 olarak sadeleşir.",
            interpretation: "2:3 oranı, birinci büyüklüğün ikinciye göre ikiye üç ilişkisinde olduğunu anlatır. Yüzde karşılık ise 66,67% olur.",
            caution: "İkinci değer sıfırsa oran tanımsızdır. Ölçü birimleri farklıysa önce aynı birime dönüştürmek gerekir.",
            links: '<a href="/matematik-hesaplama/oranti-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">orantı hesaplama</a>, <a href="/matematik-hesaplama/yuzde-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">yüzde hesaplama</a> ve <a href="/matematik-hesaplama/kesir-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir hesaplama</a> sayfaları aynı oran mantığını farklı biçimlerde gösterir.',
            faq: [
                ["Oran ile yüzde aynı şey mi?", "Hayır. Oran iki değerin ilişkisini, yüzde ise bu ilişkinin 100 tabanındaki karşılığını gösterir."],
                ["Oran nasıl sadeleştirilir?", "İki sayı ortak bölenlerine bölünerek sadeleştirilir."],
                ["Sıfıra oran olur mu?", "Bir sayının sıfıra oranı tanımsızdır; sıfırın bir sayıya oranı ise sıfırdır."],
                ["Oran hangi birimle yazılır?", "Oran genellikle birimsizdir; fakat karşılaştırılan değerler aynı ölçü türünde olmalıdır."],
                ["2:3 oranı ne demek?", "Birinci değerin 2 parça, ikinci değerin 3 parça olduğu ilişkiyi anlatır."],
            ],
        }),
    },
    {
        id: "proportion",
        slug: "oranti-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Orantı Hesaplama", en: "Proportion Calculator" },
        h1: { tr: "Orantı Hesaplama", en: "Proportion Calculator" },
        description: { tr: "a/b = c/x biçimindeki doğru orantıda bilinmeyen x değerini hesaplayın.", en: "Solve x in a/b = c/x style direct proportion." },
        shortDescription: { tr: "Doğru orantıda eksik değeri bulun.", en: "Find the missing value in a direct proportion." },
        relatedCalculators: ["oran-hesaplama", "yuzde-hesaplama", "kesir-hesaplama"],
        inputs: [
            numberInput("a", "A", "A", 3),
            numberInput("b", "B", "B", 5),
            numberInput("c", "C", "C", 12),
        ],
        results: [
            numberResult("x", "Bilinmeyen X", "Unknown X"),
            textResult("equation", "Kurulan Orantı", "Proportion"),
        ],
        formula: (v) => {
            const a = Number(v.a) || 0;
            const b = Number(v.b) || 0;
            const c = Number(v.c) || 0;
            const x = a !== 0 ? (b * c) / a : 0;
            return { x, equation: `${a}/${b} = ${c}/${x || "x"}` };
        },
        seo: buildSeo({
            title: "Orantı Hesaplama",
            metaDescription: "Orantı hesaplama aracıyla doğru orantı problemlerinde bilinmeyen değeri a/b = c/x mantığıyla bulun.",
            intro: "Orantı, iki oranın birbirine eşit olduğu durumları çözer. Eksik değer bulma, ölçek, tarif ve hız problemlerinde sık kullanılır.",
            formula: "a / b = c / x ise çapraz çarpım yapılır ve x = b × c / a bulunur.",
            example: "3/5 = 12/x için x = 5 × 12 / 3 = 20 olur.",
            interpretation: "Sonuç, aynı oran korunursa üçüncü değere karşılık gelmesi gereken dördüncü değeri gösterir.",
            caution: "Doğru orantı varsayımı geçerli değilse sonuç yanlış yorumlanır. Ters orantı problemlerinde farklı formül kullanılır.",
            links: '<a href="/matematik-hesaplama/oran-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">oran hesaplama</a>, <a href="/matematik-hesaplama/yuzde-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">yüzde hesaplama</a> ve <a href="/matematik-hesaplama/kesir-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir hesaplama</a> ile birlikte kullanılabilir.',
            faq: [
                ["Orantı nedir?", "İki oranın birbirine eşit olduğu matematiksel ilişkidir."],
                ["Çapraz çarpım nasıl yapılır?", "Orantıda karşılıklı çapraz terimler çarpılır ve bilinmeyen yalnız bırakılır."],
                ["Bu araç ters orantı çözer mi?", "Hayır. Bu ekran doğru orantı için tasarlanmıştır."],
                ["a değeri sıfır olursa ne olur?", "a sıfırsa bu formdaki orantı çözülemez; araç sonucu sıfır gösterir."],
                ["Orantı nerelerde kullanılır?", "Ölçek, karışım, tarif, harita ve hız problemlerinde kullanılır."],
            ],
        }),
    },
    {
        id: "logarithm",
        slug: "logaritma-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Logaritma Hesaplama", en: "Logarithm Calculator" },
        h1: { tr: "Logaritma Hesaplama", en: "Logarithm Calculator" },
        description: { tr: "Pozitif bir sayının seçilen tabandaki logaritmasını hesaplayın.", en: "Calculate logarithm of a positive number in a selected base." },
        shortDescription: { tr: "Logaritma değerini tabana göre bulun.", en: "Find logarithm by base." },
        relatedCalculators: ["us-kuvvet-karekok", "uslu-sayi-hesaplama", "denklem-cozucu"],
        inputs: [
            numberInput("value", "Sayı", "Value", 100),
            numberInput("base", "Taban", "Base", 10),
        ],
        results: [
            numberResult("logResult", "Logaritma Sonucu", "Log Result", "", 6),
            textResult("meaning", "Anlamı", "Meaning"),
        ],
        formula: (v) => {
            const value = Number(v.value) || 0;
            const base = Number(v.base) || 0;
            const valid = value > 0 && base > 0 && base !== 1;
            const logResult = valid ? Math.log(value) / Math.log(base) : 0;
            return {
                logResult,
                meaning: valid ? `${base}^${logResult.toFixed(4)} = ${value}` : "Sayı pozitif, taban pozitif ve 1'den farklı olmalı.",
            };
        },
        seo: buildSeo({
            title: "Logaritma Hesaplama",
            metaDescription: "Logaritma hesaplama aracıyla bir sayının 10, e veya istediğiniz tabandaki logaritma değerini hesaplayın.",
            intro: "Logaritma, bir tabanın hangi kuvvetinin verilen sayıyı oluşturduğunu gösterir. Üslü ifadelerin ters işlemi olarak düşünülebilir.",
            formula: "log_b(a) = ln(a) / ln(b). Burada a pozitif, b pozitif ve b 1'den farklı olmalıdır.",
            example: "log_10(1000) = 3 çünkü 10^3 = 1000 olur.",
            interpretation: "Sonuç, tabanın kaçıncı kuvvetle hedef sayıya ulaştığını gösterir. Büyük değerler üstel büyüme problemlerinde sık kullanılır.",
            caution: "Negatif sayıların reel logaritması yoktur. Taban 1 olamaz; çünkü 1'in tüm kuvvetleri yine 1'dir.",
            links: mathLinks,
            faq: [
                ["Logaritma üslü sayının tersi midir?", "Evet. Logaritma, verilen sonucu elde etmek için tabanın hangi üsse çıkarıldığını bulur."],
                ["Logaritma tabanı 10 ne demek?", "10 tabanlı logaritma, 10'un kaçıncı kuvvetinin sayıyı verdiğini gösterir."],
                ["ln nedir?", "ln, e tabanındaki doğal logaritmadır."],
                ["Negatif sayının logaritması alınır mı?", "Reel sayılar içinde negatif sayının logaritması tanımlı değildir."],
                ["Taban 1 olabilir mi?", "Hayır. Logaritma tabanı pozitif ve 1'den farklı olmalıdır."],
            ],
        }),
    },
    {
        id: "volume",
        slug: "hacim-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Hacim Hesaplama", en: "Volume Calculator" },
        h1: { tr: "Hacim Hesaplama", en: "Volume Calculator" },
        description: { tr: "Küp, dikdörtgen prizma, silindir, küre, koni veya piramit için yaklaşık hacim hesaplayın.", en: "Calculate volume for common 3D shapes." },
        shortDescription: { tr: "Temel üç boyutlu şekillerin hacmini bulun.", en: "Find volume of common solids." },
        relatedCalculators: ["silindir-hacmi", "kure-hacmi", "piramit-hacmi", "alan-hesaplama"],
        inputs: [
            selectInput("shape", "Şekil", "Shape", "rectangularPrism", [
                { label: { tr: "Dikdörtgen prizma", en: "Rectangular prism" }, value: "rectangularPrism" },
                { label: { tr: "Küp", en: "Cube" }, value: "cube" },
                { label: { tr: "Silindir", en: "Cylinder" }, value: "cylinder" },
                { label: { tr: "Küre", en: "Sphere" }, value: "sphere" },
                { label: { tr: "Koni", en: "Cone" }, value: "cone" },
                { label: { tr: "Piramit", en: "Pyramid" }, value: "pyramid" },
            ]),
            numberInput("length", "Uzunluk / Kenar", "Length / Edge", 8),
            numberInput("width", "Genişlik", "Width", 5),
            numberInput("height", "Yükseklik", "Height", 4),
            numberInput("radius", "Yarıçap", "Radius", 3),
        ],
        results: [
            numberResult("volume", "Hacim", "Volume", " birim³"),
            textResult("formulaUsed", "Kullanılan Formül", "Formula Used"),
        ],
        formula: (v) => {
            const shape = String(v.shape || "rectangularPrism");
            const length = Number(v.length) || 0;
            const width = Number(v.width) || 0;
            const height = Number(v.height) || 0;
            const radius = Number(v.radius) || 0;
            if (shape === "cube") return { volume: Math.pow(length, 3), formulaUsed: "Küp: a³" };
            if (shape === "cylinder") return { volume: Math.PI * radius * radius * height, formulaUsed: "Silindir: πr²h" };
            if (shape === "sphere") return { volume: 4 / 3 * Math.PI * Math.pow(radius, 3), formulaUsed: "Küre: 4/3πr³" };
            if (shape === "cone") return { volume: 1 / 3 * Math.PI * radius * radius * height, formulaUsed: "Koni: 1/3πr²h" };
            if (shape === "pyramid") return { volume: (length * width * height) / 3, formulaUsed: "Piramit: taban alanı × h / 3" };
            return { volume: length * width * height, formulaUsed: "Dikdörtgen prizma: a × b × h" };
        },
        seo: buildSeo({
            title: "Hacim Hesaplama",
            metaDescription: "Hacim hesaplama aracıyla küp, prizma, silindir, küre, koni ve piramit hacmini temel formüllerle hesaplayın.",
            intro: "Hacim, üç boyutlu bir cismin kapladığı alanı gösterir. Sonuç birim küp, cm³ veya m³ gibi kübik birimlerle okunur.",
            formula: "Prizmada hacim taban alanı × yükseklik, silindirde πr²h, kürede 4/3πr³, piramitte taban alanı × yükseklik / 3 formülüyle hesaplanır.",
            example: "8 × 5 × 4 ölçülerindeki dikdörtgen prizmanın hacmi 160 birim³ olur.",
            interpretation: "Hacim sonucu dolum, kap, depo, geometri ve malzeme hesabında kullanılabilir. Ölçü birimi metreyse sonuç m³ olur.",
            caution: "Tüm ölçüler aynı birimde olmalıdır. Santimetre ve metreyi karıştırmak sonucu binlerce kat değiştirebilir.",
            links: geometryLinks,
            faq: [
                ["Hacim hangi birimle yazılır?", "Hacim cm³, m³ veya birim³ gibi kübik birimlerle yazılır."],
                ["Alan ile hacim farkı nedir?", "Alan iki boyutlu yüzeyi, hacim üç boyutlu kapladığı yeri ölçer."],
                ["Silindir hacmi nasıl bulunur?", "Taban alanı olan πr², yükseklik ile çarpılır."],
                ["Küre hacminde hangi formül kullanılır?", "4/3 × π × r³ formülü kullanılır."],
                ["Ölçüleri farklı birimde girersem ne olur?", "Sonuç hatalı olur; tüm ölçüler aynı birime çevrilmelidir."],
            ],
        }),
    },
    {
        id: "cylinder-volume",
        slug: "silindir-hacmi",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Silindir Hacmi Hesaplama", en: "Cylinder Volume Calculator" },
        h1: { tr: "Silindir Hacmi Hesaplama", en: "Cylinder Volume Calculator" },
        description: { tr: "Yarıçap ve yükseklikten silindir hacmi ile taban alanını hesaplayın.", en: "Calculate cylinder volume and base area from radius and height." },
        shortDescription: { tr: "πr²h formülüyle silindir hacmini bulun.", en: "Find cylinder volume using πr²h." },
        relatedCalculators: ["hacim-hesaplama", "daire-alan-cevre", "alan-hesaplama"],
        inputs: [numberInput("radius", "Yarıçap", "Radius", 5), numberInput("height", "Yükseklik", "Height", 12)],
        results: [numberResult("baseArea", "Taban Alanı", "Base Area", " birim²"), numberResult("volume", "Silindir Hacmi", "Cylinder Volume", " birim³")],
        formula: (v) => {
            const radius = Number(v.radius) || 0;
            const height = Number(v.height) || 0;
            const baseArea = Math.PI * radius * radius;
            return { baseArea, volume: baseArea * height };
        },
        seo: buildSeo({
            title: "Silindir Hacmi Hesaplama",
            metaDescription: "Silindir hacmi hesaplama aracıyla yarıçap ve yükseklik girerek taban alanını ve πr²h formülüne göre hacmi bulun.",
            intro: "Silindir hacmi, dairesel tabanın yukarı doğru aynı biçimde uzamasıyla oluşan üç boyutlu hacmi gösterir.",
            formula: "Silindir hacmi = π × r² × h. Önce daire taban alanı bulunur, sonra yükseklikle çarpılır.",
            example: "Yarıçap 5, yükseklik 12 ise hacim π × 25 × 12 = yaklaşık 942,48 birim³ olur.",
            interpretation: "Sonuç depo, boru, kutu ve geometri problemlerinde kapasiteyi gösterir.",
            caution: "Çap verildiyse önce ikiye bölerek yarıçapı bulmalısınız. Yarıçap ve yükseklik aynı birimde olmalıdır.",
            links: geometryLinks,
            faq: [
                ["Silindir hacmi formülü nedir?", "πr²h formülü kullanılır."],
                ["Çapla hesaplama yapılır mı?", "Evet, çap ikiye bölünerek yarıçap bulunur."],
                ["Sonuç hangi birimdedir?", "Girdi birimi cm ise sonuç cm³, metre ise m³ olur."],
                ["Taban alanı neden hesaplanır?", "Hacim taban alanının yükseklikle çarpılmasıdır."],
                ["Silindir ile koni hacmi aynı mı?", "Hayır. Koni hacmi aynı taban ve yükseklikte silindirin üçte biridir."],
            ],
        }),
    },
    {
        id: "sphere-volume",
        slug: "kure-hacmi",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Küre Hacmi Hesaplama", en: "Sphere Volume Calculator" },
        h1: { tr: "Küre Hacmi Hesaplama", en: "Sphere Volume Calculator" },
        description: { tr: "Yarıçapa göre küre hacmini ve yüzey alanını hesaplayın.", en: "Calculate sphere volume and surface area from radius." },
        shortDescription: { tr: "4/3πr³ formülüyle küre hacmini bulun.", en: "Find sphere volume using 4/3πr³." },
        relatedCalculators: ["hacim-hesaplama", "daire-alan-cevre", "alan-hesaplama"],
        inputs: [numberInput("radius", "Yarıçap", "Radius", 6)],
        results: [numberResult("volume", "Küre Hacmi", "Sphere Volume", " birim³"), numberResult("surfaceArea", "Yüzey Alanı", "Surface Area", " birim²")],
        formula: (v) => {
            const radius = Number(v.radius) || 0;
            return {
                volume: 4 / 3 * Math.PI * Math.pow(radius, 3),
                surfaceArea: 4 * Math.PI * radius * radius,
            };
        },
        seo: buildSeo({
            title: "Küre Hacmi Hesaplama",
            metaDescription: "Küre hacmi hesaplama aracıyla yarıçaptan 4/3πr³ formülüyle hacmi ve 4πr² ile yüzey alanını hesaplayın.",
            intro: "Küre, merkezden tüm yüzey noktalarına uzaklığı eşit olan üç boyutlu geometrik cisimdir.",
            formula: "Küre hacmi = 4/3 × π × r³. Yüzey alanı = 4 × π × r².",
            example: "Yarıçap 6 ise hacim 4/3 × π × 216 = yaklaşık 904,78 birim³ olur.",
            interpretation: "Küre hacmi top, tank veya geometri sorularında cismin kapladığı üç boyutlu büyüklüğü gösterir.",
            caution: "Yarıçap yerine çap verildiyse çapı ikiye bölerek hesaplamaya başlamalısınız.",
            links: geometryLinks,
            faq: [
                ["Küre hacmi formülü nedir?", "4/3πr³ formülü kullanılır."],
                ["Küre yüzey alanı nasıl hesaplanır?", "4πr² formülü kullanılır."],
                ["Çap verilirse ne yapılmalı?", "Çap ikiye bölünerek yarıçap bulunur."],
                ["Küre hacmi neden r³ içerir?", "Hacim üç boyutlu olduğu için yarıçapın küpüyle orantılıdır."],
                ["Sonuç hangi birimde olur?", "Girdi biriminin küpüyle, örneğin cm³ veya m³ olarak okunur."],
            ],
        }),
    },
    {
        id: "pyramid-volume",
        slug: "piramit-hacmi",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Piramit Hacmi Hesaplama", en: "Pyramid Volume Calculator" },
        h1: { tr: "Piramit Hacmi Hesaplama", en: "Pyramid Volume Calculator" },
        description: { tr: "Taban alanı ve yükseklikle piramit hacmini hesaplayın.", en: "Calculate pyramid volume from base area and height." },
        shortDescription: { tr: "Taban alanı × yükseklik / 3 formülüyle piramit hacmi.", en: "Pyramid volume from base area and height." },
        relatedCalculators: ["hacim-hesaplama", "alan-hesaplama", "ucgen-hesaplama"],
        inputs: [numberInput("baseArea", "Taban Alanı", "Base Area", 48), numberInput("height", "Yükseklik", "Height", 10)],
        results: [numberResult("volume", "Piramit Hacmi", "Pyramid Volume", " birim³")],
        formula: (v) => {
            const baseArea = Number(v.baseArea) || 0;
            const height = Number(v.height) || 0;
            return { volume: (baseArea * height) / 3 };
        },
        seo: buildSeo({
            title: "Piramit Hacmi Hesaplama",
            metaDescription: "Piramit hacmi hesaplama aracıyla taban alanı ve yüksekliği girerek hacmi taban alanı × yükseklik / 3 formülüyle bulun.",
            intro: "Piramit hacmi, taban alanı ve tepe yüksekliği kullanılarak hesaplanır. Aynı taban ve yükseklikteki prizmanın üçte biri kadardır.",
            formula: "Piramit hacmi = Taban Alanı × Yükseklik / 3.",
            example: "Taban alanı 48, yükseklik 10 ise hacim 48 × 10 / 3 = 160 birim³ olur.",
            interpretation: "Sonuç piramidin kapladığı üç boyutlu büyüklüğü gösterir. Taban alanı farklı şekillerden gelebilir.",
            caution: "Yükseklik eğik ayrıt değil, tabandan tepeye dik uzaklıktır. Eğik uzunlukla hesap yapılırsa sonuç hatalı olur.",
            links: geometryLinks,
            faq: [
                ["Piramit hacmi neden üçe bölünür?", "Aynı taban ve yükseklikteki prizmanın hacminin üçte biri olduğu için."],
                ["Taban alanı nasıl bulunur?", "Tabanın şekline göre kare, dikdörtgen, üçgen veya çokgen alan formülü kullanılır."],
                ["Eğik yükseklik kullanılabilir mi?", "Hayır. Hacim için dik yükseklik gerekir."],
                ["Birim nasıl yazılır?", "Hacim birim³ olarak yazılır."],
                ["Koni ile piramit benzer mi?", "Evet, ikisi de taban alanı × yükseklik / 3 mantığıyla hesaplanır."],
            ],
        }),
    },
    {
        id: "trigonometry",
        slug: "trigonometri-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Trigonometri Hesaplama", en: "Trigonometry Calculator" },
        h1: { tr: "Trigonometri Hesaplama", en: "Trigonometry Calculator" },
        description: { tr: "Açıdan sinüs, kosinüs, tanjant ve verilen hipotenüse göre dik üçgen kenarlarını hesaplayın.", en: "Calculate sin, cos, tan, and right-triangle sides from angle." },
        shortDescription: { tr: "Açı ve hipotenüsle trigonometri değerlerini bulun.", en: "Find trigonometric values from angle." },
        relatedCalculators: ["sin-cos-tan-hesaplama", "ucgen-hesaplama", "denklem-cozucu"],
        inputs: [numberInput("angle", "Açı", "Angle", 30, { suffix: "°" }), numberInput("hypotenuse", "Hipotenüs", "Hypotenuse", 10)],
        results: [
            numberResult("sin", "Sinüs", "Sine", "", 6),
            numberResult("cos", "Kosinüs", "Cosine", "", 6),
            numberResult("tan", "Tanjant", "Tangent", "", 6),
            numberResult("opposite", "Karşı Kenar", "Opposite Side"),
            numberResult("adjacent", "Komşu Kenar", "Adjacent Side"),
        ],
        formula: (v) => {
            const angle = Number(v.angle) || 0;
            const hypotenuse = Number(v.hypotenuse) || 0;
            const radian = angle * Math.PI / 180;
            const sin = Math.sin(radian);
            const cos = Math.cos(radian);
            const tan = Math.tan(radian);
            return { sin, cos, tan, opposite: hypotenuse * sin, adjacent: hypotenuse * cos };
        },
        seo: buildSeo({
            title: "Trigonometri Hesaplama",
            metaDescription: "Trigonometri hesaplama aracıyla açıdan sinüs, kosinüs, tanjant ve dik üçgende karşı/komşu kenar değerlerini bulun.",
            intro: "Trigonometri, açı ile kenar uzunlukları arasındaki ilişkiyi inceler. Dik üçgen problemlerinde sin, cos ve tan temel oranlardır.",
            formula: "sin = karşı / hipotenüs, cos = komşu / hipotenüs, tan = karşı / komşu.",
            example: "30° ve hipotenüs 10 için karşı kenar 5, komşu kenar yaklaşık 8,66 olur.",
            interpretation: "Sonuçlar açıya bağlı oranları ve hipotenüse göre kenar karşılıklarını gösterir.",
            caution: "Araç derece girdisi kullanır. Radyan değerleri dereceye çevirmeden girerseniz sonuç farklı çıkar.",
            links: '<a href="/matematik-hesaplama/sin-cos-tan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">sin cos tan hesaplama</a>, <a href="/matematik-hesaplama/ucgen-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">üçgen hesaplama</a> ve <a href="/matematik-hesaplama/alan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">alan hesaplama</a> ile birlikte kullanılabilir.',
            faq: [
                ["Sinüs neyi gösterir?", "Dik üçgende karşı kenarın hipotenüse oranını gösterir."],
                ["Kosinüs neyi gösterir?", "Komşu kenarın hipotenüse oranını gösterir."],
                ["Tanjant neyi gösterir?", "Karşı kenarın komşu kenara oranıdır."],
                ["Açı derece mi girilmeli?", "Evet. Bu araç derece girdisiyle çalışır."],
                ["Hipotenüs olmadan kenar hesaplanır mı?", "Bu ekranda kenar için hipotenüs gerekir; oranlar ise sadece açıdan hesaplanır."],
            ],
        }),
    },
    {
        id: "sin-cos-tan",
        slug: "sin-cos-tan-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Sin Cos Tan Hesaplama", en: "Sin Cos Tan Calculator" },
        h1: { tr: "Sin Cos Tan Hesaplama", en: "Sin Cos Tan Calculator" },
        description: { tr: "Derece veya radyan cinsinden açı girerek sinüs, kosinüs, tanjant ve kotanjant değerlerini hesaplayın.", en: "Calculate sine, cosine, tangent, and cotangent from degree or radian." },
        shortDescription: { tr: "Açının sin, cos, tan ve cot değerlerini bulun.", en: "Find sin, cos, tan, and cot." },
        relatedCalculators: ["trigonometri-hesaplama", "ucgen-hesaplama", "logaritma-hesaplama"],
        inputs: [
            numberInput("angle", "Açı", "Angle", 45),
            selectInput("unit", "Açı Birimi", "Angle Unit", "degree", [
                { label: { tr: "Derece", en: "Degree" }, value: "degree" },
                { label: { tr: "Radyan", en: "Radian" }, value: "radian" },
            ]),
        ],
        results: [
            numberResult("sin", "Sin", "Sin", "", 6),
            numberResult("cos", "Cos", "Cos", "", 6),
            numberResult("tan", "Tan", "Tan", "", 6),
            numberResult("cot", "Cot", "Cot", "", 6),
        ],
        formula: (v) => {
            const angle = Number(v.angle) || 0;
            const radian = v.unit === "radian" ? angle : angle * Math.PI / 180;
            const sin = Math.sin(radian);
            const cos = Math.cos(radian);
            const tan = Math.tan(radian);
            return { sin, cos, tan, cot: Math.abs(tan) > 1e-12 ? 1 / tan : 0 };
        },
        seo: buildSeo({
            title: "Sin Cos Tan Hesaplama",
            metaDescription: "Sin cos tan hesaplama aracıyla derece veya radyan açıdan sinüs, kosinüs, tanjant ve kotanjant değerlerini hesaplayın.",
            intro: "Sin, cos ve tan trigonometrinin temel oranlarıdır. Açı bilindiğinde bu oranlar doğrudan hesaplanabilir.",
            formula: "sin(x), cos(x), tan(x) = sin(x) / cos(x), cot(x) = 1 / tan(x).",
            example: "45° için sin ve cos yaklaşık 0,7071, tan ise 1 olur.",
            interpretation: "Değerler dik üçgen oranları veya birim çember üzerindeki koordinat ilişkileri olarak okunabilir.",
            caution: "Tanjant, kosinüsün sıfıra yaklaştığı açılarda çok büyür veya tanımsız kabul edilir.",
            links: '<a href="/matematik-hesaplama/trigonometri-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">trigonometri hesaplama</a> ve <a href="/matematik-hesaplama/ucgen-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">üçgen hesaplama</a> ile birlikte kullanılabilir.',
            faq: [
                ["Sin 45 kaçtır?", "Yaklaşık 0,7071 değerindedir."],
                ["Tan nasıl hesaplanır?", "Sinüs değerinin kosinüs değerine bölünmesiyle hesaplanır."],
                ["Radyan girebilir miyim?", "Evet. Açı birimi alanından radyan seçilebilir."],
                ["Cot nedir?", "Kotanjant, tanjantın tersidir."],
                ["90 derecede tan neden sorunludur?", "Çünkü cos 90 sıfıra eşittir ve tan = sin/cos oranı tanımsız hale gelir."],
            ],
        }),
    },
    {
        id: "polynomial",
        slug: "polinom-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Polinom Hesaplama", en: "Polynomial Calculator" },
        h1: { tr: "Polinom Hesaplama", en: "Polynomial Calculator" },
        description: { tr: "Katsayı listesinden seçilen x değeri için polinom değerini hesaplayın.", en: "Evaluate a polynomial from coefficients and x value." },
        shortDescription: { tr: "Polinomun x değerindeki sonucunu bulun.", en: "Evaluate polynomial at x." },
        relatedCalculators: ["denklem-cozucu", "ikinci-derece-denklem", "logaritma-hesaplama"],
        inputs: [
            textInput("coefficients", "Katsayılar (yüksek dereceden sabite)", "Coefficients", "2, -3, 1"),
            numberInput("x", "x Değeri", "x Value", 4),
        ],
        results: [
            numberResult("degree", "Derece", "Degree", "", 0),
            numberResult("value", "P(x)", "P(x)"),
            textResult("polynomialText", "Polinom", "Polynomial"),
        ],
        formula: (v) => {
            const coefficients = String(v.coefficients ?? "")
                .split(/[,\s;]+/)
                .map((item) => Number(item.replace(",", ".")))
                .filter((item) => Number.isFinite(item));
            const x = Number(v.x) || 0;
            const degree = Math.max(0, coefficients.length - 1);
            const value = coefficients.reduce((sum, coefficient, index) => (
                sum + coefficient * Math.pow(x, degree - index)
            ), 0);
            return { degree, value, polynomialText: coefficients.map((coefficient, index) => `${coefficient}x^${degree - index}`).join(" + ") };
        },
        seo: buildSeo({
            title: "Polinom Hesaplama",
            metaDescription: "Polinom hesaplama aracıyla katsayıları girerek seçilen x değeri için P(x) sonucunu ve polinom derecesini hesaplayın.",
            intro: "Polinom, değişkenin farklı kuvvetlerinin katsayılarla çarpılıp toplanmasıyla oluşur. Bu araç katsayı listesinden P(x) değerini üretir.",
            formula: "P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₀. Katsayılar yüksek dereceden sabit terime doğru girilir.",
            example: "2x² - 3x + 1 polinomunda x=4 için P(4)=2×16-12+1=21 olur.",
            interpretation: "Sonuç, verilen polinomun seçilen x noktasındaki değeridir. Grafik üzerinde bu değer y koordinatına karşılık gelir.",
            caution: "Katsayıları doğru sırada girmek önemlidir. Eksik derece varsa o derece için 0 katsayısı yazılmalıdır.",
            links: mathLinks,
            faq: [
                ["Polinom derecesi nedir?", "En yüksek kuvvetli değişken teriminin üssüdür."],
                ["Katsayılar hangi sırayla girilmeli?", "En yüksek dereceden sabit terime doğru girilmelidir."],
                ["Eksik terim varsa ne yapmalıyım?", "Eksik terimin katsayısını 0 olarak yazmalısınız."],
                ["P(x) ne demek?", "Polinomun x değerindeki sonucunu ifade eder."],
                ["Bu araç kök bulur mu?", "Hayır. Bu ekran polinom değeri hesaplar; kök için denklem araçları kullanılmalıdır."],
            ],
        }),
    },
    {
        id: "equation-solver",
        slug: "denklem-cozucu",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Denklem Çözücü", en: "Equation Solver" },
        h1: { tr: "Denklem Çözücü", en: "Equation Solver" },
        description: { tr: "ax + b = c biçimindeki birinci derece denklemin x çözümünü hesaplayın.", en: "Solve x in ax + b = c." },
        shortDescription: { tr: "Birinci derece denklemde x değerini bulun.", en: "Find x in a linear equation." },
        relatedCalculators: ["ikinci-derece-denklem", "polinom-hesaplama", "oran-hesaplama"],
        inputs: [numberInput("a", "a Katsayısı", "Coefficient a", 3), numberInput("b", "b Sabiti", "Constant b", 6), numberInput("c", "Sağ Taraf c", "Right Side c", 21)],
        results: [numberResult("x", "x Çözümü", "Solution x"), textResult("steps", "Çözüm Adımı", "Steps")],
        formula: (v) => {
            const a = Number(v.a) || 0;
            const b = Number(v.b) || 0;
            const c = Number(v.c) || 0;
            const x = a !== 0 ? (c - b) / a : 0;
            return { x, steps: a !== 0 ? `x = (${c} - ${b}) / ${a}` : "a sıfır olduğu için tekil çözüm yoktur." };
        },
        seo: buildSeo({
            title: "Denklem Çözücü",
            metaDescription: "Denklem çözücü ile ax + b = c biçimindeki birinci derece denklemlerde x değerini adım mantığıyla hesaplayın.",
            intro: "Birinci derece denklemler, bilinmeyenin birinci kuvvetini içerir ve x'i yalnız bırakarak çözülür.",
            formula: "ax + b = c ise x = (c - b) / a. a sıfır olmamalıdır.",
            example: "3x + 6 = 21 için x = (21 - 6) / 3 = 5 olur.",
            interpretation: "Bulunan x değeri denkleme geri yazıldığında eşitliğin iki tarafını eşit yapmalıdır.",
            caution: "a katsayısı sıfırsa denklem bu biçimde tek bir x çözümü üretmez.",
            links: mathLinks,
            faq: [
                ["Birinci derece denklem nedir?", "Bilinmeyenin en yüksek kuvvetinin 1 olduğu denklemdir."],
                ["x nasıl yalnız bırakılır?", "Sabit terimler karşı tarafa alınır ve x katsayısına bölünür."],
                ["a sıfırsa ne olur?", "Denklem x içermediği için tekil çözüm çıkmayabilir."],
                ["Sonucu nasıl kontrol ederim?", "Bulduğunuz x'i denklemde yerine yazarsınız."],
                ["İkinci derece denklem de çözer mi?", "Hayır. Bunun için ikinci derece denklem aracı kullanılmalıdır."],
            ],
        }),
    },
    {
        id: "quadratic-equation",
        slug: "ikinci-derece-denklem",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "İkinci Derece Denklem Hesaplama", en: "Quadratic Equation Calculator" },
        h1: { tr: "İkinci Derece Denklem Hesaplama", en: "Quadratic Equation Calculator" },
        description: { tr: "ax² + bx + c = 0 denkleminde diskriminantı ve reel kökleri hesaplayın.", en: "Calculate discriminant and real roots of ax² + bx + c = 0." },
        shortDescription: { tr: "Diskriminant ve kökleri bulun.", en: "Find discriminant and roots." },
        relatedCalculators: ["denklem-cozucu", "polinom-hesaplama", "us-kuvvet-karekok"],
        inputs: [numberInput("a", "a", "a", 1), numberInput("b", "b", "b", -5), numberInput("c", "c", "c", 6)],
        results: [numberResult("discriminant", "Diskriminant", "Discriminant"), textResult("rootType", "Kök Durumu", "Root Type"), numberResult("root1", "1. Kök", "Root 1"), numberResult("root2", "2. Kök", "Root 2")],
        formula: (v) => {
            const a = Number(v.a) || 0;
            const b = Number(v.b) || 0;
            const c = Number(v.c) || 0;
            const discriminant = b * b - 4 * a * c;
            if (a === 0) return { discriminant, rootType: "Bu ikinci derece denklem değildir.", root1: 0, root2: 0 };
            if (discriminant < 0) return { discriminant, rootType: "Reel kök yok", root1: 0, root2: 0 };
            const sqrt = Math.sqrt(discriminant);
            return {
                discriminant,
                rootType: discriminant === 0 ? "Çakışık reel kök" : "İki farklı reel kök",
                root1: (-b + sqrt) / (2 * a),
                root2: (-b - sqrt) / (2 * a),
            };
        },
        seo: buildSeo({
            title: "İkinci Derece Denklem Hesaplama",
            metaDescription: "İkinci derece denklem hesaplama aracıyla ax² + bx + c = 0 için diskriminantı ve reel kökleri hesaplayın.",
            intro: "İkinci derece denklemler x² terimi içerir. Köklerin durumu diskriminant değerine göre belirlenir.",
            formula: "Diskriminant Δ = b² - 4ac. Kökler x = (-b ± √Δ) / 2a formülüyle bulunur.",
            example: "x² - 5x + 6 = 0 için Δ = 25 - 24 = 1; kökler 3 ve 2 olur.",
            interpretation: "Δ pozitifse iki farklı reel kök, sıfırsa çakışık kök, negatifse reel kök yoktur.",
            caution: "a katsayısı sıfırsa denklem ikinci derece değildir; birinci derece denklem olarak ele alınmalıdır.",
            links: mathLinks,
            faq: [
                ["Diskriminant nedir?", "Köklerin reel olup olmadığını gösteren b² - 4ac değeridir."],
                ["Δ negatifse ne olur?", "Reel sayılar içinde kök yoktur."],
                ["Δ sıfırsa kaç kök vardır?", "Çakışık yani aynı değerde iki kök vardır."],
                ["a sıfır olabilir mi?", "İkinci derece denklem için a sıfır olamaz."],
                ["Kökleri nasıl kontrol ederim?", "Kökleri denklemde x yerine yazarak sonucun sıfır olup olmadığını kontrol edersiniz."],
            ],
        }),
    },
    {
        id: "matrix",
        slug: "matris-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Matris Hesaplama", en: "Matrix Calculator" },
        h1: { tr: "Matris Hesaplama", en: "Matrix Calculator" },
        description: { tr: "2x2 matris için determinant, iz ve seçilen skalerle çarpım sonucunu hesaplayın.", en: "Calculate determinant, trace, and scalar multiplication for a 2x2 matrix." },
        shortDescription: { tr: "2x2 matrisin temel değerlerini hesaplayın.", en: "Calculate basic 2x2 matrix values." },
        relatedCalculators: ["determinant-hesaplama", "denklem-cozucu", "polinom-hesaplama"],
        inputs: [numberInput("a11", "a11", "a11", 1), numberInput("a12", "a12", "a12", 2), numberInput("a21", "a21", "a21", 3), numberInput("a22", "a22", "a22", 4), numberInput("scalar", "Skaler", "Scalar", 2)],
        results: [numberResult("determinant", "Determinant", "Determinant"), numberResult("trace", "İz", "Trace"), textResult("scaledMatrix", "Skaler Çarpım", "Scaled Matrix")],
        formula: (v) => {
            const a11 = Number(v.a11) || 0;
            const a12 = Number(v.a12) || 0;
            const a21 = Number(v.a21) || 0;
            const a22 = Number(v.a22) || 0;
            const scalar = Number(v.scalar) || 0;
            return {
                determinant: a11 * a22 - a12 * a21,
                trace: a11 + a22,
                scaledMatrix: `[[${a11 * scalar}, ${a12 * scalar}], [${a21 * scalar}, ${a22 * scalar}]]`,
            };
        },
        seo: buildSeo({
            title: "Matris Hesaplama",
            metaDescription: "Matris hesaplama aracıyla 2x2 matrisin determinantını, izini ve skaler çarpımını hesaplayın.",
            intro: "Matrisler, sayıların satır ve sütun halinde düzenlenmiş yapılarıdır. Lineer cebir, denklem sistemleri ve dönüşümlerde kullanılır.",
            formula: "2x2 determinant = a11 × a22 - a12 × a21. İz = a11 + a22. Skaler çarpımda her eleman skalerle çarpılır.",
            example: "[[1,2],[3,4]] için determinant 1×4 - 2×3 = -2, iz 5 olur.",
            interpretation: "Determinant sıfırsa matris terslenemez; iz ise köşegen toplamını gösterir.",
            caution: "Bu araç temel 2x2 işlemler içindir. Daha büyük matrislerde determinant ve ters alma farklı adımlar gerektirir.",
            links: mathLinks,
            faq: [
                ["Matris nedir?", "Sayıların satır ve sütunlardan oluşan düzenli tablosudur."],
                ["2x2 determinant nasıl hesaplanır?", "Ana köşegen çarpımından diğer köşegen çarpımı çıkarılır."],
                ["Matris izi nedir?", "Ana köşegen elemanlarının toplamıdır."],
                ["Skaler çarpım ne demek?", "Matrisin her elemanının aynı sayı ile çarpılmasıdır."],
                ["Determinant sıfırsa ne olur?", "Matris tekil olur ve tersi yoktur."],
            ],
        }),
    },
    {
        id: "determinant",
        slug: "determinant-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Determinant Hesaplama", en: "Determinant Calculator" },
        h1: { tr: "Determinant Hesaplama", en: "Determinant Calculator" },
        description: { tr: "2x2 ve 3x3 matris için determinant değerini hesaplayın.", en: "Calculate determinant for 2x2 or 3x3 matrices." },
        shortDescription: { tr: "Matris determinantını bulun.", en: "Find matrix determinant." },
        relatedCalculators: ["matris-hesaplama", "denklem-cozucu", "ikinci-derece-denklem"],
        inputs: [
            selectInput("size", "Matris Boyutu", "Matrix Size", "2", [
                { label: { tr: "2x2", en: "2x2" }, value: "2" },
                { label: { tr: "3x3", en: "3x3" }, value: "3" },
            ]),
            numberInput("a11", "a11", "a11", 1), numberInput("a12", "a12", "a12", 2), numberInput("a13", "a13", "a13", 3),
            numberInput("a21", "a21", "a21", 4), numberInput("a22", "a22", "a22", 5), numberInput("a23", "a23", "a23", 6),
            numberInput("a31", "a31", "a31", 7), numberInput("a32", "a32", "a32", 8), numberInput("a33", "a33", "a33", 10),
        ],
        results: [numberResult("determinant", "Determinant", "Determinant")],
        formula: (v) => {
            const a11 = Number(v.a11) || 0; const a12 = Number(v.a12) || 0; const a13 = Number(v.a13) || 0;
            const a21 = Number(v.a21) || 0; const a22 = Number(v.a22) || 0; const a23 = Number(v.a23) || 0;
            const a31 = Number(v.a31) || 0; const a32 = Number(v.a32) || 0; const a33 = Number(v.a33) || 0;
            const determinant = v.size === "3"
                ? a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31)
                : a11 * a22 - a12 * a21;
            return { determinant };
        },
        seo: buildSeo({
            title: "Determinant Hesaplama",
            metaDescription: "Determinant hesaplama aracıyla 2x2 veya 3x3 matris determinantını temel formüllerle hesaplayın.",
            intro: "Determinant, kare matrislere ait özel bir sayıdır ve matrisin terslenebilirliği, alan/hacim ölçekleme etkisi gibi anlamlar taşır.",
            formula: "2x2 için det = ad - bc. 3x3 için kofaktör açılımı veya Sarrus mantığı kullanılır.",
            example: "[[1,2],[3,4]] determinantı 1×4 - 2×3 = -2 olur.",
            interpretation: "Determinant sıfırsa matris tekildir. Sıfırdan farklıysa matrisin tersi vardır.",
            caution: "Determinant yalnız kare matrisler için tanımlıdır. Bu araç 2x2 ve 3x3 boyutlarıyla sınırlıdır.",
            links: mathLinks,
            faq: [
                ["Determinant neyi gösterir?", "Kare matrisin terslenebilirliği ve dönüşüm ölçeği hakkında bilgi verir."],
                ["2x2 determinant formülü nedir?", "ad - bc formülü kullanılır."],
                ["3x3 determinant nasıl bulunur?", "Kofaktör açılımı veya Sarrus yöntemiyle hesaplanır."],
                ["Determinant sıfırsa ne olur?", "Matrisin tersi yoktur."],
                ["Dikdörtgen matris determinantı var mı?", "Hayır. Determinant kare matrisler için tanımlıdır."],
            ],
        }),
    },
    {
        id: "rational-number",
        slug: "rasyonel-sayi-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Rasyonel Sayı Hesaplama", en: "Rational Number Calculator" },
        h1: { tr: "Rasyonel Sayı Hesaplama", en: "Rational Number Calculator" },
        description: { tr: "Pay ve paydadan rasyonel sayıyı sadeleştirin, ondalık ve yüzde karşılığını hesaplayın.", en: "Simplify rational number and calculate decimal and percent." },
        shortDescription: { tr: "Rasyonel sayıyı sade, ondalık ve yüzde olarak görün.", en: "View rational number as simplified, decimal, and percent." },
        relatedCalculators: ["kesir-hesaplama", "kesir-sadelestirme", "oran-hesaplama"],
        inputs: [numberInput("numerator", "Pay", "Numerator", 18), numberInput("denominator", "Payda", "Denominator", 24)],
        results: [textResult("simplified", "Sade Hali", "Simplified"), numberResult("decimal", "Ondalık", "Decimal", "", 6), numberResult("percent", "Yüzde", "Percent", " %")],
        formula: (v) => {
            const numerator = Math.round(Number(v.numerator) || 0);
            const denominator = Math.round(Number(v.denominator) || 0);
            const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
            const divisor = denominator !== 0 ? gcd(numerator, denominator) || 1 : 1;
            return {
                simplified: denominator === 0 ? "Tanımsız" : `${numerator / divisor}/${denominator / divisor}`,
                decimal: denominator !== 0 ? numerator / denominator : 0,
                percent: denominator !== 0 ? (numerator / denominator) * 100 : 0,
            };
        },
        seo: buildSeo({
            title: "Rasyonel Sayı Hesaplama",
            metaDescription: "Rasyonel sayı hesaplama aracıyla pay ve paydayı girerek sade kesri, ondalık değeri ve yüzde karşılığı hesaplayın.",
            intro: "Rasyonel sayı, iki tam sayının oranı olarak yazılabilen sayıdır. Payda sıfır olmamalıdır.",
            formula: "Rasyonel sayı = pay / payda. Sadeleştirme için pay ve payda ortak bölenlerine bölünür.",
            example: "18/24 rasyonel sayısı 6 ile sadeleşerek 3/4 olur; ondalık karşılığı 0,75 ve yüzde karşılığı 75%'tir.",
            interpretation: "Sade biçim, aynı değeri daha küçük sayılarla ifade eder. Ondalık ve yüzde gösterim farklı bağlamlarda aynı değeri anlatır.",
            caution: "Payda sıfır olamaz. Negatif işaretin payda yerine payda veya kesrin başında tutarlı yazılması gerekir.",
            links: '<a href="/matematik-hesaplama/kesir-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir hesaplama</a>, <a href="/matematik-hesaplama/kesir-sadelestirme" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir sadeleştirme</a> ve <a href="/matematik-hesaplama/oran-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">oran hesaplama</a> ile birlikte kullanılabilir.',
            faq: [
                ["Rasyonel sayı nedir?", "Paydası sıfır olmayan iki tam sayının oranı olarak yazılabilen sayıdır."],
                ["Her kesir rasyonel midir?", "Payda sıfır değilse kesir rasyonel sayı belirtir."],
                ["Payda sıfır olabilir mi?", "Hayır. Sıfıra bölme tanımsızdır."],
                ["Ondalık gösterim ne işe yarar?", "Kesrin sayı doğrusu üzerindeki değerini daha sezgisel okumayı sağlar."],
                ["Yüzde karşılık nasıl bulunur?", "Kesir değeri 100 ile çarpılır."],
            ],
        }),
    },
    {
        id: "fraction",
        slug: "kesir-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Kesir Hesaplama", en: "Fraction Calculator" },
        h1: { tr: "Kesir Hesaplama", en: "Fraction Calculator" },
        description: { tr: "Bir kesri sadeleştirip ondalık ve yüzde karşılığını hesaplayın.", en: "Simplify a fraction and calculate decimal and percent." },
        shortDescription: { tr: "Kesri sade, ondalık ve yüzde olarak görün.", en: "View fraction as simplified, decimal, and percent." },
        relatedCalculators: ["kesir-sadelestirme", "kesir-toplama-cikarma", "rasyonel-sayi-hesaplama"],
        inputs: [numberInput("numerator", "Pay", "Numerator", 7), numberInput("denominator", "Payda", "Denominator", 8)],
        results: [textResult("simplified", "Sade Kesir", "Simplified Fraction"), numberResult("decimal", "Ondalık", "Decimal", "", 6), numberResult("percent", "Yüzde", "Percent", " %")],
        formula: (v) => {
            const numerator = Math.round(Number(v.numerator) || 0);
            const denominator = Math.round(Number(v.denominator) || 0);
            const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
            const divisor = denominator !== 0 ? gcd(numerator, denominator) || 1 : 1;
            return {
                simplified: denominator === 0 ? "Tanımsız" : `${numerator / divisor}/${denominator / divisor}`,
                decimal: denominator !== 0 ? numerator / denominator : 0,
                percent: denominator !== 0 ? (numerator / denominator) * 100 : 0,
            };
        },
        seo: buildSeo({
            title: "Kesir Hesaplama",
            metaDescription: "Kesir hesaplama aracıyla pay ve payda girerek kesrin sade halini, ondalık değerini ve yüzde karşılığını hesaplayın.",
            intro: "Kesir, bir bütünün kaç parçaya ayrıldığını ve kaç parçanın alındığını gösterir. Pay üstte, payda altta yer alır.",
            formula: "Kesir = pay / payda. Ondalık değer payın paydaya bölünmesiyle, yüzde değer ise sonucun 100 ile çarpılmasıyla bulunur.",
            example: "7/8 kesri ondalık olarak 0,875 ve yüzde olarak 87,5% eder.",
            interpretation: "Kesrin sade hali aynı miktarı daha küçük sayılarla gösterir. Ondalık değer karşılaştırmayı kolaylaştırır.",
            caution: "Payda sıfır olamaz. Farklı kesirleri toplarken önce ortak payda gerekir.",
            links: '<a href="/matematik-hesaplama/kesir-sadelestirme" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir sadeleştirme</a>, <a href="/matematik-hesaplama/kesir-toplama-cikarma" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir toplama çıkarma</a> ve <a href="/matematik-hesaplama/yuzde-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">yüzde hesaplama</a> ile birlikte kullanılabilir.',
            faq: [
                ["Pay nedir?", "Kesirde üstte yer alan ve alınan parça sayısını gösteren sayıdır."],
                ["Payda nedir?", "Bütünün kaç eşit parçaya bölündüğünü gösteren alttaki sayıdır."],
                ["Kesir nasıl sadeleştirilir?", "Pay ve payda ortak bölenlerine bölünür."],
                ["Bileşik kesir olabilir mi?", "Evet. Pay, paydadan büyükse bileşik kesir oluşur."],
                ["Kesir yüzdeye nasıl çevrilir?", "Pay paydaya bölünür ve sonuç 100 ile çarpılır."],
            ],
        }),
    },
    {
        id: "fraction-simplification",
        slug: "kesir-sadelestirme",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Kesir Sadeleştirme", en: "Fraction Simplification" },
        h1: { tr: "Kesir Sadeleştirme", en: "Fraction Simplification" },
        description: { tr: "Pay ve paydayı en büyük ortak bölenle sadeleştirin.", en: "Simplify numerator and denominator by greatest common divisor." },
        shortDescription: { tr: "Kesri en sade haline indirin.", en: "Reduce fraction to simplest form." },
        relatedCalculators: ["kesir-hesaplama", "ebob-ekok-hesaplama", "oran-hesaplama"],
        inputs: [numberInput("numerator", "Pay", "Numerator", 42), numberInput("denominator", "Payda", "Denominator", 56)],
        results: [numberResult("gcd", "EBOB", "GCD", "", 0), textResult("simplified", "Sade Hali", "Simplified")],
        formula: (v) => {
            const numerator = Math.round(Number(v.numerator) || 0);
            const denominator = Math.round(Number(v.denominator) || 0);
            const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
            const divisor = denominator !== 0 ? gcd(numerator, denominator) || 1 : 1;
            return { gcd: divisor, simplified: denominator === 0 ? "Tanımsız" : `${numerator / divisor}/${denominator / divisor}` };
        },
        seo: buildSeo({
            title: "Kesir Sadeleştirme",
            metaDescription: "Kesir sadeleştirme aracıyla pay ve paydayı EBOB değerine bölerek kesri en sade hale getirin.",
            intro: "Kesir sadeleştirme, kesrin değerini değiştirmeden pay ve paydayı küçültme işlemidir.",
            formula: "Pay ve payda EBOB değerine bölünür. Sade kesir = (pay / EBOB) / (payda / EBOB).",
            example: "42/56 için EBOB 14'tür. 42/14 = 3 ve 56/14 = 4; sade kesir 3/4 olur.",
            interpretation: "Sade kesir, aynı oranı en küçük tam sayılarla gösterir ve karşılaştırmayı kolaylaştırır.",
            caution: "Payda sıfır olamaz. Negatif işaret tek bir yerde, genellikle payda veya kesrin başında tutulmalıdır.",
            links: '<a href="/matematik-hesaplama/ebob-ekok-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">EBOB EKOK hesaplama</a>, <a href="/matematik-hesaplama/kesir-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir hesaplama</a> ve <a href="/matematik-hesaplama/oran-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">oran hesaplama</a> ile birlikte kullanılabilir.',
            faq: [
                ["Kesir sadeleştirme değeri değiştirir mi?", "Hayır. Kesrin gösterimi değişir, değeri aynı kalır."],
                ["EBOB neden kullanılır?", "Pay ve paydayı en büyük ortak bölenle bölmek kesri tek adımda en sade hale getirir."],
                ["Kesir ne zaman sadeleşmez?", "Pay ve paydanın ortak böleni 1 ise kesir zaten sadedir."],
                ["Negatif kesir nasıl sadeleşir?", "İşaret korunur, pay ve payda mutlak değer üzerinden sadeleştirilir."],
                ["Payda sıfır olursa ne olur?", "Kesir tanımsız olur."],
            ],
        }),
    },
    {
        id: "fraction-add-subtract",
        slug: "kesir-toplama-cikarma",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Kesir Toplama Çıkarma", en: "Fraction Add Subtract" },
        h1: { tr: "Kesir Toplama Çıkarma", en: "Fraction Add Subtract" },
        description: { tr: "İki kesri ortak payda mantığıyla toplayın veya çıkarın.", en: "Add or subtract two fractions using common denominator." },
        shortDescription: { tr: "İki kesrin toplamını veya farkını bulun.", en: "Find sum or difference of two fractions." },
        relatedCalculators: ["kesir-hesaplama", "kesir-sadelestirme", "ebob-ekok-hesaplama"],
        inputs: [
            numberInput("n1", "1. Pay", "1st Numerator", 1), numberInput("d1", "1. Payda", "1st Denominator", 3),
            selectInput("operation", "İşlem", "Operation", "add", [
                { label: { tr: "Toplama", en: "Add" }, value: "add" },
                { label: { tr: "Çıkarma", en: "Subtract" }, value: "subtract" },
            ]),
            numberInput("n2", "2. Pay", "2nd Numerator", 1), numberInput("d2", "2. Payda", "2nd Denominator", 6),
        ],
        results: [textResult("resultFraction", "Sonuç Kesir", "Result Fraction"), numberResult("decimal", "Ondalık", "Decimal", "", 6)],
        formula: (v) => {
            const n1 = Math.round(Number(v.n1) || 0);
            const d1 = Math.round(Number(v.d1) || 1);
            const n2 = Math.round(Number(v.n2) || 0);
            const d2 = Math.round(Number(v.d2) || 1);
            const rawNumerator = v.operation === "subtract" ? n1 * d2 - n2 * d1 : n1 * d2 + n2 * d1;
            const rawDenominator = d1 * d2;
            const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
            const divisor = rawDenominator !== 0 ? gcd(rawNumerator, rawDenominator) || 1 : 1;
            return {
                resultFraction: rawDenominator === 0 ? "Tanımsız" : `${rawNumerator / divisor}/${rawDenominator / divisor}`,
                decimal: rawDenominator !== 0 ? rawNumerator / rawDenominator : 0,
            };
        },
        seo: buildSeo({
            title: "Kesir Toplama Çıkarma",
            metaDescription: "Kesir toplama çıkarma aracıyla iki kesri ortak payda üzerinden toplayın, çıkarın ve sonucu sadeleştirin.",
            intro: "Kesir toplama ve çıkarma işlemlerinde paydalar eşit değilse önce ortak payda oluşturulur.",
            formula: "a/b + c/d = (ad + bc) / bd. Çıkarma için pay kısmında ad - bc kullanılır.",
            example: "1/3 + 1/6 için ortak payda 18 alınır; sonuç 9/18 yani 1/2 olur.",
            interpretation: "Sade sonuç, işlemden sonra oluşan kesrin en küçük eşdeğer gösterimidir.",
            caution: "Paydalar sıfır olamaz. Sonucu mutlaka sadeleştirerek okumak daha net karşılaştırma sağlar.",
            links: '<a href="/matematik-hesaplama/kesir-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir hesaplama</a>, <a href="/matematik-hesaplama/kesir-sadelestirme" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kesir sadeleştirme</a> ve <a href="/matematik-hesaplama/ebob-ekok-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">EBOB EKOK</a> ile birlikte kullanılabilir.',
            faq: [
                ["Paydalar eşit değilse ne yapılır?", "Önce ortak payda bulunur."],
                ["Kesir çıkarma formülü nedir?", "a/b - c/d = (ad - bc) / bd."],
                ["Sonuç neden sadeleştirilmeli?", "Aynı değeri daha anlaşılır ve küçük sayılarla gösterir."],
                ["Payda sıfır olabilir mi?", "Hayır. Payda sıfırsa kesir tanımsızdır."],
                ["Ortak payda için EKOK şart mı?", "En küçük ortak payda için EKOK kullanılır, ancak çarpım paydası da çalışır ve sonra sadeleşir."],
            ],
        }),
    },
    {
        id: "base-converter",
        slug: "sayi-tabani-donusturme",
        category: "matematik-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Sayı Tabanı Dönüştürme", en: "Base Converter" },
        h1: { tr: "Sayı Tabanı Dönüştürme", en: "Base Converter" },
        description: { tr: "2 ile 36 tabanları arasında sayı dönüştürün.", en: "Convert numbers between bases 2 and 36." },
        shortDescription: { tr: "İkilik, onluk, onaltılık ve diğer tabanları dönüştürün.", en: "Convert binary, decimal, hexadecimal, and more." },
        relatedCalculators: ["ebob-ekok-hesaplama", "us-kuvvet-karekok", "oran-hesaplama"],
        inputs: [
            textInput("value", "Sayı", "Value", "101010"),
            numberInput("fromBase", "Mevcut Taban", "From Base", 2, { min: 2, max: 36 }),
            numberInput("toBase", "Hedef Taban", "To Base", 10, { min: 2, max: 36 }),
        ],
        results: [numberResult("decimalValue", "Onluk Değer", "Decimal Value", "", 0), textResult("convertedValue", "Dönüştürülmüş Değer", "Converted Value")],
        formula: (v) => {
            const fromBase = Math.min(36, Math.max(2, Math.round(Number(v.fromBase) || 10)));
            const toBase = Math.min(36, Math.max(2, Math.round(Number(v.toBase) || 10)));
            const decimalValue = parseInt(String(v.value ?? "0").trim(), fromBase);
            const safeDecimal = Number.isFinite(decimalValue) ? decimalValue : 0;
            return { decimalValue: safeDecimal, convertedValue: safeDecimal.toString(toBase).toUpperCase() };
        },
        seo: buildSeo({
            title: "Sayı Tabanı Dönüştürme",
            metaDescription: "Sayı tabanı dönüştürme aracıyla ikilik, sekizlik, onluk, onaltılık ve 2-36 arası tabanlar arasında dönüşüm yapın.",
            intro: "Sayı tabanı, bir sayının hangi rakam sistemiyle yazıldığını gösterir. Bilgisayar biliminde 2, 10 ve 16 tabanları sık kullanılır.",
            formula: "Önce sayı mevcut tabandan onluk değere çevrilir; ardından hedef tabanda tekrar yazılır.",
            example: "101010₂ sayısı onluk tabanda 42 eder. 42 onaltılık tabanda 2A olarak yazılır.",
            interpretation: "Dönüştürülmüş değer aynı sayısal büyüklüğün farklı tabandaki gösterimidir.",
            caution: "Bir tabanda kullanılabilecek rakamlar tabandan küçük olmalıdır. Örneğin ikilik tabanda yalnız 0 ve 1 geçerlidir.",
            links: mathLinks,
            faq: [
                ["İkilik taban nedir?", "Yalnız 0 ve 1 rakamlarının kullanıldığı tabandır."],
                ["Onaltılık tabanda hangi semboller kullanılır?", "0-9 ve A-F sembolleri kullanılır."],
                ["Taban 36 neden sınır?", "Rakamlar ve Latin harfleriyle pratik gösterim 36 sembole kadar gider."],
                ["Aynı sayı farklı tabanda değişir mi?", "Sayının değeri değişmez; sadece yazılış biçimi değişir."],
                ["Geçersiz rakam girersem ne olur?", "Dönüşüm beklenmeyen sonuç verebilir; rakamların seçilen tabana uygun olması gerekir."],
            ],
        }),
    },
    {
        id: "yks-ranking-estimate",
        slug: "yks-siralama-tahmini",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "YKS Sıralama Tahmini", en: "YKS Ranking Estimate" },
        h1: { tr: "YKS Sıralama Tahmini", en: "YKS Ranking Estimate" },
        description: { tr: "Kendi referans puan-sıralama verinizi kullanarak YKS sıralama tahmini oluşturun.", en: "Estimate YKS ranking using your own reference score/rank data." },
        shortDescription: { tr: "Referans puan ve sıralamadan yaklaşık YKS sıra bandı üretin.", en: "Estimate YKS rank band from reference data." },
        relatedCalculators: ["yks-puan-hesaplama", "tyt-puan-hesaplama", "obp-puan-hesaplama", "universite-taban-puanlari"],
        inputs: [
            numberInput("score", "Tahmini YKS Puanınız", "Estimated YKS Score", 420),
            numberInput("referenceScore", "Referans Puan", "Reference Score", 400),
            numberInput("referenceRank", "Referans Sıralama", "Reference Rank", 80000),
            numberInput("impactPerPoint", "Puan Başına Tahmini Etki", "Estimated Impact Per Point", 2, { suffix: " %" }),
        ],
        results: [
            numberResult("estimatedRank", "Tahmini Sıralama", "Estimated Rank", "", 0),
            numberResult("lowerBand", "İyimser Bant", "Optimistic Band", "", 0),
            numberResult("upperBand", "Temkinli Bant", "Conservative Band", "", 0),
            textResult("note", "Not", "Note"),
        ],
        formula: (v) => {
            const score = Number(v.score) || 0;
            const referenceScore = Number(v.referenceScore) || 0;
            const referenceRank = Math.max(1, Number(v.referenceRank) || 1);
            const impactPerPoint = Math.max(0, Number(v.impactPerPoint) || 0) / 100;
            const scoreDelta = score - referenceScore;
            const estimatedRank = Math.max(1, referenceRank * Math.pow(1 - Math.min(0.95, impactPerPoint), scoreDelta));
            return {
                estimatedRank,
                lowerBand: estimatedRank * 0.85,
                upperBand: estimatedRank * 1.15,
                note: "Tahmini sonuçtur; resmi sıralama aday dağılımı ve ÖSYM sonuçlarına göre değişir.",
            };
        },
        seo: buildSeo({
            title: "YKS Sıralama Tahmini",
            metaDescription: "YKS sıralama tahmini aracıyla kendi referans puan-sıralama verinizi kullanarak yaklaşık başarı sırası bandı oluşturun.",
            intro: "YKS sıralaması resmi aday dağılımı açıklanmadan kesin bilinemez. Bu araç kullanıcının seçtiği referans puan ve sıralamadan yaklaşık bir bant üretir.",
            formula: "Referans sıralama, puan farkı ve kullanıcı tarafından girilen puan başına etki varsayımıyla ölçeklenir.",
            example: "400 puanda 80.000 referans sırası varken 420 puan için puan başına 2% etki seçilirse tahmini sıra yaklaşık 53.000 bandına yaklaşabilir.",
            interpretation: "Sonuç kesin sıra değil, tercih öncesi planlama bandıdır. İyimser ve temkinli aralıklar belirsizliği göstermek için verilir.",
            caution: "Puan-sıralama ilişkisi her yıl değişir. Resmi ÖSYM sonuçları ve tercih kılavuzu nihai kaynaktır.",
            links: educationLinks,
            faq: [
                ["Bu araç resmi YKS sıralaması verir mi?", "Hayır. Yalnız referans veriye dayalı tahmini sıra bandı üretir."],
                ["Referans puan nereden alınmalı?", "Geçmiş yıl taban puanı, deneme analizi veya güvenilir tercih verisi kullanılabilir."],
                ["Puan başına etki ne demek?", "Bir puanlık farkın sıralamayı yaklaşık yüzde kaç oynatacağını temsil eden kullanıcı varsayımıdır."],
                ["Sıralama neden bant olarak veriliyor?", "Çünkü aday dağılımı ve sınav zorluğu kesin bilinmeden tek sayı yanıltıcı olabilir."],
                ["Hangi puan türü için kullanılabilir?", "Sayısal, eşit ağırlık, sözel veya dil için ayrı referans girerek kullanılabilir."],
            ],
        }),
    },
    {
        id: "education-duration",
        slug: "egitim-suresi-hesaplama",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Eğitim Süresi Hesaplama", en: "Education Duration Calculator" },
        h1: { tr: "Eğitim Süresi Hesaplama", en: "Education Duration Calculator" },
        description: { tr: "Başlangıç ve bitiş tarihleri arasında kalan eğitim süresini gün, hafta ve ay olarak hesaplayın.", en: "Calculate education duration between start and end dates." },
        shortDescription: { tr: "Eğitim takvimindeki süreyi gün, hafta ve ay olarak görün.", en: "See duration in days, weeks, and months." },
        relatedCalculators: ["ders-calisma-plani", "ders-calisma-saati", "kac-gun-kaldi-hesaplama"],
        inputs: [
            { id: "startDate", name: { tr: "Başlangıç Tarihi", en: "Start Date" }, type: "date", defaultValue: "2026-09-01", required: true },
            { id: "endDate", name: { tr: "Bitiş Tarihi", en: "End Date" }, type: "date", defaultValue: "2027-06-15", required: true },
        ],
        results: [numberResult("days", "Gün", "Days", " gün", 0), numberResult("weeks", "Hafta", "Weeks", " hafta"), numberResult("monthsApprox", "Yaklaşık Ay", "Approx. Months", " ay")],
        formula: (v) => {
            const start = new Date(String(v.startDate || ""));
            const end = new Date(String(v.endDate || ""));
            const days = Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())
                ? 0
                : Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
            return { days, weeks: days / 7, monthsApprox: days / 30.4375 };
        },
        seo: buildSeo({
            title: "Eğitim Süresi Hesaplama",
            metaDescription: "Eğitim süresi hesaplama aracıyla okul, kurs veya sınav hazırlığı tarihleri arasındaki gün, hafta ve yaklaşık ay süresini bulun.",
            intro: "Eğitim süresi planlaması, dönem takvimi, kurs programı ve sınav hazırlık aralığını sayısal hale getirir.",
            formula: "Bitiş tarihi ile başlangıç tarihi arasındaki gün farkı alınır; hafta için 7'ye, yaklaşık ay için 30,4375'e bölünür.",
            example: "1 Eylül 2026 ile 15 Haziran 2027 arasında yaklaşık 287 gün, 41 hafta ve 9,43 ay vardır.",
            interpretation: "Sonuç çalışma planı, ödeme planı veya kurs takibi için takvimsel süreyi gösterir.",
            caution: "Resmi okul tatilleri, ara tatiller veya kurum özel günleri ayrıca düşülmez; sonuç takvim farkıdır.",
            links: educationLinks,
            faq: [
                ["Eğitim süresi iş günü olarak mı hesaplanır?", "Hayır. Bu araç takvim günü farkını hesaplar."],
                ["Ara tatiller düşülür mü?", "Hayır. Tatil ve izinleri ayrıca manuel değerlendirmek gerekir."],
                ["Ay hesabı neden yaklaşık?", "Ayların gün sayısı farklı olduğu için ortalama ay uzunluğu kullanılır."],
                ["Kurs süresi için kullanılabilir mi?", "Evet. Başlangıç ve bitiş tarihi olan her eğitim programı için kullanılabilir."],
                ["Bitiş tarihi önceyse ne olur?", "Sonuç negatif gösterilmez; süre sıfır kabul edilir."],
            ],
        }),
    },
    {
        id: "study-plan",
        slug: "ders-calisma-plani",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Ders Çalışma Planı Hesaplama", en: "Study Plan Calculator" },
        h1: { tr: "Ders Çalışma Planı Hesaplama", en: "Study Plan Calculator" },
        description: { tr: "Haftalık çalışma günleri, günlük süre ve ders sayısına göre ders başına çalışma süresi planlayın.", en: "Plan study time per subject from weekly days and daily hours." },
        shortDescription: { tr: "Ders başına haftalık çalışma süresini görün.", en: "See weekly study time per subject." },
        relatedCalculators: ["ders-calisma-saati", "test-basari-orani", "yks-puan-hesaplama"],
        inputs: [numberInput("studyDays", "Haftalık Çalışma Günü", "Study Days", 5, { min: 1, max: 7 }), numberInput("dailyHours", "Günlük Saat", "Daily Hours", 3), numberInput("subjectCount", "Ders Sayısı", "Subject Count", 6)],
        results: [numberResult("weeklyHours", "Haftalık Toplam", "Weekly Total", " saat"), numberResult("hoursPerSubject", "Ders Başına Haftalık", "Weekly Per Subject", " saat"), numberResult("minutesPerDayPerSubject", "Ders Başına Günlük", "Daily Per Subject", " dk")],
        formula: (v) => {
            const studyDays = Math.max(1, Number(v.studyDays) || 1);
            const dailyHours = Math.max(0, Number(v.dailyHours) || 0);
            const subjectCount = Math.max(1, Number(v.subjectCount) || 1);
            const weeklyHours = studyDays * dailyHours;
            return { weeklyHours, hoursPerSubject: weeklyHours / subjectCount, minutesPerDayPerSubject: (dailyHours * 60) / subjectCount };
        },
        seo: buildSeo({
            title: "Ders Çalışma Planı Hesaplama",
            metaDescription: "Ders çalışma planı hesaplama aracıyla haftalık çalışma sürenizi ders sayısına bölerek ders başına saat planı oluşturun.",
            intro: "Ders çalışma planı, haftalık zamanı görünür hale getirerek hangi derse ne kadar süre ayrılacağını dengeler.",
            formula: "Haftalık çalışma saati = çalışma günü × günlük saat. Ders başına süre = haftalık saat / ders sayısı.",
            example: "Haftada 5 gün ve günde 3 saat çalışan öğrenci 15 saat üretir; 6 ders için ders başına 2,5 saat düşer.",
            interpretation: "Sonuç eşit dağılımı gösterir. Zayıf derslere daha fazla, güçlü derslere daha az süre ayırarak plan kişiselleştirilebilir.",
            caution: "Tek başına süre yeterli değildir; tekrar, soru çözümü ve deneme analizi de plana eklenmelidir.",
            links: educationLinks,
            faq: [
                ["Ders çalışma planı eşit mi olmalı?", "Başlangıç için eşit dağılım iyidir, ancak zayıf dersler daha fazla süre isteyebilir."],
                ["Günde kaç saat çalışmalıyım?", "Hedefe, sınıf düzeyine ve sürdürülebilirliğe bağlıdır; düzenli süre daha önemlidir."],
                ["Molalar dahil mi?", "Bu araç net çalışma süresi varsayar; molalar ayrıca planlanmalıdır."],
                ["Haftalık plan neden önemli?", "Çünkü ders yükünü günlere yayarak son dakika sıkışmasını azaltır."],
                ["Deneme sınavı günü nasıl eklenir?", "Deneme ve analiz için ayrı bir ders gibi süre ayırabilirsiniz."],
            ],
        }),
    },
    {
        id: "test-success-rate",
        slug: "test-basari-orani",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Test Başarı Oranı Hesaplama", en: "Test Success Rate Calculator" },
        h1: { tr: "Test Başarı Oranı Hesaplama", en: "Test Success Rate Calculator" },
        description: { tr: "Soru sayısı, doğru ve yanlış bilgisiyle başarı oranını, neti ve doğruluk oranını hesaplayın.", en: "Calculate success rate, net, and accuracy from test results." },
        shortDescription: { tr: "Test sonucunu yüzde, net ve doğruluk olarak görün.", en: "See test result as percent, net, and accuracy." },
        relatedCalculators: ["net-hesaplama", "kpss-puan-hesaplama", "yks-puan-hesaplama"],
        inputs: [numberInput("questionCount", "Soru Sayısı", "Question Count", 40), numberInput("correct", "Doğru", "Correct", 30), numberInput("wrong", "Yanlış", "Wrong", 8), numberInput("wrongPenalty", "Kaç Yanlış 1 Doğruyu Götürür?", "Wrong Penalty", 4)],
        results: [numberResult("blank", "Boş", "Blank", "", 0), numberResult("net", "Net", "Net"), numberResult("successRate", "Başarı Oranı", "Success Rate", " %"), numberResult("accuracy", "Doğruluk Oranı", "Accuracy", " %")],
        formula: (v) => {
            const questionCount = Math.max(0, Number(v.questionCount) || 0);
            const correct = Math.max(0, Number(v.correct) || 0);
            const wrong = Math.max(0, Number(v.wrong) || 0);
            const wrongPenalty = Math.max(1, Number(v.wrongPenalty) || 4);
            const blank = Math.max(0, questionCount - correct - wrong);
            const net = correct - wrong / wrongPenalty;
            return {
                blank,
                net,
                successRate: questionCount > 0 ? (net / questionCount) * 100 : 0,
                accuracy: correct + wrong > 0 ? (correct / (correct + wrong)) * 100 : 0,
            };
        },
        seo: buildSeo({
            title: "Test Başarı Oranı Hesaplama",
            metaDescription: "Test başarı oranı hesaplama aracıyla doğru, yanlış ve soru sayısından netinizi, başarı yüzdenizi ve doğruluk oranınızı hesaplayın.",
            intro: "Test başarı oranı, deneme veya konu testlerinde performansı yüzdelik olarak okumayı sağlar.",
            formula: "Net = doğru - yanlış / ceza katsayısı. Başarı oranı = net / toplam soru × 100.",
            example: "40 soruda 30 doğru ve 8 yanlış, 4 yanlış 1 doğru kuralıyla 28 net ve 70% başarı oranı verir.",
            interpretation: "Başarı oranı testin genel performansını, doğruluk oranı ise işaretlenen sorulardaki isabeti gösterir.",
            caution: "Farklı sınavlarda yanlış cezası değişebilir. Güncel sınav kılavuzu esas alınmalıdır.",
            links: educationLinks,
            faq: [
                ["Net nasıl hesaplanır?", "Doğru sayısından yanlış sayısının ceza katsayısına bölünmüş hali çıkarılır."],
                ["Başarı oranı ile doğruluk oranı aynı mı?", "Hayır. Başarı oranı toplam soruya, doğruluk oranı işaretlenen sorulara bakar."],
                ["Boş sorular neti etkiler mi?", "Hayır. Boş sorular nete doğrudan etki etmez."],
                ["Yanlış cezası değiştirilebilir mi?", "Evet. Alanı sınav kuralına göre güncelleyebilirsiniz."],
                ["Bu sonuç resmi puan mıdır?", "Hayır. Deneme performansı için tahmini bir göstergedir."],
            ],
        }),
    },
    {
        id: "study-hours",
        slug: "ders-calisma-saati",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Ders Çalışma Saati Hesaplama", en: "Study Hours Calculator" },
        h1: { tr: "Ders Çalışma Saati Hesaplama", en: "Study Hours Calculator" },
        description: { tr: "Konu sayısı, konu başı süre ve hedef güne göre günlük çalışma saati ihtiyacını hesaplayın.", en: "Calculate daily study hours from topics, minutes per topic, and days." },
        shortDescription: { tr: "Hedefe göre günlük çalışma süresini bulun.", en: "Find required daily study time." },
        relatedCalculators: ["ders-calisma-plani", "egitim-suresi-hesaplama", "test-basari-orani"],
        inputs: [numberInput("topicCount", "Konu Sayısı", "Topic Count", 48), numberInput("minutesPerTopic", "Konu Başına Dakika", "Minutes per Topic", 45), numberInput("targetDays", "Hedef Gün", "Target Days", 30), numberInput("revisionPercent", "Tekrar Payı", "Revision Percent", 25, { suffix: " %" })],
        results: [numberResult("totalHours", "Toplam Saat", "Total Hours", " saat"), numberResult("dailyHours", "Günlük Gerekli Saat", "Daily Required Hours", " saat"), numberResult("weeklyHours", "Haftalık Gerekli Saat", "Weekly Required Hours", " saat")],
        formula: (v) => {
            const topicCount = Math.max(0, Number(v.topicCount) || 0);
            const minutesPerTopic = Math.max(0, Number(v.minutesPerTopic) || 0);
            const targetDays = Math.max(1, Number(v.targetDays) || 1);
            const revisionPercent = Math.max(0, Number(v.revisionPercent) || 0) / 100;
            const totalHours = (topicCount * minutesPerTopic / 60) * (1 + revisionPercent);
            return { totalHours, dailyHours: totalHours / targetDays, weeklyHours: totalHours / targetDays * 7 };
        },
        seo: buildSeo({
            title: "Ders Çalışma Saati Hesaplama",
            metaDescription: "Ders çalışma saati hesaplama aracıyla konu sayısı ve hedef güne göre günlük ve haftalık çalışma süresi ihtiyacınızı hesaplayın.",
            intro: "Ders çalışma saati hesabı, tamamlanacak konu yükünü takvime bölerek gerçekçi günlük hedefler oluşturur.",
            formula: "Toplam saat = konu sayısı × konu başı dakika / 60 × tekrar payı. Günlük saat = toplam saat / hedef gün.",
            example: "48 konu, konu başı 45 dakika ve 25% tekrar payıyla toplam 45 saat gerekir; 30 güne bölünce günlük 1,5 saat çıkar.",
            interpretation: "Günlük saat hedefi sürdürülebilir değilse hedef gün artırılmalı veya konu önceliği yeniden düzenlenmelidir.",
            caution: "Süre hesabı kaliteyi garanti etmez. Soru çözümü, tekrar ve deneme analizi ayrı zaman ister.",
            links: educationLinks,
            faq: [
                ["Konu başı süre nasıl seçilmeli?", "Konu zorluğuna göre geçmiş çalışma deneyiminizden ortalama süre seçebilirsiniz."],
                ["Tekrar payı neden var?", "Öğrenilen konuların unutulmaması için tekrar ve pekiştirme zamanı gerekir."],
                ["Günlük süre çok yüksek çıkarsa ne yapmalı?", "Hedef tarihi uzatın veya öncelikli konuları ayırın."],
                ["Bu süre molaları içerir mi?", "Hayır. Net çalışma süresi olarak düşünülmelidir."],
                ["Haftalık saat neden gösteriliyor?", "Programı günlere daha esnek yaymak için haftalık toplam faydalıdır."],
            ],
        }),
    },
    {
        id: "student-budget",
        slug: "ogrenci-butce-hesaplama",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Öğrenci Bütçe Hesaplama", en: "Student Budget Calculator" },
        h1: { tr: "Öğrenci Bütçe Hesaplama", en: "Student Budget Calculator" },
        description: { tr: "Aylık gelir ve gider kalemleriyle öğrenci bütçesi fazlasını veya açığını hesaplayın.", en: "Calculate student budget surplus or gap from monthly income and expenses." },
        shortDescription: { tr: "Aylık öğrenci bütçenizi planlayın.", en: "Plan monthly student budget." },
        relatedCalculators: ["ogrenci-yasam-maliyeti", "burs-hesaplama", "yurt-maliyeti"],
        inputs: [
            numberInput("income", "Aylık Gelir", "Monthly Income", 12000, { suffix: " ₺" }),
            numberInput("rent", "Kira/Yurt", "Rent/Dorm", 5000, { suffix: " ₺" }),
            numberInput("food", "Yemek", "Food", 3500, { suffix: " ₺" }),
            numberInput("transport", "Ulaşım", "Transport", 900, { suffix: " ₺" }),
            numberInput("education", "Eğitim/Kitap", "Education/Books", 800, { suffix: " ₺" }),
            numberInput("other", "Diğer", "Other", 1200, { suffix: " ₺" }),
        ],
        results: [numberResult("totalExpense", "Toplam Gider", "Total Expense", " ₺"), numberResult("balance", "Aylık Bakiye", "Monthly Balance", " ₺"), textResult("budgetNote", "Bütçe Yorumu", "Budget Note")],
        formula: (v) => {
            const income = Math.max(0, Number(v.income) || 0);
            const totalExpense = ["rent", "food", "transport", "education", "other"].reduce((sum, key) => sum + Math.max(0, Number(v[key]) || 0), 0);
            const balance = income - totalExpense;
            return { totalExpense, balance, budgetNote: balance >= 0 ? "Bütçe fazla veriyor." : "Bütçe açık veriyor; gelir veya gider kalemleri gözden geçirilmeli." };
        },
        seo: buildSeo({
            title: "Öğrenci Bütçe Hesaplama",
            metaDescription: "Öğrenci bütçe hesaplama aracıyla aylık gelir, yurt/kira, yemek, ulaşım ve eğitim giderlerini girerek bütçe açığını veya fazlasını görün.",
            intro: "Öğrenci bütçesi, sınırlı gelirle temel yaşam ve eğitim giderlerini dengelemek için pratik bir aylık plan sağlar.",
            formula: "Aylık bakiye = aylık gelir - toplam aylık gider.",
            example: "12.000 TL gelir ve 11.400 TL gider varsa aylık bakiye 600 TL fazla verir.",
            interpretation: "Pozitif bakiye tasarruf alanını, negatif bakiye ise ek gelir veya gider azaltma ihtiyacını gösterir.",
            caution: "Fiyatlar şehir, okul ve yaşam biçimine göre değişir. Sonuç planlama amaçlıdır.",
            links: educationLinks,
            faq: [
                ["Öğrenci bütçesinde hangi giderler olmalı?", "Kira/yurt, yemek, ulaşım, eğitim, kitap, iletişim ve sosyal giderler dikkate alınmalıdır."],
                ["Bütçe açığı ne demek?", "Giderlerin gelirden fazla olmasıdır."],
                ["Burs gelir olarak yazılır mı?", "Evet. Düzenli burslar aylık gelir içinde gösterilebilir."],
                ["Tek seferlik giderler nasıl ele alınır?", "Yıllık tutarı aylığa bölerek daha dengeli izleyebilirsiniz."],
                ["Sonuç kesin maliyet midir?", "Hayır. Kişisel alışkanlıklar ve şehir fiyatları sonucu değiştirir."],
            ],
        }),
    },
    {
        id: "scholarship",
        slug: "burs-hesaplama",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Burs Hesaplama", en: "Scholarship Calculator" },
        h1: { tr: "Burs Hesaplama", en: "Scholarship Calculator" },
        description: { tr: "Aylık ihtiyaç, mevcut destek ve burs tutarıyla kalan finansman açığını hesaplayın.", en: "Calculate remaining funding gap from need, support, and scholarship amount." },
        shortDescription: { tr: "Bursun aylık ihtiyacı ne kadar karşıladığını görün.", en: "See how much scholarship covers need." },
        relatedCalculators: ["ogrenci-butce-hesaplama", "ogrenci-yasam-maliyeti", "egitim-kredisi"],
        inputs: [numberInput("monthlyNeed", "Aylık İhtiyaç", "Monthly Need", 14000, { suffix: " ₺" }), numberInput("familySupport", "Aile/Destek Geliri", "Family Support", 6000, { suffix: " ₺" }), numberInput("scholarship", "Burs Tutarı", "Scholarship", 4000, { suffix: " ₺" }), numberInput("months", "Ay Sayısı", "Months", 9)],
        results: [numberResult("coveredAmount", "Karşılanan Tutar", "Covered Amount", " ₺"), numberResult("monthlyGap", "Aylık Açık", "Monthly Gap", " ₺"), numberResult("periodGap", "Dönem Açığı", "Period Gap", " ₺"), numberResult("coverageRate", "Karşılama Oranı", "Coverage Rate", " %")],
        formula: (v) => {
            const monthlyNeed = Math.max(0, Number(v.monthlyNeed) || 0);
            const familySupport = Math.max(0, Number(v.familySupport) || 0);
            const scholarship = Math.max(0, Number(v.scholarship) || 0);
            const months = Math.max(1, Number(v.months) || 1);
            const coveredAmount = familySupport + scholarship;
            const monthlyGap = Math.max(0, monthlyNeed - coveredAmount);
            return { coveredAmount, monthlyGap, periodGap: monthlyGap * months, coverageRate: monthlyNeed > 0 ? coveredAmount / monthlyNeed * 100 : 0 };
        },
        seo: buildSeo({
            title: "Burs Hesaplama",
            metaDescription: "Burs hesaplama aracıyla aylık öğrenci ihtiyacınızın burs ve desteklerle ne kadar karşılandığını ve kalan açığı hesaplayın.",
            intro: "Burs hesabı, öğrencinin aylık ihtiyacının düzenli desteklerle ne ölçüde kapandığını gösterir.",
            formula: "Aylık açık = aylık ihtiyaç - aile desteği - burs tutarı. Dönem açığı = aylık açık × ay sayısı.",
            example: "14.000 TL ihtiyaç, 6.000 TL aile desteği ve 4.000 TL burs varsa aylık açık 4.000 TL olur.",
            interpretation: "Karşılama oranı 100%'e yaklaştıkça burs ve destekler temel ihtiyacı daha fazla kapatır.",
            caution: "Burs süreleri, kesilme koşulları ve başarı şartları kuruma göre değişebilir. Resmi burs sözleşmesi esas alınmalıdır.",
            links: educationLinks,
            faq: [
                ["Burs açığı nedir?", "Aylık ihtiyacın burs ve desteklerle karşılanmayan kısmıdır."],
                ["Burs dönemlik mi aylık mı girilmeli?", "Bu araç aylık burs tutarıyla çalışır."],
                ["KYK veya özel burs birlikte yazılır mı?", "Düzenli tüm burslar toplam burs tutarına eklenebilir."],
                ["Karşılama oranı nasıl hesaplanır?", "Toplam destek aylık ihtiyaca bölünür ve 100 ile çarpılır."],
                ["Sonuç kesin hak ediş midir?", "Hayır. Burs hakkı ve devam koşulları ilgili kurum tarafından belirlenir."],
            ],
        }),
    },
    {
        id: "education-loan",
        slug: "egitim-kredisi",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Eğitim Kredisi Hesaplama", en: "Education Loan Calculator" },
        h1: { tr: "Eğitim Kredisi Hesaplama", en: "Education Loan Calculator" },
        description: { tr: "Kredi tutarı, aylık oran ve vadeyle eğitim kredisi taksitini ve toplam geri ödemeyi hesaplayın.", en: "Calculate education loan installment and total repayment." },
        shortDescription: { tr: "Eğitim kredisi taksit senaryosu oluşturun.", en: "Create education loan installment scenario." },
        relatedCalculators: ["ogrenci-butce-hesaplama", "burs-hesaplama", "kredi-taksit-hesaplama"],
        inputs: [numberInput("amount", "Kredi Tutarı", "Loan Amount", 100000, { suffix: " ₺" }), numberInput("monthlyRate", "Aylık Oran", "Monthly Rate", 3, { suffix: " %" }), numberInput("months", "Vade", "Term", 24, { suffix: " ay" })],
        results: [numberResult("installment", "Aylık Taksit", "Installment", " ₺"), numberResult("totalPayment", "Toplam Geri Ödeme", "Total Payment", " ₺"), numberResult("totalInterest", "Toplam Maliyet", "Total Cost", " ₺")],
        formula: (v) => {
            const amount = Math.max(0, Number(v.amount) || 0);
            const monthlyRate = Math.max(0, Number(v.monthlyRate) || 0) / 100;
            const months = Math.max(1, Number(v.months) || 1);
            const installment = monthlyRate > 0
                ? amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
                : amount / months;
            const totalPayment = installment * months;
            return { installment, totalPayment, totalInterest: totalPayment - amount };
        },
        seo: buildSeo({
            title: "Eğitim Kredisi Hesaplama",
            metaDescription: "Eğitim kredisi hesaplama aracıyla kredi tutarı, aylık oran ve vadeye göre taksit, toplam geri ödeme ve maliyet senaryosu oluşturun.",
            intro: "Eğitim kredisi hesabı, öğrenim giderini borçlanma yoluyla karşılamadan önce aylık yükü görmeye yarar.",
            formula: "Taksit = P × [r(1+r)^n] / [(1+r)^n - 1]. Oran yoksa tutar vadeye bölünür.",
            example: "100.000 TL, aylık 3% ve 24 ay vadede aylık taksit yaklaşık 5.904 TL olur.",
            interpretation: "Toplam geri ödeme, kredinin dönem sonunda bütçeye getireceği toplam yükü gösterir.",
            caution: "Banka oranları ve masrafları değişebilir. Bu araç resmi kredi teklifi değil, tahmini planlama sonucudur.",
            links: educationLinks,
            faq: [
                ["Eğitim kredisi taksiti nasıl hesaplanır?", "Kredi tutarı, aylık oran ve vade anüite formülüyle hesaplanır."],
                ["Oran değişirse sonuç değişir mi?", "Evet. Aylık oran küçük görünse bile uzun vadede toplam maliyeti artırır."],
                ["Masraf dahil mi?", "Hayır. Dosya masrafı veya sigorta varsa ayrıca eklenmelidir."],
                ["Faizsiz senaryo yapılabilir mi?", "Aylık oranı 0 girerseniz tutar vadeye eşit bölünür."],
                ["Sonuç resmi teklif midir?", "Hayır. Banka veya kurum teklifinin yerine geçmez."],
            ],
        }),
    },
    {
        id: "dorm-cost",
        slug: "yurt-maliyeti",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Yurt Maliyeti Hesaplama", en: "Dorm Cost Calculator" },
        h1: { tr: "Yurt Maliyeti Hesaplama", en: "Dorm Cost Calculator" },
        description: { tr: "Aylık yurt ücreti, depozito, yemek ve ulaşım ekleriyle dönemlik yurt maliyetini hesaplayın.", en: "Calculate dorm cost with monthly fee, deposit, food, and transport." },
        shortDescription: { tr: "Yurt yaşamının aylık ve dönemlik maliyetini görün.", en: "See monthly and term dorm cost." },
        relatedCalculators: ["ogrenci-butce-hesaplama", "ogrenci-yasam-maliyeti", "okul-gider-hesaplama"],
        inputs: [numberInput("monthlyDorm", "Aylık Yurt Ücreti", "Monthly Dorm Fee", 6500, { suffix: " ₺" }), numberInput("deposit", "Depozito/Kayıt", "Deposit", 6500, { suffix: " ₺" }), numberInput("foodExtra", "Ek Yemek", "Food Extra", 2500, { suffix: " ₺" }), numberInput("transport", "Ulaşım", "Transport", 700, { suffix: " ₺" }), numberInput("months", "Ay", "Months", 9)],
        results: [numberResult("monthlyTotal", "Aylık Toplam", "Monthly Total", " ₺"), numberResult("termTotal", "Dönem Toplamı", "Term Total", " ₺"), numberResult("averageMonthlyWithDeposit", "Depozito Dahil Aylık Ortalama", "Average Monthly incl. Deposit", " ₺")],
        formula: (v) => {
            const monthlyDorm = Math.max(0, Number(v.monthlyDorm) || 0);
            const deposit = Math.max(0, Number(v.deposit) || 0);
            const foodExtra = Math.max(0, Number(v.foodExtra) || 0);
            const transport = Math.max(0, Number(v.transport) || 0);
            const months = Math.max(1, Number(v.months) || 1);
            const monthlyTotal = monthlyDorm + foodExtra + transport;
            const termTotal = monthlyTotal * months + deposit;
            return { monthlyTotal, termTotal, averageMonthlyWithDeposit: termTotal / months };
        },
        seo: buildSeo({
            title: "Yurt Maliyeti Hesaplama",
            metaDescription: "Yurt maliyeti hesaplama aracıyla aylık yurt ücreti, depozito, ek yemek ve ulaşım giderlerinden dönemlik maliyeti hesaplayın.",
            intro: "Yurt maliyeti yalnız aylık yatak ücretinden ibaret değildir; depozito, yemek, ulaşım ve kayıt kalemleri toplam bütçeyi değiştirir.",
            formula: "Dönem toplamı = (yurt + ek yemek + ulaşım) × ay sayısı + depozito.",
            example: "6.500 TL yurt, 2.500 TL yemek, 700 TL ulaşım ve 6.500 TL depozito ile 9 ay toplamı 93.800 TL olur.",
            interpretation: "Depozito dahil aylık ortalama, ilk ödeme yükünü dönem bütçesine yayarak daha gerçekçi karşılaştırma sağlar.",
            caution: "Yurt sözleşmesi, yemek paketi ve depozito iade koşulları kuruma göre değişebilir.",
            links: educationLinks,
            faq: [
                ["Yurt maliyetine yemek dahil mi?", "Yurda göre değişir; bu yüzden ek yemek alanı ayrı tutulmuştur."],
                ["Depozito aylık gider mi?", "Tek seferliktir, ancak dönem bütçesinde aylık ortalamaya yayılabilir."],
                ["Ulaşım neden eklenir?", "Yurt okuldan uzaksa düzenli ulaşım bütçeyi etkiler."],
                ["KYK ve özel yurt için kullanılabilir mi?", "Evet. Tutarları kendi yurdunuza göre girerek kullanabilirsiniz."],
                ["Sonuç kesin ödeme midir?", "Hayır. Sözleşme ve kurum ücretleri esas alınmalıdır."],
            ],
        }),
    },
    {
        id: "school-expense",
        slug: "okul-gider-hesaplama",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Okul Gider Hesaplama", en: "School Expense Calculator" },
        h1: { tr: "Okul Gider Hesaplama", en: "School Expense Calculator" },
        description: { tr: "Yıllık okul ücreti, servis, yemek, kitap ve kırtasiye giderlerini hesaplayın.", en: "Calculate annual school expenses." },
        shortDescription: { tr: "Okulun yıllık ve aylık bütçe etkisini görün.", en: "See annual and monthly school budget impact." },
        relatedCalculators: ["kitap-maliyeti", "ogrenci-butce-hesaplama", "egitim-kredisi"],
        inputs: [numberInput("tuition", "Okul Ücreti", "Tuition", 60000, { suffix: " ₺" }), numberInput("service", "Servis", "Service", 18000, { suffix: " ₺" }), numberInput("food", "Yemek", "Food", 15000, { suffix: " ₺" }), numberInput("books", "Kitap/Kırtasiye", "Books/Supplies", 9000, { suffix: " ₺" }), numberInput("activity", "Etkinlik/Diğer", "Activity/Other", 6000, { suffix: " ₺" })],
        results: [numberResult("annualTotal", "Yıllık Toplam", "Annual Total", " ₺"), numberResult("monthlyAverage", "12 Aylık Ortalama", "Monthly Average", " ₺"), numberResult("termAverage", "9 Aylık Eğitim Dönemi Ortalaması", "Term Average", " ₺")],
        formula: (v) => {
            const annualTotal = ["tuition", "service", "food", "books", "activity"].reduce((sum, key) => sum + Math.max(0, Number(v[key]) || 0), 0);
            return { annualTotal, monthlyAverage: annualTotal / 12, termAverage: annualTotal / 9 };
        },
        seo: buildSeo({
            title: "Okul Gider Hesaplama",
            metaDescription: "Okul gider hesaplama aracıyla yıllık okul ücreti, servis, yemek, kitap, kırtasiye ve etkinlik giderlerini hesaplayın.",
            intro: "Okul giderleri tek bir kalemden oluşmaz; öğrenim ücreti, servis, yemek, kitap ve etkinlik kalemleri birlikte planlanmalıdır.",
            formula: "Yıllık toplam = okul ücreti + servis + yemek + kitap/kırtasiye + etkinlik/diğer.",
            example: "60.000 TL okul ücreti, 18.000 TL servis, 15.000 TL yemek, 9.000 TL kitap ve 6.000 TL diğer giderle yıllık toplam 108.000 TL olur.",
            interpretation: "12 aylık ortalama aile bütçesine yayılmış yükü, 9 aylık ortalama ise eğitim dönemi içindeki yoğun nakit çıkışını gösterir.",
            caution: "Okul zamları, taksit farkları ve isteğe bağlı hizmetler sonucu değiştirebilir.",
            links: educationLinks,
            faq: [
                ["Okul giderine hangi kalemler dahil edilmeli?", "Öğrenim, servis, yemek, kitap, kırtasiye, kıyafet ve etkinlik giderleri dahil edilebilir."],
                ["Aylık ortalama neden 12'ye bölünüyor?", "Aile bütçesinde yıllık yükü tüm yıla yayarak görmek için."],
                ["9 aylık ortalama neyi gösterir?", "Eğitim dönemi içindeki daha yoğun ödeme yükünü gösterir."],
                ["Taksit farkı dahil mi?", "Hayır. Varsa diğer gider alanına eklenmelidir."],
                ["Sonuç resmi okul ücreti midir?", "Hayır. Okulun güncel ücret duyurusu esas alınmalıdır."],
            ],
        }),
    },
    {
        id: "book-cost",
        slug: "kitap-maliyeti",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Kitap Maliyeti Hesaplama", en: "Book Cost Calculator" },
        h1: { tr: "Kitap Maliyeti Hesaplama", en: "Book Cost Calculator" },
        description: { tr: "Kitap sayısı, ortalama fiyat, indirim ve ikinci el oranıyla toplam kitap maliyetini hesaplayın.", en: "Calculate total book cost from count, average price, discount, and used-book share." },
        shortDescription: { tr: "Kitap ve kaynak bütçesini planlayın.", en: "Plan book and resource budget." },
        relatedCalculators: ["okul-gider-hesaplama", "ogrenci-butce-hesaplama", "burs-hesaplama"],
        inputs: [numberInput("bookCount", "Kitap Sayısı", "Book Count", 12), numberInput("averagePrice", "Ortalama Kitap Fiyatı", "Average Price", 350, { suffix: " ₺" }), numberInput("discountRate", "İndirim Oranı", "Discount Rate", 10, { suffix: " %" }), numberInput("usedShare", "İkinci El Payı", "Used Share", 30, { suffix: " %" }), numberInput("usedDiscount", "İkinci El İndirimi", "Used Discount", 45, { suffix: " %" })],
        results: [numberResult("newCost", "Yeni Kitap Maliyeti", "New Book Cost", " ₺"), numberResult("usedCost", "İkinci El Maliyeti", "Used Cost", " ₺"), numberResult("totalCost", "Toplam Maliyet", "Total Cost", " ₺"), numberResult("saving", "Tahmini Tasarruf", "Estimated Saving", " ₺")],
        formula: (v) => {
            const bookCount = Math.max(0, Number(v.bookCount) || 0);
            const averagePrice = Math.max(0, Number(v.averagePrice) || 0);
            const discountRate = Math.min(100, Math.max(0, Number(v.discountRate) || 0)) / 100;
            const usedShare = Math.min(100, Math.max(0, Number(v.usedShare) || 0)) / 100;
            const usedDiscount = Math.min(100, Math.max(0, Number(v.usedDiscount) || 0)) / 100;
            const usedCount = bookCount * usedShare;
            const newCount = bookCount - usedCount;
            const baseline = bookCount * averagePrice;
            const newCost = newCount * averagePrice * (1 - discountRate);
            const usedCost = usedCount * averagePrice * (1 - usedDiscount);
            const totalCost = newCost + usedCost;
            return { newCost, usedCost, totalCost, saving: baseline - totalCost };
        },
        seo: buildSeo({
            title: "Kitap Maliyeti Hesaplama",
            metaDescription: "Kitap maliyeti hesaplama aracıyla kaynak sayısı, ortalama fiyat, indirim ve ikinci el payına göre toplam kitap bütçesini hesaplayın.",
            intro: "Kitap maliyeti, okul ve sınav hazırlığında sık tekrar eden ama çoğu zaman küçük parçalar halinde görünen bir bütçe kalemidir.",
            formula: "Toplam maliyet = yeni kitap maliyeti + ikinci el kitap maliyeti. İndirimler ilgili fiyat üzerinden düşülür.",
            example: "12 kitap, 350 TL ortalama fiyat, 10% indirim ve 30% ikinci el payıyla toplam maliyet yaklaşık 3.465 TL olur.",
            interpretation: "Tahmini tasarruf, tüm kitapları liste fiyatından alma senaryosuna göre farkı gösterir.",
            caution: "Kitap fiyatları yayınevi, baskı yılı ve okul listesine göre değişir. Sonuç bütçe planıdır.",
            links: educationLinks,
            faq: [
                ["İkinci el payı nedir?", "Toplam kitapların yüzde kaçının ikinci el alınacağını gösterir."],
                ["İndirimler birlikte uygulanır mı?", "Yeni kitap indirimi ve ikinci el indirimi ayrı hesaplanır."],
                ["Dijital kaynaklar dahil mi?", "Dijital kaynakları ortalama fiyat veya diğer gider gibi ekleyebilirsiniz."],
                ["Tasarruf nasıl hesaplanır?", "Tüm kitapları liste fiyatından alma maliyeti ile seçilen senaryo karşılaştırılır."],
                ["Sonuç kesin fiyat mıdır?", "Hayır. Kitap listesi ve güncel fiyatlar değişebilir."],
            ],
        }),
    },
    {
        id: "student-living-cost",
        slug: "ogrenci-yasam-maliyeti",
        category: "sinav-hesaplamalari",
        updatedAt: "2026-05-02",
        name: { tr: "Öğrenci Yaşam Maliyeti Hesaplama", en: "Student Living Cost Calculator" },
        h1: { tr: "Öğrenci Yaşam Maliyeti Hesaplama", en: "Student Living Cost Calculator" },
        description: { tr: "Kira/yurt, yemek, ulaşım, fatura, eğitim ve sosyal giderlerle öğrenci yaşam maliyetini hesaplayın.", en: "Calculate student living cost from rent, food, transport, bills, education, and social expenses." },
        shortDescription: { tr: "Aylık ve yıllık öğrenci yaşam maliyetini görün.", en: "See monthly and yearly student living cost." },
        relatedCalculators: ["ogrenci-butce-hesaplama", "yurt-maliyeti", "burs-hesaplama"],
        inputs: [numberInput("housing", "Kira/Yurt", "Housing", 6500, { suffix: " ₺" }), numberInput("food", "Yemek", "Food", 4000, { suffix: " ₺" }), numberInput("transport", "Ulaşım", "Transport", 900, { suffix: " ₺" }), numberInput("bills", "Fatura/İletişim", "Bills", 800, { suffix: " ₺" }), numberInput("education", "Eğitim/Kitap", "Education", 1000, { suffix: " ₺" }), numberInput("social", "Sosyal/Diğer", "Social", 1800, { suffix: " ₺" })],
        results: [numberResult("monthlyTotal", "Aylık Toplam", "Monthly Total", " ₺"), numberResult("yearlyTotal", "Yıllık Toplam", "Yearly Total", " ₺"), numberResult("minimumIncome", "Önerilen Minimum Gelir", "Suggested Minimum Income", " ₺")],
        formula: (v) => {
            const monthlyTotal = ["housing", "food", "transport", "bills", "education", "social"].reduce((sum, key) => sum + Math.max(0, Number(v[key]) || 0), 0);
            return { monthlyTotal, yearlyTotal: monthlyTotal * 12, minimumIncome: monthlyTotal * 1.1 };
        },
        seo: buildSeo({
            title: "Öğrenci Yaşam Maliyeti Hesaplama",
            metaDescription: "Öğrenci yaşam maliyeti hesaplama aracıyla kira/yurt, yemek, ulaşım, fatura, eğitim ve sosyal giderlerden aylık bütçe ihtiyacını hesaplayın.",
            intro: "Öğrenci yaşam maliyeti, yalnız okul ücretini değil günlük yaşamın düzenli giderlerini de kapsar.",
            formula: "Aylık toplam = barınma + yemek + ulaşım + faturalar + eğitim + sosyal giderler. Yıllık toplam = aylık toplam × 12.",
            example: "6.500 TL barınma, 4.000 TL yemek, 900 TL ulaşım, 800 TL fatura, 1.000 TL eğitim ve 1.800 TL sosyal giderle aylık toplam 15.000 TL olur.",
            interpretation: "Önerilen minimum gelir, beklenmeyen küçük giderler için 10% güven payı eklenmiş aylık hedefi gösterir.",
            caution: "Şehir, yurt tipi, okul konumu ve yaşam alışkanlığı maliyeti ciddi biçimde değiştirir.",
            links: educationLinks,
            faq: [
                ["Öğrenci yaşam maliyeti neyi kapsar?", "Barınma, yemek, ulaşım, fatura, eğitim ve sosyal giderleri kapsar."],
                ["Minimum gelir neden toplamdan yüksek?", "Küçük beklenmeyen giderler için güven payı eklenir."],
                ["Yurt ve kira birlikte girilir mi?", "Hayır. Barınma alanına geçerli olan düzenli kalemi yazmak yeterlidir."],
                ["Yıllık toplam ne işe yarar?", "Burs, kredi veya aile desteğini dönem bazında planlamaya yardım eder."],
                ["Sonuç her şehir için geçerli mi?", "Hayır. Şehir ve yaşam biçimine göre tutarlar kullanıcı tarafından güncellenmelidir."],
            ],
        }),
    },
];
