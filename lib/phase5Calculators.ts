// Yeni hesaplama araçları: Kasko Değeri, Trafik Sigortası, Vekâlet Ücreti, İcra Masrafı, İşsizlik Maaşı
// Bu dosya, phase5Calculators dizisini ve ilgili algoritmaları içerir.
import { CalculatorConfig } from "./calculator-types";

export const phase5Calculators: CalculatorConfig[] = [
    // 1. Kasko Değeri Hesaplama
    {
        id: "kasko-degeri",
        slug: "kasko-degeri-hesaplama",
        category: "sigorta",
        updatedAt: "2026-07-30",
        name: { tr: "Kasko Değeri Hesaplama", en: "Casco Value Calculator" },
        h1: { tr: "Kasko Değeri ve Tahmini Prim Hesaplama", en: "Casco Value and Estimated Premium Calculator" },
        description: { tr: "Aracınızın kasko bedeli ve yaşına göre 2026 tahmini yıllık kasko primini hesaplayın, kasko değerinin nasıl belirlendiğini öğrenin.", en: "Estimate your 2026 annual casco premium from your vehicle's casco value and age, and learn how casco value is determined." },
        shortDescription: { tr: "Kasko bedeline göre tahmini yıllık primi öğrenin.", en: "Estimate the annual casco premium from your casco value." },
        relatedCalculators: [
            "arac-deger-hesaplama",
            "trafik-sigortasi-hesaplama",
            "arac-deger-kaybi-hesaplama",
            "arac-muayene-ucreti-hesaplama"
        ],
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
            title: { tr: "Kasko Değeri Hesaplama 2026 | Tahmini Kasko Primi", en: "Casco Value Calculator 2026 | Estimated Casco Premium" },
            metaDescription: { tr: "Kasko bedeli ve araç yaşınıza göre 2026 tahmini yıllık kasko primini hesaplayın. Kasko değeri nedir, TSB listesi nasıl işler, örnek hesapla anlatım.", en: "Estimate your 2026 annual casco premium from casco value and vehicle age, and learn how the TSB casco value list works." },
            content: {
                tr: `<h3>Kasko Değeri Nedir?</h3><p>Kasko değeri, sigorta şirketinin aracınızı hasar ve pert işlemlerinde hangi tutar üzerinden değerlendireceğini gösteren referans bedeldir. Türkiye Sigorta Birliği her ay bir kasko değer listesi yayımlar; bu liste marka, model ve model yılı bazında hazırlanır ve sektörde ortak referans olarak kullanılır. Kasko değeri aracınızın satış fiyatı değildir, sigorta işlemlerinde esas alınan tutardır.</p><p>Önemli bir ayrım var: <strong>kasko değeri ile kasko primi aynı şey değildir.</strong> Değer, aracınızın sigortadaki karşılığıdır; prim ise o güvence için yıllık ödediğiniz tutardır. Bu araç kasko değerinizi TSB listesinden çekmez — kasko bedelini sizden girdi olarak alır ve aracın yaşına göre <strong>tahmini yıllık primi</strong> hesaplar. Aracınızın güncel kasko değerini poliçenizden veya sigorta şirketinizden öğrenip buraya girmeniz gerekir.</p>`,
                en: "Casco value is the reference amount an insurer uses for damage and write-off settlements; the Insurance Association of Türkiye publishes a monthly list by make, model and year. Casco value is not the same as the casco premium: value is what your car is worth to the insurer, the premium is what you pay for cover. This tool does not read the TSB list — you enter your casco value and it estimates the annual premium from your vehicle's age."
            },
            richContent: {
                howItWorks: {
                    tr: "Bu hesaplama iki bilgiyle çalışır: aracınızın kasko bedeli ve araç yaşı. Kasko bedelini siz girersiniz, çünkü bu tutar aracınızın marka, model ve model yılına özeldir ve Türkiye Sigorta Birliği'nin aylık yayımladığı kasko değer listesinden gelir; poliçenizde veya sigorta şirketinizin teklifinde yazar. Araç yaşı ise prim oranını belirler: yeni araçlarda oran düşük, araç yaşlandıkça kademeli olarak yükselir. Bunun nedeni eski araçlarda hasar sıklığının ve onarım maliyetinin görece artmasıdır. Gerçek poliçe priminde bu iki faktörün yanında sigorta şirketinin kendi risk değerlendirmesi, sürücünün hasarsızlık geçmişi, aracın kullanım şekli, tescilli olduğu il ve poliçeye eklenen ek teminatlar da rol oynar. Bu araç o faktörleri sormaz; elinizdeki kasko bedelinden yola çıkarak büyüklük sırasını gösteren bir ön tahmin verir, şirketlerin size vereceği teklif bu tahminin altında veya üstünde çıkabilir.",
                    en: "The calculation uses two inputs: your vehicle's casco value and its age. You enter the casco value because it is specific to your make, model and model year and comes from the monthly list published by the Insurance Association of Türkiye. Vehicle age sets the rate, which is lower for new cars and rises in steps as the car ages, reflecting higher claim frequency and repair costs. Real quotes also depend on the insurer's own risk assessment, your claims history, usage, province and optional cover; this tool does not ask for those and gives an order-of-magnitude estimate only."
                },
                formulaText: {
                    tr: "Tahmini Yıllık Prim = Kasko Bedeli × Araç Yaşı Oranı. Oran araç yaşına göre kademeli olarak belirlenir: en yeni araçlarda yaklaşık yüzde bir buçuk ile iki arasında başlar, orta yaştaki araçlarda yüzde iki buçuğa yaklaşır ve on yaşın üzerindeki araçlarda yüzde üç buçuk seviyesine çıkar. Kasko bedelinin kendisi bu hesabın çıktısı değil girdisidir; resmi kaynağı Türkiye Sigorta Birliği'nin aylık kasko değer listesidir ve araç modeline göre değişir. Sonuç bu nedenle bir ön tahmindir, teklif veya poliçe yerine geçmez.",
                    en: "Estimated Annual Premium = Casco Value × Vehicle Age Rate. The rate is banded by age, starting near one and a half to two percent for the newest vehicles and rising to around three and a half percent for cars over ten years old. The casco value is an input, not an output: its official source is the monthly TSB casco value list and it varies by model."
                },
                exampleCalculation: {
                    tr: "Üç yaşında bir otomobil için hesap şu adımlarla ilerler. Önce aracın kasko bedeli bulunur: bu tutarı ilgili ayın TSB kasko değer listesinden, poliçenizden veya sigorta şirketinizden öğrenirsiniz ve marka ile modele göre büyük fark gösterir. Diyelim ki listede aracınızın karşılığı 500.000 TL olarak geçiyor. Ardından araç yaşına karşılık gelen oran belirlenir; üç yaşındaki bir araç orta kademeye girdiği için oran yüzde iki virgül iki olarak uygulanır. Son adımda bu iki değer çarpılır: 500.000 × 0,022 = 11.000 TL tahmini yıllık prim. Aynı araç on yaşını geçtiğinde oran yüzde üç buçuğa çıkacağı için, kasko bedeli sabit kalsa bile prim 17.500 TL seviyesine yükselirdi. Buradaki 500.000 TL yalnızca örnek amaçlı bir tutardır; sizin aracınızın kasko bedeli tamamen farklı olabilir ve TSB listesi her ay güncellendiği için aynı araç için de zamanla değişir.",
                    en: "For a three-year-old car: first find the casco value from that month's TSB list, your policy or your insurer — say 500,000 TRY. A three-year-old car falls in the middle band, so a rate of 2.2 percent applies. Multiplying gives 500,000 × 0.022 = 11,000 TRY estimated annual premium. Past ten years of age the rate rises to about 3.5 percent, which would lift the premium to 17,500 TRY on the same value. The 500,000 TRY figure is illustrative only; your car's value will differ and the TSB list changes monthly."
                },
                miniGuide: {
                    tr: `<h3>Kasko Değeri Neden Önemli?</h3><p>Kasko değeri yalnızca primi etkileyen bir sayı değildir; aracınız pert olduğunda veya çalındığında size ödenecek tazminatın tavanıdır. Sigorta şirketi bu durumlarda ödemeyi genellikle poliçedeki kasko değeri üzerinden yapar, aracınızı piyasada kaça satabileceğinize göre değil. Bu yüzden poliçedeki değerin gerçekçi olması doğrudan cebinizi ilgilendirir.</p><h3>Düşük ve Yüksek Değerlemenin Sonuçları</h3><p>Kasko bedeli olması gerekenden düşük yazıldığında primi bir miktar ucuza getirir, ancak hasar anında eksik tazminat almanıza yol açar; aracınızı yenisiyle değiştirmeye yetmeyebilir. Olması gerekenden yüksek yazılması ise fazladan prim ödemenize neden olur ve hasar ödemesinde bu fazlalığın karşılığını göremezsiniz, çünkü şirket aracın gerçek değerinin üzerinde ödeme yapmaz. Doğru olan, poliçedeki değerin güncel listeyle örtüşmesidir.</p><h3>Poliçe Yenilerken Kontrol Edin</h3><p>Liste her ay güncellendiği ve araç bir yıl daha yaşlandığı için kasko değeri yenilemede mutlaka değişir. Yenileme teklifini alırken poliçede yazan kasko bedelini kontrol edin; otomatik yenilemelerde eski değerin taşınması veya piyasa hareketlerinin geriden yansıması mümkündür. Aracınıza sonradan taktırdığınız ses sistemi, jant veya LPG gibi ekipmanların poliçeye ayrıca yazılması gerekir, aksi halde hasar ödemesine dahil edilmezler.</p><h3>Sık Yapılan Hatalar</h3><ul><li>Kasko değerini aracın satış fiyatı sanmak; ikisi genellikle farklıdır</li><li>Kasko değeri ile kasko primini karıştırmak</li><li>Prim ucuzlasın diye kasko bedelini bilerek düşük yazdırmak ve hasarda eksik tazminatla kalmak</li><li>Yenilemede poliçedeki değeri kontrol etmeden otomatik onay vermek</li><li>Sonradan eklenen ekipmanları poliçeye bildirmemek</li><li>Kasko değerini zorunlu trafik sigortasının teminat limitiyle karıştırmak</li></ul>`,
                    en: `<h3>Why Casco Value Matters</h3><p>It is the ceiling on what you receive if your car is written off or stolen — insurers pay on the policy value, not on what you might have sold the car for.</p><h3>Under- and Over-valuation</h3><p>Understating the value shaves the premium but leaves you short at claim time; overstating it costs extra premium you cannot recover, since insurers do not pay above true value.</p><h3>Check at Renewal</h3><p>The list updates monthly and your car ages, so the value always changes at renewal. Verify it before accepting an automatic renewal, and declare any added equipment separately.</p><h3>Common Mistakes</h3><ul><li>Confusing casco value with sale price, or value with premium</li><li>Understating value to cut the premium</li><li>Auto-renewing without checking the stated value</li><li>Failing to declare aftermarket equipment</li></ul>`
                }
            },
            faq: [
                { q: { tr: "Kasko değeri nedir, nasıl belirlenir?", en: "What is casco value and how is it determined?" }, a: { tr: "Kasko değeri, sigorta şirketinin hasar ve pert işlemlerinde aracınızı hangi tutar üzerinden değerlendireceğini gösteren referans bedeldir. Türkiye Sigorta Birliği'nin her ay yayımladığı kasko değer listesi esas alınır; liste marka, model ve model yılı bazında hazırlanır. Aracın kilometresi, hasar geçmişi veya donanımı bu listede yer almaz, bu nedenle kasko değeri standart bir araç varsayar.", en: "It is the reference amount an insurer uses for damage and write-off settlements, taken from the monthly list published by the Insurance Association of Türkiye by make, model and year. Mileage, damage history and trim are not in the list, so it assumes a standard vehicle." } },
                { q: { tr: "Kasko değeri ile piyasa değeri aynı mı?", en: "Are casco value and market value the same?" }, a: { tr: "Hayır. Kasko değeri sigorta işlemlerinde kullanılan, standart bir araç varsayan referans tutardır. Piyasa değeri ise sizin aracınızın gerçek kilometresi, hasar durumu, donanımı ve bulunduğu il piyasasına göre oluşan satış fiyatıdır. İkisi genellikle birbirinden farklı çıkar; aracınız bakımlı ve düşük kilometreliyse piyasa değeri kasko değerinin üzerinde, hasarlı veya yüksek kilometreliyse altında olabilir.", en: "No. Casco value is a reference figure assuming a standard vehicle, used for insurance. Market value reflects your car's actual mileage, damage, trim and local market. A well-kept low-mileage car may be worth more than its casco value, a damaged or high-mileage one less." } },
                { q: { tr: "TSB Kasko Değer Listesi nedir?", en: "What is the TSB casco value list?" }, a: { tr: "Türkiye Sigorta Birliği tarafından her ay yayımlanan, marka ve model bazında araçların sigorta işlemlerinde esas alınacak değerlerini gösteren resmi referans tablosudur. Sigorta şirketleri poliçe düzenlerken ve hasar ödemesi yaparken bu listeyi ortak referans olarak kullanır. Liste aylık güncellendiği için aynı aracın değeri yıl içinde değişir.", en: "It is the official reference table published monthly by the Insurance Association of Türkiye, showing the values used in insurance transactions by make and model. Insurers use it as a common reference when writing policies and settling claims, and it is updated monthly." } },
                { q: { tr: "Aracım pert olursa hangi değer ödenir?", en: "Which value is paid if my car is written off?" }, a: { tr: "Pert ve çalınma durumlarında ödeme genellikle poliçenizde yazan kasko değeri üzerinden yapılır, aracın piyasada bulabileceği fiyat üzerinden değil. Bu nedenle poliçedeki bedelin güncel listeyle örtüşmesi önemlidir: düşük yazılmışsa eksik tazminat alırsınız. Aracın pert sayılıp sayılmayacağı, onarım masrafının kasko değerine oranına göre sigorta şirketince belirlenir.", en: "Payment is generally based on the casco value stated in your policy, not on what the car might fetch on the market. If the stated value is too low you will be underpaid, so it should match the current list. Whether a car is written off depends on the repair cost relative to its casco value." } },
                { q: { tr: "Kasko değeri neden her ay değişir?", en: "Why does casco value change every month?" }, a: { tr: "Kasko değer listesi ikinci el araç piyasasındaki fiyat hareketlerini takip edecek şekilde aylık olarak güncellenir. Araç fiyatları enflasyon, döviz kuru, arz-talep dengesi ve model yeniliklerine göre değiştiği için liste de bunlara paralel hareket eder. Buna ek olarak aracınız her yıl bir yaş daha büyüdüğü için değeri zamanla düşme eğilimindedir; bu iki etki poliçe yenilemelerinde birlikte görülür.", en: "The list is updated monthly to track used-car price movements driven by inflation, exchange rates, supply and demand, and model changes. Your car also ages each year, which pushes its value down; both effects show up at renewal." } }
            ]
        }
    },
    // 2. Trafik Sigortası Hesaplama
    {
        id: "trafik-sigortasi",
        slug: "trafik-sigortasi-hesaplama",
        category: "sigorta",
        updatedAt: "2026-07-30",
        name: { tr: "Trafik Sigortası Hesaplama", en: "Traffic Insurance Calculator" },
        h1: { tr: "Trafik Sigortası Tavan Fiyat Hesaplama", en: "Traffic Insurance Ceiling Price Calculator" },
        description: { tr: "Araç türü ve hasarsızlık basamağına göre 2026 trafik sigortası tahmini tavan prim aralığını hesaplayın.", en: "Estimate the 2026 traffic insurance ceiling premium range based on vehicle type and no-claim bonus level." },
        shortDescription: { tr: "Trafik sigortası tavan prim aralığını öğrenin.", en: "Find out the traffic insurance ceiling premium range." },
        relatedCalculators: [
            "kasko-degeri-hesaplama",
            "arac-deger-hesaplama",
            "arac-deger-kaybi-hesaplama",
            "arac-muayene-ucreti-hesaplama"
        ],
        inputs: [
            { id: "aracTuru", name: { tr: "Araç Türü", en: "Vehicle Type" }, type: "select", options: [
                { label: { tr: "Otomobil", en: "Car" }, value: "otomobil" },
                { label: { tr: "Kamyonet", en: "Pickup" }, value: "kamyonet" },
                { label: { tr: "Motosiklet", en: "Motorcycle" }, value: "motosiklet" }
            ], required: true },
            { id: "kademesi", name: { tr: "Hasarsızlık Kademesi (0-8)", en: "No-Claim Bonus Level (0-8)" }, type: "select", options: [
                { label: { tr: "0. Kademe", en: "Level 0" }, value: 0 },
                { label: { tr: "1. Kademe", en: "Level 1" }, value: 1 },
                { label: { tr: "2. Kademe", en: "Level 2" }, value: 2 },
                { label: { tr: "3. Kademe", en: "Level 3" }, value: 3 },
                { label: { tr: "4. Kademe", en: "Level 4" }, value: 4 },
                { label: { tr: "5. Kademe", en: "Level 5" }, value: 5 },
                { label: { tr: "6. Kademe", en: "Level 6" }, value: 6 },
                { label: { tr: "7. Kademe", en: "Level 7" }, value: 7 },
                { label: { tr: "8. Kademe", en: "Level 8" }, value: 8 }
            ], required: true }
        ],
        results: [
            { id: "tavanPrimAralik", label: { tr: "Tahmini Tavan Prim Aralığı (ödenecek tutar değil, yasal üst sınır)", en: "Estimated Ceiling Premium Range (legal maximum, not the amount payable)" }, type: "text" },
            { id: "basamakAciklama", label: { tr: "Seçilen Basamağın Anlamı", en: "What Your Selected Step Means" }, type: "text" },
            { id: "turAralik", label: { tr: "Bu Araç Türünde 0-8 Basamak Aralığı", en: "Full 0-8 Step Range for This Vehicle Type" }, type: "text" }
        ],
        formula: (v) => {
            // Referans tarife: Ocak 2026. SEDDK azami tarifeyi AYLIK günceller.
            // base = ilgili araç türünün 4. basamak (nötr referans) tavan primi.
            const base = v.aracTuru === "otomobil" ? 15160 : v.aracTuru === "kamyonet" ? 19818 : 6180;
            const kademeCarpani: Record<string, number> = {
                "0": 3,
                "1": 2.35,
                "2": 1.9,
                "3": 1.45,
                "4": 1,
                "5": 0.85,
                "6": 0.7,
                "7": 0.55,
                "8": 0.5,
            };
            // İl/bölge tavanı yukarı çeker. Alt sınır ülke geneli referans,
            // üst sınır büyükşehir bandı (Ocak 2026 İstanbul üst tavanına kalibre).
            const BOLGE_UST_KATSAYI = 1.2;
            const basamak = String(v.kademesi);
            const carpan = kademeCarpani[basamak] ?? 1;

            const bicimle = (tutar: number) =>
                tutar.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
            const araligiYaz = (alt: number) =>
                `${bicimle(alt)} – ${bicimle(alt * BOLGE_UST_KATSAYI)} TL`;

            const altSinir = base * carpan;
            const tavanPrimAralik = araligiYaz(altSinir);
            const turAralik = `${bicimle(base * kademeCarpani["8"])} – ${bicimle(base * kademeCarpani["0"] * BOLGE_UST_KATSAYI)} TL`;

            const basamakAciklama =
                carpan > 1
                    ? `${basamak}. basamak, 4. basamak referansına göre primi yaklaşık ${carpan.toLocaleString("tr-TR")} kat artırır. Hasarsız her yıl bir üst basamağa taşır.`
                    : carpan < 1
                        ? `${basamak}. basamak, 4. basamak referansına göre primde yaklaşık %${Math.round((1 - carpan) * 100)} indirim sağlar.`
                        : "4. basamak, indirim ya da artış uygulanmayan referans seviyedir; sisteme yeni giren sürücüler buradan başlar.";

            return { tavanPrimAralik, basamakAciklama, turAralik };
        },
        seo: {
            title: { tr: "Trafik Sigortası Hesaplama 2026 | Tavan Fiyat", en: "Traffic Insurance Calculator 2026 | Ceiling Price" },
            metaDescription: { tr: "Araç türü ve 0-8 hasarsızlık basamağınıza göre 2026 trafik sigortası tavan primini hesaplayın. Basamak sistemi, prim düşürme yolları ve örnek hesap.", en: "Estimate the 2026 traffic insurance ceiling premium by vehicle type and 0-8 no-claim level, with the step system explained." },
            content: {
                tr: `<h3>Trafik Sigortası Nedir?</h3><p>Zorunlu Mali Sorumluluk Sigortası, halk arasındaki adıyla trafik sigortası, bir kazada karşı tarafın uğradığı zararı karşılayan ve trafiğe çıkan her motorlu araç için kanunen zorunlu olan poliçedir. Kendi aracınızdaki hasarı değil, sizin sorumlu olduğunuz üçüncü kişi zararlarını güvence altına alır.</p><p>Bu araç, seçtiğiniz araç türü ve hasarsızlık basamağına göre poliçenizin tavan primini, yani bir sigorta şirketinin standart poliçede talep edebileceği azami tutarı yaklaşık olarak hesaplar. Şirketler tavanın altında teklif verebildiği için ödeyeceğiniz gerçek tutar bu aralığın altında kalabilir.</p><p class="text-sm"><strong>Not:</strong> Hesaplamada kullanılan referans tutarlar <strong>Ocak 2026</strong> tarifesine göredir. SEDDK azami tarifeyi <strong>her ay</strong> güncellediği ve prim aracın tescilli olduğu ile göre değiştiği için sonuç bağlayıcı değildir; güncel tavan primi poliçenizden veya SEDDK duyurularından doğrulayın.</p>`,
                en: "Compulsory motor third-party liability insurance covers damage you cause to others and is legally required for every motor vehicle in Türkiye. This tool estimates the ceiling premium by vehicle type and 0-8 no-claim level; insurers may quote below the ceiling."
            },
            richContent: {
                howItWorks: {
                    tr: "Trafik sigortası primi tek bir sabit fiyat değildir; birkaç faktörün birleşiminden çıkar. En belirleyici olan hasarsızlık basamağıdır: 0'dan 8'e uzanan bu sistemde her hasarsız yıl sizi bir üst basamağa taşır ve primi düşürür, kusurlu her hasar ise basamağınızı geriye düşürerek primi yükseltir. İkinci faktör araç türüdür; otomobil, kamyonet, minibüs ve motosiklet için ayrı tarifeler uygulanır. Üçüncüsü kullanım şeklidir: ticari taksi, servis veya yük taşımacılığı gibi kullanımlar hususi bir otomobile göre daha yüksek risk taşıdığı için daha pahalıdır. Dördüncüsü aracın tescilli olduğu il ve bölgedir; kaza yoğunluğu yüksek büyükşehirlerde primler belirgin biçimde daha yüksektir. Son olarak sürücünün yaşı ve ehliyet süresi gibi profil bilgileri de şirketin kendi risk puanlamasına girer. Bu araç il ve sürücü profili sormaz; hesabı araç türü ile basamak üzerinden kurar ve sonucu tek rakam yerine bir aralık olarak verir. Aralığın alt ucu ülke geneli referans tavanı, üst ucu ise büyükşehir bandını temsil eder; sizin ilinize ve profilinize özel kesin tutar ancak sigorta şirketinin teklifinde netleşir. Poliçe basamağı araca değil ruhsat sahibine bağlıdır, dolayısıyla araç değiştirseniz de hasarsızlık indiriminiz sizinle taşınır.",
                    en: "The premium depends mainly on your 0-8 no-claim step, which rises with each claim-free year and falls after an at-fault claim. Vehicle type, usage (private vs commercial), province of registration and driver profile also affect the price. The step is tied to the registered owner, not the vehicle, so your discount follows you when you change cars."
                },
                formulaText: {
                    tr: "Tavan Prim = Araç Türü Referans Tarifesi × Basamak Katsayısı. Bu araç, seçtiğiniz basamağın ülke geneli referans tavanını alt sınır, büyükşehir bandını üst sınır kabul ederek bir aralık verir; il faktörü ancak sigorta şirketinin size vereceği nihai teklifte tam olarak devreye girdiği için tek bir kesin rakam yerine aralık gösterilir. Tavan prim SEDDK tarafından yayımlanan azami tarife ile sınırlıdır; şirket bu tavanın altında teklif verebilir ancak üzerine çıkamaz. Basamak katsayısı alt basamaklarda 1'in üzerine çıkarak primi artırır, üst basamaklarda 1'in altına inerek indirim sağlar.",
                    en: "Ceiling Premium = Vehicle-Type Reference Tariff × Step Coefficient. The tool shows a range: the nationwide reference ceiling as the lower bound and the metropolitan band as the upper bound, because the province factor only applies fully in the insurer's final quote. The ceiling is capped by the maximum tariff published by SEDDK."
                },
                exampleCalculation: {
                    tr: "Hususi kullanımdaki bir otomobil, 8. basamak örneği (Ocak 2026 tarifesi): Otomobilin 4. basamak referans tavanı 15.160 TL'dir. 8. basamağın katsayısı 0,50 olduğu için alt sınır 15.160 × 0,50 = 7.580 TL çıkar. Büyükşehir bandı bu tutarı yukarı çektiğinden üst sınır yaklaşık 9.096 TL olur ve araç size 7.580 – 9.096 TL aralığını gösterir. Aynı sürücü kusurlu bir kaza sonrası 4. basamağa düşerse katsayı 1,00'e çıkar ve aralık 15.160 – 18.192 TL'ye, 0. basamağa kadar gerilerse katsayı 3,00 ile 45.480 – 54.576 TL'ye yükselir. Aradaki fark, hasarsızlık basamağının prim üzerindeki etkisinin neden bu kadar belirleyici olduğunu gösterir. Bu tutarlar Ocak 2026 tarifesine göredir; SEDDK azami tarifeyi aylık güncellediği için güncel tavanı poliçenizden veya SEDDK duyurularından doğrulayın.",
                    en: "Privately used car, step 8 (January 2026 tariff): the step-4 reference ceiling for cars is 15,160 TRY. With a step-8 coefficient of 0.50 the lower bound is 7,580 TRY, and the metropolitan band puts the upper bound near 9,096 TRY, so the tool shows 7,580 – 9,096 TRY. Dropping to step 4 raises it to 15,160 – 18,192 TRY, and step 0 to 45,480 – 54,576 TRY. These figures follow the January 2026 tariff; SEDDK updates the maximum tariff monthly, so verify the current ceiling."
                },
                miniGuide: {
                    tr: `<h3>Primi Düşürmenin Yolları</h3><p>En büyük tasarruf kalemi hasarsızlık indirimidir. Küçük tutarlı, tamamen kendi kusurunuzdaki çizik ve göçükler için trafik sigortasından hasar açmak çoğu zaman zarar ettirir: alacağınız ödeme bir defalıktır, ancak düşen basamak primi yıllarca yüksek tutar. Onarım bedeli ile basamak kaybının birkaç yıllık maliyetini karşılaştırıp öyle karar verin.</p><p>Poliçeyi tek seferde peşin ödemek de genelde taksitli ödemeye göre daha ucuza gelir. Ayrıca birkaç şirketten teklif almak anlamlı fark yaratır, çünkü hepsi tavan fiyattan satmak zorunda değildir.</p><h3>Yenileme Zamanlaması</h3><p>Poliçenizi bitiş tarihinden önce yenileyin. Sigortasız geçen her gün hem idari para cezası hem de o sırada olası bir kazada zararın tamamını cebinizden ödeme riski demektir. Kesintisiz devam eden poliçe geçmişi basamak ilerlemenizi de korur.</p><h3>Araç Satışı ve Poliçe Devri</h3><p>Aracınızı poliçe süresi dolmadan satarsanız poliçe kendiliğinden alıcıya geçmez. Satıştan sonra sigorta şirketine başvurup poliçeyi iptal ettirebilir ve kalan süreye karşılık gelen primi geri alabilirsiniz; alternatif olarak poliçe alıcı adına devredilebilir. Hasarsızlık basamağınız araçla birlikte gitmez, sizde kalır.</p><h3>Sık Yapılan Hatalar</h3><ul><li>Trafik sigortasının kendi aracındaki hasarı da karşıladığını sanmak</li><li>Küçük hasarlarda gereksiz yere poliçeden faydalanıp basamak kaybetmek</li><li>Araç satışından sonra iptal başvurusu yapmayı unutmak ve kalan primi geri almamak</li><li>Yalnızca tek şirketten teklif alıp tavan fiyata yakın poliçe satın almak</li><li>Ruhsat sahibi ile poliçe sahibini farklı kişi yaparak hasarsızlık geçmişini bölmek</li></ul>`,
                    en: `<h3>Lowering Your Premium</h3><p>Avoid claiming for minor at-fault damage: a one-off payout can cost you years of a higher step. Paying annually rather than in instalments and comparing several insurers usually helps.</p><h3>Renewal and Vehicle Sale</h3><p>Renew before expiry to avoid fines and gaps. If you sell the car, the policy does not transfer automatically; you can cancel it and reclaim the unused premium. Your no-claim step stays with you, not the vehicle.</p>`
                }
            },
            faq: [
                { q: { tr: "Trafik sigortası zorunlu mu?", en: "Is traffic insurance compulsory?" }, a: { tr: "Evet. Karayolları Trafik Kanunu gereği trafiğe çıkan her motorlu araç için zorunludur. Poliçesiz araç kullanmak idari para cezası ve aracın trafikten men edilmesi ile sonuçlanabilir; ayrıca kusurlu olduğunuz bir kazada karşı tarafın tüm zararını kendi cebinizden ödemek zorunda kalırsınız.", en: "Yes. It is legally required for every motor vehicle. Driving without it can lead to fines and impoundment, and you would personally cover all third-party damage in an at-fault accident." } },
                { q: { tr: "Hasarsızlık basamağı nasıl yükselir ve düşer?", en: "How does the no-claim step rise and fall?" }, a: { tr: "Poliçenizi kesintisiz yenilediğiniz ve kusurlu hasar bildiriminde bulunmadığınız her yıl bir üst basamağa çıkarsınız. Kusurlu bir hasar bildirdiğinizde basamağınız geri düşer ve primi artıran bir çarpana denk gelirsiniz. Basamak araca değil ruhsat sahibine bağlı olduğu için araç değiştirdiğinizde indiriminiz sizinle birlikte taşınır.", en: "Each claim-free year with an uninterrupted policy moves you up one step. Reporting an at-fault claim moves you back down. The step belongs to the registered owner, so it follows you across vehicles." } },
                { q: { tr: "Poliçe ortasında aracımı satarsam ne olur?", en: "What happens if I sell my car mid-policy?" }, a: { tr: "Poliçe otomatik olarak alıcıya geçmez. Satış sonrasında sigorta şirketine başvurarak poliçeyi iptal ettirip kullanılmayan süreye karşılık gelen primi iade alabilir veya poliçeyi alıcı adına devredebilirsiniz. Başvuru yapmazsanız kalan prim size geri dönmez. Hasarsızlık basamağınız araçla gitmez, sizde kalır.", en: "The policy does not transfer automatically. You can cancel it and reclaim the unused premium, or transfer it to the buyer. Without an application the remaining premium is not refunded. Your no-claim step stays with you." } },
                { q: { tr: "Trafik sigortası ile kasko arasındaki fark nedir?", en: "What is the difference between traffic insurance and casco?" }, a: { tr: "Trafik sigortası zorunludur ve yalnızca sizin kusurunuzla karşı tarafa verdiğiniz zararı, kanunla belirlenmiş teminat limitleri dahilinde karşılar. Kasko ise isteğe bağlıdır ve kendi aracınızdaki hasarı, hırsızlık, yangın ve doğal afet gibi riskleri kapsar. İkisi birbirinin yerine geçmez; kendi aracınızın güvencesi için kaskoya ayrıca ihtiyaç duyarsınız.", en: "Traffic insurance is compulsory and covers only third-party damage you cause, within statutory limits. Casco is optional and covers damage to your own vehicle, theft, fire and natural disasters. They are not interchangeable." } },
                { q: { tr: "Trafik sigortası primi neden her yıl değişiyor?", en: "Why does the premium change every year?" }, a: { tr: "Azami tarife tutarları enflasyon, artan onarım ve sağlık masrafları ile ülke genelindeki hasar istatistiklerine göre düzenli olarak güncellenir. Bunun yanında sizin basamağınız her yenilemede değiştiği, aracınız yaşlandığı ve şirketlerin risk değerlendirmesi yıldan yıla farklılaştığı için ödediğiniz tutar da değişir.", en: "Maximum tariffs are updated for inflation, repair and medical costs and nationwide claim statistics. Your own step, vehicle age and each insurer's risk assessment also change from year to year." } }
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
        updatedAt: "2026-05-18",
        name: { tr: "İşsizlik Maaşı Hesaplama", en: "Unemployment Benefit Calculator" },
        h1: { tr: "İşsizlik Maaşı ve Süre Hesaplama", en: "Unemployment Benefit and Duration Calculator" },
        description: { tr: "Son 4 aylık brüt maaş ve prim gününe göre 2026 işsizlik maaşı ve alınacak süreyi hesaplayın.", en: "Calculate the 2026 unemployment benefit and duration based on last 4 months' gross salary and premium days." },
        shortDescription: { tr: "İşsizlik maaşı ve süresini öğrenin.", en: "Find out unemployment benefit and duration." },
        relatedCalculators: [],
        inputs: [
            { id: "brutMaas", name: { tr: "Son 4 Aylık Ortalama Brüt Maaş (TL)", en: "Last 4 Months' Avg Gross Salary (TRY)" }, type: "number", min: 0, max: 1000000, step: 100, defaultValue: 33030, required: true, className: "md:w-1/2" },
            { id: "primGunu", name: { tr: "Prim Günü (600 / 900 / 1080)", en: "Premium Days (600 / 900 / 1080)" }, type: "select", defaultValue: 900, options: [
                { label: { tr: "600", en: "600" }, value: 600 },
                { label: { tr: "900", en: "900" }, value: 900 },
                { label: { tr: "1080", en: "1080" }, value: 1080 }
            ], required: true, className: "md:w-1/2" }
        ],
        results: [
            { id: "brutOdenek", label: { tr: "Brüt Ödenek", en: "Gross Benefit" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "damgaVergisi", label: { tr: "Damga Vergisi", en: "Stamp Tax" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "netOdenek", label: { tr: "Net Ödenek", en: "Net Benefit" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "sure", label: { tr: "Alım Süresi", en: "Benefit Duration" }, type: "number", suffix: "ay" },
            { id: "toplamOdeme", label: { tr: "Toplam Alım", en: "Total Benefit" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "tavanDurumu", label: { tr: "Tavan Durumu", en: "Ceiling Status" }, type: "text" }
        ],
        formula: (v) => {
            const ortalamaGelir = Number(v.brutMaas) || 0;
            const tavan = 26424;
            const taban = 13111.72;
            const hesaplananBrutOdenek = ortalamaGelir * 0.40;
            const brutOdenek = Math.min(hesaplananBrutOdenek, tavan);
            const damgaVergisi = brutOdenek * 0.00759;
            const netOdenek = brutOdenek - damgaVergisi;
            const primGunu = Number(v.primGunu) || 0;
            const sureler: Record<number, number> = { 600: 6, 900: 8, 1080: 10 };
            const sure = sureler[primGunu] ?? 0;
            const toplamOdeme = netOdenek * sure;
            const tavanDurumu = hesaplananBrutOdenek > tavan
                ? { tr: "⚠ Tavan uygulandı: 26.424 TL", en: "Ceiling applied: 26,424 TRY" }
                : netOdenek > 0 && netOdenek < taban
                    ? { tr: "ℹ Taban güvencesi: 13.111 TL", en: "Floor assurance: 13,111 TRY" }
                    : { tr: "✅ Tavan uygulanmıyor", en: "Ceiling not applied" };
            return { brutOdenek, damgaVergisi, netOdenek, sure, toplamOdeme, tavanDurumu, aylikNet: netOdenek, toplamSure: sure };
        },
        seo: {
            title: { tr: "İşsizlik Maaşı Hesaplama 2026 | HesapMod", en: "Unemployment Benefit Calculator 2026 | HesapMod" },
            metaDescription: { tr: "Son 4 aylık brüt maaş ve prim gününe göre 2026 işsizlik maaşı ve alınacak süreyi hesaplayın. İŞKUR şartları ve tavan-taban limitleriyle güncel.", en: "Calculate the 2026 unemployment benefit and duration. Updated with İŞKUR requirements and ceiling/floor limits." },
            content: {
                tr: `<h3>İşsizlik Maaşı Nasıl Hesaplanır?</h3><p>İşsizlik maaşı, sigortalının işten ayrılmadan önceki son 4 aylık prime esas brüt kazanç ortalamasının <strong>%40'ı</strong> alınarak hesaplanır. Bu brüt ödenek, 2026 yılı için brüt asgari ücretin %80'i olan <strong>26.424 TL</strong> tavanını geçemez. Hesaplanan brüt işsizlik ödeneğinden yalnızca <strong>%0,759 damga vergisi</strong> kesilir; gelir vergisi, SGK primi veya işsizlik primi kesintisi yapılmaz.</p><p>Örneğin son 4 aylık ortalama brüt kazanç 55.000 TL ise brüt ödenek 22.000 TL olur, damga vergisi sonrası net ödeme yaklaşık 21.833,02 TL'ye iner. Ortalama brüt kazanç 80.000 TL olduğunda %40 hesabı 32.000 TL verse de tavan nedeniyle brüt ödeme 26.424 TL ile sınırlanır ve net tutar yaklaşık 26.223,44 TL olur.</p><h3>2026 Tavan ve Taban Değerleri</h3><table><thead><tr><th></th><th>Tutar</th><th>Dayanak</th></tr></thead><tbody><tr><td>Brüt tavan</td><td>26.424 TL</td><td>Asgari ücretin %80'i</td></tr><tr><td>Tahmini net tavan</td><td>~26.223 TL</td><td>Damga vergisi sonrası</td></tr><tr><td>Tahmini net taban</td><td>~13.111 TL</td><td>2026 tahmini</td></tr><tr><td>Damga vergisi oranı</td><td>%0,759</td><td>488 Seri No'lu VUK</td></tr></tbody></table><p>Tablodaki tavan, yüksek ücretli çalışanlarda hesaplanan ödeneği sınırlandırır. Taban ise asgari ücret seviyesinde çalışan tam zamanlı sigortalı için damga vergisi sonrası oluşan yaklaşık net tutarı ifade eder; kesin ödeme İŞKUR değerlendirmesine ve başvuru sonucuna göre belirlenir.</p><h3>İşsizlik Maaşı Kaç Ay Alınır?</h3><p>Ödeme süresi son 3 yıldaki işsizlik sigortası prim gününe göre belirlenir. <strong>600 gün</strong> primi olanlar 180 gün / 6 ay, <strong>900 gün</strong> primi olanlar 240 gün / 8 ay, <strong>1080 gün</strong> primi olanlar 300 gün / 10 ay işsizlik ödeneği alabilir. 600 günden az prim varsa temel süre şartı sağlanmadığı için hak sahipliği oluşmayabilir.</p><h3>Başvuru Süreci</h3><ol><li><strong>Adım 1:</strong> İşten çıkıştan sonra 30 gün içinde başvurun. Mücbir sebep yoksa gecikilen süre toplam hak sahipliği süresinden düşebilir.</li><li><strong>Adım 2:</strong> Başvuruyu e-Devlet, İŞKUR internet şubesi, İŞKUR Mobil veya en yakın İŞKUR şubesi üzerinden yapın.</li><li><strong>Adım 3:</strong> Gerekli belgeleri hazır tutun: SGK hizmet dökümü, kimlik bilgileri ve ödeme için doğru IBAN bilgisi.</li><li><strong>Adım 4:</strong> İlk ödeme çoğu durumda başvurunun sonuçlandırılmasını izleyen ödeme döneminde, yaklaşık 30 gün sonra başlar.</li><li><strong>Adım 5:</strong> Ödenek alırken İŞKUR kaydınızı ve aktif iş arayışı durumunuzu takip edin; Kurumun çağrı ve tekliflerini dikkate alın.</li><li><strong>Adım 6:</strong> Yeni iş bulduğunuzda veya gelir getirici faaliyete başladığınızda İŞKUR'a bildirim yapın.</li></ol><h3>Kimler Hak Kazanabilir?</h3><p>Temel çerçeve üç ana şarttan oluşur: kendi istek ve kusuru dışında işsiz kalmak, hizmet akdinin sona ermesinden önceki son 120 gün hizmet akdine tabi olmak ve son 3 yılda en az 600 gün işsizlik sigortası primi ödemiş olmak. Sayfanın üstündeki <strong>Hak Ediyor muyum?</strong> kontrolü bu üç şartı hızlıca ön değerlendirmenize yardımcı olur.</p><p>Kendi isteğiyle istifa eden kişiler kural olarak işsizlik ödeneği alamaz. Ancak ücretin ödenmemesi, mobbing, sağlık sebebi, işverenin esaslı sözleşme değişikliği gibi haklı fesih iddialarında durum ayrıca değerlendirilir; bu tür dosyalarda İŞKUR kaydı, çıkış kodu ve gerektiğinde hukuki süreç sonucu belirleyici olabilir.</p><h3>Ödeme Ne Zaman ve Nasıl Yapılır?</h3><p>İŞKUR açıklamalarına göre işsizlik ödeneği başvuruları başvuruyu izleyen ayın sonuna kadar sonuçlandırılır ve ödeme aylık olarak yapılır. Ödemeler bildirilen IBAN üzerinden, IBAN yoksa PTTBank aracılığıyla yapılabilir. IBAN bilgilerinin ad-soyad ile uyumlu ve doğru olması ödeme gecikmesini önlemek için önemlidir.</p><h3>Ödenek Hangi Durumlarda Kesilebilir?</h3><p>İŞKUR tarafından teklif edilen, mesleğe uygun ve önceki iş koşullarına yakın bir işin haklı neden olmadan reddedilmesi, kayıt dışı çalışıldığının tespit edilmesi, emeklilik aylığı bağlanması veya yeni bir işe başlanmasına rağmen bildirim yapılmaması ödeneğin kesilmesine yol açabilir. Part-time, serbest meslek veya kısa süreli çalışma gibi durumlarda mutlaka İŞKUR'a bilgi verilmelidir.</p><div class="not-prose mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5"><h3 class="mt-0 text-xl font-bold text-slate-900">Editöryal Güvence</h3><p class="text-sm leading-6 text-slate-700">Bu sayfadaki hesaplama mantığı 4447 Sayılı İşsizlik Sigortası Kanunu, İŞKUR'un işsizlik ödeneği açıklamaları ve 2026 tavan/taban parametreleri dikkate alınarak hazırlanmıştır. İçerik genel bilgilendirme amaçlıdır; kesin hak sahipliği ve ödeme tutarı İŞKUR tarafından belirlenir.</p><ul class="text-sm leading-6 text-slate-700"><li>Kaynak: <a href="https://www.mevzuat.gov.tr" target="_blank" rel="nofollow noopener" class="text-blue-600 underline underline-offset-4">4447 Sayılı İşsizlik Sigortası Kanunu</a></li><li>Resmi başvuru ve şartlar: <a href="https://www.iskur.gov.tr/is-arayan/issizlik-sigortasi/issizlik-odenegi/" target="_blank" rel="nofollow noopener" class="text-blue-600 underline underline-offset-4">İŞKUR İşsizlik Ödeneği</a></li></ul><p class="mb-0 text-sm font-semibold text-slate-800">Son Güncelleme: Mayıs 2026 | Muhasebe Ekibi</p></div>`,
                en: "Unemployment benefit is calculated as 40% of the last 4 months' average gross salary, with a ceiling of 80% of the minimum wage. Stamp tax is deducted. Duration depends on premium days: 6, 8, or 10 months."
            },
            faq: [
                { q: { tr: "İşsizlik maaşı nasıl hesaplanır?", en: "How is unemployment benefit calculated?" }, a: { tr: "Son 4 aylık prime esas brüt kazanç ortalamasının %40'ı alınır, 2026 için 26.424 TL brüt tavan uygulanır ve yalnızca %0,759 damga vergisi düşülür.", en: "40% of gross salary, ceiling applied, stamp tax deducted." } },
                { q: { tr: "İşsizlik maaşı kaç ay alınır?", en: "For how many months is unemployment benefit paid?" }, a: { tr: "Son 3 yıldaki prim gününe göre 600 gün için 6 ay, 900 gün için 8 ay, 1080 gün ve üzeri için 10 ay ödeme alınabilir.", en: "6, 8, or 10 months depending on premium days." } },
                { q: { tr: "Kendi istifam işsizlik maaşını etkiler mi?", en: "Does voluntary resignation affect unemployment benefit?" }, a: { tr: "Evet. Kural olarak kendi isteğiyle istifa eden çalışan işsizlik ödeneği alamaz. Haklı fesih iddiası varsa çıkış kodu, belgeler ve İŞKUR değerlendirmesi ayrıca önem kazanır.", en: "Yes. Voluntary resignation generally prevents eligibility unless a justified termination is assessed separately." } },
                { q: { tr: "Part-time çalışırsam ödenek kesilir mi?", en: "Will the benefit stop if I work part-time?" }, a: { tr: "Gelir getirici çalışma veya sigortalı işe başlama durumunda İŞKUR'a bildirim yapılmalıdır. Kayıt dışı veya bildirimsiz çalışma ödeneğin kesilmesine ve geri ödeme riskine yol açabilir.", en: "Any income-generating or insured work should be reported to İŞKUR; unreported work may stop the benefit." } },
                { q: { tr: "Yurt dışında çalışma süresi sayılır mı?", en: "Does work abroad count?" }, a: { tr: "İşsizlik ödeneğinde Türkiye'de bildirilen işsizlik sigortası prim günleri esastır. Yurt dışı çalışmaların etkisi ülke, sosyal güvenlik anlaşması ve SGK/İŞKUR kayıtlarına göre ayrıca değerlendirilmelidir.", en: "Eligibility is mainly based on unemployment insurance premiums reported in Türkiye; foreign work depends on records and agreements." } },
                { q: { tr: "İşsizlik maaşı alırken serbest meslek yapabilir miyim?", en: "Can I freelance while receiving unemployment benefit?" }, a: { tr: "Serbest meslek, şirket ortaklığı veya düzenli gelir doğuran faaliyetler hak sahipliğini etkileyebilir. Ödenek alırken bu tür faaliyetleri İŞKUR'a bildirmeniz gerekir.", en: "Freelance or self-employment income may affect eligibility and should be reported to İŞKUR." } }
            ]
        }
    }
];
