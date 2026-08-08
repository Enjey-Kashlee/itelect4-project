import type { Claim } from "../types/index";
interface ClaimBadgeProps {
  claim: Claim;
  children?: React.ReactNode;
}
const ClaimBadge: React.FC<ClaimBadgeProps> = ({ claim, children }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="font-bold text-gray-900 dark:text-white">
        Item: {claim.itemId}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Claimed at: {claim.claimedAt.toLocaleString()}
      </p>
      <span
        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
          claim.verified
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        }`}
      >
        {claim.verified ? "Verified" : "Not verified yet"}
      </span>
      {children}
    </div>
  );
};
export default ClaimBadge;
