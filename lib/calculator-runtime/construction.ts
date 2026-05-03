import type { CalculatorRuntimeMap } from "@/lib/calculator-types";

export const formulas: CalculatorRuntimeMap = {
    "beton-hesaplama": (values) => {
            const length = Math.max(0, Number(values.length) || 0);
            const width = Math.max(0, Number(values.width) || 0);
            const thicknessM = Math.max(0, Number(values.thicknessCm) || 0) / 100;
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netVolumeM3 = length * width * thicknessM;
            const orderVolumeM3 = netVolumeM3 * (1 + wasteRate / 100);

            return {
                netVolumeM3,
                orderVolumeM3,
                estimatedWeightTon: orderVolumeM3 * 2.4,
                truckLoads: Math.ceil((orderVolumeM3 / 7.5) * 10) / 10,
            };
        },
    "cimento-hesaplama": (values) => {
            const volumeM3 = Math.max(0, Number(values.volumeM3) || 0);
            const cementKgPerM3 = Math.max(0, Number(values.cementKgPerM3) || 0);
            const bagKg = Math.max(1, Number(values.bagKg) || 50);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netCementKg = volumeM3 * cementKgPerM3;
            const totalCementKg = netCementKg * (1 + wasteRate / 100);

            return {
                netCementKg,
                totalCementKg,
                bagCount: Math.ceil(totalCementKg / bagKg),
            };
        },
    "tugla-hesaplama": (values) => {
            const wallAreaM2 = Math.max(0, Number(values.wallAreaM2) || 0);
            const brickPerM2 = Math.max(0, Number(values.brickPerM2) || 0);
            const packageQty = Math.max(1, Number(values.packageQty) || 1);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netBrickCount = Math.ceil(wallAreaM2 * brickPerM2);
            const totalBrickCount = Math.ceil(netBrickCount * (1 + wasteRate / 100));

            return {
                netBrickCount,
                totalBrickCount,
                packageCount: Math.ceil(totalBrickCount / packageQty),
            };
        },
    "boya-hesaplama": (values) => {
            const paintAreaM2 = Math.max(0, Number(values.paintAreaM2) || 0);
            const coatCount = Math.max(1, Number(values.coatCount) || 1);
            const coverageM2PerLiter = Math.max(0.1, Number(values.coverageM2PerLiter) || 10);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netPaintLiter = (paintAreaM2 * coatCount) / coverageM2PerLiter;
            const totalPaintLiter = netPaintLiter * (1 + wasteRate / 100);

            return {
                netPaintLiter,
                totalPaintLiter,
                bucket15Liter: Math.ceil(totalPaintLiter / 15),
                primerLiter: paintAreaM2 / 12,
            };
        },
    "seramik-hesaplama": (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const tileLengthCm = Math.max(1, Number(values.tileLengthCm) || 1);
            const tileWidthCm = Math.max(1, Number(values.tileWidthCm) || 1);
            const boxM2 = Math.max(0.01, Number(values.boxM2) || 1);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const tileAreaM2 = (tileLengthCm / 100) * (tileWidthCm / 100);
            const totalAreaM2 = areaM2 * (1 + wasteRate / 100);

            return {
                tileAreaM2,
                totalAreaM2,
                tileCount: Math.ceil(totalAreaM2 / tileAreaM2),
                boxCount: Math.ceil(totalAreaM2 / boxM2),
            };
        },
    "parke-hesaplama": (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const packageM2 = Math.max(0.01, Number(values.packageM2) || 1);
            const perimeterM = Math.max(0, Number(values.perimeterM) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const totalAreaM2 = areaM2 * (1 + wasteRate / 100);

            return {
                totalAreaM2,
                packageCount: Math.ceil(totalAreaM2 / packageM2),
                skirtingM: perimeterM * 1.05,
            };
        },
    "demir-hesaplama": (values) => {
            const concreteVolumeM3 = Math.max(0, Number(values.concreteVolumeM3) || 0);
            const kgPerM3 = Math.max(0, Number(values.kgPerM3) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netRebarKg = concreteVolumeM3 * kgPerM3;
            const totalRebarKg = netRebarKg * (1 + wasteRate / 100);

            return {
                netRebarKg,
                totalRebarKg,
                totalRebarTon: totalRebarKg / 1000,
            };
        },
    "cati-alan-hesaplama": (values) => {
            const buildingLengthM = Math.max(0, Number(values.buildingLengthM) || 0);
            const buildingWidthM = Math.max(0, Number(values.buildingWidthM) || 0);
            const eaveM = Math.max(0, Number(values.eaveCm) || 0) / 100;
            const slopePercent = Math.max(0, Number(values.slopePercent) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const planAreaM2 = (buildingLengthM + 2 * eaveM) * (buildingWidthM + 2 * eaveM);
            const slopeFactor = Math.sqrt(1 + Math.pow(slopePercent / 100, 2));
            const roofAreaM2 = planAreaM2 * slopeFactor;

            return {
                planAreaM2,
                roofAreaM2,
                materialAreaM2: roofAreaM2 * (1 + wasteRate / 100),
            };
        },
    "merdiven-hesaplama": (values) => {
            const floorHeightCm = Math.max(1, Number(values.floorHeightCm) || 1);
            const targetRiserCm = Math.max(1, Number(values.targetRiserCm) || 17);
            const treadDepthCm = Math.max(1, Number(values.treadDepthCm) || 28);
            const stairWidthCm = Math.max(1, Number(values.stairWidthCm) || 100);
            const stepCount = Math.max(1, Math.round(floorHeightCm / targetRiserCm));
            const adjustedRiserCm = floorHeightCm / stepCount;
            const runLengthM = ((stepCount - 1) * treadDepthCm) / 100;
            const comfortValue = 2 * adjustedRiserCm + treadDepthCm;

            return {
                stepCount,
                adjustedRiserCm,
                runLengthM,
                stairPlanAreaM2: runLengthM * (stairWidthCm / 100),
                comfortNote: comfortValue >= 60 && comfortValue <= 64 ? "Konfor aralığına yakın" : "Konfor formülü ayrıca kontrol edilmeli",
            };
        },
    "metrekup-hesaplama": (values) => {
            const lengthM = Math.max(0, Number(values.lengthM) || 0);
            const widthM = Math.max(0, Number(values.widthM) || 0);
            const heightM = Math.max(0, Number(values.heightM) || 0);
            const surfaceBaseM2 = lengthM * widthM;
            const volumeM3 = surfaceBaseM2 * heightM;

            return {
                volumeM3,
                volumeLiter: volumeM3 * 1000,
                surfaceBaseM2,
            };
        },
    "hafriyat-hesaplama": (values) => {
            const lengthM = Math.max(0, Number(values.lengthM) || 0);
            const widthM = Math.max(0, Number(values.widthM) || 0);
            const depthM = Math.max(0, Number(values.depthM) || 0);
            const swellRate = Math.max(0, Number(values.swellRate) || 0);
            const truckCapacityM3 = Math.max(1, Number(values.truckCapacityM3) || 10);
            const netVolumeM3 = lengthM * widthM * depthM;
            const looseVolumeM3 = netVolumeM3 * (1 + swellRate / 100);

            return {
                netVolumeM3,
                looseVolumeM3,
                truckTrips: Math.ceil(looseVolumeM3 / truckCapacityM3),
            };
        },
    "kum-hesaplama": (values) => {
            const volumeM3 = Math.max(0, Number(values.volumeM3) || 0);
            const densityTonM3 = Math.max(0.1, Number(values.densityTonM3) || 1.6);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const totalVolumeM3 = volumeM3 * (1 + wasteRate / 100);

            return {
                totalVolumeM3,
                sandTon: totalVolumeM3 * densityTonM3,
            };
        },
    "alci-hesaplama": (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const kgPerM2 = Math.max(0.1, Number(values.kgPerM2) || 8.5);
            const bagKg = Math.max(1, Number(values.bagKg) || 25);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netGypsumKg = areaM2 * kgPerM2;
            const totalGypsumKg = netGypsumKg * (1 + wasteRate / 100);

            return {
                netGypsumKg,
                totalGypsumKg,
                bagCount: Math.ceil(totalGypsumKg / bagKg),
            };
        },
    "siva-hesaplama": (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const thicknessM = Math.max(0, Number(values.thicknessCm) || 0) / 100;
            const densityKgM3 = Math.max(100, Number(values.densityKgM3) || 1600);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const mortarVolumeM3 = areaM2 * thicknessM;
            const totalVolumeM3 = mortarVolumeM3 * (1 + wasteRate / 100);
            const plasterKg = totalVolumeM3 * densityKgM3;

            return {
                mortarVolumeM3,
                totalVolumeM3,
                plasterKg,
                plasterTon: plasterKg / 1000,
            };
        },
    "elektrik-kablo-hesaplama": (values) => {
            const lineLengthM = Math.max(0, Number(values.lineLengthM) || 0);
            const circuitCount = Math.max(0, Number(values.circuitCount) || 0);
            const conductorCount = Math.max(1, Number(values.conductorCount) || 1);
            const slackRate = Math.max(0, Number(values.slackRate) || 0);
            const netCableM = lineLengthM * circuitCount * conductorCount;
            const totalCableM = netCableM * (1 + slackRate / 100);

            return {
                netCableM,
                totalCableM,
                roll100M: Math.ceil(totalCableM / 100),
                projectNote: "Kesit, sigorta ve gerilim düşümü ayrıca projeyle kontrol edilmeli",
            };
        },
    "su-tesisat-hesaplama": (values) => {
            const wetAreaCount = Math.max(0, Number(values.wetAreaCount) || 0);
            const averagePipeM = Math.max(0, Number(values.averagePipeM) || 0);
            const fixtureCount = Math.max(0, Number(values.fixtureCount) || 0);
            const fittingPerFixture = Math.max(0, Number(values.fittingPerFixture) || 0);
            const wasteRate = Math.max(0, Number(values.wasteRate) || 0);
            const netPipeM = wetAreaCount * averagePipeM;

            return {
                netPipeM,
                totalPipeM: netPipeM * (1 + wasteRate / 100),
                fittingCount: Math.ceil(fixtureCount * fittingPerFixture * (1 + wasteRate / 100)),
                valveCount: Math.ceil(wetAreaCount * 2 + fixtureCount * 0.25),
            };
        },
    "isi-kaybi-hesaplama": (values) => {
            const areaM2 = Math.max(0, Number(values.areaM2) || 0);
            const ceilingHeightM = Math.max(1, Number(values.ceilingHeightM) || 2.7);
            const insulationMultipliers: Record<string, number> = { weak: 1.25, medium: 1, good: 0.8 };
            const climateMultipliers: Record<string, number> = { mild: 0.85, normal: 1, cold: 1.25 };
            const insulationMultiplier = insulationMultipliers[String(values.insulationLevel)] ?? 1;
            const climateMultiplier = climateMultipliers[String(values.climateLevel)] ?? 1;
            const windowShare = Math.max(0, Number(values.windowShare) || 0);
            const volumeM3 = areaM2 * ceilingHeightM;
            const heatLossW = volumeM3 * 45 * insulationMultiplier * climateMultiplier * (1 + windowShare / 250);

            return {
                volumeM3,
                heatLossW,
                heatLossKw: heatLossW / 1000,
                recommendedCapacityKw: (heatLossW / 1000) * 1.15,
            };
        },
    "gunes-paneli-hesaplama": (values) => {
            const monthlyKwh = Math.max(0, Number(values.monthlyKwh) || 0);
            const sunHour = Math.max(0.1, Number(values.sunHour) || 4.5);
            const panelWatt = Math.max(1, Number(values.panelWatt) || 550);
            const systemLossRate = Math.min(95, Math.max(0, Number(values.systemLossRate) || 0));
            const dailyNeedKwh = monthlyKwh / 30;
            const requiredSystemKw = dailyNeedKwh / sunHour / (1 - systemLossRate / 100);
            const panelCount = Math.ceil((requiredSystemKw * 1000) / panelWatt);

            return {
                dailyNeedKwh,
                requiredSystemKw,
                panelCount,
                estimatedAreaM2: panelCount * 2.4,
            };
        },
    "jenerator-guc-hesaplama": (values) => {
            const runningPowerKw = Math.max(0, Number(values.runningPowerKw) || 0);
            const motorStartPowerKw = Math.max(0, Number(values.motorStartPowerKw) || 0);
            const powerFactor = Math.min(1, Math.max(0.1, Number(values.powerFactor) || 0.8));
            const safetyRate = Math.max(0, Number(values.safetyRate) || 0);
            const requiredKw = (runningPowerKw + motorStartPowerKw) * (1 + safetyRate / 100);
            const requiredKva = requiredKw / powerFactor;

            return {
                requiredKw,
                requiredKva,
                suggestedKva: Math.ceil(requiredKva / 5) * 5,
            };
        },
    "enerji-tuketim-hesaplama": (values) => {
            const devicePowerW = Math.max(0, Number(values.devicePowerW) || 0);
            const hoursPerDay = Math.min(24, Math.max(0, Number(values.hoursPerDay) || 0));
            const dayCount = Math.max(1, Number(values.dayCount) || 1);
            const kwhPrice = Math.max(0, Number(values.kwhPrice) || 0);
            const dailyKwh = (devicePowerW / 1000) * hoursPerDay;
            const totalKwh = dailyKwh * dayCount;

            return {
                dailyKwh,
                totalKwh,
                totalCost: totalKwh * kwhPrice,
                monthlyCost: dailyKwh * 30 * kwhPrice,
            };
        },
};
