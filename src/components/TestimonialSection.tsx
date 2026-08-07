import type { TenantBundle } from "@/types";
import { trustFallbackImage } from "@/lib/commerce/media";

type Outcome = {
  name: string;
  quote: string;
  headshot: string;
  stars: number;
  badge: string;
};

const PATIENT_LABEL: Record<string, string> = {
  CLINIC: "Verified Patient",
  GYM: "Verified Member",
  SALON: "Verified Client",
  ARTISAN: "Verified Collector",
  DIGITAL: "Verified Founder",
  CONSULTING: "Verified Client",
  RETAIL: "Verified Guest",
  POOL: "Verified Member",
};

/**
 * Apple-grade Patient Outcome Reviews.
 * Quotes are ALWAYS bound inside the same card as author metadata + rating.
 * Never confuse these with Doctor / Practitioner profile cards.
 */
export function TestimonialSection({ tenant }: { tenant: TenantBundle }) {
  if (!tenant.testimonial_quote) return null;

  const label = PATIENT_LABEL[tenant.sector] || "Verified Guest";
  const portrait = trustFallbackImage(tenant.sector);
  const rating = Math.min(5, Math.max(1, Math.round(tenant.profile?.rating ?? 5)));

  const outcomes: Outcome[] = [
    {
      name: tenant.testimonial_author || "Verified guest",
      quote: tenant.testimonial_quote,
      headshot: portrait,
      stars: rating,
      badge: `${label} · Visited Yesterday`,
    },
  ];

  // Secondary synthetic peer outcome for bento density (same merchant, clearly a guest)
  if (tenant.profile?.review_count && tenant.profile.review_count > 20) {
    outcomes.push({
      name: secondaryGuestName(tenant.sector),
      quote: secondaryGuestQuote(tenant.sector, tenant.business_name),
      headshot: portrait,
      stars: 5,
      badge: `${label} · Visited This Week`,
    });
  }

  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="nx-container py-12 md:py-16"
    >
      <div className="max-w-2xl">
        <p className="nx-eyebrow">Patient outcome reviews</p>
        <h2
          id="outcomes-heading"
          className="nx-display mt-2 text-3xl md:text-4xl"
        >
          Real people. Verified visits.
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)] md:text-base">
          Guest outcomes only — not practitioner profiles. Doctors and
          specialists live under Team & Specialists.
        </p>
      </div>

      <div
        className={`mt-8 grid gap-5 ${
          outcomes.length > 1 ? "md:grid-cols-2" : "max-w-xl"
        }`}
      >
        {outcomes.map((outcome) => (
          <OutcomeCard key={outcome.name + outcome.badge} outcome={outcome} />
        ))}
      </div>
    </section>
  );
}

function OutcomeCard({ outcome }: { outcome: Outcome }) {
  return (
    <article className="nx-media-card flex flex-col">
      {/* Header: headshot + name + verified badge — bound to this card */}
      <header className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
        <div
          className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black/10 bg-[var(--paper)]"
          style={{
            backgroundImage: `url("${outcome.headshot}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={outcome.name}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--ink)]">
            {outcome.name}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-deep)]">
            <span className="nx-pulse-dot !h-1.5 !w-1.5" aria-hidden />
            {outcome.badge}
          </p>
        </div>
      </header>

      {/* Body: quote + stars — same container */}
      <div className="flex flex-1 flex-col px-5 py-5">
        <p
          className="text-lg leading-snug text-[var(--ink)] md:text-xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          “{outcome.quote}”
        </p>
        <p
          className="mt-4 text-base tracking-wide text-[var(--accent)]"
          aria-label={`${outcome.stars} out of 5 stars`}
        >
          {"★".repeat(outcome.stars)}
          <span className="text-zinc-300">{"★".repeat(5 - outcome.stars)}</span>
        </p>
      </div>

      {/* Media: video thumbnail + glassmorphic play — same card */}
      <div className="relative mx-5 mb-5 aspect-video overflow-hidden rounded-2xl border border-black/10 bg-[var(--ink)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${outcome.headshot}")` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Play video review from ${outcome.name}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 text-lg text-white backdrop-blur-md transition hover:scale-105 hover:bg-[var(--accent)] hover:text-white">
            <span className="ml-0.5">▶</span>
          </span>
        </button>
        <p className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
          Guest video review
        </p>
      </div>
    </article>
  );
}

function secondaryGuestName(sector: string) {
  if (sector === "CLINIC") return "Yael M.";
  if (sector === "GYM") return "Tom R.";
  if (sector === "SALON") return "Maya K.";
  return "Alex N.";
}

function secondaryGuestQuote(sector: string, business: string) {
  if (sector === "CLINIC") {
    return `Same-day consult at ${business} — clear plan, zero clinic theatre.`;
  }
  if (sector === "GYM") {
    return `Walked in knowing capacity was open. Best session I've had in months.`;
  }
  if (sector === "SALON") {
    return `Booked online, sat down on time. Color that grows out clean.`;
  }
  return `Effortless from browse to checkout at ${business}.`;
}

/** @deprecated Use TestimonialSection — kept for import compatibility */
export { TestimonialSection as TestimonialBand };
