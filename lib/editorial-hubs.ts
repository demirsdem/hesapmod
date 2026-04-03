import "server-only";

import { getArticleBySlug, type Article } from "./articles";
import { findCalculatorBySlug } from "./calculators";

export type EditorialCalculatorLinkConfig = {
    slug: string;
    label: string;
    description: string;
};

export type EditorialArticleLinkConfig = {
    slug: string;
    blurb?: string;
};

export type EditorialCalculatorLink = EditorialCalculatorLinkConfig & {
    href: string;
    name: string;
    category: string;
};

export type EditorialArticleLink = {
    href: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    categorySlug: string;
    publishedAt: string;
    updatedAt: string | undefined;
    blurb: string;
};

export type ArticleFeaturedCalculatorSection = {
    title: string;
    description: string;
    links: EditorialCalculatorLink[];
};

export type GuideLandingConfig = {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    articleLinks: EditorialArticleLinkConfig[];
    calculatorLinks: EditorialCalculatorLinkConfig[];
};

export type CategorySpotlightConfig = {
    eyebrow: string;
    title: string;
    description: string;
    calculatorLinks: EditorialCalculatorLinkConfig[];
    guideLinks: EditorialArticleLinkConfig[];
};

export function resolveEditorialCalculatorLinks(
    configs: EditorialCalculatorLinkConfig[]
): EditorialCalculatorLink[] {
    return configs
        .map((config) => {
            const calculator = findCalculatorBySlug(config.slug);
            if (!calculator) {
                return null;
            }

            return {
                ...config,
                href: `/${calculator.category}/${calculator.slug}`,
                name: calculator.name.tr,
                category: calculator.category,
            } satisfies EditorialCalculatorLink;
        })
        .filter((item): item is EditorialCalculatorLink => item !== null);
}

export function resolveEditorialArticleLinks(
    configs: EditorialArticleLinkConfig[]
): EditorialArticleLink[] {
    return configs
        .map((config) => {
            const article = getArticleBySlug(config.slug);
            if (!article) {
                return null;
            }

            return {
                href: `/rehber/${article.slug}`,
                slug: article.slug,
                title: article.title,
                description: article.description,
                category: article.category,
                categorySlug: article.categorySlug,
                publishedAt: article.publishedAt,
                updatedAt: article.updatedAt,
                blurb: config.blurb ?? article.description,
            } satisfies EditorialArticleLink;
        })
        .filter((item): item is EditorialArticleLink => item !== null);
}

export type FeaturedClusterId =
    | "investment"
    | "eurobond"
    | "credit"
    | "cardDebt"
    | "salary"
    | "tax"
    | "severance"
    | "rent"
    | "examYks"
    | "examSchool";

export type FeaturedClusterConfig = {
    title: string;
    description: string;
    links: EditorialCalculatorLinkConfig[];
};

export const ARTICLE_TO_FEATURED_CLUSTER: Partial<Record<string, FeaturedClusterId>> = {
    "mevduat-faizi-enflasyon-ve-reel-getiri-rehberi": "investment",
    "eurobond-getirisi-nasil-hesaplanir": "eurobond",
    "eurobond-vergi-hesaplama-2026": "eurobond",
    "kredi-faizi-ve-aylik-taksit-rehberi": "credit",
    "kredi-karti-faizi-asgari-odeme-ve-yapilandirma-rehberi": "cardDebt",
    "brut-net-maas-farki": "salary",
    "vergi-hesaplama-rehberi-2026": "tax",
    "kidem-tazminati-hesaplama-rehberi": "severance",
    "kira-artis-orani-ve-tufe-rehberi": "rent",
    "sinav-puanlari-rehberi-2026": "examYks",
    "okul-giris-sinav-rehberi-2026": "examSchool",
};

