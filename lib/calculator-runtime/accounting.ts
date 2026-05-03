import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "issizlik-maasi-hesaplama": (v) => {
            // 2026: Brüt maaş * 0.40, tavan = asgari ücretin %80'i, damga vergisi %0.759
            const asgariUcret = 33030; // 2026 brüt asgari ücret
            const tavan = asgariUcret * 0.8;
            let aylikBrut = v.brutMaas * 0.4;
            if (aylikBrut > tavan) aylikBrut = tavan;
            const damgaVergisi = aylikBrut * 0.00759;
            const aylikNet = aylikBrut - damgaVergisi;
            const toplamSure = v.primGunu === 600 ? 6 : v.primGunu === 900 ? 8 : 10;
            return { aylikNet, toplamSure };
        },
    "yillik-izin-ucreti-hesaplama": (v) => {
            // Brüt izin ücreti = (brüt maaş / 30) * izin günü
            const gun = Number(v.gun) || 0;
            const brutMaas = Number(v.brutMaas) || 0;
            const brutUcret = (brutMaas / 30) * gun;
            // Net hesaplama: SGK işçi primi %14, işsizlik %1, gelir vergisi %20, damga %0.759
            let netUcret = brutUcret;
            if (v.netMi) {
                const sgk = brutUcret * 0.14;
                const issizlik = brutUcret * 0.01;
                const gelir = brutUcret * 0.20;
                const damga = brutUcret * 0.00759;
                netUcret = brutUcret - sgk - issizlik - gelir - damga;
            }
            return { brutUcret, netUcret };
        },
    "kisa-calisma-odenegi-hesaplama": (v) => {
            // Günlük ödenek = brüt/30 * 0.6, tavan = brüt asgari ücretin %150'si, damga vergisi %0.759
            const asgariUcret = 33030; // 2026 brüt asgari ücret
            const tavan = asgariUcret * 1.5;
            let aylikBrut = (Number(v.brutOrtalama) || 0) * 0.6;
            if (aylikBrut > tavan) aylikBrut = tavan;
            const damgaVergisi = aylikBrut * 0.00759;
            const aylikNet = aylikBrut - damgaVergisi;
            return { aylikNet };
        },
    "binek-arac-gider-kisitlamasi-hesaplama": (v) => {
            // 2026 limitleri: kira 20.000 TL/ay, alış 1.500.000 TL, KDV+ÖTV 440.000 TL, %70 gider yazılabilir
            let vergidenDusulecek = 0, kkeg = 0;
            if (v.giderTuru === "kira") {
                const limit = 20000;
                vergidenDusulecek = Math.min(Number(v.kiraBedeli) || 0, limit) * 0.7;
                kkeg = Math.max((Number(v.kiraBedeli) || 0) - limit, 0) + (Math.min(Number(v.kiraBedeli) || 0, limit) * 0.3);
            } else if (v.giderTuru === "amortisman") {
                const limit = 1500000;
                vergidenDusulecek = Math.min(Number(v.alisBedeli) || 0, limit) * 0.7;
                kkeg = Math.max((Number(v.alisBedeli) || 0) - limit, 0) + (Math.min(Number(v.alisBedeli) || 0, limit) * 0.3);
            } else if (v.giderTuru === "yakit") {
                vergidenDusulecek = ((Number(v.kiraBedeli) || 0) + (Number(v.alisBedeli) || 0) + (Number(v.kdvOtv) || 0)) * 0.7;
                kkeg = ((Number(v.kiraBedeli) || 0) + (Number(v.alisBedeli) || 0) + (Number(v.kdvOtv) || 0)) * 0.3;
            }
            return { vergidenDusulecek, kkeg };
        },
    "amortisman-hesaplama": (v) => {
            const alis = Number(v.alisBedeli) || 0;
            const omur = Number(v.omur) || 1;
            const yontem = v.yontem;
            let tablo = [];
            let kalan = alis;
            if (yontem === "normal") {
                const pay = alis / omur;
                for (let i = 1; i <= omur; i++) {
                    kalan -= pay;
                    tablo.push({ yil: i, amortisman: pay, kalan: Math.max(kalan, 0) });
                }
            } else {
                let oran = 2 / omur;
                for (let i = 1; i <= omur; i++) {
                    const pay = kalan * oran;
                    kalan -= pay;
                    tablo.push({ yil: i, amortisman: pay, kalan: Math.max(kalan, 0) });
                }
            }
            return { amortismanTablosu: tablo, netDefterDegeri: Math.max(kalan, 0) };
        },
    "emeklilik-hesaplama": (v) => {
            const cinsiyet = v.cinsiyet;
            const dogumYili = Number(v.dogumYili) || 0;
            const ilkGirisYili = Number(v.ilkGirisYili) || 0;
            const primGun = Number(v.primGun) || 0;
            let hedefYas = "-", gerekenPrim = 0, eksikPrim = 0, emeklilikDurumu = "-";
            if (ilkGirisYili < 1999) {
                hedefYas = "Yaş Şartı Yok (EYT)";
                gerekenPrim = 5000;
                if (primGun >= gerekenPrim) emeklilikDurumu = "EYT ile emekli olabilirsiniz.";
                else emeklilikDurumu = "Eksik prim tamamlanmalı.";
            } else if (ilkGirisYili < 2008) {
                hedefYas = cinsiyet === "kadin" ? "58" : "60";
                gerekenPrim = 7000;
                if (primGun >= gerekenPrim && (new Date().getFullYear() - dogumYili) >= Number(hedefYas)) emeklilikDurumu = "Emekli olabilirsiniz.";
                else emeklilikDurumu = "Şartlar henüz sağlanmadı.";
            } else {
                hedefYas = cinsiyet === "kadin" ? "58" : "60";
                gerekenPrim = 7200;
                if (primGun >= gerekenPrim && (new Date().getFullYear() - dogumYili) >= Number(hedefYas)) emeklilikDurumu = "Emekli olabilirsiniz.";
                else emeklilikDurumu = "Şartlar henüz sağlanmadı.";
            }
            eksikPrim = Math.max(gerekenPrim - primGun, 0);
            return { hedefYas, gerekenPrim, eksikPrim, emeklilikDurumu };
        },
    "serbest-meslek-makbuzu-hesaplama": (v) => {
            const tip = v.tip;
            const tutar = Number(v.tutar) || 0;
            let brut = 0, kdv = 0, stopaj = 0, toplam = 0, net = 0;
            if (tip === "brut") {
                brut = tutar;
                kdv = brut * 0.2;
                stopaj = brut * 0.2;
                toplam = brut + kdv;
                net = brut - stopaj;
            } else {
                brut = tutar / 0.8;
                kdv = brut * 0.2;
                stopaj = brut * 0.2;
                toplam = brut + kdv;
                net = brut - stopaj;
            }
            return { brut, kdv, stopaj, toplam, net };
        },
};
