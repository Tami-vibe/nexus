"use client";

import { useState, useTransition } from "react";
import type { Product, Sector } from "@/types";
import { formatMoney } from "@/lib/commerce/money";
import { demandProofForOffer } from "@/lib/commerce/demand";
import {
  catalogItemClass,
  catalogLayoutMode,
  catalogShellClass,
} from "@/lib/commerce/layout";
import { CheckoutModal } from "@/components/storefront/CheckoutModal";
import { OfferImage } from "@/components/storefront/OfferImage";
import { DemandProofBadges } from "@/components/storefront/DemandProofBadges";
import {
  DetailDrawer,
  featuresFromText,
  type DetailDrawerItem,
} from "@/components/storefront/DetailDrawer";

function productMeta(kind: Product["kind"]): string {
  if (kind === "DIGITAL") return "Instant digital delivery";
  if (kind === "HANDCRAFT") return "Handmade · ~12–18 cm typical";
  return "Ships from studio · standard size";
}

export function ProductCatalog({
  vat,
  sector,
  products,
  embedded = false,
}: {
  vat: string;
  sector: Sector;
  products: Product[];
  embedded?: boolean;
}) {
  const [preview, setPreview] = useState<Product | null>(null);
  const [checkout, setCheckout] = useState<Product | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!products.length) return null;

  const mode = catalogLayoutMode(products.length);

  const drawerItem: DetailDrawerItem | null = preview
    ? {
        kind: "product",
        id: preview.id,
        name: preview.name,
        description: preview.description,
        imageUrl: preview.image_url,
        priceLabel: formatMoney(preview.price_cents, preview.currency),
        metaLabel: productMeta(preview.kind),
        features: featuresFromText(preview.description, [
          preview.in_stock ? "In stock for 1-tap purchase" : "Currently sold out",
          `${preview.kind.replace("_", " ")} offer`,
          productMeta(preview.kind),
        ]),
        ctaLabel: preview.in_stock ? "Buy with Apple Pay / Card" : "Sold out",
        ctaDisabled: !preview.in_stock,
      }
    : null;

  const confirm = (phone: string) => {
    if (!checkout) return;
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/commerce/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vat,
          product_id: checkout.id,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(data.error || data.reason || "Purchase failed");
        return;
      }
      setMessage(
        `Purchased ${checkout.name}. Order ${String(data.order_id).slice(0, 8)}…`,
      );
      setCheckout(null);
    });
  };

  const body = (
    <>
      {!embedded ? (
        <div>
          <p className="nx-eyebrow">Products & handcrafts</p>
          <h2 className="nx-display mt-3 text-4xl md:text-5xl">Buy in one tap</h2>
          <p className="mt-3 max-w-lg text-[var(--muted)]">
            Verified human demand — not PPC click farms. Open details, then
            complete purchase when ready.
          </p>
        </div>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-medium text-[var(--accent-deep)]">
          {message}
        </p>
      ) : null}

      <div className={embedded ? catalogShellClass(mode).replace("mt-10", "mt-2") : catalogShellClass(mode)}>
        {products.map((product) => {
          const proof = demandProofForOffer(product.id, vat, "product");
          if (mode === "spotlight") {
            return (
              <article
                key={product.id}
                className="nx-card grid overflow-hidden md:grid-cols-2"
              >
                <OfferImage
                  src={product.image_url}
                  sector={sector}
                  alt={product.name}
                  aspect="4/3"
                  className="h-full min-h-[280px] md:min-h-full"
                />
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {product.kind} · Spotlight
                  </p>
                  <h3 className="nx-display mt-2 text-3xl md:text-4xl">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatMoney(product.price_cents, product.currency)}
                  </p>
                  <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
                    {product.description}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {productMeta(product.kind)}
                  </p>
                  <DemandProofBadges proof={proof} variant="spotlight" />
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={!product.in_stock}
                      className="nx-btn nx-btn-accent"
                      onClick={() => {
                        if (!product.in_stock) return;
                        setCheckout(product);
                      }}
                    >
                      {product.in_stock ? "1-tap checkout" : "Sold out"}
                    </button>
                    <button
                      type="button"
                      className="nx-btn nx-btn-ghost"
                      onClick={() => setPreview(product)}
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
              key={product.id}
              className={`nx-card group cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${catalogItemClass(mode)}`}
              onClick={() => setPreview(product)}
            >
              <OfferImage
                src={product.image_url}
                sector={sector}
                alt={product.name}
                aspect="4/3"
                className="transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {product.kind}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">{product.name}</h3>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatMoney(product.price_cents, product.currency)}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                  {product.description}
                </p>
                <DemandProofBadges proof={proof} />
                <button
                  type="button"
                  disabled={!product.in_stock}
                  className="nx-btn nx-btn-ghost mt-4 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(product);
                  }}
                >
                  {product.in_stock ? "Learn more" : "Sold out"}
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
        onCheckout={() => {
          if (!preview?.in_stock) return;
          setCheckout(preview);
          setPreview(null);
        }}
      />

      <CheckoutModal
        open={Boolean(checkout)}
        title={checkout ? `Buy ${checkout.name}` : "Checkout"}
        subtitle={
          checkout
            ? `${formatMoney(checkout.price_cents, checkout.currency)} · receipt via SMS`
            : undefined
        }
        confirmLabel="Confirm 1-tap buy"
        pending={pending}
        onClose={() => setCheckout(null)}
        onConfirm={confirm}
      />
    </>
  );

  if (embedded) {
    return <div id="products">{body}</div>;
  }

  return (
    <section id="products" className="nx-container scroll-mt-20 py-12 md:py-16">
      {body}
    </section>
  );
}
