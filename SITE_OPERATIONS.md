# HesapMod Site Bilgi ve Operasyon Rehberi

Son guncelleme: 1 Mayis 2026  
Canli site: https://www.hesapmod.com  
Canonical host: `www.hesapmod.com`  
Vercel proje adi: `hesapmod`  
Vercel projectId: `prj_9NwFobWJIX1hLJKWtvNmUAq9HCPd`  
Vercel orgId/teamId: `team_eflEiyJmBAhw1fQvBy5fCyHs`

Bu dosya HesapMod sitesiyle ilgili temel teknik bilgi, gelistirme akisi, yayinlama, SEO-indexleme, API, ozel sayfa ve bakim islemlerini tek yerde toplar.

## Anlik Durum

Son dogrulanan production deploy:

- Deployment ID: `dpl_HuLKn9rTz1Hhssak5wDjpoNFjjMT`
- Deployment URL: `https://hesapmod-qaxlj5fqn-sdem81s-projects.vercel.app`
- Status: `Ready`
- Olusturulma: `1 Mayis 2026 14:13:43 GMT+3`
- Alias: `https://www.hesapmod.com`, `https://hesapmod.com`, `https://hesapmod.vercel.app`

Son canli sitemap kontrolu:

- `https://www.hesapmod.com/sitemap.xml` status: `200 OK`
- Sitemap URL sayisi: `295`
- `https://www.hesapmod.com/gayrimenkul-deger-hesaplama` sitemap icinde var.

Mevcut sayisal ozet:

- Hesaplayici sayisi: `218`
- Ana kategori sayisi: `14`
- Rehber yazisi sayisi: `16`
- PSEO route sayisi: `189`
- Sitemap girdisi: `295`

Kategori dagilimi:

| Kategori | Hesaplayici |
| --- | ---: |
| `maas-ve-vergi` | 20 |
| `sigorta` | 4 |
| `hukuk` | 5 |
| `muhasebe` | 7 |
| `tasit-ve-vergi` | 7 |
| `finansal-hesaplamalar` | 50 |
| `ticaret-ve-is` | 12 |
| `sinav-hesaplamalari` | 41 |
| `matematik-hesaplama` | 13 |
| `zaman-hesaplama` | 27 |
| `yasam-hesaplama` | 26 |
| `astroloji` | 2 |
| `seyahat` | 2 |
| `diger` | 2 |

Not: Bu dosya olusturulurken local worktree temiz degildi; bircok yeni sayfa, runtime ve SEO degisikligi henuz commit edilmemis durumdaydi. Deploy canliya cikmis olsa da Git durumu ayrica kontrol edilmelidir.

## Teknoloji

- Framework: Next.js `14.2.5`
- Router: App Router
- Dil: TypeScript
- UI: React 18, Tailwind CSS, Lucide React
- Grafik: Recharts
- PWA: `@ducanh2912/next-pwa`
- Analytics: GA4, kullanici onayindan sonra
- E-posta: Resend
- Deploy: Vercel
- Paket yoneticisi: npm

## Onemli Dosyalar

| Dosya | Amac |
| --- | --- |
| `app/layout.tsx` | Root layout, nav, footer, schema, analytics, AdSense script |
| `app/[category]/[slug]/page.tsx` | Canonical hesaplayici sayfalari |
| `app/[category]/[slug]/[detailSlug]/page.tsx` | PSEO detay sayfalari |
| `app/kategori/[slug]/page.tsx` | Kategori hub sayfalari |
| `app/tum-araclar/page.tsx` | Tum araclar merkezi |
| `app/rehber/*` | Rehber landing ve rehber detaylari |
| `app/sitemap.ts` | Sitemap route'u |
| `app/robots.ts` | Robots ve sitemap bildirimi |
| `app/manifest.ts` | PWA manifest |
| `app/opengraph-image.tsx` | Dinamik OG gorseli |
| `lib/site.ts` | Site adi, canonical URL, logo URL |
| `lib/calculator-source.ts` | Ana hesaplayici katalog ve SEO kaynagi |
| `lib/calculators.ts` | Katalog, route ve arama katmani |
| `lib/calculator-runtime/*` | Generate edilen kategori runtime modulleri |
| `lib/sitemap-data.ts` | Sitemap girdilerinin kaynagi |
| `lib/content-last-modified.ts` | Lastmod tarihleri |
| `lib/indexnow.ts` | IndexNow URL listesi ve submit mantigi |
| `lib/calculator-trust.ts` | Kaynak, metodoloji ve guven bilgileri |
| `lib/customCalculators.ts` | Ozel component kullanan hesaplayici tanimlari |
| `components/calculators/*` | Ozel hesaplayici arayuzleri |
| `data/*` | Arac/gayrimenkul gibi hesaplayici veri setleri |
| `scripts/*` | Build, SEO, coverage, IndexNow ve rapor scriptleri |
| `reports/*` | Analiz ve SEO raporlari |

