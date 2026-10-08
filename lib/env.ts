/* ============================================================
   AwaAgent - Environment configuration
   Centralised, typed access to runtime-tunable values.
   Everything here can be overridden via `.env.local` without a
   code change. Only NEXT_PUBLIC_* vars are available on the client.
   ============================================================ */

const num = (v: string | undefined, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) && v !== undefined && v !== "" ? n : fallback;
};

const str = (v: string | undefined, fallback: string): string =>
  v && v.length > 0 ? v : fallback;

export const env = {
  /** Branding */
  appName: str(process.env.NEXT_PUBLIC_APP_NAME, "AwaAgent"),
  appUrl: str(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"),
  supportEmail: str(process.env.NEXT_PUBLIC_SUPPORT_EMAIL, "support@awaagent.ng"),
  supportPhone: str(process.env.NEXT_PUBLIC_SUPPORT_PHONE, "0700 292 224 368"),
  currency: str(process.env.NEXT_PUBLIC_CURRENCY, "₦"),
  defaultCity: str(process.env.NEXT_PUBLIC_DEFAULT_CITY, "Ibadan"),

  /** Business rules - tunable without redeploying logic */
  escrowFeePct: num(process.env.NEXT_PUBLIC_ESCROW_FEE_PCT, 2.5),
  renewalEscrowFeePct: num(process.env.NEXT_PUBLIC_RENEWAL_ESCROW_FEE_PCT, 1),
  defaultCommissionPct: num(process.env.NEXT_PUBLIC_DEFAULT_COMMISSION_PCT, 9),
  maxInspectionsPerDay: num(process.env.NEXT_PUBLIC_MAX_INSPECTIONS_PER_DAY, 4),
  otpResendSeconds: num(process.env.NEXT_PUBLIC_OTP_RESEND_SECONDS, 30),

  apiBaseUrl: str(process.env.NEXT_PUBLIC_API_BASE_URL, "https://api.awaagent.b2686bbc.sslip.io/api/v1"),

} as const;

export type Env = typeof env;
