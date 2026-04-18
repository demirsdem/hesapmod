import { CONTACT_FORM_PATH } from "./contact";
import { formatDateLabel, getCalculatorLastModified } from "./content-last-modified";
import { normalizeCategorySlug } from "./categories";
import { SITE_EDITOR_NAME } from "./site";

export type CalculatorTrustSource = {
    label: string;
    href?: string;
    note: string;
};

export type CalculatorTrustInfo = {
    methodology?: string;
    note?: string;
    sources?: CalculatorTrustSource[];
    reviewedAt?: Date;
    reviewedLabel?: string;
    editorName?: string;
    editorHref?: string;
    feedbackHref?: string;
};

type CalculatorTrustEntry = {
    methodology: string;
    note?: string;
    sources: CalculatorTrustSource[];
};

const categoryTrustContent: Record<string, CalculatorTrustEntry> = {
    "maas-ve-vergi": {
        methodology:
            "Bu kategorideki araçlar, yürürlükteki vergi ve sosyal güvenlik kuralları esas alınarak editoryal olarak gözden geçirilir. Oran, istisna ve tavan gerektiren alanlarda resmi kurum duyuruları ile mevzuat değişiklikleri izlenir.",
        sources: [
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergi dilimleri, istisnalar ve tebliğler" },
            { label: "Sosyal Güvenlik Kurumu", href: "https://www.sgk.gov.tr/", note: "prim oranları ve sosyal güvenlik uygulamaları" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "kanun, tebliğ ve resmi kararlar" },
            { label: "TÜİK", href: "https://www.tuik.gov.tr/", note: "endeks ve resmi istatistik verileri" },
        ],
    },
    "tasit-ve-vergi": {
        methodology:
            "Vergi ve maliyet odaklı taşıt araçlarında resmi vergi düzenlemeleri, yeniden değerleme mantığı ve kullanıcı girdileri birlikte kullanılır. Sonuçlar karar desteği içindir; resmi tahakkuk belgesinin yerine geçmez.",
        sources: [
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergisel uygulamalar ve beyan çerçevesi" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "oran ve mevzuat değişiklikleri" },
            { label: "TÜİK", href: "https://www.tuik.gov.tr/", note: "endeks ve resmi veri referansları" },
        ],
    },
    "finansal-hesaplamalar": {
        methodology:
            "Finans araçlarında kullanılan hesaplar matematiksel formüller, kullanıcı girdileri ve gerektiğinde resmi ekonomik veri kaynakları üzerinden kurulmuştur. Kur, kıymetli maden, vergi ve enflasyon referansları editoryal olarak gözden geçirilir; sonuçlar banka teklifi, yatırım tavsiyesi veya resmi fiyat teyidi yerine geçmez.",
        sources: [
            { label: "TCMB", href: "https://www.tcmb.gov.tr/", note: "kur, para politikası ve ekonomik veri referansları" },
            { label: "Borsa İstanbul Kıymetli Madenler Piyasası", href: "https://www.borsaistanbul.com/", note: "altın ve kıymetli maden piyasası yapısı için referans çerçeve" },
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergi ve stopaj uygulamaları" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "mevzuat ve oran değişiklikleri" },
            { label: "TÜİK", href: "https://www.tuik.gov.tr/", note: "enflasyon ve resmi istatistik verileri" },
        ],
    },
    "ticaret-ve-is": {
        methodology:
            "Ticaret ve iş araçları, fiyatlama ve maliyet mantığını pratik kullanım için sadeleştirir. Hesaplar işlem öncesi kontrol içindir; sözleşme, muhasebe veya mevzuat danışmanlığının yerini almaz.",
        sources: [
            { label: "Gelir İdaresi Başkanlığı", href: "https://www.gib.gov.tr/", note: "vergisel uygulama ve tanımlar" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "yasal oran ve düzenlemeler" },
            { label: "Türk Standardları Enstitüsü", href: "https://www.tse.org.tr/", note: "ölçü, standart ve teknik referans yaklaşımı" },
        ],
    },
    "sinav-hesaplamalari": {
        methodology:
            "Sınav araçları, ilgili sınav sistemlerinin puanlama mantığını yaklaşık veya doğrulanmış katsayı setleriyle modellemeye çalışır. Nihai sonuç belgesi her zaman ilgili kurum tarafından yayımlanan resmi sonuçtur.",
        sources: [
            { label: "ÖSYM", href: "https://www.osym.gov.tr/", note: "kılavuz, katsayı ve sınav açıklamaları" },
            { label: "Milli Eğitim Bakanlığı", href: "https://www.meb.gov.tr/", note: "ortaöğretim ve okul yerleştirme referansları" },
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "sınav sistemiyle ilişkili düzenlemeler" },
        ],
        note:
            "Bu kategoride bazı araçlar simülasyon üretir. Resmi katsayı veya yerleştirme kuralları değiştiğinde nihai otorite ilgili sınav kurumudur.",
    },
    "matematik-hesaplama": {
        methodology:
            "Matematik araçları yerleşik formüller, temel geometri ve cebir kuralları üzerinden çalışır. Bu kategori mevzuat değil, standart matematiksel doğruluk hedefler.",
        sources: [
            { label: "Milli Eğitim Bakanlığı", href: "https://www.meb.gov.tr/", note: "temel öğretim ve müfredat referans çerçevesi" },
            { label: "Yerleşik matematiksel formüller", note: "geometri, yüzde, oran ve temel cebir kuralları" },
        ],
    },
    "zaman-hesaplama": {
        methodology:
            "Zaman hesaplayıcıları takvim, tarih farkı, hafta ve gün mantığını algoritmik olarak hesaplar. Dini takvim veya resmi tarih içeren araçlarda ilgili kurumların yayımladığı referanslar takip edilir.",
        sources: [
            { label: "Resmi Gazete", href: "https://www.resmigazete.gov.tr/", note: "resmi tarih ve mevzuat düzenlemeleri" },
            { label: "Diyanet İşleri Başkanlığı", href: "https://www.diyanet.gov.tr/", note: "dini takvim ve vakit referansları" },
            { label: "Takvim ve tarih hesap kuralları", note: "gregoryen takvim, artık yıl ve gün farkı mantığı" },
        ],
    },
    "yasam-hesaplama": {
        methodology:
            "Yaşam ve sağlık araçları genel bilgilendirme amaçlıdır. Formüller uluslararası sağlık referansları, kullanıcı girdileri ve gerektiğinde resmi kurum yaklaşımıyla modellenir; tanı veya tedavi amacıyla kullanılmamalıdır.",
        sources: [
            { label: "T.C. Sağlık Bakanlığı", href: "https://www.saglik.gov.tr/", note: "ulusal sağlık rehberleri ve kamu bilgileri" },
            { label: "World Health Organization", href: "https://www.who.int/en/news-room/fact-sheets/detail/obesity-and-overweight", note: "özellikle BMI ve sağlık göstergeleri için referans yaklaşım" },
            { label: "Sosyal Güvenlik Kurumu", href: "https://www.sgk.gov.tr/", note: "sağlık uygulamalarıyla ilişkili kamu çerçevesi" },
        ],
        note:
            "Sağlık araçları tıbbi değerlendirme yerine geçmez. Belirti, tanı veya tedavi kararı için hekim görüşü gerekir.",
    },
    astroloji: {
        methodology:
            "Astroloji araçları doğum tarihi, saat ve konum girdileri üzerinden yorumlayıcı hesap üretir. Bu kategori bilimsel ölçüm veya sağlık/finans tavsiyesi sunmaz.",
        sources: [
            { label: "Doğum tarihi ve saat girdileri", note: "kullanıcının verdiği tarih, saat ve konum bilgileri" },
            { label: "Standart astrolojik hesap mantığı", note: "burç, yükselen ve zaman bazlı yorumlayıcı model" },
            { label: "Takvim ve zaman hesapları", note: "gün, ay, saat ve konum farkı hesapları" },
        ],
        note:
            "Astroloji sonuçları yorumlayıcıdır; bilimsel, tıbbi veya finansal karar dayanağı olarak kullanılmamalıdır.",
    },
};