export const FEATURED_CLUSTER_CONFIGS: Record<FeaturedClusterId, FeaturedClusterConfig> = {
    investment: {
        title: "Bu rehberle birlikte hangi araçlar açılmalı?",
        description:
            "Önce vadeli mevduat getirisi hesaplama sonucunu görün; ardından enflasyon ve reel getiri araçlarıyla kazancın satın alma gücüne gerçekten katkı yapıp yapmadığını test edin.",
        links: [
            { slug: "mevduat-faiz-hesaplama", label: "vadeli mevduat getirisi hesaplama", description: "Stopaj sonrası net faiz ve vade sonu toplamını karşılaştırın." },
            { slug: "enflasyon-hesaplama", label: "enflasyona göre değer kaybı hesaplama", description: "Nominal getiri yüksek görünse bile alım gücünü ayrıca ölçün." },
            { slug: "reel-getiri-hesaplama", label: "reel getiri hesaplama", description: "Yatırımın gerçek kazancını enflasyon etkisini çıkararak görün." },
            { slug: "eurobond-hesaplama", label: "eurobond getirisi hesaplama", description: "Mevduat dışı sabit getirili alternatifleri aynı kararla birlikte düşünün." },
        ],
    },
    eurobond: {
        title: "Eurobond rehberini hangi araçlarla tamamlamalısınız?",
        description:
            "Kupon ve vade hesabını tek başına bırakmak yerine döviz, bono ve mevduat tarafıyla birlikte karşılaştırdığınızda daha net bir yatırım resmi oluşur.",
        links: [
            { slug: "eurobond-hesaplama", label: "eurobond getirisi hesaplama", description: "Kupon, fiyat ve vade ilişkisini doğrudan senaryolayın." },
            { slug: "doviz-hesaplama", label: "döviz çevirici", description: "USD ve EUR nakit akışının TL karşılığını hızlıca görün." },
            { slug: "bono-hesaplama", label: "bono getirisi hesaplama", description: "Farklı borçlanma araçlarını getiri mantığı açısından kıyaslayın." },
            { slug: "mevduat-faiz-hesaplama", label: "net mevduat getirisi hesaplama", description: "Eurobondu TL mevduat alternatifiyle birlikte okuyun." },
        ],
    },
    credit: {
        title: "Kredi rehberinden sonra hangi araçlara geçilmeli?",
        description:
            "Aylık kredi taksiti hesaplama ile genel ödeme planını görün; sonra ihtiyaca göre ihtiyaç, konut ve taşıt kredisi ekranlarında daha spesifik senaryolara geçin.",
        links: [
            { slug: "kredi-taksit-hesaplama", label: "kredi geri ödeme planı hesaplama", description: "Aylık taksit ve toplam geri ödemeyi genel kredi mantığıyla görün." },
            { slug: "ihtiyac-kredisi-hesaplama", label: "ihtiyaç kredisi aylık taksit hesabı", description: "Kısa ve orta vadeli bireysel borç için gerçek maliyeti görün." },
            { slug: "konut-kredisi-hesaplama", label: "konut kredisi taksit hesabı", description: "Peşinat ve uzun vade etkisini ayrı değerlendirin." },
            { slug: "tasit-kredisi-hesaplama", label: "taşıt kredisi hesaplama", description: "Araç finansmanında faiz ve vade değişiminin toplam maliyetini test edin." },
        ],
    },
    cardDebt: {
        title: "Kart borcu rehberinden sonra hızlı kontrol araçları",
        description:
            "Kart borcunu yalnız asgari tutar üzerinden okumayın. Gecikme faizi, yapılandırma ve minimum ödeme baskısını ayrı ayrı görün ki toplam maliyet netleşsin.",
        links: [
            { slug: "kredi-karti-gecikme-faizi-hesaplama", label: "kredi kartı gecikme faizi hesaplama", description: "Gecikmenin borcu ay bazında nasıl büyüttüğünü görün." },
            { slug: "kredi-karti-asgari-odeme", label: "kart asgari ödeme tutarı hesaplama", description: "Minimum ödeme baskısını ve kalan borcun akışını test edin." },
            { slug: "kredi-yapilandirma-hesaplama", label: "borç yapılandırma hesaplama", description: "Mevcut kart yükünü yeni planla karşılaştırarak değerlendirin." },
        ],
    },
    salary: {
        title: "Bordro rehberinden sonra bu ekranlara geçin",
        description:
            "Brüt ve net maaş farkını öğrendikten sonra aynı bordronun vergi ve taban ücret etkisini daha net görmek için aşağıdaki araçları birlikte kullanın.",
        links: [
            { slug: "maas-hesaplama", label: "net maaş hesaplama", description: "Brütten nete ve netten brüte bordro senaryosunu hızlıca çalıştırın." },
            { slug: "gelir-vergisi-hesaplama", label: "gelir vergisi hesaplama", description: "Yıllık tarife değişiminin net ücret üzerindeki etkisini görün." },
            { slug: "asgari-ucret-hesaplama", label: "asgari ücret net hesabı", description: "Taban ücretle kendi bordronuzu karşılaştırırken referans alın." },
        ],
    },
    tax: {
        title: "Vergi rehberini bu araçlarla tamamlayın",
        description:
            "KDV, gelir vergisi ve kira vergisi başlıklarını tek içerikte okuduktan sonra hesap tarafına geçerek hangi kalemin sonucu daha çok etkilediğini netleştirin.",
        links: [
            { slug: "gelir-vergisi-hesaplama", label: "gelir vergisi hesaplama", description: "Tarife ve dilim değişiminin vergi yüküne etkisini görün." },
            { slug: "kdv-hesaplama", label: "KDV dahil / hariç hesaplama", description: "Matrah ve toplam fiyat ilişkisini anında test edin." },
            { slug: "kira-vergisi-hesaplama", label: "kira vergisi hesaplama", description: "İstisna ve gider yöntemiyle vergi farkını birlikte okuyun." },
        ],
    },
    severance: {
        title: "Tazminat rehberini destekleyen araçlar",
        description:
            "Kıdem hesabını netleştirirken yalnız hizmet süresine değil, brüt ücret ve olası ihbar senaryosuna da bakmak gerekir. Bu üç araç birlikte daha net karar verir.",
        links: [
            { slug: "kidem-tazminati-hesaplama", label: "kıdem tazminatı hesaplama", description: "Tavan, giydirilmiş ücret ve damga vergisini bir arada görün." },
            { slug: "ihbar-tazminati-hesaplama", label: "ihbar tazminatı hesabı", description: "Çıkış süresi ve ücret etkisini aynı senaryoda kıyaslayın." },
            { slug: "maas-hesaplama", label: "brütten net maaş hesaplama", description: "Kıdem tabanında kullanılan ücret yapısını daha net okuyun." },
        ],
    },
    rent: {
        title: "Kira rehberini hangi hesaplarla tamamlamalısınız?",
        description:
            "Kira artışı yorumunda yalnız oranı görmek yetmez. Yeni kira tutarını, enflasyon etkisini ve barınma alternatiflerini birlikte değerlendirmek daha güçlü karar desteği sağlar.",
        links: [
            { slug: "kira-artis-hesaplama", label: "yeni kira tutarı hesaplama", description: "Güncel TÜFE oranıyla artış tutarını ve yeni bedeli hesaplayın." },
            { slug: "enflasyon-hesaplama", label: "enflasyon hesaplama", description: "Kira artışının satın alma gücü üzerindeki gerçek etkisini okuyun." },
            { slug: "kira-mi-konut-kredisi-mi-hesaplama", label: "kira mı konut kredisi mi analizi", description: "Barınma kararını kira ve kredi tarafını birlikte kıyaslayarak görün." },
        ],
    },
    examYks: {
        title: "Sınav rehberinden sonra hangi araçlara geçilmeli?",
        description:
            "Bu rehber puan mantığını açıklıyor; sayıların nasıl değiştiğini görmek için YKS puan hesaplama, TYT AYT puan hesaplama ve OBP katkısı hesaplama ekranlarını birlikte açın.",
        links: [
            { slug: "yks-puan-hesaplama", label: "YKS puan hesaplama", description: "TYT, AYT, YDT ve OBP etkisini tek senaryoda görün." },
            { slug: "tyt-puan-hesaplama", label: "TYT AYT puan hesaplama", description: "Temel puan bandınızı YKS öncesi ayrı ve hızlı okuyun." },
            { slug: "obp-puan-hesaplama", label: "OBP katkısı hesaplama", description: "Diploma notunun yerleştirme puanını ne kadar etkilediğini görün." },
        ],
    },
    examSchool: {
        title: "Okul giriş rehberinden sonra açılan araçlar",
        description:
            "LGS ve okul geçişi tarafında puan tek başına yeterli değil. LGS puan hesaplama ve okul bandı araçlarını birlikte kullandığınızda daha güvenli tercih çıkar.",
        links: [
            { slug: "lgs-puan-hesaplama", label: "LGS puan hesaplama", description: "Doğru-yanlış dağılımına göre tahmini puanı hızlıca görün." },
            { slug: "lise-taban-puanlari", label: "lise taban puanları karşılaştırması", description: "Puanı doğrudan okul bandı ve tercih güvenliğiyle ilişkilendirin." },
            { slug: "e-okul-not-hesaplama", label: "e-Okul not ortalaması hesabı", description: "Okul başarısını sınav puanından ayrı izleyerek daha dengeli plan yapın." },
        ],
    },
};

