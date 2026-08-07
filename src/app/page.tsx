import Link from "next/link";
import { Header } from "@/components/Header";
import { MagicVatOnboarding } from "@/components/marketing/MagicVatOnboarding";
import { merchantHeroImage } from "@/lib/commerce/media";
import { listTenants } from "@/lib/tenants";
import type { Sector, TenantBundle } from "@/types";

export const dynamic = "force-dynamic";

type DemoLink = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  live?: boolean;
};

type DemoCategory = {
  id: string;
  label: string;
  blurb: string;
  items: DemoLink[];
};

const SECTOR_ORDER: Sector[] = [
  "CLINIC",
  "GYM",
  "SALON",
  "ARTISAN",
  "CONSULTING",
  "DIGITAL",
  "POOL",
  "RETAIL",
];

const SECTOR_META: Partial<
  Record<Sector, { label: string; blurb: string }>
> = {
  CLINIC: {
    label: "Clinic & Medical",
    blurb: "Same-day consults, verified licenses, multi-location physicians.",
  },
  GYM: {
    label: "Fitness & Training",
    blurb: "Live capacity, coaches, trial sessions.",
  },
  SALON: {
    label: "Salon & Beauty",
    blurb: "Appointment-first stylists and transparent beauty pricing.",
  },
  ARTISAN: {
    label: "Artisan & Studio",
    blurb: "Commissions, workshop visits, guild-style credentials.",
  },
  CONSULTING: {
    label: "Legal & Counsel",
    blurb: "Bar-accredited strategy counsel and confidential booking.",
  },
  DIGITAL: {
    label: "Digital & Brand",
    blurb: "Launch kits and async creative direction.",
  },
};

function merchantCard(t: TenantBundle): DemoLink {
  return {
    href: `/${t.vat_number}`,
    eyebrow: t.sector + (t.walk_in_enabled ? " · Live walk-in" : ""),
    title: t.business_name,
    description: t.tagline || t.profile?.description || "",
    image: merchantHeroImage({
      sector: t.sector,
      hero_image_url: t.hero_image_url,
      profile_image_url: t.profile?.image_url,
    }),
    live: t.walk_in_enabled,
  };
}

/** Merchant directory only — practitioners live under /demos#practitioners. */
function buildCategories(demos: TenantBundle[]): DemoCategory[] {
  const bySector = new Map<Sector, TenantBundle[]>();
  for (const t of demos) {
    const list = bySector.get(t.sector) ?? [];
    list.push(t);
    bySector.set(t.sector, list);
  }

  const categories: DemoCategory[] = [];

  for (const sector of SECTOR_ORDER) {
    const tenants = bySector.get(sector);
    if (!tenants?.length) continue;
    const meta = SECTOR_META[sector] ?? {
      label: sector,
      blurb: "Live merchant storefront.",
    };

    categories.push({
      id: sector.toLowerCase(),
      label: meta.label,
      blurb: meta.blurb,
      items: tenants.map(merchantCard),
    });
  }

  return categories;
}

