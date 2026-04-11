const fs = require('fs');

let content = fs.readFileSync('lib/calculator-source.ts', 'utf8');

const regexMap = [
{
  slug: 'yuzde-hesaplama',
  seoContent: `### Yüzde Nasıl Hesaplanır?\n\nMatematikte yüzde hesaplama işlemi genellikle "bir bütünün 100 eşit parçaya bölündükten sonra ondan kaç adet alındığını" ifade etmek için kullanılır. Yüzde, "%" işaretiyle gösterilir. A sayısının %B'sini bulmak için evrensel formül \\\`A x B / 100\\\` şeklindedir.\n\nGünlük hayatta birçok alanda kullanılır. Örneğin bir giyim mağazasında 500 TL olan pantolonda uygulanan "%30 yaz indirimi", \\\`500 x 30 / 100 = 150 TL\\\` olarak hesaplanır. Böylece cebinize kalacak indirim bedeli bulunmuş olur. Benzer şekilde kredi çekerken ve mevduata para yatırırken uygulanan faizlerde veya marketlerde ödediğimiz katma değer vergisi (KDV) hesaplarının tamamında yüzde oranları baz alınır.`
},
{
  slug: 'yas-hesaplama',
  seoContent: `### Tam Yaş ve Doğum Tarihi Nasıl Hesaplanır?\n\nYaş hesaplama, doğum tarihinizden içinde bulunduğunuz bugüne veya seçeceğiniz herhangi bir güne kadar geçen sürenin yıl, ay ve gün cinsinden matematiksel olarak bulunması işlemidir. Araç bu süreyi doğrudan sayarken en çok 4 yılda bir gelen artık yıl (Şubat'ın 29 çektiği) faktörünü de kusursuz bir şekilde dahil eder.\n\nArtık yıllar yaş hesaplamasının kritik bir parçasıdır. Her 4 yılda bir yaşanan 366 günlük periyot dolayısıyla sadece kronolojik yaşımız değil hesaba katılan gün sayıları da etkilenir. Bu yüzden milimetrik hesaplama manuel yapıldığı zaman hatalar oluşabilir. Doğum tarihini girdiğinizde algoritma sadece yılları değil, ayların gün uzunluklarını ve artık yılları dikkate alarak biyolojik yaşınızı değil ama kronolojik yaşınızı eksiksiz hesaplar.`,
},
{
  slug: 'indirim-hesaplama',
  seoContent: `### İndirimli Fiyat Nasıl Hesaplanır?\n\nAlışveriş sırasında sıkça "Bu üründe %25 indirim var" gibi ifadeler duyarız. Özellikle e-ticaret sitelerinde veya fiziksel perakende mağazalarında indirim tutarını doğru hesaplamak, tüketici kararları açısından çok önemlidir. Matematiksel olarak indirim bulma formülü şu şekildedir: \\\`(Normal Fiyat) - (Normal Fiyat x İndirim Yüzdesi / 100)\\\`.\n\nÖrneğin, 1000 TL olan bir ürüne %20 indirim geldiğinde, \\\`1000 x 20 / 100\\\` formülünden 200 TL'lik net indirimi bulursunuz. Kasada ödeyeceğiniz rakam \\\`1000 - 200 = 800 TL\\\` olacaktır. Bu esnada hem ürün bütçenizi korur, hem de gerçek kar oranınızı daha şeffaf bir şekilde görmüş olursunuz.`,
},
{
  slug: 'kar-zarar-marji',
  seoContent: `### Brüt ve Net Kâr Marjı Nasıl Hesaplanır?\n\nKâr marjı, her işletme veya e-ticaret satıcısının ticari sürdürülebilirliğini korumak için bilmesi gereken en temel orandır. Kâr marjı genel anlamda gelirin (veya fiyatın) ne kadarının net kâr olarak kasada kaldığını gösterir. Temel olarak kâr marjı formülü: \\\`((Satış Fiyatı - Maliyet) / Satış Fiyatı) x 100\\\` şeklindedir.\n\nÖrneğin, 50 TL'ye ürettiğiniz bir ürünü 100 TL'ye satıyorsanız, aradaki brüt kârınız 50 TL'dir. Kâr marjınız ise \\\`((100 - 50) / 100) x 100\\\` işleminin sonucunda %50 çıkar. Brüt kâr marjında ürün maliyeti çıkarılırken, net kâr marjı hesabında vergiler (KDV, stopaj), kargo, reklam giderleri gibi son net maliyet kalemleri hesaba katılmalıdır.`,
}
];

for (const config of regexMap) {
  let seoContentRegex = new RegExp("(slug:\\s*\"" + config.slug + "\"[\\s\\S]*?seo:\\s*\\{[\\s\\S]*?content:\\s*\\{\\s*tr:\\s*)(['\"][\\s\\S]*?['\"]|(?:`[\\s\\S]*?`))", "g");
  content = content.replace(seoContentRegex, "$1" + "`" + config.seoContent + "`");
}

fs.writeFileSync('lib/calculator-source.ts', content);
