export type LgsTestKey = "turkce" | "matematik" | "fen" | "inkilap" | "din" | "yabanciDil";

export type LgsTestStats = {
    average: number;
    stdDev: number;
    coefficient: number;
    maxQuestions: number;
};

export type LgsYearStats = {
    year: number;
    sourceLabel: string;
    sourceUrl?: string;
    minTasp: number;
    maxTasp: number;
    tests: Record<LgsTestKey, LgsTestStats>;
};

type LgsSubjectInput = {
    correctField: string;
    wrongField: string;
    exemptField?: string;
};

export type LgsSubjectResult = {
    key: LgsTestKey;
    label: string;
    correct: number;
    wrong: number;
    blank: number;
    net: number;
    coefficient: number;
    maxQuestions: number;
    standardScore: number;
    weightedStandardScore: number;
    estimatedImpact: number | null;
    isExempt: boolean;
};

export type LgsPercentileBand = {
    minScore: number;
    maxScore: number;
    minPercentile: number;
    maxPercentile: number;
    rangeLabel: string;
    sourceLabel: string;
};

export type LgsScenarioResult = {
    key: LgsTestKey;
    label: string;
    scenarioLabel: string;
    pointChange: number;
    comment: string;
};

const lgsSubjectInputs: Record<LgsTestKey, LgsSubjectInput> = {
    turkce: { correctField: "turk_d", wrongField: "turk_y" },
    matematik: { correctField: "mat_d", wrongField: "mat_y" },
    fen: { correctField: "fen_d", wrongField: "fen_y" },
    inkilap: { correctField: "ink_d", wrongField: "ink_y" },
    din: { correctField: "din_d", wrongField: "din_y", exemptField: "din_muaf" },
    yabanciDil: { correctField: "dil_d", wrongField: "dil_y", exemptField: "dil_muaf" },
};

const lgsTestKeys = Object.keys(lgsSubjectInputs) as LgsTestKey[];

const lgsTestLabels: Record<LgsTestKey, string> = {
    turkce: "Türkçe",
    matematik: "Matematik",
    fen: "Fen Bilimleri",
    inkilap: "T.C. İnkılap Tarihi",
    din: "Din Kültürü",
    yabanciDil: "Yabancı Dil",
};

const SAYISAL_TEST_KEYS: LgsTestKey[] = ["matematik", "fen"];
const SOZEL_TEST_KEYS: LgsTestKey[] = ["turkce", "inkilap", "din", "yabanciDil"];

export const lgsPercentileBands: LgsPercentileBand[] = [
    {
        minScore: 470,
        maxScore: 500,
        minPercentile: 0.1,
        maxPercentile: 0.5,
        rangeLabel: "%0,1 - %0,5",
        sourceLabel: "2025 LGS taban puan ve yüzdelik eğilimleri referanslı tahmin",
    },
    {
        minScore: 455,
        maxScore: 469.9999,
        minPercentile: 1,
        maxPercentile: 3,
        rangeLabel: "%1 - %3",
        sourceLabel: "2025 LGS taban puan ve yüzdelik eğilimleri referanslı tahmin",
    },
    {
        minScore: 445,
        maxScore: 454.9999,
        minPercentile: 3,
        maxPercentile: 5,
        rangeLabel: "%3 - %5",
        sourceLabel: "2025 LGS taban puan ve yüzdelik eğilimleri referanslı tahmin",
    },
    {
        minScore: 425,
        maxScore: 444.9999,
        minPercentile: 5,
        maxPercentile: 10,
        rangeLabel: "%5 - %10",
        sourceLabel: "2025 LGS taban puan ve yüzdelik eğilimleri referanslı tahmin",
    },
    {
        minScore: 390,
        maxScore: 424.9999,
        minPercentile: 10,
        maxPercentile: 20,
        rangeLabel: "%10 - %20",
        sourceLabel: "2025 LGS taban puan ve yüzdelik eğilimleri referanslı tahmin",
    },
    {
        minScore: 100,
        maxScore: 389.9999,
        minPercentile: 20,
        maxPercentile: 100,
        rangeLabel: "%20 - %100",
        sourceLabel: "2025 LGS taban puan ve yüzdelik eğilimleri referanslı geniş tahmin",
    },
];

export const lgsStatisticsByYear: Record<number, LgsYearStats> = {
    2025: {
        year: 2025,
        sourceLabel: "MEB 2025 merkezi sinav raporu referansli tahmini istatistik seti",
        sourceUrl: "https://odsgm.meb.gov.tr/meb_iys_dosyalar/2025_07/21172430_lgs2025merkezisinavozetrapor1.pdf",
        minTasp: 320.531,
        maxTasp: 1098.8334,
        tests: {
            turkce: { average: 8.4, stdDev: 4.6952, coefficient: 4, maxQuestions: 20 },
            matematik: { average: 5.6, stdDev: 4.9584, coefficient: 4, maxQuestions: 20 },
            fen: { average: 8.8, stdDev: 5.3295, coefficient: 4, maxQuestions: 20 },
            inkilap: { average: 4.9, stdDev: 2.8122, coefficient: 1, maxQuestions: 10 },
            din: { average: 5.9, stdDev: 2.7282, coefficient: 1, maxQuestions: 10 },
            yabanciDil: { average: 4.4, stdDev: 3.3697, coefficient: 1, maxQuestions: 10 },
        },
    },
};

