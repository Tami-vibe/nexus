"use client";

import { useState } from "react";
import Link from "next/link";
import { BedDouble, Heart, Star, UtensilsCrossed } from "lucide-react";
import type { MockOffer } from "@/data/mockOffers";
import { discountPercent, offerCoverFallback } from "@/data/mockOffers";
import { formatMoney } from "@/lib/commerce/money";

type Props = {
  offer: MockOffer;
};

function ctaLabel(offer: MockOffer): string {
  if (offer.category === "hotel") return "Check Availability";
  if (offer.category === "restaurant") return "Reserve Table";
  return "Claim Offer";
}

/**
 * High-conversion offer card — hospitality-aware meta + dynamic CTA.
 */
export function OfferCard({ offer }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    offer.image || offerCoverFallback(offer.category),
  );
  const original = formatMoney(offer.originalPriceCents, offer.currency);
  const price = formatMoney(offer.offerPriceCents, offer.currency);
  const pct = discountPercent(offer);
  const hotel = offer.hotelDetails;
  const dining = offer.restaurantDetails;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-none">
      <div className="relative aspect-[16/11] bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc(offerCoverFallback(offer.category))}
        />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite((v) => !v);
          }}
          aria-label="Favorite"
          aria-pressed={isFavorite}
          className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:bg-zinc-50 active:scale-90"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? "fill-red-500 stroke-red-500"
                : "fill-none stroke-zinc-900"
            }`}
          />
        </button>

        {pct > 0 ? (
          <span className="absolute top-3 right-3 z-10 rounded-md bg-black px-2.5 py-1 text-xs font-extrabold text-white shadow-md">
            -{pct}% OFF
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
          {offer.title}
        </h3>

        <p className="mt-1 flex items-center gap-1 truncate text-xs text-zinc-500">
          {hotel ? (
            <>
              <BedDouble className="h-3.5 w-3.5 shrink-0 stroke-zinc-500" />
              <span className="truncate">
                {hotel.nights} Night{hotel.nights === 1 ? "" : "s"} •{" "}
                {hotel.roomType}
              </span>
            </>
          ) : (
            <span className="truncate">
              {offer.merchantName} • {offer.distanceKm.toFixed(1)} km
            </span>
          )}
        </p>

        {hotel ? (
          <p className="mt-0.5 truncate text-[11px] text-zinc-400">
            {offer.merchantName} • {offer.distanceKm.toFixed(1)} km
            {hotel.stars ? ` • ${hotel.stars}★` : ""}
          </p>
        ) : null}

        {dining ? (
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-zinc-600">
            <UtensilsCrossed className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {dining.cuisine} • {dining.priceTier}
            </span>
          </p>
        ) : null}

        <div className="flex items-center justify-between pb-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
            <span className="font-bold text-zinc-900">
              {offer.rating.toFixed(1)}
            </span>
            <span className="text-zinc-400">({offer.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-zinc-400 line-through">{original}</span>
            <span className="text-lg font-extrabold text-zinc-900">{price}</span>
          </div>
        </div>

        <Link
          href={`/offers/${offer.id}`}
          className="mt-auto w-full rounded-lg bg-[#FF5E1A] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#E04E0E]"
        >
          {ctaLabel(offer)}
        </Link>
      </div>
    </article>
  );
}
