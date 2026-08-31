export const CORPORATE_GUIDE_BASE_PATH = "/kurumsal/rehber";
export const CORPORATE_GUIDE_PUBLISHED_AT = "2026-08-31";
export const CORPORATE_GUIDE_UPDATED_AT = "2026-08-31";

export type CorporateGuideSection = {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
};
export type CorporateGuideTable = { caption: string; headers: string[]; rows: string[][] };
export type CorporateGuide = {
    slug: "ozel-yazilim-yaptirma-maliyeti" | "hazir-yazilim-mi-ozel-yazilim-mi" | "excel-ve-manuel-surecleri-yazilima-donusturme";
    intent: "cost_research" | "build_or_buy_decision" | "process_digitization_planning";
    title: string;
    shortTitle: string;
    description: string;
    intro: string;
    sections: CorporateGuideSection[];
    table?: CorporateGuideTable;
    faq: { question: string; answer: string }[];
    relatedLinks: { href: string; label: string; description: string }[];
};

export const corporateGuides: CorporateGuide[] = [
    {
        slug: "ozel-yazilim-yaptirma-maliyeti", intent: "cost_research",
        title: "Özel Yazılım Yaptırma Maliyeti Nasıl Belirlenir?", shortTitle: "Özel yazılım maliyetini belirleyenler",
        description: "Özel yazılım maliyetini etkileyen kapsam, platform, entegrasyon, veri aktarımı, güvenlik, test, bakım ve sözleşme modellerini fiyat vermeden açıklayan karar rehberi.",
        intro: "Özel yazılım için sağlıklı bütçe çalışması, özellik listesinden önce iş hedefini, kullanıcıları, veri akışını ve teslim biçimini netleştirmekle başlar. Tek bir piyasa fiyatı vermek yanıltıcıdır; aynı görünen iki proje, entegrasyon ve operasyon riski nedeniyle çok farklı efor gerektirebilir.",
        sections: [
            { id: "temel-faktorler", title: "Maliyeti etkileyen temel faktörler", paragraphs: ["Toplam efor; çözülecek iş probleminin belirsizliği, kullanıcı sayısından çok kullanıcı rollerinin çeşitliliği, iş kurallarının yoğunluğu ve sistemin ne kadar kritik olduğuyla şekillenir. Analiz edilmemiş istisnalar geliştirme sırasında kapsam değişikliğine dönüşür."], bullets: ["İş akışı ve kural sayısı", "Ekran, rol ve onay çeşitliliği", "Performans ve erişilebilirlik beklentileri", "Mevcut sistemlerin teknik durumu"] },
            { id: "platform-roller", title: "Platform ve kullanıcı rolleri", paragraphs: ["Yalnız web arayüzü ile web, mobil ve masaüstünü birlikte hedefleyen çözüm aynı teslim planına sahip değildir. Çalışan, yönetici, bayi ve müşteri gibi roller çoğaldıkça yetki matrisi, test senaryoları ve destek kapsamı genişler."] },
            { id: "modul-entegrasyon", title: "Modül ve entegrasyon kapsamı", paragraphs: ["Stok, teklif, raporlama veya saha yönetimi gibi her modül kendi veri modelini ve iş kurallarını getirir. Muhasebe, ERP, e-ticaret ya da ödeme servisleriyle bağlantıda API kalitesi, limitler, hata yönetimi ve test ortamı maliyeti doğrudan etkiler."] },
            { id: "veri-aktarimi", title: "Veri aktarımı ve temizleme", paragraphs: ["Excel veya eski veritabanındaki alanların yeni modele eşlenmesi tek başına yeterli değildir. Yinelenen kayıtların temizlenmesi, eksik alanların kararı, doğrulama raporları ve geri dönüş planı ayrı bir iş paketidir."] },
            { id: "guvenlik-test-yayin", title: "Güvenlik, test ve yayınlama", paragraphs: ["Rol bazlı erişim, denetim kayıtları, yedekleme, güvenli yapılandırma ve yayın otomasyonu sonradan eklenen süsler değildir. Kritik süreçlerde otomatik test, kullanıcı kabul testi ve izleme hazırlığı teslim kapsamının parçası olmalıdır."] },
            { id: "bakim-destek", title: "Bakım, barındırma ve destek", paragraphs: ["Sunucu, veri tabanı, alan adı, e-posta ve üçüncü taraf servislerin kullanım giderleri geliştirmeden ayrıdır. Güvenlik güncellemeleri, hata müdahalesi, yedek doğrulama ve yeni sürüm planı için sahiplik baştan tanımlanmalıdır."] },
            { id: "calisma-modelleri", title: "Sabit fiyat, zaman-malzeme ve aşamalı proje modelleri", paragraphs: ["Sabit fiyat, kapsam ve kabul ölçütleri yeterince net olduğunda öngörülebilirlik sağlar; belirsiz projede ise yüksek değişiklik maliyeti yaratabilir. Zaman-malzeme modeli keşif gerektiren işlerde esnektir fakat bütçe ve öncelik takibi ister. Aşamalı modelde keşif, MVP ve genişleme ayrı karar kapılarıdır; çoğu karmaşık proje için riski daha görünür kılar."] },
            { id: "teklif-hazirligi", title: "Sağlıklı teklif almak için hazırlanması gereken bilgiler", paragraphs: ["Teklif talebinde yalnız ekran listesini değil, sürecin bugün nasıl yürüdüğünü ve hangi sonucun iyileşmesinin beklendiğini anlatın."], bullets: ["Hedef ve başarı ölçütü", "Kullanıcı grupları ve yetkiler", "Öncelikli iş akışları", "Entegrasyon ve veri kaynakları", "Zorunlu tarih veya mevzuat kısıtları", "MVP dışında bırakılabilecek ihtiyaçlar"] },
            { id: "gizli-maliyetler", title: "Gizli veya sonradan çıkan maliyetler", paragraphs: ["Eksik veri temizliği, lisans kısıtları, mağaza hesapları, mesaj/e-posta kullanımı, eski sistem erişimi, içerik girişi, eğitim ve operasyon kesintisi sıklıkla ilk tahminde unutulur. Teklifte varsayımlar ve kapsam dışı kalemler açıkça yazılmalıdır."] },
            { id: "mvp", title: "MVP ile riski azaltma", paragraphs: ["MVP, kötü yapılmış küçük ürün değil; en kritik iş varsayımını güvenli biçimde doğrulayan ilk kullanılabilir fazdır. Öncelikli kullanıcı ve akışla başlamak veri modelini, entegrasyonu ve kullanım alışkanlıklarını büyük yatırım öncesinde sınamayı sağlar."] },
        ],
        faq: [
            { question: "Özel yazılım için neden kesin fiyat vermiyorsunuz?", answer: "Kapsam, roller, entegrasyonlar ve veri kalitesi görülmeden verilen rakam sağlıklı bir taahhüt olmaz. Önce iş akışı ve kabul ölçütleri netleştirilmelidir." },
            { question: "En düşük maliyetli başlangıç yaklaşımı nedir?", answer: "Genellikle tek bir değerli iş akışına odaklanan, entegrasyon ve veri risklerini erken test eden MVP yaklaşımıdır; ancak her proje için uygunluk ayrıca değerlendirilir." },
            { question: "Bakım geliştirme teklifine dahil midir?", answer: "Bu sözleşmeye göre değişir. Barındırma, izleme, güvenlik güncellemeleri, hata müdahalesi ve yeni geliştirmelerin kapsamı ayrı ayrı belirtilmelidir." },
        ],
        relatedLinks: [
            { href: "/kurumsal/ozel-yazilim-gelistirme", label: "Özel yazılım geliştirme hizmeti", description: "Analizden devreye almaya hizmet kapsamını inceleyin." },
            { href: "/kurumsal/yazilim-projesi-kapsam-hesaplama", label: "Kapsam ve süre ön değerlendirmesi", description: "Projenizin kapsam seviyesini adım adım çıkarın." },
        ],
    },
    {
        slug: "hazir-yazilim-mi-ozel-yazilim-mi", intent: "build_or_buy_decision",
        title: "Hazır Yazılım mı, Özel Yazılım mı? Tarafsız Karar Rehberi", shortTitle: "Hazır yazılım mı, özel yazılım mı?",
        description: "Hazır ve özel yazılımı süreç uyumu, toplam sahip olma maliyeti, entegrasyon, veri sahipliği ve büyüme açısından tarafsız karşılaştırın.",
        intro: "Doğru seçim her zaman özel yazılım değildir. Standart bir ihtiyacı güvenilir bir hazır ürün karşılıyorsa hızlı kurulum ve olgun özellik seti daha rasyonel olabilir. Özel yazılım, ancak ayırt edici süreç, entegrasyon veya kontrol ihtiyacı yatırımı gerekçelendiriyorsa öne çıkar.",
        sections: [
            { id: "hazir-avantaj", title: "Hazır yazılımın avantajları", paragraphs: ["Hazır ürünler hızlı devreye alınır, daha önce denenmiş standart iş akışları sunar ve ilk teknik ekip ihtiyacını azaltır."], bullets: ["Kısa kurulum süresi", "Öngörülebilir abonelik veya lisans modeli", "Standart süreçlerde iyi uygulamalar", "Mevcut dokümantasyon ve destek ekosistemi"] },
            { id: "hazir-dezavantaj", title: "Hazır yazılımın dezavantajları", paragraphs: ["İşletme süreci ürüne uymuyorsa ekipler yan tablolar ve manuel geçişler üretmeye başlayabilir. Özelleştirme sınırları, kullanıcı başı maliyet ve veri dışa aktarma koşulları büyüdükçe önem kazanır."] },
            { id: "ozel-avantaj", title: "Özel yazılımın avantajları", paragraphs: ["Özel çözüm, gerçek iş akışına, rol modeline ve entegrasyon ihtiyacına göre şekillenebilir. Ürün yol haritası ve veri modeli üzerinde daha fazla kontrol sağlar."] },
            { id: "ozel-dezavantaj", title: "Özel yazılımın dezavantajları", paragraphs: ["Analiz, geliştirme, test, yayın ve bakım sorumluluğu daha yüksektir. Kapsam yönetimi zayıfsa süre ve efor belirsizliği artar; kurum içi sahiplik olmadan sürdürülebilirlik zorlaşır."] },
            { id: "tco", title: "Toplam sahip olma maliyetini karşılaştırma", paragraphs: ["Yalnız ilk satın alma veya geliştirme giderini değil; lisans artışları, kurulum, veri geçişi, entegrasyon, eğitim, operasyon kaybı, bakım ve çıkış maliyetini birlikte değerlendirin. Karar dönemi birkaç yıl üzerinden ele alınmalıdır."] },
            { id: "entegrasyon-veri", title: "Entegrasyon ve veri sahipliği", paragraphs: ["Hazır ürünün API kapsamını, veri dışa aktarma biçimini ve sözleşme sonunda veriye erişimi kontrol edin. Özel yazılımda da kaynak kod, dokümantasyon, barındırma hesapları ve üçüncü taraf lisanslarının sahipliği sözleşmede açık olmalıdır."] },
            { id: "surece-uyum", title: "Sürece uyum", paragraphs: ["Süreç sektörde standartsa ürüne uyum sağlamak verimli olabilir. Süreç işletmenin rekabet avantajıysa veya çok sayıda istisna içeriyorsa özel çözüm daha anlamlı hâle gelir. Her farklılık değerli değildir; gereksiz alışkanlıkları yazılıma taşımamak gerekir."] },
            { id: "buyume", title: "Büyüme ve ölçeklenme", paragraphs: ["Hazır ürünün paket, kullanıcı, lokasyon ve işlem limitlerini; özel çözümün ise performans, ekip ve operasyon kapasitesini inceleyin. Ölçeklenme yalnız sunucu gücü değil, destek ve değişiklik yönetimi meselesidir."] },
            { id: "hangi-durum", title: "Hangi durumda hangisi seçilmeli?", paragraphs: ["Muhasebe, bordro, temel CRM veya proje yönetimi gibi standart ihtiyaçlarda uygun hazır ürün çoğu işletme için daha doğru başlangıçtır. Benzersiz operasyon, yoğun sistem bağlantısı, özel saha akışı veya ürüne dönüşecek fikri mülkiyet söz konusuysa özel geliştirme değerlendirilebilir."] },
            { id: "hibrit", title: "Hazır sistem + özel entegrasyon hibrit modeli", paragraphs: ["Çoğu işletme için en dengeli seçenek, standart ihtiyacı hazır ürünle karşılayıp yalnız ayırt edici akışı veya sistemler arası bağlantıyı özel geliştirmektir. Bu model teslim riskini azaltırken süreç esnekliğini koruyabilir."] },
        ],
        table: { caption: "Hazır ve özel yazılım karar tablosu", headers: ["Karar ölçütü", "Hazır yazılım", "Özel yazılım"], rows: [["İhtiyaç standardı", "Standart süreçlerde güçlü", "Benzersiz süreçlerde güçlü"], ["Başlangıç hızı", "Genellikle daha hızlı", "Analiz ve geliştirme gerekir"], ["Uyarlama", "Ürün sınırları içinde", "Kapsama göre tasarlanabilir"], ["Bakım", "Sağlayıcı ağırlıklı", "İşletme ve geliştirme ekibi sorumluluğunda"], ["Veri ve yol haritası kontrolü", "Sözleşme ve ürüne bağlı", "Sözleşmeyle daha yüksek kontrol kurulabilir"], ["En uygun durum", "İyi tanımlı standart ihtiyaç", "Ayırt edici veya karmaşık operasyon"]] },
        faq: [
            { question: "Küçük işletme için özel yazılım gerekir mi?", answer: "Çoğu standart ihtiyaçta önce güvenilir hazır ürün değerlendirilmelidir. Özel geliştirme, hazır ürünlerin karşılamadığı ölçülebilir bir iş değeri varsa anlamlıdır." },
            { question: "Hazır yazılımdan daha sonra özel sisteme geçilebilir mi?", answer: "Veri dışa aktarımı, API erişimi ve süreç dokümantasyonu uygunsa geçiş planlanabilir. Sağlayıcı seçerken çıkış koşulları baştan incelenmelidir." },
            { question: "Hibrit model ne zaman uygundur?", answer: "Muhasebe veya CRM gibi standart çekirdeği koruyup, işletmeye özgü portal, saha akışı ya da entegrasyonu ayrıca geliştirmek istendiğinde uygundur." },
        ],
        relatedLinks: [
            { href: "/kurumsal/ozel-yazilim-gelistirme", label: "Özel geliştirme kapsamını inceleyin", description: "Özel çözümün hizmet ve teslim çerçevesini görün." },
            { href: "/kurumsal/api-entegrasyonu-ve-otomasyon", label: "Hibrit entegrasyon seçenekleri", description: "Hazır sistemleri özel akışlarla bağlama yaklaşımını inceleyin." },
        ],
    },
    {
        slug: "excel-ve-manuel-surecleri-yazilima-donusturme", intent: "process_digitization_planning",
        title: "Excel ve Manuel Süreçleri Yazılıma Dönüştürme Rehberi", shortTitle: "Excel ve manuel süreçlerden yazılıma geçiş",
        description: "Excel’in yeterli olduğu durumları, yazılıma geçiş işaretlerini, veri temizliğini, yetkilendirmeyi, pilot süreci ve platform seçimini planlayın.",
        intro: "Excel esnek, erişilebilir ve küçük ekipler için güçlü bir araçtır. Sorun Excel kullanmak değil; kritik operasyonun sahiplik, doğrulama ve izlenebilirlik olmadan çok sayıda dosyaya dağılmasıdır. Geçiş kararı teknoloji hevesiyle değil, ölçülebilir iş kaybı ve riskle verilmelidir.",
        sections: [
            { id: "excel-yeterli", title: "Excel’in yeterli olduğu durumlar", paragraphs: ["Tek sahibi olan, düşük hacimli, sınırlı iş kuralı içeren ve eş zamanlı çalışma gerektirmeyen kayıtlar için Excel doğru seçim olabilir. Kısa ömürlü analizler ve prototip süreçler hemen özel yazılıma dönüştürülmemelidir."], bullets: ["Az sayıda kullanıcı ve net dosya sahibi", "Düşük işlem hacmi", "Karmaşık yetki ihtiyacı olmaması", "Manuel kontrolün sürdürülebilir olması"] },
            { id: "gecis-isaretleri", title: "Yazılıma geçiş gerektiğini gösteren işaretler", paragraphs: ["Dosya kopyaları çoğalıyor, güncel sürüm bilinmiyor, aynı veri tekrar giriliyor veya hata ancak müşteri şikâyetiyle fark ediliyorsa süreç sınırına yaklaşmıştır."], bullets: ["Eş zamanlı düzenleme çatışmaları", "Onay ve sorumlulukların görünmemesi", "Rapor hazırlamanın sürekli elle yapılması", "Mobil veya saha erişiminin yetersizliği", "Kayıt geçmişi ve yetki ihtiyacı"] },
            { id: "surec-kullanici", title: "Süreç ve kullanıcı analizi", paragraphs: ["Önce dosyayı değil işi haritalayın: kayıt nerede doğuyor, kim kontrol ediyor, hangi istisnalar var ve hangi çıktı kararı etkiliyor? Kullanıcı görüşmeleri gerçek akış ile yazılı prosedür arasındaki farkı görünür kılar."] },
            { id: "veri", title: "Veri temizleme ve aktarım", paragraphs: ["Kolon adlarını yeni sisteme taşımak yeterli değildir. Tekilleştirme, zorunlu alanlar, kod listeleri, tarih ve sayı biçimleri için kurallar belirlenmeli; örnek aktarım sonuçları iş sahipleri tarafından doğrulanmalıdır."] },
            { id: "yetki", title: "Yetkilendirme", paragraphs: ["Herkesin aynı dosyayı görmesi kolaydır ancak güvenli değildir. Görüntüleme, düzenleme, onaylama ve dışa aktarma hakları rol bazında tanımlanmalı; kritik işlemler kayda alınmalıdır."] },
            { id: "pilot", title: "Pilot ve MVP ile başlama", paragraphs: ["Tüm dosyaları tek seferde dönüştürmek yerine, yüksek hata veya zaman kaybı yaratan bir akış seçin. Sınırlı kullanıcı grubuyla pilot yapın, ölçüm alın ve veri modelini doğruladıktan sonra genişleyin."] },
            { id: "platform", title: "Web, mobil ve masaüstü seçimi", paragraphs: ["Ofis ve farklı cihazlardan erişim için web; kamera, konum, bildirim veya saha çalışması için mobil; cihaz entegrasyonu, yerel ağ ve yoğun çevrimdışı kullanım için masaüstü değerlendirilebilir. Birden fazla platform gerçek ihtiyaç yoksa başlangıç kapsamını gereksiz büyütür."] },
            { id: "entegrasyon", title: "Entegrasyon planı", paragraphs: ["Muhasebe, ERP, e-ticaret ve kargo sistemleriyle hangi verinin hangi yönde ve ne sıklıkla akacağı belirlenmelidir. Hatalı aktarımın nasıl fark edileceği ve tekrar deneneceği de normal akış kadar önemlidir."] },
            { id: "hatalar", title: "Geçiş sırasında sık yapılan hatalar", paragraphs: ["Mevcut dosyadaki her alanı aynen kopyalamak, süreç sahibini belirlememek, veri temizliğini sona bırakmak, bütün modülleri aynı anda açmak ve kullanıcı eğitimini yalnız son güne bırakmak yaygın risklerdir."] },
            { id: "senaryolar", title: "Sektörlerden örnek senaryolar", paragraphs: ["Aşağıdaki maddeler gerçek müşteri veya vaka çalışması değil, planlama yaklaşımını göstermek için hazırlanmış örnek senaryolardır."], bullets: ["Örnek senaryo — Üretim: İş emri, sarf ve kalite kayıtlarının ortak panelde izlenmesi.", "Örnek senaryo — Tekstil: Numune, sipariş, üretim aşaması ve sevkiyat durumlarının ilişkilendirilmesi.", "Örnek senaryo — Lojistik: Görev, araç, teslimat kanıtı ve gecikme bildiriminin mobil akışta toplanması.", "Örnek senaryo — Teknik servis: Servis kaydı, teknisyen ataması, parça kullanımı ve kapanış onayının izlenmesi.", "Örnek senaryo — Satış ekipleri: Müşteri görüşmesi, teklif sürümü, takip görevi ve kazanım nedeninin ortak kayıtta tutulması."] },
        ],
        faq: [
            { question: "Her Excel dosyası yazılıma dönüştürülmeli mi?", answer: "Hayır. Düşük hacimli, tek sahipli ve geçici analizlerde Excel yeterli olabilir. Yazılım yatırımı ölçülebilir koordinasyon, hata veya güvenlik problemi olduğunda değerlendirilmelidir." },
            { question: "Eski Excel verileri tamamen aktarılabilir mi?", answer: "Teknik olarak mümkün olsa bile tüm geçmiş veriyi taşımak her zaman doğru değildir. Veri kalitesi, yasal saklama ihtiyacı ve operasyon değeri incelenerek kapsam belirlenmelidir." },
            { question: "Geçiş sırasında Excel kullanılmaya devam edebilir mi?", answer: "Pilot dönemde kontrollü paralel kullanım planlanabilir. Ancak hangi sistemin ana kayıt olduğu ve çift girişin ne zaman biteceği açıkça belirlenmelidir." },
        ],
        relatedLinks: [
            { href: "/cozumler/excel-ve-manuel-isleri-yazilima-donusturme", label: "Excel ve manuel işler için çözüm yaklaşımı", description: "İhtiyaç odaklı çözüm sayfasını inceleyin." },
            { href: "/kurumsal/api-entegrasyonu-ve-otomasyon", label: "API ve otomasyon hizmeti", description: "Sistemler arası veri akışının teknik kapsamını görün." },
        ],
    },
];

export function getCorporateGuide(slug: string) { return corporateGuides.find((guide) => guide.slug === slug); }
export const corporateGuideSlugs = corporateGuides.map((guide) => guide.slug);
