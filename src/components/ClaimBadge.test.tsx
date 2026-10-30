import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ClaimBadge from "./ClaimBadge";
import type { Claim } from "../types/index";
import { MemoryRouter } from "react-router";

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
    render(
      <MemoryRouter>
        <ClaimBadge claim={{ ...claim, status }} />
      </MemoryRouter>,
    );
    expect(screen.getByText(text, { exact: true })).toBeInTheDocument();
  });
  it("shows the item name, location, proof and date without database IDs", () => {
    render(
      <MemoryRouter>
        <ClaimBadge
          claim={{
            ...claim,
            item: {
              id: claim.itemId,
              title: "Black Umbrella",
              location: "Student lounge",
            },
          }}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: "Black Umbrella" }),
    ).toHaveAttribute("href", `/items/${claim.itemId}`);
    expect(screen.getByText("Student lounge")).toBeInTheDocument();
    expect(screen.getByText(claim.proofDescription)).toBeInTheDocument();
    expect(
      screen.queryByText(claim.id, { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(claim.itemId, { exact: false }),
    ).not.toBeInTheDocument();
  });
  it("keeps claims readable when the item has been removed", () => {
    render(
      <MemoryRouter>
        <ClaimBadge claim={{ ...claim, item: null }} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Item unavailable")).toBeInTheDocument();
    expect(screen.getByText(claim.proofDescription)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
