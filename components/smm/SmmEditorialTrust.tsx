export default function SmmEditorialTrust() {
    return (
        <section aria-labelledby="smm-trust-heading" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-black uppercase tracking-wide text-[#B84418]">Editöryal güvence</p>
            <h2 id="smm-trust-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Kaynak, Kapsam ve Uyarı
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                <p>
                    GVK Madde 94/2 oranları ve KDV Kanunu'na göre hesaplanmıştır. Telif ödemeleri için
                    GVK 94/2-a kapsamında %17 oranı uygulanır; genel serbest meslek ödemelerinde yaygın
                    stopaj oranı %20 olarak modellenmiştir.
                </p>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-base font-bold leading-7 text-amber-950">
                    ⚠️ Bu araç bilgilendirme amaçlıdır ve vergi beyannamesi yerine geçmez. Vergi tavsiyesi değildir.
                    Kesin vergi tutarı, özel oranlar ve istisnalar için mali müşavir veya GİB'e başvurunuz.
                </div>
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        <a
                            href="https://www.mevzuat.gov.tr"
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="font-bold text-blue-700 underline underline-offset-4"
                        >
                            193 Sayılı GVK Madde 94/2
                        </a>
                    </li>
                    <li>
                        Kaynak:{" "}
                        <a
                            href="https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgelir-vergisi-kanununun-94uncu-maddesinde-yer-alan-kesinti-oranlari.pdf"
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="font-bold text-blue-700 underline underline-offset-4"
                        >
                            GİB GVK 94 kesinti oranları
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://ebelge.gib.gov.tr"
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="font-bold text-blue-700 underline underline-offset-4"
                        >
                            GİB e-Belge Portalı
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.resmigazete.gov.tr"
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="font-bold text-blue-700 underline underline-offset-4"
                        >
                            Resmi Gazete
                        </a>
                    </li>
                    <li>Son güncelleme: Mayıs 2026 | HesapMod Muhasebe Ekibi</li>
                </ul>
            </div>
        </section>
    );
}
