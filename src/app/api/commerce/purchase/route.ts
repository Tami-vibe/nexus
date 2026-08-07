import { NextResponse } from "next/server";
import { z } from "zod";
import { purchaseProduct } from "@/lib/commerce/catalog";
import { getTenantByVat } from "@/lib/tenants";

const bodySchema = z.object({
  vat: z.string().min(1),
  product_id: z.string().uuid(),
  phone: z.string().min(5),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const tenant = await getTenantByVat(parsed.data.vat);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }
  try {
    const result = await purchaseProduct({
      tenantId: tenant.id,
      productId: parsed.data.product_id,
      phone: parsed.data.phone,
    });
    return NextResponse.json(result, { status: result.ok ? 200 : 402 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Purchase failed" },
      { status: 400 },
    );
  }
}
