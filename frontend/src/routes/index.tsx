import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import OrdersPage from "../pages/buyer/MyOrdersPage";
import MarketplacePage from "../pages/buyer/MarketplacePage";
import ProfilePage from "../pages/buyer/ProfilePage";
import AdminDashboard from "../pages/admin/Dashboard";
import BuyerDashboard from "../pages/buyer/Dashboard";
import SupplierDashboard from "../pages/supplier/Dashboard";
import CalendarPage from "../pages/buyer/CalendarPage";
import MessagesPage from "../pages/buyer/MessagesPage";
import ExplorePage from "../pages/buyer/ExplorePage";
import WishlistPage from "../pages/buyer/WishlistPage";
import Index from "../pages/Index";
import CartPage from "../pages/buyer/CartPage";
import AnalyticsPage from "../pages/farmer/AnalyticsPage";
import OverviewPage from "../pages/farmer/OverviewPage";
import ProductsPage from "../pages/farmer/ProductsPage";
import CustomersPage from "../pages/farmer/CustomersPage";
import FarmerDashboardLayout from "../layouts/FarmerDashboardLayout";
import FarmerOrdersPage from "../pages/farmer/FarmerOrdersPage";
import { FarmerCalendarPage } from "../pages/farmer/FarmerCalendarPage";
import { FarmerProfilePage } from "../pages/farmer/FarmerProfile";
import AdminOverview from "../pages/admin/overview/AdminOverview";
import AdminUsers from "../pages/admin/users/AdminUsers";
import AdminProductsPage from "../pages/admin/products/AdminProducts";
import AdminReports from "../pages/admin/reports/AdminReports";
import AdminApprovals from "../pages/admin/approvals/AdminApprovals";
import AdminSettings from "../pages/admin/settings/AdminSettings";
import NewsPage from "../pages/farmer/NewsPage";

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
            <FarmerDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<OverviewPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<FarmerOrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="calendar" element={<FarmerCalendarPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="profile" element={<FarmerProfilePage />} />
      </Route>

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
        <Route path="news" element={<NewsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Dashboard with nested routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="approvals" element={<AdminApprovals />} />
      </Route>

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
