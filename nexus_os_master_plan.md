# NEXUS OS: AUTONOMOUS COMMERCE & CAPACITY ENGINE
> **Product Requirements Document (PRD) & Technical Master Architecture**
> *Replacing legacy CRMs and static site builders with autonomous, zero-friction local commerce.*

---

## 1. EXECUTIVE SUMMARY & MISSION

Current tools like Salesforce, HubSpot, and Wix are **static filing cabinets and design templates**. They require constant manual data entry, human operations, and complex setup. 

**Nexus OS** is an **Autonomous Commerce System** designed for local businesses, services, and multi-tenant franchises (gyms, salons, clinics, pools, co-working spaces). It eliminates operational overhead by combining:
1. **Sub-second Edge Landing Pages** optimized for local AI search crawlers.
2. **Ambient Capacity Tracking** (POS webhooks + predictive ML fallbacks).
3. **Atomic Real-Time Reservation Engines** (preventing wait times and double-booking).
4. **Autonomous AI Sales Representatives** (qualifying leads and guiding instant 1-tap payments).

---

## 2. CORE ARCHITECTURE OVERVIEW

```
                          ┌──────────────────────────────────────────────────┐
                          │               NEXUS EDGE ROUTER                  │
                          │   Dynamic DNS & Edge Multi-Tenant Routing        │
                          └────────────────────────┬─────────────────────────┘
                                                   │
                ┌──────────────────────────────────┴──────────────────────────────────┐
                ▼                                                                     ▼
┌──────────────────────────────────────┐                           ┌──────────────────────────────────────┐
│       1. HIGH-OUTCOME FRONTEND       │                           │      2. LIVE RECEPTION & TRAFFIC     │
│   Next.js 15 SSR + Dynamic Visuals   │                           │    POS Webhooks / Edge WiFi Probes   │
│  Auto-Generated "Outcome" Layouts    │                           │  Real-Time Occupancy WebSocket Feed  │
└──────────────────┬───────────────────┘                           └──────────────────┬───────────────────┘
                   │                                                                  │
                   └──────────────────────────────────┬───────────────────────────────┘
                                                      │
                                                      ▼
                                   ┌──────────────────────────────────────┐
                                   │       3. AI VOICE & CHAT AGENT       │
                                   │ Dynamic Qualification & Voice Engine │
                                   │   State Machine & Multi-Intent RAG   │
                                   └──────────────────┬───────────────────┘
                                                      │
                                                      ▼
                                   ┌──────────────────────────────────────┐
                                   │     4. MULTI-TENANT CORE & UTILITY   │
                                   │   Supabase RLS (VAT Isolation) + API │
                                   │ One-Click Checkout & Merchant Payout │
                                   └──────────────────────────────────────┘
```

---

## 3. TECHNICAL SPECIFICATIONS BY PILLAR

### Unified Storefront Architecture (Mandatory)

Every merchant route (`app/[vat]/...`) MUST render this vertical composition — no orphan sections, no empty visual chasms, no hover states that invert contrast incorrectly:

