import { Link } from "react-router";
import useAuthStore from "../store/authStore";

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="max-w-2xl space-y-4 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold">Campus Lost &amp; Found</h1>
      <p>
        {user
          ? `Welcome, ${user.name}.`
          : "Browse campus item reports and submit a claim for an item that belongs to you."}
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/items"
          className="text-blue-700 underline dark:text-blue-300"
        >
          Browse items
        </Link>
        <Link
          to={user ? "/claims" : "/register"}
          className="text-blue-700 underline dark:text-blue-300"
        >
          {user ? "My claims" : "Create an account"}
        </Link>
      </div>
    </div>
  );
}
export default DashboardPage;
