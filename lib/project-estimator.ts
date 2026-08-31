export const projectEstimatorOptions = {
    projectType: [
        ["new_custom", "Yeni özel yazılım", 2],
        ["existing_system", "Mevcut sistemi geliştirme", 1],
        ["manual_digitization", "Manuel süreci dijitalleştirme", 2],
        ["integration", "Sistem entegrasyonu", 3],
        ["saas", "SaaS ürünü", 4],
    ],
    platform: [
        ["web", "Web", 1], ["mobile", "Mobil", 2], ["desktop", "Masaüstü", 2],
        ["multi_platform", "Birden fazla platform", 4],
    ],
    coreNeeds: [
        ["roles", "Kullanıcı/rol yönetimi", 2], ["admin", "Yönetim paneli", 1],
        ["reporting", "Raporlama", 2], ["inventory", "Stok/sipariş", 3],
        ["crm", "Müşteri/teklif", 2], ["field", "Saha operasyonu", 3],
        ["notifications", "Bildirimler", 1], ["documents", "Dosya/belge yönetimi", 2],
    ],
    integration: [
        ["none", "Yok", 0], ["single", "Tek sistem/API", 2],
        ["multiple", "Birden fazla sistem", 4], ["business_suite", "ERP/muhasebe/e-ticaret", 6],
    ],
    migration: [
        ["none", "Yok", 0], ["spreadsheet", "Excel/CSV", 2],
        ["database", "Mevcut veritabanı", 4], ["messy", "Dağınık veya temizlenmesi gereken veri", 6],
    ],
    users: [
        ["small_team", "Küçük ekip", 1], ["departments", "Birden fazla departman", 3],
        ["external_access", "Müşteri/bayi/tedarikçi erişimi", 5], ["multi_tenant", "Çok kiracılı SaaS", 7],
    ],
    extras: [
        ["authorization", "Yetkilendirme", 1], ["audit", "Denetim kayıtları", 2],
        ["offline", "Offline çalışma", 3], ["security", "Gelişmiş güvenlik", 3],
        ["traffic", "Yoğun trafik", 3], ["multilingual", "Çoklu dil", 2],
    ],
} as const;

type OptionKey<K extends keyof typeof projectEstimatorOptions> = typeof projectEstimatorOptions[K][number][0];
export type ProjectEstimatorInput = {
    projectType: OptionKey<"projectType">;
    platform: OptionKey<"platform">;
    coreNeeds: OptionKey<"coreNeeds">[];
    integration: OptionKey<"integration">;
    migration: OptionKey<"migration">;
    users: OptionKey<"users">;
    extras: OptionKey<"extras">[];
};

export type ProjectScopeLevel = "Başlangıç" | "Orta kapsam" | "İleri kapsam" | "Kurumsal/çok aşamalı";
export type ProjectEstimatorResult = {
    score: number;
    level: ProjectScopeLevel;
    duration: string;
    durationMinWeeks: number;
    durationMaxWeeks: number;
    solutionType: string;
    firstPhase: string;
    technicalTopics: string[];
    team: string[];
    maintenance: string;
    summary: string;
};

const levels = [
    { max: 10, level: "Başlangıç", duration: "3–5 hafta", min: 3, maxWeeks: 5, solution: "Odaklı web uygulaması veya süreç otomasyonu", phase: "Tek ana iş akışı, temel roller ve ölçülebilir bir çıktı" },
    { max: 20, level: "Orta kapsam", duration: "6–10 hafta", min: 6, maxWeeks: 10, solution: "Modüler iş uygulaması ve yönetim paneli", phase: "Öncelikli iş akışları, temel raporlar ve kontrollü veri aktarımı" },
    { max: 32, level: "İleri kapsam", duration: "11–18 hafta", min: 11, maxWeeks: 18, solution: "Entegrasyonlu, çok rollü web veya mobil çözüm", phase: "Çekirdek platform, kritik entegrasyon ve pilot kullanıcı grubu" },
    { max: Infinity, level: "Kurumsal/çok aşamalı", duration: "19–30+ hafta", min: 19, maxWeeks: 30, solution: "Aşamalı kurumsal platform veya çok kiracılı ürün", phase: "Keşif ve mimari fazı ardından sınırlı kapsamlı MVP ve pilot operasyon" },
] as const;

