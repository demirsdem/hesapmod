# Aşama 2-4 Deploy Dahil Olma Kontrolü

Denetim tarihi: 2 Mayıs 2026  
Başlangıçta verilen production deploy: `dpl_F13KWox7vEi1b1FndwXnpVNLEHTu`  
Denetim sonrası production deploy: `dpl_6svbAS54LvANArT5V97dBJUHbc2h`  
Deployment URL: `https://hesapmod-4qkpogpzi-sdem81s-projects.vercel.app`  
Durum: `Ready`  
Alias: `https://www.hesapmod.com`

- Son production deploy: `dpl_6svbAS54LvANArT5V97dBJUHbc2h`
- Aşama 2 raporu var mı: Evet, `reports/stage-2-finance-salary-tax-summary.md`
- Aşama 3 raporu var mı: Evet, `reports/stage-3-math-education-summary.md`
- Aşama 4 raporu var mı: Evet, `reports/stage-4-health-daily-sport-summary.md`
- `reports/implementation-status.json` var mı: Evet
- `reports/new-calculators-added.md` var mı: Evet
- `reports/indexing-checklist.md` var mı: Evet
- implementation-status processed false: `0`
- Canlıda test edilen URL sayısı: `100` tekil URL (`92` yeni canonical URL + `10` özel örnek, `2` çakışma)
- 200 dönen: `95` doğrudan 200; redirect takip edildiğinde `100/100` final 200
- 404/redirect/hata dönen: `5` redirect, `0` 404/hata
- Sitemap içinde bulunan: `95` toplam test setinde; yeni canonical URL'lerde `92/92`
- Sitemap dışında kalan: `5` canonical olmayan örnek/alias URL
- Ayrı deploy gerekiyor mu: Hayır, artık gerekmiyor. Aşama 2-4 canonical değişiklikleri production deploy'a dahildir; denetimde bulunan örnek alias redirectleri için ek düzeltme deploy edildi.

## Rapor Dosyaları

| Dosya | Durum |
| --- | --- |
| `reports/stage-2-finance-salary-tax-summary.md` | Var |
| `reports/stage-3-math-education-summary.md` | Var |
| `reports/stage-4-health-daily-sport-summary.md` | Var |
| `reports/implementation-status.json` | Var |
| `reports/new-calculators-added.md` | Var |
| `reports/indexing-checklist.md` | Var |

## implementation-status Özeti

| Metrik | Sayı |
| --- | ---: |
| Toplam hedef madde | 235 |
| `processed: true` | 235 |
| `processed: false` | 0 |
| `YOK-EKLENDİ` | 94 |
| `SEO-GÜNCELLENDİ` | 62 |
| Güvenlik nedeniyle skip edilen | 1 |
| Aşaması belirsiz kalan madde | 0 |

Sonuç: Global `processed false` kalmamış. Aşama 2, 3, 4 ve 5 sonrası tüm hedefler ya yeni canonical sayfa, ya SEO güncellemesi, ya mevcut/benzer sayfa, ya duplicate açılmama, ya da güvenlik istisnası olarak işlenmiş.

## Canonical URL Grupları

### Finans

- `/finansal-hesaplamalar/portfoy-dagilimi-hesaplama`
- `/finansal-hesaplamalar/etf-getiri-hesaplama`
- `/finansal-hesaplamalar/kripto-kar-zarar-hesaplama`
- `/finansal-hesaplamalar/finansal-ozgurluk-hesaplama`
- `/finansal-hesaplamalar/pasif-gelir-hesaplama`

### Maaş/Vergi

- `/maas-ve-vergi/saatlik-ucret-hesaplama`
- `/maas-ve-vergi/gunluk-ucret-hesaplama`
- `/maas-ve-vergi/fazla-mesai-hesaplama`
- `/maas-ve-vergi/emeklilik-maasi-tahmini-hesaplama`

### Matematik

