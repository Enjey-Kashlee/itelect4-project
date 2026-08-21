import { useNavigate, useParams } from "react-router";
import ItemCard from "../components/ItemCard";
import { findItemById } from "../data/itemLookup";
import { mockItems } from "../data/mockData";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = findItemById(mockItems, id);

  if (item === undefined) {
    return (
      <div>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          No item found with ID "{id ?? "unknown"}".
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

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {item.title}
      </h1>
      <div className="max-w-sm">
        <ItemCard item={item} />
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
