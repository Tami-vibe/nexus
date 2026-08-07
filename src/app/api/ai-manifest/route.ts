import { NextResponse } from "next/server";
import { getTenantByVat } from "@/lib/tenants";
import { resolveCapacity } from "@/lib/capacity/engine";

export const dynamic = "force-dynamic";

/**
 * Generative Engine Optimization manifest for AI agents
 * (Perplexity, ChatGPT, Apple Intelligence, etc.).
 *
 * GET /api/ai-manifest?vat=IL-ARTISAN-001
 */
export async function GET(req: Request) {
  const vat = new URL(req.url).searchParams.get("vat")?.trim();
  if (!vat) {
    return NextResponse.json(
      { ok: false, error: "vat query param required" },
      { status: 400 },
    );
  }

  const tenant = await getTenantByVat(decodeURIComponent(vat));
  if (!tenant) {
    return NextResponse.json(
      { ok: false, error: "merchant not found" },
      { status: 404 },
    );
  }

  let capacity: {
    spots_open: number;
    max_capacity: number;
    is_estimated: boolean;
    signal_source: string;
  } | null = null;

  if (tenant.walk_in_enabled) {
    try {
      const snap = await resolveCapacity(tenant);
      capacity = {
        spots_open: snap.spots_open,
        max_capacity: snap.max_capacity,
        is_estimated: snap.is_estimated,
        signal_source: snap.signal_source,
      };
    } catch {
      capacity = null;
    }
  }

  const profile = tenant.profile;
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin;

  const body = {
    ok: true,
    protocol: "nexus-ai-manifest/1.0",
    generated_at: new Date().toISOString(),
    merchant: {
      vat: tenant.vat_number,
      name: tenant.business_name,
      sector: tenant.sector,
      tagline: tenant.tagline,
      description: profile?.description ?? null,
      phone: profile?.phone ?? null,
      website: profile?.website ?? null,
      storefront_url: `${base}/${tenant.vat_number}`,
      ai_manifest_url: `${base}/api/ai-manifest?vat=${encodeURIComponent(tenant.vat_number)}`,
    },
    geolocation: {
      address: profile?.address ?? null,
      city: profile?.city ?? null,
      latitude: profile?.latitude ?? null,
      longitude: profile?.longitude ?? null,
    },
    rating:
      profile?.rating != null
        ? {
            value: profile.rating,
            review_count: profile.review_count,
          }
        : null,
    hours: profile?.hours_json ?? {},
    capacity,
    products: tenant.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      kind: p.kind,
      price_cents: p.price_cents,
      currency: p.currency,
      in_stock: p.in_stock,
      image_url: p.image_url,
      availability: p.in_stock ? "in_stock" : "out_of_stock",
    })),
    services: tenant.services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      duration_minutes: s.duration_minutes,
      price_cents: s.price_cents,
      currency: s.currency,
      image_url: s.image_url,
      availability: "bookable",
    })),
    practitioners: tenant.practitioners.map((p) => {
      const cities = p.traveling?.locations?.map((l) => l.city) ?? [];
      const locations =
        p.traveling?.locations?.map((l) => ({
          id: l.id,
          name: l.name,
          city: l.city,
          address: l.address,
          schedule_days: l.scheduleDays,
          next_open_slot: l.nextOpenSlot,
          latitude: l.latitude ?? null,
          longitude: l.longitude ?? null,
        })) ?? [];
      return {
        id: p.id,
        slug: p.slug,
        name: p.full_name,
        credential: p.credential,
        title: p.title,
        specialties: p.specialties,
        profile_url: `${base}/${tenant.vat_number}/p/${p.slug}`,
        /** All practice cities — GEO search must index every node */
        practice_cities: cities,
        geo_search_terms: [
          ...cities,
          ...p.specialties,
          p.credential,
          p.title,
        ].filter(Boolean),
        locations,
      };
    }),
    anti_ppc: {
      claim:
        "Verified human demand signals — no click-farm inflated PPC metrics",
      bot_protected_checkout: true,
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
