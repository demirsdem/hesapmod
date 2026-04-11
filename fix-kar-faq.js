const fs = require('fs');
const content = fs.readFileSync('lib/calculator-source.ts', 'utf8');

const newFaq = `            faq: [
                { q: { tr: "Markup (Fiyatlandırma) ile Kâr Marjı arasındaki fark nedir?", en: "What is the difference between Markup and Profit Margin?" }, a: { tr: "Markup, maliyetin üstüne eklenen yüzdeyi gösterir ve maliyeti baz alır: (Kâr / Maliyet) × 100. Kâr marjı ise satış fiyatını baz alır: (Kâr / Satış Fiyatı) × 100. Örneğin 100 TL maliyetli ürünü 150 TL'ye satarken markup %50, kâr marjı %33,3'tür. E-ticarette pazar yeri komisyonları satış fiyatından kesildiği için marj üzerinden düşünmek daha doğrudur.", en: "Markup uses cost as the base: (Profit/Cost)×100. Margin uses selling price: (Profit/Sale)×100. Selling a 100 TL product for 150 TL gives 50% markup but only 33.3% margin." } },
                { q: { tr: "İdeal kâr marjı yüzde kaç olmalıdır?", en: "What should the ideal profit margin percentage be?" }, a: { tr: "Sektöre göre değişir: perakende giyimde %40-60, elektronikte %10-20, restoranlarda %3-9, e-ticarette komisyon ve kargo sonrası %15-30 bandı hedeflenir. Önemli olan brüt marjınızın tüm sabit ve değişken giderleri karşılayacak kadar yüksek tutulmasıdır.", en: "It varies by sector: apparel retail 40-60%, electronics 10-20%, restaurants 3-9%, e-commerce after fees 15-30%. The key is ensuring gross margin covers all fixed and variable costs." } },
                { q: { tr: "Brüt Kâr Marjı ve Net Kâr Marjı farkı nedir?", en: "What is the difference between Gross and Net Margin?" }, a: { tr: "Brüt kâr marjı yalnızca ürün maliyeti ile satış fiyatı arasındaki farka bakılarak hesaplanır. Net Kâr Marjı ise kira, personel, pazarlama ve vergi giderleri gibi tüm operasyonel masraflar düşüldükten sonra elde edilen orandır; gerçek kârlılığı gösterir.", en: "Gross margin subtracts only direct product cost. Net margin deducts all operational expenses — rent, payroll, marketing, taxes — to show real profitability." } },
                { q: { tr: "Pazar yerlerinde fiyatlama yaparken marj nasıl korunur?", en: "How to protect margin when pricing on marketplaces?" }, a: { tr: "Pazar yeri komisyonları (genellikle %15-25) satış fiyatı üzerinden kesilir. Maliyete komisyon ekleyip hedef marjı belirledikten sonra bu araç aracılığıyla gerçek satış fiyatınızı bulabilirsiniz.", en: "Marketplace commissions (15-25%) are deducted from selling price. Add all fees to cost first, then use this calculator to set your real target selling price." } }
            ],`;

// faqStart = 75784, end = 78693 (from earlier node run)
const faqStart = 75784;
const faqEnd = 78693;

const newContent = content.substring(0, faqStart) + newFaq + content.substring(faqEnd);
fs.writeFileSync('lib/calculator-source.ts', newContent, 'utf8');
console.log('Done. New length:', newContent.length);
