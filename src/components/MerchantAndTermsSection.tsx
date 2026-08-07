"use client";

import Link from "next/link";
import {
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import type { MerchantHub } from "@/lib/offerDetail";
import { adaptivePanelTextClassName } from "@/components/ui/AdaptiveContainer";

type Props = {
  merchant: MerchantHub;
  mapsUrl: string;
};

/** Merchant identity hub only — plan/includes/legal live in OfferDetailsTabbedSection. */
export function MerchantAndTermsSection({ merchant, mapsUrl }: Props) {
  return (
    <section className="my-2 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-100 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[#FF5E1A] text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]">
            <Store className="h-3.5 w-3.5" aria-hidden />
            Verified Partner
          </span>
          <h2 className="mt-1 text-xl font-black text-zinc-900">
            About {merchant.name}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={merchant.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-zinc-800 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]"
          >
            <Globe className="h-4 w-4" aria-hidden />
            <span>Official Website</span>
            <ExternalLink className="h-3 w-3 text-zinc-400" aria-hidden />
          </a>
          <Link
            href={merchant.nexusStorefront}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 font-bold text-zinc-900 transition-all hover:border-zinc-300 hover:bg-zinc-50 text-[clamp(0.8125rem,0.75rem+0.35vw,0.9375rem)]"
          >
            <Store className="h-4 w-4 text-[#FF5E1A]" aria-hidden />
            Nexus Storefront
          </Link>
        </div>
      </div>

      <p className={`max-w-prose text-zinc-600 ${adaptivePanelTextClassName}`}>
        {merchant.description}
      </p>

      <div
        className={`grid grid-cols-1 gap-3 pt-1 text-zinc-700 sm:grid-cols-3 ${adaptivePanelTextClassName}`}
      >
        <a
          href={merchant.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 font-semibold transition-colors hover:border-zinc-200 hover:bg-white"
        >
          <Globe className="h-4 w-4 shrink-0 text-[#FF5E1A]" aria-hidden />
          <span className="truncate">Official Website</span>
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 font-semibold transition-colors hover:border-zinc-200 hover:bg-white"
        >
          <MapPin className="h-4 w-4 shrink-0 text-[#FF5E1A]" aria-hidden />
          <span className="truncate">Directions & Address</span>
        </a>
        <a
          href={`tel:${merchant.phone.replace(/[^\d+]/g, "")}`}
          className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 font-semibold transition-colors hover:border-zinc-200 hover:bg-white"
        >
          <Phone className="h-4 w-4 shrink-0 text-[#FF5E1A]" aria-hidden />
          <span className="truncate">Contact Merchant</span>
        </a>
      </div>

      <div
        className={`grid grid-cols-1 gap-3 text-zinc-700 sm:grid-cols-2 ${adaptivePanelTextClassName}`}
      >
        <div className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
          <MapPin className="h-4 w-4 shrink-0 text-[#FF5E1A]" aria-hidden />
          <span className="truncate">{merchant.address}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
          <Phone className="h-4 w-4 shrink-0 text-[#FF5E1A]" aria-hidden />
          <span>{merchant.phone}</span>
        </div>
      </div>
    </section>
  );
}
