import type { CalculatorRuntimeMap } from "@/lib/calculator-types";
import { calculateBmi, calculateLoanPayment, calculateVatBreakdown, normalizeLoanType } from "@/mobile/src/sharedCalculations";

export const formulas: CalculatorRuntimeMap = {
    "ideal-kilo-hesaplama": (v) => {
            const h = parseFloat(v.height);
            if (!h || h < 140) return { robinson: 0, miller: 0, range: "-" };

            // Formula applies to inches over 5 feet (60 inches)
            const inchesOver5Ft = (h / 2.54) - 60;
            const over = inchesOver5Ft > 0 ? inchesOver5Ft : 0;

            let robinson, miller;
            if (v.gender === "male") {
                robinson = 52 + (1.9 * over);
                miller = 56.2 + (1.41 * over);
            } else {
                robinson = 49 + (1.7 * over);
                miller = 53.1 + (1.36 * over);
            }

            // WHO Healthy Range (BMI 18.5 - 24.9)
            const hMetres = h / 100;
            const minWeight = 18.5 * (hMetres * hMetres);
            const maxWeight = 24.9 * (hMetres * hMetres);

            const currW = parseFloat(v.weight);
            let status = undefined;
            if (currW > 0) {
                const avgIdeal = (robinson + miller) / 2;
                const diff = currW - avgIdeal;
                const bmi = currW / (hMetres * hMetres);
                let percentage = Math.min(100, Math.max(0, ((bmi - 15) / (35 - 15)) * 100));

                let textTr = "";
                let textEn = "";
                let colorClass = "bg-[#22c55e]";

                if (bmi < 18.5) {
                    textTr = `${Math.abs(diff).toFixed(1)} kg almalısınız.`;
                    textEn = `You need to gain ${Math.abs(diff).toFixed(1)} kg.`;
                    colorClass = "bg-yellow-500";
                    percentage = Math.max(5, percentage);
                } else if (bmi > 24.9 && bmi < 30) {
                    textTr = `${Math.abs(diff).toFixed(1)} kg vermelisiniz.`;
                    textEn = `You need to lose ${Math.abs(diff).toFixed(1)} kg.`;
                    colorClass = "bg-orange-500";
                } else if (bmi >= 30) {
                    textTr = `${Math.abs(diff).toFixed(1)} kg vermelisiniz. (Obezite)`;
                    textEn = `You need to lose ${Math.abs(diff).toFixed(1)} kg. (Obesity)`;
                    colorClass = "bg-destructive";
                } else {
                    textTr = `İdeal kilodasınız!`;
                    textEn = `You are at your ideal weight!`;
                    colorClass = "bg-[#22c55e]";
                    percentage = 50; // Pin it exactly in the middle of the "healthy" green band
                }

                status = {
                    percentage: percentage,
                    colorClass: colorClass,
                    text: { tr: textTr, en: textEn }
                };
            }

            return {
                robinson: robinson,
                miller: miller,
                range: `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)}` as any,
                ...(status ? { status } : {})
            };
        },
    "vucut-kitle-indeksi-hesaplama": (v) => {
            const { bmi, category } = calculateBmi({
                weightKg: v.weight,
                heightCm: v.height,
            });
            const statusMap = {
                missing: "Boy bilgisi girildiğinde sonuç görünür.",
                underweight: "Zayıf",
                normal: "Normal",
                overweight: "Fazla Kilolu",
                obese: "Obez",
            } as const;
            const status = statusMap[category];
            return { bmi, status };
        },
    "gunluk-kalori-ihtiyaci": (v) => {
            const w = parseFloat(v.weight) || 0;
            const h = parseFloat(v.height) || 0;
            const a = parseFloat(v.age) || 0;
            const act = parseFloat(v.activity) || 1.55;
            const bmr = v.gender === "male"
                ? 10 * w + 6.25 * h - 5 * a + 5
                : 10 * w + 6.25 * h - 5 * a - 161;
            const tdee = bmr * act;
            return { bmr: Math.round(bmr), tdee: Math.round(tdee), weightLoss: Math.round(tdee - 500) };
        },
    "gebelik-hesaplama": (v) => {
            const lmpStr = v.lmpDate;
            if (!lmpStr) {
                return {
                    dueDate: { tr: "-", en: "-" },
                    currentWeek: { tr: "-", en: "-" },
                    trimester: { tr: "-", en: "-" }
                } as any;
            }

            const lmp = new Date(lmpStr);
            const cycle = parseFloat(v.cycleLength) || 28;

            // Standard Naegele's rule assumes a 28-day cycle.
            // If cycle is longer or shorter, adjust the estimated conception date.
            const cycleAdjustment = cycle - 28;

            const dueDate = new Date(lmp.getTime());
            // Add 280 days (40 weeks) + cycle deviation
            dueDate.setDate(dueDate.getDate() + 280 + cycleAdjustment);

            const today = new Date();
            const msPassed = today.getTime() - lmp.getTime();
            const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24)) - cycleAdjustment;

            // If date is in the future
            if (daysPassed < 0) {
                return {
                    dueDate: {
                        tr: dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                        en: dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                    },
                    currentWeek: { tr: "Henüz başlamamış.", en: "Not started yet." },
                    trimester: { tr: "Bekleniyor", en: "Waiting" },
                    progress: { percentage: 0, colorClass: "bg-blue-400", text: { tr: "%0", en: "0%" } }
                } as any;
            }

            // A normal pregnancy lasts 280 days
            const weeksStr = Math.floor(daysPassed / 7);
            const extraDays = daysPassed % 7;

            let trimesterTr = "";
            let trimesterEn = "";
            if (weeksStr < 14) {
                trimesterTr = "1. Trimester (İlk 3 Aylık Dönem)";
                trimesterEn = "1st Trimester";
            } else if (weeksStr < 28) {
                trimesterTr = "2. Trimester (İkinci 3 Aylık Dönem)";
                trimesterEn = "2nd Trimester";
            } else {
                trimesterTr = "3. Trimester (Son 3 Aylık Dönem)";
                trimesterEn = "3rd Trimester";
            }

            const percentage = Math.min(100, Math.max(0, (daysPassed / 280) * 100));
            // Color shifts from pink to purple to green as pregnancy matures
            let colorCls = "bg-[#f472b6]"; // pink-400
            if (percentage > 33) colorCls = "bg-[#a855f7]"; // purple-500
            if (percentage > 66) colorCls = "bg-[#22c55e]"; // green-500

            if (percentage >= 100) {
                trimesterTr = "Doğum Bekleniyor!";
                trimesterEn = "Due Date Arrived!";
            }

            return {
                dueDate: {
                    tr: dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                    en: dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                } as any,
                currentWeek: {
                    tr: `${weeksStr} Hafta ${extraDays} Gün (${daysPassed} Gün)`,
                    en: `${weeksStr} Weeks ${extraDays} Days (${daysPassed} Days)`
                } as any,
                trimester: { tr: trimesterTr, en: trimesterEn } as any,
                progress: {
                    percentage: percentage,
                    colorClass: colorCls,
                    text: { tr: `%${percentage.toFixed(0)} Tamamlandı`, en: `${percentage.toFixed(0)}% Completed` }
                }
            };
        },
    "adet-gunu-hesaplama": (v) => {
            if (!v.lastPeriod) return { nextPeriod: { tr: "-", en: "-" }, daysUntil: { tr: "-", en: "-" }, cycle2: { tr: "-", en: "-" }, cycle3: { tr: "-", en: "-" } } as any;
            const last = new Date(v.lastPeriod);
            const cycle = parseInt(v.cycleLength) || 28;
            const dur = parseInt(v.periodDuration) || 5;
            const today = new Date();
            const next = new Date(last); next.setDate(next.getDate() + cycle);
            const next2 = new Date(next); next2.setDate(next2.getDate() + cycle);
            const next3 = new Date(next2); next3.setDate(next3.getDate() + cycle);
            const diff = Math.round((next.getTime() - today.getTime()) / 86400000);
            const fmt = (d: Date) => `${d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} – ${new Date(d.getTime() + dur * 86400000).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`;
            const fmtEn = (d: Date) => `${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} – ${new Date(d.getTime() + dur * 86400000).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`;
            const daysTr = diff < 0 ? `Gecikme: ${Math.abs(diff)} gün` : diff === 0 ? "Bugün başlıyor!" : `${diff} gün sonra`;
            const daysEn = diff < 0 ? `Late by ${Math.abs(diff)} days` : diff === 0 ? "Starts today!" : `In ${diff} days`;
            return {
                nextPeriod: { tr: fmt(next), en: fmtEn(next) } as any,
                daysUntil: { tr: daysTr, en: daysEn } as any,
                cycle2: { tr: fmt(next2), en: fmtEn(next2) } as any,
                cycle3: { tr: fmt(next3), en: fmtEn(next3) } as any,
            };
        },
    "asi-takvimi-hesaplama": (v) => {
            if (!v.birthDate) return { schedule: { tr: "Doğum tarihi giriniz.", en: "Please enter birth date." } } as any;
            const birth = new Date(v.birthDate);
            const addDays = (d: Date, days: number) => { const r = new Date(d); r.setDate(r.getDate() + days); return r; };
            const addMonths = (d: Date, m: number) => { const r = new Date(d); r.setMonth(r.getMonth() + m); return r; };
            const fmt = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            const vaccines = [
                { label: "Doğumda", vaccines: "Hepatit B (1. Doz), BCG (Verem)", date: birth },
                { label: "1. Ay", vaccines: "Hepatit B (2. Doz)", date: addMonths(birth, 1) },
                { label: "2. Ay", vaccines: "DBT-İPA-Hib (1. Doz), KPA (1. Doz), OPA (1. Doz)", date: addMonths(birth, 2) },
                { label: "4. Ay", vaccines: "DBT-İPA-Hib (2. Doz), KPA (2. Doz), OPA (2. Doz)", date: addMonths(birth, 4) },
                { label: "6. Ay", vaccines: "DBT-İPA-Hib (3. Doz), KPA (3. Doz), OPA (3. Doz), Hepatit B (3. Doz)", date: addMonths(birth, 6) },
                { label: "12. Ay", vaccines: "KPA (Rapel), Su Çiçeği (1. Doz), KKK (1. Doz)", date: addMonths(birth, 12) },
                { label: "18. Ay", vaccines: "DBT-İPA-Hib (Rapel), OPA (Rapel), Hepatit A (1. Doz)", date: addMonths(birth, 18) },
                { label: "24. Ay", vaccines: "Hepatit A (2. Doz)", date: addMonths(birth, 24) },
                { label: "İlkokul Girişi (6 Yaş)", vaccines: "DBT (Rapel), KKK (2. Doz), Su Çiçeği (2. Doz)", date: addMonths(birth, 72) },
            ];
            const today = new Date();
            const lines = vaccines.map(v2 => {
                const past = v2.date < today;
                const icon = past ? "✅" : "⏳";
                return `${icon} ${v2.label}: ${fmt(v2.date)} — ${v2.vaccines}`;
            }).join("\n");
            return { schedule: { tr: lines, en: lines } } as any;
        },
    "bazal-metabolizma-hizi-hesaplama": (v) => {
            const w = parseFloat(v.weight) || 0;
            const h = parseFloat(v.height) || 0;
            const a = parseFloat(v.age) || 0;
            const male = v.gender === "male";
            // Mifflin-St Jeor
            const bmr = male ? (10 * w + 6.25 * h - 5 * a + 5) : (10 * w + 6.25 * h - 5 * a - 161);
            // Harris-Benedict
            const hb = male ? (66.5 + 13.75 * w + 5.003 * h - 6.755 * a) : (655.1 + 9.563 * w + 1.85 * h - 4.676 * a);
            const avg = (bmr + hb) / 2;
            const txt = { tr: `Günde en az ${Math.round(avg)} kcal tüketmeniz sağlığınız için kritiktir. Bu değerin altına düşmek metabolizmanıza zarar verebilir.`, en: `You must consume at least ${Math.round(avg)} kcal/day for basic health. Going below this can harm your metabolism.` };
            return { bmr: Math.round(bmr), harrisBenedict: Math.round(hb), interpretation: txt as any };
        },
    "bebek-boyu-hesaplama": (v) => {
            const f = parseFloat(v.fatherHeight) || 0;
            const m = parseFloat(v.motherHeight) || 0;
            if (!f || !m) return { predicted: 0, range: "-", comment: { tr: "-", en: "-" } } as any;
            const male = v.childGender === "male";
            // Mid-Parental Height Formula
            const predicted = male ? ((f + m + 13) / 2) : ((f + m - 13) / 2);
            const low = (predicted - 8.5).toFixed(1);
            const high = (predicted + 8.5).toFixed(1);
            const comment = { tr: `Orta ebeveyn boy formülüne göre çocuğunuzun yetişkin boyu ${low}–${high} cm aralığında olması beklenir.`, en: `Based on the mid-parental formula, your child's adult height is expected to be between ${low}–${high} cm.` };
            return { predicted, range: `${low} – ${high} cm` as any, comment: comment as any };
        },
    "bebek-kilosu-hesaplama": (v) => {
            const age = parseInt(v.ageMonths) || 0;
            const w = parseFloat(v.weight) || 0;
            const male = v.gender === "male";
            // DSÖ erkek/kız medyan ağırlıkları (0-24 ay) kg
            const maleMedian = [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.8, 12.2];
            const femMedian = [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2, 10.4, 10.6, 10.9, 11.1, 11.5];
            const median = male ? (maleMedian[age] || 0) : (femMedian[age] || 0);
            const low3 = (median * 0.78).toFixed(1);
            const high97 = (median * 1.22).toFixed(1);
            let statusTr = "", statusEn = "";
            if (w < parseFloat(low3)) { statusTr = "⚠️ Düşük kilolu — Doktor kontrolü önerilir."; statusEn = "⚠️ Underweight — Doctor check recommended."; }
            else if (w > parseFloat(high97)) { statusTr = "⚠️ Yüksek kilolu — Doktor kontrolü önerilir."; statusEn = "⚠️ Overweight — Doctor check recommended."; }
            else { statusTr = "✅ Normal kilo aralığında."; statusEn = "✅ Within normal weight range."; }
            return { median, normalRange: `${low3} – ${high97} kg` as any, status: { tr: statusTr, en: statusEn } as any };
        },
    "bel-kalca-orani-hesaplama": (v) => {
            const waist = parseFloat(v.waist) || 0;
            const hip = parseFloat(v.hip) || 0;
            if (!waist || !hip) return { ratio: 0, risk: { tr: "-", en: "-" }, comment: { tr: "-", en: "-" } } as any;
            const ratio = waist / hip;
            const male = v.gender === "male";
            let riskTr = "", riskEn = "", commentTr = "", commentEn = "";
            if (male) {
                if (ratio < 0.90) { riskTr = "✅ Düşük Risk"; riskEn = "✅ Low Risk"; commentTr = "Sağlıklı bel/kalça oranına sahipsiniz."; commentEn = "You have a healthy waist-to-hip ratio."; }
                else if (ratio <= 0.99) { riskTr = "⚠️ Orta Risk"; riskEn = "⚠️ Moderate Risk"; commentTr = "Hafif artmış kardiyovasküler risk. Sağlıklı yaşam tarzı önerilir."; commentEn = "Slightly elevated cardiovascular risk. Healthy lifestyle recommended."; }
                else { riskTr = "🔴 Yüksek Risk"; riskEn = "🔴 High Risk"; commentTr = "Yüksek CardioVasküler risk! Doktor kontrolü ve yaşam tarzı değişikliği önerilir."; commentEn = "High cardiovascular risk! Doctor consultation and lifestyle changes recommended."; }
            } else {
                if (ratio < 0.80) { riskTr = "✅ Düşük Risk"; riskEn = "✅ Low Risk"; commentTr = "Sağlıklı bel/kalça oranına sahipsiniz."; commentEn = "You have a healthy waist-to-hip ratio."; }
                else if (ratio <= 0.84) { riskTr = "⚠️ Orta Risk"; riskEn = "⚠️ Moderate Risk"; commentTr = "Hafif artmış kardiyovasküler risk. Sağlıklı yaşam tarzı önerilir."; commentEn = "Slightly elevated cardiovascular risk. Healthy lifestyle recommended."; }
                else { riskTr = "🔴 Yüksek Risk"; riskEn = "🔴 High Risk"; commentTr = "Yüksek kardiyovasküler risk! Doktor kontrolü ve yaşam tarzı değişikliği önerilir."; commentEn = "High cardiovascular risk! Doctor consultation and lifestyle changes recommended."; }
            }
            return { ratio, risk: { tr: riskTr, en: riskEn } as any, comment: { tr: commentTr, en: commentEn } as any };
        },
    "dogum-tarihi-hesaplama": (v) => {
            const age = parseInt(v.age) || 0;
            const month = parseInt(v.birthMonth) || 1;
            const day = parseInt(v.birthDay) || 1;
            const today = new Date();
            const birthYear = today.getFullYear() - age - (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day) ? 1 : 0);
            const birth = new Date(birthYear, month - 1, day);
            const daysLived = Math.floor((today.getTime() - birth.getTime()) / 86400000);
            let nextBday = new Date(today.getFullYear(), month - 1, day);
            if (nextBday <= today) nextBday = new Date(today.getFullYear() + 1, month - 1, day);
            const daysToNext = Math.ceil((nextBday.getTime() - today.getTime()) / 86400000);
            const birthDateStr = { tr: birth.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }), en: birth.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) };
            const nextBdayStr = { tr: `${nextBday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} (${daysToNext} gün sonra)`, en: `${nextBday.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} (in ${daysToNext} days)` };
            return { birthDate: birthDateStr as any, daysLived, nextBirthday: nextBdayStr as any };
        },
    "gunluk-karbonhidrat-ihtiyaci-hesaplama": (v) => {
            const tdee = parseFloat(v.tdee) || 0;
            const pct = parseFloat(v.carbPercent) / 100 || 0.45;
            let targetCalories = tdee;
            if (v.goal === "lose") targetCalories = tdee - 500;
            else if (v.goal === "gain") targetCalories = tdee + 300;
            const carbCalories = targetCalories * pct;
            const carbGrams = carbCalories / 4; // 1g karbonhidrat = 4 kcal
            return { targetCalories: Math.round(targetCalories), carbCalories: Math.round(carbCalories), carbGrams };
        },
    "gunluk-kreatin-dozu-hesaplama": (v) => {
            const w = parseFloat(v.weight) || 0;
            const isLoading = v.phase === "loading";
            const dose = isLoading ? Math.round(w * 0.3 * 10) / 10 : Math.max(3, Math.round(w * 0.05 * 10) / 10);
            const dosesCapped = isLoading ? Math.min(dose, 20) : Math.min(dose, 5);
            const dosesTr = isLoading ? `Günde 4 eşit doza bölün (yaklaşık ${(dosesCapped / 4).toFixed(1)}g × 4)` : `Günde tek doz, tercihen egzersiz sonrası`;
            const dosesEn = isLoading ? `Split into 4 equal doses per day (~${(dosesCapped / 4).toFixed(1)}g × 4)` : `Single daily dose, preferably post-workout`;
            const noteTr = `Bol su (en az 2-3 L/gün) ile alın. Böbrek sorunlarınız varsa doktora danışın.`;
            const noteEn = `Take with plenty of water (at least 2-3 L/day). Consult a doctor if you have kidney issues.`;
            return { dose: dosesCapped, doses: { tr: dosesTr, en: dosesEn } as any, note: { tr: noteTr, en: noteEn } as any };
        },
    "gunluk-makro-besin-ihtiyaci-hesaplama": (v) => {
            const tdee = parseFloat(v.tdee) || 0;
            let target = tdee;
            if (v.goal === "lose") target = tdee - 500;
            else if (v.goal === "gain") target = tdee + 300;
            let pP = 0.30, pC = 0.40, pF = 0.30;
            if (v.diet === "lowcarb") { pP = 0.35; pC = 0.25; pF = 0.40; }
            else if (v.diet === "highcarb") { pP = 0.25; pC = 0.55; pF = 0.20; }
            const proteinG = (target * pP) / 4;
            const carbG = (target * pC) / 4;
            const fatG = (target * pF) / 9;
            return { targetCal: Math.round(target), proteinG, carbG, fatG };
        },
    "gunluk-protein-ihtiyaci-hesaplama": (v) => {
            const w = parseFloat(v.weight) || 0;
            let minR = 0.8, maxR = 1.0;
            switch (v.goal) {
                case "sedentary": minR = 0.8; maxR = 1.0; break;
                case "active": minR = 1.2; maxR = 1.6; break;
                case "muscle": minR = 1.6; maxR = 2.2; break;
                case "weightloss": minR = 1.8; maxR = 2.4; break;
            }
            const minProtein = Math.round(w * minR);
            const maxProtein = Math.round(w * maxR);
            const proteinCalories = Math.round(((minProtein + maxProtein) / 2) * 4);
            return { minProtein, maxProtein, proteinCalories };
        },
    "gunluk-su-ihtiyaci-hesaplama": (v) => {
            const w = parseFloat(v.weight) || 0;
            let base = w * 0.033; // 33ml/kg temel
            if (v.activity === "moderate") base += 0.5;
            else if (v.activity === "active") base += 1.0;
            if (v.climate === "hot") base += 0.5;
            else if (v.climate === "cool") base -= 0.2;
            const liters = Math.max(1.5, Math.round(base * 10) / 10);
            const glasses = Math.ceil(liters / 0.2);
            const freq = Math.round(glasses / 8);
            const reminderTr = `Her ${freq > 0 ? freq : 1} saatte bir 1 bardak (200ml) su içmeyi hedefleyin.`;
            const reminderEn = `Aim to drink 1 glass (200ml) every ${freq > 0 ? freq : 1} hour(s).`;
            return { liters, glasses, reminder: { tr: reminderTr, en: reminderEn } as any };
        },
    "gunluk-yag-ihtiyaci-hesaplama": (v) => {
            const tdee = parseFloat(v.tdee) || 0;
            const pct = parseFloat(v.fatPercent) / 100 || 0.30;
            let targetCalories = tdee;
            if (v.goal === "lose") targetCalories = tdee - 500;
            else if (v.goal === "gain") targetCalories = tdee + 300;
            const fatCalories = targetCalories * pct;
            const fatGrams = fatCalories / 9; // 1g yağ = 9 kcal
            return { targetCalories: Math.round(targetCalories), fatCalories: Math.round(fatCalories), fatGrams };
        },
    "sigara-maliyeti-hesaplama": (v) => {
            const perDay = parseFloat(v.cigarettesPerDay) || 0;
            const packPrice = parseFloat(v.packPrice) || 0;
            const perPack = parseFloat(v.cigarettesPerPack) || 20;
            const pricePerCig = packPrice / perPack;
            const dailyCost = perDay * pricePerCig;
            const monthlyCost = dailyCost * 30;
            const yearlyCost = dailyCost * 365;
            const fiveYearCost = yearlyCost * 5;
            return { dailyCost, monthlyCost, yearlyCost, fiveYearCost };
        },
    "sutyen-bedeni-hesaplama": (v) => {
            const ub = parseFloat(v.underbust) || 0;
            const fb = parseFloat(v.fullbust) || 0;
            if (!ub || !fb) return { bandSize: "-", cupSize: "-", usSize: "-", ukSize: "-" } as any;
            // TR/EU band: yuvarla 5'in katına
            const bandEU = Math.round(ub / 5) * 5;
            const diff = fb - ub;
            const cups = ["AA", "A", "B", "C", "D", "DD/E", "DDD/F", "G", "H"];
            const cupIdx = Math.max(0, Math.min(cups.length - 1, Math.floor(diff / 2.5)));
            const cup = cups[cupIdx];
            // US band = EU/2.54 → round to nearest 2 (inches)
            const bandUS = Math.round((ub / 2.54) / 2) * 2;
            // UK same as US
            return {
                bandSize: { tr: `${bandEU} cm`, en: `${bandEU} cm` } as any,
                cupSize: { tr: cup, en: cup } as any,
                usSize: { tr: `${bandUS}${cup}`, en: `${bandUS}${cup}` } as any,
                ukSize: { tr: `${bandUS}${cup}`, en: `${bandUS}${cup}` } as any,
            };
        },
    "vucut-yag-orani-hesaplama": (v) => {
            const h = parseFloat(v.height) || 0;
            const w = parseFloat(v.weight) || 0;
            const neck = parseFloat(v.neck) || 0;
            const waist = parseFloat(v.waist) || 0;
            const hip = parseFloat(v.hip) || 0;
            const male = v.gender === "male";
            if (!h || !neck || !waist) return { bodyFatPct: 0, fatMass: 0, leanMass: 0, category: { tr: "-", en: "-" } } as any;
            let bfp: number;
            if (male) {
                bfp = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
            } else {
                bfp = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
            }
            bfp = Math.max(3, Math.min(60, bfp));
            const fatMass = (w * bfp) / 100;
            const leanMass = w - fatMass;
            let catTr = "", catEn = "";
            if (male) {
                if (bfp < 6) { catTr = "⚡ Temel Yağ Seviyesi (Sporcu Alt Sınır)"; catEn = "⚡ Essential Fat (Athlete Lower Limit)"; }
                else if (bfp < 14) { catTr = "✅ Sporcu"; catEn = "✅ Athlete"; }
                else if (bfp < 18) { catTr = "💪 Fitness"; catEn = "💪 Fitness"; }
                else if (bfp < 25) { catTr = "👍 Kabul Edilebilir"; catEn = "👍 Acceptable"; }
                else { catTr = "⚠️ Obez"; catEn = "⚠️ Obese"; }
            } else {
                if (bfp < 14) { catTr = "⚡ Temel Yağ Seviyesi"; catEn = "⚡ Essential Fat"; }
                else if (bfp < 21) { catTr = "✅ Sporcu"; catEn = "✅ Athlete"; }
                else if (bfp < 25) { catTr = "💪 Fitness"; catEn = "💪 Fitness"; }
                else if (bfp < 32) { catTr = "👍 Kabul Edilebilir"; catEn = "👍 Acceptable"; }
                else { catTr = "⚠️ Obez"; catEn = "⚠️ Obese"; }
            }
            return { bodyFatPct: bfp, fatMass, leanMass, category: { tr: catTr, en: catEn } as any };
        },
    "yasam-suresi-hesaplama": (v) => {
            const age = parseFloat(v.age) || 0;
            // TR ortalama ömür: erkek 75.8, kadın 81.3 (TÜİK 2022)
            let base = v.gender === "male" ? 75.8 : 81.3;
            // Sigara
            if (v.smoking === "light") base -= 5;
            else if (v.smoking === "heavy") base -= 10;
            else if (v.smoking === "exsmoker") base -= 2;
            // VKİ
            if (v.bmi === "underweight") base -= 2;
            else if (v.bmi === "overweight") base -= 2;
            else if (v.bmi === "obese") base -= 5;
            // Egzersiz
            if (v.exercise === "none") base -= 3;
            else if (v.exercise === "light") base -= 1;
            else if (v.exercise === "active") base += 3;
            else base += 1; // moderate
            // Alkol
            if (v.alcohol === "heavy") base -= 5;
            else if (v.alcohol === "moderate") base += 0.5;
            const estimated = Math.round(Math.max(age, Math.min(100, base)));
            const remaining = Math.max(0, estimated - age);
            const assT = remaining > 30 ? { tr: "🌟 Harika! Sağlıklı yaşam tarzınız uzun bir ömre işaret ediyor.", en: "🌟 Great! Your healthy lifestyle points to a long life." }
                : remaining > 15 ? { tr: "👍 İyi. Küçük iyileştirmelerle daha uzun yaşayabilirsiniz.", en: "👍 Good. Small improvements can add meaningful years." }
                    : { tr: "⚠️ Risk faktörlerinizi azaltarak yaşam kalitenizi artırabilirsiniz.", en: "⚠️ Reducing risk factors can significantly improve your quality of life." };
            return { estimated, remaining, assessment: assT as any };
        },
    "yumurtlama-donemi-hesaplama": (v) => {
            if (!v.lastPeriod) return { ovulationDate: { tr: "-", en: "-" }, fertilityStart: { tr: "-", en: "-" }, fertilityEnd: { tr: "-", en: "-" }, nextPeriod: { tr: "-", en: "-" } } as any;
            const last = new Date(v.lastPeriod);
            const cycle = parseInt(v.cycleLength) || 28;
            const ovDay = cycle - 14; // Ovülasyon LH dalgalanmasından 14 gün önce
            const ovDate = new Date(last); ovDate.setDate(ovDate.getDate() + ovDay);
            const fsDate = new Date(ovDate); fsDate.setDate(fsDate.getDate() - 5);
            const feDate = new Date(ovDate); feDate.setDate(feDate.getDate() + 1);
            const npDate = new Date(last); npDate.setDate(npDate.getDate() + cycle);
            const fmt = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            const fmtEn = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            return {
                ovulationDate: { tr: `${fmt(ovDate)} (${ovDay}. gün)`, en: `${fmtEn(ovDate)} (Day ${ovDay})` } as any,
                fertilityStart: { tr: fmt(fsDate), en: fmtEn(fsDate) } as any,
                fertilityEnd: { tr: fmt(feDate), en: fmtEn(feDate) } as any,
                nextPeriod: { tr: fmt(npDate), en: fmtEn(npDate) } as any,
            };
        },
    "kusak-hesaplama": (v) => {
            const yr = parseFloat(v.year) || 1990;
            const KUSAK = [
                { ad: "Kayıp Kuşak", aralik: "1883–1900" },
                { ad: "En Büyük Kuşak", aralik: "1901–1927" },
                { ad: "Sessiz Kuşak", aralik: "1928–1945" },
                { ad: "Baby Boomers", aralik: "1946–1964" },
                { ad: "X Kuşağı", aralik: "1965–1980" },
                { ad: "Y Kuşağı (Millennials)", aralik: "1981–1996" },
                { ad: "Z Kuşağı", aralik: "1997–2012" },
                { ad: "Alfa Kuşağı", aralik: "2013–2025" },
            ];
            const k = yr <= 1900 ? KUSAK[0]
                : yr <= 1927 ? KUSAK[1]
                    : yr <= 1945 ? KUSAK[2]
                        : yr <= 1964 ? KUSAK[3]
                            : yr <= 1980 ? KUSAK[4]
                                : yr <= 1996 ? KUSAK[5]
                                    : yr <= 2012 ? KUSAK[6]
                                        : KUSAK[7];
            return { kusak: k.ad as unknown as number, aralik: k.aralik as unknown as number, yas: 2026 - yr };
        },
    "dogum-izni-hesaplama": (v) => {
            const parts = v.dueDate.split("-");
            if (parts.length !== 3) return { startLeave: "-", birthEstimate: "-", endLeave: "-", raporParasi: 0 };
            const due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

            // İzin başlangıcını belirleme
            // Standart: tekilde 8, çoğulda 10 hafta önce. 37'ye kadar çalışırsa her ikisinde de 3 hafta önce izne ayrılır (40 - 37 = 3).
            let weeksBefore = v.multi === "yes" ? 10 : 8;
            if (v.workUntil37 === "yes") {
                weeksBefore = 3;
            }

            const startLeave = new Date(due.getTime());
            startLeave.setDate(due.getDate() - (weeksBefore * 7));

            // Toplam izin süresi değişmez: Çoğulda 18 hafta (126 gün), tekilde 16 hafta (112 gün)
            const totalDurationWeeks = v.multi === "yes" ? 18 : 16;
            const end = new Date(startLeave.getTime());
            end.setDate(startLeave.getDate() + (totalDurationWeeks * 7));

            // Rapor Parası Hesabı
            const minWage = 33030; // 2026 Asgari Brüt Ücret
            let gross = parseFloat(v.grossSalary) || minWage;
            if (gross < minWage) gross = minWage;

            const dailyGross = gross / 30;
            const totalDays = totalDurationWeeks * 7;
            const raporParasi = totalDays * (dailyGross * (2 / 3)); // Ayakta tedavi oranı %66.6

            return {
                startLeave: startLeave.toLocaleDateString("tr-TR") as unknown as number,
                birthEstimate: due.toLocaleDateString("tr-TR") as unknown as number,
                endLeave: end.toLocaleDateString("tr-TR") as unknown as number,
                raporParasi: raporParasi
            };
        },
    "hamilelik-haftasi-hesaplama": (v) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Yerel saatte gece yarısı

            const parts = v.lmp.split("-");
            if (parts.length !== 3) return { week: "-", day: "-", month: "-", dueDate: "-" };
            const lmp = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

            const diffMs = today.getTime() - lmp.getTime();
            // Eğer tarih gelecekteyse 0 kabul edelim
            const totalDays = diffMs < 0 ? 0 : Math.floor(diffMs / 86400000);
            const weeks = Math.floor(totalDays / 7);
            const days = totalDays % 7;
            const month = Math.floor(weeks / 4) + 1;

            const due = new Date(lmp.getTime());
            due.setDate(lmp.getDate() + 280); // 40 hafta = 280 gün

            return {
                week: weeks,
                day: days,
                month: Math.min(month, 9),
                dueDate: due.toLocaleDateString("tr-TR") as unknown as number
            };
        },
    "ebced-hesaplama": (v) => {
            const table: Record<string, number> = {
                'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 80, 'g': 1000, 'h': 8, 'i': 10, 'j': 3, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 'o': 6, 'p': 2, 'r': 200, 's': 60, 't': 400, 'u': 6, 'v': 6, 'y': 10, 'z': 7,
                'ı': 10, 'ş': 300, 'ğ': 1000, 'ç': 3, 'ö': 6, 'ü': 6
            };
            const input = (v.text || "").toLowerCase();
            let sum = 0;
            for (let char of input) {
                sum += (table[char] || 0);
            }
            return { value: sum };
        },
    "gunluk-kalori-ihtiyaci-hesaplama": (v) => {
            const age = parseFloat(v.age) || 0;
            const weight = parseFloat(v.weight) || 0;
            const height = parseFloat(v.height) || 0;
            const act = parseFloat(v.activity) || 1.2;
            
            // Mifflin-St Jeor Equation
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            if (v.gender === "male") bmr += 5;
            else bmr -= 161;
            
            const maintain = bmr * act;
            
            return {
                maintain: maintain,
                lose: maintain - 500, // Deficit of 500 kcal
                gain: maintain + 500  // Surplus of 500 kcal
            };
        },
    "vucut-kitle-endeksi-hesaplama": (v) => {
            const w = parseFloat(v.weight) || 0;
            const h = parseFloat(v.height) / 100 || 1; // convert to meters
            const bmi = w / (h * h);
            
            let stat = "";
            if (bmi < 18.5) stat = "Zayıf";
            else if (bmi < 24.9) stat = "Normal";
            else if (bmi < 29.9) stat = "Fazla Kilolu";
            else if (bmi < 34.9) stat = "Obez (Sınıf 1)";
            else if (bmi < 39.9) stat = "Obez (Sınıf 2)";
            else stat = "Aşırı Obez (Sınıf 3)";
            
            const idealW = 22 * (h * h); // Targeting BMI 22

            return {
                bmi: bmi,
                status: stat,
                ideal: idealW
            };
        },
    "kible-yonu-hesaplama": (v) => {
            const lat = parseFloat(v.lat) || 0;
            const lon = parseFloat(v.lon) || 0;
            
            // Mecca coordinates
            const kabeLat = 21.422487;
            const kabeLon = 39.826206;

            const toRad = (deg: number) => deg * Math.PI / 180;
            const toDeg = (rad: number) => rad * 180 / Math.PI;

            const latRad = toRad(lat);
            const kabeLatRad = toRad(kabeLat);
            const deltaLon = toRad(kabeLon - lon);

            const y = Math.sin(deltaLon) * Math.cos(kabeLatRad);
            const x = Math.cos(latRad) * Math.sin(kabeLatRad) - Math.sin(latRad) * Math.cos(kabeLatRad) * Math.cos(deltaLon);
            
            let qiblaRad = Math.atan2(y, x);
            let qiblaDeg = toDeg(qiblaRad);
            
            if (qiblaDeg < 0) {
                qiblaDeg += 360;
            }

            return { qiblaAngle: qiblaDeg };
        },
    "koordinat-hesaplama": (v) => {
            const d = parseFloat(v.deg) || 0;
            const m = parseFloat(v.min) || 0;
            const s = parseFloat(v.sec) || 0;
            
            // Formula: DD = d + (min/60) + (sec/3600)
            const isNeg = d < 0;
            const absD = Math.abs(d);
            let dd = absD + (m / 60) + (s / 3600);
            
            if (isNeg) dd = -dd;

            return { decimalCoord: dd };
        },
    "kalori-yakma-hesaplama": (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const duration = Math.max(0, Number(v.duration) || 0);
            const met = Math.max(0, Number(v.met) || 0);
            const calories = (met * 3.5 * weight / 200) * duration;
            return {
                calories,
                hourlyBurn: duration > 0 ? calories / duration * 60 : 0,
                note: "Sonuç MET tabanlı tahmindir; nabız, kondisyon, eğim ve hareket tekniği gerçek harcamayı değiştirebilir.",
            };
        },
    "adim-kalori-hesaplama": (v) => {
            const steps = Math.max(0, Number(v.steps) || 0);
            const strideCm = Math.max(0, Number(v.strideCm) || 0);
            const weight = Math.max(0, Number(v.weight) || 0);
            const distanceKm = steps * strideCm / 100000;
            const calories = distanceKm * weight * 0.57;
            return {
                distanceKm,
                calories,
                note: "Yürüyüş temposu, eğim ve zemine göre kalori harcaması değişebilir.",
            };
        },
    "nabiz-araligi-hesaplama": (v) => {
            const age = Math.max(1, Number(v.age) || 0);
            const restingHr = Math.max(0, Number(v.restingHr) || 0);
            const maxHr = 220 - age;
            const reserve = Math.max(0, maxHr - restingHr);
            const zone = (low: number, high: number) => `${Math.round(restingHr + reserve * low)}-${Math.round(restingHr + reserve * high)} bpm`;
            return {
                maxHr,
                fatBurnZone: zone(0.6, 0.7),
                aerobicZone: zone(0.7, 0.8),
                hardZone: zone(0.8, 0.9),
            };
        },
    "cocuk-bmi-hesaplama": (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const heightM = Math.max(0, Number(v.height) || 0) / 100;
            const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;
            return {
                bmi,
                interpretation: "Çocuklarda BMI tek başına yetişkin sınırlarıyla yorumlanmaz; yaşa ve cinsiyete göre persentil eğrisi gerekir.",
                nextStep: "Düzenli büyüme takibi için çocuk doktoru veya diyetisyen değerlendirmesi önerilir.",
            };
        },
    "alkol-promil-hesaplama": (v) => {
            const weight = Math.max(1, Number(v.weight) || 1);
            const drinkCount = Math.max(0, Number(v.drinkCount) || 0);
            const gramsPerDrink = Math.max(0, Number(v.gramsPerDrink) || 0);
            const hours = Math.max(0, Number(v.hours) || 0);
            const r = v.gender === "female" ? 0.55 : 0.68;
            const rawPromil = (drinkCount * gramsPerDrink) / (r * weight);
            const promil = Math.max(0, rawPromil - 0.15 * hours);
            return {
                promil,
                remainingHours: promil / 0.15,
                warning: "Bu tahmin araç kullanımı için güvenli sınır vaadi vermez. Yasal ve tıbbi değerlendirmede resmi ölçüm esastır.",
            };
        },
    "uyku-suresi-hesaplama": (v) => {
            const parseTimeValue = (value: string) => {
                const [hour, minute] = String(value || "00:00").split(":").map((item) => Number(item));
                if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
                return hour * 60 + minute;
            };
            const formatClock = (totalMinutes: number) => {
                const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
                const hour = Math.floor(normalized / 60).toString().padStart(2, "0");
                const minute = (normalized % 60).toString().padStart(2, "0");
                return `${hour}:${minute}`;
            };
            const wake = parseTimeValue(v.wakeTime);
            const fallAsleep = Math.max(0, Number(v.fallAsleepMinutes) || 0);
            return {
                sixCycles: formatClock(wake - 6 * 90 - fallAsleep),
                fiveCycles: formatClock(wake - 5 * 90 - fallAsleep),
                sleepWindow: "Çoğu yetişkin için 7-9 saat aralığı sık kullanılan genel referanstır.",
            };
        },
    "metabolizma-yasi-hesaplama": (v) => {
            const male = v.gender === "male";
            const age = Math.max(18, Number(v.age) || 18);
            const weight = Math.max(0, Number(v.weight) || 0);
            const height = Math.max(0, Number(v.height) || 0);
            const bodyFat = Math.min(60, Math.max(3, Number(v.bodyFat) || (male ? 20 : 30)));
            const bmr = male
                ? 10 * weight + 6.25 * height - 5 * age + 5
                : 10 * weight + 6.25 * height - 5 * age - 161;
            const targetFat = male ? 18 : 28;
            const metabolicAge = Math.min(90, Math.max(18, age + (bodyFat - targetFat) * 0.7));
            const note = metabolicAge <= age
                ? "Metabolizma yaşı kronolojik yaşınıza yakın veya altında görünüyor; sonuç tahmini fitness göstergesidir."
                : "Metabolizma yaşı kronolojik yaşın üzerinde tahmin edildi; uyku, direnç egzersizi, protein ve genel sağlık durumu birlikte değerlendirilmelidir.";
            return { bmr, metabolicAge, note };
        },
    "gunluk-harcama-hesaplama": (v) => {
            const dailyTotal = ["food", "transport", "market", "other"].reduce((sum, key) => sum + Math.max(0, Number(v[key]) || 0), 0);
            const days = Math.min(31, Math.max(1, Number(v.days) || 30));
            return { dailyTotal, monthlyTotal: dailyTotal * days, yearlyTotal: dailyTotal * days * 12 };
        },
    "aylik-butce-hesaplama": (v) => {
            const income = Math.max(0, Number(v.income) || 0);
            const fixed = Math.max(0, Number(v.fixedExpenses) || 0);
            const variable = Math.max(0, Number(v.variableExpenses) || 0);
            const target = Math.max(0, Number(v.targetSavings) || 0);
            const remaining = income - fixed - variable - target;
            const savingsRate = income > 0 ? target / income * 100 : 0;
            const status = remaining >= 0
                ? "Bütçe hedefi karşılanıyor; kalan tutar esneklik payı olarak ayrılabilir."
                : "Bütçe açığı var; değişken gider veya tasarruf hedefi yeniden planlanmalı.";
            return { remaining, savingsRate, status };
        },
    "elektrik-tuketim-hesaplama": (v) => {
            const kwh = Math.max(0, Number(v.watt) || 0) / 1000 * Math.max(0, Number(v.hoursPerDay) || 0) * Math.max(1, Number(v.days) || 30);
            const cost = kwh * Math.max(0, Number(v.unitPrice) || 0);
            return { kwh, cost, dailyCost: cost / Math.max(1, Number(v.days) || 30) };
        },
    "su-faturasi-hesaplama": (v) => {
            const waterCost = Math.max(0, Number(v.m3) || 0) * Math.max(0, Number(v.unitPrice) || 0);
            const wasteWaterCost = waterCost * Math.max(0, Number(v.wasteWaterRate) || 0) / 100;
            return { waterCost, wasteWaterCost, totalCost: waterCost + wasteWaterCost + Math.max(0, Number(v.fixedFee) || 0) };
        },
    "dogalgaz-tuketimi-hesaplama": (v) => {
            const consumptionCost = Math.max(0, Number(v.m3) || 0) * Math.max(0, Number(v.unitPrice) || 0);
            const tax = consumptionCost * Math.max(0, Number(v.taxRate) || 0) / 100;
            return { consumptionCost, tax, totalCost: consumptionCost + tax + Math.max(0, Number(v.fixedFee) || 0) };
        },
    "tatil-butcesi-hesaplama": (v) => {
            const people = Math.max(1, Number(v.people) || 1);
            const baseTotal = Math.max(0, Number(v.nights) || 0) * Math.max(0, Number(v.nightlyCost) || 0)
                + Math.max(0, Number(v.transport) || 0)
                + Math.max(0, Number(v.dailyFood) || 0) * people * Math.max(1, Number(v.nights) || 1)
                + Math.max(0, Number(v.activities) || 0);
            const totalBudget = baseTotal * (1 + Math.max(0, Number(v.bufferRate) || 0) / 100);
            return { baseTotal, totalBudget, perPerson: totalBudget / people };
        },
    "ev-gider-hesaplama": (v) => {
            const total = ["rent", "dues", "electricity", "water", "gas", "internet", "market"].reduce((sum, key) => sum + Math.max(0, Number(v[key]) || 0), 0);
            const people = Math.max(1, Number(v.people) || 1);
            return { total, perPerson: total / people, annual: total * 12 };
        },
    "bahsis-hesaplama": (v) => {
            const bill = Math.max(0, Number(v.bill) || 0);
            const tipAmount = bill * Math.max(0, Number(v.tipRate) || 0) / 100;
            const total = bill + tipAmount;
            return { tipAmount, total, perPerson: total / Math.max(1, Number(v.people) || 1) };
        },
    "split-hesaplama": (v) => {
            const total = Math.max(0, Number(v.total) || 0);
            const extraAmount = total * Math.max(0, Number(v.tipRate) || 0) / 100;
            const grandTotal = total + extraAmount + Math.max(0, Number(v.extra) || 0);
            return { grandTotal, perPerson: grandTotal / Math.max(1, Number(v.people) || 1), extraAmount };
        },
    "kosu-pace-hesaplama": (v) => {
            const formatDuration = (totalSeconds: number) => {
                const safeSeconds = Math.max(0, Math.round(totalSeconds));
                const hours = Math.floor(safeSeconds / 3600);
                const minutes = Math.floor((safeSeconds % 3600) / 60);
                const seconds = safeSeconds % 60;
                if (hours > 0) {
                    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                }
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            };
            const distance = Math.max(0.1, Number(v.distance) || 0.1);
            const totalSeconds = Math.max(1, (Number(v.hours) || 0) * 3600 + (Number(v.minutes) || 0) * 60 + (Number(v.seconds) || 0));
            const paceSeconds = totalSeconds / distance;
            return {
                pace: `${Math.floor(paceSeconds / 60)}:${Math.round(paceSeconds % 60).toString().padStart(2, "0")} dk/km`,
                speed: distance / (totalSeconds / 3600),
                fiveK: formatDuration(paceSeconds * 5),
            };
        },
    "maraton-tempo-hesaplama": (v) => {
            const formatDuration = (totalSeconds: number) => {
                const safeSeconds = Math.max(0, Math.round(totalSeconds));
                const hours = Math.floor(safeSeconds / 3600);
                const minutes = Math.floor((safeSeconds % 3600) / 60);
                const seconds = safeSeconds % 60;
                if (hours > 0) {
                    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                }
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            };
            const totalSeconds = Math.max(1, (Number(v.hours) || 0) * 3600 + (Number(v.minutes) || 0) * 60);
            const paceSeconds = totalSeconds / 42.195;
            return {
                pace: `${Math.floor(paceSeconds / 60)}:${Math.round(paceSeconds % 60).toString().padStart(2, "0")} dk/km`,
                fiveKSplit: formatDuration(paceSeconds * 5),
                halfSplit: formatDuration(paceSeconds * 21.0975),
            };
        },
    "adim-mesafe-hesaplama": (v) => {
            const meters = Math.max(0, Number(v.steps) || 0) * Math.max(0, Number(v.strideCm) || 0) / 100;
            return { meters, kilometers: meters / 1000, note: "Koşuda adım uzunluğu yürüyüşten farklı olabilir; ölçümü aktivite türüne göre girin." };
        },
    "vo2-max-hesaplama": (v) => {
            const distance = Math.max(0, Number(v.distanceMeters) || 0);
            const vo2 = Math.max(0, (distance - 504.9) / 44.73);
            const category = vo2 >= 50 ? "Çok iyi aerobik kapasite" : vo2 >= 40 ? "İyi aerobik kapasite" : vo2 >= 30 ? "Orta seviye" : "Geliştirilebilir seviye";
            return { vo2, category, note: "Cooper testi saha tahminidir; laboratuvar VO2 max testi kadar kesin değildir." };
        },
    "yag-yakim-bolgesi-hesaplama": (v) => {
            const age = Math.max(1, Number(v.age) || 0);
            const restingHr = Math.max(0, Number(v.restingHr) || 0);
            const maxHr = 220 - age;
            const reserve = Math.max(0, maxHr - restingHr);
            const low = Math.round(restingHr + reserve * 0.6);
            const high = Math.round(restingHr + reserve * 0.7);
            return { zone: `${low}-${high} bpm`, maxHr, note: "Yağ yakım bölgesi toplam kilo kaybını garanti etmez; kalori dengesi ve sürdürülebilirlik önemlidir." };
        },
    "kas-kutlesi-hesaplama": (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const bodyFat = Math.min(60, Math.max(3, Number(v.bodyFat) || 0));
            const fatMass = weight * bodyFat / 100;
            const leanMass = weight - fatMass;
            return { fatMass, leanMass, estimatedMuscle: leanMass * 0.55 };
        },
    "bench-press-max": (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const reps = Math.min(20, Math.max(1, Number(v.reps) || 1));
            const epley = weight * (1 + reps / 30);
            const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : epley;
            const average = (epley + brzycki) / 2;
            return {
                epley,
                brzycki,
                average,
                note: `Bench press için tahmini 1RM yaklaşık ${average.toFixed(1)} kg. Maksimum denemeler güvenlik ekipmanı, spotter ve uygun teknik olmadan yapılmamalıdır.`,
            };
        },
    "squat-max": (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const reps = Math.min(20, Math.max(1, Number(v.reps) || 1));
            const epley = weight * (1 + reps / 30);
            const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : epley;
            const average = (epley + brzycki) / 2;
            return {
                epley,
                brzycki,
                average,
                note: `Squat için tahmini 1RM yaklaşık ${average.toFixed(1)} kg. Maksimum denemeler güvenlik ekipmanı, spotter ve uygun teknik olmadan yapılmamalıdır.`,
            };
        },
    "deadlift-max": (v) => {
            const weight = Math.max(0, Number(v.weight) || 0);
            const reps = Math.min(20, Math.max(1, Number(v.reps) || 1));
            const epley = weight * (1 + reps / 30);
            const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : epley;
            const average = (epley + brzycki) / 2;
            return {
                epley,
                brzycki,
                average,
                note: `Deadlift için tahmini 1RM yaklaşık ${average.toFixed(1)} kg. Maksimum denemeler güvenlik ekipmanı ve uygun teknik olmadan yapılmamalıdır.`,
            };
        },
    "spor-hedef-hesaplama": (v) => {
            const current = Number(v.currentWeight) || 0;
            const target = Number(v.targetWeight) || 0;
            const weekly = Math.max(0.1, Number(v.weeklyChange) || 0.5);
            const diff = target - current;
            const weeks = Math.abs(diff) / weekly;
            const dailyCalories = weekly * 7700 / 7;
            return {
                weeks,
                dailyCalories,
                direction: diff < 0 ? "Kilo verme hedefi - günlük açık gerekir." : diff > 0 ? "Kilo alma hedefi - günlük fazlalık gerekir." : "Kilo koruma hedefi.",
            };
        },
    "antrenman-hacmi": (v) => {
            const sets = Math.max(1, Number(v.sets) || 1);
            const reps = Math.max(1, Number(v.reps) || 1);
            const weight = Math.max(0, Number(v.weight) || 0);
            const sessions = Math.max(1, Number(v.sessions) || 1);
            const sessionVolume = sets * reps * weight;
            return { sessionVolume, weeklyVolume: sessionVolume * sessions, totalReps: sets * reps * sessions };
        },
    "set-tekrar-hesaplama": (v) => {
            const targetReps = Math.max(1, Number(v.targetReps) || 1);
            const sets = Math.max(1, Number(v.sets) || 1);
            const repsPerSet = targetReps / sets;
            return {
                repsPerSet,
                volume: targetReps * Math.max(0, Number(v.weight) || 0),
                suggestion: `${sets} set için set başına yaklaşık ${repsPerSet.toFixed(1)} tekrar planlanır.`,
            };
        },
    "dinlenme-suresi": (v) => {
            const base: Record<string, [number, number]> = {
                strength: [180, 300],
                hypertrophy: [60, 120],
                endurance: [30, 75],
            };
            const multiplier = v.difficulty === "veryHard" ? 1.4 : v.difficulty === "hard" ? 1.2 : 1;
            const [low, high] = base[String(v.goal)] ?? base.hypertrophy;
            return {
                restRange: `${Math.round(low * multiplier)}-${Math.round(high * multiplier)} sn`,
                note: "Dinlenme süresi hedefe, hareketin büyüklüğüne ve toparlanma durumuna göre ayarlanmalıdır.",
            };
        },
    "kardiyo-suresi": (v) => {
            const target = Math.max(0, Number(v.targetCalories) || 0);
            const weight = Math.max(1, Number(v.weight) || 1);
            const met = Math.max(0.1, Number(v.met) || 0.1);
            const caloriesPerMinute = met * 3.5 * weight / 200;
            const minutes = target / caloriesPerMinute;
            return {
                minutes,
                weeklyMinutes: minutes * 3,
                note: "Süre tahmini MET değerine göre hesaplanır; kondisyon, tempo ve eğim sonucu değiştirebilir.",
            };
        },
};
