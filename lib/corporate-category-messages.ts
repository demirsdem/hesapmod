import { normalizeCategorySlug } from "@/lib/categories";

export const DEFAULT_CORPORATE_CATEGORY_MESSAGE = "Tekrarlanan hesaplamaları ve manuel iş akışlarını işletmenize özel yazılıma dönüştürebiliriz.";

export const corporateCategoryMessages = {
    "maas-ve-vergi": "Bordro, maliyet, onay ve raporlama süreçlerinizi işletmenize özel bir sistemde otomatikleştirebiliriz.",
    "finansal-hesaplamalar": "Finansal hesaplamaları, veri akışlarını ve yönetim raporlarını tek panelde birleştirebiliriz.",
    "ticaret-ve-is": "Teklif, sipariş, stok, müşteri ve operasyon süreçlerinizi dijitalleştirebiliriz.",
    "zaman-hesaplama": "Süre, vardiya, izin, görev ve takip süreçlerinizi otomatikleştirebiliriz.",
    "sinav-hesaplamalari": "Puanlama, yoklama, değerlendirme ve raporlama sistemleri geliştirebiliriz.",
    "insaat-muhendislik": "Maliyet, metraj, teklif ve saha takibini web veya mobil uygulamaya dönüştürebiliriz.",
} as const;

export type CorporateCategoryMessageSlug = keyof typeof corporateCategoryMessages;

export function getCorporateCategoryMessage(categorySlug: string) {
    const normalizedSlug = normalizeCategorySlug(categorySlug);
    return corporateCategoryMessages[normalizedSlug as CorporateCategoryMessageSlug]
        ?? DEFAULT_CORPORATE_CATEGORY_MESSAGE;
}