## Ortam Degiskenleri

`.env.example` icinde yer alan degiskenler:

```bash
INDEXNOW_KEY=your-indexnow-key
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

Kodda kullanilan ek degiskenler:

```bash
CONTACT_RECIPIENT_EMAIL=destek@hesapmod.com
RESEND_FROM_EMAIL=bildirim@hesapmod.com
RESEND_API_KEY=...
```

Notlar:

- `INDEXNOW_KEY` tanimliysa build oncesinde public dogrulama dosyasi uretilir ve postbuild sirasinda URL'ler IndexNow'a bildirilir.
- `ANTHROPIC_API_KEY` arac piyasa emsalinde Claude provider icin kullanilir.
- `ANTHROPIC_MODEL` verilmezse provider kendi varsayilan modelini kullanir.
- `RESEND_API_KEY` yoksa iletisim formu e-posta gonderemez.
- Gizli anahtarlar repo icine yazilmaz; Vercel Environment Variables uzerinden tanimlanir.

## Scriptler

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Lokal Next.js dev server baslatir |
| `npm run build` | IndexNow hazirligi, runtime generation ve Next build calistirir |
| `npm run start` | Production build'i lokal calistirir |
| `npm run lint` | Next lint calistirir |
| `npm run generate:runtimes` | `calculator-source.ts` formullerini runtime modullerine ayirir |
| `npm run prepare:indexnow` | IndexNow dogrulama dosyasini public altinda hazirlar |
| `npm run postbuild` | Sitemap sayisini raporlar, IndexNow submit yapar |
| `npm run analyze:coverage` | Hesaplayici kapsami analizi yapar |
| `npm run export:index-priority` | Search Console oncelik raporu uretir |
| `npm run audit:seo` | SEO denetimi calistirir |
| `npm run mobile:android` | Android mobil akis scriptini calistirir |
| `npm run mobile:android:no-clear` | Android mobil akis scriptini temizlemeden calistirir |

## Lokal Gelistirme

Gereksinimler:

- Node.js 18+ veya uyumlu daha yeni Node surumu
- npm

Baslangic:

```bash
npm install
npm run dev
```

Varsayilan lokal adres:

```text
http://localhost:3000
```

Build dogrulama:

```bash
npm run build
```

Runtime modulleri elle yeniden uretmek icin:

```bash
npm run generate:runtimes
```

## Deploy Akisi

Production deploy:

```bash
npx vercel --prod --yes
```

Deploy oncesi onerilen kontrol:

```bash
git status --short --branch
npm run build
```

Deploy sonrasi kontrol:

```bash
npx vercel inspect <deployment-url>
```

Canli ana sayfa kontrolu:

```powershell
Invoke-WebRequest -Uri "https://www.hesapmod.com" -Method Head -MaximumRedirection 5
```

Canli sitemap kontrolu:

```powershell
$r = Invoke-WebRequest -Uri "https://www.hesapmod.com/sitemap.xml" -UseBasicParsing
$r.Content.Contains("https://www.hesapmod.com/gayrimenkul-deger-hesaplama")
```

Deployment tamamsa Vercel inspect cikisinda sunlar gorulmelidir:

- `target production`
- `status Ready`
- `Aliases` icinde `https://www.hesapmod.com`

## Public Route Haritasi

Ana route'lar:

- `/`
- `/tum-araclar`
- `/kategori/[slug]`
- `/[category]/[slug]`
- `/[category]/[slug]/[detailSlug]`
- `/hesaplama/[slug]`
- `/rehber`
- `/rehber/[slug]`
- `/en`
- `/en/[category]`
- `/en/[category]/[slug]`
- `/hakkimizda`
- `/iletisim`
- `/sss`
- `/gizlilik-politikasi`
- `/cerez-politikasi`
- `/kvkk`
- `/kullanim-kosullari`

