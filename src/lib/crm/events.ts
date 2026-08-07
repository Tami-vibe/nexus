import { query } from "@/lib/db";
import type { CrmEventType, LeadProfile, LifecycleStage } from "@/types";

const SCORE_DELTAS: Partial<Record<CrmEventType, number>> = {
  PAGE_VIEW: 5,
  LEAD_CAPTURE: 20,
  CHAT_OPEN: 15,
  CHAT_MESSAGE: 8,
  CART_ADD: 18,
  CART_DROP: -5,
  ORDER_PLACED: 40,
  APPOINTMENT_BOOKED: 35,
  HOLD: 35,
  CHECKOUT_MOCK: 20,
  CHECKOUT_PAID: 45,
  SLOT_ASK: 25,
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function stageForScore(score: number): LifecycleStage {
  if (score >= 80) return "ACTIVE_MEMBER";
  if (score >= 40) return "HOT_LEAD";
  return "PROSPECT";
}

export async function upsertLead(
  tenantId: string,
  phone: string,
): Promise<LeadProfile> {
  const { rows } = await query<LeadProfile>(
    `INSERT INTO lead_profiles (tenant_id, phone)
     VALUES ($1, $2)
     ON CONFLICT (tenant_id, phone) DO UPDATE SET
       last_engagement = NOW()
     RETURNING *`,
    [tenantId, phone],
  );
  return rows[0];
}

export async function logCrmEvent(input: {
  tenantId: string;
  leadId?: string | null;
  eventType: CrmEventType;
  title?: string;
  payload?: Record<string, unknown>;
  score?: boolean;
}): Promise<LeadProfile | null> {
  await query(
    `INSERT INTO crm_events (tenant_id, lead_id, event_type, title, payload)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [
      input.tenantId,
      input.leadId ?? null,
      input.eventType,
      input.title ?? null,
      JSON.stringify(input.payload ?? {}),
    ],
  );

  // Keep legacy agent_events in sync for older paths
  if (input.leadId) {
    await query(
      `INSERT INTO agent_events (tenant_id, lead_id, event_type, payload)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [
        input.tenantId,
        input.leadId,
        input.eventType,
        JSON.stringify(input.payload ?? {}),
      ],
    );
  }

  if (!input.leadId || input.score === false) return null;

  const delta = SCORE_DELTAS[input.eventType] ?? 0;
  const { rows } = await query<LeadProfile>(
    `UPDATE lead_profiles
     SET intent_score = LEAST(100, GREATEST(0, intent_score + $1)),
         last_engagement = NOW()
     WHERE id = $2
     RETURNING *`,
    [delta, input.leadId],
  );
  const lead = rows[0];
  if (!lead) return null;

  const nextStage = stageForScore(clamp(lead.intent_score));
  if (lead.lifecycle_stage !== nextStage) {
    const { rows: updated } = await query<LeadProfile>(
      `UPDATE lead_profiles SET lifecycle_stage = $1 WHERE id = $2 RETURNING *`,
      [nextStage, lead.id],
    );
    return updated[0];
  }
  return lead;
}

/** @deprecated use logCrmEvent — kept for agent compatibility */
export async function recordLeadEvent(input: {
  tenantId: string;
  leadId: string;
  eventType: CrmEventType;
  payload?: Record<string, unknown>;
}): Promise<LeadProfile> {
  const lead = await logCrmEvent({
    tenantId: input.tenantId,
    leadId: input.leadId,
    eventType: input.eventType,
    payload: input.payload,
    score: true,
  });
  return lead!;
}
