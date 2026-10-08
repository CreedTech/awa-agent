# AwaAgent frontend

Next.js 16 frontend for the [AwaAgent backend](https://github.com/AwaAgent/awaagent-backend).

## Run locally

```bash
bun install
cp .env.example .env.local
bun run dev
```

The frontend uses the backend API at `NEXT_PUBLIC_API_BASE_URL`. It defaults to the production API URL. Set it to `http://localhost:5000/api/v1` to use a local backend.

## Integration work in this checkout

- Login, Resend-backed email signup and password recovery, account profiles, and manual KYC review.
- Public listings, landlord-agent authorization, managed listings, saved homes, and inspections.
- Paystack-backed subscription checkout, rent checkout, transaction verification, payout account setup, dispute review, and payment records.

The backend mounts inspection routes at `/api/v1/inspection` (singular). The frontend uses the backend's `{ status, data }` response format and displays backend error messages.

The new screens require the matching backend branch and database migration. They are not evidence that the production backend is already running these routes. Resend and Paystack credentials are not in this repository. Checkout and email actions fail closed until the backend is configured.

## Remaining product work

Some dashboard pages still display an unavailable state while their data contracts are built. [The feature inventory](docs/feature-inventory.md) records the former screens and the current implementation status so those planned features are not lost.

The backend operator must configure Resend, a live transfer-enabled Paystack account, callback URLs and webhook URL, and an admin account, then verify the migration and payment lifecycle before launch.