Ozel sayfalar:

- `/tasit-ve-vergi/arac-deger-hesaplama`
- `/arac-deger-hesaplama` kalici redirect ile `/tasit-ve-vergi/arac-deger-hesaplama`
- `/gayrimenkul-deger-hesaplama`
- `/finansal-hesaplamalar/gecmis-doviz-kurlari`

API route'lari:

- `/api/altin-fiyat`
- `/api/doviz-kur`
- `/api/contact`
- `/api/index-url`
- `/api/arac-piyasa/arabam`
- `/api/arac-piyasa/claude`

## Redirect ve Canonical Kurallari

Canonical hesaplayici URL formati:

```text
/{category}/{slug}
```

Uyumluluk route'u:

```text
/hesaplama/{slug}
```

Bu route canonical sayfaya yonlendirme amaclidir; Search Console ve sitemap icin canonical URL kullanilir.

Next config icindeki onemli redirectler:

- `hesapmod.com/*` -> `https://www.hesapmod.com/*`
- `/finans/*` -> `/finansal-hesaplamalar/*`
- `/saglik/*` -> `/yasam-hesaplama/*`
- `/gunluk/*` -> `/yasam-hesaplama/*`
- `/matematik/*` -> `/matematik-hesaplama/*`
- `/zaman-hesaplama/yas-hesaplama` -> `/zaman-hesaplama/yas-hesaplama-detayli`
- `/zaman-hesaplama/yas-hesaplama-gun-ay-yil` -> `/zaman-hesaplama/yas-hesaplama-detayli`
- `/zaman-hesaplama/iki-tarih-arasi-fark-gun-hesaplama` -> `/zaman-hesaplama/iki-tarih-arasindaki-gun-sayisi-hesaplama`
- `/finansal-hesaplamalar/kredi-karti-asgari-odeme-tutari-hesaplama` -> `/finansal-hesaplamalar/kredi-karti-asgari-odeme`

## SEO ve Indexleme

Kaynak dosyalar:

- Sitemap verisi: `lib/sitemap-data.ts`
- Sitemap route'u: `app/sitemap.ts`
- Robots route'u: `app/robots.ts`
- Metadata/schema: `lib/seo.ts` ve sayfa dosyalari
- Lastmod: `lib/content-last-modified.ts`
- IndexNow: `lib/indexnow.ts`
- IndexNow hazirlik: `scripts/prepare-indexnow.ts`
- IndexNow submit: `scripts/submit-indexing.ts`

Robots ayari:

- Tum user-agent'lar icin allow `/`
- Sitemap: `https://www.hesapmod.com/sitemap.xml`
- Host: `https://www.hesapmod.com`

Sitemap kurallari:

- Canonical URL'ler sitemap'e girer.
- Redirect edilen eski slug'lar sitemap'ten cikarilir.
- PSEO route'larda sadece secili hero route'lar sitemap'e alinir.
- Ozel static sayfalar `staticPages` dizisine manuel eklenir.
- Yeni ozel sayfa eklenirse `content-last-modified.ts` icine lastmod sabiti eklenmelidir.

IndexNow akisi:

1. `npm run prepare:indexnow` public dogrulama dosyasini hazirlar.
2. `npm run build` tamamlaninca `postbuild` calisir.
3. Sitemap URL'leri ve oncelikli URL'ler IndexNow endpoint'ine gonderilir.
4. Google icin otomatik IndexNow yoktur; Google tarafinda sitemap + Search Console URL Inspection akisi kullanilir.

Oncelikli IndexNow URL'leri:

- `/sinav-hesaplamalari/yks-puan-hesaplama`
- `/sinav-hesaplamalari/lgs-puan-hesaplama`
- `/maas-ve-vergi/asgari-ucret-hesaplama`
- `/yasam-hesaplama/gebelik-hesaplama`
- `/finansal-hesaplamalar/kredi-karti-asgari-odeme`
- `/matematik-hesaplama/yuzde-hesaplama`
- `/finansal-hesaplamalar/altin-hesaplama`
- `/ticaret-ve-is/tapu-harci-hesaplama`
- `/maas-ve-vergi/gelir-vergisi-hesaplama`
- `/zaman-hesaplama/yas-hesaplama-detayli`

Google Indexing API:

