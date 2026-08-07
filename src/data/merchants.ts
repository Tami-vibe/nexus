import type { Sector } from "@/types";

/**
 * Merchant-first directory catalog.
 * Practitioners are never standalone directory entities — they attach via `team`.
 */

export type MerchantTeamMemberId =
  | "dr-amir-saeed"
  | "dr-noa-klein"
  | "maya-cohen"
  | "lina-bar"
  | "neri-alon"
  | "jordan-lee"
  | "dott-marco-riva";

export type MerchantCatalogEntry = {
  vat: string;
  businessName: string;
  sector: Sector;
  city: string;
  tagline: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  /** Keywords for business-first search (podologist, foot doctor, etc.) */
  searchTags: string[];
  /** Logical team ids — resolve via PRACTITIONER_DIRECTORY */
  team: MerchantTeamMemberId[];
  /** Override storefront path when not `/{vat}` */
  storefrontHref?: string;
};

export type PractitionerDirectoryEntry = {
  id: MerchantTeamMemberId;
  /** URL slug under parent VAT (`/{vat}/p/{slug}`) — or absolute path override */
  slug: string;
  parentVat: string;
  fullName: string;
  credential: string;
  title: string;
  specialties: string[];
  headshotUrl: string;
  rating: number;
  reviewCount: number;
  clientCount: number;
  experienceYears: number;
  priceCents: number;
  currency: string;
  /** Absolute profile path when not under parent VAT storefront */
  profileHref?: string;
};

export const MERCHANT_CATALOG: MerchantCatalogEntry[] = [
  {
    vat: "IL-CLINIC-001",
    businessName: "Harbor Wellness Clinic",
    sector: "CLINIC",
    city: "Tel Aviv",
    tagline: "Same-day care, zero lobby limbo.",
    description:
      "Preventive care, same-day consults, sports physio, and gait analysis — one clinic roster.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    reviewCount: 96,
    searchTags: [
      "clinic",
      "doctor",
      "physician",
      "preventive",
      "physio",
      "physiotherapist",
      "gait",
      "podology",
      "podologist",
      "foot doctor",
      "sports rehab",
    ],
    team: ["dr-amir-saeed", "dr-noa-klein"],
  },
  {
    vat: "IL-SALON-001",
    businessName: "Lumen Hair Studio",
    sector: "SALON",
    city: "Tel Aviv",
    tagline: "Color that feels intentional.",
    description:
      "Precision cuts and lived-in color in an appointment-first studio.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewCount: 128,
    searchTags: [
      "salon",
      "hair",
      "color",
      "balayage",
      "stylist",
      "microblading",
    ],
    team: ["lina-bar"],
  },
  {
    vat: "IL-ARTISAN-001",
    businessName: "Atelier Neri Ceramics",
    sector: "ARTISAN",
    city: "Tel Aviv",
    tagline: "Handmade forms for daily rituals.",
    description:
      "Stoneware commissions and workshop visits from a Florence-trained studio.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewCount: 64,
    searchTags: ["artisan", "ceramics", "pottery", "workshop", "commission"],
    team: ["neri-alon"],
  },
  {
    vat: "IL-GYM-001",
    businessName: "Iron Forge Gym",
    sector: "GYM",
    city: "Tel Aviv",
    tagline: "Strength without the wait.",
    description:
      "Coaching, open floor, and recovery with live capacity signals.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewCount: 214,
    searchTags: ["gym", "trainer", "strength", "coaching", "fitness"],
    team: ["maya-cohen"],
  },
  {
    vat: "IL-DIGITAL-001",
    businessName: "Northline Counsel",
    sector: "CONSULTING",
    city: "Tel Aviv",
    tagline: "Strategy counsel without the theatre.",
    description: "M&A strategy and commercial counsel for founders.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewCount: 42,
    searchTags: ["legal", "counsel", "lawyer", "m&a", "contracts"],
    team: ["jordan-lee"],
  },
  {
    vat: "IT-PODO-001",
    businessName: "Studio Podologico Riva",
    sector: "CLINIC",
    city: "Milan",
    tagline: "Sports & diabetic foot care across Northern Italy.",
    description:
      "Podology clinic covering Milan, Piemonte ASL, and Genova practice nodes.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewCount: 188,
    searchTags: [
      "podologist",
      "podology",
      "foot doctor",
      "gait",
      "orthotic",
      "diabetic foot",
      "sports podology",
    ],
    team: ["dott-marco-riva"],
    storefrontHref: "/p/dott-marco-riva",
  },
];

