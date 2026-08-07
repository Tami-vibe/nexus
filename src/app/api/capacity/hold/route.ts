import { NextResponse } from "next/server";
import { z } from "zod";
import { acquireHold, syncCapacityCounter } from "@/lib/capacity/holds";
import { resolveCapacity } from "@/lib/capacity/engine";
import { capacityKey, redis } from "@/lib/redis";
import { getTenantByVat } from "@/lib/tenants";
import { upsertLead, recordLeadEvent } from "@/lib/leads/scoring";

const bodySchema = z.object({
  vat_number: z.string().min(1),
  phone: z.string().min(5).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const tenant = await getTenantByVat(parsed.data.vat_number);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  // Seed Redis counter only if absent — never reset under concurrency.
  const existing = await redis.get(capacityKey(tenant.id));
  if (existing === null) {
    const snapshot = await resolveCapacity(tenant);
    await syncCapacityCounter(tenant.id, snapshot.spots_open, "if_absent");
  }

  let leadId: string | null = null;
  if (parsed.data.phone) {
    const lead = await upsertLead(tenant.id, parsed.data.phone);
    leadId = lead.id;
  }

  const hold = await acquireHold(tenant.id, leadId);
  if (!hold.ok) {
    return NextResponse.json(
      { ok: false, reason: hold.reason },
      { status: 409 },
    );
  }

  if (leadId) {
    await recordLeadEvent({
      tenantId: tenant.id,
      leadId,
      eventType: "HOLD",
      payload: { hold_id: hold.hold_id, source: "api" },
    });
  }

  return NextResponse.json({
    ok: true,
    hold_id: hold.hold_id,
    expires_at: hold.expires_at,
  });
}
