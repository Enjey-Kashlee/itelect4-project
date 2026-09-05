import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { fetchItemById } from "../api/client";
import ItemCard from "../components/ItemCard";
import type { Item } from "../types/index";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useQuery<Item>({
    queryKey: ["items", id],
    queryFn: () => {
      if (id === undefined) {
        throw new Error("No item ID provided");
      }

      return fetchItemById(id);
    },
    enabled: id !== undefined,
  });

  if (id === undefined) {
    return (
      <div>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          No item ID provided.
        </div>
        <button
          type="button"
          onClick={() => navigate("/items")}
          className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Items
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500">Loading item...</div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error instanceof Error ? error.message : "Could not load item."}
        </div>
        <button
          type="button"
          onClick={() => navigate("/items")}
          className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Items
        </button>
      </div>
    );
  }

  if (data === undefined) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        No item found.
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {data.title}
      </h1>
      <div className="max-w-sm">
        <ItemCard item={data} />
      </div>
      <button
        type="button"
        onClick={() => navigate("/items")}
        className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Back to Items
      </button>
    </div>
  );
}

export default ItemDetailPage;
