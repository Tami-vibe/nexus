import { query } from "@/lib/db";
import { predictOccupancy } from "@/lib/capacity/predictive";
import { syncCapacityCounter } from "@/lib/capacity/holds";
import type {
  CapacitySnapshot,
  LiveOccupancy,
  SignalSource,
  TenantBundle,
} from "@/types";

const STALE_MS = Number(process.env.CAPACITY_STALE_MS ?? 300_000);

interface OccupancyRow {
  tenant_id: string;
  current_occupancy: number;
  last_signal_timestamp: Date;
  signal_source: SignalSource;
}

export async function getLiveOccupancy(
  tenantId: string,
): Promise<LiveOccupancy | null> {
  const { rows } = await query<OccupancyRow>(
    `SELECT tenant_id, current_occupancy, last_signal_timestamp, signal_source
     FROM live_occupancy WHERE tenant_id = $1`,
    [tenantId],
  );
  return rows[0] ?? null;
}

export async function upsertOccupancy(input: {
  tenantId: string;
  currentOccupancy: number;
  signalSource: SignalSource;
}): Promise<void> {
  await query(
    `INSERT INTO live_occupancy (tenant_id, current_occupancy, last_signal_timestamp, signal_source)
     VALUES ($1, $2, NOW(), $3)
     ON CONFLICT (tenant_id) DO UPDATE SET
       current_occupancy = EXCLUDED.current_occupancy,
       last_signal_timestamp = NOW(),
       signal_source = EXCLUDED.signal_source`,
    [input.tenantId, input.currentOccupancy, input.signalSource],
  );
}

export async function forceSyncCapacityFromTenant(
  tenant: TenantBundle,
): Promise<number> {
  const live = await getLiveOccupancy(tenant.id);
  const fresh = live
    ? Date.now() - new Date(live.last_signal_timestamp).getTime() < STALE_MS
    : false;
  const current =
    live && fresh
      ? live.current_occupancy
      : predictOccupancy(tenant.sector, tenant.max_capacity);
  const spots = Math.max(0, tenant.max_capacity - current);
  await syncCapacityCounter(tenant.id, spots, "force");
  return spots;
}

function isFresh(ts: Date): boolean {
  return Date.now() - new Date(ts).getTime() < STALE_MS;
}

export async function resolveCapacity(
  tenant: TenantBundle,
): Promise<CapacitySnapshot> {
  const live = await getLiveOccupancy(tenant.id);
  const fresh = live ? isFresh(live.last_signal_timestamp) : false;

  let current: number;
  let source: SignalSource;
  let estimated: boolean;

  if (live && fresh) {
    current = live.current_occupancy;
    source = live.signal_source;
    estimated = false;
  } else {
    current = predictOccupancy(tenant.sector, tenant.max_capacity);
    source = "ML_PREDICTIVE";
    estimated = true;
  }

  const spots = Math.max(0, tenant.max_capacity - current);
  // Never clobber live Redis counters on read — only seed if missing.
  await syncCapacityCounter(tenant.id, spots, "if_absent");

  return {
    tenant_id: tenant.id,
    vat_number: tenant.vat_number,
    max_capacity: tenant.max_capacity,
    current_occupancy: current,
    spots_open: spots,
    signal_source: source,
    is_estimated: estimated,
    badge_label: estimated
      ? `Estimated ${spots} spots open (based on usual traffic)`
      : `${spots} spots open right now`,
    last_signal_timestamp: live
      ? new Date(live.last_signal_timestamp).toISOString()
      : null,
  };
}
