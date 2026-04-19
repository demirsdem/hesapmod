import { CalculatorConfig } from "./calculator-source";

export const phase10cCalculators: CalculatorConfig[] = [
    {
        id: "distance-calc",
        slug: "iller-arasi-mesafe-hesaplama",
        category: "diger",
        updatedAt: "2026-04-19",
        name: { tr: "İller Arası Mesafe Hesaplama", en: "Intercity Distance Calculator" },
        h1: { tr: "İller Arası Mesafe ve Süre Hesaplama", en: "Intercity Distance and Time" },
        description: { tr: "Türkiye'deki iller arasındaki kuş uçuşu ve yaklaşık karayolu mesafesi ile tahmini varış süresini hesaplayın.", en: "Estimate the distance and travel time between cities." },
        shortDescription: { tr: "İki il arası kaç kilometre ve kaç saat sürer? Tahmini karayolu mesafesini bulun.", en: "Find estimated driving distance and time between two cities." },
        inputs: [
            { id: "cityA", name: { tr: "Nereden (Başlangıç)", en: "From (Start)" }, type: "text", defaultValue: "İstanbul", required: true },
            { id: "cityB", name: { tr: "Nereye (Varış)", en: "To (Destination)" }, type: "text", defaultValue: "Ankara", required: true },
            { id: "distanceKm", name: { tr: "Aradaki Kuş Uçuşu Km (İsteğe Bağlı)", en: "Air Distance (Optional)" }, type: "number", defaultValue: 350, required: true }
        ],
        results: [
            { id: "roadDistance", label: { tr: "Yaklaşık Karayolu Mesafesi", en: "Approximate Road Distance" }, suffix: " km", decimalPlaces: 0 },
            { id: "carTime", label: { tr: "Tahmini Otomobil Süresi", en: "Estimated Car Travel Time" }, type: "text" },
            { id: "busTime", label: { tr: "Tahmini Otobüs Süresi", en: "Estimated Bus Travel Time" }, type: "text" }
        ],
        formula: (v) => {
            const val = parseFloat(v.distanceKm) || 0;
            // Rough heuristic: road distance is ~1.3x air distance
            const roadKm = val > 0 ? val * 1.3 : 450; 
            
            // Assuming avg car speed 90km/h, bus speed 75km/h
            const carHours = roadKm / 90;
            const busHours = roadKm / 75;

            const formatTime = (h: number) => {
                const hh = Math.floor(h);
                const mm = Math.round((h - hh) * 60);
                return `${hh} Saat ${mm} Dakika`;
            };

            return {
                roadDistance: roadKm,
                carTime: formatTime(carHours),
                busTime: formatTime(busHours)
            };
        },
        seo: {
            title: { tr: "İller Arası Mesafe Hesaplama (Kaç Km, Kaç Saat) 2026", en: "Intercity Distance Calculator 2026" },
            metaDescription: { tr: "İstanbul, Ankara, İzmir vb. Türkiye'deki iller arasındaki karayolu mesafesini ve otomobil/otobüs ile kaç saat süreceğini hesaplayın.", en: "Calculate intercity driving distances and estimated travel times." },
            content: { tr: "Farklı şehirler arası yolculuk planlarken katedilecek kilometre ve sürülecek tahmini süre en önemli kriterdir.", en: "Essential tool for road trip planning." },
            faq: [
                { q: { tr: "Karayolu mesafesi kuş uçuşu mesafeden neden farklıdır?", en: "Why is road distance different from air?" }, a: { tr: "Dağlar, nehirler ve coğrafi engeller nedeniyle yollar düz bir çizgi yerine kavisli rotalar izler.", en: "Topography causes roads to curve, adding distance." } }
            ],
            richContent: {
                howItWorks: { tr: "Kuş uçuşu mesafeyi Türkiye ortalaması olan formülle genelleştirip karayoluna çevirir ve ortalama hıza böler.", en: "Scales air distance for roads and divides by speed." },
                formulaText: { tr: "Süre = Mesafe / Ortalama Hız", en: "Time = Distance / Speed" },
                exampleCalculation: { tr: "350 km kuş uçuşu mesafe yaklaşık 455 km yola denktir. 90 km/s ile otomobille 5 saat sürer.", en: "350km air -> 450km road -> 5 hours." },
                miniGuide: { tr: "Trafik yoğunluğu, mola süreleri ve hava koşulları bu hesaplamaya dahil değildir.", en: "Excludes traffic and stops." }
            }
        }
    },
    {
        id: "qibla-calc",
        slug: "kible-yonu-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Kıble Yönü Hesaplama", en: "Qibla Direction Calculator" },
        h1: { tr: "Pusula Açısı İle Kıble Yönü", en: "Qibla Direction via Compass" },
        description: { tr: "Bulunduğunuz enlem ve boylam (koordinat) verilerine göre Kabe'nin tam açısını hesaplayın.", en: "Calculate the exact Qibla bearing from true North using your coordinates." },
        shortDescription: { tr: "Enlem ve boylamınızı girerek pusula üzerinde Kıble yönünü (Kabe açısını) hassas şekilde öğrenin.", en: "Find exact Qibla angle from North based on your latitude and longitude." },
        inputs: [
            { id: "lat", name: { tr: "Bulunduğunuz Enlem (Latitude)", en: "Your Latitude" }, type: "number", defaultValue: 41.0082, required: true },
            { id: "lon", name: { tr: "Bulunduğunuz Boylam (Longitude)", en: "Your Longitude" }, type: "number", defaultValue: 28.9784, required: true }
        ],
        results: [
            { id: "qiblaAngle", label: { tr: "Kıble Açısı (Kuzeyden Saat Yönüne)", en: "Qibla Angle (Clockwise from North)" }, suffix: "° (Derece)", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const lat = parseFloat(v.lat) || 0;
            const lon = parseFloat(v.lon) || 0;
            
            // Mecca coordinates
            const kabeLat = 21.422487;
            const kabeLon = 39.826206;

            const toRad = (deg: number) => deg * Math.PI / 180;
            const toDeg = (rad: number) => rad * 180 / Math.PI;

            const latRad = toRad(lat);
            const kabeLatRad = toRad(kabeLat);
            const deltaLon = toRad(kabeLon - lon);

            const y = Math.sin(deltaLon) * Math.cos(kabeLatRad);
            const x = Math.cos(latRad) * Math.sin(kabeLatRad) - Math.sin(latRad) * Math.cos(kabeLatRad) * Math.cos(deltaLon);
            
            let qiblaRad = Math.atan2(y, x);
            let qiblaDeg = toDeg(qiblaRad);
            
            if (qiblaDeg < 0) {
                qiblaDeg += 360;
            }

            return { qiblaAngle: qiblaDeg };
        },
        seo: {
            title: { tr: "Kıble Yönü Hesaplama (Pusula Açısı ve Koordinat) 2026", en: "Qibla Direction Calculator 2026" },
            metaDescription: { tr: "Bulunduğunuz şehrin veya konumun enlem boylam verileriyle dünyanın neresinde olursanız olun net Kıble açısını (Kabe yönünü) hesaplayın.", en: "Calculate precise Qibla angles." },
            content: { tr: "Kıble, Mekke şehrinde bulunan Kabe'nin yönüdür. Matematiksel olarak Büyük Daire Formülü (Great Circle) kullanılarak Dünya üzerindeki herhangi bir noktanın en kısa mesafe ile Kabe'ye olan açısı tespit edilebilir.", en: "Calculates the shortest path bearing to Mecca." },
            faq: [
                { q: { tr: "Kuzeye göre derece ne anlama gelir?", en: "What does degrees from North mean?" }, a: { tr: "Gerçek kuzey referans alındığında (0 derece), pusulanızı saat yönünde dönerek ekranda çıkan dereceye getirdiğinizde Kabe'nin tam yönüne bakmış olursunuz.", en: "Clockwise turn from true North." } }
            ],
            richContent: {
                howItWorks: { tr: "Enlem ve boylamı radyan cinsine çevirerek küresel trigonometri ile kuzeye olan azimuth açısını bulur.", en: "Uses spherical trigonometry." },
                formulaText: { tr: "atan2(sin(Δlon).cos(lat2), cos(lat1).sin(lat2) − sin(lat1).cos(lat2).cos(Δlon))", en: "Standard bearing formula." },
                exampleCalculation: { tr: "İstanbul (Enlem: 41, Boylam: 29) için Kıble açısı pusulada yaklaşık 153 derecedir (Güneydoğu yönü).", en: "Istanbul is roughly 153 degrees." },
                miniGuide: { tr: "Pusulanızın manyetik sapma (declination) değerinden etkilenmediğinden emin olun (Mümkünse dijital pusula kullanın).", en: "Beware of magnetic declination." }
            }
        }
    },
    {
        id: "coordinates-calc",
        slug: "koordinat-hesaplama",
        category: "yasam-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Koordinat Dönüştürücü (DMS - DD)", en: "Coordinate Converter" },
        h1: { tr: "Derece-Dakika-Saniye (DMS) / Ondalık (DD) Dönüşümü", en: "DMS to Decimal Degrees" },
        description: { tr: "GPS ve harita koordinatlarını Derece, Dakika, Saniye (DMS) formatından Ondalık Dereceye (Decimal Degrees - DD) ve tersine dönüştürün.", en: "Convert coordinates between Decimal Degrees and Degrees Minutes Seconds formatting." },
        shortDescription: { tr: "Enlem/Boylam koordinatınızı derece-dakika'dan (DMS) ondalık formata dönüştürün.", en: "Convert GPS coordinate formats." },
        inputs: [
            { id: "deg", name: { tr: "Derece (°)", en: "Degrees (°)" }, type: "number", defaultValue: 41, required: true },
            { id: "min", name: { tr: "Dakika (')", en: "Minutes (')" }, type: "number", defaultValue: 0, required: true },
            { id: "sec", name: { tr: "Saniye (\")", en: "Seconds (\")" }, type: "number", defaultValue: 30, required: true }
        ],
        results: [
            { id: "decimalCoord", label: { tr: "Ondalık Derece (DD)", en: "Decimal Degree (DD)" }, decimalPlaces: 6 }
        ],
        formula: (v) => {
            const d = parseFloat(v.deg) || 0;
            const m = parseFloat(v.min) || 0;
            const s = parseFloat(v.sec) || 0;
            
            // Formula: DD = d + (min/60) + (sec/3600)
            const isNeg = d < 0;
            const absD = Math.abs(d);
            let dd = absD + (m / 60) + (s / 3600);
            
            if (isNeg) dd = -dd;

            return { decimalCoord: dd };
        },
        seo: {
            title: { tr: "Koordinat Hesaplama (DMS - Ondalık Derece) 2026", en: "Coordinate Converter 2026" },
            metaDescription: { tr: "Harita ve GPS verilerinizi Derece, Dakika, Saniye formatından Google Haritalar uyumlu ondalık (Decimal) koordinat şekline anında çevirin.", en: "Convert DMS coordinates into Google Maps compatible Decimals." },
            content: { tr: "Google Haritalar ve modern navigasyon sistemleri çoğunlukla ondalık derece (DD) kullanırken, geleneksel haritacılık ve denizcilik DMS formatını kullanır.", en: "Seamless translation between map coordinates." },
            faq: [
                { q: { tr: "Ondalık derece nedir?", en: "What are Decimal Degrees?" }, a: { tr: "DMS formatının 60'lık sayı tabanı yerine bilgisayarların anlayacağı 10'luk sisteme çevrilmiş versiyonudur.", en: "Base-10 representation of geocoordinates." } }
            ],
            richContent: {
                howItWorks: { tr: "Dakikayı 60'a, saniyeyi 3600'e bölerek derece tam sayısının üzerine virgüllü olarak ekler.", en: "Fractions divided by 60 and 3600." },
                formulaText: { tr: "Ondalık = Derece + (Dakika/60) + (Saniye/3600)", en: "DD = D + M/60 + S/3600" },
                exampleCalculation: { tr: "41 derece, 30 dakika, 0 saniye -> 41 + (30/60) = 41.500000 ondalık derecedir.", en: "41°30' is 41.5." },
                miniGuide: { tr: "Güney ve Batı yarımküre koordinatları eksi (-) işaretiyle ifade edilir.", en: "South/West are negative." }
            }
        }
    },
    {
        id: "legal-interest-calc",
        slug: "yasal-faiz-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-19",
        name: { tr: "Yasal Faiz Hesaplama", en: "Legal Interest Calculator" },
        h1: { tr: "Mahkeme ve İcra İçin Yasal / Temerrüt Faizi", en: "Legal / Default Interest for Courts" },
        description: { tr: "Borçlar Kanunu'na dayalı alacaklarınız için ticari veya adi işlerdeki yasal temerrüt faizi tutarını tarih girerek hesaplayın.", en: "Calculate the legally mandated default interest rate amounts." },
        shortDescription: { tr: "Alacak tutarı, güncel yasal/ticari faiz oranı ve geçen gün sayısını girerek temerrüt faizi miktarını bulun.", en: "Find default interest based on legal rates and elapsed time." },
        inputs: [
            { id: "amount", name: { tr: "Asıl Alacak Tutarı", en: "Principal Debt Amount" }, type: "number", defaultValue: 50000, required: true },
            { id: "rate", name: { tr: "Yıllık Faiz Oranı (%)", en: "Annual Rate (%)" }, type: "number", defaultValue: 24, required: true },
            { id: "days", name: { tr: "Geçen Süre (Gün)", en: "Elapsed Days" }, type: "number", defaultValue: 180, required: true }
        ],
        results: [
            { id: "interest", label: { tr: "Birikmiş Faiz", en: "Accumulated Interest" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "total", label: { tr: "Toplam Alacak Tutarı", en: "Total Amount to Collect" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const principal = parseFloat(v.amount) || 0;
            const rate = parseFloat(v.rate) / 100 || 0;
            const days = parseFloat(v.days) || 0;

            const interest = principal * rate * (days / 365);
            return {
                interest: interest,
                total: principal + interest
            };
        },
        seo: {
            title: { tr: "Yasal Temerrüt Faizi Hesaplama 2026 (İcra ve Dava Alacağı)", en: "Legal Interest Calculator 2026" },
            metaDescription: { tr: "Güncel yasal temerrüt faizi, avans ve ticari faiz oranlarıyla mahkeme harici asıl alacağınızın birikmiş faizini hızla hesaplayın.", en: "Calculate local legal default interest on delayed debts." },
            content: { tr: "Ödenmemiş borçlarda asıl alacak tutarının üzerine geçen gün sayısına göre işleyen yasal faiz eklenir. Ticari işlerde 'Avans Faizi', adi işlerde ise normal 'Yasal Faiz' oranı uygulanır.", en: "Default interest compensates for late payments." },
            faq: [
                { q: { tr: "Bileşik faiz uygulanır mı?", en: "Is it compounded?" }, a: { tr: "Hayır. Yasal işlemlerde Borçlar Kanunu gereğince aksine açık ve özel bir kural/sözleşme yoksa faize faiz (bileşik faiz) yürütülemez; basit faiz hesaplanır.", en: "No, legal interest is typically strictly simple interest." } }
            ],
            richContent: {
                howItWorks: { tr: "Günlük faiz miktarını bularak gecikilen gün sayısıyla basit çarpım yapar.", en: "Calculates simple interest per day." },
                formulaText: { tr: "Faiz = Anapara x (Yıllık Oran / 365) x Gün", en: "Simple interest formula." },
                exampleCalculation: { tr: "50.000 TL için %24 yıllık yasal faizden 180 gün (yaklaşık 6 ay) geçerse ~5.917 TL faiz eklenir.", en: "Example with typical rates." },
                miniGuide: { tr: "Sözleşmenizde faiz oranı belirsizse devletin açıkladığı asgari temerrüt oranlarını kullanmalısınız.", en: "Use official default rate if missing from contract." }
            }
        }
    },
    {
        id: "delay-penalty-calc",
        slug: "aidat-gecikme-tazminati-hesaplama",
        category: "hukuk",
        updatedAt: "2026-04-19",
        name: { tr: "Aidat Gecikme Tazminatı Hesaplama", en: "Condo Due Delay Penalty Calculator" },
        h1: { tr: "Site ve Apartman Aidat Gecikme Faizi", en: "Condo Due Delay Penalty" },
        description: { tr: "Kat Mülkiyeti Kanunu uyarınca, apartman / site aidatını ödemeyenler için (%5) yasal gecikme tazminatını hesaplayın.", en: "Calculate the legally defined 5% monthly delay penalty for unpaid housing dues." },
        shortDescription: { tr: "KMK gereğince ödenmeyen site/apartman aidatlarına her ay için uygulanacak %5 gecikme faizi cezasını hesaplayın.", en: "Calculate 5% monthly delay on housing dues." },
        inputs: [
            { id: "dueAmount", name: { tr: "Birikmiş Toplam Aidat Borcu", en: "Total Due Debt" }, type: "number", defaultValue: 3000, required: true },
            { id: "monthsDelayed", name: { tr: "Gecikilen Süre (Ay)", en: "Delayed Months" }, type: "number", defaultValue: 4, required: true }
        ],
        results: [
            { id: "penalty", label: { tr: "Gecikme Tazminatı (Aylık %5)", en: "Penalty (5%/mo)" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "totalDue", label: { tr: "Ödenecek Toplam Tutar", en: "Total Amount" }, suffix: " ₺", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const due = parseFloat(v.dueAmount) || 0;
            const months = parseFloat(v.monthsDelayed) || 0;
            
            // 5% per month, simple interest usually
            const penalty = due * 0.05 * months;

            return {
                penalty: penalty,
                totalDue: due + penalty
            };
        },
        seo: {
            title: { tr: "Aidat Gecikme Tazminatı Hesaplama (Aylık %5) 2026", en: "Condo Due Delay Calculator 2026" },
            metaDescription: { tr: "Kat Mülkiyeti Kanunu'na göre apartman site aidatı gecikme tazminatı (%5) faiz oranını hemen hesaplayarak aidat borcunu bulun.", en: "Calculate late fees for unpaid apartment dues based on Turkish Condo Law." },
            content: { tr: "Kat Mülkiyeti Kanunu 20. madde gereğince, gider veya avans (aidat) payını ödemeyen kat maliki geciktiği günler için aylık yüzde beş (%5) hesabıyla gecikme tazminatı ödemek zorundadır.", en: "Condo law mandates 5%." },
            faq: [
                { q: { tr: "Aidat gecikme faizi yıllık mıdır?", en: "Is it annual?" }, a: { tr: "Hayır. Yasal faizlerin aksine apartman aidatı gecikme tazminatı kanunda özel olarak belirtilmiş olup 'aylık bazda' işleyen çok yüksek bir caydırıcı tazminattır.", en: "It is a heavy monthly penalty." } }
            ],
            richContent: {
                howItWorks: { tr: "Toplam anapara aidat borcunun üzerine her ay için %5 basit bazda ceza ekler.", en: "Adds simple 5% monthly." },
                formulaText: { tr: "Tazminat = Aidat Borcu x 0.05 x Ay Sayısı", en: "Penalty = Debt * 0.05 * Months" },
                exampleCalculation: { tr: "3.000 TL aidatı 4 ay ödemezseniz aylık 150 TL'den toplam 600 TL gecikme tazminatı yansır.", en: "3000 TL for 4 months -> 600 TL penalty." },
                miniGuide: { tr: "Yönetim planında aksine bir hüküm varsa faiz oranı yönetim lehine %5'ten daha yüksek kullanılamaz.", en: "Cannot exceed 5% even if managed privately." }
            }
        }
    }
];
