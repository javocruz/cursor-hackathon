import { useAuthStore } from "../stores/authStore";

/**
 * Wrapper around fetch that injects the Authorization header from authStore.
 * If the server returns 401, the user is automatically logged out.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    useAuthStore.getState().logout();
  }

  return res;
}

/**
 * Build an EventSource URL with the JWT appended as a query parameter.
 * EventSource cannot set custom headers, so the backend accepts
 * ?access_token=<jwt> as an alternative.
 */
export function sseUrl(path: string): string {
  const token = useAuthStore.getState().token;
  if (!token) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}access_token=${encodeURIComponent(token)}`;
}
