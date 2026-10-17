import assert from "node:assert/strict";
import test from "node:test";
const { claimSchema, createClaimSchema } =
  await import("../src/schemas/claimSchema.ts");
const itemId = "65f000000000000000000001";
const proofDescription = "My initials are underneath.";

test("claims preserve string IDs and trim proof", () => {
  assert.deepEqual(
    claimSchema.parse({ itemId, proofDescription: `  ${proofDescription}  ` }),
    { itemId, proofDescription },
  );
});
test("claims reject missing or malformed ObjectIds", () => {
  for (const id of ["", "101", "101.5", "z".repeat(24)]) {
    assert.equal(
      claimSchema.safeParse({ itemId: id, proofDescription }).success,
      false,
    );
  }
});
test("proof requires 10 to 1000 characters after trimming", () => {
  for (const proof of ["", "short", " ".repeat(20), "x".repeat(1001)]) {
    assert.equal(
      claimSchema.safeParse({ itemId, proofDescription: proof }).success,
      false,
    );
  }
  for (const length of [10, 1000]) {
    assert.equal(
      claimSchema.safeParse({ itemId, proofDescription: "x".repeat(length) })
        .success,
      true,
    );
  }
});
test("claims require an item returned by the API", () => {
  const schema = createClaimSchema([itemId]);
  assert.equal(schema.safeParse({ itemId, proofDescription }).success, true);
  assert.equal(
    schema.safeParse({ itemId: "65f000000000000000000002", proofDescription })
      .success,
    false,
  );
});
