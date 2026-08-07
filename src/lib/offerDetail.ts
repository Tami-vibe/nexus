import type { MockOffer } from "@/data/mockOffers";
import { MOCK_OFFERS } from "@/data/mockOffers";
import type { OfferCategory } from "@/types/offer";

export type PackageOption = {
  id: number;
  title: string;
  price: number;
  original: number;
  discountLabel: string;
  durationLabel: string;
};

export type IncludeTile = {
  label: string;
  hint: string;
};

export type OfferUpsell = {
  description: string;
  price: number;
};

export type OfferReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  optionBought: string;
  comment: string;
  helpfulCount: number;
  verified: boolean;
};

export type MerchantHub = {
  id: string;
  name: string;
  website: string;
  nexusStorefront: string;
  address: string;
  phone: string;
  description: string;
};

export type OfferTerms = {
  booking: string;
  additionalInfo: string | null;
  addOnBadge: string | null;
  rules: string[];
  /** Legacy short legal line — superseded by structured disclosures below. */
  legal: string;
  /** Days until promotional (discount) value expires. */
  promoExpiryDays: number;
  cancellationPolicy: string;
  redemptionLimits: string;
  transferability: string;
  appointmentRequirement: string;
};

export type OfferDetailModel = {
  offer: MockOffer;
  packages: PackageOption[];
  /** Legacy tile shape — kept for compatibility; prefer `inclusions`. */
  includes: IncludeTile[];
  /** Dynamic checklist bullets for What's Included. */
  inclusions: string[];
  upsell: OfferUpsell | null;
  gallery: string[];
  insightTags: string[];
  summaryText: string;
  reviews: OfferReview[];
  merchant: MerchantHub;
  terms: OfferTerms;
  redeemedLabel: string;
  distanceMi: number;
  address: string;
  hours: string[];
  website: string;
  mapsUrl: string;
  promoCode: string;
  promoAmount: number;
  reviewPhotos: string[];
};

/** Category media — never cross-contaminate spa into legal/consulting. */
const CATEGORY_GALLERY: Record<OfferCategory, string[]> = {
  legal: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  ],
  clinic: [
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1631217868264-e5b90bb9e57b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80",
  ],
  fitness: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80",
  ],
};

function money(cents: number): number {
  return Math.round(cents) / 100;
}

function discountLabel(original: number, price: number): string {
  if (original <= 0) return "Deal";
  const pct = Math.round(((original - price) / original) * 100);
  return `${pct}% OFF`;
}

function isConsultingOffer(offer: MockOffer): boolean {
  if (offer.category === "legal") return true;
  const key = `${offer.id} ${offer.title}`.toLowerCase();
  return (
    key.includes("counsel") ||
    key.includes("strategy") ||
    key.includes("founder") ||
    key.includes("consult")
  );
}