const slugTrustOverrides: Record<string, Partial<CalculatorTrustInfo>> = {
                    'emeklilik-hesaplama': {
                        methodology: 'Emeklilik hesaplaması, SGK ve Resmi Gazete mevzuatı ile 2026 yılı yaş ve prim gün şartları esas alınarak yapılır.',
                        reviewedLabel: 'SGK Mevzuat Kontrolü',
                        editorName: 'HesapMod İK/Muhasebe Ekibi',
                        sources: [
                            { label: 'SGK', href: 'https://www.sgk.gov.tr/', note: 'emeklilik yaş ve prim gün şartları' }
                        ]
                    },
                    'serbest-meslek-makbuzu-hesaplama': {
                        methodology: 'Serbest meslek makbuzu hesaplaması, GİB ve Resmi Gazete 2026 yılı stopaj ve KDV oranları esas alınarak yapılır.',
                        reviewedLabel: 'GİB Mevzuat Kontrolü',
                        editorName: 'HesapMod Mali Müşavir Ekibi',
                        sources: [
                            { label: 'Gelir İdaresi Başkanlığı', href: 'https://www.gib.gov.tr/', note: 'stopaj ve KDV oranları' }
                        ]
                    },
                    'arac-muayene-ucreti-hesaplama': {
                        methodology: 'Araç muayene ücreti hesaplaması, TÜVTÜRK ve Resmi Gazete 2026 yılı tavan ücretleri ve gecikme cezası oranları esas alınarak yapılır.',
                        reviewedLabel: 'TÜVTÜRK/Resmi Gazete Kontrolü',
                        editorName: 'HesapMod Taşıt Ekibi',
                        sources: [
                            { label: 'TÜVTÜRK', href: 'https://www.tuvturk.com.tr/', note: 'araç muayene tavan ücretleri ve gecikme cezası' }
                        ]
                    },
                    'ek-ders-ucreti-hesaplama': {
                        methodology: 'Ek ders ücreti hesaplaması, MEB ve Resmi Gazete 2026 yılı ek ders katsayıları ve artırımlı ödeme esas alınarak yapılır.',
                        reviewedLabel: 'MEB Mevzuat Kontrolü',
                        editorName: 'HesapMod Eğitim/Finans Ekibi',
                        sources: [
                            { label: 'Milli Eğitim Bakanlığı', href: 'https://www.meb.gov.tr/', note: 'ek ders katsayıları ve ödeme esasları' }
                        ]
                    },
                    'klima-btu-hesaplama': {
                        methodology: 'Klima BTU hesaplaması, TMMOB Makine Mühendisleri Odası ve üretici teknik dokümanları esas alınarak yapılır.',
                        reviewedLabel: 'TMMOB/Teknik Kontrol',
                        editorName: 'HesapMod Teknik Ekibi',
                        sources: [
                            { label: 'TMMOB Makine Mühendisleri Odası', href: 'https://www.mmo.org.tr/', note: 'klima kapasite ve BTU hesaplama esasları' }
                        ]
                    },
                'hukuki-sure-hesaplama': {
                    methodology: 'Hukuki süre hesaplaması, Adalet Bakanlığı, HMK ve CMK mevzuatı ile adli tatil ve iş günü/takvim günü kuralları esas alınarak yapılır.',
                    reviewedLabel: 'Adalet Bakanlığı Mevzuat Kontrolü',
                    editorName: 'HesapMod Hukuk Ekibi',
                    sources: [
                        { label: 'Adalet Bakanlığı', href: 'https://www.adalet.gov.tr/', note: 'HMK, CMK ve adli tatil süreleri' }
                    ]
                },
                'uzlastirmaci-ucreti-hesaplama': {
                    methodology: 'Uzlaştırmacı ücreti hesaplaması, Adalet Bakanlığı 2026 yılı uzlaştırmacı asgari ücret tarifesi ve taraf sayısı esas alınarak yapılır.',
                    reviewedLabel: 'Adalet Bakanlığı Tarifesi Kontrolü',
                    editorName: 'HesapMod Hukuk Ekibi',
                    sources: [
                        { label: 'Adalet Bakanlığı', href: 'https://www.adalet.gov.tr/', note: 'uzlaştırmacı asgari ücret tarifesi ve mevzuat' }
                    ]
                },
                'taksi-ucreti-hesaplama': {
                    methodology: 'Taksi ücreti hesaplaması, UKOME ve büyükşehir belediyelerinin 2026 yılı taksimetre açılış, km ve indi-bindi ücretleri esas alınarak yapılır.',
                    reviewedLabel: 'UKOME/Belediye Tarifesi Kontrolü',
                    editorName: 'HesapMod Ulaşım Ekibi',
                    sources: [
                        { label: 'UKOME', note: 'taksimetre ve ulaşım tarifeleri' }
                    ]
                },
                'iller-arasi-mesafe-hesaplama': {
                    methodology: 'İller arası mesafe ve süre hesaplaması, Karayolları Genel Müdürlüğü verileri ve ortalama hız limitleri esas alınarak yapılır.',
                    reviewedLabel: 'Karayolları Genel Müdürlüğü Kontrolü',
                    editorName: 'HesapMod Seyahat Ekibi',
                    sources: [
                        { label: 'Karayolları Genel Müdürlüğü', href: 'https://www.kgm.gov.tr/', note: 'mesafe ve hız limitleri' }
                    ]
                },
                'zekat-hesaplama': {
                    methodology: 'Zekat hesaplaması, Diyanet İşleri Başkanlığı fetvaları ve 2026 yılı nisap miktarı esas alınarak yapılır.',
                    reviewedLabel: 'Diyanet İşleri Başkanlığı Fetva Kontrolü',
                    editorName: 'HesapMod Dini/Finans Ekibi',
                    sources: [
                        { label: 'Diyanet İşleri Başkanlığı', href: 'https://www.diyanet.gov.tr/', note: 'nisap miktarı ve zekat fetvaları' }
                    ]
                },
            'elektrikli-arac-sarj-maliyeti-hesaplama': {
                methodology: 'Elektrikli araç şarj maliyeti hesaplaması, EPDK ve şarj ağı işletmecilerinin 2026 yılı birim fiyatları ve batarya kapasitesi esas alınarak yapılır.',
                reviewedLabel: 'EPDK/Şarj Ağı Fiyat Kontrolü',
                editorName: 'HesapMod Enerji Ekibi',
                sources: [
                    { label: 'EPDK', href: 'https://www.epdk.gov.tr/', note: 'elektrik tarifeleri ve şarj istasyonu fiyatları' },
                    { label: 'Şarj Ağı İşletmecileri', note: 'piyasa şarj fiyatları ve uygulama örnekleri' }
                ]
            },
            'dask-sigortasi-hesaplama': {
                methodology: 'DASK sigortası hesaplaması, DASK Kurumu ve 2026 yılı yapı tarzı, risk bölgesi ve m² birim bedelleri esas alınarak yapılır.',
                reviewedLabel: 'DASK Kurumu Kontrolü',
                editorName: 'HesapMod Sigorta Ekibi',
                sources: [
                    { label: 'DASK Kurumu', href: 'https://www.dask.gov.tr/', note: 'zorunlu deprem sigortası teminat ve prim oranları' }
                ]
            },
            'binek-arac-gider-kisitlamasi-hesaplama': {
                methodology: 'Binek araç gider kısıtlaması hesaplaması, Gelir İdaresi Başkanlığı 2026 yılı limitleri ve KDV/ÖTV mevzuatı esas alınarak yapılır.',
                reviewedLabel: 'GİB Mevzuat Kontrolü',
                editorName: 'HesapMod Muhasebe Ekibi',
                sources: [
                    { label: 'Gelir İdaresi Başkanlığı', href: 'https://www.gib.gov.tr/', note: 'binek araç gider kısıtlaması ve KDV/ÖTV uygulamaları' }
                ]
            },
            'amortisman-hesaplama': {
                methodology: 'Amortisman hesaplaması, Vergi Usul Kanunu (VUK) ve 2026 yılı faydalı ömür ve amortisman oranları esas alınarak yapılır.',
                reviewedLabel: 'VUK Mevzuat Kontrolü',
                editorName: 'HesapMod Muhasebe Ekibi',
                sources: [
                    { label: 'Vergi Usul Kanunu', href: 'https://www.mevzuat.gov.tr/', note: 'amortisman oranları ve uygulama esasları' }
                ]
            },
            'arabuluculuk-ucreti-hesaplama': {
                methodology: 'Arabuluculuk ücreti hesaplaması, Adalet Bakanlığı 2026 yılı asgari ücret tarifesi ve taraf sayısı esas alınarak yapılır.',
                reviewedLabel: 'Adalet Bakanlığı Tarifesi Kontrolü',
                editorName: 'HesapMod Hukuk Ekibi',
                sources: [
                    { label: 'Adalet Bakanlığı', href: 'https://www.adalet.gov.tr/', note: 'arabuluculuk asgari ücret tarifesi ve mevzuat' }
                ]
            },
        'tapu-harci-hesaplama': {
            methodology: 'Tapu harcı hesaplaması, Tapu Kadastro Genel Müdürlüğü 2026 yılı oranları ve döner sermaye bedeli esas alınarak yapılır. Hem alıcı hem satıcıdan %2 oranında harç alınır.',
            reviewedLabel: 'Tapu Harcı Mevzuat Kontrolü',
            editorName: 'HesapMod Gayrimenkul Ekibi',
            sources: [
                { label: 'Tapu Kadastro Genel Müdürlüğü', href: 'https://www.tkgm.gov.tr/', note: 'tapu harcı oranları ve döner sermaye bedeli' }
            ]
        },
        'arac-deger-kaybi-hesaplama': {
            methodology: 'Araç değer kaybı hesaplaması, Yargıtay kararları ve Sigorta Tahkim Komisyonu standart formülleri baz alınarak yapılır.',
            reviewedLabel: 'Yargıtay/Sigorta Tahkim Kontrolü',
            editorName: 'HesapMod Sigorta/Hukuk Ekibi',
            sources: [
                { label: 'Yargıtay Kararları', href: 'https://www.yargitay.gov.tr/', note: 'değer kaybı tazminat hesaplama' },
                { label: 'Sigorta Tahkim Komisyonu', href: 'https://www.sigortatahkim.org.tr/', note: 'değer kaybı ve sigorta uyuşmazlıkları' }
            ]
        },
        'insaat-maliyeti-hesaplama': {
            methodology: 'İnşaat maliyeti hesaplaması, Çevre, Şehircilik ve İklim Değişikliği Bakanlığı 2026 yılı birim fiyatları esas alınarak yapılır.',
            reviewedLabel: 'Bakanlık Birim Fiyat Kontrolü',
            editorName: 'HesapMod Mühendislik Ekibi',
            sources: [
                { label: 'Çevre, Şehircilik ve İklim Değişikliği Bakanlığı', href: 'https://www.csb.gov.tr/', note: 'inşaat m² birim fiyatları' }
            ]
        },
        'yillik-izin-ucreti-hesaplama': {
            methodology: 'Yıllık izin ücreti hesaplaması, SGK ve İş Kanunu mevzuatı ile güncel vergi oranları esas alınarak yapılır.',
            reviewedLabel: 'SGK/İK Mevzuat Kontrolü',
            editorName: 'HesapMod Muhasebe/İK Ekibi',
            sources: [
                { label: 'SGK', href: 'https://www.sgk.gov.tr/', note: 'izin ücreti ve prim mevzuatı' },
                { label: 'İş Kanunu', href: 'https://www.mevzuat.gov.tr/', note: 'yıllık izin ve işten ayrılma hükümleri' }
            ]
        },
        'kisa-calisma-odenegi-hesaplama': {
            methodology: 'Kısa çalışma ödeneği hesaplaması, İŞKUR ve SGK mevzuatı ile 2026 yılı asgari ücret tavanı esas alınarak yapılır.',
            reviewedLabel: 'İŞKUR/SGK Mevzuat Kontrolü',
            editorName: 'HesapMod Muhasebe Ekibi',
            sources: [
                { label: 'İŞKUR', href: 'https://www.iskur.gov.tr/', note: 'kısa çalışma ödeneği şartları ve tavanı' },
                { label: 'SGK', href: 'https://www.sgk.gov.tr/', note: 'sigorta ve sağlık hizmetleri' }
            ]
        },
    'yuzde-hesaplama': {
        methodology: 'Evrensel matematiksel yüzde (percentage) formülleri kullanılmıştır.',
        reviewedLabel: 'Algoritma Kontrolü',
        editorName: 'HesapMod Matematik Ekibi',
    },
    'yas-hesaplama': {
        methodology: 'Miladi takvim standartlarına göre gün, ay ve yıl bazlı algoritmik zaman farkı kullanılmıştır.',
    },
    'indirim-hesaplama': {
        methodology: 'Ticari perakende indirim (discount) algoritmaları baz alınmıştır.'
    },
    'kasko-degeri-hesaplama': {
        methodology: 'Kasko değeri hesaplaması, TSB\'nin 2026 yılı araç değer listesi ve enflasyon koruma oranları baz alınarak yapılır.',
        reviewedLabel: 'TSB Kasko Değeri Kontrolü',
        editorName: 'HesapMod Sigorta Ekibi',
        sources: [
            { label: 'Türkiye Sigorta Birliği (TSB)', href: 'https://www.tsb.org.tr/', note: 'araç kasko değer listesi' }
        ]
    },
    'trafik-sigortasi-hesaplama': {
        methodology: 'Trafik sigortası hesaplaması, 2026 yılı tavan fiyatları ve hasarsızlık kademelerine göre yapılır.',
        reviewedLabel: 'Trafik Sigortası Tavan Kontrolü',
        editorName: 'HesapMod Sigorta Ekibi',
        sources: [
            { label: 'Hazine ve Maliye Bakanlığı', href: 'https://www.hmb.gov.tr/', note: 'trafik sigortası tavan fiyatları' }
        ]
    },
    'vekalet-ucreti-hesaplama': {
        methodology: 'Vekâlet ücreti hesaplaması, 2026 yılı AAÜT nispi ve maktu tarifelerine göre yapılır.',
        reviewedLabel: 'AAÜT Kontrolü',
        editorName: 'HesapMod Hukuk Ekibi',
        sources: [
            { label: 'Türkiye Barolar Birliği', href: 'https://www.barobirlik.org.tr/', note: 'AAÜT ve avukatlık ücret tarifeleri' }
        ]
    },
    'icra-masrafi-hesaplama': {
        methodology: 'İcra masrafı hesaplaması, 2026 yılı başvuru harcı, peşin harç ve vekalet suret harcı tutarları dikkate alınarak yapılır.',
        reviewedLabel: 'İcra Masrafı Kontrolü',
        editorName: 'HesapMod Hukuk Ekibi',
        sources: [
            { label: 'Adalet Bakanlığı', href: 'https://www.adalet.gov.tr/', note: 'icra mevzuatı ve harçlar' }
        ]
    },
    'issizlik-maasi-hesaplama': {
        methodology: 'İşsizlik maaşı hesaplaması, İŞKUR\'un 2026 yılı mevzuatı ve asgari ücret tavanı esas alınarak yapılır.',
        reviewedLabel: 'İŞKUR Kontrolü',
        editorName: 'HesapMod Muhasebe Ekibi',
        sources: [
            { label: 'İŞKUR', href: 'https://www.iskur.gov.tr/', note: 'işsizlik maaşı mevzuatı ve tavan-taban limitleri' }
        ]
    },
    'basit-faiz-hesaplama': {
        methodology: 'Evrensel basit faiz oranı hesaplama standartları baz alınmıştır.',
        reviewedLabel: 'Güncel Oran Kontrolü',
        editorName: 'HesapMod Finans/Hukuk Ekibi',
    },
    'kredi-taksit-hesaplama': {
        methodology: 'Bankacılık Düzenleme ve Denetleme Kurumu (BDDK) standart kredi amortisman formülleri baz alınmıştır.',
        reviewedLabel: 'Güncel Oran Kontrolü',
        editorName: 'HesapMod Finans/Hukuk Ekibi',
    },
    'vergi-gecikme-faizi-hesaplama': {
        methodology: 'Hazine ve Maliye Bakanlığı güncel tahsilat genel tebliğleri ve gecikme zammı oranları baz alınmıştır.',
        reviewedLabel: 'Mevzuat Kontrolü',
        editorName: 'HesapMod Vergi Ekibi',
    },
    'asgari-ucret-hesaplama': {
        methodology: 'Çalışma ve Sosyal Güvenlik Bakanlığı Asgari Ücret Tespit Komisyonu güncel tebliğleri baz alınmıştır.',
        reviewedLabel: 'Güncel Oran Kontrolü',
        editorName: 'HesapMod Finans/Hukuk Ekibi',
    },
    'kar-hesaplama': {
        methodology: 'Şirketlerin temettü dağıtımında kullandığı Borsa İstanbul (BİST) ve SPK standartları baz alınmıştır.',
        reviewedLabel: 'Güncel Oran Kontrolü',
        editorName: 'HesapMod Finans/Hukuk Ekibi',
    },
};

export function getCalculatorTrustInfo(slug: string, category: string): CalculatorTrustInfo {
    const normalizedCategory = normalizeCategorySlug(category);
    const trustContent = categoryTrustContent[normalizedCategory] ?? {
        methodology:
            "Bu sayfa, ilgili kategorinin hesaplama mantığı ve kullanıcı girdileri temel alınarak editoryal olarak gözden geçirilmiştir.",
        sources: [{ label: "Kategoriye uygun editoryal referanslar", note: "mevzuat, resmi veri veya yerleşik formüller" }],
    };
    const reviewedAt = getCalculatorLastModified(slug);
    const slugOverride = slugTrustOverrides[slug] || {};

    return {
        editorName: SITE_EDITOR_NAME,
        editorHref: "/hakkimizda",
        feedbackHref: CONTACT_FORM_PATH,
        reviewedAt,
        reviewedLabel: formatDateLabel(reviewedAt),
        ...trustContent,
        ...slugOverride,
    };
}
