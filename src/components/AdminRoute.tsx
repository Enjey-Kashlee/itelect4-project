import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

export default function AdminRoute() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "security_admin")
    return (
      <p role="alert" className="text-red-700 dark:text-red-300">
        Administrator access is required
      </p>
    );
  return <Outlet />;
}
