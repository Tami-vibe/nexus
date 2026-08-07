import type { Practitioner } from "@/types";
import type { ExtendedFilterState } from "@/types/search";

/** Apply Yellow Pages extended filters to a practitioner list. */
export function filterPractitionersByExtended(
  practitioners: Practitioner[],
  filters: ExtendedFilterState,
): Practitioner[] {
  return practitioners.filter((p) => {
    if (filters.insuranceProvider) {
      const ok = p.insuranceNetworks.some(
        (n) =>
          n.providerName.toLowerCase() ===
          filters.insuranceProvider!.toLowerCase(),
      );
      if (!ok) return false;
    }

    if (filters.hasIntroPassesOnly) {
      if (!p.introPasses.some((c) => c.remainingQuantity > 0)) return false;
    }

    if (filters.hasWheelchairAccess === true) {
      if (!p.hasWheelchairAccess) return false;
    }

    const langs = filters.languagesSpoken ?? [];
    if (langs.length > 0) {
      const spoken = new Set(
        p.dossier.languagesSpoken.map((l) => l.toLowerCase()),
      );
      const hit = langs.some((l) => spoken.has(l.toLowerCase()));
      if (!hit) return false;
    }

    return true;
  });
}
