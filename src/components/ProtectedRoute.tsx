import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";
import { getProtectedRouteDestination } from "./protectedRouteDecision";

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const destination = getProtectedRouteDestination(token);

  if (destination !== null) {
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
