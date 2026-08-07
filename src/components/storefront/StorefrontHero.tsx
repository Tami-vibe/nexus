import type { TenantBundle } from "@/types";
import { merchantHeroImage } from "@/lib/commerce/media";
import { HeroAvailabilityBadge } from "@/components/storefront/HeroAvailabilityBadge";
import { ProximityBadge } from "@/components/storefront/ProximityBadge";

export function StorefrontHero({ tenant }: { tenant: TenantBundle }) {
  const profile = tenant.profile;
  const image = merchantHeroImage({
    sector: tenant.sector,
    hero_image_url: tenant.hero_image_url,
    profile_image_url: profile?.image_url,
  });

  return (
    <section className="relative min-h-[78vh] overflow-hidden text-white md:min-h-[86vh]">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
        aria-hidden
      />

      <div className="nx-container relative z-10 flex min-h-[78vh] flex-col justify-end pb-12 pt-24 md:min-h-[86vh] md:pb-14">
        <p className="nx-rise text-xs font-bold uppercase tracking-[0.16em] text-white">
          {tenant.business_name}
        </p>
        <h1 className="nx-display nx-rise nx-rise-delay-1 mt-4 max-w-3xl text-5xl text-white md:text-7xl">
          {tenant.tagline || "Commerce that feels effortless."}
        </h1>
        <p className="nx-rise nx-rise-delay-2 mt-5 max-w-xl text-lg text-white md:text-xl">
          {profile?.description ||
            "Shop products, book services, and talk to an AI sales representative — instantly."}
        </p>

        <div className="nx-rise nx-rise-delay-3 mt-6 flex flex-wrap items-center gap-3">
          <ProximityBadge
            latitude={profile?.latitude}
            longitude={profile?.longitude}
          />
          {profile?.rating != null ? (
            <span className="nx-pill border border-white/30 !bg-white/10 !text-white">
              {profile.rating.toFixed(1)} ★ · {profile.review_count} reviews
            </span>
          ) : null}
          <HeroAvailabilityBadge
            vat={tenant.vat_number}
            sector={tenant.sector}
            walkInEnabled={tenant.walk_in_enabled}
            serviceSlotsOpen={Math.max(tenant.services.length * 2, 3)}
          />
          {profile?.city ? (
            <span className="text-sm font-medium text-white">
              {profile.address ? `${profile.address} · ` : ""}
              {profile.city}
            </span>
          ) : null}
        </div>

        <div className="nx-rise nx-rise-delay-3 mt-8 flex flex-wrap items-center gap-3">
          <a href="#catalog" className="nx-btn nx-btn-accent">
            Book Open Slot
          </a>
          <a href="#catalog" className="nx-btn nx-btn-hero-outline">
            Explore Team & Services
          </a>
        </div>
      </div>
    </section>
  );
}
