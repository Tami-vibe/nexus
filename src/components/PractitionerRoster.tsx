"use client";

import Link from "next/link";
import type { Practitioner, Sector } from "@/types";
import { trustFallbackImage } from "@/lib/commerce/media";
import {
  catalogItemClass,
  catalogLayoutMode,
  catalogShellClass,
} from "@/lib/commerce/layout";

const ROLE_LABEL: Partial<Record<Sector, string>> = {
  CLINIC: "Doctors & Specialists",
  GYM: "Coaches & Instructors",
  SALON: "Stylists & Artists",
  ARTISAN: "Artisans & Makers",
  DIGITAL: "Strategists",
  CONSULTING: "Counsel & Advisors",
};

export function PractitionerRoster({
  vat,
  sector,
  practitioners,
  embedded = false,
}: {
  vat: string;
  sector: Sector;
  practitioners: Practitioner[];
  embedded?: boolean;
}) {
  if (!practitioners.length) return null;

  const mode = catalogLayoutMode(practitioners.length);
  const role = ROLE_LABEL[sector] || "Team & Specialists";

  const grid = (
    <div className={catalogShellClass(mode)}>
      {practitioners.map((p) => {
        const photo = p.headshot_url || trustFallbackImage(sector);
        const card = (
          <article
            key={p.id}
            className={`nx-card overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${catalogItemClass(mode)} ${
              mode === "spotlight" ? "grid md:grid-cols-2" : ""
            }`}
          >
            <div
              className={`nx-media-frame ${
                mode === "spotlight"
                  ? "min-h-[280px] aspect-[4/3] md:min-h-[360px] md:aspect-auto md:h-full"
                  : "aspect-[4/5]"
              }`}
              style={{
                backgroundImage: `url("${photo}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              role="img"
              aria-label={p.full_name}
            />
            <div className="flex flex-col p-5 md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                Practitioner · {p.credential}
              </p>
              {p.licenses.some((l) => l.status === "VERIFIED") ? (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[10px] font-bold text-white">
                  🛡️ License verified
                </p>
              ) : null}
              <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">
                {p.full_name}
                <span className="mt-1 block text-sm font-medium text-[var(--ink-soft)]">
                  {p.full_name} · {p.credential}
                </span>
              </h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Not a patient review — team profile
              </p>
              {p.title ? (
                <p className="mt-1 text-sm text-[var(--muted)]">{p.title}</p>
              ) : null}
              {p.rating != null ? (
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                  {p.rating.toFixed(1)} ★ ({p.review_count})
                </p>
              ) : null}
              <p className="mt-1 text-sm text-[var(--muted)]">
                {p.client_count}+ {p.client_label} Treated
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.specialties.slice(0, 4).map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-[var(--paper)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-soft)]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${vat}/p/${p.slug}`}
                className="nx-btn nx-btn-ghost mt-5 self-start !py-2 text-sm"
              >
                View profile & book
              </Link>
            </div>
          </article>
        );
        return card;
      })}
    </div>
  );

  if (embedded) {
    return <div id="team">{grid}</div>;
  }

  return (
    <section id="team" className="nx-container scroll-mt-20 py-12 md:py-16">
      <p className="nx-eyebrow">{role}</p>
      <h2 className="nx-display mt-3 text-4xl md:text-5xl">Meet the team</h2>
      <p className="mt-3 max-w-lg text-[var(--muted)]">
        Individual VAT professionals with verified credentials — book them
        directly.
      </p>
      {grid}
    </section>
  );
}