export const CATEGORY_SPOTLIGHT_CONFIGS: Partial<Record<string, CategorySpotlightConfig>> = {
    "finansal-hesaplamalar": {
        eyebrow: "Finans Merkezi",
        title: "Bu Kategoride Öne Çıkanlar",
        description:
            "Vadeli mevduat, enflasyon, kredi ve piyasa araçlarını aynı akışta görmek isteyen kullanıcılar genelde önce bu sayfalara gider. Bu bölüm, karar vermeden önce en çok açılan finans araçlarını ve onları destekleyen rehberleri tek yerde toplar.",
        calculatorLinks: [
            { slug: "mevduat-faiz-hesaplama", label: "net mevduat getirisi hesaplama", description: "Stopaj sonrası net kazancı ve vade sonu toplamını görün." },
            { slug: "enflasyon-hesaplama", label: "enflasyona göre değer kaybı hesaplama", description: "Nominal getirinin satın alma gücüne nasıl yansıdığını ölçün." },
            { slug: "doviz-hesaplama", label: "anlık döviz çevirici", description: "USD, EUR ve diğer para birimlerinin TL karşılığını hızlıca hesaplayın." },
            { slug: "kredi-taksit-hesaplama", label: "aylık kredi taksiti hesaplama", description: "Aylık ödeme, toplam faiz ve geri ödeme planını aynı tabloda görün." },
            { slug: "eurobond-hesaplama", label: "eurobond getirisi hesaplama", description: "Kupon, fiyat ve vade etkisini birlikte yorumlayın." },
            { slug: "tasit-kredisi-hesaplama", label: "taşıt kredisi taksit hesabı", description: "Araç finansmanında vade değişiminin maliyete etkisini test edin." },
            { slug: "kredi-karti-gecikme-faizi-hesaplama", label: "kredi kartı gecikme faizi hesaplama", description: "Gecikmenin toplam borcu nasıl büyüttüğünü görün." },
            { slug: "altin-hesaplama", label: "gram altın hesaplama", description: "Altın miktarı ve yatırım tutarını tek ekranda dönüştürün." },
        ],
        guideLinks: [
            { slug: "mevduat-faizi-enflasyon-ve-reel-getiri-rehberi", blurb: "Mevduat, enflasyon ve reel getiri mantığını tek rehberde okuyun." },
            { slug: "kredi-faizi-ve-aylik-taksit-rehberi", blurb: "Aylık kredi taksiti ve toplam geri ödeme farkını netleştirin." },
            { slug: "eurobond-getirisi-nasil-hesaplanir", blurb: "Eurobond kuponu, fiyat etkisi ve döviz tarafını bir arada görün." },
        ],
    },
    "maas-ve-vergi": {
        eyebrow: "Bordro ve Vergi",
        title: "Sık Kullanılan Maaş ve Vergi Araçları",
        description:
            "Bordro, vergi ve kira kararları çoğu zaman birbirini etkiler. Net ücret, KDV, kira artışı ve tazminat başlıklarını birlikte görmek isteyen kullanıcılar için bu bölüm öne çıkan akışı sadeleştirir.",
        calculatorLinks: [
            { slug: "maas-hesaplama", label: "brütten net maaş hesaplama", description: "SGK, gelir vergisi ve damga etkisini tek bordro görünümünde görün." },
            { slug: "kdv-hesaplama", label: "KDV dahil / hariç hesaplama", description: "Matrah, KDV ve toplam fiyat ilişkisini saniyeler içinde görün." },
            { slug: "kira-artis-hesaplama", label: "yeni kira tutarı hesaplama", description: "Güncel TÜFE oranına göre artış tutarını ve yeni kirayı bulun." },
            { slug: "kidem-tazminati-hesaplama", label: "kıdem tazminatı hesaplama", description: "Hizmet süresi, tavan ve damga vergisini birlikte değerlendirin." },
            { slug: "gelir-vergisi-hesaplama", label: "gelir vergisi dilimi hesaplama", description: "Tarifenin net ücret ve yıllık vergi yüküne etkisini görün." },
            { slug: "asgari-ucret-hesaplama", label: "asgari ücret net hesabı", description: "Taban ücret ve bordro karşılığını referans olarak kullanın." },
        ],
        guideLinks: [
            { slug: "brut-net-maas-farki", blurb: "Brüt, net, SGK ve vergi kesintilerini daha anlaşılır bir çerçevede okuyun." },
            { slug: "vergi-hesaplama-rehberi-2026", blurb: "KDV, gelir vergisi ve kira vergisi başlıklarını aynı rehber kümesinde görün." },
            { slug: "kidem-tazminati-hesaplama-rehberi", blurb: "Tavan, formül ve örneklerle kıdem tazminatını karar öncesi netleştirin." },
        ],
    },
    "sinav-hesaplamalari": {
        eyebrow: "Sınav Planı",
        title: "Sınav Döneminde Öne Çıkanlar",
        description:
            "Net, puan, okul katkısı ve tercih planı birbirinden kopuk düşünülmemeli. Üniversite ve okul geçişi tarafında en çok açılan araçları ve onları besleyen rehberleri burada birlikte görebilirsiniz.",
        calculatorLinks: [
            { slug: "yks-puan-hesaplama", label: "YKS puan hesaplama", description: "TYT, AYT, YDT ve OBP etkisini aynı ekranda karşılaştırın." },
            { slug: "lgs-puan-hesaplama", label: "LGS puan hesaplama", description: "Lise geçişi için tahmini puan bandını hızlıca görün." },
            { slug: "tyt-puan-hesaplama", label: "TYT net ve puan hesaplama", description: "Temel net bandınızı YKS planına geçmeden önce ayrı değerlendirin." },
            { slug: "obp-puan-hesaplama", label: "OBP katkısı hesaplama", description: "Diploma notunun yerleştirme puanına etkisini ölçün." },
            { slug: "kpss-puan-hesaplama", label: "KPSS puan hesaplama", description: "Kamu yerleştirmesi için yaklaşık bandı ve net etkisini görün." },
            { slug: "dgs-puan-hesaplama", label: "DGS puan hesaplama", description: "Ön lisans başarısı ile sınav performansını birlikte okuyun." },
        ],
        guideLinks: [
            { slug: "sinav-puanlari-rehberi-2026", blurb: "YKS, TYT, KPSS ve ALES mantığını tek planlama rehberinde görün." },
            { slug: "okul-giris-sinav-rehberi-2026", blurb: "LGS, DGS, YDS ve okul geçişlerini daha geniş bir bakışla okuyun." },
        ],
    },
};

