import { redirect } from "next/navigation";

/**
 * The old "preview any dashboard" launcher is gone - people now sign up
 * for one account type and log into their own dashboard. Keep the route
 * working by sending it to signup.
 */
export default function RoleSelectionRedirect() {
  redirect("/auth/signup");
}
