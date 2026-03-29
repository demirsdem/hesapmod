# Implementation Plan

## Durum Analizi

- `kredi-karti-asgari-odeme-tutari-hesaplama` icin `next.config.mjs` tarafinda dis redirect zaten vardi; ancak uygulama ici slug alias tablosunda ayni esleme bulunmuyordu.
- `kredi-erken-kapama-hesaplama` route seviyesinde ozel metadata override'ina sahipti ve sayfa icinde 2026 cerceve kutusu bulunuyordu.
- `kredi-erken-kapatma-cezasi-hesaplama` SEO override bloguna sahipti; fakat route seviyesinde ozel metadata override'i eksikti.
- `kredi-erken-kapatma-cezasi-hesaplama` sayfasinin `faqAppend` genisletmesi baslamisti, ancak `contentAppend` katmani benzer kredi sayfalarina gore daha zayif kalmisti.
- Ham icerikte `CRCRLF` turu cift satir sonu bozulmasi tespit edilmedi.

## Uygulama Plani

1. Slug alias tablosuna eksik canonical eslemeleri ekle.
2. `kredi-erken-kapatma-cezasi-hesaplama` icin route-level metadata override ekle.
3. Ayni sayfanin `contentAppend` ve `faqAppend` bloklarini 2026 mevzuat baglami ile genislet.
4. `content-last-modified.ts` icinde ilgili slug tarihlerini 2026-03-27'ye cek.
5. Gorev dokumanlarini olustur ve TypeScript kontrolu ile turu kapat.

## Uygulanan Degisiklikler

- `lib/calculator-source.ts` icinde eksik slug alias'lari eklendi:
  - `kredi-karti-asgari-odeme-tutari-hesaplama -> kredi-karti-asgari-odeme`
  - `kredi-erken-kapama -> kredi-erken-kapama-hesaplama`
  - `kredi-erken-kapatma-cezasi -> kredi-erken-kapatma-cezasi-hesaplama`
- `kredi-erken-kapatma-cezasi-hesaplama` icin `contentAppend` bolumune:
  - `%1 / %2 tazminat siniri`
  - `ceza tutari tek basina karar verdirmez`
  basliklari altinda yeni aciklama paragraflari eklendi.
- Ayni blokta yeni SSS girisleri kalici hale getirildi.
- `app/[category]/[slug]/page.tsx` icinde `kredi-erken-kapatma-cezasi-hesaplama` icin route-level title/canonical/openGraph override'i eklendi.
- `lib/content-last-modified.ts` icinde iki erken kapama slug'i `2026-03-27T12:00:00+03:00` tarihine guncellendi.

## Dogrulama

- Komut: `npm exec tsc -- --noEmit`
- Sonuc: basarili
