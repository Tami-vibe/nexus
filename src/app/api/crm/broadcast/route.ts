import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { getTenantByVat } from "@/lib/tenants";
import { resolveCapacity } from "@/lib/capacity/engine";
import { logCrmEvent } from "@/lib/crm/events";

export const dynamic = "force-dynamic";

const Body = z.object({
  vat: z.string().min(2),
  force: z.boolean().optional(),
});

/**
 * Open Slot Broadcast — ping hot CRM leads when same-day capacity < 3.
 * SMS/Email are queued as CRM events (provider seam).
 */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const tenant = await getTenantByVat(parsed.data.vat);
  if (!tenant) {
    return NextResponse.json({ ok: false, error: "merchant not found" }, { status: 404 });
  }

  let spotsOpen: number | null = null;
  if (tenant.walk_in_enabled) {
    const snap = await resolveCapacity(tenant);
    spotsOpen = snap.spots_open;
  } else {
    // Appointment-led merchants: treat open same-day service slots as capacity
    const { rows } = await query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM appointments
       WHERE tenant_id = $1
         AND starts_at >= date_trunc('day', NOW())
         AND starts_at < date_trunc('day', NOW()) + interval '1 day'`,
      [tenant.id],
    );
    const booked = Number(rows[0]?.c ?? 0);
    spotsOpen = Math.max(0, 6 - booked);
  }

  if (spotsOpen == null) {
    return NextResponse.json({ ok: false, error: "capacity unavailable" }, { status: 503 });
  }

  if (spotsOpen >= 3 && !parsed.data.force) {
    return NextResponse.json({
      ok: true,
      broadcast: false,
      reason: "capacity_above_threshold",
      spots_open: spotsOpen,
      threshold: 3,
    });
  }

  const { rows: hotLeads } = await query<{
    id: string;
    phone: string;
    intent_score: number;
  }>(
    `SELECT id, phone, intent_score FROM lead_profiles
     WHERE tenant_id = $1
       AND lifecycle_stage IN ('HOT_LEAD', 'PROSPECT')
       AND phone IS NOT NULL
       AND phone <> 'anonymous'
     ORDER BY intent_score DESC, last_engagement DESC
     LIMIT 25`,
    [tenant.id],
  );

  const message = `${tenant.business_name}: ${spotsOpen} same-day spot${spotsOpen === 1 ? "" : "s"} left. Book now → /${tenant.vat_number}#services`;

  const dispatches: Array<{ lead_id: string; phone: string; channels: string[] }> =
    [];

  for (const lead of hotLeads) {
    await logCrmEvent({
      tenantId: tenant.id,
      leadId: lead.id,
      eventType: "CHAT_MESSAGE",
      title: "Open slot broadcast",
      payload: {
        channel: ["sms", "email"],
        spots_open: spotsOpen,
        body: message,
        anti_ppc: true,
      },
    });
    dispatches.push({
      lead_id: lead.id,
      phone: lead.phone,
      channels: ["sms", "email"],
    });
  }

  return NextResponse.json({
    ok: true,
    broadcast: true,
    spots_open: spotsOpen,
    recipients: dispatches.length,
    dispatches,
    preview: message,
  });
}
