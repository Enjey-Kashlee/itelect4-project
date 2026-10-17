import { z } from "zod";

export const claimSchema = z.object({
  itemId: z.string().regex(/^[a-f\d]{24}$/i, "Select a valid item."),
  proofDescription: z
    .string()
    .trim()
    .min(10, "Describe your proof in at least 10 characters.")
    .max(1000, "Keep proof within 1000 characters."),
});

export function createClaimSchema(existingItemIds: string[]) {
  return claimSchema.refine(({ itemId }) => existingItemIds.includes(itemId), {
    path: ["itemId"],
    message: "That item does not exist.",
  });
}
export type ClaimFormInput = z.input<typeof claimSchema>;
export type ClaimFormValues = z.infer<typeof claimSchema>;
