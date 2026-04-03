# Top 30 İndeks Adayı Audit

Tarih: `1 Nisan 2026`

Kaynak:
- `reports/search-console-index-priority.csv`
- Filtre: yalnız `maas-ve-vergi`, `finansal-hesaplamalar`, `sinav-hesaplamalari`

## Özet

- İlk `30` adayın `22` tanesi `finansal-hesaplamalar` kümesinden geliyor.
- `maaş-ve-vergi` kümesi daha az sayfayla geliyor ama niyet, iç link ve rehber desteği daha güçlü.
- `sınav` kümesinde hub mimarisi güçlü; zayıf taraf, yalnızca iki ana rehber etrafında dönmesi ve resmi kaynak / sonuç yorumlama bloklarının sayfa bazında daha görünür olması.
- İlk `30` içinde doğrudan `noindex` veya `404/410` adayı görünmüyor.
- En net çakışma riski: `eurobond-hesaplama` ile `eurobond-getiri-hesaplama`.
- Tazelik riski görülen sayfalar: `doviz-hesaplama`, `altin-hesaplama`, `birikim-hesaplama`, `kredi-karti-asgari-odeme`.

## İlk Uygulama Dalgası

1. `/maas-ve-vergi/maas-hesaplama`
2. `/finansal-hesaplamalar/kredi-taksit-hesaplama`
3. `/finansal-hesaplamalar/kdv-hesaplama`
4. `/finansal-hesaplamalar/ihtiyac-kredisi-hesaplama`
5. `/finansal-hesaplamalar/konut-kredisi-hesaplama`
6. `/finansal-hesaplamalar/mevduat-faiz-hesaplama`
7. `/finansal-hesaplamalar/enflasyon-hesaplama`
8. `/finansal-hesaplamalar/kira-artis-hesaplama`
9. `/sinav-hesaplamalari/yks-puan-hesaplama`
10. `/finansal-hesaplamalar/doviz-hesaplama`

## Maaş & Vergi

| Rk | URL | Hedef sorgu | Mevcut title / H1 | Rakip farkı | Eksik içerik | İç link ihtiyacı | Karar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `/maas-ve-vergi/maas-hesaplama` | maaş hesaplama, brütten nete maaş hesaplama 2026 | `Maaş Hesaplama 2026` / `Brütten Nete ve Netten Brüte` | SERP'te bordro kırılımı, resmi oran ve örnek bordro güveni baskın | kümülatif vergi senaryosu, işveren maliyeti, üstte güven bloğu | `asgari-ucret`, `gelir-vergisi`, `kidem`, `ihbar` | Güçlendir |
| 13 | `/maas-ve-vergi/kidem-tazminati-hesaplama` | kıdem tazminatı hesaplama 2026 | `Kıdem Tazminatı Hesaplama 2026` / `Net Tutar, Tavan ve Hizmet Süresi` | Rakipte mevzuat tarihi, tavan dönemi ve örnek fesih senaryosu daha görünür | tavan dönem kartı, çıkış nedeni örnekleri, üstte resmi kaynak özeti | `ihbar`, `maas`, `yillik-izin`, rehber bağlantıları | Güçlendir |
| 14 | `/maas-ve-vergi/gelir-vergisi-hesaplama` | gelir vergisi hesaplama 2026, vergi dilimleri | `Gelir Vergisi Hesaplama 2026` / `Yıllık Beyan ve Dilim` | Rakipte dilim tablosu ve ücret/beyan ayrımı daha net | ücretli vs beyan ayrımı, efektif oran örnekleri, H1 temizliği | `maas`, `asgari-ucret`, `vergi` rehberi | Güçlendir |
| 16 | `/maas-ve-vergi/ihbar-tazminati-hesaplama` | ihbar tazminatı hesaplama 2026 | `İhbar Tazminatı Hesaplama 2026` / `2, 4, 6, 8 Hafta` | Rakipte hizmet süresi bandı ve fesih örnekleri daha hızlı okunuyor | fesih senaryosu matrisi, brüt-net ayrımı, üstte güven bloğu | `kidem`, `maas`, `issizlik-maasi` rehberi | Güçlendir |

## Sınav

