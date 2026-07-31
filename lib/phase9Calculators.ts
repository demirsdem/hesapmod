// Phase 9: SGK, MEB, TÜVTÜRK ve Serbest Meslek Araçları
// HesapMod - 2026
import { CalculatorConfig } from "./calculator-types";

export const phase9Calculators: CalculatorConfig[] = [
    // 1. Emeklilik Hesaplama (düzenlendi)
    {
        id: "emeklilik",
        slug: "emeklilik-hesaplama",
        category: "muhasebe",
        updatedAt: "2026-04-12",
        name: { tr: "Emeklilik Hesaplama", en: "Retirement Calculator" },
        h1: { tr: "Ne Zaman Emekli Olurum? (SGK EYT)", en: "When Can I Retire? (SGK EYT)" },
        description: { tr: "Cinsiyet, doğum yılı, ilk sigorta girişi ve prim gününe göre SGK emeklilik yaşınızı ve eksik priminizi hesaplayın.", en: "Calculate your SGK retirement age and missing premium days based on gender, birth year, first insurance year, and premium days." },
        shortDescription: { tr: "SGK emeklilik yaşınızı öğrenin.", en: "Find out your SGK retirement age." },
        relatedCalculators: [],
        inputs: [
            { id: "cinsiyet", name: { tr: "Cinsiyet", en: "Gender" }, type: "select", options: [
                { label: { tr: "Kadın", en: "Female" }, value: "kadin" },
                { label: { tr: "Erkek", en: "Male" }, value: "erkek" }
            ], required: true },
            { id: "dogumYili", name: { tr: "Doğum Yılı", en: "Birth Year" }, type: "number", min: 1940, max: 2026, required: true },
            { id: "ilkGirisYili", name: { tr: "İlk Sigorta Giriş Yılı", en: "First Insurance Year" }, type: "number", min: 1960, max: 2026, required: true },
            { id: "primGun", name: { tr: "Mevcut Prim Günü", en: "Current Premium Days" }, type: "number", min: 0, max: 15000, required: true }
        ],
        results: [
            { id: "hedefYas", label: { tr: "Hedef Yaş", en: "Target Age" }, type: "text" },
            { id: "gerekenPrim", label: { tr: "Gereken Prim", en: "Required Premium" }, type: "number" },
            { id: "eksikPrim", label: { tr: "Eksik Prim", en: "Missing Premium" }, type: "number" },
            { id: "emeklilikDurumu", label: { tr: "Emeklilik Durumu", en: "Retirement Status" }, type: "text" }
        ],
        formula: (v) => {
            const cinsiyet = v.cinsiyet;
            const dogumYili = Number(v.dogumYili) || 0;
            const ilkGirisYili = Number(v.ilkGirisYili) || 0;
            const primGun = Number(v.primGun) || 0;
            let hedefYas = "-", gerekenPrim = 0, eksikPrim = 0, emeklilikDurumu = "-";
            if (ilkGirisYili < 1999) {
                hedefYas = "Yaş Şartı Yok (EYT)";
                gerekenPrim = 5000;
                if (primGun >= gerekenPrim) emeklilikDurumu = "EYT ile emekli olabilirsiniz.";
                else emeklilikDurumu = "Eksik prim tamamlanmalı.";
            } else if (ilkGirisYili < 2008) {
                hedefYas = cinsiyet === "kadin" ? "58" : "60";
                gerekenPrim = 7000;
                if (primGun >= gerekenPrim && (new Date().getFullYear() - dogumYili) >= Number(hedefYas)) emeklilikDurumu = "Emekli olabilirsiniz.";
                else emeklilikDurumu = "Şartlar henüz sağlanmadı.";
            } else {
                hedefYas = cinsiyet === "kadin" ? "58" : "60";
                gerekenPrim = 7200;
                if (primGun >= gerekenPrim && (new Date().getFullYear() - dogumYili) >= Number(hedefYas)) emeklilikDurumu = "Emekli olabilirsiniz.";
                else emeklilikDurumu = "Şartlar henüz sağlanmadı.";
            }
            eksikPrim = Math.max(gerekenPrim - primGun, 0);
            return { hedefYas, gerekenPrim, eksikPrim, emeklilikDurumu };
        },
        seo: {
            title: { tr: "Ne Zaman Emekli Olurum? (SGK EYT Emeklilik Hesaplama 2026) | HesapMod", en: "When Can I Retire? (SGK EYT Retirement Calculator 2026) | HesapMod" },
            metaDescription: { tr: "2026 SGK emeklilik şartları ve EYT hesaplaması.", en: "2026 SGK retirement conditions and EYT calculation." },
            content: {
                tr: `<h3>SGK Emeklilik Şartları</h3><p>2026 yılında emeklilik yaşı ve prim gün şartları, ilk sigorta giriş tarihinize göre değişir. 8 Eylül 1999 öncesi EYT, 1999-2008 arası ve sonrası için farklı yaş ve prim günleri uygulanır.</p><h3>Kademeli Emeklilik Tablosu</h3><p>Kadınlarda genellikle 58, erkeklerde 60 yaş ve 7000-7200 prim günü gereklidir. Eksik prim günleri tamamlanmadan emekli olunamaz.</p><h3>Kaynaklar</h3><ul><li>SGK</li><li>Resmi Gazete</li></ul>`,
                en: "Retirement age and premium day requirements depend on your first insurance date. EYT applies for those before 1999. Women: 58, Men: 60 years, 7000-7200 days required."
            },
            faq: [
                { q: { tr: "Staj sigortası emeklilik başlangıcı sayılır mı?", en: "Does internship insurance count as retirement start?" }, a: { tr: "Hayır, staj sigortası emeklilikte başlangıç sayılmaz.", en: "No, internship insurance does not count." } },
                { q: { tr: "Erkeklerde ve kadınlarda emeklilik yaşı kaçtır?", en: "What is the retirement age for men and women?" }, a: { tr: "Kadın: 58, Erkek: 60 yaş (2008 sonrası girişte).", en: "Women: 58, Men: 60 (for post-2008 entries)." } }
            ]
        }
    },
    // 2. Serbest Meslek Makbuzu Hesaplama (düzenlendi)
    {
        id: "serbest-meslek-makbuzu",
        slug: "serbest-meslek-makbuzu-hesaplama",
        category: "muhasebe",
        updatedAt: "2026-04-12",
        name: { tr: "Serbest Meslek Makbuzu Hesaplama", en: "Freelance Invoice Calculator" },
        h1: { tr: "Serbest Meslek Makbuzu (SMM) Hesaplama", en: "Freelance Invoice (SMM) Calculator" },
        description: { tr: "SMM stopaj, KDV ve net ele geçen tutarı hesaplayın.", en: "Calculate SMM withholding, VAT, and net amount." },
        shortDescription: { tr: "SMM stopaj ve KDV hesaplayın.", en: "Calculate SMM withholding and VAT." },
        relatedCalculators: [],
        inputs: [
            { id: "tip", name: { tr: "Tutar Tipi", en: "Amount Type" }, type: "select", options: [
                { label: { tr: "Brüt", en: "Gross" }, value: "brut" },
                { label: { tr: "Net", en: "Net" }, value: "net" }
            ], required: true },
            { id: "tutar", name: { tr: "Tutar", en: "Amount" }, type: "number", min: 1, max: 1000000, required: true }
        ],
        results: [
            { id: "brut", label: { tr: "Brüt Tutar", en: "Gross Amount" }, type: "number" },
            { id: "kdv", label: { tr: "KDV %20", en: "VAT 20%" }, type: "number" },
            { id: "stopaj", label: { tr: "Stopaj %20", en: "Withholding 20%" }, type: "number" },
            { id: "toplam", label: { tr: "Tahsil Edilecek Toplam", en: "Total to Collect" }, type: "number" },
            { id: "net", label: { tr: "Net Ele Geçen", en: "Net Amount" }, type: "number" }
        ],
        formula: (v) => {
            const tip = v.tip;
            const tutar = Number(v.tutar) || 0;
            let brut = 0, kdv = 0, stopaj = 0, toplam = 0, net = 0;
            if (tip === "brut") {
                brut = tutar;
                kdv = brut * 0.2;
                stopaj = brut * 0.2;
                toplam = brut + kdv;
                net = brut - stopaj;
            } else {
                brut = tutar / 0.8;
                kdv = brut * 0.2;
                stopaj = brut * 0.2;
                toplam = brut + kdv;
                net = brut - stopaj;
            }
            return { brut, kdv, stopaj, toplam, net };
        },
        seo: {
            title: { tr: "Serbest Meslek Makbuzu (SMM) Hesaplama 2026 (Brüt/Net) | HesapMod", en: "Freelance Invoice (SMM) Calculator 2026 (Gross/Net) | HesapMod" },
            metaDescription: { tr: "2026 serbest meslek makbuzu stopaj ve KDV hesaplaması.", en: "2026 freelance invoice withholding and VAT calculation." },
            content: {
                tr: `<h3>Serbest Meslek Makbuzu Hesaplama</h3><p>2026 yılında serbest meslek makbuzunda %20 stopaj ve %20 KDV uygulanır. Brüt, net veya tahsil edilen tutara göre hesaplama yapılır.</p><h3>KDV ve Stopaj</h3><p>KDV, brüt tutarın %20'si olarak eklenir. Stopaj ise brüt tutarın %20'si olarak kesilir.</p><h3>Kaynaklar</h3><ul><li>GİB</li><li>Resmi Gazete</li></ul>`,
                en: "In 2026, 20% withholding and 20% VAT are applied to freelance invoices. Calculation is based on gross, net, or collected amount."
            },
            faq: [
                { q: { tr: "Serbest meslek makbuzunda stopajı kim öder?", en: "Who pays the withholding on freelance invoices?" }, a: { tr: "Stopajı işveren öder.", en: "The employer pays the withholding." } },
                { q: { tr: "SMM keserken KDV tevkifatı uygulanır mı?", en: "Is VAT withholding applied when issuing SMM?" }, a: { tr: "Genellikle hayır, ancak bazı durumlarda uygulanabilir.", en: "Usually no, but may apply in some cases." } }
            ]
        }
    },
    // 3. Araç Muayene Ücreti Hesaplama (düzenlendi)
    {
        id: "arac-muayene-ucreti",
        slug: "arac-muayene-ucreti-hesaplama",
        category: "tasit-ve-vergi",
        updatedAt: "2026-07-31",
        name: { tr: "Araç Muayene Ücreti Hesaplama", en: "Vehicle Inspection Fee Calculator" },
        h1: { tr: "Araç Muayene Ücreti ve Gecikme Cezası Hesaplama", en: "Vehicle Inspection Fee & Late Penalty Calculator" },
        description: { tr: "Araç türü ve gecikilen ay sayısına göre 2026 resmî tarifesiyle araç muayene ücretini ve gecikme cezasını hesaplayın.", en: "Calculate the vehicle inspection fee and late penalty using the 2026 official tariff, based on vehicle type and months delayed." },
        shortDescription: { tr: "Araç muayene ücretini ve gecikme bedelini öğrenin.", en: "Find out the vehicle inspection fee and late charge." },
        relatedCalculators: [
            "trafik-sigortasi-hesaplama",
            "kasko-degeri-hesaplama",
            "arac-deger-hesaplama",
            "arac-deger-kaybi-hesaplama"
        ],
        inputs: [
            { id: "aracTuru", name: { tr: "Araç Türü", en: "Vehicle Type" }, type: "select", options: [
                { label: { tr: "Otomobil/Minibüs", en: "Car/Minibus" }, value: "otomobil" },
                { label: { tr: "Traktör/Motosiklet", en: "Tractor/Motorcycle" }, value: "traktor" },
                { label: { tr: "Otobüs/Kamyon", en: "Bus/Truck" }, value: "otobus" }
            ], required: true },
            { id: "gecikme", name: { tr: "Gecikilen Ay Sayısı", en: "Delayed Months" }, type: "number", min: 0, max: 24, required: true }
        ],
        results: [
            { id: "temelUcret", label: { tr: "Temel Muayene Ücreti", en: "Base Fee" }, type: "number" },
            { id: "gecikmeCezasi", label: { tr: "Gecikme Cezası", en: "Penalty" }, type: "number" },
            { id: "toplamTutar", label: { tr: "Toplam Ödenecek Tutar", en: "Total Amount" }, type: "number" }
        ],
        formula: (v) => {
            const fiyatlar: Record<string, number> = { otomobil: 3288.84, traktor: 1674.53, otobus: 4445.60 };
            const aracTuru = typeof v.aracTuru === 'string' && fiyatlar[v.aracTuru] ? v.aracTuru : 'otomobil';
            const temelUcret = fiyatlar[aracTuru];
            const gecikme = Math.min(24, Math.max(0, Math.ceil(Number(v.gecikme) || 0)));
            const gecikmeCezasi = temelUcret * 0.05 * gecikme;
            const toplamTutar = temelUcret + gecikmeCezasi;
            return { temelUcret, gecikmeCezasi, toplamTutar };
        },
        seo: {
            title: { tr: "Araç Muayene Ücreti Hesaplama 2026 | Gecikme Cezası", en: "Vehicle Inspection Fee Calculator 2026 | Late Penalty" },
            metaDescription: { tr: "2026 resmî tarifesiyle araç muayene ücretini ve gecikilen her ay için eklenen %5 gecikme bedelini hesaplayın. Araç türüne göre güncel ücretler ve örnek hesaplama.", en: "Calculate the 2026 vehicle inspection fee and the 5% monthly late charge. Current fees by vehicle type with a worked example." },
            content: {
                tr: `<h3>Araç Muayenesi Nedir, Ne Sıklıkla Yapılır?</h3><p>Araç muayenesi, trafiğe çıkan araçların fren, aydınlatma, direksiyon, lastik, egzoz ve gövde güvenliği yönünden yetkili istasyonlarda düzenli olarak kontrol edilmesidir ve Karayolları Trafik Kanunu gereği zorunludur. Muayene periyodu araç türüne ve yaşına göre değişir: otomobiller ilk muayeneye kural olarak trafiğe çıkışından üç yıl sonra girer, sonrasında iki yılda bir muayene edilir. Ticari taksi, minibüs ve otobüs gibi yolcu taşıyan araçlar ile kamyon ve çekici gibi ağır vasıtalarda periyot daha kısadır, motosiklet ve traktörler için ise ayrı bir takvim uygulanır. Muayene hizmeti, yetkili araç muayene istasyonları tarafından verilir; bu yetki 2027 yılına kadar TÜVTÜRK'te bulunmaktadır.</p><p>Bu araç, seçtiğiniz araç türüne karşılık gelen <strong>resmî muayene ücretini</strong> ve muayenesini geciktirdiyseniz gecikilen ay sayısına göre eklenen <strong>gecikme bedelini</strong> hesaplar. Ücretler serbest fiyat değildir; her yıl Ocak ayında Resmî Gazete'de yayımlanan yeniden değerleme oranına göre güncellenen resmî tarifeyle belirlenir. Buradaki tutarlar <strong>2026 tarifesine göredir</strong> ve yıl değiştiğinde yenilenir. Egzoz gazı emisyon ölçümü bu ücrete dahil değildir, ayrıca ödenir.</p>`,
                en: "Vehicle inspection is a legally required periodic safety check covering brakes, lighting, steering, tyres, emissions and body condition. Cars are first inspected three years after registration and every two years thereafter, while commercial passenger vehicles and heavy goods vehicles follow shorter cycles. Inspections are carried out by authorised stations — a mandate held by TÜVTÜRK until 2027. This tool returns the official fee for your vehicle type plus the late charge added for each month of delay. Fees are set by an official tariff updated each January by the revaluation rate; the figures here reflect the 2026 tariff. Exhaust emission testing is charged separately."
            },
            richContent: {
                howItWorks: {
                    tr: "Hesaplama iki bilgiyle çalışır: aracınızın resmî tarife kategorisi ve varsa gecikilen ay sayısı. Resmî tarife araçları üç ücret grubuna ayırır ve hesaplama bu gruplandırmayı esas alır. Buradaki \"Otomobil/Minibüs\" seçeneği yalnızca otomobil ve minibüsü değil, aynı ücrete tabi olan kamyonet, arazi taşıtı ve SUV, özel amaçlı taşıt, römork ve yarı römorkları da kapsar; bu araçlardan biri için hesap yapıyorsanız bu seçeneği işaretlemelisiniz. \"Otobüs/Kamyon\" seçeneği otobüsün yanı sıra kamyon, çekici ve tankeri, \"Traktör/Motosiklet\" seçeneği ise traktör, motosiklet ve motorlu bisikleti temsil eder. Ücret araç yaşına, motor hacmine veya markaya göre değişmez; yalnızca bu kategori belirleyicidir.\n\nİkinci girdi gecikilen ay sayısıdır. Muayene süresi dolduktan sonra geçen her ay için temel ücretin yüzde beşi oranında gecikme bedeli eklenir ve bu bedel taban ücret üzerinden hesaplanır, birikimli faiz gibi katlanarak artmaz. Kısmi aylar tam ay sayılır: bir günlük gecikme de bir aylık gecikme gibi değerlendirilir, bu nedenle sürenin dolduğu günü bir gün geçirmek doğrudan bir aylık bedel doğurur. Sonuçta gösterilen toplam, temel ücret ile gecikme bedelinin toplamıdır. Egzoz gazı emisyon ölçümü bu toplama dahil değildir; ayrı bir hizmet olarak kendi tarifesi üzerinden ücretlendirilir. Kartlı ödemelerde hizmet sağlayıcı kaynaklı komisyon da bu hesabın dışındadır.",
                    en: "The calculation uses two inputs: your vehicle's official tariff category and the number of months delayed, if any. The tariff groups vehicles into three fee bands. The \"Car/Minibus\" option covers not only cars and minibuses but also vans, off-road vehicles and SUVs, special-purpose vehicles, trailers and semi-trailers, which pay the same fee. \"Bus/Truck\" covers buses, lorries, tractor units and tankers; \"Tractor/Motorcycle\" covers tractors, motorcycles and mopeds. The fee does not vary by vehicle age, engine size or make — only the category matters.\n\nThe second input is the number of months delayed. For each month past the due date, five percent of the base fee is added. It is calculated on the base fee and does not compound. Partial months count as full months, so being a single day late already triggers one month's charge. The total shown is the base fee plus the late charge. Exhaust emission testing is not included and is charged separately under its own tariff, as is any card-payment commission."
                },
                formulaText: {
                    tr: "Toplam Tutar = Temel Muayene Ücreti + (Temel Ücret × %5 × Gecikilen Ay Sayısı). Temel ücret araç türüne göre sabittir ve resmî tarifeden gelir. 2026 tarifesine göre otomobil, minibüs, kamyonet, arazi taşıtı, özel amaçlı taşıt, römork ve yarı römork için 3.288,84 TL; otobüs, kamyon, çekici ve tanker için 4.445,60 TL; traktör, motosiklet ve motorlu bisiklet için 1.674,53 TL uygulanır. Gecikme bedeli her zaman temel ücret üzerinden hesaplanır ve gecikilen ay sayısıyla doğru orantılı olarak artar; örneğin üç aylık gecikme temel ücretin yüzde on beşi kadar ek bedel demektir.\n\nBu rakamlar serbestçe belirlenen fiyatlar değil, resmî ücret tarifesidir ve her yıl Ocak ayında Resmî Gazete'de yayımlanan yeniden değerleme oranına göre güncellenir. Buradaki tutarlar 2026 yılı için geçerlidir; takvim yılı değiştiğinde tarife yenileneceği için güncel ücreti muayene öncesinde yetkili istasyonun resmî kanallarından teyit etmek gerekir. Egzoz gazı emisyon ölçümü ayrı tarifeye tabidir ve bu formülün dışındadır.",
                    en: "Total = Base Inspection Fee + (Base Fee × 5% × Months Delayed). The base fee is fixed by vehicle category under the official tariff. For 2026: 3,288.84 TRY for cars, minibuses, vans, off-road vehicles, special-purpose vehicles, trailers and semi-trailers; 4,445.60 TRY for buses, lorries, tractor units and tankers; 1,674.53 TRY for tractors, motorcycles and mopeds. The late charge is always computed on the base fee and rises in direct proportion to the months delayed — three months means an extra fifteen percent.\n\nThese are official tariff figures, not freely set prices, and they are revised each January by the revaluation rate published in the Official Gazette. The amounts here apply to 2026; confirm the current fee through the authorised station's official channels before your inspection. Exhaust emission testing falls under a separate tariff and is outside this formula."
                },
                exampleCalculation: {
                    tr: "2026 tarifesine göre bir otomobil için hesap şu adımlarla ilerler. Önce araç türü belirlenir: otomobil, resmî tarifede kamyonet ve arazi taşıtlarıyla aynı grupta yer alır ve bu grubun temel muayene ücreti 3.288,84 TL'dir. Diyelim ki muayene süresi Mayıs ayında doldu ancak araç Temmuz ayında istasyona götürüldü; bu durumda iki aylık gecikme söz konusudur. İkinci adımda gecikme bedeli hesaplanır: her ay için temel ücretin yüzde beşi eklendiğinden iki ay toplam yüzde on eder, yani 3.288,84 × 0,05 × 2 = 328,88 TL. Son adımda iki tutar toplanır: 3.288,84 + 328,88 = 3.617,72 TL ödenecek toplam muayene bedeli.\n\nAynı araç zamanında muayeneye götürülseydi yalnızca 3.288,84 TL ödenecekti; iki aylık gecikmenin maliyeti 328,88 TL'dir. Gecikme altı aya çıksaydı ek bedel yüzde otuza yükselerek 986,65 TL olacak ve toplam 4.275,49 TL'ye çıkacaktı. Burada kritik ayrıntı, kısmi ayların tam ay sayılmasıdır: sürenin dolmasından yalnızca bir gün sonra gidilse dahi bir aylık, yani 164,44 TL'lik bedel doğar. Bu tutarlara egzoz gazı emisyon ölçümü dahil değildir; o ölçüm kendi tarifesi üzerinden ayrıca ödenir. Rakamlar 2026 tarifesine göredir ve yıl başında güncellenir.",
                    en: "Under the 2026 tariff, for a car: the base fee for its group — which also covers vans and off-road vehicles — is 3,288.84 TRY. Suppose the due date fell in May but the car was taken in July, a two-month delay. At five percent per month, two months add ten percent: 3,288.84 × 0.05 × 2 = 328.88 TRY. The total is therefore 3,288.84 + 328.88 = 3,617.72 TRY.\n\nOn time, only 3,288.84 TRY would have been due, so the delay cost 328.88 TRY. At six months the surcharge would reach thirty percent, or 986.65 TRY, for a total of 4,275.49 TRY. Note that partial months count in full: arriving a single day late already incurs one month's charge of 164.44 TRY. Exhaust emission testing is not included in these figures and is paid separately under its own tariff. Amounts reflect the 2026 tariff and are revised at the start of each year."
                },
                miniGuide: {
                    tr: `<h3>Muayene Periyodu Araç Yaşına Göre Değişir</h3><p>Otomobiller kural olarak trafiğe çıkışından üç yıl sonra ilk muayenesine girer ve ardından iki yılda bir muayene edilir. Ticari taksi, dolmuş, minibüs ve otobüs gibi yolcu taşıyan araçlar ile kamyon, çekici ve tanker gibi ağır vasıtalarda periyot daha kısadır ve genellikle yıllıktır. Motosiklet, motorlu bisiklet ve traktörler için ayrı bir takvim uygulanır. Aracınızın bir sonraki muayene tarihi ruhsatınızda ve e-Devlet üzerindeki araç sorgulama ekranlarında görünür; periyot araç sınıfına göre değiştiği için kendi aracınızın tarihini bu kayıtlardan doğrulamak en sağlıklısıdır.</p><h3>Randevu ve Gecikme Bedelinden Kaçınma</h3><p>Muayene istasyonlarına randevuyla gitmek yoğun dönemlerde bekleme süresini belirgin biçimde kısaltır; randevu, yetkili istasyonun çağrı merkezi ve internet kanalları üzerinden alınabilir. Gecikme bedeli açısından kritik nokta, kısmi ayların tam ay sayılmasıdır: süre dolduktan bir gün sonra gitmek bile bir aylık bedel doğurur. Bu nedenle randevuyu sürenin dolmasına birkaç hafta kala almak, hem yoğunluk hem de gecikme riski açısından güvenli tarafta kalmayı sağlar. Muayene süresi dolmuş bir araçla trafiğe çıkmak ayrıca idari yaptırım konusudur ve bu hesaplamadaki gecikme bedelinden bağımsız bir kalemdir.</p><h3>Ücretsiz Tekrar Muayene Hakkı</h3><p>Muayenede ağır kusur tespit edilirse araç muayeneden geçemez ve tespit edilen eksikliklerin giderilip aracın yeniden getirilmesi gerekir. Uygulamada, ilk muayeneden itibaren belirli bir süre içinde yapılan bir kez tekrar muayene için ayrıca ücret alınmaz; bu süre aşılırsa veya tekrar sayısı bir defayı geçerse yeniden ücret doğar. Ücretsiz tekrar hakkının süresi ve kapsamı değişebildiğinden, muayeneden geçemediğinizde size verilen raporda yazan tarihi ve koşulları kontrol etmek gerekir.</p><h3>Egzoz Ölçümü Ayrı Bir Hizmettir</h3><p>Egzoz gazı emisyon ölçümü, araç muayenesinden ayrı bir işlemdir ve kendi tarifesi üzerinden ayrıca ücretlendirilir. Bu sayfadaki hesaplama yalnızca muayene ücreti ile gecikme bedelini kapsar; ödeyeceğiniz toplam tutar, egzoz ölçümü ve varsa kartlı ödeme komisyonu nedeniyle burada görünen rakamın üzerinde olabilir.</p><h3>2027 Yetki Devri</h3><p>Araç muayene hizmetinin yürütülmesine ilişkin yetkinin 2027 yılında yeni bir işletmeciye devredilmesi öngörülmektedir. Bu devir muayene zorunluluğunu, periyotları veya ücretin resmî tarifeyle belirlenmesi esasını değiştirmez; hizmetin hangi kurum tarafından verildiği değişir. Randevu kanalları ve istasyon bilgileri devir sürecinde güncellenebileceğinden, muayene öncesinde güncel resmî kaynaktan teyit almak yerinde olur.</p><h3>Sık Yapılan Hatalar</h3><ul><li>Muayene ücreti ile trafik sigortası primini karıştırmak; bunlar ayrı kalemlerdir</li><li>Egzoz emisyon ölçümünü muayene ücretine dahil sanmak</li><li>Sürenin dolduğu günü birkaç gün geçirmenin bedelsiz olduğunu düşünmek</li><li>Muayene tarihini ruhsattan doğrulamadan tahminle hareket etmek</li><li>Muayeneden geçemeyen aracı ücretsiz tekrar süresi dolduktan sonra getirmek</li><li>Aracın türünü yanlış kategoride değerlendirip farklı bir ücret beklemek</li></ul>`,
                    en: `<h3>Inspection Cycles Vary by Vehicle</h3><p>Cars are first inspected three years after registration, then every two years. Commercial passenger vehicles and heavy goods vehicles follow shorter, often annual, cycles, and motorcycles and tractors have their own schedule. Your next due date appears on the registration document and in official online vehicle records — verify it there.</p><h3>Booking and Avoiding the Late Charge</h3><p>Booking ahead materially cuts waiting time in busy periods. Because partial months count as full months, arriving even one day late incurs a full month's charge, so booking a few weeks before the due date keeps you on the safe side. Driving with an overdue inspection is a separate administrative matter from the late charge calculated here.</p><h3>Free Re-Inspection</h3><p>If a serious defect is found the vehicle fails and must return once the faults are fixed. In practice one re-inspection within a set period carries no additional fee; beyond that period, or for further attempts, a new fee applies. The period and scope can change, so check the date and conditions stated on the report you are given.</p><h3>Emissions Testing Is Separate</h3><p>Exhaust emission testing is a separate service under its own tariff. This page covers only the inspection fee and late charge, so your actual outlay may exceed the figure shown.</p><h3>2027 Transfer of Mandate</h3><p>The mandate to operate vehicle inspection services is expected to pass to a new operator in 2027. This does not change the inspection requirement, the cycles, or the principle that fees are set by official tariff — only which body provides the service. Booking channels may be updated during the transition, so confirm details from current official sources.</p><h3>Common Mistakes</h3><ul><li>Confusing the inspection fee with traffic insurance premiums</li><li>Assuming emissions testing is included in the fee</li><li>Thinking a few days past the due date costs nothing</li><li>Relying on memory instead of checking the due date on the registration</li><li>Returning a failed vehicle after the free re-inspection window has closed</li><li>Placing the vehicle in the wrong fee category</li></ul>`
                }
            },
            faq: [
                { q: { tr: "2026 araç muayene ücreti ne kadar?", en: "How much is the 2026 vehicle inspection fee?" }, a: { tr: "2026 resmî tarifesine göre otomobil, minibüs, kamyonet, arazi taşıtı, özel amaçlı taşıt, römork ve yarı römork muayene ücreti 3.288,84 TL'dir. Otobüs, kamyon, çekici ve tankerde ücret 4.445,60 TL; traktör, motosiklet ve motorlu bisiklette 1.674,53 TL olarak uygulanır. Ücret araç yaşına, markaya veya motor hacmine göre değişmez, yalnızca bu kategoriye bağlıdır. Tarife her yıl Ocak ayında yeniden değerleme oranına göre güncellendiği için yıl değiştiğinde tutarlar yenilenir.", en: "Under the 2026 official tariff the fee is 3,288.84 TRY for cars, minibuses, vans, off-road vehicles, special-purpose vehicles, trailers and semi-trailers; 4,445.60 TRY for buses, lorries, tractor units and tankers; and 1,674.53 TRY for tractors, motorcycles and mopeds. The fee depends only on category, not on age, make or engine size, and the tariff is revised each January." } },
                { q: { tr: "Araç muayenesi ne zaman ve hangi sıklıkla yapılır?", en: "When and how often is inspection required?" }, a: { tr: "Otomobiller kural olarak trafiğe çıkışından üç yıl sonra ilk muayenesine girer, sonrasında iki yılda bir muayene edilir. Ticari taksi, minibüs ve otobüs gibi yolcu taşıyan araçlarla kamyon ve çekici gibi ağır vasıtalarda periyot daha kısadır ve genellikle yıllıktır; motosiklet ve traktörler için ayrı bir takvim uygulanır. Aracınızın bir sonraki muayene tarihi ruhsatınızda ve resmî araç sorgulama kayıtlarında yer alır; periyot araç sınıfına göre değiştiğinden kendi tarihinizi bu kayıtlardan doğrulamanız gerekir.", en: "Cars are first inspected three years after registration and every two years thereafter. Commercial passenger vehicles and heavy goods vehicles follow shorter, usually annual, cycles, while motorcycles and tractors have a separate schedule. Your next due date appears on the registration document and in official vehicle records." } },
                { q: { tr: "Araç muayenesi gecikirse ceza ne kadar olur?", en: "What is the penalty for a late inspection?" }, a: { tr: "Muayene süresi dolduktan sonra geçen her ay için temel muayene ücretinin yüzde beşi oranında gecikme bedeli eklenir. Bedel taban ücret üzerinden hesaplanır ve katlanarak artmaz; örneğin iki aylık gecikme yüzde on, altı aylık gecikme yüzde otuz ek bedel demektir. Kısmi aylar tam ay sayılır, yani bir günlük gecikme de bir aylık bedel doğurur. Bu gecikme bedeli, muayenesi olmayan araçla trafiğe çıkmanın ayrıca doğurduğu idari yaptırımdan farklı ve bağımsız bir kalemdir.", en: "Five percent of the base fee is added for each month past the due date. It is calculated on the base fee and does not compound: two months means ten percent, six months thirty percent. Partial months count in full, so a single day late incurs one month's charge. This is separate from any administrative sanction for driving with an overdue inspection." } },
                { q: { tr: "Egzoz emisyon ölçümü muayene ücretine dahil mi?", en: "Is emissions testing included in the fee?" }, a: { tr: "Hayır. Egzoz gazı emisyon ölçümü araç muayenesinden ayrı bir hizmettir ve kendi tarifesi üzerinden ayrıca ücretlendirilir. Bu sayfadaki hesaplama yalnızca muayene ücreti ile gecikme bedelini kapsar, egzoz ölçümünü içermez. Dolayısıyla istasyonda ödeyeceğiniz toplam tutar, egzoz ölçümü ve varsa kartlı ödeme komisyonu nedeniyle burada gösterilen rakamın üzerinde olabilir.", en: "No. Exhaust emission testing is a separate service with its own tariff. This page covers only the inspection fee and late charge, so the amount you actually pay at the station may be higher once emissions testing and any card commission are added." } },
                { q: { tr: "Muayeneden geçemezsem tekrar ücret öder miyim?", en: "Do I pay again if my vehicle fails?" }, a: { tr: "Muayenede ağır kusur tespit edilen araç muayeneden geçemez ve eksiklikler giderildikten sonra yeniden getirilmesi gerekir. Uygulamada, ilk muayeneden itibaren belirli bir süre içinde yapılan bir kez tekrar muayene için ayrıca ücret alınmaz. Bu süre aşılırsa veya tekrar sayısı bir defayı geçerse yeniden ücret doğar. Ücretsiz tekrar hakkının süresi ve kapsamı değişebildiğinden, muayeneden geçemediğinizde size verilen raporda yazan tarih ve koşulları kontrol etmeniz gerekir.", en: "A vehicle with a serious defect fails and must return after the faults are fixed. In practice one re-inspection within a set period carries no extra fee; beyond that period, or for additional attempts, a new fee applies. The window and its scope can change, so check the date and conditions on the report you receive." } }
            ]
        }
    },
    // 4. Ek Ders Ücreti Hesaplama (düzenlendi)
    {
        id: "ek-ders-ucreti",
        slug: "ek-ders-ucreti-hesaplama",
        category: "maas-ve-vergi",
        updatedAt: "2026-04-27",
        name: { tr: "Ek Ders Ücreti Hesaplama", en: "Extra Lesson Fee Calculator" },
        h1: { tr: "MEB Ek Ders Ücreti Hesaplama 2026", en: "MEB Extra Lesson Fee Calculator 2026" },
        description: { tr: "Kadrolu, sözleşmeli veya ücretli öğretmen için ek ders saati, artırımlı ödeme ve vergi dilimine göre yaklaşık brüt-net ek ders ücretini hesaplayın.", en: "Estimate gross and net extra lesson pay by teacher type, lesson hours, increased-payment scenario, and tax bracket." },
        shortDescription: { tr: "Ek ders saatini, artırımlı ödeme türünü ve vergi dilimini girin; yaklaşık brüt, kesinti ve net tutarı görün.", en: "Enter extra lesson hours, increased-payment type, and tax bracket to see approximate gross, deduction, and net pay." },
        relatedCalculators: ["maas-hesaplama", "asgari-ucret-hesaplama", "gelir-vergisi-hesaplama", "damga-vergisi-hesaplama"],
        inputs: [
            { id: "ogretmenTuru", name: { tr: "Öğretmen Türü", en: "Teacher Type" }, type: "select", options: [
                { label: { tr: "Kadrolu", en: "Permanent" }, value: "kadrolu" },
                { label: { tr: "Sözleşmeli", en: "Contracted" }, value: "sozlesmeli" },
                { label: { tr: "Ücretli", en: "Paid" }, value: "ucretli" }
            ], defaultValue: "kadrolu", required: true },
            { id: "egitim", name: { tr: "Eğitim Durumu", en: "Education Level" }, type: "select", options: [
                { label: { tr: "Lisans", en: "Bachelor" }, value: "lisans" },
                { label: { tr: "Yüksek Lisans", en: "Master" }, value: "yuksek" }
            ], defaultValue: "lisans", required: true },
            { id: "odemeTuru", name: { tr: "Ödeme Türü", en: "Payment Type" }, type: "select", options: [
                { label: { tr: "Normal ek ders", en: "Standard extra lesson" }, value: "normal" },
                { label: { tr: "Gece / nöbet benzeri artırımlı", en: "Night / duty-like increased" }, value: "artirimli" },
                { label: { tr: "DYK / kurs benzeri %100 artırımlı", en: "Course-like 100% increased" }, value: "dyk" }
            ], defaultValue: "normal", required: true },
            { id: "vergiOrani", name: { tr: "Gelir Vergisi Dilimi", en: "Income Tax Bracket" }, type: "select", options: [
                { label: { tr: "%15", en: "15%" }, value: "15" },
                { label: { tr: "%20", en: "20%" }, value: "20" },
                { label: { tr: "%27", en: "27%" }, value: "27" }
            ], defaultValue: "15", required: true },
            { id: "saat", name: { tr: "Ek Ders Saati", en: "Extra Lesson Hours" }, type: "number", min: 0, max: 80, defaultValue: 20, required: true }
        ],
        results: [
            { id: "saatlikUcret", label: { tr: "Yaklaşık Saatlik Brüt", en: "Approx. Hourly Gross" }, type: "number", suffix: " ₺", decimalPlaces: 2 },
            { id: "brutUcret", label: { tr: "Brüt Ücret", en: "Gross Fee" }, type: "number" },
            { id: "kesinti", label: { tr: "Kesintiler", en: "Deductions" }, type: "number" },
            { id: "netUcret", label: { tr: "Net Ek Ders Ücreti", en: "Net Extra Fee" }, type: "number" },
            { id: "calculationNote", label: { tr: "Hesaplama Notu", en: "Calculation Note" }, type: "text" }
        ],
        formula: (v) => {
            const katsayilar: Record<string, number> = { kadrolu: 105, sozlesmeli: 100, ucretli: 90 };
            const saat = Number(v.saat) || 0;
            const ogretmenTuru = typeof v.ogretmenTuru === 'string' && katsayilar[v.ogretmenTuru] ? v.ogretmenTuru : 'kadrolu';
            const odemeTuru = typeof v.odemeTuru === "string" ? v.odemeTuru : "normal";
            const vergiOrani = Number(v.vergiOrani) || 15;
            const odemeCarpani = odemeTuru === "dyk" ? 2 : odemeTuru === "artirimli" ? 1.15 : 1;
            const egitimCarpani = v.egitim === "yuksek" ? 1.07 : 1;
            const saatlikUcret = katsayilar[ogretmenTuru] * odemeCarpani * egitimCarpani;
            const brutUcret = saatlikUcret * saat;
            const kesinti = brutUcret * (vergiOrani / 100);
            const netUcret = brutUcret - kesinti;
            const calculationNote = {
                tr: "Sonuç, seçilen öğretmen türü ve ödeme senaryosu için yaklaşık planlama değeridir. Bordroda damga vergisi, SGK durumu, okul/kurum uygulaması ve dönemsel katsayı güncellemeleri nedeniyle küçük fark oluşabilir.",
                en: "The result is an approximate planning value for the selected teacher and payment scenario. Payroll details, stamp duty, social security status, institution practice, and periodic coefficient updates may create differences.",
            };
            return { saatlikUcret, brutUcret, kesinti, netUcret, calculationNote };
        },
        seo: {
            title: { tr: "MEB Ek Ders Ücreti Hesaplama 2026 (Kadrolu, Ücretli) | HesapMod", en: "MEB Extra Lesson Fee Calculator 2026 (Permanent, Paid) | HesapMod" },
            metaDescription: { tr: "2026 ek ders ücreti hesaplama aracı. Öğretmen türü, ek ders saati, artırımlı ödeme ve vergi dilimine göre yaklaşık brüt-net ek ders ücretini görün.", en: "Estimate 2026 extra lesson pay by teacher type, hours, increased-payment scenario, and tax bracket." },
            content: {
                tr: `<h3>Ek Ders Ücreti Nasıl Hesaplanır?</h3><p>Ek ders ücreti hesabında önce öğretmen türüne göre saatlik brüt tutar seçilir, ardından ders saatiyle çarpılarak brüt ödeme bulunur. Yüksek lisans veya artırımlı ödeme senaryosu seçildiğinde araç bu brüt tutara ilgili çarpanı uygular. Son aşamada seçilen gelir vergisi dilimi kadar kesinti düşülür ve yaklaşık net ek ders ücreti gösterilir.</p><h3>Hangi Senaryolar İçin Kullanılır?</h3><p>Bu ekran kadrolu, sözleşmeli ve ücretli öğretmenlerin ay sonu ek ders tahminini hızlıca görmek için tasarlanmıştır. Normal ek ders, gece/nöbet benzeri artırımlı ödeme ve DYK ya da kurs benzeri %100 artırımlı senaryolar ayrı seçilebilir. Bordroda kurum uygulaması, damga vergisi, SGK durumu ve dönemsel katsayı güncellemeleri farklılık yaratabileceği için sonuç resmi bordro yerine geçmez; ancak aylık gelir planlamasında pratik bir ön izleme sağlar.</p><h3>Ek Ders Sonucunu Nasıl Yorumlamalı?</h3><p>Net ek ders tutarı, aynı ay içindeki ana maaş ve kümülatif vergi matrahıyla birlikte okunmalıdır. Gelir vergisi dilimi yükseldiğinde aynı saat sayısı daha düşük net ödeme üretebilir. Bu nedenle sonucu <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">maaş hesaplama</a>, <a href="/maas-ve-vergi/gelir-vergisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">gelir vergisi hesaplama</a> ve <a href="/maas-ve-vergi/damga-vergisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">damga vergisi hesaplama</a> sayfalarıyla birlikte değerlendirmek daha sağlıklı olur.</p>`,
                en: "The extra lesson fee is estimated by selecting an hourly gross value by teacher type, applying hour count and any increased-payment multiplier, then deducting the selected tax bracket. The result is a planning estimate and may differ from official payroll due to institution practice, stamp duty, social security status, and periodic coefficient changes."
            },
            faq: [
                { q: { tr: "Ücretli öğretmenlerin ek dersi nasıl hesaplanır?", en: "How is extra lesson fee calculated for paid teachers?" }, a: { tr: "Ücretli öğretmenler için araç, ücretli öğretmen seçeneğindeki saatlik brüt varsayımı ek ders saatiyle çarpar ve seçilen vergi dilimini düşerek yaklaşık net tutarı gösterir.", en: "For paid teachers, the tool multiplies the selected hourly gross assumption by extra lesson hours and deducts the chosen tax bracket to estimate net pay." } },
                { q: { tr: "DYK ek ders ücreti kaç katıdır?", en: "What is the DYK extra lesson fee multiplier?" }, a: { tr: "Araçta DYK/kurs benzeri seçenek %100 artırımlı, yani normal saatlik brütün iki katı olarak modellenir. Kurumunuzun bordro uygulaması farklıysa resmi bordro esas alınmalıdır.", en: "The course-like option is modeled as 100% increased, meaning twice the standard hourly gross. If your institution applies a different payroll rule, the official payroll should be used." } },
                { q: { tr: "Ek ders neti neden aydan aya değişebilir?", en: "Why can net extra lesson pay change by month?" }, a: { tr: "Saat sayısı aynı kalsa bile gelir vergisi dilimi, damga vergisi, SGK durumu, artırımlı ödeme türü ve dönemsel katsayı güncellemeleri net sonucu değiştirebilir.", en: "Even with the same hours, tax bracket, stamp duty, social security status, increased-payment type, and coefficient updates can change the net result." } },
                { q: { tr: "Bu hesaplama resmi bordro yerine geçer mi?", en: "Does this calculation replace official payroll?" }, a: { tr: "Hayır. Araç planlama amaçlı yaklaşık sonuç verir. Nihai ödeme için okul/kurum bordrosu, MEB mevzuatı ve güncel mali katsayılar esas alınmalıdır.", en: "No. The tool provides an approximate planning result. Final payment depends on official payroll, ministry rules, and current fiscal coefficients." } }
            ],
            richContent: {
                howItWorks: { tr: "Araç önce öğretmen türüne göre saatlik brüt varsayımı seçer. Ödeme türü ve eğitim durumuna göre çarpan uygular, toplam saati çarpar ve seçilen vergi dilimini kesinti olarak düşer.", en: "The tool selects an hourly gross assumption by teacher type, applies payment and education multipliers, multiplies by total hours, and deducts the selected tax bracket." },
                formulaText: { tr: "Net Ek Ders = Saat × Saatlik Brüt × Ödeme Çarpanı × Eğitim Çarpanı × (1 - Vergi Oranı)", en: "Net Extra Lesson Pay = Hours × Hourly Gross × Payment Multiplier × Education Multiplier × (1 - Tax Rate)" },
                exampleCalculation: { tr: "Örnek: Kadrolu öğretmen, 20 saat normal ek ders, yüksek lisans ve %15 vergi diliminde yaklaşık brüt 2.247 TL, kesinti 337,05 TL ve net 1.909,95 TL olur.", en: "Example: A permanent teacher with 20 standard hours, master's multiplier, and 15% tax bracket gives about 2,247 TRY gross, 337.05 TRY deduction, and 1,909.95 TRY net." },
                miniGuide: { tr: "<ul><li><b>Vergi dilimi:</b> Yıl içinde kümülatif matrah yükseldikçe net ödeme azalabilir.</li><li><b>Artırımlı ödeme:</b> DYK/kurs gibi senaryolar normal saatlik tutarı yükseltebilir.</li><li><b>Bordro farkı:</b> Resmi bordroda damga vergisi, SGK ve kurum uygulaması ayrıca etkili olabilir.</li></ul>", en: "<ul><li><b>Tax bracket:</b> Net pay can fall as the cumulative tax base rises.</li><li><b>Increased payment:</b> Course-like scenarios can increase the hourly value.</li><li><b>Payroll gap:</b> Official payroll can differ due to stamp duty, social security, and institution rules.</li></ul>" }
            }
        }
    },
    // 5. Klima BTU Hesaplama (düzenlendi)
    {
        id: "klima-btu",
        slug: "klima-btu-hesaplama",
        category: "diger",
        updatedAt: "2026-04-12",
        name: { tr: "Klima BTU Hesaplama", en: "AC BTU Calculator" },
        h1: { tr: "Klima BTU Hesaplama 2026 (Oda m² ve Bölge)", en: "AC BTU Calculator 2026 (Room m² & Region)" },
        description: { tr: "Klima BTU kapasitesini hesaplayın.", en: "Calculate AC BTU capacity." },
        shortDescription: { tr: "Klima kapasitesini öğrenin.", en: "Find out AC capacity." },
        relatedCalculators: [],
        inputs: [
            { id: "metrekare", name: { tr: "Oda Metrekaresi", en: "Room Size (m²)" }, type: "number", min: 5, max: 100, required: true },
            { id: "bolge", name: { tr: "Bölge", en: "Region" }, type: "select", options: [
                { label: { tr: "Marmara", en: "Marmara" }, value: "marmara" },
                { label: { tr: "Ege", en: "Aegean" }, value: "ege" },
                { label: { tr: "Akdeniz", en: "Mediterranean" }, value: "akdeniz" },
                { label: { tr: "İç Anadolu", en: "Central Anatolia" }, value: "ic" },
                { label: { tr: "Karadeniz", en: "Black Sea" }, value: "karadeniz" },
                { label: { tr: "Doğu Anadolu", en: "Eastern Anatolia" }, value: "dogu" },
                { label: { tr: "Güneydoğu", en: "Southeast" }, value: "guney" }
            ], required: true },
            { id: "kisi", name: { tr: "Kişi Sayısı", en: "Number of People" }, type: "number", min: 1, max: 10, required: true }
        ],
        results: [
            { id: "kapasite", label: { tr: "Gerekli Soğutma Kapasitesi", en: "Required Cooling Capacity" }, type: "number" },
            { id: "tavsiye", label: { tr: "Tavsiye Edilen Klima", en: "Recommended AC" }, type: "text" }
        ],
        formula: (v) => {
            const katsayi: Record<string, number> = { marmara: 385, ege: 400, akdeniz: 445, ic: 360, karadeniz: 350, dogu: 420, guney: 430 };
            const m2 = Number(v.metrekare) || 0;
            const bolgeKey = typeof v.bolge === 'string' && katsayi[v.bolge] ? v.bolge : 'marmara';
            const bolge = katsayi[bolgeKey];
            const kisi = Number(v.kisi) || 1;
            const kapasite = m2 * bolge + kisi * 600;
            let tavsiye = '';
            if (kapasite <= 9000) tavsiye = '9.000 BTU';
            else if (kapasite <= 12000) tavsiye = '12.000 BTU';
            else if (kapasite <= 18000) tavsiye = '18.000 BTU';
            else tavsiye = '24.000 BTU+';
            return { kapasite, tavsiye };
        },
        seo: {
            title: { tr: "Klima BTU Hesaplama 2026 (Oda m² ve Bölgeye Göre) | HesapMod", en: "AC BTU Calculator 2026 (Room m² & Region) | HesapMod" },
            metaDescription: { tr: "Kaç metrekareye kaç BTU klima alınmalı, soğutma kapasitesi formülü ve enerji tasarrufu hakkında bilgiler.", en: "How much BTU for which room size, cooling capacity formula, and energy saving tips." },
            content: {
                tr: `<h3>Klima BTU Hesaplama</h3><p>Oda m², bölge katsayısı ve kişi sayısına göre klima kapasitesi hesaplanır. Inverter klimalar enerji tasarrufu sağlar.</p><h3>BTU Nedir?</h3><p>BTU, soğutma kapasitesini gösterir. Odanın büyüklüğüne ve bölgeye göre doğru klima seçilmelidir.</p><h3>Kaynaklar</h3><ul><li>TMMOB Makine Mühendisleri Odası</li></ul>`,
                en: "BTU shows cooling capacity. Choose the right AC for your room and region. Inverter ACs save energy."
            },
            faq: [
                { q: { tr: "BTU nedir ve klima seçiminde neden önemlidir?", en: "What is BTU and why is it important for AC selection?" }, a: { tr: "BTU, soğutma kapasitesini gösterir.", en: "BTU shows cooling capacity." } },
                { q: { tr: "12.000 BTU klima kaç metrekare odayı soğutur?", en: "What room size does a 12,000 BTU AC cool?" }, a: { tr: "Yaklaşık 20-25 m².", en: "About 20-25 m²." } }
            ]
        }
    }
];
