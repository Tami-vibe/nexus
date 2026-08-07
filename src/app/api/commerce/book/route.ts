import { NextResponse } from "next/server";
import { z } from "zod";
import { bookAppointment } from "@/lib/commerce/catalog";
import { getTenantByVat } from "@/lib/tenants";

const bodySchema = z.object({
  vat: z.string().min(1),
  service_id: z.string().uuid(),
  phone: z.string().min(5),
  starts_at: z.string().datetime(),
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
    const result = await bookAppointment({
      tenantId: tenant.id,
      serviceId: parsed.data.service_id,
      phone: parsed.data.phone,
      startsAt: parsed.data.starts_at,
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Booking failed" },
      { status: 400 },
    );
  }
}
