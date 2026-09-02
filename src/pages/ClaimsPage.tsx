import ClaimBadge from "../components/ClaimBadge";
import { mockClaims } from "../data/mockData";

function ClaimsPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mockClaims.map((claim) => (
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
