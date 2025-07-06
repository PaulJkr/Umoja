import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import FarmerDashboard from "../pages/farmer/Dashboard";
import BuyerDashboard from "../pages/buyer/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import SupplierDashboard from "../pages/supplier/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Register from "../pages/auth/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
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
