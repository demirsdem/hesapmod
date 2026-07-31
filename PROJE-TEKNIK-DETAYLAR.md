# HesapMod Proje Teknik Detayları

Son güncelleme: `2026-05-19`

Bu dosya, HesapMod kod tabanına teknik olarak hızlı girmek isteyen geliştirici veya AI oturumları için hazırlanmış referans notudur. Kısa handoff için `AI_NOTES.md`, tarih bazlı operasyon notları için `DEVAM-NOTU-*` dosyaları kullanılabilir.

## 1. Genel Mimari

- Framework: `Next.js 14.2.5`
- UI: `React 18`, `Tailwind CSS`, yer yer CSS module
- Dil: `TypeScript`, `strict: true`
- Paket yöneticisi: `npm`
- Deploy: Vercel production alias `https://www.hesapmod.com`
- PWA: `@ducanh2912/next-pwa`
- İkonlar: `lucide-react`
- Grafik: `recharts`
- E-posta/iletişim: `resend`

Ana uygulama `app/` klasöründe App Router ile çalışır. Hesaplayıcıların büyük bölümü katalog tabanlı dinamik route üzerinden servis edilir:

- Canonical hesaplayıcı route: `/{category}/{slug}`
- Kategori hub route: `/kategori/[slug]`
- Rehber route: `/rehber/[slug]`
- Özel yazılmış sayfalar: `app/sinav-hesaplamalari/*`, `app/finansal-hesaplamalar/*`, vb.

## 2. Önemli Dosya ve Klasörler

| Yol | Amaç |
| --- | --- |
| `app/layout.tsx` | Global layout, header, footer, consent default script, Analytics/AdSense loader |
| `app/[category]/[slug]/page.tsx` | Ana katalog hesaplayıcı sayfa şablonu |
| `app/kategori/[slug]/page.tsx` | Kategori hub sayfası |
| `app/tum-araclar/page.tsx` | Tüm araçlar crawl hub |
| `lib/calculator-source.ts` | Hesaplayıcı katalog verisi ve formül source of truth |
| `lib/calculator-runtime/*` | Generate edilen runtime modülleri; elle düzenlenmemeli |
| `scripts/generate-runtime-modules.ts` | Runtime modüllerini üretir |
| `lib/calculators.ts` | Katalog, arama indeksi ve slug çözümleme |
| `lib/seo.ts` | Metadata/schema üretimi |
| `lib/sitemap-data.ts` | Sitemap veri kaynağı |
| `components/calculator/CalculatorEngine.tsx` | Dinamik hesaplayıcı runtime yükleyici |
| `components/CookieBanner.tsx` | Çerez ve consent arayüzü |
| `components/AnalyticsLoader.tsx` | Consent sonrası Google Analytics yükleme |
| `components/AdSenseLoader.tsx` | Consent sonrası AdSense script yükleme |
| `next.config.mjs` | Güvenlik headerları, CSP, redirectler, PWA wrapper |
| `middleware.ts` | Locale/redirect/canonical yardımcı akışları |

## 3. Build ve Komutlar

Temel komutlar:

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```

Build akışı `package.json` içinde zincirlidir:

```bash
npm run prepare:indexnow && npm run generate:runtimes && next build
```

Postbuild:

```bash
npx -y tsx scripts/submit-indexing.ts
```

Bu adım sitemap URL sayısını raporlar ve IndexNow bildirimi yapar. Google için otomatik Indexing API kullanılmaz; Search Console URL Inspection akışı manuel önceliklendirilir.

## 4. Deploy Akışı

Production deploy için:

```bash
npx vercel --prod --yes
```

Deploy sonunda Vercel iki URL verir:

- Preview/immutable deployment URL: `https://hesapmod-...vercel.app`
- Production alias: `https://www.hesapmod.com`

Vercel build uyarıları zaman zaman eski sayfalardaki `themeColor` metadata kullanımı veya mevcut ESLint warninglerinden gelebilir. Build başarısız değilse deploy tamamlanır.

## 5. Hesaplayıcı Ekleme ve Güncelleme Kuralları

Standart katalog hesaplayıcısı eklenirken ana kaynak çoğunlukla:

```text
lib/calculator-source.ts
```

