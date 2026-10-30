import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import App from "../App";
import useAuthStore from "../store/authStore";
import type { User } from "../types/index";

const admin: User = {
  id: "65f000000000000000000010",
  name: "Office Admin",
  email: "admin@example.test",
  role: "security_admin",
  isActive: true,
};
const student: User = {
  ...admin,
  id: "65f000000000000000000011",
  name: "Student One",
  email: "student@example.test",
  role: "student",
};
const item = {
  id: "65f000000000000000000012",
  title: "Black umbrella",
  description: "A folding umbrella.",
  location: "Library",
  status: "lost",
  reportedById: student.id,
  reportedBy: { id: student.id, name: student.name },
};
const claim = {
  id: "65f000000000000000000013",
  itemId: item.id,
  claimantId: student.id,
  proofDescription: "My initials are under the handle.",
  claimedAt: "2026-10-30T02:00:00Z",
  status: "pending",
  item,
  claimant: { id: student.id, name: student.name },
};
const clients: QueryClient[] = [];

afterEach(() => {
  useAuthStore.getState().logout();
  clients.forEach((client) => client.clear());
  clients.length = 0;
});

function open(path: string, user = admin) {
  useAuthStore.getState().setSession("test-token", user);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  clients.push(client);
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("admin pages", () => {
  it("shows admin navigation and refuses student access to admin pages", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json([]));
    open("/admin/claims", student);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Administrator access is required",
    );
    expect(
      screen.queryByRole("button", { name: "Approve claim" }),
    ).not.toBeInTheDocument();
  });

  it("confirms approval before sending a decision and refreshes the list", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json([claim]))
      .mockResolvedValueOnce(
        Response.json({
          claim: { ...claim, status: "approved" },
          rejectedOtherClaimsCount: 2,
        }),
      )
      .mockResolvedValue(Response.json([]));
    open("/admin/claims");
    expect(
      screen.getByRole("link", { name: "Manage Claims" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "AI Claim Review" }),
    ).not.toBeInTheDocument();
    expect(await screen.findByText(student.name)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Approve claim" }));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/other pending claims will be rejected/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm approval" }));
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining(`/api/admin/claims/${claim.id}/status`),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "approved" }),
        }),
      ),
    );
    expect(
      await screen.findByText(/2 other pending claims rejected/),
    ).toBeInTheDocument();
  });

  it("lets the admin select a student reporter and creates an initially lost item", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json([student]))
      .mockResolvedValueOnce(Response.json(item))
      .mockResolvedValue(Response.json(item));
    open("/admin/items/new");
    await screen.findByRole("option", {
      name: `${student.name} (${student.email})`,
    });
    await user.type(screen.getByLabelText("Title"), "  Black umbrella  ");
    await user.type(
      screen.getByLabelText("Description"),
      "A folding umbrella.",
    );
    await user.type(screen.getByLabelText("Location"), "Library");
    await user.selectOptions(screen.getByLabelText("Reported by"), student.id);
    await user.click(screen.getByRole("button", { name: "Create item" }));
    expect(
      await screen.findByRole("heading", { name: "Item details" }),
    ).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/items"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          title: "Black umbrella",
          description: "A folding umbrella.",
          location: "Library",
          reportedById: student.id,
        }),
      }),
    );
    expect(
      screen.queryByLabelText("Proof of ownership"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Item created");
  });

  it("blocks creation without a reporter and preserves values when the directory is empty", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json([]));
    open("/admin/items/new");
    await user.type(screen.getByLabelText("Title"), "My item");
    expect(
      await screen.findByText(/A student must register/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create item" })).toBeDisabled();
    expect(screen.getByLabelText("Title")).toHaveValue("My item");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("shows pickup instructions only on the student's approved claim", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json([{ ...claim, status: "approved" }]),
    );
    open("/claims", student);
    expect(await screen.findByText("Ready for pickup")).toBeInTheDocument();
    expect(
      screen.getByText(/Visit the campus lost and found office/),
    ).toBeInTheDocument();
  });

  it("hides admin controls immediately when the current role is rejected by the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json(
        { message: "Administrator access is required" },
        { status: 403 },
      ),
    );
    open("/admin/claims");
    await waitFor(() => expect(useAuthStore.getState().token).toBeNull());
    expect(
      screen.queryByRole("link", { name: "Manage Claims" }),
    ).not.toBeInTheDocument();
  });

  it("refreshes a stale decision without offering to overwrite it", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json([claim]))
      .mockResolvedValueOnce(
        Response.json(
          {
            message: "This claim has already been reviewed. Refresh the list.",
          },
          { status: 409 },
        ),
      )
      .mockResolvedValue(Response.json([]));
    open("/admin/claims");
    await user.click(
      await screen.findByRole("button", { name: "Reject claim" }),
    );
    await user.click(screen.getByRole("button", { name: "Confirm rejection" }));
    expect(
      await screen.findByText(/already been reviewed/),
    ).toBeInTheDocument();
    expect(await screen.findByText("No pending claims.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Confirm rejection" }),
    ).not.toBeInTheDocument();
  });

  it("keeps entered item data when the student directory fails and is retried", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        Response.json({ message: "Directory offline" }, { status: 500 }),
      )
      .mockResolvedValueOnce(Response.json([]));
    open("/admin/items/new");
    await user.type(screen.getByLabelText("Title"), "Umbrella");
    await user.click(
      await screen.findByRole("button", { name: "Retry loading students" }),
    );
    expect(
      await screen.findByText(/A student must register/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Umbrella");
  });

  it("preserves the item form after a failed save", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json([student]))
      .mockResolvedValueOnce(
        Response.json({ message: "Could not save item" }, { status: 500 }),
      );
    open("/admin/items/new");
    await screen.findByRole("option", {
      name: `${student.name} (${student.email})`,
    });
    await user.type(screen.getByLabelText("Title"), "Umbrella");
    await user.type(
      screen.getByLabelText("Description"),
      "A folding umbrella.",
    );
    await user.type(screen.getByLabelText("Location"), "Library");
    await user.selectOptions(screen.getByLabelText("Reported by"), student.id);
    await user.click(screen.getByRole("button", { name: "Create item" }));
    expect(await screen.findByText("Could not save item")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Umbrella");
    expect(screen.getByLabelText("Reported by")).toHaveValue(student.id);
    expect(screen.getByRole("button", { name: "Create item" })).toBeEnabled();
  });

  it("does not offer decision actions or student pickup instructions in the admin reviewed view", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) =>
      Response.json(
        String(url).endsWith("status=approved")
          ? [
              {
                ...claim,
                status: "approved",
                reviewedAt: "2026-10-30T03:00:00Z",
              },
            ]
          : [],
      ),
    );
    open("/admin/claims");
    await screen.findByText("No pending claims.");
    await user.click(
      screen.getByRole("button", { name: "Approved" }),
    );
    expect(await screen.findByText(student.name)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Approve claim" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Ready for pickup")).not.toBeInTheDocument();
    expect(screen.getByText(/Reviewed at/)).toBeInTheDocument();
  });
});
