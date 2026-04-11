const fs = require('fs');

let content = fs.readFileSync('lib/calculator-source.ts', 'utf8');

const regexMap = [
{
  slug: 'yuzde-hesaplama',
  title: 'Yüzde Hesaplama 2026 (Kolay ve Pratik Formül) | HesapMod',
  description: "Bir sayının yüzde X'ini, iki sayı arasındaki yüzde farkını veya artış/azalış oranını anında hesaplayın. Pratik yüzde hesaplama makinesi ve formülleri.",
  seoContent: `### Yüzde Nasıl Hesaplanır?\\n\\nMatematikte yüzde hesaplama işlemi genellikle "bir bütünün 100 eşit parçaya bölündükten sonra ondan kaç adet alındığını" ifade etmek için kullanılır. Yüzde, "%" işaretiyle gösterilir. A sayısının %B'sini bulmak için evrensel formül \\\`A x B / 100\\\` şeklindedir.\\n\\nGünlük hayatta birçok alanda kullanılır. Örneğin bir giyim mağazasında 500 TL olan pantolonda uygulanan "%30 yaz indirimi", \\\`500 x 30 / 100 = 150 TL\\\` olarak hesaplanır. Böylece cebinize kalacak indirim bedeli bulunmuş olur. Benzer şekilde kredi çekerken ve mevduata para yatırırken uygulanan faizlerde veya marketlerde ödediğimiz katma değer vergisi (KDV) hesaplarının tamamında yüzde oranları baz alınır.`,
  seoFaqTr: `[\n                { q: { tr: "Maaş zammı yüzdesi nasıl hesaplanır?", en: "How is percentage salary increase calculated?" }, a: { tr: "Yeni maaşı eski maaşa bölüp 1 çıkararak artış oranını bulabilirsiniz. Ardından 100 ile çarparak yüzde değerini elde edersiniz.", en: "Divide the new salary by the old one, subtract 1, and multiply by 100." } },\n                { q: { tr: "KDV yüzde hesaplaması nasıl yapılır?", en: "How is VAT percentage calculated?" }, a: { tr: "KDV dahil fiyati bulmak için matrah, 1 + (KDV Oranı / 100) ile çarpılır. Veya aracı kullanarak anında görebilirsiniz.", en: "Multiply the base amount by 1 + (VAT Rate / 100)." } }\n            ]`
},
{
  slug: 'yas-hesaplama',
  title: 'Yaş Hesaplama 2026 (Gün, Ay, Yıl Olarak Tam Yaşınız) | HesapMod',
  description: "Doğum tarihinizi girerek bugün tam olarak kaç yaşında olduğunuzu, kaç gün yaşadığınızı ve yeni yaşınıza ne kadar kaldığını anında hesaplayın.",
  seoContent: `### Tam Yaş ve Doğum Tarihi Nasıl Hesaplanır?\\n\\nYaş hesaplama, doğum tarihinizden içinde bulunduğunuz bugüne veya seçeceğiniz herhangi bir güne kadar geçen sürenin yıl, ay ve gün cinsinden matematiksel olarak bulunması işlemidir. Araç bu süreyi doğrudan sayarken en çok 4 yılda bir gelen artık yıl (Şubat'ın 29 çektiği) faktörünü de kusursuz bir şekilde dahil eder.\\n\\nArtık yıllar yaş hesaplamasının kritik bir parçasıdır. Her 4 yılda bir yaşanan 366 günlük periyot dolayısıyla sadece kronolojik yaşımız değil hesaba katılan gün sayıları da etkilenir. Bu yüzden milimetrik hesaplama manuel yapıldığı zaman hatalar oluşabilir. Doğum tarihini girdiğinizde algoritma sadece yılları değil, ayların gün uzunluklarını ve artık yılları dikkate alarak biyolojik yaşınızı değil ama kronolojik yaşınızı eksiksiz hesaplar.`,
  seoFaqTr: `[\n                { q: { tr: "Yaş hesaplarken doğduğum yıl 1 yaş sayılır mı?", en: "Is the birth year counted as 1 year when calculating age?" }, a: { tr: "Hayır. Doğduğunuz an 0. yaşınızın ilk günüdür. Tam bir yılı (365 günü) doldurduğunuz an 1. yaşınıza girmiş olursunuz.", en: "No. Age calculation starts from 0 years and 0 days." } },\n                { q: { tr: "Artık yıllar yaş hesaplamasını etkiler mi?", en: "Do leap years affect age calculation?" }, a: { tr: "Evet, toplam yaşanan gün sayısını bulurken artık yıllar (Şubat'ın 29 gün çekmesi) ve diğer ayların farkları dikkate alınmalıdır. Araç bunu otomatik yapar.", en: "Yes, leap years dynamically change the total count of days lived." } }\n            ]`
},
{
  slug: 'indirim-hesaplama',
  title: 'İndirim Hesaplama 2026 (Yüzde İndirimli Fiyat Bulma) | HesapMod',
  description: "Mağaza ve e-ticaret alışverişlerinizde uygulanan yüzde indirimleri, indirim tutarını ve ürünün son fiyatını kuruşu kuruşuna hesaplayın.",
  seoContent: `### İndirimli Fiyat Nasıl Hesaplanır?\\n\\nAlışveriş sırasında sıkça "Bu üründe %25 indirim var" gibi ifadeler duyarız. Özellikle e-ticaret sitelerinde veya fiziksel perakende mağazalarında indirim tutarını doğru hesaplamak, tüketici kararları açısından çok önemlidir. Matematiksel olarak indirim bulma formülü şu şekildedir: \\\`(Normal Fiyat) - (Normal Fiyat x İndirim Yüzdesi / 100)\\\`.\\n\\nÖrneğin, 1000 TL olan bir ürüne %20 indirim geldiğinde, \\\`1000 x 20 / 100\\\` formülünden 200 TL'lik net indirimi bulursunuz. Kasada ödeyeceğiniz rakam \\\`1000 - 200 = 800 TL\\\` olacaktır. Bu esnada hem ürün bütçenizi korur, hem de gerçek kar oranınızı daha şeffaf bir şekilde görmüş olursunuz.`,
  seoFaqTr: `[\n                { q: { tr: "Net indirim tutarı nasıl bulunur?", en: "How to calculate the net discount amount?" }, a: { tr: "İndirimsiz normal fiyattan ürüne uygulanan indirim oranının formüle (Fiyat x Oran / 100) sokulmasıyla net indirim tutarı bulunur.", en: "Normal Price x Discount Rate / 100 equals net discount." } },\n                { q: { tr: "İndirim üstüne indirim nasıl hesaplanır?", en: "How to calculate stacked discounts?" }, a: { tr: "Önce ilk indirim uygulanarak bir ara fiyat bulunur. Ardından ikinci indirim veya sepet indirimi bu ara fiyat (son fiyat) üzerinden tekrardan hesaplanır.", en: "First discount creates a middle price, the second discount is applied on that middle price." } }\n            ]`
},
{
  slug: 'kar-zarar-marji',
  title: 'Kâr Marjı Hesaplama 2026 (Brüt ve Net Kâr Oranı) | HesapMod',
  description: "Ürün maliyetinize ve satış fiyatınıza göre brüt kârınızı, net kârınızı ve kâr marjı yüzdenizi anında hesaplayın. Esnaflar ve e-ticaret için ticari araç.",
  seoContent: `### Brüt ve Net Kâr Marjı Nasıl Hesaplanır?\\n\\nKâr marjı, her işletme veya e-ticaret satıcısının ticari sürdürülebilirliğini korumak için bilmesi gereken en temel orandır. Kâr marjı genel anlamda gelirin (veya fiyatın) ne kadarının net kâr olarak kasada kaldığını gösterir. Temel olarak kâr marjı formülü: \\\`((Satış Fiyatı - Maliyet) / Satış Fiyatı) x 100\\\` şeklindedir.\\n\\nÖrneğin, 50 TL'ye ürettiğiniz bir ürünü 100 TL'ye satıyorsanız, aradaki brüt kârınız 50 TL'dir. Kâr marjınız ise \\\`((100 - 50) / 100) x 100\\\` işleminin sonucunda %50 çıkar. Brüt kâr marjında ürün maliyeti çıkarılırken, net kâr marjı hesabında vergiler (KDV, stopaj), kargo, reklam giderleri gibi son net maliyet kalemleri hesaba katılmalıdır.`,
  seoFaqTr: `[\n                { q: { tr: "Markup (Fiyatlandırma) ile Kâr Marjı arasındaki fark nedir?", en: "What is the difference between Markup and Profit Margin?" }, a: { tr: "Markup (kâr oranı) kârın maliyete olan oranıdır. Kâr marjı ise kârın ciroya (satış fiyatına) olan oranıdır. 100 TL ürün maliyeti ve 50 TL karda, markup %50 iken kâr marjı %33.3 olur.", en: "Markup is over cost, Margin is over sales price." } },\n                { q: { tr: "İdeal kâr marjı yüzde kaç olmalıdır?", en: "What is the ideal profit margin?" }, a: { tr: "Sektöre göre büyük ölçüde değişmekle birlikte e-ticarette net kar marjının en az %10-%20 seviyelerinde olması işletmenin büyümesi için genellikle makul bir limit kabul edilir.", en: "Usually 10%-20% net margin is seen as healthy in modern e-commerce." } }\n            ]`
}
];

