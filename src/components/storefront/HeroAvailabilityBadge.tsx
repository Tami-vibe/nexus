"use client";

import { useEffect, useState } from "react";
import type { CapacitySnapshot, Sector } from "@/types";

const UNIT: Partial<Record<Sector, string>> = {
  CLINIC: "Consult Spots",
  GYM: "Floor Spots",
  SALON: "Chair Spots",
  POOL: "Lane Spots",
  CONSULTING: "Session Spots",
  ARTISAN: "Studio Slots",
  DIGITAL: "Kickoff Slots",
  RETAIL: "Pickup Slots",
};

export function HeroAvailabilityBadge({
  vat,
  sector,
  walkInEnabled,
  serviceSlotsOpen = 4,
}: {
  vat: string;
  sector: Sector;
  walkInEnabled: boolean;
  serviceSlotsOpen?: number;
}) {
  const [data, setData] = useState<CapacitySnapshot | null>(null);
  const unit = UNIT[sector] ?? "Spots";

  useEffect(() => {
    if (!walkInEnabled) return;
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/capacity/${encodeURIComponent(vat)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as CapacitySnapshot;
        if (alive) setData(json);
      } catch {
        // keep service fallback
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [vat, walkInEnabled]);

  const spots = walkInEnabled
    ? (data?.spots_open ?? serviceSlotsOpen)
    : serviceSlotsOpen;
  const label = walkInEnabled
    ? `${spots} ${unit} Open Right Now`
    : `${spots} ${unit} Open Today`;

  const liveLabel = walkInEnabled
    ? `🟢 Live Studio Capacity: ${spots} Spots`
    : label;

  return (
    <span className="nx-pill border border-white/30 !bg-white/10 !text-white backdrop-blur">
      {liveLabel}
    </span>
  );
}
