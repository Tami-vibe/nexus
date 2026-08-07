"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MARCO_RIVA_PROFILE } from "@/data/mockComparisons";
import { LocationSwitcher } from "@/components/LocationSwitcher";
import {
  locationEmoji,
  mapsUrlForLocation,
  slotsForLocation,
} from "@/lib/locations";
import { formatMoney } from "@/lib/commerce/money";
import { formatSlotLabel } from "@/lib/commerce/slots";
import { NewPatientOfferCard } from "@/components/NewPatientOfferCard";

/**
 * Multi-location podologist mock — Milan / Piemonte ASL / Genova switcher.
 */
export default function DottMarcoRivaPage() {
  const profile = MARCO_RIVA_PROFILE;
  const locations = profile.traveling.locations;
  const [activeLocationId, setActiveLocationId] = useState(
    profile.traveling.activeLocationId,
  );

  const location = useMemo(
    () =>
      locations.find((l) => l.id === activeLocationId) ?? locations[0]!,
    [locations, activeLocationId],
  );

  const slots = useMemo(
    () => slotsForLocation(location, 4),
    [location],
  );
  const [selectedSlot, setSelectedSlot] = useState(slots[0] ?? "");

  useEffect(() => {
    setSelectedSlot(slots[0] ?? "");
  }, [slots]);

  const priceLabel = formatMoney(profile.priceCents, profile.currency);

  return (
    <main className="min-h-screen bg-zinc-50 pb-16">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 text-white">
          <Link href="/" className="text-sm font-semibold">
            Nexus OS
          </Link>
          <Link
            href="/compare/microblading"
            className="rounded-xl border border-white/40 px-3 py-1.5 text-sm font-medium hover:bg-white hover:text-zinc-900"
          >
            Microblading compare
          </Link>
        </div>
      </header>

      <section className="relative min-h-[48vh] overflow-hidden text-white md:min-h-[56vh]">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url("${profile.headshotUrl}")` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[48vh] w-full max-w-6xl flex-col justify-end px-5 pb-12 pt-24 md:min-h-[56vh]">
          <p className="text-sm font-semibold text-[#FF5E1A]">
            {profile.title}
          </p>
          <h1
            className="mt-3 text-5xl tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {profile.fullName}
          </h1>
          <p className="mt-2 text-sm font-medium text-white/85 md:text-base">
            {profile.credential} • {location.city}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium">
              {profile.rating.toFixed(1)} ★ ({profile.reviewCount})
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium">
              {profile.verifiedClients.toLocaleString()}+ Patients
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200/60 bg-zinc-50/60 py-4">
        <div className="mx-auto w-full max-w-6xl space-y-3 px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Practice locations · Italy
          </p>
          <LocationSwitcher
            locations={locations}
            activeLocationId={activeLocationId}
            onChange={setActiveLocationId}
          />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <article className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-none md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Care philosophy
            </p>
            <p
              className="mt-4 text-xl leading-relaxed text-zinc-900 md:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {profile.bioHeader}
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Clinical focus
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {profile.specialties.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700"
                >
                  {s}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="space-y-5 md:sticky md:top-6 md:self-start">
          {profile.introPasses.map((coupon) => (
            <NewPatientOfferCard key={coupon.id} coupon={coupon} />
          ))}

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Insurance · accessibility
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {profile.insuranceNetworks.map((n) => (
                <li
                  key={n.providerName}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                >
                  {n.providerName}
                  {n.directBilling ? " · Direct" : " · Invoice"}
                </li>
              ))}
            </ul>
            {profile.hasWheelchairAccess ? (
              <p className="mt-3 text-xs font-medium text-zinc-600">
                ♿ Wheelchair / step-free access
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Active location
            </p>
            <p className="mt-2 text-lg font-semibold text-zinc-900">
              {locationEmoji(location)} {location.name}
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              {location.address}, {location.city}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                Next: {location.nextOpenSlot}
              </span>
              {location.distanceKm != null ? (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  {location.distanceKm} km
                </span>
              ) : null}
            </div>

            <div
              className="mt-4 aspect-video overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-900 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(160deg, rgba(9,9,11,0.5), rgba(9,9,11,0.75)), url("${profile.headshotUrl}")`,
              }}
              role="img"
              aria-label={`Map pin · ${location.city}`}
            >
              <div className="flex h-full flex-col justify-end p-4 text-white">
                <p className="text-sm font-semibold">
                  📍 {location.city}
                </p>
                <p className="text-xs text-white/80">{location.address}</p>
              </div>
            </div>

            <a
              href={mapsUrlForLocation(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-950"
            >
              Open Navigation · {location.city}
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Calendar · {location.city}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selectedSlot === slot
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {formatSlotLabel(slot)}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Transparent market index
                </p>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-semibold text-white">
                  Licensed Podiatrist
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Experience
                  </p>
                  <p className="text-sm font-semibold">
                    {profile.experienceYears}+ Yrs Exp
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Verified patients
                  </p>
                  <p className="text-sm font-semibold">
                    {profile.verifiedClients.toLocaleString()}+
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-900">
                {priceLabel} · Licensed Podiatrist
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Booking at {location.name}
              </p>

              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#FF5E1A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E55013]"
              >
                Book {location.city} Consult — {priceLabel}
                {selectedSlot
                  ? ` · ${formatSlotLabel(selectedSlot)}`
                  : ""}
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
