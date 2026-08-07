import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import Redis from "ioredis";
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://nexus:nexus@localhost:5432/nexus";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

test("probe anonymization is deterministic and non-reversible plaintext", () => {
  const salt = process.env.GDPR_PROBE_SALT || "nexus-gdpr-salt";
  const raw = "aa:bb:cc:dd:ee:ff";
  const hash = createHash("sha256")
    .update(`${salt}:${raw}`)
    .digest("hex")
    .slice(0, 32);
  assert.equal(hash.length, 32);
  assert.notEqual(hash, raw);
  assert.equal(
    createHash("sha256").update(`${salt}:${raw}`).digest("hex").slice(0, 32),
    hash,
  );
});

test("redis lua hold respects capacity", async () => {
  const redis = new Redis(REDIS_URL);
  const key = `capacity:qa-${Date.now()}`;
  await redis.set(key, "2");
  const lua = `
local available = tonumber(redis.call('GET', KEYS[1]) or '0')
if available <= 0 then return 0 end
redis.call('DECRBY', KEYS[1], 1)
return 1`;
  const a = await redis.eval(lua, 1, key);
  const b = await redis.eval(lua, 1, key);
  const c = await redis.eval(lua, 1, key);
  assert.equal(Number(a), 1);
  assert.equal(Number(b), 1);
  assert.equal(Number(c), 0);
  await redis.del(key);
  redis.disconnect();
});

test("seeded tenants exist", async () => {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  const { rows } = await client.query(
    `SELECT vat_number FROM tenants ORDER BY vat_number`,
  );
  const vats = rows.map((r) => r.vat_number);
  assert.ok(vats.includes("IL-GYM-001"));
  assert.ok(vats.includes("IL-ARTISAN-001"));
  assert.ok(vats.includes("IL-DIGITAL-001"));
  await client.end();
});

test("requesting_vat RLS helper exists after phase2 migration", async () => {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  const { rows } = await client.query(
    `SELECT proname FROM pg_proc WHERE proname = 'requesting_vat'`,
  );
  assert.ok(rows.length >= 1);
  await client.query(`SELECT set_config('app.vat_number', 'IL-GYM-001', false)`);
  await client.query(
    `SELECT set_config('request.jwt.claims', '{"vat_number":"IL-GYM-001"}', false)`,
  );
  const vat = await client.query(`SELECT public.requesting_vat() AS vat`);
  assert.equal(vat.rows[0].vat, "IL-GYM-001");
  await client.end();
});

test("phase4 payment_intents table exists", async () => {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  const { rows } = await client.query(
    `SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_intents'`,
  );
  assert.equal(rows.length, 1);
  await client.end();
});
