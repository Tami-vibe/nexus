import type { TenantBundle } from "@/types";

const SECTOR_SCHEMA: Record<string, string> = {
  GYM: "ExerciseGym",
  SALON: "HairSalon",
  CLINIC: "MedicalClinic",
  POOL: "HealthClub",
  RETAIL: "Store",
  ARTISAN: "HomeGoodsStore",
  DIGITAL: "ProfessionalService",
  CONSULTING: "ProfessionalService",
};

function absoluteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://nexus.local";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Rich Schema.org @graph for GEO / AI search engines. */
export function buildLocalBusinessJsonLd(tenant: TenantBundle) {
  const profile = tenant.profile;
  const type = SECTOR_SCHEMA[tenant.sector] ?? "LocalBusiness";
  const pageUrl = absoluteUrl(`/${tenant.vat_number}`);
  const businessId = `${pageUrl}#business`;

  const business: Record<string, unknown> = {
    "@type": [type, "LocalBusiness"],
    "@id": businessId,
    name: tenant.business_name,
    description: profile?.description ?? tenant.tagline ?? undefined,
    telephone: profile?.phone ?? undefined,
    url: profile?.website ?? pageUrl,
    image: tenant.hero_image_url ?? profile?.image_url ?? undefined,
    taxID: tenant.vat_number,
    address: profile
      ? {
          "@type": "PostalAddress",
          streetAddress: profile.address ?? undefined,
          addressLocality: profile.city ?? undefined,
          addressCountry: "IL",
        }
      : undefined,
    geo:
      profile?.latitude != null && profile?.longitude != null
        ? {
            "@type": "GeoCoordinates",
            latitude: profile.latitude,
            longitude: profile.longitude,
          }
        : undefined,
    aggregateRating:
      profile?.rating != null
        ? {
            "@type": "AggregateRating",
            ratingValue: profile.rating,
            reviewCount: profile.review_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    openingHoursSpecification: profile?.hours_json
      ? Object.entries(profile.hours_json).map(([day, hours]) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: day,
          description: hours,
        }))
      : undefined,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${tenant.business_name} offers`,
      itemListElement: [
        ...tenant.products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@id": `${pageUrl}#product-${p.id}` },
        })),
        ...tenant.services.map((s, i) => ({
          "@type": "ListItem",
          position: tenant.products.length + i + 1,
          item: { "@id": `${pageUrl}#service-${s.id}` },
        })),
      ],
    },
  };

  const products = tenant.products.map((p) => ({
    "@type": "Product",
    "@id": `${pageUrl}#product-${p.id}`,
    name: p.name,
    description: p.description ?? undefined,
    image: p.image_url ?? undefined,
    sku: p.id,
    brand: {
      "@type": "Brand",
      name: tenant.business_name,
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: p.currency,
      price: (p.price_cents / 100).toFixed(2),
      availability: p.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": businessId },
    },
    aggregateRating:
      profile?.rating != null
        ? {
            "@type": "AggregateRating",
            ratingValue: profile.rating,
            reviewCount: Math.max(1, Math.round(profile.review_count / 4)),
          }
        : undefined,
  }));

  const services = tenant.services.map((s) => ({
    "@type": ["Service", "Product"],
    "@id": `${pageUrl}#service-${s.id}`,
    name: s.name,
    description: s.description ?? undefined,
    image: s.image_url ?? undefined,
    provider: { "@id": businessId },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: s.currency,
      price: (s.price_cents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@id": businessId },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [business, ...products, ...services],
  };
}
