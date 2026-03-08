export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number; // dakika
  relatedCalculators: string[]; // calc slug'ları
  content: string; // HTML string
  keywords: string[];
}

export const articles: Article[] = [
  {
    slug: "kidem-tazminati-hesaplama-rehberi",
    title: "2026 Kıdem Tazminatı Hesaplama Rehberi: Tavan, Formül ve Örnekler",
    description:
      "Kıdem tazminatı nedir, kimler alabilir, 2026 tavanı ne kadar? Adım adım formül ve gerçek örneklerle kıdem tazminatınızı hesaplayın.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 7,
    relatedCalculators: ["kidem-tazminati-hesaplama", "ihbar-tazminati-hesaplama", "maas-hesaplama"],
    keywords: ["kıdem tazminatı", "kıdem tazminatı hesaplama", "kıdem tazminatı tavanı 2026", "kıdem tazminatı nasıl hesaplanır"],
    content: `<h2>Kıdem Tazminatı Nedir?</h2>
<p>Kıdem tazminatı, en az <strong>1 yıl aynı işyerinde çalışmış</strong> ve iş sözleşmesi belirli şartlarla sona eren işçilerin hak kazandığı yasal bir tazminattır. Her tam çalışma yılı için işçinin <strong>30 günlük brüt maaşı</strong> tutarında ödeme yapılır.</p>
<h2>Kimler Kıdem Tazminatı Alabilir?</h2>
<ul>
  <li>İşveren tarafından haksız yere işten çıkarılanlar</li>
  <li>Askerlik, emeklilik veya evlilik nedeniyle istifa edenler (kadınlar için)</li>
  <li>En az 15 yıl sigorta, en az 3600 prim gününü dolduran ve emekliliğe hak kazananlar</li>
  <li>İşçinin ölümü halinde mirasçıları</li>
</ul>
<h2>2026 Kıdem Tazminatı Tavanı</h2>
<p>Kıdem tazminatı tavanı asgari ücrete bağlı olarak <strong>aylık bazda güncellenerek</strong> belirlenmektedir. Hesaplama için kullandığımız hesap makinesi güncel tavan rakamlarını otomatik olarak uygular.</p>
<h2>Kıdem Tazminatı Formülü</h2>
<p><code>Kıdem Tazminatı = (Brüt Maaş / 30) × 30 × Çalışma Yılı</code></p>
<p>Ancak hesaplamada <em>brüt maaşın yanı sıra</em> yemek, yol, ikramiye gibi sürekli yapılan ödemeler de dahil edilmelidir. Ayrıca sonuç, tavan rakamını aşamaz.</p>
<h2>Gerçek Hayat Örneği</h2>
<p>Ahmet Bey 5 yıl 6 ay çalışmış, brüt maaşı 45.000 TL'dir:</p>
<ul>
  <li>Çalışma süresi: 5,5 yıl (5 tam + 6 ay) → 5 + 6/12 = 5,5</li>
  <li>Kıdem Tazminatı: 45.000 × 5,5 = <strong>247.500 TL</strong></li>
</ul>
<p>Bu hesabı otomatik yapmak için aşağıdaki aracımızı kullanabilirsiniz.</p>`,
  },
  {
    slug: "brut-net-maas-farki",
    title: "Brüt Maaş ile Net Maaş Arasındaki Fark: SGK, Gelir Vergisi ve Damga Vergisi",
    description:
      "Brüt maaşınızdan ne kadar kesinti yapıldığını hiç merak ettiniz mi? SGK, işsizlik sigortası, gelir vergisi ve damga vergisi kalemlerini bu rehberle öğrenin.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 6,
    relatedCalculators: ["bruten-nete-maas-hesaplama", "netten-brute-maas-hesaplama", "asgari-ucret-hesaplama"],
    keywords: ["brüt net maaş farkı", "maaş kesintileri", "SGK kesintisi", "gelir vergisi 2026", "net maaş hesaplama"],
    content: `<h2>Brüt Maaş Nedir?</h2>
<p>Brüt maaş, işverenin iş sözleşmesinde belirlediği <strong>toplam ücret</strong>tir. Vergi ve sigorta kesintileri yapılmadan önceki ham tutardır.</p>
<h2>Net Maaş Nedir?</h2>
<p>Net maaş ise brüt maaştan tüm yasal kesintiler düşüldükten sonra <strong>elinize geçen gerçek tutar</strong>dır.</p>
<h2>Hangi Kesintiler Yapılır?</h2>
<table>
  <thead><tr><th>Kesinti Türü</th><th>Oran</th><th>Kim Öder?</th></tr></thead>
  <tbody>
    <tr><td>SGK İşçi Payı</td><td>%14</td><td>İşçi</td></tr>
    <tr><td>İşsizlik Sigortası (İşçi)</td><td>%1</td><td>İşçi</td></tr>
    <tr><td>SGK İşveren Payı</td><td>%20,5</td><td>İşveren</td></tr>
    <tr><td>İşsizlik Sigortası (İşveren)</td><td>%2</td><td>İşveren</td></tr>
    <tr><td>Gelir Vergisi</td><td>%15–%40</td><td>İşçi (dilime göre)</td></tr>
    <tr><td>Damga Vergisi</td><td>%0,759</td><td>İşçi</td></tr>
  </tbody>
</table>
<h2>Örnek: 50.000 TL Brüt Maaş</h2>
<ul>
  <li>SGK: 50.000 × %14 = 7.000 TL</li>
  <li>İşsizlik Sigortası: 50.000 × %1 = 500 TL</li>
  <li>Vergi Matrahı: 42.500 TL</li>
  <li>Gelir Vergisi (kümülatif dilime göre): ~7.000 TL</li>
  <li>Damga Vergisi: ~323 TL</li>
  <li><strong>Net El Geliri: ~35.177 TL</strong></li>
</ul>
<p>Kesin rakamı hesaplamak için aşağıdaki araçlarımızı kullanın.</p>`,
  },
  {
    slug: "issizlik-maasi-ne-kadar-2026",
    title: "2026 İşsizlik Maaşı Ne Kadar? Başvuru Şartları ve Hesaplama",
    description:
      "İşsizlik ödeneği başvurusu için gerekli şartlar, ne kadar alırsınız ve kaç gün devam eder? 2026 güncel bilgileri ve hesaplama aracı.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 5,
    relatedCalculators: ["issizlik-maasi-hesaplama", "kidem-tazminati-hesaplama"],
    keywords: ["işsizlik maaşı 2026", "işsizlik ödeneği ne kadar", "işsizlik maaşı başvurusu", "işkur başvuru şartları"],
    content: `<h2>İşsizlik Maaşına Kimler Başvurabilir?</h2>
<p>İşsizlik ödeneği alabilmek için aşağıdaki koşulları sağlamanız gerekir:</p>
<ul>
  <li>Son 120 gün kesintisiz sigortalı çalışmış olmak</li>
  <li>Son 3 yılda en az 600 gün işsizlik sigortası primi ödemiş olmak</li>
  <li><strong>Kendi isteğiyle istifa etmemiş</strong> olmak (zorunlu sebepler hariç)</li>
  <li>İşten çıkış tarihinden itibaren <strong>30 gün içinde</strong> İŞKUR'a başvurmak</li>
</ul>
<h2>İşsizlik Maaşı Miktarı Nasıl Hesaplanır?</h2>
<p>İşsizlik ödeneği, son 4 ay brüt maaşınızın ortalamasının <strong>%40</strong>'ı olarak hesaplanır. Ancak alt ve üst sınır mevcuttur.</p>
<ul>
  <li><strong>Alt Sınır:</strong> Asgari ücretin %80'i</li>
  <li><strong>Üst Sınır:</strong> Asgari ücretin 2 katı</li>
</ul>
<h2>İşsizlik Maaşı Kaç Ay Ödenir?</h2>
<table>
  <thead><tr><th>Prim Ödeme Gün Sayısı</th><th>Ödenek Süresi</th></tr></thead>
  <tbody>
    <tr><td>600 – 899 gün</td><td>6 ay</td></tr>
    <tr><td>900 – 1079 gün</td><td>8 ay</td></tr>
    <tr><td>1080 gün ve üzeri</td><td>10 ay</td></tr>
  </tbody>
</table>
<p>Hızlı ve doğru hesaplama için aşağıdaki İşsizlik Maaşı hesaplayıcımızı kullanabilirsiniz.</p>`,
  },
  {
    slug: "ihbar-tazminati-nedir-nasil-hesaplanir",
    title: "İhbar Tazminatı Nedir? 2026 Hesaplama Formülü ve Örnek",
    description:
      "İhbar süreleri kaç haftadır? İşçi mi öder, işveren mi? İhbar tazminatı hesaplama formülü ve 2026 güncel örnek tablosu.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 5,
    relatedCalculators: ["ihbar-tazminati-hesaplama", "kidem-tazminati-hesaplama"],
    keywords: ["ihbar tazminatı", "ihbar tazminatı hesaplama 2026", "ihbar süresi kaç hafta", "ihbar tazminatı nasıl hesaplanır"],
    content: `<h2>İhbar Tazminatı Nedir?</h2>
<p>İhbar tazminatı, iş sözleşmesini haklı bir neden olmaksızın ve yasal ihbar sürelerine uymaksızın tek taraflı fesheden tarafın, diğer tarafa ödemek zorunda olduğu tazminattır. Hem işçi hem de işveren bu tazminatı ödemek durumunda kalabilir.</p>
<h2>İhbar Süreleri (2026)</h2>
<table>
  <thead><tr><th>Çalışma Süresi</th><th>İhbar Süresi</th></tr></thead>
  <tbody>
    <tr><td>6 aydan az</td><td>2 hafta</td></tr>
    <tr><td>6 ay – 1,5 yıl</td><td>4 hafta</td></tr>
    <tr><td>1,5 yıl – 3 yıl</td><td>6 hafta</td></tr>
    <tr><td>3 yıldan fazla</td><td>8 hafta</td></tr>
  </tbody>
</table>
<h2>İhbar Tazminatı Formülü</h2>
<p><code>İhbar Tazminatı = Günlük Brüt Maaş × İhbar Süresi (gün)</code></p>
<p>Yani 8 haftalık ihbar süresi için <strong>56 günlük brüt maaş</strong> tutarında ödeme yapılır.</p>
<h2>Örnek Hesaplama</h2>
<p>4 yıl çalışmış, brüt maaşı 40.000 TL olan bir işçi için:</p>
<ul>
  <li>İhbar Süresi: 8 hafta (56 gün)</li>
  <li>Günlük Maaş: 40.000 / 30 ≈ 1.333 TL</li>
  <li>İhbar Tazminatı: 1.333 × 56 = <strong>74.667 TL</strong></li>
</ul>`,
  },
  {
    slug: "yillik-izin-hakki-rehberi",
    title: "2026 Yıllık İzin Hakkı: Kaç Gün İzin Kullanırsınız? Hesaplama Rehberi",
    description:
      "Kaç yıl çalıştığınıza göre yıllık izin hakkınız kaç gün? Kullanılmayan izinler nasıl ücrete dönüşür? 2026 eksiksiz rehber.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-07",
    readingTime: 5,
    relatedCalculators: ["yillik-izin-hesaplama", "yillik-izin-ucreti-hesaplama"],
    keywords: ["yıllık izin hakkı 2026", "yıllık izin kaç gün", "yıllık izin ücreti hesaplama", "izin paraya çevirme"],
    content: `<h2>Yıllık İzin Hakkı Nasıl Belirlenir?</h2>
<p>4857 sayılı İş Kanunu'na göre yıllık ücretli izin süresi, çalışma yılına göre değişir:</p>
<table>
  <thead><tr><th>Çalışma Süresi</th><th>Yıllık İzin Hakkı</th></tr></thead>
  <tbody>
    <tr><td>1 – 5 yıl (dahil)</td><td>14 iş günü</td></tr>
    <tr><td>5 – 15 yıl</td><td>20 iş günü</td></tr>
    <tr><td>15 yıl ve üzeri</td><td>26 iş günü</td></tr>
    <tr><td>18 yaş altı ve 50 yaş üstü</td><td>En az 20 iş günü</td></tr>
  </tbody>
</table>
<h2>Kullanılmayan İzin Paraya Çevrilir mi?</h2>
<p>Türk hukukunda çalışma devam ederken izin paraya çevrilemez. Ancak iş sözleşmesi sona erdiğinde kullanılmamış izin günleri <strong>son brüt günlük maaş üzerinden</strong> nakde dönüştürülür.</p>
<h2>Yıllık İzin Ücreti Formülü</h2>
<p><code>İzin Ücreti = Brüt Maaş / 30 × Kullanılmamış İzin Günü</code></p>
<h2>Örnek</h2>
<p>8 yıl çalışmış, brüt maaşı 35.000 TL olan ve 15 gün izni kalan bir çalışan için:</p>
<ul>
  <li>Günlük Brüt: 35.000 / 30 ≈ 1.167 TL</li>
  <li>İzin Ücreti: 1.167 × 15 = <strong>17.500 TL</strong></li>
</ul>
<p>Hesaplamak için aşağıdaki araçlarımızı kullanın.</p>`,
  },
  {
    slug: "kredi-faizi-ve-aylik-taksit-rehberi",
    title: "2026 Kredi Faizi ve Aylık Taksit Rehberi: İhtiyaç, Konut ve Toplam Maliyet",
    description:
      "Kredi taksiti nasıl hesaplanır, faiz oranı aylık ödemeyi ne kadar değiştirir, toplam geri ödeme nasıl okunur? 2026 için pratik kredi rehberi.",
    category: "Finans",
    categorySlug: "finansal-hesaplamalar",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 7,
    relatedCalculators: ["kredi-taksit-hesaplama", "ihtiyac-kredisi-hesaplama", "konut-kredisi-hesaplama", "kredi-yillik-maliyet-orani-hesaplama"],
    keywords: ["kredi faizi hesaplama", "aylık taksit hesaplama", "ihtiyaç kredisi", "konut kredisi", "kredi toplam maliyet"],
    content: `<h2>Kredi Taksiti Neden Aynı Faizde Bile Değişir?</h2>
<p>Aynı nominal faiz oranı kullanılsa bile kredi türü, vade süresi, dosya masrafı, sigorta bedeli ve ödeme planı aylık taksiti değiştirebilir. Bu yüzden yalnızca oranı değil, <strong>aylık ödeme + toplam geri ödeme + yıllık maliyet</strong> üçlüsünü birlikte okumak gerekir.</p>
<h2>Aylık Taksit Nasıl Hesaplanır?</h2>
<p>Bankacılıkta en yaygın yaklaşım annuite ödeme planıdır. Yani her ay sabit taksit ödersiniz; ilk aylarda faizin payı yüksek, son aylarda anapara payı daha büyüktür. Hesaplama mantığı şu üç veriye dayanır:</p>
<ul>
  <li>Kredi tutarı</li>
  <li>Aylık faiz oranı</li>
  <li>Vade sayısı</li>
</ul>
<p>Vade uzadıkça taksit düşer; ancak toplam geri ödeme genellikle yükselir. Bu nedenle düşük aylık taksit her zaman daha avantajlı değildir.</p>
<h2>İhtiyaç Kredisi ile Konut Kredisi Arasında Ne Fark Var?</h2>
<p>İhtiyaç kredisinde vade çoğu zaman daha kısa, faiz hassasiyeti daha yüksektir. Konut kredisinde ise vade uzadıkça küçük faiz farkları bile toplam maliyeti ciddi biçimde büyütür. Özellikle uzun vadelerde yalnızca ilk taksite bakmak yanıltıcı olabilir.</p>
<h2>Toplam Maliyeti Okurken Nelere Dikkat Edilmeli?</h2>
<ul>
  <li>Dosya masrafı ve tahsis ücreti</li>
  <li>Sigorta ve ek ürünler</li>
  <li>Erken kapama ihtimali</li>
  <li>Gelire göre taksit baskısı</li>
</ul>
<p>En doğru karar için sadece “en düşük faiz” değil, <strong>gelire uygun aylık ödeme</strong> ve <strong>katlanılabilir toplam maliyet</strong> dengesi kurulmalıdır.</p>
<h2>Örnek Senaryo</h2>
<p>300.000 TL kredi, 24 ay vade ve aylık %3,2 faiz ile çekildiğinde oluşan taksit ile aynı tutarın 36 ay vadede oluşan taksiti birbirinden belirgin biçimde farklıdır. 36 ay senaryosu aylık baskıyı azaltır; fakat toplam faiz yükünü artırır. Bu yüzden kısa vade ile uzun vade arasında karar verirken nakit akışı planı mutlaka yapılmalıdır.</p>
<h2>Hangi Araçlar Birlikte Kullanılmalı?</h2>
<p>Önce genel <strong>Kredi Taksit Hesaplama</strong> aracıyla tabloyu görün. Ardından senaryoyu özel kredi türüne göre <strong>İhtiyaç Kredisi</strong> veya <strong>Konut Kredisi</strong> aracıyla daraltın. Son aşamada <strong>Yıllık Maliyet Oranı</strong> ekranı ile gerçek yükü kıyaslayın.</p>`,
  },
  {
    slug: "mevduat-faizi-enflasyon-ve-reel-getiri-rehberi",
    title: "Mevduat Faizi, Enflasyon ve Reel Getiri Rehberi: 2026'da Net Kazanç Nasıl Okunur?",
    description:
      "Vadeli mevduatın net getirisi nasıl hesaplanır, enflasyon etkisi nasıl düşülür, reel kazanç nasıl yorumlanır? 2026 için sade mevduat rehberi.",
    category: "Finans",
    categorySlug: "finansal-hesaplamalar",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 6,
    relatedCalculators: ["mevduat-faiz-hesaplama", "enflasyon-hesaplama", "reel-getiri-hesaplama", "birikim-hesaplama"],
    keywords: ["mevduat faizi", "reel getiri hesaplama", "enflasyon etkisi", "net faiz getirisi", "vadeli mevduat 2026"],
    content: `<h2>Nominal Getiri ile Reel Getiri Aynı Şey Değildir</h2>
<p>Vadeli mevduat hesabında görülen faiz oranı size nominal kazancı söyler. Fakat cebinizde kalan gerçek fayda için stopaj ve enflasyon etkisini ayrıca görmek gerekir. Bu yüzden mevduatı değerlendirirken yalnızca vade sonu tutara değil, <strong>satın alma gücünün ne kadar korunduğuna</strong> odaklanmak gerekir.</p>
<h2>Net Mevduat Getirisi Nasıl Hesaplanır?</h2>
<p>Temel hesaplama anapara, yıllık faiz oranı ve vade gün sayısı ile başlar. Ardından stopaj kesintisi düşülür ve net vade sonu tutarı bulunur. Ancak bu tutarın enflasyon karşısında ne ifade ettiği ayrıca ölçülmezse sonuç eksik kalır.</p>
<h2>Enflasyon Etkisi Neden Bu Kadar Önemli?</h2>
<p>Örneğin bir mevduat size nominal olarak %40 getiri sağlasa bile aynı dönemde enflasyon %45 ise satın alma gücü artmamış olabilir. Bu durumda nominal kazanç pozitif, reel sonuç ise zayıf hatta negatif olabilir.</p>
<h2>Reel Getiri Nasıl Yorumlanmalı?</h2>
<ul>
  <li>Nominal getiri yüksek olabilir ama reel getiri düşük çıkabilir.</li>
  <li>Kısa vadede cazip görünen oran, vergi sonrası anlamını kaybedebilir.</li>
  <li>Farklı vade seçenekleri enflasyon senaryolarıyla birlikte denenmelidir.</li>
</ul>
<h2>Örnek Okuma</h2>
<p>200.000 TL mevduatın 32 gün ve 92 gün gibi farklı vadelerde verdiği net faiz aynı görünmeyebilir. Kısa vadede likidite avantajı vardır; uzun vadede ise oran daha yüksek olabilir. Fakat karar verirken her iki senaryonun da reel getirisini kıyaslamak gerekir.</p>
<h2>Hangi Araçlar Birlikte Kullanılmalı?</h2>
<p>İlk olarak <strong>Mevduat Faiz Hesaplama</strong> aracıyla net vade sonu tutarı görün. Ardından aynı dönemin fiyat etkisini <strong>Enflasyon Hesaplama</strong> aracıyla ölçün. Son olarak <strong>Reel Getiri Hesaplama</strong> ekranında nominal sonucun satın alma gücü karşılığını görün. Düzenli birikim yapıyorsanız <strong>Birikim Hesaplama</strong> ekranı ile uzun vadeli senaryo da kurabilirsiniz.</p>`,
  },
  {
    slug: "kira-artis-orani-ve-tufe-rehberi",
    title: "2026 Kira Artış Oranı ve TÜFE Rehberi: Ev Sahibi ve Kiracı İçin Pratik Hesap",
    description:
      "Kira artış oranı nasıl hesaplanır, TÜFE 12 aylık ortalama nasıl okunur, yeni kira bedeli nasıl bulunur? 2026 için sade ve uygulamalı rehber.",
    category: "Finans",
    categorySlug: "finansal-hesaplamalar",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 6,
    relatedCalculators: ["kira-artis-hesaplama", "enflasyon-hesaplama", "kira-mi-konut-kredisi-mi-hesaplama"],
    keywords: ["kira artış oranı", "tüfe kira artışı", "yeni kira hesaplama", "2026 kira zammı", "kira artış hesabı"],
    content: `<h2>Kira Artışında Esas Veri Nedir?</h2>
<p>Konut ve işyeri kira artışlarında uygulamada en çok bakılan veri, sözleşme dönemi geldiğinde dikkate alınan <strong>TÜFE 12 aylık ortalama</strong> oranıdır. Ancak sözleşme tarihi, mevcut kira tutarı ve tarafların özel sözleşme hükmü sonucu doğrudan etkiler.</p>
<h2>Yeni Kira Tutarı Nasıl Bulunur?</h2>
<p>Temel mantık basittir: mevcut kira tutarı seçilen artış oranı kadar artırılır. Fakat uygulamada yanlış yapılan nokta, aylık TÜFE ile 12 aylık ortalamayı karıştırmaktır. Bu hata, gereğinden yüksek veya düşük yeni kira hesaplanmasına yol açabilir.</p>
<h2>TÜFE ile Enflasyon Arasında Neden Ayrım Yapılmalı?</h2>
<p>Genel enflasyon tartışmalarında farklı oranlar konuşulabilir. Kira artışı özelinde ise hangi göstergenin esas alındığı önemlidir. Bu nedenle kira zammını yorumlarken yalnızca “enflasyon arttı” bilgisi yetmez; doğru referans oranı kullanılmalıdır.</p>
<h2>Ev Sahibi ve Kiracı Açısından Okuma</h2>
<ul>
  <li>Ev sahibi için önemli olan yeni bedelin yasal çerçevede doğru hesaplanmasıdır.</li>
  <li>Kiracı için önemli olan, artışın hangi döneme ve hangi orana göre yapıldığını teyit etmektir.</li>
  <li>Uzun vadeli karar için kira artışı ile konut kredisi maliyeti birlikte karşılaştırılabilir.</li>
</ul>
<h2>Örnek Senaryo</h2>
<p>Aylık kirası 18.000 TL olan bir konutta sözleşme yenileme tarihinde uygulanacak oran %X ise yeni kira, mevcut bedelin bu oran kadar artırılmasıyla bulunur. Ancak doğru sonuç için sözleşme tarihi ve kullanılan resmi oran birlikte dikkate alınmalıdır.</p>
<h2>Hangi Araçlar Birlikte Kullanılmalı?</h2>
<p>Doğrudan yeni kira bedelini görmek için <strong>Kira Artış Hesaplama</strong> aracı kullanılmalı. Oranın satın alma gücü etkisini görmek için <strong>Enflasyon Hesaplama</strong> ekranı, kirada kalma ile satın alma arasında karar için ise <strong>Kira mı Konut Kredisi mi?</strong> aracı birlikte kullanılabilir.</p>`,
  },
  {
    slug: "eurobond-getirisi-nasil-hesaplanir",
    title: "Eurobond Getirisi Nasıl Hesaplanır? Kupon, İskonto ve Vadeye Kadar Getiri Rehberi",
    description:
      "Eurobond yatırımı nedir, kupon geliri nasıl okunur, iskontolu fiyat vadeye kadar getiriyi nasıl etkiler? Eurobond yatırımcısı için pratik rehber.",
    category: "Finans",
    categorySlug: "finansal-hesaplamalar",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 7,
    relatedCalculators: ["eurobond-hesaplama", "eurobond-getiri-hesaplama", "tahvil-hesaplama", "bono-hesaplama"],
    keywords: ["eurobond hesaplama", "eurobond getirisi", "kupon geliri", "vadeye kadar getiri", "eurobond nedir"],
    content: `<h2>Eurobond Getirisini Sadece Kupon Oranı Belirlemez</h2>
<p>Bir eurobond yatırımında görülen kupon oranı önemlidir; ancak toplam getiriyi tek başına açıklamaz. Tahvili nominal değerin altında ya da üstünde almanız, vade sonuna kadar bekleyip beklememeniz ve döviz kurunun TL karşılığı üzerindeki etkisi sonucu ciddi biçimde değiştirir.</p>
<h2>Kupon Geliri Nedir?</h2>
<p>Kupon, tahvilin belirli aralıklarla ödediği faiz geliridir. Yatırımcılar çoğu zaman ilk olarak bu oranı görür. Fakat tahvil fiyatı iskontolu ise yalnızca kupon değil, vade sonunda nominal değere yaklaşmadan doğan bir fiyat kazancı da oluşabilir.</p>
<h2>Vadeye Kadar Getiri Neden Daha Anlamlıdır?</h2>
<p>Vadeye kadar getiri, tahvilin alış fiyatı, kupon ödemeleri, ödeme sıklığı ve kalan vadesini birlikte dikkate alan daha bütüncül bir ölçüdür. Bu nedenle eurobondları karşılaştırırken çoğu durumda kupon oranından daha güçlü bir göstergedir.</p>
<h2>Kur Riski Nasıl Düşünülmeli?</h2>
<ul>
  <li>Getiri dolar veya euro bazında olumlu olabilir.</li>
  <li>TL karşılığı sonuç, vade boyunca kur hareketinden etkilenir.</li>
  <li>Aynı tahvil, farklı yatırımcı için farklı yerel para sonucu doğurabilir.</li>
</ul>
<h2>Örnek Okuma</h2>
<p>Nominal değeri 1.000 dolar olan bir eurobond 920 dolardan alınıyorsa, kupon gelirine ek olarak iskontodan doğan potansiyel kazanç da vardır. Tahvil 1.000 dolara doğru yaklaştıkça vadeye kadar getiri yükselmiş görünür. Ancak ara dönemde fiyat dalgalanması ve kur oynaklığı sonuç üzerinde etkili olabilir.</p>
<h2>Hangi Araçlar Birlikte Kullanılmalı?</h2>
<p>Detaylı nakit akışı ve döviz/TL görünümü için <strong>Eurobond Hesaplama</strong>, hızlı kupon ve yaklaşık getiri için <strong>Eurobond Getiri Hesaplama</strong> kullanılabilir. Benzer sabit getirili enstrüman mantığını kıyaslamak için <strong>Tahvil</strong> ve <strong>Bono</strong> araçları da yararlı olur.</p>`,
  },
  {
    slug: "kredi-karti-faizi-asgari-odeme-ve-yapilandirma-rehberi",
    title: "Kredi Kartı Faizi, Asgari Ödeme ve Yapılandırma Rehberi: Borcu Büyütmeden Ne Yapmalı?",
    description:
      "Kredi kartı asgari ödeme tutarı nasıl oluşur, gecikme faizi ne zaman işler, yapılandırma ne zaman mantıklı olur? Kart borcu için pratik rehber.",
    category: "Finans",
    categorySlug: "finansal-hesaplamalar",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 7,
    relatedCalculators: ["kredi-karti-gecikme-faizi-hesaplama", "kredi-karti-asgari-odeme", "kredi-karti-asgari-odeme-tutari-hesaplama", "kredi-yapilandirma-hesaplama"],
    keywords: ["kredi kartı asgari ödeme", "kredi kartı gecikme faizi", "kart borcu yapılandırma", "asgari tutar nasıl hesaplanır", "kart borcu yönetimi"],
    content: `<h2>Asgari Ödeme Neden Sadece Geçici Bir Nefes Alanıdır?</h2>
<p>Kredi kartı ekstresinde görülen asgari ödeme tutarı, yasal olarak gecikmeye düşmemeniz için gereken minimum ödemedir. Fakat sadece asgari tutarı ödemek çoğu zaman kalan anaparanın daha uzun süre taşınmasına ve faiz yükünün büyümesine neden olur.</p>
<h2>Gecikme Faizi Ne Zaman Oluşur?</h2>
<p>Son ödeme tarihinde gerekli tutar ödenmezse gecikme faizi ve ilgili maliyetler devreye girebilir. Burada önemli olan, borcun hangi kısmının taşındığı ve bunun sonraki ekstrelerde nasıl bir yük oluşturduğudur. Kart borcunda küçük görünen gecikmeler, birkaç dönem sonra ciddi toplam maliyete dönüşebilir.</p>
<h2>Asgari Tutar ile Toplam Borç Arasındaki Fark Nasıl Okunmalı?</h2>
<ul>
  <li>Asgari tutar düşük görünse de kalan borç taşınır.</li>
  <li>Taşınan bakiye, sonraki dönemlerde faiz baskısı yaratır.</li>
  <li>Ek taksit veya taksitlendirme her zaman daha ucuz olmayabilir.</li>
</ul>
<h2>Yapılandırma Ne Zaman Mantıklı Olur?</h2>
<p>Birden fazla dönem boyunca yalnızca asgari ödeme yapılıyorsa, borcun vade ve taksit planı ile yeniden yapılandırılması nakit akışı açısından daha okunabilir bir tablo oluşturabilir. Ancak burada amaç sadece aylık ödemeyi azaltmak değil, toplam maliyeti de görmek olmalıdır.</p>
<h2>Örnek Yaklaşım</h2>
<p>20.000 TL kart borcunda yalnızca asgari ödeme yapmak ile aynı borcu kontrollü bir taksit planına bağlamak farklı sonuçlar doğurur. İlk yöntem kısa süreli rahatlama sağlarken, ikinci yöntem maliyeti daha şeffaf görmeyi sağlayabilir. En doğru karar, faiz yükü ve ödeme gücü birlikte ölçülerek verilmelidir.</p>
<h2>Hangi Araçlar Birlikte Kullanılmalı?</h2>
<p>Önce <strong>Kredi Kartı Asgari Ödeme</strong> veya <strong>Asgari Ödeme Tutarı</strong> aracıyla minimum eşiği görün. Sonra <strong>Kredi Kartı Gecikme Faizi Hesaplama</strong> ekranında gecikme senaryosunu test edin. Borç birikmişse <strong>Kredi Yapılandırma Hesaplama</strong> aracıyla daha kontrollü ödeme planı oluşturun.</p>`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return articles.map((a) => a.slug);
}

export function getArticlesByCategorySlug(categorySlug: string): Article[] {
  return articles.filter((article) => article.categorySlug === categorySlug);
}

export function getArticlesByCalculatorSlug(calculatorSlug: string): Article[] {
  return articles.filter((article) => (article.relatedCalculators ?? []).includes(calculatorSlug));
}

export function getRelatedArticlesForCalculator(
  calculatorSlug: string,
  categorySlug: string
): Article[] {
  const directMatches = getArticlesByCalculatorSlug(calculatorSlug);
  const categoryMatches = getArticlesByCategorySlug(categorySlug);

  return Array.from(
    new Map(
      [...directMatches, ...categoryMatches].map((article) => [article.slug, article])
    ).values()
  );
}
