import { NextResponse } from "next/server";
import { z } from "zod";
import {
  forceSyncCapacityFromTenant,
  resolveCapacity,
  upsertOccupancy,
} from "@/lib/capacity/engine";
import { anonymizeProbeId } from "@/lib/gdpr/privacy";
import { getTenantByVat } from "@/lib/tenants";
import type { SignalSource } from "@/types";

const bodySchema = z.object({
  vat_number: z.string().min(1),
  current_occupancy: z.number().int().min(0),
  signal_source: z
    .enum(["POS_WEBHOOK", "WIFI_PROBE", "ML_PREDICTIVE"])
    .default("POS_WEBHOOK"),
  probe_device_id: z.string().optional(),
});

export async function POST(req: Request) {
  const secret = req.headers.get("x-nexus-webhook-secret");
  if (secret !== process.env.WEBHOOK_SHARED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const tenant = await getTenantByVat(parsed.data.vat_number);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const occupancy = Math.min(
    tenant.max_capacity,
    parsed.data.current_occupancy,
  );

  await upsertOccupancy({
    tenantId: tenant.id,
    currentOccupancy: occupancy,
    signalSource: parsed.data.signal_source as SignalSource,
  });
  await forceSyncCapacityFromTenant(tenant);

  const snapshot = await resolveCapacity(tenant);
  const probeHash =
    parsed.data.signal_source === "WIFI_PROBE" && parsed.data.probe_device_id
      ? anonymizeProbeId(parsed.data.probe_device_id)
      : undefined;

  return NextResponse.json({
    ok: true,
    capacity: snapshot,
    gdpr: {
      probe_device_hash: probeHash ?? null,
      raw_probe_retained: false,
    },
  });
}
