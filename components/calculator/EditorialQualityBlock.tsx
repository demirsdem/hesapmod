import type { CalculatorTrustInfo } from "@/lib/calculator-trust";

export default function EditorialQualityBlock({
    trustInfo,
}: {
    trustInfo: CalculatorTrustInfo | null | undefined;
}) {
    if (!trustInfo) {
        return null;
    }

    const hasSources = (trustInfo.sources?.length ?? 0) > 0;
    const hasReviewMeta = Boolean(trustInfo.reviewedLabel || trustInfo.editorName);

    return (
        <section
            aria-labelledby="editorial-quality-heading"
            className="mt-8 mb-8 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 md:p-6"
        >
            <h2
                id="editorial-quality-heading"
                className="mb-3 text-base font-semibold text-slate-800"
            >
                Editoryal Güvence ve Kaynaklar
            </h2>

            {trustInfo.methodology && (
                <p className="mb-4 text-sm leading-6 text-slate-600">
                    {trustInfo.methodology}
                </p>
            )}

            {hasSources && (
                <div className="space-y-2">
                    {trustInfo.sources!.map((source) => (
                        <div
                            key={`${source.label}-${source.note}`}
                            className="min-w-0 rounded-lg border border-slate-200/80 bg-white/80 p-3 text-sm text-slate-600"
                        >
                            {source.href ? (
                                <a
                                    href={source.href}
                                    target="_blank"
                                    rel="nofollow noopener"
                                    className="inline-block max-w-full break-all font-medium text-blue-600 hover:underline"
                                >
                                    {source.label}
                                </a>
                            ) : (
                                <span className="inline-block max-w-full break-words font-medium text-slate-700">
                                    {source.label}
                                </span>
                            )}
                            {source.note && (
                                <span className="mt-1 block break-words text-slate-500">
                                    {source.note}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {hasReviewMeta && (
                <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center">
                    {trustInfo.reviewedLabel && (
                        <span>Son Güncelleme/Kontrol: {trustInfo.reviewedLabel}</span>
                    )}
                    {trustInfo.reviewedLabel && trustInfo.editorName && (
                        <span className="hidden text-slate-400 sm:inline">|</span>
                    )}
                    {trustInfo.editorName && (
                        <span>
                            Editör:{" "}
                            {trustInfo.editorHref ? (
                                <a
                                    href={trustInfo.editorHref}
                                    className="text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                                >
                                    {trustInfo.editorName}
                                </a>
                            ) : (
                                <span className="text-slate-700">{trustInfo.editorName}</span>
                            )}
                        </span>
                    )}
                </div>
            )}

            {trustInfo.note && (
                <p className="mt-2 text-xs italic text-slate-500">
                    {trustInfo.note}
                </p>
            )}
        </section>
    );
}
