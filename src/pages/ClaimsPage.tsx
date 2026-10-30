import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import ClaimBadge from "../components/ClaimBadge";
import { fetchClaims } from "../api/client";
import useAuthStore from "../store/authStore";
import type { ApiClaim, Claim } from "../types/index";

function ClaimsPage() {
  const userId = useAuthStore((state) => state.user?.id);
  const { data, isPending, isError, error } = useQuery<ApiClaim[]>({
    queryKey: ["claims", userId],
    queryFn: fetchClaims,
  });

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-600 dark:text-gray-300">
        Loading claims...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300"
      >
        {error instanceof Error ? error.message : "Could not load claims."}
      </div>
    );
  }

  const claims: Claim[] = (data ?? []).map((claim) => ({
    ...claim,
    claimedAt: new Date(claim.claimedAt),
    reviewedAt: claim.reviewedAt ? new Date(claim.reviewedAt) : undefined,
  }));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        To make a claim, open an item and describe your proof of ownership.{" "}
        <Link
          to="/items"
          className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
        >
          Browse items
        </Link>
      </p>
      {claims.length === 0 && (
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          You have no claims yet.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {claims.map((claim) => (
          <ClaimBadge key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  );
}

export default ClaimsPage;
