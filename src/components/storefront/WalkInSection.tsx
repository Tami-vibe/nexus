"use client";

import { CapacityBadge } from "@/components/CapacityBadge";

export function WalkInSection({
  vat,
  enabled,
}: {
  vat: string;
  enabled: boolean;
}) {
  if (!enabled) return null;

  return (
    <section id="walk-in" className="nx-container py-16 md:py-24">
      <div className="nx-card px-8 py-10 md:px-12">
        <p className="nx-eyebrow">Live walk-in status</p>
        <h2 className="nx-display mt-3 max-w-xl text-4xl">
          See open capacity before you leave home
        </h2>
        <p className="mt-3 max-w-lg text-[var(--muted)]">
          Ambient occupancy for gyms, salons, and pools — with atomic holds when
          demand spikes.
        </p>
        <div className="mt-8">
          <CapacityBadge vat={vat} />
        </div>
      </div>
    </section>
  );
}
