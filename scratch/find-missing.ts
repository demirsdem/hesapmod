import * as fs from 'fs';
import * as path from 'path';
import * as sourcePhase from '../lib/calculator-source';
import { phase5Calculators } from '../lib/phase5Calculators';
import { phase6Calculators } from '../lib/phase6Calculators';
import { phase7Calculators } from '../lib/phase7Calculators';
import { phase8Calculators } from '../lib/phase8Calculators';
import { phase9Calculators } from '../lib/phase9Calculators';

async function main() {
  const allExisting: any[] = [];
  
  // Extract all array exports from calculator-source
  for (const key of Object.keys(sourcePhase)) {
    const val = (sourcePhase as any)[key];
    if (Array.isArray(val)) {
      allExisting.push(...val);
    }
  }

  // Also include phase 5 to 9 just in case they aren't part of calculator-source exports correctly
  const morePhases = [
    phase5Calculators,
    phase6Calculators,
    phase7Calculators,
    phase8Calculators,
    phase9Calculators,
  ];

  for (const phase of morePhases) {
     if (Array.isArray(phase)) {
         for (const item of phase) {
             if (!allExisting.find(e => e.slug === item.slug)) {
                 allExisting.push(item);
             }
         }
     }
  }

  console.log(`Found ${allExisting.length} calculators in code.`);

  const slugs = allExisting.map(c => c.slug);
  const titles = allExisting.map(c => c.name?.tr || c.h1?.tr);

  // User input list
  const userListText = `
İhtiyaç Kredisi Hesaplama
İş Yeri Kredisi Hesaplama
Konut Kredisi Hesaplama
Kredi Hesaplama
Kredi Dosya Masrafı Hesaplama
Kredi Erken Kapatma Cezası Hesaplama
Kredi Gecikme Faizi Hesaplama
Kredi Kartı Asgari Ödeme Tutarı Hesaplama
Kredi Kartı Ek Taksit Hesaplama
Kredi Kartı Gecikme Faizi Hesaplama
Kredi Kartı İşlem Taksitlendirme Hesaplama
Kredi Kartı Taksitli Nakit Avans Hesaplama
Kredi Yapılandırma Hesaplama
Kredi Yıllık Maliyet Oranı Hesaplama
Ne Kadar Kredi Alabilirim Hesaplama
Taşıt Kredisi Hesaplama
Ticari Araç Kredisi Hesaplama
Ticari İhtiyaç Kredisi Hesaplama
Ticari Kredi Hesaplama
Altın Hesaplama
Bileşik Büyüme Hesaplama
Birikim Hesaplama
Bono Hesaplama
Döviz Hesaplama
Enflasyon Hesaplama
Eurobond Hesaplama
Faiz Hesaplama
Geçmiş Altın Fiyatları Hesaplama
Geçmiş Döviz Kurları Hesaplama
IBAN Doğrulama
İç ve Dış İskonto Hesaplama
İç Verim Oranı Hesaplama
Kira Artış Oranı Hesaplama
Net Bugünkü Değer Hesaplama
Ortalama Vade Hesaplama
Parasal Değer Hesaplama
Reel Getiri Hesaplama
Repo Hesaplama
Sermaye ve Temettü Hesaplama
Tahvil Hesaplama
Vadeli İşlem Fiyatı Hesaplama
Vadeli Mevduat Faizi Hesaplama
AGS Puan Hesaplama
AKS Puan Hesaplama
ALES Puan Hesaplama
DGS Puan Hesaplama
DGS Taban Puanları Hesaplama
DİB MBSTS Puan Hesaplama
DUS Puan Hesaplama
Ehliyet Sınavı Puan Hesaplama
EKPSS Puan Hesaplama
EUS Puan Hesaplama
Hâkim ve Savcı Yrd. Sınavı Puan Hesaplama
HMGS Puan Hesaplama
İSG Puan Hesaplama
İYÖS Puan Hesaplama
KPSS Puan Hesaplama
LGS Puan Hesaplama
Lise (LGS) Taban Puanları Hesaplama
MSÜ Puan Hesaplama
OBP Okul Puanı Hesaplama
ÖYP Puan Hesaplama
Özel Güvenlik Sınavı Puanı Hesaplama
PMYO Puan Hesaplama
POMEM Puan Hesaplama
PYBS Puan Hesaplama
TUS Puan Hesaplama
TYT Puan Hesaplama
Üniversite (YKS) Taban Puanları Hesaplama
YDS Puan Hesaplama
YKS Puan Hesaplama
Ders Notu Hesaplama
E-Okul Not Hesaplama
Lise Ders Puanı Hesaplama
Lise Mezuniyet Puanı Hesaplama
Lise Ortalama Hesaplama
Lise Sınıf Geçme Hesaplama
Lise YBP Hesaplama
Okula Başlama Yaşı Hesaplama
Takdir Teşekkür Hesaplama
Üniversite Not Ortalaması Hesaplama
Vize Final Ortalama Hesaplama
Adet Günü Hesaplama
Aşı Takvimi Hesaplama
Bazal Metabolizma Hızı Hesaplama
Bebek Boyu Hesaplama
Bebek Kilosu Hesaplama
Bel / Kalça Oranı Hesaplama
Doğum Tarihi Hesaplama
Gebelik Hesaplama
Günlük Kalori İhtiyacı Hesaplama
Günlük Karbonhidrat İhtiyacı Hesaplama
Günlük Kreatin Dozu Hesaplama
Günlük Makro Besin İhtiyacı Hesaplama
Günlük Protein İhtiyacı Hesaplama
Günlük Su İhtiyacı Hesaplama
Günlük Yağ İhtiyacı Hesaplama
İdeal Kilo Hesaplama
Sigara Maliyeti Hesaplama
Sütyen Bedeni Hesaplama
Vücut Kitle Endeksi Hesaplama
Vücut Yağ Oranı Hesaplama
Yaşam Süresi Hesaplama
Yumurtlama Dönemi Hesaplama
Alan Hesaplama
Altın Oran Hesaplama
Asal Çarpan Hesaplama
Basit Faiz Hesaplama
Bileşik Faiz Hesaplama
Çevre Hesaplama
EBOB EKOK Hesaplama
Faiz Hesaplama
Faktöriyel Hesaplama
Hacim Hesaplama
İnç Hesaplama
Kombinasyon Hesaplama
Köklü Sayı Hesaplama
Metrekare Hesaplama
Mil Hesaplama
Modüler Aritmetik Hesaplama
Oran Hesaplama
Permütasyon Hesaplama
Rastgele Sayı Hesaplama
Sayı Okunuşu Hesaplama
Standart Sapma Hesaplama
Taban Dönüşümü Hesaplama
Üslü Sayı Hesaplama
Yüzde Hesaplama
Ay Evresi Hesaplama
Bayram Namazı Saati Hesaplama
Cuma Namazı Saati Hesaplama
Gün Batımı Hesaplama
Gün Doğumu Hesaplama
Hafta Hesaplama
Hangi Gün Hesaplama
Hicri Takvim Hesaplama
İki Tarih Arasındaki Gün Sayısını Hesaplama
İki Tarih Arasındaki Hafta Sayısını Hesaplama
İş Günü Hesaplama
Kaç Gün Kaldı Hesaplama
Kaç Gün Oldu Hesaplama
Ramazanın Kaçıncı Günü Hesaplama
Saat Farkı Hesaplama
Saat Kaç Hesaplama
Şafak Hesaplama
Tarih Hesaplama
Vade Hesaplama
Yaş Hesaplama
Yılın Kaçıncı Günü Hesaplama
Amortisman Hesaplama
Asgari Geçim İndirimi Hesaplama
Binek Araç Gider Kısıtlaması Hesaplama
Brütten Nete Maaş Hesaplama
Doğum İzni Hesaplama
Emeklilik Borçlanması Hesaplama
Emeklilik Hesaplama
Fazla Mesai Ücreti Hesaplama
Gecikme Zammı Hesaplama
Huzur Hakkı Hesaplama
İhbar Tazminatı Hesaplama
İşsizlik Maaşı Hesaplama
Kıdem Tazminatı Hesaplama
Kısa Çalışma Ödeneği Hesaplama
Maaş Hesaplama
Netten Brüte Maaş Hesaplama
Serbest Meslek Makbuzu Hesaplama
Yıllık İzin Hesaplama
Yıllık İzin Ücreti Hesaplama
Yeniden Değerleme Oranı Hesaplama
Yolluk Hesaplama
Damga Vergisi Hesaplama
Değer Artış Kazancı Vergisi Hesaplama
Değerli Konut Vergisi Hesaplama
Emlak Vergisi Hesaplama
Gelir Vergisi Hesaplama
Gümrük Vergisi Hesaplama
Kambiyo Vergisi Hesaplama
KDV Hesaplama
KDV Tevkifatı Hesaplama
Kira Vergisi Hesaplama
Kira Stopaj Hesaplama
Konaklama Vergisi Hesaplama
Kurumlar Vergisi Hesaplama
MTV Hesaplama
ÖTV Hesaplama
Veraset ve İntikal Vergisi Hesaplama
Vergi Gecikme Faizi Hesaplama
Arsa Payı Hesaplama
Desi Hesaplama
Fiyat Hesaplama
İndirim Hesaplama
İnşaat Alanı Hesaplama
Kâr Hesaplama
Kargo Ücreti Hesaplama
Ortalama Maliyet Hesaplama
Tapu Harcı Hesaplama
Zam Hesaplama
Zarar Hesaplama
Arabuluculuk Ücreti Hesaplama
E-tebligat Tebliğ Tarihi Hesaplama
Hukuki Süre Hesaplama
İcra Masrafı Hesaplama
Uzlaştırmacı Ücreti Hesaplama
Vekâlet Ücreti Hesaplama
Yasal Faiz Hesaplama
DASK Sigortası Hesaplama
Kasko Değeri Hesaplama
Kasko Hesaplama
Sağlık Sigortası Hesaplama
Trafik Sigortası Hesaplama
Elektrikli Araç Şarj Hesaplama
En Ucuz Otobüs Bileti Fiyatı Hesaplama
En Ucuz Uçak Bileti
İller Arası Mesafe Hesaplama
Kıble Yönü Hesaplama
Koordinat Hesaplama
Mesafe Hesaplama
Otel Fiyatı Hesaplama
Taksi Ücreti Hesaplama
Yakıt Tüketimi Hesaplama
Yol Tarifi Hesaplama
Aidat Gecikme Tazminatı Hesaplama
Araç Muayene Ücreti Hesaplama
Ay Burcu Hesaplama
Burç Hesaplama
Doğum Haritası Hesaplama
Ebced Hesaplama
Ek Ders Ücreti Hesaplama
Fitre Hesaplama
HTML Renk Kodu Hesaplama
İddaa Kupon Hesaplama
Karar Hesaplama
Kelime Sayısı Hesaplama
Klima BTU Hesaplama
Kuşak Hesaplama
MD5 Hesaplama
Parmak Alfabesi Hesaplama
Şifre Hesaplama
Yükselen Burç Hesaplama
Zekat Hesaplama
`;

  const userList = userListText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  function toSlug(text: string) {
      return text.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/â/g, 'a')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
  }

  const existingSlugs = new Set(slugs.filter(Boolean).map(s => s.toLowerCase()));
  
  // also map some alternative forms
  existingSlugs.add('faiz-hesaplama'); // handled by basit-faiz-hesaplama or similar
  
  const missing = [];
  const found = [];

  for (const rawName of userList) {
      const slug = toSlug(rawName);
      let isFound = false;
      
      if (existingSlugs.has(slug)) {
          isFound = true;
      } else {
          // try loose search:
          const existingMatch = allExisting.find(e => 
              e.slug && e.slug === slug ||
              (e.name?.tr && toSlug(e.name.tr) === slug)
          );
          if (existingMatch) {
              isFound = true;
          }
      }

      if (isFound) {
          found.push(rawName);
      } else {
          missing.push({ rawName, slug });
      }
  }

  console.log('\\n--- MISSING CALCULATORS ---');
  for (const m of missing) {
      console.log(m.rawName, '-> expected slug:', m.slug);
  }

  fs.writeFileSync(path.join(__dirname, 'missing.json'), JSON.stringify(missing, null, 2));
}

main().catch(console.error);
