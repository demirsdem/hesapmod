import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "iki-tarih-arasi-fark-gun-hesaplama": (v) => {
            const startParts = v.startDate.split("-");
            const endParts = v.endDate.split("-");
            if (startParts.length !== 3 || endParts.length !== 3) return { totalDays: 0, totalWeeks: 0, duration: "-" };

            const start = new Date(Number(startParts[0]), Number(startParts[1]) - 1, Number(startParts[2]));
            const end = new Date(Number(endParts[0]), Number(endParts[1]) - 1, Number(endParts[2]));

            const diffMs = Math.abs(end.getTime() - start.getTime());
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const totalWeeks = totalDays / 7;

            // For precise duration (Yıl, Ay, Gün)
            const earlier = start > end ? end : start;
            const later = start > end ? start : end;

            let years = later.getFullYear() - earlier.getFullYear();
            let months = later.getMonth() - earlier.getMonth();
            let days = later.getDate() - earlier.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            let durationTr = "";
            let durationEn = "";
            if (years > 0) { durationTr += `${years} Yıl `; durationEn += `${years} Yrs `; }
            if (months > 0) { durationTr += `${months} Ay `; durationEn += `${months} Mos `; }
            if (days > 0 || (years === 0 && months === 0)) { durationTr += `${days} Gün`; durationEn += `${days} Days`; }

            return {
                totalDays,
                totalWeeks,
                duration: durationTr.trim() as any // Output format
            };
        },
    "yas-hesaplama": (v) => {
            const birth = new Date(parseInt(v.birthYear), parseInt(v.birthMonth) - 1, parseInt(v.birthDay));
            const now = new Date();
            const diffMs = now.getTime() - birth.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30.4375);
            let years = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
            return { years, months: diffMonths, days: diffDays };
        },
    "birim-donusturucu": (v) => {
            const val = parseFloat(v.value) || 0;
            const toMeters: Record<string, number> = { km: 1000, m: 1, cm: 0.01, mi: 1609.344, ft: 0.3048, in: 0.0254 };
            const meters = val * (toMeters[v.from] || 1);
            return {
                km: meters / 1000, m: meters, cm: meters * 100,
                mi: meters / 1609.344, ft: meters / 0.3048, inch: meters / 0.0254,
            };
        },
    "gun-hesaplama": (v) => {
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            const ms = end.getTime() - start.getTime();
            const days = Math.round(ms / (1000 * 60 * 60 * 24));
            return { days: Math.abs(days), weeks: Math.abs(days) / 7, months: Math.abs(days) / 30.4375, years: Math.abs(days) / 365.25 };
        },
    "doguma-kalan-gun": (v) => {
            const today = new Date();
            const birth = new Date(v.birthDate);
            const age = today.getFullYear() - birth.getFullYear()
                - (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
            const nextYear = today >= new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
                ? today.getFullYear() + 1
                : today.getFullYear();
            const nextBirthday = new Date(nextYear, birth.getMonth(), birth.getDate());
            const daysLeft = Math.ceil((nextBirthday.getTime() - today.getTime()) / 86400000);
            return { age, nextAge: age + 1, daysLeft, nextBirthday: nextBirthday.toLocaleDateString("tr-TR") as unknown as number };
        },
    "ay-evresi-hesaplama": (v) => {
            const raw = v.date || new Date().toISOString().slice(0, 10);
            const d = new Date(raw);
            if (isNaN(d.getTime())) return { phaseName: "—", ageDay: "—", illumination: "—" };
            // Julian Day Number
            const Y = d.getFullYear(), M = d.getMonth() + 1, D = d.getDate();
            const A = Math.floor((14 - M) / 12);
            const y = Y + 4800 - A;
            const m = M + 12 * A - 3;
            const JDN = D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
            const JD = JDN - 0.5;
            // Known new moon: Jan 6, 2000 = JD 2451549.5, cycle = 29.53059 days
            const daysSince = JD - 2451549.5;
            const cycle = 29.53059;
            const age = ((daysSince % cycle) + cycle) % cycle;
            const illumination = Math.round((1 - Math.cos((2 * Math.PI * age) / cycle)) / 2 * 100);
            let phaseName: string;
            if (age < 1.85) phaseName = "🌑 Yeni Ay";
            else if (age < 7.38) phaseName = "🌒 Büyüyen Hilal";
            else if (age < 9.22) phaseName = "🌓 İlk Dördün";
            else if (age < 14.77) phaseName = "🌔 Büyüyen Ay";
            else if (age < 16.61) phaseName = "🌕 Dolunay";
            else if (age < 22.15) phaseName = "🌖 Küçülen Ay";
            else if (age < 23.99) phaseName = "🌗 Son Dördün";
            else if (age < 29.53) phaseName = "🌘 Küçülen Hilal";
            else phaseName = "🌑 Yeni Ay";
            return { phaseName, ageDay: age.toFixed(1) + " gün", illumination: illumination + "%" };
        },
    "bayram-namazi-saati-hesaplama": (v) => {
            // Diyanet verilerine dayalı yaklaşık saat aralıkları
            const times: Record<string, Record<string, string>> = {
                istanbul: { summer: "08:15", winter: "09:00", spring: "08:30" },
                ankara: { summer: "08:00", winter: "08:45", spring: "08:15" },
                izmir: { summer: "08:20", winter: "09:05", spring: "08:35" },
                bursa: { summer: "08:10", winter: "09:00", spring: "08:25" },
                antalya: { summer: "08:25", winter: "09:10", spring: "08:45" },
                konya: { summer: "08:05", winter: "08:50", spring: "08:20" },
                adana: { summer: "08:15", winter: "09:05", spring: "08:35" },
                diyarbakir: { summer: "07:50", winter: "08:35", spring: "08:05" },
                trabzon: { summer: "07:55", winter: "08:45", spring: "08:10" },
                erzurum: { summer: "07:40", winter: "08:25", spring: "07:55" },
            };
            const city = v.city || "istanbul";
            const season = v.season || "summer";
            const prayerTime = times[city]?.[season] ?? "08:15";
            return {
                prayerTime,
                note: "Kesin saat Diyanet İşleri Başkanlığı'nın yıllık takvimiyle belirlenir. Bu değer yaklaşık referans saatidir.",
            };
        },
    "cuma-namazi-saati-hesaplama": (v) => {
            const zuhr: Record<string, Record<string, string>> = {
                istanbul: { summer: "13:18", winter: "12:55", spring: "13:10" },
                ankara: { summer: "13:09", winter: "12:47", spring: "13:01" },
                izmir: { summer: "13:28", winter: "13:03", spring: "13:18" },
                bursa: { summer: "13:20", winter: "12:57", spring: "13:12" },
                antalya: { summer: "13:20", winter: "13:02", spring: "13:14" },
                konya: { summer: "13:13", winter: "12:52", spring: "13:05" },
                adana: { summer: "13:10", winter: "12:52", spring: "13:04" },
                diyarbakir: { summer: "12:57", winter: "12:38", spring: "12:50" },
                trabzon: { summer: "13:01", winter: "12:41", spring: "12:53" },
                erzurum: { summer: "12:52", winter: "12:30", spring: "12:43" },
            };
            const city = v.city || "istanbul";
            const season = v.season || "summer";
            const zuhrTime = zuhr[city]?.[season] ?? "13:10";
            // Cuma hutbesi genellikle öğle vaktinden ~20 dk önce başlar
            const [h, m] = zuhrTime.split(":").map(Number);
            const total = h * 60 + m - 20;
            const jumuahStart = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
            return { zuhrTime, jumuahStart };
        },
    "gun-batimi-hesaplama": (v) => {
            const coords: Record<string, [number, number]> = {
                istanbul: [41.01, 28.97], ankara: [39.93, 32.86], izmir: [38.42, 27.14],
                antalya: [36.89, 30.71], trabzon: [41.0, 39.72], erzurum: [39.91, 41.27],
                diyarbakir: [37.91, 40.23],
            };
            const raw = v.date || new Date().toISOString().slice(0, 10);
            const d = new Date(raw);
            if (isNaN(d.getTime())) return { sunsetTime: "—", dayLength: "—" };
            const [lat, lon] = coords[v.city || "istanbul"] ?? [41.01, 28.97];
            const rad = Math.PI / 180;
            const N = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
            const B = (360 / 365) * (N - 81) * rad;
            const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
            const decl = 23.45 * Math.sin(B) * rad;
            const HA = Math.acos(-Math.tan(lat * rad) * Math.tan(decl)) / rad;
            const solarNoon = 12 - (lon - 30) / 15 - EoT / 60;
            const sunsetUTC = solarNoon + HA / 15;
            const sunsetLocal = sunsetUTC + 3; // UTC+3
            const hS = Math.floor(sunsetLocal);
            const mS = Math.round((sunsetLocal - hS) * 60);
            const sunriseLocal = sunsetUTC - HA / 15 + 3;
            const dl = sunsetLocal - sunriseLocal;
            const dlH = Math.floor(dl);
            const dlM = Math.round((dl - dlH) * 60);
            return {
                sunsetTime: `${String(hS).padStart(2, "0")}:${String(mS).padStart(2, "0")}`,
                dayLength: `${dlH} saat ${dlM} dakika`,
            };
        },
    "gun-dogumu-hesaplama": (v) => {
            const coords: Record<string, [number, number]> = {
                istanbul: [41.01, 28.97], ankara: [39.93, 32.86], izmir: [38.42, 27.14],
                antalya: [36.89, 30.71], trabzon: [41.0, 39.72], erzurum: [39.91, 41.27],
                diyarbakir: [37.91, 40.23],
            };
            const raw = v.date || new Date().toISOString().slice(0, 10);
            const d = new Date(raw);
            if (isNaN(d.getTime())) return { sunriseTime: "—", dayLength: "—" };
            const [lat, lon] = coords[v.city || "istanbul"] ?? [41.01, 28.97];
            const rad = Math.PI / 180;
            const N = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
            const B = (360 / 365) * (N - 81) * rad;
            const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
            const decl = 23.45 * Math.sin(B) * rad;
            const HA = Math.acos(-Math.tan(lat * rad) * Math.tan(decl)) / rad;
            const solarNoon = 12 - (lon - 30) / 15 - EoT / 60;
            const sunriseUTC = solarNoon - HA / 15;
            const sunriseLocal = sunriseUTC + 3;
            const hR = Math.floor(sunriseLocal);
            const mR = Math.round((sunriseLocal - hR) * 60);
            const dl = (HA / 15) * 2;
            const dlH = Math.floor(dl);
            const dlM = Math.round((dl - dlH) * 60);
            return {
                sunriseTime: `${String(hR).padStart(2, "0")}:${String(mR).padStart(2, "0")}`,
                dayLength: `${dlH} saat ${dlM} dakika`,
            };
        },
    "hafta-hesaplama": (v) => {
            const raw = v.date || new Date().toISOString().slice(0, 10);
            const d = new Date(raw);
            if (isNaN(d.getTime())) return { weekNumber: "—", weekStart: "—", weekEnd: "—", year: "—" };
            // ISO week: Monday is day 1
            const tmp = new Date(d);
            tmp.setHours(0, 0, 0, 0);
            tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
            const yearStart = new Date(tmp.getFullYear(), 0, 1);
            const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
            const isoYear = tmp.getFullYear();
            // Week start (Monday)
            const day = d.getDay() || 7;
            const monday = new Date(d);
            monday.setDate(d.getDate() - day + 1);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            const fmt = (dt: Date) => dt.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
            return { weekNumber: `${weekNo}. Hafta`, weekStart: fmt(monday), weekEnd: fmt(sunday), year: String(isoYear) };
        },
    "hangi-gun-hesaplama": (v) => {
            const raw = v.date || new Date().toISOString().slice(0, 10);
            const d = new Date(raw);
            if (isNaN(d.getTime())) return { dayName: "—", dayNumber: "—", dayOfYear: "—", remainingDays: "—" };
            const names = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
            const namesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayIdx = d.getDay();
            const dayName = `${names[dayIdx]} / ${namesEn[dayIdx]}`;
            const isoDay = dayIdx === 0 ? 7 : dayIdx;
            const start = new Date(d.getFullYear(), 0, 0);
            const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000);
            const isLeap = (d.getFullYear() % 4 === 0 && d.getFullYear() % 100 !== 0) || d.getFullYear() % 400 === 0;
            const totalDays = isLeap ? 366 : 365;
            const remainingDays = totalDays - dayOfYear;
            return { dayName, dayNumber: `${isoDay}. gün`, dayOfYear: `${dayOfYear}. gün`, remainingDays: `${remainingDays} gün` };
        },
    "hicri-takvim-hesaplama": (v) => {
            const raw = v.date || new Date().toISOString().slice(0, 10);
            const d = new Date(raw);
            if (isNaN(d.getTime())) return { hijriDate: "—", hijriDay: "—", hijriMonth: "—", hijriYear: "—" };
            // Simplified Hijri conversion algorithm (tabular)
            const Y = d.getFullYear(), M = d.getMonth() + 1, D = d.getDate();
            const A = Math.floor((14 - M) / 12);
            const y = Y + 4800 - A;
            const m = M + 12 * A - 3;
            let JD = D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
            let l = JD - 1948440 + 10632;
            const n = Math.floor((l - 1) / 10631);
            l = l - 10631 * n + 354;
            const J = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719)
                + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
            l = l - Math.floor((30 - J) / 15) * Math.floor((17719 * J) / 50)
                - Math.floor(J / 16) * Math.floor((15238 * J) / 43) + 29;
            const hy = 29 + Math.floor(l / 50) + 30 * n + Math.floor(J) + Math.floor(l / 30);
            const hm = Math.floor(l / 28) + J;
            const hd = l - 29 * Math.floor(hm / 2 + (hm % 2 === 0 ? 1 : 0));
            const monthNames = ["Muharrem", "Safer", "Rebiülevvel", "Rebiülahir", "Cemaziyelevvel", "Cemaziyelahir",
                "Recep", "Şaban", "Ramazan", "Şevval", "Zilkade", "Zilhicce"];
            const hmSafe = Math.max(1, Math.min(12, hm));
            return {
                hijriDate: `${hd} ${monthNames[hmSafe - 1]} ${hy} H`,
                hijriDay: String(hd),
                hijriMonth: monthNames[hmSafe - 1],
                hijriYear: `${hy} H`,
            };
        },
    "iki-tarih-arasindaki-gun-sayisi-hesaplama": (v) => {
            const s = new Date(v.startDate);
            const e = new Date(v.endDate);
            if (isNaN(s.getTime()) || isNaN(e.getTime())) return { totalDays: "—", totalWeeks: "—", totalMonths: "—", totalYears: "—" };
            const diffMs = e.getTime() - s.getTime();
            const sign = diffMs < 0 ? "-" : "";
            const absDiff = Math.abs(diffMs);
            const days = Math.round(absDiff / 86400000);
            const weeks = Math.floor(days / 7);
            const remDays = days % 7;
            const months = (absDiff / (1000 * 60 * 60 * 24 * 30.4375)).toFixed(1);
            const years = (absDiff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2);
            return {
                totalDays: `${sign}${days} gün`,
                totalWeeks: `${sign}${weeks} hafta ${remDays} gün`,
                totalMonths: `${sign}${months} ay`,
                totalYears: `${sign}${years} yıl`,
            };
        },
    "iki-tarih-arasindaki-hafta-sayisi-hesaplama": (v) => {
            const s = new Date(v.startDate);
            const e = new Date(v.endDate);
            if (isNaN(s.getTime()) || isNaN(e.getTime())) return { totalWeeks: "—", fullWeeks: "—", totalDays: "—" };
            const diffMs = Math.abs(e.getTime() - s.getTime());
            const days = Math.round(diffMs / 86400000);
            const weeksRaw = (days / 7).toFixed(2);
            const fullWeeks = Math.floor(days / 7);
            const remDays = days % 7;
            return {
                totalWeeks: `${weeksRaw} hafta`,
                fullWeeks: `${fullWeeks} hafta ${remDays} gün`,
                totalDays: `${days} gün`,
            };
        },
    "is-gunu-hesaplama": (v) => {
            const s = new Date(v.startDate);
            const e = new Date(v.endDate);
            if (isNaN(s.getTime()) || isNaN(e.getTime())) return { workingDays: "—", weekendDays: "—", totalCalendarDays: "—" };
            let count = 0;
            let weekends = 0;
            let cur = new Date(s);
            if (!v.includeStart) cur.setDate(cur.getDate() + 1);
            while (cur <= e) {
                const day = cur.getDay();
                if (day === 0 || day === 6) weekends++;
                else count++;
                cur.setDate(cur.getDate() + 1);
            }
            const total = Math.round(Math.abs(e.getTime() - s.getTime()) / 86400000);
            return {
                workingDays: `${count} gün`,
                weekendDays: `${weekends} gün`,
                totalCalendarDays: `${total} gün`,
            };
        },
    "kac-gun-kaldi-hesaplama": (v) => {
            const target = new Date(v.targetDate);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (isNaN(target.getTime())) return { remainingDays: "—", remainingWeeks: "—", remainingMonths: "—" };
            const diffMs = target.getTime() - now.getTime();
            if (diffMs < 0) return { remainingDays: "Tarih Geçmiş", remainingWeeks: "—", remainingMonths: "—" };
            const days = Math.round(diffMs / 86400000);
            const weeks = Math.floor(days / 7);
            const remDays = days % 7;
            const months = (days / 30.4375).toFixed(1);
            return {
                remainingDays: `${days} gün`,
                remainingWeeks: `${weeks} hafta ${remDays} gün`,
                remainingMonths: `${months} ay`,
            };
        },
    "kac-gun-oldu-hesaplama": (v) => {
            const past = new Date(v.pastDate);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (isNaN(past.getTime())) return { elapsedDays: "—", elapsedWeeks: "—", elapsedMonths: "—", elapsedYears: "—" };
            const diffMs = now.getTime() - past.getTime();
            if (diffMs < 0) return { elapsedDays: "Tarih Gelecekte", elapsedWeeks: "—", elapsedMonths: "—", elapsedYears: "—" };
            const days = Math.round(diffMs / 86400000);
            const weeks = Math.floor(days / 7);
            const remDays = days % 7;
            const months = (days / 30.4375).toFixed(1);
            const years = (days / 365.25).toFixed(2);
            return {
                elapsedDays: `${days} gün`,
                elapsedWeeks: `${weeks} hafta ${remDays} gün`,
                elapsedMonths: `${months} ay`,
                elapsedYears: `${years} yıl`,
            };
        },
    "ramazanin-kacinci-gunu-hesaplama": (v) => {
            const raw = v.date || new Date().toISOString().slice(0, 10);
            const d = new Date(raw);
            d.setHours(0, 0, 0, 0);
            // 2025 Ramazan: 1 Mart - 29 Mart (tahmini)
            // 2026 Ramazan: 18 Şubat - 19 Mart (tahmini)
            const ramadanData = [
                { start: new Date(2025, 2, 1), end: new Date(2025, 2, 29), name: "2025 Ramazan" },
                { start: new Date(2026, 1, 18), end: new Date(2026, 2, 19), name: "2026 Ramazan" },
            ];
            const currentYear = d.getFullYear();
            const ram = ramadanData.find(r => currentYear === r.start.getFullYear());
            if (!ram) return { ramadanDay: "—", eidCountdown: "—", status: "Takvim Dışı" };
            if (d < ram.start) {
                const diff = Math.round((ram.start.getTime() - d.getTime()) / 86400000);
                return { ramadanDay: "Henüz Başlamadı", eidCountdown: "—", status: `Ramazan'a ${diff} gün var` };
            }
            if (d > ram.end) {
                return { ramadanDay: "Ramazan Bitti", eidCountdown: "0", status: "Bayram Tebrikleri!" };
            }
            const day = Math.floor((d.getTime() - ram.start.getTime()) / 86400000) + 1;
            const remaining = Math.floor((ram.end.getTime() - d.getTime()) / 86400000) + 1;
            return {
                ramadanDay: `${day}. gün`,
                eidCountdown: `${remaining} gün`,
                status: day >= 26 ? "Kadir Gecesi yaklaşıyor!" : "Hayırlı Ramazanlar",
            };
        },
    "saat-farki-hesaplama": (v) => {
            const parse = (s: string) => {
                const [h, m] = s.split(":").map(Number);
                return (h * 3600) + (m * 60);
            };
            let start = parse(v.startTime || "00:00");
            let end = parse(v.endTime || "00:00");
            if (isNaN(start) || isNaN(end)) return { totalDuration: "—", totalMinutes: "—", totalSeconds: "—" };
            if (end < start) end += 24 * 3600; // Gece yarısını geçiyorsa
            const diff = end - start;
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            return {
                totalDuration: `${h} saat ${m} dakika`,
                totalMinutes: `${Math.floor(diff / 60)} dk`,
                totalSeconds: `${diff} sn`,
            };
        },
    "saat-kac-hesaplama": (v) => {
            const tz = v.city || "Europe/Istanbul";
            try {
                const now = new Date();
                const timeStr = now.toLocaleTimeString("tr-TR", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                const dateStr = now.toLocaleDateString("tr-TR", { timeZone: tz, day: "2-digit", month: "long", year: "numeric" });
                return { currentTime: timeStr, currentDate: dateStr, timezone: tz };
            } catch {
                return { currentTime: "Hata", currentDate: "—", timezone: "Geçersiz Dilim" };
            }
        },
    "safak-hesaplama": (v) => {
            const start = new Date(v.sulusDate);
            if (isNaN(start.getTime())) return { dischargeDate: "—", safak: "—", province: "—" };
            const months = Number(v.serviceMonths || 6);
            const road = Math.max(0, Number(v.roadPermission || 0) || 0);
            const leaveDays = Math.max(0, Number(v.leaveDays || 0) || 0);
            const discharge = new Date(start);
            discharge.setMonth(discharge.getMonth() + months);
            discharge.setDate(discharge.getDate() - road - leaveDays);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const diff = Math.ceil((discharge.getTime() - now.getTime()) / 86400000);
            const plates: Record<string, string> = { "81": "Düzce", "34": "İstanbul", "06": "Ankara", "35": "İzmir" }; // Örnek
            return {
                dischargeDate: discharge.toLocaleDateString("tr-TR"),
                safak: diff > 0 ? String(diff) : "Doğan Güneş",
                province: diff <= 81 && diff > 0 ? (plates[String(diff)] || "—") : "Plakalara Az Kaldı",
            };
        },
    "tarih-hesaplama": (v) => {
            const d = new Date(v.baseDate);
            if (isNaN(d.getTime())) return { newDate: "—", dayOfWeek: "—" };
            const amount = Number(v.amount || 0) * (v.op === "sub" ? -1 : 1);
            const unit = v.unit || "days";
            if (unit === "days") d.setDate(d.getDate() + amount);
            else if (unit === "weeks") d.setDate(d.getDate() + amount * 7);
            else if (unit === "months") d.setMonth(d.getMonth() + amount);
            else if (unit === "years") d.setFullYear(d.getFullYear() + amount);
            const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
            return {
                newDate: d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }),
                dayOfWeek: days[d.getDay()],
            };
        },
    "zaman-birimleri-donusturucu": (v) => {
            const val = Number(v.value || 0);
            const unit = v.fromUnit || "hours";
            let seconds = 0;
            if (unit === "seconds") seconds = val;
            else if (unit === "minutes") seconds = val * 60;
            else if (unit === "hours") seconds = val * 3600;
            else if (unit === "days") seconds = val * 86400;
            else if (unit === "weeks") seconds = val * 604800;

            return {
                toSeconds: `${seconds.toLocaleString("tr-TR")} sn`,
                toMinutes: `${(seconds / 60).toLocaleString("tr-TR")} dk`,
                toHours: `${(seconds / 3600).toLocaleString("tr-TR")} sa`,
                toDays: `${(seconds / 86400).toLocaleString("tr-TR")} gün`,
            };
        },
    "vade-hesaplama": (v) => {
            const d = new Date(v.startDate);
            if (isNaN(d.getTime())) return { maturityDate: "—", dayOfWeek: "—", isWeekend: "—" };
            const amount = Number(v.term || 0);
            if (v.unit === "months") d.setMonth(d.getMonth() + amount);
            else d.setDate(d.getDate() + amount);
            const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
            const isW = d.getDay() === 0 || d.getDay() === 6;
            return {
                maturityDate: d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }),
                dayOfWeek: days[d.getDay()],
                isWeekend: isW ? "Evet (Hafta Sonu)" : "Hayır (İş Günü)",
            };
        },
    "yas-hesaplama-detayli": (v) => {
            const birth = new Date(v.birthDate);
            const now = new Date();
            if (isNaN(birth.getTime())) return { exactAge: "—", nextBirthday: "—", totalDays: "—" };
            let yrs = now.getFullYear() - birth.getFullYear();
            let mths = now.getMonth() - birth.getMonth();
            let dys = now.getDate() - birth.getDate();
            if (dys < 0) {
                mths--;
                dys += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            }
            if (mths < 0) {
                yrs--;
                mths += 12;
            }
            const nextBD = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
            if (nextBD < now) nextBD.setFullYear(now.getFullYear() + 1);
            const daysToBD = Math.ceil((nextBD.getTime() - now.getTime()) / 86400000);
            const total = Math.floor((now.getTime() - birth.getTime()) / 86400000);
            return {
                exactAge: `${yrs} yıl, ${mths} ay, ${dys} gün`,
                nextBirthday: `${daysToBD} gün kaldı`,
                totalDays: `${total} gün`,
            };
        },
    "yilin-kacinci-gunu-hesaplama": (v) => {
            const d = new Date(v.date || new Date());
            if (isNaN(d.getTime())) return { dayNo: "—", remaining: "—", percentage: "—" };
            const start = new Date(d.getFullYear(), 0, 0);
            const diff = d.getTime() - start.getTime();
            const dayOfYear = Math.floor(diff / 86400000);
            const isLeap = (d.getFullYear() % 4 === 0 && d.getFullYear() % 100 !== 0) || d.getFullYear() % 400 === 0;
            const total = isLeap ? 366 : 365;
            const rem = total - dayOfYear;
            const pct = ((dayOfYear / total) * 100).toFixed(2);
            return {
                dayNo: `${dayOfYear}. gün`,
                remaining: `${rem} gün`,
                percentage: `%${pct}`,
            };
        },
    "iki-tarih-arasindaki-hafta-sayisini-hesaplama": (v) => {
            if (!v.startDate || !v.endDate) return { totalWeeks: 0, remainingDays: 0, totalDaysText: "" };
            
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            const weeks = Math.floor(diffDays / 7);
            const days = diffDays % 7;
            
            return {
                totalWeeks: weeks,
                remainingDays: days,
                totalDaysText: `${diffDays} Gün`
            };
        },
};
