"use client";

import type { PracticeLocation } from "@/types/location";
import { locationEmoji, scheduleLabel } from "@/lib/locations";

type Props = {
  locations: PracticeLocation[];
  activeLocationId: string;
  onChange: (locationId: string) => void;
};

/**
 * Horizontal multi-location practice switcher for traveling professionals.
 */
export function LocationSwitcher({
  locations,
  activeLocationId,
  onChange,
}: Props) {
  if (locations.length < 2) return null;

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Practice locations"
    >
      {locations.map((loc, index) => {
        const on = loc.id === activeLocationId;
        const label = `${locationEmoji(loc)} ${shortName(loc.name)} (${scheduleLabel(loc.scheduleDays)})`;
        return (
          <button
            key={loc.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(loc.id)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              on
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            {label}
            {index < locations.length - 1 ? (
              <span className="sr-only"> · </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function shortName(name: string) {
  return name
    .replace(/\s+Clinic$/i, "")
    .replace(/\s+Center$/i, "")
    .replace(/^Studio\s+/i, "");
}
