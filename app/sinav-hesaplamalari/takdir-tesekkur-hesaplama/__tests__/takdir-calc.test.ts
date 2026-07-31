import assert from "node:assert/strict";
import { hesapla, type HesapGirdisi } from "../lib/takdir-calc";

function baseInput(overrides: Partial<HesapGirdisi> = {}): HesapGirdisi {
    return {
        dersler: [
            { ad: "Matematik", not: 90, saat: 6 },
            { ad: "Türkçe", not: 86, saat: 5 },
            { ad: "Fen", not: 82, saat: 4 },
        ],
        devamsizlik: 2,
        kinamaCezasi: false,
        ...overrides,
    };
}

function test(name: string, fn: () => void) {
    try {
        fn();
        console.log(`ok - ${name}`);
    } catch (error) {
        console.error(`not ok - ${name}`);
        throw error;
    }
}

test("takdir: ortalama >= 85, zayif yok, devamsizlik <= 5, ceza yok", () => {
    assert.equal(hesapla(baseInput()).sonuc, "takdir");
});

test("tesekkur: 70 <= ortalama < 85, tum sartlar tamam", () => {
    const result = hesapla(baseInput({ dersler: [{ ad: "Matematik", not: 75, saat: 6 }, { ad: "Türkçe", not: 80, saat: 5 }] }));
    assert.equal(result.sonuc, "tesekkur");
});

test("engel_zayif: ortalama 90 ama bir ders 45", () => {
    const result = hesapla(baseInput({ dersler: [{ ad: "Matematik", not: 45, saat: 1 }, { ad: "Türkçe", not: 95, saat: 9 }] }));
    assert.equal(result.sonuc, "engel_zayif");
    assert.match(result.engelNedenler[0], /Matematik/);
});

test("engel_devamsiz: ortalama 87 ama devamsizlik 6", () => {
    assert.equal(hesapla(baseInput({ devamsizlik: 6 })).sonuc, "engel_devamsiz");
});

test("engel_ceza: ortalama 88, kinama isaretli", () => {
    assert.equal(hesapla(baseInput({ kinamaCezasi: true })).sonuc, "engel_ceza");
});

test("engel_ortalama: ortalama 65", () => {
    const result = hesapla(baseInput({ dersler: [{ ad: "Matematik", not: 65, saat: 4 }, { ad: "Türkçe", not: 65, saat: 4 }] }));
    assert.equal(result.sonuc, "engel_ortalama");
});

test("coklu_engel: hem zayif hem devamsizlik", () => {
    const result = hesapla(baseInput({ dersler: [{ ad: "Matematik", not: 45, saat: 1 }, { ad: "Türkçe", not: 95, saat: 9 }], devamsizlik: 8 }));
    assert.equal(result.sonuc, "coklu_engel");
    assert.equal(result.engelNedenler.length, 2);
});

test("tesekkurIcinEksik: ortalama 65 icin 5 eksik doner", () => {
    const result = hesapla(baseInput({ dersler: [{ ad: "Matematik", not: 65, saat: 4 }, { ad: "Türkçe", not: 65, saat: 4 }] }));
    assert.equal(result.tesekkurIcinEksik, 5);
});

test("enEtkilDers: en yuksek saatli dersi doner", () => {
    assert.equal(hesapla(baseInput()).enEtkilDers, "Matematik");
});

test("toplam saat 0 ise 0 doner", () => {
    const result = hesapla(baseInput({ dersler: [{ ad: "Bos", not: 100, saat: 0 }] }));
    assert.equal(result.ortalama, 0);
    assert.equal(result.enEtkilDersEtkisi, 0);
});
