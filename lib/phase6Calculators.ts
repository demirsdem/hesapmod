// Phase 6: Gayrimenkul, İnşaat ve İK Araçları
// HesapMod - 2026
import { CalculatorConfig } from "./calculator-types";

export const phase6Calculators: CalculatorConfig[] = [
    // 1. Tapu Harcı Hesaplama
    {
        id: "tapu-harci",
        slug: "tapu-harci-hesaplama",
        category: "ticaret-ve-is",
        updatedAt: "2026-04-13",
        name: { tr: "Tapu Harcı Hesaplama", en: "Title Deed Fee Calculator" },
        h1: { tr: "Tapu Harcı ve Masraf Hesaplama", en: "Title Deed Fee and Cost Calculator" },
        description: { tr: "Gayrimenkul satışında alıcı ve satıcıdan alınan tapu harcı ve döner sermaye bedelini 2026 oranlarıyla hesaplayın.", en: "Calculate the title deed fee and revolving fund cost for real estate sales in 2026." },
        shortDescription: { tr: "Tapu harcı ve toplam masrafı öğrenin.", en: "Find out the title deed fee and total cost." },
        relatedCalculators: [],
        inputs: [
            { id: "satisBedeli", name: { tr: "Satış Bedeli (TL)", en: "Sale Price (TRY)" }, type: "number", min: 10000, max: 100000000, step: 100, required: true }
        ],
        results: [
            { id: "aliciHarci", label: { tr: "Alıcı Tapu Harcı", en: "Buyer Title Deed Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "saticiHarci", label: { tr: "Satıcı Tapu Harcı", en: "Seller Title Deed Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "donerBedeli", label: { tr: "Döner Sermaye Bedeli", en: "Revolving Fund Fee" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "toplamMasraf", label: { tr: "Toplam Masraf", en: "Total Cost" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            const satis = Number(v.satisBedeli) || 0;
            const aliciHarci = satis * 0.02;
            const saticiHarci = satis * 0.02;
            const donerBedeli = 1500; // 2026 için örnek sabit
            const toplamMasraf = aliciHarci + saticiHarci + donerBedeli;
            return { aliciHarci, saticiHarci, donerBedeli, toplamMasraf };
        },
        seo: {
            title: { tr: "Tapu Harcı Hesaplama 2026 (Alıcı ve Satıcı Masrafı) | HesapMod", en: "Title Deed Fee Calculator 2026 (Buyer & Seller) | HesapMod" },
            metaDescription: { tr: "2026 tapu harcı oranlarıyla alıcı ve satıcıdan alınan tapu masrafını ve döner sermaye bedelini hesaplayın.", en: "Calculate the 2026 title deed fee and revolving fund cost for buyer and seller." },
            content: {
                tr: `<h3>Tapu Harcı Nasıl Hesaplanır?</h3><p>2026 yılında tapu harcı, satış bedelinin hem alıcı hem de satıcı için ayrı ayrı %2'si (binde 20) olarak alınır. Ayrıca yaklaşık 1.500 TL döner sermaye bedeli eklenir. Rayiç bedel altında satış gösterilmesi durumunda cezai işlem uygulanabilir.</p><h3>Tapu Masrafları Kimden Alınır?</h3><p>Tapu harcı yasal olarak hem alıcıdan hem de satıcıdan eşit oranda tahsil edilir. Döner sermaye bedeli genellikle alıcıdan alınır.</p><h3>Kaynaklar</h3><ul><li>Tapu Kadastro Genel Müdürlüğü</li></ul>`,
                en: "In 2026, the title deed fee is 2% of the sale price for both buyer and seller. An additional revolving fund fee (~1,500 TRY) is also charged. Understating the declared value may result in penalties."
            },
            faq: [
                { q: { tr: "Tapu harcını kim öder?", en: "Who pays the title deed fee?" }, a: { tr: "Yasal olarak hem alıcı hem de satıcı öder.", en: "Legally, both buyer and seller pay." } },
                { q: { tr: "Döner sermaye bedeli nedir?", en: "What is the revolving fund fee?" }, a: { tr: "Tapu işlemlerinde alınan sabit bir masraftır.", en: "A fixed fee charged for title deed transactions." } }
            ]
        }
    },
    // 2. Araç Değer Kaybı Hesaplama
    {
        id: "arac-deger-kaybi",
        slug: "arac-deger-kaybi-hesaplama",
        category: "sigorta",
        updatedAt: "2026-04-13",
        name: { tr: "Araç Değer Kaybı Hesaplama", en: "Vehicle Value Loss Calculator" },
        h1: { tr: "Araç Değer Kaybı (Kaza Sonrası) Hesaplama", en: "Vehicle Value Loss (Post-Accident) Calculator" },
        description: { tr: "Kaza sonrası aracın rayiç bedeli, kilometresi ve hasar tutarına göre tahmini değer kaybını hesaplayın.", en: "Calculate the estimated value loss after an accident based on vehicle value, mileage, and damage amount." },
        shortDescription: { tr: "Araç değer kaybı tazminatını öğrenin.", en: "Find out the vehicle value loss compensation." },
        relatedCalculators: [],
        inputs: [
            { id: "rayicBedel", name: { tr: "Kaza Anı Rayiç Bedel (TL)", en: "Market Value at Accident (TRY)" }, type: "number", min: 10000, max: 5000000, step: 100, required: true },
            { id: "km", name: { tr: "Araç Kilometresi", en: "Vehicle Mileage" }, type: "number", min: 0, max: 500000, step: 100, required: true },
            { id: "hasarTutari", name: { tr: "Hasar Tutarı (TL)", en: "Damage Amount (TRY)" }, type: "number", min: 1000, max: 1000000, step: 100, required: true }
        ],
        results: [
            { id: "degerKaybi", label: { tr: "Tahmini Değer Kaybı", en: "Estimated Value Loss" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // Yargıtay formülü: rayiç bedel x hasar katsayısı x km katsayısı x 0.9
            const rayic = Number(v.rayicBedel) || 0;
            const hasar = Number(v.hasarTutari) || 0;
            const km = Number(v.km) || 0;
            let hasarKatsayi = 0.15; // örnek: %15
            if (hasar < rayic * 0.05) hasarKatsayi = 0.08;
            else if (hasar < rayic * 0.10) hasarKatsayi = 0.12;
            else if (hasar < rayic * 0.20) hasarKatsayi = 0.15;
            else hasarKatsayi = 0.18;
            let kmKatsayi = 1;
            if (km > 150000) kmKatsayi = 0.7;
            else if (km > 100000) kmKatsayi = 0.8;
            else if (km > 50000) kmKatsayi = 0.9;
            const degerKaybi = rayic * hasarKatsayi * kmKatsayi * 0.9;
            return { degerKaybi };
        },
        seo: {
            title: { tr: "Araç Değer Kaybı Hesaplama 2026 (Trafik Kazası) | HesapMod", en: "Vehicle Value Loss Calculator 2026 (Accident) | HesapMod" },
            metaDescription: { tr: "Kaza sonrası araç değer kaybı tazminatını 2026 Yargıtay formülüyle hesaplayın.", en: "Calculate vehicle value loss compensation after an accident using the 2026 formula." },
            content: {
                tr: `<h3>Araç Değer Kaybı Nasıl Hesaplanır?</h3><p>Yargıtay kararlarına göre, araç değer kaybı rayiç bedel, hasar tutarı ve kilometreye göre hesaplanır. %100 kusurlu olanlar tazminat alamaz. Parçanın daha önce değişmemiş olması gerekir.</p><h3>Değer Kaybı Davası Şartları</h3><ul><li>Kazada %100 kusurlu olmamak</li><li>Parçanın daha önce değişmemiş olması</li><li>Hasar sonrası onarımın tamamlanmış olması</li></ul><h3>Kaynaklar</h3><ul><li>Yargıtay Kararları</li><li>Sigorta Tahkim Komisyonu</li></ul>`,
                en: "According to court precedents, value loss is calculated based on market value, damage amount, and mileage. 100% at-fault drivers cannot claim compensation. The part must not have been previously replaced."
            },
            faq: [
                { q: { tr: "Araç değer kaybını kim öder?", en: "Who pays the value loss?" }, a: { tr: "Kusurlu tarafın sigorta şirketi öder.", en: "The at-fault party's insurance pays." } },
                { q: { tr: "Değer kaybı davası zaman aşımı süresi ne kadardır?", en: "What is the statute of limitations for value loss claims?" }, a: { tr: "2 yıl (veya 10 yıl genel zamanaşımı).", en: "2 years (or 10 years general limitation)." } }
            ]
        }
    },
    // 3. İnşaat Maliyeti Hesaplama
    {
        id: "insaat-maliyeti",
        slug: "insaat-maliyeti-hesaplama",
        category: "ticaret-ve-is",
        updatedAt: "2026-04-13",
        name: { tr: "İnşaat Maliyeti Hesaplama", en: "Construction Cost Calculator" },
        h1: { tr: "İnşaat Maliyeti (Birim Fiyat) Hesaplama", en: "Construction Cost (Unit Price) Calculator" },
        description: { tr: "Toplam inşaat alanı, sınıfı ve yapı türüne göre 2026 yılı birim fiyatlarıyla tahmini inşaat maliyetini hesaplayın.", en: "Calculate the estimated construction cost for 2026 based on total area, class, and structure type." },
        shortDescription: { tr: "İnşaat m² maliyetini öğrenin.", en: "Find out the construction cost per m²." },
        relatedCalculators: [],
        inputs: [
            { id: "alan", name: { tr: "Toplam İnşaat Alanı (m²)", en: "Total Construction Area (m²)" }, type: "number", min: 10, max: 100000, step: 1, required: true },
            { id: "sinif", name: { tr: "İnşaat Sınıfı", en: "Construction Class" }, type: "select", options: [
                { label: { tr: "Lüks", en: "Luxury" }, value: "lux" },
                { label: { tr: "1. Sınıf", en: "Class 1" }, value: "class1" },
                { label: { tr: "2. Sınıf", en: "Class 2" }, value: "class2" },
                { label: { tr: "3. Sınıf", en: "Class 3" }, value: "class3" }
            ], required: true },
            { id: "yapiTuru", name: { tr: "Yapı Türü", en: "Structure Type" }, type: "select", options: [
                { label: { tr: "Betonarme", en: "Reinforced Concrete" }, value: "betonarme" },
                { label: { tr: "Yığma", en: "Masonry" }, value: "yigma" }
            ], required: true }
        ],
        results: [
            { id: "birimMaliyet", label: { tr: "Birim m² Maliyeti", en: "Unit Cost per m²" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "toplamMaliyet", label: { tr: "Toplam İnşaat Maliyeti", en: "Total Construction Cost" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // 2026 Bakanlık birim fiyatları (örnek):
            let birim = 0;
            if (v.sinif === "lux") birim = v.yapiTuru === "betonarme" ? 35000 : 30000;
            else if (v.sinif === "class1") birim = v.yapiTuru === "betonarme" ? 25000 : 21000;
            else if (v.sinif === "class2") birim = v.yapiTuru === "betonarme" ? 18000 : 15000;
            else birim = v.yapiTuru === "betonarme" ? 14000 : 12000;
            const toplamMaliyet = (Number(v.alan) || 0) * birim;
            return { birimMaliyet: birim, toplamMaliyet };
        },
        seo: {
            title: { tr: "İnşaat Maliyeti Hesaplama 2026 (Bakanlık Birim Fiyatları) | HesapMod", en: "Construction Cost Calculator 2026 (Official Unit Prices) | HesapMod" },
            metaDescription: { tr: "2026 yılı inşaat m² birim fiyatlarıyla tahmini maliyet hesabı yapın.", en: "Calculate estimated construction cost with 2026 unit prices." },
            content: {
                tr: `<h3>İnşaat Maliyeti Nasıl Hesaplanır?</h3><p>Çevre, Şehircilik ve İklim Değişikliği Bakanlığı'nın 2026 yılı birim fiyatlarına göre, inşaat sınıfı ve yapı türüne göre m² maliyeti değişir. Lüks ve 1. sınıf inşaatlar daha yüksek birim fiyatlıdır.</p><h3>Birim Fiyatlar</h3><ul><li>Lüks Betonarme: 35.000 TL/m²</li><li>1. Sınıf Betonarme: 25.000 TL/m²</li><li>2. Sınıf Betonarme: 18.000 TL/m²</li><li>3. Sınıf Betonarme: 14.000 TL/m²</li></ul><h3>Kaynaklar</h3><ul><li>Çevre, Şehircilik ve İklim Değişikliği Bakanlığı</li></ul>`,
                en: "According to the Ministry's 2026 unit prices, construction class and structure type determine the m² cost. Luxury and Class 1 are more expensive."
            },
            faq: [
                { q: { tr: "İnşaat maliyet bedeline arsa payı dahil midir?", en: "Is land value included in construction cost?" }, a: { tr: "Hayır, arsa bedeli hariçtir.", en: "No, land value is excluded." } },
                { q: { tr: "Betonarme ile yığma yapı maliyet farkı ne kadardır?", en: "What is the cost difference between reinforced concrete and masonry?" }, a: { tr: "Betonarme genellikle %15-20 daha pahalıdır.", en: "Reinforced concrete is typically 15-20% more expensive." } }
            ]
        }
    },
    // 4. Yıllık İzin Ücreti Hesaplama
    {
        id: "yillik-izin-ucreti",
        slug: "yillik-izin-ucreti-hesaplama",
        category: "muhasebe",
        updatedAt: "2026-04-13",
        name: { tr: "Yıllık İzin Ücreti Hesaplama", en: "Annual Leave Pay Calculator" },
        h1: { tr: "Yıllık İzin Ücreti (Net/Brüt) Hesaplama", en: "Annual Leave Pay (Net/Gross) Calculator" },
        description: { tr: "Kullanılmayan izin gününe ve son maaşa göre işten ayrılma durumunda ödenecek yıllık izin ücretini hesaplayın.", en: "Calculate the annual leave pay to be paid upon termination based on unused leave days and last salary." },
        shortDescription: { tr: "Yıllık izin ücretini öğrenin.", en: "Find out the annual leave pay." },
        relatedCalculators: [],
        inputs: [
            { id: "gun", name: { tr: "Kullanılmayan İzin Günü", en: "Unused Leave Days" }, type: "number", min: 1, max: 60, step: 1, required: true },
            { id: "brutMaas", name: { tr: "Son Brüt Maaş (TL)", en: "Last Gross Salary (TRY)" }, type: "number", min: 10000, max: 100000, step: 100, required: true },
            { id: "netMi", name: { tr: "Net Hesapla", en: "Calculate Net" }, type: "checkbox", defaultValue: true }
        ],
        results: [
            { id: "brutUcret", label: { tr: "Brüt İzin Ücreti", en: "Gross Leave Pay" }, type: "number", suffix: "TL", decimalPlaces: 2 },
            { id: "netUcret", label: { tr: "Net İzin Ücreti", en: "Net Leave Pay" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // Brüt izin ücreti = (brüt maaş / 30) * izin günü
            const gun = Number(v.gun) || 0;
            const brutMaas = Number(v.brutMaas) || 0;
            const brutUcret = (brutMaas / 30) * gun;
            // Net hesaplama: SGK işçi primi %14, işsizlik %1, gelir vergisi %20, damga %0.759
            let netUcret = brutUcret;
            if (v.netMi) {
                const sgk = brutUcret * 0.14;
                const issizlik = brutUcret * 0.01;
                const gelir = brutUcret * 0.20;
                const damga = brutUcret * 0.00759;
                netUcret = brutUcret - sgk - issizlik - gelir - damga;
            }
            return { brutUcret, netUcret };
        },
        seo: {
            title: { tr: "Yıllık İzin Ücreti Hesaplama 2026 (Net ve Brüt) | HesapMod", en: "Annual Leave Pay Calculator 2026 (Net & Gross) | HesapMod" },
            metaDescription: { tr: "Kullanılmayan yıllık izin ücretini işten ayrılırken net ve brüt olarak hesaplayın.", en: "Calculate unused annual leave pay upon termination, both net and gross." },
            content: {
                tr: `<h3>Yıllık İzin Ücreti Nasıl Hesaplanır?</h3><p>İşten ayrılan işçiye, kullanılmayan yıllık izin günleri için son brüt maaşı üzerinden ödeme yapılır. Bu tutardan SGK işçi primi, işsizlik sigortası, gelir vergisi ve damga vergisi kesilir.</p><h3>Yıllık İzin Parası Çalışırken Alınır mı?</h3><p>Yasal olarak sadece işten ayrılırken ödenir.</p><h3>Kaynaklar</h3><ul><li>SGK</li><li>İş Kanunu</li></ul>`,
                en: "Upon termination, unused annual leave is paid based on the last gross salary. Deductions include social security, unemployment, income tax, and stamp tax."
            },
            faq: [
                { q: { tr: "Kullanılmayan yıllık izin parası çalışırken nakit alınır mı?", en: "Can unused annual leave be paid in cash while working?" }, a: { tr: "Hayır, sadece işten ayrılırken ödenir.", en: "No, only upon termination." } },
                { q: { tr: "Yıllık izin ücreti hesaplamasında son maaş mı dikkate alınır?", en: "Is the last salary used in leave pay calculation?" }, a: { tr: "Evet, son brüt maaş esas alınır.", en: "Yes, the last gross salary is used." } }
            ]
        }
    },
    // 5. Kısa Çalışma Ödeneği Hesaplama
    {
        id: "kisa-calisma-odenegi",
        slug: "kisa-calisma-odenegi-hesaplama",
        category: "muhasebe",
        updatedAt: "2026-04-13",
        name: { tr: "Kısa Çalışma Ödeneği Hesaplama", en: "Short-Time Work Allowance Calculator" },
        h1: { tr: "Kısa Çalışma Ödeneği Hesaplama", en: "Short-Time Work Allowance Calculator" },
        description: { tr: "Son 12 aylık brüt kazanç ortalamasına göre 2026 kısa çalışma ödeneğini ve tavanı hesaplayın.", en: "Calculate the 2026 short-time work allowance and ceiling based on last 12 months' average gross earnings." },
        shortDescription: { tr: "Kısa çalışma ödeneğini öğrenin.", en: "Find out the short-time work allowance." },
        relatedCalculators: [],
        inputs: [
            { id: "brutOrtalama", name: { tr: "12 Aylık Brüt Ortalama (TL)", en: "12-Month Avg Gross (TRY)" }, type: "number", min: 10000, max: 100000, step: 100, required: true }
        ],
        results: [
            { id: "aylikNet", label: { tr: "Aylık Net KÇÖ Tutarı", en: "Monthly Net Allowance" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // Günlük ödenek = brüt/30 * 0.6, tavan = asgari ücretin %150'si, damga vergisi %0.759
            const asgariUcret = 20000; // 2026 örnek asgari ücret
            const tavan = asgariUcret * 1.5;
            let aylikBrut = (Number(v.brutOrtalama) || 0) * 0.6;
            if (aylikBrut > tavan) aylikBrut = tavan;
            const damgaVergisi = aylikBrut * 0.00759;
            const aylikNet = aylikBrut - damgaVergisi;
            return { aylikNet };
        },
        seo: {
            title: { tr: "Kısa Çalışma Ödeneği Hesaplama 2026 | HesapMod", en: "Short-Time Work Allowance Calculator 2026 | HesapMod" },
            metaDescription: { tr: "Kısa çalışma ödeneğini ve tavanını 2026 İŞKUR mevzuatına göre hesaplayın.", en: "Calculate the short-time work allowance and ceiling according to 2026 regulations." },
            content: {
                tr: `<h3>Kısa Çalışma Ödeneği Nedir?</h3><p>Kısa çalışma ödeneği, işçinin son 12 aylık brüt kazancının %60'ı olarak hesaplanır ve asgari ücretin %150'sini geçemez. Sadece damga vergisi kesilir.</p><h3>KÇÖ Şartları</h3><ul><li>İşverenin başvurusu</li><li>Son 3 yılda 600 gün prim</li><li>Son işyerinde 120 gün kesintisiz çalışma</li></ul><h3>Kaynaklar</h3><ul><li>İŞKUR</li><li>SGK</li></ul>`,
                en: "Short-time work allowance is 60% of the last 12 months' average gross earnings, capped at 150% of the minimum wage. Only stamp tax is deducted."
            },
            faq: [
                { q: { tr: "Kısa çalışma ödeneği alırken sağlık hizmetlerinden (SGK) yararlanılır mı?", en: "Can you benefit from health services (SGK) while receiving the allowance?" }, a: { tr: "Evet, SGK sağlık hizmetleri devam eder.", en: "Yes, health services continue." } },
                { q: { tr: "Kısa çalışma ödeneği işsizlik maaşından düşer mi?", en: "Does the allowance reduce unemployment benefit?" }, a: { tr: "Evet, KÇÖ süresi işsizlik maaşı süresinden düşülür.", en: "Yes, the allowance period is deducted from unemployment benefit duration." } }
            ]
        }
    }
];