Yeni hesaplayıcı eklendikten sonra runtime üretimi gerekir:

```bash
npm run generate:runtimes
```

Dikkat:

- `lib/calculator-runtime/*` dosyaları generate çıktısıdır; elle düzenlenmez.
- Kategori, slug, SEO metadata, FAQ ve related calculators alanları katalog içinde tutarlı olmalıdır.
- Kullanıcıya resmi sonuç gibi sunulabilecek finans, sınav, sağlık ve hukuki hesaplarda uyarı dili korunmalıdır.
- Client tarafında çalışan özel hesaplayıcılar için pure hesaplama fonksiyonu mümkünse `lib/` altında ayrılmalıdır.

## 6. Özel Sayfa Örneği: KPSS Puan Hesaplama

KPSS sayfası katalog şablonundan ayrılmış özel App Router sayfasıdır.

Önemli dosyalar:

| Yol | Amaç |
| --- | --- |
| `app/sinav-hesaplamalari/kpss-puan-hesaplama/page.tsx` | Server component, metadata, JSON-LD, statik içerik |
| `app/sinav-hesaplamalari/kpss-puan-hesaplama/page.module.css` | Sayfa düzeyi stiller |
| `app/sinav-hesaplamalari/kpss-puan-hesaplama/opengraph-image.tsx` | Sayfa özel OG image |
| `components/kpss/KpssHesaplama.tsx` | Client hesaplayıcı formu |
| `components/kpss/PuanTuruSecici.tsx` | P1/P3/P93/P94 seçici |
| `components/kpss/SonucKarti.tsx` | Sonuç ve net breakdown |
| `components/kpss/SimulasyonTablosu.tsx` | Hedef puan simülasyonu |
| `components/kpss/PaylasimLinki.tsx` | URL state ve kopyalama |
| `components/kpss/KpssFaq.tsx` | Accessible FAQ accordion |
| `lib/kpss-calculator.ts` | Pure hesaplama ve doğrulama fonksiyonları |
| `types/kpss.ts` | KPSS tipleri |

KPSS doğrulama komutu:

```bash
npx tsx components/kpss/KpssHesaplama.test.ts
```

## 7. SEO ve Schema

SEO yaklaşımı:

- Canonical URL her sayfada tek ve temiz olmalı.
- Kategori hub sayfaları iç link akışının merkezidir.
- Rehber içerikleri hesaplayıcı sayfalarını destekler.
- JSON-LD üretimi sayfa türüne göre yapılır: `WebApplication`, `FAQPage`, `BreadcrumbList`, `ItemList`, `Article` vb.
- Sayfa title/meta description mümkün olduğunca sorgu niyetine göre özgün olmalıdır.

Önemli kaynaklar:

- `lib/seo.ts`
- `components/SchemaScripts.tsx`
- `lib/sitemap-data.ts`
- `app/sitemap.ts`
- `app/robots.ts`

Search Console öncelik raporu:

```bash
npm run export:index-priority
```

Çıktı:

```text
reports/search-console-index-priority.csv
```

## 8. Consent, Analytics ve AdSense

Consent akışı:

- Varsayılan consent `app/layout.tsx` içinde `beforeInteractive` script ile `denied` başlar.
- Kullanıcı onay verene kadar Analytics ve AdSense scriptleri yüklenmez.
- Consent tercihi birinci taraf cookie ile saklanır: `hesapmod-cookie-consent`
- Analytics loader: `components/AnalyticsLoader.tsx`
- AdSense loader: `components/AdSenseLoader.tsx`
- Banner: `components/CookieBanner.tsx`

AdSense client değeri:

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-your-publisher-id
```

`public/ads.txt` gerçek publisher ID ile güncel tutulmalıdır.

## 9. Güvenlik Headerları

`next.config.mjs` içinde global headerlar tanımlıdır:

- `Content-Security-Policy`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security`

CSP içinde `unsafe-eval` kullanılmamalıdır. `unsafe-inline` şu anda Next/script, Tailwind ve mevcut inline schema/script ihtiyaçları nedeniyle korunmaktadır.

## 10. Storage Politikası

Kalıcı hesap sonucu veya kişisel veri niteliği taşıyabilecek değerler `localStorage` içine yazılmamalıdır.

