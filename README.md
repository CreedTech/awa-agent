# AwaAgent

**A web app for finding, listing, and renting property.**

Tenants, agents, landlords, and admins use one connected platform for listings, inspections, identity review, and payments.

[Website](https://awaagent.ng) · [Backend repository](https://github.com/AwaAgent/awaagent-backend)

## What is here

| Area | What it covers |
| --- | --- |
| Property | Search, saved homes, listing creation and review |
| Inspections | Booking, availability, visit codes and address access |
| Accounts | Email verification, profiles and manual identity review |
| Payments | Subscriptions, rent checkout, receipts, disputes and payouts |
| Operations | Admin queues, notifications, settings and audit history |

The frontend is built with **Next.js 16**, **React 19**, and **TypeScript**. It uses the [AwaAgent backend](https://github.com/AwaAgent/awaagent-backend) for data and actions; email, payments, and file uploads depend on the backend's configured providers.

## Run locally

```bash
bun install
cp .env.example .env.local
bun run dev
```

Open <http://localhost:3000>. The example configuration points to the deployed API. To work against a local backend, set `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1` in `.env.local`.

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Check the production build |
| `bun run start` | Serve the production build |

## Project guide

| Path | Contents |
| --- | --- |
| [`app/`](app/) | Pages and layouts |
| [`services/`](services/) | Backend API clients |
| [`lib/`](lib/) | Shared helpers and public configuration |

> **Secrets stay on the backend.** Only public `NEXT_PUBLIC_*` configuration belongs in this frontend. Do not commit `.env.local` or provider credentials.
