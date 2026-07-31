export type SmmTutarTipi = "brut" | "net" | "tahsil";

export type SmmGvkKapsam =
    | "genel"
    | "telif"
    | "noterlik";

export type SmmMeslek =
    | "avukat"
    | "doktor"
    | "mimar"
    | "muhendis"
    | "mali-musavir"
    | "muhasebeci"
    | "psikolog"
    | "diyetisyen"
    | "tercuman"
    | "yazar-telif"
    | "diger";

export interface SmmOranlar {
    stopajOrani: number;
    kdvOrani: number;
    gvkKapsam: SmmGvkKapsam;
}

export interface SmmInputs {
    tutar: number;
    tutarTipi: SmmTutarTipi;
    meslek: SmmMeslek;
    kdvOrani: number;
    stopajOrani: number;
}

export interface SmmResult {
    brutTutar: number;
    kdvTutari: number;
    stopajTutari: number;
    tahsilEdilecek: number;
    netGelir: number;
    efektifVergiYuku: number;
}
