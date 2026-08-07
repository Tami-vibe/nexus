"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildMapsUrls,
  formatDistanceKm,
  haversineKm,
  minutesForKm,
  proximityLabel,
  type LatLng,
} from "@/lib/geo/distance";
import { LeafletMap } from "@/components/storefront/LeafletMap";

export type LocationHubProps = {
  businessName: string;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  photoUrl?: string | null;
};

type GeoState =
  | { status: "idle" | "requesting" | "denied" | "unavailable" }
  | { status: "ready"; user: LatLng; km: number };

export function LocationHub({
  businessName,
  address,
  city,
  latitude,
  longitude,
  photoUrl,
}: LocationHubProps) {
  const merchant = useMemo<LatLng | null>(() => {
    if (latitude == null || longitude == null) return null;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { lat: latitude, lng: longitude };
  }, [latitude, longitude]);

  const [geo, setGeo] = useState<GeoState>({ status: "idle" });
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    if (!merchant || typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo({ status: "unavailable" });
      return;
    }

    setGeo({ status: "requesting" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const user = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setGeo({
          status: "ready",
          user,
          km: haversineKm(user, merchant),
        });
      },
      (err) => {
        setGeo({
          status: err.code === err.PERMISSION_DENIED ? "denied" : "unavailable",
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 },
    );
  }, [merchant]);

  const onMapReady = useCallback(() => setMapReady(true), []);
  const onMapFail = useCallback(() => setMapFailed(true), []);

  if (!merchant) return null;

  const placeLabel = [address, city].filter(Boolean).join(", ") || businessName;
  const maps = buildMapsUrls(merchant, placeLabel);
  const user = geo.status === "ready" ? geo.user : null;
  const walkMin =
    geo.status === "ready" ? minutesForKm(geo.km, "walk") : null;
  const driveMin =
    geo.status === "ready" ? minutesForKm(geo.km, "drive") : null;
  const etaBadge =
    geo.status === "ready" ? proximityLabel(geo.km) : "📍 Get directions";

  return (
    <section id="location" className="bg-white py-12 md:py-16">
      <div className="nx-container">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col justify-center">
            <p className="nx-eyebrow">Live proximity</p>
            <h2 className="nx-display mt-3 text-4xl md:text-5xl">
              Find us nearby
            </h2>
            <p className="mt-3 max-w-md text-[var(--muted)]">
              {placeLabel}. Distance updates from your browser — no app
              required.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {geo.status === "ready" ? (
                <>
                  <span className="nx-pill">{etaBadge}</span>
                  <span className="nx-pill">
                    ~{walkMin} min walk · {formatDistanceKm(geo.km)}
                  </span>
                  <span className="nx-pill nx-pill-active">
                    ~{driveMin} min drive
                  </span>
                </>
              ) : (
                <span className="nx-pill">
                  {geo.status === "requesting"
                    ? "Locating you…"
                    : "Enable location for live ETA"}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={maps.google}
                target="_blank"
                rel="noopener noreferrer"
                className="nx-btn nx-btn-secondary"
              >
                Open Navigation · Google Maps
              </a>
              <a
                href={maps.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="nx-btn nx-btn-ghost"
              >
                Apple Maps
              </a>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--ink)] md:min-h-[400px]">
            {/* Always-visible high-contrast location card (never blank) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: photoUrl
                  ? `linear-gradient(160deg, rgba(9,9,11,0.55), rgba(9,9,11,0.82)), url("${photoUrl}")`
                  : "linear-gradient(160deg, #18181b, #09090b)",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 z-[1] flex flex-col justify-end p-5 text-white">
              <span className="nx-pill !bg-white/15 !text-white border border-white/30">
                {etaBadge}
              </span>
              <p className="mt-3 text-lg font-semibold">{businessName}</p>
              <p className="text-sm text-zinc-300">{placeLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={maps.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nx-btn nx-btn-secondary !px-4 !py-2 text-xs"
                >
                  Open Navigation
                </a>
                <a
                  href={maps.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nx-btn nx-btn-ghost !border-white/50 !px-4 !py-2 !text-white hover:!bg-white hover:!text-zinc-900 text-xs"
                >
                  Apple Maps
                </a>
              </div>
            </div>

            {!mapFailed ? (
              <div
                className={`absolute inset-0 z-[2] transition-opacity duration-300 ${
                  mapReady ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <LeafletMap
                  merchant={merchant}
                  user={user}
                  className="h-full w-full"
                  onReady={onMapReady}
                  onFail={onMapFail}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
