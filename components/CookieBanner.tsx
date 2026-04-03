"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X, Check, Settings } from "lucide-react";

type ConsentState = "accepted" | "rejected" | null;

const CONSENT_KEY = "hesapmod-cookie-consent";
const CONSENT_EVENT = "hesapmod-consent-change";

function persistConsent(nextConsent: Exclude<ConsentState, null>) {
    localStorage.setItem(CONSENT_KEY, nextConsent);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: nextConsent }));
}

export default function CookieBanner({ lang = "tr" }: { lang?: "tr" | "en" }) {
    const [consent, setConsent] = useState<ConsentState>(null);
    const [mounted, setMounted] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
        setConsent(stored);
        setMounted(true);
    }, []);

    const accept = () => {
        persistConsent("accepted");
        setConsent("accepted");
    };

    const reject = () => {
        persistConsent("rejected");
        setConsent("rejected");
    };

    // Mount olmadan veya zaten karar verildiyse gösterme
    if (!mounted || consent !== null) return null;

    const copy =
        lang === "en"
            ? {
                dialogLabel: "Cookie Preferences",
                title: "Learn How We Use Cookies",
                description:
                    "We use required preference storage to keep the site working and load Google Analytics only when you give consent. You can review the details below or manage your choice through the ",
                policyLabel: "Cookie Policy",
                detailsShow: "View details",
                detailsHide: "Hide details",
                reject: "Reject",
                accept: "Accept all",
                requiredTitle: "Required Preferences",
                requiredBody: "Core site functions such as theme preference. Cannot be turned off.",
                analyticsTitle: "Analytics",
                analyticsBody: "We measure visitor traffic with Google Analytics.",
                marketingTitle: "Marketing Cookies",
                marketingBody: "Not currently in use.",
            }
            : {
                dialogLabel: "Çerez Tercihleri",
                title: "Çerezleri Nasıl Kullandığımızı Öğrenin",
                description:
                    "Sitenin düzgün çalışması için zorunlu tercih depolaması kullanıyor, trafiği analiz etmek için Google Analytics'i yalnızca onay verdiğinizde yüklüyoruz. Tercihlerinizi aşağıdaki detaylar alanından veya ",
                policyLabel: "Çerez Politikası",
                detailsShow: "Detayları görüntüle",
                detailsHide: "Detayları gizle",
                reject: "Reddet",
                accept: "Tümünü Kabul Et",
                requiredTitle: "Zorunlu Tercihler",
                requiredBody: "Tema tercihi gibi temel site işlevleri. Kapatılamaz.",
                analyticsTitle: "Analitik Ölçüm",
                analyticsBody: "Google Analytics ile ziyaretçi trafiğini ölçüyoruz.",
                marketingTitle: "Pazarlama Çerezleri",
                marketingBody: "Şu an kullanılmıyor.",
            };

    return (
        <div
            role="dialog"
            aria-label={copy.dialogLabel}
            aria-modal="false"
            className="fixed inset-x-0 bottom-0 z-50 animate-slide-up px-2 pb-2 sm:px-4 sm:pb-4"
        >
            <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-md">
                <div className="flex max-h-[calc(100dvh-1rem)] flex-col gap-4 overflow-y-auto p-4 sm:p-5">
                    {/* Ana satır */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        {/* İkon + Metin */}
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <Cookie size={18} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground mb-0.5">
                                    {copy.title}
                                </p>
                                <p className="break-words text-xs leading-relaxed text-muted-foreground">
                                    {copy.description}
                                    <span> </span>
                                    <Link href="/cerez-politikasi" className="text-primary hover:underline font-medium">
                                        {copy.policyLabel}
                                    </Link>
                                    <span> </span>
                                    {lang === "en" ? "page." : "üzerinden yönetebilirsiniz."}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {showDetails ? copy.detailsHide : copy.detailsShow}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:flex-nowrap">
                            <button
                                onClick={reject}
                                id="cookie-reject-btn"
                                className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted sm:flex-1 lg:min-w-[132px] lg:flex-none"
                            >
                                <X size={13} />
                                {copy.reject}
                            </button>
                            <button
                                onClick={accept}
                                id="cookie-accept-btn"
                                className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:flex-1 lg:min-w-[132px] lg:flex-none"
                            >
                                <Check size={13} />
                                {copy.accept}
                            </button>
                        </div>
                    </div>

                    {/* Detay bölümü (toggle ile açılır) */}
                    {showDetails && (
                        <div className="grid grid-cols-1 gap-3 border-t border-border/50 pt-2 sm:grid-cols-3">
                            {/* Zorunlu */}
                            <div className="flex min-w-0 items-start gap-2 rounded-lg bg-muted/50 p-3">
                                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500">
                                    <Check size={10} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-foreground">{copy.requiredTitle}</p>
                                    <p className="mt-0.5 break-words text-[11px] text-muted-foreground">
                                        {copy.requiredBody}
                                    </p>
                                </div>
                            </div>
                            {/* Analitik */}
                            <div className="flex min-w-0 items-start gap-2 rounded-lg bg-muted/50 p-3">
                                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                    <Settings size={10} className="text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-foreground">{copy.analyticsTitle}</p>
                                    <p className="mt-0.5 break-words text-[11px] text-muted-foreground">
                                        {copy.analyticsBody}
                                    </p>
                                </div>
                            </div>
                            {/* Reklam */}
                            <div className="flex min-w-0 items-start gap-2 rounded-lg bg-muted/50 p-3">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-foreground">{copy.marketingTitle}</p>
                                    <p className="mt-0.5 break-words text-[11px] text-muted-foreground">
                                        {copy.marketingBody}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}</style>
        </div>
    );
}
