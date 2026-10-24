import assert from "node:assert/strict";
import test from "node:test";
import { reviewFormSchema } from "../src/schemas/reviewSchema.ts";

test("AI review input matches the API's trimmed 20–2000 character limits", () => {
  assert.equal(
    reviewFormSchema.parse({ prompt: `  ${"a".repeat(20)}  ` }).prompt.length,
    20,
  );
  for (const prompt of [" ", "a".repeat(19), "a".repeat(2001)]) {
    assert.equal(reviewFormSchema.safeParse({ prompt }).success, false);
  }
  assert.equal(
    reviewFormSchema.safeParse({ prompt: "a".repeat(2000) }).success,
    true,
  );
});
