const fs = require('fs');
let content = fs.readFileSync('lib/calculator-trust.ts', 'utf8');

const overrides = `
const slugTrustOverrides: Record<string, Partial<CalculatorTrustInfo>> = {
    'yuzde-hesaplama': {
        methodology: 'Evrensel matematiksel yüzde (percentage) formülleri kullanılmıştır.',
        reviewedLabel: 'Algoritma Kontrolü',
        editorName: 'HesapMod Matematik Ekibi',
    },
    'yas-hesaplama': {
        methodology: 'Miladi takvim standartlarına göre gün, ay ve yıl bazlı algoritmik zaman farkı kullanılmıştır.',
    },
    'indirim-hesaplama': {
        methodology: 'Ticari perakende indirim (discount) algoritmaları baz alınmıştır.',
    },
};
`;

content = content.replace('};\n\nexport function', '};\n\n' + overrides + '\nexport function');
content = content.replace('};\r\n\r\nexport function', '};\r\n\r\n' + overrides + '\r\nexport function');

content = content.replace('const reviewedAt = getCalculatorLastModified(slug);\n', 'const reviewedAt = getCalculatorLastModified(slug);\n    const slugOverride = slugTrustOverrides[slug] || {};\n');
content = content.replace('const reviewedAt = getCalculatorLastModified(slug);\r\n', 'const reviewedAt = getCalculatorLastModified(slug);\r\n    const slugOverride = slugTrustOverrides[slug] || {};\r\n');

content = content.replace('...trustContent,\n    };', '...trustContent,\n        ...slugOverride,\n    };');
content = content.replace('...trustContent,\r\n    };', '...trustContent,\r\n        ...slugOverride,\r\n    };');

fs.writeFileSync('lib/calculator-trust.ts', content);
