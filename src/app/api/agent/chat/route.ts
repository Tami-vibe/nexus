import { NextResponse } from "next/server";
import { z } from "zod";
import { runAgentTurn } from "@/lib/agent/provider";
import { query } from "@/lib/db";
import { logCrmEvent, upsertLead } from "@/lib/crm/events";
import { getTenantByVat } from "@/lib/tenants";
import type { AgentState } from "@/types";

const bodySchema = z.object({
  vat: z.string().min(1),
  phone: z.string().min(5),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
  state: z
    .enum([
      "IDLE",
      "QUALIFYING",
      "SLOT_SEARCH",
      "HOLDING",
      "CHECKOUT_MOCK",
      "DONE",
      "FAILED",
    ])
    .optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const tenant = await getTenantByVat(parsed.data.vat);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const lead = await upsertLead(tenant.id, parsed.data.phone);
  const lastUser = [...parsed.data.messages].reverse().find((m) => m.role === "user");
  const isFirst =
    parsed.data.messages.filter((m) => m.role === "user").length === 1;

  if (isFirst) {
    await logCrmEvent({
      tenantId: tenant.id,
      leadId: lead.id,
      eventType: "CHAT_OPEN",
      title: "Opened AI sales chat",
    });
  }

  if (lastUser) {
    await query(
      `INSERT INTO chat_messages (tenant_id, lead_id, role, content)
       VALUES ($1, $2, 'user', $3)`,
      [tenant.id, lead.id, lastUser.content],
    );
    await logCrmEvent({
      tenantId: tenant.id,
      leadId: lead.id,
      eventType: "CHAT_MESSAGE",
      title: "Customer message",
      payload: { preview: lastUser.content.slice(0, 120) },
    });
  }

  const result = await runAgentTurn({
    messages: parsed.data.messages,
    ctx: { tenant, leadId: lead.id },
    state: (parsed.data.state as AgentState | undefined) ?? "IDLE",
  });

  await query(
    `INSERT INTO chat_messages (tenant_id, lead_id, role, content)
     VALUES ($1, $2, 'assistant', $3)`,
    [tenant.id, lead.id, result.assistantMessage],
  );

  const { rows } = await query<{
    intent_score: number;
    lifecycle_stage: string;
  }>(`SELECT intent_score, lifecycle_stage FROM lead_profiles WHERE id = $1`, [
    lead.id,
  ]);

  return NextResponse.json({
    reply: result.assistantMessage,
    state: result.state,
    tool_trace: result.toolTrace,
    lead: {
      id: lead.id,
      intent_score: rows[0]?.intent_score ?? lead.intent_score,
      lifecycle_stage: rows[0]?.lifecycle_stage ?? lead.lifecycle_stage,
    },
  });
}
