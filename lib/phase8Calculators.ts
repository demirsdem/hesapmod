// Phase 8: Hukuk, Seyahat ve Dini/Diğer Araçlar
// HesapMod - 2026
import { CalculatorConfig } from "./calculator-types";

export const phase8Calculators: CalculatorConfig[] = [
    // 1. Hukuki Süre Hesaplama
    {
        id: "hukuki-sure",
        slug: "hukuki-sure-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-12",
        name: { tr: "Hukuki Süre Hesaplama", en: "Legal Deadline Calculator" },
        h1: { tr: "Hukuki Süre Hesaplama (İstinaf, İtiraz, Cevap)", en: "Legal Deadline Calculator (Appeal, Objection, Response)" },
        description: { tr: "Tebliğ tarihi, süre tipi ve iş günü/takvim günü ayrımına göre hukuki sürelerin bitiş tarihini hesaplayın.", en: "Calculate legal deadlines based on notification date, duration type, and business/calendar day distinction." },
        shortDescription: { tr: "Dava, istinaf, temyiz ve itiraz sürelerini öğrenin.", en: "Find out legal deadlines for lawsuits, appeals, objections." },
        relatedCalculators: [],
        inputs: [
            { id: "tebligTarihi", name: { tr: "Tebliğ Tarihi", en: "Notification Date" }, type: "date", required: true },
            { id: "sureTipi", name: { tr: "Süre Tipi", en: "Duration Type" }, type: "select", options: [
                { label: { tr: "Gün", en: "Day" }, value: "gun" },
                { label: { tr: "Hafta", en: "Week" }, value: "hafta" },
                { label: { tr: "Ay", en: "Month" }, value: "ay" }
            ], required: true },
            { id: "sure", name: { tr: "Süre", en: "Duration" }, type: "number", min: 1, max: 365, step: 1, required: true },
            { id: "isGunu", name: { tr: "İş Günü mü?", en: "Business Day?" }, type: "checkbox" }
        ],
        results: [
            { id: "bitisTarihi", label: { tr: "Bitiş Tarihi", en: "End Date" }, type: "text" }
        ],
        formula: (v) => {
            const start = new Date(v.tebligTarihi);
            let days = 0;
            if (v.sureTipi === "gun") days = Number(v.sure) || 0;
            if (v.sureTipi === "hafta") days = (Number(v.sure) || 0) * 7;
            if (v.sureTipi === "ay") days = (Number(v.sure) || 0) * 30;
            let current = new Date(start);
            let added = 0;
            while (added < days) {
                current.setDate(current.getDate() + 1);
                if (v.isGunu) {
                    // Cumartesi (6) ve Pazar (0) atla
                    if (current.getDay() !== 0 && current.getDay() !== 6) added++;
                } else {
                    added++;
                }
            }
            // Son gün hafta sonuna denk gelirse ilk iş gününe at
            while (v.isGunu && (current.getDay() === 0 || current.getDay() === 6)) {
                current.setDate(current.getDate() + 1);
            }
            return { bitisTarihi: current.toLocaleDateString("tr-TR") };
        },
        seo: {
            title: { tr: "Hukuki Süre Hesaplama (İstinaf, İtiraz ve Cevap Dilekçesi) | HesapMod", en: "Legal Deadline Calculator (Appeal, Objection, Response) | HesapMod" },
            metaDescription: { tr: "HMK ve CMK'ya göre dava açma, istinaf, temyiz ve itiraz sürelerinin bitiş tarihini hesaplayın.", en: "Calculate end dates for lawsuits, appeals, objections under Turkish law." },
            content: {
                tr: `<h3>Hukuki Süreler Nasıl Hesaplanır?</h3><p>HMK ve CMK'ya göre tebliğden itibaren süreler başlar. Süreler iş günü veya takvim günü olarak belirlenebilir. Son gün hafta sonu veya resmi tatile denk gelirse, süre ilk iş gününe uzar. Adli tatilde bazı süreler durur.</p><h3>Adli Tatil Etkisi</h3><p>Adli tatilde bazı davalarda süreler işlemez. Detaylar için HMK m. 102 ve CMK m. 331'e bakınız.</p><h3>Kaynaklar</h3><ul><li>Adalet Bakanlığı</li><li>HMK, CMK</li></ul>`,
                en: "Legal deadlines start from notification. If the last day is a weekend or public holiday, it moves to the next business day. Some deadlines pause during judicial recess."
            },
            faq: [
                { q: { tr: "Adli tatilde süreler işler mi?", en: "Do deadlines run during judicial recess?" }, a: { tr: "Bazı davalarda işlemez, HMK m. 102'ye bakınız.", en: "Not for all cases, see HMK art. 102." } },
                { q: { tr: "Son gün hafta sonuna denk gelirse süre uzar mı?", en: "If the last day is a weekend, is the deadline extended?" }, a: { tr: "Evet, ilk iş gününe uzar.", en: "Yes, it is extended to the next business day." } }
            ]
        }
    },
    // 2. Uzlaştırmacı Ücreti Hesaplama
    {
        id: "uzlastirmaci-ucreti",
        slug: "uzlastirmaci-ucreti-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-12",
        name: { tr: "Uzlaştırmacı Ücreti Hesaplama", en: "Conciliator Fee Calculator" },
        h1: { tr: "Uzlaştırmacı Ücreti (Ceza Muhakemesi)", en: "Conciliator Fee (Criminal Procedure)" },
        description: { tr: "Taraf sayısı ve uzlaşma sonucuna göre 2026 uzlaştırmacı asgari ücretini hesaplayın.", en: "Calculate 2026 minimum conciliator fee based on number of parties and result." },
        shortDescription: { tr: "Uzlaştırmacı ücretini öğrenin.", en: "Find out the conciliator fee." },
        relatedCalculators: [],
        inputs: [
            { id: "tarafSayisi", name: { tr: "Taraf Sayısı", en: "Number of Parties" }, type: "select", options: [
                { label: { tr: "2-3 Taraf", en: "2-3 Parties" }, value: "2-3" },
                { label: { tr: "4-6 Taraf", en: "4-6 Parties" }, value: "4-6" },
                { label: { tr: "7+ Taraf", en: "7+ Parties" }, value: "7+" }
            ], required: true },
            { id: "sonuc", name: { tr: "Uzlaşma Sağlandı mı?", en: "Was Settlement Achieved?" }, type: "select", options: [
                { label: { tr: "Evet", en: "Yes" }, value: "evet" },
                { label: { tr: "Hayır", en: "No" }, value: "hayir" }
            ], required: true }
        ],
        results: [
            { id: "tabanUcret", label: { tr: "Taban Ücret", en: "Minimum Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "tavanUcret", label: { tr: "Tavan Ücret", en: "Maximum Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 örnek tarifesi: 2-3 taraf: 3000-3500 TL, 4-6 taraf: 3500-4000 TL, 7+: 4000-4500 TL. Sağlanamadıysa 1500 TL sabit.
            if (v.sonuc === "hayir") return { tabanUcret: 1500, tavanUcret: 1500 };
            if (v.tarafSayisi === "2-3") return { tabanUcret: 3000, tavanUcret: 3500 };
            if (v.tarafSayisi === "4-6") return { tabanUcret: 3500, tavanUcret: 4000 };
            if (v.tarafSayisi === "7+") return { tabanUcret: 4000, tavanUcret: 4500 };
            return { tabanUcret: 0, tavanUcret: 0 };
        },
        seo: {
            title: { tr: "Uzlaştırmacı Ücreti Hesaplama 2026 (Adalet Bakanlığı) | HesapMod", en: "Conciliator Fee Calculator 2026 (Ministry of Justice) | HesapMod" },
            metaDescription: { tr: "2026 uzlaştırmacı asgari ücret tarifesine göre ücret hesaplayın.", en: "Calculate conciliator fee for 2026 as per official tariff." },
            content: {
                tr: `<h3>Uzlaştırmacı Ücreti Nasıl Hesaplanır?</h3><p>2026 yılı Adalet Bakanlığı uzlaştırmacı asgari ücret tarifesine göre, taraf sayısı ve uzlaşma sonucuna göre taban ve tavan ücret belirlenir. Uzlaşma sağlanamazsa sabit ücret ödenir.</p><h3>Ücretin Ödenmesi</h3><p>Uzlaştırma ücretini kural olarak devlet öder. Uzlaşma teklifinin reddi veya sağlanamaması durumunda da belirli bir ücret ödenir.</p><h3>Kaynaklar</h3><ul><li>Adalet Bakanlığı</li></ul>`,
                en: "Fee is determined by number of parties and result. If no settlement, a fixed fee is paid. Usually paid by the state."
            },
            faq: [
                { q: { tr: "Uzlaştırma ücretini devlet mi taraflar mı öder?", en: "Who pays the conciliator fee?" }, a: { tr: "Kural olarak devlet öder.", en: "Usually the state pays." } },
                { q: { tr: "Uzlaşma sağlanamazsa ücret alınır mı?", en: "Is a fee paid if no settlement?" }, a: { tr: "Evet, sabit ücret ödenir.", en: "Yes, a fixed fee is paid." } }
            ]
        }
    },
    // 3. Taksi Ücreti Hesaplama
    {
        id: "taksi-ucreti",
        slug: "taksi-ucreti-hesaplama",
        category: "seyahat",
        updatedAt: "2026-04-12",
        name: { tr: "Taksi Ücreti Hesaplama", en: "Taxi Fare Calculator" },
        h1: { tr: "Taksi Ücreti (2026)", en: "Taxi Fare (2026)" },
        description: { tr: "Şehir ve mesafeye göre 2026 taksi ücretini hesaplayın.", en: "Calculate 2026 taxi fare by city and distance." },
        shortDescription: { tr: "Taksi ücretini öğrenin.", en: "Find out the taxi fare." },
        relatedCalculators: [],
        inputs: [
            { id: "sehir", name: { tr: "Şehir", en: "City" }, type: "select", options: [
                { label: { tr: "İstanbul", en: "Istanbul" }, value: "istanbul" },
                { label: { tr: "Ankara", en: "Ankara" }, value: "ankara" },
                { label: { tr: "İzmir", en: "Izmir" }, value: "izmir" },
                { label: { tr: "Diğer", en: "Other" }, value: "diger" }
            ], required: true },
            { id: "mesafe", name: { tr: "Mesafe (km)", en: "Distance (km)" }, type: "number", min: 0.1, max: 100, step: 0.1, required: true }
        ],
        results: [
            { id: "tahminiUcret", label: { tr: "Tahmini Ücret", en: "Estimated Fare" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 örnek tarifeler: İstanbul: Açılış 25 TL, km 20 TL, indi-bindi 90 TL; Ankara: 20/18/70; İzmir: 18/16/60; Diğer: 15/14/50
            const tarifeler: Record<string, { acilis: number; km: number; min: number }> = {
                istanbul: { acilis: 25, km: 20, min: 90 },
                ankara: { acilis: 20, km: 18, min: 70 },
                izmir: { acilis: 18, km: 16, min: 60 },
                diger: { acilis: 15, km: 14, min: 50 }
            };
            const sehirKey = typeof v.sehir === 'string' && tarifeler[v.sehir] ? v.sehir : 'diger';
            const t = tarifeler[sehirKey];
            const mesafe = Number(v.mesafe) || 0;
            let ucret = t.acilis + mesafe * t.km;
            if (ucret < t.min) ucret = t.min;
            return { tahminiUcret: ucret };
        },
        seo: {
            title: { tr: "Taksi Ücreti Hesaplama 2026 (İstanbul, Ankara, İzmir) | HesapMod", en: "Taxi Fare Calculator 2026 (Istanbul, Ankara, Izmir) | HesapMod" },
            metaDescription: { tr: "2026 güncel taksimetre açılış ve km ücretleriyle taksi tutarını hesaplayın.", en: "Calculate taxi fare with 2026 opening and per-km rates." },
            content: {
                tr: `<h3>Taksi Ücretleri Nasıl Hesaplanır?</h3><p>2026 yılında İstanbul, Ankara ve İzmir için güncel açılış, kilometre başı ve indi-bindi ücretleri UKOME tarafından belirlenir. Gece/gündüz tarifesi kaldırılmıştır.</p><h3>Kısa Mesafe (İndi-Bindi)</h3><p>Mesafe kısa olsa da minimum ücret uygulanır. Köprü ve otoyol geçişleri ücrete dahil değildir.</p><h3>Kaynaklar</h3><ul><li>UKOME</li></ul>`,
                en: "Taxi fares are set by city councils. Minimum fare applies for short trips. Night/day tariff is abolished. Tolls are extra."
            },
            faq: [
                { q: { tr: "Taksilerde gece tarifesi var mı?", en: "Is there a night tariff for taxis?" }, a: { tr: "Hayır, gece/gündüz tarifesi kalktı.", en: "No, night/day tariff is abolished." } },
                { q: { tr: "Köprü ve otoyol geçiş ücretlerini yolcu mu öder?", en: "Does the passenger pay for tolls?" }, a: { tr: "Evet, yolcuya aittir.", en: "Yes, passenger pays." } }
            ]
        }
    },
    // 4. İller Arası Mesafe ve Süre Hesaplama
    {
        id: "iller-arasi-mesafe",
        slug: "iller-arasi-mesafe-hesaplama",
        category: "seyahat",
        updatedAt: "2026-04-12",
        name: { tr: "İller Arası Mesafe ve Süre Hesaplama", en: "Intercity Distance & Duration Calculator" },
        h1: { tr: "İller Arası Mesafe ve Yolculuk Süresi", en: "Intercity Distance & Travel Time" },
        description: { tr: "İki şehir arası mesafe ve ortalama hız ile yolculuk süresini hesaplayın.", en: "Calculate travel time between two cities by distance and average speed." },
        shortDescription: { tr: "Şehirler arası yolculuk süresini öğrenin.", en: "Find out intercity travel time." },
        relatedCalculators: [],
        inputs: [
            { id: "rota", name: { tr: "Rota", en: "Route" }, type: "select", options: [
                { label: { tr: "İstanbul-Ankara (450 km)", en: "Istanbul-Ankara (450 km)" }, value: 450 },
                { label: { tr: "İstanbul-İzmir (480 km)", en: "Istanbul-Izmir (480 km)" }, value: 480 },
                { label: { tr: "Ankara-İzmir (520 km)", en: "Ankara-Izmir (520 km)" }, value: 520 },
                { label: { tr: "İstanbul-Bursa (155 km)", en: "Istanbul-Bursa (155 km)" }, value: 155 },
                { label: { tr: "İstanbul-Antalya (700 km)", en: "Istanbul-Antalya (700 km)" }, value: 700 },
                { label: { tr: "Kendi Mesafem (KM)", en: "Custom Distance (KM)" }, value: "custom" }
            ], required: true },
            { id: "customKm", name: { tr: "Mesafe (KM)", en: "Distance (KM)" }, type: "number", min: 1, max: 2000, step: 1, required: false, showWhen: { field: "rota", value: "custom" } },
            { id: "hiz", name: { tr: "Ortalama Hız (km/s)", en: "Average Speed (km/h)" }, type: "number", min: 30, max: 150, step: 1, required: true, defaultValue: 90 }
        ],
        results: [
            { id: "sure", label: { tr: "Tahmini Süre", en: "Estimated Duration" }, type: "text" }
        ],
        formula: (v) => {
            let km = v.rota === "custom" ? Number(v.customKm) || 0 : Number(v.rota) || 0;
            let hiz = Number(v.hiz) || 90;
            let saat = km / hiz;
            let saatInt = Math.floor(saat);
            let dakika = Math.round((saat - saatInt) * 60);
            return { sure: `${saatInt} saat ${dakika} dakika` };
        },
        seo: {
            title: { tr: "İller Arası Mesafe ve Yolculuk Süresi Hesaplama | HesapMod", en: "Intercity Distance & Travel Time Calculator | HesapMod" },
            metaDescription: { tr: "Şehirler arası mesafe ve ortalama hız ile yolculuk süresini hesaplayın.", en: "Calculate intercity travel time by distance and speed." },
            content: {
                tr: `<h3>Şehirler Arası Mesafe ve Süre Nasıl Hesaplanır?</h3><p>Karayolları Genel Müdürlüğü verilerine göre popüler rotalar için mesafe ve ortalama hız ile tahmini varış süresi hesaplanır. Mola süreleri dahil değildir.</p><h3>Hız Sınırları</h3><p>Otoyol ve bölünmüş yollarda hız sınırları farklıdır. Trafik kurallarına uyulmalıdır.</p><h3>Kaynaklar</h3><ul><li>Karayolları Genel Müdürlüğü</li></ul>`,
                en: "Travel time is estimated by dividing distance by average speed. Rest breaks are not included. Speed limits vary by road type."
            },
            faq: [
                { q: { tr: "Otoyol ve bölünmüş yollarda hız sınırı kaçtır?", en: "What is the speed limit on highways?" }, a: { tr: "Otoyolda 120 km/s, bölünmüş yolda 110 km/s.", en: "120 km/h on highways, 110 km/h on divided roads." } },
                { q: { tr: "Mola süreleri yolculuk hesaplamasına nasıl dahil edilir?", en: "How are rest breaks included in travel time?" }, a: { tr: "Mola süreleri manuel eklenmelidir.", en: "Rest breaks should be added manually." } }
            ]
        }
    },
    // 5. Zekat Hesaplama
    {
        id: "zekat",
        slug: "zekat-hesaplama",
        category: "diger",
        updatedAt: "2026-04-12",
        name: { tr: "Zekat Hesaplama", en: "Zakat Calculator" },
        h1: { tr: "Zekat Hesaplama 2026 (Altın, Nakit, Nisap)", en: "Zakat Calculator 2026 (Gold, Cash, Nisab)" },
        description: { tr: "Nakit, döviz, altın ve ticari mal varlığına göre 2026 zekat tutarını hesaplayın.", en: "Calculate 2026 zakat based on cash, currency, gold, and trade goods." },
        shortDescription: { tr: "Zekat tutarını öğrenin.", en: "Find out zakat amount." },
        relatedCalculators: [],
        inputs: [
            { id: "nakit", name: { tr: "Nakit (TL)", en: "Cash (TRY)" }, type: "number", min: 0, max: 10000000, step: 1, required: true },
            { id: "doviz", name: { tr: "Döviz (TL Karşılığı)", en: "Currency (TRY Equivalent)" }, type: "number", min: 0, max: 10000000, step: 1, required: true },
            { id: "altin", name: { tr: "Altın (Gram)", en: "Gold (Gram)" }, type: "number", min: 0, max: 100000, step: 0.01, required: true },
            { id: "altinFiyat", name: { tr: "Altın Gram Fiyatı (TL)", en: "Gold Price per Gram (TRY)" }, type: "number", min: 1000, max: 5000, step: 1, required: true, defaultValue: 2500 },
            { id: "ticariMal", name: { tr: "Ticari Mal (TL)", en: "Trade Goods (TRY)" }, type: "number", min: 0, max: 10000000, step: 1, required: true },
            { id: "borc", name: { tr: "Borçlar (TL)", en: "Debts (TRY)" }, type: "number", min: 0, max: 10000000, step: 1, required: true }
        ],
        results: [
            { id: "netServet", label: { tr: "Net Servet", en: "Net Wealth" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "zekatTutari", label: { tr: "Zekat Tutarı", en: "Zakat Amount" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "uyari", label: { tr: "Uyarı", en: "Warning" }, type: "text" }
        ],
        formula: (v) => {
            const altinDegeri = (Number(v.altin) || 0) * (Number(v.altinFiyat) || 0);
            const toplam = (Number(v.nakit) || 0) + (Number(v.doviz) || 0) + altinDegeri + (Number(v.ticariMal) || 0);
            const net = toplam - (Number(v.borc) || 0);
            const nisap = 80.18 * (Number(v.altinFiyat) || 0); // 2026 nisap gramı
            if (net < nisap) return { netServet: net, zekatTutari: 0, uyari: "Zekat düşmemektedir." };
            return { netServet: net, zekatTutari: net * 0.025, uyari: "" };
        },
        seo: {
            title: { tr: "Zekat Hesaplama 2026 (Altın, Nakit ve Nisap Miktarı) | HesapMod", en: "Zakat Calculator 2026 (Gold, Cash, Nisab) | HesapMod" },
            metaDescription: { tr: "2026 yılı nisap miktarı ve altın, nakit, ticari mal zekatını hesaplayın.", en: "Calculate zakat for 2026 with gold, cash, and trade goods." },
            content: {
                tr: `<h3>Zekat Nedir, Kimlere Verilir?</h3><p>Zekat, temel ihtiyaçlar ve borçlar çıktıktan sonra nisap miktarını aşan servetin %2.5'idir. 2026'da nisap yaklaşık 80.18 gram altın değeridir. Kullanılan ev ve araç zekata tabi değildir.</p><h3>Altın ve Ticari Mal Zekatı</h3><p>Altın, nakit, döviz ve ticari mallar zekata tabidir. Diyanet İşleri Başkanlığı fetvalarına göre hesaplanır.</p><h3>Kaynaklar</h3><ul><li>Diyanet İşleri Başkanlığı</li></ul>`,
                en: "Zakat is 2.5% of net wealth above nisab. Gold, cash, currency, and trade goods are included. Main residence and used car are exempt."
            },
            faq: [
                { q: { tr: "Ticaret mallarının zekatı nasıl hesaplanır?", en: "How is zakat for trade goods calculated?" }, a: { tr: "Ticari malların piyasa değeri eklenir.", en: "Market value of trade goods is included." } },
                { q: { tr: "Kullanılan araç ve oturulan evin zekatı verilir mi?", en: "Is zakat paid for used car and main residence?" }, a: { tr: "Hayır, temel ihtiyaçlar zekata tabi değildir.", en: "No, main needs are exempt." } }
            ]
        }
    }
];
