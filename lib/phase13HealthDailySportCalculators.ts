import type { CalculatorConfig } from "./calculator-source";

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
            tr: `<h2>${args.title} Nasıl Kullanılır?</h2><p>${args.intro}</p><h2>Formül ve Yöntem</h2><p>${args.formula}</p><h2>Örnek Hesaplama</h2><p>${args.example}</p><h2>Sonuç Nasıl Yorumlanır?</h2><p>${args.interpretation}</p><h2>Dikkat Edilmesi Gerekenler</h2><p>${args.caution}</p><h2>İlgili Hesaplamalar</h2><p>${args.links}</p>`,
            en: `${args.intro} Formula: ${args.formula} Example: ${args.example}`,
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

const healthLinks =
    '<a href="/yasam-hesaplama/vucut-kitle-indeksi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">VKİ hesaplama</a>, <a href="/yasam-hesaplama/ideal-kilo-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ideal kilo</a>, <a href="/yasam-hesaplama/bazal-metabolizma-hizi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">BMR</a> ve <a href="/yasam-hesaplama/gunluk-kalori-ihtiyaci" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">günlük kalori ihtiyacı</a> araçlarıyla birlikte değerlendirebilirsiniz.';

const hydrationMacroLinks =
    '<a href="/yasam-hesaplama/gunluk-su-ihtiyaci-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">su ihtiyacı</a>, <a href="/yasam-hesaplama/gunluk-protein-ihtiyaci-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">protein ihtiyacı</a>, <a href="/yasam-hesaplama/gunluk-makro-besin-ihtiyaci-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">makro hesaplama</a> ve <a href="/yasam-hesaplama/kalori-yakma-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kalori yakma</a> araçları aynı planı tamamlar.';

const dateLinks =
    '<a href="/zaman-hesaplama/yas-hesaplama-detayli" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">yaş hesaplama</a>, <a href="/zaman-hesaplama/iki-tarih-arasindaki-gun-sayisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">tarih farkı</a>, <a href="/zaman-hesaplama/kac-gun-kaldi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">geri sayım</a> ve <a href="/zaman-hesaplama/tarih-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">tarih ekleme çıkarma</a> sayfalarıyla birlikte kullanabilirsiniz.';

const utilityLinks =
    '<a href="/yasam-hesaplama/elektrik-tuketim-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">elektrik tüketimi</a>, <a href="/yasam-hesaplama/dogalgaz-tuketimi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">doğalgaz tüketimi</a>, <a href="/yasam-hesaplama/su-faturasi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">su faturası</a>, <a href="/tasit-ve-vergi/yakit-tuketim-maliyet" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">yakıt maliyeti</a> ve <a href="/yasam-hesaplama/ev-gider-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ev giderleri</a> aynı bütçe çerçevesinde okunabilir.';

const sportLinks =
    '<a href="/yasam-hesaplama/kosu-pace-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">koşu pace</a>, <a href="/yasam-hesaplama/maraton-tempo-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">maraton tempo</a>, <a href="/yasam-hesaplama/vo2-max-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">VO2 max</a>, <a href="/yasam-hesaplama/nabiz-araligi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">nabız aralığı</a> ve <a href="/yasam-hesaplama/kalori-yakma-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">kalori yakma</a> araçlarıyla birlikte yorumlayabilirsiniz.';

const strengthLinks =
    '<a href="/yasam-hesaplama/bench-press-max" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">bench press max</a>, <a href="/yasam-hesaplama/squat-max" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">squat max</a>, <a href="/yasam-hesaplama/deadlift-max" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">deadlift max</a> ve <a href="/yasam-hesaplama/antrenman-hacmi" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">antrenman hacmi</a> sayfaları kuvvet planını tamamlar.';

function parseTime(value: string) {
    const [hour, minute] = String(value || "00:00").split(":").map((item) => Number(item));
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
    return hour * 60 + minute;
}

function formatTime(totalMinutes: number) {
    const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
    const hour = Math.floor(normalized / 60).toString().padStart(2, "0");
    const minute = (normalized % 60).toString().padStart(2, "0");
    return `${hour}:${minute}`;
}

function oneRepMaxCalculator(args: {
    id: string;
    slug: string;
    name: string;
    liftName: string;
    defaultWeight: number;
    related: string[];
}): CalculatorConfig {
    return {
        id: args.id,
        slug: args.slug,
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: args.name, en: args.name },
        h1: { tr: args.name, en: args.name },
        description: { tr: `${args.liftName} için kaldırdığınız ağırlık ve tekrar sayısından tahmini tek tekrar maksimumunuzu hesaplayın.`, en: `Estimate one-rep max for ${args.liftName}.` },
        shortDescription: { tr: "Epley ve Brzycki formülleriyle tahmini 1RM değerini görün.", en: "Estimate 1RM using Epley and Brzycki formulas." },
        relatedCalculators: args.related,
        inputs: [
            numberInput("weight", "Kaldırılan Ağırlık", "Lifted Weight", args.defaultWeight, { suffix: " kg", min: 0 }),
            numberInput("reps", "Tekrar Sayısı", "Reps", 5, { min: 1, max: 20, step: 1 }),
        ],
        results: [
            numberResult("epley", "Epley 1RM", "Epley 1RM", " kg", 1),
            numberResult("brzycki", "Brzycki 1RM", "Brzycki 1RM", " kg", 1),
            numberResult("average", "Ortalama Tahmini Max", "Average Estimated Max", " kg", 1),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const reps = Math.min(20, Math.max(1, Number(v.reps) || 1));
            const epley = weight * (1 + reps / 30);
            const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : epley;
            const average = (epley + brzycki) / 2;
            return {
                epley,
                brzycki,
                average,
                note: `${args.liftName} için tahmini 1RM yaklaşık ${average.toFixed(1)} kg. Maksimum denemeler güvenlik ekipmanı, spotter ve uygun teknik olmadan yapılmamalıdır.`,
            };
        },
        seo: buildSeo({
            title: args.name,
            metaDescription: `${args.name} aracıyla kaldırdığınız ağırlık ve tekrar sayısından tahmini 1 tekrar maksimumu, Epley ve Brzycki formülleriyle hesaplayın.`,
            intro: `${args.liftName} performansını takip ederken her hafta gerçek maksimum denemesi yapmak gereksiz risk yaratabilir. Bu araç, çok tekrarlı setten tahmini tek tekrar maksimumu üretir ve antrenman yükünü daha kontrollü planlamaya yardımcı olur.`,
            formula: "Epley 1RM = Ağırlık x (1 + Tekrar / 30). Brzycki 1RM = Ağırlık x 36 / (37 - Tekrar). Araç iki sonucu ortalama tahmin olarak da gösterir.",
            example: `${args.defaultWeight} kg ile 5 tekrar yaptıysanız Epley sonucu yaklaşık ${(args.defaultWeight * (1 + 5 / 30)).toFixed(1)} kg olur.`,
            interpretation: "Sonuç yarışma denemesi değil, antrenman yüzdesi belirlemek için kullanılan yaklaşık değerdir. Tekrar sayısı 10'u aştıkça hata payı artabilir.",
            caution: "Ağır maksimum denemeleri sakatlık riski taşır. Ağrı, teknik bozulma veya yorgunluk varsa deneme yapılmamalı; gerekiyorsa antrenör desteği alınmalıdır.",
            links: strengthLinks,
            faq: [
                ["1RM hesabı ne kadar doğru?", "3-8 tekrar aralığında daha kullanışlı tahmin verir; çok yüksek tekrar setlerinde hata payı artar."],
                ["Epley ve Brzycki neden farklı çıkar?", "Formüller tekrar-yük ilişkisini farklı varsayımlarla modeller; bu yüzden aralık olarak okumak daha doğrudur."],
                ["Maksimum deneme yerine kullanılabilir mi?", "Antrenman yükü planlamak için evet; resmi yarışma veya gerçek maksimumun yerini birebir tutmaz."],
                ["Yüzde kaçla çalışmalıyım?", "Kuvvet için çoğu program 1RM'nin %75-90 aralığını, hacim için daha düşük yüzdeleri kullanır."],
                ["Yeni başlayanlar 1RM denemeli mi?", "Genellikle önce teknik ve hareket kalitesi oturtulmalı, doğrudan maksimum denemelerden kaçınılmalıdır."],
            ],
        }),
    };
}