1. **Hero Header** — Dynamic background overlay, crisp white typography, proximity/rating pills, **one** Clementine CTA (`Book` / `Reserve` / `Buy`) + monochrome secondary Explore. Live capacity as inline pill (`🟢 Live Studio Capacity: N Spots`) — never a floating footer bubble.
2. **Value & Trust Ribbon (Below Hero)** — Stockholm borderless grid (`bg-zinc-50/60`, `border-y border-zinc-200/60`): 🛡️ Verified Merchant · ⚡ Instant Reservation · ⭐ Top Rated · 📍 Nearby Location.
3. **Tabbed Discovery Hub** — `[ Services & Consults ]` · `[ Doctors & Specialists ]` · `[ Products & Kits ]` in one interactive panel (no infinite vertical catalog). Adaptive grid + detail drawers + anti-PPC demand badges. Practitioner roster links to `/{vat}/p/{slug}` **multi-industry professional dossiers** via `<ProfessionalBento/>` (`medical` · `artisan` · `trainer` · `legal` · `educator`) — category-adaptive Apple bento (philosophy, specialties/materials/practice areas, career timeline, industry accreditation seal, deliverables) plus booking — no LinkedIn required.
4. **Live Proximity & Location Hub** — Leaflet canvas with invalidateSize/OSM tiles, OR high-contrast location card (storefront photo + live ETA + Open Navigation) — never a blank white box.
5. **Universal Footer Engine** — Complete site footer with operational details (hours, address, VAT ID), map link, GDPR consent controls, and Nexus OS platform badge.
6. **GEO / AI Manifest** — Schema.org `@graph` (LocalBusiness, MedicalClinic, Product, Offer, AggregateRating) in SSR HTML + live `/api/ai-manifest?vat=` for generative search agents.
7. **CRM Broadcast Engine** — 1-click Instagram/TikTok story graphics + open-slot SMS/email ping to hot leads when same-day capacity &lt; 3.
8. **Apple-grade Outcome Cards** — Patient/guest reviews are self-contained bento cards (headshot + verified badge + quote + stars + video thumb). Quotes must never float unanchored. Practitioner profiles are a separate entity with warm professional marketing tone (never cold regulatory / “police-like” compliance copy). Trust language is industry-matched (Medical registry · Albo Artigiani · Bar Association · Certified Specialist).
9. **Media Framing** — All offer imagery uses fixed aspect ratios + `object-cover` inside `rounded-2xl` overflow-hidden frames. **Shadowless** — depth via `border-zinc-200/80` + whitespace only (Stockholm / 2027 Apple HIG).
10. **Multi-Industry Profile Engine** — `MultiProfessionalDossier` (`category`, `vatTaxId`, `accreditationBadge`, `specialties`, `careerHistory`, `deliverablesSummary`) + legacy `PractitionerDossier` / `CredentialLicense` rendered through `<ProfessionalBento/>`. Government licenses appear **once** as `<CompactLicenseBadge/>` (via `<VerifiedCredentials/>`) — ultra-compact 1-line ribbon, light/borderless Stockholm, no dark seal duplication. Categories: medical, artisan, trainer, legal, educator.
11. **Market Benchmark Card** — `<MarketBenchmark/>` comparison index with **license-accurate** role badges via `resolveRoleBadge()` (MD → Attending Physician / Specialist MD; PT → Licensed Senior Physiotherapist; Podiatrist → Licensed Podiatrist; Legal → Senior Counsel — never “Artist” on a physician, never Attending Physician on a PT), experience years, verified client volume, regional price band, and **exactly one** Clementine Book CTA per card.
12. **Stockholm Button Hierarchy** — Buttons (`rounded-xl`) for actions; pills (`rounded-full` zinc) for tags/time filters. One Clementine CTA per section.
13. **Multi-Location Practice Engine** — Traveling professionals (`PracticeLocation[]` + `activeLocationId`) render `<LocationSwitcher/>` on `/{vat}/p/{slug}`. Switching a node updates address, map pin, distance, and calendar slots. All practice cities are indexed in `/api/ai-manifest` for GEO search (e.g. “Physio Herzliya”).
14. **Demo comparison routes** — `/compare/microblading` (3-tier Microblading market compare) and `/p/dott-marco-riva` (Italy multi-location podologist: Milan · Piemonte ASL · Genova) seeded from `src/data/mockComparisons.ts`.
15. **Insurance Mapping & New Patient Offers (Yellow Pages layer)** — Practitioners carry `InsuranceNetwork[]`, `IntroPassCoupon[]` (data), and `hasWheelchairAccess` in `benefits_json`. Discovery Hub Doctors tab uses `<DirectoryFilterBar/>` (`ExtendedFilterState`: insurance, languages, wheelchair, new-patient-rates filter). Profiles render `<NewPatientOfferCard/>` (struck list price, appointment slots open this week, refund guarantee, one Clementine **Book Consultation** CTA). Medical/regulated first-visit rates MUST show a 100% refund-if-non-candidate clause (COMPLIANCE RULE). UI copy follows PROFESSIONAL LANGUAGE RULE — no “intro pass / claim voucher / passes left” theatre.
16. **Merchants-First Directory Hierarchy** — Primary entity is always the registered Business/Clinic (`src/data/merchants.ts`). Practitioners attach via `team` ids (e.g. Harbor `['dr-amir-saeed','dr-noa-klein']` → slugs `amir-saeed` / `noa-klein` on `IL-CLINIC-001`). Demos at `/demos` show business cards first; individual dossiers sit under **Individual Practitioner Dossiers (Linked to Parent Clinics)**. `<UserControlledSearch/>` defaults to clinic/studio cards; users opt into **View Specialists Nearby** to extract staff from matched parents only. Homepage `#demos` lists merchants only — no orphan practitioner cards in the merchant grid.
17. **Professional Medical & Legal Vocabulary** — Role badges and education lines use plain-language credentials (`Doctor of Physical Therapy (DPT)`, `Certified Strength & Conditioning Specialist (CSCS)`, `Dry Needling Therapy (Musculoskeletal Pain)`). `expandCredentialLabel()` + seed dossiers keep patient-facing copy unambiguous.
18. **Offers Hub & Smart Onboarding** — Dedicated `/offers` discovery engine: full-bleed `<HeaderNav/>` + `<CategoryRibbon/>` (100% viewport scroll + mask fade, bold pill typography, live count badges, inline **Savings** filter All/30%+/50%+/70% with Clementine active — NAV RIBBON & DISCOUNT FILTER RULE). Filters catalogue by `activeCategory` ∧ `discountPercent >= minDiscount`. Editorial `<CategoryBentoGrid/>` (7-card asymmetrical: 2+1 / 1+2 / 1+1+1 including **Hair & Salon Suites**), trending rail, hospitality verticals (`/hotels`, `/restaurants`). Cards: category-aware CTAs, Lucide heart (white circle + black outline idle). `<OnboardingModal/>` gated by `nexus_onboarded_v1`.
19. **High-Conversion Offer PDP** — `/offers/[slug]`: gallery → title pills → `<OfferDetailsTabbedSection/>` + category UX map. Plan options via `<OfferOptionsAccordion/>` (single-expand selling engine; collapsed cards stay informative with Select & View + badgeTag nudges). Dynamic `inclusions[]` + `upsell?`. Sticky checkout syncs live totals.
20. **UI Design System Seed** — `src/components/ui/` (`AdaptiveContainer`, `DatePicker`) + `src/components/home/CategoryBentoGrid.tsx` + `src/components/offers/` (`PremiumOfferCardWrapper`, `OfferOptionsAccordion`, `OfferOptionCard`, `DualBookingEngine`, `OfferInclusionsGrid`) + `src/components/checkout/CheckoutStepHeader.tsx` + `src/config/categoryUX.ts`. Global tokens in `globals.css`.
21. **Category-Aware UX Copy** — Resolve vertical via `resolveCategoryType(offer)` so tabs/headers/gift/upsell auto-adapt.
22. **Offer Options Accordion Engine** — `OfferOptionsAccordion`: one active option at a time via `<PremiumOfferCardWrapper/>` (soft emerald border/ring + depth shadow, not hard `border-2`); collapsed cards show compact price/savings + Select & View; expanded panel = inclusions + qty stepper + self/gift + DatePicker. Bottom footers use `rounded-b-2xl` to prevent inner-bleed corner cutoffs. Pricing: original (strike) → sale → promo (Clementine) + SAVE; qty≥2 Multi-Pack 10%; `badgeTag` upsell nudges (MOST POPULAR / BEST VALUE / RECOMMENDED).
23. **HIG DatePicker (Portaled)** — `DatePicker` uses `@radix-ui/react-popover` Portal (`z-[9999]`) so calendars never clip inside accordion / AdaptiveContainer overflow. Glass panel, circular day pills, Today/Clear. Never use native `type="date"`.
24. **Dual-Engine Booking Protocol** — `DualBookingEngine` on For Myself checkout: **Buy Open Voucher** (default, book later) vs **Reserve Time Slot Now** (date + merchant slot grid). Policy notice: free reschedule up to 24h prior; late cancellations under 12h forfeit voucher.
25. **Compact Inclusions Grid** — `OfferInclusionsGrid`: 2-col single-line truncates (≤28 chars), promise-free sanitizer (no guarantee/promise/permanent/risk-free copy), no duplicate Instant Voucher pills vs metadata.
26. **Premium Card Shell** — `PremiumOfferCardWrapper`: active = `border-emerald-500/40` + soft ring + emerald glow decorator; inactive = zinc hairline + ambient shadow. Footer panels MUST `rounded-b-2xl`. Card shells MAY use `overflow-hidden` because DatePicker is portaled.
27. **Checkout Step Header** — `CheckoutStepHeader`: Apple HIG segmented tracker (`bg-zinc-200/50` track + white active pill). Flush top headers MUST `rounded-t-2xl`; AdaptiveContainer card uses `overflow-hidden rounded-2xl`.

