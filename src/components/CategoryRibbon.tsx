"use client";

import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Stethoscope,
  Palette,
  Dumbbell,
  Flame,
  Scale,
  BedDouble,
  UtensilsCrossed,
} from "lucide-react";
import {
  MOCK_OFFERS,
  discountPercent,
  type MockOfferCategory,
} from "@/data/mockOffers";

export type RibbonCategory = MockOfferCategory | "trending";

export const DISCOUNT_TIERS = [
  { label: "All", val: 0 },
  { label: "30%+", val: 30 },
  { label: "50%+", val: 50 },
  { label: "70%+", val: 70 },
] as const;

type RibbonItem = {
  id: RibbonCategory;
  label: string;
  Icon: LucideIcon;
  count: number;
  href?: string;
};

function categoryCounts(): Record<MockOfferCategory, number> {
  const counts: Record<MockOfferCategory, number> = {
    all: MOCK_OFFERS.length,
    clinic: 0,
    beauty: 0,
    fitness: 0,
    hotel: 0,
    restaurant: 0,
    legal: 0,
  };
  for (const o of MOCK_OFFERS) {
    counts[o.category] += 1;
  }
  return counts;
}

function trendingCount() {
  return MOCK_OFFERS.filter((o) => discountPercent(o) >= 30).length;
}

type Props = {
  active: RibbonCategory;
  onChange: (id: RibbonCategory) => void;
  minDiscount?: number;
  onMinDiscountChange?: (val: number) => void;
};

/**
 * Full-bleed sticky category ribbon + inline savings % filter.
 */
export function CategoryRibbon({
  active,
  onChange,
  minDiscount = 0,
  onMinDiscountChange,
}: Props) {
  const counts = categoryCounts();
  const items: RibbonItem[] = [
    { id: "all", label: "All Offers", Icon: Sparkles, count: counts.all },
    {
      id: "clinic",
      label: "Clinic & Medical",
      Icon: Stethoscope,
      count: counts.clinic,
    },
    {
      id: "beauty",
      label: "Beauty & PMU",
      Icon: Palette,
      count: counts.beauty,
    },
    {
      id: "fitness",
      label: "Fitness & Body",
      Icon: Dumbbell,
      count: counts.fitness,
    },
    {
      id: "hotel",
      label: "Hotels & Stays",
      Icon: BedDouble,
      count: counts.hotel,
      href: "/hotels",
    },
    {
      id: "restaurant",
      label: "Fine Dining & Gourmet",
      Icon: UtensilsCrossed,
      count: counts.restaurant,
      href: "/restaurants",
    },
    {
      id: "legal",
      label: "Legal & Counsel",
      Icon: Scale,
      count: counts.legal,
    },
    {
      id: "trending",
      label: "Trending Deals",
      Icon: Flame,
      count: trendingCount(),
    },
  ];

  return (
    <div className="w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-4 overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
        {/* Edge-to-edge scrollable categories */}
        <div
          className="no-scrollbar mask-fade-x flex flex-1 items-center gap-2 overflow-x-auto py-1"
          role="tablist"
          aria-label="Offer categories"
        >
          {items.map(({ id, label, Icon, count, href }) => {
            const on = active === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  if (href && (id === "hotel" || id === "restaurant")) {
                    window.location.href = href;
                    return;
                  }
                  onChange(id);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-tight transition-all ${
                  on
                    ? "scale-105 bg-zinc-900 text-white shadow-md"
                    : "border border-zinc-200/60 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    on ? "text-amber-400" : "text-zinc-500"
                  }`}
                  aria-hidden
                />
                <span>{label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    on
                      ? "bg-zinc-800 text-zinc-200"
                      : "bg-zinc-200/80 text-zinc-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sticky high-yield discount filter */}
        <div className="hidden shrink-0 items-center gap-1.5 border-l border-zinc-200 pl-4 md:flex">
          <span className="mr-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            Savings:
          </span>
          {DISCOUNT_TIERS.map((tier) => {
            const on = minDiscount === tier.val;
            return (
              <button
                key={tier.val}
                type="button"
                onClick={() => onMinDiscountChange?.(tier.val)}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  on
                    ? "bg-[#FF5E1A] text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {tier.label}
                {tier.val === 50 ? (
                  <Flame
                    className={`h-3 w-3 ${on ? "fill-white stroke-white" : "stroke-zinc-600"}`}
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile savings row */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-t border-zinc-100 px-4 py-2 no-scrollbar md:hidden">
        <span className="shrink-0 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
          Savings:
        </span>
        {DISCOUNT_TIERS.map((tier) => {
          const on = minDiscount === tier.val;
          return (
            <button
              key={tier.val}
              type="button"
              onClick={() => onMinDiscountChange?.(tier.val)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                on
                  ? "bg-[#FF5E1A] text-white"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {tier.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
