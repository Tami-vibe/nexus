import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorefrontHero } from "@/components/storefront/StorefrontHero";
import { TrustRibbon } from "@/components/storefront/TrustRibbon";
import { DiscoveryHub } from "@/components/DiscoveryHub";
import { WalkInSection } from "@/components/storefront/WalkInSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { FloatingAgent } from "@/components/storefront/FloatingAgent";
import { LocationHub } from "@/components/LocationHub";
import { Footer } from "@/components/Footer";
import { resolveCapacity } from "@/lib/capacity/engine";
import { logCrmEvent, upsertLead } from "@/lib/crm/events";
import { buildLocalBusinessJsonLd } from "@/lib/seo/jsonld";
import { getTenantByVat } from "@/lib/tenants";
import { merchantHeroImage } from "@/lib/commerce/media";
import { orderPractitionersByTeam } from "@/data/merchants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vat: string }>;
}): Promise<Metadata> {
  const { vat } = await params;
  const tenant = await getTenantByVat(decodeURIComponent(vat));
  if (!tenant) return { title: "Not found" };
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  return {
    title: `${tenant.business_name} | Nexus OS`,
    description: tenant.profile?.description ?? tenant.tagline ?? undefined,
    alternates: {
      canonical: `${base}/${tenant.vat_number}`,
    },
    other: {
      "ai-manifest": `${base}/api/ai-manifest?vat=${encodeURIComponent(tenant.vat_number)}`,
    },
  };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ vat: string }>;
}) {
  const { vat } = await params;
  const tenant = await getTenantByVat(decodeURIComponent(vat));
  if (!tenant) notFound();

  if (tenant.walk_in_enabled) {
    await resolveCapacity(tenant);
  }

  try {
    const lead = await upsertLead(tenant.id, "anonymous");
    await logCrmEvent({
      tenantId: tenant.id,
      leadId: lead.id,
      eventType: "PAGE_VIEW",
      title: "Viewed storefront",
    });
  } catch {
    // non-blocking
  }

  const jsonLd = buildLocalBusinessJsonLd(tenant);
  const profile = tenant.profile;
  const photo = merchantHeroImage({
    sector: tenant.sector,
    hero_image_url: tenant.hero_image_url,
    profile_image_url: profile?.image_url,
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StorefrontHero tenant={tenant} />
      <TrustRibbon
        vat={tenant.vat_number}
        rating={profile?.rating ?? null}
        reviewCount={profile?.review_count ?? 0}
        latitude={profile?.latitude ?? null}
        longitude={profile?.longitude ?? null}
        city={profile?.city ?? null}
        walkInEnabled={tenant.walk_in_enabled}
      />
      <DiscoveryHub
        vat={tenant.vat_number}
        sector={tenant.sector}
        services={tenant.services}
        products={tenant.products}
        practitioners={orderPractitionersByTeam(
          tenant.vat_number,
          tenant.practitioners,
        )}
      />
      <LocationHub
        businessName={tenant.business_name}
        address={profile?.address ?? null}
        city={profile?.city ?? null}
        latitude={profile?.latitude ?? null}
        longitude={profile?.longitude ?? null}
        photoUrl={photo}
      />
      <WalkInSection
        vat={tenant.vat_number}
        enabled={tenant.walk_in_enabled}
      />
      <TestimonialSection tenant={tenant} />
      <Footer tenant={tenant} />
      <FloatingAgent
        vat={tenant.vat_number}
        businessName={tenant.business_name}
        sector={tenant.sector}
      />
    </main>
  );
}
