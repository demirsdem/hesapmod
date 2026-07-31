"use client";

import { memo } from "react";
import {
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export type MevduatChartPoint = {
    donem: string;
    period: number;
    nominal: number;
    reel: number;
};

type Props = {
    data: MevduatChartPoint[];
    locale: string;
};

function formatTL(value: number, locale: string) {
    return `${value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} TL`;
}

function formatAxisTL(value: number, locale: string) {
    return `${value.toLocaleString(locale, {
        maximumFractionDigits: 0,
    })} TL`;
}

function MevduatTooltip({
    active,
    payload,
    locale,
}: {
    active?: boolean;
    payload?: Array<{
        payload?: MevduatChartPoint;
    }>;
    locale: string;
}) {
    if (!active || !payload?.length || !payload[0].payload) {
        return null;
    }

    const point = payload[0].payload;

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-lg">
            Dönem {point.period}: Nominal {formatTL(point.nominal, locale)} | Reel{" "}
            {formatTL(point.reel, locale)}
        </div>
    );
}

function MevduatChart({ data, locale }: Props) {
    if (data.length === 0) {
        return (
            <div className="flex h-full min-h-64 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
                Grafik için dönem verisi bekleniyor
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={data}
                margin={{ top: 16, right: 18, bottom: 8, left: 8 }}
            >
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis
                    dataKey="donem"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                    interval={0}
                    minTickGap={8}
                />
                <YAxis
                    tickFormatter={(value) => formatAxisTL(Number(value), locale)}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                    width={86}
                />
                <Tooltip
                    cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }}
                    content={<MevduatTooltip locale={locale} />}
                />
                <Line
                    type="monotone"
                    dataKey="nominal"
                    name="Nominal birikim"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    isAnimationActive={false}
                />
                <Line
                    type="monotone"
                    dataKey="reel"
                    name="Reel birikim"
                    stroke="#dc2626"
                    strokeDasharray="7 5"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    isAnimationActive={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

export default memo(MevduatChart);
