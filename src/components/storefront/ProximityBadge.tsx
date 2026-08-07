"use client";

import { useEffect, useState } from "react";
import {
  haversineKm,
  proximityLabel,
  type LatLng,
} from "@/lib/geo/distance";

export function ProximityBadge({
  latitude,
  longitude,
}: {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (
      latitude == null ||
      longitude == null ||
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      return;
    }

    const merchant: LatLng = { lat: latitude, lng: longitude };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = haversineKm(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          merchant,
        );
        setLabel(proximityLabel(km));
      },
      () => setLabel(null),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 },
    );
  }, [latitude, longitude]);

  if (!label) return null;

  return <span className="nx-pill border border-white/30 !bg-white/10 !text-white">{label}</span>;
}
