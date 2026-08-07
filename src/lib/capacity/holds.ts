import { randomUUID } from "node:crypto";
import { query } from "@/lib/db";
import { capacityKey, holdKey, redis } from "@/lib/redis";

const HOLD_LUA = `
local available = tonumber(redis.call('GET', KEYS[1]) or '0')
if available <= 0 then
  return 0
end
redis.call('DECRBY', KEYS[1], 1)
redis.call('SET', KEYS[2], ARGV[2], 'EX', tonumber(ARGV[3]))
return 1
`;

const HOLD_TTL = Number(process.env.HOLD_TTL_SECONDS ?? 180);

export async function syncCapacityCounter(
  tenantId: string,
  spotsOpen: number,
  mode: "force" | "if_absent" = "force",
): Promise<void> {
  const key = capacityKey(tenantId);
  const value = String(Math.max(0, spotsOpen));
  if (mode === "if_absent") {
    await redis.set(key, value, "NX");
    return;
  }
  await redis.set(key, value);
}

export interface HoldResult {
  ok: boolean;
  hold_id?: string;
  expires_at?: string;
  reason?: string;
}

export async function acquireHold(
  tenantId: string,
  leadId?: string | null,
): Promise<HoldResult> {
  const holdId = randomUUID();
  const result = await redis.eval(
    HOLD_LUA,
    2,
    capacityKey(tenantId),
    holdKey(holdId),
    holdId,
    tenantId,
    String(HOLD_TTL),
  );

  if (Number(result) !== 1) {
    return { ok: false, reason: "Slot just claimed — try the next window." };
  }

  const expiresAt = new Date(Date.now() + HOLD_TTL * 1000);
  await query(
    `INSERT INTO capacity_holds (id, tenant_id, lead_id, status, expires_at)
     VALUES ($1, $2, $3, 'HELD', $4)`,
    [holdId, tenantId, leadId ?? null, expiresAt.toISOString()],
  );

  return {
    ok: true,
    hold_id: holdId,
    expires_at: expiresAt.toISOString(),
  };
}

export async function releaseHold(holdId: string): Promise<boolean> {
  const tenantId = await redis.get(holdKey(holdId));
  if (!tenantId) {
    await query(
      `UPDATE capacity_holds SET status = 'EXPIRED'
       WHERE id = $1 AND status = 'HELD'`,
      [holdId],
    );
    return false;
  }

  const pipeline = redis.pipeline();
  pipeline.del(holdKey(holdId));
  pipeline.incr(capacityKey(tenantId));
  await pipeline.exec();

  await query(
    `UPDATE capacity_holds SET status = 'RELEASED'
     WHERE id = $1 AND status = 'HELD'`,
    [holdId],
  );
  return true;
}

export async function confirmHold(holdId: string): Promise<boolean> {
  const exists = await redis.exists(holdKey(holdId));
  if (!exists) {
    await query(
      `UPDATE capacity_holds SET status = 'EXPIRED'
       WHERE id = $1 AND status = 'HELD'`,
      [holdId],
    );
    return false;
  }

  await redis.del(holdKey(holdId));
  await query(
    `UPDATE capacity_holds SET status = 'CONFIRMED'
     WHERE id = $1 AND status = 'HELD'`,
    [holdId],
  );
  return true;
}
