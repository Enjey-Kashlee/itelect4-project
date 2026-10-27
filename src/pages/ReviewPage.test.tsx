import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReviewPage from "./ReviewPage";

describe("ReviewPage", () => {
  it.each(["", "short"])(
    "rejects invalid input %j without sending a request",
    async (prompt) => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockRejectedValue(new Error("Invalid input must never reach the API"));
      const user = userEvent.setup();
      const client = new QueryClient({
        defaultOptions: { mutations: { retry: false } },
      });
      render(
        <QueryClientProvider client={client}>
          <ReviewPage />
        </QueryClientProvider>,
      );

      if (prompt) {
        await user.type(
          screen.getByLabelText("Item and ownership evidence"),
          prompt,
        );
      }
      await user.click(
        screen.getByRole("button", { name: "Review my description" }),
      );

      expect(
        await screen.findByText(
          "Describe your item and ownership evidence in at least 20 characters.",
          { exact: true },
        ),
      ).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
      client.clear();
    },
  );
});
