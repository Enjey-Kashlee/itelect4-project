import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ItemCard from "./ItemCard";
import type { Item } from "../types/index";

const item: Item = {
  id: "65f000000000000000000002",
  title: "Black Umbrella",
  description: "A folding umbrella with a red wrist strap.",
  location: "Student lounge",
  status: "found",
  reportedById: "65f000000000000000000010",
  reportedBy: { id: "65f000000000000000000010", name: "Maria Santos" },
};

describe("ItemCard", () => {
  it("shows the reporter name, status, and location without database IDs", () => {
    render(<ItemCard item={item} />);
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("Found")).toBeInTheDocument();
    expect(screen.getByText(item.location)).toBeInTheDocument();
    expect(
      screen.queryByText(item.id, { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(item.reportedById, { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("handles a missing reporter in the compact card", () => {
    render(
      <ItemCard
        item={{ ...item, reportedBy: null, status: "lost" }}
        variant="compact"
      />,
    );
    expect(screen.getByText("Unknown reporter")).toBeInTheDocument();
    expect(screen.getByText("Lost")).toBeInTheDocument();
    expect(screen.queryByText(item.description)).not.toBeInTheDocument();
  });
});
