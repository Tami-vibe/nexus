import { resolveCapacity } from "@/lib/capacity/engine";
import { acquireHold, confirmHold } from "@/lib/capacity/holds";
import { query } from "@/lib/db";
import { recordLeadEvent } from "@/lib/leads/scoring";
import { getPaymentProvider } from "@/lib/payments/provider";
import {
  calendarCheckArgs,
  mockCheckoutArgs,
  reserveSlotArgs,
  type ToolName,
} from "@/lib/agent/schemas";
import type { TenantBundle } from "@/types";

export interface ToolContext {
  tenant: TenantBundle;
  leadId: string;
}

export async function executeTool(
  name: ToolName,
  rawArgs: unknown,
  ctx: ToolContext,
): Promise<unknown> {
  switch (name) {
    case "calendar_check": {
      const args = calendarCheckArgs.parse(rawArgs ?? {});
      const capacity = await resolveCapacity(ctx.tenant);
      await recordLeadEvent({
        tenantId: ctx.tenant.id,
        leadId: ctx.leadId,
        eventType: "SLOT_ASK",
        payload: { preferred_window: args.preferred_window ?? null },
      });

      const hours = ctx.tenant.profile?.hours_json ?? {};
      const windows =
        capacity.spots_open > 0
          ? [
              {
                slot_label: "next_available",
                label: "Next available walk-in / drop-in",
                spots_open: capacity.spots_open,
                estimated: capacity.is_estimated,
              },
              {
                slot_label: "evening_peak",
                label: "This evening (peak window)",
                spots_open: Math.max(0, capacity.spots_open - 2),
                estimated: capacity.is_estimated,
              },
            ].filter((w) => w.spots_open > 0)
          : [];

      return {
        spots_open: capacity.spots_open,
        badge: capacity.badge_label,
        preferred_window: args.preferred_window ?? null,
        hours,
        windows,
        message:
          windows.length === 0
            ? "No capacity right now. Offer to notify when a spot opens."
            : "Present only these windows. Do not invent prices or times.",
      };
    }
    case "reserve_slot": {
      const args = reserveSlotArgs.parse(rawArgs);
      const hold = await acquireHold(ctx.tenant.id, ctx.leadId);
      if (!hold.ok) {
        return {
          ok: false,
          reason: hold.reason,
          next_hint: "Offer next_available after re-checking calendar.",
        };
      }
      await recordLeadEvent({
        tenantId: ctx.tenant.id,
        leadId: ctx.leadId,
        eventType: "HOLD",
        payload: { hold_id: hold.hold_id, slot_label: args.slot_label },
      });
      return {
        ok: true,
        hold_id: hold.hold_id,
        expires_at: hold.expires_at,
        slot_label: args.slot_label,
        message: "Slot held for 3 minutes. Proceed to mock_checkout.",
      };
    }
    case "mock_checkout": {
      const args = mockCheckoutArgs.parse(rawArgs);
      const payment = await getPaymentProvider().createCheckout({
        holdId: args.hold_id,
        tenantId: ctx.tenant.id,
        amountCents: 4900,
        currency: "ils",
        customerPhone: "redacted",
      });
      if (payment.status === "FAILED") {
        return { ok: false, reason: "Payment provider failed." };
      }
      if (payment.status === "REQUIRES_PAYMENT") {
        return {
          ok: true,
          hold_id: args.hold_id,
          payment_status: payment.status,
          provider: payment.provider,
          client_secret: payment.client_secret,
          message: "Complete Stripe payment to confirm the hold.",
        };
      }
      const confirmed = await confirmHold(args.hold_id);
      if (!confirmed) {
        return {
          ok: false,
          reason: "Hold expired or already used. Re-run calendar_check.",
        };
      }
      await query(
        `INSERT INTO payment_intents
           (tenant_id, hold_id, provider, provider_ref, amount_cents, currency, status)
         VALUES ($1, $2, $3, $4, 4900, 'ils', $5)`,
        [
          ctx.tenant.id,
          args.hold_id,
          payment.provider,
          payment.payment_intent_id ?? null,
          payment.status,
        ],
      );
      await recordLeadEvent({
        tenantId: ctx.tenant.id,
        leadId: ctx.leadId,
        eventType: "CHECKOUT_MOCK",
        payload: {
          hold_id: args.hold_id,
          provider: payment.provider,
          payment_intent_id: payment.payment_intent_id,
        },
      });
      return {
        ok: true,
        hold_id: args.hold_id,
        payment_status: payment.status,
        provider: payment.provider,
        message:
          payment.provider === "stripe"
            ? "Stripe Connect checkout complete."
            : "Mock checkout complete (set STRIPE_SECRET_KEY for live Connect).",
      };
    }
    default:
      return { ok: false, reason: `Unknown tool: ${name}` };
  }
}
