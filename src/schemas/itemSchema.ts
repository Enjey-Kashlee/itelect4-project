import { z } from "zod";

export const itemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Use at least 2 characters for the title.")
    .max(120, "Keep the title within 120 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Describe the item.")
    .max(1000, "Keep the description within 1000 characters."),
  location: z
    .string()
    .trim()
    .min(1, "Enter where the item was found or reported.")
    .max(200, "Keep the location within 200 characters."),
  reportedById: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Choose the student who handed in the item."),
});
