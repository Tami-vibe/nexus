"use client";

import type { Practitioner } from "@/types";
import { expandCredentialLabel } from "@/lib/professionalLanguage";
import { VerifiedCredentials } from "@/components/VerifiedCredentials";

type Props = {
  practitioner: Practitioner;
  businessName: string;
  sameDayAvailable?: boolean;
};

/**
 * Apple-grade bento dossier — license once via CompactLicenseBadge ribbon.
 */
export function PractitionerDossierView({
  practitioner,
  businessName,
  sameDayAvailable = true,
}: Props) {
  const { dossier, licenses, specialties, bio } = practitioner;

  const philosophy =
    dossier.bioHeader ||
    bio ||
    `${practitioner.full_name} practices at ${businessName}.`;

  const focusAreas = [
    ...new Set([...specialties, ...dossier.subSpecialties]),
  ];

  const timeline = [
    ...dossier.careerHistory.map((item) => ({
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

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <article className="nx-card relative overflow-hidden p-6 md:col-span-2 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Care philosophy
          </p>
          <p
            className="mt-4 max-w-3xl text-xl leading-relaxed text-[var(--ink)] md:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {philosophy}
          </p>
        </article>

        <div className="md:col-span-2">
          <VerifiedCredentials
            practitionerName={practitioner.full_name}
            licenses={licenses}
            fallbackCertifications={practitioner.certifications}
          />
        </div>

        <article className="nx-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Specialties & sub-focus
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

        <article className="nx-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Languages & availability
          </p>
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
                ? "Same-day consults when capacity allows"
                : "Appointment-first scheduling"}
            </p>
          </div>
        </article>

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
