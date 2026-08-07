"use client";

import type { TenantBundle } from "@/types";
import { buildMapsUrls } from "@/lib/geo/distance";

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABEL: Record<(typeof DAY_ORDER)[number], string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export function Footer({ tenant }: { tenant: TenantBundle }) {
  const profile = tenant.profile;
  const hours = profile?.hours_json ?? {};
  const place = [profile?.address, profile?.city].filter(Boolean).join(", ");
  const maps =
    profile?.latitude != null && profile?.longitude != null
      ? buildMapsUrls(
          { lat: profile.latitude, lng: profile.longitude },
          place || tenant.business_name,
        )
      : null;

  const openConsent = () => {
    window.dispatchEvent(new CustomEvent("nexus:open-consent"));
  };

  return (
    <footer className="mt-8 border-t border-[var(--line)] bg-[var(--ink)] text-white">
      <div className="nx-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            {tenant.business_name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            {profile?.description ||
              tenant.tagline ||
              "Autonomous commerce storefront powered by Nexus OS."}
          </p>
          <p className="mt-4 text-sm font-semibold text-white">
            VAT / Tax ID:{" "}
            <span className="font-mono text-[var(--accent)]">
              {tenant.vat_number}
            </span>
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
            Quick links
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="#products"
                className="text-zinc-200 hover:text-white"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="text-zinc-200 hover:text-white"
              >
                Bookings
              </a>
            </li>
            <li>
              <a
                href="#location"
                className="text-zinc-200 hover:text-white"
              >
                Location
              </a>
            </li>
            <li>
              <a
                href="/merchant/dashboard"
                className="text-zinc-200 hover:text-white"
              >
                Merchant CRM Login
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
            Working hours
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
            {DAY_ORDER.map((day) => (
              <li key={day} className="flex justify-between gap-4">
                <span className="text-zinc-400">{DAY_LABEL[day]}</span>
                <span className="font-medium text-white">
                  {hours[day] || "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
            Address & directions
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-200">
            {place || "Location shared on request"}
          </p>
          {profile?.phone ? (
            <p className="mt-2 text-sm text-zinc-300">{profile.phone}</p>
          ) : null}
          {maps ? (
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={maps.google}
                target="_blank"
                rel="noopener noreferrer"
                className="nx-btn nx-btn-secondary !py-2.5 text-sm"
              >
                Open in Google Maps
              </a>
              <a
                href={maps.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="nx-btn nx-btn-ghost !border-white/40 !py-2.5 !text-white hover:!bg-white hover:!text-zinc-900 text-sm"
              >
                Open in Apple Maps
              </a>
            </div>
          ) : (
            <a
              href="#location"
              className="nx-btn nx-btn-secondary mt-5 !py-2.5 text-sm"
            >
              View location hub
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="nx-container flex flex-col items-start justify-between gap-3 py-4 text-xs text-zinc-400 sm:flex-row sm:items-center">
          <p>
            Powered by{" "}
            <span className="font-semibold text-white">Nexus OS</span>
            {" · "}
            Autonomous Commerce Engine
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={openConsent}
              className="font-semibold text-zinc-300 underline-offset-2 transition hover:text-white hover:underline"
            >
              GDPR Cookie Preferences
            </button>
            <a href="/" className="font-semibold text-[var(--accent)] hover:text-white">
              Nexus platform
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
