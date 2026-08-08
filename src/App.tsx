import { useState, useEffect, useRef } from "react";
import type { User, Item, Claim } from "./types/index";
import UserCard from "./components/UserCard";
import ItemCard from "./components/ItemCard";
import ClaimBadge from "./components/ClaimBadge";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

const student: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};
const mockItems: Item[] = [
  {
    id: 101,
    title: "Blue Water Bottle",
    description: "Hydro Flask with a DLSL sticker",
    status: "lost",
    location: "Library, 2nd floor",
    reportedById: student.id,
  },
  {
    id: 102,
    title: "Black Umbrella",
    description: "Folding umbrella, slightly bent handle",
    status: "found",
    location: "Cafeteria",
    reportedById: student.id,
  },
  {
    id: 103,
    title: "Student ID Card",
    description: "DLSL ID, name partly worn off",
    status: "lost",
    location: "Gymnasium entrance",
    reportedById: student.id,
  },
  {
    id: 104,
    title: "Grey Backpack",
    description: "Jansport backpack with a laptop inside",
    status: "found",
    location: "Parking Lot B",
    reportedById: student.id,
  },
  {
    id: 105,
    title: "Wired Earphones",
    description: "White earphones, tangled in a small pouch",
    status: "lost",
    location: "Room CB204",
    reportedById: student.id,
  },
];
const mockClaims: Claim[] = [
  {
    id: 1,
    itemId: 101,
    claimantId: student.id,
    claimedAt: new Date("2026-08-05T10:15:00"),
    verified: false,
  },
  {
    id: 2,
    itemId: 103,
    claimantId: student.id,
    claimedAt: new Date("2026-08-06T14:30:00"),
    verified: true,
  },
  {
    id: 3,
    itemId: 105,
    claimantId: student.id,
    claimedAt: new Date("2026-08-07T09:00:00"),
    verified: false,
  },
];

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showDetails, toggleDetails] = useToggle(false);
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const previousSearch = usePrevious(searchTerm);

  useEffect(() => {
    setTimeout(() => {
      setItems(mockItems);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearchTerm(e.target.value);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 text-gray-500">Loading items...</div>
    );
  }

  if (isError) {
    return (
      <div className="m-6 rounded-lg bg-red-50 p-4 text-red-700">
        Could not load items. Please try again.
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <button
          onClick={toggleDarkMode}
          className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white
          dark:bg-gray-200 dark:text-gray-900"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => setIsError(true)}
          className="ml-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700"
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
          <p>Previous search: "{previousSearch}"</p>
        )}

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
          {mockClaims.map((claim) => (
            <ClaimBadge key={claim.id} claim={claim} />
          ))}
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
