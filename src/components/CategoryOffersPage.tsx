"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MOCK_OFFERS,
  filterMockOffers,
  type MockOfferCategory,
} from "@/data/mockOffers";
import {
  DEFAULT_LOCATION,
  readLocation,
  type OnboardingLocation,
} from "@/lib/onboarding";
import { OnboardingModal } from "@/components/OnboardingModal";
import { HeaderNav } from "@/components/HeaderNav";
import { CategoryRibbon } from "@/components/CategoryRibbon";
import { OfferCard } from "@/components/OfferCard";

type Props = {
  category: Extract<MockOfferCategory, "hotel" | "restaurant">;
  eyebrow: string;
  title: string;
  description: string;
};

/**
 * Dedicated vertical catalogue — Hotels or Fine Dining.
 */
export function CategoryOffersPage({
  category,
  eyebrow,
  title,
  description,
}: Props) {
  const [query, setQuery] = useState("");
  const [location, setLocation] =
    useState<OnboardingLocation>(DEFAULT_LOCATION);
  const [changeOpen, setChangeOpen] = useState(false);
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    setLocation(readLocation());
  }, []);

  const offers = useMemo(() => {
    const list = filterMockOffers(MOCK_OFFERS, {
      category,
      query,
      city: location.city,
    });
    if (minDiscount <= 0) return list;
    return list.filter((o) => {
      if (o.originalPriceCents <= 0) return false;
      const pct = Math.round(
        ((o.originalPriceCents - o.offerPriceCents) / o.originalPriceCents) *
          100,
      );
      return pct >= minDiscount;
    });
  }, [category, query, location.city, minDiscount]);

  const locationLabel = (() => {
    const c = location.city.trim();
    if (!c) return location.country === "Italy" ? "Milano" : location.country;
    if (/^milan$/i.test(c)) return "Milano";
    return c;
  })();

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="sticky top-0 z-50 w-full bg-white">
        <HeaderNav
          query={query}
          onQueryChange={setQuery}
          locationLabel={locationLabel}
          onLocationClick={() => setChangeOpen(true)}
          favoritesCount={4}
        />
        <CategoryRibbon
          active={category}
          minDiscount={minDiscount}
          onMinDiscountChange={setMinDiscount}
          onChange={(id) => {
            if (id === "hotel") window.location.href = "/hotels";
            else if (id === "restaurant") window.location.href = "/restaurants";
            else if (id === "trending")
              window.location.href = "/offers#trending-offers";
            else window.location.href = "/offers";
          }}
        />
      </div>

      <section className="border-b border-zinc-200/60 bg-white py-8">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {eyebrow}
          </p>
          <h1
            className="mt-2 text-3xl tracking-tight text-zinc-900 md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">{description}</p>
          <Link
            href="/offers"
            className="mt-4 inline-flex text-sm font-semibold text-zinc-800 underline-offset-2 hover:underline"
          >
            ← All offers
          </Link>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-zinc-900">
              {offers.length} offer{offers.length === 1 ? "" : "s"}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {changeOpen ? (
        <OnboardingModal
          forceOpen
          onCompleted={(loc) => {
            setLocation(loc);
            setChangeOpen(false);
          }}
          onClose={() => setChangeOpen(false)}
        />
      ) : null}
    </main>
  );
}
