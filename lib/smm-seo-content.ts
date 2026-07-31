import { bruttenHesapla, formatTRY, nettenHesapla } from "@/lib/smm-calculator";

export const smmPagePath = "/muhasebe/serbest-meslek-makbuzu-hesaplama";
export const smmTitle = "Serbest Meslek Makbuzu Hesaplama 2026 – Brüt, Net, KDV ve Stopaj | HesapMod";
export const smmDescription = "Serbest meslek makbuzunda brüt/net/tahsil tutarını, KDV ve stopaj kesintisini 2026 GVK oranlarıyla hesaplayın. Avukat, doktor, mühendis ve tüm serbest meslek meslekleri.";
export const smmDateModified = "2026-05-19";

export const smmFaqItems = [
    {
        question: "Serbest meslek makbuzu nasıl hesaplanır?",
        answer: "SMM hesabı brüt hizmet bedeli üzerinden yapılır. KDV brüte eklenir, gelir vergisi stopajı brüt üzerinden kesilir ve tahsil edilecek tutar brüt + KDV - stopaj formülüyle bulunur.",
    },
    {
        question: "Stopaj kimden kesilir, kim beyan eder?",
        answer: "Stopaj serbest meslek erbabının brüt hizmet bedelinden kesilir. Ödemeyi yapan kurum veya stopaj sorumlusu kişi bu tutarı muhtasar beyannameyle beyan eder.",
    },
    {
        question: "SMM'de KDV nasıl eklenir?",
        answer: "KDV, brüt hizmet bedeli üzerinden hesaplanır ve makbuz toplamına eklenir. Hizmet KDV'den istisna veya muafsa araçta KDV oranı %0 seçilmelidir.",
    },
    {
        question: "Netten brüte makbuz nasıl hesaplanır?",
        answer: "Hedef net gelir, 1 - stopaj oranı çarpanına bölünür. Örneğin %20 stopajda 8.000 TL net gelir için brüt tutar 10.000 TL olur.",
    },
    {
        question: "Brüt 10.000 TL için tahsil edilecek tutar nedir?",
        answer: "%20 KDV ve %20 stopaj varsayımında 10.000 TL brüt için KDV 2.000 TL, stopaj 2.000 TL ve tahsil edilecek tutar 10.000 TL olur.",
    },
    {
        question: "Yazar ve çevirmenler için stopaj oranı farklı mı?",
        answer: "GVK 18. madde kapsamındaki telif ve patent ödemelerinde GVK 94/2-a kapsamında %17 stopaj uygulanabilir. Genel serbest meslek işleri için yaygın oran %20'dir.",
    },
    {
        question: "KDV'den muaf serbest meslek hizmetleri hangileridir?",
        answer: "Eğitim, sağlık veya kanunda istisna tanımlanmış bazı hizmetlerde KDV oranı farklı veya %0 olabilir. Uygulanacak istisna için GİB ve mali müşavir kontrolü gerekir.",
    },
    {
        question: "e-SMM nedir, kim kullanmak zorunda?",
        answer: "e-SMM, serbest meslek makbuzunun elektronik ortamda düzenlenen halidir. Serbest meslek erbapları GİB e-Belge portalı veya özel entegratör üzerinden e-SMM düzenler.",
    },
    {
        question: "SMM'de damga vergisi var mı?",
        answer: "Serbest meslek makbuzunda standart hesap kalemleri brüt hizmet bedeli, KDV ve gelir vergisi stopajıdır. Damga vergisi ayrı belge veya sözleşme türlerinde gündeme gelebilir.",
    },
    {
        question: "Bu araç beyanname yerine geçer mi?",
        answer: "Hayır. Bu araç bilgilendirme amaçlıdır ve vergi beyannamesi yerine geçmez. Kesin vergi tutarı, özel oranlar ve istisnalar için mali müşavir veya GİB'e başvurunuz.",
    },
    {
        question: "Avukat ve doktor için SMM stopaj oranı aynı mı?",
        answer: "Genel GVK 94/2-b kapsamında avukat ve doktor gibi serbest meslek ödemelerinde yaygın stopaj oranı %20'dir. Özel istisna veya farklı alıcı statüsü sonucu değiştirebilir.",
    },
    {
        question: "Müşteri kurumsa (şirket) stopaj nasıl işler?",
        answer: "Müşteri stopaj sorumlusu bir şirketse serbest meslek ödemesinden gelir vergisi stopajı keser, kalan tahsil tutarını öder ve stopajı muhtasar beyannameyle beyan eder.",
    },
] as const;

export const stopajRows = [
    { durum: "Avukat, Doktor, Mimar", stopaj: "%20", kapsam: "Md. 94/2-b" },
    { durum: "Mühendis, Danışman", stopaj: "%20", kapsam: "Md. 94/2-b" },
    { durum: "Mali Müşavir, Muhasebe", stopaj: "%20", kapsam: "Md. 94/2-b" },
    { durum: "Yazar, Çevirmen (telif)", stopaj: "%17", kapsam: "Md. 94/2-a" },
    { durum: "Özel haller", stopaj: "Farklı", kapsam: "GİB sirküleri" },
] as const;

export const popularGrossRows = [5000, 10000, 25000, 50000, 100000].map((brut) => ({
    label: `${brut.toLocaleString("tr-TR")} TL brüt`,
    href: `${smmPagePath}?tip=brut&tutar=${brut}#smm-araci`,
    ...bruttenHesapla({ brutTutar: brut, kdvOrani: 20, stopajOrani: 20 }),
}));

export const popularNetRows = [10000, 20000].map((net) => {
    const result = nettenHesapla({ netGelir: net, kdvOrani: 20, stopajOrani: 20 });
    return {
        label: `${formatTRY(net)} net hedef`,
        href: `${smmPagePath}?tip=net&tutar=${net}#smm-araci`,
        net,
        result,
    };
});

export const internalLinks = [
    { href: "/finansal-hesaplamalar/kdv-hesaplama", label: "KDV hesaplama" },
    { href: "/maas-ve-vergi/gelir-vergisi-hesaplama", label: "Gelir vergisi hesaplama" },
    { href: "/maas-ve-vergi/damga-vergisi-hesaplama", label: "Damga vergisi hesaplama" },
    { href: "/maas-ve-vergi/kdv-tevkifati-hesaplama", label: "KDV tevkifatı hesaplama" },
    { href: "/muhasebe/issizlik-maasi-hesaplama", label: "İşsizlik maaşı hesaplama" },
    { href: "/maas-ve-vergi/maas-hesaplama", label: "Maaş hesaplama" },
] as const;
