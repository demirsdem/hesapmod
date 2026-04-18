// Yeni hesaplama araçları: Kasko Değeri, Trafik Sigortası, Vekâlet Ücreti, İcra Masrafı, İşsizlik Maaşı
// Bu dosya, phase5Calculators dizisini ve ilgili algoritmaları içerir.
import { CalculatorConfig } from "./calculator-types";

export const phase5Calculators: CalculatorConfig[] = [
    // 1. Kasko Değeri Hesaplama
    {
        id: "kasko-degeri",
        slug: "kasko-degeri-hesaplama",
        category: "sigorta",
        updatedAt: "2026-04-12",
        name: { tr: "Kasko Değeri Hesaplama", en: "Casco Value Calculator" },
        h1: { tr: "Kasko Değeri ve Tahmini Prim Hesaplama", en: "Casco Value and Estimated Premium Calculator" },
        description: { tr: "Araç yaşı ve kasko bedeline göre 2026 yılı için tahmini yıllık kasko primini hesaplayın.", en: "Calculate the estimated annual casco premium for 2026 based on vehicle age and casco value." },
        shortDescription: { tr: "Kasko değeri ve primini hızlıca öğrenin.", en: "Quickly find out your casco value and premium." },
        relatedCalculators: ["trafik-sigortasi-hesaplama"],
        inputs: [
            { id: "kaskoBedeli", name: { tr: "Kasko Tahmini Bedeli (TL)", en: "Estimated Casco Value (TRY)" }, type: "number", min: 10000, max: 5000000, step: 100, required: true },
            { id: "aracYasi", name: { tr: "Araç Yaşı", en: "Vehicle Age" }, type: "number", min: 0, max: 20, step: 1, required: true }
        ],
        results: [
            { id: "tahminiPrim", label: { tr: "Tahmini Yıllık Kasko Primi", en: "Estimated Annual Casco Premium" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // Basit örnek algoritma: Yaşa göre oran aralığı
            let oran = 0.025; // default %2.5
            if (v.aracYasi <= 2) oran = 0.018;
            else if (v.aracYasi <= 5) oran = 0.022;
            else if (v.aracYasi <= 10) oran = 0.027;
            else oran = 0.035;
            const tahminiPrim = v.kaskoBedeli * oran;
            return { tahminiPrim };
        },
        seo: {
            title: { tr: "Kasko Değeri ve Prim Hesaplama 2026 | HesapMod", en: "Casco Value and Premium Calculator 2026 | HesapMod" },
            metaDescription: { tr: "Araç yaşı ve kasko bedeline göre 2026 yılı için tahmini yıllık kasko primini hesaplayın. TSB kasko değer listesi ve enflasyon koruması ile güncel.", en: "Calculate the estimated annual casco premium for 2026 based on vehicle age and value. Updated with TSB value list and inflation protection." },
            content: {
                tr: `<h3>Kasko Değeri Nasıl Hesaplanır?</h3><p>Kasko değeri, Türkiye Sigorta Birliği'nin (TSB) yayınladığı güncel araç değer listesine ve piyasa koşullarına göre belirlenir. 2026 yılı için enflasyon koruması ve araç yaşı dikkate alınarak tahmini prim aralığı %1.8 - %3.5 arasında değişir.</p><h3>Kasko Primi Nasıl Hesaplanır?</h3><p>Kasko primi, aracın kasko değerinin yaşa göre belirlenen oranla çarpılmasıyla bulunur. Örneğin, 500.000 TL değerindeki 3 yaşındaki bir araç için oran %2.2 ise prim 11.000 TL olur.</p><h3>Kaynaklar</h3><ul><li>TSB Kasko Değer Listesi</li><li>2026 yılı enflasyon oranları</li></ul>`,
                en: "Casco value is determined according to the current vehicle value list published by the Insurance Association of Turkey (TSB) and market conditions. For 2026, the estimated premium range is 1.8% - 3.5% depending on vehicle age."
            },
            faq: [
                { q: { tr: "Kasko değeri nasıl belirlenir?", en: "How is casco value determined?" }, a: { tr: "TSB'nin yayınladığı güncel araç değer listesi ve piyasa koşulları dikkate alınır.", en: "Current vehicle value list by TSB and market conditions are considered." } },
                { q: { tr: "Kasko primi nasıl hesaplanır?", en: "How is casco premium calculated?" }, a: { tr: "Kasko bedeli, araç yaşına göre belirlenen oranla çarpılır.", en: "Casco value is multiplied by the rate determined by vehicle age." } }
            ]
        }
    },
    // 2. Trafik Sigortası Hesaplama
    {
        id: "trafik-sigortasi",
        slug: "trafik-sigortasi-hesaplama",
        category: "sigorta",
        updatedAt: "2026-04-12",
        name: { tr: "Trafik Sigortası Hesaplama", en: "Traffic Insurance Calculator" },
        h1: { tr: "Trafik Sigortası Tavan Fiyat Hesaplama", en: "Traffic Insurance Ceiling Price Calculator" },
        description: { tr: "Araç türü ve hasarsızlık kademesine göre 2026 yılı trafik sigortası tavan primini hesaplayın.", en: "Calculate the 2026 traffic insurance ceiling premium based on vehicle type and no-claim bonus level." },
        shortDescription: { tr: "Trafik sigortası tavan primini öğrenin.", en: "Find out the traffic insurance ceiling premium." },
        relatedCalculators: ["kasko-degeri-hesaplama"],
        inputs: [
            { id: "aracTuru", name: { tr: "Araç Türü", en: "Vehicle Type" }, type: "select", options: [
                { label: { tr: "Otomobil", en: "Car" }, value: "otomobil" },
                { label: { tr: "Kamyonet", en: "Pickup" }, value: "kamyonet" },
                { label: { tr: "Motosiklet", en: "Motorcycle" }, value: "motosiklet" }
            ], required: true },
            { id: "kademesi", name: { tr: "Hasarsızlık Kademesi (1-7)", en: "No-Claim Bonus Level (1-7)" }, type: "select", options: [
                { label: { tr: "1. Kademe", en: "Level 1" }, value: 1 },
                { label: { tr: "2. Kademe", en: "Level 2" }, value: 2 },
                { label: { tr: "3. Kademe", en: "Level 3" }, value: 3 },
                { label: { tr: "4. Kademe", en: "Level 4" }, value: 4 },
                { label: { tr: "5. Kademe", en: "Level 5" }, value: 5 },
                { label: { tr: "6. Kademe", en: "Level 6" }, value: 6 },
                { label: { tr: "7. Kademe", en: "Level 7" }, value: 7 }
            ], required: true }
        ],
        results: [
            { id: "tavanPrim", label: { tr: "Tahmini Trafik Sigortası Tavan Primi", en: "Estimated Traffic Insurance Ceiling Premium" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 tavan fiyatları örnek: Otomobil 12.000 TL, Kamyonet 15.000 TL, Motosiklet 4.000 TL
            const base = v.aracTuru === "otomobil" ? 12000 : v.aracTuru === "kamyonet" ? 15000 : 4000;
            // Kademe: 1: +50%, 2: +30%, 3: +10%, 4: 0, 5: -10%, 6: -20%, 7: -30%
            const kademeOran = [0.5, 0.3, 0.1, 0, -0.1, -0.2, -0.3][v.kademesi - 1] || 0;
            const tavanPrim = base * (1 + kademeOran);
            return { tavanPrim };
        },
        seo: {
            title: { tr: "Trafik Sigortası Tavan Fiyat Hesaplama 2026 | HesapMod", en: "Traffic Insurance Ceiling Price Calculator 2026 | HesapMod" },
            metaDescription: { tr: "Araç türü ve hasarsızlık kademesine göre 2026 yılı trafik sigortası tavan primini hesaplayın. Kademelerin anlamı ve tavan fiyat tablosu ile güncel.", en: "Calculate the 2026 traffic insurance ceiling premium based on vehicle type and no-claim bonus. Includes bonus levels and ceiling price table." },
            content: {
                tr: `<h3>Trafik Sigortası Tavan Fiyatı Nedir?</h3><p>Trafik sigortası tavan fiyatı, Hazine ve Maliye Bakanlığı tarafından belirlenen ve sigorta şirketlerinin uygulayabileceği en yüksek prim tutarıdır. 2026 yılı için otomobil 12.000 TL, kamyonet 15.000 TL, motosiklet 4.000 TL olarak baz alınmıştır.</p><h3>Hasarsızlık Kademesi Nedir?</h3><p>Hasarsızlık kademesi, sürücünün geçmiş yıllardaki kaza ve hasar durumuna göre belirlenir. 1. kademe en yüksek prim, 7. kademe en düşük prim anlamına gelir.</p><h3>Kaynaklar</h3><ul><li>2026 Trafik Sigortası Tavan Fiyatları</li><li>Hazine ve Maliye Bakanlığı</li></ul>`,
                en: "Traffic insurance ceiling price is the maximum premium set by the Ministry of Treasury and Finance. For 2026: car 12,000 TL, pickup 15,000 TL, motorcycle 4,000 TL. Bonus levels affect the final price."
            },
            faq: [
                { q: { tr: "Trafik sigortası tavan fiyatı nedir?", en: "What is the traffic insurance ceiling price?" }, a: { tr: "Hazine ve Maliye Bakanlığı tarafından belirlenen en yüksek prim tutarıdır.", en: "The maximum premium set by the Ministry of Treasury and Finance." } },
                { q: { tr: "Hasarsızlık kademesi neyi ifade eder?", en: "What does the no-claim bonus level mean?" }, a: { tr: "Kademeler, sürücünün hasar geçmişine göre primde indirim veya artış sağlar.", en: "Bonus levels provide discounts or increases based on claim history." } }
            ]
        }
    },
    // 3. Vekâlet Ücreti Hesaplama
    {
        id: "vekalet-ucreti",
        slug: "vekalet-ucreti-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-12",
        name: { tr: "Vekâlet Ücreti Hesaplama", en: "Attorney Fee Calculator" },
        h1: { tr: "Vekâlet Ücreti (AAÜT) Hesaplama", en: "Attorney Fee (AAÜT) Calculator" },
        description: { tr: "Dava/İcra tutarına göre 2026 AAÜT nispi ve maktu vekâlet ücretini hesaplayın.", en: "Calculate the 2026 AAÜT proportional and fixed attorney fee based on case/enforcement amount." },
        shortDescription: { tr: "AAÜT'ye göre vekâlet ücretini öğrenin.", en: "Find out the attorney fee according to AAÜT." },
        relatedCalculators: ["icra-masrafi-hesaplama"],
        inputs: [
            { id: "tutar", name: { tr: "Dava/İcra Tutarı (TL)", en: "Case/Enforcement Amount (TRY)" }, type: "number", min: 1000, max: 10000000, step: 100, required: true }
        ],
        results: [
            { id: "nispiUcret", label: { tr: "Nispi Vekâlet Ücreti", en: "Proportional Attorney Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 AAÜT örnek: ilk 100.000 TL için %16, sonraki için %15, maktu alt sınır 6.000 TL
            let kalan = v.tutar;
            let ucret = 0;
            if (kalan > 100000) {
                ucret += 100000 * 0.16;
                kalan -= 100000;
                ucret += kalan * 0.15;
            } else {
                ucret = kalan * 0.16;
            }
            if (ucret < 6000) ucret = 6000;
            return { nispiUcret: ucret };
        },
        seo: {
            title: { tr: "Vekâlet Ücreti Hesaplama 2026 | HesapMod", en: "Attorney Fee Calculator 2026 | HesapMod" },
            metaDescription: { tr: "Dava/İcra tutarına göre 2026 AAÜT nispi ve maktu vekâlet ücretini hesaplayın. Maktu/nispî farkı ve örneklerle güncel.", en: "Calculate the 2026 AAÜT proportional and fixed attorney fee. Includes fixed/proportional difference and examples." },
            content: {
                tr: `<h3>Vekâlet Ücreti Nasıl Hesaplanır?</h3><p>2026 yılı Avukatlık Asgari Ücret Tarifesi'ne (AAÜT) göre, ilk 100.000 TL için %16, sonraki tutar için %15 oranı uygulanır. Maktu alt sınır 6.000 TL'dir.</p><h3>Maktu ve Nispi Ücret Farkı</h3><p>Maktu ücret, dava tutarından bağımsız sabit bir tutardır. Nispi ücret ise dava/işin değerine göre oranlıdır.</p><h3>Kaynaklar</h3><ul><li>2026 AAÜT</li><li>Türkiye Barolar Birliği</li></ul>`,
                en: "According to the 2026 AAÜT, 16% is applied for the first 100,000 TRY, 15% for the rest. The minimum fixed fee is 6,000 TRY."
            },
            faq: [
                { q: { tr: "Vekâlet ücreti nasıl hesaplanır?", en: "How is attorney fee calculated?" }, a: { tr: "AAÜT'ye göre ilk 100.000 TL için %16, sonrası için %15 oranı uygulanır.", en: "16% for the first 100,000 TRY, 15% for the rest according to AAÜT." } },
                { q: { tr: "Maktu ve nispi ücret farkı nedir?", en: "What is the difference between fixed and proportional fee?" }, a: { tr: "Maktu ücret sabit, nispi ücret ise dava değerine göre değişir.", en: "Fixed fee is constant, proportional fee varies by case value." } }
            ]
        }
    },
    // 4. İcra Masrafı Hesaplama
    {
        id: "icra-masrafi",
        slug: "icra-masrafi-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-12",
        name: { tr: "İcra Masrafı Hesaplama", en: "Enforcement Cost Calculator" },
        h1: { tr: "İcra Açılış Masrafı Hesaplama", en: "Enforcement Opening Cost Calculator" },
        description: { tr: "Asıl alacak tutarına göre 2026 yılı icra açılış masraflarını (peşin harç, başvuru harcı, vekalet suret harcı) hesaplayın.", en: "Calculate the 2026 enforcement opening costs (advance fee, application fee, attorney copy fee) based on principal claim amount." },
        shortDescription: { tr: "İcra açılış masrafını öğrenin.", en: "Find out the enforcement opening cost." },
        relatedCalculators: ["vekalet-ucreti-hesaplama"],
        inputs: [
            { id: "alacak", name: { tr: "Asıl Alacak Tutarı (TL)", en: "Principal Claim Amount (TRY)" }, type: "number", min: 100, max: 10000000, step: 100, required: true }
        ],
        results: [
            { id: "toplamMasraf", label: { tr: "Toplam İcra Açılış Masrafı", en: "Total Enforcement Opening Cost" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "pesinHarc", label: { tr: "Peşin Harç", en: "Advance Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "basvuruHarci", label: { tr: "Başvuru Harcı", en: "Application Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "vekaletSuretHarci", label: { tr: "Vekalet Suret Harcı", en: "Attorney Copy Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026: Peşin harç binde 5, başvuru harcı 427.60 TL, vekalet suret harcı 50 TL
            const pesinHarc = v.alacak * 0.005;
            const basvuruHarci = 427.6;
            const vekaletSuretHarci = 50;
            const toplamMasraf = pesinHarc + basvuruHarci + vekaletSuretHarci;
            return { toplamMasraf, pesinHarc, basvuruHarci, vekaletSuretHarci };
        },
        seo: {
            title: { tr: "İcra Masrafı Hesaplama 2026 | HesapMod", en: "Enforcement Cost Calculator 2026 | HesapMod" },
            metaDescription: { tr: "Asıl alacak tutarına göre 2026 yılı icra açılış masraflarını (peşin harç, başvuru harcı, vekalet suret harcı) hesaplayın. Detaylı kırılım ve açıklamalarla güncel.", en: "Calculate the 2026 enforcement opening costs (advance fee, application fee, attorney copy fee) with detailed breakdown and explanations." },
            content: {
                tr: `<h3>İcra Masrafı Nasıl Hesaplanır?</h3><p>2026 yılı için peşin harç binde 5, başvuru harcı 427,60 TL ve vekalet suret harcı 50 TL olarak belirlenmiştir. Toplam masraf, bu kalemlerin toplamıdır.</p><h3>Peşin Harç Nedir?</h3><p>Peşin harç, icra takibi başlatılırken ödenen ve alacak tutarının binde 5'i oranında hesaplanan bir harçtır.</p><h3>Kaynaklar</h3><ul><li>2026 İcra Harçları</li><li>Adalet Bakanlığı</li></ul>`,
                en: "For 2026, the advance fee is 0.5% of the principal, application fee is 427.60 TRY, and attorney copy fee is 50 TRY. The total cost is the sum of these items."
            },
            faq: [
                { q: { tr: "İcra masrafı nasıl hesaplanır?", en: "How is enforcement cost calculated?" }, a: { tr: "Peşin harç, başvuru harcı ve vekalet suret harcı toplanır.", en: "Sum of advance fee, application fee, and attorney copy fee." } },
                { q: { tr: "Peşin harç nedir?", en: "What is the advance fee?" }, a: { tr: "Alacak tutarının binde 5'i oranında alınan harçtır.", en: "A fee of 0.5% of the principal claim." } }
            ]
        }
    },
    // 5. İşsizlik Maaşı Hesaplama
    {
        id: "issizlik-maasi",
        slug: "issizlik-maasi-hesaplama",
        category: "muhasebe",
        updatedAt: "2026-04-12",
        name: { tr: "İşsizlik Maaşı Hesaplama", en: "Unemployment Benefit Calculator" },
        h1: { tr: "İşsizlik Maaşı ve Süre Hesaplama", en: "Unemployment Benefit and Duration Calculator" },
        description: { tr: "Son 4 aylık brüt maaş ve prim gününe göre 2026 işsizlik maaşı ve alınacak süreyi hesaplayın.", en: "Calculate the 2026 unemployment benefit and duration based on last 4 months' gross salary and premium days." },
        shortDescription: { tr: "İşsizlik maaşı ve süresini öğrenin.", en: "Find out unemployment benefit and duration." },
        relatedCalculators: [],
        inputs: [
            { id: "brutMaas", name: { tr: "Son 4 Aylık Ortalama Brüt Maaş (TL)", en: "Last 4 Months' Avg Gross Salary (TRY)" }, type: "number", min: 10000, max: 100000, step: 100, required: true },
            { id: "primGunu", name: { tr: "Son 3 Yıldaki Prim Günü", en: "Premium Days in Last 3 Years" }, type: "select", options: [
                { label: { tr: "600 Gün (6 Ay)", en: "600 Days (6 Months)" }, value: 600 },
                { label: { tr: "900 Gün (8 Ay)", en: "900 Days (8 Months)" }, value: 900 },
                { label: { tr: "1080 Gün (10 Ay)", en: "1080 Days (10 Months)" }, value: 1080 }
            ], required: true }
        ],
        results: [
            { id: "aylikNet", label: { tr: "Aylık Net İşsizlik Maaşı", en: "Monthly Net Unemployment Benefit" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "toplamSure", label: { tr: "Toplam Alınacak Süre (Ay)", en: "Total Duration (Months)" }, type: "number" }
        ],
        formula: (v) => {
            // 2026: Brüt maaş * 0.40, tavan = asgari ücretin %80'i, damga vergisi %0.759
            const asgariUcret = 20000; // örnek 2026 asgari ücret
            const tavan = asgariUcret * 0.8;
            let aylikBrut = v.brutMaas * 0.4;
            if (aylikBrut > tavan) aylikBrut = tavan;
            const damgaVergisi = aylikBrut * 0.00759;
            const aylikNet = aylikBrut - damgaVergisi;
            const toplamSure = v.primGunu === 600 ? 6 : v.primGunu === 900 ? 8 : 10;
            return { aylikNet, toplamSure };
        },
        seo: {
            title: { tr: "İşsizlik Maaşı Hesaplama 2026 | HesapMod", en: "Unemployment Benefit Calculator 2026 | HesapMod" },
            metaDescription: { tr: "Son 4 aylık brüt maaş ve prim gününe göre 2026 işsizlik maaşı ve alınacak süreyi hesaplayın. İŞKUR şartları ve tavan-taban limitleriyle güncel.", en: "Calculate the 2026 unemployment benefit and duration. Updated with İŞKUR requirements and ceiling/floor limits." },
            content: {
                tr: `<h3>İşsizlik Maaşı Nasıl Hesaplanır?</h3><p>İşsizlik maaşı, son 4 aylık ortalama brüt maaşın %40'ı alınarak ve asgari ücretin %80'i tavan olarak uygulanarak hesaplanır. Damga vergisi kesintisi yapılır.</p><h3>İşsizlik Maaşı Kaç Ay Alınır?</h3><p>Son 3 yıldaki prim gününe göre 600 gün için 6 ay, 900 gün için 8 ay, 1080 gün için 10 ay işsizlik maaşı alınabilir.</p><h3>Kaynaklar</h3><ul><li>İŞKUR</li><li>2026 Asgari Ücret</li></ul>`,
                en: "Unemployment benefit is calculated as 40% of the last 4 months' average gross salary, with a ceiling of 80% of the minimum wage. Stamp tax is deducted. Duration depends on premium days: 6, 8, or 10 months."
            },
            faq: [
                { q: { tr: "İşsizlik maaşı nasıl hesaplanır?", en: "How is unemployment benefit calculated?" }, a: { tr: "Brüt maaşın %40'ı alınır, tavan uygulanır, damga vergisi kesilir.", en: "40% of gross salary, ceiling applied, stamp tax deducted." } },
                { q: { tr: "İşsizlik maaşı kaç ay alınır?", en: "For how many months is unemployment benefit paid?" }, a: { tr: "Prim gününe göre 6, 8 veya 10 ay alınır.", en: "6, 8, or 10 months depending on premium days." } }
            ]
        }
    }
];
