const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const sourcePath = path.resolve(__dirname, "..", "lib", "calculator-source.ts");
const sourceText = fs.readFileSync(sourcePath, "utf8");
const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
);

function getStringProperty(objectLiteral, propertyName) {
    for (const property of objectLiteral.properties) {
        if (
            ts.isPropertyAssignment(property)
            && ts.isIdentifier(property.name)
            && property.name.text === propertyName
            && ts.isStringLiteralLike(property.initializer)
        ) {
            return property.initializer.text;
        }
    }

    return undefined;
}

const slugs = [];

for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
        continue;
    }

    for (const declaration of statement.declarationList.declarations) {
        if (
            !ts.isIdentifier(declaration.name)
            || !declaration.initializer
            || !ts.isArrayLiteralExpression(declaration.initializer)
        ) {
            continue;
        }

        for (const element of declaration.initializer.elements) {
            if (!ts.isObjectLiteralExpression(element)) {
                continue;
            }

            const id = getStringProperty(element, "id");
            const slug = getStringProperty(element, "slug");

            if (id && slug) {
                slugs.push(slug);
            }
        }
    }
}

const duplicateCounts = slugs.reduce((accumulator, slug) => {
    accumulator.set(slug, (accumulator.get(slug) ?? 0) + 1);
    return accumulator;
}, new Map());

const duplicates = Array.from(duplicateCounts.entries())
    .filter(([, count]) => count > 1)
    .sort(([leftSlug], [rightSlug]) => leftSlug.localeCompare(rightSlug));

console.log("Total Source Calculator Definitions:", slugs.length);
console.log("Unique Source Slugs:", duplicateCounts.size);

if (duplicates.length > 0) {
    console.log("Duplicate source slugs found:");
    duplicates.forEach(([slug, count]) => {
        console.log(`- ${slug} (${count} definitions)`);
    });
    console.log("Note: the runtime layer keeps the latest definition when a legacy and updated calculator share the same slug.");
} else {
    console.log("No duplicate source slugs found.");
}
