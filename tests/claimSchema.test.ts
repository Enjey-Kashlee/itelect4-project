import assert from "node:assert/strict";
import test from "node:test";

const { claimSchema, createClaimSchema } = await import(
  "../src/schemas/claimSchema.ts",
);

test("parses a valid item ID form value into a number", () => {
  const result = claimSchema.safeParse({ itemId: "101" });

  assert.equal(result.success, true);
  if (!result.success) {
    return;
  }

  assert.deepEqual(result.data, { itemId: 101 });
});

test("rejects a missing item ID", () => {
  const result = claimSchema.safeParse({ itemId: "" });

  assert.equal(result.success, false);
  if (result.success) {
    return;
  }

  assert.equal(result.error.issues[0]?.message, "Enter a valid item ID.");
});

test("rejects a non-whole item ID", () => {
  const result = claimSchema.safeParse({ itemId: "101.5" });

  assert.equal(result.success, false);
  if (result.success) {
    return;
  }

  assert.equal(
    result.error.issues[0]?.message,
    "Item ID must be a whole number.",
  );
});

test("rejects a non-positive item ID", () => {
  const result = claimSchema.safeParse({ itemId: "0" });

  assert.equal(result.success, false);
  if (result.success) {
    return;
  }

  assert.equal(result.error.issues[0]?.message, "Enter a valid item ID.");
});

test("accepts an item ID that exists in the available items", () => {
  const schema = createClaimSchema([101, 102]);
  const result = schema.safeParse({ itemId: "101" });

  assert.equal(result.success, true);
});

test("rejects an item ID that does not exist in the available items", () => {
  const schema = createClaimSchema([101, 102]);
  const result = schema.safeParse({ itemId: "999" });

  assert.equal(result.success, false);
  if (result.success) {
    return;
  }

  assert.equal(result.error.issues[0]?.path[0], "itemId");
  assert.equal(
    result.error.issues[0]?.message,
    "That item does not exist.",
  );
});
