import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { z } from "zod";

const bodySchema = z.object({
  hold_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  amount_cents: z.number().int().positive().default(4900),
  currency: z.string().default("ils"),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await getPaymentProvider().createCheckout({
    holdId: parsed.data.hold_id,
    tenantId: parsed.data.tenant_id,
    amountCents: parsed.data.amount_cents,
    currency: parsed.data.currency,
    customerPhone: "n/a",
  });

  return NextResponse.json(result);
}