export const GUIDE_LANDING_CONFIGS: GuideLandingConfig[] = [
    {
        id: "investment",
        eyebrow: "Yatırım ve Getiri",
        title: "Mevduat, enflasyon ve yatırım rehberleri",
        description:
            "Parayı sadece nominal olarak değil, reel etkisiyle birlikte okumak için önce rehberi açın; ardından vadeli mevduat getirisi hesaplama, enflasyona göre değer kaybı hesaplama ve eurobond getirisi hesaplama araçlarıyla karşılaştırma yapın.",
        articleLinks: [
            { slug: "mevduat-faizi-enflasyon-ve-reel-getiri-rehberi" },
            { slug: "eurobond-getirisi-nasil-hesaplanir" },
            { slug: "eurobond-vergi-hesaplama-2026" },
        ],
        calculatorLinks: [
            { slug: "mevduat-faiz-hesaplama", label: "vadeli mevduat getirisi hesaplama", description: "Stopaj sonrası net getiriyi ve vade sonu toplamını görün." },
            { slug: "enflasyon-hesaplama", label: "enflasyona göre değer kaybı hesaplama", description: "Nominal kazancın alım gücünü koruyup korumadığını ölçün." },
            { slug: "eurobond-hesaplama", label: "eurobond getirisi hesaplama", description: "Kupon, fiyat ve vade etkisini tek senaryoda değerlendirin." },
            { slug: "altin-hesaplama", label: "altın yatırım hesabı", description: "Gram altın ve toplam tutar dönüşümünü hızlıca görün." },
            { slug: "reel-getiri-hesaplama", label: "reel getiri hesaplama", description: "Enflasyon sonrası gerçek yatırım performansını okuyun." },
            { slug: "bono-hesaplama", label: "bono getirisi hesaplama", description: "Sabit getirili alternatifleri aynı karar akışında kıyaslayın." },
            { slug: "bilesik-buyume-hesaplama", label: "CAGR hesaplama", description: "Uzun vadeli büyümenin yıllık bileşik hızını tek metrikte görün." },
        ],
    },
    {
        id: "credit",
        eyebrow: "Kredi ve Borç",
        title: "Kredi, kart ve taksit rehberleri",
        description:
            "Borç yükünü yalnız aylık ödeme üzerinden değil, toplam maliyet ve alternatif ürünler üzerinden okumak gerekir. Kredi geri ödeme planı hesaplama ile başlayıp ihtiyaç, konut ve taşıt kredisi senaryolarını birlikte karşılaştırın.",
        articleLinks: [
            { slug: "kredi-faizi-ve-aylik-taksit-rehberi" },
            { slug: "kredi-karti-faizi-asgari-odeme-ve-yapilandirma-rehberi" },
        ],
        calculatorLinks: [
            { slug: "kredi-taksit-hesaplama", label: "kredi geri ödeme planı hesaplama", description: "Aylık taksit, toplam faiz ve ödeme planını tek yerde görün." },
            { slug: "ihtiyac-kredisi-hesaplama", label: "ihtiyaç kredisi aylık taksit hesabı", description: "Kısa ve orta vade nakit ihtiyacında gerçek maliyeti ölçün." },
            { slug: "konut-kredisi-hesaplama", label: "konut kredisi taksit hesabı", description: "Peşinat ve uzun dönem geri ödemeyi birlikte değerlendirin." },
            { slug: "tasit-kredisi-hesaplama", label: "taşıt kredisi hesaplama", description: "Araç finansmanında faiz ve vade değişiminin etkisini test edin." },
            { slug: "kredi-karti-gecikme-faizi-hesaplama", label: "kredi kartı gecikme faizi hesaplama", description: "Gecikmenin toplam borcu nasıl büyüttüğünü görün." },
        ],
    },
    {
        id: "salary-tax-rent",
        eyebrow: "Maaş, Vergi ve Kira",
        title: "Maaş, vergi ve kira rehberleri",
        description:
            "Bordro ve vergi kararları çoğu zaman kira ve tazminat hesaplarıyla birlikte anlam kazanır. Net maaş hesaplama, KDV dahil-hariç hesaplama ve yeni kira tutarı hesaplama araçlarını rehber akışıyla birlikte kullanın.",
        articleLinks: [
            { slug: "brut-net-maas-farki" },
            { slug: "vergi-hesaplama-rehberi-2026" },
            { slug: "kira-artis-orani-ve-tufe-rehberi" },
            { slug: "kidem-tazminati-hesaplama-rehberi" },
        ],
        calculatorLinks: [
            { slug: "maas-hesaplama", label: "net maaş hesaplama", description: "Brütten nete ve netten brüte bordro senaryolarını test edin." },
            { slug: "kdv-hesaplama", label: "KDV dahil / hariç hesaplama", description: "Teklif, fatura ve matrah ilişkisini saniyeler içinde görün." },
            { slug: "kira-artis-hesaplama", label: "yeni kira tutarı hesaplama", description: "Güncel TÜFE oranıyla artış tutarını ve yeni bedeli bulun." },
            { slug: "kidem-tazminati-hesaplama", label: "kıdem tazminatı hesaplama", description: "Çalışma süresi, tavan ve damga vergisi etkisini birlikte okuyun." },
        ],
    },
    {
        id: "exam",
        eyebrow: "Sınav ve Planlama",
        title: "Sınav rehberi kümesi",
        description:
            "Üniversite ve okul geçişlerinde puan ekranını rehberden koparmadan okumak daha güvenli olur. YKS puan hesaplama, üniversite sınav puanı hesaplama ve LGS puan hesaplama araçlarını rehber içerikleriyle birlikte kullanın.",
        articleLinks: [
            { slug: "sinav-puanlari-rehberi-2026" },
            { slug: "okul-giris-sinav-rehberi-2026" },
        ],
        calculatorLinks: [
            { slug: "yks-puan-hesaplama", label: "YKS puan hesaplama", description: "TYT, AYT, YDT ve OBP etkisini aynı senaryoda görün." },
            { slug: "tyt-puan-hesaplama", label: "üniversite sınav puanı hesaplama", description: "Temel puan bandınızı YKS öncesi ayrı değerlendirin." },
            { slug: "lgs-puan-hesaplama", label: "LGS puan hesaplama", description: "Lise geçişi için tahmini puan bandını hızlıca görün." },
            { slug: "obp-puan-hesaplama", label: "OBP katkısı hesaplama", description: "Diploma notunun yerleştirme puanına etkisini ölçün." },
        ],
    },
];

