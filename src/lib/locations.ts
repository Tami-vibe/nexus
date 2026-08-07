import type { PracticeLocation, TravelingProfessional } from "@/types/location";
import { nextAppointmentSlots } from "@/lib/commerce/slots";

const DAY_TO_JS: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

export function locationEmoji(loc: PracticeLocation): string {
  if (loc.emoji) return loc.emoji;
  const n = `${loc.name} ${loc.city}`.toLowerCase();
  if (n.includes("sea") || n.includes("genova") || n.includes("beach")) return "🌊";
  if (n.includes("asl") || n.includes("hospital") || n.includes("clinic"))
    return "🏥";
  if (n.includes("gym") || n.includes("forge") || n.includes("studio")) return "🏋️";
  if (n.includes("court") || n.includes("counsel") || n.includes("bar"))
    return "⚖️";
  return "🏢";
}

export function scheduleLabel(days: string[]): string {
  if (!days.length) return "By appointment";
  if (days.length === 1) return days[0]!;
  return `${days[0]}-${days[days.length - 1]}`;
}

export function activeLocation(
  traveling: TravelingProfessional | null | undefined,
): PracticeLocation | null {
  if (!traveling?.locations?.length) return null;
  return (
    traveling.locations.find((l) => l.id === traveling.activeLocationId) ??
    traveling.locations[0] ??
    null
  );
}

/** Bookable ISO slots constrained to a location's schedule weekdays. */
export function slotsForLocation(
  location: PracticeLocation | null,
  count = 4,
  from?: Date,
): string[] {
  if (!location?.scheduleDays?.length) {
    return nextAppointmentSlots(count, from);
  }
  const allowed = new Set(
    location.scheduleDays
      .map((d) => DAY_TO_JS[d.trim().toLowerCase()])
      .filter((n): n is number => n != null),
  );
  if (!allowed.size) return nextAppointmentSlots(count, from);

  const slots: string[] = [];
  const pool = nextAppointmentSlots(28, from);
  for (const iso of pool) {
    if (slots.length >= count) break;
    const day = new Date(iso).getDay();
    if (allowed.has(day)) slots.push(iso);
  }
  return slots.length ? slots : nextAppointmentSlots(count, from);
}

export function mapsUrlForLocation(location: PracticeLocation): string {
  const q = encodeURIComponent(
    `${location.address}, ${location.city}`.trim(),
  );
  if (location.latitude != null && location.longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
