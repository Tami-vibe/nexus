"use client";

import { usePathname } from "next/navigation";
import { OnboardingModal } from "@/components/OnboardingModal";

/**
 * Global first-visit onboarding for platform routes (not merchant storefronts).
 */
export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isMerchantStorefront =
    /^\/IL-[A-Z0-9-]+/i.test(pathname) ||
    /^\/IT-[A-Z0-9-]+/i.test(pathname) ||
    pathname.startsWith("/merchant");

  return (
    <>
      {children}
      {!isMerchantStorefront ? <OnboardingModal /> : null}
    </>
  );
}
