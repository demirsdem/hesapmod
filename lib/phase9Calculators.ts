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
            const fiyatlar: Record<string, number> = { otomobil: 1821, traktor: 927, otobus: 2456 };
            const aracTuru = typeof v.aracTuru === 'string' && fiyatlar[v.aracTuru] ? v.aracTuru : 'otomobil';
            const temelUcret = fiyatlar[aracTuru];
            const gecikme = Number(v.gecikme) || 0;
            const gecikmeCezasi = temelUcret * 0.05 * gecikme;
            const toplamTutar = temelUcret + gecikmeCezasi;
            return { temelUcret, gecikmeCezasi, toplamTutar };
        },
        seo: {
            title: { tr: "TÜVTÜRK Araç Muayene Ücreti ve Gecikme Cezası Hesaplama 2026 | HesapMod", en: "TÜVTÜRK Vehicle Inspection Fee & Penalty Calculator 2026 | HesapMod" },
            metaDescription: { tr: "2026 TÜVTÜRK araç muayene ücretleri ve gecikme cezası hesaplaması.", en: "2026 TÜVTÜRK vehicle inspection fee and penalty calculation." },
            content: {
                tr: `<h3>TÜVTÜRK Araç Muayene Ücretleri</h3><p>2026 yılı için otomobil 1.821,60 TL, traktör/motosiklet 927,60 TL, otobüs/kamyon 2.456,40 TL'dir. Gecikilen her ay için %5 gecikme zammı uygulanır.</p><h3>Kredi Kartı Komisyonu</h3><p>Ödemelerde ek komisyon uygulanabilir. Gecikme cezası affı yoktur.</p><h3>Kaynaklar</h3><ul><li>TÜVTÜRK</li><li>Resmi Gazete</li></ul>`,
                en: "2026 fees: Car 1,821.60 TL, Tractor 927.60 TL, Bus 2,456.40 TL. 5% penalty per delayed month. No amnesty for late inspection."
            },
            faq: [
                { q: { tr: "Araç muayene gecikme cezası affı var mı?", en: "Is there an amnesty for late inspection penalty?" }, a: { tr: "Hayır, gecikme cezası affı yoktur.", en: "No, there is no amnesty." } },
                { q: { tr: "Muayenesiz araç kullanmanın trafik cezası ne kadar?", en: "What is the fine for driving without inspection?" }, a: { tr: "2026'da 4.064 TL idari para cezası uygulanır.", en: "In 2026, the administrative fine is 4,064 TL." } }
            ]
        }
    },
    // 4. Ek Ders Ücreti Hesaplama (düzenlendi)
    {
        id: "ek-ders-ucreti",
        slug: "ek-ders-ucreti-hesaplama",
        category: "maas-ve-vergi",
        updatedAt: "2026-04-12",
        name: { tr: "Ek Ders Ücreti Hesaplama", en: "Extra Lesson Fee Calculator" },
        h1: { tr: "MEB Ek Ders Ücreti Hesaplama 2026", en: "MEB Extra Lesson Fee Calculator 2026" },
        description: { tr: "Ek ders ücretini hesaplayın.", en: "Calculate extra lesson fee." },
        shortDescription: { tr: "Ek ders ücretini öğrenin.", en: "Find out the extra lesson fee." },
        relatedCalculators: [],
        inputs: [
            { id: "ogretmenTuru", name: { tr: "Öğretmen Türü", en: "Teacher Type" }, type: "select", options: [
                { label: { tr: "Kadrolu", en: "Permanent" }, value: "kadrolu" },
                { label: { tr: "Sözleşmeli", en: "Contracted" }, value: "sozlesmeli" },
                { label: { tr: "Ücretli", en: "Paid" }, value: "ucretli" }
            ], required: true },
            { id: "egitim", name: { tr: "Eğitim Durumu", en: "Education Level" }, type: "select", options: [
                { label: { tr: "Lisans", en: "Bachelor" }, value: "lisans" },
                { label: { tr: "Yüksek Lisans", en: "Master" }, value: "yuksek" }
            ], required: true },
            { id: "saat", name: { tr: "Ek Ders Saati", en: "Extra Lesson Hours" }, type: "number", min: 0, max: 60, required: true }
        ],
        results: [
            { id: "brutUcret", label: { tr: "Brüt Ücret", en: "Gross Fee" }, type: "number" },
            { id: "kesinti", label: { tr: "Kesintiler", en: "Deductions" }, type: "number" },
            { id: "netUcret", label: { tr: "Net Ek Ders Ücreti", en: "Net Extra Fee" }, type: "number" }
        ],
        formula: (v) => {
            const katsayilar: Record<string, number> = { kadrolu: 105, sozlesmeli: 100, ucretli: 90 };
            const saat = Number(v.saat) || 0;
            const ogretmenTuru = typeof v.ogretmenTuru === 'string' && katsayilar[v.ogretmenTuru] ? v.ogretmenTuru : 'kadrolu';
            let brutUcret = katsayilar[ogretmenTuru] * saat;
            if (v.egitim === "yuksek") brutUcret *= 1.07;
            const kesinti = brutUcret * 0.15;
            const netUcret = brutUcret - kesinti;
            return { brutUcret, kesinti, netUcret };
        },
        seo: {
            title: { tr: "MEB Ek Ders Ücreti Hesaplama 2026 (Kadrolu, Ücretli) | HesapMod", en: "MEB Extra Lesson Fee Calculator 2026 (Permanent, Paid) | HesapMod" },
            metaDescription: { tr: "2026 ek ders ücretleri ve artırımlı ödemeler.", en: "2026 extra lesson fees and increased payments." },
            content: {
                tr: `<h3>Ek Ders Ücretleri</h3><p>2026 yılında kadrolu gündüz ek ders ücreti 105 TL, gece 120 TL'dir. Yüksek lisans/doktora mezunlarına %7 artırımlı ödeme yapılır.</p><h3>Vergi Dilimi</h3><p>Ek ders ücretleri %15 veya %20 vergi dilimine göre netleşir.</p><h3>Kaynaklar</h3><ul><li>MEB</li><li>Resmi Gazete</li></ul>`,
                en: "Extra lesson fees for 2026: Permanent (day) 105 TL, (night) 120 TL. 7% increase for master/PhD. Tax bracket affects net amount."
            },
            faq: [
                { q: { tr: "Ücretli öğretmenlerin ek dersi nasıl hesaplanır?", en: "How is extra lesson fee calculated for paid teachers?" }, a: { tr: "Ücretli öğretmenler için saat başı ücret daha düşüktür.", en: "Paid teachers have a lower hourly rate." } },
                { q: { tr: "DYK ek ders ücreti kaç katıdır?", en: "What is the DYK extra lesson fee multiplier?" }, a: { tr: "DYK kurslarında ek ders ücreti %100 artırımlıdır.", en: "In DYK courses, extra lesson fee is doubled." } }
            ]
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
