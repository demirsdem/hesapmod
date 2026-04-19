import { CalculatorConfig } from "./calculator-source";

export const phase10Calculators: CalculatorConfig[] = [
    {
        id: "golden-ratio",
        slug: "altin-oran-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Altın Oran Hesaplama", en: "Golden Ratio Calculator" },
        h1: { tr: "Altın Oran Hesaplama (1.618) - Uzunluk ve Geometri", en: "Golden Ratio Calculator (1.618)" },
        description: { 
            tr: "Bir sayının altın oranını hesaplayın. A ve B uzunluklarını veya toplam uzunluğu girerek 1.618 katsayısıyla altın oran parçalarını bulun.", 
            en: "Calculate the golden ratio segments for a given length using the 1.618 coefficient." 
        },
        shortDescription: { 
            tr: "Toplam uzunluğu girerek altın orana (1,618) göre büyük ve küçük parçaları anında bulun.", 
            en: "Enter total length to find large and small segments based on the golden ratio (1.618)." 
        },
        inputs: [
            { id: "length", name: { tr: "Toplam Uzunluk", en: "Total Length" }, type: "number", defaultValue: 100, required: true },
        ],
        results: [
            { id: "largePart", label: { tr: "Büyük Parça (A)", en: "Large Segment (A)" }, decimalPlaces: 2 },
            { id: "smallPart", label: { tr: "Küçük Parça (B)", en: "Small Segment (B)" }, decimalPlaces: 2 },
            { id: "ratioCheck", label: { tr: "Oran Kontrolü (A/B)", en: "Ratio Check (A/B)" }, decimalPlaces: 3 }
        ],
        formula: (v) => {
            const total = parseFloat(v.length) || 0;
            const phi = 1.6180339887;
            const largePart = total / phi;
            const smallPart = total - largePart;
            return {
                largePart: largePart,
                smallPart: smallPart,
                ratioCheck: smallPart > 0 ? largePart / smallPart : 0
            };
        },
        seo: {
            title: { tr: "Altın Oran Hesaplama 2026 | HesapMod", en: "Golden Ratio Calculator 2026" },
            metaDescription: { tr: "Toplam uzunluğu girerek Phi (1,618) sabitine göre altın orana uygun büyük parça ve küçük parçayı saniyeler içinde hesaplayın.", en: "Calculate the golden ratio segments (large and small parts) based on Phi (1.618) instantly." },
            content: { 
                tr: `### Altın Oran Nedir?\n\nAltın oran (Phi - φ), doğada, sanatta, mimaride ve matematikte sıkça karşılaşılan, göze en estetik gelen orantıdır. Değeri yaklaşık 1,618'dir. Bir bütünün iki parçaya bölünmesi durumunda; büyük parçanın küçük parçaya olan oranı (A/B), bütünün büyük parçaya olan oranına ((A+B)/A) eşitse, bu parçalar altın orana sahiptir.`, 
                en: `The golden ratio is a special number found by dividing a line into two parts so that the longer part divided by the smaller part is also equal to the whole length divided by the longer part.`
            },
            faq: [
                { q: { tr: "Altın Oran sayısı kaçtır?", en: "What is the Golden Ratio number?" }, a: { tr: "Altın oran 'Fi' (Phi) harfiyle gösterilir ve yaklaşık olarak 1,618'e eşittir.", en: "It is approximately 1.618." } },
                { q: { tr: "Altın Oran nerelerde kullanılır?", en: "Where is the Golden Ratio used?" }, a: { tr: "Doğada ayçiçeği tohumlarında, salyangoz kabuğunda; sanatta Leonardo da Vinci'nin eserlerinde, piramitlerde ve web / grafik tasarımda sıklıkla kullanılır.", en: "In art, architecture, and design." } }
            ],
            richContent: {
                howItWorks: { tr: "Toplam uzunluğu 1,618'e bölerek büyük parçayı bulur, kalanı da küçük parça olarak sonuçlandırır.", en: "Divides total length by 1.618 to find segments." },
                formulaText: { tr: "Büyük Parça = Toplam Uzunluk / 1.618 | Küçük Parça = Toplam Uzunluk - Büyük Parça", en: "Large = Total / 1.618" },
                exampleCalculation: { tr: "100 cm'lik bir çubuğu altın orana göre keserseniz: Büyük parça 61.8 cm, küçük parça 38.2 cm olur.", en: "100cm cut into golden ratio gives 61.8cm and 38.2cm." },
                miniGuide: { tr: "Tasarım yaparken genişlik ve yüksekliği altın orana göre belirlemek daha estetik görünüm sağlar.", en: "Use for aesthetic designs." }
            }
        }
    },
    {
        id: "volume-calc",
        slug: "hacim-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Hacim Hesaplama", en: "Volume Calculator" },
        h1: { tr: "Geometrik Şekillerin Hacim Hesaplaması", en: "Geometric Shapes Volume Calculation" },
        description: { tr: "Küp, dikdörtgenler prizması, silindir, küre ve koni gibi geometrik cisimlerin hacimlerini kolayca hesaplayın.", en: "Calculate the volume of geometric solids like cubes, cylinders, spheres, and cones." },
        shortDescription: { tr: "Birden fazla şekil (Küp, Silindir vb.) için hızlı hacim (m³, cm³ veya litre) hesabı yapın.", en: "Calculate volume for multiple geometric figures." },
        inputs: [
            { 
                id: "shape", 
                name: { tr: "Şekil Türü", en: "Shape Type" }, 
                type: "select", 
                defaultValue: "cube",
                options: [
                    { label: { tr: "Küp", en: "Cube" }, value: "cube" },
                    { label: { tr: "Dikdörtgenler Prizması", en: "Rectangular Box" }, value: "box" },
                    { label: { tr: "Silindir", en: "Cylinder" }, value: "cylinder" },
                    { label: { tr: "Küre", en: "Sphere" }, value: "sphere" }
                ]
            },
            { id: "a", name: { tr: "Kenar / Yarıçap (a)", en: "Edge / Radius (a)" }, type: "number", defaultValue: 10, required: true },
            { id: "b", name: { tr: "Genişlik (b) [Sadece Prizma]", en: "Width (b) [Box only]" }, type: "number", defaultValue: 5 },
            { id: "h", name: { tr: "Yükseklik (h) [Küp ve Küre hariç]", en: "Height (h) [Ex. Cube/Sphere]" }, type: "number", defaultValue: 10 }
        ],
        results: [
            { id: "volume", label: { tr: "Hacim", en: "Volume" }, suffix: " Birim³", decimalPlaces: 2 },
            { id: "liters", label: { tr: "Litre Karşılığı (eğer girdiler cm ise)", en: "Liters (if inputs are cm)" }, suffix: " L", decimalPlaces: 3 }
        ],
        formula: (v) => {
            const shape = v.shape || "cube";
            const a = parseFloat(v.a) || 0;
            const b = parseFloat(v.b) || 0;
            const h = parseFloat(v.h) || 0;
            
            let vol = 0;
            if (shape === "cube") vol = Math.pow(a, 3);
            else if (shape === "box") vol = a * b * h;
            else if (shape === "cylinder") vol = Math.PI * Math.pow(a, 2) * h;
            else if (shape === "sphere") vol = (4/3) * Math.PI * Math.pow(a, 3);

            return {
                volume: vol,
                liters: vol / 1000 // 1000 cm3 = 1 Litre
            };
        },
        seo: {
            title: { tr: "Hacim Hesaplama (Küp, Silindir, Prizma) 2026", en: "Volume Calculator 2026" },
            metaDescription: { tr: "Küp, silindir, küre ve dikdörtgenler prizmasının hacmini hızlıca hesaplayın. Metreküp cinsinden veya litre karşılığını pratik formüllerle bulun.", en: "Quickly calculate the volume of a cube, cylinder, sphere, and rectangular box." },
            content: { tr: "Farklı 3 boyutlu geometrik cisimlerin sıvı veya katı tutma kapasitelerini hesaplamak için bu aracı kullanabilirsiniz.", en: "Calculate the volume of 3D objects." },
            faq: [
                { q: { tr: "1 Litre kaç santimetreküptür?", en: "How many cubic cm is 1 Liter?" }, a: { tr: "1 Litre = 1000 cm³'tür.", en: "1 Liter = 1000 cm³." } }
            ],
            richContent: {
                howItWorks: { tr: "Seçilen şekle göre matematiksel formüller kullanılarak çıktı üretilir.", en: "Uses standard math formulas." },
                formulaText: { tr: "Küp: a³, Prizma: a*b*h, Silindir: π*r²*h", en: "Cube: a³, Cylinder: π*r²*h" },
                exampleCalculation: { tr: "Yarıçapı 10 cm, yüksekliği 10 cm olan silindir hacmi = 3141.59 cm³ yani yaklaşık 3.14 litredir.", en: "Cylinder with r=10, h=10 has Volume of 3141.59" },
                miniGuide: { tr: "Birim dönüşümlerine dikkat edin.", en: "Be aware of units." }
            }
        }
    },
    {
        id: "inch-cm",
        slug: "inc-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "İnç Hesaplama (cm - inç)", en: "Inch Calculator (cm - inch)" },
        h1: { tr: "İnç ve Santimetre Çevirme Aracı", en: "Inch and Centimeter Converter" },
        description: { tr: "Ekran boyutları (TV, monitör, telefon) ve jant ölçüleri için inçten santimetreye veya santimetreden inçe dönüşüm yapın.", en: "Convert between inches and centimeters for screens, tires, and more." },
        shortDescription: { tr: "1 inç = 2.54 cm prensibiyle TV, telefon veya lastik jant inç değerini cm'ye çevirin.", en: "Quickly convert inch to cm using the 1 inch = 2.54 cm ratio." },
        inputs: [
            { 
                id: "type", 
                name: { tr: "Dönüşüm Yönü", en: "Conversion Direction" }, 
                type: "select", 
                defaultValue: "in2cm",
                options: [
                    { label: { tr: "İnç (in) -> Santimetre (cm)", en: "Inch to cm" }, value: "in2cm" },
                    { label: { tr: "Santimetre (cm) -> İnç (in)", en: "cm to inch" }, value: "cm2in" }
                ]
            },
            { id: "value", name: { tr: "Değer", en: "Value" }, type: "number", defaultValue: 15.6, required: true }
        ],
        results: [
            { id: "result", label: { tr: "Sonuç", en: "Result" }, decimalPlaces: 2 }
        ],
        formula: (v) => {
            const type = v.type || "in2cm";
            const val = parseFloat(v.value) || 0;
            if (type === "in2cm") {
                return { result: val * 2.54 };
            } else {
                return { result: val / 2.54 };
            }
        },
        seo: {
            title: { tr: "İnç Hesaplama (inç - cm Dönüştürücü) 2026", en: "Inch to CM Calculator 2026" },
            metaDescription: { tr: "1 inç kaç cm? Televizyon, ekran, jant inç ölçülerini anında santimetreye çevirin. İnç hesaplama ve dönüştürücü aracı.", en: "Convert inch to cm for TVs, monitors, and wheels." },
            content: { tr: "İnç (inch) genellikle Amerika Birleşik Devletleri ve İngiltere gibi ülkelerde kullanılan bir uzunluk ölçü birimidir. Ancak Türkiye'de televizyon, monitör ve akıllı telefon ekranı boyutlarından otomobil jantlarına kadar birçok alanda standart birim olarak kullanılmaktadır.", en: "Inch is widely used in tech screens." },
            faq: [
                { q: { tr: "1 inç kaç santimetredir (cm)?", en: "How many cm is 1 inch?" }, a: { tr: "1 inç tam olarak 2,54 santimetreye eşittir.", en: "1 inch is exactly 2.54 cm." } }
            ],
            richContent: {
                howItWorks: { tr: "Değeri 2.54 ile çarpar veya böler.", en: "Multiply or divide by 2.54" },
                formulaText: { tr: "İnç = cm / 2.54 | cm = inç x 2.54", en: "Inch = cm / 2.54" },
                exampleCalculation: { tr: "55 inç bir televizyonun ekran köşegeni: 55 x 2.54 = 139.7 cm'dir.", en: "55 inch = 139.7 cm" },
                miniGuide: { tr: "Ekran inç hesaplaması köşeden köşeye (diyagonal) yapılır.", en: "Screens are measured diagonally." }
            }
        }
    },
    {
        id: "square-meter",
        slug: "metrekare-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Metrekare Hesaplama", en: "Square Meter Calculator" },
        h1: { tr: "Metrekare (m²) Alan Hesaplama", en: "Square Meter (m²) Calculator" },
        description: { tr: "Oda, arsa veya duvar için en ve boy girerek alanın kaç metrekare olduğunu anında bulun.", en: "Calculate the area in square meters using width and length." },
        shortDescription: { tr: "Genişlik ve uzunluk girerek ev, oda veya halının metrekaresini (m²) hesaplayın.", en: "Find the square meters of a room or field." },
        inputs: [
            { id: "width", name: { tr: "En / Genişlik (metre)", en: "Width (meters)" }, type: "number", defaultValue: 5, required: true },
            { id: "length", name: { tr: "Boy / Uzunluk (metre)", en: "Length (meters)" }, type: "number", defaultValue: 4, required: true }
        ],
        results: [
            { id: "sqm", label: { tr: "Metrekare Alan (m²)", en: "Square Meter Space (m²)" }, suffix: " m²", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const w = parseFloat(v.width) || 0;
            const l = parseFloat(v.length) || 0;
            return { sqm: w * l };
        },
        seo: {
            title: { tr: "Metrekare Hesaplama Aracı | HesapMod", en: "Square Meter Calculator" },
            metaDescription: { tr: "Genişlik ve uzunluk değerlerini girerek oda, halı, arsa veya inşaat alanı için net metrekare (m²) miktarını pratik şekilde hesaplayın.", en: "Calculate square meter easily." },
            content: { tr: "Ev kiralarken, boya yaptırırken veya arsa alırken metrekare (m²) kavramı sıkça kullanılır. Dikdörtgen planlı bir alanın m² hesabı, en ve boy uzunluklarının çarpılmasıyla elde edilir.", en: "Area = Width x Length." },
            faq: [
                { q: { tr: "Metrekare nasıl bulunur?", en: "How to find square meters?" }, a: { tr: "Metre cinsinden en ve boy değerleri birbiriyle çarpılır.", en: "Multiply length and width in meters." } }
            ],
            richContent: {
                howItWorks: { tr: "En ve boy miktarını çarparak doğrudan alanı bulur.", en: "Multiply width by length." },
                formulaText: { tr: "Alan = En x Boy", en: "Area = Width x Length" },
                exampleCalculation: { tr: "Bir oda 5 metre genişliğinde ve 4 metre uzunluğunda ise, 5x4 = 20 metrekaredir.", en: "5m x 4m = 20 sqm." },
                miniGuide: { tr: "Eğik veya üçgenimsi odalarda alanı karelere/üçgenlere bölüp toplamını alabilirsiniz.", en: "For odd shapes, divide into smaller rectangles." }
            }
        }
    },
    {
        id: "mile-km",
        slug: "mil-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Mil Hesaplama (Mil - km)", en: "Mile Calculator (Mile - km)" },
        h1: { tr: "Mil ve Kilometre Çevirici", en: "Mile and Kilometer Converter" },
        description: { tr: "Milden kilometreye veya kilometreden mile hız ve mesafe dönüşümü yapın. 1 Kara Mili = 1.609 km", en: "Convert distances between miles and kilometers." },
        shortDescription: { tr: "Araç hız göstergesi veya mesafe kıyaslaması için Mil ile Kilometre (km) arasında dönüştürme yapın.", en: "Convert mile and kilometer distances." },
        inputs: [
            { 
                id: "type", 
                name: { tr: "Dönüşüm Yönü", en: "Conversion Direction" }, 
                type: "select", 
                defaultValue: "mil2km",
                options: [
                    { label: { tr: "Mil -> Kilometre (km)", en: "Mile to km" }, value: "mil2km" },
                    { label: { tr: "Kilometre (km) -> Mil", en: "km to Mile" }, value: "km2mil" }
                ]
            },
            { id: "value", name: { tr: "Değer", en: "Value" }, type: "number", defaultValue: 60, required: true }
        ],
        results: [
            { id: "result", label: { tr: "Sonuç", en: "Result" }, decimalPlaces: 2 }
        ],
        formula: (v) => {
            const type = v.type || "mil2km";
            const val = parseFloat(v.value) || 0;
            // 1 Kara mili = 1.609344 km
            if (type === "mil2km") {
                return { result: val * 1.609344 };
            } else {
                return { result: val / 1.609344 };
            }
        },
        seo: {
            title: { tr: "Mil Hesaplama (Kilometre - Mil Çevirici) 2026", en: "Mile to KM Converter" },
            metaDescription: { tr: "1 Mil kaç kilometre? Kara mili ve km arasında yol, mesafe ve hız göstergesi dönüşümlerini hesaplayın.", en: "Convert mile to km." },
            content: { tr: "Amerika ve Birleşik Krallık gibi ülkelerde mesafe birimi olarak Mil (Mile) tercih edilirken, ülkemizde ve Avrupa ülkelerinin çoğunda Kilometre (km) kullanılır. Aracılığıyla mesafe farklarını hızla dönüştürebilirsiniz.", en: "Mile and KM differences." },
            faq: [
                { q: { tr: "1 Mil kaç kilometredir?", en: "How many km in 1 Mile?" }, a: { tr: "1 kara mili yaklaşık olarak 1,609 km'dir. Deniz mili ise 1,852 km'dir. Bu hesaplayıcı yaygın olan kara mili katsayısını kullanır.", en: "1 mile is approx 1.609 km." } }
            ],
            richContent: {
                howItWorks: { tr: "Değeri 1.609 katsayısı üzerinden dönüştürür.", en: "Multiplies or divides by 1.609." },
                formulaText: { tr: "Km = Mil x 1.60934 | Mil = Km / 1.60934", en: "Km = Miles x 1.60934" },
                exampleCalculation: { tr: "60 Mil hız limiti aslında 60 x 1.609 = ~96 km/s hıza eşittir.", en: "60 mph = 96 km/h." },
                miniGuide: { tr: "Araç hız göstergelerinde mph (miles per hour) olan limitin km/h karşılığını pratik olarak tahmin etmek için mil sayısını yarısı kadar üzerine ekleyebilirsiniz (60 mil ~ 90 km).", en: "Estimate by adding half." }
            }
        }
    },
    {
        id: "square-root-calc",
        slug: "koklu-sayi-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Köklü Sayı Hesaplama", en: "Square Root Calculator" },
        h1: { tr: "Karekök ve Küpkök Hesaplama", en: "Square and Cube Root Calculator" },
        description: { tr: "Bir sayının karekökünü, küpkökünü veya istediğiniz herhangi bir dereceden kökünü hızlıca hesaplayın.", en: "Calculate square, cube, or any nth root of a number." },
        shortDescription: { tr: "Girilen sayının karekök, küpkök ve 4. dereceden kök değerlerini hemen bulun.", en: "Instantly find square, cube, and 4th roots of a number." },
        inputs: [
            { id: "number", name: { tr: "Sayı", en: "Number" }, type: "number", defaultValue: 25, required: true }
        ],
        results: [
            { id: "sqrt", label: { tr: "Karekök (2. Derece)", en: "Square Root" }, decimalPlaces: 4 },
            { id: "cbrt", label: { tr: "Küpkök (3. Derece)", en: "Cube Root" }, decimalPlaces: 4 },
            { id: "root4", label: { tr: "4. Dereceden Kök", en: "4th Root" }, decimalPlaces: 4 }
        ],
        formula: (v) => {
            const num = parseFloat(v.number) || 0;
            if (num < 0) return { sqrt: "Tanımsız (-)", cbrt: Math.cbrt(num), root4: "Tanımsız (-)" };
            return {
                sqrt: Math.sqrt(num),
                cbrt: Math.cbrt(num),
                root4: Math.pow(num, 1/4)
            };
        },
        seo: {
            title: { tr: "Köklü Sayı Hesaplama 2026", en: "Root Calculator 2026" },
            metaDescription: { tr: "Karekök hesaplama ve küpkök alma işlemlerini anında yapın. Matematik ödevleri ve formüller için pratik köklü sayı dönüştürücü.", en: "Calculate square rules and root logic easily." },
            content: { tr: "Köklü sayılar, bir sayının kendi kendisiyle kaç kez çarpılarak o değere ulaştığını bulmaya yarayan matematiksel işlemlerdir.", en: "Math roots logic explained." },
            faq: [
                { q: { tr: "Negatif sayının karekökü alınır mı?", en: "Can you take sqrt of negative?" }, a: { tr: "Gerçel sayılar kümesinde negatif sayıların çift dereceli kökleri (karekök gibi) tanımsızdır.", en: "Undefined in real numbers." } }
            ],
            richContent: {
                howItWorks: { tr: "Sayının x^(1/n) formülüyle kökünü üretir.", en: "Works via x^(1/n)." },
                formulaText: { tr: "n√x = x^(1/n)", en: "n√x = x^(1/n)" },
                exampleCalculation: { tr: "25'in karekökü 5'tir.", en: "Sqrt of 25 is 5." },
                miniGuide: { tr: "Küpkök hesaplarken negatif değerler geçerlidir (Örn: -8 küpkökü -2).", en: "Cuberoot supports negatives." }
            }
        }
    },
    {
        id: "exponent-calc",
        slug: "uslu-sayi-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Üslü Sayı Hesaplama", en: "Exponent Calculator" },
        h1: { tr: "Taban ve Üs (Kuvvet) Hesaplama", en: "Base and Exponent Calculator" },
        description: { tr: "Bir sayının üssünü hesaplayın. Taban ve kuvvet değerlerini girerek sonucu anında bulun.", en: "Calculate the power of a number by providing base and exponent." },
        shortDescription: { tr: "Taban ve üs (kuvvet) bilgisi girerek üslü sayı işlemini anında çözün.", en: "Solve exponent expression instantly." },
        inputs: [
            { id: "base", name: { tr: "Taban Sayı", en: "Base Number" }, type: "number", defaultValue: 2, required: true },
            { id: "exp", name: { tr: "Üs (Kuvvet)", en: "Exponent (Power)" }, type: "number", defaultValue: 8, required: true }
        ],
        results: [
            { id: "result", label: { tr: "Sonuç", en: "Result" } }
        ],
        formula: (v) => {
            const base = parseFloat(v.base) || 0;
            const exp = parseFloat(v.exp) || 0;
            return { result: Math.pow(base, exp) };
        },
        seo: {
            title: { tr: "Üslü Sayı Hesaplama (Kuvvet Alma) 2026", en: "Exponent Calculator 2026" },
            metaDescription: { tr: "Taban ve üs (kuvvet) değerlerini girerek üslü sayı sonucunu anında hesaplayın.", en: "Calculate exponent expressions." },
            content: { tr: "Üslü sayılar, bir sayının kendi kendisiyle kaç kere çarpılacağını gösteren matematiksel ifadelerdir.", en: "Exponents denote repeating multiplications." },
            faq: [
                { q: { tr: "Herhangi bir sayının 0. kuvveti kaçtır?", en: "What is power 0?" }, a: { tr: "Sıfır hariç herhangi bir sayının sıfırıncı kuvveti daima 1'dir.", en: "Always 1 (except 0)." } }
            ],
            richContent: {
                howItWorks: { tr: "Tabanı kendi kendisiyle exponent kadar çarpar.", en: "Multiplies base by itself exponent times." },
                formulaText: { tr: "x^y = x * x * x... (y kez)", en: "x^y" },
                exampleCalculation: { tr: "2 üzeri 8 (2^8) = 256'dır.", en: "2^8 = 256." },
                miniGuide: { tr: "Negatif üsler sayıyı ters çevirir (Örn: 2^-1 = 1/2 = 0.5)", en: "Negative exponents mean fractions." }
            }
        }
    },
    {
        id: "ratio-calc",
        slug: "oran-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Oran Hesaplama", en: "Ratio Calculator" },
        h1: { tr: "İki Değer Arasındaki Oran ve Orantı", en: "Ratio and Proportion Calculator" },
        description: { tr: "İki değerin birbirine oranını en sade haliyle hesaplayın. A:B formatında sadeleştirme işlemleri.", en: "Simplify ratio between two values as A:B." },
        shortDescription: { tr: "Girilen iki sayının birbirine oranını hesaplar ve en sade kesir (A:B) halinde sunar.", en: "Calculates ratio of two numbers and provides simplified fraction." },
        inputs: [
            { id: "a", name: { tr: "A Değeri", en: "Value A" }, type: "number", defaultValue: 1024, required: true },
            { id: "b", name: { tr: "B Değeri", en: "Value B" }, type: "number", defaultValue: 768, required: true }
        ],
        results: [
            { id: "decimal", label: { tr: "Ondalık Oran (A/B)", en: "Decimal Ratio (A/B)" }, decimalPlaces: 4 },
            { id: "simplified", label: { tr: "Sadeleştirilmiş Oran", en: "Simplified Ratio" }, type: "text" }
        ],
        formula: (v) => {
            const a = parseFloat(v.a) || 0;
            const b = parseFloat(v.b) || 0;
            if (b === 0) return { decimal: 0, simplified: "Tanımsız (B=0)" };

            // Helper for GCD
            const gcd = (x: number, y: number): number => {
                x = Math.abs(x); y = Math.abs(y);
                while(y) {
                    let t = y;
                    y = x % y;
                    x = t;
                }
                return x;
            };

            // Calculate GCD for integer inputs
            let simp = "";
            if (Number.isInteger(a) && Number.isInteger(b)) {
                const divisor = gcd(a, b);
                simp = `${a/divisor} : ${b/divisor}`;
            } else {
                simp = "Sadece tam sayılar için";
            }

            return {
                decimal: a / b,
                simplified: simp
            };
        },
        seo: {
            title: { tr: "Oran Hesaplama ve Sadeleştirme 2026", en: "Ratio Calculator 2026" },
            metaDescription: { tr: "A ve B değerlerini girerek iki sayı arasındaki oranı ve en sade matematiksel oran (A:B) durumunu bulun.", en: "Find simplified ratio A:B." },
            content: { tr: "Oran, matematikte iki bağımsız büyüklüğün birbirine bölme yoluyla kıyaslanmasıdır. Resim çözünürlükleri (16:9, 4:3 vb.) oranlara örnektir.", en: "Ratio compares two quantities." },
            faq: [
                { q: { tr: "En sade oran nasıl bulunur?", en: "How to find simplified ratio?" }, a: { tr: "İki sayı da kendilerinin en büyük ortak bölenine (EBOB) bölünür.", en: "Divide by greatest common divisor." } }
            ],
            richContent: {
                howItWorks: { tr: "A'yı B'ye bölerek ondalık oranı, EBOB formülüyle sade halini gösterir.", en: "Shows decimal and computes GCD to simplify." },
                formulaText: { tr: "Oran = A / B", en: "Ratio = A / B" },
                exampleCalculation: { tr: "1920 ve 1080 sayılarının oranı 16:9'dur.", en: "1920:1080 simplifies to 16:9." },
                miniGuide: { tr: "Ekran çözünürlüklerini (Örn: 1024x768) oranlayıp standardını bulabilirsiniz.", en: "Useful for resolutions." }
            }
        }
    },
    {
        id: "random-number-calc",
        slug: "rastgele-sayi-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Rastgele Sayı Hesaplama", en: "Random Number Generator" },
        h1: { tr: "Rastgele Sayı Üretici", en: "Random Number Generator" },
        description: { tr: "Belirlediğiniz alt ve üst sınırlar arasında tamamen rastgele sayılar üretin. Çekilişler ve kura işlemleri için idealdir.", en: "Generate completely random numbers between a minimum and maximum limit." },
        shortDescription: { tr: "Minimum ve maksimum değer girerek anında rastgele (random) bir sayı üretin.", en: "Generate a random number instantly within given limits." },
        inputs: [
            { id: "min", name: { tr: "Minimum Değer", en: "Minimum Value" }, type: "number", defaultValue: 1, required: true },
            { id: "max", name: { tr: "Maksimum Değer", en: "Maximum Value" }, type: "number", defaultValue: 100, required: true }
        ],
        results: [
            { id: "randomResult", label: { tr: "Üretilen Rastgele Sayı", en: "Generated Random Number" } }
        ],
        formula: (v) => {
            const min = Math.ceil(parseFloat(v.min) || 0);
            const max = Math.floor(parseFloat(v.max) || 0);
            
            if (min > max) {
                return { randomResult: "Hata: Min > Max" };
            }

            const rand = Math.floor(Math.random() * (max - min + 1)) + min;
            return { randomResult: rand };
        },
        seo: {
            title: { tr: "Rastgele Sayı Üretici (Random Sayı) 2026", en: "Random Number Generator 2026" },
            metaDescription: { tr: "Belirlediğiniz min ve max sınırları arasında kura veya çekiliş için tamamen rastgele (random) sayı üretin.", en: "Generate completely random numbers between specified limits." },
            content: { tr: "Kura çekimi, oyunlar veya rastgele seçim gerektiren her türlü senaryo için rastgele sayı üretici aracını kullanabilirsiniz.", en: "Use for lotteries and games." },
            faq: [
                { q: { tr: "Rastgele sayı tamamen şansa mı bağlıdır?", en: "Is it completely random?" }, a: { tr: "Yazılımsal olarak pseudo-random (sözde rastgele) algoritmalar kullanılır ve günlük işler için tamamen şansa bağlıymış gibi dağılım gösterir.", en: "It uses pseudo-random algorithms sufficient for daily use." } }
            ],
            richContent: {
                howItWorks: { tr: "Matematiksel bir formül ile sınırlar arasında bir tamsayı seçer.", en: "Picks integer within boundaries using a formula." },
                formulaText: { tr: "Rastgele = Math.random() * (Max - Min + 1) + Min", en: "Random = Math.random() * (Max-Min+1) + Min" },
                exampleCalculation: { tr: "1 ile 10 arasında üret tuşuna bastığınızda örneğin 7 sayısını verebilir.", en: "Example: 1-10 yields 7." },
                miniGuide: { tr: "Sınırların aynı olması durumunda sonuç doğrudan o sayı olacaktır.", en: "If min=max, result is that number." }
            }
        }
    },
    {
        id: "number-spelling-calc",
        slug: "sayi-okunusu-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Sayı Okunuşu Hesaplama", en: "Number Spelling Calculator" },
        h1: { tr: "Rakamları Yazıya Çevirme (Sayı Okunuşu)", en: "Number to Text Converter" },
        description: { tr: "Fatura, çek ve senet yazımı için girdiğiniz sayısal değerin Türkçe okunuşunu anında öğrenin.", en: "Instantly learn the spelling/text representation of a given number." },
        shortDescription: { tr: "Uzun sayıların veya fatura tutarlarının Türkçe metin (yazı) olarak okunuşunu anında alın.", en: "Convert long numbers into spelled-out text." },
        inputs: [
            { id: "numberString", name: { tr: "Sayınızı Girin", en: "Enter Number" }, type: "text", defaultValue: "1453", required: true }
        ],
        results: [
            { id: "spelling", label: { tr: "Sayının Okunuşu", en: "Number Spelling" }, type: "text" }
        ],
        formula: (v) => {
            let str = (v.numberString || "").replace(/[^0-9]/g, "");
            if (!str) return { spelling: "" };
            if (str === "0") return { spelling: "Sıfır" };

            const ones = ["", "Bir ", "İki ", "Üç ", "Dört ", "Beş ", "Altı ", "Yedi ", "Sekiz ", "Dokuz "];
            const tens = ["", "On ", "Yirmi ", "Otuz ", "Kırk ", "Elli ", "Altmış ", "Yetmiş ", "Seksen ", "Doksan "];
            const scales = ["", "Bin ", "Milyon ", "Milyar ", "Trilyon ", "Katrilyon ", "Kentilyon "];
            
            let result = "";
            let scaleIdx = 0;

            // Pad the string to make its length a multiple of 3
            while (str.length % 3 !== 0) str = "0" + str;

            for (let i = str.length; i > 0; i -= 3) {
                const chunk = str.substring(i - 3, i);
                const a = parseInt(chunk[0]); // hundreds
                const b = parseInt(chunk[1]); // tens
                const c = parseInt(chunk[2]); // ones

                let chunkStr = "";

                if (a > 0) {
                    if (a === 1) chunkStr += "Yüz ";
                    else chunkStr += ones[a] + "Yüz ";
                }
                
                chunkStr += tens[b];
                
                if (c > 0) {
                    chunkStr += ones[c];
                }

                if (chunkStr.length > 0) {
                    // Handle "Bir Bin" exceptional case in Turkish -> "Bin"
                    if (scaleIdx === 1 && chunkStr === "Bir ") {
                        result = scales[scaleIdx] + result;
                    } else {
                        result = chunkStr + scales[scaleIdx] + result;
                    }
                }

                scaleIdx++;
                if (scaleIdx >= scales.length) break; // Exceeding kentilyon limit falls back loosely
            }

            return { spelling: result.trim() };
        },
        seo: {
            title: { tr: "Sayı Okunuşu Hesaplama (Rakamı Yazıya Çevirme) 2026", en: "Number Spelling Calculator 2026" },
            metaDescription: { tr: "Girdiğiniz rakamların, büyük sayıların, fatura ve çek tutarlarının Türkçe yazılışını (okunuşunu) anında hesaplayıp metin olarak alın.", en: "Convert numbers to spelled-out text format instantly." },
            content: { tr: "Çek, senet ve fatura gibi resmi evrak hazırlarken büyük rakamların yazıya dökülmesi hata yapmaya yatkın bir süreçtir. Bu araç hatasız çeviri sağlar.", en: "Handy helper for formatting checks/invoices." },
            faq: [
                { q: { tr: "Kaç basamağa kadar sayı okunuşu yapılabilir?", en: "Up to how many digits can it spell?" }, a: { tr: "Trilyonlar, katrilyonlar hatta kentilyonlara kadar devasa rakam grupları okunabilir.", en: "Up to quintillions." } }
            ],
            richContent: {
                howItWorks: { tr: "Sayıları sağdan sola üçerli gruplara (birler, binler, milyonlar) ayırarak Türkçe dil kurallarına göre metne döker.", en: "Groups by 3 digits and maps strings." },
                formulaText: { tr: "3'lü gruplar = Yüzler + Onlar + Birler (Örn: 1453 -> Bir Bin Dört Yüz Elli Üç -> Bin Dört Yüz Elli Üç)", en: "Standard triplet grouping." },
                exampleCalculation: { tr: "123456 -> Yüz Yirmi Üç Bin Dört Yüz Elli Altı", en: "123456 -> One hundred twenty three thousand..." },
                miniGuide: { tr: "Çek keserken ondalık tutarları 'Kuruş' olarak ayırmayı unutmayın.", en: "Separate your decimals manually when using for invoices." }
            }
        }
    },
    {
        id: "base-conversion-calc",
        slug: "taban-donusumu-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Taban Dönüşümü Hesaplama", en: "Base Conversion Calculator" },
        h1: { tr: "Farklı Sayı Tabanlarına (İkili, Sekizli, Onaltılı vb.) Dönüştürme", en: "Number Base Converter" },
        description: { tr: "Bir sayıyı 2'lik (Binary), 8'lik (Octal), 10'luk (Decimal) veya 16'lık (Hex) gibi farklı taban sistemlerine çevirin.", en: "Convert numbers between Binary, Octal, Decimal, and Hexadecimal systems." },
        shortDescription: { tr: "Girdiğiniz sayıyı ve tabanını farklı bir matematiksel/bilgisayar tabanına (binary, hex vb.) anında dönüştürün.", en: "Quickly convert a number from one base to another (binary, hex, etc)." },
        inputs: [
            { id: "num", name: { tr: "Çevrilecek Sayı", en: "Number to Convert" }, type: "text", defaultValue: "255", required: true },
            { id: "fromBase", name: { tr: "Mevcut Taban", en: "From Base" }, type: "number", min: 2, max: 36, defaultValue: 10, required: true },
            { id: "toBase", name: { tr: "Hedef Taban", en: "To Base" }, type: "number", min: 2, max: 36, defaultValue: 2, required: true }
        ],
        results: [
            { id: "converted", label: { tr: "Dönüştürülmüş Sonuç", en: "Converted Result" }, type: "text" }
        ],
        formula: (v) => {
            const numStr = (v.num || "").toString().trim();
            const fromB = parseInt(v.fromBase) || 10;
            const toB = parseInt(v.toBase) || 2;
            
            try {
                // Parse the string as integer from 'fromBase'
                const decimalValue = parseInt(numStr, fromB);
                if (isNaN(decimalValue)) {
                    return { converted: "Geçersiz Sayı / Taban Uyumu" };
                }
                // Convert decimalValue to 'toBase'
                const result = decimalValue.toString(toB).toUpperCase();
                return { converted: result };
            } catch (e) {
                return { converted: "Hata" };
            }
        },
        seo: {
            title: { tr: "Taban Dönüşümü Hesaplama (Binary, Hex, Decimal) 2026", en: "Base Conversion Calculator 2026" },
            metaDescription: { tr: "Bir tabandaki sayıyı (örn: 10'luk taban) istediğiniz hedef sayı tabanına (örn: 2'lik, 16'lık) anında dönüştürün.", en: "Convert any base number into target bases easily." },
            content: { tr: "Taban aritmetiği, özellikle bilgisayar bilimleri (Binary- İkili sistem, Hex- Onaltılı sistem) için çok temel bir işlemdir.", en: "Number base arithmetic." },
            faq: [
                { q: { tr: "Binary (İkili) Sistem nedir?", en: "What is Binary system?" }, a: { tr: "Sadece 0 ve 1 rakamlarının kullanıldığı, bilgisayarların dilini oluşturan 2'lik taban sistemidir.", en: "Base-2 system using 0 and 1." } }
            ],
            richContent: {
                howItWorks: { tr: "Girdi algoritma tarafından önce Decimal (10'luk) tabana, sonra hedef tabana parse edilir.", en: "Parses to decimal, then stringifies to target base." },
                formulaText: { tr: "JS parseInt(num, bas) -> num.toString(bas)", en: "Standard parsing." },
                exampleCalculation: { tr: "10'luk tabandaki 255 sayısı -> 16'lık tabanda 'FF' değerine, 2'lik tabanda '11111111' değerine eşittir.", en: "255 in dec is FF in hex." },
                miniGuide: { tr: "Max desteklenen taban 36'dır (A-Z harfleri).", en: "Maximum base supported is 36." }
            }
        }
    },
    {
        id: "modulo-calc",
        slug: "moduler-aritmetik-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Modüler Aritmetik Hesaplama", en: "Modulo Arithmetic Calculator" },
        h1: { tr: "Kalan Bulma (Mod Alma) İşlemi", en: "Modulo Calculator" },
        description: { tr: "Bölme işleminde kalan bulun. A sayısının B sayısına bölümünden kalanı (A mod B) anında hesaplar.", en: "Find the remainder of a division (A mod B)." },
        shortDescription: { tr: "A sayısının (Bölen) B sayısına (Bölünen) bölümünden kalanı bulun.", en: "Quickly calculate the remainder when dividing A by B." },
        inputs: [
            { id: "a", name: { tr: "Bölünen Sayı (A)", en: "Dividend (A)" }, type: "number", defaultValue: 25, required: true },
            { id: "b", name: { tr: "Bölen Sayı (Mod - B)", en: "Divisor (Modulus - B)" }, type: "number", defaultValue: 7, required: true }
        ],
        results: [
            { id: "remainder", label: { tr: "Kalan (A mod B)", en: "Remainder" }, decimalPlaces: 0 },
            { id: "quotient", label: { tr: "Tam Bölüm", en: "Quotient" }, decimalPlaces: 0 }
        ],
        formula: (v) => {
            const a = parseFloat(v.a) || 0;
            const b = parseFloat(v.b) || 0;
            if (b === 0) return { remainder: 0, quotient: 0 };
            return {
                remainder: a % b,
                quotient: Math.floor(a / b)
            };
        },
        seo: {
            title: { tr: "Modüler Aritmetik Hesaplama (Mod Alma) 2026", en: "Modulo Calculator 2026" },
            metaDescription: { tr: "Mod hesaplama aracı ile bölme işlemindeki kalanı (A mod B) kolaylıkla bulun. Matematik ve programlama ödevleri için modüler aritmetik.", en: "Find the modulo (remainder) of a division operation easily." },
            content: { tr: "Modüler aritmetik veya mod alma işlemi, bölme sonucunda artan (kalan) miktarla ilgilenir. Örneğin saatin 24 olması durumunda 1'e dönmesi gibi döngüsel hesaplamaların temelidir.", en: "Modulo math deals with division remainders." },
            faq: [
                { q: { tr: "Mod alma nerelerde kullanılır?", en: "Where is modulo used?" }, a: { tr: "Saat, gün ve hafta gibi döngüsel işlemlerin hesaplanmasında, şifreleme algoritmalarında ve yazılımda kullanılır.", en: "Used in cyclic counters and crypto." } }
            ],
            richContent: {
                howItWorks: { tr: "A sayısını B sayısına böler ve artan miktarı (mod) çıktı verir.", en: "Computes A % B in math." },
                formulaText: { tr: "Kalan = A % B | Bölüm = floor(A/B)", en: "Rem = A % B" },
                exampleCalculation: { tr: "25'in 7'ye bölümünden bölüm 3, kalan (mod) 4'tür.", en: "25 mod 7 = 4." },
                miniGuide: { tr: "Eğer çıkan sonuç 0 ise, A sayısı B sayısına tam bölünüyor demektir.", en: "If rem is 0, completely divisible." }
            }
        }
    },
    {
        id: "std-dev-calc",
        slug: "standart-sapma-hesaplama",
        category: "matematik-hesaplama",
        updatedAt: "2026-04-19",
        name: { tr: "Standart Sapma Hesaplama", en: "Standard Deviation Calculator" },
        h1: { tr: "Standart Sapma ve Varyans Hesaplama Aracı", en: "Standard Deviation and Variance Calculator" },
        description: { tr: "Girdiğiniz sayı dizisinin standart sapmasını, varyansını ve ortalamasını (Örneklem formülüyle) hesaplayın.", en: "Calculate standard deviation, variance and mean of a dataset." },
        shortDescription: { tr: "Aralarına virgül koyarak sayıları girin; varyans, ortalama ve standart sapmayı anında görün.", en: "Enter comma-separated numbers to find standard deviation instantly." },
        inputs: [
            { id: "dataset", name: { tr: "Sayılar (Virgülle ayırın)", en: "Numbers (comma-separated)" }, type: "text", defaultValue: "10, 12, 23, 23, 16, 23, 21, 16", required: true }
        ],
        results: [
            { id: "mean", label: { tr: "Aritmetik Ortalama", en: "Mean" }, decimalPlaces: 3 },
            { id: "variance", label: { tr: "Varyans (Örneklem)", en: "Variance (Sample)" }, decimalPlaces: 3 },
            { id: "stdDev", label: { tr: "Standart Sapma (Örneklem)", en: "Standard Deviation (Sample)" }, decimalPlaces: 3 }
        ],
        formula: (v) => {
            const str = v.dataset || "";
            // Extract numbers safely
            const rawArr = str.split(',').map((x: string) => parseFloat(x.trim()));
            const arr = rawArr.filter((n: number) => !isNaN(n));

            if (arr.length < 2) {
                return { mean: 0, variance: 0, stdDev: 0 };
            }

            const n = arr.length;
            const mean = arr.reduce((acc: number, val: number) => acc + val, 0) / n;
            
            // Sample variance (n-1)
            const sumSq = arr.reduce((acc: number, val: number) => acc + Math.pow(val - mean, 2), 0);
            const variance = sumSq / (n - 1);
            const stdDev = Math.sqrt(variance);

            return {
                mean: mean,
                variance: variance,
                stdDev: stdDev
            };
        },
        seo: {
            title: { tr: "Standart Sapma ve Varyans Hesaplama Aracı 2026", en: "Standard Deviation Calculator 2026" },
            metaDescription: { tr: "Veri kümenizdeki sayıları virgülle ayırarak girin, aritmetik ortalama, varyans ve örneklem standart sapmasını bilimsel metotla hemen hesaplayın.", en: "Scientific calculator to find mean, variance and std deviation." },
            content: { tr: "Standart sapma, istatistikte verilerin aritmetik ortalamaya göre ne kadar yayılım gösterdiğini (dağıldığını) ifade eder.", en: "Standard deviation expresses data dispersion." },
            faq: [
                { q: { tr: "Standart sapma küçükse ne anlama gelir?", en: "What does small STD Dev mean?" }, a: { tr: "Verilerin birbirine ve aritmetik ortalamaya daha yakın olduğu, riskin/sapmanın daha az olduğu anlamına gelir.", en: "Data points are close to each other." } }
            ],
            richContent: {
                howItWorks: { tr: "Verilerin ortalamasını alır, herbir verinin ortalama ile farkının karesini bulup toplayarak örneklem varyansını hesaplar ve bu sonucun karekökü ile sapmayı bulur.", en: "Uses standard sample variation formulas." },
                formulaText: { tr: "S = √( Σ(x - μ)² / (N-1) )", en: "S = √( Σ(x - μ)² / (N-1) )" },
                exampleCalculation: { tr: "10, 12, 14 verilerinin ortalaması 12'dir. Sapma katsayısı ise 2'dir.", en: "For 10,12,14 std.dev=2." },
                miniGuide: { tr: "Bu araç popülasyon (N) değil örneklem (N-1) formülünü kullanarak hesaplama gerçekleştirir.", en: "Uses sample deviation (N-1)." }
            }
        }
    }
];
