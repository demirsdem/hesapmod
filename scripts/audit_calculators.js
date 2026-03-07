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

function getProperty(objectLiteral, propertyName) {
    for (const property of objectLiteral.properties) {
        if (
            ts.isPropertyAssignment(property)
            && ts.isIdentifier(property.name)
            && property.name.text === propertyName
        ) {
            return property.initializer;
        }
    }

    return undefined;
}

function getStringProperty(objectLiteral, propertyName) {
    const value = getProperty(objectLiteral, propertyName);
    return value && ts.isStringLiteralLike(value) ? value.text : undefined;
}

function getCalculatorEntries() {
    const entries = [];

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
                const seo = getProperty(element, "seo");

                if (!id || !slug || !seo || !ts.isObjectLiteralExpression(seo)) {
                    continue;
                }

                entries.push({
                    id,
                    slug,
                    hasRichContent: Boolean(getProperty(seo, "richContent")),
                });
            }
        }
    }

    return entries;
}

const calculators = getCalculatorEntries();
const missingRichContent = calculators.filter((calculator) => !calculator.hasRichContent);

console.log(`Total Calculators Analyzed: ${calculators.length}`);
console.log(`Calculators Missing 'richContent': ${missingRichContent.length}`);

if (missingRichContent.length > 0) {
    console.log("Calculators without richContent:");
    missingRichContent.forEach((calculator) =>
        console.log(`- ${calculator.id} (${calculator.slug})`)
    );
} else {
    console.log("All calculators include richContent.");
}
