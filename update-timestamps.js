const fs = require('fs');
let content = fs.readFileSync('lib/content-last-modified.ts', 'utf8');

const date = '2026-04-11T12:00:00+03:00';
const overrides = ['yuzde-hesaplama', 'yas-hesaplama', 'indirim-hesaplama', 'kar-zarar-marji'];

for (const slug of overrides) {
    if (content.includes(`"${slug}":`)) {
        let regex = new RegExp(`("${slug}":\\s*)"[^"]*"`, 'g');
        content = content.replace(regex, `$1"${date}"`);
    } else {
        // Find existing list and add it
        content = content.replace(/(CALCULATOR_LAST_MODIFIED_OVERRIDES = \{)/, `$1\n    "${slug}": "${date}",`);
    }
}

fs.writeFileSync('lib/content-last-modified.ts', content);