function packagesFor(offer: MockOffer): PackageOption[] {
  const basePrice = money(offer.offerPriceCents);
  const baseOriginal = money(offer.originalPriceCents);

  if (offer.hotelDetails) {
    const nights = offer.hotelDetails.nights;
    return [
      {
        id: 0,
        title: `${nights}-Night Stay · ${offer.hotelDetails.roomType}`,
        price: basePrice,
        original: baseOriginal,
        discountLabel: discountLabel(baseOriginal, basePrice),
        durationLabel: `${nights} nights · Free cancellation window`,
      },
      {
        id: 1,
        title: `${nights + 1}-Night Stay · Suite upgrade`,
        price: Math.round(basePrice * 1.55 * 100) / 100,
        original: Math.round(baseOriginal * 1.7 * 100) / 100,
        discountLabel: "48% OFF",
        durationLabel: `${nights + 1} nights · Breakfast included`,
      },
    ];
  }

  if (offer.restaurantDetails) {
    return [
      {
        id: 0,
        title: offer.title,
        price: basePrice,
        original: baseOriginal,
        discountLabel: discountLabel(baseOriginal, basePrice),
        durationLabel: "Dining credit · Instant voucher",
      },
      {
        id: 1,
        title: `${offer.title} · Chef’s tasting add-on`,
        price: Math.round(basePrice * 1.45 * 100) / 100,
        original: Math.round(baseOriginal * 1.6 * 100) / 100,
        discountLabel: "45% OFF",
        durationLabel: "Party of 2 · Weekend seating",
      },
    ];
  }

  if (offer.category === "clinic" || isConsultingOffer(offer)) {
    return [
      {
        id: 0,
        title: offer.title,
        price: basePrice,
        original: baseOriginal,
        discountLabel: discountLabel(baseOriginal, basePrice),
        durationLabel: isConsultingOffer(offer)
          ? "60-min session · Instant confirmation"
          : "New-client visit · Instant confirmation",
      },
      {
        id: 1,
        title: isConsultingOffer(offer)
          ? `${offer.title} + follow-up strategy call`
          : `${offer.title} + follow-up visit`,
        price: Math.round(basePrice * 1.65 * 100) / 100,
        original: Math.round(baseOriginal * 1.85 * 100) / 100,
        discountLabel: "40% OFF",
        durationLabel: isConsultingOffer(offer)
          ? "2 sessions · Written action plan"
          : "2 visits · Care plan included",
      },
    ];
  }

  return [
    {
      id: 0,
      title: offer.title,
      price: basePrice,
      original: baseOriginal,
      discountLabel: discountLabel(baseOriginal, basePrice),
      durationLabel: "60 Mins · Instant digital voucher",
    },
    {
      id: 1,
      title: `Couples / Premium · ${offer.title}`,
      price: Math.round(basePrice * 1.75 * 100) / 100,
      original: Math.round(baseOriginal * 2 * 100) / 100,
      discountLabel: "50% OFF",
      durationLabel: "90 Mins · Gift-ready delivery",
    },
  ];
}

function includesFor(offer: MockOffer): IncludeTile[] {
  if (offer.hotelDetails) {
    return [
      { label: "Room night(s)", hint: offer.hotelDetails.roomType },
      { label: "Free cancellation", hint: "Within policy window" },
      { label: "Wi‑Fi & essentials", hint: "Property amenities" },
      { label: "Flexible check-in", hint: "Subject to availability" },
      { label: "Instant voucher", hint: "Email + wallet pass" },
    ];
  }
  if (offer.restaurantDetails) {
    return [
      { label: "Dining credit", hint: "Applied at checkout" },
      { label: "Menu", hint: offer.restaurantDetails.menuType },
      { label: "Cuisine", hint: offer.restaurantDetails.cuisine },
      { label: "Reservation assist", hint: "Merchant confirmation" },
      { label: "Instant voucher", hint: "Show QR at venue" },
    ];
  }
  if (isConsultingOffer(offer)) {
    return [
      { label: "Strategy session", hint: "60-minute focused consult" },
      { label: "Pre-read prep", hint: "Materials reviewed in advance" },
      { label: "Actionable roadmap", hint: "Written next steps" },
      { label: "Licensed counsel", hint: offer.practitionerName ?? "Verified" },
      {
        label: "Refund policy",
        hint: offer.refundNote ?? "Easy refund if scope mismatch",
      },
    ];
  }
  if (offer.category === "clinic") {
    return [
      { label: "Clinical assessment", hint: "Provider-led visit" },
      { label: "Care recommendations", hint: "Written summary" },
      { label: "Licensed practitioner", hint: offer.practitionerName ?? "Verified" },
      { label: "Transparent pricing", hint: "Listed rates" },
      {
        label: "Candidate refund path",
        hint: offer.refundNote ?? "If not a treatment candidate",
      },
    ];
  }
  if (offer.category === "fitness") {
    return [
      { label: "Coaching session", hint: "Form & programming" },
      { label: "Facility access", hint: "During booked window" },
      { label: "Progress notes", hint: "Take-home cues" },
      { label: "Certified trainer", hint: "Verified credentials" },
      { label: "Dedicated Client Support", hint: "" },
    ];
  }
  return [
    { label: "Deep Tissue / Swedish", hint: "" },
    { label: "Organic Hot Stones", hint: "" },
    { label: "Aromatherapy Oils", hint: "" },
    { label: "Post-Session Herbal Tea", hint: "" },
    { label: "Dedicated Client Support", hint: "" },
  ];
}

