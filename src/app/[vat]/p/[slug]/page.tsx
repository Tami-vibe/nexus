import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PractitionerProfile } from "@/components/storefront/PractitionerProfile";
import { Footer } from "@/components/Footer";
import { getPractitionerBySlug } from "@/lib/tenants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vat: string; slug: string }>;
}): Promise<Metadata> {
  const { vat, slug } = await params;
  const data = await getPractitionerBySlug(
    decodeURIComponent(vat),
    decodeURIComponent(slug),
  );
  if (!data) return { title: "Not found" };
  return {
    title: `${data.practitioner.full_name} · ${data.tenant.business_name}`,
    description:
      data.practitioner.bio ??
      `${data.practitioner.credential} at ${data.tenant.business_name}`,
  };
}

export default async function PractitionerPage({
  params,
}: {
  params: Promise<{ vat: string; slug: string }>;
}) {
  const { vat, slug } = await params;
  const data = await getPractitionerBySlug(
    decodeURIComponent(vat),
    decodeURIComponent(slug),
  );
  if (!data) notFound();

  return (
    <>
      <PractitionerProfile
        vat={data.tenant.vat_number}
        businessName={data.tenant.business_name}
        sector={data.tenant.sector}
        practitioner={data.practitioner}
        services={data.tenant.services}
      />
      <Footer tenant={data.tenant} />
    </>
  );
}