- `/api/index-url` bilincli olarak kapali.
- Genel hesaplayici ve rehber icerikleri Google Indexing API kapsamina uygun olmadigi icin `410` doner.
- Google icin Search Console sitemap ve URL Inspection kullanilir.

## Analytics, Reklam ve Gizlilik

Analytics:

- GA4 ID: `G-NWXRPF7PC1`
- Dosya: `components/AnalyticsLoader.tsx`
- Kullanici `hesapmod-cookie-consent` ile onay vermeden GA yuklenmez.

Cookie banner:

- Dosya: `components/CookieBanner.tsx`
- localStorage anahtari: `hesapmod-cookie-consent`
- Event: `hesapmod-consent-change`

AdSense:

- Root script `app/layout.tsx` icinde yuklenir.
- Mevcut client placeholder: `ca-pub-XXXXXXXXX`
- Reklam unit component'i: `components/AdUnit.tsx`
- CLS azaltmak icin reklam alanlarinda minimum yukseklik placeholder'i kullanilir.

Gizlilik sayfalari:

- `/gizlilik-politikasi`
- `/cerez-politikasi`
- `/kvkk`
- `/kullanim-kosullari`

## API ve Entegrasyonlar

Iletisim formu:

- Route: `/api/contact`
- Dosya: `app/api/contact/route.ts`
- Provider: Resend
- Rate limit: IP basina 10 dakikada 5 istek
- Validasyon: ad, e-posta, mesaj zorunlu
- E-posta HTML icin input escape edilir.

Altin ve doviz:

- `/api/altin-fiyat`
- `/api/doviz-kur`
- Finansal hesaplayicilarda guncel veri ihtiyaci icin kullanilir.

Arac piyasa emsali:

- `/api/arac-piyasa/arabam`
- `/api/arac-piyasa/claude`
- Provider dosyalari: `lib/vehicle-market-providers/*`
- Claude provider icin `ANTHROPIC_API_KEY` gerekir.

## Ozel Sayfalar

### Arac Deger Hesaplama

Canonical:

```text
/tasit-ve-vergi/arac-deger-hesaplama
```

Kisa redirect:

```text
/arac-deger-hesaplama
```

Ana dosyalar:

- `app/tasit-ve-vergi/arac-deger-hesaplama/page.tsx`
- `app/arac-deger-hesaplama/page.tsx`
- `components/calculators/AracDegerHesaplama.tsx`
- `lib/arac-hesaplama.ts`
- `data/arac-verileri.ts`
- `data/arac-piyasa-katalog.ts`
- `lib/vehicle-market-providers/*`
- `lib/customCalculators.ts`

Canli dogrulama:

- `/tasit-ve-vergi/arac-deger-hesaplama` -> `200 OK`
- `/arac-deger-hesaplama` -> `308 Permanent Redirect`

### Gayrimenkul Deger Hesaplama

Canonical:

```text
/gayrimenkul-deger-hesaplama
```

Ana dosyalar:

- `app/gayrimenkul-deger-hesaplama/page.tsx`
- `components/calculators/GayrimenkulHesaplama.tsx`
- `components/calculators/gayrimenkul/DegerModulu.tsx`
- `components/calculators/gayrimenkul/KiraKrediModulu.tsx`
- `components/calculators/gayrimenkul/YatirimModulu.tsx`
- `lib/gayrimenkul-hesaplama.ts`
- `data/gayrimenkul-verileri.ts`

Sitemap ekleri:

- `lib/content-last-modified.ts` icinde `gayrimenkulValue`
- `lib/sitemap-data.ts` icinde static page kaydi

Canli dogrulama:

- `/gayrimenkul-deger-hesaplama` -> `200 OK`
- `sitemap.xml` icinde URL mevcut

## Yeni Hesaplayici Ekleme Akisi

1. `lib/calculator-source.ts` icinde yeni hesaplayici tanimini ekle.
2. Zorunlu alanlari doldur:
   - `id`
   - `slug`
   - `category`
   - `name`
   - `description`
   - `inputs`
   - `results`
   - `formula`
   - `seo.title`
   - `seo.metaDescription`
   - `seo.content`
   - `seo.faq`
3. Ilgili kategori ve related calculator baglantilarini ekle.
4. Gerekirse `lib/calculator-trust.ts` icine metodoloji ve kaynak bilgisi ekle.
5. `lib/content-last-modified.ts` icine lastmod override ekle.
6. Runtime uret:

