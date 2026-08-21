import type { Item } from "../types/index";

export function findItemById(
  items: readonly Item[],
  id: string | undefined,
): Item | undefined {
  if (id === undefined) {
    return undefined;
  }

  return items.find((item) => String(item.id) === id);
}
