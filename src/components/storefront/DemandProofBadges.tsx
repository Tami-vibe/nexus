"use client";

import type { DemandProof } from "@/lib/commerce/demand";

export function DemandProofBadges({
  proof,
  variant = "compact",
}: {
  proof: DemandProof;
  variant?: "compact" | "spotlight";
}) {
  const items = [
    {
      icon: "🛡️",
      text: `Verified Local Demand: ${proof.viewsToday} real views today`,
    },
    {
      icon: "⚡",
      text: `${proof.bookedLast24h} slots booked in the last 24h`,
    },
    {
      icon: "🔒",
      text: "100% Anti-Bot Protected Transaction",
    },
  ];

  return (
    <ul
      className={
        variant === "spotlight"
          ? "mt-4 space-y-2"
          : "mt-3 space-y-1.5"
      }
      aria-label="Verified human demand"
    >
      {items.map((item) => (
        <li
          key={item.text}
          className={`flex items-start gap-2 text-[var(--ink-soft)] ${
            variant === "spotlight" ? "text-sm" : "text-xs"
          }`}
        >
          <span aria-hidden className="leading-none">
            {item.icon}
          </span>
          <span className="font-medium leading-snug">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
