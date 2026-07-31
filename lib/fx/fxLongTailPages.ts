import type { CurrencyCode } from "@/lib/fx/fxPriceTypes";

export type FxLongTailSlug =
    | "dolar-hesaplama"
    | "euro-hesaplama"
    | "sterlin-hesaplama"
    | "tl-dolar-hesaplama"
    | "tl-euro-hesaplama"
    | "dolar-euro-hesaplama"
    | "euro-dolar-hesaplama"
    | "doviz-makas-hesaplama";

export type FxLongTailMode = "fx-to-try" | "try-to-fx" | "cross" | "makas";

export type FxLongTailPageConfig = {
    slug: FxLongTailSlug;
    title: string;
    metaDescription: string;
    h1: string;
    intro: string;
    targetQueries: string[];
    mode: FxLongTailMode;
    from: CurrencyCode;
    to: CurrencyCode;
    amount: number;
    content: Array<{ title: string; body: string }>;
    faq: Array<{ question: string; answer: string }>;
};

export const FX_LONG_TAIL_PAGES: Record<FxLongTailSlug, FxLongTailPageConfig> = {
    "dolar-hesaplama": {
        slug: "dolar-hesaplama",
        title: "Dolar Hesaplama 2026 - 1, 100 ve 1000 Dolar Kaç TL?",
        metaDescription: "Canlı USD/TRY alış ve satış kuruyla 1 dolar, 100 dolar ve 1000 dolar kaç TL hesaplayın. Dolar bozdurma ve dolar alma sonucunu görün.",
        h1: "Dolar Hesaplama - 1, 100 ve 1000 Dolar Kaç TL?",
        intro: "USD/TRY alış ve satış kuruyla doların TL karşılığını hesaplayın; dolar alırken satış, bozdururken alış kurunu dikkate alın.",
        targetQueries: ["dolar hesaplama", "dolar TL hesaplama", "1 dolar kaç TL", "100 dolar kaç TL", "1000 dolar kaç TL"],
        mode: "fx-to-try",
        from: "USD",
        to: "EUR",
        amount: 100,
        content: [
            { title: "Dolar TL hesabı nasıl yapılır?", body: "Dolar TL hesabında miktar USD/TRY kuru ile çarpılır. Döviz alırken satış kuru, dolar bozdururken alış kuru kullanılır." },
            { title: "100 dolar ve 1000 dolar hesabı", body: "100 dolar veya 1000 dolar kaç TL sorusunun cevabı bankanın, döviz bürosunun veya serbest piyasanın anlık alış/satış kuruna göre değişebilir." },
        ],
        faq: [
            { question: "1 dolar kaç TL?", answer: "1 doların TL karşılığı güncel USD/TRY alış ve satış kuruna göre değişir." },
            { question: "Dolar alırken hangi kur kullanılır?", answer: "Dolar alırken kurumun satış kuru kullanılır." },
        ],
    },
    "euro-hesaplama": {
        slug: "euro-hesaplama",
        title: "Euro Hesaplama 2026 - 1, 100 ve 1000 Euro Kaç TL?",
        metaDescription: "Canlı EUR/TRY alış ve satış kuruyla euro TL hesaplama yapın. 1 euro, 100 euro ve 1000 euro kaç TL görün.",
        h1: "Euro Hesaplama - 1, 100 ve 1000 Euro Kaç TL?",
        intro: "EUR/TRY alış ve satış kuruyla eurodan TL'ye veya TL'den euroya yaklaşık dönüşüm yapın.",
        targetQueries: ["euro hesaplama", "euro TL hesaplama", "1 euro kaç TL", "100 euro kaç TL", "1000 euro kaç TL"],
        mode: "fx-to-try",
        from: "EUR",
        to: "USD",
        amount: 100,
        content: [
            { title: "Euro TL hesabı nasıl yapılır?", body: "Euro TL karşılığı, euro miktarının EUR/TRY alış veya satış kuru ile çarpılmasıyla hesaplanır." },
            { title: "Euro alırken ve bozdururken fark", body: "Euro alırken satış kuru, euro bozdururken alış kuru geçerlidir. Alış-satış farkı toplam sonucu etkiler." },
        ],
        faq: [
            { question: "100 euro kaç TL?", answer: "100 euro, işlem yönüne göre EUR alış veya satış kurunun 100 ile çarpılmasıyla hesaplanır." },
            { question: "Euro bozdururken hangi kur kullanılır?", answer: "Euro bozdururken alış kuru kullanılır." },
        ],
    },
    "sterlin-hesaplama": {
        slug: "sterlin-hesaplama",
        title: "Sterlin Hesaplama 2026 - Sterlin Kaç TL?",
        metaDescription: "Canlı GBP/TRY alış ve satış kuruyla sterlin TL hesaplama yapın. 1 sterlin ve 100 sterlin kaç TL görün.",
        h1: "Sterlin Hesaplama - Sterlin Kaç TL?",
        intro: "İngiliz sterlininin TL karşılığını GBP/TRY alış ve satış kurlarına göre hesaplayın.",
        targetQueries: ["sterlin hesaplama", "sterlin kaç TL", "1 sterlin kaç TL", "pound hesaplama"],
        mode: "fx-to-try",
        from: "GBP",
        to: "USD",
        amount: 100,
        content: [
            { title: "Sterlin TL hesabı nasıl yapılır?", body: "Sterlin miktarı GBP/TRY kuru ile çarpılır. İşlem yönü alış veya satış kurunun seçilmesini belirler." },
            { title: "Pound ve sterlin aynı mı?", body: "Türkiye'de pound ifadesi genellikle İngiliz sterlini için kullanılır. Hesaplamada GBP kodu esas alınır." },
        ],
        faq: [
            { question: "1 sterlin kaç TL?", answer: "1 sterlinin TL karşılığı güncel GBP/TRY alış ve satış kuruna göre değişir." },
            { question: "Sterlin alırken hangi kur kullanılır?", answer: "Sterlin alırken satış kuru kullanılır." },
        ],
    },
    "tl-dolar-hesaplama": {
        slug: "tl-dolar-hesaplama",
        title: "TL'den Dolara Hesaplama 2026 - 10000 TL Kaç Dolar?",
        metaDescription: "TL tutarınızı güncel USD satış kuruna bölerek kaç dolar alınabileceğini hesaplayın. 1000, 10000 ve 100000 TL dolar karşılığı.",
        h1: "TL'den Dolara Hesaplama - 10000 TL Kaç Dolar?",
        intro: "TL tutarınızı USD satış kuruna bölerek yaklaşık kaç dolar alınabileceğini hesaplayın.",
        targetQueries: ["TL'den dolara hesaplama", "1000 TL kaç dolar", "10000 TL kaç dolar", "100000 TL kaç dolar"],
        mode: "try-to-fx",
        from: "USD",
        to: "USD",
        amount: 10000,
        content: [
            { title: "TL'den dolar hesabı nasıl yapılır?", body: "Alınabilecek dolar = TL tutarı / USD satış kuru formülüyle hesaplanır. Kullanıcı dolar aldığı için satış kuru esas alınır." },
            { title: "10.000 TL kaç dolar?", body: "10.000 TL'nin kaç dolar edeceği güncel USD satış kuruna ve kurumun uyguladığı makasa göre değişir." },
        ],
        faq: [
            { question: "10000 TL kaç dolar eder?", answer: "10.000 TL güncel USD satış kuruna bölünerek yaklaşık dolar miktarı bulunur." },
            { question: "TL'den dolara geçerken alış mı satış mı?", answer: "Kullanıcı dolar aldığı için satış kuru kullanılır." },
        ],
    },
    "tl-euro-hesaplama": {
        slug: "tl-euro-hesaplama",
        title: "TL'den Euroya Hesaplama 2026 - 10000 TL Kaç Euro?",
        metaDescription: "TL tutarınızı güncel EUR satış kuruna bölerek kaç euro alınabileceğini hesaplayın. 1000, 10000 ve 100000 TL euro karşılığı.",
        h1: "TL'den Euroya Hesaplama - 10000 TL Kaç Euro?",
        intro: "TL tutarınızı EUR satış kuruna bölerek yaklaşık kaç euro alınabileceğini görün.",
        targetQueries: ["TL'den euroya hesaplama", "1000 TL kaç euro", "10000 TL kaç euro", "100000 TL kaç euro"],
        mode: "try-to-fx",
        from: "EUR",
        to: "EUR",
        amount: 10000,
        content: [
            { title: "TL'den euro hesabı nasıl yapılır?", body: "Alınabilecek euro = TL tutarı / EUR satış kuru formülüyle hesaplanır." },
            { title: "Euro alımında makas etkisi", body: "Banka veya döviz bürosunun satış kuru yükseldikçe aynı TL ile alınabilecek euro miktarı azalır." },
        ],
        faq: [
            { question: "10000 TL kaç euro eder?", answer: "10.000 TL güncel EUR satış kuruna bölünerek yaklaşık euro miktarı bulunur." },
            { question: "TL'den euroya geçerken hangi kur kullanılır?", answer: "Euro alındığı için satış kuru kullanılır." },
        ],
    },
    "dolar-euro-hesaplama": {
        slug: "dolar-euro-hesaplama",
        title: "Dolar Euro Hesaplama 2026 - USD EUR Çevirici",
        metaDescription: "Dolar euro çevirici ile USD/EUR çapraz kurunu hesaplayın. 1 dolar ve 100 dolar kaç euro yaklaşık görün.",
        h1: "Dolar Euro Hesaplama - USD EUR Çevirici",
        intro: "USD ve EUR kurlarından türetilen çapraz kurla doların euro karşılığını yaklaşık hesaplayın.",
        targetQueries: ["dolar euro çevirici", "dolar euro hesaplama", "USD EUR hesaplama", "1 dolar kaç euro"],
        mode: "cross",
        from: "USD",
        to: "EUR",
        amount: 100,
        content: [
            { title: "Dolar euro çevirme nasıl yapılır?", body: "USD/TRY ve EUR/TRY kurları üzerinden yaklaşık USD/EUR paritesi türetilir." },
            { title: "Çapraz kur neden yaklaşık?", body: "Bankalar ve aracı kurumlar doğrudan USD/EUR paritesinde farklı makas uygulayabilir. Bu sayfadaki değer bilgilendirme amaçlıdır." },
        ],
        faq: [
            { question: "1 dolar kaç euro?", answer: "USD/EUR çapraz kuru güncel dolar ve euro kurlarına göre değişir." },
            { question: "Dolar euro çevirici kesin işlem kuru mudur?", answer: "Hayır. Sonuç yaklaşık olup kurum pariteleri farklı olabilir." },
        ],
    },
    "euro-dolar-hesaplama": {
        slug: "euro-dolar-hesaplama",
        title: "Euro Dolar Hesaplama 2026 - EUR USD Çevirici",
        metaDescription: "Euro dolar çevirici ile EUR/USD çapraz kurunu hesaplayın. 1 euro ve 100 euro kaç dolar yaklaşık görün.",
        h1: "Euro Dolar Hesaplama - EUR USD Çevirici",
        intro: "EUR ve USD kurlarından türetilen çapraz kurla euronun dolar karşılığını yaklaşık hesaplayın.",
        targetQueries: ["euro dolar çevirici", "euro dolar hesaplama", "EUR USD hesaplama", "1 euro kaç dolar"],
        mode: "cross",
        from: "EUR",
        to: "USD",
        amount: 100,
        content: [
            { title: "Euro dolar hesabı nasıl yapılır?", body: "EUR/TRY ve USD/TRY kurları karşılaştırılarak yaklaşık EUR/USD paritesi hesaplanır." },
            { title: "Parite sonucu nasıl okunur?", body: "Sonuç 1 euro karşılığında yaklaşık kaç dolar alınabileceğini gösterir; gerçek işlem kuru kuruma göre değişebilir." },
        ],
        faq: [
            { question: "1 euro kaç dolar?", answer: "EUR/USD çapraz kuru piyasa koşullarına göre değişir." },
            { question: "Euro dolar çevirme TL üzerinden mi yapılır?", answer: "Bu sayfada yaklaşık hesap TRY bazlı kurlardan türetilir." },
        ],
    },
    "doviz-makas-hesaplama": {
        slug: "doviz-makas-hesaplama",
        title: "Döviz Makas Hesaplama 2026 - Alış Satış Farkı",
        metaDescription: "Döviz alış satış makasını hesaplayın. Dolar, euro ve sterlin için makas tutarı ve makas yüzdesini görün.",
        h1: "Döviz Makas Hesaplama - Alış Satış Farkı",
        intro: "Döviz alış ve satış kuru arasındaki farkı tutar ve yüzde olarak hesaplayın.",
        targetQueries: ["döviz makas hesaplama", "döviz alış satış farkı", "banka döviz makası", "döviz bürosu makası"],
        mode: "makas",
        from: "USD",
        to: "EUR",
        amount: 100,
        content: [
            { title: "Döviz makası nasıl hesaplanır?", body: "Makas tutarı = satış kuru - alış kuru. Makas yüzdesi ise bu farkın alış kuruna oranlanmasıyla bulunur." },
            { title: "Banka makası neden değişir?", body: "Likidite, işlem saati, piyasa oynaklığı ve kurum politikası alış-satış farkını etkileyebilir." },
        ],
        faq: [
            { question: "Döviz makası nedir?", answer: "Alış kuru ile satış kuru arasındaki farktır." },
            { question: "Makas yatırım maliyeti midir?", answer: "Evet. Özellikle kısa vadeli alım satımda önemli bir maliyet unsurudur." },
        ],
    },
};

export const FX_LONG_TAIL_SLUGS = Object.keys(FX_LONG_TAIL_PAGES) as FxLongTailSlug[];

export function getFxLongTailPage(slug: FxLongTailSlug) {
    return FX_LONG_TAIL_PAGES[slug];
}
