import type { Metadata } from "next";
import Link from "next/link";
import { MICROBLADING_PROFILES } from "@/data/mockComparisons";
import { formatMoney } from "@/lib/commerce/money";

export const metadata: Metadata = {
  title: "Microblading Comparison · Nexus OS",
  description:
    "Transparent side-by-side Microblading artist comparison — Master, Senior, and Junior tiers with market benchmarks.",
};

/**
 * Stockholm minimalist Microblading comparison — 3 profiles, 1 orange Book CTA each.
 */
export default function MicrobladingComparePage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-sm font-semibold text-zinc-900">
            Nexus OS
          </Link>
          <Link
            href="/p/dott-marco-riva"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Multi-location podologist demo →
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Transparent market comparison
        </p>
        <h1
          className="mt-3 max-w-2xl text-4xl tracking-tight text-zinc-900 md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Microblading — compare by tier, price & proof
        </h1>
        <p className="mt-4 max-w-xl text-base text-zinc-600">
          Three verified artists. Same procedure category. Clear inclusions and
          regional price position — no PPC inflation.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {MICROBLADING_PROFILES.map((artist) => (
            <article
              key={artist.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-none"
            >
              <div
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `url("${artist.headshotUrl}")` }}
                role="img"
                aria-label={artist.fullName}
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {artist.tier}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-medium text-zinc-700">
                    {artist.marketPercentile}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-semibold text-zinc-900">
                  {artist.fullName}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {artist.studio} · {artist.city}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {artist.rating.toFixed(1)} ★ · {artist.reviewCount} verified
                </p>

                <p className="mt-4 text-2xl font-semibold text-zinc-900">
                  {formatMoney(artist.priceCents, artist.currency)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Regional avg band: {artist.regionalBandLabel}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3 py-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      Experience
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-zinc-900">
                      {artist.experienceYears}+ Yrs
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      Verified clients
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-zinc-900">
                      {artist.verifiedClients.toLocaleString()}+
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Inclusions
                </p>
                <ul className="mt-2 flex-1 space-y-1.5">
                  {artist.inclusions.map((item) => (
                    <li
                      key={item}
                      className="text-sm font-medium text-zinc-700"
                    >
                      ▸ {item}
                    </li>
                  ))}
                </ul>

                {/* Exactly ONE Clementine CTA per card */}
                <a
                  href={`#book-${artist.slug}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#FF5E1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55013]"
                >
                  Book {artist.tier.split(" ")[0]} Session —{" "}
                  {formatMoney(artist.priceCents, artist.currency)}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
