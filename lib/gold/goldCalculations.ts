import type {
    GoldBuySellPrice,
    GoldPriceCache,
    GoldTypeId,
    GoldTypeInfo,
    PortfolioGoldItem,
    TransactionType,
} from "@/lib/gold/goldPriceTypes";

export const GOLD_TYPE_INFO: Record<GoldTypeId, GoldTypeInfo> = {
    hasAltin: {
        id: "hasAltin",
        name: "Has Altın",
        shortName: "Has Altın",
        karat: "24K",
        totalWeight: 1,
        pureGold: 1,
        alloy: 0,
        unit: "gram",
        isCoin: false,
    },
    gram24k: {
        id: "gram24k",
        name: "Gram Altın 24 Ayar",
        shortName: "24 Ayar Gram",
        karat: "24K",
        totalWeight: 1,
        pureGold: 1,
        alloy: 0,
        unit: "gram",
        isCoin: false,
    },
    gram22k: {
        id: "gram22k",
        name: "Gram Altın 22 Ayar",
        shortName: "22 Ayar Gram",
        karat: "22K",
        totalWeight: 1,
        pureGold: 0.917,
        alloy: 0.083,
        unit: "gram",
        isCoin: false,
    },
    gram18k: {
        id: "gram18k",
        name: "Gram Altın 18 Ayar",
        shortName: "18 Ayar Gram",
        karat: "18K",
        totalWeight: 1,
        pureGold: 0.75,
        alloy: 0.25,
        unit: "gram",
        isCoin: false,
    },
    gram14k: {
        id: "gram14k",
        name: "Gram Altın 14 Ayar",
        shortName: "14 Ayar Gram",
        karat: "14K",
        totalWeight: 1,
        pureGold: 0.583,
        alloy: 0.417,
        unit: "gram",
        isCoin: false,
    },
    ceyrek: {
        id: "ceyrek",
        name: "Çeyrek Altın",
        shortName: "Çeyrek",
        karat: "22K",
        totalWeight: 1.754,
        pureGold: 1.604,
        alloy: 0.15,
        unit: "adet",
        isCoin: true,
    },
    yarim: {
        id: "yarim",
        name: "Yarım Altın",
        shortName: "Yarım",
        karat: "22K",
        totalWeight: 3.508,
        pureGold: 3.208,
        alloy: 0.3,
        unit: "adet",
        isCoin: true,
    },
    tam: {
        id: "tam",
        name: "Tam / Ziynet Altın",
        shortName: "Tam Altın",
        karat: "22K",
        totalWeight: 7.016,
        pureGold: 6.416,
        alloy: 0.6,
        unit: "adet",
        isCoin: true,
    },
    cumhuriyet: {
        id: "cumhuriyet",
        name: "Cumhuriyet Altını",
        shortName: "Cumhuriyet",
        karat: "22K",
        totalWeight: 7.016,
        pureGold: 6.416,
        alloy: 0.6,
        unit: "adet",
        isCoin: true,
    },
    ata: {
        id: "ata",
        name: "Ata Altın",
        shortName: "Ata",
        karat: "22K",
        totalWeight: 7.2,
        pureGold: 6.6,
        alloy: 0.6,
        unit: "adet",
        isCoin: true,
    },
    resat: {
        id: "resat",
        name: "Reşat Altın",
        shortName: "Reşat",
        karat: "22K",
        totalWeight: 7.216,
        pureGold: 6.614,
        alloy: 0.602,
        unit: "adet",
        isCoin: true,
    },
    gremse: {
        id: "gremse",
        name: "Gremse Altın",
        shortName: "Gremse",
        karat: "22K",
        totalWeight: 17.54,
        pureGold: 16.038,
        alloy: 1.502,
        unit: "adet",
        isCoin: true,
    },
    ons: {
        id: "ons",
        name: "Ons Altın",
        shortName: "Ons",
        karat: "24K",
        totalWeight: 31.1035,
        pureGold: 31.1035,
        alloy: 0,
        unit: "ons",
        isCoin: false,
    },
};

