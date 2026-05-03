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
        updatedAt: "2026-04-12",
        name: { tr: "Araç Muayene Ücreti Hesaplama", en: "Vehicle Inspection Fee Calculator" },
        h1: { tr: "TÜVTÜRK Araç Muayene Ücreti ve Gecikme Cezası", en: "TÜVTÜRK Vehicle Inspection Fee & Penalty" },
        description: { tr: "Araç muayene ücreti ve gecikme cezası hesaplayın.", en: "Calculate vehicle inspection fee and penalty." },
        shortDescription: { tr: "Araç muayene ücretini öğrenin.", en: "Find out the vehicle inspection fee." },
        relatedCalculators: [],
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
            title: { tr: "TÜVTÜRK Araç Muayene Ücreti ve Gecikme Cezası Hesaplama 2026 | HesapMod", en: "TÜVTÜRK Vehicle Inspection Fee & Penalty Calculator 2026 | HesapMod" },
            metaDescription: { tr: "2026 TÜVTÜRK araç muayene ücretleri ve gecikme cezası hesaplaması.", en: "2026 TÜVTÜRK vehicle inspection fee and penalty calculation." },
            content: {
                tr: `<h3>TÜVTÜRK Araç Muayene Ücretleri</h3><p>2026 yılı için otomobil, minibüs, kamyonet, arazi taşıtı, özel amaçlı taşıt, römork ve yarı römork muayene ücreti <strong>3.288,84 TL</strong>; traktör, motosiklet ve motorlu bisiklet muayene ücreti <strong>1.674,53 TL</strong>; otobüs, kamyon, çekici ve tanker muayene ücreti <strong>4.445,60 TL</strong> olarak hesaplanır. Gecikilen her ay için muayene ücretinin %5'i oranında gecikme bedeli eklenir; bir günlük gecikme de bir ay gibi değerlendirilir.</p><h3>Kredi Kartı ve Ek Ücretler</h3><p>Muayene ücreti nakit veya kartla ödenebilir. Kartlı ödemelerde hizmet sağlayıcı kaynaklı ek komisyon oluşabilir. Egzoz gazı emisyon ölçümü ve yola elverişlilik muayenesi bu hesaplamaya dahil değildir.</p><h3>Kaynaklar</h3><ul><li>TÜVTÜRK 2026 ücret tarifesi</li><li>Resmi Gazete yeniden değerleme oranı</li></ul>`,
                en: "2026 fees: Car/light group 3,288.84 TL, tractor/motorcycle group 1,674.53 TL, bus/truck group 4,445.60 TL. A 5% delay fee is added per delayed month."
            },
            faq: [
                { q: { tr: "Araç muayene gecikme bedeli nasıl hesaplanır?", en: "How is the late inspection fee calculated?" }, a: { tr: "Muayene süresi geçerse her ay için temel muayene ücretinin %5'i eklenir. Bir günlük gecikme de bir ay olarak dikkate alınır.", en: "A 5% fee is added to the base inspection fee for each delayed month. Even a one-day delay counts as one month." } },
                { q: { tr: "Muayenesiz araç kullanmanın trafik cezası ne kadar?", en: "What is the fine for driving without inspection?" }, a: { tr: "2026'da muayenesiz araçla trafiğe çıkma cezası yaklaşık 2.719 TL'dir. Erken ödeme indirimi ve ek yaptırımlar ayrıca değerlendirilmelidir.", en: "In 2026, the fine for driving without inspection is approximately 2,719 TL. Early payment discount and additional sanctions should be checked separately." } }
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
