import { query } from "@/lib/db";
import { logCrmEvent, upsertLead } from "@/lib/crm/events";
import { getPaymentProvider } from "@/lib/payments/provider";

export { formatMoney } from "@/lib/commerce/money";

export async function purchaseProduct(input: {
  tenantId: string;
  productId: string;
  phone: string;
}) {
  const { rows } = await query<{
    id: string;
    name: string;
    price_cents: number;
    currency: string;
  }>(`SELECT id, name, price_cents, currency FROM products WHERE id = $1 AND tenant_id = $2`, [
    input.productId,
    input.tenantId,
  ]);
  const product = rows[0];
  if (!product) throw new Error("Product not found");

  const lead = await upsertLead(input.tenantId, input.phone);
  await logCrmEvent({
    tenantId: input.tenantId,
    leadId: lead.id,
    eventType: "CART_ADD",
    title: `Added ${product.name} to cart`,
    payload: { product_id: product.id },
  });

  const payment = await getPaymentProvider().createCheckout({
    holdId: product.id,
    tenantId: input.tenantId,
    amountCents: product.price_cents,
    currency: product.currency,
    customerPhone: input.phone,
  });

  if (payment.status === "FAILED") {
    await logCrmEvent({
      tenantId: input.tenantId,
      leadId: lead.id,
      eventType: "CART_DROP",
      title: `Checkout failed for ${product.name}`,
      payload: { product_id: product.id },
    });
    return { ok: false as const, reason: "Payment failed" };
  }

  const { rows: orderRows } = await query<{ id: string }>(
    `INSERT INTO orders (tenant_id, lead_id, product_id, amount_cents, currency, status)
     VALUES ($1, $2, $3, $4, $5, 'PAID')
     RETURNING id`,
    [
      input.tenantId,
      lead.id,
      product.id,
      product.price_cents,
      product.currency,
    ],
  );

  await logCrmEvent({
    tenantId: input.tenantId,
    leadId: lead.id,
    eventType: "ORDER_PLACED",
    title: `Purchased ${product.name}`,
    payload: {
      order_id: orderRows[0].id,
      product_id: product.id,
      provider: payment.provider,
    },
  });

  return {
    ok: true as const,
    order_id: orderRows[0].id,
    payment,
    product_name: product.name,
  };
}

export async function bookAppointment(input: {
  tenantId: string;
  serviceId: string;
  phone: string;
  startsAt: string;
}) {
  const { rows } = await query<{
    id: string;
    name: string;
    price_cents: number;
  }>(
    `SELECT id, name, price_cents FROM services WHERE id = $1 AND tenant_id = $2`,
    [input.serviceId, input.tenantId],
  );
  const service = rows[0];
  if (!service) throw new Error("Service not found");

  const lead = await upsertLead(input.tenantId, input.phone);
  const { rows: apptRows } = await query<{ id: string; starts_at: Date }>(
    `INSERT INTO appointments (tenant_id, service_id, lead_id, starts_at, status)
     VALUES ($1, $2, $3, $4, 'BOOKED')
     RETURNING id, starts_at`,
    [input.tenantId, service.id, lead.id, input.startsAt],
  );

  await logCrmEvent({
    tenantId: input.tenantId,
    leadId: lead.id,
    eventType: "APPOINTMENT_BOOKED",
    title: `Booked ${service.name}`,
    payload: {
      appointment_id: apptRows[0].id,
      service_id: service.id,
      starts_at: apptRows[0].starts_at,
    },
  });

  return {
    ok: true as const,
    appointment_id: apptRows[0].id,
    service_name: service.name,
    starts_at: apptRows[0].starts_at,
  };
}

export { nextAppointmentSlots } from "@/lib/commerce/slots";