export const GOLD_TYPE_ORDER: GoldTypeId[] = [
    "hasAltin",
    "gram24k",
    "gram22k",
    "gram18k",
    "gram14k",
    "ceyrek",
    "yarim",
    "tam",
    "cumhuriyet",
    "ata",
    "resat",
    "gremse",
    "ons",
];

const TRY_FORMATTER = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const GRAM_FORMATTER = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 4,
});

function safeNumber(value: number) {
    return Number.isFinite(value) ? value : 0;
}

export function roundMoney(value: number) {
    return Math.round(safeNumber(value) * 100) / 100;
}

export function getGoldUnitPrice(
    prices: GoldPriceCache["prices"],
    goldType: GoldTypeId,
    transactionType: TransactionType
) {
    const price = prices[goldType];
    if (!price) return 0;
    return transactionType === "buy" ? price.sell : price.buy;
}

export function calculateGoldToTRY(params: {
    prices: GoldPriceCache["prices"];
    goldType: GoldTypeId;
    amount: number;
    transactionType: TransactionType;
}) {
    const unitPrice = getGoldUnitPrice(params.prices, params.goldType, params.transactionType);
    return roundMoney(unitPrice * Math.max(0, params.amount));
}

export function calculateTRYToGold(params: {
    prices: GoldPriceCache["prices"];
    goldType: GoldTypeId;
    tryAmount: number;
    transactionType?: TransactionType;
}) {
    const unitPrice = getGoldUnitPrice(params.prices, params.goldType, params.transactionType ?? "buy");
    if (unitPrice <= 0) return 0;
    return Math.max(0, params.tryAmount) / unitPrice;
}

export function calculateSpread(buy: number, sell: number) {
    return roundMoney(Math.max(0, sell - buy));
}

export function calculateSpreadPercent(buy: number, sell: number) {
    if (buy <= 0) return 0;
    return Math.round(((sell - buy) / buy) * 10000) / 100;
}

export function calculatePortfolioTotal(
    items: PortfolioGoldItem[],
    prices: GoldPriceCache["prices"],
    transactionType: TransactionType
) {
    return roundMoney(
        items.reduce((total, item) => (
            total + calculateGoldToTRY({
                prices,
                goldType: item.goldType,
                amount: item.amount,
                transactionType,
            })
        ), 0)
    );
}

export function getPureGoldGram(goldType: GoldTypeId, amount: number) {
    return safeNumber(GOLD_TYPE_INFO[goldType].pureGold * Math.max(0, amount));
}

export function formatTRY(value: number) {
    return TRY_FORMATTER.format(safeNumber(value));
}

export function formatGram(value: number) {
    return `${GRAM_FORMATTER.format(safeNumber(value))} g`;
}

export function formatPercent(value: number) {
    return `%${new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(safeNumber(value))}`;
}

export function formatGoldDate(value?: string) {
    if (!value) return "Güncelleme zamanı yok";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Güncelleme zamanı yok";
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function deriveGoldPricesFromHasAltin(
    hasAltin: GoldBuySellPrice,
    coinPremiumPercent = 3.5,
    onsTry?: GoldBuySellPrice
): GoldPriceCache["prices"] {
    const premiumFactor = 1 + Math.max(0, coinPremiumPercent) / 100;
    const priceFor = (type: GoldTypeId): GoldBuySellPrice => {
        if (type === "ons" && onsTry) return onsTry;
        const info = GOLD_TYPE_INFO[type];
        const factor = info.pureGold * (info.isCoin ? premiumFactor : 1);
        return {
            buy: roundMoney(hasAltin.buy * factor),
            sell: roundMoney(hasAltin.sell * factor),
        };
    };

    return GOLD_TYPE_ORDER.reduce((acc, type) => {
        acc[type] = priceFor(type);
        return acc;
    }, {} as GoldPriceCache["prices"]);
}
