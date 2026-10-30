import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import App from "../App";
import useAuthStore from "../store/authStore";

const item = {
  id: "65f000000000000000000002",
  title: "Black Umbrella",
  description: "A folding umbrella with a red wrist strap.",
  location: "Student lounge",
  status: "lost",
  reportedById: "65f000000000000000000010",
  reportedBy: { id: "65f000000000000000000010", name: "Maria Santos" },
};
const student = {
  id: "65f000000000000000000011",
  name: "Alex",
  email: "alex@example.com",
  role: "student" as const,
  isActive: true,
};
const clients: QueryClient[] = [];

afterEach(() => {
  useAuthStore.getState().logout();
  clients.forEach((client) => client.clear());
  clients.length = 0;
});

function openPage(path = `/items/${item.id}`, signedIn = true) {
  if (signedIn) useAuthStore.getState().setSession("test-token", student);
  else useAuthStore.getState().logout();
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

describe("item claim flow", () => {
  it.each([true, false])(
    "does not offer claims for found items (signed in: %s)",
    async (signedIn) => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(Response.json({ ...item, status: "found" }));
      openPage(undefined, signedIn);
      expect(
        await screen.findByText("Found items can no longer be claimed."),
      ).toBeInTheDocument();
      expect(
        screen.queryByLabelText("Proof of ownership"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Log in to claim this item" }),
      ).not.toBeInTheDocument();
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    },
  );
  it("opens an item from the catalogue and submits trimmed proof for that item", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json([item]))
      .mockResolvedValueOnce(Response.json(item))
      .mockResolvedValueOnce(Response.json({ id: "claim-1" }, { status: 201 }))
      .mockResolvedValueOnce(Response.json([]));
    openPage("/items");
    await user.click(
      await screen.findByRole("link", { name: /Black Umbrella/ }),
    );
    expect(await screen.findByText("Maria Santos")).toBeInTheDocument();
    expect(screen.queryByText(/Item ID:/)).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Proof of ownership"),
      "  My initials are on the handle.  ",
    );
    await user.click(screen.getByRole("button", { name: "Submit claim" }));
    expect(
      await screen.findByRole("heading", { name: "My Claims" }),
    ).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:4000/api/claims",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          itemId: item.id,
          proofDescription: "My initials are on the handle.",
        }),
      }),
    );
    expect(
      screen.queryByLabelText("Proof of ownership"),
    ).not.toBeInTheDocument();
  });

  it("rejects short proof without sending a claim", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json(item));
    const user = userEvent.setup();
    openPage();
    await user.type(
      await screen.findByLabelText("Proof of ownership"),
      "short",
    );
    await user.click(screen.getByRole("button", { name: "Submit claim" }));
    expect(
      await screen.findByText("Describe your proof in at least 10 characters."),
    ).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("keeps the proof and displays an API failure", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json(item))
      .mockResolvedValueOnce(
        Response.json({ message: "Could not save claim." }, { status: 500 }),
      );
    const user = userEvent.setup();
    openPage();
    await user.type(
      await screen.findByLabelText("Proof of ownership"),
      "My initials are on the handle.",
    );
    await user.click(screen.getByRole("button", { name: "Submit claim" }));
    expect(
      await screen.findByText("Could not save claim."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Proof of ownership")).toHaveValue(
      "My initials are on the handle.",
    );
  });

  it.each([false, true])(
    "returns to the selected item after authentication (register: %s)",
    async (registering) => {
      const user = userEvent.setup();
      vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
        if (String(url).endsWith("/auth/register"))
          return Response.json(student, { status: 201 });
        if (String(url).endsWith("/auth/login"))
          return Response.json({ token: "test-token", user: student });
        return Response.json(item);
      });
      openPage(undefined, false);
      await user.click(
        await screen.findByRole("link", { name: "Log in to claim this item" }),
      );
      if (registering) {
        await user.click(
          screen.getByRole("link", { name: "Create an account" }),
        );
        await user.type(screen.getByLabelText("Name"), student.name);
      }
      await user.type(screen.getByLabelText("Email"), student.email);
      await user.type(screen.getByLabelText("Password"), "TestPassword123!");
      await user.click(
        screen.getByRole("button", {
          name: registering ? "Create account" : "Log In",
        }),
      );
      expect(
        await screen.findByLabelText("Proof of ownership"),
      ).toBeInTheDocument();
    },
  );

  it("disables submission while the claim request is pending", async () => {
    let finishSubmission!: (response: Response) => void;
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json(item))
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            finishSubmission = resolve;
          }),
      );
    const user = userEvent.setup();
    openPage();
    await user.type(
      await screen.findByLabelText("Proof of ownership"),
      "My initials are on the handle.",
    );
    await user.click(screen.getByRole("button", { name: "Submit claim" }));
    expect(
      screen.getByRole("button", { name: "Submitting..." }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Proof of ownership")).toBeDisabled();
    finishSubmission(
      Response.json({ message: "Please try again." }, { status: 500 }),
    );
    expect(await screen.findByText("Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit claim" })).toBeEnabled();
  });

  it("does not offer a form for an item that failed to load", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ message: "No item with that id" }, { status: 404 }),
    );
    openPage();
    expect(await screen.findByText("No item with that id")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Proof of ownership"),
    ).not.toBeInTheDocument();
  });

  it("leaves My Claims as a list and points students to the catalogue", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json([]));
    openPage("/claims");
    await waitFor(() =>
      expect(screen.getByText("You have no claims yet.")).toBeInTheDocument(),
    );
    expect(
      screen.queryByLabelText("Proof of ownership"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse items" })).toHaveAttribute(
      "href",
      "/items",
    );
  });
});
