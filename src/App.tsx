import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ClaimsPage from "./pages/ClaimsPage";
import DashboardPage from "./pages/DashboardPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemsPage from "./pages/ItemsPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReviewPage from "./pages/ReviewPage";
import AdminRoute from "./components/AdminRoute";
import AdminClaimsPage from "./pages/AdminClaimsPage";
import AddItemPage from "./pages/AddItemPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="items/:id" element={<ItemDetailPage />} />
        <Route path="login" element={<LoginPage key="login" />} />
        <Route
          path="register"
          element={<LoginPage key="register" registering />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="claims" element={<ClaimsPage />} />
          <Route path="review" element={<ReviewPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="admin/claims" element={<AdminClaimsPage />} />
          <Route path="admin/items/new" element={<AddItemPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
