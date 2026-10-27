import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ClaimBadge from "./ClaimBadge";
import type { Claim } from "../types/index";

const claim: Claim = {
  id: "65f000000000000000000001",
  itemId: "65f000000000000000000002",
  claimantId: "65f000000000000000000003",
  claimedAt: new Date("2026-10-24T02:00:00Z"),
  proofDescription: "My initials are underneath the bottle.",
  status: "pending",
};

describe("ClaimBadge", () => {
  it.each([
    ["pending", "Pending review"],
    ["approved", "Approved"],
    ["rejected", "Rejected"],
  ] as const)("shows %s as %s", (status, text) => {
    render(<ClaimBadge claim={{ ...claim, status }} />);
    expect(screen.getByText(text, { exact: true })).toBeInTheDocument();
  });
});
