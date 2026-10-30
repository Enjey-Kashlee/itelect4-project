import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClaim } from "../api/client";
import { createClaimSchema } from "../schemas/claimSchema";
import type { ClaimFormInput, ClaimFormValues } from "../schemas/claimSchema";
import type { Item } from "../types/index";

function ItemClaimForm({ item }: { item: Item }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimFormInput, unknown, ClaimFormValues>({
    resolver: zodResolver(createClaimSchema([item.id])),
    mode: "onBlur",
    defaultValues: { itemId: item.id, proofDescription: "" },
  });
  const addClaim = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["claims"] });
      navigate("/claims");
    },
  });

  return (
    <section
      aria-labelledby="claim-heading"
      className="border-t border-border pt-6 text-gray-900 dark:text-white"
    >
      <h2 id="claim-heading" className="text-xl font-semibold">
        Claim this item
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Claiming {item.title}. Describe identifying details that show it belongs
        to you.
      </p>
      <form
        onSubmit={handleSubmit((values) => addClaim.mutate(values))}
        className="mt-5"
      >
        <input type="hidden" {...register("itemId")} />
        <fieldset disabled={addClaim.isPending} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="claim-proof" className="text-foreground">
              Proof of ownership
            </Label>
            <textarea
              id="claim-proof"
              rows={5}
              maxLength={1000}
              {...register("proofDescription")}
              aria-invalid={Boolean(errors.proofDescription)}
              aria-describedby="claim-proof-help claim-proof-error"
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus-visible:ring-blue-400"
            />
            <p
              id="claim-proof-help"
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              10–1000 characters. Include details only the owner would know.
            </p>
            <p
              id="claim-proof-error"
              role="alert"
              className="text-sm text-red-700 dark:text-red-300"
            >
              {errors.proofDescription?.message}
            </p>
          </div>
          {errors.itemId && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-300">
              {errors.itemId.message}
            </p>
          )}
          {addClaim.isError && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-300">
              {addClaim.error.message}
            </p>
          )}
          <Button type="submit" className="justify-self-start">
            {addClaim.isPending ? "Submitting..." : "Submit claim"}
          </Button>
        </fieldset>
      </form>
    </section>
  );
}

export default ItemClaimForm;
