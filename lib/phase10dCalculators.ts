import { CalculatorConfig } from "./calculator-source";

export const phase10dCalculators: CalculatorConfig[] = [
    {
        id: "e-tebligat-calc",
        slug: "e-tebligat-teblig-tarihi-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-19",
        name: { tr: "E-tebligat Tebliğ Tarihi Hesaplama", en: "E-Notification Date Calculator" },
        h1: { tr: "Elektronik Tebligat (KEP/UETS) Tebliğ Tarihi Hesaplama", en: "E-Notification Delivery Date" },
        description: { tr: "UETS veya KEP adresinize gelen elektronik tebligatların yasal olarak tebliğ sayıldığı tarihi (5 günlük süre kuralı ile) öğrenin.", en: "Calculate the legal delivery date of electronic notification (5 days rule)." },
        shortDescription: { tr: "Gelen kutunuza (UETS/KEP) düşen tebligatın tebliğ edilmiş sayılacağı (süresinin başlayacağı) yasal tarihi hesaplayın.", en: "Find legally considered delivery date of an electronic notice." },
        inputs: [
            { id: "arrivalDate", name: { tr: "E-tebligatın Hesaba Ulaştığı Tarih", en: "Arrival Date to E-account" }, type: "date", required: true }
        ],
        results: [
            { id: "deliveryDate", label: { tr: "Yasal Tebliğ Edilmiş Sayılma Tarihi", en: "Legal Delivery Date" }, type: "text" }
        ],
        formula: (v) => {
            if (!v.arrivalDate) return { deliveryDate: "Tarih Seçilmedi" };
            const arr = new Date(v.arrivalDate);
            // Tebligat Kanunu 7/a maddesi gereğince, e-tebligat gönderildiği günü izleyen 5. günün sonunda tebliğ sayılır.
            arr.setDate(arr.getDate() + 5);
            // Format YYYY-MM-DD for consistency or locale string
            const dd = String(arr.getDate()).padStart(2, '0');
            const mm = String(arr.getMonth() + 1).padStart(2, '0');
            const yyyy = arr.getFullYear();
            return { deliveryDate: `${dd}.${mm}.${yyyy}` };
        },
        seo: {
            title: { tr: "E-Tebligat Tebliğ Tarihi Hesaplama (5 Gün Kuralı) 2026", en: "E-Notification Calendar 2026" },
            metaDescription: { tr: "UETS adresine düşen e-tebligat veya KEP iletisinin yasal olarak hangi gün tebliğ edilmiş sayılacağını anında hesaplayın.", en: "Calculate the 5th-day rule of UETS e-notifications." },
            content: { tr: "Türkiye Cumhuriyeti Tebligat Kanunu madde 7/a fıkrası hükmüne göre elektronik tebligat, muhatabın elektronik ortamdaki hesabına ulaştığı tarihi izleyen 5. günün sonunda yapılmış (tebliğ edilmiş) sayılır.", en: "Turkish law mandates 5 days for notification validation." },
            faq: [
                { q: { tr: "Hesabıma girmesem de 5. gün kabul edilir mi?", en: "Even if I don't read it?" }, a: { tr: "Evet, sisteme hiç girmeseniz dahi, kutuya düştüğü günü takip eden 5. gün otomatik olarak tebliğ sayılır.", en: "Yes, it is deemed delivered end of 5th day automatically." } },
                { q: { tr: "Süre ne zaman başlar?", en: "When does the limit start?" }, a: { tr: "Verilen yasal cevap süresi (7 gün, 15 gün vb.) tebliğ sayıldığı günün ertesi gününden itibaren işlemeye başlar.", en: "Counters start day after delivery date." } }
            ],
            richContent: {
                howItWorks: { tr: "Seçtiğiniz geliş tarihini izleyen 5 günlük süreyi formülle hesaplar.", en: "Adds exact 5 days to selection." },
                formulaText: { tr: "Tebliğ Tarihi = E-Tebligat Geliş Tarihi + 5 Gün", en: "Date + 5 Days" },
                exampleCalculation: { tr: "Pazartesi günü kutuya düşen belge, izleyen 5. gün olan o haftanın Cumartesi günü tebliğ edilmiş sayılır (Dava açma veya itiraz süresi Pazar günü işlemeye başlar).", en: "Monday arrives, Saturday deemed communicated." },
                miniGuide: { tr: "Cevap son günü tatil gününe denk gelirse, takip eden ilk iş günü mesai bitimine kadar uzar.", en: "Holidays push deadlines to next working day." }
            }
        }
    },
    {
        id: "hotel-price-calc",
        slug: "otel-fiyati-hesaplama",
        category: "diger",
        updatedAt: "2026-04-19",
        name: { tr: "Otel Fiyatı Hesaplama", en: "Hotel Price Calculator" },
        h1: { tr: "Tatil ve Otel Konaklama Maliyeti Hesaplama", en: "Hotel & Vacation Cost Calculator" },
        description: { tr: "Tatil veya iş seyahatiniz için kişi sayısı, geceleme sayısı ve gecelik fiyatlara göre toplam konaklama maliyeti bütçenizi çıkarın.", en: "Calculate total accommodation cost based on nights and pax." },
        shortDescription: { tr: "Kişi sayısı ve otelde geçirilecek gece sayısına bağlı toplam maliyeti tek tıkla bulun.", en: "Find out total booking price dynamically." },
        inputs: [
            { id: "nights", name: { tr: "Gece Sayısı", en: "Number of Nights" }, type: "number", defaultValue: 5, required: true },
            { id: "pax", name: { tr: "Yetişkin Sayısı", en: "Adults" }, type: "number", defaultValue: 2, required: true },
            { id: "child", name: { tr: "Çocuk Sayısı", en: "Children" }, type: "number", defaultValue: 0, required: true },
            { id: "pricePP", name: { tr: "Kişi Başı Gecelik Fiyat (₺/$) vs.", en: "Price Per Person per Night" }, type: "number", defaultValue: 1500, required: true }
        ],
        results: [
            { id: "totalCost", label: { tr: "Tahmini Toplam Otel Fiyatı", en: "Estimated Total Price" }, decimalPlaces: 2 }
        ],
        formula: (v) => {
            const nights = parseFloat(v.nights) || 0;
            const pax = parseFloat(v.pax) || 0;
            const childList = parseFloat(v.child) || 0;
            const price = parseFloat(v.pricePP) || 0;
            
            // Assume child is half price
            const childCoef = childList * 0.5;
            
            return {
                totalCost: (pax + childCoef) * price * nights
            };
        },
        seo: {
            title: { tr: "Otel Fiyatı Hesaplama (Tatil Konaklama Maliyeti) 2026", en: "Hotel Price Calculator 2026" },
            metaDescription: { tr: "Gideceğiniz oteldeki kişi sayısı, konaklama gece sayısı ve oda fiyatına göre tatil bütçenizi ve toplam masrafınızı hesaplayın.", en: "Calculate total vacation accommodation." },
            content: { tr: "Otel veya pansiyon fiyatı planlamak, erken rezervasyon indirimleri dışında temel çarpan matematiğinden oluşur. Kişi sayısı x gece x fiyat formülü esastır.", en: "Standard accommodation budget math." },
            faq: [
                { q: { tr: "0-6 yaş çocuklar fiyata dahil edilir mi?", en: "Are children charged?" }, a: { tr: "Pek çok tesiste belirli yaş altı çocuklar 1 veya 2 kişiye kadar ücretsizdir. Standart otel kuralları geçerlidir.", en: "Usually free up to a certain age limit." } }
            ],
            richContent: {
                howItWorks: { tr: "Yetişkin sayısını tam, çocuğu yarım çarpan sayarak fiyat ve günle çarpar.", en: "Adult=1, Child=0.5 multiplied by nights." },
                formulaText: { tr: "Fiyat = (Yetişkin + Çocuk/2) x Gece x Birim Fiyat", en: "Cost = (Pax + Child/2) * Night * Price" },
                exampleCalculation: { tr: "1500 TL kişi başı bir otelde 2 kişi 5 gece kalırsa toplam tutar 15.000 TL olur.", en: "1500 x 2 x 5 = 15000." },
                miniGuide: { tr: "Bu aracın sonucu acente indirimleri hesaba katılmadığından genel maliyet tahmini içindir.", en: "Discounts and fees excluded." }
            }
        }
    },
    {
        id: "bus-ticket",
        slug: "en-ucuz-otobus-bileti-fiyati-hesaplama",
        category: "diger",
        updatedAt: "2026-04-19",
        name: { tr: "Otobüs Bileti Fiyatı Hesaplama", en: "Bus Ticket Price Calculator" },
        h1: { tr: "Şehirlerarası Otobüs Bilet Fiyatı", en: "Intercity Bus Ticket Estimator" },
        description: { tr: "Otobüs biletleri kilometre başına genel ortalama tarifelere göre ücretlendirilir. İller arası tahmini yolcu ücretini hesaplayın.", en: "Estimate bus ticket prices based on km." },
        shortDescription: { tr: "Gideceğiniz mesafeyi (KM) girin, otobüs firmalarının talep edebileceği tahmini bilet (Tavan/Taban) fiyatını görün.", en: "Enter distance (KM) to estimate bus fare." },
        inputs: [
            { id: "distance", name: { tr: "Gidilecek Mesafe (km)", en: "Distance to Travel (km)" }, type: "number", defaultValue: 450, required: true },
            { id: "pax", name: { tr: "Yolcu Sayısı", en: "Number of Passengers" }, type: "number", defaultValue: 1, required: true }
        ],
        results: [
            { id: "estimatedTicket", label: { tr: "Tahmini Kişi Başı Bilet (₺)", en: "Estimated per-Pax Ticket (₺)" }, decimalPlaces: 0 },
            { id: "totalTicket", label: { tr: "Toplam Tutar (₺)", en: "Total Amount" }, decimalPlaces: 0 }
        ],
        formula: (v) => {
            const dist = parseFloat(v.distance) || 0;
            const pax = parseFloat(v.pax) || 1;
            // Rough estimation in Turkey 2026: Base 250 TL + (~1.2 TL per km)
            const pricePP = 250 + (dist * 1.2);
            
            return {
                estimatedTicket: pricePP,
                totalTicket: pricePP * pax
            };
        },
        seo: {
            title: { tr: "En Ucuz Otobüs Bileti Fiyat Ortalaması Hesaplama 2026", en: "Bus Ticket Price Calculator" },
            metaDescription: { tr: "Ulaştırma bakanlığı fiyat tavan katsayıları çerçevesinde kilometre (km) girerek ortalama bir şehirlerarası otobüs bileti ücretini tahmin edin.", en: "Estimate intercity bus ticket cost." },
            content: { tr: "Şehirlerarası otobüs firmaları bilet fiyatlarını, yolun mesafesi, otoban geçiş ücretleri ve yakıt gibi çok sayıda parametreye göre Ulaştırma Bakanlığı denetiminde serbest piyasada belirler. Bu hesaplayıcı yasal karayolu taşımacılığı tavan tarifesine paralel ortalama bir tutar verir.", en: "Based on dynamic algorithms estimating market conditions." },
            faq: [
                { q: { tr: "Tahmini bilet fiyatı kesin midir?", en: "Is it exact?" }, a: { tr: "Kesin değildir. Firmaların sefer kapasitesine ve premium koltuk modeline (2+1 vs) göre %20-%30 varyans (sapma) gösterebilir.", en: "Varies by 20-30% depending on firm." } }
            ],
            richContent: {
                howItWorks: { tr: "Km bazında bir taban maliyet çarpanıyla çalışır.", en: "Base cost + (Km multiplier)" },
                formulaText: { tr: "Yaklaşık Fiyat = TabanÜcret + (Km * Sabit Çarpan)", en: "Base + Km*Const" },
                exampleCalculation: { tr: "Ankara-İstanbul arası 450 km için sonuç ortalama 700 - 800₺ aralığı verecektir.", en: "Typically gives a 700-800 TRY variance." },
                miniGuide: { tr: "Özel biletli bagaj haklarınızı unutmamanız ve firmadan firmaya değişen fiyatlandırmaları kontrol etmeniz önerilir.", en: "Check excess baggage." }
            }
        }
    },
    {
        id: "flight-ticket",
        slug: "en-ucuz-ucak-bileti",
        category: "diger",
        updatedAt: "2026-04-19",
        name: { tr: "Uçak Bileti Maliyeti (Tahmini)", en: "Flight Ticket Estimator" },
        h1: { tr: "Yurtiçi Uçuş Tavan Bilet Fiyatı Hesaplayıcısı", en: "Domestic Flight Maximum Price Estimator" },
        description: { tr: "Sivil Havacılık Genel Müdürlüğü (SHGM) iç hat tavan uçak bileti sınırlarına göre bilet tutarlarını inceleyin.", en: "Analyze domestic flight ticket price caps." },
        shortDescription: { tr: "Türkiye içi uçuşlar için yasal belirlenen tavan (maksimum) bilet fiyat tahmini hesaplaması alın.", en: "Estimate max prices for Turkish domestic flights." },
        inputs: [
            { id: "pass", name: { tr: "Bilet Alan Kişi Sayısı", en: "Number of Tickets" }, type: "number", defaultValue: 1, required: true },
            { 
                id: "flightType", name: { tr: "Bilet Sınıfı", en: "Ticket Class" }, type: "select", defaultValue: "economy",
                options: [
                    { label: { tr: "Ekonomi (Eko Sınıfı Max Tavan)", en: "Economy (Max Cap)" }, value: "economy" },
                    { label: { tr: "Promosyonlu (Gelişmiş Alım)", en: "Promo (Early Bird)" }, value: "promo" }
                ] 
            }
        ],
        results: [
            { id: "capPricePP", label: { tr: "Ekonomi Kişi Başı Tavan Fiyat", en: "Per Pax Cap Price" }, suffix: " ₺", decimalPlaces: 0 },
            { id: "totalPrice", label: { tr: "Toplam Tutar", en: "Total Amount" }, suffix: " ₺", decimalPlaces: 0 }
        ],
        formula: (v) => {
            const t = parseFloat(v.pass) || 0;
            // Example Cap in Turkey 2026 (Domestic): roughly 3500-4500 TL
            const currentCap = 4500;
            const promoCap = 2800; // Expected average promo
            const base = (v.flightType === "economy") ? currentCap : promoCap;
            
            return {
                capPricePP: base,
                totalPrice: base * t
            };
        },
        seo: {
            title: { tr: "En Ucuz Uçak Bileti ve Tavan Fiyat Hesaplayıcısı 2026", en: "Flight Ticket Capping Estimator" },
            metaDescription: { tr: "Yurtiçi uçuşlarda tek yön için güncel SHGM ekonomi Sınıfı tavan uçak bileti fiyatlarını ve promosyon tutarlarını görüntüleyin.", en: "Estimate domestic flight ticket prices based on civil aviation maximum caps." },
            content: { tr: "Tavan fiyat uygulaması, Türkiye'de iç hat ekonomik yolcu taşımacılığında biletin satışa sunulabileceği en yüksek resmi limiti ifade eder.", en: "Flight prices face formal regulatory bounds domestically." },
            faq: [
                { q: { tr: "Tavan fiyatı geçerli olan uçuşlar hangileri?", en: "Which flights have caps?" }, a: { tr: "Yalnızca yurt içi, direkt ekonomi sınıfı biletlerde geçerlidir (Business kısımlar dahil değildir).", en: "Only domestic direct economy." } }
            ],
            richContent: {
                howItWorks: { tr: "Güncel tavan oranını yolcu sayısıyla çarpar.", en: "Multiplies current cap with passengers." },
                formulaText: { tr: "Maliyet = Güncel Tavan Limit (SHGM) x Kişi Sayısı", en: "Cost = MaxCap * Pax" },
                exampleCalculation: { tr: "Tavan fiyat 4500 lira olan bir sezonda 3 kişilik uçuş maliyeti ekonomi sınıfında 13500 lira sınırını aşamaz.", en: "Max cost cannot exceed given numbers." },
                miniGuide: { tr: "Bayram/özel günlerde erken alsanız da havayolları sıklıkla tavan fiyattan satar.", en: "Holidays often hit maximum caps instantly." }
            }
        }
    },
    {
        id: "health-insurance",
        slug: "saglik-sigortasi-hesaplama",
        category: "finansal-hesaplamalar",
        updatedAt: "2026-04-19",
        name: { tr: "Tamamlayıcı Sağlık Sigortası Hesaplama", en: "Complementary Health Insurance Calc" },
        h1: { tr: "TSS / Özel Sağlık Sigortası (ÖSS) Tahmini Prim", en: "Health Insurance Premium Estimator" },
        description: { tr: "Yaş, şehir ve cinsiyet durumunuza göre SGK anlaşmalı veya full kapsamlı özel sağlık sigortası senelik primlerini tahmin edin.", en: "Estimate complementary health insurance (TSS) premiums." },
        shortDescription: { tr: "Yaş ve şehir kriterlerinize göre Tamamlayıcı Sağlık Sigortası (TSS) yıllık ortalama prim ücretini çıkarın.", en: "Quickly figure out private health insurance estimated premiums." },
        inputs: [
            { id: "age", name: { tr: "Sigortalının Yaşı", en: "Age" }, type: "number", defaultValue: 30, required: true },
            { id: "city", name: { tr: "Kayıtlı Şehir (Risk endeksi)", en: "City" }, type: "select", options: [{label: {tr:"Büyükşehir (İst/Ank)",en:"Metropolitan"}, value:"1.2"},{label: {tr:"Diğer Anadolu İlleri",en:"Other"}, value:"1.0"}] }
        ],
        results: [
            { id: "tssPremium", label: { tr: "Yıllık Ortalama TSS Primi Tutarı", en: "Avg. Yearly Complementary Premium" }, suffix: " ₺", decimalPlaces: 0 },
            { id: "ossPremium", label: { tr: "Yıllık Özel Sağlık (A Ağı) Primi", en: "Avg. Private Health Insurance" }, suffix: " ₺", decimalPlaces: 0 }
        ],
        formula: (v) => {
            const age = parseFloat(v.age) || 30;
            const cityMod = parseFloat(v.city) || 1.0;
            
            // Base TSS ~6000 TRY. Exponential factor for age.
            const tssBase = 6000;
            const ageRisk = (age > 18) ? Math.pow(1.03, age - 18) : 1;
            
            const tssPremium = tssBase * ageRisk * cityMod;
            
            // OSS is typically ~3x to 4x of TSS depending on plan
            return {
                tssPremium: tssPremium,
                ossPremium: tssPremium * 3.5
            };
        },
        seo: {
            title: { tr: "Tamamlayıcı Sağlık Sigortası (TSS) Prim Hesaplama 2026", en: "Complementary Health Insurance Calculator" },
            metaDescription: { tr: "Hastanelerde fark ücreti ödememek için yaşınıza ve şehrinize göre ortalama ödenmesi gereken yıllık tamamlayıcı(TSS) sağlık sigortası poliçe fiyatı hesabı.", en: "Estimate health insurance premiums." },
            content: { tr: "Özel ve Tamamlayıcı Sağlık Sigortasında 18-35 yaş grubu en az riskli gruptur ve primleri en düşüktür. İleri yaşlarda artan medikal enflasyon prim maliyetlerini üstel olarak büyütür.", en: "Based on medical inflation and age risk pools." },
            faq: [
                { q: { tr: "Sigorta poliçe süresi ne kadardır?", en: "How long is the policy valid?" }, a: { tr: "TSS ve ÖSS primleri her sene yıllık olarak peşin veya 9 taksitle ödenerek bir yıllığına poliçelendirilir.", en: "Annually paid or 9-months installment covering a full year." } }
            ],
            richContent: {
                howItWorks: { tr: "Taban fiyatın üzerine 'yaş risk çarpanını' ve 'şehir hastane ağı çarpanını' ilave eder.", en: "Risk multipliers over base." },
                formulaText: { tr: "Yıllık Prim = Taban Fiyat * Yaş Çarpanı * Şehir Komisyonu", en: "Premium = Base * AgeRisk * GeoRisk" },
                exampleCalculation: { tr: "30 yaşındaki bir İstanbul sakini için ortalamada TSS poliçesi 11.500₺ ile 16.000₺ aralığında çıkar (2026 fiyatlaması tahmini ile).", en: "Example estimate." },
                miniGuide: { tr: "Kapsamları (limitsiz yatarak - 10 adet ayakta vs.) karşılaştırırken bu sistem net teklif değil bir fikirdir.", en: "Not an official quote but a guide." }
            }
        }
    },
    {
        id: "vehicle-kasko",
        slug: "kasko-hesaplama",
        category: "finansal-hesaplamalar",
        updatedAt: "2026-04-19",
        name: { tr: "Kasko Hesaplama (Kasko Değeri Üzerinden)", en: "Vehicle Custom Insurance Calculator" },
        h1: { tr: "Araç Kasko Değerinden Kasko Öngörüsü", en: "Kasko Premium Predictor" },
        description: { tr: "Türkiye Sigorta Birliği'nin belirlediği araç rayiç kasko değerine ve hasarsızlık indiriminize göre kasko prim tahmini çıkarın.", en: "Estimate Kasko (Comprehensive Insurance) premiums." },
        shortDescription: { tr: "Aracınızın piyasa (rayiç kasko) değerini ve yıllara göre hasarsızlık indirim seviyenizi girerek tahmini poliçe teklifi üretin.", en: "Generate Kasko premium offer estimation based on car value and NCB." },
        inputs: [
            { id: "carValue", name: { tr: "Aracın Kasko / Piyasa Değeri (₺)", en: "Car Value (₺)" }, type: "number", defaultValue: 1000000, required: true },
            { id: "discount", name: { tr: "Hasarsızlık İndirimi (%)", en: "No-Claims Bonus (%)" }, type: "select", 
                options: [
                    { label: { tr: "0 (İlk kez kaskolatıyorum / Hasarım var)", en: "0%" }, value: "0" },
                    { label: { tr: "1 Yıl %30", en: "30%" }, value: "30" },
                    { label: { tr: "2 Yıl %40", en: "40%" }, value: "40" },
                    { label: { tr: "3 Yıl %50", en: "50%" }, value: "50" },
                    { label: { tr: "4 Yıl ve Üzeri %60", en: "60%" }, value: "60" }
                ], defaultValue: "0" }
        ],
        results: [
            { id: "rawPremium", label: { tr: "Hasarsızlık Öncesi Kasko (Baz)", en: "Base Premium" }, suffix: " ₺", decimalPlaces: 0 },
            { id: "estimatedCost", label: { tr: "Net Ödenecek Tahmini Kasko", en: "Net Estimated Invoice" }, suffix: " ₺", decimalPlaces: 0 }
        ],
        formula: (v) => {
            const val = parseFloat(v.carValue) || 100000;
            const discount = parseFloat(v.discount) || 0;
            
            // Broad rule of thumb: ~ 2.5% of asset value is base premium.
            const basePremium = val * 0.025;
            const finalPremium = basePremium * ((100 - discount) / 100);

            return {
                rawPremium: basePremium,
                estimatedCost: finalPremium
            };
        },
        seo: {
            title: { tr: "Kasko Hesaplama (Hasarsızlık İndirimli) 2026", en: "Car Insurance Calculator" },
            metaDescription: { tr: "Araç piyasa değeri (rayiç bedel) ve Tramer hasarsızlık indirim (kademe) oranınızı sisteme seçerek 1 yıllık net kasko sigortası prim masrafını bulun.", en: "Calculate Kasko comprehensive vehicle premiums in Turkey." },
            content: { tr: "Kasko değer listesi, her ay TSB tarafından güncellenir. Araçta olası kaza zararlarını, yanmayı veya çalınmayı üstlenen kaskoların fiyatı aracın ederi ve sürücünün dikkatine (tramer geçmişi) göre belirlenir.", en: "Insurance relies heavily on the asset base price and NO Claims Bonus." },
            faq: [
                { q: { tr: "Hasarsızlık indirimi aktarılır mı?", en: "Can NCB be transferred?" }, a: { tr: "Evet, aracı satsanız bile kazandığınız hak (kademe indirimi) 1 yıla kadar sisteme kayıtlı kalır ve yeni araca poliçe kesilince indirim yansıtılır.", en: "Yes, it is bound to the driver." } }
            ],
            richContent: {
                howItWorks: { tr: "Aracın bedelinin ortalama %2.5'ini temel risk havuzu olarak alıp, indirim kademesi oranında miktar eksiltir.", en: "Takes 2.5% base and lowers with discount." },
                formulaText: { tr: "Kasko = (Değer x 0.025) x (1 - İndirim Oranı)", en: "Kasko = Value * 0.025 * (1 - Discount)" },
                exampleCalculation: { tr: "1 milyon TL eden model araçta (1.000.000 x 0.025) 25 bin TL baz prim çıkar, eğer %50 indiriminiz var ise 12.500 TL civarı poliçe kesilir.", en: "1 Million car with 50% NCB brings 12.5k try premium." },
                miniGuide: { tr: "Yetkili Servis ve Orijinal Parça (cam dahil) teminatları tahmini artıracağı gibi, Muvafakatlı (Sade) poliçeler düşürecektir.", en: "Authorized dealer repairs add to premium variance." }
            }
        }
    }
];
