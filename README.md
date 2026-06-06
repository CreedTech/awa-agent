# AwaAgent

**Escrow-protected rental marketplace for Nigeria.** AwaAgent removes fake agents, hidden fees,
illegal viewing fees and unsafe cash payments from renting: tenants inspect verified homes, pay
securely into escrow, and funds are only released after physical milestones (inspection + key
handover) are completed.

Built in **Next.js 16** (App Router, Turbopack) from a Claude Design handoff.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + a ported design-system stylesheet (`app/globals.css`) |
| Components | shadcn/ui (Base UI primitives) |
| Icons | Hugeicons (`@hugeicons/react`) via `lib/icons.ts` |
| Forms | React Hook Form + Zod |
| Client state | Zustand (+ immer) — the mutable source of truth |
| Server state | TanStack Query (wired for the future API) |
| Charts | Recharts |
| Toasts | Sonner |
| Package manager | bun |

Brand: navy `#001f3f` + gold `#d4af37`, paper `#f3f5f8`; fonts Schibsted Grotesk / Hanken Grotesk /
Space Mono (via `next/font`).

## Getting started

```bash
bun install
cp .env.example .env.local   # optional — sensible defaults are baked in
bun run dev                  # http://localhost:3000
```

Other scripts: `bun run build`, `bun run start`.

## Roles & the demo role switcher

Five experiences: **Guest · Tenant · Agent · Landlord · Admin**. Public pages look like a normal
marketplace; logged-in users get role-specific dashboards (landlord & admin are desktop-first
console shells). A floating **Switch Role** control (bottom-left) lets you jump between every
dashboard without re-auth — it's prototype-only and sits behind a real auth gate in production.

The signature journey: _guest finds a property → signs up → views the rent breakdown → books an
inspection → agent approves (address unlocks) → completes inspection → pays into escrow → funds
locked → confirms keys → escrow releases_. Every step mutates shared state and is reflected in the
agent/landlord/admin views.

## Project structure

```
app/
  (public)/        # home, explore, properties/[id], how-it-works, pricing, trust-safety
  auth/            # login, signup, forgot-password, verify-otp, role-selection
  tenant/          # dashboard, inspections, escrow, saved, loyalty, subscription, receipts, profile, disputes
  agent/           # dashboard, properties(+new/[id]), inspections, earnings, commissions, kyc, …
  landlord/        # dashboard, properties, agent-matrix, rent-ledger, payouts, inspections, …
  admin/           # dashboard, users, kyc, properties, escrow, disputes, revenue, settings, audit-logs, …
components/
  ui/              # shadcn primitives + the Hugeicons <Icon> wrapper
  shared/          # Logo, Avatar, Naira, TrustBadge, StatusBadge, StatCard, BottomSheet, OTP, …
  layout/          # top-nav, bottom-nav, dashboard-shell, role-switcher, footer
  property/ inspection/ escrow/ agent/ charts/   # feature components
lib/               # types, constants, env, icons, utils (formatters + business logic), mock-data, validations, api
store/             # auth-store, app-store (Zustand — all mutations)
services/          # property/inspection/escrow/dispute/auth/user/kyc/revenue — the backend-swap boundary
```

## Mock data → real backend

Everything is driven by in-memory mock data today. The swap points are designed in:

- **`store/app-store.ts`** holds all mutable collections and the state-transition actions.
- **`services/*`** wrap those with async, simulated-latency calls that mirror real API shapes.
- **`lib/api.ts`** is a typed `fetch` client. Set `NEXT_PUBLIC_API_BASE_URL` and
  `NEXT_PUBLIC_USE_MOCKS=false` to point at a real backend — no component changes needed.

Integration markers (search the code for `TODO(...)`):

- **Paystack** — escrow initiation + webhook (`services/escrow-service.ts`, `components/escrow/pay-sheet.tsx`).
- **Smile Identity** — NIN/KYC verification (`services/kyc-service.ts`).
- **Google Maps** — address unlock + GPS capture (`components/shared/map-placeholder.tsx`, `components/property/gps-capture.tsx`).

No real keys are bundled; all third-party flows are simulated until keys are provided in `.env.local`.

## Configuration

Tunable values live in `.env.example` (escrow fee %, commission %, max inspections/day, OTP resend,
branding, API URL, third-party keys). They're read through `lib/env.ts` so business rules can change
without touching logic.
