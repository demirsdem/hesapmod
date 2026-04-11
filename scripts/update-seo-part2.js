const fs = require('fs');

const data = [
  {
    slug: 'basit-faiz-hesaplama',
    title: 'Basit Faiz Hesaplama ve Formülü (Örneklerle) 2026 | HesapMod',
    desc: 'Anapara, faiz oranı ve vadeyi girerek basit faiz getirinizi anında hesaplayın. Basit faiz hesaplama formülü ve günlük, aylık, yıllık örnekler.',
    content: "### Basit Faiz Nasıl Hesaplanır? (Formül ve Örnekler)\\n\\nBasit faiz hesaplama formülü **A = P * r * t** şeklindedir (Anapara × Faiz Oranı × Süre). Bileşik faizin aksine basit faizde anaparadan kazanılan faiz tutarı tekrar hesaba katılmaz; her dönem yalnızca ilk yatırılan (veya borçlanılan) anapara üzerinden faiz işler. Bu yönüyle kısa vadeli mevduatlar, vadeli satışlar ve belirli senet hesaplamalarında sıkça kullanılan en temel getiri/maliyet göstergesidir.\\n\\n**Basit Faiz Hesaplama Örnekleri:**\\nÖrneğin cebinizde 10.000 TL var ve yıllık %20 basit faizle 1 yıllığına değerlendirmek istiyorsunuz. Bu durumda `10.000 × 0,20 × 1 = 2.000 TL` getiri elde edersiniz ve vade sonunda elinizdeki toplam para 12.000 TL olur. Süre 6 ay (0,5 yıl) olsaydı getiri `10.000 × 0,20 × 0,5 = 1.000 TL` olacaktı. Aracımız yıllık oranı otomatik olarak aylık veya günlük süreye uyarlayarak gerçek anlamda ne kadar kısa vadeli getiri kazanacağınızı hızlıca gösterir.",
    faq: `            faq: [
                { q: { tr: "Basit faiz ile bileşik faiz arasındaki fark nedir?", en: "What is the difference between simple and compound interest?" }, a: { tr: "Basit faizde faiz sadece yatırılan ana paranız üzerinden hesaplanır; bir önceki dönemde kazanılan faize tekrardan faiz işlemez. Bileşik faizde ise faiz paranın üzerine eklenir ve her dönem katlanarak büyür.", en: "Simple interest applies only to the principal. Compound interest applies to both the principal and the accumulated interest." } },
                { q: { tr: "Aylık ve günlük basit faiz formülü nasıldır?", en: "How does the formula work for monthly or daily calculations?" }, a: { tr: "Eğer yıllık oran üzerinden hesap yapıyorsanız; aylık hesaplamada süreyi 12'ye (Süre/12), günlük hesaplamada ise süreyi 365'e (Süre/365) bölerek formüle dahil etmelisiniz. Aracımız bu işlemi sizin için otomatik gerçekleştirir.", en: "For monthly, divide the term by 12. For daily, divide by 365. The calculator handles this automatically." } }
            ],`
  },
  {
    slug: 'kredi-taksit-hesaplama',
    title: 'Kredi Taksit ve Ödeme Planı Hesaplama 2026 | HesapMod',
    desc: 'Kredi tutarı, faiz oranı ve vadeye göre aylık taksit tutarınızı ve detaylı kredi ödeme planınızı kuruşu kuruşuna hesaplayın.',
    content: "### Kredi Aylık Taksiti ve Ödeme Planı Nasıl Oluşturulur?\\n\\nBankalardan çekilen ihtiyaç, taşıt veya konut kredilerinin geri ödemeleri oluşturulurken özel bir matematiksel model kullanılır. Tüketici için hazırlanan **kredi hesaplama ödeme planı** (amortisman tablosu) sayesinde çekilen kredinin aydan aya ne kadarlık kısmının anaparaya, ne kadarlık kısmının ise banka faizi ve vergilere gittiği şeffaf bir şekilde özetlenir.\\n\\nKredi taksitleri genellikle sabit taksitli olarak belirlenir. Sabit taksit ödemeli bir kredi planında ilk aylar ağırlıklı olarak faiz ödemesinden oluşur; çünkü faiz, kalan anapara bakiyesi üzerinden işletilir. Vade ilerleyip anapara azaldıkça, ödediğiniz sabit taksitin içerisindeki anapara payı artarken faiz ve vergi yükü azalır. Formül karmaşık görünse de aracımız anapara, vade ve aylık faiz oranına göre kredi faizini kuruşu kuruşuna tespit ederek size 120 aya kadar detaylı ve gerçekçi bir geri ödeme tablosu sunar.",
    faq: `            faq: [
                { q: { tr: "Kredi taksit hesaplamasına KKDF ve BSMV dahil midir?", en: "Are KKDF and BSMV taxes included in calculations?" }, a: { tr: "Evet, ticari olmayan standart tüketici kredilerinde faiz tutarı üzerinden genellikle %15 KKDF ve %15 BSMV uygulanır ve bu vergiler aylık taksit ödemenize halihazırda dahildir (Konut kredilerinde bu vergiler 0'dır).", en: "Yes, standard consumer loans apply typical taxes (KKDF/BSMV) which are implicitly integrated into consumer rate structuring." } },
                { q: { tr: "Taksitler sabit kalırken faiz ödemesi neden aydan aya düşer?", en: "Why does the interest portion drop while the payment remains fixed?" }, a: { tr: "Çünkü banka sisteminde (Amortisman mantığı) her yeni ayın faizi kalan anapara borcunuz üzerinden hesaplanır. Borcunuz her ay düzenli azaldığı için, sabit taksitin içindeki faiz payı düşer ve anapara ödemeniz o oranı artırır.", en: "Because interest is always calculated on the remaining balance. As the balance decreases each month, the interest portion shrinks." } }
            ],`
  },
  {
    slug: 'vergi-gecikme-faizi-hesaplama',
    title: 'Vergi Gecikme Zammı ve Faizi Hesaplama 2026 | HesapMod',
    desc: 'Ödenmemiş MTV, gelir vergisi, SGK ve trafik cezası borçlarınız için 2026 yılı güncel yasal oranlarıyla aylık/günlük gecikme zammı (faizi) hesaplayın.',
    content: "### Vergi Gecikme Zammı (Faizi) Nasıl Hesaplanır?\\n\\nKamuya olan vergi, prim veya ceza borçlarının vadesinde ödenmemesi durumunda amme alacağını korumak amacıyla borç tutarına her ay için belirli bir gecikme zammı eklenir. Resmi adı gecikme zammı olsa da, halk arasında genellikle **gecikme faizi hesaplama** olarak da bilinir ve Hazine ve Maliye Bakanlığı tarafından sık sık güncellenmektedir. 2026 yılı için belirlenen aylık yasal gecikme zammı oranı güncel olarak uygulanmaktadır ve faiz, tıpkı standart bir **vergi hesaplama** işlemindeki gibi basit faiz mantığı ile ilerler.\\n\\nDikkat edilmesi gereken en önemli nokta, gecikme zammında 'Ay Kesirlerinin Tam Ay Sayılması' prensibidir. Örneğin, borcunuzu ödemeniz gereken son tarihin üzerinden 1 ay ve 3 gün geçtiyse; tam geçilen 1 ay için direkt %3.7 (veya o dönemin açıklanmış oranı) uygulanır. Ancak artan 3 günlük kısım için aylık oran 30'a bölünerek günlük orana indirgenir ve ekstra tam bir ay faizi yüklenmeden tüketici korunmuş olur. Kamu borcu hesaplarken bu aracın verdiği tutarların vergi dairesinin fiili ekranındaki kuruş haneleriyle paralellik taşıması bu yüzdendir.",
    faq: `            faq: [
                { q: { tr: "Vergi gecikme zammı günlük mü, aylık mı işler?", en: "Does tax delay surcharge accrue daily or monthly?" }, a: { tr: "Gecikme zammı esasında aylık bazda işler. Tam geçen her ay için o oranın tamamı, geriye kalan ay kesirleri (küsuratlı günler) için ise aylık oranın ilgili güne isabet eden kısmı hesaplanarak eklenir.", en: "It accrues monthly. For fractional months (days), the calculation applies the daily equivalent of the monthly rate." } },
                { q: { tr: "Trafik cezalarına gecikme zammı uygulanır mı?", en: "Does delay surcharge apply to traffic tickets?" }, a: { tr: "Evet, trafik idari para cezalarının vadesinde (tebliğden 1 ay sonra) ödenmemesi durumunda her ay için özel bir gecikme hesaplaması yapılır ve ceza en fazla iki katına ulaşıncaya kadar ilgili yasal süreç uygulanmaya devam eder.", en: "Yes, delayed traffic fines incur a monthly penalty rate up to a legal maximum limit." } }
            ],`
  },
  {
    slug: 'asgari-ucret-hesaplama',
    title: 'Asgari Ücret Vergi Kesintisi ve Net Hesaplama 2026 | HesapMod',
    desc: '2026 yılı güncel asgari ücret brüt ve net tutarlarını, SGK ve işsizlik sigortası kesintilerini detaylı tablo halinde hesaplayın.',
    content: "### Asgari Ücretten Hangi Kesintiler Yapılır?\\n\\nİşverenle çalışanın ilk anlaşma rakamı genellikle Brüt asgari ücret tutarıdır ancak çalışanın eline geçen tutar, yasal kesintiler çıkarıldıktan sonra netleşir. Daha öncesinde oldukça komplike olan bir bordroda, **asgari ücret vergi kesintisi hesaplama** süreçleri yeni düzenlemelerle çok daha sade bir hal almıştır.\\n\\nEn güncel SGK ve Maliye kanunlarına göre çalışanın asgari ücretine kadar olan tüm gelirlerine Gelir Vergisi İstisnası ve Damga Vergisi İstisnası uygulanır. Bu demektir ki, eğer asgari ücretle çalışıyorsanız devlete gelir veya damga vergisi ödemezsiniz. Kesinti tablosunda uygulanan tek iki kalem bulunur: İlki **%14 oranındaki SGK İşçi Payı** ve ikincisi **%1 oranındaki İşsizlik Sigortası İşçi Payı**dır. Bu toplam %15'lik kesinti brüt maaş üzerinden yapıldıktan sonra kalan rakam, 2026 yılı aylık net asgari ücretiniz olarak hesabınıza yatırılır.",
    faq: `            faq: [
                { q: { tr: "Asgari ücretten gelir vergisi ve damga vergisi kesilir mi?", en: "Are income and stamp taxes deducted from minimum wage?" }, a: { tr: "Hayır. Asgari ücret istisnası uygulamaya girdikten sonra tüm asgari ücretli çalışanlar gelir vergisinden ve damga vergisinden tamamen muaf tutulmuştur.", en: "No. After the exemption regulations, minimum wage earnings are completely free from income tax and stamp duty." } },
                { q: { tr: "Asgari ücretlinin işverene toplam maliyeti nasıl hesaplanır?", en: "How is the total employer cost of a minimum wage calculated?" }, a: { tr: "Brüt asgari ücret üzerine, işveren SGK payı (%15,5 ila %20.5 teşvik durumuna göre) ve işveren işsizlik sigortası payı (%2) eklenir. Asgari ücretlinin net maaşından bağımsız olarak, işveren devlete de prim ödemesi gerçekleştirir.", en: "The employer cost adds the employer's share of social security (15.5% to 20.5%) and unemployment insurance (2%) on top of the gross minimum wage." } }
            ],`
  },
  {
    slug: 'kar-hesaplama',
    title: 'Kâr Payı ve Temettü Getirisi Hesaplama | HesapMod',
    desc: 'Hisse senedi yatırımlarınızın şirket kâr payı (temettü) verimini, stopaj kesintisini ve net getirisini hızlıca hesaplayın.',
    content: "### Kâr Payı (Temettü) Nasıl Hesaplanır?\\n\\nBorsada işlem gören veya kâr dağıtan şirketlere ortak (hissedar) olduğunuzda, şirketin net dönem kârı üzerinden size dağıttığı paya kâr payı ya da yaygın adıyla temettü denir. Portföy kazancınızı reel olarak anlamak istiyorsanız borsadaki **kar payi hesapla** modülleriyle elinize geçecek net rakamı görmek oldukça önemlidir; çünkü açıklanan temettü tutarı brüttür.\\n\\nŞirket bir hisse senedi başına 1.5 TL brüt nakit temettü açıkladıysa, elinizde de 10.000 adet hisse senedi varsa ilk bakışta 15.000 TL alacağınızı düşünürsünüz. Ancak brüt kâr payının üzerinden yasal bir Gelir Vergisi Stopajı (%10 oranında) kesilir ve doğrudan kaynağında vergi dairesine ödenir. Böylece hesabınıza geçecek net tutar, %10 kesinti düşüldükten sonra 13.500 TL olarak yansır. Nakit veriminizin, yatırdığınız anaparaya (veya hissenin güncel fiyatına) göre yıllık getiri oranına ise **Temettü Verimi** (Dividend Yield) denmektedir.",
    faq: `            faq: [
                { q: { tr: "Kâr payı (temettü) gelirinden vergi kesilir mi?", en: "Is there a tax deduction on dividend income?" }, a: { tr: "Evet, dağıtılan brüt kâr payı (temettü) üzerinden güncel vergi kanunlarına göre genellikle yasal stopaj vergisi kesintisi yapılır ve yatırımcı hesabına otomatik olarak NET tutar geçer.", en: "Yes, dividends are subject to a withholding tax (typically flat rate), and investors receive the NET amount directly in their accounts." } },
                { q: { tr: "Temettü verimliliği (Yield) nedir ve nasıl bulunur?", en: "What is Dividend Yield and how is it calculated?" }, a: { tr: "Dağıtılan net veya brüt kâr payının, hissenin o anki (veya maliyetlendiğiniz) fiyatına bölünmesiyle çıkan rasyodur. Formülü: (Dağıtılan Hisse Başı Temettü / Hisse Güncel Fiyatı) x 100. Şirketin yatırımınıza göre yıllık getiri gücünü yansıtır.", en: "Calculated by dividing the dividend per share by the current stock price. Formula: (Dividend per share / Stock price) x 100. It measures annual return rate." } }
            ],`
  }
];

