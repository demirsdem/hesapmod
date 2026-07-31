export type OggMode = "unarmed" | "armed";

export type OggSection = {
    id: "hukuk" | "mevzuat" | "ilkyardim" | "silah";
    label: string;
    questionCount: number;
    advisoryMinimum: number;
};

export type OggInputs = {
    hukuk: number;
    mevzuat: number;
    ilkyardim: number;
    silah: number;
    silahBilgisi: number;
    atis: number;
};

export type OggResultKind = "armed-pass" | "unarmed-pass" | "borderline" | "fail" | "empty";

export type OggResult = {
    mode: OggMode;
    kind: OggResultKind;
    title: string;
    statusLabel: string;
    totalScore: number;
    basicScore: number;
    weaponKnowledgeScore: number;
    shootingScore: number;
    weaponScore: number;
    averageScore: number;
    missingPoints: number;
    message: string;
};

export const PASS_SCORE = 60;

export const BASIC_SECTIONS: OggSection[] = [
    { id: "hukuk", label: "Hukuk", questionCount: 30, advisoryMinimum: 18 },
    { id: "mevzuat", label: "Mevzuat", questionCount: 30, advisoryMinimum: 18 },
    { id: "ilkyardim", label: "İlkyardım", questionCount: 20, advisoryMinimum: 12 },
    { id: "silah", label: "Silah / Genel Kültür", questionCount: 20, advisoryMinimum: 12 },
];

export const EMPTY_OGG_INPUTS: OggInputs = {
    hukuk: 0,
    mevzuat: 0,
    ilkyardim: 0,
    silah: 0,
    silahBilgisi: 0,
    atis: 0,
};

export function clampInteger(value: unknown, max: number) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return Math.max(0, Math.min(max, Math.trunc(parsed)));
}

export function calculateBasicScore(inputs: Pick<OggInputs, "hukuk" | "mevzuat" | "ilkyardim" | "silah">) {
    return inputs.hukuk + inputs.mevzuat + inputs.ilkyardim + inputs.silah;
}

export function calculateOggResult(mode: OggMode, inputs: OggInputs, hasAnyInput = true): OggResult {
    const basicScore = calculateBasicScore(inputs);
    const weaponKnowledgeScore = inputs.silahBilgisi * 2;
    const shootingScore = inputs.atis * 10;
    const weaponScore = weaponKnowledgeScore + shootingScore;
    const averageScore = (basicScore + weaponScore) / 2;

    if (!hasAnyInput) {
        return {
            mode,
            kind: "empty",
            title: "Bilgileri girin",
            statusLabel: "Beklemede",
            totalScore: 0,
            basicScore,
            weaponKnowledgeScore,
            shootingScore,
            weaponScore,
            averageScore: 0,
            missingPoints: PASS_SCORE,
            message: "Doğru sayılarını girdikçe sonuç burada anlık güncellenir.",
        };
    }

    if (mode === "unarmed") {
        const passed = basicScore >= PASS_SCORE;
        const borderline = passed && basicScore <= 65;
        const missingPoints = Math.max(0, PASS_SCORE - basicScore);

        return {
            mode,
            kind: passed ? (borderline ? "borderline" : "unarmed-pass") : "fail",
            title: passed ? "Geçtiniz" : "Başarısız",
            statusLabel: passed ? "Silahsız ÖGG" : "60 barajı altında",
            totalScore: basicScore,
            basicScore,
            weaponKnowledgeScore,
            shootingScore,
            weaponScore,
            averageScore: basicScore,
            missingPoints,
            message: passed
                ? `60 barajını ${basicScore - PASS_SCORE} puan aştınız.`
                : `Silahsız başarı için ${missingPoints} puan daha lazım.`,
        };
    }

    if (averageScore >= PASS_SCORE) {
        const borderline = averageScore <= 65;

        return {
            mode,
            kind: borderline ? "borderline" : "armed-pass",
            title: "Geçtiniz",
            statusLabel: "Silahlı ÖGG",
            totalScore: averageScore,
            basicScore,
            weaponKnowledgeScore,
            shootingScore,
            weaponScore,
            averageScore,
            missingPoints: 0,
            message: `Silahlı ortalama 60 barajını ${formatScore(averageScore - PASS_SCORE)} puan aşıyor.`,
        };
    }

    if (basicScore >= PASS_SCORE) {
        const missingPoints = Math.ceil((PASS_SCORE - averageScore) * 2);

        return {
            mode,
            kind: "unarmed-pass",
            title: "Silahsız sertifika",
            statusLabel: "Silahlı ortalama düşük",
            totalScore: averageScore,
            basicScore,
            weaponKnowledgeScore,
            shootingScore,
            weaponScore,
            averageScore,
            missingPoints,
            message: `Temel eğitim 60 ve üzeri. Silahlı sonuç için silah toplamında yaklaşık ${missingPoints} puan daha gerekir.`,
        };
    }

    return {
        mode,
        kind: "fail",
        title: "Başarısız",
        statusLabel: "Baraj altında",
        totalScore: averageScore,
        basicScore,
        weaponKnowledgeScore,
        shootingScore,
        weaponScore,
        averageScore,
        missingPoints: Math.max(Math.ceil(PASS_SCORE - basicScore), Math.ceil((PASS_SCORE - averageScore) * 2)),
        message: `Temel eğitim ve silahlı ortalama 60 barajının altında. En az ${Math.ceil(PASS_SCORE - basicScore)} temel eğitim puanı daha gerekir.`,
    };
}

export function formatScore(value: number) {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
        maximumFractionDigits: 1,
    }).format(value);
}
