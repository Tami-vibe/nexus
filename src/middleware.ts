import { NextResponse, type NextRequest } from "next/server";
import { CONSENT_COOKIE, parseConsentCookie } from "@/lib/gdpr/consent";

const HOST_VAT_MAP: Record<string, string> = {
  "ironforge.localhost": "IL-GYM-001",
  "lumen.localhost": "IL-SALON-001",
  "harbor.localhost": "IL-CLINIC-001",
};

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const consent = parseConsentCookie(req.cookies.get(CONSENT_COOKIE)?.value);

  // GDPR: block non-essential client storage markers when consent absent
  res.headers.set("X-Nexus-Consent-Analytics", consent.analytics ? "1" : "0");
  res.headers.set("X-Nexus-Consent-Marketing", consent.marketing ? "1" : "0");
  // Next.js App Router needs 'unsafe-eval' for client hydration (esp. webpack/dev).
  // Without it, SSR HTML renders but React never attaches — all buttons appear dead.
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: https: blob:",
      "style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' ws: wss: http://localhost:* https://api.openai.com https://api.stripe.com https://*.tile.openstreetmap.org https://unpkg.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "worker-src 'self' blob:",
    ].join("; "),
  );
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");

  // Phase 4 launch seam: custom host → VAT rewrite
  const host = req.headers.get("host")?.split(":")[0] ?? "";
  const vat = HOST_VAT_MAP[host];
  if (vat && req.nextUrl.pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = `/${vat}`;
    return NextResponse.rewrite(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
