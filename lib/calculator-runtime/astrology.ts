import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "burc-hesaplama": (v) => {
            const d = new Date(v.birthDate);
            const m = d.getMonth() + 1;
            const gn = d.getDate();
            const yr = d.getFullYear();
            const BURCLAR = [
                { ad: "Oğlak", element: "Toprak", gezegen: "Satürn", baslangic: [1, 1], bitis: [1, 19] },
                { ad: "Kova", element: "Hava", gezegen: "Uranüs", baslangic: [1, 20], bitis: [2, 18] },
                { ad: "Balık", element: "Su", gezegen: "Neptün", baslangic: [2, 19], bitis: [3, 20] },
                { ad: "Koç", element: "Ateş", gezegen: "Mars", baslangic: [3, 21], bitis: [4, 19] },
                { ad: "Boğa", element: "Toprak", gezegen: "Venüs", baslangic: [4, 20], bitis: [5, 20] },
                { ad: "İkizler", element: "Hava", gezegen: "Merkür", baslangic: [5, 21], bitis: [6, 20] },
                { ad: "Yengeç", element: "Su", gezegen: "Ay", baslangic: [6, 21], bitis: [7, 22] },
                { ad: "Aslan", element: "Ateş", gezegen: "Güneş", baslangic: [7, 23], bitis: [8, 22] },
                { ad: "Başak", element: "Toprak", gezegen: "Merkür", baslangic: [8, 23], bitis: [9, 22] },
                { ad: "Terazi", element: "Hava", gezegen: "Venüs", baslangic: [9, 23], bitis: [10, 22] },
                { ad: "Akrep", element: "Su", gezegen: "Plüton", baslangic: [10, 23], bitis: [11, 21] },
                { ad: "Yay", element: "Ateş", gezegen: "Jüpiter", baslangic: [11, 22], bitis: [12, 21] },
                { ad: "Oğlak", element: "Toprak", gezegen: "Satürn", baslangic: [12, 22], bitis: [12, 31] },
            ];
            const b = BURCLAR.find(x => (m === x.baslangic[0] && gn >= x.baslangic[1]) || (m === x.bitis[0] && gn <= x.bitis[1])) ?? BURCLAR[0];
            const CIN = ["Maymun", "Horoz", "Köpek", "Domuz", "Sıçan", "Öküz", "Kaplan", "Tavşan", "Ejderha", "Yılan", "At", "Koyun"];
            const cinBurc = CIN[(yr - 2016 % 12 + 12) % 12];
            return { burc: b.ad as unknown as number, element: b.element as unknown as number, gezegen: b.gezegen as unknown as number, cinBurc: cinBurc as unknown as number };
        },
    "yukselen-burc-hesaplama": (v) => {
            const signs = [
                { id: 0, tr: "Koç", en: "Aries" },
                { id: 1, tr: "Boğa", en: "Taurus" },
                { id: 2, tr: "İkizler", en: "Gemini" },
                { id: 3, tr: "Yengeç", en: "Cancer" },
                { id: 4, tr: "Aslan", en: "Leo" },
                { id: 5, tr: "Başak", en: "Virgo" },
                { id: 6, tr: "Terazi", en: "Libra" },
                { id: 7, tr: "Akrep", en: "Scorpio" },
                { id: 8, tr: "Yay", en: "Sagittarius" },
                { id: 9, tr: "Oğlak", en: "Capricorn" },
                { id: 10, tr: "Kova", en: "Aquarius" },
                { id: 11, tr: "Balık", en: "Pisces" }
            ];

            const dateStr = v.birthDate || "1990-01-01";
            const timeStr = v.birthTime || "12:00";

            const dateParts = dateStr.split('-');
            const year = parseInt(dateParts[0], 10) || 1990;
            const month = parseInt(dateParts[1], 10) || 1;
            const day = parseInt(dateParts[2], 10) || 1;

            const timeParts = timeStr.split(':');
            const h = parseInt(timeParts[0], 10) || 12;
            const m = parseInt(timeParts[1], 10) || 0;

            // Simple Sun Sign calculation
            let sunIndex = 0;
            if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) sunIndex = 0; // Aries
            else if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) sunIndex = 1; // Taurus
            else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) sunIndex = 2; // Gemini
            else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) sunIndex = 3; // Cancer
            else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunIndex = 4; // Leo
            else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunIndex = 5; // Virgo
            else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunIndex = 6; // Libra
            else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunIndex = 7; // Scorpio
            else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunIndex = 8; // Sagittarius
            else if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) sunIndex = 9; // Capricorn
            else if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) sunIndex = 10; // Aquarius
            else if ((month === 2 && day >= 20) || (month === 3 && day <= 20)) sunIndex = 11; // Pisces

            // Ascendant Approximation Logic
            // The Earth rotates ~1 degree every 4 minutes.
            // Sun and Ascendant are identical at sunrise (approx 06:00).
            // Calculate time difference from 06:00 in hours.
            const timeInHours = h + m / 60;
            const hoursSinceSunrise = timeInHours - 6;
            // 24 hours = 12 signs = 1 sign per 2 hours.
            const signsPassed = Math.floor(hoursSinceSunrise / 2);

            // Apply rough geographical offsets for Turkey
            let cityOffset = 0;
            if (v.city === "izmir") cityOffset = -0.1;
            else if (v.city === "erzurum" || v.city === "diyarbakir") cityOffset = +0.1;

            let ascIndex = (sunIndex + signsPassed + Math.round(cityOffset)) % 12;
            if (ascIndex < 0) ascIndex += 12;

            return {
                sunSign: { tr: signs[sunIndex].tr, en: signs[sunIndex].en } as any,
                ascendantSign: { tr: signs[ascIndex].tr, en: signs[ascIndex].en } as any
            };
        },
};
