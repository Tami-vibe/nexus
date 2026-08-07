"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const SECTORS = [
  "RETAIL",
  "ARTISAN",
  "DIGITAL",
  "CONSULTING",
  "CLINIC",
  "GYM",
  "SALON",
] as const;

export function MagicVatOnboarding() {
  const router = useRouter();
  const [vat, setVat] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState<(typeof SECTORS)[number]>("ARTISAN");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/onboarding/vat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vat_number: vat.trim(),
          business_name: name.trim() || undefined,
          sector,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Onboarding failed");
        return;
      }
      router.push(data.storefront_url);
    });
  };

  return (
    <div className="nx-card p-6 md:p-8">
      <p className="nx-eyebrow">1-minute Magic VAT setup</p>
      <h3 className="nx-display mt-3 text-3xl">Drop your VAT. Launch the site.</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        We auto-generate a storefront for products, appointments, and walk-ins —
        plus an AI sales agent and CRM.
      </p>
      <div className="mt-6 grid gap-3">
        <input
          className="rounded-2xl border border-[var(--line)] px-4 py-3"
          placeholder="VAT / Tax ID (e.g. IL-NEW-001)"
          value={vat}
          onChange={(e) => setVat(e.target.value)}
        />
        <input
          className="rounded-2xl border border-[var(--line)] px-4 py-3"
          placeholder="Business name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="rounded-2xl border border-[var(--line)] px-4 py-3 bg-white"
          value={sector}
          onChange={(e) => setSector(e.target.value as (typeof SECTORS)[number])}
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button
          type="button"
          disabled={pending || vat.trim().length < 3}
          className="nx-btn nx-btn-accent w-full"
          onClick={submit}
        >
          {pending ? "Generating…" : "Generate my Nexus site"}
        </button>
      </div>
    </div>
  );
}