export const SUPPLEMENTARY_GUIDE_CALCULATOR_LINKS: EditorialCalculatorLinkConfig[] = [
    { slug: "bono-hesaplama", label: "bono getirisi hesaplama", description: "Sabit getirili alternatifleri yatırım rehberleriyle birlikte değerlendirin." },
    { slug: "bilesik-buyume-hesaplama", label: "CAGR hesaplama", description: "Uzun dönem performansı yıllık bileşik büyüme olarak okuyun." },
    { slug: "iki-tarih-arasindaki-hafta-sayisi-hesaplama", label: "iki tarih arası hafta hesabı", description: "Takvim bazlı planlarda hafta farkını hızlıca görün." },
    { slug: "ay-evresi-hesaplama", label: "ay evresi hesaplama", description: "Takvim ve gökyüzü döngülerini izlemek isteyenler için hızlı yardımcı ekran." },
];

function createFallbackFeaturedCalculatorSection(
    article: Article,
    fallbackSlugs: string[]
): ArticleFeaturedCalculatorSection | null {
    const links = fallbackSlugs
        .map((slug) => {
            const calculator = findCalculatorBySlug(slug);
            if (!calculator) {
                return null;
            }

            return {
                slug: calculator.slug,
                href: `/${calculator.category}/${calculator.slug}`,
                label: calculator.name.tr,
                description: (calculator.shortDescription ?? calculator.description).tr,
                name: calculator.name.tr,
                category: calculator.category,
            } satisfies EditorialCalculatorLink;
        })
        .filter((item): item is EditorialCalculatorLink => item !== null)
        .slice(0, 4);

    if (links.length === 0) {
        return null;
    }

    return {
        title: "Bu rehberle birlikte açılan araçlar",
        description: `${article.title} içindeki hesap başlıklarını doğrudan test etmek için aşağıdaki araçları kullanabilirsiniz.`,
        links,
    };
}

export function getArticleFeaturedCalculatorSection(
    articleSlug: string,
    fallbackSlugs: string[]
): ArticleFeaturedCalculatorSection | null {
    const article = getArticleBySlug(articleSlug);
    if (!article) {
        return null;
    }

    const clusterId = ARTICLE_TO_FEATURED_CLUSTER[articleSlug];
    if (!clusterId) {
        return createFallbackFeaturedCalculatorSection(article, fallbackSlugs);
    }

    const config = FEATURED_CLUSTER_CONFIGS[clusterId];
    const links = resolveEditorialCalculatorLinks(config.links);

    if (links.length === 0) {
        return createFallbackFeaturedCalculatorSection(article, fallbackSlugs);
    }

    return {
        title: config.title,
        description: config.description,
        links,
    };
}
