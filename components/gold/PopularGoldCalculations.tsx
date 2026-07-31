import Link from "next/link";
import type { GoldPriceCache, GoldTypeId } from "@/lib/gold/goldPriceTypes";
import { calculateGoldToTRY, calculateTRYToGold, formatGram, formatTRY } from "@/lib/gold/goldCalculations";

type PopularCard =
    | { title: string; body: string; href: string }
    | null;

function goldCard(cache: GoldPriceCache, title: string, amount: number, type: GoldTypeId, label: string): PopularCard {
    const value = calculateGoldToTRY({ prices: cache.prices, goldType: type, amount, transactionType: "buy" });
    return {
        title,
        body: `Güncel satış fiyatına göre ${label} yaklaşık ${formatTRY(value)}'dir.`,
        href: `?mod=altindan-tlye&type=${type}&amount=${amount}#canli-altin-hesaplama-araci`,
    };
}

function tryCard(cache: GoldPriceCache, title: string, tryAmount: number): PopularCard {
    const gram = calculateTRYToGold({ prices: cache.prices, goldType: "gram24k", tryAmount, transactionType: "buy" });
    return {
        title,
        body: `Güncel satış fiyatına göre ${formatTRY(tryAmount)} ile yaklaşık ${formatGram(gram)} 24 ayar gram altın alınabilir.`,
        href: `?mod=tlden-altina&type=gram24k&amount=${tryAmount}#canli-altin-hesaplama-araci`,
    };
}

export default function PopularGoldCalculations({ cache }: { cache: GoldPriceCache | null }) {
    if (!cache) return null;

    const cards: PopularCard[] = [
        goldCard(cache, "1 gram altın kaç TL?", 1, "gram24k", "1 gram 24 ayar altın"),
        goldCard(cache, "5 gram altın kaç TL?", 5, "gram24k", "5 gram 24 ayar altın"),
        goldCard(cache, "10 gram altın kaç TL?", 10, "gram24k", "10 gram 24 ayar altın"),
        goldCard(cache, "100 gram altın kaç TL?", 100, "gram24k", "100 gram 24 ayar altın"),
        goldCard(cache, "1 çeyrek altın kaç TL?", 1, "ceyrek", "1 çeyrek altın"),
        goldCard(cache, "1 yarım altın kaç TL?", 1, "yarim", "1 yarım altın"),
        goldCard(cache, "1 tam altın kaç TL?", 1, "tam", "1 tam altın"),
        goldCard(cache, "1 cumhuriyet altını kaç TL?", 1, "cumhuriyet", "1 cumhuriyet altını"),
        tryCard(cache, "10.000 TL kaç gram altın?", 10000),
        tryCard(cache, "100.000 TL kaç gram altın?", 100000),
        goldCard(cache, "10 gram 22 ayar bilezik kaç TL?", 10, "gram22k", "10 gram 22 ayar bilezik"),
        goldCard(cache, "10 gram 14 ayar altın kaç TL?", 10, "gram14k", "10 gram 14 ayar altın"),
    ];

    return (
        <section aria-labelledby="populer-altin-hesaplamalari" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id="populer-altin-hesaplamalari" className="text-2xl font-black tracking-tight text-slate-950">Popüler Altın Hesaplamaları</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cards.filter(Boolean).map((card) => (
                    <Link
                        key={card!.title}
                        href={card!.href}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-amber-300 hover:bg-white"
                    >
                        <h3 className="text-base font-black text-slate-950">{card!.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{card!.body}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