### Pillar 1: Multi-Tenant Architecture & Magic Onboarding
* **Row-Level Security (RLS):** Every merchant authenticates with a verified **VAT / Tax ID**. Database rules enforce `tenant_id = auth.jwt() -> vat_number`, guaranteeing data isolation at the database layer.
* **1-Minute "VAT-Drop" Setup:** 
  1. Merchant inputs business name and VAT ID.
  2. System queries public business registries to auto-fill business details.
  3. System scrapes existing Google Maps listing, pulls ratings, operating hours, and imagery, generating a fully configured landing page and AI Agent automatically.

### Pillar 2: Ambient Capacity & Fallback-First State Engine
To handle high-throughput walk-ins (gyms, pools, salons) without relying on fragile physical hardware:
* **Primary Feed:** Webhooks from POS platforms (Square, Toast, Clover) or turnstiles calculate real-time occupancy.
* **Fallback Engine:** If local hardware loses connection, the system seamlessly transitions to a **Machine-Learned Predictive Baseline** based on historical time/day traffic data, displaying *"Estimated X spots open (based on usual traffic)"*.
* **Concurrency Locking:** High-demand slots execute through **Redis Atomic Lua Scripts** (`DECRBY capacity:tenant_id 1`), putting temporary 3-minute holds on slots to eliminate double-booking globally.

