import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../components/ProtectedRoute";
import OrdersPage from "../pages/buyer/MyOrdersPage";
import MarketplacePage from "../pages/buyer/MarketplacePage";
import ProfilePage from "../pages/buyer/ProfilePage";
import AdminDashboard from "../pages/admin/Dashboard";
import BuyerDashboard from "../pages/buyer/Dashboard";
import FarmerDashboard from "../pages/farmer/Dashboard";
import SupplierDashboard from "../pages/supplier/Dashboard";
import CalendarPage from "../pages/buyer/CalendarPage";
import MessagesPage from "../pages/buyer/MessagesPage";
import ExplorePage from "../pages/buyer/ExplorePage";
import WishlistPage from "../pages/buyer/WishlistPage"; // ✅ NEW
import Index from "../pages/Index";
import CartPage from "../pages/buyer/CartPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Farmer Dashboard */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Buyer Dashboard with nested routes */}
      <Route
        path="/buyer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="explore" />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Supplier Dashboard */}
      <Route
        path="/supplier/dashboard"
        element={
          <ProtectedRoute allowedRoles={["supplier"]}>
            <SupplierDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
