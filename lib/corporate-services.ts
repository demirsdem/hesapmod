export const CORPORATE_BASE_PATH = "/kurumsal";
export const CORPORATE_CONTACT_PATH = "/iletisim?konu=kurumsal-yazilim";

export type CorporateFaq = { question: string; answer: string };

export type CorporateService = {
    slug: string;
    title: string;
    shortTitle: string;
    shortDescription: string;
    description: string;
    problems: string[];
    capabilities: string[];
    process: string[];
    suitableFor: string[];
    deliverables: string[];
    faq: CorporateFaq[];
    relatedServices: string[];
    metadata: { title: string; description: string };
};

export const corporateServices: CorporateService[] = [
    {
        slug: "ozel-yazilim-gelistirme",
        title: "İşletmenize Özel Yazılım Geliştirme",
        shortTitle: "Özel yazılım geliştirme",
        shortDescription: "Hazır ürünlerin karşılamadığı süreçler için işinize uyum sağlayan güvenli ve sürdürülebilir yazılımlar.",
        description: "Operasyonunuzu kalıplara sığdırmak yerine, gerçek iş akışlarınızı analiz ederek kurumunuza özgü bir çözüm tasarlıyor ve geliştiriyoruz.",
        problems: ["Dağınık araçlar ve manuel veri aktarımı", "Hazır yazılımların kritik süreçlere uyum sağlamaması", "Büyümeyi zorlaştıran eski veya parçalı sistemler"],
        capabilities: ["İhtiyaç ve süreç analizi", "Web, mobil veya masaüstü çözüm mimarisi", "Rol, yetki ve iş akışı yönetimi", "Mevcut sistemlerle entegrasyon", "Test, devreye alma ve teknik dokümantasyon"],
        process: ["İş hedeflerini ve kullanıcı rollerini netleştiririz.", "Kapsamı, veri modelini ve teknik mimariyi tasarlarız.", "Öncelikli akışları prototiple doğrularız.", "Sürümler halinde geliştirir, test eder ve devreye alırız."],
        suitableFor: ["Operasyonunu dijitalleştiren KOBİ'ler", "Kendine özgü iş akışları bulunan ekipler", "Eski sistemini kontrollü biçimde yenilemek isteyen işletmeler"],
        deliverables: ["Analiz ve kapsam dokümanı", "Çalışan uygulama ve kaynak kod teslimi", "Test senaryoları", "Kurulum ve kullanım dokümantasyonu"],
        faq: [{ question: "Özel yazılım projesinin süresi nasıl belirlenir?", answer: "Süre; kullanıcı rolleri, entegrasyonlar, veri taşıma ihtiyacı ve öncelikli özellikler netleştirildikten sonra aşamalı bir teslim planıyla belirlenir." }, { question: "Mevcut sistemimiz korunabilir mi?", answer: "Uygunsa mevcut veriler ve servisler korunur; geçiş riski entegrasyon veya kademeli modernizasyon yaklaşımıyla azaltılır." }],
        relatedServices: ["web-uygulamasi-gelistirme", "api-entegrasyonu-ve-otomasyon", "yazilim-bakim-ve-destek"],
        metadata: { title: "Özel Yazılım Geliştirme", description: "İş süreçlerinize özel, ölçeklenebilir web, mobil ve masaüstü yazılım çözümleri için analizden devreye almaya uçtan uca geliştirme hizmeti." },
    },
    {
        slug: "web-uygulamasi-gelistirme",
        title: "Web Uygulaması Geliştirme",
        shortTitle: "Web uygulamaları",
        shortDescription: "Tarayıcıdan erişilen hızlı, güvenli ve ölçeklenebilir iş uygulamaları ve yönetim panelleri.",
        description: "Müşteri portallarından operasyon panellerine kadar farklı ekranlara uyumlu, erişilebilir ve iş süreçleriyle bütünleşen web uygulamaları geliştiriyoruz.",
        problems: ["Elektronik tablo ve e-posta üzerinden yürüyen operasyonlar", "Mobilde kullanılamayan eski paneller", "Yavaş, güvenlik riski taşıyan veya ölçeklenemeyen web sistemleri"],
        capabilities: ["Responsive kullanıcı arayüzleri", "Yönetim ve raporlama panelleri", "Rol tabanlı erişim", "API ve veritabanı geliştirme", "Performans, güvenlik ve erişilebilirlik kontrolleri"],
        process: ["Kullanıcı yolculuklarını ve başarı ölçütlerini çıkarırız.", "Bilgi mimarisi ile ekran akışlarını prototipleriz.", "Frontend ve backend katmanlarını birlikte geliştiririz.", "Gerçek cihaz, tarayıcı ve yetki senaryolarıyla test ederiz."],
        suitableFor: ["Müşteri veya bayi portalına ihtiyaç duyan şirketler", "Operasyonunu ortak bir panelde yönetmek isteyen ekipler", "Web tabanlı ürün geliştiren girişimler"],
        deliverables: ["Responsive web uygulaması", "Yönetim paneli", "API ve veri modeli", "Test ve yayınlama dokümanları"],
        faq: [{ question: "Web uygulaması ile web sitesi arasındaki fark nedir?", answer: "Web sitesi çoğunlukla içerik sunar; web uygulaması kullanıcı girişi, veri işleme, iş akışları ve etkileşimli görevler içerir." }, { question: "Uygulama telefonda da çalışır mı?", answer: "Arayüzler responsive tasarlanır ve kapsamda belirlenen mobil tarayıcılarla gerçek cihaz senaryolarında doğrulanır." }],
        relatedServices: ["ozel-yazilim-gelistirme", "saas-gelistirme", "api-entegrasyonu-ve-otomasyon"],
        metadata: { title: "Web Uygulaması Geliştirme", description: "İşletmeler için responsive web uygulaması, müşteri portalı, yönetim paneli ve güvenli backend geliştirme hizmetleri." },
    },
    {
        slug: "mobil-uygulama-gelistirme",
        title: "Android ve iOS Mobil Uygulama Geliştirme",
        shortTitle: "Mobil uygulama geliştirme",
        shortDescription: "Saha ekipleri ve müşteriler için Android/iOS deneyimini iş sistemlerinize bağlayan mobil uygulamalar.",
        description: "Mobil kullanım bağlamını, bağlantı koşullarını ve cihaz yeteneklerini dikkate alarak kullanıcıların görevlerini hızlı tamamlayabildiği uygulamalar tasarlıyoruz.",
        problems: ["Saha süreçlerinin kâğıt veya mesajlaşma uygulamalarıyla yürütülmesi", "Müşteriye mobil kanaldan hizmet verilememesi", "Web ekranlarının küçük cihazlarda verimsiz kalması"],
        capabilities: ["Android ve iOS uygulama geliştirme", "Bildirim, kamera ve konum özellikleri", "Çevrimdışı çalışma senaryoları", "Backend ve üçüncü taraf servis bağlantıları", "Mağaza yayınına teknik hazırlık"],
        process: ["Mobil kullanıcı bağlamını ve cihaz gereksinimlerini belirleriz.", "Kritik ekranları etkileşimli prototiple doğrularız.", "Uygulamayı API katmanıyla birlikte geliştiririz.", "Cihaz testleri ve yayın öncesi kontrolleri tamamlarız."],
        suitableFor: ["Saha operasyonu bulunan işletmeler", "Müşteri deneyimini mobil kanala taşımak isteyen markalar", "Mobil öncelikli ürün geliştiren ekipler"],
        deliverables: ["Android/iOS uygulama paketleri", "Kaynak kod", "API entegrasyonları", "Test ve yayın kontrol listesi"],
        faq: [{ question: "Tek uygulama iki platformda çalışabilir mi?", answer: "İhtiyaca göre ortak kod tabanlı veya platforma özgü yaklaşım seçilebilir; karar performans, cihaz özellikleri ve bakım hedeflerine göre verilir." }, { question: "Mağaza yayını garanti edilir mi?", answer: "Teknik hazırlık ve başvuru desteği sağlanabilir; nihai onay Apple ve Google'ın güncel inceleme politikalarına bağlıdır." }],
        relatedServices: ["api-entegrasyonu-ve-otomasyon", "ozel-yazilim-gelistirme", "yazilim-bakim-ve-destek"],
        metadata: { title: "Mobil Uygulama Geliştirme", description: "İş süreçlerine bağlı Android ve iOS mobil uygulamalar; analiz, UX, API entegrasyonu, test ve yayın hazırlığı hizmetleri." },
    },
    {
        slug: "masaustu-yazilim-gelistirme",
        title: "Masaüstü Yazılım Geliştirme",
        shortTitle: "Masaüstü yazılımlar",
        shortDescription: "Donanım, yerel ağ veya yoğun veri işleme gerektiren süreçler için güvenilir masaüstü uygulamaları.",
        description: "Windows ve uygun platformlarda cihazlarla, dosya sistemleriyle veya kurum içi servislerle çalışan kontrollü masaüstü çözümleri geliştiriyoruz.",
        problems: ["Tarayıcıda karşılanamayan donanım erişimi", "Eski masaüstü yazılımın bakım ve uyumluluk sorunları", "Yerel ağda güvenli ve kesintisiz çalışma ihtiyacı"],
        capabilities: ["İş istasyonu ve yerel ağ uygulamaları", "Cihaz, yazıcı ve dosya entegrasyonları", "Yerel veri ve senkronizasyon", "Kurulum ve güncelleme akışları", "Eski uygulama modernizasyonu"],
        process: ["Çalışma ortamını ve donanım bağımlılıklarını inceleriz.", "Dağıtım, veri güvenliği ve çevrimdışı senaryolarını tasarlarız.", "Temel iş akışını pilot kullanıcılarla doğrularız.", "Kurulum paketi, test ve geçiş planıyla teslim ederiz."],
        suitableFor: ["Üretim ve operasyon istasyonları", "Yerel ağ veya özel cihaz kullanan ekipler", "Eski masaüstü sistemini yenileyen kurumlar"],
        deliverables: ["Masaüstü uygulaması", "Kurulum/güncelleme paketi", "Entegrasyon modülleri", "Teknik ve kullanıcı dokümantasyonu"],
        faq: [{ question: "Masaüstü yazılım çevrimdışı çalışabilir mi?", answer: "Süreç uygunsa yerel veri saklama ve sonradan senkronizasyon tasarlanabilir; veri tutarlılığı kuralları analiz aşamasında belirlenir." }, { question: "Mevcut cihazlarla entegrasyon yapılabilir mi?", answer: "Üreticinin sürücü, SDK veya iletişim protokolü sağlaması durumunda teknik uygunluk analiziyle entegrasyon planlanabilir." }],
        relatedServices: ["ozel-yazilim-gelistirme", "api-entegrasyonu-ve-otomasyon", "yazilim-bakim-ve-destek"],
        metadata: { title: "Masaüstü Yazılım Geliştirme", description: "Yerel ağ, cihaz ve çevrimdışı çalışma ihtiyaçları için kuruma özel masaüstü yazılım geliştirme ve modernizasyon hizmetleri." },
    },
    {
        slug: "api-entegrasyonu-ve-otomasyon",
        title: "API Entegrasyonu ve İş Süreçleri Otomasyonu",
        shortTitle: "API ve otomasyon",
        shortDescription: "Sistemler arası veri akışını güvenilir hâle getiren entegrasyonlar ve tekrarlı işleri azaltan otomasyonlar.",
        description: "Birbirinden kopuk uygulamaları kontrollü veri akışlarıyla birleştiriyor; izlenebilir, hata yönetimi bulunan otomasyonlar kuruyoruz.",
        problems: ["Aynı verinin farklı sistemlere tekrar girilmesi", "Manuel aktarım kaynaklı hata ve gecikmeler", "Entegrasyon hatalarının geç fark edilmesi"],
        capabilities: ["REST, webhook ve dosya tabanlı entegrasyon", "Zamanlanmış iş akışları", "Veri eşleme ve doğrulama", "Hata kaydı, tekrar deneme ve bildirim", "Entegrasyon izleme panelleri"],
        process: ["Kaynak ve hedef sistemlerin sözleşmelerini inceleriz.", "Veri eşleme, güvenlik ve hata senaryolarını tanımlarız.", "Test ortamında uçtan uca akışı doğrularız.", "İzleme ve geri dönüş planıyla canlıya alırız."],
        suitableFor: ["Birden fazla iş sistemi kullanan şirketler", "Tekrarlı operasyon yükünü azaltmak isteyen ekipler", "Veri akışını ölçülebilir hâle getirmek isteyen kurumlar"],
        deliverables: ["Entegrasyon servisleri", "Otomasyon iş akışları", "Loglama ve izleme mekanizması", "API/veri eşleme dokümantasyonu"],
        faq: [{ question: "Her sistemle API entegrasyonu yapılabilir mi?", answer: "Hedef sistemin API, dosya aktarımı veya başka güvenli bir bağlantı yöntemi sunması gerekir; erişim ve limitler ön analizde doğrulanır." }, { question: "Otomasyon hata verirse ne olur?", answer: "Kritik akışlarda doğrulama, kayıt, kontrollü tekrar deneme ve bildirim mekanizmaları tasarlanır." }],
        relatedServices: ["ozel-yazilim-gelistirme", "web-uygulamasi-gelistirme", "saas-gelistirme"],
        metadata: { title: "API Entegrasyonu ve Otomasyon", description: "Sistemler arası API entegrasyonu, veri senkronizasyonu ve izlenebilir iş süreci otomasyonu geliştirme hizmetleri." },
    },
    {
        slug: "saas-gelistirme",
        title: "SaaS ve Abonelik Sistemi Geliştirme",
        shortTitle: "SaaS geliştirme",
        shortDescription: "Çok kullanıcılı, abonelik odaklı ve büyümeye hazır yazılım ürünleri için sağlam teknik temel.",
        description: "Ürün fikrini doğrulanabilir bir kapsama dönüştürerek tenant, yetkilendirme, abonelik ve operasyon ihtiyaçlarını birlikte ele alan SaaS çözümleri geliştiriyoruz.",
        problems: ["Ürün fikrinin teknik kapsama dönüştürülememesi", "Kullanıcı ve şirket verilerinin güvenli ayrıştırılamaması", "Abonelik, yetki ve operasyon süreçlerinin parçalı kalması"],
        capabilities: ["Çok kiracılı uygulama mimarisi", "Kullanıcı, ekip ve yetki yönetimi", "Abonelik ve plan kurgusu entegrasyonları", "Yönetim, kullanım ve raporlama ekranları", "Ölçeklenebilir API ve veri modeli"],
        process: ["Hedef kullanıcıyı ve doğrulanacak ürün varsayımını belirleriz.", "MVP kapsamını ve büyüme mimarisini dengeleriz.", "Temel ürün akışını ölçülebilir biçimde geliştiririz.", "Yayın, izleme ve sonraki sürüm planını oluştururuz."],
        suitableFor: ["Yeni dijital ürün geliştiren girişimler", "Hizmetini abonelik modeline taşıyan şirketler", "Kurum içi çözümünü ürünleştirmek isteyen ekipler"],
        deliverables: ["SaaS web uygulaması", "Kullanıcı/tenant yönetimi", "Abonelik entegrasyon katmanı", "Yönetim paneli ve teknik dokümantasyon"],
        faq: [{ question: "MVP ile başlanabilir mi?", answer: "Evet. İlk sürüm, temel değer önerisini gerçek kullanıcıyla doğrulayacak en küçük güvenli kapsam olarak planlanabilir." }, { question: "Ödeme altyapısı dahil mi?", answer: "Seçilen sağlayıcının teknik ve hukuki koşulları uygun olduğunda ödeme ve abonelik akışı entegrasyon kapsamına alınabilir." }],
        relatedServices: ["web-uygulamasi-gelistirme", "api-entegrasyonu-ve-otomasyon", "yazilim-bakim-ve-destek"],
        metadata: { title: "SaaS Geliştirme", description: "MVP'den ölçeklenebilir ürüne; çok kiracılı mimari, abonelik, yetkilendirme ve yönetim paneliyle SaaS geliştirme hizmeti." },
    },
    {
        slug: "yazilim-bakim-ve-destek",
        title: "Yazılım Bakım ve Teknik Destek",
        shortTitle: "Yazılım bakım ve destek",
        shortDescription: "Mevcut yazılımın güvenli, izlenebilir ve sürdürülebilir kalması için planlı teknik bakım.",
        description: "Kod tabanını ve çalışma ortamını inceleyerek hata giderme, sürüm uyumluluğu, performans ve geliştirme ihtiyaçlarını önceliklendiriyoruz.",
        problems: ["Tekrarlayan hatalar ve belirsiz müdahale süreci", "Eski bağımlılıklar ve güvenlik riskleri", "Dokümantasyon eksikliği nedeniyle yavaşlayan geliştirme"],
        capabilities: ["Teknik durum ve kod incelemesi", "Hata düzeltme ve kök neden analizi", "Güvenli bağımlılık/sürüm planlaması", "Performans ve izlenebilirlik iyileştirmeleri", "Küçük geliştirmeler ve teknik dokümantasyon"],
        process: ["Sistemin kritik akışlarını ve mevcut sorunlarını envanterleriz.", "Risk ve iş etkisine göre bakım planı oluştururuz.", "Değişiklikleri kontrollü ortamda test ederiz.", "Yayın sonucunu izler ve yapılan işi belgeleriz."],
        suitableFor: ["Aktif kullanılan yazılımı bulunan işletmeler", "Teknik borcunu kontrollü azaltmak isteyen ekipler", "Düzenli bakım ve geliştirme desteğine ihtiyaç duyan ürünler"],
        deliverables: ["Teknik durum raporu", "Düzeltilen ve iyileştirilen sürümler", "Test/yayın kayıtları", "Bakım ve önceliklendirme dokümanı"],
        faq: [{ question: "Başka ekip tarafından yazılmış uygulamaya destek verilebilir mi?", answer: "Kod, lisanslar, erişimler ve teknik durum incelendikten sonra destek kapsamı ve devralma riskleri şeffaf biçimde belirlenebilir." }, { question: "Acil destek hizmeti var mı?", answer: "Müdahale süresi ve kapsam, sistem incelendikten sonra hazırlanacak bakım anlaşmasında tanımlanır; incelenmemiş sistem için süre garantisi verilmez." }],
        relatedServices: ["ozel-yazilim-gelistirme", "web-uygulamasi-gelistirme", "api-entegrasyonu-ve-otomasyon"],
        metadata: { title: "Yazılım Bakım ve Teknik Destek", description: "Mevcut web, mobil ve masaüstü yazılımlar için teknik inceleme, hata giderme, performans, güncelleme ve sürdürülebilir bakım hizmetleri." },
    },
];

export const corporateServiceSlugs = corporateServices.map((service) => service.slug);

export function getCorporateService(slug: string) {
    return corporateServices.find((service) => service.slug === slug);
}
