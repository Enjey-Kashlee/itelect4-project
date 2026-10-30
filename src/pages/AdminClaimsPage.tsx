import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ClaimBadge from "../components/ClaimBadge";
import { ApiError, decideClaim, fetchAdminClaims } from "../api/client";
import useAuthStore from "../store/authStore";
import type { ApiClaim } from "../types/index";

export default function AdminClaimsPage() {
  const userId = useAuthStore((state) => state.user?.id);
  const [status, setStatus] = useState<ApiClaim["status"]>("pending");
  const [decision, setDecision] = useState<{
    id: string;
    status: "approved" | "rejected";
  } | null>(null);
  const [notice, setNotice] = useState("");
  const client = useQueryClient();
  const claims = useQuery({
    queryKey: ["admin", "claims", userId, status],
    queryFn: () => fetchAdminClaims(status),
  });
  const review = useMutation({
    mutationFn: (value: { id: string; status: "approved" | "rejected" }) =>
      decideClaim(value.id, value.status),
    onSuccess: (result) => {
      setNotice(
        result.claim.status === "approved"
          ? `Claim approved. ${result.rejectedOtherClaimsCount} other pending claim${result.rejectedOtherClaimsCount === 1 ? "" : "s"} rejected.`
          : "Claim rejected.",
      );
      setDecision(null);
      void client.invalidateQueries({ queryKey: ["admin", "claims", userId] });
      void client.invalidateQueries({ queryKey: ["claims"] });
      void client.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        setDecision(null);
        void client.invalidateQueries({
          queryKey: ["admin", "claims", userId],
        });
      }
    },
  });

  return (
    <div className="text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold">Manage Claims</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Review ownership proof for items held by the campus lost and found
        office.
      </p>
      <div
        className="my-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter claims"
      >
        {(
          [
            ["pending", "Pending"],
            ["approved", "Approved"],
            ["rejected", "Rejected"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            disabled={review.isPending}
            onClick={() => {
              setStatus(value);
              setDecision(null);
              setNotice("");
              review.reset();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${status === value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {notice && (
        <p role="status" className="mb-4 text-sm">
          {notice}
        </p>
      )}
      {review.isError && (
        <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">
          {review.error.message}
        </p>
      )}
      {claims.isPending && <p role="status">Loading claims...</p>}
      {claims.isError && (
        <div role="alert">
          <p>{claims.error.message}</p>
          <Button onClick={() => void claims.refetch()}>
            Retry loading claims
          </Button>
        </div>
      )}
      {claims.data?.length === 0 && <p>No {status} claims.</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {claims.data?.map((claim) => (
          <ClaimBadge
            key={claim.id}
            claim={{
              ...claim,
              claimedAt: new Date(claim.claimedAt),
              reviewedAt: claim.reviewedAt
                ? new Date(claim.reviewedAt)
                : undefined,
            }}
            showPickup={false}
            claimantName={claim.claimant?.name ?? "Student unavailable"}
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Item status:{" "}
              {claim.item?.status === "lost"
                ? "Lost"
                : claim.item?.status === "found"
                  ? "Found"
                  : "Item unavailable"}
            </p>
            {claim.status === "pending" &&
              (decision?.id === claim.id ? (
                <div className="grid gap-3 border-t border-border pt-4">
                  <p className="text-sm">
                    {decision.status === "approved"
                      ? "Reserve this item for office pickup? Its other pending claims will be rejected. This decision is final."
                      : "Reject this claim? The item will remain open to other claims if it is Lost. This decision is final."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      disabled={review.isPending}
                      onClick={() => review.mutate(decision)}
                    >
                      {review.isPending
                        ? "Saving..."
                        : decision.status === "approved"
                          ? "Confirm approval"
                          : "Confirm rejection"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={review.isPending}
                      onClick={() => {
                        setDecision(null);
                        review.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={
                      review.isPending ||
                      !claim.claimant ||
                      claim.item?.status !== "lost"
                    }
                    onClick={() => {
                      review.reset();
                      setDecision({ id: claim.id, status: "approved" });
                    }}
                  >
                    Approve claim
                  </Button>
                  <Button
                    variant="outline"
                    disabled={review.isPending}
                    onClick={() => {
                      review.reset();
                      setDecision({ id: claim.id, status: "rejected" });
                    }}
                  >
                    Reject claim
                  </Button>
                </div>
              ))}
          </ClaimBadge>
        ))}
      </div>
    </div>
  );
}
