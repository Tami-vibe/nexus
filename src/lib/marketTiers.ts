import type { Sector } from "@/types";

/** Rank within a profession — labels are sector-specific. */
export type TierRank = "master" | "senior" | "junior";

/** Profession-matched tier labels — never "Artist" on a physician. */
export const TIER_BY_SECTOR: Record<Sector, Record<TierRank, string>> = {
  CLINIC: {
    master: "Attending Physician / Specialist MD",
    senior: "Specialist MD",
    junior: "Associate Clinician",
  },
  SALON: {
    master: "Master Artist",
    senior: "Senior Stylist",
    junior: "Junior Talent",
  },
  ARTISAN: {
    master: "Master Artisan",
    senior: "Senior Maker",
    junior: "Studio Associate",
  },
  GYM: {
    master: "Master Coach",
    senior: "Senior Trainer",
    junior: "Associate Coach",
  },
  POOL: {
    master: "Master Instructor",
    senior: "Senior Coach",
    junior: "Associate Coach",
  },
  CONSULTING: {
    master: "Senior Counsel",
    senior: "Counsel",
    junior: "Associate Counsel",
  },
  DIGITAL: {
    master: "Principal Strategist",
    senior: "Senior Strategist",
    junior: "Associate Strategist",
  },
  RETAIL: {
    master: "Master Specialist",
    senior: "Senior Specialist",
    junior: "Associate Specialist",
  },
};

export function resolveTierRank(years: number, clients: number): TierRank {
  if (years >= 10 || clients >= 1500) return "master";
  if (years >= 6 || clients >= 600) return "senior";
  return "junior";
}

export function resolveSpecialistTier(
  years: number,
  clients: number,
  sector: Sector,
): string {
  const rank = resolveTierRank(years, clients);
  return TIER_BY_SECTOR[sector]?.[rank] ?? TIER_BY_SECTOR.RETAIL[rank];
}
