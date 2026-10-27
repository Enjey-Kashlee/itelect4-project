import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useToggle from "./useToggle";

describe("useToggle", () => {
  it.each([false, true])(
    "starts at %s and toggles back and forth",
    (initial) => {
      const { result } = renderHook(() => useToggle(initial));
      expect(result.current[0]).toBe(initial);

      act(() => result.current[1]());
      expect(result.current[0]).toBe(!initial);

      act(() => result.current[1]());
      expect(result.current[0]).toBe(initial);
    },
  );
});
