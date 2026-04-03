# 31 Mart 2026 Devam Notu

Bu dosya, yarın oturumu hızlı açmak için kısa handoff notudur.

## Canlı Durum

- Production: `https://www.hesapmod.com`
- Son deploy: `https://hesapmod-m57t0aysd-sdem81s-projects.vercel.app`
- Deploy tarihi: `31.03.2026`
- Lint: temiz
- Type check: temiz
- Build: temiz
- Vercel postbuild IndexNow: başarılı
- Sitemap: `227 URL`

## Bugün Tamamlananlar

- `sınav` kategorisi için indeks odaklı hub güçlendirmesi canlıya alındı.
- `app/kategori/[slug]/page.tsx` içinde sınav kategorisine özel:
  - daha güçlü metadata
  - editoryal açıklamalar
  - `Hızlı Başlangıç` iyileştirmesi
  - `2026 Sınav Yol Haritası`
  - `Resmi Kaynaklar ve Son Güncellemeler`
  blokları eklendi.
- `lib/calculator-source.ts` içinde sınav kategorisindeki tüm sayfalara özgün editoryal içerik, SSS ve iç link katmanı tamamlandı.
- `lib/featured-tools.ts` içinde sınav tarafındaki öne çıkan araçlar genişletildi.
- `lib/articles.ts` içinde iki rehber güçlü iç link hub'ına dönüştürüldü:
  - `sinav-puanlari-rehberi-2026`
  - `okul-giris-sinav-rehberi-2026`
- Bu rehberlerde:
  - daha fazla bağlamsal iç link
  - daha geniş `relatedCalculators`
  - daha net kullanıcı niyeti eşleşmesi
  - daha güçlü keşif akışı
  eklendi.

## Canlı Kontrol

- `https://www.hesapmod.com/rehber/sinav-puanlari-rehberi-2026` canlı kontrol: `200`
- `https://www.hesapmod.com/rehber/okul-giris-sinav-rehberi-2026` canlı kontrol: `200`
- Yeni rehber blokları canlıda doğrulandı.

## Search Console Bağlamı

- Mevcut problem: `Keşfedildi - şu anda dizine eklenmiş değil`
- Etkilenen sayfa sayısı: yaklaşık `185`
- Sorun bütün siteye yayılıyor; yalnız sınav kategorisi değil.
- Buna rağmen ilk öncelik yine `sınav` kümesi olacak; çünkü:
  - en güçlü iç link ve editoryal derinlik burada kuruldu
  - rehber + kategori + araç zinciri burada hazır
  - hızlı kalite farkı üretmek daha kolay

## Google Notu

- Google Search Status Dashboard'a göre `March 2026 core update` `27 Mart 2026`'da başladı.
- Dashboard notuna göre rollout `2 haftaya kadar` sürebilir.
- Pratik izleme penceresi:
  - olası bitiş: yaklaşık `10 Nisan 2026`
  - sağlıklı değerlendirme için en erken net okuma: yaklaşık `17 Nisan 2026`
- `March 2026 spam update` ise `24 Mart 2026`'da başladı ve `25 Mart 2026`'da tamamlandı.

## Stratejik Çıkarım

Yarın yapılacaklar "algoritma kovalamak" şeklinde değil; Google'ın resmi yönüne uygun şekilde:

- daha yüksek kullanıcı değeri
- daha net yöntem ve kaynak şeffaflığı
- daha güçlü iç link mimarisi
- daha temiz URL envanteri
- daha az şablon, daha fazla özgün yardımcı içerik

üzerinden ilerlemeli.

## Yarın İlk İş

1. `top 30` indeks adayı URL listesini çıkarmak
2. Bu listeyi üç kümeye ayırmak:
   - `sınav`
   - `maaş-ve-vergi`
   - `finansal-hesaplamalar`
3. Her URL için şu alanları tabloya dökmek:
   - hedef sorgu
   - mevcut title/H1
   - rakip farkı
   - eksik içerik
   - iç link ihtiyacı
   - noindex/canonical/merge kararı

## Kod Tarafında İlk Uygulanacak İş

Tekrar kullanılabilir bir editoryal güven bileşeni hazırlanacak.

Amaç:

- tüm önemli araç sayfalarında standart bir kalite bloğu göstermek

Blok içeriği:

- `Nasıl hesaplanır?`
- `Bu veriler / kurallar nereden gelir?`
- `Son kontrol tarihi`
- `Editör / kontrol eden`
- `Resmi kaynak bağlantıları`
- gerekirse `Bu sonuç nasıl yorumlanır?`

İlk uygulanacak kümeler:

1. `sınav`
2. `maaş-ve-vergi`
3. `finansal-hesaplamalar`

## İçerik ve İndeks Planı

### A. Güçlendirilecekler

- `sınav` çekirdek sayfaları
- sınav rehberleri
- kategori hub
- yüksek niyetli maaş/vergi sayfaları
- yüksek niyetli finans sayfaları

### B. Temizlenecekler

- yakın niyetli ama zayıf veya çakışan URL'ler
- çok az değer ekleyen varyasyon sayfaları
- aynı niyetin iki sayfaya bölündüğü alanlar

### C. Gerekirse Karar Verilecekler

- birleştirme
- canonical
- `noindex`
- `404/410`

## Yarın Sorulacak Ana Soru

Bu URL gerçekten dizine girmeli mi?

Eğer cevap net değilse, güçlendirmek yerine temizlemek daha doğru olabilir.

## Öncelikli Somut Backlog

1. `top 30 URL` tablosunu oluştur
2. `top 30` için tek tek title/meta/H1 incelemesi yap
3. tekrar kullanılabilir `Yöntem + Kaynak + Son Kontrol + Editör` bileşenini kodla
4. bu bileşeni önce sınav kümesine bağla
5. sonra `maaş-ve-vergi` ve `finans` tarafına yay
6. düşük değerli veya çakışan URL'ler için temizleme listesi çıkar
7. core update bittikten sonra Search Console'da yalnız öncelikli URL'ler için yeniden kontrol iste

## Not

- Repo çalışma ağacı kirli; bu normal.
- Production deploy mevcut worktree üzerinden alındı.
- Yarın yeni iş açarken mevcut diff korunmalı, geri alma yapılmamalı.
