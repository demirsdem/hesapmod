export const GOLD_PAGE_PATH = "/finansal-hesaplamalar/altin-hesaplama";
export const GOLD_CANONICAL_URL = "https://www.hesapmod.com/finansal-hesaplamalar/altin-hesaplama";
export const GOLD_PAGE_TITLE = "Altın Hesaplama 2026 - Canlı Gram, Çeyrek ve Bilezik Çevirici";
export const GOLD_PAGE_DESCRIPTION = "Canlı alış/satış fiyatlarıyla gram altın, çeyrek altın, 22 ayar bilezik, cumhuriyet altını ve ons altını TL'ye çevirin. TL'den altına veya altından TL'ye anında hesaplama yapın.";

export const GOLD_EDITORIAL_REVIEW_DATE = "2026-05-19";

export const goldSeoSections = [
    {
        id: "nasil-yapilir",
        title: "Altın Hesaplama Nasıl Yapılır?",
        body: "Altın değeri, seçilen altın türünün has altın miktarı ile güncel gram altın fiyatının çarpılmasıyla hesaplanır. Temel formül şöyledir: Altın değeri = has altın gramı x güncel gram altın fiyatı. Altın alırken genellikle satış fiyatı, altın bozdururken ise alış fiyatı kullanılır. Kuyumcu, banka ve piyasa fiyatları arasında makas farkı olabilir.",
    },
    {
        id: "gram-altin",
        title: "Gram Altın Hesaplama",
        body: "Gram altın hesaplama, altının ayarına göre has altın oranı dikkate alınarak yapılır. 24 ayar gram altın saf altına en yakın değeri temsil eder. 22 ayar gram altında yaklaşık 0,917 gram, 18 ayar altında 0,750 gram, 14 ayar altında ise 0,583 gram has altın bulunur. Bu nedenle aynı gram ağırlığındaki farklı ayar altınların TL karşılığı farklıdır.",
    },
    {
        id: "ceyrek-altin",
        title: "Çeyrek Altın Hesaplama",
        body: "Çeyrek altın yaklaşık 1,754 gram toplam ağırlığa ve yaklaşık 1,604 gram has altın içeriğine sahiptir. Çeyrek altın hesaplanırken sadece has altın değeri değil, piyasa primi ve alış-satış makası da etkili olabilir. Çeyrek altın alırken satış fiyatı, bozdururken alış fiyatı dikkate alınır.",
    },
    {
        id: "22-ayar-bilezik",
        title: "22 Ayar Bilezik Hesaplama",
        body: "22 ayar bilezik hesaplamasında gram miktarı 0,917 has altın oranıyla değerlendirilir. Yaklaşık formül: 22 ayar bilezik değeri = gram miktarı x 24 ayar gram fiyatı x 0,917. Bilezik bozdururken işçilik bedeli genellikle geri ödenmez; çoğu durumda has altın değeri ve kuyumcu alış fiyatı esas alınır.",
    },
    {
        id: "14-18-ayar",
        title: "14 Ayar ve 18 Ayar Altın Hesaplama",
        body: "14 ayar altında her gramın yaklaşık 0,583 gramı, 18 ayar altında ise 0,750 gramı has altındır. Takı altınlarında işçilik, tasarım ve marka fiyatı satın alma fiyatına dahil olabilir; ancak bozdurma sırasında çoğunlukla has altın değeri esas alınır.",
    },
    {
        id: "bozdurma",
        title: "Altın Bozdurma Hesaplama",
        body: "Altın bozdururken alış fiyatı baz alınır. Kuyumcu veya banka, altını kullanıcıdan alış fiyatıyla alır. Satış fiyatı ise kullanıcının altın alırken ödediği fiyattır. Alış ve satış fiyatı arasındaki fark makas olarak adlandırılır. Makas kısa vadeli alım-satımda maliyet oluşturur.",
    },
    {
        id: "tl-altin",
        title: "TL'den Altına Hesaplama",
        body: "TL'den altına hesaplama, sahip olunan TL tutarının güncel satış fiyatına bölünmesiyle yapılır. Formül: alınabilecek gram = TL tutarı / satış fiyatı. Örneğin 10.000 TL ile kaç gram altın alınabileceği, güncel gram altın satış fiyatına göre değişir.",
    },
    {
        id: "ons",
        title: "Ons Altın ve Gram Altın İlişkisi",
        body: "Uluslararası piyasalarda altın genellikle ons bazında takip edilir. 1 troy ons 31,1035 gramdır. Türkiye'de gram altın fiyatı yaklaşık olarak şu formülle hesaplanabilir: gram altın = ons altın fiyatı x USD/TRY kuru / 31,1035. Bu nedenle hem ons altın fiyatı hem de dolar/TL kuru gram altın fiyatını etkiler.",
    },
];

