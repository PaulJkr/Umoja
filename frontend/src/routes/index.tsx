import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../components/ProtectedRoute";

// Dummy buyer sub-pages (replace with real ones)
import OverviewPage from "../pages/buyer/OverviewPage";
import OrdersPage from "../pages/buyer/OrdersPage";
import MarketplacePage from "../pages/buyer/MarketplacePage";
import ProfilePage from "../pages/buyer/ProfilePage";
import AdminDashboard from "../pages/admin/Dashboard";
import BuyerDashboard from "../pages/buyer/Dashboard";
import FarmerDashboard from "../pages/farmer/Dashboard";
import SupplierDashboard from "../pages/supplier/Dashboard";
import CalendarPage from "../pages/buyer/CalendarPage";
import MessagesPage from "../pages/buyer/MessagesPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Farmer */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Buyer */}
      <Route
        path="/buyer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<OverviewPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route index element={<Navigate to="overview" />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Supplier */}
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
