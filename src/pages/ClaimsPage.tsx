import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ChangeEvent } from "react";
import ClaimBadge from "../components/ClaimBadge";
import { createClaim, fetchClaims } from "../api/client";
import { student } from "../data/mockData";
import type { ApiClaim, Claim, NewClaim } from "../types/index";

function ClaimsPage() {
  const [itemId, setItemId] = useState("");
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery<ApiClaim[]>({
    queryKey: ["claims"],
    queryFn: fetchClaims,
  });

  const addClaim = useMutation<ApiClaim, Error, NewClaim>({
    mutationFn: createClaim,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["claims"] });
      setItemId("");
    },
  });

  const parsedItemId = Number(itemId);
  const canSubmit = Number.isInteger(parsedItemId) && parsedItemId > 0;

  const handleItemIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setItemId(event.target.value);
  };

  const handleAdd = (): void => {
    if (!canSubmit) {
      return;
    }

    addClaim.mutate({
      itemId: parsedItemId,
      claimantId: student.id,
      claimedAt: new Date().toISOString(),
      verified: false,
    });
  };

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500">
        Loading claims...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error instanceof Error ? error.message : "Could not load claims."}
      </div>
    );
  }

  const claims: Claim[] = (data ?? []).map((claim) => ({
    ...claim,
    claimedAt: new Date(claim.claimedAt),
  }));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h1>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div>
          <label
            htmlFor="claim-item-id"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Item ID
          </label>
          <input
            id="claim-item-id"
            type="number"
            min="1"
            step="1"
            value={itemId}
            onChange={handleItemIdChange}
            placeholder="101"
            className="rounded border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canSubmit || addClaim.isPending}
          className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {addClaim.isPending ? "Saving..." : "Add claim"}
        </button>
      </div>

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
