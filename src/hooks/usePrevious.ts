import { useState } from "react";

// Generic T -- works for any state type (string, number, User, etc.)
function usePrevious<T>(value: T): T | undefined {
  const [state, setState] = useState<{ current: T; previous: T | undefined }>({
    current: value,
    previous: undefined,
  });

  // Remember the last distinct value without reading a ref during render.
  if (!Object.is(state.current, value)) {
    setState({ current: value, previous: state.current });
  }

  return state.previous;
}

export default usePrevious;
