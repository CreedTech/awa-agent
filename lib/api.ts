/* AwaAgent backend API client. */

import { env } from "./env";
import { useAuthStore } from "@/store/auth-store";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  /** Parsed JSON body to send. */
  json?: unknown;
}

/**
 * Thin typed fetch wrapper. Adds JSON headers, the API base URL and
 * the auth token when present. Throws `ApiError` on non-2xx.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;
  const token = useAuthStore.getState().token;

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body && typeof body.message === "string" ? body.message : res.statusText;
    throw new ApiError(res.status, message || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