function inclusionsFor(offer: MockOffer): string[] {
  if (offer.inclusions?.length) return offer.inclusions;
  return includesFor(offer).map((tile) =>
    tile.hint ? `${tile.label} — ${tile.hint}` : tile.label,
  );
}

function upsellFor(offer: MockOffer, terms: OfferTerms): OfferUpsell | null {
  if (offer.upsell) return offer.upsell;
  if (!terms.additionalInfo && !terms.addOnBadge) return null;
  const fromBadge = terms.addOnBadge?.match(/\+?\s*\$?\s*([\d]+(?:\.\d+)?)/);
  const price = fromBadge ? Number(fromBadge[1]) : 0;
  return {
    description:
      terms.additionalInfo?.replace(/^Upgrade to |^Optional |^Add /i, "") ??
      terms.addOnBadge ??
      "Optional merchant upgrade",
    price,
  };
}

function insightsFor(offer: MockOffer): string[] {
  if (isConsultingOffer(offer)) {
    return [
      "#ActionableAdvice",
      "#StrategicClarity",
      "#ExperiencedCounsel",
      "#PunctualSession",
    ];
  }
  if (offer.category === "beauty") {
    return [
      "#RelaxingAmbiance",
      "#SkilledTherapist",
      "#HotStoneRelief",
      "#CleanFacility",
    ];
  }
  if (offer.category === "restaurant") {
    return [
      "#FreshIngredients",
      "#GreatCocktails",
      "#AttentiveService",
      "#CozyVibe",
    ];
  }
  if (offer.category === "hotel") {
    return ["#CleanRooms", "#QuietNights", "#GreatLocation", "#EasyCheckIn"];
  }
  if (offer.category === "clinic") {
    return [
      "#ThoroughAssessment",
      "#ClearExplanations",
      "#OnTimeVisit",
      "#ProfessionalStaff",
    ];
  }
  if (offer.category === "fitness") {
    return [
      "#FormFocused",
      "#MotivatingCoach",
      "#CleanGym",
      "#ResultsOriented",
    ];
  }
  return ["#GreatValue", "#SmoothBooking", "#VerifiedMerchant", "#WorthRedeeming"];
}

function summaryFor(offer: MockOffer): string {
  if (isConsultingOffer(offer)) {
    return `Clients highlight clear actionable guidance from ${offer.merchantName}. Consensus: high-value strategic audit, transparent communication, and thorough preparation.`;
  }
  if (offer.category === "beauty") {
    return `Guests highlight consistent treatment quality from ${offer.merchantName}. Consensus: strong stress relief, easy booking flow, and skilled therapists.`;
  }
  if (offer.category === "restaurant") {
    return `Diners highlight flavor and hospitality at ${offer.merchantName}. Consensus: fresh ingredients, attentive service, and a cozy vibe worth returning for.`;
  }
  if (offer.category === "hotel") {
    return `Guests highlight comfort and location at ${offer.merchantName}. Consensus: clean rooms, quiet nights, and straightforward check-in.`;
  }
  if (offer.category === "clinic") {
    return `Patients highlight thorough care from ${offer.merchantName}. Consensus: clear explanations, on-time visits, and professional staff.`;
  }
  if (offer.category === "fitness") {
    return `Members highlight coaching quality at ${offer.merchantName}. Consensus: form-focused sessions, motivating trainers, and a clean facility.`;
  }
  return `Clients highlight consistent quality from ${offer.merchantName}. Consensus: strong value versus list price and a polished on-site experience.`;
}

