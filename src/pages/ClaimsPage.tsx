import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ClaimBadge from "../components/ClaimBadge";
import { createClaim, fetchClaims, fetchItems } from "../api/client";
import { student } from "../data/mockData";
import type {
  ClaimFormInput,
  ClaimFormValues,
} from "../schemas/claimSchema";
import { createClaimSchema } from "../schemas/claimSchema";
import type { ApiClaim, Claim, NewClaim } from "../types/index";

function ClaimsPage() {
  const queryClient = useQueryClient();

  const {
    data: claimsData,
    isPending: claimsPending,
    isError: claimsIsError,
    error: claimsError,
  } = useQuery<ApiClaim[]>({
    queryKey: ["claims"],
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
    () => createClaimSchema((items ?? []).map((item) => Number(item.id))),
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
    defaultValues: { itemId: "" },
  });

  const addClaim = useMutation<ApiClaim, Error, NewClaim>({
    mutationFn: createClaim,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["claims"] });
      reset();
    },
  });

  const handleAdd = (values: ClaimFormValues): void => {
    addClaim.mutate({
      itemId: values.itemId,
      claimantId: student.id,
      claimedAt: new Date().toISOString(),
      verified: false,
    });
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
          <Label
            htmlFor="claim-item-id"
            className="text-foreground"
          >
            Item ID
          </Label>
          <Input
            id="claim-item-id"
            type="number"
            min="1"
            step="1"
            {...register("itemId")}
            aria-describedby={
              errors.itemId ? "claim-item-id-error" : undefined
            }
            aria-invalid={errors.itemId ? true : undefined}
            placeholder="101"
          />
          {errors.itemId?.message && (
            <p id="claim-item-id-error" className="text-sm text-destructive">
              {errors.itemId.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={addClaim.isPending}
          className="justify-self-start"
        >
          {addClaim.isPending ? "Saving..." : "Add claim"}
        </Button>
      </form>

      {addClaim.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addClaim.error instanceof Error
            ? addClaim.error.message
            : "Could not save the claim."}
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
