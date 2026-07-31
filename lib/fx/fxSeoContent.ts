export const FX_PAGE_PATH = "/finansal-hesaplamalar/doviz-hesaplama";
export const FX_CANONICAL_URL = "https://www.hesapmod.com/finansal-hesaplamalar/doviz-hesaplama";
export const FX_PAGE_TITLE = "Döviz Hesaplama 2026 - Canlı Dolar, Euro ve Sterlin Çevirici";
export const FX_PAGE_DESCRIPTION = "Güncel alış/satış kurlarıyla dolar, euro, sterlin ve diğer para birimlerini TL'ye çevirin. TL'den dövize veya dövizden TL'ye anlık hesaplama yapın.";
export const FX_LAST_REVIEWED = "2026-05-19";

export const fxSeoSections = [
    {
        id: "nasil-yapilir",
        title: "Döviz Hesaplama Nasıl Yapılır?",
        body: "Döviz hesaplama, çevrilecek para biriminin güncel alış veya satış kuru ile miktarın çarpılması ya da bölünmesiyle yapılır. Döviz alırken genellikle satış kuru, döviz bozdururken ise alış kuru kullanılır. Örneğin 100 dolar bozdururken USD alış kuru dikkate alınır; 100 dolar satın alırken USD satış kuru kullanılır.",
    },
    {
        id: "dolar-hesaplama",
        title: "Dolar Hesaplama",
        body: "Dolar hesaplama, USD/TRY alış veya satış kuruna göre yapılır. Dolar almak istiyorsanız satış kuru, dolar bozdurmak istiyorsanız alış kuru dikkate alınır. Bu nedenle 100 dolar kaç TL sorusunun cevabı işlem yönüne göre değişebilir.",
    },
    {
        id: "euro-hesaplama",
        title: "Euro Hesaplama",
        body: "Euro hesaplama, EUR/TRY alış ve satış kurları üzerinden yapılır. Euro almak isteyen kullanıcı satış kurunu, euro bozdurmak isteyen kullanıcı alış kurunu dikkate almalıdır. Banka, döviz bürosu ve serbest piyasa kurları arasında fark olabilir.",
    },
    {
        id: "sterlin-hesaplama",
        title: "Sterlin Hesaplama",
        body: "Sterlin hesaplama, GBP/TRY alış veya satış kuru ile yapılır. İngiliz sterlini genellikle dolar ve euroya göre daha yüksek nominal kura sahip olduğu için küçük kur farkları bile toplam TL karşılığını etkileyebilir.",
    },
    {
        id: "tlden-dovize",
        title: "TL'den Dövize Hesaplama",
        body: "TL'den dövize hesaplama, sahip olunan TL tutarının ilgili para biriminin satış kuruna bölünmesiyle yapılır. Formül: alınabilecek döviz = TL tutarı / satış kuru. Örneğin 10.000 TL ile kaç dolar alınabileceği, güncel USD satış kuruna göre değişir.",
    },
    {
        id: "bozdurma",
        title: "Döviz Bozdurma Hesaplama",
        body: "Döviz bozdurma hesaplamasında alış kuru baz alınır. Banka veya döviz bürosu kullanıcıdan dövizi alış kuru üzerinden alır. Bu nedenle ekranda görülen satış kuru ile bozdurma sonucu aynı olmayabilir.",
    },
    {
        id: "makas",
        title: "Döviz Alış Satış Makası Nedir?",
        body: "Döviz makası, alış kuru ile satış kuru arasındaki farktır. Makas tutarı = satış kuru - alış kuru formülüyle hesaplanır. Makas yüzdesi ise bu farkın alış kuruna oranlanmasıyla bulunabilir. Kısa vadeli döviz alım satımında makas önemli bir maliyet unsurudur.",
    },
    {
        id: "kur-farki",
        title: "TCMB Kuru, Banka Kuru ve Serbest Piyasa Kuru Farkı",
        body: "TCMB kurları gösterge niteliği taşır ve işlem yapılacak kurla birebir aynı olmayabilir. Bankalar, döviz büroları ve serbest piyasa kendi alış/satış kurlarını uygulayabilir. Bu nedenle hesaplama sonucu yaklaşık değer verir; işlem öncesinde ilgili kurumun güncel kuru kontrol edilmelidir.",
    },
    {
        id: "bsmv",
        title: "Kambiyo Vergisi ve Döviz Alım Maliyeti",
        body: "Döviz alım işlemlerinde uygulanabilecek kambiyo vergisi/BSMV oranı mevzuata, işlem türüne, kuruma ve muafiyet durumuna göre değişebilir. HesapMod varsayılan oranla yaklaşık maliyet gösterebilir; ancak işlem öncesi bankanızın ve resmi mevzuatın güncel oranlarını kontrol etmeniz gerekir.",
    },
];