function reviewsFor(offer: MockOffer): OfferReview[] {
  if (isConsultingOffer(offer)) {
    return [
      {
        id: "1",
        author: "Alex M.",
        rating: 5,
        date: "3 days ago",
        optionBought: offer.title,
        comment:
          "Extremely insightful 60 minutes. They reviewed our cap table and revenue projections beforehand and gave us 4 concrete action points that saved us weeks of guesswork.",
        helpfulCount: 12,
        verified: true,
      },
      {
        id: "2",
        author: "Daniel K.",
        rating: 5,
        date: "1 week ago",
        optionBought: offer.title,
        comment:
          "Clear, concise, and no fluff. Walked away with a refined go-to-market plan and contract templates. Worth twice the price.",
        helpfulCount: 8,
        verified: true,
      },
      {
        id: "3",
        author: "Maya R.",
        rating: 4,
        date: "2 weeks ago",
        optionBought: offer.title,
        comment:
          "Punctual, prepared, and strategic. Would have loved a longer follow-up slot, but the written roadmap alone justified the fee.",
        helpfulCount: 5,
        verified: true,
      },
      {
        id: "4",
        author: "Omar S.",
        rating: 5,
        date: "3 weeks ago",
        optionBought: `${offer.title} + follow-up`,
        comment:
          "Second session locked our hiring plan and term-sheet priorities. Experienced counsel who actually understands early-stage ops.",
        helpfulCount: 9,
        verified: true,
      },
    ];
  }

  if (offer.category === "beauty") {
    return [
      {
        id: "1",
        author: "Sarah L.",
        rating: 5,
        date: "2 days ago",
        optionBought: offer.title,
        comment:
          "Best session I have had in months. Great pressure calibration, hot stones were heavenly, and the room was spotless.",
        helpfulCount: 15,
        verified: true,
      },
      {
        id: "2",
        author: "Nina P.",
        rating: 5,
        date: "5 days ago",
        optionBought: offer.title,
        comment:
          "Relaxing ambiance and a skilled therapist who listened. Booking and redemption were effortless.",
        helpfulCount: 11,
        verified: true,
      },
      {
        id: "3",
        author: "Elena V.",
        rating: 4,
        date: "1 week ago",
        optionBought: offer.title,
        comment:
          "Clean facility, lovely aromatherapy. Slight wait at reception, but the treatment more than made up for it.",
        helpfulCount: 6,
        verified: true,
      },
      {
        id: "4",
        author: "Jordan T.",
        rating: 5,
        date: "2 weeks ago",
        optionBought: `Premium · ${offer.title}`,
        comment:
          "Hot stone relief was excellent. Will gift this voucher to friends — pure reset button.",
        helpfulCount: 10,
        verified: true,
      },
    ];
  }

  if (offer.category === "restaurant") {
    return [
      {
        id: "1",
        author: "Chris B.",
        rating: 5,
        date: "2 days ago",
        optionBought: offer.title,
        comment:
          "Fresh ingredients, gorgeous plating, and cocktails that actually balance. Service never missed a beat.",
        helpfulCount: 14,
        verified: true,
      },
      {
        id: "2",
        author: "Leah G.",
        rating: 5,
        date: "6 days ago",
        optionBought: offer.title,
        comment:
          "Cozy vibe without being loud. The tasting progression was thoughtful — worth every euro of the credit.",
        helpfulCount: 9,
        verified: true,
      },
      {
        id: "3",
        author: "Marco F.",
        rating: 4,
        date: "2 weeks ago",
        optionBought: offer.title,
        comment:
          "Attentive service and a great bar program. Would book again for a date night.",
        helpfulCount: 7,
        verified: true,
      },
    ];
  }

  if (offer.category === "hotel") {
    return [
      {
        id: "1",
        author: "Priya N.",
        rating: 5,
        date: "4 days ago",
        optionBought: offer.title,
        comment:
          "Spotless room, quiet nights, and check-in took under five minutes. Location made walking everywhere easy.",
        helpfulCount: 18,
        verified: true,
      },
      {
        id: "2",
        author: "Tom H.",
        rating: 4,
        date: "1 week ago",
        optionBought: offer.title,
        comment:
          "Comfortable stay and fair upgrade path. Breakfast was solid; views were the highlight.",
        helpfulCount: 8,
        verified: true,
      },
      {
        id: "3",
        author: "Sofia A.",
        rating: 5,
        date: "3 weeks ago",
        optionBought: offer.title,
        comment:
          "Exactly as listed. Clean, well-located, and staff sorted late arrival without drama.",
        helpfulCount: 12,
        verified: true,
      },
    ];
  }

  if (offer.category === "clinic") {
    return [
      {
        id: "1",
        author: "Hannah W.",
        rating: 5,
        date: "3 days ago",
        optionBought: offer.title,
        comment:
          "Thorough assessment and clear explanations. Felt heard, and the care plan was practical — not a sales pitch.",
        helpfulCount: 16,
        verified: true,
      },
      {
        id: "2",
        author: "Itai C.",
        rating: 5,
        date: "1 week ago",
        optionBought: offer.title,
        comment:
          "On-time visit, professional staff, transparent pricing. Would recommend for a first consult.",
        helpfulCount: 10,
        verified: true,
      },
      {
        id: "3",
        author: "Ruth D.",
        rating: 4,
        date: "2 weeks ago",
        optionBought: offer.title,
        comment:
          "Solid clinical reasoning and follow-up notes. Waiting room was calm; redemption was smooth.",
        helpfulCount: 7,
        verified: true,
      },
    ];
  }

  if (offer.category === "fitness") {
    return [
      {
        id: "1",
        author: "Jake M.",
        rating: 5,
        date: "2 days ago",
        optionBought: offer.title,
        comment:
          "Form-focused coaching that fixed my squat immediately. Clean gym and a motivating trainer.",
        helpfulCount: 13,
        verified: true,
      },
      {
        id: "2",
        author: "Ava L.",
        rating: 5,
        date: "1 week ago",
        optionBought: offer.title,
        comment:
          "Results-oriented session with take-home cues. Felt like a private PT hour, not a cookie-cutter class.",
        helpfulCount: 9,
        verified: true,
      },
      {
        id: "3",
        author: "Ben R.",
        rating: 4,
        date: "2 weeks ago",
        optionBought: offer.title,
        comment:
          "Great energy and clear programming. Slightly busy at peak hour, but still got full attention.",
        helpfulCount: 6,
        verified: true,
      },
    ];
  }

  return [
    {
      id: "1",
      author: "Sam K.",
      rating: 5,
      date: "1 week ago",
      optionBought: offer.title,
      comment:
        "Smooth booking, verified merchant, and the experience matched the listing. Strong value.",
      helpfulCount: 5,
      verified: true,
    },
  ];
}

