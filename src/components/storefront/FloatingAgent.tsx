"use client";

import { useState, useTransition } from "react";
import type { Sector } from "@/types";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const PROACTIVE: Partial<Record<Sector, string>> = {
  CLINIC: "Need a same-day consult? I can book you in 30 seconds.",
  GYM: "Want a floor spot before you leave home? I can hold one now.",
  SALON: "Looking for a chair today? I can reserve you in 30 seconds.",
  ARTISAN: "Want the pourer or a custom commission? I can check out for you.",
  DIGITAL: "Ready for the launch kit? I can complete checkout instantly.",
  CONSULTING: "Need a strategy call this week? I can book the next slot.",
  RETAIL: "Found something you like? I can finish checkout in one tap.",
  POOL: "Want an open lane? I can hold capacity before you arrive.",
};

export function FloatingAgent({
  vat,
  businessName,
  sector,
}: {
  vat: string;
  businessName: string;
  sector: Sector;
}) {
  const [open, setOpen] = useState(false);
  const [dismissedPreview, setDismissedPreview] = useState(false);
  const [phone, setPhone] = useState("+972500000300");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [state, setState] = useState("IDLE");
  const [score, setScore] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const preview =
    PROACTIVE[sector] ||
    "Need help buying or booking? I can finish it in 30 seconds.";

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    startTransition(async () => {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vat, phone, messages: next, state }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.error ?? "Agent unavailable" },
        ]);
        return;
      }
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply as string },
      ]);
      setState(data.state);
      setScore(data.lead?.intent_score ?? null);
    });
  };

  const quickActions = [
    { label: "Book next slot", prompt: "Book me the next available appointment slot" },
    { label: "Buy bestseller", prompt: "Help me buy your most popular product now" },
    { label: "Hold capacity", prompt: "Hold a walk-in spot for me and confirm checkout" },
  ];

  return (
    <>
      <div id="agent" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {!open && !dismissedPreview ? (
          <div className="relative max-w-[260px] rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm">
            <button
              type="button"
              className="absolute right-2 top-1 text-[var(--muted)]"
              aria-label="Dismiss preview"
              onClick={() => setDismissedPreview(true)}
            >
              ×
            </button>
            <p className="pr-4 font-medium text-[var(--ink)]">{preview}</p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setDismissedPreview(true);
          }}
          className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 text-xs font-semibold text-white"
          aria-expanded={open}
          aria-controls="nexus-agent-drawer"
        >
          <span className="relative z-10 px-1 text-center leading-tight">
            {open ? "Close" : "AI Rep"}
          </span>
        </button>
      </div>

      {open ? (
        <div
          id="nexus-agent-drawer"
          className="fixed bottom-28 right-6 z-40 flex h-[min(580px,72vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-white"
        >
          <header className="border-b border-[var(--line)] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-xs font-bold text-white">
                <span className="relative">AI</span>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Voice + chat agent
                </p>
                <h3 className="font-semibold text-[var(--ink)]">{businessName}</h3>
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              WebRTC voice ready · text fallback active
              {score != null ? ` · Intent ${score}` : ""}
            </p>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-[var(--line)] px-3 py-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="shrink-0 rounded-full border border-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                onClick={() => send(action.prompt)}
                disabled={pending}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                Tap a quick action or ask about products, appointments, or walk-ins.
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-[var(--accent-soft)] text-[var(--accent-deep)]"
                      : "bg-[var(--paper)] text-[var(--ink)]"
                  }`}
                >
                  {m.content}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[var(--line)] p-3">
            <input
              className="mb-2 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-xs"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-label="Phone"
              placeholder="Mobile for booking confirmation"
            />
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                className="flex-1 rounded-full border border-[var(--line)] px-4 py-2 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message the agent…"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending}
                className="nx-btn nx-btn-secondary !px-4 !py-2 text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