| Rk | URL | Hedef sorgu | Mevcut title / H1 | Rakip farkı | Eksik içerik | İç link ihtiyacı | Karar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | `/sinav-hesaplamalari/yks-puan-hesaplama` | yks puan hesaplama 2026 | `YKS Puan Hesaplama 2026` / `TYT, AYT, YDT` | Rakipte resmi kılavuz, puan yorumlama ve taban puan köprüsü daha görünür | resmi kaynak CTA, tercih yorumu, sonuç bandı açıklaması | `tyt`, `obp`, `universite-taban-puanlari`, iki ana rehber | Güçlendir |
| 21 | `/sinav-hesaplamalari/lgs-puan-hesaplama` | lgs puan hesaplama 2026, yüzdelik dilim | `LGS Puan Hesaplama 2026` / `Yüzdelik Dilim` | Rakipte yüzdelik yorumlama ve lise hedef bandı daha önde | yüzdelik dilim yorumu, okul hedef bandı, resmi MEB bağlantısı | `lise-taban-puanlari`, `e-okul`, `takdir-tesekkur`, rehber | Güçlendir |
| 22 | `/sinav-hesaplamalari/kpss-puan-hesaplama` | kpss puan hesaplama 2026 | `KPSS Puan Hesaplama 2026` / `Yaklaşık P1 Simülasyonu` | Rakipte puan türü farkları ve standart sapma notu daha net | P1/P3 ayrımı, kurum notu, sonuç yorumlama bloğu | `sinav-puanlari-rehberi`, `ales`, `dgs`, `yds` | Güçlendir |
| 23 | `/sinav-hesaplamalari/tyt-puan-hesaplama` | tyt puan hesaplama 2026 | `TYT Puan Hesaplama 2026` / `20 Haziran Ön İzleme` | H1 fazla tarih-spesifik; geniş sorgu kapsaması daralabilir | H1 sadeleştirme, OBP etkisi, TYT -> YKS geçiş akışı | `yks`, `obp`, `universite-taban-puanlari`, iki ana rehber | Güçlendir |

## Finans Çekirdek

