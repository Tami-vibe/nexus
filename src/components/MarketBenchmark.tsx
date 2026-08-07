"use client";

import type { Sector } from "@/types";
import { formatMoney } from "@/lib/commerce/money";
import {
  resolveSpecialistTier,
  resolveTierRank,
  type TierRank,
} from "@/lib/marketTiers";

export type { TierRank };

type Props = {
  serviceName: string;
  priceCents: number;
  currency: string;
  sector: Sector;
  experienceYears?: number;
  clientsTreated?: number;
  /** Optional explicit tier label — otherwise derived from sector + experience */
  tier?: string;
  /** When set, renders the single Clementine Book CTA for this card */
  onBook?: () => void;
  bookLabel?: string;
};

const SECTOR_DEFAULTS: Partial<
  Record<
    Sector,
    {
      experienceYears: number;
      clientsTreated: number;
      bandLow: number;
      bandHigh: number;
      clientsLabel: string;
    }
  >
> = {
  CLINIC: {
    experienceYears: 10,
    clientsTreated: 1200,
    bandLow: 0.85,
    bandHigh: 1.15,
    clientsLabel: "Verified patients",
  },
  SALON: {
    experienceYears: 8,
    clientsTreated: 1900,
    bandLow: 0.82,
    bandHigh: 1.2,
    clientsLabel: "Verified clients",
  },
  GYM: {
    experienceYears: 7,
    clientsTreated: 2400,
    bandLow: 0.88,
    bandHigh: 1.12,
    clientsLabel: "Athletes coached",
  },
  ARTISAN: {
    experienceYears: 9,
    clientsTreated: 480,
    bandLow: 0.8,
    bandHigh: 1.25,
    clientsLabel: "Collectors served",
  },
  CONSULTING: {
    experienceYears: 12,
    clientsTreated: 320,
    bandLow: 0.85,
    bandHigh: 1.3,
    clientsLabel: "Verified clients",
  },
  DIGITAL: {
    experienceYears: 8,
    clientsTreated: 600,
    bandLow: 0.85,
    bandHigh: 1.2,
    clientsLabel: "Verified clients",
  },
  POOL: {
    experienceYears: 6,
    clientsTreated: 3000,
    bandLow: 0.9,
    bandHigh: 1.1,
    clientsLabel: "Members served",
  },
  RETAIL: {
    experienceYears: 5,
    clientsTreated: 5000,
    bandLow: 0.92,
    bandHigh: 1.08,
    clientsLabel: "Verified buyers",
  },
};

export { resolveTierRank, resolveSpecialistTier };

/**
 * Transparent market pricing index — tier, experience, clients, regional band.
 * Exactly one Clementine Book button when `onBook` is provided.
 * Pass `tier` from resolveRoleBadge() for license-accurate clinic roles.
 */
export function MarketBenchmark({
  serviceName,
  priceCents,
  currency,
  sector,
  experienceYears,
  clientsTreated,
  tier: tierProp,
  onBook,
  bookLabel,
}: Props) {
  const defaults = SECTOR_DEFAULTS[sector] ?? {
    experienceYears: 8,
    clientsTreated: 1200,
    bandLow: 0.85,
    bandHigh: 1.15,
    clientsLabel: "Verified clients",
  };
  const years = experienceYears ?? defaults.experienceYears;
  const clients = clientsTreated ?? defaults.clientsTreated;
  const rank = resolveTierRank(years, clients);
  const tier = tierProp ?? resolveSpecialistTier(years, clients, sector);

  const avgLow = Math.round(priceCents * defaults.bandLow);
  const avgHigh = Math.round(priceCents * defaults.bandHigh);
  const mid = (avgLow + avgHigh) / 2;
  const percentile =
    priceCents >= mid
      ? priceCents >= avgHigh * 0.95
        ? "Top 10%"
        : "Top 25%"
      : priceCents <= avgLow * 1.05
        ? "Value tier"
        : "Mid market";

  const priceLabel = formatMoney(priceCents, currency);
  const bandLabel = `${formatMoney(avgLow, currency)}–${formatMoney(avgHigh, currency)}`;
  const sessionWord =
    sector === "CLINIC"
      ? "Consult"
      : sector === "CONSULTING"
        ? "Strategy"
        : "Session";
  const rankWord =
    rank === "master" ? "Master" : rank === "senior" ? "Senior" : "";
  const cta =
    bookLabel ??
    `Book ${rankWord} ${sessionWord} — ${priceLabel}`.replace(/\s+/g, " ");

  return (
    <div
      className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-4"
      aria-label={`Market benchmark for ${serviceName}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Transparent market index
        </p>
        <span className="nx-pill nx-pill-active !text-[10px]">{tier}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Experience" value={`${years}+ Yrs Exp`} />
        <Stat
          label={defaults.clientsLabel}
          value={`${clients.toLocaleString()}+`}
        />
      </div>

      <p className="mt-3 text-sm font-semibold leading-snug text-zinc-900">
        {priceLabel} · {percentile} {tier}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Regional avg band: {bandLabel}
      </p>

      {onBook ? (
        <button
          type="button"
          onClick={onBook}
          className="nx-btn nx-btn-accent mt-4 w-full !py-2.5 text-sm"
        >
          {cta.trim()}
        </button>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-xs font-semibold leading-snug text-zinc-900">
        {value}
      </p>
    </div>
  );
}
