type FaqItem = {
    question: string;
    answer: string;
};

type ContentProfile = {
    title: string;
    paragraphs: (pageTitle: string, category: string) => string[];
    faqs: FaqItem[];
};

type IndexableInfoBlockProps = {
    pageTitle: string;
    category: string;
    slug?: string;
};

const CONTENT_PROFILES: Record<string, ContentProfile> = {
    "bench-press-max": {
        title: "Bench Press Maksimum Tekrar Nasıl Hesaplanır?",
        paragraphs: (pageTitle, category) => [
            `${pageTitle}, ${category} kategorisinde antrenman planını sayısal olarak takip etmek isteyen kullanıcılar için en pratik kuvvet tahminlerinden biridir. Bench press maksimum tekrar, yani 1RM, teorik olarak bir kişinin düzgün formda yalnızca bir kez kaldırabileceği en yüksek ağırlığı ifade eder. Gerçek 1RM denemesi omuz, dirsek ve göğüs kasları üzerinde yüksek stres oluşturduğu için her sporcu tarafından sık sık denenmemelidir. Bu nedenle hesaplayıcı, daha güvenli bir yöntemle mevcut tekrar sayısından tahmini maksimumu üretir.`,
            "Hesaplamada temel mantık, kaldırılan ağırlık ile yapılan tekrar sayısını aynı formül içinde değerlendirmektir. En yaygın yaklaşım Epley formülüdür: tahmini maksimum = ağırlık x (1 + tekrar / 30). Örneğin 80 kg ile 8 tekrar yapan bir kullanıcı için yaklaşık değer 80 x 1,266 olur ve sonuç 101 kg civarında okunur. Brzycki gibi farklı formüller küçük farklar üretebilir; bu yüzden sonuç tek başına kesin rekor değil, antrenman bandı olarak yorumlanmalıdır.",
            "Bu bilginin asıl değeri programlama aşamasında ortaya çıkar. Kuvvet odaklı çalışan biri 1RM tahmininin yüzde 80-90 bandında ağır setler planlayabilirken, hipertrofi hedefleyen biri yüzde 60-75 aralığında daha kontrollü hacim oluşturabilir. Sonucu değerlendirirken bar yolu, hareket açıklığı, duraklatmalı tekrar, ekipman, yorgunluk ve önceki sakatlık geçmişi dikkate alınmalıdır. Özellikle göğüs ve omuz bölgesinde ağrı varsa hesap sonucu üzerinden maksimum deneme yapmak yerine antrenör veya sağlık profesyoneli görüşü almak daha güvenli olur.",
            "Sonucu düzenli takip etmek, tek bir antrenmandaki performanstan daha anlamlıdır. Aynı ağırlıkla daha fazla tekrar yapmak, aynı tekrar sayısında daha temiz form yakalamak veya tahmini maksimumun zaman içinde yavaşça yükselmesi gelişim sinyali sayılır. Kısa vadeli düşüşler ise her zaman gerileme anlamına gelmez; deload haftası, uyku düzeni, kalori alımı ve itiş kaslarının toparlanması bu tabloda birlikte düşünülmelidir.",
        ],
        faqs: [
            {
                question: "Bench press 1RM sonucu kesin maksimum ağırlığım mı?",
                answer: "Hayır. Sonuç, girdiğiniz ağırlık ve tekrar sayısına göre üretilen matematiksel bir tahmindir. Form, dinlenme, tempo ve günlük performans sonucu değiştirebilir.",
            },
            {
                question: "Kaç tekrar üzerinden bench press maksimumu daha doğru tahmin edilir?",
                answer: "Genellikle 3-10 tekrar aralığı daha güvenilir kabul edilir. Çok yüksek tekrar sayılarında dayanıklılık etkisi arttığı için 1RM tahmini daha fazla sapabilir.",
            },
            {
                question: "Tahmini 1RM ile antrenman ağırlığı nasıl seçilir?",
                answer: "Kuvvet çalışmaları için tahmini maksimumun yaklaşık yüzde 80-90'ı, hacim ve teknik çalışmalar için yüzde 60-75'i başlangıç bandı olarak kullanılabilir.",
            },
            {
                question: "Bench press maksimum denemesi ne sıklıkla yapılmalı?",
                answer: "Sık maksimum deneme yapmak toparlanmayı zorlayabilir. Çoğu kullanıcı için düzenli antrenmanda tahmini 1RM takibi, gerçek maksimum testinden daha güvenli ve sürdürülebilirdir.",
            },
            {
                question: "Bench press sonucum neden haftadan haftaya değişiyor?",
                answer: "Uyku, beslenme, önceki antrenman yorgunluğu, stres, ısınma kalitesi ve teknik tutarlılık kısa vadeli performansı etkileyebilir.",
            },
        ],
    },
    "matris-hesaplama": {
        title: "Matris İşlemleri Nasıl Hesaplanır?",
        paragraphs: (pageTitle, category) => [
            `${pageTitle}, ${category} kategorisinde doğrusal cebir işlemlerini hızlı kontrol etmek için kullanılan temel araçlardan biridir. Matris, satır ve sütunlardan oluşan düzenli sayı tablosudur; mühendislik, istatistik, bilgisayar grafikleri, ekonomi modelleri ve veri analizinde sık kullanılır. Bir matris hesabında ilk adım boyutu doğru okumaktır. Örneğin 2x3 bir matris iki satır ve üç sütundan oluşur. Toplama, çıkarma, çarpma, determinant veya ters alma gibi işlemlerin her biri farklı boyut kurallarına bağlıdır.`,
            "Toplama ve çıkarma işlemlerinde iki matrisin satır ve sütun sayıları aynı olmalıdır; karşılıklı hücreler toplanır veya çıkarılır. Matris çarpımında ise birinci matrisin sütun sayısı, ikinci matrisin satır sayısına eşit olmalıdır. Sonuç matrisinin her hücresi, ilgili satır ve sütundaki değerlerin çarpılıp toplanmasıyla bulunur. Determinant yalnız kare matrislerde hesaplanır ve matrisin tersinin olup olmadığını anlamak için kritik bir işarettir. Determinant sıfırsa matris tekildir ve klasik anlamda tersi alınamaz.",
            "Bu hesaplayıcıyı kullanırken değerleri yalnız sonuç almak için değil, işlem sırasını kontrol etmek için de okumak gerekir. Özellikle sınav veya ödev hazırlığında hatalar çoğu zaman formülden değil, satır-sütun eşleşmesini yanlış kurmaktan doğar. Ondalık değerler, negatif sayılar ve sıfır satırları sonucu ciddi biçimde değiştirebilir. Büyük matrislerde elle işlem yapmak zaman aldığı için hesaplayıcı hızlı doğrulama sağlar; ancak yöntemi öğrenmek için küçük örneklerde ara adımları ayrıca incelemek daha kalıcı bir matematik pratiği oluşturur.",
            "Matris sonucunu yorumlarken işlemin amacını da bilmek önemlidir. Bir denklem sistemini çözüyorsanız ters matris veya determinant size çözümün varlığı hakkında fikir verir. Bir dönüşüm matrisiyle çalışıyorsanız satır ve sütun sırası geometrik anlamı değiştirir. Bu nedenle hesap ekranındaki sonucu yalnız nihai sayı dizisi olarak değil, kullanılan yöntemin doğruluğunu sınayan bir kontrol noktası olarak değerlendirmek gerekir.",
        ],
        faqs: [
            {
                question: "Matris toplama için boyutlar aynı olmak zorunda mı?",
                answer: "Evet. İki matrisin toplanabilmesi veya çıkarılabilmesi için satır ve sütun sayıları birebir aynı olmalıdır.",
            },
            {
                question: "Matris çarpımında hangi boyut kuralı geçerlidir?",
                answer: "Birinci matrisin sütun sayısı, ikinci matrisin satır sayısına eşit olmalıdır. Sonuç matrisinin boyutu ise birinci matrisin satırı ve ikinci matrisin sütunu ile oluşur.",
            },
            {
                question: "Determinant her matris için hesaplanır mı?",
                answer: "Hayır. Determinant yalnız kare matrislerde, yani satır ve sütun sayısı eşit olan matrislerde hesaplanır.",
            },
            {
                question: "Bir matrisin tersi ne zaman yoktur?",
                answer: "Kare matrisin determinantı sıfırsa matris tekildir ve klasik matris tersi yoktur.",
            },
            {
                question: "Matris hesaplama sonucu neden elle bulduğumdan farklı çıkıyor?",
                answer: "En sık neden satır-sütun sırasını karıştırmak, negatif işareti atlamak veya çarpımda hücreleri yanlış eşleştirmektir.",
            },
        ],
    },
    "kpss-puan-hesaplama": {
        title: "KPSS Puanı Nasıl Hesaplanır?",
        paragraphs: (pageTitle, category) => [
            `${pageTitle}, ${category} kategorisinde adayların deneme netlerini anlamlı bir puan bandına çevirmek için kullandığı ön izleme aracıdır. KPSS'de ilk hesap adımı doğru ve yanlış sayılarından net üretmektir. Genel uygulamada dört yanlış bir doğruyu götürür; bu nedenle net, doğru sayısından yanlış sayısının dörtte biri çıkarılarak bulunur. Genel Yetenek ve Genel Kültür netleri birçok puan türünün temelini oluşturur, ancak adayın öğrenim düzeyi ve başvurduğu kadro türü sonucu nasıl yorumlayacağını değiştirir.`,
            "Lisans adaylarında en çok takip edilen B grubu puan türü KPSS P3'tür. Önlisans için KPSS P93, ortaöğretim için KPSS P94 puanı öne çıkar. Öğretmenlik, alan bilgisi veya kurum sınavı gibi özel süreçlerde Eğitim Bilimleri, ÖABT veya farklı test ağırlıkları devreye girebilir. Bu yüzden yalnız toplam nete bakmak yerine hangi puan türünün hangi testleri dikkate aldığını bilmek gerekir. Hesaplayıcı, girilen netleri yaklaşık puan mantığına yerleştirerek adayın hedef bandını daha hızlı görmesine yardımcı olur.",
            "KPSS puanının resmi sonuçtan farklılaşmasının temel nedeni standart sapma ve sınav kitlesidir. ÖSYM her sınavda test ortalaması, standart sapma ve aday dağılımı gibi değişkenlerle standart puan üretir. Bu veriler sınavdan sonra netleştiği için çevrim içi araçlar kesin sonuç belgesi yerine geçmez. Yine de deneme döneminde hangi dersin puanı daha çok etkilediğini görmek, hedef puana kaç net kaldığını tahmin etmek ve çalışma planını önceliklendirmek için güçlü bir karar destek ekranı sunar.",
            "Sonucu düzenli deneme takibiyle birlikte kullanmak daha sağlıklı bir tablo verir. Tek bir denemedeki yüksek veya düşük puan yerine son birkaç denemenin ortalamasına bakmak, gerçek seviyeyi daha iyi gösterir. Adaylar ayrıca tarih, vatandaşlık, matematik veya Türkçe gibi alt alanlarda net değişimini ayrı izlediğinde hangi konunun puanı taşıdığını daha net görebilir. Böylece çalışma planı genel motivasyon yerine ölçülebilir eksiklere göre güncellenir.",
        ],
        faqs: [
            {
                question: "KPSS neti nasıl hesaplanır?",
                answer: "Doğru sayısından yanlış sayısının dörtte biri çıkarılır. Örneğin 48 doğru ve 12 yanlış için net 48 - 3 = 45 olur.",
            },
            {
                question: "KPSS P3, P93 ve P94 arasındaki fark nedir?",
                answer: "P3 lisans, P93 önlisans, P94 ise ortaöğretim düzeyi için kullanılan temel puan türleridir. Başvuru yapılacak kadroya göre ilgili puan türü dikkate alınır.",
            },
            {
                question: "Bu hesaplayıcı resmi KPSS sonucunu verir mi?",
                answer: "Hayır. Araç tahmini puan bandı üretir. Resmi puan, ÖSYM'nin sınav sonrası açıkladığı standart puanlama verileriyle kesinleşir.",
            },
            {
                question: "Aynı net her yıl aynı KPSS puanını verir mi?",
                answer: "Hayır. Sınavın zorluk düzeyi, adayların genel başarısı ve standart sapma değiştiği için aynı net farklı yıllarda farklı puanlara karşılık gelebilir.",
            },
            {
                question: "KPSS puanımı artırmak için hangi netlere odaklanmalıyım?",
                answer: "Önce puan türünüzde ağırlığı yüksek olan testleri belirleyin. Ardından düşük netli ama hızlı gelişebilecek dersleri hedeflemek genellikle daha verimli olur.",
            },
        ],
    },
};