function option<K extends keyof typeof projectEstimatorOptions>(group: K, key: string) {
    const found = projectEstimatorOptions[group].find((item) => item[0] === key);
    if (!found) throw new Error(`Geçersiz ${group} seçimi`);
    return found;
}

function uniqueValid<K extends "coreNeeds" | "extras">(group: K, keys: readonly string[]) {
    return Array.from(new Set(keys)).map((key) => option(group, key));
}

export function calculateProjectEstimate(input: ProjectEstimatorInput): ProjectEstimatorResult {
    const projectType = option("projectType", input.projectType);
    const platform = option("platform", input.platform);
    const coreNeeds = uniqueValid("coreNeeds", input.coreNeeds);
    const integration = option("integration", input.integration);
    const migration = option("migration", input.migration);
    const users = option("users", input.users);
    const extras = uniqueValid("extras", input.extras);
    const score = projectType[2] + platform[2] + integration[2] + migration[2] + users[2]
        + coreNeeds.reduce((total, item) => total + item[2], 0)
        + extras.reduce((total, item) => total + item[2], 0);
    const band = levels.find((item) => score <= item.max) ?? levels[levels.length - 1];
    const technicalTopics = [
        coreNeeds.some((item) => item[0] === "roles") || input.users !== "small_team" ? "Rol ve yetki modeli" : "Temel kullanıcı akışı",
        input.integration !== "none" ? "API sözleşmeleri ve entegrasyon dayanıklılığı" : "Modüler uygulama mimarisi",
        input.migration !== "none" ? "Veri eşleme, doğrulama ve geri dönüş planı" : "Temiz başlangıç veri modeli",
        extras.some((item) => ["security", "audit"].includes(item[0])) ? "Güvenlik ve izlenebilirlik" : "Test ve gözlemlenebilirlik",
    ];
    const team = score <= 10 ? ["Ürün/iş analizi", "Full-stack geliştirme", "Test desteği"]
        : score <= 20 ? ["İş analizi", "Frontend", "Backend", "Test"]
            : ["Ürün/iş analizi", "Teknik lider", "Frontend", "Backend", "Test/QA", ...(input.platform === "mobile" || input.platform === "multi_platform" ? ["Mobil geliştirme"] : [])];
    const maintenance = score <= 10
        ? "Planlı güncelleme, yedekleme ve temel teknik destek yeterli olabilir."
        : score <= 32
            ? "Düzenli sürüm, izleme, güvenlik güncellemesi ve destek planı önerilir."
            : "Sürüm yönetimi, izleme, olay müdahalesi ve kapasite planlaması içeren sürekli bakım gerekir.";
    const list = (items: readonly (readonly [string, string, number])[]) => items.map((item) => item[1]).join(", ") || "Yok";
    const summary = [
        "Yazılım projesi ön kapsam özeti",
        `İhtiyaç türü: ${projectType[1]}`,
        `Platform: ${platform[1]}`,
        `Temel ihtiyaçlar: ${list(coreNeeds)}`,
        `Entegrasyon: ${integration[1]}`,
        `Veri aktarımı: ${migration[1]}`,
        `Kullanıcı ve rol yapısı: ${users[1]}`,
        `Ek gereksinimler: ${list(extras)}`,
        `Ön değerlendirme: ${band.level} — ${band.duration}`,
        "Not: Bu sonuç yalnız ön değerlendirmedir; kesin teklif, garanti veya teslim taahhüdü değildir.",
    ].join("\n");
    return { score, level: band.level, duration: band.duration, durationMinWeeks: band.min, durationMaxWeeks: band.maxWeeks, solutionType: band.solution, firstPhase: band.phase, technicalTopics, team, maintenance, summary };
}

export const projectScopeBands = levels;
