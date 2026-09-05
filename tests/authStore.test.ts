import assert from "node:assert/strict";
import test from "node:test";

const savedValues = new Map<string, string>();

const browserStorage = {
  getItem: (key: string) => savedValues.get(key) ?? null,
  setItem: (key: string, value: string) => savedValues.set(key, value),
  removeItem: (key: string) => savedValues.delete(key),
};

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: { localStorage: browserStorage },
});

const { default: useAuthStore } = await import("../src/store/authStore.ts");

test("persists the authentication identity without serializing actions", () => {
  savedValues.clear();
  useAuthStore.getState().logout();
  useAuthStore.getState().login("Juan");

  const savedAuth = JSON.parse(savedValues.get("itelect4-auth") ?? "null");

  assert.deepEqual(savedAuth.state, {
    token: "demo-token-Juan",
    userName: "Juan",
  });
  assert.equal(savedAuth.state.login, undefined);
  assert.equal(savedAuth.state.logout, undefined);
});
