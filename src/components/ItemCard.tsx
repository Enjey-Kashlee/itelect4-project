import type { Item } from "../types/index";

interface ItemCardProps {
  item: Item;
  variant?: "default" | "compact";
}

function ItemCard({ item, variant = "default" }: ItemCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm
      dark:bg-gray-800 dark:border-gray-700 ${isCompact ? "p-3" : "p-5"}`}
    >
      <h3
        className={`font-bold text-gray-900 dark:text-white
        ${isCompact ? "text-sm" : "text-lg"}`}
      >
        {item.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Item ID: {item.id}
      </p>
      {!isCompact && (
        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Status: {item.status} -- Location: {item.location}
      </p>
    </div>
  );
}

export default ItemCard;