function DemoCard({ item }: { item: DemoLink }) {
  return (
    <Link
      href={item.href}
      className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-none transition hover:border-zinc-400"
    >
      <div
        className="aspect-[16/10] bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
        style={{
          backgroundImage: `url("${item.image}")`,
          backgroundColor: "#09090B",
        }}
      />
      <div className="p-5">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {item.live ? <span className="nx-pulse-dot" aria-hidden /> : null}
          {item.eyebrow}
        </p>
        <h3 className="mt-1 text-xl font-semibold text-zinc-900">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

export default async function PlatformHome() {
  let demos: Awaited<ReturnType<typeof listTenants>> = [];
  try {
    demos = await listTenants();
  } catch {
    demos = [];
  }

  const categories = buildCategories(demos);

  return (
    <main>
      <Header />

      <section className="nx-container grid items-center gap-12 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="nx-eyebrow nx-rise">Autonomous commerce platform</p>
          <h1 className="nx-display nx-rise nx-rise-delay-1 mt-4 text-5xl md:text-7xl">
            Products. Appointments. Walk-ins. One living storefront.
          </h1>
          <p className="nx-rise nx-rise-delay-2 mt-6 max-w-xl text-lg text-[var(--muted)]">
            Replace static site builders and CRM busywork. Nexus sells with an AI
            agent, books services, moves inventory, and syncs every signal into a
            visual merchant CRM.
          </p>
          <div className="nx-rise nx-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <a href="#onboard" className="nx-btn nx-btn-accent">
              Try Magic VAT onboarding
            </a>
            <Link href="/demos" className="nx-btn nx-btn-ghost">
              View live demos
            </Link>
          </div>
        </div>
        <div
          className="nx-rise nx-rise-delay-2 relative min-h-[420px] overflow-hidden rounded-[28px] border border-zinc-200/80 shadow-none"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/25 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              Outcome pages
            </p>
            <p className="nx-display mt-2 text-3xl text-white">
              Trust-grade storefronts that convert before a human ever answers.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="nx-container grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Sell anything",
              body: "Physical goods, digital kits, handcrafts — 1-click checkout wired to Stripe Connect.",
            },
            {
              title: "Book anyone",
              body: "Doctors, consultants, artisans, and salons get appointment slots that sync to CRM.",
            },
            {
              title: "Fill the floor",
              body: "Walk-in capacity for gyms and pools when you need it — never the whole product.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-zinc-200/80 bg-[var(--paper)] p-7 shadow-none"
            >
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                {item.title}
              </h2>
              <p className="mt-3 text-[var(--muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="onboard"
        className="nx-container grid gap-10 py-20 lg:grid-cols-2"
      >
        <div>
          <p className="nx-eyebrow">Merchant portal</p>
          <h2 className="nx-display mt-3 text-4xl md:text-5xl">
            From VAT to live storefront in sixty seconds
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            Preview the Magic VAT flow. In production this hydrates registry data,
            Maps imagery, hours, and an AI agent automatically.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-[var(--ink-soft)]">
            <li>• Unified CRM for leads, orders, appointments, and chat</li>
            <li>• AI sales representative that cannot invent prices</li>
            <li>• Modular auth, GDPR, and Stripe wrap-arounds</li>
          </ul>
        </div>
        <MagicVatOnboarding />
      </section>

      <section id="demos" className="border-t border-zinc-200/80 bg-white py-20">
        <div className="nx-container">
          <p className="nx-eyebrow">Merchant directory</p>
          <h2 className="nx-display mt-3 text-4xl">
            Explore real business storefronts
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Businesses first — clinics, studios, and shops. Practitioner dossiers
            stay linked under each parent VAT (see the full demos page).
          </p>
          <Link
            href="/demos"
            className="nx-btn nx-btn-accent mt-5 inline-flex !py-2.5 text-sm"
          >
            Open demos · search & staff dossiers
          </Link>

          {/* Category jump nav */}
          <nav
            className="mt-8 flex flex-wrap gap-2"
            aria-label="Demo categories"
          >
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#demo-${cat.id}`}
                className="rounded-full border border-zinc-200 bg-transparent px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                {cat.label}
              </a>
            ))}
          </nav>

          <div className="mt-12 space-y-16">
            {categories.map((cat) => (
              <div key={cat.id} id={`demo-${cat.id}`}>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200/80 pb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-900">
                      {cat.label}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">{cat.blurb}</p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                    {cat.items.length} pages
                  </p>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map((item) => (
                    <DemoCard key={item.href + item.title} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="nx-container flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/80 py-10 text-sm text-[var(--muted)]">
        <p>Nexus OS — autonomous local commerce</p>
        <Link href="/merchant/dashboard?vat=IL-GYM-001">Open sample CRM</Link>
      </footer>
    </main>
  );
}
