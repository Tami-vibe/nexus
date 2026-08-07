"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/demos", label: "Live demos" },
  { href: "/offers", label: "Introductory Offers" },
  { href: "/hotels", label: "Hotels" },
  { href: "/restaurants", label: "Dining" },
  { href: "/demos#search", label: "Directory search" },
];

/**
 * Platform header — merchants-first nav with Introductory Offers → /offers.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200/80 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-900"
        >
          Nexus OS
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium sm:gap-2">
          {NAV.map((item) => {
            const active =
              item.href === "/offers"
                ? pathname === "/offers"
                : pathname.startsWith(item.href.split("#")[0]!);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 transition ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/merchant/dashboard?vat=IL-CLINIC-001"
            className="ml-1 rounded-xl border border-zinc-200 px-3 py-2 text-zinc-800 hover:bg-zinc-50"
          >
            Merchant portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
