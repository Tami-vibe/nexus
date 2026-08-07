# Nexus OS — Completion Roadmap

Core engine, agents, and per-tenant brand kits, in build order. Each phase lists what exists today, what's missing, and the concrete change.

---

## Phase 0 — Foundation decisions (blocks everything else)

**Auth/DB.** Master plan specifies Supabase-managed Postgres with RLS tied to `auth.jwt()`. Code uses a raw `pg` pool (`src/lib/db.ts`) and a custom JWT lib (`src/lib/auth/jwt.ts`) — no `@supabase/supabase-js` dependency exists. Pick one:
- Migrate to Supabase (adopt their auth + RLS as designed), or
- Formalize the custom pg + JWT path and drop Supabase from the plan/env vars.
Do this before building anything else on top of auth — brand kits, agents, and billing all need a settled identity layer.

**Payments.** `src/lib/payments/provider.ts` defaults to `MockPaymentProvider` whenever `STRIPE_SECRET_KEY` is unset — which is always, today. Get one tenant running real Stripe test-mode charges end to end before polishing anything downstream.

---

## Phase 1 — Real merchant identity & publishing

**Problem, confirmed in code:** `tenants` (migration `001_phase1_core.sql`) has no web-address field — only `vat_number`. `src/middleware.ts` maps exactly three hardcoded hostnames (`ironforge.localhost`, `lumen.localhost`, `harbor.localhost`) to VATs. There is no real way for a new merchant to get a working web address.

- Add `slug VARCHAR(63) UNIQUE` to `tenants` (new migration `013_tenant_slug.sql`), generated from `business_name` at onboarding, editable once.
- Replace `HOST_VAT_MAP` in `middleware.ts` with a DB/cache lookup: `slug` (or full hostname minus root domain) → `vat_number`.
- Provision wildcard subdomain routing (`{slug}.nexusos.app`) — wildcard DNS + wildcard SSL if hosting on Vercel, their domains API handles cert issuance per subdomain.
- Custom domain connect (bring-your-own-domain) — separate, later, paid-tier feature. Needs domain verification (TXT record) + Vercel domain API call.

---

## Phase 2 — Brand kit engine

**Problem, confirmed in code:** `.cursorrules` enforces one fixed brand (Monochrome + Clementine `#FF5E1A`) across every tenant. `tenants` / `tenant_profiles` have zero columns for palette, font, or imagery mood. Every vertical — gym, clinic, artisan — renders identically.

- Split tokens into two layers:
  - **Structural tokens** (stay in `.cursorrules`, platform-wide, fixed): spacing scale, button/pill shapes, card radius, contrast rules, no-shadow rule.
  - **Brand tokens** (new, per-tenant, variable): palette, font pairing, imagery mood tag.
- New table `brand_kits`: `id`, `name`, `vertical_tags TEXT[]`, `tone_tags TEXT[]`, `palette_json JSONB`, `font_pairing JSONB`, `imagery_mood TEXT`. Seed with 20–40 hand-reviewed kits (not model-generated) covering the existing sectors (`GYM`, `SALON`, `CLINIC`, `POOL`, `RETAIL`, `ARTISAN`, `DIGITAL`, `CONSULTING`) crossed with 2–3 tone variants each.
- Add `brand_kit_id UUID REFERENCES brand_kits(id)` to `tenants`.
- Onboarding classification step: infer sector (already captured) + tone (from a short onboarding question or business description) → select best-matching kit. Rule-based lookup first — no model call needed for v1.
- Refactor storefront components (`src/components/storefront/*`, `Header.tsx`, `Footer.tsx`, offer/checkout components) to read color/font values from the tenant's `brand_kit` at render time instead of the hardcoded Clementine/monochrome constants in `globals.css`.
- Extend the existing category-matched imagery pattern — `offerCoverFallback` and the category media pools already used in `buildOfferDetail` for the offers hub — to hero/brand imagery, keyed to `imagery_mood` instead of a generic stock query.
- Section-scoped re-theme: a merchant action like "make this warmer" should update only that section's token references, not trigger a full re-render. Build this after the base kit system is live, not before.

