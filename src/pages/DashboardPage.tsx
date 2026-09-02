import { useState } from "react";
import type { User } from "../types/index";
import UserCard from "../components/UserCard";
import useToggle from "../hooks/useToggle";
import { student } from "../data/mockData";

function DashboardPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UserCard user={student} onSelect={setSelectedUser} />
        {selectedUser && (
          <p className="flex items-center text-gray-700 dark:text-gray-200">
            Selected: {selectedUser.name}
          </p>
        )}
        <button
          onClick={toggleDetails}
          className="self-start rounded bg-gray-200 px-3 py-1.5 text-sm
          font-semibold text-gray-900 transition hover:bg-gray-300
          dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {showDetails ? "Hide" : "Show"} Details
        </button>
      </div>
    </>
  );
}

export default DashboardPage;
