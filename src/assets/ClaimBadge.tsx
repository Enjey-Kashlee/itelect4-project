import type { Claim } from "../types/index";
interface ClaimBadgeProps {
    claim: Claim;
    children?: React.ReactNode;
}
const ClaimBadge: React.FC<ClaimBadgeProps> = ({
    claim,
    children,
}) => {
    return (
        <div className="claim-badge">
            <p>Item: {claim.itemId}</p>
            <p>Claimed at: {claim.claimedAt.toLocaleString()}</p>
            <p>Verified: {claim.verified ? "Yes" : "Not verified yet"}</p>
            {children}
        </div>
    );
};
export default ClaimBadge;