export const PRACTITIONER_DIRECTORY: Record<
  MerchantTeamMemberId,
  PractitionerDirectoryEntry
> = {
  "dr-amir-saeed": {
    id: "dr-amir-saeed",
    slug: "amir-saeed",
    parentVat: "IL-CLINIC-001",
    fullName: "Dr. Amir Saeed",
    credential: "Attending Physician / Specialist MD",
    title: "Internal & Preventive Medicine Specialist",
    specialties: ["Preventive Care", "Same-Day Consults", "Metabolic Health"],
    headshotUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 96,
    clientCount: 1200,
    experienceYears: 10,
    priceCents: 35_000,
    currency: "ils",
  },
  "dr-noa-klein": {
    id: "dr-noa-klein",
    slug: "noa-klein",
    parentVat: "IL-CLINIC-001",
    fullName: "Dr. Noa Klein",
    credential: "Licensed Senior Physiotherapist",
    title: "Sports & Post-Op Physiotherapy Specialist",
    specialties: [
      "Movement Assessment",
      "Sports Rehab",
      "Gait Analysis",
      "Podiatry Support",
    ],
    headshotUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviewCount: 74,
    clientCount: 2100,
    experienceYears: 8,
    priceCents: 32_000,
    currency: "ils",
  },
  "maya-cohen": {
    id: "maya-cohen",
    slug: "maya-cohen",
    parentVat: "IL-GYM-001",
    fullName: "Maya Cohen",
    credential: "NSCA Certified",
    title: "Head Strength Coach",
    specialties: ["Strength", "Form Coaching", "Recovery"],
    headshotUrl:
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 120,
    clientCount: 2400,
    experienceYears: 7,
    priceCents: 25_000,
    currency: "ils",
  },
  "lina-bar": {
    id: "lina-bar",
    slug: "lina-bar",
    parentVat: "IL-SALON-001",
    fullName: "Lina Bar",
    credential: "L'Oréal Professionnel Partner Artist",
    title: "Color Director",
    specialties: ["Lived-In Color", "Precision Cuts", "Gloss Rituals"],
    headshotUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 88,
    clientCount: 1900,
    experienceYears: 9,
    priceCents: 45_000,
    currency: "ils",
  },
  "neri-alon": {
    id: "neri-alon",
    slug: "neri-alon",
    parentVat: "IL-ARTISAN-001",
    fullName: "Neri Alon",
    credential: "Albo Artigiani",
    title: "Studio Lead",
    specialties: ["Stoneware", "Commissions", "Tableware"],
    headshotUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 40,
    clientCount: 480,
    experienceYears: 9,
    priceCents: 38_000,
    currency: "ils",
  },
  "jordan-lee": {
    id: "jordan-lee",
    slug: "jordan-lee",
    parentVat: "IL-DIGITAL-001",
    fullName: "Jordan Lee",
    credential: "Israel Bar Association",
    title: "Principal Counsel",
    specialties: ["M&A Strategy", "Commercial Contracts", "Founder Counsel"],
    headshotUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviewCount: 36,
    clientCount: 320,
    experienceYears: 12,
    priceCents: 120_000,
    currency: "ils",
  },
  "dott-marco-riva": {
    id: "dott-marco-riva",
    slug: "dott-marco-riva",
    parentVat: "IT-PODO-001",
    fullName: "Dott. Marco Riva",
    credential: "Licensed Podiatrist",
    title: "Sports & Diabetic Foot Specialist",
    specialties: [
      "Sports podiatry",
      "Diabetic foot care",
      "Orthotic design",
      "Post-surgical gait",
    ],
    headshotUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviewCount: 188,
    clientCount: 2100,
    experienceYears: 14,
    priceCents: 180_000,
    currency: "eur",
    profileHref: "/p/dott-marco-riva",
  },
};

