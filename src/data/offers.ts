import type { Sector } from "@/types";
import {
  MERCHANT_CATALOG,
  PRACTITIONER_DIRECTORY,
  merchantStorefrontHref,
  practitionerProfileHref,
} from "@/data/merchants";
import { MARCO_RIVA_PROFILE } from "@/data/mockComparisons";

export type OfferCategory =
  | "all"
  | "clinic"
  | "beauty"
  | "fitness";

export type DirectoryOffer = {
  id: string;
  category: Exclude<OfferCategory, "all">;
  merchantName: string;
  merchantVat: string;
  city: string;
  sector: Sector;
  specialization: string;
  title: string;
  details: string;
  originalPriceCents: number;
  offerPriceCents: number;
  currency: string;
  href: string;
  image: string;
  refundNote?: string;
};

const CATEGORY_BY_SECTOR: Partial<
  Record<Sector, Exclude<OfferCategory, "all">>
> = {
  CLINIC: "clinic",
  SALON: "beauty",
  ARTISAN: "beauty",
  GYM: "fitness",
  POOL: "fitness",
};

/** Static first-visit / introductory rates across registered merchants. */
export const DIRECTORY_OFFERS: DirectoryOffer[] = [
  {
    id: "amir-metabolic-intro",
    category: "clinic",
    merchantName: "Harbor Wellness Clinic",
    merchantVat: "IL-CLINIC-001",
    city: "Tel Aviv",
    sector: "CLINIC",
    specialization: "Preventive & metabolic medicine",
    title: "First-Visit Metabolic & Preventive Consultation Rate",
    details:
      "30-minute consult with Dr. Amir Saeed — care plan and follow-up pathway included.",
    originalPriceCents: 35_000,
    offerPriceCents: 18_000,
    currency: "ils",
    href: practitionerProfileHref(PRACTITIONER_DIRECTORY["dr-amir-saeed"]),
    image: MERCHANT_CATALOG.find((m) => m.vat === "IL-CLINIC-001")!.image,
    refundNote:
      "100% Refund Guarantee if clinical evaluation determines non-candidacy",
  },
  {
    id: "noa-gait-intro",
    category: "clinic",
    merchantName: "Harbor Wellness Clinic",
    merchantVat: "IL-CLINIC-001",
    city: "Tel Aviv",
    sector: "CLINIC",
    specialization: "Sports physiotherapy & gait",
    title: "First-Visit Gait Analysis & Physiotherapy Rate",
    details:
      "Intake + gait assessment with Dr. Noa Klein (Licensed Senior Physiotherapist).",
    originalPriceCents: 32_000,
    offerPriceCents: 18_000,
    currency: "ils",
    href: practitionerProfileHref(PRACTITIONER_DIRECTORY["dr-noa-klein"]),
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    refundNote:
      "100% Refund Guarantee if clinical evaluation determines non-candidacy",
  },
  {
    id: "marco-gait-intro",
    category: "clinic",
    merchantName: "Studio Podologico Riva",
    merchantVat: "IT-PODO-001",
    city: "Milan",
    sector: "CLINIC",
    specialization: "Sports & diabetic foot care",
    title: MARCO_RIVA_PROFILE.introPasses[0]!.title,
    details:
      "First visit with Dott. Marco Riva — podiatry assessment across Milan practice nodes.",
    originalPriceCents: MARCO_RIVA_PROFILE.introPasses[0]!.originalPrice,
    offerPriceCents: MARCO_RIVA_PROFILE.introPasses[0]!.discountPrice,
    currency: MARCO_RIVA_PROFILE.introPasses[0]!.currency ?? "eur",
    href: "/p/dott-marco-riva",
    image: MARCO_RIVA_PROFILE.headshotUrl,
    refundNote: MARCO_RIVA_PROFILE.introPasses[0]!.refundGuaranteeNote,
  },
  {
    id: "lumen-balayage-intro",
    category: "beauty",
    merchantName: "Lumen Hair Studio",
    merchantVat: "IL-SALON-001",
    city: "Tel Aviv",
    sector: "SALON",
    specialization: "Lived-in color & precision cuts",
    title: "First-Visit Lived-In Color Consultation Rate",
    details:
      "Color direction consult with Lina Bar — includes finish plan for balayage or gloss.",
    originalPriceCents: 45_000,
    offerPriceCents: 22_000,
    currency: "ils",
    href: practitionerProfileHref(PRACTITIONER_DIRECTORY["lina-bar"]),
    image: MERCHANT_CATALOG.find((m) => m.vat === "IL-SALON-001")!.image,
  },
  {
    id: "lumen-pmu-intro",
    category: "beauty",
    merchantName: "Lumen Hair Studio",
    merchantVat: "IL-SALON-001",
    city: "Tel Aviv",
    sector: "SALON",
    specialization: "Permanent makeup · microblading",
    title: "Introductory Microblading Design Session",
    details:
      "Shape mapping and pigment consult — transparent tier pricing before any procedure.",
    originalPriceCents: 140_000,
    offerPriceCents: 85_000,
    currency: "ils",
    href: "/compare/microblading",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "neri-workshop-intro",
    category: "beauty",
    merchantName: "Atelier Neri Ceramics",
    merchantVat: "IL-ARTISAN-001",
    city: "Tel Aviv",
    sector: "ARTISAN",
    specialization: "Studio commissions & tableware",
    title: "First-Visit Workshop & Commission Consult",
    details:
      "Studio visit with Neri Alon — material brief and commission timeline.",
    originalPriceCents: 38_000,
    offerPriceCents: 19_000,
    currency: "ils",
    href: practitionerProfileHref(PRACTITIONER_DIRECTORY["neri-alon"]),
    image: MERCHANT_CATALOG.find((m) => m.vat === "IL-ARTISAN-001")!.image,
  },
  {
    id: "maya-trial-intro",
    category: "fitness",
    merchantName: "Iron Forge Gym",
    merchantVat: "IL-GYM-001",
    city: "Tel Aviv",
    sector: "GYM",
    specialization: "Strength & form coaching",
    title: "First-Visit Form Coaching Session Rate",
    details:
      "45-minute coaching block with Maya Cohen — form check and starter block outline.",
    originalPriceCents: 25_000,
    offerPriceCents: 9_900,
    currency: "ils",
    href: practitionerProfileHref(PRACTITIONER_DIRECTORY["maya-cohen"]),
    image: MERCHANT_CATALOG.find((m) => m.vat === "IL-GYM-001")!.image,
    refundNote:
      "100% Refund Guarantee if coaching evaluation determines non-candidacy",
  },
];