- `/matematik-hesaplama/standart-sapma`
- `/matematik-hesaplama/varyans-hesaplama`
- `/matematik-hesaplama/oran-hesaplama`
- `/matematik-hesaplama/oranti-hesaplama`
- `/matematik-hesaplama/logaritma-hesaplama`
- `/matematik-hesaplama/hacim-hesaplama`
- `/matematik-hesaplama/silindir-hacmi`
- `/matematik-hesaplama/kure-hacmi`
- `/matematik-hesaplama/piramit-hacmi`
- `/matematik-hesaplama/trigonometri-hesaplama`
- `/matematik-hesaplama/sin-cos-tan-hesaplama`
- `/matematik-hesaplama/polinom-hesaplama`
- `/matematik-hesaplama/denklem-cozucu`
- `/matematik-hesaplama/ikinci-derece-denklem`
- `/matematik-hesaplama/matris-hesaplama`
- `/matematik-hesaplama/determinant-hesaplama`
- `/matematik-hesaplama/rasyonel-sayi-hesaplama`
- `/matematik-hesaplama/kesir-hesaplama`
- `/matematik-hesaplama/kesir-sadelestirme`
- `/matematik-hesaplama/kesir-toplama-cikarma`
- `/matematik-hesaplama/sayi-tabani-donusturme`

### Eğitim/Sınav

- `/sinav-hesaplamalari/yks-siralama-tahmini`
- `/sinav-hesaplamalari/egitim-suresi-hesaplama`
- `/sinav-hesaplamalari/ders-calisma-plani`
- `/sinav-hesaplamalari/test-basari-orani`
- `/sinav-hesaplamalari/ders-calisma-saati`
- `/sinav-hesaplamalari/ogrenci-butce-hesaplama`
- `/sinav-hesaplamalari/burs-hesaplama`
- `/sinav-hesaplamalari/egitim-kredisi`
- `/sinav-hesaplamalari/yurt-maliyeti`
- `/sinav-hesaplamalari/okul-gider-hesaplama`
- `/sinav-hesaplamalari/kitap-maliyeti`
- `/sinav-hesaplamalari/ogrenci-yasam-maliyeti`

### Sağlık

- `/yasam-hesaplama/kalori-yakma-hesaplama`
- `/yasam-hesaplama/adim-kalori-hesaplama`
- `/yasam-hesaplama/nabiz-araligi-hesaplama`
- `/yasam-hesaplama/cocuk-bmi-hesaplama`
- `/yasam-hesaplama/alkol-promil-hesaplama`
- `/yasam-hesaplama/uyku-suresi-hesaplama`
- `/yasam-hesaplama/metabolizma-yasi-hesaplama`

### Günlük Yaşam

- `/yasam-hesaplama/gunluk-harcama-hesaplama`
- `/yasam-hesaplama/aylik-butce-hesaplama`
- `/yasam-hesaplama/elektrik-tuketim-hesaplama`
- `/yasam-hesaplama/su-faturasi-hesaplama`
- `/yasam-hesaplama/dogalgaz-tuketimi-hesaplama`
- `/yasam-hesaplama/tatil-butcesi-hesaplama`
- `/yasam-hesaplama/ev-gider-hesaplama`
- `/yasam-hesaplama/bahsis-hesaplama`
- `/yasam-hesaplama/split-hesaplama`

### Spor/Fitness

- `/yasam-hesaplama/kosu-pace-hesaplama`
- `/yasam-hesaplama/maraton-tempo-hesaplama`
- `/yasam-hesaplama/adim-mesafe-hesaplama`
- `/yasam-hesaplama/vo2-max-hesaplama`
- `/yasam-hesaplama/yag-yakim-bolgesi-hesaplama`
- `/yasam-hesaplama/kas-kutlesi-hesaplama`
- `/yasam-hesaplama/bench-press-max`
- `/yasam-hesaplama/squat-max`
- `/yasam-hesaplama/deadlift-max`
- `/yasam-hesaplama/spor-hedef-hesaplama`
- `/yasam-hesaplama/antrenman-hacmi`
- `/yasam-hesaplama/set-tekrar-hesaplama`
- `/yasam-hesaplama/dinlenme-suresi`
- `/yasam-hesaplama/kardiyo-suresi`

### İnşaat/Mühendislik

