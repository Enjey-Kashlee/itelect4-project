import { z } from "zod";

const claimFieldsSchema = z.object({
  itemId: z.coerce
    .number()
    .int("Item ID must be a whole number.")
    .positive("Enter a valid item ID."),
});

export function createClaimSchema(existingItemIds: number[]) {
  return claimFieldsSchema.refine(
    ({ itemId }) => existingItemIds.includes(itemId),
    {
      path: ["itemId"],
      message: "That item does not exist.",
    },
  );
}

export const claimSchema = claimFieldsSchema;

export type ClaimFormInput = z.input<typeof claimSchema>;
export type ClaimFormValues = z.infer<typeof claimSchema>;
