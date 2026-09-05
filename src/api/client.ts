import type { ApiClaim, Item, NewClaim } from "../types/index";

export const API_URL = "http://localhost:3001";

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/items`);

  if (!res.ok) {
    throw new Error("Could not load items");
  }

  return res.json();
}

export async function fetchItemById(id: string): Promise<Item> {
  const res = await fetch(`${API_URL}/items/${encodeURIComponent(id)}`);

  if (!res.ok) {
    throw new Error("Could not load that item");
  }

  return res.json();
}

export async function fetchClaims(): Promise<ApiClaim[]> {
  const res = await fetch(`${API_URL}/claims`);

  if (!res.ok) {
    throw new Error("Could not load claims");
  }

  return res.json();
}

export async function createClaim(newClaim: NewClaim): Promise<ApiClaim> {
  const res = await fetch(`${API_URL}/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newClaim),
  });

  if (!res.ok) {
    throw new Error("Could not save the claim");
  }

  return res.json();
}
