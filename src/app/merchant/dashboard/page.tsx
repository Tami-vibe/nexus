import { notFound } from "next/navigation";
import {
  MerchantDashboard,
  type DashboardPayload,
} from "@/components/crm/MerchantDashboard";
import { getMerchantDashboard } from "@/lib/crm/dashboard";

export const dynamic = "force-dynamic";

export default async function MerchantDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ vat?: string }>;
}) {
  const params = await searchParams;
  const vat = params.vat || "IL-ARTISAN-001";
  const data = await getMerchantDashboard(vat);
  if (!data) notFound();

  return <MerchantDashboard data={data as DashboardPayload} />;
}
