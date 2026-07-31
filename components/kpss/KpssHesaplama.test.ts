import assert from "node:assert/strict";
import { decodeUrlToState, defaultState, encodeStateToUrl, hesaplaKpss, hesaplaNet } from "../../lib/kpss-calculator";
import type { PuanTuru } from "../../types/kpss";

function test(name: string, fn: () => void) {
    try {
        fn();
        console.log(`ok - ${name}`);
    } catch (error) {
        console.error(`not ok - ${name}`);
        throw error;
    }
}

test("48 doğru 12 yanlış -> 45 net", () => {
    assert.equal(hesaplaNet(48, 12), 45);
});

test("0 doğru 0 yanlış -> 0 net", () => {
    assert.equal(hesaplaNet(0, 0), 0);
});

test("Yanlış > doğru durumunda net negatif olabilir", () => {
    assert.ok(hesaplaNet(5, 40) < 0);
});

test("P1 GY 48 net + GK 44 net -> yaklaşık 118", () => {
    const sonuc = hesaplaKpss({ puanTuru: "P1", gyDogru: 48, gyYanlis: 0, gkDogru: 44, gkYanlis: 0 });
    assert.ok(Math.abs(sonuc.tahminiPuan - 118) < 1);
});

test("Tüm cevaplar doğru -> 100 üzeri puan", () => {
    const sonuc = hesaplaKpss({ puanTuru: "P1", gyDogru: 60, gyYanlis: 0, gkDogru: 60, gkYanlis: 0 });
    assert.ok(sonuc.tahminiPuan > 100);
});

test("Tüm cevaplar yanlış -> ham puan eşiği karşılanmaz", () => {
    const sonuc = hesaplaKpss({ puanTuru: "P1", gyDogru: 0, gyYanlis: 60, gkDogru: 0, gkYanlis: 60 });
    assert.equal(sonuc.hamPuanEsigiKarsilandi, false);
    assert.equal(sonuc.puanUretildi, false);
});

test("GY doğru + yanlış > 60 -> hata fırlatır", () => {
    assert.throws(() => hesaplaKpss({ puanTuru: "P1", gyDogru: 50, gyYanlis: 15, gkDogru: 40, gkYanlis: 0 }));
});

test("Negatif girdi -> hata fırlatır", () => {
    assert.throws(() => hesaplaKpss({ puanTuru: "P1", gyDogru: -1, gyYanlis: 0, gkDogru: 0, gkYanlis: 0 }));
});

test("Geçerli state URL'e encode edilir ve geri çözülür", () => {
    const state = { puanTuru: "P1" as const, gyDogru: 48, gyYanlis: 12, gkDogru: 44, gkYanlis: 8 };
    const url = encodeStateToUrl(state);
    assert.deepEqual(decodeUrlToState(url), { ...state, ebDogru: defaultState.ebDogru, ebYanlis: defaultState.ebYanlis });
});

test("Eksik/bozuk URL parametrelerinde default state döner", () => {
    assert.deepEqual(decodeUrlToState("?tur=INVALID"), defaultState);
});

test("Puan türleri sonuç üretir", () => {
    (["P1", "P3", "P93", "P94"] as PuanTuru[]).forEach((tur) => {
        const sonuc = hesaplaKpss({ puanTuru: tur, gyDogru: 40, gyYanlis: 10, gkDogru: 35, gkYanlis: 5, ebDogru: 60, ebYanlis: 5 });
        assert.ok(sonuc.tahminiPuan > 0);
    });
});
