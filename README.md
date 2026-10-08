# AwaAgent frontend

Next.js 16 frontend for the [AwaAgent backend](https://github.com/AwaAgent/awaagent-backend).

## Run locally

```bash
bun install
cp .env.example .env.local
bun run dev
```

The frontend uses the backend API at `NEXT_PUBLIC_API_BASE_URL`. It defaults to the production API URL. Set it to `http://localhost:5000/api/v1` to use a local backend.

## Connected features

- Login with a backend account and bearer token.
- Public property browsing and property details.
- Tenant inspection list and booking for eligible accounts.
- Agent inspection queue and OTP verification.

The backend mounts inspection routes at `/api/v1/inspection` (singular). The frontend uses the backend's `{ status, data }` response format and displays backend error messages.

## Planned features and backend work

The backend accepts new accounts through `/auth/signup`, but assigns every signup the same `123456` verification code and returns it in the response. The frontend currently disables signup until verification uses a real delivery and expiry flow. This is a frontend decision; the backend does **not** reject registration.

KYC submission, subscription checkout, agent authorization, and payment checkout also lack working production flows. The backend's escrow initialization returns a test checkout URL. Pages without working backend data show an unavailable state rather than fabricated records or actions. The full inventory of former screens, their intended flows, available backend routes, and restoration requirements is in [the feature inventory](docs/feature-inventory.md).

No payment can be collected in this frontend until the backend provides a real checkout URL and confirms payments through its webhook.
