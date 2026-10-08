# Production environment and launch setup

The frontend is deployed on Vercel. The Express API and PostgreSQL run on the backend host. Put **only public `NEXT_PUBLIC_*` values** in Vercel; keep Resend, Paystack, R2, database and JWT secrets on the backend host. No provider credentials are stored in either repository.

## Values to provide on the backend host

| Variable | Where to get it | Required for |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API Keys | Signup verification and password recovery |
| `RESEND_FROM_EMAIL` | An address on a verified Resend sending domain, such as `AwaAgent <hello@your-domain>` | Outbound email |
| `FRONTEND_ORIGIN` | Final frontend HTTPS origin, currently `https://awa-agent.vercel.app` | Email links |
| `PAYSTACK_SECRET_KEY` | Paystack live secret key; keep server side | Subscription and rent checkout, verification, transfers and refunds |
| `PAYSTACK_CALLBACK_URL` | `https://awa-agent.vercel.app/tenant/escrow` or the final custom domain equivalent | Rent checkout return |
| `PAYSTACK_SUBSCRIPTION_CALLBACK_URL` | `https://awa-agent.vercel.app/tenant/subscription` or the final custom domain equivalent | Subscription checkout return |
| `PAYSTACK_PAYMENTS_ENABLED` | Set `true` only after the account and transaction acceptance checks below | Enables real collection; defaults to `false` |
| `R2_ACCOUNT_ID` | Cloudflare R2 account | Object uploads |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | R2 API token scoped to the two buckets with object read/write | Signed uploads and private evidence reads |
| `R2_PUBLIC_BUCKET` | Public listing photo bucket name | Listing photos |
| `R2_PRIVATE_BUCKET` | Separate private identity document bucket name | KYC evidence |
| `R2_PUBLIC_BASE_URL` | HTTPS custom domain for the public bucket, without a path | Listing image URLs |
| `DATABASE_URL`, `POSTGRES_PASSWORD`, `JWT_SECRET` | Existing production database and randomly generated signing secret | Core API and authentication |
| `CORS_ORIGINS` | Comma-separated exact frontend origins | Browser API access |

Use the backend repository's `.env.production.example` for the complete host configuration, including the existing deployment and observability values. Add secrets to the backend host's `.env.production`; do not put them in Vercel or send them in chat. The backend does not use an SMS provider. Inspection codes are displayed in the authenticated tenant app.

## Provider dashboard steps

1. Verify the sending domain in Resend and add its DNS records. Set `RESEND_FROM_EMAIL` to that domain, then test registration and recovery to a real inbox.
2. Create two R2 buckets. Make only the listing bucket public through an HTTPS custom domain. Configure bucket CORS for the frontend origin with `PUT` and `Content-Type`. Keep the identity bucket private. Test a listing upload and a KYC upload/review before inviting users.
3. In Paystack, configure the webhook URL as `https://api.awaagent.b2686bbc.sslip.io/api/v1/escrow/webhooks/paystack` (substitute the final API domain if changed). The backend validates Paystack's signature using the secret key. Enable transfers and confirm the merchant account's settlement and transfer rules.
4. Promote an existing active account to admin on the backend host with `npm run admin:promote -- admin@example.com`. Admin role is never granted by signup. Use that account to review KYC and listings.
5. Keep `PAYSTACK_PAYMENTS_ENABLED=false` until a live subscription payment, rent checkout, webhook, landlord and agent transfer, dispute and refund have been checked with the merchant account. Reconcile the merchant balance and processing fees. No payment should be inferred solely from a browser redirect.

## Frontend values

Vercel Production already has `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_DEFAULT_CITY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_SUPPORT_PHONE` and `NEXT_PUBLIC_CURRENCY`. Change `NEXT_PUBLIC_APP_URL` and the backend origins/callbacks together when using a custom domain. `NEXT_PUBLIC_API_BASE_URL` must end in `/api/v1`. No `USE_MOCKS` variable is used.

The subscription price, platform fee and agent share now come from authenticated backend settings. Operators can change them in `/admin/settings`; the price page reads the live backend value. Existing transactions keep the amounts recorded at checkout. Old frontend fee variables in `.env.example` are historical and must not be used to set live financial rules.

## External dependencies still needed

Without the values above, signup/recovery, payments, photo uploads and evidence collection report unavailable. This is intentional: the app does not fabricate provider success. Manual KYC additionally needs a real admin and a review procedure. Dojah is a possible later provider; no Dojah key is needed now. The backend's current `LEGACY_REVIEW` payment rows need individual Paystack/bank reconciliation before financial action.
