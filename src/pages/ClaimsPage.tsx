import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ClaimBadge from "../components/ClaimBadge";
import { createClaim, fetchClaims, fetchItems } from "../api/client";
import useAuthStore from "../store/authStore";
import type { ClaimFormInput, ClaimFormValues } from "../schemas/claimSchema";
import { createClaimSchema } from "../schemas/claimSchema";
import type { ApiClaim, Claim, NewClaim } from "../types/index";

function ClaimsPage() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  const {
    data: claimsData,
    isPending: claimsPending,
    isError: claimsIsError,
    error: claimsError,
  } = useQuery<ApiClaim[]>({
    queryKey: ["claims", userId],
    queryFn: fetchClaims,
  });

  const {
    data: items,
    isPending: itemsPending,
    isError: itemsIsError,
    error: itemsError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const claimValidationSchema = useMemo(
    () => createClaimSchema((items ?? []).map((item) => item.id)),
    [items],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormInput, unknown, ClaimFormValues>({
    resolver: zodResolver(claimValidationSchema),
    mode: "onBlur",
    defaultValues: { itemId: "", proofDescription: "" },
  });

  const addClaim = useMutation<ApiClaim, Error, NewClaim>({
    mutationFn: createClaim,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["claims"] });
      reset();
    },
  });

  const handleAdd = (values: ClaimFormValues): void => {
    addClaim.mutate(values);
  };

  if (claimsPending || itemsPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500">
        Loading items and claims...
      </div>
    );
  }

  if (claimsIsError || itemsIsError) {
    const loadError = claimsError ?? itemsError;

    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {loadError instanceof Error
          ? loadError.message
          : "Could not load items or claims."}
      </div>
    );
  }

  const claims: Claim[] = (claimsData ?? []).map((claim) => ({
    ...claim,
    claimedAt: new Date(claim.claimedAt),
  }));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h1>

      <form
        onSubmit={handleSubmit(handleAdd)}
        className="mb-6 grid gap-4 rounded-lg border border-border p-4"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="claim-item-id" className="text-foreground">
            Item
          </Label>
          <select
            id="claim-item-id"
            {...register("itemId")}
            aria-invalid={Boolean(errors.itemId)}
            aria-describedby={errors.itemId ? "claim-item-id-error" : undefined}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select an item</option>
            {(items ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.location})
              </option>
            ))}
          </select>
          {errors.itemId?.message && (
            <p id="claim-item-id-error" className="text-sm text-destructive">
              {errors.itemId.message}
            </p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="claim-proof">Proof of ownership</Label>
          <textarea
            id="claim-proof"
            rows={4}
            maxLength={1000}
            {...register("proofDescription")}
            aria-invalid={Boolean(errors.proofDescription)}
            aria-describedby="claim-proof-help claim-proof-error"
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <p
            id="claim-proof-help"
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            Describe identifying details that show the item belongs to you
            (10–1000 characters).
          </p>
          <p
            id="claim-proof-error"
            role="alert"
            className="text-sm text-red-700 dark:text-red-300"
          >
            {errors.proofDescription?.message}
          </p>
        </div>
        <Button
          type="submit"
          disabled={addClaim.isPending || !items?.length}
          className="justify-self-start"
        >
          {addClaim.isPending ? "Saving..." : "Add claim"}
        </Button>
      </form>

      {addClaim.isError && (
        <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">
          {addClaim.error instanceof Error
            ? addClaim.error.message
            : "Could not save the claim."}
        </p>
      )}

      {claims.length === 0 && (
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          You have no claims yet.
        </p>
      )}
      {!items?.length && (
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          No items are available yet.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {claims.map((claim) => (
          <ClaimBadge key={claim.id} claim={claim}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Claim ID: {claim.id}
            </p>
          </ClaimBadge>
        ))}
      </div>
    </div>
  );
}

export default ClaimsPage;
