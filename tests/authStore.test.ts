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
  useAuthStore
    .getState()
    .setSession("signed-token", {
      id: "user-1",
      name: "Juan",
      email: "juan@example.com",
      role: "student",
      isActive: true,
    });

  const savedAuth = JSON.parse(savedValues.get("itelect4-auth-v2") ?? "null");

  assert.deepEqual(savedAuth.state, {
    token: "signed-token",
    user: {
      id: "user-1",
      name: "Juan",
      email: "juan@example.com",
      role: "student",
      isActive: true,
    },
  });
  assert.equal(savedAuth.state.setSession, undefined);
  assert.equal(savedAuth.state.logout, undefined);
});
