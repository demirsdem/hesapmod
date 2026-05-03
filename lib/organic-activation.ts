export type OrganicActivationRoute = {
    category: string;
    slug: string;
};

export type OrganicActivationGroup = {
    key: string;
    label: string;
    sourceStage: "Stage 2" | "Stage 3" | "Stage 4" | "Stage 5";
    priorityBatch: "Batch 1" | "Batch 2" | "Batch 3" | "Batch 4";
    routes: OrganicActivationRoute[];
};

export const newCalculatorActivationGroups: OrganicActivationGroup[] = [
    {
        key: "finance",
        label: "Finans",
        sourceStage: "Stage 2",
        priorityBatch: "Batch 1",
        routes: [
            { category: "finansal-hesaplamalar", slug: "portfoy-dagilimi-hesaplama" },
            { category: "finansal-hesaplamalar", slug: "etf-getiri-hesaplama" },
            { category: "finansal-hesaplamalar", slug: "kripto-kar-zarar-hesaplama" },
            { category: "finansal-hesaplamalar", slug: "finansal-ozgurluk-hesaplama" },
            { category: "finansal-hesaplamalar", slug: "pasif-gelir-hesaplama" },
        ],
    },
    {
        key: "salary-tax",
        label: "Maaş/Vergi",
        sourceStage: "Stage 2",
        priorityBatch: "Batch 1",
        routes: [
            { category: "maas-ve-vergi", slug: "saatlik-ucret-hesaplama" },
            { category: "maas-ve-vergi", slug: "gunluk-ucret-hesaplama" },
            { category: "maas-ve-vergi", slug: "fazla-mesai-hesaplama" },
            { category: "maas-ve-vergi", slug: "emeklilik-maasi-tahmini-hesaplama" },
        ],
    },
    {
        key: "math",
        label: "Matematik",
        sourceStage: "Stage 3",
        priorityBatch: "Batch 2",
        routes: [
            { category: "matematik-hesaplama", slug: "standart-sapma" },
            { category: "matematik-hesaplama", slug: "varyans-hesaplama" },
            { category: "matematik-hesaplama", slug: "oran-hesaplama" },
            { category: "matematik-hesaplama", slug: "oranti-hesaplama" },
            { category: "matematik-hesaplama", slug: "logaritma-hesaplama" },
            { category: "matematik-hesaplama", slug: "hacim-hesaplama" },
            { category: "matematik-hesaplama", slug: "silindir-hacmi" },
            { category: "matematik-hesaplama", slug: "kure-hacmi" },
            { category: "matematik-hesaplama", slug: "piramit-hacmi" },
            { category: "matematik-hesaplama", slug: "trigonometri-hesaplama" },
            { category: "matematik-hesaplama", slug: "sin-cos-tan-hesaplama" },
            { category: "matematik-hesaplama", slug: "polinom-hesaplama" },
            { category: "matematik-hesaplama", slug: "denklem-cozucu" },
            { category: "matematik-hesaplama", slug: "ikinci-derece-denklem" },
            { category: "matematik-hesaplama", slug: "matris-hesaplama" },
            { category: "matematik-hesaplama", slug: "determinant-hesaplama" },
            { category: "matematik-hesaplama", slug: "rasyonel-sayi-hesaplama" },
            { category: "matematik-hesaplama", slug: "kesir-hesaplama" },
            { category: "matematik-hesaplama", slug: "kesir-sadelestirme" },
            { category: "matematik-hesaplama", slug: "kesir-toplama-cikarma" },
            { category: "matematik-hesaplama", slug: "sayi-tabani-donusturme" },
        ],
    },
    {
        key: "education",
        label: "Eğitim/Sınav",
        sourceStage: "Stage 3",
        priorityBatch: "Batch 2",
        routes: [
            { category: "sinav-hesaplamalari", slug: "yks-siralama-tahmini" },
            { category: "sinav-hesaplamalari", slug: "egitim-suresi-hesaplama" },
            { category: "sinav-hesaplamalari", slug: "ders-calisma-plani" },
            { category: "sinav-hesaplamalari", slug: "test-basari-orani" },
            { category: "sinav-hesaplamalari", slug: "ders-calisma-saati" },
            { category: "sinav-hesaplamalari", slug: "ogrenci-butce-hesaplama" },
            { category: "sinav-hesaplamalari", slug: "burs-hesaplama" },
            { category: "sinav-hesaplamalari", slug: "egitim-kredisi" },
            { category: "sinav-hesaplamalari", slug: "yurt-maliyeti" },
            { category: "sinav-hesaplamalari", slug: "okul-gider-hesaplama" },
            { category: "sinav-hesaplamalari", slug: "kitap-maliyeti" },
            { category: "sinav-hesaplamalari", slug: "ogrenci-yasam-maliyeti" },
        ],
    },
    {
        key: "health",
        label: "Sağlık",
        sourceStage: "Stage 4",
        priorityBatch: "Batch 3",
        routes: [
            { category: "yasam-hesaplama", slug: "kalori-yakma-hesaplama" },
            { category: "yasam-hesaplama", slug: "adim-kalori-hesaplama" },
            { category: "yasam-hesaplama", slug: "nabiz-araligi-hesaplama" },
            { category: "yasam-hesaplama", slug: "cocuk-bmi-hesaplama" },
            { category: "yasam-hesaplama", slug: "alkol-promil-hesaplama" },
            { category: "yasam-hesaplama", slug: "uyku-suresi-hesaplama" },
            { category: "yasam-hesaplama", slug: "metabolizma-yasi-hesaplama" },
        ],
    },
    {
        key: "daily-life",
        label: "Günlük Yaşam",
        sourceStage: "Stage 4",
        priorityBatch: "Batch 3",
        routes: [
            { category: "yasam-hesaplama", slug: "gunluk-harcama-hesaplama" },
            { category: "yasam-hesaplama", slug: "aylik-butce-hesaplama" },
            { category: "yasam-hesaplama", slug: "elektrik-tuketim-hesaplama" },
            { category: "yasam-hesaplama", slug: "su-faturasi-hesaplama" },
            { category: "yasam-hesaplama", slug: "dogalgaz-tuketimi-hesaplama" },
            { category: "yasam-hesaplama", slug: "tatil-butcesi-hesaplama" },
            { category: "yasam-hesaplama", slug: "ev-gider-hesaplama" },
            { category: "yasam-hesaplama", slug: "bahsis-hesaplama" },
            { category: "yasam-hesaplama", slug: "split-hesaplama" },
        ],
    },
    {
        key: "sport-fitness",
        label: "Spor/Fitness",
        sourceStage: "Stage 4",
        priorityBatch: "Batch 3",
        routes: [
            { category: "yasam-hesaplama", slug: "kosu-pace-hesaplama" },
            { category: "yasam-hesaplama", slug: "maraton-tempo-hesaplama" },
            { category: "yasam-hesaplama", slug: "adim-mesafe-hesaplama" },
            { category: "yasam-hesaplama", slug: "vo2-max-hesaplama" },
            { category: "yasam-hesaplama", slug: "yag-yakim-bolgesi-hesaplama" },
            { category: "yasam-hesaplama", slug: "kas-kutlesi-hesaplama" },
            { category: "yasam-hesaplama", slug: "bench-press-max" },
            { category: "yasam-hesaplama", slug: "squat-max" },
            { category: "yasam-hesaplama", slug: "deadlift-max" },
            { category: "yasam-hesaplama", slug: "spor-hedef-hesaplama" },
            { category: "yasam-hesaplama", slug: "antrenman-hacmi" },
            { category: "yasam-hesaplama", slug: "set-tekrar-hesaplama" },
            { category: "yasam-hesaplama", slug: "dinlenme-suresi" },
            { category: "yasam-hesaplama", slug: "kardiyo-suresi" },
        ],
    },
    {
        key: "construction-engineering",
        label: "İnşaat/Mühendislik",
        sourceStage: "Stage 5",
        priorityBatch: "Batch 4",
        routes: [
            { category: "insaat-muhendislik", slug: "beton-hesaplama" },
            { category: "insaat-muhendislik", slug: "cimento-hesaplama" },
            { category: "insaat-muhendislik", slug: "tugla-hesaplama" },
            { category: "insaat-muhendislik", slug: "boya-hesaplama" },
            { category: "insaat-muhendislik", slug: "seramik-hesaplama" },
            { category: "insaat-muhendislik", slug: "parke-hesaplama" },
            { category: "insaat-muhendislik", slug: "demir-hesaplama" },
            { category: "insaat-muhendislik", slug: "cati-alan-hesaplama" },
            { category: "insaat-muhendislik", slug: "merdiven-hesaplama" },
            { category: "insaat-muhendislik", slug: "metrekup-hesaplama" },
            { category: "insaat-muhendislik", slug: "hafriyat-hesaplama" },
            { category: "insaat-muhendislik", slug: "kum-hesaplama" },
            { category: "insaat-muhendislik", slug: "alci-hesaplama" },
            { category: "insaat-muhendislik", slug: "siva-hesaplama" },
            { category: "insaat-muhendislik", slug: "elektrik-kablo-hesaplama" },
            { category: "insaat-muhendislik", slug: "su-tesisat-hesaplama" },
            { category: "insaat-muhendislik", slug: "isi-kaybi-hesaplama" },
            { category: "insaat-muhendislik", slug: "gunes-paneli-hesaplama" },
            { category: "insaat-muhendislik", slug: "jenerator-guc-hesaplama" },
            { category: "insaat-muhendislik", slug: "enerji-tuketim-hesaplama" },
        ],
    },
];

export const newCalculatorActivationRoutes = newCalculatorActivationGroups.flatMap((group) =>
    group.routes.map((route) => ({
        ...route,
        clusterKey: group.key,
        clusterLabel: group.label,
        sourceStage: group.sourceStage,
        priorityBatch: group.priorityBatch,
    }))
);

export function getActivationRouteKey(route: OrganicActivationRoute) {
    return `${route.category}/${route.slug}`;
}

export const newCalculatorActivationRouteKeys = new Set(
    newCalculatorActivationRoutes.map(getActivationRouteKey)
);
