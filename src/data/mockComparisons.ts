import type { PracticeLocation, TravelingProfessional } from "@/types/location";

export type MicrobladingTier = "Master Artist" | "Senior Specialist" | "Junior Talent";

export interface MicrobladingProfile {
  id: string;
  slug: string;
  fullName: string;
  studio: string;
  city: string;
  tier: MicrobladingTier;
  priceCents: number;
  currency: string;
  experienceYears: number;
  verifiedClients: number;
  inclusions: string[];
  marketPercentile: string; // e.g. 'Top 10% Senior Specialist'
  regionalBandLabel: string; // e.g. '₪1,800–₪2,500'
  headshotUrl: string;
  rating: number;
  reviewCount: number;
}

/** Side-by-side Microblading comparison dataset */
export const MICROBLADING_PROFILES: MicrobladingProfile[] = [
  {
    id: "mb-master-yael",
    slug: "yael-master",
    fullName: "Yael Ben-Ami",
    studio: "Atelier Brow TLV",
    city: "Tel Aviv",
    tier: "Master Artist",
    priceCents: 220_000,
    currency: "ils",
    experienceYears: 12,
    verifiedClients: 1840,
    inclusions: [
      "Consultation + mapping",
      "Premium pigment set",
      "6-week touch-up included",
      "Aftercare kit",
    ],
    marketPercentile: "Top 10% Master Artist",
    regionalBandLabel: "₪1,800–₪2,500",
    headshotUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    rating: 5.0,
    reviewCount: 214,
  },
  {
    id: "mb-senior-noa",
    slug: "noa-senior",
    fullName: "Noa Sharabi",
    studio: "Line & Soft Studio",
    city: "Herzliya",
    tier: "Senior Specialist",
    priceCents: 140_000,
    currency: "ils",
    experienceYears: 7,
    verifiedClients: 920,
    inclusions: [
      "Shape consultation",
      "Standard pigment set",
      "Optional touch-up (paid)",
      "Aftercare guide",
    ],
    marketPercentile: "Top 25% Senior Specialist",
    regionalBandLabel: "₪1,100–₪1,700",
    headshotUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: "mb-junior-maya",
    slug: "maya-junior",
    fullName: "Maya Levi",
    studio: "First Stroke Collective",
    city: "Tel Aviv",
    tier: "Junior Talent",
    priceCents: 85_000,
    currency: "ils",
    experienceYears: 3,
    verifiedClients: 310,
    inclusions: [
      "Supervised session",
      "Starter pigment set",
      "Digital aftercare",
    ],
    marketPercentile: "Value tier Junior Talent",
    regionalBandLabel: "₪700–₪1,100",
    headshotUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    reviewCount: 68,
  },
];

export const MARCO_RIVA_LOCATIONS: PracticeLocation[] = [
  {
    id: "milan-studio",
    name: "Studio Milano",
    address: "Via della Spiga 14",
    city: "Milan",
    scheduleDays: ["Mon", "Tue"],
    nextOpenSlot: "Mon 09:00 AM",
    distanceKm: 2.4,
    latitude: 45.4685,
    longitude: 9.195,
    emoji: "🏢",
  },
  {
    id: "piemonte-asl",
    name: "ASL Piemonte Clinic",
    address: "Corso Regina Margherita 202",
    city: "Piemonte",
    scheduleDays: ["Wed"],
    nextOpenSlot: "Wed 10:30 AM",
    distanceKm: 128,
    latitude: 45.0781,
    longitude: 7.6761,
    emoji: "🏥",
  },
  {
    id: "genova-center",
    name: "Genova Center",
    address: "Via XX Settembre 33",
    city: "Genova",
    scheduleDays: ["Thu", "Fri"],
    nextOpenSlot: "Thu 11:00 AM",
    distanceKm: 145,
    latitude: 44.4056,
    longitude: 8.9463,
    emoji: "🌊",
  },
];

export const MARCO_RIVA_TRAVELING: TravelingProfessional = {
  activeLocationId: "milan-studio",
  locations: MARCO_RIVA_LOCATIONS,
};

export const MARCO_RIVA_PROFILE = {
  slug: "dott-marco-riva",
  fullName: "Dott. Marco Riva",
  credential: "Licensed Podiatrist",
  title: "Sports & Diabetic Foot Specialist",
  bioHeader:
    "I treat the foot as a performance system — biomechanics first, clear plans, and clinic days across Milan, Piemonte ASL, and Genova so patients never chase me across regions.",
  specialties: [
    "Sports podology",
    "Diabetic foot care",
    "Orthotic design",
    "Post-surgical gait",
  ],
  experienceYears: 14,
  verifiedClients: 2100,
  rating: 4.9,
  reviewCount: 188,
  priceCents: 180_000,
  currency: "eur",
  headshotUrl:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
  traveling: MARCO_RIVA_TRAVELING,
  hasWheelchairAccess: true,
  insuranceNetworks: [
    { providerName: "Generali", directBilling: true },
    { providerName: "Allianz", directBilling: true },
    { providerName: "Unipol", directBilling: false },
  ],
  introPasses: [
    {
      id: "marco-gait-intro",
      title: "First-Visit Podiatry & Gait Analysis Rate",
      originalPrice: 28_000,
      discountPrice: 18_000,
      currency: "eur",
      remainingQuantity: 4,
      validDays: ["Mon", "Tue"],
      refundGuaranteeNote:
        "100% Refund Guarantee if clinical evaluation determines non-candidacy",
    },
  ],
};
