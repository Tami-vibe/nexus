/** Dense Groupon-style introductory offers for /offers hub. */

import type {
  HotelDetails,
  Offer,
  OfferCategory,
  RestaurantDetails,
} from "@/types/offer";

export type MockOfferCategory = "all" | OfferCategory;

export type MockOffer = {
  id: string;
  category: OfferCategory;
  categoryTag: string;
  title: string;
  merchantName: string;
  practitionerName?: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  originalPriceCents: number;
  offerPriceCents: number;
  currency: string;
  details: string;
  image: string;
  href: string;
  refundNote?: string;
  /** Deal-specific inclusion bullets for PDP checklist. */
  inclusions?: string[];
  /** Optional micro-upsell shown on PDP plan / included tabs. */
  upsell?: {
    description: string;
    price: number;
  };
  hotelDetails?: HotelDetails;
  restaurantDetails?: RestaurantDetails;
};

export const MOCK_OFFER_FILTERS: Array<{
  id: MockOfferCategory;
  label: string;
}> = [
  { id: "all", label: "All Offers" },
  { id: "clinic", label: "Clinic & Medical" },
  { id: "beauty", label: "Beauty & PMU" },
  { id: "fitness", label: "Fitness & Body" },
  { id: "hotel", label: "Hotels & Stays" },
  { id: "restaurant", label: "Fine Dining & Gourmet" },
  { id: "legal", label: "Legal & Counsel" },
];

/** Reliable Unsplash covers — used as primary + onError fallback. */
export const OFFER_COVER_FALLBACKS: Record<OfferCategory, string> = {
  clinic:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
  beauty:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
  fitness:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  restaurant:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  legal:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
};

export function offerCoverFallback(category: OfferCategory): string {
  return OFFER_COVER_FALLBACKS[category];
}

/** Map MockOffer → canonical Offer (major currency units). */
export function toOffer(m: MockOffer): Offer {
  const discountPercent = Math.round(
    ((m.originalPriceCents - m.offerPriceCents) / m.originalPriceCents) * 100,
  );
  return {
    id: m.id,
    title: m.title,
    category: m.category,
    merchantName: m.merchantName,
    location: m.city,
    distanceKm: m.distanceKm,
    rating: m.rating,
    reviewsCount: m.reviewCount,
    originalPrice: m.originalPriceCents / 100,
    discountPrice: m.offerPriceCents / 100,
    discountPercent,
    image: m.image,
    hotelDetails: m.hotelDetails,
    restaurantDetails: m.restaurantDetails,
  };
}

