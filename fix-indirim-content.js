const fs = require('fs');
let content = fs.readFileSync('lib/calculator-source.ts', 'utf8');

// Fix 1: indirim-hesaplama content - replace embedded backticks with code-like text
const oldIndirimContent = "            content: { tr: `### İndirimli Fiyat Nasıl Hesaplanır?\\n\\nAlışveriş sırasında sıkça \"Bu üründe %25 indirim var\" gibi ifadeler duyarız. Özellikle e-ticaret sitelerinde veya fiziksel perakende mağazalarında indirim tutarını doğru hesaplamak, tüketici kararları açısından çok önemlidir. Matematiksel olarak indirim bulma formülü şu şekildedir: `(Normal Fiyat) - (Normal Fiyat x İndirim Yüzdesi / 100)`.\\n\\nÖrneğin, 1000 TL olan bir ürüne %20 indirim geldiğinde, `1000 x 20 / 100` formülünden 200 TL'lik net indirimi bulursunuz. Kasada ödeyeceğiniz rakam `1000 - 200 = 800 TL` olacaktır. Bu esnada hem ürün bütçenizi korur, hem de gerçek kar oranınızı daha şeffaf bir şekilde görmüş olursunuz.`, en: \"Calculates final price from original price and either a percentage or fixed discount amount.\" },";

const newIndirimContent = "            content: { tr: `### İndirimli Fiyat Nasıl Hesaplanır?\\n\\nMağaza raflarında veya e-ticaret sitelerinde gördüğünüz indirim etiketinin arkasındaki matematik son derece basittir. **İndirim Tutarı = Normal Fiyat × (İndirim Yüzdesi / 100)** ve **İndirimli Fiyat = Normal Fiyat − İndirim Tutarı**.\\n\\nÖrneğin 1.200 TL fiyatlı bir çanta yüzde 30 indirime girdiğinde, indirim tutarı 1.200 × 0,30 = 360 TL'dir ve kasada ödenecek fiyat 1.200 − 360 = **840 TL** olur. Aynı ürüne ek yüzde 10 kampanya daha eklendiyse bu ikinci indirim 840 TL üzerinden hesaplanır: 840 × 0,10 = 84 TL daha iner, son fiyat 756 TL olur. İki indirimi doğrudan toplamayın: yüzde 30 ve yüzde 10'luk iki kampanya art arda uygulandığında toplam etki **yüzde 37'dir, yüzde 40 değil**. İndirim sonrası kârlılığı analiz etmek için <a href=\\"/ticaret-ve-is/kar-hesaplama\\" class=\\"text-blue-600 hover:text-blue-700 underline underline-offset-4\\">kâr hesaplama</a> ve <a href=\\"/matematik-hesaplama/yuzde-hesaplama\\" class=\\"text-blue-600 hover:text-blue-700 underline underline-offset-4\\">yüzde hesaplama</a> araçlarını birlikte kullanabilirsiniz.`, en: \"Calculates final price from original price and either a percentage or fixed discount amount.\" },";

if (content.includes(oldIndirimContent)) {
  content = content.replace(oldIndirimContent, newIndirimContent);
  console.log('Fix 1 (indirim content): OK');
} else {
  console.log('Fix 1 (indirim content): NOT FOUND - trying index search');
  const idx = content.indexOf('### İndirimli Fiyat Nasıl Hesaplanır?');
  console.log('Found at:', idx);
}

fs.writeFileSync('lib/calculator-source.ts', content, 'utf8');
console.log('Done. File length:', content.length);
