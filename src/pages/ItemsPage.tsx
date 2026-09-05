import { useQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { Link } from "react-router";
import { fetchItems } from "../api/client";
import ItemCard from "../components/ItemCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import type { Item } from "../types/index";

function ItemsPage() {
  const { data, isPending, isError, error } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setSearchTerm(e.target.value);

  const normalizedSearchTerm = searchTerm.toLowerCase();
  const filteredItems = (data ?? []).filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedSearchTerm) ||
      String(item.id).toLowerCase().includes(normalizedSearchTerm),
  );

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500">Loading items...</div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error instanceof Error ? error.message : "Could not load items."}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Items
      </h1>
      <input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search items..."
        className="mt-4 w-full rounded border border-gray-300 bg-white p-2
        text-gray-900 placeholder-gray-400 dark:border-gray-600
        dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
      />
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Previous search: "{previousSearch}"
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="block transition hover:-translate-y-0.5"
          >
            <ItemCard item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;
