"use client";

import { useMemo, useState, useTransition } from "react";
import type { Sector, ServiceOffer } from "@/types";
import { formatMoney } from "@/lib/commerce/money";
import { demandProofForOffer } from "@/lib/commerce/demand";
import {
  catalogItemClass,
  catalogLayoutMode,
  catalogShellClass,
} from "@/lib/commerce/layout";
import { formatSlotLabel, nextAppointmentSlots } from "@/lib/commerce/slots";
import { CheckoutModal } from "@/components/storefront/CheckoutModal";
import { OfferImage } from "@/components/storefront/OfferImage";
import { DemandProofBadges } from "@/components/storefront/DemandProofBadges";
import {
  DetailDrawer,
  featuresFromText,
  type DetailDrawerItem,
} from "@/components/storefront/DetailDrawer";
import { MarketBenchmark } from "@/components/MarketBenchmark";

export function ServicesBoard({
  vat,
  sector,
  services,
  embedded = false,
}: {
  vat: string;
  sector: Sector;
  services: ServiceOffer[];
  embedded?: boolean;
}) {
  const slots = useMemo(() => nextAppointmentSlots(4), []);
  const [selectedSlot, setSelectedSlot] = useState(slots[0] ?? "");
  const [preview, setPreview] = useState<ServiceOffer | null>(null);
  const [checkout, setCheckout] = useState<ServiceOffer | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!services.length) return null;

  const mode = catalogLayoutMode(services.length);

  const drawerItem: DetailDrawerItem | null = preview
    ? {
        kind: "service",
        id: preview.id,
        name: preview.name,
        description: preview.description,
        imageUrl: preview.image_url,
        priceLabel: formatMoney(preview.price_cents, preview.currency),
        metaLabel: `${preview.duration_minutes} min estimated duration`,
        features: featuresFromText(preview.description, [
          `${preview.duration_minutes}-minute session`,
          selectedSlot
            ? `Next hold target: ${formatSlotLabel(selectedSlot)}`
            : "Flexible appointment windows",
          "SMS confirmation after reserve",
        ]),
        ctaLabel: "Book with Apple Pay / Card",
        slots,
        selectedSlot,
      }
    : null;

  const confirm = (phone: string) => {
    if (!checkout || !selectedSlot) return;
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/commerce/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vat,
          service_id: checkout.id,
          phone,
          starts_at: selectedSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(data.error || "Booking failed");
        return;
      }
      setMessage(
        `Booked ${checkout.name} for ${formatSlotLabel(String(data.starts_at))}`,
      );
      setCheckout(null);
    });
  };

  const body = (
    <>
      {!embedded ? (
        <>
          <p className="nx-eyebrow">Services & appointments</p>
          <h2 className="nx-display mt-3 text-4xl md:text-5xl">
            Book the next open slot
          </h2>
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Real booking density — verified demand signals, not inflated ad
            clicks.
          </p>
        </>
      ) : null}

      <div className={`flex flex-wrap gap-2 ${embedded ? "mt-1" : "mt-8"}`}>
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
        <p className="mt-4 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-medium text-[var(--accent-deep)]">
          {message}
        </p>
      ) : null}

      <div
        className={
          embedded
            ? catalogShellClass(mode).replace("mt-10", "mt-4")
            : catalogShellClass(mode)
        }
      >
          {services.map((service) => {
            const proof = demandProofForOffer(service.id, vat, "service");
            if (mode === "spotlight") {
              return (
                <article
                  key={service.id}
                  className="nx-card grid overflow-hidden md:grid-cols-2"
                >
                  <OfferImage
                    src={service.image_url}
                    sector={sector}
                    alt={service.name}
                    aspect="4/3"
                    className="h-full min-h-[280px] md:min-h-full"
                  />
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      Appointment · Spotlight
                    </p>
                    <h3 className="nx-display mt-2 text-3xl md:text-4xl">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                      {service.duration_minutes} min ·{" "}
                      {formatMoney(service.price_cents, service.currency)}
                    </p>
                    <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
                      {service.description}
                    </p>
                    <DemandProofBadges proof={proof} variant="spotlight" />
                    <div className="mt-4">
                      <MarketBenchmark
                        serviceName={service.name}
                        priceCents={service.price_cents}
                        currency={service.currency}
                        sector={sector}
                        onBook={() => setCheckout(service)}
                        bookLabel={`Book ${service.name} — ${formatMoney(service.price_cents, service.currency)}`}
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="nx-btn nx-btn-ghost"
                        onClick={() => setPreview(service)}
                      >
                        Learn more
                      </button>
                    </div>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={service.id}
                className={`nx-card flex cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 ${catalogItemClass(mode)}`}
                onClick={() => setPreview(service)}
              >
                <OfferImage
                  src={service.image_url}
                  sector={sector}
                  alt={service.name}
                  aspect="square"
                  className="hidden w-36 shrink-0 self-stretch sm:block"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {service.duration_minutes} min ·{" "}
                    {formatMoney(service.price_cents, service.currency)}
                  </p>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--muted)]">
                    {service.description}
                  </p>
                  <DemandProofBadges proof={proof} />
                  <div
                    className="mt-3"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <MarketBenchmark
                      serviceName={service.name}
                      priceCents={service.price_cents}
                      currency={service.currency}
                      sector={sector}
                      onBook={() => setCheckout(service)}
                      bookLabel={`Book ${service.name} — ${formatMoney(service.price_cents, service.currency)}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="nx-btn nx-btn-ghost mt-3 self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(service);
                    }}
                  >
                    Learn more
                  </button>
                </div>
              </article>
            );
          })}
      </div>

      <DetailDrawer
        open={Boolean(preview)}
        sector={sector}
        item={drawerItem}
        onClose={() => setPreview(null)}
        onSelectSlot={(slot) => setSelectedSlot(slot)}
        onCheckout={() => {
          if (!preview) return;
          setCheckout(preview);
          setPreview(null);
        }}
      />

      <CheckoutModal
        open={Boolean(checkout)}
        title={checkout ? `Reserve ${checkout.name}` : "Reserve slot"}
        subtitle={
          selectedSlot
            ? `${formatSlotLabel(selectedSlot)} · confirmation by SMS`
            : undefined
        }
        confirmLabel="Confirm reservation"
        pending={pending}
        onClose={() => setCheckout(null)}
        onConfirm={confirm}
      />
    </>
  );

  if (embedded) {
    return <div id="services">{body}</div>;
  }

  return (
    <section id="services" className="scroll-mt-20 bg-white py-12 md:py-16">
      <div className="nx-container">{body}</div>
    </section>
  );
}