| Rk | URL | Hedef sorgu | Mevcut title / H1 | Rakip farkı | Eksik içerik | İç link ihtiyacı | Karar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | `/finansal-hesaplamalar/kredi-taksit-hesaplama` | kredi taksit hesaplama | `Kredi Taksit Hesaplama 2026` / `Aylık Ödeme Planı` | Rakipte örnek ödeme planı ve masraf şeffaflığı daha yukarıda | masraf kalem özeti, YMO köprüsü, üstte güven bloğu | `ihtiyac`, `konut`, `tasit`, `ymo`, `erken-kapama` | Güçlendir |
| 3 | `/finansal-hesaplamalar/kdv-hesaplama` | kdv hesaplama, kdv dahil hariç hesaplama | `KDV Hesaplama 2026` / `KDV Dahil ve Hariç` | Rakipte oran tablosu ve formül örneği daha hızlı taranıyor | oran kartları, kısa formül bloğu, ticari senaryo örnekleri | `vergi` rehberi, `kar-zarar`, `indirim` araçları | Güçlendir |
| 4 | `/finansal-hesaplamalar/ihtiyac-kredisi-hesaplama` | ihtiyaç kredisi hesaplama 2026 | `İhtiyaç Kredisi Hesaplama 2026` / `Aylık Taksit, Faiz ve Toplam Ödeme` | Banka kampanya sayfalarına karşı güven ve maliyet şeffaflığı zayıf kalıyor | toplam maliyet bileşenleri, örnek vade senaryosu, resmi oran çerçevesi | `kredi-taksit`, `ymo`, `erken-kapama` | Güçlendir |
| 5 | `/finansal-hesaplamalar/konut-kredisi-hesaplama` | konut kredisi hesaplama 2026 | `Konut Kredisi Hesaplama 2026` / `En Uygun Ev Kredisi Faiz Oranları` | H1 hesaplayıcıdan çok canlı oran sayfası beklentisi kuruyor | ekspertiz/masraf bileşenleri, erken ödeme ve YMO bağlantısı | `kredi-taksit`, `kredi-erken-kapama`, `kira-artis` | Güçlendir |
| 6 | `/finansal-hesaplamalar/mevduat-faiz-hesaplama` | mevduat faiz hesaplama 2026 | `Mevduat Faiz Hesaplama 2026` / `Net Faiz ve Vadeli Getiri` | Rakipte stopaj, net getiri ve vade farkı daha bloklu anlatılıyor | stopaj oran kartı, aylık-vadeli karşılaştırma, reel getiri köprüsü | `bilesik-faiz`, `birikim`, `enflasyon`, `reel-getiri` | Güçlendir |
| 7 | `/finansal-hesaplamalar/enflasyon-hesaplama` | enflasyon hesaplama 2026 | `Enflasyon Hesaplama 2026` / `TÜFE ve CPI Değer Kaybı` | Güncel veri bloğu var; rakipte yöntem ve resmi veri kaynağı daha yukarıda | tarih damgası, satın alma gücü yorumu, reel getiri köprüsü | `kira-artis`, `mevduat-faiz`, `reel-getiri` | Güçlendir |
| 8 | `/finansal-hesaplamalar/kira-artis-hesaplama` | kira artış hesaplama 2026 | `Kira Artış Hesaplama 2026` / `TÜFE Onaylı Güncel Oranlar` | Güncel oran avantajı güçlü; rakipte kiracı/ev sahibi senaryosu daha net | örnek sözleşme dönemi senaryoları, açıklayıcı mini SSS | `enflasyon`, `kira` rehberi, `vergi` içerikleri | Güçlendir |
| 10 | `/finansal-hesaplamalar/doviz-hesaplama` | döviz hesaplama, kur çevirici | `Döviz Hesaplama 2026` / `Anlık USD, EUR, GBP Kur Çevirici` | `anlık` vaadi var; kaynak zamanı görünmezse güven açığı oluşur | veri kaynağı, kur saati, makas ve çapraz kur açıklaması | `altin`, `enflasyon`, `eurobond` | Güçlendir |
| 12 | `/finansal-hesaplamalar/eurobond-hesaplama` | eurobond hesaplama, eurobond getirisi | `Eurobond Hesaplama 2026` / `Getiri ve Vergi` | Aynı niyette ikinci eurobond URL'si var; ayrışma bulanık | kupon, vergi, kur etkisi rol ayrımı; intent netleştirme | `eurobond-getiri`, eurobond rehberleri, `doviz` | Güçlendir, ayrıştır |
| 15 | `/finansal-hesaplamalar/altin-hesaplama` | altın hesaplama, gram altın çevirici | `Altın Hesaplama 2026` / `Gram, Çeyrek, Ons` | `anlık` ve tür çevirici niyeti güçlü; kaynak zamanı görünmezse güven kaybı olur | veri saati, alış-satış makası, tür bazlı örnekler | `doviz`, `enflasyon`, `birikim` | Güçlendir |
| 17 | `/finansal-hesaplamalar/kredi-karti-gecikme-faizi-hesaplama` | kredi kartı gecikme faizi hesaplama 2026 | `Kredi Kartı Gecikme Faizi Hesaplama 2026` / `Akdi ve Gecikme Faizi` | Rakipte TCMB azami oran tarihi daha görünür | oran tarihi, minimum ödeme etkisi, gecikme örnekleri | `kredi-karti-asgari-odeme`, `nakit-avans`, rehber | Güçlendir |
| 18 | `/finansal-hesaplamalar/kredi-yillik-maliyet-orani-hesaplama` | ymo hesaplama, kredi yıllık maliyet oranı | `YMO Hesaplama` / `Kredi Yıllık Maliyet Oranı` | Kavramsal sayfa; rakipte örnek kredi senaryosu daha açıklayıcı | masraf bileşeni tablosu, örnek kredi karşılaştırması | `kredi-taksit`, `ihtiyac`, `konut`, `tasit` | Güçlendir |
| 19 | `/finansal-hesaplamalar/kredi-erken-kapama-hesaplama` | kredi erken kapama hesaplama 2026 | `Kredi Erken Kapama Hesaplama 2026` / `İndirim ve Kapatma Tutarı` | Çerçeve bloğu iyi; rakipte banka yazısı farkı ve mevzuat özeti daha net | ödeme günü farkı, sabit/değişken faiz ayrımı, üstte güven bloğu | `kredi-erken-kapatma-cezasi`, `kredi-taksit`, `ymo` | Güçlendir |

## Finans Genişleme

