import { NextResponse } from "next/server";
import {
  extractBearer,
  setVatContext,
  verifyMerchantToken,
} from "@/lib/auth/jwt";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const token = extractBearer(req);
  if (!token) {
    return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
  }
  const claims = verifyMerchantToken(token);
  if (!claims) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await setVatContext(claims.vat_number);

  const { rows } = await query(
    `SELECT t.vat_number, t.business_name, t.sector, t.max_capacity,
            lo.current_occupancy, lo.signal_source, lo.last_signal_timestamp
     FROM tenants t
     LEFT JOIN live_occupancy lo ON lo.tenant_id = t.id
     WHERE t.vat_number = public.requesting_vat()`,
  );

  return NextResponse.json({
    claims,
    tenant: rows[0] ?? null,
    rls: "tenant_id / vat_number isolation active via requesting_vat()",
  });
}