export const fxFaqItems = [
    ["Döviz hesaplama nasıl yapılır?", "Döviz hesaplama, miktarın ilgili para biriminin alış veya satış kuru ile çarpılması ya da TL tutarının satış kuruna bölünmesiyle yapılır."],
    ["1 dolar kaç TL?", "1 doların TL karşılığı güncel USD/TRY alış ve satış kuruna göre değişir. Döviz alıyorsanız satış, bozduruyorsanız alış kuru dikkate alınır."],
    ["100 dolar kaç TL?", "100 doların TL karşılığı, işlem yönüne göre USD alış veya satış kurunun 100 ile çarpılmasıyla hesaplanır."],
    ["1000 dolar kaç TL?", "1000 dolar kaç TL sorusunda kesin cevap işlem yapılan banka veya döviz bürosunun anlık alış/satış kuruna göre değişir."],
    ["1 euro kaç TL?", "1 euro kaç TL hesabı EUR/TRY alış ve satış kurlarıyla yapılır. Sayfadaki tablo son bilinen yaklaşık değerleri gösterir."],
    ["100 euro kaç TL?", "100 euro bozdururken alış kuru, euro alırken satış kuru kullanılır; bu yüzden sonuç işlem yönüne göre farklılaşır."],
    ["1 sterlin kaç TL?", "1 sterlinin TL karşılığı GBP/TRY alış ve satış kuruna göre hesaplanır."],
    ["TL'den dolara hesaplama nasıl yapılır?", "TL'den dolara hesaplama için TL tutarı USD satış kuruna bölünür. Böylece yaklaşık kaç dolar alınabileceği bulunur."],
    ["TL'den euroya hesaplama nasıl yapılır?", "TL'den euroya hesaplama için TL tutarı EUR satış kuruna bölünür. Banka ve döviz bürosu kuru farklı olabilir."],
    ["Döviz alırken alış kuru mu satış kuru mu kullanılır?", "Döviz alırken genellikle bankanın veya döviz bürosunun satış kuru kullanılır. Çünkü kurum dövizi kullanıcıya satış kuru üzerinden satar."],
    ["Döviz bozdururken hangi kur kullanılır?", "Döviz bozdururken alış kuru kullanılır. Çünkü banka veya döviz bürosu dövizi kullanıcıdan alış kuru üzerinden alır."],
    ["Döviz alış satış makası nedir?", "Döviz alış satış makası, alış kuru ile satış kuru arasındaki farktır. Bu fark işlem maliyetinin önemli bir parçasıdır."],
    ["TCMB kuru ile banka kuru neden farklıdır?", "TCMB kuru gösterge niteliğindedir. Bankalar kendi maliyet, likidite ve kar marjına göre farklı alış/satış kuru uygulayabilir."],
    ["Serbest piyasa kuru nedir?", "Serbest piyasa kuru, piyasadaki arz-talep ve işlem koşullarına göre oluşan döviz fiyatını ifade eder."],
    ["Dolar euro çevirme nasıl yapılır?", "Dolar euro çevirme, USD/TRY ve EUR/TRY kurlarından türetilen çapraz kurla yaklaşık olarak yapılabilir."],
    ["Çapraz kur nedir?", "Çapraz kur, iki yabancı para biriminin birbirine göre değeridir. Örneğin USD/EUR, doların euro karşılığını gösterir."],
    ["Kambiyo vergisi/BSMV nedir?", "Kambiyo vergisi veya BSMV, bazı döviz alım işlemlerinde uygulanabilecek vergidir. Oran mevzuata ve işlem türüne göre değişebilir."],
    ["Döviz hesaplama sonucu kesin midir?", "Hayır. Sonuçlar bilgilendirme amaçlı yaklaşık değerlerdir. Banka, döviz bürosu, serbest piyasa ve işlem saatine göre uygulanan kur değişebilir."],
    ["Döviz kurları ne sıklıkla güncellenir?", "Sayfadaki canlı veri mümkün olduğunda periyodik olarak yenilenir; kaynak erişilemezse son başarılı veri gösterilebilir."],
    ["Banka ve döviz bürosu kuru neden farklıdır?", "Her kurum kendi maliyetini, stok durumunu ve kar marjını kura yansıtabilir. Bu yüzden aynı anda farklı fiyatlar görülebilir."],
] as const;
