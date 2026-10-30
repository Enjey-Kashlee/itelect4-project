import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router";
import type { Claim } from "../types/index";

interface ClaimBadgeProps {
  claim: Claim;
  children?: React.ReactNode;
  showPickup?: boolean;
  claimantName?: string;
}

const ClaimBadge: React.FC<ClaimBadgeProps> = ({
  claim,
  children,
  showPickup = true,
  claimantName,
}) => {
  return (
    <div className="flex h-full flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-xl font-semibold">
          {claim.item ? (
            <Link
              to={`/items/${claim.itemId}`}
              className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400"
            >
              {claim.item.title}
            </Link>
          ) : (
            "Item unavailable"
          )}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${claim.status === "approved" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : claim.status === "rejected" ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}
        >
          {claim.status === "approved"
            ? "Approved"
            : claim.status === "rejected"
              ? "Rejected"
              : "Pending review"}
        </span>
      </div>
      {claimantName && (
        <p className="break-words text-sm text-gray-600 dark:text-gray-300">
          Claimant:{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {claimantName}
          </span>
        </p>
      )}
      <div>
        <p className="mb-1 text-sm font-medium">Proof of ownership</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-600 dark:text-gray-300">
          {claim.proofDescription}
        </p>
      </div>
      <div className="mt-auto grid gap-3 border-t border-gray-100 pt-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
        {claim.item && (
          <p className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span className="min-w-0 break-words">{claim.item.location}</span>
          </p>
        )}
        <p className="flex items-start gap-2">
          <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Claimed at{" "}
            <time dateTime={claim.claimedAt.toISOString()}>
              {claim.claimedAt.toLocaleString()}
            </time>
          </span>
        </p>
      </div>
      {children}
      {claim.reviewedAt && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Reviewed at{" "}
          <time dateTime={claim.reviewedAt.toISOString()}>
            {claim.reviewedAt.toLocaleString()}
          </time>
        </p>
      )}
      {showPickup && claim.status === "approved" && claim.item && (
        <div className="border-t border-border pt-4 text-sm">
          <p className="font-semibold">Ready for pickup</p>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Your claim was approved. Visit the campus lost and found office to
            collect this item.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClaimBadge;
