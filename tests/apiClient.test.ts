import assert from "node:assert/strict";
import test from "node:test";
import { registerHooks } from "node:module";

// Vite injects import.meta.env in the browser; provide the same input for Node tests.
registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (url.endsWith("/src/api/client.ts")) {
      return {
        ...result,
        source: String(result.source).replaceAll(
          "import.meta.env",
          '{ VITE_API_URL: "https://api.example.test" }',
        ),
      };
    }
    return result;
  },
});
const storage = new Map<string, string>();
Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  },
});
const { fetchItems, fetchItemById, fetchClaims, createClaim, login, register } =
  await import("../src/api/client.ts");
const { default: useAuthStore } = await import("../src/store/authStore.ts");
const requests: Array<{ url: string; init?: RequestInit }> = [];
let response = new Response("[]");
globalThis.fetch = async (input, init) => {
  requests.push({ url: String(input), init });
  return response;
};
const user = {
  id: "65f000000000000000000010",
  name: "Juan",
  email: "juan@example.com",
  role: "student" as const,
  isActive: true,
};

test("public item calls use the configured API and do not send a token", async () => {
  useAuthStore.getState().setSession("signed-token", user);
  response = new Response("[]");
  await fetchItems();
  assert.equal(requests.at(-1)?.url, "https://api.example.test/api/items");
  assert.equal(
    new Headers(requests.at(-1)?.init?.headers).has("Authorization"),
    false,
  );
  response = new Response("{}");
  await fetchItemById("an/id");
  assert.equal(
    requests.at(-1)?.url,
    "https://api.example.test/api/items/an%2Fid",
  );
});

test("private claims attach the token and send only the form fields", async () => {
  useAuthStore.getState().setSession("signed-token", user);
  response = new Response("[]");
  await fetchClaims();
  assert.equal(
    new Headers(requests.at(-1)?.init?.headers).get("Authorization"),
    "Bearer signed-token",
  );
  const body = {
    itemId: "65f000000000000000000001",
    proofDescription: "My initials are underneath.",
  };
  response = new Response(JSON.stringify({ id: "saved", ...body }));
  await createClaim(body);
  assert.equal(requests.at(-1)?.url, "https://api.example.test/api/claims");
  assert.equal(requests.at(-1)?.init?.method, "POST");
  assert.deepEqual(JSON.parse(String(requests.at(-1)?.init?.body)), body);
});

test("registration and login use the real public auth routes", async () => {
  response = new Response(JSON.stringify(user));
  await register({ name: "Juan", email: user.email, password: "Learning123!" });
  assert.equal(
    requests.at(-1)?.url,
    "https://api.example.test/api/auth/register",
  );
  response = new Response(JSON.stringify({ token: "signed-token", user }));
  assert.equal(
    (await login({ email: user.email, password: "Learning123!" })).token,
    "signed-token",
  );
  assert.equal(requests.at(-1)?.url, "https://api.example.test/api/auth/login");
  assert.equal(
    new Headers(requests.at(-1)?.init?.headers).has("Authorization"),
    false,
  );
});

test("API validation messages reach the caller", async () => {
  response = new Response(
    JSON.stringify({
      message: "Validation failed",
      errors: ["Proof is too short"],
    }),
    { status: 400 },
  );
  await assert.rejects(fetchItems(), /Proof is too short/);
});

test("expired private sessions clear authentication", async () => {
  useAuthStore.getState().setSession("expired-token", user);
  response = new Response(JSON.stringify({ message: "Token expired" }), {
    status: 401,
  });
  await assert.rejects(fetchClaims(), /Token expired/);
  assert.equal(useAuthStore.getState().token, null);
});

test("non-JSON failures give a useful error and missing sessions send no request", async () => {
  response = new Response("Bad gateway", { status: 502 });
  await assert.rejects(fetchItems(), /502/);
  useAuthStore.getState().logout();
  const count = requests.length;
  await assert.rejects(fetchClaims(), /log in/i);
  assert.equal(requests.length, count);
});

test("a late 401 from an old session cannot sign out a new session", async () => {
  const originalFetch = globalThis.fetch;
  let release!: (response: Response) => void;
  globalThis.fetch = async () =>
    new Promise<Response>((resolve) => {
      release = resolve;
    });
  try {
    useAuthStore.getState().setSession("old-token", user);
    const pending = fetchClaims();
    useAuthStore
      .getState()
      .setSession("new-token", { ...user, id: "another-user" });
    release(
      new Response(JSON.stringify({ message: "Old token expired" }), {
        status: 401,
      }),
    );
    await assert.rejects(pending, /Old token expired/);
    assert.equal(useAuthStore.getState().token, "new-token");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
