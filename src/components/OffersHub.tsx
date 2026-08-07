"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MOCK_OFFERS,
  discountPercent,
  filterMockOffers,
  type MockOfferCategory,
} from "@/data/mockOffers";
import {
  DEFAULT_LOCATION,
  readLocation,
  type OnboardingLocation,
} from "@/lib/onboarding";
import { OnboardingModal } from "@/components/OnboardingModal";
import { OfferCard } from "@/components/OfferCard";
import { OffersBentoGrid } from "@/components/OffersBentoGrid";
import { TrendingOffers } from "@/components/TrendingOffers";
import { HeaderNav } from "@/components/HeaderNav";
import {
  CategoryRibbon,
  type RibbonCategory,
} from "@/components/CategoryRibbon";

/**
 * Offers discovery — command header, sticky category ribbon, bento, trending, catalogue.
 */
export function OffersHub() {
  const [ribbon, setRibbon] = useState<RibbonCategory>("all");
  const [query, setQuery] = useState("");
  const [location, setLocation] =
    useState<OnboardingLocation>(DEFAULT_LOCATION);
  const [changeOpen, setChangeOpen] = useState(false);
  const [favoritesCount] = useState(4);
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    setLocation(readLocation());
  }, []);

  const category: MockOfferCategory =
    ribbon === "trending" ? "all" : ribbon;

  const offers = useMemo(() => {
    const floor = ribbon === "trending" ? Math.max(minDiscount, 30) : minDiscount;
    let list =
      ribbon === "trending"
        ? [...MOCK_OFFERS].sort(
            (a, b) => discountPercent(b) - discountPercent(a),
          )
        : filterMockOffers(MOCK_OFFERS, {
            category,
            query,
            city: location.city,
          });

    if (ribbon === "trending") {
      const q = query.trim().toLowerCase();
      list = list.filter((o) => {
        if (!q) return true;
        const hay = [o.title, o.merchantName, o.details, o.city]
          .join(" ")
          .toLowerCase();
        return q.split(/\s+/).every((t) => hay.includes(t));
      });
    }

    if (floor > 0) {
      list = list.filter((o) => discountPercent(o) >= floor);
    }
    return list;
  }, [ribbon, category, query, location.city, minDiscount]);

  const locationLabel = (() => {
    const c = location.city.trim();
    if (!c) return location.country === "Italy" ? "Milano" : location.country;
    if (/^milan$/i.test(c)) return "Milano";
    return c;
  })();

  const scrollToCatalogue = () => {
    document
      .getElementById("offers-catalogue")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="sticky top-0 z-50 w-full bg-white">
        <HeaderNav
          query={query}
          onQueryChange={setQuery}
          locationLabel={locationLabel}
          onLocationClick={() => setChangeOpen(true)}
          favoritesCount={favoritesCount}
        />
        <CategoryRibbon
          active={ribbon}
          minDiscount={minDiscount}
          onMinDiscountChange={setMinDiscount}
          onChange={(id) => {
            setRibbon(id);
            if (id === "trending") {
              document
                .getElementById("trending-offers")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              scrollToCatalogue();
            }
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-10 px-5 py-8 md:py-10">
        <OffersBentoGrid
          onSelectCategory={(cat) => {
            setRibbon(cat);
            setQuery("");
            scrollToCatalogue();
          }}
        />

        <div id="trending-offers" className="scroll-mt-28">
          <TrendingOffers
            onSeeAll={() => {
              setRibbon("trending");
              setQuery("");
              scrollToCatalogue();
            }}
          />
        </div>

        <div id="offers-catalogue" className="scroll-mt-28 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-zinc-900">
              {ribbon === "trending" ? "Trending Deals" : "All Offers"}
            </h2>
            <p className="text-xs font-medium text-zinc-500">
              {offers.length} rate{offers.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {offers.length === 0 ? (
              <p className="col-span-full text-sm text-zinc-600">
                No offers match this search.
              </p>
            ) : (
              offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
}