export const MOCK_OFFERS: MockOffer[] = [
  {
    id: "podology-gait-milan",
    category: "clinic",
    categoryTag: "🩺 Clinic",
    title: "First-Visit Podology & Gait Analysis",
    merchantName: "Studio Podologico Riva",
    practitionerName: "Dott. Marco Riva",
    city: "Milan",
    distanceKm: 1.2,
    rating: 4.9,
    reviewCount: 188,
    originalPriceCents: 28_000,
    offerPriceCents: 18_000,
    currency: "eur",
    details:
      "Biomechanical gait assessment and care plan with a licensed podiatrist.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    href: "/p/dott-marco-riva",
    refundNote:
      "100% Refund Guarantee if clinical evaluation determines non-candidacy",
  },
  {
    id: "post-op-physio",
    category: "clinic",
    categoryTag: "🩺 Clinic",
    title: "Post-Op Physio Intake",
    merchantName: "Harbor Wellness Clinic",
    practitionerName: "Dr. Noa Klein",
    city: "Tel Aviv",
    distanceKm: 2.4,
    rating: 4.8,
    reviewCount: 210,
    originalPriceCents: 14_000,
    offerPriceCents: 8_500,
    currency: "eur",
    details:
      "Structured post-surgical mobility intake with Licensed Senior Physiotherapist.",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
    href: "/IL-CLINIC-001/p/noa-klein",
    refundNote:
      "100% Refund Guarantee if clinical evaluation determines non-candidacy",
  },
  {
    id: "dental-hygiene",
    category: "clinic",
    categoryTag: "🩺 Clinic",
    title: "Full Dental Hygiene & Assessment",
    merchantName: "Harbor Wellness Clinic",
    practitionerName: "Dr. Amir Saeed",
    city: "Milan",
    distanceKm: 3.1,
    rating: 5.0,
    reviewCount: 96,
    originalPriceCents: 14_000,
    offerPriceCents: 9_000,
    currency: "eur",
    details:
      "Full hygiene session plus oral assessment — first-visit preventive package.",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
    href: "/IL-CLINIC-001/p/amir-saeed",
  },
  {
    id: "metabolic-consult",
    category: "clinic",
    categoryTag: "🩺 Clinic",
    title: "First-Visit Metabolic Consultation",
    merchantName: "Harbor Wellness Clinic",
    practitionerName: "Dr. Amir Saeed",
    city: "Tel Aviv",
    distanceKm: 1.8,
    rating: 4.9,
    reviewCount: 120,
    originalPriceCents: 35_000,
    offerPriceCents: 18_000,
    currency: "ils",
    details: "Unhurried preventive consult with Specialist MD — clear care plan.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    href: "/IL-CLINIC-001/p/amir-saeed",
    refundNote:
      "100% Refund Guarantee if clinical evaluation determines non-candidacy",
  },
  {
    id: "microblading-master",
    category: "beauty",
    categoryTag: "🎨 Beauty",
    title: "Master Microblading Eyebrows",
    merchantName: "Lumen Hair Studio",
    practitionerName: "Lina Bar",
    city: "Tel Aviv",
    distanceKm: 0.9,
    rating: 4.9,
    reviewCount: 312,
    originalPriceCents: 220_000,
    offerPriceCents: 140_000,
    currency: "ils",
    details:
      "Master-tier microblading design with transparent market comparison.",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80",
    href: "/compare/microblading",
    inclusions: [
      "Full brow design & mapping",
      "Sterile single-use tools",
      "Numbing for comfort",
      "Aftercare kit & guidance",
      "Touch-up window listed",
    ],
    upsell: {
      description: "Premium aftercare kit with pigment sealant",
      price: 15,
    },
  },
  {
    id: "laser-hair",
    category: "beauty",
    categoryTag: "🎨 Beauty",
    title: "Laser Hair Removal Session",
    merchantName: "Lumen Hair Studio",
    city: "Milan",
    distanceKm: 2.0,
    rating: 4.7,
    reviewCount: 154,
    originalPriceCents: 9_500,
    offerPriceCents: 6_000,
    currency: "eur",
    details: "Single-zone laser session — patch test and aftercare guidance included.",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80",
    href: "/IL-SALON-001",
  },
  {
    id: "anti-aging-facial",
    category: "beauty",
    categoryTag: "🎨 Beauty",
    title: "Anti-Aging Facial Assessment",
    merchantName: "Lumen Hair Studio",
    city: "Milan",
    distanceKm: 1.5,
    rating: 4.8,
    reviewCount: 89,
    originalPriceCents: 16_000,
    offerPriceCents: 11_000,
    currency: "eur",
    details:
      "Skin assessment and first facial protocol — no package pressure.",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80",
    href: "/IL-SALON-001/p/lina-bar",
  },
  {
    id: "lived-in-color",
    category: "beauty",
    categoryTag: "🎨 Beauty",
    title: "First-Visit Lived-In Color Consult",
    merchantName: "Lumen Hair Studio",
    practitionerName: "Lina Bar",
    city: "Tel Aviv",
    distanceKm: 1.1,
    rating: 4.9,
    reviewCount: 128,
    originalPriceCents: 45_000,
    offerPriceCents: 22_000,
    currency: "ils",
    details: "Color direction consult with finish plan for balayage or gloss.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    href: "/IL-SALON-001/p/lina-bar",
  },
  {
    id: "pt-kickstart",
    category: "fitness",
    categoryTag: "🏋️ Fitness",
    title: "Personal Trainer 3-Session Kickstart",
    merchantName: "Iron Forge Gym",
    practitionerName: "Maya Cohen",
    city: "Tel Aviv",
    distanceKm: 1.6,
    rating: 4.9,
    reviewCount: 240,
    originalPriceCents: 18_000,
    offerPriceCents: 12_000,
    currency: "eur",
    details: "Three form-focused coaching sessions — starter block outline included.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    href: "/IL-GYM-001/p/maya-cohen",
  },
  {
    id: "posture-analysis",
    category: "fitness",
    categoryTag: "🏋️ Fitness",
    title: "Clinical Posture Analysis",
    merchantName: "Iron Forge Gym",
    practitionerName: "Maya Cohen",
    city: "Milan",
    distanceKm: 2.8,
    rating: 4.8,
    reviewCount: 76,
    originalPriceCents: 11_000,
    offerPriceCents: 7_500,
    currency: "eur",
    details: "Posture screen + corrective mobility plan for desk and training load.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
    href: "/IL-GYM-001",
  },
  {
    id: "form-coaching",
    category: "fitness",
    categoryTag: "🏋️ Fitness",
    title: "First-Visit Form Coaching Session",
    merchantName: "Iron Forge Gym",
    practitionerName: "Maya Cohen",
    city: "Tel Aviv",
    distanceKm: 0.7,
    rating: 4.9,
    reviewCount: 214,
    originalPriceCents: 25_000,
    offerPriceCents: 9_900,
    currency: "ils",
    details: "45-minute open-floor coaching with live capacity awareness.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
    href: "/IL-GYM-001/p/maya-cohen",
  },
  {
    id: "founder-counsel",
    category: "legal",
    categoryTag: "⚖️ Legal",
    title: "First-Visit Founder Strategy Consult",
    merchantName: "Northline Counsel",
    practitionerName: "Jordan Lee",
    city: "Tel Aviv",
    distanceKm: 1.3,
    rating: 4.8,
    reviewCount: 42,
    originalPriceCents: 120_000,
    offerPriceCents: 45_000,
    currency: "ils",
    details: "Confidential 45-min M&A / founder strategy session with bar-accredited counsel.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    href: "/IL-DIGITAL-001/p/jordan-lee",
    refundNote:
      "100% Refund Guarantee if counsel evaluation determines non-candidacy",
    inclusions: [
      "60-min founder strategy consult",
      "Pre-session materials review",
      "Written actionable roadmap",
      "Licensed counsel: Jordan Lee",
      "Refund if non-candidate",
    ],
    upsell: {
      description: "90-minute deep-dive strategy block with written follow-up",
      price: 75,
    },
  },
  {
    id: "grand-hotel-como",
    category: "hotel",
    categoryTag: "Hotels & Stays",
    title: "Lake Escape · Grand Hotel Lake Como",
    merchantName: "Grand Hotel Lake Como",
    city: "Como",
    distanceKm: 48.0,
    rating: 4.9,
    reviewCount: 412,
    originalPriceCents: 89_000,
    offerPriceCents: 59_000,
    currency: "eur",
    details: "Two-night lake-view suite with breakfast and spa day pass.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    href: "/hotels",
    hotelDetails: {
      stars: 5,
      nights: 2,
      roomType: "Deluxe Lake Suite",
      perks: ["Breakfast Included", "Spa Pass", "Late Checkout"],
    },
  },
  {
    id: "milan-boutique-stay",
    category: "hotel",
    categoryTag: "Hotels & Stays",
    title: "Milan Boutique Weekend Stay",
    merchantName: "Casa Navigli Boutique",
    city: "Milan",
    distanceKm: 1.4,
    rating: 4.8,
    reviewCount: 268,
    originalPriceCents: 42_000,
    offerPriceCents: 28_000,
    currency: "eur",
    details: "Design room in Navigli with welcome aperitivo and breakfast.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    href: "/hotels",
    hotelDetails: {
      stars: 4,
      nights: 2,
      roomType: "Boutique Deluxe",
      perks: ["Breakfast Included", "Welcome Aperitivo"],
    },
  },
  {
    id: "amalfi-cliff-resort",
    category: "hotel",
    categoryTag: "Hotels & Stays",
    title: "Amalfi Cliff Spa Resort Escape",
    merchantName: "Positano Cliff Resort",
    city: "Positano",
    distanceKm: 260,
    rating: 4.9,
    reviewCount: 531,
    originalPriceCents: 120_000,
    offerPriceCents: 79_000,
    currency: "eur",
    details: "Three-night cliff suite with infinity pool and couples spa ritual.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    href: "/hotels",
    hotelDetails: {
      stars: 5,
      nights: 3,
      roomType: "Cliff Panorama Suite",
      perks: ["Breakfast Included", "Spa Pass", "Pool Access"],
    },
  },
  {
    id: "tlv-design-hotel",
    category: "hotel",
    categoryTag: "Hotels & Stays",
    title: "Tel Aviv Design Hotel Night",
    merchantName: "Rothschild Design Hotel",
    city: "Tel Aviv",
    distanceKm: 0.8,
    rating: 4.7,
    reviewCount: 190,
    originalPriceCents: 180_000,
    offerPriceCents: 120_000,
    currency: "ils",
    details: "One-night city stay with rooftop breakfast and late checkout.",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    href: "/hotels",
    hotelDetails: {
      stars: 4,
      nights: 1,
      roomType: "Design King",
      perks: ["Rooftop Breakfast", "Late Checkout"],
    },
  },
  {
    id: "michelin-tasting-milan",
    category: "restaurant",
    categoryTag: "Fine Dining",
    title: "Michelin Star 5-Course Tasting Menu",
    merchantName: "Osteria Lumière",
    city: "Milan",
    distanceKm: 2.1,
    rating: 4.9,
    reviewCount: 318,
    originalPriceCents: 18_000,
    offerPriceCents: 12_500,
    currency: "eur",
    details: "Five-course tasting with wine pairing credit for two.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    href: "/restaurants",
    restaurantDetails: {
      cuisine: "Italian Fine Dining",
      menuType: "5-Course Tasting Menu",
      priceTier: "€€€€",
    },
  },
  {
    id: "chef-table-como",
    category: "restaurant",
    categoryTag: "Fine Dining",
    title: "Chef's Table · Lake Como",
    merchantName: "Villa Sereno Kitchen",
    city: "Como",
    distanceKm: 46,
    rating: 4.8,
    reviewCount: 142,
    originalPriceCents: 22_000,
    offerPriceCents: 15_000,
    currency: "eur",
    details: "Counter seating tasting with lakeside sunset seating window.",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed37ceb430e?auto=format&fit=crop&w=1200&q=80",
    href: "/restaurants",
    restaurantDetails: {
      cuisine: "Contemporary Italian",
      menuType: "Chef's Table Tasting",
      priceTier: "€€€€",
    },
  },
  {
    id: "tlv-omakase",
    category: "restaurant",
    categoryTag: "Fine Dining",
    title: "Tel Aviv Omakase Evening",
    merchantName: "Kura Counter",
    city: "Tel Aviv",
    distanceKm: 1.9,
    rating: 4.9,
    reviewCount: 206,
    originalPriceCents: 45_000,
    offerPriceCents: 32_000,
    currency: "ils",
    details: "12-course omakase with sake pairing for one.",
    image:
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80",
    href: "/restaurants",
    restaurantDetails: {
      cuisine: "Japanese Omakase",
      menuType: "12-Course Omakase",
      priceTier: "€€€€",
    },
  },
  {
    id: "milan-trattoria-gourmet",
    category: "restaurant",
    categoryTag: "Fine Dining",
    title: "Gourmet Trattoria Dinner for Two",
    merchantName: "Trattoria del Corso",
    city: "Milan",
    distanceKm: 0.9,
    rating: 4.7,
    reviewCount: 524,
    originalPriceCents: 12_000,
    offerPriceCents: 8_500,
    currency: "eur",
    details: "Three-course seasonal menu with prosecco welcome.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    href: "/restaurants",
    restaurantDetails: {
      cuisine: "Italian",
      menuType: "3-Course Seasonal Menu",
      priceTier: "€€€",
    },
  },
];