function galleryFor(offer: MockOffer): string[] {
  const pool = isConsultingOffer(offer)
    ? CATEGORY_GALLERY.legal
    : CATEGORY_GALLERY[offer.category];
  // Prefer category pool first so consulting never inherits spa extras.
  // Keep merchant cover if it already matches the category set; otherwise lead with pool.
  const coverInPool = pool.includes(offer.image);
  const ordered = coverInPool
    ? [offer.image, ...pool.filter((u) => u !== offer.image)]
    : [...pool];
  return ordered.slice(0, 5);
}

export function merchantIdFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function websiteHost(merchantId: string): string {
  return `https://${merchantId}.example.com`;
}

function phoneFor(merchantId: string): string {
  let n = 0;
  for (let i = 0; i < merchantId.length; i++) n = (n + merchantId.charCodeAt(i) * (i + 1)) % 9000;
  const ext = String(1000 + n).padStart(4, "0");
  return `+1 (312) 555-${ext}`;
}

function merchantDescription(offer: MockOffer): string {
  if (isConsultingOffer(offer)) {
    return `${offer.merchantName} provides founder-focused strategy and counsel sessions — clear agendas, pre-read preparation, and written action plans.`;
  }
  if (offer.category === "beauty") {
    return `${offer.merchantName} is a verified wellness and beauty partner specializing in customized treatments, skilled therapists, and a clean, calming facility.`;
  }
  if (offer.category === "restaurant") {
    return `${offer.merchantName} is a dining partner known for fresh ingredients, attentive service, and a hospitality-first guest experience.`;
  }
  if (offer.category === "hotel") {
    return `${offer.merchantName} offers curated stays with transparent inclusions, comfortable rooms, and straightforward check-in.`;
  }
  if (offer.category === "clinic") {
    return `${offer.merchantName} is a licensed clinical partner delivering thorough assessments, clear explanations, and transparent first-visit pricing.`;
  }
  if (offer.category === "fitness") {
    return `${offer.merchantName} delivers form-focused coaching in a clean training environment with certified specialists.`;
  }
  return `${offer.merchantName} is a verified Nexus partner offering transparent local deals with instant digital vouchers.`;
}

