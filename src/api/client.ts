import useAuthStore from "../store/authStore.ts";
import type {
  AiReview,
  ApiClaim,
  Item,
  LoginBody,
  LoginResponse,
  NewClaim,
  RegisterBody,
  User,
} from "../types/index";

export const API_URL = (import.meta.env.VITE_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  if (!API_URL)
    throw new Error(
      "Set VITE_API_URL to your backend origin and rebuild the frontend.",
    );
  const token = useAuthStore.getState().token;
  if (authenticated && !token) throw new Error("Please log in to continue.");
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (authenticated) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (
      authenticated &&
      response.status === 401 &&
      useAuthStore.getState().token === token
    ) {
      useAuthStore.getState().logout();
    }
    const message =
      body?.errors?.join?.("; ") ||
      body?.message ||
      `Request failed (${response.status}) at ${API_URL}${path}`;
    throw new Error(message);
  }
  return body as T;
}

export const fetchItems = (): Promise<Item[]> => request("/api/items");
export const fetchItemById = (id: string): Promise<Item> =>
  request(`/api/items/${encodeURIComponent(id)}`);
export const fetchClaims = (): Promise<ApiClaim[]> =>
  request("/api/claims", {}, true);
export const createClaim = (claim: NewClaim): Promise<ApiClaim> =>
  request("/api/claims", { method: "POST", body: JSON.stringify(claim) }, true);
export const login = (body: LoginBody): Promise<LoginResponse> =>
  request("/api/auth/login", { method: "POST", body: JSON.stringify(body) });
export const register = (body: RegisterBody): Promise<User> =>
  request("/api/auth/register", { method: "POST", body: JSON.stringify(body) });

export const askAi = (prompt: string): Promise<AiReview> =>
  request(
    "/api/ai",
    { method: "POST", body: JSON.stringify({ prompt }) },
    true,
  );
