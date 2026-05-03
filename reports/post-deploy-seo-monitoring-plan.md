# Post-Deploy SEO Monitoring Plan

Generated: 3 Mayis 2026
Production deploy: `dpl_6svbAS54LvANArT5V97dBJUHbc2h`
Live sitemap: `https://www.hesapmod.com/sitemap.xml`

## Scope

- Submit and monitor 137 verified canonical URLs.
- Keep 11 redirect/alias/source-mismatch URLs out of URL Inspection submissions.
- Track new calculator pages separately from SEO-updated existing pages.

## Gun 0 - 3 Mayis 2026

- Search Console > Sitemaps bolumunde `https://www.hesapmod.com/sitemap.xml` gonderimini yenile.
- `reports/google-indexing-priority-batches.md` sirasiyla URL Inspection kuyrugunu baslat.
- Batch 1 ve Batch 2 icin oncelikli URL Inspection istegi gonder.
- CSV'de `submittedDate` alanini gercek gonderim tarihiyle doldur.
- Redirect/alias URL'leri gondermeden once `reports/google-indexing-do-not-submit.md` listesini kontrol et.

## Gun 3 - 6 Mayis 2026

- URL Inspection ile Batch 1-2 ornekleminde `URL is on Google`, `Crawled - currently not indexed` ve `Discovered - currently not indexed` durumlarini ayir.
- Batch 3 ve Batch 4 URL'lerini URL Inspection'a al.
- 404, redirect, duplicate canonical veya canonical mismatch gorunurse ilgili URL'yi CSV'de `gscStatus` ve `notes` alaniyla isaretle.

## Gun 7 - 10 Mayis 2026

- Search Console > Pages raporunda yeni canonical URL'lerin indeksleme durumunu kontrol et.
- `Indexed`, `Crawled - currently not indexed`, `Discovered - currently not indexed`, `Duplicate, Google chose different canonical` kirilimlarini ayri say.
- Batch 5 SEO-guncellenen mevcut guclu sayfalari URL Inspection'a al.
- Sitemap okuma zamanini ve gorunen toplam URL sayisini not et.

## Gun 14 - 17 Mayis 2026

- Indexed / Crawled not indexed ayrimini kategori ve batch bazinda cikar.
- `Crawled - currently not indexed` kalan sayfalarda icerik yogunlugu, ozgun ornek, FAQ, internal link ve kategori hub baglantilarini kontrol et.
- `Discovered - currently not indexed` kalan sayfalarda sitemap, internal link derinligi ve kategori sayfasindaki gorunurlugu kontrol et.
- Gerekirse dusuk sinyal alan sayfalara 2-3 alakali ic link ekleme plani cikar.

## Gun 30 - 2 Haziran 2026

- Search Console Performance raporunda impression, click, CTR, average position ve query verilerini batch bazinda analiz et.
- Ilk impression alan ama CTR dusuk kalan sayfalarda title/meta revizyon adaylarini belirle.
- Impression almayan ama indexed olan sayfalarda internal link ve kategori hub gorunurlugunu artir.
- `Crawled - currently not indexed` kalan sayfalar icin icerik guncelleme sprinti ac.

## Icerik Guncelleme Plani

- Oncelik 1: Finans, Maas/Vergi, Matematik ve Egitim/Sinav sayfalarinda gercek kullanim senaryosu ve ornek hesaplama guclendirmesi.
- Oncelik 2: Saglik ve Spor/Fitness sayfalarinda guvenlik uyarisi, yorumlama rehberi ve kaynak/metodoloji bloklarinin gorunurlugu.
- Oncelik 3: Insaat/Muhendislik sayfalarinda birim, fire payi, yerel fiyat farki ve uygulama senaryosu aciklamalarinin artirilmasi.
- Oncelik 4: SEO-guncellenen mevcut guclu sayfalarda query bazli title/meta ince ayari.

## Operasyon Notlari

- URL Inspection limitleri nedeniyle batch sirasi korunmali, ancak hicbir canonical URL atlanmamali.
- Redirect/alias URL'ler Search Console'a gonderilmemeli; canonical hedefleri gonderilmeli.
- CSV ana liste operasyon sirasinda tek kaynak olarak kullanilmali.