function getProfile(slug: string | undefined, pageTitle: string) {
    if (slug && CONTENT_PROFILES[slug]) {
        return CONTENT_PROFILES[slug];
    }

    const normalizedTitle = pageTitle.toLocaleLowerCase("tr-TR");

    if (normalizedTitle.includes("bench")) {
        return CONTENT_PROFILES["bench-press-max"];
    }

    if (normalizedTitle.includes("matris")) {
        return CONTENT_PROFILES["matris-hesaplama"];
    }

    if (normalizedTitle.includes("kpss")) {
        return CONTENT_PROFILES["kpss-puan-hesaplama"];
    }

    return null;
}

function serializeJsonLd(schema: Record<string, unknown>) {
    return JSON.stringify(schema)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

function buildFaqSchema(faqs: FaqItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

export default function IndexableInfoBlock({
    pageTitle,
    category,
    slug,
}: IndexableInfoBlockProps) {
    const profile = getProfile(slug, pageTitle);

    if (!profile) {
        return null;
    }

    const paragraphs = profile.paragraphs(pageTitle, category);
    const faqSchema = buildFaqSchema(profile.faqs);
    const accordionName = `${slug ?? pageTitle}-indexable-faq`;

    return (
        <section
            aria-labelledby="indexable-info-heading"
            className="mt-16 border-t border-slate-200 pt-12"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(faqSchema),
                }}
            />

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-start">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#CC4A1A]">
                        Detaylı Hesaplama Rehberi
                    </p>
                    <h2
                        id="indexable-info-heading"
                        className="mt-3 text-3xl font-black tracking-tight text-slate-950"
                    >
                        {profile.title}
                    </h2>
                    <div className="mt-6 space-y-5 text-base leading-8 text-slate-700 md:text-lg">
                        {paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                <div aria-labelledby="indexable-faq-heading">
                    <h3
                        id="indexable-faq-heading"
                        className="text-2xl font-black tracking-tight text-slate-950"
                    >
                        Sıkça Sorulan Sorular
                    </h3>
                    <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                        {profile.faqs.map((faq) => (
                            <details
                                key={faq.question}
                                name={accordionName}
                                className="group py-4"
                            >
                                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-bold leading-7 text-slate-900 [&::-webkit-details-marker]:hidden">
                                    <span>{faq.question}</span>
                                    <span
                                        aria-hidden="true"
                                        className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-slate-300 text-lg leading-none text-[#CC4A1A] transition-transform group-open:rotate-45"
                                    >
                                        +
                                    </span>
                                </summary>
                                <p className="mt-3 pr-10 text-sm leading-7 text-slate-600">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