function merchantHubFor(offer: MockOffer): MerchantHub {
  const id = merchantIdFromName(offer.merchantName);
  return {
    id,
    name: offer.merchantName,
    website: websiteHost(id),
    nexusStorefront: `/merchants/${id}`,
    address: `123 Central Ave, ${offer.city}`,
    phone: phoneFor(id),
    description: merchantDescription(offer),
  };
}

function withCompliance(
  base: Omit<
    OfferTerms,
    | "promoExpiryDays"
    | "cancellationPolicy"
    | "redemptionLimits"
    | "transferability"
    | "appointmentRequirement"
    | "rules"
  > &
    Partial<
      Pick<
        OfferTerms,
        | "promoExpiryDays"
        | "cancellationPolicy"
        | "redemptionLimits"
        | "transferability"
        | "appointmentRequirement"
      >
    >,
): OfferTerms {
  // Structured clauses only — no legacy free-form `rules` (prevents duplicate bullets).
  return {
    promoExpiryDays: 120,
    cancellationPolicy:
      "Merchant's standard 24-hour cancellation policy applies. Any fees will not exceed the voucher purchase price.",
    redemptionLimits: "Limit 1 voucher redemption per client per visit.",
    transferability:
      "Valid only for option purchased. All goods or services must be used by the same person in a single visit or scheduled series.",
    appointmentRequirement:
      "Advance booking required upon voucher purchase. Subject to merchant availability.",
    ...base,
    rules: [],
  };
}

function termsFor(offer: MockOffer): OfferTerms {
  if (isConsultingOffer(offer)) {
    return withCompliance({
      booking:
        "Appointment required. Online scheduling opens immediately after voucher claim. Bring relevant company docs for pre-read.",
      additionalInfo:
        "Upgrade to a 90-minute deep-dive strategy block for an additional $75 paid directly to counsel.",
      addOnBadge: "+$75 Extended Strategy Block",

      legal:
        "Promotional value expires 120 days after purchase. Amount paid never expires.",
      promoExpiryDays: 120,
      redemptionLimits:
        "Limit 1 consult voucher redemption per company per quarter unless otherwise stated.",
      transferability:
        "Valid only for option purchased. Session must be attended by the named purchaser or an approved designee.",
      appointmentRequirement:
        "Advance booking required. Online scheduling opens immediately after voucher claim; subject to counsel availability.",
    });
  }
  if (offer.category === "beauty") {
    const isBodywork =
      /massage|stone|spa|facial|aromatherapy/i.test(offer.title) ||
      /massage|stone|spa|facial/i.test(offer.details);
    return withCompliance({
      booking:
        "Appointment required. Online booking available after voucher claim. Instant digital redemption at check-in.",
      additionalInfo: isBodywork
        ? "Upgrade to a prenatal massage for an additional $15 paid directly to merchant."
        : "Optional aftercare kit available for an additional $15 paid directly to merchant.",
      addOnBadge: isBodywork ? "+$15 Prenatal Upgrade" : "+$15 Aftercare Kit",

      legal:
        "Promotional value expires 120 days after purchase. Amount paid never expires.",
      promoExpiryDays: 120,
    });
  }
  if (offer.category === "restaurant") {
    return withCompliance({
      booking:
        "Reservation recommended. Present digital voucher at arrival. Instant redemption on the check.",
      additionalInfo:
        "Add a wine pairing flight for an additional $35 paid directly to the restaurant.",
      addOnBadge: "+$35 Wine Pairing",

      legal:
        "Promotional value expires 90 days after purchase. Amount paid never expires.",
      promoExpiryDays: 90,
      cancellationPolicy:
        "Cancel or modify reservations per restaurant policy. Fees, if any, will not exceed the voucher purchase price.",
      redemptionLimits:
        "Limit 1 voucher per table unless otherwise stated on the offer.",
      appointmentRequirement:
        "Reservation recommended. Present digital voucher at arrival for instant redemption on the check.",
    });
  }
  if (offer.category === "hotel") {
    return withCompliance({
      booking:
        "Reservation required. Book dates online after voucher claim subject to availability.",
      additionalInfo:
        "Optional late checkout upgrade available for +$25 paid at the property.",
      addOnBadge: "+$25 Late Checkout",

      legal:
        "Promotional value expires 180 days after purchase. Amount paid never expires.",
      promoExpiryDays: 180,
      cancellationPolicy:
        "Free cancellation within the merchant window; thereafter the property's standard policy applies. Fees will not exceed the voucher purchase price.",
      transferability:
        "Valid only for room type purchased. Name on voucher must match the primary guest.",
      appointmentRequirement:
        "Reservation required. Book dates online after voucher claim, subject to availability and blackout dates.",
    });
  }
  if (offer.category === "clinic") {
    return withCompliance({
      booking:
        "Appointment required. Schedule after voucher claim. Bring ID and relevant medical history.",
      additionalInfo: offer.refundNote
        ? null
        : "Optional imaging coordination fee may apply if referred off-site.",
      addOnBadge: null,

      legal:
        "Promotional value expires 120 days after purchase. Amount paid never expires. Clinical outcomes are not guaranteed.",
      promoExpiryDays: 120,
      redemptionLimits:
        "Limit 1 new-patient rate voucher per person unless otherwise stated.",
      transferability:
        "Valid only for the clinical option purchased. Must be used by the named patient.",
      appointmentRequirement:
        "Advance appointment required after voucher claim. Bring ID and relevant medical history.",
      cancellationPolicy: offer.refundNote
        ? `${offer.refundNote} Merchant scheduling / no-show policies may also apply; fees will not exceed the voucher purchase price.`
        : "100% refund if evaluated as unsuitable for treatment. Merchant standard 24-hour cancellation policy otherwise applies; fees will not exceed the voucher purchase price.",
    });
  }
  if (offer.category === "fitness") {
    return withCompliance({
      booking:
        "Session booking required. Instant digital check-in at the front desk.",
      additionalInfo:
        "Add a recovery / mobility block for +$20 paid to the gym.",
      addOnBadge: "+$20 Recovery Add-on",

      legal:
        "Promotional value expires 90 days after purchase. Amount paid never expires.",
      promoExpiryDays: 90,
    });
  }
  return withCompliance({
    booking:
      "Appointment or reservation may be required. Instant digital voucher delivery after purchase.",
    additionalInfo: null,
    addOnBadge: null,

    legal:
      "Promotional value expires 120 days after purchase. Amount paid never expires.",
  });
}

