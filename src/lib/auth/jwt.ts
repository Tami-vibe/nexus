import { createHmac, timingSafeEqual } from "node:crypto";
import { query } from "@/lib/db";

export interface MerchantClaims {
  sub: string;
  vat_number: string;
  email?: string;
  role: "merchant" | "service";
}

function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromB64url(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

/** Minimal HS256 JWT for local/dev and Supabase-compatible claim shape. */
export function signMerchantToken(
  claims: Omit<MerchantClaims, "role"> & { role?: MerchantClaims["role"] },
  ttlSeconds = 60 * 60 * 12,
): string {
  const secret = process.env.SUPABASE_JWT_SECRET || process.env.WEBHOOK_SHARED_SECRET;
  if (!secret) throw new Error("JWT secret missing");

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    ...claims,
    role: claims.role ?? "merchant",
    iat: now,
    exp: now + ttlSeconds,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = createHmac("sha256", secret).update(unsigned).digest();
  return `${unsigned}.${b64url(sig)}`;
}

export function verifyMerchantToken(token: string): MerchantClaims | null {
  try {
    const secret =
      process.env.SUPABASE_JWT_SECRET || process.env.WEBHOOK_SHARED_SECRET;
    if (!secret) return null;
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return null;
    const unsigned = `${h}.${p}`;
    const expected = createHmac("sha256", secret).update(unsigned).digest();
    const actual = fromB64url(s);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return null;
    }
    const payload = JSON.parse(fromB64url(p).toString("utf8")) as MerchantClaims & {
      exp?: number;
    };
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.vat_number || !payload.sub) return null;
    return {
      sub: payload.sub,
      vat_number: payload.vat_number,
      email: payload.email,
      role: payload.role ?? "merchant",
    };
  } catch {
    return null;
  }
}

export function extractBearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7);
}

/** Set Postgres session GUC used by RLS requesting_vat(). */
export async function setVatContext(vatNumber: string | null) {
  // is_local=false → session-scoped (survives across pooled statements in this connection)
  await query(`SELECT set_config('app.vat_number', $1, false)`, [
    vatNumber ?? "",
  ]);
  await query(`SELECT set_config('request.jwt.claims', $1, false)`, [
    JSON.stringify(vatNumber ? { vat_number: vatNumber } : {}),
  ]);
}

export async function loginMerchant(input: {
  vat_number: string;
  email: string;
}): Promise<{ token: string; vat_number: string } | null> {
  const { rows } = await query<{ vat_number: string; id: string }>(
    `SELECT vat_number, id FROM tenants WHERE vat_number = $1`,
    [input.vat_number],
  );
  if (!rows[0]) return null;

  await query(
    `INSERT INTO merchant_users (vat_number, email)
     SELECT $1::varchar, $2::text
     WHERE NOT EXISTS (
       SELECT 1 FROM merchant_users WHERE vat_number = $1::varchar AND email = $2::text
     )`,
    [input.vat_number, input.email],
  );

  const token = signMerchantToken({
    sub: rows[0].id,
    vat_number: rows[0].vat_number,
    email: input.email,
  });
  return { token, vat_number: rows[0].vat_number };
}
