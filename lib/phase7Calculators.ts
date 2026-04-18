// Phase 7: Trendler, Kurumsal Muhasebe ve Hukuk Araçları
// HesapMod - 2026
import { CalculatorConfig } from "./calculator-types";

export const phase7Calculators: CalculatorConfig[] = [
    // 1. Elektrikli Araç Şarj Maliyeti Hesaplama
    {
        id: "elektrikli-arac-sarj-maliyeti",
        slug: "elektrikli-arac-sarj-maliyeti-hesaplama",
        category: "tasit-ve-vergi",
        updatedAt: "2026-04-14",
        name: { tr: "Elektrikli Araç Şarj Maliyeti Hesaplama", en: "EV Charging Cost Calculator" },
        h1: { tr: "Elektrikli Araç Şarj Maliyeti (Ev, AC, DC)", en: "EV Charging Cost (Home, AC, DC)" },
        description: { tr: "Batarya kapasitesi, şarj yüzdesi ve istasyon tipine göre elektrikli araç şarj maliyetini hesaplayın.", en: "Calculate EV charging cost based on battery, charge level, and station type." },
        shortDescription: { tr: "Şarj maliyetini öğrenin.", en: "Find out charging cost." },
        relatedCalculators: [],
        inputs: [
            { id: "batarya", name: { tr: "Batarya Kapasitesi (kWh)", en: "Battery Capacity (kWh)" }, type: "number", min: 10, max: 200, step: 0.1, required: true },
            { id: "mevcutYuzde", name: { tr: "Mevcut Şarj (%)", en: "Current Charge (%)" }, type: "number", min: 0, max: 100, step: 1, required: true },
            { id: "hedefYuzde", name: { tr: "Hedef Şarj (%)", en: "Target Charge (%)" }, type: "number", min: 1, max: 100, step: 1, required: true },
            { id: "birimFiyat", name: { tr: "Birim kWh Fiyatı (TL)", en: "Unit Price per kWh (TRY)" }, type: "number", min: 1, max: 20, step: 0.01, required: true }
        ],
        results: [
            { id: "doldurulacakKwh", label: { tr: "Doldurulacak Enerji (kWh)", en: "Energy to Charge (kWh)" }, type: "number", decimalPlaces: 2 },
            { id: "toplamMaliyet", label: { tr: "Toplam Şarj Maliyeti", en: "Total Charging Cost" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const batarya = Number(v.batarya) || 0;
            const mevcut = Number(v.mevcutYuzde) || 0;
            const hedef = Number(v.hedefYuzde) || 0;
            const birim = Number(v.birimFiyat) || 0;
            const doldurulacakKwh = batarya * (Math.max(hedef - mevcut, 0) / 100);
            const toplamMaliyet = doldurulacakKwh * birim;
            return { doldurulacakKwh, toplamMaliyet };
        },
        seo: {
            title: { tr: "Elektrikli Araç Şarj Maliyeti Hesaplama 2026 (Ev, AC, DC) | HesapMod", en: "EV Charging Cost Calculator 2026 (Home, AC, DC) | HesapMod" },
            metaDescription: { tr: "Elektrikli araçların evde ve istasyonda şarj maliyetini 2026 fiyatlarıyla hesaplayın.", en: "Calculate EV charging cost at home and stations with 2026 prices." },
            content: {
                tr: `<h3>Elektrikli Araç Şarj Maliyeti Nasıl Hesaplanır?</h3><p>Batarya kapasitesi, mevcut ve hedef şarj yüzdesi ile birim kWh fiyatı girilerek doldurulacak enerji ve toplam maliyet bulunur. AC (yavaş), DC (hızlı) ve ev tipi şarj fiyatları farklılık gösterir.</p><h3>100 km'de Ortalama Tüketim</h3><p>Çoğu elektrikli araç 100 km'de 15-20 kWh tüketir. Şarj maliyeti, tüketim ve elektrik fiyatına göre değişir.</p><h3>Kaynaklar</h3><ul><li>EPDK</li><li>Şarj Ağı İşletmecileri</li></ul>`,
                en: "Charging cost is calculated by battery size, charge levels, and unit price. AC, DC, and home charging have different rates. Most EVs consume 15-20 kWh per 100 km."
            },
            faq: [
                { q: { tr: "Elektrikli araç evde ne kadara şarj olur?", en: "How much does it cost to charge an EV at home?" }, a: { tr: "Ev tipi prizde birim fiyat daha düşüktür, toplam maliyet elektrik tarifesine göre değişir.", en: "Home charging is usually cheaper, total cost depends on your electricity tariff." } },
                { q: { tr: "AC ve DC şarj istasyonu fiyat farkı nedir?", en: "What is the price difference between AC and DC charging?" }, a: { tr: "DC hızlı şarj istasyonları genellikle daha pahalıdır.", en: "DC fast charging is usually more expensive." } }
            ]
        }
    },
    // 2. DASK Sigortası Hesaplama
    {
        id: "dask-sigortasi",
        slug: "dask-sigortasi-hesaplama",
        category: "sigorta",
        updatedAt: "2026-04-14",
        name: { tr: "DASK Sigortası Hesaplama", en: "DASK Insurance Calculator" },
        h1: { tr: "DASK Zorunlu Deprem Sigortası Hesaplama", en: "DASK Compulsory Earthquake Insurance Calculator" },
        description: { tr: "Dairenin m²'si, yapı tarzı ve deprem risk bölgesine göre 2026 DASK sigorta bedelini ve primini hesaplayın.", en: "Calculate DASK insurance value and premium for 2026 based on area, structure, and risk zone." },
        shortDescription: { tr: "DASK sigorta bedeli ve primini öğrenin.", en: "Find out DASK insurance value and premium." },
        relatedCalculators: [],
        inputs: [
            { id: "metrekare", name: { tr: "Dairenin Brüt m²'si", en: "Gross Area (m²)" }, type: "number", min: 10, max: 1000, step: 1, required: true },
            { id: "yapiTarzi", name: { tr: "Yapı Tarzı", en: "Structure Type" }, type: "select", options: [
                { label: { tr: "Betonarme", en: "Reinforced Concrete" }, value: "betonarme" },
                { label: { tr: "Diğer", en: "Other" }, value: "diger" }
            ], required: true },
            { id: "riskBolgesi", name: { tr: "Deprem Risk Bölgesi", en: "Earthquake Risk Zone" }, type: "select", options: [
                { label: { tr: "1. Bölge (En Yüksek)", en: "Zone 1 (Highest)" }, value: 1 },
                { label: { tr: "2. Bölge", en: "Zone 2" }, value: 2 },
                { label: { tr: "3. Bölge", en: "Zone 3" }, value: 3 },
                { label: { tr: "4. Bölge", en: "Zone 4" }, value: 4 },
                { label: { tr: "5. Bölge (En Düşük)", en: "Zone 5 (Lowest)" }, value: 5 }
            ], required: true }
        ],
        results: [
            { id: "teminatTutari", label: { tr: "Sigorta Teminatı (TL)", en: "Insurance Value (TRY)" }, type: "number", decimalPlaces: 2 },
            { id: "tahminiPrim", label: { tr: "Tahmini Poliçe Primi", en: "Estimated Policy Premium" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 DASK m² birim bedeli örnek: Betonarme 6.000 TL, Diğer 4.000 TL
            // Risk bölgesine göre prim çarpanı: 1.0, 0.9, 0.8, 0.7, 0.6
            const birim = v.yapiTarzi === "betonarme" ? 6000 : 4000;
            const teminatTutari = (Number(v.metrekare) || 0) * birim;
            const riskCarpani = [1, 0.9, 0.8, 0.7, 0.6][(Number(v.riskBolgesi) || 1) - 1] || 1;
            const tahminiPrim = teminatTutari * 0.0015 * riskCarpani; // örnek prim oranı
            return { teminatTutari, tahminiPrim };
        },
        seo: {
            title: { tr: "DASK Zorunlu Deprem Sigortası Hesaplama 2026 | HesapMod", en: "DASK Compulsory Earthquake Insurance Calculator 2026 | HesapMod" },
            metaDescription: { tr: "2026 DASK teminat ve primini, risk bölgesine göre hesaplayın.", en: "Calculate DASK insurance and premium for 2026 by risk zone." },
            content: {
                tr: `<h3>DASK Sigortası Nedir?</h3><p>DASK, deprem ve deprem kaynaklı yangın, infilak, tsunami ve yer kayması risklerine karşı zorunlu sigortadır. 2026'da betonarme için m² başına 6.000 TL, diğer yapılar için 4.000 TL teminat uygulanır.</p><h3>Poliçe Primi Nasıl Hesaplanır?</h3><p>Risk bölgesine göre prim oranı değişir. 1. bölge en yüksek, 5. bölge en düşük primli bölgedir.</p><h3>Kaynaklar</h3><ul><li>DASK Kurumu</li></ul>`,
                en: "DASK covers earthquake and related risks. 2026 insurance value is 6,000 TRY/m² for reinforced concrete, 4,000 TRY/m² for others. Premium varies by risk zone."
            },
            faq: [
                { q: { tr: "DASK sigortası neleri kapsar, eşyaları öder mi?", en: "What does DASK cover, does it pay for belongings?" }, a: { tr: "Sadece binayı kapsar, eşyaları kapsamaz.", en: "Only the building is covered, not belongings." } },
                { q: { tr: "DASK poliçesini kiracı mı ev sahibi mi yaptırır?", en: "Who should get DASK insurance, tenant or owner?" }, a: { tr: "Ev sahibi yaptırmakla yükümlüdür.", en: "The owner is responsible for the policy." } }
            ]
        }
    },
    // 3. Binek Araç Gider Kısıtlaması Hesaplama
    {
        id: "binek-arac-gider-kisitlamasi",
        slug: "binek-arac-gider-kisitlamasi-hesaplama",
        category: "muhasebe",
        updatedAt: "2026-04-14",
        name: { tr: "Binek Araç Gider Kısıtlaması Hesaplama", en: "Passenger Car Expense Limitation Calculator" },
        h1: { tr: "Binek Araç Gider Kısıtlaması (KKEG)", en: "Passenger Car Expense Limitation (KKEG)" },
        description: { tr: "Şirket binek araçlarının 2026 yılı gider kısıtlaması ve vergiden düşülebilecek tutarı hesaplayın.", en: "Calculate 2026 expense limitation and deductible amount for company cars." },
        shortDescription: { tr: "Binek araç gider kısıtlamasını öğrenin.", en: "Find out the expense limitation for company cars." },
        relatedCalculators: [],
        inputs: [
            { id: "kiraBedeli", name: { tr: "Aylık Kira Bedeli (TL)", en: "Monthly Rental (TRY)" }, type: "number", min: 0, max: 100000, step: 100 },
            { id: "alisBedeli", name: { tr: "Araç Alış Bedeli (TL)", en: "Purchase Price (TRY)" }, type: "number", min: 0, max: 2000000, step: 100 },
            { id: "kdvOtv", name: { tr: "KDV+ÖTV Tutarı (TL)", en: "VAT+SCT Amount (TRY)" }, type: "number", min: 0, max: 1000000, step: 100 },
            { id: "giderTuru", name: { tr: "Gider Türü", en: "Expense Type" }, type: "select", options: [
                { label: { tr: "Kiralama", en: "Rental" }, value: "kira" },
                { label: { tr: "Satın Alma (Amortisman)", en: "Purchase (Amortization)" }, value: "amortisman" },
                { label: { tr: "Yakıt/Bakım", en: "Fuel/Maintenance" }, value: "yakit" }
            ], required: true }
        ],
        results: [
            { id: "vergidenDusulecek", label: { tr: "Vergiden Düşülebilecek Tutar", en: "Deductible Amount" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "kkeg", label: { tr: "KKEG (Kanunen Kabul Edilmeyen Gider)", en: "Non-Deductible Expense (KKEG)" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 limitleri: kira 20.000 TL/ay, alış 1.500.000 TL, KDV+ÖTV 440.000 TL, %70 gider yazılabilir
            let vergidenDusulecek = 0, kkeg = 0;
            if (v.giderTuru === "kira") {
                const limit = 20000;
                vergidenDusulecek = Math.min(Number(v.kiraBedeli) || 0, limit) * 0.7;
                kkeg = Math.max((Number(v.kiraBedeli) || 0) - limit, 0) + (Math.min(Number(v.kiraBedeli) || 0, limit) * 0.3);
            } else if (v.giderTuru === "amortisman") {
                const limit = 1500000;
                vergidenDusulecek = Math.min(Number(v.alisBedeli) || 0, limit) * 0.7;
                kkeg = Math.max((Number(v.alisBedeli) || 0) - limit, 0) + (Math.min(Number(v.alisBedeli) || 0, limit) * 0.3);
            } else if (v.giderTuru === "yakit") {
                vergidenDusulecek = ((Number(v.kiraBedeli) || 0) + (Number(v.alisBedeli) || 0) + (Number(v.kdvOtv) || 0)) * 0.7;
                kkeg = ((Number(v.kiraBedeli) || 0) + (Number(v.alisBedeli) || 0) + (Number(v.kdvOtv) || 0)) * 0.3;
            }
            return { vergidenDusulecek, kkeg };
        },
        seo: {
            title: { tr: "Binek Araç Gider Kısıtlaması Hesaplama 2026 (KKEG ve KDV) | HesapMod", en: "Passenger Car Expense Limitation Calculator 2026 (KKEG & VAT) | HesapMod" },
            metaDescription: { tr: "2026 binek araç gider kısıtlaması ve KKEG hesaplamasını yapın.", en: "Calculate 2026 passenger car expense limitation and KKEG." },
            content: {
                tr: `<h3>Binek Araç Gider Kısıtlaması Nedir?</h3><p>2026 yılında şirket binek araçlarının aylık kira, alış ve KDV+ÖTV giderlerinin tamamı vergiden düşülemez. %70'i gider, %30'u KKEG olarak ayrılır.</p><h3>Kiralama ve Satın Alma Limitleri</h3><ul><li>Kira: 20.000 TL/ay</li><li>Alış: 1.500.000 TL</li><li>KDV+ÖTV: 440.000 TL</li></ul><h3>Kaynaklar</h3><ul><li>Gelir İdaresi Başkanlığı (GİB)</li></ul>`,
                en: "In 2026, only 70% of company car expenses are deductible. Rental and purchase limits apply."
            },
            faq: [
                { q: { tr: "Şirket araçlarının yakıt fişlerinin tamamı gider yazılır mı?", en: "Can all fuel receipts be deducted?" }, a: { tr: "Hayır, sadece %70'i gider yazılır.", en: "No, only 70% is deductible." } },
                { q: { tr: "Binek araç alımında KDV indirim konusu yapılabilir mi?", en: "Can VAT be deducted for car purchases?" }, a: { tr: "Hayır, KDV indirim konusu yapılamaz.", en: "No, VAT cannot be deducted." } }
            ]
        }
    },
    // 4. Amortisman Hesaplama
    {
        id: "amortisman",
        slug: "amortisman-hesaplama",
        category: "muhasebe",
        updatedAt: "2026-04-14",
        name: { tr: "Amortisman Hesaplama", en: "Depreciation Calculator" },
        h1: { tr: "Amortisman (Normal ve Azalan Bakiyeler)", en: "Depreciation (Straight-Line & Declining Balance)" },
        description: { tr: "Sabit kıymet için normal ve azalan bakiyeler yöntemine göre yıllık amortismanı ve net defter değerini hesaplayın.", en: "Calculate annual depreciation and net book value for fixed assets using straight-line and declining balance methods." },
        shortDescription: { tr: "Amortisman tablosunu öğrenin.", en: "Find out the depreciation table." },
        relatedCalculators: [],
        inputs: [
            { id: "alisBedeli", name: { tr: "Alış Tutarı (TL)", en: "Purchase Price (TRY)" }, type: "number", min: 1000, max: 10000000, step: 100, required: true },
            { id: "omur", name: { tr: "Faydalı Ömür (Yıl)", en: "Useful Life (Years)" }, type: "number", min: 1, max: 50, step: 1, required: true },
            { id: "yontem", name: { tr: "Yöntem", en: "Method" }, type: "select", options: [
                { label: { tr: "Normal Amortisman", en: "Straight-Line" }, value: "normal" },
                { label: { tr: "Azalan Bakiyeler", en: "Declining Balance" }, value: "azalan" }
            ], required: true }
        ],
        results: [
            { id: "amortismanTablosu", label: { tr: "Amortisman Tablosu", en: "Depreciation Table" }, type: "text" },
            { id: "netDefterDegeri", label: { tr: "Net Defter Değeri", en: "Net Book Value" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const alis = Number(v.alisBedeli) || 0;
            const omur = Number(v.omur) || 1;
            const yontem = v.yontem;
            let tablo = [];
            let kalan = alis;
            if (yontem === "normal") {
                const pay = alis / omur;
                for (let i = 1; i <= omur; i++) {
                    kalan -= pay;
                    tablo.push({ yil: i, amortisman: pay, kalan: Math.max(kalan, 0) });
                }
            } else {
                let oran = 2 / omur;
                for (let i = 1; i <= omur; i++) {
                    const pay = kalan * oran;
                    kalan -= pay;
                    tablo.push({ yil: i, amortisman: pay, kalan: Math.max(kalan, 0) });
                }
            }
            return { amortismanTablosu: tablo, netDefterDegeri: Math.max(kalan, 0) };
        },
        seo: {
            title: { tr: "Amortisman Hesaplama (Normal ve Azalan Bakiyeler Yöntemi) | HesapMod", en: "Depreciation Calculator (Straight-Line & Declining Balance) | HesapMod" },
            metaDescription: { tr: "Normal ve azalan bakiyeler yöntemine göre amortisman tablosunu ve net defter değerini hesaplayın.", en: "Calculate depreciation table and net book value using both methods." },
            content: {
                tr: `<h3>Amortisman Nedir?</h3><p>Amortisman, sabit kıymetin ekonomik ömrü boyunca gider yazılmasıdır. Normal yöntemde eşit pay, azalan bakiyelerde hızlandırılmış pay ayrılır.</p><h3>Tablo Nasıl Oluşur?</h3><p>Her yıl ayrılan amortisman ve kalan net defter değeri tablo olarak gösterilir.</p><h3>Kaynaklar</h3><ul><li>Vergi Usul Kanunu (VUK)</li></ul>`,
                en: "Depreciation is the allocation of a fixed asset's cost over its useful life. Table shows annual depreciation and remaining value."
            },
            faq: [
                { q: { tr: "Hızlandırılmış amortisman (azalan bakiyeler) avantajı nedir?", en: "What is the advantage of declining balance depreciation?" }, a: { tr: "İlk yıllarda daha fazla gider yazılır.", en: "More expense is allocated in early years." } },
                { q: { tr: "Kıst amortisman binek araçlarda nasıl uygulanır?", en: "How is pro-rata depreciation applied to cars?" }, a: { tr: "İlk yıl, kullanım süresine orantılı pay ayrılır.", en: "First year is prorated by usage period." } }
            ]
        }
    },
    // 5. Arabuluculuk Ücreti Hesaplama
    {
        id: "arabuluculuk-ucreti",
        slug: "arabuluculuk-ucreti-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-14",
        name: { tr: "Arabuluculuk Ücreti Hesaplama", en: "Mediation Fee Calculator" },
        h1: { tr: "Arabuluculuk Ücreti (Nispi ve Maktu)", en: "Mediation Fee (Proportional & Fixed)" },
        description: { tr: "Anlaşma tutarı ve taraf sayısına göre 2026 arabuluculuk ücretini hesaplayın.", en: "Calculate 2026 mediation fee based on settlement amount and number of parties." },
        shortDescription: { tr: "Arabuluculuk ücretini öğrenin.", en: "Find out the mediation fee." },
        relatedCalculators: [],
        inputs: [
            { id: "tutar", name: { tr: "Anlaşma Tutarı (TL)", en: "Settlement Amount (TRY)" }, type: "number", min: 1000, max: 10000000, step: 100, required: true },
            { id: "tarafSayisi", name: { tr: "Taraf Sayısı", en: "Number of Parties" }, type: "select", options: [
                { label: { tr: "2 Taraf", en: "2 Parties" }, value: 2 },
                { label: { tr: "Çoklu Taraf", en: "Multiple Parties" }, value: 3 }
            ], required: true }
        ],
        results: [
            { id: "toplamUcret", label: { tr: "Toplam Arabuluculuk Ücreti", en: "Total Mediation Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "tarafBasiUcret", label: { tr: "Taraf Başı Ücret", en: "Fee per Party" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 tarifesi: ilk 200.000 TL için %6, sonraki için %5, maktu alt sınır 5.000 TL
            let kalan = Number(v.tutar) || 0;
            let ucret = 0;
            if (kalan > 200000) {
                ucret += 200000 * 0.06;
                kalan -= 200000;
                ucret += kalan * 0.05;
            } else {
                ucret = kalan * 0.06;
            }
            if (ucret < 5000) ucret = 5000;
            const taraf = Number(v.tarafSayisi) || 2;
            const tarafBasiUcret = ucret / taraf;
            return { toplamUcret: ucret, tarafBasiUcret };
        },
        seo: {
            title: { tr: "Arabuluculuk Ücreti Hesaplama 2026 (Nispi ve Maktu) | HesapMod", en: "Mediation Fee Calculator 2026 (Proportional & Fixed) | HesapMod" },
            metaDescription: { tr: "2026 arabuluculuk asgari ücret tarifesine göre toplam ve taraf başı ücreti hesaplayın.", en: "Calculate total and per party mediation fee for 2026." },
            content: {
                tr: `<h3>Arabuluculuk Ücreti Nasıl Hesaplanır?</h3><p>2026 Adalet Bakanlığı Arabuluculuk Asgari Ücret Tarifesi'ne göre, ilk 200.000 TL için %6, sonrası için %5 oranı uygulanır. Maktu alt sınır 5.000 TL'dir.</p><h3>Taraflara Paylaşım</h3><p>Toplam ücret taraf sayısına bölünerek kişi başı ödeme bulunur.</p><h3>Kaynaklar</h3><ul><li>Adalet Bakanlığı</li></ul>`,
                en: "Mediation fee is calculated as 6% for the first 200,000 TRY, 5% for the rest. Minimum fee is 5,000 TRY. Total is divided by number of parties."
            },
            faq: [
                { q: { tr: "Arabuluculuk ücretini kim öder?", en: "Who pays the mediation fee?" }, a: { tr: "Taraflar eşit paylaşır.", en: "The parties share equally." } },
                { q: { tr: "Anlaşmama durumunda arabulucuya ücret ödenir mi?", en: "Is the mediator paid if there is no agreement?" }, a: { tr: "Zorunlu arabuluculukta anlaşma olmazsa maktu ücret ödenir.", en: "In mandatory mediation, a fixed fee is paid even if there is no agreement." } }
            ]
        }
    }
];
