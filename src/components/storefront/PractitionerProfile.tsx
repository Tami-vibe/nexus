"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { Practitioner, Sector, ServiceOffer } from "@/types";
import { formatSlotLabel } from "@/lib/commerce/slots";
import { formatMoney } from "@/lib/commerce/money";
import { trustFallbackImage } from "@/lib/commerce/media";
import { CheckoutModal } from "@/components/storefront/CheckoutModal";
import { ProfessionalBento } from "@/components/ProfessionalBento";
import { LocationSwitcher } from "@/components/LocationSwitcher";
import { MarketBenchmark } from "@/components/MarketBenchmark";
import { NewPatientOfferCard } from "@/components/NewPatientOfferCard";
import { CATEGORY_TRUST_COPY } from "@/types/professional";
import { resolveProfessionalDossier } from "@/lib/professional";
import { resolveRoleBadge } from "@/lib/professionalLanguage";
import {
  activeLocation,
  mapsUrlForLocation,
  slotsForLocation,
} from "@/lib/locations";

export function PractitionerProfile({
  vat,
  businessName,
  sector,
  practitioner,
  services,
}: {
  vat: string;
  businessName: string;
  sector: Sector;
  practitioner: Practitioner;
  services: ServiceOffer[];
}) {
  const traveling = practitioner.traveling;
  const locations = traveling?.locations ?? [];
  const [activeLocationId, setActiveLocationId] = useState(
    traveling?.activeLocationId ?? locations[0]?.id ?? "",
  );

  const location = useMemo(() => {
    if (!traveling) return null;
    return (
      traveling.locations.find((l) => l.id === activeLocationId) ??
      activeLocation(traveling)
    );
  }, [traveling, activeLocationId]);

  const slots = useMemo(
    () => slotsForLocation(location, 4),
    [location],
  );
  const [selectedSlot, setSelectedSlot] = useState(slots[0] ?? "");
  const [checkoutService, setCheckoutService] = useState<ServiceOffer | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedSlot(slots[0] ?? "");
  }, [slots]);

  const photo = practitioner.headshot_url || trustFallbackImage(sector);
  const videoStill = practitioner.video_url || trustFallbackImage(sector);
  const professional = resolveProfessionalDossier(practitioner, vat, sector);
  const trust = CATEGORY_TRUST_COPY[professional.category];
  const heroFocus =
    practitioner.title ||
    practitioner.specialties[0] ||
    practitioner.credential;

  const primaryService = services[0] ?? null;

  const confirm = (phone: string) => {
    if (!checkoutService || !selectedSlot) return;
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/commerce/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vat,
          service_id: checkoutService.id,
          phone,
          starts_at: selectedSlot,
          practitioner_slug: practitioner.slug,
          location_id: location?.id ?? null,
          location_city: location?.city ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(data.error || "Booking failed");
        return;
      }
      const where = location ? ` · ${location.city}` : "";
      setMessage(
        `Reserved with ${practitioner.full_name}${where} · ${formatSlotLabel(String(data.starts_at))}`,
      );
      setCheckoutService(null);
    });
  };

  return (
    <main className="pb-16">
      <section className="relative min-h-[36vh] overflow-hidden text-white md:min-h-[42vh]">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url("${photo}")` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="nx-container relative z-10 flex min-h-[36vh] flex-col justify-end pb-8 pt-20 md:min-h-[42vh]">
          <Link
            href={`/${vat}#catalog`}
            className="text-sm font-semibold text-white/80 hover:text-white"
          >
            ← Back to {businessName}
          </Link>
          <p className="mt-4 text-sm font-semibold tracking-wide text-[var(--accent)] md:text-base">
            {heroFocus}
          </p>
          <h1 className="nx-display mt-3 max-w-3xl text-5xl text-white md:text-6xl">
            {practitioner.full_name}
          </h1>
          <p className="mt-2 max-w-xl text-sm font-medium text-white/85 md:text-base">
            {practitioner.credential} • {businessName}
            {location ? ` • ${location.city}` : ""}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold">
            {practitioner.rating != null ? (
              <span className="nx-pill border border-white/30 !bg-white/10 !text-white">
                {practitioner.rating.toFixed(1)} ★ ({practitioner.review_count})
              </span>
            ) : null}
            <span className="nx-pill border border-white/30 !bg-white/10 !text-white">
              {practitioner.client_count}+ {practitioner.client_label} Treated
            </span>
          </div>
        </div>
      </section>

      {locations.length > 1 ? (
        <section className="border-b border-zinc-200/60 bg-zinc-50/60 py-4">
          <div className="nx-container space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Practice locations
            </p>
            <LocationSwitcher
              locations={locations}
              activeLocationId={activeLocationId}
              onChange={setActiveLocationId}
            />
          </div>
        </section>
      ) : null}

      <section className="nx-container grid gap-8 py-8 md:grid-cols-[1.15fr_0.85fr] md:py-10">
        <div className="min-w-0">
          <ProfessionalBento
            practitioner={practitioner}
            businessName={businessName}
            vat={vat}
            sector={sector}
            sameDayAvailable={
              sector === "CLINIC" ||
              sector === "SALON" ||
              sector === "GYM" ||
              sector === "POOL"
            }
          />

          <div className="mt-5 rounded-2xl border border-[var(--line)] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              {trust.outcomesLabel}
            </p>
            <p
              className="mt-3 text-lg leading-snug text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              “Clear plan, on time, and I left knowing exactly what to do next.”
            </p>
            <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
              ★★★★★
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
              Verified Patient · Visited with {practitioner.full_name}
            </p>
          </div>
        </div>

        <aside className="space-y-5 md:sticky md:top-6 md:self-start">
          {location ? (
            <div className="nx-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                Active location
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-900">
                {location.name}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {location.address}, {location.city}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="nx-pill">Next: {location.nextOpenSlot}</span>
                {location.distanceKm != null ? (
                  <span className="nx-pill">
                    {location.distanceKm.toFixed(1)} km
                  </span>
                ) : null}
              </div>
              <div
                className="mt-4 aspect-video overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(160deg, rgba(9,9,11,0.45), rgba(9,9,11,0.7)), url("${photo}")`,
                }}
                role="img"
                aria-label={`Map pin · ${location.city}`}
              >
                <div className="flex h-full flex-col justify-end p-4 text-white">
                  <p className="text-sm font-semibold">📍 {location.city}</p>
                  <p className="text-xs text-white/80">{location.address}</p>
                </div>
              </div>
              <a
                href={mapsUrlForLocation(location)}
                target="_blank"
                rel="noopener noreferrer"
                className="nx-btn nx-btn-secondary mt-4 w-full !py-2.5 text-sm"
              >
                Open Navigation
              </a>
            </div>
          ) : null}

          {practitioner.insuranceNetworks.length > 0 ? (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Insurance networks
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {practitioner.insuranceNetworks.map((n) => (
                  <li
                    key={n.providerName}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                  >
                    {n.providerName}
                    {n.directBilling ? " · Direct billing" : " · Invoice"}
                  </li>
                ))}
              </ul>
              {practitioner.hasWheelchairAccess ? (
                <p className="mt-3 text-xs font-medium text-zinc-600">
                  ♿ Wheelchair / step-free access
                </p>
              ) : null}
            </div>
          ) : null}

          {practitioner.introPasses
            .filter((c) => c.remainingQuantity > 0)
            .map((coupon) => (
              <NewPatientOfferCard
                key={coupon.id}
                coupon={coupon}
                onBook={() =>
                  setMessage(
                    `Consultation reserved — ${coupon.title}. Confirmation via SMS.`,
                  )
                }
              />
            ))}

          <div className="nx-card relative overflow-hidden">
            <div
              className="aspect-video bg-cover bg-center"
              style={{ backgroundImage: `url("${videoStill}")` }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/20 text-xl text-white backdrop-blur">
                ▶
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Outcome reel
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Verified stories from work with{" "}
                {practitioner.full_name.split(" ")[0]}.
              </p>
            </div>
          </div>

          <div className="nx-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Direct calendar · {practitioner.full_name.split(" ")[0]}
              {location ? ` · ${location.city}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`nx-tab ${
                    selectedSlot === slot ? "nx-tab-active" : "nx-tab-idle"
                  }`}
                >
                  {formatSlotLabel(slot)}
                </button>
              ))}
            </div>
            {message ? (
              <p className="mt-4 rounded-2xl bg-[var(--accent-soft)] px-3 py-2 text-sm font-medium text-[var(--accent-deep)]">
                {message}
              </p>
            ) : null}

            {primaryService ? (
              <div className="mt-4">
                <MarketBenchmark
                  serviceName={primaryService.name}
                  priceCents={primaryService.price_cents}
                  currency={primaryService.currency}
                  sector={sector}
                  experienceYears={
                    professional.category === "medical" ? 10 : 8
                  }
                  clientsTreated={practitioner.client_count}
                  tier={resolveRoleBadge({
                    sector,
                    credential: practitioner.credential,
                    title: practitioner.title,
                    licenses: practitioner.licenses,
                    experienceYears:
                      professional.category === "medical" ? 10 : 8,
                    clientsTreated: practitioner.client_count,
                  })}
                  onBook={() => setCheckoutService(primaryService)}
                  bookLabel={`Book Consultation — ${formatMoney(primaryService.price_cents, primaryService.currency)}`}
                />
              </div>
            ) : (
              <a
                href={`/${vat}#catalog`}
                className="nx-btn nx-btn-accent mt-4 w-full"
              >
                View clinic services
              </a>
            )}

            {services.length > 1 ? (
              <ul className="mt-3 space-y-2">
                {services.slice(1).map((svc) => (
                  <li key={svc.id}>
                    <button
                      type="button"
                      className="nx-btn nx-btn-ghost w-full !py-2 text-sm"
                      onClick={() => setCheckoutService(svc)}
                    >
                      Also: {svc.name}
                      {svc.price_cents
                        ? ` · ${formatMoney(svc.price_cents, svc.currency)}`
                        : ""}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </aside>
      </section>

      <CheckoutModal
        open={Boolean(checkoutService)}
        title={
          checkoutService
            ? `Book ${checkoutService.name} with ${practitioner.full_name}`
            : "Reserve"
        }
        subtitle={
          selectedSlot
            ? `${formatSlotLabel(selectedSlot)}${location ? ` · ${location.name}` : ""} · confirmation by SMS`
            : undefined
        }
        confirmLabel="Confirm reservation"
        pending={pending}
        onClose={() => setCheckoutService(null)}
        onConfirm={confirm}
      />
    </main>
  );
}
