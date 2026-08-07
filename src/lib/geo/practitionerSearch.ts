import type { Practitioner } from "@/types";
import { indexCitiesFromTraveling } from "@/types/location";

/**
 * GEO-TEMPORAL: match practitioners when any practice city / specialty hits the query.
 * e.g. "Podologo Piemonte" or "Physio Herzliya" surfaces multi-location pros.
 */
export function practitionerMatchesGeoQuery(
  practitioner: Practitioner,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const cities = indexCitiesFromTraveling(practitioner.traveling);
  const haystack = [
    practitioner.full_name,
    practitioner.credential,
    practitioner.title ?? "",
    ...practitioner.specialties,
    ...cities,
    ...(practitioner.traveling?.locations.map((l) => l.name) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return q.split(/\s+/).every((token) => haystack.includes(token));
}

export function filterPractitionersByGeo(
  practitioners: Practitioner[],
  query: string | null | undefined,
): Practitioner[] {
  if (!query?.trim()) return practitioners;
  return practitioners.filter((p) => practitionerMatchesGeoQuery(p, query));
}
