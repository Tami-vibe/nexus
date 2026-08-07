/** Haversine distance + rough urban travel ETAs. */

export type LatLng = { lat: number; lng: number };

const EARTH_KM = 6371;
const WALK_KMH = 5;
const DRIVE_KMH = 28; // dense-city average

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function minutesForKm(km: number, mode: "walk" | "drive"): number {
  const speed = mode === "walk" ? WALK_KMH : DRIVE_KMH;
  return Math.max(1, Math.round((km / speed) * 60));
}

export function formatDistanceKm(km: number): string {
  if (km < 0.1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function buildMapsUrls(dest: LatLng, label?: string) {
  const q = encodeURIComponent(
    label?.trim() || `${dest.lat},${dest.lng}`,
  );
  const google = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`;
  const apple = `https://maps.apple.com/?daddr=${dest.lat},${dest.lng}&q=${q}`;
  return { google, apple };
}

export function proximityLabel(km: number): string {
  const drive = minutesForKm(km, "drive");
  return `📍 ${formatDistanceKm(km)} away • ~${drive} min drive`;
}
