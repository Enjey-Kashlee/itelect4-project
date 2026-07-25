import { useState, useEffect, useRef } from "react";
import type { User, Item } from "./types/index";
import UserCard from "./components/UserCard";
import ItemCard from "./components/ItemCard";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";
import "./App.css";

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

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showDetails, toggleDetails] = useToggle(false);
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

  if (isLoading) return <p>Loading items...</p>;

  return (
    <div className="app">
      <input
        ref={searchInputRef}
        value={searchTerm}
        type="text"
        placeholder="Search items..."
        onChange={handleSearchChange}
      />
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p>Previous search: "{previousSearch}"</p>
      )}
      <UserCard user={student} onSelect={setSelectedUser} />
      {selectedUser && <p>Selected: {selectedUser.name}</p>}
      <button onClick={toggleDetails}>
        {showDetails ? "Hide" : "Show"} Details
      </button>
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default App;
