# 1 Nisan 2026 Devam Notu

Bu dosya, yarın oturumu hızlı açmak için kısa handoff notudur.

## Canlı Durum

- Production: `https://www.hesapmod.com`
- Son production deploy: `https://hesapmod-hzno2gcwn-sdem81s-projects.vercel.app`
- Deploy tarihi: `01.04.2026`
- Deploy kapsamı: kategori hub + rehber hub + E-E-A-T blokları canlıda
- Not: bugün kurulan kredi PSEO altyapısı henüz production'a gönderilmedi

## Bugün Tamamlananlar

### 1. E-E-A-T / Editoryal kalite entegrasyonu

- `components/calculator/EditorialQualityBlock.tsx` sadeleştirildi ve YMYL kategorileri için üretime hazır hale getirildi.
- `components/SchemaScripts.tsx` içine `trustInfo` desteği eklendi.
- JSON-LD tarafında:
  - `reviewedBy`
  - `citation`
  alanları işleniyor.
- `app/[category]/[slug]/page.tsx` içinde editoryal güven bloğu:
  - sadece uygun kategorilerde render ediliyor
  - SEO içeriğinin altına
  - ilgili içerik bloklarının üstüne
  taşındı.

### 2. Kredi PSEO altyapısı

- `lib/pseo-data.ts` oluşturuldu.
- İlk örnek PSEO kombinasyonları eklendi:
  - `ihtiyac-kredisi-hesaplama/50000-tl-12-ay`
  - `ihtiyac-kredisi-hesaplama/100000-tl-24-ay`
  - `tasit-kredisi-hesaplama/400000-tl-36-ay`
  - `konut-kredisi-hesaplama/2000000-tl-120-ay`
  - `konut-kredisi-hesaplama/1500000-tl-180-ay`
- Yeni route açıldı:
  - `app/[category]/[slug]/[detailSlug]/page.tsx`
- Bu route içinde:
  - `generateStaticParams`
  - dinamik metadata
  - self-canonical
  - prefilled `CalculatorEngine`
  - dinamik PSEO intro bölümü
  - ana `seo.content`
  - `EditorialQualityBlock`
  bağlandı.

### 3. Hesap motoru ve schema uyumu

- `components/calculator/CalculatorEngine.tsx` içine `initialValues` desteği eklendi.
- `components/SchemaScripts.tsx` içine:
  - `pageTitle`
  - `pageDescription`
  - `pageUrl`
  override alanları eklendi.

### 4. Sitemap güncellemesi

- `lib/sitemap-data.ts` artık PSEO URL'lerini de sitemap'e ekliyor.
- Sitemap sayısı local build'de `227` -> `232` oldu.

## Yerel Doğrulama

- `npm run lint`: temiz
- `npx tsc --noEmit`: temiz
- `npm run build`: temiz

Build çıktısında yeni route açıkça üretildi:

- `● /[category]/[slug]/[detailSlug]`
- toplam static page sayısı: `242`
- sitemap kapsamı: `232 URL`

## Yarın Yapılacak İş

Görev: PSEO alt sayfaları için parent sayfalarda iç link ağı kurmak.

### Amaç

Şu an PSEO sayfaları build'de üretiliyor ama parent araç sayfalarından doğrudan link almıyor. Googlebot için bunları orphan durumundan çıkarmak gerekiyor.

### Yapılacaklar

1. `components/calculator/PseoLinksBlock.tsx` oluştur
2. `lib/pseo-data.ts` içinden ilgili `parentSlug` kayıtlarını filtrele
3. Kayıt yoksa `null` dön
4. Link metinlerini SEO uyumlu üret:
   - örn: `50.000 TL 12 Ay İhtiyaç Kredisi Hesapla`
5. `app/[category]/[slug]/page.tsx` içine şu sırada ekle:
   - `CalculatorEngine`
   - `seo.content`
   - `PseoLinksBlock`
   - `EditorialQualityBlock`
   - ilgili rehber / ilgili hesaplamalar
6. `lib/sitemap-data.ts` içindeki PSEO `priority` değerini kontrol et:
   - ana sayfalardan düşük kalmalı
   - `0.70` veya `0.75` bandı uygun
7. `npm run build` ile yeniden doğrula

## Dokunulacak Dosyalar

- `components/calculator/PseoLinksBlock.tsx`
- `app/[category]/[slug]/page.tsx`
- gerekirse `lib/pseo-data.ts`
- kontrol için `lib/sitemap-data.ts`

## Kabul Kriteri

- Parent kredi sayfalarında PSEO blok görünmeli:
  - `ihtiyac-kredisi-hesaplama`
  - `tasit-kredisi-hesaplama`
  - `konut-kredisi-hesaplama`
- PSEO verisi olmayan araçlarda blok görünmemeli:
  - örn: `kdv-hesaplama`
- Linkler statik HTML olarak render edilmeli
- Tasarım mevcut light theme ile uyumlu olmalı
- `npm run build` temiz geçmeli

## Deploy Notu

- Yarın `PseoLinksBlock` işi bittikten sonra production deploy alınmalı.
- Deploy öncesi hızlı checklist:
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npm run build`
- Deploy sonrası ilk kontrol edilecek örnek URL'ler:
  - `/finansal-hesaplamalar/ihtiyac-kredisi-hesaplama`
  - `/finansal-hesaplamalar/tasit-kredisi-hesaplama`
  - `/finansal-hesaplamalar/konut-kredisi-hesaplama`
  - `/finansal-hesaplamalar/ihtiyac-kredisi-hesaplama/50000-tl-12-ay`

## Not

- Repo çalışma ağacı kirli; bu normal.
- Mevcut diff korunmalı.
- Yarın yeni iş açarken bugün eklenen PSEO dosyaları temel alınmalı; yeniden kurmaya gerek yok.
