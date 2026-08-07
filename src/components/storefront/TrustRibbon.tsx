"use client";

import { useEffect, useState } from "react";
import {
  formatDistanceKm,
  haversineKm,
  type LatLng,
} from "@/lib/geo/distance";
import type { CapacitySnapshot } from "@/types";

type Props = {
  vat: string;
  rating: number | null;
  reviewCount: number;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  walkInEnabled?: boolean;
};

/**
 * Stockholm trust bar — borderless emoji grid + optional live capacity pill.
 */
export function TrustRibbon({
  vat,
  rating,
  reviewCount,
  latitude,
  longitude,
  city,
  walkInEnabled = false,
}: Props) {
  const [nearby, setNearby] = useState<string>("Browser Distance Sync");
  const [capacity, setCapacity] = useState<CapacitySnapshot | null>(null);

  useEffect(() => {
    if (
      latitude == null ||
      longitude == null ||
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      if (city) setNearby(`Serving ${city}`);
      return;
    }
    const merchant: LatLng = { lat: latitude, lng: longitude };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = haversineKm(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          merchant,
        );
        setNearby(`${formatDistanceKm(km)} · Browser Distance Sync`);
      },
      () => {
        if (city) setNearby(`Serving ${city}`);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 },
    );
  }, [latitude, longitude, city]);

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
        if (alive) setCapacity(json);
      } catch {
        // non-blocking
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [vat, walkInEnabled]);

  const ratingDetail =
    rating != null
      ? `${rating.toFixed(1)} • Verified Outcomes`
      : "Verified Outcomes";

  const items = [
    {
      icon: "🛡️",
      title: "Verified Merchant",
      detail: "Linked to VAT Registry",
    },
    {
      icon: "⚡",
      title: "Instant Reservation",
      detail: "Direct Calendar Sync",
    },
    {
      icon: "⭐",
      title: "Top Rated",
      detail: ratingDetail,
    },
    {
      icon: "📍",
      title: "Nearby Location",
      detail: nearby,
    },
  ];

  return (
    <section
      aria-label="Trust and value"
      className="border-y border-zinc-200/60 bg-zinc-50/60 py-4"
    >
      <div className="nx-container">
        {walkInEnabled && capacity ? (
          <div className="mb-4 flex justify-center md:justify-start">
            <span className="nx-pill gap-1.5 !bg-white !text-zinc-800 border border-zinc-200/80">
              <span aria-hidden>🟢</span>
              Live Studio Capacity: {capacity.spots_open} Spots
              {capacity.is_estimated ? " (est.)" : ""}
            </span>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-xl leading-none" aria-hidden>
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-zinc-500">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
