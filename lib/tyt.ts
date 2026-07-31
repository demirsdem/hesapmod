export const TYT_COEFFICIENT_YEARS = ["2025", "2024", "2023"] as const;

export type TytCoefficientYear = (typeof TYT_COEFFICIENT_YEARS)[number];

type TytCoefficients = {
    turk: number;
    sos: number;
    mat: number;
    fen: number;
};

export type TytNets = {
    turkNet: number;
    sosNet: number;
    matNet: number;
    fenNet: number;
    totalNet: number;
};

export type TytScoreResult = TytNets & {
    year: TytCoefficientYear;
    rawScore: number;
    obpValue: number;
    obpContribution: number;
    extraContribution: number;
    placementScore: number;
    extraPlacementScore: number;
    eligible: boolean;
};

export type TytScoreSet = {
    selectedYear: TytCoefficientYear;
    results: TytScoreResult[];
    selected: TytScoreResult;
    maxPlacementScore: number;
};

const TYT_COEFFICIENTS: Record<TytCoefficientYear, TytCoefficients> = {
    "2025": { turk: 2.91, sos: 2.94, mat: 2.93, fen: 2.53 },
    "2024": { turk: 2.91, sos: 2.94, mat: 2.93, fen: 2.53 },
    "2023": { turk: 3.3, sos: 3.4, mat: 3.3, fen: 3.4 },
};

function readNumber(value: unknown) {
    const parsed = Number.parseFloat(String(value ?? ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

function readBoolean(value: unknown) {
    return value === true || value === "true" || value === "1" || value === 1;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function normalizeTytYear(value: unknown): TytCoefficientYear {
    const year = String(value ?? "2025");
    return TYT_COEFFICIENT_YEARS.includes(year as TytCoefficientYear)
        ? year as TytCoefficientYear
        : "2025";
}

export function calculateTytNet(correctValue: unknown, wrongValue: unknown, questionCount: number) {
    const correct = clamp(readNumber(correctValue), 0, questionCount);
    const wrong = clamp(readNumber(wrongValue), 0, questionCount - correct);
    return Math.max(0, correct - (wrong / 4));
}

export function calculateTytNets(values: Record<string, unknown>): TytNets {
    const turkNet = calculateTytNet(values.turk_d, values.turk_y, 40);
    const sosNet = calculateTytNet(values.sos_d, values.sos_y, 20);
    const matNet = calculateTytNet(values.mat_d, values.mat_y, 40);
    const fenNet = calculateTytNet(values.fen_d, values.fen_y, 20);

    return {
        turkNet,
        sosNet,
        matNet,
        fenNet,
        totalNet: turkNet + sosNet + matNet + fenNet,
    };
}

export function normalizeTytObp(value: unknown) {
    const rawObp = readNumber(value);

    if (rawObp <= 0) {
        return 0;
    }

    const obpValue = rawObp <= 100 ? rawObp * 5 : rawObp;
    return clamp(obpValue, 250, 500);
}

export function calculateTytScoreForYear(
    values: Record<string, unknown>,
    year: TytCoefficientYear,
    nets = calculateTytNets(values)
): TytScoreResult {
    const coefficients = TYT_COEFFICIENTS[year];
    const eligible = nets.turkNet >= 0.5 || nets.matNet >= 0.5;
    const rawScore = eligible
        ? clamp(
            100
            + (nets.turkNet * coefficients.turk)
            + (nets.sosNet * coefficients.sos)
            + (nets.matNet * coefficients.mat)
            + (nets.fenNet * coefficients.fen),
            0,
            500
        )
        : 0;

    const obpValue = normalizeTytObp(values.obp_input);
    const hasPreviousPlacement = readBoolean(values.obp_kesinti);
    const hasVocationalExtraPoint = readBoolean(values.obp_ek_puan);
    const obpContribution = obpValue * (hasPreviousPlacement ? 0.06 : 0.12);
    const extraContribution = hasVocationalExtraPoint
        ? obpValue * (hasPreviousPlacement ? 0.03 : 0.06)
        : 0;
    const placementScore = rawScore > 100 ? rawScore + obpContribution : 0;
    const extraPlacementScore = placementScore > 0 ? placementScore + extraContribution : 0;

    return {
        ...nets,
        year,
        rawScore,
        obpValue,
        obpContribution,
        extraContribution,
        placementScore,
        extraPlacementScore,
        eligible,
    };
}

export function calculateTytScoreSet(values: Record<string, unknown>): TytScoreSet {
    const selectedYear = normalizeTytYear(values.sinav_yili);
    const nets = calculateTytNets(values);
    const results = TYT_COEFFICIENT_YEARS.map((year) => (
        calculateTytScoreForYear(values, year, nets)
    ));
    const selected = results.find((result) => result.year === selectedYear) ?? results[0];
    const maxPlacementScore = Math.max(...results.map((result) => result.placementScore));

    return {
        selectedYear,
        results,
        selected,
        maxPlacementScore,
    };
}

export function calculateTytRuntimeResult(values: Record<string, unknown>) {
    const scoreSet = calculateTytScoreSet(values);
    const selected = scoreSet.selected;

    return {
        toplam_net: selected.totalNet,
        turk_net: selected.turkNet,
        sos_net: selected.sosNet,
        mat_net: selected.matNet,
        fen_net: selected.fenNet,
        ham_puan: selected.rawScore,
        obp_katkisi: selected.obpContribution,
        yerlestirme_puan: selected.placementScore,
        ek_puan_katkisi: selected.extraContribution,
        ek_puanli_yerlestirme: selected.extraPlacementScore,
        tyt_setleri: scoreSet.results,
    };
}