/** Primary merchant showcase cards (businesses only). */
export const PRIMARY_MERCHANT_DEMOS = MERCHANT_CATALOG.filter((m) =>
  ["IL-CLINIC-001", "IL-SALON-001", "IL-ARTISAN-001"].includes(m.vat),
);

export function getMerchantByVat(
  vat: string,
): MerchantCatalogEntry | undefined {
  return MERCHANT_CATALOG.find((m) => m.vat === vat);
}

export function merchantStorefrontHref(m: MerchantCatalogEntry): string {
  return m.storefrontHref ?? `/${encodeURIComponent(m.vat)}`;
}

export function practitionerProfileHref(
  p: PractitionerDirectoryEntry,
): string {
  if (p.profileHref) return p.profileHref;
  return `/${encodeURIComponent(p.parentVat)}/p/${encodeURIComponent(p.slug)}`;
}

export function teamForMerchant(
  merchant: MerchantCatalogEntry,
): PractitionerDirectoryEntry[] {
  return merchant.team
    .map((id) => PRACTITIONER_DIRECTORY[id])
    .filter(Boolean);
}

/** Sort live DB practitioners to match catalog team order for a VAT. */
export function orderPractitionersByTeam<T extends { slug: string }>(
  vat: string,
  practitioners: T[],
): T[] {
  const merchant = getMerchantByVat(vat);
  if (!merchant) return practitioners;
  const order = merchant.team.map(
    (id) => PRACTITIONER_DIRECTORY[id]?.slug,
  );
  const rank = (slug: string) => {
    const i = order.indexOf(slug);
    return i === -1 ? 999 : i;
  };
  return [...practitioners].sort((a, b) => rank(a.slug) - rank(b.slug));
}

export type SearchMode = "clinics" | "specialists";

export function searchMerchants(
  query: string,
  city?: string,
): MerchantCatalogEntry[] {
  const q = query.trim().toLowerCase();
  const cityQ = city?.trim().toLowerCase();

  return MERCHANT_CATALOG.filter((m) => {
    if (cityQ && !m.city.toLowerCase().includes(cityQ)) return false;
    if (!q) return true;
    const hay = [
      m.businessName,
      m.tagline,
      m.description,
      m.sector,
      m.city,
      ...m.searchTags,
      ...teamForMerchant(m).flatMap((p) => [
        p.fullName,
        p.title,
        p.credential,
        ...p.specialties,
      ]),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || q.split(/\s+/).every((token) => hay.includes(token));
  });
}

/** Specialists extracted from matched clinics (never orphaned from parent). */
export function specialistsFromMerchants(
  merchants: MerchantCatalogEntry[],
  query?: string,
): Array<PractitionerDirectoryEntry & { parentBusinessName: string }> {
  const q = query?.trim().toLowerCase() ?? "";
  const rows: Array<
    PractitionerDirectoryEntry & { parentBusinessName: string }
  > = [];

  for (const m of merchants) {
    for (const p of teamForMerchant(m)) {
      if (q) {
        // Match the specialist themselves — not every teammate at a matched clinic
        const hay = [p.fullName, p.title, p.credential, ...p.specialties]
          .join(" ")
          .toLowerCase();
        const tokens = q.split(/\s+/).filter(Boolean);
        const hit =
          tokens.every((t) => hay.includes(t)) ||
          // parent-tag bridge for role synonyms (e.g. foot doctor → gait / podology)
          tokens.some(
            (t) =>
              hay.includes(t) ||
              (["podologist", "podology", "foot", "gait"].includes(t) &&
                /podolog|gait|foot|ortho/i.test(hay)),
          );
        if (!hit) continue;
      }
      rows.push({ ...p, parentBusinessName: m.businessName });
    }
  }
  return rows;
}
