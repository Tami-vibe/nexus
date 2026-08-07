"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MockOfferCategory } from "@/data/mockOffers";

export type CategoryBentoItem = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
  spanClass: string;
  /** Hub filter category when used with onSelectCategory. */
  category: Exclude<MockOfferCategory, "all">;
};

/**
 * Asymmetrical 3-row bento — 2+1 / 1+2 / 1+1+1 — fully filled at md+.
 * Imagery: Unsplash CDN (local `/images/bento/*` can replace later).
 */
export const CATEGORY_BENTO_ITEMS: CategoryBentoItem[] = [
  {
    id: "spa",
    badge: "SPA & WELLNESS",
    title: "Spa & Recovery Intros",
    subtitle: "First-visit wellness rates",
    imageSrc:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    href: "/offers?category=clinic",
    spanClass: "md:col-span-2",
    category: "clinic",
  },
  {
    id: "beauty",
    badge: "BEAUTY & PMU",
    title: "Beauty & PMU",
    subtitle: "Verified aesthetic tiers",
    imageSrc:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
    href: "/offers?category=beauty",
    spanClass: "md:col-span-1",
    category: "beauty",
  },
  {
    id: "aesthetics",
    badge: "AESTHETICS",
    title: "Aesthetics & Skin",
    subtitle: "Editorial skin intros",
    imageSrc:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
    href: "/offers?category=beauty",
    spanClass: "md:col-span-1",
    category: "beauty",
  },
  {
    id: "medical",
    badge: "MEDICAL",
    title: "Medical & Specialists",
    subtitle: "Certified MDs nearby",
    imageSrc:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop",
    href: "/offers?category=clinic",
    spanClass: "md:col-span-2",
    category: "clinic",
  },
  {
    id: "fitness",
    badge: "FITNESS",
    title: "Fitness & Body",
    subtitle: "Kickstart sessions",
    imageSrc:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    href: "/offers?category=fitness",
    spanClass: "md:col-span-1",
    category: "fitness",
  },
  {
    id: "recovery",
    badge: "RECOVERY",
    title: "Recovery Studio",
    subtitle: "Post-session care",
    imageSrc:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
    href: "/offers?category=clinic",
    spanClass: "md:col-span-1",
    category: "clinic",
  },
  {
    id: "hair",
    badge: "HAIR & STYLING",
    title: "Hair & Salon Suites",
    subtitle: "Color, cut & treatments",
    imageSrc:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
    href: "/offers?category=beauty",
    spanClass: "md:col-span-1",
    category: "beauty",
  },
];

export type CategoryBentoGridProps = {
  /** When set, cards filter the hub catalogue instead of navigating. */
  onSelectCategory?: (category: Exclude<MockOfferCategory, "all">) => void;
  className?: string;
};

function CategoryBentoCard({
  item,
  onSelectCategory,
}: {
  item: CategoryBentoItem;
  onSelectCategory?: CategoryBentoGridProps["onSelectCategory"];
}) {
  const sharedClass = `group relative h-[220px] overflow-hidden rounded-2xl border border-zinc-200/60 text-left shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${item.spanClass}`;

  const inner = (
    <>
      <Image
        src={item.imageSrc}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />
      {/* Focused bottom-third gradient — preserves editorial mid/top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:opacity-95" />

      <div className="absolute left-4 top-4 z-10">
        <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
          {item.badge}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-0.5">
        <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-emerald-300">
          {item.title}
        </h3>
        <p className="flex items-center gap-1 text-xs font-medium text-zinc-300">
          {item.subtitle}
          <ArrowRight
            className="h-3.5 w-3.5 text-emerald-400 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </p>
      </div>
    </>
  );

  if (onSelectCategory) {
    return (
      <button
        type="button"
        onClick={() => onSelectCategory(item.category)}
        className={`${sharedClass} cursor-pointer`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={item.href} className={sharedClass}>
      {inner}
    </Link>
  );
}

/**
 * Pixel-balanced category bento: Spa(2)+Beauty(1) · Aesthetics(1)+Medical(2) ·
 * Fitness(1)+Recovery(1)+Hair(1).
 */
export function CategoryBentoGrid({
  onSelectCategory,
  className = "",
}: CategoryBentoGridProps) {
  return (
    <section className={`w-full ${className}`}>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
        {CATEGORY_BENTO_ITEMS.map((cat) => (
          <CategoryBentoCard
            key={cat.id}
            item={cat}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    </section>
  );
}

export default CategoryBentoGrid;
