const fs = require('fs');
const lines = fs.readFileSync('lib/calculator-source.ts', 'utf8').split('\n');
const slugs = ['basit-faiz-hesaplama', 'kredi-taksit-hesaplama', 'yasal-faiz-hesaplama', 'asgari-ucret-hesaplama', 'kar-hesaplama'];
slugs.forEach(s => {
  const i = lines.findIndex(l => l.includes('"' + s + '"') && l.includes('slug'));
  console.log(s, '-> line', i + 1);
});
