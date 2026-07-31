export type PuanTuru = "P1" | "P3" | "P93" | "P94";

export interface HesaplamaGirdisi {
    puanTuru: PuanTuru;
    gyDogru: number;
    gyYanlis: number;
    gkDogru: number;
    gkYanlis: number;
    ebDogru?: number;
    ebYanlis?: number;
}

export interface NetKatkisi {
    test: "GY" | "GK" | "EB";
    net: number;
    katsayi: number;
    katkı: number;
}

export interface HesaplamaCiktisi {
    gyNet: number;
    gkNet: number;
    ebNet?: number;
    tahminiPuan: number;
    guvenAraligi: [number, number];
    hamPuanEsigiKarsilandi: boolean;
    uyarilar: string[];
    katkilar: NetKatkisi[];
    puanUretildi: boolean;
}
