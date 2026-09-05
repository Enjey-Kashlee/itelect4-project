import assert from "node:assert/strict";
import test from "node:test";

let nextResponse: { ok: boolean; json: () => Promise<unknown> };
const requests: Array<{ input: string; init?: RequestInit }> = [];

Object.defineProperty(globalThis, "fetch", {
  configurable: true,
  writable: true,
  value: async (input: string | URL, init?: RequestInit) => {
    requests.push({ input: String(input), init });
    return nextResponse;
  },
});

const {
  API_URL,
  createClaim,
  fetchClaims,
  fetchItemById,
  fetchItems,
} = await import("../src/api/client.ts");

test("fetches all items from the items endpoint", async () => {
  const items = [
    {
      id: "101",
      title: "Blue Water Bottle",
      description: "Hydro Flask with a DLSL sticker",
      status: "lost",
      location: "Library, 2nd floor",
      reportedById: 1,
    },
  ];
  requests.length = 0;
  nextResponse = { ok: true, json: async () => items };

  assert.deepEqual(await fetchItems(), items);
  assert.equal(requests[0]?.input, `${API_URL}/items`);
});

test("fetches one item by its string ID", async () => {
  const item = {
    id: "101",
    title: "Blue Water Bottle",
    description: "Hydro Flask with a DLSL sticker",
    status: "lost",
    location: "Library, 2nd floor",
    reportedById: 1,
  };
  requests.length = 0;
  nextResponse = { ok: true, json: async () => item };

  assert.deepEqual(await fetchItemById("101"), item);
  assert.equal(requests[0]?.input, `${API_URL}/items/101`);
});

test("throws when the item endpoint returns an error", async () => {
  requests.length = 0;
  nextResponse = { ok: false, json: async () => ({}) };

  await assert.rejects(fetchItemById("999"), /Could not load that item/);
});

test("fetches API claims from the claims endpoint", async () => {
  const claims = [
    {
      id: "1",
      itemId: 101,
      claimantId: 1,
      claimedAt: "2026-08-05T10:15:00",
      verified: false,
    },
  ];
  requests.length = 0;
  nextResponse = { ok: true, json: async () => claims };

  assert.deepEqual(await fetchClaims(), claims);
  assert.equal(requests[0]?.input, `${API_URL}/claims`);
});

test("creates a claim with a JSON POST request", async () => {
  const newClaim = {
    itemId: 101,
    claimantId: 1,
    claimedAt: "2026-08-05T10:15:00",
    verified: false,
  };
  const savedClaim = { id: "4", ...newClaim };
  requests.length = 0;
  nextResponse = { ok: true, json: async () => savedClaim };

  assert.deepEqual(await createClaim(newClaim), savedClaim);
  assert.equal(requests[0]?.input, `${API_URL}/claims`);
  assert.equal(requests[0]?.init?.method, "POST");
  assert.deepEqual(requests[0]?.init?.headers, {
    "Content-Type": "application/json",
  });
  assert.equal(requests[0]?.init?.body, JSON.stringify(newClaim));
});
