import type { CalculatorConfig } from "./calculator-types";

export const customCalculators: CalculatorConfig[] = [
    {
        id: "arac-deger-hesaplama",
        slug: "arac-deger-hesaplama",
        category: "tasit-ve-vergi",
        updatedAt: "2026-04-26",
        name: { tr: "Araç Değer Hesaplama", en: "Vehicle Value Calculator" },
        h1: { tr: "Araç Değer Hesaplama", en: "Vehicle Value Calculator" },
        description: {
            tr: "İkinci el aracın marka, model, yıl, kilometre, donanım, bölge, servis geçmişi, hasar ve emsal ilan bilgilerine göre tahmini piyasa değerini hesaplayın.",
            en: "Estimate a used vehicle's market value from make, model, year, mileage, trim, region, service history, damage status, and comparable listing data.",
        },
        shortDescription: {
            tr: "İkinci el araç için piyasa değeri, yıllık maliyet ve kredi taksitini emsal ilanlarla birlikte görün.",
            en: "See estimated used-car value, annual ownership cost, and loan installment with comparable listing support.",
        },
        relatedCalculators: [
            "mtv-hesaplama",
            "otv-hesaplama",
            "yakit-tuketim-maliyet",
            "tasit-kredisi-hesaplama",
        ],
        inputs: [],
        results: [],
        formula: () => ({}),
        seo: {
            title: {
                tr: "Araç Değer Hesaplama | İkinci El Araba Piyasa Değeri",
                en: "Vehicle Value Calculator | Used Car Market Value",
            },
            metaDescription: {
                tr: "Araç değer hesaplama aracıyla ikinci el otomobilinizin tahmini piyasa değerini, güncel emsal ilanları, donanım ve bölge etkisini, değer kaybını ve yıllık sahip olma maliyetini hesaplayın.",
                en: "Estimate used-car market value, comparable listing prices, depreciation, and annual ownership cost.",
            },
            content: {
                tr: "Araç değer hesaplama aracı, ikinci el otomobilin bugünkü piyasa değerini marka, model, yıl, kilometre, donanım paketi, il/ilçe, servis geçmişi, yakıt tipi, vites, hasar kaydı ve emsal ilan fiyatlarıyla birlikte yorumlar. Sonuç kesin ekspertiz veya satış fiyatı değildir; satın alma, satışa çıkarma ve pazarlık öncesinde pratik bir ön değerleme sağlar.",
                en: "The vehicle value calculator estimates used-car market value using vehicle details, trim, region, service history, and comparable listing prices. It is a practical preview, not a formal appraisal or guaranteed sale price.",
            },
            faq: [
                {
                    q: { tr: "İkinci el araç değeri nasıl hesaplanır?", en: "How is used-car value estimated?" },
                    a: { tr: "Marka, model, yıl, kilometre, donanım, bölge, servis geçmişi, yakıt tipi, vites, hasar durumu ve emsal ilan fiyatları birlikte değerlendirilir.", en: "Make, model, year, mileage, trim, region, service history, fuel type, transmission, damage status, and comparable prices are considered together." },
                },
                {
                    q: { tr: "Araç değer hesaplama sonucu kesin satış fiyatı mıdır?", en: "Is the result a guaranteed sale price?" },
                    a: { tr: "Hayır. Sonuç tahmini ve bilgilendirme amaçlıdır; gerçek fiyat ekspertiz, donanım, il piyasası ve pazarlık koşullarına göre değişebilir.", en: "No. It is an estimate for information only; real prices can vary with appraisal, trim, local market, and negotiation." },
                },
            ],
        },
    },
];
