import { CORPORATE_CONTACT_PATH } from "./corporate-services";

export const SOLUTIONS_BASE_PATH = "/cozumler";

export type SolutionFaq = { question: string; answer: string };
export type BusinessSolution = {
    slug: string;
    title: string;
    shortTitle: string;
    shortDescription: string;
    metadata: { title: string; description: string };
    problems: string[];
    businessImpact: string[];
    approach: string;
    deliveryOptions: string[];
    features: string[];
    industries: string[];
    deliverables: string[];
    process: string[];
    faq: SolutionFaq[];
    relatedServices: string[];
    cta: { label: string; serviceValue: string };
};

export const businessSolutions: BusinessSolution[] = [
    {
        slug: "excel-ve-manuel-isleri-yazilima-donusturme",
        title: "Excel ve Manuel İşleri Yazılıma Dönüştürme",
        shortTitle: "Excel ve manuel işleri dijitalleştirme",
        shortDescription: "Dağınık tabloları, tekrar eden veri girişlerini ve kişiye bağlı iş akışlarını kontrollü bir yazılım sistemine taşıyın.",
        metadata: { title: "Excel ve Manuel İşleri Yazılıma Dönüştürme", description: "Excel, e-posta ve manuel veri girişleriyle yürüyen iş süreçlerini güvenli web, masaüstü veya entegrasyon tabanlı yazılıma dönüştürün." },
        problems: ["Aynı bilginin birden fazla tabloya tekrar girilmesi", "Dosya sürümlerinin karışması ve güncel verinin belirsizleşmesi", "Raporların kişiye bağlı ve zaman alıcı hazırlanması"],
        businessImpact: ["Tekrarlı işlerde zaman kaybı", "Kopyalama ve formül hataları", "Operasyonun birkaç çalışana bağımlı kalması", "Geç veya eksik yönetim bilgisi"],
        approach: "Mevcut tabloları ve iş kurallarını analiz ederek veriyi tek merkezde tutan, yetkilendirilmiş ve izlenebilir bir uygulama tasarlayabiliriz.",
        deliveryOptions: ["Tarayıcıdan kullanılan web uygulaması", "Yerel dosya ve cihaz erişimi gereken masaüstü uygulaması", "Mevcut Excel dosyaları ve diğer sistemlerle veri entegrasyonu"],
        features: ["Merkezi veri kaydı", "Rol ve yetki yönetimi", "Doğrulamalı formlar", "Otomatik hesaplama ve bildirimler", "Filtrelenebilir raporlar", "Değişiklik geçmişi"],
        industries: ["Üretim ve sanayi", "Tekstil", "Toptan satış", "Profesyonel hizmetler"],
        deliverables: ["Süreç ve veri modeli", "Web veya masaüstü uygulaması", "Veri aktarım araçları", "Kullanım ve yönetim dokümantasyonu"],
        process: ["Kullanılan tabloları ve gerçek iş akışını inceleriz.", "Tekrarlı adımları, kuralları ve kullanıcı rollerini çıkarırız.", "Öncelikli akışı prototiple doğrularız.", "Veri geçişi, test ve kontrollü devreye alma planı uygularız."],
        faq: [{ question: "Mevcut Excel verileri yeni sisteme aktarılabilir mi?", answer: "Veri kalitesi ve kolon yapısı incelendikten sonra doğrulama ve eşleme kurallarıyla kontrollü aktarım planlanabilir." }, { question: "Excel tamamen kaldırılmak zorunda mı?", answer: "Hayır. İhtiyaca göre Excel dışa aktarma, içe aktarma veya geçiş dönemi desteği korunabilir." }],
        relatedServices: ["ozel-yazilim-gelistirme", "web-uygulamasi-gelistirme", "masaustu-yazilim-gelistirme"],
        cta: { label: "Sürecinizi Anlatın", serviceValue: "Excel ve manuel işleri yazılıma dönüştürme" },
    },
    {
        slug: "is-sureci-otomasyonu",
        title: "İş Süreci Otomasyonu",
        shortTitle: "İş süreçlerini otomatikleştirme",
        shortDescription: "Tekrarlanan görevleri, onayları, veri aktarımlarını ve bildirimleri izlenebilir otomasyon akışlarına dönüştürün.",
        metadata: { title: "İş Süreci Otomasyonu Çözümleri", description: "Tekrarlı operasyonları, onay süreçlerini, bildirimleri ve sistemler arası veri aktarımını güvenli iş süreci otomasyonuyla hızlandırın." },
        problems: ["Onayların e-posta ve mesajlarda kaybolması", "Aynı kontrol ve aktarım işlerinin her gün tekrarlanması", "Süreç geciktiğinde sorumlunun ve nedenin görülememesi"],
        businessImpact: ["Bekleme sürelerinin uzaması", "Manuel işlem maliyeti", "Atlanan görev ve kontrol adımları", "Hata sonrası geriye dönük iz bulamama"],
        approach: "Tetikleyicileri, karar kurallarını ve istisnaları birlikte tanımlayarak kayıt, onay, bildirim ve entegrasyon adımlarını kontrollü biçimde otomatikleştirebiliriz.",
        deliveryOptions: ["Web tabanlı iş akışı paneli", "API ve webhook entegrasyonları", "Zamanlanmış arka plan görevleri", "Saha adımları için mobil uygulama"],
        features: ["Kural tabanlı görev atama", "Çok aşamalı onay", "Hatırlatma ve bildirim", "Hata kaydı ve tekrar deneme", "Süreç durumu görünümü", "Yetki ve denetim izi"],
        industries: ["Lojistik ve taşımacılık", "İnşaat", "Sağlık", "Profesyonel hizmetler"],
        deliverables: ["Süreç haritası", "Otomasyon servisleri", "Yönetim ve izleme ekranı", "Hata ve işletim dokümantasyonu"],
        process: ["Sürecin başlangıç, karar ve sonuç noktalarını belirleriz.", "İstisnaları ve insan onayı gereken adımları ayırırız.", "Akışı test verisiyle uçtan uca doğrularız.", "İzleme, bildirim ve geri dönüş planıyla devreye alırız."],
        faq: [{ question: "Her adım otomatikleştirilmeli mi?", answer: "Hayır. Riskli kararlar ve gerekli kontroller insan onayında kalabilir; otomasyon doğru sınırlarla tasarlanır." }, { question: "Mevcut programlarla bağlantı kurulabilir mi?", answer: "Sistemlerin API, webhook veya güvenli dosya aktarımı sunması halinde entegrasyon uygunluğu değerlendirilebilir." }],
        relatedServices: ["api-entegrasyonu-ve-otomasyon", "ozel-yazilim-gelistirme", "web-uygulamasi-gelistirme"],
        cta: { label: "Sürecinizi Anlatın", serviceValue: "İş süreci otomasyonu" },
    },
    {
        slug: "yonetim-paneli-ve-raporlama",
        title: "Yönetim Paneli ve Raporlama Sistemi",
        shortTitle: "Yönetim paneli ve raporlama",
        shortDescription: "Farklı kaynaklardaki operasyon verilerini anlaşılır göstergeler, filtreler ve yetkili raporlarla tek panelde izleyin.",
        metadata: { title: "Yönetim Paneli ve Raporlama Sistemi", description: "Satış, operasyon ve performans verilerini tek merkezde izlemek için kuruma özel yönetim paneli, dashboard ve raporlama sistemi geliştirin." },
        problems: ["Raporların farklı dosyalardan elle birleştirilmesi", "Yöneticilerin güncel durumu geç görmesi", "Departmanların farklı sayı ve tanımlar kullanması"],
        businessImpact: ["Kararların gecikmesi", "Rapor hazırlama iş yükü", "Tutarsız göstergeler", "Sorunların geç fark edilmesi"],
        approach: "Veri kaynaklarını ve karar göstergelerini netleştirerek rol bazlı, güncel ve ayrıntıya inebilen bir yönetim paneli geliştirebiliriz.",
        deliveryOptions: ["Responsive web dashboard", "Mevcut sistemlerden API entegrasyonu", "Zamanlanmış veri toplama", "Mobil özet ve bildirim ekranları"],
        features: ["Rol bazlı dashboard", "Tarih ve birim filtreleri", "Grafik ve özet göstergeler", "Detay kayıtlarına inme", "Excel/PDF dışa aktarma", "Eşik bazlı uyarılar"],
        industries: ["Perakende ve e-ticaret", "Turizm", "Eğitim", "Üretim ve sanayi"],
        deliverables: ["Gösterge sözlüğü", "Yönetim paneli", "Veri entegrasyon katmanı", "Yetki ve rapor dokümantasyonu"],
        process: ["Karar veren kullanıcıları ve kritik göstergeleri belirleriz.", "Veri kaynaklarının doğruluğunu ve güncellenme sıklığını inceleriz.", "Panel prototipini gerçek senaryolarla doğrularız.", "Yetki, performans ve veri tutarlılığı testleriyle devreye alırız."],
        faq: [{ question: "Panel gerçek zamanlı olabilir mi?", answer: "Kaynak sistemlerin kapasitesine ve iş ihtiyacına göre gerçek zamanlı, periyodik veya karma güncelleme tasarlanabilir." }, { question: "Her kullanıcı aynı raporları mı görür?", answer: "Hayır. Şirket, şube, ekip veya rol bazında veri ve ekran yetkileri tanımlanabilir." }],
        relatedServices: ["web-uygulamasi-gelistirme", "api-entegrasyonu-ve-otomasyon", "ozel-yazilim-gelistirme"],
        cta: { label: "Sürecinizi Anlatın", serviceValue: "Yönetim paneli ve raporlama" },
    },
    {
        slug: "stok-siparis-ve-operasyon-takibi",
        title: "Stok, Sipariş ve Operasyon Takip Sistemi",
        shortTitle: "Stok ve sipariş takibi",
        shortDescription: "Stok hareketlerini, sipariş durumlarını ve operasyon adımlarını ekipler arasında tek kaynaktan yönetin.",
        metadata: { title: "Stok, Sipariş ve Operasyon Takip Sistemi", description: "Stok hareketleri, sipariş süreçleri, tedarik ve operasyon adımları için işletmenize özel takip ve yönetim yazılımı geliştirin." },
        problems: ["Stok bilgisinin depo, satış ve muhasebede farklı görünmesi", "Sipariş durumunun telefon ve mesajlarla takip edilmesi", "Eksik stok veya geciken işlerin geç fark edilmesi"],
        businessImpact: ["Yanlış stok nedeniyle satış veya üretim kaybı", "Fazla ya da yetersiz tedarik", "Sipariş gecikmeleri", "Müşteri ve ekip iletişim yükü"],
        approach: "Ürün, depo, sipariş ve işlem durumlarını ortak bir veri modelinde birleştirerek operasyonun uçtan uca izlenebildiği bir sistem geliştirebiliriz.",
        deliveryOptions: ["Web tabanlı operasyon paneli", "Depo için mobil veya el terminali ekranları", "Barkod ve cihaz entegrasyonu", "ERP, e-ticaret veya kargo API bağlantıları"],
        features: ["Stok giriş/çıkış hareketleri", "Sipariş durum akışı", "Minimum stok uyarıları", "Depo ve lokasyon yönetimi", "Yetkili işlem kayıtları", "Operasyon raporları"],
        industries: ["Toptan satış", "Perakende ve e-ticaret", "Tekstil", "Üretim ve sanayi"],
        deliverables: ["Ürün ve hareket veri modeli", "Operasyon web uygulaması", "Mobil/depo ekranları", "Entegrasyon ve kullanım dokümanı"],
        process: ["Stok ve siparişin gerçek hareket noktalarını çıkarırız.", "Ürün, depo, kullanıcı ve durum kurallarını tasarlarız.", "Kritik giriş/çıkış akışlarını pilot ortamda test ederiz.", "Sayım, veri geçişi ve entegrasyon planıyla devreye alırız."],
        faq: [{ question: "Barkod desteği eklenebilir mi?", answer: "Kullanılan barkod yapısı ve cihazlar incelendikten sonra kamera, okuyucu veya el terminali desteği planlanabilir." }, { question: "Mevcut e-ticaret sistemiyle çalışabilir mi?", answer: "Platformun sağladığı API ve erişim koşulları uygunsa ürün, sipariş ve stok senkronizasyonu kurulabilir." }],
        relatedServices: ["ozel-yazilim-gelistirme", "web-uygulamasi-gelistirme", "mobil-uygulama-gelistirme"],
        cta: { label: "Sürecinizi Anlatın", serviceValue: "Stok sipariş ve operasyon takibi" },
    },
    {
        slug: "saha-ekibi-ve-mobil-operasyon",
        title: "Saha Ekibi ve Mobil Operasyon Sistemi",
        shortTitle: "Saha ekibi ve mobil operasyon",
        shortDescription: "Görev, ziyaret, form, fotoğraf ve durum bilgilerini saha ile merkez arasında güvenli ve hızlı biçimde yönetin.",
        metadata: { title: "Saha Ekibi ve Mobil Operasyon Sistemi", description: "Saha görevleri, ziyaretler, servis formları, fotoğraf ve konum kayıtları için Android/iOS mobil operasyon uygulaması geliştirin." },
        problems: ["Saha görevlerinin telefon ve mesajlarla dağıtılması", "Form ve fotoğrafların merkezde geç veya eksik toplanması", "Görevin hangi aşamada olduğunun görülememesi"],
        businessImpact: ["Planlama ve koordinasyon yükü", "Eksik saha kanıtları", "Tekrar ziyaret maliyeti", "Müşteriye geç bilgi verilmesi"],
        approach: "Merkezde görev planlama paneli ve sahada hızlı veri girişi sağlayan mobil uygulamayı ortak bir operasyon akışında birleştirebiliriz.",
        deliveryOptions: ["Android ve iOS mobil uygulama", "Merkez operasyon web paneli", "Çevrimdışı veri toplama ve senkronizasyon", "Harita, kamera ve bildirim entegrasyonları"],
        features: ["Görev atama ve durum takibi", "Mobil form ve kontrol listeleri", "Fotoğraf ve belge ekleme", "Konum ve zaman kaydı", "Çevrimdışı çalışma", "Merkez raporlama paneli"],
        industries: ["Teknik servis", "Lojistik ve taşımacılık", "İnşaat", "Saha ekipleri bulunan işletmeler"],
        deliverables: ["Mobil uygulama", "Operasyon yönetim paneli", "API ve bildirim altyapısı", "Cihaz test ve kullanım dokümanı"],
        process: ["Saha rollerini, çalışma koşullarını ve görev türlerini inceleriz.", "En az dokunuşla tamamlanacak mobil akışları prototipleriz.", "Çevrimdışı, cihaz ve yetki senaryolarını test ederiz.", "Pilot ekip geri bildirimiyle kontrollü yaygınlaştırma planlarız."],
        faq: [{ question: "İnternet olmadığında kullanılabilir mi?", answer: "Gerekliyse seçilen veriler cihazda güvenli biçimde tutulup bağlantı geldiğinde senkronize edilebilir." }, { question: "Çalışan konumu sürekli izlenir mi?", answer: "Konum kullanımı iş amacı, açık bilgilendirme ve gerekli izinlerle sınırlı tasarlanır; sürekli takip varsayılan değildir." }],
        relatedServices: ["mobil-uygulama-gelistirme", "web-uygulamasi-gelistirme", "api-entegrasyonu-ve-otomasyon"],
        cta: { label: "Sürecinizi Anlatın", serviceValue: "Saha ekibi ve mobil operasyon" },
    },
    {
        slug: "musteri-teklif-ve-is-takibi",
        title: "Müşteri, Teklif ve İş Takip Sistemi",
        shortTitle: "Müşteri teklif ve iş takibi",
        shortDescription: "Müşteri taleplerini, teklif sürümlerini, görevleri ve iş durumlarını satıştan teslimata tek akışta izleyin.",
        metadata: { title: "Müşteri, Teklif ve İş Takip Sistemi", description: "Müşteri talepleri, teklifler, görevler ve devam eden işler için işletmenize özel CRM ve iş takip yazılımı geliştirin." },
        problems: ["Müşteri notlarının farklı kişilerde ve kanallarda kalması", "Teklif sürümlerinin ve takip tarihlerinin karışması", "Satış sonrası işlerin ekipler arasında kopması"],
        businessImpact: ["Yanıtsız kalan talepler", "Eski veya hatalı teklif gönderimi", "Satış fırsatlarının görünmemesi", "Teslimat ve müşteri iletişiminde gecikme"],
        approach: "Müşteri kaydından teklif ve iş teslimine kadar aşamaları, sorumluları ve belgeleri tek bir takip sistemi içinde modelleyebiliriz.",
        deliveryOptions: ["Web tabanlı CRM ve iş takip paneli", "Mobil müşteri ve görev ekranları", "E-posta, takvim veya muhasebe entegrasyonları", "Teklif belgesi üretimi"],
        features: ["Müşteri ve görüşme geçmişi", "Teklif sürüm ve durum takibi", "Görev ve hatırlatmalar", "İş aşamaları ve sorumlular", "Belge ve not yönetimi", "Satış ve operasyon raporları"],
        industries: ["Profesyonel hizmetler", "Teknik servis", "Eğitim", "Turizm"],
        deliverables: ["Müşteri ve iş veri modeli", "CRM/iş takip web uygulaması", "Teklif şablonları", "Entegrasyon ve kullanıcı dokümanı"],
        process: ["Talebin gelişinden iş kapanışına kadar süreci inceleriz.", "Müşteri, teklif, görev ve belge ilişkilerini tasarlarız.", "Ekiplerin kullandığı temel ekranları prototiple doğrularız.", "Yetki, veri geçişi ve bildirim testleriyle kullanıma alırız."],
        faq: [{ question: "Hazır CRM yerine neden özel sistem gerekir?", answer: "Süreç standart bir CRM ile karşılanıyorsa hazır ürün daha uygun olabilir; özel geliştirme ancak iş akışı veya entegrasyon ihtiyacı bunu gerektiriyorsa önerilir." }, { question: "Teklifler otomatik oluşturulabilir mi?", answer: "Ürün, fiyat ve onay kuralları netse kontrollü şablonlarla teklif belgesi üretimi tasarlanabilir." }],
        relatedServices: ["web-uygulamasi-gelistirme", "ozel-yazilim-gelistirme", "api-entegrasyonu-ve-otomasyon"],
        cta: { label: "Sürecinizi Anlatın", serviceValue: "Müşteri teklif ve iş takibi" },
    },
];

export const solutionContactValues = businessSolutions.map(({ cta }) => cta.serviceValue);
export const solutionSlugs = businessSolutions.map(({ slug }) => slug);

export function getBusinessSolution(slug: string) {
    return businessSolutions.find((solution) => solution.slug === slug);
}

export function getSolutionContactPath(solution: BusinessSolution) {
    return `${CORPORATE_CONTACT_PATH}&hizmet=${encodeURIComponent(solution.cta.serviceValue)}&kaynak=${encodeURIComponent(`/cozumler/${solution.slug}`)}`;
}
