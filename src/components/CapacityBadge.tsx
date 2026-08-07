"use client";

import { useEffect, useState } from "react";
import type { CapacitySnapshot } from "@/types";

/** Minimalist inline capacity pill — never a floating bubble. */
export function CapacityBadge({
  vat,
  variant = "pill",
}: {
  vat: string;
  variant?: "pill" | "inline";
}) {
  const [data, setData] = useState<CapacitySnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/capacity/${encodeURIComponent(vat)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("capacity unavailable");
        const json = (await res.json()) as CapacitySnapshot;
        if (alive) {
          setData(json);
          setError(null);
        }
      } catch {
        if (alive) setError("Capacity feed offline");
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [vat]);

  if (error) {
    return <span className="nx-pill text-zinc-500">{error}</span>;
  }
  if (!data) {
    return <span className="nx-pill text-zinc-500">Checking capacity…</span>;
  }

  return (
    <span
      className={`nx-pill gap-1.5 border border-zinc-200/80 bg-white text-zinc-800 ${
        variant === "inline" ? "" : ""
      }`}
      data-source={data.signal_source}
    >
      <span aria-hidden>🟢</span>
      Live Studio Capacity: {data.spots_open} Spots
      {data.is_estimated ? " (est.)" : ""}
    </span>
  );
}
