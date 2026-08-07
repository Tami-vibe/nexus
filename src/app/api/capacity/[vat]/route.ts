import { NextResponse } from "next/server";
import { resolveCapacity } from "@/lib/capacity/engine";
import { getTenantByVat } from "@/lib/tenants";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ vat: string }> },
) {
  const { vat } = await ctx.params;
  const tenant = await getTenantByVat(decodeURIComponent(vat));
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }
  const capacity = await resolveCapacity(tenant);
  return NextResponse.json(capacity, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