export function getMockOfferBySlug(slug: string): MockOffer | undefined {
  return MOCK_OFFERS.find((o) => o.id === slug);
}

export function getOffersByMerchantId(merchantId: string): MockOffer[] {
  return MOCK_OFFERS.filter(
    (o) => merchantIdFromName(o.merchantName) === merchantId,
  );
}

export function buildOfferDetail(offer: MockOffer): OfferDetailModel {
  const packages = packagesFor(offer);
  const base = packages[0];
  const promoAmount = Math.round(base.price * 0.11 * 100) / 100;
  const merchant = merchantHubFor(offer);
  const query = encodeURIComponent(`${merchant.address}`);
  const gallery = galleryFor(offer);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const terms = termsFor(offer);
  const includes = includesFor(offer);

  return {
    offer,
    packages,
    includes,
    inclusions: inclusionsFor(offer),
    upsell: upsellFor(offer, terms),
    gallery,
    insightTags: insightsFor(offer),
    summaryText: summaryFor(offer),
    reviews: reviewsFor(offer),
    merchant,
    terms,
    redeemedLabel:
      offer.reviewCount >= 2000
        ? "10k+ redeemed"
        : offer.reviewCount >= 500
          ? "5k+ redeemed"
          : `${Math.max(120, offer.reviewCount * 3)}+ redeemed`,
    distanceMi: Math.round(offer.distanceKm * 0.621371 * 10) / 10,
    address: merchant.address,
    hours: ["Mon–Fri 9:00–20:00", "Sat 10:00–18:00", "Sun 11:00–16:00"],
    website: merchant.website,
    mapsUrl,
    promoCode: isConsultingOffer(offer) ? "CLARITY" : "RELAX",
    promoAmount,
    reviewPhotos: gallery.slice(0, 4),
  };
}