---

## Phase 3 — Honest onboarding + the checklist UI

**Problem, confirmed in code:** `src/app/api/onboarding/vat/route.ts` inserts a tenant with hardcoded defaults (`'Tel Aviv'`, a fixed Unsplash stock photo, a generic tagline) — no actual registry lookup or Google Maps scrape happens despite the "Magic VAT" framing.

- Either build the real auto-fill (business registry API + Google Places/Maps lookup for name, address, hours, photos, rating), or replace the "magic" framing with an honest short form (5–6 fields) that also captures the tone input needed for Phase 2's brand-kit match.
- Build the dashboard checklist: claim business → confirm details → pick/confirm brand kit → add first product or service → connect payment → preview site → go live → connect Google Business Profile → first booking. One clear next action always surfaced (mirrors the pattern in `MerchantDashboard.tsx`'s existing structure), progress bar, checklist collapses after go-live.

---

## Phase 4 — SEO basics

Already built: Schema.org `@graph` injection and `/api/ai-manifest` for generative-search retrieval (`src/lib/seo/jsonld.ts`). Missing, and needed for standard Google indexing:
- `src/app/sitemap.ts` and `src/app/robots.ts` (Next.js file conventions — currently absent, confirmed by search).
- Per-page `generateMetadata` (title/description) on `app/[vat]/page.tsx`, `app/[vat]/p/[slug]/page.tsx`, and `app/offers/[slug]/page.tsx` — currently no dynamic metadata found in those routes.
- Google Business Profile connect flow, surfaced as a checklist item — highest-leverage single action for local-business discoverability, more so than the website itself.

---

## Phase 5 — Agents

**Customer agent (harden what exists).** `src/lib/agent/provider.ts` already has a mock state-machine and an OpenAI-compatible tool-calling path, gated by `OPENAI_API_KEY`. Harden before adding scope: real key wiring per environment, explicit error states instead of silent mock fallback in production, tool-call reliability testing against `AGENT_TOOLS` schema.

**Merchant agent (new).** A chat surface inside `app/merchant/dashboard`, scoped strictly to Nexus's own data — no external inbox/calendar connections. Needs:
- New route, e.g. `src/app/api/merchant/agent/route.ts`, reusing the existing tool-calling pattern from `src/lib/agent/`.
- A narrow, fixed tool set: `get_bookings_today`, `get_hot_leads`, `get_capacity_status`, `send_broadcast` (wraps the existing `crm/broadcast` engine) — no open-ended action-taking.
- Dashboard sidebar entry point, alongside `Workflows`/`Data`-equivalent sections.

**Channel expansion (WhatsApp for the customer agent).** Sequence last — Meta Business verification and template-message approval is a multi-week process, not a toggle. Don't schedule alongside the above.

---

## Phase 6 — Narrow pilot launch

- Pick one vertical to launch first — services/booking (gym/salon/clinic) is the most complete build today.
- Onboard 5–10 real merchants manually through Phases 1–4 before opening self-serve signup.
- Instrument from day one: which brand kit was assigned vs. which the merchant changed, and where onboarding drop-off happens. This data is the prerequisite for Phase 7 — skip it and there's nothing to train on later.

---

## Phase 7 — Scale infrastructure (after the pilot proves out)

- Wildcard SSL + name-abuse handling for free subdomains at volume.
- Bring-your-own-domain as a paid upgrade.
- Only once Phase 6 telemetry exists: consider a small classifier or fine-tuned model for brand-kit selection, trained on real "prompt/sector → kept kit" pairs — the Base One playbook, applied to a narrower problem, once there's real data to train on. Not before.

---

## Sequencing notes

- Phase 0 blocks all of it — don't build brand kits or agents on an auth layer that's still ambiguous.
- Phase 2 (brand kits) and Phase 3 (onboarding) are coupled — kit selection is a step inside onboarding, build them together.
- Phase 5 (agents) and Phase 4 (SEO) are independent of each other and can run in parallel once Phases 0–3 are done.
- Phase 6 gates Phase 7 — no scale work until there's a working pilot with real merchants and real telemetry.
