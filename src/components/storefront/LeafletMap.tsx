"use client";

import { useEffect, useRef, useState } from "react";
import type { LatLng } from "@/lib/geo/distance";

type Props = {
  merchant: LatLng;
  user: LatLng | null;
  className?: string;
  onReady?: () => void;
  onFail?: () => void;
};

/** Imperative Leaflet canvas — SSR-safe with invalidateSize + OSM tiles. */
export function LeafletMap({
  merchant,
  user,
  className,
  onReady,
  onFail,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let map: import("leaflet").Map | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        const L = (await import("leaflet")).default;

        if (!document.querySelector("link[data-leaflet]")) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.dataset.leaflet = "1";
          document.head.appendChild(link);
        }

        // Wait a tick so CSS + layout settle (prevents blank canvas)
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        if (cancelled || !containerRef.current) return;

        const node = containerRef.current;
        node.style.minHeight = "320px";
        node.style.height = "100%";
        node.style.width = "100%";
        node.style.background = "#e4e4e7";

        map = L.map(node, {
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: false,
        });

        const tiles = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          },
        );
        tiles.on("tileerror", () => {
          if (!cancelled) {
            setFailed(true);
            onFail?.();
          }
        });
        tiles.addTo(map);

        const merchantIcon = L.divIcon({
          className: "nx-map-pin",
          html: `<div style="width:18px;height:18px;border-radius:999px;background:#FF5E1A;border:3px solid #09090B"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const userIcon = L.divIcon({
          className: "nx-map-pin",
          html: `<div style="width:14px;height:14px;border-radius:999px;background:#FFFFFF;border:3px solid #09090B"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        L.marker([merchant.lat, merchant.lng], { icon: merchantIcon }).addTo(
          map,
        );

        const points: [number, number][] = [[merchant.lat, merchant.lng]];
        if (user) {
          L.marker([user.lat, user.lng], { icon: userIcon }).addTo(map);
          L.polyline(
            [
              [user.lat, user.lng],
              [merchant.lat, merchant.lng],
            ],
            { color: "#FF5E1A", weight: 3, opacity: 0.85, dashArray: "6 8" },
          ).addTo(map);
          points.push([user.lat, user.lng]);
        }

        if (points.length > 1) {
          map.fitBounds(L.latLngBounds(points), {
            padding: [48, 48],
            maxZoom: 14,
          });
        } else {
          map.setView([merchant.lat, merchant.lng], 15);
        }

        timer = setTimeout(() => {
          map?.invalidateSize();
          onReady?.();
        }, 120);
      } catch {
        if (!cancelled) {
          setFailed(true);
          onFail?.();
        }
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [merchant.lat, merchant.lng, user?.lat, user?.lng, onReady, onFail]);

  if (failed) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: 320, width: "100%", background: "#e4e4e7" }}
      role="img"
      aria-label="Map showing business location"
    />
  );
}
