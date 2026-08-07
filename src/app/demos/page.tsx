import Link from "next/link";
import {
  MERCHANT_CATALOG,
  PRIMARY_MERCHANT_DEMOS,
  PRACTITIONER_DIRECTORY,
  merchantStorefrontHref,
  practitionerProfileHref,
  teamForMerchant,
} from "@/data/merchants";
import { UserControlledSearch } from "@/components/UserControlledSearch";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Live Merchant Demos | Nexus OS",
  description:
    "Business-first directory demos — clinics and studios first, practitioners linked to parent VATs.",
};

function MerchantCard({
  vat,
  businessName,
  sector,
  city,
  tagline,
  description,
  image,
  teamCount,
  href,
}: {
  vat: string;
  businessName: string;
  sector: string;
  city: string;
  tagline: string;
  description: string;
  image: string;
  teamCount: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-none transition hover:border-zinc-400"
    >
      <div
        className="aspect-[16/10] bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {sector} · {city}
        </p>
        <h3 className="mt-1 text-xl font-semibold text-zinc-900">
          {businessName}
        </h3>
        <p className="mt-1 text-sm font-medium text-zinc-800">{tagline}</p>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{description}</p>
        <p className="mt-3 text-xs font-medium text-zinc-500">
          VAT {vat} · {teamCount} on staff roster
        </p>
      </div>
    </Link>
  );
}

export default function DemosPage() {
  const practitioners = Object.values(PRACTITIONER_DIRECTORY);

  return (
    <main className="min-h-screen bg-zinc-50">
      <Header />
      <nav className="border-b border-zinc-200/60 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-3 px-5 py-3 text-sm font-medium">
          <a href="#merchants" className="text-zinc-700 hover:text-zinc-900">
            Merchants
          </a>
          <a href="#search" className="text-zinc-700 hover:text-zinc-900">
            Search
          </a>
          <a href="#practitioners" className="text-zinc-700 hover:text-zinc-900">
            Practitioner dossiers
          </a>
          <Link href="/offers" className="text-zinc-700 hover:text-zinc-900">
            Introductory Offers
          </Link>
        </div>
      </nav>

      <section className="border-b border-zinc-200/60 bg-white py-14">
        <div className="mx-auto w-full max-w-6xl px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Live demos
          </p>
          <h1
            className="mt-3 text-4xl tracking-tight text-zinc-900 md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Merchants first. Practitioners attached.
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-600">
            The directory opens on registered businesses. Individual specialists
            live inside their parent clinic staff roster — never as orphan cards
            in the main merchant grid.
          </p>
        </div>
      </section>

      <section id="merchants" className="py-14">
        <div className="mx-auto w-full max-w-6xl px-5">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Business / Clinic Cards
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Primary showcase — Harbor Wellness Clinic, Lumen Hair Studio, Atelier
            Neri.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRIMARY_MERCHANT_DEMOS.map((m) => (
              <MerchantCard
                key={m.vat}
                vat={m.vat}
                businessName={m.businessName}
                sector={m.sector}
                city={m.city}
                tagline={m.tagline}
                description={m.description}
                image={m.image}
                teamCount={m.team.length}
                href={merchantStorefrontHref(m)}
              />
            ))}
          </div>

          <h3 className="mt-14 text-lg font-semibold text-zinc-900">
            Full merchant catalog
          </h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MERCHANT_CATALOG.filter(
              (m) => !PRIMARY_MERCHANT_DEMOS.some((p) => p.vat === m.vat),
            ).map((m) => (
              <MerchantCard
                key={m.vat}
                vat={m.vat}
                businessName={m.businessName}
                sector={m.sector}
                city={m.city}
                tagline={m.tagline}
                description={m.description}
                image={m.image}
                teamCount={m.team.length}
                href={merchantStorefrontHref(m)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="search" className="border-y border-zinc-200/80 bg-white py-14">
        <div className="mx-auto w-full max-w-6xl px-5">
          <UserControlledSearch initialQuery="Podologist" />
        </div>
      </section>

      <section id="practitioners" className="py-14">
        <div className="mx-auto w-full max-w-6xl px-5">
          <h2 className="text-2xl font-semibold text-zinc-900">
            👤 Individual Practitioner Dossiers (Linked to Parent Clinics)
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            These profiles are not primary directory results. Each card is
            nested under its parent VAT merchant and appears in that clinic&apos;s
            Doctors &amp; Specialists tab.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {practitioners.map((p) => {
              const parent = MERCHANT_CATALOG.find((m) => m.vat === p.parentVat);
              return (
                <Link
                  key={p.id}
                  href={practitionerProfileHref(p)}
                  className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none transition hover:border-zinc-400"
                >
                  <div className="flex gap-3">
                    <div
                      className="h-14 w-14 shrink-0 rounded-xl bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${p.headshotUrl}")`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        Via {parent?.businessName ?? p.parentVat}
                      </p>
                      <h3 className="mt-0.5 text-lg font-semibold text-zinc-900">
                        {p.fullName}
                      </h3>
                      <p className="text-sm text-zinc-600">{p.title}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">
                    Staff id <span className="font-mono">{p.id}</span> · slug{" "}
                    <span className="font-mono">{p.slug}</span>
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-none">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Harbor Wellness Clinic · staff sync
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                team: [&apos;dr-amir-saeed&apos;, &apos;dr-noa-klein&apos;]
              </code>{" "}
              → storefront Doctors tab at{" "}
              <Link
                href="/IL-CLINIC-001#catalog"
                className="font-semibold text-zinc-900 underline-offset-2 hover:underline"
              >
                /IL-CLINIC-001
              </Link>
            </p>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {teamForMerchant(
                MERCHANT_CATALOG.find((m) => m.vat === "IL-CLINIC-001")!,
              ).map((p) => (
                <li key={p.id}>
                  • {p.fullName} →{" "}
                  <Link
                    href={practitionerProfileHref(p)}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    /{p.parentVat}/p/{p.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200/80 py-10 text-center text-sm text-zinc-500">
        <Link href="/" className="font-medium text-zinc-800 hover:underline">
          ← Back to platform home
        </Link>
      </footer>
    </main>
  );
}
