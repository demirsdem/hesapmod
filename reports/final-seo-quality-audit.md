# Final SEO Quality Audit

Generated at: 2026-05-02T15:45:00+03:00

## Audit Script Sonucu

Komut:

```bash
npx tsx scripts/audit-calculator-expansion.ts
```

Sonuç:

| Kontrol | Sonuç |
|---|---:|
| Calculator count | 310 |
| Implementation item count | 235 |
| Processed false | 0 |
| Safety skipped | 1 |
| Duplicate slug | 0 |
| Duplicate title | 0 |
| Duplicate meta | 0 |
| Stage 5 yeni slug | 20 |
| Stage 5 SEO güncellenen slug | 2 |
| Stage 5 yeni URL sitemap kaynak kontrolü | 20/20 |
| Error | 0 |
| Warning | 0 |

## Canonical ve Sitemap Kontrolü

| Kontrol | Durum |
|---|---|
| Yeni calculator URL formatı `/{category}/{slug}` | Tamam |
| Yeni kategori slug'ı `insaat-muhendislik` | Tamam |
| Kategori hub `/kategori/insaat-muhendislik` sitemap kaynağında | Tamam |
| Yeni 20 canonical URL sitemap kaynağında | Tamam |
| Redirect edilen duplicate URL'ler sitemap kaynağında yok | Tamam |
| `robots.txt` sitemap URL'ini gösteriyor | Tamam |

Local sitemap kaynak sayısı: 388 URL

Stage 5 sitemap kaynak sayısı: 20 yeni canonical URL

## Duplicate Kontrolü

Yeni duplicate açılmayan hedefler:

- Metrekare hesaplama: `/ticaret-ve-is/insaat-alani-hesaplama`
- Arsa değer hesaplama: `/gayrimenkul-deger-hesaplama`
- Bina maliyet hesaplama: `/ticaret-ve-is/insaat-maliyeti-hesaplama`
- Klima kapasite hesaplama: `/diger/klima-btu-hesaplama`

Canlı redirect kontrolü:

- `/insaat-muhendislik/metrekare-hesaplama` -> 308 -> `/ticaret-ve-is/insaat-alani-hesaplama`
- `/insaat-muhendislik/bina-maliyet-hesaplama` -> 308 -> `/ticaret-ve-is/insaat-maliyeti-hesaplama`
- `/insaat-muhendislik/arsa-deger-hesaplama` -> 308 -> `/gayrimenkul-deger-hesaplama`
- `/insaat-muhendislik/klima-kapasite-hesaplama` -> 308 -> `/diger/klima-btu-hesaplama`

## Internal Linking Kontrolü

- Beton, çimento, kum, demir, hafriyat kümesi bağlandı.
- Boya, seramik, parke, metrekare/alan kümesi bağlandı.
- Çatı alan, merdiven, metreküp kümesi bağlandı.
- İnşaat maliyeti, bina maliyeti, arsa değer kümesi bağlandı.
- Elektrik kablo, su tesisat, ısı kaybı, güneş paneli, klima kapasite kümesi bağlandı.

## Güvenlik ve Manuel Kontrol Notları

- İnşaat/mühendislik hesaplayıcıları kesin proje veya mühendislik garantisi vermeyecek şekilde konumlandırıldı.
- Yerel fiyat, malzeme, uygulama, işçilik, fire ve tedarik farkları içerikte vurgulandı.
- Güvenlik nedeniyle otomatik eklenmeyen global madde: ilaç doz hesaplama.
- Güncel tarife/oran/veri gerektiren finans, vergi, sağlık ve teknik kapasite sayfaları manuel dönemsel kontrol gerektirir.
