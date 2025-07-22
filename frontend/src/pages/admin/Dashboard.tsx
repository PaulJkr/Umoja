import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../context/authStore";
import { Button } from "../../components/ui/button";
import { LogoutConfirmation } from "../../components/LogoutConfirmation";

const navItems = [
  { name: "Overview", path: "/admin/overview", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Reports", path: "/admin/reports", icon: FileBarChart },
  { name: "Approvals", path: "/admin/approvals", icon: ShieldCheck },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 240 }}
        animate={{ width: sidebarOpen ? 240 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-green-700 text-white flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-green-600">
          <span className="text-lg font-bold truncate">
            {sidebarOpen ? "Umoja Admin" : "UA"}
          </span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={name}
                onClick={() => navigate(path)}
                className={`w-full justify-start gap-2 ${
                  isActive ? "bg-green-600" : "hover:bg-green-600/60"
                }`}
                variant="ghost"
              >
                <Icon size={20} />
                {sidebarOpen && name}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-600">
          <Button
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-red-200 hover:text-red-100"
            variant="ghost"
          >
            <LogOut size={20} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="p-4 border-b bg-white shadow flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">{user?.name}</p>
          </div>
          <div>{/* Additional topbar items can go here */}</div>
        </header>

        {/* Outlet for nested routes */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      <LogoutConfirmation
        open={showLogoutModal}
        onConfirm={logout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default AdminDashboard;