Tercih edilen yaklaşımlar:

- Paylaşılabilir state için URL parametresi
- Oturumluk geçici cache için `sessionStorage`
- Consent veya tema gibi düşük riskli tercihler için birinci taraf cookie

Kontrol komutu:

```bash
rg "localStorage" app components lib middleware.ts next.config.mjs
```

## 11. Erişilebilirlik Kuralları

Formlarda:

- Her input için görünür `label`
- Hata için `role="alert"` veya `aria-live`
- Sonuç alanlarında `aria-live="polite"`
- Segment/radio kontrollerinde doğru `fieldset`, `legend` veya erişilebilir radiogroup
- Minimum dokunma alanı yaklaşık `44px`
- Input font size en az `16px`
- `:focus-visible` görünür olmalı

SSS accordion:

- Button üzerinde `aria-expanded`
- Panel bağlantısı için `aria-controls`
- Açık panelde `role="region"` ve `aria-labelledby`

## 12. Performans Notları

- Büyük hesaplayıcılar client component olabilir, fakat metin ve SEO içeriği server component kalmalıdır.
- Ağır parçalar `dynamic import` ile lazy yüklenmelidir.
- Sonuç kartı ve reklam slotları için min-height ayrılarak CLS azaltılmalıdır.
- PWA service worker production build sırasında üretilir.
- Sayfa özel JS bütçesi kritik sayfalarda takip edilmelidir; KPSS route son buildte yaklaşık `7.69 kB` route size ve `105 kB` first load JS olarak raporlanmıştır.

## 13. Redirect ve Canonical Notları

Redirectler ağırlıklı olarak `next.config.mjs` ve kısmen `middleware.ts` içindedir.

Önemli kurallar:

- `hesapmod.com` hostu `www.hesapmod.com` üzerine yönlenir.
- Eski kategori adları canonical kategori yapısına taşınır.
- Search Console'a alias veya legacy URL değil canonical URL gönderilir.

## 14. Ortam Değişkenleri

Örnek dosya:

```text
.env.example
```

Öne çıkan değişkenler:

```env
INDEXNOW_KEY=your-indexnow-key
INDEXNOW_TIMEOUT_MS=15000
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
COLLECT_API_KEY=your-collectapi-key
METALS_API_KEY=your-metals-api-key
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-your-publisher-id
```

Gizli değerler repoya yazılmamalıdır.

## 15. Kod Kalitesi ve Çalışma Prensipleri

- Kirli worktree normal olabilir; mevcut kullanıcı değişiklikleri geri alınmamalıdır.
- Generate edilen dosyalarla elle yazılan dosyalar ayrıştırılmalıdır.
- Yeni özel sayfada mümkünse hesaplama mantığı UI'dan ayrılmalıdır.
- Finans, sınav, sağlık, hukuk gibi yüksek riskli alanlarda resmi kaynak ve disclaimer görünür olmalıdır.
- Deploy öncesi en az şu kontroller tercih edilir:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Özel test dosyası olan sayfalarda ilgili test ayrıca çalıştırılmalıdır.

## 16. Bilinen Teknik Borçlar

- Bazı eski sayfalarda `metadata.themeColor` kullanımı Next uyarısı üretir; yeni sayfalarda `viewport` export kullanılmalı.
- Bazı eski componentlerde ESLint warningleri mevcuttur; build'i engellemiyor.
- Katalog büyüdükçe `lib/calculator-source.ts` dosyası büyük kalmaya devam ediyor; runtime split performansı korusa da authoring tarafında dosya yönetimi zorlaşabilir.
- AdSense publisher ID gerçek değerle tamamlanmadığında reklam scripti ve `ads.txt` doğrulaması eksik kalır.

## 17. Hızlı Başlangıç

Yeni oturumda önce şunlara bak:

```bash
git status --short
rg --files
Get-Content AI_NOTES.md
Get-Content PROJE-TEKNIK-DETAYLAR.md
```

Sonra yapılacak iş hesaplayıcı eklemekse:

```bash
Get-Content lib/calculator-source.ts
Get-Content components/calculator/CalculatorEngine.tsx
```

Özel sayfa düzenlemekse ilgili `app/.../page.tsx` ve `components/...` dosyaları birlikte okunmalıdır.
