import type { Sector } from "@/types";

/** Hourly occupancy fraction baselines by sector (0–1 of max_capacity). */
const CURVES: Record<Sector, number[]> = {
  GYM: [
    0.15, 0.1, 0.08, 0.08, 0.12, 0.28, 0.55, 0.7, 0.55, 0.4, 0.35, 0.4, 0.5,
    0.45, 0.4, 0.5, 0.65, 0.8, 0.85, 0.75, 0.55, 0.4, 0.3, 0.2,
  ],
  SALON: [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.1, 0.25, 0.55, 0.7, 0.8, 0.75, 0.7,
    0.65, 0.7, 0.8, 0.75, 0.55, 0.3, 0.1, 0.0, 0.0, 0.0,
  ],
  CLINIC: [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.2, 0.45, 0.65, 0.7, 0.6, 0.4, 0.55,
    0.65, 0.7, 0.55, 0.35, 0.15, 0.05, 0.0, 0.0, 0.0, 0.0,
  ],
  POOL: [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.15, 0.3, 0.45, 0.55, 0.65, 0.75, 0.85,
    0.9, 0.85, 0.7, 0.55, 0.4, 0.3, 0.2, 0.1, 0.05, 0.0, 0.0,
  ],
  RETAIL: Array.from({ length: 24 }, (_, h) =>
    h >= 10 && h <= 20 ? 0.45 : 0.1,
  ),
  ARTISAN: Array.from({ length: 24 }, (_, h) =>
    h >= 11 && h <= 18 ? 0.35 : 0.05,
  ),
  DIGITAL: Array.from({ length: 24 }, () => 0),
  CONSULTING: Array.from({ length: 24 }, (_, h) =>
    h >= 9 && h <= 17 ? 0.5 : 0.05,
  ),
};

export function predictOccupancy(
  sector: Sector,
  maxCapacity: number,
  at: Date = new Date(),
): number {
  const hour = at.getHours();
  const fraction = CURVES[sector]?.[hour] ?? 0.5;
  return Math.min(maxCapacity, Math.max(0, Math.round(maxCapacity * fraction)));
}
