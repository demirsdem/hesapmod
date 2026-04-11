const fs = require('fs');
let src = fs.readFileSync('lib/calculator-source.ts', 'utf8');

// Find indirim content via line number approach
const lines = src.split('\n');
for (let i = 12990; i < 13005; i++) {
  if (lines[i] && lines[i].includes('content:')) {
    console.log('Line', i+1, ':', lines[i].substring(0, 150));
  }
}

// Fix: replace the content line that has embedded backticks
// Line 12998 (index 12997)
const lineIdx = 12997;
const oldLine = lines[lineIdx];
if (oldLine && oldLine.includes('### İndirimli Fiyat')) {
  const newLine = "            content: { tr: \"Mağaza ve e-ticaret alışverişlerinde indirim hesaplama formülü: İndirimli Fiyat = Normal Fiyat − (Normal Fiyat × İndirim Yüzdesi / 100). " +
    "Örneğin 1.200 TL fiyatlı bir ürüne yüzde 30 indirim uygulandığında indirim tutarı 360 TL, kasada ödenecek fiyat 840 TL olur. " +
    "Dikkat: İki ayrı indirimi toplamayın — yüzde 30 ve yüzde 10 ardışık indirim yüzde 37 etki yapar, yüzde 40 değil.\", en: \"Calculates final price from original price and either a percentage or fixed discount amount.\" },";
  lines[lineIdx] = newLine;
  const result = lines.join('\n');
  fs.writeFileSync('lib/calculator-source.ts', result, 'utf8');
  console.log('Fixed indirim content line!');
} else {
  console.log('Line not found or mismatch');
  console.log('Actual line:', oldLine ? oldLine.substring(0, 200) : 'undefined');
}
