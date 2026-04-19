import { CalculatorConfig } from "./calculator-source";

export const phase10bCalculators: CalculatorConfig[] = [
    {
        id: "weeks-between-dates",
        slug: "iki-tarih-arasindaki-hafta-sayisini-hesaplama",
        category: "zaman-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "İki Tarih Arasındaki Hafta Sayısını Hesaplama", en: "Weeks Between Dates Calculator" },
        h1: { tr: "İki Tarih Arasındaki Hafta Farkını Bulun", en: "Find Weeks Between Two Dates" },
        description: { tr: "Geçmiş veya gelecekteki iki tarih arasında toplam kaç hafta (ve gün) olduğunu hızlıca hesaplayın.", en: "Quickly calculate how many weeks and days are between two dates." },
        shortDescription: { tr: "İki farklı tarihi seçerek aralarındaki toplam hafta ve artan gün sayısını anında görün.", en: "Select two dates to instantly see the total weeks and remaining days between them." },
        inputs: [
            { id: "startDate", name: { tr: "Başlangıç Tarihi", en: "Start Date" }, type: "date", required: true },
            { id: "endDate", name: { tr: "Bitiş Tarihi", en: "End Date" }, type: "date", required: true }
        ],
        results: [
            { id: "totalWeeks", label: { tr: "Toplam Hafta", en: "Total Weeks" }, decimalPlaces: 0 },
            { id: "remainingDays", label: { tr: "Artan Gün", en: "Remaining Days" }, decimalPlaces: 0 },
            { id: "totalDaysText", label: { tr: "Toplam Veri", en: "Total Info" }, type: "text" }
        ],
        formula: (v) => {
            if (!v.startDate || !v.endDate) return { totalWeeks: 0, remainingDays: 0, totalDaysText: "" };
            
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            const weeks = Math.floor(diffDays / 7);
            const days = diffDays % 7;
            
            return {
                totalWeeks: weeks,
                remainingDays: days,
                totalDaysText: `${diffDays} Gün`
            };
        },
        seo: {
            title: { tr: "İki Tarih Arasındaki Hafta Sayısını Hesaplama 2026", en: "Weeks Between Dates Calculator 2026" },
            metaDescription: { tr: "İki tarih arasında kaç hafta var? Tarihleri seçin, aradaki net hafta sayısını ve artan gün miktarını hemen öğrenin.", en: "How many weeks between two dates? Pick dates to find out instantly." },
            content: { tr: "Hamilelik takibi, proje planlaması veya herhangi bir zaman aralığının haftalık dilimlere bölünmesi ihtiyacı için bu aracı kullanabilirsiniz.", en: "Use for pregnancy tracking or project planning." },
            faq: [
                { q: { tr: "Bir hafta tam olarak 7 gün mü sayılır?", en: "Is a week exactly 7 days?" }, a: { tr: "Evet, hesaplama mantığı iki tarih arasındaki toplam gün sayısını 7'ye bölerek hafta sayısını ve kalanı gün olarak verir.", en: "Yes, total days divided by 7." } }
            ],
            richContent: {
                howItWorks: { tr: "Tarihlerin milisaniye cinsinden farkını alır, güne çevirir ve 7'ye böler.", en: "Diffs timestamps and divides logic by 7." },
                formulaText: { tr: "Kalan Günler = Toplam Gün % 7 | Hafta = floor(Toplam / 7)", en: "Weeks = Days / 7" },
                exampleCalculation: { tr: "1 Ocak ile 15 Ocak arasında 14 gün vardır ve bu tam 2 haftaya eşittir.", en: "Jan 1 to Jan 15 is 14 days, 2 weeks." },
                miniGuide: { tr: "Başlangıç ve bitiş sıralamasının önemi yoktur, araç mutlak farkı hesaplar.", en: "Order doesn't matter, absolute difference is used." }
            }
        }
    },
    {
        id: "daily-calorie-calc",
        slug: "gunluk-kalori-ihtiyaci-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Günlük Kalori İhtiyacı Hesaplama", en: "Daily Calorie Need Calculator" },
        h1: { tr: "Zayıflamak veya Kilo Almak İçin Kalori İhtiyacınız", en: "Calorie Needs for Weight Loss or Gain" },
        description: { tr: "Cinsiyet, yaş, kilo, boy ve hareket seviyenizi girerek günlük kalori ihtiyacınızı hesaplayın.", en: "Calculate your daily calorie needs." },
        shortDescription: { tr: "Kilo vermek, korumak veya almak için günlük almanız gereken hedef kalori miktarını öğrenin.", en: "Discover target calories to lose, maintain or gain weight." },
        inputs: [
            { id: "gender", name: { tr: "Cinsiyet", en: "Gender" }, type: "select", defaultValue: "male", options: [{label: {tr: "Erkek", en: "Male"}, value: "male"}, {label: {tr: "Kadın", en: "Female"}, value: "female"}] },
            { id: "age", name: { tr: "Yaş", en: "Age" }, type: "number", defaultValue: 30, required: true },
            { id: "weight", name: { tr: "Kilo (kg)", en: "Weight (kg)" }, type: "number", defaultValue: 75, required: true },
            { id: "height", name: { tr: "Boy (cm)", en: "Height (cm)" }, type: "number", defaultValue: 175, required: true },
            { 
                id: "activity", name: { tr: "Aktivite Seviyesi", en: "Activity Level" }, type: "select", defaultValue: "1.2",
                options: [
                    { label: { tr: "Hareketsiz (Masa başı)", en: "Sedentary" }, value: "1.2" },
                    { label: { tr: "Az Hareketli (Hafif Egzersiz 1-3 gün)", en: "Lightly active" }, value: "1.375" },
                    { label: { tr: "Orta Hareketli (Ortalama Egzersiz 3-5 gün)", en: "Moderately active" }, value: "1.55" },
                    { label: { tr: "Çok Hareketli (Sık Egzersiz 6-7 gün)", en: "Very active" }, value: "1.725" }
                ]
            }
        ],
        results: [
            { id: "maintain", label: { tr: "Kiloyu Korumak İçin (Kalori/Gün)", en: "Maintain Weight (kcal)" }, decimalPlaces: 0 },
            { id: "lose", label: { tr: "Kilo Vermek İçin (Hafif tempoda)", en: "Weight Loss (Mild)" }, decimalPlaces: 0 },
            { id: "gain", label: { tr: "Kilo Almak İçin", en: "Weight Gain" }, decimalPlaces: 0 }
        ],
        formula: (v) => {
            const age = parseFloat(v.age) || 0;
            const weight = parseFloat(v.weight) || 0;
            const height = parseFloat(v.height) || 0;
            const act = parseFloat(v.activity) || 1.2;
            
            // Mifflin-St Jeor Equation
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            if (v.gender === "male") bmr += 5;
            else bmr -= 161;
            
            const maintain = bmr * act;
            
            return {
                maintain: maintain,
                lose: maintain - 500, // Deficit of 500 kcal
                gain: maintain + 500  // Surplus of 500 kcal
            };
        },
        seo: {
            title: { tr: "Günlük Kalori İhtiyacı Hesaplama (Mifflin-St Jeor) 2026", en: "Daily Calorie Need Calculator" },
            metaDescription: { tr: "Zayıflamak, kilo almak veya formunuzu korumak için günlük bazal metabolizma hızınızı ve hedef kalori ihtiyacınızı anında hesaplayın.", en: "Calculate your BMR and daily calorie targets." },
            content: { tr: "Günlük kalori ihtiyacı, vücudunuzun mevcut kilonuzu koruması için yaşam fonksiyonları ve fiziksel aktiviteler aracılığıyla her gün yaktığı toplam enerjidir.", en: "Total Daily Energy Expenditure (TDEE) explained." },
            faq: [
                { q: { tr: "Aç kalarak kilo vermek sağlıklı mıdır?", en: "Is starving oneself healthy?" }, a: { tr: "Hayır. Kalori açığı makul seviyede (günlük 300-500 kcal) olmalı, vücut kıtlık moduna girmemelidir.", en: "No, moderation is key." } }
            ],
            richContent: {
                howItWorks: { tr: "Mifflin-St Jeor formülüyle Bazal Metabolizma Hızı (BMR) bulunur, ardından hareket katsayısıyla çarpılarak TDEE (toplam harcama) tespit edilir.", en: "Uses Mifflin-St Jeor." },
                formulaText: { tr: "Erkek: BMR = 10W + 6.25H - 5A + 5 | Kadın: BMR = 10W + 6.25H - 5A - 161", en: "Standard BMR." },
                exampleCalculation: { tr: "75 kg, 175 cm, 30 yaş erkek ve az hareketliyse, koruma kalorisi yaklaşık 2380 kcal'dir.", en: "Sample male roughly 2380 kcal." },
                miniGuide: { tr: "Kilo vermek için hesaplanan 'koruma' değerinin 500 kalori altını, kilo almak için 500 kalori üstünü hedefleyin.", en: "Aim +-500 kcal." }
            }
        }
    },
    {
        id: "bmi-calc",
        slug: "vucut-kitle-endeksi-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Vücut Kitle Endeksi (VKE) Hesaplama", en: "BMI Calculator" },
        h1: { tr: "Vücut Kitle Endeksi (VKE/BMI) Öğrenme", en: "Body Mass Index (BMI)" },
        description: { tr: "Boyunuz ve kilonuza göre Dünya Sağlık Örgütü standartlarındaki Vücut Kitle Endeksinizi ve obezite durumunuzu hesaplayın.", en: "Calculate your Body Mass Index." },
        shortDescription: { tr: "Boyunuzu ve kilonuzu girerek ideal kilonuzu ve VKE obezite sınıfınızı anında öğrenin.", en: "Find out your BMI class." },
        inputs: [
            { id: "weight", name: { tr: "Kilo (kg)", en: "Weight (kg)" }, type: "number", defaultValue: 70, required: true },
            { id: "height", name: { tr: "Boy (cm)", en: "Height (cm)" }, type: "number", defaultValue: 175, required: true }
        ],
        results: [
            { id: "bmi", label: { tr: "Vücut Kitle Endeksi (VKE)", en: "BMI" }, decimalPlaces: 2 },
            { id: "status", label: { tr: "Durum", en: "Status" }, type: "text" },
            { id: "ideal", label: { tr: "Önerilen İdeal Kilo (Ortalama)", en: "Recommended Ideal Weight" }, decimalPlaces: 1, suffix: " kg" }
        ],
        formula: (v) => {
            const w = parseFloat(v.weight) || 0;
            const h = parseFloat(v.height) / 100 || 1; // convert to meters
            const bmi = w / (h * h);
            
            let stat = "";
            if (bmi < 18.5) stat = "Zayıf";
            else if (bmi < 24.9) stat = "Normal";
            else if (bmi < 29.9) stat = "Fazla Kilolu";
            else if (bmi < 34.9) stat = "Obez (Sınıf 1)";
            else if (bmi < 39.9) stat = "Obez (Sınıf 2)";
            else stat = "Aşırı Obez (Sınıf 3)";
            
            const idealW = 22 * (h * h); // Targeting BMI 22

            return {
                bmi: bmi,
                status: stat,
                ideal: idealW
            };
        },
        seo: {
            title: { tr: "Vücut Kitle Endeksi (VKE) Hesaplama 2026 | BMI", en: "BMI Calculator 2026" },
            metaDescription: { tr: "Boy ve kilo oranınıza göre zayıf, normal veya obez kategorisinde olduğunuzu Vücut Kitle Endeksi hesaplama aracı ile öğrenin.", en: "Calculate BMI and trace health." },
            content: { tr: "Vücut Kitle Endeksi (VKE veya BMI), boyunuz ve kilonuz arasındaki matematiksel bir orantıdır. Kalp hastalıkları, diyabet ve obezite gibi sağlık riskleri için evrensel bir ön gösterge olarak kabul edilir.", en: "Body Mass Index definition." },
            faq: [
                { q: { tr: "Normal VKE değeri kaç olmalıdır?", en: "What is normal BMI?" }, a: { tr: "Dünya Sağlık Örgütü'ne göre 18.5 ile 24.9 arası normal, sağlıklı kilodur.", en: "Between 18.5 and 24.9." } }
            ],
            richContent: {
                howItWorks: { tr: "Ağırlığınız (kg), boyunuzun karesine (m²) bölünerek endeks bulunur.", en: "Weight / Height^2." },
                formulaText: { tr: "VKE = Kilo(kg) / (Boy(m) x Boy(m))", en: "BMI = kg / m^2" },
                exampleCalculation: { tr: "70 kg ve 1.75m boyunda biri için: 70 / (1.75 x 1.75) = 22.8.", en: "70kg & 1.75m -> 22.8 BMI." },
                miniGuide: { tr: "Kas kütlesi çok yüksek olan sporcularda VKE yanıltıcı olabilir. Bu durumlarda vücut yağ oranı testi daha uygundur.", en: "BMI may mislead for athletes." }
            }
        }
    },
    {
        id: "fuel-consumption",
        slug: "yakit-tuketimi-hesaplama",
        category: "tasit-ve-vergi",
        updatedAt: "2026-04-19",
        name: { tr: "Yakıt Tüketimi Hesaplama", en: "Fuel Consumption Calculator" },
        h1: { tr: "Araç 100km'de Ne Kadar Yakıyor?", en: "Vehicle Fuel Consumption per 100km" },
        description: { tr: "Aldığınız yakıt miktarı ve gittiğiniz kilometreye göre aracınızın 100 km'de ortalama kaç litre yaktığını ve yakıt maliyetinizi hesaplayın.", en: "Calculate average fuel consumption." },
        shortDescription: { tr: "Seyahat mesafesi, litre yakıt sarfiyatı ve pompa fiyatı ile kilometre başı maliyetinizi hemen öğrenin.", en: "Find out per km fuel cost." },
        inputs: [
            { id: "distance", name: { tr: "Gidilen Yol (km)", en: "Distance (km)" }, type: "number", defaultValue: 500, required: true },
            { id: "liters", name: { tr: "Tüketilen Yakıt (Litre)", en: "Spent Fuel (Liters)" }, type: "number", defaultValue: 35, required: true },
            { id: "price", name: { tr: "Yakıt Litre Fiyatı (₺)", en: "Fuel Price per Liter" }, type: "number", defaultValue: 42.50, required: true }
        ],
        results: [
            { id: "avgConsumption", label: { tr: "Ortalama Tüketim (Litre / 100 km)", en: "Avg Consumption (/100km)" }, decimalPlaces: 2 },
            { id: "costPerKm", label: { tr: "Kilometredeki Maliyet", en: "Cost per km" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalCost", label: { tr: "Toplam Yakıt Gideri", en: "Total Fuel Expense" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const dist = parseFloat(v.distance) || 0;
            const liters = parseFloat(v.liters) || 0;
            const price = parseFloat(v.price) || 0;
            
            if (dist === 0) return { avgConsumption: 0, costPerKm: 0, totalCost: 0 };
            
            return {
                avgConsumption: (liters / dist) * 100,
                costPerKm: (liters * price) / dist,
                totalCost: liters * price
            };
        },
        seo: {
            title: { tr: "Araç Yakıt Tüketimi Hesaplama (Km'de Kaç Lira Yakar?) 2026", en: "Fuel Consumption Calculator" },
            metaDescription: { tr: "Aracınızın 100 km'deki ortalama litre yakıt sarfiyatını ve güncel benzin/dizel/LPG fiyatlarına göre kilometrede kaç lira yaktığını anında bulun.", en: "Calculate per km fuel cost and average consumption." },
            content: { tr: "Artan yakıt fiyatları, uzun veya şehir içi yolculuklar öncesinde bütçe planlaması yapmayı zorunlu kılıyor. Bu araç, sadece basit üç girdiyle aracınızın yol/yakıt performansını saniyeler içinde ölçer.", en: "Calculate fuel costs to plan road trips effectively." },
            faq: [
                { q: { tr: "Daha az yakıt tüketmek için ne yapabilirim?", en: "How to save fuel?" }, a: { tr: "Ani fren/kalkışlardan kaçınmak, sabit ve yasal hızlarda seyretmek ve lastik basınçlarını optimum seviyede tutmak yakıt tüketimini %15'e kadar iyileştirebilir.", en: "Drive smoothly and check tires." } }
            ],
            richContent: {
                howItWorks: { tr: "Tüketilmiş benzini km'ye oranlar ve girilen birim fiyat ile maliyet hesabını gerçekleştirir.", en: "Ratio of liters vs distance." },
                formulaText: { tr: "Ortalama (L/100km) = (Litre / Km) * 100", en: "L / Km" },
                exampleCalculation: { tr: "500 km yolda 35 litre yakan araç, 100 km'de 7 litre yakar. Yakıt fiyatı 42 TL ise km'de 2.94 TL maliyet oluşturur.", en: "35 liters for 500km makes 7L/100km." },
                miniGuide: { tr: "Depoyu fulleyip km saatini sıfırlamak ve tekrar fullediğinizde alınan litre ile km'yi buraya girmek en doğru hesaplama yöntemidir.", en: "Fill tank, reset trip meter." }
            }
        }
    },
    {
        id: "ev-charging",
        slug: "elektrikli-arac-sarj-hesaplama",
        category: "tasit-ve-vergi",
        updatedAt: "2026-04-19",
        name: { tr: "Elektrikli Araç Şarj Maliyeti Hesaplama", en: "EV Charging Cost Calculator" },
        h1: { tr: "Elektrikli Otomobil (EV) Şarj Ücreti", en: "EV Charging Cost" },
        description: { tr: "Togg, Tesla veya diğer EV aracınızın batarya kapasitesi ve ev/AC/DC birim kWh fiyatına göre dolum maliyetini öğrenin.", en: "Calculate full charging cost for electric vehicles based on battery size and kWh price." },
        shortDescription: { tr: "Batarya kapasitenizi (kWh) ve elektriğin kW birim fiyatını girerek 'fulleme' maliyetini bulun.", en: "Enter battery capacity and electricity rate to find full charge cost." },
        inputs: [
            { id: "batteryStr", name: { tr: "Batarya Kapasitesi (kWh)", en: "Battery Capacity (kWh)" }, type: "number", defaultValue: 75, required: true },
            { id: "percent", name: { tr: "Şarj Edilecek Yüzde (%)", en: "Percent to Charge (%)" }, type: "number", min: 1, max: 100, defaultValue: 80, required: true },
            { id: "kwhPrice", name: { tr: "Elektrik Birim Fiyatı (₺/kWh)", en: "Electricity Price (₺/kWh)" }, type: "number", defaultValue: 8.50, required: true }
        ],
        results: [
            { id: "neededKwh", label: { tr: "Doldurulacak Enerji", en: "Energy to Fill" }, suffix: " kWh", decimalPlaces: 1 },
            { id: "cost", label: { tr: "Tahmini Şarj Maliyeti", en: "Estimated Charging Cost" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const cap = parseFloat(v.batteryStr) || 0;
            const pct = parseFloat(v.percent) || 0;
            const prc = parseFloat(v.kwhPrice) || 0;
            
            const neededKwh = cap * (pct / 100);
            return {
                neededKwh: neededKwh,
                cost: neededKwh * prc
            };
        },
        seo: {
            title: { tr: "Elektrikli Araç (Togg, Tesla) Şarj Maliyeti Hesaplama", en: "EV Charging Calculator 2026" },
            metaDescription: { tr: "Elektrikli araba bataryasını evden (AC) veya hızlı şarj istasyonundan (DC) şarj etmenin tam fatura maliyetini kWh fiyatı üzerinden anında hesaplayın.", en: "Calculate how much it costs to charge an EV." },
            content: { tr: "Elektrikli araçlarda (EV) şarj maliyeti, aracın marka modeline göre değişen batarya kapasitesine ve istasyonun/evin sunduğu birim kWh elektrik fiyatına bağlıdır. AC, DC (Hızlı Şarj) veya Ev tipi elektrikte fiyatlandırma farklılık gösterir.", en: "EV charge costs vary based on station AC/DC and home rates." },
            faq: [
                { q: { tr: "Elektrikli araç evde daha mı ucuza şarj olur?", en: "Is home charging cheaper?" }, a: { tr: "Evet, evdeki elektrik tarifesi (özellikle gece indirimli zaman dilimleri), otoyollardaki ticari şarj (DC) istasyonlarının birim ücretinden çok daha düşüktür.", en: "Yes, residential rates are generally much cheaper than commercial DC fast charging." } }
            ],
            richContent: {
                howItWorks: { tr: "Batarya yoğunluğu üzerinden şarj edilecek enerjiyi bulur ve kilowattsaat tarifesiyle çarpar.", en: "Multiplies kWh with price." },
                formulaText: { tr: "Maliyet = (Batarya x %İhtiyaç) x Birim kWh Fiyatı", en: "Cost = kWh Needs * Price" },
                exampleCalculation: { tr: "70 kWh bataryalı bir otomobili %10'dan %90'a (yani %80'lik kısmı = 56 kWh) doldurmak, kWh fiyatı 9 TL ise 504 TL tutar.", en: "56 kWh at 9 ₺ = 504 ₺." },
                miniGuide: { tr: "Bataryayı genellikle %80'de bırakmak lityum iyon pillerin ömrünü maksimize eder.", en: "Charging up to 80% is healthy for batteries." }
            }
        }
    }
];
