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
    updatedAt: "2026-03-27",
    readingTime: 9,
    relatedCalculators: ["kidem-tazminati-hesaplama", "ihbar-tazminati-hesaplama", "maas-hesaplama"],
    keywords: ["kıdem tazminatı", "kıdem tazminatı hesaplama", "kıdem tazminatı tavanı 2026", "kıdem tazminatı nasıl hesaplanır"],
    content: `<h2>Kıdem Tazminatı Hesaplama Rehberi: Kıdem Tazminatı Nedir?</h2>
<p>Kıdem tazminatı, 4857 sayılı İş Kanunu kapsamındaki bir çalışanın aynı işverene bağlı işyerinde en az <strong>1 yıl</strong> çalıştıktan sonra kanunda sayılan uygun fesih nedenlerinden biriyle ayrılması halinde doğan bir haktır. Temel mantık çok nettir: her tam hizmet yılı için <strong>30 günlük giydirilmiş brüt ücret</strong> esas alınır. Ancak uygulamada yalnızca son çıplak maaşa bakmak çoğu zaman hatalı sonuç verir. Düzenli yol yardımı, yemek yardımı, sürekli prim veya para ile ölçülebilen yan haklar da kıdem hesabının tabanına girebilir.</p>
<p>Bu nedenle ilk bakışta basit gibi görünen kıdem tazminatı hesaplama işlemi, gerçekte üç ayrı soruya dayanır: çalışan kıdeme hak kazanıyor mu, hesaplamada hangi ücret esas alınacak ve bulunan tutar <strong>2026 kıdem tazminatı tavanı</strong> ile sınırlanacak mı? Hızlı bir sonuç görmek isterseniz <a href="/maas-ve-vergi/kidem-tazminati-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kıdem Tazminatı Hesaplama</a> aracımız, fesih tarihi ve ücret bilgilerinize göre aynı mantığı otomatik uygular. Çıkış senaryonuzda bildirim süresi de tartışmalıysa <a href="/maas-ve-vergi/ihbar-tazminati-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">İhbar Tazminatı Hesaplama</a> ekranını, son ücretinizi netleştirmek için de <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Maaş Hesaplama</a> aracını birlikte kullanmak en sağlıklı yoldur.</p>
<h2>Kıdem Tazminatı Hesaplama Şartları: Kimler Kıdem Tazminatı Alabilir?</h2>
<p>Kıdem tazminatı her işten ayrılışta otomatik doğmaz. Öncelikle aynı işverene bağlı çalışma süresinin en az 1 yıl olması gerekir. Bunun yanında fesih nedeninin de uygun olması gerekir. En sık karşılaşılan hak kazanma halleri şunlardır:</p>
<ul>
  <li>İşverenin haklı neden olmaksızın işçiyi işten çıkarması</li>
  <li>Çalışanın ücretin ödenmemesi, mobbing, sağlık veya ahlak ve iyi niyet kurallarına aykırılık gibi haklı nedenle feshi</li>
  <li>Erkek çalışanlar için askerlik nedeniyle ayrılış</li>
  <li>Emeklilik, yaş dışındaki emeklilik koşullarının tamamlanması veya 15 yıl 3600 gün şartının sağlanması</li>
  <li>Kadın çalışanlarda evlilik tarihinden itibaren 1 yıl içinde işten ayrılış</li>
  <li>Çalışanın ölümü halinde mirasçılarının talebi</li>
</ul>
<p>Buna karşılık sıradan bir istifa, yani haklı nedene dayanmayan ve kanundaki özel hallere girmeyen ayrılış, çoğu durumda kıdem hakkı doğurmaz. Bu ayrım özellikle bordro ve fesih sürecinde kritik olduğu için çalışanların çıkış kodu ile kıdem hakkını karıştırmaması gerekir. Çıkış öncesi son aylık ücretinizin hangi seviyede olduğunu anlamak için <a href="/maas-ve-vergi/asgari-ucret-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Asgari Ücret 2026</a> ve <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Maaş Hesaplama</a> sayfaları da iyi bir referans verir.</p>
<h2>2026 Kıdem Tazminatı Tavanı ve Giydirilmiş Brüt Ücret</h2>
<p>1 Ocak 2026 ile 30 Haziran 2026 dönemi için sitedeki hesaplayıcılarda esas alınan <strong>kıdem tazminatı tavanı 64.948,77 TL</strong>'dir. Bu şu anlama gelir: çalışanın giydirilmiş brüt ücreti bu tutarın altında ise gerçek ücretiyle hesap yapılır; üzerindeyse her bir hizmet yılı için en fazla 64.948,77 TL dikkate alınır. Yani 90.000 TL brüt ücret alan bir çalışan için kıdem hesabı 90.000 TL üzerinden değil, tavan tutar üzerinden yürür.</p>
<p>Buradaki ikinci kritik kavram <strong>giydirilmiş ücret</strong>tir. Birçok çalışan yalnızca sözleşmedeki brüt maaşını baz alır; oysa sürekli nitelikteki para veya para ile ölçülebilir menfaatler de hesaplamaya dahil olabilir. Örneğin her ay düzenli ödenen 3.000 TL yemek yardımı ve 2.000 TL yol yardımı varsa, 45.000 TL çıplak brüt maaşın giydirilmiş karşılığı 50.000 TL seviyesine çıkabilir. Bu yüzden özellikle yüksek primli veya yan haklı işlerde sonuç, sadece maaş bordrosuna bakılarak bulunduğunda eksik kalır.</p>
<h2>Kıdem Tazminatı Hesaplama Formülü Nasıl Uygulanır?</h2>
<p>Kıdem tazminatı formülü sade biçimde şöyle okunabilir:</p>
<p><code>Kıdem Tazminatı = Giydirilmiş Brüt Ücret x Toplam Hizmet Süresi (yıl)</code></p>
<p>Burada hizmet süresi yalnızca tam yıldan ibaret değildir. Artan ay ve günler de oransal biçimde hesaba katılır. Örneğin 5 yıl 6 ay çalışan biri için süre <strong>5,5 yıl</strong>, 2 yıl 3 ay çalışan biri için <strong>2,25 yıl</strong> olarak değerlendirilir. Hesaplanan brüt tutardan ise gelir vergisi kesilmez; yalnızca <strong>binde 7,59 damga vergisi</strong> düşülerek yaklaşık net tutara ulaşılır. Bu yönüyle kıdem tazminatı, ihbar tazminatından ayrılır. İhbar tarafında gelir vergisi etkisi gündeme gelebilirken kıdemde ana vergi kalemi damga vergisidir.</p>
<p>Bu mantığı elle uygulamak mümkündür; ancak hizmet süresi, yan haklar ve tavan sınırı bir araya geldiğinde hata payı büyür. Bu yüzden önce <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Maaş Hesaplama</a> ile aylık brüt tabanı netleştirip, ardından <a href="/maas-ve-vergi/kidem-tazminati-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kıdem Tazminatı Hesaplama</a> ve gerekiyorsa <a href="/maas-ve-vergi/ihbar-tazminati-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">İhbar Tazminatı Hesaplama</a> araçlarını birlikte çalıştırmak pratikte çok daha güvenlidir.</p>
<h2>Kıdem Tazminatı Örnek Hesaplama: 50.000 TL Brüt Ücretle 5 Yıl 6 Ay</h2>
<p>İlk örnekte çalışanın giydirilmiş brüt ücreti tavanın altında olsun. Son aylık giydirilmiş brüt ücret <strong>50.000 TL</strong>, toplam çalışma süresi ise <strong>5 yıl 6 ay</strong> yani 5,5 yıl kabul edilsin.</p>
<ul>
  <li>Giydirilmiş brüt ücret: 50.000 TL</li>
  <li>Hizmet süresi: 5,5 yıl</li>
  <li>Brüt kıdem tazminatı: 50.000 x 5,5 = <strong>275.000 TL</strong></li>
  <li>Damga vergisi: 275.000 x 0,00759 = <strong>2.087,25 TL</strong></li>
  <li>Yaklaşık net kıdem tazminatı: 275.000 - 2.087,25 = <strong>272.912,75 TL</strong></li>
</ul>
<p>Bu örnek, bordro ve yan hakların doğru girildiği bir senaryoda işçinin eline geçecek yaklaşık net tutarı gösterir. Eğer düzenli prim veya sosyal yardım varsa bu taban daha da değişebilir.</p>
<h2>Kıdem Tazminatı Örnek Hesaplama: Tavanı Aşan Ücrette 2026 Tavan Etkisi</h2>
<p>Şimdi de tavan etkisini görelim. Çalışanın giydirilmiş brüt ücreti <strong>80.000 TL</strong>, hizmet süresi <strong>4 yıl</strong> olsun. Burada 80.000 TL'nin tamamı kullanılamaz; çünkü 1 Ocak 2026-30 Haziran 2026 dönemi için tavan 64.948,77 TL'dir.</p>
<ul>
  <li>Gerçek giydirilmiş ücret: 80.000 TL</li>
  <li>Hesapta kullanılacak ücret: <strong>64.948,77 TL</strong></li>
  <li>Brüt kıdem tazminatı: 64.948,77 x 4 = <strong>259.795,08 TL</strong></li>
  <li>Damga vergisi: 259.795,08 x 0,00759 = <strong>1.971,84 TL</strong></li>
  <li>Yaklaşık net kıdem tazminatı: 259.795,08 - 1.971,84 = <strong>257.823,24 TL</strong></li>
</ul>
<p>Bu örnekten çıkarılacak en önemli sonuç şudur: yüksek ücretli çalışanlarda kıdem hesabı, çıplak maaşın büyüklüğünden çok <strong>tavanın hangi dönemde ne olduğu</strong> ile şekillenir. Bu yüzden fesih tarihi birkaç gün bile değişse sonuç farklılaşabilir.</p>
<h2>Kıdem Tazminatı ile İhbar Tazminatı Arasındaki Fark Nedir?</h2>
<p>Kıdem ve ihbar tazminatı sıkça birbiriyle karıştırılır; oysa doğuş nedenleri ve hesap mantıkları farklıdır. Kıdem tazminatı, hizmet süresine bağlı bir hak olarak doğar. İhbar tazminatı ise fesihte yasal bildirim süresine uyulmamasının sonucudur. Bir çalışan hem kıdem hem ihbar alabilir, sadece birini alabilir ya da hiçbirine hak kazanmayabilir. Örneğin 4 yıldır çalışan bir işçi haksız biçimde hemen işten çıkarılırsa hem kıdem hem de 8 haftalık ihbar gündeme gelebilir.</p>
<p>Bu nedenle işten çıkış sürecini tek ekranda değerlendirmek isteyenler için en doğru yöntem, <a href="/maas-ve-vergi/kidem-tazminati-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kıdem Tazminatı Hesaplama</a> ile <a href="/maas-ve-vergi/ihbar-tazminati-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">İhbar Tazminatı Hesaplama</a> araçlarını aynı senaryoda birlikte çalıştırmaktır. Son bordro tabanını görmek için de <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Maaş Hesaplama</a> kullanıldığında uyuşmazlık riski ciddi biçimde azalır.</p>
<h2>Kıdem Tazminatı Hesaplama İçin Pratik Kontrol Listesi</h2>
<ul>
  <li>İşe giriş ve çıkış tarihinizi gün/ay/yıl olarak netleştirin.</li>
  <li>Son aylık çıplak brüt maaşın yanında düzenli yemek, yol, prim gibi ödemeleri ayrı yazın.</li>
  <li>Çıkış nedeninizin kıdem doğurup doğurmadığını kontrol edin.</li>
  <li>Fesih tarihinin hangi <strong>2026 kıdem tazminatı tavanı</strong> dönemine denk geldiğini teyit edin.</li>
  <li>Brüt tutardan yalnızca damga vergisi kesildiğini unutmayın.</li>
</ul>
<p>Bu beş adımın herhangi birinde hata yapılması, özellikle yüksek ücret ve uzun hizmet süresinde on binlerce liralık fark yaratabilir. Bu yüzden otomatik hesaplayıcı ile sözleşme/bordro karşılaştırmasını birlikte yürütmek önemlidir.</p>
<h2>Kıdem Tazminatı Hakkında Sık Sorulan Sorular</h2>
<h3>1. 1 yıldan az çalışan kıdem tazminatı alabilir mi?</h3>
<p>Kural olarak hayır. Aynı işverene bağlı çalışma süresi 1 yılı doldurmamışsa kıdem tazminatı hakkı doğmaz. Ancak başka alacak kalemleri, örneğin ücret, fazla mesai veya izin ücreti ayrı bir konu olarak varlığını koruyabilir.</p>
<h3>2. İstifa eden çalışan kıdem tazminatı alır mı?</h3>
<p>Normal bir istifada çoğu zaman alamaz. Fakat askerlik, emeklilik, 15 yıl 3600 gün, kadın çalışanlarda evlilik nedeniyle ayrılış veya haklı nedenle fesih gibi özel hallerde kıdem doğabilir.</p>
<h3>3. Kıdem tazminatında gelir vergisi kesilir mi?</h3>
<p>Hayır. Kıdem tazminatında temel kesinti kalemi damga vergisidir. Bu nedenle brüt ve net tutar arasındaki fark, ücret bordrolarına göre çok daha sınırlıdır.</p>
<h3>4. Kıdem tazminatı tavanı ne zaman önem kazanır?</h3>
<p>Giydirilmiş brüt ücretiniz tavanın üzerine çıktığında önem kazanır. 1 Ocak 2026-30 Haziran 2026 döneminde bu sınır 64.948,77 TL olarak uygulanır; üzerindeki ücretler hesapta tavanla sınırlanır.</p>
<h3>5. Yemek ve yol parası kıdem hesabına girer mi?</h3>
<p>Düzenli ve süreklilik arz eden parasal menfaatler çoğu durumda giydirilmiş brüt ücretin parçası sayılır. Ancak tek seferlik, düzensiz veya belgeye dayanmayan ödemelerde tartışma çıkabileceği için bordro ve sözleşmenin birlikte değerlendirilmesi gerekir.</p>`,
  },
  {
    slug: "brut-net-maas-farki",
    title: "Brüt Maaş ile Net Maaş Arasındaki Fark: SGK, Gelir Vergisi ve Damga Vergisi",
    description:
      "Brüt maaşınızdan ne kadar kesinti yapıldığını hiç merak ettiniz mi? SGK, işsizlik sigortası, gelir vergisi ve damga vergisi kalemlerini bu rehberle öğrenin.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-27",
    readingTime: 9,
    relatedCalculators: ["maas-hesaplama", "asgari-ucret-hesaplama", "gelir-vergisi-hesaplama"],
    keywords: ["brüt net maaş farkı", "maaş kesintileri", "SGK kesintisi", "gelir vergisi 2026", "net maaş hesaplama"],
    content: `<h2>Brüt Net Maaş Farkı Neden Oluşur?</h2>
<p>Brüt maaş ile net maaş arasındaki fark, işverenin sözleşmede belirttiği toplam ücret ile çalışanın hesabına geçen gerçek tutar arasındaki kesintilerden doğar. Türkiye'de bu kesintilerin ana kalemleri <strong>SGK işçi payı</strong>, <strong>işsizlik sigortası işçi payı</strong>, <strong>gelir vergisi</strong> ve belirli şartlarda <strong>damga vergisi</strong>dir. Dolayısıyla iş sözleşmesinde gördüğünüz 50.000 TL ile bankaya yatan 50.000 TL aynı şey değildir; aradaki fark, yıl içindeki kümülatif vergi durumu ve asgari ücret istisnası gibi unsurlara göre şekillenir.</p>
<p>2026 yılında bu konu daha da önemli hale geldi; çünkü 1 Ocak 2026 itibarıyla resmi asgari ücret <strong>brüt 33.030 TL</strong>, <strong>net 28.075,50 TL</strong> olarak açıklandı. Ücretliler için gelir vergisi istisnası ve asgari ücret düzeyine kadar damga vergisi muafiyeti sürdüğü için, aynı brüt maaşta bile çalışanların eline geçen net tutar geçmiş yıllara göre farklı hesaplanıyor. Kendi bordronuzu anında görmek için <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Maaş Hesaplama</a> aracını, taban ücretle kıyas yapmak için <a href="/maas-ve-vergi/asgari-ucret-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Asgari Ücret 2026</a> ekranını, yıllık tarife etkisini görmek için de <a href="/maas-ve-vergi/gelir-vergisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Gelir Vergisi Hesaplama</a> sayfasını birlikte kullanabilirsiniz.</p>
<h2>Brüt Maaş ve Net Maaş Nedir?</h2>
<p><strong>Brüt maaş</strong>, işverenin sizin adınıza bordroya yazdığı toplam ücret tutarıdır. Bu tutarın içinde henüz işçi kesintileri düşülmemiştir. <strong>Net maaş</strong> ise SGK, işsizlik sigortası, gelir vergisi ve varsa damga vergisi düşüldükten sonra hesabınıza geçen gerçek ödemedir. Bu iki kavramı karıştırmak, özellikle iş görüşmesi, zam pazarlığı, teklif karşılaştırması ve tazminat hesabı sırasında ciddi hata yaratır.</p>
<p>Örneğin bir işveren size "50.000 TL maaş" dediğinde bunun brüt mü net mi olduğunu hemen netleştirmeniz gerekir. Brüt teklifse, elinize geçecek tutar daha düşüktür. Net teklifse, işverenin katlandığı toplam maliyet daha yüksektir. Bu yüzden ücret konuşurken "brüt" ve "net" ibareleri küçük bir ayrıntı değil, pazarlığın ana eksenidir.</p>
<h2>2026 Brüt Net Maaş Kesintileri: SGK, İşsizlik, Gelir Vergisi ve Damga Vergisi</h2>
<p>Hesapmod araçlarında kullanılan 2026 çalışan kesintileri şu temel oranlara dayanır:</p>
<table>
  <thead><tr><th>Kesinti Kalemi</th><th>2026 Oranı</th><th>Açıklama</th></tr></thead>
  <tbody>
    <tr><td>SGK İşçi Payı</td><td>%14</td><td>Emeklilik ve genel sağlık sigortası işçi kesintisi</td></tr>
    <tr><td>İşsizlik Sigortası İşçi Payı</td><td>%1</td><td>Çalışan adına kesilen işsizlik primi</td></tr>
    <tr><td>Gelir Vergisi</td><td>%15-%40</td><td>Kümülatif yıllık matraha göre artan oranlı yapı</td></tr>
    <tr><td>Damga Vergisi</td><td>%0,759</td><td>Asgari ücreti aşan kısım için uygulanan bordro vergisi</td></tr>
  </tbody>
</table>
<p>Burada dikkat edilmesi gereken nokta şudur: her çalışan için gelir vergisi kesintisi aynı düzeyde gerçekleşmez. Çünkü vergi matrahı yıl içinde birikir. Aynı brüt ücretle ocak ayında bordroya giren çalışan ile yılın son çeyreğinde üst dilime yaklaşan çalışan aynı net sonucu görmeyebilir. Ayrıca asgari ücretin vergi istisnası, tüm ücretliler için belirli bir koruma sağlar; yani sadece asgari ücretliler değil, daha yüksek ücret alanlar da bu istisnadan yararlanır.</p>
<h2>2026 Gelir Vergisi Tarifesi Ücretliler İçin Nasıl Okunur?</h2>
<p>Gelir İdaresi Başkanlığı'nın 2026 ücret geliri rehberinde yer alan güncel tarife, ücret gelirlerinde yıllık matrah için şu basamakları gösterir: <strong>190.000 TL'ye kadar %15</strong>, <strong>400.000 TL'ye kadar %20</strong>, <strong>1.500.000 TL'ye kadar %27</strong>, <strong>5.300.000 TL'ye kadar %35</strong> ve üzeri için <strong>%40</strong>. Ancak çalışan açısından kritik nokta, bordroda görülen gelir vergisinin bu basamaklara doğrudan çıplak maaşla değil, SGK ve işsizlik kesintileri düşülmüş vergi matrahıyla girmesidir.</p>
<p>Bir başka önemli nokta da asgari ücret istisnasıdır. 2026'da asgari ücretin vergiye esas kısmı, tüm ücretliler için vergiden istisna edildiği için özellikle orta gelir grubunda net maaşı hissedilir biçimde artırır. Aynı şekilde damga vergisi de asgari ücret seviyesine kadar uygulanmaz; yalnızca bu tutarı aşan kısım için hesaplanır. Bu yüzden brüt ücret arttıkça net maaş doğrusal şekilde artmaz; vergi ve damga etkisi farklılaşır.</p>
<h2>Brüt Net Maaş Örnek Hesaplama: 2026 Asgari Ücret</h2>
<p>Önce en temel örnekle başlayalım. 1 Ocak 2026 itibarıyla resmi asgari ücret rakamı <strong>brüt 33.030 TL</strong>, <strong>net 28.075,50 TL</strong> olarak ilan edildi. Bu tutarın basit kırılımı şöyledir:</p>
<ul>
  <li>Brüt ücret: 33.030 TL</li>
  <li>SGK işçi payı: 33.030 x %14 = <strong>4.624,20 TL</strong></li>
  <li>İşsizlik sigortası işçi payı: 33.030 x %1 = <strong>330,30 TL</strong></li>
  <li>Gelir vergisi: <strong>0 TL</strong> (asgari ücret istisnası nedeniyle)</li>
  <li>Damga vergisi: <strong>0 TL</strong> (asgari ücret düzeyine kadar muafiyet nedeniyle)</li>
  <li>Net ücret: 33.030 - 4.624,20 - 330,30 = <strong>28.075,50 TL</strong></li>
</ul>
<p>Bu örnek, 2026 brüt net maaş farkının en çıplak halini gösterir. İşçi açısından toplam kesinti 4.954,50 TL seviyesindedir; ancak gelir vergisi ve damga vergisinin sıfırlanması net tutarı korur.</p>
<h2>Brüt Net Maaş Örnek Hesaplama: 50.000 TL Brüt Maaş</h2>
<p>Şimdi daha tipik bir beyaz yaka örneğine geçelim. Aylık brüt maaşın <strong>50.000 TL</strong> olduğunu varsayalım. Hesapmod'un 2026 maaş hesaplama mantığına göre yaklaşık tablo şöyledir:</p>
<ul>
  <li>SGK işçi payı: 50.000 x %14 = <strong>7.000 TL</strong></li>
  <li>İşsizlik sigortası işçi payı: 50.000 x %1 = <strong>500 TL</strong></li>
  <li>Aylık vergi matrahı: 50.000 - 7.000 - 500 = <strong>42.500 TL</strong></li>
  <li>Yıllıklaştırılmış matrah: 42.500 x 12 = <strong>510.000 TL</strong></li>
  <li>Asgari ücret istisnası düşüldükten sonra aylık gelir vergisi: <strong>3.526,57 TL</strong></li>
  <li>Damga vergisi: (50.000 - 33.030) x 0,00759 = <strong>128,80 TL</strong></li>
  <li>Toplam kesinti: <strong>11.155,37 TL</strong></li>
  <li>Yaklaşık net maaş: 50.000 - 11.155,37 = <strong>38.844,63 TL</strong></li>
</ul>
<p>Bu örnekten görüldüğü gibi 50.000 TL brüt maaşta çalışan, maaşının yaklaşık 38.844,63 TL'sini net olarak alır. Kümülatif matrah yılın ilerleyen aylarında üst dilimlere taşındıkça bu tutarda küçük değişimler olabilir; özellikle tek ayı değil, tüm yıl akışını görmek için <a href="/maas-ve-vergi/gelir-vergisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Gelir Vergisi Hesaplama</a> ekranı faydalıdır.</p>
<h2>Brüt Net Maaş Örnek Hesaplama: 80.000 TL Brüt Maaş</h2>
<p>Üst gelir grubunda vergi etkisini daha net görmek için <strong>80.000 TL brüt</strong> örneğine bakalım:</p>
<ul>
  <li>SGK işçi payı: 80.000 x %14 = <strong>11.200 TL</strong></li>
  <li>İşsizlik işçi payı: 80.000 x %1 = <strong>800 TL</strong></li>
  <li>Aylık vergi matrahı: <strong>68.000 TL</strong></li>
  <li>Asgari ücret istisnası sonrası aylık gelir vergisi: <strong>10.411,57 TL</strong></li>
  <li>Damga vergisi: (80.000 - 33.030) x 0,00759 = <strong>356,50 TL</strong></li>
  <li>Yaklaşık net maaş: <strong>57.231,93 TL</strong></li>
</ul>
<p>Bu tablo brüt maaş yükseldikçe farkın sadece nominal olarak değil, oran olarak da büyüyebildiğini gösterir. Bu yüzden yüksek ücretlerde "elde kaç kalır?" sorusu, zam pazarlığında tek başına brüt rakam söylemekten daha önemlidir.</p>
<h2>Netten Brüte Maaş Hesaplama Ne Zaman Gerekir?</h2>
<p>İş görüşmelerinde veya freelance-den-çalışan dönüşümünde çoğu kişi eline geçmesini istediği net tutarı bilir; fakat bunun işverene kaç liralık brüt yük oluşturacağını bilmez. İşte <strong>netten brüte maaş hesaplama</strong> tam burada devreye girer. Örneğin "Benim hesabıma 45.000 TL geçsin" diyen bir çalışan için işverenin hangi brüt rakamı bordroya yazması gerektiği, aynı kesinti mekanizmasının tersten çözülmesiyle bulunur.</p>
<p>Hesapmod'da bu işlem için ayrı bir mantık yazılmış durumda; <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Maaş Hesaplama</a> aracında brütten nete ve netten brüte senaryoları aynı ekran üzerinden test edebilirsiniz. Bu özellikle yeni teklif, zam pazarlığı, yıllık bütçe planı ve işveren maliyeti tahmini için çok kullanışlıdır.</p>
<h2>Brüt Net Maaş Farkını Doğru Okumak İçin Hangi Araçlar Kullanılmalı?</h2>
<p>Pratikte en iyi yöntem şudur: önce <a href="/maas-ve-vergi/maas-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Maaş Hesaplama</a> ile aylık brüt-net sonucu görün. Sonra taban ücret karşılaştırması için <a href="/maas-ve-vergi/asgari-ucret-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Asgari Ücret 2026</a> sayfasına bakın. Son aşamada, yılın ilerleyen aylarında dilim değişiminin bütçenizi nasıl etkileyebileceğini anlamak için <a href="/maas-ve-vergi/gelir-vergisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Gelir Vergisi Hesaplama</a> aracıyla toplam vergi yükünü test edin. Damga kalemini ayrıca görmek isterseniz <a href="/maas-ve-vergi/damga-vergisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Damga Vergisi Hesaplama</a> sayfası da iyi bir tamamlayıcıdır.</p>
<h2>Brüt Net Maaş Farkı Hakkında Sık Sorulan Sorular</h2>
<h3>1. Brüt maaş mı daha önemli, net maaş mı?</h3>
<p>İkisi de önemlidir; ancak çalışan açısından günlük yaşamı belirleyen tutar nettir. Buna karşılık sözleşme, kıdem ve işveren maliyeti açısından brüt ücret esas alınır.</p>
<h3>2. 2026'da asgari ücretin gelir vergisi var mı?</h3>
<p>Hayır. 1 Ocak 2026 itibarıyla açıklanan brüt 33.030 TL asgari ücret için gelir vergisi istisnası uygulanır. Bu nedenle asgari ücretlinin bordrosunda gelir vergisi kalemi sıfırlanır.</p>
<h3>3. Damga vergisi herkes için kesiliyor mu?</h3>
<p>Asgari ücret seviyesine kadar olan kısım damga vergisinden muaftır. Brüt ücretiniz asgari ücretin üzerine çıktığında, aşan bölüm için binde 7,59 oranı devreye girer.</p>
<h3>4. Aynı brüt maaş yılın her ayında aynı neti verir mi?</h3>
<p>Her zaman değil. Çünkü gelir vergisi kümülatif matrah mantığıyla ilerler. Yıl içinde üst dilime geçen çalışanların net maaşında dönemsel farklılık görülebilir.</p>
<h3>5. Netten brüte hesaplama neden gereklidir?</h3>
<p>Teklif pazarlığında, işveren maliyeti planlamasında ve "hesabıma şu kadar geçsin" hedefiyle görüşme yaparken gereklidir. Net hedefi brüte çevirmek, yanlış pazarlık yapılmasını önler.</p>`,
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
    updatedAt: "2026-03-27",
    readingTime: 8,
    relatedCalculators: ["kira-artis-hesaplama", "enflasyon-hesaplama", "kira-mi-konut-kredisi-mi-hesaplama"],
    keywords: ["kira artış oranı", "tüfe kira artışı", "yeni kira hesaplama", "2026 kira zammı", "kira artış hesabı"],
    content: `<h2>2026 Kira Artış Oranı Nedir ve Kira Artış Hesaplama Neden Karışır?</h2>
<p>Kira artış oranı, sözleşme yenileme döneminde mevcut kira bedelinin hangi resmi veriyle ve hangi sınırlar içinde artırılacağını gösterir. Teoride basit görünür; ancak pratikte "aylık enflasyon", "yıllık TÜFE", "12 aylık ortalama" ve "sözleşme ayı" kavramları birbirine karıştırıldığı için hatalı zam oranları çok sık ortaya çıkar. Özellikle ev sahibi ile kiracı arasında en fazla gerilim yaratan başlıklardan biri, doğru oranın yanlış ay verisiyle uygulanmasıdır.</p>
<p>2026 yılında da temel referans, sözleşme yenileme ayına göre izlenen <strong>TÜFE 12 aylık ortalama</strong> mantığıdır. TÜİK'in Şubat 2026 bülteninde aylık TÜFE değişimi <strong>%2,96</strong>, yıllık TÜFE değişimi <strong>%31,53</strong> olarak açıklanırken; kira artışı tartışmasında asıl bakılan gösterge bunlardan farklıdır. Mart 2026 yenilemeleri için sitedeki kira aracı <strong>%33,39</strong> referansını kullanır. Bu ayrımı anlamadan yapılan her hesap, eksik veya fazla artışa yol açabilir.</p>
<p>Hızlı ve doğru hesap için <a href="/finansal-hesaplamalar/kira-artis-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kira Artış Hesaplama</a> aracımızı kullanabilir, genel fiyat etkisini görmek için <a href="/finansal-hesaplamalar/enflasyon-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Enflasyon Hesaplama</a> ekranını açabilir ve uzun vadede kirada kalmak mı yoksa satın almak mı daha mantıklı diye bakmak için <a href="/finansal-hesaplamalar/kira-mi-konut-kredisi-mi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kira mı Konut Kredisi mi?</a> aracını birlikte değerlendirebilirsiniz.</p>
<h2>Kira Artış Oranı Hesaplama İçin Hangi TÜFE Verisi Kullanılır?</h2>
<p>En sık yapılan hata, kira artışında manşet yıllık TÜFE oranını doğrudan uygulamaktır. Oysa kira artışında konuşulan oran ile haberlerde yer alan yıllık enflasyon aynı olmayabilir. Bu yüzden "Şubat 2026 yıllık TÜFE %31,53 açıklandı" cümlesi, tek başına "kira zammı %31,53 olacak" anlamına gelmez. Kira sözleşmelerinde esas alınan veri, yenileme dönemindeki <strong>12 aylık ortalama değişim</strong> mantığıdır.</p>
<p>Mart 2026 yenilemelerinde örnek alınan oran <strong>%33,39</strong> seviyesindedir. Bu rakam, yalnızca ilgili yenileme dönemi için anlam taşır. Nisan, Mayıs veya sonraki aylarda sözleşme yenileyecek kiracılar için yeni TÜİK verileri devreye girer. Bu nedenle "arkadaşım şu kadar artırdı, benim de aynı olması gerekir" yaklaşımı doğru değildir; belirleyici olan her zaman <strong>sizin sözleşme ayınız</strong> ve o ay itibarıyla açıklanan resmi veri setidir.</p>
<h2>TÜFE, Aylık Enflasyon ve Yıllık Enflasyon Farkı Nedir?</h2>
<p>Kira artışını doğru yorumlamak için üç kavramı ayırmak gerekir:</p>
<ul>
  <li><strong>Aylık TÜFE:</strong> Bir ayın bir önceki aya göre fiyat değişimini gösterir. Şubat 2026 için bu veri %2,96'dır.</li>
  <li><strong>Yıllık TÜFE:</strong> Aynı ayın geçen yılın aynı ayına göre değişimidir. Şubat 2026 için %31,53 olarak açıklanmıştır.</li>
  <li><strong>12 aylık ortalama:</strong> Kira artışında uygulamada esas alınan ve son 12 ayın ortalama fiyat hareketini yansıtan göstergedir.</li>
</ul>
<p>Bir kiracı yalnızca aylık TÜFE'ye bakarsa gereğinden çok düşük, yalnızca manşet yıllık TÜFE'ye bakarsa bazen yanlış bir oran kullanmış olabilir. Bu nedenle kira artışında haber bültenlerindeki ilk rakama değil, doğrudan yenileme ayına karşılık gelen hesaplanmış orana bakmak gerekir.</p>
<h2>Yeni Kira Bedeli Nasıl Bulunur?</h2>
<p>Temel formül basittir:</p>
<p><code>Yeni Kira = Mevcut Kira x (1 + Artış Oranı)</code></p>
<p>Örneğin artış oranı %33,39 ise bunu ondalık biçimde 0,3339 olarak yazarsınız. Mevcut kira 18.000 TL ise önce artış tutarını bulur, sonra yeni kirayı hesaplarsınız. Ancak hesaplama yalnızca matematik değildir; artışın uygulanacağı ay, sözleşmenin yenileme tarihi ve tarafların daha düşük bir oran üzerinde anlaşıp anlaşmadığı da önemlidir.</p>
<p>Özellikle ev sahipleri çoğu zaman "enflasyon çok yüksek, ben daha fazla artış yaparım" yaklaşımıyla, kiracılar da "haberlerde daha düşük oran gördüm" diyerek farklı verileri baz alabilir. Uyuşmazlığı azaltan en sağlıklı yöntem, oranın neye göre seçildiğini yazılı ve sayısal biçimde göstermek, ardından sonucu <a href="/finansal-hesaplamalar/kira-artis-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kira Artış Hesaplama</a> çıktısıyla teyit etmektir.</p>
<h2>Kira Artış Hesaplama Örneği: 18.000 TL Kira İçin Mart 2026 Artışı</h2>
<p>Bir kiracının mevcut aylık konut kirasının <strong>18.000 TL</strong> olduğunu ve sözleşme yenileme tarihinde Mart 2026 referans oranı olan <strong>%33,39</strong>'un kullanılacağını varsayalım.</p>
<ul>
  <li>Mevcut kira: 18.000 TL</li>
  <li>Artış oranı: %33,39</li>
  <li>Artış tutarı: 18.000 x 0,3339 = <strong>6.010,20 TL</strong></li>
  <li>Yeni kira: 18.000 + 6.010,20 = <strong>24.010,20 TL</strong></li>
</ul>
<p>Bu senaryoda taraflar resmi üst sınırı uygularsa yeni kira 24.010,20 TL olur. Ancak taraflar isterse daha düşük bir artışta anlaşabilir. Dolayısıyla hesaplanan tutar, çoğu durumda yasal üst limitin pratik yansımasıdır.</p>
<h2>Kira Artış Hesaplama Örneği: 25.000 TL Kira İçin Yeni Bedel</h2>
<p>İkinci örnekte mevcut kira <strong>25.000 TL</strong> olsun ve yine %33,39 oranı uygulansın:</p>
<ul>
  <li>Mevcut kira: 25.000 TL</li>
  <li>Artış tutarı: 25.000 x 0,3339 = <strong>8.347,50 TL</strong></li>
  <li>Yeni kira: 25.000 + 8.347,50 = <strong>33.347,50 TL</strong></li>
</ul>
<p>Bu örnek özellikle büyük şehirlerdeki yeni kira yenilemelerinde sık görülüyor. Kiracı açısından sorun genellikle şurada başlıyor: yüzde hesabı sözlü ifade edilirken "sekiz bin civarı artar" deniyor ama gerçek sözleşme tutarı yazılırken kuruşlar ve yuvarlama farkları gözden kaçabiliyor. Bu yüzden sonuç mutlaka hesap makinesi üzerinden açık şekilde yazılmalı.</p>
<h2>İşyeri Kirasında Kira Artış Oranı Nasıl Yorumlanır?</h2>
<p>İşyeri kiralarında da temel mantık artış oranının doğru ay ve veriyle eşleştirilmesidir; ancak ticari ilişkilerde kira stopajı, KDV ve sözleşmeye bağlı özel hükümler gibi ek başlıklar da devreye girebilir. Bu nedenle işyeri kiralarında yalnızca kira artış oranına bakmak yeterli olmayabilir. Nakit çıkışı ve net tahsilatı birlikte okumak daha sağlıklıdır.</p>
<p>Özellikle işyeri kira sözleşmelerinde mal sahibine geçen net rakam ile kiracının toplam nakit yükü farklı olabilir. Bu nedenle işyeri tarafında kira artışına ek olarak <a href="/maas-ve-vergi/kira-stopaj-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kira Stopajı Hesaplama</a> ve gerekiyorsa <a href="/maas-ve-vergi/kira-vergisi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kira Vergisi Hesaplama</a> sayfalarını da kontrol etmek gerekir.</p>
<h2>Kira Artışı mı, Satın Alma mı? 2026'da Uzun Vadeli Karar Nasıl Verilir?</h2>
<p>Kira artış hesabı yalnızca bu ay ne kadar zam yapılacağını gösterir. Oysa hane bütçesi açısından asıl soru çoğu zaman şudur: bu kira artışları devam ederse kirada kalmak mı mantıklı, yoksa konut kredisiyle satın alma seçeneği mi öne çıkar? İşte burada kira artış oranını tek başına değil, faiz, peşinat, taksit ve bakım giderleriyle birlikte okumak gerekir.</p>
<p>Örneğin 25.000 TL kira ödeyen bir hanede yeni tutar 33.347,50 TL'ye çıkıyorsa, bu artışın aile bütçesi üzerindeki etkisi sadece bugünkü fark değildir. Önümüzdeki 12 aylık nakit akışını görmek için <a href="/finansal-hesaplamalar/kira-mi-konut-kredisi-mi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kira mı Konut Kredisi mi?</a> aracıyla senaryo kurmak, kira artışına tek başına tepki vermekten çok daha sağlıklı sonuç verir.</p>
<h2>Kira Artış Oranı İçin Hızlı Kontrol Listesi</h2>
<ul>
  <li>Sözleşme yenileme ayınızı netleştirin.</li>
  <li>O aya karşılık gelen TÜFE 12 aylık ortalama verisini kullanın.</li>
  <li>Aylık TÜFE ile yıllık TÜFE'yi kira artış oranı zannetmeyin.</li>
  <li>Yeni kira bedelini yazılı, kuruşlu ve sayısal şekilde hesaplayın.</li>
  <li>Gerekirse <a href="/finansal-hesaplamalar/kira-artis-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Kira Artış Hesaplama</a> çıktısını sözleşme eki gibi saklayın.</li>
</ul>
<h2>Kira Artış Oranı ve TÜFE Hakkında Sık Sorulan Sorular</h2>
<h3>1. Kira artışında hangi TÜFE oranı kullanılır?</h3>
<p>Genel yorumda esas alınan gösterge 12 aylık ortalama değişimdir. Aylık enflasyon veya manşet yıllık TÜFE tek başına kira artış oranı anlamına gelmez.</p>
<h3>2. Taraflar resmi orandan daha düşük bir artışta anlaşabilir mi?</h3>
<p>Evet. Uygulamada taraflar çoğu zaman üst sınırın altında bir oranla uzlaşabilir. Sorun, resmi veriden daha yüksek talep çıkması veya yanlış ay verisinin uygulanması halinde doğar.</p>
<h3>3. Mart 2026 için referans oran neden %33,39?</h3>
<p>Çünkü Mart 2026 yenilemelerinde esas alınan son TÜİK veri seti üzerinden 12 aylık ortalama değişim bu seviyede okunur. Bir sonraki aylarda bu oran yeni açıklanan verilerle değişebilir.</p>
<h3>4. Yıllık TÜFE %31,53 ise kira zammı neden aynı değil?</h3>
<p>Çünkü yıllık TÜFE ile kira artışında kullanılan 12 aylık ortalama aynı gösterge değildir. Haberlerde duyduğunuz yıllık enflasyon oranı, kira sözleşmesi hesabında doğrudan kullanılamaz.</p>
<h3>5. İşyeri kirasında sadece artış oranına bakmak yeterli mi?</h3>
<p>Hayır. İşyeri kiralarında stopaj, KDV ve sözleşme hükümleri de toplam maliyeti etkileyebilir. Bu nedenle kira artışını tek başına değil, toplam nakit çıkışıyla birlikte değerlendirmek gerekir.</p>`,
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
    slug: "eurobond-vergi-hesaplama-2026",
    title: "2026 Eurobond Vergi Hesaplama Rehberi: Hazine Eurobondu, Stopaj ve Özel Sektör Kesintileri",
    description:
      "Eurobond vergisi nasıl hesaplanır? Hazine eurobondlarında %0 stopajı, tam mükellef kurumların yurt dışı ihraçlarında görülen vade bazlı oranları ve diğer özel sektör tahvillerindeki kesinti mantığını öğrenin.",
    category: "Finans",
    categorySlug: "finansal-hesaplamalar",
    publishedAt: "2026-03-15",
    updatedAt: "2026-03-15",
    readingTime: 7,
    relatedCalculators: ["eurobond-getiri-hesaplama", "eurobond-hesaplama", "tahvil-hesaplama", "mevduat-faiz-hesaplama"],
    keywords: ["eurobond vergi hesaplama", "eurobond vergisi 2026", "hazine eurobond stopaj", "özel sektör eurobond vergisi", "eurobond stopaj oranı"],
    content: `<h2>Eurobond Vergi Hesaplama Neden Ayrı Okunmalı?</h2>
<p>Eurobond yatırımında kullanıcı çoğu zaman yalnız kupon oranına veya vadeye kadar getiriye odaklanır. Oysa <strong>net getiri</strong> açısından vergi yapısı da en az fiyat ve kur kadar önemlidir. Üstelik piyasada sık tekrar edilen “özel sektör eurobondlarında stopaj hep %10’dur” cümlesi her durumda doğru değildir. Bu yüzden eurobond vergi hesaplama başlığını ayrı okumak gerekir.</p>
<h2>2026 İçin Temel Çerçeve</h2>
<table>
  <thead>
    <tr><th>İhraç tipi</th><th>Stopaj çerçevesi</th><th>Kısa not</th></tr>
  </thead>
  <tbody>
    <tr><td>Türkiye Hazinesi eurobondları</td><td>%0</td><td>GVK 94/7-b kapsamında stopaj muafiyeti</td></tr>
    <tr><td>Tam mükellef kurumların yurt dışı ihraçları</td><td>Vadeye göre %0 / %3 / %7</td><td>GİB rehberinde 31.01.2025 tarihli 9487 sayılı karar çerçevesiyle açıklanır</td></tr>
    <tr><td>Bu grup dışında kalan özel sektör tahvilleri</td><td>%10</td><td>Geçici 67 kapsamında standart kesinti mantığı öne çıkar</td></tr>
  </tbody>
</table>
<h2>Hazine Eurobondlarında Vergi Durumu</h2>
<p>Türkiye Hazinesi tarafından ihraç edilen eurobondlarda faiz geliri tarafında <strong>%0 stopaj</strong> uygulanır. Bu, özellikle TL mevduat veya bazı özel sektör borçlanma araçlarıyla kıyaslandığında net getiri açısından önemli bir avantaj yaratır. Ancak stopajın sıfır olması, yatırım kararının risksiz olduğu anlamına gelmez; fiyat oynaklığı ve kur hareketi yine sonucu ciddi biçimde etkiler.</p>
<h2>Özel Sektör Eurobondlarında Oran Tek Değildir</h2>
<p>GİB’in Menkul Sermaye İradı rehberinde, <strong>tam mükellef kurumların yurt dışında ihraç ettiği tahvil ve kira sertifikalarında</strong> vadelere göre <strong>%0, %3 veya %7</strong> tevkifat görülebileceği belirtilir. Buna karşılık bu grubun dışında kalan özel sektör tahvillerinde <strong>%10</strong> oranı öne çıkar. Dolayısıyla yatırımcı önce ihraççının niteliğini, sonra aracın hangi vergi kategorisine girdiğini kontrol etmelidir.</p>
<h2>Vergi Net Getiriyi Nasıl Değiştirir?</h2>
<p>Aynı kupon oranına sahip iki eurobond düşünün: biri Hazine ihraçlı, diğeri özel sektör ihraçlı olsun. Brüt kupon geliri eşit görünse bile stopaj farkı nedeniyle yatırımcının eline geçen <strong>net kupon</strong> farklılaşabilir. Bu nedenle yalnız kupon oranına değil, <strong>net kupon geliri + alım fiyatı + vadeye kadar getiri + kur etkisi</strong> bileşimine bakmak gerekir.</p>
<h2>Beyan Sınırı Her Yıl Ayrı Kontrol Edilmelidir</h2>
<p>Stopaj oranı kadar <strong>beyan yükümlülüğü</strong> de önemlidir. Ancak beyan hadleri ve uygulama detayları yıllara göre değişebilir. Bu yüzden kesin işlem öncesinde ilgili yılın Hazır Beyan özetini ve güncel GİB rehberini kontrol etmek gerekir; eski yıl eşikleriyle karar vermek hatalı sonuç doğurabilir.</p>
<h2>Hangi Araçlar Birlikte Kullanılmalı?</h2>
<p>Önce <strong>Eurobond Getiri Hesaplama</strong> aracıyla kupon, toplam getiri ve yaklaşık YTM görün. Ardından <strong>Eurobond Hesaplama</strong> ekranında daha detaylı kur/TL senaryosu kurun. Sabit getirili alternatifleri kıyaslamak için <strong>Tahvil</strong>, vergi sonrası net faiz farkını görmek için <strong>Mevduat Faiz Hesaplama</strong> aracı birlikte okunabilir.</p>
<p><em>Resmi kontrol:</em> Güncel mevzuat için <a href="https://intvrg.gib.gov.tr/hazirbeyan/assets/pdf/menkulsermaye2025.pdf" target="_blank" rel="noopener noreferrer">GİB Menkul Sermaye İradı Rehberi</a> ve <a href="https://intvrg.gib.gov.tr/hazirbeyan/menkulOzet.html" target="_blank" rel="noopener noreferrer">Hazır Beyan menkul özeti</a> incelenmelidir.</p>`,
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
    relatedCalculators: ["kredi-karti-gecikme-faizi-hesaplama", "kredi-karti-asgari-odeme", "kredi-yapilandirma-hesaplama"],
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
  {
    slug: "vergi-hesaplama-rehberi-2026",
    title: "2026 Vergi Hesaplama Rehberi: Gelir, KDV, Kira ve Emlak Vergisini Nasıl Okumalı?",
    description:
      "Gelir vergisi, KDV, kira vergisi, stopaj ve emlak vergisi hesapları neyi gösterir? 2026 için temel vergi araçlarını birlikte okumanızı sağlayan pratik rehber.",
    category: "Maaş & Vergi",
    categorySlug: "maas-ve-vergi",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 8,
    relatedCalculators: ["gelir-vergisi-hesaplama", "kdv-hesaplama", "kira-vergisi-hesaplama", "kira-stopaj-hesaplama", "emlak-vergisi-hesaplama", "veraset-intikal-vergisi-hesaplama"],
    keywords: ["vergi hesaplama", "gelir vergisi 2026", "kdv hesaplama", "kira vergisi", "emlak vergisi", "veraset intikal vergisi"],
    content: `<h2>Vergi Hesaplama Araçlarını Tek Tek Değil, Birlikte Okumak Gerekir</h2>
<p>Vergi araçları çoğu zaman tek bir soruya cevap veriyor gibi görünür: ne kadar öderim? Fakat pratikte aynı ekonomik işlem birden fazla vergi türüyle ilişkili olabilir. Bir kira gelirinde yalnızca gelir vergisine değil, stopaj ve istisna etkisine de bakmak gerekir; bir satış fiyatında ise yalnızca KDV oranı değil, matrah ve kârlılık ilişkisi de önemlidir.</p>
<h2>Gelir Vergisi Neyi Gösterir?</h2>
<p>Gelir vergisi aracı, yıllık veya kümülatif gelirin hangi dilimlerde ne kadar vergilendirildiğini görmenizi sağlar. Özellikle ücret, serbest meslek veya kira geliri gibi farklı gelir türleri için efektif vergi oranını anlamak bütçe planlamasında kritik rol oynar.</p>
<h2>KDV Hesabı Neden Tek Başına Yeterli Değildir?</h2>
<p>KDV hesaplama ekranı bir mal veya hizmet fiyatının vergisiz matrahını ve vergi tutarını ayırmak için idealdir. Ancak ticari karar verirken bu sonucu <strong>kâr marjı</strong>, <strong>fiyatlama</strong> ve gerekiyorsa <strong>KDV tevkifatı</strong> ile birlikte değerlendirmek gerekir. Çünkü KDV dahil fiyat üzerinden yapılan kaba yorumlar gerçek kârlılığı maskeleyebilir.</p>
<h2>Kira Vergisi ve Kira Stopajı Arasındaki Fark</h2>
<p>Kira vergisi ile kira stopajı aynı şey değildir. Kira vergisi, çoğunlukla gayrimenkul sermaye iradı kapsamında yıllık beyanla ilişkilidir. Stopaj ise özellikle işyeri kiralarında kiracı tarafından vergi dairesine yapılan kesinti mantığına dayanır. Bu yüzden mal sahibi açısından net tahsilat ile yıllık vergi yükü ayrı ayrı görülmelidir.</p>
<h2>Emlak ve Veraset Vergileri Ne Zaman Devreye Girer?</h2>
<p>Emlak vergisi, taşınmazın beyan değeri üzerinden yıllık yükü gösterirken; veraset ve intikal vergisi miras veya bağış gibi devir işlemlerinde devreye girer. Taşınmaz odaklı vergi yükünü doğru yorumlamak için emlak vergisi, tapu harcı, değer artış kazancı ve veraset araçlarını birlikte düşünmek daha sağlıklı sonuç verir.</p>
<h2>Pratik Kullanım Sırası</h2>
<ul>
  <li>Düzenli gelir veya ücret için önce <strong>Gelir Vergisi Hesaplama</strong> aracına bakın.</li>
  <li>Faturalı satış veya fiyatlama için <strong>KDV Hesaplama</strong> ekranını kullanın.</li>
  <li>Kira gelirlerinde <strong>Kira Vergisi</strong> ve <strong>Kira Stopajı</strong> araçlarını birlikte okuyun.</li>
  <li>Taşınmaz tarafında yıllık yük için <strong>Emlak Vergisi</strong>, devir işlemleri için <strong>Veraset ve İntikal Vergisi</strong> ekranına geçin.</li>
</ul>
<p>Tek bir vergi oranına bakarak karar vermek yerine, ilgili araçları senaryo bazlı birlikte okumak daha doğru bütçe ve nakit akışı planı sağlar.</p>`,
  },
  {
    slug: "arac-vergileri-mtv-otv-rehberi-2026",
    title: "2026 Araç Vergileri Rehberi: MTV ve ÖTV Hesabı Nasıl Yorumlanır?",
    description:
      "MTV ile ÖTV arasındaki fark nedir, araç alırken hangi vergi neyi etkiler? 2026 için MTV ve ÖTV hesaplarını birlikte okumaya yardımcı kısa rehber.",
    category: "Taşıt & Vergi",
    categorySlug: "tasit-ve-vergi",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-27",
    readingTime: 9,
    relatedCalculators: ["mtv-hesaplama", "otv-hesaplama", "yakit-tuketim-maliyet", "hiz-mesafe-sure"],
    keywords: ["mtv hesaplama", "ötv hesaplama", "araç vergisi 2026", "motorlu taşıtlar vergisi", "araç satın alma maliyeti"],
    content: `<h2>2026 Araç Vergileri Rehberi: MTV ve ÖTV Aynı Şey Değildir</h2>
<p>Araç alırken en sık yapılan hatalardan biri, tüm vergi yükünü tek bir başlık altında düşünmektir. Oysa <strong>ÖTV</strong> ile <strong>MTV</strong> tamamen farklı iki vergi türüdür. ÖTV, aracın ilk iktisabında yani satın alma aşamasında fiyatı bir anda yukarı çeken vergidir. MTV ise aracı sahip olduğunuz sürece yıl içinde ödediğiniz yıllık vergi yükünü temsil eder. Bu nedenle "araç bana kaça mal olacak?" sorusunun doğru cevabı yalnız bayi fiyatında değil; ÖTV, KDV, MTV, yakıt ve kullanım maliyetlerinin tamamında saklıdır.</p>
<p>2026'da araç vergilerini doğru okumak için önce şu ayrımı zihne yerleştirmek gerekir: <strong>ÖTV ilk alım vergisidir, MTV sahip olma vergisidir.</strong> Eğer sıfır araç bakıyorsanız <a href="/tasit-ve-vergi/otv-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ÖTV Hesaplama</a> aracıyla ilk vergi yükünü, aracı satın aldıktan sonraki yıllık sabit yükü görmek için <a href="/tasit-ve-vergi/mtv-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">MTV Hesaplama</a> ekranını, kullanım maliyetini anlamak için <a href="/tasit-ve-vergi/yakit-tuketim-maliyet" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Yakıt Tüketim ve Maliyet</a> aracını ve rota planını değerlendirmek için <a href="/tasit-ve-vergi/hiz-mesafe-sure" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Hız / Mesafe / Süre</a> sayfasını birlikte açmanız gerekir.</p>
<h2>2026 MTV Hesaplama Mantığı Nedir?</h2>
<p>Motorlu Taşıtlar Vergisi, araç tipine göre belirlenen yıllık bir vergidir ve genel olarak ocak ile temmuz aylarında iki eşit taksitte ödenir. GİB'in 31 Aralık 2025 tarihli 2026 MTV açıklayıcı bilgi notunda, 1 Ocak 2026'dan itibaren geçerli yeni tutarlara yer verildiği belirtilmiştir. Hesapmod'un MTV aracında binek otomobiller için motor hacmi ve yaş grubuna göre hızlı planlama tablosu kullanılır; ancak özellikle 2018 sonrası taşıtlarda ilk tescil yılı, taşıt değeri ve elektrikli sınıflandırması resmi tahakkuku etkileyebilir.</p>
<p>Bu nedenle sitedeki <a href="/tasit-ve-vergi/mtv-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">MTV Hesaplama</a> ekranı, günlük karar verme ve bütçe kurma açısından çok güçlü bir ön izleme sunar; yine de ödeme aşamasında nihai tahakkuku GİB ekranından doğrulamak gerekir. Fakat araç seçimi aşamasında zaten ihtiyacınız olan şey tam da budur: iki araç arasında yıllık sabit yük farkını hızlıca görmek.</p>
<h2>2026 MTV Örnek Hesaplama: 1.301-1.600 cc, 1-3 Yaş Araç</h2>
<p>2026 hızlı planlama tablosuna göre <strong>1.301-1.600 cc</strong> motor hacmine sahip ve <strong>1-3 yaş</strong> grubunda olan bir binek otomobil için yıllık MTV tutarı <strong>12.028 TL</strong> olarak görünür. Taksit mantığı şöyledir:</p>
<ul>
  <li>Yıllık MTV: <strong>12.028 TL</strong></li>
  <li>Ocak taksiti: <strong>6.014 TL</strong></li>
  <li>Temmuz taksiti: <strong>6.014 TL</strong></li>
</ul>
<p>Birçok kullanıcı burada yalnızca ilk takside bakarak yıllık yükü düşük sanıyor. Oysa aynı araç için yalnız MTV'den gelen sabit yıllık maliyet 12.028 TL'dir. Eğer yıllık kullanımınız yüksekse buna yakıt, bakım, kasko ve sigorta da eklenecektir.</p>
<h2>2026 MTV Örnek Hesaplama: 1.601-1.800 cc, 7-11 Yaş Araç</h2>
<p>İkinci örnekte daha yaşlı ama motoru nispeten büyük bir otomobili düşünelim. <strong>1.601-1.800 cc</strong> ve <strong>7-11 yaş</strong> grubundaki bir binek otomobil için hızlı planlama tutarı <strong>9.775 TL</strong>'dir.</p>
<ul>
  <li>Yıllık MTV: <strong>9.775 TL</strong></li>
  <li>Ocak taksiti: <strong>4.887,50 TL</strong></li>
  <li>Temmuz taksiti: <strong>4.887,50 TL</strong></li>
</ul>
<p>Bu örnek şunu gösterir: daha eski araç her zaman daha düşük sabit yüke sahip olmayabilir; motor hacmi ve segment de ciddi belirleyicidir. Bu yüzden "ikinci el alırsam MTV çok düşer" varsayımı her araçta doğru çıkmaz.</p>
<h2>2026 ÖTV Hesaplama Mantığı Nedir?</h2>
<p>ÖTV, sıfır araç satın alma sürecinde fiyatı en sert biçimde etkileyen vergi kalemidir. 2026'da binek otomobil tarafında matrah, araç sınıfı, motor hacmi veya elektrikli araçlarda motor gücü gibi unsurlar birlikte değerlendirilir. Üstelik ÖTV yalnız başına kalmaz; önce ÖTV hesaplanır, ardından <strong>matrah + ÖTV</strong> toplamı üzerinden KDV eklenir. Bu yüzden vergi yükü bileşik etki yaratır ve nihai satış fiyatı vergisiz bedelin çok üstüne çıkabilir.</p>
<p>Hesapmod'daki <a href="/tasit-ve-vergi/otv-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ÖTV Hesaplama</a> aracı, 2026'da geçerli matrah ve sınıf mantığını basitleştirerek sunar. Özellikle sıfır araç bakarken "vergisiz liste fiyatı 1,2 milyon ama neden anahtar teslim fiyat 2,7 milyon?" sorusunun cevabı bu ekran üzerinden çok net görülür.</p>
<h2>2026 ÖTV Örnek Hesaplama: 1.200.000 TL Matrahlı İçten Yanmalı Araç</h2>
<p>Şimdi içten yanmalı bir binek otomobili örnek alalım. Araç sınıfı <strong>1.4-1.6 litre</strong>, vergisiz satış bedeli yani ÖTV matrahı ise <strong>1.200.000 TL</strong> olsun. Sitedeki 2026 simülasyonuna göre bu bantta ÖTV oranı <strong>%90</strong> kabul edilir.</p>
<ul>
  <li>Vergisiz bedel: 1.200.000 TL</li>
  <li>ÖTV oranı: %90</li>
  <li>ÖTV tutarı: 1.200.000 x 0,90 = <strong>1.080.000 TL</strong></li>
  <li>KDV matrahı: 1.200.000 + 1.080.000 = <strong>2.280.000 TL</strong></li>
  <li>KDV (%20): 2.280.000 x 0,20 = <strong>456.000 TL</strong></li>
  <li>Toplam vergi yükü: <strong>1.536.000 TL</strong></li>
  <li>Tahmini satış fiyatı: 1.200.000 + 1.536.000 = <strong>2.736.000 TL</strong></li>
</ul>
<p>Bu örnek, yalnızca ÖTV oranına bakmanın neden yeterli olmadığını gösteriyor. Çünkü KDV, ÖTV eklenmiş tutar üzerinden de hesaplandığı için vergi katmanı büyüyor.</p>
<h2>2026 ÖTV Örnek Hesaplama: 1.500.000 TL Matrahlı Elektrikli Araç</h2>
<p>Elektrikli otomobillerde tablo daha farklı olabilir. <strong>160 kW altı</strong> bir tam elektrikli binek otomobil düşünelim ve matrahı <strong>1.500.000 TL</strong> olsun. Hesapmod simülasyonunda bu araç için ÖTV oranı <strong>%25</strong> kabul edilir.</p>
<ul>
  <li>Vergisiz bedel: 1.500.000 TL</li>
  <li>ÖTV oranı: %25</li>
  <li>ÖTV tutarı: <strong>375.000 TL</strong></li>
  <li>KDV matrahı: <strong>1.875.000 TL</strong></li>
  <li>KDV (%20): <strong>375.000 TL</strong></li>
  <li>Toplam vergi yükü: <strong>750.000 TL</strong></li>
  <li>Tahmini satış fiyatı: <strong>2.250.000 TL</strong></li>
</ul>
<p>Aynı fiyat bandındaki içten yanmalı araçla kıyaslandığında elektrikli bir modelin vergi yükünün çok daha düşük kalabildiği görülür. İşte bu yüzden araç tercihini yalnız motor tipi değil, <strong>matrah + vergi + yıllık MTV</strong> üçlüsüyle okumak gerekir.</p>
<h2>MTV mi Daha Önemli, ÖTV mi?</h2>
<p>Bu sorunun cevabı kullanım senaryonuza göre değişir. Eğer sıfır araç alıyor ve aracı 1-2 yıl içinde değiştirmeyi düşünüyorsanız, kararınızda ÖTV'nin etkisi çok daha büyüktür. Çünkü satın alma maliyetini başlangıçta belirleyen ana kalem odur. Buna karşılık aracı uzun yıllar kullanmayı planlıyorsanız MTV, yakıt ve bakım toplam sahip olma maliyetinde daha görünür hale gelir.</p>
<p>Örneğin 2.736.000 TL tahmini satış fiyatına çıkan içten yanmalı bir araçta ilk yıl ÖTV yükü çok dramatiktir; fakat aracı 7-8 yıl kullanacaksanız yıllık MTV, yakıt tüketimi ve servis giderleri toplam tabloda ciddi ağırlık kazanır. Tam da bu nedenle <a href="/tasit-ve-vergi/mtv-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">MTV Hesaplama</a> ile <a href="/tasit-ve-vergi/yakit-tuketim-maliyet" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Yakıt Tüketim ve Maliyet</a> aracını birlikte değerlendirmek gerekir.</p>
<h2>Araç Vergileri Neden Yakıt ve Yol Süresi Araçlarıyla Birlikte Okunmalı?</h2>
<p>Gerçek araç maliyeti yalnız vergiden ibaret değildir. Sürücülerin önemli bir bölümü satın alma sırasında ÖTV'ye bakıp karar verir, sonra yıllık MTV'yi ekler; ama günlük kullanımda yakıt, rota ve zaman maliyetini hesaba katmaz. Oysa aynı vergisel düzeydeki iki araçtan biri şehir içi yoğun kullanımda ciddi yakıt farkı yaratabilir.</p>
<p>Bu nedenle vergi hesabı yaptığınız anda <a href="/tasit-ve-vergi/yakit-tuketim-maliyet" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Yakıt Tüketim ve Maliyet</a> sayfasıyla aylık/ yıllık akaryakıt yükünü, <a href="/tasit-ve-vergi/hiz-mesafe-sure" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Hız / Mesafe / Süre</a> aracıyla da özellikle uzun yol planlamasında zaman maliyetini görmek iyi sonuç verir. Böylece aracın sadece vergisini değil, gerçek yaşam maliyetini okumuş olursunuz.</p>
<h2>2026 Araç Vergileri İçin Hızlı Karar Formülü</h2>
<ul>
  <li>Sıfır araçta önce <a href="/tasit-ve-vergi/otv-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ÖTV Hesaplama</a> ile anahtar teslim fiyatı görün.</li>
  <li>Ardından <a href="/tasit-ve-vergi/mtv-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">MTV Hesaplama</a> ile yıllık sabit vergi yükünü ekleyin.</li>
  <li>Düzenli kullanım için <a href="/tasit-ve-vergi/yakit-tuketim-maliyet" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Yakıt Tüketim ve Maliyet</a> çıktısını alın.</li>
  <li>Uzun rota planları için <a href="/tasit-ve-vergi/hiz-mesafe-sure" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Hız / Mesafe / Süre</a> hesabını da tabloya ekleyin.</li>
</ul>
<p>Bu dört adımın sonunda "araba bana kaça gelir?" sorusuna çok daha gerçekçi cevap vermiş olursunuz.</p>
<h2>MTV ve ÖTV Hakkında Sık Sorulan Sorular</h2>
<h3>1. MTV 2026'da ne zaman ödenir?</h3>
<p>Motorlu Taşıtlar Vergisi genel olarak yılda iki taksitte ödenir. Birinci taksit ocak ayında, ikinci taksit temmuz ayında tahakkuk eder.</p>
<h3>2. Elektrikli araçlar MTV öder mi?</h3>
<p>Evet, öder. Ancak tam elektrikli araçlarda motor hacmi yerine motor gücü ve taşıt değeri gibi farklı parametreler devreye girebilir. Bu nedenle nihai tutarı GİB sorgusundan doğrulamak gerekir.</p>
<h3>3. ÖTV sadece sıfır araçta mı vardır?</h3>
<p>ÖTV esas olarak ilk iktisap aşamasında doğar. İkinci el alım-satımda aynı araç için yeniden ÖTV hesaplanmaz; fakat ilk satın alma fiyatı üzerindeki etkisi ikinci el piyasa değerine dolaylı olarak yansır.</p>
<h3>4. Araç fiyatı neden ÖTV oranından daha fazla artıyor?</h3>
<p>Çünkü KDV, yalnız vergisiz bedel üzerine değil; <strong>vergisiz bedel + ÖTV</strong> toplamı üzerine uygulanır. Bu çarpan etkisi nihai satış fiyatını beklenenden daha fazla büyütür.</p>
<h3>5. Araç alırken sadece MTV'ye bakmak yeterli mi?</h3>
<p>Hayır. Özellikle sıfır araçta ÖTV ana maliyet kalemidir. Uzun kullanımda ise MTV'ye ek olarak yakıt, bakım, sigorta ve zaman maliyeti de toplam sahip olma giderini belirler.</p>`,
  },
  {
    slug: "sinav-puanlari-rehberi-2026",
    title: "2026 Sınav Puanları Rehberi: YKS, TYT, KPSS ve ALES Nasıl Hesaplanır?",
    description:
      "YKS, TYT, KPSS, ALES ve diğer temel sınavlar için net-puan dönüşümü nasıl çalışır? 2026 için hesaplama mantığı ve strateji rehberi.",
    category: "Sınav Hesaplamaları",
    categorySlug: "sinav-hesaplamalari",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-27",
    readingTime: 10,
    relatedCalculators: ["yks-puan-hesaplama", "tyt-puan-hesaplama", "kpss-puan-hesaplama", "ales-puan-hesaplama", "obp-puan-hesaplama", "universite-not-ortalamasi-hesaplama"],
    keywords: ["yks puan hesaplama", "tyt puan hesaplama", "kpss puan hesaplama", "ales puan hesaplama", "sinav puani nasil hesaplanir 2026"],
    content: `<h2>2026 Sınav Puanları Rehberi: Sınav Puanı Neden Net Sayısıyla Aynı Değildir?</h2>
<p>Sınav sonucu denince çoğu aday önce yaptığı net sayısına bakar. Ancak ÖSYM mantığında <strong>net</strong> ile <strong>puan</strong> aynı şey değildir. Net, doğru ve yanlışların matematiksel sonucudur; puan ise bu netlerin katsayılar, alan ağırlıkları, standartlaştırma ve bazı sınavlarda okul puanı gibi ek bileşenlerle dönüştürülmüş halidir. Bu yüzden iki adayın benzer net yapmasına rağmen farklı puan alması mümkündür.</p>
<p>2026 yılında sınav takvimi de adayların planını doğrudan etkiliyor. ÖSYM'nin 2026 sınav takvimine göre <strong>2026-ALES/1 10 Mayıs 2026</strong>, <strong>2026-YKS TYT 20 Haziran 2026</strong>, <strong>AYT ve YDT 21 Haziran 2026</strong>, <strong>2026-KPSS Lisans Genel Yetenek-Genel Kültür 6 Eylül 2026</strong>, alan bilgisi oturumları ise <strong>12-13 Eylül 2026</strong> tarihlerinde yapılacak. Bu tarihleri bilmek, hangi ayda hangi puan türüne odaklanacağınızı belirlemek açısından kritik.</p>
<p>Bu rehberde YKS, TYT, KPSS ve ALES puan mantığını sadeleştirerek anlatacağız. Hızlı deneme için <a href="/sinav-hesaplamalari/yks-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">YKS Puan Hesaplama</a>, <a href="/sinav-hesaplamalari/tyt-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">TYT Puan Hesaplama</a>, <a href="/sinav-hesaplamalari/kpss-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">KPSS Puan Hesaplama</a>, <a href="/sinav-hesaplamalari/ales-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ALES Puan Hesaplama</a> ve <a href="/sinav-hesaplamalari/obp-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">OBP Puan Hesaplama</a> araçlarını aynı strateji içinde kullanabilirsiniz.</p>
<h2>YKS Puan Hesaplama Mantığı: TYT, AYT, YDT ve OBP Nasıl Birleşir?</h2>
<p>YKS, tek bir sınav değil; üç oturumdan oluşan birleşik bir yapı olarak düşünülmelidir. TYT tüm adaylar için ortak temel oturumdur. AYT ve YDT ise hedef puan türüne göre devreye girer. Sayısal hedefleyen bir aday için TYT tek başına yeterli değildir; AYT Matematik ve Fen netleri asıl puanı belirler. Sözel, eşit ağırlık ve dil adaylarında da alan katkıları farklılaşır.</p>
<p>Buradaki temel nokta şudur: <strong>YKS puan hesaplama</strong> sürecinde TYT puanı ile yerleştirme puanı aynı değildir. Önce ham puan oluşur, sonra OBP katkısı eklenir. Geçen yıl bir programa yerleşen adaylarda OBP katkısı yarıya düştüğü için aynı netler farklı sonuç verebilir. Bu nedenle sadece "şu kadar net yaptım" demek yerine, OBP durumunuzu da senaryoya eklemek gerekir.</p>
<h2>TYT Puan Hesaplama Mantığı: 4 Yanlış 1 Doğruyu Götürür Kuralı</h2>
<p>TYT puanında Türkçe, Sosyal Bilimler, Temel Matematik ve Fen Bilimleri testlerindeki doğru ve yanlışlardan net bulunur. Burada klasik kural uygulanır: <strong>4 yanlış 1 doğruyu götürür</strong>. Ayrıca TYT puanının hesaplanabilmesi için Türkçe veya Matematik testlerinden en az <strong>0,5 net</strong> yapılması gerekir. Bu baraj kaldırılmış gibi konuşulsa da puanın hesaplanabilmesi için minimum net mantığı devam eder.</p>
<p>Hesapmod'un 2026 ön izleme setinde TYT katsayıları, güncel senaryoya uygun biçimde adaylara bir puan tahmini verir. Bu sayede netlerin puana etkisini hızlıca görebilirsiniz; ancak nihai resmi puan için ÖSYM'nin standartlaştırma ve sınavın genel dağılım etkisi her zaman belirleyicidir.</p>
<h2>TYT Puan Hesaplama Örneği: Netten Ham Puana ve Yerleştirme Puanına</h2>
<p>Bir örnek üzerinden gidelim. Adayın 2026 TYT denemesinde şu sonuçları elde ettiğini varsayalım:</p>
<ul>
  <li>Türkçe: 30 doğru, 6 yanlış -> <strong>28,5 net</strong></li>
  <li>Sosyal: 15 doğru, 4 yanlış -> <strong>14 net</strong></li>
  <li>Matematik: 25 doğru, 5 yanlış -> <strong>23,75 net</strong></li>
  <li>Fen: 10 doğru, 2 yanlış -> <strong>9,5 net</strong></li>
</ul>
<p>Toplam net bu senaryoda <strong>75,75</strong> olur. Hesapmod'un güncel katsayı mantığında bu netler yaklaşık <strong>317,72 ham TYT puanı</strong> üretir. Adayın diploma notu 85 ise OBP değeri 85 x 5 = <strong>425</strong>, yerleştirme katkısı ise 425 x 0,12 = <strong>51 puan</strong> olur. Böylece yaklaşık yerleştirme puanı <strong>368,72</strong> seviyesine çıkar.</p>
<p>Bu örnek tek başına çok şey anlatır: aynı TYT netine sahip iki adaydan diploma notu yüksek olanın yerleştirme puanı daha yukarı çıkabilir. Bu yüzden TYT netlerinizi yorumlarken mutlaka <a href="/sinav-hesaplamalari/obp-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">OBP Puan Hesaplama</a> çıktısını da görmelisiniz.</p>
<h2>YKS Puan Hesaplama Örneği: SAY Adayı İçin TYT + AYT Senaryosu</h2>
<p>Şimdi de TYT ile AYT'nin nasıl birleştiğine bakalım. Sayısal puan hedefleyen bir adayın TYT toplam neti <strong>78,5</strong> olsun. AYT tarafında da Matematik <strong>28 net</strong>, Fizik <strong>8 net</strong>, Kimya <strong>6 net</strong>, Biyoloji <strong>5 net</strong> yaptığını ve diploma notunun <strong>82</strong> olduğunu düşünelim.</p>
<p>Bu senaryoda önce AYT alan netleri kendi katsayılarıyla işlenir, ardından TYT katkısı ve son olarak OBP eklenir. Sonuçta ortaya çıkan sayı, ham sayısal puan ile yerleştirme sayısal puanı arasında fark oluşturur. Adaylar çoğu zaman "TYT'm iyi ama AYT'm ortalama" dediğinde puanının neden beklediği kadar yükselmediğini burada görür. Çünkü YKS'de alan netlerinin ağırlığı, hedef puan türüne göre ciddi biçimde değişir. Bu nedenle ham TYT başarısını tek başına bölüm kazanma göstergesi sanmak büyük hatadır.</p>
<h2>KPSS Puan Hesaplama Nasıl Çalışır?</h2>
<p>KPSS'de durum biraz farklıdır. Burada adayın Genel Yetenek (GY) ve Genel Kültür (GK) performansı ana omurgayı oluşturur; fakat resmi sonuçta ÖSYM standart sapma ve aday kitlesi dağılımını da kullanır. Bu nedenle KPSS puanı, TYT gibi sabit katsayıyla kaba toplama indirgenemez. Yine de planlama aşamasında yaklaşık puan simülasyonu son derece faydalıdır.</p>
<p>Hesapmod'un <a href="/sinav-hesaplamalari/kpss-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">KPSS Puan Hesaplama</a> aracı, GY ve GK netlerinden hareketle özellikle P1 tipi için güçlü bir ön izleme sunar. Adayın gerçek puanı resmi sonuç belgesiyle kesinleşir; ancak çalışma döneminde "bu net bandı beni yaklaşık nereye taşır?" sorusuna yanıt vermek için bu tür simülasyonlar çok değerlidir.</p>
<h2>KPSS Puan Hesaplama Örneği: GY-GK Netlerinden P1 Tahmini</h2>
<p>Bir adayın GY testinde <strong>50 doğru 6 yanlış</strong>, GK testinde <strong>42 doğru 4 yanlış</strong> yaptığını varsayalım:</p>
<ul>
  <li>GY neti: 50 - 6/4 = <strong>48,5</strong></li>
  <li>GK neti: 42 - 4/4 = <strong>41</strong></li>
</ul>
<p>Hesapmod'un planlama formülüne göre yaklaşık KPSS-P1 sonucu şu şekilde okunur:</p>
<p><code>P1 ≈ (48,5 x 1,17) + (41 x 0,50) + 40 = 117,25</code></p>
<p>Bu sonuç resmi ÖSYM puanı yerine geçmez; fakat adayın 110 üstü, 115 üstü veya 120 bandına ne kadar yakın olduğunu görmek için çok kullanışlıdır. Kamu tercih hedefi olan kullanıcılar, bu sonucu geçmiş alım tabanlarıyla birlikte yorumlamalıdır.</p>
<h2>ALES Puan Hesaplama Nasıl Yapılır?</h2>
<p>ALES'te Sayısal ve Sözel testlerin her biri 50 sorudur ve yine 4 yanlış 1 doğruyu götürür. Ancak puan türleri yalnız net toplamından oluşmaz. <strong>ALES SAY</strong>, <strong>ALES SÖZ</strong> ve <strong>ALES EA</strong> için sabit katsayı ve test ağırlıkları sınav dönemine göre değişebilir. Bu yüzden ALES puanı, dönem bilgisinden bağımsız kaba bir aritmetik değildir.</p>
<p>2026 başvurularında adayların önemli bir bölümü elindeki güncel performansı görmek için son doğrulanmış dönem katsayılarını kullanır. Bu yaklaşım, özellikle yüksek lisans ve akademik ilan hedefi olanlar için pratiktir. Çünkü aday, puanının 70 mi 80 mi yoksa 85 üstü mü olduğunu hızlıca görerek YDS ve mezuniyet ortalaması stratejisini buna göre ayarlayabilir.</p>
<h2>ALES Puan Hesaplama Örneği: 32 Sayısal Net ve 32 Sözel Net</h2>
<p>Hesapmod'un güncel ALES örneğinde adayın hem Sayısal hem Sözel testte <strong>32 net</strong> yaptığını varsayalım. 2025/3 doğrulanmış dönem katsayılarıyla araç yaklaşık şu puanları üretir:</p>
<ul>
  <li>ALES SAY: <strong>82,108</strong></li>
  <li>ALES SÖZ: <strong>82,245</strong></li>
  <li>ALES EA: <strong>82,737</strong></li>
</ul>
<p>Bu örnek çok öğreticidir; çünkü aynı net dağılımı üç puan türünde küçük farklarla üç ayrı sonuç yaratır. Hedeflediğiniz program eşit ağırlık puanı istiyorsa sayısal netiniz çok yüksek diye kendinizi otomatik avantajlı sanmamanız gerekir; puan türü talebine göre denge önemlidir.</p>
<h2>OBP ve Mezuniyet Notu Sınav Puanını Nasıl Etkiler?</h2>
<p>YKS tarafında OBP, ham puan üzerine eklenen doğrudan bir katkıdır. Diploma notu 50 ile 100 arasındaysa önce 5 ile çarpılarak 250-500 aralığında OBP'ye dönüşür, sonra genellikle 0,12 katsayısı ile yerleştirme puanına yansır. Bu mekanizma nedeniyle yüksek diploma notu, özellikle sınırda kalan adaylarda ciddi avantaj sağlayabilir.</p>
<p>Lisansüstü tarafta ise ALES tek başına yeterli değildir; lisans not ortalaması ve yabancı dil puanı da önemli olabilir. Bu yüzden ALES sonucunu yorumlarken <a href="/sinav-hesaplamalari/universite-not-ortalamasi-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">Üniversite Not Ortalaması Hesaplama</a> ekranını ve gerekiyorsa YDS hesap araçlarını birlikte değerlendirmek gerekir.</p>
<h2>2026 Sınav Puanları İçin Hangi Araçlar Hangi Sırayla Kullanılmalı?</h2>
<ul>
  <li>YKS adayıysanız önce <a href="/sinav-hesaplamalari/tyt-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">TYT Puan Hesaplama</a>, sonra <a href="/sinav-hesaplamalari/yks-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">YKS Puan Hesaplama</a> ekranına geçin.</li>
  <li>OBP katkınızı ayrıca görmek için <a href="/sinav-hesaplamalari/obp-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">OBP Puan Hesaplama</a> aracını kullanın.</li>
  <li>Kamu kariyeri hedefliyorsanız <a href="/sinav-hesaplamalari/kpss-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">KPSS Puan Hesaplama</a> ile GY-GK bandınızı görün.</li>
  <li>Lisansüstü veya akademik başvuru hedefi için <a href="/sinav-hesaplamalari/ales-puan-hesaplama" class="text-blue-600 hover:text-blue-700 underline underline-offset-4">ALES Puan Hesaplama</a> sonucunu mezuniyet ortalamasıyla birlikte okuyun.</li>
</ul>
<p>Bu sıralama, her sınavı kendi içinde anlamanıza ve yanlış puan türü üzerinden strateji kurmamanıza yardımcı olur.</p>
<h2>Sınav Puanları Hakkında Sık Sorulan Sorular</h2>
<h3>1. Sınav puanı ile net sayısı neden birebir aynı değildir?</h3>
<p>Çünkü puan; netlerin yanı sıra katsayılar, alan ağırlıkları, standartlaştırma ve bazı sınavlarda okul puanı gibi ek bileşenlerin sonucudur. Net yalnızca ilk ham veridir.</p>
<h3>2. TYT puanı için en az kaç net gerekir?</h3>
<p>TYT puanının hesaplanabilmesi için Türkçe veya Matematik testlerinden en az 0,5 net yapılması gerekir. Bu koşul sağlanmadan puan oluşmaz.</p>
<h3>3. KPSS tahmini puan ile resmi puan neden farklı çıkabilir?</h3>
<p>Çünkü ÖSYM resmi sonuçta aday kitlesinin ortalama ve standart sapma verilerini kullanır. Simülasyon araçları ise planlama amaçlı yaklaşık sonuç üretir.</p>
<h3>4. ALES'te aynı netler neden SAY, SÖZ ve EA'da farklı puan veriyor?</h3>
<p>Çünkü her puan türünün kendi katsayı seti vardır. Aynı net dağılımı, puan türüne göre farklı ağırlıkla işlenir.</p>
<h3>5. OBP gerçekten bu kadar önemli mi?</h3>
<p>Evet. Özellikle YKS yerleştirme puanında 30-60 puan aralığında katkı yaratabildiği için sınırda kalan adayların sonucu üzerinde ciddi etkisi olabilir.</p>`,
  },
  {
    slug: "okul-giris-sinav-rehberi-2026",
    title: "2026 Okula Giriş Sınav Rehberi: LGS, DGS, YDS ve Özel Sınavlar",
    description:
      "LGS, DGS, YDS ve E-KPSS gibi özel sınav türlerinde puan hesabı nasıl çalışır? 2026 için adım adım aday rehberi.",
    category: "Sınav Hesaplamaları",
    categorySlug: "sinav-hesaplamalari",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 7,
    relatedCalculators: ["lgs-puan-hesaplama", "dgs-puan-hesaplama", "yds-puan-hesaplama", "ekpss-puan-hesaplama", "ags-puan-hesaplama", "msu-puan-hesaplama"],
    keywords: ["lgs puan hesaplama", "dgs puan hesaplama", "yds puan hesaplama", "ekpss puan hesaplama", "2026 lgs puani", "dikey gecis sinavi"],
    content: `<h2>LGS Puan Sistemi</h2>
<p>Liselere Geçiş Sistemi'nde (LGS) adayın toplam puanı Türkçe, Matematik, Fen Bilimleri, Sosyal Bilgiler ve İnkılap bölümlerinden elde edilen ağırlıklı netlerden hesaplanır. <strong>LGS puanı 500 maksimum olacak şekilde normalize edilir</strong> ve tercih aşamasında dikkat edilmesi gereken taban puanları bu değere göre belirlenir.</p>
<h2>DGS Geçiş Mantığı</h2>
<p>Dikey Geçiş Sınavı, ön lisans mezunlarının lisans programlarına geçiş imkânı sağlar. DGS puanı yalnızca sınav netinden oluşmaz; <strong>diploma notu 0,12 katsayısıyla katkı sağlar</strong>. Bu nedenle düşük sınav puanını yüksek mezuniyet notu kısmen telafi edebilir.</p>
<h2>YDS ve Yabancı Dil Puanları</h2>
<p>Yabancı Dil Bilgisi Seviye Tespit Sınavı (YDS), doğrudan puanlama yapar; 100 sorudan her doğru cevap 1 puan getirir ve yanlışlar doğruları etkilemez. KPSS veya lisansüstü başvurularında <strong>YDS farklı katsayılarla puanlamaya dahil edilebilir</strong>.</p>
<h2>E-KPSS ve Engelli Personel Sınavları</h2>
<p>E-KPSS, engelli kamu personeli yerleştirmesine özgü bir sınav sistemidir. Aday kategorisi ve puan türü engel grubuna göre değişebileceğinden, güncel kılavuz takibi şarttır.</p>
<h2>MSÜ Sınav Yapısı</h2>
<p>Millî Savunma Üniversitesi sınavı, YKS puanı ile fiziksel veri ve güvenlik soruşturması aşamalarını birleştirir. Salt YKS simülasyonundan farklıdır; <strong>MSÜ kılavuzuna göre toplam başarı kriteri</strong> değerlendirilmelidir.</p>
<h2>Pratik Kullanım Sırası</h2>
<ul>
  <li>Ortaokul tercihi için <strong>LGS Puan Hesaplama</strong> ekranı ile net dönüşümü yapın.</li>
  <li>Ön lisanstan lisansa geçiş planlıyorsanız <strong>DGS Puan Hesaplama</strong> ile diploma katkısını görün.</li>
  <li>Akademik veya kamu başvurusu için <strong>YDS Puan Hesaplama</strong> sonucunuzu programa göre yorumlayın.</li>
  <li>Engelli personel yerleştirmesi için <strong>E-KPSS Puan Hesaplama</strong> ile yönelim alın.</li>
</ul>`,
  },
  {
    slug: "vki-kalori-saglik-hesaplama-rehberi-2026",
    title: "2026 VKİ, Kalori ve Beslenme Hesapları Rehberi: İdeal Kilo, BMR ve Makro",
    description:
      "VKİ nedir, ideal kilo nasıl hesaplanır, günlük kalori ve makro besin ihtiyacı ne kadar? Sağlıklı beslenme kararları için adım adım kılavuz.",
    category: "Yaşam Hesaplamaları",
    categorySlug: "yasam-hesaplama",
    publishedAt: "2026-03-08",
    updatedAt: "2026-03-08",
    readingTime: 9,
    relatedCalculators: ["vucut-kitle-indeksi-hesaplama", "ideal-kilo-hesaplama", "gunluk-kalori-ihtiyaci", "gunluk-makro-besin-ihtiyaci-hesaplama", "gunluk-protein-ihtiyaci-hesaplama", "bazal-metabolizma-hizi-hesaplama", "vucut-yag-orani-hesaplama"],
    keywords: ["vki hesaplama", "ideal kilo hesaplama", "gunluk kalori ihtiyaci", "bazal metabolizma hizi", "makro besin hesaplama"],
    content: `<h2>VKİ (Vücut Kitle İndeksi) Nedir?</h2>
<p>Vücut Kitle İndeksi, ağırlık (kg) değerinin boyun metre cinsinden karesine bölünmesiyle hesaplanan basit bir tarama ölçütüdür. DSÖ sınıflandırmasına göre <strong>18,5–24,9 arası normal; 25–29,9 fazla kilolu; 30 ve üzeri obez</strong> olarak tanımlanır. VKİ tek başına tanı koymaz; yüksek kas kütlesi olan sporcularda yanıltıcı sonuç verebilir.</p>
<h2>İdeal Kilo Nasıl Hesaplanır?</h2>
<p>İdeal kilo hesaplamaları Hamwi, Devine veya Robinson formülleri gibi farklı yöntemlere dayanır. Sonuçlar birbirinden farklı aralıklar verebilir; önemli olan belirli bir skala sonucuna odaklanmak değil, genel sağlıklı bir VKİ aralığında kalmaktır.</p>
<h2>Bazal Metabolizma Hızı (BMR) ve Günlük Kalori</h2>
<p>Bazal Metabolizma Hızı, dinlenme halinde vücudun ihtiyaç duyduğu minimum kaloriyi gösterir. Günlük toplam kalori ihtiyacı BMR'ye <strong>aktivite katsayısı (PAL)</strong> uygulanarak bulunur. Kilo verme, koruma veya alma hedefine göre bu rakama kalori fazlası veya eksiği eklenir.</p>
<h2>Makro Besin Hesabı</h2>
<p>Günlük kalori hedefine ulaşırken protein, karbonhidrat ve yağ oranlarının dengeli dağıtılması önemlidir:</p>
<ul>
  <li><strong>Protein</strong>: Kas koruma ve yapımı için vücut ağırlığı başına 1,6–2,2 g önerilir.</li>
  <li><strong>Karbonhidrat</strong>: Enerji dengesinin büyük bölümünü karşılar; glisemik indeks de göz önünde tutulmalıdır.</li>
  <li><strong>Yağ</strong>: Hormon üretimi ve yağda çözünen vitaminler için gereklidir.</li>
</ul>
<h2>Hamilelikte Beslenme Hesapları</h2>
<p>Gebelik döneminde kalori ihtiyacı trimester'a göre artar. Standart kalori hesaplayıcıları hamileliğe özgü ekleri tam yansıtmayabileceğinden, gebelik ve hamilelik haftası araçlarıyla birlikte okumak daha sağlıklıdır.</p>
<h2>Pratik Kullanım Sırası</h2>
<ul>
  <li>Önce <strong>VKİ Hesaplama</strong> ile mevcut kategorinizi görün.</li>
  <li>Ardından <strong>İdeal Kilo Hesaplama</strong> ile hedef aralığı belirleyin.</li>
  <li><strong>Bazal Metabolizma Hızı</strong> hesabıyla minimum kalori temelinizi öğrenin.</li>
  <li><strong>Günlük Kalori İhtiyacı</strong> aracıyla aktiviteye göre toplam kaloriyi bulun.</li>
  <li>Son olarak <strong>Makro Besin</strong> veya <strong>Günlük Protein İhtiyacı</strong> ile öğün planınızı yapılandırın.</li>
</ul>
<p>Bu sırayla ilerlemek beslenme kararlarını daha bilinçli ve ölçülebilir bir temele oturtmanıza yardımcı olur.</p>`,
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