```bash
npm run generate:runtimes
```

7. Build al:

```bash
npm run build
```

8. Canliya cik:

```bash
npx vercel --prod --yes
```

9. Canli URL, sitemap ve Search Console akisini kontrol et.

## Yeni Ozel Sayfa Ekleme Akisi

Ozel component veya kategori disi canonical URL gerekiyorsa:

1. `app/<sayfa-slug>/page.tsx` veya uygun kategori altinda route olustur.
2. Sayfaya metadata, canonical, OpenGraph, Breadcrumb schema ve gerekirse FAQ schema ekle.
3. UI component'ini `components/calculators/*` altina koy.
4. Hesaplama mantigini `lib/*` altinda tut.
5. Veri seti gerekiyorsa `data/*` altinda tut.
6. `lib/content-last-modified.ts` icine sayfa lastmod sabiti ekle.
7. `lib/sitemap-data.ts` icindeki `staticPages` dizisine canonical URL'yi ekle.
8. Eski/kisa URL gerekiyorsa redirect route veya `next.config.mjs` redirect ekle.
9. `npm run build` ile dogrula.
10. Deploy sonrasi `sitemap.xml` icinde URL'yi ara.

## Rehber Icerigi Ekleme Akisi

1. `lib/articles.ts` icinde rehber kaydini ekle.
2. `slug`, `title`, `description`, `publishedAt`, `updatedAt`, kategori ve iliskili hesaplayicilari doldur.
3. Rehber sayfasindaki internal linkleri kontrol et.
4. Sitemap otomatik olarak `/rehber/[slug]` girdisini uretir.
5. Build ve deploy sonrasi URL'yi Search Console icin onceliklendir.

## Sitemap'e Manuel Sayfa Ekleme

Ozel sayfa sitemap'te gorunmuyorsa:

1. `lib/content-last-modified.ts` icine tarih sabiti ekle.
2. `lib/sitemap-data.ts` icinde ilgili sabiti import et.
3. `staticPages` dizisine su formda ekle:

```ts
{
    url: `${SITE_URL}/ornek-sayfa`,
    lastModified: ORNEK_PAGE_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.8,
}
```

4. Lokal dogrulama:

```bash
npx tsx -e "import { buildSitemapEntries } from './lib/sitemap-data'; console.log(buildSitemapEntries().some(e=>new URL(e.url).pathname==='/ornek-sayfa'))"
```

5. Canli dogrulama:

```powershell
$r = Invoke-WebRequest -Uri "https://www.hesapmod.com/sitemap.xml" -UseBasicParsing
$r.Content.Contains("https://www.hesapmod.com/ornek-sayfa")
```

## Kalite Kontrol Listesi

Kod kontrolu:

- `git status --short --branch`
- Degistirilen generated dosyalarin beklenen dosyalar oldugunu kontrol et.
- `lib/calculator-runtime/*` dosyalari generate edildiyse kaynak degisiklikleriyle uyumlu mu bak.

Build kontrolu:

- `npm run build`
- Build ciktisinda type/lint hatasi olmamali.
- Static page sayisi ve route listesi beklenen sayfalari icermeli.

Canli kontrol:

- Ana sayfa `200 OK`
- Yeni/degisen sayfa `200 OK`
- Redirect beklenen yerde `308` veya `301`
- `sitemap.xml` icinde canonical URL var
- `robots.txt` sitemap'i gosteriyor
- Vercel inspect status `Ready`

SEO kontrolu:

- Title ve meta description dolu
- Canonical dogru
- Breadcrumb schema dogru
- FAQ schema varsa gercek FAQ metniyle uyumlu
- Related calculators ve internal linkler calisiyor
- Redirect edilen URL sitemap'e girmiyor

## Guvenlik ve Headerlar

`next.config.mjs` icinde tum route'lara uygulanan headerlar:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

Iletisim formu guvenligi:

- IP bazli basit rate limit
- E-posta format kontrolu
- Input trim ve max length
- HTML escape
- Resend API key server tarafinda kullanilir

## Generated Dosyalar ve Dikkat Edilecekler

Elle duzenlememeye dikkat edilecek dosyalar:

