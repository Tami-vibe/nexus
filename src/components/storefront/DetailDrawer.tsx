"use client";

import { useEffect, useId, useState } from "react";
import { OfferImage } from "@/components/storefront/OfferImage";
import type { Sector } from "@/types";
import { offerFallbackImage } from "@/lib/commerce/media";
import { formatSlotLabel } from "@/lib/commerce/slots";

export type DetailDrawerItem = {
  kind: "product" | "service";
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  priceLabel: string;
  metaLabel: string;
  features: string[];
  ctaLabel: string;
  ctaDisabled?: boolean;
  practitionerName?: string | null;
  practitionerCredential?: string | null;
  practitionerBio?: string | null;
  slots?: string[];
  selectedSlot?: string | null;
};

type Props = {
  open: boolean;
  sector: Sector;
  item: DetailDrawerItem | null;
  onClose: () => void;
  onCheckout: () => void;
  onSelectSlot?: (slotIso: string) => void;
};

/** Glassmorphic right-side detail drawer — Learn More → gallery + slots + checkout. */
export function DetailDrawer({
  open,
  sector,
  item,
  onClose,
  onCheckout,
  onSelectSlot,
}: Props) {
  const titleId = useId();
  const [slide, setSlide] = useState(0);

  const gallery = buildGallery(item?.imageUrl, sector);

  useEffect(() => {
    setSlide(0);
  }, [item?.id, open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[90]"
      role="dialog"
      aria-modal
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--ink)]/50 backdrop-blur-md"
        aria-label="Close details"
        onClick={onClose}
      />

      <aside className="nx-drawer-panel absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-white/20 bg-white/95 backdrop-blur-xl sm:rounded-l-3xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
            {item.kind === "product" ? "Product details" : "Service details"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-lg font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="relative bg-[var(--paper)]">
            <OfferImage
              src={gallery[slide]}
              sector={sector}
              alt={item.name}
              aspect="4/3"
              className="w-full"
            />
            {gallery.length > 1 ? (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Photo ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      i === slide
                        ? "bg-[var(--accent)]"
                        : "bg-white/80 ring-1 ring-black/15"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto px-5 pt-4">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={`nx-media-frame relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                    i === slide ? "border-[var(--accent)]" : "border-transparent"
                  }`}
                >
                  <OfferImage
                    src={src}
                    sector={sector}
                    alt=""
                    aspect="fill"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="px-5 py-6">
            <h2 id={titleId} className="nx-display text-3xl">
              {item.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-xl font-semibold text-[var(--ink)]">
                {item.priceLabel}
              </p>
              <p className="text-sm font-medium text-[var(--muted)]">
                {item.metaLabel}
              </p>
            </div>
            <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
              {item.description ||
                "Premium offer with clear deliverables and a one-tap checkout."}
            </p>

            {item.features.length ? (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Deliverables & benefits
                </p>
                <ul className="mt-3 space-y-2">
                  {item.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2 text-sm text-[var(--ink-soft)]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {item.practitionerName ? (
              <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Assigned practitioner
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                  {item.practitionerName}
                  {item.practitionerCredential
                    ? ` · ${item.practitionerCredential}`
                    : ""}
                </p>
                {item.practitionerBio ? (
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--ink-soft)]">
                    {item.practitionerBio}
                  </p>
                ) : null}
              </div>
            ) : null}

            {item.kind === "service" && item.slots?.length ? (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Select time slot
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.slots.map((slot) => {
                    const active = item.selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => onSelectSlot?.(slot)}
                        className={`nx-tab ${active ? "nx-tab-active" : "nx-tab-idle"}`}
                      >
                        {formatSlotLabel(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 border-t border-[var(--line)] bg-white/95 p-5 backdrop-blur">
          <button
            type="button"
            disabled={item.ctaDisabled}
            className="nx-btn nx-btn-accent w-full text-base"
            onClick={onCheckout}
          >
            {item.ctaLabel}
          </button>
          <p className="text-center text-xs font-medium text-[var(--muted)]">
            Apple Pay / Stripe · 1-tap secure checkout
          </p>
        </div>
      </aside>
    </div>
  );
}

function buildGallery(
  imageUrl: string | null | undefined,
  sector: Sector,
): string[] {
  const primary = imageUrl || offerFallbackImage(sector);
  const secondary = offerFallbackImage(sector);
  const tertiary = primary.includes("?")
    ? `${primary}&sat=-20`
    : primary;
  return Array.from(new Set([primary, secondary, tertiary])).slice(0, 3);
}

export function featuresFromText(
  description: string | null | undefined,
  extras: string[],
): string[] {
  const fromDesc = (description || "")
    .split(/[.!;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 18)
    .slice(0, 3);
  return Array.from(new Set([...extras, ...fromDesc])).slice(0, 5);
}
