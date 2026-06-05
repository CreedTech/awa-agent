/* ============================================================
   AwaAgent - Zod validation schemas
   Shared by React Hook Form across auth, onboarding, add-property,
   withdrawals and disputes. Inferred types are exported for forms.
   ============================================================ */

import { z } from "zod";
import { PROPERTY_TYPES, AREAS } from "./constants";

/** Nigerian phone: 11 digits, optional spaces, may start 0 or +234. */
const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine((v) => /^(\+?234|0)\d{10}$/.test(v.replace(/\s/g, "")), {
    message: "Enter a valid Nigerian phone number",
  });

const ninSchema = z
  .string()
  .refine((v) => v === "" || /^\d{11}$/.test(v.replace(/\s/g, "")), {
    message: "NIN must be 11 digits",
  })
  .optional();

export const signupSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  password: z.string().min(8, "Use at least 8 characters"),
});
export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your phone or email"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Enter your phone or email"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});
export type OtpValues = z.infer<typeof otpSchema>;

export const tenantOnboardSchema = z.object({
  area: z.string().min(1, "Pick a preferred area"),
  budget: z.number().min(100000).max(3000000),
  propertyType: z.enum(PROPERTY_TYPES as [string, ...string[]]),
  nin: ninSchema,
});
export type TenantOnboardValues = z.infer<typeof tenantOnboardSchema>;

/* ---- Add property (multi-step) ---- */
export const propertyBasicsSchema = z.object({
  title: z.string().min(4, "Give the listing a clear title"),
  type: z.enum(PROPERTY_TYPES as [string, ...string[]]),
  beds: z.number().int().min(0).max(10),
  baths: z.number().int().min(1).max(10),
  baseRent: z.number().min(80000, "Minimum base rent is ₦80,000").max(5000000),
});
export type PropertyBasicsValues = z.infer<typeof propertyBasicsSchema>;

export const propertyLocationSchema = z.object({
  area: z.enum(AREAS as unknown as [string, ...string[]]),
  landmark: z.string().min(3, "Add a public landmark"),
  exactAddress: z.string().min(5, "Add the exact address (kept private)"),
  hideExact: z.boolean(),
});
export type PropertyLocationValues = z.infer<typeof propertyLocationSchema>;

/* ---- Money ---- */
export const withdrawSchema = z.object({
  amount: z.number().min(1000, "Minimum withdrawal is ₦1,000"),
  bank: z.string().min(2, "Select a bank"),
  accountNumber: z
    .string()
    .refine((v) => /^\d{10}$/.test(v), "Account number must be 10 digits"),
});
export type WithdrawValues = z.infer<typeof withdrawSchema>;

/* ---- Dispute ---- */
export const DISPUTE_REASONS = [
  "Keys not received after payment",
  "Property condition misrepresented",
  "Agent demanded cash viewing fee",
  "OTP used twice - possible fraud",
  "Landlord refused key handover",
  "Other",
] as const;

export const disputeSchema = z.object({
  reason: z.enum(DISPUTE_REASONS as unknown as [string, ...string[]]),
  description: z.string().min(10, "Describe what happened (min 10 chars)"),
});
export type DisputeValues = z.infer<typeof disputeSchema>;

/* ---- Agent KYC onboarding ---- */
export const agentKycSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: phoneSchema,
  nin: z.string().refine((v) => /^\d{11}$/.test(v.replace(/\s/g, "")), "NIN must be 11 digits"),
  businessName: z.string().optional().or(z.literal("")),
  bank: z.string().min(2, "Select a bank"),
  accountNumber: z.string().refine((v) => /^\d{10}$/.test(v), "Account number must be 10 digits"),
});
export type AgentKycValues = z.infer<typeof agentKycSchema>;

/* ---- Authorize agent (landlord) ---- */
export const authorizeAgentSchema = z.object({
  agentId: z.string().refine((v) => /^AGT-\d{4}$/.test(v), "Format: AGT-1234"),
});
export type AuthorizeAgentValues = z.infer<typeof authorizeAgentSchema>;
