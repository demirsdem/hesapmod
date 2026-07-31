import {
    BANKA_ORANLARI,
    BANKA_ORANLARI_DISCLAIMER,
    BANKA_ORANLARI_SON_GUNCELLEME,
    getMevduatOranDays,
    getMevduatOranKeyForDays,
    type BankaMevduatOrani,
    type MevduatOranKey,
} from "@/lib/data/mevduat-oranlari";
import { cn } from "@/lib/utils";

type Props = {
    activeDays: number;
    selectedRate?: number;
};

const RATE_COLUMNS: Array<{
    key: MevduatOranKey;
    label: string;
}> = [
    { key: "oran32", label: "32 Gün" },
    { key: "oran92", label: "92 Gün" },
    { key: "oran181", label: "181 Gün" },
];

function formatRate(value: number) {
    return `%${value.toLocaleString("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })}`;
}

function buildApplyHref(bank: BankaMevduatOrani, activeKey: MevduatOranKey) {
    const params = new URLSearchParams({
        rate: String(bank[activeKey]),
        days: String(getMevduatOranDays(activeKey)),
        bank: bank.logo,
    });

    return `/finansal-hesaplamalar/mevduat-faiz-hesaplama?${params.toString()}`;
}

export default function MevduatBankRates({
    activeDays,
    selectedRate,
}: Props) {
    const activeKey = getMevduatOranKeyForDays(activeDays);

    return (
        <section
            aria-labelledby="mevduat-bank-rates-heading"
            className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-[#CC4A1A]">
                        Haftalık statik veri
                    </p>
                    <h2
                        id="mevduat-bank-rates-heading"
                        className="mt-1 text-2xl font-black tracking-tight text-slate-950"
                    >
                        Güncel Banka Faiz Oranları
                    </h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                    Aktif vade: {getMevduatOranDays(activeKey).toLocaleString("tr-TR")} gün
                </p>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-700">
                            <th className="min-w-44 border-b border-r border-slate-200 px-4 py-3 text-left font-black">
                                Banka
                            </th>
                            {RATE_COLUMNS.map((column) => (
                                <th
                                    key={column.key}
                                    className={cn(
                                        "min-w-28 border-b border-r border-slate-200 px-4 py-3 text-right font-black last:border-r-0",
                                        activeKey === column.key && "bg-blue-50 text-blue-800 ring-2 ring-inset ring-blue-500"
                                    )}
                                >
                                    {column.label}
                                </th>
                            ))}
                            <th className="min-w-32 border-b border-slate-200 px-4 py-3 text-right font-black">
                                Seç
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {BANKA_ORANLARI.map((bank) => {
                            const href = buildApplyHref(bank, activeKey);
                            const activeRate = bank[activeKey];
                            const isSelected =
                                selectedRate !== undefined
                                && Math.abs(selectedRate - activeRate) < 0.001;

                            return (
                                <tr
                                    key={bank.logo}
                                    className={cn(
                                        "odd:bg-white even:bg-slate-50/70",
                                        isSelected && "bg-blue-50/70"
                                    )}
                                >
                                    <th className="border-r border-slate-200 px-4 py-3 text-left">
                                        <a
                                            href={href}
                                            className="group inline-flex items-center gap-3 font-black text-slate-900 transition-colors hover:text-[#CC4A1A]"
                                            aria-label={`${bank.banka} ${formatRate(activeRate)} oranını kullan`}
                                        >
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-black uppercase text-slate-600 transition-colors group-hover:border-[#FFD7C7] group-hover:bg-[#FFF3EE] group-hover:text-[#CC4A1A]">
                                                {bank.logo.slice(0, 2)}
                                            </span>
                                            {bank.banka}
                                        </a>
                                    </th>
                                    {RATE_COLUMNS.map((column) => (
                                        <td
                                            key={`${bank.logo}-${column.key}`}
                                            className={cn(
                                                "border-r border-slate-200 px-4 py-3 text-right font-bold tabular-nums text-slate-800 last:border-r-0",
                                                activeKey === column.key && "bg-blue-50/70 text-blue-900 ring-2 ring-inset ring-blue-500"
                                            )}
                                        >
                                            {formatRate(bank[column.key])}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right">
                                        <a
                                            href={href}
                                            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#FFD7C7] bg-[#FFF3EE] px-3 text-xs font-black text-[#CC4A1A] transition-colors hover:border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                                        >
                                            Oranı kullan
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
                Son güncelleme: {BANKA_ORANLARI_SON_GUNCELLEME} |{" "}
                {BANKA_ORANLARI_DISCLAIMER}
            </p>
        </section>
    );
}
