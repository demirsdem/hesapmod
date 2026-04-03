import { formatPseoAmount } from "./pseo-data";

type ScenarioContext = {
    label: string;
    focusKeyword: string;
    goalKeyword: string;
    budgetKeyword: string;
    monthlyMetric: string;
    totalMetric: string;
};

const DEFAULT_TERM_LABEL = "esnek vade";

const SCENARIO_MAP: Record<string, ScenarioContext> = {
    "ihtiyac-kredisi-hesaplama": {
        label: "İhtiyaç Kredisi",
        focusKeyword: "nakit ihtiyacı",
        goalKeyword: "kişisel finansman planı",
        budgetKeyword: "aylık nakit akışı",
        monthlyMetric: "aylık taksit",
        totalMetric: "toplam faiz yükü",
    },
    "tasit-kredisi-hesaplama": {
        label: "Taşıt Kredisi",
        focusKeyword: "araç alımı",
        goalKeyword: "taşıt finansmanı planı",
        budgetKeyword: "araç bütçesi",
        monthlyMetric: "aylık kredi taksiti",
        totalMetric: "toplam araç finansman maliyeti",
    },
    "konut-kredisi-hesaplama": {
        label: "Konut Kredisi",
        focusKeyword: "ev sahibi olma",
        goalKeyword: "konut finansmanı planı",
        budgetKeyword: "hane bütçesi",
        monthlyMetric: "aylık mortgage taksiti",
        totalMetric: "toplam konut finansman yükü",
    },
    "ticari-arac-kredisi-hesaplama": {
        label: "Ticari Araç Kredisi",
        focusKeyword: "işletme aracı yatırımı",
        goalKeyword: "ticari araç edinim planı",
        budgetKeyword: "işletme nakit akışı",
        monthlyMetric: "aylık ticari kredi taksiti",
        totalMetric: "toplam finansman yükü",
    },
    "maas-hesaplama": {
        label: "Maaş Hesaplama",
        focusKeyword: "gelir planlaması",
        goalKeyword: "bordro görünümü",
        budgetKeyword: "kişisel bütçe dengesi",
        monthlyMetric: "aylık net gelir etkisi",
        totalMetric: "kesinti kompozisyonu",
    },
};

function getScenarioContext(category: string, slug: string) {
    if (SCENARIO_MAP[slug]) {
        return SCENARIO_MAP[slug];
    }

    if (category === "maas-ve-vergi") {
        return SCENARIO_MAP["maas-hesaplama"];
    }

    return {
        label: "Finansal Hesaplama",
        focusKeyword: "finansman planı",
        goalKeyword: "ödeme senaryosu",
        budgetKeyword: "bütçe dengesi",
        monthlyMetric: "aylık sonuç",
        totalMetric: "toplam maliyet",
    };
}

function buildSeed(...parts: Array<string | number | undefined>) {
    const source = parts.map((part) => String(part ?? "")).join("|");
    let hash = 0;

    for (let index = 0; index < source.length; index += 1) {
        hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
    }

    return hash;
}

function pickVariant(seed: number, offset: number, variants: string[]) {
    if (variants.length === 0) {
        return "";
    }

    return variants[(seed + offset) % variants.length];
}

function getTermLabel(term?: number) {
    if (!term) {
        return DEFAULT_TERM_LABEL;
    }

    if (term <= 12) {
        return "kısa vade";
    }

    if (term >= 36) {
        return "uzun vade";
    }

    return "orta vade";
}

function toTitleCase(value: string) {
    if (!value) {
        return value;
    }

    return value.charAt(0).toLocaleUpperCase("tr-TR") + value.slice(1);
}

function getTermStrategySentence(term?: number) {
    if (typeof term !== "number") {
        return "";
    }

    if (term <= 12) {
        return "Kısa vadeli borçlanma stratejisi ile toplam faiz yükünüzü minimize edebilirsiniz.";
    }

    if (term >= 36) {
        return "Uzun vadeli geri ödeme planı sayesinde aylık taksitlerinizi bütçenizi yormayacak seviyede tutabilirsiniz.";
    }

    return "Orta vadeli senaryolarda aylık ödeme ile toplam maliyet arasındaki dengeyi birlikte değerlendirmek gerekir.";
}

