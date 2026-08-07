"use client";

import { Check } from "lucide-react";

export type OfferInclusionsGridProps = {
  inclusions: string[];
  /** Compact panel header. Default: What's Included */
  headerLabel?: string;
  className?: string;
};

const MAX_INCLUSION_CHARS = 28;

const PROMISE_SCRUB =
  /guarantee|promise|permanent|100%\s*risk[- ]?free|instant results/i;

/**
 * Scrub legally binding / promotional promise language and compress to a
 * single compact line (≤28 chars) for card inclusion grids.
 */
export function sanitizeInclusionText(text: string): string {
  let clean = text
    .replace(/Satisfaction guarantee\s*—?\s*/gi, "Dedicated Support ")
    .replace(/—\s*Therapist tailored/gi, "")
    .replace(/—\s*Heat therapy add-on/gi, " Included")
    .replace(/—\s*Pure essential blends/gi, "")
    .replace(/—\s*Post-session unwind/gi, "")
    .replace(/—\s*Easy support path/gi, "")
    .replace(/100%\s*refund[^.!]*/gi, "Refund if non-candidate")
    .replace(/100%\s*Refund Guarantee[^.!]*/gi, "Refund if non-candidate")
    .replace(/Satisfaction path/gi, "Dedicated Client Support")
    .replace(/Satisfaction guarantee/gi, "Dedicated Client Support")
    .replace(/\bpermanent\b/gi, "lasting")
    .replace(/instant results/gi, "guided care plan")
    .replace(/100%\s*risk[- ]?free/gi, "standard refund path")
    .replace(/\bguarantee(d|s)?\b/gi, "included")
    .replace(/\bpromise(d|s)?\b/gi, "listed")
    .replace(/\s*[—–-]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Drop residual promise phrases entirely if scrub left junk
  if (PROMISE_SCRUB.test(clean)) {
    clean = clean.replace(PROMISE_SCRUB, "").replace(/\s+/g, " ").trim();
  }

  if (!clean) clean = "Dedicated Client Support";

  if (clean.length > MAX_INCLUSION_CHARS) {
    clean = `${clean.slice(0, MAX_INCLUSION_CHARS - 1).trimEnd()}…`;
  }

  return clean;
}

export function sanitizeInclusions(inclusions: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of inclusions) {
    const clean = sanitizeInclusionText(raw);
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
}

/**
 * Compact 2-column inclusion grid — single-line truncated items, promise-free copy.
 */
export function OfferInclusionsGrid({
  inclusions,
  headerLabel = "What's Included",
  className = "",
}: OfferInclusionsGridProps) {
  const items = sanitizeInclusions(inclusions);
  if (!items.length) return null;

  return (
    <div
      className={`rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5 ${className}`}
    >
      <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-zinc-400">
        {headerLabel}
      </span>

      <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 items-center gap-1.5">
            <Check
              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
              aria-hidden
            />
            <span
              className="truncate whitespace-nowrap text-xs font-medium text-zinc-700"
              title={item}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OfferInclusionsGrid;