export const latestLgsStatisticsYear = 2025;

function toNumber(value: unknown) {
    const parsed = typeof value === "number" ? value : parseFloat(String(value ?? ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

function readAnswerCounts(values: Record<string, any>, testStats: LgsTestStats, fields: LgsSubjectInput) {
    const correct = Math.min(Math.max(toNumber(values[fields.correctField]), 0), testStats.maxQuestions);
    const requestedWrong = Math.min(Math.max(toNumber(values[fields.wrongField]), 0), testStats.maxQuestions);
    const wrong = Math.min(requestedWrong, Math.max(testStats.maxQuestions - correct, 0));

    return { correct, wrong };
}

function calculateRawScore(correct: number, wrong: number) {
    return correct - wrong / 3;
}

function calculateStandardScore(rawScore: number, stats: LgsTestStats) {
    if (stats.stdDev <= 0) {
        return 50;
    }

    return 10 * ((rawScore - stats.average) / stats.stdDev) + 50;
}

function calculateWeightedStandardScore(rawScore: number, stats: LgsTestStats) {
    return calculateStandardScore(rawScore, stats) * stats.coefficient;
}

function calculateMaxWeightedStandardScore(stats: LgsTestStats) {
    return calculateWeightedStandardScore(stats.maxQuestions, stats);
}

function getLgsYearStats(year: unknown) {
    const requestedYear = Math.trunc(toNumber(year));
    return lgsStatisticsByYear[requestedYear] ?? lgsStatisticsByYear[latestLgsStatisticsYear];
}

function estimateLgsPercentileBand(score: number) {
    return lgsPercentileBands.find((band) => (
        score >= band.minScore && score <= band.maxScore
    )) ?? lgsPercentileBands[lgsPercentileBands.length - 1];
}

function calculateOneNetPointImpact(score: number, stats: LgsTestStats, scorePerTasp: number) {
    if (stats.stdDev <= 0) {
        return 0;
    }

    const weightedDelta = (10 / stats.stdDev) * stats.coefficient;
    const pointDelta = weightedDelta * scorePerTasp;
    return Math.max(0, Math.min(500, score + pointDelta) - Math.min(500, Math.max(100, score)));
}

function buildLgsScenarioResults(
    yearStats: LgsYearStats,
    score: number,
    scorePerTasp: number,
    exemptionFlags: Record<LgsTestKey, boolean>
) {
    const scenarioKeys: LgsTestKey[] = ["matematik", "fen", "turkce", "yabanciDil"];

    return scenarioKeys
        .filter((testKey) => !exemptionFlags[testKey])
        .map((testKey) => {
            const stats = yearStats.tests[testKey];
            const pointChange = calculateOneNetPointImpact(score, stats, scorePerTasp);
            const isHighImpact = stats.coefficient >= 4;

            return {
                key: testKey,
                label: lgsTestLabels[testKey],
                scenarioLabel: `+1 ${lgsTestLabels[testKey]} neti`,
                pointChange,
                comment: isHighImpact ? "Yüksek etki" : "Düşük katsayı",
            };
        });
}

export function calculateLgsScore(values: Record<string, any>) {
    const yearStats = getLgsYearStats(values.lgsYear);
    const rawScores = {} as Record<LgsTestKey, number>;
    const netScores = {} as Record<LgsTestKey, number>;
    const weightedScores = {} as Record<LgsTestKey, number>;
    const answerCounts = {} as Record<LgsTestKey, { correct: number; wrong: number; blank: number }>;
    const exemptionFlags = {} as Record<LgsTestKey, boolean>;
    const exemptTests = new Set<LgsTestKey>();

    for (const testKey of lgsTestKeys) {
        const fields = lgsSubjectInputs[testKey];
        const testStats = yearStats.tests[testKey];
        const isExempt = fields.exemptField ? Boolean(values[fields.exemptField]) : false;
        exemptionFlags[testKey] = isExempt;

        if (isExempt) {
            rawScores[testKey] = 0;
            netScores[testKey] = 0;
            weightedScores[testKey] = 0;
            answerCounts[testKey] = {
                correct: 0,
                wrong: 0,
                blank: testStats.maxQuestions,
            };
            exemptTests.add(testKey);
            continue;
        }

        const { correct, wrong } = readAnswerCounts(values, testStats, fields);
        const blank = Math.max(testStats.maxQuestions - correct - wrong, 0);
        const rawScore = calculateRawScore(correct, wrong);

        rawScores[testKey] = rawScore;
        netScores[testKey] = rawScore;
        weightedScores[testKey] = calculateWeightedStandardScore(rawScore, testStats);
        answerCounts[testKey] = { correct, wrong, blank };
    }

    if (exemptTests.size > 0) {
        const nonExemptKeys = lgsTestKeys.filter((testKey) => !exemptTests.has(testKey));
        const studentNonExemptTasp = nonExemptKeys.reduce((sum, testKey) => sum + weightedScores[testKey], 0);
        const maxNonExemptTasp = nonExemptKeys.reduce(
            (sum, testKey) => sum + calculateMaxWeightedStandardScore(yearStats.tests[testKey]),
            0
        );
        const performanceRatio = maxNonExemptTasp > 0 ? studentNonExemptTasp / maxNonExemptTasp : 0;

        for (const testKey of Array.from(exemptTests)) {
            weightedScores[testKey] = performanceRatio * calculateMaxWeightedStandardScore(yearStats.tests[testKey]);
        }
    }

    const tasp = lgsTestKeys.reduce((sum, testKey) => sum + weightedScores[testKey], 0);
    const taspRange = yearStats.maxTasp - yearStats.minTasp;
    const scorePerTasp = taspRange > 0 ? 400 / taspRange : 0;
    const msp = taspRange > 0
        ? 100 + 400 * ((tasp - yearStats.minTasp) / taspRange)
        : 0;
    const totalNet = lgsTestKeys.reduce((sum, testKey) => sum + netScores[testKey], 0);
    const sayisalNet = SAYISAL_TEST_KEYS.reduce((sum, testKey) => sum + netScores[testKey], 0);
    const sozelNet = SOZEL_TEST_KEYS.reduce((sum, testKey) => sum + netScores[testKey], 0);
    const puan = Math.min(500, Math.max(100, msp));
    const percentileBand = estimateLgsPercentileBand(puan);
    const scenarioResults = buildLgsScenarioResults(yearStats, puan, scorePerTasp, exemptionFlags);
    const topContributionSubjects = scenarioResults
        .filter((scenario) => scenario.pointChange > 0)
        .sort((a, b) => b.pointChange - a.pointChange)
        .slice(0, 3)
        .map((scenario) => scenario.label);
    const subjectRows: LgsSubjectResult[] = lgsTestKeys.map((testKey) => {
        const testStats = yearStats.tests[testKey];
        const blankWeightedScore = calculateWeightedStandardScore(0, testStats);

        return {
            key: testKey,
            label: lgsTestLabels[testKey],
            correct: answerCounts[testKey].correct,
            wrong: answerCounts[testKey].wrong,
            blank: answerCounts[testKey].blank,
            net: netScores[testKey],
            coefficient: testStats.coefficient,
            maxQuestions: testStats.maxQuestions,
            standardScore: calculateStandardScore(rawScores[testKey], testStats),
            weightedStandardScore: weightedScores[testKey],
            estimatedImpact: exemptionFlags[testKey]
                ? null
                : (weightedScores[testKey] - blankWeightedScore) * scorePerTasp,
            isExempt: exemptionFlags[testKey],
        };
    });

    return {
        toplam_net: totalNet,
        toplam_soru: 90,
        sayisal_net: sayisalNet,
        sozel_net: sozelNet,
        tasp,
        puan,
        tahmini_yuzdelik_dilim: percentileBand.rangeLabel,
        tahmini_yuzdelik_min: percentileBand.minPercentile,
        tahmini_yuzdelik_max: percentileBand.maxPercentile,
        tahmini_yuzdelik_kaynak: percentileBand.sourceLabel,
        tahmini_yuzdelik_aciklama: `Tahmini puanınız geçmiş yıl eğilimlerine göre yaklaşık ${percentileBand.rangeLabel} bandına denk gelebilir. Bu aralık, 2026 sınav zorluğu ve tercih yoğunluğuna göre değişebilir.`,
        hedefe_katki_onerileri: topContributionSubjects,
        net_artirma_senaryolari: scenarioResults,
        senaryo_uyarisi: "Bu senaryo, kullanılan yılın istatistik setine göre yaklaşık etki gösterir.",
        muafiyet_simulasyonu: exemptTests.size > 0,
        muafiyet_etiketi: exemptTests.size > 0 ? "Yaklaşık muafiyet simülasyonu" : "",
        muafiyet_uyari: exemptTests.size > 0
            ? "Muafiyetli öğrencilerde resmi puan MEB tarafından özel formülle hesaplanır. Bu araç, veri setindeki en yüksek ASP değerleri resmi sonuç ekranı kadar ayrıntılı olmadığı için yaklaşık simülasyon sunar."
            : "",
        istatistik_yili: yearStats.year,
        puan_alt_metni: `${yearStats.year} istatistik setiyle tahmini`,
        dersler: subjectRows,
    };
}
