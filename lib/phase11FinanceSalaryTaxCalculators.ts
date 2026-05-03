import type { CalculatorConfig } from "./calculator-source";

function faqEntry(trQuestion: string, trAnswer: string, enQuestion: string, enAnswer: string) {
    return {
        q: { tr: trQuestion, en: enQuestion },
        a: { tr: trAnswer, en: enAnswer },
    };
}

export const phase11FinanceSalaryTaxCalculators: CalculatorConfig[] = [
    {
        id: "portfolio-allocation",
        slug: "portfoy-dagilimi-hesaplama",
        category: "finansal-hesaplamalar",
        updatedAt: "2026-05-01",
        name: { tr: "Portföy Dağılımı Hesaplama", en: "Portfolio Allocation Calculator" },
        h1: { tr: "Portföy Dağılımı Hesaplama - Varlık Ağırlığı ve Yoğunlaşma", en: "Portfolio Allocation Calculator - Asset Weights and Concentration" },
        description: { tr: "Nakit, mevduat, hisse, fon, altın, döviz, kripto ve diğer varlıkları girerek portföy ağırlıklarını ve yoğunlaşma riskini hesaplayın.", en: "Enter cash, deposits, equities, funds, gold, FX, crypto, and other assets to calculate allocation weights and concentration risk." },
        shortDescription: { tr: "Portföyünüzün hangi varlık sınıflarında yoğunlaştığını ve ağırlık dağılımını görün.", en: "See asset-class weights and concentration in your portfolio." },
        relatedCalculators: ["bilesik-faiz-hesaplama", "reel-getiri-hesaplama", "birikim-hesaplama", "sermaye-ve-temettu-hesaplama", "etf-getiri-hesaplama"],
        inputs: [
            { id: "cash", name: { tr: "Nakit", en: "Cash" }, type: "number", defaultValue: 25000, suffix: " ₺", min: 0 },
            { id: "deposit", name: { tr: "Mevduat / Para Piyasası", en: "Deposit / Money Market" }, type: "number", defaultValue: 75000, suffix: " ₺", min: 0 },
            { id: "stocks", name: { tr: "Hisse Senedi", en: "Stocks" }, type: "number", defaultValue: 120000, suffix: " ₺", min: 0 },
            { id: "funds", name: { tr: "Fon / ETF", en: "Funds / ETF" }, type: "number", defaultValue: 90000, suffix: " ₺", min: 0 },
            { id: "gold", name: { tr: "Altın", en: "Gold" }, type: "number", defaultValue: 60000, suffix: " ₺", min: 0 },
            { id: "fx", name: { tr: "Döviz", en: "FX" }, type: "number", defaultValue: 45000, suffix: " ₺", min: 0 },
            { id: "crypto", name: { tr: "Kripto", en: "Crypto" }, type: "number", defaultValue: 15000, suffix: " ₺", min: 0 },
            { id: "other", name: { tr: "Diğer Varlıklar", en: "Other Assets" }, type: "number", defaultValue: 10000, suffix: " ₺", min: 0 },
        ],
        results: [
            { id: "totalPortfolio", label: { tr: "Toplam Portföy", en: "Total Portfolio" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "portfolioChart", label: { tr: "Portföy Dağılımı", en: "Portfolio Allocation" }, type: "pieChart" },
            { id: "largestShare", label: { tr: "En Büyük Ağırlık", en: "Largest Weight" }, suffix: " %", decimalPlaces: 2 },
            { id: "riskNote", label: { tr: "Yoğunlaşma Yorumu", en: "Concentration Note" }, type: "text" },
        ],
        formula: (v) => {
            const assets = [
                { key: "cash", label: { tr: "Nakit", en: "Cash" }, colorClass: "bg-slate-500", colorHex: "#64748b" },
                { key: "deposit", label: { tr: "Mevduat", en: "Deposit" }, colorClass: "bg-emerald-500", colorHex: "#10b981" },
                { key: "stocks", label: { tr: "Hisse", en: "Stocks" }, colorClass: "bg-blue-500", colorHex: "#3b82f6" },
                { key: "funds", label: { tr: "Fon/ETF", en: "Funds/ETF" }, colorClass: "bg-violet-500", colorHex: "#8b5cf6" },
                { key: "gold", label: { tr: "Altın", en: "Gold" }, colorClass: "bg-amber-500", colorHex: "#f59e0b" },
                { key: "fx", label: { tr: "Döviz", en: "FX" }, colorClass: "bg-cyan-500", colorHex: "#06b6d4" },
                { key: "crypto", label: { tr: "Kripto", en: "Crypto" }, colorClass: "bg-orange-500", colorHex: "#f97316" },
                { key: "other", label: { tr: "Diğer", en: "Other" }, colorClass: "bg-rose-500", colorHex: "#f43f5e" },
            ].map((asset) => ({
                ...asset,
                value: Math.max(0, parseFloat(v[asset.key]) || 0),
            }));
            const totalPortfolio = assets.reduce((sum, asset) => sum + asset.value, 0);
            const largestShare = totalPortfolio > 0
                ? Math.max(...assets.map((asset) => asset.value / totalPortfolio)) * 100
                : 0;
            const riskyAssets = ["stocks", "funds", "crypto"].reduce((sum, key) => {
                const asset = assets.find((item) => item.key === key);
                return sum + (asset?.value ?? 0);
            }, 0);
            const riskyShare = totalPortfolio > 0 ? (riskyAssets / totalPortfolio) * 100 : 0;
            const riskNote = totalPortfolio === 0
                ? { tr: "Portföy tutarı girildiğinde dağılım yorumu oluşur.", en: "Allocation commentary appears after portfolio amounts are entered." }
                : largestShare >= 60
                    ? { tr: "Tek varlık sınıfında yüksek yoğunlaşma var; getiri ve risk aynı kaynağa bağlı hale gelebilir.", en: "There is high concentration in one asset class; return and risk may depend on a single source." }
                    : riskyShare >= 70
                        ? { tr: "Büyüme odaklı portföy görünümü var; dalgalanma toleransı ayrıca değerlendirilmelidir.", en: "The portfolio looks growth-oriented; volatility tolerance should be reviewed separately." }
                        : { tr: "Dağılım daha dengeli görünüyor; yine de hedef vade ve risk profilinizle birlikte yorumlanmalıdır.", en: "The allocation looks more balanced, but it should still be interpreted with your horizon and risk profile." };

            return {
                totalPortfolio,
                portfolioChart: {
                    segments: assets.filter((asset) => asset.value > 0).map((asset) => ({
                        label: asset.label,
                        value: asset.value,
                        colorClass: asset.colorClass,
                        colorHex: asset.colorHex,
                    })),
                },
                largestShare,
                riskNote,
            };
        },
        seo: {
            title: { tr: "Portföy Dağılımı Hesaplama 2026 - Varlık Ağırlığı ve Risk Yoğunluğu", en: "Portfolio Allocation Calculator 2026 - Asset Weights and Concentration" },
            metaDescription: { tr: "Portföy dağılımı hesaplama aracıyla nakit, mevduat, hisse, fon, altın, döviz ve kripto ağırlıklarını görün; yoğunlaşma riskini yorumlayın.", en: "Calculate portfolio weights across cash, deposits, stocks, funds, gold, FX, and crypto, and review concentration risk." },
            content: { tr: "Portföy dağılımı hesaplama, yatırım varlıklarınızın toplam içindeki payını gösterir. Bu sayede yalnız toplam bakiyeyi değil, riskin hangi varlık sınıflarında yoğunlaştığını da görebilirsiniz. Örnek hesaplama: 100.000 TL hisse, 50.000 TL altın ve 50.000 TL mevduat bulunan bir portföyde toplam 200.000 TL vardır; hisse ağırlığı %50, altın %25, mevduat %25 olur. Formül basittir: Varlık Ağırlığı = Varlık Tutarı / Toplam Portföy x 100. Sonucu yorumlarken tek varlıkta aşırı yoğunlaşma, döviz ve altın gibi koruma amaçlı kalemler, hisse ve kripto gibi dalgalı kalemler ayrı düşünülmelidir. Bu araç yatırım tavsiyesi vermez; hedef vade, risk toleransı ve likidite ihtiyacı ayrıca değerlendirilmelidir.", en: "Portfolio allocation calculation shows each asset class as a share of the total portfolio. Example: with 100,000 TRY in stocks, 50,000 TRY in gold, and 50,000 TRY in deposits, the total is 200,000 TRY; stocks weigh 50%, gold 25%, and deposits 25%. Formula: Asset Weight = Asset Amount / Total Portfolio x 100. The result is informational, not investment advice." },
            faq: [
                faqEntry("Portföy dağılımı neden önemlidir?", "Çünkü toplam bakiyenin hangi varlıklarda toplandığını gösterir. Tek bir varlık sınıfına aşırı yüklenmek beklenmedik dalgalanmalarda portföyü daha kırılgan hale getirebilir.", "Why is portfolio allocation important?", "It shows where the total balance is concentrated. Overweighting one asset class can make the portfolio more fragile during volatility."),
                faqEntry("En ideal portföy dağılımı nedir?", "Tek bir ideal dağılım yoktur. Vade, gelir düzeni, risk toleransı, para birimi ihtiyacı ve yatırım amacı dağılımı değiştirir.", "What is the ideal allocation?", "There is no single ideal allocation. Time horizon, income stability, risk tolerance, currency needs, and investment goals all change the mix."),
                faqEntry("Altın ve döviz koruma amaçlı mı değerlendirilir?", "Genellikle kur ve enflasyon riskine karşı dengeleyici görülebilir; ancak fiyatları da dalgalanır. Bu yüzden sonuç garanti koruma anlamına gelmez.", "Are gold and FX defensive assets?", "They may act as a hedge against currency and inflation risk, but their prices also fluctuate. The result does not guarantee protection."),
                faqEntry("Portföy ağırlığı nasıl hesaplanır?", "Her varlık tutarı toplam portföye bölünür ve 100 ile çarpılır. Örneğin 40.000 TL altın ve 200.000 TL toplam portföy varsa altın ağırlığı %20 olur.", "How is allocation weight calculated?", "Each asset amount is divided by the total portfolio and multiplied by 100. For example, 40,000 in gold within a 200,000 total portfolio equals 20%."),
                faqEntry("Bu araç yatırım önerisi verir mi?", "Hayır. Araç sadece mevcut dağılımı ve yoğunlaşmayı gösterir; alım, satım veya varlık tavsiyesi üretmez.", "Does this tool provide investment advice?", "No. It only shows allocation and concentration; it does not recommend buying, selling, or holding assets."),
            ],
            richContent: {
                howItWorks: { tr: "Her varlık kalemini toplam portföye böler ve pasta grafikte ağırlık olarak gösterir.", en: "It divides each asset by the total portfolio and displays the weight in a pie chart." },
                formulaText: { tr: "Varlık Ağırlığı (%) = Varlık Tutarı / Toplam Portföy x 100", en: "Asset Weight (%) = Asset Amount / Total Portfolio x 100" },
                exampleCalculation: { tr: "100.000 TL hisse, 50.000 TL altın ve 50.000 TL mevduatta toplam portföy 200.000 TL, hisse ağırlığı %50 olur.", en: "With 100,000 in stocks, 50,000 in gold, and 50,000 in deposits, the total is 200,000 and stocks weigh 50%." },
                miniGuide: { tr: "Sonucu reel getiri, birikim ve temettü araçlarıyla birlikte okuyarak dağılımın hedefinize uyup uymadığını kontrol edin.", en: "Read the result together with real-return, savings, and dividend tools to check alignment with your goal." },
            },
        },
    },
    {
        id: "etf-return",
        slug: "etf-getiri-hesaplama",
        category: "finansal-hesaplamalar",
        updatedAt: "2026-05-01",
        name: { tr: "ETF Getiri Hesaplama", en: "ETF Return Calculator" },
        h1: { tr: "ETF Getiri Hesaplama - Temettü, Masraf ve Kur Etkisi", en: "ETF Return Calculator - Dividend, Fees and FX Effect" },
        description: { tr: "ETF veya fon yatırımlarında alış değeri, güncel değer, temettü, masraf ve kur etkisiyle brüt/net getiri oranını hesaplayın.", en: "Calculate gross and net returns for ETFs or funds using purchase value, current value, dividends, fees, and FX effect." },
        shortDescription: { tr: "ETF yatırımınızın toplam getirisini temettü ve masraflarla birlikte görün.", en: "See ETF total return including dividends and fees." },
        relatedCalculators: ["portfoy-dagilimi-hesaplama", "bilesik-buyume-hesaplama", "reel-getiri-hesaplama", "doviz-hesaplama", "sermaye-ve-temettu-hesaplama"],
        inputs: [
            { id: "initialInvestment", name: { tr: "Alış / İlk Yatırım Tutarı", en: "Initial Investment" }, type: "number", defaultValue: 100000, suffix: " ₺", min: 0, required: true },
            { id: "currentValue", name: { tr: "Güncel / Satış Değeri", en: "Current / Sale Value" }, type: "number", defaultValue: 128000, suffix: " ₺", min: 0, required: true },
            { id: "dividends", name: { tr: "Alınan Temettü / Dağıtım", en: "Dividends / Distributions" }, type: "number", defaultValue: 6000, suffix: " ₺", min: 0 },
            { id: "fees", name: { tr: "Komisyon ve Fon Masrafı", en: "Fees and Fund Costs" }, type: "number", defaultValue: 1500, suffix: " ₺", min: 0 },
            { id: "taxRate", name: { tr: "Vergi / Stopaj Varsayımı", en: "Tax / Withholding Assumption" }, type: "number", defaultValue: 0, suffix: " %", min: 0, max: 100, step: 0.1 },
            { id: "holdingYears", name: { tr: "Elde Tutma Süresi", en: "Holding Period" }, type: "number", defaultValue: 2, suffix: " yıl", min: 0.01, step: 0.1 },
        ],
        results: [
            { id: "grossProfit", label: { tr: "Brüt Kar / Zarar", en: "Gross Profit / Loss" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netProfit", label: { tr: "Net Kar / Zarar", en: "Net Profit / Loss" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netReturnRate", label: { tr: "Net Getiri Oranı", en: "Net Return Rate" }, suffix: " %", decimalPlaces: 2 },
            { id: "annualizedReturn", label: { tr: "Yıllık Bileşik Getiri", en: "Annualized Return" }, suffix: " %", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const initialInvestment = Math.max(0, parseFloat(v.initialInvestment) || 0);
            const currentValue = Math.max(0, parseFloat(v.currentValue) || 0);
            const dividends = Math.max(0, parseFloat(v.dividends) || 0);
            const fees = Math.max(0, parseFloat(v.fees) || 0);
            const taxRate = Math.min(100, Math.max(0, parseFloat(v.taxRate) || 0)) / 100;
            const holdingYears = Math.max(0.01, parseFloat(v.holdingYears) || 1);
            const grossProfit = currentValue + dividends - initialInvestment;
            const taxableGain = Math.max(0, grossProfit - fees);
            const tax = taxableGain * taxRate;
            const netProfit = grossProfit - fees - tax;
            const endingValue = initialInvestment + netProfit;
            const netReturnRate = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0;
            const annualizedReturn = initialInvestment > 0 && endingValue > 0
                ? (Math.pow(endingValue / initialInvestment, 1 / holdingYears) - 1) * 100
                : 0;
            return { grossProfit, netProfit, netReturnRate, annualizedReturn };
        },
        seo: {
            title: { tr: "ETF Getiri Hesaplama 2026 - Temettü, Masraf ve Net Getiri", en: "ETF Return Calculator 2026 - Dividend, Fees and Net Return" },
            metaDescription: { tr: "ETF getiri hesaplama aracıyla alış değeri, güncel değer, temettü, masraf ve vergi varsayımını girerek net getiri ve yıllık bileşik getiriyi görün.", en: "Calculate ETF net return and annualized return using initial value, current value, dividends, fees, and tax assumptions." },
            content: { tr: "ETF getiri hesabı yalnız fiyat değişimine bakmamalıdır. Temettü veya fon dağıtımı, alım-satım komisyonu, yönetim gideri, vergi/stopaj varsayımı ve döviz etkisi sonucu değiştirebilir. Formül: Brüt Kar = Güncel Değer + Dağıtımlar - İlk Yatırım. Net Kar = Brüt Kar - Masraflar - Vergi Varsayımı. Örnek hesaplama: 100.000 TL alış, 128.000 TL güncel değer, 6.000 TL dağıtım ve 1.500 TL masraf varsa vergi varsayımı sıfır iken net kar 32.500 TL, net getiri %32,5 olur. Sonucu yorumlarken ETF'nin para birimi, fon gider oranı ve takip ettiği endeks ayrıca incelenmelidir.", en: "ETF return should not be read from price change only. Dividends, distributions, trading fees, fund costs, tax assumptions, and FX effect can change the result. Formula: Gross Profit = Current Value + Distributions - Initial Investment. Net Profit = Gross Profit - Fees - Tax Assumption." },
            faq: [
                faqEntry("ETF getirisinde temettü dahil edilmeli mi?", "Evet. Dağıtım yapan ETF'lerde toplam getiri fiyat artışıyla birlikte temettü veya dağıtım gelirini de içerir.", "Should dividends be included in ETF return?", "Yes. For distributing ETFs, total return includes both price appreciation and dividends or distributions."),
                faqEntry("Vergi oranını neden kullanıcı giriyor?", "ETF'nin türü, ülke, yatırımcı statüsü ve dönemsel mevzuat sonucu değiştirebilir. Doğrulanmamış tek bir oran sabitlemek yerine oran kullanıcı varsayımı olarak bırakılır.", "Why is the tax rate user-entered?", "Tax depends on fund type, country, investor status, and changing rules. The calculator keeps it as a user assumption instead of hardcoding one rate."),
                faqEntry("ETF getiri oranı nasıl hesaplanır?", "Net kar ilk yatırım tutarına bölünür ve 100 ile çarpılır. Yıllık bileşik getiri ise elde tutma süresine göre yıllıklaştırılır.", "How is ETF return calculated?", "Net profit is divided by initial investment and multiplied by 100. Annualized return adjusts it by the holding period."),
                faqEntry("Kur etkisi bu araçta nasıl dikkate alınır?", "Tutarları TL karşılığı olarak girerseniz kur etkisi güncel değerin içinde yer alır. Döviz bazlı analiz için alış ve satış kurunu ayrıca dönüştürmek gerekir.", "How is FX effect handled?", "If you enter TRY equivalents, FX effect is embedded in the current value. For currency-based analysis, convert buy and sell values separately."),
                faqEntry("ETF getiri sonucu yatırım tavsiyesi midir?", "Hayır. Araç geçmiş veya varsayımsal performansı hesaplar; hangi ETF'nin alınacağına dair öneri vermez.", "Is the ETF return result investment advice?", "No. It calculates historical or assumed performance; it does not recommend which ETF to buy."),
            ],
            richContent: {
                howItWorks: { tr: "İlk yatırım, güncel değer, dağıtım, masraf ve vergi varsayımını birleştirerek net kar ve yıllık bileşik getiri üretir.", en: "It combines initial value, current value, distributions, fees, and tax assumptions to produce net profit and annualized return." },
                formulaText: { tr: "Net Kar = Güncel Değer + Dağıtımlar - İlk Yatırım - Masraflar - Vergi", en: "Net Profit = Current Value + Distributions - Initial Investment - Fees - Tax" },
                exampleCalculation: { tr: "100.000 TL alış, 128.000 TL değer, 6.000 TL dağıtım ve 1.500 TL masrafla net kar 32.500 TL olur.", en: "With 100,000 initial value, 128,000 current value, 6,000 distributions, and 1,500 fees, net profit is 32,500." },
                miniGuide: { tr: "Sonucu reel getiri ve portföy dağılımı araçlarıyla birlikte okuyarak performansın satın alma gücü ve risk tarafını kontrol edin.", en: "Read it with real-return and allocation tools to review purchasing-power and risk context." },
            },
        },
    },
    {
        id: "crypto-profit-loss",
        slug: "kripto-kar-zarar-hesaplama",
        category: "finansal-hesaplamalar",
        updatedAt: "2026-05-01",
        name: { tr: "Kripto Kar Zarar Hesaplama", en: "Crypto Profit Loss Calculator" },
        h1: { tr: "Kripto Kar Zarar Hesaplama - Alış, Satış ve Komisyon", en: "Crypto Profit Loss Calculator - Buy, Sell and Fees" },
        description: { tr: "Kripto varlık alış miktarı, alış fiyatı, satış fiyatı ve komisyonlarıyla kar/zarar ve getiri oranını hesaplayın.", en: "Calculate crypto profit/loss and return rate using quantity, buy price, sell price, and fees." },
        shortDescription: { tr: "Kripto işlemlerinde maliyet, satış geliri, kar/zarar ve yüzdesel getiriyi hesaplayın.", en: "Calculate cost basis, proceeds, profit/loss, and percentage return for crypto trades." },
        relatedCalculators: ["doviz-hesaplama", "portfoy-dagilimi-hesaplama", "reel-getiri-hesaplama", "bilesik-buyume-hesaplama", "altin-hesaplama"],
        inputs: [
            { id: "quantity", name: { tr: "Miktar", en: "Quantity" }, type: "number", defaultValue: 0.5, min: 0, step: 0.0001, required: true },
            { id: "buyPrice", name: { tr: "Birim Alış Fiyatı", en: "Unit Buy Price" }, type: "number", defaultValue: 2000000, suffix: " ₺", min: 0, required: true },
            { id: "sellPrice", name: { tr: "Birim Satış / Güncel Fiyat", en: "Unit Sale / Current Price" }, type: "number", defaultValue: 2300000, suffix: " ₺", min: 0, required: true },
            { id: "buyFeeRate", name: { tr: "Alış Komisyonu", en: "Buy Fee" }, type: "number", defaultValue: 0.1, suffix: " %", min: 0, max: 100, step: 0.01 },
            { id: "sellFeeRate", name: { tr: "Satış Komisyonu", en: "Sell Fee" }, type: "number", defaultValue: 0.1, suffix: " %", min: 0, max: 100, step: 0.01 },
        ],
        results: [
            { id: "costBasis", label: { tr: "Toplam Maliyet", en: "Total Cost Basis" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netProceeds", label: { tr: "Net Satış Geliri", en: "Net Proceeds" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "profitLoss", label: { tr: "Kar / Zarar", en: "Profit / Loss" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "returnRate", label: { tr: "Getiri Oranı", en: "Return Rate" }, suffix: " %", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const quantity = Math.max(0, parseFloat(v.quantity) || 0);
            const buyPrice = Math.max(0, parseFloat(v.buyPrice) || 0);
            const sellPrice = Math.max(0, parseFloat(v.sellPrice) || 0);
            const buyFeeRate = Math.max(0, parseFloat(v.buyFeeRate) || 0) / 100;
            const sellFeeRate = Math.max(0, parseFloat(v.sellFeeRate) || 0) / 100;
            const grossCost = quantity * buyPrice;
            const costBasis = grossCost * (1 + buyFeeRate);
            const grossProceeds = quantity * sellPrice;
            const netProceeds = grossProceeds * (1 - sellFeeRate);
            const profitLoss = netProceeds - costBasis;
            const returnRate = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
            return { costBasis, netProceeds, profitLoss, returnRate };
        },
        seo: {
            title: { tr: "Kripto Kar Zarar Hesaplama 2026 - Alış Satış ve Komisyon", en: "Crypto Profit Loss Calculator 2026 - Buy Sell and Fees" },
            metaDescription: { tr: "Kripto kar zarar hesaplama aracıyla miktar, alış fiyatı, satış fiyatı ve komisyon oranlarını girerek net kar/zarar ve getiri oranını görün.", en: "Calculate crypto profit/loss and return rate from quantity, buy price, sell price, and fee rates." },
            content: { tr: "Kripto kar zarar hesabı, yalnız alış ve satış fiyatı farkından ibaret değildir. Borsa komisyonu, transfer maliyeti ve farklı para birimiyle işlem yapıldıysa kur etkisi sonucu değiştirir. Formül: Toplam Maliyet = Miktar x Alış Fiyatı + Alış Komisyonu. Net Satış Geliri = Miktar x Satış Fiyatı - Satış Komisyonu. Kar/Zarar = Net Satış Geliri - Toplam Maliyet. Örnek hesaplama: 0,5 BTC 2.000.000 TL alış, 2.300.000 TL satış ve iki tarafta %0,1 komisyonla yaklaşık 148.850 TL kar oluşur. Sonuç tahminidir; vergi ve platform koşulları değişebilir.", en: "Crypto profit/loss is not just the difference between buy and sell price. Exchange fees, transfer costs, and FX effects can change the result. Formula: Cost Basis = Quantity x Buy Price + Buy Fee. Net Proceeds = Quantity x Sell Price - Sell Fee. Profit/Loss = Net Proceeds - Cost Basis." },
            faq: [
                faqEntry("Kripto kar zarar nasıl hesaplanır?", "Net satış geliri toplam maliyetten çıkarılır. Toplam maliyete alış fiyatı ve komisyon, satış gelirine ise satış komisyonu etkisi dahil edilmelidir.", "How is crypto profit/loss calculated?", "Net proceeds are reduced by the total cost basis. Buy and sell fees should be included."),
                faqEntry("Komisyon dahil etmek neden önemli?", "Sık işlem yapan yatırımcılarda küçük komisyon oranları toplam getiriyi belirgin şekilde azaltabilir. Bu yüzden net getiri için komisyonlar hesaba katılmalıdır.", "Why include fees?", "Small fee rates can materially reduce total return for frequent traders, so net return should include them."),
                faqEntry("Kripto vergi hesabı bu sayfada var mı?", "Bu araç vergi hesaplamaz. Vergi yükümlülüğü ülke, işlem türü ve yatırımcı statüsüne göre değişebileceği için uzman görüşü ve güncel mevzuat kontrolü gerekir.", "Does this page calculate crypto tax?", "No. Tax treatment depends on country, transaction type, and investor status, so current rules and expert advice should be checked."),
                faqEntry("Zarar oranı nasıl yorumlanır?", "Getiri oranı negatifse satış geliri maliyetin altındadır. Bu oran pozisyon büyüklüğüyle birlikte okunmalı, tek başına yatırım kararı sayılmamalıdır.", "How should loss percentage be read?", "A negative return means proceeds are below cost. It should be read together with position size, not as a standalone investment decision."),
                faqEntry("Farklı borsalardaki fiyat farkı neyi değiştirir?", "Alış-satış makası ve likidite farklı olduğu için aynı kripto varlıkta net satış geliri değişebilir. Büyük işlemlerde gerçekleşen fiyat ayrıca sapabilir.", "How do exchange price differences matter?", "Bid-ask spread and liquidity differ across exchanges, so net proceeds can change. Large orders may also execute at different prices."),
            ],
            richContent: {
                howItWorks: { tr: "Alış maliyetini ve satış gelirini komisyonlarla netleştirir, aradaki farkı kar/zarar olarak verir.", en: "It nets buy cost and sale proceeds after fees, then returns the difference as profit/loss." },
                formulaText: { tr: "Kar/Zarar = [Miktar x Satış Fiyatı x (1 - Satış Komisyonu)] - [Miktar x Alış Fiyatı x (1 + Alış Komisyonu)]", en: "Profit/Loss = [Quantity x Sale Price x (1 - Sell Fee)] - [Quantity x Buy Price x (1 + Buy Fee)]" },
                exampleCalculation: { tr: "0,5 BTC alış 2.000.000 TL, satış 2.300.000 TL ve %0,1 komisyonla yaklaşık 148.850 TL kar hesaplanır.", en: "0.5 BTC bought at 2,000,000 and sold at 2,300,000 with 0.1% fees gives about 148,850 profit." },
                miniGuide: { tr: "Kur etkisini görmek için tutarları aynı para birimine çevirin ve sonucu reel getiri hesabıyla karşılaştırın.", en: "Convert amounts to one currency and compare the result with real-return analysis." },
            },
        },
    },
    {
        id: "financial-freedom",
        slug: "finansal-ozgurluk-hesaplama",
        category: "finansal-hesaplamalar",
        updatedAt: "2026-05-01",
        name: { tr: "Finansal Özgürlük Hesaplama", en: "Financial Freedom Calculator" },
        h1: { tr: "Finansal Özgürlük Hesaplama - Hedef Sermaye ve Süre", en: "Financial Freedom Calculator - Target Capital and Time" },
        description: { tr: "Aylık gider, mevcut birikim, katkı, beklenen getiri, enflasyon ve çekiş oranı varsayımlarıyla finansal özgürlük hedefini hesaplayın.", en: "Estimate the financial freedom target using monthly expenses, current savings, contributions, expected return, inflation, and withdrawal assumptions." },
        shortDescription: { tr: "Aylık giderlerinize göre hedef sermayeyi ve tahmini ulaşma süresini hesaplayın.", en: "Estimate target capital and time to reach it based on monthly expenses." },
        relatedCalculators: ["pasif-gelir-hesaplama", "birikim-hesaplama", "bilesik-faiz-hesaplama", "reel-getiri-hesaplama", "portfoy-dagilimi-hesaplama"],
        inputs: [
            { id: "monthlyExpense", name: { tr: "Aylık Gider", en: "Monthly Expense" }, type: "number", defaultValue: 50000, suffix: " ₺", min: 0, required: true },
            { id: "currentSavings", name: { tr: "Mevcut Birikim", en: "Current Savings" }, type: "number", defaultValue: 500000, suffix: " ₺", min: 0 },
            { id: "monthlyContribution", name: { tr: "Aylık Yatırım / Birikim", en: "Monthly Contribution" }, type: "number", defaultValue: 25000, suffix: " ₺", min: 0 },
            { id: "annualReturnRate", name: { tr: "Yıllık Nominal Getiri Varsayımı", en: "Annual Nominal Return Assumption" }, type: "number", defaultValue: 30, suffix: " %", step: 0.1 },
            { id: "annualInflationRate", name: { tr: "Yıllık Enflasyon Varsayımı", en: "Annual Inflation Assumption" }, type: "number", defaultValue: 20, suffix: " %", step: 0.1 },
            { id: "withdrawalRate", name: { tr: "Yıllık Çekiş Oranı Varsayımı", en: "Annual Withdrawal Rate Assumption" }, type: "number", defaultValue: 4, suffix: " %", min: 0.1, max: 20, step: 0.1 },
        ],
        results: [
            { id: "targetCapital", label: { tr: "Hedef Sermaye", en: "Target Capital" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "realAnnualReturn", label: { tr: "Reel Yıllık Getiri Varsayımı", en: "Real Annual Return Assumption" }, suffix: " %", decimalPlaces: 2 },
            { id: "yearsToFreedom", label: { tr: "Tahmini Süre", en: "Estimated Time" }, suffix: " yıl", decimalPlaces: 1 },
            { id: "statusNote", label: { tr: "Yorum", en: "Comment" }, type: "text" },
        ],
        formula: (v) => {
            const monthlyExpense = Math.max(0, parseFloat(v.monthlyExpense) || 0);
            const currentSavings = Math.max(0, parseFloat(v.currentSavings) || 0);
            const monthlyContribution = Math.max(0, parseFloat(v.monthlyContribution) || 0);
            const annualReturnRate = (parseFloat(v.annualReturnRate) || 0) / 100;
            const annualInflationRate = (parseFloat(v.annualInflationRate) || 0) / 100;
            const withdrawalRate = Math.max(0.001, (parseFloat(v.withdrawalRate) || 4) / 100);
            const annualExpense = monthlyExpense * 12;
            const targetCapital = annualExpense / withdrawalRate;
            const realAnnualReturn = ((1 + annualReturnRate) / (1 + annualInflationRate) - 1) * 100;
            const monthlyRealReturn = Math.pow(1 + realAnnualReturn / 100, 1 / 12) - 1;
            let balance = currentSavings;
            let months = 0;
            while (balance < targetCapital && months < 1200) {
                balance = balance * (1 + monthlyRealReturn) + monthlyContribution;
                months += 1;
            }
            const yearsToFreedom = targetCapital <= currentSavings ? 0 : months >= 1200 ? 100 : months / 12;
            const statusNote = targetCapital <= currentSavings
                ? { tr: "Mevcut birikim hedef sermayeyi karşılıyor görünüyor.", en: "Current savings appear to meet the target capital." }
                : months >= 1200
                    ? { tr: "Bu varsayımlarla hedef çok uzak görünüyor; katkı, gider veya getiri varsayımını yeniden değerlendirin.", en: "With these assumptions, the target looks very distant; review contribution, spending, or return assumptions." }
                    : { tr: "Sonuç tahmini bir yol haritasıdır; getiri ve enflasyon değiştikçe süre de değişir.", en: "The result is an estimated roadmap; time changes as returns and inflation change." };
            return { targetCapital, realAnnualReturn, yearsToFreedom, statusNote };
        },
        seo: {
            title: { tr: "Finansal Özgürlük Hesaplama 2026 - Hedef Sermaye ve Süre", en: "Financial Freedom Calculator 2026 - Target Capital and Time" },
            metaDescription: { tr: "Finansal özgürlük hesaplama aracıyla aylık gider, birikim, katkı, getiri, enflasyon ve çekiş oranına göre hedef sermaye ve tahmini süreyi hesaplayın.", en: "Estimate target capital and time to financial freedom using expenses, savings, contributions, return, inflation, and withdrawal assumptions." },
            content: { tr: "Finansal özgürlük hesaplama, çalışma gelirine bağlı kalmadan giderleri karşılayabilecek yatırım sermayesini tahmin eder. Temel yöntem yıllık gideri sürdürülebilir çekiş oranına bölmektir. Formül: Hedef Sermaye = Aylık Gider x 12 / Yıllık Çekiş Oranı. Örnek hesaplama: Aylık 50.000 TL gider ve %4 çekiş oranında hedef sermaye 15.000.000 TL olur. Ancak bu yalnız ilk çerçevedir; gerçek süre, mevcut birikim, aylık katkı, reel getiri ve enflasyona bağlıdır. Sonuç kesin emeklilik vaadi değildir; piyasa getirileri, gider artışları ve vergi koşulları değişebilir.", en: "Financial freedom calculation estimates the investment capital needed to cover expenses without relying on employment income. Formula: Target Capital = Monthly Expense x 12 / Annual Withdrawal Rate. Example: with 50,000 monthly expense and a 4% withdrawal rate, target capital is 15,000,000. The result is an estimate, not a guarantee." },
            faq: [
                faqEntry("Finansal özgürlük için ne kadar para gerekir?", "Yaklaşık hedef, yıllık giderin sürdürülebilir çekiş oranına bölünmesiyle bulunur. Gider yükseldikçe veya çekiş oranı düştükçe hedef sermaye artar.", "How much money is needed for financial freedom?", "A rough target is annual expense divided by sustainable withdrawal rate. Higher expenses or lower withdrawal rates increase the target."),
                faqEntry("%4 kuralı kesin midir?", "Hayır. %4 kuralı tarihsel bir varsayımdır; ülke, enflasyon, portföy dağılımı ve vergi koşullarına göre uygun oran değişebilir.", "Is the 4% rule certain?", "No. It is a historical assumption; the suitable rate changes by country, inflation, portfolio mix, and tax conditions."),
                faqEntry("Reel getiri neden ayrı hesaplanır?", "Çünkü nominal getiri enflasyon kadar artmışsa satın alma gücü değişmemiş olabilir. Finansal özgürlük planında asıl önemli olan reel büyümedir.", "Why calculate real return separately?", "If nominal return only matches inflation, purchasing power may not improve. Real growth matters more for financial freedom plans."),
                faqEntry("Aylık katkı hedef süresini nasıl etkiler?", "Düzenli katkı sermayeyi büyütür ve bileşik getiriye taban oluşturur. Katkı yükseldikçe hedefe ulaşma süresi genellikle kısalır.", "How does monthly contribution affect time?", "Regular contributions grow capital and create a base for compounding. Higher contributions usually shorten the time to goal."),
                faqEntry("Bu sonuç emeklilik tavsiyesi midir?", "Hayır. Sonuç planlama amaçlı tahmindir; emeklilik, vergi, sağlık ve yatırım kararları için profesyonel değerlendirme gerekir.", "Is this retirement advice?", "No. It is a planning estimate; retirement, tax, health, and investment decisions need professional review."),
            ],
            richContent: {
                howItWorks: { tr: "Yıllık gideri çekiş oranına böler, sonra mevcut birikim ve aylık katkıyla hedefe kaç yılda yaklaşılacağını simüle eder.", en: "It divides annual expenses by the withdrawal rate, then simulates time to target using savings and monthly contributions." },
                formulaText: { tr: "Hedef Sermaye = Aylık Gider x 12 / Çekiş Oranı", en: "Target Capital = Monthly Expense x 12 / Withdrawal Rate" },
                exampleCalculation: { tr: "50.000 TL aylık gider ve %4 çekiş oranıyla hedef sermaye 15.000.000 TL olur.", en: "50,000 monthly expense and a 4% withdrawal rate imply 15,000,000 target capital." },
                miniGuide: { tr: "Sonucu pasif gelir, birikim ve reel getiri hesaplarıyla birlikte okuyarak varsayımlarınızı çapraz kontrol edin.", en: "Read it with passive income, savings, and real-return tools to cross-check assumptions." },
            },
        },
    },
    {
        id: "passive-income",
        slug: "pasif-gelir-hesaplama",
        category: "finansal-hesaplamalar",
        updatedAt: "2026-05-01",
        name: { tr: "Pasif Gelir Hesaplama", en: "Passive Income Calculator" },
        h1: { tr: "Pasif Gelir Hesaplama - Hedef Gelir ve Gerekli Sermaye", en: "Passive Income Calculator - Target Income and Required Capital" },
        description: { tr: "Hedef aylık pasif gelir, beklenen net getiri, vergi varsayımı ve mevcut sermayeyle gerekli birikimi ve hedefe ulaşma süresini hesaplayın.", en: "Estimate required capital and time to target using passive income goal, expected yield, tax assumption, and current capital." },
        shortDescription: { tr: "Hedef pasif gelir için gereken sermayeyi ve tahmini süreyi görün.", en: "See required capital and estimated time for a passive income goal." },
        relatedCalculators: ["finansal-ozgurluk-hesaplama", "bilesik-faiz-hesaplama", "birikim-hesaplama", "sermaye-ve-temettu-hesaplama", "portfoy-dagilimi-hesaplama"],
        inputs: [
            { id: "targetMonthlyIncome", name: { tr: "Hedef Aylık Pasif Gelir", en: "Target Monthly Passive Income" }, type: "number", defaultValue: 30000, suffix: " ₺", min: 0, required: true },
            { id: "currentCapital", name: { tr: "Mevcut Sermaye", en: "Current Capital" }, type: "number", defaultValue: 250000, suffix: " ₺", min: 0 },
            { id: "monthlyContribution", name: { tr: "Aylık Ek Yatırım", en: "Monthly Contribution" }, type: "number", defaultValue: 15000, suffix: " ₺", min: 0 },
            { id: "annualYieldRate", name: { tr: "Yıllık Brüt Getiri Varsayımı", en: "Annual Gross Yield Assumption" }, type: "number", defaultValue: 18, suffix: " %", min: 0, step: 0.1 },
            { id: "taxRate", name: { tr: "Vergi / Kesinti Varsayımı", en: "Tax / Deduction Assumption" }, type: "number", defaultValue: 0, suffix: " %", min: 0, max: 100, step: 0.1 },
        ],
        results: [
            { id: "netAnnualYieldRate", label: { tr: "Net Yıllık Getiri Varsayımı", en: "Net Annual Yield Assumption" }, suffix: " %", decimalPlaces: 2 },
            { id: "requiredCapital", label: { tr: "Gerekli Sermaye", en: "Required Capital" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "capitalGap", label: { tr: "Eksik Sermaye", en: "Capital Gap" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "yearsToTarget", label: { tr: "Tahmini Süre", en: "Estimated Time" }, suffix: " yıl", decimalPlaces: 1 },
        ],
        formula: (v) => {
            const targetMonthlyIncome = Math.max(0, parseFloat(v.targetMonthlyIncome) || 0);
            const currentCapital = Math.max(0, parseFloat(v.currentCapital) || 0);
            const monthlyContribution = Math.max(0, parseFloat(v.monthlyContribution) || 0);
            const annualYieldRate = Math.max(0, parseFloat(v.annualYieldRate) || 0) / 100;
            const taxRate = Math.min(100, Math.max(0, parseFloat(v.taxRate) || 0)) / 100;
            const netAnnualYieldRate = annualYieldRate * (1 - taxRate) * 100;
            const netAnnualYield = netAnnualYieldRate / 100;
            const requiredCapital = netAnnualYield > 0 ? (targetMonthlyIncome * 12) / netAnnualYield : 0;
            const capitalGap = Math.max(0, requiredCapital - currentCapital);
            const monthlyYield = Math.pow(1 + netAnnualYield, 1 / 12) - 1;
            let balance = currentCapital;
            let months = 0;
            while (requiredCapital > 0 && balance < requiredCapital && months < 1200) {
                balance = balance * (1 + monthlyYield) + monthlyContribution;
                months += 1;
            }
            const yearsToTarget = requiredCapital <= currentCapital ? 0 : months >= 1200 ? 100 : months / 12;
            return { netAnnualYieldRate, requiredCapital, capitalGap, yearsToTarget };
        },
        seo: {
            title: { tr: "Pasif Gelir Hesaplama 2026 - Hedef Gelir İçin Gerekli Sermaye", en: "Passive Income Calculator 2026 - Required Capital for Target Income" },
            metaDescription: { tr: "Pasif gelir hesaplama aracıyla hedef aylık gelir, getiri ve vergi varsayımına göre gereken sermayeyi, eksik tutarı ve tahmini süreyi hesaplayın.", en: "Estimate required capital, capital gap, and time to target from passive income goal, yield, and tax assumptions." },
            content: { tr: "Pasif gelir hesabı, hedeflenen aylık geliri üretebilmek için ne kadar sermayeye ihtiyaç olduğunu tahmin eder. Formül: Gerekli Sermaye = Hedef Yıllık Gelir / Net Yıllık Getiri Oranı. Örnek hesaplama: Aylık 30.000 TL pasif gelir hedefi yıllık 360.000 TL eder. Net yıllık getiri varsayımı %12 ise gerekli sermaye 3.000.000 TL olur. Getiri oranı, vergi, kesinti, fon gideri ve piyasa dalgalanması değiştikçe sonuç da değişir. Bu nedenle araç kesin gelir vaadi vermez; senaryo planlama sağlar.", en: "Passive income calculation estimates the capital needed to generate a target monthly income. Formula: Required Capital = Target Annual Income / Net Annual Yield. Example: 30,000 monthly income equals 360,000 annually. At 12% net annual yield, required capital is 3,000,000. The result is a scenario estimate, not a guaranteed income promise." },
            faq: [
                faqEntry("Pasif gelir için gereken sermaye nasıl hesaplanır?", "Hedef yıllık gelir net yıllık getiri oranına bölünür. Örneğin 360.000 TL yıllık gelir ve %12 net getiri için 3.000.000 TL gerekir.", "How is required capital for passive income calculated?", "Target annual income is divided by net annual yield. For example, 360,000 annual income and 12% net yield requires 3,000,000."),
                faqEntry("Getiri oranını neden kendim giriyorum?", "Mevduat, temettü, fon, kira veya farklı yatırım araçlarının getirisi dönemsel değişir. Doğrulanmamış tek bir oran kullanmak yanıltıcı olur.", "Why do I enter the yield rate?", "Deposits, dividends, funds, rent, and other yields change over time. A single hardcoded rate would be misleading."),
                faqEntry("Vergi varsayımı ne işe yarar?", "Brüt getiri her zaman elde kalan net gelir değildir. Stopaj, gelir vergisi, fon gideri veya platform kesintisi net pasif geliri azaltabilir.", "What does the tax assumption do?", "Gross yield is not always take-home income. Withholding, income tax, fund expenses, or platform fees can reduce net passive income."),
                faqEntry("Pasif gelir garantili midir?", "Hayır. Kira, temettü, faiz veya fon getirileri değişebilir. Bu araç yalnız varsayımsal bir hedef hesabı yapar.", "Is passive income guaranteed?", "No. Rent, dividends, interest, or fund returns can change. This tool only calculates an assumed target."),
                faqEntry("Finansal özgürlük hesabından farkı nedir?", "Pasif gelir aracı belirli bir aylık gelire odaklanır. Finansal özgürlük hesabı ise tüm yaşam giderlerini karşılayacak hedef sermaye ve süreye odaklanır.", "How is it different from financial freedom calculation?", "Passive income focuses on a target monthly income, while financial freedom focuses on capital and time needed to cover all living expenses."),
            ],
            richContent: {
                howItWorks: { tr: "Hedef aylık geliri yıllığa çevirir, net getiri varsayımına böler ve mevcut sermayeyle farkı çıkarır.", en: "It annualizes target income, divides by net yield assumption, and compares it with current capital." },
                formulaText: { tr: "Gerekli Sermaye = Hedef Aylık Gelir x 12 / Net Yıllık Getiri", en: "Required Capital = Target Monthly Income x 12 / Net Annual Yield" },
                exampleCalculation: { tr: "30.000 TL aylık gelir ve %12 net yıllık getiri için gereken sermaye 3.000.000 TL olur.", en: "30,000 monthly income at 12% net annual yield requires 3,000,000 capital." },
                miniGuide: { tr: "Getiri oranını iyimser, baz ve kötümser senaryolarla değiştirerek hedefin ne kadar hassas olduğunu kontrol edin.", en: "Change the yield rate across optimistic, base, and pessimistic scenarios to test sensitivity." },
            },
        },
    },
    {
        id: "hourly-wage",
        slug: "saatlik-ucret-hesaplama",
        category: "maas-ve-vergi",
        updatedAt: "2026-05-01",
        name: { tr: "Saatlik Ücret Hesaplama", en: "Hourly Wage Calculator" },
        h1: { tr: "Saatlik Ücret Hesaplama - Aylık Maaştan Saatlik Ücrete", en: "Hourly Wage Calculator - Monthly Salary to Hourly Pay" },
        description: { tr: "Aylık brüt veya net ücret ve çalışma saatleriyle saatlik ücret, günlük karşılık ve yıllık ücret tahminini hesaplayın.", en: "Calculate hourly wage, daily equivalent, and annual pay estimate from monthly salary and working hours." },
        shortDescription: { tr: "Aylık maaşı saatlik ve günlük ücrete çevirin.", en: "Convert monthly salary to hourly and daily pay." },
        relatedCalculators: ["gunluk-ucret-hesaplama", "fazla-mesai-hesaplama", "maas-hesaplama", "asgari-ucret-hesaplama", "gelir-vergisi-hesaplama"],
        inputs: [
            { id: "monthlySalary", name: { tr: "Aylık Ücret", en: "Monthly Salary" }, type: "number", defaultValue: 40000, suffix: " ₺", min: 0, required: true },
            { id: "weeklyHours", name: { tr: "Haftalık Çalışma Saati", en: "Weekly Working Hours" }, type: "number", defaultValue: 45, suffix: " saat", min: 1, max: 80, step: 0.5 },
            { id: "paidWeeksPerYear", name: { tr: "Yıllık Ücretli Hafta", en: "Paid Weeks per Year" }, type: "number", defaultValue: 52, suffix: " hafta", min: 1, max: 52 },
        ],
        results: [
            { id: "hourlyWage", label: { tr: "Saatlik Ücret", en: "Hourly Wage" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "dailyWage", label: { tr: "Günlük Karşılık", en: "Daily Equivalent" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "annualSalary", label: { tr: "Yıllık Ücret", en: "Annual Salary" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "monthlyHours", label: { tr: "Aylık Ortalama Saat", en: "Average Monthly Hours" }, suffix: " saat", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const monthlySalary = Math.max(0, parseFloat(v.monthlySalary) || 0);
            const weeklyHours = Math.max(1, parseFloat(v.weeklyHours) || 45);
            const paidWeeksPerYear = Math.min(52, Math.max(1, parseFloat(v.paidWeeksPerYear) || 52));
            const annualSalary = monthlySalary * 12;
            const monthlyHours = (weeklyHours * paidWeeksPerYear) / 12;
            const hourlyWage = monthlyHours > 0 ? monthlySalary / monthlyHours : 0;
            const dailyWage = hourlyWage * (weeklyHours / 6);
            return { hourlyWage, dailyWage, annualSalary, monthlyHours };
        },
        seo: {
            title: { tr: "Saatlik Ücret Hesaplama 2026 - Aylık Maaştan Saatlik Ücrete", en: "Hourly Wage Calculator 2026 - Monthly Salary to Hourly Pay" },
            metaDescription: { tr: "Saatlik ücret hesaplama aracıyla aylık maaşınızı haftalık çalışma saatine göre saatlik, günlük ve yıllık ücrete çevirin.", en: "Convert monthly salary into hourly, daily, and annual pay using weekly working hours." },
            content: { tr: "Saatlik ücret hesaplama, aylık maaşı çalışma saatine bölerek işin saatlik karşılığını gösterir. Formül: Saatlik Ücret = Aylık Ücret / Aylık Ortalama Çalışma Saati. Örnek hesaplama: 40.000 TL aylık ücret ve haftada 45 saat için aylık ortalama saat 195 olur; saatlik ücret yaklaşık 205,13 TL çıkar. Sonuç brüt veya net ücret türüne göre yorumlanmalıdır. Bordro, prim, yemek/yol yardımı ve fazla mesai gibi kalemler nihai geliri değiştirebilir.", en: "Hourly wage calculation divides monthly salary by average monthly working hours. Formula: Hourly Wage = Monthly Salary / Average Monthly Hours. Example: 40,000 monthly salary and 45 weekly hours gives about 195 monthly hours and 205.13 hourly wage." },
            faq: [
                faqEntry("Saatlik ücret nasıl hesaplanır?", "Aylık ücret, aylık ortalama çalışma saatine bölünür. Aylık saat genellikle haftalık saat x 52 / 12 mantığıyla tahmin edilir.", "How is hourly wage calculated?", "Monthly salary is divided by average monthly working hours, usually estimated as weekly hours x 52 / 12."),
                faqEntry("Brüt maaş mı net maaş mı girilmeli?", "Hangi sonucu görmek istiyorsanız o ücret türünü girin. Brüt girerseniz saatlik brüt, net girerseniz saatlik net karşılık çıkar.", "Should gross or net salary be entered?", "Enter the pay type you want to analyze. Gross input gives gross hourly pay; net input gives net hourly pay."),
                faqEntry("Haftalık 45 saat neden varsayılan?", "Türkiye'de standart tam zamanlı çalışma için sık kullanılan haftalık üst sınır 45 saattir; ancak iş sözleşmenize göre alanı değiştirebilirsiniz.", "Why is 45 hours the default?", "45 weekly hours is commonly used for full-time work in Turkey, but you can change it according to your contract."),
                faqEntry("Saatlik ücret fazla mesai hesabında kullanılır mı?", "Evet. Fazla mesai hesabında saatlik ücret taban alınır; uygulanacak katsayı ve kesintiler ayrıca dikkate alınır.", "Is hourly wage used for overtime?", "Yes. Overtime calculations use hourly pay as the base, then apply multiplier and deductions separately."),
                faqEntry("Yan haklar saatlik ücrete dahil mi?", "Bu araç yalnız girilen ücret tutarını böler. Yemek, yol, prim veya ikramiye dahil edilecekse aylık ücret alanına toplam karşılık eklenmelidir.", "Are benefits included?", "The tool only divides the amount entered. If meals, transport, bonuses, or premiums should be included, add their monthly equivalent to salary."),
            ],
            richContent: {
                howItWorks: { tr: "Aylık ücreti, haftalık saat ve yıllık ücretli hafta sayısından türetilen aylık ortalama saate böler.", en: "It divides monthly salary by average monthly hours derived from weekly hours and paid weeks." },
                formulaText: { tr: "Saatlik Ücret = Aylık Ücret / (Haftalık Saat x Ücretli Hafta / 12)", en: "Hourly Wage = Monthly Salary / (Weekly Hours x Paid Weeks / 12)" },
                exampleCalculation: { tr: "40.000 TL maaş ve 45 saat/hafta için saatlik ücret yaklaşık 205,13 TL olur.", en: "40,000 salary and 45 hours/week gives about 205.13 hourly pay." },
                miniGuide: { tr: "Sonucu fazla mesai, günlük ücret ve maaş hesaplama araçlarıyla birlikte kontrol edin.", en: "Check the result together with overtime, daily wage, and salary calculators." },
            },
        },
    },
    {
        id: "daily-wage",
        slug: "gunluk-ucret-hesaplama",
        category: "maas-ve-vergi",
        updatedAt: "2026-05-01",
        name: { tr: "Günlük Ücret Hesaplama", en: "Daily Wage Calculator" },
        h1: { tr: "Günlük Ücret Hesaplama - Aylık Maaştan Günlük Ücrete", en: "Daily Wage Calculator - Monthly Salary to Daily Pay" },
        description: { tr: "Aylık ücret ve gün esasına göre günlük ücret, saatlik karşılık ve dönemlik ödeme tahminini hesaplayın.", en: "Calculate daily wage, hourly equivalent, and period pay estimate from monthly salary and day basis." },
        shortDescription: { tr: "Aylık maaşı 30 gün, 26 gün veya özel gün esasına göre günlük ücrete çevirin.", en: "Convert monthly salary to daily pay using 30-day, 26-day, or custom basis." },
        relatedCalculators: ["saatlik-ucret-hesaplama", "fazla-mesai-hesaplama", "maas-hesaplama", "yillik-izin-ucreti-hesaplama", "asgari-ucret-hesaplama"],
        inputs: [
            { id: "monthlySalary", name: { tr: "Aylık Ücret", en: "Monthly Salary" }, type: "number", defaultValue: 40000, suffix: " ₺", min: 0, required: true },
            { id: "dayBasis", name: { tr: "Gün Esası", en: "Day Basis" }, type: "select", defaultValue: 30, options: [
                { label: { tr: "30 gün", en: "30 days" }, value: 30 },
                { label: { tr: "26 gün", en: "26 days" }, value: 26 },
                { label: { tr: "22 gün", en: "22 days" }, value: 22 },
            ] },
            { id: "periodDays", name: { tr: "Hesaplanacak Gün Sayısı", en: "Period Days" }, type: "number", defaultValue: 7, suffix: " gün", min: 0, step: 0.5 },
            { id: "dailyHours", name: { tr: "Günlük Saat Varsayımı", en: "Daily Hours Assumption" }, type: "number", defaultValue: 7.5, suffix: " saat", min: 0.1, max: 24, step: 0.5 },
        ],
        results: [
            { id: "dailyWage", label: { tr: "Günlük Ücret", en: "Daily Wage" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "hourlyEquivalent", label: { tr: "Saatlik Karşılık", en: "Hourly Equivalent" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "periodPay", label: { tr: "Dönem Tutarı", en: "Period Pay" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const monthlySalary = Math.max(0, parseFloat(v.monthlySalary) || 0);
            const dayBasis = Math.max(1, parseFloat(v.dayBasis) || 30);
            const periodDays = Math.max(0, parseFloat(v.periodDays) || 0);
            const dailyHours = Math.max(0.1, parseFloat(v.dailyHours) || 7.5);
            const dailyWage = monthlySalary / dayBasis;
            const hourlyEquivalent = dailyWage / dailyHours;
            const periodPay = dailyWage * periodDays;
            return { dailyWage, hourlyEquivalent, periodPay };
        },
        seo: {
            title: { tr: "Günlük Ücret Hesaplama 2026 - Aylık Maaştan Günlük Ücret", en: "Daily Wage Calculator 2026 - Monthly Salary to Daily Pay" },
            metaDescription: { tr: "Günlük ücret hesaplama aracıyla aylık maaşı gün esasına bölerek günlük ücret, saatlik karşılık ve belirli gün sayısı için dönem tutarını hesaplayın.", en: "Calculate daily wage, hourly equivalent, and period pay by dividing monthly salary by day basis." },
            content: { tr: "Günlük ücret hesabı, aylık ücretin seçilen gün esasına bölünmesiyle yapılır. Formül: Günlük Ücret = Aylık Ücret / Gün Esası. Örnek hesaplama: 40.000 TL aylık ücret 30 gün esasına bölündüğünde günlük ücret 1.333,33 TL olur. 7 günlük dönem için tutar 9.333,33 TL'dir. Sonuç brüt veya net ücret türüne göre yorumlanmalıdır; resmi bordroda prim, kesinti, devamsızlık, izin ve iş sözleşmesi detayları fark yaratabilir.", en: "Daily wage is calculated by dividing monthly salary by the selected day basis. Formula: Daily Wage = Monthly Salary / Day Basis. Example: 40,000 / 30 = 1,333.33 daily wage. The result depends on whether input is gross or net." },
            faq: [
                faqEntry("Günlük ücret nasıl hesaplanır?", "Aylık ücret seçilen gün esasına bölünür. 30 gün, 26 gün veya 22 gün gibi farklı esaslar farklı sonuç verir.", "How is daily wage calculated?", "Monthly salary is divided by the selected day basis. 30, 26, or 22 days produce different results."),
                faqEntry("30 gün mü 26 gün mü kullanılmalı?", "Bordro ve sözleşme uygulamasına göre değişebilir. Genel aylık ücret yorumunda 30 gün, fiili çalışma günü analizinde 22 veya 26 gün seçilebilir.", "Should 30 or 26 days be used?", "It depends on payroll and contract practice. 30 days suits general monthly pay, while 22 or 26 may suit working-day analysis."),
                faqEntry("Günlük ücret net mi brüt mü çıkar?", "Girdiğiniz aylık ücret hangi türdeyse sonuç da o türde çıkar. Brüt maaş girerseniz brüt günlük ücret, net maaş girerseniz net günlük ücret görürsünüz.", "Is daily wage gross or net?", "It matches the entered monthly salary type. Gross input returns gross daily pay; net input returns net daily pay."),
                faqEntry("İzin ücreti hesabında kullanılabilir mi?", "Evet, yaklaşık günlük karşılık için kullanılabilir. Ancak izin ücreti ve bordro hesabında kanuni ve sözleşmesel detaylar ayrıca etkili olabilir.", "Can it be used for leave pay?", "Yes for an approximate daily equivalent, but legal and contractual payroll details can still affect leave pay."),
                faqEntry("Dönem tutarı neyi gösterir?", "Seçtiğiniz gün sayısı için günlük ücretin toplam karşılığını gösterir. Örneğin geçici çalışma, eksik gün veya kısa dönem planlamasında kullanılabilir.", "What does period pay show?", "It shows daily wage multiplied by selected days, useful for temporary work, missing days, or short-period planning."),
            ],
            richContent: {
                howItWorks: { tr: "Aylık ücreti seçilen gün esasına böler ve istenen gün sayısıyla çarpar.", en: "It divides monthly salary by selected day basis and multiplies by period days." },
                formulaText: { tr: "Günlük Ücret = Aylık Ücret / Gün Esası", en: "Daily Wage = Monthly Salary / Day Basis" },
                exampleCalculation: { tr: "40.000 TL / 30 gün = 1.333,33 TL günlük ücret.", en: "40,000 / 30 days = 1,333.33 daily wage." },
                miniGuide: { tr: "Bordro sonucu için günlük ücret hesabını maaş ve izin ücreti hesaplarıyla birlikte değerlendirin.", en: "For payroll context, read daily wage with salary and leave-pay calculators." },
            },
        },
    },
    {
        id: "overtime-pay",
        slug: "fazla-mesai-hesaplama",
        category: "maas-ve-vergi",
        updatedAt: "2026-05-01",
        name: { tr: "Fazla Mesai Hesaplama", en: "Overtime Pay Calculator" },
        h1: { tr: "Fazla Mesai Hesaplama - Saatlik Ücret, Katsayı ve Kesinti", en: "Overtime Pay Calculator - Hourly Pay, Multiplier and Deduction" },
        description: { tr: "Saatlik ücret veya aylık maaş üzerinden fazla mesai saatini, katsayıyı ve kesinti varsayımını girerek brüt/net fazla mesai tutarını hesaplayın.", en: "Calculate gross and net overtime pay from hourly wage or monthly salary using overtime hours, multiplier, and deduction assumption." },
        shortDescription: { tr: "Fazla çalışma saatleri için yaklaşık brüt ve net mesai tutarını hesaplayın.", en: "Estimate gross and net overtime pay for extra working hours." },
        relatedCalculators: ["saatlik-ucret-hesaplama", "gunluk-ucret-hesaplama", "maas-hesaplama", "gelir-vergisi-hesaplama", "bordro-hesaplama"],
        inputs: [
            { id: "monthlySalary", name: { tr: "Aylık Ücret", en: "Monthly Salary" }, type: "number", defaultValue: 40000, suffix: " ₺", min: 0 },
            { id: "weeklyHours", name: { tr: "Haftalık Saat", en: "Weekly Hours" }, type: "number", defaultValue: 45, suffix: " saat", min: 1, max: 80, step: 0.5 },
            { id: "overtimeHours", name: { tr: "Fazla Mesai Saati", en: "Overtime Hours" }, type: "number", defaultValue: 10, suffix: " saat", min: 0, step: 0.5, required: true },
            { id: "multiplier", name: { tr: "Mesai Katsayısı", en: "Overtime Multiplier" }, type: "number", defaultValue: 1.5, min: 1, max: 3, step: 0.05 },
            { id: "deductionRate", name: { tr: "Kesinti Varsayımı", en: "Deduction Assumption" }, type: "number", defaultValue: 0, suffix: " %", min: 0, max: 100, step: 0.1 },
        ],
        results: [
            { id: "hourlyWage", label: { tr: "Saatlik Ücret", en: "Hourly Wage" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "grossOvertime", label: { tr: "Brüt Fazla Mesai", en: "Gross Overtime" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "deductions", label: { tr: "Kesinti Varsayımı", en: "Deduction Assumption" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netOvertime", label: { tr: "Net Fazla Mesai", en: "Net Overtime" }, suffix: " ₺", decimalPlaces: 2 },
        ],
        formula: (v) => {
            const monthlySalary = Math.max(0, parseFloat(v.monthlySalary) || 0);
            const weeklyHours = Math.max(1, parseFloat(v.weeklyHours) || 45);
            const overtimeHours = Math.max(0, parseFloat(v.overtimeHours) || 0);
            const multiplier = Math.max(1, parseFloat(v.multiplier) || 1.5);
            const deductionRate = Math.min(100, Math.max(0, parseFloat(v.deductionRate) || 0)) / 100;
            const monthlyHours = weeklyHours * 52 / 12;
            const hourlyWage = monthlyHours > 0 ? monthlySalary / monthlyHours : 0;
            const grossOvertime = hourlyWage * overtimeHours * multiplier;
            const deductions = grossOvertime * deductionRate;
            const netOvertime = grossOvertime - deductions;
            return { hourlyWage, grossOvertime, deductions, netOvertime };
        },
        seo: {
            title: { tr: "Fazla Mesai Hesaplama 2026 - Brüt ve Net Mesai Ücreti", en: "Overtime Pay Calculator 2026 - Gross and Net Overtime" },
            metaDescription: { tr: "Fazla mesai hesaplama aracıyla aylık ücret, haftalık saat, mesai saati, katsayı ve kesinti varsayımına göre brüt/net mesai tutarını hesaplayın.", en: "Calculate gross and net overtime pay using salary, weekly hours, overtime hours, multiplier, and deduction assumption." },
            content: { tr: "Fazla mesai hesabı, saatlik ücretin fazla çalışma saati ve mesai katsayısıyla çarpılmasıyla yapılır. Formül: Brüt Fazla Mesai = Saatlik Ücret x Fazla Mesai Saati x Katsayı. Örnek hesaplama: 40.000 TL aylık ücret, haftada 45 saat ve 10 saat fazla mesai için saatlik ücret yaklaşık 205,13 TL olur. Katsayı 1,5 ise brüt fazla mesai yaklaşık 3.076,92 TL çıkar. Net sonuç için kesinti oranı kullanıcı varsayımıdır; vergi ve bordro etkisi kişiye göre değişebilir.", en: "Overtime pay is calculated by multiplying hourly wage by overtime hours and multiplier. Formula: Gross Overtime = Hourly Wage x Overtime Hours x Multiplier. Deduction rate is user-entered because payroll and tax effects can vary." },
            faq: [
                faqEntry("Fazla mesai ücreti nasıl hesaplanır?", "Saatlik ücret, fazla mesai saati ve mesai katsayısı çarpılır. Kesinti varsa brüt tutardan ayrıca düşülür.", "How is overtime pay calculated?", "Hourly wage is multiplied by overtime hours and multiplier. Deductions are then subtracted if entered."),
                faqEntry("Mesai katsayısı neden değiştirilebilir?", "Fazla çalışma, fazla sürelerle çalışma, sözleşme hükümleri veya kurum uygulaması farklı katsayılar doğurabilir. Bu yüzden alan kullanıcıya bırakılır.", "Why is the multiplier editable?", "Different overtime types, contracts, or employer practices can lead to different multipliers, so the field is user-controlled."),
                faqEntry("Net mesai tutarı neden tahmini?", "Gelir vergisi dilimi, SGK kesintisi, istisnalar ve bordro kalemleri kişiden kişiye değişebilir. Kesinti oranı bu nedenle varsayım olarak girilir.", "Why is net overtime approximate?", "Income-tax bracket, SGK deductions, exemptions, and payroll items vary by person. The deduction rate is therefore an assumption."),
                faqEntry("Saatlik ücret hangi maaştan hesaplanır?", "Girdiğiniz aylık ücret brüt ise saatlik brüt, net ise saatlik net karşılık hesaplanır. Bordro yorumu için brüt/net ayrımı korunmalıdır.", "Which salary is used for hourly pay?", "If you enter gross salary, hourly gross is calculated; if net, hourly net is calculated. Keep the distinction for payroll interpretation."),
                faqEntry("Bu araç resmi bordro yerine geçer mi?", "Hayır. Araç ön hesap üretir; resmi bordroda sözleşme, puantaj ve mevzuat uygulaması esas alınır.", "Does this replace official payroll?", "No. It is a preliminary estimate; official payroll depends on contract, time records, and applicable rules."),
            ],
            richContent: {
                howItWorks: { tr: "Aylık ücretten saatlik ücret türetir, fazla mesai saatini katsayıyla çarpar ve kesinti varsayımını düşer.", en: "It derives hourly pay from monthly salary, applies overtime hours and multiplier, then subtracts deduction assumption." },
                formulaText: { tr: "Brüt Fazla Mesai = Saatlik Ücret x Fazla Mesai Saati x Katsayı", en: "Gross Overtime = Hourly Wage x Overtime Hours x Multiplier" },
                exampleCalculation: { tr: "40.000 TL maaş, 45 saat/hafta ve 10 saat mesai için 1,5 katsayıyla yaklaşık 3.076,92 TL brüt mesai çıkar.", en: "40,000 salary, 45 hours/week, and 10 overtime hours at 1.5 multiplier gives about 3,076.92 gross overtime." },
                miniGuide: { tr: "Kesin bordro sonucu için gelir vergisi, SGK ve iş sözleşmesi detaylarını ayrıca kontrol edin.", en: "For exact payroll, also check income tax, SGK, and employment contract details." },
            },
        },
    },
    {
        id: "estimated-retirement-pension",
        slug: "emeklilik-maasi-tahmini-hesaplama",
        category: "maas-ve-vergi",
        updatedAt: "2026-05-01",
        name: { tr: "Emeklilik Maaşı Tahmini Hesaplama", en: "Estimated Retirement Pension Calculator" },
        h1: { tr: "Emeklilik Maaşı Tahmini Hesaplama - Aylık Bağlama Oranı Senaryosu", en: "Estimated Retirement Pension Calculator - Replacement Rate Scenario" },
        description: { tr: "Ortalama prime esas kazanç, tahmini aylık bağlama oranı ve ek bireysel emeklilik geliriyle yaklaşık emeklilik maaşı senaryosu oluşturun.", en: "Build an estimated pension scenario using average earnings base, replacement-rate assumption, and additional private pension income." },
        shortDescription: { tr: "Emeklilik maaşı için resmi olmayan, varsayıma dayalı bir ön tahmin oluşturun.", en: "Create a non-official assumption-based pension estimate." },
        relatedCalculators: ["emeklilik-hesaplama", "maas-hesaplama", "sgk-primi-hesaplama", "net-gelir-hesaplama", "finansal-ozgurluk-hesaplama"],
        inputs: [
            { id: "averageEarnings", name: { tr: "Ortalama Aylık Kazanç Varsayımı", en: "Average Monthly Earnings Assumption" }, type: "number", defaultValue: 50000, suffix: " ₺", min: 0, required: true },
            { id: "replacementRate", name: { tr: "Aylık Bağlama Oranı Varsayımı", en: "Replacement Rate Assumption" }, type: "number", defaultValue: 35, suffix: " %", min: 0, max: 100, step: 0.1 },
            { id: "additionalPension", name: { tr: "Ek BES / Özel Gelir", en: "Additional Private Pension / Income" }, type: "number", defaultValue: 5000, suffix: " ₺", min: 0 },
            { id: "deductionRate", name: { tr: "Kesinti / Vergi Varsayımı", en: "Deduction / Tax Assumption" }, type: "number", defaultValue: 0, suffix: " %", min: 0, max: 100, step: 0.1 },
        ],
        results: [
            { id: "grossEstimatedPension", label: { tr: "Tahmini Brüt Emekli Aylığı", en: "Estimated Gross Pension" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "netEstimatedPension", label: { tr: "Tahmini Net Aylık Gelir", en: "Estimated Net Monthly Income" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "annualPensionIncome", label: { tr: "Tahmini Yıllık Gelir", en: "Estimated Annual Income" }, suffix: " ₺", decimalPlaces: 2 },
            { id: "note", label: { tr: "Uyarı", en: "Note" }, type: "text" },
        ],
        formula: (v) => {
            const averageEarnings = Math.max(0, parseFloat(v.averageEarnings) || 0);
            const replacementRate = Math.min(100, Math.max(0, parseFloat(v.replacementRate) || 0)) / 100;
            const additionalPension = Math.max(0, parseFloat(v.additionalPension) || 0);
            const deductionRate = Math.min(100, Math.max(0, parseFloat(v.deductionRate) || 0)) / 100;
            const grossEstimatedPension = averageEarnings * replacementRate;
            const netEstimatedPension = grossEstimatedPension * (1 - deductionRate) + additionalPension;
            const annualPensionIncome = netEstimatedPension * 12;
            const note = {
                tr: "Bu resmi SGK hesabı değildir; yalnız kullanıcı varsayımlarına dayalı emeklilik geliri senaryosudur.",
                en: "This is not an official social security calculation; it is an assumption-based retirement income scenario.",
            };
            return { grossEstimatedPension, netEstimatedPension, annualPensionIncome, note };
        },
        seo: {
            title: { tr: "Emeklilik Maaşı Tahmini Hesaplama 2026 - Aylık Gelir Senaryosu", en: "Estimated Retirement Pension Calculator 2026 - Monthly Income Scenario" },
            metaDescription: { tr: "Emeklilik maaşı tahmini hesaplama aracıyla ortalama kazanç, aylık bağlama oranı varsayımı ve ek gelirleri girerek yaklaşık aylık/yıllık gelir senaryosu oluşturun.", en: "Estimate monthly and annual retirement income using average earnings, replacement-rate assumption, and additional private income." },
            content: { tr: "Emeklilik maaşı tahmini hesaplama, resmi SGK aylık bağlama hesabı değildir. Kullanıcının girdiği ortalama kazanç ve aylık bağlama oranı varsayımıyla kabaca gelir senaryosu üretir. Formül: Tahmini Brüt Aylık = Ortalama Aylık Kazanç x Aylık Bağlama Oranı. Örnek hesaplama: 50.000 TL ortalama kazanç ve %35 varsayım ile tahmini brüt aylık 17.500 TL olur. 5.000 TL ek BES geliri eklenirse kesinti yok varsayımında toplam aylık gelir 22.500 TL görünür. Resmi sonuç için e-Devlet/SGK kayıtları, prim günleri, sigorta başlangıcı ve mevzuat esas alınmalıdır.", en: "Estimated pension calculation is not an official social security calculation. It creates a rough income scenario from user-entered average earnings and replacement-rate assumption. Formula: Estimated Gross Pension = Average Monthly Earnings x Replacement Rate. Official results depend on social security records and legislation." },
            faq: [
                faqEntry("Bu araç resmi emeklilik maaşı hesaplar mı?", "Hayır. Resmi SGK hesabı değildir; yalnız kullanıcının girdiği varsayımlarla ön senaryo üretir.", "Does this calculate official pension?", "No. It is not an official social security calculation; it only builds a user-assumption scenario."),
                faqEntry("Aylık bağlama oranını neden kendim giriyorum?", "Aylık bağlama oranı sigorta başlangıcı, prim günleri, kazanç geçmişi ve mevzuat dönemlerine göre değişebilir. Doğrulanmamış tek oran sabitlenmez.", "Why do I enter replacement rate?", "Replacement rate can vary by start date, premium days, earnings history, and law periods. A single unverified rate is not hardcoded."),
                faqEntry("Ek BES geliri nasıl kullanılır?", "Bireysel emeklilik veya özel gelir tahmininizi aylık tutar olarak girerek toplam emeklilik gelirine ekleyebilirsiniz.", "How is private pension income used?", "Enter your private pension or other income estimate as a monthly amount to add it to total retirement income."),
                faqEntry("Kesinti varsayımı ne anlama gelir?", "Tahmini brüt emekli aylığından düşmesini beklediğiniz kesinti veya vergi oranını temsil eder. Kesin oran mevzuat ve kişisel duruma göre değişebilir.", "What does deduction assumption mean?", "It represents a possible deduction or tax rate from estimated gross pension. The exact rate can vary by rules and personal status."),
                faqEntry("Emeklilik yaşı ve EYT için hangi araç kullanılmalı?", "Ne zaman emekli olurum, yaş ve prim günü kontrolü için emeklilik hesaplama aracıyla birlikte değerlendirme yapılmalıdır.", "Which tool should be used for retirement age and EYT?", "Use the retirement eligibility calculator for age and premium-day checks alongside this income estimate."),
            ],
            richContent: {
                howItWorks: { tr: "Ortalama kazancı aylık bağlama oranı varsayımıyla çarpar, kesinti ve ek özel gelirleri ekleyerek aylık/yıllık gelir senaryosu üretir.", en: "It multiplies average earnings by replacement-rate assumption, then adds deductions and private income to create monthly/annual scenarios." },
                formulaText: { tr: "Tahmini Brüt Aylık = Ortalama Aylık Kazanç x Aylık Bağlama Oranı", en: "Estimated Gross Pension = Average Monthly Earnings x Replacement Rate" },
                exampleCalculation: { tr: "50.000 TL kazanç ve %35 oran varsayımıyla brüt aylık 17.500 TL; 5.000 TL ek gelirle toplam 22.500 TL olur.", en: "50,000 earnings and 35% assumption gives 17,500 gross; with 5,000 additional income, total is 22,500." },
                miniGuide: { tr: "Bu sayfayı emeklilik yaşı, SGK primi ve finansal özgürlük araçlarıyla birlikte kullanarak gelir açığını analiz edin.", en: "Use it with retirement age, premium, and financial freedom tools to analyze income gaps." },
            },
        },
    },
];
