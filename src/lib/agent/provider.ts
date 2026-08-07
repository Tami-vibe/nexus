import { AGENT_TOOLS, type ToolName } from "@/lib/agent/schemas";
import { executeTool, type ToolContext } from "@/lib/agent/state-machine";
import { nextAgentState } from "@/lib/agent/tools";
import type { AgentState } from "@/types";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
}

interface ProviderResult {
  assistantMessage: string;
  state: AgentState;
  toolTrace: Array<{ name: string; result: unknown }>;
}

function systemPrompt(businessName: string, sector: string) {
  return `You are the Nexus OS autonomous sales agent for ${businessName} (${sector}).
You qualify leads and book capacity. You MUST use tools for calendar, holds, and checkout.
Never invent prices, refunds, or availability. Keep replies short and conversion-focused.
If tools fail, explain briefly and offer the next step.`;
}

async function runMockProvider(
  messages: ChatMessage[],
  ctx: ToolContext,
  state: AgentState,
): Promise<ProviderResult> {
  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const lower = lastUser.toLowerCase();
  const trace: Array<{ name: string; result: unknown }> = [];
  let current = state;

  const wantsBook =
    /book|slot|available|reserve|join|sign|checkout|pay|spot/.test(lower) ||
    current !== "IDLE";

  if (!wantsBook && current === "IDLE") {
    return {
      assistantMessage: `Welcome to ${ctx.tenant.business_name}. I can check live capacity and hold a spot in seconds. What are you looking for today?`,
      state: nextAgentState(current, "user_message"),
      toolTrace: trace,
    };
  }

  current = nextAgentState(current, "user_message");

  const cal = await executeTool(
    "calendar_check",
    { preferred_window: /evening/.test(lower) ? "evening" : "next" },
    ctx,
  );
  trace.push({ name: "calendar_check", result: cal });
  current = nextAgentState(current, "calendar_check");

  const windows = (cal as { windows?: Array<{ slot_label: string }> }).windows;
  if (!windows?.length) {
    return {
      assistantMessage:
        "We're at capacity right now. I can hold the next opening the moment one clears — want me to watch for you?",
      state: current,
      toolTrace: trace,
    };
  }

  if (!/hold|reserve|book|yes|checkout|pay|confirm/.test(lower) && state === "IDLE") {
    return {
      assistantMessage: `I see ${windows.length} open window(s). Say "hold a spot" and I'll lock one for 3 minutes.`,
      state: current,
      toolTrace: trace,
    };
  }

  const hold = await executeTool(
    "reserve_slot",
    { slot_label: windows[0].slot_label },
    ctx,
  );
  trace.push({ name: "reserve_slot", result: hold });
  current = nextAgentState(current, "reserve_slot");

  if (!(hold as { ok?: boolean }).ok) {
    return {
      assistantMessage:
        (hold as { reason?: string }).reason ??
        "That slot was just claimed. Want me to check again?",
      state: "FAILED",
      toolTrace: trace,
    };
  }

  if (/checkout|pay|confirm|complete/.test(lower)) {
    const checkout = await executeTool(
      "mock_checkout",
      { hold_id: (hold as { hold_id: string }).hold_id },
      ctx,
    );
    trace.push({ name: "mock_checkout", result: checkout });
    current = nextAgentState(current, "mock_checkout");
    return {
      assistantMessage:
        "You're locked in — mock checkout complete. See you on the floor.",
      state: nextAgentState(current, "mock_checkout"),
      toolTrace: trace,
    };
  }

  return {
    assistantMessage: `Spot held until ${(hold as { expires_at: string }).expires_at}. Reply "confirm checkout" to finish (mock payment).`,
    state: current,
    toolTrace: trace,
  };
}

async function runOpenAIProvider(
  messages: ChatMessage[],
  ctx: ToolContext,
  state: AgentState,
): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  if (!apiKey) {
    return runMockProvider(messages, ctx, state);
  }

  const trace: Array<{ name: string; result: unknown }> = [];
  let current = nextAgentState(state, "user_message");
  const running: Array<Record<string, unknown>> = [
    {
      role: "system",
      content: systemPrompt(ctx.tenant.business_name, ctx.tenant.sector),
    },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
      ...(m.name ? { name: m.name } : {}),
      ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
    })),
  ];

  for (let i = 0; i < 4; i++) {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: running,
        tools: AGENT_TOOLS,
        tool_choice: "auto",
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`LLM error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      choices: Array<{
        message: {
          content?: string | null;
          tool_calls?: Array<{
            id: string;
            function: { name: string; arguments: string };
          }>;
        };
      }>;
    };

    const msg = data.choices[0]?.message;
    if (!msg) break;

    if (msg.tool_calls?.length) {
      running.push(msg as unknown as Record<string, unknown>);
      for (const call of msg.tool_calls) {
        const name = call.function.name as ToolName;
        let args: unknown = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          args = {};
        }
        const result = await executeTool(name, args, ctx);
        trace.push({ name, result });
        current = nextAgentState(current, name);
        running.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
      continue;
    }

    return {
      assistantMessage: msg.content?.trim() || "How can I help you book?",
      state: current,
      toolTrace: trace,
    };
  }

  return {
    assistantMessage: "I hit a loop limit — try asking me to check availability again.",
    state: current,
    toolTrace: trace,
  };
}

export async function runAgentTurn(input: {
  messages: ChatMessage[];
  ctx: ToolContext;
  state?: AgentState;
}): Promise<ProviderResult> {
  const state = input.state ?? "IDLE";
  if (process.env.OPENAI_API_KEY) {
    return runOpenAIProvider(input.messages, input.ctx, state);
  }
  return runMockProvider(input.messages, input.ctx, state);
}