export const phase13HealthDailySportCalculators: CalculatorConfig[] = [
    {
        id: "calorie-burn",
        slug: "kalori-yakma-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Kalori Yakma Hesaplama", en: "Calories Burned Calculator" },
        h1: { tr: "Kalori Yakma Hesaplama - Aktivite ve Süreye Göre", en: "Calories Burned Calculator" },
        description: { tr: "Kilonuz, aktivite türünüz ve egzersiz sürenize göre yaklaşık yakılan kaloriyi hesaplayın.", en: "Estimate calories burned from weight, activity, and duration." },
        shortDescription: { tr: "Yürüyüş, koşu, bisiklet ve fitness aktivitelerinde yaklaşık kalori harcamasını görün.", en: "Estimate exercise calorie expenditure." },
        relatedCalculators: ["adim-kalori-hesaplama", "gunluk-kalori-ihtiyaci", "nabiz-araligi-hesaplama", "kosu-pace-hesaplama", "vo2-max-hesaplama"],
        inputs: [
            numberInput("weight", "Kilo", "Weight", 75, { suffix: " kg", min: 20 }),
            numberInput("duration", "Süre", "Duration", 45, { suffix: " dk", min: 1 }),
            selectInput("met", "Aktivite", "Activity", "7", [
                { label: { tr: "Yürüyüş - orta tempo", en: "Walking - moderate" }, value: "3.5" },
                { label: { tr: "Koşu - orta tempo", en: "Running - moderate" }, value: "9.8" },
                { label: { tr: "Bisiklet - orta tempo", en: "Cycling - moderate" }, value: "7" },
                { label: { tr: "Fitness / ağırlık", en: "Fitness / weights" }, value: "6" },
                { label: { tr: "Yüzme", en: "Swimming" }, value: "8" },
            ]),
        ],
        results: [
            numberResult("calories", "Yakılan Kalori", "Calories Burned", " kcal", 0),
            numberResult("hourlyBurn", "Saatlik Yakım", "Hourly Burn", " kcal/saat", 0),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const duration = Math.max(0, Number(v.duration) || 0);
            const met = Math.max(0, Number(v.met) || 0);
            const calories = (met * 3.5 * weight / 200) * duration;
            return {
                calories,
                hourlyBurn: duration > 0 ? calories / duration * 60 : 0,
                note: "Sonuç MET tabanlı tahmindir; nabız, kondisyon, eğim ve hareket tekniği gerçek harcamayı değiştirebilir.",
            };
        },
        seo: buildSeo({
            title: "Kalori Yakma Hesaplama",
            metaDescription: "Kalori yakma hesaplama aracıyla yürüyüş, koşu, bisiklet, yüzme ve fitness aktivitelerinde yaklaşık enerji harcamanızı hesaplayın.",
            intro: "Kalori yakma hesabı, yapılan aktivitenin MET değeri, egzersiz süresi ve vücut ağırlığı ile yaklaşık enerji harcamasını bulur. Sağlık ve spor planlarında pratik bir başlangıç tahmini sağlar.",
            formula: "Yakılan kalori = MET x 3,5 x kilo(kg) / 200 x süre(dakika). MET aktivitenin göreli enerji yoğunluğunu temsil eder.",
            example: "75 kg bir kişi 45 dakika orta tempo bisiklet yaptığında: 7 x 3,5 x 75 / 200 x 45 = yaklaşık 413 kcal harcar.",
            interpretation: "Sonuç egzersiz günlüğü, kilo yönetimi ve aktivite karşılaştırması için kullanılabilir; kesin laboratuvar ölçümü değildir.",
            caution: "Kalp, tansiyon, gebelik, kronik hastalık veya yeni başlayan egzersiz durumlarında kişisel plan için sağlık profesyoneline danışılmalıdır.",
            links: hydrationMacroLinks,
            faq: [
                ["Kalori yakma hesabı kesin midir?", "Hayır. MET yöntemi pratik bir tahmindir; nabız, eğim, sıcaklık, kondisyon ve hareket ekonomisi sonucu değiştirebilir."],
                ["Koşu mu yürüyüş mü daha çok kalori yakar?", "Aynı sürede koşu genellikle daha yüksek MET değerine sahip olduğu için daha fazla enerji harcar."],
                ["Ağırlık arttıkça yakılan kalori artar mı?", "Evet. Aynı aktivitede daha yüksek vücut ağırlığı genellikle daha fazla enerji harcaması yaratır."],
                ["Fitness kalori hesabı için kullanılabilir mi?", "Evet. Ağırlık ve genel fitness aktiviteleri için yaklaşık MET seçeneğiyle kullanılabilir."],
                ["Kalori yakımı kilo vermeyi garanti eder mi?", "Hayır. Kilo değişimi toplam kalori dengesi, beslenme, uyku, stres ve sağlık durumuna bağlıdır."],
            ],
        }),
    },
    {
        id: "step-calorie",
        slug: "adim-kalori-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Adım Kalori Hesaplama", en: "Step Calorie Calculator" },
        h1: { tr: "Adım Kalori Hesaplama - Adım Sayısından Yakılan Kalori", en: "Step Calorie Calculator" },
        description: { tr: "Adım sayısı, adım uzunluğu ve kilonuza göre yürüyüş mesafesi ile yaklaşık kalori harcamasını hesaplayın.", en: "Estimate walking distance and calories from step count." },
        shortDescription: { tr: "Günlük adım sayınızı km ve kcal karşılığına çevirin.", en: "Convert daily steps into distance and calories." },
        relatedCalculators: ["adim-mesafe-hesaplama", "kalori-yakma-hesaplama", "gunluk-kalori-ihtiyaci", "gunluk-su-ihtiyaci-hesaplama"],
        inputs: [
            numberInput("steps", "Adım Sayısı", "Steps", 10000, { min: 0, step: 100 }),
            numberInput("strideCm", "Ortalama Adım Uzunluğu", "Average Stride", 75, { suffix: " cm", min: 30, max: 120 }),
            numberInput("weight", "Kilo", "Weight", 75, { suffix: " kg", min: 20 }),
        ],
        results: [
            numberResult("distanceKm", "Tahmini Mesafe", "Estimated Distance", " km", 2),
            numberResult("calories", "Yakılan Kalori", "Calories Burned", " kcal", 0),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const steps = Math.max(0, Number(v.steps) || 0);
            const strideCm = Math.max(0, Number(v.strideCm) || 0);
            const weight = Math.max(0, Number(v.weight) || 0);
            const distanceKm = steps * strideCm / 100000;
            const calories = distanceKm * weight * 0.57;
            return {
                distanceKm,
                calories,
                note: "Yürüyüş temposu, eğim ve zemine göre kalori harcaması değişebilir.",
            };
        },
        seo: buildSeo({
            title: "Adım Kalori Hesaplama",
            metaDescription: "Adım kalori hesaplama aracıyla günlük adım sayınızı tahmini kilometre ve yakılan kalori karşılığına dönüştürün.",
            intro: "Adım kalori hesabı, adım sayısını önce mesafeye çevirir, ardından vücut ağırlığına göre yaklaşık yürüyüş enerjisini tahmin eder.",
            formula: "Mesafe(km) = Adım x adım uzunluğu(cm) / 100.000. Kalori yaklaşık olarak mesafe x kilo x 0,57 katsayısıyla hesaplanır.",
            example: "10.000 adım, 75 cm adım uzunluğu ve 75 kg için mesafe 7,5 km; kalori yaklaşık 321 kcal olur.",
            interpretation: "Sonuç günlük hareket takibi için iyi bir göstergedir; akıllı saatlerle küçük farklar oluşması normaldir.",
            caution: "Adım uzunluğu kişiden kişiye değişir. En iyi sonuç için kendi ortalama adım uzunluğunuzu ölçerek girin.",
            links: hydrationMacroLinks,
            faq: [
                ["10 bin adım kaç kalori yakar?", "Kilo ve adım uzunluğuna bağlıdır; 75 kg ve 75 cm adım uzunluğunda yaklaşık 320 kcal eder."],
                ["Adım uzunluğunu nasıl bulurum?", "10 metre yürüyüp attığınız adım sayısına bölerek ortalama adım uzunluğunuzu ölçebilirsiniz."],
                ["Yokuş yukarı yürümek sonucu değiştirir mi?", "Evet. Eğim kalori harcamasını artırır; bu araç düz zemin için yaklaşık değer üretir."],
                ["Adım mesafe hesabıyla aynı mı?", "Bu araç mesafeye ek olarak kalori tahmini de verir; yalnız mesafe için adım mesafe aracı kullanılabilir."],
                ["Günlük adım hedefi herkeste aynı mı?", "Hayır. Yaş, sağlık durumu, kondisyon ve yaşam düzeni hedefi değiştirir."],
            ],
        }),
    },
    {
        id: "heart-rate-zones",
        slug: "nabiz-araligi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Nabız Aralığı Hesaplama", en: "Heart Rate Zone Calculator" },
        h1: { tr: "Nabız Aralığı Hesaplama - Yağ Yakım ve Kardiyo Bölgeleri", en: "Heart Rate Zone Calculator" },
        description: { tr: "Yaş ve dinlenik nabza göre maksimum nabız, yağ yakım bölgesi ve kardiyo antrenman aralıklarını hesaplayın.", en: "Calculate max heart rate and training zones." },
        shortDescription: { tr: "Yağ yakım, aerobik ve yüksek yoğunluk nabız bölgelerini görün.", en: "See fat-burning, aerobic, and high-intensity zones." },
        relatedCalculators: ["yag-yakim-bolgesi-hesaplama", "vo2-max-hesaplama", "kosu-pace-hesaplama", "kalori-yakma-hesaplama"],
        inputs: [
            numberInput("age", "Yaş", "Age", 35, { min: 10, max: 90 }),
            numberInput("restingHr", "Dinlenik Nabız", "Resting Heart Rate", 65, { suffix: " bpm", min: 35, max: 120 }),
        ],
        results: [
            numberResult("maxHr", "Tahmini Maksimum Nabız", "Estimated Max HR", " bpm", 0),
            textResult("fatBurnZone", "Yağ Yakım Bölgesi", "Fat Burn Zone"),
            textResult("aerobicZone", "Aerobik Bölge", "Aerobic Zone"),
            textResult("hardZone", "Yüksek Yoğunluk", "High Intensity"),
        ],
        formula: (v) => {
            const age = Math.max(1, Number(v.age) || 0);
            const restingHr = Math.max(0, Number(v.restingHr) || 0);
            const maxHr = 220 - age;
            const reserve = Math.max(0, maxHr - restingHr);
            const zone = (low: number, high: number) => `${Math.round(restingHr + reserve * low)}-${Math.round(restingHr + reserve * high)} bpm`;
            return {
                maxHr,
                fatBurnZone: zone(0.6, 0.7),
                aerobicZone: zone(0.7, 0.8),
                hardZone: zone(0.8, 0.9),
            };
        },
        seo: buildSeo({
            title: "Nabız Aralığı Hesaplama",
            metaDescription: "Nabız aralığı hesaplama aracıyla yaş ve dinlenik nabza göre yağ yakım, aerobik ve yüksek yoğunluk kalp atım bölgelerini hesaplayın.",
            intro: "Nabız aralıkları, antrenman yoğunluğunu daha kontrollü okumak için kullanılır. Bu araç Karvonen mantığıyla dinlenik nabzı da hesaba katar.",
            formula: "Maksimum nabız = 220 - yaş. Nabız rezervi = maksimum nabız - dinlenik nabız. Bölge = dinlenik nabız + rezerv x hedef yoğunluk.",
            example: "35 yaş ve 65 dinlenik nabız için maksimum nabız 185, rezerv 120 olur. Yağ yakım bölgesi yaklaşık 137-149 bpm çıkar.",
            interpretation: "Düşük bölgeler toparlanma ve uzun süreli aerobik çalışma için, yüksek bölgeler ise daha yoğun kondisyon çalışması için kullanılır.",
            caution: "Kalp hastalığı, göğüs ağrısı, ritim bozukluğu, tansiyon veya ilaç kullanımı varsa egzersiz nabız hedefleri hekimle belirlenmelidir.",
            links: sportLinks,
            faq: [
                ["Yağ yakım nabız aralığı kaçtır?", "Pratikte çoğu kişide nabız rezervinin yaklaşık %60-70 bandı yağ yakım bölgesi olarak kullanılır."],
                ["220 eksi yaş formülü kesin mi?", "Hayır. Popülasyon ortalamasıdır; bireysel maksimum nabız anlamlı sapabilir."],
                ["Dinlenik nabız neden önemli?", "Kondisyon seviyesi ve nabız rezervi hesabı için kişisel başlangıç noktası sağlar."],
                ["Yüksek nabız tehlikeli midir?", "Kısa süreli yoğunluk normal olabilir; ağrı, baş dönmesi veya nefes darlığı varsa egzersiz kesilmeli ve tıbbi destek alınmalıdır."],
                ["Bu araç sporcu testi yerine geçer mi?", "Hayır. Laboratuvar veya saha testi daha doğru sonuç verir; bu araç pratik tahmindir."],
            ],
        }),
    },
    {
        id: "child-bmi",
        slug: "cocuk-bmi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Çocuk BMI Hesaplama", en: "Child BMI Calculator" },
        h1: { tr: "Çocuk BMI Hesaplama - Yaşa ve Cinsiyete Göre Yorum Notu", en: "Child BMI Calculator" },
        description: { tr: "Çocuğun kilo ve boy bilgisiyle BMI değerini hesaplayın; çocuklarda persentil yorumunun neden gerekli olduğunu görün.", en: "Calculate child BMI and review percentile interpretation note." },
        shortDescription: { tr: "Çocuklarda BMI değerini hesaplayın ve persentil uyarısıyla yorumlayın.", en: "Calculate child BMI with percentile guidance." },
        relatedCalculators: ["vucut-kitle-indeksi-hesaplama", "bebek-boyu-hesaplama", "bebek-kilosu-hesaplama", "ideal-kilo-hesaplama"],
        inputs: [
            numberInput("age", "Yaş", "Age", 10, { min: 2, max: 18 }),
            selectInput("gender", "Cinsiyet", "Gender", "female", [
                { label: { tr: "Kız", en: "Female" }, value: "female" },
                { label: { tr: "Erkek", en: "Male" }, value: "male" },
            ]),
            numberInput("weight", "Kilo", "Weight", 35, { suffix: " kg", min: 5 }),
            numberInput("height", "Boy", "Height", 140, { suffix: " cm", min: 50 }),
        ],
        results: [
            numberResult("bmi", "BMI", "BMI", "", 1),
            textResult("interpretation", "Yorum", "Interpretation"),
            textResult("nextStep", "Dikkat Notu", "Caution"),
        ],
        formula: (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const heightM = Math.max(0, Number(v.height) || 0) / 100;
            const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;
            return {
                bmi,
                interpretation: "Çocuklarda BMI tek başına yetişkin sınırlarıyla yorumlanmaz; yaşa ve cinsiyete göre persentil eğrisi gerekir.",
                nextStep: "Düzenli büyüme takibi için çocuk doktoru veya diyetisyen değerlendirmesi önerilir.",
            };
        },
        seo: buildSeo({
            title: "Çocuk BMI Hesaplama",
            metaDescription: "Çocuk BMI hesaplama aracıyla kilo ve boydan vücut kitle indeksini bulun; çocuklarda yaş ve cinsiyete göre persentil yorumunun önemini öğrenin.",
            intro: "Çocuklarda BMI değeri kilo ve boydan hesaplanır, fakat yetişkinlerdeki sabit sınırlarla yorumlanmaz. Yaş ve cinsiyet persentil eğrileri gerekir.",
            formula: "BMI = Kilo(kg) / Boy(m)². Çocuklarda sonuç, yaş ve cinsiyet persentiline göre değerlendirilmelidir.",
            example: "35 kg ve 140 cm bir çocuk için BMI = 35 / 1,40² = 17,9 olur. Bu sayının yorumu yaş ve cinsiyet eğrisiyle yapılır.",
            interpretation: "Araç BMI sayısını verir; düşük, normal veya yüksek yorumu için büyüme eğrisi ve klinik değerlendirme gerekir.",
            caution: "Çocuklarda kilo, boy, ergenlik dönemi, hastalık ve büyüme hızı birlikte değerlendirilmelidir; sonuç tanı veya tedavi önerisi değildir.",
            links: healthLinks,
            faq: [
                ["Çocuk BMI yetişkin BMI ile aynı mı?", "Formül aynıdır ancak yorum farklıdır; çocuklarda yaş ve cinsiyete göre persentil kullanılır."],
                ["Çocuklarda normal BMI kaç olmalı?", "Tek bir sabit normal değer yoktur; çocuğun yaş ve cinsiyet persentil eğrisi esas alınır."],
                ["Bu araç obezite tanısı koyar mı?", "Hayır. Sadece BMI değerini hesaplar; tanı için sağlık profesyoneli değerlendirmesi gerekir."],
                ["Ergenlik BMI sonucunu etkiler mi?", "Evet. Büyüme atakları, kas ve yağ dağılımı değiştiği için yorum klinik bağlamla yapılmalıdır."],
                ["Bebekler için kullanılabilir mi?", "Bu araç 2-18 yaş aralığı için pratik BMI hesabıdır; bebeklerde ayrı büyüme persentilleri kullanılmalıdır."],
            ],
        }),
    },
    {
        id: "alcohol-promil",
        slug: "alkol-promil-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Alkol Promil Hesaplama", en: "Alcohol BAC Calculator" },
        h1: { tr: "Alkol Promil Hesaplama - Tahmini BAC ve Vücuttan Atılım", en: "Alcohol BAC Calculator" },
        description: { tr: "Kilo, cinsiyet, standart içki sayısı ve geçen süreye göre tahmini alkol promil değerini hesaplayın.", en: "Estimate BAC from body weight, sex, drinks, and time." },
        shortDescription: { tr: "Alkol promil değerini tahmini ve güvenlik uyarılarıyla görün.", en: "Estimate BAC with safety notes." },
        relatedCalculators: ["uyku-suresi-hesaplama", "kalori-yakma-hesaplama", "gunluk-su-ihtiyaci-hesaplama"],
        inputs: [
            selectInput("gender", "Cinsiyet", "Gender", "male", [
                { label: { tr: "Erkek", en: "Male" }, value: "male" },
                { label: { tr: "Kadın", en: "Female" }, value: "female" },
            ]),
            numberInput("weight", "Kilo", "Weight", 75, { suffix: " kg", min: 30 }),
            numberInput("drinkCount", "Standart İçki Sayısı", "Standard Drinks", 2, { min: 0, step: 0.5 }),
            numberInput("gramsPerDrink", "Bir Standart İçkide Alkol", "Alcohol Per Drink", 14, { suffix: " g", min: 1 }),
            numberInput("hours", "İçkiden Sonra Geçen Süre", "Hours Since Drinking", 2, { suffix: " saat", min: 0, step: 0.25 }),
        ],
        results: [
            numberResult("promil", "Tahmini Promil", "Estimated BAC", " promil", 2),
            numberResult("remainingHours", "Yaklaşık Atılım Süresi", "Approx. Elimination Time", " saat", 1),
            textResult("warning", "Uyarı", "Warning"),
        ],
        formula: (v) => {
            const weight = Math.max(1, Number(v.weight) || 1);
            const drinkCount = Math.max(0, Number(v.drinkCount) || 0);
            const gramsPerDrink = Math.max(0, Number(v.gramsPerDrink) || 0);
            const hours = Math.max(0, Number(v.hours) || 0);
            const r = v.gender === "female" ? 0.55 : 0.68;
            const rawPromil = (drinkCount * gramsPerDrink) / (r * weight);
            const promil = Math.max(0, rawPromil - 0.15 * hours);
            return {
                promil,
                remainingHours: promil / 0.15,
                warning: "Bu tahmin araç kullanımı için güvenli sınır vaadi vermez. Yasal ve tıbbi değerlendirmede resmi ölçüm esastır.",
            };
        },
        seo: buildSeo({
            title: "Alkol Promil Hesaplama",
            metaDescription: "Alkol promil hesaplama aracıyla standart içki sayısı, kilo, cinsiyet ve geçen süreye göre tahmini promil değerini hesaplayın.",
            intro: "Alkol promil hesabı Widmark yaklaşımıyla vücut ağırlığı, cinsiyet ve alınan alkol gramını birlikte değerlendirir. Sonuç yalnızca tahmini bilgilendirme sağlar.",
            formula: "Tahmini promil = alkol gramı / (vücut su katsayısı x kilo). Saat başına yaklaşık 0,15 promil atılım düşülür.",
            example: "75 kg erkek, 2 standart içki, içki başına 14 g alkol ve 2 saat sonra: ham değer yaklaşık 0,55 promil, atılım sonrası yaklaşık 0,25 promil olur.",
            interpretation: "Sonuç kişisel metabolizma, yemek, ilaç, sağlık durumu ve ölçüm zamanına göre ciddi farklılık gösterebilir.",
            caution: "Bu araç araç kullanımı veya yasal sınır için güvenli sonuç vermez. Alkol aldıysanız araç kullanmayın; resmi değerlendirmelerde alkolmetre veya kan ölçümü esastır.",
            links: healthLinks,
            faq: [
                ["Promil hesabı kesin midir?", "Hayır. Widmark yöntemi tahmini sonuç verir; bireysel metabolizma ve ölçüm zamanı sonucu değiştirebilir."],
                ["Yemek yemek promili değiştirir mi?", "Alkol emilimini yavaşlatabilir ancak alınan toplam alkolün etkisini güvenli hale getirmez."],
                ["Saatte kaç promil düşer?", "Pratik tahminlerde yaklaşık 0,10-0,20 promil/saat aralığı kullanılır; bu araç 0,15 alır."],
                ["Bu araç yasal sınırı gösterir mi?", "Hayır. Yasal süreçte resmi ölçüm ve yürürlükteki mevzuat geçerlidir."],
                ["Alkol sonrası ne zaman araç kullanabilirim?", "Bu araç güvenli sürüş zamanı önermez. Alkol aldıysanız araç kullanmamak en güvenli yaklaşımdır."],
            ],
        }),
    },
    {
        id: "sleep-duration",
        slug: "uyku-suresi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Uyku Süresi Hesaplama", en: "Sleep Duration Calculator" },
        h1: { tr: "Uyku Süresi Hesaplama - Uyku Döngüsüne Göre Yatma Saati", en: "Sleep Duration Calculator" },
        description: { tr: "Uyanma saatinize göre 90 dakikalık uyku döngüleriyle önerilen yatma saatlerini hesaplayın.", en: "Calculate bedtime options based on sleep cycles." },
        shortDescription: { tr: "Uyanma saatine göre 5 veya 6 uyku döngüsü için yatma saatini bulun.", en: "Find bedtime options for 5 or 6 sleep cycles." },
        relatedCalculators: ["yas-hesaplama-detayli", "gunluk-kalori-ihtiyaci", "alkol-promil-hesaplama"],
        inputs: [
            textInput("wakeTime", "Uyanma Saati", "Wake Time", "07:00"),
            numberInput("fallAsleepMinutes", "Uykuya Dalma Süresi", "Time to Fall Asleep", 15, { suffix: " dk", min: 0 }),
        ],
        results: [
            textResult("sixCycles", "6 Döngü İçin Yatma", "Bedtime for 6 Cycles"),
            textResult("fiveCycles", "5 Döngü İçin Yatma", "Bedtime for 5 Cycles"),
            textResult("sleepWindow", "Uyku Aralığı", "Sleep Window"),
        ],
        formula: (v) => {
            const parseTimeValue = (value: string) => {
                const [hour, minute] = String(value || "00:00").split(":").map((item) => Number(item));
                if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
                return hour * 60 + minute;
            };
            const formatClock = (totalMinutes: number) => {
                const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
                const hour = Math.floor(normalized / 60).toString().padStart(2, "0");
                const minute = (normalized % 60).toString().padStart(2, "0");
                return `${hour}:${minute}`;
            };
            const wake = parseTimeValue(v.wakeTime);
            const fallAsleep = Math.max(0, Number(v.fallAsleepMinutes) || 0);
            return {
                sixCycles: formatClock(wake - 6 * 90 - fallAsleep),
                fiveCycles: formatClock(wake - 5 * 90 - fallAsleep),
                sleepWindow: "Çoğu yetişkin için 7-9 saat aralığı sık kullanılan genel referanstır.",
            };
        },
        seo: buildSeo({
            title: "Uyku Süresi Hesaplama",
            metaDescription: "Uyku süresi hesaplama aracıyla uyanma saatinize göre 90 dakikalık uyku döngülerini ve önerilen yatma saatlerini hesaplayın.",
            intro: "Uyku döngüleri yaklaşık 90 dakika sürer. Uyanma saatinden geriye doğru 5 veya 6 döngü saymak, daha planlı bir uyku rutini kurmaya yardımcı olabilir.",
            formula: "Yatma saati = Uyanma saati - (döngü sayısı x 90 dakika) - uykuya dalma süresi.",
            example: "07:00'de uyanacak ve 15 dakikada uyuyacaksanız 6 döngü için yaklaşık 21:45, 5 döngü için yaklaşık 23:15 yatma saati çıkar.",
            interpretation: "Sonuç kişisel uyku ritmi için başlangıç önerisidir; dinlenmiş uyanma hissi ve gündüz enerjisiyle birlikte takip edilmelidir.",
            caution: "Kronik uykusuzluk, horlama, uyku apnesi şüphesi veya gündüz aşırı uyku hali varsa hekim değerlendirmesi gerekir.",
            links: dateLinks,
            faq: [
                ["Uyku döngüsü gerçekten 90 dakika mı?", "Yaklaşık değerdir; kişiden kişiye ve geceden geceye değişebilir."],
                ["Yetişkinler kaç saat uyumalı?", "Çoğu yetişkin için 7-9 saat genel referans olarak kullanılır."],
                ["6 döngü mü 5 döngü mü daha iyi?", "6 döngü yaklaşık 9 saat, 5 döngü yaklaşık 7,5 saat eder; ihtiyacınız günlük yorgunluğa göre değişir."],
                ["Uykuya dalma süresi neden ekleniyor?", "Yatağa girme ile gerçek uyku başlangıcı aynı olmadığı için hesap daha gerçekçi olur."],
                ["Bu araç uyku bozukluğunu teşhis eder mi?", "Hayır. Yalnız yatma saati planlaması yapar; tıbbi değerlendirme yerine geçmez."],
            ],
        }),
    },
    {
        id: "metabolic-age",
        slug: "metabolizma-yasi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Metabolizma Yaşı Hesaplama", en: "Metabolic Age Calculator" },
        h1: { tr: "Metabolizma Yaşı Hesaplama - BMR ve Vücut Yağına Göre", en: "Metabolic Age Calculator" },
        description: { tr: "BMR ve vücut yağ oranı yaklaşımıyla tahmini metabolizma yaşınızı hesaplayın.", en: "Estimate metabolic age from BMR and body fat." },
        shortDescription: { tr: "Metabolizma yaşını yaklaşık bir fitness göstergesi olarak görün.", en: "Estimate metabolic age as a fitness indicator." },
        relatedCalculators: ["bazal-metabolizma-hizi-hesaplama", "vucut-yag-orani-hesaplama", "gunluk-kalori-ihtiyaci", "ideal-kilo-hesaplama"],
        inputs: [
            selectInput("gender", "Cinsiyet", "Gender", "male", [
                { label: { tr: "Erkek", en: "Male" }, value: "male" },
                { label: { tr: "Kadın", en: "Female" }, value: "female" },
            ]),
            numberInput("age", "Yaş", "Age", 35, { min: 18, max: 90 }),
            numberInput("weight", "Kilo", "Weight", 75, { suffix: " kg", min: 30 }),
            numberInput("height", "Boy", "Height", 175, { suffix: " cm", min: 120 }),
            numberInput("bodyFat", "Vücut Yağ Oranı", "Body Fat", 22, { suffix: " %", min: 3, max: 60 }),
        ],
        results: [
            numberResult("bmr", "Tahmini BMR", "Estimated BMR", " kcal/gün", 0),
            numberResult("metabolicAge", "Tahmini Metabolizma Yaşı", "Estimated Metabolic Age", " yaş", 0),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const male = v.gender === "male";
            const age = Math.max(18, Number(v.age) || 18);
            const weight = Math.max(0, Number(v.weight) || 0);
            const height = Math.max(0, Number(v.height) || 0);
            const bodyFat = Math.min(60, Math.max(3, Number(v.bodyFat) || (male ? 20 : 30)));
            const bmr = male
                ? 10 * weight + 6.25 * height - 5 * age + 5
                : 10 * weight + 6.25 * height - 5 * age - 161;
            const targetFat = male ? 18 : 28;
            const metabolicAge = Math.min(90, Math.max(18, age + (bodyFat - targetFat) * 0.7));
            const note = metabolicAge <= age
                ? "Metabolizma yaşı kronolojik yaşınıza yakın veya altında görünüyor; sonuç tahmini fitness göstergesidir."
                : "Metabolizma yaşı kronolojik yaşın üzerinde tahmin edildi; uyku, direnç egzersizi, protein ve genel sağlık durumu birlikte değerlendirilmelidir.";
            return { bmr, metabolicAge, note };
        },
        seo: buildSeo({
            title: "Metabolizma Yaşı Hesaplama",
            metaDescription: "Metabolizma yaşı hesaplama aracıyla yaş, kilo, boy, cinsiyet ve vücut yağ oranından tahmini metabolik yaşınızı hesaplayın.",
            intro: "Metabolizma yaşı, BMR ve vücut kompozisyonu gibi göstergeleri kronolojik yaşla karşılaştıran yaklaşık bir fitness göstergesidir. Tıbbi tanı değildir.",
            formula: "Araç Mifflin-St Jeor BMR hesabını ve vücut yağ oranının hedef aralıktan sapmasını kullanarak tahmini metabolik yaş üretir.",
            example: "35 yaş, 75 kg, 175 cm erkek ve %22 yağ oranında BMR yaklaşık 1660 kcal/gün çıkar; yağ oranı hedefin biraz üzerindeyse metabolizma yaşı da birkaç yıl yukarı tahmin edilebilir.",
            interpretation: "Sonuç motivasyon ve takip göstergesi olarak okunmalıdır. Kesin sağlık riski, hormon veya metabolizma testi değildir.",
            caution: "Tiroid, diyabet, ilaç kullanımı, kronik hastalık, gebelik veya ciddi kilo değişimlerinde kişisel tıbbi değerlendirme gerekir.",
            links: healthLinks,
            faq: [
                ["Metabolizma yaşı bilimsel tanı mı?", "Hayır. Fitness cihazlarında da kullanılan yaklaşık bir göstergedir; tıbbi tanı koymaz."],
                ["Metabolizma yaşını ne etkiler?", "Yağsız kütle, vücut yağ oranı, yaş, uyku, aktivite ve sağlık durumu etkileyebilir."],
                ["Metabolizma yaşımı düşürebilir miyim?", "Direnç egzersizi, yeterli protein, uyku ve sürdürülebilir beslenme yağsız kütleyi destekleyebilir."],
                ["BMR ile metabolizma yaşı aynı mı?", "Hayır. BMR günlük enerji harcaması tahminidir; metabolizma yaşı yorumlayıcı bir göstergedir."],
                ["Sonuç kötü çıkarsa ne yapmalıyım?", "Panik yapmadan ölçümleri doğrulayın; sağlık şikayeti varsa doktora veya diyetisyene danışın."],
            ],
        }),
    },
    {
        id: "daily-spending",
        slug: "gunluk-harcama-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Günlük Harcama Hesaplama", en: "Daily Spending Calculator" },
        h1: { tr: "Günlük Harcama Hesaplama - Günlük, Aylık ve Yıllık Gider", en: "Daily Spending Calculator" },
        description: { tr: "Yemek, ulaşım, kahve, market ve diğer günlük giderlerden aylık ve yıllık harcama tahmini çıkarın.", en: "Estimate monthly and annual spending from daily costs." },
        shortDescription: { tr: "Günlük küçük harcamaların aylık ve yıllık etkisini görün.", en: "See the monthly and annual effect of daily spending." },
        relatedCalculators: ["aylik-butce-hesaplama", "ev-gider-hesaplama", "bahsis-hesaplama", "split-hesaplama"],
        inputs: [
            numberInput("food", "Yemek / İçecek", "Food / Drinks", 250, { suffix: " ₺" }),
            numberInput("transport", "Ulaşım", "Transport", 80, { suffix: " ₺" }),
            numberInput("market", "Market / Küçük Alışveriş", "Market", 120, { suffix: " ₺" }),
            numberInput("other", "Diğer", "Other", 50, { suffix: " ₺" }),
            numberInput("days", "Ayda Kaç Gün", "Days per Month", 30, { suffix: " gün", min: 1, max: 31 }),
        ],
        results: [
            numberResult("dailyTotal", "Günlük Toplam", "Daily Total", " ₺", 2),
            numberResult("monthlyTotal", "Aylık Karşılık", "Monthly Total", " ₺", 2),
            numberResult("yearlyTotal", "Yıllık Karşılık", "Yearly Total", " ₺", 2),
        ],
        formula: (v) => {
            const dailyTotal = ["food", "transport", "market", "other"].reduce((sum, key) => sum + Math.max(0, Number(v[key]) || 0), 0);
            const days = Math.min(31, Math.max(1, Number(v.days) || 30));
            return { dailyTotal, monthlyTotal: dailyTotal * days, yearlyTotal: dailyTotal * days * 12 };
        },
        seo: buildSeo({
            title: "Günlük Harcama Hesaplama",
            metaDescription: "Günlük harcama hesaplama aracıyla yemek, ulaşım, market ve küçük giderlerin aylık ve yıllık toplamını hesaplayın.",
            intro: "Günlük harcamalar küçük görünse de ay ve yıl toplamında bütçeyi ciddi biçimde etkiler. Bu araç sık tekrar eden harcamaları görünür hale getirir.",
            formula: "Günlük toplam = gider kalemleri toplamı. Aylık toplam = günlük toplam x gün sayısı. Yıllık toplam = aylık toplam x 12.",
            example: "Günde 250 TL yemek, 80 TL ulaşım, 120 TL market ve 50 TL diğer gider varsa günlük toplam 500 TL, 30 günde 15.000 TL olur.",
            interpretation: "Sonuç, hangi günlük alışkanlığın bütçeyi büyüttüğünü görmenize ve tasarruf alanlarını seçmenize yardımcı olur.",
            caution: "Tek seferlik büyük harcamaları günlük alışkanlıklarla karıştırmayın; bütçe için aylık sabit giderleri ayrı takip edin.",
            links: utilityLinks,
            faq: [
                ["Günlük harcama neden aylık bütçeyi bu kadar etkiler?", "Çünkü küçük tutarlar sık tekrarlandığında ay sonunda büyük bir toplam oluşturur."],
                ["Kahve ve atıştırmalık gibi kalemler dahil edilmeli mi?", "Evet. Sık tekrar eden küçük giderler yıllık toplamda belirgin fark yaratır."],
                ["Aylık bütçeyle farkı nedir?", "Bu araç günlük alışkanlıklara, aylık bütçe aracı ise gelir-gider dengesine odaklanır."],
                ["Tasarruf hesabına nasıl bağlanır?", "Azaltılabilecek günlük kalemi bulup aylık karşılığını tasarruf hedefinize aktarabilirsiniz."],
                ["Nakit ve kart harcamaları birlikte girilir mi?", "Evet. Amaç ödeme yöntemi değil, gerçek tüketim toplamını görmektir."],
            ],
        }),
    },
    {
        id: "monthly-budget",
        slug: "aylik-butce-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Aylık Bütçe Hesaplama", en: "Monthly Budget Calculator" },
        h1: { tr: "Aylık Bütçe Hesaplama - Gelir, Gider ve Tasarruf Oranı", en: "Monthly Budget Calculator" },
        description: { tr: "Aylık gelir, sabit gider, değişken gider ve tasarruf hedefiyle bütçe dengenizi hesaplayın.", en: "Calculate monthly budget balance and savings rate." },
        shortDescription: { tr: "Gelir-gider dengesini ve tasarruf oranını görün.", en: "See monthly balance and savings rate." },
        relatedCalculators: ["gunluk-harcama-hesaplama", "ev-gider-hesaplama", "tatil-butcesi-hesaplama"],
        inputs: [
            numberInput("income", "Aylık Gelir", "Monthly Income", 50000, { suffix: " ₺" }),
            numberInput("fixedExpenses", "Sabit Giderler", "Fixed Expenses", 22000, { suffix: " ₺" }),
            numberInput("variableExpenses", "Değişken Giderler", "Variable Expenses", 15000, { suffix: " ₺" }),
            numberInput("targetSavings", "Tasarruf Hedefi", "Savings Target", 8000, { suffix: " ₺" }),
        ],
        results: [
            numberResult("remaining", "Ay Sonu Kalan", "Remaining", " ₺", 2),
            numberResult("savingsRate", "Tasarruf Oranı", "Savings Rate", " %", 1),
            textResult("status", "Bütçe Yorumu", "Budget Status"),
        ],
        formula: (v) => {
            const income = Math.max(0, Number(v.income) || 0);
            const fixed = Math.max(0, Number(v.fixedExpenses) || 0);
            const variable = Math.max(0, Number(v.variableExpenses) || 0);
            const target = Math.max(0, Number(v.targetSavings) || 0);
            const remaining = income - fixed - variable - target;
            const savingsRate = income > 0 ? target / income * 100 : 0;
            const status = remaining >= 0
                ? "Bütçe hedefi karşılanıyor; kalan tutar esneklik payı olarak ayrılabilir."
                : "Bütçe açığı var; değişken gider veya tasarruf hedefi yeniden planlanmalı.";
            return { remaining, savingsRate, status };
        },
        seo: buildSeo({
            title: "Aylık Bütçe Hesaplama",
            metaDescription: "Aylık bütçe hesaplama aracıyla gelir, sabit gider, değişken gider ve tasarruf hedefinizi girerek ay sonu kalan tutarı hesaplayın.",
            intro: "Aylık bütçe hesabı, gelirin sabit giderlere, değişken harcamalara ve tasarrufa nasıl dağıldığını gösterir.",
            formula: "Kalan = Gelir - sabit gider - değişken gider - tasarruf hedefi. Tasarruf oranı = tasarruf hedefi / gelir x 100.",
            example: "50.000 TL gelir, 22.000 TL sabit gider, 15.000 TL değişken gider ve 8.000 TL tasarruf hedefinde ay sonu 5.000 TL kalır.",
            interpretation: "Pozitif kalan bütçede esneklik olduğunu, negatif kalan ise hedeflerin yeniden düzenlenmesi gerektiğini gösterir.",
            caution: "Kredi kartı taksitleri, yıllık sigorta gibi seyrek ama büyük giderler aylık karşılık ayrılarak hesaba dahil edilmelidir.",
            links: utilityLinks,
            faq: [
                ["Aylık bütçe nasıl yapılır?", "Önce gelir ve zorunlu giderler yazılır, sonra değişken giderler ve tasarruf hedefi ayrılır."],
                ["Tasarruf oranı kaç olmalı?", "Tek bir doğru oran yoktur; gelir, borç, aile yapısı ve hedeflere göre değişir."],
                ["Sabit gider nedir?", "Kira, aidat, abonelik, kredi taksiti gibi her ay düzenli tekrarlayan giderlerdir."],
                ["Değişken gider nedir?", "Market, dışarıda yemek, ulaşım ve sosyal harcamalar gibi aydan aya değişen kalemlerdir."],
                ["Bütçe açığı çıkarsa ne yapılmalı?", "Önce değişken giderler, sonra hedef ve taksit yapısı gözden geçirilmelidir."],
            ],
        }),
    },
    {
        id: "electricity-consumption",
        slug: "elektrik-tuketim-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Elektrik Tüketim Hesaplama", en: "Electricity Consumption Calculator" },
        h1: { tr: "Elektrik Tüketim Hesaplama - kWh ve Fatura Tahmini", en: "Electricity Consumption Calculator" },
        description: { tr: "Cihaz gücü, kullanım süresi ve birim fiyatla elektrik tüketimini ve yaklaşık maliyeti hesaplayın.", en: "Calculate electricity use and cost." },
        shortDescription: { tr: "Watt değerinden aylık kWh ve maliyet tahmini çıkarın.", en: "Estimate monthly kWh and cost from wattage." },
        relatedCalculators: ["dogalgaz-tuketimi-hesaplama", "su-faturasi-hesaplama", "ev-gider-hesaplama", "yakit-tuketim-maliyet"],
        inputs: [
            numberInput("watt", "Cihaz Gücü", "Device Power", 1200, { suffix: " W", min: 1 }),
            numberInput("hoursPerDay", "Günlük Kullanım", "Daily Use", 3, { suffix: " saat", min: 0, step: 0.25 }),
            numberInput("days", "Kullanım Günü", "Days", 30, { suffix: " gün", min: 1, max: 31 }),
            numberInput("unitPrice", "Birim Fiyat", "Unit Price", 2.5, { suffix: " ₺/kWh", min: 0, step: 0.01 }),
        ],
        results: [
            numberResult("kwh", "Toplam Tüketim", "Total Consumption", " kWh", 2),
            numberResult("cost", "Yaklaşık Tutar", "Estimated Cost", " ₺", 2),
            numberResult("dailyCost", "Günlük Maliyet", "Daily Cost", " ₺", 2),
        ],
        formula: (v) => {
            const kwh = Math.max(0, Number(v.watt) || 0) / 1000 * Math.max(0, Number(v.hoursPerDay) || 0) * Math.max(1, Number(v.days) || 30);
            const cost = kwh * Math.max(0, Number(v.unitPrice) || 0);
            return { kwh, cost, dailyCost: cost / Math.max(1, Number(v.days) || 30) };
        },
        seo: buildSeo({
            title: "Elektrik Tüketim Hesaplama",
            metaDescription: "Elektrik tüketim hesaplama aracıyla cihaz gücü, günlük kullanım süresi ve kWh birim fiyatından aylık tüketim ve fatura tahmini yapın.",
            intro: "Elektrik tüketimi cihazın watt değeri ve kullanım süresiyle hesaplanır. Bu araç tek cihaz veya cihaz grubu için aylık kWh ve maliyet tahmini üretir.",
            formula: "kWh = Watt / 1000 x günlük saat x gün sayısı. Tutar = kWh x birim fiyat.",
            example: "1200 W bir cihaz günde 3 saat, ayda 30 gün çalışırsa 108 kWh tüketir. 2,50 TL/kWh ile maliyet 270 TL olur.",
            interpretation: "Sonuç, hangi cihazların faturayı büyüttüğünü görmenize yardımcı olur; vergiler, kademeler ve dağıtım bedelleri ek fark yaratabilir.",
            caution: "Birim fiyatı kendi tarifenizden girin. Kademe, vergi, güç bedeli veya ortak kullanım gibi kalemler faturayı değiştirebilir.",
            links: utilityLinks,
            faq: [
                ["kWh nasıl hesaplanır?", "Watt değeri 1000'e bölünür, kullanım saati ve gün sayısıyla çarpılır."],
                ["Klima ve ısıtıcı tüketimi neden yüksek çıkar?", "Güç değerleri yüksek ve kullanım süresi uzun olduğu için kWh hızla artar."],
                ["Birim fiyatı nereden bulurum?", "Elektrik faturanızdaki kWh birim bedeli ve toplam bedel kalemlerinden kontrol edebilirsiniz."],
                ["Standby tüketimi hesaba katılır mı?", "Cihaz düşük güçte sürekli çalışıyorsa watt değerini ve kullanım saatini buna göre ekleyebilirsiniz."],
                ["Sonuç faturayla birebir aynı mı?", "Hayır. Fatura kalemleri ve tarife yapısı nedeniyle yaklaşık sonuçtur."],
            ],
        }),
    },
    {
        id: "water-bill",
        slug: "su-faturasi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Su Faturası Hesaplama", en: "Water Bill Calculator" },
        h1: { tr: "Su Faturası Hesaplama - m3 Tüketim ve Tahmini Tutar", en: "Water Bill Calculator" },
        description: { tr: "m3 su tüketimi, su birim fiyatı, atık su oranı ve sabit bedelle tahmini su faturası hesaplayın.", en: "Estimate water bill from cubic meter usage." },
        shortDescription: { tr: "Su tüketiminizi m3 bazında fatura tutarına çevirin.", en: "Convert water usage into estimated bill." },
        relatedCalculators: ["elektrik-tuketim-hesaplama", "dogalgaz-tuketimi-hesaplama", "ev-gider-hesaplama"],
        inputs: [
            numberInput("m3", "Tüketim", "Consumption", 15, { suffix: " m3", min: 0 }),
            numberInput("unitPrice", "Su Birim Fiyatı", "Water Unit Price", 25, { suffix: " ₺/m3", min: 0 }),
            numberInput("wasteWaterRate", "Atık Su Oranı", "Wastewater Rate", 50, { suffix: " %", min: 0, max: 200 }),
            numberInput("fixedFee", "Sabit / Diğer Bedel", "Fixed Fee", 50, { suffix: " ₺", min: 0 }),
        ],
        results: [
            numberResult("waterCost", "Su Bedeli", "Water Cost", " ₺", 2),
            numberResult("wasteWaterCost", "Atık Su Bedeli", "Wastewater Cost", " ₺", 2),
            numberResult("totalCost", "Tahmini Fatura", "Estimated Bill", " ₺", 2),
        ],
        formula: (v) => {
            const waterCost = Math.max(0, Number(v.m3) || 0) * Math.max(0, Number(v.unitPrice) || 0);
            const wasteWaterCost = waterCost * Math.max(0, Number(v.wasteWaterRate) || 0) / 100;
            return { waterCost, wasteWaterCost, totalCost: waterCost + wasteWaterCost + Math.max(0, Number(v.fixedFee) || 0) };
        },
        seo: buildSeo({
            title: "Su Faturası Hesaplama",
            metaDescription: "Su faturası hesaplama aracıyla m3 tüketim, birim fiyat, atık su oranı ve sabit bedel üzerinden yaklaşık fatura tutarını hesaplayın.",
            intro: "Su faturası tüketilen m3 miktarı, su birim fiyatı, atık su bedeli ve sabit kalemlerden oluşur. Bu araç kalemleri ayrı ayrı gösterir.",
            formula: "Su bedeli = tüketim x birim fiyat. Atık su bedeli = su bedeli x atık su oranı. Toplam = su + atık su + sabit bedel.",
            example: "15 m3 tüketim, 25 TL/m3 fiyat, %50 atık su ve 50 TL sabit bedelde toplam yaklaşık 612,50 TL olur.",
            interpretation: "Sonuç fatura ön izlemesidir. Belediye tarifesi, kademe ve vergi kalemleri gerçek tutarı değiştirebilir.",
            caution: "Birim fiyat ve atık su oranı il/ilçe tarifesine göre değişir; kendi faturanızdaki değerleri girmeniz gerekir.",
            links: utilityLinks,
            faq: [
                ["Su faturası m3 nasıl hesaplanır?", "Sayaçtaki dönem tüketimi m3 olarak alınır ve birim fiyatla çarpılır."],
                ["Atık su bedeli nedir?", "Kullanılan suyun kanalizasyon ve arıtma hizmeti için hesaplanan ek bedelidir."],
                ["Kademe tarifesi sonucu değiştirir mi?", "Evet. Bazı yerlerde tüketim arttıkça m3 fiyatı kademeli değişebilir."],
                ["Sabit bedel neden eklenir?", "Sayaç, bakım, çevre veya hizmet kalemleri faturada sabit ya da değişken yer alabilir."],
                ["Bu araç resmi fatura mıdır?", "Hayır. Tarife bilgisi kullanıcı girdisine bağlı tahmini hesaplamadır."],
            ],
        }),
    },
    {
        id: "natural-gas-consumption",
        slug: "dogalgaz-tuketimi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Doğalgaz Tüketimi Hesaplama", en: "Natural Gas Consumption Calculator" },
        h1: { tr: "Doğalgaz Tüketimi Hesaplama - m3 ve Fatura Tahmini", en: "Natural Gas Consumption Calculator" },
        description: { tr: "m3 doğalgaz tüketimi, birim fiyat ve ek bedellerle tahmini fatura tutarınızı hesaplayın.", en: "Estimate natural gas bill from m3 use." },
        shortDescription: { tr: "Doğalgaz m3 tüketimini yaklaşık fatura tutarına çevirin.", en: "Convert gas use into estimated bill." },
        relatedCalculators: ["elektrik-tuketim-hesaplama", "su-faturasi-hesaplama", "ev-gider-hesaplama"],
        inputs: [
            numberInput("m3", "Tüketim", "Consumption", 120, { suffix: " m3", min: 0 }),
            numberInput("unitPrice", "Birim Fiyat", "Unit Price", 8, { suffix: " ₺/m3", min: 0, step: 0.01 }),
            numberInput("fixedFee", "Sabit / Diğer Bedel", "Fixed Fee", 75, { suffix: " ₺", min: 0 }),
            numberInput("taxRate", "Vergi / Ek Oran", "Tax / Extra Rate", 0, { suffix: " %", min: 0, max: 100 }),
        ],
        results: [
            numberResult("consumptionCost", "Tüketim Bedeli", "Consumption Cost", " ₺", 2),
            numberResult("tax", "Ek Vergi / Oran", "Tax / Extra", " ₺", 2),
            numberResult("totalCost", "Tahmini Fatura", "Estimated Bill", " ₺", 2),
        ],
        formula: (v) => {
            const consumptionCost = Math.max(0, Number(v.m3) || 0) * Math.max(0, Number(v.unitPrice) || 0);
            const tax = consumptionCost * Math.max(0, Number(v.taxRate) || 0) / 100;
            return { consumptionCost, tax, totalCost: consumptionCost + tax + Math.max(0, Number(v.fixedFee) || 0) };
        },
        seo: buildSeo({
            title: "Doğalgaz Tüketimi Hesaplama",
            metaDescription: "Doğalgaz tüketimi hesaplama aracıyla m3 kullanım, birim fiyat, sabit bedel ve ek oranlardan yaklaşık fatura tutarını hesaplayın.",
            intro: "Doğalgaz faturası temel olarak m3 tüketim ve birim fiyat üzerinden şekillenir. Sabit bedeller ve ek oranlar toplam faturayı değiştirebilir.",
            formula: "Tüketim bedeli = m3 x birim fiyat. Toplam = tüketim bedeli + sabit bedel + ek oran tutarı.",
            example: "120 m3 tüketim ve 8 TL/m3 fiyatla tüketim bedeli 960 TL olur; 75 TL sabit bedel eklenirse toplam 1.035 TL hesaplanır.",
            interpretation: "Sonuç ısınma ve kullanım bütçesi için tahmini değer sağlar; gerçek fatura dağıtım ve tarife kalemlerine göre değişebilir.",
            caution: "Birim fiyat şehir, dağıtım şirketi, kademe ve dönemsel tarifeye göre değişir. Faturadaki güncel birim fiyatı kullanın.",
            links: utilityLinks,
            faq: [
                ["Doğalgaz faturası nasıl hesaplanır?", "m3 tüketim birim fiyatla çarpılır; sabit ve vergi benzeri kalemler eklenir."],
                ["Kombi sıcaklığı tüketimi etkiler mi?", "Evet. Ev yalıtımı, dış sıcaklık ve kombi ayarı m3 tüketimini belirgin değiştirir."],
                ["m3 ile kWh aynı mı?", "Hayır. Faturada enerji dönüşüm katsayıları yer alabilir; bu araç pratik m3 hesabı yapar."],
                ["Sabit bedel her yerde aynı mı?", "Hayır. Dağıtım bölgesi ve tarife yapısına göre değişebilir."],
                ["Aylık tüketimi nasıl azaltabilirim?", "Yalıtım, oda termostatı, radyatör ayarı ve düzenli kombi bakımı tüketimi düşürebilir."],
            ],
        }),
    },
    {
        id: "vacation-budget",
        slug: "tatil-butcesi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Tatil Bütçesi Hesaplama", en: "Vacation Budget Calculator" },
        h1: { tr: "Tatil Bütçesi Hesaplama - Konaklama, Ulaşım ve Günlük Harcama", en: "Vacation Budget Calculator" },
        description: { tr: "Konaklama, ulaşım, yeme-içme, etkinlik ve güvenlik payıyla toplam tatil bütçenizi hesaplayın.", en: "Estimate total vacation budget." },
        shortDescription: { tr: "Tatilin toplam kişi başı maliyetini planlayın.", en: "Plan total and per-person trip cost." },
        relatedCalculators: ["aylik-butce-hesaplama", "gunluk-harcama-hesaplama", "split-hesaplama", "yakit-tuketim-maliyet"],
        inputs: [
            numberInput("people", "Kişi Sayısı", "People", 2, { min: 1, step: 1 }),
            numberInput("nights", "Gece Sayısı", "Nights", 5, { min: 0, step: 1 }),
            numberInput("nightlyCost", "Gecelik Konaklama", "Nightly Stay", 3000, { suffix: " ₺" }),
            numberInput("transport", "Toplam Ulaşım", "Transport", 8000, { suffix: " ₺" }),
            numberInput("dailyFood", "Günlük Yeme İçme", "Daily Food", 1200, { suffix: " ₺/kişi" }),
            numberInput("activities", "Etkinlik / Müze / Tur", "Activities", 4000, { suffix: " ₺" }),
            numberInput("bufferRate", "Güvenlik Payı", "Buffer", 10, { suffix: " %", min: 0, max: 100 }),
        ],
        results: [
            numberResult("baseTotal", "Ara Toplam", "Subtotal", " ₺", 2),
            numberResult("totalBudget", "Toplam Bütçe", "Total Budget", " ₺", 2),
            numberResult("perPerson", "Kişi Başı", "Per Person", " ₺", 2),
        ],
        formula: (v) => {
            const people = Math.max(1, Number(v.people) || 1);
            const baseTotal = Math.max(0, Number(v.nights) || 0) * Math.max(0, Number(v.nightlyCost) || 0)
                + Math.max(0, Number(v.transport) || 0)
                + Math.max(0, Number(v.dailyFood) || 0) * people * Math.max(1, Number(v.nights) || 1)
                + Math.max(0, Number(v.activities) || 0);
            const totalBudget = baseTotal * (1 + Math.max(0, Number(v.bufferRate) || 0) / 100);
            return { baseTotal, totalBudget, perPerson: totalBudget / people };
        },
        seo: buildSeo({
            title: "Tatil Bütçesi Hesaplama",
            metaDescription: "Tatil bütçesi hesaplama aracıyla konaklama, ulaşım, yeme-içme, etkinlik ve güvenlik payından toplam tatil maliyetini hesaplayın.",
            intro: "Tatil bütçesi yalnız otel fiyatından oluşmaz. Ulaşım, günlük harcama, etkinlik ve beklenmeyen masraflar toplam maliyeti belirler.",
            formula: "Ara toplam = konaklama + ulaşım + günlük kişi başı harcama + etkinlik. Toplam = ara toplam x (1 + güvenlik payı).",
            example: "2 kişi, 5 gece, 3.000 TL gecelik, 8.000 TL ulaşım, kişi başı günlük 1.200 TL yemek ve 4.000 TL etkinlikte ara toplam 39.000 TL olur; %10 payla 42.900 TL gerekir.",
            interpretation: "Kişi başı sonuç, arkadaş veya aile tatillerinde paylaşım planını kolaylaştırır.",
            caution: "Kur, sezon, şehir içi ulaşım, bagaj, bahşiş ve sağlık sigortası gibi kalemler ayrıca değişebilir.",
            links: utilityLinks,
            faq: [
                ["Tatil bütçesinde hangi kalemler olmalı?", "Konaklama, ulaşım, yemek, etkinlik, alışveriş ve beklenmeyen masraf payı düşünülmelidir."],
                ["Güvenlik payı neden eklenir?", "Fiyat değişimi ve unutulan küçük kalemler için bütçeyi daha gerçekçi yapar."],
                ["Kişi başı maliyet nasıl bulunur?", "Toplam bütçe kişi sayısına bölünür."],
                ["Yakıt maliyeti dahil mi?", "Ulaşım alanına toplam yol veya yakıt maliyetini girebilirsiniz."],
                ["Tatil için ne kadar birikim gerekir?", "Toplam bütçeyi kalan aya bölerek aylık birikim hedefi çıkarabilirsiniz."],
            ],
        }),
    },
    {
        id: "home-expense",
        slug: "ev-gider-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Ev Gider Hesaplama", en: "Home Expense Calculator" },
        h1: { tr: "Ev Gider Hesaplama - Kira, Fatura ve Market Toplamı", en: "Home Expense Calculator" },
        description: { tr: "Kira, aidat, elektrik, su, doğalgaz, internet, market ve diğer ev giderlerini tek ekranda toplayın.", en: "Calculate total household expenses." },
        shortDescription: { tr: "Aylık ev masraflarını ve kişi başı payı görün.", en: "See household expenses and per-person share." },
        relatedCalculators: ["aylik-butce-hesaplama", "elektrik-tuketim-hesaplama", "su-faturasi-hesaplama", "dogalgaz-tuketimi-hesaplama"],
        inputs: [
            numberInput("rent", "Kira", "Rent", 25000, { suffix: " ₺" }),
            numberInput("dues", "Aidat", "Dues", 1500, { suffix: " ₺" }),
            numberInput("electricity", "Elektrik", "Electricity", 900, { suffix: " ₺" }),
            numberInput("water", "Su", "Water", 500, { suffix: " ₺" }),
            numberInput("gas", "Doğalgaz", "Gas", 1200, { suffix: " ₺" }),
            numberInput("internet", "İnternet / Telefon", "Internet / Phone", 700, { suffix: " ₺" }),
            numberInput("market", "Market", "Groceries", 12000, { suffix: " ₺" }),
            numberInput("people", "Evdeki Kişi Sayısı", "People", 2, { min: 1, step: 1 }),
        ],
        results: [
            numberResult("total", "Aylık Ev Gideri", "Monthly Home Expense", " ₺", 2),
            numberResult("perPerson", "Kişi Başı Pay", "Per Person", " ₺", 2),
            numberResult("annual", "Yıllık Karşılık", "Annual Total", " ₺", 2),
        ],
        formula: (v) => {
            const total = ["rent", "dues", "electricity", "water", "gas", "internet", "market"].reduce((sum, key) => sum + Math.max(0, Number(v[key]) || 0), 0);
            const people = Math.max(1, Number(v.people) || 1);
            return { total, perPerson: total / people, annual: total * 12 };
        },
        seo: buildSeo({
            title: "Ev Gider Hesaplama",
            metaDescription: "Ev gider hesaplama aracıyla kira, aidat, faturalar, internet ve market harcamalarını toplayarak aylık ev masrafını hesaplayın.",
            intro: "Ev gideri hesabı, hane bütçesinin en büyük ve en düzenli kalemlerini bir araya getirir. Kişi başı payı da ortak yaşamda paylaşımı kolaylaştırır.",
            formula: "Toplam ev gideri = kira + aidat + faturalar + internet + market. Kişi başı = toplam / kişi sayısı.",
            example: "25.000 TL kira, 1.500 TL aidat, 3.300 TL faturalar ve 12.000 TL marketle toplam ev gideri 41.800 TL olur.",
            interpretation: "Sonuç, aylık bütçe ve tasarruf planının temel sabit gider tabanını gösterir.",
            caution: "Tamir, eşya, sigorta ve dönemsel aidat farkları gibi seyrek giderler aylık karşılıkla ayrıca planlanmalıdır.",
            links: utilityLinks,
            faq: [
                ["Ev giderine hangi kalemler dahil edilmeli?", "Kira, aidat, elektrik, su, doğalgaz, internet, market ve düzenli ev hizmetleri dahil edilebilir."],
                ["Kişi başı ev gideri nasıl hesaplanır?", "Toplam aylık ev gideri evdeki kişi sayısına bölünür."],
                ["Yıllık karşılık neden önemli?", "Aylık küçük artışların yıl toplamındaki etkisini gösterir."],
                ["Faturalar değişkense ne yapmalıyım?", "Son 3-6 ay ortalamasını kullanmak daha dengeli sonuç verir."],
                ["Ev gideri aylık bütçeye nasıl bağlanır?", "Aylık bütçe hesabında sabit giderlerin büyük bölümünü bu toplam oluşturur."],
            ],
        }),
    },
    {
        id: "tip",
        slug: "bahsis-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Bahşiş Hesaplama", en: "Tip Calculator" },
        h1: { tr: "Bahşiş Hesaplama - Hesap, Oran ve Kişi Başı Pay", en: "Tip Calculator" },
        description: { tr: "Hesap tutarı, bahşiş oranı ve kişi sayısına göre toplam ve kişi başı ödeme tutarını hesaplayın.", en: "Calculate tip and per-person payment." },
        shortDescription: { tr: "Bahşişi ve kişi başı hesabı hızlıca bölün.", en: "Split bill and tip quickly." },
        relatedCalculators: ["split-hesaplama", "gunluk-harcama-hesaplama", "tatil-butcesi-hesaplama"],
        inputs: [
            numberInput("bill", "Hesap Tutarı", "Bill", 1500, { suffix: " ₺", min: 0 }),
            numberInput("tipRate", "Bahşiş Oranı", "Tip Rate", 10, { suffix: " %", min: 0, max: 100 }),
            numberInput("people", "Kişi Sayısı", "People", 3, { min: 1, step: 1 }),
        ],
        results: [
            numberResult("tipAmount", "Bahşiş Tutarı", "Tip Amount", " ₺", 2),
            numberResult("total", "Toplam Ödeme", "Total", " ₺", 2),
            numberResult("perPerson", "Kişi Başı", "Per Person", " ₺", 2),
        ],
        formula: (v) => {
            const bill = Math.max(0, Number(v.bill) || 0);
            const tipAmount = bill * Math.max(0, Number(v.tipRate) || 0) / 100;
            const total = bill + tipAmount;
            return { tipAmount, total, perPerson: total / Math.max(1, Number(v.people) || 1) };
        },
        seo: buildSeo({
            title: "Bahşiş Hesaplama",
            metaDescription: "Bahşiş hesaplama aracıyla hesap tutarı, bahşiş oranı ve kişi sayısına göre toplam ödeme ve kişi başı payı hesaplayın.",
            intro: "Bahşiş hesabı, restoran veya hizmet ödemelerinde toplam tutarı ve kişi başı paylaşımı hızlıca bulmak için kullanılır.",
            formula: "Bahşiş = hesap tutarı x bahşiş oranı / 100. Toplam = hesap + bahşiş. Kişi başı = toplam / kişi sayısı.",
            example: "1.500 TL hesapta %10 bahşiş 150 TL olur. 3 kişi için toplam 1.650 TL, kişi başı 550 TL ödenir.",
            interpretation: "Sonuç, özellikle grup ödemelerinde hızlı ve şeffaf paylaşım sağlar.",
            caution: "Servis ücreti hesaba dahilse bahşiş oranını buna göre seçin; bazı mekanlarda servis bedeli ayrıca eklenebilir.",
            links: utilityLinks,
            faq: [
                ["Bahşiş nasıl hesaplanır?", "Hesap tutarı bahşiş oranıyla çarpılır ve 100'e bölünür."],
                ["Servis ücreti varsa ne yapılmalı?", "Servis ücreti toplamda varsa ek bahşiş oranını buna göre düşünebilirsiniz."],
                ["Kişi başı ödeme nasıl bulunur?", "Bahşiş dahil toplam tutar kişi sayısına bölünür."],
                ["Bahşiş oranı kaç olmalı?", "Kültüre, hizmete ve kişisel tercihe göre değişir; araç oranı kullanıcıya bırakır."],
                ["Split hesaplama ile farkı nedir?", "Bahşiş aracı tip oranına odaklanır; split aracı daha genel hesap bölme senaryosudur."],
            ],
        }),
    },
    {
        id: "split-bill",
        slug: "split-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Split Hesaplama", en: "Split Bill Calculator" },
        h1: { tr: "Split Hesaplama - Hesabı Kişi Sayısına Göre Böl", en: "Split Bill Calculator" },
        description: { tr: "Toplam hesabı kişi sayısı, bahşiş ve varsa ekstra tutarla bölerek kişi başı ödeme hesaplayın.", en: "Split bill by people with tip and extras." },
        shortDescription: { tr: "Restoran, tatil veya ortak giderlerde kişi başı payı hesaplayın.", en: "Calculate per-person share for shared costs." },
        relatedCalculators: ["bahsis-hesaplama", "tatil-butcesi-hesaplama", "ev-gider-hesaplama"],
        inputs: [
            numberInput("total", "Toplam Hesap", "Total Bill", 2400, { suffix: " ₺", min: 0 }),
            numberInput("people", "Kişi Sayısı", "People", 4, { min: 1, step: 1 }),
            numberInput("tipRate", "Bahşiş / Ek Oran", "Tip / Extra Rate", 0, { suffix: " %", min: 0, max: 100 }),
            numberInput("extra", "Sabit Ek Tutar", "Fixed Extra", 0, { suffix: " ₺", min: 0 }),
        ],
        results: [
            numberResult("grandTotal", "Paylaşılacak Toplam", "Grand Total", " ₺", 2),
            numberResult("perPerson", "Kişi Başı", "Per Person", " ₺", 2),
            numberResult("extraAmount", "Ek Oran Tutarı", "Extra Rate Amount", " ₺", 2),
        ],
        formula: (v) => {
            const total = Math.max(0, Number(v.total) || 0);
            const extraAmount = total * Math.max(0, Number(v.tipRate) || 0) / 100;
            const grandTotal = total + extraAmount + Math.max(0, Number(v.extra) || 0);
            return { grandTotal, perPerson: grandTotal / Math.max(1, Number(v.people) || 1), extraAmount };
        },
        seo: buildSeo({
            title: "Split Hesaplama",
            metaDescription: "Split hesaplama aracıyla toplam hesabı kişi sayısı, bahşiş oranı ve ek tutarlara göre bölerek kişi başı ödemeyi hesaplayın.",
            intro: "Split hesabı, ortak restoran, tatil, ev veya etkinlik giderlerini kişi sayısına göre adil ve hızlı biçimde bölmek için kullanılır.",
            formula: "Paylaşılacak toplam = toplam hesap + ek oran tutarı + sabit ek tutar. Kişi başı = paylaşılacak toplam / kişi sayısı.",
            example: "2.400 TL hesap, 4 kişi ve %10 ek oranla paylaşılacak toplam 2.640 TL, kişi başı 660 TL olur.",
            interpretation: "Sonuç basit eşit paylaşım mantığını gösterir. Farklı tüketim yapan kişiler için ayrıca manuel düzeltme yapılabilir.",
            caution: "Kişiye özel sipariş, kupon, indirim veya servis bedeli varsa toplam tutarı önce netleştirin.",
            links: utilityLinks,
            faq: [
                ["Split hesap ne demek?", "Toplam hesabın kişi sayısına bölünerek kişi başı ödeme tutarının bulunmasıdır."],
                ["Bahşiş dahil edilebilir mi?", "Evet. Bahşiş veya servis oranını ek oran alanına girebilirsiniz."],
                ["Farklı sipariş veren kişiler için uygun mu?", "Eşit paylaşım yapar; farklı tüketimlerde manuel düzeltme gerekebilir."],
                ["Tatil masrafı bölmek için kullanılır mı?", "Evet. Ortak ulaşım veya konaklama gibi kalemlerde pratik olur."],
                ["Kişi sayısı değişirse ne olur?", "Toplam aynı kaldığı için kişi başı ödeme kişi sayısına göre yeniden hesaplanır."],
            ],
        }),
    },
    {
        id: "running-pace",
        slug: "kosu-pace-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Koşu Pace Hesaplama", en: "Running Pace Calculator" },
        h1: { tr: "Koşu Pace Hesaplama - Dakika/Km ve Hız", en: "Running Pace Calculator" },
        description: { tr: "Mesafe ve süre girerek koşu pace değerini, ortalama hızı ve kilometre başına süreyi hesaplayın.", en: "Calculate running pace and speed." },
        shortDescription: { tr: "Koşu sürenizi dakika/km pace ve km/s hıza çevirin.", en: "Convert run time into min/km pace and speed." },
        relatedCalculators: ["maraton-tempo-hesaplama", "vo2-max-hesaplama", "nabiz-araligi-hesaplama", "kalori-yakma-hesaplama"],
        inputs: [
            numberInput("distance", "Mesafe", "Distance", 10, { suffix: " km", min: 0.1, step: 0.1 }),
            numberInput("hours", "Saat", "Hours", 0, { min: 0, step: 1 }),
            numberInput("minutes", "Dakika", "Minutes", 50, { min: 0, max: 59, step: 1 }),
            numberInput("seconds", "Saniye", "Seconds", 0, { min: 0, max: 59, step: 1 }),
        ],
        results: [
            textResult("pace", "Pace", "Pace"),
            numberResult("speed", "Ortalama Hız", "Average Speed", " km/s", 2),
            textResult("fiveK", "5K Tahmini", "5K Estimate"),
        ],
        formula: (v) => {
            const formatDuration = (totalSeconds: number) => {
                const safeSeconds = Math.max(0, Math.round(totalSeconds));
                const hours = Math.floor(safeSeconds / 3600);
                const minutes = Math.floor((safeSeconds % 3600) / 60);
                const seconds = safeSeconds % 60;
                if (hours > 0) {
                    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                }
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            };
            const distance = Math.max(0.1, Number(v.distance) || 0.1);
            const totalSeconds = Math.max(1, (Number(v.hours) || 0) * 3600 + (Number(v.minutes) || 0) * 60 + (Number(v.seconds) || 0));
            const paceSeconds = totalSeconds / distance;
            return {
                pace: `${Math.floor(paceSeconds / 60)}:${Math.round(paceSeconds % 60).toString().padStart(2, "0")} dk/km`,
                speed: distance / (totalSeconds / 3600),
                fiveK: formatDuration(paceSeconds * 5),
            };
        },
        seo: buildSeo({
            title: "Koşu Pace Hesaplama",
            metaDescription: "Koşu pace hesaplama aracıyla mesafe ve süreden dakika/km pace, ortalama hız ve 5K tempo tahmini hesaplayın.",
            intro: "Pace, koşucuların kilometre başına kaç dakikada ilerlediğini gösterir. Yarış temposu ve antrenman planı için en pratik ölçülerden biridir.",
            formula: "Pace = toplam süre / mesafe. Hız = mesafe / süre(saat).",
            example: "10 km'yi 50 dakikada koşarsanız pace 5:00 dk/km, ortalama hız 12 km/s olur.",
            interpretation: "Daha düşük pace daha hızlı koşu anlamına gelir. Sonucu nabız ve VO2 max araçlarıyla birlikte okumak kondisyon takibini güçlendirir.",
            caution: "Pace hedeflerini artırırken sakatlık riskini azaltmak için yüklenmeyi kademeli yapmak gerekir.",
            links: sportLinks,
            faq: [
                ["Pace ne demek?", "Bir kilometreyi kaç dakikada koştuğunuzu gösterir."],
                ["5:00 pace hızlı mı?", "Hedefe ve seviyeye bağlıdır; 5:00 dk/km birçok hobi koşucusu için orta-iyi tempodur."],
                ["Pace ile hız aynı mı?", "Aynı performansı farklı biçimde gösterir; pace dk/km, hız km/s cinsindedir."],
                ["Maraton temposuna nasıl bağlanır?", "Hedef maraton süresi için pace maraton tempo aracıyla hesaplanabilir."],
                ["Koşu bandı için kullanılır mı?", "Evet. Koşu bandındaki mesafe ve süreyle pace hesaplayabilirsiniz."],
            ],
        }),
    },
    {
        id: "marathon-pace",
        slug: "maraton-tempo-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Maraton Tempo Hesaplama", en: "Marathon Pace Calculator" },
        h1: { tr: "Maraton Tempo Hesaplama - Hedef Süreye Göre Pace", en: "Marathon Pace Calculator" },
        description: { tr: "Maraton hedef sürenizden dakika/km pace, 5K split ve yarı maraton geçiş zamanını hesaplayın.", en: "Calculate marathon pace and splits." },
        shortDescription: { tr: "Maraton hedef süreniz için tempo ve split planı çıkarın.", en: "Plan marathon pace and splits." },
        relatedCalculators: ["kosu-pace-hesaplama", "vo2-max-hesaplama", "nabiz-araligi-hesaplama", "yag-yakim-bolgesi-hesaplama"],
        inputs: [
            numberInput("hours", "Hedef Saat", "Target Hours", 4, { min: 1, step: 1 }),
            numberInput("minutes", "Hedef Dakika", "Target Minutes", 0, { min: 0, max: 59, step: 1 }),
        ],
        results: [
            textResult("pace", "Maraton Pace", "Marathon Pace"),
            textResult("fiveKSplit", "5K Split", "5K Split"),
            textResult("halfSplit", "Yarı Maraton Geçişi", "Half Split"),
        ],
        formula: (v) => {
            const formatDuration = (totalSeconds: number) => {
                const safeSeconds = Math.max(0, Math.round(totalSeconds));
                const hours = Math.floor(safeSeconds / 3600);
                const minutes = Math.floor((safeSeconds % 3600) / 60);
                const seconds = safeSeconds % 60;
                if (hours > 0) {
                    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                }
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            };
            const totalSeconds = Math.max(1, (Number(v.hours) || 0) * 3600 + (Number(v.minutes) || 0) * 60);
            const paceSeconds = totalSeconds / 42.195;
            return {
                pace: `${Math.floor(paceSeconds / 60)}:${Math.round(paceSeconds % 60).toString().padStart(2, "0")} dk/km`,
                fiveKSplit: formatDuration(paceSeconds * 5),
                halfSplit: formatDuration(paceSeconds * 21.0975),
            };
        },
        seo: buildSeo({
            title: "Maraton Tempo Hesaplama",
            metaDescription: "Maraton tempo hesaplama aracıyla hedef bitiş sürenize göre dakika/km pace, 5K split ve yarı maraton geçiş zamanını hesaplayın.",
            intro: "Maraton temposu, hedef bitiş süresini 42,195 km boyunca sürdürülebilir pace'e çevirir. Yarış planı yaparken split kontrolü önemlidir.",
            formula: "Maraton pace = hedef toplam süre / 42,195 km. Split süreleri aynı pace ile ilgili mesafe çarpılarak bulunur.",
            example: "4 saatlik maraton hedefinde pace yaklaşık 5:41 dk/km, 5K split yaklaşık 28:26 olur.",
            interpretation: "Splitler, yarış içinde hedefin önünde veya gerisinde olduğunuzu anlamaya yardım eder.",
            caution: "Maraton hedefi yalnız pace ile belirlenmez; haftalık hacim, sakatlık geçmişi, hava, parkur ve beslenme planı da belirleyicidir.",
            links: sportLinks,
            faq: [
                ["Maraton mesafesi kaç km?", "Resmi maraton mesafesi 42,195 km'dir."],
                ["4 saat maraton pace kaç?", "Yaklaşık 5:41 dk/km pace gerekir."],
                ["Negatif split nedir?", "Yarışın ikinci yarısını ilk yarıdan daha hızlı koşma stratejisidir."],
                ["5K split ne işe yarar?", "Yarış içinde tempoyu düzenli kontrol etmeye yarar."],
                ["Bu hesap yarış garantisi verir mi?", "Hayır. Kondisyon, parkur, hava ve beslenme sonucu değiştirir."],
            ],
        }),
    },
    {
        id: "step-distance",
        slug: "adim-mesafe-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Adım Mesafe Hesaplama", en: "Step Distance Calculator" },
        h1: { tr: "Adım Mesafe Hesaplama - Adım Sayısı Kaç Km?", en: "Step Distance Calculator" },
        description: { tr: "Adım sayısı ve adım uzunluğundan yürüyüş veya koşu mesafesini hesaplayın.", en: "Calculate distance from steps and stride length." },
        shortDescription: { tr: "Adım sayınızı kilometre ve metre karşılığına çevirin.", en: "Convert steps to distance." },
        relatedCalculators: ["adim-kalori-hesaplama", "kalori-yakma-hesaplama", "kosu-pace-hesaplama"],
        inputs: [
            numberInput("steps", "Adım Sayısı", "Steps", 8000, { min: 0, step: 100 }),
            numberInput("strideCm", "Adım Uzunluğu", "Stride Length", 75, { suffix: " cm", min: 30, max: 150 }),
        ],
        results: [
            numberResult("meters", "Mesafe", "Distance", " m", 0),
            numberResult("kilometers", "Mesafe", "Distance", " km", 2),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const meters = Math.max(0, Number(v.steps) || 0) * Math.max(0, Number(v.strideCm) || 0) / 100;
            return { meters, kilometers: meters / 1000, note: "Koşuda adım uzunluğu yürüyüşten farklı olabilir; ölçümü aktivite türüne göre girin." };
        },
        seo: buildSeo({
            title: "Adım Mesafe Hesaplama",
            metaDescription: "Adım mesafe hesaplama aracıyla adım sayısı ve adım uzunluğundan yürüyüş ya da koşu mesafesini metre ve kilometre olarak hesaplayın.",
            intro: "Adım mesafe hesabı, pedometre veya telefon adım sayısını gerçek mesafeye çevirmek için kullanılır.",
            formula: "Mesafe(m) = adım sayısı x adım uzunluğu(cm) / 100. Kilometre = metre / 1000.",
            example: "8.000 adım ve 75 cm adım uzunluğu 6.000 metre, yani 6 km eder.",
            interpretation: "Sonuç günlük hareket, yürüyüş hedefi ve koşu dışı aktivite takibi için kullanılabilir.",
            caution: "Telefon ve saat adım sayıları, cihaz konumu ve hareket biçimine göre sapabilir.",
            links: sportLinks,
            faq: [
                ["10 bin adım kaç km?", "75 cm adım uzunluğunda yaklaşık 7,5 km eder."],
                ["Adım uzunluğu nasıl ölçülür?", "Bilinen bir mesafeyi yürüyüp metreyi adım sayısına bölerek ölçebilirsiniz."],
                ["Koşu ve yürüyüş adımı aynı mı?", "Hayır. Koşuda adım uzunluğu genellikle daha uzundur."],
                ["Bu araç kalori de hesaplar mı?", "Bu sayfa mesafeye odaklanır; kalori için adım kalori aracını kullanabilirsiniz."],
                ["Çocuklarda kullanılabilir mi?", "Evet, ancak adım uzunluğu yetişkinlerden farklı olduğu için ayrı ölçülmelidir."],
            ],
        }),
    },
    {
        id: "vo2-max",
        slug: "vo2-max-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "VO2 Max Hesaplama", en: "VO2 Max Calculator" },
        h1: { tr: "VO2 Max Hesaplama - Cooper 12 Dakika Testi", en: "VO2 Max Calculator" },
        description: { tr: "Cooper 12 dakika koşu testinde kat edilen mesafeye göre tahmini VO2 max değerinizi hesaplayın.", en: "Estimate VO2 max from Cooper test distance." },
        shortDescription: { tr: "12 dakikada koştuğunuz mesafeden aerobik kapasite tahmini alın.", en: "Estimate aerobic capacity from 12-minute run." },
        relatedCalculators: ["kosu-pace-hesaplama", "maraton-tempo-hesaplama", "nabiz-araligi-hesaplama", "kalori-yakma-hesaplama"],
        inputs: [
            numberInput("distanceMeters", "12 Dakikada Mesafe", "12-minute Distance", 2400, { suffix: " m", min: 500 }),
        ],
        results: [
            numberResult("vo2", "Tahmini VO2 Max", "Estimated VO2 Max", " ml/kg/dk", 1),
            textResult("category", "Kategori", "Category"),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const distance = Math.max(0, Number(v.distanceMeters) || 0);
            const vo2 = Math.max(0, (distance - 504.9) / 44.73);
            const category = vo2 >= 50 ? "Çok iyi aerobik kapasite" : vo2 >= 40 ? "İyi aerobik kapasite" : vo2 >= 30 ? "Orta seviye" : "Geliştirilebilir seviye";
            return { vo2, category, note: "Cooper testi saha tahminidir; laboratuvar VO2 max testi kadar kesin değildir." };
        },
        seo: buildSeo({
            title: "VO2 Max Hesaplama",
            metaDescription: "VO2 max hesaplama aracıyla Cooper 12 dakika koşu testinde kat ettiğiniz mesafeden tahmini aerobik kapasitenizi hesaplayın.",
            intro: "VO2 max, vücudun yoğun egzersizde kullanabildiği oksijen kapasitesini ifade eder. Cooper testi saha koşullarında pratik bir tahmin sunar.",
            formula: "VO2 max = (12 dakikada koşulan mesafe(metre) - 504,9) / 44,73.",
            example: "12 dakikada 2.400 metre koşan biri için VO2 max = (2400 - 504,9) / 44,73 = yaklaşık 42,4 ml/kg/dk.",
            interpretation: "Daha yüksek VO2 max genellikle daha iyi aerobik kapasiteyi gösterir; yaş, cinsiyet ve antrenman geçmişiyle birlikte yorumlanmalıdır.",
            caution: "Cooper testi yoğun efor gerektirir. Kalp, tansiyon veya sakatlık riski olan kişiler tıbbi onay almadan maksimal test yapmamalıdır.",
            links: sportLinks,
            faq: [
                ["VO2 max nedir?", "Vücudun egzersiz sırasında kilogram başına dakikada kullanabildiği oksijen miktarıdır."],
                ["Cooper testi nasıl yapılır?", "12 dakika boyunca güvenli bir parkurda mümkün olduğunca fazla mesafe koşulur."],
                ["VO2 max sonucu kesin mi?", "Hayır. Cooper testi tahmindir; laboratuvar ölçümü daha doğrudur."],
                ["VO2 max nasıl artırılır?", "Düzenli aerobik koşular, tempo çalışmaları ve interval antrenmanları yardımcı olabilir."],
                ["Yeni başlayanlar test yapmalı mı?", "Önce temel kondisyon oluşturmak ve gerekiyorsa sağlık kontrolü almak daha güvenlidir."],
            ],
        }),
    },
    {
        id: "fat-burning-zone",
        slug: "yag-yakim-bolgesi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Yağ Yakım Bölgesi Hesaplama", en: "Fat Burning Zone Calculator" },
        h1: { tr: "Yağ Yakım Bölgesi Hesaplama - Karvonen Nabız Aralığı", en: "Fat Burning Zone Calculator" },
        description: { tr: "Yaş ve dinlenik nabza göre yağ yakım için kullanılan tahmini nabız aralığını hesaplayın.", en: "Calculate fat burning heart-rate zone." },
        shortDescription: { tr: "Yağ yakım bölgesi için nabız hedef aralığını görün.", en: "See target fat-burning heart-rate range." },
        relatedCalculators: ["nabiz-araligi-hesaplama", "kalori-yakma-hesaplama", "vo2-max-hesaplama", "kardiyo-suresi"],
        inputs: [
            numberInput("age", "Yaş", "Age", 35, { min: 10, max: 90 }),
            numberInput("restingHr", "Dinlenik Nabız", "Resting Heart Rate", 65, { suffix: " bpm", min: 35, max: 120 }),
        ],
        results: [
            textResult("zone", "Yağ Yakım Bölgesi", "Fat Burning Zone"),
            numberResult("maxHr", "Tahmini Maksimum Nabız", "Estimated Max HR", " bpm", 0),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const age = Math.max(1, Number(v.age) || 0);
            const restingHr = Math.max(0, Number(v.restingHr) || 0);
            const maxHr = 220 - age;
            const reserve = Math.max(0, maxHr - restingHr);
            const low = Math.round(restingHr + reserve * 0.6);
            const high = Math.round(restingHr + reserve * 0.7);
            return { zone: `${low}-${high} bpm`, maxHr, note: "Yağ yakım bölgesi toplam kilo kaybını garanti etmez; kalori dengesi ve sürdürülebilirlik önemlidir." };
        },
        seo: buildSeo({
            title: "Yağ Yakım Bölgesi Hesaplama",
            metaDescription: "Yağ yakım bölgesi hesaplama aracıyla yaş ve dinlenik nabza göre Karvonen yöntemiyle tahmini hedef nabız aralığını bulun.",
            intro: "Yağ yakım bölgesi, genellikle orta yoğunluklu kardiyo sırasında kullanılan nabız aralığını ifade eder. Bu aralık sürdürülebilir egzersiz için pratik olabilir.",
            formula: "Maksimum nabız = 220 - yaş. Nabız rezervi = maksimum - dinlenik. Yağ yakım bölgesi = dinlenik + rezervin %60-70'i.",
            example: "35 yaş ve 65 dinlenik nabız için maksimum 185, rezerv 120; yağ yakım bölgesi 137-149 bpm olur.",
            interpretation: "Bölge, uzun süre sürdürülebilir kardiyo temposunu gösterir. Yağ kaybı için toplam kalori dengesi yine belirleyicidir.",
            caution: "Kalp-damar hastalığı, tansiyon veya ilaç kullanımı varsa hedef nabız mutlaka hekimle değerlendirilmelidir.",
            links: sportLinks,
            faq: [
                ["Yağ yakım bölgesi gerçekten yağ yakar mı?", "Bu bölgede enerji katkısında yağ oranı yükselebilir; ancak toplam yağ kaybı kalori dengesine bağlıdır."],
                ["Daha yüksek nabız daha iyi mi?", "Her zaman değil. Yüksek yoğunluk daha fazla yorgunluk yaratabilir; hedefe göre planlanmalıdır."],
                ["Karvonen yöntemi nedir?", "Dinlenik nabzı ve nabız rezervini kullanarak kişisel hedef aralık hesaplayan yöntemdir."],
                ["Yağ yakım bölgesi kaç dakika sürmeli?", "Kondisyona göre değişir; başlangıç için kısa süreler, ilerledikçe daha uzun kardiyo planlanabilir."],
                ["Nabız saati olmadan kullanılır mı?", "Evet, ancak gerçek takip için nabız ölçer daha kullanışlıdır."],
            ],
        }),
    },
    {
        id: "muscle-mass",
        slug: "kas-kutlesi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Kas Kütlesi Hesaplama", en: "Muscle Mass Calculator" },
        h1: { tr: "Kas Kütlesi Hesaplama - Yağsız Kütle ve Tahmini Kas", en: "Muscle Mass Calculator" },
        description: { tr: "Kilo ve vücut yağ oranından yağ kütlesi, yağsız kütle ve tahmini kas kütlesi hesaplayın.", en: "Estimate lean mass and muscle mass." },
        shortDescription: { tr: "Vücut yağ oranından yağsız kütle hesabı yapın.", en: "Estimate lean mass from body fat." },
        relatedCalculators: ["vucut-yag-orani-hesaplama", "gunluk-protein-ihtiyaci-hesaplama", "antrenman-hacmi", "spor-hedef-hesaplama"],
        inputs: [
            numberInput("weight", "Kilo", "Weight", 75, { suffix: " kg", min: 20 }),
            numberInput("bodyFat", "Vücut Yağ Oranı", "Body Fat", 20, { suffix: " %", min: 3, max: 60 }),
        ],
        results: [
            numberResult("fatMass", "Yağ Kütlesi", "Fat Mass", " kg", 1),
            numberResult("leanMass", "Yağsız Kütle", "Lean Mass", " kg", 1),
            numberResult("estimatedMuscle", "Tahmini İskelet Kası", "Estimated Muscle", " kg", 1),
        ],
        formula: (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const bodyFat = Math.min(60, Math.max(3, Number(v.bodyFat) || 0));
            const fatMass = weight * bodyFat / 100;
            const leanMass = weight - fatMass;
            return { fatMass, leanMass, estimatedMuscle: leanMass * 0.55 };
        },
        seo: buildSeo({
            title: "Kas Kütlesi Hesaplama",
            metaDescription: "Kas kütlesi hesaplama aracıyla kilo ve vücut yağ oranından yağ kütlesi, yağsız kütle ve tahmini iskelet kası miktarını hesaplayın.",
            intro: "Kas kütlesi hesabı pratikte vücut yağ oranından yağsız kütleyi bulmaya dayanır. İskelet kası tahmini ise yalnız yaklaşık bir göstergedir.",
            formula: "Yağ kütlesi = kilo x yağ oranı. Yağsız kütle = kilo - yağ kütlesi. Tahmini iskelet kası = yağsız kütle x 0,55.",
            example: "75 kg ve %20 yağ oranında yağ kütlesi 15 kg, yağsız kütle 60 kg, tahmini iskelet kası yaklaşık 33 kg olur.",
            interpretation: "Yağsız kütle kas, kemik, su ve organları içerir; doğrudan saf kas ölçümü değildir.",
            caution: "BIA tartı, DEXA ve antropometrik ölçümler farklı sonuç verebilir. Klinik veya sporcu takibinde profesyonel ölçüm daha uygundur.",
            links: strengthLinks,
            faq: [
                ["Yağsız kütle kas kütlesi midir?", "Tam olarak değil; kasın yanında kemik, su ve organ dokularını da içerir."],
                ["Kas kütlesi nasıl artırılır?", "Direnç egzersizi, yeterli protein, uyku ve programlı progresif yüklenme temel etkenlerdir."],
                ["Bu hesap DEXA yerine geçer mi?", "Hayır. Yaklaşık tahmindir; DEXA daha ayrıntılı ölçüm sağlar."],
                ["Vücut yağ oranı yanlışsa ne olur?", "Sonuç doğrudan değişir; ölçümü mümkün olduğunca tutarlı alın."],
                ["Spor hedef hesabıyla birlikte kullanılabilir mi?", "Evet. Kas kazanımı veya yağ kaybı hedeflerini planlarken destekleyici olur."],
            ],
        }),
    },
    {
        id: "bench-press-max",
        slug: "bench-press-max",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Bench Press Max Hesaplama", en: "Bench Press Max Calculator" },
        h1: { tr: "Bench Press Max Hesaplama", en: "Bench Press Max Calculator" },
        description: { tr: "Bench press için kaldırdığınız ağırlık ve tekrar sayısından tahmini tek tekrar maksimumunuzu hesaplayın.", en: "Estimate your bench press one-rep max." },
        shortDescription: { tr: "Epley ve Brzycki formülleriyle tahmini bench press 1RM değerini görün.", en: "Estimate bench press 1RM with Epley and Brzycki formulas." },
        relatedCalculators: ["squat-max", "deadlift-max", "antrenman-hacmi", "set-tekrar-hesaplama"],
        inputs: [
            numberInput("weight", "Kaldırılan Ağırlık", "Lifted Weight", 80, { suffix: " kg", min: 0 }),
            numberInput("reps", "Tekrar Sayısı", "Reps", 5, { min: 1, max: 20, step: 1 }),
        ],
        results: [
            numberResult("epley", "Epley 1RM", "Epley 1RM", " kg", 1),
            numberResult("brzycki", "Brzycki 1RM", "Brzycki 1RM", " kg", 1),
            numberResult("average", "Ortalama Tahmini Max", "Average Estimated Max", " kg", 1),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const reps = Math.min(20, Math.max(1, Number(v.reps) || 1));
            const epley = weight * (1 + reps / 30);
            const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : epley;
            const average = (epley + brzycki) / 2;
            return {
                epley,
                brzycki,
                average,
                note: `Bench press için tahmini 1RM yaklaşık ${average.toFixed(1)} kg. Maksimum denemeler güvenlik ekipmanı, spotter ve uygun teknik olmadan yapılmamalıdır.`,
            };
        },
        seo: buildSeo({
            title: "Bench Press Max Hesaplama",
            metaDescription: "Bench press max hesaplama aracıyla ağırlık ve tekrar sayısından tahmini 1 tekrar maksimumu Epley ve Brzycki formülleriyle hesaplayın.",
            intro: "Bench press performansını takip ederken her hafta gerçek maksimum denemesi yapmak gereksiz risk yaratabilir. Bu araç çok tekrarlı setten tahmini tek tekrar maksimumu üretir.",
            formula: "Epley 1RM = Ağırlık x (1 + Tekrar / 30). Brzycki 1RM = Ağırlık x 36 / (37 - Tekrar).",
            example: "80 kg ile 5 tekrar yaptıysanız Epley sonucu yaklaşık 93,3 kg olur.",
            interpretation: "Sonuç yarışma denemesi değil, antrenman yüzdesi belirlemek için kullanılan yaklaşık değerdir. 10 tekrar üzerindeki setlerde hata payı artabilir.",
            caution: "Ağır maksimum denemeleri sakatlık riski taşır. Ağrı, teknik bozulma veya yorgunluk varsa deneme yapılmamalı; gerekiyorsa antrenör desteği alınmalıdır.",
            links: strengthLinks,
            faq: [
                ["Bench press 1RM hesabı ne kadar doğru?", "3-8 tekrar aralığında daha kullanışlı tahmin verir; çok yüksek tekrar setlerinde hata payı artar."],
                ["Epley ve Brzycki neden farklı çıkar?", "Formüller tekrar-yük ilişkisini farklı varsayımlarla modeller; bu yüzden aralık olarak okumak daha doğrudur."],
                ["Maksimum deneme yerine kullanılabilir mi?", "Antrenman yükü planlamak için evet; resmi yarışma veya gerçek maksimumun yerini birebir tutmaz."],
                ["Bench press yüzdesi nasıl seçilir?", "Kuvvet için çoğu program 1RM'nin %75-90 aralığını, hacim için daha düşük yüzdeleri kullanır."],
                ["Yeni başlayanlar 1RM denemeli mi?", "Genellikle önce teknik ve hareket kalitesi oturtulmalı, doğrudan maksimum denemelerden kaçınılmalıdır."],
            ],
        }),
    },
    {
        id: "squat-max",
        slug: "squat-max",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Squat Max Hesaplama", en: "Squat Max Calculator" },
        h1: { tr: "Squat Max Hesaplama", en: "Squat Max Calculator" },
        description: { tr: "Squat için kaldırdığınız ağırlık ve tekrar sayısından tahmini tek tekrar maksimumunuzu hesaplayın.", en: "Estimate your squat one-rep max." },
        shortDescription: { tr: "Epley ve Brzycki formülleriyle tahmini squat 1RM değerini görün.", en: "Estimate squat 1RM with Epley and Brzycki formulas." },
        relatedCalculators: ["bench-press-max", "deadlift-max", "antrenman-hacmi", "set-tekrar-hesaplama"],
        inputs: [
            numberInput("weight", "Kaldırılan Ağırlık", "Lifted Weight", 100, { suffix: " kg", min: 0 }),
            numberInput("reps", "Tekrar Sayısı", "Reps", 5, { min: 1, max: 20, step: 1 }),
        ],
        results: [
            numberResult("epley", "Epley 1RM", "Epley 1RM", " kg", 1),
            numberResult("brzycki", "Brzycki 1RM", "Brzycki 1RM", " kg", 1),
            numberResult("average", "Ortalama Tahmini Max", "Average Estimated Max", " kg", 1),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const reps = Math.min(20, Math.max(1, Number(v.reps) || 1));
            const epley = weight * (1 + reps / 30);
            const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : epley;
            const average = (epley + brzycki) / 2;
            return {
                epley,
                brzycki,
                average,
                note: `Squat için tahmini 1RM yaklaşık ${average.toFixed(1)} kg. Maksimum denemeler güvenlik ekipmanı, spotter ve uygun teknik olmadan yapılmamalıdır.`,
            };
        },
        seo: buildSeo({
            title: "Squat Max Hesaplama",
            metaDescription: "Squat max hesaplama aracıyla ağırlık ve tekrar sayısından tahmini 1 tekrar maksimumu Epley ve Brzycki formülleriyle hesaplayın.",
            intro: "Squat performansını takip ederken her hafta gerçek maksimum denemesi yapmak gereksiz risk yaratabilir. Bu araç çok tekrarlı setten tahmini tek tekrar maksimumu üretir.",
            formula: "Epley 1RM = Ağırlık x (1 + Tekrar / 30). Brzycki 1RM = Ağırlık x 36 / (37 - Tekrar).",
            example: "100 kg ile 5 tekrar yaptıysanız Epley sonucu yaklaşık 116,7 kg olur.",
            interpretation: "Sonuç yarışma denemesi değil, antrenman yüzdesi belirlemek için kullanılan yaklaşık değerdir. Hareket derinliği ve teknik standart sonucu etkiler.",
            caution: "Ağır squat denemeleri sakatlık riski taşır. Emniyet barı, spotter ve uygun teknik olmadan maksimum deneme yapılmamalıdır.",
            links: strengthLinks,
            faq: [
                ["Squat 1RM hesabı ne kadar doğru?", "3-8 tekrar aralığında daha kullanışlı tahmin verir; çok yüksek tekrar setlerinde hata payı artar."],
                ["Squat derinliği sonucu etkiler mi?", "Evet. Farklı hareket açıklıkları aynı ağırlıkla farklı performans anlamına gelir."],
                ["Maksimum deneme yerine kullanılabilir mi?", "Antrenman yükü planlamak için evet; resmi yarışma veya gerçek maksimumun yerini birebir tutmaz."],
                ["Squat yüzdesi nasıl seçilir?", "Kuvvet için çoğu program 1RM'nin %75-90 aralığını, hacim için daha düşük yüzdeleri kullanır."],
                ["Yeni başlayanlar 1RM denemeli mi?", "Genellikle önce teknik ve hareket kalitesi oturtulmalı, doğrudan maksimum denemelerden kaçınılmalıdır."],
            ],
        }),
    },
    {
        id: "deadlift-max",
        slug: "deadlift-max",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Deadlift Max Hesaplama", en: "Deadlift Max Calculator" },
        h1: { tr: "Deadlift Max Hesaplama", en: "Deadlift Max Calculator" },
        description: { tr: "Deadlift için kaldırdığınız ağırlık ve tekrar sayısından tahmini tek tekrar maksimumunuzu hesaplayın.", en: "Estimate your deadlift one-rep max." },
        shortDescription: { tr: "Epley ve Brzycki formülleriyle tahmini deadlift 1RM değerini görün.", en: "Estimate deadlift 1RM with Epley and Brzycki formulas." },
        relatedCalculators: ["bench-press-max", "squat-max", "antrenman-hacmi", "set-tekrar-hesaplama"],
        inputs: [
            numberInput("weight", "Kaldırılan Ağırlık", "Lifted Weight", 120, { suffix: " kg", min: 0 }),
            numberInput("reps", "Tekrar Sayısı", "Reps", 5, { min: 1, max: 20, step: 1 }),
        ],
        results: [
            numberResult("epley", "Epley 1RM", "Epley 1RM", " kg", 1),
            numberResult("brzycki", "Brzycki 1RM", "Brzycki 1RM", " kg", 1),
            numberResult("average", "Ortalama Tahmini Max", "Average Estimated Max", " kg", 1),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const reps = Math.min(20, Math.max(1, Number(v.reps) || 1));
            const epley = weight * (1 + reps / 30);
            const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : epley;
            const average = (epley + brzycki) / 2;
            return {
                epley,
                brzycki,
                average,
                note: `Deadlift için tahmini 1RM yaklaşık ${average.toFixed(1)} kg. Maksimum denemeler güvenlik ekipmanı ve uygun teknik olmadan yapılmamalıdır.`,
            };
        },
        seo: buildSeo({
            title: "Deadlift Max Hesaplama",
            metaDescription: "Deadlift max hesaplama aracıyla ağırlık ve tekrar sayısından tahmini 1 tekrar maksimumu Epley ve Brzycki formülleriyle hesaplayın.",
            intro: "Deadlift performansını takip ederken her hafta gerçek maksimum denemesi yapmak gereksiz risk yaratabilir. Bu araç çok tekrarlı setten tahmini tek tekrar maksimumu üretir.",
            formula: "Epley 1RM = Ağırlık x (1 + Tekrar / 30). Brzycki 1RM = Ağırlık x 36 / (37 - Tekrar).",
            example: "120 kg ile 5 tekrar yaptıysanız Epley sonucu yaklaşık 140,0 kg olur.",
            interpretation: "Sonuç yarışma denemesi değil, antrenman yüzdesi belirlemek için kullanılan yaklaşık değerdir. Kavrama, yorgunluk ve teknik sonucu etkiler.",
            caution: "Ağır deadlift denemeleri bel ve kalça hattında yüksek yük oluşturur. Ağrı veya teknik bozulma varsa deneme yapılmamalıdır.",
            links: strengthLinks,
            faq: [
                ["Deadlift 1RM hesabı ne kadar doğru?", "3-8 tekrar aralığında daha kullanışlı tahmin verir; çok yüksek tekrar setlerinde hata payı artar."],
                ["Kemer veya straps sonucu etkiler mi?", "Evet. Ekipman, kavrama ve gövde stabilitesi performansı değiştirebilir."],
                ["Maksimum deneme yerine kullanılabilir mi?", "Antrenman yükü planlamak için evet; resmi yarışma veya gerçek maksimumun yerini birebir tutmaz."],
                ["Deadlift yüzdesi nasıl seçilir?", "Kuvvet için çoğu program 1RM'nin %75-90 aralığını, hacim için daha düşük yüzdeleri kullanır."],
                ["Yeni başlayanlar 1RM denemeli mi?", "Genellikle önce teknik ve hareket kalitesi oturtulmalı, doğrudan maksimum denemelerden kaçınılmalıdır."],
            ],
        }),
    },
    {
        id: "sport-goal",
        slug: "spor-hedef-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Spor Hedef Hesaplama", en: "Fitness Goal Calculator" },
        h1: { tr: "Spor Hedef Hesaplama - Kilo, Süre ve Kalori Hedefi", en: "Fitness Goal Calculator" },
        description: { tr: "Mevcut kilo, hedef kilo ve haftalık değişim hedefinden süre ve günlük kalori farkını hesaplayın.", en: "Estimate timeline and daily calorie change for fitness goals." },
        shortDescription: { tr: "Kilo alma veya verme hedefiniz için yaklaşık süreyi bulun.", en: "Estimate timeline for weight goals." },
        relatedCalculators: ["gunluk-kalori-ihtiyaci", "gunluk-makro-besin-ihtiyaci-hesaplama", "kas-kutlesi-hesaplama", "kalori-yakma-hesaplama"],
        inputs: [
            numberInput("currentWeight", "Mevcut Kilo", "Current Weight", 80, { suffix: " kg" }),
            numberInput("targetWeight", "Hedef Kilo", "Target Weight", 75, { suffix: " kg" }),
            numberInput("weeklyChange", "Haftalık Değişim Hedefi", "Weekly Change", 0.5, { suffix: " kg/hafta", min: 0.1, step: 0.1 }),
        ],
        results: [
            numberResult("weeks", "Tahmini Süre", "Estimated Duration", " hafta", 1),
            numberResult("dailyCalories", "Günlük Kalori Farkı", "Daily Calorie Change", " kcal", 0),
            textResult("direction", "Hedef Tipi", "Goal Type"),
        ],
        formula: (v) => {
            const current = Number(v.currentWeight) || 0;
            const target = Number(v.targetWeight) || 0;
            const weekly = Math.max(0.1, Number(v.weeklyChange) || 0.5);
            const diff = target - current;
            const weeks = Math.abs(diff) / weekly;
            const dailyCalories = weekly * 7700 / 7;
            return {
                weeks,
                dailyCalories,
                direction: diff < 0 ? "Kilo verme hedefi - günlük açık gerekir." : diff > 0 ? "Kilo alma hedefi - günlük fazlalık gerekir." : "Kilo koruma hedefi.",
            };
        },
        seo: buildSeo({
            title: "Spor Hedef Hesaplama",
            metaDescription: "Spor hedef hesaplama aracıyla mevcut kilo, hedef kilo ve haftalık değişim hızından tahmini süre ve günlük kalori farkını hesaplayın.",
            intro: "Spor hedef hesabı, kilo verme veya alma hedefini zamana yayarak günlük kalori farkını tahmin eder.",
            formula: "Süre = hedef kilo farkı / haftalık değişim. Günlük kalori farkı yaklaşık haftalık kg x 7700 / 7.",
            example: "80 kg'dan 75 kg'a haftada 0,5 kg hedefle inmek yaklaşık 10 hafta sürer; günlük yaklaşık 550 kcal açık gerekir.",
            interpretation: "Sonuç planlama içindir. Performans, kas kazanımı ve sağlık için sadece tartı hedefi yeterli değildir.",
            caution: "Çok hızlı kilo değişimi sürdürülemez olabilir. Gebelik, kronik hastalık, yeme bozukluğu öyküsü veya ilaç kullanımı varsa uzman desteği alınmalıdır.",
            links: hydrationMacroLinks,
            faq: [
                ["Haftada kaç kilo vermek mantıklı?", "Çoğu kişi için 0,25-0,75 kg aralığı daha sürdürülebilir kabul edilir."],
                ["7700 kcal kuralı kesin mi?", "Yaklaşık bir modeldir; metabolik uyum ve su değişimleri sonucu etkileyebilir."],
                ["Kas kazanırken kilo artması normal mi?", "Evet. Yağ kaybı ve kas kazanımı aynı anda tartı sonucunu karmaşık hale getirebilir."],
                ["Hedef kilo yerine ölçü takip edilir mi?", "Evet. Bel çevresi, performans ve fotoğraf takibi daha bütüncül bilgi verir."],
                ["Günlük kalori farkını nasıl uygularım?", "Kalori ihtiyacı ve makro araçlarıyla hedefinizi beslenme planına çevirebilirsiniz."],
            ],
        }),
    },
    {
        id: "training-volume",
        slug: "antrenman-hacmi",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Antrenman Hacmi Hesaplama", en: "Training Volume Calculator" },
        h1: { tr: "Antrenman Hacmi Hesaplama - Set x Tekrar x Ağırlık", en: "Training Volume Calculator" },
        description: { tr: "Set, tekrar, ağırlık ve haftalık frekanstan toplam antrenman hacmini hesaplayın.", en: "Calculate training volume." },
        shortDescription: { tr: "Bir hareketin set, tekrar ve ağırlık hacmini görün.", en: "Calculate set-rep-load volume." },
        relatedCalculators: ["bench-press-max", "squat-max", "deadlift-max", "set-tekrar-hesaplama", "dinlenme-suresi"],
        inputs: [
            numberInput("sets", "Set", "Sets", 4, { min: 1, step: 1 }),
            numberInput("reps", "Tekrar", "Reps", 8, { min: 1, step: 1 }),
            numberInput("weight", "Ağırlık", "Weight", 80, { suffix: " kg", min: 0 }),
            numberInput("sessions", "Haftalık Sıklık", "Weekly Sessions", 2, { suffix: " gün", min: 1, step: 1 }),
        ],
        results: [
            numberResult("sessionVolume", "Seans Hacmi", "Session Volume", " kg", 0),
            numberResult("weeklyVolume", "Haftalık Hacim", "Weekly Volume", " kg", 0),
            numberResult("totalReps", "Toplam Tekrar", "Total Reps", "", 0),
        ],
        formula: (v) => {
            const sets = Math.max(1, Number(v.sets) || 1);
            const reps = Math.max(1, Number(v.reps) || 1);
            const weight = Math.max(0, Number(v.weight) || 0);
            const sessions = Math.max(1, Number(v.sessions) || 1);
            const sessionVolume = sets * reps * weight;
            return { sessionVolume, weeklyVolume: sessionVolume * sessions, totalReps: sets * reps * sessions };
        },
        seo: buildSeo({
            title: "Antrenman Hacmi Hesaplama",
            metaDescription: "Antrenman hacmi hesaplama aracıyla set, tekrar, ağırlık ve haftalık frekanstan seans ve haftalık toplam hacmi hesaplayın.",
            intro: "Antrenman hacmi, direnç egzersizinde toplam iş miktarını izlemek için kullanılır. Set, tekrar ve ağırlığın çarpımı temel hacmi verir.",
            formula: "Seans hacmi = set x tekrar x ağırlık. Haftalık hacim = seans hacmi x haftalık seans sayısı.",
            example: "4 set, 8 tekrar, 80 kg ve haftada 2 seans için seans hacmi 2.560 kg, haftalık hacim 5.120 kg olur.",
            interpretation: "Hacim artışı gelişimi destekleyebilir; ancak toparlanma, teknik ve yoğunlukla birlikte yönetilmelidir.",
            caution: "Haftalık hacmi aniden artırmak sakatlık riskini yükseltebilir. Ağrı veya performans düşüşünde yük azaltılmalıdır.",
            links: strengthLinks,
            faq: [
                ["Antrenman hacmi nedir?", "Set, tekrar ve ağırlık üzerinden hesaplanan toplam iş miktarıdır."],
                ["Hacim arttıkça kas artar mı?", "Uygun toparlanma ve beslenmeyle desteklenirse yardımcı olabilir; sınırsız artış daha iyi değildir."],
                ["Vücut ağırlığı hareketlerinde nasıl kullanılır?", "Ağırlık alanına vücut ağırlığının ilgili kısmını veya ek yükü girebilirsiniz."],
                ["Haftalık hacim neden önemli?", "Aynı kas grubuna verilen toplam yükü izlemeyi sağlar."],
                ["Yoğunluk hacimden farklı mı?", "Evet. Yoğunluk genellikle 1RM yüzdesi veya zorlanma düzeyini ifade eder."],
            ],
        }),
    },
    {
        id: "set-rep",
        slug: "set-tekrar-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Set Tekrar Hesaplama", en: "Set Rep Calculator" },
        h1: { tr: "Set Tekrar Hesaplama - Hedef Toplam Tekrarı Setlere Böl", en: "Set Rep Calculator" },
        description: { tr: "Hedef toplam tekrar ve set sayısına göre set başına tekrar planı oluşturun.", en: "Plan reps per set from total reps." },
        shortDescription: { tr: "Toplam tekrar hedefini set başına dağıtın.", en: "Distribute total reps across sets." },
        relatedCalculators: ["antrenman-hacmi", "bench-press-max", "squat-max", "deadlift-max", "dinlenme-suresi"],
        inputs: [
            numberInput("targetReps", "Hedef Toplam Tekrar", "Target Total Reps", 40, { min: 1, step: 1 }),
            numberInput("sets", "Set Sayısı", "Sets", 4, { min: 1, step: 1 }),
            numberInput("weight", "Ağırlık", "Weight", 60, { suffix: " kg", min: 0 }),
        ],
        results: [
            numberResult("repsPerSet", "Set Başına Ortalama Tekrar", "Average Reps per Set", "", 1),
            numberResult("volume", "Toplam Hacim", "Total Volume", " kg", 0),
            textResult("suggestion", "Plan Notu", "Plan Note"),
        ],
        formula: (v) => {
            const targetReps = Math.max(1, Number(v.targetReps) || 1);
            const sets = Math.max(1, Number(v.sets) || 1);
            const repsPerSet = targetReps / sets;
            return {
                repsPerSet,
                volume: targetReps * Math.max(0, Number(v.weight) || 0),
                suggestion: `${sets} set için set başına yaklaşık ${repsPerSet.toFixed(1)} tekrar planlanır.`,
            };
        },
        seo: buildSeo({
            title: "Set Tekrar Hesaplama",
            metaDescription: "Set tekrar hesaplama aracıyla hedef toplam tekrarınızı set sayısına bölün, set başına tekrar ve toplam hacmi hesaplayın.",
            intro: "Set ve tekrar planı, antrenman hedefini uygulanabilir parçalara böler. Aynı toplam tekrar farklı set yapılarına dağıtılabilir.",
            formula: "Set başına tekrar = hedef toplam tekrar / set sayısı. Hacim = hedef toplam tekrar x ağırlık.",
            example: "40 tekrar hedefi 4 sete bölündüğünde set başına 10 tekrar planlanır. 60 kg ile toplam hacim 2.400 kg olur.",
            interpretation: "Düşük tekrar-yüksek ağırlık kuvvete, orta tekrarlar hipertrofiye, yüksek tekrarlar dayanıklılığa daha yakın programlarda kullanılır.",
            caution: "Teknik bozuluyorsa hedef tekrar azaltılmalı veya ağırlık düşürülmelidir.",
            links: strengthLinks,
            faq: [
                ["Set tekrar nasıl seçilir?", "Hedefe göre seçilir; kuvvet için daha düşük tekrar, hipertrofi için orta tekrar sık kullanılır."],
                ["Toplam tekrar mı set sayısı mı önemli?", "İkisi birlikte önemlidir; toplam iş ve set başına yorgunluk farklı etkiler yaratır."],
                ["Aynı tekrar her sette yapılmalı mı?", "Şart değildir; piramit veya düşen set gibi yöntemlerde tekrarlar değişebilir."],
                ["Hacim neden gösteriliyor?", "Toplam mekanik işi ve haftalık yükü takip etmeye yardımcı olur."],
                ["Yeni başlayanlar için kaç set uygundur?", "Genellikle düşük-orta hacimle başlayıp teknik oturdukça artırmak daha güvenlidir."],
            ],
        }),
    },
    {
        id: "rest-time",
        slug: "dinlenme-suresi",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Dinlenme Süresi Hesaplama", en: "Rest Time Calculator" },
        h1: { tr: "Dinlenme Süresi Hesaplama - Hedefe Göre Set Arası", en: "Rest Time Calculator" },
        description: { tr: "Antrenman hedefi ve zorluk düzeyine göre set arası önerilen dinlenme süresi aralığını hesaplayın.", en: "Estimate rest time between sets." },
        shortDescription: { tr: "Kuvvet, hipertrofi veya kondisyon hedefi için set arası dinlenme aralığı görün.", en: "See rest range by training goal." },
        relatedCalculators: ["antrenman-hacmi", "set-tekrar-hesaplama", "bench-press-max", "kardiyo-suresi"],
        inputs: [
            selectInput("goal", "Hedef", "Goal", "hypertrophy", [
                { label: { tr: "Kuvvet", en: "Strength" }, value: "strength" },
                { label: { tr: "Kas gelişimi", en: "Hypertrophy" }, value: "hypertrophy" },
                { label: { tr: "Dayanıklılık / kondisyon", en: "Endurance" }, value: "endurance" },
            ]),
            selectInput("difficulty", "Set Zorluğu", "Set Difficulty", "medium", [
                { label: { tr: "Orta", en: "Medium" }, value: "medium" },
                { label: { tr: "Zor", en: "Hard" }, value: "hard" },
                { label: { tr: "Çok zor / maksimuma yakın", en: "Very hard" }, value: "veryHard" },
            ]),
        ],
        results: [
            textResult("restRange", "Önerilen Dinlenme", "Suggested Rest"),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const base: Record<string, [number, number]> = {
                strength: [180, 300],
                hypertrophy: [60, 120],
                endurance: [30, 75],
            };
            const multiplier = v.difficulty === "veryHard" ? 1.4 : v.difficulty === "hard" ? 1.2 : 1;
            const [low, high] = base[String(v.goal)] ?? base.hypertrophy;
            return {
                restRange: `${Math.round(low * multiplier)}-${Math.round(high * multiplier)} sn`,
                note: "Dinlenme süresi hedefe, hareketin büyüklüğüne ve toparlanma durumuna göre ayarlanmalıdır.",
            };
        },
        seo: buildSeo({
            title: "Dinlenme Süresi Hesaplama",
            metaDescription: "Dinlenme süresi hesaplama aracıyla kuvvet, kas gelişimi veya dayanıklılık hedefinize göre set arası önerilen süreyi hesaplayın.",
            intro: "Set arası dinlenme süresi, bir sonraki sette performansı ve antrenman yoğunluğunu doğrudan etkiler.",
            formula: "Araç hedefe göre temel süre aralığı seçer ve set zorluğuna göre süreyi artırır.",
            example: "Kas gelişimi hedefinde orta zorlukta 60-120 saniye, çok zor sette yaklaşık 84-168 saniye aralığı önerilir.",
            interpretation: "Kuvvet setlerinde daha uzun, dayanıklılık çalışmalarında daha kısa dinlenme sık kullanılır.",
            caution: "Nefes darlığı, baş dönmesi veya teknik bozulma varsa süreyi uzatın ve antrenmanı güvenli hale getirin.",
            links: strengthLinks,
            faq: [
                ["Set arası kaç dakika dinlenmeliyim?", "Hedefe göre değişir; kuvvet için 3-5 dakika, hipertrofi için 1-2 dakika sık kullanılır."],
                ["Kısa dinlenme daha mı iyi?", "Her zaman değil. Kısa dinlenme kondisyonu artırabilir ama kuvvet performansını düşürebilir."],
                ["Büyük hareketlerde süre artmalı mı?", "Squat ve deadlift gibi hareketlerde daha uzun dinlenme gerekebilir."],
                ["Dinlenme süresini saatle takip etmeli miyim?", "Evet. Özellikle progresif programlarda tutarlılık sağlar."],
                ["Kardiyo ve ağırlık dinlenmesi aynı mı?", "Hayır. Kardiyo interval dinlenmesi ayrı hedefe göre planlanır."],
            ],
        }),
    },
    {
        id: "cardio-duration",
        slug: "kardiyo-suresi",
        category: "yasam-hesaplama",
        updatedAt: "2026-05-02",
        name: { tr: "Kardiyo Süresi Hesaplama", en: "Cardio Duration Calculator" },
        h1: { tr: "Kardiyo Süresi Hesaplama - Hedef Kaloriye Göre Dakika", en: "Cardio Duration Calculator" },
        description: { tr: "Hedef kalori, kilo ve aktivite yoğunluğuna göre yaklaşık kardiyo süresini hesaplayın.", en: "Estimate cardio duration for a calorie target." },
        shortDescription: { tr: "Hedef kalori yakımı için gereken yaklaşık kardiyo dakikasını bulun.", en: "Estimate cardio minutes needed." },
        relatedCalculators: ["kalori-yakma-hesaplama", "nabiz-araligi-hesaplama", "yag-yakim-bolgesi-hesaplama", "kosu-pace-hesaplama"],
        inputs: [
            numberInput("targetCalories", "Hedef Kalori", "Target Calories", 300, { suffix: " kcal", min: 1 }),
            numberInput("weight", "Kilo", "Weight", 75, { suffix: " kg", min: 20 }),
            selectInput("met", "Kardiyo Türü", "Cardio Type", "7", [
                { label: { tr: "Hızlı yürüyüş", en: "Brisk walking" }, value: "4.3" },
                { label: { tr: "Bisiklet - orta", en: "Cycling - moderate" }, value: "7" },
                { label: { tr: "Koşu - orta", en: "Running - moderate" }, value: "9.8" },
                { label: { tr: "Eliptik / kondisyon", en: "Elliptical" }, value: "5.5" },
            ]),
        ],
        results: [
            numberResult("minutes", "Gerekli Süre", "Required Duration", " dk", 0),
            numberResult("weeklyMinutes", "Haftada 3 Gün Karşılığı", "3 Days Weekly", " dk/hafta", 0),
            textResult("note", "Yorum", "Note"),
        ],
        formula: (v) => {
            const target = Math.max(0, Number(v.targetCalories) || 0);
            const weight = Math.max(1, Number(v.weight) || 1);
            const met = Math.max(0.1, Number(v.met) || 0.1);
            const caloriesPerMinute = met * 3.5 * weight / 200;
            const minutes = target / caloriesPerMinute;
            return {
                minutes,
                weeklyMinutes: minutes * 3,
                note: "Süre tahmini MET değerine göre hesaplanır; kondisyon, tempo ve eğim sonucu değiştirebilir.",
            };
        },
        seo: buildSeo({
            title: "Kardiyo Süresi Hesaplama",
            metaDescription: "Kardiyo süresi hesaplama aracıyla hedef kalori, kilo ve aktivite yoğunluğuna göre kaç dakika kardiyo gerektiğini hesaplayın.",
            intro: "Kardiyo süresi hesabı, hedef kalori harcamasını seçilen aktivitenin dakika başı enerji harcamasına böler.",
            formula: "Dakika başı kalori = MET x 3,5 x kilo / 200. Gerekli süre = hedef kalori / dakika başı kalori.",
            example: "75 kg kişi 300 kcal hedefle orta bisiklet (MET 7) seçerse dakika başı yaklaşık 9,2 kcal, süre yaklaşık 33 dakika olur.",
            interpretation: "Sonuç haftalık kardiyo planı ve aktivite seçimi için kullanılır; tek başına kilo kaybı garantisi değildir.",
            caution: "Yeni başlayanlar yoğunluğu kademeli artırmalı; kalp, tansiyon veya eklem sorunu olanlar profesyonel görüş almalıdır.",
            links: sportLinks,
            faq: [
                ["300 kalori yakmak kaç dakika sürer?", "Aktivite ve kiloya bağlıdır; 75 kg kişide orta bisikletle yaklaşık 33 dakika sürebilir."],
                ["Kardiyo süresi mi yoğunluk mu önemli?", "İkisi birlikte etkilidir; yoğunluk artarsa aynı kalori için süre kısalır."],
                ["Her gün kardiyo yapılır mı?", "Kişinin toparlanmasına ve hedeflerine bağlıdır; dinlenme günleri de planlanmalıdır."],
                ["Yağ yakımı için en iyi kardiyo hangisi?", "Sürdürülebilir ve düzenli yapılabilen kardiyo çoğu kişi için en iyi seçenektir."],
                ["Ağırlık antrenmanı yerine geçer mi?", "Hayır. Kardiyo dayanıklılığı destekler; direnç egzersizi kas ve kuvvet için ayrıca önemlidir."],
            ],
        }),
    },
];

function formatDuration(totalSeconds: number) {
    const safeSeconds = Math.max(0, Math.round(totalSeconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
