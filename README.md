# Nexus OS

Autonomous commerce for products, appointments, and walk-ins — with an AI sales agent and visual CRM.

Project rules: see [`.cursorrules`](.cursorrules).

## Quick start

```bash
# Infra (preferred): Docker Compose
docker compose up -d

# Or local Homebrew Postgres 16 + Redis (used when Docker is unavailable)
# pg_ctl -D /opt/homebrew/var/postgresql@16 start
# redis-server --daemonize yes

cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000):

- `/` — Platform marketing + Magic VAT onboarding
- `/IL-ARTISAN-001` — Handcrafts + commissions (no walk-in)
- `/IL-DIGITAL-001` — Legal counsel (Northline) + strategy consults · `/p/jordan-lee`
- `/IL-GYM-001` — Gym with walk-in capacity module
- `/merchant/dashboard?vat=IL-ARTISAN-001` — Visual CRM hub

## Phase map

| Phase | Status |
|---|---|
| 1 Working tool core | Implemented |
| 2 Auth & RLS | `src/lib/auth`, `db/migrations/002_phase2_rls.sql` |
| 3 GDPR & QA | `src/middleware.ts`, `src/lib/gdpr`, `tests/` |
| 4 Stripe & launch | `src/lib/payments`, host→VAT map |

## Smoke

```bash
npm run smoke:holds
npm run test:qa
```
