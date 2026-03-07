import { calculators } from "../lib/calculator-source";

let totalTested = 0;
let errors = [];

console.log("Starting Formula Stress Test for", calculators.length, "calculators...");

for (const calc of calculators) {
    totalTested++;

    // Build a mock 'values' object based on the defined inputs and their defaultValues or empty strings
    const mockValues: Record<string, any> = {};
    for (const input of calc.inputs) {
        if (input.defaultValue !== undefined) {
            mockValues[input.id] = input.defaultValue;
        } else if (input.type === 'number') {
            mockValues[input.id] = 10; // safe fallback
        } else if (input.type === 'text') {
            mockValues[input.id] = "Test";
        } else if (input.type === 'date') {
            mockValues[input.id] = "2024-01-01";
        } else {
            mockValues[input.id] = "";
        }
    }

    try {
        const result = calc.formula(mockValues);

        // Check if any returned result is NaN (which would crash the UI)
        for (const [key, val] of Object.entries(result)) {
            if (typeof val === 'number' && isNaN(val)) {
                errors.push(`Calculator "${calc.id}" returned NaN for result key "${key}". Inputs: ${JSON.stringify(mockValues)}`);
            }
        }

        // Also test with completely empty strings mimicking an empty form
        const emptyValues: Record<string, any> = {};
        for (const input of calc.inputs) {
            emptyValues[input.id] = "";
        }
        const emptyResult = calc.formula(emptyValues);
        for (const [key, val] of Object.entries(emptyResult)) {
            if (typeof val === 'number' && isNaN(val)) {
                errors.push(`Calculator "${calc.id}" returned NaN when fields are empty. Key "${key}".`);
            }
        }

    } catch (e: any) {
        errors.push(`Calculator "${calc.id}" threw an error: ${e.message}`);
    }
}

if (errors.length > 0) {
    console.error(`\n❌ Found ${errors.length} formula errors:`);
    errors.forEach(err => console.error("- " + err));
} else {
    console.log(`\n✅ All ${totalTested} calculator formulas executed safely without crashes or NaN outputs.`);
}
