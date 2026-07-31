"use client";

import type { PuanTuru } from "@/types/kpss";
import { hedefPuanKombinasyonlari } from "@/lib/kpss-calculator";

export default function SimulasyonTablosu({ puanTuru, hedefPuan }: { puanTuru: PuanTuru; hedefPuan: number }) {
    const rows = hedefPuanKombinasyonlari(puanTuru, hedefPuan, 6);

    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">Hedef puana yakın net kombinasyonları</h3>
            <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[460px] text-left text-sm">
                    <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <tr>
                            <th scope="col" className="py-2 pr-3">GY net</th>
                            <th scope="col" className="py-2 pr-3">GK net</th>
                            {puanTuru === "P3" && <th scope="col" className="py-2 pr-3">EB net</th>}
                            <th scope="col" className="py-2 pr-3">Tahmini puan</th>
                            <th scope="col" className="py-2">Fark</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {rows.map((row) => (
                            <tr key={`${row.gyNet}-${row.gkNet}-${row.ebNet ?? "x"}`}>
                                <td className="py-2 pr-3 font-bold tabular-nums">{row.gyNet}</td>
                                <td className="py-2 pr-3 font-bold tabular-nums">{row.gkNet}</td>
                                {puanTuru === "P3" && <td className="py-2 pr-3 font-bold tabular-nums">{row.ebNet}</td>}
                                <td className="py-2 pr-3 tabular-nums">{row.tahminiPuan}</td>
                                <td className="py-2 tabular-nums">+{row.fark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
