import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname),
        },
    },
    test: {
        // Yalnızca gerçek vitest suite'leri (describe/it) çalıştırılır.
        // lib/fx, lib/gold, components/kpss, components/smm ve
        // takdir-calc.test.ts dosyaları vitest suite'i DEĞİL — elle yazılmış
        // assertEqual kullanan, `tsx` ile çalıştırılan bağımsız script'ler.
        // Vitest bunları "no test suite found" diye reddeder; bu, bu
        // düzeltmeden ÖNCE de var olan bir uyumsuzluktur. Onları vitest
        // formatına taşımak ayrı bir iş (denetim Bulgu 15).
        include: ["lib/calculator-runtime/**/*.test.ts"],
    },
});
