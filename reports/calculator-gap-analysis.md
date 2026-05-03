# Calculator Gap Analysis

Generated at: 2026-05-01T14:51:13.164Z

Source files read:

- `lib/calculator-source.ts`
- `lib/calculators.ts`
- `lib/customCalculators.ts`
- `lib/calculator-trust.ts`
- `lib/content-last-modified.ts`
- `lib/sitemap-data.ts`
- `app/[category]/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `next.config.mjs`
- `package.json`

## Özet

- Toplam hedef madde: 235
- VAR: 22
- BENZER VAR: 55
- VAR AMA SEO ZAYIF: 62
- YOK: 95
- GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ: 1

## Detay

| Kategori | Hedef Hesaplayıcı | Durum | Mevcut Slug | Önerilen Aksiyon |
|---|---|---|---|---|
| FİNANS | faiz hesaplama | VAR | `basit-faiz-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | bileşik faiz hesaplama | VAR AMA SEO ZAYIF | `bilesik-faiz-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (2); title/meta generic veya eksik |
| FİNANS | vadeli mevduat getirisi | VAR | `mevduat-faiz-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | kredi taksit hesaplama | VAR | `kredi-taksit-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | konut kredisi hesaplama | VAR | `konut-kredisi-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | ihtiyaç kredisi hesaplama | VAR | `ihtiyac-kredisi-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | taşıt kredisi hesaplama | VAR | `tasit-kredisi-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | kredi erken kapama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| FİNANS | kredi toplam geri ödeme | BENZER VAR | `kredi-taksit-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Kredi taksit sayfası toplam geri ödeme çıktısı için en yakın mevcut sayfadır; ayrı hedef sayfa yok. |
| FİNANS | enflasyon hesaplama | VAR | `enflasyon-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | reel getiri hesaplama | VAR AMA SEO ZAYIF | `reel-getiri-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (58 kelime); FAQ 5'ten az (3) |
| FİNANS | altın getirisi hesaplama | BENZER VAR | `gecmis-altin-fiyatlari` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Geçmiş altın fiyatları yatırım getirisi niyetine yakındır; canlı al-sat getirisi ayrı değildir. |
| FİNANS | dolar getirisi hesaplama | BENZER VAR | `gecmis-doviz-kurlari` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Geçmiş döviz kurları geçmiş USD değeri için yakındır; ayrı dolar getirisi sayfası yok. |
| FİNANS | euro getirisi hesaplama | BENZER VAR | `gecmis-doviz-kurlari` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Geçmiş döviz kurları geçmiş EUR değeri için yakındır; ayrı euro getirisi sayfası yok. |
| FİNANS | gram altın hesaplama | VAR AMA SEO ZAYIF | `altin-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (3) |
| FİNANS | döviz çevirici | VAR | `doviz-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| FİNANS | para değer kaybı hesaplama | BENZER VAR | `enflasyon-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Enflasyon sayfası alım gücü/değer kaybı niyetine yakındır. |
| FİNANS | borsa kar zarar | BENZER VAR | `kar-zarar-marji` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Genel kar-zarar/marj var; borsa işlemi özelinde ayrı sayfa yok. |
| FİNANS | hisse ortalama maliyet | BENZER VAR | `ortalama-maliyet-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Genel ortalama maliyet var; hisse lot/fiyat niyeti ayrı değil. |
| FİNANS | portföy dağılımı | YOK | - | Yeni hesaplayıcı planlanmalı. |
| FİNANS | yatırım getiri oranı | BENZER VAR | `ic-verim-orani-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: IRR sayfası getiri oranı niyetine yakındır; genel ROI sayfası yok. |
| FİNANS | stopaj hesaplama | BENZER VAR | `kira-stopaj-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Kira stopajı var; genel yatırım/finans stopajı ayrı değil. |
| FİNANS | kar payı hesaplama | VAR AMA SEO ZAYIF | `sermaye-ve-temettu-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (79 kelime); FAQ 5'ten az (2) |
| FİNANS | ETF getiri hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| FİNANS | tahvil getirisi | VAR AMA SEO ZAYIF | `tahvil-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (72 kelime); FAQ 5'ten az (2) |
| FİNANS | bono getirisi | VAR AMA SEO ZAYIF | `bono-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (82 kelime); FAQ 5'ten az (2) |
| FİNANS | döviz kar zarar | BENZER VAR | `gecmis-doviz-kurlari` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Geçmiş kur sayfası yakındır; işlem bazlı kar-zarar ayrı değil. |
| FİNANS | altın al sat karı | BENZER VAR | `altin-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Altın çevirici var; alış-satış karı ve makas niyeti ayrı değil. |
| FİNANS | kripto kar zarar | YOK | - | Yeni hesaplayıcı planlanmalı. |
| FİNANS | kira getirisi | VAR AMA SEO ZAYIF | `gayrimenkul-deger-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (19 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; related/internal link yok |
| FİNANS | gayrimenkul ROI | VAR AMA SEO ZAYIF | `gayrimenkul-deger-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (19 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; related/internal link yok |
| FİNANS | amortisman süresi | VAR AMA SEO ZAYIF | `gayrimenkul-deger-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (19 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; related/internal link yok |
| FİNANS | finansal özgürlük hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| FİNANS | pasif gelir hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| FİNANS | yatırım hedef hesaplama | BENZER VAR | `birikim-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Birikim hedefi/yatırım birikimi için yakın mevcut sayfa var. |
| MAAŞ & VERGİ | net maaş hesaplama | VAR AMA SEO ZAYIF | `maas-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| MAAŞ & VERGİ | brüt maaş hesaplama | VAR AMA SEO ZAYIF | `maas-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| MAAŞ & VERGİ | brütten nete maaş | VAR AMA SEO ZAYIF | `maas-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| MAAŞ & VERGİ | netten brüte maaş | VAR AMA SEO ZAYIF | `maas-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| MAAŞ & VERGİ | asgari ücret hesaplama | VAR AMA SEO ZAYIF | `asgari-ucret-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MAAŞ & VERGİ | vergi dilimi hesaplama | BENZER VAR | `gelir-vergisi-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Gelir vergisi sayfası dilim hesabını kapsar; ayrı vergi dilimi sayfası yok. |
| MAAŞ & VERGİ | gelir vergisi hesaplama | VAR AMA SEO ZAYIF | `gelir-vergisi-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (68 kelime); FAQ 5'ten az (3) |
| MAAŞ & VERGİ | damga vergisi hesaplama | VAR AMA SEO ZAYIF | `damga-vergisi-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MAAŞ & VERGİ | SGK kesintisi hesaplama | BENZER VAR | `maas-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Maaş sayfasında SGK işçi payı sonucu var; ayrı SGK kesintisi sayfası yok. |
| MAAŞ & VERGİ | işsizlik sigortası kesintisi | BENZER VAR | `maas-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Maaş sayfasında işsizlik sigortası kesintisi sonucu var; ayrı sayfa yok. |
| MAAŞ & VERGİ | maaş zam oranı hesaplama | BENZER VAR | `zam-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Genel zam sayfası var; maaşa özel zam oranı sayfası yok. |
| MAAŞ & VERGİ | maaş artış hesaplama | BENZER VAR | `zam-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Genel zam sayfası var; maaşa özel artış sayfası yok. |
| MAAŞ & VERGİ | yıllık maaş hesaplama | BENZER VAR | `maas-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Maaş hesaplama var; yıllık maaş odağı ayrı değil. |
| MAAŞ & VERGİ | saatlik ücret hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MAAŞ & VERGİ | günlük ücret hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MAAŞ & VERGİ | fazla mesai hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MAAŞ & VERGİ | kıdem tazminatı hesaplama | VAR | `kidem-tazminati-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| MAAŞ & VERGİ | ihbar tazminatı hesaplama | VAR | `ihbar-tazminati-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| MAAŞ & VERGİ | izin ücreti hesaplama | VAR AMA SEO ZAYIF | `yillik-izin-ucreti-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (48 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; FAQ 5'ten az (2); related/internal link yok |
| MAAŞ & VERGİ | emeklilik maaşı tahmini | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MAAŞ & VERGİ | EYT emeklilik hesaplama | VAR AMA SEO ZAYIF | `emeklilik-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (57 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; FAQ 5'ten az (2); related/internal link yok |
| MAAŞ & VERGİ | emeklilik yaşı hesaplama | VAR AMA SEO ZAYIF | `emeklilik-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (57 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; FAQ 5'ten az (2); related/internal link yok |
| MAAŞ & VERGİ | SGK prim hesaplama | BENZER VAR | `maas-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Maaş sayfası SGK işçi payını hesaplar; genel prim günü/tutarı sayfası yok. |
| MAAŞ & VERGİ | işveren maliyeti hesaplama | BENZER VAR | `asgari-ucret-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Asgari ücret sayfası işveren maliyetine yakındır; genel işveren maliyeti sayfası yok. |
| MAAŞ & VERGİ | bordro hesaplama | BENZER VAR | `maas-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Maaş bordro bileşenleri var; ayrı bordro sayfası yok. |
| MAAŞ & VERGİ | net gelir hesaplama | BENZER VAR | `maas-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Maaş net gelir için yakındır; genel net gelir sayfası yok. |
| MAAŞ & VERGİ | freelance vergi hesaplama | BENZER VAR | `serbest-meslek-makbuzu-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Serbest meslek makbuzu var; freelance yıllık vergi sayfası yok. |
| MAAŞ & VERGİ | serbest meslek vergisi | VAR AMA SEO ZAYIF | `serbest-meslek-makbuzu-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (44 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; FAQ 5'ten az (2); related/internal link yok |
| MAAŞ & VERGİ | fatura KDV hesaplama | VAR AMA SEO ZAYIF | `kdv-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MAAŞ & VERGİ | stopaj hesaplama | BENZER VAR | `kira-stopaj-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Kira stopajı var; genel stopaj sayfası yok. |
| MATEMATİK | yüzde hesaplama | VAR AMA SEO ZAYIF | `yuzde-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| MATEMATİK | yüzde artış hesaplama | VAR AMA SEO ZAYIF | `yuzde-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| MATEMATİK | yüzde azalış hesaplama | VAR AMA SEO ZAYIF | `yuzde-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| MATEMATİK | ortalama hesaplama | VAR AMA SEO ZAYIF | `ortalama-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MATEMATİK | aritmetik ortalama | VAR AMA SEO ZAYIF | `ortalama-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MATEMATİK | geometrik ortalama | VAR AMA SEO ZAYIF | `ortalama-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MATEMATİK | medyan hesaplama | VAR AMA SEO ZAYIF | `ortalama-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MATEMATİK | standart sapma | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | varyans hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | oran hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | orantı hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | faktöriyel hesaplama | VAR AMA SEO ZAYIF | `faktoriyel-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (17 kelime); FAQ 5'ten az (1) |
| MATEMATİK | kombinasyon hesaplama | VAR AMA SEO ZAYIF | `kombinasyon-permutasyon-faktoriyel` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (13 kelime); FAQ 5'ten az (2) |
| MATEMATİK | permütasyon hesaplama | VAR AMA SEO ZAYIF | `kombinasyon-permutasyon-faktoriyel` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (13 kelime); FAQ 5'ten az (2) |
| MATEMATİK | üslü sayı hesaplama | VAR AMA SEO ZAYIF | `us-kuvvet-karekok` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (8 kelime); FAQ 5'ten az (3) |
| MATEMATİK | logaritma hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | kare hesaplama | BENZER VAR | `us-kuvvet-karekok` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Üs/kuvvet sayfası kare alma niyetini karşılayabilir; ayrı kare sayfası yok. |
| MATEMATİK | karekök hesaplama | VAR AMA SEO ZAYIF | `us-kuvvet-karekok` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (8 kelime); FAQ 5'ten az (3) |
| MATEMATİK | küpkök hesaplama | VAR AMA SEO ZAYIF | `us-kuvvet-karekok` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (8 kelime); FAQ 5'ten az (3) |
| MATEMATİK | alan hesaplama | VAR AMA SEO ZAYIF | `alan-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MATEMATİK | hacim hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | çevre hesaplama | VAR AMA SEO ZAYIF | `cevre-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| MATEMATİK | üçgen alanı | VAR AMA SEO ZAYIF | `ucgen-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (17 kelime); FAQ 5'ten az (1) |
| MATEMATİK | dikdörtgen alanı | VAR AMA SEO ZAYIF | `dikdortgen-alan-cevre` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (6 kelime); FAQ 5'ten az (3) |
| MATEMATİK | daire alanı | VAR AMA SEO ZAYIF | `daire-alan-cevre` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (6 kelime); FAQ 5'ten az (3) |
| MATEMATİK | silindir hacmi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | küre hacmi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | piramit hacmi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | trigonometri hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | sin cos tan hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | polinom hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | denklem çözücü | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | ikinci derece denklem | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | matris hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | determinant hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | rasyonel sayı hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | kesir hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | kesir sadeleştirme | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | kesir toplama çıkarma | YOK | - | Yeni hesaplayıcı planlanmalı. |
| MATEMATİK | sayı tabanı dönüştürme | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | BMI hesaplama | VAR | `vucut-kitle-indeksi-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| SAĞLIK | ideal kilo hesaplama | VAR AMA SEO ZAYIF | `ideal-kilo-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| SAĞLIK | günlük kalori ihtiyacı | VAR | `gunluk-kalori-ihtiyaci` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| SAĞLIK | BMR hesaplama | VAR | `bazal-metabolizma-hizi-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| SAĞLIK | vücut yağ oranı | VAR AMA SEO ZAYIF | `vucut-yag-orani-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (31 kelime); FAQ 5'ten az (1) |
| SAĞLIK | bel kalça oranı | VAR AMA SEO ZAYIF | `bel-kalca-orani-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (31 kelime); FAQ 5'ten az (1) |
| SAĞLIK | su ihtiyacı hesaplama | VAR AMA SEO ZAYIF | `gunluk-su-ihtiyaci-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| SAĞLIK | protein ihtiyacı | VAR | `gunluk-protein-ihtiyaci-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| SAĞLIK | karbonhidrat ihtiyacı | VAR AMA SEO ZAYIF | `gunluk-karbonhidrat-ihtiyaci-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (20 kelime); FAQ 5'ten az (1) |
| SAĞLIK | yağ ihtiyacı | VAR AMA SEO ZAYIF | `gunluk-yag-ihtiyaci-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (26 kelime); FAQ 5'ten az (1) |
| SAĞLIK | kalori yakma hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | adım kalori hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | nabız aralığı hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | hamilelik hesaplama | VAR | `gebelik-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| SAĞLIK | doğum tarihi hesaplama | VAR AMA SEO ZAYIF | `dogum-tarihi-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (24 kelime); FAQ 5'ten az (1) |
| SAĞLIK | gebelik haftası | VAR AMA SEO ZAYIF | `hamilelik-haftasi-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (65 kelime); FAQ 5'ten az (3) |
| SAĞLIK | bebek boy kilo hesaplama | BENZER VAR | `bebek-boyu-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Bebek boyu ve bebek kilosu ayrı sayfalar olarak var. |
| SAĞLIK | çocuk BMI | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | ilaç doz hesaplama | GÜVENLİK NEDENİYLE OTOMATİK EKLENMEZ | - | Otomatik hesaplayıcı eklenmez. Güvenli alternatif: genel bilgilendirme sayfası; kişisel doz/formül önerisi yok; doktor/eczacı talimatı vurgulanmalı. |
| SAĞLIK | alkol promil hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | uyku süresi hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | yaş hesaplama | VAR AMA SEO ZAYIF | `yas-hesaplama-detayli` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (32 kelime); FAQ 5'ten az (2); related/internal link yok |
| SAĞLIK | metabolizma yaşı | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SAĞLIK | fitness kalori hesaplama | BENZER VAR | `gunluk-kalori-ihtiyaci` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Günlük kalori/TDEE var; fitness egzersiz yakımı ayrı değil. |
| SAĞLIK | spor kalori hesaplama | BENZER VAR | `gunluk-kalori-ihtiyaci` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Günlük kalori/TDEE var; spor kalori yakımı ayrı değil. |
| GÜNLÜK YAŞAM | yaş hesaplama | VAR AMA SEO ZAYIF | `yas-hesaplama-detayli` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (32 kelime); FAQ 5'ten az (2); related/internal link yok |
| GÜNLÜK YAŞAM | tarih farkı hesaplama | VAR AMA SEO ZAYIF | `iki-tarih-arasindaki-gun-sayisi-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (94 kelime); FAQ 5'ten az (4) |
| GÜNLÜK YAŞAM | gün hesaplama | BENZER VAR | `tarih-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Genel tarih hesaplama var; bağımsız gün hesaplama sayfası yok. |
| GÜNLÜK YAŞAM | hafta hesaplama | VAR AMA SEO ZAYIF | `hafta-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (38 kelime); FAQ 5'ten az (2) |
| GÜNLÜK YAŞAM | ay hesaplama | BENZER VAR | `tarih-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Genel tarih hesaplama var; bağımsız ay hesaplama sayfası yok. |
| GÜNLÜK YAŞAM | yıl hesaplama | BENZER VAR | `tarih-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Genel tarih hesaplama var; bağımsız yıl hesaplama sayfası yok. |
| GÜNLÜK YAŞAM | gün ekleme çıkarma | BENZER VAR | `tarih-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Tarih hesaplama en yakın mevcut sayfadır. |
| GÜNLÜK YAŞAM | saat farkı hesaplama | VAR AMA SEO ZAYIF | `saat-farki-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (49 kelime); FAQ 5'ten az (2) |
| GÜNLÜK YAŞAM | zaman hesaplama | BENZER VAR | `zaman-birimleri-donusturucu` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Zaman birimleri dönüştürücü var; genel zaman hesaplama sayfası yok. |
| GÜNLÜK YAŞAM | geri sayım hesaplama | VAR AMA SEO ZAYIF | `kac-gun-kaldi-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (84 kelime); FAQ 5'ten az (4) |
| GÜNLÜK YAŞAM | doğum günü sayacı | BENZER VAR | `kac-gun-kaldi-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Kaç gün kaldı sayfası geri sayım niyetine yakındır; doğum günü özel değil. |
| GÜNLÜK YAŞAM | burç hesaplama | VAR AMA SEO ZAYIF | `burc-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (20 kelime); FAQ 5'ten az (1) |
| GÜNLÜK YAŞAM | boy kilo oranı | BENZER VAR | `vucut-kitle-indeksi-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Boy-kilo oranı niyeti VKİ sayfasına yakın. |
| GÜNLÜK YAŞAM | günlük su tüketimi | VAR AMA SEO ZAYIF | `gunluk-su-ihtiyaci-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| GÜNLÜK YAŞAM | günlük harcama hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | aylık bütçe hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | tasarruf hesaplama | BENZER VAR | `birikim-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Birikim sayfası tasarruf birikimi niyetine yakındır. |
| GÜNLÜK YAŞAM | elektrik tüketim hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | su faturası hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | doğalgaz tüketimi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | yakıt maliyeti | VAR AMA SEO ZAYIF | `yakit-tuketim-maliyet` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| GÜNLÜK YAŞAM | araç km maliyeti | BENZER VAR | `yakit-tuketim-maliyet` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Yakıt maliyeti sayfası km başına maliyeti kapsar. |
| GÜNLÜK YAŞAM | yol maliyeti | BENZER VAR | `yakit-tuketim-maliyet` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Yakıt/yol gideri için en yakın mevcut sayfa. |
| GÜNLÜK YAŞAM | tatil bütçesi hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | kira artış hesaplama | VAR | `kira-artis-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| GÜNLÜK YAŞAM | ev gider hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | alışveriş indirimi hesaplama | VAR AMA SEO ZAYIF | `indirim-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (114 kelime); FAQ 5'ten az (4) |
| GÜNLÜK YAŞAM | fiyat karşılaştırma | BENZER VAR | `fiyat-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Fiyat hesaplama var; karşılaştırma modülü ayrı değil. |
| GÜNLÜK YAŞAM | bahşiş hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| GÜNLÜK YAŞAM | split hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | YKS puan hesaplama | VAR | `yks-puan-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| EĞİTİM & SINAV | TYT puan hesaplama | VAR | `tyt-puan-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| EĞİTİM & SINAV | AYT puan hesaplama | BENZER VAR | `yks-puan-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: YKS sayfası TYT/AYT/YDT bileşenlerini birlikte kapsar; ayrı AYT sayfası yok. |
| EĞİTİM & SINAV | LGS puan hesaplama | VAR | `lgs-puan-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| EĞİTİM & SINAV | KPSS puan hesaplama | VAR AMA SEO ZAYIF | `kpss-puan-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4); title/meta generic veya eksik |
| EĞİTİM & SINAV | KPSS net hesaplama | BENZER VAR | `kpss-puan-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: KPSS sayfası net bazlı puan hesaplar; yalnız net sayfası yok. |
| EĞİTİM & SINAV | YKS sıralama tahmini | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | not ortalaması hesaplama | VAR AMA SEO ZAYIF | `ortalama-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: FAQ 5'ten az (4) |
| EĞİTİM & SINAV | GPA hesaplama | VAR | `universite-not-ortalamasi-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| EĞİTİM & SINAV | kredi notu hesaplama | BENZER VAR | `universite-not-ortalamasi-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Üniversite kredi/AKTS ortalaması var; ayrı kredi notu sayfası yok. |
| EĞİTİM & SINAV | ders ortalaması | BENZER VAR | `ders-notu-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Ders notu sayfası ders ortalaması niyetine yakındır. |
| EĞİTİM & SINAV | final notu hesaplama | BENZER VAR | `vize-final-ortalama-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Vize-final ortalama sayfası final notu niyetine yakındır. |
| EĞİTİM & SINAV | harf notu hesaplama | BENZER VAR | `universite-not-ortalamasi-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Üniversite ortalaması sayfası harf notu bağlamına yakındır; ayrı harf notu sayfası yok. |
| EĞİTİM & SINAV | devamsızlık hesaplama | BENZER VAR | `lise-sinif-gecme-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Sınıf geçme sayfası devamsızlık riskini içerir; ayrı devamsızlık sayfası yok. |
| EĞİTİM & SINAV | ders geçme notu | BENZER VAR | `lise-sinif-gecme-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. |
| EĞİTİM & SINAV | üniversite ortalama | VAR | `universite-not-ortalamasi-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| EĞİTİM & SINAV | diploma notu | BENZER VAR | `lise-mezuniyet-puani-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Lise mezuniyet puanı/OBP bağlamı var; genel diploma notu sayfası yok. |
| EĞİTİM & SINAV | akademik ortalama | BENZER VAR | `universite-not-ortalamasi-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. |
| EĞİTİM & SINAV | eğitim süresi hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | ders çalışma planı | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | net hesaplama | BENZER VAR | `yks-puan-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Sınav puan sayfaları netlerden puan üretir; genel net hesaplama sayfası yok. |
| EĞİTİM & SINAV | test başarı oranı | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | ders çalışma saati | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | öğrenci bütçe hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | burs hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | eğitim kredisi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | yurt maliyeti | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | okul gider hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | kitap maliyeti | YOK | - | Yeni hesaplayıcı planlanmalı. |
| EĞİTİM & SINAV | öğrenci yaşam maliyeti | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | beton hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | çimento hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | tuğla hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | boya hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | seramik hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | parke hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | demir hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | çatı alan hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | merdiven hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | metrekare hesaplama | BENZER VAR | `insaat-alani-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: İnşaat alanı sayfası m² niyetine yakındır. |
| İNŞAAT & MÜHENDİSLİK | metreküp hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | hafriyat hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | kum hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | alçı hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | sıva hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | inşaat maliyeti hesaplama | VAR AMA SEO ZAYIF | `insaat-maliyeti-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (61 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; FAQ 5'ten az (2); related/internal link yok |
| İNŞAAT & MÜHENDİSLİK | arsa değer hesaplama | BENZER VAR | `gayrimenkul-deger-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Gayrimenkul değer özel sayfası arsa değerini de kapsar; ayrı arsa değer sayfası yok. |
| İNŞAAT & MÜHENDİSLİK | bina maliyet hesaplama | BENZER VAR | `insaat-maliyeti-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: İnşaat maliyeti sayfası bina maliyeti niyetine yakındır. |
| İNŞAAT & MÜHENDİSLİK | elektrik kablo hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | su tesisat hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | ısı kaybı hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | güneş paneli hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | klima kapasite hesaplama | VAR AMA SEO ZAYIF | `klima-btu-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (38 kelime); örnek hesaplama yok; formül/yöntem anlatımı yok; FAQ 5'ten az (2); related/internal link yok |
| İNŞAAT & MÜHENDİSLİK | jeneratör güç hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| İNŞAAT & MÜHENDİSLİK | enerji tüketim hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | koşu pace hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | maraton tempo hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | kalori yakma hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | adım mesafe hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | VO2 max hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | nabız aralığı | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | yağ yakım bölgesi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | fitness kalori | BENZER VAR | `gunluk-kalori-ihtiyaci` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: TDEE/günlük kalori var; egzersiz kalori yakımı ayrı değil. |
| SPOR & FITNESS | protein ihtiyacı | VAR | `gunluk-protein-ihtiyaci-hesaplama` | Mevcut sayfa korunur; düzenleme bu aşamada yapılmadı. |
| SPOR & FITNESS | makro hesaplama | VAR AMA SEO ZAYIF | `gunluk-makro-besin-ihtiyaci-hesaplama` | Mevcut sayfa SEO standardına göre güçlendirilmeli: seo.content çok kısa (71 kelime); FAQ 5'ten az (3) |
| SPOR & FITNESS | kas kütlesi hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | bench press max | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | squat max | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | deadlift max | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | vücut kompozisyonu | BENZER VAR | `vucut-yag-orani-hesaplama` | Benzer mevcut sayfa incelenmeli; gerekirse ayrı landing veya kapsam genişletme planlanmalı. Not: Vücut yağ oranı var; kapsamlı kompozisyon sayfası yok. |
| SPOR & FITNESS | spor hedef hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | antrenman hacmi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | set tekrar hesaplama | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | dinlenme süresi | YOK | - | Yeni hesaplayıcı planlanmalı. |
| SPOR & FITNESS | kardiyo süresi | YOK | - | Yeni hesaplayıcı planlanmalı. |
