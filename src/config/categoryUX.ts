import type { OfferCategory } from "@/types/offer";

/**
 * UX category taxonomy for PDP copy — maps to merchant verticals.
 * Distinct from raw `OfferCategory` so clinical subtypes (e.g. podology) can specialize.
 */
export type CategoryType =
  | "BEAUTY"
  | "MEDICAL_PODOLOGY"
  | "FITNESS"
  | "HOSPITALITY"
  | "GASTRONOMY"
  | "CONSULTING";

export interface CategoryUXConfig {
  tab1Title: string;
  tab2Title: string;
  tab3Title: string;
  planHeaderLabel: string;
  upsellBadgeText: string;
  giftTitle: string;
  giftSubtitle: string;
  inclusionsHeader: string;
  /** Lucide-friendly glyph hint for gift / vertical accent. */
  accentIcon: "sparkles" | "stethoscope" | "dumbbell" | "hotel" | "utensils" | "briefcase";
}

export const CATEGORY_UX_MAP: Record<CategoryType, CategoryUXConfig> = {
  BEAUTY: {
    tab1Title: "1. Select Service",
    tab2Title: "2. Treatment Details",
    tab3Title: "3. Aftercare & Policy",
    planHeaderLabel: "Choose Your Beauty Package",
    upsellBadgeText: "Add Touch-up / Aftercare",
    giftTitle: "Gift a Beauty Transformation",
    giftSubtitle: "Personalized · Instant Delivery · Easy Booking",
    inclusionsHeader: "What Your Treatment Includes",
    accentIcon: "sparkles",
  },
  MEDICAL_PODOLOGY: {
    tab1Title: "1. Select Treatment",
    tab2Title: "2. Clinical Care Included",
    tab3Title: "3. Medical Disclosures",
    planHeaderLabel: "Choose Your Clinical Care",
    upsellBadgeText: "Add Diagnostic Scan",
    giftTitle: "Gift Pain-Free Mobility",
    giftSubtitle: "Care voucher valid for any specialist visit",
    inclusionsHeader: "Included Clinical Services",
    accentIcon: "stethoscope",
  },
  FITNESS: {
    tab1Title: "1. Choose Package",
    tab2Title: "2. Training & Perks",
    tab3Title: "3. Facility Rules",
    planHeaderLabel: "Select Your Training Intensity",
    upsellBadgeText: "Add Nutrition Plan",
    giftTitle: "Gift a Health Kickstart",
    giftSubtitle: "Send 1-on-1 Sessions to a Friend",
    inclusionsHeader: "Coaching Package Perks",
    accentIcon: "dumbbell",
  },
  HOSPITALITY: {
    tab1Title: "1. Select Stay",
    tab2Title: "2. Package Amenities",
    tab3Title: "3. Booking & Cancellation",
    planHeaderLabel: "Choose Your Stay Experience",
    upsellBadgeText: "Upgrade Room / Late Check-out",
    giftTitle: "Gift a Romantic Escape",
    giftSubtitle: "Flexible stay voucher valid for 12 months",
    inclusionsHeader: "Resort Amenities Included",
    accentIcon: "hotel",
  },
  GASTRONOMY: {
    tab1Title: "1. Select Menu",
    tab2Title: "2. What's Served",
    tab3Title: "3. Reservation Rules",
    planHeaderLabel: "Choose Your Dining Experience",
    upsellBadgeText: "Add Dessert & Wine Pairing",
    giftTitle: "Gift a Gourmet Dinner",
    giftSubtitle: "Instant dining voucher with personal note",
    inclusionsHeader: "Tasting Course Details",
    accentIcon: "utensils",
  },
  CONSULTING: {
    tab1Title: "1. Select Plan",
    tab2Title: "2. What's Included",
    tab3Title: "3. Fine Print & Legal",
    planHeaderLabel: "Choose Your Strategy Option",
    upsellBadgeText: "Add Strategy Block",
    giftTitle: "Make it a Gift",
    giftSubtitle: "Personalized · Instant Delivery · Easy Exchange",
    inclusionsHeader: "Consultation Deliverables",
    accentIcon: "briefcase",
  },
};

export type CategoryUXLookupInput = {
  category: OfferCategory;
  id?: string;
  title?: string;
};

/** Resolve PDP UX category from offer taxonomy + light title/id heuristics. */
export function resolveCategoryType(input: CategoryUXLookupInput): CategoryType {
  const blob = `${input.id ?? ""} ${input.title ?? ""}`.toLowerCase();

  if (input.category === "beauty") return "BEAUTY";
  if (input.category === "fitness") return "FITNESS";
  if (input.category === "hotel") return "HOSPITALITY";
  if (input.category === "restaurant") return "GASTRONOMY";
  if (input.category === "legal") return "CONSULTING";

  if (input.category === "clinic") {
    if (
      /podolog|gait|foot|orthopedic|physio|dental|clinic|medical|consult/.test(
        blob,
      )
    ) {
      return "MEDICAL_PODOLOGY";
    }
    return "MEDICAL_PODOLOGY";
  }

  if (/counsel|strategy|founder|legal|consulting/.test(blob)) {
    return "CONSULTING";
  }

  return "CONSULTING";
}

export function getCategoryUX(input: CategoryUXLookupInput): CategoryUXConfig {
  return CATEGORY_UX_MAP[resolveCategoryType(input)];
}
