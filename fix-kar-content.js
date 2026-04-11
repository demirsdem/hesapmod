const fs = require('fs');
const content = fs.readFileSync('lib/calculator-source.ts', 'utf8');

// Find and replace the problematic content line 874 - template literal with embedded backticks
// The old content has: `...formülü: `((Satış...)`...görünür.`
// We need to replace the inner backticks with escaped version or different quotes

const oldContent = "            content: { tr: `### Brüt ve Net Kâr Marjı Nasıl Hesaplanır?\\n\\nKâr marjı, her işletme veya e-ticaret satıcısının ticari sürdürülebilirliğini korumak için bilmesi gereken en temel orandır. Kâr marjı genel anlamda gelirin (veya fiyatın) ne kadarının net kâr olarak kasada kaldığını gösterir. Temel olarak kâr marjı formülü: `((Satış Fiyatı - Maliyet) / Satış Fiyatı) x 100` şeklindedir.\\n\\nÖrneğin, 50 TL'ye ürettiğiniz bir ürünü 100 TL'ye satıyorsanız, aradaki brüt kârınız 50 TL'dir. Kâr marjınız ise `((100 - 50) / 100) x 100` işleminin sonucunda %50 çıkar. Brüt kâr marjında ürün maliyeti çıkarılırken, net kâr marjı hesabında vergiler (KDV, stopaj), kargo, reklam giderleri gibi son net maliyet kalemleri hesaba katılmalıdır.`, en: \"Evaluate your profitability using three different methods: determine margin from prices, calculate selling price from cost and markup, or deduce maximum cost from targeted price and markup.\" },";

const newContent2 = "            content: { tr: `### Brüt ve Net Kâr Marjı Nasıl Hesaplanır?\\n\\nKâr marjı, her işletme veya e-ticaret satıcısının ticari sürdürülebilirliğini korumak için bilmesi gereken en temel orandır. Formül son derece nettir: **Kâr Marjı (%) = ((Satış Fiyatı − Maliyet) / Satış Fiyatı) × 100**.\\n\\nÖrneğin, maliyeti 120 TL olan bir ürünü 200 TL'ye satıyorsanız kâr marjınız ((200 − 120) / 200) × 100 = **%40**'tır. Brüt kâr marjında yalnızca ürün maliyeti çıkarılır; net kâr marjında ise vergiler (KDV, stopaj), kargo ve reklam giderleri de hesaba katılmalıdır. Fiyatlandırma kararlarınızda <a href=\"/ticaret-ve-is/indirim-hesaplama\" class=\"text-blue-600 hover:text-blue-700 underline underline-offset-4\">indirim hesaplama</a> ve <a href=\"/ticaret-ve-is/kar-hesaplama\" class=\"text-blue-600 hover:text-blue-700 underline underline-offset-4\">kâr hesaplama</a> araçlarıyla birlikte kullanılabilir.`, en: \"Evaluate your profitability using three different methods: determine margin from prices, calculate selling price from cost and markup, or deduce maximum cost from targeted price and markup.\" },";

if (content.includes(oldContent)) {
  const result = content.replace(oldContent, newContent2);
  fs.writeFileSync('lib/calculator-source.ts', result, 'utf8');
  console.log('Fixed! New length:', result.length);
} else {
  console.log('OLD CONTENT NOT FOUND - trying partial match');
  const idx = content.indexOf('### Brüt ve Net Kâr Marjı Nasıl Hesaplanır?');
  console.log('Found at idx:', idx);
  if (idx > 0) {
    // Find line start
    const lineStart = content.lastIndexOf('\n', idx) + 1;
    // Find line end (next \n or \r\n)
    let lineEnd = content.indexOf('\n', idx);
    // Find character after closing }, 
    // The content block ends with }, \n
    const contentEnd = content.indexOf('en: "Evaluate your profitability', idx);
    if (contentEnd > 0) {
      const closingBrace = content.indexOf(' },', contentEnd);
      console.log('Content end at:', closingBrace);
      const segment = content.substring(lineStart, closingBrace + 4);
      console.log('Segment (first 200 chars):', segment.substring(0, 200));
    }
  }
}