export const OFFER_CATEGORY_FILTERS: Array<{
  id: OfferCategory;
  label: string;
}> = [
  { id: "all", label: "All Offers" },
  { id: "clinic", label: "Clinic & Medical" },
  { id: "beauty", label: "Beauty & PMU" },
  { id: "fitness", label: "Fitness & Body" },
];

function normalizeCity(city: string): string {
  const c = city.trim().toLowerCase();
  if (c === "milano" || c === "milan") return "milan";
  if (c === "tel aviv" || c === "tel-aviv" || c === "tlv") return "tel aviv";
  return c;
}

export function filterOffers(
  offers: DirectoryOffer[],
  category: OfferCategory,
  city?: string,
): DirectoryOffer[] {
  const cityQ = city ? normalizeCity(city) : "";
  return offers.filter((o) => {
    if (category !== "all" && o.category !== category) return false;
    if (cityQ && !normalizeCity(o.city).includes(cityQ) && !cityQ.includes(normalizeCity(o.city))) {
      return false;
    }
    return true;
  });
}

export function offerCities(): string[] {
  return [...new Set(DIRECTORY_OFFERS.map((o) => o.city))].sort();
}

export function categoryForSector(
  sector: Sector,
): Exclude<OfferCategory, "all"> | null {
  return CATEGORY_BY_SECTOR[sector] ?? null;
}

export function merchantHrefForOffer(offer: DirectoryOffer): string {
  const m = MERCHANT_CATALOG.find((x) => x.vat === offer.merchantVat);
  return m ? merchantStorefrontHref(m) : offer.href;
}