function getVehicleRegulationParagraph(slug: string, amount: number) {
    if (slug !== "tasit-kredisi-hesaplama" || amount <= 400000) {
        return "";
    }

    return "BDDK mevzuatına göre fatura/kasko değeri 400.000 TL'yi aşan araçlarda kredi kullanım oranı ve vade sınırları değişmektedir. Bu nedenle kredi planınızı yaparken yalnız faiz oranına değil, peşinat oranı ve erişebileceğiniz azami vadeye de bakmanız gerekir.";
}

function buildOpeningParagraph(
    seed: number,
    scenario: ScenarioContext,
    amount: number,
    term?: number
) {
    const formattedAmount = formatPseoAmount(amount);
    const lead = pickVariant(seed, 0, [
        `${formattedAmount} TL tutarındaki bu senaryo, ${scenario.focusKeyword} odağında arama yapan kullanıcıların en sık karşılaştırdığı kombinasyonlardan biridir.`,
        `${formattedAmount} TL seviyesindeki bu özel kombinasyon, ${scenario.goalKeyword} planlarken hızlı karar vermek isteyen kullanıcılar için güçlü bir referans sunar.`,
        `${formattedAmount} TL tutarlı hesaplama, ${scenario.focusKeyword} için bütçesini önceden görmek isteyenler açısından en pratik başlangıç noktalarından biridir.`,
    ]);

    const followUp = typeof term === "number"
        ? pickVariant(seed, 1, [
            `${term} ay vadede ${scenario.monthlyMetric} ile ${scenario.totalMetric} aynı anda izlenmelidir.`,
            `${term} aylık geri ödeme yapısında yalnız aylık rakama değil, vade uzadıkça oluşan toplam maliyete de dikkat edilmelidir.`,
            `${term} ay seçeneği, ${scenario.budgetKeyword} ile toplam geri ödeme arasındaki dengeyi okumak için net bir karşılaştırma zemini sağlar.`,
        ])
        : pickVariant(seed, 1, [
            `Bu tutar, ${scenario.monthlyMetric} ile ${scenario.totalMetric} arasındaki dengeyi bordro bazında okumayı kolaylaştırır.`,
            `Bu seviyede asıl odak, ${scenario.budgetKeyword} üzerindeki etkiyi ve kesinti dağılımını birlikte görmektir.`,
            `Bu gelir bandında sonuçları yalnız tek rakam olarak değil, kesinti ve net etki bütünlüğü içinde değerlendirmek daha sağlıklıdır.`,
        ]);

    const termStrategy = getTermStrategySentence(term);

    return [lead, followUp, termStrategy].filter(Boolean).join(" ");
}

function buildAnalysisParagraph(
    seed: number,
    scenario: ScenarioContext,
    amount: number,
    term?: number
) {
    const formattedAmount = formatPseoAmount(amount);
    const termLabel = getTermLabel(term);

    return pickVariant(seed, 2, [
        `${formattedAmount} TL düzeyindeki ${scenario.label.toLocaleLowerCase("tr-TR")} hesabında ${termLabel} tercihleri, ${scenario.monthlyMetric} ile toplam yük arasındaki dağılımı belirgin biçimde değiştirir. Bu yüzden tek bir örnek sonuç görmek yerine aynı tutarı farklı senaryolarla yan yana yorumlamak daha doğru olur.`,
        `${toTitleCase(scenario.focusKeyword)} için bu tutarda karar verirken ilk bakılması gereken konu, ${scenario.monthlyMetric} rakamının ${scenario.budgetKeyword} içinde ne kadar alan kapladığıdır. Özellikle ${termLabel} kombinasyonlarda aylık rahatlık ile toplam maliyet aynı yönde hareket etmeyebilir.`,
        `Bu kombinasyon, ${scenario.goalKeyword} kurarken ne kadar borçlanmanın sürdürülebilir olduğunu görmeye yardımcı olur. ${toTitleCase(termLabel)} planlarda küçük faiz farkları bile ${scenario.totalMetric} üzerinde hissedilir sonuçlar üretebilir.`,
    ]);
}

