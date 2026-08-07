import { NextResponse } from "next/server";
import {
  extractBearer,
  setVatContext,
  verifyMerchantToken,
} from "@/lib/auth/jwt";
import { getMerchantDashboard } from "@/lib/crm/dashboard";

export async function GET(req: Request) {
  const token = extractBearer(req);
  const url = new URL(req.url);
  let vat = url.searchParams.get("vat");

  if (token) {
    const claims = verifyMerchantToken(token);
    if (!claims) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    vat = claims.vat_number;
    await setVatContext(claims.vat_number);
  }

  if (!vat) {
    return NextResponse.json({ error: "vat required" }, { status: 400 });
  }

  const data = await getMerchantDashboard(vat);
  if (!data) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
