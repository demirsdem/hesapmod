import type { CalculatorRuntimeMap } from "@/lib/calculator-types";
import { getInflationIndex, getTurkishInflationIndex } from "@/lib/data/inflationData";

export const formulas: CalculatorRuntimeMap = {
    "maas-hesaplama": (v) => {
            // ─── 2026 SABİTLERİ ────────────────────────────────────────
            const MIN_WAGE_GROSS = 33030;   // Asgari ücret brüt (2026)
            const SGK_RATE = 0.14;    // %14 SGK işçi payı
            const UNEMP_RATE = 0.01;    // %1 işsizlik sigortası
            const STAMP_RATE = 0.00759; // %0,759 damga vergisi

            // 2026 gelir vergisi dilimleri
            const TAX_BRACKETS = [
                { limit: 190000, rate: 0.15 },
                { limit: 400000, rate: 0.20 },
                { limit: 1500000, rate: 0.27 },
                { limit: 5300000, rate: 0.35 },
                { limit: Infinity, rate: 0.40 },
            ];

            // Yıllık kümülatif gelir vergisi hesabı
            function calcAnnualTax(annualBase: number): number {
                let tax = 0, prev = 0;
                for (const b of TAX_BRACKETS) {
                    if (annualBase <= prev) break;
                    tax += (Math.min(annualBase, b.limit) - prev) * b.rate;
                    prev = b.limit;
                }
                return tax;
            }

            // ─── BRÜTTEN NETE ─────────────────────────────────────────
            function grossToNet(gross: number) {
                const sgkWorker = gross * SGK_RATE;
                const unemployment = gross * UNEMP_RATE;
                const taxBase = gross - sgkWorker - unemployment;

                // Asgari ücret gelir vergisi istisnası
                const minWageTaxBase = MIN_WAGE_GROSS * (1 - SGK_RATE - UNEMP_RATE);
                const annualTax = calcAnnualTax(taxBase * 12);
                const minWageTax = calcAnnualTax(minWageTaxBase * 12);
                const monthlyIncomeTax = Math.max(0, (annualTax - minWageTax) / 12);

                // Damga vergisi: asgari ücrete kadar muaf
                const stampTax = gross <= MIN_WAGE_GROSS
                    ? 0
                    : Math.max(0, gross - MIN_WAGE_GROSS) * STAMP_RATE;

                const totalDeduction = sgkWorker + unemployment + monthlyIncomeTax + stampTax;
                const netSalary = gross - totalDeduction;

                return {
                    grossSalary: gross,
                    sgkWorker,
                    unemployment,
                    incomeTax: monthlyIncomeTax,
                    stampTax,
                    totalDeduction,
                    netSalary,
                    chart: {
                        segments: [
                            { label: { tr: "Net Maaş", en: "Net Salary" }, value: netSalary, colorClass: "bg-[#22c55e]", colorHex: "#22c55e" },
                            { label: { tr: "Kesintiler (SGK & Vergi)", en: "Deductions (Tax & SGK)" }, value: totalDeduction, colorClass: "bg-destructive", colorHex: "hsl(var(--destructive))" }
                        ]
                    }
                };
            }

            // ─── NETTEN BRÜTE (binary search) ─────────────────────────
            function netToGross(targetNet: number) {
                let lo = targetNet, hi = targetNet * 2.5;
                for (let i = 0; i < 60; i++) {
                    const mid = (lo + hi) / 2;
                    if (grossToNet(mid).netSalary < targetNet) lo = mid; else hi = mid;
                }
                return grossToNet((lo + hi) / 2);
            }

            const amount = parseFloat(v.salary) || 0;
            return v.calcType === "netToGross" ? netToGross(amount) : grossToNet(amount);
        },
    "kidem-tazminati-hesaplama": (v) => {
            // Resmi ÇSGB tablosuna göre 01.01.2026-30.06.2026 dönemi kıdem tazminatı tavanı
            const CEILING_2026 = 64948.77;
            const STAMP_RATE = 0.00759;
            const gross = parseFloat(v.grossSalary) || 0;
            const years = parseFloat(v.years) || 0;
            const months = parseFloat(v.months) || 0;
            const totalMonths = years * 12 + months;
            const baseSalary = Math.min(gross, CEILING_2026);
            if (totalMonths < 12) {
                return { baseSalary, totalMonths, grossAmount: 0, stampTax: 0, netAmount: 0 };
            }
            const grossAmount = baseSalary * (totalMonths / 12);
            const stampTax = grossAmount * STAMP_RATE;
            const netAmount = grossAmount - stampTax;
            return { baseSalary, totalMonths, grossAmount, stampTax, netAmount };
        },
    "ihbar-tazminati-hesaplama": (v) => {
            const monthly = parseFloat(v.grossSalary) || 0;
            const years = parseFloat(v.years) || 0;
            const incomeTaxRate = (parseFloat(v.taxRate) || 15) / 100;
            // İş Kanunu 17. madde ihbar süreleri
            let noticeDays = 0;
            if (years < 0.5) noticeDays = 14;
            else if (years < 1.5) noticeDays = 28;
            else if (years <= 3) noticeDays = 42;
            else noticeDays = 56;
            const dailySalary = monthly / 30;
            const grossAmount = dailySalary * noticeDays;
            const incomeTax = grossAmount * incomeTaxRate;
            const stampTax = grossAmount * 0.00759;
            const netAmount = grossAmount - incomeTax - stampTax;
            return { noticeDays, dailySalary, grossAmount, incomeTax, stampTax, netAmount };
        },
    "asgari-ucret-hesaplama": (v) => {
            const DATA: Record<string, { gross: number; net: number }> = {
                jan2026: { gross: 33030.00, net: 28075.50 },
                jul2026: { gross: 36000.00, net: 30600.00 }, // tahmini
            };
            const d = DATA[v.period] ?? DATA.jan2026;
            const sgkEmployee = d.gross * 0.14;
            const unemploy = d.gross * 0.01;
            const sgkEmployer = d.gross * 0.155;
            const totalCost = d.gross + sgkEmployer;
            return { gross: d.gross, sgkEmployee, unemploy, net: d.net, sgkEmployer, totalCost };
        },
    "harcirah-yolluk-hesaplama": (v) => {
            const dr = parseFloat(v.dailyRate) || 0;
            const d = parseFloat(v.days) || 0;
            const dist = parseFloat(v.distance) || 0;
            const t = parseFloat(v.transport) || 0;
            const totalDaily = dr * d;
            const roundTripDistance = dist * 2;
            const totalAllowance = totalDaily + t;
            const calculationNote = {
                tr: "Bu araç, kurumunuzun gündelik tutarı ile girilen yol ücretini toplayarak ön hesap üretir. Kadro derecesi, konaklama artışı, özel araç kullanımı veya kurum içi tarifeler ayrıca sonucu değiştirebilir.",
                en: "This tool produces a planning estimate by adding your institution's daily allowance to the transport cost you enter. Grade, lodging supplements, private-car use, or institution-specific rules can change the final amount.",
            };
            return { totalDaily, roundTripDistance, totalAllowance, calculationNote };
        },
    "damga-vergisi-hesaplama": (v) => {
            const rates: Record<string, number> = { kira: 1.89, hizmet: 9.48, taahhut: 9.48, ihale: 5.69, sozlesme: 9.48 };
            const rate = rates[v.docType] || 9.48;
            const amount = parseFloat(v.amount) || 0;
            const maximumPerDocument = 29115961.10;
            const rawStampDuty = amount * (rate / 1000);
            const stampDuty = Math.min(rawStampDuty, maximumPerDocument);
            const calculationNote = rawStampDuty > maximumPerDocument
                ? {
                    tr: "Hesaplanan damga vergisi 2026 için belge başına azami 29.115.961,10 TL sınırını aştığı için sonuç üst sınırda gösterildi.",
                    en: "The calculated stamp duty exceeded the 2026 per-document cap of TRY 29,115,961.10, so the result was capped.",
                }
                : {
                    tr: "Sonuç, seçilen belge türü için 2026 oranı üzerinden hesaplandı. İstisna, muafiyet veya özel hüküm varsa nihai tutar değişebilir.",
                    en: "The result was calculated using the 2026 rate for the selected document type. Exemptions or special rules may change the final amount.",
                };
            return { rate, stampDuty, maximumPerDocument, calculationNote };
        },
    "kdv-tevkifati-hesaplama": (v) => {
            const net = parseFloat(v.netAmount) || 0;
            const kdvRate = parseFloat(v.kdvRate) / 100;
            const [num, den] = v.withholdingRate.split("/").map(Number);
            const ratio = den > 0 ? num / den : 0;
            const totalKdv = net * kdvRate;
            const buyerKdv = totalKdv * ratio;
            const sellerKdv = totalKdv - buyerKdv;
            const payableToSeller = net + sellerKdv;
            const ratioNotes: Record<string, { tr: string; en: string }> = {
                "2/10": {
                    tr: "2/10 oranı, GİB'in güncel yardımcı tablosunda yük taşımacılığı hizmeti ve bazı diğer teslimler için görülen oranlardan biridir. İşlem türü ile alıcı statüsünü ayrıca doğrulayın.",
                    en: "The 2/10 ratio appears in the current GIB guidance table for freight transport and certain other deliveries. Verify the transaction type and buyer status separately.",
                },
                "3/10": {
                    tr: "3/10 oranı, GİB'in güncel yardımcı tablosunda ticari reklam hizmetleri için öne çıkan orandır. İşlemin gerçekten bu kapsama girip girmediği teyit edilmelidir.",
                    en: "The 3/10 ratio is the highlighted rate for commercial advertising services in the current GIB guidance table. Confirm that the transaction truly falls within that scope.",
                },
                "4/10": {
                    tr: "4/10 oranı, yapım işleri ile bu işlerle birlikte ifa edilen mühendislik, mimarlık ve etüt-proje hizmetlerinde öne çıkar. Sözleşme kapsamı ve işin niteliği önemlidir.",
                    en: "The 4/10 ratio is commonly used for construction works and related engineering, architecture, and survey-project services. Contract scope and the nature of the work matter.",
                },
                "5/10": {
                    tr: "5/10 oranı, yemek servis ve organizasyon, servis taşımacılığı, diğer hizmetler ve demir-çelik ürün teslimi gibi başlıklarda görülebilir. Özellikle demir-çelikte güncel kod listesiyle teyit etmek gerekir.",
                    en: "The 5/10 ratio appears in areas such as catering/organization, shuttle transport, other services, and steel-product deliveries. For steel in particular, confirm against the latest code list.",
                },
                "7/10": {
                    tr: "7/10 oranı; bakım-onarım, fason tekstil/konfeksiyon işleri, baskı-basım ve bazı teslim başlıklarında görülen yaygın oranlardan biridir. Aynı sektörde farklı alt işlemler farklı oran taşıyabilir.",
                    en: "The 7/10 ratio is common in maintenance-repair, contract textile/apparel work, printing, and certain deliveries. Different sub-transactions within the same sector may still carry different rates.",
                },
                "9/10": {
                    tr: "9/10 oranı; danışmanlık, işgücü temini, yapı denetim, temizlik ve benzeri hizmetlerde sık görülen yüksek tevkifat oranıdır. İşlem türünü KDV Genel Uygulama Tebliği'nden kontrol edin.",
                    en: "The 9/10 ratio is the high withholding rate commonly used for consulting, labor supply, building inspection, cleaning, and similar services. Check the transaction type against the VAT General Application Communiqué.",
                },
                "10/10": {
                    tr: "10/10 seçimi, isteğe bağlı tam tevkifat ön hesabı içindir. Bu senaryoda satıcı KDV tahsil etmez; uygulamanın sözleşme ve vergi dairesine ön bildirim koşulları ayrıca kontrol edilmelidir.",
                    en: "The 10/10 option is for optional full withholding estimates. In that case the seller does not collect VAT; contractual and pre-notification requirements should be checked separately.",
                },
            };
            const calculationNote = ratioNotes[v.withholdingRate] ?? {
                tr: "Seçilen oran üzerinden alıcı ve satıcı KDV payları ayrıştırıldı. Nihai oran için işlem türü ve alıcı statüsü teyit edilmelidir.",
                en: "Buyer and seller VAT shares were split using the selected ratio. Confirm the final ratio based on transaction type and buyer status.",
            };
            return { totalKdv, buyerKdv, sellerKdv, payableToSeller, grandTotal: net + totalKdv, calculationNote };
        },
    "kurumlar-vergisi-hesaplama": (v) => {
            const profit = parseFloat(v.profit) || 0;
            const corporateTax = profit * 0.25;
            const provisionalTax = (profit / 4) * 0.25;
            return { corporateTax, provisionalTax, netProfit: profit - corporateTax };
        },
    "gelir-vergisi-hesaplama": (v) => {
            const income = parseFloat(v.income) || 0;
            const brackets = [{ limit: 190000, rate: 0.15 }, { limit: 400000, rate: 0.20 }, { limit: 1500000, rate: 0.27 }, { limit: 5300000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }];
            let tax = 0, prev = 0;
            for (const b of brackets) { if (income <= prev) break; tax += (Math.min(income, b.limit) - prev) * b.rate; prev = b.limit; }
            const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
            return { totalTax: tax, effectiveRate, netIncome: income - tax };
        },
    "kira-vergisi-hesaplama": (v) => {
            const rent = parseFloat(v.annualRent) || 0;
            const EXEMPTION = v.applyExemption ? 47000 : 0;
            const taxableRentAfterExemption = Math.max(0, rent - EXEMPTION);
            const deductibleExpense = v.expenseMethod === "goturu"
                ? taxableRentAfterExemption * 0.15
                : (() => {
                    const actualExpense = parseFloat(v.actualExpense) || 0;
                    if (rent <= 0 || EXEMPTION <= 0) return actualExpense;
                    return actualExpense * (taxableRentAfterExemption / rent);
                })();
            const taxBase = Math.max(0, taxableRentAfterExemption - deductibleExpense);
            const brackets = [
                { limit: 158000, rate: 0.15 },
                { limit: 330000, rate: 0.20 },
                { limit: 800000, rate: 0.27 },
                { limit: 4300000, rate: 0.35 },
                { limit: Infinity, rate: 0.40 }
            ];
            let tax = 0, prev = 0;
            for (const b of brackets) { if (taxBase <= prev) break; tax += (Math.min(taxBase, b.limit) - prev) * b.rate; prev = b.limit; }
            return { exemption: EXEMPTION, deductibleExpense, taxBase, incomeTax: tax };
        },
    "kira-stopaj-hesaplama": (v) => {
            const amount = parseFloat(v.monthlyRent) || 0;
            const rate = 0.20;
            const grossRent = v.basis === "net" ? amount / (1 - rate) : amount;
            const withholdingTax = grossRent * rate;
            const netPayment = v.basis === "net" ? amount : grossRent - withholdingTax;
            return {
                grossRent,
                withholdingTax,
                netPayment,
                totalCashOutflow: grossRent,
                annualWithholding: withholdingTax * 12
            };
        },
    "emlak-vergisi-hesaplama": (v) => {
            const propertyTaxRates: Record<string, number> = {
                konut_metro: 0.002,
                konut_diger: 0.001,
                isyeri_metro: 0.004,
                isyeri_diger: 0.002,
                arsa_metro: 0.006,
                arsa_diger: 0.003,
                arazi_metro: 0.002,
                arazi_diger: 0.001,
            };
            const rate = propertyTaxRates[v.propertyType] ?? propertyTaxRates.konut_metro;
            const value = parseFloat(v.value) || 0;
            const annualTax = value * rate;
            return { annualTax, installment: annualTax / 2 };
        },
    "konaklama-vergisi-hesaplama": (v) => {
            const price = parseFloat(v.price) || 0;
            const nights = parseFloat(v.nights) || 1;
            const baseTotal = price * nights;
            const accomTax = baseTotal * 0.02;
            const kdv = baseTotal * 0.10;
            return { baseTotal, accomTax, kdv, grandTotal: baseTotal + accomTax + kdv };
        },
    "kambiyo-vergisi-hesaplama": (v) => {
            const amount = parseFloat(v.amount) || 0;
            const rates: Record<string, number> = { doviz: 2, kaydi_kiymetli_maden: 2 };
            const rate = rates[v.transType] || 2;
            const taxAmount = amount * (rate / 1000);
            const calculationNote = v.transType === "kaydi_kiymetli_maden"
                ? {
                    tr: "15 Mart 2025 tarihli 9595 sayılı Karar sonrasında fiziki teslimat olmaksızın yapılan kaydi kıymetli maden depo hesabı işlemleri kambiyo işlemi sayılır. Bu araç, bu kapsam için binde 2 BSMV ön hesabı üretir.",
                    en: "After Decision No. 9595 dated March 15, 2025, book-entry precious-metal deposit account transactions without physical delivery are treated as exchange transactions. This tool estimates BSMV at 2 per thousand for that scope.",
                }
                : {
                    tr: "Genel döviz alım işlemlerinde 30 Eylül 2020 tarihli 3031 sayılı Kararla yeniden binde 2'ye indirilen kambiyo BSMV oranı esas alındı. 15 Mart 2026 itibarıyla daha yeni bir genel oran değişikliği bulunmadığı varsayıldı.",
                    en: "For general FX purchases, the exchange BSMV rate reduced back to 2 per thousand by Decision No. 3031 dated September 30, 2020 was used. It is assumed that no later general rate change was in force as of March 15, 2026.",
                };
            return { appliedRate: rate, taxAmount, totalCost: amount + taxAmount, calculationNote };
        },
    "gumruk-vergisi-hesaplama": (v) => {
            const rates: Record<string, number> = { elektronik: 20, giyim: 12, kozmetik: 20, kitap: 0, gida: 25 };
            const dutyRate = rates[v.category] || 20;
            const value = parseFloat(v.value) || 0;
            const duty = value * (dutyRate / 100);
            const kdv = (value + duty) * 0.20;
            return { duty, kdv, total: value + duty + kdv };
        },
    "deger-artis-kazanci-vergisi": (v) => {
            const propertyGainTaxRules = {
                2025: {
                    exemption: 120000,
                    label: {
                        tr: "2025 takvim yılı gelirleri / 2026 beyan dönemi",
                        en: "2025 income / 2026 filing season",
                    },
                    brackets: [
                        { limit: 158000, rate: 0.15 },
                        { limit: 330000, rate: 0.20 },
                        { limit: 800000, rate: 0.27 },
                        { limit: 4300000, rate: 0.35 },
                        { limit: Infinity, rate: 0.40 },
                    ],
                },
                2026: {
                    exemption: 150000,
                    label: {
                        tr: "2026 takvim yılı gelirleri",
                        en: "2026 income year",
                    },
                    brackets: [
                        { limit: 190000, rate: 0.15 },
                        { limit: 400000, rate: 0.20 },
                        { limit: 1000000, rate: 0.27 },
                        { limit: 5300000, rate: 0.35 },
                        { limit: Infinity, rate: 0.40 },
                    ],
                },
            } as const;
            const parseDate = (value: string | undefined) => {
                if (!value) return null;
                const [yearText, monthText, dayText] = value.split("-");
                const year = Number(yearText);
                const month = Number(monthText);
                const day = Number(dayText);
                if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
                    return null;
                }
                const date = new Date(year, month - 1, day);
                if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                    return null;
                }
                return { year, month, day };
            };
            const getCompletedYearsBetween = (
                start: { year: number; month: number; day: number },
                end: { year: number; month: number; day: number }
            ) => {
                let years = end.year - start.year;
                if (end.month < start.month || (end.month === start.month && end.day < start.day)) {
                    years -= 1;
                }
                return Math.max(years, 0);
            };
            const getPreviousMonthReference = (year: number, month: number) => {
                if (year < 2020 || (year === 2020 && month <= 1)) {
                    return { year: 2020, month: 1 };
                }
                if (month === 1) {
                    return { year: year - 1, month: 12 };
                }
                return { year, month: month - 1 };
            };
            const calculateProgressiveTax = (
                taxBase: number,
                brackets: ReadonlyArray<{ limit: number; rate: number }>
            ) => {
                let tax = 0;
                let previousLimit = 0;
                for (const bracket of brackets) {
                    if (taxBase <= previousLimit) break;
                    tax += (Math.min(taxBase, bracket.limit) - previousLimit) * bracket.rate;
                    previousLimit = bracket.limit;
                }
                return tax;
            };
            const getRuleYear = (saleYear: number): 2025 | 2026 => (saleYear >= 2026 ? 2026 : 2025);
            const buy = parseFloat(v.buyPrice) || 0;
            const sell = parseFloat(v.sellPrice) || 0;
            const buyDate = parseDate(v.buyDate);
            const sellDate = parseDate(v.sellDate);

            if (buy <= 0 || sell <= 0 || !buyDate || !sellDate) {
                return {
                    nominalGain: 0,
                    adjustedCost: 0,
                    indexationRate: 0,
                    grossGain: 0,
                    exemption: 0,
                    taxableGain: 0,
                    tax: 0,
                    calculationNote: {
                        tr: "Lütfen alış bedeli, satış bedeli ve geçerli tarih alanlarını doldurun.",
                        en: "Please provide the purchase price, sale price, and valid dates.",
                    },
                };
            }

            const isInvalidDateRange = sellDate.year < buyDate.year
                || (sellDate.year === buyDate.year && sellDate.month < buyDate.month)
                || (sellDate.year === buyDate.year && sellDate.month === buyDate.month && sellDate.day < buyDate.day);

            if (isInvalidDateRange) {
                return {
                    nominalGain: 0,
                    adjustedCost: 0,
                    indexationRate: 0,
                    grossGain: 0,
                    exemption: 0,
                    taxableGain: 0,
                    tax: 0,
                    calculationNote: {
                        tr: "Satış tarihi, iktisap tarihinden önce olamaz.",
                        en: "The sale date cannot be earlier than the acquisition date.",
                    },
                };
            }

            const completedYears = getCompletedYearsBetween(buyDate, sellDate);
            const exemptByHoldingPeriod = completedYears >= 5;
            const ruleYear = getRuleYear(sellDate.year);
            const ruleSet = propertyGainTaxRules[ruleYear];
            const buyIndexRef = getPreviousMonthReference(buyDate.year, buyDate.month);
            const sellIndexRef = getPreviousMonthReference(sellDate.year, sellDate.month);
            const startIndex = getTurkishInflationIndex("yi-ufe", buyIndexRef.year, buyIndexRef.month);
            const endIndex = getTurkishInflationIndex("yi-ufe", sellIndexRef.year, sellIndexRef.month);
            const indexationRate = startIndex > 0 ? (endIndex / startIndex) - 1 : 0;
            const applyIndexation = !exemptByHoldingPeriod && indexationRate >= 0.10;
            const adjustedCost = buy * (applyIndexation ? (1 + indexationRate) : 1);
            const nominalGain = Math.max(0, sell - buy);
            const grossGain = Math.max(0, sell - adjustedCost);
            const taxableGain = exemptByHoldingPeriod ? 0 : Math.max(0, grossGain - ruleSet.exemption);
            const tax = exemptByHoldingPeriod ? 0 : calculateProgressiveTax(taxableGain, ruleSet.brackets);

            const note = exemptByHoldingPeriod
                ? {
                    tr: `İktisap tarihinden satış tarihine kadar ${completedYears} tam yıl dolduğu için bu taşınmaz satışı bu araçta gelir vergisine tabi gösterilmedi.`,
                    en: `Because ${completedYears} full years have elapsed between acquisition and sale, this property sale is treated as outside the income-tax scope in this estimate.`,
                }
                : taxableGain <= 0
                    ? {
                        tr: `${ruleSet.label.tr} esas alındı. Yİ-ÜFE artışı %${(indexationRate * 100).toFixed(2)} ${applyIndexation ? "olduğu için endeksleme uygulandı" : "olsa da vergi doğuracak matrah çıkmadı"}; sonuçta istisna sonrası vergiye tabi tutar oluşmadı.`,
                        en: `${ruleSet.label.en} was used. The PPI increase is ${(indexationRate * 100).toFixed(2)}%, and after indexation/exemption no taxable base remains.`,
                    }
                    : {
                        tr: `${ruleSet.label.tr} esas alındı. Yİ-ÜFE artışı %${(indexationRate * 100).toFixed(2)} olduğu için ${applyIndexation ? "alış bedeline endeksleme uygulandı" : "endeksleme eşiği aşılmadığından alış bedeli nominal bırakıldı"} ve ${ruleSet.exemption.toLocaleString("tr-TR")} TL istisna sonrası matrah üzerinden vergi hesaplandı.`,
                        en: `${ruleSet.label.en} was applied. The PPI increase is ${(indexationRate * 100).toFixed(2)}%, so ${applyIndexation ? "the purchase cost was indexed" : "indexation was not applied because the threshold was not met"}, and tax was computed on the remaining base after the ${ruleSet.exemption.toLocaleString("en-US")} TRY exemption.`,
                    };

            return {
                nominalGain,
                adjustedCost,
                indexationRate: indexationRate * 100,
                grossGain,
                exemption: exemptByHoldingPeriod ? 0 : ruleSet.exemption,
                taxableGain,
                tax,
                calculationNote: note,
            };
        },
    "degerli-konut-vergisi-hesaplama": (v) => {
            const val = parseFloat(v.value) || 0;
            const T1 = 17711000;
            const T2 = 26567000;
            const T3 = 35425000;
            if (val <= T1) return { taxBase: 0, annualTax: 0 };
            let tax = 0;
            if (val <= T2) { tax = (val - T1) * 0.003; }
            else if (val <= T3) { tax = 26568 + (val - T2) * 0.006; }
            else { tax = 79716 + (val - T3) * 0.010; }
            return { taxBase: val - T1, annualTax: tax };
        },
    "veraset-intikal-vergisi-hesaplama": (v) => {
            const val = parseFloat(v.assetValue) || 0;
            const isMiras = v.transferType === "miras";
            const inheritanceStatus = v.inheritanceStatus === "es_tek_basina" ? "es_tek_basina" : "es_veya_cocuk";
            const EXEMPTION = isMiras
                ? (inheritanceStatus === "es_tek_basina" ? 5817845 : 2907136)
                : 66935;
            const taxBase = Math.max(0, val - EXEMPTION);
            const mirasBn = [
                { l: 3000000, r: 0.01 },
                { l: 10000000, r: 0.03 },
                { l: 25000000, r: 0.05 },
                { l: 55000000, r: 0.07 },
                { l: Infinity, r: 0.10 }
            ];
            const bagisBn = [
                { l: 3000000, r: 0.10 },
                { l: 10000000, r: 0.15 },
                { l: 25000000, r: 0.20 },
                { l: 55000000, r: 0.25 },
                { l: Infinity, r: 0.30 }
            ];
            const brackets = isMiras ? mirasBn : bagisBn;
            let tax = 0, prev = 0;
            for (const b of brackets) { if (taxBase <= prev) break; tax += (Math.min(taxBase, b.l) - prev) * b.r; prev = b.l; }
            const calculationNote = isMiras
                ? inheritanceStatus === "es_tek_basina"
                    ? {
                        tr: "1 Ocak 2026 itibarıyla füruğ bulunmayan eşe isabet eden miras hissesi için 5.817.845 TL istisna esas alındı.",
                        en: "The 5,817,845 TRY exemption for the surviving spouse without descendants, effective January 1, 2026, was applied.",
                    }
                    : {
                        tr: "1 Ocak 2026 itibarıyla eşe, çocuklara veya füruğa isabet eden her bir miras hissesi için 2.907.136 TL istisna esas alındı.",
                        en: "The 2,907,136 TRY exemption for each spouse, child, or descendant share, effective January 1, 2026, was applied.",
                    }
                : {
                    tr: "1 Ocak 2026 itibarıyla ivazsız intikallerde 66.935 TL istisna ve %10-%30 arası tarife esas alındı.",
                    en: "The 66,935 TRY exemption and the 10%-30% tariff for gratuitous transfers effective January 1, 2026, were applied.",
                };
            return { exemption: EXEMPTION, taxBase, tax, calculationNote };
        },
    "vergi-gecikme-faizi-hesaplama": (v) => {
            const debt = parseFloat(v.taxDebt) || 0;
            const days = parseFloat(v.delayDays) || 0;
            const isTecil = v.chargeType === "tecil_faizi";
            const monthlyDelayRate = 0.037;
            const annualDeferralRate = 0.39;
            const appliedRate = isTecil ? annualDeferralRate * 100 : monthlyDelayRate * 100;
            const interestAmount = isTecil
                ? debt * annualDeferralRate * (days / 365)
                : debt * (monthlyDelayRate / 30) * days;
            const calculationNote = isTecil
                ? {
                    tr: "Tecil faizinde 13 Kasım 2025 itibarıyla geçerli yıllık %39 oranı, gün esaslı yaklaşık hesapla kullanıldı.",
                    en: "For deferral interest, the annual 39% rate effective as of November 13, 2025 was used with an approximate day-based calculation.",
                }
                : {
                    tr: "Gecikme zammında 13 Kasım 2025 itibarıyla geçerli aylık %3,7 oranı kullanıldı; ay kesirleri için günlük yaklaşık hesap yapıldı.",
                    en: "For delay surcharge, the monthly 3.7% rate effective as of November 13, 2025 was used; daily approximation was applied for fractional months.",
                };
            return { appliedRate, interestAmount, totalPayable: debt + interestAmount, calculationNote };
        },
    "ek-ders-ucreti-hesaplama": (v) => {
            const katsayilar: Record<string, number> = { kadrolu: 105, sozlesmeli: 100, ucretli: 90 };
            const saat = Number(v.saat) || 0;
            const ogretmenTuru = typeof v.ogretmenTuru === 'string' && katsayilar[v.ogretmenTuru] ? v.ogretmenTuru : 'kadrolu';
            let brutUcret = katsayilar[ogretmenTuru] * saat;
            if (v.egitim === "yuksek") brutUcret *= 1.07;
            const kesinti = brutUcret * 0.15;
            const netUcret = brutUcret - kesinti;
            return { brutUcret, kesinti, netUcret };
        },
};
