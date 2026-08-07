/** Multi-location practice nodes for traveling professionals. */

export interface PracticeLocation {
  id: string;
  name: string; // e.g., 'Studio Milano', 'ASL Piemonte Clinic', 'Genova Center'
  address: string;
  city: string;
  scheduleDays: string[]; // e.g., ['Mon', 'Tue']
  nextOpenSlot: string; // e.g., 'Mon 09:00 AM'
  distanceKm?: number;
  latitude?: number;
  longitude?: number;
  /** Switcher emoji — defaults by name heuristics if omitted */
  emoji?: string;
}

export interface TravelingProfessional {
  locations: PracticeLocation[];
  activeLocationId: string;
}

export function isTravelingProfessional(
  value: unknown,
): value is TravelingProfessional {
  if (!value || typeof value !== "object") return false;
  const v = value as TravelingProfessional;
  return (
    typeof v.activeLocationId === "string" &&
    Array.isArray(v.locations) &&
    v.locations.length > 0 &&
    v.locations.every(
      (loc) =>
        loc &&
        typeof loc.id === "string" &&
        typeof loc.name === "string" &&
        typeof loc.city === "string" &&
        Array.isArray(loc.scheduleDays),
    )
  );
}

/** Flatten cities for GEO search / AI manifest indexing. */
export function indexCitiesFromTraveling(
  traveling: TravelingProfessional | null | undefined,
): string[] {
  if (!traveling?.locations?.length) return [];
  return [...new Set(traveling.locations.map((l) => l.city).filter(Boolean))];
}
