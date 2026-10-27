import { StrictMode } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import usePrevious from "./usePrevious";

describe("usePrevious", () => {
  it("keeps the previous search through unrelated rerenders", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: "bottle" },
      wrapper: StrictMode,
    });
    expect(result.current).toBeUndefined();
    rerender({ value: "keys" });
    expect(result.current).toBe("bottle");
    rerender({ value: "keys" });
    expect(result.current).toBe("bottle");
    rerender({ value: "wallet" });
    expect(result.current).toBe("keys");
  });

  it("handles repeated NaN without treating it as a new value", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });
    rerender({ value: NaN });
    expect(result.current).toBe(1);
    rerender({ value: NaN });
    expect(result.current).toBe(1);
  });
});
