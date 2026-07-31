export default function GoldCalculatorSkeleton() {
    return (
        <div className="min-h-[520px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="h-6 w-52 rounded bg-slate-200" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="h-24 rounded bg-slate-100" />
                <div className="h-24 rounded bg-slate-100" />
            </div>
            <div className="mt-4 h-64 rounded bg-slate-100" />
        </div>
    );
}
