import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { fetchItemById } from "../api/client";
import ItemCard from "../components/ItemCard";
import ItemClaimForm from "../components/ItemClaimForm";
import useAuthStore from "../store/authStore";
import type { Item } from "../types/index";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useAuthStore(
    (state) => state.user?.role === "security_admin",
  );
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);
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
    <div className="max-w-2xl space-y-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Item details
      </h1>
      <ItemCard item={data} />
      {location.state?.itemCreated && (
        <p role="status" className="text-gray-700 dark:text-gray-300">
          Item created. Students can now view it in the tracker.
        </p>
      )}
      {data.status === "found" ? (
        <p className="border-t border-border pt-6 text-gray-600 dark:text-gray-300">
          Found items can no longer be claimed.
        </p>
      ) : isAdmin ? (
        <p className="text-gray-600 dark:text-gray-300">
          Students can submit ownership claims for this item. Review them in{" "}
          <Link to="/admin/claims" className="underline">
            Manage Claims
          </Link>
          .
        </p>
      ) : token ? (
        <ItemClaimForm key={`${userId}:${data.id}`} item={data} />
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          <Link
            to="/login"
            state={{ from: `/items/${data.id}` }}
            className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
          >
            Log in to claim this item
          </Link>
        </p>
      )}
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
