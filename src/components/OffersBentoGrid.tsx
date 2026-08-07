"use client";

import {
  CategoryBentoGrid,
  CATEGORY_BENTO_ITEMS,
  type CategoryBentoGridProps,
  type CategoryBentoItem,
} from "@/components/home/CategoryBentoGrid";
import type { MockOfferCategory } from "@/data/mockOffers";

/** @deprecated Prefer `CategoryBentoItem` — kept for hub type imports. */
export type OffersBentoBanner = CategoryBentoItem;

/** @deprecated Prefer `CATEGORY_BENTO_ITEMS`. */
export const BANNERS = CATEGORY_BENTO_ITEMS;

type Props = {
  onSelectCategory?: (category: Exclude<MockOfferCategory, "all">) => void;
};

/**
 * Offers-hub bento — delegates to `<CategoryBentoGrid/>` (7-card asymmetrical balance).
 */
export function OffersBentoGrid({ onSelectCategory }: Props) {
  return <CategoryBentoGrid onSelectCategory={onSelectCategory} />;
}

export type { CategoryBentoGridProps };
export default OffersBentoGrid;
