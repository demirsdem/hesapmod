"use client";

import { useId, useMemo, useState } from "react";

type YearlyPoint = {
    year: number;
    value: number;
    growthRate: number | null;
};

type Props = {
    data: YearlyPoint[];
    finalYear: number;
};

function formatCompactTl(value: number) {
    if (Math.abs(value) >= 1_000_000) {
        return `${(value / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}M`;
    }

    if (Math.abs(value) >= 1_000) {
        return `${(value / 1_000).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}B`;
    }

    return value.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

function formatTl(value: number) {
    return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL`;
}

export default function CagrGrowthChart({ data, finalYear }: Props) {
    const titleId = useId();
    const descId = useId();
    const [activePoint, setActivePoint] = useState<YearlyPoint | null>(null);

    const chart = useMemo(() => {
        const width = 720;
        const height = 160;
        const padding = { top: 14, right: 20, bottom: 30, left: 58 };
        const minValue = Math.min(...data.map((point) => point.value));
        const maxValue = Math.max(...data.map((point) => point.value));
        const range = Math.max(1, maxValue - minValue);
        const maxYear = Math.max(1, finalYear);
        const plotWidth = width - padding.left - padding.right;
        const plotHeight = height - padding.top - padding.bottom;
        const toX = (year: number) => padding.left + (Math.min(year, maxYear) / maxYear) * plotWidth;
        const toY = (value: number) => padding.top + ((maxValue - value) / range) * plotHeight;
        const points = data.map((point) => ({
            ...point,
            x: toX(point.year),
            y: toY(point.value),
        }));
        const path = points
            .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
            .join(" ");
        const yTicks = [maxValue, minValue + range / 2, minValue].map((value) => ({
            value,
            y: toY(value),
        }));
        const xTicks = Array.from(new Set([0, Math.round(maxYear / 2), maxYear])).map((year) => ({
            year,
            x: toX(year),
        }));

        return { width, height, padding, points, path, yTicks, xTicks };
    }, [data, finalYear]);

    return (
        <div className="relative rounded-xl border border-slate-200 bg-white p-3">
            <svg
                viewBox={`0 0 ${chart.width} ${chart.height}`}
                role="img"
                aria-labelledby={`${titleId} ${descId}`}
                className="h-40 w-full"
                onMouseLeave={() => setActivePoint(null)}
            >
                <title id={titleId}>Yıllara göre bileşik büyüme grafiği</title>
                <desc id={descId}>
                    Turuncu çizgi, başlangıç değerinden son değere kadar yıllık bileşik büyüme eğrisini gösterir.
                </desc>
                <rect width={chart.width} height={chart.height} rx="12" fill="#F8FAFC" />
                {chart.yTicks.map((tick) => (
                    <g key={tick.value}>
                        <line x1={chart.padding.left} x2={chart.width - chart.padding.right} y1={tick.y} y2={tick.y} stroke="#E2E8F0" strokeWidth="1" />
                        <text x={chart.padding.left - 10} y={tick.y + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748B">
                            {formatCompactTl(tick.value)}
                        </text>
                    </g>
                ))}
                {chart.xTicks.map((tick) => (
                    <g key={tick.year}>
                        <line x1={tick.x} x2={tick.x} y1={chart.padding.top} y2={chart.height - chart.padding.bottom} stroke="#E2E8F0" strokeWidth="1" />
                        <text x={tick.x} y={chart.height - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748B">
                            {tick.year}
                        </text>
                    </g>
                ))}
                <path d={chart.path} fill="none" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {chart.points.map((point) => (
                    <circle
                        key={`${point.year}-${point.value}`}
                        cx={point.x}
                        cy={point.y}
                        r={activePoint?.year === point.year ? 6 : 4}
                        fill="#FF6B35"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setActivePoint(point)}
                        onFocus={() => setActivePoint(point)}
                        tabIndex={0}
                    >
                        <title>{`${point.year}. yıl: ${formatTl(point.value)}`}</title>
                    </circle>
                ))}
            </svg>
            {activePoint && (
                <div className="pointer-events-none absolute right-4 top-4 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-lg">
                    Yıl {activePoint.year}: {formatTl(activePoint.value)}
                </div>
            )}
        </div>
    );
}
