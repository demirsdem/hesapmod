import { getBusinessSolution } from "@/lib/business-solutions";
import { CORPORATE_CONTACT_PATH, getCorporateService } from "@/lib/corporate-services";

export type FooterCorporateLink = { label: string; href: string; service: string };

function serviceLink(slug: string, label: string): FooterCorporateLink | null {
    const service = getCorporateService(slug);
    return service ? { label, href: `/kurumsal/${service.slug}`, service: service.slug } : null;
}

function solutionLink(slug: string, label: string): FooterCorporateLink | null {
    const solution = getBusinessSolution(slug);
    return solution ? { label, href: `/cozumler/${solution.slug}`, service: solution.slug } : null;
}

export const footerCorporateLinks = [
    serviceLink("ozel-yazilim-gelistirme", "Özel yazılım geliştirme"),
    solutionLink("is-sureci-otomasyonu", "İş süreci otomasyonu"),
    serviceLink("web-uygulamasi-gelistirme", "Web ve mobil uygulamalar"),
    serviceLink("api-entegrasyonu-ve-otomasyon", "API entegrasyonları"),
    { label: "Proje kapsamı hesaplama", href: "/kurumsal/yazilim-projesi-kapsam-hesaplama", service: "project-estimator" },
    { label: "Projenizi anlatın", href: CORPORATE_CONTACT_PATH, service: "corporate-contact" },
].filter((link): link is FooterCorporateLink => Boolean(link));