function buildPlanningParagraph(
    seed: number,
    scenario: ScenarioContext,
    amount: number,
    term?: number
) {
    const formattedAmount = formatPseoAmount(amount);

    return pickVariant(seed, 3, [
        `${formattedAmount} TL sonucunu yorumlarken yalnız bugünkü taksite odaklanmak yerine, vade boyunca oluşacak toplam geri ödeme yükünü ve gerekli esneklik payını birlikte düşünmek gerekir. Böylece ${scenario.focusKeyword} kararında daha gerçekçi bir bütçe çerçevesi oluşturabilirsiniz.`,
        `Bu sayfadaki hazır kombinasyon, ${scenario.goalKeyword} için hızlı bir referans üretir; ancak en sağlıklı karar, aylık sonucun beklenmedik giderler karşısında ne kadar güvenli kaldığını da test ettiğinizde ortaya çıkar. Bu yaklaşım ${scenario.budgetKeyword} üzerindeki baskıyı daha net gösterir.`,
        `${formattedAmount} TL seviyesinde görülen hesaplama, yalnız bugünkü tabloyu değil, gelecek aylardaki ödeme disiplinini de planlamaya yardımcı olur. Özellikle ${scenario.focusKeyword} gibi karar alanlarında toplam maliyet, esneklik ve ödeme sürdürülebilirliği birlikte değerlendirilmelidir.`,
    ]);
}

export function generateDynamicPseoDescription(
    category: string,
    slug: string,
    amount: number,
    term?: number
) {
    const scenario = getScenarioContext(category, slug);
    const seed = buildSeed(category, slug, amount, term);
    const formattedAmount = formatPseoAmount(amount);
    const termFragment = typeof term === "number" ? ` ${term} ay` : "";
    const lead = pickVariant(seed, 4, [
        `${formattedAmount} TL${termFragment} ${scenario.label.toLocaleLowerCase("tr-TR")} senaryosunda ${scenario.monthlyMetric} ve toplam maliyeti hızlıca görün.`,
        `${formattedAmount} TL${termFragment} kombinasyonunda ${scenario.focusKeyword} için ödeme planını ve bütçe etkisini karşılaştırın.`,
        `${formattedAmount} TL${termFragment} hesabında ${scenario.totalMetric} ile aylık sonucu aynı ekranda inceleyin.`,
    ]);

    const termSentence = getTermStrategySentence(term);
    const regulationSentence = slug === "tasit-kredisi-hesaplama" && amount > 400000
        ? "400.000 TL üzeri araçlarda BDDK kredi oranı ve vade sınırlarını da dikkate alın."
        : "";

    return [lead, termSentence, regulationSentence].filter(Boolean).join(" ");
}

export function generateDynamicPseoContent(
    category: string,
    slug: string,
    amount: number,
    term?: number
) {
    const scenario = getScenarioContext(category, slug);
    const seed = buildSeed(category, slug, amount, term);
    const formattedAmount = formatPseoAmount(amount);
    const scenarioHeading = typeof term === "number"
        ? `${formattedAmount} TL ${term} Ay ${scenario.label} Senaryosu Nasıl Okunmalı?`
        : `${formattedAmount} TL Seviyesinde ${scenario.label} Sonucu Nasıl Yorumlanır?`;
    const analysisHeading = typeof term === "number"
        ? `${toTitleCase(scenario.focusKeyword)} İçin Vade ve Maliyet Dengesi`
        : `${toTitleCase(scenario.focusKeyword)} İçin Bordro ve Bütçe Dengesi`;
    const planningHeading = typeof term === "number"
        ? `Bu Kombinasyonda Karar Verirken Nelere Bakılmalı?`
        : `Bu Gelir Seviyesinde Hangi Göstergeler Önemli?`;

    const paragraphs = [
        `## ${scenarioHeading}`,
        buildOpeningParagraph(seed, scenario, amount, term),
        "",
        `### ${analysisHeading}`,
        buildAnalysisParagraph(seed, scenario, amount, term),
        "",
        getVehicleRegulationParagraph(slug, amount),
        "",
        `### ${planningHeading}`,
        buildPlanningParagraph(seed, scenario, amount, term),
    ].filter((block) => block.trim().length > 0);

    return paragraphs.join("\n\n");
}