- `/insaat-muhendislik/beton-hesaplama`
- `/insaat-muhendislik/cimento-hesaplama`
- `/insaat-muhendislik/tugla-hesaplama`
- `/insaat-muhendislik/boya-hesaplama`
- `/insaat-muhendislik/seramik-hesaplama`
- `/insaat-muhendislik/parke-hesaplama`
- `/insaat-muhendislik/demir-hesaplama`
- `/insaat-muhendislik/cati-alan-hesaplama`
- `/insaat-muhendislik/merdiven-hesaplama`
- `/insaat-muhendislik/metrekup-hesaplama`
- `/insaat-muhendislik/hafriyat-hesaplama`
- `/insaat-muhendislik/kum-hesaplama`
- `/insaat-muhendislik/alci-hesaplama`
- `/insaat-muhendislik/siva-hesaplama`
- `/insaat-muhendislik/elektrik-kablo-hesaplama`
- `/insaat-muhendislik/su-tesisat-hesaplama`
- `/insaat-muhendislik/isi-kaybi-hesaplama`
- `/insaat-muhendislik/gunes-paneli-hesaplama`
- `/insaat-muhendislik/jenerator-guc-hesaplama`
- `/insaat-muhendislik/enerji-tuketim-hesaplama`

## Canlı Kontrol Özeti

Kontrol yöntemi:

- `https://www.hesapmod.com/sitemap.xml` canlı sitemap indirildi.
- `reports/new-calculators-added.md` içindeki 92 yeni canonical URL'nin tamamı kontrol edildi.
- İstenen 10 özel örnek URL ayrıca kontrol edildi.
- Her URL için HTTP durum, sitemap varlığı, canonical, title ve meta description incelendi.

Canlı sitemap:

- Status: `200`
- URL sayısı: `388`

### Yeni Canonical URL Kategori Sonuçları

| Kategori | Test edilen | 200 | Sitemap | Canonical doğru | Title dolu | Meta dolu |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Finans | 5 | 5 | 5 | 5 | 5 | 5 |
| Maaş/Vergi | 4 | 4 | 4 | 4 | 4 | 4 |
| Matematik | 21 | 21 | 21 | 21 | 21 | 21 |
| Eğitim/Sınav | 12 | 12 | 12 | 12 | 12 | 12 |
| Sağlık | 7 | 7 | 7 | 7 | 7 | 7 |
| Günlük Yaşam | 9 | 9 | 9 | 9 | 9 | 9 |
| Spor/Fitness | 14 | 14 | 14 | 14 | 14 | 14 |
| İnşaat/Mühendislik | 20 | 20 | 20 | 20 | 20 | 20 |

Sonuç: Aşama 2-4 yeni canonical URL'lerinin tamamı canlıda 200 dönüyor, sitemap içinde var, canonical doğru, title/meta boş değil. Stage 5 inşaat/mühendislik URL'leri de aynı kontrolden geçti.

## Özel Örnek URL Kontrolü

| URL | İlk durum | Final hedef | Final durum | Sitemap | Not |
| --- | ---: | --- | ---: | --- | --- |
| `/finansal-hesaplamalar/enflasyon-hesaplama` | 200 | Aynı URL | 200 | Var | Canonical doğru |
| `/finansal-hesaplamalar/kredi-erken-kapama-hesaplama` | 200 | Aynı URL | 200 | Var | Canonical doğru |
| `/finansal-hesaplamalar/reel-getiri-hesaplama` | 200 | Aynı URL | 200 | Var | Canonical doğru |
| `/maas-ve-vergi/bordro-hesaplama` | 308 | `/maas-ve-vergi/maas-hesaplama` | 200 | Alias sitemap dışı | `implementation-status` içinde `BENZER VAR`; canonical maaş sayfası |
| `/maas-ve-vergi/freelance-vergi-hesaplama` | 308 | `/muhasebe/serbest-meslek-makbuzu-hesaplama` | 200 | Alias sitemap dışı | Redirect düzeltildi |
| `/matematik-hesaplama/standart-sapma-hesaplama` | 308 | `/matematik-hesaplama/standart-sapma` | 200 | Alias sitemap dışı | Canonical `/standart-sapma` |
| `/sinav-hesaplamalari/not-ortalamasi-hesaplama` | 308 | `/matematik-hesaplama/ortalama-hesaplama` | 200 | Alias sitemap dışı | Redirect eklendi |
| `/yasam-hesaplama/kira-artis-hesaplama` | 308 | `/finansal-hesaplamalar/kira-artis-hesaplama` | 200 | Alias sitemap dışı | Redirect eklendi |
| `/yasam-hesaplama/elektrik-tuketim-hesaplama` | 200 | Aynı URL | 200 | Var | Canonical doğru |
| `/yasam-hesaplama/kosu-pace-hesaplama` | 200 | Aynı URL | 200 | Var | Canonical doğru |

