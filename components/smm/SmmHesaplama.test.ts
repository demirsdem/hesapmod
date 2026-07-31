import assert from "node:assert/strict";
import {
    bruttenHesapla,
    formatTRY,
    getMeslekStopaj,
    hesapla,
    nettenHesapla,
    tahsildenHesapla,
} from "../../lib/smm-calculator";

{
    const r = bruttenHesapla({
        brutTutar: 10000,
        kdvOrani: 20,
        stopajOrani: 20,
    });
    assert.equal(r.kdvTutari, 2000, "KDV 2000 olmalı");
    assert.equal(r.stopajTutari, 2000, "Stopaj 2000 olmalı");
    assert.equal(r.tahsilEdilecek, 10000, "Tahsil 10000 olmalı");
    assert.equal(r.netGelir, 8000, "Net 8000 olmalı");
    console.log("✓ Brütten hesaplama");
}

{
    const r = nettenHesapla({
        netGelir: 8000,
        kdvOrani: 20,
        stopajOrani: 20,
    });
    assert.ok(
        Math.abs(r.brutTutar - 10000) < 0.01,
        "Net 8000 → brüt 10000 olmalı"
    );
    console.log("✓ Netten brüte");
}

{
    const r = tahsildenHesapla({
        tahsilEdilecek: 10000,
        kdvOrani: 20,
        stopajOrani: 20,
    });
    assert.ok(
        Math.abs(r.brutTutar - 10000) < 0.01,
        "Tahsil 10000 → brüt 10000 olmalı"
    );
    console.log("✓ Tahsilden brüte");
}

{
    const r = bruttenHesapla({
        brutTutar: 10000,
        kdvOrani: 0,
        stopajOrani: 20,
    });
    assert.equal(r.kdvTutari, 0, "KDV muaf → 0 olmalı");
    assert.equal(r.tahsilEdilecek, 8000, "Muaf tahsil: brüt - stopaj");
    console.log("✓ KDV muaf senaryosu");
}

{
    const r = bruttenHesapla({
        brutTutar: 10000,
        kdvOrani: 20,
        stopajOrani: 17,
    });
    assert.equal(r.stopajTutari, 1700, "Telif stopaj 1700 olmalı");
    assert.equal(r.tahsilEdilecek, 10300, "Telif tahsil 10300 olmalı");
    console.log("✓ Telif %17 stopaj");
}

{
    assert.equal(getMeslekStopaj("avukat").oran, 20);
    assert.equal(getMeslekStopaj("yazar-telif").oran, 17);
    assert.equal(getMeslekStopaj("yazar-telif").kapsam, "telif");
    console.log("✓ Meslek stopaj oranları");
}

{
    assert.equal(
        hesapla({
            tutar: 0,
            tutarTipi: "brut",
            meslek: "avukat",
            kdvOrani: 20,
            stopajOrani: 20,
        }),
        null,
        "Sıfır tutar null döndürmeli"
    );
    assert.equal(
        hesapla({
            tutar: -100,
            tutarTipi: "brut",
            meslek: "avukat",
            kdvOrani: 20,
            stopajOrani: 20,
        }),
        null,
        "Negatif tutar null döndürmeli"
    );
    console.log("✓ Hata durumları");
}

{
    const f = formatTRY(10000);
    assert.ok(f.includes("10.000"), "Binlik ayraç noktayla olmalı");
    assert.ok(f.includes("₺") || f.includes("TRY"), "Para birimi");
    console.log("✓ formatTRY");
}

console.log("\n✅ Tüm testler geçti.");
