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
    "alan-hesaplama": (v) => {
            const shape = String(v.shape || "rectangle");
            const width = parseFloat(v.width) || 0;
            const height = parseFloat(v.height) || 0;
            const radius = parseFloat(v.radius) || 0;
            const topBase = parseFloat(v.topBase) || 0;

            if (shape === "triangle") {
                return { area: (width * height) / 2, formulaUsed: { tr: "Alan = taban × yükseklik / 2", en: "Area = base × height / 2" } as any };
            }

            if (shape === "circle") {
                return { area: Math.PI * radius * radius, formulaUsed: { tr: "Alan = πr²", en: "Area = πr²" } as any };
            }

            if (shape === "trapezoid") {
                return { area: ((width + topBase) * height) / 2, formulaUsed: { tr: "Alan = (Alt taban + Üst taban) × yükseklik / 2", en: "Area = (Bottom base + Top base) × height / 2" } as any };
            }

            return { area: width * height, formulaUsed: { tr: "Alan = genişlik × yükseklik", en: "Area = width × height" } as any };
        },
    "cevre-hesaplama": (v) => {
            const shape = String(v.shape || "rectangle");
            const a = parseFloat(v.a) || 0;
            const b = parseFloat(v.b) || 0;
            const c = parseFloat(v.c) || 0;
            const radius = parseFloat(v.radius) || 0;

            if (shape === "triangle") {
                return { perimeter: a + b + c, formulaUsed: { tr: "Çevre = a + b + c", en: "Perimeter = a + b + c" } as any };
            }

            if (shape === "circle") {
                return { perimeter: 2 * Math.PI * radius, formulaUsed: { tr: "Çevre = 2πr", en: "Perimeter = 2πr" } as any };
            }

            return { perimeter: 2 * (a + b), formulaUsed: { tr: "Çevre = 2 × (uzun kenar + kısa kenar)", en: "Perimeter = 2 × (long edge + short edge)" } as any };
        },
    "ebob-ekok-hesaplama": (v) => {
            let a = Math.abs(parseInt(v.num1, 10) || 0);
            let b = Math.abs(parseInt(v.num2, 10) || 0);
            const originalA = a;
            const originalB = b;

            while (b !== 0) {
                const temp = b;
                b = a % b;
                a = temp;
            }

            const gcd = a;
            const lcm = gcd > 0 ? Math.abs(originalA * originalB) / gcd : 0;
            const divisors: number[] = [];
            for (let i = 1; i <= gcd; i++) {
                if (gcd % i === 0) divisors.push(i);
            }

            return {
                gcd,
                lcm,
                commonDivisors: divisors.join(", "),
            };
        },
    "asal-carpan-hesaplama": (v) => {
            let n = Math.abs(parseInt(v.number, 10) || 0);

            if (n < 2) {
                return {
                    factorization: { tr: "2 ve üzeri sayı girin", en: "Enter a number greater than 1" } as any,
                    distinctPrimes: { tr: "-", en: "-" } as any,
                    divisorCount: 0,
                };
            }

            const factors: Record<number, number> = {};
            let divisor = 2;

            while (n > 1) {
                while (n % divisor === 0) {
                    factors[divisor] = (factors[divisor] || 0) + 1;
                    n /= divisor;
                }
                divisor += 1;
            }

            const distinct = Object.keys(factors).map(Number);
            const factorization = distinct.map((prime) => factors[prime] > 1 ? `${prime}^${factors[prime]}` : `${prime}`).join(" × ");
            const divisorCount = distinct.reduce((count, prime) => count * (factors[prime] + 1), 1);

            return {
                factorization,
                distinctPrimes: distinct.join(", "),
                divisorCount,
            };
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
    "altin-oran-hesaplama": (v) => {
            const total = parseFloat(v.length) || 0;
            const phi = 1.6180339887;
            const largePart = total / phi;
            const smallPart = total - largePart;
            return {
                largePart: largePart,
                smallPart: smallPart,
                ratioCheck: smallPart > 0 ? largePart / smallPart : 0
            };
        },
    "hacim-hesaplama": (v) => {
            const shape = v.shape || "cube";
            const a = parseFloat(v.a) || 0;
            const b = parseFloat(v.b) || 0;
            const h = parseFloat(v.h) || 0;
            
            let vol = 0;
            if (shape === "cube") vol = Math.pow(a, 3);
            else if (shape === "box") vol = a * b * h;
            else if (shape === "cylinder") vol = Math.PI * Math.pow(a, 2) * h;
            else if (shape === "sphere") vol = (4/3) * Math.PI * Math.pow(a, 3);

            return {
                volume: vol,
                liters: vol / 1000 // 1000 cm3 = 1 Litre
            };
        },
    "inc-hesaplama": (v) => {
            const type = v.type || "in2cm";
            const val = parseFloat(v.value) || 0;
            if (type === "in2cm") {
                return { result: val * 2.54 };
            } else {
                return { result: val / 2.54 };
            }
        },
    "metrekare-hesaplama": (v) => {
            const w = parseFloat(v.width) || 0;
            const l = parseFloat(v.length) || 0;
            return { sqm: w * l };
        },
    "mil-hesaplama": (v) => {
            const type = v.type || "mil2km";
            const val = parseFloat(v.value) || 0;
            // 1 Kara mili = 1.609344 km
            if (type === "mil2km") {
                return { result: val * 1.609344 };
            } else {
                return { result: val / 1.609344 };
            }
        },
    "koklu-sayi-hesaplama": (v) => {
            const num = parseFloat(v.number) || 0;
            if (num < 0) return { sqrt: "Tanımsız (-)", cbrt: Math.cbrt(num), root4: "Tanımsız (-)" };
            return {
                sqrt: Math.sqrt(num),
                cbrt: Math.cbrt(num),
                root4: Math.pow(num, 1/4)
            };
        },
    "uslu-sayi-hesaplama": (v) => {
            const base = parseFloat(v.base) || 0;
            const exp = parseFloat(v.exp) || 0;
            return { result: Math.pow(base, exp) };
        },
    "oran-hesaplama": (v) => {
            const a = parseFloat(v.a) || 0;
            const b = parseFloat(v.b) || 0;
            if (b === 0) return { decimal: 0, simplified: "Tanımsız (B=0)" };

            // Helper for GCD
            const gcd = (x: number, y: number): number => {
                x = Math.abs(x); y = Math.abs(y);
                while(y) {
                    let t = y;
                    y = x % y;
                    x = t;
                }
                return x;
            };

            // Calculate GCD for integer inputs
            let simp = "";
            if (Number.isInteger(a) && Number.isInteger(b)) {
                const divisor = gcd(a, b);
                simp = `${a/divisor} : ${b/divisor}`;
            } else {
                simp = "Sadece tam sayılar için";
            }

            return {
                decimal: a / b,
                simplified: simp
            };
        },
    "rastgele-sayi-hesaplama": (v) => {
            const min = Math.ceil(parseFloat(v.min) || 0);
            const max = Math.floor(parseFloat(v.max) || 0);
            
            if (min > max) {
                return { randomResult: "Hata: Min > Max" };
            }

            const rand = Math.floor(Math.random() * (max - min + 1)) + min;
            return { randomResult: rand };
        },
    "sayi-okunusu-hesaplama": (v) => {
            let str = (v.numberString || "").replace(/[^0-9]/g, "");
            if (!str) return { spelling: "" };
            if (str === "0") return { spelling: "Sıfır" };

            const ones = ["", "Bir ", "İki ", "Üç ", "Dört ", "Beş ", "Altı ", "Yedi ", "Sekiz ", "Dokuz "];
            const tens = ["", "On ", "Yirmi ", "Otuz ", "Kırk ", "Elli ", "Altmış ", "Yetmiş ", "Seksen ", "Doksan "];
            const scales = ["", "Bin ", "Milyon ", "Milyar ", "Trilyon ", "Katrilyon ", "Kentilyon "];
            
            let result = "";
            let scaleIdx = 0;

            // Pad the string to make its length a multiple of 3
            while (str.length % 3 !== 0) str = "0" + str;

            for (let i = str.length; i > 0; i -= 3) {
                const chunk = str.substring(i - 3, i);
                const a = parseInt(chunk[0]); // hundreds
                const b = parseInt(chunk[1]); // tens
                const c = parseInt(chunk[2]); // ones

                let chunkStr = "";

                if (a > 0) {
                    if (a === 1) chunkStr += "Yüz ";
                    else chunkStr += ones[a] + "Yüz ";
                }
                
                chunkStr += tens[b];
                
                if (c > 0) {
                    chunkStr += ones[c];
                }

                if (chunkStr.length > 0) {
                    // Handle "Bir Bin" exceptional case in Turkish -> "Bin"
                    if (scaleIdx === 1 && chunkStr === "Bir ") {
                        result = scales[scaleIdx] + result;
                    } else {
                        result = chunkStr + scales[scaleIdx] + result;
                    }
                }

                scaleIdx++;
                if (scaleIdx >= scales.length) break; // Exceeding kentilyon limit falls back loosely
            }

            return { spelling: result.trim() };
        },
    "taban-donusumu-hesaplama": (v) => {
            const numStr = (v.num || "").toString().trim();
            const fromB = parseInt(v.fromBase) || 10;
            const toB = parseInt(v.toBase) || 2;
            
            try {
                // Parse the string as integer from 'fromBase'
                const decimalValue = parseInt(numStr, fromB);
                if (isNaN(decimalValue)) {
                    return { converted: "Geçersiz Sayı / Taban Uyumu" };
                }
                // Convert decimalValue to 'toBase'
                const result = decimalValue.toString(toB).toUpperCase();
                return { converted: result };
            } catch (e) {
                return { converted: "Hata" };
            }
        },
    "moduler-aritmetik-hesaplama": (v) => {
            const a = parseFloat(v.a) || 0;
            const b = parseFloat(v.b) || 0;
            if (b === 0) return { remainder: 0, quotient: 0 };
            return {
                remainder: a % b,
                quotient: Math.floor(a / b)
            };
        },
    "standart-sapma-hesaplama": (v) => {
            const str = v.dataset || "";
            // Extract numbers safely
            const rawArr = str.split(',').map((x: string) => parseFloat(x.trim()));
            const arr = rawArr.filter((n: number) => !isNaN(n));

            if (arr.length < 2) {
                return { mean: 0, variance: 0, stdDev: 0 };
            }

            const n = arr.length;
            const mean = arr.reduce((acc: number, val: number) => acc + val, 0) / n;
            
            // Sample variance (n-1)
            const sumSq = arr.reduce((acc: number, val: number) => acc + Math.pow(val - mean, 2), 0);
            const variance = sumSq / (n - 1);
            const stdDev = Math.sqrt(variance);

            return {
                mean: mean,
                variance: variance,
                stdDev: stdDev
            };
        },
};