- `lib/calculator-runtime/*`
- `public/<INDEXNOW_KEY>.txt`
- `public/sw.js`
- `public/workbox-*.js`
- Rapor veya CSV ciktilari script tarafindan uretiliyorsa once script kaynagi kontrol edilmeli.

Elle duzenlenebilir ana kaynaklar:

- `lib/calculator-source.ts`
- `lib/phase*Calculators.ts`
- `lib/customCalculators.ts`
- `lib/calculator-trust.ts`
- `lib/content-last-modified.ts`
- `lib/sitemap-data.ts`
- `app/*/page.tsx`
- `components/*`
- `data/*`

## Sorun Giderme

Build sirasinda runtime uyumsuzlugu:

- `npm run generate:runtimes` calistir.
- Ardindan `npm run build` ile tekrar dene.

Sitemap'te URL yok:

- URL hesaplayici ise `calculators` icinde canonical category/slug kontrol et.
- URL ozel sayfa ise `lib/sitemap-data.ts` `staticPages` dizisini kontrol et.
- Redirect edilen slug ise `REDIRECTED_CALCULATOR_SLUGS` icinde olabilir.

IndexNow dosyasi yok:

- `INDEXNOW_KEY` env var tanimli mi kontrol et.
- `npm run prepare:indexnow` calistir.
- Public klasorde `<key>.txt` olusmali.

Iletisim formu e-posta gondermiyor:

- `RESEND_API_KEY` tanimli mi kontrol et.
- `CONTACT_RECIPIENT_EMAIL` ve `RESEND_FROM_EMAIL` dogru mu kontrol et.
- Resend domain/from dogrulamasi tamam mi kontrol et.

Arac piyasa Claude provider calismiyor:

- `ANTHROPIC_API_KEY` tanimli mi kontrol et.
- `ANTHROPIC_MODEL` desteklenen bir model mi kontrol et.
- API route loglarini Vercel Functions uzerinden incele.

AdSense gorunmuyor:

- `app/layout.tsx` icindeki `ca-pub-XXXXXXXXX` placeholder gercek client ID ile degistirilmeli.
- Ad slot ID'leri `AdUnit` kullanimlarinda dogru olmali.
- Reklam alanlarinin min-height degeri CLS icin korunmali.

## Sik Kullanilan Komutlar

Repo durumu:

```bash
git status --short --branch
```

Son commit:

```bash
git log -1 --oneline --decorate
```

Lokal gelistirme:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Runtime generate:

```bash
npm run generate:runtimes
```

SEO audit:

```bash
npm run audit:seo
```

Coverage analizi:

```bash
npm run analyze:coverage
```

Production deploy:

```bash
npx vercel --prod --yes
```

Production deploy listesi:

```bash
npx vercel ls hesapmod --prod
```

Deployment detay:

```bash
npx vercel inspect <deployment-url>
```

Canli sayfa HEAD kontrolu:

```powershell
Invoke-WebRequest -Uri "https://www.hesapmod.com/gayrimenkul-deger-hesaplama" -Method Head -MaximumRedirection 0 -SkipHttpErrorCheck
```

Sitemap icinde URL kontrolu:

```powershell
$r = Invoke-WebRequest -Uri "https://www.hesapmod.com/sitemap.xml" -UseBasicParsing
$r.Content.Contains("https://www.hesapmod.com/gayrimenkul-deger-hesaplama")
```

Sitemap URL sayisi:

```powershell
$r = Invoke-WebRequest -Uri "https://www.hesapmod.com/sitemap.xml" -UseBasicParsing
([regex]::Matches($r.Content, "<url>")).Count
```

## Son Operasyon Notlari

1 Mayis 2026 tarihinde yapilan son islem:

- `/gayrimenkul-deger-hesaplama` sitemap'e eklendi.
- `lib/content-last-modified.ts` icine `gayrimenkulValue` lastmod tarihi eklendi.
- `lib/sitemap-data.ts` icine static page kaydi eklendi.
- Production deploy alindi.
- Canli sitemap icinde URL dogrulandi.

Canliya giren dikkat ceken yeni/ozel sayfalar:

- `/tasit-ve-vergi/arac-deger-hesaplama`
- `/arac-deger-hesaplama` redirect
- `/gayrimenkul-deger-hesaplama`

Canliya giren dikkat ceken yeni API'ler:

- `/api/arac-piyasa/arabam`
- `/api/arac-piyasa/claude`

