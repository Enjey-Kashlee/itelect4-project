import assert from "node:assert/strict";
import test from "node:test";
import { getProtectedRouteDestination } from "../src/components/protectedRouteDecision.ts";

test("redirects unauthenticated users to the login page", () => {
  assert.equal(getProtectedRouteDestination(null), "/login");
});

test("allows authenticated users to stay on the protected route", () => {
  assert.equal(getProtectedRouteDestination("demo-token-Juan"), null);
});
