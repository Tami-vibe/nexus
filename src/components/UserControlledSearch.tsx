"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MarketBenchmark } from "@/components/MarketBenchmark";
import {
  MERCHANT_CATALOG,
  merchantStorefrontHref,
  practitionerProfileHref,
  searchMerchants,
  specialistsFromMerchants,
  type SearchMode,
} from "@/data/merchants";
import { resolveRoleBadge } from "@/lib/professionalLanguage";

const CITY_OPTIONS = [
  "All cities",
  ...[...new Set(MERCHANT_CATALOG.map((m) => m.city))].sort(),
];

/**
 * Business-first directory search with explicit specialist toggle.
 * Default: clinic/studio cards. Switch: specialists from matched parents only.
 */
export function UserControlledSearch({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState("All cities");
  const [mode, setMode] = useState<SearchMode>("clinics");

  const matchedMerchants = useMemo(
    () =>
      searchMerchants(query, city === "All cities" ? undefined : city),
    [query, city],
  );

  const specialists = useMemo(
    () => specialistsFromMerchants(matchedMerchants, query || undefined),
    [matchedMerchants, query],
  );

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Directory search
        </p>
        <h2
          className="mt-2 text-2xl font-semibold text-zinc-900 md:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Find clinics first — specialists on demand
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Search returns registered businesses by default. Switch to specialists
          only when you want individual practitioners linked to those clinics.
        </p>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              What do you need?
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try “Podologist” or “Foot Doctor”'
              className="rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
            />
          </label>
          <label className="flex w-full flex-col gap-1.5 md:w-48">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              City
            </span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-sm font-medium text-zinc-900"
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          className="mt-5 flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 p-2 sm:flex-row"
          role="tablist"
          aria-label="Search result mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "clinics"}
            onClick={() => setMode("clinics")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              mode === "clinics"
                ? "bg-zinc-900 text-white"
                : "bg-transparent text-zinc-800 hover:bg-white"
            }`}
          >
            🏢 View Clinics & Studios (Default)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "specialists"}
            onClick={() => setMode("specialists")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              mode === "specialists"
                ? "bg-zinc-900 text-white"
                : "bg-transparent text-zinc-800 hover:bg-white"
            }`}
          >
            👤 View Specialists Nearby
          </button>
        </div>
      </div>

      {mode === "clinics" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matchedMerchants.length === 0 ? (
            <p className="col-span-full text-sm text-zinc-600">
              No clinics match this search.
            </p>
          ) : (
            matchedMerchants.map((m) => (
              <article
                key={m.vat}
                className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-none"
              >
                <div
                  className="aspect-[16/10] bg-cover bg-center"
                  style={{ backgroundImage: `url("${m.image}")` }}
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {m.sector} · {m.city}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-900">
                    {m.businessName}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    {m.description}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-800">
                    {m.rating.toFixed(1)} ★ ({m.reviewCount}) · {m.team.length}{" "}
                    specialist{m.team.length === 1 ? "" : "s"} on staff
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.searchTags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={merchantStorefrontHref(m)}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#FF5E1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55013]"
                  >
                    Open clinic storefront
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {specialists.length === 0 ? (
            <p className="col-span-full text-sm text-zinc-600">
              No specialists in the matched clinics for this query.
            </p>
          ) : (
            specialists.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none"
              >
                <div className="flex gap-4">
                  <div
                    className="h-20 w-20 shrink-0 rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url("${p.headshotUrl}")` }}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Via {p.parentBusinessName}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-zinc-900">
                      {p.fullName}
                    </h3>
                    <p className="text-sm text-zinc-600">{p.title}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <MarketBenchmark
                    serviceName={p.specialties[0] ?? p.title}
                    priceCents={p.priceCents}
                    currency={p.currency}
                    sector={
                      MERCHANT_CATALOG.find((m) => m.vat === p.parentVat)
                        ?.sector ?? "CLINIC"
                    }
                    experienceYears={p.experienceYears}
                    clientsTreated={p.clientCount}
                    tier={resolveRoleBadge({
                      sector:
                        MERCHANT_CATALOG.find((m) => m.vat === p.parentVat)
                          ?.sector ?? "CLINIC",
                      credential: p.credential,
                      title: p.title,
                      experienceYears: p.experienceYears,
                      clientsTreated: p.clientCount,
                    })}
                    bookLabel="Book Consultation"
                    onBook={() => {
                      window.location.href = practitionerProfileHref(p);
                    }}
                  />
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Parent clinic:{" "}
                  <Link
                    href={
                      merchantStorefrontHref(
                        MERCHANT_CATALOG.find((m) => m.vat === p.parentVat)!,
                      )
                    }
                    className="font-semibold text-zinc-800 underline-offset-2 hover:underline"
                  >
                    {p.parentBusinessName}
                  </Link>
                </p>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
