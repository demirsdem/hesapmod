export default function FxCalculatorSkeleton() {
    return (
        <section className="min-h-[420px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-label="Döviz hesaplama aracı yükleniyor">
            <div className="animate-pulse space-y-5">
                <div className="h-6 w-56 rounded bg-slate-200" />
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="h-11 rounded bg-slate-100" />
                    <div className="h-11 rounded bg-slate-100" />
                    <div className="h-11 rounded bg-slate-100" />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="h-36 rounded bg-slate-100" />
                    <div className="h-36 rounded bg-amber-50" />
                </div>
                <div className="h-20 rounded bg-slate-100" />
            </div>
        </section>
    );
}
