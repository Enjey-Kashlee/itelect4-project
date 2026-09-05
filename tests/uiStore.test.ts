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

const { default: useUiStore } = await import("../src/store/uiStore.ts");

test("updates UI settings and persists only dark mode", () => {
  savedValues.clear();

  useUiStore.getState().toggleDarkMode();
  useUiStore.getState().setSearchTerm("laptop");

  assert.equal(useUiStore.getState().isDarkMode, true);
  assert.equal(useUiStore.getState().searchTerm, "laptop");

  const savedUiState = JSON.parse(savedValues.get("itelect4-ui") ?? "null");

  assert.deepEqual(savedUiState.state, {
    isDarkMode: true,
  });
});