## Eksik veya Hatalı URL'ler

Yeni canonical Aşama 2-4 URL'lerinde eksik, 404, sitemap dışı veya metadata boş sayfa bulunmadı.

Denetimde sadece özel örnek/alias URL'lerde canonical olmayan durumlar görüldü:

- `/maas-ve-vergi/bordro-hesaplama`: Hiç ayrı sayfa açılmamış; `implementation-status` içinde `BENZER VAR`. Alias olarak `/maas-ve-vergi/maas-hesaplama` sayfasına 308 yönleniyor.
- `/maas-ve-vergi/freelance-vergi-hesaplama`: İlk canlı kontrolde yanlış kategoriye (`/maas-ve-vergi/serbest-meslek-makbuzu-hesaplama`) yönlenip 404'e düşüyordu. `next.config.mjs` ile `/muhasebe/serbest-meslek-makbuzu-hesaplama` hedefine düzeltildi.
- `/matematik-hesaplama/standart-sapma-hesaplama`: Canonical URL değil; slug alias ile `/matematik-hesaplama/standart-sapma` hedefine 308 yönleniyor.
- `/sinav-hesaplamalari/not-ortalamasi-hesaplama`: Ayrı canonical sayfa değil; `implementation-status` içinde `SEO-GÜNCELLENDİ` ve mevcut canonical `/matematik-hesaplama/ortalama-hesaplama`. Redirect eklendi.
- `/yasam-hesaplama/kira-artis-hesaplama`: Kira artışı canonical olarak finans kategorisinde; `/finansal-hesaplamalar/kira-artis-hesaplama` hedefine redirect eklendi.

Bu alias URL'ler canonical olmadığı için sitemap'e eklenmedi; sitemap canonical URL'leri içeriyor.

## Yapılan Düzeltme ve Deploy

`next.config.mjs` içine şu redirect temizlikleri eklendi:

- `/maas-ve-vergi/freelance-vergi-hesaplama` -> `/muhasebe/serbest-meslek-makbuzu-hesaplama`
- `/maas-ve-vergi/serbest-meslek-makbuzu-hesaplama` -> `/muhasebe/serbest-meslek-makbuzu-hesaplama`
- `/sinav-hesaplamalari/not-ortalamasi-hesaplama` -> `/matematik-hesaplama/ortalama-hesaplama`
- `/yasam-hesaplama/kira-artis-hesaplama` -> `/finansal-hesaplamalar/kira-artis-hesaplama`

Çalıştırılan doğrulama:

- `npm run generate:runtimes`
- `npm run build`
- `npx vercel --prod --yes`
- `npx vercel inspect https://hesapmod-4qkpogpzi-sdem81s-projects.vercel.app`

Build sonucu:

- Next build başarılı
- Statik sayfa üretimi: `473/473`
- Sitemap URL sayısı: `388`
- IndexNow submit: başarılı, `388` URL

Deploy sonucu:

- Deployment ID: `dpl_6svbAS54LvANArT5V97dBJUHbc2h`
- Status: `Ready`
- Target: `production`
- Alias: `https://www.hesapmod.com`

## Sonuç

Aşama 2-4 değişiklikleri final deploy'a dahildir. Yeni canonical URL'lerin tamamı repo'da, canlıda 200 dönüyor, sitemap içinde bulunuyor ve canonical/title/meta kontrolleri geçiyor.

Ayrı deploy artık gerekmez; denetim sırasında bulunan üç alias/redirect temizliği production'a ayrıca deploy edildi.
