"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { Practitioner, Product, Sector, ServiceOffer } from "@/types";
import type { ExtendedFilterState } from "@/types/search";
import { EMPTY_FILTER_STATE } from "@/types/search";
import { formatMoney } from "@/lib/commerce/money";
import { formatSlotLabel, nextAppointmentSlots } from "@/lib/commerce/slots";
import { isAvailableAtSlot } from "@/lib/commerce/availability";
import { trustFallbackImage } from "@/lib/commerce/media";
import { filterPractitionersByExtended } from "@/lib/directoryFilters";
import { CheckoutModal } from "@/components/storefront/CheckoutModal";
import { OfferImage } from "@/components/storefront/OfferImage";
import {
  DetailDrawer,
  featuresFromText,
  type DetailDrawerItem,
} from "@/components/storefront/DetailDrawer";
import { MarketBenchmark } from "@/components/MarketBenchmark";
import { DirectoryFilterBar } from "@/components/DirectoryFilterBar";

type Tab = "services" | "doctors" | "products";

type Selected =
  | { type: "service"; data: ServiceOffer }
  | { type: "product"; data: Product };

export function DiscoveryHub({
  vat,
  sector,
  services,
  products,
  practitioners,
}: {
  vat: string;
  sector: Sector;
  services: ServiceOffer[];
  products: Product[];
  practitioners: Practitioner[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>(
    services.length ? "services" : practitioners.length ? "doctors" : "products",
  );
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Selected | null>(null);
  const [checkout, setCheckout] = useState<Selected | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [dirFilters, setDirFilters] =
    useState<ExtendedFilterState>(EMPTY_FILTER_STATE);

  // Client-only slot generation — avoids SSR Date drift killing hydration
  useEffect(() => {
    const next = nextAppointmentSlots(4);
    setSlots(next);
    setSelectedSlot((prev) => prev ?? next[0] ?? null);
  }, []);

  const insuranceOptions = useMemo(() => {
    const names = new Set<string>();
    for (const p of practitioners) {
      for (const n of p.insuranceNetworks) names.add(n.providerName);
    }
    return [...names].sort();
  }, [practitioners]);

  const languageOptions = useMemo(() => {
    const names = new Set<string>();
    for (const p of practitioners) {
      for (const l of p.dossier.languagesSpoken) names.add(l);
    }
    return [...names].sort();
  }, [practitioners]);

  const tabs: Array<{ id: Tab; label: string }> = [];
  if (services.length) tabs.push({ id: "services", label: "Services & Consults" });
  if (practitioners.length) {
    tabs.push({
      id: "doctors",
      label: sector === "CLINIC" ? "Doctors & Specialists" : "Team & Specialists",
    });
  }
  if (products.length) tabs.push({ id: "products", label: "Products & Kits" });

  if (!tabs.length) return null;

  const slotFilteredServices = services.filter((s) =>
    isAvailableAtSlot(s.id, selectedSlot),
  );
  const slotFilteredDoctors = practitioners.filter((p) =>
    isAvailableAtSlot(p.id, selectedSlot),
  );
  // Never blank the grid — fall back to full list if slot filter empties it
  const filteredServices =
    slotFilteredServices.length > 0 ? slotFilteredServices : services;
  const slotDoctors =
    slotFilteredDoctors.length > 0 ? slotFilteredDoctors : practitioners;
  const filteredDoctors = filterPractitionersByExtended(
    slotDoctors,
    dirFilters,
  );
  const assigned = practitioners[0] ?? null;

  let drawerItem: DetailDrawerItem | null = null;
  if (selectedItem?.type === "service") {
    const s = selectedItem.data;
    drawerItem = {
      kind: "service",
      id: s.id,
      name: s.name,
      description: s.description,
      imageUrl: s.image_url,
      priceLabel: formatMoney(s.price_cents, s.currency),
      metaLabel: `${s.duration_minutes} min`,
      features: featuresFromText(s.description, [
        `${s.duration_minutes}-minute session`,
        selectedSlot ? `Slot: ${formatSlotLabel(selectedSlot)}` : "Pick a slot",
      ]),
      ctaLabel: "Book with Apple Pay / Card",
      practitionerName: assigned?.full_name,
      practitionerCredential: assigned?.credential,
      practitionerBio: assigned?.bio,
      slots,
      selectedSlot,
    };
  } else if (selectedItem?.type === "product") {
    const p = selectedItem.data;
    drawerItem = {
      kind: "product",
      id: p.id,
      name: p.name,
      description: p.description,
      imageUrl: p.image_url,
      priceLabel: formatMoney(p.price_cents, p.currency),
      metaLabel: p.kind,
      features: featuresFromText(p.description, [
        p.in_stock ? "In stock" : "Sold out",
      ]),
      ctaLabel: p.in_stock ? "Buy with Apple Pay / Card" : "Sold out",
      ctaDisabled: !p.in_stock,
    };
  }

  const confirm = (phone: string) => {
    if (!checkout) return;
    setMessage(null);
    startTransition(async () => {
      if (checkout.type === "product") {
        const res = await fetch("/api/commerce/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vat,
            product_id: checkout.data.id,
            phone,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setMessage(data.error || "Purchase failed");
          return;
        }
        setMessage(`Purchased ${checkout.data.name}`);
        setCheckout(null);
        return;
      }
      if (!selectedSlot) {
        setMessage("Select a time slot first");
        return;
      }
      const res = await fetch("/api/commerce/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vat,
          service_id: checkout.data.id,
          phone,
          starts_at: selectedSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(data.error || "Booking failed");
        return;
      }
      setMessage(`Booked ${checkout.data.name}`);
      setCheckout(null);
    });
  };

  return (
    <section
      id="catalog"
      data-nx-hub="1"
      data-active-tab={activeTab}
      className="scroll-mt-16 border-y border-[var(--line)] bg-[var(--paper)]"
    >
      <div className="nx-container py-10 md:py-12">
        <p className="nx-eyebrow">Discovery hub</p>
        <h2 className="nx-display mt-2 text-3xl md:text-4xl">
          Find what you need in one tap
        </h2>

        <div
          className="sticky top-0 z-30 mt-6 flex flex-wrap gap-2 bg-[var(--paper)]/95 py-3"
          role="tablist"
        >
          {tabs.map((tab) => {
            const on = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${
                  on
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {(activeTab === "services" || activeTab === "doctors") && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="self-center text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Time
            </span>
            {slots.map((slot) => {
              const on = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`nx-tab ${on ? "nx-tab-active" : "nx-tab-idle"}`}
                >
                  {formatSlotLabel(slot)}
                </button>
              );
            })}
          </div>
        )}

        {message ? (
          <p className="mt-4 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-medium text-[var(--accent-deep)]">
            {message}
          </p>
        ) : null}

        {activeTab === "doctors" ? (
          <div className="mt-6">
            <DirectoryFilterBar
              value={dirFilters}
              onChange={setDirFilters}
              insuranceOptions={insuranceOptions}
              languageOptions={languageOptions}
            />
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {activeTab === "services" &&
            (filteredServices.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No services at this slot.</p>
            ) : (
              filteredServices.map((s) => (
                <article key={s.id} className="nx-card flex overflow-hidden">
                  <OfferImage
                    src={s.image_url}
                    sector={sector}
                    alt={s.name}
                    aspect="square"
                    className="hidden w-32 sm:block"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold">{s.name}</h3>
                    <p className="text-sm text-[var(--muted)]">
                      {s.duration_minutes} min ·{" "}
                      {formatMoney(s.price_cents, s.currency)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                      {s.description}
                    </p>
                    <div className="mt-3">
                      <MarketBenchmark
                        serviceName={s.name}
                        priceCents={s.price_cents}
                        currency={s.currency}
                        sector={sector}
                        onBook={() => setCheckout({ type: "service", data: s })}
                      />
                    </div>
                    <button
                      type="button"
                      className="nx-btn nx-btn-ghost mt-3 self-start"
                      onClick={() =>
                        setSelectedItem({ type: "service", data: s })
                      }
                    >
                      Learn more
                    </button>
                  </div>
                </article>
              ))
            ))}

          {activeTab === "doctors" &&
            (filteredDoctors.length === 0 ? (
              <p className="col-span-full text-sm text-[var(--muted)]">
                No specialists match these filters.
              </p>
            ) : (
              filteredDoctors.map((p) => {
                const photo = p.headshot_url || trustFallbackImage(sector);
                const pass = p.introPasses.find((c) => c.remainingQuantity > 0);
                return (
                  <article key={p.id} className="nx-card overflow-hidden">
                    <div
                      className="aspect-[4/3] bg-cover bg-center"
                      style={{ backgroundImage: `url("${photo}")` }}
                    />
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                        Practitioner · {p.credential}
                      </p>
                      {p.licenses.some((l) => l.status === "VERIFIED") ? (
                        <p className="nx-pill mt-2">🛡️ License verified</p>
                      ) : null}
                      <h3 className="mt-2 text-lg font-semibold">{p.full_name}</h3>
                      {p.rating != null ? (
                        <p className="mt-1 text-sm font-semibold">
                          {p.rating.toFixed(1)} ★ ({p.review_count})
                        </p>
                      ) : null}
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {p.client_count}+ {p.client_label} Treated
                      </p>
                      {p.insuranceNetworks.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {p.insuranceNetworks.map((n) => (
                            <span key={n.providerName} className="nx-pill">
                              {n.providerName}
                              {n.directBilling ? " · Direct" : ""}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {p.traveling?.locations?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {p.traveling.locations.map((loc) => (
                            <span key={loc.id} className="nx-pill">
                              {loc.city}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {p.hasWheelchairAccess ? (
                        <p className="mt-2 text-xs font-medium text-zinc-600">
                          ♿ Wheelchair accessible
                        </p>
                      ) : null}
                      {pass ? (
                        <p className="mt-3 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3 py-2 text-xs font-medium text-zinc-700">
                          New patient rate ·{" "}
                          <span className="line-through text-zinc-400">
                            {formatMoney(
                              pass.originalPrice,
                              pass.currency ?? "ils",
                            )}
                          </span>{" "}
                          {formatMoney(
                            pass.discountPrice,
                            pass.currency ?? "ils",
                          )}{" "}
                          · {pass.remainingQuantity} slots this week
                        </p>
                      ) : null}
                      <Link
                        href={`/${encodeURIComponent(vat)}/p/${encodeURIComponent(p.slug)}`}
                        className="nx-btn nx-btn-accent mt-4 inline-flex !py-2 text-sm"
                      >
                        View Profile & Book
                      </Link>
                    </div>
                  </article>
                );
              })
            ))}

          {activeTab === "products" &&
            products.map((p) => (
              <article key={p.id} className="nx-card overflow-hidden">
                <OfferImage
                  src={p.image_url}
                  sector={sector}
                  alt={p.name}
                  aspect="4/3"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-sm font-semibold">
                    {formatMoney(p.price_cents, p.currency)}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                    {p.description}
                  </p>
                  <button
                    type="button"
                    className="nx-btn nx-btn-ghost mt-4 w-full"
                    onClick={() => setSelectedItem({ type: "product", data: p })}
                  >
                    Learn more
                  </button>
                </div>
              </article>
            ))}
        </div>
      </div>

      <DetailDrawer
        open={selectedItem != null}
        sector={sector}
        item={drawerItem}
        onClose={() => setSelectedItem(null)}
        onSelectSlot={setSelectedSlot}
        onCheckout={() => {
          if (!selectedItem) return;
          setCheckout(selectedItem);
          setSelectedItem(null);
        }}
      />

      <CheckoutModal
        open={checkout != null}
        title={
          checkout
            ? `${checkout.type === "product" ? "Buy" : "Reserve"} ${checkout.data.name}`
            : "Checkout"
        }
        subtitle="Apple Pay / Stripe · 1-tap"
        confirmLabel="Confirm 1-tap checkout"
        pending={pending}
        onClose={() => setCheckout(null)}
        onConfirm={confirm}
      />
    </section>
  );
}
