"use client";

import { Flame } from "lucide-react";
import { MOCK_OFFERS, discountPercent } from "@/data/mockOffers";
import { OfferCard } from "@/components/OfferCard";

/** Top high-discount offers for the trending rail. */
export function trendingOffers(limit = 4) {
  return [...MOCK_OFFERS]
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, limit);
}

type Props = {
  onSeeAll?: () => void;
};

/**
 * Trending row — 4 high-demand cards above the full catalogue.
 */
export function TrendingOffers({ onSeeAll }: Props) {
  const offers = trendingOffers(4);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame
            className="h-5 w-5 fill-orange-500 stroke-orange-500"
            aria-hidden
          />
          <h2 className="text-xl font-extrabold text-zinc-900">
            Trending Offers
          </h2>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          See all <span className="text-xs">›</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((offer) => (
          <OfferCard key={`trending-${offer.id}`} offer={offer} />
        ))}
      </div>
    </section>
  );
}
