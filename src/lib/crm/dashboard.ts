import { query } from "@/lib/db";
import { getTenantByVat } from "@/lib/tenants";

export async function getMerchantDashboard(vat: string) {
  const tenant = await getTenantByVat(vat);
  if (!tenant) return null;

  const [leads, events, orders, appointments, chats] = await Promise.all([
    query(
      `SELECT id, phone, intent_score, lifecycle_stage, last_engagement
       FROM lead_profiles WHERE tenant_id = $1 AND phone <> 'anonymous'
       ORDER BY intent_score DESC, last_engagement DESC LIMIT 40`,
      [tenant.id],
    ),
    query(
      `SELECT id, lead_id, event_type, title, payload, created_at
       FROM crm_events WHERE tenant_id = $1
       ORDER BY created_at DESC LIMIT 50`,
      [tenant.id],
    ),
    query(
      `SELECT o.id, o.amount_cents, o.currency, o.status, o.created_at,
              p.name AS product_name, l.phone
       FROM orders o
       LEFT JOIN products p ON p.id = o.product_id
       LEFT JOIN lead_profiles l ON l.id = o.lead_id
       WHERE o.tenant_id = $1
       ORDER BY o.created_at DESC LIMIT 20`,
      [tenant.id],
    ),
    query(
      `SELECT a.id, a.starts_at, a.status, s.name AS service_name, l.phone
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       LEFT JOIN lead_profiles l ON l.id = a.lead_id
       WHERE a.tenant_id = $1 AND a.status = 'BOOKED' AND a.starts_at >= NOW()
       ORDER BY a.starts_at ASC LIMIT 20`,
      [tenant.id],
    ),
    query(
      `SELECT c.id, c.lead_id, c.role, c.content, c.created_at, l.phone
       FROM chat_messages c
       LEFT JOIN lead_profiles l ON l.id = c.lead_id
       WHERE c.tenant_id = $1
       ORDER BY c.created_at DESC LIMIT 40`,
      [tenant.id],
    ),
  ]);

  return {
    tenant: {
      vat_number: tenant.vat_number,
      business_name: tenant.business_name,
      sector: tenant.sector,
    },
    leads: leads.rows,
    events: events.rows,
    orders: orders.rows,
    appointments: appointments.rows,
    chats: chats.rows,
  };
}
