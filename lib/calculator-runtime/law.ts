import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "vekalet-ucreti-hesaplama": (v) => {
            // 2026 AAÜT örnek: ilk 100.000 TL için %16, sonraki için %15, maktu alt sınır 6.000 TL
            let kalan = v.tutar;
            let ucret = 0;
            if (kalan > 100000) {
                ucret += 100000 * 0.16;
                kalan -= 100000;
                ucret += kalan * 0.15;
            } else {
                ucret = kalan * 0.16;
            }
            if (ucret < 6000) ucret = 6000;
            return { nispiUcret: ucret };
        },
    "icra-masrafi-hesaplama": (v) => {
            // 2026: Peşin harç binde 5, başvuru harcı 427.60 TL, vekalet suret harcı 50 TL
            const pesinHarc = v.alacak * 0.005;
            const basvuruHarci = 427.6;
            const vekaletSuretHarci = 50;
            const toplamMasraf = pesinHarc + basvuruHarci + vekaletSuretHarci;
            return { toplamMasraf, pesinHarc, basvuruHarci, vekaletSuretHarci };
        },
    "arabuluculuk-ucreti-hesaplama": (v) => {
            // 2026 tarifesi: ilk 200.000 TL için %6, sonraki için %5, maktu alt sınır 5.000 TL
            let kalan = Number(v.tutar) || 0;
            let ucret = 0;
            if (kalan > 200000) {
                ucret += 200000 * 0.06;
                kalan -= 200000;
                ucret += kalan * 0.05;
            } else {
                ucret = kalan * 0.06;
            }
            if (ucret < 5000) ucret = 5000;
            const taraf = Number(v.tarafSayisi) || 2;
            const tarafBasiUcret = ucret / taraf;
            return { toplamUcret: ucret, tarafBasiUcret };
        },
    "hukuki-sure-hesaplama": (v) => {
            const start = new Date(v.tebligTarihi);
            let days = 0;
            if (v.sureTipi === "gun") days = Number(v.sure) || 0;
            if (v.sureTipi === "hafta") days = (Number(v.sure) || 0) * 7;
            if (v.sureTipi === "ay") days = (Number(v.sure) || 0) * 30;
            let current = new Date(start);
            let added = 0;
            while (added < days) {
                current.setDate(current.getDate() + 1);
                if (v.isGunu) {
                    // Cumartesi (6) ve Pazar (0) atla
                    if (current.getDay() !== 0 && current.getDay() !== 6) added++;
                } else {
                    added++;
                }
            }
            // Son gün hafta sonuna denk gelirse ilk iş gününe at
            while (v.isGunu && (current.getDay() === 0 || current.getDay() === 6)) {
                current.setDate(current.getDate() + 1);
            }
            return { bitisTarihi: current.toLocaleDateString("tr-TR") };
        },
    "uzlastirmaci-ucreti-hesaplama": (v) => {
            // 2026 örnek tarifesi: 2-3 taraf: 3000-3500 TL, 4-6 taraf: 3500-4000 TL, 7+: 4000-4500 TL. Sağlanamadıysa 1500 TL sabit.
            if (v.sonuc === "hayir") return { tabanUcret: 1500, tavanUcret: 1500 };
            if (v.tarafSayisi === "2-3") return { tabanUcret: 3000, tavanUcret: 3500 };
            if (v.tarafSayisi === "4-6") return { tabanUcret: 3500, tavanUcret: 4000 };
            if (v.tarafSayisi === "7+") return { tabanUcret: 4000, tavanUcret: 4500 };
            return { tabanUcret: 0, tavanUcret: 0 };
        },
    "yasal-faiz-hesaplama": (v) => {
            const principal = parseFloat(v.amount) || 0;
            const rate = parseFloat(v.rate) / 100 || 0;
            const days = parseFloat(v.days) || 0;

            const interest = principal * rate * (days / 365);
            return {
                interest: interest,
                total: principal + interest
            };
        },
    "aidat-gecikme-tazminati-hesaplama": (v) => {
            const due = parseFloat(v.dueAmount) || 0;
            const months = parseFloat(v.monthsDelayed) || 0;
            
            // 5% per month, simple interest usually
            const penalty = due * 0.05 * months;

            return {
                penalty: penalty,
                totalDue: due + penalty
            };
        },
    "e-tebligat-teblig-tarihi-hesaplama": (v) => {
            if (!v.arrivalDate) return { deliveryDate: "Tarih Seçilmedi" };
            const arr = new Date(v.arrivalDate);
            // Tebligat Kanunu 7/a maddesi gereğince, e-tebligat gönderildiği günü izleyen 5. günün sonunda tebliğ sayılır.
            arr.setDate(arr.getDate() + 5);
            // Format YYYY-MM-DD for consistency or locale string
            const dd = String(arr.getDate()).padStart(2, '0');
            const mm = String(arr.getMonth() + 1).padStart(2, '0');
            const yyyy = arr.getFullYear();
            return { deliveryDate: `${dd}.${mm}.${yyyy}` };
        },
};