```
                  [ Client Booking Request ]
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Redis Cluster (Atomic Lua Script Check) │
        │  `DECRBY capacity:tenant_id 1`           │
        └─────────────────────┬────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
       [ If Capacity > 0 ]           [ If Capacity <= 0 ]
       Slot Locked for 3 Mins        "Slot Just Claimed!"
       (Proceed to Payment)          Offer Next Available Slot
```

### Pillar 3: Deterministic AI Sales & WebRTC Voice Agent
* **Dual-Channel Fallback:** Runs over **WebRTC / WebSockets** using ultra-low latency inference (Deepgram Nova-2 + Groq LPU processing). If mobile network latency spikes above 800ms, the UI instantly falls back to an interactive micro-card modal.
* **Hardened Guardrails:** The LLM manages natural dialogue, but **all business logic (prices, calendar slots, refunds) is handled strictly by rigid API function calls**. The AI cannot hallucinate unapproved pricing or services.

---

## 4. DATABASE & DATA SCHEMAS

### Multi-Tenant Core Schema (PostgreSQL)

```sql
-- 1. Multi-Tenant Business Registry
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vat_number VARCHAR(50) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    sector VARCHAR(50) NOT NULL, -- 'GYM', 'SALON', 'CLINIC', 'POOL'
    max_capacity INT NOT NULL DEFAULT 20,
    created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);

-- Enable RLS for Isolation
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 2. Ambient Capacity & Live State
CREATE TABLE live_occupancy (
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    current_occupancy INT NOT NULL DEFAULT 0,
    last_signal_timestamp TIMESTAMP WITH TIMEZONE DEFAULT NOW(),
    signal_source VARCHAR(50) DEFAULT 'POS_WEBHOOK', -- 'POS_WEBHOOK', 'WIFI_PROBE', 'ML_PREDICTIVE'
    PRIMARY KEY (tenant_id)
);

-- 3. Lead Velocity & CRM Profile
CREATE TABLE lead_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    intent_score INT DEFAULT 0, -- 0-100 calculated by AI Agent
    lifecycle_stage VARCHAR(30) DEFAULT 'PROSPECT', -- 'PROSPECT', 'HOT_LEAD', 'ACTIVE_MEMBER'
    last_engagement TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);
```

---

## 5. COMPARISON: NEXUS OS VS. LEGACY PLATFORMS

| Feature | Legacy Stack (Salesforce + Wix + ManyChat) | **Nexus OS** |
| :--- | :--- | :--- |
| **Operational Labor** | Requires human reps to drag CRM cards & update calendars. | **100% Autonomous** (AI Agent handles lead to payment). |
| **Setup Time** | Weeks/months of web design & Zapier integrations. | **60 Seconds** via Magic VAT Onboarding. |
| **Capacity Management** | Manual booking slots or phone inquiries. | **Real-Time Ambient Feed** (POS & predictive ML). |
| **Conversion Friction** | Static forms, 24-hour response lag. | **Sub-350ms WebRTC Voice/Chat** + 1-Tap Payment. |
| **System Architecture** | Fragmented tools glued via webhooks. | **Unified Multi-Tenant Engine**. |

---

## 6. DEVELOPMENT EXECUTION ROADMAP

### Phase 1: Core Engine & Multi-Tenancy
* Deploy Next.js 15 App Router on Vercel Edge Network.
* Setup Supabase PostgreSQL database with Row-Level Security (RLS) tied to VAT authentication.
* Implement Stripe Connect API for automated merchant onboarding and revenue splitting.

### Phase 2: Ambient Capacity & Redis Locking
* Build webhook receiver pipeline for major POS platforms (Square / Toast).
* Implement Redis Cluster with Lua scripting for atomic slot holds during checkout.
* Build predictive ML fallback model for local capacity estimation when offline.

### Phase 3: AI Voice & Intent Agent
* Integrate Deepgram Nova-2 (Speech-to-Text) and Groq LPU inference pipeline for sub-350ms response times.
* Configure strict JSON-Schema function calling for calendar booking and checkout links.
* Deploy WebRTC audio bridge with automated text-fallback UI cards for low-bandwidth connections.

### Phase 4: Automated Marketing & Global Rollout
* Implement automated post-visit feedback loops (converting voice notes into Schema.org reviews).
* Launch the hyper-local discovery directory index.