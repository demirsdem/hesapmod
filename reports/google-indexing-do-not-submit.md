# Google Indexing Do Not Submit

Generated: 3 Mayis 2026

Bu URL'ler Search Console URL Inspection listesine eklenmeyecek. Hepsi redirect, alias, duplicate-intent veya kaynak rapor yolu hatali olan URL'lerdir. Google'a canonical hedef gonderilmeli.

## Neden Gonderilmeyecek?

- Sitemap sadece HTTP 200 donen, indexlenebilir ve self-canonical URL'leri icermeli.
- Redirect/alias URL'ler sinyali canonical hedefe toplar; ayri index talebi duplicate/canonical karisikligi yaratabilir.
- URL Inspection canonical hedefte yapilirsa Google secilen canonical'i daha temiz gorur.

## URL Listesi

| Alias URL | HTTP | Canonical URL | Alias sitemap'te | Canonical sitemap'te | Neden |
| --- | ---: | --- | --- | --- | --- |
| https://www.hesapmod.com/maas-ve-vergi/bordro-hesaplama | 308 | https://www.hesapmod.com/maas-ve-vergi/maas-hesaplama | Hayir | Evet | Bordro niyeti mevcut maas hesaplama canonical sayfasiyla karsilaniyor; ayri sayfa acilmadi. |
| https://www.hesapmod.com/maas-ve-vergi/freelance-vergi-hesaplama | 308 | https://www.hesapmod.com/muhasebe/serbest-meslek-makbuzu-hesaplama | Hayir | Evet | Freelance vergi niyeti serbest meslek makbuzu canonical sayfasina yonlendirildi. |
| https://www.hesapmod.com/maas-ve-vergi/serbest-meslek-makbuzu-hesaplama | 308 | https://www.hesapmod.com/muhasebe/serbest-meslek-makbuzu-hesaplama | Hayir | Evet | Yanlis kategori aliasi dogru muhasebe canonical sayfasina yonlendirildi. |
| https://www.hesapmod.com/matematik-hesaplama/standart-sapma-hesaplama | 308 | https://www.hesapmod.com/matematik-hesaplama/standart-sapma | Hayir | Evet | Standart sapma icin canonical kisa slug kullaniliyor. |
| https://www.hesapmod.com/sinav-hesaplamalari/not-ortalamasi-hesaplama | 308 | https://www.hesapmod.com/matematik-hesaplama/ortalama-hesaplama | Hayir | Evet | Not ortalamasi niyeti ortalama hesaplama canonical iceriginde guclendirildi. |
| https://www.hesapmod.com/yasam-hesaplama/kira-artis-hesaplama | 308 | https://www.hesapmod.com/finansal-hesaplamalar/kira-artis-hesaplama | Hayir | Evet | Kira artisi finansal hesaplamalar canonical kategorisinde tutuluyor. |
| https://www.hesapmod.com/yasam-hesaplama/burc-hesaplama | 404 | https://www.hesapmod.com/astroloji/burc-hesaplama | Hayir | Evet | Kaynak rapordaki kategori yolu hatali; canli canonical astroloji kategorisinde. |
| https://www.hesapmod.com/insaat-muhendislik/metrekare-hesaplama | 308 | https://www.hesapmod.com/ticaret-ve-is/insaat-alani-hesaplama | Hayir | Evet | Metrekare/alan niyeti mevcut insaat alani canonical sayfasiyla karsilaniyor. |
| https://www.hesapmod.com/insaat-muhendislik/bina-maliyet-hesaplama | 308 | https://www.hesapmod.com/ticaret-ve-is/insaat-maliyeti-hesaplama | Hayir | Evet | Bina maliyeti niyeti insaat maliyeti canonical sayfasiyla karsilaniyor. |
| https://www.hesapmod.com/insaat-muhendislik/arsa-deger-hesaplama | 308 | https://www.hesapmod.com/gayrimenkul-deger-hesaplama | Hayir | Evet | Arsa deger niyeti gayrimenkul deger ozel sayfasiyla karsilaniyor. |
| https://www.hesapmod.com/insaat-muhendislik/klima-kapasite-hesaplama | 308 | https://www.hesapmod.com/diger/klima-btu-hesaplama | Hayir | Evet | Klima kapasite niyeti mevcut BTU canonical sayfasiyla karsilaniyor. |
