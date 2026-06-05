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

const bool = (v: string | undefined, fallback: boolean): boolean =>
  v === undefined ? fallback : v === "true" || v === "1";

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

  /** Backend integration - when a real API exists, point here & flip useMocks */
  apiBaseUrl: str(process.env.NEXT_PUBLIC_API_BASE_URL, ""),
  useMocks: bool(process.env.NEXT_PUBLIC_USE_MOCKS, true),

  /** Third-party (placeholders until keys are provisioned) */
  paystackPublicKey: str(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, ""),
  googleMapsApiKey: str(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, ""),
  smileIdentityToken: str(process.env.NEXT_PUBLIC_SMILE_IDENTITY_TOKEN, ""),

  /** Simulated network latency for the mock service layer (ms). */
  mockLatencyMs: num(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS, 400),
} as const;

export type Env = typeof env;