export const goldFaqItems = [
    ["Altın hesaplama nasıl yapılır?", "Altın hesaplama, seçilen ürünün has altın miktarının güncel alış veya satış fiyatıyla çarpılmasıyla yapılır. Alımda satış fiyatı, bozdurmada alış fiyatı baz alınır."],
    ["1 gram altın kaç TL?", "1 gram altının TL karşılığı, güncel 24 ayar gram altın satış fiyatına göre değişir. Bu sayfadaki fiyat tablosunda son bilinen alış ve satış değerleri gösterilir."],
    ["Çeyrek altın kaç TL?", "Çeyrek altın fiyatı yaklaşık 1,604 gram has altın içeriği, piyasa primi ve alış-satış makasına göre değişir. Alırken satış, bozdururken alış fiyatı kullanılır."],
    ["22 ayar bilezik hesaplama nasıl yapılır?", "22 ayar bilezik değeri yaklaşık olarak gram miktarı x 24 ayar gram fiyatı x 0,917 formülüyle hesaplanır. Bozdurmada işçilik çoğu zaman geri ödenmez."],
    ["Altın bozdururken alış fiyatı mı satış fiyatı mı kullanılır?", "Altın bozdururken alış fiyatı kullanılır. Kuyumcu veya banka altını kullanıcıdan alış fiyatıyla alır."],
    ["Gram altın alırken hangi fiyat baz alınır?", "Gram altın alırken satış fiyatı baz alınır. Kullanıcı piyasadan altın alırken kurumun sattığı daha yüksek fiyatı öder."],
    ["Gram altın satarken hangi fiyat baz alınır?", "Gram altın satarken alış fiyatı baz alınır. Kurum kullanıcıdan altını alış fiyatıyla alır."],
    ["Altın alış satış makası nedir?", "Makas, aynı altın türü için alış ve satış fiyatı arasındaki farktır. Makas genişledikçe kısa vadeli al-sat maliyeti artar."],
    ["14 ayar altın ile 22 ayar altın arasındaki fark nedir?", "14 ayar altında her gramın yaklaşık 0,583 gramı, 22 ayarda ise yaklaşık 0,917 gramı has altındır. Bu yüzden aynı gram ağırlığında 22 ayar altın daha yüksek has altın içerir."],
    ["18 ayar altın nasıl hesaplanır?", "18 ayar altın için gram miktarı yaklaşık 0,750 has altın oranıyla değerlendirilir ve güncel gram altın fiyatıyla çarpılır."],
    ["Has altın nedir?", "Has altın, ürünün içindeki saf altın karşılığıdır. Ayar düştükçe aynı toplam ağırlık içinde daha fazla alaşım bulunur."],
    ["Cumhuriyet altını ile ata altın aynı mı?", "Piyasada adlar bazen karışsa da ürün tipi, basım ve has altın içeriği farklılaşabilir. Hesaplamada ürün türüne göre ayrı ağırlık değerleri kullanılmalıdır."],
    ["Banka altın fiyatı ile kuyumcu fiyatı neden farklıdır?", "Likidite, operasyon maliyeti, fiziki ürün primi, piyasa oynaklığı ve kurum politikası nedeniyle banka ve kuyumcu fiyatları farklı olabilir."],
    ["TL'den altına hesaplama nasıl yapılır?", "TL tutarı, alınacak altın türünün satış fiyatına bölünür. Böylece yaklaşık kaç gram veya kaç adet alınabileceği bulunur."],
    ["10000 TL kaç gram altın eder?", "10.000 TL'nin kaç gram altın edeceği güncel satış fiyatına bağlıdır. Hesaplayıcı TL'den altına modunda bu değeri otomatik hesaplar."],
    ["İşçilikli altın bozdururken zarar edilir mi?", "İşçilikli takılarda satın alma fiyatındaki işçilik ve marka payı bozdurma sırasında çoğu zaman geri ödenmez; bu nedenle zarar oluşabilir."],
    ["Altın hesaplama sonucu kesin midir?", "Hayır. Sonuçlar yaklaşık ve bilgilendirme amaçlıdır. İşlem yapmadan önce banka veya kuyumcunun anlık fiyatı kontrol edilmelidir."],
    ["Altın fiyatları ne sıklıkla güncellenir?", "Sayfa son başarılı fiyat verisini gösterir. Güncelleme sıklığı veri kaynağı, cache ve piyasa erişimine göre değişebilir."],
].map(([question, answer]) => ({ question, answer }));
