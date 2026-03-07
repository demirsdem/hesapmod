import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "tapu-harci-hesaplama": (v) => {
            const price = parseFloat(v.salePrice) || 0;
            const buyerFee = price * 0.02;
            const sellerFee = price * 0.02;
            const revolvingFee = Math.max(0, parseFloat(v.revolvingFee) || 0);
            return { buyerFee, sellerFee, revolvingFee, totalFee: buyerFee + sellerFee + revolvingFee };
        },
    "indirim-hesaplama": (v) => {
            const price = parseFloat(v.originalPrice) || 0;
            const val = parseFloat(v.discountValue) || 0;
            const discountAmount = v.discountType === "percent" ? price * (val / 100) : val;
            const finalPrice = Math.max(0, price - discountAmount);
            const discountRate = price > 0 ? (discountAmount / price) * 100 : 0;
            return { discountAmount, finalPrice, discountRate };
        },
    "zam-hesaplama": (v) => {
            const price = parseFloat(v.currentPrice) || 0;
            const val = parseFloat(v.increaseValue) || 0;
            const increaseAmount = v.increaseType === "percent" ? price * (val / 100) : val;
            return { increaseAmount, newPrice: price + increaseAmount };
        },
    "kar-hesaplama": (v) => {
            const cost = parseFloat(v.costPrice) || 0;
            const sell = parseFloat(v.sellingPrice) || 0;
            const profit = sell - cost;
            const margin = sell > 0 ? (profit / sell) * 100 : 0;
            const markup = cost > 0 ? (profit / cost) * 100 : 0;
            return { profit, margin, markup };
        },
    "zarar-hesaplama": (v) => {
            const cost = parseFloat(v.costPrice) || 0;
            const sell = parseFloat(v.sellingPrice) || 0;
            const loss = Math.max(0, cost - sell);
            const lossRate = cost > 0 ? (loss / cost) * 100 : 0;
            return { loss, lossRate };
        },
    "ortalama-maliyet-hesaplama": (v) => {
            const purchases = [
                { qty: parseFloat(v.qty1) || 0, price: parseFloat(v.price1) || 0 },
                { qty: parseFloat(v.qty2) || 0, price: parseFloat(v.price2) || 0 },
                { qty: parseFloat(v.qty3) || 0, price: parseFloat(v.price3) || 0 },
            ].filter(p => p.qty > 0 && p.price > 0);
            const totalQty = purchases.reduce((s, p) => s + p.qty, 0);
            const totalCost = purchases.reduce((s, p) => s + p.qty * p.price, 0);
            const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
            return { totalQty, totalCost, avgCost };
        },
    "kargo-ucreti-hesaplama": (v) => {
            const w = parseFloat(v.weight) || 0;
            const l = parseFloat(v.length) || 0;
            const wd = parseFloat(v.width) || 0;
            const h = parseFloat(v.height) || 0;
            const rate = parseFloat(v.unitRate) || 0;
            const desi = (l * wd * h) / 3000;
            const chargeableWeight = Math.max(w, desi);
            return { desi, chargeableWeight, shippingCost: chargeableWeight * rate };
        },
    "desi-hesaplama": (v) => {
            const l = parseFloat(v.length) || 0;
            const w = parseFloat(v.width) || 0;
            const h = parseFloat(v.height) || 0;
            const div = parseFloat(v.divisor) || 3000;
            return { desi: (l * w * h) / div };
        },
    "fiyat-hesaplama": (v) => {
            const cost = parseFloat(v.costPrice) || 0;
            const margin = parseFloat(v.margin) || 0;
            const sellPrice = margin >= 100 ? 0 : cost / (1 - margin / 100);
            return { sellPrice, profitAmount: sellPrice > 0 ? sellPrice - cost : 0 };
        },
    "insaat-alani-hesaplama": (v) => {
            const plot = parseFloat(v.plotArea) || 0;
            const taks = parseFloat(v.taks) || 0;
            const kaks = parseFloat(v.kaks) || 0;
            const footprintArea = plot * taks;
            const totalArea = plot * kaks;
            const maxFloors = footprintArea > 0 ? totalArea / footprintArea : 0;
            return { footprintArea, totalArea, maxFloors };
        },
    "arsa-payi-hesaplama": (v) => {
            const area = parseFloat(v.plotArea) || 0;
            const share = parseFloat(v.unitShare) || 0;
            const total = parseFloat(v.totalShare) || 0;
            const unitPlotArea = total > 0 ? (area * share) / total : 0;
            const ownershipPercentage = total > 0 ? (share / total) * 100 : 0;
            return { unitPlotArea, ownershipPercentage };
        },
};
