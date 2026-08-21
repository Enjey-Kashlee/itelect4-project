import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router";
import ItemCard from "../components/ItemCard";
import { mockItems } from "../data/mockData";
import usePrevious from "../hooks/usePrevious";
import type { Item } from "../types/index";

function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious(searchTerm);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setItems(mockItems);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setSearchTerm(e.target.value);

  const normalizedSearchTerm = searchTerm.toLowerCase();
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedSearchTerm) ||
      String(item.id).toLowerCase().includes(normalizedSearchTerm),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 text-gray-500">Loading items...</div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Could not load items.
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Items
      </h1>
      <button
        type="button"
        onClick={() => setIsError(true)}
        className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
      >
        Simulate Error
      </button>
      <input
        ref={searchInputRef}
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
