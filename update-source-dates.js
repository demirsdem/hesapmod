const fs = require('fs');

let content = fs.readFileSync('lib/calculator-source.ts', 'utf8');

const overrides = ['yuzde-hesaplama', 'yas-hesaplama', 'indirim-hesaplama', 'kar-zarar-marji'];
const date = "2026-04-11";

for (const slug of overrides) {
    let regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?updatedAt:\\s*)["'][^"']*["']`, "g");
    if (regex.test(content)) {
        content = content.replace(regex, `$1"${date}"`);
    } else {
        // If updatedAt doesn't exist just add it after slug
        let addRegex = new RegExp(`(slug:\\s*"${slug}",)`);
        content = content.replace(addRegex, `$1\n        updatedAt: "${date}",`);
    }
}

fs.writeFileSync('lib/calculator-source.ts', content);
