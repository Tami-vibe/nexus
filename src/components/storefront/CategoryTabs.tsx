"use client";

import { useEffect, useState } from "react";

const TABS = [
  { id: "all", href: "#catalog", label: "All Offers" },
  { id: "products", href: "#products", label: "Products & Handcrafts" },
  { id: "services", href: "#services", label: "Appointments & Services" },
] as const;

export function CategoryTabs({
  hasProducts,
  hasServices,
}: {
  hasProducts: boolean;
  hasServices: boolean;
}) {
  const [active, setActive] = useState<string>("all");

  const tabs = TABS.filter((t) => {
    if (t.id === "products") return hasProducts;
    if (t.id === "services") return hasServices;
    return hasProducts || hasServices;
  });

  useEffect(() => {
    const ids = ["catalog", "products", "services"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [hasProducts, hasServices]);

  if (!tabs.length) return null;

  return (
    <nav
      id="catalog"
      aria-label="Offer categories"
      className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/95 backdrop-blur-md"
    >
      <div className="nx-container flex gap-2 overflow-x-auto py-3">
        {tabs.map((tab) => {
          const isActive =
            active === tab.id ||
            (tab.id === "all" && active === "catalog");
          return (
            <a
              key={tab.id}
              href={tab.href}
              onClick={() => setActive(tab.id === "all" ? "catalog" : tab.id)}
              className={`nx-tab ${isActive ? "nx-tab-active" : "nx-tab-idle"}`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