| Rk | URL | Hedef sorgu | Mevcut title / H1 | Rakip farkı | Eksik içerik | İç link ihtiyacı | Karar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 27 | `/finansal-hesaplamalar/bilesik-faiz-hesaplama` | bileşik faiz hesaplama | `Bileşik Faiz Hesaplama 2026` / `Aylık ve Yıllık Getiri` | Rakipte basit faiz farkı ve yatırım örneği daha görünür | basit vs bileşik farkı, reel getiri bağlantısı | `basit-faiz`, `birikim`, `mevduat-faiz`, `cagr` | Güçlendir |
| 28 | `/finansal-hesaplamalar/ticari-arac-kredisi-hesaplama` | ticari araç kredisi hesaplama | `Ticari Araç Kredisi Hesaplama 2026` / `Şirket & Esnaf` | Rakipte belge, peşinat ve vade kısıtı daha açık | belge/şirket notu, örnek panelvan senaryosu | `tasit-kredisi`, `kredi-taksit`, `ymo` | Güçlendir |
| 30 | `/finansal-hesaplamalar/birikim-hesaplama` | birikim hesaplama, tasarruf planı | `Birikim Hesaplama 2026` / `Düzenli Tasarruf Planı` | Rakipte hedef tutar ve süre senaryosu daha güçlü | hedef odaklı örnekler, enflasyon etkisi, güncelleme tarihi | `bilesik-faiz`, `mevduat-faiz`, `enflasyon` | Güçlendir |
| 31 | `/finansal-hesaplamalar/kredi-karti-asgari-odeme` | kredi kartı asgari ödeme hesaplama 2026 | `Kredi Kartı Asgari Ödeme Hesaplama 2026` / `Faiz ve Geri Ödeme Planı` | Rakipte güncel oran ve limit bandı daha görünür | limit bandı tablosu, gecikme etkisi, güncelleme tarihi | `kredi-karti-gecikme-faizi`, rehber, `nakit-avans` | Güçlendir |
| 32 | `/finansal-hesaplamalar/bilesik-buyume-hesaplama` | CAGR hesaplama, YBBO hesaplama | `CAGR / YBBO Hesaplama 2026` / `Yıllık Bileşik Büyüme` | Rakipte yatırım ve e-ticaret örnekleri daha açıklayıcı | gelir büyümesi örneği, bileşik faiz farkı | `bilesik-faiz`, `birikim`, `kar-zarar` | Güçlendir |
| 33 | `/finansal-hesaplamalar/tasit-kredisi-hesaplama` | taşıt kredisi hesaplama 2026 | `Taşıt / Araç Kredisi Hesaplama 2026` / `0 KM & 2. El` | Rakipte 0 km / 2. el kural farkı ve masraf açıklaması daha net | kredi üst sınırı, peşinat ve sigorta notu | `kredi-taksit`, `ymo`, `ticari-arac-kredisi` | Güçlendir |
| 34 | `/finansal-hesaplamalar/eurobond-getiri-hesaplama` | eurobond getiri hesaplama, eurobond vergi hesaplama | `Eurobond Vergi ve Getiri Hesaplama 2026` / `Kupon, YTM ve Stopaj` | `eurobond-hesaplama` ile niyet çakışıyor | title/H1 ayrıştırma, hangi URL neyi çözüyor açıklığı | `eurobond-hesaplama`, eurobond rehberleri, `doviz` | Ayrıştır, gerekirse canonical incele |
| 35 | `/finansal-hesaplamalar/kredi-karti-taksitli-nakit-avans-hesaplama` | taksitli nakit avans hesaplama 2026 | `Taksitli Nakit Avans Hesaplama 2026` / `Kredi Kartı Nakit Avans` | Rakipte kampanya ile gerçek maliyet farkı daha net anlatılıyor | oran tarihi, vergi dahil maliyet, örnek ekstre akışı | `kredi-karti-asgari-odeme`, `gecikme-faizi`, `kredi-taksit` | Güçlendir |
| 36 | `/finansal-hesaplamalar/basit-faiz-hesaplama` | basit faiz hesaplama | `Basit Faiz Hesaplama 2026` / `Anapara, Oran ve Vade` | Rakipte basit-bileşik farkı ilk ekranda veriliyor | formül farkı, mini karşılaştırma, yatırım senaryosu | `bilesik-faiz`, `mevduat-faiz`, `ymo` | Güçlendir |

## Notlar

- `finansal-hesaplamalar` kümesinde rehber bağlantıları var ama çok sayfa aynı birkaç rehbere bağlanıyor; niyet bazlı iç link derinliği artırılmalı.
- `sınav` kümesinde kategori hub güçlü, ancak sayfa bazında resmi kaynak ve sonuç yorumlama bloklarını daha öne almak gerekir.
- `maaş-ve-vergi` kümesinde içerik niyeti daha temiz; burada standart editoryal güven bileşeni hızlı kazanım sağlayacak.
- `eurobond-hesaplama` ile `eurobond-getiri-hesaplama` için ayrı bir başlık/canonical kararı oturumu açılmalı.
