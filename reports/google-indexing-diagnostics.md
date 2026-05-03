# Google Indexing Diagnostics

Generated: 3 Mayis 2026

Bu dosya Search Console URL Inspection ve Page Indexing raporunda tek tek kontrol edilecek maddeleri toplar.

## URL Inspection Kontrol Sirasi

Her canonical URL icin su sorular kontrol edilmeli:

1. URL Google'da var mi?
2. Canli URL testi basarili mi?
3. Google tarafindan secilen canonical, kullanici tarafindan bildirilen canonical ile ayni mi?
4. Durum "Discovered - currently not indexed" mi?
5. Durum "Crawled - currently not indexed" mi?
6. Duplicate/canonical problemi var mi?
7. noindex veya robots engeli var mi?
8. Soft 404 sinyali var mi?
9. Sayfa sitemap'te gorunuyor mu?
10. Sayfa ana sayfa, tum araclar ve kategori hub uzerinden link aliyor mu?

## Canli Teknik Kontrol

| Metrik | Sonuc |
| --- | ---: |
| Kontrol edilen canonical URL | 137 |
| Teknik sorunlu URL | 0 |
| Ic linki zayif URL | 0 |
| HTTP 200 olmayan | 0 |
| Sitemap disi | 0 |
| Canonical hatali | 0 |
| Title bos | 0 |
| Meta bos | 0 |
| Content zayif/bos | 0 |
| FAQ bulunamadi | 0 |

## Search Console Durum Yorumlari

- "Discovered - currently not indexed": Google URL'yi biliyor ama henuz crawl etmemis olabilir. Sitemap tekrar gonderimi, kategori hub linkleri ve URL Inspection onceligi uygulanir.
- "Crawled - currently not indexed": Google sayfayi taramis ama indexe almamis olabilir. Icerik benzersizligi, H1/title niyeti, FAQ ve related link gucu yeniden kontrol edilir.
- "Duplicate, Google chose different canonical": Alias URL gonderilmis olabilir ya da sayfa canonical sinyali zayiftir. Sadece master listedeki canonical URL gonderilir.
- "Excluded by noindex/robots": robots.txt, meta robots ve response header kontrol edilir.
- "Soft 404": Sayfa 200 donse bile icerik zayif veya niyet belirsiz olabilir. Hesaplama alanlari, ornek hesaplama ve kategori baglam metni guclendirilir.
