// Phase 6: Gayrimenkul, İnşaat ve İK Araçları
// HesapMod - 2026
import { CalculatorConfig } from "./calculator-types";

export const phase6Calculators: CalculatorConfig[] = [
    // 1. Tapu Harcı Hesaplama
    {
        id: "tapu-harci",
        slug: "tapu-harci-hesaplama",
        category: "ticaret-ve-is",
        updatedAt: "2026-04-27",
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
        updatedAt: "2026-07-31",
        name: { tr: "Araç Değer Kaybı Hesaplama", en: "Vehicle Value Loss Calculator" },
        h1: { tr: "Araç Değer Kaybı (Kaza Sonrası) Hesaplama", en: "Vehicle Value Loss (Post-Accident) Calculator" },
        description: { tr: "Kaza sonrası aracın rayiç bedeli, kilometresi ve hasar tutarına göre tahmini değer kaybını hesaplayın.", en: "Calculate the estimated value loss after an accident based on vehicle value, mileage, and damage amount." },
        shortDescription: { tr: "Araç değer kaybı tazminatını öğrenin.", en: "Find out the vehicle value loss compensation." },
        relatedCalculators: [
            "arac-deger-hesaplama",
            "kasko-degeri-hesaplama",
            "trafik-sigortasi-hesaplama",
            "arac-muayene-ucreti-hesaplama"
        ],
        inputs: [
            { id: "rayicBedel", name: { tr: "Kaza Anı Rayiç Bedel (TL)", en: "Market Value at Accident (TRY)" }, type: "number", min: 10000, max: 5000000, step: 100, required: true },
            { id: "km", name: { tr: "Araç Kilometresi", en: "Vehicle Mileage" }, type: "number", min: 0, max: 500000, step: 100, required: true },
            { id: "hasarTutari", name: { tr: "Hasar Tutarı (TL)", en: "Damage Amount (TRY)" }, type: "number", min: 1000, max: 1000000, step: 100, required: true }
        ],
        results: [
            { id: "degerKaybi", label: { tr: "Tahmini Değer Kaybı", en: "Estimated Value Loss" }, type: "number", suffix: "TL", decimalPlaces: 2 }
        ],
        formula: (v) => {
            // Ön-tahmin modeli (resmi tarife değildir): rayiç bedel x hasar katsayısı x km katsayısı x 0.9
            // Katsayılar eksper uygulamasında gözlenen aralıklardan türetilmiş yaklaşık değerlerdir.
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
            title: { tr: "Araç Değer Kaybı Hesaplama 2026 | Tahmini Tutar", en: "Vehicle Value Loss Calculator 2026 | Estimated Amount" },
            metaDescription: { tr: "Kaza sonrası araç değer kaybını rayiç bedel, kilometre ve hasar tutarına göre hesaplayın. 2026 ön-tahmin aracı, örnek hesaplama ve başvuru rehberi.", en: "Estimate post-accident vehicle value loss from market value, mileage and damage amount. A 2026 preliminary estimate with a worked example and claim guide." },
            content: {
                tr: `<h3>Araç Değer Kaybı Nedir?</h3><p>Araç değer kaybı, kazaya karışan bir aracın onarımı eksiksiz yapılmış olsa bile ikinci el piyasasındaki değerinin kaza öncesine göre düşük kalmasıdır. Hasar kaydı araç sorgu sistemlerinde görünür olduğu için alıcılar aynı yaş ve kilometredeki hasarsız bir örneğe kıyasla daha düşük fiyat teklif eder. Onarım masrafı sigorta tarafından karşılanmış olsa dahi bu piyasa değeri farkı araç sahibinin üzerinde kalır; değer kaybı tazminatı tam olarak bu farkı karşılamayı amaçlar.</p><p>Değer kaybı, kural olarak kazada kusuru bulunan tarafın <strong>zorunlu trafik sigortasından</strong> talep edilir; kendi kaskonuzdan değil. Bu araç, elinizdeki üç bilgiyi — aracın kaza anındaki rayiç bedeli, kilometresi ve hasar tutarını — kullanarak <strong>tahmini bir değer kaybı tutarı</strong> verir. Sonuç bir ön-tahmindir: talebinizin büyüklük sırasını görmenizi sağlar, ödenecek kesin tutarı belirlemez. Kesin tutar eksper incelemesi ve gerektiğinde Sigorta Tahkim Komisyonu ya da yargı süreci sonucunda ortaya çıkar.</p>`,
                en: "Vehicle value loss is the drop in a car's second-hand market value after an accident, even when repairs are complete, because the damage record is visible to buyers. It is generally claimed from the compulsory traffic insurance of the at-fault party, not from your own casco policy. This tool takes three inputs — market value at the time of the accident, mileage and damage amount — and returns a preliminary estimate. The binding amount is set by an expert assessment and, where needed, the Insurance Arbitration Commission or the courts."
            },
            richContent: {
                howItWorks: {
                    tr: "Bu araç üç bilgiyle çalışır ve yalnızca bunları hesaba katar: aracın kaza anındaki rayiç bedeli, kilometresi ve hasar tutarı. Rayiç bedel hesabın tabanıdır, çünkü değer kaybı aracın kendi değerinin bir yüzdesi olarak ortaya çıkar. Hasar tutarı ise sonuca doğrudan eklenmez; hasarın rayiç bedele oranı hesaplanır ve bu oran hangi ağırlık kademesine denk geliyorsa ona karşılık gelen katsayı uygulanır. Kilometre de kademeli çalışır: düşük kilometreli araçlarda değer kaybı en yüksek seviyede kabul edilir, kilometre arttıkça katsayı kademeli olarak azalır. Bunun mantığı, çok yol yapmış bir aracın piyasa değerinin zaten aşağı çekilmiş olması ve hasar kaydının yaratacağı ek düşüşün görece sınırlı kalmasıdır.\n\nNihai değerlendirmede ayrıca dikkate alınan, ancak bu ön-tahmin aracının girdi olarak almadığı faktörler vardır: aracın yaşı, marka ve modeli, hasarın aracın hangi bölgesinde olduğu (şasi, direk ve tavan gibi taşıyıcı bölgelerdeki hasar kapı veya çamurluk hasarından çok daha ağır değerlendirilir), değiştirilen parçaların sayısı ve niteliği, tarafların kusur oranı ve aracın kazadan önceki hasar kaydı. Bu unsurlar tazminatın gerçek tutarını belirgin biçimde değiştirebilir. Kesin tutar, eksper raporu ve gerektiğinde Sigorta Tahkim Komisyonu veya yargı değerlendirmesiyle belirlenir; buradaki sonuç o sürecin yerine geçmez.",
                    en: "The tool works with three inputs and accounts for those only: the vehicle's market value at the time of the accident, its mileage, and the damage amount. Market value is the base of the calculation. The damage amount is not added directly; instead its ratio to the market value places the claim in a severity band with a matching coefficient. Mileage is also banded, with the highest loss assumed for low-mileage cars and a stepped reduction as mileage rises, since a high-mileage car's value is already depressed.\n\nSeveral factors are weighed in the final assessment but are not inputs here: the vehicle's age, its make and model, the location of the damage (structural areas such as the chassis, pillars and roof are treated far more seriously than a door or wing), the number and nature of replaced parts, the parties' degrees of fault, and any pre-existing damage record. The binding amount is determined by an expert report and, where needed, the Insurance Arbitration Commission or the courts."
                },
                formulaText: {
                    tr: "Tahmini Değer Kaybı = Rayiç Bedel × Hasar Ağırlığı Katsayısı × Kilometre Katsayısı × Düzeltme Çarpanı. Hasar ağırlığı katsayısı, hasar tutarının rayiç bedele oranına göre dört kademede belirlenir: oran yüzde beşin altındaysa en düşük katsayı, yüzde beş ile on arası bir üst kademe, yüzde on ile yirmi arası bir üst kademe ve yüzde yirminin üzerinde en yüksek katsayı uygulanır. Kilometre katsayısı elli bin kilometreye kadar tam değerini korur, ardından yüz bin, yüz elli bin ve üzeri eşiklerinde kademeli olarak azalır. Sonuca ayrıca genel bir düzeltme çarpanı uygulanır ve tahmin tipik olarak rayiç bedelin yüzde beşi ile yüzde on altısı arasında bir bant içinde kalır.\n\nBu katsayılar yasal bir tarifeden veya resmi bir fiyat listesinden gelmez; yerleşik eksper uygulaması ve tazminat kararlarında gözlenen aralıklardan türetilmiş yaklaşık değerlerdir. Dolayısıyla sonuç bir ön-tahmindir, resmi bir formülün çıktısı değildir. Ödenecek kesin tutar eksper raporuyla, uyuşmazlık halinde ise Sigorta Tahkim Komisyonu veya mahkeme kararıyla belirlenir.",
                    en: "Estimated Value Loss = Market Value × Damage Severity Coefficient × Mileage Coefficient × Adjustment Factor. The severity coefficient is banded by the ratio of damage to market value: below five percent, five to ten, ten to twenty, and above twenty percent. The mileage coefficient holds at full value up to fifty thousand kilometres and steps down at the hundred thousand and hundred-and-fifty-thousand thresholds. Results typically fall between roughly five and sixteen percent of market value.\n\nThese coefficients do not come from a statutory tariff or an official price list; they are approximate values derived from established expert practice and observed compensation ranges. The figure is therefore a preliminary estimate, not the output of an official formula."
                },
                exampleCalculation: {
                    tr: "Kaza anındaki rayiç bedeli 800.000 TL olan, 60.000 kilometredeki bir araç için hesap şu adımlarla ilerler. Önce hasarın ağırlığı belirlenir: onarım faturası 100.000 TL ise, bu tutar rayiç bedelin yüzde 12,5'ine karşılık gelir. Bu oran yüzde on ile yirmi arasındaki kademeye girdiği için orta-üst düzeyde bir hasar ağırlığı katsayısı uygulanır. İkinci adımda kilometre kademesi bulunur: 60.000 kilometre, elli bin sınırının hemen üzerinde olduğu için kilometre katsayısı tam değerinden bir kademe aşağı iner. Son adımda rayiç bedel bu iki katsayı ve genel düzeltme çarpanıyla çarpılır; sonuç yaklaşık 97.000 TL tahmini değer kaybıdır, yani aracın değerinin kabaca yüzde on ikisi.\n\nBurada dikkat edilmesi gereken bir nokta var: hasar tutarı sonuca doğrudan yansımaz, yalnızca hangi kademeye düşüldüğünü belirler. Bu nedenle onarım faturasındaki küçük değişiklikler çoğu zaman sonucu hiç değiştirmez, ancak tutar bir kademe eşiğini aştığında sonuç sıçrama yapar. Aynı araçta hasar 160.000 TL olsaydı oran yüzde yirmiyi geçeceği için en yüksek kademeye girilir ve tahmin belirgin biçimde yükselirdi. Aynı şekilde araç 60.000 yerine 160.000 kilometrede olsaydı, kilometre katsayısı en alt kademeye ineceği için tahmin yaklaşık 76.000 TL'ye gerilerdi. Buradaki tutarlar yalnızca örnek amaçlıdır.",
                    en: "For a car with a market value of 800,000 TRY at the time of the accident and 60,000 km on the clock: a repair bill of 100,000 TRY equals 12.5 percent of market value, placing it in the ten-to-twenty percent band. At 60,000 km the mileage coefficient steps down one level from full. Multiplying market value by both coefficients and the adjustment factor gives roughly 97,000 TRY, about twelve percent of the car's value.\n\nNote that the damage amount does not feed through directly — it only selects the band. Small changes to the repair bill usually leave the result unchanged, but crossing a threshold makes it jump: at 160,000 TRY of damage the ratio would pass twenty percent and enter the top band. Likewise, at 160,000 km instead of 60,000 the estimate would fall to about 76,000 TRY. These figures are illustrative only."
                },
                miniGuide: {
                    tr: `<h3>Değer Kaybı Talebi Genel Olarak Nasıl İşler?</h3><p>Değer kaybı talebi genel olarak kusurlu tarafın zorunlu trafik sigortası şirketine yazılı başvuruyla başlar. Başvuruya kaza tespit tutanağı, ruhsat fotokopisi, onarım faturası veya ekspertiz raporu, aracın güncel kilometresini gösteren belge ve ödeme yapılacak banka hesap bilgileri eklenir. Sigorta şirketinin başvuruyu değerlendirmesi için mevzuatta bir süre öngörülür; bu süre içinde şirket ya ödeme yapar, ya kısmi ödeme teklif eder, ya da talebi gerekçesiyle birlikte reddeder. Süreler ve istenen belgeler zaman içinde değişebildiği için başvuru öncesinde ilgili sigorta şirketinden güncel listeyi teyit etmek yerinde olur.</p><h3>Eksper Raporunun Rolü</h3><p>Değer kaybının tutarı genellikle bağımsız bir eksperin incelemesiyle belirlenir. Eksper aracı fiziki olarak inceler; hasarın bölgesini, onarımın niteliğini, değiştirilen parçaları, aracın yaşını, kilometresini ve piyasadaki emsal fiyatları birlikte değerlendirir. Bu nedenle eksper raporunun sonucu, yalnızca üç değişkene bakan bir ön-tahminden farklı çıkabilir. Onarım öncesinde hasarın fotoğraflanması ve tüm belgelerin saklanması, sonraki değerlendirmeyi kolaylaştıran pratik bir alışkanlıktır.</p><h3>Talep Reddedilirse Genel Süreç</h3><p>Sigorta şirketi talebi reddederse veya teklif edilen tutar yetersiz bulunursa, uyuşmazlık genel olarak Sigorta Tahkim Komisyonu'na taşınabilir. Komisyon, sigorta uyuşmazlıkları için mahkemeye göre daha hızlı sonuçlanan bir çözüm yolu olarak öngörülmüştür ve başvuru için önce sigorta şirketine başvurulmuş olması aranır. Bu yolun yanı sıra genel hükümlere göre dava açılması da mümkündür. Hangi yolun uygun olduğu ve zamanaşımı süreleri olayın koşullarına göre değişebileceğinden, somut bir dosya için bir hukuk uzmanına danışmak en sağlıklısıdır.</p><h3>Sık Karşılaşılan Durumlar</h3><ul><li>Kazada tamamen kusurlu olan tarafın kendi aracı için değer kaybı talep edememesi</li><li>Hasar gören parçanın kazadan önce de değişmiş veya hasarlı olması hâlinde talebin sınırlanabilmesi</li><li>Onarım faturası, ekspertiz raporu gibi belgelerin saklanmaması nedeniyle tutarın ispatlanamaması</li><li>Talebin kendi kasko poliçesine yöneltilmesi; değer kaybı kural olarak kusurlu tarafın trafik sigortasından istenir</li><li>Değer kaybı ile onarım masrafının karıştırılması; bunlar ayrı kalemlerdir</li><li>Başvurunun geç yapılması nedeniyle zamanaşımı sorunuyla karşılaşılması</li></ul><p><em>Bu sayfadaki bilgiler genel bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz.</em></p>`,
                    en: `<h3>How a Claim Generally Works</h3><p>A value loss claim generally begins with a written application to the at-fault party's compulsory traffic insurer, supported by the accident report, vehicle registration, repair invoice or expert report, current mileage and bank details. Regulations set a period for the insurer to respond by paying, offering a partial amount, or refusing with reasons. Required documents and time limits can change, so confirm the current list with the insurer.</p><h3>The Role of the Expert Report</h3><p>The amount is usually set by an independent expert who inspects the car and weighs the damage location, quality of repair, replaced parts, age, mileage and comparable market prices — so the outcome can differ from a three-variable estimate. Photographing the damage before repair and keeping all paperwork makes the later assessment easier.</p><h3>If the Claim Is Refused</h3><p>If the insurer refuses or the offer is considered insufficient, the dispute can generally be taken to the Insurance Arbitration Commission, which requires that the insurer was approached first, or pursued through the courts. Which route fits and what limitation periods apply depend on the circumstances, so consult a legal professional for a specific case.</p><h3>Common Situations</h3><ul><li>A wholly at-fault driver cannot claim value loss for their own vehicle</li><li>Claims may be limited where the damaged part was already replaced or damaged</li><li>Missing invoices or reports make the amount hard to evidence</li><li>Directing the claim at one's own casco policy rather than the at-fault party's traffic insurance</li><li>Confusing value loss with repair costs — they are separate items</li><li>Applying late and running into limitation issues</li></ul><p><em>This page is general information and does not constitute legal advice.</em></p>`
                }
            },
            faq: [
                { q: { tr: "Araç değer kaybı nedir ve kimden alınır?", en: "What is vehicle value loss and who pays it?" }, a: { tr: "Araç değer kaybı, kazaya karışan aracın onarımı tamamlansa bile ikinci el piyasasındaki değerinin kaza öncesine göre düşük kalmasıdır. Hasar kaydı sorgu sistemlerinde göründüğü için alıcılar hasarsız emsallere kıyasla daha düşük fiyat verir. Bu fark, kural olarak kazada kusurlu olan tarafın zorunlu trafik sigortasından talep edilir; kendi kasko poliçenizden değil. Onarım masrafı ayrı bir kalemdir ve değer kaybı tazminatı onun yerine geçmez.", en: "Value loss is the drop in a car's second-hand value after an accident, even when repairs are complete, because the damage record is visible to buyers. It is generally claimed from the at-fault party's compulsory traffic insurance rather than your own casco policy, and it is separate from the repair cost." } },
                { q: { tr: "Değer kaybı talebinde zamanaşımı süresi nedir?", en: "What is the time limit for a value loss claim?" }, a: { tr: "Mevzuata göre trafik kazalarından doğan tazminat talepleri için genel olarak iki yıllık bir zamanaşımı süresi öngörülür; kaza aynı zamanda suç teşkil ediyorsa ceza hukukundaki daha uzun süreler uygulanabilir. Sürenin ne zaman işlemeye başladığı, zararın ve sorumlunun öğrenilmesi gibi koşullara göre değişebilir. Süreler mevzuat değişiklikleri ve olayın özelliklerine göre farklılık gösterebileceğinden, somut bir dosyada güncel durumu bir hukuk uzmanıyla doğrulamak gerekir.", en: "Regulations generally provide a two-year limitation period for compensation claims arising from traffic accidents, with longer criminal-law periods possible where the accident also constitutes an offence. When the period starts can depend on when the loss and the responsible party became known. Verify the current position for a specific case with a legal professional." } },
                { q: { tr: "Hangi kazalarda değer kaybı alınabilir, kusur şartı nedir?", en: "In which accidents can value loss be claimed?" }, a: { tr: "Değer kaybı, karşı tarafın kusurlu olduğu kazalarda gündeme gelir. Kazada tamamen kusurlu olan sürücü kendi aracı için değer kaybı talep edemez. Kusurun paylaşıldığı durumlarda tazminat genellikle karşı tarafın kusur oranıyla orantılı olarak değerlendirilir. Ayrıca hasar gören parçanın kazadan önce değişmemiş veya hasarsız olması, onarımın tamamlanmış olması ve hasarın belgelenebilmesi uygulamada aranan başlıca koşullardır.", en: "Value loss arises where the other party is at fault; a wholly at-fault driver cannot claim for their own vehicle. Where fault is shared, compensation is generally assessed in proportion to the other party's share. In practice the damaged part should not have been previously replaced or damaged, repairs should be complete, and the damage should be documented." } },
                { q: { tr: "Bu hesaplama kesin tutarı verir mi, eksper raporu şart mı?", en: "Does this calculation give the exact amount?" }, a: { tr: "Hayır, bu araç bir ön-tahmin verir. Hesaplama yalnızca rayiç bedel, kilometre ve hasar tutarını dikkate alır; aracın yaşı, marka ve modeli, hasarın bölgesi, değişen parça sayısı, kusur oranı ve önceki hasar kaydı gibi belirleyici unsurları girdi olarak almaz. Uygulamada tutar genellikle bağımsız bir eksperin aracı inceleyip bu unsurları birlikte değerlendirmesiyle belirlenir; uyuşmazlık halinde Sigorta Tahkim Komisyonu veya yargı süreci sonucunda kesinleşir.", en: "No — this is a preliminary estimate. It considers only market value, mileage and damage amount, and does not take the vehicle's age, make and model, damage location, number of replaced parts, degree of fault or prior damage record as inputs. In practice the amount is usually set by an independent expert weighing all of these, and finalised through the Insurance Arbitration Commission or the courts if disputed." } },
                { q: { tr: "Değer kaybı başvurusu nasıl yapılır?", en: "How is a value loss application made?" }, a: { tr: "Başvuru genel olarak kusurlu tarafın zorunlu trafik sigortası şirketine yazılı olarak yapılır. Dosyaya kaza tespit tutanağı, ruhsat fotokopisi, onarım faturası veya ekspertiz raporu, aracın güncel kilometresini gösteren belge ve banka hesap bilgileri eklenir. Sigorta şirketinin cevap vermesi için mevzuatta bir süre öngörülür. Talep reddedilir veya teklif yetersiz bulunursa uyuşmazlık genel olarak Sigorta Tahkim Komisyonu'na taşınabilir. İstenen belgeler ve süreler değişebildiğinden başvuru öncesi ilgili şirketten güncel listeyi teyit etmek yerinde olur.", en: "The application is generally made in writing to the at-fault party's compulsory traffic insurer, with the accident report, vehicle registration, repair invoice or expert report, current mileage and bank details. Regulations set a response period. If the claim is refused or the offer is insufficient, the dispute can generally be taken to the Insurance Arbitration Commission. Confirm the current document list and deadlines with the insurer beforehand." } }
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
            // Günlük ödenek = brüt/30 * 0.6, tavan = brüt asgari ücretin %150'si, damga vergisi %0.759
            const asgariUcret = 33030; // 2026 brüt asgari ücret
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
                tr: `<h3>Kısa Çalışma Ödeneği Nedir?</h3><p>Kısa çalışma ödeneği, işçinin son 12 aylık brüt kazancının %60'ı olarak hesaplanır ve 2026 brüt asgari ücretinin %150'si olan <strong>49.545 TL</strong> brüt tavanı geçemez. Ödenekten yalnızca damga vergisi kesilir.</p><h3>KÇÖ Şartları</h3><ul><li>İşverenin başvurusu</li><li>Son 3 yılda 600 gün prim</li><li>Son işyerinde 120 gün kesintisiz çalışma</li></ul><h3>Kaynaklar</h3><ul><li>İŞKUR</li><li>SGK</li><li>2026 Asgari Ücret</li></ul>`,
                en: "Short-time work allowance is 60% of the last 12 months' average gross earnings, capped at 150% of the minimum wage. Only stamp tax is deducted."
            },
            faq: [
                { q: { tr: "Kısa çalışma ödeneği alırken sağlık hizmetlerinden (SGK) yararlanılır mı?", en: "Can you benefit from health services (SGK) while receiving the allowance?" }, a: { tr: "Evet, SGK sağlık hizmetleri devam eder.", en: "Yes, health services continue." } },
                { q: { tr: "Kısa çalışma ödeneği işsizlik maaşından düşer mi?", en: "Does the allowance reduce unemployment benefit?" }, a: { tr: "Evet, KÇÖ süresi işsizlik maaşı süresinden düşülür.", en: "Yes, the allowance period is deducted from unemployment benefit duration." } }
            ]
        }
    }
];
