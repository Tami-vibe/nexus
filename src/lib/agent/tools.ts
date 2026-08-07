import type { AgentState } from "@/types";
import type { ToolName } from "@/lib/agent/schemas";

export function nextAgentState(
  current: AgentState,
  event: "user_message" | ToolName | "error",
): AgentState {
  if (event === "error") return "FAILED";

  switch (current) {
    case "IDLE":
      return event === "user_message" ? "QUALIFYING" : current;
    case "QUALIFYING":
      if (event === "calendar_check") return "SLOT_SEARCH";
      if (event === "user_message") return "QUALIFYING";
      return current;
    case "SLOT_SEARCH":
      if (event === "reserve_slot") return "HOLDING";
      if (event === "calendar_check") return "SLOT_SEARCH";
      return current;
    case "HOLDING":
      if (event === "mock_checkout") return "CHECKOUT_MOCK";
      if (event === "reserve_slot") return "HOLDING";
      return current;
    case "CHECKOUT_MOCK":
      return "DONE";
    default:
      return current;
  }
}