let sourceCode = fs.readFileSync('lib/calculator-source.ts', 'utf8');

function updateCalculatorSeo(slug, newItem) {
  const startIdx = sourceCode.indexOf('slug: "' + slug + '"');
  if (startIdx === -1) {
    console.log('Skipping', slug, '- slug not found.');
    return;
  }
  
  const seoStartIdx = sourceCode.indexOf('seo: {', startIdx);
  if (seoStartIdx === -1) {
    console.log('Could not find seo object for', slug);
    return;
  }
  
  let blockEndIdx = -1;
  let depth = 0;
  for (let i = seoStartIdx + 'seo: {'.length; i < sourceCode.length; i++) {
    if (sourceCode[i] === '{') depth++;
    else if (sourceCode[i] === '}') {
      if (depth === 0) { blockEndIdx = i + 1; break; }
      depth--;
    }
  }
  
  if (blockEndIdx === -1) {
    console.log('Could not parse block bounds for', slug);
    return;
  }
  
  let seoBlock = sourceCode.substring(seoStartIdx, blockEndIdx);
  
  const titleStr = 'title: { tr: "' + newItem.title + '", en: "' + newItem.title.replace(' | HesapMod', '') + '" }';
  seoBlock = seoBlock.replace(/title:\s*{[\s\S]*?}/, titleStr);
  
  const descStr = 'metaDescription: { tr: "' + newItem.desc + '", en: "' + newItem.desc + '" }';
  seoBlock = seoBlock.replace(/metaDescription:\s*{[\s\S]*?}/, descStr);
  
  const contentStr = 'content: { tr: "' + newItem.content + '", en: "Evaluate your profitability and calculations." },';
  seoBlock = seoBlock.replace(/content:\s*{[\s\S]*?},/, contentStr);
  
  seoBlock = seoBlock.replace(/faq:\s*\[[\s\S]*?\],/, newItem.faq);

  sourceCode = sourceCode.substring(0, seoStartIdx) + seoBlock + sourceCode.substring(blockEndIdx);
  console.log('Successfully updated', slug);
}

for (const d of data) updateCalculatorSeo(d.slug, d);

fs.writeFileSync('lib/calculator-source.ts', sourceCode, 'utf8');
console.log('Updated calculator-source.ts');
