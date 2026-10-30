import { MapPin, UserRound } from "lucide-react";
import type { Item } from "../types/index";

interface ItemCardProps {
  item: Item;
  variant?: "default" | "compact";
}

function ItemCard({ item, variant = "default" }: ItemCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`flex h-full flex-col gap-5 rounded-xl border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${isCompact ? "p-4" : "p-6"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2
          className={`min-w-0 break-words font-semibold ${isCompact ? "text-base" : "text-xl"}`}
        >
          {item.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "found" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}
        >
          {item.status === "found" ? "Found" : "Lost"}
        </span>
      </div>
      {!isCompact && (
        <p className="break-words text-sm leading-6 text-gray-600 dark:text-gray-300">
          {item.description}
        </p>
      )}
      <div className="mt-auto grid gap-3 border-t border-gray-100 pt-4 text-sm dark:border-gray-700">
        <p className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span className="min-w-0 break-words">{item.location}</span>
        </p>
        <p className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
          <UserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span className="min-w-0 break-words">
            Reported by{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {item.reportedBy?.name ?? "Unknown reporter"}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default ItemCard;
