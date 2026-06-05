/* ============================================================
   AwaAgent - API client (backend boundary)
   While `env.useMocks` is true, the `services/*` layer resolves
   from the in-memory store. When a real backend exists, set
   NEXT_PUBLIC_API_BASE_URL + NEXT_PUBLIC_USE_MOCKS=false and these
   helpers issue real HTTP requests - no component changes needed.
   ============================================================ */

import { env } from "./env";

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
 * (in future) the auth token. Throws `ApiError` on non-2xx.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      // Authorization: `Bearer ${getToken()}`,  // wire when auth lands
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, message || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Resolve a mock value with simulated latency (mirrors network timing). */
export function mockResolve<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), env.mockLatencyMs));
}
