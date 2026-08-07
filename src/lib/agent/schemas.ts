import { z } from "zod";

export const calendarCheckArgs = z.object({
  preferred_window: z
    .string()
    .optional()
    .describe("Optional preference like morning, afternoon, or evening"),
});

export const reserveSlotArgs = z.object({
  slot_label: z
    .string()
    .min(1)
    .describe("Slot label returned by calendar_check"),
});

export const mockCheckoutArgs = z.object({
  hold_id: z.string().uuid(),
});

export const AGENT_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "calendar_check",
      description:
        "Check real available capacity windows for this business. Never invent slots.",
      parameters: {
        type: "object",
        properties: {
          preferred_window: {
            type: "string",
            description: "morning | afternoon | evening",
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "reserve_slot",
      description:
        "Atomically hold one capacity slot for 3 minutes via Redis. Use only after calendar_check.",
      parameters: {
        type: "object",
        properties: {
          slot_label: { type: "string" },
        },
        required: ["slot_label"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "mock_checkout",
      description:
        "Confirm a held slot with mock checkout (Stripe Connect lands in Phase 4).",
      parameters: {
        type: "object",
        properties: {
          hold_id: { type: "string", format: "uuid" },
        },
        required: ["hold_id"],
        additionalProperties: false,
      },
    },
  },
];

export type ToolName = "calendar_check" | "reserve_slot" | "mock_checkout";