function replaceProperty(str, propStartMatch, stopMatch, replacementStr) {
    let startIdx = str.indexOf(propStartMatch);
    if (startIdx === -1) return str;
    let endIdx = str.indexOf(stopMatch, startIdx + propStartMatch.length);
    if (endIdx === -1) return str;
    let newStr = str.substring(0, startIdx + propStartMatch.length) + replacementStr + str.substring(endIdx);
    return newStr;
}

for (const config of regexMap) {
  let slugIdx = content.indexOf(\`slug: "\${config.slug}"\`);
  if (slugIdx === -1) continue;

  let blockEndIdx = content.indexOf('category:', slugIdx + 1); // just a boundary
  let seoIdx = content.indexOf('seo: {', slugIdx);
  if (seoIdx === -1) continue;
  
  // replace title.tr
  let contentSlice = content.substring(seoIdx, seoIdx + 2000); // 2000 chars should be enough to cover seo
  let chunk = contentSlice;
  
  chunk = replaceProperty(chunk, 'title: { tr: ', ', en: ', '"' + config.title + '"');
  chunk = replaceProperty(chunk, 'metaDescription: { tr: ', ', en: ', '"' + config.description.replace(/"/g, '\\\\"') + '"');

  // content.tr can contain multiple commas before the end. We need to find `, en: `
  // let's use a regex to match precisely `content: { tr: ... , en: `
  chunk = chunk.replace(/(content:\s*\{\s*tr:\s*)([\s\S]*?)(\s*,\s*en:)/, \`$1\` + "\`" + config.seoContent + "\`" + \`$3\`);
  
  // faq replacement. from `faq: [` to `],`
  chunk = chunk.replace(/(faq:\s*\[)([\s\S]*?)(\]\s*,?\s*(?:richContent|\n\s*\}))/, \`faq: \${config.seoFaqTr}$3\`);
  
  content = content.substring(0, seoIdx) + chunk + content.substring(seoIdx + 2000);
  
  // update description near top of config
  let topSlice = content.substring(slugIdx, slugIdx + 1500);
  let topChunk = topSlice;
  topChunk = replaceProperty(topChunk, 'description: { tr: ', ', en: ', '"' + config.description.replace(/"/g, '\\\\"') + '"');
  topChunk = replaceProperty(topChunk, 'shortDescription: { tr: ', ', en: ', '"' + config.description.replace(/"/g, '\\\\"') + '"'); // optionally update short Description too if needed, or leave it. We'll only explicitly update description.
  
  content = content.substring(0, slugIdx) + topChunk + content.substring(slugIdx + 1500);

  // Update updatedAt
  let updateRegex = new RegExp(\`(slug:\\s*"\${config.slug}"[\\s\\S]*?updatedAt:\\s*)["'][^"']*["']\`);
  content = content.replace(updateRegex, \`\$1"2026-04-11"\`);
}

fs.writeFileSync('lib/calculator-source.ts', content);