export function discountPercent(offer: MockOffer): number {
  if (offer.originalPriceCents <= 0) return 0;
  return Math.round(
    ((offer.originalPriceCents - offer.offerPriceCents) /
      offer.originalPriceCents) *
      100,
  );
}

function normalizeCity(city: string): string {
  const c = city.trim().toLowerCase();
  if (c === "milano" || c === "milan") return "milan";
  if (c === "tel aviv" || c === "tel-aviv" || c === "tlv") return "tel aviv";
  return c;
}

export function filterMockOffers(
  offers: MockOffer[],
  opts: {
    category: MockOfferCategory;
    query?: string;
    city?: string;
  },
): MockOffer[] {
  const q = opts.query?.trim().toLowerCase() ?? "";
  const cityQ = opts.city ? normalizeCity(opts.city) : "";

  const filtered = offers.filter((o) => {
    if (opts.category !== "all" && o.category !== opts.category) return false;
    if (q) {
      const hay = [
        o.title,
        o.merchantName,
        o.practitionerName ?? "",
        o.details,
        o.city,
        o.categoryTag,
      ]
        .join(" ")
        .toLowerCase();
      if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  });

  if (!cityQ) return filtered;

  const inCity = filtered.filter(
    (o) =>
      normalizeCity(o.city).includes(cityQ) ||
      cityQ.includes(normalizeCity(o.city)),
  );
  // Soft location: if empty for city, keep category/search results
  return inCity.length > 0 ? inCity : filtered;
}
