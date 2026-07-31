"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export type KidemChartPoint = {
    yil: string;
    tooltipLabel: string;
    brut: number;
    net: number;
    isCurrent: boolean;
};

type Props = {
    data: KidemChartPoint[];
    locale: string;
};

type TooltipPayload = {
    payload?: KidemChartPoint;
};

function formatTL(value: number, locale: string) {
    return `${Math.round(value).toLocaleString(locale)} TL`;
}

function KidemTooltip({
    active,
    payload,
    locale,
}: {
    active?: boolean;
    payload?: TooltipPayload[];
    locale: string;
}) {
    const point = payload?.[0]?.payload;

    if (!active || !point) {
        return null;
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
            <p className="font-black text-slate-950">
                {point.tooltipLabel} net tazminat: {formatTL(point.net, locale)}
            </p>
        </div>
    );
}

export default function KidemChart({ data, locale }: Props) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="yil"
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                    interval={0}
                    minTickGap={8}
                />
                <YAxis
                    tickFormatter={(value) => formatTL(Number(value), locale)}
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                    width={88}
                />
                <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={<KidemTooltip locale={locale} />}
                />
                <Bar dataKey="net" radius={[6, 6, 0, 0]} barSize={28}>
                    {data.map((entry) => (
                        <Cell
                            key={entry.yil}
                            fill={entry.isCurrent ? "#CC4A1A" : "#FDBA74"}
                            opacity={entry.isCurrent ? 1 : 0.55}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
