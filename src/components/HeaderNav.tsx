"use client";

import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronDown,
  Heart,
  User,
} from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  locationLabel: string;
  onLocationClick: () => void;
  favoritesCount?: number;
};

/**
 * High-performance command header — unified search + location pill.
 */
export function HeaderNav({
  query,
  onQueryChange,
  locationLabel,
  onLocationClick,
  favoritesCount = 0,
}: Props) {
  return (
    <header className="w-full border-b border-zinc-200/80 bg-white">
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 md:gap-5 md:py-4 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-sm font-extrabold uppercase tracking-[0.16em] text-zinc-900"
        >
          Nexus OS
        </Link>

        <div className="mx-auto flex w-full max-w-xl items-center rounded-full border border-zinc-200 bg-zinc-50/80 px-4 py-2 shadow-sm transition-all focus-within:border-black focus-within:bg-white">
          <Search className="mr-2 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search treatments, doctors, or clinics..."
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            aria-label="Search offers"
          />
          <div className="mx-3 h-4 w-px shrink-0 bg-zinc-200" aria-hidden />
          <button
            type="button"
            onClick={onLocationClick}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-black"
          >
            <MapPin className="h-3.5 w-3.5 text-[#FF5E1A]" aria-hidden />
            <span>{locationLabel}</span>
            <ChevronDown className="h-3 w-3 text-zinc-400" aria-hidden />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={`Saved favorites, ${favoritesCount}`}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            <Heart className="h-4 w-4 stroke-zinc-800" aria-hidden />
            {favoritesCount > 0 ? (
              <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            aria-label="Open profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-800 transition hover:bg-zinc-200"
          >
            <User className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
