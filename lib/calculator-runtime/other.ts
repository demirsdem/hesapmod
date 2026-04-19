import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "zekat-hesaplama": (v) => {
            const altinDegeri = (Number(v.altin) || 0) * (Number(v.altinFiyat) || 0);
            const toplam = (Number(v.nakit) || 0) + (Number(v.doviz) || 0) + altinDegeri + (Number(v.ticariMal) || 0);
            const net = toplam - (Number(v.borc) || 0);
            const nisap = 80.18 * (Number(v.altinFiyat) || 0); // 2026 nisap gramı
            if (net < nisap) return { netServet: net, zekatTutari: 0, uyari: "Zekat düşmemektedir." };
            return { netServet: net, zekatTutari: net * 0.025, uyari: "" };
        },
    "klima-btu-hesaplama": (v) => {
            const katsayi: Record<string, number> = { marmara: 385, ege: 400, akdeniz: 445, ic: 360, karadeniz: 350, dogu: 420, guney: 430 };
            const m2 = Number(v.metrekare) || 0;
            const bolgeKey = typeof v.bolge === 'string' && katsayi[v.bolge] ? v.bolge : 'marmara';
            const bolge = katsayi[bolgeKey];
            const kisi = Number(v.kisi) || 1;
            const kapasite = m2 * bolge + kisi * 600;
            let tavsiye = '';
            if (kapasite <= 9000) tavsiye = '9.000 BTU';
            else if (kapasite <= 12000) tavsiye = '12.000 BTU';
            else if (kapasite <= 18000) tavsiye = '18.000 BTU';
            else tavsiye = '24.000 BTU+';
            return { kapasite, tavsiye };
        },
    "iller-arasi-mesafe-hesaplama": (v) => {
            const val = parseFloat(v.distanceKm) || 0;
            // Rough heuristic: road distance is ~1.3x air distance
            const roadKm = val > 0 ? val * 1.3 : 450; 
            
            // Assuming avg car speed 90km/h, bus speed 75km/h
            const carHours = roadKm / 90;
            const busHours = roadKm / 75;

            const formatTime = (h: number) => {
                const hh = Math.floor(h);
                const mm = Math.round((h - hh) * 60);
                return `${hh} Saat ${mm} Dakika`;
            };

            return {
                roadDistance: roadKm,
                carTime: formatTime(carHours),
                busTime: formatTime(busHours)
            };
        },
    "otel-fiyati-hesaplama": (v) => {
            const nights = parseFloat(v.nights) || 0;
            const pax = parseFloat(v.pax) || 0;
            const childList = parseFloat(v.child) || 0;
            const price = parseFloat(v.pricePP) || 0;
            
            // Assume child is half price
            const childCoef = childList * 0.5;
            
            return {
                totalCost: (pax + childCoef) * price * nights
            };
        },
    "en-ucuz-otobus-bileti-fiyati-hesaplama": (v) => {
            const dist = parseFloat(v.distance) || 0;
            const pax = parseFloat(v.pax) || 1;
            // Rough estimation in Turkey 2026: Base 250 TL + (~1.2 TL per km)
            const pricePP = 250 + (dist * 1.2);
            
            return {
                estimatedTicket: pricePP,
                totalTicket: pricePP * pax
            };
        },
    "en-ucuz-ucak-bileti": (v) => {
            const t = parseFloat(v.pass) || 0;
            // Example Cap in Turkey 2026 (Domestic): roughly 3500-4500 TL
            const currentCap = 4500;
            const promoCap = 2800; // Expected average promo
            const base = (v.flightType === "economy") ? currentCap : promoCap;
            
            return {
                capPricePP: base,
                totalPrice: base * t
            };
        },
};
