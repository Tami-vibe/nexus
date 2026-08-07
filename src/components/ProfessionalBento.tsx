"use client";

import type { Practitioner, Sector } from "@/types";
import type { ProfessionalCategory } from "@/types/professional";
import { CATEGORY_TRUST_COPY } from "@/types/professional";
import { resolveProfessionalDossier } from "@/lib/professional";
import { expandCredentialLabel } from "@/lib/professionalLanguage";
import { VerifiedCredentials } from "@/components/VerifiedCredentials";

type Props = {
  practitioner: Practitioner;
  businessName: string;
  vat: string;
  sector: Sector;
  sameDayAvailable?: boolean;
};

/**
 * Adaptive Apple-grade bento — medical, artisan, trainer, legal, educator.
 * Government license renders EXACTLY ONCE via CompactLicenseBadge ribbon.
 */
export function ProfessionalBento({
  practitioner,
  businessName,
  vat,
  sector,
  sameDayAvailable = true,
}: Props) {
  const professional = resolveProfessionalDossier(practitioner, vat, sector);
  const copy = CATEGORY_TRUST_COPY[professional.category];
  const { dossier, licenses, bio } = practitioner;

  const philosophy =
    dossier.bioHeader ||
    bio ||
    `${practitioner.full_name} practices at ${businessName}.`;

  const focusAreas = [
    ...new Set([
      ...professional.specialties,
      ...practitioner.specialties,
      ...dossier.subSpecialties,
    ]),
  ];

  const career =
    professional.careerHistory.length > 0
      ? professional.careerHistory
      : dossier.careerHistory;

  const timeline = [
    ...career.map((item) => ({
      kind: "career" as const,
      title: item.role,
      detail: item.institution,
      meta: item.years,
    })),
    ...dossier.educationHistory.map((item) => ({
      kind: "education" as const,
      title: expandCredentialLabel(item.degree),
      detail: item.institution,
      meta: item.year,
    })),
  ];

  const categoryExtras = categoryExtraCards({
    category: professional.category,
    practitioner,
    professional,
    sameDayAvailable,
    bookingHint: copy.bookingHint,
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {/* Philosophy */}
        <article className="nx-card relative overflow-hidden p-6 md:col-span-2 md:p-8">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-soft)]/40 via-transparent to-transparent"
            aria-hidden
          />
          <p className="relative text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            {copy.philosophyLabel}
          </p>
          <p
            className="relative mt-4 max-w-3xl text-xl leading-relaxed text-[var(--ink)] md:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {philosophy}
          </p>
        </article>

        {/* License — once, compact ribbon (no dark seal / no second card) */}
        <div className="md:col-span-2">
          <VerifiedCredentials
            practitionerName={practitioner.full_name}
            licenses={licenses}
            fallbackCertifications={practitioner.certifications}
            credentialsHeading={copy.credentialsHeading}
          />
        </div>

        {/* Focus / materials / practice areas */}
        <article className="nx-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            {copy.focusLabel}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {focusAreas.length ? (
              focusAreas.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)]"
                >
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-[var(--muted)]">
                Focus areas coming soon.
              </li>
            )}
          </ul>
        </article>

        {/* Languages / availability or category metric */}
        <article className="nx-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            {professional.category === "trainer"
              ? "Client recomposition metrics"
              : professional.category === "legal"
                ? "Confidentiality & intake"
                : "Languages & availability"}
          </p>
          {professional.category === "trainer" ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric
                label="Athletes coached"
                value={`${practitioner.client_count}+`}
              />
              <Metric
                label="Avg rating"
                value={
                  practitioner.rating != null
                    ? practitioner.rating.toFixed(1)
                    : "—"
                }
              />
              <Metric
                label="Reviews"
                value={String(practitioner.review_count)}
              />
              <Metric label="Trial access" value="Open slots" />
            </div>
          ) : professional.category === "legal" ? (
            <div className="mt-4 space-y-3">
              <p className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm font-semibold text-[var(--ink)]">
                🔒 Attorney–client confidentiality honored on every consult
              </p>
              <p className="text-sm text-[var(--ink-soft)]">
                {copy.bookingHint}. Strategy sessions stay off the public feed.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {(dossier.languagesSpoken.length
                  ? dossier.languagesSpoken
                  : ["English"]
                ).map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {sameDayAvailable
                    ? copy.bookingHint
                    : "Appointment-first scheduling"}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Book directly from this profile — no external apps required.
                </p>
              </div>
            </>
          )}
        </article>

        {/* Deliverables */}
        {professional.deliverablesSummary.length ? (
          <article className="nx-card p-6 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              {professional.category === "artisan"
                ? "Signature deliverables"
                : professional.category === "legal"
                  ? "Court admittance & matter types"
                  : professional.category === "trainer"
                    ? "Session deliverables"
                    : "What you can book"}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {professional.deliverablesSummary.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-sm font-semibold text-[var(--ink)]"
                >
                  <span className="text-[var(--accent)]" aria-hidden>
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ) : null}

        {categoryExtras}

        {/* Career timeline */}
        <article className="nx-card p-6 md:col-span-2 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Career & education journey
          </p>
          {timeline.length ? (
            <ol className="relative mt-6 space-y-0 border-l border-[var(--line)] pl-6">
              {timeline.map((item, idx) => (
                <li
                  key={`${item.title}-${item.meta}-${idx}`}
                  className="relative pb-6 last:pb-0"
                >
                  <span
                    className={`absolute -left-[1.55rem] top-1.5 h-2.5 w-2.5 rounded-full ${
                      item.kind === "career"
                        ? "bg-[var(--accent)]"
                        : "bg-[var(--ink)]"
                    }`}
                    aria-hidden
                  />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {item.kind === "career" ? "Experience" : "Education"} ·{" "}
                    {item.meta}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--ink)]">
                    {item.title}
                  </p>
                  <p className="text-sm text-[var(--ink-soft)]">{item.detail}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">
              Professional history will appear here once published.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-3 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}

function categoryExtraCards({
  category,
  practitioner,
  professional,
  sameDayAvailable,
  bookingHint,
}: {
  category: ProfessionalCategory;
  practitioner: Practitioner;
  professional: ReturnType<typeof resolveProfessionalDossier>;
  sameDayAvailable: boolean;
  bookingHint: string;
}) {
  if (category === "artisan") {
    return (
      <article className="nx-card relative overflow-hidden p-0 md:col-span-2">
        <div className="grid md:grid-cols-2">
          <div
            className="min-h-[200px] bg-cover bg-center"
            style={{
              backgroundImage: `url("${practitioner.video_url || practitioner.headshot_url || ""}")`,
            }}
          />
          <div className="flex flex-col justify-center p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Portfolio video reel
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
              Workshop process & finished pieces
            </p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {bookingHint}. Guild #{" "}
              {professional.accreditationBadge.registrationNumber}.
            </p>
            <p className="mt-4 text-sm font-semibold text-[var(--accent)]">
              {sameDayAvailable
                ? "Walk-in visits when the kiln schedule allows"
                : "Book a workshop visit from the calendar →"}
            </p>
          </div>
        </div>
      </article>
    );
  }

  if (category === "trainer") {
    return (
      <article className="nx-card p-6 md:col-span-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Trial session booking
        </p>
        <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
          Start with a form-first intro session
        </p>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
          {bookingHint}. NSCA / NASM-class credentials stay visible on this
          profile — pick a slot from the calendar.
        </p>
      </article>
    );
  }

  return null;
}
