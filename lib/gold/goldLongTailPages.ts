import type { GoldTypeId } from "@/lib/gold/goldPriceTypes";

export type GoldLongTailSlug =
    | "gram-altin-hesaplama"
    | "ceyrek-altin-hesaplama"
    | "22-ayar-bilezik-hesaplama"
    | "altin-bozdurma-hesaplama"
    | "tl-altin-hesaplama"
    | "14-ayar-altin-hesaplama"
    | "18-ayar-altin-hesaplama";

export type GoldLongTailMode = "altindan-tlye" | "tlden-altina" | "bozdurma";

export type GoldLongTailPageConfig = {
    slug: GoldLongTailSlug;
    title: string;
    metaDescription: string;
    h1: string;
    intro: string;
    targetQueries: string[];
    goldType: GoldTypeId;
    mode: GoldLongTailMode;
    amount: number;
    content: Array<{ title: string; body: string }>;
    faq: Array<{ question: string; answer: string }>;
};

export const GOLD_LONG_TAIL_PAGES: Record<GoldLongTailSlug, GoldLongTailPageConfig> = {
    "gram-altin-hesaplama": {
        slug: "gram-altin-hesaplama",
        title: "Gram Altın Hesaplama 2026 - 1, 10 ve 100 Gram Altın Kaç TL?",
        metaDescription: "Canlı gram altın alış/satış fiyatıyla 1 gram, 10 gram ve 100 gram altının TL karşılığını hesaplayın. TL'den gram altına dönüşümü görün.",
        h1: "Gram Altın Hesaplama - 1, 10 ve 100 Gram Altın Kaç TL?",
        intro: "24 ayar gram altın satış fiyatıyla altından TL'ye veya TL'den gram altına hızlı dönüşüm yapın.",
        targetQueries: ["gram altın hesaplama", "1 gram altın kaç TL", "10 gram altın kaç TL", "100 gram altın kaç TL"],
        goldType: "gram24k",
        mode: "altindan-tlye",
        amount: 10,
        content: [
            { title: "Gram altın nasıl hesaplanır?", body: "Gram altın değeri, girilen gram miktarının güncel 24 ayar gram altın fiyatıyla çarpılmasıyla bulunur. Alım için satış fiyatı, bozdurma için alış fiyatı esas alınır." },
            { title: "1 gram ve 10 gram altın hesabı", body: "1 gram hesabı birim fiyatı görmenizi, 10 gram hesabı ise küçük birikimlerin toplam değerini pratik biçimde kıyaslamanızı sağlar." },
        ],
        faq: [
            { question: "1 gram altın kaç TL?", answer: "1 gram altın güncel satış fiyatına göre değişir; bu sayfadaki tabloda son bilinen alış ve satış fiyatı gösterilir." },
            { question: "Gram altın satarken hangi fiyat kullanılır?", answer: "Satarken veya bozdururken alış fiyatı kullanılır." },
        ],
    },
    "ceyrek-altin-hesaplama": {
        slug: "ceyrek-altin-hesaplama",
        title: "Çeyrek Altın Hesaplama 2026 - Çeyrek Altın Kaç TL?",
        metaDescription: "Canlı çeyrek altın alış/satış fiyatıyla 1, 5 ve 10 çeyrek altının yaklaşık TL karşılığını hesaplayın.",
        h1: "Çeyrek Altın Hesaplama - Çeyrek Altın Kaç TL?",
        intro: "Çeyrek altının son bilinen alış/satış fiyatıyla adet bazlı TL karşılığını hesaplayın.",
        targetQueries: ["çeyrek altın hesaplama", "çeyrek altın kaç TL", "1 çeyrek altın kaç TL", "10 çeyrek altın kaç TL"],
        goldType: "ceyrek",
        mode: "altindan-tlye",
        amount: 1,
        content: [
            { title: "Çeyrek altın hesabı neden farklıdır?", body: "Çeyrek altın yaklaşık 1,604 gram has altın içerir. Piyasa primi ve alış-satış makası nedeniyle fiyatı yalnız gram ağırlığıyla birebir hesaplanmaz." },
            { title: "Çeyrek altın bozdurma", body: "Çeyrek altın bozdururken kuyumcu veya banka alış fiyatı esas alınır. Alırken ise satış fiyatı ödenir." },
        ],
        faq: [
            { question: "Çeyrek altın kaç gramdır?", answer: "Yaklaşık toplam ağırlığı 1,754 gram, has altın içeriği yaklaşık 1,604 gramdır." },
            { question: "10 çeyrek altın nasıl hesaplanır?", answer: "Çeyrek altının güncel birim fiyatı 10 ile çarpılır; işlem yönüne göre alış veya satış fiyatı seçilir." },
        ],
    },
    "22-ayar-bilezik-hesaplama": {
        slug: "22-ayar-bilezik-hesaplama",
        title: "22 Ayar Bilezik Hesaplama 2026 - Bilezik Bozdurma Değeri",
        metaDescription: "22 ayar bilezik gramını canlı altın fiyatıyla hesaplayın. 10 gram, 20 gram ve bilezik bozdurma değerini yaklaşık görün.",
        h1: "22 Ayar Bilezik Hesaplama - Bilezik Bozdurma Değeri",
        intro: "22 ayar bilezikte gram miktarını 0,917 has altın oranıyla değerlendirerek yaklaşık TL karşılığını görün.",
        targetQueries: ["22 ayar bilezik hesaplama", "22 ayar bilezik bozdurma hesaplama", "10 gram 22 ayar bilezik kaç TL"],
        goldType: "gram22k",
        mode: "bozdurma",
        amount: 10,
        content: [
            { title: "22 ayar bilezik nasıl hesaplanır?", body: "Yaklaşık formül gram miktarı x 24 ayar gram fiyatı x 0,917 şeklindedir. Bozdurma tarafında alış fiyatı kullanılır." },
            { title: "İşçilik bozdurmada geri alınır mı?", body: "Takı ve bileziklerde işçilik çoğu durumda bozdurma fiyatına tam yansımaz. Bu yüzden sonuç has altın değeri olarak yorumlanmalıdır." },
        ],
        faq: [
            { question: "22 ayar bilezikte has oran nedir?", answer: "22 ayarda her gram yaklaşık 0,917 gram has altın içerir." },
            { question: "Bilezik bozdururken satış fiyatı mı kullanılır?", answer: "Hayır. Bozdurma işleminde alış fiyatı esas alınır." },
        ],
    },
    "altin-bozdurma-hesaplama": {
        slug: "altin-bozdurma-hesaplama",
        title: "Altın Bozdurma Hesaplama 2026 - Kuyumcu Alış Fiyatı",
        metaDescription: "Gram, çeyrek, bilezik ve cumhuriyet altını bozdururken yaklaşık TL karşılığını alış fiyatıyla hesaplayın.",
        h1: "Altın Bozdurma Hesaplama - Kuyumcu Alış Fiyatı",
        intro: "Altın satarken veya bozdururken alış fiyatı baz alınır. Seçtiğiniz ürün için yaklaşık bozdurma değerini hesaplayın.",
        targetQueries: ["altın bozdurma hesaplama", "kuyumcu altın bozdurma hesaplama", "altın satarken hangi fiyat kullanılır"],
        goldType: "gram24k",
        mode: "bozdurma",
        amount: 10,
        content: [
            { title: "Altın bozdurma hesabı nasıl yapılır?", body: "Seçilen altın türünün miktarı güncel alış fiyatıyla çarpılır. Alış fiyatı kurumun kullanıcıdan altını aldığı fiyattır." },
            { title: "Makas bozdurma sonucunu nasıl etkiler?", body: "Alış ve satış fiyatı arasındaki makas arttığında, kısa vadeli bozdurma sonucunda maliyet daha görünür hale gelir." },
        ],
        faq: [
            { question: "Altın bozdururken hangi fiyat kullanılır?", answer: "Alış fiyatı kullanılır." },
            { question: "Kuyumcu fiyatı banka fiyatından farklı olabilir mi?", answer: "Evet. Likidite, fiziki ürün primi ve kurum politikası nedeniyle farklı olabilir." },
        ],
    },
    "tl-altin-hesaplama": {
        slug: "tl-altin-hesaplama",
        title: "TL'den Altına Hesaplama 2026 - 10000 TL Kaç Gram Altın?",
        metaDescription: "TL tutarınızı canlı gram altın satış fiyatına bölerek kaç gram altın alınabileceğini hesaplayın. 1000, 10000 ve 100000 TL senaryoları.",
        h1: "TL'den Altına Hesaplama - 10000 TL Kaç Gram Altın?",
        intro: "TL tutarınızı güncel satış fiyatına bölerek yaklaşık kaç gram altın alınabileceğini görün.",
        targetQueries: ["TL'den altına hesaplama", "1000 TL kaç gram altın", "10000 TL kaç gram altın", "100000 TL kaç gram altın"],
        goldType: "gram24k",
        mode: "tlden-altina",
        amount: 10000,
        content: [
            { title: "TL'den gram altına dönüşüm", body: "Alınabilecek gram = TL tutarı / güncel satış fiyatı formülüyle hesaplanır. Alım senaryosunda satış fiyatı kullanılır." },
            { title: "10.000 TL altın hesabı", body: "10.000 TL'nin kaç gram altın edeceği güncel satış fiyatına ve kurum makasına göre değişir." },
        ],
        faq: [
            { question: "10000 TL kaç gram altın eder?", answer: "Güncel gram altın satış fiyatına bölünerek bulunur." },
            { question: "TL'den altına geçerken alış mı satış mı kullanılır?", answer: "Kullanıcı altın aldığı için satış fiyatı kullanılır." },
        ],
    },
    "14-ayar-altin-hesaplama": {
        slug: "14-ayar-altin-hesaplama",
        title: "14 Ayar Altın Hesaplama 2026 - 14 Ayar Altın Kaç TL?",
        metaDescription: "14 ayar altın gramını 0,583 has altın oranıyla hesaplayın. Bozdurma ve TL karşılığı için canlı fiyatlı araç.",
        h1: "14 Ayar Altın Hesaplama - 14 Ayar Altın Kaç TL?",
        intro: "14 ayar altında her gramın yaklaşık 0,583 gramı has altındır. Gram miktarına göre yaklaşık değeri hesaplayın.",
        targetQueries: ["14 ayar altın hesaplama", "14 ayar altın bozdurma", "14 ayar altın kaç TL"],
        goldType: "gram14k",
        mode: "bozdurma",
        amount: 10,
        content: [
            { title: "14 ayar altın nasıl hesaplanır?", body: "14 ayar altında gram miktarı yaklaşık 0,583 has altın oranıyla çarpılır ve güncel gram altın fiyatıyla değerlendirilir." },
            { title: "14 ayar takı bozdurma", body: "Takı ürünlerinde işçilik bedeli bozdurma sırasında tam karşılık bulmayabilir; sonuç yaklaşık has altın değeridir." },
        ],
        faq: [
            { question: "14 ayar altında has oran kaçtır?", answer: "Yaklaşık 0,583'tür." },
            { question: "14 ayar altın bozdurma kesin sonuç verir mi?", answer: "Hayır. Kuyumcu fiyatı ve işçilik etkisi nedeniyle yaklaşık sonuçtur." },
        ],
    },
    "18-ayar-altin-hesaplama": {
        slug: "18-ayar-altin-hesaplama",
        title: "18 Ayar Altın Hesaplama 2026 - 18 Ayar Altın Kaç TL?",
        metaDescription: "18 ayar altın gramını 0,750 has altın oranıyla hesaplayın. Canlı fiyatla TL karşılığı ve bozdurma değeri.",
        h1: "18 Ayar Altın Hesaplama - 18 Ayar Altın Kaç TL?",
        intro: "18 ayar altında her gramın yaklaşık 0,750 gramı has altındır. Gram miktarına göre yaklaşık TL değerini görün.",
        targetQueries: ["18 ayar altın hesaplama", "18 ayar altın kaç TL", "18 ayar altın bozdurma"],
        goldType: "gram18k",
        mode: "bozdurma",
        amount: 10,
        content: [
            { title: "18 ayar altın nasıl hesaplanır?", body: "18 ayar altında gram miktarı 0,750 has altın oranıyla değerlendirilir. Alımda satış, bozdurmada alış fiyatı kullanılır." },
            { title: "18 ayar altın ve takı fiyatı", body: "Takı fiyatında işçilik ve tasarım payı olabilir; bozdurma sırasında çoğu zaman has altın değeri öne çıkar." },
        ],
        faq: [
            { question: "18 ayar altında has oran kaçtır?", answer: "Yaklaşık 0,750'dir." },
            { question: "18 ayar altın satarken hangi fiyat kullanılır?", answer: "Satarken veya bozdururken alış fiyatı kullanılır." },
        ],
    },
};

export const GOLD_LONG_TAIL_SLUGS = Object.keys(GOLD_LONG_TAIL_PAGES) as GoldLongTailSlug[];

export function getGoldLongTailPage(slug: GoldLongTailSlug) {
    return GOLD_LONG_TAIL_PAGES[slug];
}
