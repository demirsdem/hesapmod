import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "yuzde-hesaplama": (v) => {
            const op = v.operation || "type1";
            const a = parseFloat(v.valA) || 0;
            const b = parseFloat(v.valB) || 0;

            let result = 0;
            let explanationTr = "";
            let explanationEn = "";

            switch (op) {
                case "type1":
                    // A sayısının %B'si kaçtır?
                    result = (a * b) / 100;
                    explanationTr = `${a} sayısının %${b}'si ${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} yapar.`;
                    explanationEn = `${b}% of ${a} is ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`;
                    break;
                case "type2":
                    // A sayısı, B sayısının yüzde kaçıdır?
                    result = b !== 0 ? (a / b) * 100 : 0;
                    explanationTr = `${a} sayısı, ${b} sayısının %${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}'sidir.`;
                    explanationEn = `${a} is ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}% of ${b}.`;
                    break;
                case "type3":
                    // A sayısından B sayısına değişim oranı yüzde kaçtır?
                    result = a !== 0 ? ((b - a) / Math.abs(a)) * 100 : 0;
                    const isIncrease = result > 0;
                    explanationTr = `${a}'dan ${b}'ye değişim oranı %${Math.abs(result).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ${isIncrease ? 'Artış' : 'Azalış'}.`;
                    explanationEn = `Percentage change from ${a} to ${b} is a ${Math.abs(result).toLocaleString("en-US", { maximumFractionDigits: 2 })}% ${isIncrease ? 'Increase' : 'Decrease'}.`;
                    break;
                case "type4":
                    // A sayısı, %B kadar artırılırsa kaç olur?
                    const increaseAmt = (a * b) / 100;
                    result = a + increaseAmt;
                    explanationTr = `${a} sayısına %${b} eklendiğinde (${increaseAmt}) sonuç ${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} olur.`;
                    explanationEn = `${a} increased by ${b}% (${increaseAmt}) results in ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`;
                    break;
                case "type5":
                    // A sayısı, %B kadar azaltılırsa kaç olur?
                    const decreaseAmt = (a * b) / 100;
                    result = a - decreaseAmt;
                    explanationTr = `${a} sayısından %${b} çıkarıldığında (${decreaseAmt}) sonuç ${result.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} olur.`;
                    explanationEn = `${a} decreased by ${b}% (${decreaseAmt}) results in ${result.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`;
                    break;
            }

            return {
                result,
                explanation: (typeof window !== "undefined" && window.location.pathname.includes('/en/')) ? explanationEn : explanationTr
            };
        },
    "daire-alan-cevre": (v) => {
            const r = parseFloat(v.radius) || 0;
            return { area: Math.PI * r * r, perimeter: 2 * Math.PI * r, diameter: 2 * r };
        },
    "dikdortgen-alan-cevre": (v) => {
            const w = parseFloat(v.width) || 0;
            const h = parseFloat(v.height) || 0;
            return { area: w * h, perimeter: 2 * (w + h), diagonal: Math.sqrt(w * w + h * h) };
        },
    "us-kuvvet-karekok": (v) => {
            const base = parseFloat(v.base) || 0;
            const exp = parseFloat(v.exponent) || 2;
            return { power: Math.pow(base, exp), sqrt: Math.sqrt(Math.abs(base)), cbrt: Math.cbrt(base) };
        },
    "ortalama-hesaplama": (v) => {
            const nums = [v.n1, v.n2, v.n3, v.n4, v.n5]
                .map(x => parseFloat(x))
                .filter(x => !isNaN(x));
            const count = nums.length;
            if (count === 0) return { count: 0, sum: 0, arithmetic: 0, geometric: 0, median: 0, min: 0, max: 0 };
            const sum = nums.reduce((a, b) => a + b, 0);
            const arithmetic = sum / count;
            const geometric = Math.pow(nums.reduce((a, b) => a * b, 1), 1 / count);
            const sorted = [...nums].sort((a, b) => a - b);
            const median = count % 2 === 0
                ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
                : sorted[Math.floor(count / 2)];
            return { count, sum, arithmetic, geometric, median, min: sorted[0], max: sorted[count - 1] };
        },
    "kombinasyon-permutasyon-faktoriyel": (v) => {
            const n = Math.min(Math.floor(parseFloat(v.n) || 0), 20);
            const r = Math.min(Math.floor(parseFloat(v.r) || 0), n);
            const fact = (k: number): number => k <= 1 ? 1 : k * fact(k - 1);
            const nFact = fact(n);
            const rFact = fact(r);
            const perm = fact(n) / fact(n - r);
            const comb = perm / rFact;
            return { nFact, rFact, perm, comb };
        },
    "faktoriyel-hesaplama": (v) => {
            const n = Math.floor(parseFloat(v.num) || 0);
            if (n < 0) return { res: 0 };
            let f = 1;
            for (let i = 2; i <= n; i++) f *= i;
            return { res: f };
        },
    "ucgen-hesaplama": (v) => {
            const a = parseFloat(v.base) || 0;
            const h = parseFloat(v.height) || 0;
            const b = parseFloat(v.sideB) || a;
            const c = parseFloat(v.sideC) || a;
            const area = (a * h) / 2;
            const perimeter = a + b + c;
            return { area, perimeter };
        },
};
