import type { CalculatorConfig } from "./calculator-types";

export const customCalculators: CalculatorConfig[] = [
    {
        id: "arac-deger-hesaplama",
        slug: "arac-deger-hesaplama",
        category: "tasit-ve-vergi",
        updatedAt: "2026-04-26",
        name: { tr: "Araç Değer Hesaplama", en: "Vehicle Value Calculator" },
        h1: { tr: "Araç Değer Hesaplama", en: "Vehicle Value Calculator" },
        description: {
            tr: "İkinci el aracın marka, model, yıl, kilometre, donanım, bölge, servis geçmişi, hasar ve emsal ilan bilgilerine göre tahmini piyasa değerini hesaplayın.",
            en: "Estimate a used vehicle's market value from make, model, year, mileage, trim, region, service history, damage status, and comparable listing data.",
        },
        shortDescription: {
            tr: "İkinci el araç için piyasa değeri, yıllık maliyet ve kredi taksitini emsal ilanlarla birlikte görün.",
            en: "See estimated used-car value, annual ownership cost, and loan installment with comparable listing support.",
        },
        relatedCalculators: [
            "kasko-degeri-hesaplama",
            "arac-deger-kaybi-hesaplama",
            "trafik-sigortasi-hesaplama",
            "arac-muayene-ucreti-hesaplama",
        ],
        inputs: [],
        results: [],
        formula: () => ({}),
        seo: {
            title: {
                tr: "Araç Değer Hesaplama 2026 | İkinci El Piyasa Değeri",
                en: "Vehicle Value Calculator 2026 | Used Car Market Value",
            },
            metaDescription: {
                tr: "İkinci el aracınızın 2026 tahmini piyasa değerini marka, model, yaş, kilometre ve hasar kaydına göre hesaplayın. Değer kaybı ve emsal ilan analizi.",
                en: "Estimate your used car's 2026 market value by make, model, age, mileage and damage record, with depreciation and comparable listing analysis.",
            },
            content: {
                tr: `<h3>Araç Değeri Nedir?</h3><p>Bir aracın değeri, o aracın belirli bir anda alıcı bulabileceği tahmini fiyattır. Sabit bir rakam değildir: aynı yaş ve kilometredeki iki araç, hasar geçmişi, donanımı ve satıldığı il yüzünden belirgin biçimde farklı fiyatlara gidebilir. Piyasa değeri arz ve talebe göre sürekli hareket eder.</p><p>Bu araç, girdiğiniz bilgilerden yola çıkarak bir <strong>tahmini değer aralığı</strong> üretir. Emsal ilan girerseniz hesap bu ilanların medyanı üzerinden kurulur; girmezseniz aracın sıfır referans fiyatından yaşa, kilometreye ve kondisyona göre amortisman düşülür. Sonuç bir ön fikir verir, <strong>resmi değerleme değildir</strong>: yetkili ekspertiz raporunun, sigorta şirketlerinin kasko değer listesinin veya noter satış işlemlerinde esas alınan tutarların yerine geçmez. Kesin bir rakama ihtiyacınız varsa aracı fiziksel olarak inceleyen bir ekspertize başvurun.</p>`,
                en: "A vehicle's value is the estimated price it could attract at a given moment; it moves with supply and demand. This tool produces an estimated range: if you enter comparable listings it works from their median, otherwise it depreciates the model's reference new price by age, mileage and condition. It is a preview, not a formal appraisal, and does not replace a professional inspection or an insurer's value list.",
            },
            richContent: {
                howItWorks: {
                    tr: "Hesap iki yoldan biriyle kurulur. Emsal ilan girdiğinizde araç bunları esas alır: ilanların medyanını hesaplar, aşırı yüksek ve aşırı düşük ilanları eleyip kalan fiyatları sizin kilometrenize göre normalize eder. Emsal girmediğinizde ise aracın model yılına karşılık gelen sıfır referans fiyatından başlanır ve üzerine amortisman uygulanır. Değeri etkileyen faktörler şunlardır: marka ve model, çünkü her modelin kendi referans fiyatı ve değer koruma davranışı vardır; model yılı, çünkü değer kaybı ilk yıl en sert, sonraki yıllarda giderek yavaşlayan bir eğri izler; kilometre, aracın yaşına göre beklenen ortalamanın altında veya üstünde olmasına göre artı ya da eksi yönde; hasar geçmişi, hafiften ağıra doğru artan oranlarda ve boyalı veya değişen parça sayısına göre ayrıca; donanım paketi, servis geçmişinin kayıtlı olup olmaması, yakıt tipi ve vites türü. Aracın satıldığı il de hesaba girer, çünkü büyükşehir piyasaları genelde bir miktar yukarıdadır. Sonuç tek bir rakam yerine aralık olarak verilir; aralığın genişliği elinizdeki veriye bağlıdır: yeterli sayıda emsal ilan girdiğinizde bant daralır, emsal olmadığında ve özellikle ağır hasar kaydı bulunduğunda belirsizlik arttığı için bant genişler.",
                    en: "The tool works two ways. With comparable listings it takes their median, trims outliers and normalises the rest to your mileage. Without them it depreciates the model's reference new price. Factors: make and model, model year (depreciation is steepest in year one then flattens), mileage relative to the expected average for the car's age, damage history and the number of repainted or replaced panels, trim level, service records, fuel type, transmission and the province of sale. The result is a range whose width reflects your data: more listings narrow it, missing data and heavy damage widen it.",
                },
                formulaText: {
                    tr: "Tahmini Değer = Sıfır Referans Fiyatı × (1 − Yaş Kaybı − Kilometre Etkisi − Hasar Etkisi + Kondisyon Düzeltmeleri). Yaş kaybı sabit bir yıllık yüzde değildir; ilk yıl en yüksek, sonraki yıllarda kademeli olarak azalan bir oranla işler, çünkü araçlar değerinin büyük kısmını ilk yıllarda kaybeder. Kilometre etkisi aracın yaşına göre beklenen kilometreyle karşılaştırılarak bulunur: beklenenin üzerindeki her on bin kilometre değeri aşağı çeker, altında kalmak ise sınırlı bir prim sağlar. Kondisyon düzeltmeleri donanım, servis geçmişi, yakıt tipi, vites ve il farkını içerir. Bu formül piyasa davranışını yaklaşık olarak modelleyen bir tahmin yöntemidir; resmî ya da tek doğru bir araç değerleme formülü yoktur, oranlar araca ve modele göre değişir.",
                    en: "Estimated Value = Reference New Price × (1 − Age Depreciation − Mileage Effect − Damage Effect + Condition Adjustments). Depreciation is steepest in the first year and flattens later. Mileage is measured against the expected average for the car's age. This is an approximation, not an official formula; rates vary by model.",
                },
                exampleCalculation: {
                    tr: "Beş yaşında, 90.000 kilometrede, hasar kaydı bulunmayan bir otomobil için hesap şu adımlarla ilerler. Önce modelin sıfır referans fiyatı alınır — bu tutar tamamen araca özeldir ve modelden modele büyük fark gösterir. Ardından yaş kaybı uygulanır: ilk yıl için yaklaşık beşte bir, izleyen dört yıl için yılda yaklaşık yüzde on iki oranında kayıp birikince beş yılın sonunda aracın sıfır fiyatının kabaca yarısına yakın bir seviyeye inilir. Sonra kilometre kontrol edilir: bu araç için beklenen kilometre yılda on iki bin üzerinden 60.000 iken gerçek değer 90.000'dir, yani 30.000 kilometre fazladır ve bu fark değeri yaklaşık yüzde dört buçuk aşağı çeker. Hasar kaydı bulunmadığı için ek bir düşüş uygulanmaz. Son olarak donanım, servis geçmişi, yakıt tipi, vites ve il düzeltmeleri eklenir; yetkili servis kayıtlı ve otomatik vitesli bir araç bu adımda birkaç puan yukarı gider. Çıkan rakamın etrafına belirsizlik bandı konur ve size tek bir fiyat yerine bir aralık gösterilir. Aynı araca ağır hasar kaydı eklendiğinde değer yaklaşık yüzde otuz daha düşer ve bant belirgin biçimde genişler.",
                    en: "For a five-year-old car with 90,000 km and no damage record: start from the model's reference new price, apply age depreciation (roughly a fifth in year one, then about twelve percent a year), which lands near half the original price after five years. Expected mileage is 60,000 (12,000 a year), so 30,000 extra kilometres pull the value down by roughly four and a half percent. No damage means no further deduction. Trim, service records, fuel type, transmission and province adjustments are then applied, and an uncertainty band is placed around the result. Adding a heavy damage record would cut about thirty percent more and widen the band.",
                },
                miniGuide: {
                    tr: `<h3>Aracın Değerini Korumanın Yolları</h3><p>Servis kaydı tutmak, satış anında en somut karşılığı olan alışkanlıktır. Yetkili serviste düzenli bakım gördüğü belgelenen bir araç, aynı yaş ve kilometredeki kayıtsız bir araca göre daha kolay ve daha iyi fiyata alıcı bulur. Bakım fişlerini ve kayıtlarını saklayın.</p><p>Boyasızlık da en az bakım kadar belirleyicidir. Küçük bir çizik için panel boyatmak kısa vadede aracı güzelleştirse de ekspertizde boyalı parça olarak görünür ve değeri kalıcı biçimde aşağı çeker. Kozmetik onarımlarda bu dengeyi gözetin.</p><h3>Satış Zamanlaması</h3><p>Değer kaybı ilk yıllarda en hızlıdır, sonra yavaşlar. Bu yüzden çok kısa süre elde tutup satmak orantısız bir kayıp anlamına gelir. Kilometrenin yuvarlak eşikleri geçmesi de fiyat algısını etkiler; satmayı düşünüyorsanız aracı yüksek bir eşiğin hemen ötesine taşımadan önce değerlendirin.</p><h3>Kasko Değer Listesi ile Piyasa Değeri Farkı</h3><p>Bu ikisi aynı şey değildir ve karıştırılması pahalıya mal olur. Kasko değer listesi, sigorta şirketlerinin hasar ve pert işlemlerinde esas aldığı referans tablodur ve tek bir standart araç varsayar. Piyasa değeri ise sizin aracınızın gerçek durumuna, donanımına ve bulunduğu ile göre oluşur. Aracınız listedeki değerden yüksek veya düşük çıkabilir; pert-hasar durumunda ödeme genellikle liste üzerinden yapılır.</p><h3>Sık Yapılan Hatalar</h3><ul><li>İlan fiyatlarını satış fiyatı sanmak; ilanlar pazarlık payı içerir ve genelde gerçek satış bedelinin üzerindedir</li><li>Emsal karşılaştırırken donanım ve hasar durumunu göz ardı edip yalnızca yaş ve kilometreye bakmak</li><li>Yaptırılan masrafların değere birebir yansıyacağını varsaymak; çoğu bakım ve aksesuar harcaması satışta tam olarak geri dönmez</li><li>Tek bir tahmin aracının sonucuna dayanıp ekspertiz yaptırmadan pazarlığa oturmak</li><li>Ağır hasarlı bir aracı hasarsız emsallerle kıyaslamak</li></ul>`,
                    en: `<h3>Protecting Value</h3><p>Documented servicing sells better than an unrecorded car of the same age. Keep records. Avoid repainting panels for minor scratches: paintwork shows up in inspections and permanently lowers value.</p><h3>Timing and Value Lists</h3><p>Depreciation is steepest early on, so very short ownership means a disproportionate loss. Note that an insurer's value list is a reference table used for claims and write-offs, not your car's actual market value; the two often differ.</p><h3>Common Mistakes</h3><ul><li>Treating asking prices as sale prices</li><li>Comparing only age and mileage while ignoring trim and damage</li><li>Assuming maintenance spending returns fully at resale</li><li>Negotiating on an estimate alone without an inspection</li></ul>`,
                },
            },
            faq: [
                {
                    q: { tr: "Araç değeri nasıl belirlenir?", en: "How is a vehicle's value determined?" },
                    a: { tr: "Araç değeri, o modelin piyasadaki güncel emsal fiyatları ile aracın kendi durumunun birleşiminden çıkar. Marka ve model, model yılı, kilometre, hasar geçmişi, donanım paketi, servis kayıtları, yakıt tipi, vites ve satıldığı il birlikte değerlendirilir. Emsal ilan verisi varsa değer bu ilanların medyanı üzerinden, yoksa modelin sıfır referans fiyatından amortisman düşülerek tahmin edilir.", en: "Value comes from current comparable prices combined with the car's own condition: make and model, year, mileage, damage history, trim, service records, fuel type, transmission and province. With listing data the estimate uses their median; without it, depreciation is applied to the model's reference new price." },
                },
                {
                    q: { tr: "Kasko değeri ile piyasa değeri aynı mı?", en: "Are insurance list value and market value the same?" },
                    a: { tr: "Hayır, farklı şeylerdir. Kasko değer listesi, sigorta şirketlerinin hasar ve pert işlemlerinde referans aldığı, standart bir araç varsayan tablodur. Piyasa değeri ise sizin aracınızın gerçek donanımı, hasar durumu ve bulunduğu il piyasasına göre oluşan fiyattır. İkisi genellikle birbirinden farklı çıkar; pert veya ağır hasar durumunda sigorta ödemesi çoğunlukla liste değeri üzerinden yapılır.", en: "No. The insurance value list is a reference table assuming a standard vehicle, used for claims and write-offs. Market value reflects your specific car's trim, damage and local market. They usually differ, and claim payments are generally based on the list." },
                },
                {
                    q: { tr: "Kilometre araç değerini ne kadar etkiler?", en: "How much does mileage affect value?" },
                    a: { tr: "Etki, mutlak kilometreden çok aracın yaşına göre beklenen ortalamayla arasındaki farktan doğar. Yılda ortalama on iki bin kilometre referans alındığında, beklenenin üzerindeki her on bin kilometre değeri yaklaşık yüzde bir buçuk aşağı çeker; beklenenin altında kalmak ise sınırlı bir prim sağlar. Bu nedenle düşük kilometreli eski bir araç ile yüksek kilometreli yeni bir araç beklenenden yakın fiyatlara gelebilir.", en: "What matters is the gap from the expected average for the car's age, not the absolute figure. Against a benchmark of about 12,000 km a year, each 10,000 km above expectation lowers value by roughly one and a half percent, while staying below gives a limited premium." },
                },
                {
                    q: { tr: "Hasar kaydı araç değerini nasıl düşürür?", en: "How does a damage record reduce value?" },
                    a: { tr: "Düşüş hasarın ağırlığıyla orantılıdır: hafif kayıtlar değeri sınırlı ölçüde etkilerken, orta düzey hasar belirgin bir fark yaratır, ağır hasar ise değerin yaklaşık üçte birine varan kayba yol açabilir. Boyalı veya değişen parça sayısı da ayrıca hesaba girer ve her parça değeri bir miktar daha aşağı çeker. Ağır hasarlı araçlarda alıcı bulmak zorlaştığı için tahmin aralığı da genişler.", en: "The reduction scales with severity: light records have limited effect, moderate damage is noticeable, and heavy damage can cost up to roughly a third of the value. Each repainted or replaced panel deducts further, and the estimate range widens because such cars are harder to sell." },
                },
                {
                    q: { tr: "Bu hesaplama resmi ekspertiz yerine geçer mi?", en: "Does this replace a professional appraisal?" },
                    a: { tr: "Hayır. Bu araç girdiğiniz bilgilere dayanan bir tahmin üretir; aracı fiziksel olarak incelemez, şasi ve motor durumunu, gizli hasarları veya bakım ihtiyacını göremez. Sonucu satış öncesi fiyat fikri edinmek, ilan hazırlamak veya pazarlığa hazırlanmak için kullanın. Alım satım, sigorta, kredi ve hukuki işlemlerde yetkili bir ekspertiz raporu gerekir.", en: "No. It produces an estimate from the details you enter and cannot inspect the car physically, assess the chassis and engine, or detect hidden damage. Use it to form a price expectation before selling or negotiating; formal transactions require an authorised inspection report." },
                },
            ],
        },
    },
];
